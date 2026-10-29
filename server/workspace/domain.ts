import { z } from "zod";

/** Live-workspace domain: real assets entered by inspectors (not demo data). */

export const ROLES = ["inspector", "reviewer", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const DEFECT_TYPES = ["Crack", "Moisture", "Surface Damage", "Paint Peeling"] as const;
export const SEVERITIES = ["Critical", "Moderate", "Low"] as const;
export const ASSET_TYPES = ["Residential Villa", "Commercial Tower", "Residential Compound", "Logistics Warehouse"] as const;

const text = (max: number) => z.string().trim().max(max);

export const coverageAreaSchema = z
  .object({
    id: text(40).min(1),
    area: text(120).min(1),
    areaArabic: text(120).optional().default(""),
    pct: z.number().int().min(0).max(100),
  })
  .strip();

export const assetCreateSchema = z
  .object({
    name: text(160).min(2),
    nameArabic: text(160).optional().default(""),
    type: z.enum(ASSET_TYPES),
    city: text(80).min(1),
    district: text(80).optional().default(""),
    location: text(200).optional().default(""),
    sizeSqm: z.number().positive().max(10_000_000),
    buildYear: z.number().int().min(1900).max(2100),
    valuationSar: z.number().min(0).max(1e12).optional().default(0),
    caseReference: text(80).optional().default(""),
    coverageAreas: z.array(coverageAreaSchema).max(60).optional().default([]),
  })
  .strip();

/** PATCH schema: no defaults, so fields absent from the request are never touched. */
export const assetUpdateSchema = z
  .object({
    name: text(160).min(2),
    nameArabic: text(160),
    type: z.enum(ASSET_TYPES),
    city: text(80).min(1),
    district: text(80),
    location: text(200),
    sizeSqm: z.number().positive().max(10_000_000),
    buildYear: z.number().int().min(1900).max(2100),
    valuationSar: z.number().min(0).max(1e12),
    caseReference: text(80),
    coverageAreas: z.array(coverageAreaSchema).max(60),
  })
  .partial()
  .strip();

export const findingCreateSchema = z
  .object({
    type: z.enum(DEFECT_TYPES),
    severity: z.enum(SEVERITIES),
    area: text(120).min(1),
    description: text(1000).optional().default(""),
    evidenceIds: z
      .array(text(64).min(1))
      .max(20)
      .default([])
      .transform((ids): string[] => Array.from(new Set(ids))),
    /** "ai-confirmed": inspector accepted (possibly edited) an AI suggestion on one of the evidence items. */
    source: z.enum(["manual", "ai-confirmed"]).default("manual"),
  })
  .strip();

export const findingReviewSchema = z.object({ value: z.boolean(), note: text(500).optional().default("") }).strip();

export const roleAssignSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(200),
    role: z.enum(ROLES).nullable(),
  })
  .strip();

/** What the vision model must return (validated before it is stored). */
export const visionSuggestionSchema = z
  .object({
    defect_present: z.boolean(),
    defect_type: z.enum([...DEFECT_TYPES, "None"]),
    severity: z.enum([...SEVERITIES, "None"]),
    confidence: z.number().min(0).max(1),
    location_hint: z.string().transform((v) => v.trim().slice(0, 200)),
    rationale: z.string().transform((v) => v.trim().slice(0, 600)),
  })
  .strip();

export type AssetCreate = z.infer<typeof assetCreateSchema>;
export type FindingCreate = z.infer<typeof findingCreateSchema>;
export type VisionSuggestion = z.infer<typeof visionSuggestionSchema>;
export type CoverageAreaInput = z.infer<typeof coverageAreaSchema>;

export interface Asset extends AssetCreate {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Finding extends Omit<FindingCreate, "evidenceIds" | "source" | "description"> {
  id: string;
  description: string;
  evidenceIds: string[];
  source: "manual" | "ai-confirmed";
  assetId: string;
  /** Model self-reported confidence 0–100 (uncalibrated) for ai-confirmed findings; null for manual findings. */
  confidence: number | null;
  verified: boolean;
  verifiedBy: string | null;
  resolved: boolean;
  resolvedBy: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  assetId: string;
  storagePath: string;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  originalName: string;
  uploadedBy: string;
  uploadedAt: string;
  aiSuggestion: (VisionSuggestion & { model: string; analyzedAt: string; analyzedBy: string }) | null;
}

export interface AuditEntry {
  id: string;
  assetId: string | null;
  action: string;
  target: string;
  actor: string;
  at: string;
  details?: Record<string, unknown>;
}
