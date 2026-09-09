"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import styles from "./laboratorio-3d.module.css";
import Admin3DViewport from "./Admin3DViewport";
import {CAMERA_PRESETS,DAY_SHAPES,LIGHT_PRESETS,SCENE_TEMPLATES,DECORATIVE_OBJECTS,makeObject} from "./editor-presets";
import {ENVIRONMENT_PRESETS,DISPLAY_PRESETS,LIGHT_STACKS,MARITIME_ANCHORS,sceneCompleteness,performanceIssues} from "./editor-professional";
import {RIPEAM_RULES,CONDITION_LABELS,PERIOD_LABELS,SERVICE_LABELS,SIDE_LABELS,getRule,getSemanticItem,semanticBreadcrumb,semanticLabel} from "./ripeam-semantic";

const EMPTY={
  scene_key:"nova-cena",title:"Nova cena",rule_ref:"",card_title:"",description:"",status:"draft",
  config:{
    scenarioKey:"nova-cena",semantic:{ruleNumber:"",ruleItem:"",scenarioKey:"",condition:"",period:"",serviceStatus:"",side:"",towLength:"",fishingType:"",cardId:"",sourceRef:"",editorialNote:"",lockedToRule:false},objects:[],cards:[],timeline:{duration:10,loop:true,autoplay:false},
    settings:{snapEnabled:true,snapPosition:.25,snapRotation:15,snapScale:.05,showGrid:true,showSectors:true,showBounds:false,showAxes:false,wireframe:false,xray:false,previewMode:"day"},
    environment:{background:"#071522",ambient:"#7897bc",ambientIntensity:.9,sun:"#fff0cf",sunIntensity:2.2,sunPosition:[6,14,9],water:"#063b55",exposure:.95,fog:"#07121d",fogDensity:.026},
    camera:{position:[14,7,15],target:[0,1,0],fov:43},
    editorCamera:{position:[14,7,15],target:[0,1,0],fov:43}
  }
};
const BUILTIN=[
  {name:"Bulk Carrier",url:"/models/ripeam/bulk_carrier.glb",type:"glb",category:"Navios"},
  {name:"Tugboat",url:"/models/ripeam/Tugboat.glb",type:"glb",category:"Reboque"},
  {name:"Barge",url:"/models/ripeam/barge.fbx",type:"fbx",category:"Reboque"},
  {name:"Sailboat",url:"/models/ripeam/sailboat.glb",type:"glb",category:"Vela"},
  {name:"Fishing Vessel",url:"/models/ripeam/fishing_vessel.glb",type:"glb",category:"Pesca"},
  {name:"Pilot Boat",url:"/models/ripeam/pilot_boat.glb",type:"glb",category:"Praticagem"},
  {name:"Mine Clearance",url:"/models/ripeam/navy_mine_clearance.glb",type:"glb",category:"Especial"},
  {name:"Hidroavião",url:"/models/ripeam/hidroaviao.glb",type:"glb",category:"Regra 31"}
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
  const [future,setFuture]=useState([]);
  const [versions,setVersions]=useState([]);
  const [stats,setStats]=useState({triangles:0,meshes:0,lights:0,models:0,modelErrors:0,objects:0});
  const [assetFilter,setAssetFilter]=useState("");
  const [importMode,setImportMode]=useState("add");
  const [compare,setCompare]=useState(false);
  const [playhead,setPlayhead]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [autosave,setAutosave]=useState(true);
  const [lastEdit,setLastEdit]=useState(0);
  const [clipboard,setClipboard]=useState(null);
  const [publishedBaseline,setPublishedBaseline]=useState(null);
  const [abCompare,setAbCompare]=useState(null);
  const [importReport,setImportReport]=useState(null);
  const [showDiff,setShowDiff]=useState(false);
  const [healthReport,setHealthReport]=useState([]);
  const [healthBusy,setHealthBusy]=useState(false);
  const [preflight,setPreflight]=useState(null);
  const fileRef=useRef(null);

  const cfg=scene.config||EMPTY.config;
  const obj=cfg.objects?.find(o=>o.id===selected);
  const objAsset=assets.find(a=>a.url===obj?.assetUrl)||null;
  const objDiag=objAsset?.metadata?.glbDiagnostics||null;
  const semantic=cfg.semantic||EMPTY.config.semantic;
  const activeRule=getRule(semantic.ruleNumber);
  const semanticItem=getSemanticItem(semantic.ruleNumber,semantic.scenarioKey);
  const breadcrumbs=semanticBreadcrumb(semantic);
  const groupedScenes=useMemo(()=>{
    const map=new Map();
    for(const row of scenes){
      const n=String(row.config?.semantic?.ruleNumber||row.rule_ref||"").match(/\d+/)?.[0]||"unassigned";
      if(!map.has(n))map.set(n,[]);
      map.get(n).push(row);
    }
    return [...map.entries()].sort((a,b)=>a[0]==="unassigned"?1:b[0]==="unassigned"?-1:Number(a[0])-Number(b[0]));
  },[scenes]);
  const usage=useMemo(()=>{
    const map={};
    for(const s of scenes)for(const o of s.config?.objects||[])if(o.assetUrl)map[o.assetUrl]=(map[o.assetUrl]||0)+1;
    return map;
  },[scenes]);

  useEffect(()=>{load()},[]);

  useEffect(()=>{
    const handler=e=>{
      const tag=document.activeElement?.tagName;
      const editing=tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT";
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?redo():undo()}
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault();redo()}
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="d"&&selected){e.preventDefault();duplicateObject()}
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="c"&&selected&&!editing){e.preventDefault();const o=(scene.config?.objects||[]).find(x=>x.id===selected);if(o)setClipboard(clone(o))}
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="v"&&clipboard&&!editing){e.preventDefault();const n=clone(clipboard);n.id=uid();n.name+=" cópia";n.position=[...(n.position||[0,0,0])];n.position[0]+=.4;mutate(s=>s.config.objects.push(n));setSelected(n.id)}
      if(!editing&&e.key==="Delete"&&selected){e.preventDefault();removeObject()}
      if(!editing&&e.key.toLowerCase()==="g")setMode("translate");
      if(!editing&&e.key.toLowerCase()==="r")setMode("rotate");
      if(!editing&&e.key.toLowerCase()==="s")setMode("scale");
    };
    window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);
  });

  useEffect(()=>{
    if(!playing)return;
    let raf=0,last=performance.now();
    const tick=now=>{const dt=(now-last)/1000;last=now;setPlayhead(t=>{const d=Number(scene.config?.timeline?.duration||10);const n=t+dt;if(n>d){if(scene.config?.timeline?.loop!==false)return 0;setPlaying(false);return d}return n});raf=requestAnimationFrame(tick)};
    raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
  },[playing,scene.config?.timeline?.duration,scene.config?.timeline?.loop]);

  useEffect(()=>{
    if(!lastEdit||!scene.id||!autosave)return;
    const timer=setTimeout(()=>save("draft",{silent:true,versionLabel:"Autosave"}),1800);
    return()=>clearTimeout(timer);
  },[lastEdit,autosave,scene.id]);

  async function load(sceneId){
    const q=sceneId?"?sceneId="+encodeURIComponent(sceneId):"";
    const r=await fetch("/api/admin/laboratorio-3d"+q,{cache:"no-store"});
    const j=await r.json().catch(()=>({}));
    if(!r.ok){setStatus(j.error||"Não foi possível carregar as cenas.");return}
    setScenes(j.scenes||[]);
    const persisted=(j.assets||[]).map(a=>({id:a.id,name:a.name,url:a.url,type:a.asset_type,category:a.category||"Uploads",tags:a.tags||[],bytes:a.bytes,triangles:a.triangles,metadata:a.metadata||{}}));
    setAssets([...persisted,...BUILTIN.filter(b=>!persisted.some(a=>a.url===b.url))]);
    setVersions(j.versions||[]);
    if(j.scenes?.[0]&&!scene.id)openScene(j.scenes[0],false);
  }

  function openScene(row,fetchVersions=true){
    setScene({
      id:row.id,scene_key:row.scene_key,title:row.title,rule_ref:row.rule_ref||"",
      card_title:row.card_title||"",description:row.description||"",status:row.status,
      systemScene:!!row.systemScene,liveStudentScene:!!row.liveStudentScene,
      config:{...clone(EMPTY.config),...(row.config||{}),settings:{...EMPTY.config.settings,...(row.config?.settings||{})}}
    });
    setSelected(null);setHistory([]);setFuture([]);setAbCompare(null);
    setPublishedBaseline(row.publishedSnapshot?clone(row.publishedSnapshot):(row.systemScene?clone(row):null));
    if(fetchVersions&&row.id)load(row.id);
  }

  function commit(next){
    setHistory(h=>[...h.slice(-49),clone(scene)]);
    setFuture([]);
    setScene(next);
    setLastEdit(Date.now());
  }

  function mutate(fn){
    const n=clone(scene);fn(n);commit(n);
  }

  function undo(){
    setHistory(h=>{
      if(!h.length)return h;
      const prev=h[h.length-1];
      setFuture(f=>[clone(scene),...f].slice(0,50));
      setScene(prev);setLastEdit(Date.now());
      return h.slice(0,-1);
    });
  }

  function redo(){
    setFuture(f=>{
      if(!f.length)return f;
      const next=f[0];
      setHistory(h=>[...h.slice(-49),clone(scene)]);
      setScene(next);setLastEdit(Date.now());
      return f.slice(1);
    });
  }

  function addObject(base){
    const n=makeObject(base);mutate(s=>s.config.objects.push(n));setSelected(n.id);setTab("object");
  }

  function patchObject(p){
    if(!selected)return;
    mutate(s=>{const o=s.config.objects.find(x=>x.id===selected);if(o)Object.assign(o,p)});
  }

  function patchMaterial(p){
    if(!selected)return;
    mutate(s=>{const o=s.config.objects.find(x=>x.id===selected);if(o)o.material={...(o.material||{}),...p}});
  }

  function patchVec(key,i,v){
    if(!obj)return;
    const a=[...(obj[key]||[0,0,0])];a[i]=Number(v)||0;patchObject({[key]:a});
  }

  function removeObject(){
    if(!selected)return;
    mutate(s=>{
      s.config.objects=s.config.objects.filter(o=>o.id!==selected);
      for(const o of s.config.objects)if(o.parentId===selected)o.parentId=null;
    });
    setSelected(null);
  }

  function duplicateObject(){
    if(!obj)return;
    const n=clone(obj);n.id=uid();n.name+=" cópia";n.position=[...n.position];n.position[0]+=.5;
    mutate(s=>s.config.objects.push(n));setSelected(n.id);
  }

  function applyLightPreset(p){
    if(!p)return;
    addObject({name:p.label,type:"pointLight",color:p.color,intensity:p.intensity,distance:p.distance,sector:p.sector,lightPreset:p.key});
  }

  function applyTemplate(t){
    const next=clone(EMPTY);
    next.title=t.label;next.scene_key=t.key==="empty"?"nova-cena":t.key;next.rule_ref=t.rule_ref||"";next.card_title=t.card_title||"";
    next.config.scenarioKey=next.scene_key;
    const r=getRule(t.rule_ref);
    const item=r?.items.find(i=>i.key===t.key)||null;
    next.config.semantic={...EMPTY.config.semantic,ruleNumber:t.rule_ref||"",ruleItem:item?.item||"",scenarioKey:item?.key||t.key,condition:item?.condition||"",period:item?.period||"",serviceStatus:item?.serviceStatus||"",side:item?.side||"",towLength:item?.towLength||"",fishingType:item?.fishingType||"",sourceRef:"Deck RIPEAM / COLREG"};
    next.config.objects=(t.objects||[]).map(o=>makeObject(o));
    const expected=item?.expected||{},presetByKey=Object.fromEntries(LIGHT_PRESETS.map(p=>[p.key,p]));let y=3.4;
    for(const [preset,count] of expected.lights||[]){const p=presetByKey[preset];for(let i=0;i<count;i++){next.config.objects.push(makeObject({name:p?.label||preset,type:"pointLight",color:p?.color||"#fff2ba",intensity:p?.intensity||5,distance:p?.distance||14,sector:p?.sector||360,lightPreset:preset,position:[0,y,0]}));y+=.55}}
    for(const [shape,count] of expected.shapes||[])for(let i=0;i<count;i++)next.config.objects.push(makeObject({name:"Marca RIPEAM — "+shape,type:"shape",shape,color:"#111111",position:[0,3.2+i*.8,0]}));
    if(expected.cable){const models=next.config.objects.filter(o=>o.type==="model");if(models.length>=2)next.config.objects.push(makeObject({name:"Cabo de reboque",type:"cable",color:"#d9d0bb",cable:{fromId:models[0].id,toId:models[1].id,sag:.4}}))}
    commit(next);setSelected(null);setTab("scene");
  }

  function selectSemantic(ruleNumber,scenarioKey){
    const rule=getRule(ruleNumber);
    const item=rule?.items.find(i=>i.key===scenarioKey)||rule?.items[0]||null;
    mutate(s=>{
      s.rule_ref=rule?rule.number+(item?.item||""):"";
      s.scene_key=item?.key||s.scene_key;
      s.title=item?.label||s.title;
      s.card_title=item?.label||s.card_title;
      s.config.scenarioKey=item?.key||s.config.scenarioKey;
      s.config.semantic={...EMPTY.config.semantic,...(s.config.semantic||{}),
        ruleNumber:rule?.number||"",ruleItem:item?.item||"",scenarioKey:item?.key||"",
        condition:item?.condition||"",period:item?.period||"",serviceStatus:item?.serviceStatus||"",
        side:item?.side||"",towLength:item?.towLength||"",fishingType:item?.fishingType||"",
        sourceRef:"Deck RIPEAM / COLREG"
      };
    });
    setTab("scene");
  }

  function syncSemanticEquipment(){
    if(!semanticItem){setStatus("Selecione primeiro uma Regra e um cenário RIPEAM.");return}
    const expected=semanticItem.expected||{};
    const presetByKey=Object.fromEntries(LIGHT_PRESETS.map(p=>[p.key,p]));
    mutate(s=>{
      const objects=s.config.objects;
      const lights=objects.filter(o=>o.type?.includes("Light"));
      let y=3.4;
      for(const [preset,count] of expected.lights||[]){
        const have=lights.filter(l=>l.lightPreset===preset).length;
        const p=presetByKey[preset];
        for(let i=have;i<count;i++){
          objects.push(makeObject({name:p?.label||preset,type:"pointLight",color:p?.color||"#fff2ba",intensity:p?.intensity||5,distance:p?.distance||14,sector:p?.sector||360,lightPreset:preset,position:[0,y,0]}));y+=.55;
        }
      }
      for(const [shape,count] of expected.shapes||[]){
        const have=objects.filter(o=>o.type==="shape"&&o.shape===shape).length;
        for(let i=have;i<count;i++){objects.push(makeObject({name:"Marca RIPEAM — "+shape,type:"shape",shape,color:"#111111",position:[0,3.2+i*.8,0]}))}
      }
      if(expected.cable&&!objects.some(o=>o.type==="cable")){
        const models=objects.filter(o=>o.type==="model");
        if(models.length>=2)objects.push(makeObject({name:"Cabo de reboque",type:"cable",color:"#d9d0bb",cable:{fromId:models[0].id,toId:models[1].id,sag:.4}}));
      }
    });
    setStatus("Elementos semânticos ausentes foram adicionados como base de edição. Revise posições antes de publicar.");
  }

  function duplicateScene(){
    const n=clone(scene);delete n.id;n.scene_key=(scene.scene_key||"scene")+"-copy";n.title=(scene.title||"Cena")+" — cópia";n.status="draft";commit(n);
  }

  async function restore(versionId){
    const r=await fetch("/api/admin/laboratorio-3d",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"restore",versionId})});
    const j=await r.json().catch(()=>({}));if(!r.ok){setStatus(j.error||"Falha ao restaurar");return}
    openScene(j.scene);setStatus("Versão restaurada.");
  }

  async function inspectGlb(file){
    const report={ok:false,name:file?.name||"",bytes:file?.size||0,meshes:0,materials:0,materialSlots:0,textures:0,baseColorMaps:0,normalMaps:0,roughnessMaps:0,metalnessMaps:0,aoMaps:0,emissiveMaps:0,uvMeshes:0,missingUvMeshes:0,multiMaterialMeshes:0,embeddedTextures:true,bounds:null,error:""};
    if(!file||!String(file.name).toLowerCase().endsWith(".glb")){report.error="O arquivo precisa ser .glb.";return report}
    if(file.size<100){report.error="Arquivo GLB vazio ou inválido.";return report}
    const url=URL.createObjectURL(file);
    try{
      const THREE=await import(/* webpackIgnore:true */ "https://esm.sh/three@0.180.0");
      const {GLTFLoader}=await import(/* webpackIgnore:true */ "https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js");
      const gltf=await new GLTFLoader().loadAsync(url),root=gltf.scene;
      const materialSet=new Set(),textureSet=new Set();
      root.traverse(o=>{
        if(!o.isMesh)return;
        report.meshes++;
        const hasUv=!!o.geometry?.attributes?.uv;
        if(hasUv)report.uvMeshes++;else report.missingUvMeshes++;
        const mats=(Array.isArray(o.material)?o.material:[o.material]).filter(Boolean);
        report.materialSlots+=mats.length;
        if(mats.length>1)report.multiMaterialMeshes++;
        mats.forEach(m=>{
          materialSet.add(m);
          [["map","baseColorMaps"],["normalMap","normalMaps"],["roughnessMap","roughnessMaps"],["metalnessMap","metalnessMaps"],["aoMap","aoMaps"],["emissiveMap","emissiveMaps"]].forEach(([key,countKey])=>{
            const t=m[key];
            if(!t?.isTexture)return;
            textureSet.add(t);report[countKey]++;
            const src=String(t.image?.currentSrc||t.image?.src||"");
            if(src&&!(src.startsWith("blob:")||src.startsWith("data:")))report.embeddedTextures=false;
          });
        });
      });
      report.materials=materialSet.size;report.textures=textureSet.size;
      const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());report.bounds=size.toArray().map(v=>Number(v.toFixed(3)));
      if(report.meshes<1)throw new Error("GLB sem meshes renderizáveis.");
      if(box.isEmpty()||!report.bounds.every(Number.isFinite))throw new Error("Bounding box inválida.");
      report.ok=true;
    }catch(error){report.error=String(error?.message||error)}finally{URL.revokeObjectURL(url)}
    return report;
  }

  async function diagnoseCurrentAsset(){
    if(!obj?.assetUrl||obj.type!=="model"){setStatus("Selecione um modelo GLB para diagnosticar.");return}
    if((obj.assetType||"glb")!=="glb"){setStatus("O diagnóstico avançado está disponível para arquivos GLB.");return}
    try{
      setStatus("Analisando materiais, texturas e UVs do GLB...");
      const response=await fetch(obj.assetUrl,{cache:"no-store"});
      if(!response.ok)throw new Error("Não foi possível baixar o asset para diagnóstico.");
      const source=await response.blob();
      const filename=(obj.name||"modelo").toLowerCase().endsWith(".glb")?obj.name:(obj.name||"modelo")+".glb";
      const report=await inspectGlb(new File([source],filename,{type:"model/gltf-binary"}));
      setImportReport(report);
      if(!report.ok){setStatus("Diagnóstico falhou: "+report.error);return}
      const asset=assets.find(a=>a.url===obj.assetUrl);
      if(asset){
        const metadata={...(asset.metadata||{}),glbDiagnostics:report,materialModeDefault:"original"};
        const persist=await fetch("/api/admin/laboratorio-3d",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"asset",asset:{id:asset.id,name:asset.name,url:asset.url,asset_type:asset.type||"glb",category:asset.category||"Navios",tags:asset.tags||[],bytes:asset.bytes,triangles:asset.triangles,metadata}})});
        const saved=await persist.json().catch(()=>({}));
        if(persist.ok)setAssets(list=>list.map(a=>a.url===asset.url?{...a,metadata:saved.asset?.metadata||metadata}:a));
      }
      setStatus("Diagnóstico concluído. Material original, mapas PBR e UVs foram inspecionados.");
    }catch(error){
      setStatus("Diagnóstico falhou: "+String(error?.message||error));
    }
  }

  async function upload(file,mode=importMode){
    if(!file)return;
    const report=await inspectGlb(file);setImportReport(report);
    if(!report.ok){setStatus("Importação bloqueada: "+report.error);return}
    if(mode==="replace"&&(!obj||obj.type!=="model")){setStatus("Selecione no Outliner o navio/modelo que deseja substituir.");return}
    setStatus("GLB validado. Enviando para a biblioteca...");
    const fd=new FormData();fd.append("file",file);fd.append("category","Navios importados");fd.append("diagnostics",JSON.stringify(report));
    const r=await fetch("/api/admin/laboratorio-3d/upload",{method:"POST",body:fd});const j=await r.json().catch(()=>({}));
    if(!r.ok){setStatus(j.error||"Falha no upload");return}
    const a={id:j.asset?.id,name:file.name,url:j.url,type:"glb",category:j.asset?.category||"Navios importados",bytes:file.size,metadata:j.asset?.metadata||{glbDiagnostics:report}};setAssets(x=>[a,...x.filter(y=>y.url!==a.url)]);
    if(mode==="replace"){setAbCompare({selectedId:obj.id,original:clone(obj),candidate:a});setCompare(false);setStatus("GLB validado. Compare A/B antes de confirmar a substituição.");}
    else{addObject({name:a.name,assetUrl:a.url,assetType:"glb",type:"model",normalize:true,material:{mode:"original"}});setStatus("GLB validado e adicionado com material/texturas originais preservados.");}
  }

  function confirmReplacement(){
    if(!abCompare)return;const {selectedId,candidate}=abCompare;
    mutate(s=>{const o=s.config.objects.find(x=>x.id===selectedId);if(o){o.name=candidate.name;o.assetUrl=candidate.url;o.assetType="glb";o.normalize=true;o.material={mode:"original",color:"#ffffff",roughness:.5,metalness:.05,opacity:1,emissive:"#000000",doubleSide:false}}});
    setAbCompare(null);setStatus("Substituição confirmada localmente. Clique em Atualizar aluno para publicar.");
  }

  function addCard(){mutate(s=>s.config.cards.push({id:uid(),title:"Novo card",front:"Pergunta / situação",back:"Resposta / explicação",published:true}));setTab("cards")}
  function patchCard(id,p){mutate(s=>{const c=s.config.cards.find(x=>x.id===id);if(c)Object.assign(c,p)})}

  function saveStudentCamera(){
    mutate(s=>{s.config.camera=clone(s.config.editorCamera||s.config.camera)});
    setStatus("Câmera atual salva como câmera inicial do aluno.");
  }

  function setCameraPreset(p){
    mutate(s=>{s.config.editorCamera={...s.config.editorCamera,...p};});
  }

  function exportJson(){
    const blob=new Blob([JSON.stringify(scene,null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(scene.scene_key||"scene")+".json";a.click();URL.revokeObjectURL(a.href);
  }

  function importJson(file){
    const reader=new FileReader();
    reader.onload=()=>{try{const j=JSON.parse(reader.result);commit({...clone(EMPTY),...j,config:{...clone(EMPTY.config),...(j.config||{})}});setStatus("Cena JSON importada.")}catch{setStatus("JSON inválido.")}};
    reader.readAsText(file);
  }

  function align(axis){
    if(!obj)return;const i={x:0,y:1,z:2}[axis];patchVec("position",i,0);
  }

  function mirror(axis){
    if(!obj)return;const i={x:0,y:1,z:2}[axis];const p=[...obj.position];p[i]*=-1;patchObject({position:p});
  }

  function addKeyframe(){
    if(!obj){setStatus("Selecione um objeto para criar keyframe.");return}
    const frame={t:Number(playhead.toFixed(2)),position:[...obj.position],rotation:[...obj.rotation],scale:[...obj.scale]};
    mutate(s=>{const o=s.config.objects.find(x=>x.id===obj.id);o.keyframes=[...(o.keyframes||[]).filter(k=>Math.abs(k.t-frame.t)>.01),frame].sort((a,b)=>a.t-b.t)});
    setStatus("Keyframe adicionado em "+frame.t+"s.");
  }

  function createCable(){
    const models=cfg.objects.filter(o=>o.type==="model");if(models.length<2){setStatus("Adicione ao menos dois objetos para criar um cabo.");return}
    addObject({name:"Cabo de reboque",type:"cable",color:"#d9d0bb",cable:{fromId:models[0].id,toId:models[1].id,sag:.4}});
  }

  function applyEnvironmentPreset(p){
    mutate(s=>{s.config.environment={...s.config.environment,...p.environment};s.config.settings={...s.config.settings,...p.settings}});
    setStatus("Ambiente aplicado: "+p.label+".");
  }

  function applyDisplayPreset(p){
    mutate(s=>{s.config.settings={...s.config.settings,...p.settings}});
    setStatus("Workspace visual: "+p.label+".");
  }

  function addLightStack(stack){
    const model=cfg.objects.find(o=>o.type==="model");
    const parentId=model?.id||null;
    const baseY=4.2,spacing=.62;
    mutate(s=>{
      stack.colors.forEach((color,i)=>{
        const presetKey=stack.presets[i];
        const preset=LIGHT_PRESETS.find(p=>p.key===presetKey);
        s.config.objects.push(makeObject({name:stack.label+" "+(i+1),type:"pointLight",color,lightPreset:presetKey,sector:preset?.sector||360,intensity:preset?.intensity||5,distance:preset?.distance||14,position:[0,baseY-i*spacing,0],parentId,anchorName:"masthead"}));
      });
    });
    setStatus("Stack RIPEAM adicionado: "+stack.label+".");
  }

  async function runAssetHealthCheck(){
    if(healthBusy)return;
    setHealthBusy(true);setStatus("Executando Health Check de assets...");
    const rows=[];
    for(const asset of assets){
      const item={name:asset.name,url:asset.url,type:asset.type,status:"OK",issues:[]};
      try{
        const response=await fetch(asset.url,{method:"HEAD",cache:"no-store"});
        if(!response.ok){item.status="ERRO";item.issues.push("HTTP "+response.status);}
      }catch{item.status="ERRO";item.issues.push("Falha de rede");}
      const d=asset.metadata?.glbDiagnostics;
      if(d?.missingUvMeshes){item.status=item.status==="ERRO"?"ERRO":"ALERTA";item.issues.push(d.missingUvMeshes+" mesh(es) sem UV");}
      if(d?.embeddedTextures===false){item.status=item.status==="ERRO"?"ERRO":"ALERTA";item.issues.push("Textura externa");}
      if((asset.bytes||0)>40*1024*1024){item.status=item.status==="ERRO"?"ERRO":"ALERTA";item.issues.push("Asset > 40 MB");}
      if(!(usage[asset.url]||0))item.issues.push("Não utilizado");
      rows.push(item);
    }
    setHealthReport(rows);setHealthBusy(false);
    const bad=rows.filter(x=>x.status==="ERRO").length,warn=rows.filter(x=>x.status==="ALERTA").length;
    setStatus("Health Check concluído: "+bad+" erro(s), "+warn+" alerta(s).");
  }

  const validation=useMemo(()=>{
    const warnings=[],errors=[];
    const objects=cfg.objects||[],lights=objects.filter(o=>o.type?.includes("Light")),shapes=objects.filter(o=>o.type==="shape");
    if(!semantic.ruleNumber)errors.push("Cena sem Regra RIPEAM vinculada.");
    if(semantic.ruleNumber&&!semantic.scenarioKey)errors.push("Selecione o cenário/item semântico da Regra "+semantic.ruleNumber+".");
    if(!objects.some(o=>o.type==="model")&&activeRule?.kind==="scene")errors.push("Nenhum modelo 3D na cena.");
    if(objects.some(o=>o.type==="model"&&!o.assetUrl))errors.push("Há modelo 3D sem asset associado.");
    if(stats.modelErrors>0)errors.push(stats.modelErrors+" modelo(s) falharam ao carregar no viewport.");
    const expected=semanticItem?.expected||{};
    for(const [preset,count] of expected.lights||[]){
      const have=lights.filter(l=>l.lightPreset===preset).length;
      if(have<count)warnings.push("Esperado: "+count+" × "+(LIGHT_PRESETS.find(p=>p.key===preset)?.label||preset)+"; configurado: "+have+".");
    }
    for(const [shape,count] of expected.shapes||[]){
      const have=shapes.filter(x=>x.shape===shape).length;
      if(have<count)warnings.push("Marca diurna esperada: "+count+" × "+(DAY_SHAPES.find(p=>p.shape===shape)?.label||shape)+".");
    }
    if(expected.cable&&!objects.some(o=>o.type==="cable"))warnings.push("Cenário de reboque sem cabo representado.");
    const presetByKey=Object.fromEntries(LIGHT_PRESETS.map(p=>[p.key,p]));
    for(const light of lights){
      const preset=presetByKey[light.lightPreset];if(!preset)continue;
      if(Math.abs(Number(light.sector||0)-Number(preset.sector))>.1)errors.push(light.name+": setor "+light.sector+"° diverge do preset RIPEAM "+preset.sector+"°.");
      if(String(light.color||"").toLowerCase()!==String(preset.color||"").toLowerCase())warnings.push(light.name+": cor diverge do preset "+preset.label+".");
    }
    const port=lights.filter(l=>l.lightPreset==="port"),starboard=lights.filter(l=>l.lightPreset==="starboard");
    if(port.some(l=>Number(l.heading||0)>0))warnings.push("Luz(es) de bombordo com heading positivo; revise orientação BB/BE.");
    if(starboard.some(l=>Number(l.heading||0)<0))warnings.push("Luz(es) de boreste com heading negativo; revise orientação BB/BE.");
    if(semantic.ruleNumber==="29"&&semantic.serviceStatus!=="pilotage-duty")warnings.push("Regra 29: confirme se a embarcação está efetivamente em serviço de praticagem.");
    if(semantic.lockedToRule&&(!semanticItem||scene.scene_key!==semantic.scenarioKey))errors.push("Vínculo semântico travado, mas a chave da cena diverge do cenário RIPEAM.");
    const duplicated=objects.map(o=>o.name).filter((n,i,a)=>a.indexOf(n)!==i);if(duplicated.length)warnings.push("Há objetos com nomes duplicados.");
    if(stats.triangles>350000)warnings.push("Cena pesada para mobile: mais de 350 mil triângulos.");
    for(const issue of performanceIssues(stats))warnings.push("Performance: "+issue+".");
    return {errors,warnings};
  },[cfg.objects,semantic,semanticItem,activeRule,scene.scene_key,stats]);

  const publishDiff=useMemo(()=>{
    if(!publishedBaseline)return [{kind:"new",label:"Cena ainda não possui baseline publicada nesta sessão."}];
    const before=publishedBaseline.config||{},after=scene.config||{},changes=[],bm=new Map((before.objects||[]).map(o=>[o.id,o]));
    for(const o of after.objects||[]){const p=bm.get(o.id);if(!p){changes.push({kind:"add",label:"Adicionado: "+o.name});continue}
      for(const key of ["position","rotation","scale","assetUrl","visible","intensity","lightSize","distance","sector","heading","color"])if(JSON.stringify(p[key])!==JSON.stringify(o[key]))changes.push({kind:"edit",label:o.name+" · "+key+": "+JSON.stringify(p[key])+" → "+JSON.stringify(o[key])});bm.delete(o.id)}
    for(const o of bm.values())changes.push({kind:"remove",label:"Removido: "+o.name});
    if(JSON.stringify(before.camera)!==JSON.stringify(after.camera))changes.push({kind:"edit",label:"Câmera inicial alterada."});
    if(JSON.stringify(before.environment)!==JSON.stringify(after.environment))changes.push({kind:"edit",label:"Ambiente alterado."});return changes;
  },[scene,publishedBaseline]);

  async function save(nextStatus="draft",{silent=false,versionLabel}={}){
    if(busy)return;
    setBusy(true);if(!silent)setStatus("Salvando rascunho...");
    const safeStatus=nextStatus==="archived"?"archived":nextStatus==="review"?"review":"draft";
    const payload={...scene,id:scene.systemScene?undefined:scene.id,status:safeStatus,versionLabel,skipVersion:silent,config:{...scene.config,scenarioKey:scene.scene_key}};
    const r=await fetch("/api/admin/laboratorio-3d",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"save",scene:payload})});
    const j=await r.json().catch(()=>({}));setBusy(false);
    if(!r.ok){setStatus(j.error||"Erro ao salvar");return}
    setScene(s=>({...s,id:j.scene.id,status:j.scene.status,systemScene:false,config:j.scene.config}));
    if(!silent)setStatus("Rascunho salvo. O aluno não recebeu estas alterações.");
    await load(j.scene.id);
  }

  async function publishStudent(){
    if(busy)return;
    const assetErrors=(healthReport||[]).filter(x=>x.status==="ERRO"&&cfg.objects.some(o=>o.assetUrl===x.url));
    const pf={errors:[...validation.errors,...assetErrors.map(x=>"Asset indisponível: "+x.name)],warnings:[...validation.warnings],stats};
    setPreflight(pf);
    if(pf.errors.length){setStatus("Atualização do aluno bloqueada pelo preflight: "+pf.errors.length+" erro(s).");setTab("scene");return}
    const summary=publishDiff.length?publishDiff.slice(0,8).map(d=>"• "+d.label).join("\n"):"Nenhuma diferença detectada.";
    if(!window.confirm("ATUALIZAR ALUNO?\n\nEsta é a única ação que publica a working copy.\n\n"+summary+"\n\nConfirmar publicação?"))return;
    setBusy(true);setStatus("Validando e atualizando a cena do aluno...");
    const payload={...scene,id:scene.systemScene?undefined:scene.id,status:"review",versionLabel:"Atualizar aluno",config:{...scene.config,scenarioKey:scene.scene_key}};
    const r=await fetch("/api/admin/laboratorio-3d",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"publish",scene:payload})});
    const j=await r.json().catch(()=>({}));setBusy(false);
    if(!r.ok){setStatus(j.error||"Falha ao atualizar aluno");return}
    const baseline=clone(j.publishedSnapshot||j.scene?.publishedSnapshot||j.scene);
    setPublishedBaseline(baseline);
    setScene(s=>({...s,id:j.scene.id,status:"review",systemScene:false,liveStudentScene:true,config:j.scene.config}));
    setStatus("Aluno atualizado manualmente com esta versão. Alterações futuras continuarão privadas até novo clique em Atualizar aluno.");
    await load(j.scene.id);
  }


  const filteredAssets=assets.filter(a=>(a.name+" "+(a.category||"")+" "+(a.tags||[]).join(" ")).toLowerCase().includes(assetFilter.toLowerCase()));
  const completeness=sceneCompleteness({semantic,objects:cfg.objects,stats,errors:validation.errors,warnings:validation.warnings});
  const progress=String(cfg.objects?.length||0)+" objetos · "+String(cfg.cards?.length||0)+" cards · "+completeness+"% completo";

  return <div className={styles.editorShell}>
    <div className={styles.topbar}>
      <div><b>ESTIBORDO · EDITOR 3D PRO</b><span>{semanticLabel(semantic)} · {progress} · {scene.liveStudentScene?"AO VIVO NO ALUNO":scene.status}</span></div>
      <div className={styles.topActions}>
        <button onClick={undo} disabled={!history.length}>↶ Undo</button><button onClick={redo} disabled={!future.length}>↷ Redo</button>
        <button onClick={duplicateScene}>Duplicar cena</button><button onClick={()=>setScene(clone(EMPTY))}>＋ Nova cena</button>
        <select value={scene.status==="published"?"review":scene.status} onChange={e=>setScene(s=>({...s,status:e.target.value}))}><option value="draft">Rascunho</option><option value="review">Revisão</option><option value="archived">Arquivado</option></select>
        <button disabled={busy} onClick={()=>save(scene.status)}>Salvar rascunho</button>
        <button onClick={()=>setShowDiff(v=>!v)} title="Ver alterações desde a última publicação">Diff ({publishDiff.length})</button><button className={styles.publish} disabled={busy||validation.errors.length>0} title={validation.errors.length?"Corrija os erros críticos antes de atualizar o aluno":"Única ação que envia a working copy atual para o aluno."} onClick={publishStudent}>{scene.liveStudentScene?"Atualizar aluno":"Adicionar ao aluno"}</button>
      </div>
    </div>

    {showDiff&&<div className={styles.diffPanel}><b>ALTERAÇÕES PENDENTES PARA O ALUNO</b>{publishDiff.length?publishDiff.slice(0,80).map((d,i)=><p key={i} data-kind={d.kind}>{d.label}</p>):<p>Nenhuma alteração detectada.</p>}{validation.errors.length>0&&<strong>Publicação bloqueada: {validation.errors.length} erro(s) crítico(s).</strong>}</div>}<div className={styles.workspace}>
      <aside className={styles.leftPane}>
        <h3>ÁRVORE RIPEAM / CENAS</h3>
        <div className={styles.ruleTree}>{groupedScenes.map(([ruleNo,rows])=><section key={ruleNo}><div className={styles.ruleTreeHead}>{ruleNo==="unassigned"?"SEM REGRA":"REGRA "+ruleNo}<small>{getRule(ruleNo)?.title||"Cenas não vinculadas"}</small></div><div className={styles.sceneList}>{rows.map(row=><button key={row.id} className={row.id===scene.id?styles.active:""} onClick={()=>openScene(row)}><b>{row.title}</b><small>{semanticLabel(row.config?.semantic||{ruleNumber:String(row.rule_ref||"").match(/\d+/)?.[0]||""})} · {row.liveStudentScene?"● AO VIVO NO ALUNO":row.status}</small></button>)}</div></section>)}</div>
        <h3>TEMPLATES · CRIAR NOVA CENA</h3><div className={styles.chips}>{SCENE_TEMPLATES.map(t=><button key={t.key} onClick={()=>applyTemplate(t)}>{t.label}</button>)}</div>

        <h3>OUTLINER</h3>
        <div className={styles.outliner}>{(cfg.objects||[]).map(o=><button key={o.id} className={selected===o.id?styles.active:""} onClick={()=>{setSelected(o.id);setTab("object")}} style={{paddingLeft:8+(o.parentId?14:0)}}><span>{o.type.includes("Light")?"💡":o.type==="shape"?"◆":o.type==="cable"?"〰":o.type==="measure"?"↔":o.type==="hotspot"?"◉":"◫"}</span><b>{o.name}</b><small>{o.locked?"🔒":""}</small></button>)}</div>

        <h3>ADICIONAR</h3>
        <div className={styles.addGrid}>
          <button onClick={()=>addObject({name:"Luz livre",type:"pointLight",color:"#fff2ba"})}>＋ Luz</button>
          <button onClick={()=>addObject({name:"Marca diurna",type:"shape",shape:"ball",color:"#111111"})}>＋ Marca</button>
          <button onClick={()=>addObject({name:"Hotspot",type:"hotspot",color:"#38bdf8",hotspot:{title:"Hotspot",body:"Informação didática"}})}>＋ Hotspot</button>
          <button onClick={createCable}>＋ Cabo</button><button onClick={()=>addObject({...DECORATIVE_OBJECTS[0]})}>＋ Bandeira CIS</button><button onClick={()=>{const m=cfg.objects.filter(o=>o.type==="model");if(m.length<2){setStatus("Adicione dois modelos para medir.");return}addObject({name:"Régua 3D",type:"measure",color:"#38bdf8",cable:{fromId:m[0].id,toId:m[1].id,sag:0}})}}>＋ Régua</button>
        </div>
        <h3>PRESETS RIPEAM</h3><div className={styles.presetList}>{LIGHT_PRESETS.map(p=><button key={p.key} onClick={()=>applyLightPreset(p)}><i style={{background:p.color}}/> {p.label}<small>{p.sector}°</small></button>)}</div>
        <h3>STACKS RIPEAM</h3><div className={styles.presetList}>{LIGHT_STACKS.map(s=><button key={s.key} onClick={()=>addLightStack(s)}><span>⋮</span>{s.label}<small>{s.colors.length} luzes</small></button>)}</div>

        <h3>OBJETOS DECORATIVOS</h3><div className={styles.presetList}>{DECORATIVE_OBJECTS.map(d=><button key={d.key} onClick={()=>addObject({...d})}><span>⚑</span>{d.label}<small>CIS</small></button>)}</div>
        <h3>ASSET HEALTH</h3><button className={styles.full} disabled={healthBusy} onClick={runAssetHealthCheck}>{healthBusy?"Testando assets...":"Testar todos os assets"}</button>{healthReport.length>0&&<div className={styles.healthList}>{healthReport.map((h,i)=><p key={h.url+i} data-status={h.status}><b>{h.status}</b> {h.name}<small>{h.issues.join(" · ")||"OK"}</small></p>)}</div>}<h3>VALIDADOR SEMÂNTICO</h3><div className={validation.errors.length?styles.errors:validation.warnings.length?styles.warnings:styles.valid}>{validation.errors.map((w,i)=><p key={"e"+i}>✕ {w}</p>)}{validation.warnings.map((w,i)=><p key={"w"+i}>⚠ {w}</p>)}{!validation.errors.length&&!validation.warnings.length&&<p>✓ Cena coerente com o vínculo semântico configurado.</p>}</div>
      </aside>

      <section className={styles.centerPane}>
        <div className={semantic.ruleNumber?styles.semanticBanner:styles.semanticBannerMissing}>
          <div><span>{semantic.ruleNumber?"CENA RIPEAM VINCULADA":"ATENÇÃO · CENA NÃO VINCULADA"}</span><strong>{semanticLabel(semantic)}</strong><small>{breadcrumbs.join(" → ")||"Selecione a Regra e o cenário na aba Cena antes de publicar."}</small></div>
          <div className={styles.semanticRight}><div className={styles.semanticBadges}>{semantic.condition&&<b>{CONDITION_LABELS[semantic.condition]||semantic.condition}</b>}{semantic.period&&<b>{PERIOD_LABELS[semantic.period]||semantic.period}</b>}{semantic.side&&<b>{SIDE_LABELS[semantic.side]||semantic.side}</b>}{semantic.lockedToRule&&<b>🔒 Vínculo travado</b>}{scene.liveStudentScene&&<b>● CENA DO ALUNO</b>}<b>{validation.errors.length?"BLOQUEADO":validation.warnings.length?validation.warnings.length+" ALERTAS":"PRONTO"}</b></div>{semanticItem&&<button className={styles.semanticSync} onClick={syncSemanticEquipment}>＋ Completar base RIPEAM</button>}</div>
        </div>
        <div className={styles.viewportToolbar}>
          <button className={mode==="translate"?styles.active:""} onClick={()=>setMode("translate")}>↔ Mover</button>
          <button className={mode==="rotate"?styles.active:""} onClick={()=>setMode("rotate")}>⟳ Rotacionar</button>
          <button className={mode==="scale"?styles.active:""} onClick={()=>setMode("scale")}>⤢ Escalar</button>
          <button className={cfg.settings.snapEnabled?styles.active:""} onClick={()=>mutate(s=>{s.config.settings.snapEnabled=!s.config.settings.snapEnabled})}>⌗ Snap</button>
          <button onClick={()=>mutate(s=>{s.config.settings.showGrid=!s.config.settings.showGrid})}># Grade</button>
          <button onClick={()=>mutate(s=>{s.config.settings.showSectors=!s.config.settings.showSectors})}>◔ Setores</button>
          <button className={cfg.settings.previewMode==="night"?styles.active:""} onClick={()=>mutate(s=>{s.config.settings.previewMode=s.config.settings.previewMode==="day"?"night":"day"})}>☾ Dia/Noite</button>
          <button onClick={()=>setCompare(x=>!x)}>▥ Comparar</button>
          <select value="" onChange={e=>{const p=DISPLAY_PRESETS.find(x=>x.key===e.target.value);if(p)applyDisplayPreset(p)}}><option value="">Workspace...</option>{DISPLAY_PRESETS.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}</select>
          <span>{stats.triangles.toLocaleString("pt-BR")} tri · {stats.drawCalls||0} draws · {stats.textures||0} tex · {stats.estimatedTextureMB||0} MB VRAM · {stats.modelErrors?stats.modelErrors+" GLB com erro":"assets OK"}</span>
        </div>

        <div className={compare?styles.compareGrid:styles.singleViewport}>
          <Admin3DViewport scene={cfg} selectedId={selected} mode={mode} playhead={playhead} onSelect={setSelected} onTransform={(id,t)=>{if(id===selected)patchObject(t)}} onCameraChange={cam=>setScene(s=>({...s,config:{...s.config,editorCamera:cam}}))} onStats={setStats}/>
          {compare&&<Admin3DViewport scene={{...cfg,settings:{...cfg.settings,previewMode:cfg.settings.previewMode==="day"?"night":"day"}}} readOnly playhead={playhead} onStats={()=>{}}/>}{abCompare&&<Admin3DViewport scene={{...cfg,objects:(cfg.objects||[]).map(o=>o.id===abCompare.selectedId?{...o,name:abCompare.candidate.name,assetUrl:abCompare.candidate.url,assetType:"glb"}:o)}} readOnly playhead={playhead} onStats={()=>{}}/>}
        </div>

        <div className={styles.timelineBar}>
          <button onClick={()=>setPlaying(x=>!x)}>{playing?"❚❚ Pausar":"▶ Reproduzir"}</button>
          <button onClick={()=>setPlayhead(0)}>⏮</button>
          <input type="range" min="0" max={cfg.timeline?.duration||10} step=".05" value={playhead} onChange={e=>setPlayhead(Number(e.target.value))}/>
          <span>{playhead.toFixed(2)}s / {Number(cfg.timeline?.duration||10).toFixed(1)}s</span>
          <button onClick={addKeyframe}>◆ Keyframe</button>
          <label>Duração <input type="number" min="1" max="600" value={cfg.timeline?.duration||10} onChange={e=>mutate(s=>{s.config.timeline={...(s.config.timeline||{}),duration:Number(e.target.value)||10}})}/></label>
          <label><input type="checkbox" checked={cfg.timeline?.loop!==false} onChange={e=>mutate(s=>{s.config.timeline={...(s.config.timeline||{}),loop:e.target.checked}})}/> Loop</label>
        </div>
        <div className={styles.cameraBar}>
          <b>Câmera:</b>{Object.values(CAMERA_PRESETS).map(p=><button key={p.label} onClick={()=>setCameraPreset(p)}>{p.label}</button>)}<button onClick={saveStudentCamera}>Salvar câmera do aluno</button>
        </div>

        {abCompare&&<div className={styles.abBar}><b>COMPARAÇÃO A/B</b><span>A = {abCompare.original.name}</span><span>B = {abCompare.candidate.name}</span><button onClick={confirmReplacement}>Confirmar B</button><button onClick={()=>setAbCompare(null)}>Cancelar</button></div>}{importReport&&<div className={importReport.ok?styles.importOk:styles.errors}><b>Pré-processamento GLB:</b> {importReport.ok?"OK":"FALHA"} · {importReport.meshes} meshes · {importReport.materials} materiais · {importReport.textures} texturas · {(importReport.bounds||[]).join(" × ")}{importReport.error?" · "+importReport.error:""}</div>}<div className={styles.assetShelf}>
          <div className={styles.assetHead}><b>Biblioteca persistente 3D</b><input placeholder="Buscar assets..." value={assetFilter} onChange={e=>setAssetFilter(e.target.value)}/>
            <select value={importMode} onChange={e=>setImportMode(e.target.value)} title="Escolha se o GLB será adicionado ou substituirá o modelo selecionado"><option value="add">Adicionar novo navio</option><option value="replace">Substituir selecionado</option></select>
            <label><input type="file" accept=".glb,model/gltf-binary" onChange={e=>{upload(e.target.files?.[0],importMode);e.target.value=""}}/>＋ Importar GLB do PC</label>
          </div>
          <div className={styles.assetGrid}>{filteredAssets.map((a,i)=>{const d=a.metadata?.glbDiagnostics;return <button key={a.url+i} onClick={()=>addObject({name:a.name,assetUrl:a.url,assetType:a.type,type:"model",normalize:true,material:{mode:"original"}})}><b>{a.name}</b><small>{String(a.type||"").toUpperCase()} · {a.category||"Asset"} · usado {usage[a.url]||0}x</small>{a.bytes&&<small>{(a.bytes/1024/1024).toFixed(1)} MB</small>}{d&&<small>{d.materials||0} materiais · {d.textures||0} texturas · UV {d.missingUvMeshes?"atenção":"OK"}</small>}</button>})}</div>
        </div>
      </section>

      <aside className={styles.inspector}>
        <div className={styles.tabs}>{["object","scene","cards","history"].map(t=><button key={t} className={tab===t?styles.active:""} onClick={()=>setTab(t)}>{t==="object"?"Objeto":t==="scene"?"Cena":t==="cards"?"Cards":"Histórico"}</button>)}</div>

        {tab==="object"&&obj&&<div className={styles.form}>
          <label>Nome<input value={obj.name} onChange={e=>patchObject({name:e.target.value})}/></label>
          <label>Hierarquia / pai<select value={obj.parentId||""} onChange={e=>patchObject({parentId:e.target.value||null})}><option value="">Raiz da cena</option>{cfg.objects.filter(o=>o.id!==obj.id&&o.type!=="cable").map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
          <label>Anchor marítimo<select value={obj.anchorName||""} onChange={e=>patchObject({anchorName:e.target.value})}><option value="">Sem anchor</option>{MARITIME_ANCHORS.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label>
          <div className={styles.inlineChecks}><label><input type="checkbox" checked={obj.visible!==false} onChange={e=>patchObject({visible:e.target.checked})}/> Visível</label><label><input type="checkbox" checked={!!obj.locked} onChange={e=>patchObject({locked:e.target.checked})}/> Travado</label>{obj.type==="model"&&<label><input type="checkbox" checked={obj.normalize!==false} onChange={e=>patchObject({normalize:e.target.checked})}/> Normalizar</label>}</div>

          <div className={styles.vecTitle}>Posição</div><div className={styles.vec}>{["X","Y","Z"].map((x,i)=><label key={x}>{x}<input type="number" step=".1" value={obj.position[i]} onChange={e=>patchVec("position",i,e.target.value)}/></label>)}</div>
          <div className={styles.miniActions}><button onClick={()=>align("x")}>X=0</button><button onClick={()=>align("y")}>Y=0</button><button onClick={()=>align("z")}>Z=0</button><button onClick={()=>mirror("x")}>Espelhar X</button><button onClick={()=>mirror("z")}>Espelhar Z</button></div>
          <div className={styles.vecTitle}>Rotação (rad)</div><div className={styles.vec}>{["X","Y","Z"].map((x,i)=><label key={x}>{x}<input type="number" step=".05" value={obj.rotation[i]} onChange={e=>patchVec("rotation",i,e.target.value)}/></label>)}</div>
          <div className={styles.vecTitle}>Escala</div><div className={styles.vec}>{["X","Y","Z"].map((x,i)=><label key={x}>{x}<input type="number" step=".05" value={obj.scale[i]} onChange={e=>patchVec("scale",i,e.target.value)}/></label>)}</div>
          {obj.type==="model"&&<><div className={styles.vecTitle}>Pivô</div><div className={styles.vec}>{["X","Y","Z"].map((x,i)=><label key={x}>{x}<input type="number" step=".05" value={(obj.pivot||[0,0,0])[i]} onChange={e=>patchVec("pivot",i,e.target.value)}/></label>)}</div>
            <h4>Material do modelo</h4>
            <div className={styles.materialMode}>
              <button className={(obj.material?.mode||"original")==="original"?styles.materialActive:""} onClick={()=>patchMaterial({mode:"original"})}>Usar material original do GLB</button>
              <button className={obj.material?.mode==="custom"?styles.materialActive:""} onClick={()=>patchMaterial({mode:"custom"})}>Personalizar material</button>
            </div>
            <div className={styles.materialHint}>{(obj.material?.mode||"original")==="original"?"Base Color, Normal, Roughness, Metallic, AO, Emissive, UVs, transparência e materiais múltiplos são preservados do arquivo.":"As propriedades abaixo passam a sobrescrever os materiais importados."}</div>
            {obj.assetType==="glb"&&<button type="button" className={styles.assetDiagnosticButton} onClick={diagnoseCurrentAsset}>Diagnosticar materiais e texturas agora</button>}
            {objDiag&&<div className={styles.materialDiag}><b>Diagnóstico do asset</b><span>{objDiag.materials||0} materiais únicos · {objDiag.materialSlots||0} slots</span><span>{objDiag.textures||0} texturas · {objDiag.baseColorMaps||0} Base Color · {objDiag.normalMaps||0} Normal</span><span>{objDiag.roughnessMaps||0} Roughness · {objDiag.metalnessMaps||0} Metallic · {objDiag.aoMaps||0} AO · {objDiag.emissiveMaps||0} Emissive</span><span>UVs: {objDiag.missingUvMeshes?objDiag.missingUvMeshes+" mesh(es) sem UV":"OK"} · Materiais múltiplos: {objDiag.multiMaterialMeshes||0} mesh(es)</span><span>Texturas incorporadas: {objDiag.embeddedTextures===false?"não / referência externa detectada":"sim"}</span></div>}
            {obj.material?.mode==="custom"&&<><label>Cor<input type="color" value={obj.material?.color||"#ffffff"} onChange={e=>patchMaterial({color:e.target.value})}/></label><label>Emissive<input type="color" value={obj.material?.emissive||"#000000"} onChange={e=>patchMaterial({emissive:e.target.value})}/></label><label>Roughness<input type="range" min="0" max="1" step=".01" value={obj.material?.roughness??.5} onChange={e=>patchMaterial({roughness:Number(e.target.value)})}/></label><label>Metalness<input type="range" min="0" max="1" step=".01" value={obj.material?.metalness??.05} onChange={e=>patchMaterial({metalness:Number(e.target.value)})}/></label><label>Opacidade<input type="range" min="0" max="1" step=".01" value={obj.material?.opacity??1} onChange={e=>patchMaterial({opacity:Number(e.target.value)})}/></label><label><input type="checkbox" checked={!!obj.material?.doubleSide} onChange={e=>patchMaterial({doubleSide:e.target.checked})}/> Renderizar frente e verso</label></>}
            <label>LOD mobile<input type="checkbox" checked={!!obj.lod?.enabled} onChange={e=>patchObject({lod:{...(obj.lod||{}),enabled:e.target.checked}})}/></label></>}

          {obj.type?.includes("Light")&&<><h4>Luz RIPEAM</h4><label>Cor<input type="color" value={obj.color} onChange={e=>patchObject({color:e.target.value})}/></label><label>Setor (°)<input type="number" min="0" max="360" step=".5" value={obj.sector||360} onChange={e=>patchObject({sector:Number(e.target.value)})}/></label><label>Rumo do setor (°)<input type="number" value={obj.heading||0} onChange={e=>patchObject({heading:Number(e.target.value)})}/></label><label>Intensidade<input type="range" min="0" max="20" step=".1" value={obj.intensity} onChange={e=>patchObject({intensity:Number(e.target.value)})}/></label><label>Alcance visual<input type="number" value={obj.distance} onChange={e=>patchObject({distance:Number(e.target.value)})}/></label></>}

          {obj.type==="shape"&&<label>Marca diurna<select value={obj.shape||"ball"} onChange={e=>patchObject({shape:e.target.value})}>{DAY_SHAPES.map(s=><option key={s.key} value={s.shape}>{s.label}</option>)}</select></label>}
          {obj.type==="hotspot"&&<><label>Título<input value={obj.hotspot?.title||""} onChange={e=>patchObject({hotspot:{...(obj.hotspot||{}),title:e.target.value}})}/></label><label>Texto<textarea value={obj.hotspot?.body||""} onChange={e=>patchObject({hotspot:{...(obj.hotspot||{}),body:e.target.value}})}/></label></>}

          {obj.keyframes?.length>0&&<><h4>Keyframes</h4><div className={styles.keyframes}>{obj.keyframes.map((k,i)=><button key={i} onClick={()=>setPlayhead(k.t)}>{k.t.toFixed(2)}s</button>)}</div></>}<div className={styles.row}><button onClick={duplicateObject}>Duplicar Ctrl+D</button><button className={styles.danger} onClick={removeObject}>Excluir Del</button></div>
        </div>}

        {tab==="object"&&!obj&&<div className={styles.empty}>Selecione um objeto. Atalhos: G mover · R rotacionar · S escalar · Ctrl+C/Ctrl+V · Ctrl+D duplicar · Del excluir.</div>}

        {tab==="scene"&&<div className={styles.form}>
          <h4>Identidade RIPEAM</h4>
          <label>Regra<select value={semantic.ruleNumber||""} onChange={e=>selectSemantic(e.target.value,getRule(e.target.value)?.items?.[0]?.key||"")}><option value="">Selecione a Regra...</option>{RIPEAM_RULES.map(r=><option key={r.number} value={r.number}>Regra {r.number} — {r.title}</option>)}</select></label>
          <label>Item / cenário<select value={semantic.scenarioKey||""} disabled={!activeRule} onChange={e=>selectSemantic(semantic.ruleNumber,e.target.value)}><option value="">Selecione...</option>{(activeRule?.items||[]).map(i=><option key={i.key} value={i.key}>{activeRule.number}{i.item||""} — {i.label}</option>)}</select></label>
          {semanticItem?.summary&&<div className={styles.semanticSummary}>{semanticItem.summary}</div>}
          {semanticItem?.notes&&<div className={styles.semanticNote}>{semanticItem.notes}</div>}
          <label>Condição operacional<select value={semantic.condition||""} onChange={e=>mutate(s=>{s.config.semantic.condition=e.target.value})}><option value="">Não definida</option>{Object.entries(CONDITION_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
          <label>Período<select value={semantic.period||""} onChange={e=>mutate(s=>{s.config.semantic.period=e.target.value})}><option value="">Não definido</option>{Object.entries(PERIOD_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
          {semantic.ruleNumber==="29"&&<label>Serviço de praticagem<select value={semantic.serviceStatus||""} onChange={e=>mutate(s=>{s.config.semantic.serviceStatus=e.target.value})}><option value="">Definir...</option>{Object.entries(SERVICE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>}
          {["27"].includes(semantic.ruleNumber)&&<label>Bordo semântico<select value={semantic.side||""} onChange={e=>mutate(s=>{s.config.semantic.side=e.target.value})}><option value="">Não aplicável</option>{Object.entries(SIDE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>}
          {semantic.ruleNumber==="24"&&<label>Comprimento do reboque<select value={semantic.towLength||""} onChange={e=>mutate(s=>{s.config.semantic.towLength=e.target.value})}><option value="">Definir...</option><option value="lte200">≤ 200 m</option><option value="gt200">&gt; 200 m</option></select></label>}
          <div className={styles.inlineChecks}><label><input type="checkbox" checked={!!semantic.lockedToRule} onChange={e=>mutate(s=>{s.config.semantic.lockedToRule=e.target.checked})}/> Travar vínculo Regra ↔ cena</label></div>
          <label>Referência / fonte<input value={semantic.sourceRef||""} placeholder="Deck RIPEAM / publicação usada" onChange={e=>mutate(s=>{s.config.semantic.sourceRef=e.target.value})}/></label>
          <label>Nota editorial semântica<textarea rows="3" value={semantic.editorialNote||""} onChange={e=>mutate(s=>{s.config.semantic.editorialNote=e.target.value})}/></label>

          <h4>Identidade editorial</h4>
          <label>Título<input value={scene.title} onChange={e=>{setScene(s=>({...s,title:e.target.value}));setLastEdit(Date.now())}}/></label>
          <label>Chave técnica da cena<input value={scene.scene_key} disabled={!!semantic.lockedToRule} onChange={e=>{setScene(s=>({...s,scene_key:e.target.value}));setLastEdit(Date.now())}}/></label>
          <label>Card / cenário<input value={scene.card_title} onChange={e=>{setScene(s=>({...s,card_title:e.target.value}));setLastEdit(Date.now())}}/></label>
          <label>Descrição<textarea rows="4" value={scene.description} onChange={e=>{setScene(s=>({...s,description:e.target.value}));setLastEdit(Date.now())}}/></label>
          <div className={styles.inlineChecks}><label title="Autosave salva apenas a working copy; nunca atualiza o aluno."><input type="checkbox" checked={autosave} onChange={e=>setAutosave(e.target.checked)}/> Autosave privado</label><label><input type="checkbox" checked={cfg.settings.snapEnabled} onChange={e=>mutate(s=>{s.config.settings.snapEnabled=e.target.checked})}/> Snap</label></div>
          <h4>Snap</h4><label>Posição<input type="number" step=".05" value={cfg.settings.snapPosition} onChange={e=>mutate(s=>{s.config.settings.snapPosition=Number(e.target.value)})}/></label><label>Rotação °<input type="number" value={cfg.settings.snapRotation} onChange={e=>mutate(s=>{s.config.settings.snapRotation=Number(e.target.value)})}/></label><label>Escala<input type="number" step=".01" value={cfg.settings.snapScale} onChange={e=>mutate(s=>{s.config.settings.snapScale=Number(e.target.value)})}/></label>
          <h4>Ambiente</h4><div className={styles.miniActions}>{ENVIRONMENT_PRESETS.map(p=><button key={p.key} onClick={()=>applyEnvironmentPreset(p)}>{p.label}</button>)}</div>{[["background","Fundo"],["water","Água"],["ambient","Luz ambiente"],["sun","Sol"],["fog","Neblina"]].map(([k,l])=><label key={k}>{l}<input type="color" value={cfg.environment[k]} onChange={e=>mutate(s=>{s.config.environment[k]=e.target.value})}/></label>)}<label>Exposição<input type="range" min=".1" max="3" step=".05" value={cfg.environment.exposure} onChange={e=>mutate(s=>{s.config.environment.exposure=Number(e.target.value)})}/></label><label>Neblina<input type="range" min="0" max=".1" step=".001" value={cfg.environment.fogDensity} onChange={e=>mutate(s=>{s.config.environment.fogDensity=Number(e.target.value)})}/></label>
          <h4>Backup</h4><div className={styles.row}><button onClick={exportJson}>Exportar JSON</button><button onClick={()=>fileRef.current?.click()}>Importar JSON</button><input ref={fileRef} type="file" accept=".json" hidden onChange={e=>importJson(e.target.files?.[0])}/></div>
        </div>}

        {tab==="cards"&&<div className={styles.cardsPane}><button className={styles.full} onClick={addCard}>＋ Criar card</button>{(cfg.cards||[]).map(c=><article key={c.id}><input value={c.title} onChange={e=>patchCard(c.id,{title:e.target.value})}/><textarea rows="2" value={c.front} onChange={e=>patchCard(c.id,{front:e.target.value})}/><textarea rows="3" value={c.back} onChange={e=>patchCard(c.id,{back:e.target.value})}/><label><input type="checkbox" checked={c.published!==false} onChange={e=>patchCard(c.id,{published:e.target.checked})}/> Publicar card</label><button onClick={()=>mutate(s=>{s.config.cards=s.config.cards.filter(x=>x.id!==c.id)})}>Excluir card</button></article>)}</div>}

        {tab==="history"&&<div className={styles.cardsPane}><button className={styles.full} onClick={()=>save(scene.status,{versionLabel:"Checkpoint manual"})}>Criar checkpoint</button>{versions.length?versions.map(v=><article key={v.id}><b>{v.label||"Versão"}</b><small>{new Date(v.created_at).toLocaleString("pt-BR")}</small><button onClick={()=>restore(v.id)}>Restaurar</button></article>):<div className={styles.empty}>Salve a cena para iniciar o histórico.</div>}</div>}

        {status&&<div className={styles.status}>{status}</div>}
      </aside>
    </div>
  </div>;
}
