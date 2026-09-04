import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getUserAccess } from "../../lib/access";
import { query } from "../../lib/db";
import { SUBJECTS, subjectLabel } from "../../lib/subjects";
import StudentHeader from "../components/StudentHeader";
import styles from "./simulados.module.css";

const STATUS = {
  in_progress: "Em andamento",
  completed: "Concluído",
  expired: "Tempo encerrado",
  abandoned: "Encerrado",
};

function percent(correct, answered) {
  const total = Number(answered || 0);
  return total ? Math.round((Number(correct || 0) / total) * 10000) / 100 : 0;
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!(await getUserAccess(session.id))?.active) redirect("/comprar");

  const history = await query(
    `select * from exam_sessions where user_id=$1 order by started_at desc`,
    [session.id]
  );

  return (
    <>
      <StudentHeader active="simulados" />
      <main className={styles.page}>
        <span>PROVAS</span>
        <h1>Simulados</h1>
        <p>Os simulados são emitidos pelo servidor, salvos no PostgreSQL e permanecem disponíveis no histórico.</p>

        <section className={styles.launch}>
          {SUBJECTS.map((subject) => (
            <a key={subject.slug} href={`/simulado/${subject.slug}`}>
              <b>{subject.label}</b>
              <small>Até 100 questões · 240 minutos</small>
            </a>
          ))}
        </section>

        <h2>Todos os simulados lançados</h2>
        <div className={styles.history}>
          {history.rows.length ? (
            history.rows.map((exam) => {
              const inProgress = exam.status === "in_progress";
              const href = inProgress
                ? `/simulado/${exam.subject}`
                : `/simulado/tentativa/${exam.id}`;
              const answered = Number(exam.answered_count || 0);
              const correct = Number(exam.correct_count || 0);
              return (
                <a href={href} key={exam.id}>
                  <div>
                    <b>{subjectLabel(exam.subject)}</b>
                    <small>
                      {new Date(exam.started_at).toLocaleString("pt-BR")} · {STATUS[exam.status] || exam.status}
                    </small>
                  </div>
                  <strong>
                    {correct}/{answered} · {percent(correct, answered).toFixed(1)}%
                  </strong>
                  <span>{inProgress ? "Continuar →" : "Acessar →"}</span>
                </a>
              );
            })
          ) : (
            <p>Nenhum simulado ainda.</p>
          )}
        </div>
      </main>
    </>
  );
}
