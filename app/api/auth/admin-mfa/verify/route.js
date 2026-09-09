import {createSession} from "../../../../../lib/auth";
import {clearAdminMfaPending,getAdminMfaPending,verifyAdminMfaCredential} from "../../../../../lib/admin-mfa";
import {query} from "../../../../../lib/db";
import {assertSameOrigin,clientIpHash,consumeRateLimit,rateLimitResponse} from "../../../../../lib/security";

export async function POST(request){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const pending=await getAdminMfaPending();
  if(!pending)return Response.redirect(new URL("/login",request.url),303);
  const ipHash=await clientIpHash();
  const limit=await consumeRateLimit({action:"admin_mfa",keyHash:ipHash,limit:12,windowSeconds:900});
  if(!limit.allowed)return rateLimitResponse(limit);
  const form=await request.formData();
  const credential=String(form.get("code")||"").trim();
  const result=await verifyAdminMfaCredential(pending.id,credential);
  if(!result.ok){
    const url=new URL("/mfa-admin",request.url);url.searchParams.set("erro","Código inválido.");
    return Response.redirect(url,303);
  }
  await query("update users set last_login_at=now(),updated_at=now() where id=$1",[pending.id]);
  await createSession(pending,{adminMfaVerified:true});
  await clearAdminMfaPending();
  await query("insert into admin_audit_log(actor_user_id,action,entity_type,entity_key,after_data,ip_hash) values($1,'admin_mfa_login','security',$1,$2::jsonb,$3)",[pending.id,JSON.stringify({recovery:Boolean(result.recovery)}),ipHash]).catch(()=>{});
  return Response.redirect(new URL("/admin",request.url),303);
}
