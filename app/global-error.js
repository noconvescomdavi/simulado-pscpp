"use client";
import {useEffect} from "react";

export default function GlobalError({error,reset}){
  useEffect(()=>{
    fetch("/api/observability/client-error",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({route:location.pathname,message:error?.message||"Erro de renderização",digest:error?.digest})}).catch(()=>{});
  },[error]);
  return <html lang="pt-BR"><body style={{fontFamily:"Arial,sans-serif",background:"#071927",color:"#fff",padding:40}}><main style={{maxWidth:680,margin:"auto"}}><h1>Não foi possível carregar esta tela.</h1><p>O erro foi registrado para diagnóstico. Tente novamente.</p><button onClick={()=>reset()} style={{padding:"12px 18px",border:0,borderRadius:8,fontWeight:800}}>Tentar novamente</button></main></body></html>;
}
