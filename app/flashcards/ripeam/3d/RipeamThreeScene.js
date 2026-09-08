"use client";
import {useEffect,useRef} from "react";
import styles from "./ripeam-3d.module.css";

const LEGACY_CDN="https://cdn.jsdelivr.net/npm/three@0.128.0";
let threeLoaderPromise=null;

const MODEL_URLS={
  "bulk-carrier":{type:"gltf",url:"/models/ripeam/bulk_carrier.glb",rotation:[-Math.PI/2,0,-Math.PI/2],target:10.5},
  "tugboat":{type:"gltf",url:"/models/ripeam/Tugboat.glb",rotation:[-Math.PI/2,0,0],target:4.3},
  "barge":{type:"fbx",url:"/models/ripeam/barge.fbx",rotation:[-Math.PI/2,0,-Math.PI/2],target:6.2},
  "sailboat":{type:"gltf",url:"/models/ripeam/sailboat.glb",rotation:[0,0,0],target:7.4},
  "fishing-vessel":{type:"gltf",url:"/models/ripeam/fishing_vessel.glb",rotation:[0,Math.PI/2,0],target:8.2},
  "pilot-boat":{type:"gltf",url:"/models/ripeam/pilot_boat.glb",rotation:[0,0,0],target:6.6},
  "mine-clearance":{type:"gltf",url:"/models/ripeam/navy_mine_clearance.glb",rotation:[0,Math.PI/2,0],target:9.2},
  "seaplane":{type:"gltf",url:"/models/ripeam/hidroaviao.glb",rotation:[0,Math.PI/2,0],target:8.4}
};

function loadScript(src){
  return new Promise((resolve,reject)=>{
    const existing=document.querySelector(`script[data-ripeam-src="${src}"]`);
    if(existing){
      if(existing.dataset.loaded==="1") return resolve();
      existing.addEventListener("load",resolve,{once:true});
      existing.addEventListener("error",()=>reject(new Error("Falha ao carregar "+src)),{once:true});
      return;
    }
    const script=document.createElement("script");
    script.src=src;
    script.async=true;
    script.dataset.ripeamSrc=src;
    script.onload=()=>{script.dataset.loaded="1";resolve();};
    script.onerror=()=>reject(new Error("Falha ao carregar "+src));
    document.head.appendChild(script);
  });
}

async function loadThree(){
  if(typeof window==="undefined") throw new Error("Three.js só pode ser carregado no navegador.");
  if(window.THREE?.GLTFLoader && window.THREE?.FBXLoader) {
    return {THREE:window.THREE,GLTFLoader:window.THREE.GLTFLoader,FBXLoader:window.THREE.FBXLoader,OBJLoader:window.THREE.OBJLoader};
  }
  if(!threeLoaderPromise){
    threeLoaderPromise=(async()=>{
      await loadScript(LEGACY_CDN+"/build/three.min.js");
      await loadScript(LEGACY_CDN+"/examples/js/loaders/GLTFLoader.js");
      // Dependências do FBXLoader. GLB continua funcionando mesmo que a barcaça não precise delas.
      await loadScript(LEGACY_CDN+"/examples/js/libs/fflate.min.js");
      await loadScript(LEGACY_CDN+"/examples/js/curves/NURBSUtils.js");
      await loadScript(LEGACY_CDN+"/examples/js/curves/NURBSCurve.js");
      await loadScript(LEGACY_CDN+"/examples/js/loaders/FBXLoader.js");
      await loadScript(LEGACY_CDN+"/examples/js/loaders/OBJLoader.js");
      const THREE=window.THREE;
      if(!THREE?.GLTFLoader) throw new Error("GLTFLoader não foi inicializado.");
      return {THREE,GLTFLoader:THREE.GLTFLoader,FBXLoader:THREE.FBXLoader,OBJLoader:THREE.OBJLoader};
    })().catch(err=>{threeLoaderPromise=null;throw err;});
  }
  return threeLoaderPromise;
}

function lightPlan(scenario){
  const W=0xfff2ba,R=0xff334b,G=0x35dc83,Y=0xffd447;
  const L=(name,p,c,sector=360,heading=0)=>({name,p,c,sector,heading});
  if(scenario==="power")return [L("Mastro de vante",[2,3.8,0],W,225,0),L("Bombordo",[0,1.55,-1.18],R,112.5,-56.25),L("Boreste",[0,1.55,1.18],G,112.5,56.25),L("Alcançado",[-3.8,1.65,0],W,135,180)];
  if(scenario==="sail")return [L("Bombordo",[0,1.45,-1.05],R,112.5,-56.25),L("Boreste",[0,1.45,1.05],G,112.5,56.25),L("Alcançado",[-2.8,1.55,0],W,135,180)];
  if(scenario==="towShort")return [L("Mastro 1",[2.5,3.8,0],W,225,0),L("Mastro 2",[2.5,3.25,0],W,225,0),L("Reboque",[-1.2,1.65,0],Y,135,180),L("Bombordo",[1.7,1.45,-.85],R,112.5,-56.25),L("Boreste",[1.7,1.45,.85],G,112.5,56.25)];
  if(scenario==="tow")return [L("Mastro 1",[2.5,3.9,0],W,225,0),L("Mastro 2",[2.5,3.35,0],W,225,0),L("Mastro 3",[2.5,2.8,0],W,225,0),L("Reboque",[-1.2,1.65,0],Y,135,180)];
  if(scenario==="fishing")return [L("Circular encarnada",[0,3.8,0],R),L("Circular branca",[0,3.25,0],W),L("Bombordo",[0,1.4,-1],R,112.5,-56.25),L("Boreste",[0,1.4,1],G,112.5,56.25)];
  if(scenario==="nuc")return [L("Circular encarnada superior",[0,3.8,0],R),L("Circular encarnada inferior",[0,3.2,0],R),L("Bombordo",[0,1.3,-1],R,112.5,-56.25),L("Boreste",[0,1.3,1],G,112.5,56.25)];
  if(scenario==="ram")return [L("Circular encarnada",[0,4.05,0],R),L("Circular branca",[0,3.45,0],W),L("Circular encarnada",[0,2.85,0],R)];
  if(scenario==="mine")return [L("Verde no tope",[0,4.1,0],G),L("Verde no lais BB",[0,2.65,-1.45],G),L("Verde no lais BE",[0,2.65,1.45],G)];
  if(scenario==="pilot")return [L("Circular branca",[0,3.7,0],W),L("Circular encarnada",[0,3.15,0],R),L("Bombordo",[0,1.25,-.85],R,112.5,-56.25),L("Boreste",[0,1.25,.85],G,112.5,56.25)];
  if(scenario==="anchor")return [L("Circular vante",[2.8,2.7,0],W),L("Circular ré",[-3,1.9,0],W)];
  if(scenario==="aground")return [L("Circular vante",[2.8,2.7,0],W),L("Circular ré",[-3,1.9,0],W),L("Encarnada superior",[0,3.8,0],R),L("Encarnada inferior",[0,3.2,0],R)];
  if(scenario==="seaplane")return [L("Bombordo",[0,1.25,-1.1],R,112.5,-56.25),L("Boreste",[0,1.25,1.1],G,112.5,56.25),L("Branca",[-2.2,1.2,0],W,135,180)];
  return [];
}

function dayShapePlan(scenario){
  if(scenario==="anchor")return [{kind:"ball",p:[1.8,3.3,0]}];
  if(scenario==="aground")return [{kind:"ball",p:[0,4.1,0]},{kind:"ball",p:[0,3.55,0]},{kind:"ball",p:[0,3,0]}];
  if(scenario==="nuc")return [{kind:"ball",p:[0,4,0]},{kind:"ball",p:[0,3.45,0]}];
  if(scenario==="ram")return [{kind:"ball",p:[0,4.15,0]},{kind:"diamond",p:[0,3.55,0]},{kind:"ball",p:[0,2.95,0]}];
  if(scenario==="tow")return [{kind:"diamond",p:[-1.2,3.2,0]}];
  if(scenario==="fishing")return [{kind:"coneDown",p:[0,3.85,0]},{kind:"coneUp",p:[0,3.15,0]}];
  return [];
}

export default function RipeamThreeScene({scenario,vessel,yaw,pitch,zoom,night,editorScene,showSectors=false,onReady}){
  const mount=useRef(null);
  const runtime=useRef(null);

  useEffect(()=>{
    let disposed=false;
    if(!mount.current || (!editorScene && !MODEL_URLS[vessel] && vessel!=="tow-combo")){ onReady?.(false); return; }

    (async()=>{
      try{
        const {THREE,GLTFLoader,FBXLoader,OBJLoader}=await loadThree();
        if(disposed||!mount.current)return;
        const root=mount.current;
        const scene=new THREE.Scene();
        const env=editorScene?.environment||{};
        scene.background=new THREE.Color(editorScene?(env.background||"#071522"):(night?0x010812:0x82ccef));
        scene.fog=new THREE.FogExp2(editorScene?(env.fog||"#07121d"):(night?0x07121d:0xaeddf2),editorScene?Number(env.fogDensity||.026):.026);

        const camCfg=editorScene?.camera||{};
        const camera=new THREE.PerspectiveCamera(Number(camCfg.fov||43),1,.1,250);
        camera.position.fromArray(camCfg.position||[14,7,15]);
        const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
        renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
        if("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace=THREE.SRGBColorSpace;
        else if("outputEncoding" in renderer && THREE.sRGBEncoding) renderer.outputEncoding=THREE.sRGBEncoding;
        renderer.toneMapping=THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure=editorScene?Number(env.exposure||.95):(night?0.85:1.15);
        root.innerHTML="";
        root.appendChild(renderer.domElement);

        const hemi=new THREE.HemisphereLight(editorScene?(env.ambient||"#7897bc"):(night?0x7897bc:0xdaf3ff),night?0x06121b:0x306b82,editorScene?Number(env.ambientIntensity||.9):(night?.75:2.4));
        scene.add(hemi);
        const sun=new THREE.DirectionalLight(editorScene?(env.sun||"#fff0cf"):(night?0x9eb8d8:0xfff0cf),editorScene?Number(env.sunIntensity||2.2):(night?1.3:3.2));
        sun.position.fromArray(editorScene?(env.sunPosition||[6,14,9]):[6,14,9]); scene.add(sun);

        const waterGeo=new THREE.PlaneGeometry(140,140,90,90);
        const waterMat=new THREE.MeshPhysicalMaterial({
          color:editorScene?(env.water||"#063b55"):(night?0x063b55:0x117ca5),roughness:.18,metalness:.12,
          transmission:night?.04:.12,transparent:true,opacity:.96,side:THREE.DoubleSide
        });
        const water=new THREE.Mesh(waterGeo,waterMat);
        water.rotation.x=-Math.PI/2; water.position.y=-1.02; scene.add(water);
        const base=waterGeo.attributes.position.array.slice();

        const modelRoot=new THREE.Group(); scene.add(modelRoot);
        const gltfLoader=new GLTFLoader();
        const fbxLoader=new FBXLoader();
        const objLoader=new OBJLoader();

        const tuneMaterial=(obj)=>{
          obj.traverse(o=>{
            if(o.isMesh){
              o.castShadow=false;o.receiveShadow=false;
              const mats=Array.isArray(o.material)?o.material:[o.material];
              mats.filter(Boolean).forEach(m=>{if("roughness" in m)m.roughness=.48;if("metalness" in m)m.metalness=.08});
            }
          });
        };
        const normalize=(obj,targetLength,rotation=[0,0,0])=>{
          tuneMaterial(obj);
          obj.rotation.set(...rotation);
          obj.updateMatrixWorld(true);
          let box=new THREE.Box3().setFromObject(obj);
          const size=new THREE.Vector3(); box.getSize(size);
          obj.scale.setScalar(targetLength/Math.max(size.x,size.y,size.z));
          obj.updateMatrixWorld(true);
          box=new THREE.Box3().setFromObject(obj);
          const center=new THREE.Vector3(); box.getCenter(center);
          obj.position.x-=center.x;
          obj.position.z-=center.z;
          // Mantém o casco próximo da superfície; o calado visual pode ser refinado por modelo.
          obj.position.y+=(-0.82-box.min.y);
          return obj;
        };

        const navGroup=new THREE.Group(); modelRoot.add(navGroup);
        const shapeGroup=new THREE.Group(); modelRoot.add(shapeGroup);
        let publishedRoots=null;

        if(editorScene?.objects?.length){
          const roots=new Map();
          publishedRoots=roots;
          const shapeGeo=(shape)=>{
            if(shape==="coneUp")return new THREE.ConeGeometry(.42,.85,24);
            if(shape==="coneDown"){const g=new THREE.ConeGeometry(.42,.85,24);g.rotateZ(Math.PI);return g}
            if(shape==="diamond")return new THREE.OctahedronGeometry(.5);
            if(shape==="cylinder")return new THREE.CylinderGeometry(.34,.34,.75,24);
            return new THREE.SphereGeometry(.4,20,14);
          };
          const normalizePublished=(obj)=>{
            obj.updateMatrixWorld(true);
            const box=new THREE.Box3().setFromObject(obj);
            const size=new THREE.Vector3();box.getSize(size);
            const max=Math.max(size.x,size.y,size.z)||1;
            obj.scale.multiplyScalar(8/max);
            obj.updateMatrixWorld(true);
            const b2=new THREE.Box3().setFromObject(obj);
            const center=new THREE.Vector3();b2.getCenter(center);
            obj.position.sub(center);obj.position.y+=1.05;
          };
          const applyPublishedMaterial=(obj,data)=>{
            obj.traverse?.(o=>{
              if(!o.isMesh)return;
              const mats=Array.isArray(o.material)?o.material:[o.material];
              mats.filter(Boolean).forEach(m=>{
                if("color" in m)m.color.set(data.material?.color||"#ffffff");
                if("roughness" in m)m.roughness=Number(data.material?.roughness??.5);
                if("metalness" in m)m.metalness=Number(data.material?.metalness??.05);
                if("opacity" in m){m.opacity=Number(data.material?.opacity??1);m.transparent=m.opacity<1}
                if("emissive" in m)m.emissive.set(data.material?.emissive||"#000000");
              });
            });
          };
          for(const data of editorScene.objects){
            if(["cable","measure"].includes(data.type))continue;
            const rootObj=new THREE.Group();
            let obj=null;
            if(data.type==="model"){
              try{
                if(data.assetType==="fbx")obj=await fbxLoader.loadAsync(data.assetUrl);
                else if(data.assetType==="obj")obj=await objLoader.loadAsync(data.assetUrl);
                else obj=(await gltfLoader.loadAsync(data.assetUrl)).scene;
                if(data.normalize!==false)normalizePublished(obj);
                obj.position.sub(new THREE.Vector3(...(data.pivot||[0,0,0])));
                applyPublishedMaterial(obj,data);
              }catch(error){console.warn("Asset publicado indisponível",data.assetUrl,error)}
            }else if(data.type&&data.type.includes("Light")){
              const bulb=new THREE.Mesh(new THREE.SphereGeometry(.105,16,10),new THREE.MeshBasicMaterial({color:data.color||"#fff2ba"}));
              let glow;
              if(data.type==="directionalLight")glow=new THREE.DirectionalLight(data.color||"#fff2ba",Number(data.intensity||2));
              else if(data.type==="spotLight")glow=new THREE.SpotLight(data.color||"#fff2ba",Number(data.intensity||3),Number(data.distance||12),Number(data.angle||.75),Number(data.penumbra||.25));
              else glow=new THREE.PointLight(data.color||"#fff2ba",Number(data.intensity||3),Number(data.distance||12),1.7);
              bulb.add(glow);obj=bulb;
            }else if(data.type==="shape"){
              obj=new THREE.Mesh(shapeGeo(data.shape),new THREE.MeshStandardMaterial({color:data.color||"#111111"}));
            }else if(data.type==="hotspot"){
              obj=new THREE.Mesh(new THREE.SphereGeometry(.18,16,10),new THREE.MeshBasicMaterial({color:data.color||"#38bdf8"}));
            }
            if(obj)rootObj.add(obj);
            rootObj.position.fromArray(data.position||[0,0,0]);
            rootObj.rotation.set(...(data.rotation||[0,0,0]));
            rootObj.scale.fromArray(data.scale||[1,1,1]);
            rootObj.visible=data.visible!==false;
            roots.set(data.id,rootObj);
          }
          for(const data of editorScene.objects){
            if(["cable","measure"].includes(data.type))continue;
            const rootObj=roots.get(data.id);if(!rootObj)continue;
            const parent=data.parentId?roots.get(data.parentId):null;
            (parent||modelRoot).add(rootObj);
          }
          for(const data of editorScene.objects){
            if(!["cable","measure"].includes(data.type)||!data.cable)continue;
            const a=roots.get(data.cable.fromId),b=roots.get(data.cable.toId);
            if(!a||!b)continue;
            const pa=new THREE.Vector3(),pb=new THREE.Vector3();a.getWorldPosition(pa);b.getWorldPosition(pb);
            const mid=pa.clone().lerp(pb,.5);mid.y-=Number(data.cable.sag||.4);
            const curve=new THREE.CatmullRomCurve3([pa,mid,pb]);
            let cable;
            if(data.type==="measure"){
              cable=new THREE.Line(new THREE.BufferGeometry().setFromPoints([pa,pb]),new THREE.LineBasicMaterial({color:data.color||"#38bdf8"}));
            }else{
              cable=new THREE.Mesh(new THREE.TubeGeometry(curve,32,.035,8,false),new THREE.MeshStandardMaterial({color:data.color||"#d9d0bb"}));
            }
            modelRoot.add(cable);
          }
        }else if(vessel==="tow-combo"){
          const [tugGltf,bargeObj]=await Promise.all([
            gltfLoader.loadAsync(MODEL_URLS.tugboat.url),
            fbxLoader.loadAsync(MODEL_URLS.barge.url)
          ]);
          if(disposed)return;

          const tugGroup=new THREE.Group();
          const tug=normalize(tugGltf.scene,MODEL_URLS.tugboat.target,MODEL_URLS.tugboat.rotation);
          tugGroup.add(tug);
          tugGroup.position.set(3.1,0,0);
          modelRoot.add(tugGroup);

          const bargeGroup=new THREE.Group();
          const barge=normalize(bargeObj,MODEL_URLS.barge.target,MODEL_URLS.barge.rotation);
          bargeGroup.add(barge);
          const towDistance=scenario==="tow"?-10.5:-7.0;
          bargeGroup.position.set(towDistance,0,0);
          modelRoot.add(bargeGroup);

          const cableMat=new THREE.LineBasicMaterial({color:0xd9d0bb,transparent:true,opacity:.92});
          const cableGeo=new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(1.4,.25,0),
            new THREE.Vector3((3.1+towDistance)/2,-.05,0),
            new THREE.Vector3(towDistance+2.4,.2,0)
          ]);
          const cable=new THREE.Line(cableGeo,cableMat);
          modelRoot.add(cable);
          runtime.currentTow={tugGroup,bargeGroup,cable,towDistance};
        }else{
          const cfg=MODEL_URLS[vessel];
          const raw=cfg.type==="fbx" ? await fbxLoader.loadAsync(cfg.url) : (await gltfLoader.loadAsync(cfg.url)).scene;
          if(disposed)return;
          const model=normalize(raw,cfg.target||8,cfg.rotation||[0,0,0]);
          modelRoot.add(model);
        }

        if(!editorScene){
          const sectorMesh=l=>{
            if(!showSectors)return null;
            const deg=Number(l.sector||360),heading=Number(l.heading||0)*Math.PI/180,radius=3.8;
            const sh=new THREE.Shape();sh.moveTo(0,0);
            const start=heading-(deg*Math.PI/180)/2,steps=Math.max(18,Math.ceil(deg/6));
            for(let i=0;i<=steps;i++){const ang=start+(deg*Math.PI/180)*(i/steps);sh.lineTo(Math.sin(ang)*radius,Math.cos(ang)*radius)}
            sh.lineTo(0,0);
            const m=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({color:l.c,transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false}));
            m.rotation.x=-Math.PI/2;m.position.y=-.72;return m;
          };
          for(const l of lightPlan(scenario)){
            const bulb=new THREE.Mesh(new THREE.SphereGeometry(.115,16,10),new THREE.MeshBasicMaterial({color:l.c}));
            bulb.position.set(...l.p);navGroup.add(bulb);
            const glow=new THREE.PointLight(l.c,night?5.2:1.0,4.6,1.7);glow.position.copy(bulb.position);navGroup.add(glow);
            const sec=sectorMesh(l);if(sec)navGroup.add(sec);
          }
          if(!night){
            for(const d of dayShapePlan(scenario)){
              let g=d.kind==="diamond"?new THREE.OctahedronGeometry(.32):d.kind==="coneUp"||d.kind==="coneDown"?new THREE.ConeGeometry(.28,.6,20):new THREE.SphereGeometry(.28,20,14);
              if(d.kind==="coneDown")g.rotateZ(Math.PI);
              const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x111111,roughness:.78}));m.position.set(...d.p);shapeGroup.add(m);
            }
          }
        }

        const resize=()=>{
          const w=root.clientWidth||800,h=root.clientHeight||500;
          renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
        };
        const ro=new ResizeObserver(resize); ro.observe(root); resize();

        let raf=0,start=performance.now();
        const animate=(now)=>{
          const t=(now-start)/1000;
          const arr=waterGeo.attributes.position.array;
          for(let i=0;i<arr.length;i+=3){
            const x=base[i],y=base[i+1];
            arr[i+2]=Math.sin(x*.34+t*.85)*.09+Math.sin(y*.27-t*.62)*.065+Math.sin((x+y)*.14+t*.43)*.04;
          }
          waterGeo.attributes.position.needsUpdate=true;
          waterGeo.computeVertexNormals();
          modelRoot.position.y=Math.sin(t*.72)*.075;
          modelRoot.rotation.z=Math.sin(t*.53)*.006;
          if(editorScene?.timeline?.autoplay&&publishedRoots){
            const duration=Math.max(1,Number(editorScene.timeline.duration||10));
            const playT=editorScene.timeline.loop===false?Math.min(t,duration):(t%duration);
            const lerp=(a,b,k)=>a+(b-a)*k;
            for(const data of editorScene.objects||[]){
              const rootObj=publishedRoots.get(data.id),frames=data.keyframes||[];
              if(!rootObj||!frames.length)continue;
              let a=frames[0],b=frames[frames.length-1];
              for(let i=0;i<frames.length-1;i++){if(playT>=frames[i].t&&playT<=frames[i+1].t){a=frames[i];b=frames[i+1];break}}
              const span=Math.max(.0001,b.t-a.t),k=Math.max(0,Math.min(1,(playT-a.t)/span));
              rootObj.position.set(...a.position.map((v,i)=>lerp(v,b.position[i],k)));
              rootObj.rotation.set(...a.rotation.map((v,i)=>lerp(v,b.rotation[i],k)));
              rootObj.scale.set(...a.scale.map((v,i)=>lerp(v,b.scale[i],k)));
            }
          }
          const tow=runtime.currentTow;
          if(tow){
            tow.tugGroup.position.y=Math.sin(t*.88)*.045;
            tow.tugGroup.rotation.z=Math.sin(t*.63)*.008;
            tow.bargeGroup.position.y=Math.sin(t*.54+.8)*.035;
            tow.bargeGroup.rotation.z=Math.sin(t*.43+.6)*.004;
          }
          renderer.render(scene,camera);
          raf=requestAnimationFrame(animate);
        };
        raf=requestAnimationFrame(animate);
        runtime.current={THREE,scene,camera,renderer,modelRoot,navGroup,shapeGroup,water,ro,raf,tow:runtime.currentTow||null};
        onReady?.(true);
      }catch(err){
        console.warn("Bulk carrier 3D indisponível; usando fallback visual.",err);
        onReady?.(false);
      }
    })();

    return()=>{
      disposed=true;
      const r=runtime.current;
      if(r){cancelAnimationFrame(r.raf);r.ro?.disconnect();r.renderer?.dispose();r.scene?.traverse?.(o=>{o.geometry?.dispose?.();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose?.())}})}
      if(mount.current) mount.current.innerHTML="";
      runtime.current=null;
      runtime.currentTow=null;
    };
  },[vessel,editorScene]);

  useEffect(()=>{
    const r=runtime.current;if(!r?.tow)return;
    const target=scenario==="tow"?-10.5:-7.0;
    r.tow.bargeGroup.position.x=target;
  },[scenario]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const rad=Math.PI/180;
    r.modelRoot.rotation.y=yaw*rad;
    r.modelRoot.rotation.x=pitch*rad*.45;
    const distance=18/Math.max(.62,zoom);
    const a=-yaw*rad*.12;
    r.camera.position.set(Math.sin(a)*distance,Math.max(4.4,7-pitch*.045),Math.cos(a)*distance);
    r.camera.lookAt(0,1.25,0);
  },[yaw,pitch,zoom]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    if(editorScene){
      const e=editorScene.environment||{};
      r.scene.background.set(e.background||"#071522");
      r.renderer.toneMappingExposure=Number(e.exposure||.95);
      r.water.material.color.set(e.water||"#063b55");
      return;
    }
    r.scene.background.set(night?0x010812:0x82ccef);
    r.renderer.toneMappingExposure=night?.85:1.15;
    r.water.material.color.set(night?0x063b55:0x117ca5);
  },[night,editorScene]);

  useEffect(()=>{
    const r=runtime.current;if(!r||editorScene)return;
    const THREE=r.THREE;
    const clear=g=>{while(g?.children?.length){const o=g.children.pop();o.geometry?.dispose?.();o.material?.dispose?.()}};
    clear(r.navGroup);clear(r.shapeGroup);
    for(const l of lightPlan(scenario)){
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(.115,16,10),new THREE.MeshBasicMaterial({color:l.c}));
      bulb.position.set(...l.p);r.navGroup.add(bulb);
      const glow=new THREE.PointLight(l.c,night?5.2:1.0,4.6,1.7);glow.position.copy(bulb.position);r.navGroup.add(glow);
      if(showSectors){
        const deg=Number(l.sector||360),heading=Number(l.heading||0)*Math.PI/180,radius=3.8,sh=new THREE.Shape();sh.moveTo(0,0);
        const start=heading-(deg*Math.PI/180)/2,steps=Math.max(18,Math.ceil(deg/6));
        for(let i=0;i<=steps;i++){const ang=start+(deg*Math.PI/180)*(i/steps);sh.lineTo(Math.sin(ang)*radius,Math.cos(ang)*radius)}
        sh.lineTo(0,0);
        const m=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({color:l.c,transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false}));
        m.rotation.x=-Math.PI/2;m.position.y=-.72;r.navGroup.add(m);
      }
    }
    if(!night&&r.shapeGroup){
      for(const d of dayShapePlan(scenario)){
        let g=d.kind==="diamond"?new THREE.OctahedronGeometry(.32):d.kind==="coneUp"||d.kind==="coneDown"?new THREE.ConeGeometry(.28,.6,20):new THREE.SphereGeometry(.28,20,14);
        if(d.kind==="coneDown")g.rotateZ(Math.PI);
        const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x111111,roughness:.78}));m.position.set(...d.p);r.shapeGroup.add(m);
      }
    }
  },[scenario,night,editorScene,showSectors]);

  return <div ref={mount} className={styles.threeScene} aria-label="Visualizador tridimensional da embarcação"/>;
}
