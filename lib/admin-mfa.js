import {createCipheriv,createDecipheriv,createHash,createHmac,randomBytes,timingSafeEqual} from "node:crypto";
import {SignJWT,jwtVerify} from "jose";
import {cookies} from "next/headers";
import {query,withTransaction} from "./db";

const PENDING_COOKIE="pscpp_admin_mfa_pending";
const BASE32="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function authSecret(){
  const value=String(process.env.AUTH_SECRET||"");
  if(value.length<32)throw new Error("AUTH_SECRET inválido.");
  return value;
}
function jwtSecret(){return new TextEncoder().encode(authSecret())}
function encryptionKey(){return createHash("sha256").update("estibordo-admin-mfa:"+authSecret()).digest()}
function b32encode(buffer){
  let bits=0,value=0,out="";
  for(const byte of buffer){
    value=(value<<8)|byte;bits+=8;
    while(bits>=5){out+=BASE32[(value>>>(bits-5))&31];bits-=5}
  }
  if(bits>0)out+=BASE32[(value<<(5-bits))&31];
  return out;
}
function b32decode(input){
  const clean=String(input||"").replace(/=+$/,"").replace(/\s+/g,"").toUpperCase();
  let bits=0,value=0;const out=[];
  for(const char of clean){
    const idx=BASE32.indexOf(char);if(idx<0)continue;
    value=(value<<5)|idx;bits+=5;
    if(bits>=8){out.push((value>>>(bits-8))&255);bits-=8}
  }
  return Buffer.from(out);
}
export function generateTotpSecret(){return b32encode(randomBytes(20))}
export function encryptSecret(secret){
  const iv=randomBytes(12);
  const cipher=createCipheriv("aes-256-gcm",encryptionKey(),iv);
  const data=Buffer.concat([cipher.update(String(secret),"utf8"),cipher.final()]);
  const tag=cipher.getAuthTag();
  return [iv,tag,data].map(x=>x.toString("base64url")).join(".");
}
export function decryptSecret(payload){
  const [iv,tag,data]=String(payload||"").split(".").map(x=>Buffer.from(x,"base64url"));
  const decipher=createDecipheriv("aes-256-gcm",encryptionKey(),iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data),decipher.final()]).toString("utf8");
}
function totpAt(secret,counter){
  const key=b32decode(secret);
  const msg=Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h=createHmac("sha1",key).update(msg).digest();
  const offset=h[h.length-1]&15;
  const n=((h[offset]&127)<<24)|((h[offset+1]&255)<<16)|((h[offset+2]&255)<<8)|(h[offset+3]&255);
  return String(n%1000000).padStart(6,"0");
}
export function verifyTotp(secret,code,now=Date.now()){
  const clean=String(code||"").replace(/\D/g,"");
  if(clean.length!==6)return false;
  const counter=Math.floor(now/30000);
  for(const drift of [-1,0,1]){
    const expected=Buffer.from(totpAt(secret,counter+drift));
    const actual=Buffer.from(clean);
    if(expected.length===actual.length&&timingSafeEqual(expected,actual))return true;
  }
  return false;
}
export function otpauthUri(email,secret){
  const issuer="ESTIBORDO";
  return "otpauth://totp/"+encodeURIComponent(issuer+":"+email)+"?secret="+encodeURIComponent(secret)+"&issuer="+encodeURIComponent(issuer)+"&algorithm=SHA1&digits=6&period=30";
}
export function generateRecoveryCodes(){
  return Array.from({length:10},()=>randomBytes(5).toString("hex").toUpperCase().match(/.{1,5}/g).join("-"));
}
function recoveryHash(code){return createHash("sha256").update(String(code||"").replace(/\s+/g,"").toUpperCase()).digest("hex")}

export async function beginAdminMfaChallenge(user){
  const token=await new SignJWT({purpose:"admin-mfa",email:user.email,sv:Number(user.session_version||1)})
    .setProtectedHeader({alg:"HS256"}).setSubject(String(user.id)).setIssuedAt().setExpirationTime("10m").sign(jwtSecret());
  const jar=await cookies();
  jar.set(PENDING_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:600});
}
export async function getAdminMfaPending(){
  try{
    const jar=await cookies();const token=jar.get(PENDING_COOKIE)?.value;if(!token)return null;
    const {payload}=await jwtVerify(token,jwtSecret());
    if(payload.purpose!=="admin-mfa"||!payload.sub)return null;
    const r=await query("select id,email,role,status,session_version,admin_mfa_enabled from users where id=$1 limit 1",[payload.sub]);
    const user=r.rows[0];
    if(!user||user.role!=="admin"||user.status!=="active"||!user.admin_mfa_enabled)return null;
    if(Number(payload.sv||1)!==Number(user.session_version||1))return null;
    return user;
  }catch{return null}
}
export async function clearAdminMfaPending(){
  const jar=await cookies();jar.set(PENDING_COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
}
export async function getAdminMfaSecret(userId){
  const r=await query("select secret_enc,enabled_at from admin_mfa_secrets where user_id=$1 limit 1",[userId]);
  if(!r.rowCount)return null;
  return {secret:decryptSecret(r.rows[0].secret_enc),enabledAt:r.rows[0].enabled_at};
}
export async function prepareAdminMfa(userId){
  const secret=generateTotpSecret();
  await query("insert into admin_mfa_secrets(user_id,secret_enc,enabled_at) values($1,$2,null) on conflict(user_id) do update set secret_enc=excluded.secret_enc,enabled_at=null,created_at=now()",[userId,encryptSecret(secret)]);
  await query("delete from admin_mfa_recovery_codes where user_id=$1",[userId]);
  return secret;
}
export async function enableAdminMfa(user,code){
  const data=await getAdminMfaSecret(user.id);
  if(!data||!verifyTotp(data.secret,code))return null;
  const codes=generateRecoveryCodes();
  await withTransaction(async client=>{
    await client.query("update users set admin_mfa_enabled=true,updated_at=now() where id=$1",[user.id]);
    await client.query("update admin_mfa_secrets set enabled_at=now() where user_id=$1",[user.id]);
    await client.query("delete from admin_mfa_recovery_codes where user_id=$1",[user.id]);
    for(const c of codes)await client.query("insert into admin_mfa_recovery_codes(user_id,code_hash) values($1,$2)",[user.id,recoveryHash(c)]);
  });
  return codes;
}
export async function verifyAdminMfaCredential(userId,credential){
  const data=await getAdminMfaSecret(userId);
  if(data&&verifyTotp(data.secret,credential))return {ok:true,recovery:false};
  const hash=recoveryHash(credential);
  const used=await query("update admin_mfa_recovery_codes set used_at=now() where user_id=$1 and code_hash=$2 and used_at is null returning id",[userId,hash]);
  return {ok:used.rowCount>0,recovery:used.rowCount>0};
}
