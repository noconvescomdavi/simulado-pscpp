export const TIDE_STATION={name:"Ilha Fiscal",lat:-22.8966667,lon:-43.1666667,timezone:"America/Sao_Paulo",meanLevel:0.73,chart:"1515"};
export function interpolateTide(events,when){
 if(!Array.isArray(events)||events.length<2)return null;
 const t=+new Date(when), sorted=[...events].sort((a,b)=>+new Date(a.time)-+new Date(b.time));
 let a=sorted[0],b=sorted[1];for(let i=0;i<sorted.length-1;i++){if(t>=+new Date(sorted[i].time)&&t<=+new Date(sorted[i+1].time)){a=sorted[i];b=sorted[i+1];break}}
 const span=+new Date(b.time)-+new Date(a.time);if(span<=0)return a.height;
 const p=Math.max(0,Math.min(1,(t-+new Date(a.time))/span));
 const eased=(1-Math.cos(Math.PI*p))/2;
 return a.height+(b.height-a.height)*eased;
}