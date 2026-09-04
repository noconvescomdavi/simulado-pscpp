import {redirect,notFound} from "next/navigation";
import {getSession} from "../../../lib/auth";
import {getEntitlement} from "../../../lib/entitlement";
import {getQuestionBank} from "../../../lib/question-banks";
import {normalizeSubject,subjectLabel,TRIAL_SUBJECT_SLUG} from "../../../lib/subjects";
import StudentHeader from "../../components/StudentHeader";
import Client from "./Client";

export default async function Page({params}){
  const s=await getSession();
  if(!s) redirect("/login");

  const {subject}=await params;
  const normalized=normalizeSubject(subject);
  const entitlement=await getEntitlement(s.id);
  const trialAllowed=entitlement.trial && normalized===TRIAL_SUBJECT_SLUG;

  if(!entitlement.active && !trialAllowed){
    redirect("/comprar");
  }

  const b=getQuestionBank(normalized);
  if(!b) notFound();

  return (
    <>
      <StudentHeader active="simulados"/>
      <Client
        subject={normalized}
        title={subjectLabel(normalized)}
        ready={(b.questions||[]).length>0}
        trial={trialAllowed}
      />
    </>
  );
}