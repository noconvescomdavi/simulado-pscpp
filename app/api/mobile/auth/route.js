import argon2 from "argon2";
import { query } from "../../../../lib/db";
import { createMobileToken } from "../../../../lib/auth";
import { hasCurrentLegalConsent } from "../../../../lib/legal-consent";
import { clientIpHash,consumeRateLimit,identityHash,rateLimitResponse } from "../../../../lib/security";
export async function POST(req){
 try{
  const body=await req.json().catch(()=>({})),email=String(body.email||"").trim().toLowerCase(),password=String(body.password||"");
  const ua=String(req.headers.get("user-agent")||"");
  if(!ua.includes("ESTIBORDO-ANDROID"))return Response.json({error:"Cliente inválido."},{status:403});
  const [ip,acct]=await Promise.all([clientIpHash().then(keyHash=>consumeRateLimit({action:"mobile_login_ip",keyHash,limit:20,windowSeconds:600})),consumeRateLimit({action:"mobile_login_account",keyHash:identityHash(email),limit:8,windowSeconds:900})]);
  if(!ip.allowed)return rateLimitResponse(ip);if(!acct.allowed)return rateLimitResponse(acct);
  const r=await query("select id,email,password_hash,role,status,session_version,email_verified,email_verification_required_at from users where lower(email)=lower($1) limit 1",[email]),user=r.rows[0];
  const valid=user?.password_hash&&await argon2.verify(user.password_hash,password).catch(()=>false);
  if(!user||!valid)return Response.json({error:"E-mail ou senha inválidos."},{status:401});
  if(user.status!=="active")return Response.json({error:"Conta indisponível."},{status:403});
  if(user.role==="admin")return Response.json({error:"Acesso administrativo deve ser realizado pelo portal web."},{status:403});
  if(user.email_verification_required_at&&!user.email_verified)return Response.json({error:"Confirme seu e-mail para entrar."},{status:403});
  await query("update users set last_login_at=now(),updated_at=now() where id=$1",[user.id]);
  return Response.json({ok:true,token:await createMobileToken(user),requiresTerms:!(await hasCurrentLegalConsent(user.id))},{headers:{"Cache-Control":"private, no-store, max-age=0"}});
 }catch(e){console.error("Erro de login Android:",e);return Response.json({error:"Não foi possível entrar."},{status:500})}
}