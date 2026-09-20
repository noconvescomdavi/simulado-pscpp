"use client";
import {useEffect,useMemo,useRef,useState} from "react";

const SHIPS=[
 {id:"V01",name:"ESTIBORDO ATLANTIC",type:"Panamax Container",loa:294,beam:32.2,draft:12.6,air:47.8,minU:1.25},
 {id:"V02",name:"GUANABARA STAR",type:"Post-Panamax Container",loa:335,beam:43,draft:13.2,air:51.4,minU:1.35},
 {id:"V03",name:"CARIOCA LNG",type:"LNG Carrier",loa:290,beam:46,draft:11.8,air:49.5,minU:1.30},
 {id:"V04",name:"ILHA FISCAL",type:"Aframax Tanker",loa:245,beam:42,draft:13.0,air:39.2,minU:1.30},
 {id:"V05",name:"MOCANGUE",type:"Chemical Tanker",loa:183,beam:32,draft:10.4,air:34.8,minU:1.10},
 {id:"V06",name:"RIO RO-RO",type:"Ro-Ro",loa:210,beam:32,draft:9.4,air:45.5,minU:1.00},
 {id:"V07",name:"CORCOVADO",type:"Bulk Carrier",loa:225,beam:32.3,draft:12.2,air:37.6,minU:1.20},
 {id:"V08",name:"PAO DE ACUCAR",type:"General Cargo",loa:175,beam:28,draft:9.8,air:31.5,minU:1.00},
 {id:"V09",name:"NITEROI HIGHWAY",type:"Car Carrier",loa:200,beam:32,draft:9.2,air:48.2,minU:1.00},
 {id:"V10",name:"TAMOIO",type:"Product Tanker",loa:190,beam:32,draft:11.1,air:33.4,minU:1.10}
];
const SCENARIOS=["Barra → TECON","Barra → Terminal GNL","Barra → Terminal Ro-Ro","Barra → Porto do Rio de Janeiro","Barra → Terminal Petroquímico","Barra → Fundeio 6A","Barra → Fundeio 7","Barra → Fundeio 8","Barra → Fundeio 9","Barra → Fundeio 10"];
const rand=(a,b)=>a+Math.random()*(b-a);
function pad(n){return String(n).padStart(2,"0")}
function fmtCoord(v,lat){const a=Math.abs(v),d=Math.floor(a),m=(a-d)*60;return `${d}° ${m.toFixed(3)}' ${lat?(v<0?"S":"N"):(v<0?"W":"E")}`}
export default function PracticalSimulator(){
 const [phase,setPhase]=useState("setup"),[ship,setShip]=useState(SHIPS[0]),[scenario,setScenario]=useState(SCENARIOS[0]);
 const [route,setRoute]=useState([]),[running,setRunning]=useState(false),[failed,setFailed]=useState(false),[alarms,setAlarms]=useState([]);
 const [state,setState]=useState({lat:-22.973,long:-43.139,hdg:340,cog:340,sog:7.0,stw:6.7,depth:19.2,tide:.72,windDir:105,wind:14,currentDir:248,current:.7,rudder:0,engine:"Half Ahead",xte:0,rot:0});
 const t=useRef(0);
 const date=useMemo(()=>{const d=new Date(2026,Math.floor(rand(0,12)),Math.floor(rand(1,25)),Math.floor(rand(0,24)),Math.floor(rand(0,60)));return d},[]);
 const squat=Math.max(0,(state.sog*state.sog)/180);
 const ukc=state.depth+state.tide-ship.draft-squat;
 function addWP(e){if(phase!=="plan")return;const r=e.currentTarget.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;setRoute(v=>[...v,{x,y}])}
 function begin(){if(route.length<2){setAlarms(a=>[{level:"WARNING",text:"Route incomplete — plot at least two waypoints"},...a]);return}setPhase("brief");}
 function execute(){setPhase("execute");setRunning(true)}
 function reset(){setPhase("setup");setRoute([]);setFailed(false);setAlarms([]);setRunning(false);t.current=0}
 useEffect(()=>{if(!running||failed)return;const id=setInterval(()=>{t.current++;setState(s=>{const r=s.rudder;const hdg=(s.hdg+r*.012+360)%360;const cr=hdg+Math.sin((s.currentDir-hdg)*Math.PI/180)*s.current*.8;const sp=Math.max(0,s.sog+({Stop:-.06,"Dead Slow Ahead":-.015,"Slow Ahead":0,"Half Ahead":.012,"Full Ahead":.025,"Dead Slow Astern":-.04}[s.engine]||0));const depth=Math.max(0,19.2-0.004*t.current*sp);return {...s,hdg,cog:(cr+360)%360,sog:Math.min(14,sp),stw:Math.max(0,sp-s.current*.25),depth,rot:r*.03,xte:Math.abs(Math.sin(t.current/70))*35}})},1000);return()=>clearInterval(id)},[running,failed]);
 useEffect(()=>{if(phase!=="execute")return;const next=[];if(ukc<ship.minU)next.push({level:ukc<=0?"CRITICAL":"WARNING",text:ukc<=0?"GROUNDING — MANOEUVRE FAILED":"LOW UKC — BELOW PLANNED MINIMUM"});if(state.xte>30)next.push({level:"WARNING",text:"OFF TRACK — XTE LIMIT EXCEEDED"});setAlarms(next);if(ukc<=0){setFailed(true);setRunning(false)}},[ukc,state.xte,phase,ship.minU]);
 return <main className="practical">
  <header className="practicalHead"><div><span>PSCPP · PROVA PRÁTICO-ORAL</span><h1>Simulado Prático Oral</h1></div><div className="phase">PLAN → BRIEF → EXECUTE → DEBRIEF</div></header>
  {phase==="setup"&&<section className="setup"><h2>Gerar avaliação</h2><p>Somente cartas DHN 1511, 1512 e 1515. O cenário usa uma data/hora simulada de 2026 e deverá ser alimentado pela tábua oficial da Ilha Fiscal.</p><div className="cards"><label>Navio<select value={ship.id} onChange={e=>setShip(SHIPS.find(x=>x.id===e.target.value))}>{SHIPS.map(x=><option key={x.id} value={x.id}>{x.id} · {x.type}</option>)}</select></label><label>Manobra<select value={scenario} onChange={e=>setScenario(e.target.value)}>{SCENARIOS.map(x=><option key={x}>{x}</option>)}</select></label></div><button onClick={()=>setPhase("plan")}>Abrir Planning Room</button></section>}
  {phase!=="setup"&&<div className="workspace">
   <section className="chart" onClick={addWP}><div className="chartGrid"/><div className="land land1"/><div className="land land2"/><div className="channel"/>{route.map((p,i)=><span key={i} className="wp" style={{left:`${p.x*100}%`,top:`${p.y*100}%`}}>{i+1}</span>)}{route.slice(1).map((p,i)=>{const a=route[i],dx=(p.x-a.x)*100,dy=(p.y-a.y)*100,len=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI;return <i key={i} className="leg" style={{left:`${a.x*100}%`,top:`${a.y*100}%`,width:`${len}%`,transform:`rotate(${ang}deg)`}}/>})}<div className="ownship" style={{transform:`rotate(${state.hdg}deg)`}}>▲</div><div className="chartLabel">DHN 1511 / 1512 / 1515 · TRAINING DISPLAY</div></section>
   <aside className="instruments"><div className="alarmBox">{failed?<b>GROUNDING<br/>MANOEUVRE FAILED</b>:alarms.length?alarms.map((a,i)=><b key={i}>{a.level} · {a.text}</b>):<span>NAVIGATION STATUS · NORMAL</span>}</div><div className="readouts"><Data k="HDG" v={state.hdg.toFixed(1)+"°"}/><Data k="COG" v={state.cog.toFixed(1)+"°"}/><Data k="SOG" v={state.sog.toFixed(1)+" kn"}/><Data k="STW" v={state.stw.toFixed(1)+" kn"}/><Data k="DEPTH" v={state.depth.toFixed(2)+" m"}/><Data k="TIDE" v={state.tide.toFixed(2)+" m"}/><Data k="UKC DYN" v={ukc.toFixed(2)+" m"}/><Data k="SQUAT" v={squat.toFixed(2)+" m"}/><Data k="XTE" v={state.xte.toFixed(0)+" m"}/><Data k="ROT" v={state.rot.toFixed(1)+"°/min"}/></div><div className="env"><b>ENVIRONMENT</b><span>{date.toLocaleString("pt-BR")} LT</span><span>Wind {state.windDir}° / {state.wind} kn</span><span>Current {state.currentDir}° / {state.current} kn</span><span>{fmtCoord(state.lat,true)}</span><span>{fmtCoord(state.long,false)}</span></div>
    {phase==="execute"&&<><div className="controls"><label>Rudder<input type="range" min="-35" max="35" value={state.rudder} onChange={e=>setState(s=>({...s,rudder:+e.target.value}))}/><span>{state.rudder<0?"PORT":state.rudder>0?"STBD":"MIDSHIPS"} {Math.abs(state.rudder)}°</span></label><label>Engine<select value={state.engine} onChange={e=>setState(s=>({...s,engine:e.target.value}))}>{["Stop","Dead Slow Ahead","Slow Ahead","Half Ahead","Full Ahead","Dead Slow Astern"].map(x=><option key={x}>{x}</option>)}</select></label></div><button onClick={()=>{setRunning(false);setPhase("debrief")}}>Finish manoeuvre</button></>}
   </aside>
   <section className="bottomPanel"><div><b>PILOT CARD</b><span>{ship.name} · {ship.type}</span><span>LOA {ship.loa} m · Beam {ship.beam} m</span><span>Draft {ship.draft} m · Air draft {ship.air} m</span></div><div><b>ASSIGNMENT</b><span>{scenario}</span><span>Charts: 1511 · 1512 · 1515</span><span>Minimum planned UKC: {ship.minU.toFixed(2)} m</span></div><div><b>PHASE</b><strong>{phase.toUpperCase()}</strong>{phase==="plan"&&<button onClick={begin}>Lock route & briefing →</button>}{phase==="brief"&&<button onClick={execute}>Briefing complete · Execute →</button>}{phase==="debrief"&&<button onClick={reset}>New assessment</button>}</div></section>
  </div>}
 </main>
}
function Data({k,v}){return <div><small>{k}</small><strong>{v}</strong></div>}