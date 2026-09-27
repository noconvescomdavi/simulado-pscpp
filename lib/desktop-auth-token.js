import {SignJWT,jwtVerify} from "jose";
const AUDIENCE="estibordo-desktop-sync";
function key(){const v=String(process.env.AUTH_SECRET||"");if(v.length<32)throw new Error("AUTH_SECRET deve ter pelo menos 32 caracteres.");return new TextEncoder().encode(v)}
export async function issueDesktopToken(user,{days=30}={}){
 return new SignJWT({email:user.email,role:user.role||"student",scope:"desktop:sync"})
  .setProtectedHeader({alg:"HS256"}).setSubject(String(user.id)).setAudience(AUDIENCE).setIssuedAt().setExpirationTime(`${Math.min(90,Math.max(1,days))}d`).sign(key());
}
export async function verifyDesktopToken(token){
 try{const {payload}=await jwtVerify(String(token||""),key(),{audience:AUDIENCE});if(payload.scope!=="desktop:sync"||!payload.sub)return null;return{id:String(payload.sub),email:payload.email,role:payload.role||"student",desktopToken:true}}catch{return null}
}
export async function getDesktopBearerSession(request){
 const auth=String(request.headers.get("authorization")||"");if(!auth.startsWith("Bearer "))return null;return verifyDesktopToken(auth.slice(7));
}
