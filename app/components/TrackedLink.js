"use client";
export default function TrackedLink({href,event="cta_click",metadata={},className="",children}){
  function track(){try{navigator.sendBeacon?.("/api/growth/event",new Blob([JSON.stringify({event,metadata:{...metadata,href}})],{type:"application/json"}))||fetch("/api/growth/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event,metadata:{...metadata,href}}),keepalive:true});}catch{}}
  return <a href={href} className={className} onClick={track}>{children}</a>
}