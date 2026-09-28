const crypto = require("node:crypto");
const http = require("node:http");
const { getSyncStatus, enqueue } = require("./local-db.cjs");
const {verifyOfflineGrant,verifiedEntitlement}=require("./offline-grant.cjs");

function json(res, status, body) {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {"Content-Type":"application/json","Content-Length":data.length,"Cache-Control":"no-store"});
  res.end(data);
}
function readBody(req) {
  return new Promise((resolve,reject)=>{
    const chunks=[]; let size=0;
    req.on("data",c=>{ size+=c.length; if(size>2_000_000){reject(new Error("BODY_TOO_LARGE"));req.destroy();return;} chunks.push(c); });
    req.on("end",()=>{try{resolve(chunks.length?JSON.parse(Buffer.concat(chunks).toString("utf8")):{})}catch(e){reject(e)}});
    req.on("error",reject);
  });
}
function stamp(){return new Date().toISOString()}
function saveProfile(db,payload,email){
  const t=stamp(),status=payload.entitlement?.active?"active":payload.entitlement?.trial?"trial":String(payload.entitlement?.status||"inactive");
  db.prepare(`INSERT INTO local_profile(user_id,email,role,entitlement_status,entitlement_checked_at,entitlement_expires_at,entitlement_lifetime,last_online_auth_at,created_at,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email,role=excluded.role,entitlement_status=excluded.entitlement_status,
    entitlement_checked_at=excluded.entitlement_checked_at,entitlement_expires_at=excluded.entitlement_expires_at,
    entitlement_lifetime=excluded.entitlement_lifetime,last_online_auth_at=excluded.last_online_auth_at,updated_at=excluded.updated_at`)
    .run(String(payload.user.id),payload.user.email||email,payload.user.role||"student",status,t,payload.entitlement?.expires_at||null,payload.entitlement?.lifetime?1:0,t,t,t);
}
function startLocalBridge({db,syncEngine,secureStore,apiBaseUrl,host="127.0.0.1"}) {
  const token=crypto.randomBytes(32).toString("hex");
  const server=http.createServer(async(req,res)=>{
    if(req.headers.authorization!==`Bearer ${token}`)return json(res,401,{error:"unauthorized"});
    const url=new URL(req.url,`http://${host}`);
    try{
      if(req.method==="POST"&&url.pathname==="/v1/auth/bootstrap"){
        if(!apiBaseUrl)return json(res,503,{error:"API_REMOTE_NOT_CONFIGURED"});
        const b=await readBody(req);
        const response=await fetch(new URL("/api/desktop/auth",apiBaseUrl),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:b.email,password:b.password,device_id:syncEngine.deviceId}),signal:AbortSignal.timeout(12000),redirect:"error"});
        const payload=await response.json().catch(()=>({}));
        if(!response.ok)return json(res,response.status,payload);
        if(!payload.access_token||!payload.user?.id)return json(res,502,{error:"INVALID_AUTH_RESPONSE"});
        if(!verifiedEntitlement(payload,payload.user.id,syncEngine.deviceId))return json(res,502,{error:"INVALID_OFFLINE_GRANT"});
        const existing=db.prepare("SELECT user_id FROM local_profile LIMIT 1").get();
        if(existing&&String(existing.user_id)!==String(payload.user.id))return json(res,409,{error:"Este dispositivo já contém dados offline de outra conta. Use o perfil original."});
        await secureStore.saveSession({accessToken:payload.access_token,expiresAt:payload.expires_at||null,userId:String(payload.user.id),offlineGrant:payload.offline_grant,offlinePublicKey:payload.offline_public_key});
        saveProfile(db,payload,b.email);
        void syncEngine.syncNow();
        return json(res,200,{ok:true,user:payload.user,entitlement:payload.entitlement,expires_at:payload.expires_at});
      }
      if(req.method==="POST"&&url.pathname==="/v1/auth/renew"){
        const session=await secureStore.loadSession();
        if(!session?.accessToken)return json(res,401,{error:"Sessão indisponível."});
        const response=await fetch(new URL("/api/desktop/auth",apiBaseUrl),{method:"PUT",headers:{"Authorization":`Bearer ${session.accessToken}`,"Content-Type":"application/json"},body:JSON.stringify({device_id:syncEngine.deviceId}),signal:AbortSignal.timeout(12000),redirect:"error"});
        const payload=await response.json().catch(()=>({}));
        if(!response.ok)return json(res,response.status,payload);
        if(!payload.access_token||String(payload.user?.id)!==String(session.userId))return json(res,502,{error:"INVALID_AUTH_RESPONSE"});
        if(!verifiedEntitlement(payload,session.userId,syncEngine.deviceId))return json(res,502,{error:"INVALID_OFFLINE_GRANT"});
        await secureStore.saveSession({...session,accessToken:payload.access_token,expiresAt:payload.expires_at,offlineGrant:payload.offline_grant,offlinePublicKey:payload.offline_public_key});
        saveProfile(db,payload,payload.user.email);
        return json(res,200,{ok:true,entitlement:payload.entitlement,expires_at:payload.expires_at});
      }
      if(req.method==="POST"&&url.pathname==="/v1/auth/logout"){
        await secureStore.clearSession();
        return json(res,200,{ok:true});
      }
      if(req.method==="GET"&&url.pathname==="/v1/status"){
        const connectivity=syncEngine.getConnectivity?.()||"unknown";
        return json(res,200,{ok:true,online:connectivity==="online",connectivity,sync:getSyncStatus(db)});
      }
      if(req.method==="POST"&&url.pathname==="/v1/sync")return json(res,200,await syncEngine.syncNow());
      if(req.method==="GET"&&url.pathname==="/v1/profile"){
        const row=db.prepare("SELECT * FROM local_profile ORDER BY updated_at DESC LIMIT 1").get()||null;
        const session=await secureStore.loadSession();
        const grant=verifyOfflineGrant(session?.offlineGrant,session?.offlinePublicKey,{userId:session?.userId,deviceId:syncEngine.deviceId});
        if(!row||row.entitlement_status==="reauth_required"||!grant||String(row.user_id)!==String(grant.sub))return json(res,200,{profile:null});
        return json(res,200,{profile:{...row,entitlement_status:grant.entitlement.status,entitlement_expires_at:grant.entitlement.expires_at,
          entitlement_lifetime:grant.entitlement.lifetime?1:0,last_online_auth_at:grant.issued_at,entitlement_checked_at:grant.issued_at}});
      }
      if(req.method==="GET"&&url.pathname==="/v1/dashboard"){
        const userId=url.searchParams.get("user_id");
        const profile=db.prepare("SELECT user_id,email FROM local_profile WHERE user_id=?").get(userId);
        if(!profile)return json(res,404,{error:"Perfil local indisponível."});
        const progress=db.prepare("SELECT subject,percent FROM study_progress WHERE user_id=?").all(userId);
        const attempts=db.prepare("SELECT id,subject,status,answered_count,correct_count,started_at FROM exam_sessions WHERE user_id=? AND status IN ('completed','expired') ORDER BY started_at DESC LIMIT 4").all(userId);
        const subjects=db.prepare("SELECT subject,COUNT(*) questions,SUM(is_correct) correct FROM question_answers WHERE user_id=? GROUP BY subject").all(userId);
        const total=subjects.reduce((n,row)=>n+row.questions,0),correct=subjects.reduce((n,row)=>n+row.correct,0);
        return json(res,200,{progress,attempts,subjects,overall:{attempts:db.prepare("SELECT COUNT(*) n FROM exam_sessions WHERE user_id=? AND status IN ('completed','expired')").get(userId).n,questions:total,accuracy:total?Math.round(correct/total*1000)/10:0}});
      }
      if(req.method==="PUT"&&url.pathname==="/v1/profile"){
        const b=await readBody(req),t=stamp();
        db.prepare(`INSERT INTO local_profile(user_id,email,role,entitlement_status,entitlement_checked_at,last_online_auth_at,created_at,updated_at)
          VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email,role=excluded.role,
          entitlement_status=excluded.entitlement_status,entitlement_checked_at=excluded.entitlement_checked_at,
          last_online_auth_at=excluded.last_online_auth_at,updated_at=excluded.updated_at`)
          .run(String(b.user_id),b.email||null,b.role||"student",b.entitlement_status||null,b.entitlement_checked_at||null,b.last_online_auth_at||t,t,t);
        return json(res,200,{ok:true});
      }
      if(req.method==="GET"&&url.pathname==="/v1/progress"){
        const userId=url.searchParams.get("user_id");
        return json(res,200,{progress:db.prepare("SELECT subject,percent,completed_items,total_items,updated_at,version FROM study_progress WHERE user_id=? ORDER BY subject").all(userId)});
      }
      if(req.method==="PUT"&&url.pathname==="/v1/progress"){
        const b=await readBody(req),t=stamp(),entityId=`${b.user_id}:${b.subject}`,eventId=b.event_id||crypto.randomUUID();
        const tx=db.transaction(()=>{
          db.prepare(`INSERT INTO study_progress(user_id,subject,percent,completed_items,total_items,studied_items_json,version,created_at,updated_at)
            VALUES(?,?,?,?,?,'[]',1,?,?) ON CONFLICT(user_id,subject) DO UPDATE SET percent=excluded.percent,
            completed_items=excluded.completed_items,total_items=excluded.total_items,version=study_progress.version+1,updated_at=excluded.updated_at`)
            .run(b.user_id,b.subject,b.percent,b.completed_items,b.total_items,t,t);
          const row=db.prepare("SELECT * FROM study_progress WHERE user_id=? AND subject=?").get(b.user_id,b.subject);
          enqueue(db,{event_id:eventId,user_id:b.user_id,device_id:syncEngine.deviceId,entity_type:"study_progress",entity_id:entityId,operation:"upsert",base_version:Math.max(0,row.version-1),payload:row,created_at:t});
        });tx(); return json(res,200,{ok:true,event_id:eventId});
      }
      if(req.method==="GET"&&url.pathname==="/v1/attempts"){
        const userId=url.searchParams.get("user_id"),limit=Math.min(100,Math.max(1,Number(url.searchParams.get("limit"))||50));
        const rows=db.prepare(`SELECT id,subject,status,total_questions,answered_count,correct_count,started_at,finished_at,updated_at
          FROM exam_sessions WHERE user_id=? AND status IN ('completed','expired') ORDER BY COALESCE(finished_at,updated_at) DESC LIMIT ?`).all(userId,limit);
        return json(res,200,{attempts:rows.map(x=>({...x,wrong_answers:Math.max(0,x.answered_count-x.correct_count),score_percent:x.total_questions?Math.round(x.correct_count/x.total_questions*10000)/100:0}))});
      }
      if(req.method==="GET"&&url.pathname==="/v1/notebooks"){
        const userId=url.searchParams.get("user_id"),id=url.searchParams.get("id");
        if(id){const row=db.prepare("SELECT * FROM question_notebooks WHERE user_id=? AND id=?").get(userId,id)||null;return json(res,200,{notebook:row})}
        return json(res,200,{notebooks:db.prepare("SELECT * FROM question_notebooks WHERE user_id=? ORDER BY updated_at DESC LIMIT 100").all(userId)});
      }
      if(req.method==="PUT"&&url.pathname==="/v1/notebooks"){
        const b=await readBody(req),t=stamp(),id=String(b.id||crypto.randomUUID());
        const tx=db.transaction(()=>{
          db.prepare(`INSERT INTO question_notebooks(id,user_id,title,subjects_json,question_refs_json,answers_json,total_questions,version,created_at,updated_at)
            VALUES(?,?,?,?,?,?,?,1,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,subjects_json=excluded.subjects_json,
            question_refs_json=excluded.question_refs_json,answers_json=excluded.answers_json,total_questions=excluded.total_questions,
            version=question_notebooks.version+1,updated_at=excluded.updated_at`).run(id,b.user_id,b.title||"Caderno",JSON.stringify(b.subjects||[]),JSON.stringify(b.question_refs||[]),JSON.stringify(b.answers||{}),b.total_questions||0,b.created_at||t,t);
          const row=db.prepare("SELECT * FROM question_notebooks WHERE id=?").get(id);
          enqueue(db,{event_id:b.event_id||`notebook:${id}:v${row.version}`,user_id:b.user_id,device_id:syncEngine.deviceId,entity_type:"question_notebook",entity_id:id,operation:"upsert",base_version:Math.max(0,row.version-1),payload:row,created_at:t});
        });tx();return json(res,200,{ok:true,id});
      }
      if(req.method==="GET"&&url.pathname==="/v1/exams"){
        const userId=url.searchParams.get("user_id"),subject=url.searchParams.get("subject");
        const row=db.prepare("SELECT * FROM exam_sessions WHERE user_id=? AND subject=? ORDER BY updated_at DESC LIMIT 1").get(userId,subject)||null;
        return json(res,200,{exam:row});
      }
      if(req.method==="PUT"&&url.pathname==="/v1/exams"){
        const b=await readBody(req),t=stamp(),id=String(b.id||crypto.randomUUID());
        const tx=db.transaction(()=>{
          db.prepare(`INSERT INTO exam_sessions(id,user_id,subject,status,question_ids_json,answers_json,total_questions,answered_count,correct_count,started_at,expires_at,paused_at,remaining_seconds,finished_at,finish_reason,version,created_at,updated_at)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?)
            ON CONFLICT(id) DO UPDATE SET status=excluded.status,answers_json=excluded.answers_json,answered_count=excluded.answered_count,
            correct_count=excluded.correct_count,expires_at=excluded.expires_at,paused_at=excluded.paused_at,remaining_seconds=excluded.remaining_seconds,
            finished_at=excluded.finished_at,finish_reason=excluded.finish_reason,version=exam_sessions.version+1,updated_at=excluded.updated_at`)
            .run(id,b.user_id,b.subject,b.status||"in_progress",JSON.stringify(b.question_ids||[]),JSON.stringify(b.answers||{}),b.total_questions||0,b.answered_count||0,b.correct_count||0,b.started_at||t,b.expires_at||null,b.paused_at||null,b.remaining_seconds??null,b.finished_at||null,b.finish_reason||null,t,t);
          const row=db.prepare("SELECT * FROM exam_sessions WHERE id=?").get(id);
          enqueue(db,{event_id:b.event_id||`exam:${id}:v${row.version}`,user_id:b.user_id,device_id:syncEngine.deviceId,entity_type:"exam_session",entity_id:id,operation:"upsert",base_version:Math.max(0,row.version-1),payload:row,created_at:t});
        });tx();return json(res,200,{ok:true,id});
      }
      return json(res,404,{error:"not_found"});
    }catch(error){
      if(error.name==="TimeoutError"||error.name==="AbortError"||error instanceof TypeError)return json(res,503,{error:"Servidor online indisponível. Confira sua conexão."});
      return json(res,500,{error:String(error.message||error)});
    }
  });
  return new Promise((resolve,reject)=>{
    server.once("error",reject);
    server.listen(0,host,()=>{const a=server.address();resolve({server,port:a.port,token,close:()=>new Promise(r=>server.close(r))})});
  });
}
module.exports={startLocalBridge};
