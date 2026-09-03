import { accessDeniedResponse, getAccessContext } from "../../../../lib/access";
import { publicQuestionBank } from "../../../../lib/question-banks";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { session, access, active } = await getAccessContext();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  if (!active) return accessDeniedResponse(access);

  const { subject } = await params;
  const bank = publicQuestionBank(subject);
  if (!bank) return Response.json({ error: "Matéria sem banco de questões" }, { status: 404 });

  return Response.json(bank, { headers: { "Cache-Control": "private, no-store" } });
}
