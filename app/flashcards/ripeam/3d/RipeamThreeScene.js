"use client";

import {useEffect,useRef} from "react";
import styles from "./ripeam-3d.module.css";

const THREE_CDN="https://cdn.jsdelivr.net/npm/three@0.128.0";
let loaderPromise=null;

export const MODEL_CONFIG={
  "bulk-carrier":{url:"/models/ripeam/bulk_carrier.glb",type:"gltf",scale:1,rotation:[-Math.PI/2,0,-Math.PI/2],waterline:0},
  "tugboat":{url:"/models/ripeam/Tugboat.glb",type:"gltf",scale:0.1,rotation:[-Math.PI/2,0,0],waterline:0},
  "barge":{url:"/models/ripeam/barge.fbx",type:"fbx",scale:0.07,rotation:[-Math.PI/2,0,-Math.PI/2],waterline:0},
  "sailboat":{url:"/models/ripeam/sailboat.glb",type:"gltf",scale:1,rotation:[0,0,0],waterline:0},
  "fishing-vessel":{url:"/models/ripeam/fishing_vessel.glb",type:"gltf",scale:1,rotation:[0,Math.PI/2,0],waterline:0},
  "dredger":{url:"/models/ripeam/dredger.glb",type:"gltf",scale:1,rotation:[0,0,0],waterline:0},
  "pilot-boat":{url:"/models/ripeam/pilot_boat.glb",type:"gltf",scale:1,rotation:[0,0,0],waterline:0},
  "mine-clearance":{url:"/models/ripeam/navy_mine_clearance.glb",type:"gltf",scale:1,rotation:[0,Math.PI/2,0],waterline:0},
  "seaplane":{url:"/models/ripeam/hidroaviao.glb",type:"gltf",scale:1,rotation:[0,Math.PI/2,0],waterline:0}
};

function loadScript(src){
  return new Promise((resolve,reject)=>{
    const existing=document.querySelector(`script[data-ripeam-src="${src}"]`);
    if(existing){
      if(existing.dataset.loaded==="1")return resolve();
      existing.addEventListener("load",resolve,{once:true});
      existing.addEventListener("error",reject,{once:true});
      return;
    }
    const script=document.createElement("script");
    script.src=src;script.async=true;script.dataset.ripeamSrc=src;
    script.onload=()=>{script.dataset.loaded="1";resolve();};
    script.onerror=()=>reject(new Error(`Falha ao carregar ${src}`));
    document.head.appendChild(script);
  });
}

async function getThree(){
  if(window.THREE?.GLTFLoader&&window.THREE?.OrbitControls&&window.THREE?.FBXLoader)return window.THREE;
  if(!loaderPromise){
    loaderPromise=(async()=>{
      await loadScript(`${THREE_CDN}/build/three.min.js`);
      await loadScript(`${THREE_CDN}/examples/js/controls/OrbitControls.js`);
      await loadScript(`${THREE_CDN}/examples/js/loaders/GLTFLoader.js`);
      await loadScript(`${THREE_CDN}/examples/js/libs/fflate.min.js`);
      await loadScript(`${THREE_CDN}/examples/js/curves/NURBSUtils.js`);
      await loadScript(`${THREE_CDN}/examples/js/curves/NURBSCurve.js`);
      await loadScript(`${THREE_CDN}/examples/js/loaders/FBXLoader.js`);
      if(!window.THREE?.GLTFLoader||!window.THREE?.OrbitControls)throw new Error("Three.js/GLTFLoader/OrbitControls não inicializados.");
      return window.THREE;
    })().catch(error=>{loaderPromise=null;throw error;});
  }
  return loaderPromise;
}

function disposeObject(root){
  root?.traverse?.(obj=>{
    obj.geometry?.dispose?.();
    const mats=Array.isArray(obj.material)?obj.material:[obj.material];
    mats.filter(Boolean).forEach(material=>{
      Object.values(material).forEach(value=>{if(value?.isTexture)value.dispose?.();});
      material.dispose?.();
    });
  });
}

function addLights(THREE,root,plan){
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
      bulb.position.set(x,y,z);root.add(bulb);
      const point=new THREE.PointLight(color,2.2,7);point.position.copy(bulb.position);root.add(point);
    }
  }catch(error){console.error("[RIPEAM 3D] Falha isolada ao criar luzes",error);}
}

export default function RipeamThreeScene({sceneConfig,onDiagnostics}){
  const mount=useRef(null);
  const runtime=useRef(null);

  useEffect(()=>{
    let cancelled=false,raf=0;
    const start=async()=>{
      const root=mount.current;if(!root)return;
      root.innerHTML=`<div class="${styles.loading}"><b>Carregando modelo 3D...</b><span>${sceneConfig.vessels.map(v=>MODEL_CONFIG[v]?.url||v).join(" · ")}</span></div>`;
      onDiagnostics?.({status:"loading",frames:0});
      try{
        const THREE=await getThree();if(cancelled||!mount.current)return;
        const scene=new THREE.Scene();scene.background=new THREE.Color(0x8cc7e8);
        const camera=new THREE.PerspectiveCamera(45,1,.1,5000);camera.position.set(12,7,14);
        const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
        if("outputEncoding" in renderer)renderer.outputEncoding=THREE.sRGBEncoding;
        root.innerHTML="";root.appendChild(renderer.domElement);

        const controls=new THREE.OrbitControls(camera,renderer.domElement);
        controls.enableDamping=true;controls.dampingFactor=.08;controls.enablePan=true;controls.target.set(0,1,0);

        scene.add(new THREE.AmbientLight(0xffffff,.65));
        scene.add(new THREE.HemisphereLight(0xddefff,0x24445b,1.1));
        const sun=new THREE.DirectionalLight(0xffffff,1.35);sun.position.set(8,14,10);scene.add(sun);

        const water=new THREE.Mesh(new THREE.PlaneGeometry(600,600),new THREE.MeshStandardMaterial({color:0x073b5b,roughness:.82,metalness:0}));
        water.rotation.x=-Math.PI/2;water.position.y=0;scene.add(water);

        const vesselRoot=new THREE.Group();scene.add(vesselRoot);
        const lightsRoot=new THREE.Group();scene.add(lightsRoot);
        const gltfLoader=new THREE.GLTFLoader(),fbxLoader=new THREE.FBXLoader();
        let meshCount=0,materialCount=0;

        for(let index=0;index<sceneConfig.vessels.length;index++){
          const vesselKey=sceneConfig.vessels[index],config=MODEL_CONFIG[vesselKey];
          if(!config)throw new Error(`Configuração não encontrada: ${vesselKey}`);
          try{
            const loaded=config.type==="fbx"?await fbxLoader.loadAsync(config.url):await gltfLoader.loadAsync(config.url);
            if(cancelled)return;
            const model=config.type==="fbx"?loaded:loaded.scene;
            model.scale.setScalar(config.scale);
            model.rotation.set(...config.rotation);
            model.updateMatrixWorld(true);
            let box=new THREE.Box3().setFromObject(model);
            if(box.isEmpty())throw new Error(`Bounding box vazia: ${config.url}`);
            const center=box.getCenter(new THREE.Vector3());
            model.position.x-=center.x;model.position.z-=center.z;model.position.y-=box.min.y;
            model.updateMatrixWorld(true);

            const group=new THREE.Group();group.add(model);group.position.y=config.waterline;
            if(sceneConfig.vessels.length>1)group.position.x=index===0?4:-7;
            vesselRoot.add(group);
            model.traverse(obj=>{if(obj.isMesh){meshCount++;materialCount+=Array.isArray(obj.material)?obj.material.length:(obj.material?1:0);}});
          }catch(error){
            console.error("[RIPEAM 3D] Falha ao carregar modelo",config.url,error);
            throw new Error(`Falha ao carregar modelo 3D. Arquivo: ${config.url}`);
          }
        }

        const unionBox=new THREE.Box3().setFromObject(vesselRoot);
        const size=unionBox.getSize(new THREE.Vector3()),center=unionBox.getCenter(new THREE.Vector3());
        const maxDim=Math.max(size.x,size.y,size.z,1),fov=camera.fov*Math.PI/180;
        const distance=(maxDim/2)/Math.tan(fov/2)*1.55;
        controls.target.copy(center);
        camera.near=Math.max(.01,distance/1000);camera.far=Math.max(1000,distance*20);
        camera.position.set(center.x+distance*.9,center.y+distance*.45,center.z+distance*.9);
        camera.updateProjectionMatrix();controls.update();

        addLights(THREE,lightsRoot,sceneConfig.lightPlan);

        const resize=()=>{const w=root.clientWidth||800,h=root.clientHeight||520;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
        const observer=new ResizeObserver(resize);observer.observe(root);resize();

        camera.updateMatrixWorld(true);
        const frustum=new THREE.Frustum(),matrix=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(matrix);
        const inFrustum=frustum.intersectsBox(unionBox);
        const boundingBoxValid=!unionBox.isEmpty()&&Number.isFinite(size.x+size.y+size.z);
        let frames=0;
        const base={status:"loaded",meshCount,materialCount,boundingBoxValid,inFrustum,frames:0,aboveWaterline:unionBox.min.y>=-.01};
        console.info("[RIPEAM 3D] diagnóstico técnico",{scene:sceneConfig.key,...base,bounds:{min:unionBox.min.toArray(),max:unionBox.max.toArray()}});
        onDiagnostics?.(base);

        const animate=()=>{if(cancelled)return;frames++;controls.update();renderer.render(scene,camera);if(frames===2)onDiagnostics?.({...base,frames});raf=requestAnimationFrame(animate);};animate();

        const setView=name=>{
          const target=controls.target.clone(),d=Math.max(camera.position.distanceTo(target),distance*.8);
          if(name==="bow")camera.position.set(target.x+d,target.y+d*.15,target.z);
          else if(name==="stern")camera.position.set(target.x-d,target.y+d*.15,target.z);
          else if(name==="port")camera.position.set(target.x,target.y+d*.15,target.z-d);
          else if(name==="starboard")camera.position.set(target.x,target.y+d*.15,target.z+d);
          else camera.position.set(target.x+d*.8,target.y+d*.42,target.z+d*.8);
          controls.update();
        };
        const zoomBy=factor=>{const direction=camera.position.clone().sub(controls.target).multiplyScalar(factor);camera.position.copy(controls.target.clone().add(direction));controls.update();};
        runtime.current={renderer,controls,observer,vesselRoot,lightsRoot,setView,zoomBy,reset:()=>setView("3d")};
      }catch(error){
        console.error("[RIPEAM 3D]",error);
        if(root)root.innerHTML=`<div class="${styles.error}"><b>Falha ao carregar modelo 3D.</b><span>${String(error?.message||error)}</span></div>`;
        onDiagnostics?.({status:"error",message:String(error?.message||error),frames:0});
      }
    };
    start();
    return()=>{
      cancelled=true;cancelAnimationFrame(raf);
      const r=runtime.current;
      if(r){r.observer?.disconnect();r.controls?.dispose();disposeObject(r.vesselRoot);disposeObject(r.lightsRoot);r.renderer?.dispose();r.renderer?.forceContextLoss?.();}
      runtime.current=null;if(mount.current)mount.current.innerHTML="";
    };
  },[sceneConfig,onDiagnostics]);

  const view=name=>runtime.current?.setView?.(name);
  const zoom=factor=>runtime.current?.zoomBy?.(factor);
  const fullscreen=async()=>{try{if(!document.fullscreenElement)await mount.current?.parentElement?.requestFullscreen?.();else await document.exitFullscreen?.();}catch(error){console.error("[RIPEAM 3D] fullscreen",error);}};

  return <div className={styles.viewerShell}>
    <div className={styles.controls}>
      <button onClick={()=>view("3d")}>3D</button><button onClick={()=>view("bow")}>Proa</button><button onClick={()=>view("stern")}>Popa</button>
      <button onClick={()=>view("port")}>Bombordo</button><button onClick={()=>view("starboard")}>Boreste</button><button onClick={()=>runtime.current?.reset?.()}>Reset</button>
      <button onClick={()=>zoom(.85)}>＋</button><button onClick={()=>zoom(1.18)}>−</button><button onClick={fullscreen}>Tela cheia</button>
    </div>
    <div ref={mount} className={styles.viewport}/>
  </div>;
}
