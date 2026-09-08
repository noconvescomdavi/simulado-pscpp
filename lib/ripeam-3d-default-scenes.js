const BASE_ENV={background:"#071522",ambient:"#7897bc",ambientIntensity:.9,sun:"#fff0cf",sunIntensity:2.2,sunPosition:[6,14,9],water:"#063b55",exposure:.95,fog:"#07121d",fogDensity:.026};
const BASE_SETTINGS={snapEnabled:true,snapPosition:.25,snapRotation:15,snapScale:.05,showGrid:true,showSectors:true,previewMode:"night"};
const BASE_CAMERA={position:[14,7,15],target:[0,1,0],fov:43};

const models={
  power:{name:"Bulk Carrier",assetUrl:"/models/ripeam/bulk_carrier.glb",assetType:"glb",position:[0,0,0]},
  sail:{name:"Sailboat",assetUrl:"/models/ripeam/sailboat.glb",assetType:"glb",position:[0,0,0]},
  fishing:{name:"Fishing Vessel",assetUrl:"/models/ripeam/fishing_vessel.glb",assetType:"glb",position:[0,0,0]},
  mine:{name:"Mine Clearance",assetUrl:"/models/ripeam/navy_mine_clearance.glb",assetType:"glb",position:[0,0,0]},
  pilot:{name:"Pilot Boat",assetUrl:"/models/ripeam/pilot_boat.glb",assetType:"glb",position:[0,0,0]},
  anchor:{name:"Bulk Carrier",assetUrl:"/models/ripeam/bulk_carrier.glb",assetType:"glb",position:[0,0,0]},
  aground:{name:"Bulk Carrier",assetUrl:"/models/ripeam/bulk_carrier.glb",assetType:"glb",position:[0,0,0]},
  seaplane:{name:"Hidroavião",assetUrl:"/models/ripeam/hidroaviao.glb",assetType:"glb",position:[0,0,0]},
  dredger:{name:"Dredger",assetUrl:"/models/ripeam/dredger.glb",assetType:"glb",position:[0,0,0]}
};

const light=(name,color,sector,position,lightPreset="",heading=0)=>({
  name,type:"pointLight",color,sector,position,rotation:[0,0,0],scale:[1,1,1],
  intensity:5,distance:14,angle:.75,penumbra:.25,lightPreset,heading,visible:true
});
const model=o=>({...o,type:"model",rotation:[0,0,0],scale:[1,1,1],visible:true,normalize:true,material:{color:"#ffffff",roughness:.5,metalness:.05,opacity:1,emissive:"#000000"}});
const shape=(name,kind,position)=>({name,type:"shape",shape:kind,color:"#111111",position,rotation:[0,0,0],scale:[1,1,1],visible:true});

const defs=[
 {key:"power",title:"Propulsão mecânica",rule:"23",objects:[
   model(models.power),light("Mastro de vante","#fff2ba",225,[2,3.8,0],"masthead",0),light("Bombordo","#ef3c4e",112.5,[0,1.55,-1.18],"port",-56.25),light("Boreste","#35dc83",112.5,[0,1.55,1.18],"starboard",56.25),light("Alcançado","#fff2ba",135,[-3.8,1.65,0],"stern",180)
 ]},
 {key:"sail",title:"Embarcação a vela",rule:"25",objects:[
   model(models.sail),light("Bombordo","#ef3c4e",112.5,[0,1.45,-1.05],"port",-56.25),light("Boreste","#35dc83",112.5,[0,1.45,1.05],"starboard",56.25),light("Alcançado","#fff2ba",135,[-2.8,1.55,0],"stern",180)
 ]},
 {key:"towShort",title:"Reboque ≤ 200 m",rule:"24",objects:[
   model({name:"Tugboat",assetUrl:"/models/ripeam/Tugboat.glb",assetType:"glb",position:[3.1,0,0]}),
   model({name:"Barge",assetUrl:"/models/ripeam/barge.fbx",assetType:"fbx",position:[-7,0,0]}),
   light("Mastro 1","#fff2ba",225,[2.5,3.8,0],"masthead",0),light("Mastro 2","#fff2ba",225,[2.5,3.25,0],"masthead",0),light("Reboque","#ffd447",135,[-1.2,1.65,0],"tow",180),light("Bombordo","#ef3c4e",112.5,[1.7,1.45,-.85],"port",-56.25),light("Boreste","#35dc83",112.5,[1.7,1.45,.85],"starboard",56.25),
   {name:"Cabo de reboque",type:"cable",color:"#d9d0bb",visible:true,cable:{fromId:"__model0",toId:"__model1",sag:.4}}
 ]},
 {key:"tow",title:"Reboque > 200 m",rule:"24",objects:[
   model({name:"Tugboat",assetUrl:"/models/ripeam/Tugboat.glb",assetType:"glb",position:[3.1,0,0]}),
   model({name:"Barge",assetUrl:"/models/ripeam/barge.fbx",assetType:"fbx",position:[-10.5,0,0]}),
   light("Mastro 1","#fff2ba",225,[2.5,3.9,0],"masthead",0),light("Mastro 2","#fff2ba",225,[2.5,3.35,0],"masthead",0),light("Mastro 3","#fff2ba",225,[2.5,2.8,0],"masthead",0),light("Reboque","#ffd447",135,[-1.2,1.65,0],"tow",180),
   shape("Losango","diamond",[-1.2,3.2,0]),{name:"Cabo de reboque",type:"cable",color:"#d9d0bb",visible:true,cable:{fromId:"__model0",toId:"__model1",sag:.6}}
 ]},
 {key:"fishing",title:"Pesca",rule:"26",objects:[
   model(models.fishing),light("Circular encarnada","#ef3c4e",360,[0,3.8,0]),light("Circular branca","#fff2ba",360,[0,3.25,0]),light("Bombordo","#ef3c4e",112.5,[0,1.4,-1],"port",-56.25),light("Boreste","#35dc83",112.5,[0,1.4,1],"starboard",56.25),
   shape("Cone inferior","coneDown",[0,3.85,0]),shape("Cone superior","coneUp",[0,3.15,0])
 ]},
 {key:"nuc",title:"Sem governo",rule:"27(a)",objects:[
   model(models.power),light("Circular encarnada superior","#ef3c4e",360,[0,3.8,0]),light("Circular encarnada inferior","#ef3c4e",360,[0,3.2,0]),light("Bombordo","#ef3c4e",112.5,[0,1.3,-1],"port",-56.25),light("Boreste","#35dc83",112.5,[0,1.3,1],"starboard",56.25),shape("Esfera superior","ball",[0,4,0]),shape("Esfera inferior","ball",[0,3.45,0])
 ]},
 {key:"ram",title:"Manobra restrita",rule:"27(b)",objects:[
   model(models.power),light("Circular encarnada superior","#ef3c4e",360,[0,4.05,0]),light("Circular branca","#fff2ba",360,[0,3.45,0]),light("Circular encarnada inferior","#ef3c4e",360,[0,2.85,0]),shape("Esfera superior","ball",[0,4.15,0]),shape("Losango","diamond",[0,3.55,0]),shape("Esfera inferior","ball",[0,2.95,0])
 ]},
 {key:"mine",title:"Remoção de minas",rule:"27(f)",objects:[
   model(models.mine),light("Verde no tope","#35dc83",360,[0,4.1,0]),light("Verde no lais BB","#35dc83",360,[0,2.65,-1.45]),light("Verde no lais BE","#35dc83",360,[0,2.65,1.45]),shape("Esfera tope","ball",[0,4.1,0]),shape("Esfera BB","ball",[0,2.65,-1.45]),shape("Esfera BE","ball",[0,2.65,1.45])
 ]},
 {key:"pilot",title:"Praticagem",rule:"29",objects:[
   model(models.pilot),light("Circular branca","#fff2ba",360,[0,3.7,0]),light("Circular encarnada","#ef3c4e",360,[0,3.15,0]),light("Bombordo","#ef3c4e",112.5,[0,1.25,-.85],"port",-56.25),light("Boreste","#35dc83",112.5,[0,1.25,.85],"starboard",56.25)
 ]},
 {key:"anchor",title:"Fundeada",rule:"30",objects:[
   model(models.anchor),light("Circular vante","#fff2ba",360,[2.8,2.7,0]),light("Circular ré","#fff2ba",360,[-3,1.9,0]),shape("Esfera de fundeio","ball",[1.8,3.3,0])
 ]},
 {key:"aground",title:"Encalhada",rule:"30(d)",objects:[
   model(models.aground),light("Circular vante","#fff2ba",360,[2.8,2.7,0]),light("Circular ré","#fff2ba",360,[-3,1.9,0]),light("Encarnada superior","#ef3c4e",360,[0,3.8,0]),light("Encarnada inferior","#ef3c4e",360,[0,3.2,0]),shape("Esfera 1","ball",[0,4.1,0]),shape("Esfera 2","ball",[0,3.55,0]),shape("Esfera 3","ball",[0,3,0])
 ]},
 {key:"seaplane",title:"Hidroavião",rule:"31",objects:[
   model(models.seaplane),light("Bombordo","#ef3c4e",112.5,[0,1.25,-1.1],"port",-56.25),light("Boreste","#35dc83",112.5,[0,1.25,1.1],"starboard",56.25),light("Branca","#fff2ba",135,[-2.2,1.2,0],"stern",180)
 ]},
 {key:"dredgePort",title:"Dragagem — obstrução a bombordo",rule:"27(d)",objects:[
   model(models.dredger),
   light("RAM encarnada superior","#ef3c4e",360,[0,4.2,0]),light("RAM branca","#fff2ba",360,[0,3.6,0]),light("RAM encarnada inferior","#ef3c4e",360,[0,3.0,0]),
   light("Bombordo obstruído 1","#ef3c4e",360,[0,2.5,-1.3]),light("Bombordo obstruído 2","#ef3c4e",360,[0,1.9,-1.3]),
   light("Boreste passagem 1","#35dc83",360,[0,2.5,1.3]),light("Boreste passagem 2","#35dc83",360,[0,1.9,1.3]),
   shape("Esfera superior","ball",[0,4.2,0]),shape("Losango","diamond",[0,3.6,0]),shape("Esfera inferior","ball",[0,3.0,0])
 ]},
 {key:"dredgeStbd",title:"Dragagem — obstrução a boreste",rule:"27(d)",objects:[
   model(models.dredger),
   light("RAM encarnada superior","#ef3c4e",360,[0,4.2,0]),light("RAM branca","#fff2ba",360,[0,3.6,0]),light("RAM encarnada inferior","#ef3c4e",360,[0,3.0,0]),
   light("Bombordo passagem 1","#35dc83",360,[0,2.5,-1.3]),light("Bombordo passagem 2","#35dc83",360,[0,1.9,-1.3]),
   light("Boreste obstruído 1","#ef3c4e",360,[0,2.5,1.3]),light("Boreste obstruído 2","#ef3c4e",360,[0,1.9,1.3]),
   shape("Esfera superior","ball",[0,4.2,0]),shape("Losango","diamond",[0,3.6,0]),shape("Esfera inferior","ball",[0,3.0,0])
 ]},
 {key:"diving",title:"Operação de mergulho",rule:"27(e)",objects:[
   light("RAM encarnada superior","#ef3c4e",360,[0,4.0,0]),light("RAM branca","#fff2ba",360,[0,3.4,0]),light("RAM encarnada inferior","#ef3c4e",360,[0,2.8,0]),
   shape("Esfera superior","ball",[0,4.0,0]),shape("Losango","diamond",[0,3.4,0]),shape("Esfera inferior","ball",[0,2.8,0])
 ]},
 {key:"cbd",title:"Restrita pelo calado",rule:"28",objects:[
   model(models.power),light("Circular encarnada 1","#ef3c4e",360,[0,4.1,0]),light("Circular encarnada 2","#ef3c4e",360,[0,3.5,0]),light("Circular encarnada 3","#ef3c4e",360,[0,2.9,0]),shape("Cilindro","cylinder",[0,3.5,0])
 ]}
];

function semanticFor(def){
  const number=String(def.rule).match(/\d+/)?.[0]||"";
  const item=String(def.rule).match(/\([a-z]\)/i)?.[0]||"";
  return {ruleNumber:number,ruleItem:item,scenarioKey:def.key,condition:"",period:"",serviceStatus:def.key==="pilot"?"pilotage-duty":"",side:def.key==="dredgePort"?"port":def.key==="dredgeStbd"?"starboard":"",towLength:def.key==="towShort"?"lte200":def.key==="tow"?"gt200":"",fishingType:def.key==="fishing"?"other":"",cardId:"",sourceRef:"Laboratório 3D RIPEAM — cena atualmente exibida ao aluno",editorialNote:"Cena canônica importada do laboratório do aluno.",lockedToRule:true};
}

export function getCanonicalStudentScenes(){
  return defs.map(def=>{
    const objects=def.objects.map((o,i)=>({...o,id:o.id||("system-"+def.key+"-"+i)}));
    for(const o of objects){
      if(o.type==="cable"&&o.cable){
        o.cable={...o.cable,fromId:o.cable.fromId==="__model0"?objects.find(x=>x.type==="model")?.id:o.cable.fromId,toId:o.cable.toId==="__model1"?objects.filter(x=>x.type==="model")[1]?.id:o.cable.toId};
      }
    }
    return {
      id:"system:"+def.key,scene_key:def.key,title:def.title,rule_ref:def.rule,card_title:def.title,description:"Cena atualmente disponível no Laboratório 3D do aluno.",status:"published",systemScene:true,liveStudentScene:true,
      config:{version:3,scenarioKey:def.key,semantic:semanticFor(def),objects,cards:[],timeline:{duration:10,loop:true,autoplay:false},settings:{...BASE_SETTINGS},environment:{...BASE_ENV},camera:{...BASE_CAMERA},editorCamera:{...BASE_CAMERA}}
    };
  });
}

export function mergeCanonicalStudentScenes(rows=[]){
  const byKey=new Map(rows.map(r=>[r.scene_key,r]));
  const merged=[];
  for(const def of getCanonicalStudentScenes()){
    const saved=byKey.get(def.scene_key);
    if(saved)merged.push({...saved,systemScene:false,liveStudentScene:true});
    else merged.push(def);
  }
  for(const row of rows)if(!merged.some(x=>x.scene_key===row.scene_key))merged.push({...row,liveStudentScene:row.status==="published"});
  return merged;
}
