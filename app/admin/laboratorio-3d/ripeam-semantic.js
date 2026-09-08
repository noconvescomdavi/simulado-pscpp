export const RIPEAM_RULES = [
  {number:"20",title:"Aplicação — luzes e marcas",kind:"reference",items:[
    {key:"r20",item:"",label:"Aplicação geral",summary:"Luzes: do pôr ao nascer do Sol; também em visibilidade restrita durante o dia. Marcas: de dia."}
  ]},
  {number:"21",title:"Definições — luzes",kind:"reference",items:[
    {key:"r21a",item:"(a)",label:"Luz de mastro",summary:"Branca · 225°",expected:{lights:[["masthead",1]]}},
    {key:"r21b",item:"(b)",label:"Luzes de bordos",summary:"Verde BE + encarnada BB · 112,5° cada",expected:{lights:[["port",1],["starboard",1]]}},
    {key:"r21c",item:"(c)",label:"Luz de alcançado",summary:"Branca · 135°",expected:{lights:[["stern",1]]}},
    {key:"r21d",item:"(d)",label:"Luz de reboque",summary:"Amarela · 135°",expected:{lights:[["tow",1]]}},
    {key:"r21e",item:"(e)",label:"Luz circular",summary:"360°",expected:{}}
  ]},
  {number:"23",title:"Embarcação de propulsão mecânica em movimento",kind:"scene",items:[
    {key:"power",item:"",label:"Propulsão mecânica em movimento",condition:"underway",period:"night",model:"bulk_carrier.glb",expected:{lights:[["masthead",1],["port",1],["starboard",1],["stern",1]]},notes:"A segunda luz de mastro é obrigatória para embarcações de 50 m ou mais e facultativa para menores de 50 m."}
  ]},
  {number:"24",title:"Reboque e empurra",kind:"scene",items:[
    {key:"towShort",item:"",label:"Reboque ≤ 200 m",condition:"underway",period:"night",towLength:"lte200",expected:{lights:[["masthead",2],["port",1],["starboard",1],["stern",1],["tow",1]],cable:true}},
    {key:"tow",item:"",label:"Reboque > 200 m",condition:"underway",period:"night",towLength:"gt200",expected:{lights:[["masthead",3],["tow",1]],shapes:[["diamond",1]],cable:true}}
  ]},
  {number:"25",title:"Embarcações a vela e a remo",kind:"scene",items:[
    {key:"sail",item:"",label:"Embarcação a vela em movimento",condition:"underway",period:"night",expected:{lights:[["port",1],["starboard",1],["stern",1]]}},
    {key:"sail-motor",item:"(e)",label:"Vela usando também propulsão mecânica",condition:"underway",period:"day",expected:{shapes:[["coneDown",1]]}}
  ]},
  {number:"26",title:"Embarcações de pesca",kind:"scene",items:[
    {key:"trawling",item:"(b)",label:"Pesca de arrasto",condition:"underway",period:"night",fishingType:"trawling",expected:{colors:["#35dc83","#fff2ba"]}},
    {key:"fishing",item:"(c)",label:"Pesca que não seja de arrasto",condition:"underway",period:"night",fishingType:"other",expected:{colors:["#ef3c4e","#fff2ba"]}}
  ]},
  {number:"27",title:"Sem governo / manobra restrita",kind:"scene",items:[
    {key:"nuc",item:"(a)",label:"Embarcação sem governo",condition:"underway",expected:{colors:["#ef3c4e","#ef3c4e"],shapes:[["ball",2]]}},
    {key:"ram",item:"(b)",label:"Capacidade de manobra restrita",condition:"underway",expected:{colors:["#ef3c4e","#fff2ba","#ef3c4e"],shapes:[["ball",2],["diamond",1]]}},
    {key:"dredgePort",item:"(d)",label:"Dragagem — bordo obstruído a bombordo",condition:"working",side:"port",expected:{colors:["#ef3c4e","#35dc83"]}},
    {key:"dredgeStbd",item:"(d)",label:"Dragagem — bordo obstruído a boreste",condition:"working",side:"starboard",expected:{colors:["#ef3c4e","#35dc83"]}},
    {key:"diving",item:"(e)",label:"Operação de mergulho",condition:"working",expected:{}},
    {key:"mine",item:"(f)",label:"Remoção de minas",condition:"working",expected:{colors:["#35dc83","#35dc83","#35dc83"],shapes:[["ball",3]]},notes:"É perigoso aproximar-se a menos de 1.000 m."}
  ]},
  {number:"28",title:"Embarcação restrita devido ao calado",kind:"scene",items:[
    {key:"cbd",item:"",label:"Restrita devido ao calado",condition:"underway",expected:{colors:["#ef3c4e","#ef3c4e","#ef3c4e"],shapes:[["cylinder",1]]}}
  ]},
  {number:"29",title:"Embarcações de Prático",kind:"scene",items:[
    {key:"pilot",item:"",label:"Em serviço de praticagem — em movimento",condition:"underway",serviceStatus:"pilotage-duty",period:"night",expected:{colors:["#fff2ba","#ef3c4e"],lights:[["port",1],["starboard",1],["stern",1]]}},
    {key:"pilot-anchor",item:"",label:"Em serviço de praticagem — fundeada",condition:"anchored",serviceStatus:"pilotage-duty",period:"night",expected:{colors:["#fff2ba","#ef3c4e"],anchorSignals:true}}
  ]},
  {number:"30",title:"Embarcações fundeadas e encalhadas",kind:"scene",items:[
    {key:"anchor",item:"",label:"Fundeada",condition:"anchored",expected:{shapes:[["ball",1]]}},
    {key:"aground",item:"(d)",label:"Encalhada",condition:"aground",expected:{colors:["#ef3c4e","#ef3c4e"],shapes:[["ball",3]]}}
  ]},
  {number:"31",title:"Hidroaviões",kind:"scene",items:[
    {key:"seaplane",item:"",label:"Hidroavião",condition:"underway",expected:{}}
  ]}
];

export const PERIOD_LABELS={day:"Dia",night:"Noite",both:"Dia e noite"};
export const CONDITION_LABELS={underway:"Em movimento",anchored:"Fundeada",aground:"Encalhada",working:"Em operação",stopped:"Parada sem seguimento",custom:"Personalizada"};
export const SERVICE_LABELS={"pilotage-duty":"Em serviço de praticagem","not-on-duty":"Fora do serviço de praticagem"};
export const SIDE_LABELS={port:"Bombordo",starboard:"Boreste"};

export function getRule(number){return RIPEAM_RULES.find(r=>r.number===String(number||""))||null}
export function getSemanticItem(ruleNumber,key){
  const rule=getRule(ruleNumber);if(!rule)return null;
  return rule.items.find(i=>i.key===key)||null;
}
export function semanticLabel(semantic={}){
  const rule=getRule(semantic.ruleNumber);
  const item=getSemanticItem(semantic.ruleNumber,semantic.scenarioKey);
  if(!rule)return "SEM REGRA RIPEAM VINCULADA";
  return "REGRA "+rule.number+(item?.item?item.item:"")+" · "+(item?.label||rule.title);
}
export function semanticBreadcrumb(semantic={}){
  const rule=getRule(semantic.ruleNumber),item=getSemanticItem(semantic.ruleNumber,semantic.scenarioKey);
  const parts=[];
  if(rule)parts.push("Regra "+rule.number+" — "+rule.title);
  if(item)parts.push(item.label);
  if(semantic.condition)parts.push(CONDITION_LABELS[semantic.condition]||semantic.condition);
  if(semantic.period)parts.push(PERIOD_LABELS[semantic.period]||semantic.period);
  return parts;
}
