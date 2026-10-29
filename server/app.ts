import express, { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";
import { chatRequestSchema, defectRequestSchema } from "./schemas";
import { createRateLimiter } from "./rateLimit";
import { requireAuth, type TokenVerifier } from "./auth";
import type { Generator } from "./llm";
import {
  buildAssetDataBlock,
  buildChatSystemPrompt,
  buildDefectPrompt,
  templateChatReply,
  templateDefectReply,
} from "./prompts";

export interface AppConfig {
  /** Text generator, or null when no API key is configured. */
  generator: Generator | null;
  /** Verifies Firebase ID tokens. Required when requireAuth is true. */
  verifyToken: TokenVerifier | null;
  /** Require a signed-in user on /api/ai routes. Default true. */
  requireAuth: boolean;
  /** Express `trust proxy` value. "loopback" locally; 1 behind Cloud Run / one proxy. */
  trustProxy: string | number | boolean;
  burstLimit: number;
  burstWindowMs: number;
  dailyLimit: number;
  /** JSON body limit for API routes. */
  bodyLimit: string;
  now?: () => number;
}

export function parseTrustProxy(raw: string | undefined): string | number | boolean {
  const v = (raw ?? "loopback").trim();
  if (/^\d+$/.test(v)) return Number(v);
  if (v === "true") return true;
  if (v === "false") return false;
  return v;
}

export function configFromEnv(env: NodeJS.ProcessEnv, deps: Pick<AppConfig, "generator" | "verifyToken">): AppConfig {
  const int = (v: string | undefined, d: number) => (v && /^\d+$/.test(v) ? Math.max(1, Number(v)) : d);
  return {
    ...deps,
    requireAuth: (env.AI_REQUIRE_AUTH ?? "true").toLowerCase() !== "false",
    // Cloud Run (K_SERVICE is set) sits behind exactly one Google front end.
    trustProxy: parseTrustProxy(env.TRUST_PROXY ?? (env.K_SERVICE ? "1" : undefined)),
    burstLimit: int(env.AI_BURST_LIMIT, 10),
    burstWindowMs: 10_000,
    dailyLimit: int(env.AI_DAILY_LIMIT, 100),
    bodyLimit: "100kb",
  };
}

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}

/** Builds the API app (no static/Vite serving), so routes can be tested with supertest. */
export function createApp(cfg: AppConfig) {
  if (cfg.requireAuth && !cfg.verifyToken) {
    throw new Error("requireAuth is on but no token verifier is configured");
  }

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", cfg.trustProxy);
  app.use(securityHeaders);
  app.use("/api", express.json({ limit: cfg.bodyLimit }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", ai: cfg.generator ? "enabled" : "disabled", authRequired: cfg.requireAuth });
  });

  // 1) Per-IP burst limit before auth: cheap protection for token verification. No daily cap here,
  //    so unauthenticated traffic cannot use up anyone's daily quota.
  const ipLimiter = createRateLimiter({
    burstLimit: cfg.burstLimit * 3,
    burstWindowMs: cfg.burstWindowMs,
    dailyLimit: Infinity,
    now: cfg.now,
  });
  // 2) After auth: per-user burst + daily cap (per IP when auth is disabled).
  const userLimiter = createRateLimiter({
    burstLimit: cfg.burstLimit,
    burstWindowMs: cfg.burstWindowMs,
    dailyLimit: cfg.dailyLimit,
    now: cfg.now,
    key: (req) => {
      const uid = (req as Request & { user?: { uid: string } }).user?.uid;
      return uid ? `uid:${uid}` : `ip:${req.ip || req.socket.remoteAddress || "unknown"}`;
    },
  });
  const guards = [
    ipLimiter.middleware,
    ...(cfg.requireAuth && cfg.verifyToken ? [requireAuth(cfg.verifyToken)] : []),
    userLimiter.middleware,
  ];

  app.post("/api/ai/chat", ...guards, async (req, res, next) => {
    try {
      const body = chatRequestSchema.parse(req.body);
      if (!cfg.generator) {
        return res.json({ reply: templateChatReply(body.asset, body.scores, body.isArabic), source: "template", model: null });
      }
      const contents = [
        { role: "user", parts: [{ text: buildAssetDataBlock(body.asset, body.scores) }] },
        { role: "model", parts: [{ text: body.isArabic ? "تم استلام بيانات الأصل." : "Asset data received." }] },
        // Only the user's own earlier messages are forwarded. Client-sent "assistant" turns are dropped,
        // so a client cannot put words in the model's mouth.
        ...body.history
          .filter((h) => h.sender === "user")
          .slice(-6)
          .map((h) => ({ role: "user", parts: [{ text: `(earlier question) ${h.text}` }] })),
        { role: "user", parts: [{ text: body.message }] },
      ];
      try {
        const out = await cfg.generator({ system: buildChatSystemPrompt(body.isArabic), contents });
        return res.json({ reply: out.text, source: "model", model: out.model });
      } catch (err) {
        console.warn("[ai/chat] model unavailable:", (err as Error)?.message);
        return res.status(503).json({ error: "model_unavailable", message: "The AI model is temporarily unavailable." });
      }
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/ai/analyze-defect", ...guards, async (req, res, next) => {
    try {
      const body = defectRequestSchema.parse(req.body);
      if (!cfg.generator) {
        return res.json({ analysis: templateDefectReply(body.isArabic), source: "template", model: null });
      }
      const { system, contents } = buildDefectPrompt(body.defect, body.asset.name, body.isArabic);
      try {
        const out = await cfg.generator({ system, contents });
        return res.json({ analysis: out.text, source: "model", model: out.model });
      } catch (err) {
        console.warn("[ai/analyze-defect] model unavailable:", (err as Error)?.message);
        return res.status(503).json({ error: "model_unavailable", message: "The AI model is temporarily unavailable." });
      }
    } catch (err) {
      next(err);
    }
  });

  app.use("/api", (_req, res) => res.status(404).json({ error: "not_found" }));

  // Error handler: no stack traces or internals in responses.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "invalid_request", issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })) });
    }
    const e = err as { type?: string; status?: number };
    if (e?.type === "entity.too.large") return res.status(413).json({ error: "payload_too_large" });
    if (e?.type === "entity.parse.failed") return res.status(400).json({ error: "invalid_json" });
    console.error("[api] unhandled error:", err);
    return res.status(500).json({ error: "internal_error" });
  });

  const pruneTimer = setInterval(() => {
    ipLimiter.prune();
    userLimiter.prune();
  }, 10 * 60 * 1000);
  pruneTimer.unref?.();

  return app;
}
