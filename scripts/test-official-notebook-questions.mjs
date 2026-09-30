import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {randomInt} from "node:crypto";
import {getQuestionBank,getQuestion,publicQuestion} from "../lib/question-banks.js";
import {filterQuestions,normalizeQuestionFilters,questionTaxonomy,questionMatchesFilters} from "../lib/question-filters.js";
import {normalizeSubject,subjectLabel,SUBJECTS,ALL_SUBJECTS_SLUG} from "../lib/subjects.js";
import {getNotebookScopeEntry} from "../lib/notebook-scope-index.js";
import {selectOfficialNotebookQuestions,getOfficialNotebookQuestion,officialNotebookMetadata} from "../lib/official-notebook-questions.js";

const original=JSON.parse(await readFile(new URL("../data/pscpp/official-exams.json",import.meta.url),"utf8"));
const all=selectOfficialNotebookQuestions(SUBJECTS.map(s=>s.slug));
assert.equal(all.length,252); // 10 annulled + 2 quarantined source extractions.
assert.equal(new Set(all.map(q=>q.id)).size,252);
for(const [year,count] of [[2006,69],[2008,67],[2011,67],[2012,49]]){
  const selected=selectOfficialNotebookQuestions([ALL_SUBJECTS_SLUG],{exam_year:String(year)});
  assert.equal(selected.length,count);
  assert.ok(selected.every(q=>q.year===year));
}
for(const q of original.questions){
  const actual=getOfficialNotebookQuestion(all.find(item=>item.id===q.id)?.source_subject,q.id);
  if(q.annulled||q.active===false){assert.equal(actual,null);continue;}
  assert.ok(actual);
  assert.equal(actual.question,q.question);
  assert.deepEqual(actual.options,q.options);
  assert.equal(actual.correct_answer,q.correct_answer);
  assert.deepEqual(actual.structure,q.structure);
  assert.deepEqual(getQuestion(actual.source_subject,q.id),actual);
  const pub=publicQuestion(actual);
  assert.equal(pub.year,q.year);
  assert.equal(pub.number,q.number);
  assert.equal(pub.origin,"official_exam");
  assert.ok(!("correct_answer" in pub) && !("answer" in pub));
  assert.equal(getNotebookScopeEntry(actual.source_subject,q.id).work_id,questionTaxonomy(actual).work.id);
}
for(const subject of SUBJECTS.map(s=>s.slug)){
  const selected=selectOfficialNotebookQuestions([subject]);
  assert.ok(selected.every(q=>q.source_subject===subject));
  assert.equal(officialNotebookMetadata(subject).official_count,selected.length);
}
assert.equal(selectOfficialNotebookQuestions(["conhecimentos-gerais"]).length,0);
assert.equal(selectOfficialNotebookQuestions(SUBJECTS.map(s=>s.slug),{exam_year:"2099"}).length,0);
assert.equal(selectOfficialNotebookQuestions(["manobrabilidade","manobrabilidade"]).length,
  selectOfficialNotebookQuestions(["manobrabilidade"]).length);
const ripeam=selectOfficialNotebookQuestions(SUBJECTS.map(s=>s.slug),{scenario_only:true});
assert.ok(ripeam.length>0&&ripeam.length<all.length);
assert.ok(!questionMatchesFilters({origin:"generated",year:2006},{official_only:true,exam_year:"2006"}));
assert.ok(!questionMatchesFilters({origin:"official_exam",year:2006,annulled:true},{official_only:true}));
for(const id of ["pscpp::official::2011::061","pscpp::official::2012::021"]){
  const q=all.find(q=>q.id===id);
  assert.ok(publicQuestion(q).structure.blocks.some(b=>b.type==="table"),id);
}

// Exercise notebook persistence and correction with an in-memory database boundary.
let notebook,answers=[];
async function query(sql,params=[]){
  if(sql.includes("INSERT INTO question_notebooks (")){
    notebook={id:"historical-test",user_id:params[0],title:params[1],
      subjects:JSON.parse(params[2]),question_refs:JSON.parse(params[3]),total_questions:params[4]};
    answers=[];
    return {rows:[notebook],rowCount:1};
  }
  if(sql.includes("FROM question_notebooks"))return {rows:[notebook],rowCount:1};
  if(sql.includes("INSERT INTO question_notebook_answers")){
    const answer={id:"answer",subject:params[2],question_id:params[3],selected_answer:params[4],
      is_correct:params[5],answered_at:new Date().toISOString()};
    answers.push(answer);return {rows:[answer],rowCount:1};
  }
  if(sql.includes("COUNT(*)::int AS answered_count"))return {rows:[{answered_count:answers.length,
    correct_count:answers.filter(a=>a.is_correct).length}],rowCount:1};
  if(sql.includes("FROM question_notebook_answers"))return {rows:answers,rowCount:answers.length};
  return {rows:[],rowCount:1};
}
const source=await readFile(new URL("../lib/notebooks.js",import.meta.url),"utf8");
const executable=source.replace(/^\uFEFF/,"").replace(/^import[\s\S]*?;\s*$/gm,"")
  .replace(/^export \{[^}]*\} from [^;]*;/gm,"").replace(/\bexport /g,"");
const dependencies={randomInt,query,withTransaction:fn=>fn({query}),getQuestionBank,getQuestion,
  publicQuestion,filterQuestions,normalizeQuestionFilters,questionTaxonomy,normalizeSubject,
  subjectLabel,selectOfficialNotebookQuestions};
const api=new Function(...Object.keys(dependencies),executable+
  ";return {createNotebook,getNotebook,answerNotebook};")(...Object.values(dependencies));
const result=await api.createNotebook("student",{subjects:SUBJECTS.map(s=>s.slug),count:100,
  filters:{official_only:true,exam_year:"2012"}});
assert.equal(result.notebook.total_questions,49);
assert.ok(result.notebook.title.includes("2012"));
for(const ref of result.notebook.question_refs){
  const q=getQuestion(ref.subject,ref.id);
  assert.equal(q.origin,"official_exam");assert.equal(q.year,2012);
  assert.equal(ref.subject,q.source_subject);
}
const resumed=await api.getNotebook("student",notebook.id);
assert.equal(resumed.questions.length,49);
assert.equal(resumed.unavailable_count,0);
const first=resumed.questions[0],key=getQuestion(first.subject,first.id).correct_answer;
const corrected=await api.answerNotebook({userId:"student",notebookId:notebook.id,
  subject:first.subject,questionId:first.id,selectedAnswer:key});
assert.equal(corrected.is_correct,true);
assert.equal(corrected.correct_answer,key);
const after=await api.getNotebook("student",notebook.id);
assert.equal(after.questions[0].answer.correct_answer,key);
assert.equal(after.result.answered_count,1);
const empty=await api.createNotebook("student",{subjects:["conhecimentos-gerais"],count:20,filters:{official_only:true}});
assert.equal(empty.status,400);
const normal=await api.createNotebook("student",{subjects:["manobrabilidade"],count:20,filters:{}});
assert.equal(normal.notebook.total_questions,20);
assert.ok(normal.notebook.question_refs.every(ref=>getQuestionBank(ref.subject).questions.some(q=>String(q.id)===ref.id)));
console.log("Official notebooks verified: 252 original questions, years, subjects, tables, no generated fallback, resume and answer correction.");
