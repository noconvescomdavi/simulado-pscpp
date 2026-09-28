import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {testGrant} from "./desktop-test-grant.mjs";

const require=createRequire(import.meta.url);
const {openLocalDatabase}=require("../desktop/local-db.cjs");
const {startLocalBridge}=require("../desktop/local-bridge.cjs");
const root=process.cwd(),entry=path.join(root,"desktop/runtime/server.js");
assert.ok(fs.existsSync(entry),"Execute prepare:desktop antes do teste de runtime.");
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"estibordo-runtime-")),db=openLocalDatabase(dir);
const userId="11111111-1111-4111-8111-111111111111",deviceId="22222222-2222-4222-8222-222222222222";
let session=null,child=null,remote=null;
function listen(server){return new Promise(resolve=>server.listen(0,"127.0.0.1",resolve))}
async function freePort(){const server=net.createServer();await listen(server);const port=server.address().port;await new Promise(resolve=>server.close(resolve));return port}
function stopChild(){return new Promise(resolve=>{if(!child)return resolve();const old=child;child=null;old.once("exit",resolve);old.kill();setTimeout(resolve,3000).unref()})}
try{
  remote=http.createServer((req,res)=>{
    res.setHeader("Content-Type","application/json");
    let raw="";req.on("data",chunk=>raw+=chunk);req.on("end",()=>{
      if(req.url==="/api/desktop/auth"){
        const entitlement={active:true,trial:false,status:"active",expires_at:null,lifetime:true};
        return res.end(JSON.stringify({access_token:"test-sync-token",expires_at:new Date(Date.now()+30*86400000).toISOString(),user:{id:userId,email:"student@example.com",role:"student"},entitlement,...testGrant(userId,deviceId,entitlement)}));
      }
      if(req.url==="/api/sync/v1")return res.end(JSON.stringify({protocol_version:1,results:[],changes:[],cursor:"0"}));
      res.statusCode=404;res.end("{}");
    });
  });
  await listen(remote);
  const bridge=await startLocalBridge({db,syncEngine:{deviceId,syncNow:async()=>({ok:true})},secureStore:{saveSession:async value=>{session=value},loadSession:async()=>session,clearSession:async()=>{session=null}},apiBaseUrl:`http://127.0.0.1:${remote.address().port}`});
  try{
    const port=await freePort(),base=`http://127.0.0.1:${port}`;
    const env={PATH:process.env.PATH,HOME:process.env.HOME,NODE_ENV:"production",HOSTNAME:"127.0.0.1",PORT:String(port),ESTIBORDO_DESKTOP:"1",ESTIBORDO_REMOTE_API_ORIGIN:"https://example.invalid",ESTIBORDO_LOCAL_BRIDGE_URL:`http://127.0.0.1:${bridge.port}`,ESTIBORDO_LOCAL_BRIDGE_TOKEN:bridge.token,AUTH_SECRET:"desktop-smoke-only-secret-12345678901234567890",NEXT_PUBLIC_APP_URL:base};
    async function boot(){
      child=spawn(process.execPath,[entry],{cwd:path.dirname(entry),env,stdio:"ignore"});
      for(let i=0;i<120;i++){
        if(child.exitCode!==null)throw new Error(`Next standalone encerrou: ${child.exitCode}`);
        try{const response=await fetch(`${base}/api/health?shallow=1`);if(response.ok)return}catch{}
        await new Promise(resolve=>setTimeout(resolve,250));
      }
      throw new Error("Next standalone não iniciou.");
    }
    await boot();
    const recovery=await fetch(`${base}/api/desktop/online?to=password`,{redirect:"manual"});
    assert.equal(recovery.status,303);
    assert.equal(recovery.headers.get("location"),"https://example.invalid/esqueci-minha-senha");
    const invalid=await fetch(`${base}/api/desktop/online?to=https://evil.invalid`,{redirect:"manual"});
    assert.equal(invalid.status,400);
    const login=await fetch(`${base}/api/auth/login`,{method:"POST",headers:{Origin:base,"Content-Type":"application/json"},body:JSON.stringify({email:"student@example.com",password:"password"})});
    assert.equal(login.status,200,await login.text());
    const cookie=login.headers.get("set-cookie")?.split(";")[0];
    assert.ok(cookie?.startsWith("pscpp_session="));
    assert.ok(!login.headers.get("set-cookie")?.includes("Secure"),"Cookie HTTP local deve sobreviver ao reinício.");
    async function dashboard(){const response=await fetch(`${base}/area-do-aluno`,{headers:{Cookie:cookie}});assert.equal(response.status,200);const html=await response.text();assert.match(html,/PAINEL DO ALUNO/)}
    await dashboard();
    const originalGrant=session.offlineGrant;
    const past=new Date(Date.now()-86400000).toISOString();
    session.offlineGrant=testGrant(userId,deviceId,{active:false,trial:false,status:"expired",expires_at:past,lifetime:false}).offline_grant;
    const expired=await fetch(`${base}/api/exams/manobrabilidade`,{headers:{Cookie:cookie}});
    assert.equal(expired.status,403,"Licença expirada não pode acessar API de simulados.");
    session.offlineGrant=testGrant(userId,deviceId,{active:true,trial:false,status:"active",expires_at:null,lifetime:true},{issuedAt:Date.now()-31*86400000,validUntil:Date.now()-86400000}).offline_grant;
    const stale=await fetch(`${base}/api/auth/me`,{headers:{Cookie:cookie}});
    assert.equal(stale.status,401,"Sessão offline vencida não pode continuar autenticada.");
    session.offlineGrant=originalGrant;
    await stopChild();
    await new Promise(resolve=>remote.close(resolve));remote=null;
    await boot();
    await dashboard();
    const logout=await fetch(`${base}/api/auth/logout`,{method:"POST",headers:{Origin:base,Cookie:cookie},redirect:"manual"});
    assert.equal(logout.status,303);
    assert.equal(session,null,"Logout deve apagar a credencial do cofre.");
    const afterLogout=await fetch(`${base}/api/auth/me`,{headers:{Cookie:cookie}});
    assert.equal(afterLogout.status,401);
    console.log("Next standalone login/dashboard/restart offline OK");
  }finally{await stopChild();await bridge.close()}
}finally{
  if(remote)await new Promise(resolve=>remote.close(resolve));
  db.close();fs.rmSync(dir,{recursive:true,force:true});
}
