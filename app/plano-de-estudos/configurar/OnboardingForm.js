"use client";
import {useMemo,useState} from "react";
import styles from "./configurar.module.css";

export default function OnboardingForm({subjects,initial}){
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState("");
  const [studied,setStudied]=useState(new Set(initial?.studied_subjects||[]));
  const [days,setDays]=useState(new Set(initial?.study_days||[1,2,3,4,5,6]));
  const [confidence,setConfidence]=useState(initial?.confidence_by_subject||{});
  const dayLabels=useMemo(()=>[["Seg",1],["Ter",2],["Qua",3],["Qui",4],["Sex",5],["Sáb",6],["Dom",7]],[]);

  function toggle(setter,current,value){
    const next=new Set(current);
    next.has(value)?next.delete(value):next.add(value);
    setter(next);
  }

  async function submit(e){
    e.preventDefault();setBusy(true);setMsg("");
    const f=new FormData(e.currentTarget);
    const body={
      experience_level:String(f.get("experience_level")||"beginner"),
      started_before:f.get("started_before")==="yes",
      months_studying:Number(f.get("months_studying")||0),
      daily_minutes:Number(f.get("daily_minutes")||60),
      study_days:[...days],
      studied_subjects:[...studied],
      confidence_by_subject:confidence,
      notes:String(f.get("notes")||"")
    };
    const r=await fetch("/api/study-plan/onboarding",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const j=await r.json().catch(()=>({}));
    setBusy(false);
    if(!r.ok){setMsg(j.error||"Não foi possível salvar.");return}
    location.href="/plano-de-estudos";
  }

  return <form className={styles.form} onSubmit={submit}>
    <section className={styles.block}>
      <div className={styles.blockTitle}><span>01</span><div><h2>Seu ponto de partida</h2><p>Defina o nível atual para não repetir conteúdo desnecessariamente.</p></div></div>
      <div className={styles.options3}>
        {[
          ["beginner","Vou começar agora","Ainda não iniciei uma preparação estruturada."],
          ["studying","Já estou estudando","Já li parte da bibliografia e resolvo questões."],
          ["advanced","Preparação avançada","Já percorri boa parte do conteúdo e preciso consolidar."]
        ].map(([value,title,desc])=><label key={value}><input type="radio" name="experience_level" value={value} defaultChecked={(initial?.experience_level||"beginner")===value}/><span><b>{title}</b><small>{desc}</small></span></label>)}
      </div>
      <div className={styles.inlineFields}>
        <label><span>Já estudava antes de entrar na ESTIBORDO?</span><select name="started_before" defaultValue={initial?.started_before?"yes":"no"}><option value="no">Não</option><option value="yes">Sim</option></select></label>
        <label><span>Há quantos meses estuda para o PSCPP?</span><input name="months_studying" type="number" min="0" max="240" defaultValue={initial?.months_studying||0}/></label>
        <label><span>Tempo disponível por dia</span><select name="daily_minutes" defaultValue={initial?.daily_minutes||60}>{[30,45,60,90,120,180,240].map(v=><option value={v} key={v}>{v} minutos</option>)}</select></label>
      </div>
    </section>

    <section className={styles.block}>
      <div className={styles.blockTitle}><span>02</span><div><h2>Dias de estudo</h2><p>O calendário semanal será construído apenas nos dias selecionados.</p></div></div>
      <div className={styles.days}>{dayLabels.map(([label,value])=><button type="button" className={days.has(value)?styles.selected:""} key={value} onClick={()=>toggle(setDays,days,value)}>{label}</button>)}</div>
    </section>

    <section className={styles.block}>
      <div className={styles.blockTitle}><span>03</span><div><h2>O que você já estudou?</h2><p>Marque as matérias já iniciadas. O plano priorizará as lacunas.</p></div></div>
      <div className={styles.subjects}>{subjects.map(s=><label key={s.slug}><input type="checkbox" checked={studied.has(s.slug)} onChange={()=>toggle(setStudied,studied,s.slug)}/><span>{s.label}</span></label>)}</div>
    </section>

    <section className={styles.block}>
      <div className={styles.blockTitle}><span>04</span><div><h2>Autoavaliação por matéria</h2><p>1 = quase nenhum domínio · 5 = domínio alto.</p></div></div>
      <div className={styles.confidence}>{subjects.map(s=><div key={s.slug}><span>{s.label}</span><div>{[1,2,3,4,5].map(v=><button type="button" className={Number(confidence[s.slug]||1)===v?styles.selected:""} key={v} onClick={()=>setConfidence(c=>({...c,[s.slug]:v}))}>{v}</button>)}</div></div>)}</div>
    </section>

    <section className={styles.block}>
      <div className={styles.blockTitle}><span>05</span><div><h2>Observações</h2><p>Opcional: registre restrições de escala, cursos, viagens ou outra informação relevante.</p></div></div>
      <textarea name="notes" rows="4" defaultValue={initial?.notes||""} placeholder="Ex.: estudo melhor à noite; já terminei Arte Naval; tenho pouca base em Meteorologia..."/>
    </section>

    <div className={styles.submitBar}>
      <div><strong>Data-alvo: 01/11/2027</strong><span>O plano será recalculado conforme seu desempenho.</span></div>
      <button disabled={busy||!days.size}>{busy?"Salvando...":"Gerar meu plano inteligente"}</button>
    </div>
    {msg&&<p className={styles.message}>{msg}</p>}
  </form>;
}
