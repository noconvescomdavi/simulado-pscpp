import argon2 from "argon2";
import {query} from "../../../../lib/db";
import {getUserAccess} from "../../../../lib/access";
import {issueDesktopToken,getDesktopBearerSession} from "../../../../lib/desktop-auth-token";
import {consumeRateLimit,identityHash} from "../../../../lib/security";

export async function POST(request){
 const body=await request.json().catch(()=>({})),email=String(body.email||"").trim().toLowerCase(),password=String(body.password||""),deviceId=String(body.device_id||"");
 if(!email||!password||!/^[-0-9a-f]{36}$/i.test(deviceId))return Response.json({error:"E-mail, senha e dispositivo válido são obrigatórios."},{status:400});
 const limit=await consumeRateLimit({action:"desktop_login_account",keyHash:identityHash(email),limit:8,windowSeconds:900});
 if(!limit.allowed)return Response.json({error:"Muitas tentativas. Aguarde e tente novamente."},{status:429});
 const result=await query("select id,email,password_hash,role,status,session_version,email_verified,email_verification_required_at,admin_mfa_enabled from users where lower(email)=lower($1) limit 1",[email]);
 const user=result.rows[0],valid=user?.password_hash&&await argon2.verify(user.password_hash,password).catch(()=>false);
 if(!user||!valid)return Response.json({error:"E-mail ou senha inválidos."},{status:401});
 if(user.status!=="active")return Response.json({error:"Conta indisponível."},{status:403});
 if(user.email_verification_required_at&&!user.email_verified)return Response.json({error:"Confirme seu e-mail para entrar.",code:"EMAIL_NOT_VERIFIED"},{status:403});
 if(user.role==="admin")return Response.json({error:"Contas administrativas devem usar o login web.",code:"ADMIN_DESKTOP_UNAVAILABLE"},{status:403});
 const access=await getUserAccess(user.id);
 const accessToken=await issueDesktopToken(user,{days:30,deviceId});
 await query("update users set last_login_at=now(),updated_at=now() where id=$1",[user.id]);
 return Response.json({ok:true,access_token:accessToken,expires_at:new Date(Date.now()+30*86400000).toISOString(),user:{id:String(user.id),email:user.email,role:user.role||"student"},entitlement:{active:access?.active===true,trial:false,status:access?.effective_status||access?.status||"inactive"}},{headers:{"Cache-Control":"no-store"}});
}

export async function PUT(request){
 const session=await getDesktopBearerSession(request);
 if(!session)return Response.json({error:"Sessão expirada. Entre novamente com internet."},{status:401});
 const body=await request.json().catch(()=>({}));
 if(body.device_id!==session.deviceId)return Response.json({error:"Dispositivo inválido."},{status:403});
 const result=await query("select id,email,role,status,session_version from users where id=$1 limit 1",[session.id]);
 const user=result.rows[0];
 if(!user||user.status!=="active"||user.role==="admin"||Number(user.session_version||1)!==session.sessionVersion)return Response.json({error:"Sessão revogada."},{status:401});
 const access=await getUserAccess(user.id);
 return Response.json({ok:true,access_token:await issueDesktopToken(user,{days:30,deviceId:session.deviceId}),expires_at:new Date(Date.now()+30*86400000).toISOString(),user:{id:String(user.id),email:user.email,role:user.role||"student"},entitlement:{active:access?.active===true,trial:false,status:access?.effective_status||access?.status||"inactive"}},{headers:{"Cache-Control":"no-store"}});
}
