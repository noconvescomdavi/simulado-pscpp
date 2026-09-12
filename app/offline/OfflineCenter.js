"use client";

import { useEffect, useState } from "react";
import {
  answerOfflineExam, answerOfflineNotebook, createOfflineExam, createOfflineNotebook,
  ensureOfflinePackCurrent, finishOfflineExam, getOfflineNotebook, getOfflineQuestion,
  getOfflineStatus, hydrateOfflineExam, getOfflineExam, listOfflineExams,
  listOfflineNotebooks, onOfflineChange, syncOfflineQueue
} from "../../lib/offline-store";

const SUBJECTS=[
  ["manobrabilidade","Manobrabilidade"],
  ["arte-naval","Arte Naval"],
  ["navegacao-aguas-restritas","Navegação / Águas Restritas"],
  ["situacoes-de-manobra-ripeam","Situações de Manobra / RIPEAM"],
  ["legislacao-regulamentacao","Legislação e Regulamentação"],
  ["meteorologia-oceanografia","Meteorologia e Oceanografia"],
  ["comunicacoes","Comunicações"],
  ["conhecimentos-gerais","Conhecimentos Gerais"],
];

function options(value){
  if(Array.isArray(value))return value.map((x,i)=>typeof x==="string"?{key:String.fromCharCode(65+i),text:x}:{key:String(x?.key??x?.letter??String.fromCharCode(65+i)),text:String(x?.text??x?.value??x?.label??"")}).filter(x=>x.text);
  if(value&&typeof value==="object")return Object.entries(value).map(([key,x])=>({key:String(x?.key??key),text:String(x?.text??x?.value??x?.label??x??"")})).filter(x=>x.text);
  return [];
}
function calc(total,answers){
  const rows=Object.values(answers||{});const correct=rows.filter(x=>x.is_correct).length;
  const percent=total?Math.round(correct/total*10000)/100:0;
  return {total_questions:total,answered_count:rows.length,correct_count:correct,error_count:rows.length-correct,score_percent:percent,grade_10:Math.round(percent*10)/100};
}

export default function OfflineCenter(){
  const [status,setStatus]=useState(null);
  const [online,setOnline]=useState(true);
  const [busy,setBusy]=useState("");
  const [message,setMessage]=useState("");
  const [subject,setSubject]=useState(SUBJECTS[0][0]);
  const [count,setCount]=useState(20);
  const [mode,setMode]=useState("");
  const [item,setItem]=useState(null);
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState(null);
  const [notebooks,setNotebooks]=useState([]);
  const [exams,setExams]=useState([]);

  async function refresh(){
    try{
      const [next,n,e]=await Promise.all([getOfflineStatus(),listOfflineNotebooks(),listOfflineExams()]);
      setStatus(next);setNotebooks(n);setExams(e);
    }catch{}
    setOnline(typeof navigator==="undefined"?true:navigator.onLine);
  }

  useEffect(()=>{
    refresh();
    navigator.serviceWorker?.ready.then(reg=>reg.active?.postMessage({type:"CACHE_OFFLINE_PAGE",path:"/offline"})).catch(()=>{});
    const p=new URLSearchParams(location.search);const m=p.get("mode"),id=p.get("id");
    if(m&&id)openExisting(m,id);
    const onOnline=()=>{setOnline(true);sync().catch(()=>{})};
    const onOffline=()=>setOnline(false);
    const off=onOfflineChange(refresh);
    window.addEventListener("online",onOnline);
    window.addEventListener("offline",onOffline);
    return()=>{off();window.removeEventListener("online",onOnline);window.removeEventListener("offline",onOffline)};
  },[]);

  async function install(){
    setBusy("download");setMessage("");
    try{
      const result=await ensureOfflinePackCurrent({force:true});
      const next=result.status;
      setStatus(next);
      await refresh();
      setMessage("✓ "+next.questions.toLocaleString("pt-BR")+" questões disponíveis offline.");
    }catch(e){setMessage(e.message||"Falha ao atualizar o banco offline.")}
    finally{setBusy("")}
  }

  async function sync(){
    if(typeof navigator!=="undefined"&&!navigator.onLine)return;
    setBusy("sync");setMessage("");
    try{
      const r=await syncOfflineQueue();
      await refresh();
      setMessage(r.offline?"Sem conexão. Suas alterações continuam protegidas no aparelho.":"✓ "+(r.synced||0)+" alteração(ões) sincronizada(s)."+(r.failed?" "+r.failed+" pendência(s) precisam de nova tentativa.":""));
    }catch(e){setMessage(e.message||"Não foi possível sincronizar agora.")}
    finally{setBusy("")}
  }

  async function openExisting(m,id){
    try{
      if(m==="notebook"){
        const n=await getOfflineNotebook(id);if(!n)throw new Error("Caderno não encontrado neste dispositivo.");
        const questions=[];for(const ref of n.question_refs||[]){const q=await getOfflineQuestion(ref.subject,ref.id);if(q)questions.push(q)}
        setMode("notebook");setItem({...n,questions});setIndex(0);setAnswer(n.answers?.[questions[0]?.subject+":"+questions[0]?.id]||null);
      }else{
        const raw=await getOfflineExam(id);const e=await hydrateOfflineExam(raw);if(!e)throw new Error("Simulado não encontrado neste dispositivo.");
        setMode("exam");setItem(e);setIndex(Math.min(Object.keys(e.answers||{}).length,Math.max(0,e.questions.length-1)));setAnswer(null);
      }
    }catch(e){setMessage(e.message)}
  }

  async function makeNotebook(){
    setBusy("notebook");setMessage("");
    try{
      const n=await createOfflineNotebook({subjects:[subject],count});
      history.replaceState(null,"","/offline?mode=notebook&id="+n.id);
      await openExisting("notebook",n.id);await refresh();
    }catch(e){setMessage(e.message)}
    finally{setBusy("")}
  }

  async function makeExam(){
    setBusy("exam");setMessage("");
    try{
      const e=await createOfflineExam({subject,count:Math.min(100,Math.max(10,count)),title:"Simulado offline · "+(SUBJECTS.find(x=>x[0]===subject)?.[1]||subject)});
      history.replaceState(null,"","/offline?mode=exam&id="+e.id);
      await openExisting("exam",e.id);await refresh();
    }catch(e){setMessage(e.message)}
    finally{setBusy("")}
  }

  async function choose(letter){
    const q=item?.questions?.[index];if(!q||answer)return;
    setBusy("answer");
    try{
      const saved=mode==="notebook"
        ?await answerOfflineNotebook(item.id,{subject:q.subject,question_id:q.id,selected_answer:letter})
        :await answerOfflineExam(item.id,{question_id:q.id,selected_answer:letter});
      setAnswer(saved);
      setItem(current=>({...current,answers:{...(current.answers||{}),[mode==="notebook"?q.subject+":"+q.id:String(q.id)]:saved}}));
      await refresh();
    }catch(e){setMessage(e.message)}
    finally{setBusy("")}
  }

  function next(){
    const nextIndex=Math.min(index+1,(item?.questions?.length||1)-1);setIndex(nextIndex);
    const q=item?.questions?.[nextIndex];
    setAnswer(mode==="notebook"?item?.answers?.[q?.subject+":"+q?.id]||null:item?.answers?.[String(q?.id)]||null);
  }

  async function finish(){
    if(mode!=="exam")return;setBusy("finish");
    try{
      await finishOfflineExam(item.id,"manual");
      const result=calc(item.questions.length,item.answers);
      setItem(x=>({...x,status:"completed",result}));
      setMessage("Simulado finalizado no dispositivo. O resultado será enviado ao servidor quando houver conexão.");
      await refresh();
    }finally{setBusy("")}
  }

  if(mode&&item){
    const result=item.result||(item.status!=="in_progress"?calc(item.questions.length,item.answers):null);
    if(result)return <main style={{maxWidth:900,margin:"0 auto",padding:"28px 18px"}}>
      <button onClick={()=>{setMode("");setItem(null);history.replaceState(null,"","/offline")}}>← Central Offline</button>
      <h1>{item.title||"Estudo offline"}</h1>
      <h2>{Number(result.grade_10||0).toFixed(2)}/10 · {Number(result.score_percent||0).toFixed(2)}%</h2>
      <p>{result.correct_count} acertos · {result.error_count} erros · {result.answered_count} respondidas</p>
      <p><strong>Salvo no aparelho.</strong> {online?"A sincronização automática será executada.":"Será sincronizado quando a internet voltar."}</p>
    </main>;

    const q=item.questions[index];
    const saved=answer||(mode==="notebook"?item.answers?.[q?.subject+":"+q?.id]:item.answers?.[String(q?.id)]);
    return <main style={{maxWidth:900,margin:"0 auto",padding:"28px 18px"}}>
      <button onClick={()=>{setMode("");setItem(null);history.replaceState(null,"","/offline")}}>← Central Offline</button>
      <p style={{fontWeight:800}}>MODO OFFLINE · {index+1}/{item.questions.length}</p>
      <h1>{item.title}</h1>
      <article style={{padding:"24px",border:"1px solid #294351",borderRadius:18}}>
        <small>{[q?.tracking?.work?.title,q?.tracking?.chapter?.label,q?.tracking?.module].filter(Boolean).join(" · ")}</small>
        <h2>{q?.question}</h2>
        {options(q?.options).map(o=><button key={o.key} disabled={Boolean(saved)||busy==="answer"} onClick={()=>choose(o.key)} style={{display:"block",width:"100%",textAlign:"left",padding:"13px",margin:"8px 0"}}><b>{o.key}</b> {o.text}</button>)}
        {saved&&<div><p><strong>{saved.is_correct?"Correto.":"Resposta incorreta."}</strong></p>{!saved.is_correct&&saved.correct_answer&&<p>Resposta correta: <b>{saved.correct_answer}</b></p>}{saved.explanation&&<p>{saved.explanation}</p>}</div>}
      </article>
      <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap"}}>
        <button disabled={index===0} onClick={()=>{const i=Math.max(0,index-1);setIndex(i);setAnswer(null)}}>← Anterior</button>
        <button disabled={index>=item.questions.length-1} onClick={next}>Próxima →</button>
        {mode==="exam"&&<button onClick={finish} disabled={busy==="finish"}>Finalizar simulado</button>}
      </div>
    </main>;
  }

  return <main style={{maxWidth:1050,margin:"0 auto",padding:"30px 18px 80px",color:"#e8f1f7"}}>
    <p style={{fontWeight:900,letterSpacing:1}}>ESTIBORDO OFFLINE</p>
    <h1>Central Offline</h1>
    <p>O ESTIBORDO mantém automaticamente todo o banco de questões disponível neste aparelho enquanto houver conexão. Depois disso, você pode criar quantos cadernos e simulados quiser mesmo ficando dias sem internet; respostas e resultados serão sincronizados quando a conexão voltar.</p>
    {message&&<p role="status" style={{padding:12,border:"1px solid #345",borderRadius:12}}>{message}</p>}

    <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,margin:"24px 0"}}>
      <article><small>Status</small><h3>{online?"Online":"Offline"}</h3></article>
      <article><small>Questões locais</small><h3>{status?.questions?.toLocaleString("pt-BR")||0}</h3></article>
      <article><small>Aguardando sync</small><h3>{status?.pending||0}</h3></article>
      <article><small>Última atualização offline</small><h3>{status?.downloaded_at?new Date(status.downloaded_at).toLocaleDateString("pt-BR"):"—"}</h3></article>
    </section>

    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:30}}>
      <button onClick={install} disabled={busy==="download"||!online}>{busy==="download"?"Atualizando banco…":"Atualizar banco offline agora"}</button>
      <button onClick={sync} disabled={busy==="sync"||!online}>{busy==="sync"?"Sincronizando…":"Sincronizar agora"}</button>
    </div>

    <section style={{padding:"22px",border:"1px solid #294351",borderRadius:18}}>
      <h2>Criar estudo offline</h2>
      <label>Matéria <select value={subject} onChange={e=>setSubject(e.target.value)}>{SUBJECTS.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
      <label style={{marginLeft:12}}>Questões <input type="number" min="1" max="100" value={count} onChange={e=>setCount(Math.max(1,Math.min(100,Number(e.target.value)||1)))} /></label>
      <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
        <button onClick={makeNotebook} disabled={!status?.installed||busy==="notebook"}>Novo caderno offline</button>
        <button onClick={makeExam} disabled={!status?.installed||busy==="exam"}>Novo simulado offline</button>
      </div>
      {!status?.installed&&<p><strong>Preparação automática em andamento.</strong> Mantenha a plataforma aberta e conectada até o banco aparecer como disponível; depois estes botões ficarão liberados também sem internet.</p>}
    </section>

    <section style={{marginTop:28}}>
      <h2>Salvos neste aparelho</h2>
      {!notebooks.length&&!exams.length&&<p>Nenhum caderno ou simulado local ainda.</p>}
      <div style={{display:"grid",gap:12}}>
        {notebooks.map(n=>{
          const answered=Object.keys(n.answers||{}).length;
          return <article key={n.id} style={{padding:16,border:"1px solid #294351",borderRadius:14}}>
            <small>CADERNO · {answered}/{n.total_questions||0} respondidas</small>
            <h3>{n.title}</h3>
            <button onClick={()=>{history.replaceState(null,"","/offline?mode=notebook&id="+n.id);openExisting("notebook",n.id)}}>{answered>=Number(n.total_questions||0)?"Revisar":"Continuar"}</button>
          </article>;
        })}
        {exams.map(e=>{
          const answered=Object.keys(e.answers||{}).length;
          return <article key={e.id} style={{padding:16,border:"1px solid #294351",borderRadius:14}}>
            <small>SIMULADO · {answered}/{(e.question_ids||[]).length} respondidas · {e.status==="in_progress"?"Em andamento":"Finalizado"}</small>
            <h3>{e.title}</h3>
            <button onClick={()=>{history.replaceState(null,"","/offline?mode=exam&id="+e.id);openExisting("exam",e.id)}}>{e.status==="in_progress"?"Continuar":"Ver resultado"}</button>
          </article>;
        })}
      </div>
    </section>
  </main>;
}
