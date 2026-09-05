"use client";
import {useState} from "react";
import styles from "./contramestre.module.css";

function size(bytes){
  const n=Number(bytes||0);if(!n)return "—";
  if(n<1024*1024)return `${Math.round(n/1024)} KB`;
  return `${(n/1024/1024).toFixed(1)} MB`;
}

export default function ContramestreLibrary({initialFiles,vectorStoreId,keyReady}){
  const [files,setFiles]=useState(initialFiles||[]);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [store,setStore]=useState(vectorStoreId||"");
  const [selected,setSelected]=useState([]);

  function choose(event){
    setSelected(Array.from(event.target.files||[]));
    setMessage("");
  }

  async function upload(event){
    event.preventDefault();
    if(busy)return;
    const input=event.currentTarget.elements.files;
    if(!input?.files?.length){setMessage("Selecione ao menos um PDF.");return;}
    setBusy(true);setMessage("Enviando e indexando bibliografia...");
    try{
      const data=new FormData();
      for(const file of input.files)data.append("files",file);
      const response=await fetch("/api/admin/contramestre/bibliography",{method:"POST",body:data});
      const payload=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(payload.error||"Falha no upload.");
      setStore(payload.vector_store_id||store);
      const failures=(payload.uploaded||[]).filter(x=>x.error);
      setMessage(failures.length?`${payload.uploaded.length-failures.length} arquivo(s) enviado(s); ${failures.length} falharam.`:"Bibliografia enviada. A indexação pode levar alguns instantes.");
      input.value="";setSelected([]);
      const refreshed=await fetch("/api/admin/contramestre/bibliography",{cache:"no-store"});
      const data2=await refreshed.json().catch(()=>({}));
      if(refreshed.ok)setFiles(data2.files||[]);
    }catch(error){setMessage(error.message)}finally{setBusy(false)}
  }

  return <section className={styles.library}>
    <div className={styles.libraryHead}>
      <div><span>BIBLIOGRAFIA RAG</span><h2>Acervo do CONTRAMESTRE</h2><p>Envie apenas publicações autorizadas e vigentes do PSCPP. Elas serão pesquisadas antes das respostas.</p></div>
      <div className={styles.store}><small>Vector Store</small><code>{store||"Será criado no primeiro upload"}</code></div>
    </div>

    {!keyReady&&<div className={styles.warning}>Configure <code>OPENAI_API_KEY</code> na Vercel para habilitar uploads e respostas do CONTRAMESTRE.</div>}

    <form className={styles.uploader} onSubmit={upload}>
      <label className={styles.filePicker}>
        <input name="files" type="file" accept="application/pdf,.pdf" multiple disabled={!keyReady||busy} onChange={choose}/>
        <span>{selected.length?selected.length+" PDF(s) selecionado(s)":"Selecionar PDFs do computador"}</span>
      </label>
      {selected.length>0&&<div className={styles.selected}>{selected.map(file=><small key={file.name}>{file.name} · {size(file.size)}</small>)}</div>}
      <button type="submit" disabled={!keyReady||busy||!selected.length}>{busy?"Enviando e indexando...":"Adicionar PDFs selecionados à bibliografia"}</button>
      <small>Até 10 PDFs por envio. Cada PDF pode ter até 512 MB (limite atual da OpenAI Files API).</small>
    </form>

    {message&&<p className={styles.message}>{message}</p>}

    <div className={styles.fileList}>
      <div className={styles.fileHeader}><span>ARQUIVO</span><span>TAMANHO</span><span>STATUS</span><span>ADICIONADO</span></div>
      {files.map(file=><article key={file.id}>
        <strong>{file.filename}</strong><span>{size(file.bytes)}</span><span>{file.status}</span><span>{new Date(file.created_at).toLocaleDateString("pt-BR")}</span>
      </article>)}
      {!files.length&&<div className={styles.empty}>Nenhum PDF foi adicionado ao acervo ainda.</div>}
    </div>
  </section>;
}
