"use client";
import {useState} from "react";
import {SUBJECTS} from "../../lib/subjects";
import styles from "./maps.module.css";

export default function NewMindMap({preset={}}){
  const [open,setOpen]=useState(Boolean(preset.title||preset.note));
  const [title,setTitle]=useState(preset.title||"");
  const [subject,setSubject]=useState(preset.subject||"");
  const [template,setTemplate]=useState("study");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  async function create(event){
    event.preventDefault();
    if(busy)return;
    setBusy(true);setError("");
    try{
      const response=await fetch("/api/mind-maps",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        title:title||"Novo mapa mental",subject_slug:subject||null,template,seed_note:preset.note||""
      })});
      const payload=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(payload.error||"Não foi possível criar o mapa.");
      location.href=`/mapas-mentais/${payload.map.id}`;
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }

  return <div className={styles.newMap}>
    <button type="button" onClick={()=>setOpen(!open)}>＋ Novo mapa</button>
    {open&&<form onSubmit={create}>
      <label>Título<input value={title} maxLength={180} onChange={e=>setTitle(e.target.value)} placeholder="Ex.: RIPEAM — Luzes e marcas"/></label>
      <label>Matéria<select value={subject} onChange={e=>setSubject(e.target.value)}><option value="">Mapa livre</option>{SUBJECTS.map(s=><option key={s.slug} value={s.slug}>{s.label}</option>)}</select></label>
      <label>Começar com<select value={template} onChange={e=>setTemplate(e.target.value)}><option value="study">Modelo de estudo</option><option value="blank">Mapa em branco</option></select></label>
      {preset.note&&<small>Uma anotação da questão será adicionada ao nó principal.</small>}
      {error&&<p>{error}</p>}
      <div><button disabled={busy} type="submit">{busy?"Criando...":"Criar mapa"}</button><button type="button" onClick={()=>setOpen(false)}>Cancelar</button></div>
    </form>}
  </div>;
}
