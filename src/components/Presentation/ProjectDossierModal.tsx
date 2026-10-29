import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Copy, Check, ArrowUpRight } from "lucide-react";
import { SimulatedBadge } from "../common/DemoDataBanner";

export interface ProjectDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic?: boolean;
  onNavigateTab?: (tabId: string) => void;
}

interface Slide {
  id: string;
  title: { ar: string; en: string };
  points: { ar: string; en: string }[];
  /** Optional link to the screen that demonstrates the slide. */
  tryTab?: string;
  note?: { ar: string; en: string };
}

/**
 * Project presentation shown inside the app. Every statement here must be true of the code
 * (see README.md and docs/CLAIMS_LEDGER.md). Proposals and future work are labelled as such.
 */
const SLIDES: Slide[] = [
  {
    id: "title",
    title: { ar: "مرآة · جواز الأصل للتصفية القضائية", en: "MIRAAH · Asset Passport for Judicial Liquidation" },
    points: [
      { ar: "نموذج أولي مقدَّم لبرنامج ابتكار إنفاذ (مسار معاينة الأصول).", en: "Prototype submitted to the Infath Innovation program (asset-inspection track)." },
      { ar: "يعمل ببيانات توضيحية، وليس نظاماً رسمياً لإنفاذ أو لأي جهة حكومية.", en: "Runs on demo data; not an official system of Infath or any government body." },
    ],
  },
  {
    id: "problem",
    title: { ar: "المشكلة", en: "The problem" },
    points: [
      { ar: "معلومات حالة الأصل قبل المزاد موزعة على تقارير متفرقة يصعب مقارنتها.", en: "Information about an asset's condition before auction is spread across separate reports that are hard to compare." },
      { ar: "المزايد لا يعرف بسهولة ما الذي فُحص وما الذي لم يُفحص.", en: "Bidders cannot easily tell what was inspected and what was not." },
      { ar: "لا توجد طريقة بسيطة لمعرفة إن كان ملف التقرير تغيّر بعد إصداره.", en: "There is no simple way to tell whether a report file changed after it was issued." },
    ],
  },
  {
    id: "solution",
    title: { ar: "الحل: جواز أصل رقمي", en: "The solution: a digital asset passport" },
    points: [
      { ar: "ملف واحد للأصل: البيانات، الملاحظات وأدلتها، ونسبة التغطية لكل منطقة.", en: "One record per asset: profile, findings with evidence, and coverage per area." },
      { ar: "مؤشرات محسوبة بمعادلات معلنة: الحالة، التغطية، ثقة الفحص، جاهزية التصفية.", en: "Scores from published formulas: condition, coverage, inspection confidence, liquidation readiness." },
      { ar: "تصدير PDF وCSV وJSON من نفس البيانات مع بصمة SHA-256.", en: "PDF, CSV and JSON exports from the same data with a SHA-256 fingerprint." },
    ],
    tryTab: "passport",
  },
  {
    id: "works",
    title: { ar: "ما يعمل الآن", en: "What works today" },
    points: [
      { ar: "جواز الأصل والملاحظات والتغطية (ببيانات توضيحية).", en: "Asset passport, findings and coverage (demo data)." },
      { ar: "تحقق المستخدم من الملاحظات أو إغلاقها، مع سجل إلحاقي في Firestore.", en: "Users verify or resolve findings; actions go to an append-only Firestore log." },
      { ar: "محاكي What-If يعيد حساب الجاهزية من بيانات الأصل الفعلية.", en: "What-If simulator recomputes readiness from the asset's actual data." },
      { ar: "إضافة ملاحظات بتصنيف يدوي من صور مرفوعة (لا يوجد تحليل صور آلي بعد).", en: "Add manually labelled findings from uploaded images (no automatic image analysis yet)." },
      { ar: "مساعد ذكي يجيب عن بيانات الأصل المعروضة، بعد تسجيل الدخول.", en: "An AI assistant that answers questions about the displayed asset data, after sign-in." },
    ],
    tryTab: "findings",
  },
  {
    id: "formulas",
    title: { ar: "المعادلات", en: "Formulas" },
    points: [
      { ar: "مؤشر الحالة = 100 − مجموع (الوزن × الثقة/100) للملاحظات غير المعالجة؛ الأوزان: حرج 15، متوسط 8، منخفض 3.", en: "Condition = 100 − Σ(weight × confidence/100) over unresolved findings; weights Critical 15, Moderate 8, Low 3." },
      { ar: "التغطية = متوسط نسب تغطية المناطق.", en: "Coverage = mean of area coverage percentages." },
      { ar: "ثقة الفحص = 0.50 × التغطية + 0.30 × متوسط الثقة + 0.20 × نسبة الملاحظات ذات الدليل.", en: "Confidence = 0.50·coverage + 0.30·mean confidence + 0.20·share of findings with evidence." },
      { ar: "الجاهزية = 100 − 0.40(100 − الحالة) − 0.35(100 − التغطية) − 5 × غير المعالجة − 3 × الحقول الناقصة.", en: "Readiness = 100 − 0.40(100 − condition) − 0.35(100 − coverage) − 5·unresolved − 3·missing fields." },
    ],
    note: {
      ar: "المعاملات اختيارات تصميمية للنموذج الأولي وغير معايرة على نتائج مزادات حقيقية. التفاصيل في docs/READINESS_INDEX.md.",
      en: "Coefficients are prototype design choices, not calibrated on real auction outcomes. Details in docs/READINESS_INDEX.md.",
    },
    tryTab: "whatif",
  },
  {
    id: "ai",
    title: { ar: "المساعد الذكي: ما يفعله وما لا يفعله", en: "The AI assistant: what it does and doesn't" },
    points: [
      { ar: "يقرأ أرقام الأصل كبيانات منفصلة عن التعليمات، ولا يحسب المؤشرات بنفسه.", en: "Reads the asset's numbers as data separate from instructions; it never computes the scores." },
      { ar: "يقول صراحة إن الميزة غير متوفرة أو محاكاة، ولا يختلق أرقاماً أو بنود كود.", en: "Says plainly when a feature is unavailable or simulated; does not invent numbers or code clauses." },
      { ar: "لا يقدم استشارة قانونية ولا تقييماً معتمداً، ويحيل لمهندس أو مقيّم مرخّص.", en: "Gives no legal advice or certified valuation; refers to a licensed engineer or valuer." },
      { ar: "بدون مفتاح أو عند تعطل النموذج: رسالة واضحة بدل إجابة مولّدة.", en: "Without a key or when the model fails: a clear message instead of a generated answer." },
    ],
  },
  {
    id: "trust",
    title: { ar: "الثقة والأمان", en: "Trust and security" },
    points: [
      { ar: "البصمة SHA-256 تكشف أي تعديل على بيانات الجواز إذا قورنت ببصمة محفوظة بشكل منفصل. ليست توقيعاً ولا اعتماداً.", en: "The SHA-256 fingerprint reveals any change to passport data when compared with a separately kept fingerprint. It is not a signature or an approval." },
      { ar: "مفتاح Gemini على الخادم فقط؛ تسجيل دخول إلزامي، تحقق من المدخلات، وحدود للطلبات.", en: "Gemini key stays on the server; sign-in required, input validation, and request limits." },
      { ar: "قواعد Firestore: كل مستخدم يصل لملفه فقط، وسجل التحقق لا يُعدَّل ولا يُحذف.", en: "Firestore rules: each user reaches only their own profile; the verification log cannot be edited or deleted." },
      { ar: "اختبارات آلية على كل تحديث (GitHub Actions)، منها اختبار القواعد على محاكي Firestore.", en: "Automated tests on every change (GitHub Actions), including Firestore rules on the emulator." },
    ],
  },
  {
    id: "simulated",
    title: { ar: "أجزاء محاكاة (تصوّر مستقبلي)", en: "Simulated parts (future concept)" },
    points: [
      { ar: "قراءات IoT، مطابقة BIM، التنبؤ بالدورة الحياتية، سجل بلوكشين، تقييم آلي، تدقيق قانوني.", en: "IoT readings, BIM checks, lifecycle forecasts, blockchain registry, automated valuation, legal audit." },
      { ar: "مشاهد الطائرة المسيّرة والتوأم ثلاثي الأبعاد، ومؤشرات السوق.", en: "Drone and 3D twin views, market indicators." },
      { ar: "نماذج المستندات (صك، تقرير فحص، تقييم): نماذج شكلية لم تصدر عن أي جهة.", en: "Specimen documents (deed, inspection report, valuation): layouts only, issued by no authority." },
    ],
    note: { ar: "كل هذه الأجزاء معلّمة \"محاكاة\" داخل المنصة.", en: "All of these are labelled \"Simulated\" in the app." },
    tryTab: "proptech",
  },
  {
    id: "data",
    title: { ar: "بيانات السوق المرفقة", en: "Bundled market data" },
    points: [
      { ar: "ملف \"العمليات العقارية المسجلة – يوليو 2026\" منسوب لمنصة البيانات المفتوحة: 345 سجلاً، 65,702 عملية.", en: "File \"Registered real-estate operations – July 2026\", attributed to the Open Data portal: 345 rows, 65,702 operations." },
      { ar: "يشمل عمليات حجز تحفظي (19,086) وفك حجز (16,887)؛ هذه ليست عمليات تصفية أو بيع.", en: "It includes precautionary attachments (19,086) and releases (16,887); these are not liquidations or sales." },
      { ar: "يلزم التحقق من المصدر قبل أي استخدام رسمي.", en: "The source must be confirmed before any official use." },
    ],
    tryTab: "trends",
  },
  {
    id: "roadmap",
    title: { ar: "الخطوات القادمة (مقترح)", en: "Next steps (proposal)" },
    points: [
      { ar: "تجربة محدودة على عدد صغير من الأصول ببيانات حقيقية، بعد موافقة إنفاذ.", en: "A small pilot on real assets, subject to Infath approval." },
      { ar: "تحليل آلي للصور، وأدوار وصلاحيات (مفتش، مراجع، جهة تصفية).", en: "Automatic image analysis, and roles (inspector, reviewer, liquidation officer)." },
      { ar: "صفحة تحقق عامة للمشترين، وتوقيع رقمي للتقارير.", en: "A public verification page for buyers, and digital signatures on reports." },
      { ar: "تكامل مع الأنظمة الحكومية المعنية بعد الحصول على الموافقات. لا يوجد أي ربط حالياً.", en: "Integration with relevant government systems after approvals. No integration exists today." },
    ],
  },
  {
    id: "model",
    title: { ar: "نموذج العمل (مقترح)", en: "Business model (proposal)" },
    points: [
      { ar: "رسم لكل جواز أصل، أو اشتراك للجهة المشغّلة؛ القيمة وطريقة احتسابها قرار الجهة المختصة.", en: "A fee per asset passport, or a subscription for the operator; amount and accounting are for the competent authority to decide." },
      { ar: "أثر البيع والسعر غير مقاس بعد؛ يُقاس في التجربة المحدودة.", en: "Impact on sale time and price is not measured yet; the pilot would measure it." },
    ],
  },
];

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({ isOpen, onClose, isArabic = true, onNavigateTab }) => {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const L = (x: { ar: string; en: string }) => (isArabic ? x.ar : x.en);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => (isArabic ? Math.max(0, v - 1) : Math.min(SLIDES.length - 1, v + 1)));
      if (e.key === "ArrowLeft") setI((v) => (isArabic ? Math.min(SLIDES.length - 1, v + 1) : Math.max(0, v - 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isArabic, onClose]);

  if (!isOpen) return null;
  const slide = SLIDES[i];

  const copyAll = () => {
    const text = SLIDES.map(
      (s, n) => `${n + 1}. ${L(s.title)}\n${s.points.map((p) => `- ${L(p)}`).join("\n")}${s.note ? `\n(${L(s.note)})` : ""}`
    ).join("\n\n");
    navigator.clipboard?.writeText?.(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm" dir={isArabic ? "rtl" : "ltr"}>
      <div className="relative flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#09152B] text-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{isArabic ? "عرض المشروع" : "Project overview"}</span>
            <span className="rounded border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-200">
              {isArabic ? "نموذج تجريبي · بيانات توضيحية" : "Prototype · demo data"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyAll} className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {isArabic ? "نسخ النص" : "Copy text"}
            </button>
            <button onClick={onClose} title={isArabic ? "إغلاق" : "Close"} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12">
          <div className="mb-2 font-mono text-xs text-cyan-400">
            {i + 1} / {SLIDES.length}
          </div>
          <h2 className="mb-6 text-2xl font-black sm:text-3xl">{L(slide.title)}</h2>
          {slide.id === "simulated" && <SimulatedBadge isArabic={isArabic} className="mb-4" />}
          <ul className="space-y-3">
            {slide.points.map((p) => (
              <li key={p.en} className="flex gap-3 text-sm leading-relaxed text-slate-200 sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span>{L(p)}</span>
              </li>
            ))}
          </ul>
          {slide.note && <p className="mt-6 rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-400">{L(slide.note)}</p>}
          {slide.tryTab && onNavigateTab && (
            <button
              onClick={() => onNavigateTab(slide.tryTab!)}
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
            >
              {isArabic ? "جرّبه في المنصة" : "Try it in the app"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-40"
          >
            {isArabic ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {isArabic ? "السابق" : "Previous"}
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((s, n) => (
              <button
                key={s.id}
                onClick={() => setI(n)}
                aria-label={`${n + 1}`}
                className={`h-2 w-2 rounded-full ${n === i ? "bg-cyan-400" : "bg-slate-600 hover:bg-slate-500"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setI((v) => Math.min(SLIDES.length - 1, v + 1))}
            disabled={i === SLIDES.length - 1}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-40"
          >
            {isArabic ? "التالي" : "Next"}
            {isArabic ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
