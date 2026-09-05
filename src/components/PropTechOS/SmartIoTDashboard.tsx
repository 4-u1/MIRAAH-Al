import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Zap,
  Radio,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Flame,
  Droplets,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  BarChart2,
  Maximize2,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { AssetRecord, IoTSensorReading } from "../../types";
import { useTheme } from "../../context/ThemeContext";

interface SmartIoTDashboardProps {
  asset: AssetRecord;
  isArabic: boolean;
}

// Visual SVG Semi-Circular Radial Gauge Component
const RadialMeterGauge: React.FC<{
  value: number;
  min: number;
  max: number;
  unit: string;
  title: string;
  subtitle: string;
  thresholdWarn: number;
  thresholdCrit: number;
  isArabic: boolean;
  colorScheme: "cyan" | "emerald" | "amber" | "purple";
}> = ({
  value,
  min,
  max,
  unit,
  title,
  subtitle,
  thresholdWarn,
  thresholdCrit,
  isArabic,
  colorScheme,
}) => {
  const { isDark } = useTheme();
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  // Semi-circle angle calculation: 180 degrees total arc
  const radius = 68;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let statusColor = "text-emerald-400 stroke-emerald-400";
  let statusBg = isDark
    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
    : "bg-emerald-50 border-emerald-300 text-emerald-800";
  let statusText = isArabic ? "ضمن الحدود الآمنة" : "OPTIMAL & SAFE";

  if (value >= thresholdCrit) {
    statusColor = "text-red-400 stroke-red-400";
    statusBg = isDark
      ? "bg-red-500/10 border-red-500/30 text-red-300 animate-pulse"
      : "bg-red-50 border-red-300 text-red-800 animate-pulse";
    statusText = isArabic ? "تنبيه: تجاوز الحد الحرج" : "CRITICAL ALERT";
  } else if (value >= thresholdWarn) {
    statusColor = "text-amber-400 stroke-amber-400";
    statusBg = isDark
      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
      : "bg-amber-50 border-amber-300 text-amber-800";
    statusText = isArabic ? "مراقبة: اقتراب من الحد" : "WARNING THRESHOLD";
  }

  const baseStroke =
    colorScheme === "cyan"
      ? (isDark ? "stroke-cyan-500/20" : "stroke-cyan-200")
      : colorScheme === "emerald"
      ? (isDark ? "stroke-emerald-500/20" : "stroke-emerald-200")
      : colorScheme === "purple"
      ? (isDark ? "stroke-purple-500/20" : "stroke-purple-200")
      : (isDark ? "stroke-amber-500/20" : "stroke-amber-200");

  const activeStroke =
    value >= thresholdCrit
      ? "stroke-red-500"
      : value >= thresholdWarn
      ? "stroke-amber-500"
      : colorScheme === "cyan"
      ? (isDark ? "stroke-cyan-400" : "stroke-cyan-600")
      : colorScheme === "emerald"
      ? (isDark ? "stroke-emerald-400" : "stroke-emerald-600")
      : colorScheme === "purple"
      ? (isDark ? "stroke-purple-400" : "stroke-purple-600")
      : (isDark ? "stroke-amber-400" : "stroke-amber-600");

  return (
    <div className={`p-5 rounded-2xl border transition-all flex flex-col items-center text-center relative overflow-hidden group ${
      isDark
        ? "bg-slate-950/90 border-slate-800/90 hover:border-cyan-500/40 shadow-lg"
        : "bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm"
    }`}>
      {/* Top Header */}
      <div className="w-full flex items-start justify-between gap-2 mb-2">
        <div className="text-left rtl:text-right">
          <h4 className={`text-sm font-bold font-arabic tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}>{title}</h4>
          <span className={`text-[10px] font-mono block ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}>{subtitle}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${statusBg}`}>
          {statusText}
        </span>
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative w-44 h-26 my-2 flex items-center justify-center">
        <svg className="w-44 h-28 overflow-visible" viewBox="0 0 160 90">
          {/* Background Track */}
          <path
            d="M 12 80 A 68 68 0 0 1 148 80"
            fill="none"
            className={`${baseStroke} stroke-[12] stroke-linecap-round`}
          />
          {/* Active Value Arc */}
          <path
            d="M 12 80 A 68 68 0 0 1 148 80"
            fill="none"
            className={`${activeStroke} stroke-[12] stroke-linecap-round transition-all duration-700 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
          {/* Warning Marker Dot */}
          <circle
            cx={80 + 68 * Math.cos(Math.PI - (thresholdWarn / max) * Math.PI)}
            cy={80 - 68 * Math.sin(Math.PI - (thresholdWarn / max) * Math.PI)}
            r="3"
            className="fill-amber-400"
          />
        </svg>

        {/* Central Displayed Value */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <div className={`text-2xl font-black font-mono tracking-tight flex items-baseline gap-1 ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            <span>{typeof value === "number" ? (value % 1 === 0 ? value : value.toFixed(2)) : value}</span>
            <span className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>{unit}</span>
          </div>
          <div className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            {min} {unit} → {max} {unit}
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className={`w-full pt-3 mt-1 border-t flex items-center justify-between text-[10px] font-mono ${
        isDark ? "border-slate-800/80 text-slate-400" : "border-slate-100 text-slate-500"
      }`}>
        <span>
          {isArabic ? "الحد الآمن (Limit):" : "Safe Threshold:"} <strong className={isDark ? "text-slate-200" : "text-slate-800"}>{thresholdWarn} {unit}</strong>
        </span>
        <span className={`font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
          {percentage.toFixed(0)}% {isArabic ? "من السعة" : "of capacity"}
        </span>
      </div>
    </div>
  );
};

// Interactive SVG Sparkline Component
const SparklineTrendCard: React.FC<{
  title: string;
  subtitle: string;
  data: number[];
  unit: string;
  currentVal: number;
  changePct: number;
  isArabic: boolean;
  color: string;
}> = ({ title, subtitle, data, unit, currentVal, changePct, isArabic, color }) => {
  const { isDark } = useTheme();
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.1;
  const width = 240;
  const height = 50;

  // Generate SVG Path
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`;

  return (
    <div className={`p-4 rounded-2xl border transition-all font-mono ${
      isDark
        ? "bg-slate-950/80 border-slate-800 hover:border-cyan-500/30"
        : "bg-slate-50 border-slate-200 hover:border-cyan-500/40 shadow-sm"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className={`text-xs font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>{title}</div>
          <div className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {currentVal} <span className={`text-[10px] font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>{unit}</span>
          </div>
          <span className={`text-[10px] font-bold ${changePct >= 0 ? "text-amber-500" : "text-emerald-500"}`}>
            {changePct >= 0 ? `+${changePct.toFixed(1)}%` : `${changePct.toFixed(1)}%`}
          </span>
        </div>
      </div>

      {/* SVG Sparkline */}
      <div className="w-full h-14 relative mt-2">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#grad-${title})`} />
          <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Current Point Dot */}
          {points.length > 0 && (
            <circle
              cx={width}
              cy={height - ((currentVal - min) / (max - min || 1)) * height}
              r="3.5"
              fill={color}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>
      <div className="flex justify-between text-[9px] text-slate-500 mt-1">
        <span>-12h {isArabic ? "سابقاً" : "ago"}</span>
        <span>-6h</span>
        <span className="text-cyan-400 font-bold">{isArabic ? "الآن (Live)" : "Live"}</span>
      </div>
    </div>
  );
};

export const SmartIoTDashboard: React.FC<SmartIoTDashboardProps> = ({ asset, isArabic }) => {
  const { isDark } = useTheme();
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamIntervalMs, setStreamIntervalMs] = useState<number>(2500);
  const [simulationScenario, setSimulationScenario] = useState<
    "nominal" | "summer_surge" | "structural_stress" | "moisture_alert"
  >("nominal");
  const [tick, setTick] = useState<number>(0);

  // Dynamic Live State for Structural Strain
  const [strainHistory, setStrainHistory] = useState<number[]>([
    138, 140, 139, 141, 143, 142, 142, 144, 141, 142, 143, 142,
  ]);
  const [currentStrain, setCurrentStrain] = useState<number>(142);

  // Dynamic Live State for Energy Consumption (kWh)
  const [energyHistory, setEnergyHistory] = useState<number[]>([
    28, 30, 32, 34, 38, 41, 39, 36, 35, 33, 34, 34.2,
  ]);
  const [currentEnergy, setCurrentEnergy] = useState<number>(34.2);

  // Vibration & Thermal Dynamic States
  const [currentVibration, setCurrentVibration] = useState<number>(0.18);
  const [currentUValue, setCurrentUValue] = useState<number>(0.31);
  const [currentMoisture, setCurrentMoisture] = useState<number>(44);

  // Live streaming effect
  useEffect(() => {
    if (!isStreaming) return;

    const timer = setInterval(() => {
      setTick((prev) => prev + 1);

      // Fluctuate based on active simulation scenario
      let nextStrain = 142 + (Math.random() * 6 - 3);
      let nextEnergy = 34.2 + (Math.random() * 3.5 - 1.7);
      let nextVib = 0.18 + (Math.random() * 0.06 - 0.03);
      let nextUVal = 0.31 + (Math.random() * 0.02 - 0.01);
      let nextMoist = 44 + (Math.random() * 2 - 1);

      if (simulationScenario === "summer_surge") {
        nextEnergy = 46.8 + (Math.random() * 4 - 2);
        nextUVal = 0.36 + (Math.random() * 0.015);
      } else if (simulationScenario === "structural_stress") {
        nextStrain = 285 + (Math.random() * 18 - 9);
        nextVib = 1.45 + (Math.random() * 0.3 - 0.15);
      } else if (simulationScenario === "moisture_alert") {
        nextMoist = 68 + (Math.random() * 5 - 2.5);
      }

      setCurrentStrain(Number(nextStrain.toFixed(1)));
      setCurrentEnergy(Number(nextEnergy.toFixed(1)));
      setCurrentVibration(Number(nextVib.toFixed(2)));
      setCurrentUValue(Number(nextUVal.toFixed(2)));
      setCurrentMoisture(Number(nextMoist.toFixed(1)));

      setStrainHistory((prev) => [...prev.slice(1), Number(nextStrain.toFixed(1))]);
      setEnergyHistory((prev) => [...prev.slice(1), Number(nextEnergy.toFixed(1))]);
    }, streamIntervalMs);

    return () => clearInterval(timer);
  }, [isStreaming, streamIntervalMs, simulationScenario]);

  // Handle Manual Stress Pulse
  const triggerManualPulse = () => {
    setCurrentStrain((prev) => Math.min(320, prev + 45));
    setCurrentVibration((prev) => Math.min(2.1, prev + 0.6));
    setTimeout(() => {
      setCurrentStrain(142);
      setCurrentVibration(0.18);
    }, 3000);
  };

  // Subsystem Energy Breakdown calculation
  const energyBreakdown = useMemo(() => {
    const total = currentEnergy;
    return [
      { name: "VRF Smart Chillers (HVAC)", nameArabic: "تكييف الـ VRF المركزي", kwh: total * 0.58, pct: 58, color: "bg-cyan-500" },
      { name: "Smart LED Lighting Network", nameArabic: "شبكة الإضاءة الذكية", kwh: total * 0.16, pct: 16, color: "bg-amber-400" },
      { name: "Elevators & Traction Drives", nameArabic: "المصاعد والمحركات الكهربائية", kwh: total * 0.12, pct: 12, color: "bg-purple-500" },
      { name: "Pumps & Water Circulation", nameArabic: "مضخات المياه والري الذكي", kwh: total * 0.08, pct: 8, color: "bg-emerald-400" },
      { name: "Auxiliary Base Electronic Load", nameArabic: "الأجهزة الإلكترونية الأساسية", kwh: total * 0.06, pct: 6, color: "bg-slate-500" },
    ];
  }, [currentEnergy]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* ══ SMART IOT CONTROL & TELEMETRY HEADER ══ */}
      <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-950 to-[#050b14] border-cyan-500/30 shadow-2xl"
          : "bg-gradient-to-br from-white via-cyan-50/40 to-slate-50 border-cyan-200 shadow-sm"
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-2 ${
                isDark
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  : "bg-cyan-50 text-cyan-800 border-cyan-300"
              }`}>
                <Radio className={`w-3.5 h-3.5 text-cyan-500 ${isStreaming ? "animate-pulse" : ""}`} />
                <span>SMART IOT LIVE TELEMETRY DASHBOARD</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                isDark ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-emerald-50 text-emerald-800 border-emerald-300"
              }`}>
                SBC 304 & SBC 601 Telemetry Bus
              </span>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-black font-arabic tracking-tight flex items-center gap-3 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <span>{isArabic ? "لوحة المراقبة اللحظية للمستشعرات الإنشائية والطاقة (Smart IoT)" : "Smart IoT Live Structural & Energy Dashboard"}</span>
              <Activity className="w-6 h-6 text-cyan-500 shrink-0 animate-pulse" />
            </h2>

            <p className={`text-xs sm:text-sm font-mono leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              {isArabic
                ? "قراءات حية ومستمرة لإجهاد الخرسانة (Microstrain)، الاهتزازات الزلزالية، كفاءة العزل الحراري، ومعدل استهلاك الطاقة بالعدادات الذكية."
                : "Real-time streaming gauges, multi-point sparklines, and stress simulation for structural integrity (SBC 304) and energy conservation (SBC 601)."}
            </p>
          </div>

          {/* Telemetry Control Bar */}
          <div className={`flex flex-wrap items-center gap-3 p-2 rounded-2xl border font-mono text-xs ${
            isDark ? "bg-slate-950/90 border-cyan-500/30 shadow-inner" : "bg-white border-slate-200 shadow-sm"
          }`}>
            {/* Play / Pause Streaming */}
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isStreaming
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : (isDark ? "bg-slate-800 text-slate-300 hover:text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200")
              }`}
            >
              {isStreaming ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isStreaming ? (isArabic ? "البث المباشر نشط" : "LIVE STREAMING") : (isArabic ? "إيقاف مؤقت" : "PAUSED")}</span>
            </button>

            {/* Manual Stress Trigger */}
            <button
              onClick={triggerManualPulse}
              className={`px-3 py-2 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30 hover:border-amber-500/60"
                  : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
              }`}
              title="Simulate momentary stress pulse"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isArabic ? "نبضة إجهاد تجريبية" : "Pulse Test"}</span>
            </button>

            {/* Reset Defaults */}
            <button
              onClick={() => {
                setSimulationScenario("nominal");
                setCurrentStrain(142);
                setCurrentEnergy(34.2);
                setCurrentVibration(0.18);
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950"
              }`}
              title="Reset to nominal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ══ SCENARIO SELECTOR BAR ══ */}
        <div className={`mt-6 pt-5 border-t flex flex-wrap items-center justify-between gap-4 font-mono text-xs ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>{isArabic ? "سيناريو المحاكاة البيئية:" : "Stress Scenario:"}</span>
            <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <button
                onClick={() => setSimulationScenario("nominal")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  simulationScenario === "nominal"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : (isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950")
                }`}
              >
                {isArabic ? "الوضع الطبيعي (Nominal)" : "Nominal (24°C)"}
              </button>

              <button
                onClick={() => setSimulationScenario("summer_surge")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  simulationScenario === "summer_surge"
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : (isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950")
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{isArabic ? "ذروة الصيف 50°C (VRF Surge)" : "Summer Heat Peak (50°C)"}</span>
              </button>

              <button
                onClick={() => setSimulationScenario("structural_stress")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  simulationScenario === "structural_stress"
                    ? "bg-purple-500 text-slate-950 font-bold shadow"
                    : (isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950")
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isArabic ? "اختبار أحمال الخرسانة (SBC 304)" : "Concrete Load Test (SBC 304)"}</span>
              </button>

              <button
                onClick={() => setSimulationScenario("moisture_alert")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  simulationScenario === "moisture_alert"
                    ? "bg-blue-500 text-slate-950 font-bold shadow"
                    : (isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950")
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>{isArabic ? "تنبيه رطوبة السطح" : "Moisture Warning"}</span>
              </button>
            </div>
          </div>

          <div className={`flex items-center gap-3 text-[11px] ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {isArabic ? `تحديث النبض #${tick}` : `Pulse Cycle #${tick}`}
            </span>
            <span>·</span>
            <span>Sampling: {(streamIntervalMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: HIGH-PRECISION REAL-TIME RADIAL GAUGES (STRUCTURAL & ENERGY)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-bold font-arabic flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>{isArabic ? "مؤشرات القياس الدائرية اللحظية (Live Radial Gauges)" : "Real-time Asset Health Gauges"}</span>
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              isDark ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" : "bg-cyan-50 text-cyan-800 border-cyan-200"
            }`}>
              5 High-Precision Probes
            </span>
          </div>
          <span className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {isArabic ? "معايرة دورية وفق كود البناء السعودي" : "SBC Calibrated Sensors"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gauge 1: Structural Strain (SBC 304) */}
          <RadialMeterGauge
            value={currentStrain}
            min={0}
            max={400}
            unit="µε"
            title={isArabic ? "إجهاد الأعمدة الخرسانية" : "Concrete Column Strain"}
            subtitle="SBC 304 · Column C-04"
            thresholdWarn={260}
            thresholdCrit={350}
            isArabic={isArabic}
            colorScheme="cyan"
          />

          {/* Gauge 2: Real-time Energy Consumption */}
          <RadialMeterGauge
            value={currentEnergy}
            min={0}
            max={60}
            unit="kWh"
            title={isArabic ? "معدل استهلاك الطاقة" : "Real-time Energy Load"}
            subtitle="SEC Sub-Meter · Floor Rate"
            thresholdWarn={42}
            thresholdCrit={52}
            isArabic={isArabic}
            colorScheme="amber"
          />

          {/* Gauge 3: Seismic & Structural Vibration */}
          <RadialMeterGauge
            value={currentVibration}
            min={0}
            max={3.0}
            unit="mm/s"
            title={isArabic ? "الاهتزازات والتردد الزلزالي" : "Seismic Vibration PPV"}
            subtitle="SBC 301 · Basement Slab"
            thresholdWarn={1.2}
            thresholdCrit={2.5}
            isArabic={isArabic}
            colorScheme="purple"
          />

          {/* Gauge 4: Thermal Envelope U-Value (SBC 601) */}
          <RadialMeterGauge
            value={currentUValue}
            min={0.1}
            max={0.6}
            unit="W/m²K"
            title={isArabic ? "معامل العزل الحراري" : "Thermal Envelope U-Val"}
            subtitle="SBC 601 · Facade Glass"
            thresholdWarn={0.38}
            thresholdCrit={0.48}
            isArabic={isArabic}
            colorScheme="emerald"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: MULTI-POINT SPARKLINES & TIME SERIES TRENDS
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Structural Strain Sparkline */}
        <div className={`p-6 rounded-3xl border backdrop-blur-xl space-y-4 ${
          isDark ? "bg-slate-900/80 border-cyan-500/30" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className={`flex items-start justify-between pb-3 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                isDark ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-cyan-50 border-cyan-200 text-cyan-600"
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                  {isArabic ? "مسار إجهاد الهيكل الخرساني (Structural Strain History)" : "Structural Strain Telemetry"}
                </h4>
                <span className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  SBC 304 Safe Envelope: &lt;350 µε
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
              isDark ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" : "bg-cyan-50 text-cyan-800 border-cyan-200"
            }`}>
              {currentStrain} µε Live
            </span>
          </div>

          <SparklineTrendCard
            title={isArabic ? "عمود C-04 بالدور الأرضي (Ground Floor Main Column)" : "Ground Floor Main Column C-04"}
            subtitle={isArabic ? "تاريخ آخر 12 قراءة نبضية" : "Last 12 Telemetry Pulses"}
            data={strainHistory}
            unit="µε"
            currentVal={currentStrain}
            changePct={((currentStrain - 142) / 142) * 100}
            isArabic={isArabic}
            color="#06b6d4"
          />

          <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-2">
            <div className={`p-2.5 rounded-xl border text-center ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className={`text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "أدنى إجهاد" : "MIN"}</div>
              <div className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{Math.min(...strainHistory)} µε</div>
            </div>
            <div className={`p-2.5 rounded-xl border text-center ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className={`text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "متوسط الإجهاد" : "AVG"}</div>
              <div className={`text-sm font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                {(strainHistory.reduce((a, b) => a + b, 0) / strainHistory.length).toFixed(1)} µε
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border text-center ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className={`text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "أقصى ذروة" : "PEAK"}</div>
              <div className="text-sm font-bold text-amber-500">{Math.max(...strainHistory)} µε</div>
            </div>
          </div>
        </div>

        {/* Energy Consumption Sparkline */}
        <div className={`p-6 rounded-3xl border backdrop-blur-xl space-y-4 ${
          isDark ? "bg-slate-900/80 border-amber-500/30" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className={`flex items-start justify-between pb-3 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                isDark ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>
                  {isArabic ? "منحنى استهلاك الطاقة الكهربائية اللحظي" : "Energy Consumption Telemetry"}
                </h4>
                <span className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  SBC 601 Efficiency Target: &lt;48 kWh
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
              isDark ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-amber-50 text-amber-800 border-amber-200"
            }`}>
              {currentEnergy} kWh / hr
            </span>
          </div>

          <SparklineTrendCard
            title={isArabic ? "اللوحة الكهربائية الذكية الرئيسية (Smart Sub-Meter)" : "Main LV Sub-Meter Bus"}
            subtitle={isArabic ? "تاريخ الاستهلاك اللحظي بالكيلوواط" : "Dynamic Power Flow (kWh)"}
            data={energyHistory}
            unit="kWh"
            currentVal={currentEnergy}
            changePct={((currentEnergy - 34.2) / 34.2) * 100}
            isArabic={isArabic}
            color="#f59e0b"
          />

          <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-2">
            <div className={`p-2.5 rounded-xl border text-center ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className={`text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "الحمل الأساسي" : "BASE"}</div>
              <div className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{Math.min(...energyHistory)} kWh</div>
            </div>
            <div className={`p-2.5 rounded-xl border text-center ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className={`text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "المتوسط" : "AVG"}</div>
              <div className="text-sm font-bold text-amber-500">
                {(energyHistory.reduce((a, b) => a + b, 0) / energyHistory.length).toFixed(1)} kWh
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border text-center ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className={`text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "ذروة الطلب" : "PEAK"}</div>
              <div className="text-sm font-bold text-red-500">{Math.max(...energyHistory)} kWh</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: ENERGY SUB-METERING BREAKDOWN & WASTE DETECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl space-y-6 ${
        isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div>
            <h3 className={`text-lg font-bold font-arabic flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <Zap className="w-5 h-5 text-amber-500" />
              <span>{isArabic ? "تفصيل استهلاك الطاقة وكشف الهدر الذكي (SBC 601)" : "Energy Sub-metering & Waste AI Engine"}</span>
            </h3>
            <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic
                ? "تحليل فوري لأحمال التكييف، الإنارة، والمصاعد لرصد أي تسريب طاقي وتخفيض الفاتورة التشغيلية."
                : "Real-time load decomposition identifying HVAC chillers, lighting, and elevator standby consumption."}
            </p>
          </div>

          <div className={`px-4 py-2 rounded-2xl border font-mono text-xs flex items-center gap-2 ${
            isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "كفاءة العزل معتمدة فئة (أ)" : "Class A Efficiency Verified"}</span>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-3 font-mono text-xs">
          {energyBreakdown.map((item, idx) => (
            <div key={idx} className={`p-3.5 rounded-2xl border space-y-2 ${
              isDark ? "bg-slate-950/80 border-slate-800/80" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className={`font-bold font-arabic ${isDark ? "text-white" : "text-slate-900"}`}>{isArabic ? item.nameArabic : item.name}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item.kwh.toFixed(1)} kWh</span>
                  <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>({item.pct}%)</span>
                </div>
              </div>

              <div className={`w-full rounded-full h-2 overflow-hidden border ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-slate-200 border-slate-300"
              }`}>
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: STRUCTURAL STRAIN SENSOR NETWORK MAP (SBC 304 ZONES)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl space-y-6 ${
        isDark ? "bg-slate-900/80 border-cyan-500/30" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div>
            <h3 className={`text-lg font-bold font-arabic flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <Layers className="w-5 h-5 text-cyan-500" />
              <span>{isArabic ? "مصفوفة شبكة مستشعرات الإجهاد الإنشائي (SBC 304 Structural Network)" : "Structural Strain Sensor Node Matrix"}</span>
            </h3>
            <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic
                ? "مواقع المستشعرات المغروسة داخل العناصر الخرسانية الحاملة وحالة استقرارها اللحظي."
                : "Embedded fiber-optic and piezo-electric strain nodes across primary load-bearing members."}
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            isDark ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" : "bg-cyan-50 text-cyan-800 border-cyan-200"
          }`}>
            6 Nodes Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {[
            { id: "NODE-C04", name: "Main Column C-04", nameArabic: "العمود الخرساني الرئيسي C-04", val: currentStrain, limit: 350, zone: "Ground Floor Center" },
            { id: "NODE-SW02", name: "North Shear Wall W-02", nameArabic: "جدار القص الشمالي W-02", val: 88, limit: 300, zone: "Core Elevator Shaft" },
            { id: "NODE-B01", name: "Basement Foundation Raft", nameArabic: "لبشة الأساسات الخرسانية B-01", val: 112, limit: 400, zone: "Sub-grade Basement" },
            { id: "NODE-TB03", name: "Transfer Girder Beam TB-03", nameArabic: "كمرة التحويل الرئيسية TB-03", val: 165, limit: 380, zone: "First Floor Cantilever" },
            { id: "NODE-RF01", name: "Roof Mechanical MEP Deck", nameArabic: "بلاطة السطح الميكانيكية", val: 94, limit: 320, zone: "Roof Level" },
            { id: "NODE-SP05", name: "South Spandrel Beam", nameArabic: "كمرة الواجهة الجنوبية SP-05", val: 104, limit: 340, zone: "South Facade" },
          ].map((node) => {
            const ratio = (node.val / node.limit) * 100;
            const isWarn = ratio > 75;
            return (
              <div
                key={node.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDark
                    ? `bg-slate-950/90 ${isWarn ? "border-amber-500/50" : "border-slate-800 hover:border-cyan-500/30"}`
                    : `bg-slate-50 ${isWarn ? "border-amber-300 bg-amber-50/40" : "border-slate-200 hover:border-cyan-500/40"}`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">{node.id}</span>
                    <h5 className={`text-sm font-bold font-arabic mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {isArabic ? node.nameArabic : node.name}
                    </h5>
                    <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{node.zone}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isWarn
                        ? (isDark ? "bg-amber-500/20 text-amber-300" : "bg-amber-100 text-amber-800")
                        : (isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-800")
                    }`}
                  >
                    {isWarn ? "MONITOR" : "NORMAL"}
                  </span>
                </div>

                <div className={`mt-3 pt-3 border-t flex items-baseline justify-between ${
                  isDark ? "border-slate-800/80" : "border-slate-200"
                }`}>
                  <div>
                    <span className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>{node.val}</span>
                    <span className={`text-[10px] ml-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>µε</span>
                  </div>
                  <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    Max: {node.limit} µε ({ratio.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
