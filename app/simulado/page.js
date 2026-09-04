import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import { query } from "../../lib/db";
import {
  SUBJECTS,
  ALL_SUBJECTS_SLUG,
  TRIAL_SUBJECT_SLUG,
  subjectLabel
} from "../../lib/subjects";
import { availableQuestionBanks } from "../../lib/question-banks";
import StudentHeader from "../components/StudentHeader";
import styles from "./simulados.module.css";

const STATUS = {
  in_progress: "Em andamento",
  completed: "ConcluÃ­do",
  expired: "Tempo encerrado",
  abandoned: "Encerrado"
};

function percent(correct, answered) {
  const total = Number(answered || 0);
  return total ? Math.round((Number(correct || 0) / total) * 10000) / 100 : 0;
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  const entitlement = await getEntitlement(session.id);
  if (!entitlement.active && !entitlement.trial) redirect("/comprar");

  const history = await query(
    `select *
       from exam_sessions
      where user_id=$1
      order by started_at desc`,
    [session.id]
  );

  const questionBanks = availableQuestionBanks();
  const questionCountBySlug = Object.fromEntries(
    questionBanks.map((bank) => [bank.slug, Number(bank.count || 0)])
  );
  const totalQuestionCount = questionBanks.reduce(
    (total, bank) => total + Number(bank.count || 0), 0
  );

  const trialInProgress = history.rows.some(
    (exam) => exam.subject === TRIAL_SUBJECT_SLUG && exam.status === "in_progress"
  );
  const trialConsumed = history.rows.some(
    (exam) => exam.subject === TRIAL_SUBJECT_SLUG && exam.status !== "in_progress"
  );

  const choices = entitlement.active
    ? [{slug:ALL_SUBJECTS_SLUG,label:"Todas as matÃ©rias"}, ...SUBJECTS]
    : [{slug:TRIAL_SUBJECT_SLUG,label:"Simulado de teste grÃ¡tis"}];

  function cardDescription(item) {
    if (entitlement.trial) return "10 questÃµes aleatÃ³rias entre as matÃ©rias Â· uma Ãºnica emissÃ£o";
    if (item.slug === ALL_SUBJECTS_SLUG) {
      return `${totalQuestionCount.toLocaleString("pt-BR")} questÃµes no banco Â· 100 questÃµes aleatÃ³rias de todas as matÃ©rias Â· 240 minutos`;
    }
    const count = questionCountBySlug[item.slug] ?? 0;
    const examSize = Math.min(100, count);
    return `${count.toLocaleString("pt-BR")} questÃµes no banco Â· simulado com ${examSize} questÃµes Â· 240 minutos`;
  }

  return (
    <>
      <StudentHeader active="simulados" />
      <main className={styles.page}>
        <span>PROVAS</span>
        <h1>Simulados</h1>
        <p>
          {entitlement.trial
            ? "Teste grÃ¡tis: vocÃª pode emitir 1 simulado com 10 questÃµes aleatÃ³rias entre as matÃ©rias disponÃ­veis."
            : "Escolha uma matÃ©ria ou gere um simulado misto com 100 questÃµes aleatÃ³rias de todas as matÃ©rias."}
        </p>

        <section className={styles.launch}>
          {choices.map((item) => {
            const href =
              entitlement.trial && trialConsumed && !trialInProgress
                ? "/teste-gratis-excedido?recurso=simulado"
                : `/simulado/${item.slug}`;

            return (
              <a key={item.slug} href={href}>
                <b>{item.label}</b>
                <small>{cardDescription(item)}</small>
              </a>
            );
          })}
        </section>

        <h2>Todos os simulados lanÃ§ados</h2>
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
                      {new Date(exam.started_at).toLocaleString("pt-BR")} Â· {STATUS[exam.status] || exam.status}
                    </small>
                  </div>
                  <strong>{correct}/{answered} Â· {percent(correct, answered).toFixed(1)}%</strong>
                  <span>{inProgress ? "Continuar â†’" : "Acessar â†’"}</span>
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