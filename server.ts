import express from "express";
import path from "path";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import { createApp, configFromEnv } from "./server/app";
import { createGeminiGenerator, modelChain } from "./server/llm";
import { createFirebaseTokenVerifier, type TokenVerifier } from "./server/auth";
import { createWorkspaceRouter, createPassportPublicRouter } from "./server/workspace/routes";
import { adminApp, FirestoreRepo, CloudStorageBlobStore } from "./server/workspace/firebaseStore";
import { createSigner } from "./server/workspace/signing";
import { createGeminiVision } from "./server/workspace/vision";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

function firebaseConfig(): { projectId?: string; storageBucket?: string; firestoreDatabaseId?: string } {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
  } catch {
    return {};
  }
}

/** Accepts a PEM with real newlines, with "\n" escapes, or base64-encoded PEM. */
function readPem(raw: string | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  if (v.includes("BEGIN")) return v.replace(/\\n/g, "\n");
  try {
    const decoded = Buffer.from(v, "base64").toString("utf8");
    return decoded.includes("BEGIN") ? decoded : null;
  } catch {
    return null;
  }
}

const fb = firebaseConfig();
const projectId = process.env.FIREBASE_PROJECT_ID || fb.projectId || null;
const apiKey = process.env.GEMINI_API_KEY?.trim();
// FIREBASE_AUTH_EMULATOR_HOST is set only by the end-to-end test job. Never set it in production.
const authEmulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST);
const verifyToken: TokenVerifier | null = !projectId
  ? null
  : authEmulator
  ? async (token) => {
      const { getAuth } = await import("firebase-admin/auth");
      const d = await getAuth(adminApp(projectId, process.env.STORAGE_BUCKET || fb.storageBucket)).verifyIdToken(token);
      return { uid: d.uid, email: d.email?.toLowerCase(), emailVerified: d.email_verified === true };
    }
  : createFirebaseTokenVerifier(projectId);
if (authEmulator) console.warn("⚠ FIREBASE_AUTH_EMULATOR_HOST is set: accepting Auth-emulator tokens (test mode only)");

const pem = readPem(process.env.PASSPORT_SIGNING_KEY);
const signer = pem ? createSigner(pem) : null;
const nodeEnv = process.env.NODE_ENV;
const aiDailyLimit = Number(process.env.AI_DAILY_LIMIT) || 100;

const app = createApp({
  ...configFromEnv(process.env, {
    generator: apiKey ? createGeminiGenerator(apiKey, modelChain()) : null,
    verifyToken,
  }),
  mount: (a) => {
    a.use("/api/passport", createPassportPublicRouter(signer));
    if (!projectId || !verifyToken || process.env.WORKSPACE_ENABLED === "false") {
      console.log("Live workspace disabled (no Firebase project id or WORKSPACE_ENABLED=false)");
      return;
    }
    const bucket = process.env.STORAGE_BUCKET || fb.storageBucket;
    if (!bucket) {
      console.log("Live workspace disabled (no storage bucket)");
      return;
    }
    const fbApp = adminApp(projectId, bucket);
    a.use(
      "/api/workspace",
      createWorkspaceRouter({
        repo: FirestoreRepo.create(fbApp, authEmulator ? undefined : process.env.FIRESTORE_DATABASE_ID || fb.firestoreDatabaseId),
        blobs: new CloudStorageBlobStore(fbApp, bucket),
        verifyToken,
        vision:
          authEmulator && process.env.E2E_FAKE_VISION === "true"
            ? async () => ({ defect_present: true, defect_type: "Crack", severity: "Moderate", confidence: 0.81, location_hint: "upper wall", rationale: "E2E fake model output.", model: "e2e-fake" } as const)
            : apiKey
            ? createGeminiVision(apiKey, modelChain())
            : null,
        signer,
        adminEmails: (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
        aiDailyLimit,
      })
    );
    console.log(`Live workspace enabled · signing ${signer ? `on (key ${signer.keyId})` : "off"} · vision ${apiKey ? "on" : "off"}`);
  },
});

async function startServer() {
  if (nodeEnv !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MIRAAH server on http://0.0.0.0:${PORT} · AI ${apiKey ? "enabled" : "disabled"}`);
  });
}

startServer();
