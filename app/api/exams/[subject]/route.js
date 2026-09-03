import { getAccessContext, accessDeniedResponse } from "../../../../lib/access";
import { getExamState, startExam } from "../../../../lib/exams";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { session, access, active } = await getAccessContext();
    if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
    if (!active) return accessDeniedResponse(access);
    const { subject } = await params;
    return Response.json(await getExamState(session.id, subject), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Erro ao carregar simulado:", error);
    return Response.json({ error: "Não foi possível carregar o simulado." }, { status: 500 });
  }
}

export async function POST(_request, { params }) {
  try {
    const { session, access, active } = await getAccessContext();
    if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
    if (!active) return accessDeniedResponse(access);
    const { subject } = await params;
    const result = await startExam(session.id, subject);
    return Response.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("Erro ao iniciar simulado:", error);
    return Response.json({ error: "Não foi possível iniciar o simulado." }, { status: 500 });
  }
}
