import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getUserAccess } from "../../lib/access";
import { listFlashcardDecks } from "../../lib/flashcards";
import StudentHeader from "../components/StudentHeader";
import styles from "./flashcards.module.css";

export const metadata = {
  title: "Flashcards",
  description: "Flashcards de estudo do ESTIBORDO com métricas independentes.",
};

export default async function FlashcardsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/flashcards");

  const access = await getUserAccess(session.id);
  if (!access?.active) redirect("/comprar?locked=inactive");

  const decks = await listFlashcardDecks(session.id);
  const totals = decks.reduce(
    (acc, deck) => ({
      answered: acc.answered + deck.metrics.answered,
      correct: acc.correct + deck.metrics.correct,
      wrong: acc.wrong + deck.metrics.wrong,
      difficult: acc.difficult + deck.metrics.difficult,
    }),
    { answered: 0, correct: 0, wrong: 0, difficult: 0 }
  );
  const accuracy = totals.answered
    ? Math.round((totals.correct / totals.answered) * 100)
    : 0;

  return (
    <>
      <StudentHeader active="flashcards" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>ESTUDO ATIVO</span>
            <h1>Flashcards</h1>
            <p>
              Revise conteúdos por matéria com repetição de erros, marcação de
              cartões difíceis e modo prova.
            </p>
          </div>
          <div className={styles.metricGrid}>
            <article><span>Respostas</span><strong>{totals.answered}</strong></article>
            <article><span>Acertos</span><strong>{totals.correct}</strong></article>
            <article><span>Erros</span><strong>{totals.wrong}</strong></article>
            <article><span>Aproveitamento</span><strong>{accuracy}%</strong></article>
          </div>
        </section>

        <section className={styles.notice}>
          <strong>Métricas independentes</strong>
          <p>
            O desempenho dos flashcards é armazenado em um banco exclusivo e
            não altera as métricas, notas ou tentativas de provas e simulados.
          </p>
        </section>

        <section className={styles.deckGrid}>
          {decks.map((deck) => (
            <a className={styles.deckCard} href={`/flashcards/${deck.slug}`} key={deck.id}>
              <div className={styles.deckTop}>
                <span>{deck.subject_label}</span>
                <b>{deck.card_count} cartões</b>
              </div>
              <h2>{deck.title}</h2>
              <p>{deck.description}</p>

              <div className={styles.deckMetrics}>
                <div><span>Respondidos</span><strong>{deck.metrics.answered}</strong></div>
                <div><span>Acertos</span><strong>{deck.metrics.correct}</strong></div>
                <div><span>Erros</span><strong>{deck.metrics.wrong}</strong></div>
                <div><span>Aproveitamento</span><strong>{deck.metrics.accuracy}%</strong></div>
              </div>

              <div className={styles.deckAction}>
                <span>Abrir flashcards</span>
                <b>→</b>
              </div>
            </a>
          ))}
        </section>
      </main>
    </>
  );
}
