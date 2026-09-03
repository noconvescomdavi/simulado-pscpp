import { accessDeniedResponse, getAccessContext } from "../../../../lib/access";
import { publicQuestionBank } from "../../../../lib/question-banks";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, access, active } = await getAccessContext();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  if (!active) return accessDeniedResponse(access);

  return Response.json(publicQuestionBank("manobrabilidade"), {
    headers: { "Cache-Control": "private, no-store" },
  });
}
