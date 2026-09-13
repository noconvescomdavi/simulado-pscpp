import {redirect} from "next/navigation";
import {getSession} from "../../../lib/auth";
import {getIntegratedStudyPlan} from "../../../lib/integrated-study-plan";
import StudentHeader from "../../components/StudentHeader";
export const dynamic="force-dynamic";
export default async function Pendencias(){
 const session=await getSession();if(!session)redirect("/login?next=/plano-de-estudos/pendencias");
 const plan=await getIntegratedStudyPlan(session.id,0);if(plan.needs_onboarding)redirect("/plano-de-estudos/configurar");
 const backlog=plan.tracking?.backlog||[];
 return <><StudentHeader active="plano"/><main className="wrap" style={{paddingTop:110}}><span className="eyebrow">PLANO DE ESTUDOS</span><h1>Tarefas pendentes</h1><p>{backlog.length} pendência(s) em aberto. Ao concluir a tarefa original, ela sai desta fila e das reprogramações futuras.</p><div className="grid">{backlog.map(t=><article className="card" id={encodeURIComponent(t.source_plan_date+"|"+t.key)} key={t.source_plan_date+"|"+t.key}><span>Original: {t.source_plan_date.split("-").reverse().join("/")}</span><h3>{t.title}</h3><p>{t.description}</p><a className="btn primary" href={t.href||"/plano-de-estudos"}>Abrir tarefa →</a></article>)}{!backlog.length&&<article className="card"><h2>Sem pendências</h2><p>Seu backlog está em dia.</p></article>}</div></main></>;
}