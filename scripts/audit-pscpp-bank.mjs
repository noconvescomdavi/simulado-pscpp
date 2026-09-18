import fs from "node:fs";
const root=new URL("../data/pscpp/",import.meta.url);
const official=JSON.parse(fs.readFileSync(new URL("official-exams.json",root),"utf8"));
const inventory=JSON.parse(fs.readFileSync(new URL("source-inventory.json",root),"utf8"));
const errors=[]; const warnings=[];
const questions=official.questions||[];
const ids=new Set();
const allowedFormats=new Set(["direct","situation","operational","assertions","vf","blanks","sequence","correlation","table","image","calculation","normative","technical_english","hybrid","multiple_choice"]);
for(const q of questions){
 if(!q.id)errors.push("official question without id");
 else if(ids.has(q.id))errors.push("duplicate id "+q.id); else ids.add(q.id);
 if(!q.year||!q.number)errors.push((q.id||"?")+": missing year/number");
 if(!q.annulled&&q.active!==false){
  if(!q.question)errors.push(q.id+": missing question");
  if(!Array.isArray(q.options)||q.options.length<2)errors.push(q.id+": invalid options");
  if(!q.correct_answer)errors.push(q.id+": missing answer");
 }
 if(q.pscpp_format&&!allowedFormats.has(q.pscpp_format))warnings.push(q.id+": unknown format "+q.pscpp_format);
}
const expected=inventory.official_exams?.reduce((s,x)=>s+Number(x.questions||0),0)||0;
if(questions.length<expected)warnings.push(`official corpus incomplete: ${questions.length}/${expected}`);
console.log(JSON.stringify({ok:!errors.length,official_loaded:questions.length,official_expected:expected,errors,warnings},null,2));
if(errors.length)process.exit(1);
