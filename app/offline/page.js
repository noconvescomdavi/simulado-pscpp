import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import StudentHeader from "../components/StudentHeader";
import OfflineCenter from "./OfflineCenter";

export const dynamic="force-dynamic";

export default async function OfflinePage(){
  const session=await getSession();
  if(!session)redirect("/login?next=/offline");
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar?locked=inactive");
  return <><StudentHeader active="offline"/><OfflineCenter/></>;
}
