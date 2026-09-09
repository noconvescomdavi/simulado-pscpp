import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getAdmin} from "../../lib/admin";
import Nav from "./Nav";

export default async function Layout({children}){
  const session=await getSession();
  if(!session)redirect("/login");
  if(session.role==="admin"&&session.adminMfaEnabled&&!session.adminMfaVerified)redirect("/login?mfa=required");
  if(!(await getAdmin()))redirect("/area-do-aluno");
  return <><Nav/>{children}</>;
}
