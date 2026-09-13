import {getSession} from "../../../../../lib/auth";
import {query,withTransaction} from "../../../../../lib/db";
import {assertSameOrigin} from "../../../../../lib/security";
import {digits,encryptPii,isValidCpf,piiHash} from "../../../../../lib/pii";

function clean(v,max=180){return String(v||"").trim().slice(0,max)}
export async function POST(req){
 try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403})}
 const s=await getSession();if(!s)return Response.json({error:"Não autenticado."},{status:401});
 const b=await req.json().catch(()=>({}));
 const fullName=clean(b.full_name),cpf=digits(b.cpf),phone=digits(b.phone);
 if(fullName.length<5)return Response.json({error:"Informe seu nome completo."},{status:400});
 if(!isValidCpf(cpf))return Response.json({error:"CPF inválido."},{status:400});
 if(phone.length<10||phone.length>13)return Response.json({error:"Telefone inválido."},{status:400});
 const postalCode=digits(b.postal_code).slice(0,8),address={postal_code:postalCode,street:clean(b.street),number:clean(b.number,30),complement:clean(b.complement,100),neighborhood:clean(b.neighborhood,100),city:clean(b.city,100),state:clean(b.state,2).toUpperCase()};
 const cpfHash=piiHash(cpf);
 try{
  await withTransaction(async client=>{
   const exists=await client.query("select user_id from user_profiles where cpf_hash=$1 and user_id<>$2",[cpfHash,s.id]);
   if(exists.rowCount)throw Object.assign(new Error("CPF_ALREADY_EXISTS"),{code:"CPF_ALREADY_EXISTS"});
   await client.query(`insert into user_profiles(user_id,full_name,cpf_hash,cpf_enc,phone_enc,phone_last4,postal_code,address_enc,maritime_role,experience_level,profile_completed)
    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)
    on conflict(user_id) do update set full_name=excluded.full_name,cpf_hash=excluded.cpf_hash,cpf_enc=excluded.cpf_enc,phone_enc=excluded.phone_enc,phone_last4=excluded.phone_last4,postal_code=excluded.postal_code,address_enc=excluded.address_enc,maritime_role=excluded.maritime_role,experience_level=excluded.experience_level,profile_completed=true,updated_at=now()`,
    [s.id,fullName,cpfHash,encryptPii(cpf),encryptPii(phone),phone.slice(-4),postalCode||null,encryptPii(JSON.stringify(address)),clean(b.maritime_role,80)||null,clean(b.experience_level,40)||null]);
   await client.query("update users set student_mfa_requested=$2,updated_at=now() where id=$1",[s.id,b.enable_2fa===true]);
  });
  return Response.json({ok:true,next:b.enable_2fa===true?"/configurar-2fa":"/area-do-aluno"});
 }catch(e){if(e?.code==="CPF_ALREADY_EXISTS")return Response.json({error:"Este CPF já está vinculado a outra conta."},{status:409});throw e}
}