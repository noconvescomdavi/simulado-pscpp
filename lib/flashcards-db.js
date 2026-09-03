import pg from "pg";
const { Pool } = pg;

const globalForFlashcardsDb = globalThis;

function buildFlashcardsConnectionString() {
  if (process.env.FLASHCARDS_DATABASE_URL) {
    return process.env.FLASHCARDS_DATABASE_URL;
  }

  const base = process.env.DATABASE_URL;
  if (!base) {
    throw new Error("DATABASE_URL não configurada.");
  }

  const url = new URL(base);
  url.pathname = "/flashcards";
  return url.toString();
}

function getPool() {
  if (globalForFlashcardsDb.__estibordoFlashcardsPool) {
    return globalForFlashcardsDb.__estibordoFlashcardsPool;
  }

  const pool = new Pool({
    connectionString: buildFlashcardsConnectionString(),
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    max: 4,
    idleTimeoutMillis: 30000,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForFlashcardsDb.__estibordoFlashcardsPool = pool;
  }

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
