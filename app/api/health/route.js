import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("shallow") === "1") {
    return Response.json(
      { ok: true, service: "estibordo", mode: "shallow" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const started = Date.now();
  try {
    await query("SELECT 1");
    return Response.json({
      ok: true,
      service: "estibordo",
      database: "ok",
      latency_ms: Date.now() - started,
      timestamp: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({
      ok: false,
      service: "estibordo",
      database: "error",
      timestamp: new Date().toISOString(),
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
