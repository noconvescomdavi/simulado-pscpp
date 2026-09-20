"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {stepVessel} from "../../lib/practical-simulator/physics";
import {navigationSafety} from "../../lib/practical-simulator/safety";
import {seededScenario} from "../../lib/practical-simulator/scenarios";
import {monitorRoute} from "../../lib/practical-simulator/navigation";
import {trainingDepthAt} from "../../lib/practical-simulator/bathymetry";\nimport {collisionRisk} from "../../lib/practical-simulator/traffic";\nimport {newTug,tugForce,TUG_POSITIONS} from "../../lib/practical-simulator/tugs";\nimport {anchoringStatus,cableForDepth} from "../../lib/practical-simulator/anchors";\nimport {commandLogEntry} from "../../lib/practical-simulator/bridge";\nimport {assessmentFailure} from "../../lib/practical-simulator/failure";

const SHIPS=[
{id:"V01",name:"ESTIBORDO ATLANTIC",type:"Panamax Container",loa:294,beam:32.2,draft:12.6,air:47.8,minU:1.25,block:.70},
{id:"V02",name:"GUANABARA STAR",type:"Post-Panamax Container",loa:335,beam:43,draft:13.2,air:51.4,minU:1.35,block:.72},
{id:"V03",name:"CARIOCA LNG",type:"LNG Carrier",loa:290,beam:46,draft:11.8,air:49.5,minU:1.30,block:.75},
{id:"V04",name:"ILHA FISCAL",type:"Aframax Tanker",loa:245,beam:42,draft:13.0,air:39.2,minU:1.30,block:.80},
{id:"V05",name:"MOCANGUE",type:"Chemical Tanker",loa:183,beam:32,draft:10.4,air:34.8,minU:1.10,block:.76},
{id:"V06",name:"RIO RO-RO",type:"Ro-Ro",loa:210,beam:32,draft:9.4,air:45.5,minU:1.00,block:.65},
{id:"V07",name:"CORCOVADO",type:"Bulk Carrier",loa:225,beam:32.3,draft:12.2,air:37.6,minU:1.20,block:.82},
{id:"V08",name:"PAO DE ACUCAR",type:"General Cargo",loa:175,beam:28,draft:9.8,air:31.5,minU:1.00,block:.72},
{id:"V09",name:"NITEROI HIGHWAY",type:"Car Carrier",loa:200,beam:32,draft:9.2,air:48.2,minU:1.00,block:.62},
{id:"V10",name:"TAMOIO",type:"Product Tanker",loa:190,beam:32,draft:11.1,air:33.4,minU:1.10,block:.78}
];
const SCENARIOS=["Barra → TECON","Barra → Terminal GNL","Barra → Terminal Ro-Ro","Barra → Porto do Rio de Janeiro","Barra → Terminal Petroquímico","Barra → Fundeio 6A","Barra → Fundeio 7","Barra → Fundeio 8","Barra → Fundeio 9","Barra → Fundeio 10"];
const ZOOMS=[15000,18000,22000,27000,34000,43000,55000,70000];
const BASE={lat:-22.94,lon:-43.15};
const fmtCoord=(v,lat)=>{const a=Math.abs(v),d=Math.floor(a),m=(a-d)*60;return `${d}° ${m.toFixed(3)}' ${lat?(v<0?"S":"N"):(v<0?"W":"E")}`};
function geoToScreen(p,view){const span=.22*(view.scale/55000),latSpan=span*.78;return{x:50+(p.lon-view.lon)/(span)*100,y:50+(view.lat-p.lat)/(latSpan)*100}}
function screenToGeo(x,y,view){const span=.22*(view.scale/55000),latSpan=span*.78;return{lat:view.lat-(y-.5)*latSpan,lon:view.lon+(x-.5)*span}}
export default function PracticalSimulator(){
 const [phase,setPhase]=useState("setup"),[ship,setShip]=useState(SHIPS[0]),[scenario,setScenario]=useState(SCENARIOS[0]);
 const [route,setRoute]=useState([]),[track,setTrack]=useState([]),[running,setRunning]=useState(false),[failed,setFailed]=useState(false),[alarms,setAlarms]=useState([]);\n const [tugs,setTugs]=useState([newTug(1,"PORT BOW"),newTug(2,"STBD QUARTER")]),[anchor,setAnchor]=useState({down:false,cableM:0}),[commands,setCommands]=useState([]),[failure,setFailure]=useState(null);\n const [traffic,setTraffic]=useState([{id:"AIS01",name:"FERRY 01",lat:-22.925,lon:-43.145,cog:90,sog:10},{id:"AIS02",name:"MERCHANT 02",lat:-22.955,lon:-43.12,cog:330,sog:7}]);
 const environment=useMemo(()=>seededScenario(151115121515),[]);
 const [state,setState]=useState({lat:-22.973,lon:-43.139,hdg:340,cog:340,sog:7,stw:6.7,depth:19.2,tide:.72,...environment,rudder:0,engine:"Half Ahead",xte:0,rot:0});
 const [view,setView]=useState({lat:BASE.lat,lon:BASE.lon,scale:55000,follow:true});
 const drag=useRef(null),t=useRef(0);
 const date=useMemo(()=>new Date(2026,2,18,13,27),[]);
 const risks=collisionRisk(state,traffic), safety=navigationSafety({state,ship,xte:state.xte,collisionRisk:risks.some(r=>r.range<.03)}), routeMon=monitorRoute(state,route);\n const anchorState=anchoringStatus({sog:state.sog,depth:state.depth,anchorDown:anchor.down,cableM:anchor.cableM});\n const log=(type,command)=>setCommands(v=>[commandLogEntry(type,command),...v].slice(0,30));
 const zoom=(dir)=>setView(v=>{const i=ZOOMS.indexOf(v.scale),n=Math.max(0,Math.min(ZOOMS.length-1,i+dir));return{...v,scale:ZOOMS[n]}});
 function addWP(e){if(phase!=="plan"||drag.current?.moved)return;const r=e.currentTarget.getBoundingClientRect();setRoute(v=>[...v,screenToGeo((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height,view)])}
 function begin(){if(route.length<2){setAlarms([{level:"WARNING",text:"ROUTE INCOMPLETE — PLOT AT LEAST TWO WAYPOINTS"}]);return}setPhase("brief")}
 function execute(){setPhase("execute");setRunning(true);setTrack([{lat:state.lat,lon:state.lon}])}
 function reset(){setPhase("setup");setRoute([]);setTrack([]);setFailed(false);setFailure(null);setAlarms([]);setRunning(false);setAnchor({down:false,cableM:0});setCommands([]);t.current=0}
 useEffect(()=>{if(view.follow&&phase==="execute")setView(v=>({...v,lat:state.lat,lon:state.lon}))},[state.lat,state.lon,view.follow,phase]);
 useEffect(()=>{if(!running||failed)return;const id=setInterval(()=>{t.current++;setState(s=>{const n=stepVessel(s,ship,1,tugForce(tugs)),m=monitorRoute(n,route),depth=trainingDepthAt(n.lat,n.lon);setTrack(q=>[...q.slice(-3599),{lat:n.lat,lon:n.lon}]);return{...n,xte:m.xte,depth}})},1000);setTraffic(v=>v.map(q=>stepVessel({...q,stw:q.sog,hdg:q.cog,current:0,currentDir:0,rudder:0,engine:"Half Ahead"},ship,1)))},1000);return()=>clearInterval(id)},[running,failed,ship,route,tugs]);
 useEffect(()=>{if(phase!=="execute")return;setAlarms(safety.alarms.map(a=>({level:a.severity.toUpperCase(),text:a.message})));if(safety.disqualified){setFailure(assessmentFailure(safety.criticalCode,new Date(),state));setFailed(true);setRunning(false)}},[phase,safety.disqualified,safety.criticalCode,state.xte,safety.ukc]);
 const pt=p=>geoToScreen(p,view);
 return <main className="practical">
  <header className="practicalHead"><div><span>PSCPP · PROVA PRÁTICO-ORAL</span><h1>Simulado Prático Oral</h1></div><div className="phase">PLAN → BRIEF → EXECUTE → DEBRIEF</div></header>
  {phase==="setup"?<section className="setup"><h2>Gerar avaliação</h2><p>Chartplotter de treinamento PSCPP · cartas DHN 1511, 1512 e 1515.</p><div className="cards"><label>Navio<select value={ship.id} onChange={e=>setShip(SHIPS.find(x=>x.id===e.target.value))}>{SHIPS.map(x=><option key={x.id} value={x.id}>{x.id} · {x.type}</option>)}</select></label><label>Manobra<select value={scenario} onChange={e=>setScenario(e.target.value)}>{SCENARIOS.map(x=><option key={x}>{x}</option>)}</select></label></div><button onClick={()=>setPhase("plan")}>Abrir Planning Room</button></section>:
  <div className="workspace">
   <section className="chart" onClick={addWP} onWheel={e=>{e.preventDefault();zoom(e.deltaY>0?1:-1)}} onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,lat:view.lat,lon:view.lon,moved:false};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(!drag.current)return;const r=e.currentTarget.getBoundingClientRect(),dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;if(Math.hypot(dx,dy)>4)drag.current.moved=true;const span=.22*(view.scale/55000);setView(v=>({...v,follow:false,lon:drag.current.lon-dx/r.width*span,lat:drag.current.lat+dy/r.height*span*.78}))}} onPointerUp={()=>setTimeout(()=>drag.current=null,0)}>
    <div className="chartGrid"/><div className="land land1"/><div className="land land2"/><div className="channel"/>
    {route.map((p,i)=>{const q=pt(p);return <span key={i} className="wp" style={{left:q.x+"%",top:q.y+"%"}}>{i+1}</span>})}
    {route.slice(1).map((p,i)=>{const a=pt(route[i]),b=pt(p),dx=b.x-a.x,dy=b.y-a.y;return <i key={i} className="leg" style={{left:a.x+"%",top:a.y+"%",width:Math.hypot(dx,dy)+"%",transform:`rotate(${Math.atan2(dy,dx)*180/Math.PI}deg)`}}/>})}
    {track.slice(1).map((p,i)=>{const a=pt(track[i]),b=pt(p),dx=b.x-a.x,dy=b.y-a.y;return <i key={"t"+i} className="trackLeg" style={{left:a.x+"%",top:a.y+"%",width:Math.hypot(dx,dy)+"%",transform:`rotate(${Math.atan2(dy,dx)*180/Math.PI}deg)`}}/>})}
    {traffic.map(a=>{const q=pt(a);return <div key={a.id} className="aisTarget" style={{left:q.x+"%",top:q.y+"%",transform:`translate(-50%,-50%) rotate(${a.cog}deg)`}} title={a.name}>◆</div>})}
    <div className="ownship" style={{left:pt(state).x+"%",top:pt(state).y+"%",transform:`translate(-50%,-50%) rotate(${state.hdg}deg)`}}>▲</div>
    <div className="chartTools"><button onClick={e=>{e.stopPropagation();zoom(-1)}}>＋</button><button onClick={e=>{e.stopPropagation();zoom(1)}}>−</button><button className={view.follow?"active":""} onClick={e=>{e.stopPropagation();setView(v=>({...v,lat:state.lat,lon:state.lon,follow:true}))}}>◎</button></div>
    <div className="scaleBox">1:{view.scale.toLocaleString("pt-BR")} · {view.scale<=18000?"0.2":view.scale<=34000?"0.5":"1"} NM</div><div className="chartLabel">DHN 1511 / 1512 / 1515 · TRAINING DISPLAY</div>
   </section>
   <aside className="instruments"><div className="alarmBox">{failed?<b>CRITICAL · MANOEUVRE FAILED</b>:alarms.length?alarms.map((a,i)=><b key={i}>{a.level} · {a.text}</b>):<span>NAVIGATION STATUS · NORMAL</span>}</div><div className="readouts"><Data k="HDG" v={state.hdg.toFixed(1)+"°"}/><Data k="COG" v={state.cog.toFixed(1)+"°"}/><Data k="SOG" v={state.sog.toFixed(1)+" kn"}/><Data k="STW" v={state.stw.toFixed(1)+" kn"}/><Data k="DEPTH" v={state.depth.toFixed(2)+" m"}/><Data k="TIDE" v={state.tide.toFixed(2)+" m"}/><Data k="UKC DYN" v={safety.ukc.toFixed(2)+" m"}/><Data k="SQUAT" v={safety.squat.toFixed(2)+" m"}/><Data k="XTE" v={state.xte.toFixed(0)+" m"}/><Data k="DTG" v={(routeMon.remaining/1852).toFixed(2)+" nm"}/><Data k="ROT" v={state.rot.toFixed(1)+"°/min"}/></div><div className="env"><b>ENVIRONMENT</b><span>{date.toLocaleString("pt-BR")} LT</span><span>Wind {state.windDir}° / {state.wind} kn</span><span>Current {state.currentDir}° / {state.current} kn</span><span>{fmtCoord(state.lat,true)}</span><span>{fmtCoord(state.lon,false)}</span></div>
   {phase==="execute"&&<><div className="controls"><label>Rudder<input type="range" min="-35" max="35" value={state.rudder} onChange={e=>setState(s=>({...s,rudder:+e.target.value}))}/><span>{state.rudder<0?"PORT":state.rudder>0?"STBD":"MIDSHIPS"} {Math.abs(state.rudder)}°</span></label><label>Engine<select value={state.engine} onChange={e=>setState(s=>({...s,engine:e.target.value}))}>{["Full Astern","Half Astern","Slow Astern","Dead Slow Astern","Stop","Dead Slow Ahead","Slow Ahead","Half Ahead","Full Ahead"].map(x=><option key={x}>{x}</option>)}</select></label></div>
   <div className="bridgeOps"><b>TUGS</b>{tugs.map((g,i)=><div className="tugRow" key={g.id}><button onClick={()=>{setTugs(v=>v.map((x,j)=>j===i?{...x,connected:!x.connected}:x));log("TUG",g.connected?`LET GO ${g.name}`:`MAKE FAST ${g.name}`)}}>{g.connected?"LET GO":"MAKE FAST"}</button><select value={g.position} onChange={e=>setTugs(v=>v.map((x,j)=>j===i?{...x,position:e.target.value}:x))}>{TUG_POSITIONS.map(p=><option key={p}>{p}</option>)}</select><select value={g.mode} onChange={e=>setTugs(v=>v.map((x,j)=>j===i?{...x,mode:e.target.value}:x))}><option>PUSH</option><option>PULL</option></select><input disabled={!g.connected} type="range" min="0" max="100" value={g.power} onChange={e=>setTugs(v=>v.map((x,j)=>j===i?{...x,power:+e.target.value}:x))}/><small>{g.power}% · {g.bp}t BP</small></div>)}
   <b>ANCHOR</b><div className="anchorRow"><button onClick={()=>{if(!anchor.down){const cbl=cableForDepth(state.depth);setAnchor({down:true,cableM:cbl.metres});log("ANCHOR","LET GO PORT ANCHOR")}else{setAnchor({down:false,cableM:0});log("ANCHOR","HEAVE UP PORT ANCHOR")}}}>{anchor.down?"HEAVE UP":"LET GO PORT"}</button><span>{anchor.down?`${(anchor.cableM/27.5).toFixed(1)} shackles · ${anchorState.status}`:"ANCHOR READY"}</span></div>
   </div><button onClick={()=>{setRunning(false);setPhase("debrief")}}>Finish manoeuvre</button></>}</aside>
   <section className="bottomPanel"><div><b>PILOT CARD</b><span>{ship.name} · {ship.type}</span><span>LOA {ship.loa} m · Beam {ship.beam} m</span><span>Draft {ship.draft} m · Air draft {ship.air} m</span></div><div><b>ASSIGNMENT</b><span>{scenario}</span><span>Charts: 1511 · 1512 · 1515</span><span>Minimum planned UKC: {ship.minU.toFixed(2)} m</span></div><div><b>PHASE</b><strong>{phase.toUpperCase()}</strong>{phase==="plan"&&<button onClick={begin}>Lock route & briefing →</button>}{phase==="brief"&&<button onClick={execute}>Briefing complete · Execute →</button>}{phase==="debrief"&&<button onClick={reset}>New assessment</button>}</div></section>
  </div>}
 </main>
}
function Data({k,v}){return <div><small>{k}</small><strong>{v}</strong></div>}