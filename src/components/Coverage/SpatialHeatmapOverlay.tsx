import React, { useState } from "react";
import {
  Layers,
  Flame,
  Radio,
  Eye,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Compass,
  Sliders,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import { CoverageArea, Finding, DefectType } from "../../types";
import { Badge } from "../common/Badge";
import { useTheme } from "../../context/ThemeContext";

interface SpatialHeatmapOverlayProps {
  coverageAreas: CoverageArea[];
  findings?: Finding[];
  onUpdateAreaCoverage: (areaId: string, newPct: number) => void;
  isArabic?: boolean;
}

type FloorLevel = "L0" | "L1" | "L2";
type HeatmapMode = "risk" | "coverage" | "camera";

interface RoomDefinition {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  areaSqm: number;
  coverageAreaId: string;
  floor: FloorLevel;
  path: string; // SVG path data
  centerX: number;
  centerY: number;
  defaultRisk: "Low" | "Moderate" | "Critical";
  defectIds?: number[];
}

export const SpatialHeatmapOverlay: React.FC<SpatialHeatmapOverlayProps> = ({
  coverageAreas,
  findings = [],
  onUpdateAreaCoverage,
  isArabic = false,
}) => {
  const { isDark } = useTheme();
  const [selectedFloor, setSelectedFloor] = useState<FloorLevel>("L0");
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("risk");
  const [opacity, setOpacity] = useState<number>(0.75);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>("room-living");
  const [selectedFindingId, setSelectedFindingId] = useState<number | null>(null);

  // Architectural Rooms Data across 3 Floors
  const ROOMS: RoomDefinition[] = [
    // ── Ground Floor (L0) ──
    {
      id: "room-living",
      code: "GF-01",
      name: "Living Room & Majlis",
      nameArabic: "مجلس وصالة المعيشة",
      areaSqm: 64,
      coverageAreaId: "ar-1",
      floor: "L0",
      path: "M 80,80 L 480,80 L 480,300 L 80,300 Z",
      centerX: 280,
      centerY: 190,
      defaultRisk: "Moderate",
      defectIds: [1], // Moisture North Wall
    },
    {
      id: "room-kitchen",
      code: "GF-02",
      name: "Kitchen & Pantry",
      nameArabic: "المطبخ الرئيسي والمؤونة",
      areaSqm: 32,
      coverageAreaId: "ar-4",
      floor: "L0",
      path: "M 490,80 L 820,80 L 820,240 L 490,240 Z",
      centerX: 655,
      centerY: 160,
      defaultRisk: "Low",
      defectIds: [2], // Surface tile damage
    },
    {
      id: "room-entrance",
      code: "GF-03",
      name: "Foyer & Main Entrance",
      nameArabic: "المدخل الرئيسي والبهو",
      areaSqm: 24,
      coverageAreaId: "ar-3",
      floor: "L0",
      path: "M 490,250 L 680,250 L 680,370 L 490,370 Z",
      centerX: 585,
      centerY: 310,
      defaultRisk: "Low",
      defectIds: [6], // Paint peeling entrance
    },
    {
      id: "room-bath1",
      code: "GF-04",
      name: "Guest Bathroom",
      nameArabic: "دورة مياه الضيوف",
      areaSqm: 12,
      coverageAreaId: "ar-5",
      floor: "L0",
      path: "M 690,250 L 820,250 L 820,370 L 690,370 Z",
      centerX: 755,
      centerY: 310,
      defaultRisk: "Low",
    },
    {
      id: "room-garage",
      code: "GF-05",
      name: "Garage & West Courtyard",
      nameArabic: "كراج السيارات والفناء الغربي",
      areaSqm: 56,
      coverageAreaId: "ar-7",
      floor: "L0",
      path: "M 80,310 L 480,310 L 480,480 L 80,480 Z",
      centerX: 280,
      centerY: 395,
      defaultRisk: "Low",
    },

    // ── First Floor (L1) ──
    {
      id: "room-master",
      code: "L1-01",
      name: "Master Suite & Walk-in",
      nameArabic: "جناح النوم الرئيسي",
      areaSqm: 52,
      coverageAreaId: "ar-2",
      floor: "L1",
      path: "M 80,80 L 440,80 L 440,320 L 80,320 Z",
      centerX: 260,
      centerY: 200,
      defaultRisk: "Low",
    },
    {
      id: "room-bed2",
      code: "L1-02",
      name: "Second Bedroom & Study",
      nameArabic: "غرفة النوم الثانية والمكتب",
      areaSqm: 38,
      coverageAreaId: "ar-2",
      floor: "L1",
      path: "M 450,80 L 820,80 L 820,260 L 450,260 Z",
      centerX: 635,
      centerY: 170,
      defaultRisk: "Moderate",
      defectIds: [4], // Ceiling crack
    },
    {
      id: "room-corridor",
      code: "L1-03",
      name: "Central Corridor & Landing",
      nameArabic: "الممر المركزي والبهو العلوي",
      areaSqm: 28,
      coverageAreaId: "ar-3",
      floor: "L1",
      path: "M 450,270 L 670,270 L 670,480 L 450,480 Z",
      centerX: 560,
      centerY: 375,
      defaultRisk: "Low",
      defectIds: [3], // Paint peeling near AC
    },
    {
      id: "room-balcony",
      code: "L1-04",
      name: "South-Facing Balcony",
      nameArabic: "الشرفة الجنوبية والواجهة",
      areaSqm: 22,
      coverageAreaId: "ar-6",
      floor: "L1",
      path: "M 80,330 L 440,330 L 440,480 L 80,480 Z",
      centerX: 260,
      centerY: 405,
      defaultRisk: "Low",
      defectIds: [5], // Balcony rail wear
    },

    // ── Roof & External Envelope (L2) ──
    {
      id: "room-roof-main",
      code: "L2-01",
      name: "Main Concrete Roof Deck",
      nameArabic: "سطح المبنى الرئيسي وعزل المطر",
      areaSqm: 180,
      coverageAreaId: "ar-8",
      floor: "L2",
      path: "M 80,80 L 620,80 L 620,480 L 80,480 Z",
      centerX: 350,
      centerY: 280,
      defaultRisk: "Critical", // Roof has 34% coverage, Primary Blocker
      defectIds: [],
    },
    {
      id: "room-hvac",
      code: "L2-02",
      name: "HVAC & Solar Plant Deck",
      nameArabic: "منصة التكييف المركزي والطاقة",
      areaSqm: 48,
      coverageAreaId: "ar-8",
      floor: "L2",
      path: "M 630,80 L 820,80 L 820,280 L 630,280 Z",
      centerX: 725,
      centerY: 180,
      defaultRisk: "Moderate",
    },
    {
      id: "room-north-facade",
      code: "L2-03",
      name: "North Perimeter Wall Envelope",
      nameArabic: "غلاف الجدار الخارجي الشمالي",
      areaSqm: 65,
      coverageAreaId: "ar-1",
      floor: "L2",
      path: "M 630,290 L 820,290 L 820,480 L 630,480 Z",
      centerX: 725,
      centerY: 385,
      defaultRisk: "Moderate",
      defectIds: [7], // Exterior wall crack
    },
  ];

  // Inspector Camera Path Trajectory Points (FR-01 Keyframes)
  const CAMERA_TRAJECTORY: Record<FloorLevel, { x: number; y: number; id: string; label: string }[]> = {
    L0: [
      { x: 120, y: 120, id: "KF-01", label: "Entrance Scan (00:04)" },
      { x: 260, y: 100, id: "KF-02", label: "North Wall Baseboard (00:42) ⚠" },
      { x: 400, y: 160, id: "KF-03", label: "Majlis Central 360 (01:12)" },
      { x: 540, y: 140, id: "KF-04", label: "Kitchen Tile Aisle (01:44) ⚠" },
      { x: 740, y: 150, id: "KF-05", label: "Pantry Backwall (02:10)" },
      { x: 750, y: 310, id: "KF-06", label: "Guest Bath Plumbing (02:45)" },
      { x: 580, y: 310, id: "KF-07", label: "Foyer Arch & Paint (05:20) ⚠" },
      { x: 280, y: 390, id: "KF-08", label: "Garage Gate & Flooring (05:55)" },
    ],
    L1: [
      { x: 560, y: 440, id: "KF-09", label: "Staircase Landing (03:10)" },
      { x: 560, y: 320, id: "KF-10", label: "AC Duct Flaking Scan (02:32) ⚠" },
      { x: 630, y: 170, id: "KF-11", label: "Room 2 Gypsum Ceiling (03:35) ⚠" },
      { x: 260, y: 160, id: "KF-12", label: "Master Bed Window (04:02)" },
      { x: 260, y: 400, id: "KF-13", label: "Balcony Handrail (04:40) ⚠" },
    ],
    L2: [
      { x: 160, y: 160, id: "KF-14", label: "Roof Access Hatch (06:10)" },
      { x: 350, y: 280, id: "KF-15", label: "Thermal Drone Overhead (06:30)" },
      { x: 725, y: 180, id: "KF-16", label: "HVAC Chillers Scan (06:42)" },
      { x: 725, y: 385, id: "KF-17", label: "North Facade Render (06:35) ⚠" },
    ],
  };

  // Filter rooms for current floor
  const currentFloorRooms = ROOMS.filter((r) => r.floor === selectedFloor);
  const currentTrajectory = CAMERA_TRAJECTORY[selectedFloor] || [];

  // Helper to get dynamic coverage & defect state for room
  const getRoomMetrics = (room: RoomDefinition) => {
    const cov = coverageAreas.find((a) => a.id === room.coverageAreaId);
    const roomFindings = findings.filter(
      (f) =>
        (room.defectIds && room.defectIds.includes(f.id)) ||
        f.area.toLowerCase().includes(room.name.toLowerCase().split(" ")[0])
    );

    const hasUnresolved = roomFindings.some((f) => !f.isResolved);
    const hasCritical = roomFindings.some((f) => f.severity === "Critical" && !f.isResolved);
    const hasModerate = roomFindings.some((f) => f.severity === "Moderate" && !f.isResolved);

    const coveragePct = cov ? cov.pct : 85;

    // Heatmap Color Calculation
    let riskColor = "#00C5A0"; // Safe Teal
    let riskLevel: "Low" | "Moderate" | "Critical" = "Low";

    if (hasCritical || (cov && cov.isPrimaryBlocker && cov.pct < 70)) {
      riskColor = "#EF4444"; // Red Critical
      riskLevel = "Critical";
    } else if (hasModerate || coveragePct < 80) {
      riskColor = "#F59E0B"; // Amber Moderate
      riskLevel = "Moderate";
    } else if (roomFindings.length > 0) {
      riskColor = "#38BDF8"; // Sky Blue Low Defect
      riskLevel = "Low";
    }

    // Coverage Color
    let coverageColor = "#00C5A0";
    if (coveragePct < 70) coverageColor = "#EF4444";
    else if (coveragePct < 90) coverageColor = "#F59E0B";

    return {
      coveragePct,
      roomFindings,
      hasUnresolved,
      riskColor,
      riskLevel,
      coverageColor,
      coverageArea: cov,
    };
  };

  // Active selected room details
  const activeRoom = ROOMS.find((r) => r.id === selectedRoomId);
  const activeRoomMetrics = activeRoom ? getRoomMetrics(activeRoom) : null;
  const activeFinding = findings.find((f) => f.id === selectedFindingId);

  return (
    <div className="space-y-6">
      {/* ── Header & Control Ribbon ── */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl shadow-xl border ${
        isDark ? "bg-[#09152B] border-[#00C5A0]/25" : "bg-white border-slate-200"
      }`}>
        {/* Floor Switcher */}
        <div className="flex items-center gap-2">
          <div className={`text-xs font-mono font-bold uppercase mr-1 flex items-center gap-1.5 ${
            isDark ? "text-[#94A3B8]" : "text-slate-600"
          }`}>
            <Layers className={`w-4 h-4 ${isDark ? "text-[#00C5A0]" : "text-teal-600"}`} />
            <span>{isArabic ? "مستوى الطابق:" : "Floor Plan:"}</span>
          </div>

          <div className={`flex rounded-xl p-1 text-xs font-mono border ${
            isDark ? "bg-[#050C18] border-white/10" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => setSelectedFloor("L0")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFloor === "L0"
                  ? isDark
                    ? "bg-[#00C5A0] text-[#050C18] shadow-md shadow-[#00C5A0]/20 font-bold"
                    : "bg-white text-teal-700 shadow-sm border border-slate-200 font-bold"
                  : isDark
                  ? "text-[#94A3B8] hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>L0</span>
              <span className="hidden sm:inline">Ground Floor</span>
            </button>
            <button
              onClick={() => setSelectedFloor("L1")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFloor === "L1"
                  ? isDark
                    ? "bg-[#00C5A0] text-[#050C18] shadow-md shadow-[#00C5A0]/20 font-bold"
                    : "bg-white text-teal-700 shadow-sm border border-slate-200 font-bold"
                  : isDark
                  ? "text-[#94A3B8] hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>L1</span>
              <span className="hidden sm:inline">First Floor</span>
            </button>
            <button
              onClick={() => setSelectedFloor("L2")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFloor === "L2"
                  ? "bg-[#EF4444] text-white shadow-md shadow-[#EF4444]/30"
                  : isDark
                  ? "text-[#94A3B8] hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>L2</span>
              <span className="hidden sm:inline">Roof & Envelope</span>
              {coverageAreas.find((a) => a.area.toLowerCase().includes("roof"))?.pct! < 70 && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* Heatmap Mode Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex rounded-xl p-1 text-xs font-mono border ${
            isDark ? "bg-[#050C18] border-white/10" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => setHeatmapMode("risk")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                heatmapMode === "risk"
                  ? "bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white shadow-md"
                  : isDark
                  ? "text-[#94A3B8] hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isArabic ? "توزيع المخاطر" : "Defect Risk"}</span>
            </button>
            <button
              onClick={() => setHeatmapMode("coverage")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                heatmapMode === "coverage"
                  ? isDark
                    ? "bg-[#00C5A0] text-[#050C18] shadow-md font-bold"
                    : "bg-white text-teal-700 shadow-sm border border-slate-200 font-bold"
                  : isDark
                  ? "text-[#94A3B8] hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isArabic ? "كثافة التغطية" : "Coverage Density"}</span>
            </button>
            <button
              onClick={() => setHeatmapMode("camera")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                heatmapMode === "camera"
                  ? "bg-[#3B82F6] text-white shadow-md"
                  : isDark
                  ? "text-[#94A3B8] hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isArabic ? "مسار الكاميرا" : "VLM Trajectory"}</span>
            </button>
          </div>

          {/* Opacity Control */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
            isDark ? "bg-[#050C18] border-white/10" : "bg-slate-100 border-slate-200"
          }`}>
            <Sliders className={`w-3.5 h-3.5 ${isDark ? "text-[#00C5A0]" : "text-teal-600"}`} />
            <span className={`text-[11px] font-mono ${isDark ? "text-[#94A3B8]" : "text-slate-600 font-medium"}`}>Glow:</span>
            <input
              type="range"
              min="0.2"
              max="0.95"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className={`w-16 h-1.5 cursor-pointer rounded-lg ${isDark ? "accent-[#00C5A0] bg-white/20" : "accent-teal-600 bg-slate-300"}`}
            />
            <span className={`text-[11px] font-mono font-bold w-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Canvas & Inspector Side HUD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Blueprint Canvas (Col 8/12) */}
        <div className={`lg:col-span-8 relative rounded-3xl shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between select-none border ${
          isDark ? "bg-[#040B17] border-[#00C5A0]/25" : "bg-slate-900 border-slate-700"
        }`}>
          {/* Blueprint Grid Watermark & Compass */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
            <div className="px-3 py-1 rounded-lg bg-[#050C18]/80 border border-white/10 text-[11px] font-mono text-[#00E8BE] font-bold backdrop-blur-md flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 animate-pulse" />
              <span>NORTH ⬆ · GRID 1:100</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/5 text-[10px] font-mono text-[#64748B]">
              SCALE: 1 cm = 1.2 m
            </div>
          </div>

          {/* Layer Quick Toggles (Top-Right Floating HUD) */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-[#050C18]/85 border border-white/10 rounded-xl p-1 backdrop-blur-md text-[10px] font-mono">
            <button
              onClick={() => setShowPins(!showPins)}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                showPins ? "bg-[#00C5A0]/20 text-[#00E8BE] font-bold" : "text-[#64748B]"
              }`}
            >
              Pins
            </button>
            <button
              onClick={() => setShowTrajectory(!showTrajectory)}
              className={`px-2 py-1 rounded-md transition-all ${
                showTrajectory ? "bg-[#3B82F6]/20 text-[#60A5FA] font-bold" : "text-[#64748B]"
              }`}
            >
              Path
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2 py-1 rounded-md transition-all ${
                showLabels ? "bg-white/10 text-white font-bold" : "text-[#64748B]"
              }`}
            >
              Tags
            </button>
          </div>

          {/* SVG Floor Plan Canvas */}
          <div className="relative w-full aspect-[900/560] flex items-center justify-center p-2">
            <svg
              viewBox="0 0 900 560"
              className="w-full h-full"
              style={{ filter: "drop-shadow(0 0 20px rgba(0,197,160,0.05))" }}
            >
              <defs>
                {/* Architectural Grid Pattern */}
                <pattern id="archGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.04)"
                    strokeWidth="1"
                  />
                </pattern>

                {/* Intense Thermal Heatmap Blur */}
                <filter id="thermalGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="22" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Defect Gradient Overlays */}
                <radialGradient id="heatCritical" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#F97316" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heatModerate" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#EAB308" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heatSafe" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00C5A0" stopOpacity="0.6" />
                  <stop offset="70%" stopColor="#00E8BE" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#00C5A0" stopOpacity="0" />
                </radialGradient>

                {/* Marker Pulse Animation */}
                <radialGradient id="pinPulse" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="1" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Architectural Grid */}
              <rect width="900" height="560" fill="url(#archGrid)" />

              {/* Outer Boundary Foundation Perimeter (Thick Concrete Wall) */}
              <rect
                x="60"
                y="60"
                width="780"
                height="440"
                rx="6"
                fill="#061226"
                stroke="#1E3A8A"
                strokeWidth="6"
                strokeDasharray="none"
              />

              {/* ── RENDER ROOM POLYGONS & HEATMAP FILLS ── */}
              {currentFloorRooms.map((room) => {
                const metrics = getRoomMetrics(room);
                const isSelected = selectedRoomId === room.id;

                let fillColor = "transparent";
                if (heatmapMode === "risk") {
                  fillColor = metrics.riskColor;
                } else if (heatmapMode === "coverage") {
                  fillColor = metrics.coverageColor;
                } else {
                  fillColor = "#1D4ED8";
                }

                return (
                  <g
                    key={room.id}
                    className="cursor-pointer transition-all duration-300 group"
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      if (room.defectIds && room.defectIds.length > 0) {
                        setSelectedFindingId(room.defectIds[0]);
                      }
                    }}
                  >
                    {/* Thermal Heat Glow Layer */}
                    <path
                      d={room.path}
                      fill={fillColor}
                      fillOpacity={opacity * (isSelected ? 0.85 : 0.45)}
                      filter="url(#thermalGlow)"
                      className="transition-all duration-500"
                    />

                    {/* Room Architectural Fill & Border */}
                    <path
                      d={room.path}
                      fill={fillColor}
                      fillOpacity={isSelected ? 0.35 : 0.15}
                      stroke={isSelected ? "#00E8BE" : "#38BDF8"}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeOpacity={isSelected ? 1 : 0.6}
                      className="transition-all duration-200 hover:fill-opacity-40"
                    />

                    {/* Architectural Room Dimension Lines & Inner Partition Wall */}
                    <path
                      d={room.path}
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="2"
                    />

                    {/* Room Labels & Metrics */}
                    {showLabels && (
                      <g
                        transform={`translate(${room.centerX}, ${room.centerY})`}
                        pointerEvents="none"
                      >
                        {/* Room Code Badge */}
                        <rect
                          x="-34"
                          y="-24"
                          width="68"
                          height="18"
                          rx="4"
                          fill="#050C18"
                          fillOpacity="0.85"
                          stroke={isSelected ? "#00E8BE" : "rgba(255,255,255,0.15)"}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="-11"
                          textAnchor="middle"
                          fill={isSelected ? "#00E8BE" : "#CBD5E1"}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {room.code}
                        </text>

                        {/* Room Name */}
                        <text
                          x="0"
                          y="6"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="11"
                          fontWeight="600"
                          fontFamily="sans-serif"
                        >
                          {isArabic ? room.nameArabic : room.name}
                        </text>

                        {/* Telemetry Tag: Area & Coverage */}
                        <text
                          x="0"
                          y="20"
                          textAnchor="middle"
                          fill={metrics.coveragePct >= 90 ? "#00C5A0" : "#EF4444"}
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {room.areaSqm}m² · {metrics.coveragePct}% Cov
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* ── VLM CAMERA WALKING TRAJECTORY ── */}
              {showTrajectory && currentTrajectory.length > 1 && (
                <g className="transition-all duration-300">
                  {/* Trajectory Connecting Polyline */}
                  <polyline
                    points={currentTrajectory.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeDasharray="6,4"
                    strokeOpacity="0.8"
                    filter="drop-shadow(0 0 6px #3B82F6)"
                  />

                  {/* Keyframe Camera Nodes */}
                  {currentTrajectory.map((pt, idx) => (
                    <g key={pt.id} transform={`translate(${pt.x}, ${pt.y})`} className="cursor-pointer">
                      <circle
                        r="8"
                        fill="#050C18"
                        stroke="#60A5FA"
                        strokeWidth="2"
                        filter="drop-shadow(0 0 5px #60A5FA)"
                      />
                      <circle r="3" fill="#60A5FA" />
                      <text
                        x="0"
                        y="18"
                        textAnchor="middle"
                        fill="#93C5FD"
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {pt.id}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* ── INTERACTIVE DEFECT HOTSPOT PINS ── */}
              {showPins &&
                findings.map((f) => {
                  // Find matching room for finding
                  const targetRoom = currentFloorRooms.find(
                    (r) =>
                      (r.defectIds && r.defectIds.includes(f.id)) ||
                      r.name.toLowerCase().includes(f.area.toLowerCase().split(" ")[0])
                  );

                  if (!targetRoom) return null;

                  // Offset pin slightly from room center for realistic spatial dispersion
                  const pinX = targetRoom.centerX + (f.id % 2 === 0 ? 35 : -35);
                  const pinY = targetRoom.centerY + (f.id % 3 === 0 ? 25 : -25);
                  const isPinSelected = selectedFindingId === f.id;

                  const pinColor =
                    f.severity === "Critical"
                      ? "#EF4444"
                      : f.severity === "Moderate"
                      ? "#F59E0B"
                      : "#38BDF8";

                  return (
                    <g
                      key={`pin-${f.id}`}
                      transform={`translate(${pinX}, ${pinY})`}
                      className="cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFindingId(f.id);
                        setSelectedRoomId(targetRoom.id);
                      }}
                    >
                      {/* Outer Ping Glow for Unresolved Critical/Moderate */}
                      {!f.isResolved && (
                        <circle
                          r="18"
                          fill={pinColor}
                          opacity="0.35"
                          className="animate-ping origin-center"
                        />
                      )}

                      {/* Pin Circle Body */}
                      <circle
                        r={isPinSelected ? "13" : "10"}
                        fill="#050C18"
                        stroke={pinColor}
                        strokeWidth={isPinSelected ? "3" : "2"}
                        filter={`drop-shadow(0 0 10px ${pinColor})`}
                        className="transition-all"
                      />

                      {/* Pin Icon / Number */}
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={pinColor}
                        fontSize="9"
                        fontWeight="black"
                        fontFamily="monospace"
                      >
                        !
                      </text>

                      {/* Floating Defect Tooltip */}
                      <g
                        transform="translate(0, -22)"
                        className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      >
                        <rect
                          x="-50"
                          y="-20"
                          width="100"
                          height="20"
                          rx="4"
                          fill="#050C18"
                          stroke={pinColor}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="-6"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {f.type} ({f.conf}%)
                        </text>
                      </g>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Bottom Live Blueprint Legend */}
          <div className={`px-6 py-3 border-t flex items-center justify-between flex-wrap gap-4 text-xs font-mono ${
            isDark ? "bg-[#050C18]/90 border-white/10" : "bg-slate-950/95 border-slate-700"
          }`}>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-slate-400">LEGEND:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]" />
                <span className="text-slate-200">Critical / Blocked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
                <span className="text-slate-200">Moderate Defect</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C5A0] shadow-[0_0_6px_#00C5A0]" />
                <span className="text-slate-200">Optimal (90%+ Cov)</span>
              </div>
            </div>

            <div className="text-[#00E8BE] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive CAD Raytracer Active</span>
            </div>
          </div>
        </div>

        {/* ── Inspector Spatial HUD / Room Deep-Dive Panel (Col 4/12) ── */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Selected Zone Telemetry Card */}
          <div className={`p-5 rounded-3xl shadow-xl space-y-4 border ${
            isDark ? "bg-[#09152B] border-[#00C5A0]/30" : "bg-white border-slate-200"
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? "border-white/10" : "border-slate-200"
            }`}>
              <div>
                <div className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                  isDark ? "text-[#00E8BE]" : "text-teal-700"
                }`}>
                  {activeRoom ? activeRoom.code : "ZONE"} TELEMETRY
                </div>
                <div className={`text-base font-bold mt-0.5 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {activeRoom
                    ? isArabic
                      ? activeRoom.nameArabic
                      : activeRoom.name
                    : "Select a Zone on Map"}
                </div>
              </div>

              {activeRoomMetrics && (
                <Badge
                  color={
                    activeRoomMetrics.riskLevel === "Critical"
                      ? "#EF4444"
                      : activeRoomMetrics.riskLevel === "Moderate"
                      ? "#F59E0B"
                      : isDark ? "#00C5A0" : "#0D9488"
                  }
                  size="sm"
                >
                  {activeRoomMetrics.riskLevel.toUpperCase()} RISK
                </Badge>
              )}
            </div>

            {activeRoom && activeRoomMetrics ? (
              <div className="space-y-4 text-xs font-mono">
                {/* Zone Metric Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-3 rounded-xl border ${
                    isDark ? "bg-black/40 border-white/5" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className={`text-[10px] ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>Surface Area</div>
                    <div className={`text-sm font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {activeRoom.areaSqm} m²
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border ${
                    isDark ? "bg-black/40 border-white/5" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className={`text-[10px] ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>Spatial Coverage</div>
                    <div
                      className="text-sm font-bold mt-0.5"
                      style={{ color: activeRoomMetrics.coverageColor }}
                    >
                      {activeRoomMetrics.coveragePct}%
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border ${
                    isDark ? "bg-black/40 border-white/5" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className={`text-[10px] ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>Detected Findings</div>
                    <div className={`text-sm font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {activeRoomMetrics.roomFindings.length} Items
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border ${
                    isDark ? "bg-black/40 border-white/5" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className={`text-[10px] ${isDark ? "text-[#64748B]" : "text-slate-500"}`}>Captured Keyframes</div>
                    <div className={`text-sm font-bold mt-0.5 ${isDark ? "text-[#60A5FA]" : "text-blue-600"}`}>
                      {activeRoomMetrics.coverageArea?.capturedFrames || 8} /{" "}
                      {activeRoomMetrics.coverageArea?.expectedFrames || 10}
                    </div>
                  </div>
                </div>

                {/* Direct Action Trigger: Rescan / Simulate Area */}
                {activeRoomMetrics.coverageArea && (
                  <div className={`p-3.5 rounded-xl border space-y-2 ${
                    isDark ? "bg-[#0D1F45] border-[#00C5A0]/20" : "bg-teal-50/50 border-teal-200"
                  }`}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Adjust Zone Coverage:</span>
                      <span className={`font-bold ${isDark ? "text-[#00E8BE]" : "text-teal-700"}`}>
                        {activeRoomMetrics.coverageArea.pct}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateAreaCoverage(
                            activeRoomMetrics.coverageArea!.id,
                            98
                          )
                        }
                        className="flex-1 py-2 px-3 rounded-lg bg-[#00C5A0] hover:bg-[#00E8BE] text-[#050C18] font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#00C5A0]/20 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Simulate 98% Scan</span>
                      </button>

                      <button
                        onClick={() =>
                          onUpdateAreaCoverage(
                            activeRoomMetrics.coverageArea!.id,
                            45
                          )
                        }
                        className={`py-2 px-3 rounded-lg text-[11px] transition-all cursor-pointer border ${
                          isDark
                            ? "bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white border-white/5"
                            : "bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200"
                        }`}
                        title="Simulate partial scan gap"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`py-8 text-center text-xs ${isDark ? "text-[#64748B]" : "text-slate-400"}`}>
                Click any room on the blueprint to inspect spatial risk
              </div>
            )}
          </div>

          {/* Active Finding Evidence Card (if selected) */}
          {activeFinding ? (
            <div className={`p-5 rounded-3xl shadow-xl space-y-3 animate-in fade-in duration-200 border ${
              isDark ? "bg-[#09152B] border-[#F59E0B]/40" : "bg-white border-amber-300/80"
            }`}>
              <div className={`flex items-center justify-between border-b pb-2.5 ${
                isDark ? "border-white/10" : "border-slate-200"
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${isDark ? "text-[#F59E0B]" : "text-amber-600"}`} />
                  <span className={`text-xs font-bold font-mono ${isDark ? "text-white" : "text-slate-900"}`}>
                    FINDING #{activeFinding.id} · {activeFinding.type}
                  </span>
                </div>
                <Badge
                  color={
                    activeFinding.severity === "Critical"
                      ? "#EF4444"
                      : activeFinding.severity === "Moderate"
                      ? "#F59E0B"
                      : "#38BDF8"
                  }
                  size="sm"
                >
                  {activeFinding.severity}
                </Badge>
              </div>

              <p className={`text-xs leading-relaxed ${isDark ? "text-[#CBD5E1]" : "text-slate-700"}`}>
                {activeFinding.description}
              </p>

              {/* Photo Evidence Preview Thumbnail */}
              {activeFinding.evidence[0] && (
                <div className={`relative rounded-xl overflow-hidden h-32 group border ${
                  isDark ? "border-white/15" : "border-slate-200"
                }`}>
                  <img
                    src={activeFinding.evidence[0].frameUrl}
                    alt="Finding Snapshot"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-[#00E8BE] font-bold">
                      📸 Keyframe @ {activeFinding.evidence[0].timestampFormatted} · {activeFinding.conf}% AI Conf
                    </span>
                  </div>
                </div>
              )}

              <div className={`p-2.5 rounded-lg text-[11px] font-mono border ${
                isDark ? "bg-black/30 text-[#94A3B8] border-white/5" : "bg-slate-50 text-slate-600 border-slate-200"
              }`}>
                <strong className={isDark ? "text-[#00E8BE]" : "text-teal-700"}>Recommendation:</strong>{" "}
                {activeFinding.recommendation}
              </div>
            </div>
          ) : (
            <div className={`p-5 rounded-3xl text-center text-xs flex flex-col items-center justify-center gap-2 py-8 border ${
              isDark ? "bg-[#09152B]/60 border-white/5 text-[#64748B]" : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              <Info className={`w-6 h-6 ${isDark ? "text-[#00C5A0]/40" : "text-teal-600/40"}`} />
              <span>Click on any defect marker pin on the map to preview visual evidence</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
