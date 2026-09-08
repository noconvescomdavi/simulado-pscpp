"use client";

import {useEffect,useRef} from "react";
import styles from "./ripeam-3d.module.css";

const THREE_CDN="https://cdn.jsdelivr.net/npm/three@0.128.0";
let threePromise=null;
let fbxPromise=null;

export const MODEL_CONFIG={
  "bulk-carrier":{url:"/models/ripeam/bulk_carrier.glb",type:"glb",scale:1,rotation:[-Math.PI/2,0,-Math.PI/2],waterline:0},
  "tugboat":{url:"/models/ripeam/Tugboat.glb",type:"glb",scale:.55,rotation:[-Math.PI/2,0,0],waterline:0},
  "barge":{url:"/models/ripeam/barge.fbx",type:"fbx",scale:1,rotation:[-Math.PI/2,0,-Math.PI/2],waterline:0},
  "sailboat":{url:"/models/ripeam/sailboat.glb",type:"glb",scale:.7,rotation:[0,0,0],waterline:0},
  "fishing-vessel":{url:"/models/ripeam/fishing_vessel.glb",type:"glb",scale:.72,rotation:[0,Math.PI/2,0],waterline:0},
  "dredger":{url:"/models/ripeam/dredger.glb",type:"glb",scale:1,rotation:[0,0,0],waterline:0},
  "pilot-boat":{url:"/models/ripeam/pilot_boat.glb",type:"glb",scale:.55,rotation:[0,0,0],waterline:0},
  "mine-clearance":{url:"/models/ripeam/navy_mine_clearance.glb",type:"glb",scale:.72,rotation:[0,Math.PI/2,0],waterline:0},
  "seaplane":{url:"/models/ripeam/hidroaviao.glb",type:"glb",scale:.65,rotation:[0,Math.PI/2,0],waterline:0}
};

function loadScript(src,key){
  return new Promise((resolve,reject)=>{
    const selector=`script[data-ripeam-script="${key}"]`;
    const existing=document.querySelector(selector);
    if(existing){
      if(existing.dataset.loaded==="1")return resolve();
      existing.addEventListener("load",resolve,{once:true});
      existing.addEventListener("error",reject,{once:true});
      return;
    }
    const script=document.createElement("script");
    script.src=src;
    script.async=true;
    script.dataset.ripeamScript=key;
    script.onload=()=>{script.dataset.loaded="1";resolve();};
    script.onerror=()=>reject(new Error(`Falha ao carregar dependência 3D: ${src}`));
    document.head.appendChild(script);
  });
}

async function getThree(){
  if(window.THREE?.GLTFLoader&&window.THREE?.OrbitControls)return window.THREE;
  if(!threePromise){
    threePromise=(async()=>{
      await loadScript(`${THREE_CDN}/build/three.min.js`,"three");
      await loadScript(`${THREE_CDN}/examples/js/controls/OrbitControls.js`,"orbit-controls");
      await loadScript(`${THREE_CDN}/examples/js/loaders/GLTFLoader.js`,"gltf-loader");
      if(!window.THREE?.GLTFLoader||!window.THREE?.OrbitControls)throw new Error("Three.js, GLTFLoader ou OrbitControls não inicializados.");
      return window.THREE;
    })().catch(error=>{threePromise=null;throw error;});
  }
  return threePromise;
}

async function getFBXLoader(THREE){
  if(THREE.FBXLoader)return THREE.FBXLoader;
  if(!fbxPromise){
    fbxPromise=(async()=>{
      await loadScript(`${THREE_CDN}/examples/js/libs/fflate.min.js`,"fflate");
      await loadScript(`${THREE_CDN}/examples/js/curves/NURBSUtils.js`,"nurbs-utils");
      await loadScript(`${THREE_CDN}/examples/js/curves/NURBSCurve.js`,"nurbs-curve");
      await loadScript(`${THREE_CDN}/examples/js/loaders/FBXLoader.js`,"fbx-loader");
      if(!THREE.FBXLoader)throw new Error("FBXLoader não inicializado.");
      return THREE.FBXLoader;
    })().catch(error=>{fbxPromise=null;throw error;});
  }
  return fbxPromise;
}

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
  const FBXLoader=await getFBXLoader(THREE);
  return loadProgress(new FBXLoader(),config.url,onProgress);
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

  // A centralização e o assentamento na linha d'água são feitos uma única vez.
  raw.position.x-=center.x;
  raw.position.z-=center.z;
  raw.position.y-=box.min.y;
  raw.updateMatrixWorld(true);

  const model=new THREE.Group();
  model.add(raw);
  model.position.y=config.waterline;
  model.updateMatrixWorld(true);
  return model;
}

function addNavigationLights(THREE,root,plan){
  try{
    const colors={white:0xfff4d6,red:0xff303f,green:0x36e37b,yellow:0xffcf3a};
    const plans={
      power:[[2.5,4,0,"white"],[0,1.5,-1,"red"],[0,1.5,1,"green"],[-2.5,1.6,0,"white"]],
      tow:[[2.2,4,0,"white"],[2.2,3.5,0,"white"],[-1.8,1.7,0,"yellow"]],
      sail:[[0,1.5,-1,"red"],[0,1.5,1,"green"],[-2,1.5,0,"white"]],
      fishing:[[0,4,0,"red"],[0,3.4,0,"white"]],
      nuc:[[0,4,0,"red"],[0,3.4,0,"red"]],
      ram:[[0,4.2,0,"red"],[0,3.6,0,"white"],[0,3,0,"red"]],
      dredger:[[0,4.2,0,"red"],[0,3.6,0,"white"],[0,3,0,"red"],[-1,2.6,0,"green"],[1,2.6,0,"red"]],
      mine:[[0,4.2,0,"green"],[0,2.7,-1.4,"green"],[0,2.7,1.4,"green"]],
      cbd:[[0,4.1,0,"red"]],
      pilot:[[0,4,0,"white"],[0,3.4,0,"red"]],
      anchor:[[2.2,2.8,0,"white"],[-2.2,2,0,"white"]],
      aground:[[2.2,2.8,0,"white"],[-2.2,2,0,"white"],[0,4,0,"red"],[0,3.4,0,"red"]],
      seaplane:[[0,1.5,-1,"red"],[0,1.5,1,"green"],[-2,1.5,0,"white"]]
    };
    for(const [x,y,z,colorName] of plans[plan]||[]){
      const color=colors[colorName];
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(.11,16,10),new THREE.MeshBasicMaterial({color}));
      bulb.position.set(x,y,z);
      root.add(bulb);
      const point=new THREE.PointLight(color,2.2,7);
      point.position.copy(bulb.position);
      root.add(point);
    }
  }catch(error){
    console.error("[RIPEAM 3D] Falha isolada ao criar luzes",error);
  }
}

export default function RipeamThreeScene({sceneConfig,onDiagnostics}){
  const mount=useRef(null);
  const runtime=useRef(null);

  useEffect(()=>{
    let cancelled=false;
    let raf=0;

    const start=async()=>{
      const root=mount.current;
      if(!root)return;
      const urls=sceneConfig.vessels.map(v=>MODEL_CONFIG[v]?.url||v);
      root.innerHTML=`<div class="${styles.loading}"><b>Carregando modelo 3D...</b><span>${urls.join(" · ")}</span><span data-progress></span></div>`;
      onDiagnostics?.({status:"loading",frames:0});

      try{
        const THREE=await getThree();
        if(cancelled||!mount.current)return;

        const scene=new THREE.Scene();
        scene.background=new THREE.Color(0x8cc7e8);

        const camera=new THREE.PerspectiveCamera(45,1,.1,1000);
        const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
        if("outputEncoding" in renderer)renderer.outputEncoding=THREE.sRGBEncoding;
        renderer.setClearColor(0x8cc7e8,1);

        root.innerHTML="";
        root.appendChild(renderer.domElement);

        const controls=new THREE.OrbitControls(camera,renderer.domElement);
        controls.enableDamping=true;
        controls.dampingFactor=.08;
        controls.enablePan=true;
        controls.enableZoom=true;

        scene.add(new THREE.AmbientLight(0xffffff,.8));
        scene.add(new THREE.HemisphereLight(0xddefff,0x24445b,1));
        const sun=new THREE.DirectionalLight(0xffffff,1.4);
        sun.position.set(8,14,10);
        scene.add(sun);

        const water=new THREE.Mesh(
          new THREE.PlaneGeometry(400,400),
          new THREE.MeshStandardMaterial({color:0x073b5b,roughness:.88,metalness:0})
        );
        water.rotation.x=-Math.PI/2;
        water.position.y=0;
        scene.add(water);

        const vesselRoot=new THREE.Group();
        const lightsRoot=new THREE.Group();
        scene.add(vesselRoot);
        scene.add(lightsRoot);

        let meshCount=0;
        let materialCount=0;
        const loadedFiles=[];

        for(let index=0;index<sceneConfig.vessels.length;index++){
          const vesselKey=sceneConfig.vessels[index];
          const config=MODEL_CONFIG[vesselKey];
          if(!config)throw new Error(`Configuração não encontrada: ${vesselKey}`);

          try{
            const raw=await loadRawModel(THREE,config,percent=>{
              const progress=root.querySelector?.("[data-progress]");
              if(progress)progress.textContent=`${percent}%`;
            });
            if(cancelled)return;

            const model=prepareModel(THREE,raw,config);
            if(sceneConfig.vessels.length>1)model.position.x=index===0?3.7:-5.3;
            vesselRoot.add(model);
            loadedFiles.push(config.url);

            raw.traverse(obj=>{
              if(!obj.isMesh)return;
              meshCount++;
              materialCount+=Array.isArray(obj.material)?obj.material.length:(obj.material?1:0);
              obj.frustumCulled=true;
            });
          }catch(error){
            console.error("[RIPEAM 3D] Falha ao carregar modelo",config.url,error);
            throw new Error(`Falha ao carregar modelo 3D. Arquivo: ${config.url}`);
          }
        }

        vesselRoot.updateMatrixWorld(true);
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
        camera.position.set(center.x+distance*.85,center.y+distance*.42,center.z+distance*.85);
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

        // O modelo já está carregado e validado antes das luzes RIPEAM.
        addNavigationLights(THREE,lightsRoot,sceneConfig.lightPlan);

        camera.updateMatrixWorld(true);
        const frustum=new THREE.Frustum();
        const matrix=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(matrix);
        const inFrustum=frustum.intersectsBox(unionBox);
        const aboveWaterline=unionBox.min.y>=-.02;

        let frames=0;
        const base={status:"loaded",meshCount,materialCount,boundingBoxValid,inFrustum,aboveWaterline,frames:0,files:loadedFiles};
        console.info("[RIPEAM 3D] diagnóstico técnico",{
          scene:sceneConfig.key,
          ...base,
          bounds:{min:unionBox.min.toArray(),max:unionBox.max.toArray()}
        });
        onDiagnostics?.(base);

        const animate=()=>{
          if(cancelled)return;
          frames++;
          controls.update();
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
          else camera.position.set(target.x+d*.8,target.y+d*.42,target.z+d*.8);
          camera.lookAt(target);
          controls.update();
        };
        const zoomBy=factor=>{
          const direction=camera.position.clone().sub(controls.target).multiplyScalar(factor);
          camera.position.copy(controls.target.clone().add(direction));
          controls.update();
        };

        runtime.current={renderer,controls,observer,vesselRoot,lightsRoot,setView,zoomBy,reset:()=>setView("3d")};
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
        r.renderer?.dispose();
        r.renderer?.forceContextLoss?.();
      }
      runtime.current=null;
      if(mount.current)mount.current.innerHTML="";
    };
  },[sceneConfig,onDiagnostics]);

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
      <button onClick={()=>view("port")}>Bombordo</button><button onClick={()=>view("starboard")}>Boreste</button><button onClick={()=>runtime.current?.reset?.()}>Reset</button>
      <button onClick={()=>zoom(.85)}>＋</button><button onClick={()=>zoom(1.18)}>−</button><button onClick={fullscreen}>Tela cheia</button>
    </div>
    <div ref={mount} className={styles.viewport}/>
  </div>;
}
