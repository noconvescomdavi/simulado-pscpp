"use client";
import {useEffect,useState} from "react";
import styles from "./library.module.css";

function sizeLabel(value){
  const n=Number(value||0);
  if(!n)return "Tamanho não informado";
  if(n<1024*1024)return Math.round(n/1024)+" KB";
  return (n/1024/1024).toFixed(n<10*1024*1024?1:0)+" MB";
}

function loadPickerScript(){
  return new Promise((resolve,reject)=>{
    if(window.gapi){resolve();return}
    const existing=document.querySelector('script[data-estibordo-google-picker="1"]');
    if(existing){existing.addEventListener("load",resolve,{once:true});existing.addEventListener("error",reject,{once:true});return}
    const script=document.createElement("script");
    script.src="https://apis.google.com/js/api.js";
    script.async=true;script.defer=true;script.dataset.estibordoGooglePicker="1";
    script.onload=resolve;
    script.onerror=()=>reject(new Error("Não foi possível carregar o Google Picker."));
    document.head.appendChild(script);
  });
}

export default function DriveLibraryClient({initialMessage=""}){
  const [status,setStatus]=useState({configured:true,connected:false});
  const [files,setFiles]=useState([]);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState(initialMessage);

  async function load(){
    const [s,f]=await Promise.all([
      fetch("/api/library/google/status",{cache:"no-store"}).then(r=>r.json()),
      fetch("/api/library/google/files",{cache:"no-store"}).then(async r=>r.ok?r.json():({files:[]}))
    ]);
    setStatus(s);setFiles(f.files||[]);
  }
  useEffect(()=>{load().catch(()=>setMessage("Não foi possível carregar a biblioteca."))},[]);

  async function openPicker(){
    setBusy(true);setMessage("");
    try{
      const response=await fetch("/api/library/google/picker",{cache:"no-store"});
      const config=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(config.error||"Não foi possível iniciar o Google Drive.");
      await loadPickerScript();
      await new Promise((resolve,reject)=>window.gapi.load("picker",{callback:resolve,onerror:()=>reject(new Error("Google Picker indisponível."))}));
      const view=new window.google.picker.DocsView(window.google.picker.ViewId.PDFS);
      view.setMimeTypes("application/pdf");
      const picker=new window.google.picker.PickerBuilder()
        .setOAuthToken(config.accessToken)
        .setDeveloperKey(config.apiKey)
        .setAppId(config.appId)
        .addView(view)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setCallback(async data=>{
          if(data.action!==window.google.picker.Action.PICKED)return;
          const ids=(data.docs||[]).map(doc=>doc.id).filter(Boolean);
          if(!ids.length)return;
          setBusy(true);
          try{
            const imported=await fetch("/api/library/google/files",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({file_ids:ids})});
            const payload=await imported.json().catch(()=>({}));
            if(!imported.ok)throw new Error(payload.error||payload.errors?.[0]?.error||"Falha ao adicionar PDFs.");
            setMessage(ids.length===1?"PDF adicionado à biblioteca.":ids.length+" PDFs adicionados à biblioteca.");
            await load();
          }catch(error){setMessage(error.message)}
          finally{setBusy(false)}
        }).build();
      picker.setVisible(true);
    }catch(error){setMessage(error.message||"Não foi possível abrir o Google Drive.")}
    finally{setBusy(false)}
  }

  async function disconnect(){
    if(!confirm("Desconectar o Google Drive? Os PDFs continuarão no seu Drive."))return;
    setBusy(true);
    try{
      await fetch("/api/library/google/disconnect",{method:"POST"});
      setStatus(s=>({...s,connected:false}));setMessage("Google Drive desconectado.");
    }finally{setBusy(false)}
  }

  return <section className={styles.workspace}>
    <div className={styles.toolbar}>
      <div><strong>{status.connected?"Google Drive conectado":"Conecte seu Google Drive"}</strong><span>{status.connected?"Os PDFs continuam armazenados na sua conta Google.":"A ESTIBORDO não precisa hospedar seus PDFs."}</span></div>
      <div className={styles.actions}>
        {!status.configured?<button disabled>Integração aguardando configuração</button>:!status.connected
          ?<a className={styles.primary} href="/api/library/google/connect">Conectar Google Drive</a>
          :<><button className={styles.primary} disabled={busy} onClick={openPicker}>{busy?"Aguarde...":"Adicionar PDFs do Drive"}</button><button disabled={busy} onClick={disconnect}>Desconectar</button></>}
      </div>
    </div>
    {message&&<div className={styles.notice}>{message}</div>}
    {!files.length?<div className={styles.empty}><b>▦</b><h2>Sua biblioteca está vazia</h2><p>Conecte o Google Drive e escolha os PDFs que deseja estudar. Eles não serão copiados para os servidores da ESTIBORDO.</p></div>
      :<div className={styles.grid}>{files.map(file=><a className={styles.card} href={"/minha-biblioteca/"+file.id} key={file.id}>
        <div className={styles.pdfIcon}>PDF</div><div className={styles.fileText}><strong>{file.name}</strong><span>{sizeLabel(file.size_bytes)}</span><small>Continuar da página {file.last_page||1}</small></div><div className={styles.progress}><i style={{width:Math.max(0,Math.min(100,Number(file.progress_percent||0)))+"%"}}/></div>
      </a>)}</div>}
  </section>;
}
