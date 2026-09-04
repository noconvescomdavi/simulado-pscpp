import {MarketingShell,styles} from "../../components/MarketingShell";

export const metadata = {
  title: "Como se tornar um Pratico | ESTIBORDO",
  description: "Visao geral sobre o caminho para ingresso na praticagem no Brasil e preparacao para o processo seletivo."
};

export default function Page(){
  return <MarketingShell
    eyebrow="SOBRE A PRATICAGEM"
    title="O ingresso na Praticagem exige preparacao tecnica e aprovacao em processo seletivo."
    lead="O caminho envolve requisitos de ingresso, processo seletivo e uma etapa posterior de qualificacao na Zona de Praticagem."
  >
    <section className={styles.section}>
      <span>CAMINHO GERAL</span>
      <h2>Da preparacao ao exercicio da atividade.</h2>

      <div className={styles.grid}>
        <article className={styles.card}>
          <span className={styles.number}>1</span>
          <h3>Preparacao</h3>
          <p>Estudo sistematico da bibliografia e das disciplinas previstas para o processo seletivo.</p>
        </article>

        <article className={styles.card}>
          <span className={styles.number}>2</span>
          <h3>Processo seletivo</h3>
          <p>O candidato precisa atender aos requisitos estabelecidos e ser aprovado nas etapas previstas no edital vigente.</p>
        </article>

        <article className={styles.card}>
          <span className={styles.number}>3</span>
          <h3>Qualificacao</h3>
          <p>A aprovacao no processo seletivo nao encerra a formacao. Ha etapa posterior de qualificacao para a atividade na Zona de Praticagem.</p>
        </article>
      </div>
    </section>

    <section className={styles.section}>
      <span>IMPORTANTE</span>
      <h2>Use sempre a norma e o edital vigente como referencia.</h2>
      <div className={styles.quote}>
        Requisitos, etapas, criterios e documentos podem ser atualizados. Para qualquer decisao de inscricao, consulte a regulamentacao e o edital oficial em vigor.
      </div>
    </section>
  </MarketingShell>
}
