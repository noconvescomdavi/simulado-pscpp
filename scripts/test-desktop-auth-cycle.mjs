import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import {createRequire} from "node:module";
import {testGrant} from "./desktop-test-grant.mjs";

const require=createRequire(import.meta.url);
const {openLocalDatabase}=require("../desktop/local-db.cjs");
const {startLocalBridge}=require("../desktop/local-bridge.cjs");
const {verifyOfflineGrant}=require("../desktop/offline-grant.cjs");
process.env.AUTH_SECRET="desktop-auth-test-secret-12345678901234567890";
const {issueOfflineGrant}=await import("../lib/desktop-auth-token.js");
const signed=issueOfflineGrant({id:"server-user"},"server-device",{status:"active",active:true,trial:false,lifetime:true,expires_at:null});
assert.equal(verifyOfflineGrant(signed.token,signed.public_key,{userId:"server-user",deviceId:"server-device"})?.sub,"server-user");
assert.equal(verifyOfflineGrant(signed.token,signed.public_key,{userId:"server-user",deviceId:"other-device"}),null);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"estibordo-auth-"));
const db=openLocalDatabase(dir);
let session=null,syncCalls=0;
const id="11111111-1111-4111-8111-111111111111";
const remote=http.createServer((req,res)=>{
  res.setHeader("Content-Type","application/json");
  if(req.method==="PUT"&&req.headers.authorization!=="Bearer initial-token"){
    res.statusCode=401;return res.end(JSON.stringify({error:"Token inválido"}));
  }
  let raw="";req.on("data",chunk=>raw+=chunk);req.on("end",()=>{
    const body=JSON.parse(raw||"{}");
    if(body.device_id!=="22222222-2222-4222-8222-222222222222"){
      res.statusCode=403;return res.end(JSON.stringify({error:"Dispositivo inválido"}));
    }
    const userId=body.email==="other@example.com"?"other":id;
    const entitlement={active:true,trial:false,status:"active",expires_at:null,lifetime:true};
    res.end(JSON.stringify({access_token:req.method==="PUT"?"renewed-token":"initial-token",expires_at:new Date(Date.now()+30*86400000).toISOString(),user:{id:userId,email:body.email||"student@example.com",role:"student"},entitlement,...testGrant(userId,body.device_id,entitlement)}));
  });
});
await new Promise(resolve=>remote.listen(0,"127.0.0.1",resolve));
const bridge=await startLocalBridge({db,syncEngine:{deviceId:"22222222-2222-4222-8222-222222222222",syncNow:async()=>{syncCalls++;return {ok:true}}},secureStore:{saveSession:async value=>{session=value},loadSession:async()=>session,clearSession:async()=>{session=null}},apiBaseUrl:`http://127.0.0.1:${remote.address().port}`});
async function call(endpoint,body={}){
  const response=await fetch(`http://127.0.0.1:${bridge.port}${endpoint}`,{method:"POST",headers:{Authorization:`Bearer ${bridge.token}`,"Content-Type":"application/json"},body:JSON.stringify(body)});
  return {status:response.status,body:await response.json()};
}
try{
  const login=await call("/v1/auth/bootstrap",{email:"student@example.com",password:"password"});
  assert.equal(login.status,200);
  assert.equal(session.userId,id);
  assert.equal(db.prepare("select entitlement_status from local_profile where user_id=?").get(id).entitlement_status,"active");
  const originalGrant=session.offlineGrant;
  db.prepare("UPDATE local_profile SET entitlement_status='revoked',entitlement_lifetime=0 WHERE user_id=?").run(id);
  const profileResponse=await fetch(`http://127.0.0.1:${bridge.port}/v1/profile`,{headers:{Authorization:`Bearer ${bridge.token}`}});
  assert.equal((await profileResponse.json()).profile.entitlement_status,"active","SQLite editado não altera o direito assinado.");
  session.offlineGrant=`${originalGrant.slice(0,-2)}xx`;
  const forgedResponse=await fetch(`http://127.0.0.1:${bridge.port}/v1/profile`,{headers:{Authorization:`Bearer ${bridge.token}`}});
  assert.equal((await forgedResponse.json()).profile,null,"Assinatura adulterada deve negar acesso offline.");
  session.offlineGrant=originalGrant;
  db.prepare("UPDATE local_profile SET entitlement_status='active',entitlement_lifetime=1 WHERE user_id=?").run(id);
  assert.equal(syncCalls,1);
  const status=await fetch(`http://127.0.0.1:${bridge.port}/v1/status`,{headers:{Authorization:`Bearer ${bridge.token}`}});
  assert.equal((await status.json()).online,false,"Status não pode afirmar conexão sem sincronização comprovada.");
  const dashboard=await fetch(`http://127.0.0.1:${bridge.port}/v1/dashboard?user_id=${id}`,{headers:{Authorization:`Bearer ${bridge.token}`}});
  assert.equal(dashboard.status,200);
  assert.equal((await dashboard.json()).overall.questions,0);
  const renewal=await call("/v1/auth/renew");
  assert.equal(renewal.status,200);
  assert.equal(session.accessToken,"renewed-token");
  const other=await call("/v1/auth/bootstrap",{email:"other@example.com",password:"password"});
  assert.equal(other.status,409);
  assert.equal(session.userId,id);
  assert.equal((await call("/v1/auth/logout")).status,200);
  assert.equal(session,null);
  assert.equal((await call("/v1/auth/renew")).status,401);
  console.log("Desktop auth/bootstrap/renew/account isolation/logout OK");
}finally{
  await bridge.close();await new Promise(resolve=>remote.close(resolve));db.close();fs.rmSync(dir,{recursive:true,force:true});
}
