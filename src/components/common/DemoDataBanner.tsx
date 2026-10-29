import React from "react";
import { FlaskConical } from "lucide-react";

/**
 * Persistent disclosure shown on every screen: this is a prototype running on demo data,
 * not an official Infath (or other government) system.
 */
export const DemoDataBanner: React.FC<{ isArabic: boolean }> = ({ isArabic }) => (
  <div
    role="note"
    dir={isArabic ? "rtl" : "ltr"}
    className="w-full bg-amber-500/15 border-b border-amber-500/40 text-amber-200 text-[11px] sm:text-xs px-4 py-1.5 flex items-center justify-center gap-2 text-center"
  >
    <FlaskConical className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
    <span>
      {isArabic
        ? "نموذج تجريبي ببيانات توضيحية — ليس نظاماً رسمياً لمركز الإسناد والتصفية (إنفاذ) أو أي جهة حكومية. المستندات والأختام والتكاملات المعروضة محاكاة."
        : "Prototype with demo data — not an official system of Infath or any government body. Documents, seals and integrations shown are simulated."}
    </span>
  </div>
);

/** Small inline label for modules that run on simulated data. */
export const SimulatedBadge: React.FC<{ isArabic: boolean; className?: string }> = ({ isArabic, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded border border-amber-500/50 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 ${className}`}
  >
    <FlaskConical className="w-3 h-3" aria-hidden="true" />
    {isArabic ? "محاكاة · بيانات توضيحية" : "Simulated · demo data"}
  </span>
);
