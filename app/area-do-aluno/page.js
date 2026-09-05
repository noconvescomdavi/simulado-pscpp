import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getUserAccess} from "../../lib/access";
import {query} from "../../lib/db";
import {getUserMetrics} from "../../lib/metrics";
import {normalizeSubject,subjectLabel} from "../../lib/subjects";
import StudentHeader from "../components/StudentHeader";
import ExamCountdown from "../components/ExamCountdown";
import "./dashboard.css";

function fmt(v){return new Intl.NumberFormat("pt-BR").format(Number(v||0))}
function firstName(value){const text=String(value||"Aluno").trim();return text.split(/\s+/)[0]||"Aluno"}

export default async function Area(){
  const session=await getSession();
  if(!session)redirect("/login");

  const [access,progress,performance,profile,recentExams]=await Promise.all([
    getUserAccess(session.id),
    query("select subject,percent from study_progress where user_id=$1",[session.id]),
    getUserMetrics(session.id),
    query("select full_name from user_profiles where user_id=$1 limit 1",[session.id]).catch(()=>({rows:[]})),
    query("select id,subject,status,answered_count,correct_count,started_at from exam_sessions where user_id=$1 order by started_at desc limit 4",[session.id]).catch(()=>({rows:[]}))
  ]);

  const active=access?.active===true;
  const name=firstName(profile.rows[0]?.full_name||session.email.split("@")[0]);
  const pm=Object.fromEntries(progress.rows.map(r=>[normalizeSubject(r.subject),Number(r.percent||0)]));
  const pv=performance.subjects.map(s=>pm[s.slug]||0);
  const overall=pv.length?Math.round(pv.reduce((a,b)=>a+b,0)/pv.length):0;

  return (
    <>
      <StudentHeader active="painel"/>
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

        <section className="dashboardSection">
          <div className="sectionTitle"><div><h2>Acesso Rápido</h2><p>Escolha o recurso que deseja utilizar:</p></div></div>
          <div className="quickGrid">
            <a className="quickCard blue" href="/simulado"><i>▣</i><div><strong>Gerar Simulado</strong><span>Treine com questões no estilo PSCPP</span></div><b>›</b></a>
            <a className="quickCard green" href="/conteudos/banco-de-questoes"><i>☷</i><div><strong>Gerar Caderno</strong><span>Monte seu banco de questões</span></div><b>›</b></a>
            <a className="quickCard purple" href="/flashcards/cis"><i>▤</i><div><strong>Flashcards CIS</strong><span>Treine o Código Internacional de Sinais</span></div><b>›</b></a>
            <a className="quickCard gold" href="#desempenho"><i>▥</i><div><strong>Meu Desempenho</strong><span>Acompanhe sua evolução</span></div><b>›</b></a>
          </div>
        </section>

        <section className="dashboardSection" id="desempenho">
          <div className="sectionTitle"><div><h2>Meu Progresso</h2><p>Acompanhe seus estudos em tempo real:</p></div><a href="#disciplinas">Ver estatísticas completas →</a></div>
          <div className="statsGridV2">
            <article><i>◎</i><div><span>Simulados</span><strong>{fmt(performance.overall.attempts)}</strong><small>Realizados</small></div></article>
            <article><i>▤</i><div><span>Questões</span><strong>{fmt(performance.overall.questions)}</strong><small>Respondidas</small></div></article>
            <article><i>▥</i><div><span>Aproveitamento</span><strong>{performance.overall.accuracy}%</strong><small>Média geral</small></div></article>
            <article><i>◷</i><div><span>Progresso</span><strong>{overall}%</strong><small>Conteúdo estudado</small></div></article>
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
