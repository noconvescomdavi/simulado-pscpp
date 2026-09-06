import {query,withTransaction} from "./db";
import {bibliographyUnits} from "../data/study/bibliography";

let schemaReady=false;

export async function ensureStudyOnboardingProfileSchema(){
  if(schemaReady)return;
  await query(`create table if not exists student_onboarding_preferences (
    user_id uuid primary key references users(id) on delete cascade,
    onboarding_version int not null default 2,
    daily_minutes_by_day jsonb not null default '{}'::jsonb,
    routine_type varchar(32) not null default 'fixed',
    prior_question_level varchar(32) not null default 'rarely',
    prior_simulations boolean not null default false,
    prior_accuracy_band varchar(24),
    missed_day_strategy varchar(32) not null default 'redistribute_week',
    weekend_compensation boolean not null default true,
    updated_at timestamptz not null default now()
  )`);
  schemaReady=true;
}

function cleanMinutesByDay(value){
  const out={};
  for(let day=1;day<=7;day++){
    const minutes=Math.max(0,Math.min(720,Math.trunc(Number(value?.[day]??value?.[String(day)]??0)||0)));
    if(minutes>0)out[String(day)]=minutes;
  }
  return out;
}

export async function getStudyOnboardingProfile(userId){
  await ensureStudyOnboardingProfileSchema();
  const [preferences,progress]=await Promise.all([
    query("select * from student_onboarding_preferences where user_id=$1 limit 1",[userId]),
    query("select bibliography_key,subject_slug,section_key,status from student_bibliography_progress where user_id=$1 and status='done'",[userId])
  ]);
  return{
    preferences:preferences.rows[0]||null,
    studied_units:progress.rows.map(r=>`${r.subject_slug}|${r.bibliography_key}|${r.section_key}`)
  };
}

export async function saveStudyOnboardingProfile(userId,input={}){
  await ensureStudyOnboardingProfileSchema();
  const dailyMinutesByDay=cleanMinutesByDay(input.daily_minutes_by_day||{});
  const routineTypes=new Set(["fixed","variable","shift","highly_variable"]);
  const questionLevels=new Set(["rarely","sometimes","frequent","intensive"]);
  const accuracyBands=new Set(["below40","40-59","60-69","70-79","80-89","90plus"]);
  const missedStrategies=new Set(["redistribute_week","next_available","no_overload"]);
  const routineType=routineTypes.has(input.routine_type)?input.routine_type:"fixed";
  const priorQuestionLevel=questionLevels.has(input.prior_question_level)?input.prior_question_level:"rarely";
  const priorAccuracyBand=accuracyBands.has(input.prior_accuracy_band)?input.prior_accuracy_band:null;
  const missedDayStrategy=missedStrategies.has(input.missed_day_strategy)?input.missed_day_strategy:"redistribute_week";
  const priorSimulations=input.prior_simulations===true;
  const weekendCompensation=input.weekend_compensation!==false;

  const allowedUnits=new Map(
    bibliographyUnits().map(unit=>[
      `${unit.subject_slug}|${unit.bibliography_key}|${unit.section_key}`,
      unit
    ])
  );
  const selected=[...new Set((input.studied_units||[]).map(String).filter(key=>allowedUnits.has(key)))];

  return withTransaction(async client=>{
    await client.query(
      `insert into student_onboarding_preferences(
        user_id,onboarding_version,daily_minutes_by_day,routine_type,prior_question_level,
        prior_simulations,prior_accuracy_band,missed_day_strategy,weekend_compensation,updated_at
      ) values($1,2,$2::jsonb,$3,$4,$5,$6,$7,$8,now())
      on conflict(user_id) do update set
        onboarding_version=2,daily_minutes_by_day=excluded.daily_minutes_by_day,
        routine_type=excluded.routine_type,prior_question_level=excluded.prior_question_level,
        prior_simulations=excluded.prior_simulations,prior_accuracy_band=excluded.prior_accuracy_band,
        missed_day_strategy=excluded.missed_day_strategy,weekend_compensation=excluded.weekend_compensation,
        updated_at=now()`,
      [userId,JSON.stringify(dailyMinutesByDay),routineType,priorQuestionLevel,priorSimulations,priorAccuracyBand,missedDayStrategy,weekendCompensation]
    );

    for(const key of selected){
      const unit=allowedUnits.get(key);
      await client.query(
        `insert into student_bibliography_progress(user_id,bibliography_key,subject_slug,section_key,status,completed_at,updated_at)
         values($1,$2,$3,$4,'done',now(),now())
         on conflict(user_id,bibliography_key,section_key) do update set
           subject_slug=excluded.subject_slug,
           status='done',
           completed_at=coalesce(student_bibliography_progress.completed_at,now()),
           updated_at=now()`,
        [userId,unit.bibliography_key,unit.subject_slug,unit.section_key]
      );
    }

    return{daily_minutes_by_day:dailyMinutesByDay,routine_type:routineType,prior_question_level:priorQuestionLevel,prior_simulations:priorSimulations,prior_accuracy_band:priorAccuracyBand,missed_day_strategy:missedDayStrategy,weekend_compensation:weekendCompensation,studied_units:selected};
  });
}
