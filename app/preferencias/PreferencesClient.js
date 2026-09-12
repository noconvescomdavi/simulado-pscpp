"use client";
import {useState} from "react";
import styles from "./preferences.module.css";
export default function PreferencesClient({initial}){const [form,setForm]=useState(initial),[status,setStatus]=useState("");
const set=(key,value)=>setForm(x=>({...x,[key]:value}));
async function save(){setStatus("Salvando...");const r=await fetch("/api/preferences",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});setStatus(r.ok?"Preferências salvas.":"Não foi possível salvar.");}
return <section className={styles.card}>
<label>Duração ideal da sessão<select value={form.session_minutes} onChange={e=>set("session_minutes",Number(e.target.value))}><option value="25">25 min</option><option value="45">45 min</option><option value="60">60 min</option><option value="90">90 min</option><option value="120">120 min</option></select></label>
<label>Modo preferido<select value={form.study_mode} onChange={e=>set("study_mode",e.target.value)}><option value="balanced">Equilibrado</option><option value="questions">Mais questões</option><option value="reading">Mais leitura</option><option value="review">Mais revisão</option></select></label>
<label>Densidade do painel<select value={form.dashboard_density} onChange={e=>set("dashboard_density",e.target.value)}><option value="compact">Compacto</option><option value="standard">Padrão</option><option value="detailed">Detalhado</option></select></label>
<label className={styles.check}><input type="checkbox" checked={form.smart_nudges} onChange={e=>set("smart_nudges",e.target.checked)}/> Recomendações inteligentes no painel</label>
<label className={styles.check}><input type="checkbox" checked={form.prioritize_due_reviews} onChange={e=>set("prioritize_due_reviews",e.target.checked)}/> Priorizar revisões vencidas</label>
<button onClick={save}>Salvar personalização</button><small>{status}</small>
</section>}
