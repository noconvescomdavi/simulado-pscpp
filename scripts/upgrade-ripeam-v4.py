from pathlib import Path
import re

def rw(path):
    p=Path(path);return p,p.read_text(encoding='utf-8')
def save(p,s):p.write_text(s,encoding='utf-8')
def rep(s,old,new,label):
    if old not in s: raise SystemExit('anchor missing: '+label)
    return s.replace(old,new,1)

# ---------- Editor ----------
p,s=rw('app/admin/laboratorio-3d/Admin3DEditor.js')
if 'RIPEAM_ASSET_HASHES' not in s:
    s=rep(s,'import {DEFAULT_LAYERS,MATERIAL_CHANNELS,NAMED_VIEWS,ensureV3Config,layerForObject,geometricRipeamIssues,occlusionCandidates} from "./editor-v3";',
'''import {DEFAULT_LAYERS,MATERIAL_CHANNELS,NAMED_VIEWS,ensureV3Config,layerForObject,geometricRipeamIssues,occlusionCandidates,duplicateHashGroups} from "./editor-v3";\nimport {RIPEAM_ASSET_HASHES,versionRipeamAssetUrl} from "../../../lib/ripeam-asset-manifest";''','imports')

# Fix V3 state bug + V4 state
anchor='''  const [preflight,setPreflight]=useState(null);\n  const [loadProgress,setLoadProgress]=useState({});'''
if anchor in s and 'const [isolateId' not in s:
    s=s.replace(anchor,'''  const [preflight,setPreflight]=useState(null);\n  const [isolateId,setIsolateId]=useState(null);\n  const [commandOpen,setCommandOpen]=useState(false);\n  const [commandQuery,setCommandQuery]=useState("");\n  const [contextMenu,setContextMenu]=useState(null);\n  const [modelBounds,setModelBounds]=useState({});\n  const [captureApi,setCaptureApi]=useState(null);\n  const [loadProgress,setLoadProgress]=useState({});''',1)

# Ctrl+K actual handler
needle='''      if(!editing&&e.key.toLowerCase()==="s")setMode("scale");'''
if needle in s and 'e.key.toLowerCase()==="k"' not in s:
    s=s.replace(needle,needle+'\n      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setCommandOpen(v=>!v)}\n      if(e.key==="Escape"){setContextMenu(null);setCommandOpen(false)}',1)

# Advanced functions
anchor='''  function duplicateScene(){'''
if 'function autoRigAnchors' not in s:
    funcs=r'''  function autoRigAnchors(){
    if(!obj||obj.type!=='model'){setStatus('Selecione uma embarcação/modelo.');return}
    const b=modelBounds[obj.id];if(!b){setStatus('Aguarde o modelo terminar de carregar para detectar os anchors.');return}
    const {min,max,center}=b;
    const anchors={bow:[center[0],center[1],max[2]],stern:[center[0],center[1],min[2]],port:[min[0],center[1],center[2]],starboard:[max[0],center[1],center[2]],masthead:[center[0],max[1],center[2]],foremast:[center[0],max[1]*.92,(center[2]+max[2])*.5],aftermast:[center[0],max[1]*.85,(center[2]+min[2])*.5],waterline:[center[0],0,center[2]],'yard-port':[min[0]*.7,max[1]*.8,center[2]],'yard-starboard':[max[0]*.7,max[1]*.8,center[2]],'flag-halyard':[center[0],max[1]*.9,center[2]]};
    patchObject({anchors});setStatus('Auto-rig marítimo criado a partir do bounding box. Revise os pontos antes de publicar.');
  }
  function snapSelectedToAnchor(){
    if(!obj?.parentId||!obj.anchorName){setStatus('Defina um objeto pai e um anchor marítimo.');return}
    const parent=cfg.objects.find(x=>x.id===obj.parentId),p=parent?.anchors?.[obj.anchorName];if(!p){setStatus('O objeto pai não possui este anchor. Execute Auto-rig anchors no modelo pai.');return}
    patchObject({position:[...p]});setStatus('Objeto encaixado no anchor '+obj.anchorName+'.');
  }
  function exportScreenshot4K(){
    try{const data=captureApi?.capture?.(3840,2160);if(!data)throw new Error('viewport indisponível');const a=document.createElement('a');a.href=data;a.download=(scene.scene_key||'ripeam')+'-4k.png';a.click();setStatus('Screenshot 4K exportado.')}catch(e){setStatus('Falha ao exportar screenshot: '+String(e?.message||e))}
  }
  function exportScenePackage(){
    const urls=[...new Set((cfg.objects||[]).map(o=>o.assetUrl).filter(Boolean))],deps=urls.map(url=>({url,versionedUrl:versionRipeamAssetUrl(url),sha:RIPEAM_ASSET_HASHES[String(url).split('?')[0]]||null}));
    const blob=new Blob([JSON.stringify({format:'ESTIBORDO-RIPEAM-SCENE',version:1,exportedAt:new Date().toISOString(),scene,dependencies:deps},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(scene.scene_key||'scene')+'.ripeam.json';a.click();URL.revokeObjectURL(a.href);setStatus('Pacote de cena exportado com dependências e hashes.');
  }
  async function cacheSceneOffline(){
    try{if(!('caches' in window))throw new Error('Cache Storage não suportado');const c=await caches.open('estibordo-ripeam-editor-v1');const urls=[...new Set((cfg.objects||[]).map(o=>o.assetUrl).filter(Boolean).map(versionRipeamAssetUrl))];for(const url of urls)await c.add(new Request(url,{cache:'reload'}));setStatus(urls.length+' asset(s) preparados para edição offline neste navegador.')}catch(e){setStatus('Falha ao preparar offline: '+String(e?.message||e))}
  }
  async function exportVideo(){
    const canvas=captureCanvasRef.current;if(!canvas?.captureStream||typeof MediaRecorder==='undefined'){setStatus('Gravação de vídeo não suportada neste navegador.');return}
    try{const stream=canvas.captureStream(30),types=['video/mp4;codecs=avc1','video/webm;codecs=vp9','video/webm'];const mime=types.find(t=>MediaRecorder.isTypeSupported?.(t))||'';const rec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined),chunks=[];rec.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};rec.onstop=()=>{const blob=new Blob(chunks,{type:mime||'video/webm'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(scene.scene_key||'ripeam')+(mime.includes('mp4')?'.mp4':'.webm');a.click();URL.revokeObjectURL(a.href);stream.getTracks().forEach(t=>t.stop());setStatus('Vídeo do viewport exportado.')};setPlaying(true);setPlayhead(0);rec.start();setStatus('Gravando viewport por 10 segundos...');setTimeout(()=>{if(rec.state!=='inactive')rec.stop()},10000)}catch(e){setStatus('Falha na gravação: '+String(e?.message||e))}
  }
  function quadScene(key){const v=NAMED_VIEWS[key];return {...cfg,editorCamera:{position:[...v.position],target:[...v.target],fov:v.fov},settings:{...cfg.settings,orthographicView:v.orthographic?key:null,quadView:false}}}
'''
    s=s.replace(anchor,funcs+anchor,1)

# Computed deps/duplicates/orphans
anchor='''  const progress=String(cfg.objects?.length||0)+" objetos · "+String(cfg.cards?.length||0)+" cards · "+completeness+"% completo";'''
if anchor in s and 'const sceneDependencies=' not in s:
    s=s.replace(anchor,anchor+'''\n  const sceneDependencies=[...new Set((cfg.objects||[]).map(o=>o.assetUrl).filter(Boolean))];\n  const duplicateAssets=duplicateHashGroups(assets,RIPEAM_ASSET_HASHES);\n  const orphanAssets=assets.filter(a=>!(usage[a.url]||0));''',1)

# Commands more complete
old="const commands=[['Salvar rascunho',()=>save(scene.status)],['Atualizar aluno',publishStudent],['Focar selecionado',focusSelected],['Isolar selecionado',isolateSelected],['Quad-view',()=>mutate(x=>{x.config.settings.quadView=!x.config.settings.quadView})],['Vista superior',()=>setNamedView('top')],['Vista bombordo',()=>setNamedView('port')],['Vista boreste',()=>setNamedView('starboard')],['Diagnosticar GLB',diagnoseCurrentAsset]].filter(([name])=>name.toLowerCase().includes(commandQuery.toLowerCase()));"
if old in s:
    s=s.replace(old,"const commands=[['Salvar rascunho',()=>save(scene.status)],['Atualizar aluno',publishStudent],['Focar selecionado',focusSelected],['Isolar selecionado',isolateSelected],['Auto-rig anchors',autoRigAnchors],['Encaixar no anchor',snapSelectedToAnchor],['Quad-view',()=>mutate(x=>{x.config.settings.quadView=!x.config.settings.quadView})],['Vista superior',()=>setNamedView('top')],['Vista bombordo',()=>setNamedView('port')],['Vista boreste',()=>setNamedView('starboard')],['Diagnosticar GLB',diagnoseCurrentAsset],['Screenshot 4K',exportScreenshot4K],['Exportar pacote',exportScenePackage],['Preparar offline',cacheSceneOffline],['Gravar vídeo',exportVideo]].filter(([name])=>name.toLowerCase().includes(commandQuery.toLowerCase()));",1)

# Context menu overlay after command palette
root='''  return <div className={styles.editorShell}>{commandOpen&&<div className={styles.diffPanel}><b>COMMAND PALETTE · Ctrl+K</b><input autoFocus placeholder="Buscar comando..." value={commandQuery} onChange={e=>setCommandQuery(e.target.value)}/>{commands.map(([name,fn])=><button key={name} onClick={()=>{setCommandOpen(false);fn()}}>{name}</button>)}<button onClick={()=>setCommandOpen(false)}>Fechar</button></div>}'''
if root in s and 'contextMenu&&' not in s:
    s=s.replace(root,root+'''{contextMenu&&<div style={{position:"fixed",left:contextMenu.x,top:contextMenu.y,zIndex:99999,background:"#0b1824",border:"1px solid #2b5269",borderRadius:8,padding:6,display:"grid",gap:4,minWidth:180}}><button onClick={()=>{setSelected(contextMenu.id);setSelectedIds([contextMenu.id]);setContextMenu(null);setMode("translate")}}>Mover</button><button onClick={()=>{setSelected(contextMenu.id);setSelectedIds([contextMenu.id]);setContextMenu(null);setMode("rotate")}}>Rotacionar</button><button onClick={()=>{setSelected(contextMenu.id);setSelectedIds([contextMenu.id]);setContextMenu(null);duplicateObject()}}>Duplicar</button><button onClick={()=>{setSelected(contextMenu.id);setSelectedIds([contextMenu.id]);setContextMenu(null);setIsolateId(contextMenu.id)}}>Isolar</button><button onClick={()=>setContextMenu(null)}>Fechar</button></div>}''',1)

# Outliner contextmenu
old='''onClick={e=>selectOutlinerObject(e,o.id)} style={{paddingLeft:8+(o.parentId?14:0)}}'''
if old in s:
    s=s.replace(old,'''onClick={e=>selectOutlinerObject(e,o.id)} onContextMenu={e=>{e.preventDefault();setSelected(o.id);setSelectedIds([o.id]);setContextMenu({id:o.id,x:e.clientX,y:e.clientY})}} style={{paddingLeft:8+(o.parentId?14:0)}}''')

# Toolbar Safe Performance
needle='''          <button className={cfg.settings?.mobilePreview?styles.active:""} onClick={()=>mutate(x=>{x.config.settings.mobilePreview=!x.config.settings.mobilePreview})}>▯ Mobile</button>'''
if needle in s and 'Safe FPS' not in s:
    s=s.replace(needle,needle+'''\n          <button className={cfg.settings?.safePerformance?styles.active:""} onClick={()=>mutate(x=>{x.config.settings.safePerformance=!x.config.settings.safePerformance})}>⚡ Safe FPS</button>''',1)

# Replace viewport render with real quad + capture props
start='''        {Object.keys(loadProgress).length>0&&<div className={styles.materialHint}>Carregamento: {Object.values(loadProgress).slice(-4).map(p=>p.name+" "+(p.percent??"…")+"%").join(" · ")}</div>}{bottleneckHints(stats).length>0&&<div className={styles.warnings}><b>Profiler profissional</b>{bottleneckHints(stats).map((h,i)=><p key={i}>⚠ {h}</p>)}</div>}<div className={compare?styles.compareGrid:styles.singleViewport}>\n          <div onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="copy"}} onDrop={e=>{e.preventDefault();try{const a=JSON.parse(e.dataTransfer.getData("application/x-ripeam-asset")||"null");if(a?.url)addObject({name:a.name,assetUrl:a.url,assetType:a.type||"glb",type:"model",normalize:true,material:{mode:"original"}})}catch{}}}><Admin3DViewport scene={cfg} selectedId={selected} mode={mode} playhead={playhead} onSelect={setSelected} onTransform={(id,t)=>{if(id===selected)patchObject(t)}} onCameraChange={cam=>setScene(s=>({...s,config:{...s.config,editorCamera:cam}}))} onStats={setStats} onLoadProgress={p=>setLoadProgress(x=>({...x,[p.id]:p}))} onMaterialInventory={setMaterialInventory} onCaptureReady={canvas=>{captureCanvasRef.current=canvas}}/></div>\n          {compare&&<Admin3DViewport scene={{...cfg,settings:{...cfg.settings,previewMode:cfg.settings.previewMode==="day"?"night":"day"}}} readOnly playhead={playhead} onStats={()=>{}}/>}{abCompare&&<Admin3DViewport scene={{...cfg,objects:(cfg.objects||[]).map(o=>o.id===abCompare.selectedId?{...o,name:abCompare.candidate.name,assetUrl:abCompare.candidate.url,assetType:"glb"}:o)}} readOnly playhead={playhead} onStats={()=>{}}/>}\n        </div>'''
if start in s:
    repl='''        {Object.keys(loadProgress).length>0&&<div className={styles.materialHint}>Carregamento: {Object.values(loadProgress).slice(-4).map(p=>p.name+" "+(p.percent??"…")+"%").join(" · ")}</div>}{bottleneckHints(stats).length>0&&<div className={styles.warnings}><b>Profiler profissional</b>{bottleneckHints(stats).map((h,i)=><p key={i}>⚠ {h}</p>)}</div>}{cfg.settings?.quadView?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"minmax(280px,1fr) minmax(280px,1fr)",gap:6,minHeight:600}}>{[["perspective","Perspectiva"],["top","Superior"],["port","Través BB"],["starboard","Través BE"]].map(([key,label],i)=><div key={key} style={{position:"relative",minHeight:280}}><b style={{position:"absolute",zIndex:5,left:8,top:8,background:"#06131ddd",padding:"3px 7px",borderRadius:5}}>{label}</b><Admin3DViewport key={key} scene={quadScene(key)} selectedId={selected} isolateId={isolateId} mode={mode} playhead={playhead} readOnly={i!==0} onSelect={i===0?setSelected:undefined} onTransform={i===0?((id,t)=>{if(id===selected)patchObject(t)}):undefined} onStats={i===0?setStats:()=>{}} onModelBounds={(id,b)=>setModelBounds(x=>({...x,[id]:b}))} onCaptureReady={i===0?canvas=>{captureCanvasRef.current=canvas}:undefined} onCaptureApi={i===0?setCaptureApi:undefined}/></div>)}</div>:<div className={compare?styles.compareGrid:styles.singleViewport}><div onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="copy"}} onDrop={e=>{e.preventDefault();try{const a=JSON.parse(e.dataTransfer.getData("application/x-ripeam-asset")||"null");if(a?.url)addObject({name:a.name,assetUrl:a.url,assetType:a.type||"glb",type:"model",normalize:true,material:{mode:"original"}})}catch{}}}><Admin3DViewport key={cfg.settings?.orthographicView||"perspective"} scene={cfg} selectedId={selected} isolateId={isolateId} mode={mode} playhead={playhead} onSelect={setSelected} onTransform={(id,t)=>{if(id===selected)patchObject(t)}} onCameraChange={cam=>setScene(s=>({...s,config:{...s.config,editorCamera:cam}}))} onStats={setStats} onLoadProgress={p=>setLoadProgress(x=>({...x,[p.id]:p}))} onMaterialInventory={setMaterialInventory} onModelBounds={(id,b)=>setModelBounds(x=>({...x,[id]:b}))} onCaptureReady={canvas=>{captureCanvasRef.current=canvas}} onCaptureApi={setCaptureApi}/></div>{compare&&<Admin3DViewport scene={{...cfg,settings:{...cfg.settings,previewMode:cfg.settings.previewMode==="day"?"night":"day"}}} readOnly playhead={playhead} onStats={()=>{}}/>}{abCompare&&<Admin3DViewport scene={{...cfg,objects:(cfg.objects||[]).map(o=>o.id===abCompare.selectedId?{...o,name:abCompare.candidate.name,assetUrl:abCompare.candidate.url,assetType:"glb"}:o)}} readOnly playhead={playhead} onStats={()=>{}}/>}</div>}'''
    s=s.replace(start,repl,1)
else:
    raise SystemExit('viewport render block not found')

# Export toolbar buttons after camera technical bar
cam='''        <div className={styles.cameraBar}><b>Vistas técnicas:</b>{Object.entries(NAMED_VIEWS).map(([k,v])=><button key={k} onClick={()=>setNamedView(k)}>{v.label}</button>)}<button onClick={addCameraBookmark}>＋ Bookmark</button>{(cfg.cameraBookmarks||[]).map(b=><button key={b.id} onClick={()=>applyCameraBookmark(b)}>{b.name}</button>)}</div>'''
if cam in s and 'Screenshot 4K' not in s[s.find(cam):s.find(cam)+1000]:
    s=s.replace(cam,cam+'''\n        <div className={styles.cameraBar}><b>Saída:</b><button onClick={exportScreenshot4K}>Screenshot 4K</button><button onClick={exportVideo}>Gravar 10s</button><button onClick={exportScenePackage}>Exportar pacote</button><button onClick={cacheSceneOffline}>Preparar offline</button></div>''',1)

# Auto anchors / snap / per-object wireframe controls
anchor='''          <label>Layer<select value={obj.layerId||layerForObject(obj)} onChange={e=>assignLayer(e.target.value)}>{(cfg.layers||DEFAULT_LAYERS).map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select></label>'''
if anchor in s and 'Encaixar no anchor' not in s[s.find(anchor):s.find(anchor)+1200]:
    s=s.replace(anchor,anchor+'''\n          <div className={styles.miniActions}>{obj.type==="model"&&<button onClick={autoRigAnchors}>Auto-rig anchors</button>}{obj.parentId&&obj.anchorName&&<button onClick={snapSelectedToAnchor}>Encaixar no anchor</button>}<button onClick={()=>patchObject({wireframe:!obj.wireframe})}>{obj.wireframe?"Sólido":"Wireframe"} por objeto</button></div>''',1)

# Better sector visual editing + standardized presets
light='<label>Setor (°)<input type="number" min="0" max="360" step=".5" value={obj.sector||360} onChange={e=>patchObject({sector:Number(e.target.value)})}/></label><label>Rumo do setor (°)<input type="number" value={obj.heading||0} onChange={e=>patchObject({heading:Number(e.target.value)})}/></label>'
if light in s:
    s=s.replace(light,'''<label>Setor luminoso (°)<input type="range" min="1" max="360" step=".5" value={obj.sector||360} onChange={e=>patchObject({sector:Number(e.target.value)})}/><small>{Number(obj.sector||360).toFixed(1)}°</small></label><div className={styles.miniActions}>{[112.5,135,225,360].map(v=><button key={v} onClick={()=>patchObject({sector:v})}>{v}°</button>)}</div><label>Rumo do setor (°)<input type="range" min="-180" max="180" step=".5" value={obj.heading||0} onChange={e=>patchObject({heading:Number(e.target.value)})}/><small>{Number(obj.heading||0).toFixed(1)}°</small></label>''',1)

# Scene advanced: safe performance and dependency graph
anchor='''          <h4>Viewport avançado</h4><div className={styles.inlineChecks}><label><input type="checkbox" checked={cfg.settings?.showAnchors!==false} onChange={e=>mutate(x=>{x.config.settings.showAnchors=e.target.checked})}/> Mostrar anchors</label><label><input type="checkbox" checked={!!cfg.settings?.clipEnabled} onChange={e=>mutate(x=>{x.config.settings.clipEnabled=e.target.checked})}/> Plano de corte</label></div>'''
if anchor in s:
    s=s.replace(anchor,'''          <h4>Viewport avançado</h4><div className={styles.inlineChecks}><label><input type="checkbox" checked={cfg.settings?.showAnchors!==false} onChange={e=>mutate(x=>{x.config.settings.showAnchors=e.target.checked})}/> Mostrar anchors</label><label><input type="checkbox" checked={!!cfg.settings?.clipEnabled} onChange={e=>mutate(x=>{x.config.settings.clipEnabled=e.target.checked})}/> Plano de corte</label><label><input type="checkbox" checked={!!cfg.settings?.safePerformance} onChange={e=>mutate(x=>{x.config.settings.safePerformance=e.target.checked})}/> Safe Performance</label></div>''',1)

backup='''          <h4>Backup</h4><div className={styles.row}><button onClick={exportJson}>Exportar JSON</button><button onClick={()=>fileRef.current?.click()}>Importar JSON</button><input ref={fileRef} type="file" accept=".json" hidden onChange={e=>importJson(e.target.files?.[0])}/></div>'''
if backup in s and 'Dependências da cena' not in s:
    deps='''          <h4>Dependências da cena</h4><div className={styles.materialDiag}>{sceneDependencies.length?sceneDependencies.map(url=><span key={url}>{url} · hash {RIPEAM_ASSET_HASHES[String(url).split("?")[0]]||"externo"}</span>):<span>Sem assets externos.</span>}<span>Órfãos na biblioteca: {orphanAssets.length}</span><span>Grupos duplicados por hash: {duplicateAssets.length}</span></div>\n'''
    s=s.replace(backup,deps+backup,1)

save(p,s)

# ---------- Viewport ----------
p,s=rw('app/admin/laboratorio-3d/Admin3DViewport.js')
# Props
s=s.replace('scene,selectedId,isolateId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onCaptureReady,readOnly=false,playhead=0','scene,selectedId,isolateId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onModelBounds,onCaptureReady,onCaptureApi,readOnly=false,playhead=0')
s=s.replace('propsRef.current={scene,selectedId,isolateId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onCaptureReady,readOnly,playhead};','propsRef.current={scene,selectedId,isolateId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onModelBounds,onCaptureReady,onCaptureApi,readOnly,playhead};')

# True ortho camera
old='''      const sc=new THREE.Scene();\n      const camera=new THREE.PerspectiveCamera(43,1,.1,1000);\n      camera.position.set(14,7,15);'''
if old in s:
    s=s.replace(old,'''      const sc=new THREE.Scene();\n      const isOrthographic=!!propsRef.current.scene?.settings?.orthographicView;\n      const camera=isOrthographic?new THREE.OrthographicCamera(-10,10,10,-10,.1,1000):new THREE.PerspectiveCamera(43,1,.1,1000);\n      camera.position.set(14,7,15);''',1)

# camera change callback
old='''          fov:camera.fov\n        });'''
if old in s:
    s=s.replace(old,'''          fov:camera.isPerspectiveCamera?camera.fov:35,\n          zoom:camera.zoom,orthographic:camera.isOrthographicCamera\n        });''',1)

# Resize ortho
old='''        renderer.setSize(w,h,false);\n        camera.aspect=w/h;\n        camera.updateProjectionMatrix();'''
if old in s:
    s=s.replace(old,'''        renderer.setSize(w,h,false);\n        if(camera.isPerspectiveCamera)camera.aspect=w/h;else{const span=10,aspect=w/h;camera.left=-span*aspect;camera.right=span*aspect;camera.top=span;camera.bottom=-span;}\n        camera.updateProjectionMatrix();''',1)

# runtime add isOrthographic + capture API
old='''      runtime.current={THREE,sc,camera,renderer,orbit,grid,water,hemi,sun,objects,transform,ro,pmremGenerator,roomEnvironment,environmentTarget,dracoLoader,ktx2Loader,raf:0,loaders:{glb:gltfLoader,gltf:gltfLoader,fbx:new FBXLoader(),obj:new OBJLoader()}};\n      propsRef.current.onCaptureReady?.(renderer.domElement);'''
if old in s:
    new='''      runtime.current={THREE,sc,camera,renderer,orbit,grid,water,hemi,sun,objects,transform,ro,pmremGenerator,roomEnvironment,environmentTarget,dracoLoader,ktx2Loader,isOrthographic,raf:0,loaders:{glb:gltfLoader,gltf:gltfLoader,fbx:new FBXLoader(),obj:new OBJLoader()}};\n      propsRef.current.onCaptureReady?.(renderer.domElement);\n      propsRef.current.onCaptureApi?.({capture:(width=3840,height=2160)=>{const size=new THREE.Vector2();renderer.getSize(size);const ratio=renderer.getPixelRatio(),oldAspect=camera.isPerspectiveCamera?camera.aspect:null,oldLR=camera.isOrthographicCamera?[camera.left,camera.right,camera.top,camera.bottom]:null;renderer.setPixelRatio(1);renderer.setSize(width,height,false);if(camera.isPerspectiveCamera)camera.aspect=width/height;else{const span=10,aspect=width/height;camera.left=-span*aspect;camera.right=span*aspect;camera.top=span;camera.bottom=-span}camera.updateProjectionMatrix();renderer.render(sc,camera);const data=renderer.domElement.toDataURL('image/png');renderer.setPixelRatio(ratio);renderer.setSize(size.x,size.y,false);if(camera.isPerspectiveCamera)camera.aspect=oldAspect;else [camera.left,camera.right,camera.top,camera.bottom]=oldLR;camera.updateProjectionMatrix();return data;}});'''
    s=s.replace(old,new,1)
else: raise SystemExit('runtime capture anchor missing')

# Safe performance loop
old='''      let fpsFrames=0,fpsLast=performance.now();\n      const tick=()=>{\n        orbit.update();'''
if old in s:
    s=s.replace(old,'''      let fpsFrames=0,fpsLast=performance.now(),lowFpsSeconds=0,safeApplied=false;\n      const tick=()=>{\n        orbit.update();''',1)
old='''renderer.render(sc,camera);fpsFrames++;const now=performance.now();if(now-fpsLast>=1000){runtime.current.fps=Math.round(fpsFrames*1000/(now-fpsLast));fpsFrames=0;fpsLast=now}'''
if old in s:
    s=s.replace(old,'''renderer.render(sc,camera);fpsFrames++;const now=performance.now();if(now-fpsLast>=1000){runtime.current.fps=Math.round(fpsFrames*1000/(now-fpsLast));if(propsRef.current.scene?.settings?.safePerformance){lowFpsSeconds=runtime.current.fps<30?lowFpsSeconds+1:Math.max(0,lowFpsSeconds-1);if(lowFpsSeconds>=3&&!safeApplied){renderer.setPixelRatio(Math.min(devicePixelRatio,1));safeApplied=true}else if(lowFpsSeconds===0&&safeApplied&&runtime.current.fps>48){const q=RENDER_QUALITIES[propsRef.current.scene?.settings?.renderQuality||'high']||RENDER_QUALITIES.high;renderer.setPixelRatio(Math.min(devicePixelRatio,q.pixelRatio));safeApplied=false}}fpsFrames=0;fpsLast=now}''',1)

# Environment camera ortho zoom
old='''    if(c.fov){r.camera.fov=Number(c.fov);r.camera.updateProjectionMatrix()}'''
if old in s:
    s=s.replace(old,'''    if(r.camera.isPerspectiveCamera&&c.fov){r.camera.fov=Number(c.fov);r.camera.updateProjectionMatrix()}if(r.camera.isOrthographicCamera){r.camera.zoom=Number(c.zoom||1);r.camera.updateProjectionMatrix()}''',1)

# objectStats setup
old='''    const materialInventory=[];'''
if old in s and 'const objectStats=' not in s:
    s=s.replace(old,'''    const materialInventory=[];\n    const objectStats={};''',1)
# within applyMaterial initialize data stats
old='''    const applyMaterial=(obj,data)=>{\n      const custom=data.material?.mode==="custom";'''
if old in s:
    s=s.replace(old,'''    const applyMaterial=(obj,data)=>{\n      const custom=data.material?.mode==="custom";\n      const os=objectStats[data.id]||(objectStats[data.id]={name:data.name,triangles:0,meshes:0,textures:0,materials:0});''',1)
old='''        meshes++;\n        const pos=o.geometry?.attributes?.position?.count||0;\n        const idx=o.geometry?.index?.count;\n        triangles+=idx?Math.floor(idx/3):Math.floor(pos/3);'''
if old in s:
    s=s.replace(old,'''        meshes++;os.meshes++;\n        const pos=o.geometry?.attributes?.position?.count||0;\n        const idx=o.geometry?.index?.count;\n        const tri=idx?Math.floor(idx/3):Math.floor(pos/3);triangles+=tri;os.triangles+=tri;''',1)
# count per object texture/material approximations
old='''        mats.filter(Boolean).forEach((m,materialIndex)=>{\n          const maps={};'''
if old in s:
    s=s.replace(old,'''        mats.filter(Boolean).forEach((m,materialIndex)=>{\n          os.materials++;\n          const maps={};''',1)
old='''            if(!t.userData.__ripeamCounted){'''
if old in s:
    s=s.replace(old,'''            os.textures++;\n            if(!t.userData.__ripeamCounted){''')

# per object wireframe
old='''          if(scene.settings?.wireframe&&"wireframe" in m)m.wireframe=true;'''
if old in s:
    s=s.replace(old,'''          if((scene.settings?.wireframe||data.wireframe)&&"wireframe" in m)m.wireframe=true;''',1)

# model bounds callback after normalize
old='''            if(data.normalize!==false)normalizeChild(child,8);\n            child.position.sub(new r.THREE.Vector3(...(data.pivot||[0,0,0])));\n            applyMaterial(child,data);'''
if old in s:
    s=s.replace(old,'''            if(data.normalize!==false)normalizeChild(child,8);\n            child.position.sub(new r.THREE.Vector3(...(data.pivot||[0,0,0])));\n            child.updateMatrixWorld(true);try{const bb=new r.THREE.Box3().setFromObject(child),cc=bb.getCenter(new r.THREE.Vector3());propsRef.current.onModelBounds?.(data.id,{min:bb.min.toArray(),max:bb.max.toArray(),center:cc.toArray()})}catch{}\n            applyMaterial(child,data);''',1)

# Actual alternate LOD child load
old='''            applyMaterial(child,data);\n          }catch(error){modelErrors++;console.warn("Asset 3D indisponível",data.assetUrl,error)}'''
if old in s and 'lodFarChild' not in s:
    s=s.replace(old,'''            applyMaterial(child,data);\n            if(data.lod?.enabled&&data.lod?.farAssetUrl){try{const farUrl=versionRipeamAssetUrl(data.lod.farAssetUrl),farLoaded=await r.loaders.glb.loadAsync(farUrl),far=cloneCachedModel(farLoaded.scene||farLoaded);if(data.normalize!==false)normalizeChild(far,8);applyMaterial(far,{...data,name:data.name+' LOD'});far.visible=false;far.userData.__lodFar=true;child.userData.__lodNear=true;root.userData.lodFarChild=far;root.add(far)}catch(e){console.warn('LOD alternativo indisponível',e)}}\n          }catch(error){modelErrors++;console.warn("Asset 3D indisponível",data.assetUrl,error)}''',1)

# After child root add handle nested far being added incorrectly? far is added to root before child added; child also added later. okay.
# LOD tick toggle near/far or hide
old='''if(runtime.current?.editorRoots){for(const [id,obj] of runtime.current.editorRoots){const data=(propsRef.current.scene?.objects||[]).find(x=>x.id===id),lod=data?.lod;if(lod?.enabled&&lod.hideBeyond&&Number(lod.farDistance)>0)obj.visible=data.visible!==false&&camera.position.distanceTo(obj.getWorldPosition(new THREE.Vector3()))<=Number(lod.farDistance)}}'''
if old in s:
    s=s.replace(old,'''if(runtime.current?.editorRoots){for(const [id,obj] of runtime.current.editorRoots){const data=(propsRef.current.scene?.objects||[]).find(x=>x.id===id),lod=data?.lod;if(!lod?.enabled)continue;const dist=camera.position.distanceTo(obj.getWorldPosition(new THREE.Vector3())),farAt=Number(lod.farDistance||80),far=obj.userData?.lodFarChild,near=obj.children?.find(c=>c.userData?.__lodNear);if(far){if(near)near.visible=dist<farAt;far.visible=dist>=farAt}else if(lod.hideBeyond&&farAt>0)obj.visible=data.visible!==false&&dist<=farAt}}''',1)

# Note: far child was stored on root but added before root variable? inside build root defined yes.
# stats add objectStats
old='''propsRef.current.onStats?.({triangles,meshes,lights,models,modelErrors,textures,estimatedTextureMB:Number(estimatedTextureMB.toFixed(1)),drawCalls:info?.render?.calls||0,geometries:info?.memory?.geometries||0,objects:(scene.objects||[]).length,fps:r.fps||60});'''
if old in s:
    s=s.replace(old,'''propsRef.current.onStats?.({triangles,meshes,lights,models,modelErrors,textures,estimatedTextureMB:Number(estimatedTextureMB.toFixed(1)),drawCalls:info?.render?.calls||0,geometries:info?.memory?.geometries||0,objects:(scene.objects||[]).length,fps:r.fps||60,objectStats});''',1)

save(p,s)
print('RIPEAM V4 PATCHED')
