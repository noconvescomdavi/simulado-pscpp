"use client";
export function captureConstraintModel(el,{xMode="left",yMode="top",preserveAspect=false}={}){
  if(!el?.parentElement)return null;const p=el.parentElement,r=el.getBoundingClientRect(),pr=p.getBoundingClientRect();
  const pw=Math.max(1,p.clientWidth||pr.width),ph=Math.max(1,p.clientHeight||pr.height);
  const left=r.left-pr.left+(p.scrollLeft||0),top=r.top-pr.top+(p.scrollTop||0),width=r.width,height=r.height,right=pw-left-width,bottom=ph-top-height;
  return {enabled:true,xMode,yMode,preserveAspect,baseParentW:pw,baseParentH:ph,left,right,top,bottom,width,height,centerX:left+width/2-pw/2,centerY:top+height/2-ph/2,leftRatio:left/pw,topRatio:top/ph,widthRatio:width/pw,heightRatio:height/ph,aspect:width/Math.max(1,height),minWidth:0,maxWidth:0,minHeight:0,maxHeight:0};
}
export function solveConstraintModel(m,pw,ph){
  if(!m?.enabled)return null;let width=Number(m.width)||0,height=Number(m.height)||0,left=Number(m.left)||0,top=Number(m.top)||0;
  if(m.xMode==="right")left=pw-Number(m.right||0)-width;else if(m.xMode==="center")left=pw/2+Number(m.centerX||0)-width/2;else if(m.xMode==="stretch")width=Math.max(0,pw-Number(m.left||0)-Number(m.right||0));else if(m.xMode==="scale"){left=pw*Number(m.leftRatio||0);width=pw*Number(m.widthRatio||0)}
  if(m.yMode==="bottom")top=ph-Number(m.bottom||0)-height;else if(m.yMode==="center")top=ph/2+Number(m.centerY||0)-height/2;else if(m.yMode==="stretch")height=Math.max(0,ph-Number(m.top||0)-Number(m.bottom||0));else if(m.yMode==="scale"){top=ph*Number(m.topRatio||0);height=ph*Number(m.heightRatio||0)}
  if(m.preserveAspect&&Number(m.aspect)>0){const a=Number(m.aspect);if(m.xMode==="stretch"||m.xMode==="scale")height=width/a;else if(m.yMode==="stretch"||m.yMode==="scale")width=height*a}
  if(Number(m.minWidth)>0)width=Math.max(width,Number(m.minWidth));if(Number(m.maxWidth)>0)width=Math.min(width,Number(m.maxWidth));if(Number(m.minHeight)>0)height=Math.max(height,Number(m.minHeight));if(Number(m.maxHeight)>0)height=Math.min(height,Number(m.maxHeight));
  return {left,top,width,height};
}
export function applyConstraintModel(el,m){if(!el?.parentElement)return null;const p=el.parentElement,r=solveConstraintModel(m,p.clientWidth,p.clientHeight);if(!r)return null;const cs=el.ownerDocument.defaultView.getComputedStyle(p);if(cs.position==="static")p.style.position="relative";Object.assign(el.style,{position:"absolute",left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px",right:"auto",bottom:"auto"});return r}
