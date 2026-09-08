"use client";
import {useEffect,useRef} from "react";
import styles from "./ripeam-3d.module.css";

const CDN="https://cdn.jsdelivr.net/npm/three@0.180.0";
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

async function loadThree(){
  const THREE=await import(CDN+"/build/three.module.js");
  const [{GLTFLoader},{FBXLoader},{OBJLoader}]=await Promise.all([
    import(CDN+"/examples/jsm/loaders/GLTFLoader.js"),
    import(CDN+"/examples/jsm/loaders/FBXLoader.js"),
    import(CDN+"/examples/jsm/loaders/OBJLoader.js")
  ]);
  return {THREE,GLTFLoader,FBXLoader,OBJLoader};
}

function lightPlan(scenario){
  if(scenario==="nuc") return [
    {p:[0,3.6,0],c:0xff334b},{p:[0,3.0,0],c:0xff334b},
    {p:[-1.0,1.3,0],c:0xef3c4e},{p:[1.0,1.3,0],c:0x35dc83}
  ];
  if(scenario==="ram") return [
    {p:[0,4.0,0],c:0xff334b},{p:[0,3.4,0],c:0xfff2ba},{p:[0,2.8,0],c:0xff334b}
  ];
  if(scenario==="anchor") return [
    {p:[2.8,2.7,0],c:0xfff2ba},{p:[-3.0,1.9,0],c:0xfff2ba}
  ];
  if(scenario==="aground") return [
    {p:[2.8,2.7,0],c:0xfff2ba},{p:[-3.0,1.9,0],c:0xfff2ba},
    {p:[0,3.8,0],c:0xff334b},{p:[0,3.2,0],c:0xff334b}
  ];
  return [
    {p:[1.4,3.6,0],c:0xfff2ba},{p:[-1.7,4.0,0],c:0xfff2ba},
    {p:[0,1.5,-1.15],c:0xef3c4e},{p:[0,1.5,1.15],c:0x35dc83},{p:[-3.5,1.6,0],c:0xfff2ba}
  ];
}

export default function RipeamThreeScene({scenario,vessel,yaw,pitch,zoom,night,editorScene,onReady}){
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
        renderer.outputColorSpace=THREE.SRGBColorSpace;
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

        if(editorScene?.objects?.length){
          for(const data of editorScene.objects){
            let obj=null;
            if(data.type==="model"){
              try{
                if(data.assetType==="fbx")obj=await fbxLoader.loadAsync(data.assetUrl);
                else if(data.assetType==="obj")obj=await objLoader.loadAsync(data.assetUrl);
                else obj=(await gltfLoader.loadAsync(data.assetUrl)).scene;
                tuneMaterial(obj);
              }catch(error){console.warn("Asset publicado indisponível",data.assetUrl,error)}
            }else if(data.type&&data.type.includes("Light")){
              const bulb=new THREE.Mesh(new THREE.SphereGeometry(.105,16,10),new THREE.MeshBasicMaterial({color:data.color||"#fff2ba"}));
              let glow;
              if(data.type==="directionalLight")glow=new THREE.DirectionalLight(data.color||"#fff2ba",Number(data.intensity||2));
              else if(data.type==="spotLight")glow=new THREE.SpotLight(data.color||"#fff2ba",Number(data.intensity||3),Number(data.distance||12),Number(data.angle||.75),Number(data.penumbra||.25));
              else glow=new THREE.PointLight(data.color||"#fff2ba",Number(data.intensity||3),Number(data.distance||12),1.7);
              bulb.add(glow);obj=bulb;
            }else if(data.type==="shape"){
              obj=new THREE.Mesh(new THREE.SphereGeometry(.4,20,14),new THREE.MeshStandardMaterial({color:data.color||"#111111"}));
            }
            if(!obj)continue;
            obj.position.fromArray(data.position||[0,0,0]);
            obj.rotation.set(...(data.rotation||[0,0,0]));
            obj.scale.fromArray(data.scale||[1,1,1]);
            obj.visible=data.visible!==false;
            modelRoot.add(obj);
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
          for(const l of lightPlan(scenario)){
            const bulb=new THREE.Mesh(new THREE.SphereGeometry(.105,16,10),new THREE.MeshBasicMaterial({color:l.c}));
            bulb.position.set(...l.p); navGroup.add(bulb);
            const glow=new THREE.PointLight(l.c,night?5.2:1.1,4.2,1.7);
            glow.position.copy(bulb.position); navGroup.add(glow);
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
        runtime.current={THREE,scene,camera,renderer,modelRoot,navGroup,water,ro,raf,tow:runtime.currentTow||null};
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
    while(r.navGroup.children.length){const o=r.navGroup.children.pop();o.geometry?.dispose?.();o.material?.dispose?.()}
    const THREE=r.THREE;
    for(const l of lightPlan(scenario)){
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(.105,16,10),new THREE.MeshBasicMaterial({color:l.c}));
      bulb.position.set(...l.p);r.navGroup.add(bulb);
      const glow=new THREE.PointLight(l.c,night?5.2:1.1,4.2,1.7);glow.position.copy(bulb.position);r.navGroup.add(glow);
    }
  },[scenario,night,editorScene]);

  return <div ref={mount} className={styles.threeScene} aria-label="Visualizador tridimensional da embarcação"/>;
}
