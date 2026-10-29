import type { Request, Response, NextFunction } from "express";

export interface RateLimitOptions {
  /** Max requests per IP inside one burst window. */
  burstLimit: number;
  /** Burst window length in ms. */
  burstWindowMs: number;
  /** Max requests per key per day (Infinity = no daily cap). */
  dailyLimit: number;
  /** Bucket key; defaults to the client IP. */
  key?: (req: Request) => string;
  /** Injectable clock for tests. */
  now?: () => number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * In-memory per-IP limiter with a short burst window and a daily cap.
 * The client IP comes from req.ip, so it honours X-Forwarded-For only from
 * proxies that Express trusts (see the `trust proxy` setting in app.ts).
 * Single-instance only: behind several instances, use a shared store.
 */
export function createRateLimiter(opts: RateLimitOptions) {
  const now = opts.now ?? Date.now;
  const burst = new Map<string, Bucket>();
  const daily = new Map<string, Bucket>();

  function hit(map: Map<string, Bucket>, key: string, windowMs: number, t: number): Bucket {
    let b = map.get(key);
    if (!b || t >= b.resetAt) {
      b = { count: 0, resetAt: t + windowMs };
      map.set(key, b);
    }
    b.count += 1;
    return b;
  }

  function prune(): void {
    const t = now();
    for (const [k, v] of burst) if (t >= v.resetAt) burst.delete(k);
    for (const [k, v] of daily) if (t >= v.resetAt) daily.delete(k);
  }

  function middleware(req: Request, res: Response, next: NextFunction) {
    const t = now();
    const ip = opts.key ? opts.key(req) : req.ip || req.socket.remoteAddress || "unknown";

    if (Number.isFinite(opts.dailyLimit)) {
      const d = hit(daily, ip, DAY_MS, t);
      if (d.count > opts.dailyLimit) {
        res.setHeader("Retry-After", String(Math.ceil((d.resetAt - t) / 1000)));
        return res.status(429).json({ error: "daily_limit", message: "Daily AI request limit reached." });
      }
    }

    const b = hit(burst, ip, opts.burstWindowMs, t);
    if (b.count > opts.burstLimit) {
      res.setHeader("Retry-After", String(Math.ceil((b.resetAt - t) / 1000)));
      return res.status(429).json({ error: "rate_limited", message: "Too many requests. Slow down." });
    }
    next();
  }

  return { middleware, prune, _sizes: () => ({ burst: burst.size, daily: daily.size }) };
}
