import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { AssetRecord } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import { GlassCard } from "../common/GlassCard";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building,
  Sliders,
  RotateCcw,
  Zap,
  Info,
  X,
  ShieldAlert,
  Wrench,
  Eye,
  Check,
  Database,
  Gavel,
  ExternalLink,
  FileSpreadsheet,
} from "lucide-react";
import { SaudiOpenDataJuly2026Modal } from "./SaudiOpenDataJuly2026Modal";
import { SAUDI_REAL_ESTATE_METADATA, SAUDI_REGIONAL_SUMMARY } from "../../data/saudiRealEstateJuly2026";
import { SimulatedBadge } from "../common/DemoDataBanner";

interface MarketTrendsViewProps {
  asset: AssetRecord;
  scores: ScoreResults;
  isArabic?: boolean;
}

export interface AIDefectImpact {
  type: "dip" | "spike" | "wear_drag";
  defectName: string;
  defectNameArabic: string;
  severity: "Critical" | "Moderate" | "Low" | "Resolved";
  deltaSar: number; // e.g. -450000 or +820000
  deltaPct: number;
  sbcClause?: string;
  aiConfidence?: number;
  rootCause: string;
  rootCauseArabic: string;
  remediationAction?: string;
  remediationActionArabic?: string;
}

interface TrendDataPoint {
  period: string;
  periodArabic: string;
  year: number;
  quarter: string;
  conditionIndex: number;
  baseMarketValuation: number; // In SAR
  realizedValuation: number; // In SAR
  depreciationLoss: number; // In SAR
  pricePerSqm: number;
  event: string;
  eventArabic: string;
  isForecast?: boolean;
  isCurrent?: boolean;
  status: "optimal" | "wear" | "impaired" | "remediated";
  aiDefectImpact?: AIDefectImpact;
}

export const MarketTrendsView: React.FC<MarketTrendsViewProps> = ({
  asset,
  scores,
  isArabic = false,
}) => {
  const [chartMode, setChartMode] = useState<"dual" | "valuation" | "condition">("dual");
  const [timeHorizon, setTimeHorizon] = useState<"all" | "recent" | "forecast">("all");
  const [simulatedCondition, setSimulatedCondition] = useState<number>(scores.conditionIndex);
  const [highlightAIDefects, setHighlightAIDefects] = useState<boolean>(true);
  const [selectedDefectMarker, setSelectedDefectMarker] = useState<TrendDataPoint | null>(null);
  const [isOpenDataModalOpen, setIsOpenDataModalOpen] = useState<boolean>(false);

  // Derive historical financial and condition index trajectory for the selected asset
  const trendHistory = useMemo<TrendDataPoint[]>(() => {
    const currentValuation = asset.valuationSar || 14800000;
    const currentCondition = scores.conditionIndex;
    const buildYear = asset.buildYear || 2022;
    const size = asset.sizeSqm || 1400;

    // Highest severity finding or default to top finding
    const topFinding = asset.findings?.find((f) => f.severity === "Critical") ||
      asset.findings?.find((f) => f.severity === "Moderate") ||
      asset.findings?.[0];

    // Standard annual market appreciation rate for prime Saudi real estate (Riyadh CAGR ~6.5% - 7.2%)
    const annualAppreciationRate = 0.068;
    const quarterlyRate = annualAppreciationRate / 4;

    const points: TrendDataPoint[] = [];

    // Milestone 1: Handover / Construction Completion
    const baseInitialValuation = currentValuation / Math.pow(1 + annualAppreciationRate, 2026 - buildYear + 0.5);
    points.push({
      period: `Q1 ${buildYear}`,
      periodArabic: `الربع الأول ${buildYear}`,
      year: buildYear,
      quarter: "Q1",
      conditionIndex: 100,
      baseMarketValuation: Math.round(baseInitialValuation),
      realizedValuation: Math.round(baseInitialValuation),
      depreciationLoss: 0,
      pricePerSqm: Math.round(baseInitialValuation / size),
      event: "Construction & Municipal Handover",
      eventArabic: "اكتمال البناء والتسليم البلدي الأولي",
      status: "optimal",
    });

    // Milestone 2: Year 1 Operating Routine
    const y1 = buildYear + 1;
    if (y1 <= 2024) {
      const vY1 = baseInitialValuation * Math.pow(1 + annualAppreciationRate, 1.25);
      points.push({
        period: `Q2 ${y1}`,
        periodArabic: `الربع الثاني ${y1}`,
        year: y1,
        quarter: "Q2",
        conditionIndex: 98,
        baseMarketValuation: Math.round(vY1),
        realizedValuation: Math.round(vY1 * 0.995),
        depreciationLoss: Math.round(vY1 * 0.005),
        pricePerSqm: Math.round(vY1 / size),
        event: "Routine Facility Audit (SBC-201 Compliant)",
        eventArabic: "الفحص الدوري الروتيني (مطابقة SBC-201)",
        status: "optimal",
      });
    }

    // Milestone 3: Intermediate Phase / Wear Emergence
    const y2 = Math.min(2025, buildYear + 2);
    const vY2 = baseInitialValuation * Math.pow(1 + annualAppreciationRate, y2 - buildYear + 0.25);
    const wearLoss = Math.round(vY2 * 0.025);
    points.push({
      period: `Q1 ${y2}`,
      periodArabic: `الربع الأول ${y2}`,
      year: y2,
      quarter: "Q1",
      conditionIndex: 94,
      baseMarketValuation: Math.round(vY2),
      realizedValuation: Math.round(vY2 * 0.975),
      depreciationLoss: wearLoss,
      pricePerSqm: Math.round((vY2 * 0.975) / size),
      event: "Annual Wear & Environmental Exposure",
      eventArabic: "ظهور إجهادات بيئية وتآكل سطحي طفيف",
      status: "wear",
      aiDefectImpact: {
        type: "wear_drag",
        defectName: "Superficial Weathering & Sealant Aging",
        defectNameArabic: "تآكل سطحي طفيف وتقادم موانع التسرب",
        severity: "Low",
        deltaSar: -wearLoss,
        deltaPct: -2.5,
        sbcClause: "SBC-201 General Safety",
        aiConfidence: 89,
        rootCause: "Natural climatic thermal contraction along perimeter joints",
        rootCauseArabic: "تمدد وانكماش حراري طبيعي بفعل المناخ على الفواصل الخارجية",
        remediationAction: "Biannual preventive sealant resealing",
        remediationActionArabic: "تجديد العوازل المطاطية الدورية",
      },
    });

    // Milestone 4: Pre-Audit / Defect Evolution
    const vPre = currentValuation * 0.96;
    const preLoss = Math.round(currentValuation * 1.02 - vPre);
    points.push({
      period: `Q4 2025`,
      periodArabic: `الربع الرابع 2025`,
      year: 2025,
      quarter: "Q4",
      conditionIndex: Math.max(70, currentCondition - 4),
      baseMarketValuation: Math.round(currentValuation * 1.02),
      realizedValuation: Math.round(vPre),
      depreciationLoss: preLoss,
      pricePerSqm: Math.round(vPre / size),
      event: "Pre-Liquidation Due Diligence",
      eventArabic: "الفحص التمهيدي لقيد التصفية القضائية",
      status: "impaired",
      aiDefectImpact: {
        type: "dip",
        defectName: "Initial Defect Identification (Pre-Audit)",
        defectNameArabic: "رصد مبكر لبوادر عيوب رطوبة وشروخ شعرية",
        severity: "Moderate",
        deltaSar: -preLoss,
        deltaPct: -5.8,
        sbcClause: "SBC-601 / SBC-304",
        aiConfidence: 85,
        rootCause: "Unattended MEP drain discharge and micro-crack propagation",
        rootCauseArabic: "تجمع تصريف مياه التكييف وتوسع شروخ شعرية في طبقة الحماية",
        remediationAction: "Schedule comprehensive multi-modal drone & LiDAR survey",
        remediationActionArabic: "جدولة مسح شامل بالدرون والماسح الضوئي",
      },
    });

    // Milestone 5: Current Live Inspection (2026 Q3) - SIGNIFICANT AI DEFECT DIP
    const baseBenchmarkToday = Math.round(currentValuation * (1 + (100 - currentCondition) * 0.0028));
    const currentLoss = baseBenchmarkToday - currentValuation;
    const dipPct = ((currentLoss / baseBenchmarkToday) * 100).toFixed(1);

    const liveFindingDesc = topFinding?.description || "Spatial thermal scanning identified moisture infiltration & screed micro-cracks";
    const liveFindingArabic = topFinding?.type === "Crack"
      ? "شروخ إنشائية مرصودة بالذكاء الاصطناعي تؤثر على السعر الافتتاحي للمزاد"
      : topFinding?.type === "Moisture"
      ? "تجمع رطوبي وتسريب عزل مائي في محطة السطح (SBC-601)"
      : "ملاحظات تشطيبات وعوازل مرصودة بالرؤية المكانية";

    points.push({
      period: `Q3 2026 (Live)`,
      periodArabic: `الربع الثالث 2026 (الحالي)`,
      year: 2026,
      quarter: "Q3",
      conditionIndex: currentCondition,
      baseMarketValuation: baseBenchmarkToday,
      realizedValuation: currentValuation,
      depreciationLoss: currentLoss,
      pricePerSqm: Math.round(currentValuation / size),
      event: "MIRAAH Multi-Modal Spatial Telemetry",
      eventArabic: "المعاينة المكانية الحية عبر منصة مرآة",
      isCurrent: true,
      status: currentCondition >= 90 ? "optimal" : currentCondition >= 75 ? "wear" : "impaired",
      aiDefectImpact: {
        type: "dip",
        defectName: liveFindingDesc,
        defectNameArabic: liveFindingArabic,
        severity: topFinding?.severity || "Moderate",
        deltaSar: -currentLoss,
        deltaPct: -Number(dipPct),
        sbcClause: topFinding?.type === "Crack" ? "SBC-304 (Concrete Structures)" : "SBC-601 (Moisture & Thermal)",
        aiConfidence: topFinding?.conf || 88,
        rootCause: `Computer vision identified ${asset.findings?.length || 3} localized non-conformity zones causing structural condition discount.`,
        rootCauseArabic: `رصدت الرؤية الحاسوبية ${asset.findings?.length || 3} مناطق عيوب أدت لخصم فني مباشر على التقييم المعتمد.`,
        remediationAction: asset.actions?.[0]?.action || "Deploy targeted Next Best Action remediation fast-track",
        remediationActionArabic: asset.actions?.[0]?.actionArabic || "تنفيذ خطة المعالجة السريعة الموصى بها",
      },
    });

    // Milestone 6: Forecast Without Remediation (As-Is Auction) - COMPOUNDING DIP
    const vUnrepaired = Math.round(currentValuation * (1 + quarterlyRate) * 0.94);
    const unrepLoss = Math.round(baseBenchmarkToday * (1 + quarterlyRate) - vUnrepaired);
    points.push({
      period: `Q4 2026 (As-Is)`,
      periodArabic: `الربع الرابع 2026 (دون معالجة)`,
      year: 2026,
      quarter: "Q4",
      conditionIndex: Math.max(50, currentCondition - 5),
      baseMarketValuation: Math.round(baseBenchmarkToday * (1 + quarterlyRate)),
      realizedValuation: vUnrepaired,
      depreciationLoss: unrepLoss,
      pricePerSqm: Math.round(vUnrepaired / size),
      event: "Projected As-Is Auction Settlement",
      eventArabic: "التصفية بالحالة الراهنة (خصم مزاد متوقع)",
      isForecast: true,
      status: "impaired",
      aiDefectImpact: {
        type: "dip",
        defectName: "Compounding Unremediated Defect Penalty (As-Is Discount)",
        defectNameArabic: "خصم تصفية متراكم لعدم استدراك العيوب الفنية",
        severity: "Critical",
        deltaSar: -unrepLoss,
        deltaPct: -9.8,
        sbcClause: "Judicial Auction Liquidation Discount",
        aiConfidence: 94,
        rootCause: "Buyer risk aversion discounting uncertified structural/thermal integrity during judicial bid rounds.",
        rootCauseArabic: "تحوط المستثمرين والمزايدين بخصم إضافي لغياب شهادة السلامة الإنشائية المعتمدة.",
        remediationAction: "Preventive remediation prior to auction listing to avoid severe capital haircut.",
        remediationActionArabic: "معالجة العيوب قبل الطرح لتجنب الخصم السعري الحاد.",
      },
    });

    // Milestone 7: Forecast With Next Best Action Remediation - REVENUE SPIKE / REBOUND
    const vRemediated = Math.round(baseBenchmarkToday * (1 + quarterlyRate) * 1.015);
    const upliftVal = vRemediated - currentValuation;
    const upliftPct = ((upliftVal / currentValuation) * 100).toFixed(1);
    points.push({
      period: `Q4 2026 (Remediated)`,
      periodArabic: `الربع الرابع 2026 (بعد المعالجة)`,
      year: 2026,
      quarter: "Q4",
      conditionIndex: 97,
      baseMarketValuation: Math.round(baseBenchmarkToday * (1 + quarterlyRate)),
      realizedValuation: vRemediated,
      depreciationLoss: 0,
      pricePerSqm: Math.round(vRemediated / size),
      event: "Post-Remediation Valuation Rebound",
      eventArabic: "استرداد القيمة بعد معالجة العيوب الإنشائية",
      isForecast: true,
      status: "remediated",
      aiDefectImpact: {
        type: "spike",
        defectName: "Valuation Surge via Certified Engineering Remediation",
        defectNameArabic: "طفرة استرداد القيمة بعد المعالجة المعتمدة هندسياً",
        severity: "Resolved",
        deltaSar: upliftVal,
        deltaPct: +Number(upliftPct),
        sbcClause: "Full SBC-201 / SBC-304 Re-Certification",
        aiConfidence: 99,
        rootCause: "Elimination of defect penalty + Saudi Council of Engineers certified compliance dossier issuance.",
        rootCauseArabic: "إلغاء خصم العيوب بالكامل وصدور شهادة الامتثال المعتمدة من هيئة المهندسين.",
        remediationAction: "Asset classified as Prime Investment Grade for direct auction clearance.",
        remediationActionArabic: "تصنيف الأصل كأصل ممتاز جاهز للمزايدة الفورية بأعلى عائد.",
      },
    });

    return points;
  }, [asset, scores.conditionIndex]);

  // Filter based on selected time horizon
  const filteredData = useMemo(() => {
    if (timeHorizon === "recent") {
      return trendHistory.slice(-4);
    }
    if (timeHorizon === "forecast") {
      return trendHistory.slice(-3);
    }
    return trendHistory;
  }, [trendHistory, timeHorizon]);

  // Current statistics
  const currentPoint = trendHistory.find((p) => p.isCurrent) || trendHistory[trendHistory.length - 2];
  const initialPoint = trendHistory[0];
  const postRemediationPoint = trendHistory[trendHistory.length - 1];

  const totalAppreciationPct = (
    ((currentPoint.baseMarketValuation - initialPoint.baseMarketValuation) /
      initialPoint.baseMarketValuation) *
    100
  ).toFixed(1);

  const conditionDepreciationSAR = currentPoint.depreciationLoss;
  const conditionDepreciationPct = (
    (conditionDepreciationSAR / currentPoint.baseMarketValuation) *
    100
  ).toFixed(2);

  const potentialUpliftSAR = postRemediationPoint.realizedValuation - currentPoint.realizedValuation;
  const potentialUpliftPct = (
    (potentialUpliftSAR / currentPoint.realizedValuation) *
    100
  ).toFixed(2);

  // Dynamic sensitivity valuation calculation based on slider
  const simulatedValuation = useMemo(() => {
    const base = currentPoint.baseMarketValuation;
    const penaltyRatio = ((100 - simulatedCondition) * 0.0035);
    return Math.round(base * (1 - penaltyRatio));
  }, [currentPoint.baseMarketValuation, simulatedCondition]);

  const simulatedLoss = currentPoint.baseMarketValuation - simulatedValuation;

  // Custom Dot component to highlight AI Defect Dips and Spikes directly on the chart
  const renderCustomValuationDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;

    const impact = payload.aiDefectImpact as AIDefectImpact | undefined;

    if (highlightAIDefects && impact?.type === "dip") {
      const isSelected = selectedDefectMarker?.period === payload.period;
      const isCritical = impact.severity === "Critical";
      return (
        <g
          key={`dip-dot-${payload.period}`}
          className="cursor-pointer transition-transform hover:scale-110"
          onClick={() => setSelectedDefectMarker(payload)}
        >
          {/* Animated Pulsing Beacon Halo */}
          <circle
            cx={cx}
            cy={cy}
            r={14}
            fill={isCritical ? "#DC2626" : "#EA580C"}
            fillOpacity={0.28}
            className="animate-ping"
          />
          {/* Solid Glow Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={isSelected ? 9 : 7.5}
            fill={isCritical ? "#7F1D1D" : "#7C2D12"}
            stroke={isCritical ? "#F87171" : "#FB923C"}
            strokeWidth={isSelected ? 2.5 : 1.8}
          />
          {/* Center Point */}
          <circle cx={cx} cy={cy} r={3} fill="#FEF2F2" />

          {/* Small Floating Visual Indicator Tag */}
          <g transform={`translate(${cx - 24}, ${cy + 11})`}>
            <rect
              width={48}
              height={16}
              rx={4}
              fill="#450A0A"
              stroke={isCritical ? "#EF4444" : "#F97316"}
              strokeWidth={1}
              opacity={0.95}
            />
            <text
              x={24}
              y={11.5}
              fill="#FECACA"
              fontSize={8}
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              ▼ DIP
            </text>
          </g>
        </g>
      );
    }

    if (highlightAIDefects && impact?.type === "spike") {
      const isSelected = selectedDefectMarker?.period === payload.period;
      return (
        <g
          key={`spike-dot-${payload.period}`}
          className="cursor-pointer transition-transform hover:scale-110"
          onClick={() => setSelectedDefectMarker(payload)}
        >
          {/* Animated Green Rebound Halo */}
          <circle
            cx={cx}
            cy={cy}
            r={15}
            fill="#10B981"
            fillOpacity={0.3}
            className="animate-ping"
          />
          {/* Solid Glow Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={isSelected ? 9 : 8}
            fill="#064E3B"
            stroke="#34D399"
            strokeWidth={isSelected ? 2.5 : 1.8}
          />
          {/* Center Point */}
          <circle cx={cx} cy={cy} r={3.5} fill="#ECFDF5" />

          {/* Small Floating Visual Indicator Tag */}
          <g transform={`translate(${cx - 28}, ${cy - 24})`}>
            <rect
              width={56}
              height={16}
              rx={4}
              fill="#064E3B"
              stroke="#10B981"
              strokeWidth={1}
              opacity={0.95}
            />
            <text
              x={28}
              y={11.5}
              fill="#A7F3D0"
              fontSize={8}
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              ▲ SPIKE
            </text>
          </g>
        </g>
      );
    }

    return (
      <circle
        key={`std-dot-${payload.period}`}
        cx={cx}
        cy={cy}
        r={4}
        fill="#10B981"
        stroke="#050811"
        strokeWidth={1.5}
      />
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center gap-2">
        <SimulatedBadge isArabic={isArabic} />
        <span className="text-[10px] text-slate-400">
          {isArabic
            ? "مؤشرات السوق والتوقعات هنا توضيحية. جدول العمليات العقارية (يوليو 2026) مأخوذ من ملف بيانات مفتوحة مرفق بالمشروع، ويلزم التحقق من مصدره قبل الاستخدام الرسمي."
            : "Market indicators and forecasts here are illustrative. The July 2026 real-estate operations table comes from an open-data file bundled with the project; verify its source before official use."}
        </span>
      </div>
      {/* ══ HEADER BANNER & OVERVIEW ══ */}
      <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 lg:p-7 shadow-2xl overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isArabic ? "تحليل اتجاهات السوق والقيمة" : "MARKET VALUATION & CONDITION DYNAMICS"}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {isArabic ? `سجل الأصل #${asset.id}` : `Asset #${asset.id}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isArabic
                ? `مسار التقييم التاريخي وأثر كود البناء على التصفية`
                : `Historical Valuation Trend & Condition Elasticity`}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {isArabic
                ? `مراقبة ارتباط التقييم السوقي بمؤشر الحالة الفنية (Condition Index)، مع قياس فجوة الإهلاك الإنشائي والتنبؤ بالقيمة المستردة بعد تطبيق خطة المعالجة (Remediation Rebound).`
                : `Tracking the correlation between market valuation and spatial condition index over time, quantifying structural defect depreciation drag, and forecasting post-remediation auction uplift.`}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isArabic ? "مؤشر الحالة" : "Condition"}
              </span>
              <span className="text-lg font-bold font-mono text-cyan-300">
                {scores.conditionIndex}/100
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isArabic ? "التقييم الحالي" : "Valuation"}
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {(asset.valuationSar / 1000000).toFixed(2)}M <span className="text-xs">{isArabic ? "ر.س" : "SAR"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FINANCIAL & CONDITION METRIC CARDS ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Benchmark Potential vs Realized */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>{isArabic ? "القيمة المرجعية غير المقيدة" : "Unimpaired Benchmark"}</span>
              <Building className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {(currentPoint.baseMarketValuation / 1000000).toFixed(2)}{" "}
              <span className="text-xs font-normal text-slate-400">{isArabic ? "مليون ر.س" : "M SAR"}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{isArabic ? "النمو التراكمي للسوق:" : "Macro Market Growth:"}</span>
            <span className="text-cyan-300 font-mono font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              +{totalAppreciationPct}%
            </span>
          </div>
        </div>

        {/* Card 2: Condition-Driven Depreciation Drag */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-amber-500/20 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>{isArabic ? "فجوة الإهلاك بفعل العيوب" : "Condition Depreciation Drag"}</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300">
              -{(conditionDepreciationSAR / 1000).toLocaleString()}{" "}
              <span className="text-xs font-normal text-slate-400">{isArabic ? "ألف ر.س" : "k SAR"}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{isArabic ? "خصم التصفية الفني:" : "Condition Impairment:"}</span>
            <span className="text-amber-400 font-mono font-bold flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3 text-amber-400" />
              -{conditionDepreciationPct}%
            </span>
          </div>
        </div>

        {/* Card 3: Remediation Value Upside */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/20 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>{isArabic ? "استرداد القيمة بالمعالجة" : "Post-Remediation Upside"}</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              +{(potentialUpliftSAR / 1000).toLocaleString()}{" "}
              <span className="text-xs font-normal text-slate-400">{isArabic ? "ألف ر.س" : "k SAR"}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{isArabic ? "العائد الاستثماري المتوقع:" : "Remediation Multiple:"}</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              +{potentialUpliftPct}%
            </span>
          </div>
        </div>

        {/* Card 4: Auction Liquidity Velocity */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>{isArabic ? "سرعة التصفية في المزاد" : "Auction Liquidity Speed"}</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {scores.conditionIndex >= 85 ? "14 - 18" : scores.conditionIndex >= 70 ? "28 - 35" : "45+"}{" "}
              <span className="text-xs font-normal text-slate-400">{isArabic ? "يوم" : "Days"}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{isArabic ? "تصنيف السيولة:" : "Liquidity Grade:"}</span>
            <span
              className={`font-mono font-bold ${
                scores.conditionIndex >= 85
                  ? "text-emerald-400"
                  : scores.conditionIndex >= 70
                  ? "text-cyan-300"
                  : "text-amber-400"
              }`}
            >
              {scores.conditionIndex >= 85
                ? isArabic
                  ? "عالي السيولة (High)"
                  : "Prime Liquidity"
                : isArabic
                ? "متوسط (Moderate)"
                : "Moderate Liquidity"}
            </span>
          </div>
        </div>
      </div>

      {/* ══ SAUDI OPEN DATA JULY 2026 REAL ESTATE RADAR ══ */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-cyan-950/30 border border-emerald-500/30 p-5 lg:p-6 shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isArabic ? "بوابة البيانات المفتوحة السعودية · وزارة العدل" : "Saudi Open Data Portal · Ministry of Justice"}</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                {isArabic ? "يوليو 2026 (محرم 1448 هـ)" : "July 2026 (1448 AH)"}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-700/60">
                ID: c4eb90eb-de47-4996-9eba-8ae503980bcf
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Gavel className="w-5 h-5 text-emerald-400" />
              <span>
                {isArabic
                  ? "مؤشرات العمليات العقارية المسجلة وأثرها على تصفية الأصل"
                  : "National Real Estate Operations Radar & Liquidation Velocity"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isArabic
                ? `تم رصد 65,702 عملية عقارية موثقة بالمملكة خلال الفترة، تتصدرها إجراءات الحجز التحفظي وفك الحجز (35,973 عملية بنسبة 54.7%) والإفراغ العقاري (8,785 عملية). يوفر هذا الرادار للمصفي والمشتري مؤشراً استرشادياً لسرعة حركة السوق وقدرة التسييل.`
                : `65,702 recorded government transactions in Saudi Arabia during the period, led by Precautionary Seizures & Releases (35,973 ops / 54.7%) and Conveyance (8,785 ops). Providing verifiable market liquidity depth.`}
            </p>
          </div>

          <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsOpenDataModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>{isArabic ? "فتح مستكشف العمليات والتحليلات (65,702 عملية)" : "Explore Operations & Analytics (65,702 ops)"}</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">{isArabic ? "إجمالي العمليات بالمملكة" : "Total Saudi Operations"}</span>
            <span className="text-base sm:text-lg font-bold font-mono text-cyan-300 mt-0.5 block">
              {SAUDI_REAL_ESTATE_METADATA.totalOperations.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-center">
            <span className="text-[10px] text-emerald-400 block font-mono">{isArabic ? "الإفراغات (نقل ملكية)" : "Conveyance Sales"}</span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-300 mt-0.5 block">
              {SAUDI_REAL_ESTATE_METADATA.totalConveyance.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 text-center">
            <span className="text-[10px] text-amber-400 block font-mono">{isArabic ? "الحجز التحفظي وفكه" : "Seizures & Releases"}</span>
            <span className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-0.5 block">
              {(SAUDI_REAL_ESTATE_METADATA.totalPrecautionarySeizures + SAUDI_REAL_ESTATE_METADATA.totalSeizureReleases).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20 text-center">
            <span className="text-[10px] text-purple-400 block font-mono">{isArabic ? "السجل العقاري العيني" : "In-Kind Registry (RER)"}</span>
            <span className="text-base sm:text-lg font-bold font-mono text-purple-300 mt-0.5 block">
              {SAUDI_REAL_ESTATE_METADATA.totalInKindRegistry.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ══ INTERACTIVE RECHARTS VISUALIZATION CONTAINER ══ */}
      <div className="p-5 lg:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
        {/* Graph Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>
                {isArabic
                  ? "الرسم البياني لتطور القيمة ومؤشر الحالة عبر الفترات"
                  : "Valuation Trajectory vs. Condition Index Timeline"}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic
                ? "مقارنة مسار القيمة السوقية المرجعية بالقيمة الفعلية المتأثرة بحالة العقار وتوقعات المعالجة"
                : "Comparing baseline market trajectory against condition-impaired realized value & remediation forecast"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle AI Defect Highlights */}
            <button
              onClick={() => setHighlightAIDefects((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                highlightAIDefects
                  ? "bg-rose-950/40 text-rose-300 border-rose-500/50 shadow-xs"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
              title="Toggle visual indicators for AI-detected dips and spikes"
            >
              <Zap className={`w-3.5 h-3.5 ${highlightAIDefects ? "text-rose-400 animate-pulse" : "text-slate-500"}`} />
              <span>
                {isArabic
                  ? highlightAIDefects
                    ? "مؤشرات العيوب: مفعّلة"
                    : "مؤشرات العيوب: معطلة"
                  : highlightAIDefects
                  ? "AI Defect Markers: Active"
                  : "AI Defect Markers: Hidden"}
              </span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setChartMode("dual")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  chartMode === "dual"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isArabic ? "مزدوج (القيمة والحالة)" : "Dual Axis"}
              </button>
              <button
                onClick={() => setChartMode("valuation")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  chartMode === "valuation"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isArabic ? "التقييم فقط" : "Valuation (SAR)"}
              </button>
              <button
                onClick={() => setChartMode("condition")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  chartMode === "condition"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isArabic ? "مؤشر الحالة فقط" : "Condition %"}
              </button>
            </div>

            {/* Time Horizon Filter */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setTimeHorizon("all")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeHorizon === "all"
                    ? "bg-slate-800 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isArabic ? "الكل" : "All"}
              </button>
              <button
                onClick={() => setTimeHorizon("recent")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeHorizon === "recent"
                    ? "bg-slate-800 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isArabic ? "آخر سنتين" : "2024-2026"}
              </button>
              <button
                onClick={() => setTimeHorizon("forecast")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeHorizon === "forecast"
                    ? "bg-slate-800 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isArabic ? "التوقعات" : "Forecast"}
              </button>
            </div>
          </div>
        </div>

        {/* ── AI DEFECT INDICATOR BANNER CALLOUTS ── */}
        {highlightAIDefects && (
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-bold text-white text-[11px]">
                {isArabic ? "مؤشرات تأثير العيوب المرصودة بالذكاء الاصطناعي:" : "AI Detected Valuation Impact Markers:"}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Live Audit Dip Marker Pill */}
              <button
                onClick={() => {
                  const target = trendHistory.find((p) => p.isCurrent);
                  if (target) setSelectedDefectMarker(target);
                }}
                className={`px-2 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedDefectMarker?.isCurrent
                    ? "bg-rose-900/60 text-rose-200 border-rose-500"
                    : "bg-rose-950/40 text-rose-300 border-rose-900/60 hover:border-rose-500/50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span className="font-bold">
                  {isArabic ? "انخفاض الفحص الحالي:" : "Live Audit Dip:"}
                </span>
                <span className="text-rose-400 font-bold">
                  -{(currentPoint.depreciationLoss / 1000).toLocaleString()} {isArabic ? "ر.س" : "SAR"}
                </span>
              </button>

              {/* Post-Remediation Spike Marker Pill */}
              <button
                onClick={() => {
                  const target = trendHistory.find((p) => p.status === "remediated");
                  if (target) setSelectedDefectMarker(target);
                }}
                className={`px-2 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedDefectMarker?.status === "remediated"
                    ? "bg-emerald-900/60 text-emerald-200 border-emerald-500"
                    : "bg-emerald-950/40 text-emerald-300 border-emerald-900/60 hover:border-emerald-500/50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-bold">
                  {isArabic ? "طفرة المعالجة:" : "Remediation Spike:"}
                </span>
                <span className="text-emerald-400 font-bold">
                  +{(potentialUpliftSAR / 1000).toLocaleString()} {isArabic ? "ر.س" : "SAR"}
                </span>
              </button>

              <span className="text-[10px] text-slate-500 hidden xl:inline">
                {isArabic ? "(انقر على أي مؤشر لعرض تفاصيل العيب)" : "(Click any marker on chart for root-cause breakdown)"}
              </span>
            </div>
          </div>
        )}

        {/* The Recharts Canvas */}
        <div className="h-[380px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 25, right: 30, left: isArabic ? 10 : 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="condGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

              <XAxis
                dataKey={isArabic ? "periodArabic" : "period"}
                stroke="#64748B"
                tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "monospace" }}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
              />

              {/* Left Y Axis: Valuation in Millions SAR */}
              {(chartMode === "dual" || chartMode === "valuation") && (
                <YAxis
                  yAxisId="left"
                  stroke="#10B981"
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  tick={{ fill: "#10B981", fontSize: 11, fontFamily: "monospace" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                />
              )}

              {/* Right Y Axis: Condition Index (0 - 100) */}
              {(chartMode === "dual" || chartMode === "condition") && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#06B6D4"
                  domain={[40, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: "#06B6D4", fontSize: 11, fontFamily: "monospace" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                />
              )}

              {/* Reference Line for Current Live Inspection */}
              <ReferenceLine
                x={isArabic ? "الربع الثالث 2026 (الحالي)" : "Q3 2026 (Live)"}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                label={{
                  value: isArabic ? "المعاينة الحية 2026" : "Current Audit",
                  fill: "#F59E0B",
                  fontSize: 10,
                  fontFamily: "monospace",
                  position: "top",
                }}
              />

              {/* Tooltip */}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as TrendDataPoint;
                    const defect = data.aiDefectImpact;
                    return (
                      <div className="bg-slate-950/95 border border-slate-800 p-4 rounded-xl shadow-2xl text-xs font-mono max-w-sm space-y-2.5 backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-white text-sm">
                            {isArabic ? data.periodArabic : data.period}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              data.isForecast
                                ? "bg-purple-900/60 text-purple-300 border border-purple-700/50"
                                : data.isCurrent
                                ? "bg-amber-900/60 text-amber-300 border border-amber-700/50"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {data.isForecast
                              ? isArabic
                                ? "توقع مستقبلي"
                                : "Forecast"
                              : data.isCurrent
                              ? isArabic
                                ? "الفحص الحالي"
                                : "Live Audit"
                              : isArabic
                              ? "سجل تاريخي"
                              : "Historical"}
                          </span>
                        </div>

                        {/* If AI Defect Impact exists on this point, render dedicated highlight box */}
                        {defect && (
                          <div
                            className={`p-2.5 rounded-lg border text-[11px] space-y-1.5 ${
                              defect.type === "dip"
                                ? "bg-rose-950/50 border-rose-800/80 text-rose-200"
                                : defect.type === "spike"
                                ? "bg-emerald-950/50 border-emerald-800/80 text-emerald-200"
                                : "bg-cyan-950/50 border-cyan-800/80 text-cyan-200"
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span className="flex items-center gap-1.5">
                                {defect.type === "dip" ? (
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                                <span>
                                  {defect.type === "dip"
                                    ? isArabic
                                      ? "انخفاض بفعل عيب مرصود:"
                                      : "AI DEFECT VALUATION DIP:"
                                    : isArabic
                                    ? "طفرة استرداد القيمة:"
                                    : "REMEDIATION REBOUND SPIKE:"}
                                </span>
                              </span>
                              <span
                                className={`font-mono font-extrabold text-xs ${
                                  defect.deltaSar < 0 ? "text-rose-400" : "text-emerald-400"
                                }`}
                              >
                                {defect.deltaSar < 0 ? "" : "+"}
                                {(defect.deltaSar / 1000).toLocaleString()} {isArabic ? "ر.س" : "SAR"}
                              </span>
                            </div>

                            <div className="text-slate-300 text-[10.5px] leading-snug">
                              <strong>{isArabic ? "العيب:" : "Defect:"}</strong>{" "}
                              {isArabic ? defect.defectNameArabic : defect.defectName}
                            </div>

                            {defect.sbcClause && (
                              <div className="text-[9.5px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                                <span>{defect.sbcClause}</span>
                                {defect.aiConfidence && (
                                  <span className="text-cyan-300">
                                    AI Conf: <strong>{defect.aiConfidence}%</strong>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="text-slate-400">{isArabic ? "مؤشر الحالة الفنية:" : "Condition Index:"}</span>
                            <span className="font-bold text-cyan-300">{data.conditionIndex}/100</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="text-slate-400">{isArabic ? "التقييم الفعلي:" : "Realized Value:"}</span>
                            <span className="font-bold text-emerald-400">
                              {(data.realizedValuation / 1000000).toFixed(2)} {isArabic ? "مليون ر.س" : "M SAR"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="text-slate-400">{isArabic ? "القيمة المرجعية:" : "Benchmark Value:"}</span>
                            <span className="text-slate-200">
                              {(data.baseMarketValuation / 1000000).toFixed(2)} {isArabic ? "مليون ر.س" : "M SAR"}
                            </span>
                          </div>
                          {data.depreciationLoss > 0 && (
                            <div className="flex justify-between items-center text-amber-400 pt-1 border-t border-slate-800">
                              <span>{isArabic ? "فجوة الإهلاك:" : "Condition Gap:"}</span>
                              <span className="font-bold">-{(data.depreciationLoss / 1000).toLocaleString()} {isArabic ? "ر.س" : "SAR"}</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                          <span className="text-cyan-400 font-semibold">{isArabic ? "الحدث: " : "Milestone: "}</span>
                          {isArabic ? data.eventArabic : data.event}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  paddingTop: "12px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              />

              {/* Area Under Realized Valuation Curve */}
              {(chartMode === "dual" || chartMode === "valuation") && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="realizedValuation"
                  stroke="none"
                  fill="url(#valGrad)"
                />
              )}

              {/* Baseline Market Valuation (Dashed) */}
              {(chartMode === "dual" || chartMode === "valuation") && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="baseMarketValuation"
                  name={isArabic ? "القيمة المرجعية (بدون عيوب)" : "Benchmark Market Value (Unimpaired)"}
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: "#94A3B8" }}
                />
              )}

              {/* Realized Market Valuation (Solid Green/Emerald) with Custom AI Defect Indicator Dots */}
              {(chartMode === "dual" || chartMode === "valuation") && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="realizedValuation"
                  name={isArabic ? "التقييم الفعلي المحقق (ر.س)" : "Realized Asset Valuation (SAR)"}
                  stroke="#10B981"
                  strokeWidth={3}
                  activeDot={{ r: 7, fill: "#10B981", stroke: "#050811", strokeWidth: 2 }}
                  dot={renderCustomValuationDot}
                />
              )}

              {/* Condition Index Curve (Cyan) */}
              {(chartMode === "dual" || chartMode === "condition") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conditionIndex"
                  name={isArabic ? "مؤشر الحالة الفنية (0 - 100)" : "Spatial Condition Index (0 - 100)"}
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  activeDot={{ r: 6, fill: "#06B6D4", stroke: "#050811", strokeWidth: 2 }}
                  dot={{ r: 4, fill: "#06B6D4" }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ── INTERACTIVE SELECTED DEFECT DEEP-DIVE MODAL/CARD ── */}
        {selectedDefectMarker?.aiDefectImpact && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-800/50 shadow-2xl relative animate-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => setSelectedDefectMarker(null)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close defect analysis"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedDefectMarker.aiDefectImpact.type === "dip"
                      ? "bg-rose-950 text-rose-300 border border-rose-800"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  }`}
                >
                  {selectedDefectMarker.aiDefectImpact.type === "dip" ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {isArabic ? selectedDefectMarker.periodArabic : selectedDefectMarker.period}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold ${
                        selectedDefectMarker.aiDefectImpact.severity === "Critical"
                          ? "bg-rose-900/60 text-rose-200"
                          : selectedDefectMarker.aiDefectImpact.severity === "Moderate"
                          ? "bg-amber-900/60 text-amber-200"
                          : "bg-emerald-900/60 text-emerald-200"
                      }`}
                    >
                      {selectedDefectMarker.aiDefectImpact.severity} Severity
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {isArabic
                      ? selectedDefectMarker.aiDefectImpact.defectNameArabic
                      : selectedDefectMarker.aiDefectImpact.defectName}
                  </h4>
                </div>
              </div>

              <div className="text-end font-mono">
                <span className="text-xs text-slate-400 block">
                  {isArabic ? "الأثر المالي المباشر:" : "Net Valuation Delta:"}
                </span>
                <span
                  className={`text-lg font-bold ${
                    selectedDefectMarker.aiDefectImpact.deltaSar < 0
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {selectedDefectMarker.aiDefectImpact.deltaSar < 0 ? "" : "+"}
                  {(selectedDefectMarker.aiDefectImpact.deltaSar / 1000).toLocaleString()}{" "}
                  <span className="text-xs">{isArabic ? "ألف ر.س" : "k SAR"}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase mb-1">
                  {isArabic ? "السبب الجذري المرصود بالذكاء الاصطناعي:" : "AI Spatial Root Cause:"}
                </span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  {isArabic
                    ? selectedDefectMarker.aiDefectImpact.rootCauseArabic
                    : selectedDefectMarker.aiDefectImpact.rootCause}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase mb-1">
                  {isArabic ? "المرجعية التنظيمية وكود البناء:" : "Regulatory Standard (SBC):"}
                </span>
                <p className="text-cyan-300 font-bold text-[11px]">
                  {selectedDefectMarker.aiDefectImpact.sbcClause}
                </p>
                <div className="mt-1 text-[10px] text-slate-400">
                  AI Neural Confidence: <strong className="text-white">{selectedDefectMarker.aiDefectImpact.aiConfidence || 92}%</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-900/40">
                <span className="text-slate-400 text-[10px] block uppercase mb-1 flex items-center gap-1 text-emerald-300">
                  <Wrench className="w-3 h-3" />
                  <span>{isArabic ? "إجراء المعالجة الموصى به:" : "Recommended Mitigation:"}</span>
                </span>
                <p className="text-emerald-200 text-[11px] leading-relaxed">
                  {isArabic
                    ? selectedDefectMarker.aiDefectImpact.remediationActionArabic
                    : selectedDefectMarker.aiDefectImpact.remediationAction}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ CONDITION ELASTICITY STRESS-TESTER & SENSITIVITY SLIDER ══ */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                {isArabic ? "حاسبة مرونة التقييم الفني وحساسية العيوب" : "Condition Valuation Sensitivity Stress-Tester"}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isArabic
                ? "حرّك المؤشر لمحاكاة أثر تدهور أو تحسن الحالة الإنشائية على السعر المرجعي للتصفية وسعر المتر المربع فورياً."
                : "Simulate how variations in structural condition index immediately compress or expand the liquidation auction reserve price."}
            </p>

            {/* Interactive Slider */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{isArabic ? "محاكاة مؤشر الحالة:" : "Simulated Condition Index:"}</span>
                <span className="text-cyan-300 font-bold text-sm bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  {simulatedCondition}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={simulatedCondition}
                onChange={(e) => setSimulatedCondition(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{isArabic ? "40% (تلف حرج)" : "40% (Severe Defect)"}</span>
                <span>{isArabic ? "80% (مقبول)" : "80% (Acceptable)"}</span>
                <span>{isArabic ? "100% (مثالي)" : "100% (Pristine)"}</span>
              </div>
            </div>
          </div>

          {/* Real-Time Outcome Calculation Box */}
          <div className="w-full lg:w-80 bg-slate-950/90 border border-slate-800 rounded-xl p-4.5 space-y-3 shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400 font-mono">{isArabic ? "التقييم المحاكى:" : "Simulated Valuation:"}</span>
              <button
                onClick={() => setSimulatedCondition(scores.conditionIndex)}
                title="Reset to live score"
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isArabic ? "إعادة تعيين" : "Reset"}</span>
              </button>
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {(simulatedValuation / 1000000).toFixed(2)}{" "}
                <span className="text-xs text-slate-400">{isArabic ? "مليون ر.س" : "M SAR"}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {isArabic ? "سعر المتر المربع: " : "Price / sq m: "}
                <span className="text-white font-semibold">
                  {Math.round(simulatedValuation / (asset.sizeSqm || 1400)).toLocaleString()}{" "}
                  {isArabic ? "ر.س/م²" : "SAR/m²"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs flex justify-between items-center font-mono">
              <span className="text-slate-400">{isArabic ? "الأثر على القيمة:" : "Valuation Delta:"}</span>
              <span
                className={`font-bold ${
                  simulatedLoss <= 0
                    ? "text-emerald-400"
                    : simulatedLoss <= currentPoint.depreciationLoss
                    ? "text-cyan-300"
                    : "text-amber-400"
                }`}
              >
                {simulatedLoss <= 0 ? "+" : "-"}
                {Math.abs(Math.round(simulatedLoss / 1000)).toLocaleString()}{" "}
                <span className="text-[10px]">{isArabic ? "ألف ر.س" : "k SAR"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ HISTORICAL VALUATION & CONDITION LEDGER TABLE ══ */}
      <div className="p-5 lg:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              {isArabic ? "سجل المعاينات التاريخية ومحطات تقييم الأصل" : "Historical Audit & Valuation Ledger"}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {trendHistory.length} {isArabic ? "محطات زمنية" : "Milestones"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse" dir={isArabic ? "rtl" : "ltr"}>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3.5 font-semibold">{isArabic ? "الفترة" : "Period"}</th>
                <th className="py-3 px-3.5 font-semibold">{isArabic ? "الحدث / الفحص" : "Audit / Milestone"}</th>
                <th className="py-3 px-3.5 font-semibold">{isArabic ? "مؤشر الحالة" : "Condition"}</th>
                <th className="py-3 px-3.5 font-semibold">{isArabic ? "التقييم المحقق" : "Realized Value"}</th>
                <th className="py-3 px-3.5 font-semibold">{isArabic ? "سعر المتر" : "Price/m²"}</th>
                <th className="py-3 px-3.5 font-semibold">{isArabic ? "فجوة الإهلاك" : "Impairment Gap"}</th>
                <th className="py-3 px-3.5 font-semibold">{isArabic ? "أثر الذكاء الاصطناعي" : "AI Defect Impact"}</th>
                <th className="py-3 px-3.5 font-semibold">{isArabic ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {trendHistory.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => {
                    if (row.aiDefectImpact) setSelectedDefectMarker(row);
                  }}
                  className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                    row.isCurrent ? "bg-cyan-500/5 font-semibold" : ""
                  } ${
                    selectedDefectMarker?.period === row.period ? "bg-cyan-950/40 ring-1 ring-cyan-500/40" : ""
                  }`}
                >
                  <td className="py-3 px-3.5 text-white flex items-center gap-1.5">
                    {row.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                    <span>{isArabic ? row.periodArabic : row.period}</span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    {isArabic ? row.eventArabic : row.event}
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        row.conditionIndex >= 90
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                          : row.conditionIndex >= 75
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-800/40"
                          : "bg-amber-950 text-amber-300 border border-amber-800/40"
                      }`}
                    >
                      {row.conditionIndex}%
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-emerald-400 font-bold">
                    {(row.realizedValuation / 1000000).toFixed(2)} {isArabic ? "مليون ر.س" : "M SAR"}
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    {row.pricePerSqm.toLocaleString()} {isArabic ? "ر.س" : "SAR"}
                  </td>
                  <td className="py-3 px-3.5 font-mono">
                    {row.depreciationLoss > 0 ? (
                      <span className="text-amber-400">
                        -{(row.depreciationLoss / 1000).toLocaleString()} {isArabic ? "ر.س" : "SAR"}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  {/* AI Defect Impact column */}
                  <td className="py-3 px-3.5">
                    {row.aiDefectImpact ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          row.aiDefectImpact.type === "dip"
                            ? "bg-rose-950/60 text-rose-300 border-rose-800/60"
                            : row.aiDefectImpact.type === "spike"
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        {row.aiDefectImpact.type === "dip" ? (
                          <TrendingDown className="w-3 h-3 text-rose-400" />
                        ) : row.aiDefectImpact.type === "spike" ? (
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Info className="w-3 h-3 text-cyan-400" />
                        )}
                        <span>
                          {row.aiDefectImpact.deltaSar < 0 ? "" : "+"}
                          {(row.aiDefectImpact.deltaSar / 1000).toLocaleString()}k
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        row.status === "remediated"
                          ? "bg-purple-900/40 text-purple-300 border border-purple-700/40"
                          : row.status === "optimal"
                          ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40"
                          : row.status === "wear"
                          ? "bg-cyan-900/40 text-cyan-300 border border-cyan-700/40"
                          : "bg-amber-900/40 text-amber-300 border border-amber-700/40"
                      }`}
                    >
                      {row.status === "remediated"
                        ? isArabic
                          ? "مسترد بالمعالجة"
                          : "Remediated"
                        : row.status === "optimal"
                        ? isArabic
                          ? "مطابق ومثالي"
                          : "Optimal"
                        : row.status === "wear"
                        ? isArabic
                          ? "تآكل اعتيادي"
                          : "Normal Wear"
                        : isArabic
                        ? "خصم تصفية"
                        : "Impaired"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ SAUDI OPEN DATA JULY 2026 MODAL ══ */}
      <SaudiOpenDataJuly2026Modal
        isOpen={isOpenDataModalOpen}
        onClose={() => setIsOpenDataModalOpen(false)}
        isArabic={isArabic}
        currentAsset={asset}
      />
    </div>
  );
};

