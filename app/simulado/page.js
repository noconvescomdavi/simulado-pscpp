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
  completed: "Concluído",
  expired: "Tempo encerrado",
  abandoned: "Encerrado"
};

function percent(correct, answered) {
  const total = Number(answered || 0);

  return total
    ? Math.round((Number(correct || 0) / total) * 10000) / 100
    : 0;
}

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const entitlement = await getEntitlement(session.id);

  if (!entitlement.active && !entitlement.trial) {
    redirect("/comprar");
  }

  const history = await query(
    `select *
       from exam_sessions
      where user_id=$1
      order by started_at desc`,
    [session.id]
  );

  /*
   * Quantidades reais dos bancos de questões.
   * Os números são obtidos diretamente dos mesmos JSONs
   * utilizados para gerar os simulados.
   */
  const questionBanks = availableQuestionBanks();

  const questionCountBySlug = Object.fromEntries(
    questionBanks.map((bank) => [
      bank.slug,
      Number(bank.count || 0)
    ])
  );

  const totalQuestionCount = questionBanks.reduce(
    (total, bank) => total + Number(bank.count || 0),
    0
  );

  const choices = entitlement.active
    ? [
        {
          slug: ALL_SUBJECTS_SLUG,
          label: "Todas as matérias"
        },
        ...SUBJECTS
      ]
    : [
        {
          slug: TRIAL_SUBJECT_SLUG,
          label: "Simulado de teste"
        }
      ];

  function cardDescription(item) {
    if (entitlement.trial) {
      return "10 questões · uma única emissão";
    }

    if (item.slug === ALL_SUBJECTS_SLUG) {
      return `${totalQuestionCount.toLocaleString("pt-BR")} questões no banco · 100 questões aleatórias de todas as matérias · 240 minutos`;
    }

    const count = questionCountBySlug[item.slug] ?? 0;
    const examSize = Math.min(100, count);

    return `${count.toLocaleString("pt-BR")} questões no banco · simulado com ${examSize} questões · 240 minutos`;
  }

  return (
    <>
      <StudentHeader active="simulados" />

      <main className={styles.page}>
        <span>PROVAS</span>

        <h1>Simulados</h1>

        <p>
          {entitlement.trial
            ? "Período de testes: você pode emitir 1 simulado com 10 questões."
            : "Escolha uma matéria ou gere um simulado misto com 100 questões aleatórias de todas as matérias."}
        </p>

        <section className={styles.launch}>
          {choices.map((item) => (
            <a
              key={item.slug}
              href={`/simulado/${item.slug}`}
            >
              <b>{item.label}</b>
              <small>{cardDescription(item)}</small>
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
                      {new Date(exam.started_at).toLocaleString("pt-BR")}
                      {" · "}
                      {STATUS[exam.status] || exam.status}
                    </small>
                  </div>

                  <strong>
                    {correct}/{answered}
                    {" · "}
                    {percent(correct, answered).toFixed(1)}%
                  </strong>

                  <span>
                    {inProgress ? "Continuar →" : "Acessar →"}
                  </span>
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
