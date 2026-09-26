import {isStandaloneBuild} from "../../lib/standalone/mode";
import StandaloneTraining from "./StandaloneTraining";
import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getIntegratedStudyPlan} from "../../lib/integrated-study-plan";
import {getReviewQueue,getConsistency} from "../../lib/engagement";
import {getTopicMastery,estimateForgettingRisk} from "../../lib/learning-engine";
import StudentHeader from "../components/StudentHeader";
import AdaptiveClient from "../treino-adaptativo/AdaptiveClient";
import styles from "../treino-adaptativo/adaptive.module.css";

async function WebTreinoInteligente(){
 const s=await getSession(); if(!s)redirect("/login?next=/treino-inteligente");
 const [plan,reviews,consistency,topics]=await Promise.all([
  getIntegratedStudyPlan(s.id,0),getReviewQueue(s.id,60),getConsistency(s.id),
  getTopicMastery(s.id,{sync:true})
 ]);
 if(plan.needs_onboarding)redirect("/plano-de-estudos/configurar");
 const rows=topics.map(x=>({...x,forgetting_risk:estimateForgettingRisk(x)}));
 const due=reviews.filter(x=>x.is_due);
 const recommendedQuestions=Math.max(10,Math.min(40,Math.round((Number(plan.onboarding?.daily_minutes||60)*.35)/1.7)));
 return <><StudentHeader active="adaptativo"/><main className={styles.page}>
  <section className={styles.hero}><span>TREINO INTELIGENTE</span><h1>Prioridades, revisões e diagnóstico em um só lugar.</h1><p>O mesmo motor combina domínio, erros, confiança, risco de esquecimento, cobertura e carga disponível.</p></section>
  <section className={styles.grid}>
   <article className={styles.panel}><span>PRIORIDADES</span><h2>O que treinar agora</h2><div className={styles.list}>{plan.weighted_subjects.map((x,i)=><div key={x.slug}><b>{i+1}</b><div><strong>{x.label}</strong><small>{x.questions} respostas · {x.errors} erros · domínio {Math.round(Number(x.mastery_score||0))}%</small></div><em>{x.evidence_state==="unmeasured"?"Não avaliado":Math.round(Number(x.mastery_score||0))+"%"}</em></div>)}</div></article>
   <article className={styles.action}><span>SESSÃO RECOMENDADA</span><h2>{recommendedQuestions} questões</h2><p>Volume dimensionado pela capacidade diária e pelas matérias de maior prioridade.</p><AdaptiveClient trial={false} count={recommendedQuestions}/></article>
  </section>
  <section className={styles.grid}>
   <article className={styles.panel}><span>REVISÕES</span><h2>{due.length} para agora · sequência {consistency.streak} dias</h2><div className={styles.list}>{due.slice(0,10).map(x=><a key={x.source_key} href={x.href}><div><strong>{x.topic}</strong><small>{x.subject_label} · {x.reason}</small></div></a>)}{!due.length&&<p>Nenhuma revisão vencida agora.</p>}</div></article>
   <article className={styles.panel}><span>DIAGNÓSTICO</span><h2>Fraquezas por tópico</h2><div className={styles.list}>{rows.slice(0,10).map(x=><div key={x.key}><div><strong>{x.topic}</strong><small>{x.subject_label} · {x.answers} respostas · {x.errors} erros · confiança {Math.round(Number(x.confidence_score||0))}% · risco {x.forgetting_risk}%</small></div><em>{Math.round(Number(x.mastery_score||0))}%</em></div>)}</div></article>
  </section>
 </main></>;
}
export default async function TreinoInteligente(){if(isStandaloneBuild())return <StandaloneTraining/>;return WebTreinoInteligente();}
