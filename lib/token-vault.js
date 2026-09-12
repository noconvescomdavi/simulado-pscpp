import crypto from "node:crypto";

function key(){
  const secret=String(process.env.GOOGLE_TOKEN_ENCRYPTION_SECRET||process.env.AUTH_SECRET||"");
  if(secret.length<32)throw new Error("GOOGLE_TOKEN_ENCRYPTION_SECRET ou AUTH_SECRET deve ter pelo menos 32 caracteres.");
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptToken(value){
  if(!value)return null;
  const iv=crypto.randomBytes(12);
  const cipher=crypto.createCipheriv("aes-256-gcm",key(),iv);
  const encrypted=Buffer.concat([cipher.update(String(value),"utf8"),cipher.final()]);
  const tag=cipher.getAuthTag();
  return ["v1",iv.toString("base64url"),tag.toString("base64url"),encrypted.toString("base64url")].join(".");
}

export function decryptToken(value){
  if(!value)return null;
  const [version,ivRaw,tagRaw,dataRaw]=String(value).split(".");
  if(version!=="v1"||!ivRaw||!tagRaw||!dataRaw)throw new Error("Token criptografado inválido.");
  const decipher=crypto.createDecipheriv("aes-256-gcm",key(),Buffer.from(ivRaw,"base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw,"base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataRaw,"base64url")),
    decipher.final()
  ]).toString("utf8");
}
