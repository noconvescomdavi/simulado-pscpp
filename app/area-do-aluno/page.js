import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getIntegratedStudyPlan} from "../../lib/integrated-study-plan";
import {getUserAccess} from "../../lib/access";
import {query} from "../../lib/db";
import {normalizeSubject,subjectLabel,SUBJECTS} from "../../lib/subjects";
import StudentHeader from "../components/StudentHeader";
import ExamCountdown from "../components/ExamCountdown";
import {consistencyFromDays} from "../../lib/consistency-summary";
import { unstable_cache } from "next/cache";
import "./dashboard.css";

function fmt(v){return new Intl.NumberFormat("pt-BR").format(Number(v||0))}
function firstName(value){const text=String(value||"Aluno").trim();return text.split(/\s+/)[0]||"Aluno"}

// Dados de referência que não precisam ser recalculados a cada navegação.
// Mantemos os dados pessoais/atividade fora deste cache.
const cachedAccess = unstable_cache(async(userId)=>getUserAccess(userId),["dashboard-access"],{revalidate:60});

export const preferredRegion = "gru1";

export default async function Area(){
  const session=await getSession();
  if(!session)redirect("/login");

  const dataStarted=Date.now();
  const [access,progress,performance,profile,recentExams,learning,studyDays,studentIntel,integratedPlan]=await Promise.all([
    cachedAccess(session.id),
    query("select subject,percent from study_progress where user_id=$1",[session.id]),
    Promise.all([
      query(`select subject,count(*)::int attempts,coalesce(sum(duration_seconds),0)::int duration_seconds from exam_attempts where user_id=$1 group by subject`,[session.id]),
      query(`select subject,coalesce(sum(answer_count),0)::int questions,coalesce(sum(correct_count),0)::int correct,coalesce(sum(error_count),0)::int errors from question_stats where user_id=$1 and answer_count>0 group by subject`,[session.id])
    ]).then(([attempts,answers])=>{
      const am=new Map(),qm=new Map();
      for(const r of attempts.rows){const key=normalizeSubject(r.subject),v=am.get(key)||{attempts:0,duration_seconds:0};v.attempts+=Number(r.attempts||0);v.duration_seconds+=Number(r.duration_seconds||0);am.set(key,v)}
      for(const r of answers.rows){const key=normalizeSubject(r.subject),v=qm.get(key)||{questions:0,correct:0,errors:0};v.questions+=Number(r.questions||0);v.correct+=Number(r.correct||0);v.errors+=Number(r.errors||0);qm.set(key,v)}
      const subjects=SUBJECTS.map(s=>{const a=am.get(s.slug)||{},q=qm.get(s.slug)||{};const questions=Number(q.questions||0),correct=Number(q.correct||0);return{...s,attempts:Number(a.attempts||0),duration_seconds:Number(a.duration_seconds||0),questions,correct,errors:Number(q.errors||0),accuracy:questions?Math.round(correct/questions*1000)/10:0}});
      const overall=subjects.reduce((x,s)=>({attempts:x.attempts+s.attempts,duration_seconds:x.duration_seconds+s.duration_seconds,questions:x.questions+s.questions,correct:x.correct+s.correct,errors:x.errors+s.errors}),{attempts:0,duration_seconds:0,questions:0,correct:0,errors:0});
      overall.accuracy=overall.questions?Math.round(overall.correct/overall.questions*1000)/10:0;
      const totalAnswered=answers.rows.reduce((sum,row)=>sum+Number(row.questions||0),0);
      return{subjects,overall,totalAnswered};
    }),
    query("select full_name from user_profiles where user_id=$1 limit 1",[session.id]).catch(()=>({rows:[]})),
    query("select id,subject,status,answered_count,correct_count,started_at from exam_sessions where user_id=$1 order by started_at desc limit 4",[session.id]).catch(()=>({rows:[]})),
    query(`select subject_slug,topic_code,topic_label,mastery_score,confidence_score,answers,errors,last_activity_at from student_topic_mastery where user_id=$1 order by mastery_score asc,errors desc`,[session.id]).then(r=>{const topics=r.rows.map(x=>({...x,subject:x.subject_slug,topic:x.topic_label}));const populated=new Map();for(const x of topics){const a=populated.get(x.subject)||{sum:0,weight:0};const w=Math.max(1,Number(x.confidence_score||0));a.sum+=Number(x.mastery_score||0)*w;a.weight+=w;populated.set(x.subject,a)}const vals=[...populated.values()].map(x=>x.weight?x.sum/x.weight:0);return{overall_mastery:vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*10)/10:0,weakest_topics:topics.slice(0,10)}}).catch(()=>({overall_mastery:0,weakest_topics:[]})),
    query(`select study_date from study_days where user_id=$1 and activity_count>0 order by study_date desc limit 365`,[session.id]),
    query(`select count(*)::int as due from student_review_queue where user_id=$1 and source_type='topic' and state<>'suspended' and due_at<=now()`,[session.id]).then(r=>({due:Number(r.rows[0]?.due||0)})).catch(()=>({due:0}))
  ]);
  if(Date.now()-dataStarted>500)console.warn("[perf] dashboard_data_slow",{elapsed_ms:Date.now()-dataStarted});
  const consistency=consistencyFromDays(studyDays.rows,performance.totalAnswered);
  const tracking=integratedPlan?.tracking||{};
  const weekMinutes=Number(tracking?.study_time?.week_minutes||0);
  const adherence=Number(tracking?.adherence_percent??0);
  const backlogCount=Number(tracking?.backlog_count||0);
  const projectedFinish=integratedPlan?.first_pass?.projected_finish||null;
  const projectedOnTrack=integratedPlan?.first_pass?.on_track===true;

  const active=access?.active===true;
  const mastery=Number(learning?.overall_mastery||0);
  const name=firstName(profile.rows[0]?.full_name||session.email.split("@")[0]);
  const pm=Object.fromEntries(progress.rows.map(r=>[normalizeSubject(r.subject),Number(r.percent||0)]));
  const pv=performance.subjects.map(s=>pm[s.slug]||0);
  const overall=pv.length?Math.round(pv.reduce((a,b)=>a+b,0)/pv.length):0;
  const ranked=[...performance.subjects].filter(s=>s.questions>0).sort((a,b)=>b.accuracy-a.accuracy);
  const strongest=ranked[0]||null;
  const weakest=ranked.length?ranked[ranked.length-1]:null;
  const examAttempts=Number(integratedPlan?.metrics?.overall?.attempts??performance.overall.attempts??0);
  const examCoverage=Math.min(100,Math.round((examAttempts/7)*100));
  const volumeScore=Math.min(100,Math.round((Number(performance.overall.questions||0)/1000)*100));
  const legacyReadiness=Math.round(
    Number(performance.overall.accuracy||0)*0.45+
    overall*0.30+
    examCoverage*0.15+
    volumeScore*0.10
  );
  const readiness=Math.round(Math.max(0,Math.min(100,mastery*.8+legacyReadiness*.2)));
  const readinessLabel=readiness>=85?"Muito forte":readiness>=70?"Competitivo":readiness>=50?"Em evolução":"Construindo base";
  const weakTopic=learning?.weakest_topics?.[0]||null;
  const dashboardInsights=[];
  if(weakTopic)dashboardInsights.push({kind:"weakness",title:"Maior oportunidade de ganho",text:`${weakTopic.topic} está com domínio estimado de ${Math.round(Number(weakTopic.mastery_score||0))}% e ${weakTopic.errors||0} erros registrados.`,action:"Corrigir esta fraqueza",href:`/conteudos/banco-de-questoes?subject=${encodeURIComponent(weakTopic.subject)}`});
  if(Number(studentIntel?.due||0)>0)dashboardInsights.push({kind:"review",title:"Revisões vencendo hoje",text:`Você tem ${studentIntel.due} prioridade(s) de revisão.`,action:"Começar revisão",href:"/revisao-inteligente"});

  return (
    <>
      <StudentHeader active="painel" session={session}/>
      <main className="studentDashboardV2">
        <section className="studentWelcome">
          <div><span>PAINEL DO ALUNO</span><h1>Olá, {name} <b>👋</b></h1><p>Disciplina, foco e resultado. Mantenha o rumo até a Praticagem.</p></div>
          <div className="studentMotto"><span>GRANDES CONQUISTAS</span><strong>COMEÇAM COM CONSISTÊNCIA.</strong></div>
        </section>

        <section className="studentHeroBanner">
          <div className="studentHeroCopy"><small>ESTIBORDO</small><h2>DISCIPLINA HOJE,<br/>PRATICAGEM AMANHÃ.</h2><p>ESTUDO • ESTRATÉGIA • RESULTADO</p></div>
          <div className={`studentAccessCard ${active?"isActive":"isTrial"}`}>
            <span>SUA ASSINATURA</span><strong>{active?"Ativa":"Teste Grátis"}</strong>
            <small>{active&&access?.expires_at?`Válida até ${new Date(access.expires_at).toLocaleDateString("pt-BR")}`:"Acesso limitado aos recursos gratuitos"}</small>
          </div>
          <ExamCountdown/>
        </section>

        <section className="commandDeck"><div><span>PRÓXIMA MISSÃO</span><h2>Abra o Plano de Hoje</h2><p>Leitura, fixação e revisão são carregadas sob demanda para manter o painel rápido.</p><a href="/hoje">Continuar agora →</a></div><div className="commandSignals"><span><b>{readiness}</b> prontidão</span><span><b>{studentIntel?.due||0}</b> revisões agora</span></div></section>

        <section className="studentFocusGrid"><article><span>PLANO DO DIA</span><strong>Carregamento sob demanda</strong><small>Abra a área Hoje para montar as tarefas atuais sem recalcular o plano em toda visita ao painel.</small><a href="/hoje">Abrir plano de hoje →</a></article><article><span>PONTO DE ATENÇÃO</span><strong>{weakest?weakest.label:"Aguardando dados"}</strong><small>{weakest?weakest.accuracy+"% de acerto — maior oportunidade de ganho.":"Responda questões para gerar o diagnóstico."}</small><a href="/treino-inteligente">Abrir treino →</a></article></section>



        <section className="insightsPanel"><div className="sectionTitle"><div><h2>ESTIBORDO Insights</h2><p>O que seus dados sugerem fazer em seguida.</p></div><a href="/centro-de-revisao">Centro de Revisão →</a></div><div className="insightsGrid">{dashboardInsights.map((insight,index)=><a href={insight.href} key={index}><span>{insight.kind}</span><strong>{insight.title}</strong><p>{insight.text}</p><b>{insight.action} →</b></a>)}{!dashboardInsights.length&&<article><strong>Continue estudando</strong><p>Assim que houver dados suficientes, seus padrões e recomendações aparecerão aqui.</p></article>}</div></section>

        <section className="dashboardSection">
          <div className="sectionTitle"><div><h2>Acesso Rápido</h2><p>Escolha o recurso que deseja utilizar:</p></div></div>
          <div className="quickGrid">
            <a className="quickCard blue" href="/simulado"><i>▣</i><div><strong>Gerar Simulado</strong><span>Treine com questões no estilo PSCPP</span></div><b>›</b></a>
            <a className="quickCard green" href="/conteudos/banco-de-questoes"><i>☷</i><div><strong>Gerar Caderno</strong><span>Monte seu banco de questões</span></div><b>›</b></a>
            <a className="quickCard blue" href="/minha-biblioteca"><i>▧</i><div><strong>Minha Biblioteca</strong><span>Leia seus PDFs do Google Drive na plataforma</span></div><b>›</b></a>
            <a className="quickCard purple" href="/flashcards/cis"><i>▤</i><div><strong>Flashcards CIS</strong><span>Treine o Código Internacional de Sinais</span></div><b>›</b></a>
            <a className="quickCard gold" href="#desempenho"><i>▥</i><div><strong>Meu Desempenho</strong><span>Acompanhe sua evolução</span></div><b>›</b></a>
            <a className={["quickCard","blue",!active?"premiumLocked":""].join(" ")} href="/plano-de-estudos"><i>◫</i><div><strong>Plano de Estudos</strong><span>Calendário inteligente até 01/11/2027</span></div><b>›</b></a>
            <a className={["quickCard","purple",!active?"premiumLocked":""].join(" ")} href="/treino-adaptativo"><i>◎</i><div><strong>Treino Inteligente</strong><span>A plataforma escolhe o que mais precisa</span></div><b>›</b></a>
            <a className={["quickCard","green",!active?"premiumLocked":""].join(" ")} href="/centro-de-revisao"><i>↻</i><div><strong>Centro de Revisão</strong><span>Erros, fraquezas e revisões em uma fila</span></div><b>›</b></a>
            <a className="quickCard ranking" href="/ranking"><i>★</i><div><strong>Ranking</strong><span>Compare seu desempenho acadêmico</span></div><b>›</b></a>
            <a className={["quickCard","maps",!active?"premiumLocked":""].join(" ")} href="/mapas-mentais"><i>🧠</i><div><strong>Mapas Mentais</strong><span>Construa e conecte suas anotações</span></div><b>›</b></a>
            <a className={["quickCard","gold",!active?"premiumLocked":""].join(" ")} href="/minha-trajetoria"><i>◉</i><div><strong>Minha Trajetória</strong><span>Domínio, aderência, tempo real e projeção até a prova</span></div><b>›</b></a>
          </div>
        </section>

        <section className="consistencyPanel">
          <div><span>SEQUÊNCIA ATUAL</span><strong>{consistency.streak} dias</strong><small>{consistency.study_days} dias estudados no histórico</small></div>
          <div className="badgeRow">
            {consistency.badges.map((badge)=><span key={badge.label} className={badge.earned?"earned":""}>{badge.earned?"✓ ":"○ "}{badge.label}</span>)}
          </div>
          <a href="/revisao-inteligente">Abrir Revisão Inteligente →</a>
          <a href="/analise-de-fraquezas">Ver análise por tópico →</a>
        </section>

        <section className="dashboardSection" id="desempenho">
          <div className="sectionTitle"><div><h2>Meu Progresso</h2><p>Acompanhe seus estudos em tempo real:</p></div><a href="#disciplinas">Ver estatísticas completas →</a></div>
          <div className="statsGridV2">
            <article><i>◎</i><div><span>Simulados</span><strong>{fmt(examAttempts)}</strong><small>Realizados</small></div></article>
            <article><i>▤</i><div><span>Questões</span><strong>{fmt(performance.overall.questions)}</strong><small>Respondidas</small></div></article>
            <article><i>▥</i><div><span>Aproveitamento</span><strong>{performance.overall.accuracy}%</strong><small>Média geral</small></div></article>
            <article><i>◷</i><div><span>Progresso</span><strong>{overall}%</strong><small>Conteúdo estudado</small></div></article>
            <article><i>◎</i><div><span>Domínio estimado</span><strong>{Math.round(mastery)}%</strong><small>Mastery Score</small></div></article>
            <article><i>◴</i><div><span>Tempo real</span><strong>{fmt(weekMinutes)} min</strong><small>Últimos 7 dias</small></div></article>
          </div>
        </section>

        <section className="readinessPanel">
          <div className="readinessScore">
            <span>ÍNDICE DE PRONTIDÃO ESTIBORDO</span>
            <strong>{readiness}<small>/100</small></strong>
            <b>{readinessLabel}</b>
          </div>
          <div className="readinessDetails">
            <div><span>Melhor disciplina</span><strong>{strongest?strongest.label:"Aguardando dados"}</strong><small>{strongest?`${strongest.accuracy}% de acerto`:"Responda questões para calcular"}</small></div>
            <div><span>Ponto de atenção</span><strong>{weakest?weakest.label:"Aguardando dados"}</strong><small>{weakest?`${weakest.accuracy}% de acerto`:"Responda questões para calcular"}</small></div>
            <div><span>Cobertura de simulados</span><strong>{examCoverage}%</strong><small>Meta de referência: 7 simulados</small></div>
            <div><span>Aderência ao plano</span><strong>{adherence}%</strong><small>{backlogCount} pendência(s) em aberto</small></div>
            <div><span>1ª leitura projetada</span><strong>{projectedFinish?new Date(projectedFinish+"T12:00:00").toLocaleDateString("pt-BR"):"—"}</strong><small>{projectedOnTrack?"Dentro do ritmo atual":"Risco de atraso no ritmo atual"}</small></div>
          </div>
        </section>

        <a className="bibliographyBanner" href="/conteudos"><div className="bookIcon">▦</div><div><strong>De acordo com a NOVA BIBLIOGRAFIA</strong><span>Revisão dos Anexos 2-A e 2-B da NORMAM-311/DPC.</span></div><b>Ver matérias e documentos →</b></a>

        <section className="dashboardColumns">
          <article className="activityPanel">
            <div className="panelHead"><h2>◷ Últimas Atividades</h2><a href="/simulado">Ver todas →</a></div>
            <div className="activityList">
              {recentExams.rows.length?recentExams.rows.map(exam=>{
                const answered=Number(exam.answered_count||0),correct=Number(exam.correct_count||0),accuracy=answered?Math.round((correct/answered)*100):0;
                return <a href={`/simulado/${exam.subject}`} key={exam.id}><i>▣</i><div><strong>Simulado de {subjectLabel(exam.subject)}</strong><span>{answered} questões • {accuracy}% de acerto</span></div><small>{new Date(exam.started_at).toLocaleDateString("pt-BR")}</small></a>
              }):<div className="emptyActivity">Seus simulados aparecerão aqui.</div>}
            </div>
          </article>

          <article className="newsPanel">
            <div className="panelHead"><h2>✦ Novidades</h2></div>
            <div className="newsList">
              <div><i>▤</i><div><strong>Banco de questões atualizado</strong><span>Estude utilizando os bancos disponíveis na plataforma.</span></div></div>
              <div><i>▦</i><div><strong>Nova Bibliografia PSCPP</strong><span>Conteúdo organizado de acordo com a NORMAM-311/DPC.</span></div></div>
              <div><i>◎</i><div><strong>Simulados por matéria</strong><span>Treine cada disciplina e acompanhe seu desempenho.</span></div></div>
            </div>
          </article>
        </section>

        <section className="disciplinePanel" id="disciplinas">
          <div className="panelHead"><h2>Desempenho por Disciplina</h2></div>
          <div className="disciplineGrid">
            {performance.subjects.map(s=><article key={s.slug}><div><strong>{s.label}</strong><span>{s.questions} questões respondidas</span></div><b>{s.accuracy}%</b><div className="disciplineBar"><i style={{width:`${s.accuracy}%`}}/></div></article>)}
          </div>
        </section>

        <footer className="studentDashFooter"><span>ESTIBORDO | Plataforma de estudos para o PSCPP</span><strong>Disciplina hoje. Praticagem amanhã. ⚓</strong></footer>
      </main>
    </>
  );
}
