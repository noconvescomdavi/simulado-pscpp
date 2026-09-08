"use client";
import {useEffect} from "react";

const KEY="estibordo.studySession";

export default function StudySessionTracker(){
  useEffect(()=>{
    let stopped=false;
    let lastActivity=Date.now();

    const touch=()=>{lastActivity=Date.now()};
    const stop=async()=>{
      if(stopped)return;
      const raw=localStorage.getItem(KEY);
      if(!raw)return;
      let data=null;
      try{data=JSON.parse(raw)}catch{}
      if(!data?.id){localStorage.removeItem(KEY);return}
      stopped=true;
      try{
        await fetch("/api/study-plan/session",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({action:"stop",session_id:data.id}),
          keepalive:true
        });
      }catch{}
      localStorage.removeItem(KEY);
    };

    const heartbeat=async()=>{
      const raw=localStorage.getItem(KEY);
      if(!raw)return;
      let data=null;
      try{data=JSON.parse(raw)}catch{}
      if(!data?.id){localStorage.removeItem(KEY);return}
      if(Date.now()-lastActivity>3*60*1000){await stop();return}
      try{
        const r=await fetch("/api/study-plan/session",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({action:"heartbeat",session_id:data.id}),
          keepalive:true
        });
        if(r.status===404)localStorage.removeItem(KEY);
      }catch{}
    };

    for(const ev of ["pointerdown","keydown","touchstart","scroll"])window.addEventListener(ev,touch,{passive:true});
    const timer=setInterval(heartbeat,60000);
    return()=>{
      clearInterval(timer);
      for(const ev of ["pointerdown","keydown","touchstart","scroll"])window.removeEventListener(ev,touch);
    };
  },[]);
  return null;
}

export async function stopTrackedStudySession(){
  const KEY="estibordo.studySession";
  const raw=localStorage.getItem(KEY);
  if(!raw)return null;
  let data=null;
  try{data=JSON.parse(raw)}catch{}
  localStorage.removeItem(KEY);
  if(!data?.id)return null;
  try{
    const r=await fetch("/api/study-plan/session",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action:"stop",session_id:data.id}),
      keepalive:true
    });
    return await r.json().catch(()=>null);
  }catch{return null}
}

export async function startTrackedStudySession({task_key,subject_slug,session_type,plan_date,metadata={}}){
  const KEY="estibordo.studySession";
  try{
    const previous=localStorage.getItem(KEY);
    if(previous){
      const p=JSON.parse(previous);
      if(p?.id){
        await fetch("/api/study-plan/session",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({action:"stop",session_id:p.id}),keepalive:true
        }).catch(()=>{});
      }
    }
  }catch{}
  const r=await fetch("/api/study-plan/session",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"start",task_key,subject_slug,session_type,plan_date,metadata})
  });
  const data=await r.json().catch(()=>({}));
  if(r.ok&&data.session?.id){
    localStorage.setItem(KEY,JSON.stringify({id:data.session.id,started_at:data.session.started_at,task_key}));
    return data.session;
  }
  throw new Error(data.error||"Não foi possível iniciar a sessão de estudo.");
}
