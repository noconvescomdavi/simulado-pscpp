'use client';

import { useEffect } from 'react';
import design from '../../data/site/editor-design.json';

const SAFE_STYLE_KEYS = new Set([
  'fontSize','fontWeight','fontFamily','textAlign','letterSpacing','lineHeight',
  'color','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat',
  'width','height','minWidth','maxWidth','minHeight','maxHeight',
  'paddingTop','paddingRight','paddingBottom','paddingLeft',
  'marginTop','marginRight','marginBottom','marginLeft',
  'borderRadius','borderWidth','borderStyle','borderColor',
  'display','flexDirection','justifyContent','alignItems','alignContent','flexWrap','gap','rowGap','columnGap',
  'gridTemplateColumns','gridTemplateRows','gridAutoFlow','order',
  'position','top','right','bottom','left','zIndex','opacity','overflow','objectFit','objectPosition',
  'backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat','boxShadow','filter',
  'textTransform','textDecoration','whiteSpace','cursor','translate','transform','transition','aspectRatio','mixBlendMode','clipPath'
]);

let ACTIVE_BREAKPOINTS={tablet:1024,mobile:620,custom:[]};let ACTIVE_COMPONENTS={};let ACTIVE_SYMBOLS={};let ACTIVE_COLLECTIONS={};let ACTIVE_VECTORS={};
function setBreakpoints(value){ACTIVE_BREAKPOINTS={tablet:Math.max(621,Number(value?.tablet)||1024),mobile:Math.max(320,Number(value?.mobile)||620),custom:Array.isArray(value?.custom)?value.custom:[]}}
function responsiveMerge(base,responsive){const width=window.innerWidth;let out={...(base||{})};for(const bp of [...(ACTIVE_BREAKPOINTS.custom||[])].sort((a,b)=>Number(b.maxWidth)-Number(a.maxWidth))){if(width<=Number(bp.maxWidth||0))out={...out,...(responsive?.[bp.id]?.style||{})}}if(width<=ACTIVE_BREAKPOINTS.tablet)out={...out,...(responsive?.tablet?.style||{})};if(width<=ACTIVE_BREAKPOINTS.mobile)out={...out,...(responsive?.mobile?.style||{})};return out}

function safeUrl(value) {
  const v = String(value || '').trim();
  if (!v) return '';
  if (/^(javascript|data|vbscript):/i.test(v)) return '';
  return v;
}

function resolveConfig(config){const symbol=config?.symbolRef&&ACTIVE_SYMBOLS[config.symbolRef]?.config;return symbol?{...symbol,...config,style:{...(symbol.style||{}),...(config.style||{})},attrs:{...(symbol.attrs||{}),...(config.attrs||{})},responsive:{...(symbol.responsive||{}),...(config.responsive||{})},motion:{...(symbol.motion||{}),...(config.motion||{})},states:{...(symbol.states||{}),...(config.states||{})},interactions:[...(symbol.interactions||[]),...(config.interactions||[])]}:config}
function valueAt(obj,key){if(!obj||!key)return "";return String(key).split(".").reduce((v,k)=>v&&typeof v==="object"?v[k]:undefined,obj)}
function bindNode(node,binding){if(!binding?.collection)return;const collection=ACTIVE_COLLECTIONS[binding.collection];if(!collection)return;let item;if(Array.isArray(collection)){const idx=Math.max(0,Number(binding.item)||0);item=collection[idx]}else item=binding.item?collection[binding.item]:collection;if(!item)return;const pairs=[["textKey","text"],["srcKey","src"],["hrefKey","href"],["altKey","alt"]];for(const [bk,attr] of pairs){const v=valueAt(item,binding[bk]);if(v===undefined||v===null||v==="")continue;if(attr==="text"&&node.children.length===0)node.textContent=String(v);else if(attr==="src"||attr==="href"){const u=safeUrl(v);if(u)node.setAttribute(attr,u)}else node.setAttribute(attr,String(v))}}
function applyStates(node,states){if(!states||typeof states!=="object"||node.dataset.estStatesBound)return;node.dataset.estStatesBound="1";let prev={};node.addEventListener("mouseenter",()=>{prev.bg=node.style.backgroundColor;prev.color=node.style.color;prev.transform=node.style.transform;prev.opacity=node.style.opacity;if(states.hoverBackground)node.style.backgroundColor=states.hoverBackground;if(states.hoverColor)node.style.color=states.hoverColor;if(states.hoverTransform)node.style.transform=states.hoverTransform;if(states.hoverOpacity)node.style.opacity=states.hoverOpacity});node.addEventListener("mouseleave",()=>{node.style.backgroundColor=prev.bg||"";node.style.color=prev.color||"";node.style.transform=prev.transform||"";node.style.opacity=prev.opacity||""});if(states.focusOutline){node.tabIndex=node.tabIndex>=0?node.tabIndex:0;node.addEventListener("focus",()=>node.style.outline=states.focusOutline);node.addEventListener("blur",()=>node.style.outline="")}if(states.pressedTransform||states.pressedOpacity){node.addEventListener("pointerdown",()=>{if(states.pressedTransform)node.style.transform=states.pressedTransform;if(states.pressedOpacity)node.style.opacity=states.pressedOpacity});node.addEventListener("pointerup",()=>{node.style.transform=prev.transform||"";node.style.opacity=prev.opacity||""})}}
function applyInteractions(node,items){if(!Array.isArray(items)||node.dataset.estInteractionsBound)return;node.dataset.estInteractionsBound="1";for(const item of items){const event={click:"click",hover:"mouseenter",dblclick:"dblclick",focus:"focus"}[item.event];if(!event)continue;node.addEventListener(event,()=>{const action=item.action,target=String(item.target||""),value=String(item.value||"");if(action==="navigate"&&target){const u=safeUrl(target);if(u)location.href=u}else if(action==="scroll"&&target){try{document.querySelector(target)?.scrollIntoView({behavior:"smooth"})}catch{}}else if(action==="show"&&target){try{document.querySelectorAll(target).forEach(n=>n.hidden=false)}catch{}}else if(action==="hide"&&target){try{document.querySelectorAll(target).forEach(n=>n.hidden=true)}catch{}}else if(action==="toggle"&&target){try{document.querySelectorAll(target).forEach(n=>n.hidden=!n.hidden)}catch{}}else if(action==="class"&&target&&value){try{document.querySelectorAll(target).forEach(n=>n.classList.toggle(value))}catch{}}})}}
function solveConstraintModel(m,pw,ph){if(!m?.enabled)return null;let width=Number(m.width)||0,height=Number(m.height)||0,left=Number(m.left)||0,top=Number(m.top)||0;const x=m.xMode||"left",y=m.yMode||"top";if(x==="right")left=pw-Number(m.right||0)-width;else if(x==="center")left=pw/2+Number(m.centerX||0)-width/2;else if(x==="stretch")width=Math.max(0,pw-Number(m.left||0)-Number(m.right||0));else if(x==="scale"){left=pw*Number(m.leftRatio||0);width=pw*Number(m.widthRatio||0)}if(y==="bottom")top=ph-Number(m.bottom||0)-height;else if(y==="center")top=ph/2+Number(m.centerY||0)-height/2;else if(y==="stretch")height=Math.max(0,ph-Number(m.top||0)-Number(m.bottom||0));else if(y==="scale"){top=ph*Number(m.topRatio||0);height=ph*Number(m.heightRatio||0)}if(m.preserveAspect&&Number(m.aspect)>0){const a=Number(m.aspect);if(x==="stretch"||x==="scale")height=width/a;else if(y==="stretch"||y==="scale")width=height*a}if(Number.isFinite(m.minWidth))width=Math.max(width,m.minWidth);if(Number.isFinite(m.maxWidth)&&m.maxWidth>0)width=Math.min(width,m.maxWidth);if(Number.isFinite(m.minHeight))height=Math.max(height,m.minHeight);if(Number.isFinite(m.maxHeight)&&m.maxHeight>0)height=Math.min(height,m.maxHeight);return {left,top,width,height}}
function applyConstraints(node,m){if(!m?.enabled||!node?.parentElement)return;const p=node.parentElement,pw=p.clientWidth,ph=p.clientHeight;if(!pw||!ph)return;const r=solveConstraintModel(m,pw,ph);if(!r)return;const pcs=node.ownerDocument.defaultView.getComputedStyle(p);if(pcs.position==="static")p.style.position="relative";Object.assign(node.style,{position:"absolute",left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px",right:"auto",bottom:"auto"})}
function vectorAssetSvg(asset){if(!asset)return null;const ns="http://www.w3.org/2000/svg",svg=document.createElementNS(ns,"svg");svg.setAttribute("viewBox",asset.viewBox||`0 0 ${asset.width||800} ${asset.height||600}`);svg.setAttribute("preserveAspectRatio","xMidYMid meet");svg.setAttribute("aria-hidden","true");svg.style.cssText="display:block;width:100%;height:100%;overflow:visible";const defs=document.createElementNS(ns,"defs");svg.appendChild(defs);const byId=Object.fromEntries((asset.paths||[]).map(p=>[p.id,p]));const grad=(g,id)=>{if(!g?.stops?.length)return null;const el=document.createElementNS(ns,g.type==="radial"?"radialGradient":"linearGradient");el.id=id;if(g.type==="linear"){const a=(Number(g.angle)||0)*Math.PI/180,c=Math.cos(a),s=Math.sin(a);el.setAttribute("x1",String(.5-c/2));el.setAttribute("y1",String(.5-s/2));el.setAttribute("x2",String(.5+c/2));el.setAttribute("y2",String(.5+s/2))}else{el.setAttribute("cx",String(g.cx??.5));el.setAttribute("cy",String(g.cy??.5));el.setAttribute("r",String(g.r??.5))}for(const st of g.stops){const q=document.createElementNS(ns,"stop");q.setAttribute("offset",String(st.offset));q.setAttribute("stop-color",st.color||"#000");q.setAttribute("stop-opacity",String(st.opacity??1));el.appendChild(q)}defs.appendChild(el);return `url(#${id})`};const make=p=>{const path=document.createElementNS(ns,"path");path.setAttribute("d",p.d||"");const gid="g_"+String(p.id||"x").replace(/[^a-z0-9_-]/gi,"");path.setAttribute("fill",grad(p.fillGradient,gid+"_f")||p.fill||"none");path.setAttribute("stroke",grad(p.strokeGradient,gid+"_s")||p.stroke||"none");path.setAttribute("stroke-width",String(p.strokeWidth??0));path.setAttribute("stroke-linecap",p.strokeCap||"butt");path.setAttribute("stroke-linejoin",p.strokeJoin||"miter");if(Array.isArray(p.strokeDash)&&p.strokeDash.length)path.setAttribute("stroke-dasharray",p.strokeDash.join(" "));if(p.strokeDashOffset)path.setAttribute("stroke-dashoffset",String(p.strokeDashOffset));path.setAttribute("opacity",String(p.opacity??1));path.setAttribute("fill-rule",p.fillRule||"nonzero");path.setAttribute("vector-effect","non-scaling-stroke");if(Array.isArray(p.matrix)&&p.matrix.length===6)path.setAttribute("transform",`matrix(${p.matrix.join(" ")})`);if(p.blendMode&&p.blendMode!=="source-over")path.style.mixBlendMode=p.blendMode;return path};const renderPath=p=>{if(!p||p.visible===false||p.kind==="group"||p.kind==="frame")return null;if(p.boolean?.op&&Array.isArray(p.boolean.sources)){const src=p.boolean.sources.map(id=>byId[id]).filter(Boolean);if(src.length){if(p.boolean.op==="union"||p.boolean.op==="exclude")return make({...p,d:src.map(x=>x.d||"").join(" "),fillRule:p.boolean.op==="exclude"?"evenodd":p.fillRule});if(p.boolean.op==="intersect"&&src.length>=2){const clip=document.createElementNS(ns,"clipPath"),cid="clip_"+String(p.id).replace(/[^a-z0-9_-]/gi,"");clip.id=cid;clip.appendChild(make({...src[1],fill:"#fff",stroke:"none"}));defs.appendChild(clip);const q=make({...src[0],fill:p.fill||src[0].fill,stroke:p.stroke||src[0].stroke});q.setAttribute("clip-path",`url(#${cid})`);return q}}}return make(p)};const roots=(asset.paths||[]).filter(p=>!p.parentId);const renderNode=(p,parent)=>{if(!p||p.visible===false)return;const children=(asset.paths||[]).filter(x=>x.parentId===p.id);if(p.kind==="group"||p.kind==="frame"){const g=document.createElementNS(ns,"g");if(Array.isArray(p.matrix)&&p.matrix.length===6)g.setAttribute("transform",`matrix(${p.matrix.join(" ")})`);if(p.opacity!=null)g.setAttribute("opacity",String(p.opacity));if(p.kind==="frame"&&p.d){const clip=document.createElementNS(ns,"clipPath"),cid="frame_"+p.id.replace(/[^a-z0-9_-]/gi,"");clip.id=cid;clip.appendChild(make({...p,fill:"#fff",stroke:"none"}));defs.appendChild(clip);g.setAttribute("clip-path",`url(#${cid})`)}if(p.maskId&&byId[p.maskId]){const clip=document.createElementNS(ns,"clipPath"),cid="mask_"+p.id.replace(/[^a-z0-9_-]/gi,"");clip.id=cid;clip.appendChild(make({...byId[p.maskId],fill:"#fff",stroke:"none"}));defs.appendChild(clip);g.setAttribute("clip-path",`url(#${cid})`)}parent.appendChild(g);for(const c of children)renderNode(c,g);return}const q=renderPath(p);if(q){if(p.maskId&&byId[p.maskId]){const clip=document.createElementNS(ns,"clipPath"),cid="mask_"+p.id.replace(/[^a-z0-9_-]/gi,"");clip.id=cid;clip.appendChild(make({...byId[p.maskId],fill:"#fff",stroke:"none"}));defs.appendChild(clip);q.setAttribute("clip-path",`url(#${cid})`)}parent.appendChild(q)}};for(const p of roots)renderNode(p,svg);return svg}
function applyRecord(record) {
  if (!record || typeof record !== 'object') return;

  for (const [selector, rawConfig] of Object.entries(record)) {
    const config=resolveConfig(rawConfig)||{};
    if (!selector || !config || typeof config !== 'object') continue;
    let nodes = [];
    try { nodes = Array.from(document.querySelectorAll(selector)).filter((node) => !node.hasAttribute('data-estibordo-runtime-clone')); } catch { continue; }

    const cloneCount = Math.max(0, Math.min(10, Number(config.cloneCount || 0)));
    const currentClones = Array.from(document.querySelectorAll('[data-estibordo-runtime-clone-for]'))
      .filter((node) => node.getAttribute('data-estibordo-runtime-clone-for') === selector);
    const expectedCloneCount = nodes.length * cloneCount;
    const rebuildClones = currentClones.length !== expectedCloneCount;
    if (rebuildClones) currentClones.forEach((node) => node.remove());

    for (const node of nodes) {
      if (config.hidden === true) {
        node.style.setProperty('display', 'none', 'important');
      } else if (config.hidden === false && config.style?.display) {
        node.style.display = String(config.style.display);
      }

      const responsiveStyle=responsiveMerge(config.style||{},config.responsive||{});
      for (const [key, value] of Object.entries(responsiveStyle)) {
        if (!SAFE_STYLE_KEYS.has(key)) continue;
        if (value === null || value === undefined || value === '') {
          node.style[key] = '';
          continue;
        }
        node.style[key] = String(value);
      }

      const attrs = config.attrs || {};
      for (const name of ['src','href','alt','title']) {
        if (!(name in attrs)) continue;
        const next = name === 'src' || name === 'href' ? safeUrl(attrs[name]) : String(attrs[name] ?? '');
        if (next) node.setAttribute(name, next);
        else node.removeAttribute(name);
      }

      if ('text' in attrs && node.children.length === 0) {
        const nextText = String(attrs.text ?? '');
        if (node.textContent !== nextText) node.textContent = nextText;
      }

      bindNode(node,config.dataBinding||{});
      applyConstraints(node,config.constraints||{});
      applyStates(node,config.states||{});
      applyInteractions(node,config.interactions||[]);
      applyMotion(node,config.motion||{});
      const moveDelta=Number(config.moveDelta||0);
      if(moveDelta && !node.dataset.estibordoMoveApplied){let steps=Math.abs(moveDelta);while(steps--){if(moveDelta<0&&node.previousElementSibling)node.parentElement.insertBefore(node,node.previousElementSibling);else if(moveDelta>0&&node.nextElementSibling)node.parentElement.insertBefore(node.nextElementSibling,node)}node.dataset.estibordoMoveApplied="true";}

      if (rebuildClones) {
        let anchor = node;
        for (let i = 0; i < cloneCount; i++) {
          const copy = node.cloneNode(true);
          copy.setAttribute('data-estibordo-runtime-clone', 'true');
          copy.setAttribute('data-estibordo-runtime-clone-for', selector);
          anchor.insertAdjacentElement('afterend', copy);
          anchor = copy;
        }
      }
    }
  }
}

function el(tag, cls, text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n;}
function blockStyle(block){return responsiveMerge(block.style||{},block.responsive||{})}
function renderBlock(block){
  if(block?.type==="componentInstance"&&block.componentRef&&ACTIVE_COMPONENTS[block.componentRef]){const master=ACTIVE_COMPONENTS[block.componentRef];block={...master.snapshot,...block,id:block.id,type:master.snapshot?.type||block.type,style:{...(master.snapshot?.style||{}),...(block.style||{})},responsive:{...(master.snapshot?.responsive||{}),...(block.responsive||{})}}}
  const wrap=el("section","estibordo-editor-block estibordo-block-"+block.type);wrap.dataset.estibordoEditorBlock=block.id||"";
  const addText=(tag,value,cls)=>{if(value){const n=el(tag,cls,value);wrap.appendChild(n);return n}};
  switch(block.type){
    case "container": case "group": case "stack": case "grid": {addText("h3",block.title&&block.type!=="group"?block.title:"","evb-container-title");const children=el("div","evb-children");(block.children||[]).forEach(child=>children.appendChild(renderBlock(child)));wrap.appendChild(children);break;}
    case "text": addText("p",block.text||"Novo texto","evb-text"); break;
    case "button": {const a=addText("a",block.text||"Botão","evb-button");a.href=safeUrl(block.href)||"#";break;}
    case "image": {const i=el("img","evb-image");i.src=safeUrl(block.src);i.alt=block.alt||"";wrap.appendChild(i);break;}
    case "icon": {const shell=el("div","evb-icon-shell");const halo=el("span","evb-icon-halo");const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("fill","none");svg.setAttribute("stroke","currentColor");svg.setAttribute("stroke-width","1.65");svg.setAttribute("stroke-linecap","round");svg.setAttribute("stroke-linejoin","round");svg.setAttribute("vector-effect","non-scaling-stroke");svg.classList.add("evb-icon");const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("d",String(block.svgPath||""));p.setAttribute("vector-effect","non-scaling-stroke");svg.appendChild(p);shell.append(halo,svg);wrap.appendChild(shell);break;}
    case "signalFlag": {const card=el("div","evb-signal-card");const flag=el("div","evb-signal-flag");flag.dataset.pattern=block.flagPattern||"solid";flag.style.setProperty("--a",block.flagA||"#fff");flag.style.setProperty("--b",block.flagB||"#0057a6");flag.appendChild(el("i",""));const meta=el("div","evb-signal-meta");meta.append(el("strong","",block.signalCode||""),el("span","",block.text||""));card.append(flag,meta);wrap.appendChild(card);break;}
    case "logo": {const box=el("div","evb-logo evb-logo-"+(block.logoShape||"none"));const mark=document.createElementNS("http://www.w3.org/2000/svg","svg");mark.setAttribute("viewBox","0 0 24 24");mark.setAttribute("fill","none");mark.setAttribute("stroke","currentColor");mark.setAttribute("stroke-width","1.8");mark.setAttribute("stroke-linecap","round");mark.setAttribute("stroke-linejoin","round");mark.classList.add("evb-logo-mark");const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("d",String(block.svgPath||""));mark.appendChild(p);const words=el("span","evb-logo-words");words.append(el("strong","",block.title||"ESTIBORDO"),el("small","",block.tagline||""));box.append(mark,words);wrap.appendChild(box);break;}
    case "hero": case "cta": addText("h2",block.title,"evb-title");addText("p",block.text,"evb-copy");{const a=addText("a",block.button||"Começar","evb-button");a.href=safeUrl(block.href)||"#";}break;
    case "stats": {const g=el("div","evb-stats");(block.items||[]).forEach(([v,l])=>{const c=el("div","evb-stat");c.append(el("strong","",v),el("span","",l));g.appendChild(c)});wrap.appendChild(g);break;}
    case "gallery": {const g=el("div","evb-gallery");(block.images||[]).forEach(src=>{const i=el("img","");i.src=safeUrl(src);g.appendChild(i)});if(!(block.images||[]).length)g.appendChild(el("div","evb-placeholder","Galeria — adicione imagens"));wrap.appendChild(g);break;}
    case "menu": {const nav=el("nav","evb-menu");(block.items||[]).forEach(([label,href])=>{const a=el("a","",label);a.href=safeUrl(href)||"#";nav.appendChild(a)});wrap.appendChild(nav);break;}
    case "form": addText("h3",block.title,"evb-title");{const f=el("form","evb-form");(block.fields||[]).forEach(x=>{const input=x==="Mensagem"?el("textarea",""):el("input","");input.placeholder=x;f.appendChild(input)});f.appendChild(el("button","","Enviar"));wrap.appendChild(f);break;}
    case "video": {if(block.src){const v=el("video","evb-video");v.controls=true;v.src=safeUrl(block.src);wrap.appendChild(v)}else wrap.appendChild(el("div","evb-placeholder","Vídeo / música — configure a mídia"));break;}
    case "list": {const ul=el("ul","evb-list");(block.items||[]).forEach(x=>ul.appendChild(el("li","",x)));wrap.appendChild(ul);break;}
    case "social": case "socialbar": {const n=el("nav","evb-social");(block.items||[]).forEach(([label,href])=>{const a=el("a","",label);a.href=safeUrl(href)||"#";n.appendChild(a)});wrap.appendChild(n);break;}
    case "input": {const input=el("input","evb-input");input.placeholder=block.placeholder||"Digite aqui";wrap.appendChild(input);break;}
    case "cards": case "features": {addText("h2",block.title,"evb-title");const g=el("div","evb-cards");(block.items||[]).forEach(([t,d])=>{const c=el("article","evb-card");c.append(el("h3","",t),el("p","",d));g.appendChild(c)});wrap.appendChild(g);break;}
    case "pricing": {addText("h2",block.title,"evb-title");const g=el("div","evb-cards evb-pricing");(block.items||[]).forEach(([t,p,d])=>{const c=el("article","evb-card");c.append(el("h3","",t),el("strong","evb-price",p),el("p","",d));g.appendChild(c)});wrap.appendChild(g);break;}
    case "faq": {addText("h2",block.title,"evb-title");const g=el("div","evb-faq");(block.items||[]).forEach(([q,a])=>{const d=el("details","evb-faq-item");d.append(el("summary","",q),el("p","",a));g.appendChild(d)});wrap.appendChild(g);break;}
    case "vector": {const asset=ACTIVE_VECTORS[block.vectorAssetId];const box=el("div","evb-vector");const svg=vectorAssetSvg(asset);if(svg)box.appendChild(svg);else box.appendChild(el("div","evb-placeholder","Vector asset não encontrado"));wrap.appendChild(box);break;}
    case "testimonial": {const q=el("blockquote","evb-testimonial");q.append(el("p","",block.quote||""),el("cite","",block.author||""));wrap.appendChild(q);break;}
    case "modal": {const d=el("div","evb-modal");d.dataset.estibordoModal=block.id||"";d.hidden=true;d.append(el("h3","evb-title",block.title||"Modal"),el("p","evb-copy",block.text||"Conteúdo do modal"));wrap.appendChild(d);break;}
    case "popover": {const d=el("div","evb-popover");d.append(el("strong","",block.title||"Popover"),el("p","",block.text||"Conteúdo"));wrap.appendChild(d);break;}
    case "tabs": {const nav=el("div","evb-tabs");(block.items||[["Tab 1","Conteúdo 1"],["Tab 2","Conteúdo 2"]]).forEach(([a,b],i)=>{const btn=el("button","",a);const panel=el("div","evb-tab-panel",b);panel.hidden=i!==0;btn.addEventListener("click",()=>{nav.querySelectorAll(".evb-tab-panel").forEach(x=>x.hidden=true);panel.hidden=false});nav.append(btn,panel)});wrap.appendChild(nav);break;}
    case "timeline": {addText("h2",block.title,"evb-title");const g=el("div","evb-timeline");(block.items||[]).forEach(([n,t])=>{const c=el("div","evb-timeline-item");c.append(el("strong","",n),el("span","",t));g.appendChild(c)});wrap.appendChild(g);break;}
    case "divider": {wrap.appendChild(el("hr","evb-divider"));break;}
    case "spacer": {wrap.classList.add("evb-spacer");break;}
    case "embed": {const box=el("div","evb-placeholder","Código incorporado é mantido desativado na prévia por segurança.");wrap.appendChild(box);break;}
    default: addText("h3",block.title||block.type,"evb-title");addText("p",block.text||"Configure este bloco no editor.","evb-copy");
  }
  Object.entries(blockStyle(block)).forEach(([k,v])=>{if(SAFE_STYLE_KEYS.has(k))wrap.style[k]=String(v)});applyConstraints(wrap,block.constraints||{});
  if(block.layoutMode==="free")wrap.style.position="relative";if(block.layoutMode==="sticky"){wrap.style.position="sticky";wrap.style.top=wrap.style.top||"0px"}if(block.layoutMode==="fixed")wrap.style.position="fixed";
  if(block.constraintX==="center"){wrap.style.marginLeft="auto";wrap.style.marginRight="auto"}if(block.constraintX==="right"){wrap.style.marginLeft="auto"}if(block.constraintY==="bottom"){wrap.style.marginTop="auto"}
  if(block.hoverBackground){wrap.addEventListener("mouseenter",()=>{wrap.dataset.estPrevBg=wrap.style.backgroundColor||"";wrap.style.backgroundColor=block.hoverBackground});wrap.addEventListener("mouseleave",()=>{wrap.style.backgroundColor=wrap.dataset.estPrevBg||""})}
  if(block.focusOutline){wrap.tabIndex=wrap.tabIndex>=0?wrap.tabIndex:0;wrap.addEventListener("focus",()=>wrap.style.outline=block.focusOutline);wrap.addEventListener("blur",()=>wrap.style.outline="")}
  if(block.pressedScale){wrap.addEventListener("pointerdown",()=>{wrap.dataset.estPrevTransform=wrap.style.transform||"";wrap.style.transform=(wrap.dataset.estPrevTransform||"")+" scale("+block.pressedScale+")"});wrap.addEventListener("pointerup",()=>wrap.style.transform=wrap.dataset.estPrevTransform||"")}
  if(block.disabledOpacity&&block.disabled)wrap.style.opacity=block.disabledOpacity;
  if(block.prototypeAction&&block.prototypeAction!=="none"&&!wrap.dataset.estProto){wrap.dataset.estProto="1";wrap.style.cursor="pointer";wrap.addEventListener("click",e=>{const t=String(block.prototypeTarget||"");if(block.prototypeAction==="navigate"&&t)location.href=safeUrl(t)||t;if(block.prototypeAction==="scroll-to"&&t)document.querySelector(t)?.scrollIntoView({behavior:"smooth"});if(block.prototypeAction==="open-modal"&&t){const m=document.querySelector(`[data-estibordo-modal="${CSS.escape(t)}"]`);if(m)m.hidden=false}if(block.prototypeAction==="close-modal"){const m=wrap.closest("[data-estibordo-modal]");if(m)m.hidden=true}})}
  applyMotion(wrap,block.motion||{});if(["container","group","stack","grid"].includes(block.type)){const childWrap=wrap.querySelector(":scope > .evb-children");if(childWrap)Object.entries(blockStyle(block)).forEach(([k,v])=>{if(["display","flexDirection","justifyContent","alignItems","gap","gridTemplateColumns","gridTemplateRows","gridAutoFlow"].includes(k))childWrap.style[k]=String(v)});wrap.style.display="block"}return wrap;
}
function applyBlocks(blocks){const signature=JSON.stringify(blocks||[]);const existing=document.querySelector("[data-estibordo-editor-block-root]");if(existing?.dataset.signature===signature)return;existing?.remove();if(!Array.isArray(blocks)||!blocks.length)return;const root=el("div","estibordo-editor-block-root");root.dataset.estibordoEditorBlockRoot="true";root.dataset.signature=signature;
  blocks.forEach(b=>root.appendChild(renderBlock(b)));
  const mount=document.querySelector("main")||document.body;mount.appendChild(root);
}
function applyMotion(node,motion){if(!node||!motion)return;node.dataset.estMotionHover=motion.hover||"none";if(motion.trigger==="scroll"&&motion.entrance&&motion.entrance!=="none"){node.dataset.estMotionEntrance="none";node.style.opacity="0";const io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){node.style.opacity="";node.dataset.estMotionEntrance=motion.entrance;io.disconnect()}}},{threshold:.16});io.observe(node)}else node.dataset.estMotionEntrance=motion.entrance||"none";node.style.setProperty("--est-motion-duration",Math.max(80,Number(motion.duration)||500)+"ms");node.style.setProperty("--est-motion-delay",Math.max(0,Number(motion.delay)||0)+"ms");if(motion.click&&motion.click!=="none"&&!node.dataset.estMotionClickBound){node.dataset.estMotionClickBound="1";node.addEventListener("click",()=>{const frames=motion.click==="shake"?[{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}]:motion.click==="pop"?[{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}]:[{transform:"scale(1)"},{transform:"scale(.96)"},{transform:"scale(1)"}];node.animate(frames,{duration:320,easing:"ease-out"})})}}
function sanitizeHtml(html){const parser=new DOMParser();const doc=parser.parseFromString(String(html||""),"text/html");doc.querySelectorAll("script,iframe,object,embed,link,style").forEach(n=>n.remove());doc.querySelectorAll("*").forEach(n=>Array.from(n.attributes).forEach(a=>{if(/^on/i.test(a.name)||(/^(href|src)$/i.test(a.name)&&/^(javascript|vbscript|data:text\/html)/i.test(a.value)))n.removeAttribute(a.name)}));return doc.body.innerHTML}
function applyCustomCode(code){let style=document.getElementById("estibordo-custom-page-css");if(!style){style=document.createElement("style");style.id="estibordo-custom-page-css";document.head.appendChild(style)}const css=String(code?.css||"");if(style.textContent!==css)style.textContent=css;let root=document.querySelector("[data-estibordo-custom-html]");if(!root){root=document.createElement("div");root.dataset.estibordoCustomHtml="true";(document.querySelector("main")||document.body).appendChild(root)}const html=sanitizeHtml(code?.html||"");if(root.dataset.signature!==html){root.dataset.signature=html;root.innerHTML=html}}
function applyPageSettings(settings){
  if(!settings||typeof settings!=="object")return;
  if(settings.background){document.body.style.background=settings.background}
  if(settings.seoTitle)document.title=String(settings.seoTitle);
  if(settings.seoDescription){let m=document.querySelector('meta[name="description"]');if(!m){m=document.createElement("meta");m.name="description";document.head.appendChild(m)}m.content=String(settings.seoDescription)}
  document.documentElement.dataset.estibordoColorTheme=settings.colorTheme||"";
  document.documentElement.dataset.estibordoTextTheme=settings.textTheme||"";
  document.documentElement.dataset.estibordoTransition=settings.transition||"";
  document.documentElement.dataset.estibordoLayoutPreset=settings.layoutPreset||"";
}

function applyDesignSystem(tokens){
  if(!tokens||typeof tokens!=="object")return;
  const active=tokens.activeTheme&&tokens.themes?.[tokens.activeTheme]?{...tokens,...tokens.themes[tokens.activeTheme]}:tokens;
  const root=document.documentElement;
  const map={primary:"--estibordo-primary",accent:"--estibordo-accent",surface:"--estibordo-surface",text:"--estibordo-text",radius:"--estibordo-radius",maxContentWidth:"--estibordo-content-max",h1:"--estibordo-h1",body:"--estibordo-body"};
  Object.entries(map).forEach(([key,cssVar])=>{if(active[key])root.style.setProperty(cssVar,String(active[key]))});
  if(active.fontFamily)document.body.style.fontFamily=String(active.fontFamily);if(active.variables){try{const vars=typeof active.variables==="string"?JSON.parse(active.variables):active.variables;Object.entries(vars||{}).forEach(([k,v])=>root.style.setProperty("--"+String(k).replace(/^--/,""),String(v)))}catch{}}
}

function applyFavicon(url) {
  const safe = safeUrl(url);
  if (!safe) return;
  let link = document.querySelector('link[data-estibordo-runtime-favicon]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.dataset.estibordoRuntimeFavicon = 'true';
    document.head.appendChild(link);
  }
  link.href = safe;
}

export default function SiteDesignRuntime() {
  useEffect(() => {let activeDesign=design;try{const params=new URLSearchParams(location.search);if(params.get("estibordoDraft")==="1"){const draft=localStorage.getItem("estibordo-preview:"+location.pathname);if(draft)activeDesign=JSON.parse(draft)}}catch{}const run = () => {if (window.location.pathname.startsWith('/admin/editor')) return;setBreakpoints(activeDesign?.global?.breakpoints||{});ACTIVE_COMPONENTS=Object.fromEntries((activeDesign?.global?.blockComponents||[]).map(c=>[c.id,c]));ACTIVE_SYMBOLS=Object.fromEntries((activeDesign?.global?.elementSymbols||[]).map(c=>[c.id,c]));ACTIVE_COLLECTIONS=activeDesign?.global?.collections||{};ACTIVE_VECTORS=Object.fromEntries((activeDesign?.global?.vectorAssets||[]).map(c=>[c.id,c]));applyDesignSystem(activeDesign?.global?.designSystem||{});applyRecord(activeDesign?.global?.elements || {});const routeKey=document.querySelector("[data-estibordo-not-found]")?"/__404":window.location.pathname;const page=activeDesign?.pages?.[routeKey]||{};
      applyRecord(page.elements || {});
      applyBlocks(page.blocks || []);
      applyPageSettings(page.settings || {});
      applyCustomCode(page.customCode||{});
      applyFavicon(design?.global?.favicon);
    };

    const onMessage=(event)=>{if(event.origin!==window.location.origin||event.data?.type!=="estibordo-editor-design"||!event.data?.design)return;activeDesign=event.data.design;run()};window.addEventListener("message",onMessage);run();
    const observer = new MutationObserver(() => {
      window.clearTimeout(window.__estibordoDesignTimer);
      window.__estibordoDesignTimer = window.setTimeout(run, 60);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize",run);
    return () => {observer.disconnect();window.removeEventListener("resize",run);window.removeEventListener("message",onMessage);};
  }, []);

  return null;
}

const EDITOR_BLOCK_CSS = `
.estibordo-editor-block-root{padding:28px;display:grid;gap:18px;max-width:var(--estibordo-content-max,1320px);margin:0 auto}
.estibordo-editor-block{background:transparent;color:inherit}.evb-children{min-width:0}.estibordo-block-container,.estibordo-block-group,.estibordo-block-stack,.estibordo-block-grid{width:100%}.evb-container-title{margin:0 0 12px;font-size:14px;opacity:.65}.evb-title{font-size:clamp(28px,4vw,48px);margin:0 0 10px}.evb-copy,.evb-text{font-size:16px;line-height:1.65}
.evb-title{font-size:var(--estibordo-h1,clamp(28px,4vw,48px))}.evb-copy,.evb-text{font-size:var(--estibordo-body,16px)}
.evb-modal{position:fixed;inset:50% auto auto 50%;transform:translate(-50%,-50%);z-index:9999;width:min(560px,90vw);padding:28px;background:var(--estibordo-surface,#fff);color:var(--estibordo-text,#071b2b);border-radius:18px;box-shadow:0 30px 90px rgba(0,0,0,.3)}.evb-popover{display:inline-grid;gap:6px;padding:14px 16px;border:1px solid rgba(100,130,150,.25);border-radius:12px;background:var(--estibordo-surface,#fff)}.evb-tabs{display:grid;grid-template-columns:auto 1fr;gap:8px}.evb-tabs>button{padding:9px 12px;border:1px solid rgba(100,130,150,.25);background:transparent;border-radius:8px}.evb-tab-panel{grid-column:1/-1;padding:16px;border:1px solid rgba(100,130,150,.16);border-radius:10px}
.evb-button{display:inline-flex;padding:12px 18px;border-radius:var(--estibordo-radius,9px);background:var(--estibordo-primary,#c8102e);color:#fff;font-weight:800;text-decoration:none}.evb-image,.evb-video{display:block;max-width:100%;border-radius:12px}
.evb-stats,.evb-cards,.evb-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.evb-stat,.evb-card,.evb-placeholder{padding:18px;border:1px solid rgba(120,160,190,.25);border-radius:12px;background:rgba(7,27,43,.08)}.evb-price{display:block;font-size:32px;margin:8px 0}.evb-faq{display:grid;gap:10px}.evb-faq-item{padding:14px 16px;border:1px solid rgba(120,160,190,.25);border-radius:12px}.evb-faq-item summary{font-weight:800;cursor:pointer}.evb-testimonial{margin:0;padding:28px;border-left:4px solid #c8102e;background:rgba(7,27,43,.06);border-radius:14px}.evb-testimonial p{font-size:clamp(22px,3vw,34px);font-weight:800}.evb-testimonial cite{font-style:normal;opacity:.7}.evb-timeline{display:flex;gap:14px;flex-wrap:wrap}.evb-timeline-item{display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid rgba(120,160,190,.25);border-radius:999px}.evb-divider{border:0;border-top:1px solid rgba(120,160,190,.35)}.evb-spacer{min-height:48px}
html[data-estibordo-layout-preset="contained"] main{max-width:1280px;margin-inline:auto}html[data-estibordo-layout-preset="immersive"] main{max-width:none;width:100%}html[data-estibordo-layout-preset="editorial"] main{max-width:980px;margin-inline:auto}
.evb-stat strong,.evb-stat span{display:block}.evb-stat strong{font-size:28px}.evb-menu,.evb-social{display:flex;gap:14px;flex-wrap:wrap}.evb-form{display:grid;gap:10px;max-width:620px}.evb-form input,.evb-form textarea,.evb-input{padding:12px;border:1px solid #cad7df;border-radius:8px}.evb-form button{padding:12px;border:0;border-radius:8px;background:#c8102e;color:#fff;font-weight:800}
html[data-estibordo-transition="fade"] body{animation:estibordoFade .35s ease}html[data-estibordo-transition="slide"] body{animation:estibordoSlide .35s ease}html[data-estibordo-transition="scale"] body{animation:estibordoScale .3s ease}
@keyframes estibordoFade{from{opacity:0}to{opacity:1}}@keyframes estibordoSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes estibordoScale{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:none}}
 .evb-icon-shell{position:relative;display:grid;place-items:center;width:100%;height:100%;min-width:44px;min-height:44px;border-radius:22%;background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(226,239,247,.82));border:1px solid rgba(48,100,132,.16);box-shadow:0 10px 28px rgba(7,27,43,.13),inset 0 1px 0 rgba(255,255,255,.9);overflow:hidden}.evb-icon-halo{position:absolute;width:72%;height:72%;border-radius:50%;background:radial-gradient(circle,rgba(85,167,230,.18),transparent 68%);filter:blur(2px)}.evb-icon{position:relative;z-index:1;display:block;width:62%;height:62%;filter:drop-shadow(0 2px 2px rgba(7,27,43,.12))}.evb-signal-card{display:grid;gap:8px}.evb-signal-flag{position:relative;width:100%;aspect-ratio:1.35;overflow:hidden;border-radius:4px;box-shadow:0 5px 16px rgba(0,0,0,.18);background:var(--a)}.evb-signal-flag i{position:absolute;inset:0}.evb-signal-flag[data-pattern="solid"]{background:var(--a)}.evb-signal-flag[data-pattern="splitV"]{background:linear-gradient(90deg,var(--a) 0 50%,var(--b) 50%)}.evb-signal-flag[data-pattern="splitH"],.evb-signal-flag[data-pattern="h2"]{background:linear-gradient(var(--a) 0 50%,var(--b) 50%)}.evb-signal-flag[data-pattern="diag"]{background:linear-gradient(135deg,var(--a) 0 49%,var(--b) 50%)}.evb-signal-flag[data-pattern="quarters"]{background:conic-gradient(var(--a) 0 25%,var(--b) 0 50%,var(--a) 0 75%,var(--b) 0)}.evb-signal-flag[data-pattern="checker"]{background:conic-gradient(var(--a) 0 25%,var(--b) 0 50%,var(--a) 0 75%,var(--b) 0);background-size:50% 50%}.evb-signal-flag[data-pattern="circle"]{background:var(--a)}.evb-signal-flag[data-pattern="circle"] i{inset:24%;border-radius:50%;background:var(--b)}.evb-signal-flag[data-pattern="center"]{background:var(--a)}.evb-signal-flag[data-pattern="center"] i{inset:25%;background:var(--b)}.evb-signal-flag[data-pattern="cross"]{background:linear-gradient(90deg,transparent 38%,var(--b) 38% 62%,transparent 62%),linear-gradient(transparent 38%,var(--b) 38% 62%,transparent 62%),var(--a)}.evb-signal-flag[data-pattern="x"]{background:linear-gradient(45deg,transparent 42%,var(--b) 43% 57%,transparent 58%),linear-gradient(-45deg,transparent 42%,var(--b) 43% 57%,transparent 58%),var(--a)}.evb-signal-flag[data-pattern="whiteDiamond"]{background:var(--b)}.evb-signal-flag[data-pattern="whiteDiamond"] i{inset:20%;background:var(--a);transform:rotate(45deg)}.evb-signal-flag[data-pattern="h3"]{background:linear-gradient(var(--a) 0 33.3%,var(--b) 33.3% 66.6%,var(--a) 66.6%)}.evb-signal-flag[data-pattern="v3"]{background:linear-gradient(90deg,var(--a) 0 33.3%,var(--b) 33.3% 66.6%,#0057a6 66.6%)}.evb-signal-flag[data-pattern="h5"]{background:repeating-linear-gradient(var(--a) 0 20%,var(--b) 20% 40%)}.evb-signal-flag[data-pattern="v6"]{background:repeating-linear-gradient(90deg,#f4c300 0 16.66%,#0057a6 16.66% 33.33%)}.evb-signal-meta{display:grid;gap:2px}.evb-signal-meta strong{font-size:18px}.evb-signal-meta span{font-size:10px;line-height:1.35;opacity:.72}.evb-logo{display:inline-flex;align-items:center;gap:12px}.evb-logo-mark{width:48px;height:48px;flex:0 0 auto}.evb-logo-words{display:grid;gap:2px}.evb-logo-words strong{font-size:20px;letter-spacing:.08em;line-height:1}.evb-logo-words small{font-size:9px;letter-spacing:.14em;opacity:.68}.evb-logo-circle .evb-logo-mark,.evb-logo-badge .evb-logo-mark,.evb-logo-crest .evb-logo-mark{padding:8px;border:1px solid currentColor;border-radius:50%}.evb-logo-square .evb-logo-mark{padding:8px;border:1px solid currentColor;border-radius:8px}.evb-logo-rounded{padding:8px 12px;border:1px solid currentColor;border-radius:16px}
[data-est-motion-entrance="fade"]{animation:estMotionFade var(--est-motion-duration,.5s) ease both;animation-delay:var(--est-motion-delay,0ms)}[data-est-motion-entrance="slide-up"]{animation:estMotionUp var(--est-motion-duration,.5s) ease both;animation-delay:var(--est-motion-delay,0ms)}[data-est-motion-entrance="slide-left"]{animation:estMotionLeft var(--est-motion-duration,.5s) ease both;animation-delay:var(--est-motion-delay,0ms)}[data-est-motion-entrance="slide-right"]{animation:estMotionRight var(--est-motion-duration,.5s) ease both;animation-delay:var(--est-motion-delay,0ms)}[data-est-motion-entrance="zoom"]{animation:estMotionZoom var(--est-motion-duration,.5s) ease both;animation-delay:var(--est-motion-delay,0ms)}[data-est-motion-entrance="rotate"]{animation:estMotionRotate var(--est-motion-duration,.5s) ease both;animation-delay:var(--est-motion-delay,0ms)}[data-est-motion-hover]{transition:transform .24s ease,filter .24s ease,opacity .24s ease,box-shadow .24s ease}[data-est-motion-hover="lift"]:hover{transform:translateY(-7px)}[data-est-motion-hover="zoom"]:hover{transform:scale(1.045)}[data-est-motion-hover="glow"]:hover{filter:drop-shadow(0 10px 24px rgba(80,170,220,.38))}[data-est-motion-hover="tilt"]:hover{transform:perspective(700px) rotateX(3deg) rotateY(-4deg)}[data-est-motion-hover="fade"]:hover{opacity:.72}@keyframes estMotionFade{from{opacity:0}to{opacity:1}}@keyframes estMotionUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}@keyframes estMotionLeft{from{opacity:0;transform:translateX(-26px)}to{opacity:1;transform:none}}@keyframes estMotionRight{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:none}}@keyframes estMotionZoom{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}@keyframes estMotionRotate{from{opacity:0;transform:rotate(-3deg) scale(.96)}to{opacity:1;transform:none}}
@media(max-width:700px){.evb-stats,.evb-cards,.evb-gallery{grid-template-columns:1fr}}
`;
if(typeof document!=="undefined"&&!document.getElementById("estibordo-editor-block-css")){const s=document.createElement("style");s.id="estibordo-editor-block-css";s.textContent=EDITOR_BLOCK_CSS;document.head.appendChild(s)}
