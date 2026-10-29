import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface AccreditationSealProps {
  serialNumber?: string;
  inspectorName?: string;
  licenseNumber?: string;
  issueDate?: string;
  verificationHash?: string;
  size?: "sm" | "md" | "lg";
  isArabic?: boolean;
  variant?: "gold" | "emerald" | "navy";
}

export const AccreditationSeal: React.FC<AccreditationSealProps> = ({
  serialNumber = "SPECIMEN",
  inspectorName = "Demo Inspector (fictional)",
  licenseNumber = "SPECIMEN",
  issueDate = "2026-03-15",
  verificationHash = "—",
  size = "md",
  isArabic = false,
  variant = "gold",
}) => {
  const sizeClasses = {
    sm: "w-40 h-40",
    md: "w-52 h-52",
    lg: "w-64 h-64",
  };

  const isGold = variant === "gold";
  const isEmerald = variant === "emerald";

  const primaryColor = isGold ? "#D4AF37" : isEmerald ? "#10B981" : "#0EA5E9";
  const secondaryColor = isGold ? "#F59E0B" : isEmerald ? "#059669" : "#0284C7";
  const bgFill = isGold ? "rgba(212, 175, 55, 0.06)" : isEmerald ? "rgba(16, 185, 129, 0.06)" : "rgba(14, 165, 233, 0.06)";

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} transition-transform hover:scale-105 duration-300`}
      dir="ltr"
    >
      {/* Outer Rotating/Ornamental SVG Seal */}
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
      >
        <defs>
          {/* Radial Gradient for Seal Surface */}
          <radialGradient id={`seal-grad-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.15" />
            <stop offset="70%" stopColor={primaryColor} stopOpacity="0.05" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.25" />
          </radialGradient>

          {/* Linear Metallic Gold/Emerald Border Gradient */}
          <linearGradient id={`gold-metal-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="25%" stopColor={primaryColor} />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#B38B21" />
          </linearGradient>

          {/* Curved Text Paths */}
          <path
            id={`topCurve-${variant}`}
            d="M 40,150 A 110,110 0 1,1 260,150"
            fill="none"
          />
          <path
            id={`bottomCurve-${variant}`}
            d="M 260,150 A 110,110 0 1,1 40,150"
            fill="none"
          />
          <path
            id={`innerTopCurve-${variant}`}
            d="M 60,150 A 90,90 0 1,1 240,150"
            fill="none"
          />
          <path
            id={`innerBottomCurve-${variant}`}
            d="M 240,150 A 90,90 0 1,1 60,150"
            fill="none"
          />
        </defs>

        {/* Outer Serrated Star / Scalloped Edge */}
        <g stroke={primaryColor} strokeWidth="1.5" fill={bgFill} opacity="0.9">
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const r1 = 142;
            const r2 = 148;
            const x1 = 150 + r1 * Math.cos(angle);
            const y1 = 150 + r1 * Math.sin(angle);
            const x2 = 150 + r2 * Math.cos(angle + Math.PI / 36);
            const y2 = 150 + r2 * Math.sin(angle + Math.PI / 36);
            return (
              <circle
                key={i}
                cx={x1}
                cy={y1}
                r="1.8"
                fill={primaryColor}
              />
            );
          })}
        </g>

        {/* Outer Ring */}
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke={`url(#gold-metal-${variant})`}
          strokeWidth="3.5"
          strokeDasharray="1 0"
        />

        {/* Inner Dotted Secondary Ring */}
        <circle
          cx="150"
          cy="150"
          r="132"
          fill="none"
          stroke={primaryColor}
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.8"
        />

        {/* Circular top text */}
        <text
          fill={isGold ? "#FDE68A" : isEmerald ? "#6EE7B7" : "#7DD3FC"}
          fontSize="11.5"
          fontWeight="bold"
          letterSpacing="2.5"
          fontFamily="system-ui, sans-serif"
        >
          <textPath href={`#topCurve-${variant}`} startOffset="50%" textAnchor="middle">
            MIRAAH PROTOTYPE · SPECIMEN
          </textPath>
        </text>

        {/* Circular bottom text */}
        <text
          fill={isGold ? "#FDE68A" : isEmerald ? "#6EE7B7" : "#7DD3FC"}
          fontSize="11.5"
          fontWeight="bold"
          letterSpacing="2.5"
          fontFamily="system-ui, sans-serif"
        >
          <textPath href={`#bottomCurve-${variant}`} startOffset="50%" textAnchor="middle">
            NOT AN SPECIMEN · DEMO
          </textPath>
        </text>

        {/* Inner Divider Ring */}
        <circle
          cx="150"
          cy="150"
          r="86"
          fill={`url(#seal-grad-${variant})`}
          stroke={primaryColor}
          strokeWidth="2"
        />

        {/* Center decorative star */}
        <g transform="translate(150, 108)" textAnchor="middle">
          {/* Emblem Crown / Palm Star */}
          <polygon
            points="0,-18 5,-8 16,-8 8,-2 11,8 0,2 -11,8 -8,-2 -16,-8 -5,-8"
            fill={primaryColor}
            opacity="0.9"
          />
        </g>

        {/* Center Text Block: Arabic Calligraphic Style Heading */}
        <text
          x="150"
          y="138"
          fill="#FFFFFF"
          fontSize="15"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="sans-serif"
          letterSpacing="1"
        >
          نموذج توضيحي
        </text>

        <text
          x="150"
          y="155"
          fill={isGold ? "#FBBF24" : isEmerald ? "#34D399" : "#38BDF8"}
          fontSize="10"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="monospace"
          letterSpacing="2"
        >
          SPECIMEN
        </text>

        {/* Horizontal Divider Line with Stars */}
        <line x1="90" y1="166" x2="210" y2="166" stroke={primaryColor} strokeWidth="1.2" opacity="0.7" />
        <circle cx="150" cy="166" r="3" fill="#FFFFFF" />
        <circle cx="130" cy="166" r="2" fill={primaryColor} />
        <circle cx="170" cy="166" r="2" fill={primaryColor} />

        {/* Accreditation Serial Number */}
        <text
          x="150"
          y="184"
          fill="#E2E8F0"
          fontSize="9.5"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {serialNumber}
        </text>

        <text
          x="150"
          y="200"
          fill={isGold ? "#FDE68A" : isEmerald ? "#A7F3D0" : "#BAE6FD"}
          fontSize="8.5"
          fontWeight="600"
          textAnchor="middle"
          fontFamily="monospace"
          opacity="0.9"
        >
          {issueDate} · DEMO
        </text>
      </svg>

      {/* Floating Holographic Badge in Bottom-Right Corner */}
      <div className="absolute -bottom-2 -right-2 bg-slate-950/90 border border-amber-400/60 rounded-full px-2.5 py-0.5 text-[9px] font-mono text-amber-300 font-bold flex items-center gap-1 shadow-lg backdrop-blur-md">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>DEMO</span>
      </div>
    </div>
  );
};
