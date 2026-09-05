import React, { useState } from "react";
import { AppNotification, AssetRecord } from "../../types";
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Volume2,
  VolumeX,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  Filter,
  Layers,
  Zap,
} from "lucide-react";

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  highRiskCount: number;
  approachingDeadlinesCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (notif: AppNotification) => void;
  onSimulateHighRisk: () => void;
  onSimulateDeadline: () => void;
  activeAsset: AssetRecord;
  isArabic?: boolean;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  highRiskCount,
  approachingDeadlinesCount,
  soundEnabled,
  onToggleSound,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onClearAll,
  onNavigate,
  onSimulateHighRisk,
  onSimulateDeadline,
  activeAsset,
  isArabic = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "HIGH_RISK" | "DEADLINES" | "UNREAD">("ALL");

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === "HIGH_RISK") return notif.type === "HIGH_RISK_FINDING";
    if (activeFilter === "DEADLINES") return notif.type === "DEADLINE_APPROACHING";
    if (activeFilter === "UNREAD") return !notif.read;
    return true;
  });

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Ambient Top Glow Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 to-cyan-400" />

        {/* ══ HEADER ══ */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-950 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  {isArabic ? "مركز التنبيهات وإشعارات المخاطر" : "Alert & Risk Notification Center"}
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                    {unreadCount} {isArabic ? "جديد" : "New"}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {isArabic
                  ? "تنبيهات فورية عند رصد مخاطر عالية في العيوب أو اقتراب مواعيد مهام التدخل (SLA)"
                  : "Automated real-time monitoring for high-risk AI findings & approaching action deadlines"}
              </p>
            </div>
          </div>

          {/* Header Controls: Sound + Mark All Read + Close */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                soundEnabled
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                  : "bg-slate-800 border-slate-700 text-slate-500"
              }`}
              title={soundEnabled ? "Audio chime enabled" : "Audio chime muted"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[11px] hidden sm:inline">
                {soundEnabled ? (isArabic ? "الصوت مفعّل" : "Sound On") : (isArabic ? "صامت" : "Muted")}
              </span>
            </button>

            {/* Mark All Read */}
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{isArabic ? "تحديد الكل كمقروء" : "Mark All Read"}</span>
              </button>
            )}

            {/* Clear All */}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-2 rounded-xl hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title={isArabic ? "مسح جميع الإشعارات" : "Clear all notifications"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ══ SIMULATION TESTING BANNER ══ */}
        <div className="px-5 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-3 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{isArabic ? "محاكي الإشعارات الحية:" : "Live Simulation Suite:"}</span>
            <span className="text-slate-400 text-[11px] hidden md:inline">
              {isArabic ? "اختبار التنبيهات الفورية الصوتية والمرئية" : "Test real-time popups & audio alarms"}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                onSimulateHighRisk();
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>{isArabic ? "⚡ محاكاة عيب حرج (High Risk)" : "⚡ Simulate High-Risk Finding"}</span>
            </button>

            <button
              onClick={() => {
                onSimulateDeadline();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isArabic ? "⏳ محاكاة مهلة وشيكة (SLA)" : "⏳ Simulate Approaching Deadline"}</span>
            </button>
          </div>
        </div>

        {/* ══ FILTER TABS ══ */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto select-none">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === "ALL"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <span>{isArabic ? "جميع التنبيهات" : "All Alerts"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30">
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("HIGH_RISK")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === "HIGH_RISK"
                ? "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                : "bg-slate-800/80 text-red-400 hover:text-red-300"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isArabic ? "عيوب عالية الخطورة" : "High-Risk Findings"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {highRiskCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("DEADLINES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === "DEADLINES"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                : "bg-slate-800/80 text-amber-400 hover:text-amber-300"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isArabic ? "مواعيد وشيكة (SLA)" : "Approaching Deadlines"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {approachingDeadlinesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("UNREAD")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === "UNREAD"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <span>{isArabic ? "غير مقروءة" : "Unread"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {unreadCount}
            </span>
          </button>
        </div>

        {/* ══ NOTIFICATIONS LIST ══ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-white font-mono">
                {isArabic ? "لا توجد تنبيهات معلقة حالياً" : "All Clear — No Pending Alerts"}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                {isArabic
                  ? "جميع العيوب الإنشائية الحرج تمت معالجتها، ولا توجد مهام تدخل تجاوزت أو تقترب من انتهاء المهلة المحددة."
                  : "All critical AI inspection findings are within safe parameters and no action items are currently facing SLA breach."}
              </p>
              <div className="pt-2">
                <button
                  onClick={onSimulateHighRisk}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 transition-all"
                >
                  {isArabic ? "اختبار إرسال تنبيه تجريبي" : "Trigger Test Notification"}
                </button>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isCritical = notif.severity === "critical";
              const isFinding = notif.type === "HIGH_RISK_FINDING";

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                    notif.read
                      ? "bg-slate-950/40 border-slate-800/60 opacity-80 hover:opacity-100"
                      : isCritical
                      ? "bg-red-950/15 border-red-500/40 hover:border-red-500/70 shadow-[0_4px_20px_rgba(239,68,68,0.1)]"
                      : "bg-amber-950/15 border-amber-500/40 hover:border-amber-500/70 shadow-[0_4px_20px_rgba(245,158,11,0.1)]"
                  }`}
                >
                  {/* Left Color Accent Bar */}
                  <div
                    className={`absolute top-0 bottom-0 ${
                      isArabic ? "right-0" : "left-0"
                    } w-1.5 ${
                      isCritical ? "bg-red-500" : "bg-amber-400"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Icon */}
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          isCritical
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {isFinding ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider ${
                              isCritical
                                ? "bg-red-500/25 text-red-300 border border-red-500/40"
                                : "bg-amber-500/25 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            {isCritical
                              ? isArabic
                                ? "عيب عالي الخطورة · حرج"
                                : "HIGH RISK · CRITICAL"
                              : isArabic
                              ? "مهلة وشيكة · تحذير"
                              : "APPROACHING DEADLINE"}
                          </span>

                          <span className="text-[11px] font-mono text-cyan-300 font-bold">
                            #{notif.assetId} - {isArabic ? notif.assetNameArabic : notif.assetName}
                          </span>

                          <span className="text-[10px] font-mono text-slate-500">
                            {notif.timestamp}
                          </span>

                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white leading-snug">
                          {isArabic ? notif.titleArabic : notif.title}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {isArabic ? notif.messageArabic : notif.message}
                        </p>

                        {/* Metadata Tags */}
                        {notif.metadata && (
                          <div className="flex items-center gap-2 pt-1 font-mono text-[11px] flex-wrap">
                            {notif.metadata.sbcClause && (
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                                {notif.metadata.sbcClause}
                              </span>
                            )}
                            {notif.metadata.area && (
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                                {notif.metadata.area}
                              </span>
                            )}
                            {notif.metadata.hoursRemaining !== undefined && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                                {isArabic
                                  ? `متبقي ${notif.metadata.hoursRemaining} ساعة`
                                  : `${notif.metadata.hoursRemaining}h Remaining`}
                              </span>
                            )}
                            {notif.metadata.valueAtRiskSar !== undefined && (
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                {isArabic
                                  ? `${notif.metadata.valueAtRiskSar.toLocaleString()} ر.س معرّضة للخطر`
                                  : `SAR ${notif.metadata.valueAtRiskSar.toLocaleString()} at Risk`}
                              </span>
                            )}
                            {notif.metadata.confidence !== undefined && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                                {notif.metadata.confidence}% AI Conf
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions on notification */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate(notif);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                          isCritical
                            ? "bg-red-500 hover:bg-red-400 text-slate-950 font-black shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                            : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                        }`}
                      >
                        <span>
                          {isFinding
                            ? isArabic
                              ? "فحص العيب"
                              : "Inspect Defect"
                            : isArabic
                            ? "جدول التدخل"
                            : "Resolve Action"}
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isArabic ? "rotate-180" : ""}`} />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onMarkAsRead(notif.id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            notif.read
                              ? "text-slate-600 hover:text-slate-400"
                              : "text-slate-400 hover:text-cyan-300"
                          }`}
                          title={notif.read ? "Mark unread" : "Mark as read"}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDismiss(notif.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {isArabic
                ? "المراقبة اللحظية نشطة · متوافقة مع متطلبات كود البناء السعودي SBC"
                : "Continuous Automated Monitoring Active · SBC Compliant"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer font-bold"
          >
            {isArabic ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
