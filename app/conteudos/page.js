import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import { getUserMetrics } from "../../lib/metrics";
import { listFlashcardDecks } from "../../lib/flashcards";
import { SUBJECTS } from "../../lib/subjects";
import StudentHeader from "../components/StudentHeader";
import styles from "./conteudos.module.css";

function pct(value) {
  const n = Number(value || 0);
  return Math.max(0, Math.min(100, Math.round(n * 10) / 10));
}

function subjectNumber(index) {
  return ["I","II","III","IV","V","VI","VII"][index] || String(index + 1);
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login?next=/conteudos");

  const entitlement = await getEntitlement(session.id);
  if (!entitlement.active && !entitlement.trial) {
    redirect("/comprar?locked=inactive");
  }

  const [metrics, allDecks] = await Promise.all([
    getUserMetrics(session.id),
    listFlashcardDecks(session.id),
  ]);

  const decks = entitlement.trial
    ? allDecks.filter((deck) => deck.slug === "cis")
    : allDecks;

  const overall = metrics.overall;
  const overallAccuracy = pct(overall.accuracy);
  const overallErrorRate = pct(overall.questions ? (overall.errors / overall.questions) * 100 : 0);

  return (
    <>
      <StudentHeader active="conteudos" />

      <main className={styles.page}>
        <section className={styles.hero}>
          <span>CENTRAL DE ESTUDOS</span>
          <h1>Estudar por Matéria</h1>
          <p>
            Acesse questões, simulados, flashcards e acompanhe seu desempenho por disciplina.
          </p>

          {entitlement.trial && (
            <div className={styles.trialNotice}>
              Seu teste grátis inclui 1 simulado de 10 questões, 1 caderno de 10 questões e o Flashcard CIS.
            </div>
          )}
        </section>

        <section className={styles.overallSection}>
          <div className={styles.sectionHead}>
            <div>
              <span>VISÃO GERAL</span>
              <h2>Métricas de todas as matérias</h2>
              <p>Os percentuais são calculados sobre o total de questões respondidas.</p>
            </div>
          </div>

          <div className={styles.overallGrid}>
            <article className={styles.metricCard}>
              <span>Questões respondidas</span>
              <strong>{Number(overall.questions || 0).toLocaleString("pt-BR")}</strong>
              <small>Total acumulado</small>
            </article>

            <article className={styles.metricCard}>
              <span>Acertos</span>
              <strong>{Number(overall.correct || 0).toLocaleString("pt-BR")}</strong>
              <small>{overallAccuracy}% das respostas</small>
            </article>

            <article className={styles.metricCard}>
              <span>Erros</span>
              <strong>{Number(overall.errors || 0).toLocaleString("pt-BR")}</strong>
              <small>{overallErrorRate}% das respostas</small>
            </article>

            <article className={styles.metricCard}>
              <span>Aproveitamento</span>
              <strong>{overallAccuracy}%</strong>
              <small>Acertos ÷ questões respondidas</small>
            </article>
          </div>

          <div className={styles.chartsGrid}>
            <article className={styles.donutCard}>
              <div>
                <span>DISTRIBUIÇÃO GERAL</span>
                <h3>Acertos x Erros</h3>
              </div>

              <div className={styles.donutWrap}>
                <div
                  className={styles.donut}
                  style={{
                    background: `conic-gradient(#18c98a 0 ${overallAccuracy}%, #ef5365 ${overallAccuracy}% 100%)`,
                  }}
                >
                  <div>
                    <strong>{overallAccuracy}%</strong>
                    <small>acerto</small>
                  </div>
                </div>

                <div className={styles.legend}>
                  <span><i className={styles.correctDot}></i> Acertos: {overall.correct}</span>
                  <span><i className={styles.errorDot}></i> Erros: {overall.errors}</span>
                  <span><i className={styles.totalDot}></i> Respondidas: {overall.questions}</span>
                </div>
              </div>
            </article>

            <article className={styles.subjectChartCard}>
              <div>
                <span>COMPARATIVO</span>
                <h3>Aproveitamento por matéria</h3>
              </div>

              <div className={styles.subjectChart}>
                {metrics.subjects.map((subject) => {
                  const accuracy = pct(subject.accuracy);
                  return (
                    <div className={styles.chartRow} key={subject.slug}>
                      <div className={styles.chartLabel}>
                        <strong>{subject.label}</strong>
                        <span>{subject.questions} respondidas</span>
                      </div>
                      <div className={styles.chartTrack}>
                        <i style={{ width: `${accuracy}%` }} />
                      </div>
                      <b>{accuracy}%</b>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>

        <section className={styles.subjectsSection}>
          <div className={styles.sectionHead}>
            <div>
              <span>DISCIPLINAS</span>
              <h2>Central de Estudos</h2>
              <p>Escolha uma matéria para estudar e acompanhe seus resultados.</p>
            </div>
          </div>

          <div className={styles.subjectGrid}>
            {SUBJECTS.map((subject, index) => {
              const metric = metrics.subjects.find((item) => item.slug === subject.slug) || {};
              const accuracy = pct(metric.accuracy);
              const errorRate = pct(metric.questions ? (metric.errors / metric.questions) * 100 : 0);
              const relatedDecks = decks.filter((deck) => deck.subject_slug === subject.slug);

              return (
                <article className={styles.subjectCard} key={subject.slug}>
                  <div className={styles.subjectTop}>
                    <span>{subjectNumber(index)}</span>
                    <div>
                      <h3>{subject.label}</h3>
                      <p>{metric.questions || 0} questões respondidas</p>
                    </div>
                  </div>

                  <div className={styles.miniMetrics}>
                    <div><span>Acertos</span><strong>{metric.correct || 0}</strong></div>
                    <div><span>Erros</span><strong>{metric.errors || 0}</strong></div>
                    <div><span>Aproveitamento</span><strong>{accuracy}%</strong></div>
                  </div>

                  <div className={styles.dualBars}>
                    <div>
                      <span><b>Acertos</b><em>{accuracy}%</em></span>
                      <div><i className={styles.correctBar} style={{width:`${accuracy}%`}} /></div>
                    </div>
                    <div>
                      <span><b>Erros</b><em>{errorRate}%</em></span>
                      <div><i className={styles.errorBar} style={{width:`${errorRate}%`}} /></div>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <a href={`/conteudos/banco-de-questoes?materia=${subject.slug}`}>Banco de Questões</a>
                    <a href={`/simulado/${subject.slug}`}>Gerar Simulado</a>
                    {relatedDecks.map((deck) => (
                      <a href={`/flashcards/${deck.slug}`} key={deck.id}>{deck.title}</a>
                    ))}
                    {!relatedDecks.length && (
                      <a href="/flashcards">Flashcards</a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
