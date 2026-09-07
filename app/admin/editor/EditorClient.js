"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SITE_MAP = [
  {group:"Institucional",pages:[
    ["/","Página inicial"],["/plataforma","Conheça a plataforma"],["/sobre-nos","Sobre nós"],
    ["/produtos","Produtos"],["/produtos/simulados","Produto · Simulados"],
    ["/produtos/banco-de-questoes","Produto · Banco de Questões"],
    ["/produtos/flashcards-mapas-mentais","Produto · Flashcards + Mapas Mentais"],
    ["/sobre-a-praticagem","Sobre a Praticagem"],
    ["/sobre-a-praticagem/o-que-faz-um-pratico","O que faz um Prático"],
    ["/sobre-a-praticagem/como-se-tornar-um-pratico","Como se tornar um Prático"]
  ]},
  {group:"Conta e vendas",pages:[
    ["/login","Login"],["/cadastro","Cadastro"],["/esqueci-minha-senha","Esqueci minha senha"],
    ["/comprar","Comprar assinatura"],["/minhas-assinaturas","Minhas Assinaturas"],["/perfil","Perfil"]
  ]},
  {group:"Área do aluno",pages:[
    ["/area-do-aluno","Dashboard"],["/conteudos","Conteúdos"],["/simulado","Simulados"],
    ["/conteudos/banco-de-questoes","Banco de Questões / Cadernos"],
    ["/conteudos/caderno-de-erros","Caderno de Erros"],["/plano-de-estudos","Plano de Estudos"],
    ["/revisao-inteligente","Revisão Inteligente"],["/analise-de-fraquezas","Análise de Fraquezas"],
    ["/ranking","Ranking"],["/contramestre","CONTRAMESTRE"]
  ]},
  {group:"Administração",pages:[
    ["/admin","Dashboard Admin"],["/admin/usuarios","Usuários"],["/admin/questoes","Questões"],
    ["/admin/simulados","Simulados"],["/admin/conteudo","Conteúdo"],["/admin/pagamentos","Pagamentos"],
    ["/admin/metricas","Métricas"],["/admin/contramestre","CONTRAMESTRE"],["/admin/configuracoes","Configurações"]
  ]}
];

const PALETTE = ["#ffffff","#f7fbff","#d9ecf8","#eef3f6","#c8102e","#07141f","#071b2b","#0d1b2a","#1e3a5f","#55a7e6","#18c98a","#f0ae35"];

const STYLE_KEYS = [
  "color","backgroundColor","fontSize","fontWeight","fontFamily","textAlign","letterSpacing","lineHeight",
  "width","height","minWidth","maxWidth","minHeight","maxHeight",
  "paddingTop","paddingRight","paddingBottom","paddingLeft",
  "marginTop","marginRight","marginBottom","marginLeft",
  "borderRadius","borderWidth","borderStyle","borderColor",
  "display","flexDirection","justifyContent","alignItems","gap",
  "position","top","right","bottom","left","zIndex","opacity","overflow","objectFit","objectPosition",
  "backgroundImage","backgroundSize","backgroundPosition","backgroundRepeat","boxShadow","filter",
  "textTransform","textDecoration","whiteSpace","cursor","translate"
];

const emptyStyle = () => Object.fromEntries(STYLE_KEYS.map(k=>[k,""]));
const clone = (v) => JSON.parse(JSON.stringify(v));

function cssEscape(v){
  if(typeof CSS!=="undefined" && CSS.escape) return CSS.escape(v);
  return String(v).replace(/([^a-zA-Z0-9_-])/g,"\\$1");
}

function selectorFor(el){
  if(!el || el.nodeType!==1) return "";
  if(el.id) return `#${cssEscape(el.id)}`;
  const parts=[]; let node=el;
  while(node && node.nodeType===1 && node.tagName.toLowerCase()!=="html"){
    const tag=node.tagName.toLowerCase();
    if(tag==="body"){parts.unshift("body");break;}
    const classes=Array.from(node.classList||[]).filter(c=>!c.startsWith("ev-")&&!c.startsWith("is-")).slice(0,2);
    let part=tag+classes.map(c=>`.${cssEscape(c)}`).join("");
    const parent=node.parentElement;
    if(parent){
      const same=Array.from(parent.children).filter(x=>x.tagName===node.tagName);
      if(same.length>1) part+=`:nth-of-type(${same.indexOf(node)+1})`;
    }
    parts.unshift(part);
    node=parent;
    if(parts.length>=7) break;
  }
  return parts.join(" > ");
}

function rgbHex(v){
  const m=String(v||"").match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if(!m) return v==="rgba(0, 0, 0, 0)"?"":v||"";
  return "#"+[m[1],m[2],m[3]].map(x=>Number(x).toString(16).padStart(2,"0")).join("");
}

function computedStyle(el){
  if(!el) return emptyStyle();
  const c=el.ownerDocument.defaultView.getComputedStyle(el);
  const g=(k)=>c[k]||"";
  return {
    ...emptyStyle(),
    color:rgbHex(c.color),backgroundColor:rgbHex(c.backgroundColor),
    fontSize:g("fontSize"),fontWeight:g("fontWeight"),fontFamily:g("fontFamily"),textAlign:g("textAlign"),
    letterSpacing:g("letterSpacing"),lineHeight:g("lineHeight"),
    width:g("width"),height:g("height"),minWidth:g("minWidth"),maxWidth:c.maxWidth==="none"?"":c.maxWidth,
    minHeight:g("minHeight"),maxHeight:c.maxHeight==="none"?"":c.maxHeight,
    paddingTop:g("paddingTop"),paddingRight:g("paddingRight"),paddingBottom:g("paddingBottom"),paddingLeft:g("paddingLeft"),
    marginTop:g("marginTop"),marginRight:g("marginRight"),marginBottom:g("marginBottom"),marginLeft:g("marginLeft"),
    borderRadius:g("borderRadius"),borderWidth:g("borderWidth"),borderStyle:g("borderStyle"),borderColor:rgbHex(c.borderColor),
    display:g("display"),flexDirection:g("flexDirection"),justifyContent:g("justifyContent"),alignItems:g("alignItems"),gap:g("gap"),
    position:g("position"),top:c.top==="auto"?"":c.top,right:c.right==="auto"?"":c.right,bottom:c.bottom==="auto"?"":c.bottom,left:c.left==="auto"?"":c.left,
    zIndex:c.zIndex==="auto"?"":c.zIndex,opacity:g("opacity"),overflow:g("overflow"),objectFit:g("objectFit"),objectPosition:g("objectPosition"),
    backgroundImage:c.backgroundImage==="none"?"":c.backgroundImage,backgroundSize:g("backgroundSize"),backgroundPosition:g("backgroundPosition"),backgroundRepeat:g("backgroundRepeat"),
    boxShadow:c.boxShadow==="none"?"":c.boxShadow,filter:c.filter==="none"?"":c.filter,textTransform:g("textTransform"),textDecoration:g("textDecoration"),
    whiteSpace:g("whiteSpace"),cursor:g("cursor"),translate:c.translate==="none"?"":c.translate
  };
}

function TextField({label,value,onChange,placeholder,type="text"}){
  return <label className="ev-field"><span>{label}</span><input type={type} value={value||""} placeholder={placeholder||""} onChange={e=>onChange(e.target.value)}/></label>;
}

function SelectField({label,value,onChange,options}){
  return <label className="ev-field"><span>{label}</span><select value={value||""} onChange={e=>onChange(e.target.value)}><option value="">Padrão</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></label>;
}

function ColorControl({label,value,onChange}){
  const safe=/^#[0-9a-f]{6}$/i.test(value||"")?value:"#ffffff";
  return <div className="ev-color-control"><span>{label}</span><div className="ev-color-row"><input className="ev-color-picker" type="color" value={safe} onChange={e=>onChange(e.target.value)}/><input value={value||""} placeholder="#FFFFFF" onChange={e=>onChange(e.target.value)}/></div><div className="ev-swatches">{PALETTE.map(c=><button type="button" key={c} title={c} style={{background:c}} onClick={()=>onChange(c)}/>)}</div></div>;
}

export default function EditorClient(){
  const [auth,setAuth]=useState("checking");
  const [password,setPassword]=useState("");
  const [page,setPage]=useState("/");
  const [viewport,setViewport]=useState("desktop");
  const [scope,setScope]=useState("page");
  const [design,setDesign]=useState(null);
  const [original,setOriginal]=useState(null);
  const [sha,setSha]=useState("");
  const [target,setTarget]=useState(null);
  const [style,setStyle]=useState(emptyStyle());
  const [styleOverrides,setStyleOverrides]=useState({});
  const [attrs,setAttrs]=useState({});
  const [attrsOverrides,setAttrsOverrides]=useState({});
  const [hidden,setHidden]=useState(false);
  const [tab,setTab]=useState("content");
  const [status,setStatus]=useState("");
  const [saving,setSaving]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [zoom,setZoom]=useState(100);
  const [moveMode,setMoveMode]=useState(false);
  const [showGrid,setShowGrid]=useState(false);
  const [snap,setSnap]=useState(true);
  const [layers,setLayers]=useState([]);
  const [locked,setLocked]=useState(false);
  const [cloneCount,setCloneCount]=useState(0);
  const [styleClipboard,setStyleClipboard]=useState(null);
  const [undoStack,setUndoStack]=useState([]);
  const [redoStack,setRedoStack]=useState([]);
  const iframeRef=useRef(null);
  const cleanupRef=useRef(null);
  const targetRef=useRef(null);
  const scopeRef=useRef(scope);
  const pageRef=useRef(page);
  const moveModeRef=useRef(moveMode);
  const gridRef=useRef(showGrid);
  const snapRef=useRef(snap);

  const dirty=useMemo(()=>design&&original&&JSON.stringify(design)!==JSON.stringify(original),[design,original]);

  async function load(){
    const r=await fetch("/api/site-editor/design",{cache:"no-store"});
    if(r.status===401){setAuth("login");return;}
    const j=await r.json();
    if(!j.ok) throw new Error(j.error||"Falha ao carregar editor.");
    setDesign(j.content);setOriginal(clone(j.content));setSha(j.sha||"");setUndoStack([]);setRedoStack([]);setAuth("ready");
  }

  useEffect(()=>{load().catch(e=>{setStatus(e.message);setAuth("login")})},[]);
  useEffect(()=>()=>cleanupRef.current?.(),[]);
  useEffect(()=>{targetRef.current=target},[target]);
  useEffect(()=>{scopeRef.current=scope},[scope]);
  useEffect(()=>{pageRef.current=page},[page]);
  useEffect(()=>{moveModeRef.current=moveMode},[moveMode]);
  useEffect(()=>{gridRef.current=showGrid;try{iframeRef.current?.contentDocument?.documentElement?.classList.toggle("ev-editor-grid",showGrid)}catch{}},[showGrid]);
  useEffect(()=>{snapRef.current=snap},[snap]);

  async function login(e){
    e.preventDefault();setStatus("Autenticando...");
    const r=await fetch("/api/site-editor/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
    const j=await r.json();
    if(!r.ok){setStatus(j.error||"Senha inválida.");return;}
    setPassword("");setStatus("");await load();
  }

  function record(selector=target?.selector){
    if(!selector||!design) return null;
    return scope==="global" ? design.global?.elements?.[selector] : design.pages?.[page]?.elements?.[selector];
  }

  function remember(){
    if(!design)return;
    setUndoStack(prev=>[...prev.slice(-39),clone(design)]);
    setRedoStack([]);
  }

  function restoreSnapshot(snapshot){
    if(!snapshot)return;
    setDesign(clone(snapshot));
    setTarget(null);
    setStatus("Histórico restaurado. Salve para publicar.");
    setTimeout(()=>iframeRef.current?.contentWindow?.location.reload(),0);
  }

  function undo(){
    setUndoStack(prev=>{
      if(!prev.length)return prev;
      const snapshot=prev[prev.length-1];
      setRedoStack(r=>design?[...r.slice(-39),clone(design)]:r);
      restoreSnapshot(snapshot);
      return prev.slice(0,-1);
    });
  }

  function redo(){
    setRedoStack(prev=>{
      if(!prev.length)return prev;
      const snapshot=prev[prev.length-1];
      setUndoStack(u=>design?[...u.slice(-39),clone(design)]:u);
      restoreSnapshot(snapshot);
      return prev.slice(0,-1);
    });
  }

  function refreshLayers(doc=iframeRef.current?.contentDocument){
    if(!doc)return;
    const nodes=Array.from(doc.querySelectorAll("header,nav,main,section,article,aside,footer,h1,h2,h3,p,a,button,img"))
      .filter(el=>!el.hasAttribute("data-estibordo-runtime-clone"))
      .slice(0,250);
    setLayers(nodes.map((el,index)=>({
      index,
      selector:selectorFor(el),
      tag:el.tagName.toLowerCase(),
      label:(el.innerText||el.getAttribute("alt")||el.getAttribute("aria-label")||el.tagName).trim().replace(/\s+/g," ").slice(0,72)
    })).filter(x=>x.selector));
  }

  function selectBySelector(selector){
    try{
      const el=iframeRef.current?.contentDocument?.querySelector(selector);
      if(el)selectElement(el);
    }catch{}
  }

  function copyStyle(){
    setStyleClipboard(clone(styleOverrides));
    setStatus("Estilo copiado.");
  }

  function pasteStyle(){
    if(!styleClipboard||!target)return;
    remember();
    const so=clone(styleClipboard);
    setStyleOverrides(so);
    setStyle(s=>({...s,...so}));
    try{const el=iframeRef.current?.contentDocument?.querySelector(target.selector);if(el)Object.entries(so).forEach(([k,v])=>{el.style[k]=v})}catch{}
    write(so,attrsOverrides,hidden,locked,cloneCount);
    setStatus("Estilo aplicado. Salve para publicar.");
  }

  function selectElement(el){
    const selector=selectorFor(el); if(!selector)return;
    const current=scope==="global"?design?.global?.elements?.[selector]:design?.pages?.[page]?.elements?.[selector];
    const base=computedStyle(el);
    const overrides={...(current?.style||{})};
    const a={
      text:el.children.length===0?(el.textContent||""):undefined,
      href:el.getAttribute?.("href")||undefined,
      src:el.getAttribute?.("src")||undefined,
      alt:el.getAttribute?.("alt")||undefined,
      title:el.getAttribute?.("title")||undefined
    };
    Object.keys(a).forEach(k=>a[k]===undefined&&delete a[k]);
    if(current?.locked){setStatus("Este elemento está bloqueado no editor.");return;}
    const ao={...(current?.attrs||{})};
    setLocked(Boolean(current?.locked));setCloneCount(Number(current?.cloneCount||0));
    setTarget({selector,tag:el.tagName.toLowerCase(),label:(el.innerText||el.textContent||el.getAttribute?.("alt")||el.tagName).trim().slice(0,120)});
    setStyle({...base,...overrides});setStyleOverrides(overrides);
    setAttrs({...a,...ao});setAttrsOverrides(ao);setHidden(Boolean(current?.hidden));
    if(el.tagName==="IMG") setTab("media"); else if(el.children.length===0) setTab("content"); else setTab("design");
  }

  function wireIframe(){
    cleanupRef.current?.();
    const doc=iframeRef.current?.contentDocument;if(!doc)return;
    const s=doc.createElement("style");
    s.textContent=`
      [data-ev-hover]{outline:2px dashed #c8102e!important;outline-offset:2px!important;cursor:crosshair!important}
      [data-ev-selected]{outline:3px solid #2f80ed!important;outline-offset:3px!important}
      html.ev-editor-grid body{background-image:linear-gradient(rgba(30,58,95,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(30,58,95,.08) 1px,transparent 1px)!important;background-size:20px 20px!important}
      [data-ev-dragging]{cursor:grabbing!important;user-select:none!important}
    `;
    doc.head.appendChild(s);
    doc.documentElement.classList.toggle("ev-editor-grid",gridRef.current);
    refreshLayers(doc);
    let hover,selected,drag=null;

    const over=e=>{if(drag)return;if(hover)hover.removeAttribute("data-ev-hover");hover=e.target;hover?.setAttribute("data-ev-hover","")};
    const click=e=>{e.preventDefault();e.stopPropagation();if(drag)return;if(selected)selected.removeAttribute("data-ev-selected");selected=e.target;selected.setAttribute("data-ev-selected","");selectElement(selected)};

    const down=e=>{
      if(!moveModeRef.current || locked || !selected || e.target!==selected)return;
      e.preventDefault();e.stopPropagation();
      const current=String(selected.style.translate||doc.defaultView.getComputedStyle(selected).translate||"").trim();
      const nums=current.match(/-?\d+(?:\.\d+)?/g)||[];
      drag={el:selected,startX:e.clientX,startY:e.clientY,baseX:Number(nums[0]||0),baseY:Number(nums[1]||0),x:Number(nums[0]||0),y:Number(nums[1]||0)};
      selected.setAttribute("data-ev-dragging","");
    };

    const move=e=>{
      if(!drag)return;
      let x=drag.baseX+(e.clientX-drag.startX),y=drag.baseY+(e.clientY-drag.startY);
      if(snapRef.current){x=Math.round(x/5)*5;y=Math.round(y/5)*5}
      drag.x=x;drag.y=y;drag.el.style.translate=`${x}px ${y}px`;
    };

    const up=()=>{
      if(!drag)return;
      const selector=selectorFor(drag.el);
      const value=`${drag.x}px ${drag.y}px`;
      drag.el.removeAttribute("data-ev-dragging");
      if(targetRef.current?.selector===selector){
        remember();
        setStyle(s=>({...s,translate:value}));
        setStyleOverrides(prev=>{
          const so={...prev,translate:value};
          setDesign(current=>{
            const n=clone(current||{version:2,global:{favicon:"",elements:{}},pages:{}});
            n.global||={favicon:"",elements:{}};n.global.elements||={};n.pages||={};
            const config={style:so,attrs:{...attrsOverrides},hidden:Boolean(hidden)};
            if(scopeRef.current==="global")n.global.elements[selector]=config;
            else{const p=pageRef.current;n.pages[p]||={elements:{}};n.pages[p].elements||={};n.pages[p].elements[selector]=config}
            return n;
          });
          return so;
        });
        setStatus("Posição alterada por arraste. Salve para publicar.");
      }
      drag=null;
    };

    doc.addEventListener("mouseover",over,true);
    doc.addEventListener("click",click,true);
    doc.addEventListener("mousedown",down,true);
    doc.addEventListener("mousemove",move,true);
    doc.addEventListener("mouseup",up,true);
    cleanupRef.current=()=>{
      doc.removeEventListener("mouseover",over,true);doc.removeEventListener("click",click,true);
      doc.removeEventListener("mousedown",down,true);doc.removeEventListener("mousemove",move,true);doc.removeEventListener("mouseup",up,true);s.remove()
    };
  }

  function write(nextStyle=styleOverrides,nextAttrs=attrsOverrides,nextHidden=hidden,nextLocked=locked,nextCloneCount=cloneCount){
    if(!target?.selector)return;
    setDesign(prev=>{
      const n=clone(prev||{version:2,global:{favicon:"",elements:{}},pages:{}});
      n.version=2;n.global||={favicon:"",elements:{}};n.global.elements||={};n.pages||={};
      const config={};
      if(Object.keys(nextStyle).length)config.style={...nextStyle};
      if(Object.keys(nextAttrs).length)config.attrs={...nextAttrs};
      config.hidden=Boolean(nextHidden);
      if(nextLocked)config.locked=true;
      if(Number(nextCloneCount)>0)config.cloneCount=Math.min(10,Number(nextCloneCount));
      if(scope==="global")n.global.elements[target.selector]=config;
      else{n.pages[page]||={elements:{}};n.pages[page].elements||={};n.pages[page].elements[target.selector]=config;}
      return n;
    });
  }

  function setStyleValue(key,value){
    remember();
    const so={...styleOverrides};if(value==="")delete so[key];else so[key]=value;
    setStyle(s=>({...s,[key]:value}));setStyleOverrides(so);
    try{const el=iframeRef.current?.contentDocument?.querySelector(target.selector);if(el)el.style[key]=value}catch{}
    write(so,attrsOverrides,hidden);
  }

  function setAttr(key,value){
    remember();
    const ao={...attrsOverrides};if(value==="")delete ao[key];else ao[key]=value;
    setAttrs(a=>({...a,[key]:value}));setAttrsOverrides(ao);
    try{
      const el=iframeRef.current?.contentDocument?.querySelector(target.selector);
      if(el){if(key==="text"&&el.children.length===0)el.textContent=value;else if(key!=="text"){if(value)el.setAttribute(key,value);else el.removeAttribute(key)}}
    }catch{}
    write(styleOverrides,ao,hidden);
  }

  function toggleHidden(v){
    remember();
    setHidden(v);
    try{const el=iframeRef.current?.contentDocument?.querySelector(target.selector);if(el)el.style.display=v?"none":(style.display||"")}catch{}
    write(styleOverrides,attrsOverrides,v);
  }

  function resetTarget(){
    if(!target?.selector)return;
    remember();
    setDesign(prev=>{
      const n=clone(prev);
      if(scope==="global")delete n.global?.elements?.[target.selector];
      else delete n.pages?.[page]?.elements?.[target.selector];
      return n;
    });
    setStatus("Alterações desse elemento removidas. Salve para publicar.");
    iframeRef.current?.contentWindow?.location.reload();
  }

  function toggleLocked(v){
    remember();setLocked(v);write(styleOverrides,attrsOverrides,hidden,v,cloneCount);
    setStatus(v?"Elemento bloqueado no editor.":"Elemento desbloqueado.");
  }

  function changeCloneCount(v){
    const n=Math.max(0,Math.min(10,Number(v)||0));
    remember();setCloneCount(n);write(styleOverrides,attrsOverrides,hidden,locked,n);
    setStatus(n?"Duplicação configurada. Salve para publicar.":"Duplicatas removidas. Salve para publicar.");
  }

  function bringForward(delta){
    const current=Number.parseInt(style.zIndex||"0",10)||0;
    setStyleValue("zIndex",String(current+delta));
  }

  async function upload(file,mode="src"){
    if(!file)return;
    setUploading(true);setStatus("Enviando imagem...");
    const fd=new FormData();fd.append("file",file);
    const r=await fetch("/api/site-editor/upload",{method:"POST",body:fd});const j=await r.json();
    setUploading(false);
    if(!r.ok){setStatus(j.error||"Falha no upload.");return;}
    if(mode==="src")setAttr("src",j.url);
    else setStyleValue("backgroundImage",`url("${j.url}")`);
    setStatus("Imagem enviada. Clique em Salvar para publicar.");
  }

  async function save(){
    if(!design)return;setSaving(true);setStatus("Publicando alterações...");
    const r=await fetch("/api/site-editor/design/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:design,sha})});
    const j=await r.json();setSaving(false);
    if(!r.ok){setStatus(j.error||"Falha ao salvar.");return;}
    setSha(j.sha||sha);setOriginal(clone(design));setStatus("Publicado. A Vercel fará o deploy automaticamente.");
  }

  if(auth==="checking")return <main className="ev-login"><div><b>ESTIBORDO EDITOR</b><p>Carregando editor visual…</p></div></main>;
  if(auth==="login")return <main className="ev-login"><form onSubmit={login}><b>ESTIBORDO EDITOR</b><h1>Editor visual</h1><p>Acesso exclusivo do administrador.</p><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha do editor" required/><button>Entrar no editor</button>{status&&<small>{status}</small>}</form></main>;

  return <main className="ev-app">
    <header className="ev-topbar">
      <div className="ev-brand"><b>ESTIBORDO</b><span>EDITOR VISUAL</span></div>
      <div className="ev-device">
        {["desktop","tablet","mobile"].map(v=><button key={v} className={viewport===v?"is-active":""} onClick={()=>setViewport(v)}>{v==="desktop"?"Desktop":v==="tablet"?"Tablet":"Mobile"}</button>)}
      </div>
      <div className="ev-toolbar">
        <button onClick={undo} disabled={!undoStack.length} title="Desfazer">↶</button>
        <button onClick={redo} disabled={!redoStack.length} title="Refazer">↷</button>
        <button className={moveMode?"is-active":""} onClick={()=>setMoveMode(v=>!v)} title="Mover elementos por arraste">✥ Mover</button>
        <button className={showGrid?"is-active":""} onClick={()=>setShowGrid(v=>!v)} title="Mostrar grade"># Grade</button>
        <button className={snap?"is-active":""} onClick={()=>setSnap(v=>!v)} title="Ajustar movimento em passos de 5 px">⊞ Snap</button>
        <div className="ev-zoom"><button onClick={()=>setZoom(z=>Math.max(40,z-10))}>−</button><span>{zoom}%</span><button onClick={()=>setZoom(z=>Math.min(160,z+10))}>+</button><button onClick={()=>setZoom(100)}>100</button></div>
      </div>
      <div className="ev-actions"><span className={dirty?"ev-dirty":"ev-saved"}>{dirty?"Alterações não publicadas":"Tudo salvo"}</span><a href={page} target="_blank">Abrir página ↗</a><button className="ev-publish" disabled={!dirty||saving} onClick={save}>{saving?"Publicando…":"Salvar e publicar"}</button></div>
    </header>

    <div className="ev-workspace">
      <aside className="ev-sitemap">
        <div className="ev-side-title"><b>MAPA DO SITE</b><span>Escolha uma página para editar</span></div>
        <div className="ev-site-scroll">{SITE_MAP.map(group=><section key={group.group}><h4>{group.group}</h4>{group.pages.map(([url,label])=><button className={page===url?"is-active":""} key={url} onClick={()=>{setPage(url);setTarget(null)}}><span>{label}</span><small>{url}</small></button>)}</section>)}</div>
        <div className="ev-layers"><div className="ev-layers-head"><b>CAMADAS</b><button type="button" onClick={()=>refreshLayers()}>↻</button></div><div className="ev-layer-scroll">{layers.map(layer=><button type="button" key={layer.selector+"-"+layer.index} className={target?.selector===layer.selector?"is-active":""} onClick={()=>selectBySelector(layer.selector)}><small>{layer.tag}</small><span>{layer.label||layer.selector}</span></button>)}</div></div>
      </aside>

      <section className="ev-canvas">
        <div className="ev-canvas-head"><div><b>{SITE_MAP.flatMap(x=>x.pages).find(x=>x[0]===page)?.[1]||page}</b><span>{page}</span></div><em>{moveMode?"Modo mover: selecione e arraste o elemento":"Clique em qualquer elemento para editar"}</em></div>
        <div className={`ev-frame-shell ev-${viewport}`}><iframe ref={iframeRef} key={page} src={page} onLoad={wireIframe} title="Prévia da página" style={{transform:`scale(${zoom/100})`,transformOrigin:"top left",width:`${10000/zoom}%`,height:`${10000/zoom}%`}}/></div>
      </section>

      <aside className="ev-inspector">
        {!target ? <div className="ev-empty"><div className="ev-empty-icon">✦</div><h3>Selecione um elemento</h3><p>Clique em um texto, botão, imagem, card, cabeçalho ou menu na prévia. As ferramentas de edição aparecerão aqui.</p><div className="ev-tip"><b>Dica</b><span>Para cabeçalho, menu, logo ou rodapé, use o escopo <strong>Todo o site</strong>.</span></div></div> :
        <>
          <div className="ev-inspector-head"><div><span>{target.tag.toUpperCase()}</span><b>{target.label||"Elemento selecionado"}</b></div><code title={target.selector}>{target.selector}</code></div>
          <div className="ev-object-tools"><button type="button" onClick={copyStyle}>Copiar estilo</button><button type="button" disabled={!styleClipboard} onClick={pasteStyle}>Colar estilo</button><button type="button" onClick={()=>bringForward(1)}>Frente +</button><button type="button" onClick={()=>bringForward(-1)}>Trás −</button></div>
          <div className="ev-scope"><span>Aplicar em</span><button className={scope==="page"?"is-active":""} onClick={()=>setScope("page")}>Só esta página</button><button className={scope==="global"?"is-active":""} onClick={()=>setScope("global")}>Todo o site</button></div>
          <nav className="ev-tabs">{[["content","Conteúdo"],["design","Design"],["media","Imagem"],["layout","Layout"]].map(([id,label])=><button key={id} className={tab===id?"is-active":""} onClick={()=>setTab(id)}>{label}</button>)}</nav>
          <div className="ev-inspector-scroll">
            {tab==="content"&&<>
              {"text" in attrs&&<label className="ev-field"><span>Texto</span><textarea rows="6" value={attrs.text||""} onChange={e=>setAttr("text",e.target.value)}/></label>}
              {"href" in attrs&&<TextField label="Link / destino" value={attrs.href} onChange={v=>setAttr("href",v)} placeholder="/pagina ou https://..."/>}
              {"title" in attrs&&<TextField label="Título acessível" value={attrs.title} onChange={v=>setAttr("title",v)}/>}
              {!('text' in attrs)&&!('href' in attrs)&&<p className="ev-help">Este elemento é um contêiner. Para editar texto, clique diretamente no título ou parágrafo dentro dele.</p>}
            </>}

            {tab==="design"&&<>
              <ColorControl label="Cor do texto" value={style.color} onChange={v=>setStyleValue("color",v)}/>
              <ColorControl label="Cor do fundo" value={style.backgroundColor} onChange={v=>setStyleValue("backgroundColor",v)}/>
              <div className="ev-grid2"><TextField label="Tamanho" value={style.fontSize} onChange={v=>setStyleValue("fontSize",v)} placeholder="16px"/><SelectField label="Peso" value={style.fontWeight} onChange={v=>setStyleValue("fontWeight",v)} options={["400","500","600","700","800","900"]}/></div>
              <SelectField label="Fonte" value={style.fontFamily} onChange={v=>setStyleValue("fontFamily",v)} options={["Montserrat","Poppins","Arial","Georgia"]}/>
              <div className="ev-grid2"><SelectField label="Alinhamento" value={style.textAlign} onChange={v=>setStyleValue("textAlign",v)} options={["left","center","right","justify"]}/><TextField label="Altura da linha" value={style.lineHeight} onChange={v=>setStyleValue("lineHeight",v)} placeholder="1.5"/></div>
              <div className="ev-grid2"><TextField label="Raio da borda" value={style.borderRadius} onChange={v=>setStyleValue("borderRadius",v)} placeholder="12px"/><TextField label="Espessura" value={style.borderWidth} onChange={v=>setStyleValue("borderWidth",v)} placeholder="1px"/></div>
              <ColorControl label="Cor da borda" value={style.borderColor} onChange={v=>setStyleValue("borderColor",v)}/>
              <TextField label="Sombra" value={style.boxShadow} onChange={v=>setStyleValue("boxShadow",v)} placeholder="0 12px 30px rgba(0,0,0,.15)"/>
              <div className="ev-grid2"><SelectField label="Maiúsculas/minúsculas" value={style.textTransform} onChange={v=>setStyleValue("textTransform",v)} options={["none","uppercase","lowercase","capitalize"]}/><SelectField label="Decoração" value={style.textDecoration} onChange={v=>setStyleValue("textDecoration",v)} options={["none","underline","line-through"]}/></div>
            </>}

            {tab==="media"&&<>
              <div className="ev-media-card"><b>Trocar imagem pelo computador</b><p>PNG, JPG, WEBP, GIF ou AVIF. Máximo 5 MB.</p><label className="ev-upload"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={e=>upload(e.target.files?.[0],"src")}/><span>{uploading?"Enviando…":"Escolher imagem"}</span></label></div>
              {"src" in attrs&&<><TextField label="URL da imagem" value={attrs.src} onChange={v=>setAttr("src",v)}/><TextField label="Texto alternativo (ALT)" value={attrs.alt} onChange={v=>setAttr("alt",v)}/><div className="ev-grid2"><SelectField label="Ajuste" value={style.objectFit} onChange={v=>setStyleValue("objectFit",v)} options={["cover","contain","fill","none"]}/><TextField label="Posição" value={style.objectPosition} onChange={v=>setStyleValue("objectPosition",v)} placeholder="center center"/></div></>}
              <div className="ev-media-card"><b>Imagem de fundo</b><p>Use quando o elemento selecionado for uma seção, card ou banner.</p><label className="ev-upload secondary"><input type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0],"background")}/><span>Enviar como fundo</span></label></div>
            </>}

            {tab==="layout"&&<>
              <h4 className="ev-subtitle">DIMENSÕES</h4><div className="ev-grid2"><TextField label="Largura" value={style.width} onChange={v=>setStyleValue("width",v)} placeholder="auto"/><TextField label="Altura" value={style.height} onChange={v=>setStyleValue("height",v)} placeholder="auto"/></div>
              <h4 className="ev-subtitle">ESPAÇAMENTO INTERNO</h4><div className="ev-grid4">{["Top","Right","Bottom","Left"].map(side=><TextField key={side} label={side} value={style["padding"+side]} onChange={v=>setStyleValue("padding"+side,v)} placeholder="0px"/>)}</div>
              <h4 className="ev-subtitle">MARGENS</h4><div className="ev-grid4">{["Top","Right","Bottom","Left"].map(side=><TextField key={side} label={side} value={style["margin"+side]} onChange={v=>setStyleValue("margin"+side,v)} placeholder="0px"/>)}</div>
              <div className="ev-grid2"><SelectField label="Display" value={style.display} onChange={v=>setStyleValue("display",v)} options={["block","inline-block","flex","grid","none"]}/><TextField label="Gap" value={style.gap} onChange={v=>setStyleValue("gap",v)} placeholder="12px"/></div>
              <div className="ev-grid2"><SelectField label="Direção flex" value={style.flexDirection} onChange={v=>setStyleValue("flexDirection",v)} options={["row","column","row-reverse","column-reverse"]}/><SelectField label="Alinhar itens" value={style.alignItems} onChange={v=>setStyleValue("alignItems",v)} options={["stretch","flex-start","center","flex-end"]}/></div>
              <TextField label="Opacidade" value={style.opacity} onChange={v=>setStyleValue("opacity",v)} placeholder="1"/>
              <h4 className="ev-subtitle">POSICIONAMENTO</h4>
              <div className="ev-align-tools"><button type="button" onClick={()=>setStyleValue("marginLeft","0px")}>Esquerda</button><button type="button" onClick={()=>{setStyleValue("marginLeft","auto");setStyleValue("marginRight","auto")}}>Centro</button><button type="button" onClick={()=>setStyleValue("marginRight","0px")}>Direita</button></div>
              <div className="ev-grid2"><TextField label="Camada (z-index)" value={style.zIndex} onChange={v=>setStyleValue("zIndex",v)} placeholder="0"/><SelectField label="Posição" value={style.position} onChange={v=>setStyleValue("position",v)} options={["relative","absolute","fixed","sticky"]}/></div>
              <TextField label="Deslocamento (X Y)" value={style.translate} onChange={v=>setStyleValue("translate",v)} placeholder="0px 0px"/>
              <div className="ev-quick-actions"><button type="button" onClick={()=>setStyleValue("translate","0px 0px")}>Centralizar deslocamento</button><button type="button" onClick={()=>setStyleValue("width","100%")}>Largura 100%</button><button type="button" onClick={()=>setStyleValue("marginLeft","auto")}>Margem esquerda auto</button><button type="button" onClick={()=>setStyleValue("marginRight","auto")}>Margem direita auto</button></div>
              <h4 className="ev-subtitle">FUNDO</h4>
              <div className="ev-grid2"><SelectField label="Tamanho do fundo" value={style.backgroundSize} onChange={v=>setStyleValue("backgroundSize",v)} options={["cover","contain","auto"]}/><TextField label="Posição do fundo" value={style.backgroundPosition} onChange={v=>setStyleValue("backgroundPosition",v)} placeholder="center center"/></div>
            </>}
            <div className="ev-pro-tools"><label><input type="checkbox" checked={locked} onChange={e=>toggleLocked(e.target.checked)}/> Bloquear no editor</label><label>Duplicatas <input type="number" min="0" max="10" value={cloneCount} onChange={e=>changeCloneCount(e.target.value)}/></label></div>
            <div className="ev-danger-zone"><label><input type="checkbox" checked={hidden} onChange={e=>toggleHidden(e.target.checked)}/> Ocultar elemento</label><button type="button" onClick={resetTarget}>Restaurar este elemento</button></div>
            {status&&<div className="ev-status">{status}</div>}
          </div>
        </>}
      </aside>
    </div>
  </main>;
}
