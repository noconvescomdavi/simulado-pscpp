import {redirect,notFound} from "next/navigation";
import {getSession} from "../../../../lib/auth";
import {getEntitlement} from "../../../../lib/entitlement";
import {getNotebook} from "../../../../lib/notebooks";
import StudentHeader from "../../../components/StudentHeader";
import Client from "./Client";

export default async function Page({params}){
  const s=await getSession();
  if(!s)redirect("/login");

  const entitlement=await getEntitlement(s.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar");

  const {id}=await params;
  const n=await getNotebook(s.id,id);
  if(!n)notFound();

  return <><StudentHeader active="conteudos"/><Client notebook={n}/></>;
}
