import React from "react";
import { AssetRecord } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import { ScoreRing } from "../common/ScoreRing";
import { useTheme } from "../../context/ThemeContext";
import {
  Building,
  Coins,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

interface GlobalKPIHeaderProps {
  asset: AssetRecord;
  scores: ScoreResults;
  isArabic?: boolean;
}

export const GlobalKPIHeader: React.FC<GlobalKPIHeaderProps> = ({
  asset,
  scores,
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  // Area & Valuation derived dynamically from active asset
  const areaValue = asset.sizeSqm || 1400;
  const valuationM = asset.valuationSar ? (asset.valuationSar / 1000000).toFixed(1) : "14.8";
  const coveragePercent = scores.coveragePct ?? 98;
  const readinessPercent = scores.liquidationReadiness ?? 86;
  const confidencePercent = scores.inspectionConfidence ?? 93;

  return (
    <div className={`relative rounded-2xl backdrop-blur-xl p-6 lg:p-8 transition-colors ${
      isDark
        ? "bg-slate-900/80 border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]"
        : "bg-white/95 border border-slate-200/90 shadow-[0_10px_35px_rgba(15,23,42,0.06)] text-slate-800"
    }`}>
      {/* Subtle top neon ambient edge */}
      <div className={`absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent ${
        isDark ? "via-cyan-500/40" : "via-cyan-600/30"
      } to-transparent pointer-events-none`} />

      {/* Header Title / Context bar */}
      <div className={`flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b ${
        isDark ? "border-slate-800/70" : "border-slate-100"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
            isDark
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "bg-cyan-50 border-cyan-200 text-cyan-700"
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {isArabic ? "المؤشرات القياسية الشاملة للأصل" : "GLOBAL ASSET TELEMETRY & KPIs"}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}>
                {isArabic ? "محسوب · بيانات توضيحية" : "COMPUTED · DEMO DATA"}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic
                ? "مصفوفة القياس المكاني المباشرة وجاهزية تصفية الأصول وفق معايير التقييم العقاري"
                : "Scores computed by fixed formulas from the recorded demo data"}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 font-mono text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
            isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span className={isDark ? "text-slate-300" : "text-slate-700 font-medium"}>
              {isArabic ? "يُعاد الحساب عند التعديل" : "RECOMPUTED ON CHANGE"}
            </span>
          </span>
        </div>
      </div>

      {/* 5 Circular Donut Rings Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-center justify-items-center">
        {/* 1. Total Area Metric */}
        <div className={`w-full flex flex-col items-center p-4 rounded-xl border transition-all duration-300 group ${
          isDark
            ? "bg-slate-950/50 border-slate-800/60 hover:border-cyan-500/30 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)]"
            : "bg-slate-50/70 border-slate-200/80 hover:border-cyan-500/50 hover:bg-white hover:shadow-md"
        }`}>
          <div className={`flex items-center gap-1.5 text-xs font-mono font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <Building className="w-3.5 h-3.5 text-cyan-500" />
            <span>{isArabic ? "المساحة الإجمالية" : "TOTAL AREA"}</span>
          </div>

          <ScoreRing
            value={100}
            displayValue={areaValue.toLocaleString()}
            max={100}
            size={105}
            strokeWidth={5}
            color="#06B6D4"
            gradient={{ from: "#06B6D4", to: "#3B82F6" }}
            unit=""
            label={isArabic ? "المساحة المبنية" : "Gross Area"}

            sublabel={isArabic ? "متر مربع (م²)" : "sq meters"}
            formulaTooltip={isArabic ? `المساحة الإجمالية المبنية: ${areaValue.toLocaleString()} م² (بيانات توضيحية)` : `Total Gross Built Area: ${areaValue.toLocaleString()} sq m`}
          />
        </div>

        {/* 2. Valuation Metric */}
        <div className={`w-full flex flex-col items-center p-4 rounded-xl border transition-all duration-300 group ${
          isDark
            ? "bg-slate-950/50 border-slate-800/60 hover:border-amber-500/30 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]"
            : "bg-slate-50/70 border-slate-200/80 hover:border-amber-500/50 hover:bg-white hover:shadow-md"
        }`}>
          <div className={`flex items-center gap-1.5 text-xs font-mono font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{isArabic ? "التقييم التقديري" : "VALUATION"}</span>
          </div>

          <ScoreRing
            value={92}
            displayValue={`${valuationM}M`}
            max={100}
            size={105}
            strokeWidth={5}
            color="#F59E0B"
            gradient={{ from: "#F59E0B", to: "#F97316" }}
            unit=""
            label={isArabic ? "القيمة السوقية" : "Market Value"}
            sublabel={isArabic ? "ريال سعودي" : "SAR"}
            formulaTooltip={isArabic ? `القيمة التقديرية للأصل: ${(asset.valuationSar || 14800000).toLocaleString()} ر.س` : `Estimated Asset Valuation: ${(asset.valuationSar || 14800000).toLocaleString()} SAR`}
          />
        </div>

        {/* 3. Coverage Metric */}
        <div className={`w-full flex flex-col items-center p-4 rounded-xl border transition-all duration-300 group ${
          isDark
            ? "bg-slate-950/50 border-slate-800/60 hover:border-emerald-500/30 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
            : "bg-slate-50/70 border-slate-200/80 hover:border-emerald-500/50 hover:bg-white hover:shadow-md"
        }`}>
          <div className={`flex items-center gap-1.5 text-xs font-mono font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isArabic ? "تغطية المسح" : "COVERAGE"}</span>
          </div>

          <ScoreRing
            value={coveragePercent}
            max={100}
            size={105}
            strokeWidth={5}
            color="#10B981"
            gradient={{ from: "#10B981", to: "#06B6D4" }}
            unit="%"
            label={isArabic ? "نسبة التغطية" : "Spatial Coverage"}
            sublabel={isArabic ? `${asset.coverageAreas?.length || 5} مناطق مكتملة` : `${asset.coverageAreas?.length || 5} zones scanned`}
            formulaTooltip={isArabic ? `نسبة المسح الميداني الثلاثي الأبعاد: ${coveragePercent}%` : `Spatial coverage across all physical zones: ${coveragePercent}%`}
          />
        </div>

        {/* 4. Readiness Metric */}
        <div className={`w-full flex flex-col items-center p-4 rounded-xl border transition-all duration-300 group ${
          isDark
            ? "bg-slate-950/50 border-slate-800/60 hover:border-cyan-500/30 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)]"
            : "bg-slate-50/70 border-slate-200/80 hover:border-cyan-500/50 hover:bg-white hover:shadow-md"
        }`}>
          <div className={`flex items-center gap-1.5 text-xs font-mono font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>{isArabic ? "جاهزية التصفية" : "READINESS"}</span>
          </div>

          <ScoreRing
            value={readinessPercent}
            max={100}
            size={105}
            strokeWidth={5}
            color="#06B6D4"
            gradient={{ from: "#06B6D4", to: "#6366F1" }}
            unit="%"
            label={isArabic ? "جاهزية التصفية" : "Liquidation Index"}
            sublabel={readinessPercent >= 80 ? (isArabic ? "مستوى منخفض المخاطر" : "Low Risk Profile") : (isArabic ? "يتطلب معالجة" : "Remediation Needed")}
            formulaTooltip={isArabic ? `مؤشر الجاهزية للتصفية والمزاد: ${readinessPercent}/100` : `Liquidation Readiness composite score: ${readinessPercent}%`}
          />
        </div>

        {/* 5. Confidence Metric */}
        <div className={`w-full flex flex-col items-center p-4 rounded-xl border transition-all duration-300 group col-span-2 sm:col-span-1 ${
          isDark
            ? "bg-slate-950/50 border-slate-800/60 hover:border-purple-500/30 hover:shadow-[0_10px_30px_rgba(168,85,247,0.1)]"
            : "bg-slate-50/70 border-slate-200/80 hover:border-purple-500/50 hover:bg-white hover:shadow-md"
        }`}>
          <div className={`flex items-center gap-1.5 text-xs font-mono font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
            <span>{isArabic ? "دقة النموذج" : "CONFIDENCE"}</span>
          </div>

          <ScoreRing
            value={confidencePercent}
            max={100}
            size={105}
            strokeWidth={5}
            color="#A855F7"
            gradient={{ from: "#A855F7", to: "#EC4899" }}
            unit="%"
            label={isArabic ? "موثوقية الذكاء" : "AI Confidence"}
            sublabel={isArabic ? "محسوب" : "Computed"}
            formulaTooltip={isArabic ? `مستوى الثقة الإحصائية لنموذج الذكاء المكاني: ${confidencePercent}%` : `Statistical confidence from multi-view validation: ${confidencePercent}%`}
          />
        </div>

      </div>
    </div>
  );
};
