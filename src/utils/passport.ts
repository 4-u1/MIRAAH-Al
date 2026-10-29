import type { AssetRecord } from "../types";
import type { ScoreResults } from "./scoring";

/**
 * Single source of truth for every passport export (JSON, CSV, PDF cover).
 *
 * Fingerprint: SHA-256 over the canonical JSON (sorted keys, no whitespace) of `PassportData`.
 * It proves the exported data has not changed since export. It does NOT prove who produced it,
 * that the data is correct, or any official approval; it is not a signature or a registration.
 */

export const PASSPORT_SCHEMA = "miraah-passport/1.0";
/** Recorded (live-workspace) exports add evidence hashes, finding sources and reviewers. */
export const PASSPORT_SCHEMA_RECORDED = "miraah-passport/1.1";

export interface PassportFinding {
  id: number;
  type: string;
  severity: string;
  area: string;
  /** Model self-reported confidence (uncalibrated); null for manual findings in recorded exports. */
  confidence_pct: number | null;
  verified_by_inspector: boolean;
  resolved: boolean;
  evidence_frames: number;
  // Recorded exports only (schema 1.1)
  finding_id?: string;
  source?: "manual" | "ai-confirmed";
  verified_by?: string | null;
  resolved_by?: string | null;
  evidence_sha256?: string[];
}

export interface PassportData {
  schema: string;
  /** "demo" = bundled demo data; "recorded" = entered by signed-in inspectors in the live workspace. */
  data_status: "demo" | "recorded";
  disclaimer: string;
  asset: {
    id: string;
    name: string;
    name_ar: string;
    type: string;
    city: string;
    district: string;
    size_sqm: number;
    build_year: number;
    entered_valuation_sar: number;
    inspection_date: string;
    case_reference?: string;
  };
  scores: {
    liquidation_readiness_index: number;
    condition_index: number;
    inspection_coverage_pct: number;
    inspection_confidence: number;
    risk_level: string;
  };
  findings_summary: {
    total: number;
    unresolved: number;
    critical: number;
    moderate: number;
    low: number;
    evidence_frames: number;
  };
  findings: PassportFinding[];
}

export const PASSPORT_DISCLAIMER =
  "Prototype export with demo data. Not an official document of Infath or any government body; not a certified inspection or valuation.";

export const PASSPORT_DISCLAIMER_RECORDED =
  "Export of inspection data recorded in MIRAAH by signed-in users. Not an official document of Infath or any government body; not a certified inspection or valuation. Findings marked verified were verified by a MIRAAH reviewer account, not by a licensed authority.";

export function buildPassportData(
  asset: AssetRecord,
  scores: ScoreResults,
  status: PassportData["data_status"] = "demo"
): PassportData {
  return {
    schema: PASSPORT_SCHEMA,
    data_status: status,
    disclaimer: status === "demo" ? PASSPORT_DISCLAIMER : PASSPORT_DISCLAIMER_RECORDED,
    asset: {
      id: asset.id,
      name: asset.name,
      name_ar: asset.nameArabic,
      type: asset.type,
      city: asset.city,
      district: asset.district,
      size_sqm: asset.sizeSqm,
      build_year: asset.buildYear,
      entered_valuation_sar: asset.valuationSar,
      inspection_date: asset.inspectionDate,
    },
    scores: {
      liquidation_readiness_index: scores.liquidationReadiness,
      condition_index: scores.conditionIndex,
      inspection_coverage_pct: scores.coveragePct,
      inspection_confidence: scores.inspectionConfidence,
      risk_level: scores.riskLevel,
    },
    findings_summary: {
      total: scores.totalFindings,
      unresolved: scores.unresolvedCount,
      critical: scores.criticalCount,
      moderate: scores.moderateCount,
      low: scores.lowCount,
      evidence_frames: scores.totalEvidenceFrames,
    },
    findings: asset.findings.map((f) => ({
      id: f.id,
      type: f.type,
      severity: f.severity,
      area: f.area,
      confidence_pct: f.conf,
      verified_by_inspector: f.verified,
      resolved: f.isResolved,
      evidence_frames: f.evidence?.length ?? 0,
    })),
  };
}

/** Deterministic JSON: object keys sorted recursively, no whitespace. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new Error("canonicalJson: non-finite number");
    }
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`).join(",")}}`;
}

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function fingerprintPassport(data: PassportData): Promise<string> {
  return sha256Hex(canonicalJson(data));
}

export interface PassportExport {
  passport: PassportData;
  fingerprint: {
    algorithm: "SHA-256";
    covers: string;
    sha256: string;
  };
  generated_at: string;
}

export async function buildPassportExport(data: PassportData, now: Date = new Date()): Promise<PassportExport> {
  return {
    passport: data,
    fingerprint: {
      algorithm: "SHA-256",
      covers: "canonical JSON (recursively sorted keys, no whitespace) of the `passport` object",
      sha256: await fingerprintPassport(data),
    },
    generated_at: now.toISOString(),
  };
}

/** Recomputes the fingerprint of an export and compares it with the stored one. */
export async function verifyPassportExport(exp: PassportExport): Promise<boolean> {
  return (await fingerprintPassport(exp.passport)) === exp.fingerprint.sha256;
}

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  // Neutralise spreadsheet formula injection, then quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export const CSV_HEADERS = [
  "asset_id",
  "asset_name",
  "asset_name_ar",
  "liquidation_readiness_index",
  "condition_index",
  "inspection_coverage_pct",
  "inspection_confidence",
  "risk_level",
  "finding_id",
  "finding_type",
  "severity",
  "area",
  "confidence_pct",
  "verified_by_inspector",
  "resolved",
  "evidence_frames",
  "data_status",
  "passport_sha256",
] as const;

/** CSV built from the same PassportData as the JSON export, so the numbers always match. */
export function buildPassportCsv(data: PassportData, sha256: string): string {
  const base = [
    data.asset.id,
    data.asset.name,
    data.asset.name_ar,
    data.scores.liquidation_readiness_index,
    data.scores.condition_index,
    data.scores.inspection_coverage_pct,
    data.scores.inspection_confidence,
    data.scores.risk_level,
  ];
  const rows = (data.findings.length ? data.findings : [null]).map((f) => [
    ...base,
    f?.id ?? "",
    f?.type ?? "",
    f?.severity ?? "",
    f?.area ?? "",
    f?.confidence_pct ?? "",
    f ? f.verified_by_inspector : "",
    f ? f.resolved : "",
    f?.evidence_frames ?? "",
    data.data_status,
    sha256,
  ]);
  return "﻿" + [CSV_HEADERS.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\r\n");
}
