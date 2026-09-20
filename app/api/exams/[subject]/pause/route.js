import { getSession } from "../../../../../lib/auth";
import { getEntitlement } from "../../../../../lib/entitlement";
import { setExamPaused } from "../../../../../lib/exams";
import { normalizeSubject, TRIAL_SUBJECT_SLUG } from "../../../../../lib/subjects";
import { assertSameOrigin } from "../../../../../lib/security";
import { recordAppError } from "../../../../../lib/observability";

export async function POST(request, { params }) {
  try { await assertSameOrigin(); } catch (error) {
    return Response.json({ error: "Origem inválida." }, { status: Number(error?.status) || 403 });
  }

  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });

    const { subject: rawSubject } = await params;
    const subject = normalizeSubject(rawSubject);
    const entitlement = await getEntitlement(session.id);
    const trialAllowed = entitlement.trial && subject === TRIAL_SUBJECT_SLUG;
    if (!entitlement.active && !trialAllowed) {
      return Response.json({ error: "Acesso não liberado." }, { status: 403 });
    }

    const body = await request.json();
    const action = body.action === "resume" ? "resume" : body.action === "pause" ? "pause" : null;
    if (!action) return Response.json({ error: "Ação inválida." }, { status: 400 });

    const result = await setExamPaused(
      session.id,
      subject,
      String(body.session_id || ""),
      action
    );
    return Response.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("Erro ao pausar ou continuar simulado:", error);
    await recordAppError("/api/exams/[subject]/pause", error);
    return Response.json({ error: "Não foi possível atualizar a pausa do simulado." }, { status: 500 });
  }
}
