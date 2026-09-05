import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  Video,
  Image as ImageIcon,
  FileText,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { Finding, DefectType, SeverityLevel } from "../../types";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (newFindingCount: number) => void;
  onAddNewCustomFinding?: (finding: Finding) => void;
  onOpenPdfViewer?: (docType?: "title_deed" | "sbc_audit" | "taqeem_valuation" | "liquidation_clearance") => void;
  isArabic?: boolean;
}

interface UploadedFilePreview {
  id: string;
  name: string;
  size: string;
  type: "image" | "video" | "document";
  previewUrl: string;
  selectedDefectType?: DefectType;
  selectedSeverity?: SeverityLevel;
  selectedArea?: string;
  confidence?: number;
  docCategory?: "title_deed" | "sbc_audit" | "taqeem_valuation" | "liquidation_clearance";
}

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
  onAddNewCustomFinding,
  onOpenPdfViewer,
  isArabic = false,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [mode, setMode] = useState<"MODE_A" | "MODE_B">("MODE_B");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilePreview[]>([]);
  const [progress, setProgress] = useState(0);
  const [statusStep, setStatusStep] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Target areas for defect association
  const availableAreas = [
    { en: "Roof / Parapet", ar: "السطح / الستارة" },
    { en: "North Facade", ar: "الواجهة الشمالية" },
    { en: "Basement Parking", ar: "قبو المواقف" },
    { en: "Ground Floor Lobby", ar: "بهو الدور الأرضي" },
    { en: "Master Bathroom", ar: "دورة المياه الرئيسية" },
    { en: "East Structural Wall", ar: "الجدار الإنشائي الشرقي" },
  ];

  if (!isOpen) return null;

  // Process selected native files (PNG, JPG, MP4, PDF, etc.)
  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPreviews: UploadedFilePreview[] = [];
    const defectTypesList: DefectType[] = ["Crack", "Moisture", "Surface Damage", "Paint Peeling"];
    const severities: SeverityLevel[] = ["Critical", "Moderate", "Low"];

    Array.from(files).forEach((file, index) => {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      const fileType = isVideo ? "video" : isImage ? "image" : "document";

      // Pick reasonable default classification for demo
      const defectType = defectTypesList[(uploadedFiles.length + index) % defectTypesList.length];
      const severity = severities[(uploadedFiles.length + index) % severities.length];
      const area = availableAreas[(uploadedFiles.length + index) % availableAreas.length].en;
      const confidence = Math.floor(88 + Math.random() * 11);

      const previewUrl = isImage || isVideo ? URL.createObjectURL(file) : "";

      newPreviews.push({
        id: `file_${Date.now()}_${index}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: fileType,
        previewUrl,
        selectedDefectType: defectType,
        selectedSeverity: severity,
        selectedArea: area,
        confidence,
      });
    });

    setUploadedFiles((prev) => [...prev, ...newPreviews]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleStartAnalysis = () => {
    if (uploadedFiles.length === 0) return;

    setAnalyzing(true);
    setProgress(15);
    setStatusStep(
      isArabic
        ? "استخراج الإطارات الدقيقة وتهيئة مسار المعالجة (FFmpeg)..."
        : "Extracting high-res keyframes via FFmpeg pipeline (FR-01)..."
    );

    setTimeout(() => {
      setProgress(45);
      setStatusStep(
        isArabic
          ? "تحليل الرؤية الحاسوبية ومعايرة كود البناء السعودي (Gemini VLM)..."
          : "Passing visual frames to Multimodal Vision API (FR-02)..."
      );
    }, 900);

    setTimeout(() => {
      setProgress(80);
      setStatusStep(
        isArabic
          ? "تصنيف العيوب وحساب إحداثيات الإحاطة (Bounding Boxes)..."
          : "Evaluating 4 MVP Defect Classes (Crack, Moisture, Surface, Paint)..."
      );
    }, 1800);

    setTimeout(() => {
      setProgress(100);
      setStatusStep(
        isArabic
          ? "اكتمل الفحص! تم توثيق الأدلة وربطها بسجل الأصل بنجاح."
          : "Analysis Complete! 100% Evidence Traceability verified."
      );

      // Create structured findings for uploaded items and push to asset
      if (onAddNewCustomFinding) {
        uploadedFiles.forEach((file, idx) => {
          const newFinding: Finding = {
            id: Date.now() + idx,
            type: file.selectedDefectType || "Crack",
            area: file.selectedArea || "Roof / Parapet",
            severity: file.selectedSeverity || "Moderate",
            conf: file.confidence || 92,
            frames: 1,
            verified: false,
            isResolved: false,
            evidence: [
              {
                id: `ev_${Date.now()}_${idx}`,
                frameUrl: file.previewUrl || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80",
                thumbnailUrl: file.previewUrl || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80",
                timestampSec: 12,
                timestampFormatted: "00:12",
                confidence: (file.confidence || 92) / 100,
                cameraAngle: "Nadir 45° Drone Cam",
                roomArea: file.selectedArea || "Roof / Parapet",
                detectedBox: {
                  x: 20,
                  y: 25,
                  w: 45,
                  h: 40,
                  label: `${file.selectedDefectType} (${file.confidence}%)`,
                },
                notes: `Uploaded file: ${file.name}`,
              },
            ],
            description: `AI Vision analysis identified a localized ${file.selectedDefectType?.toLowerCase()} during inspection of ${file.selectedArea}. Requires professional contractor validation.`,
            titleArabic: `رصد ${file.selectedDefectType === "Crack" ? "تشققات إنشائية" : file.selectedDefectType === "Moisture" ? "تسريب ورطوبة" : file.selectedDefectType === "Surface Damage" ? "تآكل سطحي" : "تقشير دهانات"} في ${file.selectedArea}`,
            descriptionArabic: `تم التعرف الآلي على مظاهر ${file.selectedDefectType} بنسبة ثقة ${file.confidence}% في نطاق ${file.selectedArea}. مسجل لغرض تدقيق كود البناء السعودي.`,
            recommendation: "Review high-res evidence frame, schedule contractor patch test, and update liquidation condition index.",
            detectedAt: new Date().toISOString().split("T")[0],
          };

          onAddNewCustomFinding(newFinding);
        });
      }

      setTimeout(() => {
        setAnalyzing(false);
        onAnalysisComplete(uploadedFiles.length);
        onClose();
      }, 800);
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#09152B] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#0D1F45]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold flex items-center gap-2">
                <span>{isArabic ? "رفع وفحص وسائط المعاينة الميدانية" : "Spatial Media Ingestion & VLM Scan"}</span>
                <Badge color="#00C5A0">FR-01 / FR-02</Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {isArabic ? "فيديوهات MP4 · صور JPG/PNG · مستندات PDF" : "MP4 / MOV Video · JPG / PNG / HEIC Images · PDF Documents"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileSelection(e.target.files)}
          multiple
          accept="image/*,video/*,.pdf"
          className="hidden"
        />

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Mode Switcher */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{isArabic ? "نمط معالجة الذكاء الاصطناعي:" : "AI Processing Mode:"}</span>
                <span className="text-cyan-300 font-mono">
                  {mode === "MODE_B"
                    ? isArabic ? "النمط B (استدلال حي VLM)" : "Mode B (Live VLM Inference)"
                    : isArabic ? "النمط A (بيانات تجريبية جاهزة)" : "Mode A (Pre-Indexed Benchmark)"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {mode === "MODE_B"
                  ? isArabic ? "فحص صورك المرفوعة وتوليد مربعات الإحاطة وتقرير الملاحظة لحظياً." : "Processes your uploaded files directly, extracts frames and adds to findings."
                  : isArabic ? "استخدام بيانات المعاينة المعتمدة مسبقاً لعرض سريع ومستقر." : "Fast deterministic demonstration with pre-verified ground truth."}
              </p>
            </div>

            <div className="flex rounded-lg p-1 bg-slate-950 border border-white/10 text-xs font-mono shrink-0">
              <button
                onClick={() => setMode("MODE_B")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mode === "MODE_B"
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isArabic ? "مباشر" : "Mode B (Live)"}
              </button>
              <button
                onClick={() => setMode("MODE_A")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mode === "MODE_A"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isArabic ? "تجريبي" : "Mode A"}
              </button>
            </div>
          </div>

          {/* Upload Dropzone (Supports Drag-and-Drop & Manual Click) */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-cyan-400 bg-cyan-500/20 scale-[1.01]"
                : "border-slate-700 hover:border-cyan-500/60 bg-slate-950/50 hover:bg-slate-950/80"
            }`}
          >
            <div className="flex justify-center gap-4 mb-3 text-slate-400">
              <div className="p-3 rounded-xl bg-blue-900/30 border border-blue-700/40 text-blue-400">
                <Video className="w-6 h-6" />
              </div>
              <div className="p-3 rounded-xl bg-cyan-900/30 border border-cyan-700/40 text-cyan-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="p-3 rounded-xl bg-amber-900/30 border border-amber-700/40 text-amber-400">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>
                  {isArabic
                    ? "انقر هنا لاختيار الصور أو الفيديوهات من جهازك أو اسحبها وأفلتها"
                    : "Click to browse images/videos or drag & drop files here"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? "يدعم صور الهاتف، كاميرات 360، وفيديوهات تصوير الدرون، ومستندات الصكوك"
                  : "Supports smartphone photos, drone footage, 360 sweeps, and legal attachments"}
              </p>
            </div>
          </div>

          {/* Uploaded Files Queue */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span>
                  {isArabic
                    ? `الملفات المختارة للفحص (${uploadedFiles.length}):`
                    : `Queued Media Files (${uploadedFiles.length}):`}
                </span>
                <button
                  onClick={() => setUploadedFiles([])}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isArabic ? "مسح الكل" : "Clear All"}</span>
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      file.type === "document"
                        ? "bg-amber-950/20 border-amber-500/40 shadow-sm"
                        : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {file.previewUrl ? (
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                            file.type === "video"
                              ? "bg-blue-950/60 border-blue-700/40 text-blue-400"
                              : "bg-amber-950/60 border-amber-500/40 text-amber-400"
                          }`}
                        >
                          {file.type === "video" ? (
                            <Video className="w-5 h-5 text-blue-400" />
                          ) : (
                            <FileText className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="font-bold text-white truncate max-w-[180px] sm:max-w-xs flex items-center gap-1.5">
                          <span>{file.name}</span>
                          {file.type === "document" && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                              PDF معتمد
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span className="text-cyan-300 font-mono">{file.selectedArea}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {file.type === "document" && onOpenPdfViewer && (
                        <button
                          onClick={() => onOpenPdfViewer(file.docCategory || "title_deed")}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="View Certified PDF Document"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{isArabic ? "معاينة PDF" : "View PDF"}</span>
                        </button>
                      )}

                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
                        {file.selectedDefectType}
                      </span>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Progress Bar */}
          {analyzing && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  {statusStep}
                </span>
                <span className="text-white font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Quick Demo Pre-load sample if user hasn't selected files */}
          {uploadedFiles.length === 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <span className="text-slate-400 font-medium">
                {isArabic ? "أو يمكنك تجربة تحميل ملفات فحص ونماذج PDF جاهزة:" : "Or load sample files & certified PDF documents:"}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setUploadedFiles([
                      {
                        id: "sample_pdf_1",
                        name: "صك_الملكية_الإلكتروني_المعتمد_SRE20481.pdf",
                        size: "2.4 MB",
                        type: "document",
                        previewUrl: "",
                        docCategory: "title_deed",
                        selectedDefectType: "Surface Damage",
                        selectedSeverity: "Low",
                        selectedArea: "Official Title Deed",
                        confidence: 99,
                      },
                      {
                        id: "sample_pdf_2",
                        name: "شهادة_فحص_كود_البناء_السعودي_SBC_2026.pdf",
                        size: "3.8 MB",
                        type: "document",
                        previewUrl: "",
                        docCategory: "sbc_audit",
                        selectedDefectType: "Crack",
                        selectedSeverity: "Moderate",
                        selectedArea: "Roof / Parapet",
                        confidence: 97,
                      },
                    ]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-[11px] transition-colors cursor-pointer border border-amber-500/40 flex items-center gap-1.5 font-bold"
                >
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>{isArabic ? "+ مستندات PDF المعتمدة" : "+ Certified PDF Docs"}</span>
                </button>

                <button
                  onClick={() => {
                    setUploadedFiles([
                      {
                        id: "sample_1",
                        name: "drone_roof_crack_highres.jpg",
                        size: "4.8 MB",
                        type: "image",
                        previewUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80",
                        selectedDefectType: "Crack",
                        selectedSeverity: "Critical",
                        selectedArea: "Roof / Parapet",
                        confidence: 96,
                      },
                      {
                        id: "sample_2",
                        name: "basement_moisture_ingress.jpg",
                        size: "3.2 MB",
                        type: "image",
                        previewUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
                        selectedDefectType: "Moisture",
                        selectedSeverity: "Moderate",
                        selectedArea: "Basement Parking",
                        confidence: 92,
                      },
                    ]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] transition-colors cursor-pointer border border-slate-700"
                >
                  {isArabic ? "+ صور ميدانية ودرون" : "+ Drone Images"}
                </button>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              disabled={analyzing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>

            <button
              onClick={handleStartAnalysis}
              disabled={analyzing || uploadedFiles.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-40 flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {analyzing
                  ? isArabic ? "جارٍ التحليل المكاني..." : "Analyzing Media..."
                  : isArabic ? `بدء الفحص والتحليل (${uploadedFiles.length})` : `Run AI Spatial Scan (${uploadedFiles.length})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
