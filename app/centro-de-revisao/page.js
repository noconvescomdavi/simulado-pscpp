import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getReviewQueue,getConsistency} from "../../lib/engagement";
import {getLearningProfile} from "../../lib/learning-engine";
import StudentHeader from "../components/StudentHeader";
import styles from "./review-center.module.css";

export const dynamic="force-dynamic";
export default async function ReviewCenter(){
 const s=await getSession();if(!s)redirect("/login?next=/centro-de-revisao");
 const [items,consistency,learning]=await Promise.all([getReviewQueue(s.id,60),getConsistency(s.id),getLearningProfile(s.id)]);
 const due=items.filter(x=>x.is_due),critical=learning.weakest_topics?.filter(x=>Number(x.mastery_score)<50).slice(0,6)||[];
 return <><StudentHeader active="revisao"/><main className={styles.page}>
  <section className={styles.hero}><div><span>CENTRO DE REVISÃO</span><h1>Tudo que precisa voltar para a memória, em uma fila.</h1><p>Erros, tópicos frágeis e repetição espaçada reunidos para você não precisar escolher o que revisar.</p></div><a href="/revisao-inteligente">Começar minha revisão →</a></section>
  <section className={styles.kpis}><article><b>{due.length}</b><span>revisões para agora</span></article><article><b>{critical.length}</b><span>tópicos críticos</span></article><article><b>{consistency.streak}</b><span>dias de sequência</span></article><article><b>{items.length}</b><span>prioridades mapeadas</span></article></section>
  <section className={styles.grid}><article className={styles.panel}><span>AGORA</span><h2>Fila prioritária</h2>{due.slice(0,8).map(x=><a key={x.source_key} href={x.href}><div><strong>{x.topic}</strong><small>{x.subject_label} · {x.reason}</small></div><b>{x.priority}</b></a>)}{!due.length&&<p>Nenhuma revisão vencida. Continue estudando para alimentar a fila.</p>}</article>
  <article className={styles.panel}><span>FRAQUEZAS</span><h2>Corrigir antes de esquecer</h2>{critical.map(x=><a key={x.key} href={`/conteudos/banco-de-questoes?subject=${encodeURIComponent(x.subject)}`}><div><strong>{x.topic}</strong><small>{x.errors} erros · {x.answers} respostas</small></div><b>{Math.round(Number(x.mastery_score||0))}%</b></a>)}{!critical.length&&<p>Ainda não há tópicos críticos suficientes.</p>}</article></section>
  <section className={styles.actions}><a href="/conteudos/caderno-de-erros">Abrir Central de Erros</a><a href="/flashcards">Revisar Flashcards</a><a href="/treino-adaptativo">Treino Inteligente</a><a href="/flashcards/ripeam/3d">Treinar RIPEAM 3D</a></section>
 </main></>}