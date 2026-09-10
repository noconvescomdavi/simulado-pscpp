import fs from "node:fs";
import assert from "node:assert/strict";

const read=(path)=>fs.readFileSync(path,"utf8");
const legacy=read("db/migrations/007_study_engine.sql");
const v3=read("db/migrations/023_learning_analytics_v3.sql");

assert.match(legacy,/CREATE TABLE IF NOT EXISTS student_study_sessions/i,
  "Migration 007 must define legacy study sessions for this compatibility test.");
assert.match(legacy,/CREATE TABLE IF NOT EXISTS student_topic_mastery/i,
  "Migration 007 must define legacy topic mastery for this compatibility test.");

for(const column of ["task_key","plan_date","last_heartbeat_at"]){
  assert.match(
    v3,
    new RegExp(`ADD COLUMN IF NOT EXISTS\\s+${column}\\b`,"i"),
    `Migration 023 must upgrade legacy student_study_sessions with ${column}.`
  );
}

for(const column of [
  "topic_label","confidence_score","accuracy","answers","errors",
  "review_count","lapse_count","last_activity_at"
]){
  assert.match(
    v3,
    new RegExp(`ADD COLUMN IF NOT EXISTS\\s+${column}\\b`,"i"),
    `Migration 023 must upgrade legacy student_topic_mastery with ${column}.`
  );
}

const planDateAlter=v3.search(/ADD COLUMN IF NOT EXISTS\s+plan_date\b/i);
const planDateIndex=v3.search(/idx_student_study_sessions_user_plan_date/i);
assert.ok(planDateAlter>=0&&planDateIndex>planDateAlter,
  "plan_date must be added before creating its index.");

const confidenceAlter=v3.search(/ADD COLUMN IF NOT EXISTS\s+confidence_score\b/i);
const masteryIndex=v3.search(/idx_student_topic_mastery_user_score/i);
assert.ok(confidenceAlter>=0&&masteryIndex>confidenceAlter,
  "confidence_score must be added before creating the mastery index.");

assert.match(v3,/ranked_open/i,
  "Migration 023 must normalize duplicate open sessions before the unique open-session index.");
assert.match(v3,/PRIMARY KEY \(user_id,subject_slug,topic_code,topic_label\)/i,
  "Migration 023 must migrate mastery identity to include topic_label.");
assert.match(v3,/answered_count/i,
  "Migration 023 must preserve legacy mastery counters when upgrading.");
assert.match(v3,/correct_count/i,
  "Migration 023 must preserve legacy accuracy inputs when upgrading.");

console.log("Learning migration compatibility: OK");
