import express, { type Request, type Response, type NextFunction, Router } from "express";
import multer from "multer";
import { createHash, randomUUID } from "crypto";
import {
  assetCreateSchema,
  assetUpdateSchema,
  findingCreateSchema,
  findingReviewSchema,
  roleAssignSchema,
  type Asset,
  type Role,
} from "./domain";
import type { BlobStore, Repo } from "./store";
import type { Signer } from "./signing";
import type { VisionAnalyzer } from "./vision";
import { requireAuth, type TokenVerifier, type VerifiedUser } from "../auth";
import { createRateLimiter } from "../rateLimit";
import { canonicalJson, sha256Hex, type PassportData } from "../../src/utils/passport";
import { workspacePassport, scoreWorkspaceAsset } from "../../src/utils/workspaceScores";

export interface WorkspaceDeps {
  repo: Repo;
  blobs: BlobStore;
  verifyToken: TokenVerifier;
  vision: VisionAnalyzer | null;
  signer: Signer | null;
  /** Emails (lower-case) with admin rights: assign roles; also have inspector + reviewer rights. */
  adminEmails: string[];
  aiDailyLimit: number;
  now?: () => number;
}

type Ctx = { user: VerifiedUser; role: Role | null; isAdmin: boolean };
type AuthedRequest = Request & { user?: VerifiedUser; ctx?: Ctx };

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGES: Record<string, { ext: string; magic: (b: Buffer) => boolean }> = {
  "image/jpeg": { ext: "jpg", magic: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", magic: (b) => b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { ext: "webp", magic: (b) => b.length > 12 && b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
};

/** Detects the real image type from the bytes; the client-declared type is not trusted. */
export function sniffImage(b: Buffer): string | null {
  for (const [type, { magic }] of Object.entries(ALLOWED_IMAGES)) if (magic(b)) return type;
  return null;
}

class HttpError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

export function createWorkspaceRouter(d: WorkspaceDeps): Router {
  const r = Router();
  const nowIso = () => new Date(d.now ? d.now() : Date.now()).toISOString();
  const admins = new Set(d.adminEmails.map((e) => e.trim().toLowerCase()).filter(Boolean));
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_UPLOAD_BYTES, files: 1, fields: 5 } });
  const aiLimiter = createRateLimiter({
    burstLimit: 5,
    burstWindowMs: 10_000,
    dailyLimit: d.aiDailyLimit,
    now: d.now,
    key: (req) => `uid:${(req as AuthedRequest).user?.uid}`,
  });

  // Per-IP burst limit before auth protects token verification and storage reads.
  const ipLimiter = createRateLimiter({ burstLimit: 60, burstWindowMs: 10_000, dailyLimit: Infinity, now: d.now });
  r.use(ipLimiter.middleware);
  r.use(express.json({ limit: "100kb" }));
  r.use(requireAuth(d.verifyToken));

  // Resolve role. Roles are keyed by verified email and can only be set by an admin.
  r.use(async (req: AuthedRequest, res, next) => {
    try {
      const user = req.user!;
      const email = user.emailVerified && user.email ? user.email.toLowerCase() : null;
      const isAdmin = Boolean(email && admins.has(email));
      const role = email ? await d.repo.getRole(email) : null;
      req.ctx = { user, role, isAdmin };
      next();
    } catch (e) {
      next(e);
    }
  });

  const need =
    (perm: "read" | "write" | "review" | "admin") =>
    (req: AuthedRequest, _res: Response, next: NextFunction) => {
      const { role, isAdmin } = req.ctx!;
      const ok =
        isAdmin ||
        (perm === "read" && role !== null) ||
        (perm === "write" && role === "inspector") ||
        (perm === "review" && role === "reviewer");
      next(ok ? undefined : new HttpError(403, role || perm === "admin" ? "forbidden" : "no_role"));
    };

  const actor = (req: AuthedRequest) => req.ctx!.user.email ?? req.ctx!.user.uid;
  const audit = (req: AuthedRequest, assetId: string | null, action: string, target: string, details?: Record<string, unknown>) =>
    d.repo.addAudit({ assetId, action, target, actor: actor(req), at: nowIso(), details });

  const wrap =
    (fn: (req: AuthedRequest, res: Response) => Promise<unknown>) =>
    (req: Request, res: Response, next: NextFunction) =>
      fn(req as AuthedRequest, res).catch(next);

  async function loadAsset(id: string): Promise<Asset> {
    const a = await d.repo.getAsset(id);
    if (!a) throw new HttpError(404, "asset_not_found");
    return a;
  }

  // ── Identity and roles ──
  r.get(
    "/me",
    wrap(async (req, res) => {
      const { user, role, isAdmin } = req.ctx!;
      res.json({ uid: user.uid, email: user.email ?? null, emailVerified: Boolean(user.emailVerified), role, isAdmin, ai: Boolean(d.vision), signing: Boolean(d.signer) });
    })
  );
  r.get(
    "/roles",
    need("admin"),
    wrap(async (_req, res) => res.json(await d.repo.listRoles()))
  );
  r.post(
    "/roles",
    need("admin"),
    wrap(async (req, res) => {
      const body = roleAssignSchema.parse(req.body);
      await d.repo.setRole(body.email, body.role);
      await audit(req, null, "role.set", body.email, { role: body.role });
      res.json({ ok: true });
    })
  );

  // ── Assets ──
  r.get(
    "/assets",
    need("read"),
    wrap(async (_req, res) => {
      const assets = await d.repo.listAssets();
      const out = await Promise.all(
        assets.map(async (a) => {
          const findings = await d.repo.listFindings(a.id);
          const { scores } = scoreWorkspaceAsset(a, findings);
          return { ...a, findingsCount: findings.length, liquidationReadiness: scores.liquidationReadiness, riskLevel: scores.riskLevel };
        })
      );
      res.json(out);
    })
  );
  r.post(
    "/assets",
    need("write"),
    wrap(async (req, res) => {
      const body = assetCreateSchema.parse(req.body);
      const t = nowIso();
      const a = await d.repo.createAsset({ ...body, createdBy: actor(req), createdAt: t, updatedAt: t });
      await audit(req, a.id, "asset.create", a.id);
      res.status(201).json(a);
    })
  );
  r.get(
    "/assets/:id",
    need("read"),
    wrap(async (req, res) => {
      const a = await loadAsset(req.params.id);
      const [findings, evidence] = await Promise.all([d.repo.listFindings(a.id), d.repo.listEvidence(a.id)]);
      const { scores } = scoreWorkspaceAsset(a, findings);
      res.json({ asset: a, findings, evidence, scores });
    })
  );
  r.patch(
    "/assets/:id",
    need("write"),
    wrap(async (req, res) => {
      await loadAsset(req.params.id);
      const patch = assetUpdateSchema.parse(req.body);
      const a = await d.repo.updateAsset(req.params.id, { ...patch, updatedAt: nowIso() });
      await audit(req, a.id, "asset.update", a.id, { fields: Object.keys(patch) });
      res.json(a);
    })
  );
  r.get(
    "/assets/:id/audit",
    need("read"),
    wrap(async (req, res) => {
      await loadAsset(req.params.id);
      res.json(await d.repo.listAudit(req.params.id));
    })
  );

  // ── Evidence ──
  r.post(
    "/assets/:id/evidence",
    need("write"),
    (req, res, next) =>
      upload.single("file")(req, res, (err: unknown) => {
        if (err) {
          const code = (err as { code?: string }).code;
          return next(new HttpError(code === "LIMIT_FILE_SIZE" ? 413 : 400, code === "LIMIT_FILE_SIZE" ? "file_too_large" : "invalid_upload"));
        }
        next();
      }),
    wrap(async (req, res) => {
      const a = await loadAsset(req.params.id);
      const file = (req as Request & { file?: { buffer: Buffer; originalname: string } }).file;
      if (!file) throw new HttpError(400, "file_required");
      const type = sniffImage(file.buffer);
      if (!type) throw new HttpError(415, "unsupported_file_type");
      const id = randomUUID();
      const sha = createHash("sha256").update(file.buffer).digest("hex");
      const storagePath = `evidence/${a.id}/${id}.${ALLOWED_IMAGES[type].ext}`;
      await d.blobs.put(storagePath, file.buffer, type);
      const ev = await d.repo.createEvidence({
        id,
        assetId: a.id,
        storagePath,
        contentType: type,
        sizeBytes: file.buffer.length,
        sha256: sha,
        originalName: String(file.originalname || "").slice(0, 120),
        uploadedBy: actor(req),
        uploadedAt: nowIso(),
        aiSuggestion: null,
      });
      await audit(req, a.id, "evidence.upload", ev.id, { sha256: sha, bytes: ev.sizeBytes });
      res.status(201).json(ev);
    })
  );
  r.get(
    "/evidence/:id/file",
    need("read"),
    wrap(async (req, res) => {
      const ev = await d.repo.getEvidence(req.params.id);
      if (!ev) throw new HttpError(404, "evidence_not_found");
      const bytes = await d.blobs.get(ev.storagePath);
      res.setHeader("Content-Type", ev.contentType);
      res.setHeader("Cache-Control", "private, max-age=300");
      res.setHeader("Content-Disposition", "inline");
      res.send(bytes);
    })
  );
  r.post(
    "/evidence/:id/analyze",
    need("write"),
    aiLimiter.middleware,
    wrap(async (req, res) => {
      if (!d.vision) throw new HttpError(503, "ai_not_configured");
      const ev = await d.repo.getEvidence(req.params.id);
      if (!ev) throw new HttpError(404, "evidence_not_found");
      const bytes = await d.blobs.get(ev.storagePath);
      let suggestion;
      try {
        suggestion = await d.vision(bytes, ev.contentType);
      } catch (e) {
        console.warn("[vision] failed:", (e as Error)?.message);
        throw new HttpError(503, "model_unavailable");
      }
      const updated = await d.repo.updateEvidence(ev.id, {
        aiSuggestion: { ...suggestion, analyzedAt: nowIso(), analyzedBy: actor(req) },
      });
      await audit(req, ev.assetId, "evidence.analyze", ev.id, { model: suggestion.model, defect_type: suggestion.defect_type, confidence: suggestion.confidence });
      res.json(updated);
    })
  );

  // ── Findings ──
  r.post(
    "/assets/:id/findings",
    need("write"),
    wrap(async (req, res) => {
      const a = await loadAsset(req.params.id);
      const body = findingCreateSchema.parse(req.body);
      const evs = await Promise.all(body.evidenceIds.map((id) => d.repo.getEvidence(id)));
      if (evs.some((e) => !e || e.assetId !== a.id)) throw new HttpError(400, "evidence_not_on_asset");
      let confidence = 100;
      if (body.source === "ai-confirmed") {
        const s = evs.map((e) => e!.aiSuggestion).find((x) => x && x.defect_present);
        if (!s) throw new HttpError(400, "no_ai_suggestion_on_evidence");
        confidence = Math.round(s.confidence * 100);
      }
      const t = nowIso();
      const f = await d.repo.createFinding({
        ...body,
        assetId: a.id,
        confidence,
        verified: false,
        verifiedBy: null,
        resolved: false,
        resolvedBy: null,
        createdBy: actor(req),
        createdAt: t,
        updatedAt: t,
      });
      await audit(req, a.id, "finding.create", f.id, { source: f.source, severity: f.severity });
      res.status(201).json(f);
    })
  );
  for (const [path, field, byField] of [
    ["verify", "verified", "verifiedBy"],
    ["resolve", "resolved", "resolvedBy"],
  ] as const) {
    r.post(
      `/findings/:id/${path}`,
      need("review"),
      wrap(async (req, res) => {
        const f = await d.repo.getFinding(req.params.id);
        if (!f) throw new HttpError(404, "finding_not_found");
        const body = findingReviewSchema.parse(req.body);
        const updated = await d.repo.updateFinding(f.id, { [field]: body.value, [byField]: body.value ? actor(req) : null, updatedAt: nowIso() });
        await audit(req, f.assetId, `finding.${path}`, f.id, { value: body.value, note: body.note });
        res.json(updated);
      })
    );
  }

  // ── Signed passport export ──
  r.get(
    "/assets/:id/passport",
    need("read"),
    wrap(async (req, res) => {
      const a = await loadAsset(req.params.id);
      const findings = await d.repo.listFindings(a.id);
      const passport: PassportData = workspacePassport(a, findings);
      const sha = await sha256Hex(canonicalJson(passport));
      const generated_at = nowIso();
      const exp: Record<string, unknown> = {
        passport,
        fingerprint: { algorithm: "SHA-256", covers: "canonical JSON (recursively sorted keys, no whitespace) of the `passport` object", sha256: sha },
        generated_at,
      };
      if (d.signer) {
        const signed_by = { email: req.ctx!.user.email ?? null, uid: req.ctx!.user.uid };
        const payload = { passport_sha256: sha, generated_at, signed_by, key_id: d.signer.keyId };
        exp.signature = {
          algorithm: "Ed25519",
          key_id: d.signer.keyId,
          signed_by,
          covers: "canonical JSON of {passport_sha256, generated_at, signed_by, key_id}",
          value: d.signer.sign(payload),
        };
      }
      await audit(req, a.id, "passport.export", a.id, { sha256: sha, signed: Boolean(d.signer) });
      res.json(exp);
    })
  );

  r.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.code });
    next(err);
  });

  return r;
}

/** Public endpoints (no sign-in): verify a signed export and fetch the public key. */
export function createPassportPublicRouter(signer: Signer | null, now?: () => number): Router {
  const r = Router();
  const limiter = createRateLimiter({ burstLimit: 20, burstWindowMs: 10_000, dailyLimit: Infinity, now });
  r.use(limiter.middleware);
  r.use(express.json({ limit: "512kb" }));
  r.get("/public-key", (_req, res) => {
    if (!signer) return res.status(503).json({ error: "signing_not_configured" });
    res.json({ algorithm: "Ed25519", key_id: signer.keyId, public_key_pem: signer.publicKeyPem });
  });
  r.post("/verify", async (req, res) => {
    const exp = req.body as {
      passport?: unknown;
      fingerprint?: { sha256?: string };
      generated_at?: string;
      signature?: { key_id?: string; signed_by?: unknown; value?: string };
    };
    if (!exp || typeof exp !== "object" || !exp.passport || !exp.fingerprint?.sha256) {
      return res.status(400).json({ error: "not_a_passport_export" });
    }
    let fingerprintValid = false;
    try {
      fingerprintValid = (await sha256Hex(canonicalJson(exp.passport))) === exp.fingerprint.sha256;
    } catch {
      fingerprintValid = false;
    }
    let signatureValid: boolean | null = null;
    if (exp.signature) {
      signatureValid =
        Boolean(signer) &&
        exp.signature.key_id === signer!.keyId &&
        typeof exp.signature.value === "string" &&
        signer!.verify(
          { passport_sha256: exp.fingerprint.sha256, generated_at: exp.generated_at, signed_by: exp.signature.signed_by, key_id: exp.signature.key_id },
          exp.signature.value
        );
    }
    res.json({
      fingerprintValid,
      signatureValid,
      keyId: signer?.keyId ?? null,
      signedBy: exp.signature?.signed_by ?? null,
      generatedAt: exp.generated_at ?? null,
      meaning:
        "fingerprintValid: the passport data matches its SHA-256. signatureValid: this MIRAAH server's key signed that fingerprint, time and signer. Neither makes the export an official document.",
    });
  });
  return r;
}
