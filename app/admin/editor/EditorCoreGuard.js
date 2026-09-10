"use client";

import {useEffect,useRef,useState} from "react";

const KEY="estibordo-editor-session-v2";

export default function EditorCoreGuard(){
  const [metrics,setMetrics]=useState({fps:60,nodes:0,canvases:0,memory:"—"});
  const [errors,setErrors]=useState([]);const frames=useRef(0),last=useRef(0),raf=useRef(0);

  useEffect(()=>{
    const restore=()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||"null");if(!s)return;const frame=document.querySelector('iframe[title="Prévia da página"]');if(frame&&s.frameScroll){setTimeout(()=>{try{frame.contentWindow.scrollTo(s.frameScroll.x||0,s.frameScroll.y||0)}catch{}},900)}}catch{}};restore();
    const saveSession=()=>{try{const frame=document.querySelector('iframe[title="Prévia da página"]'),route=frame?.contentWindow?.location?.pathname||frame?.getAttribute("src")||"";localStorage.setItem(KEY,JSON.stringify({ts:Date.now(),route,frameScroll:{x:frame?.contentWindow?.scrollX||0,y:frame?.contentWindow?.scrollY||0},editorScroll:{x:window.scrollX,y:window.scrollY}}))}catch{}};
    const timer=setInterval(saveSession,1500);
    const onError=e=>setErrors(prev=>[...prev.slice(-4),{time:new Date().toLocaleTimeString("pt-BR"),message:String(e?.message||e?.reason||"Erro inesperado")}]);
    window.addEventListener("error",onError);window.addEventListener("unhandledrejection",onError);

    const gate=e=>{
      const b=e.target?.closest?.("button");if(!b||!/salvar\s*(e|&)\s*publicar|salvar e publicar/i.test(b.textContent||""))return;
      const frame=document.querySelector('iframe[title="Prévia da página"]'),doc=frame?.contentDocument;const critical=[];
      if(!frame||!doc?.body)critical.push("A prévia da página não está carregada.");
      if(doc&&doc.querySelectorAll("[data-editor-id]").length===0)critical.push("O Object Registry ainda não indexou a página.");
      if(critical.length){e.preventDefault();e.stopImmediatePropagation();alert("Publicação bloqueada pelo Editor Core:\n\n"+critical.join("\n")+"\n\nRecarregue a página ou execute Health Check antes de publicar.")}
    };
    document.addEventListener("click",gate,true);

    const loop=t=>{frames.current++;if(t-last.current>=1000){const frame=document.querySelector('iframe[title="Prévia da página"]'),doc=frame?.contentDocument;const mem=performance?.memory?.usedJSHeapSize?Math.round(performance.memory.usedJSHeapSize/1048576)+" MB":"—";setMetrics({fps:frames.current,nodes:doc?.querySelectorAll("*").length||0,canvases:doc?.querySelectorAll("canvas").length||0,memory:mem});frames.current=0;last.current=t}raf.current=requestAnimationFrame(loop)};raf.current=requestAnimationFrame(loop);
    return()=>{clearInterval(timer);saveSession();cancelAnimationFrame(raf.current);window.removeEventListener("error",onError);window.removeEventListener("unhandledrejection",onError);document.removeEventListener("click",gate,true)};
  },[]);

  function safeMode(){const b=Array.from(document.querySelectorAll("button")).find(x=>/safe mode/i.test(x.textContent||""));if(b instanceof HTMLElement)b.click();setErrors([])}
  return <><div className="ecg-metrics" title="Performance do Editor"><b>{metrics.fps} FPS</b><span>{metrics.nodes} DOM</span><span>{metrics.canvases} WebGL</span><span>{metrics.memory}</span></div>{errors.length>0&&<div className="ecg-crash"><div><b>Editor detectou {errors.length} erro(s)</b><span>{errors.at(-1)?.message}</span></div><button onClick={safeMode}>Abrir Safe Mode</button><button onClick={()=>setErrors([])}>×</button></div>}<style jsx global>{`.ecg-metrics{position:fixed;z-index:100052;right:380px;bottom:13px;display:flex;gap:7px;align-items:center;padding:6px 9px;border-radius:8px;background:rgba(7,27,43,.88);color:#aac4d3;font-size:6px;pointer-events:none}.ecg-metrics b{color:#5ee0a5;font-size:7px}.ecg-crash{position:fixed;z-index:100080;left:50%;top:78px;transform:translateX(-50%);width:min(640px,92vw);display:grid;grid-template-columns:1fr auto 28px;gap:10px;align-items:center;padding:10px 12px;background:#fff2df;border:1px solid #e2aa4b;border-radius:10px;box-shadow:0 12px 35px rgba(0,0,0,.18)}.ecg-crash b,.ecg-crash span{display:block}.ecg-crash b{font-size:9px;color:#70470c}.ecg-crash span{font-size:7px;color:#8b661d;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ecg-crash button{border:1px solid #d3a14c;background:#fff;border-radius:6px;padding:7px;font-size:7px;font-weight:900}@media(max-width:900px){.ecg-metrics{display:none}}`}</style></>;
}
