import React, { useState, useMemo } from "react";
import { MOCK_ASSETS } from "./data/mockAssets";
import { AssetRecord, Finding, CoverageArea, ActionItem } from "./types";
import { computeAssetScores } from "./utils/scoring";
import { MiraahLogo } from "./components/common/MiraahLogo";
import { AssetPassportView } from "./components/AssetPassport/AssetPassportView";
import { AIFindingsView } from "./components/AIFindings/AIFindingsView";
import { CoverageView } from "./components/Coverage/CoverageView";
import { WhatIfSimulatorView } from "./components/WhatIfSimulator/WhatIfSimulatorView";
import { NextBestActionView } from "./components/NextBestAction/NextBestActionView";
import { BuyerView } from "./components/BuyerView/BuyerView";
import { MarketTrendsView } from "./components/MarketTrends/MarketTrendsView";
import { MediaUploadModal } from "./components/MediaUpload/MediaUploadModal";
import { ApiExplorerModal } from "./components/ApiExplorer/ApiExplorerModal";
import { ExportPassportModal } from "./components/ExportPassport/ExportPassportModal";
import { AIAssistantModal } from "./components/AIAssistant/AIAssistantModal";
import { PropTechCognitiveHub } from "./components/PropTechOS/PropTechCognitiveHub";
import { AccreditedPdfViewerModal, DocumentType } from "./components/Documents/AccreditedPdfViewerModal";
import { InteractiveTourModal } from "./components/Tour/InteractiveTourModal";
import { SaudiOpenDataJuly2026Modal } from "./components/MarketTrends/SaudiOpenDataJuly2026Modal";
import { ProjectDossierModal } from "./components/Presentation/ProjectDossierModal";
import { DemoDataBanner } from "./components/common/DemoDataBanner";
import { AssetSearchDropdown } from "./components/Navigation/AssetSearchDropdown";
import { useNotificationSystem } from "./hooks/useNotificationSystem";
import { NotificationToast } from "./components/Notifications/NotificationToast";
import { NotificationCenterModal } from "./components/Notifications/NotificationCenterModal";
import { useAuth } from "./context/AuthContext";
import { AuthUserButton } from "./components/Auth/AuthUserButton";
import { ThemeToggle } from "./components/common/ThemeToggle";
import { useTheme } from "./context/ThemeContext";
import { logInspectionAudit } from "./lib/firebase";
import {
  Home,
  Search,
  Compass,
  Zap,
  Target,
  Eye,
  TrendingUp,
  Code2,
  UploadCloud,
  Globe,
  Building2,
  Sparkles,
  ShieldCheck,
  FileDown,
  FileCheck2,
  Cpu,
  Bell,
  Database,
  Presentation,
} from "lucide-react";

export default function App() {
  const [assets, setAssets] = useState<AssetRecord[]>(MOCK_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("20481");
  const [activeTab, setActiveTab] = useState<string>("passport");
  const [isArabic, setIsArabic] = useState<boolean>(false);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isApiExplorerOpen, setIsApiExplorerOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState<boolean>(false);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState<DocumentType>("title_deed");
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isSaudiOpenDataOpen, setIsSaudiOpenDataOpen] = useState<boolean>(false);
  const [isProjectDossierOpen, setIsProjectDossierOpen] = useState<boolean>(false);
  const [highlightedFindingId, setHighlightedFindingId] = useState<number | null>(null);

  // Firebase Auth & Cloud Sync Context
  const { user } = useAuth();
  const { isDark } = useTheme();

  // Active Asset
  const activeAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Automated Notification & Risk Monitoring Engine
  const {
    notifications,
    unreadCount,
    highRiskCount,
    approachingDeadlinesCount,
    activeToasts,
    soundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    dismissToast,
    handleNavigateToNotification,
    simulateHighRiskFinding,
    simulateApproachingDeadline,
  } = useNotificationSystem(
    assets,
    (tabId) => setActiveTab(tabId),
    (assetId) => setSelectedAssetId(assetId),
    (findingId) => setHighlightedFindingId(findingId)
  );

  const handleOpenPdfViewer = (docType: DocumentType = "title_deed") => {
    setSelectedPdfDoc(docType);
    setIsPdfViewerOpen(true);
  };

  // Compute live scores (FR-07 → FR-13)
  const scores = useMemo(() => {
    return computeAssetScores(
      activeAsset.findings,
      activeAsset.coverageAreas,
      activeAsset.missingFieldsCount
    );
  }, [activeAsset]);

  // ── Mutation Handlers with Firestore Persistence ──
  const handleToggleVerification = (findingId: number) => {
    let nextState = false;
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== selectedAssetId) return asset;
        return {
          ...asset,
          findings: asset.findings.map((f) => {
            if (f.id === findingId) {
              nextState = !f.verified;
              return { ...f, verified: nextState };
            }
            return f;
          }),
        };
      })
    );

    // Save audit log to Firestore if user signed in
    if (user) {
      logInspectionAudit(user.uid, user.email || "", {
        assetId: selectedAssetId,
        findingId,
        verified: nextState,
        isResolved: false,
        actionTaken: nextState ? "VERIFIED_ENGINEERING" : "UNVERIFIED_FLAGGED",
      });
    }
  };

  const handleToggleResolved = (findingId: number) => {
    let nextState = false;
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== selectedAssetId) return asset;
        return {
          ...asset,
          findings: asset.findings.map((f) => {
            if (f.id === findingId) {
              nextState = !f.isResolved;
              return { ...f, isResolved: nextState };
            }
            return f;
          }),
        };
      })
    );

    // Save audit log to Firestore if user signed in
    if (user) {
      logInspectionAudit(user.uid, user.email || "", {
        assetId: selectedAssetId,
        findingId,
        verified: true,
        isResolved: nextState,
        actionTaken: nextState ? "DEFECT_RESOLVED" : "DEFECT_REOPENED",
      });
    }
  };

  const handleUpdateAreaCoverage = (areaId: string, newPct: number) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== selectedAssetId) return asset;
        return {
          ...asset,
          coverageAreas: asset.coverageAreas.map((a) =>
            a.id === areaId ? { ...a, pct: newPct } : a
          ),
        };
      })
    );
  };

  const handleExecuteAction = (actionId: string) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== selectedAssetId) return asset;
        const targetAct = asset.actions.find((a) => a.id === actionId);
        if (!targetAct) return asset;

        let updatedCoverage = [...asset.coverageAreas];
        let updatedFindings = [...asset.findings];
        let updatedMissing = asset.missingFieldsCount;

        if (targetAct.targetArea === "Roof") {
          updatedCoverage = updatedCoverage.map((a) =>
            a.area.toLowerCase().includes("roof") ? { ...a, pct: 98 } : a
          );
        } else if (targetAct.targetArea === "North Wall") {
          updatedFindings = updatedFindings.map((f) =>
            f.type === "Moisture" ? { ...f, isResolved: true, verified: true } : f
          );
        } else {
          updatedMissing = 0;
        }

        return {
          ...asset,
          missingFieldsCount: updatedMissing,
          coverageAreas: updatedCoverage,
          findings: updatedFindings,
          actions: asset.actions.map((a) =>
            a.id === actionId ? { ...a, completed: true } : a
          ),
        };
      })
    );
  };

  const handleAddCustomFinding = (newFinding: Finding) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== selectedAssetId) return asset;
        return {
          ...asset,
          findings: [newFinding, ...asset.findings],
        };
      })
    );
  };

  const TABS = [
    { id: "passport", label: "Asset Passport", labelArabic: "جواز الأصل والمناطق", icon: Home, emoji: "🏠" },
    { id: "proptech", label: "PropTech 2.0 OS", labelArabic: "منظومة PropTech المعرفية", icon: Cpu, emoji: "🤖" },
    { id: "findings", label: "AI Findings", labelArabic: "نتائج الذكاء الاصطناعي", icon: Search, emoji: "🔍" },
    { id: "coverage", label: "Spatial Coverage", labelArabic: "التغطية المكانية", icon: Compass, emoji: "📡" },
    { id: "trends", label: "Market Trends", labelArabic: "اتجاهات السوق والتقييم", icon: TrendingUp, emoji: "📈" },
    { id: "whatif", label: "What-If Simulator", labelArabic: "محاكي السيناريوهات", icon: Zap, emoji: "⚡" },
    { id: "actions", label: "Next Best Actions", labelArabic: "خطة التدخل الأمثل", icon: Target, emoji: "🎯" },
    { id: "buyer", label: "Buyer Transparency", labelArabic: "بوابة المشتري", icon: Eye, emoji: "👁" },
  ];

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen relative overflow-x-hidden transition-colors duration-200 ${
        isDark
          ? "bg-[#050811] text-white selection:bg-cyan-500/30 selection:text-cyan-300"
          : "bg-slate-50 text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-800"
      } ${
        isArabic ? "font-arabic" : "font-body"
      }`}
    >
      {/* Background Architectural Grid & Subtle Ambient Aura */}
      <div className={`fixed inset-0 bg-grid-command pointer-events-none z-0 ${
        isDark ? "opacity-30" : "opacity-40"
      }`} />
      <div className="fixed -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="fixed -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-radial from-blue-600/10 via-transparent to-transparent pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <DemoDataBanner isArabic={isArabic} />
        {/* ══ COMMAND CENTER TOP NAVIGATION BAR ══ */}
        <header className={`sticky top-0 z-40 backdrop-blur-2xl border-b px-4 sm:px-8 py-3 flex items-center justify-between gap-4 flex-wrap transition-colors duration-200 ${
          isDark
            ? "bg-slate-950/90 border-slate-800/90"
            : "bg-white/95 border-slate-200/90 shadow-sm"
        }`}>
          {/* Left: Brand Identity & Active Asset Tag */}
          <div className="flex items-center gap-5">
            <MiraahLogo
              size={40}
              showSubtitle={true}
              isArabic={isArabic}
              onClick={() => setIsTourOpen(true)}
              className="cursor-pointer hover:opacity-95"
            />
            
            {/* Asset Tag & Identification Badge */}
            <div className={`hidden lg:flex items-center gap-2 pl-4 border-l ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                isDark
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  : "bg-cyan-50 border-cyan-300 text-cyan-800"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span>#{activeAsset.id} - {isArabic ? activeAsset.nameArabic : activeAsset.name}</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-400"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}>
                {activeAsset.sizeSqm ? `${activeAsset.sizeSqm.toLocaleString()} م²` : "1,400 م²"}
              </span>
            </div>
          </div>

          {/* Center: Clean Nav Items */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 font-mono text-xs">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all select-none cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? isDark
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : "bg-cyan-50 text-cyan-800 border border-cyan-300 font-bold shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:text-white hover:bg-slate-900/60"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  <span>{isArabic ? tab.labelArabic : tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: AI Advisor + Actions + Language */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Interactive Tour Button */}
            <button
              onClick={() => setIsTourOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/35 hover:to-blue-600/35 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] group"
              title={isArabic ? "جولة تفاعلية شاملة للمنصة والتعريف بها" : "Comprehensive Interactive Platform Tour"}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
              <span>{isArabic ? "جولة تفاعلية" : "TOUR"}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-normal">
                {isArabic ? "دليل شامل" : "Guide"}
              </span>
            </button>

            {/* Saudi Open Data July 2026 Button */}
            <button
              onClick={() => setIsSaudiOpenDataOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm ${
                isDark
                  ? "bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white"
                  : "bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800"
              }`}
              title={isArabic ? "العمليات العقارية المسجلة - يوليو 2026 (البيانات المفتوحة)" : "Registered Real Estate Operations - July 2026 (Open Data)"}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>{isArabic ? "بيانات العقار 2026" : "GOV DATA 2026"}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                65.7k
              </span>
            </button>

            {/* Project Dossier & Executive Presentation Button */}
            <button
              onClick={() => setIsProjectDossierOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm ${
                isDark
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-600/20 hover:from-amber-500/35 hover:to-orange-600/35 border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white"
                  : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-sm"
              }`}
              title={isArabic ? "الملف التقديمي الشامل وملخص المشروع" : "Comprehensive Project Presentation & Dossier"}
            >
              <Presentation className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{isArabic ? "ملخص المشروع" : "PROJECT DOSSIER"}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-normal">
                {isArabic ? "شامل" : "Deck"}
              </span>
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer group ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 border-slate-700/80 hover:border-cyan-500/50 text-slate-200 hover:text-white"
                  : "bg-white hover:bg-slate-100 border-slate-300 text-slate-800 hover:border-cyan-500 shadow-sm"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 group-hover:rotate-12 transition-transform" />
              <span>{isArabic ? "مساعد مرآة" : "MIRAAH ASSISTANT"}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                isDark ? "bg-slate-800 text-cyan-300 border border-slate-700" : "bg-cyan-50 text-cyan-800 border border-cyan-200"
              }`}>
                {isArabic ? "يتطلب الدخول" : "Sign-in"}
              </span>
            </button>

            {/* Real-Time Notification & Risk Center Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className={`relative p-2 rounded-xl border transition-all cursor-pointer group ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-white"
                  : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:border-cyan-500 shadow-sm"
              }`}
              title={
                isArabic
                  ? `مركز الإشعارات والتنبيهات (${unreadCount} غير مقروء)`
                  : `Notification & Risk Alerts (${unreadCount} unread)`
              }
            >
              <Bell className={`w-4 h-4 ${unreadCount > 0 ? "text-cyan-500" : isDark ? "text-slate-400" : "text-slate-600"} group-hover:rotate-12 transition-transform`} />
              
              {unreadCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-mono font-black border-2 shadow-md ${
                    isDark ? "border-slate-950" : "border-white"
                  } ${
                    highRiskCount > 0
                      ? "bg-red-500 text-white animate-pulse"
                      : approachingDeadlinesCount > 0
                      ? "bg-amber-400 text-slate-950"
                      : "bg-cyan-400 text-slate-950"
                  }`}
                >
                  {unreadCount}
                </span>
              )}

              {highRiskCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-red-500 animate-ping pointer-events-none" />
              )}
            </button>

            {/* Searchable Asset Portfolio Dropdown */}
            <AssetSearchDropdown
              assets={assets}
              selectedAssetId={selectedAssetId}
              onSelectAsset={(assetId) => setSelectedAssetId(assetId)}
              isArabic={isArabic}
            />

            {/* Specimen documents */}
            <button
              onClick={() => handleOpenPdfViewer("title_deed")}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isDark
                  ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 text-amber-300 hover:text-amber-200"
                  : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900"
              }`}
              title={isArabic ? "نماذج مستندات توضيحية (غير رسمية)" : "Specimen documents (not official)"}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">{isArabic ? "نماذج مستندات" : "SPECIMENS"}</span>
            </button>

            {/* Export Dossier */}
            <button
              onClick={() => setIsExportOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white"
                  : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950 shadow-sm"
              }`}
              title="Export Full Due-Diligence Dossier"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-500" />
              <span className="hidden sm:inline">{isArabic ? "تصدير" : "EXPORT"}</span>
            </button>

            {/* Ingestion Trigger */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold">{isArabic ? "رفع وسائط" : "INGEST"}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setIsArabic(!isArabic)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950 shadow-sm"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-[11px]">{isArabic ? "EN" : "عربي"}</span>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <ThemeToggle isArabic={isArabic} />

            {/* Google Authentication & Firestore Cloud Profile */}
            <AuthUserButton isArabic={isArabic} />
          </div>
        </header>

        {/* ══ MOBILE SUB-NAV ══ */}
        <nav className={`md:hidden sticky top-[60px] z-30 backdrop-blur-xl border-b px-4 py-2 flex items-center gap-2 overflow-x-auto select-none font-mono text-xs ${
          isDark ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-slate-200 shadow-sm"
        }`}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1 px-3 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                      : "bg-cyan-50 text-cyan-800 font-bold border border-cyan-300"
                    : isDark
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                {isArabic ? tab.labelArabic : tab.label}
              </button>
            );
          })}
        </nav>

        {/* ══ MAIN VIEW CONTAINER ══ */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
          {activeTab === "passport" && (
            <AssetPassportView
              asset={activeAsset}
              scores={scores}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
              onOpenExportModal={() => setIsExportOpen(true)}
              onOpenPdfViewer={handleOpenPdfViewer}
              onOpenTour={() => setIsTourOpen(true)}
              onOpenDossier={() => setIsProjectDossierOpen(true)}
              onToggleVerification={handleToggleVerification}
              onToggleResolved={handleToggleResolved}
              isArabic={isArabic}
            />
          )}

          {activeTab === "proptech" && (
            <PropTechCognitiveHub
              asset={activeAsset}
              isArabic={isArabic}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
            />
          )}

          {activeTab === "findings" && (
            <AIFindingsView
              findings={activeAsset.findings}
              onToggleVerification={handleToggleVerification}
              onToggleResolved={handleToggleResolved}
              onOpenUploadModal={() => setIsUploadOpen(true)}
              highlightedFindingId={highlightedFindingId}
              onClearHighlight={() => setHighlightedFindingId(null)}
              isArabic={isArabic}
            />
          )}

          {activeTab === "coverage" && (
            <CoverageView
              coverageAreas={activeAsset.coverageAreas}
              findings={activeAsset.findings}
              scores={scores}
              onUpdateAreaCoverage={handleUpdateAreaCoverage}
              isArabic={isArabic}
            />
          )}

          {activeTab === "trends" && (
            <MarketTrendsView
              asset={activeAsset}
              scores={scores}
              isArabic={isArabic}
            />
          )}

          {activeTab === "whatif" && (
            <WhatIfSimulatorView asset={activeAsset} isArabic={isArabic} />
          )}

          {activeTab === "actions" && (
            <NextBestActionView
              actions={activeAsset.actions}
              onExecuteAction={handleExecuteAction}
              isArabic={isArabic}
            />
          )}

          {activeTab === "buyer" && (
            <BuyerView
              buyerItems={activeAsset.buyerItems}
              assetId={activeAsset.id}
              isArabic={isArabic}
            />
          )}
        </main>

        {/* ══ FOOTER WITH OFFICIAL BRAND EMBLEM ══ */}
        <footer className={`mt-auto border-t px-6 py-12 text-center select-none transition-colors ${
          isDark ? "border-slate-800/80 bg-slate-950" : "border-slate-200 bg-slate-50"
        }`}>
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <MiraahLogo variant="full" isArabic={isArabic} />
            
            <div className={`mt-8 pt-6 border-t w-full flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono gap-3 ${
              isDark ? "border-slate-800/60 text-slate-500" : "border-slate-200 text-slate-500"
            }`}>
              <span>INDEX_2026 · SPATIAL RECONSTRUCTION COMMAND CENTER</span>
              <span>COORDINATES 24.7742° N, 46.5912° E</span>
              <span>RIYADH, SAUDI ARABIA</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ══ FLOATING AI ADVISOR ACTION BUTTON ══ */}
      <div
        className={`fixed z-40 bottom-5 ${
          isArabic ? "left-5" : "right-5"
        } flex items-center animate-in fade-in duration-200`}
      >
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-xs border shadow-xl transition-all cursor-pointer select-none ${
            isDark
              ? "bg-slate-900/95 hover:bg-slate-850 text-slate-200 hover:text-white border-slate-700/80 hover:border-cyan-500/60"
              : "bg-white/95 hover:bg-slate-50 text-slate-800 hover:text-slate-900 border-slate-300 hover:border-teal-500 shadow-md"
          }`}
          title={isArabic ? "فتح مساعد مرآة (أسئلة عن بيانات الأصل)" : "Open the MIRAAH assistant (questions about the asset data)"}
        >
          <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
            isDark ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-400" : "bg-teal-50 border-teal-300 text-teal-700"
          }`}>
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          </div>

          <div className="flex flex-col text-start">
            <span className={`text-xs font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {isArabic ? "مساعد مرآة" : "MIRAAH Assistant"}
            </span>
            <span className={`text-[10px] font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isArabic ? "أسئلة عن بيانات الأصل" : "Ask about the asset data"}
            </span>
          </div>
        </button>
      </div>

      {/* ══ MODALS ══ */}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddNewCustomFinding={handleAddCustomFinding}
        onOpenPdfViewer={handleOpenPdfViewer}
        onAnalysisComplete={() => {
          setActiveTab("findings");
        }}
        isArabic={isArabic}
      />

      <ApiExplorerModal
        isOpen={isApiExplorerOpen}
        onClose={() => setIsApiExplorerOpen(false)}
        assetId={activeAsset.id}
      />

      <ExportPassportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        asset={activeAsset}
        scores={scores}
        onOpenPdfViewer={handleOpenPdfViewer}
        isArabic={isArabic}
      />

      <AIAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        asset={activeAsset}
        scores={scores}
        isArabic={isArabic}
      />

      <AccreditedPdfViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        asset={activeAsset}
        scores={scores}
        initialDocType={selectedPdfDoc}
        isArabic={isArabic}
      />

      {/* ══ INTERACTIVE COMPREHENSIVE TOUR MODAL ══ */}
      <InteractiveTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        isArabic={isArabic}
        onNavigateTab={(tabId) => setActiveTab(tabId)}
        onOpenAdvisor={() => setIsAiAssistantOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* ══ REAL-TIME NOTIFICATION SYSTEM (TOASTS & CENTER) ══ */}
      <NotificationToast
        toasts={activeToasts}
        onDismiss={dismissToast}
        onNavigate={handleNavigateToNotification}
        isArabic={isArabic}
      />

      <NotificationCenterModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        highRiskCount={highRiskCount}
        approachingDeadlinesCount={approachingDeadlinesCount}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDismiss={dismissNotification}
        onClearAll={clearAll}
        onNavigate={handleNavigateToNotification}
        onSimulateHighRisk={() => simulateHighRiskFinding(activeAsset)}
        onSimulateDeadline={() => simulateApproachingDeadline(activeAsset)}
        activeAsset={activeAsset}
        isArabic={isArabic}
      />

      {/* ══ SAUDI OPEN DATA JULY 2026 GLOBAL MODAL ══ */}
      <SaudiOpenDataJuly2026Modal
        isOpen={isSaudiOpenDataOpen}
        onClose={() => setIsSaudiOpenDataOpen(false)}
        isArabic={isArabic}
        currentAsset={activeAsset}
      />

      {/* ══ PROJECT EXECUTIVE PRESENTATION & DOSSIER MODAL ══ */}
      <ProjectDossierModal
        isOpen={isProjectDossierOpen}
        onClose={() => setIsProjectDossierOpen(false)}
        isArabic={isArabic}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsProjectDossierOpen(false);
        }}
      />
    </div>
  );
}

