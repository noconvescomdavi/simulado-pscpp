import {redirect,notFound} from "next/navigation";
import {getSession} from "../../../../lib/auth";
import {getEntitlement} from "../../../../lib/entitlement";
import {getNotebook} from "../../../../lib/notebooks";
import StudentHeader from "../../../components/StudentHeader";
import Client from "./Client";

export default async function Page({params,searchParams}){
  const s=await getSession();
  if(!s)redirect("/login");

  const {id}=await params;
  const [entitlement,q,n]=await Promise.all([getEntitlement(s.id),searchParams,getNotebook(s.id,id)]);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar");
  if(!n)notFound();

  const planTask={plan_date:String(q?.plan_date||""),task_key:String(q?.task_key||""),task_type:String(q?.task_type||"questions"),subject_slug:String(q?.subject_slug||"")};
  return <><StudentHeader active="cadernos" session={s}/><Client notebook={n} planTask={planTask}/></>;
}
