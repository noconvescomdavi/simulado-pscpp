"use client";
import {useState} from "react";

export default function AdaptiveClient({trial=false,count=20}){
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  async function start(){
    setBusy(true);setError("");
    const r=await fetch("/api/adaptive-training",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({count:trial?10:Math.max(10,Math.min(40,Number(count)||20))})});
    const j=await r.json().catch(()=>({}));
    setBusy(false);
    if(!r.ok){setError(j.error||"Não foi possível gerar o treino.");return}
    location.href="/conteudos/caderno/"+j.notebook.id;
  }
  return <><button onClick={start} disabled={busy}>{busy?"Montando treino...":"Começar agora"}</button>{error&&<small style={{display:"block",marginTop:8,color:"#ff8d9b"}}>{error}</small>}</>;
}
