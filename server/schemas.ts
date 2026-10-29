import { z } from "zod";

/**
 * Request schemas for the AI routes. Everything the client sends is untrusted:
 * fields are typed, bounded and stripped of anything not listed here.
 */

const shortText = (max: number) => z.string().trim().max(max);

export const findingSchema = z
  .object({
    id: z.union([z.number(), z.string().max(40)]).optional(),
    type: shortText(40).optional(),
    severity: z.enum(["Critical", "Moderate", "Low"]).optional(),
    area: shortText(120).optional(),
    sbcReference: shortText(40).optional(),
    repairCostSar: z.number().finite().min(0).max(1e10).optional(),
    verified: z.boolean().optional(),
    isResolved: z.boolean().optional(),
  })
  .strip();

export const assetSchema = z
  .object({
    id: shortText(40).optional(),
    name: shortText(160).optional(),
    nameArabic: shortText(160).optional(),
    type: shortText(60).optional(),
    sizeSqm: z.number().finite().min(0).max(1e8).optional(),
    valuationSar: z.number().finite().min(0).max(1e12).optional(),
    findings: z.array(findingSchema).max(50).optional(),
  })
  .strip();

export const scoresSchema = z
  .object({
    liquidationReadiness: z.number().finite().min(0).max(100).optional(),
    coveragePct: z.number().finite().min(0).max(100).optional(),
    inspectionConfidence: z.number().finite().min(0).max(100).optional(),
    conditionIndex: z.number().finite().min(0).max(100).optional(),
  })
  .strip();

export const chatRequestSchema = z
  .object({
    message: shortText(2000).min(1),
    history: z
      .array(
        z
          .object({
            sender: z.enum(["user", "ai"]),
            text: shortText(4000),
          })
          .strip()
      )
      .max(20)
      .optional()
      .default([]),
    asset: assetSchema.optional().default({}),
    scores: scoresSchema.optional().default({}),
    isArabic: z.boolean().optional().default(false),
  })
  .strip();

export const defectRequestSchema = z
  .object({
    defect: findingSchema.extend({ depthMm: z.number().finite().min(0).max(1000).optional() }),
    asset: assetSchema.optional().default({}),
    isArabic: z.boolean().optional().default(false),
  })
  .strip();

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type DefectRequest = z.infer<typeof defectRequestSchema>;
export type AssetInput = z.infer<typeof assetSchema>;
export type ScoresInput = z.infer<typeof scoresSchema>;
export type FindingInput = z.infer<typeof findingSchema>;
