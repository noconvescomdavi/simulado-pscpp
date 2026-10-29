import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
import vm from "node:vm";

const file=resolve(dirname(fileURLToPath(import.meta.url)),"../lib/pscpp-exam-selection.js");
const source=readFileSync(file,"utf8").replace(/^import .*$/gm,"").replace(/\bexport\s+/g,"");
const {buildFixedPscppExam,PSCPP_QUOTAS}=vm.runInNewContext(
  source+"\n({buildFixedPscppExam,PSCPP_QUOTAS})",
  {historicalSubject:q=>q.subject}
);

function pool(){
  return Object.entries(PSCPP_QUOTAS).flatMap(([subject,quota])=>
    Array.from({length:quota},(_,i)=>({
      subject,id:subject+"-"+i,question:"Enunciado "+subject+" "+i,
      topic:"conceito-"+i,active:true
    }))
  );
}

test("normal PSCPP exam refuses to reuse answered questions",()=>{
  const all=pool();
  assert.throws(()=>buildFixedPscppExam(all.filter(q=>q.id!=="comunicacoes-9"),"test"),
    /comunicacoes: 9\/10/);
});

test("explicit revision retains 100-question quota and uses only needed answered questions",()=>{
  const all=pool();
  const fresh=new Set(all.filter(q=>q.id!=="comunicacoes-9").map(q=>q.id));
  const exam=buildFixedPscppExam(all,"test",{preferredIds:fresh});
  assert.equal(exam.length,100);
  assert.equal(exam.filter(q=>!fresh.has(q.id)).length,1);
  for(const [subject,quota] of Object.entries(PSCPP_QUOTAS)){
    assert.equal(exam.filter(q=>q.subject===subject).length,quota);
  }
});

test("revision also refuses a bank with no ten distinct Communication topics",()=>{
  const all=pool().filter(q=>q.id!=="comunicacoes-9");
  assert.throws(()=>buildFixedPscppExam(all,"test",{preferredIds:new Set(all.map(q=>q.id))}),
    /comunicacoes: 9\/10/);
});
