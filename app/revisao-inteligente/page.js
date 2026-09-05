import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getEntitlement} from "../../lib/entitlement";
import {getReviewQueue,getConsistency} from "../../lib/engagement";
import StudentHeader from "../components/StudentHeader";
import styles from "./review.module.css";
export const dynamic="force-dynamic";
export default async function Page(){
 const s=await getSession();if(!s)redirect("/login?next=/revisao-inteligente");
 const e=await getEntitlement(s.id);if(!e.active&&!e.trial)redirect("/comprar?locked=inactive");
 const [items,consistency]=await Promise.all([getReviewQueue(s.id,40),getConsistency(s.id)]);
 return <><StudentHeader active="conteudos"/><main className={styles.page}>
 <span>REPETIÇÃO ESPAÇADA</span><h1>Revisão Inteligente</h1>
 <p>Prioridades calculadas com base em erros, acurácia e recorrência. Revise primeiro o que mais ameaça sua nota.</p>
 <section className={styles.summary}><div><b>{items.length}</b><span>tópicos prioritários</span></div><div><b>{consistency.streak}</b><span>dias de sequência</span></div><div><b>{consistency.questions}</b><span>questões respondidas</span></div></section>
 <div className={styles.list}>{items.length?items.map((x)=><article key={x.subject+"|"+x.topic_code+"|"+x.topic}>
   <div><small>{x.subject_label} · {x.stage}</small><h2>{x.topic}</h2><p>{x.answers} respostas · {x.errors} erros · {x.accuracy}% de acerto</p></div>
   <div className={styles.priority}><b>{x.priority}</b><span>prioridade</span></div>
   <a href={x.href}>Resolver {x.suggested_questions} questões →</a>
 </article>):<div className={styles.empty}>Ainda não há erros suficientes para montar sua fila adaptativa.</div>}</div>
 </main></>
}