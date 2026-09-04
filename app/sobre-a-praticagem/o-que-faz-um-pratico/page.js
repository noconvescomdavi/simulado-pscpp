import {MarketingShell,styles} from "../../components/MarketingShell";

export const metadata = {
  title: "O que Faz um Pratico | ESTIBORDO",
  description: "Entenda a funcao do Pratico na navegacao, manobra e seguranca da embarcacao em aguas restritas."
};

export default function Page(){
  return <MarketingShell
    eyebrow="SOBRE A PRATICAGEM"
    title="O Pratico assessora o Comandante nas operacoes mais sensiveis da navegacao."
    lead="Sua atuacao e especialmente relevante em portos, canais, barras, rios, terminais e outras areas de navegacao restrita."
  >
    <section className={styles.section}>
      <span>ATUACAO</span>
      <h2>Conhecimento local aplicado a manobra e navegacao.</h2>
      <p>O Pratico utiliza conhecimento detalhado da Zona de Praticagem para assessorar o Comandante em situacoes que exigem elevada precisao operacional.</p>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h3>Navegacao em aguas restritas</h3>
          <p>Avalia condicoes locais, trafego, profundidade, correntes, vento, canais e restricoes operacionais.</p>
        </article>

        <article className={styles.card}>
          <h3>Manobras</h3>
          <p>Participa do planejamento e da execucao de aproximacoes, atracacoes, desatracacoes, giros e movimentacoes portuarias.</p>
        </article>

        <article className={styles.card}>
          <h3>Assessoramento tecnico</h3>
          <p>Fornece ao Comandante informacoes locais e recomendacoes para apoiar decisoes seguras durante a operacao.</p>
        </article>
      </div>
    </section>

    <section className={styles.section}>
      <span>RESPONSABILIDADE</span>
      <h2>Precisao, comunicacao e leitura do ambiente.</h2>
      <p>A atividade combina conhecimento tecnico, experiencia operacional, comunicacao de passadico e tomada de decisao em ambientes de baixa margem para erro.</p>
    </section>
  </MarketingShell>
}
