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
        en: "MIRAAH is the premier Saudi GovTech & PropTech platform transforming judicial and corporate real estate liquidation into a transparent, data-grounded science. By combining computer vision, Saudi Building Code (SBC) auditing, and 3D spatial telemetry, MIRAAH eliminates buyer hesitation and maximizes liquidation recovery value.",
        ar: "منصة «مرآة» هي المنظومة السعودية المتقدمة في حوكمة وتأهيل الأصول العقارية في مزادات وتصفيات مركز الإسناد والتصفية (إنفاذ). تجمع المنصة بين الرؤية الحاسوبية، المطابقة الإلزامية لكود البناء السعودي (SBC)، وتوأمة الأصول مكانياً لتحويل قرارات التصفية إلى استثمار مدروس ونافي للجهالة.",
      },
      features: [
        {
          en: "Integrated with Saudi Center for Entrustment & Liquidation (Infath) standards",
          ar: "متوافقة مع اشتراطات مركز الإسناد والتصفية (إنفاذ)",
          icon: "🏛️",
        },
        {
          en: "Full compliance verification with Saudi Building Code (SBC 201, 304, 601, 801)",
          ar: "تدقيق معايير كود البناء السعودي (العمارة، الخرسانة، العزل، السلامة)",
          icon: "📜",
        },
        {
          en: "Automated Liquidation Readiness Index (0-100) and market uplift modeling",
          ar: "مؤشر رقمي معتمد لجاهزية التصفية واحتساب عائد الاستثمار (ROI)",
          icon: "📊",
        },
      ],
      highlightMetric: {
        value: "98.4%",
        labelEn: "Average Spatial Coverage",
        labelAr: "متوسط دقة التغطية المكانية",
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
        ar: "سجل عقاري موثق يربط المساحات والوثائق والعيوب مكانياً",
      },
      description: {
        en: "The Asset Passport consolidates all physical, architectural, and statutory metrics of an asset into a unified digital record. Inspect cross-sections, specimen documents, and area breakdown from basement to roof levels (demo data).",
        ar: "يوفر جواز الأصل هوية رقمية موحدة لكل عقار، متضمناً فحص الصكوك الإلكترونية، رخص بلدي، وتفصيل المساحات الطابقية من الأقبية حتى الأسطح مع استعراض شامل للبيانات المساحية والتثمين المالي.",
      },
      features: [
        {
          en: "LiDAR & 3D point cloud visual coverage viewer",
          ar: "عرض التغطية المكانية ومطابقة مسح LiDAR الميداني",
          icon: "🌐",
        },
        {
          en: "Accredited legal documentation viewer (title deed, MOMRAH, zoning)",
          ar: "استعراض الوثائق المعتمدة مع توثيق السجل العقاري وسجلات إنفاذ",
          icon: "📑",
        },
        {
          en: "Real-time area calculation and floor-by-floor breakdown",
          ar: "حساب المساحة المبنية الإجمالية (Gross Built Area) بدقة عالية",
          icon: "📐",
        },
      ],
      highlightMetric: {
        value: "14.8M",
        labelEn: "SAR Active Asset Valuation",
        labelAr: "ريال سعودي تثمين الأصل الحالي",
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
        en: "Computer vision defect localization tagged to exact video timestamp",
        ar: "رصد الشقوق والرطوبة وربطها بإطارات الفيديو الدقيقة وتصنيف الخطورة",
      },
      description: {
        en: "Recorded findings are categorised by severity (Critical, Moderate, Low) and tagged with a Saudi Building Code part. In this prototype, findings come from demo data or manual labelling, not automatic detection. Users can verify findings or mark them resolved.",
        ar: "يقوم نموذج الرؤية الحاسوبية باكتشاف التشققات، الرطوبة، والعيوب السطحية تلقائياً وربطها برقم إطار الفيديو والتوقيت الدقيق، مع ربط كل ملاحظة ببنود كود البناء السعودي (SBC 304 للخرسانة وSBC 601 للعزل).",
      },
      features: [
        {
          en: "Video frame evidence with exact bounding boxes and confidence score",
          ar: "لقطات توثيقية حية مع مربعات التحديد ونسبة ثقة الخوارزمية",
          icon: "🎯",
        },
        {
          en: "Judicial verification workflow with Firestore audit trail logging",
          ar: "توثيق إجراءات المأمور القضائي وحفظها في قاعدة بيانات Firestore",
          icon: "🛡️",
        },
        {
          en: "Repair cost estimation and impact on liquidation value",
          ar: "تقدير تكلفة المعالجة الفورية وتأثيرها المباشر على سعر المزاد",
          icon: "💵",
        },
      ],
      highlightMetric: {
        value: "0.3mm",
        labelEn: "Micro-Crack Detection Threshold",
        labelAr: "حساسية رصد التشققات الدقيقة",
      },
      actionLabel: { en: "Explore AI Findings", ar: "عرض نتائج الذكاء الاصطناعي" },
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
        ar: "المستوى المعرفي الأحدث لإدارة الأصول: قراءة حية لمجسات الإجهاد والحرارة IoT، مطابقة المخططات الهندسية BIM مع المسح الفعلي LiDAR، محاكاة تآكل الخرسانة لـ 10 سنوات قادمة، وتوثيق سجلات الصكوك المصفاة في بلوكشين SRE-Chain.",
      },
      features: [
        {
          en: "Live IoT telemetry (strain gauge, moisture probes, SBC vibration limits)",
          ar: "محاكاة لقراءات حساسات إنشائية (بيانات توضيحية)",
          icon: "📡",
        },
        {
          en: "Automated BIM vs LiDAR clash detection with millimeter precision",
          ar: "كشف التعارضات الهندسية ومطابقة المخطط المنفذ As-Built",
          icon: "🏗️",
        },
        {
          en: "Simulated registry concept (no real blockchain)",
          ar: "سجل رقمي مشفر غير قابل للتعديل لضمان نزاهة المزاد",
          icon: "⛓️",
        },
      ],
      highlightMetric: {
        value: "6 Nodes",
        labelEn: "SRE-Chain Validated Ledger",
        labelAr: "عقد بلوكشين موثقة للمعاملة",
      },
      actionLabel: { en: "Launch PropTech OS", ar: "فتح منظومة PropTech" },
      actionType: "navigate",
      gradient: "from-emerald-500/20 via-cyan-600/10 to-transparent",
    },
    {
      id: "whatif",
      stepNumber: 5,
      tabTarget: "whatif",
      badge: { en: "ROI & DECISION INTELLIGENCE", ar: "ذكاء القرار ومحاكاة العائد" },
      title: {
        en: "What-If Simulator & Value Recovery",
        ar: "محاكي السيناريوهات وخطة التدخل الأمثل",
      },
      tagline: {
        en: "Dynamic financial modeling showing exact ROI of defect remediation",
        ar: "محاكاة فورية لحساب العائد الاستثماري وتسريع وتيرة البيع",
      },
      description: {
        en: "Should an asset be auctioned 'As-Is' or remediated first? The What-If Simulator calculates the exact valuation uplift and liquidity acceleration for fixing each defect, delivering actionable ROI metrics to trustees and judicial committees.",
        ar: "هل يُباع العقار بحالته الراهنة أم يُعالج أولاً؟ يتيح محاكي السيناريوهات للمصفين القضائيين حساب الزيادة المؤكدة في سعر البيع مقارنة بتكلفة الترميم، مع إبراز مضاعف العائد الاستثماري وتسريع إنهاء التصفية.",
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
          en: "Next Best Action algorithm prioritizing highest ROI interventions",
          ar: "تحديد قائمة الإجراء الأفضل التالي (Next Best Action) ذات الأولوية القصوى",
          icon: "🎯",
        },
      ],
      highlightMetric: {
        value: "9.14x",
        labelEn: "Average ROI on Critical Repairs",
        labelAr: "مضاعف العائد على ترميم العيوب الحرجة",
      },
      actionLabel: { en: "Test What-If Simulator", ar: "تجربة محاكي السيناريوهات" },
      actionType: "navigate",
      gradient: "from-purple-500/20 via-pink-600/10 to-transparent",
    },
    {
      id: "advisor",
      stepNumber: 6,
      badge: { en: "GEMINI 3.8 ADVISOR", ar: "مستشار مرآة الذكي" },
      title: {
        en: "MIRAAH Spatial AI Advisor (Gemini 3.8)",
        ar: "مستشار مرآة الذكي (مدعوم بمحرك Gemini 3.8)",
      },
      tagline: {
        en: "Questions about the active asset's recorded data",
        ar: "مساعد محادثة هندسي يجيب فورياً بالاستناد إلى السجل المكاني الكامل للأصل",
      },
      description: {
        en: "Powered by Gemini 3.8 Flash, the advisor acts as an on-demand senior structural auditor and liquidation strategist. Ask in Arabic or English about compliance nuances, auction strategies, or contractor repair specs with multi-model failover resilience.",
        ar: "مساعد ذكاء اصطناعي متخصص في تقييم العقارات المصفاة، مدرب على كود البناء السعودي ولوائح إنفاذ. يمكنك استشارته في أي لحظة حول سلامة العناصر الإنشائية، سيناريوهات المزاد، أو تحليل العيوب بلغة طبيعية.",
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
        value: "<1.2s",
        labelEn: "Average AI Inference Time",
        labelAr: "سرعة استجابة الاستشارة الذكية",
      },
      actionLabel: { en: "Open MIRAAH Advisor", ar: "محادثة مستشار مرآة" },
      actionType: "advisor",
      gradient: "from-cyan-500/20 via-teal-600/10 to-transparent",
    },
    {
      id: "export",
      stepNumber: 7,
      badge: { en: "ACCREDITED REPORTING", ar: "التقارير المعتمدة للتصفية" },
      title: {
        en: "Accredited Liquidation Passport & PDF Export",
        ar: "تصدير وثيقة جواز التصفية المعتمد (PDF النافي للجهالة)",
      },
      tagline: {
        en: "Executive-grade judicial reports with cryptographic QR and executive summary",
        ar: "تصدير ملف PDF للجواز بعلامة \"نموذج تجريبي\"، وJSON وCSV مع بصمة SHA-256",
      },
      description: {
        en: "With a single click, compile the full due diligence record into an accredited, high-resolution PDF report suitable for judicial auction packages, court filings, and prospective institutional bidders, featuring full color-sanitized vector layouts.",
        ar: "بضغطة زر تصدّر جواز الأصل بصيغة PDF (نموذج تجريبي) مع جداول الملاحظات والمؤشرات، وبصيغ JSON وCSV من نفس البيانات مع بصمة SHA-256 للتحقق من عدم تغيّر الملف.",
      },
      features: [
        {
          en: "Executive summary crafted with Gemini 3.8 Flash intelligence",
          ar: "ملخص تنفيذي مدعوم بالذكاء الاصطناعي للجان القضائية والمستثمرين",
          icon: "📑",
        },
        {
          en: "High-DPI PDF generation with automated canvas color sanitization",
          ar: "تصدير فائق الدقة بدون أي أخطاء لونية مع ضمان ثبات التنسيق",
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
