import {createHash,randomBytes} from "node:crypto";
import {query} from "./db";

const VERIFY_TTL_HOURS=24;

function tokenHash(token){
  return createHash("sha256").update(String(token)).digest("hex");
}
function appUrl(){
  return String(process.env.NEXT_PUBLIC_APP_URL||"https://simulado-pscpp.vercel.app").replace(/\/$/,"");
}
function parseSender(value){
  const raw=String(value||"").trim();
  const match=raw.match(/^(.+?)\s*<([^<>\s]+@[^<>\s]+)>$/);
  if(match)return{name:match[1].trim().replace(/^[\"']|[\"']$/g,"")||"ESTIBORDO",email:match[2].trim()};
  return{name:"ESTIBORDO | Plataforma de Estudos",email:raw||"estibordopscpp@gmail.com"};
}

export async function createEmailVerificationToken(userId){
  const token=randomBytes(32).toString("hex");
  const hash=tokenHash(token);
  await query("update email_verification_tokens set used_at=now() where user_id=$1 and used_at is null",[userId]);
  await query("insert into email_verification_tokens(user_id,token_hash,expires_at) values($1,$2,now()+($3::text || ' hours')::interval)",[userId,hash,VERIFY_TTL_HOURS]);
  return{token,url:appUrl()+"/verificar-email?token="+encodeURIComponent(token)};
}

export async function sendVerificationEmail({to,verifyUrl}){
  const apiKey=String(process.env.BREVO_API_KEY||"").trim();
  if(!apiKey)throw new Error("BREVO_API_KEY não configurada.");
  const sender=parseSender(process.env.PASSWORD_RESET_FROM_EMAIL||"ESTIBORDO | Plataforma de Estudos <estibordopscpp@gmail.com>");
  const html=[
    '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0d1b2a">',
    '<div style="border-bottom:3px solid #c8102e;padding-bottom:14px;margin-bottom:22px"><strong style="font-size:20px">ESTIBORDO</strong></div>',
    '<h2 style="margin:0 0 14px">Confirme seu e-mail</h2>',
    '<p>Confirme seu endereço de e-mail para concluir a criação da conta ESTIBORDO.</p>',
    '<p style="margin:24px 0"><a href="'+verifyUrl+'" style="display:inline-block;background:#c8102e;color:#fff;text-decoration:none;padding:12px 18px;border-radius:7px;font-weight:700">Confirmar meu e-mail</a></p>',
    '<p>Este link expira em '+VERIFY_TTL_HOURS+' horas e só pode ser utilizado uma vez.</p>',
    '<p style="color:#667b8d;font-size:13px">Se você não criou uma conta, ignore esta mensagem.</p>',
    '</div>'
  ].join("");
  const response=await fetch("https://api.brevo.com/v3/smtp/email",{
    method:"POST",
    headers:{"api-key":apiKey,Accept:"application/json","Content-Type":"application/json"},
    body:JSON.stringify({sender,to:[{email:String(to).trim()}],subject:"Confirme seu e-mail — ESTIBORDO",htmlContent:html})
  });
  if(!response.ok){
    const detail=await response.text().catch(()=>"");
    throw new Error("Falha ao enviar e-mail de verificação: "+response.status+" "+detail.slice(0,240));
  }
  return response.json().catch(()=>({ok:true}));
}

export async function consumeEmailVerificationToken(token){
  const hash=tokenHash(token);
  const result=await query(
    "with valid_token as (select evt.id,evt.user_id from email_verification_tokens evt join users u on u.id=evt.user_id where evt.token_hash=$1 and evt.used_at is null and evt.expires_at>now() and u.status='active' limit 1 for update), updated_user as (update users u set email_verified=true,email_verified_at=now(),updated_at=now() from valid_token vt where u.id=vt.user_id returning u.id) update email_verification_tokens evt set used_at=now() from valid_token vt,updated_user uu where evt.id=vt.id returning evt.user_id",
    [hash]
  );
  return result.rowCount>0;
}
