"use client";

const DB_NAME="estibordo-offline";
const DB_VERSION=2;
const STORES={meta:"meta",questions:"questions",notebooks:"notebooks",exams:"exams",queue:"queue"};

function req(request){return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
function txDone(tx){return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error("Transação abortada"))})}
function emit(){if(typeof window!=="undefined")window.dispatchEvent(new CustomEvent("estibordo:offline-change"))}
function uuid(){
  if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(token)=>{
    const value=Math.floor(Math.random()*16);
    return (token==="x"?value:(value&3)|8).toString(16);
  });
}
function normalize(v){return String(v||"").trim().toLowerCase()}
function answerKey(q){return String(q?.correct_answer||q?.answer||"").trim().toUpperCase()}
function nowIso(){return new Date().toISOString()}

export function openOfflineDb(){
  if(typeof indexedDB==="undefined")return Promise.reject(new Error("IndexedDB indisponível"));
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORES.meta))db.createObjectStore(STORES.meta,{keyPath:"key"});
      if(!db.objectStoreNames.contains(STORES.questions)){const s=db.createObjectStore(STORES.questions,{keyPath:"key"});s.createIndex("subject","subject",{unique:false})}
      if(!db.objectStoreNames.contains(STORES.notebooks))db.createObjectStore(STORES.notebooks,{keyPath:"id"});
      if(!db.objectStoreNames.contains(STORES.exams)){const s=db.createObjectStore(STORES.exams,{keyPath:"id"});s.createIndex("subject","subject",{unique:false})}
      if(!db.objectStoreNames.contains(STORES.queue)){const s=db.createObjectStore(STORES.queue,{keyPath:"id"});s.createIndex("created_at","created_at",{unique:false})}
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}

async function put(store,value){const db=await openOfflineDb();const tx=db.transaction(store,"readwrite");tx.objectStore(store).put(value);await txDone(tx);db.close();emit();return value}
async function get(store,key){const db=await openOfflineDb();const tx=db.transaction(store,"readonly");const value=await req(tx.objectStore(store).get(key));await txDone(tx);db.close();return value||null}
async function all(store){const db=await openOfflineDb();const tx=db.transaction(store,"readonly");const value=await req(tx.objectStore(store).getAll());await txDone(tx);db.close();return value||[]}
async function del(store,key){const db=await openOfflineDb();const tx=db.transaction(store,"readwrite");tx.objectStore(store).delete(key);await txDone(tx);db.close();emit()}
async function clearStore(store){const db=await openOfflineDb();const tx=db.transaction(store,"readwrite");tx.objectStore(store).clear();await txDone(tx);db.close()}
async function getScope(){return (await get(STORES.meta,"user_scope"))?.value||null}

export async function purgeOfflinePrivateData(){
  for(const store of [STORES.questions,STORES.notebooks,STORES.exams,STORES.queue])await clearStore(store);
  const db=await openOfflineDb();
  const tx=db.transaction(STORES.meta,"readwrite");
  const meta=tx.objectStore(STORES.meta);
  meta.delete("pack");meta.delete("user_scope");meta.delete("device_id");
  await txDone(tx);db.close();
  if(typeof caches!=="undefined"){
    for(const name of await caches.keys()){
      if(name.startsWith("estibordo-reading-files-")||name.startsWith("estibordo-private-pages-"))await caches.delete(name);
    }
  }
  try{navigator.serviceWorker?.controller?.postMessage({type:"PURGE_PRIVATE_DATA"})}catch{}
  emit();
}

export async function setOfflineUserScope(userId){
  const next=String(userId||"").trim();
  if(!next)return null;
  const current=await getScope();
  if(current&&current!==next)await purgeOfflinePrivateData();
  await put(STORES.meta,{key:"user_scope",value:next});
  try{navigator.serviceWorker?.controller?.postMessage({type:"SET_PRIVATE_SCOPE",scope:next})}catch{}
  return next;
}

async function replaceOfflineSubject({subject,title,questions,version}){
  const db=await openOfflineDb();
  const readTx=db.transaction(STORES.questions,"readonly");
  const keys=await req(readTx.objectStore(STORES.questions).index("subject").getAllKeys(subject));
  await txDone(readTx);db.close();

  const writeDb=await openOfflineDb();
  const tx=writeDb.transaction([STORES.questions,STORES.meta],"readwrite");
  const store=tx.objectStore(STORES.questions);
  for(const key of keys)store.delete(key);
  for(const question of questions||[])store.put({...question,subject,key:`${subject}:${question.id}`});
  const current=await get(STORES.meta,"pack");
  const subjects=[...new Set([...(current?.subjects||[]),subject])];
  tx.objectStore(STORES.meta).put({
    key:"pack",version:version||current?.version||"unknown",downloaded_at:nowIso(),subjects,
    bank_counts:{...(current?.bank_counts||{}),[subject]:(questions||[]).length},
    bank_titles:{...(current?.bank_titles||{}),[subject]:title||subject}
  });
  await txDone(tx);writeDb.close();emit();
}

export async function installOfflinePack(pack){
  for(const bank of pack?.banks||[])await replaceOfflineSubject({subject:bank.subject,title:bank.title,questions:bank.questions||[],version:pack?.version});
  return getOfflineStatus();
}

export async function downloadOfflinePack(subjects=[]){
  const manifestResponse=await fetch("/api/offline/manifest",{cache:"no-store"});
  const manifest=await manifestResponse.json().catch(()=>({}));
  if(!manifestResponse.ok)throw new Error(manifest.error||"Não foi possível consultar o conteúdo offline.");
  const wanted=new Set((subjects||[]).map(normalize).filter(Boolean));
  const banks=(manifest.banks||[]).filter(bank=>!wanted.size||wanted.has(normalize(bank.subject)));
  if(!banks.length)throw new Error("Nenhum banco offline disponível para a seleção.");

  for(const bank of banks){
    let offset=0;
    const questions=[];
    while(offset!==null){
      const params=new URLSearchParams({subject:bank.subject,offset:String(offset),limit:String(manifest.chunk_size||500)});
      const response=await fetch("/api/offline/bootstrap?"+params.toString(),{cache:"no-store"});
      const payload=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(payload.error||`Falha ao baixar ${bank.title||bank.subject}.`);
      questions.push(...(payload.questions||[]));
      offset=payload.next_offset===null?null:Number(payload.next_offset);
    }
    await replaceOfflineSubject({subject:bank.subject,title:bank.title,questions,version:manifest.version});
  }
  return getOfflineStatus();
}

export async function getOfflineQuestion(subject,id){return get(STORES.questions,`${subject}:${id}`)}

async function questionsForSubjects(subjects){
  const wanted=new Set((subjects||[]).map(normalize));
  return (await all(STORES.questions)).filter(q=>!wanted.size||wanted.has(normalize(q.subject)));
}

function matchesFilters(q,filters={}){
  const work=filters.work_id||filters.work||filters.bibliography_key;
  const chapter=filters.chapter_id||filters.chapter||filters.section_key;
  const module=filters.module||filters.topic;
  const term=filters.term||filters.search||filters.query;
  if(work&&![q.tracking?.work?.id,q.tracking?.work?.title].some(x=>normalize(x)===normalize(work)))return false;
  if(chapter&&![q.tracking?.chapter?.id,q.tracking?.chapter?.label,q.tracking?.chapter?.title].some(x=>normalize(x)===normalize(chapter)))return false;
  if(module&&normalize(q.tracking?.module||q.module)!==normalize(module))return false;
  if(term&&!normalize([q.question,q.topic,q.module,(q.tags||[]).join(" ")].join(" ")).includes(normalize(term)))return false;
  return true;
}
function shuffle(items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function calcResult(total,answers){
  const rows=Object.values(answers||{});
  const correct=rows.filter(x=>x.is_correct).length;
  const answered=rows.length;
  const score=total?Math.round(correct/total*10000)/100:0;
  return {total_questions:total,answered_count:answered,correct_count:correct,error_count:answered-correct,remaining_count:Math.max(0,total-answered),completed:total>0&&answered>=total,score_percent:score,grade_10:Math.round(score*10)/100};
}

export async function queueOfflineEvent(type,payload,{id=null}={}){
  const event={id:id||uuid(),type,payload,created_at:nowIso(),device_id:await getDeviceId()};
  await put(STORES.queue,event);
  try{
    if(typeof navigator!=="undefined"&&"serviceWorker" in navigator){
      const reg=await navigator.serviceWorker.ready;
      if("sync" in reg)await reg.sync.register("estibordo-offline-sync").catch(()=>{});
    }
  }catch{}
  return event;
}

export async function getDeviceId(){
  let item=await get(STORES.meta,"device_id");
  if(item?.value)return item.value;
  const value=uuid();await put(STORES.meta,{key:"device_id",value});return value;
}

export async function createOfflineNotebook({subjects,count=20,filters={},fixation=null,title=null}){
  let pool=(await questionsForSubjects(subjects)).filter(q=>matchesFilters(q,filters));
  if(fixation)pool=pool.filter(q=>matchesFilters(q,{work_id:fixation.bibliography_key,chapter_id:fixation.section_key||fixation.chapter}));
  if(!pool.length)throw new Error("Nenhuma questão disponível offline para estes filtros.");
  const selected=shuffle(pool).slice(0,Math.min(100,Math.max(1,Number(count)||20)));
  const id=uuid();
  const notebook={id,local:true,title:title||`Caderno offline · ${selected.length} questões`,subjects:[...new Set(selected.map(q=>q.subject))],question_refs:selected.map(q=>({subject:q.subject,id:String(q.id)})),total_questions:selected.length,answers:{},created_at:nowIso(),updated_at:nowIso()};
  await put(STORES.notebooks,notebook);
  await queueOfflineEvent("notebook.create",{id:notebook.id,title:notebook.title,subjects:notebook.subjects,question_refs:notebook.question_refs,total_questions:notebook.total_questions},{id:`notebook-create:${id}`});
  return notebook;
}

export async function cacheServerNotebook(notebook){
  if(!notebook?.id)return;
  const existing=await get(STORES.notebooks,String(notebook.id));
  const refs=(notebook.questions||[]).map(q=>({subject:q.subject,id:String(q.id)}));
  const answers={...(existing?.answers||{})};
  for(const q of notebook.questions||[])if(q.answer)answers[`${q.subject}:${q.id}`]=q.answer;
  await put(STORES.notebooks,{...(existing||{}),id:String(notebook.id),local:false,title:notebook.title,subjects:notebook.subjects||[],question_refs:refs,total_questions:refs.length,answers,created_at:notebook.created_at||existing?.created_at||nowIso(),updated_at:nowIso()});
}

export async function getOfflineNotebook(id){return get(STORES.notebooks,String(id))}

export async function answerOfflineNotebook(notebookId,{subject,question_id,selected_answer,plan_task=null}){
  const notebook=await getOfflineNotebook(notebookId);if(!notebook)throw new Error("Caderno offline não encontrado.");
  const key=`${subject}:${question_id}`;if(notebook.answers?.[key])return {duplicate:true,...notebook.answers[key],result:calcResult(notebook.total_questions,notebook.answers)};
  const q=await getOfflineQuestion(subject,question_id);if(!q)throw new Error("Questão não está disponível no pacote offline.");
  const chosen=String(selected_answer||"").toUpperCase();const correct=answerKey(q);const saved={selected_answer:chosen,is_correct:chosen===correct,correct_answer:correct||null,explanation:q.explanation||null,source:q.source||null,answered_at:nowIso()};
  notebook.answers={...(notebook.answers||{}),[key]:saved};notebook.updated_at=nowIso();await put(STORES.notebooks,notebook);
  await queueOfflineEvent("notebook.answer",{notebook_id:String(notebook.id),subject,question_id:String(question_id),selected_answer:chosen,plan_task},{id:`notebook-answer:${notebook.id}:${subject}:${question_id}`});
  const result=calcResult(notebook.total_questions,notebook.answers);
  if(result.completed&&plan_task?.plan_date&&plan_task?.task_key)await queueOfflineEvent("study.task",{...plan_task,status:"done",kind:"task",metadata:{...(plan_task.metadata||{}),source:"offline_notebook_completion",notebook_id:String(notebook.id)}},{id:`task:${plan_task.plan_date}:${plan_task.task_key}`});
  return {...saved,result};
}

export async function createOfflineExam({subject,count=100,filters={},title=null,planTask=null}){
  const pool=(await questionsForSubjects([subject])).filter(q=>matchesFilters(q,filters));
  if(!pool.length)throw new Error("Banco desta matéria ainda não foi baixado para uso offline.");
  const selected=shuffle(pool).slice(0,Math.min(100,Math.max(1,Number(count)||100)));
  const started=Date.now();const id=uuid();
  const exam={id,subject,title:title||`Simulado offline · ${subject}`,question_ids:selected.map(q=>String(q.id)),answers:{},started_at:new Date(started).toISOString(),expires_at:new Date(started+240*60*1000).toISOString(),status:"in_progress",finish_reason:null,finished_at:null,planTask};
  await put(STORES.exams,exam);await queueExamSnapshot(exam);return exam;
}
export async function cacheServerExam(exam,planTask=null){
  if(!exam?.id)return null;const existing=await get(STORES.exams,String(exam.id));
  const merged={...(existing||{}),id:String(exam.id),subject:exam.subject,title:exam.title,question_ids:(exam.questions||[]).map(q=>String(q.id)),started_at:exam.started_at,expires_at:exam.expires_at,status:exam.status||"in_progress",answers:existing?.answers||{},planTask:planTask||existing?.planTask||null};
  await put(STORES.exams,merged);return merged;
}
export async function getOfflineExam(id){return get(STORES.exams,String(id))}
export async function hydrateOfflineExam(exam){
  if(!exam)return null;
  const questions=[];
  for(const id of exam.question_ids||[]){
    const question=await getOfflineQuestion(exam.subject,id);
    if(question)questions.push(question);
  }
  const answers=exam.answers||{};
  const result=exam.status!=="in_progress"?calcResult(questions.length,answers):null;
  return {
    ...exam,
    questions,
    answered_count:Object.keys(answers).length,
    correct_count:Object.values(answers).filter(x=>x.is_correct).length,
    current_index:Math.min(Object.keys(answers).length,Math.max(0,questions.length-1)),
    total_questions:questions.length,
    duration_seconds:240*60,
    result:result?{...result,session_id:exam.id,subject:exam.subject,reason:exam.finish_reason||"manual"}:null,
  };
}
export async function getLatestOfflineExam(subject){
  const items=(await all(STORES.exams)).filter(x=>x.subject===subject).sort((a,b)=>String(b.started_at).localeCompare(String(a.started_at)));return items[0]?hydrateOfflineExam(items[0]):null;
}
async function queueExamSnapshot(exam){return queueOfflineEvent("exam.snapshot",{...exam,answers:Object.values(exam.answers||{})},{id:`exam:${exam.id}`})}
export async function answerOfflineExam(examId,{question_id,selected_answer,response_time_ms=0}){
  const exam=await getOfflineExam(examId);if(!exam)throw new Error("Simulado offline não encontrado.");
  if(exam.status!=="in_progress")throw new Error("Este simulado já foi finalizado.");
  const q=await getOfflineQuestion(exam.subject,question_id);if(!q)throw new Error("Questão indisponível offline.");
  const key=String(question_id);if(exam.answers?.[key])return exam.answers[key];
  const chosen=String(selected_answer||"").toUpperCase();const correct=answerKey(q);
  const answer={question_id:key,selected_answer:chosen,is_correct:chosen===correct,correct_answer:correct||null,explanation:q.explanation||null,source:q.source||null,response_time_ms:Math.max(0,Number(response_time_ms)||0),answered_at:nowIso()};
  exam.answers={...(exam.answers||{}),[key]:answer};
  if(Object.keys(exam.answers).length>=exam.question_ids.length){exam.status="completed";exam.finish_reason="completed";exam.finished_at=nowIso()}
  await put(STORES.exams,exam);await queueExamSnapshot(exam);
  if(exam.status==="completed"&&exam.planTask?.plan_date&&exam.planTask?.task_key)await queueOfflineEvent("study.task",{...exam.planTask,status:"done",kind:"task",metadata:{source:"offline_exam_completion",session_id:exam.id}},{id:`task:${exam.planTask.plan_date}:${exam.planTask.task_key}`});
  return {...answer,result:exam.status==="completed"?calcResult(exam.question_ids.length,exam.answers):null};
}
export async function finishOfflineExam(examId,reason="manual"){
  const exam=await getOfflineExam(examId);if(!exam)throw new Error("Simulado offline não encontrado.");
  exam.status=reason==="timeout"?"expired":"completed";exam.finish_reason=reason;exam.finished_at=nowIso();await put(STORES.exams,exam);await queueExamSnapshot(exam);
  return calcResult(exam.question_ids.length,exam.answers);
}

export async function queueStudyTask(body){return queueOfflineEvent(body.kind==="bibliography"?"reading.progress":"study.task",body,{id:body.kind==="bibliography"?`reading:${body.bibliography_key}:${body.section_key}`:`task:${body.plan_date}:${body.task_key}`})}

export async function syncOfflineQueue(){
  if(typeof navigator!=="undefined"&&!navigator.onLine)return {ok:false,offline:true};
  const allEvents=(await all(STORES.queue)).sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at)));
  if(!allEvents.length)return {ok:true,synced:0,pending:0};
  let synced=0;
  for(let offset=0;offset<allEvents.length;offset+=50){
    const events=allEvents.slice(offset,offset+50);
    const response=await fetch("/api/offline/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({events})});
    const payload=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(payload.error||"Falha ao sincronizar dados offline.");
    for(const item of payload.results||[])if(item.ok){await del(STORES.queue,item.id);synced++}
    if((payload.results||[]).some(x=>!x.ok))break;
  }
  const status=await getOfflineStatus();emit();return {ok:true,synced,pending:status.pending};
}

export async function getOfflineStatus(){
  const [pack,questions,queue,notebooks,exams]=await Promise.all([get(STORES.meta,"pack"),all(STORES.questions),all(STORES.queue),all(STORES.notebooks),all(STORES.exams)]);
  return {installed:Boolean(pack),version:pack?.version||null,downloaded_at:pack?.downloaded_at||null,subjects:pack?.subjects||[],questions:questions.length,pending:queue.length,notebooks:notebooks.length,exams:exams.length};
}

export function onOfflineChange(callback){if(typeof window==="undefined")return()=>{};const fn=()=>callback();window.addEventListener("estibordo:offline-change",fn);return()=>window.removeEventListener("estibordo:offline-change",fn)}


async function readingCacheName(){const scope=(await getScope())||"anonymous";return "estibordo-reading-files-v2-"+scope.replace(/[^a-zA-Z0-9_-]/g,"").slice(0,64)}
export async function cacheReadingResponse(fileId,response){
  if(typeof caches==="undefined"||!response)return false;
  const cache=await caches.open(await readingCacheName());
  await cache.put(new Request("/offline-files/drive/"+String(fileId)+".pdf"),response.clone());
  emit();
  return true;
}
export async function getCachedReadingBlobUrl(fileId){
  if(typeof caches==="undefined")return null;
  const cache=await caches.open(await readingCacheName());
  const response=await cache.match("/offline-files/drive/"+String(fileId)+".pdf");
  if(!response)return null;
  const blob=await response.blob();
  return URL.createObjectURL(blob);
}
export async function isReadingCached(fileId){
  if(typeof caches==="undefined")return false;
  const cache=await caches.open(await readingCacheName());
  return Boolean(await cache.match("/offline-files/drive/"+String(fileId)+".pdf"));
}
export async function queueLibraryProgress(fileId,{page,progress_percent=0}={}){
  return queueOfflineEvent("library.progress",{
    file_id:String(fileId),
    page:Math.max(1,Math.trunc(Number(page)||1)),
    progress_percent:Math.max(0,Math.min(100,Number(progress_percent)||0))
  },{id:`library-progress:${fileId}`});
}

export async function getOfflineStorageEstimate(){
  if(typeof navigator==="undefined"||!navigator.storage?.estimate)return {usage:null,quota:null,percent:null};
  const {usage=0,quota=0}=await navigator.storage.estimate();
  return {usage,quota,percent:quota?Math.round((usage/quota)*1000)/10:null};
}
