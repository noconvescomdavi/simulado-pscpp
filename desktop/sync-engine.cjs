const crypto = require("node:crypto");

const DEFAULT_INTERVAL_MS = 30_000;
const MAX_BATCH = 200;

function deviceId(db) {
  const row = db.prepare("SELECT value_json FROM local_settings WHERE key='device_id'").get();
  if (row) return JSON.parse(row.value_json);
  const value = crypto.randomUUID();
  db.prepare("INSERT INTO local_settings(key,value_json,updated_at) VALUES('device_id',?,?)").run(JSON.stringify(value), new Date().toISOString());
  return value;
}

function createSyncEngine({ db, getSession, apiBaseUrl, onStatus = () => {} }) {
  let timer = null;
  let running = false;
  const id = deviceId(db);

  async function syncNow() {
    if (running) return { skipped: true };
    const session = await getSession();
    if (!session?.accessToken || !apiBaseUrl) return { offline: true };
    running = true;
    const stamp = new Date().toISOString();
    try {
      const state = db.prepare("SELECT cursor FROM sync_state WHERE scope='account'").get();
      const events = db.prepare(`
        SELECT * FROM sync_outbox
        WHERE state IN ('pending','retry') AND (next_attempt_at IS NULL OR next_attempt_at <= ?)
        ORDER BY created_at ASC LIMIT ?
      `).all(stamp, MAX_BATCH).map(row => ({
        id: row.event_id, device_id: row.device_id, entity_type: row.entity_type,
        entity_id: row.entity_id, operation: row.operation, base_version: row.base_version,
        created_at: row.created_at, payload: JSON.parse(row.payload_json)
      }));

      const response = await fetch(new URL("/api/sync/v1", apiBaseUrl), {
        method: "POST",
        headers: { "Authorization": `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ protocol_version: 1, device_id: id, cursor: state?.cursor || null, events })
      });
      if (!response.ok) throw new Error(`SYNC_HTTP_${response.status}`);
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
            db.prepare("UPDATE sync_outbox SET state='conflict',updated_at=? WHERE event_id=?").run(stamp, result.id);
            db.prepare(`INSERT OR REPLACE INTO sync_conflicts
              (id,entity_type,entity_id,local_version,remote_version,local_payload_json,remote_payload_json,resolution,created_at,resolved_at)
              VALUES(?,?,?,?,?,?,?,?,?,NULL)`).run(
                crypto.randomUUID(), result.entity_type, result.entity_id, result.local_version ?? null,
                result.remote_version ?? null, JSON.stringify(result.local_payload ?? null),
                JSON.stringify(result.remote_payload ?? null), null, stamp
              );
          }
        }
        db.prepare(`INSERT INTO sync_state(scope,cursor,last_success_at,last_attempt_at,last_error,updated_at)
          VALUES('account',?,?,?,NULL,?)
          ON CONFLICT(scope) DO UPDATE SET cursor=excluded.cursor,last_success_at=excluded.last_success_at,
          last_attempt_at=excluded.last_attempt_at,last_error=NULL,updated_at=excluded.updated_at`)
          .run(body.cursor || state?.cursor || null, stamp, stamp, stamp);
      });
      tx();
      onStatus({ ok: true, cursor: body.cursor || null });
      return { ok: true, applied: body.results?.length || 0, changes: body.changes?.length || 0 };
    } catch (error) {
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
  return { syncNow, start, stop, deviceId: id };
}

module.exports = { createSyncEngine };
