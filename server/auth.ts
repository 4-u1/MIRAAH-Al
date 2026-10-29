import type { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

export interface VerifiedUser {
  uid: string;
  email?: string;
}

export type TokenVerifier = (idToken: string) => Promise<VerifiedUser>;

const GOOGLE_SECURETOKEN_JWKS =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

/**
 * Verifies a Firebase Auth ID token (RS256, Google securetoken keys) for the given project.
 * Checks signature, issuer, audience, expiry and a non-empty subject, as documented by Firebase
 * for verifying ID tokens with a third-party JWT library.
 */
export function createFirebaseTokenVerifier(
  projectId: string,
  jwks: JWTVerifyGetKey = createRemoteJWKSet(new URL(GOOGLE_SECURETOKEN_JWKS))
): TokenVerifier {
  return async (idToken: string) => {
    const { payload } = await jwtVerify(idToken, jwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ["RS256"],
    });
    if (!payload.sub) throw new Error("token has no subject");
    return { uid: payload.sub, email: typeof payload.email === "string" ? payload.email : undefined };
  };
}

/** Requires `Authorization: Bearer <Firebase ID token>`; responds 401 otherwise. */
export function requireAuth(verify: TokenVerifier) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.get("authorization") || "";
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match) {
      return res.status(401).json({ error: "auth_required", message: "Sign in to use the AI assistant." });
    }
    try {
      (req as Request & { user?: VerifiedUser }).user = await verify(match[1].trim());
      next();
    } catch {
      return res.status(401).json({ error: "invalid_token", message: "Session is invalid or expired. Sign in again." });
    }
  };
}
