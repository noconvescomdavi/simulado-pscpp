import pg from "pg";
const { Pool } = pg;

const globalForFlashcardsDb = globalThis;

export function buildFlashcardsConnectionString() {
  const base = process.env.DATABASE_URL;
  if (!base) {
    throw new Error("DATABASE_URL não configurada.");
  }

  const url = new URL(base);
  url.pathname = "/flashcards";
  // The academic and flashcards databases live in the same Neon project.
  // A stale copied FLASHCARDS_DATABASE_URL must not silently query neondb or
  // an old project after DATABASE_URL is migrated.
  const configured = process.env.FLASHCARDS_DATABASE_URL;
  if (configured) {
    const candidate = new URL(configured);
    if (candidate.hostname === url.hostname && candidate.pathname === "/flashcards") {
      candidate.searchParams.set("sslmode", "verify-full");
      return candidate.toString();
    }
  }
  url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}

function getPool() {
  if (globalForFlashcardsDb.__estibordoFlashcardsPool) {
    return globalForFlashcardsDb.__estibordoFlashcardsPool;
  }

  const pool = new Pool({
    connectionString: buildFlashcardsConnectionString(),
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 4000,
    query_timeout: 20000,
  });

  globalForFlashcardsDb.__estibordoFlashcardsPool = pool;

  return pool;
}

export async function flashQuery(text, params = []) {
  const client = await getPool().connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function withFlashTransaction(callback) {
  const client = await getPool().connect();
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
