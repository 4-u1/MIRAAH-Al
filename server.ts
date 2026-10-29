import express from "express";
import path from "path";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import { createApp, configFromEnv } from "./server/app";
import { createGeminiGenerator, modelChain } from "./server/llm";
import { createFirebaseTokenVerifier } from "./server/auth";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

function firebaseProjectId(): string | null {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;
  try {
    const cfg = JSON.parse(readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
    return typeof cfg.projectId === "string" ? cfg.projectId : null;
  } catch {
    return null;
  }
}

const apiKey = process.env.GEMINI_API_KEY?.trim();
const projectId = firebaseProjectId();

const app = createApp(
  configFromEnv(process.env, {
    generator: apiKey ? createGeminiGenerator(apiKey, modelChain()) : null,
    verifyToken: projectId ? createFirebaseTokenVerifier(projectId) : null,
  })
);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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
