const crypto = require("node:crypto");
const http = require("node:http");
const { getSyncStatus, enqueue } = require("./local-db.cjs");

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
function startLocalBridge({db,syncEngine,host="127.0.0.1"}) {
  const token=crypto.randomBytes(32).toString("hex");
  const server=http.createServer(async(req,res)=>{
    if(req.headers.authorization!==`Bearer ${token}`)return json(res,401,{error:"unauthorized"});
    const url=new URL(req.url,`http://${host}`);
    try{
      if(req.method==="GET"&&url.pathname==="/v1/status")return json(res,200,{ok:true,sync:getSyncStatus(db)});
      if(req.method==="POST"&&url.pathname==="/v1/sync")return json(res,200,await syncEngine.syncNow());
      if(req.method==="GET"&&url.pathname==="/v1/profile"){
        const row=db.prepare("SELECT * FROM local_profile ORDER BY updated_at DESC LIMIT 1").get()||null;
        return json(res,200,{profile:row});
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
    }catch(error){return json(res,500,{error:String(error.message||error)})}
  });
  return new Promise((resolve,reject)=>{
    server.once("error",reject);
    server.listen(0,host,()=>{const a=server.address();resolve({server,port:a.port,token,close:()=>new Promise(r=>server.close(r))})});
  });
}
module.exports={startLocalBridge};
