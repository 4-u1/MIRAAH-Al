import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Building,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  AlertCircle,
  X,
} from "lucide-react";

interface AuthUserButtonProps {
  isArabic?: boolean;
}

export const AuthUserButton: React.FC<AuthUserButtonProps> = ({ isArabic = false }) => {
  const { user, profile, loading, authError, clearAuthError, signIn, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignInClick = async () => {
    if (isAttemptingLogin) return;
    setIsAttemptingLogin(true);
    try {
      await signIn();
    } finally {
      setIsAttemptingLogin(false);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(window.location.href, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="h-8 w-24 bg-slate-800/60 animate-pulse rounded-xl" />
    );
  }

  return (
    <div className="relative" ref={dropdownRef} dir={isArabic ? "rtl" : "ltr"}>
      {!user ? (
        <button
          onClick={handleSignInClick}
          disabled={isAttemptingLogin}
          className={`px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer ${
            isAttemptingLogin ? "opacity-75 cursor-wait" : ""
          }`}
          title={isArabic ? "تسجيل الدخول عبر حساب Google المعتمد" : "Sign in with Google"}
        >
          <LogIn className={`w-3.5 h-3.5 ${isAttemptingLogin ? "animate-spin" : ""}`} />
          <span>{isAttemptingLogin ? (isArabic ? "جاري الفتح..." : "Opening...") : (isArabic ? "تسجيل الدخول" : "SIGN IN")}</span>
        </button>
      ) : (
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono transition-all cursor-pointer group"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-6 h-6 rounded-lg object-cover border border-cyan-400/50"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] border border-cyan-500/40">
              {(user.displayName || user.email || "U")[0].toUpperCase()}
            </div>
          )}

          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-bold text-white group-hover:text-cyan-300 transition-colors max-w-[100px] truncate">
              {user.displayName || user.email?.split("@")[0]}
            </div>
          </div>

          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform" />
        </button>
      )}

      {/* Popup Blocked or Auth Guidance Dialog */}
      {authError && (
        <div
          className={`absolute ${
            isArabic ? "left-0" : "right-0"
          } mt-2 w-72 sm:w-80 bg-slate-950/98 border border-amber-500/40 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.15)] p-4 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {authError.type === "popup_blocked"
                  ? isArabic
                    ? "النافذة المنبثقة محظورة"
                    : "Popup Blocked by Browser"
                  : isArabic
                  ? "تنبيه تسجيل الدخول"
                  : "Sign-In Alert"}
              </span>
            </div>
            <button
              onClick={clearAuthError}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="py-2.5 text-xs text-slate-300 leading-relaxed font-sans">
            {isArabic ? authError.messageArabic : authError.message}
          </p>

          <div className="pt-2 flex flex-col gap-2">
            {authError.type === "popup_blocked" && (
              <button
                onClick={handleOpenInNewTab}
                className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {isArabic
                    ? "فتح في تبويب مستقل وتسجيل الدخول"
                    : "Open in New Tab to Sign In"}
                </span>
              </button>
            )}

            <button
              onClick={handleSignInClick}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-mono transition-all cursor-pointer"
            >
              {isArabic ? "إعادة المحاولة" : "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* User Profile Dropdown */}
      {dropdownOpen && user && (
        <div
          className={`absolute ${
            isArabic ? "left-0" : "right-0"
          } mt-2 w-64 bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="w-10 h-10 rounded-xl object-cover border border-cyan-400"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-sm border border-cyan-500/40">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {user.displayName || "Authorized Officer"}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase">
                  {isArabic ? "موثّق في Firestore" : "Cloud Sync Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="py-2.5 space-y-1.5 text-[11px] font-mono border-b border-slate-800">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                {isArabic ? "الدور الوظيفي:" : "Role:"}
              </span>
              <span className="text-cyan-300 font-bold">
                {isArabic ? "مستخدم تجريبي" : "Demo user"}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                {isArabic ? "الجهة:" : "Entity:"}
              </span>
              <span className="text-slate-200 truncate max-w-[130px]">
                {profile?.organization || (isArabic ? "غير محددة" : "Not set")}
              </span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut();
              }}
              className="w-full px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isArabic ? "تسجيل الخروج" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
