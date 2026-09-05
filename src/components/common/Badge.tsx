import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  size?: "xs" | "sm" | "md";
  dot?: boolean;
  variant?: "pill" | "tag" | "mono";
}

// Adjust colors for better readability on light backgrounds
function getReadableColor(hexColor: string, isDark: boolean): string {
  if (isDark) return hexColor;
  // If in light mode and color is very bright (e.g. #00E5B9, #60A5FA, #00C5A0), darken it slightly for high WCAG contrast
  const colorLower = hexColor.toLowerCase();
  if (colorLower.includes("00e5b9") || colorLower.includes("00c5a0")) {
    return "#047857"; // Deep emerald green
  }
  if (colorLower.includes("60a5fa") || colorLower.includes("38bdf8")) {
    return "#1d4ed8"; // Deep royal blue
  }
  if (colorLower.includes("f59e0b") || colorLower.includes("fbbf24")) {
    return "#b45309"; // Deep warm amber
  }
  if (colorLower.includes("ef4444") || colorLower.includes("f87171")) {
    return "#b91c1c"; // Deep crimson red
  }
  if (colorLower.includes("a855f7") || colorLower.includes("c084fc")) {
    return "#7e22ce"; // Deep violet purple
  }
  return hexColor;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = "#00E5B9",
  className = "",
  size = "sm",
  dot = false,
  variant = "tag",
}) => {
  const { isDark } = useTheme();
  const effectiveColor = getReadableColor(color, isDark);

  const sizeClasses =
    size === "xs"
      ? "px-2 py-0.5 text-[9px]"
      : size === "sm"
      ? "px-2.5 py-0.5 text-[10px]"
      : "px-3 py-1 text-xs";

  const radiusClass =
    variant === "pill"
      ? "rounded-full"
      : "rounded-md";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider select-none whitespace-nowrap transition-colors ${radiusClass} ${sizeClasses} ${className}`}
      style={{
        backgroundColor: isDark ? `${color}18` : `${effectiveColor}14`,
        border: `1px solid ${isDark ? `${color}35` : `${effectiveColor}40`}`,
        color: effectiveColor,
        boxShadow: isDark ? `0 0 10px ${color}10` : "none",
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
          style={{ backgroundColor: effectiveColor, boxShadow: isDark ? `0 0 8px ${color}` : "none" }}
        />
      )}
      {children}
    </span>
  );
};


