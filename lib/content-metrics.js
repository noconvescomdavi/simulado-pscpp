import {query} from "./db";
import {normalizeSubject,SUBJECTS} from "./subjects";

// The contents overview renders only answer totals. Keep detailed per-question
// diagnostics in getUserMetrics for the pages that actually display them.
export async function getContentMetrics(userId){
  const result=await query(`select subject,
    coalesce(sum(answer_count),0)::int as questions,
    coalesce(sum(correct_count),0)::int as correct,
    coalesce(sum(error_count),0)::int as errors
    from question_stats where user_id=$1 and answer_count>0 group by subject`,[userId]);
  const bySubject=new Map();
  for(const row of result.rows){
    const slug=normalizeSubject(row.subject);
    const current=bySubject.get(slug)||{questions:0,correct:0,errors:0};
    current.questions+=Number(row.questions||0);
    current.correct+=Number(row.correct||0);
    current.errors+=Number(row.errors||0);
    bySubject.set(slug,current);
  }
  const overall=[...bySubject.values()].reduce((sum,row)=>({
    questions:sum.questions+row.questions,correct:sum.correct+row.correct,errors:sum.errors+row.errors
  }),{questions:0,correct:0,errors:0});
  overall.accuracy=overall.questions?Math.round(overall.correct/overall.questions*1000)/10:0;
  const subjects=SUBJECTS.map(subject=>{
    const row=bySubject.get(subject.slug)||{questions:0,correct:0,errors:0};
    return {...subject,...row,accuracy:row.questions?Math.round(row.correct/row.questions*1000)/10:0};
  });
  return {overall,subjects};
}
