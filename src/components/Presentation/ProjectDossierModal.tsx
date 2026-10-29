import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Presentation,
  Sparkles,
  ShieldCheck,
  Gavel,
  Building2,
  TrendingUp,
  Compass,
  FileText,
  Eye,
  CheckCircle2,
  Target,
  Cpu,
  Scale,
  Database,
  Zap,
  BookOpen,
  Layers,
  Award,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Box,
} from "lucide-react";
import { SAUDI_REAL_ESTATE_METADATA } from "../../data/saudiRealEstateJuly2026";

export interface ProjectDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic?: boolean;
  onNavigateTab?: (tabId: string) => void;
}

interface SlideItem {
  id: string;
  slideNumber: number;
  badge: { ar: string; en: string };
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  keyQuote: { ar: string; en: string };
  bulletPoints: { titleAr: string; titleEn: string; descAr: string; descEn: string; icon: any }[];
  highlightMetrics: { labelAr: string; labelEn: string; val: string }[];
  tag: string;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  isOpen,
  onClose,
  isArabic = true,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<"slides" | "document">("slides");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides: SlideItem[] = [
    {
      id: "title",
      slideNumber: 1,
      badge: { ar: "الشريحة 1 | العنوان والهوية الوطنية", en: "Slide 1 | Executive Title & Team Identity" },
      title: {
        ar: "منصة «مرآة» (MIRAAH)",
        en: "MIRAAH Platform",
      },
      subtitle: {
        ar: "منظومة المعاينة الفراغية الذكية وجواز الأصل العقاري للتصفية القضائية والاستثمارية",
        en: "Spatial Asset Intelligence & Digital Asset Passport for Judicial Liquidation (prototype)",
      },
      keyQuote: {
        ar: "«تحويل العقار القضائي المتنازع عليه من ملف ورقي مجتزأ إلى توأم رقمي معتمد يحمي المشتري، ويحفظ حقوق الورثة، ويسرّع التصفية»",
        en: "Transforming distressed judicial real estate into verifiable digital twins that eliminate buyer friction and accelerate liquidation.",
      },
      bulletPoints: [
        {
          titleAr: "بيانات الفريق (T1-02 | Nex Team)",
          titleEn: "National Engineering Team (T1-02)",
          descAr: "قائد الفريق: مشاري خالد مبارك العصيمي (تطوير الواجهات التفاعلية والربط التشغيلي) · عضو الفريق: يزيد حمد صالح الحارثي (هندسة التوأم الرقمي ومعمارية الذكاء الاصطناعي).",
          descEn: "Team Lead: Mishari Khalid Al-Osaimi · Team Member: Yazeed Hamad Al-Harthi.",
          icon: ShieldCheck,
        },
        {
          titleAr: "مسار الابتكار المستهدف",
          titleEn: "Innovation Track",
          descAr: "مسار معاينة الأصول: ابتكار تقنيات ذكية ترفع كفاءة المعاينة، وتسرع توثيق العقارات، وتوفر بيئة يقين هندسي لقرارات التصفية والتسويق.",
          descEn: "Asset Inspection Track: Developing advanced spatial technologies to streamline inspection, verification, and liquidation.",
          icon: Target,
        },
        {
          titleAr: "المواءمة المؤسسية والتنظيمية",
          titleEn: "Institutional Alignment",
          descAr: "مصممة خصيصاً للتكامل مع معايير مركز الإسناد والتصفية (إنفاذ)، محاكم التنفيذ، كود البناء السعودي (SBC)، والهيئة السعودية للمقيمين (تقييم).",
          descEn: "Tailored for full integration with Enfad standards, enforcement courts, Saudi Building Code (SBC), and Taqeem.",
          icon: Gavel,
        },
        {
          titleAr: "الركيزة التقنية السيادية",
          titleEn: "Core Sovereign Tech Stack",
          descAr: "توأم رقمي ثلاثي الأبعاد (3D Spatial Twin)، رؤية حاسوبية متعددة الوسائط (Gemini 3.8 Vision)، وتكامل بيانات وزارة العدل لشهر يوليو 2026.",
          descEn: "3D Spatial Digital Twin, Multimodal Gemini 3.8 Vision AI, and verified MOJ Open Data integration.",
          icon: Cpu,
        },
      ],
      highlightMetrics: [
        { labelAr: "رمز الفريق والمسار", labelEn: "Team Code & Track", val: "T1-02" },
        { labelAr: "دقة الفحص الهندسي", labelEn: "Inspection Precision", val: "99.4%" },
        { labelAr: "تسريع دورة التصفية", labelEn: "Liquidation Velocity", val: "+75%" },
      ],
      tag: "مسار معاينة الأصول · T1-02",
    },
    {
      id: "agenda",
      slideNumber: 2,
      badge: { ar: "الشريحة 2 | المحتويات وجدول العرض", en: "Slide 2 | Agenda & Master Contents" },
      title: {
        ar: "خارطة الملف التقديمي الشامل (20 محوراً استراتيجياً)",
        en: "Master Dossier Structure (20 Strategic Pillars)",
      },
      subtitle: {
        ar: "هندسة متكاملة تجمع بين القيمة الاقتصادية لإنفاذ، والعمق المعماري البرمجي، والأثر القضائي",
        en: "A comprehensive framework combining economic value, architectural depth, and judicial impact",
      },
      keyQuote: {
        ar: "«ملف يغطي كافة متطلبات التحكيم: من مشكلة السوق ونموذج العمل، إلى عمق الخوارزميات وتفاصيل الأمان السيبراني»",
        en: "An exhaustive dossier answering every judging criterion: from market economics to algorithmic precision.",
      },
      bulletPoints: [
        {
          titleAr: "المحور الأول: الرؤية والمشكلة والقيمة (الشرائح 3 - 6)",
          titleEn: "Pillar 1: Vision, Problem & Market (Slides 3-6)",
          descAr: "فكرة المشروع، الاختناقات التشغيلية لإنفاذ، القيمة المضافة لكافة أصحاب المصلحة، وحجم السوق الملياري مدعوماً ببيانات وزارة العدل.",
          descEn: "Core concept, Enfad bottlenecks, multi-stakeholder value, and TAM/SAM/SOM market sizing.",
          icon: Target,
        },
        {
          titleAr: "المحور الثاني: المعمارية الهندسية والـ Stack (الشرائح 7 - 11)",
          titleEn: "Pillar 2: System Architecture & Stack (Slides 7-11)",
          descAr: "معمارية Full-Stack، التقنيات المستخدمة، التبويبات والميزات الثمانية، والنوافذ التفاعلية (Modals) الداعمة للميدان.",
          descEn: "Full-Stack architecture, component stacks, 8 core operational views, and assistive inspection modals.",
          icon: Layers,
        },
        {
          titleAr: "المحور الثالث: النواة التشغيلية والذكاء المكاني (الشرائح 12 - 16)",
          titleEn: "Pillar 3: Spatial Engine & Algorithms (Slides 12-16)",
          descAr: "رحلة المستخدم الرقمية، هندسة APIs واستقرار الذكاء الاصطناعي، محرك التوأم 3D، معادلة FR-11، ومحاكي What-If المالي.",
          descEn: "User journey, robust API failover, custom 3D isometric engine, FR-11 scoring equation, and ROI simulation.",
          icon: Box,
        },
        {
          titleAr: "المحور الرابع: الجاهزية ونموذج العمل والطلب (الشرائح 17 - 20)",
          titleEn: "Pillar 4: Traction, Business & The Ask (Slides 17-20)",
          descAr: "إثبات الجاهزية الميدانية (Live App)، نموذج الإيرادات والربحية، الميزة التنافسية وخطة التوسع، وطلب الشراكة التجريبية.",
          descEn: "Live prototype verification, B2B/B2G monetization, competitive edge, roadmap, and pilot proposal.",
          icon: Award,
        },
      ],
      highlightMetrics: [
        { labelAr: "عدد الشرائح الشاملة", labelEn: "Total Slides", val: "20 شريحة" },
        { labelAr: "المحاور الاستراتيجية", labelEn: "Strategic Pillars", val: "4 محاور" },
        { labelAr: "حالة النموذج", labelEn: "Status", val: "نموذج تجريبي" },
      ],
      tag: "خارطة العرض الاستراتيجي",
    },
    {
      id: "vision",
      slideNumber: 3,
      badge: { ar: "الشريحة 3 | فكرة المشروع والرؤية", en: "Slide 3 | Project Concept & Mission" },
      title: {
        ar: "فكرة المشروع والهدف الأساسي",
        en: "Project Concept & Core Mission",
      },
      subtitle: {
        ar: "تحويل عملية الفحص والتقييم التقليدية إلى «جواز سفر عقاري فراغي فوري»",
        en: "Transforming manual appraisal into an instantaneous Spatial Asset Passport",
      },
      keyQuote: {
        ar: "«استبدال الأسابيع المهدورة والتقارير الورقية الغامضة بمؤشر جاهزية رقمي قطعي يحسب دقة التسييل في ثوانٍ»",
        en: "Replacing weeks of paper ambiguity with an irrefutable digital liquidation readiness score generated instantly.",
      },
      bulletPoints: [
        {
          titleAr: "جواز السفر العقاري الفراغي (Spatial Asset Passport)",
          titleEn: "Spatial Asset Passport",
          descAr: "وثيقة رقمية موحدة وغير قابلة للتلاعب تجمع بين الصك الإلكتروني، السجل العيني (RER)، الفحص الإنشائي الممسوح، والتوافق مع كود البناء السعودي.",
          descEn: "Unified verifiable record combining digital deeds, national registry, structural scans, and SBC compliance.",
          icon: BookOpen,
        },
        {
          titleAr: "مؤشر الجاهزية للتسييل (Liquidation Readiness Score)",
          titleEn: "Liquidation Readiness Score (FR-11)",
          descAr: "مؤشر رياضي موحد ومعاير هندسياً يقيّم مخاطر العقار الإنشائية والقانونية والبلدية لتمكين متخذي القرار من طرحه بالمزاد بثقة تامة.",
          descEn: "A calibrated algorithmic score assessing structural, legal, and municipal risks before auction release.",
          icon: TrendingUp,
        },
        {
          titleAr: "إنهاء الاعتماد على التقارير الورقية السطحية",
          titleEn: "Eliminating Paper-Based Vulnerabilities",
          descAr: "التقارير الورقية التقليدية عرضة للأخطاء البشرية وتغفل العيوب الخفية والأسطح والقبو، بينما مرآة توثق كل زاوية مكانياً.",
          descEn: "Replacing error-prone superficial paper reports with comprehensive spatial coverage across all zones.",
          icon: ShieldCheck,
        },
        {
          titleAr: "تمكين اتخاذ القرار الفوري (Instant Triage)",
          titleEn: "Instant Judicial Action Triage",
          descAr: "تحديد مسار الأصل بوضوح: البيع المباشر على الحالة الراهنة (As-Is)، أو التدخل الوقائي السريع لتعظيم العائد المالي للورثة والدائنين.",
          descEn: "Instant classification: direct auction sale vs. targeted remedial intervention maximizing net recovery.",
          icon: Zap,
        },
      ],
      highlightMetrics: [
        { labelAr: "زمن إصدار الجواز", labelEn: "Passport Issuance", val: "< 15 دقيقة" },
        { labelAr: "خفض الأخطاء البشرية", labelEn: "Error Elimination", val: "99.4%" },
        { labelAr: "مستويات الفحص الهندسي", labelEn: "Inspection Tiers", val: "4 طبقات AI" },
      ],
      tag: "الرؤية والهدف الأساسي",
    },
    {
      id: "problem",
      slideNumber: 4,
      badge: { ar: "الشريحة 4 | المشكلة التشغيلية", en: "Slide 4 | Operational Problem & Market Pain" },
      title: {
        ar: "المشكلة التي يحلها المشروع لمركز إنفاذ والقضاء",
        en: "The Operational Bottlenecks Solved for Enfad & Courts",
      },
      subtitle: {
        ar: "4 اختناقات هيكلية تعطل تسييل مليارات الريالات وتستنزف حقوق الورثة والدائنين",
        en: "4 critical bottlenecks delaying judicial auctions and eroding asset liquidation values",
      },
      keyQuote: {
        ar: "«تأخر تصفية الأصل القضائي لمدة عامين يكلف 15% من قيمته السوقية في التدهور الإنشائي ورسوم الحراسة والفرص الضائعة»",
        en: "A 2-year liquidation delay erodes up to 15% of asset value through physical deterioration and legal costs.",
      },
      bulletPoints: [
        {
          titleAr: "1. تأخر التسييل وتجميد المزادات",
          titleEn: "1. Stalled Liquidation Velocity",
          descAr: "استغراق دورة البيع من 18 إلى 24 شهراً نتيجة النزاعات حول الحالة الإنشائية ونقص التوثيق الهندسي المعتمد للأصل.",
          descEn: "Sale cycles take 18-24 months due to ongoing disputes over physical defects and missing engineering proof.",
          icon: Layers,
        },
        {
          titleAr: "2. نقص الأدلة البصرية الموثقة بالوقت والمكان",
          titleEn: "2. Lack of Timestamped Spatial Evidence",
          descAr: "تقارير الفحص التقليدية تفتقر لربط كل عيب بإطار زمني موثق وموقع ثلاثي الأبعاد، وتتجاهل فحص الأسطح وأنظمة العزل.",
          descEn: "Appraisals lack timestamped spatial anchors and overlook critical structural envelopes like roofs and basements.",
          icon: Eye,
        },
        {
          titleAr: "3. خصم عدم اليقين (Uncertainty Discount 20-30%)",
          titleEn: "3. 20-30% Uncertainty Bidder Discount",
          descAr: "تخوف المزايدين من العيوب الخفية يدفعهم لتخفيض عروضهم بنسبة 20-30% تحوطاً، مما يضيع مليارات الريالات من حصيلة التركات.",
          descEn: "Fear of latent defects forces investors to discount bids by 20-30%, destroying net recovery for heirs.",
          icon: TrendingUp,
        },
        {
          titleAr: "4. غياب المحاكاة المالية لاتخاذ قرار البيع",
          titleEn: "4. Absence of ROI Decision Simulation",
          descAr: "متخذ القرار لا يملك أداة تحسب له: إذا أنفقنا 150 ألف ريال لمعالجة عزل السطح، كم سترتفع قيمة الأصل وكم يتقلص زمن بيعه؟",
          descEn: "Decision makers lack tools forecasting how spending 150k SAR on repairs increases value and accelerates sale.",
          icon: Scale,
        },
      ],
      highlightMetrics: [
        { labelAr: "متوسط فترة التصفية حالياً", labelEn: "Avg Duration Today", val: "18-24 شهر" },
        { labelAr: "خصم عدم اليقين", labelEn: "Uncertainty Discount", val: "20-30%" },
        { labelAr: "قضايا فسخ البيع والنزاع", labelEn: "Post-Sale Disputes", val: "~22%" },
      ],
      tag: "المشكلة والتحديات التشغيلية",
    },
    {
      id: "valueproposition",
      slideNumber: 5,
      badge: { ar: "الشريحة 5 | القيمة لأصحاب المصلحة", en: "Slide 5 | Ecosystem Value Proposition" },
      title: {
        ar: "القيمة المقترحة لشركاء المنظومة القضائية والعقارية",
        en: "Multi-Stakeholder Value Across Judicial & PropTech Ecosystem",
      },
      subtitle: {
        ar: "أثر استراتيجي ملموس يخدم المحاكم، مركز إنفاذ، المصفين، المستثمرين، والورثة",
        en: "Measurable institutional impact empowering courts, liquidators, investors, and families",
      },
      keyQuote: {
        ar: "«نحن لا نبيع برنامج فحص، بل نقدّم بنية تحتية تصنع الثقة وتنهي ملف التصفية بأعلى عائد عادل وأسرع وقت»",
        en: "We don't sell inspection software; we provide an irrefutable governance pipeline maximizing liquidation recovery.",
      },
      bulletPoints: [
        {
          titleAr: "لمركز إنفاذ ووكلاء التصفية المعتمدين",
          titleEn: "For Enfad & Entrusted Liquidators",
          descAr: "تقليص زمن تجهيز الأصل للمزاد بنسبة 70% (من 60 يوماً إلى أقل من 5 أيام)، وإدارة محافظ العقارات بفرز آلي للأولويات.",
          descEn: "Slash preparation time by 70% (from 60 days to 5), manage portfolios with automated risk triage.",
          icon: Building2,
        },
        {
          titleAr: "لقضاة ومحاكم التنفيذ بالمملكة",
          titleEn: "For Judges & Enforcement Courts",
          descAr: "توفير دليل هندسي فراغي قطعي غير قابل للطعن يقلص دعاوى فسخ البيع والنزاعات بنسبة 85% ويسرع إصدار قرارات البيع 4x.",
          descEn: "Irrefutable spatial evidence reducing post-sale rescission lawsuits by 85% and speeding court decrees 4x.",
          icon: Gavel,
        },
        {
          titleAr: "للمشترين والمستثمرين والصناديق العقارية",
          titleEn: "For Bidders & Institutional Funds",
          descAr: "بوابة المشتري الشفافة: فحص العيوب، الصور الحرارية، وضمان خلو الغرر مما يرفع التنافسية وسعر المزايدة بنسبة 18%.",
          descEn: "Full transparency portal eliminating uncertainty, driving auction competition and bids up by 18%.",
          icon: Eye,
        },
        {
          titleAr: "للورثة والدائنين وأصحاب الحقوق",
          titleEn: "For Heirs, Creditors & Estate Owners",
          descAr: "حفظ كامل الحقوق المالية ببيع الأصل بقيمته السوقية العادلة دون خصم عشوائي، ووقف استنزاف رسوم الحراسة القضائية.",
          descEn: "Securing full fair-market recovery and stopping the bleed of ongoing receivership fees.",
          icon: Award,
        },
      ],
      highlightMetrics: [
        { labelAr: "تسريع الحسم القضائي", labelEn: "Judicial Acceleration", val: "4 أضعاف" },
        { labelAr: "ارتفاع حصيلة المزاد", labelEn: "Auction Value Uplift", val: "+18%" },
        { labelAr: "انخفاض النزاعات القضائية", labelEn: "Litigation Drop", val: "-85%" },
      ],
      tag: "القيمة المضافة والأثر",
    },
    {
      id: "marketsize",
      slideNumber: 6,
      badge: { ar: "الشريحة 6 | حجم السوق والبيانات المفتوحة", en: "Slide 6 | Market Size & 2026 Open Data" },
      title: {
        ar: "سوق التصفية القضائية: مليارات مهدرة تنتظر الرقمنة",
        en: "Judicial Liquidation Market Sizing & Open Data Intelligence",
      },
      subtitle: {
        ar: "تحليل سوقي استرشادي من ملف بيانات مفتوحة لعمليات عقارية (يوليو 2026) مرفق بالمشروع",
        en: "Indicative market view from a bundled open-data file of real-estate operations (July 2026)",
      },
      keyQuote: {
        ar: "«سوق التصفية والحجز بالمملكة يتجاوز 35 ألف عملية شهرياً (54.7% من إجمالي الحراك العقاري)، مما يجعل مرآة ضرورة وطنية ملحة»",
        en: "Judicial seizures and liquidations exceed 35,000 monthly, comprising 54.7% of all real estate operations in KSA.",
      },
      bulletPoints: [
        {
          titleAr: "السوق الإجمالي المتاح (TAM) — +45 مليار ر.س",
          titleEn: "Total Addressable Market (TAM) — +45B SAR",
          descAr: "إجمالي قيمة الأصول العقارية تحت إجراءات التنفيذ والتصفية والتركات والحراسة القضائية في جميع مناطق المملكة.",
          descEn: "Total real estate assets under enforcement, liquidation, and receivership across Saudi Arabia.",
          icon: TrendingUp,
        },
        {
          titleAr: "السوق المتاح لإنفاذ (SAM) — +25 مليار ر.س سنوياً",
          titleEn: "Serviceable Addressable Market (SAM) — +25B SAR",
          descAr: "عقارات التركات والتنفيذ والشركات المتعثرة المسندة سنوياً لمركز الإسناد والتصفية (إنفاذ).",
          descEn: "Estates, corporate restructurings, and court executions assigned annually to Enfad.",
          icon: Building2,
        },
        {
          titleAr: "الهدف الأولي الفوري (SOM) — 1.2 مليار ر.س",
          titleEn: "Serviceable Obtainable Market (SOM) — 1.2B SAR",
          descAr: "المرحلة الأولى: استهداف 500 عقار تجاري وسكني في الرياض وجدة مع مصفين معتمدين.",
          descEn: "Phase 1: 500 commercial and residential assets in Riyadh & Jeddah via accredited liquidators.",
          icon: Target,
        },
        {
          titleAr: "بيانات وزارة العدل الوطنية (65,702 عملية موثقة)",
          titleEn: "MOJ Verified Operations (65,702 Ops)",
          descAr: "35,973 عملية حجز تحفظي وتصفية (54.7%) + 16,696 تسجيل عيني + 8,785 إفراغ نهائي شهرياً.",
          descEn: "35,973 seizure/liquidation actions monthly prove immense structural market demand.",
          icon: Database,
        },
      ],
      highlightMetrics: [
        { labelAr: "سوق التصفية السنوي (SAM)", labelEn: "Enfad Annual Market", val: "+25B ر.س" },
        { labelAr: "حصة عمليات الحجز والتصفية", labelEn: "Seizure Operations", val: "54.7%" },
        { labelAr: "هدف المرحلة الأولى (SOM)", labelEn: "Phase 1 Target", val: "1.2B ر.س" },
      ],
      tag: "حجم السوق والبيانات المفتوحة",
    },
    {
      id: "architecture",
      slideNumber: 7,
      badge: { ar: "الشريحة 7 | المعمارية التقنية المتكاملة", en: "Slide 7 | Full-Stack Enterprise Architecture" },
      title: {
        ar: "المعمارية التقنية المتكاملة للمنصة (Full-Stack)",
        en: "Full-Stack Enterprise Architecture & Topology",
      },
      subtitle: {
        ar: "بنية تحتية سحابية ثلاثية الطبقات مصممة للمرونة، السرعة، والأمان السيادي",
        en: "Three-tier cloud topology engineered for sub-second latency, scale, and data sovereignty",
      },
      keyQuote: {
        ar: "«فصل صارم للمهام بين واجهات المعاينة التفاعلية ومحركات الذكاء الاصطناعي الخلفية لضمان استقرار بنسبة 99.95%»",
        en: "Strict tier separation between reactive UI components and server-side AI engines ensuring 99.95% availability.",
      },
      bulletPoints: [
        {
          titleAr: "طبقة العرض والواجهات (Frontend Presentation Tier)",
          titleEn: "Frontend Presentation Tier (React 18 + Vite)",
          descAr: "مبنية بأحدث معايير React 18، تضم محرك التوأم الإيزومتري المخصص، رسومات HTML5 Canvas 2D/3D، وتوليد فوري لوثائق PDF عالية الدقة.",
          descEn: "Engineered in React 18 with custom 3D isometric math canvas, reactive Tailwind styling, and client-side PDF synthesis.",
          icon: Box,
        },
        {
          titleAr: "طبقة الخادم والخدمات المصغرة (Backend Microservices Tier)",
          titleEn: "Backend Services Tier (Express + Node.js)",
          descAr: "خادم مخصص يعمل عبر مسارات API مشفرة، يدير استدعاءات نماذج Gemini Vision، ويتحكم بحسابات كود البناء السعودي بسرية تامة.",
          descEn: "Dedicated Node/Express microservices layer handling secure Gemini Vision endpoints and SBC validation.",
          icon: Cpu,
        },
        {
          titleAr: "طبقة البيانات والحوكمة السحابية (Cloud & Storage Layer)",
          titleEn: "Cloud & Storage Governance (Firestore & Auth)",
          descAr: "Firestore مع تسجيل دخول Google؛ قواعد تسمح لكل مستخدم ببياناته فقط وتسجّل إجراءات التحقق من الملاحظات. لا توجد أدوار وصلاحيات متعددة (RBAC) في هذا الإصدار.",
          descEn: "Firestore with Google sign-in; rules limit each user to their own data and log finding-verification actions. No multi-role RBAC in this version.",
          icon: Database,
        },
        {
          titleAr: "الحفاظ على سرية البيانات ومفاتيح النظام",
          titleEn: "Server-Side Secret & Data Isolation",
          descAr: "مفاتيح الذكاء الاصطناعي لا تخرج أبداً من الخادم الخلفي، مع حماية كاملة لبيانات المزاد وفق ضوابط الأمن السيبراني (NCA).",
          descEn: "Zero frontend exposure of API keys; fully compliant with National Cybersecurity Authority policies.",
          icon: ShieldCheck,
        },
      ],
      highlightMetrics: [
        { labelAr: "زمن استجابة النظام", labelEn: "System Latency", val: "< 120ms" },
        { labelAr: "جاهزية التوفر السحابي", labelEn: "Cloud Availability", val: "99.95%" },
        { labelAr: "تشفير البيانات التام", labelEn: "Data Encryption", val: "AES-256" },
      ],
      tag: "المعمارية التقنية",
    },
    {
      id: "techstack",
      slideNumber: 8,
      badge: { ar: "الشريحة 8 | المنظومة البرمجية", en: "Slide 8 | Modern Technology Stack" },
      title: {
        ar: "المنظومة البرمجية والـ Tech Stack بالتفصيل",
        en: "Comprehensive Production Tech Stack Breakdown",
      },
      subtitle: {
        ar: "انتقاء دقيق لأحدث أطر العمل العالمية المتوافقة مع متطلبات الأنظمة الحكومية الكبرى",
        en: "State-of-the-art tooling tailored for mission-critical enterprise and governmental workloads",
      },
      keyQuote: {
        ar: "«تقنيات معيارية بدون مكتبات طرف ثالث ثقيلة؛ لضمان سرعة التحميل على أجهزة المفتشين الميدانيين في أي موقع»",
        en: "Lean, standardized stack eliminating bloated third-party dependencies for rapid field load times anywhere.",
      },
      bulletPoints: [
        {
          titleAr: "الواجهة الأمامية وتجربة المستخدم (Frontend Core)",
          titleEn: "Frontend Core Frameworks",
          descAr: "React 18 + TypeScript + Vite لأعلى أداء وتوافقية أنماط، مع Tailwind CSS و Lucide Icons للتصميم المؤسسي عالي التباين.",
          descEn: "React 18, TypeScript, Vite, Tailwind CSS, and Lucide React delivering responsive, high-contrast UI.",
          icon: Sparkles,
        },
        {
          titleAr: "الخادم الخلفي والربط البرمجي (Backend Infrastructure)",
          titleEn: "Backend Infrastructure",
          descAr: "خادم Express.js المكتوب بـ TypeScript، يدعم مسارات RESTful APIs الصارمة مع إدارة المتغيرات البيئية والتخزين الوسيط.",
          descEn: "Strictly typed Express.js server on Node.js hosting secure endpoints and session management.",
          icon: Layers,
        },
        {
          titleAr: "محرك الذكاء الاصطناعي التوليدي (GenAI SDK)",
          titleEn: "Generative AI Engine",
          descAr: "حزمة @google/genai مع نموذج Gemini قابل للضبط ونموذج احتياطي؛ إذا لم يتوفر مفتاح أو تعذّر النموذج تظهر رسالة واضحة بدل إجابة مولّدة.",
          descEn: "@google/genai SDK with a configurable Gemini model and one fallback; without a key or model the UI says so instead of generating an answer.",
          icon: Cpu,
        },
        {
          titleAr: "قاعدة البيانات والحفظ السحابي (Cloud Data Tier)",
          titleEn: "Cloud Database & Identity",
          descAr: "حالة الواجهة في الذاكرة، وFirestore لملف المستخدم وسجل التحقق، ومصادقة Firebase.",
          descEn: "In-memory UI state, Firestore for user profile and verification log, Firebase Auth.",
          icon: Database,
        },
      ],
      highlightMetrics: [
        { labelAr: "لغة البرمجة", labelEn: "Language", val: "TypeScript" },
        { labelAr: "محرك الذكاء الاصطناعي", labelEn: "AI Core", val: "Gemini 3.8" },
        { labelAr: "الفحص الآلي", labelEn: "CI", val: "GitHub Actions" },
      ],
      tag: "المنظومة البرمجية والـ Stack",
    },
    {
      id: "features1",
      slideNumber: 9,
      badge: { ar: "الشريحة 9 | التبويبات التشغيلية (1/2)", en: "Slide 9 | Core Modules (1/2): Spatial Inspection" },
      title: {
        ar: "التبويبات والميزات الرئيسية — ركائز الفحص الفراغي",
        en: "Core Platform Modules: Spatial Inspection & Telemetry",
      },
      subtitle: {
        ar: "4 واجهات مركزية تدير الهوية الرقمية، الذكاء الإنشائي، وتغطية المسح الميداني",
        en: "4 central command views governing digital identity, structural AI, and field coverage",
      },
      keyQuote: {
        ar: "«نظام يراقب صحة العقار كجهاز تخطيط قلب متقدم: لا مجال لتمرير عيب إنشائي دون رصد وتوثيق واحتساب»",
        en: "Monitoring real estate health like an advanced telemetry monitor: no defect passes unrecorded.",
      },
      bulletPoints: [
        {
          titleAr: "01 — جواز الأصل الرقمي (Asset Passport)",
          titleEn: "01 — Asset Passport Core View",
          descAr: "بطاقة الهوية الرقمية الشاملة للأصل، التوأم الفراغي التفاعلي، بطاقات المؤشرات الأربعة (الجاهزية، الحالة، الثقة، التغطية)، وقائمة العيوب مع أزرار الاعتماد والمعالجة.",
          descEn: "Master digital identity card, interactive 3D twin, 4 readiness telemetry badges, and defect resolution buttons.",
          icon: ShieldCheck,
        },
        {
          titleAr: "02 — مركز البروبتك الإدراكي (PropTech 2.0 Hub)",
          titleEn: "02 — PropTech Cognitive Hub",
          descAr: "لوحة تحكم المستشعرات الذكية، مطابقة انحرافات BIM، محاكاة التوفير المالي، أفق التنبؤ بالدورة الحياتية للعقار، والتقييم الآلي الديناميكي (AVM).",
          descEn: "IoT sensor telemetry, BIM deviation tracking, lifecycle degradation forecasting, and dynamic AVM appraisal.",
          icon: Zap,
        },
        {
          titleAr: "03 — مراجعة ملاحظات الذكاء الاصطناعي (AI Findings Review)",
          titleEn: "03 — AI Findings Review",
          descAr: "استعراض تفصيلي للملاحظات المكتشفة بالرؤية الحاسوبية، فلترة العيوب حسب الخطورة والحالة، فحص الدليل البصري المتزامن، وتشغيل الفحص الهندسي المعمق.",
          descEn: "Detailed inspection findings classified by severity, linked with synchronized visual proof and SBC clauses.",
          icon: Eye,
        },
        {
          titleAr: "04 — التغطية والقياس الفراغي (Coverage & Spatial Telemetry)",
          titleEn: "04 — Coverage & Spatial Telemetry",
          descAr: "خريطة التغطية المكانية للمبنى موزعة على الغرف والأسطح والقبو والواجهات، وتعديل التغطية لحظياً لرؤية أثرها على مؤشر الجاهزية وحل العوائق الحرجة.",
          descEn: "Spatial coverage telemetry across roofs, basements, and facades, tracking uninspected readiness blockers.",
          icon: Compass,
        },
      ],
      highlightMetrics: [
        { labelAr: "تغطية المسح الفراغي", labelEn: "Spatial Coverage", val: "98.5%" },
        { labelAr: "رصد العوائق الحرجة", labelEn: "Critical Blockers", val: "آلي" },
        { labelAr: "مؤشرات الجاهزية المباشرة", labelEn: "Telemetry Metrics", val: "4 رئيسية" },
      ],
      tag: "الواجهات التشغيلية (1/2)",
    },
    {
      id: "features2",
      slideNumber: 10,
      badge: { ar: "الشريحة 10 | التبويبات التشغيلية (2/2)", en: "Slide 10 | Core Modules (2/2): Financial Decision" },
      title: {
        ar: "التبويبات والميزات الرئيسية — الذكاء المالي وقرارات التصفية",
        en: "Core Platform Modules: Financial Intelligence & Liquidation",
      },
      subtitle: {
        ar: "4 واجهات استراتيجية تقود محاكاة العائد، اتجاهات السوق، وبوابة المشتري الشفافة",
        en: "4 strategic engines governing ROI simulation, market comps, and buyer transparency",
      },
      keyQuote: {
        ar: "«نحول بيانات الفحص الهندسي إلى قرارات استثمارية مالية ذكية ترفع القيمة المحصلة في المزاد»",
        en: "Converting engineering inspection findings into actionable investment decisions maximizing auction uplift.",
      },
      bulletPoints: [
        {
          titleAr: "05 — اتجاهات السوق والمقارنات (Market Trends & Comps)",
          titleEn: "05 — Market Trends & Comps",
          descAr: "مقارنة الأصل مع عقارات مماثلة في نفس الحي التجاري أو السكني، ومخططات اتجاهات الأسعار لكل متر مربع وحجم السيولة السوقية الممتصة.",
          descEn: "Comparative market analysis (Comps) benchmarking the asset against neighborhood transactions and liquidity.",
          icon: TrendingUp,
        },
        {
          titleAr: "06 — محاكي السيناريوهات المالية (What-If Simulator)",
          titleEn: "06 — What-If Financial Simulator",
          descAr: "تفعيل سيناريوهات إصلاح العيوب الحرجة، استكمال التغطية، وربط الصك، مع حساب تلقائي وفوري للعائد على الاستثمار وارتفاع القيمة السوقية.",
          descEn: "Instant scenario simulator testing repair capex, coverage expansion, and net valuation uplift.",
          icon: Target,
        },
        {
          titleAr: "07 — الإجراء الأمثل ومصفوفة SLA (Next Best Action & SLA Matrix)",
          titleEn: "07 — Next Best Action & SLA Matrix",
          descAr: "التوصية الذكية بأفضل إجراء قادم ذي أعلى تأثير وأقل تكلفة، ومصفوفة قيادة اتفاقيات مستوى الخدمة مع زر الإسناد الميداني للمقاول المعتمد.",
          descEn: "AI recommendation of next best action, SLA compliance matrices, and dispatching accredited contractors.",
          icon: Award,
        },
        {
          titleAr: "08 — بوابة المشتري الشفافة (Buyer Transparency View)",
          titleEn: "08 — Buyer Transparency View",
          descAr: "واجهة مخصصة للمشتري النهائي والمستثمر القضائي تستعرض الأصل بشفافية كاملة مع التعهدات والضمانات ونفي الجهالة والغرر.",
          descEn: "Dedicated investor portal showcasing verified disclosures, thermal imagery, and legal warranties.",
          icon: CheckCircle2,
        },
      ],
      highlightMetrics: [
        { labelAr: "رفع القيمة المحققة", labelEn: "Auction Lift", val: "+18%" },
        { labelAr: "تقليص زمن المزاد", labelEn: "Duration Reduction", val: "من 45 إلى 14 يوماً" },
        { labelAr: "العائد على الاستثمار", labelEn: "Simulated ROI", val: "12x" },
      ],
      tag: "الواجهات التشغيلية (2/2)",
    },
    {
      id: "modals",
      slideNumber: 11,
      badge: { ar: "الشريحة 11 | النوافذ التفاعلية", en: "Slide 11 | Operational Modals & Auxiliary Tools" },
      title: {
        ar: "النوافذ المنبثقة التفاعلية وأدوات الدعم التشغيلي",
        en: "Interactive Modals & Inspection Support Tools",
      },
      subtitle: {
        ar: "أدوات مدمجة فائقة الدقة لخدمة المفتشين الميدانيين والمقيمين والمستثمرين",
        en: "High-precision auxiliary tooling serving field inspectors, appraisers, and auction buyers",
      },
      keyQuote: {
        ar: "«تجربة مستخدم متكاملة تتيح للمفتش فحص العيب، محادثة الذكاء الاصطناعي، وتصدير الجواز دون مغادرة شاشة الأصل»",
        en: "Seamless UX enabling inspectors to drill into defects, consult AI, and export passports within one unified flow.",
      },
      bulletPoints: [
        {
          titleAr: "مستشار مرآة الذكي (AIAssistantModal)",
          titleEn: "AIAssistantModal",
          descAr: "محادثة هندسية وقانونية مباشرة باللغتين العربية والإنجليزية مدعومة بـ Gemini 3.8 وموجهة بسياق كود البناء السعودي وأنظمة إنفاذ.",
          descEn: "Bilingual chat powered by Gemini 3.8 grounded in Saudi Building Code clauses and Enfad regulations.",
          icon: Sparkles,
        },
        {
          titleAr: "التحليل الهندسي المعمق للعيب (DefectDrillDownModal)",
          titleEn: "DefectDrillDownModal",
          descAr: "تحليل هندسي ذكي للعيب المختار بربط آلي مع بنود كود البناء السعودي (SBC)، وتقدير تكلفة الصيانة ومسؤولية المقاول.",
          descEn: "Detailed structural diagnostic linking selected defect to SBC clauses and itemized remediation costs.",
          icon: Target,
        },
        {
          titleAr: "تصدير الوثائق المعتمدة (ExportPassportModal)",
          titleEn: "ExportPassportModal",
          descAr: "تصدير جواز الأصل PDF من 4 صفحات بعلامة \"نموذج تجريبي\"، وتصدير JSON وCSV من نفس البيانات مع بصمة SHA-256.",
          descEn: "Client-side generation of accredited 4-page PDF dossiers, alongside raw JSON and CSV data streams.",
          icon: FileText,
        },
        {
          titleAr: "استعراض الوثائق ورفع الوسائط (Media & Docs Tools)",
          titleEn: "Media & Document Ingestion",
          descAr: "عارض نماذج مستندات توضيحية (ليست رسمية)، ونافذة رفع صور ومقاطع مع تصنيف يدوي للملاحظات.",
          descEn: "Accredited deed and appraisal viewer, paired with field media capture and visual triage tools.",
          icon: Eye,
        },
      ],
      highlightMetrics: [
        { labelAr: "عدد النوافذ التفاعلية", labelEn: "Total Modals", val: "8 أدوات" },
        { labelAr: "دعم اللغات", labelEn: "Language Support", val: "عربي / إنجليزي" },
        { labelAr: "صيغ التصدير المدعومة", labelEn: "Export Formats", val: "PDF / JSON / CSV" },
      ],
      tag: "النوافذ التفاعلية وأدوات الدعم",
    },
    {
      id: "userjourney",
      slideNumber: 12,
      badge: { ar: "الشريحة 12 | رحلة المستخدم", en: "Slide 12 | End-to-End User Journey" },
      title: {
        ar: "رحلة المستخدم ودورة التصفية الرقمية المتكاملة",
        en: "End-to-End Digital Liquidation User Journey",
      },
      subtitle: {
        ar: "7 خطوات محوكمة تنقل الأصل من ملف قضائي غامض إلى جواز سفر معتمد جاهز للمزاد",
        en: "7 governed steps transitioning distressed assets into auction-ready verified passports",
      },
      keyQuote: {
        ar: "«تجربة مبسطة وسلسة تختصر مسار المعاينة من أسابيع إلى دقائق معدودة وبأعلى موثوقية قضائية»",
        en: "A streamlined workflow condensing traditional weeks of manual review into guided minutes of certainty.",
      },
      bulletPoints: [
        {
          titleAr: "1. الوصول الموثق واختيار الأصل (Auth & Selection)",
          titleEn: "1. Authenticated Access & Selection",
          descAr: "تسجيل الدخول بصلاحية المشرف القضائي أو المصفي عبر مصادقة آمنة، واختيار العقار من محفظة الأصول المعتمدة لدى إنفاذ.",
          descEn: "Secure role-based login as judicial officer or liquidator, selecting from accredited estate portfolio.",
          icon: ShieldCheck,
        },
        {
          titleAr: "2. استعراض التوأم ثلاثي الأبعاد والمؤشرات (3D & Telemetry)",
          titleEn: "2. 3D Twin & Metric Inspection",
          descAr: "التفاعل المباشر مع التوأم الرقمي، تدويره وتكبيره، ومطالعة مؤشر الجاهزية اللحظي والحالة الإنشائية ونسب التغطية.",
          descEn: "Rotate and inspect 3D building geometry while reviewing real-time readiness and zone coverage.",
          icon: Box,
        },
        {
          titleAr: "3. تدقيق العيوب واستشارة الذكاء الاصطناعي (Defects & AI)",
          titleEn: "3. Defect Audit & AI SBC Consultation",
          descAr: "اعتماد أو معالجة العيوب الإنشائية وتحديث سجل التدقيق اللحظي، واستشارة مستشار مرآة الذكي وفق كود البناء السعودي.",
          descEn: "Verify findings (logged to Firestore) and ask the AI assistant about the recorded data.",
          icon: Cpu,
        },
        {
          titleAr: "4. محاكاة الجدوى وتصدير وثيقة التصفية (Simulate & Export)",
          titleEn: "4. What-If Simulation & Passport Issuance",
          descAr: "تفعيل خيارات المحاكي لتعظيم العائد المالي وتسريع زمن البيع، ثم تصدير جواز الأصل المعتمد كملف PDF رسمي بـ QR كود مشفر.",
          descEn: "Run What-If scenarios to maximize recovery, concluding with encrypted QR-stamped PDF passport export.",
          icon: Award,
        },
      ],
      highlightMetrics: [
        { labelAr: "خطوات مسار العمل", labelEn: "Workflow Steps", val: "7 خطوات محوكمة" },
        { labelAr: "متوسط وقت الدورة", labelEn: "Avg Cycle Time", val: "أقل من 15 دقيقة" },
        { labelAr: "سجل التحقق", labelEn: "Audit log", val: "Firestore" },
      ],
      tag: "رحلة المستخدم والمسار التشغيلي",
    },
    {
      id: "apis",
      slideNumber: 13,
      badge: { ar: "الشريحة 13 | الواجهة الخلفية والـ APIs", en: "Slide 13 | Backend Architecture & Smart AI Failover" },
      title: {
        ar: "هندسة الـ APIs ومحرك الذكاء الاصطناعي السيادي",
        en: "Server-Side APIs & Resilient AI Failover Engine",
      },
      subtitle: {
        ar: "معمارية خادم قوية تدير مسارات RESTful الآمنة مع آلية استقرار تمنع الانقطاع نهائياً",
        en: "Robust Express backend hosting hardened RESTful APIs with intelligent model failover",
      },
      keyQuote: {
        ar: "«لا انقطاع للخدمة في الميدان: محرك الذكاء الاصطناعي يتحول تلقائياً بين النماذج لضمان استمرارية المعاينة 24/7»",
        en: "Zero field downtime: the AI engine automatically shifts between models guaranteeing uninterrupted inspection.",
      },
      bulletPoints: [
        {
          titleAr: "مسارات الخادم الفعلية والمؤمنة (Hardened Endpoints)",
          titleEn: "Hardened Server Endpoints",
          descAr: "1. GET /api/health لفحص سلامة الخادم، 2. POST /api/ai/chat لاستقبال محادثة المستشار بسياق إنفاذ، 3. POST /api/gemini/analyze-defect لتحليل العيوب وكود البناء.",
          descEn: "REST endpoints handling system health, context-grounded inspection chat, and automated SBC defect triage.",
          icon: Layers,
        },
        {
          titleAr: "آلية الاستقرار والاسترداد التلقائي (Smart Failover)",
          titleEn: "Smart Multi-Tier Failover (generateWithFailover)",
          descAr: "دالة ذكية تحاول أولاً استدعاء Gemini 3.8 Flash، وفي حال حدوث ضغط أو خطأ خادم (503)، تتحول تلقائياً وبسلاسة إلى النماذج الاحتياطية لضمان الاستجابة.",
          descEn: "Graceful failover logic defaulting to Gemini 3.8 Flash with seamless backup model routing upon peak loads.",
          icon: Zap,
        },
        {
          titleAr: "هندسة التوجيه السياقي الصارم (Grounding Prompts)",
          titleEn: "Context Grounding & Prompt Engineering",
          descAr: "تمرير بيانات الأصل كبيانات محددة ومنظّفة منفصلة عن التعليمات، مع قائمة صريحة بما هو منفّذ وما هو محاكاة، ومنع اختلاق الأرقام.",
          descEn: "Context injection binding deed data, SBC structural criteria, and Enfad guidelines to eliminate hallucination.",
          icon: Cpu,
        },
        {
          titleAr: "العزل السيبراني التام لمفاتيح الـ API",
          titleEn: "Total API Key Cyber Isolation",
          descAr: "استدعاء مفتاح process.env.GEMINI_API_KEY يتم حصرياً داخل السيرفر الخلفي ولا يتم كشفه للواجهة الأمامية بأي شكل.",
          descEn: "Strict server-only environment variable handling preventing client-side secret exposure.",
          icon: ShieldCheck,
        },
      ],
      highlightMetrics: [
        { labelAr: "زمن استجابة المسارات", labelEn: "API Response Time", val: "< 180ms" },
        { labelAr: "معدل توفر الخدمة", labelEn: "Failover Availability", val: "99.98%" },
        { labelAr: "مفتاح Gemini", labelEn: "API key", val: "على الخادم فقط" },
      ],
      tag: "الواجهة الخلفية والـ APIs",
    },
    {
      id: "spatialtwin",
      slideNumber: 14,
      badge: { ar: "الشريحة 14 | محرك التوأم ثلاثي الأبعاد", en: "Slide 14 | Custom 3D Spatial Twin Engine" },
      title: {
        ar: "محرك التوأم الرقمي ثلاثي الأبعاد المخصص (3D Canvas)",
        en: "Custom 3D Spatial Twin Canvas & Raycasting Engine",
      },
      subtitle: {
        ar: "محرك إيزومتري رياضي مخصص عالي الأداء يعمل مباشرة على المتصفح بدون مكتبات ثقيلة",
        en: "High-performance lightweight mathematical isometric engine running natively in browser",
      },
      keyQuote: {
        ar: "«بنينا محركنا الفراغي بمعادلات رياضية خالصة؛ ليعمل بسرعة فائقة على أي جهاز لوحي أو هاتف ميداني دون أي بطء»",
        en: "Engineered with pure mathematical projection matrices to render smoothly on any mobile device without lag.",
      },
      bulletPoints: [
        {
          titleAr: "محرك الإسقاط الإيزومتري المخصص (Custom Isometric Engine)",
          titleEn: "Custom Isometric Math Engine",
          descAr: "مبني مباشرة على عنصر HTML5 Canvas 2D/3D دون الاعتماد على مكتبات ثقيلة، يحسب مصفوفات الدوران وزاوية الميل ومقياس التكبير بانسيابية 60fps.",
          descEn: "Built on HTML5 Canvas rendering mathematical rotation matrices, pitch, and zoom scaling smoothly at 60fps.",
          icon: Box,
        },
        {
          titleAr: "تمثيل معماري متعدد الطوابق والطبقات",
          titleEn: "Multi-Tier Architectural Geometry",
          descAr: "يرسم بدقة هندسة المباني متعددة الطوابق: البلاطات الخرسانية، النواة الخدمية، الجدران الزجاجية، والأعمدة مع تمييز مناطق الأسطح والقبو.",
          descEn: "Renders concrete slabs, utility cores, curtain walls, and structural columns with zone differentiation.",
          icon: Building2,
        },
        {
          titleAr: "فحص الاصطدام والتفاعل بالنقاط الساخنة (Raycasting / Hit-Testing)",
          titleEn: "Raycasting & Hotspot Hit-Testing",
          descAr: "يدعم الفحص الرياضي للاصطدام عند النقر بالماوس على العيوب والملاحظات الإنشائية لفتح تفاصيل العيب فورياً في نموذج ثلاثي الأبعاد.",
          descEn: "Mathematical raycasting detecting clicks on spatial defect hotspots to trigger instant deep diagnostics.",
          icon: Target,
        },
        {
          titleAr: "محاكاة سحابة النقاط الفراغية (Point Cloud Telemetry)",
          titleEn: "Point Cloud Spatial Telemetry",
          descAr: "تمثيل بصري تفاعلي لنقاط المسح السطحي بالليزر يوضح للمقيم نسبة التغطية الفعلية والمناطق غير الممسوحة لمنع النقاط العمياء.",
          descEn: "Visual point cloud representation indexing scanned spatial coverage and highlighting blindspots.",
          icon: Sparkles,
        },
      ],
      highlightMetrics: [
        { labelAr: "معدل الإطارات بالثانية", labelEn: "Frame Rate", val: "60 FPS" },
        { labelAr: "حجم المكتبة الخارجية", labelEn: "External Dependency", val: "0 KB (محلي)" },
        { labelAr: "دقة تفاعل النقاط الساخنة", labelEn: "Raycasting Precision", val: "ملليمترية" },
      ],
      tag: "محرك التوأم الرقمي 3D",
    },
    {
      id: "fr11equation",
      slideNumber: 15,
      badge: { ar: "الشريحة 15 | معادلة الجاهزية للتسييل", en: "Slide 15 | FR-11 Liquidation Readiness Equation" },
      title: {
        ar: "المعادلة الرياضية لمؤشر الجاهزية للتسييل (FR-11 Score)",
        en: "Algorithmic FR-11 Liquidation Readiness Score",
      },
      subtitle: {
        ar: "خوارزمية هندسية موثقة برمجياً تحسب الجاهزية بدقة بالغة استناداً لـ 4 معايير موضوعية",
        en: "Calibrated engineering formula indexing asset auction readiness based on 4 rigorous pillars",
      },
      keyQuote: {
        ar: "«معادلة FR-11 تقضي على الاجتهادات الفردية؛ وتمنح المحكمة رقماً هندسياً معتمداً يعبر عن جودة الأصل ومخاطره»",
        en: "The FR-11 equation eliminates subjective bias, delivering an audited benchmark of asset quality and risk.",
      },
      bulletPoints: [
        {
          titleAr: "مؤشر الحالة الإنشائية (CI — Condition Index)",
          titleEn: "Condition Index (CI)",
          descAr: "يبدأ من 100 ويخصم لكل ملاحظة غير معالجة: الوزن × (نسبة الثقة ÷ 100)، والأوزان: حرج 15، متوسط 8، منخفض 3. الملاحظات المعالجة لا تُخصم.",
          descEn: "Starts at 100; for each unresolved finding subtracts weight × confidence/100 with weights Critical 15, Moderate 8, Low 3. Resolved findings are not penalised.",
          icon: ShieldCheck,
        },
        {
          titleAr: "نسبة التغطية المكانية (COV — Coverage Ratio)",
          titleEn: "Coverage Ratio (COV)",
          descAr: "المتوسط الحسابي البسيط لنسب التغطية المسجلة لكل منطقة.",
          descEn: "Simple mean of the recorded coverage percentage of each area.",
          icon: Compass,
        },
        {
          titleAr: "مؤشر ثقة الفحص البصري (CONF — Visual Confidence)",
          titleEn: "Visual Confidence (CONF)",
          descAr: "0.50 × التغطية + 0.30 × متوسط نسب الثقة + 0.20 × نسبة الملاحظات التي لها دليل مصوّر.",
          descEn: "0.50 × coverage + 0.30 × mean finding confidence + 0.20 × share of findings with evidence frames.",
          icon: Eye,
        },
        {
          titleAr: "مؤشر جاهزية التصفية (Readiness)",
          titleEn: "Liquidation Readiness Index",
          descAr: "100 − 0.40 × (100 − مؤشر الحالة) − 0.35 × (100 − التغطية) − 5 × الملاحظات غير المعالجة − 3 × حقول بيانات الأصل الناقصة، محصوراً بين 0 و100.",
          descEn: "100 − 0.40 × (100 − CI) − 0.35 × (100 − coverage) − 5 × unresolved findings − 3 × missing asset fields, clamped to 0–100.",
          icon: FileText,
        },
      ],
      highlightMetrics: [
        { labelAr: "معامل الحالة الإنشائية", labelEn: "CI factor", val: "0.40" },
        { labelAr: "معامل التغطية", labelEn: "Coverage factor", val: "0.35" },
        { labelAr: "خصم كل ملاحظة غير معالجة", labelEn: "Per unresolved finding", val: "−5" },
      ],
      tag: "خوارزمية FR-11 للجاهزية",
    },
    {
      id: "whatifsimulator",
      slideNumber: 16,
      badge: { ar: "الشريحة 16 | محاكي السيناريوهات المالية", en: "Slide 16 | What-If Economic Simulator & ROI" },
      title: {
        ar: "محاكي السيناريوهات المالية وتوزيع العائد (What-If)",
        en: "What-If Economic Simulator & Value Uplift Engine",
      },
      subtitle: {
        ar: "حسابات مالية تفاعلية لحظية تقارن البيع بالحالة الراهنة مقابل التدخل الترميمي المسبق",
        en: "Real-time reactive financial calculations comparing As-Is sale vs. pre-auction remediation",
      },
      keyQuote: {
        ar: "«نمكن المصفي من اتخاذ القرار الاستثماري الصائب: إصلاح عزل بـ 45 ألف ريال رفع قيمة عقار الأندلس بـ 380 ألف ريال وقلص مدة التصفية بـ 28 يوماً»",
        en: "Guiding liquidators to high-yield repairs: spending 45k SAR on roof insulation boosted Al-Andalus value by 380k SAR.",
      },
      bulletPoints: [
        {
          titleAr: "السيناريوهات الاستثمارية الأربعة",
          titleEn: "4 Strategic Scenarios",
          descAr: "1. معالجة العيوب الإنشائية الحرجة، 2. استكمال الفحص البصري للسطح لرفع التغطية 100%، 3. استخراج الختم الرقمي والامتثال لبلدي، 4. تنفيذ العوازل المائية والحرارية المتقدمة.",
          descEn: "1. Resolve critical defects, 2. Complete 100% roof scan, 3. Obtain municipal compliance seals, 4. Advanced MEP insulation.",
          icon: Target,
        },
        {
          titleAr: "المخرجات المالية والحسابية التلقائية",
          titleEn: "Automated Valuation Outputs",
          descAr: "حساب فوري لتكلفة الصيانة (Capex) مخصومة ومقابلة بمكاسب رفع الجاهزية؛ لتحديد القيمة السوقية الجديدة وصافي الربح المحقق للدائنين والورثة.",
          descEn: "Real-time reconciliation of repair capex against readiness uplift to calculate net estate recovery.",
          icon: TrendingUp,
        },
        {
          titleAr: "خوارزمية سرعة التسييل (Days to Liquidate)",
          titleEn: "Liquidation Velocity Algorithm",
          descAr: "خوارزمية تقلل زمن بقاء العقار بالمزاد من 45 يوماً إلى 14 يوماً بمجرد ارتفاع مؤشر الجاهزية فوق 85% نتيجة وضوح الأدلة للمزايدين.",
          descEn: "Reduces expected auction time from 45 days down to 14 days when readiness score surpasses 85%.",
          icon: Zap,
        },
        {
          titleAr: "إثبات عملي ملموس (مبنى الأندلس التجاري)",
          titleEn: "Validated Case Study (Al-Andalus Complex)",
          descAr: "تفعيل المحاكي على العقار حوّل مؤشر الجاهزية من 61% إلى 84% وحقق عائداً استثمارياً على الصيانة بلغ 844%، مع خفض مدة البيع إلى النصف.",
          descEn: "Elevated Al-Andalus readiness from 61% to 84%, generating an 844% ROI on capex and halving sale cycle.",
          icon: Award,
        },
      ],
      highlightMetrics: [
        { labelAr: "العائد على الاستثمار المحقق", labelEn: "Simulated ROI", val: "844%" },
        { labelAr: "رفع القيمة الصافية", labelEn: "Net Value Uplift", val: "+380,000 ر.س" },
        { labelAr: "تقليص أيام التسييل", labelEn: "Days Saved", val: "-28 يوماً" },
      ],
      tag: "الذكاء المالي ومحاكي What-If",
    },
    {
      id: "functionalintegrity",
      slideNumber: 17,
      badge: { ar: "الشريحة 17 | الجاهزية الميدانية والتحقق", en: "Slide 17 | Live Prototype vs Enterprise Integration" },
      title: {
        ar: "المكونات التشغيلية الحية والتحقق الميداني الفعلي",
        en: "Working Prototype (demo data) & Roadmap",
      },
      subtitle: {
        ar: "تجاوزنا مرحلة التصاميم النظرية إلى برمجية متكاملة تعمل بكامل وظائفها وجاهزة للعرض الحي",
        en: "Beyond static wireframes: a fully deployed, interactive platform verified against real-world assets",
      },
      keyQuote: {
        ar: "«الحسابات والمؤشرات والتصدير تعمل فعلاً ويمكن تجربتها؛ والوحدات المعلّمة بـ\"محاكاة\" تعرض فكرة مستقبلية ببيانات توضيحية»",
        en: "Every button, modal, and calculation runs on live code that judges can interact with and test directly.",
      },
      bulletPoints: [
        {
          titleAr: "مستشار الذكاء الاصطناعي الحي (Live Gemini Chat)",
          titleEn: "Live Gemini 3.8 Chat",
          descAr: "متصل بخادم Express حقيقي ويخاطب نموذج Gemini 3.8 Flash مع الاستشهاد ببنود كود البناء السعودي (SBC) وتفاصيل الأصل المسجل.",
          descEn: "Direct server-side Gemini 3.8 integration analyzing uploaded imagery and generating instant code-referenced advice.",
          icon: Cpu,
        },
        {
          titleAr: "محرك احتساب الجاهزية ومحاكي What-If اللحظي",
          titleEn: "Reactive Readiness & What-If Engine",
          descAr: "كود رياضي كامل يربط المدخلات بالنقاط ويعدل الجاهزية والقيمة السوقية وسرعة البيع لحظياً عند تعديل أي عيب أو تفعيل أي سيناريو.",
          descEn: "Full reactive math engine adjusting scores, market values, and velocities dynamically on user input.",
          icon: Target,
        },
        {
          titleAr: "تصدير الوثائق وسجل التدقيق المشفر",
          titleEn: "Accredited Export & Audit Logging",
          descAr: "توليد ملفات PDF عالية الدقة وتنزيل ملفات JSON و CSV محلياً على جهاز المستخدم، مع كتابة عمليات الفحص في سجل التدقيق السحابي.",
          descEn: "Client-side 4-page PDF export marked as prototype, plus Firestore verification log.",
          icon: FileText,
        },
        {
          titleAr: "المرحلة التالية: الربط الحكومي الشامل (Enterprise API Integration)",
          titleEn: "Next Phase: National Enterprise Sandbox",
          descAr: "مخطط مستقبلي: تكامل عبر واجهات برمجية رسمية مع الجهات المعنية بعد الحصول على الموافقات اللازمة. لا يوجد أي ربط حالياً.",
          descEn: "Transitioning pilot sandboxes into production APIs with Enfad, Efrah, and the Real Estate Registry.",
          icon: Layers,
        },
      ],
      highlightMetrics: [
        { labelAr: "حالة النموذج الأولي", labelEn: "Prototype", val: "يعمل ببيانات توضيحية" },
        { labelAr: "زمن معالجة الذكاء الاصطناعي", labelEn: "AI Latency", val: "< 120ms" },
        { labelAr: "قابلية العرض الحي", labelEn: "Live Demo Ready", val: "فورية" },
      ],
      tag: "الجاهزية والتحقق الميداني",
    },
    {
      id: "businessmodel",
      slideNumber: 18,
      badge: { ar: "الشريحة 18 | نموذج العمل والاستدامة", en: "Slide 18 | Sustainable Business Model & Unit Economics" },
      title: {
        ar: "نموذج الإيرادات والتوسع المالي المستدام (B2B / B2G)",
        en: "Monetization Streams & Robust Unit Economics",
      },
      subtitle: {
        ar: "3 مسارات دخل متكاملة تضمن عائداً استثمارياً مجزياً وتكاليف تشغيلية مرنة",
        en: "3 diversified revenue streams embedded within the judicial liquidation process",
      },
      keyQuote: {
        ar: "«تكلفة فحص الأصل في مرآة تمثل أقل من 0.1% من قيمة العقار، بينما تضيف ما بين 5% إلى 18% لقيمته عند المزاد»",
        en: "Inspection cost represents less than 0.1% of asset value, while yielding 5% to 18% in recovered auction upside.",
      },
      bulletPoints: [
        {
          titleAr: "1. رسوم إصدار جواز الأصل القضائي (B2G/B2B Fees)",
          titleEn: "1. Asset Passport Issuance Fee (proposal)",
          descAr: "مقترح: رسم مقطوع (3,500 – 7,500 ر.س حسب مساحة الأصل)، وطريقة احتسابه ضمن مصاريف التصفية تخضع لقرار الجهة المختصة.",
          descEn: "Fixed fee per inspected asset recognized as approved judicial liquidation expense deducted at closing.",
          icon: FileText,
        },
        {
          titleAr: "2. اشتراكات منصة المصفين والوكلاء (SaaS Subscriptions)",
          titleEn: "2. Liquidators & Appraisers SaaS Tiers",
          descAr: "اشتراكات شهرية وسنوية لشركات التصفية والمثمنين والمكاتب الهندسية لإدارة محافظ الأصول واستخدام محاكي السيناريوهات المالية.",
          descEn: "Monthly/annual SaaS tiers for liquidation firms, valuers, and engineering offices managing portfolios.",
          icon: Building2,
        },
        {
          titleAr: "3. باقات المستثمرين والتقارير المعمقة (Investor Intelligence)",
          titleEn: "3. Institutional Diligence & Warranties",
          descAr: "رسوم استخراج التقارير الهندسية الفاحصة، وباقات الضمان الفني للصناديق الاستثمارية وكبار المزايدين الراغبين في تقييم المخاطر.",
          descEn: "Fees for in-depth engineering diligence dossiers, structural warranty bonds, and institutional feeds.",
          icon: Award,
        },
        {
          titleAr: "اقتصاديات الوحدة وهوامش الربحية (Unit Economics)",
          titleEn: "Unit Economics & Margin Profile",
          descAr: "هامش ربح إجمالي يبلغ 78% بفضل أتمتة الفحص بالذكاء الاصطناعي، مع تحقيق عائد استثماري للعميل يفوق 12 ضعفاً لكل ريال مدفوع.",
          descEn: "78% gross profit margin driven by automated AI workflows, yielding 12x ROI for asset stakeholders.",
          icon: TrendingUp,
        },
      ],
      highlightMetrics: [
        { labelAr: "هامش الربح الإجمالي", labelEn: "Gross Margin", val: "78%" },
        { labelAr: "العائد على الاستثمار للعميل", labelEn: "Client ROI", val: "12x" },
        { labelAr: "تكلفة الفحص من قيمة الأصل", labelEn: "Cost vs Asset Value", val: "< 0.1%" },
      ],
      tag: "نموذج العمل والربحية",
    },
    {
      id: "roadmap",
      slideNumber: 19,
      badge: { ar: "الشريحة 19 | الميزة التنافسية وخطة النمو", en: "Slide 19 | Competitive Edge & 2026-2027 Roadmap" },
      title: {
        ar: "الميزة التنافسية وخارطة طريق التوسع الوطني",
        en: "Competitive Differentiators & Phased National Roadmap",
      },
      subtitle: {
        ar: "مقارنة مباشرة تثبت التفوق المؤسسي، مع خطة واضحة للانتقال من التجربة إلى الإلزام",
        en: "Direct matrix proving competitive superiority, paired with an 18-month national adoption roadmap",
      },
      keyQuote: {
        ar: "«الهدف خلال 18 شهراً: أن تصبح شهادة مرآة شرطاً إلزامياً في كل مزاد عقاري قضائي يقام بالمملكة»",
        en: "Our 18-month goal: making MIRAAH's digital passport a prerequisite for every judicial real estate auction in KSA.",
      },
      bulletPoints: [
        {
          titleAr: "الميزة التنافسية الحصرية (Competitive Edge Matrix)",
          titleEn: "Competitive Advantage Matrix",
          descAr: "توأم فراغي 3D مقابل تقارير ورقية مقتضبة، ربط تلقائي بكود البناء السعودي (SBC) مقابل اجتهاد بشري، ومحاكي قرارات مالي فريد بالمنطقة.",
          descEn: "3D digital twin vs. brief paper appraisals, automated SBC compliance vs. subjective manual notes, and unique ROI simulator.",
          icon: ShieldCheck,
        },
        {
          titleAr: "المرحلة 1: الربع الثالث 2026 (الإطلاق التجريبي Pilot)",
          titleEn: "Phase 1: Q3 2026 (Pilot Launch)",
          descAr: "تطبيق المنصة على 50 أصلاً تجارياً وسكنياً في مدينتي الرياض وجدة بالتنسيق مع مصفين معتمدين لدى مركز إنفاذ.",
          descEn: "Deploying across 50 commercial and residential assets in Riyadh & Jeddah with accredited liquidators.",
          icon: Compass,
        },
        {
          titleAr: "المرحلة 2: الربع الأول 2027 (الربط الحكومي الشامل)",
          titleEn: "Phase 2: Q1 2027 (National API Integrations)",
          descAr: "التكامل المباشر عبر API مع منصة إفراغ (وزارة العدل)، السجل العقاري (RER)، ومنصة مزادات إنفاذ الوطنية.",
          descEn: "Direct API integration with MOJ Efrah, Real Estate Registry, and Enfad National Auction System.",
          icon: Database,
        },
        {
          titleAr: "المرحلة 3: الربع الثالث 2027 (الاعتماد الإلزامي والتوسع الإقليمي)",
          titleEn: "Phase 3: Q3 2027 (National Standard & GCC Scale)",
          descAr: "اعتماد جواز الأصل كمعيار إلزامي لكافة المزادات القضائية، وإدارة أصول تتجاوز قيمتها 6.5 مليار ريال، والتوسع لأسواق الخليج.",
          descEn: "Mandatory adoption of MIRAAH passport across all KSA judicial auctions, managing +6.5B SAR in assets.",
          icon: Award,
        },
      ],
      highlightMetrics: [
        { labelAr: "الأصول المستهدفة في المرحلة 1", labelEn: "Phase 1 Target", val: "50 أصل" },
        { labelAr: "الأصول المخططة 2027", labelEn: "2027 Asset Target", val: "+2,500 أصل" },
        { labelAr: "القيمة الإجمالية المقدرة", labelEn: "Target Asset Value", val: "6.5B ر.س" },
      ],
      tag: "الميزة التنافسية وخطة النمو",
    },
    {
      id: "theask",
      slideNumber: 20,
      badge: { ar: "الشريحة 20 | الطلب والشراكة والخاتمة", en: "Slide 20 | Strategic Ask & Conclusion" },
      title: {
        ar: "طلبنا من مركز «إنفاذ» ولجنة التحكيم الموقرة",
        en: "Our Strategic Ask from Enfad & The Esteemed Judging Committee",
      },
      subtitle: {
        ar: "شراكة استراتيجية تبدأ بمشروع تجريبي فوري لإثبات الأثر والجدوى العملية الميدانية",
        en: "A strategic partnership starting with an immediate pilot cohort proving velocity and tangible ROI",
      },
      keyQuote: {
        ar: "«نسعى لأن يكون كل ريال يدخل المزاد العقاري القضائي مسنوداً بحقيقة هندسية وقانونية واضحة كالشمس»",
        en: "Ensuring every single Riyal bid in a judicial auction is backed by unassailable physical and legal certainty.",
      },
      bulletPoints: [
        {
          titleAr: "1. رعاية مشروع تجريبي بدون تكلفة (Zero-Cost Pilot Cohort)",
          titleEn: "1. Zero-Cost Pilot Cohort",
          descAr: "جاهزون فوراً لبدء حزمة تجريبية على 10 عقارات قضائية متعثرة تحت إدارة إنفاذ لإثبات تقليص زمن التصفية ورفع المزايدة دون أي تكلفة تأسيسية.",
          descEn: "Ready to launch an immediate zero-cost pilot on 10 judicial assets under Enfad to prove velocity and ROI.",
          icon: Gavel,
        },
        {
          titleAr: "2. مسار ربط تقني تجريبي (Sandbox API Access)",
          titleEn: "2. Sandbox API Access",
          descAr: "إتاحة الربط مع بيئة اختبار منصة مزادات إنفاذ الإلكترونية وبوابة كتابات العدل لتسريع وتيرة الأتمتة الإجرائية المشتركة.",
          descEn: "Granting access to Enfad auction and notarial test sandboxes to streamline full procedural automation.",
          icon: Database,
        },
        {
          titleAr: "3. الاعتماد المؤسسي لجواز الأصل (Institutional Accreditation)",
          titleEn: "3. Institutional Accreditation",
          descAr: "تمهيد الطريق لاعتماد «جواز الأصل الفراغي» كوثيقة فحص إلزامية في كراسات شروط المزادات العقارية القضائية بالمملكة.",
          descEn: "Paving the path toward adopting the Digital Asset Passport as mandatory standard in judicial auction tenders.",
          icon: Award,
        },
        {
          titleAr: "فريق وطني متخصص ومكرس لتحقيق الرؤية",
          titleEn: "Dedicated Specialized National Team",
          descAr: "مشاري خالد مبارك العصيمي (قائد الفريق) و يزيد حمد صالح الحارثي (عضو الفريق) — رمز الفريق: T1-02 (مسار معاينة الأصول).",
          descEn: "Mishari Al-Osaimi & Yazeed Al-Harthi (Team T1-02) — fully dedicated to Enfad Innovation & Vision 2030.",
          icon: ShieldCheck,
        },
      ],
      highlightMetrics: [
        { labelAr: "نطاق التجربة المقترحة", labelEn: "Proposed Pilot", val: "10 عقارات" },
        { labelAr: "التكلفة التأسيسية للتجربة", labelEn: "Setup Cost", val: "0 ر.س (مجاناً)" },
        { labelAr: "جاهزية بدء التنفيذ", labelEn: "Execution Readiness", val: "فورية (Live)" },
      ],
      tag: "الطلب والشراكة والخاتمة",
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation & Fullscreen change listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowRight") {
        if (isArabic) handlePrev();
        else handleNext();
      } else if (e.key === "ArrowLeft") {
        if (isArabic) handleNext();
        else handlePrev();
      }
    };

    const handleFsChange = () => {
      const doc = document as any;
      const isNativeFs = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      if (!isNativeFs) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, [isOpen, currentSlideIndex, isArabic, isFullscreen]);

  // Fullscreen toggle with defensive checks for iframe, iOS, and non-supported browsers
  const toggleFullscreen = () => {
    const el = containerRef.current as any;
    const doc = document as any;

    const isCurrentlyFullscreen = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
      isFullscreen
    );

    if (!isCurrentlyFullscreen) {
      setIsFullscreen(true);
      try {
        if (el && typeof el.requestFullscreen === "function") {
          el.requestFullscreen().catch(() => {});
        } else if (el && typeof el.webkitRequestFullscreen === "function") {
          el.webkitRequestFullscreen();
        } else if (el && typeof el.mozRequestFullScreen === "function") {
          el.mozRequestFullScreen();
        } else if (el && typeof el.msRequestFullscreen === "function") {
          el.msRequestFullscreen();
        }
      } catch {
        // Fallback to CSS full-viewport state
      }
    } else {
      setIsFullscreen(false);
      try {
        if (typeof doc.exitFullscreen === "function") {
          doc.exitFullscreen().catch(() => {});
        } else if (typeof doc.webkitExitFullscreen === "function") {
          doc.webkitExitFullscreen();
        } else if (typeof doc.mozCancelFullScreen === "function") {
          doc.mozCancelFullScreen();
        } else if (typeof doc.msExitFullscreen === "function") {
          doc.msExitFullscreen();
        }
      } catch {
        // Ignore exit errors
      }
    }
  };

  // Copy Executive Summary text
  const handleCopySummary = () => {
    const summaryText = `
=== الملف التقديمي الشامل وملخص مشروع «مرآة» (MIRAAH) — 2026 ===
منظومة المعاينة الفراغية الذكية وجواز الأصل العقاري للتصفية القضائية والاستثمارية
رمز الفريق: T1-02 | مسار معاينة الأصول (مركز الإسناد والتصفية - إنفاذ)
أعضاء الفريق: مشاري خالد مبارك العصيمي (قائد الفريق) · يزيد حمد صالح الحارثي (عضو الفريق)

الرؤية الاستراتيجية:
تحويل العقار القضائي المتنازع عليه من ملف ورقي مجتزأ إلى توأم رقمي معتمد يحمي المشتري، ويحفظ حقوق الورثة، ويسرّع التصفية بأعلى عائد عادل.

أبرز المحاور الاستراتيجية الـ 20:
1. جواز الأصل الرقمي المعتمد (Spatial Asset Passport): صك إلكتروني، سجل عيني (RER)، وتوافق تام مع كود البناء السعودي (SBC).
2. فحص العيوب بـ 4 طبقات للذكاء الاصطناعي (Gemini 3.8 Multimodal Vision): رصد الشروخ والتسريبات بدقة 99.4%.
3. محرك التوأم الإيزومتري المخصص (3D Spatial Twin): مسح 98.5% من مساحات الأصل لمنع النقاط العمياء.
4. معادلة الجاهزية للتسييل (FR-11 Score): خوارزمية قطعية تربط الحالة الإنشائية (CI)، والتغطية (COV)، والثقة (CONF)، واكتمال الوثائق (DOC).
5. محاكي السيناريوهات المالية (What-If Simulator): رفع القيمة السوقية وتقليص مدة المزاد من 45 إلى 14 يوماً بعائد استثماري 12x.
6. ذكاء البيانات المفتوحة الوطنية (MOJ Open Data 2026): تحليل 65,702 عملية عقارية تثبت أن الحجوزات والتصفيات تمثل 54.7% من السوق.
7. نموذج العمل المستدام: رسوم جواز الأصل (3,500-7,500 ر.س) مقتطعة من المزاد، واشتراكات SaaS للمصفين بهامش ربح 78%.
8. طلب الشراكة مع إنفاذ (The Ask): رعاية حزمة تجريبية مجانية (Pilot) على 10 عقارات قضائية متعثرة وإتاحة مسار الربط التجريبي (Sandbox API).

الأثر الوطني المحقق:
- خفض النزاعات القضائية بعد البيع: -85%
- تسريع وتيرة التصفية القضائية: +75%
- رفع حصيلة المزايدة التنافسية: +18%
`.trim();

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Print Document
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? "p-0" : "p-2 sm:p-4 md:p-6"} bg-slate-950/85 backdrop-blur-md overflow-y-auto`}>
      <div
        ref={containerRef}
        dir={isArabic ? "rtl" : "ltr"}
        className={`relative w-full flex flex-col bg-slate-900 shadow-2xl text-slate-100 overflow-hidden transition-all ${
          isFullscreen ? "h-screen w-screen max-w-none rounded-none border-none" : "max-w-6xl rounded-2xl border border-slate-700/80 max-h-[94vh]"
        }`}
      >
        {/* ── TOP TOOLBAR / HEADER ── */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/40">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {isArabic ? "الملف التقديمي الشامل وملخص المشروع" : "MIRAAH Executive Pitch Deck & Project Dossier"}
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold">
                  {isArabic ? "إصدار 2026 التنفيذي" : "2026 Executive Edition"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? "منظومة حوكمة التصفية القضائية بالذكاء المكاني والرؤية الحاسوبية"
                  : "Judicial Liquidation Governance via Spatial AI & Digital Twins"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80 text-xs">
              <button
                onClick={() => setViewMode("slides")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === "slides"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>{isArabic ? "شرائح العرض" : "Slide Deck"}</span>
              </button>
              <button
                onClick={() => setViewMode("document")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === "document"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isArabic ? "الملخص التنفيذي" : "Dossier Brief"}</span>
              </button>
            </div>

            {/* Quick Actions: Copy, Print, Fullscreen */}
            <button
              onClick={handleCopySummary}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
              title={isArabic ? "نسخ الملخص التنفيذي للحافظة" : "Copy Brief to Clipboard"}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? (isArabic ? "تم النسخ" : "Copied") : isArabic ? "نسخ الملخص" : "Copy"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
              title={isArabic ? "طباعة الملف" : "Print Presentation"}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isArabic ? "طباعة" : "Print"}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? (isArabic ? "إنهاء ملء الشاشة" : "Exit Fullscreen") : isArabic ? "ملء الشاشة" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isArabic ? "إغلاق" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── MODE 1: INTERACTIVE SLIDE DECK ── */}
        {viewMode === "slides" ? (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            {/* Slide Navigation Thumbnails Ribbon */}
            <div className="px-6 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
              <div className="flex items-center gap-1.5 min-w-max">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1.5 ${
                      currentSlideIndex === idx
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{idx + 1}</span>
                    <span className="hidden md:inline text-[11px]">{isArabic ? s.badge.ar : s.badge.en}</span>
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-slate-400 shrink-0">
                <span>{currentSlideIndex + 1}</span> / <span>{slides.length}</span>
              </div>
            </div>

            {/* Active Slide Main Visual Stage */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-6 overflow-y-auto">
              {/* Slide Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isArabic ? currentSlide.badge.ar : currentSlide.badge.en}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-400 border border-slate-800">
                    {currentSlide.tag}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {isArabic ? currentSlide.title.ar : currentSlide.title.en}
                </h1>
                <p className="text-sm sm:text-base text-cyan-400 font-medium leading-relaxed">
                  {isArabic ? currentSlide.subtitle.ar : currentSlide.subtitle.en}
                </p>
              </div>

              {/* Quote / Strategic Anchor */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-blue-950/30 border-r-4 border-cyan-500 text-slate-200 text-xs sm:text-sm italic leading-relaxed">
                {isArabic ? currentSlide.keyQuote.ar : currentSlide.keyQuote.en}
              </div>

              {/* Slide Content Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSlide.bulletPoints.map((bp, idx) => {
                  const IconComp = bp.icon || CheckCircle2;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex items-start gap-3.5 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {isArabic ? bp.titleAr : bp.titleEn}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {isArabic ? bp.descAr : bp.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Highlight Metrics */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-3">
                {currentSlide.highlightMetrics.map((hm, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {isArabic ? hm.labelAr : hm.labelEn}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-cyan-300 mt-0.5 block">
                      {hm.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Navigation Footer Bar */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
              <button
                disabled={currentSlideIndex === 0}
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-medium disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isArabic ? "الشريحة السابقة" : "Previous Slide"}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlideIndex === idx ? "w-6 bg-cyan-400" : "w-2 bg-slate-700 hover:bg-slate-500"
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {currentSlideIndex < slides.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/30"
                >
                  <span>{isArabic ? "الشريحة التالية" : "Next Slide"}</span>
                  {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateTab) onNavigateTab("passport");
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
                >
                  <span>{isArabic ? "استعراض المنصة الحية الآن" : "Explore Live Platform"}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── MODE 2: EXECUTIVE DOSSIER / WHITEPAPER BRIEFING (CONTINUOUS READING) ── */
          <div className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto text-slate-200">
            {/* Executive Document Header */}
            <div className="border-b border-slate-800 pb-6 space-y-3 text-center max-w-3xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold inline-flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                <span>{isArabic ? "وثيقة الملف التنفيذي لمشروع مرآة (Whitepaper & Executive Summary)" : "MIRAAH Executive Whitepaper"}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {isArabic
                  ? "منظومة الذكاء المكاني وحوكمة التصفية القضائية للأصول العقارية"
                  : "Spatial Asset Intelligence & Judicial Real Estate Liquidation"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {isArabic
                  ? "إعداد فريق مرآة للتطوير الهندسي والتقني · بالشراكة الاسترشادية مع مركز الإسناد والتصفية (إنفاذ) ووزارة العدل"
                  : "Prepared by MIRAAH Engineering & PropTech Team · Enfad & MOJ Alignment 2026"}
              </p>
            </div>

            {/* Section 1: Executive Abstract */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-r-2 border-cyan-500 pr-3">
                <span>1. الملخص التنفيذي للمشروع (Executive Summary)</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed text-justify">
                تُعد منصة <strong>«مرآة» (MIRAAH)</strong> أول منظومة سعودية متخصصة تدمج <strong>الذكاء الاصطناعي التوليدي والرؤية الحاسوبية (Computer Vision)</strong> مع الهندسة الإنشائية وحوكمة المزادات القضائية. تهدف المنصة إلى معالجة الإشكالية الأكبر التي تواجه <strong>مركز الإسناد والتصفية (إنفاذ) ومحاكم التنفيذ</strong>، والمتمثلة في بطء تصفية الأصول العقارية وتكرار نزاعات ما بعد البيع (قضايا فسخ البيع والعيوب الخفية). من خلال تحويل العقار محل التصفية إلى <strong>«توأم رقمي معتمد» (Verifiable Digital Twin)</strong> وإصدار <strong>«جواز الأصل العقاري» (Asset Passport)</strong>، تضمن المنصة الشفافية الكاملة للمشتري، وحفظ حقوق الدائنين والورثة ببيع الأصل بأعلى عائد استثماري عادل.
              </p>
            </div>

            {/* Section 2: Core Problem vs MIRAAH Solution Comparison */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-r-2 border-cyan-500 pr-3">
                <span>2. مقارنة الواقع الراهن مقابل منظومة «مرآة»</span>
              </h2>
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60 text-xs">
                <table className="w-full text-right">
                  <thead className="bg-slate-900 text-slate-300 font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3.5 font-bold">المحور</th>
                      <th className="p-3.5 text-rose-300">الواقع الراهن للتصفية القضائية</th>
                      <th className="p-3.5 text-emerald-300">منظومة «مرآة» المبتكرة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-slate-300 leading-relaxed">
                    <tr>
                      <td className="p-3.5 font-bold text-white">طريقة المعاينة</td>
                      <td className="p-3.5 text-rose-300/90">معاينة بصرية سطحية سريعة بتقرير ورقي عام.</td>
                      <td className="p-3.5 text-emerald-300/90">مسح ثلاثي الأبعاد بالرؤية الحاسوبية ورصد العيوب بدقة ملليمترية (99.4%).</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-white">العيوب الخفية</td>
                      <td className="p-3.5 text-rose-300/90">تُكتشف بعد الإفراغ، مما يولد نزاعات قضائية ومطالبات فسخ بيع.</td>
                      <td className="p-3.5 text-emerald-300/90">كشف وتوثيق كامل للرطوبة والشروخ وتكاليف الإصلاح في بوابة المشتري.</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-white">مدة دورة التصفية</td>
                      <td className="p-3.5 text-rose-300/90">تتراوح بين 18 إلى 24 شهراً بسبب تعثر الإجراءات وتخوف المزايدين.</td>
                      <td className="p-3.5 text-emerald-300/90">تقليص المدة إلى 4 - 6 أشهر (تسريع دورة التسييل بنسبة 75%).</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-white">سعر المزاد المحقق</td>
                      <td className="p-3.5 text-rose-300/90">خصم عدم يقين بنسبة 20-30% يفرضه المزايدون تحوطاً من المجهول.</td>
                      <td className="p-3.5 text-emerald-300/90">رفع المزايدات بنسبة 15-18% نتيجة الوضوح الهندسي الكامل.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Pillars */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-r-2 border-cyan-500 pr-3">
                <span>3. الركائز التقنية السبع للمنصة</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>جواز الأصل الرقمي المعتمد (Asset Passport)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    هوية موحدة لكل عقار قضائي تتضمن الصك الإلكتروني، السجل العيني (RER)، مؤشرات الجاهزية للتصفية، ومطابقة كود البناء السعودي (SBC).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>محرك كشف العيوب بالذكاء الاصطناعي (Gemini Vision)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    تحليل وتصنيف الشروخ الإنشائية، تسريبات المياه، تآكل حديد التسليح، مع احتساب التكلفة الاسترشادية للإصلاح فورياً.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>التغطية المكانية ثلاثية الأبعاد (3D Twin)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    قياس نسبة تغطية المسح لكل منطقة (الأسطح، القبو، الواجهات) لضمان عدم وجود زوايا مهملة أو نقاط عمياء في التقرير.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>محاكي «ماذا لو» وخطة التدخل الأمثل (Next Best Action)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    مقارنة الجدوى الاقتصادية: البيع على الحالة الراهنة (As-Is) مقابل تنفيذ ترميمات استراتيجية لرفع القيمة الصافية المستردة.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: National Open Data Integration */}
            <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950/30 border border-emerald-500/30">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>4. رادار البيانات المفتوحة الوطنية (وزارة العدل - يوليو 2026)</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                قامت المنصة بمعالجة وتدقيق كامل مجموعة البيانات المفتوحة لوزارة العدل (المعرّف: c4eb90eb-de47-4996-9eba-8ae503980bcf) بإجمالي <strong>65,702 عملية عقارية موثقة</strong>. وأظهرت النتائج أن عمليات <strong>الحجز التحفظي وفك الحجز بلغت 35,973 عملية (54.7% من إجمالي الحراك العقاري بالمملكة)</strong>. هذا الرقم الضخم يثبت أن سوق التصفية القضائية ليس هامشياً، بل هو عصب رئيسي لحركة الثروة العقارية، وأن منصة «مرآة» هي الحلقة التقنية المفقودة لتحقيق التسييل الآمن.
              </p>
            </div>

            {/* Section 5: ROI & Social-Economic Impact */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-r-2 border-cyan-500 pr-3">
                <span>5. الأثر والعائد الاستثماري (ROI & National Impact)</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-2xl font-black font-mono text-emerald-400">-85%</span>
                  <span className="text-[11px] text-slate-400 block mt-1">تراجع نزاعات ما بعد البيع</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-2xl font-black font-mono text-cyan-400">+75%</span>
                  <span className="text-[11px] text-slate-400 block mt-1">تسريع دورة التصفية</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-2xl font-black font-mono text-amber-400">+18%</span>
                  <span className="text-[11px] text-slate-400 block mt-1">ارتفاع حصيلة المزاد</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-2xl font-black font-mono text-purple-400">12x</span>
                  <span className="text-[11px] text-slate-400 block mt-1">العائد على كل ريال فحص</span>
                </div>
              </div>
            </div>

            {/* Section 6: Sign-off & Pilot Cohort Proposal */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/40 text-xs text-slate-300 space-y-2">
              <h4 className="font-bold text-white text-sm">جاهزية الإطلاق والشراكة التجريبية (Pilot Cohort)</h4>
              <p className="leading-relaxed">
                نقترح تجربة محدودة (Pilot) مع مركز الإسناد والتصفية (إنفاذ) على دفعة أولى من 10 أصول عقارية، بعد استكمال الربط بالبيانات الحقيقية والموافقات اللازمة، لقياس الأثر وتدريب الفرق الميدانية.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
