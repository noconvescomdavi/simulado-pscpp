import {MarketingShell,styles} from "../../components/MarketingShell";

export const metadata = {
  title: "Simulados | ESTIBORDO",
  description: "Simulados para preparacao ao PSCPP, com provas por materia e questoes de diferentes disciplinas."
};

export default function Page(){
  return <MarketingShell
    eyebrow="PRODUTOS"
    title="Simulados para transformar estudo em desempenho."
    lead="Treine em formato de prova, revise seus erros e acompanhe sua evolucao com foco no PSCPP."
  >
    <section className={styles.section}>
      <span>COMO FUNCIONA</span>
      <h2>Pratique com metodo e controle de tempo.</h2>
      <p>Use os simulados para consolidar conteudo, identificar lacunas e ganhar ritmo de prova.</p>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h3>Simulado por materia</h3>
          <p>Concentre o treino em uma disciplina especifica para aprofundar pontos fracos.</p>
        </article>

        <article className={styles.card}>
          <h3>Questoes aleatorias</h3>
          <p>Monte provas com questoes de diferentes materias para aproximar o treino da avaliacao real.</p>
        </article>

        <article className={styles.card}>
          <h3>Desempenho</h3>
          <p>Acompanhe seus resultados e use os erros como base para direcionar a revisao.</p>
        </article>
      </div>
    </section>

    <section className={styles.section}>
      <span>OBJETIVO</span>
      <h2>Treinar antes da prova muda a forma de estudar.</h2>
      <div className={styles.quote}>
        O simulado nao serve apenas para medir conhecimento. Ele ajuda a desenvolver estrategia, tempo de resposta e consistencia.
      </div>
    </section>
  </MarketingShell>
}
