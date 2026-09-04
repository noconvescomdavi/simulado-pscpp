import { getSession } from "../../../../../lib/auth";
import { getEntitlement } from "../../../../../lib/entitlement";
import { submitExamAnswer } from "../../../../../lib/exams";
import { normalizeSubject, TRIAL_SUBJECT_SLUG } from "../../../../../lib/subjects";

const ANSWERS = new Set(["A", "B", "C", "D", "E"]);

export async function POST(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "NÃ£o autenticado." }, { status: 401 });

    const { subject: rawSubject } = await params;
    const subject = normalizeSubject(rawSubject);
    const entitlement = await getEntitlement(session.id);
    const trialAllowed = entitlement.trial && subject === TRIAL_SUBJECT_SLUG;

    if (!entitlement.active && !trialAllowed) {
      return Response.json({ error: "Acesso nÃ£o liberado." }, { status: 403 });
    }

    const body = await request.json();
    const selectedAnswer = String(body.selected_answer || "").toUpperCase();
    if (!ANSWERS.has(selectedAnswer)) {
      return Response.json({ error: "Selecione uma alternativa vÃ¡lida." }, { status: 400 });
    }

    const responseTimeMs = Math.max(
      0,
      Math.min(14_400_000, Math.trunc(Number(body.response_time_ms) || 0))
    );

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
    return Response.json({ error: "NÃ£o foi possÃ­vel salvar a resposta." }, { status: 500 });
  }
}