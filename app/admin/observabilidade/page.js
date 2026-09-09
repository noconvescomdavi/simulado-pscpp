import {redirect} from "next/navigation";
import {getAdmin} from "../../../lib/admin";
import {query} from "../../../lib/db";
export const dynamic="force-dynamic";

function ms(n){return Number(n||0).toLocaleString("pt-BR",{maximumFractionDigits:1})}
export default async function Page(){
  if(!(await getAdmin("system.observe")))redirect("/admin");
  const started=Date.now();await query("select 1");const dbLatency=Date.now()-started;
  const [errors,perf,payments,limits,audit]=await Promise.all([
    query("select route,error_code,message,created_at from app_error_events where created_at>now()-interval '24 hours' order by created_at desc limit 40").catch(()=>({rows:[]})),
    query("select metric_name,count(*)::int samples,round(avg(metric_value)::numeric,1) avg_value,count(*) filter(where rating='poor')::int poor from app_performance_events where created_at>now()-interval '24 hours' group by metric_name order by metric_name").catch(()=>({rows:[]})),
    query("select status,count(*)::int total from payment_orders where created_at>now()-interval '24 hours' group by status order by total desc").catch(()=>({rows:[]})),
    query("select action,sum(attempts)::int attempts from auth_rate_limits where updated_at>now()-interval '1 hour' group by action order by attempts desc limit 12").catch(()=>({rows:[]})),
    query("select action,entity_type,created_at from admin_audit_log order by created_at desc limit 20").catch(()=>({rows:[]}))
  ]);
  return <main className="wrap admin-wrap"><div className="eyebrow">OPERAÇÃO</div><h1>Observabilidade</h1><p>Saúde técnica, erros, Core Web Vitals e sinais de abuso em produção.</p>
  <section className="metrics"><div className="metric"><span>BANCO</span><b>{dbLatency} ms</b><small>latência da consulta de saúde</small></div><div className="metric"><span>ERROS 24H</span><b>{errors.rows.length}</b><small>últimos eventos capturados</small></div><div className="metric"><span>VITAIS</span><b>{perf.rows.reduce((n,x)=>n+Number(x.samples||0),0)}</b><small>amostras em 24h</small></div><div className="metric"><span>STATUS</span><b>{dbLatency<500?"OK":"ATENÇÃO"}</b><small>saúde do banco</small></div></section>
  <h2 style={{marginTop:24}}>Core Web Vitals · 24h</h2><div className="grid">{perf.rows.length?perf.rows.map(x=><article className="card" key={x.metric_name}><span>{x.metric_name}</span><h2>{ms(x.avg_value)}</h2><p>{x.samples} amostras · {x.poor} classificadas como ruins</p></article>):<article className="card"><p>Aguardando amostras reais de navegação.</p></article>}</div>
  <h2 style={{marginTop:24}}>Pagamentos · 24h</h2><div className="grid">{payments.rows.map(x=><article className="card" key={x.status}><span>{x.status}</span><h2>{x.total}</h2></article>)}</div>
  <h2 style={{marginTop:24}}>Rate limiting · última hora</h2><div className="grid">{limits.rows.map(x=><article className="card" key={x.action}><span>{x.action}</span><h2>{x.attempts}</h2></article>)}</div>
  <h2 style={{marginTop:24}}>Erros recentes</h2><div className="panel table-scroll"><table className="admin-table"><thead><tr><th>Rota</th><th>Código</th><th>Mensagem</th><th>Data</th></tr></thead><tbody>{errors.rows.map((x,i)=><tr key={i}><td>{x.route}</td><td>{x.error_code}</td><td>{x.message}</td><td>{new Date(x.created_at).toLocaleString("pt-BR")}</td></tr>)}</tbody></table></div>
  <h2 style={{marginTop:24}}>Auditoria administrativa</h2><div className="panel table-scroll"><table className="admin-table"><thead><tr><th>Ação</th><th>Entidade</th><th>Data</th></tr></thead><tbody>{audit.rows.map((x,i)=><tr key={i}><td>{x.action}</td><td>{x.entity_type||"—"}</td><td>{new Date(x.created_at).toLocaleString("pt-BR")}</td></tr>)}</tbody></table></div>
  </main>;
}
