import {getSession} from "../../../../lib/auth";
import {getIntegratedStudyPlan} from "../../../../lib/integrated-study-plan";

export const dynamic="force-dynamic";

const DAY=86400000;
const EXAM="2027-11-01";
const weekNames=["DOMINGO","SEGUNDA-FEIRA","TERÇA-FEIRA","QUARTA-FEIRA","QUINTA-FEIRA","SEXTA-FEIRA","SÁBADO"];
function br(iso){return new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(iso+"T12:00:00-03:00"))}
function today(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())}
function monday(date){const d=new Date(date+"T12:00:00-03:00"),dow=d.getDay(),shift=dow===0?-6:1-dow;return new Date(d.getTime()+shift*DAY)}
function iso(d){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(d)}
function clean(v){return String(v??"").replace(/\r?\n/g," ").trim()}

export async function GET(){
  const session=await getSession();
  if(!session)return new Response("Não autenticado.",{status:401});

  const start=today(), exam=new Date(EXAM+"T12:00:00-03:00"), firstMonday=monday(start);
  const totalWeeks=Math.max(1,Math.ceil((exam-firstMonday)/DAY/7)+1);
  const plans=[];
  for(let offset=0;offset<totalWeeks;offset++){
    const plan=await getIntegratedStudyPlan(session.id,offset);
    if(plan.needs_onboarding)return new Response("Configure primeiro seu Plano de Estudos.",{status:409});
    plans.push(plan);
  }
  const base=plans[0];
  const lines=[];
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
  lines.push("Este arquivo é um retrato detalhado do planejamento atual calculado pela ESTIBORDO. Cada data abaixo informa exatamente o que está programado. O plano online continua adaptativo: desempenho, tarefas concluídas, indisponibilidades e progresso de leitura podem recalibrar semanas futuras. Ao baixar novamente, use a versão mais recente.");
  lines.push("");
  lines.push("PERFIL E CAPACIDADE DE ESTUDO");
  lines.push("------------------------------------------------------------");
  lines.push("Tempo diário configurado: "+Number(base.onboarding?.daily_minutes||0)+" minutos");
  lines.push("Meta de leitura: "+Number(base.onboarding?.reading_minutes_target||0)+" minutos");
  lines.push("Dias de estudo (ISO 1=segunda, 7=domingo): "+(base.onboarding?.study_days||[]).join(", "));
  lines.push("Experiência declarada: "+clean(base.onboarding?.experience_level||"não informada"));
  lines.push("");
  lines.push("DESEMPENHO ATUAL POR MATÉRIA");
  lines.push("------------------------------------------------------------");
  for(const s of base.metrics?.subjects||[])lines.push(`- ${clean(s.label)}: ${s.questions||0} respostas | ${s.correct||0} acertos | ${s.errors||0} erros | ${s.accuracy||0}% de aproveitamento`);
  lines.push("");
  lines.push("PRIORIDADES ATUAIS");
  lines.push("------------------------------------------------------------");
  (base.weighted_subjects||[]).forEach((s,i)=>lines.push(`${i+1}. ${clean(s.label)} — aproveitamento ${s.accuracy||0}% em ${s.questions||0} respostas`));
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

  const seen=new Set();
  for(const plan of plans){
    for(const day of plan.week?.days||[]){
      if(day.iso<start||day.iso>EXAM||seen.has(day.iso))continue;
      seen.add(day.iso);
      const d=new Date(day.iso+"T12:00:00-03:00");
      lines.push("");
      lines.push(`${weekNames[d.getDay()]} — ${br(day.iso)}`);
      lines.push("------------------------------------------------------------");
      if(day.unavailable){lines.push("DIA MARCADO COMO INDISPONÍVEL — "+clean(day.unavailable.reason||day.unavailable.note||"indisponibilidade registrada"));continue}
      if(!day.active){lines.push("Dia sem estudo programado.");continue}
      if(!(day.tasks||[]).length){lines.push("Sem tarefa específica programada para esta data.");continue}
      (day.tasks||[]).forEach((task,i)=>{
        const done=task.status==="done"?"[DONE]":"[ ]";
        lines.push(`${done} ${i+1}. ${clean(task.title)}`);
        lines.push(`    Tipo: ${clean(task.type)}`);
        if(task.subject)lines.push(`    Matéria: ${clean(task.subject)}`);
        if(task.bibliography_key||task.type==="reading")lines.push(`    Livro/Publicação: ${clean(task.title)}`);
        if(task.chapter)lines.push(`    Capítulo/Seção: ${clean(task.chapter)}`);
        if(task.page_from&&task.page_to)lines.push(`    Páginas: ${task.page_from} a ${task.page_to}`);
        if(task.description)lines.push(`    Instrução: ${clean(task.description)}`);
        if(task.target_questions)lines.push(`    Meta de questões: ${task.target_questions}`);
        if(task.minutes)lines.push(`    Tempo estimado: ${task.minutes} minutos`);
        if(task.recommendation_reason)lines.push(`    Motivo da recomendação: ${clean(task.recommendation_reason)}`);
        if(task.fixation)lines.push(`    Fixação: ${clean(task.fixation)}`);
        if(task.status==="done"&&task.completed_at)lines.push(`    Concluído em: ${clean(task.completed_at)}`);
        lines.push("");
      });
    }
  }
  lines.push("");
  lines.push("MARCOS DO PLANO");
  lines.push("============================================================");
  lines.push("Meta de primeira passagem da bibliografia: até 01/08/2027.");
  lines.push("A partir de 02/08/2027: revisão pesada, questões, simulados, caderno de erros e releitura seletiva dos pontos fracos.");
  lines.push("Data considerada para a prova: 01/11/2027.");
  lines.push("");
  lines.push("OBSERVAÇÃO PARA USO FORA DA PLATAFORMA");
  lines.push("------------------------------------------------------------");
  lines.push("Este documento pode ser fornecido integralmente a um tutor ou assistente de estudos como contexto. Considere as datas, bibliografia, tarefas, progresso e métricas aqui registradas. Como o plano ESTIBORDO é adaptativo, uma exportação posterior substitui esta versão quando houver divergência.");
  lines.push("");
  lines.push("============================================================");
  lines.push("Gerado automaticamente pela ESTIBORDO.");

  const body="\uFEFF"+lines.join("\r\n");
  const filename=`Plano-de-Estudos-ESTIBORDO-${start}.txt`;
  return new Response(body,{headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":`attachment; filename="${filename}"`,"Cache-Control":"no-store"}});
}
