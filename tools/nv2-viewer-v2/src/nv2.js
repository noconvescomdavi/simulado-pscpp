const SCALES = [
  {name:"1e4", divisor:1e4},
  {name:"1e5", divisor:1e5},
  {name:"1e6", divisor:1e6},
  {name:"1e7", divisor:1e7},
  {name:"semicircle", divisor:2147483648/180}
];

export async function analyzeNV2(file){
  const buf = await file.arrayBuffer();
  const u8 = new Uint8Array(buf);
  const sig = asciiScan(u8, Math.min(u8.length, 4*1024*1024));
  const entropy = blockEntropy(u8, 65536, 64);
  const compressed = await findAndInflate(u8);
  const candidates = [];
  candidates.push(...scanInt32(u8, "raw"));
  for (let i=0;i<compressed.length;i++) candidates.push(...scanInt32(compressed[i].bytes, "deflate@"+compressed[i].offset));
  candidates.push(...scanFloat32(u8,"raw-f32"));
  candidates.sort((a,b)=>b.score-a.score);
  const best = candidates[0] || null;
  const accepted = best && best.score >= 0.78 && best.points.length >= 20;
  const state = accepted ? (best.score>=0.9 ? "decoded-partial-high" : "decoded-partial") : "unrecognized";
  return {
    file:{name:file.name,size:file.size},
    signature:sig,
    entropy,
    compressedBlocks:compressed.map(x=>({offset:x.offset,size:x.bytes.length})),
    state,
    best: accepted ? sanitize(best) : null,
    alternatives:candidates.slice(0,8).map(sanitize),
    note: accepted
      ? "Geometria parcial reconhecida por consistência espacial; objetos/simbologia Navionics ainda não são atribuídos."
      : "Nenhuma geometria atingiu o limiar de confiança. Nada será desenhado para evitar falso positivo."
  };
}

function asciiScan(u8, limit){
  const needles=["NAVIONICS","Navionics","NAVIONIC","CHART","SILVER","GOLD","PLATINUM"];
  const out=[];
  for(const n of needles){
    const b=[...n].map(c=>c.charCodeAt(0));
    outer: for(let i=0;i<=limit-b.length;i++){
      for(let j=0;j<b.length;j++) if(u8[i+j]!==b[j]) continue outer;
      out.push({text:n,offset:i}); if(out.length>20) break;
    }
  }
  return out;
}

function blockEntropy(u8, size, maxBlocks){
  const out=[]; const blocks=Math.min(Math.ceil(u8.length/size),maxBlocks);
  for(let k=0;k<blocks;k++){
    const s=k*size,e=Math.min(u8.length,s+size), freq=new Uint32Array(256);
    for(let i=s;i<e;i++) freq[u8[i]]++;
    let h=0,n=e-s;
    for(const f of freq) if(f){const p=f/n;h-=p*Math.log2(p);}
    out.push({offset:s,entropy:+h.toFixed(3)});
  }
  return out;
}

async function findAndInflate(u8){
  const out=[]; let attempts=0;
  for(let i=0;i<u8.length-2 && attempts<24;i++){
    if(u8[i]===0x78 && [0x01,0x5e,0x9c,0xda].includes(u8[i+1])){
      attempts++;
      try{
        const ds=new DecompressionStream("deflate");
        const stream=new Blob([u8.slice(i)]).stream().pipeThrough(ds);
        const ab=await new Response(stream).arrayBuffer();
        const bytes=new Uint8Array(ab);
        if(bytes.length>64 && bytes.length<128*1024*1024) out.push({offset:i,bytes});
      }catch{}
    }
  }
  return out;
}

function scanInt32(u8, source){
  const dv=new DataView(u8.buffer,u8.byteOffset,u8.byteLength);
  const results=[];
  const max=Math.min(u8.byteLength,64*1024*1024);
  for(const endian of [true,false]){
    for(const scale of SCALES){
      for(const order of ["lonlat","latlon"]){
        let run=[], bestRuns=[];
        for(let off=0;off+8<=max;off+=4){
          const a=dv.getInt32(off,endian)/scale.divisor;
          const b=dv.getInt32(off+4,endian)/scale.divisor;
          const lon=order==="lonlat"?a:b, lat=order==="lonlat"?b:a;
          const ok=Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90;
          if(ok){
            if(!run.length || near(run[run.length-1],[lon,lat])) run.push([lon,lat,off]);
            else {if(run.length>=12) bestRuns.push(run); run=[[lon,lat,off]];}
          } else {if(run.length>=12) bestRuns.push(run); run=[];}
        }
        if(run.length>=12) bestRuns.push(run);
        bestRuns.sort((x,y)=>y.length-x.length);
        for(const pts of bestRuns.slice(0,3)){
          const m=metrics(pts);
          const score=scoreMetrics(m);
          if(score>0.55) results.push({kind:"int32",source,endian:endian?"LE":"BE",scale:scale.name,order,score,metrics:m,points:pts});
        }
      }
    }
  }
  return results;
}

function scanFloat32(u8, source){
  const dv=new DataView(u8.buffer,u8.byteOffset,u8.byteLength), results=[];
  const max=Math.min(u8.byteLength,32*1024*1024);
  for(const endian of [true,false]) for(const order of ["lonlat","latlon"]){
    let run=[], runs=[];
    for(let off=0;off+8<=max;off+=4){
      const a=dv.getFloat32(off,endian),b=dv.getFloat32(off+4,endian);
      const lon=order==="lonlat"?a:b,lat=order==="lonlat"?b:a;
      const ok=Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90&&Math.abs(lon)+Math.abs(lat)>0.001;
      if(ok && (!run.length || near(run[run.length-1],[lon,lat]))) run.push([lon,lat,off]);
      else {if(run.length>=20) runs.push(run);run=ok?[[lon,lat,off]]:[];}
    }
    if(run.length>=20) runs.push(run);
    runs.sort((x,y)=>y.length-x.length);
    for(const pts of runs.slice(0,2)){
      const m=metrics(pts),score=scoreMetrics(m)-0.08;
      if(score>0.6) results.push({kind:"float32",source,endian:endian?"LE":"BE",order,score,metrics:m,points:pts});
    }
  }
  return results;
}

function near(prev,p){
  const dx=p[0]-prev[0],dy=p[1]-prev[1],d=Math.hypot(dx,dy);
  return d<=2.5 && d>1e-10;
}
function metrics(pts){
  let minx=Infinity,miny=Infinity,maxx=-Infinity,maxy=-Infinity,sum=0,small=0;
  for(let i=0;i<pts.length;i++){
    const [x,y]=pts[i];minx=Math.min(minx,x);miny=Math.min(miny,y);maxx=Math.max(maxx,x);maxy=Math.max(maxy,y);
    if(i){const d=Math.hypot(x-pts[i-1][0],y-pts[i-1][1]);sum+=d;if(d<0.25)small++;}
  }
  return {count:pts.length,bbox:[minx,miny,maxx,maxy],span:[maxx-minx,maxy-miny],avgStep:sum/Math.max(1,pts.length-1),smallStepRatio:small/Math.max(1,pts.length-1)};
}
function scoreMetrics(m){
  const count=Math.min(1,m.count/300);
  const continuity=Math.min(1,m.smallStepRatio/0.9);
  const spanOk=(m.span[0]<=40&&m.span[1]<=30&&m.span[0]+m.span[1]>1e-5)?1:0;
  const stepOk=m.avgStep<0.5?1:m.avgStep<1?0.7:0.2;
  return +(0.3*count+0.35*continuity+0.2*spanOk+0.15*stepOk).toFixed(4);
}
function sanitize(c){
  return {...c,score:+c.score.toFixed(4),points:c.points.slice(0,20000).map(p=>[p[0],p[1]])};
}
