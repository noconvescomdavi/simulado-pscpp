import { getSession } from "../../../lib/auth";
import { query } from "../../../lib/db";
import { normalizeSubject } from "../../../lib/subjects";

function wholeNumber(value, maximum = 10000) {
  return Math.max(0, Math.min(maximum, Math.trunc(Number(value) || 0)));
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  const result = await query(
    `select id,module,subject,score_percent,correct_answers,wrong_answers,
            total_questions,duration_seconds,created_at
     from exam_attempts
     where user_id=$1
     order by created_at desc
     limit 50`,
    [session.id]
  );
  return Response.json({ attempts: result.rows });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const access = await query(
    "select status from user_access where user_id=$1 and product_code='pscpp-vitalicio'",
    [session.id]
  );
  if (access.rows[0]?.status !== "active") {
    return Response.json({ error: "Licença inativa" }, { status: 403 });
  }

  const body = await request.json();
  const correct = wholeNumber(body.correct_answers);
  const errors = wholeNumber(body.wrong_answers);
  const total = correct + errors;
  if (!total) return Response.json({ error: "Prova sem respostas" }, { status: 400 });

  const score = Math.round((correct / total) * 10000) / 100;
  const result = await query(
    `insert into exam_attempts
     (user_id,module,subject,score_percent,correct_answers,wrong_answers,total_questions,duration_seconds)
     values($1,$2,$3,$4,$5,$6,$7,$8)
     returning id,created_at`,
    [
      session.id,
      String(body.module || "Banco completo").slice(0, 120),
      normalizeSubject(body.subject),
      score,
      correct,
      errors,
      total,
      wholeNumber(body.duration_seconds, 86400),
    ]
  );

  return Response.json({ ok: true, attempt: result.rows[0] });
}
