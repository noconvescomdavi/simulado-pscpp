import {getSession} from "../../../../lib/auth";
import {getIntegratedStudyPlan} from "../../../../lib/integrated-study-plan";

export const dynamic="force-dynamic";
export const maxDuration=60;

const TZ="America/Sao_Paulo";
const clean=v=>String(v??"").replace(/\r?\n/g," ").trim();
const iso=d=>new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
const br=s=>s?new Intl.DateTimeFormat("pt-BR",{timeZone:TZ,day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(String(s).slice(0,10)+"T12:00:00-03:00")):"não informado";
const pct=v=>Number.isFinite(Number(v))?Number(v):0;
function confidence(n){
  n=Number(n||0);
  if(n>=100)return "alta";
  if(n>=30)return "moderada";
  if(n>0)return "baixa";
  return "sem amostra";
}
function state(s){
  const q=Number(s.questions||0),a=Number(s.accuracy||0);
  if(!q)return "SEM DADOS";
  if(q<10)return "AMOSTRA INSUFICIENTE";
  if(a<60)return "BAIXO DOMÍNIO";
  if(a<80)return "EM DESENVOLVIMENTO";
  if(a<90)return "BOM DOMÍNIO";
  return "DOMÍNIO FORTE — manter revisão espaçada";
}
function pushSection(lines,title){
  lines.push("",title,"=".repeat(72));
}
function taskText(lines,day,task,i){
  lines.push(`  [${task.status==="done"?"X":" "}] ${i+1}. ${clean(task.title)}`);
  lines.push(`      Tipo: ${clean(task.type)} | Matéria: ${clean(task.subject||"—")} | Tempo estimado: ${Number(task.estimate_minutes||task.minutes||0)} min`);
  if(task.description)lines.push(`      Instrução: ${clean(task.description)}`);
  if(task.page_from&&task.page_to)lines.push(`      Páginas: ${task.page_from}–${task.page_to}`);
  if(task.target_questions)lines.push(`      Questões-alvo: ${task.target_questions}`);
  if(task.reason)lines.push(`      Justificativa adaptativa: ${clean(task.reason)}`);
  if(task.reprogrammed)lines.push(`      Reprogramada da data original: ${br(task.source_plan_date)}`);
}

export async function GET(){
  const session=await getSession();
  if(!session)return new Response("Não autenticado.",{status:401});
  const p=await getIntegratedStudyPlan(session.id,0);
  if(p.needs_onboarding)return new Response("Configure primeiro seu Plano de Estudos.",{status:409});

  const generated=iso(new Date()),m=p.metrics||{},o=m.overall||{},t=p.tracking||{},fp=p.first_pass||{};
  const subjects=m.subjects||[],weighted=p.weighted_subjects||[],bib=p.bibliography||[];
  const lines=[];

  lines.push("ESTIBORDO — DOSSIÊ ACADÊMICO DO ALUNO + CONTEXTO PARA TUTOR IA");
  lines.push("=".repeat(72));
  lines.push("Data do snapshot: "+br(generated));
  lines.push("Prova-alvo: "+br(p.exam_date)+" | Dias restantes: "+p.days_left+" | Semanas restantes: "+p.weeks_left);
  lines.push("Fase atual: "+clean(p.phase?.label)+" | Índice de prontidão: "+p.readiness+"%");
  lines.push("Este arquivo é um snapshot. Dados posteriores à geração não estão refletidos.");

  pushSection(lines,"1. INSTRUÇÕES OPERACIONAIS PARA O TUTOR/MENTOR IA");
  lines.push("Use este dossiê como estado acadêmico inicial do aluno para preparação ao PSCPP.");
  lines.push("Trabalhe como tutor individual: ensine, diagnostique, cobre execução, revise erros e adapte prioridades.");
  lines.push("Regras:");
  lines.push("- Nunca trate 0 questões respondidas como 0% de domínio: classifique como SEM DADOS.");
  lines.push("- Considere o tamanho da amostra antes de confiar em um percentual de acerto.");
  lines.push("- Diferencie ausência de dados, baixa proficiência, conteúdo em desenvolvimento e conteúdo consolidado.");
  lines.push("- Priorize fraquezas comprovadas sem abandonar manutenção espaçada dos pontos fortes.");
  lines.push("- Para conteúdo novo, ensine antes de testar; para conteúdo estudado, use recuperação ativa e questões.");
  lines.push("- Use erros reincidentes, tópicos fracos, pendências e revisões vencidas antes de aumentar conteúdo novo.");
  lines.push("- Respeite a capacidade diária declarada. Não empilhe tarefas acima dela sem justificar a compensação.");
  lines.push("- Ao iniciar uma sessão, consulte primeiro o plano de hoje e pergunte o que já foi executado.");
  lines.push("- Quando o aluno informar novos resultados, trate-os como atualização posterior a este snapshot.");

  pushSection(lines,"2. PERFIL E CAPACIDADE DE ESTUDO");
  lines.push("Experiência declarada: "+clean(p.onboarding?.experience_level||"não informada"));
  lines.push("Já havia iniciado os estudos: "+(p.onboarding?.started_before?"sim":"não"));
  lines.push("Meses estudando informados: "+Number(p.onboarding?.months_studying||0));
  lines.push("Capacidade diária: "+Number(p.onboarding?.daily_minutes||0)+" min");
  lines.push("Meta diária de leitura: "+Number(p.onboarding?.reading_minutes_target||0)+" min");
  lines.push("Dias de estudo (ISO 1=seg ... 7=dom): "+(p.onboarding?.study_days||[]).join(", "));
  lines.push("Matérias declaradas como já estudadas: "+((p.onboarding?.studied_subjects||[]).join(", ")||"nenhuma"));
  if(p.onboarding?.notes)lines.push("Observações do aluno: "+clean(p.onboarding.notes));

  pushSection(lines,"3. DIAGNÓSTICO GLOBAL");
  lines.push("Questões respondidas: "+Number(o.questions||0));
  lines.push("Acertos: "+Number(o.correct||0)+" | Erros: "+Number(o.errors||0)+" | Aproveitamento global: "+pct(o.accuracy)+"%");
  lines.push("Mastery global do motor de aprendizagem: "+pct(t.overall_mastery)+"%");
  lines.push("Índice de prontidão composto: "+p.readiness+"%");
  lines.push("Aderência últimos 30 dias: "+pct(t.adherence_percent)+"% ("+Number(t.past_done||0)+"/"+Number(t.past_planned||0)+" metas concluídas)");
  lines.push("Pendências: "+Number(t.backlog_count||0)+" tarefas | "+Number(t.backlog_minutes||0)+" min");
  lines.push("Saúde do cronograma: "+clean(t.schedule_health||"não calculada"));
  lines.push("Tempo real: hoje "+Number(t.study_time?.today_minutes||0)+" min | semana "+Number(t.study_time?.week_minutes||0)+" min | mês "+Number(t.study_time?.month_minutes||0)+" min");
  lines.push("Sessões na semana: "+Number(t.study_time?.week_sessions||0));

  pushSection(lines,"4. MATRIZ DE DOMÍNIO POR MATÉRIA");
  subjects.forEach((s,i)=>{
    lines.push(`${i+1}. ${clean(s.label)}`);
    lines.push(`   Questões: ${Number(s.questions||0)} | Acertos: ${Number(s.correct||0)} | Erros: ${Number(s.errors||0)} | Aproveitamento: ${pct(s.accuracy)}%`);
    lines.push(`   Estado: ${state(s)} | Confiabilidade estatística da amostra: ${confidence(s.questions)}`);
    const w=weighted.find(x=>x.slug===s.slug);
    if(w)lines.push(`   Mastery: ${pct(w.mastery_score)}% | Tópicos críticos: ${Number(w.critical_topics||0)} | Peso adaptativo: ${Math.round(Number(w.weight||0)*10)/10}`);
    const self=p.onboarding?.confidence_by_subject?.[s.slug];
    if(self)lines.push(`   Autoconfiança declarada: ${self}/5`);
  });

  pushSection(lines,"5. PRIORIDADES ADAPTATIVAS ATUAIS");
  weighted.forEach((s,i)=>lines.push(`${i+1}. ${clean(s.label)} — estado: ${state(s)} | ${Number(s.questions||0)} respostas | ${pct(s.accuracy)}% | mastery ${pct(s.mastery_score)}% | peso ${Math.round(Number(s.weight||0)*10)/10}`));
  lines.push("Nota ao Tutor: a ordem acima vem do motor adaptativo; matérias sem amostra representam necessidade de diagnóstico/cobertura, não fracasso comprovado.");

  pushSection(lines,"6. TÓPICOS MAIS FRACOS IDENTIFICADOS PELO MOTOR");
  if((t.weakest_topics||[]).length) (t.weakest_topics||[]).forEach((x,i)=>lines.push(`${i+1}. ${clean(x.label||x.topic||x.name||x.slug||JSON.stringify(x))}`));
  else lines.push("Ainda não há tópicos fracos específicos suficientes registrados.");

  pushSection(lines,"7. BIBLIOGRAFIA E PRIMEIRA PASSAGEM");
  lines.push("Unidades: "+Number(p.bibliography_progress?.done||0)+" concluídas de "+Number(p.bibliography_progress?.total||0)+" ("+pct(p.bibliography_progress?.percent)+"%)");
  lines.push("Páginas conhecidas: "+Number(fp.known_pages_completed||0)+" concluídas / "+Number(fp.known_pages_total||0)+" totais / "+Number(fp.known_pages_remaining||0)+" restantes");
  lines.push("Unidades sem paginação cadastrada: "+Number(fp.units_pending_pagination||0));
  lines.push("Meta interna: "+br(fp.internal_target)+" | Prazo oficial da 1ª passagem: "+br(fp.deadline));
  lines.push("Projeção de término: "+br(fp.projected_finish)+" | Margem interna: "+(fp.margin_days??"n/d")+" dias | Margem oficial: "+(fp.official_margin_days??"n/d")+" dias");
  lines.push("Ritmo real de leitura: "+(fp.actual_pages_per_reading_day??"sem amostra")+" pág/dia de leitura | Capacidade estimada: "+(fp.capacity_pages_per_reading_day??"n/d")+" pág/dia");
  lines.push("Situação da primeira passagem: "+(fp.on_track?"NO PRAZO":"ATRASADA/EM RISCO")+(fp.provisional?" — projeção provisória por haver unidades sem paginação":""));
  for(const item of bib){
    const st=item.progress?.status==="done"?"DONE":item.progress?.status==="reading"?"EM LEITURA":"PENDENTE";
    const pages=item.page_start&&item.page_end?` | p. ${item.page_start}–${item.page_end}`:" | paginação não cadastrada";
    lines.push(`[${st}] ${clean(item.publication)} — ${clean(item.chapter||item.section)}${pages} | matéria: ${clean(item.subject_slug)}`);
  }

  pushSection(lines,"8. PENDÊNCIAS E RECUPERAÇÃO");
  if((t.backlog||[]).length)(t.backlog||[]).forEach((x,i)=>lines.push(`${i+1}. [${br(x.source_plan_date)}] ${clean(x.title)} | ${clean(x.subject||"—")} | ~${Number(x.estimate_minutes||0)} min`));
  else lines.push("Nenhuma pendência registrada no snapshot.");
  lines.push("Capacidade de recuperação disponível na semana exibida: "+Number(t.recovery_capacity_minutes||0)+" min");

  pushSection(lines,"9. PLANO DA SEMANA ATUAL");
  lines.push("Período: "+br(p.week?.start)+" a "+br(p.week?.end));
  for(const day of p.week?.days||[]){
    lines.push("",br(day.iso)+(day.unavailable?" — INDISPONÍVEL":""));
    if(!day.active){lines.push("  Dia sem estudo programado.");continue;}
    if(day.unavailable)lines.push("  Motivo: "+clean(day.unavailable.reason||day.unavailable.note||"não informado"));
    if(!(day.tasks||[]).length)lines.push("  Sem tarefas.");
    (day.tasks||[]).forEach((task,i)=>taskText(lines,day,task,i));
  }

  pushSection(lines,"10. MARCOS E ESTRATÉGIA MACRO");
  for(const ph of p.phases||[])lines.push(`- ${clean(ph.label)} | ${clean(ph.from)} → ${clean(ph.to)} | Foco: ${clean(ph.focus)}`);
  lines.push("- Prova-alvo: "+br(p.exam_date));

  pushSection(lines,"11. PROTOCOLO DE SESSÃO PARA O TUTOR IA");
  lines.push("Ao receber este arquivo:");
  lines.push("1) Faça uma leitura silenciosa do diagnóstico antes de orientar o aluno.");
  lines.push("2) Identifique a data atual e compare com o snapshot e o plano semanal.");
  lines.push("3) Pergunte quais tarefas previstas desde o snapshot foram realmente concluídas.");
  lines.push("4) Atualize mentalmente o estado com os resultados novos informados pelo aluno.");
  lines.push("5) Escolha o próximo bloco respeitando capacidade diária, pendências e prioridade adaptativa.");
  lines.push("6) Ao corrigir questões, registre conceitualmente: matéria, tópico, tipo de erro, reincidência e ação de recuperação.");
  lines.push("7) Se houver baixa amostra, faça diagnóstico antes de concluir que há fraqueza.");
  lines.push("8) Se houver alto desempenho com amostra robusta, reduza frequência, mas mantenha revisão espaçada.");
  lines.push("9) Termine a sessão com: realizado, desempenho, erros-chave, revisão necessária e próximo passo.");
  lines.push("10) Recomende nova exportação deste dossiê quando as métricas da plataforma mudarem materialmente.");

  pushSection(lines,"12. PROMPT DE CONTINUIDADE");
  lines.push("Você é meu Tutor/Mentor PSCPP. Use o dossiê ESTIBORDO acima como meu estado acadêmico inicial. Conduza minha preparação de forma adaptativa, baseada em evidências e na bibliografia/plano registrados. Não confunda ausência de amostra com baixo domínio. Comece identificando o que está previsto para hoje, minhas pendências e o objetivo pedagógico da sessão.");

  lines.push("","=".repeat(72),"Fim do snapshot ESTIBORDO.");
  const body="\uFEFF"+lines.join("\r\n");
  return new Response(body,{headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":`attachment; filename="Dossie-Tutor-IA-ESTIBORDO-${generated}.txt"`,"Cache-Control":"no-store"}});
}
