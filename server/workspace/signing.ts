import { createPrivateKey, createPublicKey, sign, verify, createHash, type KeyObject } from "crypto";
import { canonicalJson } from "../../src/utils/passport";

/**
 * Ed25519 signatures for passport exports. The signature proves the export was produced by a
 * MIRAAH server holding the private key (PASSPORT_SIGNING_KEY, PKCS#8 PEM) and has not changed since.
 * It does not make the content an official document.
 */

export interface Signer {
  keyId: string;
  publicKeyPem: string;
  sign(payload: unknown): string;
  verify(payload: unknown, signatureB64: string): boolean;
}

export function createSigner(privateKeyPem: string): Signer {
  const priv: KeyObject = createPrivateKey(privateKeyPem);
  if (priv.asymmetricKeyType !== "ed25519") throw new Error("PASSPORT_SIGNING_KEY must be an Ed25519 private key");
  const pub = createPublicKey(priv);
  const publicKeyPem = pub.export({ type: "spki", format: "pem" }).toString();
  const keyId = createHash("sha256").update(pub.export({ type: "spki", format: "der" })).digest("hex").slice(0, 16);
  return {
    keyId,
    publicKeyPem,
    sign: (payload) => sign(null, Buffer.from(canonicalJson(payload), "utf8"), priv).toString("base64"),
    verify: (payload, sig) => {
      try {
        return verify(null, Buffer.from(canonicalJson(payload), "utf8"), pub, Buffer.from(sig, "base64"));
      } catch {
        return false;
      }
    },
  };
}
