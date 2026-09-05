"use client";
import {useState} from "react";import styles from "./tutor.module.css";
export default function TutorChat({conversations,initialConversation,remaining}){
 const [cid,setCid]=useState(initialConversation?.id||null),[messages,setMessages]=useState(initialConversation?.messages||[]),[text,setText]=useState(""),[left,setLeft]=useState(remaining),[busy,setBusy]=useState(false),[error,setError]=useState("");
 async function send(e){e.preventDefault();if(!text.trim()||busy)return;const q=text.trim();setText("");setMessages(m=>[...m,{role:"user",content:q}]);setBusy(true);setError("");
  try{const r=await fetch("/api/tutor/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({conversation_id:cid,message:q})});const p=await r.json();if(!r.ok)throw new Error(p.error||"Falha no CONTRAMESTRE.");setCid(p.conversation_id);setMessages(m=>[...m,{role:"assistant",content:p.answer,sources:p.sources||[]}]);setLeft(p.remaining)}
  catch(err){setError(err.message)}finally{setBusy(false)}
 }
 return <div className={styles.chatShell}><aside className={styles.history}><a href="/contramestre">＋ Nova conversa</a>{conversations.map(c=><a className={c.id===cid?styles.current:""} href={`/contramestre?c=${c.id}`} key={c.id}><b>{c.title}</b><span>{c.last_message||"Conversa"}</span></a>)}</aside>
 <section className={styles.chat}><div className={styles.chatTop}><div><b>CONTRAMESTRE</b><span>PSCPP • Marítimo</span></div><small>{left} perguntas restantes hoje</small></div>
 <div className={styles.messages}>{!messages.length&&<div className={styles.welcome}><strong>Como posso ajudar nos seus estudos?</strong><p>Experimente: “Explique squat”, “Me teste sobre RIPEAM” ou “Qual a diferença entre amarração e fundeio?”</p></div>}
 {messages.map((m,i)=><article className={m.role==="user"?styles.user:styles.assistant} key={i}><small>{m.role==="user"?"Você":"⚓ CONTRAMESTRE"}</small><p>{m.content}</p>{m.role==="assistant"&&Array.isArray(m.sources)&&m.sources.length>0&&<div className={styles.sources}><b>Fontes consultadas</b>{m.sources.map((s,j)=><span key={(s.file_id||s.filename||"fonte")+j}>• {s.filename||"Bibliografia PSCPP"}</span>)}</div>}</article>)}{busy&&<article className={styles.assistant}><small>⚓ CONTRAMESTRE</small><p>Elaborando resposta...</p></article>}</div>
 {error&&<div className={styles.error}>{error}</div>}<form className={styles.composer} onSubmit={send}><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Pergunte sobre o PSCPP ou universo marítimo..." maxLength={6000}/><button disabled={busy||!text.trim()}>Enviar ↑</button></form>
 <small className={styles.disclaimer}>CONTRAMESTRE é um tutor acadêmico. Em caso de divergência, prevalecem as publicações oficiais e a bibliografia vigente do PSCPP.</small></section></div>
}
