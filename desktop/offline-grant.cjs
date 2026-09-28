const {createPublicKey,verify}=require("node:crypto");

function verifyOfflineGrant(token,publicKey,{userId,deviceId,now=Date.now()}={}){
  try{
    const [encoded,signature,...rest]=String(token||"").split(".");
    if(!encoded||!signature||rest.length)return null;
    const key=createPublicKey(publicKey);
    if(key.asymmetricKeyType!=="ed25519")return null;
    if(!verify(null,Buffer.from(encoded),key,Buffer.from(signature,"base64url")))return null;
    const payload=JSON.parse(Buffer.from(encoded,"base64url").toString("utf8"));
    if(payload.v!==1||String(payload.sub)!==String(userId)||payload.device_id!==deviceId)return null;
    const issued=Date.parse(payload.issued_at),until=Date.parse(payload.valid_until);
    if(!Number.isFinite(issued)||!Number.isFinite(until)||issued>now+300000||until<now||until-issued>30*86400000+300000)return null;
    if(!payload.entitlement||typeof payload.entitlement.status!=="string")return null;
    return payload;
  }catch{return null}
}
function verifiedEntitlement(response,userId,deviceId){
  const grant=verifyOfflineGrant(response?.offline_grant,response?.offline_public_key,{userId,deviceId});
  if(!grant)return null;
  const signed=grant.entitlement,received=response.entitlement||{};
  if(signed.status!==received.status||signed.active!==received.active||signed.trial!==received.trial||signed.lifetime!==received.lifetime||String(signed.expires_at||"")!==String(received.expires_at||""))return null;
  return grant;
}
module.exports={verifyOfflineGrant,verifiedEntitlement};
