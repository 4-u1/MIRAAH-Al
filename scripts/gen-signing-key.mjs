// Generates an Ed25519 key pair for signing passport exports.
//   node scripts/gen-signing-key.mjs
// Store the PRIVATE key only as a secret (PASSPORT_SIGNING_KEY). Never commit it or paste it in chat.
import { generateKeyPairSync } from "crypto";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const priv = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const pub = publicKey.export({ type: "spki", format: "pem" }).toString();

console.log("# PASSPORT_SIGNING_KEY (base64 of the private PEM; put this in your secret manager):");
console.log(Buffer.from(priv).toString("base64"));
console.log("\n# Public key (safe to publish; the server also serves it at /api/passport/public-key):");
console.log(pub);
