import {redirect} from "next/navigation";
import {getAdmin} from "../../../lib/admin";
import {query} from "../../../lib/db";
export const dynamic="force-dynamic";

function pct(a,b){return Number(b||0)?Math.round((Number(a||0)/Number(b))*1000)/10:0}

export default async function Page(){if(!(await getAdmin("metrics.view")))redirect("/admin");
  const [answers, funnel, revenue, errors, learning] = await Promise.all([
    query(`select count(*)::int total,count(*) filter(where is_correct)::int correct from question_answers`),
    query(`
      select
        (select count(*) from users where role='student')::int registrations,
        (select count(distinct user_id) from question_answers)::int activated_students,
        (select count(distinct user_id) from exam_sessions)::int exam_students,
        (select count(distinct user_id) from payment_orders where status='approved')::int buyers
    `),
    query(`select coalesce(sum(amount_cents) filter(where status='approved'),0)::bigint approved_cents,
                  count(*) filter(where status='approved')::int approved_orders
             from payment_orders`),
    query(`select count(*)::int total from app_error_events where created_at>now()-interval '24 hours'`).catch(()=>({rows:[{total:0}]})),
    query(`
      select
        (select count(*) from student_plan_snapshots)::int snapshots,
        (select count(*) from student_plan_task_progress where status='pending' and plan_date<current_date)::int overdue_tasks,
        (select count(*) from student_plan_reschedules where status='active')::int active_reschedules,
        (select count(distinct user_id) from student_plan_events where occurred_at>now()-interval '30 days')::int active_plan_students,
        (select coalesce(round(avg(mastery_score),1),0) from student_topic_mastery)::numeric avg_mastery,
        (select coalesce(sum(duration_seconds),0)::bigint from student_study_sessions where started_at>now()-interval '7 days')::bigint study_seconds_7d,
        (select count(*) from student_plan_unavailability where plan_date>=current_date-30)::int unavailable_days_30d
    `).catch(()=>({rows:[{}]}))
  ]);

  const x=answers.rows[0]||{},f=funnel.rows[0]||{},r=revenue.rows[0]||{},l=learning.rows[0]||{};
  const registrations=Number(f.registrations||0),activated=Number(f.activated_students||0),exam=Number(f.exam_students||0),buyers=Number(f.buyers||0);

  return <main className="wrap admin-wrap">
    <h1>Métricas</h1>
    <section className="metrics">
      <div className="metric"><span>RESPOSTAS</span><b>{x.total||0}</b></div>
      <div className="metric"><span>APROVEITAMENTO</span><b>{x.total?Math.round(100*x.correct/x.total):0}%</b></div>
      <div className="metric"><span>RECEITA APROVADA</span><b>R$ {(Number(r.approved_cents||0)/100).toLocaleString("pt-BR",{minimumFractionDigits:2})}</b></div>
      <div className="metric"><span>ERROS 24H</span><b>{errors.rows[0]?.total||0}</b></div>
    </section>

    <h2 style={{marginTop:24}}>Funil de conversão</h2>
    <div className="grid">
      <article className="card"><span>1. CADASTROS</span><h2>{registrations}</h2><p>100% da base estudantil</p></article>
      <article className="card"><span>2. PRIMEIRA ATIVIDADE</span><h2>{activated}</h2><p>{pct(activated,registrations)}% dos cadastrados</p></article>
      <article className="card"><span>3. SIMULADO</span><h2>{exam}</h2><p>{pct(exam,registrations)}% dos cadastrados</p></article>
      <article className="card"><span>4. COMPRA</span><h2>{buyers}</h2><p>{pct(buyers,registrations)}% de conversão total</p></article>
    </div>

    <h2 style={{marginTop:24}}>Learning Engine</h2>
    <div className="grid">
      <article className="card"><span>SNAPSHOTS</span><h2>{l.snapshots||0}</h2><p>semanas congeladas com histórico imutável</p></article>
      <article className="card"><span>PENDÊNCIAS ATRASADAS</span><h2>{l.overdue_tasks||0}</h2><p>tarefas ainda abertas em datas anteriores</p></article>
      <article className="card"><span>REPROGRAMAÇÕES ATIVAS</span><h2>{l.active_reschedules||0}</h2><p>recuperações adaptativas em andamento</p></article>
      <article className="card"><span>DOMÍNIO MÉDIO</span><h2>{Number(l.avg_mastery||0)}%</h2><p>Mastery Score dos tópicos medidos</p></article>
      <article className="card"><span>TEMPO REAL · 7 DIAS</span><h2>{Math.round(Number(l.study_seconds_7d||0)/60)} min</h2><p>sessões de estudo efetivamente registradas</p></article>
      <article className="card"><span>ALUNOS ATIVOS NO PLANO</span><h2>{l.active_plan_students||0}</h2><p>com eventos no Learning Engine em 30 dias</p></article>
      <article className="card"><span>DIAS INDISPONÍVEIS</span><h2>{l.unavailable_days_30d||0}</h2><p>informados pelos alunos em 30 dias</p></article>
    </div>

    <h2 style={{marginTop:24}}>Indicadores comerciais</h2>
    <div className="grid">
      <article className="card"><h3>Ativação → compra</h3><b>{pct(buyers,activated)}%</b></article>
      <article className="card"><h3>Simulado → compra</h3><b>{pct(buyers,exam)}%</b></article>
      <article className="card"><h3>Pedidos aprovados</h3><b>{r.approved_orders||0}</b></article>
    </div>
  </main>
}