"use client";
import {useEffect,useRef} from "react";
import styles from "./laboratorio-3d.module.css";

const THREE_VERSION="0.180.0";
const CDN="https://esm.sh/three@"+THREE_VERSION;

export default function Admin3DViewport({
  scene,selectedId,mode,onSelect,onTransform,onCameraChange,onStats,readOnly=false,playhead=0
}){
  const mount=useRef(null);
  const runtime=useRef(null);
  const propsRef=useRef({});
  propsRef.current={scene,selectedId,mode,onSelect,onTransform,onCameraChange,onStats,readOnly,playhead};

  useEffect(()=>{
    let dead=false;
    (async()=>{
      const THREE=await import(/* webpackIgnore: true */ CDN);
      const [{OrbitControls},{TransformControls},{GLTFLoader},{FBXLoader},{OBJLoader}]=await Promise.all([
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/controls/OrbitControls.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/controls/TransformControls.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/loaders/GLTFLoader.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/loaders/FBXLoader.js"),
        import(/* webpackIgnore: true */ CDN+"/examples/jsm/loaders/OBJLoader.js")
      ]);
      if(dead||!mount.current)return;

      const root=mount.current;
      const sc=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(43,1,.1,1000);
      camera.position.set(14,7,15);

      const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance",preserveDrawingBuffer:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      root.innerHTML="";
      root.appendChild(renderer.domElement);

      const orbit=new OrbitControls(camera,renderer.domElement);
      orbit.target.set(0,1,0);
      orbit.enableDamping=true;
      orbit.addEventListener("end",()=>{
        propsRef.current.onCameraChange?.({
          position:camera.position.toArray(),
          target:orbit.target.toArray(),
          fov:camera.fov
        });
      });

      const grid=new THREE.GridHelper(80,80,0x41677e,0x203949);
      sc.add(grid);

      const water=new THREE.Mesh(
        new THREE.PlaneGeometry(160,160),
        new THREE.MeshStandardMaterial({color:0x063b55,roughness:.28,metalness:.05,transparent:true,opacity:.96})
      );
      water.rotation.x=-Math.PI/2;
      water.position.y=-1.05;
      sc.add(water);

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
        camera.aspect=w/h;
        camera.updateProjectionMatrix();
      };
      const ro=new ResizeObserver(resize);
      ro.observe(root);resize();

      runtime.current={
        THREE,sc,camera,renderer,orbit,grid,water,hemi,sun,objects,transform,ro,raf:0,
        loaders:{glb:new GLTFLoader(),gltf:new GLTFLoader(),fbx:new FBXLoader(),obj:new OBJLoader()}
      };

      const tick=()=>{
        orbit.update();
        renderer.render(sc,camera);
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
        r.ro?.disconnect();r.transform?.dispose?.();r.orbit?.dispose?.();r.renderer?.dispose?.();
        r.sc?.traverse?.(o=>{o.geometry?.dispose?.();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m?.dispose?.())});
      }
      runtime.current=null;
      if(mount.current)mount.current.innerHTML="";
    };
  },[]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const e=scene.environment||{},c=scene.editorCamera||scene.camera||{},night=scene.settings?.previewMode==="night";
    r.sc.background=new r.THREE.Color(night?"#010812":(e.background||"#071522"));
    r.renderer.toneMappingExposure=Number(night?Math.min(.9,e.exposure||.95):(e.exposure||.95));
    r.water.material.color.set(night?"#063046":(e.water||"#063b55"));
    r.hemi.color.set(e.ambient||"#7897bc");r.hemi.intensity=Number(night?.55:(e.ambientIntensity||.9));
    r.sun.color.set(e.sun||"#fff0cf");r.sun.intensity=Number(night?.35:(e.sunIntensity||2.2));r.sun.position.fromArray(e.sunPosition||[6,14,9]);
    r.grid.visible=scene.settings?.showGrid!==false;
    if(c.position)r.camera.position.fromArray(c.position);
    if(c.target)r.orbit.target.fromArray(c.target);
    if(c.fov){r.camera.fov=Number(c.fov);r.camera.updateProjectionMatrix()}
  },[scene.environment,scene.editorCamera,scene.camera,scene.settings]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const settings=scene.settings||{};
    r.transform.translationSnap=settings.snapEnabled?Number(settings.snapPosition||.25):null;
    r.transform.rotationSnap=settings.snapEnabled?Number(settings.snapRotation||15)*Math.PI/180:null;
    r.transform.scaleSnap=settings.snapEnabled?Number(settings.snapScale||.05):null;
  },[scene.settings]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    let cancelled=false;
    r.transform.detach();
    while(r.objects.children.length)r.objects.remove(r.objects.children[0]);

    const roots=new Map();
    let triangles=0,meshes=0,lights=0,models=0;

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
      obj.position.y+=1.05;
    };

    const applyMaterial=(obj,data)=>{
      obj.traverse?.(o=>{
        if(!o.isMesh)return;
        meshes++;
        const pos=o.geometry?.attributes?.position?.count||0;
        const idx=o.geometry?.index?.count;
        triangles+=idx?Math.floor(idx/3):Math.floor(pos/3);
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
            const loaded=await loader.loadAsync(data.assetUrl);
            child=loaded.scene||loaded;
            if(data.normalize!==false)normalizeChild(child,8);
            child.position.sub(new r.THREE.Vector3(...(data.pivot||[0,0,0])));
            applyMaterial(child,data);
          }catch(error){console.warn("Asset 3D indisponível",data.assetUrl,error)}
        }
        if(!child)child=new r.THREE.Mesh(new r.THREE.BoxGeometry(3,1,8),new r.THREE.MeshStandardMaterial({color:"#d8e4ea"}));
      }else if(data.type&&data.type.includes("Light")){
        lights++;
        const color=data.color||"#fff2ba";
        child=new r.THREE.Mesh(new r.THREE.SphereGeometry(.18,18,12),new r.THREE.MeshBasicMaterial({color}));
        let light;
        if(data.type==="directionalLight")light=new r.THREE.DirectionalLight(color,data.intensity||2);
        else if(data.type==="spotLight")light=new r.THREE.SpotLight(color,data.intensity||3,data.distance||12,data.angle||.75,data.penumbra||.25);
        else light=new r.THREE.PointLight(color,data.intensity||3,data.distance||12);
        child.add(light);addSector(root,data);
      }else if(data.type==="shape"){
        child=new r.THREE.Mesh(shapeGeo(data.shape),new r.THREE.MeshStandardMaterial({color:data.color||"#111111",roughness:.7}));
      }else if(data.type==="hotspot"){
        child=new r.THREE.Mesh(new r.THREE.SphereGeometry(.22,18,12),new r.THREE.MeshBasicMaterial({color:data.color||"#38bdf8"}));
      }

      if(child)root.add(child);
      root.position.fromArray(data.position||[0,0,0]);
      root.rotation.set(...(data.rotation||[0,0,0]));
      root.scale.fromArray(data.scale||[1,1,1]);
      root.visible=data.visible!==false;
      roots.set(data.id,root);
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
      propsRef.current.onStats?.({triangles,meshes,lights,models,objects:(scene.objects||[]).length});
      const found=roots.get(propsRef.current.selectedId);
      if(found&&!propsRef.current.readOnly){r.transform.attach(found);r.transform.setMode(propsRef.current.mode||"translate")}
    })();

    return()=>{cancelled=true};
  },[scene.objects,scene.settings?.showSectors]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const find=(root,id)=>{
      if(root.userData?.editorId===id)return root;
      for(const c of root.children||[]){const hit=find(c,id);if(hit)return hit}
      return null;
    };
    const found=selectedId?find(r.objects,selectedId):null;
    if(found&&!readOnly){r.transform.attach(found);r.transform.setMode(mode||"translate")}
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
