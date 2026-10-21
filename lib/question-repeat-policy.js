import { normalizeSubject } from "./subjects";

// Questões respondidas — nunca meramente reservadas em cadernos/simulados.
// Usar a identidade do banco de origem quando uma mesma questão aparece
// em "todas-as-materias", no teste grátis ou no Simulado PSCPP.
const key=(subject,id)=>normalizeSubject(subject)+":"+String(id??"");
export function questionHistoryAliases(question, subject){
  const id=String(question?.id??"");
  const subj=normalizeSubject(subject||question?.subject);
  const aliases=new Set([key(subj,id)]);
  const raw=String(question?.source_id??(id.includes("::")?id.split("::").slice(1).join("::"):id));
  const origin=normalizeSubject(question?.source_subject||question?.taxonomy?.subject_slug||question?.tracking?.subject_slug);
  if(origin)aliases.add(key(origin,raw));
  if(id.includes("::")){
    const pivot=id.indexOf("::");
    aliases.add(key(id.slice(0,pivot),id.slice(pivot+2)));
  }
  // A origem oficial pode ter sido respondida no banco da disciplina
  // ou dentro do simulado integral.
  if(subj==="simulado-pscpp"||question?.origin==="official_exam"||question?.pscpp_origin==="official_exam"){
    aliases.add(key("simulado-pscpp",id));
    if(origin)aliases.add(key(origin,id));
  }
  return aliases;
}

export function seenQuestion(question,subject,answered){
  for(const candidate of questionHistoryAliases(question,subject)){
    if(answered.has(candidate))return true;
  }
  return false;
}
export function selectNotebookQuestions(pool,answered,requested,{allowWorkReuse=false,shuffle}={}){
  const unique=new Map();
  for(const item of pool){
    const k=key(item.subject,item.id);
    if(!unique.has(k))unique.set(k,item);
  }
  const candidates=[...unique.values()];
  const order=typeof shuffle==="function"?shuffle:(items=>items);
  const never=order(candidates.filter(q=>!seenQuestion(q.question||q,q.subject,answered)));
  const old=allowWorkReuse?order(candidates.filter(q=>seenQuestion(q.question||q,q.subject,answered))):[];
  const selected=[...never,...old].slice(0,requested);
  return {selected,available_new:never.length,reused:Math.max(0,selected.length-Math.min(never.length,requested)),total_available:candidates.length};
}
export async function loadAnsweredQuestions(client,userId){
  const result=await client.query(`
    SELECT subject,question_id FROM question_answers WHERE user_id=$1
    UNION
    SELECT subject,question_id FROM question_stats WHERE user_id=$1 AND answer_count>0
    UNION
    SELECT subject,question_id FROM question_notebook_answers WHERE user_id=$1
  `,[userId]);
  return new Set(result.rows.map(row=>key(row.subject,row.question_id)));
}
