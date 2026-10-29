import React, { useState } from "react";
import { BuyerVerificationItem } from "../../types";
import { GlassCard } from "../common/GlassCard";
import { Badge } from "../common/Badge";
import { useTheme } from "../../context/ThemeContext";
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Share2,
  QrCode,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

interface BuyerViewProps {
  buyerItems: BuyerVerificationItem[];
  assetId: string;
  isArabic?: boolean;
}

export const BuyerView: React.FC<BuyerViewProps> = ({
  buyerItems,
  assetId,
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const verificationHash = `MIRAAH-DEMO-REF-${assetId}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(
      `MIRAAH-DEMO-REF-${assetId} (public verification page is planned, not live)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusIcons = {
    VERIFIED: <CheckCircle2 className="w-5 h-5 text-[#00C5A0]" />,
    "AI DETECTED": <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
    "NOT INSPECTED": <HelpCircle className="w-5 h-5 text-[#64748B]" />,
    INCOMPLETE: <XCircle className="w-5 h-5 text-[#EF4444]" />,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Verified Buyer Philosophy Banner (Arabic & English) ── */}
      <GlassCard className="p-6 lg:p-8" glow glowColor="rgba(0,197,160,0.15)">
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-6 ${
          isDark ? "border-white/10" : "border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? "bg-[#00C5A0]/15 text-[#00C5A0]" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}>
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isDark ? "text-[#00C5A0]" : "text-emerald-700"
              }`}>
                {isArabic ? "بوابة الشفافية للمشتري والمستثمر (FR-17)" : "VERIFIED BUYER TRANSPARENCY PORTAL"}
              </span>
              <h2 className={`text-xl font-extrabold mt-0.5 ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                {isArabic ? "تجربة التحقق المستقل للأصول" : "Zero-Trust Asset Verification Engine"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowQrModal(true)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                isDark
                  ? "bg-[#0D2045] hover:bg-[#162E5E] border-[#00C5A0]/30 text-white"
                  : "bg-white hover:bg-slate-50 border-slate-300 text-slate-800"
              }`}
            >
              <QrCode className="w-4 h-4 text-[#00C5A0]" />
              <span>{isArabic ? "رمز الاستجابة QR" : "Buyer QR Pass"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C5A0] to-[#00E8BE] text-[#06101E] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-md shadow-[#00C5A0]/25 whitespace-nowrap cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isArabic ? "تم النسخ!" : "Link Copied!"}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>{isArabic ? "مشاركة رابط التحقق" : "Share Buyer View"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* The Signature Arabic Trust Philosophy Statement */}
        <div className={`p-5 rounded-2xl border relative overflow-hidden ${
          isDark
            ? "bg-black/40 border-[#00C5A0]/25"
            : "bg-emerald-50/70 border-emerald-200 shadow-sm"
        }`}>
          <div className="text-sm lg:text-base leading-relaxed font-semibold text-right dir-rtl space-y-1">
            <div className={`font-bold text-xs uppercase tracking-widest font-mono text-left dir-ltr mb-1 ${
              isDark ? "text-[#00E8BE]" : "text-emerald-800"
            }`}>
              MIRAAH BUYER PROMISE · وعد مرآة للشفافية
            </div>
            <p className={`font-['Tajawal'] text-lg ${
              isDark ? "text-[#F1F5F9]" : "text-slate-800"
            }`}>
              «مرآة لا تطلب من المشتري أن يثق بها فقط — بل تمنحه أربع حالات واضحة لكل معلومة، ليتحقق بنفسه من الأدلة المرئية مباشرة.»
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ── 4-State Transparency Legend ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            state: "VERIFIED",
            stateArabic: "تم التحقق منها بشرياً",
            desc: "Human inspector confirmed in situ with traceable visual proof.",
            color: "#00C5A0",
            icon: "✓",
          },
          {
            state: "AI DETECTED",
            stateArabic: "اكتشفها الذكاء الاصطناعي",
            desc: "Found by AI VLM scan, pending certified human inspector sign-off.",
            color: "#F59E0B",
            icon: "⚠",
          },
          {
            state: "NOT INSPECTED",
            stateArabic: "لم تُفحص بعد",
            desc: "Insufficient spatial media coverage or inaccessible area.",
            color: "#64748B",
            icon: "○",
          },
          {
            state: "INCOMPLETE",
            stateArabic: "بيانات ناقصة",
            desc: "Missing legal documentation or utility certificates in asset record.",
            color: "#EF4444",
            icon: "✗",
          },
        ].map((item) => (
          <GlassCard
            key={item.state}
            className="p-5 flex items-start gap-3.5"
            glow
            glowColor={`${item.color}20`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-lg shrink-0 shadow-lg"
              style={{
                backgroundColor: `${item.color}1A`,
                border: `1px solid ${item.color}40`,
                color: item.color,
                textShadow: isDark ? `0 0 10px ${item.color}` : "none",
              }}
            >
              {item.icon}
            </div>

            <div className="space-y-1">
              <div
                className="text-xs font-black tracking-wider uppercase font-mono"
                style={{ color: item.color }}
              >
                {item.state}
              </div>
              <div className={`text-[11px] font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                {isArabic ? item.stateArabic : item.state}
              </div>
              <p className={`text-[10px] leading-relaxed ${
                isDark ? "text-[#94A3B8]" : "text-slate-600"
              }`}>
                {item.desc}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ── Asset Inspection Items Summary Grid ── */}
      <GlassCard className="p-6 lg:p-8 space-y-6">
        <div className={`flex items-center justify-between border-b pb-4 ${
          isDark ? "border-white/10" : "border-slate-200"
        }`}>
          <div>
            <span className={`text-xs font-mono font-bold uppercase ${
              isDark ? "text-[#94A3B8]" : "text-slate-500"
            }`}>
              ASSET #{assetId}
            </span>
            <h3 className={`text-base font-extrabold ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              {isArabic ? "سجل التحقق الشامل للأنظمة والهيكل" : "Comprehensive Systems & Structural Verification Grid"}
            </h3>
          </div>

          <Badge color="#00C5A0">
            {buyerItems.filter((i) => i.status === "VERIFIED").length} / {buyerItems.length} Verified
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buyerItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                isDark ? "hover:bg-black/30" : "hover:bg-slate-50"
              }`}
              style={{
                backgroundColor: isDark ? `${item.color}0A` : "#ffffff",
                borderColor: isDark ? `${item.color}28` : "#e2e8f0",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className={`text-sm font-bold flex items-center gap-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}>
                    <span>{isArabic ? item.labelArabic : item.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase ${
                    isDark ? "text-[#64748B]" : "text-slate-500"
                  }`}>
                    Category: {item.category}
                  </span>
                </div>

                <Badge color={item.color} size="sm">
                  {item.status}
                </Badge>
              </div>

              <p className={`text-xs leading-relaxed ${
                isDark ? "text-[#CBD5E1]" : "text-slate-600"
              }`}>
                {isArabic ? item.statusDetailsArabic : item.statusDetails}
              </p>

              <div className={`flex items-center justify-between text-[11px] font-mono pt-2 border-t ${
                isDark ? "text-[#94A3B8] border-white/5" : "text-slate-500 border-slate-100"
              }`}>
                <span>
                  {item.lastVerifiedBy
                    ? `Verified by: ${item.lastVerifiedBy}`
                    : "Pending validation"}
                </span>
                <span className={`font-bold ${
                  isDark ? "text-[#00C5A0]" : "text-emerald-600"
                }`}>
                  {item.evidenceCount} frames attached
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── QR Code Verification Modal ── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`relative w-full max-w-md border rounded-2xl shadow-2xl p-6 text-center space-y-5 ${
            isDark
              ? "bg-[#09152B] border-[#00C5A0]/40 text-white"
              : "bg-white border-slate-200 text-slate-900 shadow-xl"
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? "border-white/10" : "border-slate-200"
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00C5A0]" />
                <span className="text-sm font-bold">Verified Buyer QR Pass</span>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className={`cursor-pointer ${isDark ? "text-[#94A3B8] hover:text-white" : "text-slate-400 hover:text-slate-700"}`}
              >
                ✕
              </button>
            </div>

            {/* Mock QR Code View */}
            <div className="p-6 bg-white rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-[0_0_30px_rgba(0,197,160,0.3)] border border-slate-200">
              <QrCode className="w-36 h-36 text-[#070E1C]" />
            </div>

            <div className="space-y-1">
              <div className={`text-xs font-mono font-bold ${
                isDark ? "text-[#00E8BE]" : "text-emerald-600"
              }`}>
                {verificationHash}
              </div>
              <p className={`text-xs ${
                isDark ? "text-[#94A3B8]" : "text-slate-500"
              }`}>
                Planned feature: a public verification page. Not live in this prototype; the QR code is illustrative.
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#00C5A0] hover:bg-[#00b08f] text-[#06101E] font-bold text-xs uppercase cursor-pointer transition-colors"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
