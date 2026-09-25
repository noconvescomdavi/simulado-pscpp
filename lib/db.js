import pg from "pg";
const { Pool } = pg;

const globalForDb = globalThis;
const rawConnectionString = String(process.env.DATABASE_URL || "");
const isLocalDatabase = /(?:localhost|127\.0\.0\.1|host\.docker\.internal)/i.test(rawConnectionString);
const connectionString = rawConnectionString.replace(/([?&])sslmode=(prefer|require|verify-ca)(?=&|$)/i, "$1sslmode=verify-full");

export const db = globalForDb.__pscppPool || new Pool({
  connectionString,
  // PostgreSQL local não usa TLS por padrão. Bancos remotos de produção continuam exigindo certificado válido.
  ssl: isLocalDatabase ? false : (process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined),
  max: Number.parseInt(process.env.DB_POOL_MAX || (isLocalDatabase ? "10" : "2"), 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000,
  query_timeout: 20000,
  statement_timeout: 20000
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
