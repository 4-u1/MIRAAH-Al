import { initializeApp, getApps, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import type { Asset, AuditEntry, Evidence, Finding, Role } from "./domain";
import { ROLES } from "./domain";
import type { BlobStore, Repo } from "./store";

/**
 * Firestore + Cloud Storage implementations (firebase-admin). On Cloud Run the default
 * service account credentials are used. With FIRESTORE_EMULATOR_HOST / FIREBASE_STORAGE_EMULATOR_HOST
 * set, the Admin SDK talks to the local emulators instead (used by the integration tests).
 *
 * Collections (named database from firebase-applet-config.json):
 *   roles/{email}        { role }
 *   assets/{id}          Asset
 *   findings/{id}        Finding (assetId field)
 *   evidence/{id}        Evidence (assetId field)
 *   auditLog/{auto}      AuditEntry
 */

export function adminApp(projectId: string, storageBucket?: string): App {
  return getApps()[0] ?? initializeApp({ projectId, storageBucket });
}

const strip = <T extends object>(o: T): T => JSON.parse(JSON.stringify(o));

export class FirestoreRepo implements Repo {
  constructor(private db: Firestore) {}

  static create(app: App, databaseId?: string) {
    return new FirestoreRepo(databaseId ? getFirestore(app, databaseId) : getFirestore(app));
  }

  async getRole(email: string) {
    const s = await this.db.collection("roles").doc(email.toLowerCase()).get();
    const r = s.exists ? (s.data()?.role as string) : null;
    return r && (ROLES as readonly string[]).includes(r) ? (r as Role) : null;
  }
  async setRole(email: string, role: Role | null) {
    const ref = this.db.collection("roles").doc(email.toLowerCase());
    if (role) await ref.set({ role, updatedAt: new Date().toISOString() });
    else await ref.delete();
  }
  async listRoles() {
    const s = await this.db.collection("roles").get();
    return s.docs.map((d) => ({ email: d.id, role: d.data().role as Role }));
  }

  async listAssets() {
    const s = await this.db.collection("assets").orderBy("createdAt").limit(500).get();
    return s.docs.map((d) => ({ ...(d.data() as Asset), id: d.id }));
  }
  async getAsset(id: string) {
    const s = await this.db.collection("assets").doc(id).get();
    return s.exists ? ({ ...(s.data() as Asset), id: s.id } as Asset) : null;
  }
  async createAsset(a: Omit<Asset, "id">) {
    const ref = this.db.collection("assets").doc();
    await ref.set(strip(a));
    return { ...a, id: ref.id } as Asset;
  }
  async updateAsset(id: string, patch: Partial<Asset>) {
    const ref = this.db.collection("assets").doc(id);
    const { id: _ignore, ...rest } = patch;
    await ref.update(strip(rest));
    return (await this.getAsset(id)) as Asset;
  }

  async listFindings(assetId: string) {
    const s = await this.db.collection("findings").where("assetId", "==", assetId).get();
    return s.docs.map((d) => ({ ...(d.data() as Finding), id: d.id })).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  async getFinding(id: string) {
    const s = await this.db.collection("findings").doc(id).get();
    return s.exists ? ({ ...(s.data() as Finding), id: s.id } as Finding) : null;
  }
  async createFinding(f: Omit<Finding, "id">) {
    const ref = this.db.collection("findings").doc();
    await ref.set(strip(f));
    return { ...f, id: ref.id } as Finding;
  }
  async updateFinding(id: string, patch: Partial<Finding>) {
    const { id: _ignore, ...rest } = patch;
    await this.db.collection("findings").doc(id).update(strip(rest));
    return (await this.getFinding(id)) as Finding;
  }

  async listEvidence(assetId: string) {
    const s = await this.db.collection("evidence").where("assetId", "==", assetId).get();
    return s.docs.map((d) => ({ ...(d.data() as Evidence), id: d.id })).sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt));
  }
  async getEvidence(id: string) {
    const s = await this.db.collection("evidence").doc(id).get();
    return s.exists ? ({ ...(s.data() as Evidence), id: s.id } as Evidence) : null;
  }
  async createEvidence(e: Omit<Evidence, "id"> & { id?: string }) {
    const ref = e.id ? this.db.collection("evidence").doc(e.id) : this.db.collection("evidence").doc();
    const { id: _ignore, ...rest } = e;
    await ref.set(strip(rest));
    return { ...rest, id: ref.id } as Evidence;
  }
  async updateEvidence(id: string, patch: Partial<Evidence>) {
    const { id: _ignore, ...rest } = patch;
    await this.db.collection("evidence").doc(id).update(strip(rest));
    return (await this.getEvidence(id)) as Evidence;
  }

  async addAudit(e: Omit<AuditEntry, "id">) {
    await this.db.collection("auditLog").add(strip(e));
  }
  async listAudit(assetId: string) {
    const s = await this.db.collection("auditLog").where("assetId", "==", assetId).get();
    return s.docs.map((d) => ({ ...(d.data() as AuditEntry), id: d.id })).sort((a, b) => a.at.localeCompare(b.at));
  }
}

export class CloudStorageBlobStore implements BlobStore {
  constructor(private app: App, private bucketName: string) {}
  private bucket() {
    return getStorage(this.app).bucket(this.bucketName);
  }
  async put(path: string, bytes: Buffer, contentType: string) {
    await this.bucket().file(path).save(bytes, { contentType, resumable: false, metadata: { cacheControl: "private, max-age=0" } });
  }
  async get(path: string) {
    const [buf] = await this.bucket().file(path).download();
    return buf;
  }
}
