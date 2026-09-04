import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import { getTodayStudyPlan } from "../../lib/study-engine";
import StudentHeader from "../components/StudentHeader";
import styles from "./hoje.module.css";

export const dynamic = "force-dynamic";

export default async function HojePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/hoje");

  const entitlement = await getEntitlement(session.id);
  if (!entitlement.active && !entitlement.trial) redirect("/comprar?locked=inactive");

  const plan = await getTodayStudyPlan(session.id);

  return (
    <>
      <StudentHeader active="hoje" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <span>PLANO ADAPTATIVO</span>
            <h1>Hoje para você</h1>
            <p>
              Uma sessão de estudo montada a partir do seu desempenho, erros e meta diária.
            </p>
          </div>
          <div className={styles.goal}>
            <strong>{plan.goal.daily_minutes}</strong>
            <span>minutos planejados</span>
          </div>
        </section>

        <section className={styles.tasks}>
          {plan.tasks.map((task, index) => (
            <a href={task.href} className={styles.task} key={`${task.type}-${index}`}>
              <div className={styles.order}>{index + 1}</div>
              <div>
                <span>{task.minutes} MIN</span>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
              </div>
              <b>Começar →</b>
            </a>
          ))}
        </section>

        <section className={styles.split}>
          <article className={styles.panel}>
            <span>PRIORIDADES</span>
            <h2>Pontos que merecem atenção</h2>
            {plan.weak_topics.length ? (
              <ol>
                {plan.weak_topics.map((topic) => (
                  <li key={`${topic.subject}-${topic.topic_code}-${topic.topic}`}>
                    <div>
                      <strong>{topic.topic}</strong>
                      <small>{topic.subject_label}</small>
                    </div>
                    <b>{topic.errors} erros · {topic.accuracy}%</b>
                  </li>
                ))}
              </ol>
            ) : (
              <p>Responda algumas questões para o plano começar a se adaptar ao seu desempenho.</p>
            )}
          </article>

          <article className={styles.panel}>
            <span>BASE DE QUESTÕES</span>
            <h2>{plan.total_question_bank.toLocaleString("pt-BR")}</h2>
            <p>questões disponíveis nos bancos atuais da plataforma.</p>
            <a href="/simulado">Ir para simulados →</a>
          </article>
        </section>
      </main>
    </>
  );
}
