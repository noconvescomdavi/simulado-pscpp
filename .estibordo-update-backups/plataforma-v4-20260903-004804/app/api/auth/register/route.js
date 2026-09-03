import argon2 from "argon2";
import {query} from "../../../../lib/db";
import {createSession} from "../../../../lib/auth";
export async function POST(req){
 try{
  const {email,password}=await req.json();
  const normalized=String(email||"").trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return Response.json({error:"E-mail inválido."},{status:400});
  if(String(password||"").length<8) return Response.json({error:"A senha precisa ter ao menos 8 caracteres."},{status:400});
  const exists=await query("select id from users where email=$1",[normalized]);
  if(exists.rowCount) return Response.json({error:"Já existe uma conta com este e-mail."},{status:409});
  const hash=await argon2.hash(password,{type:argon2.argon2id});
  const r=await query("insert into users(email,password_hash) values($1,$2) returning id,email,role",[normalized,hash]);
  const u=r.rows[0];
  await query("insert into user_access(user_id,product_code,status,lifetime) values($1,'pscpp-vitalicio','pending',true) on conflict do nothing",[u.id]);
  await createSession(u);
  return Response.json({ok:true,user:{id:u.id,email:u.email}});
 }catch(e){console.error(e);return Response.json({error:"Não foi possível criar a conta."},{status:500})}
}