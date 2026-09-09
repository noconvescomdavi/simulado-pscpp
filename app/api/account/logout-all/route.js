import {clearSession,getSession} from "../../../../lib/auth";
import {query} from "../../../../lib/db";
import {assertSameOrigin} from "../../../../lib/security";

export async function POST(request){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const session=await getSession();
  if(!session)return Response.redirect(new URL("/login",request.url),303);
  await query("update users set session_version=coalesce(session_version,1)+1,updated_at=now() where id=$1",[session.id]);
  await clearSession();
  return Response.redirect(new URL("/login?logout=all",request.url),303);
}
