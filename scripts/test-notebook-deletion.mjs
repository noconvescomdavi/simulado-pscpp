import test from "node:test";
import assert from "node:assert/strict";
import {isNotebookId,deleteNotebookRecord} from "../lib/notebook-deletion-policy.mjs";

const ID="babc1234-1234-4abc-8def-abcdef123456";
const USER="11111111-1111-4111-8111-111111111111";

function fakeTransaction({found=true,answered=0,total=20,deleted=true}={}){
  const calls=[];
  const transaction=async callback=>callback({
    query:async(sql,params)=>{
      calls.push({sql,params});
      if(sql.startsWith("select id,total_questions")){
        return {rows:found?[{id:ID,total_questions:total}]:[],rowCount:found?1:0};
      }
      if(sql.startsWith("select count(*)")){
        return {rows:[{total:answered}],rowCount:1};
      }
      if(sql.startsWith("delete from")){
        return {rows:deleted?[{id:ID}]:[],rowCount:deleted?1:0};
      }
      return {rows:[],rowCount:1};
    }
  });
  return {transaction,calls};
}

test("só aceita identificadores UUID válidos",async()=>{
  assert.equal(isNotebookId(ID),true);
  assert.equal(isNotebookId("abc"),false);
  const f=fakeTransaction();
  const result=await deleteNotebookRecord(USER,"not-a-uuid",f.transaction);
  assert.equal(result.status,400);
  assert.equal(f.calls.length,0);
});

test("outra conta não consegue excluir caderno sem propriedade",async()=>{
  const f=fakeTransaction({found:false});
  const result=await deleteNotebookRecord(USER,ID,f.transaction);
  assert.equal(result.status,404);
  assert.equal(f.calls.length,1);
  assert.match(f.calls[0].sql,/where id=\$1 and user_id=\$2 for update/i);
  assert.deepEqual(f.calls[0].params,[ID,USER]);
});

test("exclusão exige propriedade, registra auditoria e não apaga métricas gerais",async()=>{
  const f=fakeTransaction({answered:3,total:20});
  const result=await deleteNotebookRecord(USER,ID,f.transaction);
  assert.equal(result.ok,true);
  assert.equal(result.answered_count,3);
  assert.equal(result.preserved_global_history,true);
  assert.equal(f.calls.length,4);
  assert.match(f.calls[1].sql,/notebook_id=\$1 and user_id=\$2/i);
  assert.equal(f.calls[2].params[1],"question_notebook_deleted");
  assert.deepEqual(JSON.parse(f.calls[2].params[2]),{
    notebook_id:ID,answered_count:3,total_questions:20,completed:false
  });
  assert.match(f.calls[3].sql,/delete from question_notebooks where id=\$1 and user_id=\$2 returning id/i);
  assert.equal(f.calls.some(x=>/delete from (question_answers|question_stats|study_days)/i.test(x.sql)),false);
});

test("cadernos concluídos também podem ser removidos voluntariamente",async()=>{
  const f=fakeTransaction({answered:20,total:20});
  const result=await deleteNotebookRecord(USER,ID,f.transaction);
  assert.equal(result.ok,true);
  assert.equal(JSON.parse(f.calls[2].params[2]).completed,true);
});

test("exclusão sem confirmação no banco falha, permitindo rollback",async()=>{
  const f=fakeTransaction({deleted:false});
  await assert.rejects(deleteNotebookRecord(USER,ID,f.transaction),/Exclusão concorrente/);
});
