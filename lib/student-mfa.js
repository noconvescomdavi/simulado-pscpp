import {createHash} from "node:crypto";
import {SignJWT,jwtVerify} from "jose";
import {cookies} from "next/headers";
import {query,withTransaction} from "./db";
import {generateTotpSecret,encryptSecret,decryptSecret,verifyTotp,otpauthUri,generateRecoveryCodes} from "./admin-mfa";

const COOKIE="pscpp_student_mfa_pending";
function secret(){const v=String(process.env.AUTH_SECRET||"");if(v.length<32)throw new Error("AUTH_SECRET inválido.");return new TextEncoder().encode(v)}
function recoveryHash(code){return createHash("sha256").update(String(code||"").replace(/\s+/g,"").toUpperCase()).digest("hex")}
export async function beginStudentMfaChallenge(user){
 const token=await new SignJWT({purpose:"student-mfa",email:user.email,sv:Number(user.session_version||1)}).setProtectedHeader({alg:"HS256"}).setSubject(String(user.id)).setIssuedAt().setExpirationTime("10m").sign(secret());
 const jar=await cookies();jar.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:600});
}
export async function getStudentMfaPending(){
 try{const jar=await cookies(),token=jar.get(COOKIE)?.value;if(!token)return null;const {payload}=await jwtVerify(token,secret());if(payload.purpose!=="student-mfa"||!payload.sub)return null;
 const r=await query("select id,email,role,status,session_version,student_mfa_enabled from users where id=$1 limit 1",[payload.sub]);const u=r.rows[0];
 if(!u||u.status!=="active"||!u.student_mfa_enabled||Number(payload.sv||1)!==Number(u.session_version||1))return null;return u;}catch{return null}
}
export async function clearStudentMfaPending(){const jar=await cookies();jar.set(COOKIE,"",{path:"/",maxAge:0,httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax"})}
export async function prepareStudentMfa(userId,email){
 const sec=generateTotpSecret();await query("insert into student_mfa_secrets(user_id,secret_enc,enabled_at) values($1,$2,null) on conflict(user_id) do update set secret_enc=excluded.secret_enc,enabled_at=null,created_at=now()",[userId,encryptSecret(sec)]);
 await query("delete from student_mfa_recovery_codes where user_id=$1",[userId]);
 return {secret:sec,uri:otpauthUri(email,sec)};
}
async function getSecret(userId){const r=await query("select secret_enc from student_mfa_secrets where user_id=$1 limit 1",[userId]);return r.rowCount?decryptSecret(r.rows[0].secret_enc):null}
export async function enableStudentMfa(userId,code){
 const sec=await getSecret(userId);if(!sec||!verifyTotp(sec,code))return null;const codes=generateRecoveryCodes();
 await withTransaction(async client=>{await client.query("update users set student_mfa_enabled=true,updated_at=now() where id=$1",[userId]);await client.query("update student_mfa_secrets set enabled_at=now() where user_id=$1",[userId]);await client.query("delete from student_mfa_recovery_codes where user_id=$1",[userId]);for(const c of codes)await client.query("insert into student_mfa_recovery_codes(user_id,code_hash) values($1,$2)",[userId,recoveryHash(c)])});return codes;
}
export async function verifyStudentMfaCredential(userId,credential){
 const sec=await getSecret(userId);if(sec&&verifyTotp(sec,credential))return {ok:true,recovery:false};
 const r=await query("update student_mfa_recovery_codes set used_at=now() where user_id=$1 and code_hash=$2 and used_at is null returning id",[userId,recoveryHash(credential)]);
 return {ok:r.rowCount>0,recovery:r.rowCount>0};
}
