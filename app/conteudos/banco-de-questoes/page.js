import {redirect} from "next/navigation";
import {getSession} from "../../../lib/auth";
import {getEntitlement} from "../../../lib/entitlement";
import {availableQuestionBanks} from "../../../lib/question-banks";
import {listNotebookHistory} from "../../../lib/notebooks";
import StudentHeader from "../../components/StudentHeader";
import Builder from "./Builder";
import styles from "./bank.module.css";

export default async function Page({searchParams}){
  const s=await getSession();
  if(!s)redirect("/login");

  const e=await getEntitlement(s.id);
  if(!e.active&&!e.trial)redirect("/comprar");

  const q=await searchParams;
  const history=await listNotebookHistory(s.id,30);
  const requested=String(q?.materia||"").trim();
  const banks=availableQuestionBanks({includeFilters:true});
  const initialSubjects=requested&&banks.some(b=>b.slug===requested&&b.count)
    ? [requested]
    : [];

  return (
    <>
      <StudentHeader active="conteudos"/>
      <main className={styles.page}>
        <span>QUESTÕES</span>
        <h1>Banco de questões</h1>
        <p>{e.trial
          ?"Período de testes: gere 1 bloco com 10 questões."
          :"Marque as matérias, filtre por obra, capítulo ou assunto e gere um caderno de 1 a 100 questões."}</p>
        <Builder
          banks={banks}
          trial={e.trial}
          initialSubjects={initialSubjects}
          fixation={q?.modo==="fixacao"?{
            bibliography_key:q?.bibliografia||"",
            section_key:q?.secao||"",
            chapter:q?.capitulo||""
          }:null}
        />

        <section id="meus-cadernos" className={styles.history}>
          <div className={styles.historyHead}>
            <div>
              <span>HISTÓRICO</span>
              <h2>Meus cadernos</h2>
              <p>Retome cadernos em andamento ou consulte os resultados dos que já foram concluídos.</p>
            </div>
            <strong>{history.length} {history.length===1?"caderno":"cadernos"}</strong>
          </div>

          {history.length ? (
            <div className={styles.historyList}>
              {history.map((item)=>(
                <article className={styles.historyCard} key={item.id}>
                  <div className={styles.historyMain}>
                    <div className={styles.historyMeta}>
                      <span className={item.completed?styles.completed:styles.inProgress}>
                        {item.completed?"Concluído":"Em andamento"}
                      </span>
                      <time>{new Date(item.created_at).toLocaleDateString("pt-BR")}</time>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.answered_count} de {item.total_questions} questões respondidas</p>
                    <div className={styles.progressTrack}>
                      <i style={{width:`${item.total_questions?Math.min(100,Math.round((item.answered_count/item.total_questions)*100)):0}%`}} />
                    </div>
                  </div>

                  <div className={styles.historyStats}>
                    <div><span>Progresso</span><strong>{item.total_questions?Math.round((item.answered_count/item.total_questions)*100):0}%</strong></div>
                    <div><span>Aproveitamento</span><strong>{item.score_percent.toFixed(0)}%</strong></div>
                    <a href={`/conteudos/caderno/${item.id}`}>
                      {item.completed?"Ver resultado":"Continuar caderno"} →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.historyEmpty}>
              <strong>Nenhum caderno criado ainda.</strong>
              <p>Quando você gerar seu primeiro caderno, ele aparecerá aqui automaticamente.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
