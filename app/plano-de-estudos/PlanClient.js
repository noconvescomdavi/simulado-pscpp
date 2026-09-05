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

export default function PlanClient({plan}){
  const [week,setWeek]=useState(plan.week);
  const [bibliography,setBibliography]=useState(plan.bibliography);
  const [busy,setBusy]=useState("");
  const radar=useMemo(()=>radarPoints(plan.metrics.subjects),[plan.metrics.subjects]);

  async function updateTask(day,task,status){
    const key=day.iso+"|"+task.key; setBusy(key);
    const kind=task.type==="reading"?"bibliography":"task";
    const body=kind==="bibliography"
      ? {kind,bibliography_key:task.bibliography_key,section_key:task.section_key,subject_slug:task.subject,status}
      : {kind,plan_date:day.iso,task_key:task.key,task_type:task.type,subject_slug:task.subject,status};

    const r=await fetch("/api/study-plan/task",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    setBusy("");
    if(!r.ok)return;

    setWeek(w=>({...w,days:w.days.map(d=>d.iso!==day.iso?d:{...d,tasks:d.tasks.map(t=>t.key!==task.key?t:{...t,status})})}));
    if(kind==="bibliography"){
      setBibliography(items=>items.map(x=>x.bibliography_key===task.bibliography_key&&x.section_key===task.section_key?{...x,progress:{...(x.progress||{}),status}}:x));
    }
  }

  const totalTasks=week.days.flatMap(d=>d.tasks).length;
  const doneTasks=week.days.flatMap(d=>d.tasks).filter(t=>t.status==="done").length;
  const weeklyPercent=totalTasks?Math.round(doneTasks/totalTasks*100):0;

  return <main className={styles.page}>
    <section className={styles.hero}>
      <div>
        <span>PLANO DE ESTUDOS INTELIGENTE</span>
        <h1>Seu caminho até 01/11/2027</h1>
        <p>O plano combina bibliografia, leitura, questões, revisão e simulados. Ele é recalculado com base no que você responde e marca como concluído.</p>
      </div>
      <div className={styles.heroStats}>
        <div><strong>{plan.days_left}</strong><span>dias até a prova</span></div>
        <div><strong>{plan.readiness}%</strong><span>índice de prontidão</span></div>
        <div><strong>{plan.bibliography_progress.percent}%</strong><span>bibliografia concluída</span></div>
      </div>
    </section>

    <section className={styles.phaseBanner}>
      <div><span>FASE ATUAL</span><strong>{plan.phase.label}</strong></div>
      <div className={styles.phaseTrack}><i style={{width:Math.min(100,Math.max(5,100-(plan.days_left/430*100)))+"%"}}/></div>
      <a href="/plano-de-estudos/configurar">Recalibrar questionário</a>
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
            return <div className={task.status==="done"?styles.taskDone:styles.task} key={task.key}>
              <div className={styles.taskMeta}><span>{task.type.toUpperCase()}</span><em>{task.minutes} min</em></div>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <div className={styles.taskActions}>
                {task.type!=="reading"&&<a href={task.href}>Abrir →</a>}
                <button disabled={busy===key} onClick={()=>updateTask(day,task,task.status==="done"?"pending":"done")}>{task.status==="done"?"✓ Done":"Marcar Done"}</button>
              </div>
            </div>
          })}
        </article>)}
      </div>
    </section>

    <section className={styles.bibliographySection}>
      <div className={styles.sectionHead}><div><span>BIBLIOGRAFIA INTEGRADA</span><h2>Leituras e capítulos</h2><p>Marque Done quando concluir a leitura. O plano remove o item da fila e recalibra as semanas seguintes.</p></div><div className={styles.bibProgress}>{plan.bibliography_progress.done}/{plan.bibliography_progress.total}</div></div>
      <div className={styles.bibliographyGrid}>
        {Object.entries(bibliography.reduce((acc,item)=>{(acc[item.subject_slug] ||= []).push(item);return acc},{})).map(([subject,items])=><article key={subject}>
          <h3>{plan.metrics.subjects.find(s=>s.slug===subject)?.label||subject}</h3>
          <div>{items.map(item=><div className={item.progress?.status==="done"?styles.readDone:styles.readItem} key={item.bibliography_key+"|"+item.section_key}>
            <div><strong>{item.publication}</strong><span>{item.section}</span><small>{item.source}</small></div>
            <button onClick={async()=>{
              const status=item.progress?.status==="done"?"pending":"done";setBusy("bib|"+item.bibliography_key+"|"+item.section_key);
              await fetch("/api/study-plan/task",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:"bibliography",bibliography_key:item.bibliography_key,section_key:item.section_key,subject_slug:item.subject_slug,status})});
              setBusy("");setBibliography(list=>list.map(x=>x.bibliography_key===item.bibliography_key&&x.section_key===item.section_key?{...x,progress:{...(x.progress||{}),status}}:x));
            }}>{item.progress?.status==="done"?"✓ Done":"Done"}</button>
          </div>)}</div>
        </article>)}
      </div>
    </section>

    <section className={styles.roadmap}>
      <div className={styles.sectionHead}><div><span>ATÉ A PROVA</span><h2>Macroplanejamento</h2></div></div>
      <div className={styles.phaseGrid}>{plan.phases.map((p,i)=><article className={p.label===plan.phase.label?styles.phaseActive:""} key={p.label}><span>FASE {i+1}</span><h3>{p.label}</h3><p>{p.from} → {p.to}</p><strong>{p.focus}</strong></article>)}</div>
    </section>
  </main>;
}
