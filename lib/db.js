import pg from "pg";
const { Pool } = pg;

const globalForDb = globalThis;

export const db = globalForDb.__pscppPool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  max: 5,
  idleTimeoutMillis: 30000
});

if (process.env.NODE_ENV !== "production") globalForDb.__pscppPool = db;

export async function query(text, params=[]) {
  const client = await db.connect();
  try { return await client.query(text, params); }
  finally { client.release(); }
}
