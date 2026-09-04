import {MarketingShell,styles} from "../../components/MarketingShell";

export const metadata = {
  title: "Banco de Questoes | ESTIBORDO",
  description: "Banco de questoes para estudo e pratica direcionada ao PSCPP."
};

export default function Page(){
  return <MarketingShell
    eyebrow="PRODUTOS"
    title="Banco de Questoes para estudar com direcao."
    lead="Transforme a bibliografia em pratica objetiva com blocos de questoes organizados por disciplina e assunto."
  >
    <section className={styles.section}>
      <span>PRATICA DIRECIONADA</span>
      <h2>Estude por assunto, materia ou necessidade.</h2>
      <p>O banco de questoes permite concentrar o treino onde ele realmente faz diferenca.</p>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h3>Questoes por disciplina</h3>
          <p>Selecione uma materia e pratique de forma concentrada, sem depender de uma prova completa.</p>
        </article>

        <article className={styles.card}>
          <h3>Cadernos personalizados</h3>
          <p>Monte blocos de questoes conforme seu plano de estudos e sua disponibilidade.</p>
        </article>

        <article className={styles.card}>
          <h3>Revisao ativa</h3>
          <p>Use a resolucao de questoes para reforcar memoria, identificar erros recorrentes e revisar pontos criticos.</p>
        </article>
      </div>
    </section>

    <section className={styles.section}>
      <span>ESTRATEGIA</span>
      <h2>Questao resolvida com criterio vale mais que leitura passiva.</h2>
      <p>O objetivo e transformar conteudo teorico em decisao rapida, leitura precisa e resposta fundamentada.</p>
    </section>
  </MarketingShell>
}
