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
         when auth_rate_limits.window_started_at < now()-($4::int * interval '1 second') then 1
         else auth_rate_limits.attempts+1
       end,
       window_started_at=case
         when auth_rate_limits.window_started_at < now()-($4::int * interval '1 second') then now()
         else auth_rate_limits.window_started_at
       end,
       updated_at=now()
     returning attempts, window_started_at + ($4::int * interval '1 second') as reset_at`,
    [action, keyHash, limit, windowSeconds]
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
