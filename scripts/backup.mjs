// Online backup of the SQLite database and the evidence folder (safe while the server runs).
//   DATA_DIR=./data BACKUP_DIR=./backups node scripts/backup.mjs
// Schedule it (cron or a systemd timer) and copy BACKUP_DIR off the server.
import Database from "better-sqlite3";
import { cpSync, mkdirSync, existsSync } from "fs";
import path from "path";

const dataDir = path.resolve(process.env.DATA_DIR || "data");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const out = path.resolve(process.env.BACKUP_DIR || "backups", stamp);
mkdirSync(out, { recursive: true });

const db = new Database(path.join(dataDir, "miraah.db"), { readonly: true });
await db.backup(path.join(out, "miraah.db"));
db.close();
if (existsSync(path.join(dataDir, "evidence"))) cpSync(path.join(dataDir, "evidence"), path.join(out, "evidence"), { recursive: true });
console.log(`Backup written to ${out}`);
