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

let ACTIVE_BREAKPOINTS={tablet:1024,mobile:620};
function setBreakpoints(value){ACTIVE_BREAKPOINTS={tablet:Math.max(621,Number(value?.tablet)||1024),mobile:Math.max(320,Number(value?.mobile)||620)}}

function safeUrl(value) {
  const v = String(value || '').trim();
  if (!v) return '';
  if (/^(javascript|data|vbscript):/i.test(v)) return '';
  return v;
}

function applyRecord(record) {
  if (!record || typeof record !== 'object') return;

  for (const [selector, config] of Object.entries(record)) {
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

      const width=window.innerWidth;
      const responsiveStyle={
        ...(config.style||{}),
        ...(width<=ACTIVE_BREAKPOINTS.tablet?(config.responsive?.tablet?.style||{}):{}),
        ...(width<=ACTIVE_BREAKPOINTS.mobile?(config.responsive?.mobile?.style||{}):{})
      };
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
function blockStyle(block){const width=window.innerWidth;return {...(block.style||{}),...(width<=ACTIVE_BREAKPOINTS.tablet?(block.responsive?.tablet?.style||{}):{}),...(width<=ACTIVE_BREAKPOINTS.mobile?(block.responsive?.mobile?.style||{}):{})}}
function renderBlock(block){
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
    case "testimonial": {const q=el("blockquote","evb-testimonial");q.append(el("p","",block.quote||""),el("cite","",block.author||""));wrap.appendChild(q);break;}
    case "timeline": {addText("h2",block.title,"evb-title");const g=el("div","evb-timeline");(block.items||[]).forEach(([n,t])=>{const c=el("div","evb-timeline-item");c.append(el("strong","",n),el("span","",t));g.appendChild(c)});wrap.appendChild(g);break;}
    case "divider": {wrap.appendChild(el("hr","evb-divider"));break;}
    case "spacer": {wrap.classList.add("evb-spacer");break;}
    case "embed": {const box=el("div","evb-placeholder","Código incorporado é mantido desativado na prévia por segurança.");wrap.appendChild(box);break;}
    default: addText("h3",block.title||block.type,"evb-title");addText("p",block.text||"Configure este bloco no editor.","evb-copy");
  }
  Object.entries(blockStyle(block)).forEach(([k,v])=>{if(SAFE_STYLE_KEYS.has(k))wrap.style[k]=String(v)});applyMotion(wrap,block.motion||{});if(["container","group","stack","grid"].includes(block.type)){const childWrap=wrap.querySelector(":scope > .evb-children");if(childWrap)Object.entries(blockStyle(block)).forEach(([k,v])=>{if(["display","flexDirection","justifyContent","alignItems","gap","gridTemplateColumns","gridTemplateRows","gridAutoFlow"].includes(k))childWrap.style[k]=String(v)});wrap.style.display="block"}return wrap;
}
function applyBlocks(blocks){const signature=JSON.stringify(blocks||[]);const existing=document.querySelector("[data-estibordo-editor-block-root]");if(existing?.dataset.signature===signature)return;existing?.remove();if(!Array.isArray(blocks)||!blocks.length)return;const root=el("div","estibordo-editor-block-root");root.dataset.estibordoEditorBlockRoot="true";root.dataset.signature=signature;
  blocks.forEach(b=>root.appendChild(renderBlock(b)));
  const mount=document.querySelector("main")||document.body;mount.appendChild(root);
}
function applyMotion(node,motion){if(!node||!motion)return;node.dataset.estMotionEntrance=motion.entrance||"none";node.dataset.estMotionHover=motion.hover||"none";node.style.setProperty("--est-motion-duration",Math.max(80,Number(motion.duration)||500)+"ms");node.style.setProperty("--est-motion-delay",Math.max(0,Number(motion.delay)||0)+"ms");if(motion.click&&motion.click!=="none"&&!node.dataset.estMotionClickBound){node.dataset.estMotionClickBound="1";node.addEventListener("click",()=>{const frames=motion.click==="shake"?[{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}]:motion.click==="pop"?[{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}]:[{transform:"scale(1)"},{transform:"scale(.96)"},{transform:"scale(1)"}];node.animate(frames,{duration:320,easing:"ease-out"})})}}
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
  const root=document.documentElement;
  const map={primary:"--estibordo-primary",accent:"--estibordo-accent",surface:"--estibordo-surface",text:"--estibordo-text",radius:"--estibordo-radius",maxContentWidth:"--estibordo-content-max"};
  Object.entries(map).forEach(([key,cssVar])=>{if(tokens[key])root.style.setProperty(cssVar,String(tokens[key]))});
  if(tokens.fontFamily)document.body.style.fontFamily=String(tokens.fontFamily);
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
  useEffect(() => {let activeDesign=design;const run = () => {if (window.location.pathname.startsWith('/admin/editor')) return;setBreakpoints(activeDesign?.global?.breakpoints||{});applyDesignSystem(activeDesign?.global?.designSystem||{});applyRecord(activeDesign?.global?.elements || {});const routeKey=document.querySelector("[data-estibordo-not-found]")?"/__404":window.location.pathname;const page=activeDesign?.pages?.[routeKey]||{};
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
