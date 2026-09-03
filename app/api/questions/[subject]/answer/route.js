import { accessDeniedResponse, getAccessContext } from "../../../../../lib/access";
import { withTransaction } from "../../../../../lib/db";
import { getQuestion } from "../../../../../lib/question-banks";
import { normalizeSubject } from "../../../../../lib/subjects";

const ANSWERS = new Set(["A", "B", "C", "D", "E"]);

export async function POST(request, { params }) {
  const { session, access, active } = await getAccessContext();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  if (!active) return accessDeniedResponse(access);

  const { subject: rawSubject } = await params;
  const subject = normalizeSubject(rawSubject);
  const body = await request.json();
  const questionId = String(body.question_id || "");
  const selectedAnswer = String(body.selected_answer || "").toUpperCase();
  const responseTime = Math.max(0, Math.min(3600000, Number(body.response_time_ms) || 0));

  if (!ANSWERS.has(selectedAnswer)) {
    return Response.json({ error: "Selecione uma alternativa válida" }, { status: 400 });
  }

  const question = getQuestion(subject, questionId);
  if (!question) return Response.json({ error: "Questão não encontrada" }, { status: 404 });

  const isCorrect = selectedAnswer === question.correct_answer;

  await withTransaction(async (client) => {
    await client.query(
      `insert into question_answers
       (user_id,question_id,subject,selected_answer,is_correct,response_time_ms)
       values($1,$2,$3,$4,$5,$6)`,
      [session.id, question.id, subject, selectedAnswer, isCorrect, responseTime]
    );
    await client.query(
      `insert into question_stats
       (user_id,question_id,subject,answer_count,correct_count,error_count,last_answered_at)
       values($1,$2,$3,1,$4,$5,now())
       on conflict(user_id,question_id) do update set
         subject=excluded.subject,
         answer_count=question_stats.answer_count+1,
         correct_count=question_stats.correct_count+excluded.correct_count,
         error_count=question_stats.error_count+excluded.error_count,
         last_answered_at=now()`,
      [session.id, question.id, subject, isCorrect ? 1 : 0, isCorrect ? 0 : 1]
    );
    await client.query(
      `insert into study_days(user_id,study_date,activity_count)
       values($1,current_date,1)
       on conflict(user_id,study_date) do update set
         activity_count=study_days.activity_count+1`,
      [session.id]
    );
  });

  return Response.json({
    ok: true,
    question_id: question.id,
    selected_answer: selectedAnswer,
    correct_answer: question.correct_answer,
    is_correct: isCorrect,
    explanation: question.explanation,
    source: question.source,
  });
}
