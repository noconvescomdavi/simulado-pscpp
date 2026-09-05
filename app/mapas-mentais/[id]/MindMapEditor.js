"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import {SUBJECTS} from "../../../lib/subjects";
import styles from "./editor.module.css";

const WORLD_W=3200;
const WORLD_H=2200;
const CATEGORY_META={
  concept:{label:"Conceito",className:"concept"},
  formula:{label:"Fórmula",className:"formula"},
  rule:{label:"Regra",className:"rule"},
  question:{label:"Dúvida",className:"question"},
  example:{label:"Exemplo",className:"example"},
  note:{label:"Anotação",className:"note"},
};

function uid(prefix="node"){
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}
function esc(value){
  return String(value||"").replace(/[&<>"']/g,(m)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function wrap(text,max=26){
  const words=String(text||"").split(/\s+/);
  const lines=[];let line="";
  for(const word of words){
    const next=(line+" "+word).trim();
    if(next.length>max&&line){lines.push(line);line=word}else line=next;
  }
  if(line)lines.push(line);
  return lines.slice(0,5);
}

export default function MindMapEditor({initialMap}){
  const [map,setMap]=useState(initialMap);
  const [selected,setSelected]=useState(initialMap.canvas.nodes[0]?.id||null);
  const [connectSource,setConnectSource]=useState(null);
  const [saveState,setSaveState]=useState("Salvo");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const panRef=useRef(null);
  const dragRef=useRef(null);
  const mounted=useRef(false);

  const nodeById=useMemo(()=>new Map(map.canvas.nodes.map(n=>[n.id,n])),[map.canvas.nodes]);
  const selectedNode=selected?nodeById.get(selected):null;

  useEffect(()=>{
    if(!mounted.current){mounted.current=true;return}
    setSaveState("Salvando...");
    const timer=setTimeout(async()=>{
      try{
        const response=await fetch(`/api/mind-maps/${map.id}`,{
          method:"PUT",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            title:map.title,
            subject_slug:map.subject_slug,
            description:map.description,
            canvas:map.canvas,
          }),
        });
        if(!response.ok)throw new Error();
        setSaveState("Salvo");
      }catch{
        setSaveState("Erro ao salvar");
      }
    },700);
    return()=>clearTimeout(timer);
  },[map]);

  function patchCanvas(fn){
    setMap(current=>({...current,canvas:fn(current.canvas)}));
  }
  function patchNode(id,patch){
    patchCanvas(canvas=>({...canvas,nodes:canvas.nodes.map(n=>n.id===id?{...n,...patch}:n)}));
  }
  function addNode(){
    const id=uid();
    const v=map.canvas.viewport;
    const node={id,parentId:null,title:"Novo tópico",note:"",category:"concept",x:Math.max(40,(-v.x+420)/v.zoom),y:Math.max(40,(-v.y+260)/v.zoom)};
    patchCanvas(canvas=>({...canvas,nodes:[...canvas.nodes,node]}));
    setSelected(id);
  }
  function addChild(){
    const parent=selectedNode;
    if(!parent){addNode();return}
    const id=uid();
    const siblingCount=map.canvas.nodes.filter(n=>n.parentId===parent.id).length;
    const child={id,parentId:parent.id,title:"Novo subtópico",note:"",category:"note",x:parent.x+260,y:parent.y+(siblingCount-1)*110};
    const edge={id:uid("edge"),source:parent.id,target:id,label:""};
    patchCanvas(canvas=>({...canvas,nodes:[...canvas.nodes,child],edges:[...canvas.edges,edge]}));
    setSelected(id);
  }
  function deleteSelected(){
    if(!selectedNode)return;
    const id=selectedNode.id;
    patchCanvas(canvas=>({
      ...canvas,
      nodes:canvas.nodes.filter(n=>n.id!==id).map(n=>n.parentId===id?{...n,parentId:null}:n),
      edges:canvas.edges.filter(e=>e.source!==id&&e.target!==id),
    }));
    setSelected(null);setConnectSource(null);
  }
  function clearConnections(){
    if(!selectedNode)return;
    const id=selectedNode.id;
    patchCanvas(canvas=>({...canvas,edges:canvas.edges.filter(e=>e.source!==id&&e.target!==id)}));
  }
  function chooseNode(id){
    if(connectSource&&connectSource!==id){
      const exists=map.canvas.edges.some(e=>(e.source===connectSource&&e.target===id)||(e.source===id&&e.target===connectSource));
      if(!exists){
        patchCanvas(canvas=>({...canvas,edges:[...canvas.edges,{id:uid("edge"),source:connectSource,target:id,label:""}]}));
      }
      setConnectSource(null);
    }
    setSelected(id);
  }
  function startConnect(){
    if(!selectedNode)return;
    setConnectSource(selectedNode.id);
    setMessage("Agora clique em outro nó para criar a conexão.");
  }

  function startNodeDrag(event,node){
    event.preventDefault();event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current={id:node.id,startX:event.clientX,startY:event.clientY,x:node.x,y:node.y,zoom:map.canvas.viewport.zoom};
  }
  function moveNode(event){
    const d=dragRef.current;if(!d)return;
    patchNode(d.id,{x:d.x+(event.clientX-d.startX)/d.zoom,y:d.y+(event.clientY-d.startY)/d.zoom});
  }
  function endNodeDrag(){dragRef.current=null}

  function startPan(event){
    if(event.target.closest?.("[data-node]"))return;
    panRef.current={startX:event.clientX,startY:event.clientY,x:map.canvas.viewport.x,y:map.canvas.viewport.y};
  }
  function movePan(event){
    const p=panRef.current;if(!p)return;
    patchCanvas(canvas=>({...canvas,viewport:{...canvas.viewport,x:p.x+event.clientX-p.startX,y:p.y+event.clientY-p.startY}}));
  }
  function endPan(){panRef.current=null}
  function zoomBy(delta){
    patchCanvas(canvas=>({...canvas,viewport:{...canvas.viewport,zoom:Math.max(.25,Math.min(2.5,canvas.viewport.zoom+delta))}}));
  }
  function onWheel(event){
    event.preventDefault();
    zoomBy(event.deltaY>0?-.1:.1);
  }
  function resetView(){
    patchCanvas(canvas=>({...canvas,viewport:{x:0,y:0,zoom:1}}));
  }

  async function duplicate(){
    if(busy)return;setBusy(true);
    try{
      const r=await fetch(`/api/mind-maps/${map.id}/duplicate`,{method:"POST"});
      const p=await r.json();
      if(r.ok)location.href=`/mapas-mentais/${p.map.id}`;
    }finally{setBusy(false)}
  }
  async function toFlashcard(){
    if(!selectedNode)return;
    setMessage("");
    const r=await fetch(`/api/mind-maps/${map.id}/flashcard`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({node_id:selectedNode.id,front:selectedNode.title,back:selectedNode.note})
    });
    const p=await r.json().catch(()=>({}));
    setMessage(r.ok?"Flashcard salvo em “Dos meus mapas”.":(p.error||"Não foi possível criar o flashcard."));
  }

  function svgMarkup(){
    const nodes=map.canvas.nodes;
    const minX=Math.min(...nodes.map(n=>n.x),0)-80;
    const minY=Math.min(...nodes.map(n=>n.y),0)-80;
    const maxX=Math.max(...nodes.map(n=>n.x+220),900)+80;
    const maxY=Math.max(...nodes.map(n=>n.y+120),600)+80;
    const width=maxX-minX,height=maxY-minY;
    const edges=map.canvas.edges.map(e=>{
      const a=nodeById.get(e.source),b=nodeById.get(e.target);if(!a||!b)return"";
      const x1=a.x+110-minX,y1=a.y+50-minY,x2=b.x+110-minX,y2=b.y+50-minY;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#3e8db7" stroke-width="3" opacity=".8"/>`;
    }).join("");
    const cards=nodes.map(n=>{
      const x=n.x-minX,y=n.y-minY;
      const lines=wrap(n.title,25);
      const note=wrap(n.note,34);
      const title=lines.map((line,i)=>`<text x="${x+16}" y="${y+28+i*17}" fill="#f4f8fb" font-size="14" font-family="Arial" font-weight="700">${esc(line)}</text>`).join("");
      const notes=note.map((line,i)=>`<text x="${x+16}" y="${y+66+i*14}" fill="#a9bfd0" font-size="11" font-family="Arial">${esc(line)}</text>`).join("");
      return `<g><rect x="${x}" y="${y}" width="220" height="110" rx="14" fill="#0a2639" stroke="#2d86b5" stroke-width="2"/>${title}${notes}</g>`;
    }).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#061622"/>${edges}${cards}</svg>`;
  }

  function exportPng(){
    const svg=svgMarkup();
    const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=img.naturalWidth*2;canvas.height=img.naturalHeight*2;
      const ctx=canvas.getContext("2d");ctx.scale(2,2);ctx.drawImage(img,0,0);
      canvas.toBlob(png=>{
        const a=document.createElement("a");a.href=URL.createObjectURL(png);a.download=`${map.title||"mapa-mental"}.png`;a.click();
        setTimeout(()=>URL.revokeObjectURL(a.href),1000);
      },"image/png");
      URL.revokeObjectURL(url);
    };
    img.src=url;
  }
  function exportPdf(){
    const svg=svgMarkup();
    const blob=new Blob([svg],{type:"image/svg+xml"});
    const url=URL.createObjectURL(blob);
    const win=window.open("","_blank","noopener,noreferrer");
    if(!win)return;
    win.document.write(`<!doctype html><html><head><title>${esc(map.title)}</title><style>@page{size:landscape;margin:8mm}body{margin:0;background:white;display:grid;place-items:center}img{max-width:100%;max-height:95vh}</style></head><body><img src="${url}" onload="setTimeout(()=>window.print(),250)"></body></html>`);
    win.document.close();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }

  return <section className={styles.editor}>
    <header className={styles.topbar}>
      <div className={styles.titleBlock}>
        <a href="/mapas-mentais">← Meus mapas</a>
        <input value={map.title} onChange={e=>setMap(m=>({...m,title:e.target.value}))} maxLength={180}/>
        <span className={saveState==="Erro ao salvar"?styles.saveError:""}>{saveState}</span>
      </div>
      <div className={styles.actions}>
        <button onClick={addNode}>＋ Novo nó</button>
        <button onClick={addChild}>↳ Subtópico</button>
        <button className={connectSource?styles.active:""} onClick={startConnect}>🔗 Conectar</button>
        <button onClick={()=>zoomBy(.1)}>＋ Zoom</button>
        <button onClick={()=>zoomBy(-.1)}>− Zoom</button>
        <button onClick={resetView}>Centralizar</button>
        <button onClick={duplicate} disabled={busy}>📋 Duplicar</button>
        <button onClick={exportPng}>PNG</button>
        <button onClick={exportPdf}>PDF</button>
      </div>
    </header>

    <div className={styles.workspace}>
      <div
        className={styles.viewport}
        onPointerDown={startPan}
        onPointerMove={e=>{movePan(e);moveNode(e)}}
        onPointerUp={()=>{endPan();endNodeDrag()}}
        onPointerCancel={()=>{endPan();endNodeDrag()}}
        onWheel={onWheel}
      >
        <div className={styles.world} style={{width:WORLD_W,height:WORLD_H,transform:`translate(${map.canvas.viewport.x}px,${map.canvas.viewport.y}px) scale(${map.canvas.viewport.zoom})`}}>
          <svg className={styles.edges} width={WORLD_W} height={WORLD_H}>
            {map.canvas.edges.map(edge=>{
              const a=nodeById.get(edge.source),b=nodeById.get(edge.target);if(!a||!b)return null;
              return <line key={edge.id} x1={a.x+110} y1={a.y+55} x2={b.x+110} y2={b.y+55}/>;
            })}
          </svg>
          {map.canvas.nodes.map(node=><article
            data-node
            key={node.id}
            className={`${styles.node} ${styles[CATEGORY_META[node.category]?.className||"concept"]} ${selected===node.id?styles.selected:""} ${connectSource===node.id?styles.connecting:""}`}
            style={{left:node.x,top:node.y}}
            onClick={e=>{e.stopPropagation();chooseNode(node.id)}}
          >
            <button className={styles.drag} onPointerDown={e=>startNodeDrag(e,node)} aria-label="Arrastar nó">⋮⋮</button>
            <small>{CATEGORY_META[node.category]?.label||"Conceito"}</small>
            <strong>{node.title}</strong>
            {node.note&&<p>{node.note}</p>}
          </article>)}
        </div>
      </div>

      <aside className={styles.inspector}>
        <div className={styles.mapMeta}>
          <label>Matéria<select value={map.subject_slug||""} onChange={e=>setMap(m=>({...m,subject_slug:e.target.value||null}))}><option value="">Mapa livre</option>{SUBJECTS.map(s=><option key={s.slug} value={s.slug}>{s.label}</option>)}</select></label>
          <label>Descrição<textarea value={map.description||""} onChange={e=>setMap(m=>({...m,description:e.target.value}))} maxLength={1000}/></label>
        </div>

        {selectedNode?<div className={styles.nodeForm}>
          <span>NÓ SELECIONADO</span>
          <label>Título<input value={selectedNode.title} onChange={e=>patchNode(selectedNode.id,{title:e.target.value})} maxLength={180}/></label>
          <label>Categoria<select value={selectedNode.category} onChange={e=>patchNode(selectedNode.id,{category:e.target.value})}>{Object.entries(CATEGORY_META).map(([key,meta])=><option key={key} value={key}>{meta.label}</option>)}</select></label>
          <label>Anotação<textarea value={selectedNode.note} onChange={e=>patchNode(selectedNode.id,{note:e.target.value})} placeholder="Escreva com suas próprias palavras..." maxLength={5000}/></label>
          <div className={styles.nodeButtons}>
            <button onClick={addChild}>↳ Criar subtópico</button>
            <button onClick={startConnect}>🔗 Conectar</button>
            <button onClick={toFlashcard}>▤ Virar flashcard</button>
            <button onClick={clearConnections}>Desconectar</button>
            <button className={styles.danger} onClick={deleteSelected}>Excluir nó</button>
          </div>
        </div>:<div className={styles.emptyInspector}>Selecione um nó para editar sua anotação.</div>}

        {message&&<p className={styles.message}>{message}</p>}
        <div className={styles.legend}><span>🎨 Categorias</span>{Object.entries(CATEGORY_META).map(([key,meta])=><i key={key} className={styles[key]}>{meta.label}</i>)}</div>
      </aside>
    </div>
  </section>;
}
