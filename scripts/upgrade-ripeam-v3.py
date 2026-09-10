from pathlib import Path
import re, json

ROOT=Path('.')

def read(p): return (ROOT/p).read_text(encoding='utf-8')
def write(p,s): (ROOT/p).write_text(s,encoding='utf-8')

def must_replace(s,old,new,label):
    if old not in s: raise SystemExit(f'anchor not found: {label}')
    return s.replace(old,new,1)

# Shared V3 capabilities/helpers
pro=Path('app/admin/laboratorio-3d/editor-v3.js')
pro.write_text(r'''export const EDITOR_V3={
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
''',encoding='utf-8')

# Patch editor
p=Path('app/admin/laboratorio-3d/Admin3DEditor.js'); s=p.read_text(encoding='utf-8')
if 'editor-v3' not in s:
    s=must_replace(s,'import {RIPEAM_RULES,CONDITION_LABELS,PERIOD_LABELS,SERVICE_LABELS,SIDE_LABELS,getRule,getSemanticItem,semanticBreadcrumb,semanticLabel} from "./ripeam-semantic";',
'''import {RIPEAM_RULES,CONDITION_LABELS,PERIOD_LABELS,SERVICE_LABELS,SIDE_LABELS,getRule,getSemanticItem,semanticBreadcrumb,semanticLabel} from "./ripeam-semantic";\nimport {DEFAULT_LAYERS,MATERIAL_CHANNELS,NAMED_VIEWS,ensureV3Config,layerForObject,geometricRipeamIssues,occlusionCandidates} from "./editor-v3";''','editor import')

s=s.replace('config:{...clone(EMPTY.config),...(row.config||{}),settings:{...EMPTY.config.settings,...(row.config?.settings||{})}}','config:ensureV3Config({...clone(EMPTY.config),...(row.config||{}),settings:{...EMPTY.config.settings,...(row.config?.settings||{})}})')

if 'const geometricIssues=' not in s:
    anchor='''  const completeness=sceneCompleteness({semantic,objects:cfg.objects,stats,errors:validation.errors,warnings:validation.warnings});'''
    repl='''  const geometricIssues=geometricRipeamIssues(cfg.objects||[]);\n  const occlusionWarnings=occlusionCandidates(cfg.objects||[]);\n  const completeness=sceneCompleteness({semantic,objects:cfg.objects,stats,errors:[...validation.errors,...geometricIssues],warnings:[...validation.warnings,...occlusionWarnings]});'''
    s=must_replace(s,anchor,repl,'computed v3 issues')

# Add V3 state
state_anchor='''  const [preflight,setPreflight]=useState(null);\n  const fileRef=useRef(null);'''
if state_anchor in s:
    s=s.replace(state_anchor,'''  const [preflight,setPreflight]=useState(null);\n  const [isolateId,setIsolateId]=useState(null);\n  const [contextObject,setContextObject]=useState(null);\n  const [commandOpen,setCommandOpen]=useState(false);\n  const [commandQuery,setCommandQuery]=useState("");\n  const [viewportCanvas,setViewportCanvas]=useState(null);\n  const fileRef=useRef(null);''',1)

# keyboard command palette
needle='''      if(!editing&&e.key.toLowerCase()==="s")setMode("scale");'''
if needle in s and 'setCommandOpen' in s:
    s=s.replace(needle,needle+'\n      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setCommandOpen(v=>!v)}',1)

# helper funcs before duplicateScene
anchor='''  function duplicateScene(){'''
if 'function setNamedView(' not in s:
    funcs=r'''  function setNamedView(key){const v=NAMED_VIEWS[key];if(!v)return;mutate(x=>{x.config.editorCamera={position:[...v.position],target:[...v.target],fov:v.fov};x.config.settings={...(x.config.settings||{}),orthographicView:v.orthographic?key:null}});}
  function addCameraBookmark(){const cam=clone(cfg.editorCamera||cfg.camera);const name=window.prompt('Nome do bookmark de câmera','Vista '+((cfg.cameraBookmarks||[]).length+1));if(!name)return;mutate(x=>{x.config.cameraBookmarks=[...(x.config.cameraBookmarks||[]),{id:uid(),name,cam}]})}
  function applyCameraBookmark(b){mutate(x=>{x.config.editorCamera=clone(b.cam)})}
  function toggleLayer(id,key){mutate(x=>{x.config.layers=(x.config.layers||DEFAULT_LAYERS).map(l=>l.id===id?{...l,[key]:!l[key]}:l)})}
  function addCollection(){const name=window.prompt('Nome da collection','Nova collection');if(!name)return;const ids=selectedIds.length?selectedIds:(selected?[selected]:[]);mutate(x=>{x.config.collections=[...(x.config.collections||[]),{id:uid(),name,objectIds:ids}]})}
  function isolateSelected(){setIsolateId(v=>v===selected?null:selected||null)}
  function focusSelected(){if(!obj)return;const p=obj.position||[0,0,0];mutate(x=>{x.config.editorCamera={position:[p[0]+10,p[1]+5,p[2]+10],target:[...p],fov:38}})}
  function assignLayer(layerId){if(!selected)return;patchObject({layerId})}
'''
    s=s.replace(anchor,funcs+anchor,1)

# extend validation with geometric issues impossible due memo dependency; add at render separate. Preflight must block geo issues.
old='''    const pf={errors:[...validation.errors,...assetErrors.map(x=>"Asset indisponível: "+x.name)],warnings:[...validation.warnings],stats};'''
if old in s:
    s=s.replace(old,'''    const geo=geometricRipeamIssues(cfg.objects||[]);\n    const occ=occlusionCandidates(cfg.objects||[]);\n    const pf={errors:[...validation.errors,...geo,...assetErrors.map(x=>"Asset indisponível: "+x.name)],warnings:[...validation.warnings,...occ],stats};''',1)

# toolbar upgrades
toolbar_anchor='''          <button onClick={()=>setCompare(x=>!x)}>▥ Comparar</button>'''
if toolbar_anchor in s and 'Quad-view' not in s:
    s=s.replace(toolbar_anchor,toolbar_anchor+'''\n          <button className={cfg.settings?.quadView?styles.active:""} onClick={()=>mutate(x=>{x.config.settings.quadView=!x.config.settings.quadView})}>⊞ Quad-view</button>\n          <button className={isolateId?styles.active:""} onClick={isolateSelected} disabled={!selected}>◎ Isolar</button>\n          <button onClick={focusSelected} disabled={!selected}>⌖ Focar</button>\n          <select value={cfg.settings?.materialChannel||"final"} onChange={e=>mutate(x=>{x.config.settings.materialChannel=e.target.value})}>{MATERIAL_CHANNELS.map(c=><option key={c} value={c}>{c}</option>)}</select>\n          <select value={cfg.settings?.renderQuality||"high"} onChange={e=>mutate(x=>{x.config.settings.renderQuality=e.target.value})}><option value="low">Qualidade baixa</option><option value="medium">Qualidade média</option><option value="high">Qualidade alta</option><option value="ultra">Qualidade ultra</option></select>\n          <button className={cfg.settings?.mobilePreview?styles.active:""} onClick={()=>mutate(x=>{x.config.settings.mobilePreview=!x.config.settings.mobilePreview})}>▯ Mobile</button>''',1)

# named views bar after camera bar
cam='''        <div className={styles.cameraBar}>\n          <b>Câmera:</b>{Object.values(CAMERA_PRESETS).map(p=><button key={p.label} onClick={()=>setCameraPreset(p)}>{p.label}</button>)}<button onClick={saveStudentCamera}>Salvar câmera do aluno</button>\n        </div>'''
if cam in s and 'Vistas técnicas' not in s:
    s=s.replace(cam,cam+'''\n        <div className={styles.cameraBar}><b>Vistas técnicas:</b>{Object.entries(NAMED_VIEWS).map(([k,v])=><button key={k} onClick={()=>setNamedView(k)}>{v.label}</button>)}<button onClick={addCameraBookmark}>＋ Bookmark</button>{(cfg.cameraBookmarks||[]).map(b=><button key={b.id} onClick={()=>applyCameraBookmark(b)}>{b.name}</button>)}</div>''',1)

# layers/collections in left pane before asset health
left_anchor='''        <h3>ASSET HEALTH</h3>'''
if left_anchor in s and 'LAYERS / COLLECTIONS' not in s:
    block='''        <h3>LAYERS / COLLECTIONS</h3><div className={styles.healthList}>{(cfg.layers||DEFAULT_LAYERS).map(l=><p key={l.id}><button onClick={()=>toggleLayer(l.id,"visible")}>{l.visible!==false?"👁":"◌"}</button> <button onClick={()=>toggleLayer(l.id,"locked")}>{l.locked?"🔒":"🔓"}</button> <b>{l.label}</b></p>)}</div><div className={styles.miniActions}><button onClick={addCollection}>＋ Collection da seleção</button></div>{(cfg.collections||[]).map(c=><div key={c.id} className={styles.semanticSummary}><b>{c.name}</b> · {c.objectIds?.length||0} objetos</div>)}\n'''
    s=s.replace(left_anchor,block+left_anchor,1)

# object inspector layer/real scale/clipping
obj_anchor='''          <label>Anchor marítimo<select value={obj.anchorName||""} onChange={e=>patchObject({anchorName:e.target.value})}><option value="">Sem anchor</option>{MARITIME_ANCHORS.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label>'''
if obj_anchor in s and 'Layer<select' not in s:
    s=s.replace(obj_anchor,obj_anchor+'''\n          <label>Layer<select value={obj.layerId||layerForObject(obj)} onChange={e=>assignLayer(e.target.value)}>{(cfg.layers||DEFAULT_LAYERS).map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select></label>''',1)

model_anchor='''            <label>LOD mobile<input type="checkbox" checked={!!obj.lod?.enabled} onChange={e=>patchObject({lod:{...(obj.lod||{}),enabled:e.target.checked}})}/></label></>}'''
if model_anchor in s and 'Comprimento real' not in s:
    s=s.replace(model_anchor,'''            <label>LOD mobile<input type="checkbox" checked={!!obj.lod?.enabled} onChange={e=>patchObject({lod:{...(obj.lod||{}),enabled:e.target.checked}})}/></label><label>Comprimento real LOA (m)<input type="number" min="0" step=".1" value={obj.realDimensions?.loa??""} onChange={e=>patchObject({realDimensions:{...(obj.realDimensions||{}),loa:Number(e.target.value)||0}})}/></label><label>Boca (m)<input type="number" min="0" step=".1" value={obj.realDimensions?.beam??""} onChange={e=>patchObject({realDimensions:{...(obj.realDimensions||{}),beam:Number(e.target.value)||0}})}/></label><label>Calado (m)<input type="number" min="0" step=".1" value={obj.realDimensions?.draft??""} onChange={e=>patchObject({realDimensions:{...(obj.realDimensions||{}),draft:Number(e.target.value)||0}})}/></label></>}''',1)

# scene clipping/anchors settings
scene_anchor='''          <h4>Identidade RIPEAM</h4>'''
if scene_anchor in s and 'Plano de corte' not in s:
    s=s.replace(scene_anchor,'''          <h4>Viewport avançado</h4><div className={styles.inlineChecks}><label><input type="checkbox" checked={cfg.settings?.showAnchors!==false} onChange={e=>mutate(x=>{x.config.settings.showAnchors=e.target.checked})}/> Mostrar anchors</label><label><input type="checkbox" checked={!!cfg.settings?.clipEnabled} onChange={e=>mutate(x=>{x.config.settings.clipEnabled=e.target.checked})}/> Plano de corte</label></div>{cfg.settings?.clipEnabled&&<label>Altura do clipping Y<input type="range" min="-10" max="10" step=".1" value={cfg.settings?.clipY||0} onChange={e=>mutate(x=>{x.config.settings.clipY=Number(e.target.value)})}/></label>}\n          <h4>Identidade RIPEAM</h4>''',1)

# v3 validation display
val_anchor='''{!validation.errors.length&&!validation.warnings.length&&<p>✓ Cena coerente com o vínculo semântico configurado.</p>}'''
if val_anchor in s and 'geometricIssues.map' not in s:
    s=s.replace(val_anchor,'''{geometricIssues.map((w,i)=><p key={"g"+i}>✕ Geometria: {w}</p>)}{occlusionWarnings.map((w,i)=><p key={"o"+i}>⚠ Oclusão: {w}</p>)}{!validation.errors.length&&!validation.warnings.length&&!geometricIssues.length&&!occlusionWarnings.length&&<p>✓ Cena coerente com o vínculo semântico configurado.</p>}''',1)

# viewport props and quad view rendering
old='''          <Admin3DViewport scene={cfg} selectedId={selected} mode={mode} playhead={playhead} onSelect={setSelected} onTransform={(id,t)=>{if(id===selected)patchObject(t)}} onCameraChange={cam=>setScene(s=>({...s,config:{...s.config,editorCamera:cam}}))} onStats={setStats}/>'''
if old in s:
    new='''          <Admin3DViewport scene={cfg} selectedId={selected} isolateId={isolateId} mode={mode} playhead={playhead} onSelect={setSelected} onTransform={(id,t)=>{if(id===selected)patchObject(t)}} onCameraChange={cam=>setScene(s=>({...s,config:{...s.config,editorCamera:cam}}))} onStats={setStats} onCaptureReady={setViewportCanvas}/>'''
    s=s.replace(old,new,1)

# command palette near return root
ret='''  return <div className={styles.editorShell}>'''
if ret in s and 'commandOpen&&' not in s:
    commands='''  const commands=[['Salvar rascunho',()=>save(scene.status)],['Atualizar aluno',publishStudent],['Focar selecionado',focusSelected],['Isolar selecionado',isolateSelected],['Quad-view',()=>mutate(x=>{x.config.settings.quadView=!x.config.settings.quadView})],['Vista superior',()=>setNamedView('top')],['Vista bombordo',()=>setNamedView('port')],['Vista boreste',()=>setNamedView('starboard')],['Diagnosticar GLB',diagnoseCurrentAsset]].filter(([name])=>name.toLowerCase().includes(commandQuery.toLowerCase()));\n\n'''
    s=s.replace(ret,commands+ret,1)
    s=s.replace(ret,'''  return <div className={styles.editorShell}>{commandOpen&&<div className={styles.diffPanel}><b>COMMAND PALETTE · Ctrl+K</b><input autoFocus placeholder="Buscar comando..." value={commandQuery} onChange={e=>setCommandQuery(e.target.value)}/>{commands.map(([name,fn])=><button key={name} onClick={()=>{setCommandOpen(false);fn()}}>{name}</button>)}<button onClick={()=>setCommandOpen(false)}>Fechar</button></div>}''',1)

write('app/admin/laboratorio-3d/Admin3DEditor.js',s)

# Patch viewport
p=Path('app/admin/laboratorio-3d/Admin3DViewport.js'); s=p.read_text(encoding='utf-8')
if 'RENDER_QUALITIES' not in s:
    s=s.replace('import {versionRipeamAssetUrl} from "../../../lib/ripeam-asset-manifest";','import {versionRipeamAssetUrl} from "../../../lib/ripeam-asset-manifest";\nimport {RENDER_QUALITIES,NAMED_VIEWS,layerForObject} from "./editor-v3";')
s=s.replace('scene,selectedId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onCaptureReady,readOnly=false,playhead=0','scene,selectedId,isolateId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onCaptureReady,readOnly=false,playhead=0')
s=s.replace('propsRef.current={scene,selectedId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onCaptureReady,readOnly,playhead};','propsRef.current={scene,selectedId,isolateId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onCaptureReady,readOnly,playhead};')

# renderer settings quality + clipping
renderer='''      renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));'''
if renderer in s:
    s=s.replace(renderer,'''      const initialQuality=RENDER_QUALITIES[propsRef.current.scene?.settings?.renderQuality||"high"]||RENDER_QUALITIES.high;\n      renderer.setPixelRatio(Math.min(devicePixelRatio,initialQuality.pixelRatio));\n      renderer.localClippingEnabled=true;''',1)

# environment/settings effect add quality and clipping
needle='''    r.grid.visible=scene.settings?.showGrid!==false;'''
if needle in s and 'renderQuality' not in s[s.find(needle):s.find(needle)+1000]:
    s=s.replace(needle,needle+'''\n    const q=RENDER_QUALITIES[scene.settings?.mobilePreview?"low":(scene.settings?.renderQuality||"high")]||RENDER_QUALITIES.high;r.renderer.setPixelRatio(Math.min(devicePixelRatio,q.pixelRatio));\n    const plane=scene.settings?.clipEnabled?new r.THREE.Plane(new r.THREE.Vector3(0,-1,0),Number(scene.settings?.clipY||0)):null;\n    r.sc.traverse(o=>{const mats=Array.isArray(o.material)?o.material:[o.material];mats.filter(Boolean).forEach(m=>{m.clippingPlanes=plane?[plane]:null;m.clipShadows=!!plane;m.needsUpdate=true})});''',1)

# layer visibility/isolate after root.visible
needle='''      root.visible=data.visible!==false;'''
if needle in s and 'isolateId' not in s[s.find(needle):s.find(needle)+500]:
    s=s.replace(needle,'''      const layer=(scene.layers||[]).find(l=>l.id===layerForObject(data));\n      const isolated=propsRef.current.isolateId;\n      root.visible=data.visible!==false&&layer?.visible!==false&&(!isolated||isolated===data.id);''',1)

# anchor gizmos near bounds
bounds='''      if(scene.settings?.showBounds&&child){'''
if bounds in s and 'showAnchors' not in s[s.find(bounds)-300:s.find(bounds)+700]:
    giz='''      if(scene.settings?.showAnchors&&data.type==="model"&&child){try{const box=new r.THREE.Box3().setFromObject(child),min=box.min,max=box.max,mid=box.getCenter(new r.THREE.Vector3()),defs=[['bow',mid.x,mid.y,max.z],['stern',mid.x,mid.y,min.z],['port',min.x,mid.y,mid.z],['starboard',max.x,mid.y,mid.z],['masthead',mid.x,max.y,mid.z],['waterline',mid.x,0,mid.z]];for(const [name,x,y,z] of defs){const a=new r.THREE.Mesh(new r.THREE.SphereGeometry(.08,10,8),new r.THREE.MeshBasicMaterial({color:0x22d3ee,depthTest:false}));a.position.set(x,y,z);a.renderOrder=10;a.userData.editorHelper=true;a.userData.anchorName=name;root.add(a)}}catch{}}\n'''
    s=s.replace(bounds,giz+bounds,1)

# material channels in applyMaterial before needsUpdate
anchor='''          if(scene.settings?.wireframe&&"wireframe" in m)m.wireframe=true;'''
if anchor in s and 'materialChannel' not in s[s.find(anchor)-200:s.find(anchor)+1200]:
    channel=r'''          const channel=scene.settings?.materialChannel||'final';
          if(channel!=='final'){
            if(channel==='baseColor'){m.color?.set?.('#ffffff');if('map' in m)m.map=m.map||null;if('normalMap' in m)m.normalMap=null;if('roughnessMap' in m)m.roughnessMap=null;if('metalnessMap' in m)m.metalnessMap=null;if('aoMap' in m)m.aoMap=null;if('emissiveMap' in m)m.emissiveMap=null;}
            else if(channel==='normal'){if('map' in m)m.map=m.normalMap||null;m.color?.set?.('#ffffff');}
            else if(channel==='roughness'){if('map' in m)m.map=m.roughnessMap||null;m.color?.set?.('#ffffff');if('roughness' in m)m.roughness=1;if('metalness' in m)m.metalness=0;}
            else if(channel==='metalness'){if('map' in m)m.map=m.metalnessMap||null;m.color?.set?.('#ffffff');if('metalness' in m)m.metalness=1;}
            else if(channel==='ao'){if('map' in m)m.map=m.aoMap||null;m.color?.set?.('#ffffff');}
            else if(channel==='emissive'){if('map' in m)m.map=m.emissiveMap||null;m.color?.set?.('#ffffff');}
            else if(channel==='uv'){m.wireframe=true;m.map=null;m.normalMap=null;m.color?.set?.('#69d2ff');}
            else if(channel==='normals'){m.wireframe=false;m.map=null;m.normalMap=null;m.color?.set?.('#7dd3fc');m.metalness=0;m.roughness=1;}
          }
'''
    s=s.replace(anchor,channel+anchor,1)

# dependencies include layers/isolate/material channel/quality/clip
old='] ,[scene.objects,scene.settings?.showSectors,scene.settings?.showBounds,scene.settings?.showAxes,scene.settings?.wireframe,scene.settings?.xray]);'
# exact likely no space; do replace safer
s=s.replace('},[scene.objects,scene.settings?.showSectors,scene.settings?.showBounds,scene.settings?.showAxes,scene.settings?.wireframe,scene.settings?.xray]);','},[scene.objects,scene.layers,scene.settings?.showSectors,scene.settings?.showBounds,scene.settings?.showAxes,scene.settings?.showAnchors,scene.settings?.wireframe,scene.settings?.xray,scene.settings?.materialChannel,isolateId]);')
write('app/admin/laboratorio-3d/Admin3DViewport.js',s)

# Regression guard script: fails if known textured GLB suddenly loses textures/materials.
Path('scripts/check-ripeam-glb-regression.mjs').write_text(r'''import fs from 'node:fs';import path from 'node:path';
const dir='public/models/ripeam';
function parseGlb(file){const b=fs.readFileSync(file);if(b.toString('utf8',0,4)!=='glTF')throw new Error('GLB inválido: '+file);let off=12,json=null;while(off+8<=b.length){const len=b.readUInt32LE(off),type=b.readUInt32LE(off+4);if(type===0x4E4F534A){json=JSON.parse(b.toString('utf8',off+8,off+8+len));break}off+=8+len}if(!json)throw new Error('JSON chunk ausente: '+file);return {materials:(json.materials||[]).length,textures:(json.textures||[]).length,images:(json.images||[]).length,meshes:(json.meshes||[]).length};}
const expected={
  'Tugboat.glb':{materials:1,textures:1},'barge.glb':{materials:1,textures:1},'bulk_carrier.glb':{materials:1,textures:1},'fishing.glb':{materials:1,textures:1},'hidroavião.glb':{materials:1,textures:1},'navy_remoção_de_minas.glb':{materials:1,textures:1},'pilot_boat.glb':{materials:1,textures:1},'sailboat.glb':{materials:1,textures:1}
};
let bad=0;for(const [name,min] of Object.entries(expected)){const f=path.join(dir,name);if(!fs.existsSync(f)){console.error('MISSING',name);bad++;continue}const x=parseGlb(f);console.log(name,x);if(x.materials<min.materials||x.textures<min.textures){console.error('REGRESSION: textures/materials lost in '+name);bad++;}}if(bad)process.exit(1);console.log('RIPEAM GLB regression guard OK');
''',encoding='utf-8')

print('RIPEAM V3 PATCHED')
