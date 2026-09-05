import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isArabic?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isArabic = false, className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-button"
      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
        isDark
          ? "bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-amber-300 hover:border-amber-400/50 shadow-sm"
          : "bg-white hover:bg-slate-100 border-slate-300 text-slate-800 hover:border-cyan-500 shadow-sm"
      } ${className}`}
      title={
        isArabic
          ? isDark
            ? "التبديل إلى الوضع النهاري"
            : "التبديل إلى الوضع الليلي"
          : isDark
          ? "Switch to Light Mode"
          : "Switch to Dark Mode"
      }
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="text-[11px] font-bold text-amber-300">
            {isArabic ? "نهاري" : "LIGHT"}
          </span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px] font-bold text-slate-800">
            {isArabic ? "ليلي" : "DARK"}
          </span>
        </>
      )}
    </button>
  );
};
