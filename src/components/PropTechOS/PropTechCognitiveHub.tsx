import React, { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  Layers,
  Clock,
  ShieldCheck,
  TrendingUp,
  Scale,
  Sparkles,
  Radio,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  Lock,
  FileCheck2,
  Sliders,
  BarChart3,
  Flame,
  Droplets,
  Workflow,
  Compass,
} from "lucide-react";
import { AssetRecord } from "../../types";
import { SmartIoTDashboard } from "./SmartIoTDashboard";
import { useTheme } from "../../context/ThemeContext";

interface PropTechCognitiveHubProps {
  asset: AssetRecord;
  isArabic: boolean;
  onNavigateTab?: (tabId: string) => void;
}

export const PropTechCognitiveHub: React.FC<PropTechCognitiveHubProps> = ({
  asset,
  isArabic,
  onNavigateTab,
}) => {
  const { isDark } = useTheme();
  const [activePillar, setActivePillar] = useState<
    "all" | "iot" | "bim" | "predictive" | "blockchain" | "avm" | "legal"
  >("all");

  // Dynamic AVM Interactive Readiness Simulation State
  const [simulatedReadiness, setSimulatedReadiness] = useState<number>(86);
  const [livePulseTick, setLivePulseTick] = useState<number>(0);
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeSimulationMode, setActiveSimulationMode] = useState<"standard" | "summer_peak" | "high_seismic">("standard");

  // Live IoT telemetry tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulseTick((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const iotSensors = asset.iotSensors || [];
  const bimDeviations = asset.bimDeviations || [];
  const predictiveLifecycles = asset.predictiveLifecycles || [];
  const blockchain = asset.blockchainRegistry;
  const avm = asset.avmAnalysis;
  const legalAudits = asset.legalAudits || [];

  // Dynamic AVM math calculation based on slider
  const baselineValuation = asset.valuationSar || 14800000;
  // Each readiness point above 80% adds ~0.45% value, below 80% discounts by 0.6%
  const readinessDelta = simulatedReadiness - 86;
  const dynamicValuation = Math.round(
    baselineValuation * (1 + (readinessDelta * 0.0055))
  );
  const liquidationSpeedDays = Math.max(
    14,
    Math.round(45 - (simulatedReadiness - 70) * 1.1)
  );

  const totalBimSavings = bimDeviations.reduce(
    (acc, curr) => acc + curr.savingsByEarlyDetectionSar,
    0
  );

  const totalPreventedDamage = predictiveLifecycles.reduce(
    (acc, curr) => acc + curr.preventedDamageCostSar,
    0
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const PILLARS = [
    { id: "all", label: "Overview & Matrix", labelArabic: "نظرة شمولية شاملة", icon: Workflow },
    { id: "iot", label: "Smart IoT", labelArabic: "المستشعرات الذكية (Smart IoT)", icon: Activity, badge: "Live Gauges" },
    { id: "bim", label: "2. BIM-AI Deviation", labelArabic: "٢. مطابقة BIM والنمذجة", icon: Layers, badge: `${(totalBimSavings/1000).toFixed(0)}k SAR وفر` },
    { id: "predictive", label: "3. Predictive Lifecycle", labelArabic: "٣. التنبؤ بالدورة الحياتية", icon: Clock, badge: "10-Yr AI" },
    { id: "blockchain", label: "4. National Registry & Chain", labelArabic: "٤. السجل العقاري والبلوكشين", icon: ShieldCheck, badge: "SRE-Chain" },
    { id: "avm", label: "5. Dynamic AVM Model", labelArabic: "٥. محرك التقييم العقاري الآلي", icon: TrendingUp, badge: "Live Comps" },
    { id: "legal", label: "6. Legal-Tech & Balady", labelArabic: "٦. التدقيق القانوني والبلدي", icon: Scale, badge: "100% سارٍ" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ══ HEADER: COGNITIVE OS COMMAND BANNER ══ */}
      <div className={`relative rounded-3xl overflow-hidden border p-6 sm:p-8 backdrop-blur-xl ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-950 to-[#030712] border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)]"
          : "bg-gradient-to-br from-white via-cyan-50/40 to-slate-50 border-cyan-200 shadow-sm"
      }`}>
        {/* Background Subtle Tech Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-2 ${
                isDark
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "bg-cyan-50 text-cyan-800 border-cyan-300"
              }`}>
                <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                <span>PROPTECH 2.0 · COGNITIVE ASSET OS (مرآة المعرفية)</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                isDark ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-amber-50 text-amber-800 border-amber-300"
              }`}>
                {isArabic ? "من أداة فحص إلى نظام تشغيل عقاري ذاتي التقييم" : "Autonomous Self-Valuing Real Estate OS"}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-black font-arabic tracking-tight flex items-center gap-3 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <span>{isArabic ? "منظومة مرآة المعرفية لإدارة وهندسة الأصول العقارية" : "MIRAAH Cognitive Real Estate Operating System"}</span>
              <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
            </h1>

            <p className={`text-sm font-mono leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              {isArabic
                ? "دمج تقنيات الجيل القادم: التوأم الرقمي الحي بمستشعرات IoT، مطابقة نمذجة BIM، التنبؤ بالدورة الحياتية، التوثيق بالبلوكشين، محرك التقييم الآلي AVM، والامتثال القانوني الذكي."
                : "Next-generation PropTech 2.0: Live IoT telemetry, BIM-AI deviation detection, 10-year predictive lifecycle AI, National Registry blockchain passport, dynamic AVM engine, and Balady legal-tech automation."}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0 font-mono">
            <div className={`p-3 rounded-2xl border text-center ${
              isDark ? "bg-slate-900/90 border-cyan-500/30" : "bg-white border-cyan-200 shadow-xs"
            }`}>
              <div className={`text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "حالة المستشعرات" : "IoT TELEMETRY"}</div>
              <div className={`text-lg font-bold flex items-center justify-center gap-1 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                <Activity className="w-4 h-4 animate-pulse" />
                <span>5 / 5 LIVE</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border text-center ${
              isDark ? "bg-slate-900/90 border-emerald-500/30" : "bg-white border-emerald-200 shadow-xs"
            }`}>
              <div className={`text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "وفر اكتشاف BIM" : "BIM SAVINGS"}</div>
              <div className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                +{(totalBimSavings / 1000).toFixed(0)}k <span className="text-xs">ر.س</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border text-center col-span-2 sm:col-span-1 ${
              isDark ? "bg-slate-900/90 border-amber-500/30" : "bg-white border-amber-200 shadow-xs"
            }`}>
              <div className={`text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "توثيق البلوكشين" : "BLOCKCHAIN"}</div>
              <div className="text-lg font-bold text-amber-500 flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ PILLAR FILTER TABS ══ */}
        <div className={`mt-8 pt-6 border-t flex items-center gap-2 overflow-x-auto pb-1 ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          {PILLARS.map((p) => {
            const Icon = p.icon;
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePillar(p.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-105"
                    : isDark
                    ? "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
                    : "bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 shadow-xs"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : (isDark ? "text-cyan-400" : "text-cyan-600")}`} />
                <span>{isArabic ? p.labelArabic : p.label}</span>
                {p.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? "bg-slate-950/20 text-slate-950 font-extrabold"
                        : isDark
                        ? "bg-slate-950 text-cyan-300 border border-slate-700"
                        : "bg-cyan-50 text-cyan-800 border border-cyan-200"
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PILLAR 1: SMART IOT & STRUCTURAL/ENERGY LIVE DASHBOARD
      ═══════════════════════════════════════════════════════════════════════ */}
      {(activePillar === "all" || activePillar === "iot") && (
        <SmartIoTDashboard asset={asset} isArabic={isArabic} />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PILLAR 2: BIM-AI INTEGRATION & DEVIATION ENGINE (AS-BUILT VS AS-DESIGNED)
      ═══════════════════════════════════════════════════════════════════════ */}
      {(activePillar === "all" || activePillar === "bim") && (
        <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-6 ${
          isDark ? "bg-slate-900/70 border-blue-500/30" : "bg-white border-blue-200 shadow-sm"
        }`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"
              }`}>
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                    {isArabic ? "٢. التوأمة مع النمذجة المعلوماتية وكشف الانحرافات (BIM-AI)" : "2. BIM-AI Integration & As-Built vs As-Designed Deviation"}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-50 text-blue-800 border-blue-200"
                  }`}>
                    LiDAR ↔ IFC Point Cloud
                  </span>
                </div>
                <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {isArabic
                    ? "مقارنة السحاب النقطي المنفذ فعلياً بالنموذج الهندسي التصميمي، لتفادي ملايين الريالات قبل الاستلام النهائي."
                    : "Automated clash detection and millimeter structural tolerance analysis before asset liquidation/handover."}
                </p>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-2xl border font-mono text-xs flex items-center gap-2 ${
              isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                {isArabic ? "إجمالي الوفر المحقق بالاكتشاف المبكر:" : "Total Early Savings:"}{" "}
                <strong className={isDark ? "text-white" : "text-slate-900"}>{(totalBimSavings).toLocaleString()} ر.س</strong>
              </span>
            </div>
          </div>

          {/* BIM Deviation Table */}
          <div className={`overflow-x-auto rounded-2xl border ${
            isDark ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white shadow-xs"
          }`}>
            <table className="w-full text-left font-mono text-xs">
              <thead className={`uppercase text-[10px] border-b ${
                isDark ? "bg-slate-900/90 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-600 border-slate-200"
              }`}>
                <tr>
                  <th className="p-4">{isArabic ? "العنصر الإنشائي / المنظومة" : "Element & Discipline"}</th>
                  <th className="p-4">{isArabic ? "المواصفة التصميمية (BIM)" : "As-Designed (IFC)"}</th>
                  <th className="p-4">{isArabic ? "الواقع المنفذ (LiDAR As-Built)" : "As-Built Actual"}</th>
                  <th className="p-4 text-center">{isArabic ? "الانحراف / المسموح" : "Deviation / Tolerance"}</th>
                  <th className="p-4 text-center">{isArabic ? "الحالة الهندسية" : "Status"}</th>
                  <th className="p-4 text-right">{isArabic ? "الوفر المحقق" : "Savings Realized"}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-slate-800/80" : "divide-slate-200"}`}>
                {bimDeviations.map((item) => {
                  const isClash = item.status === "CRITICAL_CLASH";
                  const isMinor = item.status === "MINOR_DEVIATION";
                  return (
                    <tr key={item.id} className={isDark ? "hover:bg-slate-900/50 transition-colors" : "hover:bg-slate-50 transition-colors"}>
                      <td className="p-4">
                        <div className={`font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                          {isArabic ? item.elementNameArabic : item.elementName}
                        </div>
                        <span className={`text-[10px] ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>{item.category} Discipline</span>
                      </td>
                      <td className={`p-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.asDesignedSpec}</td>
                      <td className={`p-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.asBuiltActual}</td>
                      <td className="p-4 text-center">
                        <span className={`font-bold ${isClash ? "text-red-500" : isMinor ? "text-amber-500" : "text-emerald-500"}`}>
                          +{item.deviationMm} mm
                        </span>
                        <span className={`text-[10px] block ${isDark ? "text-slate-500" : "text-slate-400"}`}>±{item.toleranceLimitMm} mm max</span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            isClash
                              ? (isDark ? "bg-red-500/20 text-red-300 border-red-500/40" : "bg-red-50 text-red-800 border-red-200")
                              : isMinor
                              ? (isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-amber-50 text-amber-800 border-amber-200")
                              : (isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-50 text-emerald-800 border-emerald-200")
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-500">
                        +{(item.savingsByEarlyDetectionSar).toLocaleString()} SAR
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PILLAR 3: PREDICTIVE LIFECYCLE & ASSET DEGRADATION HORIZONS (10-YR AI)
      ═══════════════════════════════════════════════════════════════════════ */}
      {(activePillar === "all" || activePillar === "predictive") && (
        <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-6 ${
          isDark ? "bg-slate-900/70 border-amber-500/30" : "bg-white border-amber-200 shadow-sm"
        }`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                isDark ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                    {isArabic ? "٣. التنبؤ بالدورة الحياتية وخطة الصيانة الوقائية" : "3. Predictive Maintenance AI & Asset Lifecycle Horizons"}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}>
                    Climate Stress Index (Riyadh)
                  </span>
                </div>
                <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {isArabic
                    ? "خوارزميات تتنبأ بحدوث التدهور الإنشائي والعزل قبل وقوعه استناداً لجودة المواد ومناخ الرياض القاسي."
                    : "Forecasting degradation horizons based on material specifications, load cycles, and extreme Riyadh UV/heat."}
                </p>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-2xl border font-mono text-xs ${
              isDark ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300" : "bg-cyan-50 border-cyan-200 text-cyan-800"
            }`}>
              <span>
                {isArabic ? "خسائر تمت حمايتها وقائياً:" : "Prevented Damage Value:"}{" "}
                <strong className={isDark ? "text-white" : "text-slate-900"}>{(totalPreventedDamage).toLocaleString()} ر.س</strong>
              </span>
            </div>
          </div>

          {/* Predictive Subsystems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveLifecycles.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isDark
                    ? "bg-slate-950/80 border-slate-800 hover:border-amber-500/40"
                    : "bg-slate-50 border-slate-200 hover:border-amber-300 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className={`text-sm font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                      {isArabic ? item.subsystemArabic : item.subsystem}
                    </h4>
                    <span className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {isArabic ? "سنة التركيب:" : "Installed:"} {item.installedYear} · {item.nominalLifespanYears} {isArabic ? "سنوات عمر افتراضي" : "Years Lifespan"}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-emerald-500">{item.currentHealthPct}%</div>
                    <span className={`text-[9px] font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "الكفاءة الحالية" : "Health Score"}</span>
                  </div>
                </div>

                {/* Health Progress Bar */}
                <div className={`w-full rounded-full h-2 overflow-hidden border ${
                  isDark ? "bg-slate-900 border-slate-800" : "bg-slate-200 border-slate-300"
                }`}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${item.currentHealthPct}%`,
                      backgroundColor: item.currentHealthPct > 85 ? "#10b981" : item.currentHealthPct > 70 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>

                {/* AI Horizon Trigger */}
                <div className={`p-3 rounded-xl border text-xs font-mono space-y-2 ${
                  isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-500 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {isArabic ? "الأفق الزمني المتوقع للتدهور:" : "Predicted Degradation Horizon:"}
                    </span>
                    <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item.predictedDegradationHorizonMonths} {isArabic ? "شهراً" : "Months"}</span>
                  </div>

                  <p className={`font-arabic text-[11px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    💡 <strong>{isArabic ? "التدخل الوقائي الموصى به:" : "Recommended Action:"}</strong>{" "}
                    {item.recommendedPreventiveActionArabic}
                  </p>

                  <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${
                    isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
                  }`}>
                    <span>
                      {isArabic ? "تكلفة الصيانة الوقائية:" : "Preventive Cost:"}{" "}
                      <strong className={isDark ? "text-white" : "text-slate-900"}>{(item.estimatedPreventiveCostSar).toLocaleString()} ر.س</strong>
                    </span>
                    <span>
                      {isArabic ? "حماية ضد تلف بقيمة:" : "Preserves Damage:"}{" "}
                      <strong className="text-emerald-500">{(item.preventedDamageCostSar).toLocaleString()} ر.س</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PILLAR 4: NATIONAL REAL ESTATE REGISTRY & BLOCKCHAIN PASSPORT (SRE-CHAIN)
      ═══════════════════════════════════════════════════════════════════════ */}
      {(activePillar === "all" || activePillar === "blockchain") && blockchain && (
        <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-6 ${
          isDark ? "bg-slate-900/70 border-emerald-500/30" : "bg-white border-emerald-200 shadow-sm"
        }`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                    {isArabic ? "٤. التوثيق بسجل العقار الوطني وسلسلة الكتل (Blockchain Passport)" : "4. National Real Estate Registry & Blockchain Trustless Passport"}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}>
                    SRE-Chain Node #1842903
                  </span>
                </div>
                <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {isArabic
                    ? "سجل غير قابل للتلاعب يوثق كافة الصكوك، تقارير الفحص، وأعمال الصيانة لرفع ثقة المشترين في الصفقات العقارية."
                    : "Cryptographically secured on-chain due-diligence passport guaranteeing immutable maintenance and inspection provenance."}
                </p>
              </div>
            </div>

            <div className={`px-3.5 py-1.5 rounded-xl border font-mono text-xs flex items-center gap-2 ${
              isDark ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}>
              <Lock className="w-3.5 h-3.5" />
              <span>{isArabic ? "سجل تاريخي موثق ومحمي 100%" : "100% IMMUTABLE PROOF"}</span>
            </div>
          </div>

          {/* Blockchain Telemetry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isDark ? "bg-slate-950/90 border-slate-800" : "bg-slate-50 border-slate-200 shadow-xs"
                }`}>
                  <div className={`text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "شبكة التوثيق العقاري" : "BLOCKCHAIN NETWORK"}</div>
                  <div className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{blockchain.chainNetwork}</div>
                  <div className={`text-[10px] ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>Smart Deed Token: {blockchain.tokenDeedId}</div>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isDark ? "bg-slate-950/90 border-slate-800" : "bg-slate-50 border-slate-200 shadow-xs"
                }`}>
                  <div className={`text-[10px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "رقم السجل العقاري الوطني (SRE)" : "NATIONAL REGISTRY ID"}</div>
                  <div className="text-sm font-bold text-emerald-500">{blockchain.nationalRegistryId}</div>
                  <div className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Block Height #{blockchain.blockHeight}</div>
                </div>
              </div>

              {/* SHA-256 Immutable Hash Proof Box */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? "bg-slate-950 border-cyan-500/30" : "bg-slate-50 border-cyan-200 shadow-xs"
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    <Lock className={`w-3 h-3 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                    {isArabic ? "بصمة التشفير غير القابلة للتلاعب (SHA-256 Hash):" : "Immutable Proof Hash (SHA-256):"}
                  </span>
                  <button
                    onClick={() => copyToClipboard(blockchain.immutableHashSha256)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700"
                        : "bg-white hover:bg-slate-100 text-cyan-800 border-slate-200 shadow-xs"
                    }`}
                  >
                    {copiedHash ? (isArabic ? "تم النسخ ✓" : "COPIED ✓") : (isArabic ? "نسخ البصمة" : "COPY HASH")}
                  </button>
                </div>
                <div className={`p-2.5 rounded-xl text-[11px] font-mono break-all border select-all ${
                  isDark
                    ? "bg-slate-900 text-cyan-300 border-slate-800"
                    : "bg-white text-cyan-900 border-slate-200"
                }`}>
                  {blockchain.immutableHashSha256}
                </div>
                <div className={`flex items-center justify-between text-[10px] pt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  <span>{isArabic ? "الجهة المعتمدة:" : "Auditor:"} {blockchain.verifiedAuditor}</span>
                  <span>{blockchain.timestamp}</span>
                </div>
              </div>
            </div>

            {/* QR Code Trust Certificate Card */}
            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center space-y-3 font-mono ${
              isDark ? "bg-slate-950 border-emerald-500/30" : "bg-slate-50 border-emerald-200 shadow-xs"
            }`}>
              <div className="w-32 h-32 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center border border-slate-200">
                {/* Simulated High-Res QR */}
                <div className="w-full h-full border-2 border-slate-950 p-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                    <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                  </div>
                  <div className="text-[8px] font-bold text-slate-950 tracking-tighter">SRE-VERIFY #20481</div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                    <div className="w-6 h-6 bg-emerald-600 rounded-sm animate-pulse" />
                  </div>
                </div>
              </div>
              <div>
                <div className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{isArabic ? "شهادة التحقق الرقمية الفورية" : "Trustless Verification QR"}</div>
                <div className={`text-[10px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {isArabic ? "مسح الرمز للتحقق من البورصة العقارية" : "Scan to verify on National SRE Ledger"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PILLAR 5: AUTOMATED VALUATION MODEL (AVM) WITH RIYADH SPATIAL COMPS
      ═══════════════════════════════════════════════════════════════════════ */}
      {(activePillar === "all" || activePillar === "avm") && avm && (
        <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-6 ${
          isDark ? "bg-slate-900/70 border-purple-500/30" : "bg-white border-purple-200 shadow-sm"
        }`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                isDark ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600"
              }`}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                    {isArabic ? "٥. محرك التقييم العقاري الآلي الذكي (Automated Valuation Model - AVM)" : "5. Dynamic Automated Valuation Model (AVM)"}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    isDark ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-purple-50 text-purple-800 border-purple-200"
                  }`}>
                    Al-Andalus Comps Feed
                  </span>
                </div>
                <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {isArabic
                    ? "تحديث فوري للتقييم العادل للأصل بناءً على تحسن مؤشر الجاهزية وصفقات السوق العقاري الحية بالرياض."
                    : "Dynamic fair market valuation recalibrated in real-time as readiness improves from 79% to 95%."}
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className={`text-[10px] block ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "متوسط سعر المتر بالحي:" : "District Average:"}</span>
              <span className={`text-sm font-bold ${isDark ? "text-purple-300" : "text-purple-600"}`}>{(avm.districtAveragePriceSqm).toLocaleString()} SAR / m²</span>
            </div>
          </div>

          {/* Interactive Dynamic Valuation Sandbox */}
          <div className={`p-6 rounded-2xl border space-y-6 ${
            isDark ? "bg-slate-950 border-purple-500/40" : "bg-slate-50 border-purple-200 shadow-xs"
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}>
                  <Sliders className="w-3.5 h-3.5" />
                  {isArabic ? "محاكي أثر الجاهزية على التقييم المالي (Interactive Readiness Sandbox):" : "Interactive Readiness Valuation Sandbox:"}
                </span>
                <p className={`text-xs font-arabic mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {isArabic
                    ? "حرك المؤشر لمشاهدة كيف يقفز تقييم الأصل تلقائياً وتقل فترة التسييل مع كل نقطة جاهزية إضافية."
                    : "Drag readiness slider to see real-time AVM fair price adjustment and days-to-sell reduction."}
                </p>
              </div>

              <div className={`text-right font-mono px-4 py-2 rounded-xl border ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
              }`}>
                <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "مستوى الجاهزية المحاكى:" : "Simulated Readiness:"}</span>
                <div className={`text-xl font-black ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>{simulatedReadiness}%</div>
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-2">
              <input
                type="range"
                min="65"
                max="100"
                value={simulatedReadiness}
                onChange={(e) => setSimulatedReadiness(Number(e.target.value))}
                className={`w-full cursor-pointer h-2 rounded-lg ${
                  isDark ? "accent-cyan-400 bg-slate-800" : "accent-cyan-600 bg-slate-200"
                }`}
              />
              <div className={`flex justify-between text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                <span>65% (عقارات معثرة)</span>
                <span className={`font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>86% (الحالة الراهنة)</span>
                <span className="text-emerald-500 font-bold">100% (أصل مثالي كامل التوثيق)</span>
              </div>
            </div>

            {/* Dynamic Results Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t font-mono ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-xs"
              }`}>
                <div className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "التقييم العادل المحسوب (AVM):" : "AVM Fair Valuation:"}</div>
                <div className={`text-2xl font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {(dynamicValuation).toLocaleString()} <span className={`text-xs ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>ر.س</span>
                </div>
                <div className={`text-[10px] mt-1 ${readinessDelta >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {readinessDelta >= 0 ? `+${((dynamicValuation - baselineValuation)).toLocaleString()} SAR (+${(readinessDelta * 0.55).toFixed(1)}%)` : `${((dynamicValuation - baselineValuation)).toLocaleString()} SAR`}
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-xs"
              }`}>
                <div className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "متوسط سرعة التسييل المتوقعة:" : "Estimated Days to Sell:"}</div>
                <div className="text-2xl font-black text-amber-500 mt-1">
                  {liquidationSpeedDays} <span className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "يوماً" : "Days"}</span>
                </div>
                <div className="text-[10px] text-emerald-500 mt-1">
                  {isArabic ? "تسييل أسرع بنسبة 45% مقارنة بمتوسط السوق" : "45% faster than market average"}
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-xs"
              }`}>
                <div className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "درجة موثوقية النموذج (Confidence):" : "Model Confidence Score:"}</div>
                <div className={`text-2xl font-black mt-1 ${isDark ? "text-purple-300" : "text-purple-600"}`}>
                  {avm.confidenceScorePct}%
                </div>
                <div className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {avm.recentCompsCount} {isArabic ? "صفقة حقيقية معتمدة بالرياض" : "Verified Riyadh comps"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PILLAR 6: LEGAL-TECH & REGULATORY COMPLIANCE LAYER (BALADY & SBC)
      ═══════════════════════════════════════════════════════════════════════ */}
      {(activePillar === "all" || activePillar === "legal") && (
        <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl space-y-6 ${
          isDark ? "bg-slate-900/70 border-teal-500/30" : "bg-white border-teal-200 shadow-sm"
        }`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                isDark ? "bg-teal-500/10 border-teal-500/30 text-teal-400" : "bg-teal-50 border-teal-200 text-teal-600"
              }`}>
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                    {isArabic ? "٦. التحليل القانوني والتشريعي والتراخيص البلدية (Legal-Tech)" : "6. Legal-Tech & Municipal Regulatory Compliance"}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-teal-50 text-teal-800 border-teal-200"
                  }`}>
                    Balady & Ministry of Justice
                  </span>
                </div>
                <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {isArabic
                    ? "أتمتة مراجعة الصكوك والتأكد من مطابقة التراخيص والارتدادات النظامية لتفادي أي عوائق قانونية أثناء التسييل."
                    : "Automated title deed auditing, municipal setback verification, and SBC certificate compliance."}
                </p>
              </div>
            </div>

            <div className={`px-3.5 py-1.5 rounded-xl border font-mono text-xs flex items-center gap-2 ${
              isDark ? "bg-teal-500/10 border-teal-500/40 text-teal-300" : "bg-teal-50 border-teal-200 text-teal-800"
            }`}>
              <FileCheck2 className="w-4 h-4" />
              <span>{isArabic ? "صفر مخاطر عدم امتثال (Zero Friction)" : "ZERO LIQUIDATION FRICTION"}</span>
            </div>
          </div>

          {/* Legal Audits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalAudits.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isDark
                    ? "bg-slate-950/90 border-slate-800 hover:border-teal-500/40"
                    : "bg-slate-50 border-slate-200 hover:border-teal-300 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                      isDark
                        ? "bg-slate-900 text-teal-300 border-slate-800"
                        : "bg-teal-50 text-teal-800 border-teal-200"
                    }`}>
                      {item.authority}
                    </span>
                    <h4 className={`text-sm font-bold font-arabic mt-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {isArabic ? item.titleArabic : item.title}
                    </h4>
                    <p className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>Ref: {item.documentReference}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                    isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}>
                    {item.complianceScore}% امتثال
                  </span>
                </div>

                <p className={`text-xs font-arabic leading-relaxed pt-2 border-t ${
                  isDark ? "text-slate-300 border-slate-800/80" : "text-slate-600 border-slate-200"
                }`}>
                  {item.notesArabic}
                </p>

                <div className={`flex items-center justify-between text-[10px] font-mono pt-1 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  <span>{isArabic ? "أثر التسييل:" : "Liquidation Impact:"} <strong className="text-teal-500">{item.liquidationImpact}</strong></span>
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {isArabic ? "معتمد رسمياً" : "Legally Validated"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
