"use client";
import {useMemo,useRef,useState} from "react";
import styles from "./ripeam-3d.module.css";

const SCENARIOS={
 power:{label:"Propulsão mecânica",rule:"23",lights:[["Mastro","#fff2ba"],["Bombordo","#ef3c4e"],["Boreste","#35dc83"],["Alcançado","#fff2ba"]],shape:""},
 sail:{label:"Embarcação a vela",rule:"25",lights:[["Bombordo","#ef3c4e"],["Boreste","#35dc83"],["Alcançado","#fff2ba"]],shape:""},
 towShort:{label:"Reboque ≤ 200 m",rule:"24",lights:[["Mastro 1","#fff2ba"],["Mastro 2","#fff2ba"],["Reboque","#ffd34d"],["Bombordo","#ef3c4e"],["Boreste","#35dc83"]],shape:""},
 tow:{label:"Reboque > 200 m",rule:"24",lights:[["Mastro 1","#fff2ba"],["Mastro 2","#fff2ba"],["Mastro 3","#fff2ba"],["Reboque","#ffd34d"]],shape:"◆"},
 nuc:{label:"Sem governo",rule:"27(a)",lights:[["Circular","#ef3c4e"],["Circular","#ef3c4e"],["Bombordo","#ef3c4e"],["Boreste","#35dc83"]],shape:"● ●"},
 ram:{label:"Manobra restrita",rule:"27(b)",lights:[["Circular","#ef3c4e"],["Circular","#fff2ba"],["Circular","#ef3c4e"]],shape:"● ◆ ●"},
 dredgePort:{label:"Dragagem — obstrução a bombordo",rule:"27(d)",lights:[["RAM","#ef3c4e"],["RAM","#fff2ba"],["RAM","#ef3c4e"],["Obstruído","#ef3c4e"],["Obstruído","#ef3c4e"],["Passagem","#35dc83"],["Passagem","#35dc83"]],shape:"● ◆ ●"},
 dredgeStbd:{label:"Dragagem — obstrução a boreste",rule:"27(d)",lights:[["RAM","#ef3c4e"],["RAM","#fff2ba"],["RAM","#ef3c4e"],["Passagem","#35dc83"],["Passagem","#35dc83"],["Obstruído","#ef3c4e"],["Obstruído","#ef3c4e"]],shape:"● ◆ ●"},
 mine:{label:"Remoção de minas",rule:"27(f)",lights:[["Verde — tope","#35dc83"],["Verde — lais BB","#35dc83"],["Verde — lais BE","#35dc83"]],shape:"● ● ●"},
 diving:{label:"Operação de mergulho",rule:"27(e)",lights:[["RAM","#ef3c4e"],["RAM","#fff2ba"],["RAM","#ef3c4e"]],shape:"A"},
 cbd:{label:"Restrita pelo calado",rule:"28",lights:[["Circular","#ef3c4e"],["Circular","#ef3c4e"],["Circular","#ef3c4e"]],shape:"▮"},
 pilot:{label:"Praticagem",rule:"29",lights:[["Circular branca","#fff2ba"],["Circular encarnada","#ef3c4e"],["Bombordo","#ef3c4e"],["Boreste","#35dc83"]],shape:""},
 anchor:{label:"Fundeada",rule:"30",lights:[["Circular vante","#fff2ba"],["Circular ré","#fff2ba"]],shape:"●"},
 aground:{label:"Encalhada",rule:"30(d)",lights:[["Fundeio vante","#fff2ba"],["Fundeio ré","#fff2ba"],["Circular","#ef3c4e"],["Circular","#ef3c4e"]],shape:"● ● ●"}
};
const PRESETS={Bow:0,"Stbd":-90,Stern:180,Port:90};

export default function Ripeam3DClient(){
 const [scenario,setScenario]=useState("power");
 const [yaw,setYaw]=useState(-24);
 const [pitch,setPitch]=useState(-8);
 const [night,setNight]=useState(true);
 const drag=useRef(null);
 const s=SCENARIOS[scenario];
 const stack=useMemo(()=>s.lights.map((x,i)=>({label:x[0],color:x[1],top:72+i*34})),[s]);
 function down(e){drag.current={x:e.clientX,y:e.clientY,yaw,pitch};e.currentTarget.setPointerCapture?.(e.pointerId)}
 function move(e){if(!drag.current)return;setYaw(drag.current.yaw+(e.clientX-drag.current.x)*.45);setPitch(Math.max(-32,Math.min(18,drag.current.pitch-(e.clientY-drag.current.y)*.18)))}
 function up(){drag.current=null}
 return <>
   <header className={styles.hero}><div><a href="/flashcards/ripeam">← Voltar aos flashcards</a><span>ESTIBORDO · RIPEAM / COLREG</span><h1>Laboratório 3D de luzes e marcas</h1><p>Arraste a embarcação para mudar o aspecto. Compare proa, popa, bombordo e boreste, alterne dia/noite e revise as luzes exigidas.</p></div></header>
   <section className={styles.lab}>
     <aside className={styles.scenarios}>{Object.entries(SCENARIOS).map(([k,v])=><button key={k} className={scenario===k?styles.active:""} onClick={()=>setScenario(k)}><b>{v.label}</b><small>Regra {v.rule}</small></button>)}</aside>
     <div className={styles.viewer}>
       <div className={styles.controls}>
         <div>{Object.keys(PRESETS).map(k=><button key={k} onClick={()=>setYaw(PRESETS[k])}>{k}</button>)}<button onClick={()=>{setYaw(-24);setPitch(-8)}}>3D</button></div>
         <button className={styles.dayToggle} onClick={()=>setNight(v=>!v)}>{night?"☀ Dia":"☾ Noite"}</button>
       </div>
       <div className={night?styles.sceneNight:styles.sceneDay} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
         <div className={styles.horizon}/>
         <div className={styles.world} style={{transform:`rotateX(${pitch}deg) rotateY(${yaw}deg)`}}>
           <div className={styles.hull}><i/><i/><i/></div>
           <div className={styles.deckhouse}/>
           <div className={styles.mast}/>
           {stack.map((l,i)=><span key={i} className={styles.light} style={{background:l.color,top:l.top,left:"50%"}} title={l.label}/>)}
           {s.shape&&<div className={styles.shape}>{s.shape}</div>}
         </div>
         <div className={styles.dragHint}>Arraste para girar</div>
       </div>
       <footer className={styles.viewerFooter}><div><b>{s.label}</b><span>Regra {s.rule}</span></div><strong>Aspecto: {Math.round(((yaw%360)+360)%360)}°</strong></footer>
     </div>
     <aside className={styles.lightList}><h2>Luzes / marcas</h2>{s.lights.map((x,i)=><div key={i}><i style={{background:x[1]}}/><span><b>{x[0]}</b><small>{scenario==="tow"&&i===3?"amarela · 135°":"identificação visual"}</small></span></div>)}{s.shape&&<div className={styles.shapeRow}><b>Marca diurna</b><strong>{s.shape}</strong></div>}</aside>
   </section>
   <section className={styles.notes}><h2>Como usar no estudo</h2><p>Selecione uma condição, observe a configuração noturna e depois alterne para o modo diurno. Use os botões Bow, Stern, Port e Stbd para memorizar o que é visível em cada aspecto.</p></section>
 </>;
}
