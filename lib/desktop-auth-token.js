import {SignJWT,jwtVerify} from "jose";
import {createHmac,createPrivateKey,createPublicKey,sign} from "node:crypto";
const AUDIENCE="estibordo-desktop-sync";
function key(){const v=String(process.env.AUTH_SECRET||"");if(v.length<32)throw new Error("AUTH_SECRET deve ter pelo menos 32 caracteres.");return new TextEncoder().encode(v)}
export async function issueDesktopToken(user,{days=30,deviceId}={}){
 if(!deviceId)throw new Error("Identificador do dispositivo obrigatório.");
 return new SignJWT({email:user.email,role:user.role||"student",scope:"desktop:sync",device_id:deviceId,sv:Number(user.session_version||1)})
  .setProtectedHeader({alg:"HS256"}).setSubject(String(user.id)).setAudience(AUDIENCE).setIssuedAt().setExpirationTime(`${Math.min(90,Math.max(1,days))}d`).sign(key());
}
export async function verifyDesktopToken(token){
 try{const {payload}=await jwtVerify(String(token||""),key(),{audience:AUDIENCE});if(payload.scope!=="desktop:sync"||!payload.sub||!payload.device_id)return null;return{id:String(payload.sub),email:payload.email,role:payload.role||"student",deviceId:payload.device_id,sessionVersion:Number(payload.sv||1),desktopToken:true}}catch{return null}
}
export async function getDesktopBearerSession(request){
 const auth=String(request.headers.get("authorization")||"");if(!auth.startsWith("Bearer "))return null;return verifyDesktopToken(auth.slice(7));
}
export function issueOfflineGrant(user,deviceId,entitlement){
 const seed=createHmac("sha256",key()).update("estibordo-desktop-offline-ed25519-v1").digest();
 const privateKey=createPrivateKey({key:Buffer.concat([Buffer.from("302e020100300506032b657004220420","hex"),seed]),format:"der",type:"pkcs8"});
 const payload={v:1,sub:String(user.id),device_id:deviceId,entitlement,issued_at:new Date().toISOString(),valid_until:new Date(Date.now()+30*86400000).toISOString()};
 const encoded=Buffer.from(JSON.stringify(payload)).toString("base64url");
 return {token:`${encoded}.${sign(null,Buffer.from(encoded),privateKey).toString("base64url")}`,public_key:createPublicKey(privateKey).export({format:"pem",type:"spki"})};
}
