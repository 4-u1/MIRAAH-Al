import React, { useState } from "react";
import { Finding, DefectType } from "../../types";
import { GlassCard } from "../common/GlassCard";
import { Badge } from "../common/Badge";
import { DefectDrillDownModal } from "./DefectDrillDownModal";
import { useTheme } from "../../context/ThemeContext";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Filter,
  Camera,
  Layers,
  ArrowRight,
} from "lucide-react";

interface AIFindingsViewProps {
  findings: Finding[];
  onToggleVerification: (findingId: number) => void;
  onToggleResolved: (findingId: number) => void;
  onOpenUploadModal: () => void;
  highlightedFindingId?: number | null;
  onClearHighlight?: () => void;
  isArabic?: boolean;
}

export const AIFindingsView: React.FC<AIFindingsViewProps> = ({
  findings,
  onToggleVerification,
  onToggleResolved,
  onOpenUploadModal,
  highlightedFindingId,
  onClearHighlight,
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<DefectType | "ALL">("ALL");
  const [activeFindingForModal, setActiveFindingForModal] = useState<Finding | null>(null);

  // Auto open modal when targeted from notification
  React.useEffect(() => {
    if (highlightedFindingId) {
      const match = findings.find((f) => f.id === highlightedFindingId);
      if (match) {
        setActiveFindingForModal(match);
        if (selectedFilter !== "ALL" && match.type !== selectedFilter) {
          setSelectedFilter("ALL");
        }
      }
    }
  }, [highlightedFindingId, findings]);

  const categoryLabelsArabic: Record<DefectType, string> = {
    Crack: "تشققات إنشائية",
    Moisture: "تسرب ورطوبة",
    "Surface Damage": "أضرار سطحية",
    "Paint Peeling": "تقشر دهانات",
  };

  const severityLabelsArabic: Record<string, string> = {
    Critical: "حرج",
    Moderate: "متوسط",
    Low: "منخفض",
  };

  const categories: DefectType[] = [
    "Crack",
    "Moisture",
    "Surface Damage",
    "Paint Peeling",
  ];

  const filteredFindings =
    selectedFilter === "ALL"
      ? findings
      : findings.filter((f) => f.type === selectedFilter);

  const sevColors = {
    Critical: isDark ? "#EF4444" : "#DC2626",
    Moderate: isDark ? "#F59E0B" : "#D97706",
    Low: isDark ? "#22C55E" : "#16A34A",
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-300 ${isArabic ? "font-arabic" : "font-sans"}`}>
      {/* ── FR-04: Evidence Traceability Rule Banner ── */}
      <GlassCard className={`p-6 ${isDark ? "border-[#00E5B9]/30" : "border-emerald-500/40"}`} hoverEffect={false} reticles>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 ${
              isDark ? "text-[#00E5B9]" : "text-emerald-700"
            }`}>
              <span className={`w-1.5 h-1.5 ${isDark ? "bg-[#00E5B9]" : "bg-emerald-600"}`}></span>
              {isArabic ? "محرك الذكاء الاصطناعي المكاني (FR-02)" : "AI SPATIAL RECOGNITION (FR-02)"}
            </span>
            <Badge color={isDark ? "#00E5B9" : "#059669"} size="xs" variant="mono">MULTIMODAL V.4</Badge>
            {categories.map((c) => (
              <Badge key={c} color={isDark ? "#60A5FA" : "#2563EB"} size="xs" variant="mono">
                {isArabic ? categoryLabelsArabic[c] : c}
              </Badge>
            ))}
          </div>

          <button
            onClick={onOpenUploadModal}
            className={`px-4 py-2.5 rounded-lg font-display font-black text-xs uppercase tracking-widest hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-md ${
              isDark
                ? "bg-gradient-to-r from-[#00E5B9] to-[#00B894] text-[#050B14] shadow-[0_4px_20px_rgba(0,229,185,0.25)]"
                : "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-[0_4px_14px_rgba(5,150,105,0.3)]"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isArabic ? "رفع وسائط / فحص إطار جديد" : "SCAN MEDIA / INGEST FRAME"}</span>
          </button>
        </div>

        {/* Hard Rule Notice */}
        <div className={`mt-4 p-3.5 rounded-lg border-l-2 border-t border-r border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs ${
          isDark
            ? "bg-[#040812] border-l-[#EF4444] border-white/[0.08]"
            : "bg-rose-50/70 border-l-rose-500 border-rose-200"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-widest ${isDark ? "text-[#EF4444]" : "text-rose-700"}`}>
              {isArabic ? "[معيار إلزامي] لا اعتماد بدون دليل مصور" : "[CRITICAL DIRECTIVE] NO EVIDENCE"}
            </span>
            <span className={isDark ? "text-[#94A3B8]" : "text-slate-400"}>➔</span>
            <span className={`font-black tracking-widest ${isDark ? "text-[#EF4444]" : "text-rose-700"}`}>
              {isArabic ? "لا ملاحظة موثوقة" : "NO TRUSTED FINDING"}
            </span>
          </div>
          <span className={`text-[10px] ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
            {isArabic ? "// كل ملاحظة يجب أن ترتبط بدليل" : "// every finding must link to evidence"}
          </span>
        </div>
      </GlassCard>

      {/* ── Category Filter Bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        <button
          onClick={() => setSelectedFilter("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            selectedFilter === "ALL"
              ? isDark
                ? "bg-[#00C5A0] text-[#070E1C] shadow-[0_0_15px_rgba(0,197,160,0.35)] font-extrabold"
                : "bg-teal-600 text-white shadow-md font-extrabold"
              : isDark
              ? "bg-[#0D1F45] text-[#94A3B8] hover:text-white border border-white/5 font-medium"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 font-medium hover:bg-slate-50"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{isArabic ? "جميع الملاحظات" : "All Findings"}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            isDark ? "bg-black/30 text-slate-300" : "bg-slate-200 text-slate-800"
          }`}>
            {findings.length}
          </span>
        </button>

        {categories.map((cat) => {
          const count = findings.filter((f) => f.type === cat).length;
          const isSelected = selectedFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? isDark
                    ? "bg-[#00C5A0] text-[#070E1C] shadow-[0_0_15px_rgba(0,197,160,0.35)] font-extrabold"
                    : "bg-teal-600 text-white shadow-md font-extrabold"
                  : isDark
                  ? "bg-[#0D1F45] text-[#94A3B8] hover:text-white border border-white/5 font-medium"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 font-medium hover:bg-slate-50"
              }`}
            >
              <span>{isArabic ? categoryLabelsArabic[cat] : cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isDark ? "bg-black/30 text-slate-300" : "bg-slate-200 text-slate-800"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Findings List Cards ── */}
      <div className="space-y-3">
        {filteredFindings.map((finding) => (
          <GlassCard
            key={finding.id}
            onClick={() => setActiveFindingForModal(finding)}
            className={`p-5 transition-all cursor-pointer group ${
              isDark
                ? "hover:border-[#00E5B9]/40 hover:bg-[#070E1C]"
                : "hover:border-teal-500/50 hover:bg-slate-50/90 hover:shadow-md"
            } ${
              finding.isResolved
                ? isDark ? "opacity-60 bg-[#070E1C]/80" : "opacity-60 bg-slate-100"
                : ""
            } ${
              highlightedFindingId === finding.id
                ? isDark
                  ? "ring-2 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] border-red-500/80 bg-red-950/20"
                  : "ring-2 ring-red-500 shadow-md border-red-500 bg-red-50"
                : ""
            }`}
            glow={!finding.isResolved}
            glowColor={`${sevColors[finding.severity]}25`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Side: Severity + Category + Area + Desc */}
              <div className="flex items-start gap-4 flex-1">
                {/* Vertical Severity Bar */}
                <div
                  className="w-1.5 h-16 rounded-full shrink-0 shadow-sm"
                  style={{
                    backgroundColor: sevColors[finding.severity],
                  }}
                />

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className="px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wide"
                      style={{
                        backgroundColor: `${sevColors[finding.severity]}18`,
                        border: `1px solid ${sevColors[finding.severity]}40`,
                        color: sevColors[finding.severity],
                      }}
                    >
                      {isArabic ? `${severityLabelsArabic[finding.severity] || finding.severity} • ${categoryLabelsArabic[finding.type] || finding.type}` : finding.type}
                    </span>

                    <h4 className={`text-sm font-bold transition-colors flex items-center gap-2 ${
                      isDark ? "text-white group-hover:text-[#00E5B9]" : "text-slate-900 group-hover:text-teal-700"
                    }`}>
                      <span>{finding.area}</span>
                      <span className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${
                        isDark ? "text-[#00E5B9]" : "text-teal-600"
                      }`}>
                        {isArabic ? "[اضغط للتفاصيل ➔]" : "[CLICK TO DRILL DOWN ➔]"}
                      </span>
                    </h4>

                    <span className={`text-xs font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                      #{String(finding.id).padStart(3, "0")}
                    </span>

                    {finding.isResolved && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isDark
                          ? "bg-green-900/50 text-green-300 border-green-500/30"
                          : "bg-emerald-50 text-emerald-800 border-emerald-300"
                      }`}>
                        {isArabic ? "تمت المعالجة ✓" : "RESOLVED ✓"}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-2 ${
                    isDark ? "text-[#94A3B8]" : "text-slate-600 font-medium"
                  }`}>
                    {finding.description}
                  </p>

                  <div className={`text-[11px] font-mono flex items-center gap-2 ${
                    isDark ? "text-[#60A5FA]" : "text-blue-700 font-semibold"
                  }`}>
                    <span>💡 <strong>{isArabic ? "التوصية الفنية:" : "Recommendation:"}</strong> {finding.recommendation}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: AI Confidence + Frame count + Verification Button + View Frame */}
              <div className={`flex items-center gap-4 shrink-0 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 ${
                isDark ? "border-white/5" : "border-slate-200"
              }`}>
                {/* AI Confidence Meter */}
                <div className="text-center px-3">
                  <div
                    className="text-lg font-extrabold font-mono"
                    style={{
                      color: finding.conf > 80
                        ? (isDark ? "#00C5A0" : "#0D9488")
                        : (isDark ? "#F59E0B" : "#D97706"),
                    }}
                  >
                    {finding.conf}%
                  </div>
                  <div className={`text-[10px] uppercase font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                    {isArabic ? "دقة الذكاء" : "AI Conf"}
                  </div>
                </div>

                {/* Evidence Frames Count */}
                <div className="text-center px-3">
                  <div className={`text-lg font-extrabold font-mono ${isDark ? "text-[#60A5FA]" : "text-blue-600"}`}>
                    {finding.frames}
                  </div>
                  <div className={`text-[10px] uppercase font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                    {isArabic ? "إطارات الأدلة" : "Frames"}
                  </div>
                </div>

                {/* Human Verification Badge / Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVerification(finding.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 cursor-pointer ${
                    finding.verified
                      ? isDark
                        ? "bg-green-500/15 border-green-500/40 text-green-400 hover:bg-green-500/25"
                        : "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                      : isDark
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25"
                      : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  {finding.verified ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isArabic ? "تم التحقق" : "✓ USER-VERIFIED"}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{isArabic ? "يتطلب مراجعة" : "⚠ NEEDS REVIEW"}</span>
                    </>
                  )}
                </button>

                {/* Drill-down / Inspect Frame Modal Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFindingForModal(finding);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer ${
                    isDark
                      ? "bg-[#00E5B9]/15 hover:bg-[#00E5B9]/30 border-[#00E5B9]/30 text-[#00E5B9]"
                      : "bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-800 shadow-sm"
                  }`}
                  title={isArabic ? "عرض الأدلة والصور والتوصيات" : "Drill down into defect metadata"}
                >
                  <Eye className="w-4 h-4" />
                  <span>{isArabic ? "تفاصيل" : "DRILL DOWN"}</span>
                </button>

                {/* Resolve / Unresolve defect */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleResolved(finding.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                    finding.isResolved
                      ? isDark
                        ? "bg-white/10 hover:bg-white/20 text-[#94A3B8] border-transparent"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                      : isDark
                      ? "bg-white/5 hover:bg-white/15 text-white border-white/10"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm"
                  }`}
                >
                  {finding.isResolved ? (isArabic ? "إعادة فتح" : "Reopen") : (isArabic ? "معالجة" : "Resolve")}
                </button>
              </div>
            </div>
          </GlassCard>
        ))}

        {filteredFindings.length === 0 && (
          <div className={`p-12 text-center rounded-2xl border ${
            isDark ? "text-[#94A3B8] bg-[#0D1F45]/40 border-white/5" : "text-slate-500 bg-white border-slate-200 shadow-sm"
          }`}>
            <Sparkles className="w-8 h-8 text-[#00C5A0] mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm">
              {isArabic ? "لا توجد ملاحظات في هذا التصنيف" : "No findings in this category"}
            </p>
          </div>
        )}
      </div>

      {/* ── Evidence Chain Visualization (FR-05) ── */}
      <GlassCard className={`p-6 ${isDark ? "border-[#00C5A0]/20" : "border-slate-200"}`} hoverEffect={false}>
        <div className="flex items-center justify-between mb-4">
          <div className={`text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-2 ${
            isDark ? "text-[#00C5A0]" : "text-teal-700"
          }`}>
            <Layers className="w-4 h-4" />
            <span>{isArabic ? "سلسلة الأدلة والتحقق البشري (FR-05)" : "EVIDENCE CHAIN & VALIDATION WORKFLOW"}</span>
          </div>
          <Badge color={isDark ? "#00C5A0" : "#0D9488"}>{isArabic ? "تدقيق نظامي FR-05" : "FR-05 Validation"}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border space-y-1 ${
            isDark ? "bg-[#2563EB]/15 border-[#2563EB]/35" : "bg-blue-50/70 border-blue-200"
          }`}>
            <div className={`text-xs font-bold font-mono ${isDark ? "text-[#60A5FA]" : "text-blue-800"}`}>
              {isArabic ? "1. كشف الذكاء الاصطناعي متعدد الوسائط" : "1. Multimodal AI Detection"}
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
              {isArabic
                ? "يحلل نموذج الرؤية المكانية إطارات الفيديو والمسح الحراري لتحديد العيوب ودرجة الثقة."
                : "Planned: a vision model would analyse frames. In this prototype findings come from demo data or manual labels."}
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 relative ${
            isDark ? "bg-[#0D2045] border-[#00C5A0]/35" : "bg-teal-50/70 border-teal-200"
          }`}>
            <div className={`text-xs font-bold font-mono ${isDark ? "text-[#00E8BE]" : "text-teal-800"}`}>
              {isArabic ? "2. ربط الأدلة المكانية (FR-04)" : "2. Evidence Linking (FR-04)"}
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
              {isArabic
                ? "يتم ربط كل ملاحظة بإطار فيديو عالي الدقة، الطابع الزمني، وزاوية الكاميرا في الفضاء ثلاثي الأبعاد."
                : "Every finding is permanently linked to high-res video frame, timestamp, and camera angle."}
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 ${
            isDark ? "bg-green-950/20 border-green-500/35" : "bg-emerald-50/70 border-emerald-200"
          }`}>
            <div className={`text-xs font-bold font-mono ${isDark ? "text-green-400" : "text-emerald-800"}`}>
              {isArabic ? "3. تحقق المستخدم من الملاحظة" : "3. User verification"}
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
              {isArabic
                ? "يقوم مهندس مرخص من هيئة المهندسين بمراجعة الملاحظات وتوثيقها أو تعديلها نظامياً."
                : "A signed-in user verifies or dismisses findings (licensed-engineer roles are planned)."}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Defect Drill Down Modal */}
      {activeFindingForModal && (
        <DefectDrillDownModal
          finding={activeFindingForModal}
          onClose={() => setActiveFindingForModal(null)}
          onToggleVerification={(id) => {
            onToggleVerification(id);
            setActiveFindingForModal((prev) =>
              prev ? { ...prev, verified: !prev.verified } : null
            );
          }}
          onToggleResolved={(id) => {
            onToggleResolved(id);
            setActiveFindingForModal((prev) =>
              prev ? { ...prev, isResolved: !prev.isResolved } : null
            );
          }}
          isArabic={isArabic}
        />
      )}
    </div>
  );
};
