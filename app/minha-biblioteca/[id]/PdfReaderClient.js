"use client";
import {useEffect,useRef,useState} from "react";
import styles from "../library.module.css";

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
  const lastSent=useRef(Number(file.last_page||1));
  useEffect(()=>{
    let cancelled=false;
    async function boot(){
      if(!adobeClientId){setError("Adobe PDF Embed API ainda não está configurada para este domínio.");return}
      try{
        const [pdfResponse]=await Promise.all([fetch("/api/library/google/files/"+file.id+"/content",{cache:"no-store"}),loadAdobe()]);
        if(!pdfResponse.ok){const payload=await pdfResponse.json().catch(()=>({}));throw new Error(payload.error||"Não foi possível abrir o PDF.")}
        const buffer=await pdfResponse.arrayBuffer();
        if(cancelled)return;
        const adobe=new window.AdobeDC.View({clientId:adobeClientId,divId:"estibordo-adobe-reader"});
        const viewer=await adobe.previewFile({content:{promise:Promise.resolve(buffer)},metaData:{fileName:file.name}},{
          embedMode:"FULL_WINDOW",showDownloadPDF:false,showPrintPDF:true,showLeftHandPanel:true,showAnnotationTools:true
        });
        adobe.registerCallback(window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,event=>{
          if(event.type!=="PAGE_VIEW")return;
          const page=Number(event.data?.pageNumber||event.data?.page||0);
          if(!page||page===lastSent.current)return;
          lastSent.current=page;
          fetch("/api/library/google/files/"+file.id+"/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({page})}).catch(()=>{});
        },{enablePDFAnalytics:true});
        if(viewer?.getAPIs){
          const apis=await viewer.getAPIs().catch(()=>null);
          if(apis&&Number(file.last_page)>1)apis.gotoLocation(Number(file.last_page)).catch(()=>{});
        }
      }catch(err){if(!cancelled)setError(err.message||"Não foi possível iniciar o leitor.")}
    }
    boot();return()=>{cancelled=true};
  },[file.id,file.name,file.last_page,adobeClientId]);
  if(error)return <div className={styles.readerError}><strong>Leitor indisponível</strong><p>{error}</p></div>;
  return <div id="estibordo-adobe-reader" className={styles.reader}><div className={styles.loading}>Carregando PDF do Google Drive...</div></div>;
}
