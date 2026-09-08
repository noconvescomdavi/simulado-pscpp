"use client";

import {useMemo,useState} from "react";
import RipeamThreeScene from "./RipeamThreeScene";
import styles from "./ripeam-3d.module.css";

const SCENES = [
  {key:"rule23",rule:"23",title:"Embarcação de propulsão mecânica",vessels:["bulk-carrier"],lightPlan:"power"},
  {key:"rule24",rule:"24",title:"Reboque e empurra",vessels:["tugboat","barge"],lightPlan:"tow"},
  {key:"rule25",rule:"25",title:"Embarcação a vela",vessels:["sailboat"],lightPlan:"sail"},
  {key:"rule26",rule:"26",title:"Embarcação de pesca",vessels:["fishing-vessel"],lightPlan:"fishing"},
  {key:"rule27a",rule:"27(a)",title:"Sem governo",vessels:["bulk-carrier"],lightPlan:"nuc"},
  {key:"rule27b",rule:"27(b)",title:"Capacidade de manobra restrita",vessels:["bulk-carrier"],lightPlan:"ram"},
  {key:"rule27d",rule:"27(d)",title:"Dragagem / operação submarina",vessels:["dredger"],lightPlan:"dredger"},
  {key:"rule27e",rule:"27(e)",title:"Reboque com restrição de manobra",vessels:["tugboat"],lightPlan:"ram"},
  {key:"rule27f",rule:"27(f)",title:"Remoção de minas",vessels:["mine-clearance"],lightPlan:"mine"},
  {key:"rule28",rule:"28",title:"Restrita pelo calado",vessels:["bulk-carrier"],lightPlan:"cbd"},
  {key:"rule29",rule:"29",title:"Praticagem",vessels:["pilot-boat"],lightPlan:"pilot"},
  {key:"rule30",rule:"30",title:"Fundeada",vessels:["bulk-carrier"],lightPlan:"anchor"},
  {key:"rule30d",rule:"30(d)",title:"Encalhada",vessels:["bulk-carrier"],lightPlan:"aground"},
  {key:"rule31",rule:"31",title:"Hidroavião",vessels:["seaplane"],lightPlan:"seaplane"}
];

export default function Ripeam3DClient(){
  const [selected,setSelected] = useState("rule23");
  const [diagnostics,setDiagnostics] = useState(null);
  const scene = useMemo(()=>SCENES.find(item=>item.key===selected)||SCENES[0],[selected]);

  return <main className={styles.page}>
    <header className={styles.hero}>
      <div>
        <a href="/flashcards/ripeam">← Voltar aos flashcards</a>
        <span>ESTIBORDO · RIPEAM / COLREG</span>
        <h1>Laboratório 3D</h1>
        <p>Viewer simples e estável: cada cena carrega somente o modelo necessário, diretamente do arquivo 3D.</p>
      </div>
    </header>

    <section className={styles.lab}>
      <aside className={styles.scenarios} aria-label="Cenas RIPEAM">
        {SCENES.map(item=><button key={item.key} className={item.key===selected?styles.active:""} onClick={()=>setSelected(item.key)}>
          <b>Regra {item.rule}</b><small>{item.title}</small>
        </button>)}
      </aside>

      <section className={styles.viewerCard}>
        <div className={styles.viewerHeading}>
          <div><span>REGRA {scene.rule}</span><h2>{scene.title}</h2></div>
          <div className={styles.status}>{diagnostics?.status==="loaded"?"Modelo 3D carregado":diagnostics?.status==="error"?"Falha no modelo":"Carregando"}</div>
        </div>

        <RipeamThreeScene key={scene.key} sceneConfig={scene} onDiagnostics={setDiagnostics}/>

        {diagnostics?.status==="loaded"&&<div className={styles.diagnostics}>
          <span>Meshes <b>{diagnostics.meshCount}</b></span>
          <span>Materiais <b>{diagnostics.materialCount}</b></span>
          <span>Bounding box <b>{diagnostics.boundingBoxValid?"válido":"inválido"}</b></span>
          <span>Frustum <b>{diagnostics.inFrustum?"OK":"fora"}</b></span>
          <span>Frames <b>{diagnostics.frames}</b></span>
        </div>}
      </section>
    </section>
  </main>;
}
