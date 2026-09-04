import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import StudentHeader from "../components/StudentHeader";
import styles from "./conteudos.module.css";

const fullContents = [
  ["Banco de questÃµes", "Crie cadernos aleatÃ³rios com atÃ© 100 questÃµes.", "/conteudos/banco-de-questoes"],
  ["Caderno de erros", "Revise automaticamente as questÃµes que vocÃª mais erra.", "/conteudos/caderno-de-erros"],
  ["Simulados", "Provas emitidas e histÃ³rico completo.", "/simulado"],
  ["Flashcards", "Revise conteÃºdos com mÃ©tricas prÃ³prias, repetiÃ§Ã£o de erros e modo prova.", "/flashcards"],
  ["I â€“ Manobrabilidade do Navio", "/study-content/simulado/manobrabilidade/"],
  ["II â€“ Arte Naval", "/study-content/simulado/arte-naval/"],
  ["III â€“ NavegaÃ§Ã£o em Ãguas Restritas", "/study-content/simulado/navegacao-aguas-restritas/"],
  ["IV â€“ LegislaÃ§Ã£o e RegulamentaÃ§Ã£o", "/study-content/simulado/legislacao-regulamentacao/"],
  ["V â€“ Meteorologia e Oceanografia", "/study-content/simulado/meteorologia-oceanografia/"],
  ["VI â€“ ComunicaÃ§Ãµes", "/study-content/simulado/comunicacoes/"],
  ["VII â€“ Conhecimentos Gerais", "/study-content/simulado/conhecimentos-gerais/"],
];

const trialContents = [
  ["Banco de questÃµes", "Teste grÃ¡tis: 1 caderno com 10 questÃµes aleatÃ³rias.", "/conteudos/banco-de-questoes"],
  ["Simulados", "Teste grÃ¡tis: 1 simulado com 10 questÃµes aleatÃ³rias.", "/simulado"],
  ["Flashcards CIS", "CÃ³digo Internacional de Sinais liberado no teste grÃ¡tis.", "/flashcards"],
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
        <h1>ConteÃºdos</h1>
        {entitlement.trial && (
          <p>Seu teste grÃ¡tis inclui 1 simulado de 10 questÃµes, 1 caderno de 10 questÃµes e o Flashcard CIS.</p>
        )}

        <section className={styles.grid}>
          {contents.map((item) => {
            const title = item[0];
            const description = item.length === 3 ? item[1] : "ConteÃºdo protegido da disciplina.";
            const href = item[item.length - 1];
            return (
              <a className={styles.card} href={href} key={href}>
                <h2>{title}</h2>
                <p>{description}</p>
                <b>Abrir â†’</b>
              </a>
            );
          })}
        </section>
      </main>
    </>
  );
}