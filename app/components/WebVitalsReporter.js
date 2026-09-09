"use client";
import {useReportWebVitals} from "next/web-vitals";

export default function WebVitalsReporter(){
  useReportWebVitals(metric=>{
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
