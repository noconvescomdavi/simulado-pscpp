import assert from "node:assert/strict";import fs from "node:fs";import http from "node:http";import os from "node:os";import path from "node:path";import {createRequire} from "node:module";
const require=createRequire(import.meta.url),{openLocalDatabase,enqueue}=require("../desktop/local-db.cjs"),{createSyncEngine}=require("../desktop/sync-engine.cjs");
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"estibordo-cycle-")),db=openLocalDatabase(dir),userId="11111111-1111-4111-8111-111111111111";let call=0;
const server=http.createServer((req,res)=>{let raw="";req.on("data",c=>raw+=c);req.on("end",()=>{call++;assert.equal(req.headers.authorization,"Bearer test-token");const body=JSON.parse(raw||"{}");res.setHeader("Content-Type","application/json");
 if(call===1){res.statusCode=503;return res.end(JSON.stringify({error:"offline"}))}
 if(call===2){const e=body.events[0];return res.end(JSON.stringify({protocol_version:1,results:[{id:e.id,status:"conflict",entity_type:"study_progress",entity_id:e.entity_id,local_version:0,remote_version:2,local_payload:e.payload,remote_payload:{user_id:userId,subject:"manobrabilidade",percent:40,completed_items:4,total_items:10}}],changes:[],cursor:"2"}))}
 if(call===4){res.statusCode=401;return res.end(JSON.stringify({error:"revoked"}))}
 const e=body.events[0];return res.end(JSON.stringify({protocol_version:1,results:e?[{id:e.id,status:"applied",version:3}]:[],changes:[{seq:3,entity_type:"study_progress",entity_id:`${userId}:manobrabilidade`,version:3,operation:"upsert",payload:{user_id:userId,subject:"manobrabilidade",percent:70,completed_items:7,total_items:10,updated_at:new Date().toISOString()}}],cursor:"3"}));
})});
await new Promise(r=>server.listen(0,"127.0.0.1",r));const api=`http://127.0.0.1:${server.address().port}`;
try{
 const t=new Date().toISOString();db.prepare("INSERT INTO study_progress(user_id,subject,percent,completed_items,total_items,studied_items_json,version,created_at,updated_at) VALUES(?,?,?,?,?,'[]',1,?,?)").run(userId,"manobrabilidade",60,6,10,t,t);
 enqueue(db,{event_id:"cycle-1",user_id:userId,device_id:"dev",entity_type:"study_progress",entity_id:`${userId}:manobrabilidade`,operation:"upsert",base_version:0,payload:{user_id:userId,subject:"manobrabilidade",percent:60,completed_items:6,total_items:10},created_at:t});
 let revoked=false;
 const engine=createSyncEngine({db,getSession:async()=>({accessToken:"test-token",userId}),onAuthRejected:async()=>{revoked=true},apiBaseUrl:api});
 let r=await engine.syncNow();assert.equal(r.ok,false);assert.equal(engine.getConnectivity(),"offline");let out=db.prepare("select * from sync_outbox").get();assert.equal(out.state,"retry");assert.equal(out.attempt_count,1);
 db.prepare("update sync_outbox set next_attempt_at=null").run();r=await engine.syncNow();assert.equal(r.ok,true);assert.equal(db.prepare("select resolution from sync_conflicts").get().resolution,"auto_merge");
 out=db.prepare("select * from sync_outbox").get();assert.equal(out.state,"pending");const merged=JSON.parse(out.payload_json);assert.equal(merged.percent,60);assert.equal(out.base_version,2);
 r=await engine.syncNow();assert.equal(r.ok,true);assert.equal(engine.getConnectivity(),"online");assert.equal(db.prepare("select count(*) n from sync_outbox").get().n,0);const progress=db.prepare("select * from study_progress where user_id=? and subject=?").get(userId,"manobrabilidade");assert.equal(progress.percent,70);assert.equal(progress.version,3);
 enqueue(db,{event_id:"cycle-revoked",user_id:userId,device_id:"dev",entity_type:"study_progress",entity_id:`${userId}:manobrabilidade`,operation:"upsert",base_version:3,payload:{user_id:userId,subject:"manobrabilidade",percent:80},created_at:t});
 r=await engine.syncNow();assert.equal(r.ok,false);assert.equal(revoked,true,"401 confirmado deve revogar a sessão local");assert.equal(engine.getConnectivity(),"auth_required");
 assert.equal(db.prepare("select count(*) n from sync_outbox where event_id='cycle-revoked'").get().n,1,"Atividade pendente não pode ser descartada na revogação");
 console.log("Desktop offline/reconnect/conflict cycle OK");
}finally{await new Promise(r=>server.close(r));db.close();fs.rmSync(dir,{recursive:true,force:true})}
