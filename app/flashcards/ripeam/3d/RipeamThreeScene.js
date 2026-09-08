"use client";
import {useEffect,useRef} from "react";
import styles from "./ripeam-3d.module.css";

const CDN="https://cdn.jsdelivr.net/npm/three@0.180.0";
const MODEL_URLS={
  "bulk-carrier":{type:"gltf",url:"/models/ripeam/bulk_carrier.glb"},
  "tugboat":{type:"gltf",url:"/models/ripeam/Tugboat.glb"},
  "barge":{type:"fbx",url:"/models/ripeam/barge.fbx"}
};

async function loadThree(){
  const THREE=await import(CDN+"/build/three.module.js");
  const [{GLTFLoader},{FBXLoader}]=await Promise.all([
    import(CDN+"/examples/jsm/loaders/GLTFLoader.js"),
    import(CDN+"/examples/jsm/loaders/FBXLoader.js")
  ]);
  return {THREE,GLTFLoader,FBXLoader};
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

export default function RipeamThreeScene({scenario,vessel,yaw,pitch,zoom,night,onReady}){
  const mount=useRef(null);
  const runtime=useRef(null);

  useEffect(()=>{
    let disposed=false;
    if(!mount.current || (!MODEL_URLS[vessel] && vessel!=="tow-combo")){ onReady?.(false); return; }

    (async()=>{
      try{
        const {THREE,GLTFLoader,FBXLoader}=await loadThree();
        if(disposed||!mount.current)return;
        const root=mount.current;
        const scene=new THREE.Scene();
        scene.background=new THREE.Color(night?0x010812:0x82ccef);
        scene.fog=new THREE.FogExp2(night?0x07121d:0xaeddf2,0.026);

        const camera=new THREE.PerspectiveCamera(43,1,.1,250);
        camera.position.set(14,7,15);
        const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
        renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
        renderer.outputColorSpace=THREE.SRGBColorSpace;
        renderer.toneMapping=THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure=night?0.85:1.15;
        root.innerHTML="";
        root.appendChild(renderer.domElement);

        const hemi=new THREE.HemisphereLight(night?0x7897bc:0xdaf3ff,night?0x06121b:0x306b82,night?.75:2.4);
        scene.add(hemi);
        const sun=new THREE.DirectionalLight(night?0x9eb8d8:0xfff0cf,night?1.3:3.2);
        sun.position.set(6,14,9); scene.add(sun);

        const waterGeo=new THREE.PlaneGeometry(140,140,90,90);
        const waterMat=new THREE.MeshPhysicalMaterial({
          color:night?0x063b55:0x117ca5,roughness:.18,metalness:.12,
          transmission:night?.04:.12,transparent:true,opacity:.96,side:THREE.DoubleSide
        });
        const water=new THREE.Mesh(waterGeo,waterMat);
        water.rotation.x=-Math.PI/2; water.position.y=-1.02; scene.add(water);
        const base=waterGeo.attributes.position.array.slice();

        const modelRoot=new THREE.Group(); scene.add(modelRoot);
        const gltfLoader=new GLTFLoader();
        const fbxLoader=new FBXLoader();

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
          const box=new THREE.Box3().setFromObject(obj);
          const size=new THREE.Vector3(); box.getSize(size);
          const center=new THREE.Vector3(); box.getCenter(center);
          obj.position.sub(center);
          obj.scale.setScalar(targetLength/Math.max(size.x,size.y,size.z));
          obj.rotation.set(...rotation);
          return obj;
        };

        if(vessel==="tow-combo"){
          const [tugGltf,bargeObj]=await Promise.all([
            gltfLoader.loadAsync(MODEL_URLS.tugboat.url),
            fbxLoader.loadAsync(MODEL_URLS.barge.url)
          ]);
          if(disposed)return;

          const tugGroup=new THREE.Group();
          const tug=normalize(tugGltf.scene,4.3,[0,Math.PI/2,0]);
          tugGroup.add(tug);
          tugGroup.position.set(3.1,0,0);
          modelRoot.add(tugGroup);

          const bargeGroup=new THREE.Group();
          const barge=normalize(bargeObj,6.2,[-Math.PI/2,0,-Math.PI/2]);
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
          const model=normalize(raw,10.5,[-Math.PI/2,0,-Math.PI/2]);
          modelRoot.add(model);
        }

        const navGroup=new THREE.Group(); modelRoot.add(navGroup);
        for(const l of lightPlan(scenario)){
          const bulb=new THREE.Mesh(
            new THREE.SphereGeometry(.105,16,10),
            new THREE.MeshBasicMaterial({color:l.c})
          );
          bulb.position.set(...l.p); navGroup.add(bulb);
          const glow=new THREE.PointLight(l.c,night?5.2:1.1,4.2,1.7);
          glow.position.copy(bulb.position); navGroup.add(glow);
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
  },[vessel]);

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
    r.scene.background.set(night?0x010812:0x82ccef);
    r.renderer.toneMappingExposure=night?.85:1.15;
    r.water.material.color.set(night?0x063b55:0x117ca5);
  },[night]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    while(r.navGroup.children.length){const o=r.navGroup.children.pop();o.geometry?.dispose?.();o.material?.dispose?.()}
    const THREE=r.THREE;
    for(const l of lightPlan(scenario)){
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(.105,16,10),new THREE.MeshBasicMaterial({color:l.c}));
      bulb.position.set(...l.p);r.navGroup.add(bulb);
      const glow=new THREE.PointLight(l.c,night?5.2:1.1,4.2,1.7);glow.position.copy(bulb.position);r.navGroup.add(glow);
    }
  },[scenario,night]);

  return <div ref={mount} className={styles.threeScene} aria-label="Visualizador tridimensional da embarcação"/>;
}
