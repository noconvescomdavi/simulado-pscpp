import crypto from "node:crypto";
import { headers } from "next/headers";
import { query } from "./db";

function hash(value) {
  const secret = String(process.env.AUTH_SECRET || "");
  return crypto.createHmac("sha256", secret).update(String(value || "")).digest("hex");
}

export async function clientIpHash() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return hash(ip);
}

export function identityHash(value) {
  return hash(String(value || "").trim().toLowerCase());
}

export async function consumeRateLimit({ action, keyHash, limit, windowSeconds }) {
  const result = await query(
    `insert into auth_rate_limits(action,key_hash,attempts,window_started_at,updated_at)
     values($1,$2,1,now(),now())
     on conflict(action,key_hash) do update set
       attempts=case
         when auth_rate_limits.window_started_at < now()-($3::int * interval '1 second') then 1
         else auth_rate_limits.attempts+1
       end,
       window_started_at=case
         when auth_rate_limits.window_started_at < now()-($3::int * interval '1 second') then now()
         else auth_rate_limits.window_started_at
       end,
       updated_at=now()
     returning attempts, window_started_at + ($3::int * interval '1 second') as reset_at`,
    [action, keyHash, windowSeconds]
  );

  const row = result.rows[0];
  return {
    allowed: Number(row.attempts) <= limit,
    attempts: Number(row.attempts),
    resetAt: row.reset_at,
  };
}

export function rateLimitResponse(result) {
  const retryAfter = Math.max(
    1,
    Math.ceil((new Date(result.resetAt).getTime() - Date.now()) / 1000)
  );
  return Response.json(
    { error: "Muitas tentativas. Tente novamente mais tarde.", code: "RATE_LIMITED" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}


export async function assertSameOrigin() {
  const h = await headers();
  const origin = String(h.get("origin") || "").trim();
  const host = String(h.get("host") || "").trim();
  const fetchSite = String(h.get("sec-fetch-site") || "").trim().toLowerCase();

  if (fetchSite === "cross-site") {
    const error = new Error("Origem inválida.");
    error.status = 403;
    throw error;
  }

  if (!origin || !host) return true;

  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    const error = new Error("Origem inválida.");
    error.status = 403;
    throw error;
  }

  if (originHost !== host) {
    const error = new Error("Origem inválida.");
    error.status = 403;
    throw error;
  }

  return true;
}
