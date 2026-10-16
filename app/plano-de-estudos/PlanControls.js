"use client";
import {useEffect,useMemo,useState} from "react";
import styles from "./plan-enhancements.module.css";

const types={reading:"Leitura",questions:"Questões de Fixação",review:"Revisão",simulado:"Simulado PSCPP"};
const today=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const labelDate=s=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"long",year:"numeric"}).format(new Date(s+"T12:00:00"));
const moveMonth=(s,d)=>{const [y,m]=s.split("-").map(Number);return new Date(Date.UTC(y,m-1+d,1)).toISOString().slice(0,7)};
async function saveChange(body){
 const r=await fetch("/api/study-plan/customize",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||"Não foi possível salvar.");return data;
}
export function TaskEditor({plan,day,task,onClose}){
 const [kind,setKind]=useState(task.type),[subject,setSubject]=useState(task.subject||plan.metrics.subjects[0]?.slug||"");
 const [bib,setBib]=useState(task.bibliography_key||""),[section,setSection]=useState(task.section_key||"");
 const [from,setFrom]=useState(task.page_from??""),[to,setTo]=useState(task.page_to??"");
 const [quantity,setQuantity]=useState(task.target_questions||20),[minutes,setMinutes]=useState(task.estimate_minutes||45);
 const [saving,setSaving]=useState(false),[error,setError]=useState("");
 const publications=useMemo(()=>[...new Map(plan.bibliography.filter(x=>x.subject_slug===subject).map(x=>[x.bibliography_key,x.publication])).entries()],[plan.bibliography,subject]);
 const sections=plan.bibliography.filter(x=>x.bibliography_key===bib&&x.subject_slug===subject);
 const unit=sections.find(x=>x.section_key===section);
 function chooseSection(key){setSection(key);const u=sections.find(x=>x.section_key===key);setFrom(u?.page_start??"");setTo(u?.page_start==null?"":Math.min(Number(u.page_end||u.page_start),Number(u.page_start)+11))}
 async function submit(event){event.preventDefault();setSaving(true);setError("");try{
   await saveChange({action:task.key?"edit":"add",week:plan.week.offset,plan_date:day.iso,task_key:task.key||null,task_type:kind,subject_slug:subject,bibliography_key:bib,section_key:section,
     page_from:from===""?null:Number(from),page_to:to===""?null:Number(to),target_questions:Number(quantity),estimate_minutes:Number(minutes)});
   window.location.reload();
 }catch(e){setError(e.message);setSaving(false)}}
 return <div className={styles.shade} onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-plan-title">
   <header className={styles.dialogHead}><div><span>PLANEJAMENTO MANUAL</span><h2 id="edit-plan-title">{task.key?"Editar atividade":"Adicionar atividade"}</h2><p>{labelDate(day.iso)}</p></div><button aria-label="Fechar" onClick={onClose}>✕</button></header>
   <form className={styles.editForm} onSubmit={submit}>
    <label>Atividade<select value={kind} onChange={e=>setKind(e.target.value)}>{Object.entries(types).filter(([v])=>v!=="simulado"||task.type==="simulado").filter(([v])=>task.type!=="simulado"||v==="simulado").map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></label>
    <label>Disciplina<select value={subject} onChange={e=>{setSubject(e.target.value);setBib("");setSection("");setFrom("");setTo("")}}>{plan.metrics.subjects.map(x=><option key={x.slug} value={x.slug}>{x.label}</option>)}</select></label>
    {kind==="reading"&&<>
     <label>Obra da bibliografia<select required value={bib} onChange={e=>{setBib(e.target.value);setSection("");setFrom("");setTo("")}}><option value="">Selecionar obra...</option>{publications.map(([key,value])=><option key={key} value={key}>{value}</option>)}</select></label>
     <label>Capítulo ou seção<select required value={section} onChange={e=>chooseSection(e.target.value)}><option value="">Selecionar capítulo...</option>{sections.map(x=><option key={x.section_key} value={x.section_key}>{x.chapter||x.section}</option>)}</select></label>
     {unit&&<p className={styles.hint}>{unit.page_start==null?"Sem paginação cadastrada.":"Páginas cadastradas: "+unit.page_start+"–"+unit.page_end+" (máximo de 12 páginas por tarefa)."}</p>}
     <div className={styles.twoCols}><label>Página inicial<input type="number" disabled={unit?.page_start==null} min={unit?.page_start||1} max={unit?.page_end||99999} value={from} onChange={e=>setFrom(e.target.value)}/></label><label>Página final<input type="number" disabled={unit?.page_start==null} min={unit?.page_start||1} max={unit?.page_end||99999} value={to} onChange={e=>setTo(e.target.value)}/></label></div>
    </>}
    {kind==="questions"&&<label>Quantidade de questões<input type="number" min="10" max="300" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label>}
    {kind!=="simulado"&&<label>Duração estimada em minutos<input type="number" min="10" max="360" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label>}
    <p className={styles.hint}>Mudanças manuais não apagam conclusões anteriores. A edição pode alterar a cobertura planejada da bibliografia.</p>
    {error&&<p role="alert" className={styles.error}>{error}</p>}
    <footer className={styles.footer}><button type="button" onClick={onClose}>Cancelar</button><button className={styles.primary} disabled={saving||kind==="reading"&&(!bib||!section)} type="submit">{saving?"Salvando...":task.key?"Salvar alterações":"Adicionar atividade"}</button></footer>
   </form>
  </section>
 </div>
}
export function TaskExtraActions({plan,day,task}){
 const [editor,setEditor]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState("");
 const disabled=loading||task.status==="done"||(task.reprogrammed&&!task.postponed_manually);
 async function postpone(){if(!window.confirm("Postergar esta tarefa para o fim da fila global da categoria? As demais atividades pendentes serão antecipadas quando houver disponibilidade."))return;
  setLoading(true);setError("");try{await saveChange({action:"postpone",week:plan.week.offset,plan_date:day.iso,task_key:task.key,source_plan_date:task.source_plan_date||day.iso});window.location.reload()}catch(e){setError(e.message);setLoading(false)}}
 return <><div className={styles.extraButtons}><button disabled={disabled} className={styles.postpone} onClick={postpone}>{loading?"Aguarde...":"↻ Postergar"}</button><button disabled={disabled} onClick={()=>setEditor(true)}>✎ Editar</button></div>{error&&<p role="alert" className={styles.error}>{error}</p>}{editor&&<TaskEditor plan={plan} day={day} task={task} onClose={()=>setEditor(false)}/>}</>
}
export default function PlanControls({plan}){
 const [open,setOpen]=useState(false),[edit,setEdit]=useState(false),[month,setMonth]=useState(today().slice(0,7)),[days,setDays]=useState([]);
 const [addDate,setAddDate]=useState(plan.week.days.find(d=>d.active&&d.iso>=today())?.iso||plan.week.days.find(d=>d.active)?.iso||plan.week.start);
 const [loading,setLoading]=useState(false),[error,setError]=useState(""),[selected,setSelected]=useState(today()),[chosen,setChosen]=useState(null);
 useEffect(()=>{if(!open)return;const controller=new AbortController();setLoading(true);setError("");setDays([]);
 fetch("/api/study-plan/calendar?month="+month,{signal:controller.signal}).then(async r=>{const json=await r.json();if(!r.ok)throw new Error(json.error||"Falha no calendário");return json})
 .then(json=>{setDays(json.days||[]);setLoading(false)}).catch(e=>{if(e.name!=="AbortError"){setError(e.message);setLoading(false)}});return()=>controller.abort()},[open,month]);
 const map=new Map(days.map(d=>[d.date,d])),[year,numMonth]=month.split("-").map(Number),first=new Date(Date.UTC(year,numMonth-1,1)),start=new Date(first);
 start.setUTCDate(start.getUTCDate()-((start.getUTCDay()+6)%7));
 const count=Math.ceil((((first.getUTCDay()+6)%7)+new Date(Date.UTC(year,numMonth,0)).getUTCDate())/7)*7;
 const cells=Array.from({length:count},(_,i)=>{const d=new Date(start);d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10)});
 const selectedDay=map.get(selected);
 const available=plan.week.days.flatMap(day=>day.tasks.filter(task=>task.status!=="done"&&!task.reprogrammed).map(task=>({day,task})));
 return <section className={styles.controlBar}>
  <div className={styles.barHead}><div><span>PLANEJAMENTO PERSONALIZÁVEL</span><h2>Seu cronograma, no seu ritmo</h2><p>Visualize semanas e meses ou ajuste uma tarefa manualmente.</p></div>
   <div className={styles.barActions}><button className={styles.primary} onClick={()=>setOpen(v=>!v)}>▦ {open?"Ocultar Calendário":"Ver Calendário"}</button><button onClick={()=>setEdit(v=>!v)}>✎ {edit?"Fechar Editor":"Editar Plano"}</button></div></div>
  {edit&&<div className={styles.editChooser}><h3>Editar esta semana</h3><p>Selecione uma atividade pendente.</p><div className={styles.addRow}><label>Adicionar atividade no dia <select value={addDate} onChange={e=>setAddDate(e.target.value)}>{plan.week.days.filter(day=>day.active&&day.iso>=today()).map(day=><option key={day.iso} value={day.iso}>{labelDate(day.iso)}</option>)}</select></label><button disabled={!plan.week.days.some(d=>d.iso===addDate&&d.active&&d.iso>=today())} onClick={()=>setChosen({day:plan.week.days.find(d=>d.iso===addDate),task:{key:null,type:"reading",subject:plan.metrics.subjects[0]?.slug}})}>＋ Adicionar tarefa</button></div>
   <div className={styles.choiceGrid}>{available.map(({day,task})=><button key={day.iso+"|"+task.key} onClick={()=>setChosen({day,task})}><small>{day.iso.slice(8,10)+"/"+day.iso.slice(5,7)} · {types[task.type]}</small><strong>{task.title}</strong></button>)}</div>{!available.length&&<p>Não há tarefas pendentes nesta semana.</p>}</div>}
  {open&&<div className={styles.calendarPanel}>
   <div className={styles.monthHead}><button aria-label="Mês anterior" onClick={()=>setMonth(v=>moveMonth(v,-1))}>‹</button><h3>{new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(first)}</h3><button aria-label="Próximo mês" onClick={()=>setMonth(v=>moveMonth(v,1))}>›</button></div>
   <div className={styles.calendarGrid}>{["SEG","TER","QUA","QUI","SEX","SÁB","DOM"].map(s=><strong className={styles.weekName} key={s}>{s}</strong>)}
   {cells.map(date=>{const day=map.get(date),state=!day?"empty":day.total&&day.done===day.total?"done":date<today()&&day.done<day.total?"late":day.total?"planned":"free";
    return <button key={date} disabled={!day} onClick={()=>setSelected(date)} className={[styles.calendarCell,date.slice(0,7)!==month?styles.external:"",selected===date?styles.selected:""].join(" ")} aria-label={date}><b>{Number(date.slice(-2))}</b><i className={styles[state]||""}/><small>{day?.total?day.done+"/"+day.total:""}</small></button>})}</div>
   {loading&&<p className={styles.hint}>Carregando atividades...</p>}{error&&<p className={styles.error} role="alert">{error}</p>}
   <div className={styles.legend}><span>● Concluída</span><span>● Programada</span><span>● Atrasada</span></div>
   {selectedDay&&<div className={styles.selectedPanel}><h3>{labelDate(selected)}</h3><p>{selectedDay.done} de {selectedDay.total} atividades concluídas</p><div className={styles.selectedTasks}>{selectedDay.tasks.map(task=><div key={task.key}><strong>{types[task.type]}</strong><span>{task.title}</span><small>{task.status==="done"?"✓ Concluída":task.postponed?"Postergada":"Programada"}</small></div>)}</div><a href={"/plano-de-estudos?semana="+selectedDay.offset} className={styles.primary}>Abrir semana para editar →</a></div>}
  </div>}
  {chosen&&<TaskEditor plan={plan} day={chosen.day} task={chosen.task} onClose={()=>setChosen(null)}/>}
 </section>
}
