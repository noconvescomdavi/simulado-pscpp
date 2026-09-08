"use client";

import {useEffect,useRef} from "react";
import styles from "./ripeam-3d.module.css";

const THREE_VERSION="0.180.0";
const SEA_LEVEL=0;
let modernThreePromise=null;
const browserImport=url=>new Function("u","return import(u)")(url);

async function getThree(){
  if(!modernThreePromise){
    modernThreePromise=(async()=>{
      const THREE=await browserImport("https://esm.sh/three@"+THREE_VERSION);
      const [{GLTFLoader},{OrbitControls},{FBXLoader}]=await Promise.all([
        browserImport("https://esm.sh/three@"+THREE_VERSION+"/examples/jsm/loaders/GLTFLoader.js"),
        browserImport("https://esm.sh/three@"+THREE_VERSION+"/examples/jsm/controls/OrbitControls.js"),
        browserImport("https://esm.sh/three@"+THREE_VERSION+"/examples/jsm/loaders/FBXLoader.js")
      ]);
      return {...THREE,GLTFLoader,OrbitControls,FBXLoader};
    })().catch(error=>{modernThreePromise=null;throw error;});
  }
  return modernThreePromise;
}

export const MODEL_CONFIG={
  "bulk-carrier":{url:"/models/ripeam/bulk_carrier.glb",type:"glb",scale:1,rotation:[-Math.PI/2,0,-Math.PI/2],waterline:0,waterlineRatio:.18},
  "tugboat":{url:"/models/ripeam/Tugboat.glb",type:"glb",scale:.55,rotation:[-Math.PI/2,0,0],waterline:0,waterlineRatio:.20},
  "barge":{url:"/models/ripeam/barge.fbx",type:"fbx",scale:1,rotation:[-Math.PI/2,0,-Math.PI/2],waterline:0,waterlineRatio:.32},
  "sailboat":{url:"/models/ripeam/sailboat.glb",type:"glb",scale:.7,rotation:[0,0,0],waterline:0,waterlineRatio:.11},
  "fishing-vessel":{url:"/models/ripeam/fishing_vessel.glb",type:"glb",scale:.72,rotation:[0,Math.PI/2,0],waterline:0,waterlineRatio:.20},
  "dredger":{url:"/models/ripeam/dredger.glb",type:"glb",scale:1,rotation:[0,0,0],waterline:0,waterlineRatio:.19},
  "pilot-boat":{url:"/models/ripeam/pilot_boat.glb",type:"glb",scale:.55,rotation:[0,0,0],waterline:0,waterlineRatio:.18},
  "mine-clearance":{url:"/models/ripeam/navy_mine_clearance.glb",type:"glb",scale:.72,rotation:[0,Math.PI/2,0],waterline:0,waterlineRatio:.18},
  "seaplane":{url:"/models/ripeam/hidroaviao.glb",type:"glb",scale:.65,rotation:[0,Math.PI/2,0],waterline:0,waterlineRatio:.14}
};

function disposeObject(root){
  root?.traverse?.(obj=>{
    obj.geometry?.dispose?.();
    const materials=Array.isArray(obj.material)?obj.material:[obj.material];
    materials.filter(Boolean).forEach(material=>{
      Object.values(material).forEach(value=>{if(value?.isTexture)value.dispose?.();});
      material.dispose?.();
    });
  });
}

function loadProgress(loader,url,onProgress){
  return new Promise((resolve,reject)=>loader.load(url,resolve,event=>{
    if(!event?.total)return;
    onProgress?.(Math.round(event.loaded/event.total*100));
  },reject));
}

async function loadRawModel(THREE,config,onProgress){
  if(config.type==="glb"){
    const gltf=await loadProgress(new THREE.GLTFLoader(),config.url,onProgress);
    if(!gltf?.scene)throw new Error("GLB carregado sem scene.");
    return gltf.scene;
  }
  return loadProgress(new THREE.FBXLoader(),config.url,onProgress);
}

function prepareModel(THREE,raw,config){
  raw.rotation.set(...config.rotation);
  raw.scale.setScalar(1);
  raw.updateMatrixWorld(true);

  let box=new THREE.Box3().setFromObject(raw);
  if(box.isEmpty())throw new Error("Bounding box vazia após carregar o modelo.");
  const initialSize=box.getSize(new THREE.Vector3());
  const maxDimension=Math.max(initialSize.x,initialSize.y,initialSize.z);
  if(!Number.isFinite(maxDimension)||maxDimension<=0)throw new Error("Dimensões inválidas no modelo 3D.");

  const normalizedScale=(10/maxDimension)*config.scale;
  raw.scale.setScalar(normalizedScale);
  raw.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(raw);
  const center=box.getCenter(new THREE.Vector3());

  // O zero do editor e o nível do mar são o mesmo plano: Y = 0.
  // A orientação e a escala são aplicadas uma única vez. A imersão é calibrada
  // por embarcação, sem qualquer correção automática durante o render.
  const size=box.getSize(new THREE.Vector3());
  const waterlineY=box.min.y+size.y*(config.waterlineRatio??.18);
  raw.position.x-=center.x;
  raw.position.z-=center.z;
  raw.position.y-=waterlineY;
  raw.updateMatrixWorld(true);

  const model=new THREE.Group();
  model.add(raw);
  model.position.y=SEA_LEVEL+(config.waterline||0);
  model.updateMatrixWorld(true);
  return model;
}

function makeMoonTexture(THREE){
  const canvas=document.createElement("canvas");
  canvas.width=256;canvas.height=256;
  const ctx=canvas.getContext("2d");
  const g=ctx.createRadialGradient(108,90,15,128,128,120);
  g.addColorStop(0,"#fffdf1");g.addColorStop(.72,"#eee8d2");g.addColorStop(1,"#c9c3ae");
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(128,128,116,0,Math.PI*2);ctx.fill();
  const craters=[[78,82,19],[154,70,15],[176,130,23],[106,151,16],[64,145,11],[135,112,9],[151,173,13]];
  for(const [x,y,r] of craters){ctx.fillStyle="rgba(95,96,91,.16)";ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

function addStaticNightEnvironment(THREE,scene){
  scene.background=new THREE.Color(0x01040a);
  scene.fog=new THREE.FogExp2(0x010710,.0023);

  const sky=new THREE.Mesh(
    new THREE.SphereGeometry(220,40,24),
    new THREE.ShaderMaterial({
      side:THREE.BackSide,depthWrite:false,
      uniforms:{top:{value:new THREE.Color(0x020615)},bottom:{value:new THREE.Color(0x071a2a)}},
      vertexShader:"varying vec3 vPos;void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
      fragmentShader:"varying vec3 vPos;uniform vec3 top;uniform vec3 bottom;void main(){float h=clamp((normalize(vPos).y+.15)/1.15,0.0,1.0);gl_FragColor=vec4(mix(bottom,top,h),1.0);}"
    })
  );
  scene.add(sky);

  const starsGeometry=new THREE.BufferGeometry();
  const starCount=520;
  const positions=new Float32Array(starCount*3);
  for(let i=0;i<starCount;i++){
    const a=(i*2.399963229728653)% (Math.PI*2);
    const t=((i*37)%997)/997;
    const radius=125+((i*53)%40);
    const y=24+t*88;
    positions[i*3]=Math.cos(a)*radius;
    positions[i*3+1]=y;
    positions[i*3+2]=Math.sin(a)*radius;
  }
  starsGeometry.setAttribute("position",new THREE.BufferAttribute(positions,3));
  const stars=new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({color:0xdcecff,size:.48,sizeAttenuation:true,transparent:true,opacity:.92})
  );
  scene.add(stars);

  const moon=new THREE.Mesh(
    new THREE.SphereGeometry(4.8,40,28),
    new THREE.MeshBasicMaterial({map:makeMoonTexture(THREE),color:0xffffff})
  );
  moon.position.set(-44,50,-88);
  scene.add(moon);

  const moonGlow=new THREE.Mesh(
    new THREE.SphereGeometry(6.5,24,16),
    new THREE.MeshBasicMaterial({color:0xbfdcff,transparent:true,opacity:.11,depthWrite:false})
  );
  moonGlow.position.copy(moon.position);
  scene.add(moonGlow);

  const moonLight=new THREE.DirectionalLight(0xc6dcff,1.7);
  moonLight.position.set(-18,35,-28);
  scene.add(moonLight);

  const ambient=new THREE.AmbientLight(0x7899c4,.48);
  const hemi=new THREE.HemisphereLight(0x6f91bd,0x06111c,.72);
  scene.add(ambient);
  scene.add(hemi);

  return {stars,moon,moonGlow,moonLight,ambient,hemi};
}

function addDayEnvironment(THREE,scene){
  scene.background=new THREE.Color(0x78b8dc);
  scene.add(new THREE.AmbientLight(0xffffff,.8));
  scene.add(new THREE.HemisphereLight(0xddefff,0x16374d,1));
  const sun=new THREE.DirectionalLight(0xffffff,1.4);
  sun.position.set(8,14,10);
  scene.add(sun);
}

function addOceanSurfaceDetail(THREE,scene,night){
  const group=new THREE.Group();
  const count=night?75:125;
  for(let i=0;i<count;i++){
    const length=2+((i*17)%37)/8;
    const geometry=new THREE.PlaneGeometry(length,.025);
    const material=new THREE.MeshBasicMaterial({
      color:night?0x49677d:0x6eb4d7,
      transparent:true,
      opacity:night?.10:.16,
      depthWrite:false
    });
    const ripple=new THREE.Mesh(geometry,material);
    ripple.rotation.x=-Math.PI/2;
    ripple.rotation.z=((i*31)%17-8)*.012;
    ripple.position.set(((i*47)%180)-90,.012,((i*73)%180)-90);
    group.add(ripple);
  }
  scene.add(group);
  return group;
}

function addMoonReflection(THREE,scene){
  const group=new THREE.Group();
  for(let i=0;i<34;i++){
    const z=-72+i*2.15;
    const spread=1.1+i*.12;
    const width=.7+((i*19)%13)/10;
    const strip=new THREE.Mesh(
      new THREE.PlaneGeometry(width,.07),
      new THREE.MeshBasicMaterial({color:0xdcecff,transparent:true,opacity:.12+((i*7)%8)/100,depthWrite:false})
    );
    strip.rotation.x=-Math.PI/2;
    strip.position.set(((i*29)%17-8)*spread*.11,SEA_LEVEL+.025,z);
    group.add(strip);
  }
  scene.add(group);
  return group;
}

function addTowLine(THREE,scene,start,end){
  const points=[start.clone(),end.clone()];
  const geometry=new THREE.BufferGeometry().setFromPoints(points);
  const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:0x3a3028}));
  scene.add(line);
  return line;
}

function addDayShapes(THREE,root,plan){
  const black=new THREE.MeshBasicMaterial({color:0x050505});
  const ball=p=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.24,18,12),black.clone());m.position.set(...p);root.add(m)};
  const diamond=p=>{const m=new THREE.Mesh(new THREE.OctahedronGeometry(.29),black.clone());m.position.set(...p);root.add(m)};
  const cone=(p,up=true)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(.28,.5,18),black.clone());m.position.set(...p);if(!up)m.rotation.z=Math.PI;root.add(m)};
  if(plan==="towLong")diamond([0,3.75,0]);
  if(plan==="nuc"){ball([0,4.15,0]);ball([0,3.55,0])}
  if(plan==="ram"){ball([0,4.35,0]);diamond([0,3.7,0]);ball([0,3.05,0])}
  if(plan==="dredgerPort"||plan==="dredgerStbd"){
    ball([0,4.35,0]);diamond([0,3.7,0]);ball([0,3.05,0]);
    const obstructed=plan==="dredgerPort"?-1:1,free=-obstructed;
    ball([0,2.75,obstructed]);ball([0,2.2,obstructed]);
    diamond([0,2.75,free]);diamond([0,2.2,free]);
  }
  if(plan==="fishing"){cone([0,4.05,0],false);cone([0,3.35,0],true)}
  if(plan==="mine"){ball([0,4.25,0]);ball([0,3.1,-1.15]);ball([0,3.1,1.15])}
  if(plan==="cbd"){const m=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.7,18),black.clone());m.position.set(0,3.8,0);root.add(m)}
  if(plan==="anchor")ball([1.8,3.1,0]);
  if(plan==="aground"){ball([0,4.2,0]);ball([0,3.55,0]);ball([0,2.9,0])}
}

function addLightSectors(THREE,root,plan){
  const defs={
    power:[["white",225,0],["red",112.5,-56.25],["green",112.5,56.25],["white",135,180]],
    towShort:[["white",225,0],["red",112.5,-56.25],["green",112.5,56.25],["yellow",135,180]],
    towLong:[["white",225,0],["red",112.5,-56.25],["green",112.5,56.25],["yellow",135,180]],
    sail:[["red",112.5,-56.25],["green",112.5,56.25],["white",135,180]],
    seaplane:[["red",112.5,-56.25],["green",112.5,56.25],["white",135,180]]
  };
  const colors={white:0xfff4d6,red:0xff303f,green:0x36e37b,yellow:0xffcf3a};
  for(const [name,deg,heading] of defs[plan]||[]){
    const start=(heading-deg/2)*Math.PI/180;
    const geo=new THREE.CircleGeometry(8,48,start,deg*Math.PI/180);
    const mat=new THREE.MeshBasicMaterial({color:colors[name],transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false});
    const sector=new THREE.Mesh(geo,mat);
    sector.rotation.x=-Math.PI/2;
    sector.position.y=SEA_LEVEL+.08;
    root.add(sector);
  }
}

function addEncounterGuide(THREE,scene,encounter){
  if(!encounter)return;
  const group=new THREE.Group();
  const matA=new THREE.LineBasicMaterial({color:0x7dd6ff,transparent:true,opacity:.8});
  const matB=new THREE.LineBasicMaterial({color:0xffcf66,transparent:true,opacity:.8});
  const mk=(from,to,mat)=>{
    const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...from),new THREE.Vector3(...to)]);
    const l=new THREE.Line(g,mat);
    group.add(l);
  };
  mk(encounter.courseA[0],encounter.courseA[1],matA);
  mk(encounter.courseB[0],encounter.courseB[1],matB);
  scene.add(group);
  return group;
}

function addNavigationLights(THREE,root,plan){
  try{
    const colors={white:0xfff4d6,red:0xff303f,green:0x36e37b,yellow:0xffcf3a};
    const plans={
      power:[[2.5,4,0,"white"],[0,1.5,-1,"red"],[0,1.5,1,"green"],[-2.5,1.6,0,"white"]],
      towShort:[[2.2,4,0,"white"],[2.2,3.5,0,"white"],[-1.8,1.7,0,"yellow"],[0,1.5,-1,"red"],[0,1.5,1,"green"]],
      towLong:[[2.2,4.3,0,"white"],[2.2,3.75,0,"white"],[2.2,3.2,0,"white"],[-1.8,1.7,0,"yellow"],[0,1.5,-1,"red"],[0,1.5,1,"green"]],
      sail:[[0,1.5,-1,"red"],[0,1.5,1,"green"],[-2,1.5,0,"white"]],
      fishing:[[0,4,0,"red"],[0,3.4,0,"white"]],
      nuc:[[0,4,0,"red"],[0,3.4,0,"red"]],
      ram:[[0,4.2,0,"red"],[0,3.6,0,"white"],[0,3,0,"red"]],
      dredgerPort:[[0,4.2,0,"red"],[0,3.6,0,"white"],[0,3,0,"red"],[-1,2.8,0,"red"],[-1,2.3,0,"red"],[1,2.8,0,"green"],[1,2.3,0,"green"]],
      dredgerStbd:[[0,4.2,0,"red"],[0,3.6,0,"white"],[0,3,0,"red"],[-1,2.8,0,"green"],[-1,2.3,0,"green"],[1,2.8,0,"red"],[1,2.3,0,"red"]],
      mine:[[0,4.2,0,"green"],[0,2.7,-1.4,"green"],[0,2.7,1.4,"green"]],
      cbd:[[0,4.3,0,"red"],[0,3.7,0,"red"],[0,3.1,0,"red"]],
      pilot:[[0,4,0,"white"],[0,3.4,0,"red"]],
      anchor:[[2.2,2.8,0,"white"],[-2.2,2,0,"white"]],
      aground:[[2.2,2.8,0,"white"],[-2.2,2,0,"white"],[0,4,0,"red"],[0,3.4,0,"red"]],
      seaplane:[[0,1.5,-1,"red"],[0,1.5,1,"green"],[-2,1.5,0,"white"]]
    };
    (plans[plan]||[]).forEach(([x,y,z,colorName],index)=>{
      const color=colors[colorName];
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(.11,16,10),new THREE.MeshBasicMaterial({color}));
      bulb.position.set(x,y,z);
      bulb.userData.ripeamLightIndex=index;
      root.add(bulb);
      const point=new THREE.PointLight(color,2.2,7);
      point.position.copy(bulb.position);
      point.userData.ripeamLightIndex=index;
      root.add(point);
    });
  }catch(error){
    console.error("[RIPEAM 3D] Falha isolada ao criar luzes",error);
  }
}

function editorShapeGeo(THREE,shape){
  if(shape==="coneUp")return new THREE.ConeGeometry(.45,.9,28);
  if(shape==="coneDown"){const g=new THREE.ConeGeometry(.45,.9,28);g.rotateZ(Math.PI);return g}
  if(shape==="diamond")return new THREE.OctahedronGeometry(.55);
  if(shape==="cylinder")return new THREE.CylinderGeometry(.35,.35,.8,28);
  return new THREE.SphereGeometry(.45,24,16);
}

function normalizeEditorChild(THREE,obj,target=8){
  const box=new THREE.Box3().setFromObject(obj);
  const size=box.getSize(new THREE.Vector3());
  const max=Math.max(size.x,size.y,size.z)||1;
  obj.scale.multiplyScalar(target/max);
  obj.updateMatrixWorld(true);
  const b2=new THREE.Box3().setFromObject(obj);
  const center=b2.getCenter(new THREE.Vector3());
  obj.position.sub(center);
}

function applyEditorMaterial(obj,data,maxAnisotropy,THREE){
  obj.traverse?.(o=>{
    if(!o.isMesh)return;
    const mats=Array.isArray(o.material)?o.material:[o.material];
    mats.filter(Boolean).forEach(m=>{
      // Preserve imported textures. Only editor overrides are applied.
      if("color" in m&&data.material?.color)m.color.set(data.material.color);
      if("roughness" in m&&data.material?.roughness!==undefined)m.roughness=Number(data.material.roughness);
      if("metalness" in m&&data.material?.metalness!==undefined)m.metalness=Number(data.material.metalness);
      if("opacity" in m&&data.material?.opacity!==undefined){m.opacity=Number(data.material.opacity);m.transparent=m.opacity<1}
      if("emissive" in m&&data.material?.emissive)m.emissive.set(data.material.emissive);
      ["map","normalMap","roughnessMap","metalnessMap","aoMap","emissiveMap"].forEach(key=>{
        const t=m[key];if(!t?.isTexture)return;t.anisotropy=maxAnisotropy;
        if(key==="map"||key==="emissiveMap")t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;
      });
    });
  });
}

export default function RipeamThreeScene({sceneConfig,onDiagnostics,night=false,displayMode="vessel",showSectors=false,highlightLightIndex=-1,liveConfig=null}){
  const mount=useRef(null);
  const runtime=useRef(null);

  useEffect(()=>{
    let cancelled=false;
    let raf=0;

    const start=async()=>{
      const root=mount.current;
      if(!root)return;
      const editorObjects=Array.isArray(liveConfig?.objects)?liveConfig.objects:null;
      const hasLiveConfig=Array.isArray(editorObjects);
      const editorModels=editorObjects?.filter(o=>o.type==="model"&&o.visible!==false)||[];
      const urls=editorModels.length?editorModels.map(o=>o.assetUrl):sceneConfig.vessels.map(v=>MODEL_CONFIG[v]?.url||v);
      root.innerHTML=`<div class="${styles.loading}"><b>Carregando modelo 3D...</b><span>${urls.join(" · ")}</span><span data-progress></span></div>`;
      onDiagnostics?.({status:"loading",frames:0});

      try{
        const THREE=await getThree();
        if(cancelled||!mount.current)return;

        const scene=new THREE.Scene();
        if(night)addStaticNightEnvironment(THREE,scene);
        else addDayEnvironment(THREE,scene);

        const liveCamera=liveConfig?.camera||null;
        const camera=new THREE.PerspectiveCamera(Number(liveCamera?.fov||45),1,.1,1000);
        const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
        renderer.outputColorSpace=THREE.SRGBColorSpace;
        renderer.toneMapping=THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure=night?.82:1.02;
        renderer.setClearColor(night?0x01040a:0x8cc7e8,1);
        const maxAnisotropy=renderer.capabilities.getMaxAnisotropy();

        root.innerHTML="";
        root.appendChild(renderer.domElement);

        const controls=new THREE.OrbitControls(camera,renderer.domElement);
        controls.enableDamping=true;
        controls.dampingFactor=.08;
        controls.enablePan=true;
        controls.enableZoom=true;
        controls.minPolarAngle=.04;
        controls.maxPolarAngle=Math.PI/2-.04;

        const waterGeometry=new THREE.PlaneGeometry(400,400,72,72);
        const wp=waterGeometry.attributes.position;
        for(let i=0;i<wp.count;i++){
          const x=wp.getX(i),y=wp.getY(i);
          const z=Math.sin(x*.075)*.10+Math.cos(y*.09)*.08+Math.sin((x+y)*.045)*.06;
          wp.setZ(i,z);
        }
        wp.needsUpdate=true;
        waterGeometry.computeVertexNormals();
        const water=new THREE.Mesh(
          waterGeometry,
          new THREE.MeshStandardMaterial({
            color:night?0x010810:0x075d86,
            roughness:night?.64:.54,
            metalness:night?.20:.06
          })
        );
        water.rotation.x=-Math.PI/2;
        water.position.y=SEA_LEVEL;
        scene.add(water);
        addOceanSurfaceDetail(THREE,scene,night);
        if(night)addMoonReflection(THREE,scene);

        const vesselRoot=new THREE.Group();
        const lightsRoot=new THREE.Group();
        const shapesRoot=new THREE.Group();
        const sectorsRoot=new THREE.Group();
        scene.add(vesselRoot);
        scene.add(lightsRoot);
        scene.add(shapesRoot);
        scene.add(sectorsRoot);

        let meshCount=0;
        let materialCount=0;
        const loadedFiles=[];

        if(hasLiveConfig){
          const roots=new Map();
          if(!editorModels.length){
            // Cena publicada pode editar apenas luzes/marcas. Nesse caso mantemos
            // o GLB canônico da regra, mas todos os sinais/configurações vêm do editor.
            for(let index=0;index<sceneConfig.vessels.length;index++){
              const vesselKey=sceneConfig.vessels[index];
              const config=MODEL_CONFIG[vesselKey];
              if(!config)continue;
              const raw=await loadRawModel(THREE,config);
              const model=prepareModel(THREE,raw,config);
              if(sceneConfig.vessels.length>1){model.position.x=index===0?5.2:-7.2;model.position.z=index===0?0:.15}
              vesselRoot.add(model);
              loadedFiles.push(config.url);
              raw.traverse(obj=>{if(obj.isMesh){meshCount++;materialCount+=Array.isArray(obj.material)?obj.material.length:(obj.material?1:0)}});
            }
          }
          for(const data of editorModels){
            try{
              const config={url:data.assetUrl,type:data.assetType||"glb"};
              const raw=await loadRawModel(THREE,config,percent=>{
                const progress=root.querySelector?.("[data-progress]");
                if(progress)progress.textContent=percent+"%";
              });
              if(cancelled)return;
              if(data.normalize!==false)normalizeEditorChild(THREE,raw,8);
              raw.position.sub(new THREE.Vector3(...(data.pivot||[0,0,0])));
              applyEditorMaterial(raw,data,maxAnisotropy,THREE);
              const model=new THREE.Group();
              model.add(raw);
              model.position.fromArray(data.position||[0,0,0]);
              model.rotation.set(...(data.rotation||[0,0,0]));
              model.scale.fromArray(data.scale||[1,1,1]);
              model.visible=data.visible!==false;
              model.userData.editorId=data.id;
              roots.set(data.id,model);
              vesselRoot.add(model);
              loadedFiles.push(data.assetUrl);
              raw.traverse(obj=>{
                if(!obj.isMesh)return;
                meshCount++;
                materialCount+=Array.isArray(obj.material)?obj.material.length:(obj.material?1:0);
              });
            }catch(error){
              console.error("[RIPEAM 3D] Falha ao carregar asset publicado",data.assetUrl,error);
            }
          }
          // published light/shape/cable objects are rendered from the exact editor JSON
          for(const data of editorObjects){
            if(data.visible===false)continue;
            if(data.type?.includes("Light")){
              const group=new THREE.Group();
              const color=data.color||"#fff2ba";
              const bulb=new THREE.Mesh(new THREE.SphereGeometry(.14,18,12),new THREE.MeshBasicMaterial({color}));
              let light;
              if(data.type==="directionalLight")light=new THREE.DirectionalLight(color,data.intensity||2);
              else if(data.type==="spotLight")light=new THREE.SpotLight(color,data.intensity||3,data.distance||12,data.angle||.75,data.penumbra||.25);
              else light=new THREE.PointLight(color,data.intensity||3,data.distance||12);
              bulb.add(light);group.add(bulb);
              group.position.fromArray(data.position||[0,0,0]);
              group.rotation.set(...(data.rotation||[0,0,0]));
              group.scale.fromArray(data.scale||[1,1,1]);
              group.userData.ripeamLightIndex=lightsRoot.children.length;
              lightsRoot.add(group);
            }else if(data.type==="shape"){
              const m=new THREE.Mesh(editorShapeGeo(THREE,data.shape),new THREE.MeshStandardMaterial({color:data.color||"#111111",roughness:.7}));
              m.position.fromArray(data.position||[0,0,0]);
              m.rotation.set(...(data.rotation||[0,0,0]));
              m.scale.fromArray(data.scale||[1,1,1]);
              shapesRoot.add(m);
            }
          }
          for(const data of editorObjects){
            if(data.type!=="cable"||!data.cable)continue;
            const a=roots.get(data.cable.fromId),b=roots.get(data.cable.toId);
            if(!a||!b)continue;
            const pa=new THREE.Vector3(),pb=new THREE.Vector3();a.getWorldPosition(pa);b.getWorldPosition(pb);
            const mid=pa.clone().lerp(pb,.5);mid.y-=Number(data.cable.sag||.4);
            const curve=new THREE.CatmullRomCurve3([pa,mid,pb]);
            scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve,32,.035,8,false),new THREE.MeshStandardMaterial({color:data.color||"#d9d0bb"})));
          }
        }else{
                  for(let index=0;index<sceneConfig.vessels.length;index++){
                    const vesselKey=sceneConfig.vessels[index];
                    const config=MODEL_CONFIG[vesselKey];
                    if(!config)throw new Error(`Configuração não encontrada: ${vesselKey}`);
          
                    try{
                      let raw;
                      try{
                        raw=await loadRawModel(THREE,config,percent=>{
                        const progress=root.querySelector?.("[data-progress]");
                          if(progress)progress.textContent=`${percent}%`;
                        });
                      }catch(primaryError){
                        // Alguns GLBs antigos do laboratório falham no parser legado do Three r128.
                        // Para manter o pipeline simples, tentamos o mesmo asset via loader nativo
                        // e preservamos o erro original no console para diagnóstico.
                        console.error("[RIPEAM 3D] GLTFLoader falhou",config.url,primaryError);
                        throw primaryError;
                      }
                      if(cancelled)return;
          
                      const model=prepareModel(THREE,raw,config);
                      if(sceneConfig.vessels.length>1){
                        // Regra 24: rebocador à vante e barcaça a ré, no mesmo eixo de reboque.
                        model.position.x=index===0?5.2:-7.2;
                        model.position.z=index===0?0:.15;
                      }
                      vesselRoot.add(model);
                      loadedFiles.push(config.url);
          
                      raw.traverse(obj=>{
                        if(!obj.isMesh)return;
                        meshCount++;
                        materialCount+=Array.isArray(obj.material)?obj.material.length:(obj.material?1:0);
                        obj.frustumCulled=true;
                        const materials=Array.isArray(obj.material)?obj.material:[obj.material];
                        materials.filter(Boolean).forEach(material=>{
                          ["map","normalMap","roughnessMap","metalnessMap","aoMap","emissiveMap"].forEach(key=>{
                            const texture=material[key];
                            if(!texture?.isTexture)return;
                            texture.anisotropy=maxAnisotropy;
                            if(key==="map"||key==="emissiveMap")texture.colorSpace=THREE.SRGBColorSpace;
                            texture.needsUpdate=true;
                          });
                        });
                      });
                    }catch(error){
                      console.error("[RIPEAM 3D] Falha ao carregar modelo",config.url,error);
                      throw new Error(`Falha ao carregar modelo 3D. Arquivo: ${config.url}. Detalhe: ${String(error?.message||error)}`);
                    }
                  }
          
          
        }

        vesselRoot.updateMatrixWorld(true);

        if(sceneConfig.encounter&&vesselRoot.children.length===1){
          const own=vesselRoot.children[0];
          own.position.set(...sceneConfig.encounter.ownPosition);
          own.rotation.y+=sceneConfig.encounter.ownRotation||0;
          const other=own.clone(true);
          other.position.set(...sceneConfig.encounter.otherPosition);
          other.rotation.y+=sceneConfig.encounter.otherRotation||0;
          vesselRoot.add(other);
          addEncounterGuide(THREE,scene,sceneConfig.encounter);
          vesselRoot.updateMatrixWorld(true);
        }

        if(sceneConfig.key==="rule24"&&vesselRoot.children.length===2&&!sceneConfig.encounter){
          const tugBox=new THREE.Box3().setFromObject(vesselRoot.children[0]);
          const bargeBox=new THREE.Box3().setFromObject(vesselRoot.children[1]);
          const start=new THREE.Vector3(tugBox.min.x,(tugBox.min.y+tugBox.max.y)*.56,(tugBox.min.z+tugBox.max.z)/2);
          const end=new THREE.Vector3(bargeBox.max.x,(bargeBox.min.y+bargeBox.max.y)*.62,(bargeBox.min.z+bargeBox.max.z)/2);
          addTowLine(THREE,scene,start,end);
        }
        const unionBox=new THREE.Box3().setFromObject(vesselRoot);
        const size=unionBox.getSize(new THREE.Vector3());
        const center=unionBox.getCenter(new THREE.Vector3());
        const boundingBoxValid=!unionBox.isEmpty()&&[size.x,size.y,size.z].every(Number.isFinite);
        if(!boundingBoxValid)throw new Error("Bounding box final inválida.");
        if(meshCount===0)throw new Error("Modelo carregado sem meshes renderizáveis.");

        const maxDim=Math.max(size.x,size.y,size.z,1);
        const fov=camera.fov*Math.PI/180;
        const distance=(maxDim/2)/Math.tan(fov/2)*1.7;
        controls.target.copy(center);
        camera.near=Math.max(.01,distance/1000);
        camera.far=Math.max(500,distance*30);
        if(liveCamera?.position&&liveCamera?.target){
          camera.position.fromArray(liveCamera.position);
          controls.target.fromArray(liveCamera.target);
        }else camera.position.set(center.x+distance*.85,center.y+distance*.42,center.z+distance*.85);
        camera.updateProjectionMatrix();
        controls.update();

        const resize=()=>{
          const w=Math.max(1,root.clientWidth||800);
          const h=Math.max(1,root.clientHeight||520);
          renderer.setSize(w,h,false);
          camera.aspect=w/h;
          camera.updateProjectionMatrix();
        };
        const observer=new ResizeObserver(resize);
        observer.observe(root);
        resize();

        // Elementos didáticos são isolados do carregamento do GLB.
        if(!hasLiveConfig){
          addNavigationLights(THREE,lightsRoot,sceneConfig.lightPlan);
          addDayShapes(THREE,shapesRoot,sceneConfig.lightPlan);
        }
        if(showSectors)addLightSectors(THREE,sectorsRoot,sceneConfig.lightPlan);
        const hideVessel=displayMode==="signals-only";
        vesselRoot.visible=!hideVessel;
        // RIPEAM: no cenário diurno mostramos somente as marcas diurnas;
        // no cenário noturno mostramos somente as luzes.
        lightsRoot.visible=night&&!sceneConfig.encounter;
        shapesRoot.visible=!night&&!sceneConfig.encounter;
        sectorsRoot.visible=night&&showSectors&&!sceneConfig.encounter;

        camera.updateMatrixWorld(true);
        const frustum=new THREE.Frustum();
        const matrix=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(matrix);
        const inFrustum=frustum.intersectsBox(unionBox);
        const aboveWaterline=unionBox.min.y>=-.02;

        let frames=0;
        const base={status:"loaded",meshCount,materialCount,boundingBoxValid,inFrustum,aboveWaterline,frames:0,files:loadedFiles,runtime:"three-"+THREE_VERSION};
        console.info("[RIPEAM 3D] diagnóstico técnico",{
          scene:sceneConfig.key,
          ...base,
          bounds:{min:unionBox.min.toArray(),max:unionBox.max.toArray()}
        });
        onDiagnostics?.(base);

        const enforceWaterline=()=>{
          const minY=SEA_LEVEL+.35;
          if(controls.target.y<minY)controls.target.y=minY;
          if(camera.position.y<minY)camera.position.y=minY;
        };

        const animate=()=>{
          if(cancelled)return;
          frames++;
          controls.update();
          enforceWaterline();
          renderer.render(scene,camera);
          if(frames===2)onDiagnostics?.({...base,frames});
          raf=requestAnimationFrame(animate);
        };
        animate();

        const setView=name=>{
          const target=controls.target.clone();
          const d=Math.max(camera.position.distanceTo(target),distance*.8);
          if(name==="bow")camera.position.set(target.x+d,target.y+d*.15,target.z);
          else if(name==="stern")camera.position.set(target.x-d,target.y+d*.15,target.z);
          else if(name==="port")camera.position.set(target.x,target.y+d*.15,target.z-d);
          else if(name==="starboard")camera.position.set(target.x,target.y+d*.15,target.z+d);
          else if(name==="top")camera.position.set(target.x,target.y+d,target.z+.001);
          else camera.position.set(target.x+d*.8,target.y+d*.42,target.z+d*.8);
          camera.lookAt(target);
          enforceWaterline();
          controls.update();
        };
        const zoomBy=factor=>{
          const direction=camera.position.clone().sub(controls.target).multiplyScalar(factor);
          camera.position.copy(controls.target.clone().add(direction));
          enforceWaterline();
          controls.update();
        };

        const highlightLight=index=>{
          lightsRoot.traverse(obj=>{
            const i=obj.userData?.ripeamLightIndex;
            if(i===undefined)return;
            const active=index>=0&&i===index;
            if(obj.isMesh)obj.scale.setScalar(active?1.9:1);
            if(obj.isLight)obj.intensity=active?5:2.2;
          });
        };
        highlightLight(highlightLightIndex);
        runtime.current={renderer,controls,observer,vesselRoot,lightsRoot,shapesRoot,sectorsRoot,setView,zoomBy,highlightLight,reset:()=>setView("3d")};
      }catch(error){
        console.error("[RIPEAM 3D]",error);
        if(root){
          const message=String(error?.message||error);
          root.innerHTML=`<div class="${styles.error}"><b>Falha ao carregar modelo 3D.</b><span>${message}</span></div>`;
        }
        onDiagnostics?.({status:"error",message:String(error?.message||error),frames:0});
      }
    };

    start();
    return()=>{
      cancelled=true;
      cancelAnimationFrame(raf);
      const r=runtime.current;
      if(r){
        r.observer?.disconnect();
        r.controls?.dispose();
        disposeObject(r.vesselRoot);
        disposeObject(r.lightsRoot);
        disposeObject(r.shapesRoot);
        disposeObject(r.sectorsRoot);
        r.renderer?.dispose();
        r.renderer?.forceContextLoss?.();
      }
      runtime.current=null;
      if(mount.current)mount.current.innerHTML="";
    };
  },[sceneConfig,onDiagnostics,night,displayMode,showSectors,liveConfig]);

  useEffect(()=>{runtime.current?.highlightLight?.(highlightLightIndex)},[highlightLightIndex]);

  const view=name=>runtime.current?.setView?.(name);
  const zoom=factor=>runtime.current?.zoomBy?.(factor);
  const fullscreen=async()=>{
    try{
      if(!document.fullscreenElement)await mount.current?.parentElement?.requestFullscreen?.();
      else await document.exitFullscreen?.();
    }catch(error){
      console.error("[RIPEAM 3D] fullscreen",error);
    }
  };

  return <div className={styles.viewerShell}>
    <div className={styles.controls}>
      <button onClick={()=>view("3d")}>3D</button><button onClick={()=>view("bow")}>Proa</button><button onClick={()=>view("stern")}>Popa</button>
      <button onClick={()=>view("port")}>Bombordo</button><button onClick={()=>view("starboard")}>Boreste</button><button onClick={()=>view("top")}>Superior</button><button onClick={()=>runtime.current?.reset?.()}>Reset</button>
      <button onClick={()=>zoom(.85)}>＋</button><button onClick={()=>zoom(1.18)}>−</button><button onClick={fullscreen}>Tela cheia</button>
    </div>
    <div ref={mount} className={styles.viewport}/>
  </div>;
}
