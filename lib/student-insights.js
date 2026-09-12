import {getIntegratedStudyPlan} from "./integrated-study-plan";
import {getLearningProfile,getStudyTimeSummary} from "./learning-engine";
import {getReviewQueue,getConsistency} from "./engagement";
import {getUserMetrics} from "./metrics";

const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,Number(v)||0));

export async function getStudentInsights(userId){
  const [plan,learning,time,reviews,consistency,metrics]=await Promise.all([
    getIntegratedStudyPlan(userId,0),
    getLearningProfile(userId).catch(()=>({overall_mastery:0,subjects:[],weakest_topics:[]})),
    getStudyTimeSummary(userId).catch(()=>({today_minutes:0,week_minutes:0})),
    getReviewQueue(userId,20).catch(()=>[]),
    getConsistency(userId).catch(()=>({streak:0,study_days:0})),
    getUserMetrics(userId)
  ]);
  if(plan?.needs_onboarding)return{needs_onboarding:true,insights:[]};
  const weak=learning.weakest_topics?.[0]||null;
  const adherence=Number(plan.tracking?.adherence_percent??100);
  const backlog=Number(plan.tracking?.backlog_count||0);
  const due=reviews.filter(x=>x.is_due).length;
  const readiness=clamp(plan.readiness);
  const insights=[];
  if(weak)insights.push({kind:"weakness",title:"Maior oportunidade de ganho",text:`${weak.topic} está com domínio estimado de ${Math.round(Number(weak.mastery_score||0))}% e ${weak.errors||0} erros registrados.`,action:"Corrigir esta fraqueza",href:`/conteudos/banco-de-questoes?subject=${encodeURIComponent(weak.subject)}`});
  if(due)insights.push({kind:"review",title:"Revisões vencendo hoje",text:`Você tem ${due} prioridade(s) de revisão. Resolver isso agora reduz o risco de esquecimento.`,action:"Começar revisão",href:"/revisao-inteligente"});
  if(backlog)insights.push({kind:"route",title:"Sua rota precisa de recuperação",text:`${backlog} pendência(s) continuam abertas. A rota integrada redistribui a carga sem recriar tarefas já concluídas.`,action:"Ver minha rota",href:"/plano-de-estudos"});
  if(adherence<75)insights.push({kind:"consistency",title:"Consistência abaixo do planejado",text:`Sua aderência recente está em ${Math.round(adherence)}%. Uma sessão curta hoje vale mais que abrir uma nova frente.`,action:"Fazer o plano de hoje",href:"/hoje"});
  if(Number(time.week_minutes||0)>0)insights.push({kind:"time",title:"Carga real da semana",text:`Você acumulou ${time.week_minutes} minutos reais de estudo nos últimos 7 dias. A ESTIBORDO usa essa carga para contextualizar sua rota.`,action:"Ver trajetória",href:"/minha-trajetoria"});
  return{needs_onboarding:false,readiness,adherence,backlog,due,weak,time,consistency,metrics,learning,plan,insights:insights.slice(0,4)};
}