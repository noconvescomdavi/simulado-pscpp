"use client";
import {useEffect,useMemo,useState} from "react";

const FIELDS=[
  ["code","Código"],["name","Nome"],["term_pt","Termo PT"],["term_en","Termo EN"],
  ["pt","Texto / resposta PT"],["en","Texto / resposta EN"],["note","Nota"],
  ["image","Imagem (URL)"],["category","Categoria"]
];

export default function FlashcardManager({open,onClose,initialSlug,onChanged}){
  const [slug,setSlug]=useState(initialSlug||"cis");
  const [deck,setDeck]=useState(null);
  const [index,setIndex]=useState(0);
  const [draft,setDraft]=useState({});
  const [status,setStatus]=useState("");
  const [saving,setSaving]=useState(false);

  const cards=Array.isArray(deck?.cards)?deck.cards:[];
  const card=cards[index]||null;
  useEffect(()=>{if(open&&initialSlug)setSlug(initialSlug)},[open,initialSlug]);
  useEffect(()=>{setDraft(card?{...card}:{});},[card?.id,index]);

  async function load(){
    setStatus("Carregando...");
    const r=await fetch("/api/site-editor/flashcards?slug="+encodeURIComponent(slug),{cache:"no-store"});
    const j=await r.json().catch(()=>({}));
    if(!r.ok){setStatus(j.error||"Falha ao carregar deck.");setDeck(null);return}
    setDeck(j.deck);setIndex(0);setStatus("");
  }
  useEffect(()=>{if(open)load()},[open]);

  async function save(){
    if(!deck||!card)return;setSaving(true);setStatus("Salvando cartão...");
    const r=await fetch("/api/site-editor/flashcards",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:deck.slug,card_id:card.id,patch:draft})});
    const j=await r.json().catch(()=>({}));setSaving(false);
    if(!r.ok){setStatus(j.error||"Falha ao salvar.");return}
    setDeck(j.deck);setStatus("Cartão salvo.");
    onChanged?.();
  }

  async function upload(file){
    if(!file)return;setStatus("Enviando imagem...");
    const fd=new FormData();fd.append("file",file);
    const r=await fetch("/api/site-editor/upload",{method:"POST",body:fd});const j=await r.json().catch(()=>({}));
    if(!r.ok){setStatus(j.error||"Falha no upload.");return}
    setDraft(d=>({...d,image:j.url}));setStatus("Imagem enviada. Clique em Salvar cartão.");
  }

  const label=useMemo(()=>card?String(card.name||card.term_pt||card.code||card.id):"",[card]);

  if(!open)return null;
  return <div className="ev-drawer-backdrop ev-flash-backdrop">
    <aside className="ev-flash-manager">
      <header><div><b>Editor de Flashcards</b><span>Edite conteúdo, mídia, efeito e transição de cada cartão</span></div><button onClick={onClose}>×</button></header>
      <div className="ev-flash-load"><input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="slug do deck"/><button onClick={load}>Carregar</button></div>
      {deck&&<div className="ev-flash-body">
        <div className="ev-flash-list"><b>{deck.title}</b><small>{cards.length} cartões</small>{cards.map((c,i)=><button className={i===index?"is-active":""} key={String(c.id)} onClick={()=>setIndex(i)}><span>{c.code||c.id}</span><small>{c.name||c.term_pt||c.pt||"Cartão"}</small></button>)}</div>
        <div className="ev-flash-form">
          <div className="ev-flash-head"><strong>{label||"Cartão"}</strong><span>{index+1}/{cards.length}</span></div>
          {FIELDS.map(([key,label])=><label className="ev-mini-field" key={key}><span>{label}</span>{["pt","en","note"].includes(key)?<textarea rows="3" value={draft[key]||""} onChange={e=>setDraft(d=>({...d,[key]:e.target.value}))}/>:<input value={draft[key]||""} onChange={e=>setDraft(d=>({...d,[key]:e.target.value}))}/>}</label>)}
          <label className="ev-media-library-upload"><input type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0])}/><span>＋ Upload de imagem do cartão</span></label>
          <div className="ev-grid2" style={{marginTop:10}}>
            <label className="ev-mini-field"><span>Efeito</span><select value={draft.effect||"none"} onChange={e=>setDraft(d=>({...d,effect:e.target.value}))}><option value="none">Nenhum</option><option value="glow">Glow</option><option value="float">Flutuar</option><option value="tilt">Inclinação</option></select></label>
            <label className="ev-mini-field"><span>Transição</span><select value={draft.transition||"normal"} onChange={e=>setDraft(d=>({...d,transition:e.target.value}))}><option value="normal">Normal</option><option value="fast">Rápida</option><option value="soft">Suave</option><option value="dramatic">Dramática</option></select></label>
          </div>
          <div className="ev-flash-actions"><button disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>← Anterior</button><button disabled={saving} className="primary" onClick={save}>{saving?"Salvando...":"Salvar cartão"}</button><button disabled={index>=cards.length-1} onClick={()=>setIndex(i=>Math.min(cards.length-1,i+1))}>Próximo →</button></div>
          {status&&<div className="ev-status">{status}</div>}
        </div>
      </div>}
      {!deck&&<div className="ev-flash-empty">{status||"Informe o slug do deck e carregue."}</div>}
    </aside>
  </div>
}
