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
  assert.equal(Number(db.pragma("user_version",{simple:true})),2);
  const tables=db.prepare("select name from sqlite_master where type='table'").all().map(x=>x.name);
  for(const name of ["study_progress","exam_sessions","question_answers","study_plan_items","student_preferences","sync_outbox","sync_state","sync_conflicts","content_snapshots","question_notebooks"])assert.ok(tables.includes(name),name);
  enqueue(db,{event_id:"evt-1",user_id:"u1",device_id:"d1",entity_type:"study_progress",entity_id:"u1:manobrabilidade",operation:"upsert",base_version:0,payload:{percent:10}});
  enqueue(db,{event_id:"evt-1",user_id:"u1",device_id:"d1",entity_type:"study_progress",entity_id:"u1:manobrabilidade",operation:"upsert",base_version:0,payload:{percent:10}});
  assert.equal(getSyncStatus(db).pending,1,"outbox precisa ser idempotente");
  db.prepare("insert into sync_state(scope,cursor,updated_at) values('account','c1',?)").run(new Date().toISOString());
  assert.equal(getSyncStatus(db).state.cursor,"c1");
  console.log("Local-first SQLite invariants OK");
}finally{db.close();fs.rmSync(dir,{recursive:true,force:true})}
