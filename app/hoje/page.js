import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import { getIntegratedStudyPlan } from "../../lib/integrated-study-plan";
import { getAdaptiveStudySnapshot } from "../../lib/learning-engine";
import StudentHeader from "../components/StudentHeader";
import TrackedStudyLink from "../components/TrackedStudyLink";
import TodayExamCountdown from "./TodayExamCountdown";
import styles from "./hoje.module.css";

export const dynamic = "force-dynamic";

export default async function HojePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/hoje");

  const entitlement = await getEntitlement(session.id);
  if (!entitlement.active && !entitlement.trial) redirect("/comprar?locked=inactive");

  const [integrated,adaptive] = await Promise.all([getIntegratedStudyPlan(session.id,0),getAdaptiveStudySnapshot(session.id)]);
  if(integrated.needs_onboarding) redirect("/plano-de-estudos/configurar");
  const todayIso=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  const today=integrated.week.days.find(d=>d.iso===todayIso);
  const tasks=today?.tasks||[];\n  const plannedMinutes=tasks.reduce((sum,t)=>sum+Number(t.estimate_minutes||0),0);\n  const plan={tasks,goal:{daily_minutes:integrated.onboarding.daily_minutes},weak_topics:integrated.tracking?.weakest_topics||[],total_question_bank:integrated.metrics.total_question_bank||integrated.metrics.overall?.questions||0,study_time:integrated.tracking?.study_time||{},mastery:integrated.tracking?.overall_mastery||0};

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
            <small>PREPARAÇÃO ESTIMADA · {integrated.readiness}%</small>
            <strong>{plannedMinutes}</strong>
            <span>min previstos nas tarefas · capacidade {plan.goal.daily_minutes} min</span>
            <small>{plan.study_time.today_minutes||0} min reais hoje · domínio {Math.round(Number(plan.mastery||0))}%</small>
          </div>
        </section>

        <TodayExamCountdown />

        <section className={styles.tasks} aria-label="Próxima sessão recomendada">
          {adaptive.high_forgetting_risk>0&&<p className={styles.adaptiveNote}>{adaptive.high_forgetting_risk} tópico{adaptive.high_forgetting_risk===1?"":"s"} com risco alto de esquecimento · {adaptive.due_for_review} revisão{adaptive.due_for_review===1?"":"ões"} vencida{adaptive.due_for_review===1?"":"s"}.</p>}
          {plan.tasks.map((task, index) => (
            <TrackedStudyLink href={task.href||"/plano-de-estudos"} className={styles.task} task={{...task,plan_date:todayIso,source:"today"}} key={`${task.type}-${index}`}>
              <div className={styles.order}>{index + 1}</div>
              <div>
                <span>{task.type==="reading"?(task.pages?task.pages+" PÁGINAS":"LEITURA"):task.type==="questions"?"QUESTÕES DE FIXAÇÃO":task.type==="review"?"REVISÃO":task.type==="simulado"?"SIMULADO PSCPP":task.type.toUpperCase()}</span>
                <h2>{task.title}</h2>
                <p>{task.description}</p>{task.reason&&<small>Por quê: {task.reason}.</small>}
              </div>
              <b>Começar →</b>
            </TrackedStudyLink>
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
                    <b>{topic.errors} erros · domínio {Math.round(Number(topic.mastery_score||0))}%</b>
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
            <Link href="/simulado">Ir para simulados →</Link>
          </article>
        </section>
      </main>
    </>
  );
}
