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
  ]},
  {key:"diving",label:"Operação de mergulho",rule_ref:"27(e)",card_title:"Embarcação em operação de mergulho",objects:[
    {name:"Tugboat",type:"model",assetUrl:"/models/ripeam/Tugboat.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true},
    {name:"RAM vermelha superior",type:"pointLight",color:"#ff334b",sector:360,position:[0,4.05,0]},
    {name:"RAM branca",type:"pointLight",color:"#fff2ba",sector:360,position:[0,3.45,0]},
    {name:"RAM vermelha inferior",type:"pointLight",color:"#ff334b",sector:360,position:[0,2.85,0]}
  ]},
  {key:"dredge-port",label:"Dragagem — obstrução a bombordo",rule_ref:"27(d)",card_title:"Dragagem com lado de passagem a boreste",objects:[
    {name:"Dredger",type:"model",assetUrl:"/models/ripeam/dredger.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true}
  ]},
  {key:"dredge-stbd",label:"Dragagem — obstrução a boreste",rule_ref:"27(d)",card_title:"Dragagem com lado de passagem a bombordo",objects:[
    {name:"Dredger",type:"model",assetUrl:"/models/ripeam/dredger.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true}
  ]},
  {key:"cbd",label:"Restrita pelo calado",rule_ref:"28",card_title:"Embarcação restrita pelo seu calado",objects:[
    {name:"Bulk Carrier",type:"model",assetUrl:"/models/ripeam/bulk_carrier.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true},
    {name:"Vermelha 1",type:"pointLight",color:"#ff334b",sector:360,position:[0,4.1,0]},
    {name:"Vermelha 2",type:"pointLight",color:"#ff334b",sector:360,position:[0,3.5,0]},
    {name:"Vermelha 3",type:"pointLight",color:"#ff334b",sector:360,position:[0,2.9,0]},
    {name:"Cilindro",type:"shape",shape:"cylinder",position:[0,3.45,0]}
  ]},
  {key:"mine-clearance",label:"Remoção de minas",rule_ref:"27(f)",card_title:"Embarcação em operação de remoção de minas",objects:[
    {name:"Mine Clearance",type:"model",assetUrl:"/models/ripeam/navy_mine_clearance.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true},
    {name:"Verde tope",type:"pointLight",color:"#35dc83",sector:360,position:[0,4.1,0]},
    {name:"Verde BB",type:"pointLight",color:"#35dc83",sector:360,position:[0,2.65,-1.45]},
    {name:"Verde BE",type:"pointLight",color:"#35dc83",sector:360,position:[0,2.65,1.45]}
  ]},
  {key:"anchor",label:"Fundeada",rule_ref:"30",card_title:"Embarcação fundeada",objects:[
    {name:"Bulk Carrier",type:"model",assetUrl:"/models/ripeam/bulk_carrier.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true},
    {name:"Circular vante",type:"pointLight",color:"#fff2ba",sector:360,position:[2.8,2.7,0]},
    {name:"Circular ré",type:"pointLight",color:"#fff2ba",sector:360,position:[-3,1.9,0]}
  ]},
  {key:"aground",label:"Encalhada",rule_ref:"30(d)",card_title:"Embarcação encalhada",objects:[
    {name:"Bulk Carrier",type:"model",assetUrl:"/models/ripeam/bulk_carrier.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true},
    {name:"Esfera 1",type:"shape",shape:"ball",position:[0,4.1,0]},
    {name:"Esfera 2",type:"shape",shape:"ball",position:[0,3.55,0]},
    {name:"Esfera 3",type:"shape",shape:"ball",position:[0,3,0]}
  ]},
  {key:"seaplane",label:"Hidroavião",rule_ref:"31",card_title:"Hidroavião na água",objects:[
    {name:"Hidroavião",type:"model",assetUrl:"/models/ripeam/hidroaviao.glb",assetType:"glb",position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],normalize:true}
  ]}
];

export const CAMERA_PRESETS = {
  bow:{label:"Proa",position:[0,3,18],target:[0,1,0]},
  stern:{label:"Popa",position:[0,3,-18],target:[0,1,0]},
  port:{label:"BB",position:[-18,4,0],target:[0,1,0]},
  starboard:{label:"BE",position:[18,4,0],target:[0,1,0]},
  ahead225stbd:{label:"22,5° BE",position:[7,3,17],target:[0,1,0]},
  ahead225port:{label:"22,5° BB",position:[-7,3,17],target:[0,1,0]},
  abaft225stbd:{label:"22,5° AR BE",position:[7,3,-17],target:[0,1,0]},
  abaft225port:{label:"22,5° AR BB",position:[-7,3,-17],target:[0,1,0]},
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
    anchorName:base.anchorName||"",
    position:base.position||[0,0,0],
    rotation:base.rotation||[0,0,0],
    scale:base.scale||[1,1,1],
    pivot:base.pivot||[0,0,0],
    waterline:base.waterline??0,
    trim:base.trim??0,
    heel:base.heel??0,
    normalize:base.normalize!==false,
    color:base.color||"#ffffff",
    intensity:base.intensity??3,
    lightSize:base.lightSize??1,
    distance:base.distance??12,
    angle:base.angle??.75,
    penumbra:base.penumbra??.25,
    lightPreset:base.lightPreset||"",
    sector:base.sector??360,
    heading:base.heading??0,
    shape:base.shape||"ball",
    hotspot:base.hotspot||null,
    cable:base.cable||null,
    material:{mode:"original",color:"#ffffff",roughness:.5,metalness:.05,opacity:1,emissive:"#000000",doubleSide:false,...(base.material||{})}
  };
}

const CIS_CODES="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const CIS_NAMES={A:"Alpha",B:"Bravo",C:"Charlie",D:"Delta",E:"Echo",F:"Foxtrot",G:"Golf",H:"Hotel",I:"India",J:"Juliett",K:"Kilo",L:"Lima",M:"Mike",N:"November",O:"Oscar",P:"Papa",Q:"Quebec",R:"Romeo",S:"Sierra",T:"Tango",U:"Uniform",V:"Victor",W:"Whiskey",X:"X-ray",Y:"Yankee",Z:"Zulu"};
const CIS_PALETTES=[
  ["#ffffff","#1965a0"],["#d71920"],["#1965a0","#ffffff","#d71920"],["#f3c51d","#1965a0"],
  ["#1965a0","#d71920"],["#ffffff","#d71920"],["#f3c51d","#1965a0"],["#ffffff","#d71920"],
  ["#f3c51d","#111111"],["#1965a0","#ffffff"],["#f3c51d","#1965a0"],["#f3c51d","#111111"],
  ["#1965a0","#ffffff"],["#1965a0","#ffffff"],["#f3c51d","#d71920"],["#1965a0","#ffffff"],
  ["#f3c51d"],["#d71920","#f3c51d"],["#ffffff","#1965a0"],["#d71920","#ffffff","#1965a0"],
  ["#d71920","#ffffff"],["#ffffff","#d71920"],["#1965a0","#ffffff","#d71920"],["#ffffff","#1965a0"],
  ["#f3c51d","#d71920"],["#f3c51d","#1965a0"]
];

export const DECORATIVE_OBJECTS=CIS_CODES.map((code,index)=>({
  key:"cis-"+code.toLowerCase(),
  label:"Bandeira CIS — "+(CIS_NAMES[code]||("Numeral "+code)),
  type:"flag",flagCode:code,
  flagColors:CIS_PALETTES[index%26],
  position:[0,4.5,0],scale:[.9,.9,.9]
})).concat([
  {key:"cis-sub1",label:"CIS — 1º substituto",type:"flag",flagCode:"S1",flagColors:["#1965a0","#f3c51d"],position:[0,4.5,0],scale:[.9,.9,.9]},
  {key:"cis-sub2",label:"CIS — 2º substituto",type:"flag",flagCode:"S2",flagColors:["#1965a0","#ffffff"],position:[0,4.5,0],scale:[.9,.9,.9]},
  {key:"cis-sub3",label:"CIS — 3º substituto",type:"flag",flagCode:"S3",flagColors:["#ffffff","#111111"],position:[0,4.5,0],scale:[.9,.9,.9]}
]);
