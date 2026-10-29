import { describe, it, expect } from "vitest";
import { mkdtempSync, existsSync, readdirSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { runWorkspaceSuite } from "./workspaceSuite";
import { SqliteRepo, FsBlobStore } from "../server/workspace/sqliteStore";

// The full workspace suite against a real SQLite file and a real evidence folder on disk.
runWorkspaceSuite("SQLite + disk", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "miraah-"));
  return { repo: new SqliteRepo(path.join(dir, "miraah.db")), blobs: new FsBlobStore(dir) };
});

describe("SQLite specifics", () => {
  const fresh = () => {
    const dir = mkdtempSync(path.join(tmpdir(), "miraah-"));
    return { dir, repo: new SqliteRepo(path.join(dir, "miraah.db")), blobs: new FsBlobStore(dir) };
  };

  it("persists across reopening the database file", async () => {
    const { dir, repo } = fresh();
    const a = await repo.createAsset({ name: "A", nameArabic: "", type: "Residential Villa", city: "Riyadh", district: "", location: "", sizeSqm: 1, buildYear: 2000, valuationSar: 0, caseReference: "", coverageAreas: [], createdBy: "x", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" });
    await repo.setRole("x@example.com", "inspector");
    repo.close();
    const again = new SqliteRepo(path.join(dir, "miraah.db"));
    expect((await again.getAsset(a.id))?.name).toBe("A");
    expect(await again.getRole("x@example.com")).toBe("inspector");
  });

  it("the audit log is append-only in the database itself", async () => {
    const { repo } = fresh();
    await repo.addAudit({ assetId: "a", action: "x", target: "t", actor: "u", at: "2026-01-01T00:00:00.000Z" });
    expect(() => repo.db.prepare("UPDATE audit SET doc = '{}'").run()).toThrow(/append-only/);
    expect(() => repo.db.prepare("DELETE FROM audit").run()).toThrow(/append-only/);
    expect(await repo.listAudit("a")).toHaveLength(1);
  });

  it("findings must reference an existing asset (foreign keys on)", async () => {
    const { repo } = fresh();
    await expect(
      repo.createFinding({ assetId: "nope", type: "Crack", severity: "Low", area: "R", description: "", evidenceIds: [], source: "manual", confidence: null, verified: false, verifiedBy: null, resolved: false, resolvedBy: null, createdBy: "x", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" })
    ).rejects.toThrow();
  });

  it("blob store writes atomically, refuses paths outside its root, and deletes", async () => {
    const { dir, blobs } = fresh();
    await blobs.put("evidence/a/1.png", Buffer.from("x"), "image/png");
    expect((await blobs.get("evidence/a/1.png")).toString()).toBe("x");
    expect(readdirSync(path.join(dir, "evidence/a")).filter((f) => f.endsWith(".tmp"))).toHaveLength(0);
    await expect(blobs.put("../escape.png", Buffer.from("x"), "image/png")).rejects.toThrow(/escapes/);
    await blobs.delete("evidence/a/1.png");
    expect(existsSync(path.join(dir, "evidence/a/1.png"))).toBe(false);
  });

  it("online backup produces a readable copy", async () => {
    const { dir, repo } = fresh();
    await repo.setRole("b@example.com", "viewer");
    await repo.backup(path.join(dir, "backup.db"));
    const copy = new SqliteRepo(path.join(dir, "backup.db"));
    expect(await copy.getRole("b@example.com")).toBe("viewer");
  });
});
