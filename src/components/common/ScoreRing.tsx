import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface ScoreRingProps {
  value: number;
  displayValue?: string | number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  gradient?: { from: string; to: string };
  unit?: string;
  label?: string;
  sublabel?: string;
  glow?: boolean;
  formulaTooltip?: string;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  value,
  displayValue,
  max = 100,
  size = 110,
  strokeWidth = 6,
  color = "#06B6D4",
  gradient,
  unit = "%",
  label,
  sublabel,
  glow = true,
  formulaTooltip,
  className = "",
}) => {
  const { isDark } = useTheme();
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.max(0, Math.min(value, max));
  const strokeDashoffset = circumference * (1 - normalizedValue / max);
  
  const fromColor = gradient?.from || color;
  const toColor = gradient?.to || (color === "#F59E0B" ? "#FBBF24" : color === "#10B981" ? "#06B6D4" : "#3B82F6");
  const filterId = `glow-${fromColor.replace(/[^a-zA-Z0-9]/g, "")}-${size}`;

  return (
    <div
      className={`inline-flex flex-col items-center group relative select-none ${className}`}
      title={formulaTooltip || `${label || "Score"}: ${value}`}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={`grad-${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>

          {/* Precision background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isDark ? "rgba(51, 65, 85, 0.4)" : "rgba(203, 213, 225, 0.7)"}
            strokeWidth={strokeWidth}
          />

          {/* Thin precision outer tick frame */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius + strokeWidth * 0.75}
            fill="none"
            stroke={isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.25)"}
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Radiant active progress bar */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#grad-${filterId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter={glow && isDark ? `url(#${filterId})` : undefined}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>

        {/* Center score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={`flex items-baseline font-display font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            <span style={{ fontSize: size >= 100 ? (String(displayValue || value).length > 4 ? "1.25rem" : "1.6rem") : "1.2rem" }} className="font-extrabold leading-none">
              {displayValue !== undefined ? displayValue : value}
            </span>
            {unit && (
              <span className={`text-[11px] font-mono font-semibold ml-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{unit}</span>
            )}
          </div>
          {max !== 100 && (
            <div className={`text-[9px] font-mono ${isDark ? "text-slate-500" : "text-slate-500"}`}>/ {max}</div>
          )}
        </div>
      </div>

      {label && (
        <div className="mt-2 text-center px-1">
          <div className={`text-xs font-semibold transition-colors tracking-tight ${isDark ? "text-slate-200 group-hover:text-cyan-400" : "text-slate-800 group-hover:text-cyan-600"}`}>
            {label}
          </div>
          {sublabel && (
            <div className={`text-[10px] font-mono mt-0.5 tracking-tight ${isDark ? "text-slate-400" : "text-slate-500"}`}>{sublabel}</div>
          )}
        </div>
      )}

      {formulaTooltip && (
        <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 z-30 transition-opacity bg-slate-900/95 border border-cyan-500/40 rounded-lg px-2.5 py-1 text-[11px] font-mono text-cyan-300 whitespace-nowrap shadow-2xl backdrop-blur-md">
          {formulaTooltip}
        </div>
      )}
    </div>
  );
};



