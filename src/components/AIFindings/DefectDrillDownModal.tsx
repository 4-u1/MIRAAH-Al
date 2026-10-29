import React, { useState } from "react";
import { Finding, EvidenceFrame } from "../../types";
import { Badge } from "../common/Badge";
import { useTheme } from "../../context/ThemeContext";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Camera,
  MapPin,
  Sparkles,
  Layers,
  Wrench,
  DollarSign,
  Clock,
  CheckCircle2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  FileText,
  Activity,
  Sliders,
  Cpu,
  CornerDownRight,
  Printer,
  ChevronLeft,
  ChevronRight,
  Tag,
  Crosshair,
  Compass,
  Flame,
} from "lucide-react";

interface DefectDrillDownModalProps {
  finding: Finding | null;
  onClose: () => void;
  onToggleVerification: (findingId: number) => void;
  onToggleResolved: (findingId: number) => void;
  onUpdateNotes?: (findingId: number, notes: string) => void;
  isArabic?: boolean;
}

type ViewFilterMode = "ai" | "raw" | "thermal" | "contour";

export const DefectDrillDownModal: React.FC<DefectDrillDownModalProps> = ({
  finding,
  onClose,
  onToggleVerification,
  onToggleResolved,
  onUpdateNotes,
  isArabic = false,
}) => {
  if (!finding) return null;

  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewFilterMode>("ai");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [inspectorNotes, setInspectorNotes] = useState<string>(
    finding.evidence[0]?.notes || ""
  );
  const [notesSaved, setNotesSaved] = useState<boolean>(false);
  const { isDark } = useTheme();

  const frames = finding.evidence && finding.evidence.length > 0 ? finding.evidence : [];
  const currentFrame: EvidenceFrame | undefined = frames[activeFrameIndex] || frames[0];

  // Dynamic Defect Specific Technical Profiles
  const getDefectProfiles = (type: string, severity: string) => {
    switch (type) {
      case "Moisture":
        return {
          code: `MST-W${finding.id}08`,
          dimensions: "1.45 m × 0.35 m (Area: 0.51 m²)",
          depth: "Sub-surface Capillary (4.2 mm into masonry)",
          substrate: "Cementitious Plaster & Gypsum Skirting over Hollow Concrete Block",
          cause: "Capillary moisture ingress via perimeter foundation joint due to adjacent exterior irrigation overflow.",
          structuralRisk: "Non-structural secondary degradation. Poses mold & efflorescence risk if unmitigated.",
          estimatedCostSar: "450 – 750 SAR",
          estimatedHours: "3 – 4 Hours",
          requiredTrade: "Waterproofing & Masonry Injection Specialist",
          readinessImpact: "+4.8% Liquidation Readiness",
          buildingStandard: "SBC 304 (Concrete Structures) & SBC 201 (Architectural)",
          remediationSteps: [
            {
              phase: isArabic ? "المرحلة 1: العزل والتجفيف" : "Phase 1: Source Isolation & Drying",
              desc: isArabic
                ? "إعادة توجيه خطوط الري الخارجية واستخدام مجففات صناعية لخفض رطوبة الجدار لأقل من 12%."
                : "Divert external irrigation sprayers and deploy forced-air dehumidifiers to reduce substrate moisture below 12%.",
              trade: isArabic ? "عزل مائي" : "Waterproofing",
            },
            {
              phase: isArabic ? "المرحلة 2: حقن البوليمر المانع للتسرب" : "Phase 2: Hydrophobic Barrier Injection",
              desc: isArabic
                ? "حقن مادة السيلوكسان العازلة على طول فاصل التقاء الأرضية بالجدار لمنع الرطوبة الشعرية."
                : "Pressure-inject silane-siloxane damp-proof cream along baseboard mortar line to establish continuous moisture barrier.",
              trade: isArabic ? "حقن كيماوي" : "Chemical Injection",
            },
            {
              phase: isArabic ? "المرحلة 3: معالجة الأسطح والدهان المقاوم" : "Phase 3: Replaster & Anti-Efflorescence Coat",
              desc: isArabic
                ? "إزالة طبقة الجبس المتضررة وإعادة التلييس بمونة إسمنتية معالجة متبوعة بدهان مائي تنفسي."
                : "Scrape damaged gypsum, apply anti-efflorescence neutralizing primer, and refinish with breathable elastomeric paint.",
              trade: isArabic ? "تشطيب ودهان" : "Finishing & Coating",
            },
            {
              phase: isArabic ? "المرحلة 4: فحص المطابقة والتوثيق" : "Phase 4: Pin-Probe Verification & Re-Scan",
              desc: isArabic
                ? "قياس نسبة الرطوبة بمسبار رقمي وإجراء مسح ثلاثي الأبعاد للتأكد من جفاف المنطقة وإغلاق الملاحظة."
                : "Perform digital pin-probe moisture verification (<10%) and upload 3D verification keyframe to update Asset Passport.",
              trade: isArabic ? "مفتش معتمد" : "SCE Inspector",
            },
          ],
        };
      case "Crack":
        return {
          code: `CRK-C${finding.id}42`,
          dimensions: "Length: 1.85 m · Crack Width: 0.75 mm",
          depth: "Surface Settlement (Gypsum drywall joint seam)",
          substrate: "Gypsum Drywall Board & Galvanized Stud Frame",
          cause: "Differential settlement and seasonal thermal contraction along structural expansion joint.",
          structuralRisk: "Cosmetic / Architectural joint settlement. No primary shear structural defect observed.",
          estimatedCostSar: "350 – 550 SAR",
          estimatedHours: "2 – 3 Hours",
          requiredTrade: "Drywall & Plastering Contractor",
          readinessImpact: "+3.5% Liquidation Readiness",
          buildingStandard: "SBC 201 Section 12 (Interior Finishes)",
          remediationSteps: [
            {
              phase: isArabic ? "المرحلة 1: تهيئة وتوسيع الفاصل" : "Phase 1: V-Groove Channel Preparation",
              desc: isArabic
                ? "حفر مسار الشق على شكل حرف V بعمق 3 مم لإزالة الجزيئات المتخلخلة وتهيئة مساحة التماسك."
                : "Rake crack into a shallow V-groove (3mm depth), remove dust, and apply stabilizing acrylic bonding agent.",
              trade: isArabic ? "تهيئة أسطح" : "Surface Prep",
            },
            {
              phase: isArabic ? "المرحلة 2: شريط فايبر جلاس ومادة الحشو" : "Phase 2: Mesh Reinforcement & Flexible Filler",
              desc: isArabic
                ? "تثبيت شريط ألياف زجاجية ذاتي الالتصاق وحشو الفاصل بمعجون إيبوكسي مرن يمتص التمدد."
                : "Embed heavy-duty fiberglass mesh tape and fill with elastomeric acrylic joint compound allowing micro-movements.",
              trade: isArabic ? "معالجة شقوق" : "Joint Treatment",
            },
            {
              phase: isArabic ? "المرحلة 3: السنفرة والدهان المطابق" : "Phase 3: Feather Sanding & Color-Matched Repaint",
              desc: isArabic
                ? "سنفرة ناعمة بحبيبات P220 وتطبيق طبقة أساس مع دهان مطابق للون السقف الأصلي."
                : "Feather edges with 220-grit orbital sander, apply primer-sealer, and roll two coats of ultra-flat ceiling emulsion.",
              trade: isArabic ? "دهان معماري" : "Painting",
            },
            {
              phase: isArabic ? "المرحلة 4: التحقق من استقرار الشق" : "Phase 4: Tell-Tale Crack Gauge Sign-off",
              desc: isArabic
                ? "فحص استواء السطح ومطابقة التقرير مع معايير كود البناء السعودي لإغلاق الملاحظة."
                : "Verify zero optical displacement under tangential spotlighting and sign off SCE compliance record.",
              trade: isArabic ? "فحص الجودة" : "QA Sign-off",
            },
          ],
        };
      case "Surface Damage":
        return {
          code: `SFD-K${finding.id}19`,
          dimensions: "Defect Zone: 24 mm × 18 mm (Depth: 2.1 mm)",
          depth: "Glaze & Biscuit Spall (Porcelain Layer)",
          substrate: "High-Traffic Porcelain Tile (Full Body 60×60 cm)",
          cause: "Localized point impact from dropped heavy utensil during kitchen operations.",
          structuralRisk: "Cosmetic floor defect. Minor water ingress risk through exposed tile biscuit.",
          estimatedCostSar: "250 – 400 SAR",
          estimatedHours: "1 – 2 Hours",
          requiredTrade: "Tile Restoration & Masonry Specialist",
          readinessImpact: "+2.2% Liquidation Readiness",
          buildingStandard: "SBC 304 & ISO 10545 Ceramic Standard",
          remediationSteps: [
            {
              phase: isArabic ? "المرحلة 1: تنظيف الحفرة وإزالة الشوائب" : "Phase 1: Degreasing & Cavity Preparation",
              desc: isArabic
                ? "تنظيف موقع الكسر بمذيب كحولي وإزالة الحبيبات الحرة لضمان التصاق تام."
                : "Clean fractured porcelain cavity with isopropanol solvent and remove micro-shards.",
              trade: isArabic ? "تنظيف فني" : "Preparation",
            },
            {
              phase: isArabic ? "المرحلة 2: حشو الراتنج الملون المقوى" : "Phase 2: UV-Cured Color-Matched Resin Fill",
              desc: isArabic
                ? "خلط راتنج الأكريليك المعالج بالأشعة فوق البنفسجية ليتطابق تماماً مع تموجات البورسلان."
                : "Compound color-matched photopolymer ceramic resin, inject into chip cavity, and cure with UV lamp (395nm).",
              trade: isArabic ? "ترميم خزفي" : "Restoration",
            },
            {
              phase: isArabic ? "المرحلة 3: الصقل والتلميع السطحي" : "Phase 3: Diamond Polishing & Lustre Matching",
              desc: isArabic
                ? "صقل الحشوة بأقراص ألماسية (حتى 3000 حبيبة) لتتساوى مع مستوى البلاط المحيط."
                : "Wet-sand with graduated diamond micro-pads (up to 3000 grit) to match adjacent satin/gloss sheen.",
              trade: isArabic ? "تلميع ميكانيكي" : "Polishing",
            },
            {
              phase: isArabic ? "المرحلة 4: الاعتماد النهائي" : "Phase 4: Scratch & Water Repellency Test",
              desc: isArabic
                ? "اختبار مقاومة السائل والخدش لضمان عدم تسرب المياه تحت البلاط."
                : "Verify hydrophobic seal and log resolution in asset maintenance ledger.",
              trade: isArabic ? "فحص الجودة" : "Quality Sign-off",
            },
          ],
        };
      default: // Paint Peeling
        return {
          code: `PNT-C${finding.id}91`,
          dimensions: "Peel Zone: 0.65 m × 0.40 m",
          depth: "Topcoat Delamination (Latex acrylic coat)",
          substrate: "Plasterboard primed with standard PVA sealer",
          cause: "Thermal cycle condensation from air conditioning supply register causing adhesive failure.",
          structuralRisk: "Cosmetic paint flaking. No moisture depth detected in drywall core.",
          estimatedCostSar: "200 – 350 SAR",
          estimatedHours: "1.5 – 2 Hours",
          requiredTrade: "Interior Painter / Decorator",
          readinessImpact: "+2.0% Liquidation Readiness",
          buildingStandard: "SBC 201 Interior Architectural Finishes",
          remediationSteps: [
            {
              phase: isArabic ? "المرحلة 1: كشط القشور وعزل الدكت" : "Phase 1: Scraping & Diffuser Deflection",
              desc: isArabic
                ? "كشط جميع القشور المتخلخلة وتعديل زعانف فتحة التكييف لمنع توجيه الهواء البارد المباشر للجدار."
                : "Scrape all loose and blistering paint back to sound edge, adjust AC diffuser blades to avoid direct impingement.",
              trade: isArabic ? "تهيئة الأسطح" : "Surface Prep",
            },
            {
              phase: isArabic ? "المرحلة 2: دهان الأساس المعزول" : "Phase 2: High-Adhesion Oil-Based Primer",
              desc: isArabic
                ? "تطبيق طبقة برايمر عازل للرطوبة وسريع الجفاف لسد مسام المعجون."
                : "Apply breathable moisture-barrier synthetic primer to prevent future vapor delamination.",
              trade: isArabic ? "تأسيس ودهان" : "Priming",
            },
            {
              phase: isArabic ? "المرحلة 3: طبقتي دهان أكريليك حريري" : "Phase 3: Color-Matched Silk Emulsion (2 Coats)",
              desc: isArabic
                ? "تطبيق وجهين من الدهان الحريري المتطابق كودياً مع كود لون الغرفة بواسطة رول مايكروفايبر."
                : "Apply two coats of premium scrub-resistant silk acrylic paint using short-pile microfiber roller.",
              trade: isArabic ? "دهان نهائي" : "Topcoat",
            },
            {
              phase: isArabic ? "المرحلة 4: توثيق الإغلاق الرقمي" : "Phase 4: Visual Uniformity Inspection",
              desc: isArabic
                ? "فحص تجانس اللون وعدم وجود فروقات ضوئية واعتماد إغلاق الملاحظة في منصة مرآة."
                : "Confirm color consistency under 5000K daylight lighting and archive completion evidence in MIRAAH.",
              trade: isArabic ? "اعتماد رسمي" : "Verification",
            },
          ],
        };
    }
  };

  const profile = getDefectProfiles(finding.type, finding.severity);

  const sevColors = {
    Critical: "#EF4444",
    Moderate: "#F59E0B",
    Low: "#22C55E",
  };

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(finding.id, inspectorNotes);
    }
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto ${
      isDark ? "bg-black/85" : "bg-slate-900/60"
    }`}>
      <div
        className={`relative w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh] border transition-colors ${
          isDark
            ? "bg-[#080B12] border-white/[0.15] text-white shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
            : "bg-white border-slate-200 text-slate-900 shadow-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Monalith Modal Top Bar ── */}
        <div className={`flex items-center justify-between px-6 py-4 border-b backdrop-blur-md ${
          isDark
            ? "border-white/[0.1] bg-[#05070D]/95 text-white"
            : "border-slate-200 bg-slate-50/95 text-slate-900"
        }`}>
          {/* Left: Defect Identity */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`p-2.5 rounded-lg border ${
              isDark
                ? "bg-white/[0.05] border-white/[0.1] text-[#00E5B9]"
                : "bg-teal-50 border-teal-200 text-teal-700"
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`font-display font-black text-base sm:text-lg uppercase tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {finding.type} — {finding.area}
                </span>

                <Badge
                  color={sevColors[finding.severity]}
                  size="sm"
                  variant="mono"
                >
                  {finding.severity.toUpperCase()} PRIORITY
                </Badge>

                {finding.verified ? (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
                    isDark
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                      : "bg-emerald-50 text-emerald-800 border-emerald-300"
                  }`}>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    SCE VERIFIED
                  </span>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
                    isDark
                      ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                  }`}>
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    NEEDS REVIEW
                  </span>
                )}

                {finding.isResolved && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    isDark
                      ? "bg-blue-950/60 text-blue-300 border-blue-500/40"
                      : "bg-blue-50 text-blue-800 border-blue-300"
                  }`}>
                    RESOLVED ✓
                  </span>
                )}
              </div>

              <div className={`flex items-center gap-3 font-mono text-[10px] mt-1 flex-wrap ${
                isDark ? "text-[#64748B]" : "text-slate-500"
              }`}>
                <span className={isDark ? "text-[#00E5B9]" : "text-teal-700 font-bold"}>
                  ID: #{String(finding.id).padStart(3, "0")}
                </span>
                <span>·</span>
                <span>CODE: {profile.code}</span>
                <span>·</span>
                <span>VLM CONFIDENCE: {finding.conf}%</span>
                <span>·</span>
                <span>DETECTED: {finding.detectedAt}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Close & Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReport}
              className={`p-2 rounded-lg border transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? "bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.1] text-[#94A3B8] hover:text-white"
                  : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950 shadow-sm"
              }`}
              title="Print Defect Dossier"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">PRINT DOSSIER</span>
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? "text-[#94A3B8] hover:text-white hover:bg-white/[0.1]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Modal Main Scrollable Content ── */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* SECTION 1: PHOTOGRAPHIC EVIDENCE ENGINE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00E5B9] font-bold">
                <Camera className="w-4 h-4" />
                <span>{isArabic ? "الدليل الفوتوغرافي عالي الدقة (FR-04)" : "ORIGINAL PHOTOGRAPHIC EVIDENCE & VLM MAPPINGS"}</span>
              </div>

              {/* Viewport Modes */}
              <div className={`flex items-center gap-1.5 border rounded-lg p-1 font-mono text-[10px] ${
                isDark ? "bg-[#04060A] border-white/[0.1]" : "bg-slate-100 border-slate-300"
              }`}>
                <button
                  onClick={() => setViewMode("ai")}
                  className={`px-3 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === "ai"
                      ? isDark
                        ? "bg-[#00E5B9] text-[#050B14] font-black shadow-[0_0_10px_rgba(0,229,185,0.3)]"
                        : "bg-teal-600 text-white font-black shadow-sm"
                      : isDark
                      ? "text-[#94A3B8] hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Crosshair className="w-3 h-3" />
                  <span>AI OVERLAY</span>
                </button>
                <button
                  onClick={() => setViewMode("raw")}
                  className={`px-3 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === "raw"
                      ? isDark
                        ? "bg-white text-black font-black"
                        : "bg-slate-800 text-white font-black shadow-sm"
                      : isDark
                      ? "text-[#94A3B8] hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>RAW PHOTO</span>
                </button>
                <button
                  onClick={() => setViewMode("thermal")}
                  className={`px-3 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === "thermal"
                      ? "bg-[#F59E0B] text-black font-black"
                      : isDark
                      ? "text-[#94A3B8] hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  <span>HUE FILTER (not thermal)</span>
                </button>
                <button
                  onClick={() => setViewMode("contour")}
                  className={`px-3 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === "contour"
                      ? "bg-[#3B82F6] text-white font-black"
                      : isDark
                      ? "text-[#94A3B8] hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>CONTOUR</span>
                </button>
              </div>
            </div>

            {/* Evidence Photo Frame Canvas */}
            <div
              className={`relative rounded-xl overflow-hidden border border-white/[0.15] bg-[#020408] transition-all flex items-center justify-center ${
                isFullScreen ? "h-[560px]" : "h-[360px] sm:h-[420px]"
              }`}
            >
              {currentFrame ? (
                <>
                  <div
                    className="relative w-full h-full overflow-hidden flex items-center justify-center"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transition: "transform 0.2s ease-out",
                    }}
                  >
                    <img
                      src={currentFrame.frameUrl}
                      alt={finding.type}
                      className={`w-full h-full object-cover select-none transition-all duration-300 ${
                        viewMode === "thermal"
                          ? "contrast-150 saturate-200 hue-rotate-[180deg] brightness-110"
                          : viewMode === "contour"
                          ? "grayscale contrast-200 invert"
                          : ""
                      }`}
                    />
                    <span className="absolute bottom-1 left-1 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-amber-200">
                      {isArabic ? "صورة توضيحية (مكتبة صور) · المربع والنسبة للعرض فقط" : "Illustrative stock image · box and score are for display only"}
                    </span>

                    {/* AI Bounding Box Overlay with Corner Reticles */}
                    {viewMode === "ai" && currentFrame.detectedBox && (
                      <div
                        className="absolute border-2 border-[#00E5B9] bg-[#00E5B9]/15 rounded transition-all shadow-[0_0_30px_rgba(0,229,185,0.5)] pointer-events-none"
                        style={{
                          left: `${currentFrame.detectedBox.x}%`,
                          top: `${currentFrame.detectedBox.y}%`,
                          width: `${currentFrame.detectedBox.w}%`,
                          height: `${currentFrame.detectedBox.h}%`,
                        }}
                      >
                        {/* Bounding Box Floating Badge */}
                        <div className="absolute -top-7 left-0 bg-[#060A14]/95 border border-[#00E5B9] px-2.5 py-0.5 rounded text-[10px] font-mono font-black text-[#00E5B9] whitespace-nowrap flex items-center gap-1.5 shadow-xl">
                          <span className="w-2 h-2 rounded-full bg-[#00E5B9] animate-ping" />
                          <span>{currentFrame.detectedBox.label}</span>
                        </div>

                        {/* Geometric Corner Reticles */}
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />

                        {/* Crosshair Center */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-40">
                          <div className="w-3 h-3 border border-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Left Bottom Telemetry HUD */}
                  <div className="absolute bottom-3 left-3 bg-[#050811]/90 backdrop-blur-md border border-white/[0.12] rounded-lg p-3 text-[10px] font-mono space-y-1 z-20 pointer-events-none">
                    <div className="flex items-center gap-2 text-[#00E5B9] font-bold">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{currentFrame.cameraAngle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#94A3B8]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{currentFrame.roomArea}</span>
                    </div>
                    <div className="text-[#64748B] flex items-center gap-2">
                      <span>TIMECODE: {currentFrame.timestampFormatted} ({currentFrame.timestampSec}s)</span>
                      <span>·</span>
                      <span>KEYFRAME #{activeFrameIndex + 1} OF {frames.length}</span>
                    </div>
                  </div>

                  {/* Right Top AI Metric HUD */}
                  <div className="absolute top-3 right-3 bg-[#050811]/90 backdrop-blur-md border border-white/[0.15] rounded-lg px-3.5 py-2 text-center font-mono z-20 pointer-events-none">
                    <div className="text-[9px] uppercase tracking-wider text-[#94A3B8]">VLM Confidence</div>
                    <div className="text-lg font-black text-[#00E5B9] leading-none mt-0.5">
                      {finding.conf}%
                    </div>
                  </div>

                  {/* Right Bottom Zoom & Canvas Controls */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#050811]/90 backdrop-blur-md border border-white/[0.12] rounded-lg p-1.5 z-20">
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                      className="p-1.5 rounded hover:bg-white/[0.1] text-white transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1))}
                      className="p-1.5 rounded hover:bg-white/[0.1] text-white transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-1.5 rounded hover:bg-white/[0.1] text-white transition-colors"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/20 mx-0.5" />
                    <button
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      className="p-1.5 rounded hover:bg-white/[0.1] text-white transition-colors"
                      title="Toggle Viewport Size"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 text-[#94A3B8]">
                  <AlertTriangle className="w-12 h-12 text-[#F59E0B] mx-auto mb-2" />
                  <p className="font-semibold">No visual frame attached to this finding</p>
                  <p className="text-xs text-red-400 mt-1">Rule Breach: NO EVIDENCE → NO TRUSTED FINDING</p>
                </div>
              )}
            </div>

            {/* Frame Carousel Selector (if multiple frames) */}
            {frames.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[10px] font-mono uppercase text-[#64748B] tracking-wider shrink-0 mr-1">
                  KEYFRAME REEL:
                </span>
                {frames.map((frame, idx) => (
                  <button
                    key={frame.id}
                    onClick={() => {
                      setActiveFrameIndex(idx);
                      setZoomLevel(1);
                    }}
                    className={`relative rounded-lg overflow-hidden border transition-all shrink-0 w-20 h-14 ${
                      activeFrameIndex === idx
                        ? "border-[#00E5B9] shadow-[0_0_12px_rgba(0,229,185,0.4)] scale-105"
                        : "border-white/[0.1] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={frame.thumbnailUrl || frame.frameUrl}
                      alt={`Frame ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 font-mono text-[8px] text-center text-white py-0.5">
                      {frame.timestampFormatted}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: DETAILED DEFECT METADATA & PHYSICAL SPECIFICATIONS */}
          <div className="space-y-4">
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? "border-white/[0.08]" : "border-slate-200"
            }`}>
              <div className={`flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold ${
                isDark ? "text-[#60A5FA]" : "text-blue-700"
              }`}>
                <Sliders className="w-4 h-4" />
                <span>{isArabic ? "المواصفات الهندسية ومقاييس العيب الفني" : "ENGINEERING SPECIFICATIONS & PHYSICAL DEFECT METADATA"}</span>
              </div>
              <span className={`font-mono text-[10px] ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>SBC COMPLIANT SPEC</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              <div className={`border rounded-xl p-3.5 space-y-1 ${
                isDark ? "bg-[#050811] border-white/[0.08]" : "bg-slate-50 border-slate-200"
              }`}>
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                  {isArabic ? "الأبعاد والقياس المقدر" : "PHYSICAL DIMENSIONS"}
                </div>
                <div className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{profile.dimensions}</div>
                <div className={`text-[10px] font-semibold ${isDark ? "text-[#00E5B9]" : "text-teal-700"}`}>{profile.depth}</div>
              </div>

              <div className={`border rounded-xl p-3.5 space-y-1 ${
                isDark ? "bg-[#050811] border-white/[0.08]" : "bg-slate-50 border-slate-200"
              }`}>
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                  {isArabic ? "المادة والطبقة السطحية" : "AFFECTED SUBSTRATE"}
                </div>
                <div className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-slate-900"}`}>{profile.substrate}</div>
                <div className={`text-[10px] ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>{finding.area}</div>
              </div>

              <div className={`border rounded-xl p-3.5 space-y-1 ${
                isDark ? "bg-[#050811] border-white/[0.08]" : "bg-slate-50 border-slate-200"
              }`}>
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                  {isArabic ? "تصنيف المخاطر الإنشائية" : "STRUCTURAL INTEGRITY"}
                </div>
                <div className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{profile.structuralRisk}</div>
                <div className={`text-[10px] font-semibold ${isDark ? "text-[#F59E0B]" : "text-amber-700"}`}>{profile.buildingStandard}</div>
              </div>

              <div className={`border rounded-xl p-3.5 space-y-1 ${
                isDark ? "bg-[#050811] border-white/[0.08]" : "bg-slate-50 border-slate-200"
              }`}>
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                  {isArabic ? "أثر الجاهزية للتصفية" : "LIQUIDATION IMPACT"}
                </div>
                <div className={`font-bold text-sm ${isDark ? "text-[#00E5B9]" : "text-teal-700"}`}>{profile.readinessImpact}</div>
                <div className={`text-[10px] ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>Est. Fix: {profile.estimatedCostSar}</div>
              </div>
            </div>

            {/* Technical Root Cause Analysis */}
            <div className={`border rounded-xl p-4 space-y-2 ${
              isDark ? "bg-[#050811] border-white/[0.08]" : "bg-slate-50 border-slate-200"
            }`}>
              <div className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                <Activity className={`w-3.5 h-3.5 ${isDark ? "text-[#00E5B9]" : "text-teal-600"}`} />
                <span>{isArabic ? "تحليل السبب الجذري وآلية التدهور" : "ROOT CAUSE & DEGRADATION MECHANISM"}</span>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-[#94A3B8]" : "text-slate-600 font-medium"}`}>
                {profile.cause}
              </p>
              <div className={`pt-2 flex items-center gap-3 text-xs font-mono flex-wrap ${
                isDark ? "text-[#64748B]" : "text-slate-500"
              }`}>
                <span className={`px-2.5 py-1 rounded ${isDark ? "bg-white/[0.04] text-white/90" : "bg-slate-200/70 text-slate-800"}`}>
                  📍 Zone: {finding.area}
                </span>
                <span className={`px-2.5 py-1 rounded ${isDark ? "bg-white/[0.04] text-white/90" : "bg-slate-200/70 text-slate-800"}`}>
                  🔬 Model: Gemini 3.8 Flash Spatial Vision V4.2
                </span>
                <span className={`px-2.5 py-1 rounded ${isDark ? "bg-white/[0.04] text-white/90" : "bg-slate-200/70 text-slate-800"}`}>
                  📋 Code Standard: {profile.buildingStandard}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: SUGGESTED REMEDIATION PLAN & STEP-BY-STEP ROADMAP */}
          <div className="space-y-4">
            <div className={`flex items-center justify-between border-b pb-2 flex-wrap gap-2 ${
              isDark ? "border-white/[0.08]" : "border-slate-200"
            }`}>
              <div className={`flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold ${
                isDark ? "text-[#00E5B9]" : "text-teal-700"
              }`}>
                <Wrench className="w-4 h-4" />
                <span>{isArabic ? "خطة التدخل والمعالجة الهندسية المقترحة" : "SUGGESTED REMEDIATION PLAN & SPECIFICATIONS"}</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className={`flex items-center gap-1 ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                  <DollarSign className={`w-3.5 h-3.5 ${isDark ? "text-[#00E5B9]" : "text-teal-600"}`} />
                  <span>Est. Cost: <strong className={isDark ? "text-white" : "text-slate-900"}>{profile.estimatedCostSar}</strong></span>
                </span>
                <span className={`flex items-center gap-1 ${isDark ? "text-[#94A3B8]" : "text-slate-600"}`}>
                  <Clock className={`w-3.5 h-3.5 ${isDark ? "text-[#60A5FA]" : "text-blue-600"}`} />
                  <span>Duration: <strong className={isDark ? "text-white" : "text-slate-900"}>{profile.estimatedHours}</strong></span>
                </span>
              </div>
            </div>

            {/* 4 Step Remediation Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {profile.remediationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl p-4 space-y-2 transition-all group ${
                    isDark
                      ? "bg-[#050811] border-white/[0.08] hover:border-[#00E5B9]/30"
                      : "bg-slate-50 border-slate-200 hover:border-teal-500/40 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full font-mono font-black text-xs flex items-center justify-center border ${
                        isDark
                          ? "bg-[#00E5B9]/15 border-[#00E5B9]/40 text-[#00E5B9]"
                          : "bg-teal-100 border-teal-300 text-teal-800"
                      }`}>
                        0{idx + 1}
                      </span>
                      <h5 className={`font-bold text-xs sm:text-sm transition-colors ${
                        isDark ? "text-white group-hover:text-[#00E5B9]" : "text-slate-900 group-hover:text-teal-700"
                      }`}>
                        {step.phase}
                      </h5>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                      isDark
                        ? "bg-white/[0.05] border-white/[0.08] text-[#94A3B8]"
                        : "bg-slate-200/80 border-slate-300 text-slate-700"
                    }`}>
                      {step.trade}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed pl-8 ${isDark ? "text-[#94A3B8]" : "text-slate-600 font-medium"}`}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Trade & Materials Specification Banner */}
            <div className={`border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs ${
              isDark
                ? "bg-[#00E5B9]/[0.04] border-[#00E5B9]/20"
                : "bg-teal-50/80 border-teal-200"
            }`}>
              <div className="space-y-0.5">
                <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-[#00E5B9]" : "text-teal-800"}`}>
                  {isArabic ? "المقاول والمواد المعتمدة" : "CERTIFIED SPECIALIST TRADE REQUIRED"}
                </div>
                <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{profile.requiredTrade}</div>
              </div>

              <div className="text-right sm:text-left">
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                  {isArabic ? "معايير التنفيذ" : "STANDARDS SPECIFICATION"}
                </div>
                <div className={`font-bold ${isDark ? "text-[#00E5B9]" : "text-teal-800"}`}>{profile.buildingStandard}</div>
              </div>
            </div>
          </div>

          {/* SECTION 4: INSPECTOR FIELD AUDIT NOTES & VERIFICATION */}
          <div className={`border rounded-xl p-5 space-y-4 ${
            isDark ? "bg-[#050811] border-white/[0.1]" : "bg-slate-50 border-slate-200"
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? "border-white/[0.08]" : "border-slate-200"
            }`}>
              <div className={`flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                <FileText className={`w-4 h-4 ${isDark ? "text-[#00E5B9]" : "text-teal-600"}`} />
                <span>{isArabic ? "سجل تدقيق وملاحظات المهندس المعتمد (SCE)" : "LICENSED INSPECTOR AUDIT LOG & FIELD NOTES"}</span>
              </div>
              <span className={`text-[10px] font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>ENG. FAHAD AL-OTAIBI (SCE-VAL-9921)</span>
            </div>

            <div className="space-y-2">
              <label className={`text-[11px] font-mono block font-medium ${isDark ? "text-[#94A3B8]" : "text-slate-700"}`}>
                {isArabic ? "ملاحظات وتوجيهات المهندس الميداني:" : "Inspector Field Notes & Custom Observations:"}
              </label>
              <textarea
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                placeholder={isArabic ? "أدخل ملاحظات المعاينة الهندسية هنا..." : "Enter on-site engineering field notes, substrate moisture readings, or follow-up instructions..."}
                rows={3}
                className={`w-full rounded-lg p-3 text-xs font-mono outline-none transition-colors border ${
                  isDark
                    ? "bg-[#020408] border-white/[0.12] focus:border-[#00E5B9] text-white placeholder:text-slate-500"
                    : "bg-white border-slate-300 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
                }`}
              />
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>
                  {notesSaved ? "✓ Notes saved to asset ledger" : "Draft changes saved locally"}
                </span>
                <button
                  onClick={handleSaveNotes}
                  className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer border ${
                    isDark
                      ? "bg-white/[0.08] hover:bg-white/[0.15] border-white/[0.2] text-white"
                      : "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800"
                  }`}
                >
                  SAVE NOTES
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal Footer Controls ── */}
        <div className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark ? "border-white/[0.1] bg-[#04060A]" : "border-slate-200 bg-slate-50"
        }`}>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Toggle Verification */}
            <button
              onClick={() => onToggleVerification(finding.id)}
              className={`px-4 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border flex-1 sm:flex-initial cursor-pointer ${
                finding.verified
                  ? isDark
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60"
                    : "bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200"
                  : isDark
                  ? "bg-gradient-to-r from-[#00E5B9] to-[#00B894] text-[#050B14] hover:opacity-90 border-transparent shadow-[0_0_15px_rgba(0,229,185,0.25)]"
                  : "bg-teal-600 text-white hover:bg-teal-700 border-transparent shadow-sm"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {finding.verified
                  ? isArabic
                    ? "معتمد رسمي ✓ (إلغاء الاعتماد)"
                    : "SCE VERIFIED ✓ (REVOKE)"
                  : isArabic
                  ? "اعتماد الملاحظة رسمياً ✓"
                  : "APPROVE & VERIFY FINDING ✓"}
              </span>
            </button>

            {/* Toggle Resolved */}
            <button
              onClick={() => onToggleResolved(finding.id)}
              className={`px-4 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all border flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer ${
                finding.isResolved
                  ? isDark
                    ? "bg-blue-950/40 border-blue-500/50 text-blue-300 hover:bg-blue-900/60"
                    : "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
                  : isDark
                  ? "bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.15] text-white"
                  : "bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {finding.isResolved
                  ? isArabic
                    ? "تمت المعالجة (إعادة الفتح)"
                    : "RESOLVED (REOPEN)"
                  : isArabic
                  ? "تأكيد اكتمال المعالجة ✓"
                  : "MARK AS RESOLVED ✓"}
              </span>
            </button>
          </div>

          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-lg border text-xs font-mono font-bold transition-all w-full sm:w-auto cursor-pointer ${
              isDark
                ? "bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.15] text-[#94A3B8] hover:text-white"
                : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm"
            }`}
          >
            {isArabic ? "إغلاق النافذة" : "CLOSE"}
          </button>
        </div>
      </div>
    </div>
  );
};
