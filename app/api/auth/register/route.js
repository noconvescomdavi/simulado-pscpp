import argon2 from "argon2";
import {query,withTransaction} from "../../../../lib/db";
import {createEmailVerificationToken,sendVerificationEmail} from "../../../../lib/email-verification";
import {TERMS_VERSION,PRIVACY_VERSION} from "../../../../lib/legal";
import {passwordPolicyError} from "../../../../lib/password-policy";
import {clientIpHash,consumeRateLimit,identityHash,rateLimitResponse,assertSameOrigin} from "../../../../lib/security";
import {digits,encryptPii,isValidCpf,piiHash} from "../../../../lib/pii";
import {verifyTurnstile} from "../../../../lib/turnstile";

function clean(value,max=180){return String(value||"").trim().slice(0,max)}
export async function POST(req){
 try{
  await assertSameOrigin();
  const body=await req.json().catch(()=>({}));
  const email=clean(body.email,320).toLowerCase(),password=String(body.password||""),acceptedTerms=body.accept_terms===true;
  const fullName=clean(body.full_name),cpf=digits(body.cpf),phone=digits(body.phone);
  const postalCode=digits(body.postal_code).slice(0,8),street=clean(body.street),number=clean(body.number,30),complement=clean(body.complement,100),neighborhood=clean(body.neighborhood,100),city=clean(body.city,100),state=clean(body.state,2).toUpperCase();
  const maritimeRole=clean(body.maritime_role,80),experience=clean(body.experience_level,40),mfaRequested=body.enable_2fa===true;
  if(!(await verifyTurnstile(body.turnstile_token)))return Response.json({error:"Não foi possível confirmar que você é uma pessoa. Atualize a verificação e tente novamente."},{status:400});
  const ipHash=await clientIpHash();
  const [ipLimit,emailLimit]=await Promise.all([
   consumeRateLimit({action:"register_ip",keyHash:ipHash,limit:10,windowSeconds:3600}),
   consumeRateLimit({action:"register_email",keyHash:identityHash(email),limit:4,windowSeconds:3600})
  ]);
  if(!ipLimit.allowed)return rateLimitResponse(ipLimit);if(!emailLimit.allowed)return rateLimitResponse(emailLimit);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return Response.json({error:"E-mail inválido."},{status:400});
  if(fullName.length<5)return Response.json({error:"Informe seu nome completo."},{status:400});
  if(!isValidCpf(cpf))return Response.json({error:"CPF inválido."},{status:400});
  if(phone.length<10||phone.length>13)return Response.json({error:"Telefone inválido."},{status:400});
  if(!acceptedTerms)return Response.json({error:"É necessário aceitar os Termos de Uso e a Política de Privacidade."},{status:400});
  const passwordError=passwordPolicyError(password,email);if(passwordError)return Response.json({error:passwordError},{status:400});
  const cpfHash=piiHash(cpf),hash=await argon2.hash(password,{type:argon2.argon2id});
  const address={postal_code:postalCode,street,number,complement,neighborhood,city,state};
  const user=await withTransaction(async client=>{
   const exists=await client.query("select id from users where lower(email)=lower($1)",[email]);if(exists.rowCount)return null;
   const cpfExists=await client.query("select user_id from user_profiles where cpf_hash=$1",[cpfHash]);if(cpfExists.rowCount)throw Object.assign(new Error("CPF_ALREADY_EXISTS"),{code:"CPF_ALREADY_EXISTS"});
   const ins=await client.query("insert into users(email,password_hash,email_verified,email_verification_required_at,auth_provider,student_mfa_requested) values($1,$2,false,now(),'password',$3) returning id,email,role,status,session_version",[email,hash,mfaRequested]);
   const created=ins.rows[0];
   await client.query(`insert into user_profiles(user_id,full_name,cpf_hash,cpf_enc,phone_enc,phone_last4,postal_code,address_enc,maritime_role,experience_level,profile_completed)
    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)`,[created.id,fullName,cpfHash,encryptPii(cpf),encryptPii(phone),phone.slice(-4),postalCode||null,encryptPii(JSON.stringify(address)),maritimeRole||null,experience||null]);
   await client.query("insert into user_access(user_id,product_code,status,lifetime) values($1,'pscpp-vitalicio','pending',false) on conflict do nothing",[created.id]);
   await client.query("insert into user_consents(user_id,terms_version,privacy_version,source,ip_hash) values($1,$2,$3,'registration',$4)",[created.id,TERMS_VERSION,PRIVACY_VERSION,ipHash]);
   return created;
  });
  if(!user)return Response.json({error:"Já existe uma conta com este e-mail."},{status:409});
  const verification=await createEmailVerificationToken(user.id);let deliveryFailed=false;
  try{await sendVerificationEmail({to:user.email,verifyUrl:verification.url})}catch(e){deliveryFailed=true;console.error("Falha ao enviar verificação de e-mail:",e)}
  return Response.json({ok:true,verificationRequired:true,email:user.email,deliveryFailed,mfaRequested});
 }catch(error){
  if(error?.code==="CPF_ALREADY_EXISTS")return Response.json({error:"Este CPF já está vinculado a uma conta."},{status:409});
  console.error("Erro de cadastro:",error);return Response.json({error:"Não foi possível criar a conta."},{status:500});
 }
}