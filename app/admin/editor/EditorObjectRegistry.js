"use client";

const INTERACTIVE = new Set(["A","BUTTON","INPUT","SELECT","TEXTAREA","IMG","VIDEO","AUDIO","CANVAS","SVG"]);
const STRUCTURAL = new Set(["HEADER","NAV","MAIN","SECTION","ARTICLE","ASIDE","FOOTER","FORM","UL","OL","LI"]);
const TEXTUAL = new Set(["H1","H2","H3","H4","H5","H6","P","SPAN","LABEL","SMALL","STRONG","EM","BLOCKQUOTE","TD","TH"]);

function hash(value){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
function clean(value){return String(value||"").trim().replace(/\s+/g," ")}
function cssEscape(value){if(typeof CSS!=="undefined"&&CSS.escape)return CSS.escape(value);return String(value).replace(/([^a-zA-Z0-9_-])/g,"\\$1")}

export function selectorForNode(el){
  if(!el||el.nodeType!==1)return "";
  const editorId=el.getAttribute("data-editor-id");if(editorId)return `[data-editor-id="${cssEscape(editorId)}"]`;
  if(el.id)return `#${cssEscape(el.id)}`;
  const parts=[];let node=el;
  while(node&&node.nodeType===1&&node.tagName!=="HTML"){
    if(node.tagName==="BODY"){parts.unshift("body");break}
    const tag=node.tagName.toLowerCase();const cls=[...node.classList].filter(x=>!x.startsWith("ev-")&&!x.startsWith("is-")).slice(0,2);
    let part=tag+cls.map(x=>`.${cssEscape(x)}`).join("");const parent=node.parentElement;
    if(parent){const same=[...parent.children].filter(x=>x.tagName===node.tagName);if(same.length>1)part+=`:nth-of-type(${same.indexOf(node)+1})`}
    parts.unshift(part);node=parent;if(parts.length>=8)break;
  }
  return parts.join(" > ");
}

function adapterFor(el){
  if(!el)return "dom";
  if(el.closest?.("[data-estibordo-editor-block]"))return "page-builder";
  if(el.matches?.("canvas")||el.closest?.("canvas"))return "canvas";
  if(el.closest?.('[class*="three" i],[class*="viewer" i],[class*="ripeam" i],[data-three],[data-webgl]'))return "3d-viewer";
  if(el.closest?.('[class*="flashcard" i],[data-flashcard]'))return "flashcard";
  if(el.matches?.("svg,svg *"))return "svg";
  if(el.matches?.("img,picture,video,audio"))return "media";
  if(INTERACTIVE.has(el.tagName))return "control";
  if(STRUCTURAL.has(el.tagName))return "container";
  if(TEXTUAL.has(el.tagName))return "text";
  return "dom";
}

export function editableTarget(raw){
  if(!raw||raw.nodeType!==1)return null;
  if(raw.closest?.("[data-ev-resize-overlay],[data-ev-guide],[data-ev-marquee]"))return null;
  const block=raw.closest?.("[data-estibordo-editor-block]");if(block)return block;
  const adapter=adapterFor(raw);
  if(adapter==="canvas"||adapter==="3d-viewer"){
    return raw.closest?.('[data-editor-component],[class*="viewer" i],[class*="ripeam" i],[class*="laboratorio" i],section,article,div')||raw;
  }
  if(raw.tagName==="PATH"||raw.tagName==="G")return raw.closest("svg")||raw;
  return raw;
}

export function breadcrumbFor(el){
  const out=[];let node=el;while(node&&node.nodeType===1&&node.tagName!=="HTML"){
    const label=clean(node.getAttribute("data-editor-name")||node.getAttribute("aria-label")||node.id||[...node.classList].find(Boolean)||node.tagName.toLowerCase());out.unshift(label.slice(0,40));node=node.parentElement;if(out.length>=7)break;
  }return out.join(" › ");
}

function isUseful(el){
  if(!el||el.nodeType!==1)return false;
  if(el.closest?.("[data-ev-resize-overlay],[data-ev-guide],[data-ev-marquee]"))return false;
  const r=el.getBoundingClientRect?.();if(!r||r.width<2||r.height<2)return false;
  const cs=el.ownerDocument.defaultView.getComputedStyle(el);if(cs.display==="none"||cs.visibility==="hidden")return false;
  if(INTERACTIVE.has(el.tagName)||STRUCTURAL.has(el.tagName)||TEXTUAL.has(el.tagName))return true;
  if(el.hasAttribute("data-estibordo-editor-block")||el.hasAttribute("data-editor-component"))return true;
  return Boolean(el.id||el.className||el.getAttribute("role"));
}

export function buildObjectRegistry(doc,route="/"){
  if(!doc)return {route,layers:[],objects:[],byId:{},stats:{total:0}};
  const candidates=[...doc.querySelectorAll("body *")].filter(isUseful).slice(0,1800);
  const seen=new Set(),rows=[];
  for(const original of candidates){
    const el=editableTarget(original);if(!el||seen.has(el))continue;seen.add(el);
    const rawSelector=selectorForNode(el);const adapter=adapterFor(el);const stable=`obj_${hash(route+"|"+rawSelector+"|"+adapter)}`;
    if(!el.hasAttribute("data-editor-id"))el.setAttribute("data-editor-id",stable);
    const selector=`[data-editor-id="${stable}"]`;const rect=el.getBoundingClientRect();
    const label=clean(el.getAttribute("data-editor-name")||el.getAttribute("aria-label")||el.getAttribute("alt")||el.innerText||el.textContent||el.id||el.tagName).slice(0,96);
    const parent=el.parentElement?.closest?.("[data-editor-id]")?.getAttribute("data-editor-id")||null;
    rows.push({id:stable,selector,sourceSelector:rawSelector,tag:el.tagName.toLowerCase(),adapter,label:label||el.tagName.toLowerCase(),breadcrumb:breadcrumbFor(el),parent,width:Math.round(rect.width),height:Math.round(rect.height),locked:Boolean(el.closest?.("[data-editor-lock]")),hidden:false});
  }
  const byId=Object.fromEntries(rows.map(x=>[x.id,x]));
  const objects=rows.filter(x=>!["container"].includes(x.adapter)||x.tag==="section"||x.tag==="article");
  const layers=rows;
  return {route,layers,objects,byId,stats:{total:rows.length,objects:objects.length,containers:rows.filter(x=>x.adapter==="container").length,controls:rows.filter(x=>x.adapter==="control").length,media:rows.filter(x=>x.adapter==="media").length,viewers:rows.filter(x=>x.adapter==="3d-viewer").length}};
}

export function registrySearch(items,query){const q=clean(query).toLowerCase();if(!q)return items;return items.filter(x=>[x.label,x.tag,x.adapter,x.breadcrumb,x.selector].some(v=>String(v||"").toLowerCase().includes(q)))}
