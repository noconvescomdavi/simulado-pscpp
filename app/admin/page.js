import {query} from "../../lib/db";
export const dynamic="force-dynamic";
export default async function Page(){
 const u=(await query(`select count(*) filter(where role='student')::int students,count(*) filter(where status='blocked')::int blocked from users`)).rows[0]||{};
 const a=(await query(`select count(*) filter(where status='active' and expires_at>now())::int active from user_access`)).rows[0]||{};
 const p=(await query(`select count(*) filter(where status='approved')::int approved from payment_orders`)).rows[0]||{};
 const e=(await query("select count(*)::int exams from exam_sessions")).rows[0]||{};
 return <main className="wrap admin-wrap">
   <div className="admin-heading"><div><div className="eyebrow">ADMINISTRAÇÃO</div><h1>Painel administrativo</h1><p>Acompanhe os principais indicadores operacionais da plataforma e acesse rapidamente as áreas de gestão.</p></div></div>
   <section className="metrics admin-metrics">
    <div className="metric"><span>ALUNOS</span><b>{u.students||0}</b><small>{u.blocked||0} bloqueados</small></div>
    <div className="metric"><span>ACESSOS ATIVOS</span><b>{a.active||0}</b><small>licenças válidas</small></div>
    <div className="metric"><span>PAGAMENTOS</span><b>{p.approved||0}</b><small>pedidos aprovados</small></div>
    <div className="metric"><span>SIMULADOS</span><b>{e.exams||0}</b><small>sessões registradas</small></div>
   </section>
   <section className="section"><div className="grid"><a className="card" href="/admin/usuarios"><h3>Gerenciar usuários</h3><p>Consulte alunos, status de conta e acessos.</p></a><a className="card" href="/admin/questoes"><h3>Bancos de questões</h3><p>Confira os bancos disponíveis e seus volumes.</p></a><a className="card" href="/admin/metricas"><h3>Métricas</h3><p>Acompanhe o uso e o desempenho da plataforma.</p></a></div></section>
 </main>
}