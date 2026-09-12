import argon2 from "argon2";
import {clearSession,getSession} from "../../../../lib/auth";
import {query,withTransaction} from "../../../../lib/db";
import {assertSameOrigin,clientIpHash,consumeRateLimit,rateLimitResponse} from "../../../../lib/security";

export async function POST(request){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const session=await getSession();
  if(!session)return Response.redirect(new URL("/login",request.url),303);

  const ipHash=await clientIpHash();
  const limit=await consumeRateLimit({action:"delete_account",keyHash:ipHash,limit:5,windowSeconds:3600});
  if(!limit.allowed)return rateLimitResponse(limit);

  const form=await request.formData();
  const password=String(form.get("password")||"");
  const confirmation=String(form.get("confirmation")||"").trim().toUpperCase();
  const user=(await query("select id,email,password_hash,role from users where id=$1",[session.id])).rows[0];

  if(!user||user.role==="admin"){
    const url=new URL("/perfil",request.url);
    url.searchParams.set("erro","Esta conta não pode ser excluída por este fluxo.");
    return Response.redirect(url,303);
  }
  const valid=user.password_hash&&await argon2.verify(user.password_hash,password).catch(()=>false);
  if(!valid||confirmation!=="EXCLUIR"){
    const url=new URL("/perfil",request.url);
    url.searchParams.set("erro","Confirme sua senha e digite EXCLUIR para continuar.");
    return Response.redirect(url,303);
  }

  await withTransaction(async(client)=>{
    const tableResult=await client.query("select distinct table_name from information_schema.columns where table_schema='public' and column_name='user_id'");
    const preserve=new Set(["payment_orders","user_access","user_consents","audit_log"]);
    for(const row of tableResult.rows){
      const table=String(row.table_name||"");
      if(!/^[a-z0-9_]+$/.test(table)||preserve.has(table))continue;
      await client.query('DELETE FROM "'+table+'" WHERE user_id=$1',[session.id]);
    }
    await client.query("update audit_log set user_id=null where user_id=$1",[session.id]);
    await client.query("update user_access set status='revoked',expires_at=now(),revoked_at=now(),updated_at=now() where user_id=$1",[session.id]);
    await client.query("update users set email=$2,status='deleted',deleted_at=now(),last_login_at=null,session_version=coalesce(session_version,1)+1,updated_at=now() where id=$1",[session.id,"deleted+"+session.id+"@estibordo.invalid"]);
    await client.query("insert into audit_log(user_id,event_type,ip_hash) values(null,'account_deleted',$1)",[ipHash]);
  });

  await clearSession();
  return Response.redirect(new URL("/logout?conta=excluida",request.url),303);
}
