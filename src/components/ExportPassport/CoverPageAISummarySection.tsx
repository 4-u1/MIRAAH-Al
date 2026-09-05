import React from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Wrench,
  Percent,
} from "lucide-react";
import { AssetRecord } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import { extractCoverPageAISummary } from "../../utils/aiCoverSummary";

interface CoverPageAISummarySectionProps {
  asset: AssetRecord;
  scores: ScoreResults;
  isArabic?: boolean;
  isCompact?: boolean;
}

export const CoverPageAISummarySection: React.FC<CoverPageAISummarySectionProps> = ({
  asset,
  scores,
  isArabic = false,
  isCompact = false,
}) => {
  const summary = extractCoverPageAISummary(asset, scores);

  return (
    <div
      id={`cover-ai-summary-${asset.id}`}
      className="my-2.5 rounded-xl border border-cyan-800/30 bg-gradient-to-b from-cyan-950/[0.04] via-slate-50/80 to-slate-100/90 p-3 shadow-xs text-slate-900 font-sans"
    >
      {/* ── AI Header Banner ── */}
      <div className="flex items-center justify-between border-b border-cyan-800/20 pb-1.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-cyan-900 text-cyan-300 flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-cyan-950 flex items-center gap-1.5">
              <span>{isArabic ? "تحليل الذكاء الاصطناعي: الجاهزية الاستثمارية والمخاطر" : "AI SYNTHESIS: INVESTMENT READINESS & RISK PROFILE"}</span>
              <span className="text-[8px] font-mono font-bold bg-cyan-100 text-cyan-900 px-1.5 py-0.2 rounded border border-cyan-300">
                {summary.modelEngine}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-end">
          <span className="text-[8px] font-mono text-slate-500 hidden sm:inline">
            Confidence: <strong className="text-cyan-900">{summary.confidenceScore}%</strong>
          </span>
          <span className="text-[8px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-200 border border-cyan-800 shadow-xs">
            {isArabic ? summary.verdictTagArabic : summary.verdictTag}
          </span>
        </div>
      </div>

      {/* ── Two-Column AI Intelligence Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* ══ PANEL 1: INVESTMENT READINESS ══ */}
        <div className="rounded-lg bg-white/95 border border-emerald-300/80 p-2.5 flex flex-col justify-between shadow-xs">
          <div>
            {/* Panel Title & Status */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-[10px] font-black text-slate-950 uppercase tracking-tight">
                  {isArabic ? "١. الجاهزية الاستثمارية والسيولة" : "1. Investment Readiness & Liquidity"}
                </span>
              </div>
              <span className="text-[8.5px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded">
                Score: {summary.investmentReadiness.score}%
              </span>
            </div>

            {/* Status Rating Pill */}
            <div className="text-[9px] font-bold text-emerald-900 bg-emerald-50/90 rounded px-2 py-0.5 border border-emerald-200/80 mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">
                {isArabic ? summary.investmentReadiness.statusLabelArabic : summary.investmentReadiness.statusLabel}
              </span>
            </div>

            {/* Executive Synthesis Text */}
            <p className="text-[9px] leading-relaxed text-slate-700 text-justify mb-2">
              {isArabic ? summary.investmentReadiness.executiveSummaryArabic : summary.investmentReadiness.executiveSummary}
            </p>

            {/* Top Investment Catalysts */}
            <div className="space-y-1 mb-2">
              {summary.investmentReadiness.catalysts.slice(0, 2).map((cat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[8.5px] bg-slate-50 border border-slate-200/70 rounded p-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {isArabic ? cat.titleArabic : cat.title}
                    </span>
                    <span className="text-slate-600 text-[8px] leading-tight block">
                      {isArabic ? cat.detailArabic : cat.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Velocity Footer */}
          <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-600 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-cyan-700" />
              <span>Speed: <strong>{isArabic ? summary.investmentReadiness.projectedLiquidationSpeedArabic : summary.investmentReadiness.projectedLiquidationSpeed}</strong></span>
            </span>
            <span className="text-emerald-900 font-bold">
              {isArabic ? "أصل عالي الشفافية" : "Verified Clear Title"}
            </span>
          </div>
        </div>

        {/* ══ PANEL 2: PRIMARY RISK FACTORS & MITIGATION ══ */}
        <div className="rounded-lg bg-white/95 border border-amber-300/80 p-2.5 flex flex-col justify-between shadow-xs">
          <div>
            {/* Panel Title & Status */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-[10px] font-black text-slate-950 uppercase tracking-tight">
                  {isArabic ? "٢. عوامل المخاطر وخطة الاحتواء" : "2. Primary Risk Factors & Mitigation"}
                </span>
              </div>
              <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                summary.primaryRiskFactors.riskGrade === "LOW"
                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                  : summary.primaryRiskFactors.riskGrade === "MODERATE"
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-rose-100 text-rose-900 border-rose-300"
              }`}>
                {isArabic ? summary.primaryRiskFactors.riskGradeLabelArabic : summary.primaryRiskFactors.riskGradeLabel}
              </span>
            </div>

            {/* Risk Executive Synthesis Text */}
            <p className="text-[9px] leading-relaxed text-slate-700 text-justify mb-1.5">
              {isArabic ? summary.primaryRiskFactors.executiveSummaryArabic : summary.primaryRiskFactors.executiveSummary}
            </p>

            {/* Extracted Identified Risks */}
            <div className="space-y-1 mb-2">
              {summary.primaryRiskFactors.identifiedRisks.slice(0, 2).map((risk, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/70 rounded p-1 text-[8.5px]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1 truncate max-w-[70%]">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        risk.severity === "Critical" ? "bg-rose-600" : risk.severity === "Moderate" ? "bg-amber-500" : "bg-cyan-600"
                      }`} />
                      <span className="truncate">{isArabic ? risk.titleArabic : risk.title}</span>
                    </span>
                    <span className="text-[7.5px] font-mono text-slate-500 bg-slate-200/60 px-1 rounded">
                      {isArabic ? risk.categoryArabic : risk.category}
                    </span>
                  </div>
                  <div className="text-[7.5px] text-slate-600 flex items-center justify-between">
                    <span className="truncate max-w-[65%]">{isArabic ? risk.mitigationPathArabic : risk.mitigationPath}</span>
                    <span className="font-mono font-bold text-cyan-950 shrink-0">
                      ~SAR {risk.estimatedCostSar.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Budget & Timeframe Footer */}
          <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-600 font-mono">
            <span className="flex items-center gap-1">
              <Wrench className="w-2.5 h-2.5 text-amber-700" />
              <span>Remediation Cap: <strong className="text-slate-900">SAR {summary.primaryRiskFactors.totalRemediationBudgetSar.toLocaleString()}</strong></span>
            </span>
            <span className="text-cyan-900 font-bold">
              Timeframe: {isArabic ? summary.primaryRiskFactors.remediationTimeframeArabic : summary.primaryRiskFactors.remediationTimeframe}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
