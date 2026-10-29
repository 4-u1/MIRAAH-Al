import React, { useState, useRef, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  X,
  FileJson,
  FileText,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Printer,
  Eye,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Building,
  QrCode,
  Calendar,
  UserCheck,
  Layers,
  Sparkles,
  ExternalLink,
  Award,
  MapPin,
  Scale,
  BadgeCheck,
  FileCheck,
  FileCheck2,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { AssetRecord } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import { PassportDocument, PASSPORT_PAGE_TITLES } from "./PassportDocument";
import { sanitizeElementForCanvas } from "../../utils/canvasSanitizer";
import { buildPassportData, buildPassportExport, buildPassportCsv, verifyPassportExport, type PassportExport } from "../../utils/passport";

interface ExportPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetRecord;
  scores: ScoreResults;
  onOpenPdfViewer?: () => void;
  isArabic?: boolean;
}

export const ExportPassportModal: React.FC<ExportPassportModalProps> = ({
  isOpen,
  onClose,
  asset,
  scores,
  onOpenPdfViewer,
  isArabic = false,
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "json">("preview");
  const [activePage, setActivePage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  const pdfPagesRef = useRef<HTMLDivElement>(null);

  // Single source of truth for JSON / CSV / PDF; fingerprint = SHA-256 of canonical passport JSON.
  const passportData = useMemo(() => buildPassportData(asset, scores), [asset, scores]);
  const [passportExport, setPassportExport] = useState<PassportExport | null>(null);
  const [verifyResult, setVerifyResult] = useState<string>("");
  useEffect(() => {
    let alive = true;
    buildPassportExport(passportData).then((e) => {
      if (alive) setPassportExport(e);
    });
    return () => {
      alive = false;
    };
  }, [passportData]);

  if (!isOpen) return null;

  const passportSha = passportExport?.fingerprint.sha256 ?? "";
  const evidenceUrl = asset.findings.find((f) => f.evidence?.length)?.evidence[0].frameUrl;
  const shaShown = passportSha || "computing…";
  const jsonString = passportExport ? JSON.stringify(passportExport, null, 2) : "";

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as PassportExport;
      if (!parsed?.passport || !parsed?.fingerprint?.sha256) throw new Error("not a passport export");
      const ok = await verifyPassportExport(parsed);
      setVerifyResult(
        ok
          ? isArabic
            ? `✓ بيانات الملف تطابق البصمة المكتوبة فيه: ${parsed.fingerprint.sha256.slice(0, 12)}… — قارنها ببصمة محفوظة بشكل منفصل`
            : `✓ Data matches the fingerprint inside the file: ${parsed.fingerprint.sha256.slice(0, 12)}… — compare it with a separately recorded fingerprint`
          : isArabic
          ? `✗ بيانات الملف لا تطابق البصمة المكتوبة فيه (عُدِّلت)`
          : `✗ File data does not match its embedded fingerprint (modified)`
      );
    } catch {
      setVerifyResult(isArabic ? "✗ ليس ملف تصدير جواز صالح" : "✗ Not a valid passport export file");
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText?.(passportSha);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!jsonString) return;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MIRAAH_Asset_Passport_${asset.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    const container = pdfPagesRef.current;
    if (!container || !passportExport) return;
    try {
      setIsGeneratingPdf(true);
      setPdfProgressText(isArabic ? "جاري تجهيز ملف PDF..." : "Rendering PDF...");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pages = Array.from(container.children) as HTMLElement[];
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#FFFFFF",
          logging: false,
          onclone: (clonedDoc) => sanitizeElementForCanvas(clonedDoc),
        });
        if (i > 0) pdf.addPage();
        const w = pdf.internal.pageSize.getWidth();
        const h = Math.min((canvas.height * w) / canvas.width, pdf.internal.pageSize.getHeight());
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, w, h, undefined, "FAST");
      }
      pdf.save(`MIRAAH_Demo_Passport_${asset.id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed, falling back to browser print:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgressText("");
    }
  };

  const handleDownloadCsv = () => {
    if (!passportSha) return;
    const csvContent = buildPassportCsv(passportData, passportSha);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MIRAAH_Asset_Audit_Dossier_${asset.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintDossier = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      window.print();
    }, 250);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          PRINT-FRIENDLY HIDDEN CONTAINER (Rendered exclusively for window.print)
          Uses specific print-friendly CSS classes: .dossier-print-container, .dossier-cover-page, and .dossier-print-page
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="dossier-print-container hidden print:block">
        {([1, 2, 3, 4] as const).map((p) => (
          <div key={p} className="dossier-print-page bg-white text-slate-900 font-sans">
            <PassportDocument page={p} data={passportData} exp={passportExport} isArabic={isArabic} evidenceUrl={evidenceUrl} />
          </div>
        ))}
      </div>

      {/* Off-screen copies of all pages, captured one by one for the multi-page PDF download. */}
      <div ref={pdfPagesRef} aria-hidden="true" style={{ position: "fixed", left: -10000, top: 0, width: 794 }}>
        {([1, 2, 3, 4] as const).map((p) => (
          <div key={p} style={{ width: 794 }}>
            <PassportDocument page={p} data={passportData} exp={passportExport} isArabic={isArabic} evidenceUrl={evidenceUrl} />
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN MODAL (Hidden from physical print output via .no-print)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-5xl bg-[#09152B] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col h-[92vh] max-h-[880px]">
          {/* ══ HEADER ══ */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0D1F45]/90 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-white font-mono">
                    {isArabic ? "ملف التصفية العقاري (نموذج تجريبي)" : "Asset Liquidation Dossier (prototype)"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    FR-16 · PROTOTYPE EXPORT
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Asset #{asset.id} · {isArabic ? asset.nameArabic : asset.name}
                </p>
              </div>
            </div>

            {/* Top Controls & Close */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeTab === "preview"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isArabic ? "معاينة التقرير (PDF)" : "PDF Preview"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("json")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeTab === "json"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>{isArabic ? "بيانات JSON" : "JSON Payload"}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ══ ACTION BAR ══ */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono shrink-0 flex-wrap gap-2">
            {/* Left: SHA-256 fingerprint, copy and verify */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>SHA-256:</span>
                <code className="text-[11px] text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {shaShown.slice(0, 14)}…{shaShown.slice(-6)}
                </code>
              </span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
              >
                {copiedHash ? "Copied!" : "Copy Hash"}
              </button>
              <label className="text-[10px] text-slate-400 hover:text-cyan-300 underline cursor-pointer">
                {isArabic ? "تحقق من ملف JSON" : "Verify a JSON file"}
                <input
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    handleVerifyFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              {verifyResult && <span className="text-[10px] text-slate-200">{verifyResult}</span>}
            </div>

            {/* Right: Multi-Format Export, PDF Download & Print Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeTab === "preview" && (
                <>
                  {/* Zoom Controls */}
                  <div className="hidden sm:flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
                      className="p-1 hover:text-cyan-400 text-slate-400 transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-300 font-mono w-10 text-center">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(140, z + 15))}
                      className="p-1 hover:text-cyan-400 text-slate-400 transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Specimen documents quick link */}
                  {onOpenPdfViewer && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPdfViewer();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Open specimen (illustrative) documents"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden md:inline">{isArabic ? "نماذج المستندات التوضيحية" : "Specimen documents"}</span>
                    </button>
                  )}

                  {/* Print Dossier Button */}
                  <button
                    onClick={handlePrintDossier}
                    disabled={isGeneratingPdf}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Print dossier using browser print layout"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isArabic ? "طباعة" : "Print"}</span>
                  </button>
                </>
              )}

              {/* 1. Primary Download PDF Button (Direct .PDF generation via jsPDF + html2canvas) */}
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-xs transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer disabled:opacity-50"
                title="Download prototype PDF"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                )}
                <span>
                  {isGeneratingPdf
                    ? isArabic
                      ? "جاري إنشاء PDF..."
                      : "Generating PDF..."
                    : isArabic
                    ? "تحميل التقرير (.PDF)"
                    : "Download (.PDF)"}
                </span>
              </button>

              {/* 2. Download Excel / CSV Audit Sheet */}
              <button
                onClick={handleDownloadCsv}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-emerald-400"
                title="Download complete defect inspection table & scores in Excel / CSV format"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isArabic ? "جدول الفحص (.CSV)" : "Audit Sheet (.CSV)"}</span>
              </button>

              {/* 3. Download Raw JSON Dossier */}
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Download raw machine-readable JSON dossier for API integration"
              >
                <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isArabic ? "بيانات (.JSON)" : "Dossier (.JSON)"}</span>
              </button>
            </div>
          </div>

        {/* ══ MAIN CONTENT BODY ══ */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#050811]">
          {activeTab === "preview" ? (
            <>
              {/* ── LEFT SIDEBAR: PAGE LIST ── */}
              <div className="w-full md:w-56 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 select-none">
                <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1 hidden md:block">
                  {isArabic ? "صفحات التقرير (4)" : "Dossier pages (4)"}
                </div>
                {PASSPORT_PAGE_TITLES.map((title, i) => (
                  <button
                    key={title.en}
                    onClick={() => setActivePage(i + 1)}
                    className={`rounded-lg px-3 py-2 text-start text-xs transition-all cursor-pointer border shrink-0 ${
                      activePage === i + 1
                        ? "bg-cyan-950/40 border-cyan-400/80 text-cyan-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {i + 1}. {isArabic ? title.ar : title.en}
                  </button>
                ))}
              </div>

              {/* ── MAIN DOCUMENT PREVIEW STAGE ── */}
              <div className="flex-1 bg-[#02050E] p-4 sm:p-8 overflow-y-auto flex items-center justify-center relative">
                <div
                  ref={printRef}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                  className="w-full max-w-[794px] rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300 select-text"
                >
                  <PassportDocument
                    page={activePage as 1 | 2 | 3 | 4}
                    data={passportData}
                    exp={passportExport}
                    isArabic={isArabic}
                    evidenceUrl={evidenceUrl}
                  />
                </div>

                {/* Floating Bottom Page Navigator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-full shadow-2xl z-20">
                  <button
                    onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                    disabled={activePage === 1}
                    className="p-1 rounded-full text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-200 px-2">
                    Page {activePage} of 4
                  </span>
                  <button
                    onClick={() => setActivePage((p) => Math.min(4, p + 1))}
                    disabled={activePage === 4}
                    className="p-1 rounded-full text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ── JSON TAB VIEW ── */
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#050811]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Full Machine-Readable JSON Payload Schema (FR-16)</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied Payload!" : "Copy JSON"}</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .JSON</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-[#070E1C] border border-cyan-500/25 font-mono text-xs text-cyan-300 overflow-x-auto max-h-[500px] leading-relaxed shadow-inner">
                {jsonString}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  );
};


