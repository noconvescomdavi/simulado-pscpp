import argon2 from "argon2";
import {query} from "../../../../lib/db";
import {createSession} from "../../../../lib/auth";
export async function POST(req){
 try{
  const {email,password}=await req.json();
  const normalized=String(email||"").trim().toLowerCase();
  const r=await query("select id,email,password_hash,role,status from users where email=$1",[normalized]);
  if(!r.rowCount) return Response.json({error:"E-mail ou senha inválidos."},{status:401});
  const u=r.rows[0];
  if(u.status!=="active") return Response.json({error:"Conta indisponível."},{status:403});
  if(!(await argon2.verify(u.password_hash,String(password||"")))) return Response.json({error:"E-mail ou senha inválidos."},{status:401});
  await query("update users set last_login_at=now() where id=$1",[u.id]);
  await createSession(u);
  return Response.json({ok:true});
 }catch(e){console.error(e);return Response.json({error:"Não foi possível entrar."},{status:500})}
}