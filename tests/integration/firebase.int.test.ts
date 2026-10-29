/**
 * Integration test of the live workspace against the Firestore and Storage emulators, using the
 * real FirestoreRepo and CloudStorageBlobStore (firebase-admin). Skipped unless both emulators run:
 *   npx firebase-tools emulators:exec --only firestore,storage --project demo-miraah "vitest run tests/integration"
 */
import { describe, it, expect } from "vitest";
import request from "supertest";
import { generateKeyPairSync } from "crypto";
import { createApp } from "../../server/app";
import { createWorkspaceRouter, createPassportPublicRouter } from "../../server/workspace/routes";
import { adminApp, FirestoreRepo, CloudStorageBlobStore } from "../../server/workspace/firebaseStore";
import { createSigner } from "../../server/workspace/signing";
import type { TokenVerifier } from "../../server/auth";

const ready = Boolean(process.env.FIRESTORE_EMULATOR_HOST && process.env.FIREBASE_STORAGE_EMULATOR_HOST);
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

describe.skipIf(!ready)("live workspace on Firebase emulators", () => {
  it("runs the full inspection flow with real Firestore and Storage", async () => {
    const fbApp = adminApp("demo-miraah", "demo-miraah.appspot.com");
    const repo = FirestoreRepo.create(fbApp);
    const blobs = new CloudStorageBlobStore(fbApp, "demo-miraah.appspot.com");
    const users: Record<string, { uid: string; email: string; emailVerified: boolean }> = {
      admin: { uid: "a", email: "admin@example.com", emailVerified: true },
      insp: { uid: "i", email: "insp@example.com", emailVerified: true },
      rev: { uid: "r", email: "rev@example.com", emailVerified: true },
    };
    const verifyToken: TokenVerifier = async (t) => {
      if (!users[t]) throw new Error("bad");
      return users[t];
    };
    const signer = createSigner(generateKeyPairSync("ed25519").privateKey.export({ type: "pkcs8", format: "pem" }).toString());
    const vision = async () => ({ defect_present: true, defect_type: "Moisture" as const, severity: "Moderate" as const, confidence: 0.7, location_hint: "", rationale: "stain", model: "fake" });
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
        a.use("/api/workspace", createWorkspaceRouter({ repo, blobs, verifyToken, vision, signer, adminEmails: ["admin@example.com"], aiDailyLimit: 100 }));
      },
    });
    const as = (u: string) => ({ Authorization: `Bearer ${u}` });

    expect((await request(app).post("/api/workspace/roles").set(as("admin")).send({ email: "insp@example.com", role: "inspector" })).status).toBe(200);
    expect((await request(app).post("/api/workspace/roles").set(as("admin")).send({ email: "rev@example.com", role: "reviewer" })).status).toBe(200);

    const asset = await request(app)
      .post("/api/workspace/assets")
      .set(as("insp"))
      .send({ name: "Emulator Villa", type: "Residential Villa", city: "Jeddah", sizeSqm: 500, buildYear: 2015, coverageAreas: [{ id: "r", area: "Roof", pct: 80 }] });
    expect(asset.status).toBe(201);
    const id = asset.body.id;

    const ev = await request(app).post(`/api/workspace/assets/${id}/evidence`).set(as("insp")).attach("file", PNG, { filename: "a.png", contentType: "image/png" });
    expect(ev.status).toBe(201);
    const file = await request(app).get(`/api/workspace/evidence/${ev.body.id}/file`).set(as("rev")).buffer(true);
    expect(Buffer.from(file.body).equals(PNG)).toBe(true);

    expect((await request(app).post(`/api/workspace/evidence/${ev.body.id}/analyze`).set(as("insp"))).body.aiSuggestion.defect_type).toBe("Moisture");
    const f = await request(app)
      .post(`/api/workspace/assets/${id}/findings`)
      .set(as("insp"))
      .send({ type: "Moisture", severity: "Moderate", area: "Roof", evidenceIds: [ev.body.id], source: "ai-confirmed" });
    expect(f.status).toBe(201);
    expect((await request(app).post(`/api/workspace/findings/${f.body.id}/verify`).set(as("rev")).send({ value: true })).body.verified).toBe(true);

    const detail = (await request(app).get(`/api/workspace/assets/${id}`).set(as("rev"))).body;
    expect(detail.findings).toHaveLength(1);
    expect(detail.evidence).toHaveLength(1);
    expect(detail.scores.coveragePct).toBe(80);

    const exp = (await request(app).get(`/api/workspace/assets/${id}/passport`).set(as("rev"))).body;
    expect((await request(app).post("/api/passport/verify").send(exp)).body).toMatchObject({ fingerprintValid: true, signatureValid: true });

    const audit = (await request(app).get(`/api/workspace/assets/${id}/audit`).set(as("rev"))).body.map((a: { action: string }) => a.action);
    expect(audit).toEqual(["asset.create", "evidence.upload", "evidence.analyze", "finding.create", "finding.verify", "passport.export"]);
  }, 60_000);
});
