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
  const [progress,setProgress]=useState(0);

  function choose(event){
    setSelected(Array.from(event.target.files||[]));
    setMessage("");
  }

  async function upload(event){
    event.preventDefault(); if(busy||!selected.length)return;
    setBusy(true);setProgress(0);setMessage("Preparando upload seguro em partes...");
    try{
      let completedFiles=0;
      for(const file of selected){
        const init=await fetch("/api/admin/contramestre/bibliography/multipart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"init",filename:file.name,bytes:file.size})});
        const initData=await init.json(); if(!init.ok)throw new Error(initData.error||"Falha ao iniciar upload.");
        const partIds=[],partSize=Number(initData.part_size||4*1024*1024);
        const totalParts=Math.ceil(file.size/partSize);
        for(let i=0;i<totalParts;i++){
          const chunk=file.slice(i*partSize,Math.min(file.size,(i+1)*partSize));
          const part=await fetch("/api/admin/contramestre/bibliography/multipart",{method:"PUT",headers:{"x-upload-id":initData.upload_id,"Content-Type":"application/octet-stream"},body:chunk});
          const partData=await part.json(); if(!part.ok)throw new Error(partData.error||`Falha na parte ${i+1}.`);
          partIds.push(partData.part_id);
          setProgress(Math.round(((completedFiles+(i+1)/totalParts)/selected.length)*100));
          setMessage(`Enviando ${file.name}: parte ${i+1} de ${totalParts}...`);
        }
        const done=await fetch("/api/admin/contramestre/bibliography/multipart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"complete",upload_id:initData.upload_id,part_ids:partIds,filename:file.name,bytes:file.size})});
        const doneData=await done.json(); if(!done.ok)throw new Error(doneData.error||"Falha ao concluir upload.");
        setStore(doneData.vector_store_id||store);completedFiles++;
      }
      setProgress(100);setMessage("Bibliografia enviada. A OpenAI está indexando os PDFs.");
      event.currentTarget.elements.files.value="";setSelected([]);
      const refreshed=await fetch("/api/admin/contramestre/bibliography",{cache:"no-store"});
      const data2=await refreshed.json().catch(()=>({}));if(refreshed.ok)setFiles(data2.files||[]);
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

    {busy&&<div className={styles.progress}><span style={{width:progress+"%"}}/></div>}
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
