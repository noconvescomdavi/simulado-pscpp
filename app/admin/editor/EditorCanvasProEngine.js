"use client";
import {useEffect,useRef} from "react";
import {selectorForNode} from "./EditorObjectRegistry";

const FRAME='iframe[title="Prévia da página"]';
const HANDLES=["nw","n","ne","e","se","s","sw","w","rotate"];
const snap=(v,n)=>Math.round(v/n)*n;
function routeOf(frame){try{return frame.contentWindow.location.pathname||"/"}catch{return frame.getAttribute("src")?.split("?")[0]||"/"}}
function selected(doc){return doc?.querySelector?.("[data-editor-core-selected],[data-ev-selected]")||null}
function emit(frame,el,style,label){window.dispatchEvent(new CustomEvent("estibordo:canvas-commit",{detail:{route:routeOf(frame),selector:selectorForNode(el),style,label}}))}
function translation(el){const cs=el.ownerDocument.defaultView.getComputedStyle(el),raw=String(cs.translate==="none"?"0 0":cs.translate),m=raw.match(/-?\d+(?:\.\d+)?/g)||[];return [Number(m[0]||0),Number(m[1]||0)]}

export default function EditorCanvasProEngine(){
  const cleanup=useRef(()=>{});
  useEffect(()=>{
    let timer=0,lastFrame=null,lastDoc=null;
    function attach(frame){
      cleanup.current?.();const doc=frame.contentDocument;if(!doc?.body)return;
      lastFrame=frame;lastDoc=doc;
      let overlay=null,active=null,op=null,raf=0;
      const style=document.createElement("style");style.dataset.estibordoCanvasProParent="";style.textContent=`
      [data-ecp-parent-overlay]{position:fixed;z-index:100080;border:2px solid #8b5cf6;box-sizing:border-box;pointer-events:auto;background:transparent;touch-action:none}
      [data-ecp-parent-overlay][hidden]{display:none!important}
      [data-ecp-parent-label]{position:absolute;left:-2px;top:-25px;padding:4px 7px;background:#8b5cf6;color:#fff;border-radius:5px 5px 0 0;font:700 9px Arial;white-space:nowrap;max-width:280px;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
      [data-ecp-parent-handle]{position:absolute;width:11px;height:11px;background:#fff;border:2px solid #8b5cf6;border-radius:2px;box-sizing:border-box;z-index:2}
      [data-ecp-parent-handle=n]{left:50%;top:-7px;transform:translateX(-50%);cursor:ns-resize}[data-ecp-parent-handle=s]{left:50%;bottom:-7px;transform:translateX(-50%);cursor:ns-resize}
      [data-ecp-parent-handle=e]{right:-7px;top:50%;transform:translateY(-50%);cursor:ew-resize}[data-ecp-parent-handle=w]{left:-7px;top:50%;transform:translateY(-50%);cursor:ew-resize}
      [data-ecp-parent-handle=nw]{left:-7px;top:-7px;cursor:nwse-resize}[data-ecp-parent-handle=ne]{right:-7px;top:-7px;cursor:nesw-resize}[data-ecp-parent-handle=se]{right:-7px;bottom:-7px;cursor:nwse-resize}[data-ecp-parent-handle=sw]{left:-7px;bottom:-7px;cursor:nesw-resize}
      [data-ecp-parent-handle=rotate]{left:50%;top:-36px;transform:translateX(-50%);border-radius:50%;cursor:grab}[data-ecp-parent-handle=rotate]:after{content:"";position:absolute;left:3px;top:9px;width:1px;height:22px;background:#8b5cf6}
      [data-ecp-parent-guide]{position:fixed;z-index:100079;background:#ff2d7a;pointer-events:none}[data-ecp-parent-guide=x]{height:1px}[data-ecp-parent-guide=y]{width:1px}
      `;document.head.appendChild(style);
      function build(){overlay?.remove();overlay=document.createElement("div");overlay.dataset.ecpParentOverlay="";overlay.hidden=true;const label=document.createElement("span");label.dataset.ecpParentLabel="";overlay.appendChild(label);HANDLES.forEach(h=>{const i=document.createElement("i");i.dataset.ecpParentHandle=h;overlay.appendChild(i)});document.body.appendChild(overlay)}
      function scales(){const fr=frame.getBoundingClientRect(),cw=Math.max(1,frame.clientWidth||doc.documentElement.clientWidth||fr.width),ch=Math.max(1,frame.clientHeight||doc.documentElement.clientHeight||fr.height);return {fr,sx:fr.width/cw,sy:fr.height/ch}}
      function parentRect(el){const r=el.getBoundingClientRect(),{fr,sx,sy}=scales();return {left:fr.left+r.left*sx,top:fr.top+r.top*sy,width:r.width*sx,height:r.height*sy,right:fr.left+r.right*sx,bottom:fr.top+r.bottom*sy,sx,sy}}
      function clearGuides(){document.querySelectorAll("[data-ecp-parent-guide]").forEach(n=>n.remove())}
      function guides(el){clearGuides();const r=parentRect(el),siblings=[...(el.parentElement?.children||[])].filter(n=>n!==el&&n.nodeType===1);for(const s of siblings){const sr=parentRect(s);if(Math.abs(r.left-sr.left)<5||Math.abs(r.right-sr.right)<5){const g=document.createElement("i");g.dataset.ecpParentGuide="y";Object.assign(g.style,{left:(Math.abs(r.left-sr.left)<5?sr.left:sr.right)+"px",top:frame.getBoundingClientRect().top+"px",height:frame.getBoundingClientRect().height+"px"});document.body.appendChild(g);break}if(Math.abs(r.top-sr.top)<5||Math.abs(r.bottom-sr.bottom)<5){const g=document.createElement("i");g.dataset.ecpParentGuide="x";Object.assign(g.style,{top:(Math.abs(r.top-sr.top)<5?sr.top:sr.bottom)+"px",left:frame.getBoundingClientRect().left+"px",width:frame.getBoundingClientRect().width+"px"});document.body.appendChild(g);break}}}
      function position(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const el=selected(doc);if(!el||!el.isConnected){if(overlay)overlay.hidden=true;active=null;return}active=el;if(!overlay)build();const r=parentRect(el);overlay.hidden=false;Object.assign(overlay.style,{left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px"});overlay.querySelector("[data-ecp-parent-label]").textContent=(el.getAttribute("data-editor-name")||el.tagName)+` · ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`})}
      function begin(e){
        if(!active||active.hasAttribute("data-editor-core-locked"))return;
        const handle=e.target?.dataset?.ecpParentHandle||null,r=active.getBoundingClientRect(),[tx,ty]=translation(active),pr=parentRect(active);
        e.preventDefault();e.stopPropagation();
        op={kind:handle==="rotate"?"rotate":handle?"resize":"move",handle,x:e.clientX,y:e.clientY,w:r.width,h:r.height,tx,ty,cx:pr.left+pr.width/2,cy:pr.top+pr.height/2,sx:pr.sx,sy:pr.sy,el:active,style:{}};
        overlay.setPointerCapture?.(e.pointerId)
      }
      function move(e){
        if(!op)return;e.preventDefault();
        const dx=(e.clientX-op.x)/Math.max(.0001,op.sx),dy=(e.clientY-op.y)/Math.max(.0001,op.sy),grid=e.shiftKey?10:1;
        if(op.kind==="move"){
          const tx=snap(op.tx+dx,grid),ty=snap(op.ty+dy,grid),cs=doc.defaultView.getComputedStyle(op.el);if(cs.position==="static")op.el.style.position="relative";op.el.style.translate=`${tx}px ${ty}px`;op.style={position:op.el.style.position||"relative",translate:`${tx}px ${ty}px`};guides(op.el)
        }else if(op.kind==="rotate"){
          let a=Math.atan2(e.clientY-op.cy,e.clientX-op.cx)*180/Math.PI+90;if(e.shiftKey)a=Math.round(a/15)*15;const v=`rotate(${a.toFixed(1)}deg)`;op.el.style.transform=v;op.style={transform:v}
        }else{
          let w=op.w,h=op.h,tx=op.tx,ty=op.ty;const d=op.handle||"se";
          if(d.includes("e"))w=Math.max(16,op.w+dx);if(d.includes("s"))h=Math.max(16,op.h+dy);if(d.includes("w")){w=Math.max(16,op.w-dx);tx=op.tx+(op.w-w)}if(d.includes("n")){h=Math.max(16,op.h-dy);ty=op.ty+(op.h-h)}
          if(e.shiftKey){const ratio=op.w/Math.max(1,op.h);if(Math.abs(dx)>Math.abs(dy))h=w/ratio;else w=h*ratio}
          if(e.altKey){tx=op.tx-(w-op.w)/2;ty=op.ty-(h-op.h)/2}
          if(doc.defaultView.getComputedStyle(op.el).position==="static")op.el.style.position="relative";Object.assign(op.el.style,{width:w+"px",height:h+"px",translate:`${tx}px ${ty}px`});op.style={width:w+"px",height:h+"px",translate:`${tx}px ${ty}px`,position:op.el.style.position||"relative"}
        }
        position()
      }
      function end(){if(!op)return;const done=op;op=null;clearGuides();emit(frame,done.el,done.style,done.kind==="move"?"Mover objeto":done.kind==="rotate"?"Rotacionar objeto":"Redimensionar objeto");position()}
      build();overlay.addEventListener("pointerdown",begin);overlay.addEventListener("pointermove",move);overlay.addEventListener("pointerup",end);overlay.addEventListener("pointercancel",end);
      const mo=new MutationObserver(position);mo.observe(doc.body,{subtree:true,attributes:true,attributeFilter:["data-editor-core-selected","data-ev-selected","style","class"]});doc.addEventListener("scroll",position,true);doc.defaultView.addEventListener("resize",position);window.addEventListener("resize",position);window.addEventListener("scroll",position,true);position();
      cleanup.current=()=>{cancelAnimationFrame(raf);mo.disconnect();clearGuides();overlay?.remove();style.remove();doc.removeEventListener("scroll",position,true);doc.defaultView.removeEventListener("resize",position);window.removeEventListener("resize",position);window.removeEventListener("scroll",position,true)}
    }
    const scan=()=>{const f=document.querySelector(FRAME);let d=null;try{d=f?.contentDocument}catch{}if(f&&d?.body&&(f!==lastFrame||d!==lastDoc))attach(f);else if(f&&d?.body){const el=selected(d);if(el)window.dispatchEvent(new CustomEvent("estibordo:canvas-selection-alive",{detail:{route:routeOf(f),selector:selectorForNode(el)}}))}};
    timer=setInterval(scan,500);scan();return()=>{clearInterval(timer);cleanup.current?.()}
  },[]);return null
}
