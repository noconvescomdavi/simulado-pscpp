import questionBank from "../../../../data/questions/manobrabilidade.json";
import { getSession } from "../../../../lib/auth";
import { query } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const access = await query(
    "select status from user_access where user_id=$1 and product_code='pscpp-vitalicio'",
    [session.id]
  );

  if (access.rows[0]?.status !== "active") {
    return Response.json({ error: "Licença inativa" }, { status: 403 });
  }

  return Response.json(questionBank, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
