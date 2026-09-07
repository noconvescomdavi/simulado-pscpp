import {redirect} from "next/navigation";
import {getSession} from "../../../lib/auth";
import {getEntitlement} from "../../../lib/entitlement";
import {createNotebook} from "../../../lib/notebooks";

export const dynamic="force-dynamic";

export default async function FixacaoPage({searchParams}){
  const session=await getSession();
  if(!session)redirect("/login?next=/plano-de-estudos");

  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar");

  const q=await searchParams;
  const subject=String(q?.materia||"").trim();
  const bibliographyKey=String(q?.bibliografia||"").trim();
  const sectionKey=String(q?.secao||"").trim();
  const chapter=String(q?.capitulo||"").trim();
  const publication=String(q?.publicacao||"").trim();
  const planDate=String(q?.plan_date||"").trim();
  const taskKey=String(q?.task_key||"").trim();

  if(!subject||!bibliographyKey||!sectionKey)redirect("/plano-de-estudos");

  const result=await createNotebook(session.id,{
    subjects:[subject],
    count:entitlement.trial?10:100,
    fixation:{
      bibliography_key:bibliographyKey,
      section_key:sectionKey,
      publication,
      chapter
    },
    title:"Fixação — "+(publication||subject)+" — "+(chapter||sectionKey)
  });

  if(result?.notebook?.id){
    const tracking=new URLSearchParams();
    if(planDate)tracking.set("plan_date",planDate);
    if(taskKey)tracking.set("task_key",taskKey);
    tracking.set("task_type","questions");
    tracking.set("subject_slug",subject);
    const suffix=tracking.toString()?"?"+tracking.toString():"";
    redirect("/conteudos/caderno/"+result.notebook.id+suffix);
  }

  const params=new URLSearchParams({
    materia:subject,
    fixacao:"sem-questoes",
    capitulo:chapter||sectionKey
  });
  redirect("/conteudos/banco-de-questoes?"+params.toString());
}
