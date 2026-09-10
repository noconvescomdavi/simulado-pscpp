"use client";
import {useEffect,useRef} from "react";
import styles from "./laboratorio-3d.module.css";
import {versionRipeamAssetUrl} from "../../../lib/ripeam-asset-manifest";
import {RENDER_QUALITIES,NAMED_VIEWS,layerForObject} from "./editor-v3";

const THREE_VERSION="0.180.0";
const CDN="https://esm.sh/three@"+THREE_VERSION;
const MODEL_CACHE=new Map();

function cloneCachedModel(source){
  const clone=source.clone(true);
  const sourceMeshes=[],cloneMeshes=[];
  source.traverse?.(o=>{if(o.isMesh)sourceMeshes.push(o)});
  clone.traverse?.(o=>{if(o.isMesh)cloneMeshes.push(o)});
  cloneMeshes.forEach((mesh,i)=>{
    const src=sourceMeshes[i];if(!src)return;
    mesh.geometry=src.geometry;
    mesh.material=Array.isArray(src.material)?src.material.map(m=>m?.clone?.()||m):(src.material?.clone?.()||src.material);
  });
  return clone;
}


function makeOceanNormalTexture(THREE){
  const size=256,canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
  const ctx=canvas.getContext("2d"),img=ctx.createImageData(size,size),d=img.data;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const i=(y*size+x)*4;
    const a=Math.sin(x*.11+y*.037)+Math.sin(x*.031-y*.083)*.7+Math.sin((x+y)*.019)*.55;
    const b=Math.cos(y*.13-x*.043)+Math.sin(y*.027+x*.071)*.65;
    const nx=Math.max(-1,Math.min(1,a*.34)),ny=Math.max(-1,Math.min(1,b*.34));
    d[i]=Math.round((nx*.5+.5)*255);d[i+1]=Math.round((ny*.5+.5)*255);d[i+2]=245;d[i+3]=255;
  }
  ctx.putImageData(img,0,0);
  const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(18,18);tex.anisotropy=8;return tex;
}
function makeCloudTexture(THREE){
  const c=document.createElement("canvas");c.width=256;c.height=128;const x=c.getContext("2d");
  const g=x.createRadialGradient(128,64,8,128,64,92);g.addColorStop(0,"rgba(255,255,255,.92)");g.addColorStop(.55,"rgba(255,255,255,.52)");g.addColorStop(1,"rgba(255,255,255,0)");
  x.fillStyle=g;x.fillRect(0,0,256,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function buildEditorAtmosphere(THREE,scene){
  const group=new THREE.Group();
  const sky=new THREE.Mesh(new THREE.SphereGeometry(260,36,20),new THREE.ShaderMaterial({
    side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color("#2b7fbd")},bottom:{value:new THREE.Color("#b9e1f4")},nightMix:{value:0}},
    vertexShader:"varying vec3 vPos;void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader:"varying vec3 vPos;uniform vec3 top;uniform vec3 bottom;uniform float nightMix;void main(){float h=clamp((normalize(vPos).y+.12)/1.12,0.0,1.0);vec3 day=mix(bottom,top,h);vec3 night=mix(vec3(.012,.027,.06),vec3(.002,.006,.018),h);gl_FragColor=vec4(mix(day,night,nightMix),1.0);}"
  }));group.add(sky);
  const starsGeo=new THREE.BufferGeometry(),count=640,pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){const a=(i*2.399963)%6.28318,t=((i*53)%997)/997,r=170+((i*23)%55);pos[i*3]=Math.cos(a)*r;pos[i*3+1]=20+t*115;pos[i*3+2]=Math.sin(a)*r}
  starsGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));
  const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xe8f3ff,size:.5,transparent:true,opacity:.92,depthWrite:false}));group.add(stars);
  const moon=new THREE.Mesh(new THREE.SphereGeometry(6.2,36,24),new THREE.MeshBasicMaterial({color:0xfff9df}));moon.position.set(-62,58,-96);group.add(moon);
  const moonGlow=new THREE.Mesh(new THREE.SphereGeometry(9.5,24,16),new THREE.MeshBasicMaterial({color:0xbfd9ff,transparent:true,opacity:.12,depthWrite:false,blending:THREE.AdditiveBlending}));moonGlow.position.copy(moon.position);group.add(moonGlow);
  const cloudTexture=makeCloudTexture(THREE),clouds=new THREE.Group();
  for(let i=0;i<10;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTexture,transparent:true,opacity:.48,depthWrite:false}));s.scale.set(28+((i*17)%20),10+((i*11)%8),1);s.position.set(-105+i*24,42+((i*13)%16),-80+((i*37)%150));clouds.add(s)}group.add(clouds);
  scene.add(group);return {group,sky,stars,moon,moonGlow,clouds};
}
export default function Admin3DViewport({
  scene,selectedId,isolateId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onModelBounds,onCaptureReady,onCaptureApi,readOnly=false,playhead=0
}){
  const mount=useRef(null);
  const runtime=useRef(null);
  const propsRef=useRef({});
  propsRef.current={scene,selectedId,isolateId,mode,onSelect,onTransform,onCameraChange,onStats,onLoadProgress,onMaterialInventory,onModelBounds,onCaptureReady,onCaptureApi,readOnly,playhead};

  useEffect(()=>{
    let dead=false;
    (async()=>{
      const THREE=await import(/* webpackIgnore: true */ CDN);
      const [{OrbitControls},{TransformControls},{GLTFLoader},{FBXLoader},{OBJLoader},{RoomEnvironment},{DRACOLoader},{KTX2Loader},{MeshoptDecoder}]=await Promise.all([
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/controls/OrbitControls.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/controls/TransformControls.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/loaders/GLTFLoader.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/loaders/FBXLoader.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/loaders/OBJLoader.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/environments/RoomEnvironment.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/loaders/DRACOLoader.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/loaders/KTX2Loader.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/libs/meshopt_decoder.module.js")
      ]);
      if(dead||!mount.current)return;

      const root=mount.current;
      // Nunca reutilizar entre montagens um GLB antigo que tenha o mesmo caminho.
      MODEL_CACHE.clear();
      const sc=new THREE.Scene();
      const isOrthographic=!!propsRef.current.scene?.settings?.orthographicView;
      const camera=isOrthographic?new THREE.OrthographicCamera(-10,10,10,-10,.1,1000):new THREE.PerspectiveCamera(43,1,.1,1000);
      camera.position.set(14,7,15);

      const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance",preserveDrawingBuffer:true});
      const initialQuality=RENDER_QUALITIES[propsRef.current.scene?.settings?.renderQuality||"high"]||RENDER_QUALITIES.high;
      renderer.setPixelRatio(Math.min(devicePixelRatio,initialQuality.pixelRatio));
      renderer.localClippingEnabled=true;
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      const pmremGenerator=new THREE.PMREMGenerator(renderer);
      const roomEnvironment=new RoomEnvironment();
      const environmentTarget=pmremGenerator.fromScene(roomEnvironment,.04);
      sc.environment=environmentTarget.texture;
      root.innerHTML="";
      root.appendChild(renderer.domElement);

      const orbit=new OrbitControls(camera,renderer.domElement);
      orbit.target.set(0,1,0);
      orbit.enableDamping=true;
      orbit.addEventListener("end",()=>{
        propsRef.current.onCameraChange?.({
          position:camera.position.toArray(),
          target:orbit.target.toArray(),
          fov:camera.isPerspectiveCamera?camera.fov:35,
          zoom:camera.zoom,orthographic:camera.isOrthographicCamera
        });
      });

      const grid=new THREE.GridHelper(80,80,0x41677e,0x203949);
      sc.add(grid);

      const oceanNormal=makeOceanNormalTexture(THREE);
      const water=new THREE.Mesh(
        new THREE.PlaneGeometry(260,260,96,96),
        new THREE.MeshPhysicalMaterial({color:0x053f65,normalMap:oceanNormal,normalScale:new THREE.Vector2(.42,.42),roughness:.2,metalness:.08,clearcoat:.55,clearcoatRoughness:.18,transparent:true,opacity:.985,envMapIntensity:.72})
      );
      water.rotation.x=-Math.PI/2;water.position.y=0;water.receiveShadow=true;sc.add(water);
      const atmosphere=buildEditorAtmosphere(THREE,sc);

      const hemi=new THREE.HemisphereLight(0x7897bc,0x06121b,.9);
      const sun=new THREE.DirectionalLight(0xfff0cf,2.2);
      sun.position.set(6,14,9);
      sc.add(hemi,sun);

      const objects=new THREE.Group();
      sc.add(objects);

      const transform=new TransformControls(camera,renderer.domElement);
      sc.add(transform.getHelper());
      transform.addEventListener("dragging-changed",e=>{orbit.enabled=!e.value});
      transform.addEventListener("mouseUp",()=>{
        const o=transform.object;
        if(!o)return;
        propsRef.current.onTransform?.(o.userData.editorId,{
          position:o.position.toArray(),
          rotation:[o.rotation.x,o.rotation.y,o.rotation.z],
          scale:o.scale.toArray()
        });
      });

      const ray=new THREE.Raycaster();
      const mouse=new THREE.Vector2();
      renderer.domElement.addEventListener("pointerdown",e=>{
        if(transform.dragging||propsRef.current.readOnly)return;
        const rect=renderer.domElement.getBoundingClientRect();
        mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
        mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
        ray.setFromCamera(mouse,camera);
        const hit=ray.intersectObjects(objects.children,true)[0];
        let obj=hit?.object;
        while(obj&&!obj.userData.editorId)obj=obj.parent;
        propsRef.current.onSelect?.(obj?.userData.editorId||null);
      });

      const resize=()=>{
        const w=root.clientWidth||900,h=root.clientHeight||620;
        renderer.setSize(w,h,false);
        if(camera.isPerspectiveCamera)camera.aspect=w/h;else{const span=10,aspect=w/h;camera.left=-span*aspect;camera.right=span*aspect;camera.top=span;camera.bottom=-span;}
        camera.updateProjectionMatrix();
      };
      const ro=new ResizeObserver(resize);
      ro.observe(root);resize();

      const dracoLoader=new DRACOLoader();dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
      const ktx2Loader=new KTX2Loader();ktx2Loader.setTranscoderPath("https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/basis/");ktx2Loader.detectSupport(renderer);
      const gltfLoader=new GLTFLoader();gltfLoader.setDRACOLoader(dracoLoader);gltfLoader.setKTX2Loader(ktx2Loader);gltfLoader.setMeshoptDecoder(MeshoptDecoder);
      runtime.current={THREE,sc,camera,renderer,orbit,grid,water,oceanNormal,atmosphere,hemi,sun,objects,transform,ro,pmremGenerator,roomEnvironment,environmentTarget,dracoLoader,ktx2Loader,isOrthographic,raf:0,loaders:{glb:gltfLoader,gltf:gltfLoader,fbx:new FBXLoader(),obj:new OBJLoader()}};
      propsRef.current.onCaptureReady?.(renderer.domElement);
      propsRef.current.onCaptureApi?.({capture:(width=3840,height=2160)=>{const size=new THREE.Vector2();renderer.getSize(size);const ratio=renderer.getPixelRatio(),oldAspect=camera.isPerspectiveCamera?camera.aspect:null,oldLR=camera.isOrthographicCamera?[camera.left,camera.right,camera.top,camera.bottom]:null;renderer.setPixelRatio(1);renderer.setSize(width,height,false);if(camera.isPerspectiveCamera)camera.aspect=width/height;else{const span=10,aspect=width/height;camera.left=-span*aspect;camera.right=span*aspect;camera.top=span;camera.bottom=-span}camera.updateProjectionMatrix();renderer.render(sc,camera);const data=renderer.domElement.toDataURL('image/png');renderer.setPixelRatio(ratio);renderer.setSize(size.x,size.y,false);if(camera.isPerspectiveCamera)camera.aspect=oldAspect;else [camera.left,camera.right,camera.top,camera.bottom]=oldLR;camera.updateProjectionMatrix();return data;}});

      let fpsFrames=0,fpsLast=performance.now(),lowFpsSeconds=0,safeApplied=false;
      const tick=()=>{
        orbit.update();
        const now=performance.now();
        if(oceanNormal){oceanNormal.offset.x=(now*.000006)%1;oceanNormal.offset.y=(now*.0000035)%1}
        if(water?.geometry?.attributes?.position){const p=water.geometry.attributes.position;for(let i=0;i<p.count;i+=5){const x=p.getX(i),y=p.getY(i);p.setZ(i,Math.sin(x*.08+now*.00055)*.055+Math.cos(y*.065-now*.00042)*.04)}p.needsUpdate=true;water.geometry.computeVertexNormals()}
        if(runtime.current?.editorRoots){for(const [id,obj] of runtime.current.editorRoots){const data=(propsRef.current.scene?.objects||[]).find(x=>x.id===id),lod=data?.lod;if(!lod?.enabled)continue;const dist=camera.position.distanceTo(obj.getWorldPosition(new THREE.Vector3())),farAt=Number(lod.farDistance||80),far=obj.userData?.lodFarChild,near=obj.children?.find(c=>c.userData?.__lodNear);if(far){if(near)near.visible=dist<farAt;far.visible=dist>=farAt}else if(lod.hideBeyond&&farAt>0)obj.visible=data.visible!==false&&dist<=farAt}}
        renderer.render(sc,camera);fpsFrames++;const fpsNow=performance.now();if(fpsNow-fpsLast>=1000){runtime.current.fps=Math.round(fpsFrames*1000/(fpsNow-fpsLast));if(propsRef.current.scene?.settings?.safePerformance){lowFpsSeconds=runtime.current.fps<30?lowFpsSeconds+1:Math.max(0,lowFpsSeconds-1);if(lowFpsSeconds>=3&&!safeApplied){renderer.setPixelRatio(Math.min(devicePixelRatio,1));safeApplied=true}else if(lowFpsSeconds===0&&safeApplied&&runtime.current.fps>48){const q=RENDER_QUALITIES[propsRef.current.scene?.settings?.renderQuality||'high']||RENDER_QUALITIES.high;renderer.setPixelRatio(Math.min(devicePixelRatio,q.pixelRatio));safeApplied=false}}fpsFrames=0;fpsLast=fpsNow}
        if(runtime.current)runtime.current.raf=requestAnimationFrame(tick);
      };
      tick();
    })().catch(error=>{
      console.error(error);
      if(mount.current)mount.current.innerHTML='<div class="'+styles.viewportError+'">Não foi possível iniciar o viewport 3D.<br/><small>'+String(error?.message||error).replace(/[<>&]/g,"")+'</small></div>';
    });

    return()=>{
      dead=true;
      const r=runtime.current;
      if(r){
        cancelAnimationFrame(r.raf);
        r.ro?.disconnect();r.transform?.dispose?.();r.orbit?.dispose?.();r.dracoLoader?.dispose?.();r.ktx2Loader?.dispose?.();r.oceanNormal?.dispose?.();r.environmentTarget?.dispose?.();r.roomEnvironment?.dispose?.();r.pmremGenerator?.dispose?.();r.renderer?.dispose?.();
        r.sc?.traverse?.(o=>{o.geometry?.dispose?.();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m?.dispose?.())});
      }
      runtime.current=null;
      if(mount.current)mount.current.innerHTML="";
    };
  },[]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const e=scene.environment||{},c=scene.editorCamera||scene.camera||{},preview=scene.settings?.previewMode||"day",night=preview==="night",twilight=preview==="twilight";
    r.sc.background=null;
    r.renderer.toneMappingExposure=Number(night?Math.min(.82,e.exposure||.9):twilight?Math.min(.95,e.exposure||.95):(e.exposure||1));
    r.water.material.color.set(night?"#021427":twilight?"#053a58":"#043f6b");
    r.water.material.roughness=night?.27:twilight?.23:.18;r.water.material.envMapIntensity=night?.42:twilight?.6:.8;
    r.hemi.color.set(night?"#536d96":twilight?"#9eb2c8":"#dcefff");r.hemi.intensity=Number(night?.34:twilight?.62:(e.ambientIntensity||.82));
    r.sun.color.set(night?"#a9c8ff":twilight?"#ffc88e":"#fff0ce");r.sun.intensity=Number(night?.22:twilight?.75:(e.sunIntensity||1.65));r.sun.position.fromArray(night?[-18,28,-32]:twilight?[12,7,-8]:[12,8,-7]);
    if(r.atmosphere){r.atmosphere.sky.material.uniforms.nightMix.value=night?1:twilight?.46:0;r.atmosphere.stars.visible=night||twilight;r.atmosphere.moon.visible=night;r.atmosphere.moonGlow.visible=night;r.atmosphere.clouds.visible=!night;r.atmosphere.clouds.children.forEach(x=>x.material.opacity=twilight?.28:.5)}
    const fogEnabled=e.fogEnabled===true&&Number(e.fogDensity||0)>0;
    r.sc.fog=fogEnabled?new r.THREE.FogExp2(e.fog||(night?"#07111e":"#b5cbd6"),Math.max(0,Math.min(.08,Number(e.fogDensity||0)))):null;
    r.grid.visible=scene.settings?.showGrid!==false;
    const q=RENDER_QUALITIES[scene.settings?.mobilePreview?"low":(scene.settings?.renderQuality||"high")]||RENDER_QUALITIES.high;r.renderer.setPixelRatio(Math.min(devicePixelRatio,q.pixelRatio));
    const plane=scene.settings?.clipEnabled?new r.THREE.Plane(new r.THREE.Vector3(0,-1,0),Number(scene.settings?.clipY||0)):null;
    r.sc.traverse(o=>{const mats=Array.isArray(o.material)?o.material:[o.material];mats.filter(Boolean).forEach(m=>{m.clippingPlanes=plane?[plane]:null;m.clipShadows=!!plane;m.needsUpdate=true})});
    if(c.position)r.camera.position.fromArray(c.position);
    if(c.target)r.orbit.target.fromArray(c.target);
    if(r.camera.isPerspectiveCamera&&c.fov){r.camera.fov=Number(c.fov);r.camera.updateProjectionMatrix()}if(r.camera.isOrthographicCamera){r.camera.zoom=Number(c.zoom||1);r.camera.updateProjectionMatrix()}
  },[scene.environment,scene.editorCamera,scene.camera,scene.settings]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const settings=scene.settings||{};
    r.transform.setTranslationSnap(settings.snapEnabled?Number(settings.snapPosition||.25):null);
    r.transform.setRotationSnap(settings.snapEnabled?Number(settings.snapRotation||15)*Math.PI/180:null);
    r.transform.setScaleSnap(settings.snapEnabled?Number(settings.snapScale||.05):null);
  },[scene.settings]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    let cancelled=false;
    r.transform.detach();
    while(r.objects.children.length)r.objects.remove(r.objects.children[0]);

    const roots=new Map();
    let triangles=0,meshes=0,lights=0,models=0,modelErrors=0,textures=0,estimatedTextureMB=0;
    const materialInventory=[];
    const objectStats={};

    const normalizeChild=(obj,target=8)=>{
      const box=new r.THREE.Box3().setFromObject(obj);
      const size=new r.THREE.Vector3();box.getSize(size);
      const max=Math.max(size.x,size.y,size.z)||1;
      const scale=target/max;
      obj.scale.multiplyScalar(scale);
      obj.updateMatrixWorld(true);
      const b2=new r.THREE.Box3().setFromObject(obj);
      const center=new r.THREE.Vector3();b2.getCenter(center);
      obj.position.sub(center);
      obj.position.y+=0;
    };

    const applyMaterial=(obj,data)=>{
      const custom=data.material?.mode==="custom";
      const os=objectStats[data.id]||(objectStats[data.id]={name:data.name,triangles:0,meshes:0,textures:0,materials:0});
      const maxAnisotropy=r.renderer.capabilities.getMaxAnisotropy();
      obj.traverse?.(o=>{
        if(!o.isMesh)return;
        meshes++;os.meshes++;
        const pos=o.geometry?.attributes?.position?.count||0;
        const idx=o.geometry?.index?.count;
        const tri=idx?Math.floor(idx/3):Math.floor(pos/3);triangles+=tri;os.triangles+=tri;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.filter(Boolean).forEach((m,materialIndex)=>{
          os.materials++;
          const maps={};for(const key of ["map","normalMap","roughnessMap","metalnessMap","aoMap","emissiveMap"]){const t=m[key];if(t?.isTexture){const im=t.image;maps[key]={width:Number(im?.width||0),height:Number(im?.height||0)}}}
          materialInventory.push({objectId:data.id,objectName:data.name,mesh:o.name||("Mesh "+meshes),material:m.name||("Material "+materialIndex),type:m.type||"Material",maps,roughness:m.roughness,metalness:m.metalness,transparent:!!m.transparent});
          // Ajustes técnicos seguros: preservam o material e as texturas do GLB.
          ["map","normalMap","roughnessMap","metalnessMap","aoMap","emissiveMap"].forEach(key=>{
            const t=m[key];
            if(!t?.isTexture)return;
            os.textures++;
            if(!t.userData.__ripeamCounted){
              t.userData.__ripeamCounted=true;textures++;
              const img=t.image,w=Number(img?.width||0),h=Number(img?.height||0);
              if(w&&h)estimatedTextureMB+=w*h*4*1.33/1024/1024;
            }
            t.anisotropy=maxAnisotropy;
            if(key==="map"||key==="emissiveMap")t.colorSpace=r.THREE.SRGBColorSpace;
            t.needsUpdate=true;
          });
          const channel=scene.settings?.materialChannel||'final';
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
          const ra=data.renderAdjustments||{};
          const brightness=Math.max(.02,Math.min(3,Number(ra.brightness??1)));
          const objectExposure=Math.max(-4,Math.min(3,Number(ra.exposure??0)));
          const lightScale=brightness*Math.pow(2,objectExposure);
          if(m.color?.isColor){
            if(!m.userData.__ripeamOriginalColor)m.userData.__ripeamOriginalColor=m.color.clone();
            m.color.copy(m.userData.__ripeamOriginalColor).multiplyScalar(lightScale);
          }
          if("envMapIntensity" in m)m.envMapIntensity=1.15*Math.max(0,Math.min(3,Number(ra.environment??1)));
          if("emissiveIntensity" in m&&m.emissive)m.emissiveIntensity=Math.max(0,Math.min(Number(m.emissiveIntensity??1),lightScale));
          if((scene.settings?.wireframe||data.wireframe)&&"wireframe" in m)m.wireframe=true;
          if(scene.settings?.xray){m.transparent=true;m.opacity=Math.min(Number(m.opacity??1),.28);m.depthWrite=false;}
          if(!custom){
            m.needsUpdate=true;
            return;
          }
          if("color" in m&&data.material?.color)m.color.set(data.material.color);
          if("roughness" in m&&data.material?.roughness!==undefined)m.roughness=Number(data.material.roughness);
          if("metalness" in m&&data.material?.metalness!==undefined)m.metalness=Number(data.material.metalness);
          if("opacity" in m&&data.material?.opacity!==undefined){m.opacity=Number(data.material.opacity);m.transparent=m.opacity<1}
          if("emissive" in m&&data.material?.emissive)m.emissive.set(data.material.emissive);
          if(data.material?.doubleSide)m.side=r.THREE.DoubleSide;
          m.needsUpdate=true;
        });
      });
    };

    const shapeGeo=(shape)=>{
      if(shape==="coneUp")return new r.THREE.ConeGeometry(.45,.9,28);
      if(shape==="coneDown"){const g=new r.THREE.ConeGeometry(.45,.9,28);g.rotateZ(Math.PI);return g}
      if(shape==="diamond"){const g=new r.THREE.OctahedronGeometry(.55);return g}
      if(shape==="cylinder")return new r.THREE.CylinderGeometry(.35,.35,.8,28);
      return new r.THREE.SphereGeometry(.45,24,16);
    };

    const addSector=(root,data)=>{
      if(!scene.settings?.showSectors||!data.type?.includes("Light"))return;
      const deg=Number(data.sector||360),heading=Number(data.heading||0)*Math.PI/180;
      const radius=Math.max(1,Math.min(8,Number(data.distance||6)*.35));
      const pts=[new r.THREE.Vector3(0,.02,0)];
      const start=heading-(deg*Math.PI/180)/2;
      const steps=Math.max(12,Math.ceil(deg/8));
      for(let i=0;i<=steps;i++){
        const a=start+(deg*Math.PI/180)*(i/steps);
        pts.push(new r.THREE.Vector3(Math.sin(a)*radius,.02,Math.cos(a)*radius));
      }
      if(deg<359)pts.push(new r.THREE.Vector3(0,.02,0));
      const geo=new r.THREE.BufferGeometry().setFromPoints(pts);
      root.add(new r.THREE.Line(geo,new r.THREE.LineBasicMaterial({color:data.color||"#ffffff",transparent:true,opacity:.48})));
    };

    async function build(data){
      const root=new r.THREE.Group();
      root.userData.editorId=data.id;root.name=data.name;
      let child=null;

      if(data.type==="model"){
        models++;
        if(data.assetUrl){
          try{
            const loader=r.loaders[data.assetType]||r.loaders.glb;
            const resolvedAssetUrl=versionRipeamAssetUrl(data.assetUrl);
            const cacheKey=(data.assetType||"glb")+":"+resolvedAssetUrl;
            let source=MODEL_CACHE.get(cacheKey);
            if(!source){
              const pending=new Promise((resolve,reject)=>loader.load(resolvedAssetUrl,loaded=>resolve(loaded.scene||loaded),event=>{const total=Number(event?.total||0),loadedBytes=Number(event?.loaded||0);propsRef.current.onLoadProgress?.({id:data.id,name:data.name,url:data.assetUrl,loaded:loadedBytes,total,percent:total?Math.round(loadedBytes/total*100):null})},reject)).catch(error=>{MODEL_CACHE.delete(cacheKey);throw error});
              MODEL_CACHE.set(cacheKey,pending);
              source=await pending;
              MODEL_CACHE.set(cacheKey,source);
            }else if(source instanceof Promise)source=await source;
            child=cloneCachedModel(source);
            if(data.normalize!==false)normalizeChild(child,8);
            child.position.sub(new r.THREE.Vector3(...(data.pivot||[0,0,0])));
            child.updateMatrixWorld(true);try{const bb=new r.THREE.Box3().setFromObject(child),cc=bb.getCenter(new r.THREE.Vector3());propsRef.current.onModelBounds?.(data.id,{min:bb.min.toArray(),max:bb.max.toArray(),center:cc.toArray()})}catch{}
            applyMaterial(child,data);
            if(data.lod?.enabled&&data.lod?.farAssetUrl){try{const farUrl=versionRipeamAssetUrl(data.lod.farAssetUrl),farLoaded=await r.loaders.glb.loadAsync(farUrl),far=cloneCachedModel(farLoaded.scene||farLoaded);if(data.normalize!==false)normalizeChild(far,8);applyMaterial(far,{...data,name:data.name+' LOD'});far.visible=false;far.userData.__lodFar=true;child.userData.__lodNear=true;root.userData.lodFarChild=far;root.add(far)}catch(e){console.warn('LOD alternativo indisponível',e)}}
          }catch(error){modelErrors++;console.warn("Asset 3D indisponível",data.assetUrl,error)}
        }
        if(!child)child=new r.THREE.Mesh(new r.THREE.BoxGeometry(3,1,8),new r.THREE.MeshStandardMaterial({color:"#d8e4ea"}));
      }else if(data.type&&data.type.includes("Light")){
        lights++;
        const color=data.color||"#fff2ba";
        child=new r.THREE.Mesh(new r.THREE.SphereGeometry(.18*Math.max(.2,Number(data.lightSize||1)),18,12),new r.THREE.MeshBasicMaterial({color}));
        let light;
        if(data.type==="directionalLight")light=new r.THREE.DirectionalLight(color,data.intensity||2);
        else if(data.type==="spotLight")light=new r.THREE.SpotLight(color,data.intensity||3,data.distance||12,data.angle||.75,data.penumbra||.25,Number(data.decay??2));
        else light=new r.THREE.PointLight(color,data.intensity||3,data.distance||12,Number(data.decay??2));
        child.add(light);addSector(root,data);
        const gizmoLen=Math.max(1.3,Math.min(4,Number(data.distance||12)*.18)),h=Number(data.heading||0)*Math.PI/180;
        const pts=[new r.THREE.Vector3(0,0,0),new r.THREE.Vector3(Math.sin(h)*gizmoLen,0,Math.cos(h)*gizmoLen)];
        root.add(new r.THREE.Line(new r.THREE.BufferGeometry().setFromPoints(pts),new r.THREE.LineBasicMaterial({color,transparent:true,opacity:.8})));
      }else if(data.type==="shape"){
        child=new r.THREE.Mesh(shapeGeo(data.shape),new r.THREE.MeshStandardMaterial({color:data.color||"#111111",roughness:.7}));
      }else if(data.type==="flag"){
        const canvas=document.createElement("canvas");canvas.width=192;canvas.height=128;
        const ctx=canvas.getContext("2d"),colors=data.flagColors?.length?data.flagColors:["#ffffff","#1965a0"];
        colors.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(i*canvas.width/colors.length,0,canvas.width/colors.length,canvas.height)});
        ctx.fillStyle="rgba(255,255,255,.9)";ctx.font="bold 56px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(data.flagCode||"",96,64);
        const tex=new r.THREE.CanvasTexture(canvas);tex.colorSpace=r.THREE.SRGBColorSpace;
        child=new r.THREE.Mesh(new r.THREE.PlaneGeometry(1.35,.9,12,5),new r.THREE.MeshStandardMaterial({map:tex,side:r.THREE.DoubleSide,roughness:.85}));
      }else if(data.type==="hotspot"){
        child=new r.THREE.Mesh(new r.THREE.SphereGeometry(.22,18,12),new r.THREE.MeshBasicMaterial({color:data.color||"#38bdf8"}));
      }

      if(child)root.add(child);
      if(scene.settings?.showAxes)root.add(new r.THREE.AxesHelper(.9));
      root.position.fromArray(data.position||[0,0,0]);
      root.position.y+=Number(data.waterline||0);
      const baseRot=data.rotation||[0,0,0];
      root.rotation.set(Number(baseRot[0]||0)+Number(data.heel||0)*Math.PI/180,Number(baseRot[1]||0),Number(baseRot[2]||0)+Number(data.trim||0)*Math.PI/180);
      root.scale.fromArray(data.scale||[1,1,1]);
      const layer=(scene.layers||[]).find(l=>l.id===layerForObject(data));
      const isolated=propsRef.current.isolateId;
      root.visible=data.visible!==false&&layer?.visible!==false&&(!isolated||isolated===data.id);
      roots.set(data.id,root);
      if(scene.settings?.showAnchors&&data.type==="model"&&child){try{const box=new r.THREE.Box3().setFromObject(child),min=box.min,max=box.max,mid=box.getCenter(new r.THREE.Vector3()),defs=[['bow',mid.x,mid.y,max.z],['stern',mid.x,mid.y,min.z],['port',min.x,mid.y,mid.z],['starboard',max.x,mid.y,mid.z],['masthead',mid.x,max.y,mid.z],['waterline',mid.x,0,mid.z]];for(const [name,x,y,z] of defs){const a=new r.THREE.Mesh(new r.THREE.SphereGeometry(.08,10,8),new r.THREE.MeshBasicMaterial({color:0x22d3ee,depthTest:false}));a.position.set(x,y,z);a.renderOrder=10;a.userData.editorHelper=true;a.userData.anchorName=name;root.add(a)}}catch{}}
      if(scene.settings?.showBounds&&child){
        try{const helper=new r.THREE.BoxHelper(child,0x63c8ff);helper.userData.editorHelper=true;root.add(helper)}catch{}
      }
      return root;
    }

    (async()=>{
      for(const data of scene.objects||[])await build(data);
      if(cancelled)return;

      for(const data of scene.objects||[]){
        const root=roots.get(data.id);if(!root)continue;
        const parent=data.parentId?roots.get(data.parentId):null;
        (parent||r.objects).add(root);
      }

      for(const data of scene.objects||[]){
        if(!["cable","measure"].includes(data.type)||!data.cable)continue;
        const a=roots.get(data.cable.fromId),b=roots.get(data.cable.toId);
        if(!a||!b)continue;
        const pa=new r.THREE.Vector3(),pb=new r.THREE.Vector3();a.getWorldPosition(pa);b.getWorldPosition(pb);
        const mid=pa.clone().lerp(pb,.5);mid.y-=Number(data.cable.sag||.4);
        const curve=new r.THREE.CatmullRomCurve3([pa,mid,pb]);
        let tube;
        if(data.type==="measure"){
          const geo=new r.THREE.BufferGeometry().setFromPoints([pa,pb]);
          tube=new r.THREE.Line(geo,new r.THREE.LineBasicMaterial({color:data.color||"#38bdf8"}));
          tube.userData.measureDistance=pa.distanceTo(pb);
        }else{
          tube=new r.THREE.Mesh(new r.THREE.TubeGeometry(curve,32,.035,8,false),new r.THREE.MeshStandardMaterial({color:data.color||"#d9d0bb"}));
        }
        tube.userData.editorId=data.id;r.objects.add(tube);
      }

      r.editorRoots=roots;
      const info=r.renderer.info;
      propsRef.current.onStats?.({triangles,meshes,lights,models,modelErrors,textures,estimatedTextureMB:Number(estimatedTextureMB.toFixed(1)),drawCalls:info?.render?.calls||0,geometries:info?.memory?.geometries||0,objects:(scene.objects||[]).length,fps:r.fps||60,objectStats});
      propsRef.current.onMaterialInventory?.(materialInventory);
      const found=roots.get(propsRef.current.selectedId);
      if(found&&!propsRef.current.readOnly){r.transform.attach(found);r.transform.setMode(propsRef.current.mode||"translate")}
    })();

    return()=>{cancelled=true};
  },[scene.objects,scene.layers,scene.settings?.showSectors,scene.settings?.showBounds,scene.settings?.showAxes,scene.settings?.showAnchors,scene.settings?.wireframe,scene.settings?.xray,scene.settings?.materialChannel,isolateId]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const find=(root,id)=>{
      if(root.userData?.editorId===id)return root;
      for(const c of root.children||[]){const hit=find(c,id);if(hit)return hit}
      return null;
    };
    const found=selectedId?find(r.objects,selectedId):null;
    const selectedData=(scene.objects||[]).find(o=>o.id===selectedId);
    if(found&&!readOnly&&!selectedData?.locked){r.transform.attach(found);r.transform.setMode(mode||"translate")}
    else r.transform.detach();
  },[selectedId,mode,readOnly]);


  useEffect(()=>{
    const r=runtime.current;if(!r?.editorRoots)return;
    const lerp=(a,b,t)=>a+(b-a)*t;
    for(const data of scene.objects||[]){
      const root=r.editorRoots.get(data.id);
      const frames=data.keyframes||[];
      if(!root||!frames.length)continue;
      let a=frames[0],b=frames[frames.length-1];
      for(let i=0;i<frames.length-1;i++){if(playhead>=frames[i].t&&playhead<=frames[i+1].t){a=frames[i];b=frames[i+1];break}}
      const span=Math.max(.0001,b.t-a.t),t=Math.max(0,Math.min(1,(playhead-a.t)/span));
      root.position.set(...a.position.map((v,i)=>lerp(v,b.position[i],t)));
      root.rotation.set(...a.rotation.map((v,i)=>lerp(v,b.rotation[i],t)));
      root.scale.set(...a.scale.map((v,i)=>lerp(v,b.scale[i],t)));
    }
  },[playhead,scene.objects]);

  return <div ref={mount} className={styles.viewport}/>;
}
