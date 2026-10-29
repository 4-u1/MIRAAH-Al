import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { mkdirSync, readFileSync, unlinkSync, renameSync, existsSync, openSync, writeSync, fsyncSync, closeSync } from "fs";
import path from "path";
import type { Asset, AuditEntry, Evidence, Finding, Role } from "./domain";
import { ROLES } from "./domain";
import type { BlobStore, Repo } from "./store";

/**
 * SQLite + local-disk implementations of the workspace store.
 *
 * One database file (WAL mode) holds roles, assets, findings, evidence metadata and the audit log.
 * Records are stored as JSON with indexed key columns. Evidence files live under DATA_DIR/evidence.
 * Needs a persistent disk (a VPS or a Docker volume), not an ephemeral container filesystem.
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS roles    (email TEXT PRIMARY KEY, role TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS assets   (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, doc TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS findings (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL REFERENCES assets(id), created_at TEXT NOT NULL, doc TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS evidence (id TEXT PRIMARY KEY, asset_id TEXT NOT NULL REFERENCES assets(id), uploaded_at TEXT NOT NULL, doc TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit    (seq INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT NOT NULL UNIQUE, asset_id TEXT, at TEXT NOT NULL, doc TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS findings_asset ON findings(asset_id, created_at);
CREATE INDEX IF NOT EXISTS evidence_asset ON evidence(asset_id, uploaded_at);
CREATE INDEX IF NOT EXISTS audit_asset ON audit(asset_id, seq);
-- The audit log is append-only at the database level too.
CREATE TRIGGER IF NOT EXISTS audit_no_update BEFORE UPDATE ON audit BEGIN SELECT RAISE(ABORT, 'audit log is append-only'); END;
CREATE TRIGGER IF NOT EXISTS audit_no_delete BEFORE DELETE ON audit BEGIN SELECT RAISE(ABORT, 'audit log is append-only'); END;
`;

type Row = { doc: string };

export class SqliteRepo implements Repo {
  readonly db: Database.Database;

  constructor(file: string) {
    if (file !== ":memory:") mkdirSync(path.dirname(file), { recursive: true });
    this.db = new Database(file);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
    this.db.pragma("busy_timeout = 5000");
    this.db.exec(SCHEMA);
  }

  close() {
    this.db.close();
  }

  /** Consistent online backup to another file (safe while the server is running). */
  backup(dest: string) {
    return this.db.backup(dest);
  }

  private one<T>(sql: string, ...args: unknown[]): T | null {
    const r = this.db.prepare(sql).get(...args) as Row | undefined;
    return r ? (JSON.parse(r.doc) as T) : null;
  }
  private many<T>(sql: string, ...args: unknown[]): T[] {
    return (this.db.prepare(sql).all(...args) as Row[]).map((r) => JSON.parse(r.doc) as T);
  }

  async getRole(email: string) {
    const r = this.db.prepare("SELECT role FROM roles WHERE email = ?").get(email.toLowerCase()) as { role: string } | undefined;
    return r && (ROLES as readonly string[]).includes(r.role) ? (r.role as Role) : null;
  }
  async setRole(email: string, role: Role | null) {
    if (role) {
      this.db
        .prepare("INSERT INTO roles(email, role, updated_at) VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET role = excluded.role, updated_at = excluded.updated_at")
        .run(email.toLowerCase(), role, new Date().toISOString());
    } else {
      this.db.prepare("DELETE FROM roles WHERE email = ?").run(email.toLowerCase());
    }
  }
  async listRoles() {
    return this.db.prepare("SELECT email, role FROM roles ORDER BY email").all() as { email: string; role: Role }[];
  }

  async listAssets() {
    return this.many<Asset>("SELECT doc FROM assets ORDER BY created_at, rowid");
  }
  async getAsset(id: string) {
    return this.one<Asset>("SELECT doc FROM assets WHERE id = ?", id);
  }
  async createAsset(a: Omit<Asset, "id">) {
    const v = { ...a, id: randomUUID() } as Asset;
    this.db.prepare("INSERT INTO assets(id, created_at, doc) VALUES (?, ?, ?)").run(v.id, v.createdAt, JSON.stringify(v));
    return v;
  }
  async updateAsset(id: string, patch: Partial<Asset>) {
    const tx = this.db.transaction(() => {
      const cur = this.one<Asset>("SELECT doc FROM assets WHERE id = ?", id);
      if (!cur) throw new Error("not found");
      const v = { ...cur, ...patch, id } as Asset;
      this.db.prepare("UPDATE assets SET doc = ? WHERE id = ?").run(JSON.stringify(v), id);
      return v;
    });
    return tx();
  }

  async listFindings(assetId: string) {
    return this.many<Finding>("SELECT doc FROM findings WHERE asset_id = ? ORDER BY created_at, rowid", assetId);
  }
  async getFinding(id: string) {
    return this.one<Finding>("SELECT doc FROM findings WHERE id = ?", id);
  }
  async createFinding(f: Omit<Finding, "id">) {
    const v = { ...f, id: randomUUID() } as Finding;
    this.db.prepare("INSERT INTO findings(id, asset_id, created_at, doc) VALUES (?, ?, ?, ?)").run(v.id, v.assetId, v.createdAt, JSON.stringify(v));
    return v;
  }
  async updateFinding(id: string, patch: Partial<Finding>) {
    const tx = this.db.transaction(() => {
      const cur = this.one<Finding>("SELECT doc FROM findings WHERE id = ?", id);
      if (!cur) throw new Error("not found");
      const v = { ...cur, ...patch, id } as Finding;
      this.db.prepare("UPDATE findings SET doc = ? WHERE id = ?").run(JSON.stringify(v), id);
      return v;
    });
    return tx();
  }

  async listEvidence(assetId: string) {
    return this.many<Evidence>("SELECT doc FROM evidence WHERE asset_id = ? ORDER BY uploaded_at, rowid", assetId);
  }
  async getEvidence(id: string) {
    return this.one<Evidence>("SELECT doc FROM evidence WHERE id = ?", id);
  }
  async createEvidence(e: Omit<Evidence, "id"> & { id?: string }) {
    const v = { ...e, id: e.id ?? randomUUID() } as Evidence;
    this.db.prepare("INSERT INTO evidence(id, asset_id, uploaded_at, doc) VALUES (?, ?, ?, ?)").run(v.id, v.assetId, v.uploadedAt, JSON.stringify(v));
    return v;
  }
  async updateEvidence(id: string, patch: Partial<Evidence>) {
    const tx = this.db.transaction(() => {
      const cur = this.one<Evidence>("SELECT doc FROM evidence WHERE id = ?", id);
      if (!cur) throw new Error("not found");
      const v = { ...cur, ...patch, id } as Evidence;
      this.db.prepare("UPDATE evidence SET doc = ? WHERE id = ?").run(JSON.stringify(v), id);
      return v;
    });
    return tx();
  }

  async addAudit(e: Omit<AuditEntry, "id">) {
    const v = { ...e, id: randomUUID() };
    this.db.prepare("INSERT INTO audit(id, asset_id, at, doc) VALUES (?, ?, ?, ?)").run(v.id, v.assetId, v.at, JSON.stringify(v));
  }
  async listAudit(assetId: string) {
    return this.many<AuditEntry>("SELECT doc FROM audit WHERE asset_id = ? ORDER BY seq", assetId);
  }
}

/** Evidence files on local disk. Paths are generated by the server (evidence/<assetId>/<uuid>.<ext>). */
export class FsBlobStore implements BlobStore {
  constructor(private root: string) {
    mkdirSync(root, { recursive: true });
  }

  private resolve(p: string) {
    const full = path.resolve(this.root, p);
    if (!full.startsWith(path.resolve(this.root) + path.sep)) throw new Error("path escapes storage root");
    return full;
  }

  async put(p: string, bytes: Buffer, _contentType?: string) {
    const full = this.resolve(p);
    mkdirSync(path.dirname(full), { recursive: true });
    const tmp = `${full}.${randomUUID()}.tmp`;
    try {
      const fd = openSync(tmp, "wx", 0o640);
      try {
        let off = 0;
        while (off < bytes.length) off += writeSync(fd, bytes, off, bytes.length - off); // no silent short writes
        fsyncSync(fd); // durable before it becomes visible
      } finally {
        closeSync(fd);
      }
      renameSync(tmp, full); // atomic on the same filesystem
      const dfd = openSync(path.dirname(full), "r");
      try {
        fsyncSync(dfd); // make the rename itself durable
      } finally {
        closeSync(dfd);
      }
    } catch (e) {
      try {
        if (existsSync(tmp)) unlinkSync(tmp);
      } catch {
        /* keep the original error */
      }
      throw e;
    }
  }
  async get(p: string) {
    return readFileSync(this.resolve(p));
  }
  async delete(p: string) {
    const full = this.resolve(p);
    if (existsSync(full)) unlinkSync(full);
  }
}
