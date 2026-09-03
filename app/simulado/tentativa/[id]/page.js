import { redirect, notFound } from "next/navigation";
import { getSession } from "../../../../lib/auth";
import { getUserAccess } from "../../../../lib/access";
import { query } from "../../../../lib/db";
import { getQuestion } from "../../../../lib/question-banks";
import { subjectLabel } from "../../../../lib/subjects";
import StudentHeader from "../../../components/StudentHeader";
import styles from "./review.module.css";

function parseQuestionIds(value) {
  if (Array.isArray(value)) return value.map(String);
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function score(correct, answered) {
  return answered ? Math.round((correct / answered) * 10000) / 100 : 0;
}

export default async function Page({ params }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!(await getUserAccess(session.id))?.active) redirect("/comprar");

  const { id } = await params;
  const examResult = await query(
    "select * from exam_sessions where id=$1 and user_id=$2",
    [id, session.id]
  );
  const exam = examResult.rows[0];
  if (!exam) notFound();

  if (exam.status === "in_progress") {
    redirect(`/simulado/${exam.subject}`);
  }

  const answersResult = await query(
    "select * from exam_session_answers where session_id=$1 and user_id=$2 order by position",
    [id, session.id]
  );

  const answerMap = new Map(answersResult.rows.map((answer) => [String(answer.question_id), answer]));
  const ids = parseQuestionIds(exam.question_ids);
  const answered = Number(exam.answered_count || answersResult.rows.length || 0);
  const correct = Number(exam.correct_count || answersResult.rows.filter((x) => x.is_correct).length || 0);
  const percent = score(correct, answered);

  return (
    <>
      <StudentHeader active="simulados" />
      <main className={styles.page}>
        <span>HISTÓRICO</span>
        <h1>{subjectLabel(exam.subject)}</h1>
        <div className={styles.summary}>
          <div><small>Nota</small><strong>{(percent / 10).toFixed(2)}/10</strong></div>
          <div><small>Aproveitamento</small><strong>{percent.toFixed(2)}%</strong></div>
          <div><small>Acertos</small><strong>{correct}</strong></div>
          <div><small>Erros</small><strong>{Math.max(0, answered - correct)}</strong></div>
          <div><small>Respondidas</small><strong>{answered}</strong></div>
          <div><small>Emitidas</small><strong>{ids.length}</strong></div>
        </div>

        <p>
          Iniciado em {new Date(exam.started_at).toLocaleString("pt-BR")}
          {exam.finished_at ? ` · encerrado em ${new Date(exam.finished_at).toLocaleString("pt-BR")}` : ""}.
        </p>

        <section className={styles.questions}>
          {ids.map((questionId, index) => {
            const question = getQuestion(exam.subject, questionId);
            const answer = answerMap.get(String(questionId));
            return (
              <article key={`${questionId}-${index}`}>
                <h2>{index + 1}. {question?.question || questionId}</h2>
                {answer ? (
                  <>
                    <p>
                      Sua resposta: <strong>{answer.selected_answer}</strong> · {answer.is_correct ? "Correta" : "Incorreta"}
                    </p>
                    {question && (
                      <p>Resposta correta: <strong>{question.correct_answer || question.answer || "—"}</strong></p>
                    )}
                    {question?.explanation && <p>{question.explanation}</p>}
                  </>
                ) : (
                  <p className={styles.unanswered}>Não respondida.</p>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}
