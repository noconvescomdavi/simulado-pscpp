import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {ACCESS_FEATURES,canUseFeature,getEntitlement,premiumRedirect} from "../../lib/entitlement";
import {getTopicMastery} from "../../lib/learning-engine";
import StudentHeader from "../components/StudentHeader";
import styles from "./weak.module.css";
export const dynamic="force-dynamic";
export default async function Page(){
 const s=await getSession();if(!s)redirect("/login?next=/analise-de-fraquezas");
 const e=await getEntitlement(s.id);if(!canUseFeature(e,ACCESS_FEATURES.WEAKNESS_ANALYSIS))redirect(premiumRedirect(ACCESS_FEATURES.WEAKNESS_ANALYSIS));
 const rows=await getTopicMastery(s.id,{sync:true});
 return <><StudentHeader active="fraquezas"/><main className={styles.page}><span>DIAGNÓSTICO</span><h1>Análise de Fraquezas</h1><p>Diagnóstico por domínio estimado, confiança, acurácia e recorrência de erros.</p><div className={styles.table}>{rows.map(x=><article key={x.subject+"|"+x.topic_code+"|"+x.topic}><div><small>{x.subject_label}</small><strong>{x.topic}</strong><span>{x.answers} respostas · {x.errors} erros · confiança {Math.round(Number(x.confidence_score||0))}%</span></div><b className={x.mastery_score<50?styles.bad:x.mastery_score<75?styles.mid:styles.good}>{Math.round(Number(x.mastery_score||0))}%</b><div className={styles.actions}><a href={`/conteudos/banco-de-questoes?subject=${encodeURIComponent(x.subject)}`}>Treinar</a><a href={`/study-content/simulado/${x.subject}/`}>Teoria</a></div></article>)}</div></main></>;
}
