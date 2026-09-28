import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {openLocalDatabase,enqueue,getSyncStatus}=require("../desktop/local-db.cjs");

const dir=fs.mkdtempSync(path.join(os.tmpdir(),"estibordo-local-first-"));
const db=openLocalDatabase(dir);
try{
  assert.equal(Number(db.pragma("user_version",{simple:true})),3);
  const tables=db.prepare("select name from sqlite_master where type='table'").all().map(x=>x.name);
  for(const name of ["study_progress","exam_sessions","question_answers","study_plan_items","student_preferences","sync_outbox","sync_state","sync_conflicts","content_snapshots","question_notebooks"])assert.ok(tables.includes(name),name);
  enqueue(db,{event_id:"evt-1",user_id:"u1",device_id:"d1",entity_type:"study_progress",entity_id:"u1:manobrabilidade",operation:"upsert",base_version:0,payload:{percent:10}});
  enqueue(db,{event_id:"evt-1",user_id:"u1",device_id:"d1",entity_type:"study_progress",entity_id:"u1:manobrabilidade",operation:"upsert",base_version:0,payload:{percent:10}});
  assert.equal(getSyncStatus(db).pending,1,"outbox precisa ser idempotente");
  db.prepare("insert into sync_state(scope,cursor,updated_at) values('account','c1',?)").run(new Date().toISOString());
  assert.equal(getSyncStatus(db).state.cursor,"c1");
  console.log("Local-first SQLite invariants OK");
}finally{db.close();fs.rmSync(dir,{recursive:true,force:true})}
const legacyDir=fs.mkdtempSync(path.join(os.tmpdir(),"estibordo-v2-"));
try{
  const Database=require("better-sqlite3"),legacy=new Database(path.join(legacyDir,"estibordo.sqlite3"));
  legacy.exec("CREATE TABLE local_profile (user_id TEXT PRIMARY KEY,email TEXT,role TEXT,entitlement_status TEXT,entitlement_checked_at TEXT,last_online_auth_at TEXT,created_at TEXT,updated_at TEXT); PRAGMA user_version=2");
  legacy.close();
  const migrated=openLocalDatabase(legacyDir);
  assert.equal(Number(migrated.pragma("user_version",{simple:true})),3);
  const columns=migrated.pragma("table_info(local_profile)").map(column=>column.name);
  assert.ok(columns.includes("entitlement_expires_at")&&columns.includes("entitlement_lifetime"));
  migrated.close();
}finally{fs.rmSync(legacyDir,{recursive:true,force:true})}
