import { getSession } from "../../../lib/auth";
import { query } from "../../../lib/db";

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

  return Response.json(
    { attempts: result.rows },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

export async function POST() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  return Response.json(
    {
      error: "Endpoint legado desativado. Os resultados de simulados são calculados e persistidos exclusivamente pelo servidor.",
      code: "LEGACY_ATTEMPT_WRITE_DISABLED",
    },
    { status: 410 }
  );
}
