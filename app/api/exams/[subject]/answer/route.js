import { getAccessContext, accessDeniedResponse } from "../../../../../lib/access";
import { submitExamAnswer } from "../../../../../lib/exams";

const ANSWERS = new Set(["A", "B", "C", "D", "E"]);

export async function POST(request, { params }) {
  try {
    const { session, access, active } = await getAccessContext();
    if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
    if (!active) return accessDeniedResponse(access);

    const { subject } = await params;
    const body = await request.json();
    const selectedAnswer = String(body.selected_answer || "").toUpperCase();
    if (!ANSWERS.has(selectedAnswer)) {
      return Response.json({ error: "Selecione uma alternativa válida." }, { status: 400 });
    }

    const responseTimeMs = Math.max(0, Math.min(14_400_000, Math.trunc(Number(body.response_time_ms) || 0)));
    const result = await submitExamAnswer({
      userId: session.id,
      rawSubject: subject,
      sessionId: String(body.session_id || ""),
      questionId: String(body.question_id || ""),
      selectedAnswer,
      responseTimeMs,
    });
    return Response.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("Erro ao salvar resposta do simulado:", error);
    return Response.json({ error: "Não foi possível salvar a resposta." }, { status: 500 });
  }
}
