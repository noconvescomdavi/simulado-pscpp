const path = require("node:path");
const Database = require("better-sqlite3");

const SCHEMA_VERSION = 1;

function nowIso() { return new Date().toISOString(); }

function openLocalDatabase(userDataPath) {
  const dbPath = path.join(userDataPath, "estibordo.sqlite3");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  migrate(db);
  return db;
}

function migrate(db) {
  const version = Number(db.pragma("user_version", { simple: true }) || 0);
  if (version >= SCHEMA_VERSION) return;
  const tx = db.transaction(() => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS local_profile (
        user_id TEXT PRIMARY KEY,
        email TEXT,
        role TEXT NOT NULL DEFAULT 'student',
        entitlement_status TEXT,
        entitlement_checked_at TEXT,
        last_online_auth_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS local_settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS study_progress (
        user_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        percent REAL NOT NULL DEFAULT 0,
        completed_items INTEGER NOT NULL DEFAULT 0,
        total_items INTEGER NOT NULL DEFAULT 0,
        studied_items_json TEXT NOT NULL DEFAULT '[]',
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (user_id, subject)
      );
      CREATE TABLE IF NOT EXISTS exam_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        status TEXT NOT NULL,
        question_ids_json TEXT NOT NULL,
        answers_json TEXT NOT NULL DEFAULT '{}',
        total_questions INTEGER NOT NULL DEFAULT 0,
        answered_count INTEGER NOT NULL DEFAULT 0,
        correct_count INTEGER NOT NULL DEFAULT 0,
        started_at TEXT NOT NULL,
        expires_at TEXT,
        paused_at TEXT,
        remaining_seconds INTEGER,
        finished_at TEXT,
        finish_reason TEXT,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS exam_sessions_user_updated_idx ON exam_sessions(user_id, updated_at DESC);
      CREATE TABLE IF NOT EXISTS question_answers (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        session_id TEXT,
        question_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        selected_answer TEXT,
        is_correct INTEGER NOT NULL,
        response_time_ms INTEGER,
        answered_at TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS question_answers_user_date_idx ON question_answers(user_id, answered_at DESC);
      CREATE TABLE IF NOT EXISTS study_plan_items (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan_date TEXT NOT NULL,
        task_key TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payload_json TEXT NOT NULL DEFAULT '{}',
        completed_at TEXT,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, plan_date, task_key)
      );
      CREATE TABLE IF NOT EXISTS student_preferences (
        user_id TEXT PRIMARY KEY,
        value_json TEXT NOT NULL DEFAULT '{}',
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sync_outbox (
        event_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        base_version INTEGER,
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        attempt_count INTEGER NOT NULL DEFAULT 0,
        next_attempt_at TEXT,
        last_error TEXT,
        state TEXT NOT NULL DEFAULT 'pending'
      );
      CREATE INDEX IF NOT EXISTS sync_outbox_pending_idx ON sync_outbox(state, next_attempt_at, created_at);
      CREATE TABLE IF NOT EXISTS sync_state (
        scope TEXT PRIMARY KEY,
        cursor TEXT,
        last_success_at TEXT,
        last_attempt_at TEXT,
        last_error TEXT,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sync_conflicts (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        local_version INTEGER,
        remote_version INTEGER,
        local_payload_json TEXT,
        remote_payload_json TEXT,
        resolution TEXT,
        created_at TEXT NOT NULL,
        resolved_at TEXT
      );
      CREATE TABLE IF NOT EXISTS content_snapshots (
        content_key TEXT PRIMARY KEY,
        version TEXT NOT NULL,
        checksum TEXT,
        installed_at TEXT NOT NULL,
        metadata_json TEXT NOT NULL DEFAULT '{}'
      );
    `);
    db.pragma(`user_version = ${SCHEMA_VERSION}`);
  });
  tx();
}

function getSyncStatus(db) {
  const pending = db.prepare("SELECT count(*) AS n FROM sync_outbox WHERE state IN ('pending','retry')").get().n;
  const conflicts = db.prepare("SELECT count(*) AS n FROM sync_conflicts WHERE resolved_at IS NULL").get().n;
  const state = db.prepare("SELECT * FROM sync_state WHERE scope='account'").get() || null;
  return { pending, conflicts, state };
}

function enqueue(db, event) {
  const stamp = nowIso();
  db.prepare(`
    INSERT INTO sync_outbox(event_id,user_id,device_id,entity_type,entity_id,operation,base_version,payload_json,created_at,updated_at,state)
    VALUES(@event_id,@user_id,@device_id,@entity_type,@entity_id,@operation,@base_version,@payload_json,@created_at,@updated_at,'pending')
    ON CONFLICT(event_id) DO NOTHING
  `).run({ ...event, base_version: event.base_version ?? null, payload_json: JSON.stringify(event.payload ?? {}), created_at: event.created_at || stamp, updated_at: stamp });
}

module.exports = { openLocalDatabase, getSyncStatus, enqueue, SCHEMA_VERSION };
