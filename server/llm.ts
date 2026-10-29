import { GoogleGenAI } from "@google/genai";

export interface GenerateParams {
  system: string;
  contents: unknown;
}

export interface GenerateResult {
  text: string;
  model: string;
}

/** Anything that can produce text. Injected into the app so tests can use a fake. */
export type Generator = (params: GenerateParams) => Promise<GenerateResult>;

/**
 * Default model chain. IDs checked against Google's published Gemini model list (ai.google.dev, Oct 2026).
 * Override with GEMINI_MODEL (primary) and GEMINI_FALLBACK_MODEL.
 */
export function modelChain(env: NodeJS.ProcessEnv = process.env): string[] {
  const primary = env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
  const fallback = env.GEMINI_FALLBACK_MODEL?.trim() || "gemini-3.1-flash-lite";
  return Array.from(new Set([primary, fallback]));
}

export function createGeminiGenerator(apiKey: string, models: string[]): Generator {
  const ai = new GoogleGenAI({ apiKey });
  return async ({ system, contents }) => {
    let lastError: unknown = null;
    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: contents as never,
            config: { systemInstruction: system, temperature: 0.3, maxOutputTokens: 1024 },
          });
          if (response.text) return { text: response.text, model };
          break;
        } catch (err: unknown) {
          lastError = err;
          const e = err as { status?: number; code?: number };
          if ((e?.status === 503 || e?.code === 503) && attempt === 0) {
            await new Promise((r) => setTimeout(r, 600));
            continue;
          }
          break;
        }
      }
    }
    throw lastError ?? new Error("no model produced a response");
  };
}
