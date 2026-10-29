import React, { useState, useMemo } from "react";
import {
  X,
  Database,
  Search,
  Download,
  ExternalLink,
  Building2,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  Filter,
  BarChart3,
  Gavel,
  FileCheck2,
  Lock,
  Unlock,
  MapPin,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  SAUDI_REAL_ESTATE_METADATA,
  SAUDI_REGIONAL_SUMMARY,
  SAUDI_TOP_CITIES,
  SAUDI_TOP_OPERATIONS,
  SAUDI_DAILY_TIMELINE,
  SAUDI_SECTOR_DISTRIBUTION,
  SAUDI_JULY_2026_RECORDS,
  RealEstateRecord,
} from "../../data/saudiRealEstateJuly2026";
import { AssetRecord } from "../../types";

interface SaudiOpenDataJuly2026ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic?: boolean;
  currentAsset?: AssetRecord;
}

const REGION_COLORS = [
  "#06b6d4",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

export const SaudiOpenDataJuly2026Modal: React.FC<SaudiOpenDataJuly2026ModalProps> = ({
  isOpen,
  onClose,
  isArabic = true,
  currentAsset,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "daily" | "regional" | "table">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  // Filter raw records
  const filteredRecords = useMemo(() => {
    return SAUDI_JULY_2026_RECORDS.filter((rec) => {
      const matchesSearch =
        !searchQuery ||
        rec.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.operationType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === "ALL" || rec.region === selectedRegion;
      const matchesSector = selectedSector === "ALL" || rec.sector === selectedSector;

      return matchesSearch && matchesRegion && matchesSector;
    });
  }, [searchQuery, selectedRegion, selectedSector]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  // Asset region match
  const assetRegionStats = useMemo(() => {
    if (!currentAsset) return null;
    const assetCity = currentAsset.city || "الرياض";
    return {
      city: assetCity,
      records: SAUDI_JULY_2026_RECORDS.filter((r) => r.city.includes(assetCity)),
      totalOpsInCity: SAUDI_JULY_2026_RECORDS.filter((r) => r.city.includes(assetCity)).reduce((sum, r) => sum + r.count, 0),
    };
  }, [currentAsset]);

  // Export filtered to CSV
  const handleExportCSV = () => {
    const headers = ["المنطقة", "المدينة", "نوع القطاع", "نوع الخدمة", "نوع العملية", "التاريخ ميلادي", "التاريخ هجري", "عدد العمليات"];
    const rows = filteredRecords.map((r) => [
      `"${r.region}"`,
      `"${r.city}"`,
      `"${r.sector}"`,
      `"${r.service}"`,
      `"${r.operationType}"`,
      `"${r.dateGregorian}"`,
      `"${r.dateHijri}"`,
      r.count,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Saudi_Real_Estate_July_2026_Filtered.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {isArabic ? "العمليات العقارية المسجلة - يوليو 2026" : "Saudi Registered Real Estate Operations - July 2026"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                  {isArabic ? "ملف بيانات مفتوحة مرفق · المصدر يحتاج تأكيد" : "Bundled open-data file · source to be confirmed"}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{isArabic ? "المصدر: منصة البيانات المفتوحة السعودية · وزارة العدل" : "Source: Saudi Open Data Portal · Ministry of Justice (MOJ)"}</span>
                <span className="font-mono text-slate-500 text-[11px]">(ID: c4eb90eb-de47-4996-9eba-8ae503980bcf)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://open.data.gov.sa/ar/datasets/view/c4eb90eb-de47-4996-9eba-8ae503980bcf/resources"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
            >
              <span>{isArabic ? "رابط المنصة الوطنية" : "Portal Source"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-800/80 bg-slate-900/40 text-xs shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isArabic ? "المؤشرات الشاملة وقيد التصفية" : "Macro Overview & Liquidation"}
            </button>
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "daily"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isArabic ? "حركة الأيام والسيولة" : "Daily Activity & Velocity"}
            </button>
            <button
              onClick={() => setActiveTab("regional")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "regional"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isArabic ? "المناطق والمدن" : "Regions & Cities"}
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "table"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isArabic ? `مستكشف السجلات الخام (${filteredRecords.length})` : `Raw Data Explorer (${filteredRecords.length})`}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isArabic ? "الفترة: يوليو 2026 (محرم 1448 هـ)" : "Period: July 2026 (1448 AH)"}</span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top KPI Cards (Always visible) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-mono">{isArabic ? "إجمالي العمليات" : "Total Operations"}</span>
              <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">
                {SAUDI_REAL_ESTATE_METADATA.totalOperations.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">{isArabic ? "345 سجلاً تصنيفياً" : "345 category rows"}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 block font-mono">{isArabic ? "الإفراغ العقاري" : "Conveyance (Sales)"}</span>
              <span className="text-xl font-bold font-mono text-emerald-300 mt-1 block">
                {SAUDI_REAL_ESTATE_METADATA.totalConveyance.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-500/80 mt-0.5 block">{isArabic ? "نقل ملكية تام" : "Deed Transfer"}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20">
              <span className="text-[11px] text-amber-400 block font-mono">{isArabic ? "الحجز التحفظي" : "Precautionary Seizure"}</span>
              <span className="text-xl font-bold font-mono text-amber-300 mt-1 block">
                {SAUDI_REAL_ESTATE_METADATA.totalPrecautionarySeizures.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-500/80 mt-0.5 block">{isArabic ? "أوامر قضائية وتنفيذ" : "Judicial Orders"}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-blue-500/20">
              <span className="text-[11px] text-blue-400 block font-mono">{isArabic ? "فك الحجز التحفظي" : "Seizure Releases"}</span>
              <span className="text-xl font-bold font-mono text-blue-300 mt-1 block">
                {SAUDI_REAL_ESTATE_METADATA.totalSeizureReleases.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-500/80 mt-0.5 block">{isArabic ? "تسوية أو تصفية بيع" : "Settled / Auctioned"}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/20">
              <span className="text-[11px] text-purple-400 block font-mono">{isArabic ? "المسجل عينياً (RER)" : "In-Kind Registry"}</span>
              <span className="text-xl font-bold font-mono text-purple-300 mt-1 block">
                {SAUDI_REAL_ESTATE_METADATA.totalInKindRegistry.toLocaleString()}
              </span>
              <span className="text-[10px] text-purple-500/80 mt-0.5 block">{isArabic ? "السجل العقاري الوطني" : "Real Estate Registry"}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/20">
              <span className="text-[11px] text-indigo-400 block font-mono">{isArabic ? "الرهن وفك الرهن" : "Mortgage & Release"}</span>
              <span className="text-xl font-bold font-mono text-indigo-300 mt-1 block">
                {(SAUDI_REAL_ESTATE_METADATA.totalMortgages + SAUDI_REAL_ESTATE_METADATA.totalMortgageReleases).toLocaleString()}
              </span>
              <span className="text-[10px] text-indigo-500/80 mt-0.5 block">{isArabic ? "تمويلات وضمانات" : "Banking Collateral"}</span>
            </div>
          </div>

          {/* TAB 1: MACRO OVERVIEW & ENFAD LIQUIDATION RELEVANCE */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Relevance box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{isArabic ? "قراءة الأرقام" : "Reading the numbers"}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
                        {isArabic ? "تكامل قضائي - سوقي" : "Judicial-Market Synergy"}
                      </span>
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {isArabic
                        ? `يحتوي الملف المرفق على 35,973 عملية حجز تحفظي وفك حجز من أصل 65,702 عملية مسجلة في الشهر (54.7% من عمليات الملف). هذه ليست عمليات تصفية أو بيع، لكنها تبيّن حجم الأصول التي تمر بإجراءات تنفيذ قد ينتهي بعضها بالبيع، حيث يمكن لجواز الأصل أن يساعد. المصدر يحتاج تأكيد.`
                        : `The bundled file lists 35,973 precautionary attachments and releases out of 65,702 operations recorded for the month (54.7% of the file). These are not liquidations or sales, but they indicate how many assets pass through enforcement steps, some of which may end in a sale where an asset passport could help. Source to be confirmed.`}
                    </p>

                    {/* Quick Asset Match if present */}
                    {assetRegionStats && (
                      <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          <span>
                            {isArabic
                              ? `الأصل المعروض حالياً (${currentAsset?.name}) يقع في نطاق: `
                              : `Current Selected Asset (${currentAsset?.name}) is located in: `}
                            <strong className="text-white">{assetRegionStats.city}</strong>
                          </span>
                        </div>
                        <div className="text-cyan-300 font-mono">
                          {isArabic
                            ? `حجم العمليات المسجلة بالمدينة: ${assetRegionStats.totalOpsInCity.toLocaleString()} عملية`
                            : `City Registered Ops: ${assetRegionStats.totalOpsInCity.toLocaleString()} ops`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid of Top Operations & Sector Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Operations Ranking */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                    <span>{isArabic ? "أعلى العمليات العقارية تسجيلاً بالمملكة" : "Top Operations by Volume"}</span>
                    <span className="text-xs font-normal text-slate-400 font-mono">يوليو 2026</span>
                  </h4>
                  <div className="space-y-3">
                    {SAUDI_TOP_OPERATIONS.slice(0, 7).map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium truncate max-w-[280px]">
                            {item.operation.replace("عقارات/", "")}
                          </span>
                          <span className="font-mono text-cyan-300 font-bold">
                            {item.count.toLocaleString()} <span className="text-slate-500 text-[10px]">({item.percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, item.percentage * 3.2)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sector & Channel Insights */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">
                      {isArabic ? "توزيع القطاعات وقنوات التنفيذ الرقمي" : "Sector & Digital Channel Distribution"}
                    </h4>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      {isArabic
                        ? "تُظهر البيانات تحولاً جذرياً نحو التوثيق الرقمي وكتابات العدل الافتراضية، مع سيطرة العمليات الحكومية والقضائية الرقمية على 70.8% من إجمالي الإجراءات."
                        : "High concentration of digital transactions with public sector electronic judicial channels commanding 70.8% of aggregate volume."}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {SAUDI_SECTOR_DISTRIBUTION.map((sec, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                          <span className="text-[11px] text-slate-400 block font-mono">{sec.sector}</span>
                          <span className="text-lg font-bold font-mono text-white mt-1 block">
                            {sec.count.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-cyan-400 mt-0.5 block">{sec.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span>{isArabic ? "التسجيل العيني (RER)" : "In-Kind Registry (RER):"}</span>
                      <strong className="text-purple-300">16,696 عملية</strong>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span>{isArabic ? "تسجيل الصكوك القديمة وتحديثها" : "Legacy Deed Digitization:"}</span>
                      <strong className="text-emerald-300">1,875 صكاً</strong>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span>{isArabic ? "فرز ودمج الصكوك والعقارات" : "Subdivision & Merging:"}</span>
                      <strong className="text-amber-300">415 عملية</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAILY TIMELINE & VELOCITY */}
          {activeTab === "daily" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isArabic ? "المسار الزمني اليومي للعمليات العقارية (يوليو 2026)" : "Daily Operations Trajectory (July 2026)"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isArabic
                        ? "مقارنة حجم الإفراغات، الحجوزات التحفظية، فك الحجز، والتسجيل العيني عبر الأيام"
                        : "Daily breakdown comparing Conveyance, Seizures, Releases, and In-Kind Registration"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30">
                    <TrendingUp className="w-4 h-4" />
                    <span>{isArabic ? "معدل يومي: 13,140 عملية" : "Daily Avg: 13,140 ops"}</span>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SAUDI_DAILY_TIMELINE} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey={isArabic ? "dayLabel" : "dayLabelEn"}
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#090d16",
                          borderColor: "#334155",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                        formatter={(val: number) => [`${val.toLocaleString()} عملية`, ""]}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                        formatter={(value) => {
                          if (value === "conveyance") return isArabic ? "الإفراغ" : "Conveyance";
                          if (value === "seizures") return isArabic ? "الحجز التحفظي" : "Seizures";
                          if (value === "releases") return isArabic ? "فك الحجز" : "Releases";
                          if (value === "registry") return isArabic ? "المسجل عينياً" : "In-Kind Registry";
                          return value;
                        }}
                      />
                      <Bar dataKey="conveyance" fill="#10b981" radius={[4, 4, 0, 0]} name="conveyance" />
                      <Bar dataKey="seizures" fill="#f59e0b" radius={[4, 4, 0, 0]} name="seizures" />
                      <Bar dataKey="releases" fill="#3b82f6" radius={[4, 4, 0, 0]} name="releases" />
                      <Bar dataKey="registry" fill="#a855f7" radius={[4, 4, 0, 0]} name="registry" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Day by Day Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {SAUDI_DAILY_TIMELINE.map((d, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <span className="text-xs font-bold text-slate-300 font-mono block">
                      {isArabic ? d.dayLabel : d.dayLabelEn}
                    </span>
                    <span className="text-lg font-bold font-mono text-cyan-300 mt-1 block">
                      {d.total.toLocaleString()}
                    </span>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1 text-right">
                      <div className="flex justify-between">
                        <span>{isArabic ? "إفراغ:" : "Conveyance:"}</span>
                        <span className="font-mono text-emerald-400 font-semibold">{d.conveyance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? "حجز:" : "Seizure:"}</span>
                        <span className="font-mono text-amber-400 font-semibold">{d.seizures.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isArabic ? "فك حجز:" : "Release:"}</span>
                        <span className="font-mono text-blue-400 font-semibold">{d.releases.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REGIONAL & CITY ANALYSIS */}
          {activeTab === "regional" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Regional Chart */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-4">
                    {isArabic ? "توزيع العمليات حسب مناطق المملكة" : "Operations Volume by Region"}
                  </h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={SAUDI_REGIONAL_SUMMARY.slice(0, 8)}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                        <YAxis dataKey="region" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#090d16",
                            borderColor: "#334155",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                          formatter={(val: number) => [`${val.toLocaleString()} عملية`, "إجمالي العمليات"]}
                        />
                        <Bar dataKey="totalOperations" fill="#06b6d4" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Active Cities */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-3">
                    {isArabic ? "أعلى المدن نشاطاً" : "Top Active Cities"}
                  </h3>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {SAUDI_TOP_CITIES.slice(0, 10).map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-800 font-mono text-[10px] text-slate-400 flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-slate-200 font-medium">{c.city}</span>
                        </div>
                        <span className="font-mono text-cyan-300 font-semibold">
                          {c.count.toLocaleString()} <span className="text-[10px] text-slate-500">({c.percentage}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regional Summary Table */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 overflow-x-auto">
                <h4 className="text-sm font-bold text-white mb-3">
                  {isArabic ? "تفصيل المؤشرات لكافة المناطق المسجلة" : "Regional Metrics Comprehensive Summary"}
                </h4>
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-2.5 px-3">{isArabic ? "المنطقة" : "Region"}</th>
                      <th className="py-2.5 px-3">{isArabic ? "إجمالي العمليات" : "Total Ops"}</th>
                      <th className="py-2.5 px-3">{isArabic ? "الحصة السوقية" : "Market Share"}</th>
                      <th className="py-2.5 px-3">{isArabic ? "الإفراغات" : "Conveyance"}</th>
                      <th className="py-2.5 px-3">{isArabic ? "الحجز التحفظي" : "Seizures"}</th>
                      <th className="py-2.5 px-3">{isArabic ? "السجل العيني" : "Registry"}</th>
                      <th className="py-2.5 px-3">{isArabic ? "الرهونات" : "Mortgages"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {SAUDI_REGIONAL_SUMMARY.map((reg, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/80 transition-colors">
                        <td className="py-2 px-3 font-sans font-medium text-slate-200">{reg.region}</td>
                        <td className="py-2 px-3 text-cyan-300 font-bold">{reg.totalOperations.toLocaleString()}</td>
                        <td className="py-2 px-3 text-slate-400">{reg.percentage}%</td>
                        <td className="py-2 px-3 text-emerald-400">{reg.conveyance.toLocaleString()}</td>
                        <td className="py-2 px-3 text-amber-400">{reg.seizures.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400">{reg.inKindRegistry.toLocaleString()}</td>
                        <td className="py-2 px-3 text-indigo-400">{reg.mortgages.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RAW DATA EXPLORER & SEARCH */}
          {activeTab === "table" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Search & Filter Controls */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={isArabic ? "بحث بالمدينة، المنطقة، أو نوع العملية..." : "Search by city, region, operation..."}
                    className="w-full pr-9 pl-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-300 px-3 py-2 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">{isArabic ? "جميع المناطق" : "All Regions"}</option>
                    {SAUDI_REGIONAL_SUMMARY.map((r, i) => (
                      <option key={i} value={r.region}>
                        {r.region}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSector}
                    onChange={(e) => {
                      setSelectedSector(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-300 px-3 py-2 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">{isArabic ? "جميع القطاعات" : "All Sectors"}</option>
                    <option value="القطاع العام">القطاع العام</option>
                    <option value="القطاع الخاص">القطاع الخاص</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isArabic ? "تصدير CSV" : "Export CSV"}</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3.5">{isArabic ? "المنطقة" : "Region"}</th>
                      <th className="py-3 px-3.5">{isArabic ? "المدينة" : "City"}</th>
                      <th className="py-3 px-3.5">{isArabic ? "نوع العملية" : "Operation"}</th>
                      <th className="py-3 px-3.5">{isArabic ? "القطاع" : "Sector"}</th>
                      <th className="py-3 px-3.5">{isArabic ? "قناة الخدمة" : "Service Channel"}</th>
                      <th className="py-3 px-3.5">{isArabic ? "التاريخ" : "Date"}</th>
                      <th className="py-3 px-3.5">{isArabic ? "عدد العمليات" : "Count"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {paginatedRecords.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors font-mono">
                        <td className="py-2.5 px-3.5 font-sans text-slate-300">{r.region}</td>
                        <td className="py-2.5 px-3.5 font-sans font-medium text-white">{r.city}</td>
                        <td className="py-2.5 px-3.5 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium inline-block ${
                              r.operationType.includes("افراغ")
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                : r.operationType.includes("الحجز التحفظي")
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                : r.operationType.includes("فك")
                                ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                                : r.operationType.includes("مسجل عينيا")
                                ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {r.operationType.replace("عقارات/", "")}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-400 font-sans text-[11px]">{r.sector}</td>
                        <td className="py-2.5 px-3.5 text-slate-400 font-sans text-[11px]">{r.service}</td>
                        <td className="py-2.5 px-3.5 text-slate-400 text-[11px]">
                          {r.dateGregorian} <span className="text-[10px] text-slate-500">({r.dateHijri})</span>
                        </td>
                        <td className="py-2.5 px-3.5 text-cyan-300 font-bold">{r.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-400">
                  <span>
                    {isArabic
                      ? `عرض ${(currentPage - 1) * pageSize + 1} إلى ${Math.min(
                          currentPage * pageSize,
                          filteredRecords.length
                        )} من إجمالي ${filteredRecords.length} سجلاً`
                      : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                          currentPage * pageSize,
                          filteredRecords.length
                        )} of ${filteredRecords.length} records`}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200"
                    >
                      {isArabic ? "السابق" : "Prev"}
                    </button>
                    <span className="px-2 font-bold text-white">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200"
                    >
                      {isArabic ? "التالي" : "Next"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {isArabic
                ? "الأرقام هنا مطابقة لملف CSV المرفق بالمشروع (345 سجلاً، 65,702 عملية). لم يتم التحقق من الملف مقابل البوابة نفسها."
                : "Figures match the CSV file bundled with the project (345 rows, 65,702 operations). The file has not been checked against the portal itself."}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            {isArabic ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
