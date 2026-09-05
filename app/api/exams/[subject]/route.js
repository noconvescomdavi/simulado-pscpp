import { getSession } from "../../../../lib/auth";
import { getEntitlement } from "../../../../lib/entitlement";
import { query } from "../../../../lib/db";
import { getExamState, startExam } from "../../../../lib/exams";
import { normalizeSubject, TRIAL_SUBJECT_SLUG } from "../../../../lib/subjects";

export const dynamic = "force-dynamic";

async function authorize(subject) {
  const session = await getSession();
  if (!session) {
    return { response: Response.json({ error: "Não autenticado." }, { status: 401 }) };
  }

  const entitlement = await getEntitlement(session.id);
  const normalized = normalizeSubject(subject);
  const trialAllowed = entitlement.trial && normalized === TRIAL_SUBJECT_SLUG;

  if (!entitlement.active && !trialAllowed) {
    return {
      response: Response.json(
        { error: "Acesso não liberado.", code: "ACCESS_DENIED" },
        { status: 403 }
      )
    };
  }

  return { session, entitlement, subject: normalized, trialAllowed };
}

async function trialRow(userId) {
  const result = await query(
    `select id,status
       from exam_sessions
      where user_id=$1 and subject=$2
      order by started_at desc
      limit 1`,
    [userId, TRIAL_SUBJECT_SLUG]
  );
  return result.rows[0] || null;
}

export async function GET(_request, { params }) {
  try {
    const p = await params;
    const ctx = await authorize(p.subject);
    if (ctx.response) return ctx.response;

    const state = await getExamState(ctx.session.id, ctx.subject);

    if (ctx.trialAllowed && state.state === "available") {
      const previous = await trialRow(ctx.session.id);
      if (previous && previous.status !== "in_progress") {
        return Response.json(
          { ...state, can_start:false, trial_exhausted:true },
          { headers: { "Cache-Control": "private, no-store" } }
        );
      }
    }

    return Response.json(state, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Erro ao carregar simulado:", error);
    return Response.json({ error: "Não foi possível carregar o simulado." }, { status: 500 });
  }
}

export async function POST(_request, { params }) {
  try {
    const p = await params;
    const ctx = await authorize(p.subject);
    if (ctx.response) return ctx.response;

    if (ctx.trialAllowed) {
      const previous = await trialRow(ctx.session.id);
      if (previous && previous.status !== "in_progress") {
        return Response.json(
          {
            error: "O Teste Grátis já foi utilizado.",
            code: "TRIAL_LIMIT",
            trial_exhausted: true
          },
          { status: 429 }
        );
      }
    }

    const result = await startExam(ctx.session.id, ctx.subject);
    return Response.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("Erro ao iniciar simulado:", error);
    return Response.json({ error: "Não foi possível iniciar o simulado." }, { status: 500 });
  }
}