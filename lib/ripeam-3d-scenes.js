import crypto from "node:crypto";
import {query} from "./db";

export async function ensureRipeam3DSchema(){
  await query(
    "create table if not exists ripeam_3d_scenes(" +
    "id uuid primary key, scene_key text not null unique, title text not null, rule_ref text, card_title text, description text, " +
    "status text not null default 'draft', config jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now())"
  );
  await query("create index if not exists ripeam_3d_scenes_status_idx on ripeam_3d_scenes(status)");
}

function n(v,d=0){const x=Number(v);return Number.isFinite(x)?Math.max(-100000,Math.min(100000,x)):d}
function vec(v,d=[0,0,0]){return [0,1,2].map(i=>n(Array.isArray(v)?v[i]:undefined,d[i]))}
function txt(v,max=1000){return String(v??"").slice(0,max)}
function color(v,d="#ffffff"){const s=String(v||"");return /^#[0-9a-f]{6}$/i.test(s)?s:d}
function safeUrl(v){const s=String(v||"").trim();return !s||/^(javascript|data|vbscript):/i.test(s)?"":s.slice(0,2048)}

export function sanitizeScene(input={}){
  const objects=(Array.isArray(input.objects)?input.objects:[]).slice(0,200).map((o,i)=>({
    id:txt(o.id||crypto.randomUUID(),120),
    name:txt(o.name||("Objeto "+(i+1)),180),
    type:["model","pointLight","spotLight","directionalLight","shape"].includes(o.type)?o.type:"model",
    assetUrl:safeUrl(o.assetUrl),
    assetType:["glb","gltf","fbx","obj"].includes(o.assetType)?o.assetType:"glb",
    visible:o.visible!==false,
    position:vec(o.position),
    rotation:vec(o.rotation),
    scale:vec(o.scale,[1,1,1]).map(x=>Math.max(.001,x)),
    color:color(o.color,"#ffffff"),
    intensity:Math.max(0,Math.min(100,n(o.intensity,2))),
    distance:Math.max(0,Math.min(1000,n(o.distance,12))),
    angle:Math.max(.01,Math.min(Math.PI,n(o.angle,.75))),
    penumbra:Math.max(0,Math.min(1,n(o.penumbra,.25))),
    material:{
      color:color(o.material?.color,"#ffffff"),
      roughness:Math.max(0,Math.min(1,n(o.material?.roughness,.5))),
      metalness:Math.max(0,Math.min(1,n(o.material?.metalness,.05))),
      opacity:Math.max(0,Math.min(1,n(o.material?.opacity,1))),
      emissive:color(o.material?.emissive,"#000000")
    }
  }));
  const cards=(Array.isArray(input.cards)?input.cards:[]).slice(0,100).map(c=>({
    id:txt(c.id||crypto.randomUUID(),120),title:txt(c.title,240),front:txt(c.front,4000),back:txt(c.back,8000),published:c.published!==false
  }));
  const e=input.environment||{},camera=input.camera||{};
  return {
    version:1,
    scenarioKey:txt(input.scenarioKey||"custom",120).toLowerCase().replace(/[^a-z0-9_-]+/g,"-"),
    objects,cards,
    environment:{
      background:color(e.background,"#071522"),ambient:color(e.ambient,"#7897bc"),
      ambientIntensity:Math.max(0,Math.min(20,n(e.ambientIntensity,.9))),
      sun:color(e.sun,"#fff0cf"),sunIntensity:Math.max(0,Math.min(30,n(e.sunIntensity,2.2))),
      sunPosition:vec(e.sunPosition,[6,14,9]),water:color(e.water,"#063b55"),
      exposure:Math.max(.05,Math.min(5,n(e.exposure,.95))),
      fog:color(e.fog,"#07121d"),fogDensity:Math.max(0,Math.min(.2,n(e.fogDensity,.026)))
    },
    camera:{position:vec(camera.position,[14,7,15]),target:vec(camera.target,[0,1,0]),fov:Math.max(20,Math.min(100,n(camera.fov,43)))}
  };
}

export async function listRipeam3DScenes({publishedOnly=false}={}){
  await ensureRipeam3DSchema();
  const sql="select id,scene_key,title,rule_ref,card_title,description,status,config,created_at,updated_at from ripeam_3d_scenes " +
    (publishedOnly?"where status='published' ":"") + "order by updated_at desc";
  return (await query(sql)).rows;
}

export async function saveRipeam3DScene(input={}){
  await ensureRipeam3DSchema();
  const id=/^[0-9a-f-]{36}$/i.test(String(input.id||""))?String(input.id):crypto.randomUUID();
  const key=txt(input.scene_key||input.config?.scenarioKey||("scene-"+Date.now()),120).toLowerCase().replace(/[^a-z0-9_-]+/g,"-");
  const config=sanitizeScene({...input.config,scenarioKey:key});
  const status=input.status==="published"?"published":"draft";
  const sql="insert into ripeam_3d_scenes(id,scene_key,title,rule_ref,card_title,description,status,config) values($1,$2,$3,$4,$5,$6,$7,$8::jsonb) " +
    "on conflict(scene_key) do update set title=excluded.title,rule_ref=excluded.rule_ref,card_title=excluded.card_title,description=excluded.description,status=excluded.status,config=excluded.config,updated_at=now() returning *";
  return (await query(sql,[id,key,txt(input.title||key,240),txt(input.rule_ref,120),txt(input.card_title,240),txt(input.description,4000),status,JSON.stringify(config)])).rows[0];
}

export async function deleteRipeam3DScene(id){
  await ensureRipeam3DSchema();
  await query("delete from ripeam_3d_scenes where id=$1",[id]);
}
