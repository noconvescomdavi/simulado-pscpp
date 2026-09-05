import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import StudentHeader from "../components/StudentHeader";
import styles from "./conteudos.module.css";

const fullContents = [
  ["Banco de questões", "Crie cadernos aleatórios com até 100 questões.", "/conteudos/banco-de-questoes"],
  ["Caderno de erros", "Revise automaticamente as questões que você mais erra.", "/conteudos/caderno-de-erros"],
  ["Simulados", "Provas emitidas e histórico completo.", "/simulado"],
  ["Flashcards", "Revise conteúdos com métricas próprias, repetição de erros e modo prova.", "/flashcards"],
  ["I – Manobrabilidade do Navio", "/study-content/simulado/manobrabilidade/"],
  ["II – Arte Naval", "/study-content/simulado/arte-naval/"],
  ["III – Navegação em Águas Restritas", "/study-content/simulado/navegacao-aguas-restritas/"],
  ["IV – Legislação e Regulamentação", "/study-content/simulado/legislacao-regulamentacao/"],
  ["V – Meteorologia e Oceanografia", "/study-content/simulado/meteorologia-oceanografia/"],
  ["VI – Comunicações", "/study-content/simulado/comunicacoes/"],
  ["VII – Conhecimentos Gerais", "/study-content/simulado/conhecimentos-gerais/"],
];

const trialContents = [
  ["Banco de questões", "Teste grátis: 1 caderno com 10 questões aleatórias.", "/conteudos/banco-de-questoes"],
  ["Simulados", "Teste grátis: 1 simulado com 10 questões aleatórias.", "/simulado"],
  ["Flashcards CIS", "Código Internacional de Sinais liberado no teste grátis.", "/flashcards"],
];

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login?next=/conteudos");

  const entitlement = await getEntitlement(session.id);
  if (!entitlement.active && !entitlement.trial) {
    redirect("/comprar?locked=inactive");
  }

  const contents = entitlement.active ? fullContents : trialContents;

  return (
    <>
      <StudentHeader active="conteudos" />
      <main className={styles.page}>
        <span>CENTRAL DE ESTUDOS</span>
        <h1>Conteúdos</h1>
        {entitlement.trial && (
          <p>Seu teste grátis inclui 1 simulado de 10 questões, 1 caderno de 10 questões e o Flashcard CIS.</p>
        )}

        <section className={styles.grid}>
          {contents.map((item) => {
            const title = item[0];
            const description = item.length === 3 ? item[1] : "Conteúdo protegido da disciplina.";
            const href = item[item.length - 1];
            return (
              <a className={styles.card} href={href} key={href}>
                <h2>{title}</h2>
                <p>{description}</p>
                <b>Abrir →</b>
              </a>
            );
          })}
        </section>
      </main>
    </>
  );
}