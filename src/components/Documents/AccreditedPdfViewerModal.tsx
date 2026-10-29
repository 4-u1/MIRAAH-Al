import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileCheck2,
  ShieldCheck,
  QrCode,
  Calendar,
  Building,
  MapPin,
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  RotateCw,
  Eye,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Award,
  Scale,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { AssetRecord } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import { AccreditationSeal } from "../common/AccreditationSeal";
import { MiraahLogo } from "../common/MiraahLogo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export type DocumentType = "title_deed" | "sbc_audit" | "taqeem_valuation" | "liquidation_clearance";

interface AccreditedPdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetRecord;
  scores: ScoreResults;
  initialDocType?: DocumentType;
  isArabic?: boolean;
}

export const AccreditedPdfViewerModal: React.FC<AccreditedPdfViewerModalProps> = ({
  isOpen,
  onClose,
  asset,
  scores,
  initialDocType = "title_deed",
  isArabic = false,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentType>(initialDocType);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [colorMode, setColorMode] = useState<"obsidian" | "formal_white">("formal_white");
  const [rotation, setRotation] = useState<number>(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const documentPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialDocType) {
        setSelectedDoc(initialDocType);
      }
      setCurrentPage(1);
    }
  }, [isOpen, initialDocType]);

  if (!isOpen) return null;

  const totalPages = selectedDoc === "title_deed" ? 3 : selectedDoc === "sbc_audit" ? 4 : 2;

  // Specimen documents carry no fingerprint: they are illustrations, not exported data.
  const sha256VerificationHash = "—";

  const electronicDeedNumber = `SPECIMEN-${asset.id}`;
  const municipalLicNumber = "SPECIMEN (no licence)";
  const taqeemLicNumber = "SPECIMEN (no licence)";
  const issueDateHijri = "15 شعبان 1447 هـ";
  const issueDateGregorian = "2026-03-04";

  // Documents catalog
  const documentsList = [
    {
      id: "title_deed" as DocumentType,
      title: "نموذج توضيحي لصك ملكية (ليس صكاً حقيقياً)",
      titleEn: "Specimen title deed (not a real deed)",
      badge: "نموذج · لم يصدر عن وزارة العدل",
      badgeEn: "Specimen · not issued by MoJ",
      code: "SPECIMEN-DEED",
      icon: FileCheck2,
      pages: 3,
      color: "#D4AF37",
    },
    {
      id: "sbc_audit" as DocumentType,
      title: "نموذج توضيحي لتقرير فحص هندسي",
      titleEn: "Specimen engineering inspection report",
      badge: "نموذج · ليست شهادة مطابقة",
      badgeEn: "Specimen · not a compliance certificate",
      code: "SPECIMEN-SBC",
      icon: ShieldCheck,
      pages: 4,
      color: "#00E5B9",
    },
    {
      id: "taqeem_valuation" as DocumentType,
      title: "نموذج توضيحي لتقرير تقييم",
      titleEn: "Specimen valuation report",
      badge: "نموذج · لم يصدر عن تقييم",
      badgeEn: "Specimen · not issued by Taqeem",
      code: "SPECIMEN-VAL",
      icon: Scale,
      pages: 2,
      color: "#60A5FA",
    },
    {
      id: "liquidation_clearance" as DocumentType,
      title: "نموذج مقترح لملف جاهزية المزاد",
      titleEn: "Proposed auction-readiness summary (specimen)",
      badge: "نموذج · لم يصدر عن إنفاذ",
      badgeEn: "Specimen · not issued by Infath",
      code: "SPECIMEN-AUCTION",
      icon: Award,
      pages: 2,
      color: "#A855F7",
    },
  ];

  // PDF Generation Function
  const handleDownloadPdf = async () => {
    if (!documentPageRef.current) return;
    try {
      setIsGeneratingPdf(true);

      const targetEl = documentPageRef.current;
      const canvas = await html2canvas(targetEl, {
        scale: 2, // High-DPI capture
        useCORS: true,
        allowTaint: true,
        backgroundColor: colorMode === "formal_white" ? "#FFFFFF" : "#0A0E17",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`MIRAAH_${selectedDoc.toUpperCase()}_${asset.id}_SPECIMEN.pdf`);
    } catch (err) {
      console.error("PDF generation failed, triggering browser print fallback:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256VerificationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isFormal = colorMode === "formal_white";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-between overflow-hidden animate-in fade-in duration-200"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ══ 1. TOP COMMAND BAR & PDF CONTROLS ══ */}
      <header className="w-full bg-[#070A11] border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 text-white z-20">
        {/* Left: Brand & Active Document Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5B9] shadow-[0_0_8px_#00E5B9]" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
              MIRAAH DOC READER
            </span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 shrink-0">
              PDF · SECURE
            </span>
            <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
              {isArabic
                ? documentsList.find((d) => d.id === selectedDoc)?.title
                : documentsList.find((d) => d.id === selectedDoc)?.titleEn}
            </span>
          </div>
        </div>

        {/* Center: Page Controls & Zoom */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2 py-1 text-xs font-mono">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 transition-colors text-slate-300 hover:text-white cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 text-slate-300 select-none">
            {isArabic ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 transition-colors text-slate-300 hover:text-white cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1" />

          {/* Zoom controls */}
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 15))}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-cyan-300 min-w-[36px] text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 15))}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1" />

          {/* Paper Theme Toggle: Formal White vs Cyber Obsidian */}
          <button
            onClick={() => setColorMode((m) => (m === "formal_white" ? "obsidian" : "formal_white"))}
            className="px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 bg-slate-800 text-slate-300 hover:text-white"
            title="Toggle Paper Style"
          >
            <span>{colorMode === "formal_white" ? "📜 رسمي" : "🌑 داكن"}</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Digital Signature Verification Trigger */}
          <button
            onClick={() => setShowVerifyModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">{isArabic ? "نموذج توضيحي" : "SPECIMEN"}</span>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print Document"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{isArabic ? "طباعة" : "Print"}</span>
          </button>

          {/* Download Real PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>
              {isGeneratingPdf
                ? isArabic
                  ? "جارٍ استخراج PDF..."
                  : "Exporting PDF..."
                : isArabic
                ? "تحميل النموذج (PDF)"
                : "Download specimen (PDF)"}
            </span>
          </button>

          {/* Close modal */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Close Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ══ 2. SECONDARY DOCUMENT SELECTION STRIP ══ */}
      <div className="w-full bg-[#05070D] border-b border-slate-800/80 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto select-none shrink-0 z-10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {isArabic ? "نماذج مستندات توضيحية (ليست حقيقية):" : "Specimen documents (not real):"}
          </span>
          {documentsList.map((doc) => {
            const Icon = doc.icon;
            const isSelected = selectedDoc === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? doc.color : "#94A3B8" }} />
                <span>{isArabic ? doc.title : doc.titleEn}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {doc.pages}P
                </span>
              </button>
            );
          })}
        </div>

        {/* Security watermark notification */}
        <div className="hidden xl:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>SPECIMEN · NOT AN OFFICIAL DOCUMENT · نموذج توضيحي</span>
        </div>
      </div>

      {/* ══ 3. MAIN PDF VIEWPORT (SCROLLABLE & ZOOMABLE CANVAS) ══ */}
      <main className="flex-1 w-full overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-[#03060C] relative">
        {/* Subtle Background Blueprint Grid */}
        <div className="absolute inset-0 bg-grid-command opacity-20 pointer-events-none" />

        {/* Container scaled by zoom */}
        <div
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease-out",
          }}
          className="my-4 transition-all duration-150"
        >
          {/* ══ THE A4 PAGE CONTAINER ══ */}
          <div
            ref={documentPageRef}
            id="certified-pdf-page"
            className={`w-[794px] min-h-[1123px] rounded-sm p-10 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative flex flex-col justify-between border select-text transition-colors duration-200 ${
              isFormal
                ? "bg-[#FCFDFF] text-slate-900 border-slate-300"
                : "bg-[#070A12] text-slate-100 border-white/[0.12]"
            }`}
            style={{
              fontFamily: isArabic ? "'Tajawal', 'Cairo', sans-serif" : "inherit",
            }}
          >
            {/* Guilloche Microprint Security Border */}
            <div
              className={`absolute inset-3 border-2 border-dashed pointer-events-none rounded-xs opacity-40 ${
                isFormal ? "border-amber-700/30" : "border-amber-400/30"
              }`}
            />
            <div
              className={`absolute inset-4 border pointer-events-none rounded-xs opacity-60 ${
                isFormal ? "border-[#D4AF37]/50" : "border-[#00E5B9]/30"
              }`}
            />

            {/* Subtle Diagonal Security Watermark */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden select-none opacity-[0.12] text-red-600">
              <div className="text-8xl font-black rotate-[-35deg] uppercase tracking-widest text-center">
                SPECIMEN · NOT OFFICIAL · نموذج توضيحي
              </div>
            </div>

            {/* ══ PAGE CONTENT BY SELECTED TYPE ══ */}
            <div className="relative z-10 space-y-6">
              {/* ── 1. SPECIMEN HEADER ── */}
              <div
                className={`flex items-start justify-between border-b pb-5 ${
                  isFormal ? "border-slate-300" : "border-slate-800"
                }`}
              >
                {/* Right: National Authority / Emblem */}
                <div className="space-y-1 text-right">
                  <div className="text-xs font-bold text-red-600 tracking-wider">نموذج توضيحي — لم يصدر عن الجهة المذكورة</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {selectedDoc === "title_deed"
                      ? "مثال: السجل العقاري (للتوضيح فقط)"
                      : selectedDoc === "sbc_audit"
                      ? "مثال: تقرير فحص هندسي (للتوضيح فقط)"
                      : selectedDoc === "taqeem_valuation"
                      ? "مثال: تقرير مقيّم (للتوضيح فقط)"
                      : "مثال: ملف جاهزية مزاد (للتوضيح فقط)"}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    منظومة التوثيق الرقمي والذكاء المكاني · مرآة MIRAAH 2026
                  </div>
                </div>

                {/* Center: specimen marker */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-inner ${
                      isFormal
                        ? "bg-amber-50 border-amber-400/60 text-amber-700"
                        : "bg-slate-900 border-amber-400/40 text-amber-400"
                    }`}
                  >
                    <Building className="w-7 h-7" />
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400">
                    SPECIMEN
                  </span>
                </div>

                {/* Left: Document Serial Barcode & Reference Info */}
                <div className="space-y-1 text-left font-mono text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    رقم المستند: <span className="text-amber-600 dark:text-amber-400">{electronicDeedNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">التاريخ: {issueDateGregorian}</div>
                  <div className="text-[10px] text-slate-500">الموافق: {issueDateHijri}</div>
                </div>
              </div>

              {/* ── 2. DOCUMENT TITLE HERO BANNER ── */}
              <div
                className={`p-4 rounded-xl text-center space-y-1 border ${
                  isFormal
                    ? "bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50 border-amber-300/80"
                    : "bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border-amber-500/30"
                }`}
              >
                <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 tracking-widest uppercase">
                  {selectedDoc === "title_deed"
                    ? "SPECIMEN TITLE DEED · ILLUSTRATION ONLY"
                    : selectedDoc === "sbc_audit"
                    ? "SPECIMEN INSPECTION REPORT · ILLUSTRATION ONLY"
                    : selectedDoc === "taqeem_valuation"
                    ? "SPECIMEN VALUATION REPORT · ILLUSTRATION ONLY"
                    : "SPECIMEN AUCTION-READINESS SUMMARY · ILLUSTRATION ONLY"}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  {isArabic
                    ? documentsList.find((d) => d.id === selectedDoc)?.title
                    : documentsList.find((d) => d.id === selectedDoc)?.titleEn}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {isArabic
                    ? "نموذج توضيحي ببيانات تجريبية يوضح الشكل المقترح للمستند داخل المنصة. ليس مستنداً رسمياً ولا يحمل أي صفة نظامية."
                    : "Illustrative specimen with demo data showing the proposed in-platform layout. Not an official document and has no legal standing."}
                </p>
              </div>

              {/* ── 3. ASSET SPECIFICATIONS & REAL ESTATE DATA GRID ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-mono">
                    <Building className="w-3.5 h-3.5 text-amber-500" />
                    <span>بيانات العقار والأصل الأساسية · Core Property Identity</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    بيانات توضيحية
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      isFormal ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 block">اسم الأصل / العقار</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5 truncate">
                      {asset.nameArabic || asset.name}
                    </span>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border ${
                      isFormal ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 block">الموقع والمدينة</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                      {asset.city} - {asset.district}
                    </span>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border ${
                      isFormal ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 block">مساحة الأرض (بيانات توضيحية)</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                      {asset.sizeSqm?.toLocaleString() || "1,400"} م² (SQM)
                    </span>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border ${
                      isFormal ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 block">الاستخدام والتصنيف</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                      {asset.typeArabic || asset.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── 4. TECHNICAL AUDIT, FINDINGS & COMPLIANCE SECTION ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>مؤشرات الفحص وكود البناء السعودي (SBC Audit Scores)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    معاينة ميدانية رقم #{asset.id}-INSP
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div
                    className={`p-3 rounded-xl border text-center ${
                      isFormal ? "bg-emerald-50/60 border-emerald-300/80" : "bg-emerald-950/20 border-emerald-500/30"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 block">مؤشر الجاهزية للتصفية</span>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {scores.liquidationReadiness}%
                    </div>
                    <span className="text-[9px] text-emerald-700 dark:text-emerald-300 font-bold block mt-0.5">
                      جاهز للطرح بالمزاد
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-center ${
                      isFormal ? "bg-cyan-50/60 border-cyan-300/80" : "bg-cyan-950/20 border-cyan-500/30"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 block">الحالة الإنشائية والمعمارية</span>
                    <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                      {scores.conditionIndex}%
                    </div>
                    <span className="text-[9px] text-cyan-700 dark:text-cyan-300 font-bold block mt-0.5">
                      سلامة الهيكل الخرساني
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-center ${
                      isFormal ? "bg-blue-50/60 border-blue-300/80" : "bg-blue-950/20 border-blue-500/30"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 block">القيمة التقديرية العادلة</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {(asset.valuationSar / 1000000).toFixed(2)} M
                    </div>
                    <span className="text-[9px] text-slate-500 block mt-0.5">
                      ريال سعودي (SAR)
                    </span>
                  </div>
                </div>

                {/* SBC Regulatory Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  <table className="w-full text-right">
                    <thead>
                      <tr className={isFormal ? "bg-slate-100 text-slate-700" : "bg-slate-900 text-slate-300"}>
                        <th className="py-1.5 px-3">بند كود البناء</th>
                        <th className="py-1.5 px-3">مجال الفحص</th>
                        <th className="py-1.5 px-3">النتيجة والامتثال</th>
                        <th className="py-1.5 px-3">الأثر على التصفية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr>
                        <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400">SBC 304</td>
                        <td className="py-2 px-3">الهيكل الإنشائي والخرسانات المسلحة</td>
                        <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                          مطابق (سلامة كاملة)
                        </td>
                        <td className="py-2 px-3 text-slate-500">لا يوجد خصم</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400">SBC 601</td>
                        <td className="py-2 px-3">العزل الحراري ومقاومة الرطوبة بالسطح</td>
                        <td className="py-2 px-3 text-amber-600 dark:text-amber-400 font-bold">
                          معالجة تآكل الستارة قيد التنفيذ
                        </td>
                        <td className="py-2 px-3 text-slate-500">-18,000 ر.س</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400">SBC 801</td>
                        <td className="py-2 px-3">أنظمة الإطفاء والسلامة العامة</td>
                        <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                          قيمة توضيحية
                        </td>
                        <td className="py-2 px-3 text-slate-500">خلو تام من الملاحظات</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── 5. SPECIMEN SIGNATURE BLOCK ── */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
                  isFormal
                    ? "bg-amber-50/40 border-amber-300/60"
                    : "bg-slate-900/90 border-amber-500/30"
                }`}
              >
                {/* Left: Signatures and Authority Stamps */}
                <div className="space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                    <span>بيانات توقيع توضيحية (غير موقّع):</span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div>
                      المقيّم (مثال): <span className="font-bold text-slate-900 dark:text-white">{asset.inspectorName}</span>
                    </div>
                    <div>
                      ترخيص (مثال): <span className="font-bold text-amber-600 dark:text-amber-400">{taqeemLicNumber}</span>
                    </div>
                    <div>
                      رخصة (مثال): <span className="font-bold text-slate-900 dark:text-white">{municipalLicNumber}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-500">
                      <Lock className="w-3 h-3 text-emerald-500" />
                      <span>غير موقّع رقمياً · نموذج توضيحي</span>
                    </div>
                  </div>
                </div>

                {/* Right: specimen seal */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <AccreditationSeal
                    serialNumber={`SA-2026-${asset.id}`}
                    issueDate={issueDateGregorian}
                    inspectorName={asset.inspectorName}
                    licenseNumber={taqeemLicNumber}
                    size="md"
                    variant="gold"
                    isArabic={isArabic}
                  />
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold mt-1">
                    نموذج توضيحي · ليس ختماً رسمياً
                  </span>
                </div>
              </div>
            </div>

            {/* ── 6. DOCUMENT FOOTER WITH QR & BLOCKCHAIN TELEMETRY ── */}
            <div
              className={`relative z-10 pt-4 border-t flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-slate-500 ${
                isFormal ? "border-slate-300" : "border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white p-1 rounded border border-slate-300 shadow-sm flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-950" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    امسح الرمز للتحقق الفوري من الصك
                  </div>
                  <div className="text-[9px] text-slate-500 truncate max-w-xs">
                    No fingerprint · specimen
                  </div>
                </div>
              </div>

              <div className="text-left space-y-0.5">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  صفحة {currentPage} من {totalPages}
                </div>
                <div className="text-[9px] text-slate-500">
                  منظومة مرآة للذكاء المكاني · MIRAAH 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══ 4. DIGITAL VERIFICATION POPUP MODAL ══ */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#070A12] border border-cyan-500/40 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  {isArabic ? "لا يوجد ختم ولا توقيع (نموذج توضيحي)" : "No seal or signature (specimen)"}
                </h3>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>{isArabic ? "البصمة الرقمية: لا توجد (نموذج توضيحي، والبصمة الحقيقية في تصدير جواز الأصل)" : "Fingerprint: none (specimen; the real SHA-256 is in the passport export)"}</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer text-[10px]"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? "تم النسخ" : "نسخ"}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-cyan-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {sha256VerificationHash}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">جهة الاعتماد الرئيسية</span>
                  <span className="font-bold text-emerald-400">الهيئة العامة للعقار (REGA)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">حالة الصك والتصفية</span>
                  <span className="font-bold text-cyan-400">ساري ومطابق قضائياً</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono cursor-pointer"
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
