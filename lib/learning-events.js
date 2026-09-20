export const LEARNING_EVENT_VERSION=1;
export const LEARNING_EVENTS=Object.freeze({QUESTION_ANSWERED:"question_answered",READING_COMPLETED:"reading_completed",REVIEW_COMPLETED:"review_completed",SIMULATION_COMPLETED:"simulation_completed",FLASHCARD_REVIEWED:"flashcard_reviewed",STUDY_SESSION:"study_session"});
const safe=v=>v&&typeof v==="object"?v:{};
export async function recordLearningEvent(query,{userId,type,subject=null,topic=null,sourceId=null,payload={}}){
 if(!userId||!Object.values(LEARNING_EVENTS).includes(type))return null;
 const sql="insert into learning_events(user_id,event_type,event_version,subject_slug,topic_code,source_id,payload,occurred_at) values($1,$2,$3,$4,$5,$6,$7::jsonb,now()) returning id,occurred_at";
 return query(sql,[userId,type,LEARNING_EVENT_VERSION,subject,topic,sourceId,JSON.stringify(safe(payload))]).then(r=>r.rows[0]).catch(()=>null);
}
export const LEARNING_EVENT_MIGRATION_SQL="create table if not exists learning_events(id bigserial primary key,user_id bigint not null,event_type text not null,event_version int not null default 1,subject_slug text,topic_code text,source_id text,payload jsonb not null default '{}'::jsonb,occurred_at timestamptz not null default now()); create index if not exists learning_events_user_time_idx on learning_events(user_id,occurred_at desc); create index if not exists learning_events_user_type_idx on learning_events(user_id,event_type,occurred_at desc);";
