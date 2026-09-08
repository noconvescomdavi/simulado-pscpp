export const LIGHT_PRESETS = [
  {key:"masthead",label:"Luz de mastro",color:"#fff2ba",sector:225,intensity:5.2,distance:16},
  {key:"port",label:"Bordo BB",color:"#ef3c4e",sector:112.5,intensity:4.8,distance:12},
  {key:"starboard",label:"Bordo BE",color:"#35dc83",sector:112.5,intensity:4.8,distance:12},
  {key:"stern",label:"Alcançado",color:"#fff2ba",sector:135,intensity:4.6,distance:12},
  {key:"tow",label:"Reboque",color:"#ffd447",sector:135,intensity:5,distance:14},
  {key:"allround-white",label:"Circular branca",color:"#fff2ba",sector:360,intensity:5,distance:14},
  {key:"allround-red",label:"Circular encarnada",color:"#ff334b",sector:360,intensity:5,distance:14},
  {key:"allround-green",label:"Circular verde",color:"#35dc83",sector:360,intensity:5,distance:14},
  {key:"allround-yellow",label:"Circular amarela",color:"#ffd447",sector:360,intensity:5,distance:14}
];

export const DAY_SHAPES = [
  {key:"ball",label:"Esfera",shape:"ball"},
  {key:"cone-up",label:"Cone vértice para cima",shape:"coneUp"},
  {key:"cone-down",label:"Cone vértice para baixo",shape:"coneDown"},
  {key:"diamond",label:"Losango",shape:"diamond"},
  {key:"cylinder",label:"Cilindro",shape:"cylinder"}
];

export const SCENE_TEMPLATES = [
  {key:"empty",label:"Cena vazia",rule_ref:"",card_title:"",objects:[]},
  {key:"power",label:"Propulsão mecânica",rule_ref:"23",card_title:"Embarcação de propulsão mecânica",objects:[
    {name:"Bulk Carrier",type:"model",assetUrl:"/models/ripeam/bulk_carrier.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true}
  ]},
  {key:"tow-short",label:"Reboque ≤ 200 m",rule_ref:"24",card_title:"Reboque até 200 m",objects:[
    {name:"Tugboat",type:"model",assetUrl:"/models/ripeam/Tugboat.glb",assetType:"glb",position:[3,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true},
    {name:"Barge",type:"model",assetUrl:"/models/ripeam/barge.fbx",assetType:"fbx",position:[-7,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true}
  ]},
  {key:"sail",label:"Embarcação a vela",rule_ref:"25",card_title:"Embarcação a vela",objects:[
    {name:"Sailboat",type:"model",assetUrl:"/models/ripeam/sailboat.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true}
  ]},
  {key:"fishing",label:"Pesca",rule_ref:"26",card_title:"Embarcação engajada na pesca",objects:[
    {name:"Fishing Vessel",type:"model",assetUrl:"/models/ripeam/fishing_vessel.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true}
  ]},
  {key:"pilot",label:"Praticagem",rule_ref:"29",card_title:"Embarcação de prático",objects:[
    {name:"Pilot Boat",type:"model",assetUrl:"/models/ripeam/pilot_boat.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true}
  ]}
];

export const CAMERA_PRESETS = {
  bow:{label:"Proa",position:[0,3,18],target:[0,1,0]},
  stern:{label:"Popa",position:[0,3,-18],target:[0,1,0]},
  port:{label:"BB",position:[-18,4,0],target:[0,1,0]},
  starboard:{label:"BE",position:[18,4,0],target:[0,1,0]},
  aerial:{label:"Aérea",position:[14,18,14],target:[0,0,0]},
  bridge:{label:"Nível da ponte",position:[10,5,12],target:[0,2,0]}
};

export function makeObject(base={}){
  return {
    id:crypto.randomUUID(),
    name:base.name||"Objeto",
    type:base.type||"model",
    assetUrl:base.assetUrl||"",
    assetType:base.assetType||"glb",
    visible:base.visible!==false,
    parentId:base.parentId||null,
    position:base.position||[0,0,0],
    rotation:base.rotation||[0,0,0],
    scale:base.scale||[1,1,1],
    pivot:base.pivot||[0,0,0],
    normalize:base.normalize!==false,
    color:base.color||"#ffffff",
    intensity:base.intensity??3,
    distance:base.distance??12,
    angle:base.angle??.75,
    penumbra:base.penumbra??.25,
    lightPreset:base.lightPreset||"",
    sector:base.sector??360,
    heading:base.heading??0,
    shape:base.shape||"ball",
    hotspot:base.hotspot||null,
    cable:base.cable||null,
    material:{color:"#ffffff",roughness:.5,metalness:.05,opacity:1,emissive:"#000000",...(base.material||{})}
  };
}
