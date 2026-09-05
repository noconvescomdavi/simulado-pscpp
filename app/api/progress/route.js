import { getSession } from "../../../lib/auth";
import { query } from "../../../lib/db";
import { normalizeSubject } from "../../../lib/subjects";

function safeWholeNumber(value, maximum = 100000) {
  return Math.max(0, Math.min(maximum, Math.trunc(Number(value) || 0)));
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const result = await query(
    "select subject,percent,completed_items,total_items,updated_at from study_progress where user_id=$1 order by subject",
    [session.id]
  );

  return Response.json(
    { progress: result.rows },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const subject = normalizeSubject(body.subject);
  const completedItems = safeWholeNumber(body.completed_items);
  const totalItems = safeWholeNumber(body.total_items);

  if (!totalItems || completedItems > totalItems) {
    return Response.json(
      { error: "Progresso inválido." },
      { status: 400 }
    );
  }

  const percent = Math.round((completedItems / totalItems) * 10000) / 100;

  await query(
    `insert into study_progress(user_id,subject,percent,completed_items,total_items)
     values($1,$2,$3,$4,$5)
     on conflict(user_id,subject) do update set
       percent=excluded.percent,
       completed_items=excluded.completed_items,
       total_items=excluded.total_items,
       updated_at=now()`,
    [session.id, subject, percent, completedItems, totalItems]
  );

  return Response.json({ ok: true, percent });
}
