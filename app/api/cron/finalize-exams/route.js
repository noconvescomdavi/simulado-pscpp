import { timingSafeEqual } from "node:crypto";
import { finalizeExpiredExams } from "../../../../lib/exams";

export const dynamic = "force-dynamic";

function safeEqual(value, expected) {
  const left = Buffer.from(String(value || ""));
  const right = Buffer.from(String(expected || ""));
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || !safeEqual(authorization, `Bearer ${secret}`)) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }
  const results = await finalizeExpiredExams();
  return Response.json({ ok: true, finalized: results.length });
}
