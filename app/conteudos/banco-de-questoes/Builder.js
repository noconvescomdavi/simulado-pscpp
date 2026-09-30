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
  const [busy,setBusy]=useState(false);
  const [filters,setFilters]=useState({...EMPTY_QUESTION_FILTERS});
  const facets={
    works:mergeFacetList(banks.flatMap(bank=>(filters.official_only?bank.official_filters:bank.filters)?.works||[])),
    chapters:mergeFacetList(banks.flatMap(bank=>(filters.official_only?bank.official_filters:bank.filters)?.chapters||[])),
    modules:mergeFacetList(banks.flatMap(bank=>(filters.official_only?bank.official_filters:bank.filters)?.modules||[])),
  };

  function toggleSubject(slug){
    setS(current=>current.includes(slug)?current.filter(item=>item!==slug):[...current,slug]);
    setFilters({...EMPTY_QUESTION_FILTERS,official_only:filters.official_only,exam_year:filters.exam_year});
  }

  function bankCount(bank, next=filters){
    return next.official_only
      ? Number(next.exam_year ? bank.official_year_counts?.[next.exam_year]||0 : bank.official_count||0)
      : Number(bank.count||0);
  }

  function changeFilters(next){
    if(next.official_only){
      setS(current=>current.filter(slug=>banks.some(bank=>bank.slug===slug&&bankCount(bank,next)>0)));
    }
    setFilters(next);
  }

  async function go(){
    if(busy)return;
    setBusy(true);setE("");
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
      }catch(error){setE(error.message||"Prepare o conteúdo offline antes de criar um caderno sem internet.");setBusy(false)}
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
      }catch(fallback){setE(fallback.message||"Não foi possível criar o caderno.");setBusy(false);}
      return;
    }
    const p=await r.json().catch(()=>({}));

    if(!r.ok){
      if(r.status===429&&trial){
        location.href="/teste-gratis-excedido?recurso=caderno";
        return;
      }
      setE(p.error||"Erro");setBusy(false);
      return;
    }

    location.href=`/conteudos/caderno/${p.notebook.id}`;
  }

  const totalSelected=banks.filter(x=>s.includes(x.slug)).reduce((sum,x)=>sum+bankCount(x),0);
  return (
    <section className={styles.builderLayout}><div className={styles.box}>
      {fixation&&<p><strong>Modo fixação:</strong> o caderno usará somente as questões que correspondem ao conteúdo estudado. Se houver menos questões, o caderno será criado apenas com as disponíveis.</p>}
      <div className={styles.banks}>
        {banks.map(x=>(
          <label key={x.slug} className={!bankCount(x)?styles.off:""}>
            <input
              type="checkbox"
              disabled={!bankCount(x)}
              checked={s.includes(x.slug)}
              onChange={()=>toggleSubject(x.slug)}
            />
            <span>
              <b>{x.title}</b>
              <small>{bankCount(x)?`${bankCount(x)} questões`:filters.official_only?"Sem questões oficiais neste recorte":"Aguardando upload"}</small>
              {!filters.official_only&&x.ripeam_count>0&&<small><strong>{x.ripeam_count} RIPEAM</strong> · use o filtro abaixo para emitir somente essas</small>}
            </span>
          </label>
        ))}
      </div>

      {!trial&&!fixation&&(
        <QuestionFilterControls
          facets={facets}
          value={filters}
          onChange={changeFilters}
          allowOfficial
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
      <button onClick={go} disabled={!s.length||busy} aria-busy={busy}>{busy?"Preparando caderno…":fixation?"Criar caderno de fixação":"Gerar caderno"}</button>
    </div><aside className={styles.summary}><span>SEU CADERNO</span><strong>{trial?10:n} questões</strong><p>{s.length} matéria{s.length===1?"":"s"} selecionada{s.length===1?"":"s"} · {totalSelected.toLocaleString("pt-BR")} questões disponíveis</p><small>Estimativa de resolução: ~{Math.max(1,Math.round((trial?10:n)*1.2))} min</small><button onClick={go} disabled={!s.length||busy} aria-busy={busy}>{busy?"Preparando caderno…":fixation?"Criar caderno de fixação":"Gerar caderno"}</button></aside></section>
  );
}
