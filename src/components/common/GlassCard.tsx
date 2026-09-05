import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  hoverEffect?: boolean;
  id?: string;
  reticles?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glow = false,
  glowColor = "rgba(0, 229, 185, 0.12)",
  onClick,
  style = {},
  hoverEffect = true,
  id,
  reticles = false,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative rounded-xl backdrop-blur-2xl transition-all duration-300 group ${
        isDark
          ? "bg-[#080E1A]/90 border border-white/[0.09] text-white"
          : "bg-white/95 border border-slate-200/90 text-slate-800 shadow-[0_4px_25px_rgba(15,23,42,0.06)]"
      } ${
        hoverEffect
          ? isDark
            ? "hover:border-white/[0.2] hover:bg-[#0B1322]/95 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_35px_var(--glow-color)]"
            : "hover:border-cyan-500/50 hover:bg-white hover:shadow-[0_15px_35px_rgba(15,23,42,0.1),0_0_20px_rgba(6,182,212,0.15)]"
          : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={
        {
          "--glow-color": glow ? glowColor : "transparent",
          boxShadow: isDark
            ? "0 12px 35px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
            : "0 8px 30px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
          ...style,
        } as React.CSSProperties
      }
    >
      {/* Top subtle highlight */}
      <div className={`absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent pointer-events-none rounded-t-xl ${
        isDark ? "via-white/20" : "via-slate-300/40"
      } to-transparent`} />

      {/* Optional Architectural Reticles */}
      {reticles && (
        <>
          <span className={`absolute -top-1 -left-1 text-[10px] font-mono pointer-events-none select-none ${isDark ? "text-white/25" : "text-slate-400"}`}>
            +
          </span>
          <span className={`absolute -top-1 -right-1 text-[10px] font-mono pointer-events-none select-none ${isDark ? "text-white/25" : "text-slate-400"}`}>
            +
          </span>
          <span className={`absolute -bottom-1 -left-1 text-[10px] font-mono pointer-events-none select-none ${isDark ? "text-white/25" : "text-slate-400"}`}>
            +
          </span>
          <span className={`absolute -bottom-1 -right-1 text-[10px] font-mono pointer-events-none select-none ${isDark ? "text-white/25" : "text-slate-400"}`}>
            +
          </span>
        </>
      )}

      {children}
    </div>
  );
};


