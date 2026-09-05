import { redirect } from "next/navigation";
import { getSession } from "../../../lib/auth";
import { getEntitlement } from "../../../lib/entitlement";
import { getErrorNotebook } from "../../../lib/study-engine";
import StudentHeader from "../../components/StudentHeader";
import styles from "./errors.module.css";

export const dynamic = "force-dynamic";

export default async function ErrorNotebookPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/conteudos/caderno-de-erros");

  const entitlement = await getEntitlement(session.id);
  if (!entitlement.active && !entitlement.trial) redirect("/comprar?locked=inactive");

  const items = await getErrorNotebook(session.id, 100);

  return (
    <>
      <StudentHeader active="conteudos" />
      <main className={styles.page}>
        <span>REVISÃO INTELIGENTE</span>
        <h1>Caderno de erros</h1>
        <p className={styles.intro}>
          As questões que você errou aparecem aqui automaticamente, ordenadas por recorrência.
        </p>

        <div className={styles.summary}>
          <div><b>{items.length}</b><span>questões para revisar</span></div>
          <div><b>{items.filter((x) => x.recovered).length}</b><span>já tiveram recuperação</span></div>
          <div><b>{items.reduce((sum, x) => sum + x.errors, 0)}</b><span>erros acumulados</span></div>
        </div>

        <section className={styles.list}>
          {items.length ? items.map((item) => (
            <article className={styles.card} key={`${item.subject}-${item.question_id}`}>
              <div className={styles.top}>
                <div>
                  <span>{item.subject_label}</span>
                  <h2>{item.topic}</h2>
                  <small>{item.module}{item.topic_code ? ` · ${item.topic_code}` : ""}</small>
                </div>
                <div className={styles.metrics}>
                  <b>{item.errors} erros</b>
                  <small>{item.accuracy}% de acerto</small>
                </div>
              </div>

              <p className={styles.question}>{item.question}</p>

              {item.explanation && (
                <details>
                  <summary>Ver explicação</summary>
                  <p>{item.explanation}</p>
                </details>
              )}

              <div className={styles.actions}>
                <a href={`/conteudos/banco-de-questoes?subject=${encodeURIComponent(item.subject)}`}>
                  Treinar esta matéria →
                </a>
                <a href={`/study-content/simulado/${item.subject}/`}>
                  Revisar conteúdo →
                </a>
                <a href={`/mapas-mentais?subject=${encodeURIComponent(item.subject)}&title=${encodeURIComponent(`Erro — ${item.topic}`)}&note=${encodeURIComponent((`Questão: ${item.question}\n\nMinha anotação:`).slice(0,700))}`}>
                  🧠 Criar mapa desta questão →
                </a>
              </div>
            </article>
          )) : (
            <div className={styles.empty}>
              Nenhum erro registrado ainda. Conforme você responder questões, este caderno será preenchido automaticamente.
            </div>
          )}
        </section>
      </main>
    </>
  );
}
