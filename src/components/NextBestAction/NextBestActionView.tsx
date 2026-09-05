import React, { useState } from "react";
import { ActionItem } from "../../types";
import { GlassCard } from "../common/GlassCard";
import { Badge } from "../common/Badge";
import { useTheme } from "../../context/ThemeContext";
import confetti from "canvas-confetti";
import {
  Target,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Zap,
  Check,
  ShieldAlert,
  Table,
  Layers,
} from "lucide-react";
import { CommandCenterSLAMatrix } from "./CommandCenterSLAMatrix";

interface NextBestActionViewProps {
  actions: ActionItem[];
  onExecuteAction: (actionId: string) => void;
  isArabic?: boolean;
}

export const NextBestActionView: React.FC<NextBestActionViewProps> = ({
  actions,
  onExecuteAction,
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<"command_center" | "table_view">("command_center");

  const impColor: Record<string, string> = {
    High: "#00C5A0",
    Medium: "#F59E0B",
    Low: "#60A5FA",
  };

  const handleActionClick = (action: ActionItem) => {
    // Trigger celebratory particle confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#00C5A0", "#00E8BE", "#60A5FA", "#F59E0B"],
    });

    onExecuteAction(action.id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Sub-Navigation Bar ── */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl border backdrop-blur-xl ${
        isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/90 border-slate-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("command_center")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "command_center"
                ? isDark
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-900"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${isDark ? "text-red-400" : activeSubTab === "command_center" ? "text-white" : "text-red-600"}`} />
            <span>{isArabic ? "مركز القيادة ومصفوفة SLA (Command Center)" : "Command Center & SLA Matrix"}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
              isDark ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-800 font-bold"
            }`}>
              Live Radar
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("table_view")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "table_view"
                ? isDark
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-900"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Table className="w-4 h-4" />
            <span>{isArabic ? "جدول خطة التدخل المالي والجهد (FR-15)" : "Intervention Action Table (FR-15)"}</span>
          </button>
        </div>

        <div className={`text-xs font-mono px-3 hidden sm:block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {isArabic ? "محرك الجاهزية للتسييل العقاري" : "Liquidation Readiness Engine"}
        </div>
      </div>

      {/* ── Active View Mode ── */}
      {activeSubTab === "command_center" && (
        <CommandCenterSLAMatrix
          actions={actions}
          isArabic={isArabic}
          onExecuteAction={onExecuteAction}
        />
      )}

      {activeSubTab === "table_view" && (
        <GlassCard className="p-6 lg:p-8" glow glowColor={isDark ? "rgba(0,197,160,0.15)" : "rgba(13,148,136,0.12)"}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-6 ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}>
            <div>
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-mono ${
                isDark ? "text-[#00C5A0]" : "text-teal-700"
              }`}>
                <Target className="w-4 h-4" />
                <span>{isArabic ? "محرك ترتيب الإجراءات الأفضل (FR-15)" : "NEXT BEST ACTION ENGINE"}</span>
              </div>
              <h2 className={`text-xl font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                {isArabic ? "خطة التدخل الأمثل المُرتبة حسب العائد والجهد" : "Prioritized Liquidation Readiness Action Plan"}
              </h2>
              <p className={`text-xs font-mono mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                Ranked by: Priority = Impact × (1 / Effort) × Risk_Reduction
              </p>
            </div>

            <Badge color="#00C5A0">FR-15 Optimizer</Badge>
          </div>

          {/* ── Table Layout ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] uppercase font-mono font-bold tracking-wider ${
                  isDark ? "border-white/10 text-[#94A3B8]" : "border-slate-200 text-slate-600 bg-slate-50"
                }`}>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">{isArabic ? "الإجراء المقترح" : "Action Recommendation"}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? "الأثر" : "Impact"}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? "الجهد" : "Effort"}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? "التكلفة" : "Cost"}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? "عائد الجاهزية" : "Readiness Gain"}</th>
                  <th className="py-3 px-4 text-right">{isArabic ? "التنفيذ" : "Execute"}</th>
                </tr>
              </thead>

              <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-200"}`}>
                {actions.map((act) => {
                  const isCompleted = act.completed;
                  return (
                    <tr
                      key={act.id}
                      className={`transition-colors ${
                        isCompleted
                          ? isDark ? "bg-green-950/15 opacity-70" : "bg-emerald-50/60 opacity-80"
                          : isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Priority Badge */}
                      <td className="py-4 px-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shadow-lg ${
                            act.n === 1
                              ? "bg-gradient-to-br from-[#00C5A0] to-[#00E8BE] text-[#06101E] shadow-[#00C5A0]/30"
                              : act.n === 2
                              ? "bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white shadow-[#2563EB]/30"
                              : "bg-gradient-to-br from-[#F59E0B] to-[#FCD34D] text-[#06101E] shadow-[#F59E0B]/30"
                          }`}
                        >
                          #{act.n}
                        </div>
                      </td>

                      {/* Action Name & Detail */}
                      <td className="py-4 px-4">
                        <div className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                          {isArabic ? act.actionArabic : act.action}
                        </div>
                        <div className={`text-xs mt-0.5 max-w-md ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                          {act.details}
                        </div>
                      </td>

                      {/* Impact */}
                      <td className="py-4 px-4 text-center">
                        <Badge color={impColor[act.impact]}>{act.impact}</Badge>
                      </td>

                      {/* Effort */}
                      <td className="py-4 px-4 text-center">
                        <Badge
                          color={
                            act.effort === "Low"
                              ? "#00C5A0"
                              : act.effort === "Medium"
                              ? "#F59E0B"
                              : "#EF4444"
                          }
                        >
                          {act.effort}
                        </Badge>
                      </td>

                      {/* Cost */}
                      <td className="py-4 px-4 text-center">
                        <Badge
                          color={
                            act.cost === "Low"
                              ? "#00C5A0"
                              : act.cost === "Medium"
                              ? "#F59E0B"
                              : "#EF4444"
                          }
                        >
                          {act.cost}
                        </Badge>
                      </td>

                      {/* Gain */}
                      <td className="py-4 px-4 text-center">
                        <span className={`text-base font-extrabold font-mono ${
                          isDark ? "text-[#00C5A0] drop-shadow-[0_0_8px_rgba(0,197,160,0.6)]" : "text-teal-700"
                        }`}>
                          {act.gain}
                        </span>
                      </td>

                      {/* Execute Action Button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleActionClick(act)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto whitespace-nowrap cursor-pointer ${
                            isCompleted
                              ? isDark
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-gradient-to-r from-[#00C5A0] to-[#00E8BE] text-[#06101E] hover:opacity-90 shadow-md shadow-[#00C5A0]/20"
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              <span>{isArabic ? "تنفيذ" : "Execute"}</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ── FR-18: Continuous Action Plan Loop ── */}
      <div className={`p-6 rounded-3xl border space-y-4 backdrop-blur-xl ${
        isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex items-center justify-between">
          <div className={`text-xs font-bold uppercase font-mono flex items-center gap-2 ${
            isDark ? "text-slate-300" : "text-slate-800"
          }`}>
            <RefreshCw className={`w-4 h-4 ${isDark ? "text-[#00C5A0]" : "text-teal-700"}`} />
            <span>{isArabic ? "دورة التحسين المستمر لرفع الجاهزية (FR-18)" : "ACTION PLAN → REASSESSMENT CONTINUOUS LOOP"}</span>
          </div>
          <span className={`text-[11px] font-mono ${isDark ? "text-cyan-400" : "text-teal-700 font-semibold"}`}>
            Detect → Prioritize SLA → Dispatch → Reassess
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              step: "1",
              label: isArabic ? "رصد تأخيرات SLA" : "Detect SLA Breaches",
              desc: isArabic ? "تحديد البنود الحرجة والفورية" : "Prioritize overdue actions",
              color: "#EF4444",
            },
            {
              step: "2",
              label: isArabic ? "التكليف التلقائي للمقاول" : "Auto-Dispatch Contractor",
              desc: isArabic ? "إرسال المهام عبر Field API" : "Instant work order generation",
              color: "#F59E0B",
            },
            {
              step: "3",
              label: isArabic ? "التحقق الميداني والاعتماد" : "Field Signoff & In Situ",
              desc: isArabic ? "اعتماد المهندس والختم الرقمي" : "SBC engineer verification",
              color: "#60A5FA",
            },
            {
              step: "4",
              label: isArabic ? "إعادة حساب التقييم الفوري" : "Instant Dynamic Valuation",
              desc: isArabic ? "ارتفاع الجاهزية وتقليص مدة البيع" : "Zero friction asset liquidation",
              color: "#00C5A0",
            },
          ].map((s, idx) => (
            <div
              key={s.step}
              className="p-4 rounded-2xl border flex flex-col justify-between transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: isDark ? `${s.color}0D` : `${s.color}10`,
                borderColor: `${s.color}30`,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs"
                    style={{
                      backgroundColor: `${s.color}30`,
                      color: s.color,
                    }}
                  >
                    {s.step}
                  </span>
                  {idx < 3 && (
                    <ArrowRight className={`w-3.5 h-3.5 ${isDark ? "text-cyan-400" : "text-slate-400"}`} />
                  )}
                </div>
                <div className={`font-bold text-xs font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>{s.label}</div>
                <div className={`text-[11px] mt-1 font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

