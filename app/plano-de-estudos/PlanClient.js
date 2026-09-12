"use client";
import {useEffect,useMemo,useState} from "react";
import styles from "./plano.module.css";
import {startTrackedStudySession,stopTrackedStudySession} from "../components/StudySessionTracker";
import {queueStudyTask} from "../../lib/offline-store";

const dayNames=["DOM","SEG","TER","QUA","QUI","SEX","SÁB"];

function fmtDate(value){
  return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit"}).format(new Date(value+"T12:00:00"));
}

function todayIso(){
  return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
}

function radarPoints(subjects){
  const cx=120,cy=120,r=92,n=subjects.length;
  return subjects.map((s,i)=>{
    const a=(-Math.PI/2)+(i*2*Math.PI/n);
    const v=Math.max(0,Math.min(100,Number(s.accuracy||0)))/100;
    return [cx+Math.cos(a)*r*v,cy+Math.sin(a)*r*v];
  });
}

function polygon(points){return points.map(p=>p.join(",")).join(" ")}
function groupPublications(items){
  const map=new Map();
  for(const item of items){
    if(!map.has(item.bibliography_key))map.set(item.bibliography_key,{key:item.bibliography_key,publication:item.publication,source:item.source,items:[]});
    map.get(item.bibliography_key).items.push(item);
  }
  return [...map.values()];
}

export default function PlanClient({plan}){
  const [week,setWeek]=useState(plan.week);
  const [bibliography,setBibliography]=useState(plan.bibliography);
  const [busy,setBusy]=useState("");
  const [message,setMessage]=useState("");
  const [taskMessages,setTaskMessages]=useState({});
  const [unavailableOpen,setUnavailableOpen]=useState("");
  const radar=useMemo(()=>radarPoints(plan.metrics.subjects),[plan.metrics.subjects]);
  const today=todayIso();

  useEffect(()=>{
    if(plan.week?.snapshot_id||Number(plan.week?.offset||0)!==0)return;
    let cancelled=false;
    fetch("/api/study-plan/snapshot",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({week:Number(plan.week?.offset||0)})
    }).then(async r=>{
      if(r.ok||cancelled)return;
      const data=await r.json().catch(()=>({}));
      throw new Error(data.error||"Não foi possível preservar o planejamento desta semana.");
    }).catch(error=>{
      if(!cancelled)setMessage(error.message||"Não foi possível preservar o planejamento desta semana.");
    });
    return()=>{cancelled=true};
  },[plan.week?.offset,plan.week?.snapshot_id]);

  async function updateTask(day,task){
    if(task.status==="done")return;
    const planDate=task.source_plan_date||day.iso;
    const key=day.iso+"|"+(task.display_key||task.key);
    const completedAt=new Date().toISOString();
    const previousTask=task;

    setBusy(key);
    setMessage("");
    setTaskMessages(m=>({...m,[key]:"Salvando..."}));

    // Resposta visual imediata: o aluno vê o card concluído sem esperar a rede.
    setWeek(w=>({...w,days:w.days.map(d=>({...d,tasks:d.tasks.map(t=>{
      const sameSource=(t.source_plan_date||d.iso)===planDate&&t.key===task.key;
      const sameDisplay=d.iso===day.iso&&(t.display_key||t.key)===(task.display_key||task.key);
      return (sameSource||sameDisplay)?{...t,status:"done",completed_at:completedAt}:t;
    })}))}));

    const body={
      kind:"task",
      plan_date:planDate,
      task_key:task.key,
      task_type:task.type,
      subject_slug:task.subject,
      status:"done",
      bibliography_key:task.bibliography_key||null,
      section_key:task.section_key||null,
      page_from:task.page_from||null,
      page_to:task.page_to||null,
      complete_bibliography_unit:task.type==="reading"&&!(task.page_from&&task.page_to),
      metadata:{
        title:task.title,
        description:task.description,
        href:task.href||null,
        target_questions:task.target_questions||null,
        fixation:task.fixation||null,
        bibliography_key:task.bibliography_key||null,
        section_key:task.section_key||null,
        reprogrammed:task.reprogrammed===true,
        displayed_plan_date:day.iso,
        source_plan_date:planDate,
        page_from:task.page_from||null,
        page_to:task.page_to||null
      }
    };

    try{
      if(!navigator.onLine){
        await queueStudyTask(body);
        await stopTrackedStudySession().catch(()=>{});
        setTaskMessages(m=>({...m,[key]:"✓ Salvo no dispositivo · sincronização pendente"}));
        return;
      }
      const r=await fetch("/api/study-plan/task",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const data=await r.json().catch(()=>({}));
      if(!r.ok){
        const diagnostic=data?.diagnostic;
        const suffix=diagnostic?.stage
          ?" ["+diagnostic.stage+(diagnostic.sqlstate?"/"+diagnostic.sqlstate:"")+"]"
          :"";
        throw new Error((data.error||"Não foi possível marcar a tarefa como feita.")+suffix);
      }

      const savedAt=data.item?.completed_at||completedAt;
      setWeek(w=>({...w,days:w.days.map(d=>{
        const tasks=d.tasks
          // Uma cópia reprogramada representa apenas uma pendência em aberto.
          // Quando a tarefa-fonte é concluída, ela deixa de existir no calendário.
          .filter(t=>{
            const sameSource=(t.source_plan_date||d.iso)===planDate&&t.key===task.key;
            return !(t.reprogrammed&&sameSource);
          })
          .map(t=>{
            const sameSource=(t.source_plan_date||d.iso)===planDate&&t.key===task.key;
            const sameDisplay=d.iso===day.iso&&(t.display_key||t.key)===(task.display_key||task.key);
            return (sameSource||sameDisplay)?{...t,status:"done",completed_at:savedAt}:t;
          });
        return {...d,tasks};
      })}));

      const bp=data.bibliography?.progress||data.progress||null;
      if(task.type==="reading"&&bp){
        setBibliography(items=>items.map(x=>x.bibliography_key===bp.bibliography_key&&x.section_key===bp.section_key?{...x,progress:bp}:x));
      }

      await stopTrackedStudySession().catch(()=>{});
      setTaskMessages(m=>({...m,[key]:"✓ Tarefa concluída"}));
      setTimeout(()=>setTaskMessages(m=>{const n={...m};delete n[key];return n}),2200);
    }catch(error){
      if(!navigator.onLine || error instanceof TypeError){
        try{
          await queueStudyTask(body);
          await stopTrackedStudySession().catch(()=>{});
          setTaskMessages(m=>({...m,[key]:"✓ Salvo no dispositivo · sincronização pendente"}));
          return;
        }catch{}
      }
      // Reverte somente quando o servidor rejeita a alteração.
      setWeek(w=>({...w,days:w.days.map(d=>({...d,tasks:d.tasks.map(t=>{
        const sameDisplay=d.iso===day.iso&&(t.display_key||t.key)===(task.display_key||task.key);
        return sameDisplay?previousTask:t;
      })}))}));
      setTaskMessages(m=>({...m,[key]:error.message||"Falha ao salvar"}));
      setMessage(error.message||"Não foi possível marcar a tarefa como feita.");
    }finally{
      setBusy("");
    }
  }

  async function openTask(day,task){
    const href=task.href||"/plano-de-estudos";
    try{
      await startTrackedStudySession({
        task_key:task.key,
        subject_slug:task.subject||null,
        session_type:task.type||"study",
        plan_date:task.source_plan_date||day.iso,
        metadata:{title:task.title||null,reprogrammed:task.reprogrammed===true}
      });
    }catch(error){
      setMessage(error.message||"A sessão de estudo não pôde ser iniciada, mas você pode continuar.");
    }
    window.location.assign(href);
  }

  async function setUnavailable(day,reason,unavailable=true){
    const key="unavailable|"+day.iso;
    setBusy(key);setMessage("");
    try{
      const r=await fetch("/api/study-plan/unavailability",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({plan_date:day.iso,unavailable,reason})
      });
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||"Não foi possível atualizar o dia.");
      setWeek(w=>({...w,days:w.days.map(d=>d.iso===day.iso?{...d,unavailable:unavailable?{reason:reason||"other",note:null}:null}:d)}));
      setUnavailableOpen("");
      setMessage(unavailable?"Dia marcado como indisponível. As pendências serão redistribuídas conforme sua capacidade.":"Dia reativado no planejamento.");
    }catch(error){
      setMessage(error.message||"Não foi possível atualizar o dia.");
    }finally{setBusy("")}
  }

  async function markBibliographyDone(item){
    if(item.progress?.status==="done")return;
    const key="bib|"+item.bibliography_key+"|"+item.section_key;
    const body={kind:"bibliography",bibliography_key:item.bibliography_key,section_key:item.section_key,subject_slug:item.subject_slug,status:"done"};
    setBusy(key);setMessage("");
    const optimistic={...(item.progress||{}),status:"done",completed_at:new Date().toISOString()};
    setBibliography(list=>list.map(x=>x.bibliography_key===item.bibliography_key&&x.section_key===item.section_key?{...x,progress:optimistic}:x));
    try{
      if(!navigator.onLine){await queueStudyTask(body);setMessage("✓ Leitura salva no dispositivo · sincronização pendente.");return}
      const r=await fetch("/api/study-plan/task",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||"Não foi possível atualizar a bibliografia.");
      const bp=data.progress||optimistic;
      setBibliography(list=>list.map(x=>x.bibliography_key===item.bibliography_key&&x.section_key===item.section_key?{...x,progress:bp}:x));
    }catch(error){
      if(!navigator.onLine || error instanceof TypeError){await queueStudyTask(body);setMessage("✓ Leitura salva no dispositivo · sincronização pendente.");return}
      setBibliography(list=>list.map(x=>x.bibliography_key===item.bibliography_key&&x.section_key===item.section_key?{...x,progress:item.progress}:x));
      setMessage(error.message||"Não foi possível atualizar a bibliografia.");
    }finally{setBusy("")}
  }

  const plannedTasks=week.days.flatMap(d=>d.tasks).filter(t=>!t.reprogrammed);
  const totalTasks=plannedTasks.length;
  const doneTasks=plannedTasks.filter(t=>t.status==="done").length;
  const weeklyPercent=totalTasks?Math.round(doneTasks/totalTasks*100):0;
  const tracking=plan.tracking||{};
  const backlogCount=Number(tracking.backlog_count||0);
  const backlogMinutes=Number(tracking.backlog_minutes||0);
  const adherence=Number(tracking.adherence_percent??100);
  const healthLabel=tracking.schedule_health==="behind"?"Atrasado":tracking.schedule_health==="attention"?"Atenção":"Em dia";
  const bibliographyTotal=bibliography.length;
  const bibliographyDone=bibliography.filter(item=>item.progress?.status==="done").length;
  const bibliographyPercent=bibliographyTotal?Math.round(bibliographyDone/bibliographyTotal*100):0;

  return <main className={styles.page}>
    <section className={styles.hero}>
      <div>
        <span>PLANO DE ESTUDOS INTELIGENTE</span>
        <h1>Bibliografia completa antes da reta final</h1>
        <p>Até 01/08/2027, o objetivo é concluir pelo menos uma leitura de 100% da bibliografia exigida. De 02/08 até a prova, o plano entra em revisão pesada: questões, simulados, erros e releitura seletiva dos tópicos com pior desempenho.</p>
      </div>
      <div className={styles.heroStats}>
        <div><strong>{plan.days_left}</strong><span>dias até a prova</span></div>
        <div><strong>{plan.first_pass?.pending_sections??0}</strong><span>seções para 1ª leitura</span></div>
        <div><strong>{plan.readiness}%</strong><span>índice de prontidão</span></div>
        <div><strong>{bibliographyPercent}%</strong><span>bibliografia concluída</span></div>
      </div>
    </section>

    {message&&<div role="alert" className={styles.phaseBanner}><div><span>ATENÇÃO</span><strong>{message}</strong></div></div>}

    <section className={styles.trackingGrid}>
      <article><span>ADERÊNCIA · 30 DIAS</span><strong>{adherence}%</strong><small>{tracking.past_done||0} de {tracking.past_planned||0} metas concluídas</small></article>
      <article className={backlogCount?styles.trackingWarn:""}><span>PENDÊNCIAS</span><strong>{backlogCount}</strong><small>{backlogMinutes} min estimados em aberto</small></article>
      <article><span>CARGA DIÁRIA</span><strong>{tracking.daily_capacity_minutes||plan.onboarding?.daily_minutes||0} min</strong><small>capacidade configurada</small></article>
      <article><span>TEMPO REAL · HOJE</span><strong>{tracking.study_time?.today_minutes||0} min</strong><small>{tracking.study_time?.week_minutes||0} min nos últimos 7 dias</small></article>
      <article><span>DOMÍNIO ESTIMADO</span><strong>{Math.round(Number(tracking.overall_mastery||0))}%</strong><small>Mastery Score combinado por tópico</small></article>
      <article className={tracking.schedule_health==="behind"?styles.trackingDanger:tracking.schedule_health==="attention"?styles.trackingWarn:""}><span>SITUAÇÃO DO PLANO</span><strong>{healthLabel}</strong><small>{backlogCount?"redistribuição automática ativa":"cronograma sem pendências"}</small></article>
    </section>

    {backlogCount>0&&<section className={styles.backlogPanel}>
      <div className={styles.sectionHead}><div><span>BACKLOG INTELIGENTE</span><h2>Pendências preservadas e redistribuídas</h2><p>As tarefas continuam registradas na data original e são recolocadas gradualmente nos próximos dias, sem apagar o histórico nem sobrecarregar o cronograma.</p></div><strong>{backlogCount}</strong></div>
      <div className={styles.backlogList}>{(tracking.backlog||[]).slice(0,6).map(item=><div key={item.source_plan_date+"|"+item.key}><div><b>{item.title}</b><span>Original: {fmtDate(item.source_plan_date)} · ~{item.estimate_minutes} min</span></div><em>ATRASADA</em></div>)}</div>
    </section>}

    <section className={styles.phaseBanner}>
      <div><span>META DA 1ª PASSAGEM</span><strong>100% até 01/08/2027</strong>{plan.first_pass?.pages_per_reading_day&&<small> · média necessária: {plan.first_pass.pages_per_reading_day} páginas/dia de estudo</small>}</div>
    </section>

    <section className={styles.phaseBanner}>
      <div><span>FASE ATUAL</span><strong>{plan.phase.label}</strong></div>
      <div className={styles.phaseTrack}><i style={{width:Math.min(100,Math.max(5,100-(plan.days_left/430*100)))+"%"}}/></div>
      <a href="/plano-de-estudos/configurar">Recalibrar questionário</a>
    </section>

    <section className={styles.quantGrid}>
      <article>
        <span>ESTRATÉGIA DE LEITURA</span>
        <h2>Meta interna: 15/07/2027</h2>
        <p>O limite oficial da primeira passagem continua em <strong>01/08/2027</strong>. A diferença funciona como margem para atrasos e imprevistos.</p>
        <div className={styles.quantStats}>
          <div><b>{plan.first_pass.reading_minutes_target} min</b><small>capacidade de leitura/dia</small></div>
          <div><b>{plan.first_pass.pages_per_reading_day??"—"}</b><small>páginas/dia necessárias</small></div>
          <div><b>{plan.first_pass.actual_pages_per_reading_day??"—"}</b><small>ritmo real registrado</small></div>
          <div><b>{plan.first_pass.projected_finish?fmtDate(plan.first_pass.projected_finish):"—"}</b><small>previsão de término</small></div>
        </div>
      </article>
      <article>
        <span>INVENTÁRIO QUANTITATIVO</span>
        <h2>{plan.first_pass.known_pages_completed}/{plan.first_pass.known_pages_total||0} páginas conhecidas</h2>
        <p>{plan.first_pass.units_pending_pagination
          ?`${plan.first_pass.units_pending_pagination} capítulo(s)/seção(ões) ainda aguardam paginação conferida. Até isso ser preenchido, a previsão de páginas é provisória.`
          :"Toda a bibliografia cadastrada já possui paginação conferida."}</p>
        <div className={styles.quantStats}>
          <div><b>{plan.first_pass.known_pages_remaining}</b><small>páginas conhecidas restantes</small></div>
          <div><b>{plan.first_pass.units_with_pagination}</b><small>unidades paginadas</small></div>
          <div><b>{plan.first_pass.units_pending_pagination}</b><small>paginação pendente</small></div>
          <div><b>{plan.first_pass.margin_days===null?"—":plan.first_pass.margin_days+" dias"}</b><small>{plan.first_pass.on_track?"margem projetada · dentro do ritmo":"margem projetada · risco de atraso"}</small></div>
        </div>
      </article>
    </section>

    <section className={styles.topGrid}>
      <article className={styles.radarCard}>
        <div className={styles.cardHead}><div><span>RADAR PSCPP</span><h2>Desempenho por matéria</h2></div><strong>{plan.readiness}%</strong></div>
        <div className={styles.radarWrap}>
          <svg viewBox="0 0 240 240" role="img" aria-label="Radar de desempenho por matéria">
            {[1,.75,.5,.25].map(scale=>{
              const pts=plan.metrics.subjects.map((_,i)=>{const a=(-Math.PI/2)+(i*2*Math.PI/plan.metrics.subjects.length);return [120+Math.cos(a)*92*scale,120+Math.sin(a)*92*scale]});
              return <polygon key={scale} points={polygon(pts)} className={styles.radarGrid}/>;
            })}
            {plan.metrics.subjects.map((_,i)=>{const a=(-Math.PI/2)+(i*2*Math.PI/plan.metrics.subjects.length);return <line key={i} x1="120" y1="120" x2={120+Math.cos(a)*92} y2={120+Math.sin(a)*92} className={styles.radarGridLine}/>})}
            <polygon points={polygon(radar)} className={styles.radarArea}/>
          </svg>
          <div className={styles.radarLegend}>{plan.metrics.subjects.map(s=><div key={s.slug}><span>{s.label}</span><b>{s.accuracy}%</b><small>{s.questions} respostas</small></div>)}</div>
        </div>
      </article>

      <article className={styles.priorityCard}>
        <div className={styles.cardHead}><div><span>ADAPTAÇÃO</span><h2>Prioridades atuais</h2></div></div>
        <div className={styles.priorityList}>{plan.weighted_subjects.map((s,i)=><div key={s.slug}><b>{i+1}</b><div><strong>{s.label}</strong><span>{s.questions} respondidas · {s.errors} erros · domínio {Math.round(Number(s.mastery_score||0))}%</span></div><em>{s.accuracy}%</em></div>)}</div>
        <a className={styles.primaryAction} href="/treino-adaptativo">Começar Treino Adaptativo →</a>
      </article>
    </section>

    <section className={styles.calendar}>
      <div className={styles.sectionHead}>
        <div><span>PLANEJAMENTO SEMANAL</span><h2>{fmtDate(week.start)} a {fmtDate(week.end)}</h2><p>{doneTasks} de {totalTasks} tarefas concluídas · {weeklyPercent}%</p></div>
        <div className={styles.weekNav}>
          <a href={"/plano-de-estudos?semana="+(week.offset-1)}>← Semana anterior</a>
          {week.offset!==0&&<a href="/plano-de-estudos">Semana atual</a>}
          <a href={"/plano-de-estudos?semana="+(week.offset+1)}>Próxima semana →</a>
        </div>
      </div>
      <div className={styles.weekProgress}><i style={{width:weeklyPercent+"%"}}/></div>

      <div className={styles.daysGrid}>
        {week.days.map(day=><article className={day.active?styles.day:styles.dayOff} key={day.iso}>
          <header><span>{dayNames[new Date(day.iso+"T12:00:00").getDay()]}</span><strong>{fmtDate(day.iso)}</strong></header>
          {day.active&&day.iso===today&&<div className={styles.dayAvailability}>
            {day.unavailable?<><span>Dia indisponível</span><button type="button" disabled={busy==="unavailable|"+day.iso} onClick={()=>setUnavailable(day,null,false)}>Desfazer</button></>:<>
              <button type="button" onClick={()=>setUnavailableOpen(unavailableOpen===day.iso?"":day.iso)}>Não consegui estudar hoje</button>
              {unavailableOpen===day.iso&&<div className={styles.unavailableReasons}>
                <button onClick={()=>setUnavailable(day,"work")}>Trabalho</button>
                <button onClick={()=>setUnavailable(day,"onboard")}>Embarque</button>
                <button onClick={()=>setUnavailable(day,"rest")}>Descanso</button>
                <button onClick={()=>setUnavailable(day,"unexpected")}>Imprevisto</button>
                <button onClick={()=>setUnavailable(day,"other")}>Outro</button>
              </div>}
            </>}
          </div>}
          {!day.active?<p>Dia sem estudo programado.</p>:day.tasks.map(task=>{
            const key=day.iso+"|"+(task.display_key||task.key);
            const done=task.status==="done";
            const overdue=!done&&(task.reprogrammed||day.iso<new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()));
            return <div className={done?styles.taskDone:overdue?styles.taskOverdue:styles.task} key={task.display_key||task.key}>
              <div className={styles.taskMeta}><span>{task.type.toUpperCase()}</span><em>{task.reprogrammed?"REPROGRAMADA":overdue?"ATRASADA":task.type==="reading"?(task.pages?task.pages+" páginas":"capítulo/seção"):task.type==="questions"?(task.fixation?"todas disponíveis":(task.target_questions||"")+" questões"):task.type==="simulado"?"simulado":"revisão"}</em></div>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              {task.reason&&<details className={styles.taskWhy}><summary>Por que estou estudando isto?</summary><p>{task.reason}.</p></details>}
              <div className={styles.taskActions}>
                {task.href&&<button type="button" onClick={()=>openTask(day,task)}>Abrir e estudar →</button>}
                <button
                  type="button"
                  className={done?styles.doneButton:""}
                  aria-pressed={done}
                  disabled={busy===key}
                  onClick={()=>updateTask(day,task)}
                >{busy===key?"Salvando...":done?"✓ Feito":"Feito"}</button>
              </div>
              {taskMessages[key]&&<div className={done?styles.taskSaved:styles.taskError}>{taskMessages[key]}</div>}
            </div>
          })}
        </article>)}
      </div>
    </section>

    <section className={styles.bibliographySection}>
      <div className={styles.sectionHead}><div><span>MINHA BIBLIOGRAFIA</span><h2>Publicações, capítulos e páginas exigidas</h2><p>Livros parciais exibem somente os capítulos/seções cobrados. Paginação só aparece quando estiver conferida para a edição correta.</p></div><div className={styles.bibProgress}>{bibliographyDone}/{bibliographyTotal}</div></div>
      <div className={styles.bibliographyGrid}>
        {Object.entries(bibliography.reduce((acc,item)=>{(acc[item.subject_slug] ||= []).push(item);return acc},{})).map(([subject,items])=><article key={subject}>
          <h3>{plan.metrics.subjects.find(s=>s.slug===subject)?.label||subject}</h3>
          <div className={styles.publicationList}>{groupPublications(items).map(pub=><section className={styles.publication} key={pub.key}>
            <div className={styles.publicationHead}><strong>{pub.publication}</strong><small>{pub.source}</small></div>
            <div>{pub.items.map(item=>{
              const key="bib|"+item.bibliography_key+"|"+item.section_key;
              const done=item.progress?.status==="done";
              return <div className={done?styles.readDone:styles.readItem} key={item.bibliography_key+"|"+item.section_key}>
                <div><a href={"#"+item.bibliography_key+"-"+item.section_key}>{item.chapter||item.section}</a><span>{item.page_start&&item.page_end?`páginas ${item.page_start}–${item.page_end}`:"Paginação pendente de conferência"}</span></div>
                <button type="button" className={done?styles.doneButton:""} aria-pressed={done} disabled={busy===key} onClick={()=>markBibliographyDone(item)}>{busy===key?"Salvando...":done?"✓ Feito":"Feito"}</button>
              </div>
            })}</div>
          </section>)}</div>
        </article>)}
      </div>
    </section>

    <section className={styles.roadmap}>
      <div className={styles.sectionHead}><div><span>ATÉ A PROVA</span><h2>Macroplanejamento</h2></div></div>
      <div className={styles.phaseGrid}>{plan.phases.map((p,i)=><article className={p.label===plan.phase.label?styles.phaseActive:""} key={p.label}><span>FASE {i+1}</span><h3>{p.label}</h3><p>{p.from} → {p.to}</p><strong>{p.focus}</strong></article>)}</div>
    </section>
  </main>;
}
