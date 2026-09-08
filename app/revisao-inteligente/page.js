import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {ACCESS_FEATURES,canUseFeature,getEntitlement,premiumRedirect} from "../../lib/entitlement";
import {getReviewQueue,getConsistency} from "../../lib/engagement";
import StudentHeader from "../components/StudentHeader";
import styles from "./review.module.css";
import ReviewActions from "./ReviewActions";
export const dynamic="force-dynamic";
export default async function Page(){
 const s=await getSession();if(!s)redirect("/login?next=/revisao-inteligente");
 const e=await getEntitlement(s.id);if(!canUseFeature(e,ACCESS_FEATURES.SMART_REVIEW))redirect(premiumRedirect(ACCESS_FEATURES.SMART_REVIEW));
 const [items,consistency]=await Promise.all([getReviewQueue(s.id,40),getConsistency(s.id)]);
 return <><StudentHeader active="revisao"/><main className={styles.page}>
 <span>REPETIÇÃO ESPAÇADA</span><h1>Revisão Inteligente</h1><p>Prioridades calculadas com base em erros, acurácia e recorrência. Revise primeiro o que mais ameaça sua nota.</p>
 <section className={styles.summary}><div><b>{items.length}</b><span>tópicos prioritários</span></div><div><b>{consistency.streak}</b><span>dias de sequência</span></div><div><b>{consistency.questions}</b><span>questões respondidas</span></div></section>
 <div className={styles.list}>{items.length?items.map((x)=><article key={x.subject+"|"+x.topic_code+"|"+x.topic}><div><small>{x.subject_label} · {x.stage}</small><h2>{x.topic}</h2><p>{x.answers} respostas · {x.errors} erros · {x.accuracy}% de acerto · domínio {Math.round(Number(x.mastery_score||0))}%</p><small>{x.reason}</small></div><div className={styles.priority}><b>{x.priority}</b><span>{x.is_due?"revisar agora":"agendado"}</span><small>{x.due_at?new Date(x.due_at).toLocaleDateString("pt-BR"):""}</small></div><div><a href={x.href}>Resolver {x.suggested_questions} questões →</a><ReviewActions sourceKey={x.source_key} dueAt={x.due_at}/></div></article>):<div className={styles.empty}>Ainda não há erros suficientes para montar sua fila adaptativa.</div>}</div>
 </main></>;
}
