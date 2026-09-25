import pg from "pg";
import fs from "node:fs";
import path from "node:path";
const { Pool } = pg;

const globalForDb = globalThis;
const desktop = process.env.PSCPP_DESKTOP === "1";

function normalizeResult(result) {
  return {
    ...result,
    rows: result?.rows || [],
    rowCount: Number.isInteger(result?.rowCount) ? result.rowCount :
      Number.isInteger(result?.affectedRows) ? result.affectedRows : (result?.rows?.length || 0)
  };
}

async function createDesktopDb() {
  const { PGlite } = await import("@electric-sql/pglite");
  const dataDir = process.env.PSCPP_DATA_DIR || path.join(process.cwd(), ".pscpp-desktop");
  fs.mkdirSync(dataDir, { recursive: true });
  const engine = new PGlite(path.join(dataDir, "pscpp"));
  await engine.waitReady;
  await engine.exec(`CREATE TABLE IF NOT EXISTS pscpp_desktop_migrations (
    filename TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  const migrationsDir = process.env.PSCPP_MIGRATIONS_DIR || path.join(process.cwd(), "db", "migrations");
  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir).filter(x => x.endsWith(".sql")).sort((a,b)=>a.localeCompare(b, "en", {numeric:true}));
    for (const filename of files) {
      const done = await engine.query("SELECT 1 FROM pscpp_desktop_migrations WHERE filename=$1", [filename]);
      if (done.rows.length) continue;
      const sql = fs.readFileSync(path.join(migrationsDir, filename), "utf8");
      await engine.exec(sql);
      await engine.query("INSERT INTO pscpp_desktop_migrations(filename) VALUES($1)", [filename]);
    }
  }
  return engine;
}

const desktopDbPromise = desktop
  ? (globalForDb.__pscppDesktopDbPromise || createDesktopDb())
  : null;
if (desktop) globalForDb.__pscppDesktopDbPromise = desktopDbPromise;

const connectionString = String(process.env.DATABASE_URL || "").replace(/([?&])sslmode=(prefer|require|verify-ca)(?=&|$)/i, "$1sslmode=verify-full");

export const db = desktop ? {
  async connect() {
    const engine = await desktopDbPromise;
    return { query: async (text, params=[]) => normalizeResult(await engine.query(text, params)), release() {} };
  },
  async query(text, params=[]) {
    const engine = await desktopDbPromise;
    return normalizeResult(await engine.query(text, params));
  }
} : (globalForDb.__pscppPool || new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined,
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000,
  query_timeout: 20000,
  statement_timeout: 20000
}));

if (!desktop) globalForDb.__pscppPool = db;

export async function query(text, params=[]) {
  if (desktop) return db.query(text, params);
  const client = await db.connect();
  try { return await client.query(text, params); }
  finally { client.release(); }
}

export async function withTransaction(callback) {
  if (desktop) {
    const engine = await desktopDbPromise;
    return engine.transaction(async tx => {
      const client = { query: async (text, params=[]) => normalizeResult(await tx.query(text, params)), release() {} };
      return callback(client);
    });
  }
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
