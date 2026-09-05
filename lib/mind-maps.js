import {query,withTransaction} from "./db";
import {normalizeSubject,subjectLabel} from "./subjects";

const DEFAULT_VIEWPORT={x:0,y:0,zoom:1};

function safeCanvas(value){
  const raw=value&&typeof value==="object"?value:{};
  const nodes=Array.isArray(raw.nodes)?raw.nodes.slice(0,500).map((node,index)=>({
    id:String(node.id||`node-${index+1}`).slice(0,120),
    parentId:node.parentId?String(node.parentId).slice(0,120):null,
    title:String(node.title||"Novo tópico").slice(0,180),
    note:String(node.note||"").slice(0,5000),
    category:["concept","formula","rule","question","example","note"].includes(node.category)?node.category:"concept",
    x:Math.max(-10000,Math.min(10000,Number(node.x)||0)),
    y:Math.max(-10000,Math.min(10000,Number(node.y)||0)),
  })):[];

  const ids=new Set(nodes.map((n)=>n.id));
  const edges=Array.isArray(raw.edges)?raw.edges.slice(0,1000).map((edge,index)=>({
    id:String(edge.id||`edge-${index+1}`).slice(0,120),
    source:String(edge.source||"").slice(0,120),
    target:String(edge.target||"").slice(0,120),
    label:String(edge.label||"").slice(0,120),
  })).filter((e)=>ids.has(e.source)&&ids.has(e.target)&&e.source!==e.target):[];

  const viewport=raw.viewport&&typeof raw.viewport==="object"?{
    x:Math.max(-10000,Math.min(10000,Number(raw.viewport.x)||0)),
    y:Math.max(-10000,Math.min(10000,Number(raw.viewport.y)||0)),
    zoom:Math.max(.25,Math.min(2.5,Number(raw.viewport.zoom)||1)),
  }:DEFAULT_VIEWPORT;

  return {nodes,edges,viewport};
}

function starterCanvas({title,subject,template="blank",seedNote=""}={}){
  const root={id:"root",parentId:null,title:String(title||subjectLabel(subject)||"Meu mapa").slice(0,180),note:String(seedNote||"").slice(0,5000),category:"concept",x:120,y:170};
  if(template==="study"){
    const children=[
      {id:"concepts",parentId:"root",title:"Conceitos-chave",note:"",category:"concept",x:420,y:40},
      {id:"rules",parentId:"root",title:"Regras e exceções",note:"",category:"rule",x:420,y:155},
      {id:"formulas",parentId:"root",title:"Fórmulas / números",note:"",category:"formula",x:420,y:270},
      {id:"doubts",parentId:"root",title:"Dúvidas para revisar",note:"",category:"question",x:420,y:385},
    ];
    return {nodes:[root,...children],edges:children.map((c,i)=>({id:`edge-${i+1}`,source:"root",target:c.id,label:""})),viewport:DEFAULT_VIEWPORT};
  }
  return {nodes:[root],edges:[],viewport:DEFAULT_VIEWPORT};
}

export async function listMindMaps(userId){
  const result=await query(
    `select id,title,subject_slug,description,
            jsonb_array_length(coalesce(canvas->'nodes','[]'::jsonb))::int as node_count,
            created_at,updated_at
       from mind_maps
      where user_id=$1
      order by updated_at desc`,
    [userId]
  );
  return result.rows;
}

export async function getMindMap(userId,id){
  const result=await query(
    `select id,title,subject_slug,description,canvas,created_at,updated_at
       from mind_maps where id=$1 and user_id=$2 limit 1`,
    [id,userId]
  );
  const row=result.rows[0];
  return row?{...row,canvas:safeCanvas(row.canvas)}:null;
}

export async function createMindMap(userId,input={}){
  const title=String(input.title||"Novo mapa mental").trim().slice(0,180)||"Novo mapa mental";
  const subject=input.subject_slug?normalizeSubject(input.subject_slug):null;
  const description=String(input.description||"").slice(0,1000);
  const canvas=starterCanvas({title,subject,template:input.template,seedNote:input.seed_note});
  const result=await query(
    `insert into mind_maps(user_id,title,subject_slug,description,canvas)
     values($1,$2,$3,$4,$5::jsonb)
     returning id,title,subject_slug,description,canvas,created_at,updated_at`,
    [userId,title,subject,description,JSON.stringify(canvas)]
  );
  return {...result.rows[0],canvas:safeCanvas(result.rows[0].canvas)};
}

export async function updateMindMap(userId,id,input={}){
  const canvas=safeCanvas(input.canvas);
  const title=String(input.title||"Mapa mental").trim().slice(0,180)||"Mapa mental";
  const subject=input.subject_slug?normalizeSubject(input.subject_slug):null;
  const description=String(input.description||"").slice(0,1000);
  const result=await query(
    `update mind_maps set title=$3,subject_slug=$4,description=$5,canvas=$6::jsonb,updated_at=now()
      where id=$1 and user_id=$2
      returning id,title,subject_slug,description,canvas,created_at,updated_at`,
    [id,userId,title,subject,description,JSON.stringify(canvas)]
  );
  return result.rows[0]?{...result.rows[0],canvas:safeCanvas(result.rows[0].canvas)}:null;
}

export async function deleteMindMap(userId,id){
  const result=await query("delete from mind_maps where id=$1 and user_id=$2 returning id",[id,userId]);
  return Boolean(result.rowCount);
}

export async function duplicateMindMap(userId,id){
  const source=await getMindMap(userId,id);
  if(!source)return null;
  const result=await query(
    `insert into mind_maps(user_id,title,subject_slug,description,canvas)
     values($1,$2,$3,$4,$5::jsonb)
     returning id,title,subject_slug,description,canvas,created_at,updated_at`,
    [userId,`${source.title} — cópia`.slice(0,180),source.subject_slug,source.description,JSON.stringify(source.canvas)]
  );
  return {...result.rows[0],canvas:safeCanvas(result.rows[0].canvas)};
}

export async function upsertMapFlashcard(userId,mapId,input={}){
  const map=await getMindMap(userId,mapId);
  if(!map)return null;
  const nodeId=String(input.node_id||"").slice(0,120);
  const node=map.canvas.nodes.find((item)=>item.id===nodeId);
  if(!node)return null;
  const front=String(input.front||node.title||"").trim().slice(0,1000);
  const back=String(input.back||node.note||"").trim().slice(0,5000);
  if(!front||!back)return {error:"O nó precisa ter título e anotação para virar flashcard."};
  const result=await query(
    `insert into mind_map_flashcards(user_id,mind_map_id,node_id,subject_slug,front,back)
     values($1,$2,$3,$4,$5,$6)
     on conflict(user_id,mind_map_id,node_id) do update set
       subject_slug=excluded.subject_slug,front=excluded.front,back=excluded.back,updated_at=now()
     returning id,mind_map_id,node_id,subject_slug,front,back,created_at,updated_at`,
    [userId,mapId,nodeId,map.subject_slug,front,back]
  );
  return result.rows[0];
}

export async function listMapFlashcards(userId){
  const result=await query(
    `select f.id,f.mind_map_id,f.node_id,f.subject_slug,f.front,f.back,f.created_at,f.updated_at,m.title as map_title
       from mind_map_flashcards f
       join mind_maps m on m.id=f.mind_map_id and m.user_id=f.user_id
      where f.user_id=$1
      order by f.updated_at desc`,
    [userId]
  );
  return result.rows;
}
