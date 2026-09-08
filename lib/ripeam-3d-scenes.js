import crypto from "node:crypto";
import {query} from "./db";

export async function ensureRipeam3DSchema(){
  await query(
    "create table if not exists ripeam_3d_scenes("+
    "id uuid primary key, scene_key text not null unique, title text not null, rule_ref text, card_title text, description text, "+
    "status text not null default 'draft', config jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now())"
  );
  await query("create index if not exists ripeam_3d_scenes_status_idx on ripeam_3d_scenes(status)");
  await query(
    "create table if not exists ripeam_3d_scene_versions("+
    "id uuid primary key, scene_id uuid not null references ripeam_3d_scenes(id) on delete cascade, label text, snapshot jsonb not null, created_at timestamptz not null default now())"
  );
  await query("create index if not exists ripeam_3d_scene_versions_scene_idx on ripeam_3d_scene_versions(scene_id,created_at desc)");
  await query(
    "create table if not exists ripeam_3d_assets("+
    "id uuid primary key, name text not null, url text not null unique, asset_type text not null, category text, tags jsonb not null default '[]'::jsonb, "+
    "thumbnail_url text, bytes bigint, triangles bigint, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now())"
  );
}

function n(v,d=0){const x=Number(v);return Number.isFinite(x)?Math.max(-100000,Math.min(100000,x)):d}
function vec(v,d=[0,0,0]){return [0,1,2].map(i=>n(Array.isArray(v)?v[i]:undefined,d[i]))}
function txt(v,max=1000){return String(v??"").slice(0,max)}
function color(v,d="#ffffff"){const s=String(v||"");return /^#[0-9a-f]{6}$/i.test(s)?s:d}
function safeUrl(v){const s=String(v||"").trim();return !s||/^(javascript|data|vbscript):/i.test(s)?"":s.slice(0,2048)}
function bool(v,d=false){return typeof v==="boolean"?v:d}

export function sanitizeScene(input={}){
  const objects=(Array.isArray(input.objects)?input.objects:[]).slice(0,400).map((o,i)=>({
    id:txt(o.id||crypto.randomUUID(),120),
    name:txt(o.name||("Objeto "+(i+1)),180),
    type:["model","pointLight","spotLight","directionalLight","shape","cable","measure","hotspot"].includes(o.type)?o.type:"model",
    assetUrl:safeUrl(o.assetUrl),
    assetType:["glb","gltf","fbx","obj"].includes(o.assetType)?o.assetType:"glb",
    visible:o.visible!==false,
    locked:bool(o.locked,false),
    parentId:o.parentId?txt(o.parentId,120):null,
    position:vec(o.position),
    rotation:vec(o.rotation),
    scale:vec(o.scale,[1,1,1]).map(x=>Math.max(.001,x)),
    pivot:vec(o.pivot,[0,0,0]),
    normalize:o.normalize!==false,
    color:color(o.color,"#ffffff"),
    intensity:Math.max(0,Math.min(100,n(o.intensity,2))),
    distance:Math.max(0,Math.min(1000,n(o.distance,12))),
    angle:Math.max(.01,Math.min(Math.PI,n(o.angle,.75))),
    penumbra:Math.max(0,Math.min(1,n(o.penumbra,.25))),
    lightPreset:txt(o.lightPreset,80),
    sector:Math.max(0,Math.min(360,n(o.sector,360))),
    heading:n(o.heading,0),
    shape:["ball","coneUp","coneDown","diamond","cylinder"].includes(o.shape)?o.shape:"ball",
    hotspot:o.hotspot?{title:txt(o.hotspot.title,240),body:txt(o.hotspot.body,2000)}:null,
    cable:o.cable?{fromId:txt(o.cable.fromId,120),toId:txt(o.cable.toId,120),sag:Math.max(0,Math.min(5,n(o.cable.sag,.4)))}:null,
    material:{
      color:color(o.material?.color,"#ffffff"),
      roughness:Math.max(0,Math.min(1,n(o.material?.roughness,.5))),
      metalness:Math.max(0,Math.min(1,n(o.material?.metalness,.05))),
      opacity:Math.max(0,Math.min(1,n(o.material?.opacity,1))),
      emissive:color(o.material?.emissive,"#000000")
    },
    lod:{
      enabled:bool(o.lod?.enabled,false),
      mobileScale:Math.max(.05,Math.min(1,n(o.lod?.mobileScale,.65)))
    },
    keyframes:(Array.isArray(o.keyframes)?o.keyframes:[]).slice(0,100).map(k=>({
      t:Math.max(0,Math.min(600,n(k.t,0))),
      position:vec(k.position,o.position||[0,0,0]),
      rotation:vec(k.rotation,o.rotation||[0,0,0]),
      scale:vec(k.scale,o.scale||[1,1,1])
    })).sort((a,b)=>a.t-b.t)
  }));
  const cards=(Array.isArray(input.cards)?input.cards:[]).slice(0,150).map(c=>({
    id:txt(c.id||crypto.randomUUID(),120),title:txt(c.title,240),front:txt(c.front,4000),back:txt(c.back,8000),published:c.published!==false
  }));
  const e=input.environment||{},camera=input.camera||{},editorCamera=input.editorCamera||{};
  const settings=input.settings||{},semantic=input.semantic||{};
  return {
    version:3,
    semantic:{
      ruleNumber:txt(semantic.ruleNumber,8).replace(/[^0-9]/g,"").slice(0,2),
      ruleItem:txt(semantic.ruleItem,24),
      scenarioKey:txt(semantic.scenarioKey||input.scenarioKey,120).replace(/[^a-zA-Z0-9_-]/g,""),
      condition:txt(semantic.condition,40),
      period:["day","night","both",""].includes(semantic.period)?semantic.period:"",
      serviceStatus:txt(semantic.serviceStatus,60),
      side:["port","starboard",""].includes(semantic.side)?semantic.side:"",
      towLength:["lte200","gt200",""].includes(semantic.towLength)?semantic.towLength:"",
      fishingType:txt(semantic.fishingType,60),
      cardId:txt(semantic.cardId,120),
      sourceRef:txt(semantic.sourceRef,240),
      editorialNote:txt(semantic.editorialNote,2000),
      lockedToRule:bool(semantic.lockedToRule,false)
    },
    scenarioKey:txt(input.scenarioKey||"custom",120).toLowerCase().replace(/[^a-z0-9_-]+/g,"-"),
    objects,cards,
    timeline:{
      duration:Math.max(1,Math.min(600,n(input.timeline?.duration,10))),
      loop:input.timeline?.loop!==false,
      autoplay:bool(input.timeline?.autoplay,false)
    },
    settings:{
      snapEnabled:bool(settings.snapEnabled,false),
      snapPosition:Math.max(.01,Math.min(10,n(settings.snapPosition,.25))),
      snapRotation:Math.max(1,Math.min(90,n(settings.snapRotation,15))),
      snapScale:Math.max(.01,Math.min(1,n(settings.snapScale,.05))),
      showGrid:settings.showGrid!==false,
      showSectors:settings.showSectors!==false,
      previewMode:["day","night"].includes(settings.previewMode)?settings.previewMode:"day"
    },
    environment:{
      background:color(e.background,"#071522"),ambient:color(e.ambient,"#7897bc"),
      ambientIntensity:Math.max(0,Math.min(20,n(e.ambientIntensity,.9))),
      sun:color(e.sun,"#fff0cf"),sunIntensity:Math.max(0,Math.min(30,n(e.sunIntensity,2.2))),
      sunPosition:vec(e.sunPosition,[6,14,9]),water:color(e.water,"#063b55"),
      exposure:Math.max(.05,Math.min(5,n(e.exposure,.95))),
      fog:color(e.fog,"#07121d"),fogDensity:Math.max(0,Math.min(.2,n(e.fogDensity,.026)))
    },
    camera:{position:vec(camera.position,[14,7,15]),target:vec(camera.target,[0,1,0]),fov:Math.max(20,Math.min(100,n(camera.fov,43)))},
    editorCamera:{position:vec(editorCamera.position,[14,7,15]),target:vec(editorCamera.target,[0,1,0]),fov:Math.max(20,Math.min(100,n(editorCamera.fov,43)))}
  };
}

export async function listRipeam3DScenes({publishedOnly=false}={}){
  await ensureRipeam3DSchema();
  const sql="select id,scene_key,title,rule_ref,card_title,description,status,config,created_at,updated_at from ripeam_3d_scenes "+
    (publishedOnly?"where status='published' ":"")+"order by updated_at desc";
  return (await query(sql)).rows;
}

export async function listRipeam3DAssets(){
  await ensureRipeam3DSchema();
  return (await query("select * from ripeam_3d_assets order by updated_at desc")).rows;
}

export async function upsertRipeam3DAsset(input={}){
  await ensureRipeam3DSchema();
  const id=/^[0-9a-f-]{36}$/i.test(String(input.id||""))?String(input.id):crypto.randomUUID();
  const type=["glb","gltf","fbx","obj"].includes(String(input.asset_type||input.type))?String(input.asset_type||input.type):"glb";
  const r=await query(
    "insert into ripeam_3d_assets(id,name,url,asset_type,category,tags,thumbnail_url,bytes,triangles,metadata) values($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10::jsonb) "+
    "on conflict(url) do update set name=excluded.name,asset_type=excluded.asset_type,category=excluded.category,tags=excluded.tags,thumbnail_url=excluded.thumbnail_url,bytes=coalesce(excluded.bytes,ripeam_3d_assets.bytes),triangles=coalesce(excluded.triangles,ripeam_3d_assets.triangles),metadata=ripeam_3d_assets.metadata||excluded.metadata,updated_at=now() returning *",
    [id,txt(input.name||"Asset 3D",240),safeUrl(input.url),type,txt(input.category,120),JSON.stringify(Array.isArray(input.tags)?input.tags.slice(0,30).map(x=>txt(x,80)):[]),safeUrl(input.thumbnail_url),Number.isFinite(Number(input.bytes))?Number(input.bytes):null,Number.isFinite(Number(input.triangles))?Number(input.triangles):null,JSON.stringify(input.metadata&&typeof input.metadata==="object"?input.metadata:{})]
  );
  return r.rows[0];
}

export async function listSceneVersions(sceneId){
  await ensureRipeam3DSchema();
  if(!sceneId)return [];
  return (await query("select id,label,created_at from ripeam_3d_scene_versions where scene_id=$1 order by created_at desc limit 30",[sceneId])).rows;
}

export async function restoreSceneVersion(versionId){
  await ensureRipeam3DSchema();
  const v=(await query("select scene_id,snapshot from ripeam_3d_scene_versions where id=$1",[versionId])).rows[0];
  if(!v)return null;
  const s=v.snapshot;
  return saveRipeam3DScene({...s,id:v.scene_id,skipVersion:true});
}

export async function saveRipeam3DScene(input={}){
  await ensureRipeam3DSchema();
  const id=/^[0-9a-f-]{36}$/i.test(String(input.id||""))?String(input.id):crypto.randomUUID();
  const key=txt(input.scene_key||input.config?.scenarioKey||("scene-"+Date.now()),120).toLowerCase().replace(/[^a-z0-9_-]+/g,"-");
  const config=sanitizeScene({...input.config,scenarioKey:key});
  const allowed=new Set(["draft","review","published","archived"]);
  const status=allowed.has(input.status)?input.status:"draft";
  const sql="insert into ripeam_3d_scenes(id,scene_key,title,rule_ref,card_title,description,status,config) values($1,$2,$3,$4,$5,$6,$7,$8::jsonb) "+
    "on conflict(scene_key) do update set title=excluded.title,rule_ref=excluded.rule_ref,card_title=excluded.card_title,description=excluded.description,status=excluded.status,config=excluded.config,updated_at=now() returning *";
  const row=(await query(sql,[id,key,txt(input.title||key,240),txt(input.rule_ref,120),txt(input.card_title,240),txt(input.description,4000),status,JSON.stringify(config)])).rows[0];
  if(!input.skipVersion){
    const snapshot={id:row.id,scene_key:row.scene_key,title:row.title,rule_ref:row.rule_ref,card_title:row.card_title,description:row.description,status:row.status,config:row.config};
    await query("insert into ripeam_3d_scene_versions(id,scene_id,label,snapshot) values($1,$2,$3,$4::jsonb)",[crypto.randomUUID(),row.id,txt(input.versionLabel||("Save "+new Date().toISOString()),160),JSON.stringify(snapshot)]);
    await query("delete from ripeam_3d_scene_versions where id in (select id from ripeam_3d_scene_versions where scene_id=$1 order by created_at desc offset 50)",[row.id]);
  }
  return row;
}

export async function deleteRipeam3DScene(id){
  await ensureRipeam3DSchema();
  await query("delete from ripeam_3d_scenes where id=$1",[id]);
}
