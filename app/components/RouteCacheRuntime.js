"use client";

import { useEffect } from "react";

const ROUTES = [
  "/area-do-aluno","/hoje","/conteudos","/conteudos/banco-de-questoes",
  "/conteudos/caderno-de-erros","/conteudos/fixacao","/simulado",
  "/flashcards","/mapas-mentais","/minha-biblioteca","/plano-de-estudos",
  "/plano-de-estudos/pendencias","/centro-de-revisao","/revisao-inteligente",
  "/treino-adaptativo","/analise-de-fraquezas","/conquistas","/ranking",
  "/minha-trajetoria","/pesquisar","/contramestre","/offline"
];

export default function RouteCacheRuntime(){
  useEffect(()=>{
    if(!("serviceWorker" in navigator)) return;
    let cancelled=false;
    const warm=async()=>{
      if(cancelled||!navigator.onLine) return;
      try{
        const reg=await navigator.serviceWorker.ready;
        reg.active?.postMessage({type:"CACHE_OFFLINE_ROUTES",routes:ROUTES});
      }catch{}
    };
    const id=("requestIdleCallback" in window)
      ? window.requestIdleCallback(warm,{timeout:15000})
      : window.setTimeout(warm,10000);
    const onOnline=()=>warm();
    window.addEventListener("online",onOnline);
    return()=>{
      cancelled=true;
      window.removeEventListener("online",onOnline);
      if("cancelIdleCallback" in window) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  },[]);
  return null;
}
