import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
import vm from "node:vm";

// Pure selector loaded independently of the Next.js module resolver.
// Never touches student accounts or production database.
const here=dirname(fileURLToPath(import.meta.url));
const code=readFileSync(resolve(here,"../lib/question-repeat-policy.js"),"utf8")
  .replace(/^import .*$/gm,"").replace(/\bexport\s+/g,"");
const policy=vm.runInNewContext(code+"\n({seenQuestion,questionHistoryAliases,selectNotebookQuestions,loadAnsweredQuestions})",
  {normalizeSubject:v=>String(v||"").trim().toLowerCase()});
const pool=[
  {subject:"arte-naval",id:"a",question:{id:"a"}},
  {subject:"arte-naval",id:"b",question:{id:"b"}},
  {subject:"arte-naval",id:"c",question:{id:"c"}}
];
const answered=new Set(["arte-naval:a"]);
test("general notebooks never repeat answered questions",()=>{
  const result=policy.selectNotebookQuestions(pool,answered,3,{shuffle:x=>x});
  assert.deepEqual(Array.from(result.selected,x=>x.id),["b","c"]);
  assert.equal(result.reused,0);
});
test("a notebook restricted to one work prioritizes new questions, then old ones",()=>{
  const result=policy.selectNotebookQuestions(pool,answered,3,{allowWorkReuse:true,shuffle:x=>x});
  assert.deepEqual(Array.from(result.selected,x=>x.id),["b","c","a"]);
  assert.equal(result.reused,1);
});
test("fully exhausted filters must not recycle in the general mode",()=>{
  const result=policy.selectNotebookQuestions(pool,new Set(["arte-naval:a","arte-naval:b","arte-naval:c"]),3);
  assert.equal(result.selected.length,0);
});
test("virtual bank questions are identified by their original discipline and id",()=>{
  assert.equal(policy.seenQuestion({id:"arte-naval::a",source_subject:"arte-naval",source_id:"a"},"todas-as-materias",answered),true);
});
test("official questions answered through the PSCPP simulator are recognized",()=>{
  assert.equal(policy.seenQuestion({id:"2011:7",source_subject:"navegacao-aguas-restritas"},"simulado-pscpp",new Set(["navegacao-aguas-restritas:2011:7"])),true);
});
test("unanswered questions in created but unfinished notebooks are not excluded",()=>{
  const result=policy.selectNotebookQuestions(pool,new Set(),3);
  assert.equal(result.selected.length,3);
});
test("identity matching requires both subject and id",()=>{
  assert.equal(policy.seenQuestion({id:"a"},"arte-naval",new Set(["comunicacoes:a"])),false);
});
test("query for answered questions reads only the authorized user's history",async()=>{
  const client={query:async(sql,parameters)=>{
    assert.ok(sql.includes("question_answers")&&sql.includes("question_stats")&&sql.includes("question_notebook_answers"));
    assert.deepEqual(Array.from(parameters),["user-one"]);
    return {rows:[{subject:"arte-naval",question_id:"a"}]};
  }};
  const data=await policy.loadAnsweredQuestions(client,"user-one");
  assert.equal(data.has("arte-naval:a"),true);
});
