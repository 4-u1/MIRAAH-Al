import React from "react";
import { AppNotification } from "../../types";
import {
  AlertTriangle,
  Clock,
  X,
  ArrowRight,
  ShieldAlert,
  ExternalLink,
  Flame,
} from "lucide-react";

interface NotificationToastProps {
  toasts: AppNotification[];
  onDismiss: (id: string) => void;
  onNavigate: (notif: AppNotification) => void;
  isArabic?: boolean;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toasts,
  onDismiss,
  onNavigate,
  isArabic = false,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`fixed top-20 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none ${
        isArabic ? "left-4 sm:left-6" : "right-4 sm:right-6"
      }`}
    >
      {toasts.map((toast) => {
        const isCritical = toast.severity === "critical";
        const isFinding = toast.type === "HIGH_RISK_FINDING";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full rounded-2xl backdrop-blur-2xl border p-4 shadow-2xl transition-all animate-in slide-in-from-top-4 duration-300 relative overflow-hidden group ${
              isCritical
                ? "bg-slate-950/95 border-red-500/60 shadow-[0_10px_35px_rgba(239,68,68,0.35)]"
                : "bg-slate-950/95 border-amber-500/60 shadow-[0_10px_35px_rgba(245,158,11,0.3)]"
            }`}
          >
            {/* Ambient edge glow bar */}
            <div
              className={`absolute top-0 bottom-0 ${
                isArabic ? "right-0" : "left-0"
              } w-1.5 ${
                isCritical
                  ? "bg-gradient-to-b from-red-500 to-rose-600 shadow-[0_0_12px_#ef4444]"
                  : "bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_0_12px_#f59e0b]"
              }`}
            />

            {/* Subtle background pulse aura */}
            <div
              className={`absolute -right-12 -top-12 w-32 h-32 rounded-full pointer-events-none opacity-20 ${
                isCritical ? "bg-red-500 blur-2xl" : "bg-amber-400 blur-2xl"
              }`}
            />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Alert Icon Badge */}
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isCritical
                      ? "bg-red-500/20 border border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      : "bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                  }`}
                >
                  {isFinding ? (
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Clock className="w-5 h-5 animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider ${
                        isCritical
                          ? "bg-red-500/25 text-red-300 border border-red-500/40"
                          : "bg-amber-500/25 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {isCritical
                        ? isArabic
                          ? "حرج · عالي الخطورة"
                          : "HIGH RISK · CRITICAL"
                        : isArabic
                        ? "مهلة وشيكة · تحذير"
                        : "URGENT DEADLINE"}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400 truncate">
                      #{toast.assetId} - {isArabic ? toast.assetNameArabic : toast.assetName}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-tight">
                    {isArabic ? toast.titleArabic : toast.title}
                  </h4>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    {isArabic ? toast.messageArabic : toast.message}
                  </p>

                  {/* Metadata Chips */}
                  {toast.metadata && (
                    <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-slate-400 flex-wrap">
                      {toast.metadata.sbcClause && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
                          {toast.metadata.sbcClause}
                        </span>
                      )}
                      {toast.metadata.hoursRemaining !== undefined && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                          {isArabic ? `${toast.metadata.hoursRemaining} ساعة متبقية` : `${toast.metadata.hoursRemaining}h Left`}
                        </span>
                      )}
                      {toast.metadata.confidence && (
                        <span className="text-emerald-400 font-bold">
                          {toast.metadata.confidence}% AI Conf
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => onNavigate(toast)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                        isCritical
                          ? "bg-red-500 hover:bg-red-400 text-slate-950 font-black shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                          : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.35)]"
                      }`}
                    >
                      <span>
                        {isFinding
                          ? isArabic
                            ? "فحص العيب فوراً"
                            : "Inspect Finding"
                          : isArabic
                          ? "عرض جدول التدخل"
                          : "View Action Item"}
                      </span>
                      <ArrowRight className={`w-3 h-3 ${isArabic ? "rotate-180" : ""}`} />
                    </button>

                    <button
                      onClick={() => onDismiss(toast.id)}
                      className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isArabic ? "تجاهل" : "Dismiss"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Animated Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800">
              <div
                className={`h-full animate-[shrink_7s_linear_forwards] ${
                  isCritical ? "bg-red-500" : "bg-amber-400"
                }`}
                style={{
                  animation: "shrink 7s linear forwards",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
