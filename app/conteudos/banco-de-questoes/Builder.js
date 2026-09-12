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

export default function Builder({banks,trial=false,initialSubjects=[],fixation=null}){
  const available=banks.filter(x=>x.count).map(x=>x.slug);
  const initial=initialSubjects.filter(slug=>available.includes(slug));
  const [s,setS]=useState(initial.length?initial:available);
  const [n,setN]=useState(trial?10:(fixation?100:20));
  const [e,setE]=useState("");
  const [filters,setFilters]=useState({...EMPTY_QUESTION_FILTERS});
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
    setE("");
    const body={
      subjects:s,
      count:trial?10:n,
      filters:trial||fixation?EMPTY_QUESTION_FILTERS:filters,
      fixation,
      title:fixation?"Caderno de fixação — "+(fixation.chapter||fixation.section_key):null
    };
    if(!navigator.onLine){
      try{
        const notebook=await createOfflineNotebook(body);
        location.href=`/offline?mode=notebook&id=${notebook.id}`;
      }catch(error){setE(error.message||"Prepare o conteúdo offline antes de criar um caderno sem internet.")}
      return;
    }
    let r;
    try{r=await fetch("/api/question-notebooks",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });}catch(error){
      try{
        const notebook=await createOfflineNotebook(body);
        location.href=`/offline?mode=notebook&id=${notebook.id}`;
      }catch(fallback){setE(fallback.message||"Não foi possível criar o caderno.");}
      return;
    }
    const p=await r.json().catch(()=>({}));

    if(!r.ok){
      if(r.status===429&&trial){
        location.href="/teste-gratis-excedido?recurso=caderno";
        return;
      }
      setE(p.error||"Erro");
      return;
    }

    location.href=`/conteudos/caderno/${p.notebook.id}`;
  }

  return (
    <section className={styles.box}>
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

      {!trial&&!fixation&&(
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
          min={trial?10:1}
          max={trial?10:100}
          disabled={trial}
          value={trial?10:n}
          onChange={x=>setN(Math.max(1,Math.min(100,+x.target.value||1)))}
        />
      </label>

      {trial&&<p><strong>Teste gratuito:</strong> este será seu único caderno, com 10 questões aleatórias entre as matérias disponíveis.</p>}
      {e&&<p>{e}</p>}
      <button onClick={go} disabled={!s.length}>{fixation?"Criar caderno de fixação":"Criar caderno com estes filtros"}</button>
    </section>
  );
}
