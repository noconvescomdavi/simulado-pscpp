import {randomInt} from "node:crypto";
import {query,withTransaction} from "./db";
import {getQuestionBank,getQuestion} from "./question-banks";
import {filterQuestions,normalizeQuestionFilters,questionTaxonomy} from "./question-filters";
import {normalizeSubject} from "./subjects";
import {getOfficialExamPool} from "./official-exam-bank";
import {loadAnsweredQuestions,selectNotebookQuestions} from "./question-repeat-policy";
import {prepareNotebookEdit,completeNotebookEdit} from "./notebook-edit-policy.mjs";

const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const parseArray=value=>{
  if(Array.isArray(value))return value;
  try{const result=JSON.parse(value||"[]");return Array.isArray(result)?result:[]}catch{return []}
};
const canonicalRef=ref=>({subject:normalizeSubject(ref?.subject),id:String(ref?.id??"")});
function shuffle(items){
  const output=[...items];
  for(let i=output.length-1;i>0;i--){
    const j=randomInt(i+1);
    [output[i],output[j]]=[output[j],output[i]];
  }
  return output;
}
function unanimous(items,getValue){
  const values=items.map(getValue);
  if(!values.length||values.some(value=>!value))return "";
  return new Set(values).size===1?String(values[0]):"";
}

export async function getNotebookEditConfig(userId,notebookId){
  if(!UUID_RE.test(String(notebookId)))return null;
  const r=await query(
    "select id,title,subjects,question_refs,total_questions from question_notebooks where id=$1 and user_id=$2",
    [notebookId,userId]
  );
  const row=r.rows[0];
  if(!row)return null;
  const count=await query(
    "select count(*)::int as total from question_notebook_answers where notebook_id=$1 and user_id=$2",
    [notebookId,userId]
  );
  const answered=Number(count.rows[0]?.total||0);
  const refs=parseArray(row.question_refs).map(canonicalRef);
  const taxonomy=refs.map(ref=>{
    const question=getQuestion(ref.subject,ref.id);
    return question?questionTaxonomy(question,ref.subject):null;
  });
  const examOnly=refs.length>0&&refs.every(ref=>ref.subject==="simulado-pscpp");
  const filters=examOnly
    ?{official_exam_only:true,work_id:"",chapter_id:"",module:""}
    :{
      work_id:unanimous(taxonomy,t=>t?.work?.id),
      chapter_id:unanimous(taxonomy,t=>t?.chapter?.id),
      module:unanimous(taxonomy,t=>t?.module),
      official_exam_only:false
    };
  return {
    id:row.id,title:row.title,
    subjects:parseArray(row.subjects).map(normalizeSubject).filter(Boolean),
    total_questions:Number(row.total_questions||0),
    answered_count:answered,
    completed:answered>=Number(row.total_questions||0),
    filters
  };
}

function buildPool(selectedSubjects,filters){
  const pool=[];
  if(filters.official_exam_only){
    for(const question of filterQuestions(getOfficialExamPool({subjects:selectedSubjects}),filters,"simulado-pscpp")){
      pool.push({subject:"simulado-pscpp",id:String(question.id),question});
    }
  }else{
    for(const subject of selectedSubjects){
      const bank=getQuestionBank(subject);
      for(const question of filterQuestions(bank?.questions||[],filters,subject)){
        pool.push({subject,id:String(question.id),question});
      }
    }
  }
  return pool;
}

export async function editPendingNotebook(userId,notebookId,input={},options={}){
  if(!UUID_RE.test(String(notebookId)))return {error:"Caderno inválido.",status:400};
  if(!Array.isArray(input.subjects)||input.subjects.length>20){
    return {error:"Selecione pelo menos uma matéria válida.",status:400};
  }
  const selectedSubjects=[...new Set(input.subjects.map(normalizeSubject).filter(Boolean))];
  if(!selectedSubjects.length)return {error:"Selecione pelo menos uma matéria.",status:400};
  const requestedCount=Number(input.count);
  if(!Number.isInteger(requestedCount)||requestedCount<1||requestedCount>300){
    return {error:"A quantidade deve estar entre 1 e 300 questões.",status:400};
  }
  if(options.trial&&requestedCount!==10){
    return {error:"No período de testes o caderno deve ter 10 questões.",status:403};
  }
  const filters=normalizeQuestionFilters(input.filters||{});
  const pool=buildPool(selectedSubjects,filters);
  if(!pool.length)return {error:"Nenhuma questão corresponde às matérias ou filtros escolhidos.",status:400};

  return withTransaction(async client=>{
    await client.query("select pg_advisory_xact_lock(hashtext($1))",["question_selection:"+userId]);
    const result=await client.query(
      "select id,title,subjects,question_refs,total_questions from question_notebooks where id=$1 and user_id=$2 for update",
      [notebookId,userId]
    );
    const notebook=result.rows[0];
    if(!notebook)return {error:"Caderno não encontrado.",status:404};

    const answerResult=await client.query(
      "select subject,question_id from question_notebook_answers where notebook_id=$1 and user_id=$2",
      [notebookId,userId]
    );
    const answers=answerResult.rows.map(row=>({subject:normalizeSubject(row.subject),id:String(row.question_id)}));
    if(answers.length>=Number(notebook.total_questions||0)){
      return {error:"Cadernos concluídos não podem ser editados.",status:409};
    }
    const refs=parseArray(notebook.question_refs).map(canonicalRef);
    const plan=prepareNotebookEdit({currentRefs:refs,answeredRefs:answers,pool,requestedCount});
    if(plan.error)return plan;

    const history=await loadAnsweredQuestions(client,userId);
    const specificWork=Boolean(filters.work_id);
    const additional=plan.remainingSlots>0
      ?selectNotebookQuestions(plan.freshPool,history,plan.remainingSlots,{allowWorkReuse:specificWork,shuffle}).selected
      :[];
    const completed=completeNotebookEdit(plan,additional);
    if(completed.error)return completed;
    const title=typeof input.title==="string"&&input.title.trim()
      ?input.title.trim().slice(0,180)
      :notebook.title;
    const subjects=[...new Set([...selectedSubjects,...completed.refs.map(ref=>ref.subject)])];
    const changed=await client.query(
      "update question_notebooks set title=$3,subjects=$4::jsonb,question_refs=$5::jsonb,total_questions=$6,updated_at=now() where id=$1 and user_id=$2 returning id,title,total_questions",
      [notebookId,userId,title,JSON.stringify(subjects),JSON.stringify(completed.refs),completed.total_questions]
    );
    return {ok:true,notebook:changed.rows[0],selection:{
      requested:requestedCount,
      total:completed.total_questions,
      preserved_answers:completed.preserved_answers,
      retained_pending:completed.retained_pending,
      replaced_pending:completed.new_pending,
      reduced_count:completed.total_questions<requestedCount
    }};
  });
}

export async function deletePendingNotebook(userId,notebookId){
  if(!UUID_RE.test(String(notebookId)))return {error:"Caderno inválido.",status:400};
  return withTransaction(async client=>{
    const r=await client.query(
      "select id,total_questions from question_notebooks where id=$1 and user_id=$2 for update",
      [notebookId,userId]
    );
    const row=r.rows[0];
    if(!row)return {error:"Caderno não encontrado.",status:404};
    const answers=await client.query(
      "select count(*)::int as total from question_notebook_answers where notebook_id=$1 and user_id=$2",
      [notebookId,userId]
    );
    if(Number(answers.rows[0]?.total||0)>=Number(row.total_questions||0)){
      return {error:"Cadernos concluídos não podem ser excluídos.",status:409};
    }
    // FK ON DELETE CASCADE remove apenas respostas deste caderno.
    // Histórico geral (question_answers, question_stats, study_days) é mantido.
    await client.query("delete from question_notebooks where id=$1 and user_id=$2",[notebookId,userId]);
    return {ok:true,deleted:true,preserved_global_history:true};
  });
}
