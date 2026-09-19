import {getSession} from "../../../../lib/auth";
import {getIntegratedStudyPlan} from "../../../../lib/integrated-study-plan";

export const dynamic="force-dynamic";
export const maxDuration=60;

const DAY=86400000;
const EXAM="2027-11-01";
const FIRST_PASS="2027-08-01";
const TZ="America/Sao_Paulo";
const weekNames=["DOMINGO","SEGUNDA-FEIRA","TERÇA-FEIRA","QUARTA-FEIRA","QUINTA-FEIRA","SEXTA-FEIRA","SÁBADO"];
const clean=v=>String(v??"").replace(/\r?\n/g," ").trim();
const iso=d=>new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
const br=s=>new Intl.DateTimeFormat("pt-BR",{timeZone:TZ,day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(s+"T12:00:00-03:00"));
const today=()=>iso(new Date());
const addDays=(s,n)=>iso(new Date(new Date(s+"T12:00:00-03:00").getTime()+n*DAY));
const isoDow=s=>{const d=new Date(s+"T12:00:00-03:00").getDay();return d===0?7:d};
const phaseForDate=s=>{
  const left=Math.max(0,Math.ceil((new Date(EXAM+"T12:00:00-03:00")-new Date(s+"T12:00:00-03:00"))/DAY));
  if(left<=92)return{key:"heavy_review",label:"Revisão pesada"};
  if(left<=300)return{key:"development",label:"Leitura + desenvolvimento"};
  return{key:"foundation",label:"Primeira passagem da bibliografia"};
};
function readingChunks(items){
  const out=[];
  for(const item of items||[]){
    if(item.progress?.status==="done")continue;
    const from=Number(item.page_start),to=Number(item.page_end),done=Math.max(0,Number(item.progress?.pages_completed||0));
    if(Number.isInteger(from)&&Number.isInteger(to)&&to>=from){
      for(let p=from+done;p<=to;p+=12)out.push({...item,page_from:p,page_to:Math.min(to,p+11)});
    }else out.push({...item,page_from:null,page_to:null});
  }
  return out;
}
function lineTask(lines,task,index){
  lines.push(`[ ] ${index+1}. ${clean(task.title)}`);
  lines.push(`    Tipo: ${clean(task.type)}`);
  if(task.subject)lines.push(`    Matéria: ${clean(task.subject)}`);
  if(task.publication)lines.push(`    Livro/Publicação: ${clean(task.publication)}`);
  if(task.chapter)lines.push(`    Capítulo/Seção: ${clean(task.chapter)}`);
  if(task.page_from&&task.page_to)lines.push(`    Páginas: ${task.page_from} a ${task.page_to}`);
  if(task.description)lines.push(`    Instrução: ${clean(task.description)}`);
  if(task.target_questions)lines.push(`    Meta de questões: ${task.target_questions}`);
  if(task.minutes)lines.push(`    Tempo estimado: ${task.minutes} minutos`);
  if(task.reason)lines.push(`    Motivo da recomendação: ${clean(task.reason)}`);
  lines.push("");
}

export async function GET(){
  const session=await getSession();
  if(!session)return new Response("Não autenticado.",{status:401});

  // Uma única geração integrada carrega onboarding, métricas, bibliografia e progresso.
  // O horizonte futuro é compilado em memória; não repetimos dezenas de consultas por semana.
  const base=await getIntegratedStudyPlan(session.id,0);
  if(base.needs_onboarding)return new Response("Configure primeiro seu Plano de Estudos.",{status:409});

  const start=today();
  const studyDays=(base.onboarding?.study_days?.length?base.onboarding.study_days:[1,2,3,4,5,6]).map(Number);
  const weighted=base.weighted_subjects||[];
  const reading=readingChunks(base.bibliography||[]);
  const lines=[];
  let readingIndex=0,subjectIndex=0;

  lines.push("ESTIBORDO — PLANO DE ESTUDOS PSCPP");
  lines.push("============================================================");
  lines.push("Data de geração: "+br(start));
  lines.push("Data considerada para a prova: 01/11/2027");
  lines.push("Dias restantes na geração: "+base.days_left);
  lines.push("Fase atual: "+clean(base.phase?.label));
  lines.push("Índice de prontidão: "+base.readiness+"%");
  lines.push("");
  lines.push("COMO USAR ESTE DOCUMENTO");
  lines.push("------------------------------------------------------------");
  lines.push("Plano compilado a partir do estado atual do aluno. O calendário futuro é projetado sequencialmente, sem repetir consultas ao banco. Uma nova exportação substitui esta versão quando desempenho, progresso ou disponibilidade mudarem.");
  lines.push("");
  lines.push("PERFIL E CAPACIDADE DE ESTUDO");
  lines.push("------------------------------------------------------------");
  lines.push("Tempo diário configurado: "+Number(base.onboarding?.daily_minutes||0)+" minutos");
  lines.push("Meta de leitura: "+Number(base.onboarding?.reading_minutes_target||0)+" minutos");
  lines.push("Dias de estudo (ISO 1=segunda, 7=domingo): "+studyDays.join(", "));
  lines.push("Experiência declarada: "+clean(base.onboarding?.experience_level||"não informada"));
  lines.push("");
  lines.push("DESEMPENHO ATUAL POR MATÉRIA");
  lines.push("------------------------------------------------------------");
  for(const s of base.metrics?.subjects||[])lines.push(`- ${clean(s.label)}: ${s.questions||0} respostas | ${s.correct||0} acertos | ${s.errors||0} erros | ${s.accuracy||0}% de aproveitamento`);
  lines.push("");
  lines.push("PRIORIDADES ATUAIS");
  lines.push("------------------------------------------------------------");
  weighted.forEach((s,i)=>lines.push(`${i+1}. ${clean(s.label)} — aproveitamento ${s.accuracy||0}% em ${s.questions||0} respostas`));
  lines.push("");
  lines.push("BIBLIOGRAFIA — SITUAÇÃO ATUAL");
  lines.push("------------------------------------------------------------");
  for(const item of base.bibliography||[]){
    const status=item.progress?.status==="done"?"DONE":"PENDENTE";
    const pages=item.page_start&&item.page_end?` | páginas ${item.page_start}-${item.page_end}`:"";
    lines.push(`[${status}] ${clean(item.publication)} — ${clean(item.chapter||item.section)}${pages}`);
  }
  lines.push("");
  lines.push("CRONOGRAMA DIÁRIO COMPLETO ATÉ A PROVA");
  lines.push("============================================================");

  // Preserva exatamente a semana corrente já calculada pela plataforma.
  const currentByDate=new Map((base.week?.days||[]).map(d=>[d.iso,d]));
  for(let date=start;date<=EXAM;date=addDays(date,1)){
    const dow=isoDow(date);
    lines.push("");
    lines.push(`${weekNames[dow===7?0:dow]} — ${br(date)}`);
    lines.push("------------------------------------------------------------");

    const current=currentByDate.get(date);
    if(current){
      if(current.unavailable){lines.push("DIA MARCADO COMO INDISPONÍVEL — "+clean(current.unavailable.reason||current.unavailable.note||"indisponibilidade registrada"));continue}
      if(!current.active){lines.push("Dia sem estudo programado.");continue}
      if(!(current.tasks||[]).length){lines.push("Sem tarefa específica programada para esta data.");continue}
      current.tasks.forEach((t,i)=>lineTask(lines,{...t,publication:t.type==="reading"?t.title:null,reason:t.reason||t.recommendation_reason},i));
      // Avança o cursor virtual de leitura para não repetir o que já foi alocado nesta semana.
      readingIndex+=(current.tasks||[]).filter(t=>t.type==="reading").length;
      continue;
    }

    if(!studyDays.includes(dow)){lines.push("Dia sem estudo programado.");continue}
    const phase=phaseForDate(date);
    const subject=weighted[subjectIndex%Math.max(1,weighted.length)]||{};
    subjectIndex++;
    const tasks=[];

    if(phase.key!=="heavy_review"&&readingIndex<reading.length){
      const item=reading[readingIndex++];
      tasks.push({
        type:"reading",subject:item.subject_slug,title:item.publication,publication:item.publication,
        chapter:item.chapter||item.section,page_from:item.page_from,page_to:item.page_to,
        description:item.page_from?`Leitura sequencial: ${item.chapter||item.section}, páginas ${item.page_from}–${item.page_to}.`:`Leitura integral da seção: ${item.section||item.chapter}.`,
        minutes:Number(base.onboarding?.reading_minutes_target||120),
        reason:"Primeira passagem da bibliografia obrigatória antes da fase de revisão pesada."
      });
    }

    const daily=Number(base.onboarding?.daily_minutes||60);
    const qTarget=Math.max(10,Math.round(Math.max(20,daily*(phase.key==="heavy_review"?.70:.30))/1.7));
    tasks.push({
      type:"questions",subject:subject.slug,title:`${qTarget} questões — ${subject.label||"matéria prioritária"}`,
      target_questions:qTarget,minutes:Math.max(20,Math.round(qTarget*1.7)),
      description:`Treino orientado pela prioridade atual. Aproveitamento de referência: ${subject.accuracy||0}% em ${subject.questions||0} respostas.`,
      reason:"Prioridade calculada pelas métricas atuais de desempenho e cobertura."
    });
    tasks.push({
      type:"review",subject:subject.slug,title:phase.key==="heavy_review"?`Revisão pesada — ${subject.label||"matéria prioritária"}`:"Revisão inteligente",
      minutes:20,description:phase.key==="heavy_review"?"Caderno de erros, revisão espaçada e releitura seletiva dos tópicos fracos.":"Revisar erros e tópicos vencidos antes de avançar.",
      reason:`Fase projetada para esta data: ${phase.label}.`
    });
    if(dow===studyDays[studyDays.length-1])tasks.push({type:"simulado",subject:weighted[0]?.slug,title:"Simulado de consolidação",minutes:240,description:"Fechamento semanal para medir desempenho e recalibrar o próximo ciclo.",reason:"Último dia de estudo configurado da semana."});
    tasks.forEach((t,i)=>lineTask(lines,t,i));
  }

  lines.push("");
  lines.push("MARCOS DO PLANO");
  lines.push("============================================================");
  lines.push("Meta de primeira passagem da bibliografia: até 01/08/2027.");
  lines.push("A partir de 02/08/2027: revisão pesada, questões, simulados, caderno de erros e releitura seletiva dos pontos fracos.");
  lines.push("Data considerada para a prova: 01/11/2027.");
  lines.push("");
  lines.push("OBSERVAÇÃO");
  lines.push("------------------------------------------------------------");
  lines.push("O plano online permanece adaptativo. Baixe novamente após alterações relevantes de desempenho, leitura, disponibilidade ou metas.");
  lines.push("");
  lines.push("============================================================");
  lines.push("Gerado automaticamente pela ESTIBORDO.");

  const body="\uFEFF"+lines.join("\r\n");
  const filename=`Plano-de-Estudos-ESTIBORDO-${start}.txt`;
  return new Response(body,{headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":`attachment; filename="${filename}"`,"Cache-Control":"no-store"}});
}
