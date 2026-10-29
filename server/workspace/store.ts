import { randomUUID } from "crypto";
import type { Asset, AuditEntry, Evidence, Finding, Role } from "./domain";

/** Persistence for the live workspace. Firestore in production, in-memory in unit tests. */
export interface Repo {
  getRole(email: string): Promise<Role | null>;
  setRole(email: string, role: Role | null): Promise<void>;
  listRoles(): Promise<{ email: string; role: Role }[]>;

  listAssets(): Promise<Asset[]>;
  getAsset(id: string): Promise<Asset | null>;
  createAsset(a: Omit<Asset, "id">): Promise<Asset>;
  updateAsset(id: string, patch: Partial<Asset>): Promise<Asset>;

  listFindings(assetId: string): Promise<Finding[]>;
  getFinding(id: string): Promise<Finding | null>;
  createFinding(f: Omit<Finding, "id">): Promise<Finding>;
  updateFinding(id: string, patch: Partial<Finding>): Promise<Finding>;

  listEvidence(assetId: string): Promise<Evidence[]>;
  getEvidence(id: string): Promise<Evidence | null>;
  createEvidence(e: Omit<Evidence, "id"> & { id?: string }): Promise<Evidence>;
  updateEvidence(id: string, patch: Partial<Evidence>): Promise<Evidence>;

  addAudit(e: Omit<AuditEntry, "id">): Promise<void>;
  listAudit(assetId: string): Promise<AuditEntry[]>;
}

/** Binary storage for evidence files. Cloud Storage in production. */
export interface BlobStore {
  put(path: string, bytes: Buffer, contentType: string): Promise<void>;
  get(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
}

const byCreated = <T extends { createdAt?: string; uploadedAt?: string; at?: string }>(a: T, b: T) =>
  String(a.createdAt ?? a.uploadedAt ?? a.at).localeCompare(String(b.createdAt ?? b.uploadedAt ?? b.at));

export class MemoryRepo implements Repo {
  roles = new Map<string, Role>();
  assets = new Map<string, Asset>();
  findings = new Map<string, Finding>();
  evidence = new Map<string, Evidence>();
  audit: AuditEntry[] = [];

  async getRole(email: string) {
    return this.roles.get(email.toLowerCase()) ?? null;
  }
  async setRole(email: string, role: Role | null) {
    if (role) this.roles.set(email.toLowerCase(), role);
    else this.roles.delete(email.toLowerCase());
  }
  async listRoles() {
    return [...this.roles].map(([email, role]) => ({ email, role }));
  }
  async listAssets() {
    return [...this.assets.values()].sort(byCreated);
  }
  async getAsset(id: string) {
    return this.assets.get(id) ?? null;
  }
  async createAsset(a: Omit<Asset, "id">) {
    const v = { ...a, id: randomUUID() };
    this.assets.set(v.id, v);
    return v;
  }
  async updateAsset(id: string, patch: Partial<Asset>) {
    const cur = this.assets.get(id);
    if (!cur) throw new Error("not found");
    const v = { ...cur, ...patch, id };
    this.assets.set(id, v);
    return v;
  }
  async listFindings(assetId: string) {
    return [...this.findings.values()].filter((f) => f.assetId === assetId).sort(byCreated);
  }
  async getFinding(id: string) {
    return this.findings.get(id) ?? null;
  }
  async createFinding(f: Omit<Finding, "id">) {
    const v = { ...f, id: randomUUID() };
    this.findings.set(v.id, v);
    return v;
  }
  async updateFinding(id: string, patch: Partial<Finding>) {
    const cur = this.findings.get(id);
    if (!cur) throw new Error("not found");
    const v = { ...cur, ...patch, id };
    this.findings.set(id, v);
    return v;
  }
  async listEvidence(assetId: string) {
    return [...this.evidence.values()].filter((e) => e.assetId === assetId).sort(byCreated);
  }
  async getEvidence(id: string) {
    return this.evidence.get(id) ?? null;
  }
  async createEvidence(e: Omit<Evidence, "id"> & { id?: string }) {
    const v = { ...e, id: e.id ?? randomUUID() } as Evidence;
    this.evidence.set(v.id, v);
    return v;
  }
  async updateEvidence(id: string, patch: Partial<Evidence>) {
    const cur = this.evidence.get(id);
    if (!cur) throw new Error("not found");
    const v = { ...cur, ...patch, id };
    this.evidence.set(id, v);
    return v;
  }
  async addAudit(e: Omit<AuditEntry, "id">) {
    this.audit.push({ ...e, id: randomUUID() });
  }
  async listAudit(assetId: string) {
    return this.audit.filter((a) => a.assetId === assetId).sort(byCreated);
  }
}

export class MemoryBlobStore implements BlobStore {
  files = new Map<string, Buffer>();
  async put(path: string, bytes: Buffer) {
    this.files.set(path, Buffer.from(bytes));
  }
  async get(path: string) {
    const b = this.files.get(path);
    if (!b) throw new Error("blob not found");
    return b;
  }
  async delete(path: string) {
    this.files.delete(path);
  }
}
