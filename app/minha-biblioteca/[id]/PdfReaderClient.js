"use client";
import {useEffect,useRef,useState} from "react";
import styles from "../library.module.css";
import {cacheReadingResponse,getCachedReadingBlobUrl,queueLibraryProgress} from "../../../lib/offline-store";

function loadAdobe(){
  return new Promise((resolve,reject)=>{
    if(window.AdobeDC){resolve();return}
    document.addEventListener("adobe_dc_view_sdk.ready",resolve,{once:true});
    let script=document.querySelector('script[data-estibordo-adobe="1"]');
    if(!script){
      script=document.createElement("script");
      script.src="https://acrobatservices.adobe.com/view-sdk/viewer.js";
      script.async=true;script.dataset.estibordoAdobe="1";
      script.onerror=()=>reject(new Error("Não foi possível carregar o Adobe PDF Reader."));
      document.head.appendChild(script);
    }
    setTimeout(()=>{if(window.AdobeDC)resolve()},1200);
  });
}

export default function PdfReaderClient({file,adobeClientId}){
  const [error,setError]=useState("");
  const [localUrl,setLocalUrl]=useState("");
  const [offlineMode,setOfflineMode]=useState(false);
  const [page,setPage]=useState(Number(file.last_page||1));
  const [savedMessage,setSavedMessage]=useState("");
  const lastSent=useRef(Number(file.last_page||1));

  useEffect(()=>{
    let cancelled=false;
    let blobUrl="";
    async function useLocalReader(message=""){
      blobUrl=await getCachedReadingBlobUrl(file.id);
      if(!blobUrl)throw new Error("Este PDF ainda não foi disponibilizado offline. Abra-o uma vez com internet antes do embarque.");
      if(cancelled){URL.revokeObjectURL(blobUrl);return}
      setLocalUrl(blobUrl);setOfflineMode(true);setError(message);
    }
    async function boot(){
      if(!navigator.onLine){
        try{await useLocalReader()}catch(err){if(!cancelled)setError(err.message)}
        return;
      }
      try{
        const pdfResponse=await fetch("/api/library/google/files/"+file.id+"/content",{cache:"no-store"});
        if(!pdfResponse.ok){const payload=await pdfResponse.json().catch(()=>({}));throw new Error(payload.error||"Não foi possível abrir o PDF.")}
        await cacheReadingResponse(file.id,pdfResponse.clone()).catch(()=>{});
        const buffer=await pdfResponse.arrayBuffer();
        if(cancelled)return;
        if(!adobeClientId){
          await useLocalReader("Leitor Adobe não configurado; usando leitor local.");
          return;
        }
        try{await loadAdobe()}catch{
          await useLocalReader("Leitor Adobe indisponível; usando leitor local.");
          return;
        }
        if(cancelled)return;
        const adobe=new window.AdobeDC.View({clientId:adobeClientId,divId:"estibordo-adobe-reader"});
        const viewer=await adobe.previewFile({content:{promise:Promise.resolve(buffer)},metaData:{fileName:file.name}},{
          embedMode:"FULL_WINDOW",showDownloadPDF:false,showPrintPDF:true,showLeftHandPanel:true,showAnnotationTools:true
        });
        adobe.registerCallback(window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,event=>{
          if(event.type!=="PAGE_VIEW")return;
          const currentPage=Number(event.data?.pageNumber||event.data?.page||0);
          if(!currentPage||currentPage===lastSent.current)return;
          lastSent.current=currentPage;setPage(currentPage);
          fetch("/api/library/google/files/"+file.id+"/progress",{
            method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({page:currentPage})
          }).catch(()=>queueLibraryProgress(file.id,{page:currentPage,progress_percent:file.progress_percent}).catch(()=>{}));
        },{enablePDFAnalytics:true});
        if(viewer?.getAPIs){
          const apis=await viewer.getAPIs().catch(()=>null);
          if(apis&&Number(file.last_page)>1)apis.gotoLocation(Number(file.last_page)).catch(()=>{});
        }
      }catch(err){
        try{await useLocalReader(err.message||"Sem conexão com o Google Drive; usando cópia local.")}catch(localError){
          if(!cancelled)setError(localError.message||err.message||"Não foi possível iniciar o leitor.");
        }
      }
    }
    boot();
    return()=>{cancelled=true;if(blobUrl)URL.revokeObjectURL(blobUrl)};
  },[file.id,file.name,file.last_page,file.progress_percent,adobeClientId]);

  async function saveOfflinePage(){
    const current=Math.max(1,Math.trunc(Number(page)||1));
    setPage(current);
    try{
      if(navigator.onLine){
        const response=await fetch("/api/library/google/files/"+file.id+"/progress",{
          method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({page:current,progress_percent:file.progress_percent||0})
        });
        if(!response.ok)throw new Error();
        setSavedMessage("✓ Progresso salvo");
      }else{
        await queueLibraryProgress(file.id,{page:current,progress_percent:file.progress_percent||0});
        setSavedMessage("✓ Progresso salvo no aparelho · sincronização pendente");
      }
    }catch{
      await queueLibraryProgress(file.id,{page:current,progress_percent:file.progress_percent||0});
      setSavedMessage("✓ Progresso salvo no aparelho · sincronização pendente");
    }
  }

  if(localUrl){
    return <div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",padding:"10px 0"}}>
        <strong>{offlineMode?"Leitor local · disponível offline":"Leitor local"}</strong>
        <label>Página atual <input type="number" min="1" value={page} onChange={e=>setPage(e.target.value)} style={{width:90}}/></label>
        <button type="button" onClick={saveOfflinePage}>Salvar progresso</button>
        {savedMessage&&<small>{savedMessage}</small>}
      </div>
      {error&&<p>{error}</p>}
      <iframe title={file.name} src={localUrl+"#page="+Math.max(1,Number(page)||1)} style={{width:"100%",height:"78vh",border:0,borderRadius:12}}/>
    </div>;
  }
  if(error)return <div className={styles.readerError}><strong>Leitor indisponível</strong><p>{error}</p></div>;
  return <div id="estibordo-adobe-reader" className={styles.reader}><div className={styles.loading}>Carregando PDF do Google Drive e preparando cópia offline...</div></div>;
}
