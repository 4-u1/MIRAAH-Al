import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const officialLogoImg = "/miraah-logo.jpg";

interface MiraahLogoProps {
  size?: number;
  showSubtitle?: boolean;
  isArabic?: boolean;
  variant?: "horizontal" | "full" | "icon" | "badge" | "authentic";
  className?: string;
  onClick?: () => void;
}

export const MiraahLogo: React.FC<MiraahLogoProps> = ({
  size = 44,
  showSubtitle = true,
  isArabic = false,
  variant = "horizontal",
  className = "",
  onClick,
}) => {
  const { isDark } = useTheme();
  const [imgError, setImgError] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // 1. Pure Authentic Original Image Presentation (Full Fidelity 100%)
  if (variant === "authentic") {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.25)] border border-cyan-500/30 bg-slate-950 p-1.5 transition-transform duration-300 hover:scale-[1.02] cursor-pointer ${className}`}
        onClick={() => {
          setShowFullPreview(true);
          onClick?.();
        }}
      >
        <img
          src={officialLogoImg}
          alt="MIRAAH مرآة Official Brand Logo"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain rounded-xl"
        />
      </div>
    );
  }

  // 2. Full Emblem Brand Presentation (for Footer, Splash, or About Section)
  if (variant === "full") {
    return (
      <div className={`flex flex-col items-center text-center select-none group ${className}`}>
        {/* Authentic High-Res Image Container with Precision Glow & Bevel */}
        <div
          onClick={() => setShowFullPreview(true)}
          className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden p-2 border transition-all duration-300 group-hover:scale-105 cursor-pointer ${
            isDark
              ? "bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#020617] border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.25)] group-hover:border-cyan-400/70 group-hover:shadow-[0_0_45px_rgba(6,182,212,0.4)]"
              : "bg-white border-slate-200 shadow-lg group-hover:border-cyan-500/60 group-hover:shadow-xl"
          }`}
        >
          {/* Subtle Ambient Radial Glow inside Frame */}
          <div className="absolute inset-0 bg-radial from-cyan-500/15 via-transparent to-transparent pointer-events-none" />

          {!imgError ? (
            <img
              src={officialLogoImg}
              alt="MIRAAH مرآة Logo"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <VectorEmblem size={200} />
          )}

          {/* Holographic HUD Badge on Image */}
          <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full backdrop-blur-md border text-[9px] font-mono font-bold tracking-wider ${
            isDark
              ? "bg-slate-950/80 border-cyan-500/40 text-cyan-300"
              : "bg-white/90 border-cyan-500/40 text-cyan-800 shadow-sm"
          }`}>
            100% AUTHENTIC IDENTITY
          </div>
        </div>

        {/* Subtitle with Frame Rules */}
        <div className="mt-4 flex items-center gap-3 max-w-md w-full px-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-cyan-500/60" />
          <span className={`text-[11px] uppercase font-mono font-bold tracking-wider whitespace-nowrap ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}>
            {isArabic
              ? "منصة الذكاء المكاني وجاهزية تصفية الأصول"
              : "Spatial Asset Intelligence & Liquidation Readiness"}
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-cyan-500/30 to-cyan-500/60" />
        </div>

        {/* Operational Workflow Pipeline */}
        <div className={`mt-3 flex flex-wrap justify-center items-center gap-2 font-mono text-[9px] font-bold tracking-widest ${
          isDark ? "text-cyan-400" : "text-cyan-700"
        }`}>
          <span>MEDIA INGEST</span>
          <span className={`text-[8px] ${isDark ? "text-slate-600" : "text-slate-400"}`}>▶</span>
          <span>EVIDENCE</span>
          <span className={`text-[8px] ${isDark ? "text-slate-600" : "text-slate-400"}`}>▶</span>
          <span>AI INTELLIGENCE</span>
          <span className={`text-[8px] ${isDark ? "text-slate-600" : "text-slate-400"}`}>▶</span>
          <span>VALUATION & READINESS</span>
        </div>

        {/* Full Image Lightbox Modal if Clicked */}
        {showFullPreview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in"
            onClick={() => setShowFullPreview(false)}
          >
            <div
              className="relative max-w-lg w-full bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.35)] flex flex-col items-center text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-cyan-400">MIRAAH OFFICIAL IDENTITY</div>
                  <div className="text-[10px] text-slate-400">Vector & 3D Master Asset (1024x1024)</div>
                </div>
                <button
                  onClick={() => setShowFullPreview(false)}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white transition-colors cursor-pointer"
                >
                  ✕ إغلاق
                </button>
              </div>

              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 p-2 shadow-inner">
                <img
                  src={officialLogoImg}
                  alt="Full Brand Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="mt-4 font-mono text-xs text-slate-300">
                الهوية البصرية الرسمية لمنصة <span className="text-cyan-400 font-bold">مرآة</span> لإدارة وتصفية الأصول العقارية المكانية
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Icon Only Variant
  if (variant === "icon") {
    return (
      <div
        className={`relative rounded-xl overflow-hidden flex items-center justify-center p-1 transition-all duration-300 border border-cyan-500/30 bg-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:border-cyan-400/60 ${className}`}
        style={{ width: size, height: size }}
      >
        {!imgError ? (
          <img
            src={officialLogoImg}
            alt="MIRAAH"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <VectorEmblem size={size} />
        )}
      </div>
    );
  }

  // 4. Horizontal Header Navigation Bar Variant (Ultra-Harmonious & Perfectly Aligned)
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 select-none group cursor-pointer ${className}`}
      title="منصة مرآة للذكاء المكاني وتصفية الأصول"
    >
      {/* 3D Master Image Emblem Avatar with Holographic Cyan/Gold Glass Border */}
      <div
        className="relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/80 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_12px_rgba(6,182,212,0.2)] bg-gradient-to-b from-slate-900 to-slate-950"
        style={{
          width: size + 4,
          height: size + 4,
        }}
      >
        {!imgError ? (
          <img
            src={officialLogoImg}
            alt="MIRAAH مرآة Official Brand Emblem"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <VectorEmblem size={size} />
        )}

        {/* Micro Cyan Dot Accent */}
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
      </div>

      {/* Brand Typography (Harmonious Dual-Language Display) */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-2.5 leading-none">
          {/* MIRAAH in Pure Crisp Display Typography with Gold/Cyan Highlights */}
          <span
            className={`text-xl sm:text-2xl font-display font-black tracking-[0.14em] transition-colors ${
              isDark ? "text-white group-hover:text-cyan-200" : "text-slate-900 group-hover:text-cyan-600"
            }`}
            style={{
              textShadow: isDark ? "0 0 18px rgba(6, 182, 212, 0.4)" : "none",
            }}
          >
            MIRAAH
          </span>

          {/* Arabic Calligraphy Style Title */}
          <span
            className={`text-xl sm:text-2xl font-black font-arabic ${
              isDark
                ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300"
                : "text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-amber-600"
            }`}
            style={{
              textShadow: isDark ? "0 0 16px rgba(6, 182, 212, 0.35)" : "none",
            }}
          >
            مرآة
          </span>
        </div>

        {showSubtitle && (
          <div className={`text-[9.5px] uppercase font-mono font-semibold tracking-[0.12em] flex items-center gap-1.5 mt-1 transition-colors ${
            isDark ? "text-slate-400 group-hover:text-slate-300" : "text-slate-600 group-hover:text-slate-800"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>
              {isArabic
                ? "منصة الذكاء المكاني وجاهزية التصفية"
                : "Spatial Asset Intelligence & Liquidation"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// High-detail SVG fallback representation of the 3D emblem
const VectorEmblem: React.FC<{ size: number }> = ({ size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mRibbonGrad" x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#60A5FA" />
          <stop offset="70%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#0B1C42" />
        </linearGradient>
        <linearGradient id="mFrameGrad" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="mCyanGlow" x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5B9" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Background Mirror Bevel Frame */}
      <rect
        x="42"
        y="8"
        width="48"
        height="64"
        rx="10"
        fill="url(#mFrameGrad)"
        stroke="#60A5FA"
        strokeWidth="2"
      />
      
      {/* Mirror Viewport Screen showing villa + blueprint */}
      <rect x="46" y="12" width="40" height="56" rx="6" fill="#0A1124" />
      
      {/* Blueprint Grid Lines inside Screen */}
      <g stroke="#00E5B9" strokeWidth="0.6" opacity="0.5">
        <line x1="50" y1="24" x2="82" y2="24" />
        <line x1="50" y1="36" x2="82" y2="36" />
        <line x1="50" y1="48" x2="82" y2="48" />
        <line x1="50" y1="60" x2="82" y2="60" />
        <line x1="58" y1="16" x2="58" y2="64" />
        <line x1="70" y1="16" x2="70" y2="64" />
      </g>

      {/* Villa Geometric Silhouette */}
      <path
        d="M52 58V34h12V22h14v12h4V58z"
        fill="rgba(59, 130, 246, 0.4)"
        stroke="#93C5FD"
        strokeWidth="1.2"
      />

      {/* AR Corner Reticles */}
      <path d="M68 28h4v4" stroke="#00E5B9" strokeWidth="1.2" />
      <path d="M78 28h-4v4" stroke="#00E5B9" strokeWidth="1.2" />
      <path d="M68 44h4v-4" stroke="#00E5B9" strokeWidth="1.2" />
      <path d="M78 44h-4v-4" stroke="#00E5B9" strokeWidth="1.2" />

      {/* 3D Location Marker on Top */}
      <circle cx="54" cy="14" r="5" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
      <circle cx="54" cy="14" r="2.2" fill="#00E5B9" />
      <line x1="54" y1="19" x2="54" y2="25" stroke="#38BDF8" strokeWidth="1.8" />

      {/* 3D Sculpted Ribbon "M" */}
      <path
        d="M10 84V36l20 28 18-28v48h-8V52L27 72 17 52v32z"
        fill="url(#mRibbonGrad)"
        stroke="#93C5FD"
        strokeWidth="1.2"
        filter="drop-shadow(0 4px 10px rgba(0,0,0,0.8))"
      />
    </svg>
  );
};


