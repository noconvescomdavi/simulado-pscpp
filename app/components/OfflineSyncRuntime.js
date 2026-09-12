"use client";

import { useCallback, useEffect, useState } from "react";
import { ensureOfflinePackCurrent, getOfflineStatus, onOfflineChange, syncOfflineQueue } from "../../lib/offline-store";

export default function OfflineSyncRuntime(){
  const [online,setOnline]=useState(true);
  const [status,setStatus]=useState({installed:false,pending:0,questions:0});
  const [syncing,setSyncing]=useState(false);
  const [recentSync,setRecentSync]=useState(false);
  const [preloading,setPreloading]=useState(false);

  const refresh=useCallback(async()=>{
    setOnline(typeof navigator==="undefined"?true:navigator.onLine);
    try{setStatus(await getOfflineStatus())}catch{}
  },[]);

  const preload=useCallback(async(force=false)=>{
    if(typeof navigator!=="undefined"&&!navigator.onLine){await refresh();return}
    setPreloading(true);
    try{
      const auth=await fetch("/api/auth/me",{cache:"no-store"});
      if(!auth.ok)return;
      await ensureOfflinePackCurrent({force});
    }catch(error){
      console.error("Falha no preload offline automático:",error);
    }finally{
      setPreloading(false);
      await refresh();
    }
  },[refresh]);

  const sync=useCallback(async()=>{
    if(typeof navigator!=="undefined"&&!navigator.onLine){await refresh();return}
    setSyncing(true);
    try{
      const result=await syncOfflineQueue();
      if(result?.synced>0){setRecentSync(true);setTimeout(()=>setRecentSync(false),3500)}
    }catch(error){
      console.error("Falha na sincronização offline:",error);
    }finally{
      setSyncing(false);
      await refresh();
    }
  },[refresh]);

  useEffect(()=>{
    refresh();
    const remove=onOfflineChange(refresh);
    const onOnline=()=>{setOnline(true);sync();preload()};
    const onOffline=()=>{setOnline(false);refresh()};
    const onMessage=(event)=>{if(event.data?.type==="ESTIBORDO_SYNC_REQUEST")sync()};
    window.addEventListener("online",onOnline);
    window.addEventListener("offline",onOffline);
    navigator.serviceWorker?.addEventListener("message",onMessage);
    const syncTimer=setInterval(()=>{if(navigator.onLine)sync()},60_000);
    const preloadTimer=setInterval(()=>{if(navigator.onLine)preload()},15*60_000);
    if(navigator.onLine){sync();preload();}
    return()=>{
      remove();
      clearInterval(syncTimer);
      clearInterval(preloadTimer);
      window.removeEventListener("online",onOnline);
      window.removeEventListener("offline",onOffline);
      navigator.serviceWorker?.removeEventListener("message",onMessage);
    };
  },[refresh,sync,preload]);

  const show=!online||syncing||preloading||status.pending>0||recentSync;
  if(!show)return null;
  const label=!online
    ? `Offline · ${status.pending||0} pendente${status.pending===1?"":"s"}`
    : preloading
      ? "Preparando offline automaticamente…"
      : syncing
      ? "Sincronizando…"
      : status.pending>0
        ? `${status.pending} alteração${status.pending===1?"":"ões"} pendente${status.pending===1?"":"s"}`
        : "✓ Tudo sincronizado";

  return <a
    href="/offline"
    aria-live="polite"
    title="Central offline ESTIBORDO"
    style={{
      position:"fixed",right:"max(12px, env(safe-area-inset-right))",
      bottom:"max(12px, env(safe-area-inset-bottom))",zIndex:9999,
      background:online?"#0c2736":"#5b3512",color:"#fff",
      padding:"9px 13px",borderRadius:999,fontSize:12,fontWeight:800,
      boxShadow:"0 8px 30px rgba(0,0,0,.28)",textDecoration:"none",
      border:"1px solid rgba(255,255,255,.15)"
    }}
  >{label}</a>;
}
