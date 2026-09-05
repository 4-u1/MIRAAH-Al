import React, { useEffect, useRef, useState, useCallback } from "react";
import { AssetRecord, Finding } from "../../types";
import {
  RotateCcw,
  Maximize2,
  Layers,
  Eye,
  Crosshair,
  Compass,
  Sparkles,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Move3d,
} from "lucide-react";

interface SpatialTwinCanvas3DProps {
  asset: AssetRecord;
  isArabic?: boolean;
  onSelectFinding?: (finding: Finding) => void;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Polygon3D {
  points: Point3D[];
  color: string;
  strokeColor: string;
  wireframeOnly?: boolean;
  label?: string;
  zone?: string;
}

interface DefectHotspot3D {
  id: number;
  pos: Point3D;
  severity: "Critical" | "Moderate" | "Low";
  label: string;
  labelArabic: string;
  type: string;
  finding?: Finding;
}

export const SpatialTwinCanvas3D: React.FC<SpatialTwinCanvas3DProps> = ({
  asset,
  isArabic = false,
  onSelectFinding,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation angles (in radians)
  const [yaw, setYaw] = useState<number>(0.65);
  const [pitch, setPitch] = useState<number>(0.38);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<"composite" | "wireframe" | "defects" | "drone">("composite");
  const [selectedZone, setSelectedZone] = useState<string>("ALL");
  const [hoveredHotspot, setHoveredHotspot] = useState<DefectHotspot3D | null>(null);

  // Dragging state
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // Generate 3D geometry based on asset type
  const { polygons, hotspots, dronePath } = React.useMemo(() => {
    const isCommercial = asset.type?.toLowerCase().includes("commercial") || asset.name.includes("مجمع");
    const isWarehouse = asset.type?.toLowerCase().includes("warehouse") || asset.type?.toLowerCase().includes("industrial") || asset.name.includes("مستودع");

    const polys: Polygon3D[] = [];
    const spots: DefectHotspot3D[] = [];
    const path: Point3D[] = [];

    if (isWarehouse) {
      // Logistics Warehouse Geometry
      const W = 180;
      const H = 85;
      const L = 220;

      // Ground slab
      polys.push({
        points: [
          { x: -W, y: 0, z: -L },
          { x: W, y: 0, z: -L },
          { x: W, y: 0, z: L },
          { x: -W, y: 0, z: L },
        ],
        color: "rgba(15, 23, 42, 0.75)",
        strokeColor: "rgba(6, 182, 212, 0.3)",
        zone: "Ground / Foundation",
      });

      // Main warehouse hall box
      // Front Wall
      polys.push({
        points: [
          { x: -W, y: 0, z: L },
          { x: W, y: 0, z: L },
          { x: W, y: H, z: L },
          { x: -W, y: H, z: L },
        ],
        color: "rgba(30, 41, 59, 0.65)",
        strokeColor: "#0284C7",
        zone: "South Facade & Loading Docks",
      });

      // Back Wall
      polys.push({
        points: [
          { x: -W, y: 0, z: -L },
          { x: -W, y: H, z: -L },
          { x: W, y: H, z: -L },
          { x: W, y: 0, z: -L },
        ],
        color: "rgba(15, 23, 42, 0.7)",
        strokeColor: "#0369A1",
        zone: "North Wall",
      });

      // Left Wall
      polys.push({
        points: [
          { x: -W, y: 0, z: -L },
          { x: -W, y: 0, z: L },
          { x: -W, y: H, z: L },
          { x: -W, y: H, z: -L },
        ],
        color: "rgba(14, 116, 144, 0.35)",
        strokeColor: "#06B6D4",
        zone: "West Wall",
      });

      // Right Wall
      polys.push({
        points: [
          { x: W, y: 0, z: -L },
          { x: W, y: H, z: -L },
          { x: W, y: H, z: L },
          { x: W, y: 0, z: L },
        ],
        color: "rgba(14, 116, 144, 0.35)",
        strokeColor: "#06B6D4",
        zone: "East Wall",
      });

      // Pitched Industrial Roof
      const roofPeak = H + 35;
      polys.push({
        points: [
          { x: -W, y: H, z: -L },
          { x: 0, y: roofPeak, z: -L },
          { x: 0, y: roofPeak, z: L },
          { x: -W, y: H, z: L },
        ],
        color: "rgba(6, 182, 212, 0.22)",
        strokeColor: "#38BDF8",
        zone: "Roof / Parapet",
      });
      polys.push({
        points: [
          { x: 0, y: roofPeak, z: -L },
          { x: W, y: H, z: -L },
          { x: W, y: H, z: L },
          { x: 0, y: roofPeak, z: L },
        ],
        color: "rgba(6, 182, 212, 0.28)",
        strokeColor: "#38BDF8",
        zone: "Roof / Parapet",
      });

      // Add defect spots
      spots.push({
        id: 101,
        pos: { x: -40, y: roofPeak - 5, z: 30 },
        severity: "Critical",
        label: "Roof Membrane Tear",
        labelArabic: "تمزق غشاء عزل السطح المعدني",
        type: "Crack",
        finding: asset.findings[0],
      });
      spots.push({
        id: 102,
        pos: { x: W, y: 35, z: -40 },
        severity: "Moderate",
        label: "Corrosion on Loading Gate",
        labelArabic: "تآكل معدني برصيف التحميل",
        type: "Surface Damage",
        finding: asset.findings[1],
      });
    } else if (isCommercial) {
      // Multi-Story Commercial Complex Geometry
      const W = 150;
      const L = 160;

      // Base Podium
      polys.push({
        points: [
          { x: -W, y: 0, z: -L },
          { x: W, y: 0, z: -L },
          { x: W, y: 50, z: -L },
          { x: -W, y: 50, z: -L },
        ],
        color: "rgba(30, 41, 59, 0.7)",
        strokeColor: "#0284C7",
        zone: "Ground Floor & Retails",
      });
      polys.push({
        points: [
          { x: -W, y: 0, z: L },
          { x: W, y: 0, z: L },
          { x: W, y: 50, z: L },
          { x: -W, y: 50, z: L },
        ],
        color: "rgba(30, 41, 59, 0.8)",
        strokeColor: "#0284C7",
        zone: "Ground Floor & Retails",
      });
      polys.push({
        points: [
          { x: -W, y: 0, z: -L },
          { x: -W, y: 0, z: L },
          { x: -W, y: 50, z: L },
          { x: -W, y: 50, z: -L },
        ],
        color: "rgba(14, 116, 144, 0.4)",
        strokeColor: "#06B6D4",
        zone: "West Curtain Wall",
      });
      polys.push({
        points: [
          { x: W, y: 0, z: -L },
          { x: W, y: 0, z: L },
          { x: W, y: 50, z: L },
          { x: W, y: 50, z: -L },
        ],
        color: "rgba(14, 116, 144, 0.4)",
        strokeColor: "#06B6D4",
        zone: "East Facade",
      });

      // Upper Tower Section (Setback)
      const tW = 100;
      const tL = 110;
      const tH = 120;
      polys.push({
        points: [
          { x: -tW, y: 50, z: tL },
          { x: tW, y: 50, z: tL },
          { x: tW, y: tH, z: tL },
          { x: -tW, y: tH, z: tL },
        ],
        color: "rgba(6, 182, 212, 0.25)",
        strokeColor: "#38BDF8",
        zone: "Curtain Glass Tower",
      });
      polys.push({
        points: [
          { x: -tW, y: 50, z: -tL },
          { x: tW, y: 50, z: -tL },
          { x: tW, y: tH, z: -tL },
          { x: -tW, y: tH, z: -tL },
        ],
        color: "rgba(6, 182, 212, 0.2)",
        strokeColor: "#0284C7",
        zone: "Curtain Glass Tower",
      });
      // Tower Roof
      polys.push({
        points: [
          { x: -tW, y: tH, z: -tL },
          { x: tW, y: tH, z: -tL },
          { x: tW, y: tH, z: tL },
          { x: -tW, y: tH, z: tL },
        ],
        color: "rgba(255, 255, 255, 0.12)",
        strokeColor: "#FFF",
        zone: "Roof / HVAC Plant",
      });

      // Spots for commercial
      spots.push({
        id: 201,
        pos: { x: 30, y: tH + 5, z: 20 },
        severity: "Moderate",
        label: "HVAC Chillers Leakage",
        labelArabic: "تسريب مياه حول مبردات التكييف",
        type: "Moisture",
        finding: asset.findings[0],
      });
      spots.push({
        id: 202,
        pos: { x: -tW - 5, y: 80, z: 40 },
        severity: "Critical",
        label: "Curtain Wall Seal Failure",
        labelArabic: "تلف مطاط العزل بالواجهة الزجاجية",
        type: "Crack",
        finding: asset.findings[1],
      });
    } else {
      // Modern Residential Villa (e.g. Al-Malqa Villa #10294)
      const W = 130;
      const L = 140;
      const H1 = 60;
      const H2 = 110;

      // Ground Floor Volume
      polys.push({
        points: [
          { x: -W, y: 0, z: L },
          { x: W, y: 0, z: L },
          { x: W, y: H1, z: L },
          { x: -W, y: H1, z: L },
        ],
        color: "rgba(30, 41, 59, 0.8)",
        strokeColor: "#0284C7",
        zone: "Ground Floor & Reception",
      });
      polys.push({
        points: [
          { x: -W, y: 0, z: -L },
          { x: -W, y: 0, z: L },
          { x: -W, y: H1, z: L },
          { x: -W, y: H1, z: -L },
        ],
        color: "rgba(14, 116, 144, 0.4)",
        strokeColor: "#06B6D4",
        zone: "West Facade",
      });
      polys.push({
        points: [
          { x: W, y: 0, z: -L },
          { x: W, y: 0, z: L },
          { x: W, y: H1, z: L },
          { x: W, y: H1, z: -L },
        ],
        color: "rgba(14, 116, 144, 0.4)",
        strokeColor: "#06B6D4",
        zone: "East Facade",
      });

      // Upper Floor (Cantilevered modern block)
      const uW = 110;
      const uL = 120;
      polys.push({
        points: [
          { x: -uW, y: H1, z: uL },
          { x: uW, y: H1, z: uL },
          { x: uW, y: H2, z: uL },
          { x: -uW, y: H2, z: uL },
        ],
        color: "rgba(6, 182, 212, 0.25)",
        strokeColor: "#38BDF8",
        zone: "First Floor Bedrooms",
      });
      polys.push({
        points: [
          { x: -uW, y: H1, z: -uL },
          { x: -uW, y: H1, z: uL },
          { x: -uW, y: H2, z: uL },
          { x: -uW, y: H2, z: -uL },
        ],
        color: "rgba(8, 145, 178, 0.3)",
        strokeColor: "#06B6D4",
        zone: "North Facade",
      });
      polys.push({
        points: [
          { x: uW, y: H1, z: -uL },
          { x: uW, y: H1, z: uL },
          { x: uW, y: H2, z: uL },
          { x: uW, y: H2, z: -uL },
        ],
        color: "rgba(8, 145, 178, 0.3)",
        strokeColor: "#06B6D4",
        zone: "East Facade",
      });

      // Parapet / Roof Slab
      polys.push({
        points: [
          { x: -uW, y: H2, z: -uL },
          { x: uW, y: H2, z: -uL },
          { x: uW, y: H2, z: uL },
          { x: -uW, y: H2, z: uL },
        ],
        color: "rgba(255, 255, 255, 0.08)",
        strokeColor: "rgba(255, 255, 255, 0.6)",
        zone: "Roof / Parapet",
      });

      // Modern Canopy
      polys.push({
        points: [
          { x: -60, y: H2 + 15, z: -70 },
          { x: 60, y: H2 + 15, z: -70 },
          { x: 60, y: H2 + 15, z: 40 },
          { x: -60, y: H2 + 15, z: 40 },
        ],
        color: "rgba(0, 229, 185, 0.12)",
        strokeColor: "#00E5B9",
        zone: "Roof / Parapet",
      });

      // Defect Hotspots for Villa
      spots.push({
        id: 301,
        pos: { x: 45, y: H2 + 2, z: 25 },
        severity: "Critical",
        label: "Parapet Shear Crack",
        labelArabic: "شرخ إنشائي بخرسانة الستارة",
        type: "Crack",
        finding: asset.findings.find((f) => f.type === "Crack") || asset.findings[0],
      });
      spots.push({
        id: 302,
        pos: { x: -uW - 2, y: H1 + 20, z: 30 },
        severity: "Moderate",
        label: "Moisture Capillary Rising",
        labelArabic: "تسريب ورطوبة بجدار الواجهة",
        type: "Moisture",
        finding: asset.findings.find((f) => f.type === "Moisture") || asset.findings[1],
      });
      spots.push({
        id: 303,
        pos: { x: -80, y: 15, z: L + 2 },
        severity: "Low",
        label: "Surface Plaster Peeling",
        labelArabic: "تقشير طبقة اللياسة الخارجية",
        type: "Paint Peeling",
        finding: asset.findings.find((f) => f.type === "Paint Peeling") || asset.findings[2],
      });
    }

    // Generate Drone Flight Path Points (Helix / Orbital Waypoints)
    const radius = 220;
    for (let angle = 0; angle <= Math.PI * 3.5; angle += 0.35) {
      const h = 20 + angle * 28;
      path.push({
        x: Math.cos(angle) * (radius - angle * 8),
        y: h,
        z: Math.sin(angle) * (radius - angle * 8),
      });
    }

    return { polygons: polys, hotspots: spots, dronePath: path };
  }, [asset]);

  // 3D Projection & Rendering Loop on HTML Canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Center coordinates
    const cx = width / 2;
    const cy = height / 2 + 35; // slightly shifted down to accommodate building height
    const scale = Math.min(width, height) * 0.0028 * zoom;

    // Precalculate Trigonometric Functions for Rotation
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    // 3D to 2D projection function (isometric with mild perspective)
    const project = (p: Point3D): { x: number; y: number; zDepth: number } => {
      // Rotate around Y axis (yaw)
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;

      // Rotate around X axis (pitch)
      const y2 = -p.y * cosP - z1 * sinP; // Invert Y for screen space (up is positive in 3D)
      const z2 = -p.y * sinP + z1 * cosP;

      // Mild perspective divisor
      const fov = 750;
      const pScale = fov / (fov + z2 * 0.4);

      return {
        x: cx + x1 * scale * pScale,
        y: cy + y2 * scale * pScale,
        zDepth: z2,
      };
    };

    // ── 1. Draw Tech Floor Grid ──
    const gridSize = 320;
    const gridStep = 40;
    ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
    ctx.lineWidth = 1;

    for (let gx = -gridSize; gx <= gridSize; gx += gridStep) {
      const p1 = project({ x: gx, y: 0, z: -gridSize });
      const p2 = project({ x: gx, y: 0, z: gridSize });
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let gz = -gridSize; gz <= gridSize; gz += gridStep) {
      const p1 = project({ x: -gridSize, y: 0, z: gz });
      const p2 = project({ x: gridSize, y: 0, z: gz });
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // ── 2. Draw Drone Flight Path (if layer active) ──
    if (activeLayer === "drone" || activeLayer === "composite") {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      dronePath.forEach((pt, i) => {
        const pr = project(pt);
        if (i === 0) ctx.moveTo(pr.x, pr.y);
        else ctx.lineTo(pr.x, pr.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw active Drone Waypoint beacon
      const liveDronePt = dronePath[Math.floor((Date.now() / 150) % dronePath.length)];
      if (liveDronePt) {
        const dPr = project(liveDronePt);
        ctx.beginPath();
        ctx.arc(dPr.x, dPr.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#C084FC";
        ctx.shadowColor = "#A855F7";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = "#E9D5FF";
        ctx.font = "10px monospace";
        ctx.fillText("UAV-DRONE #01", dPr.x + 10, dPr.y - 4);
      }
    }

    // ── 3. Depth-Sort Polygons for Proper Shading ──
    const sortedPolys = polygons
      .map((poly) => {
        // Compute average Z depth of the polygon
        let totalZ = 0;
        poly.points.forEach((p) => {
          const pr = project(p);
          totalZ += pr.zDepth;
        });
        const avgZ = totalZ / poly.points.length;
        return { ...poly, avgZ };
      })
      .sort((a, b) => b.avgZ - a.avgZ); // Draw furthest first (Painters Algorithm)

    // Render Polygons
    sortedPolys.forEach((poly) => {
      const isFiltered = selectedZone !== "ALL" && poly.zone && !poly.zone.toLowerCase().includes(selectedZone.toLowerCase());

      const pts2D = poly.points.map((p) => project(p));
      if (pts2D.length < 3) return;

      ctx.beginPath();
      ctx.moveTo(pts2D[0].x, pts2D[0].y);
      for (let i = 1; i < pts2D.length; i++) {
        ctx.lineTo(pts2D[i].x, pts2D[i].y);
      }
      ctx.closePath();

      if (activeLayer !== "wireframe" && !poly.wireframeOnly) {
        ctx.fillStyle = isFiltered ? "rgba(15, 23, 42, 0.2)" : poly.color;
        ctx.fill();
      }

      ctx.strokeStyle = isFiltered ? "rgba(71, 85, 105, 0.3)" : poly.strokeColor;
      ctx.lineWidth = activeLayer === "wireframe" ? 1.5 : 1.2;
      ctx.stroke();
    });

    // ── 4. Render 3D Defect Hotspots (Pulsing Holographic Markers) ──
    if (activeLayer === "defects" || activeLayer === "composite") {
      const time = Date.now() / 300;

      hotspots.forEach((spot) => {
        const pr = project(spot.pos);
        const pulse = (Math.sin(time + spot.id) + 1) / 2; // 0 to 1

        const baseColor =
          spot.severity === "Critical"
            ? "#EF4444"
            : spot.severity === "Moderate"
            ? "#F59E0B"
            : "#22C55E";

        // Vertical Guide Line to Floor
        const floorPr = project({ x: spot.pos.x, y: 0, z: spot.pos.z });
        ctx.beginPath();
        ctx.moveTo(pr.x, pr.y);
        ctx.lineTo(floorPr.x, floorPr.y);
        ctx.strokeStyle = baseColor;
        ctx.globalAlpha = 0.35;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;

        // Pulsing Outer Ring
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 6 + pulse * 7, 0, Math.PI * 2);
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Solid Core Marker
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label Badge
        const labelText = isArabic ? spot.labelArabic : spot.label;
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 4;
        ctx.fillText(labelText, pr.x + 10, pr.y + 3);
        ctx.shadowBlur = 0;
      });
    }

    ctx.restore();
  }, [yaw, pitch, zoom, polygons, hotspots, dronePath, activeLayer, selectedZone, isArabic]);

  // Animation Loop for Auto-Rotation
  useEffect(() => {
    const loop = () => {
      if (isAutoRotate && !isDraggingRef.current) {
        setYaw((prev) => prev + 0.0035);
      }
      renderCanvas();
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAutoRotate, renderCanvas]);

  // Mouse & Touch Dragging Handlers for Free Orbit
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;

    const dx = clientX - lastMousePosRef.current.x;
    const dy = clientY - lastMousePosRef.current.y;

    setYaw((prev) => prev + dx * 0.008);
    setPitch((prev) => Math.max(0.05, Math.min(1.4, prev - dy * 0.008)));

    lastMousePosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetCamera = () => {
    setYaw(0.65);
    setPitch(0.38);
    setZoom(1.0);
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl bg-gradient-to-b from-[#060A12] to-[#0B132B] border border-cyan-500/40 shadow-2xl overflow-hidden text-white flex flex-col select-none"
    >
      {/* ── Top Viewport HUD Bar ── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-cyan-500/20 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Move3d className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-white uppercase tracking-wider">
                {isArabic ? "التوأم الرقمي المكاني ثلاثي الأبعاد" : "3D SPATIAL TWIN · DIGITAL RECONSTRUCTION"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>INTERACTIVE BIM</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {isArabic
                ? "اسحب بالماوس للتدوير الحر 360° · تفقد العيوب المكانية ومسار المسح"
                : "Free 360° Orbit Navigation · Drag to inspect defects in spatial coordinate space"}
            </p>
          </div>
        </div>

        {/* View Layers Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveLayer("composite")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === "composite"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isArabic ? "مدمج" : "Composite"}
          </button>
          <button
            onClick={() => setActiveLayer("wireframe")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === "wireframe"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isArabic ? "الهيكل الشبكي" : "BIM Wireframe"}
          </button>
          <button
            onClick={() => setActiveLayer("defects")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === "defects"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isArabic ? "العيوب فقط" : "Defects Only"}
          </button>
          <button
            onClick={() => setActiveLayer("drone")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === "drone"
                ? "bg-purple-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isArabic ? "مسار الدرون" : "Drone Flight"}
          </button>
        </div>
      </div>

      {/* ── Main Canvas Viewport ── */}
      <div
        className="relative w-full h-[440px] sm:h-[480px] bg-[#050811] cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handlePointerUp}
        onWheel={(e) => {
          e.preventDefault();
          setZoom((prev) => Math.max(0.6, Math.min(2.2, prev - e.deltaY * 0.0015)));
        }}
      >
        {/* Subtle Background Radial Tech Glow */}
        <div className="absolute inset-0 bg-radial from-cyan-500/[0.07] via-transparent to-transparent pointer-events-none" />

        {/* The Live Interactive Canvas */}
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Floating Telemetry Crosshair Overlay in Corner */}
        <div className="absolute top-4 left-4 pointer-events-none font-mono text-[10px] space-y-1 bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl backdrop-blur-md text-slate-400">
          <div className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Crosshair className="w-3 h-3" />
            <span>SPATIAL COORDINATES</span>
          </div>
          <div>YAW: {((yaw * 180) / Math.PI).toFixed(1)}°</div>
          <div>PITCH: {((pitch * 180) / Math.PI).toFixed(1)}°</div>
          <div>ZOOM: {(zoom * 100).toFixed(0)}%</div>
          <div className="text-emerald-400 font-semibold pt-1 border-t border-slate-800">
            {hotspots.length} ACTIVE DEFECT HOTSPOTS
          </div>
        </div>

        {/* Floating Floating Zone Filter Buttons on Right */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-slate-950/85 border border-slate-800 p-2 rounded-xl backdrop-blur-md font-mono text-[10px]">
          <span className="text-slate-400 font-bold px-1.5 py-0.5">
            {isArabic ? "عزل النطاقات:" : "ZONE ISOLATION:"}
          </span>
          {["ALL", "Roof", "Facade", "Ground"].map((zoneKey) => (
            <button
              key={zoneKey}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedZone(zoneKey);
              }}
              className={`px-2 py-1 rounded text-left transition-colors cursor-pointer ${
                selectedZone === zoneKey
                  ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {zoneKey === "ALL"
                ? isArabic ? "كامل المبنى (Full)" : "Full Building"
                : zoneKey === "Roof"
                ? isArabic ? "السطح والستارة" : "Roof / Parapet"
                : zoneKey === "Facade"
                ? isArabic ? "الواجهات الخارجية" : "Facades & Walls"
                : isArabic ? "الدور الأرضي والقبو" : "Ground / Basement"}
            </button>
          ))}
        </div>

        {/* Floating Quick Action Overlay Buttons (Bottom Left) */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title={isAutoRotate ? "Pause Auto Rotation" : "Play Auto Rotation"}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-cyan-300 transition-colors shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotate ? (isArabic ? "إيقاف الدوران" : "Pause") : (isArabic ? "دوران تلقائي" : "Auto-Rotate")}</span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Camera View"
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
            title="Zoom In"
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            title="Zoom Out"
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hotspot Legend & Prompt (Bottom Right) */}
        <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl backdrop-blur-md flex items-center gap-3 text-[10px] font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{isArabic ? "عيب حرج (Critical)" : "Critical"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{isArabic ? "متوسط (Moderate)" : "Moderate"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isArabic ? "طفيف (Low)" : "Low"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
