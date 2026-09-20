import pg from "pg";
const { Pool } = pg;

const globalForDb = globalThis;
const connectionString = String(process.env.DATABASE_URL || "").replace(/([?&])sslmode=(prefer|require|verify-ca)(?=&|$)/i, "$1sslmode=verify-full");

export const db = globalForDb.__pscppPool || new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined,
  max: 5,
  idleTimeoutMillis: 30000
});

globalForDb.__pscppPool = db;

export async function query(text, params=[]) {
  const client = await db.connect();
  try { return await client.query(text, params); }
  finally { client.release(); }
}

export async function withTransaction(callback) {
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