import { getSession } from "../../../../../lib/auth";
import { getEntitlement } from "../../../../../lib/entitlement";
import { finishExam } from "../../../../../lib/exams";
import { normalizeSubject, TRIAL_SUBJECT_SLUG } from "../../../../../lib/subjects";

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
    const reason = ["manual", "timeout", "completed"].includes(body.reason)
      ? body.reason
      : "manual";

    const result = await finishExam(
      session.id,
      subject,
      String(body.session_id || ""),
      reason
    );

    return Response.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("Erro ao finalizar simulado:", error);
    return Response.json({ error: "NÃ£o foi possÃ­vel finalizar o simulado." }, { status: 500 });
  }
}