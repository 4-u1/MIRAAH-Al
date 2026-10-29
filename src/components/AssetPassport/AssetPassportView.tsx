import React, { useState } from "react";
import { AssetRecord, Finding } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import { GlassCard } from "../common/GlassCard";
import { ScoreRing } from "../common/ScoreRing";
import { Badge } from "../common/Badge";
import { GlobalKPIHeader } from "./GlobalKPIHeader";
import { AssetHealthSparklinesWidget } from "./AssetHealthSparklinesWidget";
import { SpatialAssetGrid } from "./SpatialAssetGrid";
import { SpatialTwinCanvas3D } from "./SpatialTwinCanvas3D";
import { DefectDrillDownModal } from "../AIFindings/DefectDrillDownModal";
import { useTheme } from "../../context/ThemeContext";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileJson,
  Printer,
  Info,
  CheckCircle2,
  TrendingUp,
  Compass,
  Layers,
  MapPin,
  Camera,
  Activity,
  Zap,
  Eye,
  Building,
  ShieldAlert,
  Box,
  LayoutGrid,
  Radio,
  HardHat,
  Droplets,
  FileText,
  Download,
  FileCheck2,
  Scale,
  Award,
  Presentation,
} from "lucide-react";

interface AssetPassportViewProps {
  asset: AssetRecord;
  scores: ScoreResults;
  onNavigateTab: (tabId: string) => void;
  onOpenExportModal: () => void;
  onOpenPdfViewer?: (docType?: "title_deed" | "sbc_audit" | "taqeem_valuation" | "liquidation_clearance") => void;
  onOpenTour?: () => void;
  onOpenDossier?: () => void;
  onToggleVerification?: (findingId: number) => void;
  onToggleResolved?: (findingId: number) => void;
  isArabic?: boolean;
}

export const AssetPassportView: React.FC<AssetPassportViewProps> = ({
  asset,
  scores,
  onNavigateTab,
  onOpenExportModal,
  onOpenPdfViewer,
  onOpenTour,
  onOpenDossier,
  onToggleVerification = (_id: number) => {},
  onToggleResolved = (_id: number) => {},
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  const [activeFindingModal, setActiveFindingModal] = useState<Finding | null>(null);
  const [passportViewMode, setPassportViewMode] = useState<"all" | "3d_twin" | "zones">("all");

  const sevColors = {
    Critical: "#EF4444",
    Moderate: "#F59E0B",
    Low: "#22C55E",
  };

  const topAction = asset.actions[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── 1. Top Global KPIs Header (Area, Valuation, Coverage, Readiness, Confidence) ── */}
      <GlobalKPIHeader asset={asset} scores={scores} isArabic={isArabic} />

      {/* ── 1.5 Real-time Asset Health Sparklines Summary Widget ── */}
      <AssetHealthSparklinesWidget
        asset={asset}
        scores={scores}
        isArabic={isArabic}
        onNavigateTab={onNavigateTab}
      />

      {/* ── 1.7 Executive Dossier & Presentation Deck Quick Access Banner ── */}
      {onOpenDossier && (
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${
          isDark
            ? "bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/30 border-amber-500/30"
            : "bg-gradient-to-r from-amber-50 via-white to-sky-50 border-amber-200"
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-amber-100 text-amber-800"
            }`}>
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-sm sm:text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {isArabic ? "الملف التقديمي الشامل وملخص المشروع (MIRAAH Pitch Deck)" : "MIRAAH Executive Pitch Deck & Project Dossier"}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  {isArabic ? "ملخص المشروع 2026" : "2026 Executive Brief"}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isArabic
                  ? "استعراض شرائح العرض التقديمي الشامل، ملخص المشروع لمركز إنفاذ والمحاكم، والركائز التقنية السبع."
                  : "View the comprehensive presentation slides, stakeholder benefits for Enfad, and platform architecture."}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDossier}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs font-bold shadow-md shadow-amber-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer group shrink-0"
          >
            <Presentation className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{isArabic ? "فتح ملف العرض وملخص المشروع" : "Open Project Dossier & Deck"}</span>
          </button>
        </div>
      )}

      {/* ── 2. Bespoke MIRAAH Architectural Monolith & Live 3D BIM Frame ── */}
      <div className={`relative rounded-2xl p-6 lg:p-10 overflow-hidden ${
        isDark
          ? "bg-[#07090E] border border-white/[0.14] shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
          : "bg-gradient-to-br from-slate-50 via-white to-sky-50/40 border border-slate-200/90 shadow-xl"
      }`}>
        {/* Subtle Architectural Grid & Ambient Aura */}
        <div className={`absolute inset-0 bg-grid-tech pointer-events-none ${isDark ? "opacity-25" : "opacity-10"}`} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-radial from-[#00E5B9]/10 via-transparent to-transparent pointer-events-none" />

        {/* Top Header Spec Line inside the Monolith */}
        <div className={`relative z-10 flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-8 font-mono text-[10px] uppercase tracking-widest ${
          isDark ? "border-white/[0.09] text-[#94A3B8]" : "border-slate-200 text-slate-500"
        }`}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`font-black tracking-widest flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <span className="w-2 h-2 bg-[#00E5B9] shadow-[0_0_8px_#00E5B9]"></span>
              MIRAAH · مرآة
            </span>
            <span className={isDark ? "text-[#64748B]" : "text-slate-400"}>INDEX 2026</span>
            <span className={isDark ? "text-white/20" : "text-slate-300"}>|</span>
            <span className={isDark ? "text-[#00E5B9]" : "text-teal-600 font-bold"}>SPATIAL ASSET INTELLIGENCE & LIQUIDATION</span>
            <span className={isDark ? "text-white/20" : "text-slate-300"}>|</span>
            <span className={isDark ? "text-[#60A5FA]" : "text-blue-600 font-bold"}>RIYADH METROPOLIS</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold ${
              isDark
                ? "border-cyan-500/30 text-cyan-300 bg-cyan-950/30"
                : "border-cyan-400/40 text-cyan-800 bg-cyan-50 shadow-sm"
            }`}>
              {asset.id ? `ID: #${asset.id}` : "INDEX_2026"}
            </span>
            <Badge
              color={
                scores.riskLevel === "Low"
                  ? "#22C55E"
                  : scores.riskLevel === "Moderate"
                  ? "#F59E0B"
                  : "#EF4444"
              }
              size="xs"
              variant="mono"
            >
              RISK: {scores.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Main Monolith Grid: Left Bold Editorial Typography + Right Interactive 3D BIM Frame */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Bold Typography & Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1 leading-none select-none">
              <div className="flex items-baseline gap-4 flex-wrap">
                <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-display font-black uppercase tracking-tight leading-[0.88] ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  MIRAAH
                </h1>
                <span className="text-3xl sm:text-5xl font-black font-arabic text-transparent bg-clip-text bg-gradient-to-r from-[#00E5B9] to-[#60A5FA] drop-shadow-[0_0_20px_rgba(0,229,185,0.4)]">
                  مرآة
                </span>
              </div>
              <div className={`text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight leading-[0.9] ${
                isDark ? "text-stroke-white-thick opacity-85" : "text-slate-800/80"
              }`}>
                SPATIAL ASSET
              </div>
            </div>

            {/* Editorial Description Copy */}
            <p className={`text-xs sm:text-sm font-body max-w-xl leading-relaxed ${
              isDark ? "text-[#94A3B8]" : "text-slate-600 font-medium"
            }`}>
              {isArabic
                ? "منظومة الذكاء المكاني وإعادة البناء ثلاثي الأبعاد للمباني والأصول العقارية. تحويل وسائط المسح الميداني إلى أدلة موثوقة وتحليلات جاهزية التصفية مع مطابقة فورية لكود البناء السعودي (SBC 201/304)."
                : "Autonomous spatial intelligence and architectural reconstruction platform. Transforming multi-spectral field media into verified evidence, liquidation readiness scoring, and instantaneous due-diligence dossiers."}
            </p>

            {/* Real-time Dynamic Asset Telemetry Spec Bar (Replaces Static Labels) */}
            <div className="flex items-center gap-2.5 flex-wrap font-mono text-[11px]">
              <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm ${
                isDark ? "bg-white/[0.04] border border-cyan-500/30 text-white" : "bg-white border border-cyan-400/50 text-slate-800"
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#00E5B9] animate-ping" />
                <MapPin className="w-3.5 h-3.5 text-[#00E5B9]" />
                <span className="font-bold">{isArabic ? asset.nameArabic || asset.name : asset.name}</span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm ${
                isDark ? "bg-white/[0.04] border border-blue-500/30 text-white" : "bg-white border border-blue-400/50 text-slate-800"
              }`}>
                <Compass className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span className={isDark ? "text-slate-300" : "text-slate-600"}>24.7742°N, 46.5912°E</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-800"
                }`}>RTK FIXED</span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm ${
                isDark ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300" : "bg-emerald-50 border border-emerald-300 text-emerald-800"
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-bold">SBC 201/304 COMPLIANT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Actions & Export Controls */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              {onOpenTour && (
                <button
                  onClick={onOpenTour}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-display font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_4px_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] cursor-pointer group"
                >
                  <Compass className="w-4 h-4 text-cyan-200 group-hover:rotate-45 transition-transform" />
                  <span>{isArabic ? "جولة تفاعلية شاملة 🧭" : "INTERACTIVE TOUR 🧭"}</span>
                </button>
              )}

              <button
                onClick={onOpenExportModal}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-display font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_4px_25px_rgba(6,182,212,0.35)] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isArabic ? "تصدير الملف المعتمد (PDF / CSV / JSON)" : "EXPORT DOSSIER (PDF / CSV / JSON)"}</span>
              </button>

              <button
                onClick={() => onNavigateTab("whatif")}
                className={`px-5 py-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                  isDark
                    ? "bg-slate-900 hover:bg-slate-800 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-white hover:bg-slate-50 border-cyan-500/50 text-cyan-800"
                }`}
              >
                <Zap className="w-4 h-4 text-cyan-500" />
                <span>{isArabic ? "محاكي العائد ⚡" : "WHAT-IF SIMULATOR"}</span>
              </button>

              <button
                onClick={() => window.print()}
                className={`px-4 py-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isDark
                    ? "bg-slate-900/60 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white"
                    : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950"
                }`}
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">{isArabic ? "طباعة" : "PRINT"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Architectural BIM Viewport Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-cyan-500/30 p-5 h-[360px] flex flex-col justify-between overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-grid-tech opacity-30 pointer-events-none" />

              {/* Watermark Numeral */}
              <div className="absolute right-3 bottom-4 text-[120px] font-display font-black text-cyan-500/[0.04] select-none leading-none pointer-events-none font-mono">
                26
              </div>

              {/* Top Viewport Toolbar */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase py-1">
                  BIM_COMMERCIAL_3D_SCAN
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="font-mono text-[9px] text-cyan-300 tracking-widest uppercase font-bold bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                    LIVE SPATIAL BIM
                  </span>
                </div>
              </div>

              {/* Center 3D Holographic Wireframe Reconstruction */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                <svg
                  width="220"
                  height="140"
                  viewBox="0 0 220 140"
                  className="opacity-95 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                >
                  {/* Ground Plane Grid */}
                  <ellipse cx="110" cy="115" rx="90" ry="20" fill="rgba(6,182,212,0.03)" stroke="rgba(6,182,212,0.2)" strokeDasharray="3 3" />
                  
                  {/* Base Volume */}
                  <polygon points="40,85 110,120 180,85 110,50" fill="rgba(15,23,42,0.7)" stroke="#38BDF8" strokeWidth="1.2" />
                  <polygon points="40,85 40,105 110,140 110,120" fill="rgba(30,41,59,0.9)" stroke="#0284C7" strokeWidth="1" />
                  <polygon points="180,85 180,105 110,140 110,120" fill="rgba(15,23,42,0.9)" stroke="#0369A1" strokeWidth="1" />

                  {/* Second Story Volume */}
                  <polygon points="65,65 110,90 155,65 110,40" fill="rgba(6,182,212,0.12)" stroke="#06B6D4" strokeWidth="1.5" />
                  <polygon points="65,65 65,85 110,110 110,90" fill="rgba(8,145,178,0.2)" stroke="#06B6D4" strokeWidth="1.2" />
                  <polygon points="155,65 155,85 110,110 110,90" fill="rgba(14,116,144,0.2)" stroke="#38BDF8" strokeWidth="1.2" />

                  {/* Cantilevered Roof Canopy */}
                  <polygon points="50,45 110,75 170,45 110,15" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

                  {/* Pulsing Defect Markers */}
                  <g className="cursor-pointer" onClick={() => onNavigateTab("findings")}>
                    <circle cx="135" cy="72" r="5" fill="#EF4444" opacity="0.4" className="animate-ping" />
                    <circle cx="135" cy="72" r="3" fill="#EF4444" stroke="#FFF" strokeWidth="1" />
                  </g>
                  <g className="cursor-pointer" onClick={() => onNavigateTab("findings")}>
                    <circle cx="85" cy="78" r="4" fill="#F59E0B" opacity="0.4" className="animate-ping" />
                    <circle cx="85" cy="78" r="2.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1" />
                  </g>

                  {/* Dimension Guides */}
                  <line x1="25" y1="45" x2="25" y2="105" stroke="#64748B" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="16" y="78" fill="#94A3B8" fontSize="7" fontFamily="monospace">14.8m</text>
                </svg>
              </div>

              {/* Bottom Tags */}
              <div className="relative z-10 flex items-end justify-between font-mono text-[9px] uppercase tracking-widest text-[#94A3B8] border-t border-slate-800/80 pt-3">
                <div>
                  <span className="text-white font-bold block">{asset.name.toUpperCase()}</span>
                  <span className="text-[#64748B]">RIYADH, SA · 1,400 M²</span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold block">4.2M PTS · 98% COV</span>
                  <span className="text-white font-semibold">SPATIAL TWIN V2.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2.5 View Mode Selector (All Insights / 3D Canvas Spatial Twin / 5 Zones Matrix) ── */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-2xl backdrop-blur-md ${
        isDark ? "bg-slate-900/90 border border-slate-800" : "bg-white border border-slate-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-cyan-500" />
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
            isDark ? "text-white" : "text-slate-800"
          }`}>
            {isArabic ? "نمط عرض جواز الأصل والمجسم المكاني:" : "PASSPORT & TWIN EXPLORATION VIEW:"}
          </span>
        </div>

        <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs font-mono w-full sm:w-auto justify-between sm:justify-start ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          <button
            onClick={() => setPassportViewMode("all")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              passportViewMode === "all"
                ? isDark
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-teal-600 text-white font-bold shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isArabic ? "العرض المتكامل (الكل)" : "Overview (All)"}</span>
          </button>

          <button
            onClick={() => setPassportViewMode("3d_twin")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              passportViewMode === "3d_twin"
                ? isDark
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-teal-600 text-white font-bold shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{isArabic ? "المجسم ثلاثي الأبعاد 3D" : "3D Spatial Twin"}</span>
          </button>

          <button
            onClick={() => setPassportViewMode("zones")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              passportViewMode === "zones"
                ? isDark
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-teal-600 text-white font-bold shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{isArabic ? "مصفوفة النطاقات الخمسة" : "5 Spatial Zones"}</span>
          </button>
        </div>
      </div>

      {/* ── 3. Interactive 3D Spatial Twin (Canvas Element) ── */}
      {(passportViewMode === "all" || passportViewMode === "3d_twin") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                {isArabic ? "المجسم ثلاثي الأبعاد التفاعلي (3D Canvas Twin)" : "3D SPATIAL TWIN · ROTATE & INSPECT CANVAS"}
              </h3>
            </div>
            <span className={`text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic ? "تحكم حر 360° بالماوس واللمس" : "Interactive 360° Mouse / Touch Controls"}
            </span>
          </div>

          <SpatialTwinCanvas3D
            asset={asset}
            isArabic={isArabic}
            onSelectFinding={(f) => setActiveFindingModal(f)}
          />
        </div>
      )}

      {/* ── 4. Spatial Asset Layout: 5 Building Zones Masonry Grid ── */}
      {(passportViewMode === "all" || passportViewMode === "zones") && (
        <SpatialAssetGrid
          asset={asset}
          onSelectFinding={(finding) => setActiveFindingModal(finding)}
          onNavigateTab={onNavigateTab}
          isArabic={isArabic}
        />
      )}

      {/* ── 4. Findings Breakdown + Readiness Blockers Matrix ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Findings Summary */}
        <GlassCard className="p-6 lg:col-span-7 space-y-5" reticles>
          <div className={`flex items-center justify-between border-b pb-3 ${
            isDark ? "border-white/[0.08]" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                {isArabic ? "تحليلات الذكاء المكاني للعيوب" : "AI SPATIAL FINDINGS"}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab("findings")}
              className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isArabic ? "معاينة الكل" : "INSPECT ALL"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Severity Counter Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-center">
              <div className="text-3xl font-display font-black text-red-500 dark:text-red-400">
                {scores.criticalCount}
              </div>
              <div className={`text-[10px] font-mono uppercase font-bold mt-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                {isArabic ? "حرجة" : "Critical"}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-center">
              <div className="text-3xl font-display font-black text-amber-500 dark:text-amber-400">
                {scores.moderateCount}
              </div>
              <div className={`text-[10px] font-mono uppercase font-bold mt-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                {isArabic ? "متوسطة" : "Moderate"}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-center">
              <div className="text-3xl font-display font-black text-emerald-600 dark:text-emerald-400">
                {scores.lowCount}
              </div>
              <div className={`text-[10px] font-mono uppercase font-bold mt-1 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                {isArabic ? "طفيفة" : "Low"}
              </div>
            </div>
          </div>

          {/* Recent Findings Quick List */}
          <div className="space-y-2 pt-1">
            {asset.findings.slice(0, 3).map((f) => (
              <div
                key={f.id}
                onClick={() => setActiveFindingModal(f)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all group ${
                  isDark
                    ? "bg-slate-950/60 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/40"
                    : "bg-slate-50 hover:bg-white border-slate-200 hover:border-cyan-500/40 shadow-xs hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: sevColors[f.severity] }}
                  />
                  <div>
                    <div className={`text-xs font-bold transition-colors flex items-center gap-2 ${
                      isDark ? "text-white group-hover:text-cyan-300" : "text-slate-900 group-hover:text-cyan-700"
                    }`}>
                      <span>{isArabic ? f.titleArabic || f.title || f.type : f.title || f.type}</span>
                      <span className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        · {f.location || f.area}
                      </span>
                    </div>
                    <div className={`text-[11px] line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {isArabic ? f.descriptionArabic || f.description : f.description}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    {f.conf}%
                  </div>
                  <div className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>AI Conf</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right Col: Readiness Blockers */}
        <GlassCard className="p-6 lg:col-span-5 space-y-5" reticles>
          <div className={`flex items-center justify-between border-b pb-3 ${
            isDark ? "border-white/[0.08]" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">
                {isArabic ? `عوائق الجاهزية (${scores.readinessBlockers.length})` : `LIQUIDATION BLOCKERS (${scores.readinessBlockers.length})`}
              </span>
            </div>
            <Badge color="#EF4444" size="xs" variant="mono">FR-12</Badge>
          </div>

          <div className="space-y-2.5">
            {scores.readinessBlockers.map((b, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  isDark ? "bg-red-950/20 border-red-500/30" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    {b.description}
                  </span>
                </div>
                <Badge
                  color={
                    b.impact === "High"
                      ? "#EF4444"
                      : b.impact === "Medium"
                      ? "#F59E0B"
                      : "#60A5FA"
                  }
                  size="xs"
                  variant="mono"
                >
                  {b.impact}
                </Badge>
              </div>
            ))}

            {scores.readinessBlockers.length === 0 && (
              <div className={`p-6 text-center rounded-xl border ${
                isDark ? "bg-emerald-950/20 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
              }`}>
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className={`text-xs font-bold font-mono ${isDark ? "text-emerald-300" : "text-emerald-800"}`}>
                  {isArabic
                    ? "لا توجد عوائق تصفية حالية! الأصل جاهز للصفقات."
                    : "Zero liquidation blockers detected! Asset is transaction-ready."}
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* ── 4.5 Certified Documents & Official PDF Vault (خزينة الوثائق والمستندات المعتمدة) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                <span>{isArabic ? "نماذج مستندات توضيحية" : "Specimen documents"}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                  isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-amber-100 text-amber-800 border-amber-300"
                }`}>
                  4 ملفات معتمدة
                </span>
              </h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {isArabic
                  ? "نماذج توضيحية تبيّن شكل المستندات المقترح داخل المنصة. ليست مستندات رسمية ولم تصدر عن أي جهة."
                  : "Illustrative specimens of the proposed in-platform documents. Not official documents; not issued by any authority."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 border ${
              isDark ? "text-emerald-400 bg-emerald-950/40 border-emerald-500/30" : "text-emerald-800 bg-emerald-50 border-emerald-300"
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isArabic ? "نماذج · غير رسمية" : "SPECIMENS · NOT OFFICIAL"}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Doc 1: Electronic Title Deed */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-sm space-y-3 group flex flex-col justify-between ${
            isDark
              ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 hover:border-amber-400"
              : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-md"
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 group-hover:scale-110 transition-transform">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isDark ? "bg-amber-950/60 text-amber-300 border-amber-700/40" : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
                  صك إلكتروني
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm transition-colors ${
                  isDark ? "text-white group-hover:text-amber-300" : "text-slate-900 group-hover:text-amber-700"
                }`}>
                  {isArabic ? "نموذج صك ملكية" : "Specimen title deed"}
                </h4>
                <div className={`text-[11px] font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  #DEED-SA-20481 · 2.4 MB PDF
                </div>
              </div>
              <p className={`text-[11px] line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isArabic
                  ? "نموذج توضيحي لشكل بيانات الصك داخل المنصة (لم يصدر عن وزارة العدل)."
                  : "Illustrative layout of title-deed data in the platform (not issued by the Ministry of Justice)."}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
              isDark ? "border-slate-800/80" : "border-slate-100"
            }`}>
              <span className={`text-[10px] font-mono flex items-center gap-1 ${
                isDark ? "text-emerald-400" : "text-emerald-700 font-semibold"
              }`}>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>مطابق ومفعل</span>
              </span>
              <button
                onClick={() => onOpenPdfViewer && onOpenPdfViewer("title_deed")}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isArabic ? "معاينة PDF" : "View PDF"}</span>
              </button>
            </div>
          </div>

          {/* Doc 2: SBC Compliance Certificate */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-sm space-y-3 group flex flex-col justify-between ${
            isDark
              ? "bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500/30 hover:border-cyan-400"
              : "bg-white border-slate-200 hover:border-cyan-400 hover:shadow-md"
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isDark ? "bg-cyan-950/60 text-cyan-300 border-cyan-700/40" : "bg-cyan-50 text-cyan-800 border-cyan-200"
                }`}>
                  كود البناء SBC
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm transition-colors ${
                  isDark ? "text-white group-hover:text-cyan-300" : "text-slate-900 group-hover:text-cyan-700"
                }`}>
                  {isArabic ? "شهادة الفحص الهندسي لكود البناء" : "SBC Structural Audit Certificate"}
                </h4>
                <div className={`text-[11px] font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  #SBC-ENG-9941 · 3.8 MB PDF
                </div>
              </div>
              <p className={`text-[11px] line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isArabic
                  ? "تقرير تدقيق مطابق لبنود SBC 201/304 مع فحص الدرون الحراري وسلامة الخرسانات المسلحة."
                  : "Comprehensive structural integrity inspection matching SBC 201/304 building standards."}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
              isDark ? "border-slate-800/80" : "border-slate-100"
            }`}>
              <span className={`text-[10px] font-mono flex items-center gap-1 ${
                isDark ? "text-cyan-300" : "text-cyan-700 font-semibold"
              }`}>
                <ShieldCheck className="w-3 h-3 text-cyan-500" />
                <span>SBC 201/304</span>
              </span>
              <button
                onClick={() => onOpenPdfViewer && onOpenPdfViewer("sbc_audit")}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isArabic ? "معاينة PDF" : "View PDF"}</span>
              </button>
            </div>
          </div>

          {/* Doc 3: Taqeem Valuation Report */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-sm space-y-3 group flex flex-col justify-between ${
            isDark
              ? "bg-gradient-to-b from-slate-900 to-slate-950 border-blue-500/30 hover:border-blue-400"
              : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md"
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-500 group-hover:scale-110 transition-transform">
                  <Scale className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isDark ? "bg-blue-950/60 text-blue-300 border-blue-700/40" : "bg-blue-50 text-blue-800 border-blue-200"
                }`}>
                  تقييم معتمد
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm transition-colors ${
                  isDark ? "text-white group-hover:text-blue-300" : "text-slate-900 group-hover:text-blue-700"
                }`}>
                  {isArabic ? "تقرير التقييم العقاري المعتمد" : "Taqeem Valuation Report"}
                </h4>
                <div className={`text-[11px] font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  #VAL-TAQEEM-8820 · 1.9 MB PDF
                </div>
              </div>
              <p className={`text-[11px] line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isArabic
                  ? "نموذج توضيحي لتقرير تقييم (ليس تقييماً معتمداً)."
                  : "Illustrative valuation report layout (not a certified valuation)."}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
              isDark ? "border-slate-800/80" : "border-slate-100"
            }`}>
              <span className={`text-[10px] font-mono flex items-center gap-1 ${
                isDark ? "text-blue-300" : "text-blue-700 font-semibold"
              }`}>
                <Award className="w-3 h-3 text-blue-500" />
                <span>مقيم مرخص</span>
              </span>
              <button
                onClick={() => onOpenPdfViewer && onOpenPdfViewer("taqeem_valuation")}
                className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isArabic ? "معاينة PDF" : "View PDF"}</span>
              </button>
            </div>
          </div>

          {/* Doc 4: Infath Liquidation Clearance */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-sm space-y-3 group flex flex-col justify-between ${
            isDark
              ? "bg-gradient-to-b from-slate-900 to-slate-950 border-purple-500/30 hover:border-purple-400"
              : "bg-white border-slate-200 hover:border-purple-400 hover:shadow-md"
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-500 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isDark ? "bg-purple-950/60 text-purple-300 border-purple-700/40" : "bg-purple-50 text-purple-800 border-purple-200"
                }`}>
                  إنفاذ قضائي
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm transition-colors ${
                  isDark ? "text-white group-hover:text-purple-300" : "text-slate-900 group-hover:text-purple-700"
                }`}>
                  {isArabic ? "تصريح المزاد والتصفية القضائية" : "Infath Liquidation Clearance"}
                </h4>
                <div className={`text-[11px] font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  #INFATH-CLR-7731 · 4.1 MB PDF
                </div>
              </div>
              <p className={`text-[11px] line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isArabic
                  ? "نموذج مقترح لملخص جاهزية المزاد (لم يصدر عن إنفاذ)."
                  : "Proposed auction-readiness summary layout (not issued by Infath)."}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
              isDark ? "border-slate-800/80" : "border-slate-100"
            }`}>
              <span className={`text-[10px] font-mono flex items-center gap-1 ${
                isDark ? "text-purple-300" : "text-purple-700 font-semibold"
              }`}>
                <CheckCircle2 className="w-3 h-3 text-purple-500" />
                <span>جاهز للطرح</span>
              </span>
              <button
                onClick={() => onOpenPdfViewer && onOpenPdfViewer("liquidation_clearance")}
                className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isArabic ? "معاينة PDF" : "View PDF"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Explainability Engine Panel ── */}
      <GlassCard className="p-6" hoverEffect={false} reticles>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>{isArabic ? "محرك التفسير والشفافية الحسابية" : "WHY? — EXPLAINABILITY ENGINE"}</span>
        </div>
        <div className={`p-4 rounded-xl border space-y-2 ${
          isDark ? "bg-slate-950/80 border-slate-800/80" : "bg-slate-50 border-slate-200"
        }`}>
          <div className={`font-mono text-xs font-bold flex items-center gap-2 ${
            isDark ? "text-cyan-300" : "text-cyan-800"
          }`}>
            <span className="text-cyan-500">❯</span>
            <span>{isArabic ? "درجة الجاهزية =" : "READINESS ="} {scores.liquidationReadiness} — {isArabic ? "وفق المعادلة التفسيرية:" : "Determinants:"}</span>
          </div>
          <div className={`font-mono text-xs leading-relaxed pl-4 border-l border-cyan-500/30 ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}>
            {scores.explainabilityText}
          </div>
        </div>
      </GlassCard>

      {/* ── 6. Next Best Action CTA Banner ── */}
      {topAction && (
        <div
          className={`relative rounded-2xl p-6 lg:p-8 overflow-hidden border flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDark
              ? "border-cyan-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 shadow-[0_15px_50px_rgba(6,182,212,0.15)]"
              : "border-teal-300/80 bg-gradient-to-r from-teal-50 via-sky-50 to-white shadow-md"
          }`}
        >
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-teal-600 dark:text-cyan-400 tracking-wider uppercase">
              <Zap className="w-4 h-4" />
              <span>{isArabic ? "الخطوة التالية الموصى بها لرفع القيمة" : "⚡ NEXT BEST ACTION"}</span>
            </div>
            <h3 className={`text-xl lg:text-2xl font-display font-black uppercase ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              {isArabic ? topAction.actionArabic : topAction.action}
            </h3>
            <p className={`text-xs font-mono flex items-center gap-3 flex-wrap ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              <span>Impact: <strong className={isDark ? "text-white" : "text-slate-900"}>{topAction.impact}</strong></span>
              <span>·</span>
              <span>Effort: <strong className={isDark ? "text-white" : "text-slate-900"}>{topAction.effort}</strong></span>
              <span>·</span>
              <span>Cost: <strong className={isDark ? "text-white" : "text-slate-900"}>{topAction.cost}</strong></span>
              <span>·</span>
              <span>
                Readiness Gain:{" "}
                <strong className="text-teal-600 dark:text-cyan-400 font-mono text-sm">+{topAction.gain} Points</strong>
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
            <button
              onClick={() => onNavigateTab("actions")}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-display font-black text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-[0_4px_25px_rgba(6,182,212,0.4)] whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isArabic ? "تنفيذ الإجراء الآن ←" : "ACT NOW →"}</span>
            </button>
            <button
              onClick={() => onNavigateTab("whatif")}
              className={`px-5 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer shadow-sm ${
                isDark
                  ? "bg-slate-950 border-slate-700 hover:border-cyan-400 text-cyan-300"
                  : "bg-white border-slate-300 hover:border-teal-500 text-teal-800"
              }`}
            >
              {isArabic ? "محاكاة الأثر ⚡" : "SIMULATE ⚡"}
            </button>
          </div>
        </div>
      )}

      {/* ── 7. Regulatory Disclaimer ── */}
      <div className={`p-4 rounded-xl border text-[11px] font-mono flex items-start gap-3 ${
        isDark ? "bg-slate-950/60 border-slate-800/80 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
      }`}>
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className={`font-bold uppercase tracking-wider ${
            isDark ? "text-slate-300" : "text-slate-800"
          }`}>
            {isArabic
              ? "تنويه نظامي وإخلاء مسؤولية هندسي:"
              : "TECHNICAL & REGULATORY DISCLAIMER:"}
          </p>
          <p className="leading-relaxed">
            {isArabic
              ? "مؤشر الحالة وجاهزية التصفية درجات تُحسب بمعادلات ثابتة من الملاحظات والتغطية المسجلة (بيانات توضيحية)، ولا تشكل تقريراً هندسياً معتمداً أو شهادة سلامة إنشائية أو ضماناً لأسعار البيع."
              : "Condition Index and Liquidation Readiness are computed by fixed formulas from the recorded findings and coverage (demo data). They do NOT constitute a structural engineering certificate, official safety licence, or guaranteed sale price."}
          </p>
        </div>
      </div>

      {/* ── Defect Drill Down Modal ── */}
      {activeFindingModal && (
        <DefectDrillDownModal
          finding={activeFindingModal}
          onClose={() => setActiveFindingModal(null)}
          onToggleVerification={(id) => {
            onToggleVerification(id);
            setActiveFindingModal((prev) =>
              prev ? { ...prev, verified: !prev.verified } : null
            );
          }}
          onToggleResolved={(id) => {
            onToggleResolved(id);
            setActiveFindingModal((prev) =>
              prev ? { ...prev, isResolved: !prev.isResolved } : null
            );
          }}
          isArabic={isArabic}
        />
      )}
    </div>
  );
};


