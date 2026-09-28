import {query} from "./db";
import {normalizeSubject,subjectLabel} from "./subjects";
import {getNotebookScopeEntry} from "./notebook-scope-index";

function parseArray(value){
  if(Array.isArray(value))return value;
  try{return JSON.parse(value||"[]");}catch{return [];}
}

function notebookScope(refs,fallbackSubjects=[]){
  const subjects=new Set((fallbackSubjects||[]).map(normalizeSubject).filter(Boolean));
  const works=new Map(),chapters=new Map();
  for(const rawRef of refs||[]){
    const subject=normalizeSubject(rawRef?.subject),id=String(rawRef?.id??"");
    if(subject)subjects.add(subject);
    const item=getNotebookScopeEntry(subject,id);
    if(!item)continue;
    if(item.work_label)works.set(item.work_id||item.work_label,item.work_label);
    if(item.chapter_label)chapters.set(item.chapter_id||item.chapter_label,item.chapter_label);
  }
  return{subjects:[...subjects].map(subjectLabel),works:[...works.values()],chapters:[...chapters.values()]};
}

export async function listNotebookHistory(userId,limit=30){
  const safeLimit=Math.max(1,Math.min(100,Number(limit)||30));
  const result=await query(`
    SELECT n.id,n.title,n.subjects,n.question_refs,n.total_questions,n.created_at,n.updated_at,
           COUNT(a.id)::int AS answered_count,
           COUNT(a.id) FILTER (WHERE a.is_correct)::int AS correct_count,
           MAX(a.answered_at) AS last_answered_at
      FROM question_notebooks n
      LEFT JOIN question_notebook_answers a ON a.notebook_id=n.id AND a.user_id=n.user_id
     WHERE n.user_id=$1
     GROUP BY n.id,n.title,n.subjects,n.question_refs,n.total_questions,n.created_at,n.updated_at
     ORDER BY n.created_at DESC LIMIT $2`,[userId,safeLimit]);
  return result.rows.map(row=>{
    const total=Number(row.total_questions||0),answered=Number(row.answered_count||0),correct=Number(row.correct_count||0);
    const scorePercent=total?Math.round(correct/total*10000)/100:0;
    return{...row,scope:notebookScope(parseArray(row.question_refs),parseArray(row.subjects)),
      total_questions:total,answered_count:answered,correct_count:correct,
      remaining_count:Math.max(0,total-answered),completed:total>0&&answered>=total,
      score_percent:scorePercent,grade_10:Math.round(scorePercent/10*100)/100};
  });
}
