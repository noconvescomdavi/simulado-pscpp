"use client";

import {useMemo,useState} from "react";
import RipeamThreeScene from "./RipeamThreeScene";
import styles from "./ripeam-3d.module.css";

const LIGHT_INFO={
  power:[
    ["Luz de mastro","Branca","225°","5 mn"],["Luz de bombordo","Encarnada","112,5°","2 mn"],["Luz de boreste","Verde","112,5°","2 mn"],["Luz de alcançado","Branca","135°","2 mn"]
  ],
  towShort:[
    ["Luz de mastro superior","Branca","225°","5 mn"],["2ª luz de mastro","Branca","225°","5 mn"],["Luz de reboque","Amarela","135°","2 mn"],["Luz de bombordo","Encarnada","112,5°","2 mn"],["Luz de boreste","Verde","112,5°","2 mn"]
  ],
  towLong:[
    ["Luz de mastro superior","Branca","225°","5 mn"],["2ª luz de mastro","Branca","225°","5 mn"],["3ª luz de mastro","Branca","225°","5 mn"],["Luz de reboque","Amarela","135°","2 mn"],["Luz de bombordo","Encarnada","112,5°","2 mn"],["Luz de boreste","Verde","112,5°","2 mn"]
  ],
  sail:[
    ["Luz de bombordo","Encarnada","112,5°","2 mn"],["Luz de boreste","Verde","112,5°","2 mn"],["Luz de alcançado","Branca","135°","2 mn"]
  ],
  fishing:[
    ["Circular superior","Encarnada","360°","2 mn"],["Circular inferior","Branca","360°","2 mn"],["Luzes de bordo","Encarnada / Verde","112,5°","2 mn"]
  ],
  nuc:[["Circular superior","Encarnada","360°","2 mn"],["Circular inferior","Encarnada","360°","2 mn"]],
  ram:[["Circular superior","Encarnada","360°","2 mn"],["Circular central","Branca","360°","2 mn"],["Circular inferior","Encarnada","360°","2 mn"]],
  dredgerPort:[["RAM superior","Encarnada","360°","2 mn"],["RAM central","Branca","360°","2 mn"],["RAM inferior","Encarnada","360°","2 mn"],["Lado obstruído BB","Encarnada ×2","360°","2 mn"],["Lado livre BE","Verde ×2","360°","2 mn"]],
  dredgerStbd:[["RAM superior","Encarnada","360°","2 mn"],["RAM central","Branca","360°","2 mn"],["RAM inferior","Encarnada","360°","2 mn"],["Lado livre BB","Verde ×2","360°","2 mn"],["Lado obstruído BE","Encarnada ×2","360°","2 mn"]],
  mine:[["Circular no tope","Verde","360°","2 mn"],["Circular no lais BB","Verde","360°","2 mn"],["Circular no lais BE","Verde","360°","2 mn"]],
  cbd:[["Circular superior","Encarnada","360°","2 mn"],["Circular central","Encarnada","360°","2 mn"],["Circular inferior","Encarnada","360°","2 mn"]],
  pilot:[["Circular superior","Branca","360°","2 mn"],["Circular inferior","Encarnada","360°","2 mn"],["Luzes de bordo","Encarnada / Verde","112,5°","2 mn"]],
  anchor:[["Circular de vante","Branca","360°","2 mn"],["Circular de ré","Branca","360°","2 mn"]],
  aground:[["Fundeio de vante","Branca","360°","2 mn"],["Fundeio de ré","Branca","360°","2 mn"],["Encalhada superior","Encarnada","360°","2 mn"],["Encalhada inferior","Encarnada","360°","2 mn"]],
  seaplane:[["Bombordo","Encarnada","112,5°","2 mn"],["Boreste","Verde","112,5°","2 mn"],["Alcançado","Branca","135°","2 mn"]]
};

const SCENES=[
  {key:"rule23",rule:"23",title:"Embarcação de propulsão mecânica",vessels:["bulk-carrier"],variants:[
    {id:"power-underway",label:"Em navegação",lightPlan:"power",note:"Embarcação de propulsão mecânica em movimento."}
  ]},
  {key:"rule24",rule:"24",title:"Reboque e empurra",vessels:["tugboat","barge"],variants:[
    {id:"tow-short",label:"Reboque ≤ 200 m",lightPlan:"towShort",note:"Rebocador e barcaça no mesmo cenário, ligados pelo cabo de reboque."},
    {id:"tow-long",label:"Reboque > 200 m",lightPlan:"towLong",note:"Reboque superior a 200 m: três luzes de mastro em linha vertical."}
  ]},
  {key:"rule25",rule:"25",title:"Embarcação a vela",vessels:["sailboat"],variants:[
    {id:"sail-underway",label:"Em navegação",lightPlan:"sail",note:"Embarcação a vela em movimento."}
  ]},
  {key:"rule26",rule:"26",title:"Embarcação de pesca",vessels:["fishing-vessel"],variants:[
    {id:"fishing-way",label:"Pesca, com seguimento",lightPlan:"fishing",note:"Configuração visual de embarcação engajada na pesca."}
  ]},
  {key:"rule27a",rule:"27(a)",title:"Sem governo",vessels:["bulk-carrier"],variants:[
    {id:"nuc-way",label:"Sem governo, com seguimento",lightPlan:"nuc",note:"Duas luzes circulares encarnadas em linha vertical."},
    {id:"nuc-stopped",label:"Sem governo, sem seguimento",lightPlan:"nuc",note:"Sem seguimento: mantém as luzes circulares de sem governo."}
  ]},
  {key:"rule27b",rule:"27(b)",title:"Capacidade de manobra restrita",vessels:["bulk-carrier"],variants:[
    {id:"ram-under50",label:"RAM em navegação < 50 m",lightPlan:"ram",note:"Encarnada–branca–encarnada em linha vertical."},
    {id:"ram-over50",label:"RAM em navegação ≥ 50 m",lightPlan:"ram",note:"Mesma característica RAM; demais luzes dependem da condição de navegação."},
    {id:"ram-anchor",label:"RAM fundeada",lightPlan:"ram",note:"Sinais de capacidade de manobra restrita combinados com a condição de fundeio."}
  ]},
  {key:"rule27d",rule:"27(d)",title:"Dragagem / operação submarina",vessels:["dredger"],variants:[
    {id:"dredge-port",label:"Obstrução a bombordo",lightPlan:"dredgerPort",note:"Encarnadas no lado obstruído; verdes no lado por onde outra embarcação pode passar."},
    {id:"dredge-stbd",label:"Obstrução a boreste",lightPlan:"dredgerStbd",note:"Verdes no lado livre; encarnadas no lado da obstrução."},
    {id:"dredge-anchor",label:"Draga fundeada",lightPlan:"dredgerPort",note:"Configuração de dragagem mantida durante a operação fundeada."}
  ]},
  {key:"rule27e",rule:"27(e)",title:"Reboque com restrição de manobra",vessels:["tugboat"],variants:[
    {id:"restricted-tow-short",label:"Reboque restrito ≤ 200 m",lightPlan:"ram",note:"Rebocador com capacidade de desvio severamente limitada pelo reboque."},
    {id:"restricted-tow-long",label:"Reboque restrito > 200 m",lightPlan:"ram",note:"Condição de reboque restrito com comprimento superior a 200 m."}
  ]},
  {key:"rule27f",rule:"27(f)",title:"Remoção de minas",vessels:["mine-clearance"],variants:[
    {id:"mine-way",label:"Em navegação",lightPlan:"mine",note:"Três luzes circulares verdes características da operação de remoção de minas."},
    {id:"mine-anchor",label:"Fundeada",lightPlan:"mine",note:"Embarcação engajada na remoção de minas enquanto fundeada."}
  ]},
  {key:"rule28",rule:"28",title:"Restrita pelo calado",vessels:["bulk-carrier"],variants:[
    {id:"cbd",label:"Restrita pelo calado",lightPlan:"cbd",note:"Três luzes circulares encarnadas em linha vertical."}
  ]},
  {key:"rule29",rule:"29",title:"Praticagem",vessels:["pilot-boat"],variants:[
    {id:"pilot-duty",label:"Em serviço de praticagem",lightPlan:"pilot",note:"Branca sobre encarnada, circulares."}
  ]},
  {key:"rule30",rule:"30",title:"Fundeada",vessels:["bulk-carrier"],variants:[
    {id:"anchor",label:"Embarcação fundeada",lightPlan:"anchor",note:"Luzes circulares brancas de fundeio."}
  ]},
  {key:"rule30d",rule:"30(d)",title:"Encalhada",vessels:["bulk-carrier"],variants:[
    {id:"aground",label:"Embarcação encalhada",lightPlan:"aground",note:"Luzes de fundeio acrescidas de duas circulares encarnadas."}
  ]},
  {key:"rule31",rule:"31",title:"Hidroavião",vessels:["seaplane"],variants:[
    {id:"seaplane",label:"Hidroavião na água",lightPlan:"seaplane",note:"Na medida do possível, exibe luzes de características equivalentes."}
  ]}
];

export default function Ripeam3DClient(){
  const [selected,setSelected]=useState("rule23");
  const [variantId,setVariantId]=useState("power-underway");
  const [diagnostics,setDiagnostics]=useState(null);
  const [night,setNight]=useState(false);
  const [displayMode,setDisplayMode]=useState("vessel");
  const [showSectors,setShowSectors]=useState(false);

  const scene=useMemo(()=>SCENES.find(item=>item.key===selected)||SCENES[0],[selected]);
  const variant=useMemo(()=>scene.variants.find(v=>v.id===variantId)||scene.variants[0],[scene,variantId]);
  const sceneConfig=useMemo(()=>({...scene,...variant,variantId:variant.id}),[scene,variant]);
  const lights=LIGHT_INFO[variant.lightPlan]||[];

  const chooseScene=item=>{
    setSelected(item.key);
    setVariantId(item.variants[0].id);
    setDisplayMode("vessel");
    setShowSectors(false);
  };

  return <main className={styles.page}>
    <header className={styles.hero}>
      <div>
        <a href="/flashcards/ripeam">← Voltar aos flashcards</a>
        <span>ESTIBORDO · RIPEAM / COLREG</span>
        <h1>Laboratório 3D</h1>
        <p>Explore embarcações, luzes, marcas diurnas, setores e variantes operacionais das regras RIPEAM.</p>
      </div>
    </header>

    <section className={styles.lab}>
      <aside className={styles.scenarios} aria-label="Cenas RIPEAM">
        {SCENES.map(item=><button key={item.key} className={item.key===selected?styles.active:""} onClick={()=>chooseScene(item)}>
          <b>Regra {item.rule}</b><small>{item.title}</small>
        </button>)}
      </aside>

      <section className={styles.viewerCard}>
        <div className={styles.viewerHeading}>
          <div><span>REGRA {scene.rule}</span><h2>{scene.title}</h2><small className={styles.variantTitle}>{variant.label}</small></div>
          <div className={styles.headingActions}>
            <div className={styles.environmentToggle}>
              <button className={!night?styles.environmentActive:""} onClick={()=>setNight(false)}>☀ Diurno</button>
              <button className={night?styles.environmentActive:""} onClick={()=>setNight(true)}>☾ Noturno</button>
            </div>
            <div className={styles.status}>{diagnostics?.status==="loaded"?"Modelo 3D carregado":diagnostics?.status==="error"?"Falha no modelo":"Carregando"}</div>
          </div>
        </div>

        {scene.variants.length>1&&<div className={styles.variantBar} role="tablist" aria-label="Variantes da regra">
          {scene.variants.map(v=><button key={v.id} role="tab" aria-selected={v.id===variant.id} className={v.id===variant.id?styles.variantActive:""} onClick={()=>setVariantId(v.id)}>{v.label}</button>)}
        </div>}

        <div className={styles.studyToolbar}>
          <button className={displayMode==="vessel"?styles.studyActive:""} onClick={()=>setDisplayMode("vessel")}>Navio + luzes</button>
          <button className={displayMode==="lights"?styles.studyActive:""} onClick={()=>setDisplayMode("lights")}>Somente luzes</button>
          <button className={displayMode==="daymarks"?styles.studyActive:""} onClick={()=>setDisplayMode("daymarks")}>Marcas diurnas</button>
          <button className={showSectors?styles.studyActive:""} onClick={()=>setShowSectors(v=>!v)}>Setores luminosos</button>
        </div>

        <div className={styles.viewerStudyGrid}>
          <RipeamThreeScene
            key={scene.key+"-"+variant.id+"-"+(night?"night":"day")}
            sceneConfig={sceneConfig}
            onDiagnostics={setDiagnostics}
            night={night}
            displayMode={displayMode}
            showSectors={showSectors}
          />

          <aside className={styles.lightPanel}>
            <div className={styles.lightPanelHeader}><b>Luzes</b><span>{lights.length}</span></div>
            <div className={styles.lightDiagram}>
              {lights.slice(0,7).map((l,i)=><i key={i} className={styles["light"+(l[1].includes("Verde")?"Green":l[1].includes("Encarnada")?"Red":l[1].includes("Amarela")?"Yellow":"White")]} style={{top:(12+i*11)+"%"}} title={l[0]}/>)}
            </div>
            <ul>{lights.map((l,i)=><li key={i}><span className={styles.lightDot}></span><div><b>{l[0]}</b><small>{l[1]} · {l[2]} · {l[3]}</small></div></li>)}</ul>
            <p className={styles.variantNote}>{variant.note}</p>
          </aside>
        </div>

        {diagnostics?.status==="loaded"&&<div className={styles.diagnostics}>
          <span>Meshes <b>{diagnostics.meshCount}</b></span>
          <span>Materiais <b>{diagnostics.materialCount}</b></span>
          <span>Bounding box <b>{diagnostics.boundingBoxValid?"válido":"inválido"}</b></span>
          <span>Frustum <b>{diagnostics.inFrustum?"OK":"fora"}</b></span>
          <span>Runtime <b>{diagnostics.runtime}</b></span>
        </div>}
      </section>
    </section>
  </main>;
}
