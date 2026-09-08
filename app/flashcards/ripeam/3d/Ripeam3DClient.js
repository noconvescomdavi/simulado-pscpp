"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import styles from "./ripeam-3d.module.css";
import RipeamThreeScene from "./RipeamThreeScene";

const SCENARIOS={
 power:{label:"Propulsão mecânica",rule:"23",vessel:"bulk-carrier",lights:[["Mastro","#fff2ba",225],["Bombordo","#ef3c4e",112.5],["Boreste","#35dc83",112.5],["Alcançado","#fff2ba",135]],shape:""},
 sail:{label:"Embarcação a vela",rule:"25",vessel:"sailboat",lights:[["Bombordo","#ef3c4e",112.5],["Boreste","#35dc83",112.5],["Alcançado","#fff2ba",135]],shape:""},
 towShort:{label:"Reboque ≤ 200 m",rule:"24",vessel:"tow-combo",lights:[["Mastro 1","#fff2ba",225],["Mastro 2","#fff2ba",225],["Reboque","#ffd34d",135],["Bombordo","#ef3c4e",112.5],["Boreste","#35dc83",112.5]],shape:""},
 fishing:{label:"Pesca",rule:"26",vessel:"fishing-vessel",lights:[["Circular encarnada","#ef3c4e",360],["Circular branca","#fff2ba",360],["Bombordo","#ef3c4e",112.5],["Boreste","#35dc83",112.5]],shape:"◆ ◆"},
 tow:{label:"Reboque > 200 m",rule:"24",vessel:"tow-combo",lights:[["Mastro 1","#fff2ba",225],["Mastro 2","#fff2ba",225],["Mastro 3","#fff2ba",225],["Reboque","#ffd34d",135]],shape:"◆"},
 nuc:{label:"Sem governo",rule:"27(a)",vessel:"bulk-carrier",lights:[["Circular encarnada","#ef3c4e",360],["Circular encarnada","#ef3c4e",360],["Bombordo","#ef3c4e",112.5],["Boreste","#35dc83",112.5]],shape:"● ●"},
 ram:{label:"Manobra restrita",rule:"27(b)",vessel:"bulk-carrier",lights:[["Circular encarnada","#ef3c4e",360],["Circular branca","#fff2ba",360],["Circular encarnada","#ef3c4e",360]],shape:"● ◆ ●"},
 dredgePort:{label:"Dragagem — obstrução a bombordo",rule:"27(d)",lights:[["RAM","#ef3c4e",360],["RAM","#fff2ba",360],["RAM","#ef3c4e",360],["Obstruído","#ef3c4e",360],["Obstruído","#ef3c4e",360],["Passagem","#35dc83",360],["Passagem","#35dc83",360]],shape:"● ◆ ●"},
 dredgeStbd:{label:"Dragagem — obstrução a boreste",rule:"27(d)",lights:[["RAM","#ef3c4e",360],["RAM","#fff2ba",360],["RAM","#ef3c4e",360],["Passagem","#35dc83",360],["Passagem","#35dc83",360],["Obstruído","#ef3c4e",360],["Obstruído","#ef3c4e",360]],shape:"● ◆ ●"},
 mine:{label:"Remoção de minas",rule:"27(f)",vessel:"mine-clearance",lights:[["Verde — tope","#35dc83",360],["Verde — lais BB","#35dc83",360],["Verde — lais BE","#35dc83",360]],shape:"● ● ●"},
 diving:{label:"Operação de mergulho",rule:"27(e)",lights:[["RAM","#ef3c4e",360],["RAM","#fff2ba",360],["RAM","#ef3c4e",360]],shape:"A"},
 cbd:{label:"Restrita pelo calado",rule:"28",lights:[["Circular encarnada","#ef3c4e",360],["Circular encarnada","#ef3c4e",360],["Circular encarnada","#ef3c4e",360]],shape:"▮"},
 pilot:{label:"Praticagem",rule:"29",vessel:"pilot-boat",lights:[["Circular branca","#fff2ba",360],["Circular encarnada","#ef3c4e",360],["Bombordo","#ef3c4e",112.5],["Boreste","#35dc83",112.5]],shape:""},
 anchor:{label:"Fundeada",rule:"30",vessel:"bulk-carrier",lights:[["Circular vante","#fff2ba",360],["Circular ré","#fff2ba",360]],shape:"●"},
 seaplane:{label:"Hidroavião",rule:"31",vessel:"seaplane",lights:[["Bombordo","#ef3c4e",112.5],["Boreste","#35dc83",112.5],["Branca","#fff2ba",135]],shape:""},
 aground:{label:"Encalhada",rule:"30(d)",vessel:"bulk-carrier",lights:[["Fundeio vante","#fff2ba",360],["Fundeio ré","#fff2ba",360],["Circular encarnada","#ef3c4e",360],["Circular encarnada","#ef3c4e",360]],shape:"● ● ●"}
};

const PRESETS={Bow:0,"22.5° BE":-22.5,Stbd:-90,Stern:180,Port:90,"22.5° BB":22.5};
const VESSEL_LABELS={"bulk-carrier":"Bulk carrier 3D","tow-combo":"Tugboat + barge 3D","sailboat":"Sailboat 3D","fishing-vessel":"Fishing vessel 3D","pilot-boat":"Pilot boat 3D","mine-clearance":"Mine-clearance vessel 3D","seaplane":"Hidroavião 3D"};

export default function Ripeam3DClient(){
 const [scenario,setScenario]=useState("power");
 const [yaw,setYaw]=useState(-24);
 const [pitch,setPitch]=useState(-8);
 const [night,setNight]=useState(true);
 const [zoom,setZoom]=useState(1);
 const [modelReady,setModelReady]=useState(false);
 const [editorScene,setEditorScene]=useState(null);
 const [showSectors,setShowSectors]=useState(false);
 const [quizMode,setQuizMode]=useState(false);
 const [revealed,setRevealed]=useState(false);
 const [compare,setCompare]=useState(false);
 const [compareScenario,setCompareScenario]=useState("anchor");
 const [selectedLight,setSelectedLight]=useState(null);
 const drag=useRef(null);
 const viewerRef=useRef(null);
 const s=SCENARIOS[scenario];

 useEffect(()=>{const q=new URLSearchParams(window.location.search);const k=q.get("scenario");if(k&&SCENARIOS[k])setScenario(k)},[]);
 useEffect(()=>{setModelReady(false);setRevealed(false);setSelectedLight(null)},[scenario]);
 useEffect(()=>{
   let alive=true,timer=null;
   const load=()=>fetch("/api/ripeam-3d/scenes?key="+encodeURIComponent(scenario),{cache:"no-store"})
     .then(r=>r.json()).then(j=>{if(alive)setEditorScene(j.scene?.config||null)})
     .catch(()=>{if(alive)setEditorScene(null)});
   load();
   timer=setInterval(load,5000);
   const onFocus=()=>load();
   window.addEventListener("focus",onFocus);
   return()=>{alive=false;if(timer)clearInterval(timer);window.removeEventListener("focus",onFocus)}
 },[scenario]);

 const stack=useMemo(()=>s.lights.map((x,i)=>({label:x[0],color:x[1],sector:x[2],top:72+i*34})),[s]);

 function down(e){drag.current={x:e.clientX,y:e.clientY,yaw,pitch};e.currentTarget.setPointerCapture?.(e.pointerId)}
 function move(e){if(!drag.current)return;setYaw(drag.current.yaw+(e.clientX-drag.current.x)*.45);setPitch(Math.max(-32,Math.min(18,drag.current.pitch-(e.clientY-drag.current.y)*.18)))}
 function up(){drag.current=null}
 function wheel(e){e.preventDefault();setZoom(z=>Math.max(.55,Math.min(1.9,z-(e.deltaY*.0012))))}
 async function fullscreen(){try{if(!document.fullscreenElement)await viewerRef.current?.requestFullscreen?.();else await document.exitFullscreen?.()}catch{}}

 return <>
   <header className={styles.hero}><div><a href="/flashcards/ripeam">← Voltar aos flashcards</a><span>ESTIBORDO · RIPEAM / COLREG</span><h1>Laboratório 3D de luzes e marcas</h1><p>Gire a embarcação, compare aspectos, visualize setores de luz, alterne dia/noite e treine reconhecimento em modo prova.</p></div></header>
   <section className={styles.lab}>
     <aside className={styles.scenarios}>{Object.entries(SCENARIOS).map(([k,v])=><button key={k} className={scenario===k?styles.active:""} onClick={()=>setScenario(k)}><b>{v.label}</b><small>Regra {v.rule}</small></button>)}</aside>

     <div className={styles.viewer} ref={viewerRef}>
       <div className={styles.controls}>
         <div className={styles.presetButtons}>{Object.keys(PRESETS).map(k=><button key={k} onClick={()=>setYaw(PRESETS[k])}>{k}</button>)}<button onClick={()=>{setYaw(-24);setPitch(-8);setZoom(1)}}>3D</button><button onClick={()=>setZoom(z=>Math.min(1.9,z+.12))}>＋</button><button onClick={()=>setZoom(z=>Math.max(.55,z-.12))}>−</button></div>
         <div className={styles.modeTools}>
           <button className={showSectors?styles.toolOn:""} onClick={()=>setShowSectors(v=>!v)}>◔ Setores</button>
           <button className={quizMode?styles.toolOn:""} onClick={()=>{setQuizMode(v=>!v);setRevealed(false)}}>? Prova</button>
           <button className={compare?styles.toolOn:""} onClick={()=>setCompare(v=>!v)}>⇄ Comparar</button>
           <button onClick={fullscreen}>⛶</button>
           <button className={styles.dayToggle} onClick={()=>setNight(v=>!v)}>{night?"☀ Dia":"☾ Noite"}</button>
         </div>
       </div>

       <div className={night?styles.sceneNight:styles.sceneDay} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={wheel}>
         <RipeamThreeScene scenario={scenario} vessel={s.vessel} yaw={yaw} pitch={pitch} zoom={zoom} night={night} editorScene={editorScene} showSectors={showSectors} onReady={setModelReady} />
         <div className={styles.skyGlow}/>
         <div className={styles.horizon}/>
         <div className={styles.water3d}><i/><i/><i/><i/><i/><i/></div>
         <div className={`${styles.world} ${modelReady&&s.vessel?styles.worldHidden:""}`} style={{transform:`scale(${zoom}) rotateX(${pitch}deg) rotateY(${yaw}deg)`}}>
           <div className={styles.shipBob}><div className={styles.hull}><i/><i/><i/></div><div className={styles.deckhouse}/><div className={styles.mast}/></div>
           {stack.map((l,i)=><span key={i} className={styles.light} style={{background:l.color,top:l.top,left:"50%"}} title={l.label}/>)}
           {s.shape&&<div className={styles.shape}>{s.shape}</div>}
         </div>

         {!modelReady&&s.vessel&&<div className={styles.loading3d}><b>Carregando modelo 3D real…</b><span>{VESSEL_LABELS[s.vessel]||"Modelo 3D"}</span></div>}
         {quizMode&&<div className={styles.quizOverlay}><span>MODO PROVA</span><h3>{revealed?s.label:"Identifique a condição"}</h3><p>{revealed?`Regra ${s.rule}`:"Analise luzes, marcas e aspecto antes de revelar."}</p><button onClick={()=>setRevealed(v=>!v)}>{revealed?"Ocultar":"Revelar resposta"}</button></div>}
         <div className={styles.dragHint}>Arraste para girar · roda do mouse para zoom · {Math.round(zoom*100)}%</div>
       </div>

       {compare&&<section className={styles.comparePanel}>
         <div className={styles.compareHead}><b>Comparação técnica</b><select value={compareScenario} onChange={e=>setCompareScenario(e.target.value)}>{Object.entries(SCENARIOS).map(([k,v])=><option key={k} value={k}>{v.label} · Regra {v.rule}</option>)}</select></div>
         <div className={styles.compareScene}><RipeamThreeScene scenario={compareScenario} vessel={SCENARIOS[compareScenario].vessel} yaw={yaw} pitch={pitch} zoom={Math.min(zoom,.95)} night={night} showSectors={showSectors} onReady={()=>{}} /></div>
       </section>}

       <footer className={styles.viewerFooter}><div><b>{quizMode&&!revealed?"Condição oculta":s.label}</b><span>{quizMode&&!revealed?"Modo prova":`Regra ${s.rule}`}</span></div><strong>Aspecto: {Math.round(((yaw%360)+360)%360)}° · {VESSEL_LABELS[s.vessel]||"modelo de treinamento"}</strong></footer>
     </div>

     <aside className={styles.lightList}><h2>Luzes / marcas</h2>{s.lights.map((x,i)=><button type="button" className={styles.lightInfo} key={i} onClick={()=>setSelectedLight({name:x[0],color:x[1],sector:x[2]})}><i style={{background:x[1]}}/><span><b>{x[0]}</b><small>{x[2]}° · clique para detalhes</small></span></button>)}{s.shape&&<div className={styles.shapeRow}><b>Marca diurna</b><strong>{s.shape}</strong></div>}</aside>
   </section>

   {selectedLight&&<section className={styles.inspectCard}><div><span>INSTRUTOR · LUZ SELECIONADA</span><h2>{selectedLight.name}</h2><p>Setor nominal de visibilidade: <b>{selectedLight.sector}°</b>. Ative “Setores” para relacionar a luz com o aspecto observado.</p></div><button onClick={()=>setSelectedLight(null)}>×</button></section>}

   <section className={styles.notes}><h2>Como usar no estudo</h2><p>Use Bow, Stern, Port, Stbd e os aspectos de 22,5° para memorizar a transição dos setores. Em “Comparar”, coloque duas condições lado a lado. Em “Prova”, o nome da condição fica oculto até você revelar a resposta.</p></section>
 </>;
}
