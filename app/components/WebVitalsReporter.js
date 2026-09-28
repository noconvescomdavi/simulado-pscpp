"use client";
import {useReportWebVitals} from "next/web-vitals";

export default function WebVitalsReporter(){
  useReportWebVitals(metric=>{
    // One stable sample per browser session keeps trend data while cutting
    // function invocations and database writes for telemetry by about 90%.
    let sampled=false;
    try{
      const key="estibordo:vitals-sample";
      let value=sessionStorage.getItem(key);
      if(value===null){value=Math.random()<0.1?"1":"0";sessionStorage.setItem(key,value)}
      sampled=value==="1";
    }catch{return}
    if(!sampled)return;
    const payload={
      name:String(metric.name||"").slice(0,32),
      value:Number(metric.value||0),
      rating:String(metric.rating||"").slice(0,24),
      navigationType:String(metric.navigationType||"").slice(0,50),
      route:location.pathname
    };
    if(!payload.name||!Number.isFinite(payload.value))return;
    const body=JSON.stringify(payload);
    if(navigator.sendBeacon){
      navigator.sendBeacon("/api/observability/vitals",new Blob([body],{type:"application/json"}));
    }else{
      fetch("/api/observability/vitals",{method:"POST",headers:{"Content-Type":"application/json"},body,keepalive:true}).catch(()=>{});
    }
  });
  return null;
}
