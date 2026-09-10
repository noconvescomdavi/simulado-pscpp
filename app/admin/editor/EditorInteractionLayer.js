"use client";

import {useEffect,useMemo,useRef,useState} from "react";

function esc(v){
  if(typeof CSS!=="undefined"&&CSS.escape)return CSS.escape(v);
  return String(v).replace(/([^a-zA-Z0-9_-])/g,"\\$1");
}
function selectorFor(el){
  if(!el||el.nodeType!==1)return "";
  if(el.id)return `#${esc(el.id)}`;
  const parts=[];let node=el;
  while(node&&node.nodeType===1&&node.tagName.toLowerCase()!=="html"){
    const tag=node.tagName.toLowerCase();
    if(tag==="body"){parts.unshift("body");break}
    const classes=Array.from(node.classList||[]).filter(c=>!c.startsWith("ev-")&&!c.startsWith("is-")).slice(0,2);
    let part=tag+classes.map(c=>`.`+esc(c)).join("");
    const parent=node.parentElement;
    if(parent){const same=Array.from(parent.children).filter(x=>x.tagName===node.tagName);if(same.length>1)part+=`:nth-of-type(${same.indexOf(node)+1})`}
    parts.unshift(part);node=parent;if(parts.length>=8)break;
  }
  return parts.join(" > ");
}
function labelFor(el){
  const own=[el.getAttribute?.("aria-label"),el.getAttribute?.("title"),el.getAttribute?.("alt"),el.dataset?.title,el.dataset?.label].find(Boolean);
  if(own)return String(own).trim().replace(/\s+/g," ").slice(0,100);
  const text=(el.innerText||el.textContent||"").trim().replace(/\s+/g," ");
  if(text)return text.slice(0,100);
  const cls=Array.from(el.classList||[]).filter(Boolean).slice(0,3).join(".");
  return cls?`${el.tagName.toLowerCase()}.${cls}`:el.tagName.toLowerCase();
}
function kindFor(el){
  const tag=el.tagName.toLowerCase();
  if(tag==="img"||tag==="svg"||tag==="canvas"||tag==="video")return "Mídia";
  if(tag==="button"||tag==="a"||tag==="input"||tag==="select"||tag==="textarea")return "Controle";
  if(/^h[1-6]$/.test(tag)||tag==="p"||tag==="span"||tag==="label")return "Texto";
  if(["header","nav","main","section","article","aside","footer"].includes(tag))return "Estrutura";
  return "Objeto";
}
function visible(el){
  try{const r=el.getBoundingClientRect(),cs=el.ownerDocument.defaultView.getComputedStyle(el);return r.width>1&&r.height>1&&cs.display!=="none"&&cs.visibility!=="hidden"}catch{return false}
}
function catalog(doc){
  if(!doc?.body)return {layers:[],objects:[]};
  const all=Array.from(doc.body.querySelectorAll("*")).filter(el=>!el.closest?.("[data-ev-resize-overlay]")&&!el.hasAttribute?.("data-editor-interaction-ignore"));
  const layerTags=new Set(["HEADER","NAV","MAIN","SECTION","ARTICLE","ASIDE","FOOTER"]);
  const layers=[];const objects=[];const seenLayer=new Set(),seenObject=new Set();
  for(const el of all){
    if(!visible(el))continue;
    const selector=selectorFor(el);if(!selector)continue;
    const tag=el.tagName.toLowerCase(),label=labelFor(el),kind=kindFor(el);
    const isLayer=layerTags.has(el.tagName)||(el.tagName==="DIV"&&el.children.length>0&&(el.id||Array.from(el.classList||[]).some(c=>/(section|panel|card|grid|row|column|container|content|viewer|canvas|stage|sidebar|toolbar|controls|scene|light)/i.test(c))));
    if(isLayer&&!seenLayer.has(selector)){seenLayer.add(selector);layers.push({selector,tag,label,kind})}
    const r=el.getBoundingClientRect();
    const isObject=el.children.length===0||["IMG","SVG","CANVAS","VIDEO","BUTTON","A","INPUT","SELECT","TEXTAREA"].includes(el.tagName)||el.hasAttribute("data-estibordo-editor-block")||Array.from(el.classList||[]).some(c=>/(ship|vessel|light|mark|object|icon|model|viewer|canvas|button|card|badge|label|title|image)/i.test(c));
    if(isObject&&r.width<=doc.documentElement.clientWidth*1.05&&r.height<=doc.documentElement.clientHeight*1.5&&!seenObject.has(selector)){seenObject.add(selector);objects.push({selector,tag,label,kind})}
    if(layers.length>700&&objects.length>1400)break;
  }
  return {layers:layers.slice(0,700),objects:objects.slice(0,1400)};
}

export default function EditorInteractionLayer(){
  const [mode,setMode]=useState("");
  const [items,setItems]=useState({layers:[],objects:[]});
  const [query,setQuery]=useState("");
  const [route,setRoute]=useState("");
  const frameRef=useRef(null);const detachRef=useRef(()=>{});const timerRef=useRef(null);

  const filtered=useMemo(()=>{
    const src=mode==="layers"?items.layers:items.objects,q=query.trim().toLowerCase();
    if(!q)return src;return src.filter(x=>(x.label+" "+x.tag+" "+x.kind+" "+x.selector).toLowerCase().includes(q));
  },[mode,items,query]);

  useEffect(()=>{
    const closeMenus=()=>{document.querySelectorAll(".ev-studio-backdrop.is-open").forEach(el=>{const x=el.querySelector(".ev-studio-x");if(x instanceof HTMLElement)x.click()})};
    const parentClick=e=>{
      const b=e.target?.closest?.("button");if(!b)return;const t=(b.textContent||"").trim().toLowerCase();
      if(t.includes("selecionar camada")){e.preventDefault();e.stopPropagation();e.nativeEvent?.stopImmediatePropagation?.();closeMenus();setMode("layers");setQuery("");refreshNow()}
      else if(t.includes("selecionar objeto")){e.preventDefault();e.stopPropagation();e.nativeEvent?.stopImmediatePropagation?.();closeMenus();setMode("objects");setQuery("");refreshNow()}
    };
    document.addEventListener("click",parentClick,true);

    function refreshNow(){
      const frame=document.querySelector('iframe[title="Prévia da página"]');const doc=frame?.contentDocument;if(!doc)return;
      setRoute(frame.contentWindow?.location?.pathname||frame.getAttribute("src")||"");setItems(catalog(doc));
    }
    function attach(frame){
      if(!frame||frame===frameRef.current)return;detachRef.current?.();frameRef.current=frame;
      let observer=null,raf=0;
      const setup=()=>{
        const doc=frame.contentDocument;if(!doc?.body)return;
        setRoute(frame.contentWindow?.location?.pathname||frame.getAttribute("src")||"");setItems(catalog(doc));
        const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>setItems(catalog(doc)))};
        observer=new MutationObserver(schedule);observer.observe(doc.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class","style","hidden","src"]});

        // Selection fallback: always select on pointer-down. The original editor receives
        // a synthetic click even when the page's own handlers swallow/cancel native clicks.
        const selectOnPointer=e=>{
          if(e.button!==undefined&&e.button!==0)return;
          if(e.target?.closest?.("[data-ev-resize-overlay]"))return;
          const target=e.target;if(!(target instanceof frame.contentWindow.Element))return;
          queueMicrotask(()=>{try{target.dispatchEvent(new frame.contentWindow.MouseEvent("click",{bubbles:true,cancelable:true,view:frame.contentWindow}))}catch{}});
        };
        doc.addEventListener("pointerdown",selectOnPointer,true);

        // Drag & Drop is a primary editor interaction. If a previous session left the
        // toolbar OFF, restore it to ON when a page is attached.
        const dndButton=Array.from(document.querySelectorAll("button")).find(x=>/dnd\s*off/i.test(x.textContent||""));
        if(dndButton instanceof HTMLElement)dndButton.click();

        detachRef.current=()=>{cancelAnimationFrame(raf);observer?.disconnect();try{doc.removeEventListener("pointerdown",selectOnPointer,true)}catch{}};
      };
      frame.addEventListener("load",setup);setup();
      const previous=detachRef.current;detachRef.current=()=>{frame.removeEventListener("load",setup);previous?.();observer?.disconnect()};
    }
    const scan=()=>{const f=document.querySelector('iframe[title="Prévia da página"]');if(f)attach(f);refreshNow()};
    timerRef.current=setInterval(scan,800);scan();
    return()=>{document.removeEventListener("click",parentClick,true);clearInterval(timerRef.current);detachRef.current?.()};
  },[]);

  function pick(item){
    const frame=frameRef.current,doc=frame?.contentDocument;if(!doc)return;
    let el=null;try{el=doc.querySelector(item.selector)}catch{}
    if(!el)return;
    try{el.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})}catch{}
    el.setAttribute("data-ev-selected","");
    try{el.dispatchEvent(new frame.contentWindow.MouseEvent("click",{bubbles:true,cancelable:true,view:frame.contentWindow}))}catch{}
    setTimeout(()=>setMode(""),80);
  }

  if(!mode)return null;
  const current=mode==="layers"?items.layers:items.objects;
  return <div className="eix-backdrop" data-editor-interaction-ignore onMouseDown={e=>e.target===e.currentTarget&&setMode("")}>
    <aside className="eix-panel">
      <header><div><b>{mode==="layers"?"Selecionar camada":"Selecionar objeto"}</b><span>{route||"Página atual"} · {current.length} catalogados</span></div><button onClick={()=>setMode("")}>×</button></header>
      <div className="eix-search"><input autoFocus placeholder="Buscar por nome, tipo, classe ou seletor…" value={query} onChange={e=>setQuery(e.target.value)}/><button onClick={()=>{const f=frameRef.current;if(f?.contentDocument)setItems(catalog(f.contentDocument))}}>↻</button></div>
      <div className="eix-list">{filtered.length?filtered.map((item,i)=><button key={item.selector+"-"+i} onClick={()=>pick(item)}><i>{item.kind}</i><div><b>{item.label}</b><small>{item.tag} · {item.selector}</small></div></button>):<p>Nenhum item encontrado nesta página.</p>}</div>
    </aside>
    <style jsx global>{`
      .eix-backdrop{position:fixed;z-index:100060;inset:64px 0 0;background:rgba(1,12,20,.42);display:grid;place-items:start center;padding-top:5vh}.eix-panel{width:min(680px,92vw);max-height:82vh;background:#fff;border:1px solid #d5e1e7;border-radius:14px;box-shadow:0 28px 90px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden}.eix-panel>header{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #dce6eb}.eix-panel>header b,.eix-panel>header span{display:block}.eix-panel>header b{font-size:14px;color:#082438}.eix-panel>header span{font-size:9px;color:#718692;margin-top:3px}.eix-panel>header button{width:34px;height:34px;border:0;border-radius:8px;background:#eef4f7;font-size:20px;cursor:pointer}.eix-search{display:grid;grid-template-columns:1fr 38px;gap:7px;padding:10px 12px;border-bottom:1px solid #e3eaee}.eix-search input{border:1px solid #cddbe2;border-radius:8px;padding:10px 12px;font-size:11px;outline:0}.eix-search input:focus{border-color:#2f80ed;box-shadow:0 0 0 2px rgba(47,128,237,.12)}.eix-search button{border:1px solid #cddbe2;background:#f7fafb;border-radius:8px;font-size:15px;cursor:pointer}.eix-list{overflow:auto;padding:8px;scrollbar-gutter:stable}.eix-list>button{width:100%;display:grid;grid-template-columns:72px 1fr;gap:10px;align-items:center;text-align:left;border:1px solid transparent;background:#fff;padding:9px;border-radius:9px;cursor:pointer}.eix-list>button:hover{background:#eef7fd;border-color:#c9e0ef}.eix-list i{font-style:normal;text-align:center;font-size:8px;font-weight:900;letter-spacing:.05em;color:#205678;background:#e8f3fa;border-radius:999px;padding:5px}.eix-list b,.eix-list small{display:block}.eix-list b{font-size:10px;color:#102f42;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.eix-list small{font-size:7px;color:#81939d;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.eix-list>p{text-align:center;color:#7f929d;font-size:10px;padding:30px}.eix-list::-webkit-scrollbar{width:10px}.eix-list::-webkit-scrollbar-thumb{background:#9eb0bb;border:3px solid transparent;background-clip:padding-box;border-radius:99px}
    `}</style>
  </div>;
}
