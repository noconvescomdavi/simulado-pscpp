import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getUserAccess } from "../../lib/access";
import StudentHeader from "../components/StudentHeader";
import styles from "./conteudos.module.css";

const contents = [
  ["Banco de questões", "Crie cadernos aleatórios com até 100 questões.", "/conteudos/banco-de-questoes"],
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

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login?next=/conteudos");

  if (!(await getUserAccess(session.id))?.active) {
    redirect("/comprar?locked=inactive");
  }

  return (
    <>
      <StudentHeader active="conteudos" />
      <main className={styles.page}>
        <span>CENTRAL DE ESTUDOS</span>
        <h1>Conteúdos</h1>
        <section className={styles.grid}>
          {contents.map((item) => {
            const title = item[0];
            const description =
              item.length === 3 ? item[1] : "Conteúdo protegido da disciplina.";
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
