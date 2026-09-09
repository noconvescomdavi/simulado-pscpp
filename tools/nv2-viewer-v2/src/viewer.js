import {analyzeNV2} from "./nv2.js";
const q=s=>document.querySelector(s), file=q("#file"), c=q("#c"), ctx=c.getContext("2d");
let result=null, view={scale:1,ox:0,oy:0}, drag=null;
function resize(){const r=c.getBoundingClientRect();c.width=Math.max(1,Math.floor(r.width*devicePixelRatio));c.height=Math.max(1,Math.floor(r.height*devicePixelRatio));draw()}
addEventListener("resize",resize);resize();
file.onchange=async()=>{if(!file.files[0])return;q("#state").textContent="Analisando…";q("#state").className="warn";try{result=await analyzeNV2(file.files[0]);show();fit()}catch(e){q("#state").textContent="Erro: "+e.message;q("#state").className="bad"}};
q("#fit").onclick=fit;q("#showLines").onchange=draw;q("#showPoints").onchange=draw;
q("#export").onclick=()=>{if(!result)return;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:"application/json"}));a.download=(result.file.name||"nv2")+".diagnostic.json";a.click();URL.revokeObjectURL(a.href)};
function show(){
 const s=result.state==="unrecognized"?"NV2 não reconhecido com confiança":result.state==="decoded-partial-high"?"Geometria NV2 parcialmente reconhecida (alta confiança)":"Geometria NV2 parcialmente reconhecida";
 q("#state").textContent=s;q("#state").className=result.state==="unrecognized"?"bad":"ok";
 const b=result.best;
 if(b){q("#compat").innerHTML="<span class=\"ok\">"+[b.kind,b.endian||"",b.scale||"",b.order||""].join(" ")+"</span><br>score "+(b.score*100).toFixed(1)+"% · "+b.metrics.count+" vértices<br><span class=\"muted\">"+result.note+"</span>";}
 else{q("#compat").innerHTML="<span class=\"bad\">Nenhum decoder passou o limiar de 78%.</span><br><span class=\"muted\">"+result.note+"</span>";}
 const d={...result,best:b?{...b,points:"["+b.points.length+" pontos]"}:null,alternatives:result.alternatives.map(x=>({...x,points:"["+x.points.length+" pontos]"}))};q("#diag").textContent=JSON.stringify(d,null,2);
}
function fit(){if(!result?.best){view={scale:1,ox:0,oy:0};return draw()}const [minx,miny,maxx,maxy]=result.best.metrics.bbox,w=c.width,h=c.height,p=50*devicePixelRatio;const sx=(w-2*p)/Math.max(1e-9,maxx-minx),sy=(h-2*p)/Math.max(1e-9,maxy-miny);view.scale=Math.min(sx,sy);view.ox=p-minx*view.scale;view.oy=h-p+miny*view.scale;draw()}
function xy(p){return[p[0]*view.scale+view.ox,-p[1]*view.scale+view.oy]}
function draw(){ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle="#b8d9e4";ctx.fillRect(0,0,c.width,c.height);grid();const pts=result?.best?.points;if(!pts?.length)return;ctx.lineWidth=Math.max(1,devicePixelRatio);ctx.strokeStyle="#082c42";ctx.fillStyle="#0b3c57";if(q("#showLines").checked){ctx.beginPath();pts.forEach((p,i)=>{const [x,y]=xy(p);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()}if(q("#showPoints").checked){for(let i=0;i<pts.length;i+=Math.max(1,Math.floor(pts.length/5000))){const [x,y]=xy(pts[i]);ctx.fillRect(x-1,y-1,2,2)}}}
function grid(){ctx.strokeStyle="rgba(20,70,90,.18)";ctx.lineWidth=1;const step=120*devicePixelRatio;ctx.beginPath();for(let x=0;x<c.width;x+=step){ctx.moveTo(x,0);ctx.lineTo(x,c.height)}for(let y=0;y<c.height;y+=step){ctx.moveTo(0,y);ctx.lineTo(c.width,y)}ctx.stroke()}
c.onwheel=e=>{e.preventDefault();const f=e.deltaY<0?1.15:1/1.15,r=c.getBoundingClientRect(),mx=(e.clientX-r.left)*devicePixelRatio,my=(e.clientY-r.top)*devicePixelRatio;view.ox=mx-(mx-view.ox)*f;view.oy=my-(my-view.oy)*f;view.scale*=f;draw()};
c.onpointerdown=e=>{c.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,ox:view.ox,oy:view.oy}};
c.onpointermove=e=>{if(!drag)return;view.ox=drag.ox+(e.clientX-drag.x)*devicePixelRatio;view.oy=drag.oy+(e.clientY-drag.y)*devicePixelRatio;draw()};
c.onpointerup=()=>drag=null;