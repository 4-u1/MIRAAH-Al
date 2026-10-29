import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { generateKeyPairSync, createHash } from "crypto";
import { createApp } from "../server/app";
import { createWorkspaceRouter, createPassportPublicRouter, sniffImage } from "../server/workspace/routes";
import { MemoryRepo, MemoryBlobStore } from "../server/workspace/store";
import { createSigner } from "../server/workspace/signing";
import type { VisionAnalyzer } from "../server/workspace/vision";
import type { TokenVerifier } from "../server/auth";

// 1×1 PNG
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1]);

const USERS: Record<string, { uid: string; email: string; emailVerified: boolean }> = {
  admin: { uid: "u-admin", email: "admin@example.com", emailVerified: true },
  insp: { uid: "u-insp", email: "insp@example.com", emailVerified: true },
  rev: { uid: "u-rev", email: "rev@example.com", emailVerified: true },
  view: { uid: "u-view", email: "view@example.com", emailVerified: true },
  norole: { uid: "u-x", email: "x@example.com", emailVerified: true },
  unverifiedAdmin: { uid: "u-ua", email: "admin@example.com", emailVerified: false },
};
const verifyToken: TokenVerifier = async (t) => {
  const u = USERS[t];
  if (!u) throw new Error("bad token");
  return u;
};
const as = (who: keyof typeof USERS) => ({ Authorization: `Bearer ${who}` });

const pem = generateKeyPairSync("ed25519").privateKey.export({ type: "pkcs8", format: "pem" }).toString();

function build(opts: { vision?: VisionAnalyzer | null; signed?: boolean; aiDailyLimit?: number; now?: () => number } = {}) {
  const repo = new MemoryRepo();
  const blobs = new MemoryBlobStore();
  const signer = opts.signed === false ? null : createSigner(pem);
  repo.roles.set("insp@example.com", "inspector");
  repo.roles.set("rev@example.com", "reviewer");
  repo.roles.set("view@example.com", "viewer");
  const app = createApp({
    generator: null,
    verifyToken,
    requireAuth: true,
    trustProxy: false,
    burstLimit: 100,
    burstWindowMs: 10_000,
    dailyLimit: 1000,
    bodyLimit: "100kb",
    mount: (a) => {
      a.use("/api/passport", createPassportPublicRouter(signer));
      a.use(
        "/api/workspace",
        createWorkspaceRouter({
          repo,
          blobs,
          verifyToken,
          vision: opts.vision ?? null,
          signer,
          adminEmails: ["admin@example.com"],
          aiDailyLimit: opts.aiDailyLimit ?? 100,
          now: opts.now,
        })
      );
    },
  });
  return { app, repo, blobs };
}

const assetBody = {
  name: "Test Tower",
  type: "Commercial Tower",
  city: "Riyadh",
  district: "Olaya",
  location: "King Fahd Rd",
  sizeSqm: 2000,
  buildYear: 2012,
  valuationSar: 10_000_000,
  caseReference: "CASE-1",
  coverageAreas: [
    { id: "a1", area: "Roof", pct: 60 },
    { id: "a2", area: "Basement", pct: 100 },
  ],
};

async function newAsset(app: ReturnType<typeof build>["app"]) {
  const res = await request(app).post("/api/workspace/assets").set(as("insp")).send(assetBody);
  expect(res.status).toBe(201);
  return res.body.id as string;
}

async function upload(app: ReturnType<typeof build>["app"], assetId: string, who: keyof typeof USERS = "insp", bytes = PNG, name = "roof.png") {
  return request(app).post(`/api/workspace/assets/${assetId}/evidence`).set(as(who)).attach("file", bytes, { filename: name, contentType: "image/png" });
}

describe("identity and roles", () => {
  it("requires sign-in", async () => {
    const { app } = build();
    expect((await request(app).get("/api/workspace/assets")).status).toBe(401);
  });
  it("signed-in users without a role get 403 no_role", async () => {
    const { app } = build();
    const res = await request(app).get("/api/workspace/assets").set(as("norole"));
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("no_role");
  });
  it("reports identity and capabilities", async () => {
    const { app } = build();
    const me = (await request(app).get("/api/workspace/me").set(as("insp"))).body;
    expect(me).toMatchObject({ email: "insp@example.com", role: "inspector", isAdmin: false, ai: false, signing: true });
  });
  it("admin rights need a verified email", async () => {
    const { app } = build();
    expect((await request(app).get("/api/workspace/me").set(as("unverifiedAdmin"))).body.isAdmin).toBe(false);
    expect((await request(app).get("/api/workspace/roles").set(as("unverifiedAdmin"))).status).toBe(403);
    expect((await request(app).get("/api/workspace/me").set(as("admin"))).body.isAdmin).toBe(true);
  });
  it("only admins assign roles, and assignments take effect", async () => {
    const { app, repo } = build();
    expect((await request(app).post("/api/workspace/roles").set(as("insp")).send({ email: "x@example.com", role: "viewer" })).status).toBe(403);
    expect((await request(app).post("/api/workspace/roles").set(as("admin")).send({ email: "X@Example.com", role: "viewer" })).status).toBe(200);
    expect(await repo.getRole("x@example.com")).toBe("viewer");
    expect((await request(app).get("/api/workspace/assets").set(as("norole"))).status).toBe(200);
    expect((await request(app).post("/api/workspace/roles").set(as("admin")).send({ email: "x@example.com", role: null })).status).toBe(200);
    expect((await request(app).get("/api/workspace/assets").set(as("norole"))).status).toBe(403);
    expect((await request(app).post("/api/workspace/roles").set(as("admin")).send({ email: "x@example.com", role: "owner" })).status).toBe(400);
  });
});

describe("assets", () => {
  it("inspectors create; reviewers and viewers cannot", async () => {
    const { app } = build();
    expect((await request(app).post("/api/workspace/assets").set(as("view")).send(assetBody)).status).toBe(403);
    expect((await request(app).post("/api/workspace/assets").set(as("rev")).send(assetBody)).status).toBe(403);
    const id = await newAsset(app);
    const list = (await request(app).get("/api/workspace/assets").set(as("view"))).body;
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id, name: "Test Tower", findingsCount: 0 });
  });
  it("validates input", async () => {
    const { app } = build();
    expect((await request(app).post("/api/workspace/assets").set(as("insp")).send({ ...assetBody, type: "Castle" })).status).toBe(400);
    expect((await request(app).post("/api/workspace/assets").set(as("insp")).send({ ...assetBody, sizeSqm: -1 })).status).toBe(400);
    expect((await request(app).post("/api/workspace/assets").set(as("insp")).send({ ...assetBody, coverageAreas: [{ id: "a", area: "R", pct: 150 }] })).status).toBe(400);
  });
  it("404 for unknown assets", async () => {
    const { app } = build();
    expect((await request(app).get("/api/workspace/assets/nope").set(as("view"))).status).toBe(404);
  });
  it("records who created it, and edits are audited", async () => {
    const { app } = build();
    const id = await newAsset(app);
    await request(app).patch(`/api/workspace/assets/${id}`).set(as("insp")).send({ district: "Malqa" });
    const detail = (await request(app).get(`/api/workspace/assets/${id}`).set(as("view"))).body;
    expect(detail.asset.createdBy).toBe("insp@example.com");
    expect(detail.asset.district).toBe("Malqa");
    const audit = (await request(app).get(`/api/workspace/assets/${id}/audit`).set(as("view"))).body;
    expect(audit.map((a: { action: string }) => a.action)).toEqual(["asset.create", "asset.update"]);
  });
});

describe("evidence upload", () => {
  it("stores the image, records its SHA-256, and serves it back to readers only", async () => {
    const { app, blobs } = build();
    const id = await newAsset(app);
    const res = await upload(app, id);
    expect(res.status).toBe(201);
    expect(res.body.sha256).toBe(createHash("sha256").update(PNG).digest("hex"));
    expect(res.body.contentType).toBe("image/png");
    expect(blobs.files.get(res.body.storagePath)?.equals(PNG)).toBe(true);
    const file = await request(app).get(`/api/workspace/evidence/${res.body.id}/file`).set(as("view")).buffer(true);
    expect(file.status).toBe(200);
    expect(file.headers["content-type"]).toBe("image/png");
    expect((await request(app).get(`/api/workspace/evidence/${res.body.id}/file`)).status).toBe(401);
    expect((await request(app).get(`/api/workspace/evidence/${res.body.id}/file`).set(as("norole"))).status).toBe(403);
  });
  it("detects the real type from the bytes, not the declared type", async () => {
    const { app } = build();
    const id = await newAsset(app);
    const res = await upload(app, id, "insp", Buffer.from("<script>alert(1)</script>"), "evil.png");
    expect(res.status).toBe(415);
    expect(sniffImage(JPG)).toBe("image/jpeg");
    expect(sniffImage(PNG)).toBe("image/png");
  });
  it("rejects files over 8 MB and uploads by non-inspectors", async () => {
    const { app } = build();
    const id = await newAsset(app);
    const big = Buffer.concat([PNG, Buffer.alloc(8 * 1024 * 1024)]);
    expect((await upload(app, id, "insp", big)).status).toBe(413);
    expect((await upload(app, id, "view")).status).toBe(403);
  });
});

describe("AI suggestion and findings", () => {
  const vision: VisionAnalyzer = async () => ({
    defect_present: true,
    defect_type: "Crack",
    severity: "Moderate",
    confidence: 0.82,
    location_hint: "upper left",
    rationale: "Visible hairline crack.",
    model: "gemini-test",
  });

  it("returns 503 when no vision model is configured", async () => {
    const { app } = build();
    const id = await newAsset(app);
    const ev = (await upload(app, id)).body;
    expect((await request(app).post(`/api/workspace/evidence/${ev.id}/analyze`).set(as("insp"))).status).toBe(503);
  });

  it("stores the model's suggestion; the inspector confirms it as a finding", async () => {
    const { app } = build({ vision });
    const id = await newAsset(app);
    const ev = (await upload(app, id)).body;
    const analyzed = (await request(app).post(`/api/workspace/evidence/${ev.id}/analyze`).set(as("insp"))).body;
    expect(analyzed.aiSuggestion).toMatchObject({ defect_type: "Crack", model: "gemini-test", analyzedBy: "insp@example.com" });
    const f = await request(app)
      .post(`/api/workspace/assets/${id}/findings`)
      .set(as("insp"))
      .send({ type: "Crack", severity: "Critical", area: "Roof", evidenceIds: [ev.id], source: "ai-confirmed" });
    expect(f.status).toBe(201);
    expect(f.body).toMatchObject({ confidence: 82, source: "ai-confirmed", severity: "Critical", verified: false });
  });

  it("ai-confirmed requires an actual suggestion; manual findings get confidence 100", async () => {
    const { app } = build();
    const id = await newAsset(app);
    const ev = (await upload(app, id)).body;
    expect(
      (await request(app).post(`/api/workspace/assets/${id}/findings`).set(as("insp")).send({ type: "Crack", severity: "Low", area: "Roof", evidenceIds: [ev.id], source: "ai-confirmed" })).body.error
    ).toBe("no_ai_suggestion_on_evidence");
    const f = await request(app).post(`/api/workspace/assets/${id}/findings`).set(as("insp")).send({ type: "Moisture", severity: "Low", area: "Kitchen", evidenceIds: [ev.id] });
    expect(f.body.confidence).toBe(100);
  });

  it("evidence must belong to the same asset", async () => {
    const { app } = build();
    const a1 = await newAsset(app);
    const a2 = await newAsset(app);
    const ev = (await upload(app, a1)).body;
    const res = await request(app).post(`/api/workspace/assets/${a2}/findings`).set(as("insp")).send({ type: "Crack", severity: "Low", area: "Roof", evidenceIds: [ev.id] });
    expect(res.body.error).toBe("evidence_not_on_asset");
  });

  it("only reviewers verify or resolve, and scores update", async () => {
    const { app } = build();
    const id = await newAsset(app);
    const f = (await request(app).post(`/api/workspace/assets/${id}/findings`).set(as("insp")).send({ type: "Crack", severity: "Critical", area: "Roof" })).body;
    const before = (await request(app).get(`/api/workspace/assets/${id}`).set(as("view"))).body.scores;
    expect(before.riskLevel).toBe("High");
    expect((await request(app).post(`/api/workspace/findings/${f.id}/verify`).set(as("insp")).send({ value: true })).status).toBe(403);
    const v = (await request(app).post(`/api/workspace/findings/${f.id}/verify`).set(as("rev")).send({ value: true })).body;
    expect(v).toMatchObject({ verified: true, verifiedBy: "rev@example.com" });
    await request(app).post(`/api/workspace/findings/${f.id}/resolve`).set(as("rev")).send({ value: true, note: "repaired" });
    const after = (await request(app).get(`/api/workspace/assets/${id}`).set(as("view"))).body.scores;
    expect(after.conditionIndex).toBe(100);
    expect(after.liquidationReadiness).toBeGreaterThan(before.liquidationReadiness);
  });

  it("per-user daily cap on AI analysis", async () => {
    let t = 0;
    const { app } = build({ vision, aiDailyLimit: 1, now: () => t });
    const id = await newAsset(app);
    const ev = (await upload(app, id)).body;
    expect((await request(app).post(`/api/workspace/evidence/${ev.id}/analyze`).set(as("insp"))).status).toBe(200);
    t += 60_000;
    expect((await request(app).post(`/api/workspace/evidence/${ev.id}/analyze`).set(as("insp"))).status).toBe(429);
  });
});

describe("signed passport export", () => {
  async function exportFor(app: ReturnType<typeof build>["app"]) {
    const id = await newAsset(app);
    await request(app).post(`/api/workspace/assets/${id}/findings`).set(as("insp")).send({ type: "Crack", severity: "Moderate", area: "Roof" });
    const res = await request(app).get(`/api/workspace/assets/${id}/passport`).set(as("view"));
    expect(res.status).toBe(200);
    return res.body;
  }

  it("is built from server data, labelled 'recorded', and signed", async () => {
    const { app } = build();
    const exp = await exportFor(app);
    expect(exp.passport.data_status).toBe("recorded");
    expect(exp.passport.disclaimer).toMatch(/Not an official document/);
    expect(exp.passport.findings).toHaveLength(1);
    expect(exp.signature).toMatchObject({ algorithm: "Ed25519", signed_by: { email: "view@example.com" } });
    const v = (await request(app).post("/api/passport/verify").send(exp)).body;
    expect(v).toMatchObject({ fingerprintValid: true, signatureValid: true });
  });

  it("detects edits to the data, the signer or the time", async () => {
    const { app } = build();
    const exp = await exportFor(app);
    const t1 = structuredClone(exp);
    t1.passport.scores.liquidation_readiness_index = 99;
    expect((await request(app).post("/api/passport/verify").send(t1)).body.fingerprintValid).toBe(false);

    // Re-hash the edited data: the fingerprint matches again, but the signature does not.
    const t2 = structuredClone(t1);
    const { canonicalJson, sha256Hex } = await import("../src/utils/passport");
    t2.fingerprint.sha256 = await sha256Hex(canonicalJson(t2.passport));
    const r2 = (await request(app).post("/api/passport/verify").send(t2)).body;
    expect(r2).toMatchObject({ fingerprintValid: true, signatureValid: false });

    const t3 = structuredClone(exp);
    t3.signature.signed_by.email = "boss@example.com";
    expect((await request(app).post("/api/passport/verify").send(t3)).body.signatureValid).toBe(false);

    const t4 = structuredClone(exp);
    t4.generated_at = "2020-01-01T00:00:00.000Z";
    expect((await request(app).post("/api/passport/verify").send(t4)).body.signatureValid).toBe(false);
  });

  it("without a signing key: no signature, and verify reports signatureValid=null", async () => {
    const { app } = build({ signed: false });
    const exp = await exportFor(app);
    expect(exp.signature).toBeUndefined();
    expect((await request(app).post("/api/passport/verify").send(exp)).body).toMatchObject({ fingerprintValid: true, signatureValid: null });
    expect((await request(app).get("/api/passport/public-key")).status).toBe(503);
  });

  it("publishes the public key", async () => {
    const { app } = build();
    const k = (await request(app).get("/api/passport/public-key")).body;
    expect(k.public_key_pem).toMatch(/BEGIN PUBLIC KEY/);
    expect(k.key_id).toMatch(/^[0-9a-f]{16}$/);
  });

  it("rejects non-exports", async () => {
    const { app } = build();
    expect((await request(app).post("/api/passport/verify").send({ hello: 1 })).status).toBe(400);
  });
});
