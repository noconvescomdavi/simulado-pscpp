"use client";
import {useState} from "react";
import styles from "./StudyActivityPanel.module.css";

const MONTHS=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const WEEKDAYS=["D","S","T","Q","Q","S","S"];
const WEEKDAY_NAMES=["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
const STATE_LABELS={
  none:"Sem registro",future:"Data futura",rest:"Folga prevista",unmeasured:"Atividade sem tempo mensurado",
  short:"Menos de 15 minutos registrados",qualified:"15 a 59 minutos",
  high:"1 a 1h59 de estudo", "very-high":"2 horas ou mais"
};
const LEGEND=[
  ["none","Sem registro"],["unmeasured","Atividade sem tempo"],
  ["short","Até 14 min"],["qualified","15–59 min"],["high","1–2 h"],
  ["very-high","2 h ou mais"],["rest","Folga"]
];
function dateISO(year,month,day){
  return year+"-"+String(month).padStart(2,"0")+"-"+String(day).padStart(2,"0");
}
function formatDuration(seconds){
  const minutes=Math.floor(Math.max(0,Number(seconds)||0)/60);
  if(Number(seconds)>0&&minutes===0)return "menos de 1 min";
  if(minutes<60)return minutes+" min";
  return Math.floor(minutes/60)+"h "+String(minutes%60).padStart(2,"0")+"min";
}
function formatDay(iso){
  return new Intl.DateTimeFormat("pt-BR",{timeZone:"UTC",day:"numeric",month:"long",year:"numeric"}).format(new Date(iso+"T12:00:00Z"));
}
function dayLabel(iso,day){
  const weekday=new Date(iso+"T12:00:00Z").getUTCDay();
  const status=STATE_LABELS[day.state]||STATE_LABELS.none;
  return WEEKDAY_NAMES[weekday]+", "+formatDay(iso)+": "+status+
    (day.seconds>0?", "+formatDuration(day.seconds):"")+
    (day.activity_count>0?", "+day.activity_count+" atividade(s)":"");
}

export default function StudyActivityPanel({data}){
  const [year,setYear]=useState(Number(data.today.slice(0,4)));
  const [selected,setSelected]=useState(data.today);
  if(!data.available){
    return <section className={styles.panel} aria-labelledby="activity-title">
      <div className={styles.heading}><div><span className={styles.eyebrow}>TRAJETÓRIA DO ALUNO</span><h2 id="activity-title">Ritmo de estudos</h2></div></div>
      <p className={styles.note}>Os dados de sessões ainda não estão disponíveis. O painel atual de desempenho permanece inalterado.</p>
    </section>;
  }
  const source=data.days||{};
  const visibleYear=Math.max(data.years[0],Math.min(data.years[data.years.length-1],year));
  const yearDays=Object.entries(source).filter(([day])=>day.startsWith(String(visibleYear))&&day<=data.today);
  const yearSeconds=yearDays.reduce((total,[,row])=>total+row.seconds,0);
  const qualified=yearDays.filter(([,row])=>row.seconds>=data.min_study_seconds).length;
  const activityDays=yearDays.filter(([,row])=>row.seconds>0||row.activity_count>0).length;
  const restDays=yearDays.filter(([,row])=>row.rest&&row.seconds<data.min_study_seconds).length;
  const monthSeconds=MONTHS.map((_,month)=>{
    const prefix=dateISO(visibleYear,month+1,1).slice(0,7);
    return yearDays.reduce((total,[iso,row])=>total+(iso.startsWith(prefix)?row.seconds:0),0);
  });
  const maxMonth=Math.max(1,...monthSeconds);
  const focus=source[selected]||{state:"none",seconds:0,sessions:0,activity_count:0,rest:false,future:true};

  function changeYear(direction){
    const next=visibleYear+direction;
    if(!data.years.includes(next))return;
    setYear(next);
    setSelected(next===Number(data.today.slice(0,4))?data.today:next+"-12-31");
  }
  return <section className={styles.panel} aria-labelledby="activity-title" id="ritmo-de-estudos">
    <div className={styles.heading}>
      <div>
        <span className={styles.eyebrow}>ESTIBORDO • TRAJETÓRIA</span>
        <h2 id="activity-title">Ritmo de estudos</h2>
        <p>Constância, tempo efetivo e calendário de atividades no PSCPP.</p>
      </div>
      <a className={styles.planLink} href="/plano-de-estudos">◫ Plano de Estudos</a>
    </div>

    <div className={styles.summary} aria-label="Resumo do ano selecionado">
      <div><span>DIAS COM ATIVIDADE</span><strong>{activityDays}</strong><small>{visibleYear}</small></div>
      <div><span>TEMPO REGISTRADO</span><strong>{formatDuration(yearSeconds)}</strong><small>sessões com duração</small></div>
      <div><span>DIAS COM 15 MIN OU MAIS</span><strong>{qualified}</strong><small>meta mínima</small></div>
      <div><span>SEQUÊNCIA COM TEMPO</span><strong>{data.streak} dias</strong><small>melhor: {data.longest} dias</small></div>
    </div>

    <div className={styles.analytics}>
      <article className={styles.chartCard}>
        <div className={styles.cardHeading}><h3>◷ Produtividade mensal</h3><span>{visibleYear}</span></div>
        <p>Tempo registrado por mês, sem estimar minutos para atividades não cronometradas.</p>
        <div className={styles.chart} role="img" aria-label={"Produtividade de "+visibleYear+": "+MONTHS.map((m,i)=>m+" "+formatDuration(monthSeconds[i])).join("; ")}>
          {MONTHS.map((month,index)=><div className={styles.barColumn} key={month}>
            <div className={styles.barTrack} title={month+": "+formatDuration(monthSeconds[index])}>
              <div className={styles.bar} style={{height:(monthSeconds[index]>0?Math.max(3,monthSeconds[index]/maxMonth*100):0)+"%"}}/>
            </div>
            <span>{month}</span>
          </div>)}
        </div>
        <small className={styles.chartFooter}>Total no ano: <b>{formatDuration(yearSeconds)}</b></small>
      </article>

      <article className={styles.chartCard}>
        <div className={styles.cardHeading}><h3>◎ Dia selecionado</h3><span>{selected===data.today?"HOJE":"HISTÓRICO"}</span></div>
        <strong className={styles.selectedDate}>{formatDay(selected)}</strong>
        <p className={styles.selectedStatus}>{STATE_LABELS[focus.state]||STATE_LABELS.none}</p>
        <div className={styles.dayDetails}>
          <div><span>Tempo</span><strong>{formatDuration(focus.seconds)}</strong></div>
          <div><span>Sessões</span><strong>{focus.sessions}</strong></div>
          <div><span>Atividades</span><strong>{focus.activity_count}</strong></div>
          <div><span>Folga</span><strong>{focus.rest?"Prevista":"Não"}</strong></div>
        </div>
        <small className={styles.chartFooter}>Atividades podem ter sido registradas sem cronômetro. Apenas sessões com duração integram as horas.</small>
      </article>
    </div>

    <article className={styles.calendarCard}>
      <div className={styles.calendarTop}>
        <div><h3>◫ Calendário de estudos</h3><p>Selecione um dia para consultar os registros.</p></div>
        <div className={styles.yearControls} aria-label="Navegar entre anos">
          <button type="button" disabled={visibleYear===data.years[0]} onClick={()=>changeYear(-1)} aria-label="Ano anterior">‹</button>
          <strong>{visibleYear}</strong>
          <button type="button" disabled={visibleYear===data.years[data.years.length-1]} onClick={()=>changeYear(1)} aria-label="Próximo ano">›</button>
        </div>
      </div>
      <div className={styles.monthGrid}>
        {MONTHS.map((month,index)=>{
          const daysInMonth=new Date(Date.UTC(visibleYear,index+1,0,12)).getUTCDate();
          const offset=new Date(Date.UTC(visibleYear,index,1,12)).getUTCDay();
          return <div className={styles.month} key={month}>
            <div className={styles.monthTitle}><strong>{month}</strong><span>{formatDuration(monthSeconds[index])}</span></div>
            <div className={styles.dayGrid}>
              {WEEKDAYS.map((name,day)=><span className={styles.weekday} key={day} title={WEEKDAY_NAMES[day]}>{name}</span>)}
              {Array.from({length:offset},(_,n)=><span className={styles.empty} key={"padding-"+n} aria-hidden="true"/>)}
              {Array.from({length:daysInMonth},(_,n)=>{
                const iso=dateISO(visibleYear,index+1,n+1);
                const entry=source[iso]||{state:"none",seconds:0,activity_count:0};
                return <button type="button" key={iso} title={dayLabel(iso,entry)}
                  aria-label={dayLabel(iso,entry)} aria-pressed={selected===iso}
                  className={[styles.day,styles[entry.state]||styles.none,selected===iso?styles.selected:""].filter(Boolean).join(" ")}
                  onClick={()=>setSelected(iso)}>{n+1}</button>;
              })}
            </div>
          </div>;
        })}
      </div>
      <div className={styles.legend} aria-label="Legenda do calendário">
        {LEGEND.map(([state,label])=><span key={state}><i className={styles[state]||styles.none} aria-hidden="true"/>{label}</span>)}
        <span className={styles.restCount}>Folgas previstas até hoje: {restDays}</span>
      </div>
    </article>
    <p className={styles.disclaimer}>O calendário considera o horário de Brasília. Dias com pelo menos 15 minutos registrados qualificam a sequência; folgas da agenda do aluno e indisponibilidades programadas não a interrompem. As sessões são agrupadas pela data de início. O indicador de sequência anterior do painel, baseado em atividades, permanece preservado.</p>
  </section>;
}
