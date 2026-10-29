import { describe, it, expect } from "vitest";
import {
  calculateConditionIndex,
  calculateInspectionCoverage,
  calculateInspectionConfidence,
  calculateLiquidationReadiness,
  calculateRiskLevel,
  computeAssetScores,
} from "../src/utils/scoring";
import type { Finding, CoverageArea } from "../src/types";

const finding = (over: Partial<Finding>): Finding => ({
  id: 1,
  type: "Crack",
  area: "Basement",
  severity: "Moderate",
  conf: 100,
  frames: 1,
  verified: false,
  isResolved: false,
  evidence: [],
  description: "",
  recommendation: "",
  detectedAt: "2026-01-01",
  ...over,
});

const area = (name: string, pct: number): CoverageArea => ({
  id: name,
  area: name,
  areaArabic: name,
  pct,
  expectedFrames: 10,
  capturedFrames: 10,
  lastInspected: "2026-01-01",
  status: pct >= 100 ? "Complete" : "Partial",
});

describe("Condition Index", () => {
  it("is 100 with no findings", () => {
    expect(calculateConditionIndex([])).toBe(100);
  });
  it("subtracts weight × confidence for unresolved findings only", () => {
    const fs = [
      finding({ severity: "Critical", conf: 100 }), // 15
      finding({ severity: "Moderate", conf: 50 }), // 4
      finding({ severity: "Low", conf: 100 }), // 3
      finding({ severity: "Critical", conf: 100, isResolved: true }), // 0
    ];
    expect(calculateConditionIndex(fs)).toBe(100 - 15 - 4 - 3);
  });
  it("never goes below 0", () => {
    const many = Array.from({ length: 20 }, (_, i) => finding({ id: i, severity: "Critical" }));
    expect(calculateConditionIndex(many)).toBe(0);
  });
});

describe("Coverage", () => {
  it("is 0 with no areas and the rounded mean otherwise", () => {
    expect(calculateInspectionCoverage([])).toBe(0);
    expect(calculateInspectionCoverage([area("a", 100), area("b", 50), area("c", 75)])).toBe(75);
  });
});

describe("Inspection Confidence", () => {
  it("uses 0.5·coverage + 40 when there are no findings", () => {
    expect(calculateInspectionConfidence(80, [])).toBe(80);
  });
  it("combines coverage, mean confidence and evidence completeness", () => {
    const withEvidence = finding({
      conf: 90,
      evidence: [
        {
          id: "e",
          frameUrl: "",
          thumbnailUrl: "",
          timestampSec: 0,
          timestampFormatted: "0",
          confidence: 0.9,
          cameraAngle: "",
          roomArea: "",
        },
      ],
    });
    const without = finding({ id: 2, conf: 70 });
    // 0.5*100 + 0.3*80 + 0.2*50 = 84
    expect(calculateInspectionConfidence(100, [withEvidence, without])).toBe(84);
  });
});

describe("Liquidation Readiness Index", () => {
  it("matches the documented formula", () => {
    // 100 - 0.4*(100-90) - 0.35*(100-80) - 5*2 - 3*1 = 100 - 4 - 7 - 10 - 3 = 76
    expect(calculateLiquidationReadiness(90, 80, 2, 1)).toBe(76);
  });
  it("is clamped to 0..100", () => {
    expect(calculateLiquidationReadiness(0, 0, 50, 50)).toBe(0);
    expect(calculateLiquidationReadiness(100, 100, 0, 0)).toBe(100);
  });
});

describe("Risk level", () => {
  it("is High whenever a critical finding is unresolved", () => {
    expect(calculateRiskLevel(99, 99, 1)).toBe("High");
  });
  it("is Low only with high condition and coverage", () => {
    expect(calculateRiskLevel(85, 90, 0)).toBe("Low");
    expect(calculateRiskLevel(85, 89, 0)).toBe("Moderate");
  });
});

describe("Readiness blockers", () => {
  it("names the actual area of the unresolved moisture finding", () => {
    const r = computeAssetScores([finding({ type: "Moisture", area: "Kitchen Ceiling" })], [area("Roof", 100)], 0);
    const m = r.readinessBlockers.find((b) => b.code === "UNRESOLVED_MOISTURE");
    expect(m?.description).toContain("Kitchen Ceiling");
    expect(m?.description).not.toContain("North Wall");
  });
  it("reports the lowest-coverage area below 70%", () => {
    const r = computeAssetScores([], [area("Roof", 65), area("Basement", 40), area("Lobby", 100)], 0);
    const gap = r.readinessBlockers.find((b) => b.code === "COVERAGE_GAP");
    expect(gap?.description).toContain("Basement");
  });
  it("reports no coverage gap when every area is at least 70%", () => {
    const r = computeAssetScores([], [area("Roof", 70), area("Lobby", 100)], 0);
    expect(r.readinessBlockers.some((b) => b.code === "COVERAGE_GAP")).toBe(false);
  });
});
