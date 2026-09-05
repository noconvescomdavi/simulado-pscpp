import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getTopicAnalytics} from "../../lib/engagement";
import StudentHeader from "../components/StudentHeader";
import styles from "./weak.module.css";
export const dynamic="force-dynamic";
export default async function Page(){
 const s=await getSession();if(!s)redirect("/login?next=/analise-de-fraquezas");
 const rows=await getTopicAnalytics(s.id);
 return <><StudentHeader active="fraquezas"/><main className={styles.page}><span>DIAGNÓSTICO</span><h1>Análise de Fraquezas</h1><p>Desempenho detalhado por tópico, do menor para o maior aproveitamento.</p>
 <div className={styles.table}>{rows.map(x=><article key={x.subject+"|"+x.topic_code+"|"+x.topic}>
 <div><small>{x.subject_label}</small><strong>{x.topic}</strong><span>{x.answers} respostas · {x.errors} erros</span></div>
 <b className={x.accuracy<60?styles.bad:x.accuracy<80?styles.mid:styles.good}>{x.accuracy}%</b>
 <div className={styles.actions}><a href={`/conteudos/banco-de-questoes?subject=${encodeURIComponent(x.subject)}`}>Treinar</a><a href={`/study-content/simulado/${x.subject}/`}>Teoria</a></div>
 </article>)}</div></main></>
}