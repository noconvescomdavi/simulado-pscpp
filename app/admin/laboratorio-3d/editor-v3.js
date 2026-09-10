export const EDITOR_V3={
  layers:true,collections:true,quadView:true,orthographicViews:true,isolate:true,
  materialChannels:true,geometryDebug:true,anchorGizmos:true,geometricRipeamValidation:true,
  cameraBookmarks:true,renderQuality:true,mobilePreview:true,assetHashAudit:true,regressionGuard:true,
  clippingPlane:true,realScale:true,contextActions:true,commandPalette:true
};

export const DEFAULT_LAYERS=[
  {id:'models',label:'Embarcações',visible:true,locked:false},
  {id:'lights',label:'Luzes RIPEAM',visible:true,locked:false},
  {id:'day-shapes',label:'Marcas diurnas',visible:true,locked:false},
  {id:'cis',label:'Bandeiras CIS',visible:true,locked:false},
  {id:'didactic',label:'Hotspots / didática',visible:true,locked:false},
  {id:'helpers',label:'Auxiliares',visible:true,locked:false}
];
export const MATERIAL_CHANNELS=['final','baseColor','normal','roughness','metalness','ao','emissive','uv','normals'];
export const RENDER_QUALITIES={low:{pixelRatio:1,shadows:false},medium:{pixelRatio:1.25,shadows:false},high:{pixelRatio:1.7,shadows:true},ultra:{pixelRatio:2,shadows:true}};
export const NAMED_VIEWS={
  perspective:{label:'Perspectiva',position:[14,7,15],target:[0,1,0],fov:43,orthographic:false},
  bow:{label:'Proa',position:[0,3,18],target:[0,2,0],fov:35,orthographic:true},
  stern:{label:'Popa',position:[0,3,-18],target:[0,2,0],fov:35,orthographic:true},
  port:{label:'Través BB',position:[-18,3,0],target:[0,2,0],fov:35,orthographic:true},
  starboard:{label:'Través BE',position:[18,3,0],target:[0,2,0],fov:35,orthographic:true},
  top:{label:'Superior',position:[0,24,0.01],target:[0,0,0],fov:35,orthographic:true}
};
export function layerForObject(o={}){
  if(o.layerId)return o.layerId;
  if(o.type==='model')return 'models';
  if(String(o.type||'').includes('Light'))return 'lights';
  if(o.type==='shape')return 'day-shapes';
  if(o.type==='flag'||String(o.category||'').toLowerCase().includes('cis'))return 'cis';
  if(o.type==='hotspot')return 'didactic';
  return 'helpers';
}
export function ensureV3Config(config={}){
  return {...config,layers:Array.isArray(config.layers)&&config.layers.length?config.layers:DEFAULT_LAYERS.map(x=>({...x})),collections:Array.isArray(config.collections)?config.collections:[],cameraBookmarks:Array.isArray(config.cameraBookmarks)?config.cameraBookmarks:[],settings:{...(config.settings||{}),materialChannel:config.settings?.materialChannel||'final',renderQuality:config.settings?.renderQuality||'high',quadView:!!config.settings?.quadView,showAnchors:config.settings?.showAnchors!==false,mobilePreview:!!config.settings?.mobilePreview,clipEnabled:!!config.settings?.clipEnabled,clipY:Number(config.settings?.clipY||0)}};
}
export function geometricRipeamIssues(objects=[]){
  const out=[],lights=objects.filter(o=>String(o.type||'').includes('Light'));
  const byPreset=k=>lights.filter(o=>o.lightPreset===k);
  const p=byPreset('port'),s=byPreset('starboard'),stern=byPreset('stern'),mast=byPreset('masthead');
  for(const l of p)if(Number(l.position?.[0]||0)>0.25)out.push(l.name+': luz de bombordo está no lado de boreste do eixo X.');
  for(const l of s)if(Number(l.position?.[0]||0)<-0.25)out.push(l.name+': luz de boreste está no lado de bombordo do eixo X.');
  for(const l of stern)if(Number(l.position?.[2]||0)>0.5)out.push(l.name+': luz de alcançado está excessivamente avante do centro da cena.');
  if(mast.length>1){const ys=mast.map(x=>Number(x.position?.[1]||0)).sort((a,b)=>b-a);for(let i=1;i<ys.length;i++)if(Math.abs(ys[i-1]-ys[i])<0.25)out.push('Luzes de mastro com separação vertical muito pequena para leitura didática.');}
  for(const l of lights){if(l.anchorName==='port'&&Number(l.position?.[0]||0)>0.25)out.push(l.name+': anchor BB diverge da posição X.');if(l.anchorName==='starboard'&&Number(l.position?.[0]||0)<-0.25)out.push(l.name+': anchor BE diverge da posição X.');}
  return out;
}
export function duplicateHashGroups(assets=[],hashes={}){
  const m=new Map();for(const a of assets){const h=hashes[String(a.url||'').split('?')[0]]||a.metadata?.sha256;if(!h)continue;if(!m.has(h))m.set(h,[]);m.get(h).push(a)}return [...m.entries()].filter(([,arr])=>arr.length>1);
}
export function occlusionCandidates(objects=[]){
  const models=objects.filter(o=>o.type==='model'&&o.visible!==false),lights=objects.filter(o=>String(o.type||'').includes('Light')&&o.visible!==false),out=[];
  for(const l of lights)for(const m of models){const lp=l.position||[0,0,0],mp=m.position||[0,0,0];const dx=Math.abs(lp[0]-mp[0]),dy=lp[1]-mp[1],dz=Math.abs(lp[2]-mp[2]);if(dx<1.2&&dz<2.5&&dy<1.2)out.push(l.name+': possível oclusão pelo modelo '+m.name+'.');}
  return out;
}
