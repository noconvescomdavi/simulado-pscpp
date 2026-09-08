"use client";
import {useEffect,useMemo,useState} from "react";
import styles from "./laboratorio-3d.module.css";
import Admin3DViewport from "./Admin3DViewport";

const EMPTY={
  scene_key:"nova-cena",title:"Nova cena",rule_ref:"",card_title:"",description:"",status:"draft",
  config:{
    scenarioKey:"nova-cena",objects:[],cards:[],
    environment:{background:"#071522",ambient:"#7897bc",ambientIntensity:.9,sun:"#fff0cf",sunIntensity:2.2,sunPosition:[6,14,9],water:"#063b55",exposure:.95,fog:"#07121d",fogDensity:.026},
    camera:{position:[14,7,15],target:[0,1,0],fov:43}
  }
};
const BUILTIN=[
  {name:"Bulk Carrier",url:"/models/ripeam/bulk_carrier.glb",type:"glb"},
  {name:"Tugboat",url:"/models/ripeam/Tugboat.glb",type:"glb"},
  {name:"Barge",url:"/models/ripeam/barge.fbx",type:"fbx"},
  {name:"Sailboat",url:"/models/ripeam/sailboat.glb",type:"glb"},
  {name:"Fishing Vessel",url:"/models/ripeam/fishing_vessel.glb",type:"glb"},
  {name:"Pilot Boat",url:"/models/ripeam/pilot_boat.glb",type:"glb"},
  {name:"Mine Clearance",url:"/models/ripeam/navy_mine_clearance.glb",type:"glb"}
];
const clone=x=>JSON.parse(JSON.stringify(x));
const uid=()=>crypto.randomUUID();

export default function Admin3DEditor(){
  const [scenes,setScenes]=useState([]);
  const [scene,setScene]=useState(clone(EMPTY));
  const [selected,setSelected]=useState(null);
  const [mode,setMode]=useState("translate");
  const [tab,setTab]=useState("object");
  const [status,setStatus]=useState("");
  const [busy,setBusy]=useState(false);
  const [assets,setAssets]=useState(BUILTIN);
  const [history,setHistory]=useState([]);

  const cfg=scene.config||EMPTY.config;
  const obj=cfg.objects?.find(o=>o.id===selected);

  useEffect(()=>{load()},[]);

  async function load(){
    const r=await fetch("/api/admin/laboratorio-3d",{cache:"no-store"});
    const j=await r.json().catch(()=>({}));
    if(r.ok){
      setScenes(j.scenes||[]);
      if(j.scenes?.[0]&&!scene.id)openScene(j.scenes[0]);
    }else setStatus(j.error||"Não foi possível carregar as cenas.");
  }

  function openScene(row){
    setScene({
      id:row.id,scene_key:row.scene_key,title:row.title,rule_ref:row.rule_ref||"",
      card_title:row.card_title||"",description:row.description||"",status:row.status,
      config:row.config||clone(EMPTY.config)
    });
    setSelected(null);
    setHistory([]);
  }

  function mutate(fn){
    setHistory(h=>[...h.slice(-29),clone(scene)]);
    setScene(s=>{const n=clone(s);fn(n);return n});
  }

  function undo(){
    setHistory(h=>{
      if(!h.length)return h;
      const last=h[h.length-1];
      setScene(last);
      return h.slice(0,-1);
    });
  }

  function addObject(data){
    const id=uid();
    mutate(s=>s.config.objects.push({
      id,name:data.name||"Modelo",type:data.objType||"model",assetUrl:data.url||"",assetType:data.type||"glb",
      visible:true,position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],color:data.color||"#fff2ba",
      intensity:3,distance:12,angle:.75,penumbra:.25,
      material:{color:"#ffffff",roughness:.5,metalness:.05,opacity:1,emissive:"#000000"}
    }));
    setSelected(id);
    setTab("object");
  }

  function patchObject(p){
    mutate(s=>{
      const o=s.config.objects.find(x=>x.id===selected);
      if(o)Object.assign(o,p);
    });
  }

  function patchVec(key,i,v){
    if(!obj)return;
    const a=[...(obj[key]||[0,0,0])];
    a[i]=Number(v)||0;
    patchObject({[key]:a});
  }

  function removeObject(){
    if(!selected)return;
    mutate(s=>{s.config.objects=s.config.objects.filter(o=>o.id!==selected)});
    setSelected(null);
  }

  function duplicateObject(){
    if(!obj)return;
    const n=clone(obj);
    n.id=uid();n.name+=" cópia";n.position=[...n.position];n.position[0]+=.5;
    mutate(s=>s.config.objects.push(n));
    setSelected(n.id);
  }

  async function save(nextStatus=scene.status){
    setBusy(true);setStatus("Salvando...");
    const payload={...scene,status:nextStatus,config:{...scene.config,scenarioKey:scene.scene_key}};
    const r=await fetch("/api/admin/laboratorio-3d",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({action:"save",scene:payload})
    });
    const j=await r.json().catch(()=>({}));
    setBusy(false);
    if(!r.ok){setStatus(j.error||"Erro ao salvar");return}
    openScene(j.scene);
    setStatus(nextStatus==="published"?"Publicado com sucesso.":"Cena salva.");
    const list=await fetch("/api/admin/laboratorio-3d",{cache:"no-store"}).then(x=>x.json()).catch(()=>({}));
    if(list.scenes)setScenes(list.scenes);
  }

  async function upload(file){
    if(!file)return;
    setStatus("Enviando asset...");
    const fd=new FormData();fd.append("file",file);
    const r=await fetch("/api/admin/laboratorio-3d/upload",{method:"POST",body:fd});
    const j=await r.json().catch(()=>({}));
    if(!r.ok){setStatus(j.error||"Falha no upload");return}
    const ext=file.name.split(".").pop().toLowerCase();
    const a={name:file.name,url:j.url,type:ext};
    setAssets(x=>[a,...x]);
    addObject(a);
    setStatus("Asset enviado e adicionado à cena.");
  }

  function addCard(){
    mutate(s=>s.config.cards.push({id:uid(),title:"Novo card",front:"Pergunta / situação",back:"Resposta / explicação",published:true}));
    setTab("cards");
  }

  function patchCard(id,p){
    mutate(s=>{const c=s.config.cards.find(x=>x.id===id);if(c)Object.assign(c,p)});
  }

  const progress=useMemo(()=>String(cfg.objects?.length||0)+" objetos · "+String(cfg.cards?.length||0)+" cards",[cfg]);

  return <div className={styles.editorShell}>
    <div className={styles.topbar}>
      <div><b>ESTIBORDO · EDITOR 3D</b><span>{scene.title} · {progress}</span></div>
      <div className={styles.topActions}>
        <button onClick={undo} disabled={!history.length}>↶ Undo</button>
        <button onClick={()=>{setScene(clone(EMPTY));setSelected(null);setHistory([])}}>＋ Nova cena</button>
        <button disabled={busy} onClick={()=>save("draft")}>Salvar</button>
        <button className={styles.publish} disabled={busy} onClick={()=>save("published")}>Publicar</button>
      </div>
    </div>

    <div className={styles.workspace}>
      <aside className={styles.leftPane}>
        <h3>CENAS / REGRAS</h3>
        <div className={styles.sceneList}>
          {scenes.map(s=><button key={s.id} className={s.id===scene.id?styles.active:""} onClick={()=>openScene(s)}>
            <b>{s.title}</b><small>Regra {s.rule_ref||"—"} · {s.status}</small>
          </button>)}
        </div>

        <h3>OUTLINER</h3>
        <div className={styles.outliner}>
          {(cfg.objects||[]).map(o=><button key={o.id} className={selected===o.id?styles.active:""} onClick={()=>{setSelected(o.id);setTab("object")}}>
            <span>{o.type.includes("Light")?"💡":o.type==="shape"?"◆":"◫"}</span><b>{o.name}</b>
          </button>)}
        </div>
        <div className={styles.addRow}>
          <button onClick={()=>addObject({name:"Luz pontual",objType:"pointLight",color:"#fff2ba"})}>＋ Luz</button>
          <button onClick={()=>addObject({name:"Marca diurna",objType:"shape",color:"#111111"})}>＋ Marca</button>
        </div>
      </aside>

      <section className={styles.centerPane}>
        <div className={styles.viewportToolbar}>
          <button className={mode==="translate"?styles.active:""} onClick={()=>setMode("translate")}>↔ Mover</button>
          <button className={mode==="rotate"?styles.active:""} onClick={()=>setMode("rotate")}>⟳ Rotacionar</button>
          <button className={mode==="scale"?styles.active:""} onClick={()=>setMode("scale")}>⤢ Escalar</button>
          <span>Gizmo 3D · orbit com mouse</span>
        </div>

        <Admin3DViewport
          scene={cfg}
          selectedId={selected}
          mode={mode}
          onSelect={setSelected}
          onTransform={(id,t)=>{if(id===selected)patchObject(t)}}
        />

        <div className={styles.assetShelf}>
          <div className={styles.assetHead}>
            <b>Biblioteca 3D</b>
            <label><input type="file" accept=".glb,.gltf,.fbx,.obj" onChange={e=>upload(e.target.files?.[0])}/>＋ Importar do PC</label>
          </div>
          <div className={styles.assetGrid}>
            {assets.map((a,i)=><button key={a.url+i} onClick={()=>addObject(a)}><b>{a.name}</b><small>{a.type.toUpperCase()}</small></button>)}
          </div>
        </div>
      </section>

      <aside className={styles.inspector}>
        <div className={styles.tabs}>
          {["object","scene","cards"].map(t=><button key={t} className={tab===t?styles.active:""} onClick={()=>setTab(t)}>
            {t==="object"?"Objeto":t==="scene"?"Cena":"Cards"}
          </button>)}
        </div>

        {tab==="object"&&obj&&<div className={styles.form}>
          <label>Nome<input value={obj.name} onChange={e=>patchObject({name:e.target.value})}/></label>
          <div className={styles.vecTitle}>Posição</div>
          <div className={styles.vec}>{["X","Y","Z"].map((x,i)=><label key={x}>{x}<input type="number" step=".1" value={obj.position[i]} onChange={e=>patchVec("position",i,e.target.value)}/></label>)}</div>
          <div className={styles.vecTitle}>Rotação (rad)</div>
          <div className={styles.vec}>{["X","Y","Z"].map((x,i)=><label key={x}>{x}<input type="number" step=".05" value={obj.rotation[i]} onChange={e=>patchVec("rotation",i,e.target.value)}/></label>)}</div>
          <div className={styles.vecTitle}>Escala</div>
          <div className={styles.vec}>{["X","Y","Z"].map((x,i)=><label key={x}>{x}<input type="number" step=".05" value={obj.scale[i]} onChange={e=>patchVec("scale",i,e.target.value)}/></label>)}</div>

          {obj.type.includes("Light")&&<>
            <label>Cor<input type="color" value={obj.color} onChange={e=>patchObject({color:e.target.value})}/></label>
            <label>Intensidade<input type="range" min="0" max="20" step=".1" value={obj.intensity} onChange={e=>patchObject({intensity:Number(e.target.value)})}/><span>{obj.intensity}</span></label>
            <label>Alcance<input type="number" value={obj.distance} onChange={e=>patchObject({distance:Number(e.target.value)})}/></label>
          </>}

          <div className={styles.row}>
            <button onClick={duplicateObject}>Duplicar</button>
            <button className={styles.danger} onClick={removeObject}>Excluir</button>
          </div>
        </div>}

        {tab==="object"&&!obj&&<div className={styles.empty}>Selecione um objeto no viewport ou Outliner.</div>}

        {tab==="scene"&&<div className={styles.form}>
          <label>Título<input value={scene.title} onChange={e=>setScene(s=>({...s,title:e.target.value}))}/></label>
          <label>Chave da cena (ex.: power, towShort, dredgePort)<input value={scene.scene_key} onChange={e=>setScene(s=>({...s,scene_key:e.target.value}))}/></label>
          <label>Regra RIPEAM<input value={scene.rule_ref} placeholder="24(a), 27(d)..." onChange={e=>setScene(s=>({...s,rule_ref:e.target.value}))}/></label>
          <label>Card / cenário<input value={scene.card_title} onChange={e=>setScene(s=>({...s,card_title:e.target.value}))}/></label>
          <label>Descrição<textarea rows="4" value={scene.description} onChange={e=>setScene(s=>({...s,description:e.target.value}))}/></label>

          <h4>Ambiente</h4>
          {[["background","Fundo"],["water","Água"],["ambient","Luz ambiente"],["sun","Sol"]].map(([k,l])=><label key={k}>{l}<input type="color" value={cfg.environment[k]} onChange={e=>mutate(s=>{s.config.environment[k]=e.target.value})}/></label>)}
          <label>Exposição<input type="range" min=".1" max="3" step=".05" value={cfg.environment.exposure} onChange={e=>mutate(s=>{s.config.environment.exposure=Number(e.target.value)})}/></label>
          <label>Intensidade ambiente<input type="range" min="0" max="10" step=".1" value={cfg.environment.ambientIntensity} onChange={e=>mutate(s=>{s.config.environment.ambientIntensity=Number(e.target.value)})}/></label>
          <label>Intensidade solar<input type="range" min="0" max="15" step=".1" value={cfg.environment.sunIntensity} onChange={e=>mutate(s=>{s.config.environment.sunIntensity=Number(e.target.value)})}/></label>
        </div>}

        {tab==="cards"&&<div className={styles.cardsPane}>
          <button className={styles.full} onClick={addCard}>＋ Criar card</button>
          {(cfg.cards||[]).map(c=><article key={c.id}>
            <input value={c.title} onChange={e=>patchCard(c.id,{title:e.target.value})}/>
            <textarea rows="2" value={c.front} onChange={e=>patchCard(c.id,{front:e.target.value})}/>
            <textarea rows="3" value={c.back} onChange={e=>patchCard(c.id,{back:e.target.value})}/>
            <button onClick={()=>mutate(s=>{s.config.cards=s.config.cards.filter(x=>x.id!==c.id)})}>Excluir card</button>
          </article>)}
        </div>}

        {status&&<div className={styles.status}>{status}</div>}
      </aside>
    </div>
  </div>;
}
