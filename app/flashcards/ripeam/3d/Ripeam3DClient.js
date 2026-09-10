"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import RipeamThreeScene from "./RipeamThreeScene";
import styles from "./ripeam-3d.module.css";

const LIGHT_INFO={
  power:[["Luz de mastro","Branca","225°","5 mn"],["Luz de bombordo","Encarnada","112,5°","2 mn"],["Luz de boreste","Verde","112,5°","2 mn"],["Luz de alcançado","Branca","135°","2 mn"]],
  towShort:[["Luz de mastro superior","Branca","225°","5 mn"],["2ª luz de mastro","Branca","225°","5 mn"],["Luz de reboque","Amarela","135°","2 mn"],["Luz de bombordo","Encarnada","112,5°","2 mn"],["Luz de boreste","Verde","112,5°","2 mn"]],
  towLong:[["Luz de mastro superior","Branca","225°","5 mn"],["2ª luz de mastro","Branca","225°","5 mn"],["3ª luz de mastro","Branca","225°","5 mn"],["Luz de reboque","Amarela","135°","2 mn"],["Luz de bombordo","Encarnada","112,5°","2 mn"],["Luz de boreste","Verde","112,5°","2 mn"]],
  sail:[["Luz de bombordo","Encarnada","112,5°","2 mn"],["Luz de boreste","Verde","112,5°","2 mn"],["Luz de alcançado","Branca","135°","2 mn"]],
  fishing:[["Circular superior","Encarnada","360°","2 mn"],["Circular inferior","Branca","360°","2 mn"],["Luzes de bordo","Encarnada / Verde","112,5°","2 mn"]],
  nuc:[["Circular superior","Encarnada","360°","2 mn"],["Circular inferior","Encarnada","360°","2 mn"]],
  ram:[["Circular superior","Encarnada","360°","2 mn"],["Circular central","Branca","360°","2 mn"],["Circular inferior","Encarnada","360°","2 mn"]],
  dredgerStbd:[["RAM superior","Encarnada","360°","2 mn"],["RAM central","Branca","360°","2 mn"],["RAM inferior","Encarnada","360°","2 mn"],["Lado livre BB","Verde ×2","360°","2 mn"],["Lado obstruído BE","Encarnada ×2","360°","2 mn"]],
  mine:[["Circular no tope","Verde","360°","2 mn"],["Circular no lais BB","Verde","360°","2 mn"],["Circular no lais BE","Verde","360°","2 mn"]],
  cbd:[["Circular superior","Encarnada","360°","2 mn"],["Circular central","Encarnada","360°","2 mn"],["Circular inferior","Encarnada","360°","2 mn"]],
  pilot:[["Circular superior","Branca","360°","2 mn"],["Circular inferior","Encarnada","360°","2 mn"],["Luzes de bordo","Encarnada / Verde","112,5°","2 mn"]],
  anchor:[["Circular de vante","Branca","360°","2 mn"],["Circular de ré","Branca","360°","2 mn"]],
  aground:[["Fundeio de vante","Branca","360°","2 mn"],["Fundeio de ré","Branca","360°","2 mn"],["Encalhada superior","Encarnada","360°","2 mn"],["Encalhada inferior","Encarnada","360°","2 mn"]],
  seaplane:[["Bombordo","Encarnada","112,5°","2 mn"],["Boreste","Verde","112,5°","2 mn"],["Alcançado","Branca","135°","2 mn"]]
};

const SCENES=[
  {key:"rule23",rule:"23",title:"Embarcação de propulsão mecânica",vessels:["bulk-carrier"],variants:[{id:"power-underway",label:"Em navegação",lightPlan:"power",note:"Embarcação de propulsão mecânica em movimento."}]},
  {key:"rule24",rule:"24",title:"Reboque e empurra",vessels:["tugboat","barge"],variants:[{id:"tow-short",label:"Reboque ≤ 200 m",lightPlan:"towShort",note:"Rebocador e barcaça no mesmo cenário, ligados pelo cabo de reboque."},{id:"tow-long",label:"Reboque > 200 m",lightPlan:"towLong",note:"Reboque superior a 200 m: três luzes de mastro em linha vertical."}]},
  {key:"rule25",rule:"25",title:"Embarcação a vela",vessels:["sailboat"],variants:[{id:"sail-underway",label:"Em navegação",lightPlan:"sail",note:"Embarcação a vela em movimento."}]},
  {key:"rule26",rule:"26",title:"Embarcação de pesca",vessels:["fishing-vessel"],variants:[{id:"fishing-way",label:"Pesca, com seguimento",lightPlan:"fishing",note:"Configuração visual de embarcação engajada na pesca."}]},
  {key:"rule27a",rule:"27(a)",title:"Sem governo",vessels:["bulk-carrier"],variants:[{id:"nuc-way",label:"Sem governo, com seguimento",lightPlan:"nuc",note:"Duas luzes circulares encarnadas em linha vertical."},{id:"nuc-stopped",label:"Sem governo, sem seguimento",lightPlan:"nuc",note:"Sem seguimento: mantém as luzes circulares de sem governo."}]},
  {key:"rule27b",rule:"27(b)",title:"Capacidade de manobra restrita",vessels:["bulk-carrier"],variants:[{id:"ram-under50",label:"RAM em navegação < 50 m",lightPlan:"ram",note:"Encarnada–branca–encarnada em linha vertical."},{id:"ram-over50",label:"RAM em navegação ≥ 50 m",lightPlan:"ram",note:"Mesma característica RAM; demais luzes dependem da condição de navegação."},{id:"ram-anchor",label:"RAM fundeada",lightPlan:"ram",note:"Sinais de capacidade de manobra restrita combinados com a condição de fundeio."}]},
  {key:"rule27d",rule:"27(d)",title:"Dragagem / operação submarina",vessels:["dredger"],variants:[{id:"dredge-stbd",label:"Obstrução a boreste",lightPlan:"dredgerStbd",note:"Verdes no lado livre; encarnadas no lado da obstrução."}]},
  {key:"rule27e",rule:"27(e)",title:"Reboque com restrição de manobra",vessels:["tugboat"],variants:[{id:"restricted-tow-short",label:"Reboque restrito ≤ 200 m",lightPlan:"ram",note:"Rebocador com capacidade de desvio severamente limitada pelo reboque."},{id:"restricted-tow-long",label:"Reboque restrito > 200 m",lightPlan:"ram",note:"Condição de reboque restrito com comprimento superior a 200 m."}]},
  {key:"rule27f",rule:"27(f)",title:"Remoção de minas",vessels:["mine-clearance"],variants:[{id:"mine-way",label:"Em navegação",lightPlan:"mine",note:"Três luzes circulares verdes características da operação de remoção de minas."},{id:"mine-anchor",label:"Fundeada",lightPlan:"mine",note:"Embarcação engajada na remoção de minas enquanto fundeada."}]},
  {key:"rule28",rule:"28",title:"Restrita pelo calado",vessels:["bulk-carrier"],variants:[{id:"cbd",label:"Restrita pelo calado",lightPlan:"cbd",note:"Três luzes circulares encarnadas em linha vertical."}]},
  {key:"rule29",rule:"29",title:"Praticagem",vessels:["pilot-boat"],variants:[{id:"pilot-duty",label:"Em serviço de praticagem",lightPlan:"pilot",note:"Branca sobre encarnada, circulares."}]},
  {key:"rule30",rule:"30",title:"Fundeada",vessels:["bulk-carrier"],variants:[{id:"anchor",label:"Embarcação fundeada",lightPlan:"anchor",note:"Luzes circulares brancas de fundeio."}]},
  {key:"rule30d",rule:"30(d)",title:"Encalhada",vessels:["bulk-carrier"],variants:[{id:"aground",label:"Embarcação encalhada",lightPlan:"aground",note:"Luzes de fundeio acrescidas de duas circulares encarnadas."}]},
  {key:"rule31",rule:"31",title:"Hidroavião",vessels:["seaplane"],variants:[{id:"seaplane",label:"Hidroavião na água",lightPlan:"seaplane",note:"Na medida do possível, exibe luzes de características equivalentes."}]}
];

const EDITOR_SCENE_KEY={"power-underway":"power","tow-short":"towShort","tow-long":"tow","sail-underway":"sail","fishing-way":"fishing","nuc-way":"nuc","nuc-stopped":"nuc","ram-under50":"ram","ram-over50":"ram","ram-anchor":"ram","dredge-stbd":"dredgeStbd","restricted-tow-short":"diving","restricted-tow-long":"diving","mine-way":"mine","mine-anchor":"mine","cbd":"cbd","pilot-duty":"pilot","anchor":"anchor","aground":"aground","seaplane":"seaplane"};

const DAYMARK_INFO={power:["Sem marca diurna especial para esta condição."],towShort:["Reboque ≤ 200 m: não há losango obrigatório apenas pelo comprimento do reboque."],towLong:["Losango preto em local bem visível quando o comprimento do reboque excede 200 m."],sail:["Sem marca diurna especial apenas por estar a vela."],fishing:["Dois cones pretos com os vértices unidos."],nuc:["Duas esferas pretas em linha vertical."],ram:["Esfera preta, losango preto e esfera preta em linha vertical."],dredgerStbd:["Esfera–losango–esfera; duas esferas no lado obstruído e dois losangos no lado livre."],mine:["Três esferas pretas: uma próxima ao tope e uma em cada lais."],cbd:["Um cilindro preto."],pilot:["Sem marca diurna especial da praticagem."],anchor:["Uma esfera preta."],aground:["Três esferas pretas em linha vertical."],seaplane:["Na medida do possível, sinais equivalentes aos previstos no RIPEAM."]};

const SITUATIONS=[
  {id:"head-on",title:"Roda a roda",rule:"14",prompt:"Duas embarcações de propulsão mecânica se aproximam em rumos opostos, com risco de abalroamento. Qual é a ação correta?",options:["Ambas alteram o rumo para boreste","Ambas alteram o rumo para bombordo","Apenas a maior embarcação manobra","Nenhuma manobra até a distância diminuir"],answer:0,explanation:"Em situação roda a roda, ambas devem alterar o rumo para boreste, passando uma pela outra por bombordo.",encounter:{ownPosition:[-5,0,0],ownRotation:0,otherPosition:[5,0,0],otherRotation:Math.PI,courseA:[[-11,.08,0],[11,.08,0]],courseB:[[11,.09,.7],[-11,.09,.7]]}},
  {id:"crossing",title:"Cruzamento",rule:"15",prompt:"Duas embarcações de propulsão mecânica estão em situação de cruzamento. A outra embarcação está por boreste. O que deve fazer a sua embarcação?",options:["Manter rumo e velocidade em qualquer caso","Manobrar para manter-se afastada","Guinar obrigatoriamente para bombordo","Parar imediatamente as máquinas"],answer:1,explanation:"A embarcação que avista a outra por boreste deve manter-se afastada e, se possível, evitar cruzar sua proa.",encounter:{ownPosition:[-5,0,0],ownRotation:0,otherPosition:[1,0,-5],otherRotation:-Math.PI/2,courseA:[[-11,.08,0],[11,.08,0]],courseB:[[1,.09,-11],[1,.09,11]]}},
  {id:"overtaking",title:"Ultrapassagem",rule:"13",prompt:"Uma embarcação alcança outra por uma direção superior a 22,5° para ré do través. Quem deve manter-se afastado?",options:["A embarcação alcançada","A embarcação que alcança","A embarcação a boreste","A embarcação de maior calado"],answer:1,explanation:"Toda embarcação que alcança outra deve manter-se fora do caminho da embarcação alcançada.",encounter:{ownPosition:[-5,0,0],ownRotation:0,otherPosition:[3,0,.8],otherRotation:0,courseA:[[-11,.08,0],[11,.08,0]],courseB:[[-7,.09,.8],[13,.09,.8]]}}
];

export default function Ripeam3DClient(){
  const [selected,setSelected]=useState("rule23");
  const [variantId,setVariantId]=useState("power-underway");
  const [diagnostics,setDiagnostics]=useState(null);
  const [night,setNight]=useState(false);
  const [displayMode,setDisplayMode]=useState("vessel");
  const [showSectors,setShowSectors]=useState(false);
  const [labMode,setLabMode]=useState("explore");
  const [identifyIndex,setIdentifyIndex]=useState(0);
  const [identifyAnswer,setIdentifyAnswer]=useState(null);
  const [situationIndex,setSituationIndex]=useState(0);
  const [situationAnswer,setSituationAnswer]=useState(null);
  const [score,setScore]=useState({correct:0,total:0});
  const [highlightLight,setHighlightLight]=useState(-1);
  const [liveScene,setLiveScene]=useState(null);
  const liveSceneStampRef=useRef("");

  const scene=useMemo(()=>SCENES.find(item=>item.key===selected)||SCENES[0],[selected]);
  const variant=useMemo(()=>scene.variants.find(v=>v.id===variantId)||scene.variants[0],[scene,variantId]);
  const identifyPool=useMemo(()=>SCENES.flatMap(s=>s.variants.map(v=>({scene:s,variant:v}))),[]);
  const identify=identifyPool[identifyIndex%identifyPool.length];
  const situation=SITUATIONS[situationIndex%SITUATIONS.length];
  const activeScene=labMode==="identify"?identify.scene:scene;
  const activeVariant=labMode==="identify"?identify.variant:variant;
  const sceneConfig=useMemo(()=>({...activeScene,variantId:activeVariant.id,lightPlan:activeVariant.lightPlan,encounter:labMode==="situation"?situation.encounter:null}),[activeScene,activeVariant,labMode,situation]);
  const lights=LIGHT_INFO[activeVariant.lightPlan]||[];
  const daymarks=DAYMARK_INFO[activeVariant.lightPlan]||[];

  useEffect(()=>{
    if(!scene.variants.some(v=>v.id===variantId))setVariantId(scene.variants[0].id);
  },[scene,variantId]);

  useEffect(()=>{
    let cancelled=false;
    const key=EDITOR_SCENE_KEY[sceneConfig.variantId];
    if(!key){setLiveScene(null);return}
    const load=async()=>{
      try{
        const r=await fetch("/api/ripeam-3d/scenes?sceneKey="+encodeURIComponent(key),{cache:"no-store"});
        const j=await r.json().catch(()=>({}));
        if(cancelled||!r.ok)return;
        const stamp=JSON.stringify([j?.scene?.published_at,j?.scene?.config]);
        if(stamp!==liveSceneStampRef.current){liveSceneStampRef.current=stamp;setLiveScene(j.scene||null)}
      }catch{}
    };
    load();
    const onFocus=()=>load();
    const onVisibility=()=>{if(!document.hidden)load()};
    window.addEventListener("focus",onFocus);document.addEventListener("visibilitychange",onVisibility);
    return()=>{cancelled=true;window.removeEventListener("focus",onFocus);document.removeEventListener("visibilitychange",onVisibility)};
  },[sceneConfig.variantId]);

  function chooseScene(key){const s=SCENES.find(x=>x.key===key);if(!s)return;setSelected(key);setVariantId(s.variants[0].id);setHighlightLight(-1);setDiagnostics(null)}
  function answerIdentify(i){if(identifyAnswer!==null)return;setIdentifyAnswer(i);setScore(s=>({correct:s.correct+(i===identifyPool.indexOf(identify)?1:0),total:s.total+1}))}
  function nextIdentify(){setIdentifyIndex(i=>(i+1)%identifyPool.length);setIdentifyAnswer(null);setHighlightLight(-1)}
  function answerSituation(i){if(situationAnswer!==null)return;setSituationAnswer(i);setScore(s=>({correct:s.correct+(i===situation.answer?1:0),total:s.total+1}))}

  return <main className={styles.page}><section className={styles.shell}><div className={styles.labTabs}><button className={labMode==="explore"?styles.labActive:""} onClick={()=>setLabMode("explore")}>Explorar</button><button className={labMode==="identify"?styles.labActive:""} onClick={()=>{setLabMode("identify");setNight(true);setDisplayMode("signals-only")}}>Identificar</button><button className={labMode==="situation"?styles.labActive:""} onClick={()=>setLabMode("situation")}>Situação</button><span>Desempenho <b>{score.correct}/{score.total}</b></span></div><section className={styles.labBody}><aside className={styles.ruleList}>{SCENES.map(s=><button key={s.key} className={selected===s.key?styles.ruleActive:""} onClick={()=>chooseScene(s.key)}><b>Regra {s.rule}</b><span>{s.title}</span></button>)}</aside><section className={styles.viewerCard}><div className={styles.viewerHeader}><div><small>REGRA {activeScene.rule}</small><h1>{activeScene.title}</h1><span>{activeVariant.label}</span></div><div className={styles.viewerHeaderActions}>{labMode!=="identify"&&<div className={styles.environmentToggle}><button className={!night?styles.environmentActive:""} onClick={()=>{setNight(false);setDisplayMode("vessel");setShowSectors(false);setHighlightLight(-1)}}>☀ Diurno</button><button className={night?styles.environmentActive:""} onClick={()=>{setNight(true);setDisplayMode("vessel");setHighlightLight(-1)}}>☾ Noturno</button></div>}<div className={styles.status}>{diagnostics?.status==="loaded"?"Modelo 3D carregado":diagnostics?.status==="error"?"Falha no modelo":"Carregando"}</div></div></div>{labMode==="explore"&&activeScene.variants.length>1&&<div className={styles.variantBar}>{activeScene.variants.map(v=><button key={v.id} className={v.id===activeVariant.id?styles.variantActive:""} onClick={()=>{setVariantId(v.id);setHighlightLight(-1)}}>{v.label}</button>)}</div>}{labMode==="explore"&&<div className={styles.studyToolbar}><button className={displayMode==="vessel"?styles.studyActive:""} onClick={()=>setDisplayMode("vessel")}>{night?"Navio + luzes":"Navio + marcas diurnas"}</button><button className={displayMode==="signals-only"?styles.studyActive:""} onClick={()=>setDisplayMode("signals-only")}>{night?"Somente luzes":"Somente marcas diurnas"}</button>{night&&<button className={showSectors?styles.studyActive:""} onClick={()=>setShowSectors(v=>!v)}>Setores luminosos</button>}</div>}<div className={styles.viewerStudyGrid}><RipeamThreeScene key={sceneConfig.key+"-"+sceneConfig.variantId+"-"+(night?"night":"day")+"-"+labMode+"-"+(situation?.id||"")} sceneConfig={sceneConfig} onDiagnostics={setDiagnostics} night={labMode==="identify"?true:night} displayMode={labMode==="identify"?"signals-only":displayMode} showSectors={labMode==="explore"&&showSectors} highlightLightIndex={highlightLight} liveConfig={liveScene?.config||null}/>{labMode==="explore"&&<aside className={styles.lightPanel}><div className={styles.lightPanelHeader}><b>{night?"Luzes noturnas":"Marcas diurnas"}</b><span>{night?lights.length:daymarks.length}</span></div>{night?<><div className={styles.lightDiagram}>{lights.slice(0,7).map((l,i)=><i key={i} className={styles["light"+(l[1].includes("Verde")?"Green":l[1].includes("Encarnada")?"Red":l[1].includes("Amarela")?"Yellow":"White")]} style={{top:(12+i*11)+"%"}} title={l[0]}/>)}</div><ul>{lights.map((l,i)=><li key={i} className={highlightLight===i?styles.lightSelected:""} onClick={()=>setHighlightLight(highlightLight===i?-1:i)}><b>{l[0]}</b><span>{l[1]} · {l[2]} · {l[3]}</span></li>)}</ul></>:<ul>{daymarks.map((m,i)=><li key={i}><b>MARCA RIPEAM</b><span>{m}</span></li>)}</ul>}<div className={styles.note}>{activeVariant.note}</div></aside>}{labMode==="identify"&&<aside className={styles.quizPanel}><h3>Qual é a configuração?</h3><p>Observe apenas os sinais luminosos e identifique a condição.</p><div className={styles.quizOptions}>{identifyPool.slice(0,4).map((item,i)=><button key={item.variant.id} disabled={identifyAnswer!==null} onClick={()=>answerIdentify(i)}>{item.variant.label}</button>)}</div>{identifyAnswer!==null&&<div className={styles.feedback}><b>{identifyAnswer===identifyPool.indexOf(identify)?"Correto.":"Revise a configuração."}</b><span>{identify.variant.note}</span><button onClick={nextIdentify}>Próxima</button></div>}</aside>}{labMode==="situation"&&<aside className={styles.quizPanel}><small>REGRA {situation.rule}</small><h3>{situation.title}</h3><p>{situation.prompt}</p><div className={styles.quizOptions}>{situation.options.map((option,i)=><button key={i} disabled={situationAnswer!==null} onClick={()=>answerSituation(i)}>{option}</button>)}</div>{situationAnswer!==null&&<div className={styles.feedback}><b>{situationAnswer===situation.answer?"Correto.":"Resposta incorreta."}</b><span>{situation.explanation}</span><button onClick={()=>{setSituationIndex(i=>(i+1)%SITUATIONS.length);setSituationAnswer(null)}}>Próxima situação</button></div>}</aside>}</div>{diagnostics?.status==="loaded"&&<><div className={styles.diagnostics}><span>Meshes <b>{diagnostics.meshCount}</b></span><span>Materiais <b>{diagnostics.materialCount}</b></span><span>Texturas <b>{diagnostics.textureCount??0}</b></span><span>Base Color <b>{diagnostics.baseColorMapCount??0}</b></span><span>UVs <b>{diagnostics.missingUvMeshCount?diagnostics.uvMeshCount+"/"+diagnostics.meshCount:"OK"}</b></span><span>Bounding box <b>{diagnostics.boundingBoxValid?"válido":"inválido"}</b></span><span>Frustum <b>{diagnostics.inFrustum?"OK":"fora"}</b></span><span>Runtime <b>{diagnostics.runtime}</b></span></div>{diagnostics.textureless&&<div className={styles.textureWarning}><b>GLB sem texturas.</b><span>Este arquivo não contém mapas de textura incorporados. O viewer não consegue reconstruir texturas que foram removidas durante a otimização.</span></div>}</>}</section></section></section></main>;
}
