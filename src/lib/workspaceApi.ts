import { auth } from "./firebase";

/** Client for /api/workspace. Every call carries the user's Firebase ID token. */

export type Role = "inspector" | "reviewer" | "viewer";

export interface Me {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  role: Role | null;
  isAdmin: boolean;
  ai: boolean;
  signing: boolean;
}

export interface CoverageArea {
  id: string;
  area: string;
  areaArabic?: string;
  pct: number;
}

export interface WsAsset {
  id: string;
  name: string;
  nameArabic?: string;
  type: "Residential Villa" | "Commercial Tower" | "Residential Compound" | "Logistics Warehouse";
  city: string;
  district?: string;
  location?: string;
  sizeSqm: number;
  buildYear: number;
  valuationSar?: number;
  caseReference?: string;
  coverageAreas: CoverageArea[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  findingsCount?: number;
  liquidationReadiness?: number;
  riskLevel?: string;
}

export interface WsSuggestion {
  defect_present: boolean;
  defect_type: string;
  severity: string;
  confidence: number;
  location_hint: string;
  rationale: string;
  model: string;
  analyzedAt: string;
  analyzedBy: string;
}

export interface WsEvidence {
  id: string;
  assetId: string;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  originalName: string;
  uploadedBy: string;
  uploadedAt: string;
  aiSuggestion: WsSuggestion | null;
}

export interface WsFinding {
  id: string;
  assetId: string;
  type: "Crack" | "Moisture" | "Surface Damage" | "Paint Peeling";
  severity: "Critical" | "Moderate" | "Low";
  area: string;
  description: string;
  evidenceIds: string[];
  source: "manual" | "ai-confirmed";
  /** Model self-reported confidence for ai-confirmed findings; null for manual findings. */
  confidence: number | null;
  verified: boolean;
  verifiedBy: string | null;
  resolved: boolean;
  resolvedBy: string | null;
  createdBy: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  target: string;
  actor: string;
  at: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

async function headers(extra: Record<string, string> = {}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new ApiError(401, "auth_required");
  return { Authorization: `Bearer ${token}`, ...extra };
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/workspace${path}`, {
    method,
    headers: await headers(body !== undefined ? { "Content-Type": "application/json" } : {}),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error || `http_${res.status}`);
  return data as T;
}

export const ws = {
  me: () => call<Me>("GET", "/me"),
  roles: () => call<{ email: string; role: Role }[]>("GET", "/roles"),
  setRole: (email: string, role: Role | null) => call<{ ok: true }>("POST", "/roles", { email, role }),
  assets: () => call<WsAsset[]>("GET", "/assets"),
  createAsset: (a: Partial<WsAsset>) => call<WsAsset>("POST", "/assets", a),
  updateAsset: (id: string, patch: Partial<WsAsset>) => call<WsAsset>("PATCH", `/assets/${id}`, patch),
  asset: (id: string) =>
    call<{ asset: WsAsset; findings: WsFinding[]; evidence: WsEvidence[]; scores: Record<string, unknown> & { liquidationReadiness: number; conditionIndex: number; coveragePct: number; inspectionConfidence: number; riskLevel: string; readinessBlockers: { description: string; impact: string; code: string }[] } }>(
      "GET",
      `/assets/${id}`
    ),
  audit: (id: string) => call<AuditEntry[]>("GET", `/assets/${id}/audit`),
  analyze: (evidenceId: string) => call<WsEvidence>("POST", `/evidence/${evidenceId}/analyze`),
  createFinding: (assetId: string, f: { type: string; severity: string; area: string; description?: string; evidenceIds: string[]; source: "manual" | "ai-confirmed" }) =>
    call<WsFinding>("POST", `/assets/${assetId}/findings`, f),
  review: (findingId: string, kind: "verify" | "resolve", value: boolean, note = "") => call<WsFinding>("POST", `/findings/${findingId}/${kind}`, { value, note }),
  passport: (id: string) => call<Record<string, unknown>>("GET", `/assets/${id}/passport`),

  async upload(assetId: string, file: File): Promise<WsEvidence> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/workspace/assets/${assetId}/evidence`, { method: "POST", headers: await headers(), body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error || `http_${res.status}`);
    return data as WsEvidence;
  },

  /** Images need the auth header, so they are fetched and shown as object URLs. */
  async imageUrl(evidenceId: string): Promise<string> {
    const res = await fetch(`/api/workspace/evidence/${evidenceId}/file`, { headers: await headers() });
    if (!res.ok) throw new ApiError(res.status, `http_${res.status}`);
    return URL.createObjectURL(await res.blob());
  },
};

export async function verifyExport(exp: unknown) {
  const res = await fetch("/api/passport/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(exp) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error || `http_${res.status}`);
  return data as { fingerprintValid: boolean; signatureValid: boolean | null; keyId: string | null; signedBy: { email: string | null } | null; generatedAt: string | null };
}
