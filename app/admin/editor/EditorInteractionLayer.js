"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import {buildObjectRegistry,editableTarget,registrySearch,selectorForNode} from "./EditorObjectRegistry";

const EMPTY={route:"",layers:[],objects:[],byId:{},stats:{total:0,objects:0,containers:0,controls:0,media:0,viewers:0}};
const STORAGE="estibordo-editor-core-v2";

function loadPrefs(){try{return JSON.parse(localStorage.getItem(STORAGE)||"{}")}catch{return {}}}
function savePrefs(p){try{localStorage.setItem(STORAGE,JSON.stringify(p))}catch{}}
function currentFrame(){return document.querySelector('iframe[title="Prévia da página"]')}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

function installCoreCss(doc,prefs){
  let style=doc.getElementById("estibordo-editor-core-v2-css");if(!style){style=doc.createElement("style");style.id="estibordo-editor-core-v2-css";doc.head.appendChild(style)}
  style.textContent=`
    html.ev-core-outline body *{background-image:none!important;box-shadow:none!important;text-shadow:none!important}html.ev-core-outline body *:not(svg):not(path){outline:1px solid rgba(47,128,237,.24)!important}
    html.ev-core-xray [data-editor-id]{background-color:rgba(85,167,230,.035)!important;outline:1px dashed rgba(85,167,230,.42)!important}html.ev-core-xray [data-editor-id]:hover{background-color:rgba(200,16,46,.07)!important;outline:2px solid #c8102e!important}
    html.ev-core-safe canvas,html.ev-core-safe video,html.ev-core-safe iframe,html.ev-core-safe [class*="three" i]{visibility:hidden!important}html.ev-core-safe *{animation:none!important;transition:none!important}
    [data-editor-core-selected]{outline:3px solid #7c3aed!important;outline-offset:3px!important}[data-editor-core-selected]::before{content:attr(data-editor-name);position:absolute!important;left:0!important;top:-23px!important;padding:4px 7px!important;background:#7c3aed!important;color:#fff!important;border-radius:5px!important;font:700 9px/1 Arial!important;z-index:2147483646!important;pointer-events:none!important;white-space:nowrap!important;max-width:260px!important;overflow:hidden!important;text-overflow:ellipsis!important}
    [data-editor-core-locked]{outline-color:#e59b16!important;cursor:not-allowed!important}
    [data-editor-core-isolated] body>*:not([data-editor-core-isolation-root]){opacity:.12!important;pointer-events:none!important}
  `;
  doc.documentElement.classList.toggle("ev-core-outline",Boolean(prefs.outline));doc.documentElement.classList.toggle("ev-core-xray",Boolean(prefs.xray));doc.documentElement.classList.toggle("ev-core-safe",Boolean(prefs.safeMode));
}

function healthCheck(frame,registry){
  const checks=[];const doc=frame?.contentDocument;const add=(ok,name,detail,level=ok?"ok":"error")=>checks.push({ok,name,detail,level});
  add(Boolean(frame),"Iframe da página",frame?"Prévia localizada.":"Prévia não encontrada.");
  add(Boolean(doc?.body),"DOM da página",doc?.body?"Documento carregado.":"DOM indisponível.");
  add(registry.stats.total>0,"Object Registry",`${registry.stats.total} nós registrados.`,registry.stats.total?"ok":"error");
  const dnd=Array.from(document.querySelectorAll("button")).find(x=>/dnd\s*(on|off)/i.test(x.textContent||""));add(Boolean(dnd),"DnD Controller",dnd?`Controle encontrado: ${(dnd.textContent||"").trim()}`:"Controle DnD não encontrado.",dnd?"ok":"error");
  add(Boolean(doc?.querySelector("#estibordo-editor-core-v2-css")),"Overlay/Core CSS","Camada visual independente instalada.");
  const duplicateIds=doc?[...doc.querySelectorAll("[id]")].map(x=>x.id).filter((id,i,a)=>id&&a.indexOf(id)!==i):[];add(!duplicateIds.length,"IDs do DOM",duplicateIds.length?`${new Set(duplicateIds).size} ID(s) duplicados.`:"Sem IDs duplicados.",duplicateIds.length?"warn":"ok");
  const overflow=doc?[...doc.querySelectorAll("body *")].filter(el=>{try{const r=el.getBoundingClientRect();return r.width>2&&(r.left<-4||r.right>doc.documentElement.clientWidth+4)}catch{return false}}).length:0;add(!overflow,"Responsividade",overflow?`${overflow} elemento(s) excedem horizontalmente a viewport.`:"Sem overflow horizontal detectado.",overflow?"warn":"ok");
  const canvases=doc?.querySelectorAll("canvas").length||0;add(true,"Adapters complexos",`${registry.stats.viewers||0} viewer(s), ${canvases} canvas/WebGL detectado(s).`,"ok");
  add(registry.stats.objects>0,"Catálogo de objetos",`${registry.stats.objects} objetos editáveis na rota atual.`,registry.stats.objects?"ok":"warn");
  return checks;
}

export default function EditorInteractionLayer(){
  const initial=typeof window!=="undefined"?loadPrefs():{};
  const [mode,setMode]=useState("");
  const [registry,setRegistry]=useState(EMPTY);
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const [prefs,setPrefs]=useState({editMode:initial.editMode!==false,outline:Boolean(initial.outline),xray:Boolean(initial.xray),safeMode:Boolean(initial.safeMode)});
  const [health,setHealth]=useState([]);
  const [siteIndex,setSiteIndex]=useState({running:false,done:0,total:0,routes:{}});
  const [showInspector,setShowInspector]=useState(true);
  const frameRef=useRef(null),detachRef=useRef(()=>{}),timerRef=useRef(null),observerRef=useRef(null),registryRef=useRef(EMPTY),prefsRef=useRef(prefs),selectionStackRef=useRef([]),selectionIndexRef=useRef(0);

  useEffect(()=>{prefsRef.current=prefs;savePrefs(prefs);const doc=frameRef.current?.contentDocument;if(doc)installCoreCss(doc,prefs)},[prefs]);
  useEffect(()=>{registryRef.current=registry},[registry]);

  const source=mode==="layers"?registry.layers:registry.objects;
  const filtered=useMemo(()=>registrySearch(source,query),[source,query]);

  function refresh(frame=frameRef.current){
    const doc=frame?.contentDocument;if(!doc?.body)return;
    const route=frame.contentWindow?.location?.pathname||frame.getAttribute("src")||"/";const next=buildObjectRegistry(doc,route);registryRef.current=next;setRegistry(next);installCoreCss(doc,prefsRef.current);
    try{sessionStorage.setItem("estibordo-registry:"+route,JSON.stringify({route,stats:next.stats,objects:next.objects.slice(0,500),layers:next.layers.slice(0,500)}))}catch{}
  }

  function selectElement(el,{cycle=false}={}){
    const frame=frameRef.current,doc=frame?.contentDocument;if(!doc||!el)return;
    const target=editableTarget(el);if(!target)return;
    if(cycle){const point=selectionStackRef.current;if(point.length){selectionIndexRef.current=(selectionIndexRef.current+1)%point.length;return selectElement(point[selectionIndexRef.current],{cycle:false})}}
    doc.querySelectorAll("[data-editor-core-selected]").forEach(n=>n.removeAttribute("data-editor-core-selected"));
    target.setAttribute("data-editor-core-selected","");const id=target.getAttribute("data-editor-id");const item=id?registryRef.current.byId[id]:null;
    if(item)target.setAttribute("data-editor-name",item.label||item.adapter);setSelected(item||{id,selector:selectorForNode(target),label:target.tagName,adapter:"dom",breadcrumb:"",width:Math.round(target.getBoundingClientRect().width),height:Math.round(target.getBoundingClientRect().height)});
    try{target.dispatchEvent(new frame.contentWindow.MouseEvent("click",{bubbles:true,cancelable:true,view:frame.contentWindow}))}catch{}
  }

  function pick(item){const doc=frameRef.current?.contentDocument;if(!doc)return;let el=null;try{el=doc.querySelector(item.selector)}catch{}if(!el)return;try{el.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})}catch{}selectElement(el);setTimeout(()=>setMode(""),100)}
  function toggleLock(){const doc=frameRef.current?.contentDocument;if(!doc||!selected)return;const el=doc.querySelector(selected.selector);if(!el)return;const locked=el.hasAttribute("data-editor-core-locked");el.toggleAttribute("data-editor-core-locked",!locked);setSelected(x=>x?{...x,locked:!locked}:x)}
  function isolate(){const doc=frameRef.current?.contentDocument;if(!doc||!selected)return;const el=doc.querySelector(selected.selector);if(!el)return;const active=doc.documentElement.hasAttribute("data-editor-core-isolated");doc.documentElement.toggleAttribute("data-editor-core-isolated",!active);doc.querySelectorAll("[data-editor-core-isolation-root]").forEach(n=>n.removeAttribute("data-editor-core-isolation-root"));if(!active){let root=el;while(root.parentElement&&root.parentElement!==doc.body)root=root.parentElement;root.setAttribute("data-editor-core-isolation-root","")}}
  async function copySelector(){if(!selected?.selector)return;try{await navigator.clipboard.writeText(selected.selector)}catch{} }
  function parentSelect(){const doc=frameRef.current?.contentDocument;if(!doc||!selected)return;const el=doc.querySelector(selected.selector),p=editableTarget(el?.parentElement);if(p)selectElement(p)}

  useEffect(()=>{
    const closeStudio=()=>document.querySelectorAll(".ev-studio-backdrop.is-open").forEach(el=>{const x=el.querySelector(".ev-studio-x");if(x instanceof HTMLElement)x.click()});
    const parentClick=e=>{const b=e.target?.closest?.("button");if(!b)return;const text=(b.textContent||"").trim().toLowerCase();if(text.includes("selecionar camada")){e.preventDefault();e.stopPropagation();closeStudio();setMode("layers");setQuery("");refresh()}else if(text.includes("selecionar objeto")){e.preventDefault();e.stopPropagation();closeStudio();setMode("objects");setQuery("");refresh()}};
    document.addEventListener("click",parentClick,true);

    function attach(frame){
      if(!frame||frame===frameRef.current)return;detachRef.current?.();frameRef.current=frame;
      let raf=0;
      const setup=()=>{
        const doc=frame.contentDocument;if(!doc?.body)return;installCoreCss(doc,prefsRef.current);refresh(frame);
        const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>refresh(frame))};observerRef.current=new MutationObserver(schedule);observerRef.current.observe(doc.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class","style","hidden","src","aria-label"]});
        const pointer=e=>{
          if(!prefsRef.current.editMode)return;if(e.button!==undefined&&e.button!==0)return;if(e.target?.closest?.("[data-ev-resize-overlay]"))return;
          const raw=e.target;if(!(raw instanceof frame.contentWindow.Element))return;const target=editableTarget(raw);if(!target)return;
          if(target.hasAttribute("data-editor-core-locked")){e.preventDefault();e.stopImmediatePropagation();selectElement(target);return}
          const stack=doc.elementsFromPoint(e.clientX,e.clientY).map(editableTarget).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i);selectionStackRef.current=stack;selectionIndexRef.current=0;
          if(e.altKey&&!e.shiftKey){e.preventDefault();e.stopImmediatePropagation();selectElement(stack[1]||stack[0]);return}
          queueMicrotask(()=>selectElement(target));
        };
        const key=e=>{if(!prefsRef.current.editMode)return;if(e.key==="Escape"){doc.documentElement.removeAttribute("data-editor-core-isolated");doc.querySelectorAll("[data-editor-core-isolation-root]").forEach(n=>n.removeAttribute("data-editor-core-isolation-root"));parentSelect()}if(e.key==="Tab"&&e.altKey){e.preventDefault();selectElement(selectionStackRef.current[selectionIndexRef.current],{cycle:true})}};
        doc.addEventListener("pointerdown",pointer,true);doc.addEventListener("keydown",key,true);
        const dnd=Array.from(document.querySelectorAll("button")).find(x=>/dnd\s*off/i.test(x.textContent||""));if(dnd instanceof HTMLElement)dnd.click();
        detachRef.current=()=>{cancelAnimationFrame(raf);observerRef.current?.disconnect();try{doc.removeEventListener("pointerdown",pointer,true);doc.removeEventListener("keydown",key,true)}catch{}};
      };
      frame.addEventListener("load",setup);setup();const cleanup=detachRef.current;detachRef.current=()=>{frame.removeEventListener("load",setup);cleanup?.()};
    }
    const scan=()=>{const f=currentFrame();if(f)attach(f)};timerRef.current=setInterval(scan,700);scan();
    return()=>{document.removeEventListener("click",parentClick,true);clearInterval(timerRef.current);detachRef.current?.()};
  },[]);

  function runHealth(){refresh();setHealth(healthCheck(frameRef.current,registryRef.current));setMode("health")}

  async function indexSite(){
    if(siteIndex.running)return;setSiteIndex({running:true,done:0,total:0,routes:{}});
    try{
      const res=await fetch("/api/site-editor/pages",{cache:"no-store"}),json=await res.json();const routes=(json.groups||[]).flatMap(g=>g.pages||[]).map(p=>p[0]).filter(r=>r&&r!=="/admin/editor"&&!/\[.+\]/.test(r)).slice(0,120);const results={};setSiteIndex({running:true,done:0,total:routes.length,routes:{}});
      const ghost=document.createElement("iframe");ghost.style.cssText="position:fixed;width:1280px;height:800px;left:-20000px;top:-20000px;visibility:hidden";document.body.appendChild(ghost);
      for(let i=0;i<routes.length;i++){
        const route=routes[i];await new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;resolve()};ghost.onload=()=>setTimeout(finish,180);ghost.src=route==="/__404"?"/__estibordo-system/404-preview":route;setTimeout(finish,4500)});
        try{const reg=buildObjectRegistry(ghost.contentDocument,route);results[route]={stats:reg.stats,objects:reg.objects.slice(0,300),layers:reg.layers.slice(0,300)}}catch{results[route]={error:true}}
        setSiteIndex({running:true,done:i+1,total:routes.length,routes:{...results}});await sleep(40);
      }
      ghost.remove();try{sessionStorage.setItem("estibordo-site-object-index",JSON.stringify(results))}catch{}setSiteIndex({running:false,done:routes.length,total:routes.length,routes:results});
    }catch{setSiteIndex(x=>({...x,running:false}))}
  }

  const coreBar=<div className="eic-corebar" data-editor-interaction-ignore>
    <button className={prefs.editMode?"on":""} onClick={()=>setPrefs(p=>({...p,editMode:!p.editMode}))}>{prefs.editMode?"✦ EDITAR":"▶ PREVIEW"}</button>
    <button className={prefs.outline?"on":""} onClick={()=>setPrefs(p=>({...p,outline:!p.outline}))}>Outline</button>
    <button className={prefs.xray?"on":""} onClick={()=>setPrefs(p=>({...p,xray:!p.xray}))}>X-Ray</button>
    <button className={prefs.safeMode?"warn":""} onClick={()=>setPrefs(p=>({...p,safeMode:!p.safeMode}))}>Safe Mode</button>
    <button onClick={runHealth}>Health Check</button>
    <button onClick={indexSite}>{siteIndex.running?`Indexando ${siteIndex.done}/${siteIndex.total}`:"Indexar site"}</button>
    <span>{registry.route||"Página"} · {registry.stats.total||0} nós · {registry.stats.objects||0} objetos</span>
  </div>;

  return <>{coreBar}
    {selected&&showInspector&&<aside className="eic-inspector" data-editor-interaction-ignore><header><div><b>{selected.label||selected.tag}</b><span>{selected.adapter} · {selected.width}×{selected.height}px</span></div><button onClick={()=>setShowInspector(false)}>×</button></header><div className="eic-breadcrumb">{selected.breadcrumb||selected.selector}</div><dl><dt>ID persistente</dt><dd>{selected.id||"—"}</dd><dt>Seletor</dt><dd>{selected.selector}</dd><dt>Adapter</dt><dd>{selected.adapter}</dd></dl><div className="eic-actions"><button onClick={parentSelect}>↑ Pai</button><button onClick={isolate}>Isolar</button><button className={selected.locked?"warn":""} onClick={toggleLock}>{selected.locked?"Desbloquear":"Bloquear"}</button><button onClick={copySelector}>Copiar seletor</button></div></aside>}
    {!showInspector&&selected&&<button className="eic-inspector-open" onClick={()=>setShowInspector(true)}>Objeto</button>}
    {mode&&<div className="eix-backdrop" data-editor-interaction-ignore onMouseDown={e=>e.target===e.currentTarget&&setMode("")}><aside className="eix-panel"><header><div><b>{mode==="layers"?"Selecionar camada":mode==="objects"?"Selecionar objeto":"Editor Health Check"}</b><span>{registry.route||"Página atual"}{mode!=="health"?` · ${source.length} catalogados`:" · diagnóstico do núcleo"}</span></div><button onClick={()=>setMode("")}>×</button></header>{mode!=="health"&&<><div className="eix-search"><input autoFocus placeholder="Buscar nome, tipo, adapter, breadcrumb ou seletor…" value={query} onChange={e=>setQuery(e.target.value)}/><button onClick={()=>refresh()}>↻</button></div><div className="eix-list">{filtered.length?filtered.map((item,i)=><button key={item.id+"-"+i} onClick={()=>pick(item)}><i>{item.adapter}</i><div><b>{item.label}</b><small>{item.tag} · {item.breadcrumb||item.selector}</small></div><em>{item.width}×{item.height}</em></button>):<p>Nenhum item encontrado nesta página.</p>}</div></>}{mode==="health"&&<div className="eic-health">{health.map((x,i)=><article key={i} className={"is-"+x.level}><i>{x.ok?"✓":"!"}</i><div><b>{x.name}</b><span>{x.detail}</span></div></article>)}</div>}</aside></div>}
    <style jsx global>{`
      .eic-corebar{position:fixed;z-index:100055;left:50%;bottom:12px;transform:translateX(-50%);display:flex;align-items:center;gap:4px;padding:5px;background:rgba(7,27,43,.94);border:1px solid #29485b;border-radius:11px;box-shadow:0 12px 35px rgba(0,0,0,.25);backdrop-filter:blur(12px)}.eic-corebar button{border:1px solid #35556a;background:#102b3d;color:#d9e8f0;border-radius:7px;padding:7px 9px;font-size:7px;font-weight:900;cursor:pointer;white-space:nowrap}.eic-corebar button.on{background:#176e9d;border-color:#55a7e6;color:#fff}.eic-corebar button.warn{background:#9a6511;border-color:#f0ae35}.eic-corebar span{font-size:7px;color:#8fb0c4;padding:0 8px;white-space:nowrap}
      .eic-inspector{position:fixed;z-index:100054;left:14px;bottom:62px;width:330px;max-height:48vh;background:rgba(255,255,255,.97);border:1px solid #d2dfe6;border-radius:12px;box-shadow:0 15px 42px rgba(0,0,0,.18);overflow:auto}.eic-inspector>header{display:flex;justify-content:space-between;align-items:center;padding:10px 11px;border-bottom:1px solid #e0e8ec}.eic-inspector>header b,.eic-inspector>header span{display:block}.eic-inspector>header b{font-size:10px;color:#102f42;max-width:245px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.eic-inspector>header span{font-size:7px;color:#728995;margin-top:2px}.eic-inspector>header button{border:0;background:#edf3f6;border-radius:6px;width:27px;height:27px}.eic-breadcrumb{padding:8px 11px;background:#f4f8fa;color:#416276;font-size:7px;line-height:1.5}.eic-inspector dl{display:grid;grid-template-columns:85px 1fr;gap:5px 8px;padding:10px 11px;margin:0}.eic-inspector dt{font-size:7px;font-weight:900;color:#7d909b}.eic-inspector dd{margin:0;font-size:7px;color:#294b5e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.eic-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:0 10px 10px}.eic-actions button{border:1px solid #d3dfe5;background:#f7fafb;border-radius:6px;padding:7px 3px;font-size:6px;font-weight:900}.eic-actions button.warn{background:#fff3d7;border-color:#e7b85a}.eic-inspector-open{position:fixed;z-index:100054;left:12px;bottom:66px;border:0;background:#7c3aed;color:#fff;border-radius:999px;padding:8px 11px;font-size:7px;font-weight:900}
      .eix-backdrop{position:fixed;z-index:100060;inset:64px 0 0;background:rgba(1,12,20,.42);display:grid;place-items:start center;padding-top:5vh}.eix-panel{width:min(760px,94vw);max-height:84vh;background:#fff;border:1px solid #d5e1e7;border-radius:14px;box-shadow:0 28px 90px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden}.eix-panel>header{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #dce6eb}.eix-panel>header b,.eix-panel>header span{display:block}.eix-panel>header b{font-size:14px;color:#082438}.eix-panel>header span{font-size:9px;color:#718692;margin-top:3px}.eix-panel>header button{width:34px;height:34px;border:0;border-radius:8px;background:#eef4f7;font-size:20px;cursor:pointer}.eix-search{display:grid;grid-template-columns:1fr 38px;gap:7px;padding:10px 12px;border-bottom:1px solid #e3eaee}.eix-search input{border:1px solid #cddbe2;border-radius:8px;padding:10px 12px;font-size:11px;outline:0}.eix-search button{border:1px solid #cddbe2;background:#f7fafb;border-radius:8px;cursor:pointer}.eix-list{overflow:auto;padding:8px;scrollbar-gutter:stable}.eix-list>button{width:100%;display:grid;grid-template-columns:82px 1fr auto;gap:10px;align-items:center;text-align:left;border:1px solid transparent;background:#fff;padding:9px;border-radius:9px;cursor:pointer}.eix-list>button:hover{background:#eef7fd;border-color:#c9e0ef}.eix-list i{font-style:normal;text-align:center;font-size:7px;font-weight:900;color:#205678;background:#e8f3fa;border-radius:999px;padding:5px}.eix-list b,.eix-list small{display:block}.eix-list b{font-size:10px;color:#102f42;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.eix-list small{font-size:7px;color:#81939d;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.eix-list em{font-style:normal;font-size:7px;color:#81939d}.eix-list>p{text-align:center;color:#7f929d;font-size:10px;padding:30px}.eix-list::-webkit-scrollbar{width:10px}.eix-list::-webkit-scrollbar-thumb{background:#9eb0bb;border:3px solid transparent;background-clip:padding-box;border-radius:99px}
      .eic-health{overflow:auto;padding:10px}.eic-health article{display:grid;grid-template-columns:28px 1fr;gap:9px;padding:9px;border-bottom:1px solid #e5ecef}.eic-health article>i{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#e7f7ef;color:#15845e;font-style:normal;font-weight:900}.eic-health article.is-warn>i{background:#fff4d8;color:#9a6511}.eic-health article.is-error>i{background:#ffe8eb;color:#b61d36}.eic-health b,.eic-health span{display:block}.eic-health b{font-size:9px;color:#18394d}.eic-health span{font-size:7px;color:#738793;margin-top:3px}
      @media(max-width:900px){.eic-corebar{left:8px;right:8px;transform:none;overflow:auto;justify-content:flex-start}.eic-corebar span{display:none}.eic-inspector{left:8px;right:8px;width:auto;bottom:62px}}
    `}</style>
  </>;
}
