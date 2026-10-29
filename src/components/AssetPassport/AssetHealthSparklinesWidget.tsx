import React, { useState, useEffect, useMemo, useRef } from "react";
import { AssetRecord } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Layers,
  Sparkles,
  Zap,
  Radio,
  Play,
  Pause,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  HardHat,
  Cpu,
  ChevronDown,
  ChevronUp,
  Sliders,
} from "lucide-react";

export type TimeWindow = "live" | "24h" | "7d" | "30d";

export interface HealthMetricData {
  id: string;
  name: string;
  nameArabic: string;
  code: string; // e.g. "SBC-304"
  category: "structural" | "envelope" | "spatial" | "liquidation" | "mep" | "confidence";
  icon: any;
  currentValue: number;
  unit: string;
  targetValue: number;
  thresholdMin: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  trend: "up" | "down" | "stable";
  delta: number; // percentage change
  status: "OPTIMAL" | "NOMINAL" | "ATTENTION" | "CRITICAL";
  statusArabic: "مثالي" | "طبيعي" | "تنبيه" | "حرج";
  description: string;
  descriptionArabic: string;
  sensorRef: string;
  livePoints: number[];
  history24h: number[];
  history7d: number[];
  history30d: number[];
}

interface AssetHealthSparklinesWidgetProps {
  asset: AssetRecord;
  scores: ScoreResults;
  isArabic?: boolean;
  onNavigateTab?: (tabId: string) => void;
  onSelectFindingType?: (type: string) => void;
}

export const AssetHealthSparklinesWidget: React.FC<AssetHealthSparklinesWidgetProps> = ({
  asset,
  scores,
  isArabic = false,
  onNavigateTab,
  onSelectFindingType,
}) => {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("live");
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [activeMetricId, setActiveMetricId] = useState<string | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<{ [metricId: string]: number | null }>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [tickCounter, setTickCounter] = useState<number>(0);

  // Generate initial baseline streams based on actual asset properties
  const initialMetrics = useMemo(() => {
    const readiness = scores.liquidationReadiness || 86;
    const condition = scores.conditionIndex || 88;
    const coverage = scores.coveragePct || 98;
    const confidence = scores.inspectionConfidence || 94;

    const generateWave = (base: number, volatility: number, count: number, trend: number) => {
      const arr: number[] = [];
      let current = base - (trend * count * 0.3);
      for (let i = 0; i < count; i++) {
        const noise = (Math.random() - 0.48) * volatility;
        current = Math.min(100, Math.max(40, current + noise + trend));
        arr.push(parseFloat(current.toFixed(1)));
      }
      return arr;
    };

    return [
      {
        id: "structural",
        name: "Structural Soundness & Load Integrity",
        nameArabic: "السلامة الإنشائية ومقاومة الأحمال",
        code: "SBC 304",
        category: "structural" as const,
        icon: HardHat,
        currentValue: condition > 90 ? 95.8 : Math.max(78, condition + 2.5),
        unit: "%",
        targetValue: 95.0,
        thresholdMin: 80.0,
        color: "#00E5B9",
        gradientFrom: "#00E5B9",
        gradientTo: "#059669",
        trend: "up" as const,
        delta: +1.8,
        status: (condition > 85 ? "OPTIMAL" : "NOMINAL") as any,
        statusArabic: (condition > 85 ? "مثالي" : "طبيعي") as any,
        description: "Rebar load deflection within 1.2mm tolerance. No shear fatigue.",
        descriptionArabic: "انحراف حديد التسليح ضمن تسامح 1.2 مم، وخلو من شروخ القص الإجهادية.",
        sensorRef: "STRAIN-FIBER-04",
        livePoints: generateWave(condition > 90 ? 95.8 : 84.5, 0.6, 20, 0.05),
        history24h: generateWave(condition > 90 ? 95.2 : 83.8, 1.2, 24, 0.08),
        history7d: generateWave(condition > 90 ? 94.0 : 81.5, 2.0, 14, 0.25),
        history30d: generateWave(condition > 90 ? 92.5 : 79.0, 2.5, 30, 0.15),
      },
      {
        id: "envelope",
        name: "Moisture & Envelope Thermal Barrier",
        nameArabic: "العزل المائي والحراري للغلاف الخارجي",
        code: "SBC 601",
        category: "envelope" as const,
        icon: Droplets,
        currentValue: scores.criticalCount > 0 ? 81.4 : 92.6,
        unit: "%",
        targetValue: 90.0,
        thresholdMin: 75.0,
        color: scores.criticalCount > 0 ? "#F59E0B" : "#06B6D4",
        gradientFrom: scores.criticalCount > 0 ? "#F59E0B" : "#06B6D4",
        gradientTo: scores.criticalCount > 0 ? "#D97706" : "#0284C7",
        trend: scores.criticalCount > 0 ? ("down" as const) : ("up" as const),
        delta: scores.criticalCount > 0 ? -2.4 : +0.9,
        status: (scores.criticalCount > 0 ? "ATTENTION" : "OPTIMAL") as any,
        statusArabic: (scores.criticalCount > 0 ? "تنبيه" : "مثالي") as any,
        description: "Hygrometric sensors detect minor roof ponding; facade barriers sealed.",
        descriptionArabic: "مستشعرات الرطوبة ترصد تجمعاً طفيفاً بسطح المبنى؛ الواجهات معزولة بالكامل.",
        sensorRef: "THERMAL-FLIR-09",
        livePoints: generateWave(scores.criticalCount > 0 ? 81.4 : 92.6, 0.8, 20, -0.04),
        history24h: generateWave(scores.criticalCount > 0 ? 83.5 : 91.8, 1.4, 24, -0.06),
        history7d: generateWave(scores.criticalCount > 0 ? 86.0 : 90.5, 1.8, 14, -0.18),
        history30d: generateWave(scores.criticalCount > 0 ? 88.2 : 89.0, 2.8, 30, -0.12),
      },
      {
        id: "spatial",
        name: "3D LiDAR Density & Spatial Convergence",
        nameArabic: "كثافة سحابة النقاط وتطابق المسح الليزري",
        code: "BIM V2.5",
        category: "spatial" as const,
        icon: Layers,
        currentValue: coverage >= 95 ? 98.4 : coverage,
        unit: "%",
        targetValue: 98.0,
        thresholdMin: 90.0,
        color: "#60A5FA",
        gradientFrom: "#60A5FA",
        gradientTo: "#3B82F6",
        trend: "up" as const,
        delta: +3.2,
        status: "OPTIMAL" as const,
        statusArabic: "مثالي" as const,
        description: "Illustrative coverage-density value (demo data; no LiDAR scan).",
        descriptionArabic: "كثافة نقاط 4.2 مليون نقطة بدقة مكانية مطابقة للمجسم ±1.2 سم.",
        sensorRef: "UAV-LIDAR-RTK",
        livePoints: generateWave(coverage >= 95 ? 98.4 : coverage, 0.4, 20, 0.08),
        history24h: generateWave(coverage >= 95 ? 96.5 : coverage - 2, 0.9, 24, 0.12),
        history7d: generateWave(coverage >= 95 ? 92.0 : coverage - 5, 2.2, 14, 0.4),
        history30d: generateWave(coverage >= 95 ? 85.0 : coverage - 8, 3.0, 30, 0.35),
      },
      {
        id: "liquidation",
        name: "Liquidation Velocity & Auction Readiness",
        nameArabic: "جاهزية التصفية وسرعة الإدراج بالمزاد",
        code: "INFATH-DSP",
        category: "liquidation" as const,
        icon: Zap,
        currentValue: readiness,
        unit: "/100",
        targetValue: 85.0,
        thresholdMin: 70.0,
        color: "#A855F7",
        gradientFrom: "#A855F7",
        gradientTo: "#7C3AED",
        trend: "up" as const,
        delta: +4.6,
        status: (readiness >= 80 ? "OPTIMAL" : "NOMINAL") as any,
        statusArabic: (readiness >= 80 ? "مثالي" : "طبيعي") as any,
        description: "Taqeem-cleared documentation with zero active municipal impediments.",
        descriptionArabic: "قيمة توضيحية؛ لم يتم التحقق من أي وثائق أو موانع.",
        sensorRef: "AI-CLEARANCE-V3",
        livePoints: generateWave(readiness, 0.5, 20, 0.06),
        history24h: generateWave(readiness - 1.5, 1.1, 24, 0.15),
        history7d: generateWave(readiness - 4.2, 1.8, 14, 0.38),
        history30d: generateWave(readiness - 9.0, 2.6, 30, 0.3),
      },
      {
        id: "mep",
        name: "Life Safety, Egress & MEP Compliance",
        nameArabic: "السلامة والحماية من الحريق والأنظمة الكهروميكانيكية",
        code: "SBC 801",
        category: "mep" as const,
        icon: Flame,
        currentValue: 99.1,
        unit: "%",
        targetValue: 95.0,
        thresholdMin: 85.0,
        color: "#10B981",
        gradientFrom: "#10B981",
        gradientTo: "#047857",
        trend: "stable" as const,
        delta: +0.2,
        status: "OPTIMAL" as const,
        statusArabic: "مثالي" as const,
        description: "Illustrative value; no fire-safety inspection was performed.",
        descriptionArabic: "قيمة توضيحية؛ لم يُجرَ فحص للسلامة من الحريق.",
        sensorRef: "SCADA-MEP-HUB",
        livePoints: generateWave(99.1, 0.3, 20, 0.01),
        history24h: generateWave(99.0, 0.4, 24, 0.01),
        history7d: generateWave(98.8, 0.6, 14, 0.03),
        history30d: generateWave(98.5, 0.8, 30, 0.02),
      },
    ];
  }, [scores, asset]);

  const [metricsState, setMetricsState] = useState<HealthMetricData[]>(initialMetrics);

  // Sync with initial whenever active asset changes
  useEffect(() => {
    setMetricsState(initialMetrics);
  }, [initialMetrics]);

  // Real-time live data polling simulation
  useEffect(() => {
    if (!isLiveStreaming || timeWindow !== "live") return;

    const interval = setInterval(() => {
      setTickCounter((t) => t + 1);
      setMetricsState((prev) =>
        prev.map((metric) => {
          const lastVal = metric.livePoints[metric.livePoints.length - 1];
          const jitter = (Math.random() - 0.49) * 0.7;
          let nextVal = Math.min(100, Math.max(45, lastVal + jitter));
          nextVal = parseFloat(nextVal.toFixed(1));

          const newLivePoints = [...metric.livePoints.slice(1), nextVal];
          const firstPoint = newLivePoints[0];
          const delta = parseFloat((((nextVal - firstPoint) / firstPoint) * 100).toFixed(1));

          return {
            ...metric,
            currentValue: nextVal,
            delta,
            trend: delta >= 0 ? "up" : "down",
            livePoints: newLivePoints,
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [isLiveStreaming, timeWindow]);

  // Helper to get active series based on selected timeWindow
  const getSeries = (metric: HealthMetricData): number[] => {
    switch (timeWindow) {
      case "live":
        return metric.livePoints;
      case "24h":
        return metric.history24h;
      case "7d":
        return metric.history7d;
      case "30d":
        return metric.history30d;
      default:
        return metric.livePoints;
    }
  };

  // Helper to generate SVG sparkline path
  const generateSparklinePath = (points: number[], width: number, height: number, padding: number = 4) => {
    if (!points || points.length === 0) return { linePath: "", areaPath: "", min: 0, max: 100 };

    const min = Math.min(...points) * 0.98;
    const max = Math.max(...points) * 1.02;
    const range = max - min || 1;

    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    const coords = points.map((p, idx) => {
      const x = padding + (idx / (points.length - 1)) * usableWidth;
      const y = height - padding - ((p - min) / range) * usableHeight;
      return { x, y, value: p };
    });

    if (coords.length === 1) {
      return {
        linePath: `M ${coords[0].x} ${coords[0].y}`,
        areaPath: `M ${coords[0].x} ${coords[0].y} L ${coords[0].x} ${height} L ${coords[0].x} ${height} Z`,
        min,
        max,
        coords,
      };
    }

    // Smooth Bezier Curve
    let linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX = (curr.x + next.x) / 2;
      linePath += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }

    const lastCoord = coords[coords.length - 1];
    const firstCoord = coords[0];
    const areaPath = `${linePath} L ${lastCoord.x} ${height} L ${firstCoord.x} ${height} Z`;

    return { linePath, areaPath, min, max, coords };
  };

  return (
    <div className="relative rounded-2xl bg-[#070B14]/95 border border-cyan-500/30 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300">
      {/* Subtle top neon ambient edge */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid-tech opacity-20 pointer-events-none" />

      {/* ── TOP HEADER TOOLBAR ── */}
      <div className="relative z-10 px-5 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black font-mono tracking-tight text-white uppercase flex items-center gap-2">
                <span>{isArabic ? "مؤشرات صحة الأصل (محاكاة)" : "ASSET HEALTH INDICATORS (SIMULATED)"}</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{isArabic ? "موجات عشوائية للعرض" : "RANDOM DEMO WAVES"}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isArabic
                ? `موجات عشوائية للعرض للأصل #${asset.id} (لا توجد حساسات متصلة)`
                : `Randomly generated demo waves for Asset #${asset.id} (no sensors connected)`}
            </p>
          </div>
        </div>

        {/* Right Controls: Time Window Selector & Stream Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Window Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setTimeWindow("live")}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                timeWindow === "live"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>{isArabic ? "مباشر" : "Live"}</span>
            </button>
            <button
              onClick={() => setTimeWindow("24h")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeWindow === "24h"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>24H</span>
            </button>
            <button
              onClick={() => setTimeWindow("7d")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeWindow === "7d"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>7D</span>
            </button>
            <button
              onClick={() => setTimeWindow("30d")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeWindow === "30d"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>30D</span>
            </button>
          </div>

          {/* Stream Pause/Resume Toggle */}
          {timeWindow === "live" && (
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                isLiveStreaming
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
              }`}
              title={isLiveStreaming ? "Pause demo animation" : "Resume demo animation"}
            >
              {isLiveStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px] font-bold">STREAMING</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px] font-bold">PAUSED</span>
                </>
              )}
            </button>
          )}

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? "Collapse Widget" : "Expand Widget"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── 5 DYNAMIC SPARKLINES GRID ── */}
      {isExpanded && (
        <div className="relative z-10 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {metricsState.map((metric) => {
              const IconComponent = metric.icon;
              const points = getSeries(metric);
              const { linePath, areaPath, min, max, coords } = generateSparklinePath(points, 220, 60);
              const isSelected = activeMetricId === metric.id;
              const currentHoveredIndex = hoveredPointIndex[metric.id];
              const hoveredVal =
                currentHoveredIndex !== undefined && currentHoveredIndex !== null && points[currentHoveredIndex] !== undefined
                  ? points[currentHoveredIndex]
                  : metric.currentValue;

              return (
                <div
                  key={metric.id}
                  onClick={() => setActiveMetricId(isSelected ? null : metric.id)}
                  className={`relative rounded-xl p-3.5 border transition-all duration-300 flex flex-col justify-between cursor-pointer group select-none ${
                    isSelected
                      ? "bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50"
                      : "bg-slate-950/70 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700 shadow-md"
                  }`}
                >
                  {/* Top Metric Meta */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${metric.color}15`,
                          borderColor: `${metric.color}40`,
                          color: metric.color,
                        }}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            {metric.code}
                          </span>
                          <span
                            className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold"
                            style={{
                              backgroundColor: `${metric.color}18`,
                              color: metric.color,
                            }}
                          >
                            {isArabic ? metric.statusArabic : metric.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug line-clamp-1 group-hover:text-cyan-300 transition-colors">
                          {isArabic ? metric.nameArabic : metric.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Value & Delta Row */}
                  <div className="flex items-baseline justify-between gap-2 my-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black font-mono tracking-tight text-white">
                        {hoveredVal}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{metric.unit}</span>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-[11px] font-mono font-bold ${
                        metric.delta >= 0 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {metric.delta >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {metric.delta >= 0 ? `+${metric.delta}%` : `${metric.delta}%`}
                      </span>
                    </div>
                  </div>

                  {/* SVG Sparkline Container */}
                  <div
                    className="relative w-full h-[64px] my-1 pt-1"
                    onMouseLeave={() =>
                      setHoveredPointIndex((prev) => ({ ...prev, [metric.id]: null }))
                    }
                  >
                    <svg
                      viewBox="0 0 220 60"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id={`grad-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={metric.gradientFrom} stopOpacity="0.35" />
                          <stop offset="100%" stopColor={metric.gradientTo} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Baseline target threshold guide */}
                      <line
                        x1="4"
                        y1="18"
                        x2="216"
                        y2="18"
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="2 2"
                        strokeWidth="0.8"
                      />

                      {/* Area Fill Under Curve */}
                      <path d={areaPath} fill={`url(#grad-${metric.id})`} />

                      {/* Smooth Sparkline Stroke */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke={metric.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Pulsing End Point / Latest Live Point */}
                      {coords && coords.length > 0 && (
                        <g transform={`translate(${coords[coords.length - 1].x}, ${coords[coords.length - 1].y})`}>
                          <circle r="4" fill={metric.color} opacity="0.4" className="animate-ping" />
                          <circle r="2.5" fill={metric.color} stroke="#070B14" strokeWidth="1" />
                        </g>
                      )}

                      {/* Hoverable interactive zones */}
                      {coords &&
                        coords.map((c, idx) => (
                          <rect
                            key={idx}
                            x={c.x - 5}
                            y={0}
                            width={10}
                            height={60}
                            fill="transparent"
                            className="cursor-crosshair"
                            onMouseEnter={() =>
                              setHoveredPointIndex((prev) => ({ ...prev, [metric.id]: idx }))
                            }
                          />
                        ))}

                      {/* Active Hover Marker */}
                      {coords &&
                        currentHoveredIndex !== undefined &&
                        currentHoveredIndex !== null &&
                        coords[currentHoveredIndex] && (
                          <g
                            transform={`translate(${coords[currentHoveredIndex].x}, ${coords[currentHoveredIndex].y})`}
                          >
                            <circle r="4.5" fill="#FFF" stroke={metric.color} strokeWidth="2" />
                          </g>
                        )}
                    </svg>

                    {/* Sensor Tag */}
                    <div className="absolute bottom-0 right-0 text-[8px] font-mono text-slate-500">
                      {metric.sensorRef}
                    </div>
                  </div>

                  {/* Footnote / Bounds */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-slate-800/60 pt-1.5 mt-1">
                    <span>
                      Min: <strong className="text-slate-400">{min.toFixed(0)}</strong>
                    </span>
                    <span>
                      Target: <strong className="text-slate-400">{metric.targetValue}</strong>
                    </span>
                    <span>
                      Max: <strong className="text-slate-400">{max.toFixed(0)}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── DETAIL DRILLDOWN DRAWER (When a metric is selected) ── */}
          {activeMetricId && (() => {
            const selMetric = metricsState.find((m) => m.id === activeMetricId);
            if (!selMetric) return null;

            return (
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {selMetric.code} DEEP TELEMETRY
                      </span>
                      <span className="text-xs font-bold text-white">
                        {isArabic ? selMetric.nameArabic : selMetric.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono">
                      {isArabic ? selMetric.descriptionArabic : selMetric.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => {
                        if (onNavigateTab) onNavigateTab("findings");
                        if (onSelectFindingType) onSelectFindingType(selMetric.category);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isArabic ? "عرض العيوب المرتبطة" : "Inspect Related Findings"}</span>
                    </button>

                    <button
                      onClick={() => onNavigateTab && onNavigateTab("whatif")}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isArabic ? "محاكاة تحسين المؤشر" : "Simulate Boost"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
