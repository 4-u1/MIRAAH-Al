import { Finding, CoverageArea, RiskLevel } from "../types";

export interface ScoreResults {
  conditionIndex: number;
  coveragePct: number;
  inspectionConfidence: number;
  liquidationReadiness: number;
  riskLevel: RiskLevel;
  unresolvedCount: number;
  totalFindings: number;
  criticalCount: number;
  moderateCount: number;
  lowCount: number;
  totalEvidenceFrames: number;
  readinessBlockers: { description: string; impact: "High" | "Medium" | "Low"; code: string }[];
  explainabilityText: string;
}

/**
 * FR-08: Condition Index Calculation
 * severity_weights = { Critical: 15, Moderate: 8, Low: 3 }
 * raw_penalty = sum(severity_weights[f.severity] * (f.conf / 100))
 * Condition Index = max(0, 100 - raw_penalty)
 */
export function calculateConditionIndex(findings: Finding[]): number {
  const activeFindings = findings.filter((f) => !f.isResolved);
  const severityWeights: Record<string, number> = {
    Critical: 15,
    Moderate: 8,
    Low: 3,
  };

  let rawPenalty = 0;
  for (const f of activeFindings) {
    const weight = severityWeights[f.severity] ?? 3;
    // Normalize confidence percentage to 0-1
    const confFactor = f.conf / 100;
    rawPenalty += weight * confFactor;
  }

  return Math.max(0, Math.min(100, Math.round(100 - rawPenalty)));
}

/**
 * FR-07: Inspection Coverage Measurement
 * Coverage% = (Inspected_Expected_Areas / Total_Expected_Areas) * 100
 * Or weighted average of area coverage percentages
 */
export function calculateInspectionCoverage(coverageAreas: CoverageArea[]): number {
  if (!coverageAreas || coverageAreas.length === 0) return 0;
  const total = coverageAreas.reduce((acc, curr) => acc + curr.pct, 0);
  return Math.round(total / coverageAreas.length);
}

/**
 * FR-09: Inspection Confidence Score
 * Inspection Confidence = (Coverage% * 0.50) + (avg(AI_conf) * 0.30) + (Evidence_Completeness% * 0.20)
 * Evidence_Completeness% = (Findings_with_Evidence / Total_Findings) * 100
 */
export function calculateInspectionConfidence(
  coveragePct: number,
  findings: Finding[]
): number {
  if (findings.length === 0) {
    return Math.round(coveragePct * 0.5 + 40);
  }

  const avgAiConf =
    findings.reduce((acc, curr) => acc + curr.conf, 0) / findings.length;

  const findingsWithEvidence = findings.filter(
    (f) => f.evidence && f.evidence.length > 0
  ).length;
  const evidenceCompleteness = (findingsWithEvidence / findings.length) * 100;

  const confidence =
    coveragePct * 0.5 + avgAiConf * 0.3 + evidenceCompleteness * 0.2;

  return Math.max(0, Math.min(100, Math.round(confidence)));
}

/**
 * FR-10: Risk Classification
 */
export function calculateRiskLevel(
  conditionIndex: number,
  coveragePct: number,
  criticalCount: number
): RiskLevel {
  if (criticalCount > 0) return "High";
  if (conditionIndex >= 85 && coveragePct >= 90) return "Low";
  if (conditionIndex >= 65 || coveragePct >= 70) return "Moderate";
  if (conditionIndex < 50 || coveragePct < 50) return "High";
  return "Requires Expert Review";
}

/**
 * FR-11: Liquidation Readiness Score
 * Readiness = 100
 *   - (100 - Condition_Index) * 0.40
 *   - (100 - Coverage%) * 0.35
 *   - (Unresolved_Findings_Count * 5)
 *   - (Missing_Asset_Fields_Count * 3)
 */
export function calculateLiquidationReadiness(
  conditionIndex: number,
  coveragePct: number,
  unresolvedCount: number,
  missingFieldsCount: number
): number {
  const penaltyCondition = (100 - conditionIndex) * 0.4;
  const penaltyCoverage = (100 - coveragePct) * 0.35;
  const penaltyUnresolved = unresolvedCount * 5;
  const penaltyMissing = missingFieldsCount * 3;

  const readiness =
    100 - penaltyCondition - penaltyCoverage - penaltyUnresolved - penaltyMissing;

  return Math.max(0, Math.min(100, Math.round(readiness)));
}

/**
 * Computes all consolidated scores and explainability for an asset
 */
export function computeAssetScores(
  findings: Finding[],
  coverageAreas: CoverageArea[],
  missingFieldsCount: number
): ScoreResults {
  const conditionIndex = calculateConditionIndex(findings);
  const coveragePct = calculateInspectionCoverage(coverageAreas);
  const inspectionConfidence = calculateInspectionConfidence(coveragePct, findings);

  const unresolved = findings.filter((f) => !f.isResolved);
  const unresolvedCount = unresolved.length;
  const criticalCount = unresolved.filter((f) => f.severity === "Critical").length;
  const moderateCount = unresolved.filter((f) => f.severity === "Moderate").length;
  const lowCount = unresolved.filter((f) => f.severity === "Low").length;

  const totalEvidenceFrames = findings.reduce(
    (acc, f) => acc + (f.evidence?.length || f.frames || 0),
    0
  );

  const liquidationReadiness = calculateLiquidationReadiness(
    conditionIndex,
    coveragePct,
    unresolvedCount,
    missingFieldsCount
  );

  const riskLevel = calculateRiskLevel(conditionIndex, coveragePct, criticalCount);

  // FR-12: Readiness Blockers
  const readinessBlockers: {
    description: string;
    impact: "High" | "Medium" | "Low";
    code: string;
  }[] = [];

  const roofArea = coverageAreas.find(
    (a) => a.area.toLowerCase().includes("roof") || a.pct < 60
  );
  if (roofArea && roofArea.pct < 70) {
    readinessBlockers.push({
      description: `${roofArea.area} coverage incomplete (${roofArea.pct}%)`,
      impact: "High",
      code: "COVERAGE_GAP",
    });
  }

  if (unresolved.some((f) => f.type === "Moisture")) {
    readinessBlockers.push({
      description: "Moisture finding unresolved in North Wall",
      impact: "Medium",
      code: "UNRESOLVED_MOISTURE",
    });
  }

  if (missingFieldsCount > 0) {
    readinessBlockers.push({
      description: `Missing asset profile information (${missingFieldsCount} fields)`,
      impact: "Medium",
      code: "MISSING_DOCS",
    });
  }

  if (readinessBlockers.length === 0 && unresolvedCount > 0) {
    readinessBlockers.push({
      description: `${unresolvedCount} defects awaiting human inspector verification`,
      impact: "Low",
      code: "PENDING_VERIFICATION",
    });
  }

  // FR-13: Explainability Engine
  const explainabilityText = `READINESS = ${liquidationReadiness} — Because: ${coveragePct}% inspection coverage · ${totalEvidenceFrames} evidence frames · ${unresolvedCount} unresolved findings · ${roofArea ? `${roofArea.area} coverage = ${roofArea.pct}%` : "All areas inspected"} · ${missingFieldsCount > 0 ? "Missing asset information" : "Asset metadata verified"}`;

  return {
    conditionIndex,
    coveragePct,
    inspectionConfidence,
    liquidationReadiness,
    riskLevel,
    unresolvedCount,
    totalFindings: findings.length,
    criticalCount,
    moderateCount,
    lowCount,
    totalEvidenceFrames,
    readinessBlockers,
    explainabilityText,
  };
}

/**
 * FR-15: Next Best Action Priority Score Calculation
 * Priority = Impact * (1 / Effort) * Risk_Reduction
 */
export function calculateActionPriority(
  impact: "High" | "Medium" | "Low",
  effort: "High" | "Medium" | "Low",
  riskReduction: number = 1
): number {
  const impactValues: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
  const effortValues: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

  const imp = impactValues[impact] || 1;
  const eff = effortValues[effort] || 2;

  return Number((imp * (1 / eff) * riskReduction).toFixed(2));
}
