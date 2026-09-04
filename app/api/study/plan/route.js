import { getSession } from "../../../../lib/auth";
import { getEntitlement } from "../../../../lib/entitlement";
import { getTodayStudyPlan } from "../../../../lib/study-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });

  const entitlement = await getEntitlement(session.id);
  if (!entitlement.active && !entitlement.trial) {
    return Response.json({ error: "Acesso não disponível." }, { status: 403 });
  }

  return Response.json(await getTodayStudyPlan(session.id), {
    headers: { "Cache-Control": "private, no-store" },
  });
}
