import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import { getIntegratedStudyPlan } from "../../lib/integrated-study-plan";
import StudentHeader from "../components/StudentHeader";
import PlanClient from "./PlanClient";
import styles from "./plano.module.css";

export const dynamic="force-dynamic";

export default async function PlanoDeEstudos({searchParams}){
  const session=await getSession();
  if(!session)redirect("/login?next=/plano-de-estudos");

  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar?locked=inactive");

  const q=await searchParams;
  const week=Math.max(-8,Math.min(80,Number(q?.semana||0)));
  const plan=await getIntegratedStudyPlan(session.id,week);

  if(plan.needs_onboarding)redirect("/plano-de-estudos/configurar");

  return (
    <>
      <StudentHeader active="plano"/>
      <PlanClient plan={plan}/>
    </>
  );
}
