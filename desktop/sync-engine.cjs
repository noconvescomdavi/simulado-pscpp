const crypto = require("node:crypto");
const {verifiedEntitlement}=require("./offline-grant.cjs");

const DEFAULT_INTERVAL_MS = 30_000;
const MAX_BATCH = 200;

function deviceId(db) {
  const row = db.prepare("SELECT value_json FROM local_settings WHERE key='device_id'").get();
  if (row) return JSON.parse(row.value_json);
  const value = crypto.randomUUID();
  db.prepare("INSERT INTO local_settings(key,value_json,updated_at) VALUES('device_id',?,?)").run(JSON.stringify(value), new Date().toISOString());
  return value;
}

function createSyncEngine({ db, getSession, saveSession, onRenew, onAuthRejected, apiBaseUrl, onStatus = () => {} }) {
  function mergeConflict(result){
    const l=result.local_payload||{},r=result.remote_payload||{};
    if(result.entity_type==="study_progress")return {...r,...l,percent:Math.max(Number(r.percent)||0,Number(l.percent)||0),completed_items:Math.max(Number(r.completed_items)||0,Number(l.completed_items)||0),total_items:Math.max(Number(r.total_items)||0,Number(l.total_items)||0)};
    if(result.entity_type==="exam_session"||result.entity_type==="question_notebook"){
      const parse=v=>{try{return typeof v==="string"?JSON.parse(v):v||{}}catch{return {}}};
      const answers={...parse(r.answers_json||r.answers),...parse(l.answers_json||l.answers)};
      return {...r,...l,answers_json:JSON.stringify(answers),answers};
    }
    return {...r,...l};
  }
  let timer = null;
  let running = false;
  let connectivity = "unknown";
  const id = deviceId(db);

  async function syncNow() {
    if (running) return { skipped: true };
    running = true;
    let session;
    try { session = await getSession(); }
    catch(error){ running=false; return {ok:false,error:String(error.message||error)}; }
    if (!session?.accessToken || !apiBaseUrl) { running=false; connectivity="offline"; return { offline: true }; }
    if(session.expiresAt&&Date.parse(session.expiresAt)-Date.now()<3*86400000){
      try{
        const renewal=await fetch(new URL("/api/desktop/auth",apiBaseUrl),{method:"PUT",headers:{"Authorization":`Bearer ${session.accessToken}`,"Content-Type":"application/json"},body:JSON.stringify({device_id:id}),signal:AbortSignal.timeout(12000),redirect:"error"});
        if(!renewal.ok){
          if([401,403].includes(renewal.status))await onAuthRejected?.(session.userId);
          connectivity=renewal.status>=500?"offline":"auth_required";
          running=false;
          return {ok:false,error:`AUTH_RENEW_HTTP_${renewal.status}`};
        }
        const fresh=await renewal.json();
        if(!fresh.access_token||String(fresh.user?.id)!==String(session.userId)){running=false;return {ok:false,error:"INVALID_AUTH_RESPONSE"}}
        if(!verifiedEntitlement(fresh,session.userId,id)){running=false;return {ok:false,error:"INVALID_OFFLINE_GRANT"}}
        session={...session,accessToken:fresh.access_token,expiresAt:fresh.expires_at,offlineGrant:fresh.offline_grant,offlinePublicKey:fresh.offline_public_key};
        await saveSession?.(session);
        await onRenew?.(fresh);
      }catch(error){connectivity="offline";running=false;return {ok:false,error:String(error.message||error)}}
    }
    const stamp = new Date().toISOString();
    try {
      const state = db.prepare("SELECT cursor FROM sync_state WHERE scope='account'").get();
      const events = db.prepare(`
        SELECT * FROM sync_outbox
        WHERE user_id=? AND state IN ('pending','retry') AND (next_attempt_at IS NULL OR next_attempt_at <= ?)
        ORDER BY created_at ASC LIMIT ?
      `).all(session.userId,stamp, MAX_BATCH).map(row => ({
        id: row.event_id, device_id: row.device_id, entity_type: row.entity_type,
        entity_id: row.entity_id, operation: row.operation, base_version: row.base_version,
        created_at: row.created_at, payload: JSON.parse(row.payload_json)
      }));

      const response = await fetch(new URL("/api/sync/v1", apiBaseUrl), {
        method: "POST",
        headers: { "Authorization": `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ protocol_version: 1, device_id: id, cursor: state?.cursor || null, events }),signal:AbortSignal.timeout(15000),redirect:"error"
      });
      if (!response.ok){
        if([401,403].includes(response.status))await onAuthRejected?.(session.userId);
        throw new Error(`SYNC_HTTP_${response.status}`);
      }
      const body = await response.json();
      function applyRemote(change) {
        const payload=change.payload||{}, t=payload.updated_at||stamp;
        if(change.operation==="delete")return;
        if(change.entity_type==="study_progress"){
          db.prepare(`INSERT INTO study_progress(user_id,subject,percent,completed_items,total_items,studied_items_json,version,created_at,updated_at)
            VALUES(?,?,?,?,?,?,?, ?,?) ON CONFLICT(user_id,subject) DO UPDATE SET percent=excluded.percent,completed_items=excluded.completed_items,
            total_items=excluded.total_items,studied_items_json=excluded.studied_items_json,version=excluded.version,updated_at=excluded.updated_at
            WHERE excluded.version>=study_progress.version`).run(payload.user_id,payload.subject,payload.percent||0,payload.completed_items||0,payload.total_items||0,payload.studied_items_json||"[]",change.version,payload.created_at||t,t);
        } else if(change.entity_type==="student_preferences"){
          db.prepare(`INSERT INTO student_preferences(user_id,value_json,version,created_at,updated_at) VALUES(?,?,?,?,?)
            ON CONFLICT(user_id) DO UPDATE SET value_json=excluded.value_json,version=excluded.version,updated_at=excluded.updated_at
            WHERE excluded.version>=student_preferences.version`).run(payload.user_id,payload.value_json||JSON.stringify(payload.value||{}),change.version,payload.created_at||t,t);
        } else if(change.entity_type==="exam_session"){
          db.prepare(`INSERT INTO exam_sessions(id,user_id,subject,status,question_ids_json,answers_json,total_questions,answered_count,correct_count,started_at,expires_at,paused_at,remaining_seconds,finished_at,finish_reason,version,created_at,updated_at)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,answers_json=excluded.answers_json,
            answered_count=excluded.answered_count,correct_count=excluded.correct_count,finished_at=excluded.finished_at,finish_reason=excluded.finish_reason,
            version=excluded.version,updated_at=excluded.updated_at WHERE excluded.version>=exam_sessions.version`)
            .run(change.entity_id,payload.user_id,payload.subject,payload.status||"in_progress",payload.question_ids_json||"[]",payload.answers_json||"{}",payload.total_questions||0,payload.answered_count||0,payload.correct_count||0,payload.started_at||t,payload.expires_at||null,payload.paused_at||null,payload.remaining_seconds??null,payload.finished_at||null,payload.finish_reason||null,change.version,payload.created_at||t,t);
        } else if(change.entity_type==="question_notebook"){
          db.prepare(`INSERT INTO question_notebooks(id,user_id,title,subjects_json,question_refs_json,answers_json,total_questions,version,created_at,updated_at)
            VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,subjects_json=excluded.subjects_json,
            question_refs_json=excluded.question_refs_json,answers_json=excluded.answers_json,total_questions=excluded.total_questions,
            version=excluded.version,updated_at=excluded.updated_at WHERE excluded.version>=question_notebooks.version`)
            .run(change.entity_id,payload.user_id,payload.title||"Caderno",payload.subjects_json||"[]",payload.question_refs_json||"[]",payload.answers_json||"{}",payload.total_questions||0,change.version,payload.created_at||t,t);
        } else if(change.entity_type==="study_plan_item"){
          db.prepare(`INSERT INTO study_plan_items(id,user_id,plan_date,task_key,status,payload_json,completed_at,version,created_at,updated_at)
            VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,payload_json=excluded.payload_json,
            completed_at=excluded.completed_at,version=excluded.version,updated_at=excluded.updated_at WHERE excluded.version>=study_plan_items.version`)
            .run(change.entity_id,payload.user_id,payload.plan_date,payload.task_key,payload.status||"pending",payload.payload_json||"{}",payload.completed_at||null,change.version,payload.created_at||t,t);
        }
      }
      const tx = db.transaction(() => {
        for (const change of body.changes || []) applyRemote(change);
        for (const result of body.results || []) {
          if (result.status === "applied" || result.status === "duplicate") {
            db.prepare("DELETE FROM sync_outbox WHERE event_id=?").run(result.id);
          } else if (result.status === "conflict") {
            const merged=mergeConflict(result),resolutionId=crypto.randomUUID(),retryId=crypto.randomUUID();
            db.prepare("DELETE FROM sync_outbox WHERE event_id=?").run(result.id);
            db.prepare(`INSERT OR REPLACE INTO sync_conflicts
              (id,entity_type,entity_id,local_version,remote_version,local_payload_json,remote_payload_json,resolution,created_at,resolved_at)
              VALUES(?,?,?,?,?,?,?,?,?,?)`).run(resolutionId,result.entity_type,result.entity_id,result.local_version??null,result.remote_version??null,JSON.stringify(result.local_payload??null),JSON.stringify(result.remote_payload??null),"auto_merge",stamp,stamp);
            db.prepare(`INSERT OR IGNORE INTO sync_outbox(event_id,user_id,device_id,entity_type,entity_id,operation,base_version,payload_json,state,attempt_count,created_at,updated_at)
              VALUES(?,?,?,?,?,'upsert',?,?,'pending',0,?,?)`).run(retryId,session.userId||session.id||merged.user_id,id,result.entity_type,result.entity_id,Number(result.remote_version)||0,JSON.stringify(merged),stamp,stamp);
          }
        }
        db.prepare(`INSERT INTO sync_state(scope,cursor,last_success_at,last_attempt_at,last_error,updated_at)
          VALUES('account',?,?,?,NULL,?)
          ON CONFLICT(scope) DO UPDATE SET cursor=excluded.cursor,last_success_at=excluded.last_success_at,
          last_attempt_at=excluded.last_attempt_at,last_error=NULL,updated_at=excluded.updated_at`)
          .run(body.cursor || state?.cursor || null, stamp, stamp, stamp);
      });
      tx();
      connectivity="online";
      onStatus({ ok: true, cursor: body.cursor || null });
      return { ok: true, applied: body.results?.length || 0, changes: body.changes?.length || 0 };
    } catch (error) {
      connectivity=/SYNC_HTTP_(401|403)/.test(String(error.message))?"auth_required":"offline";
      const retryAt=new Date(Date.now()+Math.min(300000,5000*Math.pow(2,Math.min(6,Number(db.prepare("SELECT COALESCE(MAX(attempt_count),0) n FROM sync_outbox WHERE user_id=? AND state IN ('pending','retry')").get(session.userId)?.n||0))))).toISOString();
      db.prepare("UPDATE sync_outbox SET state='retry',attempt_count=attempt_count+1,next_attempt_at=?,last_error=?,updated_at=? WHERE user_id=? AND state IN ('pending','retry')").run(retryAt,String(error.message||error),stamp,session.userId);
      db.prepare(`INSERT INTO sync_state(scope,last_attempt_at,last_error,updated_at)
        VALUES('account',?,?,?) ON CONFLICT(scope) DO UPDATE SET last_attempt_at=excluded.last_attempt_at,
        last_error=excluded.last_error,updated_at=excluded.updated_at`).run(stamp, String(error.message || error), stamp);
      onStatus({ ok: false, error: String(error.message || error) });
      return { ok: false, error: String(error.message || error) };
    } finally { running = false; }
  }

  function start() {
    if (timer) return;
    timer = setInterval(syncNow, DEFAULT_INTERVAL_MS);
    timer.unref?.();
    void syncNow();
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function online(){ void syncNow(); }
  if(globalThis.addEventListener)globalThis.addEventListener("online",online);
  return { syncNow, start, stop, deviceId: id, getConnectivity:()=>connectivity };
}

module.exports = { createSyncEngine };
