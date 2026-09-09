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
  'textTransform','textDecoration','whiteSpace','cursor','translate'
]);

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
        ...(width<=1024?(config.responsive?.tablet?.style||{}):{}),
        ...(width<=620?(config.responsive?.mobile?.style||{}):{})
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
function renderBlock(block){
  const wrap=el("section","estibordo-editor-block estibordo-block-"+block.type);wrap.dataset.estibordoEditorBlock=block.id||"";
  const addText=(tag,value,cls)=>{if(value){const n=el(tag,cls,value);wrap.appendChild(n);return n}};
  switch(block.type){
    case "text": addText("p",block.text||"Novo texto","evb-text"); break;
    case "button": {const a=addText("a",block.text||"Botão","evb-button");a.href=safeUrl(block.href)||"#";break;}
    case "image": {const i=el("img","evb-image");i.src=safeUrl(block.src);i.alt=block.alt||"";wrap.appendChild(i);break;}
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
  Object.entries(block.style||{}).forEach(([k,v])=>{if(SAFE_STYLE_KEYS.has(k))wrap.style[k]=String(v)});
  return wrap;
}
function applyBlocks(blocks){
  document.querySelectorAll("[data-estibordo-editor-block-root]").forEach(n=>n.remove());
  if(!Array.isArray(blocks)||!blocks.length)return;
  const root=el("div","estibordo-editor-block-root");root.dataset.estibordoEditorBlockRoot="true";
  blocks.forEach(b=>root.appendChild(renderBlock(b)));
  const mount=document.querySelector("main")||document.body;mount.appendChild(root);
}
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
  useEffect(() => {
    const run = () => {
      if (window.location.pathname.startsWith('/admin/editor')) return;
      applyDesignSystem(design?.global?.designSystem||{});
      applyRecord(design?.global?.elements || {});
      const routeKey=document.querySelector("[data-estibordo-not-found]")?"/__404":window.location.pathname;
      const page=design?.pages?.[routeKey]||{};
      applyRecord(page.elements || {});
      applyBlocks(page.blocks || []);
      applyPageSettings(page.settings || {});
      applyFavicon(design?.global?.favicon);
    };

    run();
    const observer = new MutationObserver(() => {
      window.clearTimeout(window.__estibordoDesignTimer);
      window.__estibordoDesignTimer = window.setTimeout(run, 60);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize",run);
    return () => {observer.disconnect();window.removeEventListener("resize",run);};
  }, []);

  return null;
}

const EDITOR_BLOCK_CSS = `
.estibordo-editor-block-root{padding:28px;display:grid;gap:18px;max-width:var(--estibordo-content-max,1320px);margin:0 auto}
.estibordo-editor-block{background:transparent;color:inherit}.evb-title{font-size:clamp(28px,4vw,48px);margin:0 0 10px}.evb-copy,.evb-text{font-size:16px;line-height:1.65}
.evb-button{display:inline-flex;padding:12px 18px;border-radius:var(--estibordo-radius,9px);background:var(--estibordo-primary,#c8102e);color:#fff;font-weight:800;text-decoration:none}.evb-image,.evb-video{display:block;max-width:100%;border-radius:12px}
.evb-stats,.evb-cards,.evb-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.evb-stat,.evb-card,.evb-placeholder{padding:18px;border:1px solid rgba(120,160,190,.25);border-radius:12px;background:rgba(7,27,43,.08)}.evb-price{display:block;font-size:32px;margin:8px 0}.evb-faq{display:grid;gap:10px}.evb-faq-item{padding:14px 16px;border:1px solid rgba(120,160,190,.25);border-radius:12px}.evb-faq-item summary{font-weight:800;cursor:pointer}.evb-testimonial{margin:0;padding:28px;border-left:4px solid #c8102e;background:rgba(7,27,43,.06);border-radius:14px}.evb-testimonial p{font-size:clamp(22px,3vw,34px);font-weight:800}.evb-testimonial cite{font-style:normal;opacity:.7}.evb-timeline{display:flex;gap:14px;flex-wrap:wrap}.evb-timeline-item{display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid rgba(120,160,190,.25);border-radius:999px}.evb-divider{border:0;border-top:1px solid rgba(120,160,190,.35)}.evb-spacer{min-height:48px}
html[data-estibordo-layout-preset="contained"] main{max-width:1280px;margin-inline:auto}html[data-estibordo-layout-preset="immersive"] main{max-width:none;width:100%}html[data-estibordo-layout-preset="editorial"] main{max-width:980px;margin-inline:auto}
.evb-stat strong,.evb-stat span{display:block}.evb-stat strong{font-size:28px}.evb-menu,.evb-social{display:flex;gap:14px;flex-wrap:wrap}.evb-form{display:grid;gap:10px;max-width:620px}.evb-form input,.evb-form textarea,.evb-input{padding:12px;border:1px solid #cad7df;border-radius:8px}.evb-form button{padding:12px;border:0;border-radius:8px;background:#c8102e;color:#fff;font-weight:800}
html[data-estibordo-transition="fade"] body{animation:estibordoFade .35s ease}html[data-estibordo-transition="slide"] body{animation:estibordoSlide .35s ease}html[data-estibordo-transition="scale"] body{animation:estibordoScale .3s ease}
@keyframes estibordoFade{from{opacity:0}to{opacity:1}}@keyframes estibordoSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes estibordoScale{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:none}}
@media(max-width:700px){.evb-stats,.evb-cards,.evb-gallery{grid-template-columns:1fr}}
`;
if(typeof document!=="undefined"&&!document.getElementById("estibordo-editor-block-css")){const s=document.createElement("style");s.id="estibordo-editor-block-css";s.textContent=EDITOR_BLOCK_CSS;document.head.appendChild(s)}
