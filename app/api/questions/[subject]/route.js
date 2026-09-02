import { getSession } from "../../../../lib/auth";
import { query } from "../../../../lib/db";
import { publicQuestionBank } from "../../../../lib/question-banks";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const access = await query(
    "select status from user_access where user_id=$1 and product_code='pscpp-vitalicio'",
    [session.id]
  );
  if (access.rows[0]?.status !== "active") {
    return Response.json({ error: "Licença inativa" }, { status: 403 });
  }

  const { subject } = await params;
  const bank = publicQuestionBank(subject);
  if (!bank) return Response.json({ error: "Matéria sem banco de questões" }, { status: 404 });

  return Response.json(bank, { headers: { "Cache-Control": "private, no-store" } });
}
