"use client";

import {RIPEAM_ASSET_HASHES,versionRipeamAssetUrl} from "../../../../lib/ripeam-asset-manifest";

export const VIEWER_QUALITIES={
  low:{label:"Baixa",pixelRatio:1,maxPixelRatio:1,shadows:false},
  medium:{label:"Média",pixelRatio:1.25,maxPixelRatio:1.35,shadows:false},
  high:{label:"Alta",pixelRatio:1.6,maxPixelRatio:1.8,shadows:true},
  ultra:{label:"Ultra",pixelRatio:2,maxPixelRatio:2.25,shadows:true}
};

export const RIPEAM_MODEL_URLS=Object.keys(RIPEAM_ASSET_HASHES).map(versionRipeamAssetUrl);

export function detectAutoQuality(){
  if(typeof navigator==="undefined"||typeof window==="undefined")return "high";
  const mem=Number(navigator.deviceMemory||4);
  const cores=Number(navigator.hardwareConcurrency||4);
  const mobile=window.matchMedia?.("(max-width: 900px)")?.matches;
  const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const save=!!conn?.saveData;
  if(save||mem<=2||cores<=2)return "low";
  if(mobile||mem<=4||cores<=4)return "medium";
  if(mem>=8&&cores>=8)return "ultra";
  return "high";
}

export function resolvedQuality(mode="auto"){
  const key=mode==="auto"?detectAutoQuality():mode;
  return VIEWER_QUALITIES[key]||VIEWER_QUALITIES.high;
}

export function connectionAllowsPreload(){
  if(typeof navigator==="undefined")return false;
  const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  if(!conn)return true;
  if(conn.saveData)return false;
  const type=String(conn.effectiveType||"").toLowerCase();
  return !["slow-2g","2g","3g"].includes(type);
}

export async function storageAllowsPreload(minFreeBytes=160*1024*1024){
  try{
    const e=await navigator.storage?.estimate?.();
    if(!e?.quota)return true;
    return (e.quota-(e.usage||0))>=minFreeBytes;
  }catch{return true}
}

export async function cacheStats(){
  if(typeof caches==="undefined")return {supported:false,count:0,bytes:0};
  try{
    const cache=await caches.open("estibordo-ripeam-models-v1");
    const keys=await cache.keys();
    let bytes=0;
    for(const req of keys){
      const r=await cache.match(req);
      const len=Number(r?.headers?.get("content-length")||0);
      if(len)bytes+=len;
      else if(r){try{bytes+=(await r.clone().blob()).size}catch{}}
    }
    return {supported:true,count:keys.length,bytes};
  }catch{return {supported:false,count:0,bytes:0}}
}

export async function isModelCached(url){
  if(typeof caches==="undefined")return false;
  try{
    const cache=await caches.open("estibordo-ripeam-models-v1");
    return !!(await cache.match(versionRipeamAssetUrl(url)));
  }catch{return false}
}

export async function preloadModels(urls=[]){
  if(typeof fetch==="undefined")return {loaded:0,skipped:urls.length};
  if(!connectionAllowsPreload()||!(await storageAllowsPreload()))return {loaded:0,skipped:urls.length};
  let loaded=0,skipped=0;
  for(const raw of [...new Set(urls.filter(Boolean))]){
    try{
      const url=versionRipeamAssetUrl(raw);
      if(await isModelCached(url)){skipped++;continue}
      const r=await fetch(url,{cache:"default",credentials:"same-origin"});
      if(r.ok){try{await r.arrayBuffer()}catch{}loaded++}else skipped++;
    }catch{skipped++}
  }
  return {loaded,skipped};
}

export async function cacheEntireModule(onProgress){
  if(typeof caches==="undefined")throw new Error("Cache Storage indisponível.");
  let done=0;
  for(const raw of RIPEAM_MODEL_URLS){
    const r=await fetch(raw,{cache:"default",credentials:"same-origin"});
    if(!r.ok)throw new Error("Falha ao baixar recurso offline.");
    try{await r.arrayBuffer()}catch{}
    done++;
    onProgress?.({done,total:RIPEAM_MODEL_URLS.length,percent:Math.round(done/RIPEAM_MODEL_URLS.length*100)});
  }
  return cacheStats();
}

export async function clearRipeamModelCache(){
  if(typeof caches==="undefined")return false;
  return caches.delete("estibordo-ripeam-models-v1");
}

export function preloadCandidates(currentUrl,allUrls=RIPEAM_MODEL_URLS,limit=2){
  const versioned=versionRipeamAssetUrl(currentUrl||"");
  const idx=Math.max(0,allUrls.indexOf(versioned));
  const out=[];
  for(let step=1;out.length<limit&&step<=allUrls.length;step++){
    const u=allUrls[(idx+step)%allUrls.length];
    if(u&&u!==versioned&&!out.includes(u))out.push(u);
  }
  return out;
}

export function safePixelRatio(mode="auto",dynamicScale=1){
  if(typeof window==="undefined")return 1;
  const q=resolvedQuality(mode);
  return Math.max(.75,Math.min(window.devicePixelRatio||1,q.maxPixelRatio)*dynamicScale);
}
