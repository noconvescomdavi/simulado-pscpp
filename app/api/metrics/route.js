import { getSession } from "../../../lib/auth";
import { getUserMetrics } from "../../../lib/metrics";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  return Response.json(await getUserMetrics(session.id), {
    headers: { "Cache-Control": "private, no-store" },
  });
}
