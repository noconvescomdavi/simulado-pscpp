import { randomInt } from "node:crypto";
import { getSession } from "../../../lib/auth";
import { getEntitlement } from "../../../lib/entitlement";
import { getIntegratedStudyPlan } from "../../../lib/integrated-study-plan";
import { getQuestionBank } from "../../../lib/question-banks";
import { query } from "../../../lib/db";

function shuffle(items){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=randomInt(i+1);[result[i],result[j]]=[result[j],result[i]]}
  return result;
}

export async function POST(req){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)return Response.json({error:"Acesso não liberado."},{status:403});

  const body=await req.json().catch(()=>({}));
  const count=entitlement.trial?10:Math.max(10,Math.min(60,Number(body.count)||20));
  const plan=await getIntegratedStudyPlan(session.id,0);
  if(plan.needs_onboarding)return Response.json({error:"Configure primeiro seu Plano de Estudos.",code:"ONBOARDING_REQUIRED"},{status:409});

  const top=plan.weighted_subjects.slice(0,Math.min(4,plan.weighted_subjects.length));
  const totalWeight=top.reduce((s,x)=>s+Number(x.weight||1),0)||1;
  let remaining=count;
  const refs=[];

  top.forEach((subject,index)=>{
    const bank=getQuestionBank(subject.slug);
    const available=shuffle((bank?.questions||[]).map(q=>({subject:subject.slug,id:String(q.id)})));
    const quota=index===top.length-1?remaining:Math.max(1,Math.round(count*(Number(subject.weight||1)/totalWeight)));
    const chosen=available.slice(0,Math.min(quota,available.length));
    refs.push(...chosen);
    remaining=Math.max(0,remaining-chosen.length);
  });

  if(remaining>0){
    const extra=shuffle(top.flatMap(subject=>{
      const bank=getQuestionBank(subject.slug);
      return (bank?.questions||[]).map(q=>({subject:subject.slug,id:String(q.id)}));
    }).filter(ref=>!refs.some(x=>x.subject===ref.subject&&x.id===ref.id))).slice(0,remaining);
    refs.push(...extra);
  }

  const finalRefs=shuffle(refs).slice(0,count);
  if(!finalRefs.length)return Response.json({error:"Nenhuma questão disponível."},{status:400});

  const subjects=[...new Set(finalRefs.map(x=>x.subject))];
  const result=await query(
    "insert into question_notebooks(user_id,title,subjects,question_refs,total_questions) values($1,$2,$3::jsonb,$4::jsonb,$5) returning *",
    [session.id,"Treino Adaptativo — "+finalRefs.length+" questões",JSON.stringify(subjects),JSON.stringify(finalRefs),finalRefs.length]
  );

  return Response.json({ok:true,notebook:result.rows[0],distribution:subjects});
}
