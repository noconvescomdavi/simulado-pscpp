import {redirect,notFound} from "next/navigation";
import {getSession} from "../../../lib/auth";
import {getEntitlement} from "../../../lib/entitlement";
import {getQuestionBank,getQuestionFilterFacets} from "../../../lib/question-banks";
import {normalizeSubject,subjectLabel,TRIAL_SUBJECT_SLUG} from "../../../lib/subjects";
import StudentHeader from "../../components/StudentHeader";
import Client from "./Client";

export default async function Page({params,searchParams}){
  const s=await getSession();
  if(!s) redirect("/login");

  const {subject}=await params;
  const q=await searchParams;
  const normalized=normalizeSubject(subject);
  const entitlement=await getEntitlement(s.id);
  const trialAllowed=entitlement.trial && normalized===TRIAL_SUBJECT_SLUG;

  if(!entitlement.active && !trialAllowed){
    redirect("/comprar");
  }

  const b=getQuestionBank(normalized);
  if(!b) notFound();
  const facets=trialAllowed?{works:[],chapters:[],modules:[]}:getQuestionFilterFacets(normalized);

  return (
    <>
      <StudentHeader active="simulados"/>
      <Client
        subject={normalized}
        title={subjectLabel(normalized)}
        ready={(b.questions||[]).length>0}
        trial={trialAllowed}
        facets={facets}
        planTask={{plan_date:String(q?.plan_date||''),task_key:String(q?.task_key||''),task_type:'simulado',subject_slug:normalized}}
      />
    </>
  );
}
