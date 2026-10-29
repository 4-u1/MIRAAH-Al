import React from "react";
import type { PassportData, PassportExport } from "../../utils/passport";

/**
 * The exported dossier (screen preview, print and PDF). Rendered ONLY from PassportData and the
 * export fingerprint, so every number here matches the JSON and CSV exports. No other claims.
 */

export const PASSPORT_PAGE_TITLES = [
  { en: "Summary", ar: "الملخص" },
  { en: "Scores & formulas", ar: "المؤشرات والمعادلات" },
  { en: "Findings", ar: "الملاحظات" },
  { en: "Fingerprint & limits", ar: "البصمة والحدود" },
] as const;

interface Props {
  page: 1 | 2 | 3 | 4;
  data: PassportData;
  exp: PassportExport | null;
  isArabic: boolean;
  /** First evidence image URL (illustrative in this prototype), optional. */
  evidenceUrl?: string;
}

const Disclaimer: React.FC = () => (
  <div className="rounded border border-amber-400 bg-amber-50 px-3 py-1.5 text-center text-[10px] font-bold text-amber-800">
    Prototype export with demo data — not an official document of Infath or any government body; not a certified
    inspection or valuation. · نموذج تجريبي ببيانات توضيحية، ليس مستنداً رسمياً ولا فحصاً أو تقييماً معتمداً.
  </div>
);

const Watermark: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden" aria-hidden="true">
    <span className="-rotate-30 select-none whitespace-nowrap text-center text-[34px] font-black leading-tight tracking-widest text-red-600/15">
      DEMO · NOT AN OFFICIAL DOCUMENT
      <br />
      نموذج تجريبي · ليس مستنداً رسمياً
    </span>
  </div>
);

const Row: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div className="flex justify-between gap-4 border-b border-slate-200 py-1.5 text-xs">
    <span className="text-slate-500">{k}</span>
    <span className="font-semibold text-slate-900 text-end">{v}</span>
  </div>
);

export const PassportDocument: React.FC<Props> = ({ page, data, exp, isArabic, evidenceUrl }) => {
  const t = (en: string, ar: string) => (isArabic ? ar : en);
  const sha = exp?.fingerprint.sha256 ?? "…";
  const generated = exp?.generated_at ?? "…";
  const a = data.asset;
  const s = data.scores;
  const fs = data.findings;

  const header = (
    <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">MIRAAH · {t("prototype", "نموذج تجريبي")}</div>
        <div className="text-lg font-black text-slate-950">{t("Asset Passport", "جواز الأصل")}</div>
        <div className="text-xs text-slate-600">{isArabic ? a.name_ar || a.name : a.name} · #{a.id}</div>
      </div>
      <div className="text-end text-[10px] text-slate-500 font-mono">
        <div>{PASSPORT_PAGE_TITLES[page - 1][isArabic ? "ar" : "en"]}</div>
        <div>
          {t("Page", "صفحة")} {page} / 4
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-2 text-[9px] text-slate-500 font-mono" dir="ltr">
      <span className="break-all">SHA-256 {sha}</span>
      <span className="shrink-0">{generated}</span>
    </div>
  );

  let body: React.ReactNode = null;

  if (page === 1) {
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [t("Liquidation Readiness", "جاهزية التصفية"), `${s.liquidation_readiness_index}/100`],
            [t("Condition Index", "مؤشر الحالة"), `${s.condition_index}/100`],
            [t("Coverage", "التغطية"), `${s.inspection_coverage_pct}%`],
            [t("Risk level", "مستوى المخاطر"), s.risk_level],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-300 p-3 text-center">
              <div className="text-[10px] text-slate-500">{k}</div>
              <div className="text-xl font-black text-slate-950">{v}</div>
            </div>
          ))}
        </div>
        <div>
          <Row k={t("Type", "النوع")} v={a.type} />
          <Row k={t("City / district", "المدينة / الحي")} v={`${a.city} / ${a.district}`} />
          <Row k={t("Built area", "مساحة البناء")} v={`${a.size_sqm.toLocaleString()} m²`} />
          <Row k={t("Build year", "سنة البناء")} v={a.build_year} />
          <Row k={t("Entered valuation (demo, not certified)", "القيمة المدخلة (توضيحية، غير معتمدة)")} v={`${a.entered_valuation_sar.toLocaleString()} SAR`} />
          <Row k={t("Inspection date", "تاريخ الفحص")} v={a.inspection_date} />
          <Row
            k={t("Findings (unresolved / total)", "الملاحظات (غير معالجة / الإجمالي)")}
            v={`${data.findings_summary.unresolved} / ${data.findings_summary.total}`}
          />
        </div>
        <p className="text-xs leading-relaxed text-slate-700">
          {t(
            "All values are computed by fixed formulas from the recorded demo data (see page 2). This summary is generated by code, not by AI.",
            "كل القيم محسوبة بمعادلات ثابتة من البيانات التوضيحية المسجلة (انظر الصفحة 2). هذا الملخص مولّد بالكود وليس بالذكاء الاصطناعي."
          )}
        </p>
      </div>
    );
  } else if (page === 2) {
    body = (
      <div className="space-y-3 text-xs text-slate-800">
        <Row k={t("Condition Index", "مؤشر الحالة")} v={s.condition_index} />
        <Row k={t("Inspection coverage", "تغطية الفحص")} v={`${s.inspection_coverage_pct}%`} />
        <Row k={t("Inspection confidence", "ثقة الفحص")} v={s.inspection_confidence} />
        <Row k={t("Liquidation Readiness Index", "مؤشر جاهزية التصفية")} v={s.liquidation_readiness_index} />
        <Row k={t("Risk level", "مستوى المخاطر")} v={s.risk_level} />
        <div className="rounded-lg bg-slate-50 p-3 font-mono text-[10.5px] leading-relaxed" dir="ltr">
          <div>CI = 100 − Σ unresolved weight × conf/100 (Critical 15, Moderate 8, Low 3)</div>
          <div>COV = mean(area coverage %)</div>
          <div>CONF = 0.50·COV + 0.30·mean(conf) + 0.20·evidence%</div>
          <div>LRI = 100 − 0.40(100−CI) − 0.35(100−COV) − 5·unresolved − 3·missing fields</div>
        </div>
        <p className="text-slate-600">
          {t(
            "Coefficients are prototype design choices, not calibrated against real auction outcomes. Not an engineering assessment or valuation.",
            "المعاملات اختيارات تصميمية للنموذج الأولي وغير معايرة على نتائج مزادات حقيقية. ليست تقييماً هندسياً ولا تقييماً عقارياً."
          )}
        </p>
      </div>
    );
  } else if (page === 3) {
    body = (
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            {["#", t("Type", "النوع"), t("Severity", "الخطورة"), t("Area", "المنطقة"), t("Conf.", "الثقة"), t("Verified", "متحقق"), t("Resolved", "معالج")].map((h) => (
              <th key={h} className="border border-slate-300 px-2 py-1 text-start">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fs.length === 0 ? (
            <tr>
              <td colSpan={7} className="border border-slate-300 px-2 py-2 text-center text-slate-500">
                {t("No findings recorded", "لا توجد ملاحظات مسجلة")}
              </td>
            </tr>
          ) : (
            fs.map((f) => (
              <tr key={f.id}>
                <td className="border border-slate-300 px-2 py-1">{f.id}</td>
                <td className="border border-slate-300 px-2 py-1">{f.type}</td>
                <td className="border border-slate-300 px-2 py-1">{f.severity}</td>
                <td className="border border-slate-300 px-2 py-1">{f.area}</td>
                <td className="border border-slate-300 px-2 py-1">{f.ai_confidence_pct}%</td>
                <td className="border border-slate-300 px-2 py-1">{f.verified_by_inspector ? t("Yes", "نعم") : t("No", "لا")}</td>
                <td className="border border-slate-300 px-2 py-1">{f.resolved ? t("Yes", "نعم") : t("No", "لا")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  } else {
    body = (
      <div className="space-y-3 text-xs text-slate-800">
        {evidenceUrl && (
          <figure>
            <img src={evidenceUrl} alt="" crossOrigin="anonymous" className="h-40 w-full rounded object-cover" />
            <figcaption className="mt-1 text-[10px] text-slate-500">
              {t("Illustrative stock image — not an inspection photograph.", "صورة توضيحية من مكتبة صور — ليست صورة فحص.")}
            </figcaption>
          </figure>
        )}
        <div className="rounded-lg bg-slate-50 p-3" dir="ltr">
          <div className="font-bold">SHA-256</div>
          <div className="break-all font-mono text-[10.5px]">{sha}</div>
          <div className="mt-1 text-[10px] text-slate-600">{exp?.fingerprint.covers}</div>
        </div>
        <p>
          {t(
            "What it proves: if you keep this fingerprint separately (e.g. send it in an email at export time), anyone can recompute it from the JSON export and detect any later change to the passport data.",
            "ماذا تثبت: إذا حُفظت هذه البصمة بشكل منفصل (مثلاً أُرسلت بالبريد وقت التصدير)، يمكن لأي شخص إعادة حسابها من ملف JSON واكتشاف أي تعديل لاحق على بيانات الجواز."
          )}
        </p>
        <p>
          {t(
            "What it does not prove: who produced the file, that the data is correct, or any official approval. It is not a digital signature; someone who edits the data can also recompute the hash inside the same file.",
            "ماذا لا تثبت: من أصدر الملف، أو صحة البيانات، أو أي اعتماد رسمي. ليست توقيعاً رقمياً؛ ومن يعدّل البيانات يستطيع إعادة حساب البصمة داخل الملف نفسه."
          )}
        </p>
        <p className="text-slate-600">{data.disclaimer}</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[1000px] flex-col bg-white p-8 text-slate-900" dir={isArabic ? "rtl" : "ltr"}>
      <Watermark />
      <div className="relative z-10 flex flex-1 flex-col gap-4">
        <Disclaimer />
        {header}
        <div className="flex-1">{body}</div>
        {footer}
      </div>
    </div>
  );
};
