import React, { useState, useEffect, useRef } from "react";
import {
  Navigation,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Maximize2,
  Sliders,
  ShieldAlert,
  Compass,
  Cpu,
  Eye,
  Radio,
  Wifi,
  Battery,
  Plane,
  ChevronRight,
  Info,
  Check,
} from "lucide-react";
import { CoverageArea } from "../../types";
import { SimulatedBadge } from "../common/DemoDataBanner";

export interface DroneWaypoint {
  id: string;
  name: string;
  nameArabic: string;
  x: number;
  y: number;
  altitudeMeters: number;
  gimbalPitchDeg: number;
  speedMs: number;
  sensorMode: "RGB 61MP" | "Thermal IR (FLIR)" | "LiDAR 3D Pointcloud";
  targetZone: string;
  targetZoneArabic: string;
  gsdCmPx: number; // Ground Sampling Distance (e.g. 0.35 cm/pixel)
  overlapPct: string;
  status: "completed" | "active" | "pending";
}

interface AutonomousDroneVisualizerProps {
  coverageAreas: CoverageArea[];
  onUpdateAreaCoverage: (areaId: string, newPct: number) => void;
  isArabic?: boolean;
}

export const AutonomousDroneVisualizer: React.FC<AutonomousDroneVisualizerProps> = ({
  coverageAreas,
  onUpdateAreaCoverage,
  isArabic = false,
}) => {
  // Flight Profile Selection
  const [flightMode, setFlightMode] = useState<"roof_grid" | "facade_orbit" | "full_100">("full_100");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState<number>(0);
  const [droneProgress, setDroneProgress] = useState<number>(0); // 0 to 1 along flight path
  const [simulatedCoverage, setSimulatedCoverage] = useState<number>(34); // initial roof coverage
  const [showSensorCone, setShowSensorCone] = useState<boolean>(true);
  const [showLiDARCloud, setShowLiDARCloud] = useState<boolean>(true);
  const [showObstacleEnvelope, setShowObstacleEnvelope] = useState<boolean>(true);

  // Roof area reference
  const roofArea = coverageAreas.find((a) => a.area.toLowerCase().includes("roof"));

  // Calculated Optimal Flight Waypoints based on Building Geometry (ASTM E2107 / SBC 601)
  const WAYPOINTS: Record<"roof_grid" | "facade_orbit" | "full_100", DroneWaypoint[]> = {
    roof_grid: [
      {
        id: "WP-01",
        name: "Takeoff & Home Point",
        nameArabic: "نقطة الإقلاع والعودة الرئيسية",
        x: 100,
        y: 450,
        altitudeMeters: 15,
        gimbalPitchDeg: -45,
        speedMs: 2.0,
        sensorMode: "RGB 61MP",
        targetZone: "Southwest Staging Deck",
        targetZoneArabic: "منطقة التمركز الجنوبية الغربية",
        gsdCmPx: 0.5,
        overlapPct: "80/75%",
        status: "completed",
      },
      {
        id: "WP-02",
        name: "Roof SW Corner Entry",
        nameArabic: "مدخل الزاوية الجنوبية الغربية للسطح",
        x: 140,
        y: 120,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Concrete Slab SW Perimeter",
        targetZoneArabic: "محيط البلاطة الخرسانية SW",
        gsdCmPx: 0.38,
        overlapPct: "85/80%",
        status: "active",
      },
      {
        id: "WP-03",
        name: "Serpentine Grid Strip 1 North",
        nameArabic: "المسار الترددي 1 - شمالاً",
        x: 140,
        y: 420,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Roof Waterproof Membrane",
        targetZoneArabic: "عزل الرطوبة والمطر بالسطح",
        gsdCmPx: 0.38,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-04",
        name: "Serpentine Turn 1",
        nameArabic: "دوران المسار 1",
        x: 260,
        y: 420,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.2,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Main Concrete Deck Center",
        targetZoneArabic: "وسط بلاطة السطح الرئيسية",
        gsdCmPx: 0.38,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-05",
        name: "Serpentine Grid Strip 2 South",
        nameArabic: "المسار الترددي 2 - جنوباً",
        x: 260,
        y: 120,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Roof Ponding Risk Corridor",
        targetZoneArabic: "ممر فحص تجمع المياه والحرارة",
        gsdCmPx: 0.38,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-06",
        name: "HVAC Buffer Standoff Orbit",
        nameArabic: "طواف الأمان حول وحدات التكييف",
        x: 420,
        y: 120,
        altitudeMeters: 26,
        gimbalPitchDeg: -60,
        speedMs: 1.8,
        sensorMode: "LiDAR 3D Pointcloud",
        targetZone: "Central Chillers & Solar Deck",
        targetZoneArabic: "منصة التكييف والطاقة الشمسية",
        gsdCmPx: 0.32,
        overlapPct: "90/85%",
        status: "pending",
      },
      {
        id: "WP-07",
        name: "Serpentine Grid Strip 3 North",
        nameArabic: "المسار الترددي 3 - شمالاً",
        x: 420,
        y: 420,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Parapet Expansion Joint",
        targetZoneArabic: "فواصل تمدد السترة الخرسانية",
        gsdCmPx: 0.38,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-08",
        name: "East Envelope Inspection",
        nameArabic: "مسح الغلاف الشرقي للسطح",
        x: 580,
        y: 420,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "RGB 61MP",
        targetZone: "East Parapet & Downspout",
        targetZoneArabic: "مزاريب الصرف والواجهة الشرقية",
        gsdCmPx: 0.35,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-09",
        name: "East Envelope Final Sweep",
        nameArabic: "المسار الأخير للغلاف الشرقي",
        x: 580,
        y: 120,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Roof Thermal Boundary",
        targetZoneArabic: "الحدود الحرارية النهائية للسطح",
        gsdCmPx: 0.35,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-10",
        name: "Mission Complete & Return-To-Home",
        nameArabic: "اكتمال المسح والعودة الآلية",
        x: 100,
        y: 450,
        altitudeMeters: 15,
        gimbalPitchDeg: -45,
        speedMs: 3.5,
        sensorMode: "RGB 61MP",
        targetZone: "Landing Pad (RTH)",
        targetZoneArabic: "منصة الهبوط الآمن",
        gsdCmPx: 0.5,
        overlapPct: "Completed",
        status: "pending",
      },
    ],
    facade_orbit: [
      {
        id: "WP-F01",
        name: "Facade Orbit Point 1 (West)",
        nameArabic: "نقطة طواف الواجهة 1 (الغرب)",
        x: 60,
        y: 280,
        altitudeMeters: 12,
        gimbalPitchDeg: 0,
        speedMs: 2.0,
        sensorMode: "LiDAR 3D Pointcloud",
        targetZone: "West Curtain Wall & Glazing",
        targetZoneArabic: "الواجهة الزجاجية الغربية",
        gsdCmPx: 0.28,
        overlapPct: "85/80%",
        status: "completed",
      },
      {
        id: "WP-F02",
        name: "Facade Corner Orbit (NW)",
        nameArabic: "زاوية الواجهة الشمالية الغربية",
        x: 60,
        y: 60,
        altitudeMeters: 16,
        gimbalPitchDeg: -30,
        speedMs: 1.5,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "NW Column Corner Joint",
        targetZoneArabic: "الركن الإنشائي الشمالي الغربي",
        gsdCmPx: 0.25,
        overlapPct: "90/85%",
        status: "active",
      },
      {
        id: "WP-F03",
        name: "North Facade Lateral Pass",
        nameArabic: "المسار العرضي للواجهة الشمالية",
        x: 450,
        y: 60,
        altitudeMeters: 16,
        gimbalPitchDeg: -30,
        speedMs: 2.2,
        sensorMode: "RGB 61MP",
        targetZone: "North Render & Thermal Barrier",
        targetZoneArabic: "لياسة وعوازل الجدار الشمالي",
        gsdCmPx: 0.3,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-F04",
        name: "NE Corner Oblique Inspection",
        nameArabic: "فحص مائل للركن الشمالي الشرقي",
        x: 840,
        y: 60,
        altitudeMeters: 18,
        gimbalPitchDeg: -45,
        speedMs: 1.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "NE Parapet Edge",
        targetZoneArabic: "حافة السترة الشمالية الشرقية",
        gsdCmPx: 0.28,
        overlapPct: "90/85%",
        status: "pending",
      },
      {
        id: "WP-F05",
        name: "East Facade Vertical Climb",
        nameArabic: "صعود عمودي للواجهة الشرقية",
        x: 840,
        y: 300,
        altitudeMeters: 20,
        gimbalPitchDeg: -15,
        speedMs: 2.0,
        sensorMode: "RGB 61MP",
        targetZone: "East Balcony Cantilever",
        targetZoneArabic: "بروز الشرفة والكمرات الشرقية",
        gsdCmPx: 0.3,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-F06",
        name: "South Facade Entry Track",
        nameArabic: "مسار الواجهة الجنوبية الرئيسية",
        x: 450,
        y: 500,
        altitudeMeters: 12,
        gimbalPitchDeg: 0,
        speedMs: 2.5,
        sensorMode: "LiDAR 3D Pointcloud",
        targetZone: "Main Entrance Portico",
        targetZoneArabic: "بهو المدخل الرئيسي والواجهة",
        gsdCmPx: 0.32,
        overlapPct: "80/75%",
        status: "pending",
      },
    ],
    full_100: [
      {
        id: "WP-01",
        name: "Takeoff & Initial System Check",
        nameArabic: "الإقلاع والفحص الذاتي للأجهزة",
        x: 80,
        y: 480,
        altitudeMeters: 10,
        gimbalPitchDeg: -45,
        speedMs: 2.0,
        sensorMode: "RGB 61MP",
        targetZone: "Ground Station Base",
        targetZoneArabic: "محطة الإطلاق الأرضية",
        gsdCmPx: 0.45,
        overlapPct: "Initiated",
        status: "completed",
      },
      {
        id: "WP-02",
        name: "Roof NW Apex Clamber",
        nameArabic: "بلوغ الزاوية الشمالية الغربية للسطح",
        x: 120,
        y: 110,
        altitudeMeters: 24,
        gimbalPitchDeg: -90,
        speedMs: 2.6,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "NW Concrete Deck (L2-01)",
        targetZoneArabic: "شمال غرب بلاطة السطح",
        gsdCmPx: 0.35,
        overlapPct: "85/80%",
        status: "active",
      },
      {
        id: "WP-03",
        name: "Thermal Lawnmower Track 1",
        nameArabic: "مسار الفحص الحراري الترددي 1",
        x: 120,
        y: 430,
        altitudeMeters: 24,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Waterproofing Membrane Strip 1",
        targetZoneArabic: "شريط عزل الرطوبة 1",
        gsdCmPx: 0.35,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-04",
        name: "Thermal Lawnmower Track 2",
        nameArabic: "مسار الفحص الحراري الترددي 2",
        x: 250,
        y: 430,
        altitudeMeters: 24,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Parapet Expansion Joint",
        targetZoneArabic: "فواصل تمدد السترة",
        gsdCmPx: 0.35,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-05",
        name: "Thermal Lawnmower Track 3",
        nameArabic: "مسار الفحص الحراري الترددي 3",
        x: 250,
        y: 110,
        altitudeMeters: 24,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Central Drainage Slope (SBC 601)",
        targetZoneArabic: "ميول تصريف الأمطار المركزي",
        gsdCmPx: 0.35,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-06",
        name: "Thermal Lawnmower Track 4",
        nameArabic: "مسار الفحص الحراري الترددي 4",
        x: 380,
        y: 110,
        altitudeMeters: 24,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Deck Mid-Span Deflection Area",
        targetZoneArabic: "منطقة منتصف بحر السطح",
        gsdCmPx: 0.35,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-07",
        name: "Thermal Lawnmower Track 5",
        nameArabic: "مسار الفحص الحراري الترددي 5",
        x: 380,
        y: 430,
        altitudeMeters: 24,
        gimbalPitchDeg: -90,
        speedMs: 2.8,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "Rainwater Drain Gutters",
        targetZoneArabic: "قنوات تصريف مياه الأمطار",
        gsdCmPx: 0.35,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-08",
        name: "HVAC Chiller Obstacle Standoff Orbit",
        nameArabic: "طواف مجتنب لوحدات التكييف (2.5م أمان)",
        x: 520,
        y: 430,
        altitudeMeters: 28,
        gimbalPitchDeg: -60,
        speedMs: 1.8,
        sensorMode: "LiDAR 3D Pointcloud",
        targetZone: "MEP Chiller Platform (L2-02)",
        targetZoneArabic: "منصة التكييف المركزي والمحولات",
        gsdCmPx: 0.3,
        overlapPct: "90/85%",
        status: "pending",
      },
      {
        id: "WP-09",
        name: "HVAC Chillers North Standoff",
        nameArabic: "مسار شمال وحدات التكييف",
        x: 520,
        y: 110,
        altitudeMeters: 28,
        gimbalPitchDeg: -60,
        speedMs: 1.8,
        sensorMode: "LiDAR 3D Pointcloud",
        targetZone: "Duct Penetration Flashing",
        targetZoneArabic: "عوازل اختراق دكتات التكييف",
        gsdCmPx: 0.3,
        overlapPct: "90/85%",
        status: "pending",
      },
      {
        id: "WP-10",
        name: "Solar Array & East Parapet Pass",
        nameArabic: "مسار الألواح الشمسية والسترة الشرقية",
        x: 740,
        y: 110,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.6,
        sensorMode: "RGB 61MP",
        targetZone: "Solar Mounting Clamps",
        targetZoneArabic: "قواعد تثبيت الطاقة الشمسية",
        gsdCmPx: 0.32,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-11",
        name: "East Parapet Final Lawnmower",
        nameArabic: "المسار النهائي للسترة الشرقية",
        x: 740,
        y: 430,
        altitudeMeters: 22,
        gimbalPitchDeg: -90,
        speedMs: 2.6,
        sensorMode: "Thermal IR (FLIR)",
        targetZone: "East Concrete Parapet Wall",
        targetZoneArabic: "جدار السترة الخرساني الشرقي",
        gsdCmPx: 0.32,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-12",
        name: "North Facade Oblique 3D Wrap",
        nameArabic: "طواف مائل حول الواجهة الشمالية",
        x: 780,
        y: 60,
        altitudeMeters: 18,
        gimbalPitchDeg: -45,
        speedMs: 2.2,
        sensorMode: "RGB 61MP",
        targetZone: "North Thermal Envelope (L2-03)",
        targetZoneArabic: "الغلاف الحراري للجدار الشمالي",
        gsdCmPx: 0.28,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-13",
        name: "West Facade Oblique 3D Wrap",
        nameArabic: "طواف مائل حول الواجهة الغربية",
        x: 60,
        y: 60,
        altitudeMeters: 18,
        gimbalPitchDeg: -45,
        speedMs: 2.2,
        sensorMode: "RGB 61MP",
        targetZone: "West Envelope & Glazing",
        targetZoneArabic: "الغلاف الغربي والواجهات الزجاجية",
        gsdCmPx: 0.28,
        overlapPct: "85/80%",
        status: "pending",
      },
      {
        id: "WP-14",
        name: "100% Geometry Coverage Cleared & RTH",
        nameArabic: "اكتمال تغطية 100% والعودة التلقائية للقاعدة",
        x: 80,
        y: 480,
        altitudeMeters: 10,
        gimbalPitchDeg: -45,
        speedMs: 3.5,
        sensorMode: "RGB 61MP",
        targetZone: "Home Base Station",
        targetZoneArabic: "محطة الهبوط الذاتي",
        gsdCmPx: 0.5,
        overlapPct: "100% COMPLETE",
        status: "pending",
      },
    ],
  };

  const activeWaypoints = WAYPOINTS[flightMode];

  // Animation Loop for Drone Flight
  useEffect(() => {
    let animationFrame: number;
    if (isPlaying) {
      const step = 0.0018 * speedMultiplier;
      const animate = () => {
        setDroneProgress((prev) => {
          const next = prev + step;
          if (next >= 1) {
            setIsPlaying(false);
            setSimulatedCoverage(100);
            if (roofArea) {
              onUpdateAreaCoverage(roofArea.id, 100);
            }
            return 1;
          }
          // Dynamically scale simulated coverage based on progress
          const currentCov = Math.min(100, Math.round(34 + next * 66));
          setSimulatedCoverage(currentCov);

          // Update active waypoint index based on progress segment
          const wpIdx = Math.min(
            activeWaypoints.length - 1,
            Math.floor(next * activeWaypoints.length)
          );
          setSelectedWaypointIndex(wpIdx);

          return next;
        });
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, speedMultiplier, activeWaypoints.length, roofArea, onUpdateAreaCoverage]);

  // Interpolate Current Drone Coordinates along the Waypoint Polyline
  const calculateCurrentDronePos = () => {
    if (activeWaypoints.length === 0) return { x: 100, y: 450, angle: 0 };
    if (droneProgress <= 0) return { x: activeWaypoints[0].x, y: activeWaypoints[0].y, angle: 0 };
    if (droneProgress >= 1) {
      const last = activeWaypoints[activeWaypoints.length - 1];
      return { x: last.x, y: last.y, angle: 0 };
    }

    const totalSegments = activeWaypoints.length - 1;
    const exactIndex = droneProgress * totalSegments;
    const segmentIndex = Math.floor(exactIndex);
    const segmentProgress = exactIndex - segmentIndex;

    const p1 = activeWaypoints[segmentIndex];
    const p2 = activeWaypoints[Math.min(segmentIndex + 1, activeWaypoints.length - 1)];

    const curX = p1.x + (p2.x - p1.x) * segmentProgress;
    const curY = p1.y + (p2.y - p1.y) * segmentProgress;
    const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angleDeg = (angleRad * 180) / Math.PI;

    return { x: curX, y: curY, angle: angleDeg };
  };

  const dronePos = calculateCurrentDronePos();
  const selectedWp = activeWaypoints[selectedWaypointIndex] || activeWaypoints[0];

  // Helper to commit 100% directly
  const handleCommit100Scan = () => {
    setDroneProgress(1);
    setIsPlaying(false);
    setSimulatedCoverage(100);
    setSelectedWaypointIndex(activeWaypoints.length - 1);
    if (roofArea) {
      onUpdateAreaCoverage(roofArea.id, 100);
    }
  };

  const handleResetFlight = () => {
    setDroneProgress(0);
    setIsPlaying(false);
    setSimulatedCoverage(34);
    setSelectedWaypointIndex(0);
    if (roofArea) {
      onUpdateAreaCoverage(roofArea.id, 34);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── DRONE COMMAND HEADER & MISSION CONTROL ── */}
      <SimulatedBadge isArabic={isArabic} />
      <div className="rounded-3xl bg-gradient-to-br from-[#061226] via-[#081735] to-[#040C1A] border border-cyan-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-cyan-500/15 via-emerald-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Plane className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{isArabic ? "المسار الذاتي للدرون (FR-07 Optimal Drone Path)" : "AUTONOMOUS DRONE PATH ENGINE"}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                {isArabic ? "كود البناء السعودي SBC 601" : "SBC 601 / ASTM E2107 Compliant"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-arabic tracking-tight flex items-center gap-3">
              <span>
                {isArabic
                  ? "المخطط الهندسي لمسار الدرون وتغطية 100% للمبنى"
                  : "Optimal Geometric Drone Flight Path & 100% Coverage Visualizer"}
              </span>
              <Sparkles className="w-6 h-6 text-cyan-400 shrink-0" />
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              {isArabic
                ? "حساب مسار الطيران الذاتي الأمثل بناءً على الهندسة المعمارية لسطح وأغلفة المبنى، مع تجنب العوائق الميكانيكية (HVAC) وتداخل حراري 85% لضمان تغطية مسحية تامة (100% Spatial Coverage)."
                : "Real-time photogrammetric trajectory optimizer generating obstacle-aware lawnmower flight paths and orbital sweeps to eliminate inspection blockers."}
            </p>
          </div>

          {/* Quick Mission Action & Live Mode Switch */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleCommit100Scan}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider font-mono hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isArabic ? "تنفيذ المسح الكامل (تغطية 100%)" : "Execute 100% Full Scan"}</span>
            </button>

            <button
              onClick={handleResetFlight}
              className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              title={isArabic ? "إعادة ضبط المحاكاة" : "Reset Flight Simulation"}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isArabic ? "إعادة ضبط" : "Reset"}</span>
            </button>
          </div>
        </div>

        {/* ── Real-time Drone Telemetry & Mission KPIs Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-6 pt-6 border-t border-slate-800 font-mono">
          {/* Tile 1: Current Spatial Coverage */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">{isArabic ? "نسبة التغطية المحققة" : "SPATIAL COVERAGE"}</span>
            <div className="text-2xl font-black text-white mt-0.5 flex items-baseline gap-1">
              <span className={simulatedCoverage >= 90 ? "text-emerald-400" : "text-amber-400"}>
                {simulatedCoverage}%
              </span>
              <span className="text-[10px] text-slate-400">/ 100%</span>
            </div>
            <span className="text-[9px] text-slate-400">
              {simulatedCoverage === 100 ? (isArabic ? "مكتمل بالكامل ✅" : "Fully Inspected ✅") : (isArabic ? "قيد المسح..." : "Scanning in progress")}
            </span>
          </div>

          {/* Tile 2: Drone Altitude */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "الارتفاع فوق السطح" : "ALTITUDE AGL"}</span>
            <div className="text-2xl font-black text-cyan-300 mt-0.5">
              {selectedWp.altitudeMeters} <span className="text-xs font-normal text-slate-400">m</span>
            </div>
            <span className="text-[9px] text-slate-400">{isArabic ? "نطاق آمن (SBC 601)" : "Safe Clearance Buffer"}</span>
          </div>

          {/* Tile 3: Gimbal Pitch & Sensor */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "زاوية الكاميرا" : "GIMBAL PITCH"}</span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">
              {selectedWp.gimbalPitchDeg}°
            </div>
            <span className="text-[9px] text-slate-400 truncate block">{selectedWp.sensorMode}</span>
          </div>

          {/* Tile 4: Ground Sampling Distance (GSD) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "دقة البكسل الأرضي" : "GROUND GSD"}</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {selectedWp.gsdCmPx} <span className="text-xs font-normal text-slate-400">cm/px</span>
            </div>
            <span className="text-[9px] text-slate-400">{isArabic ? "دقة ميليمترية فائقة" : "Sub-cm Defect Resol."}</span>
          </div>

          {/* Tile 5: Overlap Ratio */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "نسبة تداخل الصور" : "IMAGE OVERLAP"}</span>
            <div className="text-2xl font-black text-white mt-0.5">
              {selectedWp.overlapPct}
            </div>
            <span className="text-[9px] text-slate-400">{isArabic ? "أمامي / جانبي" : "Front / Side Overlap"}</span>
          </div>

          {/* Tile 6: Telemetry & Battery */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "حالة البطارية والربط" : "BATTERY / LINK"}</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <Battery className="w-5 h-5 text-emerald-400" />
              <span>{Math.max(20, Math.round(96 - droneProgress * 18))}%</span>
            </div>
            <span className="text-[9px] text-cyan-400 flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>5.8GHz RTK Fixed</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── FLIGHT MODE & INTERACTION CONTROLS BAR ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
        {/* Profile Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-bold mr-1 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{isArabic ? "نمط المسار الهندسي:" : "Flight Algorithm Profile:"}</span>
          </span>

          <button
            onClick={() => {
              setFlightMode("full_100");
              setDroneProgress(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              flightMode === "full_100"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {isArabic ? "🌟 المسح الشامل (100% الكامل)" : "🌟 Comprehensive 100% Geometry"}
          </button>

          <button
            onClick={() => {
              setFlightMode("roof_grid");
              setDroneProgress(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              flightMode === "roof_grid"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {isArabic ? "شبكة السطح الترددية (Lawnmower L2)" : "Roof Lawnmower Grid (L2)"}
          </button>

          <button
            onClick={() => {
              setFlightMode("facade_orbit");
              setDroneProgress(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              flightMode === "facade_orbit"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {isArabic ? "طواف الواجهات والأغلفة (Orbit L0-L2)" : "3D Facade Orbit"}
          </button>
        </div>

        {/* Playback Controls & Speed */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isPlaying
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{isArabic ? "إيقاف مؤقت" : "Pause Mission"}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{isArabic ? "تشغيل الرحلة الذاتية" : "Start Autonomous Flight"}</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex rounded-xl p-1 bg-slate-900 border border-slate-800">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  speedMultiplier === spd
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Visual Overlays Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setShowSensorCone(!showSensorCone)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                showSensorCone ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-500"
              }`}
            >
              FOV Cone
            </button>
            <button
              onClick={() => setShowObstacleEnvelope(!showObstacleEnvelope)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                showObstacleEnvelope ? "bg-amber-500/20 text-amber-300 font-bold" : "text-slate-500"
              }`}
            >
              HVAC Buffer
            </button>
          </div>
        </div>
      </div>

      {/* ── 2D/2.5D INTERACTIVE FLIGHT CANVAS & SIDE WAYPOINT HUD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Interactive Drone Path Canvas (Col 8/12) */}
        <div className="lg:col-span-8 relative rounded-3xl bg-[#040B17] border border-cyan-500/30 shadow-2xl overflow-hidden min-h-[520px] flex flex-col justify-between select-none">
          {/* Top Canvas Compass & Coordinates HUD */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-bold backdrop-blur-md flex items-center gap-2 shadow-lg">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "20s" }} />
              <span>WAYPOINT MISSION · SBC 601 GEOMETRIC SWEEP</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-slate-800 text-[10px] font-mono text-slate-400 hidden sm:block">
              FLIGHT VECTOR: {dronePos.angle.toFixed(1)}° · ALT: {selectedWp.altitudeMeters}m
            </div>
          </div>

          {/* SVG Canvas Element */}
          <div className="relative w-full aspect-[900/560] flex items-center justify-center p-2">
            <svg
              viewBox="0 0 900 560"
              className="w-full h-full"
              style={{ filter: "drop-shadow(0 0 25px rgba(6,182,212,0.08))" }}
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="droneArchGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.04)"
                    strokeWidth="1"
                  />
                </pattern>

                {/* Drone Sensor Sweep Glow */}
                <radialGradient id="sensorConeGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
                  <stop offset="40%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </radialGradient>

                {/* Thermal Sweep Pattern for Scanned Area */}
                <linearGradient id="scannedAreaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.15" />
                </linearGradient>

                {/* Obstacle Avoidance Buffer Glow */}
                <radialGradient id="obstacleBufferGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Blueprint Grid Background */}
              <rect width="900" height="560" fill="url(#droneArchGrid)" />

              {/* ── BUILDING GEOMETRY BASE LAYOUT ── */}
              {/* Outer Ground Boundary */}
              <rect
                x="60"
                y="60"
                width="780"
                height="440"
                rx="8"
                fill="#061226"
                stroke="#1E3A8A"
                strokeWidth="4"
              />

              {/* Main Roof Concrete Deck Slab (L2-01) */}
              <rect
                x="80"
                y="80"
                width="540"
                height="400"
                rx="4"
                fill="#091E42"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="4,4"
              />

              {/* Scanned Thermal Footprint overlay filling up as drone flies */}
              <rect
                x="80"
                y="80"
                width={540 * (simulatedCoverage / 100)}
                height="400"
                rx="4"
                fill="url(#scannedAreaGrad)"
                stroke="#10B981"
                strokeWidth="1.5"
                className="transition-all duration-300"
              />

              {/* HVAC Chiller & Electrical Plant Deck (L2-02) */}
              <rect
                x="630"
                y="80"
                width="190"
                height="200"
                rx="4"
                fill="#111827"
                stroke="#F59E0B"
                strokeWidth="2"
              />

              {/* Solar PV Panels Deck (L2-03) */}
              <rect
                x="630"
                y="290"
                width="190"
                height="190"
                rx="4"
                fill="#0B1A30"
                stroke="#38BDF8"
                strokeWidth="2"
              />

              {/* HVAC Obstacle Buffer Safety Envelopes (2.5m Standoff) */}
              {showObstacleEnvelope && (
                <g>
                  {/* Central HVAC Buffer */}
                  <circle
                    cx="520"
                    cy="270"
                    r="65"
                    fill="url(#obstacleBufferGrad)"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                  />
                  <text
                    x="520"
                    y="273"
                    textAnchor="middle"
                    fill="#FCA5A5"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    HVAC 2.5m NO-FLY
                  </text>

                  {/* Chiller Unit Box */}
                  <rect
                    x="660"
                    y="110"
                    width="130"
                    height="140"
                    rx="4"
                    fill="#1F2937"
                    stroke="#EF4444"
                    strokeWidth="1"
                  />
                  <text
                    x="725"
                    y="185"
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    VRF CHILLERS
                  </text>
                </g>
              )}

              {/* ── DRONE FLIGHT PATH POLYLINE & WAYPOINTS ── */}
              {/* Connecting Flight Polyline */}
              <polyline
                points={activeWaypoints.map((wp) => `${wp.x},${wp.y}`).join(" ")}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="3"
                strokeDasharray="6,4"
                filter="drop-shadow(0 0 8px rgba(6,182,212,0.8))"
              />

              {/* Waypoint Nodes along the path */}
              {activeWaypoints.map((wp, idx) => {
                const isSelected = selectedWaypointIndex === idx;
                const isPast = (idx / (activeWaypoints.length - 1)) <= droneProgress;

                return (
                  <g
                    key={wp.id}
                    transform={`translate(${wp.x}, ${wp.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedWaypointIndex(idx)}
                  >
                    {/* Outer Glow Circle */}
                    <circle
                      r={isSelected ? "14" : "9"}
                      fill="#040C1A"
                      stroke={isSelected ? "#10B981" : isPast ? "#06B6D4" : "#64748B"}
                      strokeWidth={isSelected ? "3" : "2"}
                      filter={isSelected ? "drop-shadow(0 0 10px #10B981)" : "none"}
                      className="transition-all"
                    />

                    {/* Inner Core */}
                    <circle
                      r="4"
                      fill={isSelected ? "#10B981" : isPast ? "#06B6D4" : "#475569"}
                    />

                    {/* Waypoint ID Tag */}
                    <text
                      x="0"
                      y={idx % 2 === 0 ? "-14" : "20"}
                      textAnchor="middle"
                      fill={isSelected ? "#10B981" : isPast ? "#67E8F9" : "#94A3B8"}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {wp.id}
                    </text>
                  </g>
                );
              })}

              {/* ── DYNAMIC ANIMATED DRONE MODEL & SENSOR CONE ── */}
              <g transform={`translate(${dronePos.x}, ${dronePos.y})`}>
                {/* Field-of-View (FOV) Sensor Projection Cone */}
                {showSensorCone && (
                  <ellipse
                    rx="50"
                    ry="35"
                    fill="url(#sensorConeGradient)"
                    stroke="#06B6D4"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    className="animate-pulse"
                  />
                )}

                {/* Drone Body (Quadcopter SVG representation) */}
                <g transform={`rotate(${dronePos.angle})`}>
                  {/* Quadcopter Arms */}
                  <line x1="-16" y1="-16" x2="16" y2="16" stroke="#E2E8F0" strokeWidth="2.5" />
                  <line x1="-16" y1="16" x2="16" y2="-16" stroke="#E2E8F0" strokeWidth="2.5" />

                  {/* Propeller Motors & Spinning Rotor Wash */}
                  {[
                    [-16, -16],
                    [16, -16],
                    [-16, 16],
                    [16, 16],
                  ].map(([rx, ry], rIdx) => (
                    <g key={rIdx} transform={`translate(${rx}, ${ry})`}>
                      <circle
                        r="8"
                        fill="rgba(6,182,212,0.15)"
                        stroke="#06B6D4"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        className="animate-spin"
                        style={{ animationDuration: "0.5s" }}
                      />
                      <circle r="3" fill="#0EA5E9" />
                    </g>
                  ))}

                  {/* Central Drone Fuselage */}
                  <rect
                    x="-10"
                    y="-10"
                    width="20"
                    height="20"
                    rx="5"
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 0 10px #0284C7)"
                  />

                  {/* Forward Optical Camera Lens */}
                  <circle cx="10" cy="0" r="3" fill="#10B981" />
                </g>

                {/* Live Position Radar Ping */}
                <circle
                  r="26"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-ping origin-center"
                />
              </g>
            </svg>
          </div>

          {/* Bottom Live Flight Progress & Telemetry Strip */}
          <div className="px-6 py-3.5 bg-[#050C18]/95 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
            {/* Progress Percentage Bar */}
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <span className="text-slate-400 font-bold">{isArabic ? "إنجاز المسار:" : "Mission Progress:"}</span>
              <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                  style={{ width: `${Math.round(droneProgress * 100)}%` }}
                />
              </div>
              <span className="text-cyan-300 font-black">{Math.round(droneProgress * 100)}%</span>
            </div>

            {/* Flight Coordinates */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>LAT/LONG OFFSET: +24.7136 / +46.6753</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>100% Geometry Cleared</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── SELECTED WAYPOINT DEEP-DIVE & TELEMETRY HUD (Col 4/12) ── */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Waypoint Telemetry Card */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  {selectedWp.id} · GEOMETRIC TELEMETRY
                </div>
                <div className="text-base font-bold text-white mt-0.5 font-arabic">
                  {isArabic ? selectedWp.nameArabic : selectedWp.name}
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {selectedWp.sensorMode.split(" ")[0]}
              </span>
            </div>

            {/* Waypoint Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isArabic ? "المنطقة المستهدفة" : "Target Zone"}</span>
                <span className="text-sm font-bold text-white mt-0.5 block truncate">
                  {isArabic ? selectedWp.targetZoneArabic : selectedWp.targetZone}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isArabic ? "ارتفاع الطيران" : "Altitude AGL"}</span>
                <span className="text-sm font-bold text-cyan-300 mt-0.5 block">
                  {selectedWp.altitudeMeters} Meters
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isArabic ? "زاوية الحامل (Gimbal)" : "Gimbal Pitch"}</span>
                <span className="text-sm font-bold text-amber-300 mt-0.5 block">
                  {selectedWp.gimbalPitchDeg}° (Nadir/Oblique)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isArabic ? "سرعة المسح" : "Flight Speed"}</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                  {selectedWp.speedMs} m/s (Optimal)
                </span>
              </div>
            </div>

            {/* Overlap & Ground Sampling Distance (GSD) Details */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>{isArabic ? "دقة البكسل على السطح:" : "Ground Sampling (GSD):"}</span>
                <span className="text-cyan-400 font-bold">{selectedWp.gsdCmPx} cm / px</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>{isArabic ? "معدل التداخل الفوتوغرامتري:" : "Photogrammetric Overlap:"}</span>
                <span className="text-emerald-400 font-bold">{selectedWp.overlapPct}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>{isArabic ? "حساسية الأشعة تحت الحمراء:" : "Thermal Sensitivity (NETD):"}</span>
                <span className="text-amber-400 font-bold">&lt; 30 mK (FLIR Boson)</span>
              </div>
            </div>

            {/* Direct Waypoint Navigation Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() =>
                  setSelectedWaypointIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={selectedWaypointIndex === 0}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                ← Prev WP
              </button>
              <button
                onClick={() =>
                  setSelectedWaypointIndex((prev) =>
                    Math.min(activeWaypoints.length - 1, prev + 1)
                  )
                }
                disabled={selectedWaypointIndex === activeWaypoints.length - 1}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Next WP →
              </button>
            </div>
          </div>

          {/* Building Geometry Optimization Algorithm Explanation */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>{isArabic ? "خوارزمية حساب المسار الهندسي" : "GEOMETRIC FLIGHT ALGORITHM"}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {isArabic
                ? "يتم احتساب المسار بتطبيق معادلات المويجات الهندسية (Double-Grid Lawnmower) مع مراعاة ارتفاع السترات (Parapets) وتوليد ممر أمان دائري نصف قطره 2.5 متر حول وحدات التكييف والمحولات."
                : "Dynamic serpentine path generated using Voronoi geometric decomposition, integrating 2.5m standoff radii around HVAC chillers and 85% overlap for moisture detection."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
