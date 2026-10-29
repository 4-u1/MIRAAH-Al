import React, { useState } from "react";
import { X, Code2, Play, CheckCircle2, Copy, Check } from "lucide-react";
import { Badge } from "../common/Badge";

interface ApiExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
}

interface EndpointDef {
  method: "GET" | "POST" | "PUT";
  path: string;
  category: "Asset Management" | "Inspections & Media" | "Findings Review" | "Decision & Simulation";
  description: string;
  mockResponse: Record<string, any>;
}

export const ApiExplorerModal: React.FC<ApiExplorerModalProps> = ({
  isOpen,
  onClose,
  assetId,
}) => {
  const [selectedEndpointIdx, setSelectedEndpointIdx] = useState<number>(2); // Default to GET /api/assets/{id}/passport
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const ENDPOINTS: EndpointDef[] = [
    // Asset Management (4)
    {
      method: "POST",
      path: "/api/assets",
      category: "Asset Management",
      description: "Create new real estate asset record in registry",
      mockResponse: { status: "created", asset_id: "10295", type: "Residential Villa" },
    },
    {
      method: "GET",
      path: `/api/assets/${assetId}`,
      category: "Asset Management",
      description: "Retrieve asset metadata, size, and valuation",
      mockResponse: { id: assetId, name: "Al-Malqa Luxury Villa #42", size_sqm: 680, valuation_sar: 4250000 },
    },
    {
      method: "GET",
      path: `/api/assets/${assetId}/passport`,
      category: "Asset Management",
      description: "Generate complete machine-readable Spatial Asset Passport (FR-16)",
      mockResponse: {
        asset_id: assetId,
        generated_at: new Date().toISOString(),
        scores: { condition_index: 72, inspection_confidence: 84, liquidation_readiness: 61, inspection_coverage: 94 },
        risk_level: "Moderate",
        findings: { total: 7, critical: 0, moderate: 2, low: 5 },
        evidence_frames: 23,
        readiness_blockers: [
          { description: "Roof coverage incomplete", impact: "High" },
          { description: "Moisture finding unresolved", impact: "Medium" },
        ],
        next_best_action: { label: "Complete Roof Inspection", impact: "High", effort: "Low", readiness_gain: 8 },
        explainability: "READINESS = 61 — Because: 94% coverage · 23 frames · 2 unresolved findings",
      },
    },
    {
      method: "PUT",
      path: `/api/assets/${assetId}`,
      category: "Asset Management",
      description: "Update missing fields and ownership documentation",
      mockResponse: { status: "updated", missing_fields_count: 0 },
    },

    // Inspections & Media (7)
    {
      method: "POST",
      path: "/api/inspections",
      category: "Inspections & Media",
      description: "Initialize new inspection session for asset",
      mockResponse: { inspection_id: "insp-9912", asset_id: assetId, status: "in_progress" },
    },
    {
      method: "GET",
      path: `/api/inspections/insp-9912`,
      category: "Inspections & Media",
      description: "Get inspection session status and telemetry",
      mockResponse: { inspection_id: "insp-9912", coverage_pct: 94, total_frames: 23 },
    },
    {
      method: "POST",
      path: `/api/inspections/insp-9912/upload/video`,
      category: "Inspections & Media",
      description: "Upload 4K walkthrough video for FFmpeg keyframe extraction (FR-01)",
      mockResponse: { upload_status: "received", frames_extracted: 23 },
    },
    {
      method: "POST",
      path: `/api/inspections/insp-9912/upload/images`,
      category: "Inspections & Media",
      description: "Batch upload high-res still photos",
      mockResponse: { uploaded_count: 8 },
    },
    {
      method: "POST",
      path: `/api/inspections/insp-9912/analyze`,
      category: "Inspections & Media",
      description: "Run Multimodal AI VLM Analysis on keyframes (FR-02)",
      mockResponse: { findings_detected: 7, avg_confidence: 78.4 },
    },
    {
      method: "GET",
      path: `/api/inspections/insp-9912/coverage`,
      category: "Inspections & Media",
      description: "Get area-by-area coverage breakdown (FR-07)",
      mockResponse: { overall_coverage_pct: 94, zones: [{ area: "Living Room", pct: 98 }, { area: "Roof", pct: 34 }] },
    },
    {
      method: "GET",
      path: `/api/inspections/insp-9912/confidence`,
      category: "Inspections & Media",
      description: "Get Inspection Confidence Score (FR-09)",
      mockResponse: { confidence_score: 84, formula: "(Coverage*0.50)+(AI*0.30)+(Evidence*0.20)" },
    },

    // Findings Review (3)
    {
      method: "GET",
      path: "/api/findings/f-001",
      category: "Findings Review",
      description: "Get finding details with visual evidence frame references (FR-04)",
      mockResponse: { finding_id: "f-001", type: "Moisture", area: "North Wall", conf: 87, evidence_frames: 5 },
    },
    {
      method: "POST",
      path: "/api/findings/f-001/confirm",
      category: "Findings Review",
      description: "Licensed inspector marks finding VERIFIED (FR-05)",
      mockResponse: { finding_id: "f-001", status: "VERIFIED", verified_by: "SCE #48912" },
    },
    {
      method: "POST",
      path: "/api/findings/f-001/reject",
      category: "Findings Review",
      description: "Inspector dismisses false-positive finding",
      mockResponse: { finding_id: "f-001", status: "DISMISSED" },
    },

    // Decision & Simulation (3)
    {
      method: "GET",
      path: `/api/inspections/insp-9912/readiness`,
      category: "Decision & Simulation",
      description: "Calculate Liquidation Readiness Score (FR-11)",
      mockResponse: { readiness: 61, condition_index: 72, risk_level: "Moderate" },
    },
    {
      method: "POST",
      path: "/api/scenarios/simulate",
      category: "Decision & Simulation",
      description: "Run What-If Scenario simulation on modified asset data (FR-14)",
      mockResponse: { scenario: "Complete Docs", simulated_readiness: 68, delta: "+7" },
    },
    {
      method: "GET",
      path: `/api/inspections/insp-9912/actions`,
      category: "Decision & Simulation",
      description: "Get ranked Next Best Action recommendations (FR-15)",
      mockResponse: { actions: [{ rank: 1, action: "Complete Roof Inspection", gain: "+8", priority_score: 3.0 }] },
    },
  ];

  const currentEndpoint = ENDPOINTS[selectedEndpointIdx];

  const handleExecuteRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResponse(currentEndpoint.mockResponse);
    }, 300);
  };

  const handleCopyJson = () => {
    navigator.clipboard?.writeText?.(
      JSON.stringify(response || currentEndpoint.mockResponse, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodColors: Record<string, string> = {
    GET: "#00C5A0",
    POST: "#60A5FA",
    PUT: "#F59E0B",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#09152B] border border-[#00C5A0]/40 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        <div className="px-4 py-2 bg-amber-500/15 border-b border-amber-500/40 text-amber-200 text-xs text-center">
          Proposed API design — these endpoints are NOT implemented in this prototype; responses shown are examples. · تصميم مقترح للواجهات البرمجية، غير منفّذ في هذا النموذج، والردود المعروضة أمثلة.
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00C5A0]/20 bg-[#0D1F45]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00C5A0]/15 text-[#00C5A0]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold flex items-center gap-2">
                <span>MIRAAH REST API Explorer</span>
                <Badge color="#00C5A0">FR-19 (17 Documented Endpoints)</Badge>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Full-Stack REST Architecture · JSON OpenAPI Spec
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Column (Endpoints List / Request-Response Bench) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: 17 Endpoints List */}
          <div className="lg:col-span-5 border-r border-white/10 overflow-y-auto p-4 space-y-2 bg-[#070E1C]/80">
            <div className="text-[11px] font-bold text-[#64748B] uppercase font-mono px-2 mb-2">
              Documented Endpoints ({ENDPOINTS.length})
            </div>

            {ENDPOINTS.map((ep, idx) => {
              const isSelected = selectedEndpointIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedEndpointIdx(idx);
                    setResponse(null);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#00C5A0]/15 border-[#00C5A0]/60 shadow-[0_0_15px_rgba(0,197,160,0.2)]"
                      : "bg-[#0D1F45]/50 border-white/5 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                      style={{
                        backgroundColor: `${methodColors[ep.method]}20`,
                        color: methodColors[ep.method],
                      }}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs text-white font-bold truncate">
                      {ep.path}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] line-clamp-1">
                    {ep.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Tester & JSON Viewer */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-4 bg-[#09152B] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Endpoint Banner */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#64748B] uppercase">
                    {currentEndpoint.category}
                  </span>
                  <Badge color={methodColors[currentEndpoint.method]}>
                    {currentEndpoint.method}
                  </Badge>
                </div>
                <div className="text-sm font-mono font-bold text-[#00E8BE]">
                  {currentEndpoint.path}
                </div>
                <p className="text-xs text-[#CBD5E1]">
                  {currentEndpoint.description}
                </p>
              </div>

              {/* Execution Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#94A3B8]">
                  Content-Type: application/json
                </span>

                <button
                  onClick={handleExecuteRequest}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C5A0] to-[#00E8BE] text-[#06101E] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-md shadow-[#00C5A0]/25"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{loading ? "Sending..." : "Send Test Request"}</span>
                </button>
              </div>

              {/* Response Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Response Body (200 OK):</span>
                  <button
                    onClick={handleCopyJson}
                    className="text-[#00E8BE] hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy JSON"}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-[#070E1C] border border-[#00C5A0]/30 font-mono text-xs text-[#60A5FA] overflow-x-auto max-h-[300px] leading-relaxed shadow-inner">
                  {JSON.stringify(response || currentEndpoint.mockResponse, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-[#64748B] flex items-center justify-between">
              <span>Host: https://api.miraah.sa/v1</span>
              <span>Latency: 42ms (Mode A Cached)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
