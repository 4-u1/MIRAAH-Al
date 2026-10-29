import type { AssetRecord, Finding as DemoFinding, CoverageArea } from "../types";
import { computeAssetScores, type ScoreResults } from "./scoring";
import { buildPassportData, type PassportData } from "./passport";

/**
 * Maps live-workspace records (server/workspace/domain.ts) onto the shapes used by the scoring
 * engine and the passport, so real assets are scored by exactly the same formulas as the demo.
 * Shared by the server (signed export) and the client (on-screen scores).
 */

export interface WsAsset {
  id: string;
  name: string;
  nameArabic?: string;
  type: AssetRecord["type"];
  city: string;
  district?: string;
  location?: string;
  sizeSqm: number;
  buildYear: number;
  valuationSar?: number;
  caseReference?: string;
  coverageAreas: { id: string; area: string; areaArabic?: string; pct: number }[];
  createdAt: string;
}

export interface WsFinding {
  id: string;
  type: DemoFinding["type"];
  severity: DemoFinding["severity"];
  area: string;
  description?: string;
  confidence: number;
  verified: boolean;
  resolved: boolean;
  evidenceIds: string[];
  createdAt: string;
}

/** Required asset-profile fields that count as "missing" in the readiness formula. */
export function missingFields(a: WsAsset): string[] {
  const out: string[] = [];
  if (!a.district) out.push("district");
  if (!a.location) out.push("location");
  if (!a.valuationSar) out.push("valuation");
  if (!a.caseReference) out.push("case reference");
  if (!a.coverageAreas.length) out.push("coverage areas");
  return out;
}

export function toAssetRecord(a: WsAsset, findings: WsFinding[]): AssetRecord {
  const demoFindings: DemoFinding[] = findings.map((f, i) => ({
    id: i + 1,
    type: f.type,
    area: f.area,
    severity: f.severity,
    conf: f.confidence,
    frames: f.evidenceIds.length,
    verified: f.verified,
    isResolved: f.resolved,
    evidence: f.evidenceIds.map((id, j) => ({
      id,
      frameUrl: "",
      thumbnailUrl: "",
      timestampSec: j,
      timestampFormatted: "",
      confidence: f.confidence / 100,
      cameraAngle: "",
      roomArea: f.area,
    })),
    description: f.description ?? "",
    recommendation: "",
    detectedAt: f.createdAt.slice(0, 10),
  }));
  const coverage: CoverageArea[] = a.coverageAreas.map((c) => ({
    id: c.id,
    area: c.area,
    areaArabic: c.areaArabic ?? "",
    pct: c.pct,
    expectedFrames: 0,
    capturedFrames: 0,
    lastInspected: "",
    status: c.pct >= 100 ? "Complete" : c.pct >= 70 ? "Partial" : c.pct > 0 ? "Incomplete" : "Not Inspected",
  }));
  const missing = missingFields(a);
  return {
    id: a.id,
    name: a.name,
    nameArabic: a.nameArabic ?? "",
    type: a.type,
    typeArabic: "",
    location: a.location ?? "",
    locationArabic: "",
    city: a.city,
    district: a.district ?? "",
    sizeSqm: a.sizeSqm,
    buildYear: a.buildYear,
    valuationSar: a.valuationSar ?? 0,
    missingFieldsCount: missing.length,
    missingFieldsList: missing,
    findings: demoFindings,
    coverageAreas: coverage,
    buyerItems: [],
    actions: [],
    inspectionDate: a.createdAt.slice(0, 10),
    inspectorName: "",
    inspectorLicense: "",
    heroImage: "",
  };
}

export function scoreWorkspaceAsset(a: WsAsset, findings: WsFinding[]): { record: AssetRecord; scores: ScoreResults } {
  const record = toAssetRecord(a, findings);
  return { record, scores: computeAssetScores(record.findings, record.coverageAreas, record.missingFieldsCount) };
}

export function workspacePassport(a: WsAsset, findings: WsFinding[]): PassportData {
  const { record, scores } = scoreWorkspaceAsset(a, findings);
  return buildPassportData(record, scores, "recorded");
}
