"use client";
import {useEffect,useRef,useState} from "react";
import styles from "./library.module.css";

function sizeLabel(value){const n=Number(value||0);if(!n)return "Tamanho não informado";if(n<1048576)return Math.round(n/1024)+" KB";return (n/1048576).toFixed(n<10485760?1:0)+" MB"}

export default function LibraryClient({initialMessage=""}){
 const [files,setFiles]=useState([]),[configured,setConfigured]=useState(true),[busy,setBusy]=useState(false),[message,setMessage]=useState(initialMessage),input=useRef(null);
 async function load(){const r=await fetch("/api/library/files",{cache:"no-store"}),d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Não foi possível carregar a biblioteca.");setFiles(d.files||[]);setConfigured(d.configured!==false)}
 useEffect(()=>{load().catch(e=>setMessage(e.message))},[]);
 async function upload(e){const file=e.target.files?.[0];e.target.value="";if(!file)return;if(file.type!=="application/pdf"){setMessage("Selecione um arquivo PDF.");return}if(file.size>95*1024*1024){setMessage("O PDF deve ter no máximo 95 MB.");return}setBusy(true);setMessage("Enviando PDF para sua biblioteca privada...");try{const fd=new FormData();fd.append("file",file);const r=await fetch("/api/library/files",{method:"POST",body:fd}),d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Falha no upload.");setMessage("PDF adicionado à sua biblioteca.");await load()}catch(err){setMessage(err.message)}finally{setBusy(false)}}
 return <section className={styles.workspace}>
  <div className={styles.toolbar}><div><strong>Sua biblioteca privada</strong><span>Envie PDFs do computador. Cada arquivo fica isolado pela sua conta ESTIBORDO.</span></div><div className={styles.actions}>
   <input ref={input} type="file" accept="application/pdf,.pdf" hidden onChange={upload}/>
   <button className={styles.primary} disabled={busy||!configured} onClick={()=>input.current?.click()}>{busy?"Enviando...":"Adicionar PDF do computador"}</button>
  </div></div>
  {!configured&&<div className={styles.notice}>Armazenamento privado aguardando configuração no servidor.</div>}
  {message&&<div className={styles.notice}>{message}</div>}
  {!files.length?<div className={styles.empty}><b>▦</b><h2>Sua biblioteca está vazia</h2><p>Adicione um PDF do seu computador, celular ou tablet. O documento fica vinculado somente à sua conta.</p></div>
   :<div className={styles.grid}>{files.map(file=><a className={styles.card} href={"/minha-biblioteca/"+file.id} key={file.id}><div className={styles.pdfIcon}>PDF</div><div className={styles.fileText}><strong>{file.name}</strong><span>{sizeLabel(file.size_bytes)}</span><small>Continuar da página {file.last_page||1}</small></div><div className={styles.progress}><i style={{width:Math.max(0,Math.min(100,Number(file.progress_percent||0)))+"%"}}/></div></a>)}</div>}
 </section>
}