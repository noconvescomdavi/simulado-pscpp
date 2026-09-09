import argon2 from "argon2";
import {getAdmin} from "../../../../lib/admin";
import {enableAdminMfa,otpauthUri,prepareAdminMfa,verifyAdminMfaCredential} from "../../../../lib/admin-mfa";
import {assertSameOrigin} from "../../../../lib/security";
import {query,withTransaction} from "../../../../lib/db";

export async function POST(request){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const admin=await getAdmin();
  if(!admin)return Response.json({error:"Não autorizado."},{status:403});
  const body=await request.json().catch(()=>({}));

  if(body.action==="prepare"){
    if(admin.admin_mfa_enabled)return Response.json({error:"MFA já está ativo."},{status:409});
    const secret=await prepareAdminMfa(admin.id);
    return Response.json({ok:true,secret,uri:otpauthUri(admin.email,secret)});
  }

  if(body.action==="enable"){
    if(admin.admin_mfa_enabled)return Response.json({error:"MFA já está ativo."},{status:409});
    const codes=await enableAdminMfa(admin,String(body.code||""));
    if(!codes)return Response.json({error:"Código TOTP inválido."},{status:400});
    await query("insert into admin_audit_log(actor_user_id,action,entity_type,entity_key,after_data) values($1,'admin_mfa_enabled','security',$1,$2::jsonb)",[admin.id,JSON.stringify({enabled:true})]).catch(()=>{});
    return Response.json({ok:true,recoveryCodes:codes});
  }

  if(body.action==="disable"){
    if(!admin.admin_mfa_enabled)return Response.json({error:"MFA não está ativo."},{status:409});
    const user=(await query("select password_hash from users where id=$1",[admin.id])).rows[0];
    const passwordOk=user?.password_hash&&await argon2.verify(user.password_hash,String(body.password||"")).catch(()=>false);
    const credential=await verifyAdminMfaCredential(admin.id,String(body.code||""));
    if(!passwordOk||!credential.ok)return Response.json({error:"Senha ou código MFA inválido."},{status:400});
    await withTransaction(async client=>{
      await client.query("update users set admin_mfa_enabled=false,session_version=coalesce(session_version,1)+1,updated_at=now() where id=$1",[admin.id]);
      await client.query("delete from admin_mfa_secrets where user_id=$1",[admin.id]);
      await client.query("delete from admin_mfa_recovery_codes where user_id=$1",[admin.id]);
      await client.query("insert into admin_audit_log(actor_user_id,action,entity_type,entity_key,after_data) values($1,'admin_mfa_disabled','security',$1,$2::jsonb)",[admin.id,JSON.stringify({enabled:false})]).catch(()=>{});
    });
    return Response.json({ok:true,logout:true});
  }

  return Response.json({error:"Ação inválida."},{status:400});
}
