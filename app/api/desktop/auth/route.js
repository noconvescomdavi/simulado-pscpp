import argon2 from "argon2";
import {query} from "../../../../lib/db";
import {getUserAccess} from "../../../../lib/access";
import {issueDesktopToken} from "../../../../lib/desktop-auth-token";
import {consumeRateLimit,identityHash} from "../../../../lib/security";

export async function POST(request){
 const body=await request.json().catch(()=>({})),email=String(body.email||"").trim().toLowerCase(),password=String(body.password||"");
 if(!email||!password)return Response.json({error:"E-mail e senha são obrigatórios."},{status:400});
 const limit=await consumeRateLimit({action:"desktop_login_account",keyHash:identityHash(email),limit:8,windowSeconds:900});
 if(!limit.allowed)return Response.json({error:"Muitas tentativas. Aguarde e tente novamente."},{status:429});
 const result=await query("select id,email,password_hash,role,status,email_verified,email_verification_required_at,admin_mfa_enabled from users where lower(email)=lower($1) limit 1",[email]);
 const user=result.rows[0],valid=user?.password_hash&&await argon2.verify(user.password_hash,password).catch(()=>false);
 if(!user||!valid)return Response.json({error:"E-mail ou senha inválidos."},{status:401});
 if(user.status!=="active")return Response.json({error:"Conta indisponível."},{status:403});
 if(user.email_verification_required_at&&!user.email_verified)return Response.json({error:"Confirme seu e-mail para entrar.",code:"EMAIL_NOT_VERIFIED"},{status:403});
 if(user.role==="admin"&&user.admin_mfa_enabled)return Response.json({error:"Contas administrativas devem usar o login web com MFA.",code:"ADMIN_MFA_REQUIRED"},{status:403});
 const access=await getUserAccess(user.id);
 const accessToken=await issueDesktopToken(user,{days:30});
 await query("update users set last_login_at=now(),updated_at=now() where id=$1",[user.id]);
 return Response.json({ok:true,access_token:accessToken,expires_at:new Date(Date.now()+30*86400000).toISOString(),user:{id:String(user.id),email:user.email,role:user.role||"student"},entitlement:{active:access?.active===true,trial:false,status:access?.effective_status||access?.status||"inactive"}},{headers:{"Cache-Control":"no-store"}});
}
