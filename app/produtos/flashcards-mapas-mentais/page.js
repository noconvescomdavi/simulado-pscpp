import {MarketingShell,styles} from "../../components/MarketingShell";

export const metadata = {
  title: "Flashcards + Mapa Mental | ESTIBORDO",
  description: "Flashcards e mapas mentais para revisao rapida e consolidacao de conteudo para o PSCPP."
};

export default function Page(){
  return <MarketingShell
    eyebrow="PRODUTOS"
    title="Flashcards e mapas mentais para revisar sem perder o rumo."
    lead="Reforce conceitos essenciais, sinais, regras, definicoes e pontos criticos com revisao visual e objetiva."
  >
    <section className={styles.section}>
      <span>REVISAO</span>
      <h2>Menos releitura. Mais recuperacao ativa.</h2>
      <p>Ferramentas de revisao rapida ajudam a reforcar memoria e a manter contato frequente com os pontos mais importantes da bibliografia.</p>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h3>Flashcards</h3>
          <p>Perguntas e respostas curtas para testar memoria, conceitos e associacoes importantes.</p>
        </article>

        <article className={styles.card}>
          <h3>Mapas mentais</h3>
          <p>Organizacao visual de assuntos para enxergar relacoes, sequencias e estruturas de forma mais clara.</p>
        </article>

        <article className={styles.card}>
          <h3>Revisao recorrente</h3>
          <p>Use sessoes curtas ao longo da semana para manter o conteudo ativo e reduzir o esquecimento.</p>
        </article>
      </div>
    </section>

    <section className={styles.section}>
      <span>CONSOLIDACAO</span>
      <h2>Revisar bem e parte da preparacao.</h2>
      <div className={styles.quote}>
        O objetivo nao e substituir o estudo da bibliografia, mas criar uma camada de revisao rapida para consolidar o que ja foi estudado.
      </div>
    </section>
  </MarketingShell>
}
