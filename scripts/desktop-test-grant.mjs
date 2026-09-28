import {generateKeyPairSync,sign} from "node:crypto";

const {privateKey,publicKey}=generateKeyPairSync("ed25519");
export function testGrant(userId,deviceId,entitlement,{issuedAt=Date.now(),validUntil=Date.now()+30*86400000}={}){
  const payload={v:1,sub:String(userId),device_id:deviceId,entitlement,issued_at:new Date(issuedAt).toISOString(),valid_until:new Date(validUntil).toISOString()};
  const encoded=Buffer.from(JSON.stringify(payload)).toString("base64url");
  return {offline_grant:`${encoded}.${sign(null,Buffer.from(encoded),privateKey).toString("base64url")}`,offline_public_key:publicKey.export({format:"pem",type:"spki"})};
}
