"use client";
import {useEffect,useRef} from "react";

const FRAME='iframe[title="Prévia da página"]';
const HANDLES=["nw","n","ne","e","se","s","sw","w","rotate"];
const snap=(v,n)=>Math.round(v/n)*n;
function routeOf(frame){try{return frame.contentWindow.location.pathname||"/"}catch{return frame.getAttribute("src")?.split("?")[0]||"/"}}
function selectorFor(el){if(!el||el.nodeType!==1)return"";if(el.dataset?.editorId)return `[data-editor-id="${CSS.escape(el.dataset.editorId)}"]`;if(el.id)return `#${CSS.escape(el.id)}`;const parts=[];let n=el;while(n&&n.tagName&&n.tagName.toLowerCase()!=="html"){let p=n.tagName.toLowerCase();const parent=n.parentElement;if(parent){const same=[...parent.children].filter(x=>x.tagName===n.tagName);if(same.length>1)p+=`:nth-of-type(${same.indexOf(n)+1})`}parts.unshift(p);if(n===el.ownerDocument.body)break;n=parent;if(parts.length>8)break}return parts.join(" > ")}
function selected(doc){return doc.querySelector("[data-editor-core-selected],[data-ev-selected]")}
function emit(frame,el,style,label){window.dispatchEvent(new CustomEvent("estibordo:canvas-commit",{detail:{route:routeOf(frame),selector:selectorFor(el),style,label}}))}

export default function EditorCanvasProEngine(){
  const cleanup=useRef(()=>{});
  useEffect(()=>{
    let timer=0;
    function attach(frame){
      cleanup.current?.();const doc=frame.contentDocument;if(!doc?.body)return;
      let overlay=null,active=null,op=null,raf=0;
      const style=doc.createElement("style");style.dataset.estibordoCanvasPro="";style.textContent=`
      [data-ecp-overlay]{position:fixed;z-index:2147483640;border:2px solid #8b5cf6;pointer-events:none;box-sizing:border-box}
      [data-ecp-handle]{position:absolute;width:10px;height:10px;background:#fff;border:2px solid #8b5cf6;border-radius:2px;pointer-events:auto;box-sizing:border-box}
      [data-ecp-handle=n]{left:50%;top:-6px;transform:translateX(-50%);cursor:ns-resize}[data-ecp-handle=s]{left:50%;bottom:-6px;transform:translateX(-50%);cursor:ns-resize}
      [data-ecp-handle=e]{right:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize}[data-ecp-handle=w]{left:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize}
      [data-ecp-handle=nw]{left:-6px;top:-6px;cursor:nwse-resize}[data-ecp-handle=ne]{right:-6px;top:-6px;cursor:nesw-resize}[data-ecp-handle=se]{right:-6px;bottom:-6px;cursor:nwse-resize}[data-ecp-handle=sw]{left:-6px;bottom:-6px;cursor:nesw-resize}
      [data-ecp-handle=rotate]{left:50%;top:-34px;transform:translateX(-50%);border-radius:50%;cursor:grab}[data-ecp-handle=rotate]:after{content:"";position:absolute;left:3px;top:8px;width:1px;height:20px;background:#8b5cf6}
      [data-ecp-label]{position:absolute;left:-2px;top:-24px;padding:4px 7px;background:#8b5cf6;color:white;border-radius:5px 5px 0 0;font:700 9px Arial;white-space:nowrap;max-width:260px;overflow:hidden;text-overflow:ellipsis}
      [data-ecp-measure]{position:fixed;z-index:2147483639;background:#ff2d7a;pointer-events:none}[data-ecp-measure=x]{height:1px}[data-ecp-measure=y]{width:1px}
      `;doc.head.appendChild(style);
      function build(){overlay?.remove();overlay=doc.createElement("div");overlay.dataset.ecpOverlay="";const label=doc.createElement("span");label.dataset.ecpLabel="";overlay.appendChild(label);HANDLES.forEach(h=>{const i=doc.createElement("i");i.dataset.ecpHandle=h;overlay.appendChild(i)});doc.body.appendChild(overlay)}
      function clearMeasures(){doc.querySelectorAll("[data-ecp-measure]").forEach(n=>n.remove())}
      function position(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const el=selected(doc);if(!el){overlay&&(overlay.hidden=true);active=null;return}active=el;if(!overlay)build();overlay.hidden=false;const r=el.getBoundingClientRect();Object.assign(overlay.style,{left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px"});overlay.querySelector("[data-ecp-label]").textContent=(el.getAttribute("data-editor-name")||el.tagName)+` · ${Math.round(r.width)}×${Math.round(r.height)}`})}
      function guides(el,rect){clearMeasures();const sib=[...(el.parentElement?.children||[])].filter(n=>n!==el&&n!==overlay);for(const s of sib){const r=s.getBoundingClientRect();if(Math.abs(rect.left-r.left)<5||Math.abs(rect.right-r.right)<5){const g=doc.createElement("i");g.dataset.ecpMeasure="y";Object.assign(g.style,{left:(Math.abs(rect.left-r.left)<5?r.left:r.right)+"px",top:"0",height:"100vh"});doc.body.appendChild(g);break}if(Math.abs(rect.top-r.top)<5||Math.abs(rect.bottom-r.bottom)<5){const g=doc.createElement("i");g.dataset.ecpMeasure="x";Object.assign(g.style,{top:(Math.abs(rect.top-r.top)<5?r.top:r.bottom)+"px",left:"0",width:"100vw"});doc.body.appendChild(g);break}}}
      const down=e=>{
        if(!active)return;const h=e.target?.dataset?.ecpHandle;if(!h&&!overlay?.contains(e.target))return;
        e.preventDefault();e.stopImmediatePropagation();const r=active.getBoundingClientRect(),cs=doc.defaultView.getComputedStyle(active),tr=String(cs.translate==="none"?"0 0":cs.translate).match(/-?\d+(?:\.\d+)?/g)||[];
        op={kind:h==="rotate"?"rotate":"resize",handle:h,x:e.clientX,y:e.clientY,w:r.width,h:r.height,tx:Number(tr[0]||0),ty:Number(tr[1]||0),cx:r.left+r.width/2,cy:r.top+r.height/2,el:active,style:{}};e.target.setPointerCapture?.(e.pointerId)
      };
      const nodeDown=e=>{
        if(e.target?.closest?.("[data-ecp-overlay]"))return;const el=selected(doc);if(!el||!el.contains(e.target))return;if(el.hasAttribute("data-editor-core-locked"))return;
        e.preventDefault();e.stopImmediatePropagation();const r=el.getBoundingClientRect(),cs=doc.defaultView.getComputedStyle(el),tr=String(cs.translate==="none"?"0 0":cs.translate).match(/-?\d+(?:\.\d+)?/g)||[];op={kind:"move",x:e.clientX,y:e.clientY,w:r.width,h:r.height,tx:Number(tr[0]||0),ty:Number(tr[1]||0),el,style:{}};el.setPointerCapture?.(e.pointerId)
      };
      const move=e=>{if(!op)return;e.preventDefault();const dx=e.clientX-op.x,dy=e.clientY-op.y,grid=e.shiftKey?10:1;
        if(op.kind==="move"){let tx=snap(op.tx+dx,grid),ty=snap(op.ty+dy,grid);op.el.style.position=doc.defaultView.getComputedStyle(op.el).position==="static"?"relative":op.el.style.position;op.el.style.translate=`${tx}px ${ty}px`;op.style={position:op.el.style.position||"relative",translate:`${tx}px ${ty}px`};guides(op.el,op.el.getBoundingClientRect())}
        else if(op.kind==="rotate"){let a=Math.atan2(e.clientY-op.cy,e.clientX-op.cx)*180/Math.PI+90;if(e.shiftKey)a=Math.round(a/15)*15;op.el.style.transform=`rotate(${a.toFixed(1)}deg)`;op.style={transform:`rotate(${a.toFixed(1)}deg)`}}
        else{let w=op.w,h=op.h,tx=op.tx,ty=op.ty;const d=op.handle||"se";if(d.includes("e"))w=Math.max(16,op.w+dx);if(d.includes("s"))h=Math.max(16,op.h+dy);if(d.includes("w")){w=Math.max(16,op.w-dx);tx=op.tx+(op.w-w)}if(d.includes("n")){h=Math.max(16,op.h-dy);ty=op.ty+(op.h-h)}if(e.shiftKey){const ratio=op.w/Math.max(1,op.h);if(Math.abs(dx)>Math.abs(dy))h=w/ratio;else w=h*ratio}if(e.altKey){tx=op.tx-(w-op.w)/2;ty=op.ty-(h-op.h)/2}Object.assign(op.el.style,{width:w+"px",height:h+"px",translate:`${tx}px ${ty}px`,position:doc.defaultView.getComputedStyle(op.el).position==="static"?"relative":op.el.style.position});op.style={width:w+"px",height:h+"px",translate:`${tx}px ${ty}px`,position:op.el.style.position||"relative"}}
        position()};
      const up=e=>{if(!op)return;const done=op;op=null;clearMeasures();emit(frame,done.el,done.style,done.kind==="move"?"Mover objeto":done.kind==="rotate"?"Rotacionar objeto":"Redimensionar objeto");position()};
      doc.addEventListener("pointerdown",down,true);doc.addEventListener("pointerdown",nodeDown,true);doc.addEventListener("pointermove",move,true);doc.addEventListener("pointerup",up,true);doc.addEventListener("scroll",position,true);doc.defaultView.addEventListener("resize",position);const mo=new MutationObserver(position);mo.observe(doc.body,{subtree:true,attributes:true,attributeFilter:["data-editor-core-selected","data-ev-selected","style"]});position();
      cleanup.current=()=>{cancelAnimationFrame(raf);mo.disconnect();overlay?.remove();style.remove();clearMeasures();doc.removeEventListener("pointerdown",down,true);doc.removeEventListener("pointerdown",nodeDown,true);doc.removeEventListener("pointermove",move,true);doc.removeEventListener("pointerup",up,true);doc.removeEventListener("scroll",position,true);doc.defaultView.removeEventListener("resize",position)}
    }
    const scan=()=>{const f=document.querySelector(FRAME);if(f?.contentDocument?.body&&f!==window.__estibordoCanvasFrame){window.__estibordoCanvasFrame=f;attach(f)}};timer=setInterval(scan,650);scan();return()=>{clearInterval(timer);cleanup.current?.()}
  },[]);return null
}
