import {createCipheriv,createDecipheriv,createHash,createHmac,randomBytes} from "node:crypto";

function sourceSecret(){
  const v=String(process.env.PII_ENCRYPTION_KEY||process.env.AUTH_SECRET||"");
  if(v.length<32)throw new Error("PII_ENCRYPTION_KEY/AUTH_SECRET inválido.");
  return v;
}
function key(){return createHash("sha256").update("estibordo-pii:"+sourceSecret()).digest()}
export function encryptPii(value){
  const raw=String(value||"").trim();if(!raw)return null;
  const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key(),iv);
  const data=Buffer.concat([cipher.update(raw,"utf8"),cipher.final()]),tag=cipher.getAuthTag();
  return [iv,tag,data].map(x=>x.toString("base64url")).join(".");
}
export function decryptPii(payload){
  if(!payload)return "";
  const [iv,tag,data]=String(payload).split(".").map(x=>Buffer.from(x,"base64url"));
  const d=createDecipheriv("aes-256-gcm",key(),iv);d.setAuthTag(tag);
  return Buffer.concat([d.update(data),d.final()]).toString("utf8");
}
export function piiHash(value){return createHmac("sha256",sourceSecret()).update(String(value||"").trim()).digest("hex")}
export function digits(value){return String(value||"").replace(/\D/g,"")}
export function isValidCpf(value){
  const cpf=digits(value);
  if(cpf.length!==11||/^(\d)\1{10}$/.test(cpf))return false;
  let sum=0;for(let i=0;i<9;i++)sum+=Number(cpf[i])*(10-i);
  let d1=(sum*10)%11;if(d1===10)d1=0;if(d1!==Number(cpf[9]))return false;
  sum=0;for(let i=0;i<10;i++)sum+=Number(cpf[i])*(11-i);
  let d2=(sum*10)%11;if(d2===10)d2=0;return d2===Number(cpf[10]);
}
