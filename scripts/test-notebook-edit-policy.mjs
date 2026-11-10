import test from "node:test";
import assert from "node:assert/strict";
import {prepareNotebookEdit,completeNotebookEdit} from "../lib/notebook-edit-policy.mjs";

const ref=(subject,id)=>({subject,id:String(id)});

test("respostas anteriores são mantidas mesmo fora dos novos filtros",()=>{
  const plan=prepareNotebookEdit({
    currentRefs:[ref("manobrabilidade",1),ref("manobrabilidade",2),ref("meteorologia",3)],
    answeredRefs:[ref("manobrabilidade",1)],
    pool:[ref("navegacao",4),ref("navegacao",5)],
    requestedCount:3
  });
  assert.equal(plan.answeredCount,1);
  assert.deepEqual(plan.locked,[ref("manobrabilidade",1)]);
  assert.deepEqual(plan.kept,[]);
  const result=completeNotebookEdit(plan,[ref("navegacao",4),ref("navegacao",5)]);
  assert.deepEqual(result.refs,[ref("manobrabilidade",1),ref("navegacao",4),ref("navegacao",5)]);
  assert.equal(result.preserved_answers,1);
  assert.equal(result.total_questions,3);
});

test("mantém questões pendentes compatíveis e troca somente as outras",()=>{
  const plan=prepareNotebookEdit({
    currentRefs:[ref("a",1),ref("a",2),ref("a",3)],
    answeredRefs:[ref("a",1)],
    pool:[ref("a",2),ref("b",8),ref("b",9)],
    requestedCount:3
  });
  assert.deepEqual(plan.kept,[ref("a",2)]);
  assert.deepEqual(plan.freshPool,[ref("b",8),ref("b",9)]);
  const result=completeNotebookEdit(plan,[ref("b",8)]);
  assert.deepEqual(result.refs,[ref("a",1),ref("a",2),ref("b",8)]);
  assert.equal(result.retained_pending,1);
  assert.equal(result.new_pending,1);
});

test("não permite editar para quantidade igual ou menor que respostas definitivas",()=>{
  const input={currentRefs:[ref("a",1),ref("a",2)],answeredRefs:[ref("a",1)],pool:[ref("b",3)]};
  assert.equal(prepareNotebookEdit({...input,requestedCount:1}).status,400);
  assert.equal(prepareNotebookEdit({...input,requestedCount:0}).status,400);
  assert.equal(prepareNotebookEdit({...input,requestedCount:301}).status,400);
  assert.equal(prepareNotebookEdit({...input,requestedCount:2.5}).status,400);
});

test("recusa caderno inconsistente em vez de descartar respostas órfãs",()=>{
  const result=prepareNotebookEdit({
    currentRefs:[ref("a",1)],answeredRefs:[ref("a",44)],
    pool:[ref("b",8)],requestedCount:3
  });
  assert.equal(result.status,409);
});

test("sem nenhuma questão pendente compatível a edição falha",()=>{
  const plan=prepareNotebookEdit({
    currentRefs:[ref("a",1),ref("a",2)],answeredRefs:[ref("a",1)],
    pool:[],requestedCount:2
  });
  const result=completeNotebookEdit(plan,[]);
  assert.equal(result.status,409);
});

test("respeita máximo solicitado, sem duplicar ids após seleção",()=>{
  const plan=prepareNotebookEdit({
    currentRefs:[ref("a",1),ref("a",2),ref("a",3)],
    answeredRefs:[ref("a",1)],
    pool:[ref("a",2),ref("b",3),ref("b",3),ref("b",4)],
    requestedCount:3
  });
  const result=completeNotebookEdit(plan,[ref("b",3),ref("b",3),ref("b",4)]);
  assert.equal(result.total_questions,3);
  assert.equal(new Set(result.refs.map(r=>r.subject+":"+r.id)).size,3);
});
