import React, { useState, useRef } from "react";
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
import { MiraahLogo } from "../common/MiraahLogo";
import { CoverPageAISummarySection } from "./CoverPageAISummarySection";
import { extractCoverPageAISummary } from "../../utils/aiCoverSummary";
import { sanitizeElementForCanvas } from "../../utils/canvasSanitizer";

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

  if (!isOpen) return null;

  const mockSha256 = `0x${Array.from(asset.id + "MIRAAH2026INFATH")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32)}e4f9b28a1c97`;

  const passportJson = {
    schema_version: "2.4.0-INFATH-GOV",
    dossier_id: `INFATH-DSP-${asset.id}-${new Date().getFullYear()}`,
    generated_at: new Date().toISOString(),
    blockchain_hash: mockSha256,
    authority: "مركز الإسناد والتصفية (إنفاذ) · Entrustment and Liquidation Center",
    partner_institution: "جامعة القصيم · Qassim University",
    accreditations: ["SCE-PROP-2026", "TAQEEM-VAL-2026", "SBC-COMPLIANT"],
    asset_info: {
      id: asset.id,
      name: asset.name,
      name_ar: asset.nameArabic,
      type: asset.type,
      type_ar: asset.typeArabic,
      location: asset.location,
      location_ar: asset.locationArabic,
      city: asset.city,
      district: asset.district,
      size_sqm: asset.sizeSqm,
      build_year: asset.buildYear,
      valuation_sar: asset.valuationSar,
      inspector: {
        name: asset.inspectorName,
        license: asset.inspectorLicense,
        inspection_date: asset.inspectionDate,
      },
    },
    scores: {
      liquidation_readiness_index: scores.liquidationReadiness,
      condition_index: scores.conditionIndex,
      inspection_confidence: scores.inspectionConfidence,
      inspection_coverage_pct: scores.coveragePct,
      risk_level: scores.riskLevel,
    },
    findings_summary: {
      total: scores.totalFindings,
      critical: scores.criticalCount,
      moderate: scores.moderateCount,
      low: scores.lowCount,
      unresolved: scores.unresolvedCount,
      verified_evidence_frames: scores.totalEvidenceFrames,
    },
    ai_due_diligence_synthesis: extractCoverPageAISummary(asset, scores),
    saudi_building_code_matrix: {
      "SBC-304": "مطابق مع ملاحظات طفيفة (Concrete & Rebar)",
      "SBC-601": "معالجة عزل رطوبي قيد المتابعة (Thermal & Moisture)",
      "SBC-801": "مكتمل بنسبة 100% (Fire Protection & Life Safety)",
      "SBC-201": "معتمد بالكامل (Architectural & Egress)",
    },
    standards_compliance: {
      evidence_traceability_pct: 100,
      four_state_buyer_transparency: true,
      digital_signature_valid: true,
    },
  };

  const jsonString = JSON.stringify(passportJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText?.(mockSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MIRAAH_Asset_Passport_${asset.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setIsGeneratingPdf(true);
      setPdfProgressText(isArabic ? "جاري تجهيز مستند PDF عالي الدقة..." : "Rendering High-DPI PDF...");

      const targetEl = printRef.current;
      const originalTransform = targetEl.style.transform;
      targetEl.style.transform = "none";

      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        onclone: (clonedDoc) => {
          sanitizeElementForCanvas(clonedDoc);
        },
      });

      targetEl.style.transform = originalTransform;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`MIRAAH_Certified_Dossier_Asset_${asset.id}_Page${activePage}.pdf`);
    } catch (err) {
      console.error("PDF generation failed, triggering browser print fallback:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgressText("");
    }
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Dossier Reference",
      "Asset ID",
      "Asset Name (EN)",
      "Asset Name (AR)",
      "Property Type",
      "City",
      "District",
      "Location Coordinates",
      "Size (SQM)",
      "Build Year",
      "Valuation (SAR)",
      "Liquidation Readiness (%)",
      "Condition Index (%)",
      "Inspection Confidence (%)",
      "Risk Level",
      "Inspector Name",
      "Inspector License",
      "Inspection Date",
      "Total Findings",
      "Critical Defects",
      "Moderate Defects",
      "Low Defects",
      "Unresolved Defects",
      "Finding ID",
      "Finding Title",
      "Defect Type",
      "Severity",
      "SBC Code Reference",
      "Area Zone",
      "Est. Repair Cost (SAR)",
      "Resolution Status",
      "AI Confidence (%)",
      "Blockchain Verification Hash",
    ];

    const rows = asset.findings.map((f) => [
      `INFATH-DSP-${asset.id}-2026`,
      asset.id,
      `"${(asset.name || "").replace(/"/g, '""')}"`,
      `"${(asset.nameArabic || "").replace(/"/g, '""')}"`,
      `"${asset.type}"`,
      `"${asset.city}"`,
      `"${asset.district}"`,
      `"${(asset.location || "").replace(/"/g, '""')}"`,
      asset.sizeSqm,
      asset.buildYear,
      asset.valuationSar,
      scores.liquidationReadiness,
      scores.conditionIndex,
      scores.inspectionConfidence,
      scores.riskLevel,
      `"${asset.inspectorName}"`,
      asset.inspectorLicense,
      asset.inspectionDate,
      scores.totalFindings,
      scores.criticalCount,
      scores.moderateCount,
      scores.lowCount,
      scores.unresolvedCount,
      f.id,
      `"${(f.title || f.type || "").replace(/"/g, '""')}"`,
      `"${f.type}"`,
      `"${f.severity}"`,
      f.severity === "Critical" ? "SBC-304" : f.type === "Moisture" ? "SBC-601" : "SBC-201",
      `"${(f.area || "").replace(/"/g, '""')}"`,
      f.severity === "Critical" ? 45000 : f.severity === "Moderate" ? 18000 : 5000,
      f.isResolved ? "Resolved" : "Unresolved",
      `${f.conf}%`,
      mockSha256,
    ]);

    const csvContent =
      "\uFEFF" +
      [
        headers.join(","),
        ...(rows.length > 0
          ? rows.map((r) => r.join(","))
          : [
              [
                `INFATH-DSP-${asset.id}-2026`,
                asset.id,
                `"${asset.name}"`,
                `"${asset.nameArabic}"`,
                `"${asset.type}"`,
                `"${asset.city}"`,
                `"${asset.district}"`,
                `"${asset.location}"`,
                asset.sizeSqm,
                asset.buildYear,
                asset.valuationSar,
                scores.liquidationReadiness,
                scores.conditionIndex,
                scores.inspectionConfidence,
                scores.riskLevel,
                `"${asset.inspectorName}"`,
                asset.inspectorLicense,
                asset.inspectionDate,
                0,
                0,
                0,
                0,
                0,
                "N/A",
                "No active defects",
                "None",
                "None",
                "SBC-COMPLIANT",
                "All Zones",
                0,
                "Clean",
                "100%",
                mockSha256,
              ].join(","),
            ]),
      ].join("\r\n");

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
        {/* ══ PAGE 1: CLIENT-READY COVER PAGE ══ */}
        <div className="dossier-cover-page bg-white text-slate-900 font-sans">
          {/* Subtle Watermark */}
          <div className="dossier-cover-watermark">MIRAAH · INFATH</div>

          <div className="dossier-cover-frame flex-1 flex flex-col justify-between z-10">
            <div className="dossier-cover-inner-border" />

            <div>
              {/* Institutional Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center p-2 text-cyan-400 shadow-md dossier-highres-logo">
                    <MiraahLogo size={46} showSubtitle={false} />
                  </div>
                  <div>
                    <div className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                      <span>MIRAAH</span>
                      <span className="text-cyan-700 font-arabic">مرآة</span>
                    </div>
                    <div className="text-[10px] font-bold text-cyan-800 tracking-wider uppercase font-mono">
                      Spatial Asset Intelligence & Liquidation Readiness
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-[11px] font-bold text-slate-900 font-arabic">
                    المملكة العربية السعودية · منظومة التصفية والإنفاذ
                  </div>
                  <div className="text-[9.5px] font-mono font-bold text-cyan-900">
                    Doc Ref: INFATH-DSP-{asset.id}-2026-CR
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    Issuance: {asset.inspectionDate} · Form FR-16
                  </div>
                </div>
              </div>

              {/* Cover Document Title */}
              <div className="mt-5 mb-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-900 text-white text-[10px] font-mono font-bold tracking-widest uppercase mb-2 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                  <span>OFFICIAL ACCREDITED DUE DILIGENCE DOSSIER & SPATIAL ASSET PASSPORT</span>
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-arabic">
                  جواز الأصل المكاني وملف الفحص النافي للجهالة المعتمد للتصفية
                </h1>
              </div>

              {/* Subject Asset Identification Box */}
              <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3.5 my-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-900 uppercase bg-cyan-100 px-2 py-0.5 rounded">
                      SUBJECT ASSET IDENTIFICATION
                    </span>
                    <h2 className="text-xl font-black text-slate-950 mt-1">
                      {asset.name}
                    </h2>
                    <p className="text-xs font-bold text-slate-700 font-arabic mt-0.5">
                      {asset.nameArabic} · {asset.location}
                    </p>
                    <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-700" />
                        <span>Cadastre Ref: #{asset.id}</span>
                      </span>
                      <span>·</span>
                      <span>RTK-GPS: 24.7742° N, 46.5912° E (±1.2cm)</span>
                    </div>
                  </div>

                  <div className="text-end bg-white border border-slate-300 rounded-lg p-2.5 shadow-xs shrink-0">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      Certified Valuation (Taqeem)
                    </div>
                    <div className="text-base font-black text-emerald-800">
                      SAR {asset.valuationSar.toLocaleString()}
                    </div>
                    <div className="text-[8.5px] font-semibold text-emerald-900 bg-emerald-50 rounded px-1.5 py-0.5 mt-0.5 border border-emerald-200">
                      FR-16 Liquidation Ready
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Asset Metadata Summary Grid */}
              <div className="my-3">
                <div className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center justify-between border-b border-slate-300 pb-1">
                  <span>EXECUTIVE ASSET METADATA & TECHNICAL SUMMARY</span>
                  <span className="text-cyan-800 font-normal">ISO/IEC 17020 & SBC Compliant</span>
                </div>

                <div className="dossier-meta-grid">
                  <div className="dossier-meta-item">
                    <span>Asset Classification:</span>
                    <strong>{asset.type} (Grade-A Commercial)</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Total Built-Up Area (BUA):</span>
                    <strong>{asset.sizeSqm.toLocaleString()} m²</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Land Parcel / Plot Number:</span>
                    <strong>Plot #419, Sector 2A (1,850 m²)</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Year Built / Building Age:</span>
                    <strong>{asset.buildYear} ({2026 - asset.buildYear} Years)</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Liquidation Readiness Score:</span>
                    <strong className="text-cyan-800">{scores.liquidationReadiness}% (Tier-1 Accelerated)</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Structural Condition Grade:</span>
                    <strong className="text-emerald-800">{scores.conditionIndex}% (Sound Structural Core)</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Saudi Building Code (SBC):</span>
                    <strong>SBC 201 / 304 / 601 / 801 Validated</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>LiDAR Cloud & Spatial Density:</span>
                    <strong>4.2M Pts · ±1.2cm Survey Grade</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Licensed Lead SCE Inspector:</span>
                    <strong>{asset.inspectorName} (SCE #{asset.inspectorLicense})</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Judicial Clearance Status:</span>
                    <strong className="text-blue-900">Enforcement Order #48291 · Auction Cleared</strong>
                  </div>
                </div>
              </div>

              {/* AI-Driven Investment Readiness & Primary Risk Factors Summary */}
              <CoverPageAISummarySection
                asset={asset}
                scores={scores}
                isArabic={isArabic}
              />

              {/* Institutional Accreditation Seals */}
              <div className="grid grid-cols-3 gap-2 my-2.5">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-center">
                  <div className="text-[9px] font-bold text-slate-900 flex items-center justify-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Infath Innovation</span>
                  </div>
                  <div className="text-[8px] text-slate-500 mt-0.5">
                    Accredited Liquidation Twin
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-center">
                  <div className="text-[9px] font-bold text-slate-900 flex items-center justify-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Saudi Council of Engineers</span>
                  </div>
                  <div className="text-[8px] text-slate-500 mt-0.5">
                    Certified Technical Inspection
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-center">
                  <div className="text-[9px] font-bold text-slate-900 flex items-center justify-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Taqeem Accredited</span>
                  </div>
                  <div className="text-[8px] text-slate-500 mt-0.5">
                    Real Estate Valuation Standard
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Cryptographic Provenance & Client-Ready Disclaimer */}
            <div className="border-t-2 border-slate-900 pt-2.5 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-lg p-1 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="text-[9px] text-slate-600">
                    <div className="font-bold text-slate-900">Cryptographic Due Diligence QR & Audit Seal</div>
                    <div>Scan for interactive BIM 3D viewer & raw sensor telemetry</div>
                    <div className="font-mono text-[8px] text-slate-500 mt-0.5">
                      Merkle Root: {mockSha256.slice(0, 24)}...
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-[9px] font-mono font-bold text-slate-900 uppercase">
                    Security Stamp: VERIFIED · GENUINE
                  </div>
                  <div className="text-[8px] text-slate-500">
                    Digital Passport UUID: DSP-{asset.id}-2026-X9
                  </div>
                  <div className="text-[8px] font-mono text-cyan-800">
                    https://miraah.sa/verify/{asset.id}
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500 font-mono">
                <span>CONFIDENTIAL · PREPARED FOR JUDICIAL ENFORCEMENT & INFATH AUCTION</span>
                <span>CLIENT-READY DOSSIER · COVER PAGE (1 OF 4)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ PAGE 2: EXECUTIVE CERTIFICATE & LIQUIDATION KPIS ══ */}
        <div className="dossier-print-page bg-white text-slate-900 font-sans">
          <div className="relative z-10 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center p-2 text-cyan-400 shadow-md">
                    <MiraahLogo size={36} showSubtitle={false} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold tracking-tight text-slate-950">
                      MIRAAH · مرآة
                    </div>
                    <div className="text-[11px] font-bold text-cyan-700 tracking-wider uppercase">
                      Spatial Asset Intelligence & Liquidation Readiness
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-[11px] font-bold text-slate-800">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>مبادرة ابتكار إنفاذ · Infath Innovation</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Doc Ref: INFATH-DSP-{asset.id}-2026
                  </div>
                </div>
              </div>

              {/* Title Banner */}
              <div className="my-5 text-center">
                <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-800 uppercase bg-cyan-50 px-3 py-1 rounded-md border border-cyan-200">
                  SECTION 01 / 03 · EXECUTIVE CERTIFICATE & LIQUIDATION SUMMARY
                </span>
                <h1 className="text-2xl font-black text-slate-950 mt-2">
                  {asset.name}
                </h1>
                <p className="text-xs text-slate-600 mt-1 font-arabic">
                  {asset.nameArabic} · {asset.location}
                </p>
              </div>

              {/* Executive KPI Grid */}
              <div className="grid grid-cols-4 gap-3 my-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Readiness Score
                  </div>
                  <div className="text-2xl font-black text-cyan-700 mt-0.5">
                    {scores.liquidationReadiness}%
                  </div>
                  <div className="text-[9px] font-semibold text-cyan-800 bg-cyan-100/60 rounded px-1 mt-1">
                    Tier-1 Liquidation
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Condition Index
                  </div>
                  <div className="text-2xl font-black text-emerald-700 mt-0.5">
                    {scores.conditionIndex}%
                  </div>
                  <div className="text-[9px] font-semibold text-emerald-800 bg-emerald-100/60 rounded px-1 mt-1">
                    Sound Structure
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Spatial Coverage
                  </div>
                  <div className="text-2xl font-black text-blue-700 mt-0.5">
                    {scores.coveragePct}%
                  </div>
                  <div className="text-[9px] font-semibold text-blue-800 bg-blue-100/60 rounded px-1 mt-1">
                    Drone & 3D LiDAR
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    AI Confidence
                  </div>
                  <div className="text-2xl font-black text-indigo-700 mt-0.5">
                    {scores.inspectionConfidence}%
                  </div>
                  <div className="text-[9px] font-semibold text-indigo-800 bg-indigo-100/60 rounded px-1 mt-1">
                    Multi-Sensor Validated
                  </div>
                </div>
              </div>

              {/* Core Asset Specifications Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden my-4 text-xs">
                <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between items-center">
                  <span>ASSET SPECIFICATIONS & LEGAL IDENTIFICATION</span>
                  <span className="text-[10px] font-mono text-slate-500 font-normal">
                    National Cadastre Reg: #{asset.id}
                  </span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 text-slate-700">
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Asset Category:</span>
                    <span className="font-semibold text-slate-900">{asset.type}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Total Built-Up Area:</span>
                    <span className="font-semibold text-slate-900">{asset.sizeSqm.toLocaleString()} m²</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Construction Year:</span>
                    <span className="font-semibold text-slate-900">{asset.buildYear}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Certified Valuation:</span>
                    <span className="font-bold text-emerald-800">{asset.valuationSar.toLocaleString()} SAR</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">Licensed Inspector:</span>
                    <span className="font-semibold text-slate-900">{asset.inspectorName}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-500">SCE License Ref:</span>
                    <span className="font-mono text-slate-900 font-semibold">{asset.inspectorLicense}</span>
                  </div>
                </div>
              </div>

              {/* Explainability & Infath Clearance Statement */}
              <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs text-slate-800 my-4 leading-relaxed">
                <div className="font-bold text-cyan-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-700" />
                  <span>EXECUTIVE CLEARANCE & AUCTION TRANSPARENCY RULING</span>
                </div>
                <p className="text-slate-700">
                  {scores.explainabilityText}
                </p>
              </div>
            </div>

            {/* Official Sign-off & QR Seal Footer */}
            <div className="border-t-2 border-slate-900 pt-4 flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="text-[10px] text-slate-600">
                  <div className="font-bold text-slate-900">Cryptographic Verification QR</div>
                  <div>Scan to audit live spatial digital twin & telemetry</div>
                  <div className="font-mono text-[9px] text-slate-400 mt-0.5">
                    Hash: {mockSha256.slice(0, 20)}...
                  </div>
                </div>
              </div>

              <div className="text-end">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Certified Endorsement
                </div>
                <div className="font-serif italic font-bold text-sm text-slate-900 mt-0.5">
                  Eng. Zaid Al-Harthy
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  Saudi Council of Engineers · {asset.inspectionDate}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-2 mt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span>MIRAAH Spatial AI Engine v2.4</span>
              <span>Audited under Saudi Arbitration & Enforcement Law</span>
              <span>Page 2 of 4</span>
            </div>
          </div>
        </div>

        {/* ══ PAGE 3: DEFECT AUDIT & SBC MATRIX ══ */}
        <div className="dossier-print-page bg-white text-slate-900 font-sans">
          <div className="relative z-10 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-700 uppercase">
                    SECTION 02 / 03 · TECHNICAL AUDIT
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Saudi Building Code (SBC) Compliance & Defect Matrix
                  </h2>
                </div>
                <div className="text-end text-[10px] text-slate-500 font-mono">
                  Asset #{asset.id} · Page 3 of 4
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 my-4">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>SBC 304: Concrete & Rebar</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      94% COMPLIANT
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">
                    No active corrosion or structural rebar shear cracks detected in core frames.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>SBC 601: Thermal & Moisture</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800">
                      ACTION REQUIRED
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Drainage moisture pooling identified on roof deck; remediation estimated at 12,000 SAR.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>SBC 801: Fire & Life Safety</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      100% CLEAR
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Emergency egress paths unobstructed, fire damper assemblies verified.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>SBC 201: Architectural & Egress</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      98% COMPLIANT
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Facade alignments within tolerance (+3.2mm max deviation vs BIM model).
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden my-3 text-xs">
                <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between items-center">
                  <span>ITEMIZED AI FINDINGS LOG ({asset.findings.length} TOTAL)</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Traceable Evidence
                  </span>
                </div>

                <div className="divide-y divide-slate-200">
                  {asset.findings.map((f, idx) => (
                    <div key={f.id} className="p-3 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            #{idx + 1} {f.type}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                              f.severity === "Critical"
                                ? "bg-red-100 text-red-800"
                                : f.severity === "Moderate"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {f.severity}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Area: {f.area}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-tight">
                          {f.description}
                        </p>
                        <p className="text-cyan-800 text-[10px] font-medium">
                          Rx: {f.recommendation}
                        </p>
                      </div>

                      <div className="text-end shrink-0">
                        <div className="font-mono font-bold text-slate-900">
                          {f.conf}% Conf
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mt-1 ${
                            f.isResolved
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {f.isResolved ? "Resolved" : "Pending Action"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>MIRAAH Spatial AI Engine v2.4</span>
              <span>Audited under Saudi Arbitration & Enforcement Law</span>
              <span>Page 3 of 4</span>
            </div>
          </div>
        </div>

        {/* ══ PAGE 4: PHOTOGRAPHIC EVIDENCE & BLOCKCHAIN PROVENANCE ══ */}
        <div className="dossier-print-page bg-white text-slate-900 font-sans">
          <div className="relative z-10 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-700 uppercase">
                    SECTION 03 / 03 · SPATIAL TRACEABILITY & EVIDENCE
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Visual Proof, Drone Telemetry & Blockchain Log
                  </h2>
                </div>
                <div className="text-end text-[10px] text-slate-500 font-mono">
                  Asset #{asset.id} · Page 4 of 4
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4">
                {asset.findings[0]?.evidence[0] && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50">
                    <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900 mb-2">
                      <img
                        src={asset.findings[0].evidence[0].frameUrl}
                        alt="Evidence Frame"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-cyan-300 border border-cyan-500/40">
                        Frame #{asset.findings[0].evidence[0].id} · {asset.findings[0].evidence[0].timestampFormatted}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-amber-500 text-[9px] font-bold text-slate-950">
                        {asset.findings[0].evidence[0].confidence}% AI Conf
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-900">
                      {asset.findings[0].evidence[0].cameraAngle}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {asset.findings[0].evidence[0].notes}
                    </p>
                  </div>
                )}

                {asset.heroImage && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50">
                    <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900 mb-2">
                      <img
                        src={asset.heroImage}
                        alt="Asset Facade"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-cyan-300 border border-cyan-500/40">
                        Autonomous Drone Aerial Survey
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-[9px] font-bold text-white">
                        98% Photogrammetry Match
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-900">
                      Exterior Envelope & Orthomosaic 3D Scan
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Calibrated under RTK-GPS with ±1.2cm spatial precision.
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-mono my-3 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>BLOCKCHAIN IMMUTABLE AUDIT TRAIL</span>
                </div>
                <div className="text-[10px] text-slate-600 divide-y divide-slate-200">
                  <div className="py-1 flex justify-between">
                    <span className="text-slate-500">Smart Contract:</span>
                    <span className="text-slate-800">0x71C9...89b4 (InfathRegistryV2)</span>
                  </div>
                  <div className="py-1 flex justify-between">
                    <span className="text-slate-500">Block Number:</span>
                    <span className="text-slate-800">#19,842,109</span>
                  </div>
                  <div className="py-1 flex justify-between">
                    <span className="text-slate-500">Payload Merkle Root:</span>
                    <span className="text-slate-800">{mockSha256}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Tamper-evident verification certified</span>
              <span>End of Certified Due Diligence Dossier</span>
              <span>Page 4 of 4</span>
            </div>
          </div>
        </div>
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
                    {isArabic ? "ملف التصفية العقاري المعتمد (Due Diligence Dossier)" : "Certified Asset Liquidation Dossier"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    FR-16 · TAQEEM & INFATH READY
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
            {/* Left: Document Metadata & Blockchain Seal */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>SHA-256:</span>
                <code className="text-[11px] text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {mockSha256.slice(0, 14)}...{mockSha256.slice(-6)}
                </code>
              </span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
              >
                {copiedHash ? "Copied!" : "Copy Hash"}
              </button>
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

                  {/* Certified PDF Vault Quick Link */}
                  {onOpenPdfViewer && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPdfViewer();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Open Official Certified Title Deeds & Audit PDFs"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden md:inline">{isArabic ? "خزينة الصكوك والوثائق المعتمدة" : "Certified Docs Vault"}</span>
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
                title="Download High-Resolution Official Certified PDF Document"
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
                    ? "تحميل التقرير المعتمد (.PDF)"
                    : "Download Certified (.PDF)"}
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
              {/* ── LEFT SIDEBAR: PAGE THUMBNAILS CAROUSEL ── */}
              <div className="w-full md:w-56 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 select-none">
                <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1 hidden md:block">
                  {isArabic ? "صفحات التقرير (4)" : "Dossier Pages (4)"}
                </div>

                {/* Thumbnail 1: Official Client-Ready Cover Page */}
                <button
                  onClick={() => setActivePage(1)}
                  className={`relative group rounded-xl p-2 text-start transition-all cursor-pointer border flex flex-col gap-1.5 shrink-0 w-44 md:w-full ${
                    activePage === 1
                      ? "bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span className="font-bold text-cyan-400">Page 1</span>
                    <span className="text-[9px] bg-cyan-900/80 text-cyan-300 px-1 rounded font-bold">Cover</span>
                  </div>
                  {/* Miniature Visual Mock of Cover Page */}
                  <div className="w-full h-24 bg-slate-100 rounded-md p-1.5 flex flex-col justify-between overflow-hidden shadow-inner text-[6px] text-slate-800 font-sans border-2 border-slate-800">
                    <div className="flex justify-between items-center border-b border-slate-300 pb-0.5">
                      <div className="font-bold text-[7px] text-slate-950 flex items-center gap-0.5">
                        <span className="w-2 h-2 rounded bg-slate-950 inline-block" />
                        <span>MIRAAH · مرآة</span>
                      </div>
                      <div className="text-[5px] text-slate-600 font-mono">FR-16</div>
                    </div>
                    <div className="my-0.5 text-center">
                      <div className="text-[5.5px] font-bold text-cyan-950 truncate">{asset.name}</div>
                      <div className="text-[4.5px] text-slate-500 font-arabic truncate">{asset.location}</div>
                    </div>
                    <div className="bg-cyan-900/10 border border-cyan-700/30 rounded p-0.5 text-[4.5px] text-cyan-950 flex justify-between items-center">
                      <span className="font-bold flex items-center gap-0.5">
                        <span className="text-[5px]">✨</span>
                        <span>AI Ready: {scores.liquidationReadiness}%</span>
                      </span>
                      <span className="text-[4px] bg-cyan-900 text-white px-0.5 rounded font-mono">Managed Risk</span>
                    </div>
                    <div className="grid grid-cols-2 gap-0.5 bg-slate-200/90 rounded p-0.5 text-[5px]">
                      <div>BUA: <strong>{asset.sizeSqm}m²</strong></div>
                      <div>Val: <strong>{asset.valuationSar.toLocaleString()}</strong></div>
                      <div>Readiness: <strong className="text-cyan-800">{scores.liquidationReadiness}%</strong></div>
                      <div>Structure: <strong className="text-emerald-800">{scores.conditionIndex}%</strong></div>
                    </div>
                    <div className="flex justify-between items-center text-[4.5px] text-slate-600 pt-0.5 border-t border-slate-300">
                      <span>Infath Accredited</span>
                      <span>SCE Certified</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate">
                    {isArabic ? "١. غلاف التقرير المعتمد" : "1. Client Ready Cover"}
                  </div>
                </button>

                {/* Thumbnail 2: Executive Certificate & Liquidation Summary */}
                <button
                  onClick={() => setActivePage(2)}
                  className={`relative group rounded-xl p-2 text-start transition-all cursor-pointer border flex flex-col gap-1.5 shrink-0 w-44 md:w-full ${
                    activePage === 2
                      ? "bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span className="font-bold text-cyan-400">Page 2</span>
                    <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-400">Cert</span>
                  </div>
                  {/* Miniature Visual Mock of Page 2 */}
                  <div className="w-full h-24 bg-slate-100 rounded-md p-1.5 flex flex-col justify-between overflow-hidden shadow-inner text-[6px] text-slate-800 font-sans border border-slate-300">
                    <div className="flex justify-between items-center border-b border-slate-300 pb-0.5">
                      <div className="font-bold text-[7px] text-cyan-800">MIRAAH · مرآة</div>
                      <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[5px] text-amber-800 font-bold">
                        SEAL
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-1.5 bg-slate-300 rounded w-3/4" />
                      <div className="h-1 bg-slate-200 rounded w-full" />
                      <div className="h-1 bg-slate-200 rounded w-5/6" />
                    </div>
                    <div className="grid grid-cols-3 gap-0.5 py-0.5 bg-slate-200/80 rounded px-1 text-center">
                      <div className="font-bold text-cyan-900">{scores.liquidationReadiness}%</div>
                      <div className="font-bold text-emerald-900">{scores.conditionIndex}%</div>
                      <div className="font-bold text-blue-900">{scores.coveragePct}%</div>
                    </div>
                    <div className="flex justify-between items-center text-[5px] text-slate-500 pt-0.5 border-t border-slate-200">
                      <span>SBC-304 Pass</span>
                      <span>TAQEEM-Accredited</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate">
                    {isArabic ? "٢. شهادة الجاهزية والتقييم" : "2. Liquidation Certificate"}
                  </div>
                </button>

                {/* Thumbnail 3: SBC Defect Audit & Engineering Matrix */}
                <button
                  onClick={() => setActivePage(3)}
                  className={`relative group rounded-xl p-2 text-start transition-all cursor-pointer border flex flex-col gap-1.5 shrink-0 w-44 md:w-full ${
                    activePage === 3
                      ? "bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span className="font-bold text-cyan-400">Page 3</span>
                    <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-400">Audit</span>
                  </div>
                  {/* Miniature Visual Mock of Page 3 */}
                  <div className="w-full h-24 bg-slate-100 rounded-md p-1.5 flex flex-col justify-between overflow-hidden shadow-inner text-[6px] text-slate-800 font-sans border border-slate-300">
                    <div className="flex justify-between items-center border-b border-slate-300 pb-0.5 font-bold text-slate-700">
                      <span>DEFECT & SBC AUDIT</span>
                      <span className="text-amber-600 font-bold">{scores.totalFindings} Items</span>
                    </div>
                    <div className="space-y-1 my-0.5">
                      <div className="flex justify-between bg-red-100 px-1 py-0.5 rounded text-[5px] text-red-900">
                        <span>Roof Moisture</span>
                        <span className="font-bold">SBC-601</span>
                      </div>
                      <div className="flex justify-between bg-amber-100 px-1 py-0.5 rounded text-[5px] text-amber-900">
                        <span>HVAC Vibration</span>
                        <span className="font-bold">SBC-501</span>
                      </div>
                      <div className="flex justify-between bg-emerald-100 px-1 py-0.5 rounded text-[5px] text-emerald-900">
                        <span>Fire Egress Pass</span>
                        <span className="font-bold">SBC-801</span>
                      </div>
                    </div>
                    <div className="h-1 bg-slate-300 rounded w-1/2 mt-auto" />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate">
                    {isArabic ? "٣. سجل العيوب وكود البناء" : "3. Defect & SBC Audit"}
                  </div>
                </button>

                {/* Thumbnail 4: Evidence Frames & Drone Coverage */}
                <button
                  onClick={() => setActivePage(4)}
                  className={`relative group rounded-xl p-2 text-start transition-all cursor-pointer border flex flex-col gap-1.5 shrink-0 w-44 md:w-full ${
                    activePage === 4
                      ? "bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span className="font-bold text-cyan-400">Page 4</span>
                    <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-400">Proof</span>
                  </div>
                  {/* Miniature Visual Mock of Page 4 */}
                  <div className="w-full h-24 bg-slate-100 rounded-md p-1.5 flex flex-col justify-between overflow-hidden shadow-inner text-[6px] text-slate-800 font-sans border border-slate-300">
                    <div className="font-bold text-slate-700 border-b border-slate-300 pb-0.5">
                      SPATIAL PROOF & DRONE
                    </div>
                    <div className="grid grid-cols-2 gap-1 my-0.5">
                      <div className="h-8 bg-slate-300 rounded overflow-hidden relative">
                        <div className="absolute inset-0 bg-cyan-900/20 flex items-center justify-center text-[5px] text-cyan-900 font-bold">
                          IR Therm
                        </div>
                      </div>
                      <div className="h-8 bg-slate-300 rounded overflow-hidden relative">
                        <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center text-[5px] text-emerald-900 font-bold">
                          LiDAR Map
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[5px] text-slate-500">
                      <span>Blockchain Ledger</span>
                      <span className="text-emerald-700 font-bold">Verified</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate">
                    {isArabic ? "٤. الأدلة والخرائط المكانية" : "4. Evidence & LiDAR Map"}
                  </div>
                </button>
              </div>

              {/* ── MAIN DOCUMENT PREVIEW STAGE ── */}
              <div className="flex-1 bg-[#02050E] p-4 sm:p-8 overflow-y-auto flex items-center justify-center relative">
                <div
                  ref={printRef}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                  className="w-full max-w-[760px] min-h-[960px] bg-white text-slate-900 rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] p-8 sm:p-12 transition-all duration-300 relative border border-slate-200 flex flex-col justify-between select-text"
                >
                  {/* Subtle Document Security Background Grid & Watermark */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
                  
                  {/* Watermark in Arabic/English */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
                    <span className="text-8xl font-black rotate-[-30deg] tracking-widest text-slate-950 font-sans">
                      INFATH · CERTIFIED
                    </span>
                  </div>

                  {/* ════ PAGE 1: CLIENT-READY OFFICIAL COVER PAGE ════ */}
                  {activePage === 1 && (
                    <div className="relative z-10 flex flex-col justify-between flex-1 border border-slate-300 rounded-lg p-6 bg-white shadow-xs">
                      <div>
                        {/* Institutional Header */}
                        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center p-2 text-cyan-400 shadow-md">
                              <MiraahLogo size={40} showSubtitle={false} />
                            </div>
                            <div>
                              <div className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                                <span>MIRAAH</span>
                                <span className="text-cyan-700 font-arabic">مرآة</span>
                              </div>
                              <div className="text-[10px] font-bold text-cyan-800 tracking-wider uppercase font-mono">
                                Spatial Asset Intelligence & Liquidation Readiness
                              </div>
                            </div>
                          </div>

                          <div className="text-end">
                            <div className="text-[10.5px] font-bold text-slate-900 font-arabic">
                              المملكة العربية السعودية · منظومة التصفية والإنفاذ
                            </div>
                            <div className="text-[9px] font-mono font-bold text-cyan-900">
                              Doc Ref: INFATH-DSP-{asset.id}-2026-CR
                            </div>
                            <div className="text-[8.5px] text-slate-500 font-mono">
                              Issuance: {asset.inspectionDate} · Form FR-16
                            </div>
                          </div>
                        </div>

                        {/* Cover Document Title */}
                        <div className="mt-4 mb-3 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-900 text-white text-[9.5px] font-mono font-bold tracking-widest uppercase mb-1 shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-cyan-300" />
                            <span>OFFICIAL ACCREDITED DUE DILIGENCE DOSSIER & SPATIAL ASSET PASSPORT</span>
                          </div>
                          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight font-arabic">
                            جواز الأصل المكاني وملف الفحص النافي للجهالة المعتمد للتصفية
                          </h1>
                        </div>

                        {/* Subject Asset Identification Box */}
                        <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 my-2.5 shadow-xs">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-[8.5px] font-mono font-bold tracking-wider text-cyan-900 uppercase bg-cyan-100 px-2 py-0.5 rounded">
                                SUBJECT ASSET IDENTIFICATION
                              </span>
                              <h2 className="text-lg font-black text-slate-950 mt-1">
                                {asset.name}
                              </h2>
                              <p className="text-xs font-bold text-slate-700 font-arabic mt-0.5">
                                {asset.nameArabic} · {asset.location}
                              </p>
                              <div className="text-[9.5px] font-mono text-slate-500 mt-1 flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-cyan-700" />
                                  <span>Cadastre Ref: #{asset.id}</span>
                                </span>
                                <span>·</span>
                                <span>RTK-GPS: 24.7742° N, 46.5912° E (±1.2cm)</span>
                              </div>
                            </div>

                            <div className="text-end bg-white border border-slate-300 rounded-lg p-2 shadow-xs shrink-0">
                              <div className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">
                                Certified Valuation (Taqeem)
                              </div>
                              <div className="text-sm font-black text-emerald-800">
                                SAR {asset.valuationSar.toLocaleString()}
                              </div>
                              <div className="text-[8px] font-semibold text-emerald-900 bg-emerald-50 rounded px-1.5 py-0.5 mt-0.5 border border-emerald-200">
                                FR-16 Liquidation Ready
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Comprehensive Asset Metadata Summary Grid */}
                        <div className="my-2.5">
                          <div className="text-[9.5px] font-mono font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center justify-between border-b border-slate-300 pb-0.5">
                            <span>EXECUTIVE ASSET METADATA & TECHNICAL SUMMARY</span>
                            <span className="text-cyan-800 font-normal">ISO/IEC 17020 & SBC Compliant</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Asset Classification:</span>
                              <strong className="text-slate-900">{asset.type} (Grade-A Commercial)</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Total Built-Up Area (BUA):</span>
                              <strong className="text-slate-900">{asset.sizeSqm.toLocaleString()} m²</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Land Parcel / Plot Number:</span>
                              <strong className="text-slate-900">Plot #419, Sector 2A (1,850 m²)</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Year Built / Building Age:</span>
                              <strong className="text-slate-900">{asset.buildYear} ({2026 - asset.buildYear} Years)</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Liquidation Readiness:</span>
                              <strong className="text-cyan-800 font-bold">{scores.liquidationReadiness}% (Accelerated)</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Structural Condition Grade:</span>
                              <strong className="text-emerald-800 font-bold">{scores.conditionIndex}% (Sound Core)</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Saudi Building Code (SBC):</span>
                              <strong className="text-slate-900">SBC 201/304/601/801 Validated</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">LiDAR Cloud & Precision:</span>
                              <strong className="text-slate-900">4.2M Pts · ±1.2cm Survey Grade</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Licensed Lead SCE Inspector:</span>
                              <strong className="text-slate-900">{asset.inspectorName} (#{asset.inspectorLicense})</strong>
                            </div>
                            <div className="flex justify-between bg-slate-50 border border-slate-200 rounded p-1.5">
                              <span className="text-slate-600">Judicial Clearance Status:</span>
                              <strong className="text-blue-900 font-bold">Enforcement Order #48291 · Cleared</strong>
                            </div>
                          </div>
                        </div>

                        {/* AI-Driven Investment Readiness & Primary Risk Factors Summary */}
                        <CoverPageAISummarySection
                          asset={asset}
                          scores={scores}
                          isArabic={isArabic}
                        />

                        {/* Institutional Accreditation Seals */}
                        <div className="grid grid-cols-3 gap-2 my-2">
                          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-300 text-center">
                            <div className="text-[8.5px] font-bold text-slate-900 flex items-center justify-center gap-1">
                              <Award className="w-3 h-3 text-amber-600" />
                              <span>Infath Innovation</span>
                            </div>
                            <div className="text-[7.5px] text-slate-500 mt-0.5">
                              Accredited Liquidation Twin
                            </div>
                          </div>

                          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-300 text-center">
                            <div className="text-[8.5px] font-bold text-slate-900 flex items-center justify-center gap-1">
                              <BadgeCheck className="w-3 h-3 text-cyan-700" />
                              <span>Saudi Council of Engineers</span>
                            </div>
                            <div className="text-[7.5px] text-slate-500 mt-0.5">
                              Certified Technical Inspection
                            </div>
                          </div>

                          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-300 text-center">
                            <div className="text-[8.5px] font-bold text-slate-900 flex items-center justify-center gap-1">
                              <Scale className="w-3 h-3 text-emerald-700" />
                              <span>Taqeem Accredited</span>
                            </div>
                            <div className="text-[7.5px] text-slate-500 mt-0.5">
                              Real Estate Valuation Standard
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Cryptographic Provenance & Footer */}
                      <div className="border-t-2 border-slate-900 pt-2 mt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-slate-100 border border-slate-300 rounded-lg p-0.5 flex items-center justify-center">
                              <QrCode className="w-9 h-9 text-slate-900" />
                            </div>
                            <div className="text-[8.5px] text-slate-600">
                              <div className="font-bold text-slate-900">Cryptographic Due Diligence QR & Audit Seal</div>
                              <div>Scan for interactive BIM 3D viewer & raw sensor telemetry</div>
                              <div className="font-mono text-[7.5px] text-slate-500 mt-0.5">
                                Merkle Root: {mockSha256.slice(0, 24)}...
                              </div>
                            </div>
                          </div>

                          <div className="text-end">
                            <div className="text-[8.5px] font-mono font-bold text-slate-900 uppercase">
                              Security Stamp: VERIFIED · GENUINE
                            </div>
                            <div className="text-[7.5px] text-slate-500">
                              Official Infath Liquidation Passport · Page 1 of 4
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ════ PAGE 2: EXECUTIVE CERTIFICATE & LIQUIDATION DOSSIER ════ */}
                  {activePage === 2 && (
                    <div className="relative z-10 flex flex-col justify-between flex-1">
                      {/* Top Header */}
                      <div>
                        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center p-2 text-cyan-400 shadow-md">
                              <MiraahLogo size={36} showSubtitle={false} />
                            </div>
                            <div>
                              <div className="text-xl font-extrabold tracking-tight text-slate-950">
                                MIRAAH · مرآة
                              </div>
                              <div className="text-[11px] font-bold text-cyan-700 tracking-wider uppercase">
                                Spatial Asset Intelligence & Liquidation Readiness
                              </div>
                            </div>
                          </div>

                          <div className="text-end">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-[11px] font-bold text-slate-800">
                              <Award className="w-3.5 h-3.5 text-amber-600" />
                              <span>مبادرة ابتكار إنفاذ · Infath Innovation</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-1">
                              Doc Ref: INFATH-DSP-{asset.id}-2026
                            </div>
                          </div>
                        </div>

                        {/* Title Banner */}
                        <div className="my-6 text-center">
                          <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-800 uppercase bg-cyan-50 px-3 py-1 rounded-md border border-cyan-200">
                            OFFICIAL ACCREDITED DUE DILIGENCE DOSSIER
                          </span>
                          <h1 className="text-2xl font-black text-slate-950 mt-2">
                            {asset.name}
                          </h1>
                          <p className="text-xs text-slate-600 mt-1 font-arabic">
                            {asset.nameArabic} · {asset.location}
                          </p>
                        </div>

                        {/* Executive KPI Grid */}
                        <div className="grid grid-cols-4 gap-3 my-5">
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Readiness Score
                            </div>
                            <div className="text-2xl font-black text-cyan-700 mt-0.5">
                              {scores.liquidationReadiness}%
                            </div>
                            <div className="text-[9px] font-semibold text-cyan-800 bg-cyan-100/60 rounded px-1 mt-1">
                              Tier-1 Liquidation
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Condition Index
                            </div>
                            <div className="text-2xl font-black text-emerald-700 mt-0.5">
                              {scores.conditionIndex}%
                            </div>
                            <div className="text-[9px] font-semibold text-emerald-800 bg-emerald-100/60 rounded px-1 mt-1">
                              Sound Structure
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Spatial Coverage
                            </div>
                            <div className="text-2xl font-black text-blue-700 mt-0.5">
                              {scores.coveragePct}%
                            </div>
                            <div className="text-[9px] font-semibold text-blue-800 bg-blue-100/60 rounded px-1 mt-1">
                              Drone & 3D LiDAR
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              AI Confidence
                            </div>
                            <div className="text-2xl font-black text-indigo-700 mt-0.5">
                              {scores.inspectionConfidence}%
                            </div>
                            <div className="text-[9px] font-semibold text-indigo-800 bg-indigo-100/60 rounded px-1 mt-1">
                              Multi-Sensor Validated
                            </div>
                          </div>
                        </div>

                        {/* Core Asset Specifications Table */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden my-4 text-xs">
                          <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between items-center">
                            <span>ASSET SPECIFICATIONS & LEGAL IDENTIFICATION</span>
                            <span className="text-[10px] font-mono text-slate-500 font-normal">
                              National Cadastre Reg: #{asset.id}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 text-slate-700">
                            <div className="p-2.5 flex justify-between">
                              <span className="text-slate-500">Asset Category:</span>
                              <span className="font-semibold text-slate-900">{asset.type}</span>
                            </div>
                            <div className="p-2.5 flex justify-between">
                              <span className="text-slate-500">Total Built-Up Area:</span>
                              <span className="font-semibold text-slate-900">{asset.sizeSqm.toLocaleString()} m²</span>
                            </div>
                            <div className="p-2.5 flex justify-between">
                              <span className="text-slate-500">Construction Year:</span>
                              <span className="font-semibold text-slate-900">{asset.buildYear}</span>
                            </div>
                            <div className="p-2.5 flex justify-between">
                              <span className="text-slate-500">Certified Valuation:</span>
                              <span className="font-bold text-emerald-800">{asset.valuationSar.toLocaleString()} SAR</span>
                            </div>
                            <div className="p-2.5 flex justify-between">
                              <span className="text-slate-500">Licensed Inspector:</span>
                              <span className="font-semibold text-slate-900">{asset.inspectorName}</span>
                            </div>
                            <div className="p-2.5 flex justify-between">
                              <span className="text-slate-500">SCE License Ref:</span>
                              <span className="font-mono text-slate-900 font-semibold">{asset.inspectorLicense}</span>
                            </div>
                          </div>
                        </div>

                        {/* Explainability & Infath Clearance Statement */}
                        <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs text-slate-800 my-4 leading-relaxed">
                          <div className="font-bold text-cyan-900 mb-1 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-cyan-700" />
                            <span>EXECUTIVE CLEARANCE & AUCTION TRANSPARENCY RULING</span>
                          </div>
                          <p className="text-slate-700">
                            {scores.explainabilityText}
                          </p>
                        </div>
                      </div>

                      {/* Official Sign-off & QR Seal Footer */}
                      <div className="border-t-2 border-slate-900 pt-4 flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg p-1 flex items-center justify-center">
                            <QrCode className="w-12 h-12 text-slate-800" />
                          </div>
                          <div className="text-[10px] text-slate-600">
                            <div className="font-bold text-slate-900">Cryptographic Verification QR</div>
                            <div>Scan to audit live spatial digital twin & telemetry</div>
                            <div className="font-mono text-[9px] text-slate-400 mt-0.5">
                              Hash: {mockSha256.slice(0, 20)}...
                            </div>
                          </div>
                        </div>

                        <div className="text-end">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            Certified Endorsement
                          </div>
                          <div className="font-serif italic font-bold text-sm text-slate-900 mt-0.5">
                            Eng. Zaid Al-Harthy
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono">
                            Saudi Council of Engineers · {asset.inspectionDate}
                          </div>
                          <div className="text-[8px] text-slate-400 font-mono mt-0.5">
                            Page 2 of 4
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ════ PAGE 3: DEFECT AUDIT & SBC COMPLIANCE ════ */}
                  {activePage === 3 && (
                    <div className="relative z-10 flex flex-col justify-between flex-1">
                      <div>
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-cyan-700 uppercase">
                              SECTION 02 / 04 · TECHNICAL AUDIT
                            </span>
                            <h2 className="text-lg font-bold text-slate-900">
                              Saudi Building Code (SBC) Compliance & Defect Matrix
                            </h2>
                          </div>
                          <div className="text-end text-[10px] text-slate-500 font-mono">
                            Asset #{asset.id} · Page 3
                          </div>
                        </div>

                        {/* SBC Code Breakdown */}
                        <div className="grid grid-cols-2 gap-2.5 my-4">
                          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                              <span>SBC 304: Concrete & Rebar</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                                94% COMPLIANT
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-1">
                              No active corrosion or structural rebar shear cracks detected in core frames.
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                              <span>SBC 601: Thermal & Moisture</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800">
                                ACTION REQUIRED
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-1">
                              Drainage moisture pooling identified on roof deck; remediation estimated at 12,000 SAR.
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                              <span>SBC 801: Fire & Life Safety</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                                100% CLEAR
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-1">
                              Emergency egress paths unobstructed, fire damper assemblies verified.
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                              <span>SBC 201: Architectural & Egress</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                                98% COMPLIANT
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-1">
                              Facade alignments within tolerance (+3.2mm max deviation vs BIM model).
                            </p>
                          </div>
                        </div>

                        {/* Defect Itemization Table */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden my-3 text-xs">
                          <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between items-center">
                            <span>ITEMIZED AI FINDINGS LOG ({asset.findings.length} TOTAL)</span>
                            <span className="text-[10px] font-mono text-slate-500">
                              Traceable Evidence
                            </span>
                          </div>

                          <div className="divide-y divide-slate-200">
                            {asset.findings.map((f, idx) => (
                              <div key={f.id} className="p-3 flex items-start justify-between gap-3 text-xs">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">
                                      #{idx + 1} {f.type}
                                    </span>
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                                        f.severity === "Critical"
                                          ? "bg-red-100 text-red-800"
                                          : f.severity === "Moderate"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {f.severity}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      Area: {f.area}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 text-[11px] leading-tight">
                                    {f.description}
                                  </p>
                                  <p className="text-cyan-800 text-[10px] font-medium">
                                    Rx: {f.recommendation}
                                  </p>
                                </div>

                                <div className="text-end shrink-0">
                                  <div className="font-mono font-bold text-slate-900">
                                    {f.conf}% Conf
                                  </div>
                                  <span
                                    className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mt-1 ${
                                      f.isResolved
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {f.isResolved ? "Resolved" : "Pending Action"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Page 3 Footer */}
                      <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>MIRAAH Spatial AI Engine v2.4</span>
                        <span>Audited under Saudi Arbitration & Enforcement Law</span>
                        <span>Page 3 of 4</span>
                      </div>
                    </div>
                  )}

                  {/* ════ PAGE 4: PHOTOGRAPHIC EVIDENCE & BLOCKCHAIN PROVENANCE ════ */}
                  {activePage === 4 && (
                    <div className="relative z-10 flex flex-col justify-between flex-1">
                      <div>
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-cyan-700 uppercase">
                              SECTION 03 / 04 · SPATIAL TRACEABILITY & EVIDENCE
                            </span>
                            <h2 className="text-lg font-bold text-slate-900">
                              Visual Proof, Drone Telemetry & Blockchain Log
                            </h2>
                          </div>
                          <div className="text-end text-[10px] text-slate-500 font-mono">
                            Asset #{asset.id} · Page 4
                          </div>
                        </div>

                        {/* Evidence Photos Grid */}
                        <div className="grid grid-cols-2 gap-3 my-4">
                          {asset.findings[0]?.evidence[0] && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50">
                              <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900 mb-2">
                                <img
                                  src={asset.findings[0].evidence[0].frameUrl}
                                  alt="Evidence Frame"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-cyan-300 border border-cyan-500/40">
                                  Frame #{asset.findings[0].evidence[0].id} · {asset.findings[0].evidence[0].timestampFormatted}
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-amber-500 text-[9px] font-bold text-slate-950">
                                  {asset.findings[0].evidence[0].confidence}% AI Conf
                                </div>
                              </div>
                              <div className="text-[11px] font-bold text-slate-900">
                                {asset.findings[0].evidence[0].cameraAngle}
                              </div>
                              <p className="text-[10px] text-slate-600 mt-0.5">
                                {asset.findings[0].evidence[0].notes}
                              </p>
                            </div>
                          )}

                          {asset.heroImage && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50">
                              <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900 mb-2">
                                <img
                                  src={asset.heroImage}
                                  alt="Asset Facade"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-cyan-300 border border-cyan-500/40">
                                  Autonomous Drone Aerial Survey
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-[9px] font-bold text-white">
                                  98% Photogrammetry Match
                                </div>
                              </div>
                              <div className="text-[11px] font-bold text-slate-900">
                                Exterior Envelope & Orthomosaic 3D Scan
                              </div>
                              <p className="text-[10px] text-slate-600 mt-0.5">
                                Calibrated under RTK-GPS with ±1.2cm spatial precision.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Blockchain Hash Verification Log */}
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-mono my-3 space-y-1.5">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>BLOCKCHAIN IMMUTABLE AUDIT TRAIL</span>
                          </div>
                          <div className="text-[10px] text-slate-600 divide-y divide-slate-200">
                            <div className="py-1 flex justify-between">
                              <span className="text-slate-500">Smart Contract:</span>
                              <span className="text-slate-800">0x71C9...89b4 (InfathRegistryV2)</span>
                            </div>
                            <div className="py-1 flex justify-between">
                              <span className="text-slate-500">Block Number:</span>
                              <span className="text-slate-800">#19,842,109</span>
                            </div>
                            <div className="py-1 flex justify-between">
                              <span className="text-slate-500">Payload Merkle Root:</span>
                              <span className="text-slate-800">{mockSha256}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Page 4 Footer */}
                      <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Tamper-evident verification certified</span>
                        <span>End of Certified Due Diligence Dossier</span>
                        <span>Page 4 of 4</span>
                      </div>
                    </div>
                  )}
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


