import React, { useState, useMemo, useEffect } from "react";
import { GlassCard } from "../common/GlassCard";
import { Badge } from "../common/Badge";
import { useTheme } from "../../context/ThemeContext";
import { calculateLiquidationReadiness, computeAssetScores } from "../../utils/scoring";
import { SimulatedBadge } from "../common/DemoDataBanner";
import { AssetRecord } from "../../types";
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
import {
  Zap,
  ArrowRight,
  Sliders,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  CheckCircle2,
  Wrench,
  Clock,
  ArrowUpRight,
  BarChart3,
  ShieldCheck,
  Building,
  Coins,
  FileCheck2,
  Layers,
  ChevronRight,
  Info,
} from "lucide-react";

interface WhatIfSimulatorViewProps {
  asset?: AssetRecord;
  isArabic?: boolean;
}

interface RepairScenarioItem {
  id: string;
  title: string;
  titleArabic: string;
  category: "Roof & Envelope" | "Structural" | "MEP & Drainage" | "Electrical & HVAC" | "Documentation";
  categoryArabic: string;
  costSar: number;
  valueUpliftSar: number;
  readinessBoost: number;
  daysSaved: number;
  sbcCode: string;
  desc: string;
  descArabic: string;
  iconName: "roof" | "structural" | "drainage" | "hvac" | "legal";
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  asset,
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  // Preset scenarios matching the PRD
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>("current");

  // Baseline = the asset's actual computed scores (same code as the passport).
  const base = useMemo(() => {
    if (!asset) return { ci: 100, cov: 100, unresolved: 0, missing: 0, ready: 100 };
    const sc = computeAssetScores(asset.findings, asset.coverageAreas, asset.missingFieldsCount);
    return { ci: sc.conditionIndex, cov: sc.coveragePct, unresolved: sc.unresolvedCount, missing: asset.missingFieldsCount, ready: sc.liquidationReadiness };
  }, [asset]);

  // Custom interactive slider parameters, seeded from the asset
  const [simConditionIndex, setSimConditionIndex] = useState<number>(base.ci);
  const [simCoveragePct, setSimCoveragePct] = useState<number>(base.cov);
  const [simUnresolvedDefects, setSimUnresolvedDefects] = useState<number>(base.unresolved);
  const [simMissingFields, setSimMissingFields] = useState<number>(base.missing);
  useEffect(() => {
    setSelectedScenarioKey("current");
    setSimConditionIndex(base.ci);
    setSimCoveragePct(base.cov);
    setSimUnresolvedDefects(base.unresolved);
    setSimMissingFields(base.missing);
  }, [base]);

  // Active base asset valuation (default to 14,800,000 SAR)
  const baseValuation = asset?.valuationSar || 14800000;

  // ── REPAIR SCENARIOS DEFINITION ──
  const REPAIR_SCENARIOS: RepairScenarioItem[] = useMemo(
    () => [
      {
        id: "roof_waterproofing",
        title: "Roof Waterproofing & Polyurethane Membrane",
        titleArabic: "عزل السطح وحماية العزل المائي والحراري",
        category: "Roof & Envelope",
        categoryArabic: "السطح والغلاف الخارجي",
        costSar: 45000,
        valueUpliftSar: 380000,
        readinessBoost: 8,
        daysSaved: 28,
        sbcCode: "SBC 304 / 201",
        desc: "Seals bitumen wear, eliminates active ponding risk, and guarantees thermal insulation compliance.",
        descArabic: "معالجة طبقات البيتومين التالفة ومنع تجمع مياه الأمطار وضمان كفاءة العزل المعتمد.",
        iconName: "roof",
      },
      {
        id: "facade_crack_injection",
        title: "North Facade Crack Infill & Structural Sealing",
        titleArabic: "حقن شروخ الواجهة الشمالية وتثبيت التكسيات",
        category: "Structural",
        categoryArabic: "الهيكل والواجهات",
        costSar: 32000,
        valueUpliftSar: 290000,
        readinessBoost: 7,
        daysSaved: 22,
        sbcCode: "SBC 201",
        desc: "Structural epoxy injection, expansion joint sealing, and exterior stone cladding anchoring.",
        descArabic: "حقن إيبوكسي إنشائي لفواصل التمدد وتثبيت تكسيات الحجر لضمان السلامة الإنشائية.",
        iconName: "structural",
      },
      {
        id: "basement_drainage",
        title: "Basement Drainage & Sump Pump Epoxy Re-coating",
        titleArabic: "تأهيل تصريف القبو وتجديد أرضية الإيبوكسي",
        category: "MEP & Drainage",
        categoryArabic: "السباكة وتصريف القبو",
        costSar: 28000,
        valueUpliftSar: 220000,
        readinessBoost: 5,
        daysSaved: 16,
        sbcCode: "SBC 701",
        desc: "Dual submersible sump pump overhaul, waterproofing skirt re-lining, and heavy-duty floor coating.",
        descArabic: "صيانة مضخات نزح المياه وتجديد عزل الجدران السفلية وطبقة الإيبوكسي للمواقف.",
        iconName: "drainage",
      },
      {
        id: "hvac_panel_balance",
        title: "HVAC Balancing & Electrical Load Certification",
        titleArabic: "موازنة التكييف واعتماد شهادة السلامة الكهربائية",
        category: "Electrical & HVAC",
        categoryArabic: "الميكانيك والكهرباء",
        costSar: 18000,
        valueUpliftSar: 160000,
        readinessBoost: 4,
        daysSaved: 14,
        sbcCode: "SBC 401 / 501",
        desc: "Civil Defense electrical safety audit, chiller filter overhaul, and air-distribution calibration.",
        descArabic: "مطابقة متطلبات الدفاع المدني ومعايرة أحمال القواطع الكهربائية وصيانة التكييف المركزي.",
        iconName: "hvac",
      },
      {
        id: "legal_docs_complete",
        title: "Certified Digital Title Deed & Zoning Survey",
        titleArabic: "تحديث الصك الإلكتروني ومطابقة رخصة البناء",
        category: "Documentation",
        categoryArabic: "التوثيق والتراخيص",
        costSar: 6000,
        valueUpliftSar: 130000,
        readinessBoost: 6,
        daysSaved: 20,
        sbcCode: "MOMRAH / REDF",
        desc: "Municipal zoning clearance, QR title deed verification, and full survey parcel mapping.",
        descArabic: "استكمال شهادة إتمام البناء وربط الصك مع منصة إحكام وتحديث المخططات المساحية.",
        iconName: "legal",
      },
    ],
    []
  );

  // Active toggled repair scenarios (Set of scenario IDs)
  const [toggledScenarioIds, setToggledScenarioIds] = useState<string[]>([
    "roof_waterproofing",
    "facade_crack_injection",
  ]);

  // Toggle scenario handler
  const handleToggleScenario = (id: string) => {
    setToggledScenarioIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Preset financial modes
  const handleApplyFinancialPreset = (mode: "none" | "quick" | "structural" | "all") => {
    if (mode === "none") {
      setToggledScenarioIds([]);
    } else if (mode === "quick") {
      setToggledScenarioIds(["legal_docs_complete", "facade_crack_injection"]);
    } else if (mode === "structural") {
      setToggledScenarioIds(["roof_waterproofing", "facade_crack_injection", "basement_drainage"]);
    } else if (mode === "all") {
      setToggledScenarioIds(REPAIR_SCENARIOS.map((s) => s.id));
    }
  };

  // ── FINANCIAL TOTALS COMPUTATION ──
  const financialMetrics = useMemo(() => {
    const selected = REPAIR_SCENARIOS.filter((s) => toggledScenarioIds.includes(s.id));
    const totalCapex = selected.reduce((acc, s) => acc + s.costSar, 0);
    const totalUplift = selected.reduce((acc, s) => acc + s.valueUpliftSar, 0);
    const totalDaysSaved = selected.reduce((acc, s) => acc + s.daysSaved, 0);
    const totalReadinessBoost = selected.reduce((acc, s) => acc + s.readinessBoost, 0);

    // As-Is distressed liquidation valuation (assumed ~8.5% discount due to unverified defects & missing docs)
    const asIsLiquidationValue = Math.round(baseValuation * 0.915);
    
    // Projected Liquidation Value with selected repairs
    const projectedLiquidationValue = Math.min(
      Math.round(baseValuation * 1.025), // capped at 102.5% of fair market value
      asIsLiquidationValue + totalUplift
    );

    const netValueGain = projectedLiquidationValue - totalCapex - asIsLiquidationValue;
    const roiPercentage = totalCapex > 0 ? Math.round((netValueGain / totalCapex) * 100) : 0;
    const estimatedAuctionDays = Math.max(25, 140 - totalDaysSaved);
    const simulatedReadiness = Math.min(100, base.ready + totalReadinessBoost); // illustrative: boosts are assumptions

    return {
      selectedCount: selected.length,
      totalCapex,
      totalUplift,
      asIsLiquidationValue,
      projectedLiquidationValue,
      netValueGain,
      roiPercentage,
      estimatedAuctionDays,
      simulatedReadiness,
    };
  }, [REPAIR_SCENARIOS, toggledScenarioIds, baseValuation, base.ready]);

  // ── TIMELINE PROJECTION DATA FOR LINE GRAPH ──
  const chartData = useMemo(() => {
    const { asIsLiquidationValue, projectedLiquidationValue, totalCapex } = financialMetrics;

    const milestones = [
      {
        month: isArabic ? "الشهر 0: الوضع الراهن" : "M0: Baseline (As-Is)",
        shortName: isArabic ? "ش0" : "M0",
        asIsValue: asIsLiquidationValue,
        projectedValue: asIsLiquidationValue,
        netCapital: asIsLiquidationValue,
        cumulativeCapex: 0,
        readiness: base.ready,
        note: isArabic ? "رصد العيوب والملاحظات" : "Defect Detection & Baseline",
      },
      {
        month: isArabic ? "الشهر 1: الترسية والتجهيز" : "M1: Tender & Scoping",
        shortName: isArabic ? "ش1" : "M1",
        asIsValue: Math.round(asIsLiquidationValue * 0.995),
        projectedValue: Math.round(asIsLiquidationValue + (projectedLiquidationValue - asIsLiquidationValue) * 0.15),
        netCapital: Math.round(asIsLiquidationValue + (projectedLiquidationValue - asIsLiquidationValue) * 0.15 - totalCapex * 0.25),
        cumulativeCapex: Math.round(totalCapex * 0.25),
        readiness: Math.round(base.ready + (financialMetrics.simulatedReadiness - base.ready) * 0.2),
        note: isArabic ? "إعداد وثائق الإصلاح والمقاولين" : "Remediation Contract Award",
      },
      {
        month: isArabic ? "الشهر 2: التنفيذ الميداني" : "M2: Active Repairs",
        shortName: isArabic ? "ش2" : "M2",
        asIsValue: Math.round(asIsLiquidationValue * 0.99),
        projectedValue: Math.round(asIsLiquidationValue + (projectedLiquidationValue - asIsLiquidationValue) * 0.55),
        netCapital: Math.round(asIsLiquidationValue + (projectedLiquidationValue - asIsLiquidationValue) * 0.55 - totalCapex * 0.75),
        cumulativeCapex: Math.round(totalCapex * 0.75),
        readiness: Math.round(base.ready + (financialMetrics.simulatedReadiness - base.ready) * 0.6),
        note: isArabic ? "تنفيذ معالجة العيوب الإنشائية" : "Structural & Waterproofing Work",
      },
      {
        month: isArabic ? "الشهر 3: الفحص وإعادة القياس" : "M3: Re-Inspection (SCE)",
        shortName: isArabic ? "ش3" : "M3",
        asIsValue: Math.round(asIsLiquidationValue * 0.985),
        projectedValue: Math.round(asIsLiquidationValue + (projectedLiquidationValue - asIsLiquidationValue) * 0.9),
        netCapital: Math.round(asIsLiquidationValue + (projectedLiquidationValue - asIsLiquidationValue) * 0.9 - totalCapex),
        cumulativeCapex: totalCapex,
        readiness: Math.round(base.ready + (financialMetrics.simulatedReadiness - base.ready) * 0.92),
        note: isArabic ? "إصدار شهادات السلامة والمطابقة" : "Third-Party Compliance Sign-Off",
      },
      {
        month: isArabic ? "الشهر 4: الإدراج في المزاد" : "M4: Auction Listing",
        shortName: isArabic ? "ش4" : "M4",
        asIsValue: Math.round(asIsLiquidationValue * 0.98),
        projectedValue: projectedLiquidationValue,
        netCapital: projectedLiquidationValue - totalCapex,
        cumulativeCapex: totalCapex,
        readiness: financialMetrics.simulatedReadiness,
        note: isArabic ? "بدء المزايدة التنافسية" : "Verified Passport Live Bidding",
      },
      {
        month: isArabic ? "الشهر 6: الإغلاق والتسوية" : "M6: Sale Settlement",
        shortName: isArabic ? "ش6" : "M6",
        asIsValue: Math.round(asIsLiquidationValue * 0.975),
        projectedValue: Math.round(projectedLiquidationValue * 1.01),
        netCapital: Math.round(projectedLiquidationValue * 1.01 - totalCapex),
        cumulativeCapex: totalCapex,
        readiness: financialMetrics.simulatedReadiness,
        note: isArabic ? "الإفراغ النهائي وتحصيل القيمة" : "Final Title Transfer & Funds Disbursal",
      },
    ];

    return milestones;
  }, [financialMetrics, isArabic]);

  // Helper formatting for Saudi Riyals
  const formatSar = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    })
      .format(val)
      .replace("SAR", "ر.س");
  };

  const formatSarMillions = (val: number) => {
    const m = (val / 1000000).toFixed(2);
    return isArabic ? `${m} مليون ر.س` : `SAR ${m}M`;
  };

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case "roof":
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case "structural":
        return <Building className="w-4 h-4 text-amber-400" />;
      case "drainage":
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case "hvac":
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case "legal":
        return <FileCheck2 className="w-4 h-4 text-purple-400" />;
      default:
        return <Wrench className="w-4 h-4 text-cyan-400" />;
    }
  };

  // ── PRD PRESETS ──
  // Presets are computed from the asset's real findings with the same formula as the passport.
  const allResolvedCI = 100; // Condition Index with every finding resolved
  const PRESETS = [
    {
      key: "current",
      label: "CURRENT ASSET",
      labelArabic: "الوضع الحالي",
      score: base.ready,
      color: "#64748B",
      desc: `Computed from the asset: ${base.unresolved} unresolved finding(s), ${base.missing} missing field(s).`,
      cond: base.ci,
      cov: base.cov,
      unresolved: base.unresolved,
      missing: base.missing,
    },
    {
      key: "docs",
      label: "Complete Docs",
      labelArabic: "استكمال البيانات",
      score: calculateLiquidationReadiness(base.ci, base.cov, base.unresolved, 0),
      color: "#60A5FA",
      desc: "Provide the missing asset-profile fields (removes the missing-field penalty).",
      cond: base.ci,
      cov: base.cov,
      unresolved: base.unresolved,
      missing: 0,
    },
    {
      key: "finding",
      label: "Resolve Findings",
      labelArabic: "معالجة الملاحظات",
      score: calculateLiquidationReadiness(allResolvedCI, base.cov, 0, base.missing),
      color: "#F59E0B",
      desc: "Every recorded finding resolved and verified (Condition Index returns to 100).",
      cond: allResolvedCI,
      cov: base.cov,
      unresolved: 0,
      missing: base.missing,
    },
    {
      key: "both",
      label: "Do Both",
      labelArabic: "تنفيذ الحزمتين",
      score: calculateLiquidationReadiness(allResolvedCI, base.cov, 0, 0),
      color: "#00C5A0",
      desc: "Missing fields provided and every finding resolved.",
      cond: allResolvedCI,
      cov: base.cov,
      unresolved: 0,
      missing: 0,
    },
  ];

  const handleSelectPreset = (preset: (typeof PRESETS)[0]) => {
    setSelectedScenarioKey(preset.key);
    setSimConditionIndex(preset.cond);
    setSimCoveragePct(preset.cov);
    setSimUnresolvedDefects(preset.unresolved);
    setSimMissingFields(preset.missing);
  };

  const calculatedReadiness = calculateLiquidationReadiness(
    simConditionIndex,
    simCoveragePct,
    simUnresolvedDefects,
    simMissingFields
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <SimulatedBadge isArabic={isArabic} />
      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── SECTION 1: FINANCIAL PROJECTION & REPAIR SIMULATION ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <GlassCard className="p-6 lg:p-8" glow glowColor={isDark ? "rgba(6,182,212,0.15)" : "rgba(13,148,136,0.12)"}>
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 mb-6 ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-mono ${
              isDark ? "text-cyan-400" : "text-teal-700"
            }`}>
              <DollarSign className="w-4 h-4" />
              <span>{isArabic ? "التوقعات المالية ومحاكاة التصفية" : "FINANCIAL PROJECTION & LIQUIDATION VALUATION"}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black mt-1 tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              {isArabic
                ? "أثر خطط الإصلاح والتحسين على القيمة الاستردادية للتصفية"
                : "Projected Liquidation Value Impact by Repair Scenario"}
            </h2>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {isArabic
                ? "التكاليف والزيادة في القيمة والأيام الموفّرة هنا أرقام افتراضية ثابتة للتوضيح وليست من بيانات الأصل؛ نقطة البداية هي الجاهزية المحسوبة فعلاً للأصل."
                : "Costs, value uplift and days saved here are fixed illustrative assumptions, not asset data; the starting point is the asset's actual computed readiness."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              isDark
                ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                : "bg-teal-50 text-teal-800 border-teal-200 shadow-sm"
            }`}>
              {isArabic ? "افتراضات توضيحية · ليست تقييماً" : "ILLUSTRATIVE ASSUMPTIONS · NOT A VALUATION"}
            </span>
          </div>
        </div>

        {/* Financial KPI Summary Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {/* 1. As-Is Base Value */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isDark ? "bg-slate-950/80 border-slate-800/90" : "bg-slate-50 border-slate-200"
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic ? "قيمة الوضع الراهن" : "As-Is Distress Value"}
            </div>
            <div className={`text-lg font-black font-mono mt-1 ${isDark ? "text-slate-300" : "text-slate-800"}`}>
              {formatSarMillions(financialMetrics.asIsLiquidationValue)}
            </div>
            <div className={`text-[10px] font-mono mt-1 ${isDark ? "text-amber-400/90" : "text-amber-700 font-semibold"}`}>
              {isArabic ? "خصم مخاطر -8.5%" : "-8.5% Defect Penalty"}
            </div>
          </div>

          {/* 2. Repair CAPEX */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isDark ? "bg-slate-950/80 border-slate-800/90" : "bg-slate-50 border-slate-200"
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic ? "تكلفة الإصلاح (CAPEX)" : "Remediation CAPEX"}
            </div>
            <div className={`text-lg font-black font-mono mt-1 ${isDark ? "text-amber-400" : "text-amber-700 font-bold"}`}>
              {formatSar(financialMetrics.totalCapex)}
            </div>
            <div className={`text-[10px] font-mono mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {financialMetrics.selectedCount} {isArabic ? "إجراءات محددة" : "Actions Active"}
            </div>
          </div>

          {/* 3. Projected Liquidation Value */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between shadow-sm ${
            isDark
              ? "bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              : "bg-teal-50/70 border-teal-300 shadow-sm"
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? "text-cyan-400" : "text-teal-800"
            }`}>
              {isArabic ? "قيمة التصفية المستهدفة" : "Projected Liquidation"}
            </div>
            <div className={`text-lg font-black font-mono mt-1 ${isDark ? "text-cyan-300" : "text-teal-900 font-bold"}`}>
              {formatSarMillions(financialMetrics.projectedLiquidationValue)}
            </div>
            <div className={`text-[10px] font-mono font-bold mt-1 ${isDark ? "text-cyan-400" : "text-teal-700"}`}>
              +{formatSar(financialMetrics.totalUplift)} {isArabic ? "استرداد" : "Uplift"}
            </div>
          </div>

          {/* 4. Net Value Added (NPV) */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between shadow-sm ${
            isDark
              ? "bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "bg-emerald-50/70 border-emerald-300 shadow-sm"
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? "text-emerald-400" : "text-emerald-800"
            }`}>
              {isArabic ? "صافي الربح المضاف" : "Net Capital Realized"}
            </div>
            <div className={`text-lg font-black font-mono mt-1 ${isDark ? "text-emerald-400" : "text-emerald-800 font-bold"}`}>
              +{formatSar(financialMetrics.netValueGain)}
            </div>
            <div className={`text-[10px] font-mono font-bold mt-1 ${isDark ? "text-emerald-300" : "text-emerald-700 font-bold"}`}>
              {financialMetrics.roiPercentage}% ROI
            </div>
          </div>

          {/* 5. Auction Velocity / Time to Liquidate */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isDark ? "bg-slate-950/80 border-slate-800/90" : "bg-slate-50 border-slate-200"
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic ? "سرعة إتمام الصفقة" : "Auction Velocity"}
            </div>
            <div className={`text-lg font-black font-mono mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {financialMetrics.estimatedAuctionDays} {isArabic ? "يوم" : "Days"}
            </div>
            <div className={`text-[10px] font-mono mt-1 ${isDark ? "text-emerald-400" : "text-emerald-700 font-semibold"}`}>
              {isArabic ? "تسريع 3.8x أسرع" : "3.8x Faster Exit"}
            </div>
          </div>

          {/* 6. Simulated Readiness */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isDark ? "bg-slate-950/80 border-slate-800/90" : "bg-slate-50 border-slate-200"
          }`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic ? "جاهزية التصفية المتوقعة" : "Simulated Readiness"}
            </div>
            <div className={`text-lg font-black font-mono mt-1 ${isDark ? "text-cyan-400" : "text-teal-700 font-bold"}`}>
              {financialMetrics.simulatedReadiness} / 100
            </div>
            <div className={`text-[10px] font-mono mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {financialMetrics.simulatedReadiness >= 85
                ? isArabic
                  ? "فئة أ (ممتاز)"
                  : "Tier A (High Liquidity)"
                : isArabic
                ? "فئة ب (متوسط)"
                : "Tier B (Moderate)"}
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE REPAIR SCENARIO TOGGLES ── */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {isArabic ? "سيناريوهات الإصلاح والتحسين الميداني" : "TOGGLE REPAIR & REMEDIATION SCENARIOS"}
              </h3>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400 mr-1">{isArabic ? "نماذج سريعة:" : "Presets:"}</span>
              <button
                onClick={() => handleApplyFinancialPreset("none")}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                {isArabic ? "الوضع الراهن" : "As-Is"}
              </button>
              <button
                onClick={() => handleApplyFinancialPreset("quick")}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-blue-500/30 transition-colors cursor-pointer"
              >
                {isArabic ? "إجراءات سريعة" : "Quick Wins"}
              </button>
              <button
                onClick={() => handleApplyFinancialPreset("structural")}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
              >
                {isArabic ? "إنشائي وغلاف" : "Structural"}
              </button>
              <button
                onClick={() => handleApplyFinancialPreset("all")}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer"
              >
                {isArabic ? "معالجة شاملة (الكل)" : "Select All ✦"}
              </button>
            </div>
          </div>

          {/* Toggle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {REPAIR_SCENARIOS.map((scenario) => {
              const isToggled = toggledScenarioIds.includes(scenario.id);
              return (
                <div
                  key={scenario.id}
                  onClick={() => handleToggleScenario(scenario.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    isToggled
                      ? isDark
                        ? "bg-gradient-to-br from-cyan-950/30 via-slate-900/90 to-slate-950 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                        : "bg-teal-50/80 border-teal-500/70 shadow-md ring-1 ring-teal-500/20"
                      : isDark
                      ? "bg-slate-950/60 hover:bg-slate-900/70 border-slate-800/80 opacity-75 hover:opacity-100"
                      : "bg-white hover:bg-slate-50 border-slate-200 opacity-90 hover:opacity-100 shadow-sm"
                  }`}
                >
                  <div>
                    {/* Top Row: Icon, Category & Toggle Switch */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                            isToggled
                              ? isDark
                                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                                : "bg-teal-100 border-teal-300 text-teal-800"
                              : isDark
                              ? "bg-slate-900 border-slate-800 text-slate-400"
                              : "bg-slate-100 border-slate-200 text-slate-600"
                          }`}
                        >
                          {getScenarioIcon(scenario.iconName)}
                        </div>
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {isArabic ? scenario.categoryArabic : scenario.category}
                        </span>
                      </div>

                      {/* Custom Toggle Switch */}
                      <div
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                          isToggled
                            ? isDark
                              ? "bg-cyan-500"
                              : "bg-teal-600"
                            : isDark
                            ? "bg-slate-800"
                            : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full transition-transform ${
                            isDark ? "bg-slate-950" : "bg-white shadow-sm"
                          } ${
                            isToggled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h4
                      className={`text-xs font-bold transition-colors line-clamp-1 ${
                        isToggled
                          ? isDark
                            ? "text-white group-hover:text-cyan-300"
                            : "text-slate-900 group-hover:text-teal-700 font-extrabold"
                          : isDark
                          ? "text-slate-300"
                          : "text-slate-800"
                      }`}
                    >
                      {isArabic ? scenario.titleArabic : scenario.title}
                    </h4>
                    <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {isArabic ? scenario.descArabic : scenario.desc}
                    </p>
                  </div>

                  {/* Financial & Metric Footer */}
                  <div className={`pt-3 mt-3 border-t flex items-center justify-between text-[11px] font-mono ${
                    isDark ? "border-slate-800/80" : "border-slate-200"
                  }`}>
                    <div>
                      <span className={`block text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "التكلفة" : "CAPEX"}</span>
                      <span className={`font-bold ${isDark ? "text-amber-400" : "text-amber-700"}`}>{formatSar(scenario.costSar)}</span>
                    </div>

                    <div className="text-center">
                      <span className={`block text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "الأثر" : "Readiness"}</span>
                      <span className={`font-bold ${isDark ? "text-cyan-400" : "text-teal-700"}`}>+{scenario.readinessBoost} pts</span>
                    </div>

                    <div className="text-right">
                      <span className={`block text-[9px] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isArabic ? "استرداد القيمة" : "Value Uplift"}</span>
                      <span className={`font-bold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>+{formatSar(scenario.valueUpliftSar)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LINE GRAPH: PROJECTED ASSET LIQUIDATION VALUE TRAJECTORY ── */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? "bg-slate-950/90 border-slate-800/90" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
            isDark ? "border-slate-800/80" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-teal-700"}`} />
              <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${isDark ? "text-white" : "text-slate-900"}`}>
                {isArabic ? "منحنى تطور القيمة الاستردادية وصافي رأس المال (SAR)" : "PROJECTED ASSET LIQUIDATION VALUE TRAJECTORY (SAR)"}
              </h3>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className={`flex items-center gap-1.5 ${isDark ? "text-cyan-400" : "text-teal-700 font-semibold"}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "bg-teal-600"}`} />
                <span>{isArabic ? "قيمة التصفية المستهدفة" : "Projected Liquidation Value"}</span>
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? "text-emerald-400" : "text-emerald-700 font-semibold"}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-emerald-600"}`} />
                <span>{isArabic ? "صافي القيمة بعد خصم التكاليف" : "Net Realized Capital"}</span>
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-500 font-semibold"}`}>
                <span className={`w-2.5 h-0.5 ${isDark ? "bg-slate-400" : "bg-slate-500"}`} />
                <span>{isArabic ? "الوضع الراهن (دون إصلاح)" : "As-Is Baseline"}</span>
              </span>
            </div>
          </div>

          {/* Recharts Line Chart Container */}
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 25, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1E293B" : "#E2E8F0"} vertical={false} />
                <XAxis
                  dataKey="shortName"
                  stroke={isDark ? "#64748B" : "#475569"}
                  fontSize={11}
                  fontFamily="monospace"
                  tickLine={false}
                />
                <YAxis
                  stroke={isDark ? "#64748B" : "#475569"}
                  fontSize={11}
                  fontFamily="monospace"
                  tickLine={false}
                  domain={["dataMin - 300000", "dataMax + 300000"]}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      return (
                        <div
                          dir={isArabic ? "rtl" : "ltr"}
                          className={`p-4 rounded-xl shadow-2xl backdrop-blur-xl font-mono text-xs space-y-2 min-w-[240px] border ${
                            isDark
                              ? "bg-slate-950/95 border-cyan-500/40 text-white"
                              : "bg-white border-slate-200 text-slate-900 shadow-lg"
                          }`}
                        >
                          <div className={`font-bold pb-1 border-b ${
                            isDark ? "text-cyan-300 border-slate-800" : "text-teal-800 border-slate-200"
                          }`}>
                            {dataPoint.month}
                          </div>
                          <div className={`text-[10px] italic ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {dataPoint.note}
                          </div>

                          <div className="space-y-1 pt-1">
                            <div className={`flex justify-between items-center font-bold ${
                              isDark ? "text-cyan-400" : "text-teal-800"
                            }`}>
                              <span>{isArabic ? "قيمة التصفية المستهدفة:" : "Projected Value:"}</span>
                              <span>{formatSar(dataPoint.projectedValue)}</span>
                            </div>

                            <div className={`flex justify-between items-center font-bold ${
                              isDark ? "text-emerald-400" : "text-emerald-700"
                            }`}>
                              <span>{isArabic ? "صافي رأس المال المحصل:" : "Net Realized:"}</span>
                              <span>{formatSar(dataPoint.netCapital)}</span>
                            </div>

                            <div className={`flex justify-between items-center ${
                              isDark ? "text-slate-400" : "text-slate-600"
                            }`}>
                              <span>{isArabic ? "قيمة الوضع الراهن:" : "As-Is Baseline:"}</span>
                              <span>{formatSar(dataPoint.asIsValue)}</span>
                            </div>

                            <div className={`flex justify-between items-center pt-1 border-t ${
                              isDark ? "text-amber-400 border-slate-800/80" : "text-amber-700 border-slate-200"
                            }`}>
                              <span>{isArabic ? "التكاليف المصروفة:" : "Capex Invested:"}</span>
                              <span>{formatSar(dataPoint.cumulativeCapex)}</span>
                            </div>

                            <div className={`flex justify-between items-center ${
                              isDark ? "text-slate-300" : "text-slate-700 font-semibold"
                            }`}>
                              <span>{isArabic ? "مؤشر الجاهزية:" : "Readiness Score:"}</span>
                              <span>{dataPoint.readiness} / 100</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Reference Baseline Valuation */}
                <ReferenceLine
                  y={baseValuation}
                  stroke={isDark ? "#3B82F6" : "#2563EB"}
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{
                    value: isArabic ? `التقييم العادل: ${(baseValuation / 1000000).toFixed(1)}M` : `Fair Valuation: ${(baseValuation / 1000000).toFixed(1)}M`,
                    fill: isDark ? "#60A5FA" : "#1D4ED8",
                    fontSize: 10,
                    position: "top",
                  }}
                />

                {/* 1. Projected Liquidation Value Line */}
                <Line
                  type="monotone"
                  dataKey="projectedValue"
                  stroke={isDark ? "#06B6D4" : "#0D9488"}
                  strokeWidth={3}
                  dot={{ r: 5, fill: isDark ? "#06B6D4" : "#0D9488", strokeWidth: 2, stroke: isDark ? "#082f49" : "#CCFBF1" }}
                  activeDot={{ r: 8, fill: isDark ? "#06B6D4" : "#0D9488", stroke: isDark ? "#ffffff" : "#115E59", strokeWidth: 2 }}
                  name={isArabic ? "قيمة التصفية المستهدفة" : "Projected Liquidation Value"}
                />

                {/* 2. Net Realized Capital Line */}
                <Line
                  type="monotone"
                  dataKey="netCapital"
                  stroke={isDark ? "#10B981" : "#059669"}
                  strokeWidth={2.5}
                  strokeDasharray="2 2"
                  dot={{ r: 4, fill: isDark ? "#10B981" : "#059669", strokeWidth: 2, stroke: isDark ? "#022c22" : "#D1FAE5" }}
                  activeDot={{ r: 7, fill: isDark ? "#10B981" : "#059669", stroke: isDark ? "#ffffff" : "#064E3B", strokeWidth: 2 }}
                  name={isArabic ? "صافي رأس المال" : "Net Realized Capital"}
                />

                {/* 3. As-Is Baseline Line */}
                <Line
                  type="monotone"
                  dataKey="asIsValue"
                  stroke={isDark ? "#64748B" : "#94A3B8"}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  name={isArabic ? "الوضع الراهن" : "As-Is Baseline"}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Timeline Milestones Legend */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t text-center font-mono text-[10px] ${
            isDark ? "border-slate-800/60" : "border-slate-200"
          }`}>
            {chartData.map((m, idx) => (
              <div key={idx} className={`p-2 rounded-lg border ${
                isDark ? "bg-slate-900/50 border-slate-800/50" : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`font-bold block ${isDark ? "text-cyan-400" : "text-teal-700"}`}>{m.shortName}</span>
                <span className={`block truncate ${isDark ? "text-slate-300" : "text-slate-700"}`}>{m.month.split(":")[1] || m.month}</span>
                <span className={`font-bold block mt-0.5 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                  {(m.projectedValue / 1000000).toFixed(2)}M
                </span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: READINESS & PARAMETER SIMULATION BENCH ─── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <GlassCard className="p-6 lg:p-8" glow glowColor={isDark ? "rgba(0,197,160,0.15)" : "rgba(13,148,136,0.12)"}>
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-6 ${
          isDark ? "border-white/10" : "border-slate-200"
        }`}>
          <div>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-mono ${
              isDark ? "text-[#00C5A0]" : "text-teal-700"
            }`}>
              <Zap className="w-4 h-4" />
              <span>{isArabic ? "محاكي سيناريوهات الجاهزية (FR-14)" : "READINESS SCORE WHAT-IF ENGINE"}</span>
            </div>
            <h2 className={`text-xl font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {isArabic ? "محاكاة أثر الإجراءات على مؤشر الجاهزية الرقمية" : "Compare Action Impact on Readiness Formula Before Committing"}
            </h2>
            <p className={`text-xs mt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
              {isArabic
                ? "تطبيق صيغة الجاهزية (FR-11) على المعايير المكانية مع تتبع فوري لمؤشر السلامة"
                : "Applies the exact same Readiness formula (FR-11) on modified asset parameters"}
            </p>
          </div>

          <Badge color="#00C5A0">FR-14 Simulation</Badge>
        </div>

        {/* ── 4 Scenario Preset Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PRESETS.map((preset) => {
            const isSelected = selectedScenarioKey === preset.key;
            return (
              <div
                key={preset.key}
                onClick={() => handleSelectPreset(preset)}
                className={`p-6 rounded-2xl text-center cursor-pointer transition-all duration-300 relative border-2 ${
                  isSelected
                    ? isDark
                      ? "scale-105 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
                      : "scale-105 shadow-lg ring-2 ring-teal-500/20"
                    : isDark
                    ? "hover:scale-102 bg-black/20 hover:bg-black/30 border-white/10"
                    : "hover:scale-102 bg-slate-50/80 hover:bg-slate-100 border-slate-200"
                }`}
                style={{
                  borderColor: isSelected ? preset.color : isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                  backgroundColor: isSelected ? `${preset.color}15` : isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                  boxShadow: isSelected ? (isDark ? `0 0 30px ${preset.color}25` : `0 10px 25px -5px ${preset.color}30`) : "none",
                }}
              >
                {isSelected && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider font-mono text-[#070E1C]"
                    style={{ backgroundColor: preset.color }}
                  >
                    Active Scenario
                  </div>
                )}

                <div
                  className="text-5xl font-black font-mono tracking-tight my-2"
                  style={{
                    color: preset.color,
                    filter: isSelected && isDark
                      ? `drop-shadow(0 0 16px ${preset.color}75)`
                      : "none",
                  }}
                >
                  {preset.score}
                </div>

                <div
                  className="text-xs font-bold uppercase tracking-wider mt-2"
                  style={{ color: isSelected ? preset.color : isDark ? "#94A3B8" : "#475569" }}
                >
                  {isArabic ? preset.labelArabic : preset.label}
                </div>

                <p className={`text-[11px] mt-2 line-clamp-2 leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                  {preset.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Progressive Step Arrow Flow ── */}
        <div className={`p-4 rounded-xl border mb-8 ${isDark ? "bg-black/30 border-white/5" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {PRESETS.map((p, idx) => (
              <React.Fragment key={p.key}>
                <div
                  onClick={() => handleSelectPreset(p)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer transition-transform hover:scale-105 border"
                  style={{
                    backgroundColor: `${p.color}15`,
                    borderColor: `${p.color}40`,
                  }}
                >
                  <span
                    className="text-lg font-black font-mono"
                    style={{ color: p.color }}
                  >
                    {p.score}
                  </span>
                  <span className={`text-[10px] font-bold uppercase hidden sm:inline ${isDark ? "text-white" : "text-slate-900"}`}>
                    {p.label}
                  </span>
                </div>

                {idx < PRESETS.length - 1 && (
                  <ArrowRight className={`w-4 h-4 shrink-0 ${isDark ? "text-[#00C5A0]" : "text-teal-700"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className={`text-center text-xs font-semibold mt-3 flex items-center justify-center gap-1.5 font-mono ${
            isDark ? "text-[#00E8BE]" : "text-teal-700"
          }`}>
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              {isArabic
                ? "زيادة تدريجية في الجاهزية مع كل إجراء مُنجز (+23 نقطة كحد أقصى)"
                : "Progressive readiness improvement with each corrective action (+23 max gain)"}
            </span>
          </div>
        </div>

        {/* ── Interactive Custom Slider Controls ── */}
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? "bg-[#09152B] border-[#00C5A0]/25" : "bg-slate-50/80 border-slate-200 shadow-sm"
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono ${
              isDark ? "text-[#60A5FA]" : "text-blue-700"
            }`}>
              <Sliders className="w-4 h-4" />
              <span>{isArabic ? "لوحة التحكم الحية في المتغيرات" : "LIVE PARAMETER SIMULATION BENCH"}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>Simulated Readiness:</span>
              <span className={`text-2xl font-black font-mono ${
                isDark
                  ? "text-[#00E8BE] drop-shadow-[0_0_10px_rgba(0,197,160,0.5)]"
                  : "text-teal-700 font-extrabold"
              }`}>
                {calculatedReadiness} / 100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slider 1: Condition Index */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${isDark ? "text-[#94A3B8]" : "text-slate-700"}`}>
                  {isArabic ? "مؤشر الحالة (Condition Index)" : "Condition Index (FR-08)"}
                </span>
                <span className={`font-bold font-mono ${isDark ? "text-[#60A5FA]" : "text-blue-700"}`}>
                  {simConditionIndex}/100
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={simConditionIndex}
                onChange={(e) => setSimConditionIndex(Number(e.target.value))}
                className="w-full accent-[#60A5FA] cursor-pointer"
              />
              <div className={`flex justify-between text-[10px] font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                <span>30 (Poor)</span>
                <span>100 (Pristine)</span>
              </div>
            </div>

            {/* Slider 2: Spatial Coverage % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${isDark ? "text-[#94A3B8]" : "text-slate-700"}`}>
                  {isArabic ? "نسبة التغطية المكانية" : "Spatial Coverage % (FR-07)"}
                </span>
                <span className={`font-bold font-mono ${isDark ? "text-[#A855F7]" : "text-purple-700"}`}>
                  {simCoveragePct}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={simCoveragePct}
                onChange={(e) => setSimCoveragePct(Number(e.target.value))}
                className="w-full accent-[#A855F7] cursor-pointer"
              />
              <div className={`flex justify-between text-[10px] font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                <span>30% (Partial)</span>
                <span>100% (Complete)</span>
              </div>
            </div>

            {/* Slider 3: Unresolved Findings */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${isDark ? "text-[#94A3B8]" : "text-slate-700"}`}>
                  {isArabic ? "العيوب غير المعالجة (-5 لكل عيب)" : "Unresolved Defects (-5 pts each)"}
                </span>
                <span className={`font-bold font-mono ${isDark ? "text-[#F59E0B]" : "text-amber-700"}`}>
                  {simUnresolvedDefects} Active
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={simUnresolvedDefects}
                onChange={(e) => setSimUnresolvedDefects(Number(e.target.value))}
                className="w-full accent-[#F59E0B] cursor-pointer"
              />
              <div className={`flex justify-between text-[10px] font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                <span>0 (All Resolved)</span>
                <span>6 (High Backlog)</span>
              </div>
            </div>

            {/* Slider 4: Missing Asset Fields */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${isDark ? "text-[#94A3B8]" : "text-slate-700"}`}>
                  {isArabic ? "حقول البيانات الناقصة (-3 لكل حقل)" : "Missing Profile Fields (-3 pts each)"}
                </span>
                <span className={`font-bold font-mono ${isDark ? "text-[#EF4444]" : "text-red-700"}`}>
                  {simMissingFields} Missing
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={simMissingFields}
                onChange={(e) => setSimMissingFields(Number(e.target.value))}
                className="w-full accent-[#EF4444] cursor-pointer"
              />
              <div className={`flex justify-between text-[10px] font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                <span>0 (all resolved)</span>
                <span>5 (Missing Docs)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FR-11 Formula Breakdown ── */}
        <div className={`mt-6 p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
          isDark
            ? "bg-black/40 border-[#00C5A0]/20"
            : "bg-teal-50/50 border-teal-200"
        }`}>
          <div className={isDark ? "text-[#64748B]" : "text-slate-500"}>// Mathematical Liquidation Readiness Formula (FR-11)</div>
          <div className={`font-bold leading-relaxed ${isDark ? "text-[#00E8BE]" : "text-teal-800"}`}>
            Readiness = 100 − (100 − Condition_Index)×0.40 − (100 − Coverage%)×0.35 − (Unresolved×5) − (MissingFields×3)
          </div>
          <div className={`text-[11px] pt-1 ${isDark ? "text-[#94A3B8]" : "text-slate-700"}`}>
            = 100 − (100 − {simConditionIndex})×0.40 − (100 − {simCoveragePct})×0.35 − ({simUnresolvedDefects}×5) − ({simMissingFields}×3)
            = <strong className={isDark ? "text-white" : "text-slate-900"}>{calculatedReadiness}</strong>
          </div>
        </div>

        {/* ── Mandatory Regulatory Notice ── */}
        <div className={`mt-6 p-3.5 rounded-xl border flex items-center gap-3 ${
          isDark
            ? "bg-[#F59E0B]/10 border-[#F59E0B]/30"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}>
          <AlertTriangle className={`w-5 h-5 shrink-0 ${isDark ? "text-[#F59E0B]" : "text-amber-600"}`} />
          <div className="text-xs">
            <span className={`font-bold ${isDark ? "text-[#F59E0B]" : "text-amber-800"}`}>
              {isArabic ? "⚠ تنويه إلزامي: " : "⚠ Mandatory Notice: "}
            </span>
            <span className={isDark ? "text-[#94A3B8]" : "text-slate-700"}>
              {isArabic
                ? "محاكاة سيناريوهات تجريبية لأغراض التخطيط والتقييم — وليست نتيجة بيع مؤكدة أو تعهداً تجارياً."
                : "Prototype Scenario Simulation — Not a Guaranteed Financial or Commercial Outcome."}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
