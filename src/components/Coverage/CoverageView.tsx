import React, { useState } from "react";
import { CoverageArea, Finding } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import { GlassCard } from "../common/GlassCard";
import { Badge } from "../common/Badge";
import { SpatialHeatmapOverlay } from "./SpatialHeatmapOverlay";
import { useTheme } from "../../context/ThemeContext";
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  ShieldAlert,
  Camera,
  Layers,
  MapPin,
} from "lucide-react";

interface CoverageViewProps {
  coverageAreas: CoverageArea[];
  findings?: Finding[];
  scores: ScoreResults;
  onUpdateAreaCoverage: (areaId: string, newPct: number) => void;
  isArabic?: boolean;
}

export const CoverageView: React.FC<CoverageViewProps> = ({
  coverageAreas,
  findings = [],
  scores,
  onUpdateAreaCoverage,
  isArabic = false,
}) => {
  const [activeSubView, setActiveSubView] = useState<"heatmap" | "breakdown">("heatmap");
  const { isDark } = useTheme();

  const roofArea = coverageAreas.find((a) =>
    a.area.toLowerCase().includes("roof")
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 3 Top Summary Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Overall Coverage */}
        <GlassCard className="p-6" glow glowColor={isDark ? "rgba(0,197,160,0.15)" : "rgba(13,148,136,0.12)"}>
          <div className={`text-xs font-mono mb-1 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
            {isArabic ? "إجمالي التغطية المكانية" : "Overall Spatial Coverage (FR-07)"}
          </div>
          <div className={`text-4xl font-black tracking-tight ${
            isDark ? "text-[#00C5A0] drop-shadow-[0_0_15px_rgba(0,197,160,0.45)]" : "text-teal-600"
          }`}>
            {scores.coveragePct}%
          </div>
          <div className={`text-xs mt-1 flex items-center gap-1.5 ${isDark ? "text-[#64748B]" : "text-slate-500 font-medium"}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-[#00C5A0]" : "text-teal-600"}`} />
            <span>
              {coverageAreas.filter((a) => a.pct >= 90).length} of {coverageAreas.length} zones fully captured
            </span>
          </div>
        </GlassCard>

        {/* Metric 2: Roof Coverage (The Primary Blocker) */}
        <GlassCard
          className={`p-6 ${isDark ? "border-[#EF4444]/30" : "border-red-200 bg-red-50/20"}`}
          glow={roofArea && roofArea.pct < 70}
          glowColor={isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.12)"}
        >
          <div className={`text-xs font-mono font-bold mb-1 flex items-center justify-between ${
            isDark ? "text-[#EF4444]" : "text-red-600"
          }`}>
            <span>{isArabic ? "تغطية وفحص السطح" : "Roof Inspection Coverage"}</span>
            {roofArea && roofArea.pct < 70 && (
              <Badge color="#EF4444" size="sm">
                ⚠ PRIMARY BLOCKER
              </Badge>
            )}
          </div>
          <div className={`text-4xl font-black tracking-tight ${
            isDark ? "text-[#EF4444] drop-shadow-[0_0_15px_rgba(239,68,68,0.45)]" : "text-red-600"
          }`}>
            {roofArea ? roofArea.pct : 34}%
          </div>
          <div className={`text-xs mt-1 flex items-center gap-1.5 font-medium ${
            isDark ? "text-[#EF4444]" : "text-red-600"
          }`}>
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {roofArea && roofArea.pct < 70
                ? isArabic
                  ? "عائق رئيسي: السطح غير مكتمل الفحص"
                  : "Major gap: Missing thermal drone roof scan"
                : isArabic
                ? "تم استكمال الفحص بنجاح!"
                : "Roof inspection completed!"}
            </span>
          </div>
        </GlassCard>

        {/* Metric 3: Inspection Confidence */}
        <GlassCard className="p-6" glow glowColor={isDark ? "rgba(96,165,250,0.15)" : "rgba(59,130,246,0.12)"}>
          <div className={`text-xs font-mono mb-1 ${isDark ? "text-[#60A5FA]" : "text-blue-600 font-semibold"}`}>
            {isArabic ? "درجة ثقة الفحص الموزونة" : "Inspection Confidence (FR-09)"}
          </div>
          <div className={`text-4xl font-black tracking-tight ${
            isDark ? "text-[#60A5FA] drop-shadow-[0_0_15px_rgba(96,165,250,0.45)]" : "text-blue-600"
          }`}>
            {scores.inspectionConfidence}/100
          </div>
          <div className={`text-xs mt-1 ${isDark ? "text-[#64748B]" : "text-slate-500 font-medium"}`}>
            Weighted composite formula (Coverage 50% + AI 30% + Evidence 20%)
          </div>
        </GlassCard>
      </div>

      {/* ── Sub-view Mode Switcher: SVG Blueprint Heatmap vs. List Breakdown ── */}
      <div className={`flex items-center justify-between gap-4 border-b pb-3 flex-wrap ${
        isDark ? "border-white/10" : "border-slate-200"
      }`}>
        <div>
          <h2 className={`text-base font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            <Compass className={`w-5 h-5 ${isDark ? "text-[#00C5A0]" : "text-teal-600"}`} />
            <span>{isArabic ? "التحليل المكاني وتوزيع المخاطر" : "Spatial Risk & Coverage Distribution"}</span>
          </h2>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-[#94A3B8]" : "text-slate-500"}`}>
            Interactive multi-level SVG architectural blueprints with thermal defect heatmaps
          </p>
        </div>

        <div className={`flex rounded-xl p-1 text-xs font-mono border ${
          isDark ? "bg-[#050C18] border-white/10" : "bg-slate-100 border-slate-300"
        }`}>
          <button
            onClick={() => setActiveSubView("heatmap")}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubView === "heatmap"
                ? isDark
                  ? "bg-[#00C5A0] text-[#050C18] shadow-lg shadow-[#00C5A0]/25 font-bold"
                  : "bg-white text-teal-700 shadow-sm font-bold border border-slate-200/80"
                : isDark
                ? "text-[#94A3B8] hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isArabic ? "خريطة الحرارة المكانية (SVG)" : "SVG Heatmap Blueprint"}</span>
          </button>
          <button
            onClick={() => setActiveSubView("breakdown")}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubView === "breakdown"
                ? isDark
                  ? "bg-[#00C5A0] text-[#050C18] shadow-lg shadow-[#00C5A0]/25 font-bold"
                  : "bg-white text-teal-700 shadow-sm font-bold border border-slate-200/80"
                : isDark
                ? "text-[#94A3B8] hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isArabic ? "جدول المناطق (FR-07)" : "Zone Progress Bars"}</span>
          </button>
        </div>
      </div>

      {/* ── SVG Spatial Heatmap Blueprint View ── */}
      {activeSubView === "heatmap" && (
        <SpatialHeatmapOverlay
          coverageAreas={coverageAreas}
          findings={findings}
          onUpdateAreaCoverage={onUpdateAreaCoverage}
          isArabic={isArabic}
        />
      )}

      {/* ── Area-By-Area Coverage List Breakdown ── */}
      {activeSubView === "breakdown" && (
        <GlassCard className="p-6 lg:p-8 space-y-6">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}>
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-2 ${
                isDark ? "text-[#00C5A0]" : "text-teal-700"
              }`}>
                <Compass className="w-4 h-4" />
                <span>{isArabic ? "تغطية المناطق المكانية (FR-07)" : "AREA-BY-AREA SPATIAL COVERAGE"}</span>
              </h3>
              <p className={`text-xs mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                Minimum 90% coverage required across all zones to achieve high liquidation readiness
              </p>
            </div>

            {/* Quick Simulation Trigger for Roof */}
            {roofArea && roofArea.pct < 70 && (
              <button
                onClick={() => onUpdateAreaCoverage(roofArea.id, 98)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C5A0] to-[#00E8BE] text-[#070E1C] font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#00C5A0]/25 whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin-reverse" />
                <span>{isArabic ? "محاكاة فحص السطح (+8 جاهزية)" : "Simulate Drone Roof Scan (+8 Gain)"}</span>
              </button>
            )}
          </div>

          {/* Spatial Zones List */}
          <div className="space-y-4">
            {coverageAreas.map((area) => {
              const color =
                area.pct >= 90
                  ? isDark ? "#00C5A0" : "#0D9488"
                  : area.pct >= 70
                  ? isDark ? "#F59E0B" : "#D97706"
                  : "#EF4444";

              return (
                <div key={area.id} className={`space-y-1.5 p-3 rounded-xl transition-all border ${
                  isDark ? "bg-black/20 hover:bg-black/35 border-white/5" : "bg-slate-50 hover:bg-slate-100/80 border-slate-200"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                        {isArabic ? area.areaArabic : area.area}
                      </span>
                      {area.isPrimaryBlocker && area.pct < 70 && (
                        <Badge color="#EF4444" size="sm">
                          Primary Blocker
                        </Badge>
                      )}
                      <span className={`text-[11px] font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                        ({area.capturedFrames}/{area.expectedFrames} frames)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className="font-extrabold font-mono text-sm"
                        style={{
                          color,
                          filter: isDark ? `drop-shadow(0 0 8px ${color}60)` : undefined,
                        }}
                      >
                        {area.pct}%
                      </span>

                      {/* Quick Toggle / Re-scan button */}
                      <button
                        onClick={() =>
                          onUpdateAreaCoverage(
                            area.id,
                            area.pct >= 90 ? 45 : 98
                          )
                        }
                        className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer border ${
                          isDark
                            ? "text-[#64748B] hover:text-[#00E8BE] bg-white/5 hover:bg-white/10 border-white/5"
                            : "text-slate-600 hover:text-teal-700 bg-slate-200/70 hover:bg-slate-300 border-slate-300"
                        }`}
                        title="Toggle coverage level for test"
                      >
                        {area.pct >= 90 ? "Reset" : "Complete"}
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar Track */}
                  <div className={`h-2.5 w-full rounded-full overflow-hidden p-0.5 border ${
                    isDark ? "bg-white/5 border-white/5" : "bg-slate-200 border-slate-300"
                  }`}>
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${area.pct}%`,
                        backgroundColor: color,
                        boxShadow: isDark ? `0 0 12px ${color}80` : undefined,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── FR-07 & FR-09 Formula Reference Blocks ── */}
          <div className={`p-4 rounded-xl font-mono text-xs space-y-3 border ${
            isDark ? "bg-black/40 border-[#00C5A0]/20" : "bg-slate-50 border-teal-300/40"
          }`}>
            <div>
              <div className={isDark ? "text-[#64748B]" : "text-slate-500"}>// Inspection Coverage Formula (FR-07)</div>
              <div className={`font-bold mt-0.5 ${isDark ? "text-[#00E8BE]" : "text-teal-700"}`}>
                Coverage% = (Inspected_Areas ÷ Expected_Areas) × 100
              </div>
            </div>

            <div className={`pt-2 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <div className={isDark ? "text-[#64748B]" : "text-slate-500"}>// Inspection Confidence Weighted Composite (FR-09)</div>
              <div className={`font-bold mt-0.5 ${isDark ? "text-[#60A5FA]" : "text-blue-700"}`}>
                Confidence = (Coverage% × 0.50) + (avg(AI_conf) × 0.30) + (Evidence_Completeness% × 0.20)
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
