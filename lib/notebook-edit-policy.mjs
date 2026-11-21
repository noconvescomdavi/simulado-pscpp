// Pure policy shared by notebook editing and its regression tests.
// Answered questions are immutable; editing only replaces pending slots.
export function notebookRefKey(ref){
  return String(ref?.subject||"")+":"+String(ref?.id??ref?.question_id??"");
}

export function prepareNotebookEdit({currentRefs,answeredRefs,pool,requestedCount}){
  if(!Number.isInteger(requestedCount)||requestedCount<1||requestedCount>300){
    return {error:"Informe uma quantidade entre 1 e 300 questões.",status:400};
  }
  const refs=Array.isArray(currentRefs)?currentRefs:[];
  const answers=Array.isArray(answeredRefs)?answeredRefs:[];
  const keyOf=notebookRefKey;
  const currentKeys=new Set(refs.map(keyOf));
  const answeredKeys=new Set(answers.map(keyOf));
  if(answers.some(ref=>!currentKeys.has(keyOf(ref)))){
    return {error:"Há respostas sem correspondência no caderno. Contate o suporte antes de editar.",status:409};
  }
  if(requestedCount<=answeredKeys.size){
    return {error:"A quantidade precisa ser maior que as questões já respondidas. As respostas existentes são preservadas.",status:400};
  }

  const locked=[],unanswered=[],seen=new Set();
  for(const ref of refs){
    const key=keyOf(ref);
    if(seen.has(key))continue;
    seen.add(key);
    if(answeredKeys.has(key))locked.push(ref);
    else unanswered.push(ref);
  }

  const allowed=new Map();
  for(const ref of pool||[]){
    const key=keyOf(ref);
    if(!allowed.has(key))allowed.set(key,ref);
  }
  const slots=requestedCount-locked.length;
  const kept=unanswered.filter(ref=>allowed.has(keyOf(ref))).slice(0,slots);
  const excluded=new Set([...locked,...kept].map(keyOf));
  const freshPool=[...allowed.values()].filter(ref=>!excluded.has(keyOf(ref)));
  return {locked,kept,freshPool,remainingSlots:slots-kept.length,requestedCount,answeredCount:locked.length};
}

export function completeNotebookEdit(plan,selected=[]){
  if(plan?.error)return plan;
  const included=new Set([...plan.locked,...plan.kept].map(notebookRefKey));
  const refs=[...plan.locked,...plan.kept];
  for(const item of selected){
    const ref={subject:item.subject,id:String(item.id)};
    const key=notebookRefKey(ref);
    if(included.has(key))continue;
    included.add(key);
    if(refs.length>=plan.requestedCount)break;
    refs.push(ref);
  }
  if(refs.length<=plan.answeredCount){
    return {error:"Não há questões pendentes compatíveis com os filtros escolhidos. Ajuste a seleção.",status:409};
  }
  return {refs,total_questions:refs.length,preserved_answers:plan.answeredCount,
    retained_pending:plan.kept.length,new_pending:refs.length-plan.answeredCount-plan.kept.length};
}
