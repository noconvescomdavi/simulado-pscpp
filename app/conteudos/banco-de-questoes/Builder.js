"use client";
import {useState} from "react";
import QuestionFilterControls,{EMPTY_QUESTION_FILTERS} from "../../components/QuestionFilterControls";
import styles from "./bank.module.css";
import {createOfflineNotebook} from "../../../lib/offline-store";

function mergeFacetList(items){
  const merged=new Map();
  for(const item of items){
    const key=`${item.work_id||""}:${item.id}`;
    const current=merged.get(key)||{...item,count:0,subjects:[]};
    current.count+=Number(item.count||0);
    current.subjects=[...new Set([...(current.subjects||[]),...(item.subjects||[])])];
    merged.set(key,current);
  }
  return [...merged.values()].sort((a,b)=>a.label.localeCompare(b.label,"pt-BR",{numeric:true}));
}

export default function Builder({banks,trial=false,initialSubjects=[],fixation=null,editing=null}){
  const available=banks.filter(x=>x.count).map(x=>x.slug);
  const initial=(editing?.subjects||initialSubjects).filter(slug=>available.includes(slug));
  const [s,setS]=useState(initial.length?initial:available);
  const [n,setN]=useState(editing?.total_questions||(trial?10:(fixation?300:20)));
  const [title,setTitle]=useState(editing?.title||"");
  const [e,setE]=useState("");
  const [busy,setBusy]=useState(false);
  const [filters,setFilters]=useState({...EMPTY_QUESTION_FILTERS,...(editing?.filters||{})});
  const facets={
    works:mergeFacetList(banks.flatMap(bank=>bank.filters?.works||[])),
    chapters:mergeFacetList(banks.flatMap(bank=>bank.filters?.chapters||[])),
    modules:mergeFacetList(banks.flatMap(bank=>bank.filters?.modules||[])),
  };

  function toggleSubject(slug){
    setS(current=>current.includes(slug)?current.filter(item=>item!==slug):[...current,slug]);
    setFilters({...EMPTY_QUESTION_FILTERS});
  }

  async function go(){
    if(busy)return;
    setBusy(true);setE("");
    const body={
      subjects:s,
      count:trial?10:n,
      filters:fixation?EMPTY_QUESTION_FILTERS:filters,
      fixation:editing?null:fixation,
      title:editing?title:(fixation?"Caderno de fixação — "+(fixation.chapter||fixation.section_key):null)
    };
    if(!navigator.onLine&&editing){setE("A edição exige conexão à internet para preservar as respostas existentes.");setBusy(false);return;}
    if(!navigator.onLine){
      try{
        const notebook=await createOfflineNotebook(body);
        location.href=`/offline?mode=notebook&id=${notebook.id}`;
      }catch(error){setE(error.message||"Prepare o conteúdo offline antes de criar um caderno sem internet.");setBusy(false)}
      return;
    }
    let r;
    try{r=await fetch(editing?`/api/question-notebooks/${editing.id}`:"/api/question-notebooks",{
      method:editing?"PATCH":"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });}catch(error){
      if(editing){setE("Não foi possível salvar a edição. Confira sua conexão.");setBusy(false);return;}
      try{
        const notebook=await createOfflineNotebook(body);
        location.href=`/offline?mode=notebook&id=${notebook.id}`;
      }catch(fallback){setE(fallback.message||"Não foi possível criar o caderno.");setBusy(false);}
      return;
    }
    const p=await r.json().catch(()=>({}));

    if(!r.ok){
      if(r.status===429&&trial&&!editing){
        location.href="/teste-gratis-excedido?recurso=caderno";
        return;
      }
      setE(p.error||"Erro");setBusy(false);
      return;
    }

    location.href=`/conteudos/caderno/${p.notebook.id}`;
  }

  const totalSelected=banks.filter(x=>s.includes(x.slug)).reduce((sum,x)=>sum+Number(x.count||0),0);
  const availabilityText=filters.official_exam_only
    ?"Acervo histórico: 254 questões oficiais não anuladas · 254 ativas"
    :`${totalSelected.toLocaleString("pt-BR")} questões disponíveis`;
  const actionLabel=editing?"Salvar alterações":fixation?"Criar caderno de fixação":"Gerar caderno";
  return (
    <section id="gerar-caderno" className={styles.builderLayout}><div className={styles.box}>
      {editing&&<div className={styles.editNotice}><strong>Editar caderno em andamento</strong><p>As {editing.answered_count} questão(ões) já respondida(s) e seus resultados são preservados. Os novos filtros serão aplicados somente às questões pendentes. Caso existam menos questões compatíveis que o solicitado, o caderno ficará com as disponíveis.</p><a href="/conteudos/banco-de-questoes#meus-cadernos">Cancelar edição</a></div>}
      {editing&&<label className={styles.titleEdit}>Nome do caderno<input type="text" maxLength={180} value={title} onChange={event=>setTitle(event.target.value)} placeholder="Nome do caderno"/></label>}
      {fixation&&<p><strong>Modo fixação:</strong> o caderno usará somente as questões que correspondem ao conteúdo estudado. Se houver menos questões, o caderno será criado apenas com as disponíveis.</p>}
      <div className={styles.banks}>
        {banks.map(x=>(
          <label key={x.slug} className={!x.count?styles.off:""}>
            <input
              type="checkbox"
              disabled={!x.count}
              checked={s.includes(x.slug)}
              onChange={()=>toggleSubject(x.slug)}
            />
            <span>
              <b>{x.title}</b>
              <small>{x.count?`${x.count} questões`:"Aguardando upload"}</small>
              {x.ripeam_count>0&&<small><strong>{x.ripeam_count} RIPEAM</strong> · use o filtro abaixo para emitir somente essas</small>}
            </span>
          </label>
        ))}
      </div>

      {!fixation&&(
        <QuestionFilterControls
          facets={facets}
          value={filters}
          onChange={setFilters}
          subjects={s}
        />
      )}

      <label>
        Quantidade
        <input
          type="number"
          min={trial?10:Math.max(1,(editing?.answered_count||0)+1)}
          max={trial?10:300}
          disabled={trial}
          value={trial?10:n}
          onChange={x=>setN(Math.max(editing?.answered_count?editing.answered_count+1:1,Math.min(300,+x.target.value||1)))}
        />
      </label>

      {trial&&!editing&&<p><strong>Teste gratuito:</strong> este será seu único caderno, com 10 questões aleatórias entre as matérias disponíveis.</p>}
      {e&&<p>{e}</p>}
      <button onClick={go} disabled={!s.length||busy} aria-busy={busy}>{busy?"Salvando caderno…":actionLabel}</button>
    </div><aside className={styles.summary}><span>{editing?"EDITANDO CADERNO":"SEU CADERNO"}</span><strong>{trial?10:n} questões</strong><p>{s.length} matéria{s.length===1?"":"s"} selecionada{s.length===1?"":"s"} · {availabilityText}</p><small>Estimativa de resolução: ~{Math.max(1,Math.round((trial?10:n)*1.2))} min</small><button onClick={go} disabled={!s.length||busy} aria-busy={busy}>{busy?"Salvando caderno…":actionLabel}</button></aside></section>
  );
}
