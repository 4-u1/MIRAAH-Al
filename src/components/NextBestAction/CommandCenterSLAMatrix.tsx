import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Flame,
  UserCheck,
  Send,
  RefreshCw,
  TrendingUp,
  Radio,
  Building2,
  Cpu,
  ChevronRight,
  Filter,
  Check,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { ActionItem, SLAAlertItem, SLAStatus, SLATier } from "../../types";
import { SimulatedBadge } from "../common/DemoDataBanner";

interface CommandCenterSLAMatrixProps {
  actions: ActionItem[];
  isArabic: boolean;
  onExecuteAction: (actionId: string) => void;
}

// Default initial SLA items corresponding to the asset actions
const DEFAULT_SLA_ALERTS: SLAAlertItem[] = [
  {
    id: "sla-1",
    actionId: "act-1",
    title: "Seal Roof MEP Condensation Drainage & Pooling",
    titleArabic: "معالجة صرف تكثيف التكييف بالسطح ومنع تجمع المياه",
    zone: "Roof & MEP Services Deck",
    tier: "Tier 1 (Critical SBC)",
    slaStatus: "OVERDUE",
    deadlineHoursRemaining: -5.5,
    totalSlaHours: 24,
    assignee: "Eng. Zaid Al-Harthy",
    assigneeRole: "Chief Structural Specialist",
    assigneeRoleArabic: "كبير مهندسي السلامة والإنشاء",
    valueAtRiskSar: 180000,
    gainNum: 6,
    breachPenaltyDesc: "Inspection Delinquency Hold · SBC 601 Risk",
    breachPenaltyDescArabic: "تجميد شهادة الجاهزية للتسييل · مخالفة كود SBC 601",
    acknowledged: false,
  },
  {
    id: "sla-2",
    actionId: "act-2",
    title: "Renew Parapet Polyurethane Expansion Joint Seal",
    titleArabic: "تجديد فواصل تمدد السطح والسترة بمادة البولي يوريثان",
    zone: "Roof Perimeter & Parapet Wall",
    tier: "Tier 2 (Municipal/Legal)",
    slaStatus: "EXPIRING_SOON",
    deadlineHoursRemaining: 3.8,
    totalSlaHours: 24,
    assignee: "Sultan Al-Otaibi",
    assigneeRole: "Waterproofing Contractor Liaison",
    assigneeRoleArabic: "مسؤول مقاول العزل وضبط الجودة",
    valueAtRiskSar: 120000,
    gainNum: 4,
    breachPenaltyDesc: "Readiness Score Degradation (-4 pts)",
    breachPenaltyDescArabic: "انخفاض مؤشر الجاهزية للتسييل بمقدار 4 نقاط",
    acknowledged: true,
  },
  {
    id: "sla-3",
    actionId: "act-3",
    title: "Synchronize Balady 2026 Digital Compliance Certificate",
    titleArabic: "ربط واعتماد شهادة الامتثال البلدي الرقمية 2026",
    zone: "Municipal Governance Portal",
    tier: "Tier 2 (Municipal/Legal)",
    slaStatus: "EXPIRING_SOON",
    deadlineHoursRemaining: 8.2,
    totalSlaHours: 48,
    assignee: "MOMRAH Gateway API",
    assigneeRole: "Digital Compliance Custodian",
    assigneeRoleArabic: "مسؤول الربط والاعتماد البلدي",
    valueAtRiskSar: 240000,
    gainNum: 4,
    breachPenaltyDesc: "Title Deed Escrow Transfer Delay (4-7 Days)",
    breachPenaltyDescArabic: "تأخر الإفراغ العقاري والضمان المالي (4-7 أيام)",
    acknowledged: true,
  },
  {
    id: "sla-4",
    actionId: "act-4",
    title: "Calibrate Basement Vibration Sensor Nodes",
    titleArabic: "معايرة مجسات الاهتزاز الزلزالي بالقبو (SBC 301)",
    zone: "Sub-grade Basement Slab B-01",
    tier: "Tier 1 (Critical SBC)",
    slaStatus: "OVERDUE",
    deadlineHoursRemaining: -12.0,
    totalSlaHours: 24,
    assignee: "IoT Telemetry Lead",
    assigneeRole: "Sensor Diagnostic Unit",
    assigneeRoleArabic: "فريق المعايرة والتشخيص الحسي",
    valueAtRiskSar: 95000,
    gainNum: 3,
    breachPenaltyDesc: "Telemetry Loss Penalty · Due Diligence Audit Flag",
    breachPenaltyDescArabic: "فقدان النبض اللحظي · ملاحظة تدقيق فني معلقة",
    acknowledged: false,
  },
  {
    id: "sla-5",
    actionId: "act-5",
    title: "Verify Ground Floor Column C-04 Microstrain Gauge",
    titleArabic: "التحقق الميداني من إجهاد العمود الخرساني C-04",
    zone: "Ground Floor Center Column",
    tier: "Tier 1 (Critical SBC)",
    slaStatus: "ON_TRACK",
    deadlineHoursRemaining: 34.5,
    totalSlaHours: 48,
    assignee: "Eng. Tariq Al-Mansoor",
    assigneeRole: "Structural Integrity Inspector",
    assigneeRoleArabic: "مفتش السلامة الإنشائية المعتمد",
    valueAtRiskSar: 160000,
    gainNum: 5,
    breachPenaltyDesc: "None (Within Buffer Window)",
    breachPenaltyDescArabic: "لا توجد (ضمن النطاق الزمني الآمن)",
    acknowledged: true,
  },
  {
    id: "sla-6",
    actionId: "act-6",
    title: "Complete Thermal Infrared Scan of LV Main Breakers",
    titleArabic: "استكمال المسح الحراري بالأشعة تحت الحمراء للوحة القواطع",
    zone: "Main Electrical Switchgear Room",
    tier: "Tier 3 (MEP/Thermal)",
    slaStatus: "ON_TRACK",
    deadlineHoursRemaining: 42.0,
    totalSlaHours: 72,
    assignee: "Power Grid Solutions Co.",
    assigneeRole: "SCE Certified Electromechanical Team",
    assigneeRoleArabic: "فريق الفحص الكهروميكانيكي المعتمد",
    valueAtRiskSar: 75000,
    gainNum: 3,
    breachPenaltyDesc: "None (Within Buffer Window)",
    breachPenaltyDescArabic: "لا توجد (ضمن النطاق الزمني الآمن)",
    acknowledged: true,
  },
];

export const CommandCenterSLAMatrix: React.FC<CommandCenterSLAMatrixProps> = ({
  actions,
  isArabic,
  onExecuteAction,
}) => {
  const { isDark } = useTheme();
  const [slaItems, setSlaItems] = useState<SLAAlertItem[]>(DEFAULT_SLA_ALERTS);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "OVERDUE" | "EXPIRING" | "ON_TRACK" | "TIER1">("ALL");
  const [dispatchedIds, setDispatchedIds] = useState<Set<string>>(new Set());
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set(["sla-2", "sla-3", "sla-5", "sla-6"]));
  const [activeSimulationMsg, setActiveSimulationMsg] = useState<string | null>(null);

  // Live Timer Simulation: ticks every 3 seconds to keep UI vibrant
  const [liveSeconds, setLiveSeconds] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((s) => s + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Filtered SLA Items
  const filteredItems = useMemo(() => {
    return slaItems.filter((item) => {
      if (filterStatus === "OVERDUE") return item.slaStatus === "OVERDUE";
      if (filterStatus === "EXPIRING") return item.slaStatus === "EXPIRING_SOON";
      if (filterStatus === "ON_TRACK") return item.slaStatus === "ON_TRACK" || item.slaStatus === "RESOLVED";
      if (filterStatus === "TIER1") return item.tier.includes("Tier 1");
      return true;
    });
  }, [slaItems, filterStatus]);

  // Aggregate SLA Metrics
  const overdueCount = useMemo(() => slaItems.filter((s) => s.slaStatus === "OVERDUE").length, [slaItems]);
  const expiringCount = useMemo(() => slaItems.filter((s) => s.slaStatus === "EXPIRING_SOON").length, [slaItems]);
  const onTrackCount = useMemo(() => slaItems.filter((s) => s.slaStatus === "ON_TRACK" || s.slaStatus === "RESOLVED").length, [slaItems]);
  const totalValueAtRisk = useMemo(
    () =>
      slaItems
        .filter((s) => s.slaStatus === "OVERDUE" || s.slaStatus === "EXPIRING_SOON")
        .reduce((sum, item) => sum + item.valueAtRiskSar, 0),
    [slaItems]
  );
  const slaCompliancePct = useMemo(() => {
    const total = slaItems.length;
    if (total === 0) return 100;
    const compliant = slaItems.filter((s) => s.slaStatus !== "OVERDUE").length;
    return Math.round((compliant / total) * 100);
  }, [slaItems]);

  // Handle Quick Dispatch
  const handleDispatchContractor = (item: SLAAlertItem) => {
    setDispatchedIds((prev) => new Set(prev).add(item.id));
    setActiveSimulationMsg(
      isArabic
        ? `🚀 تم إرسال أمر التكليف الفوري للمقاول (${item.assignee}) بنجاح عبر بوابة الإسناد الميداني.`
        : `🚀 Instant contractor dispatch dispatched to ${item.assignee} via Field API.`
    );
    setTimeout(() => setActiveSimulationMsg(null), 4500);

    // If related to an action in props, also invoke
    if (item.actionId) {
      onExecuteAction(item.actionId);
    }
  };

  // Handle Acknowledge
  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds((prev) => new Set(prev).add(id));
  };

  // Simulate Sudden Escalation (Testing tool)
  const handleSimulateEscalation = () => {
    setSlaItems((prev) =>
      prev.map((item) => {
        if (item.id === "sla-2") {
          return {
            ...item,
            slaStatus: "OVERDUE",
            deadlineHoursRemaining: -1.2,
          };
        }
        return item;
      })
    );
    setActiveSimulationMsg(
      isArabic
        ? "⚠️ تنبيه محاكاة: تم تصعيد بند فواصل التمدد (SLA-2) إلى حالة متأخرة (OVERDUE)."
        : "⚠️ Simulation Alert: SLA-2 has breached threshold and turned OVERDUE."
    );
    setTimeout(() => setActiveSimulationMsg(null), 4500);
  };

  // Reset to default
  const handleResetSLA = () => {
    setSlaItems(DEFAULT_SLA_ALERTS);
    setDispatchedIds(new Set());
    setActiveSimulationMsg(null);
  };

  return (
    <div className="space-y-6">
      <SimulatedBadge isArabic={isArabic} />
      {/* ═══════════════════════════════════════════════════════════════════════
          COMMAND CENTER HEADER & OPERATIONAL BAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-950 to-[#070e1a] border-cyan-500/30"
          : "bg-gradient-to-br from-slate-50 via-white to-teal-50/40 border-slate-200 shadow-md"
      }`}>
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-red-500/10 via-amber-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2 ${
                isDark
                  ? "bg-gradient-to-r from-red-500/20 via-amber-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  : "bg-teal-100/80 text-teal-800 border border-teal-300"
              }`}>
                <Radio className={`w-3.5 h-3.5 animate-pulse ${isDark ? "text-cyan-400" : "text-teal-700"}`} />
                <span>COMMAND CENTER · SLA ALERT MATRIX (FR-15 & FR-18)</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                isDark
                  ? "bg-red-500/15 text-red-300 border-red-500/30"
                  : "bg-red-100 text-red-800 border-red-300"
              }`}>
                {overdueCount} {isArabic ? "تنبيهات حرجة متأخرة" : "Active Overdue Breaches"}
              </span>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-black font-arabic tracking-tight flex items-center gap-3 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <span>{isArabic ? "مصفوفة تنبيهات مركز القيادة ومتابعة اتفاقيات مستوى الخدمة (SLA Matrix)" : "Command Center SLA Alert Matrix & Resolution Radar"}</span>
              <ShieldAlert className={`w-6 h-6 shrink-0 animate-bounce ${isDark ? "text-red-400" : "text-red-600"}`} />
            </h2>

            <p className={`text-xs sm:text-sm font-mono leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              {isArabic
                ? "مراقبة لحظية لاتفاقيات مستوى الخدمة (SLAs) مع تدرجات لونية تفاعلية (أحمر للمتأخر، برتقالي لشارف الانتهاء) لضمان تسريع جاهزية الأصل للتسييل والحد من المخاطر."
                : "Real-time SLA monitoring grid with prioritized glow shaders (Red for Overdue, Amber for Expiring <24h) preventing liquidation delays and value decay."}
            </p>
          </div>

          {/* Quick Simulation & Control Actions */}
          <div className={`flex flex-wrap items-center gap-2.5 p-2 rounded-2xl border font-mono text-xs shadow-inner ${
            isDark ? "bg-slate-950/90 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <button
              onClick={handleSimulateEscalation}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  : "bg-red-100 hover:bg-red-200 text-red-800 border border-red-300"
              }`}
            >
              <Flame className={`w-3.5 h-3.5 animate-pulse ${isDark ? "text-red-400" : "text-red-600"}`} />
              <span>{isArabic ? "محاكاة تصعيد طارئ" : "Simulate SLA Breach"}</span>
            </button>

            <button
              onClick={handleResetSLA}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              }`}
              title={isArabic ? "إعادة ضبط المصفوفة" : "Reset SLA Matrix"}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Toast Feedback Bar */}
        {activeSimulationMsg && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200 ${
            isDark
              ? "bg-cyan-950/80 border-cyan-500/50 text-cyan-200"
              : "bg-teal-50 border-teal-300 text-teal-800"
          }`}>
            <Sparkles className={`w-4 h-4 shrink-0 ${isDark ? "text-cyan-400" : "text-teal-700"}`} />
            <span>{activeSimulationMsg}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TOP SLA METRIC TILES WITH VIBRANT GLOW
        ═══════════════════════════════════════════════════════════════════ */}
        <div className={`grid grid-cols-2 lg:grid-cols-5 gap-3.5 mt-6 pt-6 border-t font-mono ${
          isDark ? "border-slate-800/80" : "border-slate-200"
        }`}>
          {/* Tile 1: Overdue Alerts (Red Glow) */}
          <div className={`p-4 rounded-2xl border relative overflow-hidden group hover:scale-[1.02] transition-transform ${
            isDark
              ? "bg-gradient-to-br from-red-950/40 to-slate-950 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
              : "bg-red-50/70 border-red-200 shadow-sm"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-red-400" : "text-red-800"
              }`}>{isArabic ? "متأخر (تجاوز SLA)" : "OVERDUE ALERTS"}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </div>
            <div className={`text-3xl font-black mt-1 ${
              isDark ? "text-white drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "text-red-700"
            }`}>
              {overdueCount} <span className={`text-xs font-normal ${isDark ? "text-red-400" : "text-red-600"}`}>{isArabic ? "بنود حرجة" : "Items"}</span>
            </div>
            <div className={`text-[10px] mt-1 flex items-center gap-1 ${isDark ? "text-red-300" : "text-red-700"}`}>
              <AlertTriangle className="w-3 h-3" />
              <span>{isArabic ? "يتطلب تدخلاً فورياً" : "Immediate Action Req."}</span>
            </div>
          </div>

          {/* Tile 2: Expiring Soon <24h (Amber Glow) */}
          <div className={`p-4 rounded-2xl border relative overflow-hidden group hover:scale-[1.02] transition-transform ${
            isDark
              ? "bg-gradient-to-br from-amber-950/40 to-slate-950 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              : "bg-amber-50/70 border-amber-200 shadow-sm"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-amber-400" : "text-amber-800"
              }`}>{isArabic ? "شارف على الانتهاء (<24س)" : "EXPIRING SOON"}</span>
              <Clock className={`w-3.5 h-3.5 animate-spin ${isDark ? "text-amber-400" : "text-amber-700"}`} style={{ animationDuration: "10s" }} />
            </div>
            <div className={`text-3xl font-black mt-1 ${
              isDark ? "text-white drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" : "text-amber-700"
            }`}>
              {expiringCount} <span className={`text-xs font-normal ${isDark ? "text-amber-400" : "text-amber-600"}`}>{isArabic ? "قيد المراقبة" : "Warning"}</span>
            </div>
            <div className={`text-[10px] mt-1 ${isDark ? "text-amber-300" : "text-amber-700"}`}>
              {isArabic ? "أقل من 24 ساعة للإغلاق" : "< 24h Remaining SLA"}
            </div>
          </div>

          {/* Tile 3: On Track (Emerald Glow) */}
          <div className={`p-4 rounded-2xl border relative overflow-hidden group hover:scale-[1.02] transition-transform ${
            isDark
              ? "bg-gradient-to-br from-emerald-950/40 to-slate-950 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "bg-emerald-50/70 border-emerald-200 shadow-sm"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-emerald-400" : "text-emerald-800"
              }`}>{isArabic ? "ضمن النطاق الزمني" : "ON-TRACK SLA"}</span>
              <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400" : "text-emerald-700"}`} />
            </div>
            <div className={`text-3xl font-black mt-1 ${isDark ? "text-white" : "text-emerald-700"}`}>
              {onTrackCount} <span className={`text-xs font-normal ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{isArabic ? "بنود آمنة" : "Items"}</span>
            </div>
            <div className={`text-[10px] mt-1 ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
              {isArabic ? "معدل الإنجاز مستقر" : "Within Safe Buffers"}
            </div>
          </div>

          {/* Tile 4: SLA Compliance Rate */}
          <div className={`p-4 rounded-2xl border relative overflow-hidden group transition-all ${
            isDark
              ? "bg-slate-950/90 border-slate-800 hover:border-cyan-500/40"
              : "bg-white border-slate-200 shadow-sm hover:border-teal-400"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>{isArabic ? "مؤشر الامتثال لـ SLA" : "SLA COMPLIANCE"}</span>
              <TrendingUp className={`w-3.5 h-3.5 ${isDark ? "text-cyan-400" : "text-teal-700"}`} />
            </div>
            <div className={`text-3xl font-black mt-1 ${isDark ? "text-cyan-400" : "text-teal-700"}`}>
              {slaCompliancePct}%
            </div>
            <div className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {isArabic ? "المستهدف الوطني: >90%" : "National Target: >90%"}
            </div>
          </div>

          {/* Tile 5: Total Value at Risk */}
          <div className={`p-4 rounded-2xl border relative overflow-hidden col-span-2 lg:col-span-1 group transition-all ${
            isDark
              ? "bg-slate-950/90 border-slate-800 hover:border-amber-500/40"
              : "bg-white border-slate-200 shadow-sm hover:border-amber-400"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-amber-400" : "text-amber-800"
              }`}>{isArabic ? "القيمة المعرضة للخطر" : "VALUE AT RISK"}</span>
              <Building2 className={`w-3.5 h-3.5 ${isDark ? "text-amber-400" : "text-amber-700"}`} />
            </div>
            <div className={`text-2xl font-black mt-1 truncate ${isDark ? "text-white" : "text-slate-900"}`}>
              {(totalValueAtRisk / 1000).toFixed(0)}k <span className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-600"}`}>{isArabic ? "ر.س" : "SAR"}</span>
            </div>
            <div className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {isArabic ? "تجميد تسييل محتمل" : "Escrow / Liquidation Decay"}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          FILTER CHIPS & ACTIVE MATRIX RADAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-mono font-bold flex items-center gap-1.5 mr-1 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            <Filter className={`w-3.5 h-3.5 ${isDark ? "text-cyan-400" : "text-teal-700"}`} />
            <span>{isArabic ? "تصفية المصفوفة:" : "Filter Matrix:"}</span>
          </span>

          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filterStatus === "ALL"
                ? isDark
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "bg-teal-600 text-white shadow-sm"
                : isDark
                ? "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            {isArabic ? `كافة البنود (${slaItems.length})` : `All SLAs (${slaItems.length})`}
          </button>

          <button
            onClick={() => setFilterStatus("OVERDUE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "OVERDUE"
                ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                : isDark
                ? "bg-red-950/30 text-red-300 hover:bg-red-900/40 border border-red-500/30"
                : "bg-red-50 text-red-800 hover:bg-red-100 border border-red-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>{isArabic ? `متأخر (${overdueCount})` : `🚨 Overdue (${overdueCount})`}</span>
          </button>

          <button
            onClick={() => setFilterStatus("EXPIRING")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "EXPIRING"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black"
                : isDark
                ? "bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 border border-amber-500/30"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{isArabic ? `شارف على الانتهاء (${expiringCount})` : `⚠️ Expiring Soon (${expiringCount})`}</span>
          </button>

          <button
            onClick={() => setFilterStatus("ON_TRACK")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "ON_TRACK"
                ? isDark
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : "bg-emerald-600 text-white shadow-sm"
                : isDark
                ? "bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-500/30"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{isArabic ? `ضمن الوقت (${onTrackCount})` : `✅ On-Track (${onTrackCount})`}</span>
          </button>

          <button
            onClick={() => setFilterStatus("TIER1")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filterStatus === "TIER1"
                ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                : isDark
                ? "bg-purple-950/30 text-purple-300 hover:bg-purple-900/40 border border-purple-500/30"
                : "bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            {isArabic ? "🛡️ سلامة إنشائية فئة أولى (Tier 1)" : "🛡️ Tier 1 Critical"}
          </button>
        </div>

        <div className={`text-[11px] font-mono flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? "bg-cyan-400" : "bg-teal-600"}`} />
          <span>{isArabic ? "مزامنة لحظية عبر شبكة التدقيق" : "Real-time Telemetry Synced"}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRIORITIZED SLA GRID (GLOW-CODED CARDS)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item, index) => {
          const isOverdue = item.slaStatus === "OVERDUE";
          const isExpiring = item.slaStatus === "EXPIRING_SOON";
          const isDispatched = dispatchedIds.has(item.id);
          const isAck = acknowledgedIds.has(item.id);

          // SLA Percentage Consumed
          let timeConsumedPct = 100;
          if (item.deadlineHoursRemaining > 0) {
            timeConsumedPct = Math.round(
              ((item.totalSlaHours - item.deadlineHoursRemaining) / item.totalSlaHours) * 100
            );
          } else {
            timeConsumedPct = 125; // Overdue bar overflow
          }

          // Dynamic Card Glow Styling
          let cardStyle = isDark
            ? "border-slate-800 bg-slate-950/80 hover:border-cyan-500/40"
            : "border-slate-200 bg-white hover:border-teal-400 shadow-sm";
          let badgeColor = isDark
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            : "bg-emerald-100 text-emerald-800 border-emerald-300";
          let badgeText = isArabic ? "ضمن وقت SLA" : "ON-TRACK SLA";
          let progressBarColor = "bg-emerald-500";

          if (isOverdue) {
            cardStyle = isDark
              ? "border-red-500/70 bg-gradient-to-br from-red-950/30 via-slate-950 to-slate-900 shadow-[0_0_25px_rgba(239,68,68,0.3)] ring-1 ring-red-500/40 hover:border-red-400"
              : "border-red-300 bg-gradient-to-br from-red-50/70 via-white to-red-50/30 shadow-md ring-1 ring-red-300 hover:border-red-400";
            badgeColor = isDark
              ? "bg-red-500/25 text-red-300 border-red-500/60 animate-pulse font-black"
              : "bg-red-100 text-red-800 border-red-300 animate-pulse font-black";
            badgeText = isArabic ? "🚨 متأخر (تجاوز المهلة)" : "🚨 SLA BREACHED";
            progressBarColor = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]";
          } else if (isExpiring) {
            cardStyle = isDark
              ? "border-amber-500/70 bg-gradient-to-br from-amber-950/25 via-slate-950 to-slate-900 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/40 hover:border-amber-400"
              : "border-amber-300 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 shadow-md ring-1 ring-amber-300 hover:border-amber-400";
            badgeColor = isDark
              ? "bg-amber-500/25 text-amber-300 border-amber-500/60 font-black"
              : "bg-amber-100 text-amber-800 border-amber-300 font-black";
            badgeText = isArabic ? "⚠️ شارف على الانتهاء" : "⚠️ EXPIRING SOON";
            progressBarColor = "bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]";
          }

          return (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${cardStyle}`}
            >
              {/* Top Accent Stripe if Overdue/Expiring */}
              {isOverdue && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse" />
              )}
              {isExpiring && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
              )}

              <div>
                {/* Header: Tier + Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
                    isDark
                      ? "bg-slate-900/90 text-cyan-300 border-cyan-500/30"
                      : "bg-teal-50 text-teal-800 border-teal-200"
                  }`}>
                    {item.tier}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border flex items-center gap-1.5 ${badgeColor}`}>
                    {isOverdue && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
                    {isExpiring && <Clock className="w-3 h-3 text-amber-500" />}
                    <span>{badgeText}</span>
                  </span>
                </div>

                {/* Title & Arabic Details */}
                <h4 className={`text-base font-bold font-arabic tracking-tight leading-snug ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {isArabic ? item.titleArabic : item.title}
                </h4>

                <div className={`flex items-center gap-2 text-[11px] font-mono mt-1.5 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  <Building2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-cyan-400" : "text-teal-700"}`} />
                  <span className="truncate">{item.zone}</span>
                </div>

                {/* SLA Countdown Timer / Progress Bar */}
                <div className={`mt-4 p-3.5 rounded-2xl border space-y-2 ${
                  isDark
                    ? "bg-slate-950/90 border-slate-800/90"
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {isArabic ? "المهلة المتبقية:" : "SLA Countdown:"}
                    </span>
                    <span
                      className={`font-black ${
                        isOverdue
                          ? isDark
                            ? "text-red-400 text-sm drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                            : "text-red-600 text-sm font-bold"
                          : isExpiring
                          ? isDark
                            ? "text-amber-400 text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                            : "text-amber-700 text-sm font-bold"
                          : isDark
                          ? "text-emerald-400"
                          : "text-emerald-700"
                      }`}
                    >
                      {isOverdue
                        ? `${Math.abs(item.deadlineHoursRemaining)}h OVERDUE (${isArabic ? "متأخر" : "Breached"})`
                        : `${item.deadlineHoursRemaining}h ${isArabic ? "متبقية" : "left"} / ${item.totalSlaHours}h SLA`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className={`w-full rounded-full h-2 overflow-hidden border ${
                    isDark ? "bg-slate-900 border-slate-800" : "bg-slate-200 border-slate-300"
                  }`}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${progressBarColor}`}
                      style={{ width: `${Math.min(100, timeConsumedPct)}%` }}
                    />
                  </div>
                  <div className={`flex justify-between text-[9px] font-mono ${
                    isDark ? "text-slate-500" : "text-slate-600"
                  }`}>
                    <span>{isArabic ? "بدء الإجراء (0h)" : "0h Logged"}</span>
                    <span>{isArabic ? `الحد الأقصى (${item.totalSlaHours}h)` : `SLA Cap (${item.totalSlaHours}h)`}</span>
                  </div>
                </div>

                {/* Risk Exposure & Readiness Gain */}
                <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <span className={`text-[9px] uppercase block ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>{isArabic ? "عائد الجاهزية" : "GAIN"}</span>
                    <span className={`text-sm font-extrabold ${isDark ? "text-[#00C5A0]" : "text-teal-700"}`}>
                      +{item.gainNum} Pts
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <span className={`text-[9px] uppercase block ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>{isArabic ? "القيمة المعرضة" : "RISK"}</span>
                    <span className={`text-sm font-extrabold ${
                      isDark ? "text-amber-300" : "text-amber-700"
                    }`}>{(item.valueAtRiskSar / 1000).toFixed(0)}k SAR</span>
                  </div>
                </div>

                {/* Penalty Description */}
                <div className={`mt-3 text-[11px] font-mono flex items-start gap-1.5 p-2.5 rounded-xl border ${
                  isDark
                    ? "bg-slate-950/60 border-slate-900 text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    isOverdue ? "text-red-500" : "text-amber-500"
                  }`} />
                  <span className="leading-tight">
                    {isArabic ? item.breachPenaltyDescArabic : item.breachPenaltyDesc}
                  </span>
                </div>

                {/* Assignee Footer */}
                <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isDark ? "border-slate-800/80" : "border-slate-200"
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-[10px] ${
                      isDark
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                        : "bg-teal-50 border-teal-300 text-teal-800"
                    }`}>
                      {item.assignee.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className={`font-bold text-[11px] ${
                        isDark ? "text-slate-200" : "text-slate-800"
                      }`}>{item.assignee}</div>
                      <div className={`text-[9px] ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}>{isArabic ? item.assigneeRoleArabic : item.assigneeRole}</div>
                    </div>
                  </div>

                  {!isAck && (
                    <button
                      onClick={() => handleAcknowledge(item.id)}
                      className={`px-2 py-1 rounded text-[10px] border transition-colors cursor-pointer ${
                        isDark
                          ? "text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30"
                          : "text-teal-800 bg-teal-50 hover:bg-teal-100 border-teal-200 font-bold"
                      }`}
                    >
                      {isArabic ? "تأكيد الاطلاع" : "Ack"}
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`mt-4 pt-3 border-t flex items-center gap-2 ${
                isDark ? "border-slate-800/80" : "border-slate-200"
              }`}>
                <button
                  onClick={() => handleDispatchContractor(item)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDispatched
                      ? isDark
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : isOverdue
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white hover:brightness-110 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      : isExpiring
                      ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-black"
                      : isDark
                      ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
                      : "bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isArabic ? "تم التكليف والإرسال" : "Dispatched & Active"}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {isOverdue
                          ? isArabic
                            ? "إرسال وتصعيد طارئ"
                            : "Urgent Dispatch"
                          : isArabic
                          ? "تكليف المقاول فورياً"
                          : "Auto-Dispatch"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
