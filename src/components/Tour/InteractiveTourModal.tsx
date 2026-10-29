import React, { useState, useEffect } from "react";
import { MiraahLogo } from "../common/MiraahLogo";
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Compass,
  Cpu,
  ShieldCheck,
  Building2,
  TrendingUp,
  FileCheck2,
  FileDown,
  Play,
  RotateCcw,
  Zap,
  Eye,
  Layers,
  Award,
  ArrowUpRight,
} from "lucide-react";

export interface InteractiveTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic?: boolean;
  onNavigateTab?: (tabId: string) => void;
  onOpenAdvisor?: () => void;
  onOpenExport?: () => void;
}

interface TourStep {
  id: string;
  stepNumber: number;
  tabTarget?: string;
  badge: { en: string; ar: string };
  title: { en: string; ar: string };
  tagline: { en: string; ar: string };
  description: { en: string; ar: string };
  features: { en: string; ar: string; icon: string }[];
  highlightMetric: { value: string; labelEn: string; labelAr: string };
  actionLabel?: { en: string; ar: string };
  actionType?: "navigate" | "advisor" | "export";
  gradient: string;
}

export const InteractiveTourModal: React.FC<InteractiveTourModalProps> = ({
  isOpen,
  onClose,
  isArabic = false,
  onNavigateTab,
  onOpenAdvisor,
  onOpenExport,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Keyboard navigation support
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (isArabic) {
          handlePrev();
        } else {
          handleNext();
        }
      } else if (e.key === "ArrowLeft") {
        if (isArabic) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStepIndex, isArabic]);

  const TOUR_STEPS: TourStep[] = [
    {
      id: "overview",
      stepNumber: 1,
      badge: { en: "PLATFORM IDENTITY", ar: "هوية منصة مرآة" },
      title: {
        en: "MIRAAH Platform Overview",
        ar: "نبذة تعريفية شاملة عن منصة مرآة",
      },
      tagline: {
        en: "Spatial Intelligence & Real Estate Liquidation Readiness",
        ar: "منظومة الذكاء المكاني والجاهزية لتصفية الأصول العقارية",
      },
      description: {
        en: "MIRAAH is a prototype built for the Infath Innovation program. It brings an asset's inspection data into one digital passport with scores computed by published formulas. It runs on demo data and is not an official system.",
        ar: "«مرآة» نموذج أولي مقدَّم لبرنامج ابتكار إنفاذ، يجمع بيانات معاينة الأصل في جواز رقمي واحد بمؤشرات تُحسب بمعادلات معلنة. يعمل ببيانات توضيحية وليس نظاماً رسمياً.",
      },
      features: [
        {
          en: "Designed around the Infath Innovation asset-inspection track (no integration with Infath systems)",
          ar: "مصمم لمسار معاينة الأصول في برنامج ابتكار إنفاذ (دون ربط بأنظمة إنفاذ)",
          icon: "🏛️",
        },
        {
          en: "Findings tagged with a Saudi Building Code part (not a compliance check)",
          ar: "ربط الملاحظات بجزء من كود البناء السعودي (ليس فحص مطابقة)",
          icon: "📜",
        },
        {
          en: "Liquidation Readiness Index (0–100) computed by a published formula",
          ar: "مؤشر جاهزية التصفية (0–100) بمعادلة معلنة",
          icon: "📊",
        },
      ],
      highlightMetric: {
        value: "4",
        labelEn: "Published score formulas",
        labelAr: "معادلات مؤشرات معلنة",
      },
      gradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
    },
    {
      id: "passport",
      stepNumber: 2,
      tabTarget: "passport",
      badge: { en: "DIGITAL ASSET PASSPORT", ar: "جواز الأصل الرقمي" },
      title: {
        en: "Asset Passport & 3D Spatial Twin",
        ar: "جواز الأصل والتوأمة المكانية ثلاثية الأبعاد",
      },
      tagline: {
        en: "Comprehensive technical blueprint with instant area coverage telemetry",
        ar: "سجل للأصل يربط المساحات والملاحظات والأدلة (بيانات توضيحية)",
      },
      description: {
        en: "The Asset Passport consolidates all physical, architectural, and statutory metrics of an asset into a unified digital record. Inspect cross-sections, specimen documents, and area breakdown from basement to roof levels (demo data).",
        ar: "يجمع جواز الأصل بيانات العقار وتفصيل المساحات من القبو حتى السطح ونماذج المستندات التوضيحية (بيانات تجريبية).",
      },
      features: [
        {
          en: "Coverage view per area (illustrative 3D drawing)",
          ar: "عرض التغطية لكل منطقة (رسم ثلاثي الأبعاد توضيحي)",
          icon: "🌐",
        },
        {
          en: "Specimen document viewer (not official documents)",
          ar: "عارض نماذج مستندات توضيحية (ليست رسمية)",
          icon: "📑",
        },
        {
          en: "Area breakdown by floor",
          ar: "حساب المساحة المبنية الإجمالية (Gross Built Area) بدقة عالية",
          icon: "📐",
        },
      ],
      highlightMetric: {
        value: "Demo",
        labelEn: "All asset data is illustrative",
        labelAr: "كل بيانات الأصول توضيحية",
      },
      actionLabel: { en: "Open Asset Passport", ar: "استعراض جواز الأصل" },
      actionType: "navigate",
      gradient: "from-blue-500/20 via-cyan-600/10 to-transparent",
    },
    {
      id: "findings",
      stepNumber: 3,
      tabTarget: "findings",
      badge: { en: "AI DEFECT DETECTION", ar: "رصد العيوب بالذكاء الاصطناعي" },
      title: {
        en: "AI Structural Findings & Frame Evidence",
        ar: "رصد الملاحظات الإنشائية وتوثيق الإطارات المرئية",
      },
      tagline: {
        en: "Findings with severity, area and evidence (demo data or manual labels)",
        ar: "ملاحظات بالخطورة والمنطقة والدليل (بيانات توضيحية أو تصنيف يدوي)",
      },
      description: {
        en: "Recorded findings are categorised by severity (Critical, Moderate, Low) and tagged with a Saudi Building Code part. In this prototype, findings come from demo data or manual labelling, not automatic detection. Users can verify findings or mark them resolved.",
        ar: "تُصنَّف الملاحظات المسجلة حسب الخطورة (حرج، متوسط، منخفض) وتُربط بجزء من كود البناء السعودي. في هذا النموذج تأتي الملاحظات من بيانات توضيحية أو تصنيف يدوي، وليس من اكتشاف آلي. يستطيع المستخدم التحقق منها أو إغلاقها.",
      },
      features: [
        {
          en: "Evidence images with marked areas (illustrative)",
          ar: "صور دليل مع تحديد المنطقة (توضيحية)",
          icon: "🎯",
        },
        {
          en: "User verification with an append-only Firestore log",
          ar: "تحقق المستخدم مع سجل إلحاقي في Firestore",
          icon: "🛡️",
        },
        {
          en: "Impact of resolving findings on the readiness score",
          ar: "أثر معالجة الملاحظات على مؤشر الجاهزية",
          icon: "💵",
        },
      ],
      highlightMetric: {
        value: "3",
        labelEn: "Severity levels",
        labelAr: "مستويات الخطورة",
      },
      actionLabel: { en: "Explore findings", ar: "عرض الملاحظات" },
      actionType: "navigate",
      gradient: "from-amber-500/20 via-orange-600/10 to-transparent",
    },
    {
      id: "proptech",
      stepNumber: 4,
      tabTarget: "proptech",
      badge: { en: "PROPTECH 2.0 COGNITIVE OS", ar: "منظومة PropTech المعرفية" },
      title: {
        en: "PropTech 2.0 Cognitive Operating System",
        ar: "نظام التشغيل المعرفي للعقارات الذكية (PropTech 2.0)",
      },
      tagline: {
        en: "Future concept, simulated: IoT telemetry, BIM audit & blockchain registry",
        ar: "حساسات إنشائية حية، فحص نماذج BIM وتوثيق البلوكشين لسجل العقار",
      },
      description: {
        en: "A simulated future concept with demo data: IoT sensor telemetry, BIM-LiDAR tolerance checks, lifecycle forecasting and a blockchain deed registry. None of these are connected to real systems in this version.",
        ar: "تصوّر مستقبلي ببيانات توضيحية: قراءات IoT، مطابقة BIM مع LiDAR، التنبؤ بالدورة الحياتية، وسجل بلوكشين. لا يوجد ربط بأي نظام حقيقي في هذا الإصدار.",
      },
      features: [
        {
          en: "Simulated IoT readings (demo data)",
          ar: "محاكاة لقراءات حساسات إنشائية (بيانات توضيحية)",
          icon: "📡",
        },
        {
          en: "Simulated BIM vs LiDAR deviation table (demo data)",
          ar: "كشف التعارضات الهندسية ومطابقة المخطط المنفذ As-Built",
          icon: "🏗️",
        },
        {
          en: "Simulated registry concept (no real blockchain)",
          ar: "محاكاة فكرة سجل بلوكشين (لا توجد شبكة حقيقية)",
          icon: "⛓️",
        },
      ],
      highlightMetric: {
        value: "Simulated",
        labelEn: "Future concept, demo data",
        labelAr: "تصوّر مستقبلي ببيانات توضيحية",
      },
      actionLabel: { en: "Launch PropTech OS", ar: "فتح منظومة PropTech" },
      actionType: "navigate",
      gradient: "from-emerald-500/20 via-cyan-600/10 to-transparent",
    },
    {
      id: "whatif",
      stepNumber: 5,
      tabTarget: "whatif",
      badge: { en: "WHAT-IF SIMULATION", ar: "محاكاة السيناريوهات" },
      title: {
        en: "What-If Simulator & Value Recovery",
        ar: "محاكي السيناريوهات وخطة التدخل الأمثل",
      },
      tagline: {
        en: "Illustrative repair scenarios on top of the asset's computed readiness",
        ar: "سيناريوهات توضيحية فوق الجاهزية المحسوبة فعلاً للأصل",
      },
      description: {
        en: "The What-If Simulator starts from the asset's actual computed readiness and shows how resolving findings, completing coverage or providing missing fields changes it. Cost and value figures in the repair section are fixed illustrative assumptions, not valuations.",
        ar: "يبدأ محاكي السيناريوهات من الجاهزية المحسوبة فعلاً للأصل ويبيّن أثر معالجة الملاحظات أو استكمال التغطية أو البيانات الناقصة. أرقام التكلفة والقيمة في قسم الإصلاحات افتراضات توضيحية وليست تقييماً.",
      },
      features: [
        {
          en: "Simulate individual or grouped repairs to see liquidation score climb",
          ar: "تفعيل وإلغاء إصلاح العيوب ومشاهدة ارتفاع المؤشر فورياً",
          icon: "⚡",
        },
        {
          en: "Net Value Recovery calculation with transparent cost-benefit breakdown",
          ar: "احتساب صافي القيمة المستردة وتفاصيل تكلفة التدخلات",
          icon: "💰",
        },
        {
          en: "Next Best Action list ordered by impact and effort",
          ar: "تحديد قائمة الإجراء الأفضل التالي (Next Best Action) ذات الأولوية القصوى",
          icon: "🎯",
        },
      ],
      highlightMetric: {
        value: "0–100",
        labelEn: "Readiness range (computed)",
        labelAr: "نطاق مؤشر الجاهزية (محسوب)",
      },
      actionLabel: { en: "Test What-If Simulator", ar: "تجربة محاكي السيناريوهات" },
      actionType: "navigate",
      gradient: "from-purple-500/20 via-pink-600/10 to-transparent",
    },
    {
      id: "advisor",
      stepNumber: 6,
      badge: { en: "AI ASSISTANT", ar: "مساعد مرآة" },
      title: {
        en: "MIRAAH assistant (sign-in required)",
        ar: "مساعد مرآة (يتطلب تسجيل الدخول)",
      },
      tagline: {
        en: "Questions about the active asset's recorded data",
        ar: "مساعد محادثة هندسي يجيب فورياً بالاستناد إلى السجل المكاني الكامل للأصل",
      },
      description: {
        en: "The assistant answers questions about the displayed asset data in Arabic or English. It says plainly what is simulated or not available, does not invent numbers, and gives no legal advice or certified valuation.",
        ar: "يجيب المساعد بالعربية أو الإنجليزية عن بيانات الأصل المعروضة، ويوضح ما هو محاكاة أو غير متوفر، ولا يختلق أرقاماً، ولا يقدم استشارة قانونية أو تقييماً معتمداً.",
      },
      features: [
        {
          en: "Grounded directly in active asset telemetry, scores, and defect logs",
          ar: "يجيب من بيانات الأصل النشط ومؤشراته وملاحظاته المسجلة",
          icon: "🤖",
        },
        {
          en: "Deep defect root cause analysis and SBC legal liability advisory",
          ar: "تشخيص ميكانيكية الخلل الجذري والمسؤوليات القانونية والهندسية",
          icon: "🔍",
        },
        {
          en: "Bilingual instant responses with contextual quick-query suggestions",
          ar: "إجابات فورية باللغتين العربية والإنجليزية مع أسئلة سريعة مسبقة",
          icon: "💬",
        },
      ],
      highlightMetric: {
        value: "Sign-in",
        labelEn: "Required to use the assistant",
        labelAr: "مطلوب لاستخدام المساعد",
      },
      actionLabel: { en: "Open MIRAAH Advisor", ar: "محادثة مستشار مرآة" },
      actionType: "advisor",
      gradient: "from-cyan-500/20 via-teal-600/10 to-transparent",
    },
    {
      id: "export",
      stepNumber: 7,
      badge: { en: "EXPORT", ar: "التصدير" },
      title: {
        en: "Passport export (PDF, CSV, JSON)",
        ar: "تصدير جواز الأصل (PDF وCSV وJSON)",
      },
      tagline: {
        en: "One data source for every format, with a SHA-256 fingerprint",
        ar: "تصدير ملف PDF للجواز بعلامة \"نموذج تجريبي\"، وJSON وCSV مع بصمة SHA-256",
      },
      description: {
        en: "Export the passport as a 4-page PDF marked as a prototype, and as JSON and CSV built from the same data, with a SHA-256 fingerprint that reveals later changes when compared with a separately kept copy.",
        ar: "بضغطة زر تصدّر جواز الأصل بصيغة PDF (نموذج تجريبي) مع جداول الملاحظات والمؤشرات، وبصيغ JSON وCSV من نفس البيانات مع بصمة SHA-256 للتحقق من عدم تغيّر الملف.",
      },
      features: [
        {
          en: "Summary page generated by code from the computed scores (no AI)",
          ar: "صفحة ملخص يولّدها الكود من المؤشرات المحسوبة (بدون ذكاء اصطناعي)",
          icon: "📑",
        },
        {
          en: "High-DPI PDF generation with automated canvas color sanitization",
          ar: "تصدير PDF متعدد الصفحات بتنسيق ثابت",
          icon: "🖨️",
        },
        {
          en: "Verification actions logged to Firestore for the signed-in user",
          ar: "تسجيل إجراءات التحقق في Firestore باسم المستخدم المسجّل",
          icon: "✅",
        },
      ],
      highlightMetric: {
        value: "SHA-256",
        labelEn: "Export fingerprint",
        labelAr: "بصمة ملف التصدير",
      },
      actionLabel: { en: "Open Export Window", ar: "استعراض نافذة التصدير" },
      actionType: "export",
      gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
    },
  ];

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleActionClick = () => {
    if (!currentStep.actionType) return;
    if (currentStep.actionType === "navigate" && currentStep.tabTarget) {
      onNavigateTab?.(currentStep.tabTarget);
      onClose();
    } else if (currentStep.actionType === "advisor") {
      onOpenAdvisor?.();
      onClose();
    } else if (currentStep.actionType === "export") {
      onOpenExport?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#080d1a] border border-cyan-500/40 shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden text-white"
      >
        {/* Top Header with Brand Identity */}
        <div className="relative px-6 py-4 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between flex-wrap gap-3">
          {/* Logo & Header Title */}
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-sm">
              <MiraahLogo size={36} showSubtitle={false} isArabic={isArabic} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {isArabic
                    ? "الجولة التعريفية الشاملة لمنصة مرآة"
                    : "MIRAAH Platform Interactive Tour"}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <Sparkles className="w-3 h-3" />
                  <span>v2.4 Saudi Due Diligence</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? "تعرف على قدرات المنصة في التحليل المكاني، الذكاء الاصطناعي، وتسريع التصفية"
                  : "Discover spatial telemetry, AI defect auditing, and judicial readiness"}
              </p>
            </div>
          </div>

          {/* Close & Step Progress Pills */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-full px-3 py-1 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">
                {currentStep.stepNumber}
              </span>
              <span className="text-slate-500">/</span>
              <span>{TOUR_STEPS.length}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isArabic ? "إغلاق" : "Close"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicators Bar */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800/60 flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {TOUR_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : isCompleted
                    ? "bg-slate-900/90 text-emerald-400 hover:bg-slate-850 border border-emerald-500/30 font-medium"
                    : "bg-slate-900/40 text-slate-400 hover:text-slate-300 hover:bg-slate-900 border border-slate-800/60"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black shrink-0 ${
                      isActive
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
                <span className="truncate text-[11px]">
                  {isArabic ? step.badge.ar : step.badge.en}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Top Banner Tag + Ambient Glow */}
          <div
            className={`relative rounded-3xl p-6 sm:p-7 border border-slate-800/90 bg-gradient-to-br ${currentStep.gradient} overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-15">
              <MiraahLogo size={140} showSubtitle={false} />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>
                  {isArabic ? currentStep.badge.ar : currentStep.badge.en}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isArabic ? currentStep.title.ar : currentStep.title.en}
              </h1>

              <p className="text-sm font-semibold text-cyan-200/90 font-mono">
                {isArabic ? currentStep.tagline.ar : currentStep.tagline.en}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl pt-1 font-sans">
                {isArabic
                  ? currentStep.description.ar
                  : currentStep.description.en}
              </p>
            </div>
          </div>

          {/* Features Grid & Metric Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Key Features List (Spans 2 Columns) */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
                {isArabic ? "المزايا التشغيلية الرئيسية:" : "Core Operational Capabilities:"}
              </h4>
              <div className="space-y-2">
                {currentStep.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3"
                  >
                    <span className="text-lg shrink-0 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                      {feat.icon}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-normal pt-1">
                      {isArabic ? feat.ar : feat.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric & Emblem Callout Box */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-inner flex flex-col justify-between items-center text-center space-y-4">
              <div className="w-full flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  {currentStep.id === "overview"
                    ? isArabic
                      ? "الشعار والهوية الرسمية"
                      : "OFFICIAL BRAND IDENTITY"
                    : isArabic
                    ? "مؤشر المنظومة"
                    : "PLATFORM METRIC"}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {currentStep.id === "overview" ? (
                <div className="flex flex-col items-center justify-center my-auto py-1">
                  <div className="p-2 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)] mb-2">
                    <MiraahLogo
                      size={64}
                      showSubtitle={false}
                      isArabic={isArabic}
                    />
                  </div>
                  <span className="text-sm font-bold text-white font-arabic">
                    {isArabic ? "مرآة · MIRAAH" : "MIRAAH · مرآة"}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    GovTech & PropTech 2026
                  </span>
                </div>
              ) : (
                <div className="my-auto py-2">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                    {currentStep.highlightMetric.value}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 font-semibold">
                    {isArabic
                      ? currentStep.highlightMetric.labelAr
                      : currentStep.highlightMetric.labelEn}
                  </div>
                </div>
              )}

              {/* Action Quick Launch Button (if available) */}
              {currentStep.actionLabel ? (
                <button
                  onClick={handleActionClick}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-black transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {isArabic
                      ? currentStep.actionLabel.ar
                      : currentStep.actionLabel.en}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{isArabic ? "بدء استعراض الأقسام" : "Start Tour Sections"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Controls Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/95 flex items-center justify-between flex-wrap gap-3">
          {/* Restart Tour Button */}
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? "البدء من الأول" : "Restart Tour"}</span>
          </button>

          {/* Stepper Buttons (Prev / Next / Finish) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              {isArabic ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
              <span>{isArabic ? "السابق" : "Previous"}</span>
            </button>

            {currentStepIndex < TOUR_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <span>{isArabic ? "التالي" : "Next"}</span>
                {isArabic ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isArabic ? "إنهاء واستكشاف المنصة" : "Finish & Explore"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
