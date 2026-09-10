"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import EditorToolbox from "./EditorToolbox";
import FlashcardManager from "./FlashcardManager";
import BlockInspector from "./BlockInspector";
import BlockTree from "./BlockTree";
import StudioMenu from "./StudioMenu";

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
    ["/flashcards","Flashcards"],["/flashcards/cis","Flashcards · CIS"],["/flashcards/arte-naval-nomenclatura-navio","Flashcards · Arte Naval"],["/flashcards/meus-mapas","Flashcards · Meus Mapas"],
    ["/admin","Dashboard Admin"],["/admin/usuarios","Usuários"],["/admin/questoes","Questões"],
    ["/admin/simulados","Simulados"],["/admin/conteudo","Conteúdo"],["/admin/pagamentos","Pagamentos"],
    ["/admin/metricas","Métricas"],["/admin/contramestre","CONTRAMESTRE"],["/admin/configuracoes","Configurações"]
  ]}
];

const PALETTE = ["#ffffff","#f7fbff","#d9ecf8","#eef3f6","#c8102e","#07141f","#071b2b","#0d1b2a","#1e3a5f","#55a7e6","#18c98a","#f0ae35"];

// Resoluções de referência: o conteúdo do iframe sempre renderiza como um dispositivo real.
// O zoom de 100% significa "tela normal" e a prévia é ajustada apenas visualmente para caber no editor.
const VIEWPORTS = {
  desktop:{width:1440,height:900,label:"Desktop · 1440 × 900"},
  tablet:{width:834,height:1194,label:"Tablet / iPad · 834 × 1194"},
  mobile:{width:390,height:844,label:"Mobile · 390 × 844"}
};

const STYLE_KEYS = [
  "color","backgroundColor","fontSize","fontWeight","fontFamily","textAlign","letterSpacing","lineHeight",
  "width","height","minWidth","maxWidth","minHeight","maxHeight",
  "paddingTop","paddingRight","paddingBottom","paddingLeft",
  "marginTop","marginRight","marginBottom","marginLeft",
  "borderRadius","borderWidth","borderStyle","borderColor",
  "display","flexDirection","justifyContent","alignItems","gap",
  "position","top","right","bottom","left","zIndex","opacity","overflow","objectFit","objectPosition",
  "backgroundImage","backgroundSize","backgroundPosition","backgroundRepeat","boxShadow","filter",
  "textTransform","textDecoration","whiteSpace","cursor","translate","transform","transition","aspectRatio","mixBlendMode","clipPath"
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

const CONTAINER_TYPES=new Set(["container","group","stack","grid"]);
function findBlock(blocks,id){for(const block of blocks||[]){if(block.id===id)return block;const found=findBlock(block.children||[],id);if(found)return found}return null}
function updateBlockTree(blocks,id,updater){return (blocks||[]).map(block=>{if(block.id===id)return updater(clone(block));if(block.children?.length)return {...block,children:updateBlockTree(block.children,id,updater)};return block})}
function removeBlockTree(blocks,id){let removed=null;const walk=items=>(items||[]).flatMap(block=>{if(block.id===id){removed=block;return[]}return [{...block,children:block.children?.length?walk(block.children):block.children}]});return {blocks:walk(blocks),removed}}
function insertBlockBefore(blocks,targetId,node){let inserted=false;const walk=items=>{const out=[];for(const block of items||[]){if(block.id===targetId&&!inserted){out.push(node);inserted=true}out.push({...block,children:block.children?.length?walk(block.children):block.children})}return out};return {blocks:walk(blocks),inserted}}
function appendBlockChild(blocks,targetId,node){let inserted=false;const walk=items=>(items||[]).map(block=>{if(block.id===targetId){inserted=true;return {...block,children:[...(block.children||[]),node]}}return {...block,children:block.children?.length?walk(block.children):block.children}});return {blocks:walk(blocks),inserted}}
function pageTemplate(id,title="Nova página"){const uid=type=>({id:"blk_"+type+"_"+Math.random().toString(36).slice(2,8),type});const hero={...uid("hero"),title,text:"Preparação inteligente, visual e orientada a desempenho.",button:"Começar agora",href:"/cadastro",style:{paddingTop:"72px",paddingBottom:"72px"}};const features={...uid("features"),title:"Tudo o que você precisa em um só fluxo",items:[["Planejamento","Organize prioridades e metas."],["Prática","Questões, simulados e flashcards."],["Diagnóstico","Entenda erros e evolução."]],style:{}};const cta={...uid("cta"),title:"Pronto para avançar?",text:"Transforme estudo em rotina mensurável.",button:"Criar minha conta",href:"/cadastro",style:{}};if(id==="product")return [hero,{...uid("container"),title:"Produto",style:{display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:"28px",alignItems:"center"},children:[{...uid("section"),title:"Recursos centrais",text:"Apresente benefícios, diferenciais e evidências.",style:{}},{...uid("stats"),items:[["7.000+","Questões"],["24/7","Acesso"],["100%","Online"]],style:{}}]},features,cta];if(id==="editorial")return [{...uid("section"),title,text:"Introdução editorial da página.",style:{maxWidth:"820px",marginLeft:"auto",marginRight:"auto",paddingTop:"64px",paddingBottom:"24px"}},{...uid("container"),title:"Conteúdo",style:{display:"grid",gridTemplateColumns:"minmax(0,1fr) 280px",gap:"36px"},children:[{...uid("text"),text:"Desenvolva o conteúdo principal aqui. Use blocos filhos para estruturar seções, imagens e chamadas.",style:{lineHeight:"1.75"}},{...uid("box"),title:"Resumo",text:"Pontos-chave, links e referências.",style:{}}]}];if(id==="dashboard")return [{...uid("container"),title:"Dashboard",style:{display:"grid",gridTemplateColumns:"260px minmax(0,1fr)",gap:"18px",minHeight:"70vh"},children:[{...uid("menu"),items:[["Visão geral","#"],["Métricas","#"],["Atividade","#"],["Configurações","#"]],style:{display:"flex",flexDirection:"column",gap:"8px"}},{...uid("grid"),title:"Painel",style:{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"14px"},children:[{...uid("stats"),items:[["68%","Prontidão"],["1.250","Questões"],["81%","Consistência"]],style:{}},{...uid("cards"),title:"Atalhos",items:[["Plano de estudos","Abrir planejamento"],["Revisão","Ver prioridades"],["Simulados","Treinar agora"]],style:{}}]}]}];if(id==="sales")return [hero,{...uid("testimonial"),quote:"Uma preparação mais organizada, visual e mensurável.",author:"ESTIBORDO",style:{}},features,{...uid("pricing"),title:"Escolha seu plano",items:[["Essencial","R$ 49","Base completa"],["Pro","R$ 89","Mais inteligência"],["Elite","R$ 149","Experiência máxima"]],style:{}},{...uid("faq"),title:"Perguntas frequentes",items:[["Como funciona?","Acesso online pela plataforma."],["Posso cancelar?","Consulte as condições comerciais vigentes."]],style:{}},cta];return [hero,features,cta]}
const PAGE_TEMPLATE_OPTIONS=[{id:"landing",label:"Landing · Conversão"},{id:"product",label:"Produto · SaaS"},{id:"sales",label:"Vendas · Completa"},{id:"editorial",label:"Editorial · Conteúdo"},{id:"dashboard",label:"Dashboard · App"}];

export default function EditorClient(){
  const [auth,setAuth]=useState("checking");
  const [password,setPassword]=useState("");
  const [page,setPage]=useState("/");
  const [siteMap,setSiteMap]=useState(SITE_MAP);
  const [viewport,setViewport]=useState("desktop");
  const [scope,setScope]=useState("page");
  const [layerDrag,setLayerDrag]=useState(null);
  const [selectedBlockId,setSelectedBlockId]=useState(null);
  const [design,setDesign]=useState(null);
  const [original,setOriginal]=useState(null);
  const [sha,setSha]=useState("");
  const [target,setTarget]=useState(null);
  const [style,setStyle]=useState(emptyStyle());
  const [styleOverrides,setStyleOverrides]=useState({});
  const [attrs,setAttrs]=useState({});
  const [attrsOverrides,setAttrsOverrides]=useState({});
  const [motion,setMotion]=useState({entrance:"none",duration:"500",delay:"0",hover:"none",click:"none"});
  const [hidden,setHidden]=useState(false);
  const [tab,setTab]=useState("content");
  const [status,setStatus]=useState("");
  const [saving,setSaving]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [zoom,setZoom]=useState(100);
  const [fitScale,setFitScale]=useState(1);
  const [toolboxOpen,setToolboxOpen]=useState(false);
  const [flashcardManagerOpen,setFlashcardManagerOpen]=useState(false);
  const [studioMenuOpen,setStudioMenuOpen]=useState(false);
  const [replacementTargetId,setReplacementTargetId]=useState(null);
  const [selectionPanel,setSelectionPanel]=useState("");
  const [moveMode,setMoveMode]=useState(true);
  const [snapSize,setSnapSize]=useState(1);
  const [showGrid,setShowGrid]=useState(false);
  const [snap,setSnap]=useState(true);
  const [layers,setLayers]=useState([]);
  const [locked,setLocked]=useState(false);
  const [cloneCount,setCloneCount]=useState(0);
  const [styleClipboard,setStyleClipboard]=useState(null);
  const [undoStack,setUndoStack]=useState([]);
  const [redoStack,setRedoStack]=useState([]);
  const iframeRef=useRef(null);
  const frameAreaRef=useRef(null);
  const cleanupRef=useRef(null);
  const targetRef=useRef(null);
  const scopeRef=useRef(scope);
  const pageRef=useRef(page);
  const moveModeRef=useRef(moveMode);
  const gridRef=useRef(showGrid);
  const snapRef=useRef(snap);
  const snapSizeRef=useRef(snapSize);

  const dirty=useMemo(()=>design&&original&&JSON.stringify(design)!==JSON.stringify(original),[design,original]);
  const selectedBlock=useMemo(()=>findBlock(design?.pages?.[page]?.blocks||[],selectedBlockId),[design,page,selectedBlockId]);
  useEffect(()=>{if(!design||auth!=="ready")return;const timer=setTimeout(()=>{try{iframeRef.current?.contentWindow?.postMessage({type:"estibordo-editor-design",design},window.location.origin)}catch{}},45);return()=>clearTimeout(timer)},[design,page,auth]);

  async function refreshSiteMap(){
    try{
      const r=await fetch("/api/site-editor/pages",{cache:"no-store"});
      const j=await r.json();
      if(r.ok&&j.ok&&Array.isArray(j.groups)&&j.groups.length)setSiteMap(j.groups);
    }catch{}
  }

  async function load(){
    const r=await fetch("/api/site-editor/design",{cache:"no-store"});
    if(r.status===401){setAuth("login");return;}
    const j=await r.json();
    if(!j.ok) throw new Error(j.error||"Falha ao carregar editor.");
    setDesign(j.content);setOriginal(clone(j.content));setSha(j.sha||"");setUndoStack([]);setRedoStack([]);setAuth("ready");
    void refreshSiteMap();
  }

  useEffect(()=>{load().catch(e=>{setStatus(e.message);setAuth("login")})},[]);
  useEffect(()=>()=>cleanupRef.current?.(),[]);
  useEffect(()=>{targetRef.current=target},[target]);
  useEffect(()=>{scopeRef.current=scope},[scope]);
  useEffect(()=>{pageRef.current=page},[page]);
  useEffect(()=>{moveModeRef.current=moveMode},[moveMode]);
  useEffect(()=>{gridRef.current=showGrid;try{iframeRef.current?.contentDocument?.documentElement?.classList.toggle("ev-editor-grid",showGrid)}catch{}},[showGrid]);
  useEffect(()=>{snapRef.current=snap},[snap]);
  useEffect(()=>{snapSizeRef.current=snapSize},[snapSize]);
  useEffect(()=>{
    if(!target?.selector)return;
    const timer=setTimeout(()=>selectBySelector(target.selector),60);
    return ()=>clearTimeout(timer);
  },[viewport]);

  useEffect(()=>{
    const area=frameAreaRef.current;
    if(!area)return;
    const updateFit=()=>{
      const vp=VIEWPORTS[viewport];
      const availableWidth=Math.max(320,area.clientWidth-32);
      const availableHeight=Math.max(320,area.clientHeight-32);
      // Mantém a resolução real do dispositivo dentro do iframe e reduz apenas a representação visual.
      setFitScale(Math.min(1,availableWidth/vp.width,availableHeight/vp.height));
    };
    updateFit();
    const observer=new ResizeObserver(updateFit);
    observer.observe(area);
    window.addEventListener("resize",updateFit);
    return ()=>{observer.disconnect();window.removeEventListener("resize",updateFit)};
  },[viewport]);

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
    setTarget(null);setSelectedBlockId(null);
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

  function selectElement(el){const blockEl=el?.closest?.("[data-estibordo-editor-block]");if(blockEl){const blockId=blockEl.getAttribute("data-estibordo-editor-block");if(blockId){setSelectedBlockId(blockId);setTarget(null);setStatus("Bloco do editor selecionado. Edite conteúdo, layout e hierarquia no painel.");return}}setSelectedBlockId(null);
    const selector=selectorFor(el); if(!selector)return;
    const current=scope==="global"?design?.global?.elements?.[selector]:design?.pages?.[page]?.elements?.[selector];
    const base=computedStyle(el);
    const baseOverrides={...(current?.style||{})};
    const responsiveOverrides=viewport==="desktop"?{}:{...(current?.responsive?.[viewport]?.style||{})};
    const overrides=viewport==="desktop"?baseOverrides:responsiveOverrides;
    const inherited=viewport==="desktop"?baseOverrides:{...baseOverrides,...(viewport==="mobile"?(current?.responsive?.tablet?.style||{}):{})};
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
    setStyle({...base,...inherited,...overrides});setStyleOverrides(overrides);
    setAttrs({...a,...ao});setAttrsOverrides(ao);setMotion({entrance:"none",duration:"500",delay:"0",hover:"none",click:"none",...(current?.motion||{})});setHidden(Boolean(current?.hidden));
    if(el.tagName==="IMG") setTab("media"); else if(el.children.length===0) setTab("content"); else setTab("design");
  }

  function wireIframe(){
    cleanupRef.current?.();
    const doc=iframeRef.current?.contentDocument;if(!doc)return;
    const s=doc.createElement("style");
    s.textContent=`
      [data-ev-hover]{outline:2px dashed #c8102e!important;outline-offset:2px!important;cursor:grab!important}
      [data-ev-selected]{outline:3px solid #2f80ed!important;outline-offset:3px!important}
      [data-ev-selected]::after{content:"ARRASTE";position:absolute!important;right:0!important;top:-24px!important;padding:4px 7px!important;border-radius:5px!important;background:#2f80ed!important;color:white!important;font:700 9px/1 Arial!important;letter-spacing:.08em!important;z-index:2147483647!important;pointer-events:none!important}
      html.ev-editor-grid body{background-image:linear-gradient(rgba(30,58,95,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(30,58,95,.08) 1px,transparent 1px)!important;background-size:20px 20px!important}
      [data-ev-dragging]{cursor:grabbing!important;user-select:none!important}
      [data-ev-resize-overlay] span{position:absolute;width:10px;height:10px;border:2px solid #fff;background:#2f80ed;border-radius:2px;box-shadow:0 0 0 1px #2f80ed;pointer-events:auto}
      [data-ev-resize="nw"]{left:-6px;top:-6px;cursor:nwse-resize}[data-ev-resize="n"]{left:50%;top:-6px;transform:translateX(-50%);cursor:ns-resize}[data-ev-resize="ne"]{right:-6px;top:-6px;cursor:nesw-resize}
      [data-ev-resize="e"]{right:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize}[data-ev-resize="se"]{right:-6px;bottom:-6px;cursor:nwse-resize}[data-ev-resize="s"]{left:50%;bottom:-6px;transform:translateX(-50%);cursor:ns-resize}
      [data-ev-resize="sw"]{left:-6px;bottom:-6px;cursor:nesw-resize}[data-ev-resize="w"]{left:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize}
    `;
    doc.head.appendChild(s);
    doc.documentElement.classList.toggle("ev-editor-grid",gridRef.current);
    refreshLayers(doc);try{iframeRef.current?.contentWindow?.postMessage({type:"estibordo-editor-design",design},window.location.origin)}catch{}
    let hover,selected,drag=null;

    const over=e=>{if(drag)return;if(hover)hover.removeAttribute("data-ev-hover");hover=e.target;hover?.setAttribute("data-ev-hover","")};
    const click=e=>{e.preventDefault();e.stopPropagation();if(drag||resize)return;if(e.target?.closest?.("[data-ev-resize-overlay]"))return;if(selected)selected.removeAttribute("data-ev-selected");selected=e.target;selected.setAttribute("data-ev-selected","");selectElement(selected);setTimeout(updateResizeOverlay,0)};

    let resize=null,resizeOverlay=null;

    const clearResizeOverlay=()=>{resizeOverlay?.remove();resizeOverlay=null};
    const updateResizeOverlay=()=>{
      clearResizeOverlay();
      if(!selected||!doc.contains(selected))return;
      const r=selected.getBoundingClientRect();
      const overlay=doc.createElement("div");overlay.setAttribute("data-ev-resize-overlay","");
      Object.assign(overlay.style,{position:"fixed",left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px",border:"1.5px solid #2f80ed",boxSizing:"border-box",zIndex:"2147483646",pointerEvents:"none"});
      const dirs=["nw","n","ne","e","se","s","sw","w"];
      for(const dir of dirs){const h=doc.createElement("span");h.dataset.evResize=dir;overlay.appendChild(h)}
      doc.body.appendChild(overlay);resizeOverlay=overlay;
    };

    const persistPatch=(el,blockId,patch,message)=>{
      if(blockId){
        updateBlock(blockId,b=>{if(viewport==="desktop")b.style={...(b.style||{}),...patch};else{b.responsive={...(b.responsive||{})};b.responsive[viewport]={...(b.responsive[viewport]||{}),style:{...(b.responsive?.[viewport]?.style||{}),...patch}}}return b;},message);
        setSelectedBlockId(blockId);setTarget(null);return;
      }
      const selector=selectorFor(el);if(!selector)return;
      remember();setStyle(s=>({...s,...patch}));setStyleOverrides(prev=>({...prev,...patch}));
      setDesign(current=>{const n=clone(current||{version:5,global:{favicon:"",elements:{}},pages:{}});n.global||={favicon:"",elements:{}};n.global.elements||={};n.pages||={};const holder=scopeRef.current==="global"?n.global.elements:((n.pages[pageRef.current]||={elements:{}}).elements||=( {} ));const config=holder[selector]||{};if(viewport==="desktop")config.style={...(config.style||{}),...patch};else{config.responsive={...(config.responsive||{})};config.responsive[viewport]={...(config.responsive[viewport]||{}),style:{...(config.responsive?.[viewport]?.style||{}),...patch}}}holder[selector]=config;return n});
      setStatus(message);
    };

    const normalizeForFreeMove=(el)=>{
      const visual=el.getBoundingClientRect();
      const cs=doc.defaultView.getComputedStyle(el);
      const nums=String(cs.translate||"").match(/-?\d+(?:\.\d+)?/g)||[];
      let baseTx=Number(nums[0]||0),baseTy=Number(nums[1]||0);
      if(cs.position==="absolute"||cs.position==="fixed"){
        const saved={position:el.style.position,left:el.style.left,top:el.style.top,right:el.style.right,bottom:el.style.bottom,margin:el.style.margin,translate:el.style.translate,width:el.style.width};
        el.style.position="relative";el.style.left="";el.style.top="";el.style.right="";el.style.bottom="";el.style.margin="";el.style.translate="0px 0px";
        const natural=el.getBoundingClientRect();
        baseTx=Math.round(visual.left-natural.left);baseTy=Math.round(visual.top-natural.top);
        el.style.position=saved.position;el.style.left=saved.left;el.style.top=saved.top;el.style.right=saved.right;el.style.bottom=saved.bottom;el.style.margin=saved.margin;el.style.translate=saved.translate;el.style.width=saved.width;
      }
      return {baseTx,baseTy};
    };

    const down=e=>{
      if(!moveModeRef.current)return;
      if(e.pointerType==="mouse"&&e.button!==0)return;
      if(e.target?.closest?.("[data-ev-resize-overlay]"))return;
      e.preventDefault();e.stopPropagation();
      if(selected)selected.removeAttribute("data-ev-selected");
      const blockRoot=e.target?.closest?.("[data-estibordo-editor-block]");
      selected=blockRoot||e.target;
      selected?.setAttribute("data-ev-selected","");
      selectElement(selected);
      const rect=selected.getBoundingClientRect();
      const norm=normalizeForFreeMove(selected);
      drag={el:selected,blockId:blockRoot?.getAttribute("data-estibordo-editor-block")||null,startX:e.clientX,startY:e.clientY,baseTx:norm.baseTx,baseTy:norm.baseTy,tx:norm.baseTx,ty:norm.baseTy,width:Math.round(rect.width),height:Math.round(rect.height),pointerId:e.pointerId,activated:false};
      selected.setAttribute("data-ev-dragging","");
      try{selected.setPointerCapture?.(e.pointerId)}catch{}
    };

    const move=e=>{
      if(resize){
        if(resize.pointerId!==undefined&&e.pointerId!==resize.pointerId)return;e.preventDefault();
        const dx=e.clientX-resize.startX,dy=e.clientY-resize.startY,dir=resize.dir;
        let w=resize.width,h=resize.height,tx=resize.tx,ty=resize.ty;
        if(dir.includes("e"))w=Math.max(24,resize.width+dx);
        if(dir.includes("s"))h=Math.max(18,resize.height+dy);
        if(dir.includes("w")){w=Math.max(24,resize.width-dx);tx=resize.tx+(resize.width-w)}
        if(dir.includes("n")){h=Math.max(18,resize.height-dy);ty=resize.ty+(resize.height-h)}
        resize.el.style.width=Math.round(w)+"px";resize.el.style.height=Math.round(h)+"px";resize.el.style.position="relative";resize.el.style.left="";resize.el.style.top="";resize.el.style.translate=Math.round(tx)+"px "+Math.round(ty)+"px";
        resize.next={width:Math.round(w)+"px",height:Math.round(h)+"px",position:"relative",left:"",top:"",right:"",bottom:"",translate:Math.round(tx)+"px "+Math.round(ty)+"px"};
        updateResizeOverlay();return;
      }
      if(!drag)return;
      if(drag.pointerId!==undefined&&e.pointerId!==undefined&&e.pointerId!==drag.pointerId)return;
      e.preventDefault();
      const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
      if(!drag.activated&&Math.hypot(dx,dy)<2)return;
      drag.activated=true;
      const step=snapRef.current?Math.max(1,Number(snapSizeRef.current)||1):1;
      drag.tx=Math.round((drag.baseTx+dx)/step)*step;drag.ty=Math.round((drag.baseTy+dy)/step)*step;
      drag.el.style.position="relative";drag.el.style.left="";drag.el.style.top="";drag.el.style.right="";drag.el.style.bottom="";drag.el.style.translate=drag.tx+"px "+drag.ty+"px";
      updateResizeOverlay();
    };

    const up=e=>{
      if(resize){
        const current=resize;resize=null;try{current.el.releasePointerCapture?.(current.pointerId)}catch{};
        if(current.next)persistPatch(current.el,current.blockId,current.next,"Objeto redimensionado livremente.");
        updateResizeOverlay();return;
      }
      if(!drag)return;
      const currentDrag=drag;drag=null;currentDrag.el.removeAttribute("data-ev-dragging");try{currentDrag.el.releasePointerCapture?.(currentDrag.pointerId)}catch{}
      if(!currentDrag.activated){updateResizeOverlay();return}
      const patch={position:"relative",left:"",top:"",right:"",bottom:"",translate:currentDrag.tx+"px "+currentDrag.ty+"px"};
      persistPatch(currentDrag.el,currentDrag.blockId,patch,"Objeto movido sem colapsar o espaço original.");
      updateResizeOverlay();
    };

    const resizeDown=e=>{
      const handle=e.target?.closest?.("[data-ev-resize]");
      if(!handle||!selected)return;
      e.preventDefault();e.stopPropagation();
      const rect=selected.getBoundingClientRect(),cs=doc.defaultView.getComputedStyle(selected),nums=String(cs.translate||"").match(/-?\d+(?:\.\d+)?/g)||[];
      const blockRoot=selected.closest?.("[data-estibordo-editor-block]");
      resize={el:selected,blockId:blockRoot?.getAttribute("data-estibordo-editor-block")||null,dir:handle.dataset.evResize,startX:e.clientX,startY:e.clientY,width:rect.width,height:rect.height,tx:Number(nums[0]||0),ty:Number(nums[1]||0),pointerId:e.pointerId,next:null};
      try{selected.setPointerCapture?.(e.pointerId)}catch{}
    };

    doc.addEventListener("mouseover",over,true);
    doc.addEventListener("click",click,true);
    doc.addEventListener("pointerdown",down,true);
    doc.addEventListener("pointerdown",resizeDown,true);
    doc.addEventListener("pointermove",move,true);
    doc.addEventListener("pointerup",up,true);
    doc.addEventListener("pointercancel",up,true);
    doc.defaultView.addEventListener("scroll",updateResizeOverlay,true);
    cleanupRef.current=()=>{
      clearResizeOverlay();
      doc.removeEventListener("mouseover",over,true);doc.removeEventListener("click",click,true);
      doc.removeEventListener("pointerdown",down,true);doc.removeEventListener("pointerdown",resizeDown,true);doc.removeEventListener("pointermove",move,true);doc.removeEventListener("pointerup",up,true);doc.removeEventListener("pointercancel",up,true);doc.defaultView.removeEventListener("scroll",updateResizeOverlay,true);s.remove()
    };  }

  function write(nextStyle=styleOverrides,nextAttrs=attrsOverrides,nextHidden=hidden,nextLocked=locked,nextCloneCount=cloneCount){
    if(!target?.selector)return;
    setDesign(prev=>{
      const n=clone(prev||{version:3,global:{favicon:"",elements:{}},pages:{}});
      n.version=3;n.global||={favicon:"",elements:{}};n.global.elements||={};n.pages||={};
      const holder=scope==="global"?n.global.elements:((n.pages[page]||={elements:{}}).elements||=( {} ));
      const previous=holder[target.selector]||{};
      const config={...previous,attrs:{...nextAttrs},hidden:Boolean(nextHidden)};
      if(viewport==="desktop"){
        config.style={...nextStyle};
      }else{
        config.responsive={...(previous.responsive||{})};
        config.responsive[viewport]={...(config.responsive[viewport]||{}),style:{...nextStyle}};
      }
      if(nextLocked)config.locked=true;else delete config.locked;
      if(Number(nextCloneCount)>0)config.cloneCount=Math.min(10,Number(nextCloneCount));else delete config.cloneCount;
      config.motion={...motion};
      holder[target.selector]=config;
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

  function pageConfig(){return design?.pages?.[page]?.settings||{};}
  function designSystem(){return design?.global?.designSystem||{};}
  function components(){return design?.global?.components||[];}
  function versions(){return design?.global?.versions||[];}

  function updateDesignSystem(patch){
    remember();
    setDesign(prev=>{const n=clone(prev||{version:3,global:{elements:{}},pages:{}});n.global||={elements:{}};n.global.designSystem={...(n.global.designSystem||{}),...patch};return n});
    setStatus("Design System atualizado. Salve para publicar.");
    setTimeout(()=>iframeRef.current?.contentWindow?.location.reload(),50);
  }

  function saveSelectionAsComponent(){
    if(!target?.selector)return;
    const name=window.prompt("Nome do componente reutilizável:",target.label?.slice(0,40)||"Componente");
    if(!name)return;
    const source=record();
    if(!source)return;
    remember();
    setDesign(prev=>{const n=clone(prev);n.global||={};n.global.components=[...(n.global.components||[]),{id:"cmp_"+Date.now().toString(36),name,config:clone(source),createdAt:new Date().toISOString()}].slice(-30);return n});
    setStatus("Componente salvo na biblioteca global.");
  }

  function applyComponent(component){
    if(!target?.selector||!component?.config)return;
    remember();
    setDesign(prev=>{const n=clone(prev);n.global||={elements:{}};n.global.elements||={};n.pages||={};const holder=scope==="global"?n.global.elements:((n.pages[page]||={elements:{}}).elements||=( {} ));holder[target.selector]={...clone(component.config)};return n});
    setStatus(`Componente “${component.name}” aplicado. Salve para publicar.`);
    setTimeout(()=>iframeRef.current?.contentWindow?.location.reload(),50);
  }

  function deleteComponent(id){
    remember();
    setDesign(prev=>{const n=clone(prev);n.global||={};n.global.components=(n.global.components||[]).filter(x=>x.id!==id);return n});
  }

  function restoreVersion(version){
    if(!version?.snapshot)return;
    if(!window.confirm("Restaurar este checkpoint? As alterações atuais não salvas serão substituídas."))return;
    const restored=clone(version.snapshot);
    restored.global||={};
    restored.global.versions=clone(design?.global?.versions||[]);
    setDesign(restored);setTarget(null);setStatus("Checkpoint restaurado. Revise e salve para publicar.");
    setTimeout(()=>iframeRef.current?.contentWindow?.location.reload(),50);
  }

  function breakpoints(){return design?.global?.breakpoints||{tablet:1024,mobile:620};}
  function updateBreakpoints(patch){remember();setDesign(prev=>{const n=clone(prev);n.global||={};n.global.breakpoints={tablet:1024,mobile:620,...(n.global.breakpoints||{}),...patch};return n});setStatus("Breakpoints atualizados.")}
  function customCode(){return design?.pages?.[page]?.customCode||{css:"",html:""};}
  function updateCustomCode(patch){remember();setDesign(prev=>{const n=clone(prev);n.pages||={};n.pages[page]||={elements:{},blocks:[],settings:{}};n.pages[page].customCode={...(n.pages[page].customCode||{}),...patch};return n});setStatus("Código customizado atualizado na prévia segura.")}
  function setMotionValue(key,value){const next={...motion,[key]:value};setMotion(next);remember();setDesign(prev=>{const n=clone(prev);n.global||={elements:{}};n.global.elements||={};n.pages||={};const holder=scope==="global"?n.global.elements:((n.pages[page]||={elements:{}}).elements||=( {} ));const config=holder[target?.selector]||{};config.motion=next;holder[target.selector]=config;return n});setStatus("Interação atualizada.")}
  function setBlockMotion(key,value){if(!selectedBlockId)return;updateBlock(selectedBlockId,b=>({...b,motion:{entrance:"none",duration:"500",delay:"0",hover:"none",click:"none",...(b.motion||{}),[key]:value}}),"Interação do bloco atualizada.")}
  function replaceBlockAsset(patch,message){
    if(!replacementTargetId)return false;
    updateBlock(replacementTargetId,current=>{const keep={id:current.id,style:clone(current.style||{}),responsive:clone(current.responsive||{}),motion:clone(current.motion||{})};return {...keep,...patch}} ,message||"Objeto substituído mantendo posição, tamanho e responsividade.");
    setSelectedBlockId(replacementTargetId);setReplacementTargetId(null);setStudioMenuOpen(false);return true;
  }
  function openAssetReplacement(){if(!selectedBlockId)return;setReplacementTargetId(selectedBlockId);setStudioMenuOpen(true);setStatus("Escolha o novo ícone/objeto. Layout e posição serão preservados.")}
  function addIconAsset(icon){if(replaceBlockAsset({type:"icon",title:icon.name,iconCategory:icon.c||"",svgPath:icon.path,iconPresentation:"pro"},"Ícone/objeto substituído sem alterar o layout."))return;const id="blk_icon_"+Math.random().toString(36).slice(2,8);const block={id,type:"icon",title:icon.name,iconCategory:icon.c||"",svgPath:icon.path,iconPresentation:"pro",style:{width:"72px",height:"72px",color:"#0b3b5b"}};remember();setDesign(prev=>{const n=clone(prev);n.pages||={};n.pages[page]||={elements:{},blocks:[],settings:{}};n.pages[page].blocks=[...(n.pages[page].blocks||[]),block];return n});setSelectedBlockId(id);setTarget(null);setStudioMenuOpen(false);setStatus("Ícone profissional adicionado ao canvas.")}
  function addSignalFlag(flag){if(replaceBlockAsset({type:"signalFlag",title:"CIS "+flag.code,text:flag.meaning,signalCode:flag.code,flagPattern:flag.pattern,flagA:flag.a,flagB:flag.b},"Objeto substituído pela bandeira CIS "+flag.code+"."))return;const id="blk_flag_"+Math.random().toString(36).slice(2,8);const block={id,type:"signalFlag",title:"CIS "+flag.code,text:flag.meaning,signalCode:flag.code,flagPattern:flag.pattern,flagA:flag.a,flagB:flag.b,style:{width:"180px",minHeight:"130px"}};remember();setDesign(prev=>{const n=clone(prev);n.pages||={};n.pages[page]||={elements:{},blocks:[],settings:{}};n.pages[page].blocks=[...(n.pages[page].blocks||[]),block];return n});setSelectedBlockId(id);setTarget(null);setStudioMenuOpen(false);setStatus("Bandeira CIS "+flag.code+" adicionada ao canvas.")}
  function addLogoAsset(logo){if(replaceBlockAsset({type:"logo",title:logo.wordmark||"ESTIBORDO",tagline:logo.tagline||"",svgPath:logo.mark||"",logoShape:logo.shape||"none"},"Objeto substituído por logo vetorial."))return;const id="blk_logo_"+Math.random().toString(36).slice(2,8);const block={id,type:"logo",title:logo.wordmark||"ESTIBORDO",tagline:logo.tagline||"",svgPath:logo.mark||"",logoShape:logo.shape||"none",style:{display:"inline-flex",alignItems:"center",gap:"12px",color:"#0b3b5b",paddingTop:"10px",paddingRight:"14px",paddingBottom:"10px",paddingLeft:"14px",borderRadius:logo.shape==="rounded"?"16px":logo.shape==="circle"?"999px":"12px"}};remember();setDesign(prev=>{const n=clone(prev);n.pages||={};n.pages[page]||={elements:{},blocks:[],settings:{}};n.pages[page].blocks=[...(n.pages[page].blocks||[]),block];return n});setSelectedBlockId(id);setTarget(null);setStudioMenuOpen(false);setStatus("Logo vetorial adicionado. Edite texto, tagline e estilo no painel.")}
  function importExternalImage(asset){if(replaceBlockAsset({type:"image",src:asset.url,alt:asset.name||"Imagem marítima"},"Objeto substituído por imagem mantendo o layout."))return;const id="blk_image_"+Math.random().toString(36).slice(2,8);const block={id,type:"image",src:asset.url,alt:asset.name||"Imagem marítima",style:{maxWidth:"100%",height:"auto",objectFit:"cover"}};remember();setDesign(prev=>{const n=clone(prev);n.global||={};n.global.media=[...(n.global.media||[]),{name:asset.name||"Imagem externa",url:asset.url,type:"image/external",source:asset.source||"",license:asset.license||"",createdAt:new Date().toISOString()}];n.pages||={};n.pages[page]||={elements:{},blocks:[],settings:{}};n.pages[page].blocks=[...(n.pages[page].blocks||[]),block];return n});setSelectedBlockId(id);setTarget(null);setStudioMenuOpen(false);setStatus("Imagem externa adicionada com fonte e licença.")}

  function updatePageSettings(patch){
    remember();
    setDesign(prev=>{const n=clone(prev||{version:2,global:{favicon:"",elements:{},media:[]},pages:{}});n.pages||={};n.pages[page]||={elements:{},blocks:[],settings:{}};n.pages[page].settings={...(n.pages[page].settings||{}),...patch};return n});
    setStatus("Configuração da página alterada. Salve para publicar.");
  }

  function updateBlock(id,updater,message="Bloco atualizado. Salve para publicar."){remember();setDesign(prev=>{const n=clone(prev);n.pages||={};n.pages[page]||={elements:{},blocks:[],settings:{}};n.pages[page].blocks=updateBlockTree(n.pages[page].blocks||[],id,updater);return n});setStatus(message)}
  function setBlockField(key,value){if(selectedBlockId)updateBlock(selectedBlockId,b=>({...b,[key]:value}))}
  function setBlockStyle(key,value){if(!selectedBlockId)return;updateBlock(selectedBlockId,b=>{if(viewport==="desktop"){b.style={...(b.style||{})};if(value==="")delete b.style[key];else b.style[key]=value}else{b.responsive={...(b.responsive||{})};b.responsive[viewport]={...(b.responsive[viewport]||{}),style:{...(b.responsive?.[viewport]?.style||{})}};if(value==="")delete b.responsive[viewport].style[key];else b.responsive[viewport].style[key]=value}return b},"Layout do bloco atualizado.")}
  function applyBlockLayoutPreset(preset){const presets={"stack-v":{display:"flex",flexDirection:"column",gap:"16px",alignItems:"stretch"},"stack-h":{display:"flex",flexDirection:"row",gap:"16px",alignItems:"center"},"grid-2":{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"18px"},"grid-3":{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"18px"},"sidebar":{display:"grid",gridTemplateColumns:"280px minmax(0,1fr)",gap:"24px"},"hero-split":{display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:"34px",alignItems:"center"},"center":{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"16px",textAlign:"center"},"bento":{display:"grid",gridTemplateColumns:"repeat(12,minmax(0,1fr))",gap:"14px"}};const patch=presets[preset];if(!patch||!selectedBlockId)return;updateBlock(selectedBlockId,b=>{if(viewport==="desktop")b.style={...(b.style||{}),...patch};else{b.responsive={...(b.responsive||{})};b.responsive[viewport]={...(b.responsive[viewport]||{}),style:{...(b.responsive?.[viewport]?.style||{}),...patch}}}return b},"Preset de layout aplicado.")}
  function deleteBlock(id=selectedBlockId){if(!id)return;remember();setDesign(prev=>{const n=clone(prev);const r=removeBlockTree(n.pages?.[page]?.blocks||[],id);n.pages[page].blocks=r.blocks;return n});setSelectedBlockId(null);setStatus("Bloco removido. Salve para publicar.")}
  function duplicateBlock(){if(!selectedBlock)return;remember();const copy=clone(selectedBlock);copy.id="blk_"+copy.type+"_"+Math.random().toString(36).slice(2,8);const duplicate=items=>(items||[]).flatMap(b=>b.id===selectedBlockId?[b,copy]:[{...b,children:b.children?.length?duplicate(b.children):b.children}]);setDesign(prev=>{const n=clone(prev);n.pages[page].blocks=duplicate(n.pages[page].blocks||[]);return n});setSelectedBlockId(copy.id);setStatus("Bloco duplicado.")}
  function moveBlock(delta){if(!selectedBlockId)return;remember();const move=items=>{const arr=[...(items||[])];const i=arr.findIndex(x=>x.id===selectedBlockId);if(i>=0){const j=Math.max(0,Math.min(arr.length-1,i+delta));[arr[i],arr[j]]=[arr[j],arr[i]];return arr}return arr.map(b=>({...b,children:b.children?.length?move(b.children):b.children}))};setDesign(prev=>{const n=clone(prev);n.pages[page].blocks=move(n.pages[page].blocks||[]);return n});setStatus("Ordem do bloco alterada.")}
  function wrapBlock(type){if(!selectedBlock)return;remember();const wrapper={id:"blk_"+type+"_"+Math.random().toString(36).slice(2,8),type,title:type==="group"?"Grupo":"Container",style:type==="group"?{}:{display:"flex",flexDirection:"column",gap:"16px"},children:[clone(selectedBlock)]};setDesign(prev=>{const n=clone(prev);const r=removeBlockTree(n.pages[page].blocks||[],selectedBlockId);n.pages[page].blocks=[...r.blocks,wrapper];return n});setSelectedBlockId(wrapper.id);setStatus("Bloco agrupado em nova hierarquia.")}
  function promoteBlock(){if(!selectedBlockId)return;remember();setDesign(prev=>{const n=clone(prev);const r=removeBlockTree(n.pages[page].blocks||[],selectedBlockId);if(r.removed)n.pages[page].blocks=[...(r.blocks||[]),r.removed];return n});setStatus("Bloco movido para a raiz da página.")}
  function reparentBlock(sourceId,targetId){
    if(!sourceId||!targetId||sourceId===targetId)return;
    const source=findBlock(design?.pages?.[page]?.blocks||[],sourceId);
    const target=findBlock(design?.pages?.[page]?.blocks||[],targetId);
    if(!source||!target||findBlock(source.children||[],targetId))return;
    remember();
    setDesign(prev=>{const n=clone(prev);const current=n.pages?.[page]?.blocks||[];const removed=removeBlockTree(current,sourceId);if(!removed.removed)return n;let placed;if(CONTAINER_TYPES.has(target.type))placed=appendBlockChild(removed.blocks,targetId,removed.removed);else placed=insertBlockBefore(removed.blocks,targetId,removed.removed);n.pages[page].blocks=placed.inserted?placed.blocks:[...removed.blocks,removed.removed];return n});
    setSelectedBlockId(sourceId);setStatus(CONTAINER_TYPES.has(target.type)?"Bloco movido para dentro do container.":"Bloco reordenado por Drag & Drop.");
  }
  function createManagedPage({title,slug,template}){const clean=String(slug||title||"pagina").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"");if(!clean){setStatus("Informe um nome ou slug válido.");return}const route="/paginas/"+clean;if(design?.pages?.[route]){setStatus("Já existe uma página com este endereço.");setPage(route);return}remember();setDesign(prev=>{const n=clone(prev);n.pages||={};n.pages[route]={elements:{},blocks:pageTemplate(template,title||clean),settings:{seoTitle:title||clean,layoutPreset:"fluid",managed:true}};return n});setSiteMap(prev=>{const groups=clone(prev);let g=groups.find(x=>x.group==="Páginas criadas no editor");if(!g){g={group:"Páginas criadas no editor",pages:[]};groups.push(g)}g.pages.push([route,title||clean,{managed:true}]);return groups});setPage(route);setTarget(null);setSelectedBlockId(null);setToolboxOpen(false);setStatus("Página criada no editor. Revise o template e publique.")}
  function applyPageTemplate(template){if((design?.pages?.[page]?.blocks||[]).length&&!window.confirm("Substituir os blocos atuais desta página pelo template selecionado?"))return;remember();setDesign(prev=>{const n=clone(prev);n.pages||={};n.pages[page]||={elements:{},settings:{}};n.pages[page].blocks=pageTemplate(template,pageLabel);return n});setSelectedBlockId(null);setStatus("Template completo aplicado à página.")}
  function addBlock(type){
    remember();
    const id="blk_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,6);
    const templates={
      container:{title:"Container",style:{display:"flex",flexDirection:"column",gap:"16px"},children:[]},group:{title:"Grupo",style:{},children:[]},stack:{title:"Stack",style:{display:"flex",flexDirection:"column",gap:"16px"},children:[]},grid:{title:"Grid",style:{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"16px"},children:[]},
      text:{text:"Novo texto",style:{}},button:{text:"Novo botão",href:"#",style:{}},image:{src:"/estibordo/logos/estibordo-logo-header.png",alt:"Imagem",style:{}},section:{title:"Nova seção",text:"Edite este conteúdo no painel.",style:{}},box:{title:"Nova caixa",text:"Conteúdo da caixa",style:{}},decorative:{text:"✦",style:{}},gallery:{images:[],style:{}},menu:{items:[["Início","/"],["Área do Aluno","/area-do-aluno"]],style:{}},form:{title:"Entre em contato",fields:["Nome","E-mail","Mensagem"],style:{}},video:{src:"",title:"Vídeo",style:{}},interactive:{title:"Conteúdo interativo",text:"Configure este bloco.",style:{}},list:{items:["Item 1","Item 2","Item 3"],style:{}},embed:{code:"",style:{}},social:{items:[["Instagram","#"],["YouTube","#"],["LinkedIn","#"]],style:{}},input:{placeholder:"Digite aqui",style:{}},widget:{title:"Widget",text:"Widget do app",style:{}},cms:{title:"CMS",text:"Conecte este bloco a uma fonte de dados.",style:{}},blog:{title:"Blog",text:"Bloco de posts.",style:{}},app:{title:"App",text:"Integração de aplicativo.",style:{}},api:{title:"API",text:"Bloco conectado a API.",style:{}},hero:{title:"Título de destaque",text:"Subtítulo estratégico da seção.",button:"Começar agora",href:"#",style:{}},cta:{title:"Pronto para avançar?",text:"Adicione uma chamada para ação clara.",button:"Começar",href:"#",style:{}},stats:{items:[["75%","Desempenho"],["1.250","Questões"],["18","Simulados"]],style:{}},socialbar:{items:[["Instagram","#"],["YouTube","#"],["LinkedIn","#"]],style:{}},cards:{items:[["Card 1","Descrição"],["Card 2","Descrição"],["Card 3","Descrição"]],style:{}},features:{title:"Recursos",items:[["Velocidade","Experiência rápida e responsiva."],["Clareza","Hierarquia visual objetiva."],["Conversão","CTA orientado à ação."]],style:{}},pricing:{title:"Planos",items:[["Essencial","R$ 49","Para começar"],["Pro","R$ 89","Mais recursos"],["Elite","R$ 149","Experiência completa"]],style:{}},faq:{title:"Perguntas frequentes",items:[["Como funciona?","Edite a resposta aqui."],["Posso personalizar?","Sim, todos os blocos são editáveis."]],style:{}},testimonial:{quote:"Uma experiência de estudo muito mais clara e integrada.",author:"Aluno ESTIBORDO",style:{}},timeline:{title:"Jornada",items:[["01","Descoberta"],["02","Preparação"],["03","Domínio"]],style:{}},divider:{style:{}},spacer:{style:{height:"48px"}}
    };
    const block={id,type,...(templates[type]||{title:type,text:"Novo bloco",style:{}})};
    setDesign(prev=>{const n=clone(prev||{version:4,global:{favicon:"",elements:{},media:[]},pages:{}});n.pages||={};n.pages[page]||={elements:{},blocks:[],settings:{}};if(selectedBlockId&&CONTAINER_TYPES.has(selectedBlock?.type))n.pages[page].blocks=updateBlockTree(n.pages[page].blocks||[],selectedBlockId,b=>({...b,children:[...(b.children||[]),block]}));else n.pages[page].blocks=[...(n.pages[page].blocks||[]),block];return n});setSelectedBlockId(id);setStatus(selectedBlockId&&CONTAINER_TYPES.has(selectedBlock?.type)?"Bloco inserido dentro do container selecionado.":"Bloco adicionado à página.");
    setTimeout(()=>iframeRef.current?.contentWindow?.location.reload(),50);
  }

  async function uploadLibraryMedia(file){
    if(!file)return;setStatus("Enviando mídia...");
    const fd=new FormData();fd.append("file",file);
    const r=await fetch("/api/site-editor/upload",{method:"POST",body:fd});const j=await r.json().catch(()=>({}));
    if(!r.ok){setStatus(j.error||"Falha no upload.");return;}
    setDesign(prev=>{const n=clone(prev||{version:2,global:{favicon:"",elements:{},media:[]},pages:{}});n.global||={favicon:"",elements:{},media:[]};n.global.media=[...(n.global.media||[]),{name:file.name,url:j.url,type:file.type,createdAt:new Date().toISOString()}];return n});
    setStatus("Mídia adicionada à biblioteca. Salve para publicar.");
  }

  function toolboxAction(action){
    if(action==="layers"){setToolboxOpen(false);setStatus("Use CAMADAS no painel esquerdo para selecionar os elementos.");return;}
    if(action==="pages"){setToolboxOpen(false);setStatus("Use MAPA DO SITE no painel esquerdo para gerenciar e selecionar páginas.");return;}
    if(action==="section"){setToolboxOpen(false);setStatus("Selecione uma seção na prévia para acessar ações rápidas e layout.");return;}
  }

  function moveSelected(delta){
    if(!target?.selector)return;remember();
    setDesign(prev=>{const n=clone(prev);const holder=scope==="global"?(n.global.elements[target.selector]||={}):((n.pages[page]||={elements:{}}).elements[target.selector]||={});holder.moveDelta=(Number(holder.moveDelta)||0)+delta;return n});
    setStatus(delta<0?"Seção será movida para cima ao publicar.":"Seção será movida para baixo ao publicar.");
  }

  function reorderLayer(from,to){
    const fromIndex=layers.findIndex(x=>x.selector===from);
    const toIndex=layers.findIndex(x=>x.selector===to);
    if(fromIndex<0||toIndex<0||fromIndex===toIndex)return;
    const delta=toIndex-fromIndex;
    remember();
    setDesign(prev=>{const n=clone(prev);n.pages||={};n.pages[page]||={elements:{}};n.pages[page].elements||={};const cfg=n.pages[page].elements[from]||={};cfg.moveDelta=(Number(cfg.moveDelta)||0)+delta;return n});
    setStatus("Ordem da camada alterada por drag-and-drop. Salve para publicar.");
    setLayerDrag(null);
    setTimeout(()=>iframeRef.current?.contentWindow?.location.reload(),80);
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
    if(!design)return;setSaving(true);setStatus("Criando checkpoint e publicando...");
    const payload=clone(design);payload.version=5;payload.global||={};
    const snapshot=clone(payload);if(snapshot.global)delete snapshot.global.versions;
    payload.global.versions=[...(payload.global.versions||[]),{id:"ver_"+Date.now().toString(36),createdAt:new Date().toISOString(),page,label:pageLabel,snapshot}].slice(-6);
    const r=await fetch("/api/site-editor/design/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:payload,sha})});
    const j=await r.json();setSaving(false);
    if(!r.ok){setStatus(j.error||"Falha ao salvar.");return;}
    setDesign(payload);setSha(j.sha||sha);setOriginal(clone(payload));setStatus("Publicado com checkpoint. A Vercel fará o deploy automaticamente.");
  }

  if(auth==="checking")return <main className="ev-login"><div><b>ESTIBORDO EDITOR</b><p>Carregando editor visual…</p></div></main>;
  if(auth==="login")return <main className="ev-login"><form onSubmit={login}><b>ESTIBORDO EDITOR</b><h1>Editor visual</h1><p>Acesso exclusivo do administrador.</p><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha do editor" required/><button>Entrar no editor</button>{status&&<small>{status}</small>}</form></main>;

  const preview=VIEWPORTS[viewport];
  const effectiveScale=fitScale*(zoom/100);
  const previewSrc=page==="/__404"?"/__estibordo-system/404-preview":page;
  const pageLabel=siteMap.flatMap(x=>x.pages||[]).find(x=>x[0]===page)?.[1]||page;

  return <main className="ev-app">
    <header className="ev-topbar">
      <button className="ev-hamburger" type="button" onClick={()=>setStudioMenuOpen(true)} aria-label="Abrir ferramentas"><span></span><span></span><span></span></button>
      <div className="ev-brand"><b>ESTIBORDO</b><span>EDITOR STUDIO</span></div>
      <div className="ev-device">
        {["desktop","tablet","mobile"].map(v=><button key={v} className={viewport===v?"is-active":""} onClick={()=>{setViewport(v);setZoom(100)}}>{v==="desktop"?"Desktop":v==="tablet"?"Tablet":"Mobile"}</button>)}
        <span className="ev-breakpoint-badge">{viewport==="desktop"?"BASE":viewport.toUpperCase()}</span>
      </div>
      <div className="ev-toolbar">
        <button onClick={undo} disabled={!undoStack.length} title="Desfazer">↶</button>
        <button onClick={redo} disabled={!redoStack.length} title="Refazer">↷</button>
        <button className={moveMode?"is-active":""} onClick={()=>setMoveMode(v=>!v)} title="Drag & Drop universal para qualquer elemento">✥ DnD {moveMode?"ON":"OFF"}</button>
        <button className={showGrid?"is-active":""} onClick={()=>setShowGrid(v=>!v)} title="Mostrar grade"># Grade</button>
        <button className={snap?"is-active":""} onClick={()=>setSnap(v=>!v)} title="Ativar/desativar snapping">⊞ Snap</button>
        <select className="ev-snap-size" value={snapSize} onChange={e=>setSnapSize(Number(e.target.value))} title="Precisão do snap"><option value="1">1 px</option><option value="5">5 px</option><option value="10">10 px</option><option value="20">20 px</option></select>
        <div className="ev-zoom"><button onClick={()=>setZoom(z=>Math.max(40,z-10))}>−</button><span>{zoom}%</span><button onClick={()=>setZoom(z=>Math.min(160,z+10))}>+</button><button onClick={()=>setZoom(100)}>100</button></div>
      </div>
      <div className="ev-actions"><span className={dirty?"ev-dirty":"ev-saved"}>{dirty?"Alterações não publicadas":"Tudo salvo"}</span><a href={page} target="_blank">Abrir página ↗</a><button className="ev-publish" disabled={!dirty||saving} onClick={save}>{saving?"Publicando…":"Salvar e publicar"}</button></div>
    </header>

    <StudioMenu open={studioMenuOpen} onClose={()=>{setStudioMenuOpen(false);setReplacementTargetId(null)}} replacementMode={Boolean(replacementTargetId)} replacementType={replacementTargetId?findBlock(design?.pages?.[page]?.blocks||[],replacementTargetId)?.type:""} selectionMode={selectionPanel} onSelectionMode={setSelectionPanel}  siteMap={siteMap} page={page} onPageChange={url=>{setPage(url);setTarget(null);setSelectedBlockId(null);setStudioMenuOpen(false)}} layers={layers} onSelectLayer={selector=>{selectBySelector(selector);setStudioMenuOpen(false)}} blocks={design?.pages?.[page]?.blocks||[]} selectedBlockId={selectedBlockId} onSelectBlock={id=>{setSelectedBlockId(id);setTarget(null);setStudioMenuOpen(false)}} onOpenBuilder={()=>{setStudioMenuOpen(false);setToolboxOpen(true)}} onOpenFlashcards={()=>{setStudioMenuOpen(false);setFlashcardManagerOpen(true)}} media={design?.global?.media||[]} onUploadMedia={uploadLibraryMedia} onAddIcon={addIconAsset} onAddLogo={addLogoAsset} onAddSignalFlag={addSignalFlag} onImportImage={importExternalImage} customCode={customCode()} onCustomCode={updateCustomCode} breakpoints={breakpoints()} onBreakpoints={updateBreakpoints}/>
    <EditorToolbox open={toolboxOpen} onClose={()=>setToolboxOpen(false)} onAdd={addBlock} onAction={toolboxAction} pageSettings={pageConfig()} onPageSettings={updatePageSettings} media={design?.global?.media||[]} onUploadMedia={uploadLibraryMedia} designSystem={designSystem()} onDesignSystem={updateDesignSystem} components={components()} onApplyComponent={applyComponent} onDeleteComponent={deleteComponent} versions={versions()} onRestoreVersion={restoreVersion} onCreatePage={createManagedPage} pageTemplates={PAGE_TEMPLATE_OPTIONS} onApplyPageTemplate={applyPageTemplate}/>
    <FlashcardManager open={flashcardManagerOpen} onClose={()=>setFlashcardManagerOpen(false)} initialSlug={page.startsWith("/flashcards/")?page.split("/")[2]:"cis"} onChanged={()=>setStatus("Flashcard salvo no banco. Atualize a prévia para conferir.")}/>
    <div className="ev-workspace">
      <aside className="ev-sitemap">
        <div className="ev-side-title"><b>MAPA DO SITE</b><span>Sincronizado automaticamente com a árvore do app</span><button type="button" onClick={()=>void refreshSiteMap()} title="Atualizar mapa do site">↻</button></div>
        <div className="ev-site-scroll">{siteMap.map(group=><section key={group.group}><h4>{group.group}</h4>{group.pages.map(([url,label,meta])=><button className={page===url?"is-active":""} key={url} onClick={()=>{setPage(url);setTarget(null);setSelectedBlockId(null)}}><span>{label}{meta?.hidden?<em>oculta</em>:""}</span><small>{url}</small></button>)}</section>)}</div>
        <div className="ev-layers"><div className="ev-layers-head"><b>CAMADAS DOM</b><button type="button" onClick={()=>refreshLayers()}>↻</button></div><div className="ev-layer-scroll">{layers.map(layer=><button type="button" draggable key={layer.selector+"-"+layer.index} className={`${target?.selector===layer.selector?"is-active":""} ${layerDrag===layer.selector?"is-dragging":""}`} onDragStart={()=>setLayerDrag(layer.selector)} onDragEnd={()=>setLayerDrag(null)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(layerDrag)reorderLayer(layerDrag,layer.selector)}} onClick={()=>selectBySelector(layer.selector)}><i>⋮⋮</i><small>{layer.tag}</small><span>{layer.label||layer.selector}</span></button>)}</div></div><div className="ev-block-tree-panel"><div className="ev-layers-head"><b>BLOCOS & HIERARQUIA</b><small>{(design?.pages?.[page]?.blocks||[]).length} raiz</small></div><BlockTree blocks={design?.pages?.[page]?.blocks||[]} selectedId={selectedBlockId} onSelect={id=>{setSelectedBlockId(id);setTarget(null)}} onReparent={reparentBlock}/></div>
      </aside>

      <section className="ev-canvas">
        <div className="ev-canvas-head"><div><b>{pageLabel}</b><span>{page}</span></div><div className="ev-selectors"><button type="button" onClick={()=>{setSelectionPanel("layers");setStudioMenuOpen(true)}}>Selecionar camada</button><button type="button" onClick={()=>{setSelectionPanel("objects");setStudioMenuOpen(true)}}>Selecionar objeto</button></div><em>{moveMode?"Drag & Drop universal ativo · arraste qualquer elemento":`${preview.label} · zoom ${zoom}%`}</em></div>
        <div className="ev-frame-area" ref={frameAreaRef}>
          <div className={`ev-frame-shell ev-${viewport}`} style={{width:`${preview.width*effectiveScale}px`,height:`${preview.height*effectiveScale}px`}}>
            <iframe ref={iframeRef} key={page} src={previewSrc} onLoad={wireIframe} title="Prévia da página" style={{width:`${preview.width}px`,height:`${preview.height}px`,transform:`scale(${effectiveScale})`,transformOrigin:"top left"}}/>
          </div>
        </div>
      </section>

      <aside className="ev-inspector">
        {selectedBlock ? <BlockInspector block={selectedBlock} viewport={viewport} onField={setBlockField} onStyle={setBlockStyle} onLayoutPreset={applyBlockLayoutPreset} onMove={moveBlock} onDuplicate={duplicateBlock} onWrap={wrapBlock} onPromote={promoteBlock} onDelete={deleteBlock} isContainer={CONTAINER_TYPES.has(selectedBlock.type)} onMotion={setBlockMotion} onReplace={openAssetReplacement}/> : !target ? <div className="ev-empty"><div className="ev-empty-icon">✦</div><h3>Selecione um elemento</h3><p>Clique em um texto, botão, imagem, card, cabeçalho ou menu na prévia. As ferramentas de edição aparecerão aqui.</p><div className="ev-tip"><b>Dica</b><span>Para cabeçalho, menu, logo ou rodapé, use o escopo <strong>Todo o site</strong>.</span></div></div> :
        <>
          <div className="ev-inspector-head"><div><span>{target.tag.toUpperCase()}</span><b>{target.label||"Elemento selecionado"}</b></div><code title={target.selector}>{target.selector}</code></div>
          <div className="ev-responsive-note"><b>{viewport==="desktop"?"BASE / DESKTOP":viewport.toUpperCase()}</b><span>{viewport==="desktop"?"Estilo base herdado pelos outros dispositivos.":"Alterações de estilo ficam exclusivas deste breakpoint."}</span></div>
          <div className="ev-object-tools"><button type="button" onClick={copyStyle}>Copiar estilo</button><button type="button" disabled={!styleClipboard} onClick={pasteStyle}>Colar estilo</button><button type="button" onClick={saveSelectionAsComponent}>＋ Componente</button><button type="button" onClick={()=>bringForward(1)}>Frente +</button><button type="button" onClick={()=>bringForward(-1)}>Trás −</button></div>
          <div className="ev-section-actions"><button onClick={()=>moveSelected(-1)}>↑ Mover seção</button><button onClick={()=>moveSelected(1)}>↓ Mover seção</button><button onClick={()=>changeCloneCount(Math.min(10,cloneCount+1))}>Duplicar · Ctrl+D</button><button onClick={()=>toggleHidden(true)}>Excluir · Del</button></div>
          <div className="ev-scope"><span>Aplicar em</span><button className={scope==="page"?"is-active":""} onClick={()=>setScope("page")}>Só esta página</button><button className={scope==="global"?"is-active":""} onClick={()=>setScope("global")}>Todo o site</button></div>
          <nav className="ev-tabs ev-tabs-5">{[["content","Conteúdo"],["design","Design"],["media","Imagem"],["layout","Layout"],["motion","Interações"]].map(([id,label])=><button key={id} className={tab===id?"is-active":""} onClick={()=>setTab(id)}>{label}</button>)}</nav>
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
              <h4 className="ev-subtitle">LOGO & IMAGE STUDIO</h4><div className="ev-image-presets"><button type="button" onClick={()=>{setStyleValue("objectFit","contain");setStyleValue("filter","none");setStyleValue("transform","none")}}>Logo limpo</button><button type="button" onClick={()=>setStyleValue("filter","grayscale(1)")}>P&B</button><button type="button" onClick={()=>setStyleValue("filter","contrast(1.18) saturate(1.12)")}>Contraste</button><button type="button" onClick={()=>setStyleValue("filter","brightness(1.05) saturate(1.25)")}>Vibrante</button></div>
              <TextField label="Filtro CSS" value={style.filter} onChange={v=>setStyleValue("filter",v)} placeholder="brightness(1) contrast(1) saturate(1)"/>
              <div className="ev-grid2"><TextField label="Transformação" value={style.transform} onChange={v=>setStyleValue("transform",v)} placeholder="rotate(0deg) scale(1)"/><TextField label="Aspect ratio" value={style.aspectRatio} onChange={v=>setStyleValue("aspectRatio",v)} placeholder="16 / 9"/></div>
              <div className="ev-grid2"><TextField label="Clip-path" value={style.clipPath} onChange={v=>setStyleValue("clipPath",v)} placeholder="inset(0 round 12px)"/><SelectField label="Blend" value={style.mixBlendMode} onChange={v=>setStyleValue("mixBlendMode",v)} options={["normal","multiply","screen","overlay","darken","lighten"]}/></div>
            </>}

            {tab==="layout"&&<>
              <h4 className="ev-subtitle">LAYOUTS PRÉ-DEFINIDOS</h4><div className="ev-layout-preset-grid">{[["stack-v","Stack vertical"],["stack-h","Stack horizontal"],["grid-2","Grid 2"],["grid-3","Grid 3"],["sidebar","Sidebar"],["hero-split","Hero split"],["center","Centralizado"]].map(([id,label])=><button type="button" key={id} onClick={()=>{const presets={"stack-v":{display:"flex",flexDirection:"column",gap:"16px"},"stack-h":{display:"flex",flexDirection:"row",gap:"16px",alignItems:"center"},"grid-2":{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"18px"},"grid-3":{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"18px"},"sidebar":{display:"grid",gridTemplateColumns:"280px minmax(0,1fr)",gap:"24px"},"hero-split":{display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:"34px",alignItems:"center"},"center":{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"16px"}};const p=presets[id];remember();const so={...styleOverrides,...p};setStyle(s=>({...s,...p}));setStyleOverrides(so);try{const el=iframeRef.current?.contentDocument?.querySelector(target.selector);if(el)Object.entries(p).forEach(([k,v])=>el.style[k]=v)}catch{}write(so,attrsOverrides,hidden)}}>{label}</button>)}</div>
              <h4 className="ev-subtitle">DIMENSÕES</h4><div className="ev-grid2"><TextField label="Largura" value={style.width} onChange={v=>setStyleValue("width",v)} placeholder="auto"/><TextField label="Altura" value={style.height} onChange={v=>setStyleValue("height",v)} placeholder="auto"/></div>
              <h4 className="ev-subtitle">ESPAÇAMENTO INTERNO</h4><div className="ev-grid4">{["Top","Right","Bottom","Left"].map(side=><TextField key={side} label={side} value={style["padding"+side]} onChange={v=>setStyleValue("padding"+side,v)} placeholder="0px"/>)}</div>
              <h4 className="ev-subtitle">MARGENS</h4><div className="ev-grid4">{["Top","Right","Bottom","Left"].map(side=><TextField key={side} label={side} value={style["margin"+side]} onChange={v=>setStyleValue("margin"+side,v)} placeholder="0px"/>)}</div>
              <div className="ev-grid2"><SelectField label="Display" value={style.display} onChange={v=>setStyleValue("display",v)} options={["block","inline-block","flex","grid","none"]}/><TextField label="Gap" value={style.gap} onChange={v=>setStyleValue("gap",v)} placeholder="12px"/></div><TextField label="Colunas do Grid" value={style.gridTemplateColumns} onChange={v=>setStyleValue("gridTemplateColumns",v)} placeholder="repeat(3,minmax(0,1fr))"/>
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
            {tab==="motion"&&<div className="ev-motion-panel"><SelectField label="Entrada" value={motion.entrance} onChange={v=>setMotionValue("entrance",v)} options={["none","fade","slide-up","slide-left","slide-right","zoom","rotate"]}/><div className="ev-grid2"><TextField label="Duração (ms)" value={motion.duration} onChange={v=>setMotionValue("duration",v)} placeholder="500"/><TextField label="Atraso (ms)" value={motion.delay} onChange={v=>setMotionValue("delay",v)} placeholder="0"/></div><SelectField label="Hover" value={motion.hover} onChange={v=>setMotionValue("hover",v)} options={["none","lift","zoom","glow","tilt","fade"]}/><SelectField label="Clique" value={motion.click} onChange={v=>setMotionValue("click",v)} options={["none","pulse","shake","pop"]}/><p className="ev-help">Interações declarativas compatíveis com CSP, sem JavaScript arbitrário.</p></div>}
            <div className="ev-pro-tools"><label><input type="checkbox" checked={locked} onChange={e=>toggleLocked(e.target.checked)}/> Bloquear no editor</label><label>Duplicatas <input type="number" min="0" max="10" value={cloneCount} onChange={e=>changeCloneCount(e.target.value)}/></label></div>
            <div className="ev-danger-zone"><label><input type="checkbox" checked={hidden} onChange={e=>toggleHidden(e.target.checked)}/> Ocultar elemento</label><button type="button" onClick={resetTarget}>Restaurar este elemento</button></div>
            {status&&<div className="ev-status">{status}</div>}
          </div>
        </>}
      </aside>
    </div>
  </main>;
}
