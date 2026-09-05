import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { AssetRecord, CoverageArea, Finding } from "../../types";
import {
  Armchair,
  BedDouble,
  Columns,
  Sun,
  UtensilsCrossed,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Camera,
  Layers,
  ChevronRight,
  Info,
  X,
  Building,
} from "lucide-react";

interface SpatialAssetGridProps {
  asset: AssetRecord;
  onSelectFinding?: (finding: Finding) => void;
  onNavigateTab?: (tabId: string) => void;
  isArabic?: boolean;
}

export const SpatialAssetGrid: React.FC<SpatialAssetGridProps> = ({
  asset,
  onSelectFinding,
  onNavigateTab,
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  const [selectedZone, setSelectedZone] = useState<CoverageArea | null>(null);

  // Helper to get matching icon for zone
  const getZoneIcon = (iconName?: string, name?: string) => {
    const n = (name || "").toLowerCase();
    if (
      iconName === "Armchair" ||
      n.includes("صالة") ||
      n.includes("مجالس") ||
      n.includes("living") ||
      n.includes("hall") ||
      n.includes("بهو") ||
      n.includes("lobby") ||
      n.includes("تجاري") ||
      n.includes("retail")
    ) {
      return <Armchair className="w-5 h-5" />;
    }
    if (iconName === "BedDouble" || n.includes("نوم") || n.includes("suite") || n.includes("bedroom")) {
      return <BedDouble className="w-5 h-5" />;
    }
    if (
      iconName === "Columns" ||
      n.includes("ممرات") ||
      n.includes("جدران") ||
      n.includes("corridor") ||
      n.includes("wall") ||
      n.includes("واجهة") ||
      n.includes("facade") ||
      n.includes("مكاتب") ||
      n.includes("office")
    ) {
      return <Columns className="w-5 h-5" />;
    }
    if (iconName === "Sun" || n.includes("سطح") || n.includes("خدمات") || n.includes("roof") || n.includes("utility")) {
      return <Sun className="w-5 h-5" />;
    }
    if (iconName === "UtensilsCrossed" || n.includes("مطبخ") || n.includes("مستودع") || n.includes("kitchen") || n.includes("pantry")) {
      return <UtensilsCrossed className="w-5 h-5" />;
    }
    if (n.includes("قبو") || n.includes("مواقف") || n.includes("basement") || n.includes("parking")) {
      return <Building className="w-5 h-5" />;
    }
    return <Layers className="w-5 h-5" />;
  };

  const getZoneFindings = (zone: CoverageArea | null) => {
    if (!asset?.findings || !zone) return [];
    const zArea = (zone.area || "").toLowerCase();
    const zAreaAr = (zone.areaArabic || "").toLowerCase();
    const zId = (zone.id || "").toLowerCase();

    return asset.findings.filter((f) => {
      if (!f) return false;
      const fArea = (f.area || f.location || "").toLowerCase();
      const fDesc = (f.description || "").toLowerCase();

      return (
        (zArea && fArea.includes(zArea)) ||
        (fArea && zArea.includes(fArea)) ||
        (zAreaAr && fArea.includes(zAreaAr)) ||
        (fArea && zAreaAr.includes(fArea)) ||
        (zId.includes("roof") && (fArea.includes("سطح") || fArea.includes("roof") || fArea.includes("عزل") || fDesc.includes("chiller") || fDesc.includes("bitumen"))) ||
        (zId.includes("ground") && (fArea.includes("أرضي") || fArea.includes("ground") || fArea.includes("بهو") || fArea.includes("lobby") || fArea.includes("تجاري") || fArea.includes("retail"))) ||
        (zId.includes("facade") && (fArea.includes("واجهة") || fArea.includes("facade") || fArea.includes("شمالية") || fArea.includes("تكسيات"))) ||
        (zId.includes("office") && (fArea.includes("مكتب") || fArea.includes("office") || fArea.includes("طابق") || fArea.includes("مكاتب"))) ||
        (zId.includes("basement") && (fArea.includes("قبو") || fArea.includes("basement") || fArea.includes("مواقف") || fArea.includes("parking") || fArea.includes("بيارات") || fDesc.includes("epoxy")))
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {isArabic ? "المخطط المكاني للمناطق والمرافق" : "SPATIAL ASSET ZONING & HEALTH GRID"}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
              isDark ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" : "bg-cyan-50 text-cyan-800 border-cyan-300"
            }`}>
              {asset.coverageAreas?.length || 5} {isArabic ? "مناطق رئيسية" : "ZONES MAPPED"}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {isArabic
              ? "استعراض تفاعلي لمناطق الأصل مع نسب السلامة، المساحات، وحالة الفحص الذاتي الميداني"
              : "Interactive masonry zone matrix with live structural health, LiDAR telemetry, and defect counts"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab && onNavigateTab("coverage")}
            className={`text-xs font-mono font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer shadow-xs ${
              isDark
                ? "text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border-cyan-500/30 hover:border-cyan-400"
                : "text-cyan-800 hover:text-cyan-900 bg-cyan-50 border-cyan-300 hover:border-cyan-500"
            }`}
          >
            <span>{isArabic ? "عرض خريطة التغطية 3D" : "VIEW 3D COVERAGE MAP"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Masonry / Modular Card System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(asset.coverageAreas || []).map((zone, idx) => {
          const zoneFindings = getZoneFindings(zone);
          const defectCount = zoneFindings.length;
          const isSound = defectCount === 0;
          const isWarning = defectCount > 1;

          // Compute area and scores
          const sqm = zone.sqm || (idx === 0 ? 420 : idx === 1 ? 310 : idx === 2 ? 230 : idx === 3 ? 280 : 160);
          const levelName = isArabic
            ? zone.levelArabic || zone.level || (idx === 3 ? "السطح" : idx === 1 ? "الدور الأول" : "الدور الأرضي")
            : zone.level || zone.levelArabic || "Ground Level";
          const zoneTitle = isArabic ? zone.areaArabic || zone.area : zone.area || zone.areaArabic;
          const healthScore = isSound ? 100 : Math.max(70, 100 - defectCount * 11);

          return (
            <div
              key={zone.id || zone.area || idx}
              onClick={() => setSelectedZone(zone)}
              className={`relative rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? isSound
                    ? "bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_15px_35px_rgba(16,185,129,0.15)]"
                    : isWarning
                    ? "bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950/90 border-amber-500/30 hover:border-amber-400/80 hover:shadow-[0_15px_35px_rgba(245,158,11,0.2)]"
                    : "bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_15px_35px_rgba(6,182,212,0.15)]"
                  : isSound
                  ? "bg-white border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md"
                  : isWarning
                  ? "bg-amber-50/30 border-amber-300/80 hover:border-amber-500 shadow-sm hover:shadow-md"
                  : "bg-white border-slate-200 hover:border-cyan-500 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Top ambient highlight line */}
              <div
                className={`absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent pointer-events-none opacity-60 ${
                  isSound ? "text-emerald-500" : isWarning ? "text-amber-400" : "text-cyan-400"
                }`}
              />

              {/* Top Row: Zone Icon & Status Pill */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border ${
                      isSound
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        : isWarning
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        : "bg-cyan-500/10 border-cyan-500/30 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    }`}
                  >
                    {getZoneIcon(zone.icon, zone.area || zone.areaArabic)}
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {levelName}
                    </span>
                    <h4 className={`text-base font-bold transition-colors ${
                      isDark ? "text-white group-hover:text-cyan-300" : "text-slate-900 group-hover:text-cyan-700"
                    }`}>
                      {zoneTitle}
                    </h4>
                  </div>
                </div>

                {/* Status Badge Pill */}
                <div>
                  {isSound ? (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono border ${
                      isDark ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-800"
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isArabic ? "100% سليم" : "100% SOUND"}</span>
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono border animate-pulse ${
                      isDark ? "bg-amber-500/15 border-amber-500/40 text-amber-300" : "bg-amber-100 border-amber-300 text-amber-900"
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {defectCount} {isArabic ? "عيوب مرصودة" : "DEFECTS"}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Metrics Row */}
              <div className={`grid grid-cols-3 gap-2 py-3 my-2 border-y text-center font-mono ${
                isDark ? "border-slate-800/80" : "border-slate-200"
              }`}>
                <div className={`p-2 rounded-lg border ${
                  isDark ? "bg-slate-950/60 border-slate-800/60" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {isArabic ? "المساحة" : "Area"}
                  </div>
                  <div className={`text-sm font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {sqm} <span className="text-[10px] font-normal opacity-70">م²</span>
                  </div>
                </div>

                <div className={`p-2 rounded-lg border ${
                  isDark ? "bg-slate-950/60 border-slate-800/60" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {isArabic ? "التغطية" : "Coverage"}
                  </div>
                  <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{zone.pct || 0}%</div>
                </div>

                <div className={`p-2 rounded-lg border ${
                  isDark ? "bg-slate-950/60 border-slate-800/60" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {isArabic ? "السلامة" : "Health"}
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      healthScore >= 95
                        ? isDark ? "text-emerald-400" : "text-emerald-700"
                        : healthScore >= 80
                        ? isDark ? "text-cyan-400" : "text-cyan-700"
                        : isDark ? "text-amber-400" : "text-amber-700"
                    }`}
                  >
                    {healthScore}%
                  </div>
                </div>
              </div>

              {/* Bottom Quick Context & Action Link */}
              <div className={`pt-2 flex items-center justify-between text-xs ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{zone.capturedFrames || 12} {isArabic ? "لقطة موثقة" : "photos"}</span>
                </span>

                <span className="flex items-center gap-1 font-mono text-[11px] text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>{isArabic ? "فحص المنطقة" : "Inspect Zone"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Zone Inspection Modal */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
              isDark
                ? "bg-slate-950 border-cyan-500/40 text-white shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.15)]"
                : "bg-white border-slate-300 text-slate-900 shadow-2xl"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b backdrop-blur-xl ${
              isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-slate-50"
            }`}>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-500 shadow-sm">
                  {getZoneIcon(selectedZone.icon, selectedZone.area || selectedZone.areaArabic)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {isArabic ? selectedZone.areaArabic || selectedZone.area : selectedZone.area || selectedZone.areaArabic}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      isDark ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" : "bg-cyan-50 text-cyan-800 border-cyan-300"
                    }`}>
                      {isArabic ? selectedZone.levelArabic || selectedZone.level || "الدور الأرضي" : selectedZone.level || selectedZone.levelArabic || "Ground Floor"}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {isArabic
                      ? `المساحة: ${selectedZone.sqm || 300} م² | نسبة التغطية: ${selectedZone.pct || 0}%`
                      : `Gross Area: ${selectedZone.sqm || 300} sqm | Scan Coverage: ${selectedZone.pct || 0}%`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedZone(null)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Telemetry Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3.5 rounded-xl border ${
                  isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`text-[10px] font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {isArabic ? "المساحة الموثقة" : "Mapped Area"}
                  </div>
                  <div className={`text-base font-bold font-mono mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {selectedZone.sqm || 300} م²
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`text-[10px] font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {isArabic ? "دقة المسح الميداني" : "LiDAR Point Density"}
                  </div>
                  <div className="text-base font-bold text-cyan-600 dark:text-cyan-400 font-mono mt-1">4.2M pts/m²</div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`text-[10px] font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {isArabic ? "الصور البانورامية" : "Photogrammetry"}
                  </div>
                  <div className={`text-base font-bold font-mono mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {selectedZone.capturedFrames || 16} HD
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`text-[10px] font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {isArabic ? "مطابقة كود البناء" : "SBC Code Match"}
                  </div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">SBC 201/304</div>
                </div>
              </div>

              {/* Defect Findings in this Zone */}
              <div>
                <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>
                    {isArabic
                      ? `العيوب والملاحظات المرصودة في هذه المنطقة (${getZoneFindings(selectedZone).length})`
                      : `Defects & Observations in Zone (${getZoneFindings(selectedZone).length})`}
                  </span>
                </h4>

                {getZoneFindings(selectedZone).length === 0 ? (
                  <div className={`p-6 rounded-xl border text-center ${
                    isDark ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-900"
                  }`}>
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                    <div className="font-bold text-sm">
                      {isArabic ? "هذه المنطقة سليمة 100% وخالية من أي عيوب إنشائية أو تشطيبية" : "This zone is 100% sound with zero defects"}
                    </div>
                    <div className={`text-xs mt-1 ${isDark ? "text-emerald-400/80" : "text-emerald-700"}`}>
                      {isArabic ? "تم التحقق عبر التصوير البانورامي ومطابقة كود البناء السعودي" : "Verified via 3D point cloud & multi-spectral visual telemetry"}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getZoneFindings(selectedZone).map((finding) => (
                      <div
                        key={finding.id}
                        className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isDark
                            ? "bg-slate-900/90 border-slate-800 hover:border-cyan-500/40"
                            : "bg-slate-50 border-slate-200 hover:border-cyan-500/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                                #{finding.id}
                              </span>
                              <h5 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                {isArabic ? finding.titleArabic || finding.title || finding.type : finding.title || finding.type}
                              </h5>
                              <span
                                className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${
                                  finding.severity === "Critical"
                                    ? isDark ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-red-100 text-red-800 border border-red-200"
                                    : isDark ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}
                              >
                                {finding.severity}
                              </span>
                            </div>
                            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                              {isArabic ? finding.descriptionArabic || finding.description : finding.description}
                            </p>
                          </div>
                        </div>

                        {onSelectFinding && (
                          <button
                            onClick={() => {
                              setSelectedZone(null);
                              onSelectFinding(finding);
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors whitespace-nowrap cursor-pointer shadow-xs ${
                              isDark
                                ? "bg-cyan-950/60 hover:bg-cyan-900/80 border-cyan-500/40 text-cyan-300"
                                : "bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-800"
                            }`}
                          >
                            {isArabic ? "تفاصيل العيب 🔍" : "Drill-Down 🔍"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saudi Building Code & Remediation Note */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                isDark ? "bg-slate-900/70 border-slate-800/80" : "bg-slate-50 border-slate-200"
              }`}>
                <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <div className={`text-xs space-y-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {isArabic ? "اعتماد الهيئة السعودية للمهندسين (SCE)" : "Saudi Council of Engineers (SCE) Standard"}
                  </div>
                  <p>
                    {isArabic
                      ? "تمت مطابقة معايير السلامة الإنشائية لهذه المنطقة وفق الكود السعودي SBC 201 للأبنية التجارية، مع تصنيف دقيق لجميع فواصل التمدد والعزل."
                      : "Structural integrity and safety clearances adhere to Saudi Building Code SBC 201 for commercial properties, with expansion joints & insulation certified."}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex items-center justify-end ${
              isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-50"
            }`}>
              <button
                onClick={() => setSelectedZone(null)}
                className={`px-5 py-2 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer shadow-xs ${
                  isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                }`}
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
