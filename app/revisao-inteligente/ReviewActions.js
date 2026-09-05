"use client";
import {useState} from "react";

export default function ReviewActions({sourceKey,dueAt}){
  const [saved,setSaved]=useState(false);
  const [busy,setBusy]=useState(false);

  async function grade(quality){
    if(busy)return;
    setBusy(true);
    try{
      const r=await fetch("/api/review-queue",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({source_key:sourceKey,quality})
      });
      if(r.ok)setSaved(true);
    }finally{setBusy(false)}
  }

  if(saved)return <span style={{fontSize:8,color:"#55d5a5"}}>Revisão reagendada ✓</span>;

  return <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
    <button disabled={busy} onClick={()=>grade("again")}>Ainda errei</button>
    <button disabled={busy} onClick={()=>grade("hard")}>Difícil</button>
    <button disabled={busy} onClick={()=>grade("good")}>Bom</button>
    <button disabled={busy} onClick={()=>grade("easy")}>Fácil</button>
  </div>
}
