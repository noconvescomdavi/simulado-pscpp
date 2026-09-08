"use client";
import {useEffect,useRef} from "react";
import styles from "./laboratorio-3d.module.css";
const THREE_VERSION="0.180.0";
const CDN="https://esm.sh/three@"+THREE_VERSION;

export default function Admin3DViewport({scene,selectedId,mode,onSelect,onTransform}){
  const mount=useRef(null);
  const runtime=useRef(null);
  const propsRef=useRef({});
  propsRef.current={scene,selectedId,mode,onSelect,onTransform};

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
      const camera=new THREE.PerspectiveCamera(43,1,.1,500);
      camera.position.set(14,7,15);

      const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      root.innerHTML="";
      root.appendChild(renderer.domElement);

      const orbit=new OrbitControls(camera,renderer.domElement);
      orbit.target.set(0,1,0);
      orbit.enableDamping=true;

      const grid=new THREE.GridHelper(60,60,0x41677e,0x203949);
      sc.add(grid);

      const water=new THREE.Mesh(
        new THREE.PlaneGeometry(100,100),
        new THREE.MeshStandardMaterial({color:0x063b55,roughness:.28,metalness:.05})
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
        if(transform.dragging)return;
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
      ro.observe(root);
      resize();

      const loaders={
        glb:new GLTFLoader(),gltf:new GLTFLoader(),
        fbx:new FBXLoader(),obj:new OBJLoader()
      };

      runtime.current={THREE,sc,camera,renderer,orbit,grid,water,hemi,sun,objects,transform,loaders,ro,raf:0};

      const tick=()=>{
        orbit.update();
        renderer.render(sc,camera);
        runtime.current.raf=requestAnimationFrame(tick);
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
        r.ro?.disconnect();
        r.transform?.dispose?.();
        r.orbit?.dispose?.();
        r.renderer?.dispose?.();
        r.sc?.traverse?.(o=>{
          o.geometry?.dispose?.();
          if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m?.dispose?.());
        });
      }
      runtime.current=null;
      if(mount.current)mount.current.innerHTML="";
    };
  },[]);

  useEffect(()=>{
    const r=runtime.current;
    if(!r)return;
    const e=scene.environment||{},c=scene.camera||{};
    r.sc.background=new r.THREE.Color(e.background||"#071522");
    r.renderer.toneMappingExposure=Number(e.exposure||.95);
    r.water.material.color.set(e.water||"#063b55");
    r.hemi.color.set(e.ambient||"#7897bc");
    r.hemi.intensity=Number(e.ambientIntensity||.9);
    r.sun.color.set(e.sun||"#fff0cf");
    r.sun.intensity=Number(e.sunIntensity||2.2);
    r.sun.position.fromArray(e.sunPosition||[6,14,9]);
    if(c.position)r.camera.position.fromArray(c.position);
    if(c.target)r.orbit.target.fromArray(c.target);
    if(c.fov){r.camera.fov=Number(c.fov);r.camera.updateProjectionMatrix()}
  },[scene.environment,scene.camera]);

  useEffect(()=>{
    const r=runtime.current;
    if(!r)return;
    let cancelled=false;
    r.transform.detach();
    while(r.objects.children.length)r.objects.remove(r.objects.children[0]);

    async function add(data){
      let obj=null;
      if(data.type==="model"&&data.assetUrl){
        try{
          const loader=r.loaders[data.assetType]||r.loaders.glb;
          const loaded=await loader.loadAsync(data.assetUrl);
          obj=loaded.scene||loaded;
        }catch(error){console.warn("Asset 3D indisponível",data.assetUrl,error)}
      }
      if(!obj&&data.type==="model"){
        obj=new r.THREE.Mesh(
          new r.THREE.BoxGeometry(3,1,8),
          new r.THREE.MeshStandardMaterial({color:data.material?.color||"#d8e4ea"})
        );
      }
      if(data.type&&data.type.includes("Light")){
        const color=data.color||"#fff2ba";
        const bulb=new r.THREE.Mesh(
          new r.THREE.SphereGeometry(.18,18,12),
          new r.THREE.MeshBasicMaterial({color})
        );
        let light;
        if(data.type==="directionalLight")light=new r.THREE.DirectionalLight(color,data.intensity||2);
        else if(data.type==="spotLight")light=new r.THREE.SpotLight(color,data.intensity||3,data.distance||12,data.angle||.75,data.penumbra||.25);
        else light=new r.THREE.PointLight(color,data.intensity||3,data.distance||12);
        bulb.add(light);
        obj=bulb;
      }
      if(data.type==="shape"){
        obj=new r.THREE.Mesh(
          new r.THREE.SphereGeometry(.45,24,16),
          new r.THREE.MeshStandardMaterial({color:data.color||"#111111"})
        );
      }
      if(!obj||cancelled)return;
      obj.userData.editorId=data.id;
      obj.name=data.name;
      obj.position.fromArray(data.position||[0,0,0]);
      obj.rotation.set(...(data.rotation||[0,0,0]));
      obj.scale.fromArray(data.scale||[1,1,1]);
      obj.visible=data.visible!==false;
      r.objects.add(obj);
      if(data.id===propsRef.current.selectedId){
        r.transform.attach(obj);
        r.transform.setMode(propsRef.current.mode||"translate");
      }
    }

    Promise.all((scene.objects||[]).map(add));
    return()=>{cancelled=true};
  },[scene.objects]);

  useEffect(()=>{
    const r=runtime.current;
    if(!r)return;
    const found=r.objects.children.find(x=>x.userData.editorId===selectedId);
    if(found){
      r.transform.attach(found);
      r.transform.setMode(mode||"translate");
    }else r.transform.detach();
  },[selectedId,mode]);

  return <div ref={mount} className={styles.viewport}/>;
}
