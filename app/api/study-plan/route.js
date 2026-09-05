import { getSession } from "../../../lib/auth";
import {
  getTodayStudyPlan,
  setStudyGoals,
  setTodayStudyPlanTask,
} from "../../../lib/study-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const plan = await getTodayStudyPlan(session.id);
  return Response.json(plan, {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = await request.json();
    const item = await setTodayStudyPlanTask(
      session.id,
      body.task_key,
      body.completed === true
    );
    const plan = await getTodayStudyPlan(session.id);

    return Response.json({ ok: true, item, progress: plan.progress });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Não foi possível atualizar a tarefa." },
      { status: error?.status || 400 }
    );
  }
}


export async function PUT(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = await request.json();
    const goal = await setStudyGoals(session.id, body);
    const plan = await getTodayStudyPlan(session.id);
    return Response.json({ ok: true, goal, plan });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Não foi possível atualizar as metas." },
      { status: 400 }
    );
  }
}
