import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();

  try {
    await query("SELECT 1");
    return Response.json({
      ok: true,
      database: "ok",
      latency_ms: Date.now() - started,
      timestamp: new Date().toISOString(),
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({
      ok: false,
      database: "error",
      timestamp: new Date().toISOString(),
    }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
