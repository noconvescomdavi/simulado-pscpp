"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {TaskEditor} from "./PlanControls";
import { studyTaskDisplay } from "../../lib/study-plan-bibliography-reference.mjs";
import s from "./study-dashboard.module.css";

const WEEK=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const KIND={reading:"Leitura",questions:"Questões de Fixação",review:"Revisão",simulado:"Simulado PSCPP"};
const toDate=v=>new Date(v+"T12:00:00Z");
const today=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const short=v=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",timeZone:"UTC"}).format(toDate(v));
const long=v=>new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(toDate(v));
const monthTitle=m=>new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric",timeZone:"UTC"}).format(toDate(m+"-15"));
function advanceMonth(m,n){const [year,month]=m.split("-").map(Number);return new Date(Date.UTC(year,month-1+n,1,12)).toISOString().slice(0,7)}
function Icon({name,size=20}){
 const base={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.9,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":true};
 return <svg {...base}>
  {name==="calendar"?<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/><path d="m9 15 2 2 4-4"/></>:
  name==="book"?<><path d="M12 6c-2.7-2-6-2.5-9-2v15c3-.5 6.3 0 9 2 2.7-2 6-2.5 9-2V4c-3-.5-6.3 0-9 2Z"/><path d="M12 6v15"/></>:
  name==="edit"?<><path d="m15 5 4 4M4 20l4.3-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z"/></>:
  name==="clock"?<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>:
  name==="check"?<path d="m5 12 4.5 4.5L19 7"/>:
  name==="settings"?<><path d="M10 3h4l.7 2.6 2 .9 2.4-1.3 2.8 3-1.5 2.3.1 2.2 1.5 2.2-2.8 3-2.4-1.3-2 .9L14 21h-4l-.7-2.6-2-.9-2.4 1.3-2.8-3 1.5-2.3-.1-2.2-1.5-2.2 2.8-3 2.4 1.3 2-.9L10 3Z"/><circle cx="12" cy="12" r="3"/></>:
  name==="repeat"?<><path d="m18 8 3 3-3 3M21 11H8a5 5 0 0 0-5 5M6 16l-3-3 3-3M3 13h13a5 5 0 0 0 5-5"/></>:
  name==="arrow"?<path d="m9 5 7 7-7 7"/>:
  name==="list"?<><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></>:
  name==="question"?<><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 1c0 2-3 2-3 5M12 18h.01"/></>:
  <path d="M12 3v18M3 12h18"/>}
 </svg>;
}
function taskStatus(task,day){
 if(task.status==="done")return {text:"Concluída",kind:"completed"};
 if(task.postponed_manually)return {text:"Postergada",kind:"postponed"};
 if(task.advanced_out_of_sequence)return {text:"Antecipada",kind:"delayed"};
 if(task.reprogrammed||day.iso<today())return {text:"Atrasada / reprogramada",kind:"delayed"};
 return {text:"Programada",kind:"planned"};
}
const labelFor=(task,subjects)=>subjects.find(x=>x.slug===task.subject)?.label||task.subject||"PSCPP";
const minutes=m=>{const n=Math.max(0,Math.round(Number(m)||0));return n>=60?Math.floor(n/60)+"h"+(n%60?String(n%60).padStart(2,"0"):""):n+" min"};
function dateCells(month){
 const [year,m]=month.split("-").map(Number),first=new Date(Date.UTC(year,m-1,1,12)),delta=(first.getUTCDay()+6)%7;
 const start=new Date(first);start.setUTCDate(start.getUTCDate()-delta);
 const total=Math.ceil((delta+new Date(Date.UTC(year,m,0,12)).getUTCDate())/7)*7;
 return Array.from({length:total},(_,i)=>{const x=new Date(start);x.setUTCDate(x.getUTCDate()+i);return x.toISOString().slice(0,10)});
}

export default function StudyDashboard({plan,week,initialDay,onOpenTask,onCompleteTask,onPostponeTask,busy,taskMessages}){
 const chosenStart=week.days.find(d=>d.iso===initialDay)||week.days.find(d=>d.iso===today())||week.days.find(d=>d.active)||week.days[0];
 const [selected,setSelected]=useState(chosenStart.iso);
 const [month,setMonth]=useState(chosenStart.iso.slice(0,7));
 const [monthDays,setMonthDays]=useState([]);
 const [loadingMonth,setLoadingMonth]=useState(false);
 const [monthError,setMonthError]=useState("");
 const [showMonth,setShowMonth]=useState(false);
 const [showEditor,setShowEditor]=useState(false);
 const [showQueue,setShowQueue]=useState(false);
 const [edited,setEdited]=useState(null);
 const calendarRef=useRef(null);
 useEffect(()=>{setSelected(chosenStart.iso);setMonth(chosenStart.iso.slice(0,7))},[week.start,initialDay]);
 useEffect(()=>{
  const controller=new AbortController();setLoadingMonth(true);setMonthError("");
  fetch("/api/study-plan/calendar?month="+month,{signal:controller.signal,cache:"no-store"})
   .then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error||"Falha ao carregar calendário");return data})
   .then(data=>{setMonthDays(data.days||[]);setLoadingMonth(false)})
   .catch(e=>{if(e.name!=="AbortError"){setMonthError(e.message);setLoadingMonth(false)}});
  return ()=>controller.abort();
 },[month]);
 const day=week.days.find(item=>item.iso===selected)||week.days[0];
 const dayTasks=day.active?day.tasks:[];
 const completed=dayTasks.filter(x=>x.status==="done").length;
 const percent=dayTasks.length?Math.round(completed/dayTasks.length*100):0;
 const weeklyTasks=week.days.flatMap(d=>d.tasks).filter(x=>!x.reprogrammed||x.postponed_manually);
 const weeklyDone=weeklyTasks.filter(x=>x.status==="done").length;
 const weeklyPct=weeklyTasks.length?Math.round(100*weeklyDone/weeklyTasks.length):0;
 const progress=plan.bibliography_progress||{done:0,total:0,percent:0};
 const subjects=plan.metrics.subjects||[];
 const monthMap=useMemo(()=>new Map(monthDays.map(d=>[d.date,d])),[monthDays]);
 // A fila não inventa tarefas de semanas ainda não abertas.
 const queue=week.days.flatMap(d=>d.active&&d.iso>day.iso?d.tasks.filter(t=>t.status!=="done").map(t=>({...t,forDate:d.iso})):[]).slice(0,4);
 const allQueue=week.days.flatMap(d=>d.active?d.tasks.filter(t=>t.status!=="done").map(t=>({...t,forDate:d.iso})):[]);
 function openCalendar(){setShowMonth(true)}
 function selectDate(date,offset){
  if(week.days.some(d=>d.iso===date)){setSelected(date);setShowMonth(false);return}
  if(offset===undefined||offset===null)return;
  window.location.assign("/plano-de-estudos?semana="+offset+"&dia="+date);
 }
 function openEditor(dayItem,task){setEdited({day:dayItem,task});setShowEditor(false)}
 const currentEditable=day.active&&day.iso>=today();
 function calendarMarkup(full=false){
  return <div className={full?s.monthCalendarFull:s.monthCalendar}>
   <div className={s.monthSwitch}>
    <button type="button" aria-label="Mês anterior" onClick={()=>setMonth(m=>advanceMonth(m,-1))}><Icon name="arrow" size={14}/></button>
    <strong>{monthTitle(month)}</strong>
    <button type="button" aria-label="Mês seguinte" onClick={()=>setMonth(m=>advanceMonth(m,1))}><Icon name="arrow" size={14}/></button>
   </div>
   <div className={s.monthGrid}>
    {["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map(t=><span className={s.weekday} key={t}>{t}</span>)}
    {dateCells(month).map(date=>{
      const info=monthMap.get(date);const own=week.days.find(d=>d.iso===date);
      const total=info?.total??own?.tasks.length??0,done=info?.done??own?.tasks.filter(t=>t.status==="done").length??0;
      const postponed=(info?.postponed??own?.tasks.filter(t=>t.postponed_manually).length??0)>0;
      const past=date<today();
      const tone=postponed?"postponed":total&&done===total?"completed":past&&done<total?"delayed":total?"planned":"none";
      const selectedDate=date===selected;
      return <button key={date} type="button" className={[s.calDay,date.slice(0,7)!==month?s.otherMonth:"",selectedDate?s.calSelected:""].join(" ")}
       onClick={()=>selectDate(date,info?.offset??(own?week.offset:null))}
       disabled={!info&&!own} aria-label={date+" · "+done+" de "+total+" tarefas"} aria-current={selectedDate?"date":undefined}>
       <span>{Number(date.slice(-2))}</span>{total>0&&<i className={s["tone_"+tone]}/>}
      </button>;
    })}
   </div>
   <div className={s.legend}>{[["Concluída","completed"],["Hoje","today"],["Programada","planned"],["Atrasada","delayed"],["Postergada","postponed"]].map(([title,tone])=><span key={title}><i className={s["tone_"+tone]}/>{title}</span>)}</div>
   {loadingMonth&&<p className={s.muted} role="status">Carregando mês...</p>}
   {monthError&&<p className={s.warning} role="alert">{monthError}</p>}
  </div>;
 }
 return <div data-study-dashboard className={s.dashboard}>
  <header className={s.topHeader}>
   <div className={s.heading}><div className={s.headingIcon}><Icon name="book" size={22}/></div><div><h1>Plano de Estudos Inteligente</h1><p>Seu planejamento personalizado para o PSCPP</p></div></div>
   <div className={s.topButtons}>
    <button type="button" className={s.primary} onClick={openCalendar}><Icon name="calendar" size={19}/>Ver Calendário</button>
    <button type="button" className={s.outline} onClick={()=>setShowEditor(true)}><Icon name="edit" size={19}/>Editar Plano</button>
    <a className={s.quiet} href="/plano-de-estudos/configurar"><Icon name="settings" size={19}/>Configurações</a>
   </div>
   <div className={s.overall}><div><strong>Progressão da bibliografia</strong><b>{progress.percent||0}%</b></div><div className={s.progressTrack}><i style={{width:(progress.percent||0)+"%"}}/></div><small>{progress.done||0} / {progress.total||0} seções concluídas</small></div>
  </header>
  <div className={s.dashboardColumns}>
   <div className={s.primaryColumn}>
    <div className={s.weekNavigation}>
     <a className={s.navButton} href={"/plano-de-estudos?semana="+Math.max(-8,week.offset-1)} aria-disabled={week.offset<=-8}><Icon name="arrow" size={15}/>Semana Anterior</a>
     <div className={s.weekHeadline}><h2>{short(week.start)} a {long(week.end).replace(/^.*?,\s*/,"")}</h2><p>{weeklyDone} de {weeklyTasks.length} atividades concluídas · Fase: {plan.phase.label}</p></div>
     <a className={s.navButton} href={"/plano-de-estudos?semana="+Math.min(80,week.offset+1)} aria-disabled={week.offset>=80}>Próxima Semana <Icon name="arrow" size={15}/></a>
    </div>
    <div className={s.weekStrip} aria-label="Escolha o dia da semana">
     {week.days.map(d=>{
      const done=d.tasks.filter(t=>t.status==="done").length,total=d.tasks.length;
      const completion=total?Math.round(done/total*100):0;
      return <button type="button" key={d.iso} onClick={()=>setSelected(d.iso)} aria-pressed={d.iso===day.iso}
       className={[s.weekDay,d.iso===day.iso?s.weekDaySelected:"",!d.active?s.weekDayOff:""].join(" ")}>
       <span>{WEEK[toDate(d.iso).getUTCDay()]}{d.iso===today()?" · Hoje":""}</span><b>{short(d.iso)}</b>
       <div><small>{total} {total===1?"atividade":"atividades"}</small><i className={s.dayRing} style={{"--progress":completion+"%",borderColor:completion===100?"#13ca8b":d.iso<today()?"#ed685a":"#26617c"}}/></div>
      </button>;
     })}
    </div>
    <section className={s.dayPanel}>
     <div className={s.dayPanelHead}><div><h2>{long(day.iso)}</h2>{day.iso===today()&&<span className={s.todayBadge}>Hoje</span>}</div><div className={s.dayCompletion}><span>{percent}% concluído</span><div className={s.progressTrack}><i style={{width:percent+"%"}}/></div><b>{completed}/{dayTasks.length}</b></div></div>
     {!day.active?<div className={s.empty}>Dia sem estudo programado. Utilize Configurações para alterar seus dias de estudo.</div>:dayTasks.length===0?<div className={s.empty}>Nenhuma atividade programada para este dia. Você pode adicionar uma em Editar Plano.</div>:
       <div className={s.taskList}>{dayTasks.map((task,i)=>{
        const key=day.iso+"|"+(task.display_key||task.key),tone=task.type==="reading"?"reading":task.type==="questions"?"questions":task.type==="review"?"review":"simulado";
        const status=taskStatus(task,day);
        const subject=labelFor(task,subjects),referenceDisplay=studyTaskDisplay(task);
        const hasBibliography=task.type==="reading"||task.type==="questions";
        const title=hasBibliography?referenceDisplay.title:task.type==="review"&&task.title==="Revisão"?"Prioridade: pontos com mais erros":task.title;
        const details=hasBibliography?referenceDisplay.details:task.description;
        return <article className={[s.taskCard,s["card_"+tone],task.status==="done"?s.taskCompleted:""].join(" ")} key={task.display_key||task.key}>
         <div className={s.taskLeading}><span className={s.taskNumber}>{i+1}</span><div className={s.taskIdentity}><span className={s.symbol}><Icon name={task.type==="reading"?"book":task.type==="questions"?"question":task.type==="review"?"repeat":"calendar"} size={29}/></span><div><small>{KIND[task.type]||"Atividade"}</small><strong>{subject}</strong></div></div></div>
         <div className={s.taskCenter}><div className={s.taskCore}><h3>{title}</h3><p>{details}</p></div>
          <div className={s.chips}><span>{task.type==="reading"?"Bibliografia":task.type==="questions"?"Banco de questões":task.type==="review"?"Revisão inteligente":"Simulado"}</span><span>{subject}</span>{referenceDisplay.publication&&<span title={referenceDisplay.publication}>{referenceDisplay.publication}</span>}{referenceDisplay.chapter_tag&&<span title={referenceDisplay.chapter_tag}>{referenceDisplay.chapter_tag}</span>}</div>
          <div className={s.taskActions}>
           <button type="button" className={s.openButton} onClick={()=>onOpenTask(day,task)}><Icon name="book" size={17}/>{task.type==="reading"?"Abrir Material":task.type==="questions"?"Abrir Questões":task.type==="review"?"Abrir Revisão":"Abrir Simulado"}</button>
           <button type="button" className={s.doneButton} disabled={task.status==="done"||busy===key} onClick={()=>onCompleteTask(day,task)}><Icon name="check" size={18}/>{task.status==="done"?"Concluída":"Marcar como Concluída"}</button>
           <button type="button" className={s.deferButton} disabled={task.status==="done"||busy===key||day.iso<today()} onClick={()=>onPostponeTask(day,task)}><Icon name="clock" size={17}/>Postergar</button>
          </div>
          {taskMessages[key]&&<small className={s.taskAlert} role="status">{taskMessages[key]}</small>}
         </div>
         <div className={s.taskRight}><span><Icon name="clock" size={16}/>~ {minutes(task.estimate_minutes||0)}</span><b className={s["status_"+status.kind]}>{status.text}</b><button type="button" onClick={()=>openEditor(day,task)} disabled={task.status==="done"||task.reprogrammed||day.iso<today()} className={s.tinyEdit} title="Editar atividade" aria-label={"Editar "+task.title}><Icon name="edit" size={15}/></button></div>
        </article>;
       })}</div>}
    </section>
    <section className={s.queuePanel}>
     <div className={s.sectionHeader}><h2>Próximas atividades na fila <span title="Mostra as próximas tarefas pendentes desta semana.">ⓘ</span></h2><button type="button" onClick={()=>setShowQueue(true)}>Ver Fila Completa</button></div>
     <div className={s.queueItems}>{queue.length?queue.map((t,i)=><button type="button" key={t.forDate+"|"+t.key} onClick={()=>setSelected(t.forDate)} className={s.queueItem}><i>{i+1}</i><span className={s["queue_"+(t.type||"review")]}><Icon name={t.type==="reading"?"book":t.type==="review"?"repeat":"question"} size={23}/></span><div><strong>{labelFor(t,subjects)}</strong><small title={studyTaskDisplay(t).title}>{studyTaskDisplay(t).title} · {short(t.forDate)}</small></div></button>):<p className={s.muted}>Não há próximas tarefas pendentes nesta semana.</p>}</div>
    </section>
   </div>
   <aside className={s.rightColumn}>
    <section className={s.sideCard} ref={calendarRef}><div className={s.sectionHeader}><h2>Calendário de Estudos</h2><button type="button" onClick={openCalendar}><Icon name="calendar" size={15}/>Ver Mês</button></div>{calendarMarkup()}</section>
    <section className={s.sideCard}><div className={s.sectionHeader}><h2>Atividades do dia {short(day.iso)}</h2><button type="button" onClick={()=>setShowEditor(true)} disabled={!currentEditable}><Icon name="edit" size={14}/>Editar Dia</button></div>
     <div className={s.dayCompact}>{dayTasks.map(task=><div key={task.display_key||task.key} className={[s.compactTask,s["card_"+(task.type||"reading")]].join(" ")}><div className={s.compactIcon}><Icon name={task.type==="reading"?"book":task.type==="questions"?"question":task.type==="review"?"repeat":"calendar"} size={20}/></div><div className={s.compactInfo}><strong>{KIND[task.type]||"Atividade"} – {labelFor(task,subjects)}</strong><small title={studyTaskDisplay(task).title}>{studyTaskDisplay(task).title}</small></div><span className={s.compactTime}><Icon name="clock" size={14}/>{minutes(task.estimate_minutes||0)}</span><b className={s["status_"+taskStatus(task,day).kind]}>{taskStatus(task,day).text}</b></div>)}{!dayTasks.length&&<p className={s.muted}>Sem atividades nesta data.</p>}</div>
    </section>
    <section className={s.sideCard}><div className={s.sectionHeader}><h2>Ações rápidas</h2></div><div className={s.quickActions}><button type="button" onClick={openCalendar}><Icon name="calendar" size={24}/><span><strong>Ver Calendário Completo</strong><small>Navegue por semanas e acompanhe atividades</small></span></button><button type="button" onClick={()=>setShowEditor(true)}><Icon name="edit" size={24}/><span><strong>Editar Plano de Estudos</strong><small>Personalize manualmente sua sequência</small></span></button></div></section>
   </aside>
  </div>
  {showMonth&&<div className={s.overlay} role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowMonth(false)}}><section className={s.dialog} role="dialog" aria-modal="true" aria-label="Calendário completo de estudos"><div className={s.dialogHeader}><div><small>SEU CRONOGRAMA</small><h2>Calendário completo de estudos</h2></div><button onClick={()=>setShowMonth(false)} aria-label="Fechar calendário">✕</button></div>{calendarMarkup(true)}<p className={s.muted}>Selecione um dia para abrir sua semana e consultar as atividades programadas.</p></section></div>}
  {showEditor&&<div className={s.overlay} role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowEditor(false)}}><section className={s.dialog} role="dialog" aria-modal="true" aria-label="Editar plano de estudos"><div className={s.dialogHeader}><div><small>PERSONALIZAÇÃO</small><h2>Editar Plano de Estudos</h2></div><button onClick={()=>setShowEditor(false)} aria-label="Fechar editor">✕</button></div><p className={s.muted}>Escolha uma atividade para editar ou adicione uma nova ao dia selecionado.</p><div className={s.editorEntries}>{week.days.filter(d=>d.active&&d.iso>=today()).map(d=><div key={d.iso}><div className={s.editorDate}><strong>{long(d.iso)}</strong><button type="button" onClick={()=>openEditor(d,{key:null,type:"reading",subject:subjects[0]?.slug||"arte-naval"})}>+ Adicionar</button></div>{d.tasks.filter(t=>t.status!=="done"&&!t.reprogrammed).map(t=><button type="button" className={s.editorTask} onClick={()=>openEditor(d,t)} key={t.key}>{KIND[t.type]} · {studyTaskDisplay(t).title}<Icon name="edit" size={15}/></button>)}</div>)}</div></section></div>}
  {showQueue&&<div className={s.overlay} role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowQueue(false)}}><section className={s.dialog} role="dialog" aria-modal="true" aria-label="Fila de atividades pendentes"><div className={s.dialogHeader}><div><small>FILA DE ESTUDOS</small><h2>Atividades pendentes da semana</h2></div><button onClick={()=>setShowQueue(false)} aria-label="Fechar fila">✕</button></div><div className={s.editorEntries}>{allQueue.map(t=><button key={t.forDate+"|"+t.key} className={s.editorTask} onClick={()=>{setSelected(t.forDate);setShowQueue(false)}}><span>{short(t.forDate)} · {KIND[t.type]} · {studyTaskDisplay(t).title}</span><Icon name="arrow" size={15}/></button>)}</div><a className={s.moreLink} href="/plano-de-estudos/pendencias">Ver pendências de outras semanas →</a></section></div>}
  {edited&&<TaskEditor plan={{...plan,week}} day={edited.day} task={edited.task} onClose={()=>setEdited(null)}/>}
 </div>;
}
