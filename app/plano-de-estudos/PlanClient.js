"use client";
import {useMemo,useState} from "react";
import styles from "./plano.module.css";

const dayNames=["DOM","SEG","TER","QUA","QUI","SEX","SÁB"];

function fmtDate(value){
  return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit"}).format(new Date(value+"T12:00:00"));
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
  const radar=useMemo(()=>radarPoints(plan.metrics.subjects),[plan.metrics.subjects]);

  async function updateTask(day,task){
    if(task.status==="done")return;
    const key=day.iso+"|"+task.key;
    setBusy(key);setMessage("");
    const body={
      kind:"task",
      plan_date:day.iso,
      task_key:task.key,
      task_type:task.type,
      subject_slug:task.subject,
      status:"done",
      bibliography_key:task.bibliography_key||null,
      section_key:task.section_key||null,
      page_from:task.page_from||null,
      page_to:task.page_to||null,
      metadata:{
        title:task.title,
        description:task.description,
        href:task.href||null,
        target_questions:task.target_questions||null,
        fixation:task.fixation||null,
        bibliography_key:task.bibliography_key||null,
        section_key:task.section_key||null,
        page_from:task.page_from||null,
        page_to:task.page_to||null
      }
    };

    const r=await fetch("/api/study-plan/task",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const data=await r.json().catch(()=>({}));
    setBusy("");
    if(!r.ok){setMessage(data.error||"Não foi possível marcar a tarefa como feita.");return}

    const completedAt=data.item?.completed_at||new Date().toISOString();
    setWeek(w=>({...w,days:w.days.map(d=>d.iso!==day.iso?d:{...d,tasks:d.tasks.map(t=>t.key!==task.key?t:{...t,status:"done",completed_at:completedAt})})}));

    if(task.type==="reading"&&data.bibliography?.progress){
      const bp=data.bibliography.progress;
      setBibliography(items=>items.map(x=>x.bibliography_key===bp.bibliography_key&&x.section_key===bp.section_key?{...x,progress:bp}:x));
    }
  }

  async function markBibliographyDone(item){
    if(item.progress?.status==="done")return;
    const key="bib|"+item.bibliography_key+"|"+item.section_key;
    setBusy(key);setMessage("");
    const r=await fetch("/api/study-plan/task",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        kind:"bibliography",
        bibliography_key:item.bibliography_key,
        section_key:item.section_key,
        subject_slug:item.subject_slug,
        status:"done"
      })
    });
    const data=await r.json().catch(()=>({}));
    setBusy("");
    if(!r.ok){setMessage(data.error||"Não foi possível atualizar a bibliografia.");return}
    const bp=data.progress||{...(item.progress||{}),status:"done"};
    setBibliography(list=>list.map(x=>x.bibliography_key===item.bibliography_key&&x.section_key===item.section_key?{...x,progress:bp}:x));
  }

  const totalTasks=week.days.flatMap(d=>d.tasks).length;
  const doneTasks=week.days.flatMap(d=>d.tasks).filter(t=>t.status==="done").length;
  const weeklyPercent=totalTasks?Math.round(doneTasks/totalTasks*100):0;
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
          <div><b>{plan.first_pass.margin_days===null?"—":plan.first_pass.margin_days+" dias"}</b><small>margem projetada</small></div>
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
        <div className={styles.priorityList}>{plan.weighted_subjects.map((s,i)=><div key={s.slug}><b>{i+1}</b><div><strong>{s.label}</strong><span>{s.questions} respondidas · {s.correct} acertos · {s.errors} erros</span></div><em>{s.accuracy}%</em></div>)}</div>
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
          {!day.active?<p>Dia sem estudo programado.</p>:day.tasks.map(task=>{
            const key=day.iso+"|"+task.key;
            const done=task.status==="done";
            return <div className={done?styles.taskDone:styles.task} key={task.key}>
              <div className={styles.taskMeta}><span>{task.type.toUpperCase()}</span><em>{task.type==="reading"?(task.pages?task.pages+" páginas":"capítulo/seção"):task.type==="questions"?(task.fixation?"todas disponíveis":(task.target_questions||"")+" questões"):task.type==="simulado"?"simulado":"revisão"}</em></div>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <div className={styles.taskActions}>
                {task.type!=="reading"&&<a href={task.href}>Abrir →</a>}
                <button disabled={busy===key||done} onClick={()=>updateTask(day,task)}>{busy===key?"Salvando...":done?"✓ Feito":"Feito"}</button>
              </div>
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
                <button disabled={busy===key||done} onClick={()=>markBibliographyDone(item)}>{busy===key?"Salvando...":done?"✓ Feito":"Feito"}</button>
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
