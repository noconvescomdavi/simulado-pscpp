"use client";
import {useMemo,useState} from "react";
import styles from "./configurar.module.css";

const MONTH_BANDS=[
  ["0",0,"Ainda não comecei"],
  ["lt3",2,"Menos de 3 meses"],
  ["3-6",5,"3 a 6 meses"],
  ["6-12",9,"6 a 12 meses"],
  ["12-24",18,"1 a 2 anos"],
  ["24plus",30,"Mais de 2 anos"]
];
const DAY_LABELS=[["Seg",1],["Ter",2],["Qua",3],["Qui",4],["Sex",5],["Sáb",6],["Dom",7]];
const CONFIDENCE={
  1:["Muito fraco","Praticamente não conheço a matéria."],
  2:["Fraco","Conheço alguns conceitos, mas tenho muita dificuldade."],
  3:["Intermediário","Tenho uma base razoável."],
  4:["Bom","Tenho segurança na maior parte do conteúdo."],
  5:["Muito bom","Preciso principalmente revisar e consolidar."]
};

function bandFromMonths(months){
  const n=Number(months||0);
  if(!n)return"0";
  if(n<3)return"lt3";
  if(n<=6)return"3-6";
  if(n<=12)return"6-12";
  if(n<=24)return"12-24";
  return"24plus";
}

export default function OnboardingForm({subjects,bibliographyUnits=[],initial,initialProfile}){
  const pref=initialProfile?.preferences||{};
  const initialDays=new Set(initial?.study_days?.length?initial.study_days:[1,2,3,4,5,6]);
  const baseMinutes=Math.max(60,Number(initial?.daily_minutes||180));
  const initialByDay=pref?.daily_minutes_by_day&&typeof pref.daily_minutes_by_day==="object"?pref.daily_minutes_by_day:{};

  const [step,setStep]=useState(1);
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState("");
  const [experience,setExperience]=useState(initial?.experience_level||"beginner");
  const [startedBefore,setStartedBefore]=useState(initial?.started_before===true);
  const [monthsBand,setMonthsBand]=useState(bandFromMonths(initial?.months_studying));
  const [days,setDays]=useState(initialDays);
  const [dayMinutes,setDayMinutes]=useState(()=>Object.fromEntries(DAY_LABELS.map(([,d])=>[d,Number(initialByDay[d]||initialByDay[String(d)]||(initialDays.has(d)?baseMinutes:0))])));
  const [readingMinutes,setReadingMinutes]=useState(Number(initial?.reading_minutes_target||120));
  const [routineType,setRoutineType]=useState(pref?.routine_type||"fixed");
  const [studied,setStudied]=useState(new Set(initial?.studied_subjects||[]));
  const [studiedUnits,setStudiedUnits]=useState(new Set(initialProfile?.studied_units||[]));
  const [expanded,setExpanded]=useState(new Set());
  const [confidence,setConfidence]=useState(initial?.confidence_by_subject||{});
  const [questionLevel,setQuestionLevel]=useState(pref?.prior_question_level||"rarely");
  const [priorSimulations,setPriorSimulations]=useState(pref?.prior_simulations===true);
  const [accuracyBand,setAccuracyBand]=useState(pref?.prior_accuracy_band||"");
  const [missedStrategy,setMissedStrategy]=useState(pref?.missed_day_strategy||"redistribute_week");
  const [weekendCompensation,setWeekendCompensation]=useState(pref?.weekend_compensation!==false);
  const [notes,setNotes]=useState(initial?.notes||"");

  const grouped=useMemo(()=>{
    const bySubject={};
    for(const unit of bibliographyUnits){
      bySubject[unit.subject_slug]||={};
      bySubject[unit.subject_slug][unit.bibliography_key]||={title:unit.publication,units:[]};
      bySubject[unit.subject_slug][unit.bibliography_key].units.push(unit);
    }
    return bySubject;
  },[bibliographyUnits]);

  const monthValue=MONTH_BANDS.find(([key])=>key===monthsBand)?.[1]||0;
  const activeMinutes=[...days].map(d=>Number(dayMinutes[d]||0)).filter(Boolean);
  const averageDaily=activeMinutes.length?Math.round(activeMinutes.reduce((a,b)=>a+b,0)/activeMinutes.length):0;
  const weeklyMinutes=activeMinutes.reduce((a,b)=>a+b,0);
  const weakSubjects=[...subjects].sort((a,b)=>Number(confidence[a.slug]||1)-Number(confidence[b.slug]||1)).slice(0,3);
  const completedUnits=studiedUnits.size;

  function toggleSet(setter,current,value){
    const next=new Set(current);
    next.has(value)?next.delete(value):next.add(value);
    setter(next);
  }

  function toggleDay(day){
    const next=new Set(days);
    if(next.has(day)){
      next.delete(day);
      setDayMinutes(m=>({...m,[day]:0}));
    }else{
      next.add(day);
      setDayMinutes(m=>({...m,[day]:m[day]||baseMinutes}));
    }
    setDays(next);
  }

  function unitKey(unit){return `${unit.subject_slug}|${unit.bibliography_key}|${unit.section_key}`;}

  function togglePublication(subjectSlug,bibliographyKey,units){
    const keys=units.map(unitKey);
    const all=keys.every(k=>studiedUnits.has(k));
    const next=new Set(studiedUnits);
    keys.forEach(k=>all?next.delete(k):next.add(k));
    setStudiedUnits(next);
    if(!all)setStudied(s=>new Set([...s,subjectSlug]));
  }

  function canAdvance(){
    if(step===2)return days.size>0&&averageDaily>=30&&readingMinutes>=30;
    return true;
  }

  async function submit(){
    if(busy)return;
    setBusy(true);setMsg("");
    const body={
      experience_level:experience,
      started_before:startedBefore||experience!=="beginner"||monthValue>0,
      months_studying:monthValue,
      daily_minutes:averageDaily||60,
      reading_minutes_target:readingMinutes,
      daily_minutes_by_day:Object.fromEntries([...days].map(d=>[String(d),Number(dayMinutes[d]||averageDaily||60)])),
      routine_type:routineType,
      study_days:[...days].sort((a,b)=>a-b),
      studied_subjects:[...studied],
      studied_units:[...studiedUnits],
      confidence_by_subject:Object.fromEntries(subjects.map(s=>[s.slug,Number(confidence[s.slug]||1)])),
      prior_question_level:questionLevel,
      prior_simulations:priorSimulations,
      prior_accuracy_band:priorSimulations&&accuracyBand?accuracyBand:null,
      missed_day_strategy:missedStrategy,
      weekend_compensation:weekendCompensation,
      notes:String(notes||"").trim()
    };
    const r=await fetch("/api/study-plan/onboarding",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const j=await r.json().catch(()=>({}));
    setBusy(false);
    if(!r.ok){setMsg(j.error||"Não foi possível salvar.");return;}
    location.href="/plano-de-estudos";
  }

  return <div className={styles.form}>
    <div className={styles.progress}>
      {[1,2,3,4,5,6,7].map(n=><button type="button" key={n} onClick={()=>setStep(n)} className={step===n?styles.progressActive:step>n?styles.progressDone:""}><span>{step>n?"✓":n}</span><small>{["Ponto de partida","Rotina","Bibliografia","Domínio","Questões","Preferências","Diagnóstico"][n-1]}</small></button>)}
    </div>

    {step===1&&<section className={styles.block}>
      <div className={styles.blockTitle}><span>01</span><div><h2>Em que ponto você está?</h2><p>Isso evita que o plano trate um iniciante e um candidato avançado da mesma forma.</p></div></div>
      <div className={styles.options3}>
        {[
          ["beginner","Estou começando agora","Ainda não iniciei uma preparação estruturada para o PSCPP."],
          ["studying","Já comecei minha preparação","Já estudei parte da bibliografia e/ou resolvo questões."],
          ["advanced","Minha preparação é avançada","Já percorri boa parte do conteúdo e quero consolidar e revisar."]
        ].map(([value,title,desc])=><label key={value}><input type="radio" checked={experience===value} onChange={()=>setExperience(value)}/><span><b>{title}</b><small>{desc}</small></span></label>)}
      </div>
      <div className={styles.inlineFields}>
        <label><span>Já estudava para o PSCPP antes de entrar na ESTIBORDO?</span><select value={startedBefore?"yes":"no"} onChange={e=>setStartedBefore(e.target.value==="yes")}><option value="no">Não</option><option value="yes">Sim</option></select></label>
        <label><span>Há quanto tempo estuda especificamente para o PSCPP?</span><select value={monthsBand} onChange={e=>setMonthsBand(e.target.value)}>{MONTH_BANDS.map(([key,,label])=><option value={key} key={key}>{label}</option>)}</select></label>
      </div>
    </section>}

    {step===2&&<section className={styles.block}>
      <div className={styles.blockTitle}><span>02</span><div><h2>Quanto tempo realmente cabe na sua rotina?</h2><p>Defina seus dias e a disponibilidade de cada um. O plano usará a média semanal como carga-base e guardará o perfil diário para recalibrações.</p></div></div>
      <div className={styles.scheduleGrid}>
        {DAY_LABELS.map(([label,day])=><div className={`${styles.dayCard} ${days.has(day)?styles.dayCardActive:""}`} key={day}>
          <button type="button" onClick={()=>toggleDay(day)}><b>{label}</b><span>{days.has(day)?"Dia de estudo":"Sem estudo"}</span></button>
          {days.has(day)&&<select aria-label={`Tempo disponível ${label}`} value={dayMinutes[day]||120} onChange={e=>setDayMinutes(m=>({...m,[day]:Number(e.target.value)}))}>
            <option value="60">1h</option><option value="90">1h30</option><option value="120">2h</option><option value="150">2h30</option><option value="180">3h</option><option value="240">4h</option><option value="300">5h</option><option value="360">6h+</option>
          </select>}
        </div>)}
      </div>
      <div className={styles.inlineFields}>
        <label><span>Quanto desse período você consegue dedicar à leitura?</span><select value={readingMinutes} onChange={e=>setReadingMinutes(Number(e.target.value))}><option value="30">30 min</option><option value="60">1h</option><option value="90">1h30</option><option value="120">2h</option><option value="150">2h30</option><option value="180">3h</option><option value="240">4h</option></select></label>
        <label><span>Sua rotina costuma mudar?</span><select value={routineType} onChange={e=>setRoutineType(e.target.value)}><option value="fixed">Não, é relativamente fixa</option><option value="variable">Às vezes</option><option value="shift">Sim, trabalho por escala / embarque / turnos</option><option value="highly_variable">Minha disponibilidade varia muito</option></select></label>
        <div className={styles.metricMini}><span>Disponibilidade estimada</span><strong>{Math.round(weeklyMinutes/60*10)/10}h/semana</strong><small>Média de {averageDaily} min por dia ativo</small></div>
      </div>
    </section>}

    {step===3&&<section className={styles.block}>
      <div className={styles.blockTitle}><span>03</span><div><h2>O que você já estudou?</h2><p>Marque a matéria e, se quiser, detalhe exatamente as publicações e capítulos já concluídos. O plano não voltará ao início sem necessidade.</p></div></div>
      <div className={styles.subjectAccordion}>
        {subjects.map(subject=>{
          const works=Object.entries(grouped[subject.slug]||{});
          return <article key={subject.slug}>
            <div className={styles.subjectRow}>
              <label><input type="checkbox" checked={studied.has(subject.slug)} onChange={()=>toggleSet(setStudied,studied,subject.slug)}/><span><b>{subject.label}</b><small>{studied.has(subject.slug)?"Já iniciei esta matéria":"Ainda não iniciei"}</small></span></label>
              <button type="button" onClick={()=>toggleSet(setExpanded,expanded,subject.slug)}>{expanded.has(subject.slug)?"Ocultar capítulos":"Informar capítulos"}</button>
            </div>
            {expanded.has(subject.slug)&&<div className={styles.works}>
              {works.map(([workKey,work])=>{
                const all=work.units.length>0&&work.units.every(u=>studiedUnits.has(unitKey(u)));
                return <div className={styles.work} key={workKey}>
                  <header><div><b>{work.title}</b><small>{work.units.length} unidade(s) oficial(is)</small></div><button type="button" onClick={()=>togglePublication(subject.slug,workKey,work.units)}>{all?"Desmarcar obra":"Marcar obra"}</button></header>
                  <div>{work.units.map(unit=>{const key=unitKey(unit);return <label key={key}><input type="checkbox" checked={studiedUnits.has(key)} onChange={()=>{toggleSet(setStudiedUnits,studiedUnits,key);setStudied(s=>new Set([...s,subject.slug]));}}/><span><b>{unit.chapter||unit.section}</b><small>{unit.page_start&&unit.page_end?`p. ${unit.page_start}–${unit.page_end}`:unit.section}</small></span></label>})}</div>
                </div>;
              })}
            </div>}
          </article>;
        })}
      </div>
    </section>}

    {step===4&&<section className={styles.block}>
      <div className={styles.blockTitle}><span>04</span><div><h2>Como você avalia seu domínio hoje?</h2><p>É apenas o ponto de partida. Conforme você responde questões, a plataforma passa a priorizar seus dados reais.</p></div></div>
      <div className={styles.confidence}>{subjects.map(s=>{const value=Number(confidence[s.slug]||1);return <div key={s.slug}><div><span>{s.label}</span><small>{CONFIDENCE[value][0]} — {CONFIDENCE[value][1]}</small></div><div>{[1,2,3,4,5].map(v=><button type="button" title={`${CONFIDENCE[v][0]} — ${CONFIDENCE[v][1]}`} className={value===v?styles.selected:""} key={v} onClick={()=>setConfidence(c=>({...c,[s.slug]:v}))}>{v}</button>)}</div></div>})}</div>
    </section>}

    {step===5&&<section className={styles.block}>
      <div className={styles.blockTitle}><span>05</span><div><h2>Qual é sua experiência com questões e simulados?</h2><p>Esses dados servem apenas como referência inicial até a ESTIBORDO acumular desempenho suficiente da sua própria conta.</p></div></div>
      <div className={styles.choiceGrid}>
        {[["rarely","Nunca ou quase nunca"],["sometimes","Às vezes"],["frequent","Frequentemente"],["intensive","Tenho rotina intensa de questões"]].map(([value,label])=><button type="button" className={questionLevel===value?styles.choiceActive:""} key={value} onClick={()=>setQuestionLevel(value)}>{label}</button>)}
      </div>
      <div className={styles.inlineFields}>
        <label><span>Você já fez simulados completos?</span><select value={priorSimulations?"yes":"no"} onChange={e=>setPriorSimulations(e.target.value==="yes")}><option value="no">Não</option><option value="yes">Sim</option></select></label>
        {priorSimulations&&<label><span>Aproveitamento médio aproximado</span><select value={accuracyBand} onChange={e=>setAccuracyBand(e.target.value)}><option value="">Selecione</option><option value="below40">Abaixo de 40%</option><option value="40-59">40–59%</option><option value="60-69">60–69%</option><option value="70-79">70–79%</option><option value="80-89">80–89%</option><option value="90plus">90%+</option></select></label>}
      </div>
    </section>}

    {step===6&&<section className={styles.block}>
      <div className={styles.blockTitle}><span>06</span><div><h2>Como o plano deve reagir aos imprevistos?</h2><p>Defina o comportamento preferido quando sua rotina sair do previsto.</p></div></div>
      <div className={styles.options3}>
        {[
          ["redistribute_week","Redistribuir na mesma semana","O plano tenta absorver a tarefa nos próximos dias disponíveis."],
          ["next_available","Levar ao próximo dia livre","A tarefa migra para o próximo dia disponível."],
          ["no_overload","Não sobrecarregar","Mantém a carga dos próximos dias e recalcula o cronograma gradualmente."]
        ].map(([value,title,desc])=><label key={value}><input type="radio" checked={missedStrategy===value} onChange={()=>setMissedStrategy(value)}/><span><b>{title}</b><small>{desc}</small></span></label>)}
      </div>
      <label className={styles.switchLine}><input type="checkbox" checked={weekendCompensation} onChange={e=>setWeekendCompensation(e.target.checked)}/><span><b>Aceito sessões maiores no fim de semana para compensar a semana</b><small>O algoritmo poderá usar sábado/domingo quando esses dias estiverem marcados como disponíveis.</small></span></label>
    </section>}

    {step===7&&<section className={styles.block}>
      <div className={styles.blockTitle}><span>07</span><div><h2>Seu diagnóstico inicial</h2><p>Revise o perfil que será usado para gerar seu primeiro ciclo de estudos.</p></div></div>
      <div className={styles.diagnosticGrid}>
        <div><span>Perfil de preparação</span><strong>{experience==="beginner"?"Início estruturado":experience==="studying"?"Em desenvolvimento":"Preparação avançada"}</strong></div>
        <div><span>Disponibilidade</span><strong>{Math.round(weeklyMinutes/60*10)/10}h por semana</strong><small>{days.size} dia(s) ativo(s)</small></div>
        <div><span>Leitura</span><strong>{readingMinutes>=60?`${Math.floor(readingMinutes/60)}h${readingMinutes%60?"30":""}/dia`:`${readingMinutes} min/dia`}</strong></div>
        <div><span>Bibliografia já concluída</span><strong>{completedUnits} unidade(s)</strong><small>{studied.size} matéria(s) iniciada(s)</small></div>
        <div><span>Prioridades iniciais</span><strong>{weakSubjects.map(s=>s.label).join(" · ")}</strong><small>O desempenho real substituirá gradualmente a autoavaliação.</small></div>
        <div><span>Datas de referência</span><strong>15/07/2027</strong><small>Margem interna · limite 01/08/2027 · prova 01/11/2027</small></div>
      </div>
      <label className={styles.notes}><span>Há algo importante para o planejamento?</span><small>Embarques, escala, cursos, férias, viagens ou períodos sem disponibilidade.</small><textarea rows="4" value={notes} onChange={e=>setNotes(e.target.value)} maxLength={2000} placeholder="Ex.: embarco por 28 dias; estudo melhor à noite; tenho curso previsto em outubro..."/></label>
    </section>}

    <div className={styles.submitBar}>
      <div><strong>Etapa {step} de 7</strong><span>{step<7?"Suas respostas ficam nesta tela até a confirmação final.":"Pronto para gerar o primeiro plano personalizado."}</span></div>
      <div className={styles.submitActions}>
        {step>1&&<button type="button" className={styles.secondary} onClick={()=>setStep(s=>Math.max(1,s-1))}>Voltar</button>}
        {step<7?<button type="button" disabled={!canAdvance()} onClick={()=>setStep(s=>Math.min(7,s+1))}>Continuar</button>:<button type="button" disabled={busy||!days.size} onClick={submit}>{busy?"Gerando plano...":"Gerar meu plano inteligente"}</button>}
      </div>
    </div>
    {msg&&<p className={styles.message}>{msg}</p>}
  </div>;
}
