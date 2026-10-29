import { GoogleGenAI, Type } from "@google/genai";
import { visionSuggestionSchema, type VisionSuggestion } from "./domain";

/** Suggests a defect classification for one image. The inspector must confirm or edit it. */
export type VisionAnalyzer = (image: Buffer, mimeType: string) => Promise<VisionSuggestion & { model: string }>;

export const VISION_SYSTEM_PROMPT = `You assist a building inspector by classifying ONE photo.
Return JSON only, matching the schema. Rules:
- defect_type must be one of: Crack, Moisture, Surface Damage, Paint Peeling, or None.
- If you are not sure a defect is visible, set defect_present=false, defect_type="None", severity="None" and a low confidence.
- confidence is your probability (0-1) that the classification is correct; do not inflate it.
- Do not estimate costs, measurements in mm, or building-code compliance. Do not mention any authority.
- rationale: one or two sentences about what is visible.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    defect_present: { type: Type.BOOLEAN },
    defect_type: { type: Type.STRING, enum: ["Crack", "Moisture", "Surface Damage", "Paint Peeling", "None"] },
    severity: { type: Type.STRING, enum: ["Critical", "Moderate", "Low", "None"] },
    confidence: { type: Type.NUMBER },
    location_hint: { type: Type.STRING },
    rationale: { type: Type.STRING },
  },
  required: ["defect_present", "defect_type", "severity", "confidence", "location_hint", "rationale"],
};

export function createGeminiVision(apiKey: string, models: string[]): VisionAnalyzer {
  const ai = new GoogleGenAI({ apiKey });
  return async (image, mimeType) => {
    let lastError: unknown = null;
    for (const model of models) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [{ inlineData: { mimeType, data: image.toString("base64") } }, { text: "Classify this photo." }],
            },
          ],
          config: {
            systemInstruction: VISION_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0,
            maxOutputTokens: 2048,
          },
        });
        const parsed = visionSuggestionSchema.parse(JSON.parse(res.text ?? ""));
        return { ...normalise(parsed), model };
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError ?? new Error("vision model unavailable");
  };
}

/** Keeps the suggestion internally consistent. */
export function normalise(s: VisionSuggestion): VisionSuggestion {
  if (!s.defect_present || s.defect_type === "None" || s.severity === "None") {
    return { ...s, defect_present: false, defect_type: "None", severity: "None" };
  }
  return s;
}
