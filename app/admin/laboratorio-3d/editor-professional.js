export const ENVIRONMENT_PRESETS=[
  {key:"day-clear",label:"Dia claro",settings:{previewMode:"day"},environment:{background:"#78b8dc",ambient:"#dcefff",ambientIntensity:1.1,sun:"#fff4df",sunIntensity:2.6,sunPosition:[8,14,10],water:"#0b5875",exposure:1.05,fog:"#b9d8e7",fogDensity:.002}},
  {key:"twilight",label:"Crepúsculo",settings:{previewMode:"day"},environment:{background:"#493b52",ambient:"#8c7ea4",ambientIntensity:.75,sun:"#ffb26b",sunIntensity:1.4,sunPosition:[10,3,7],water:"#16394a",exposure:.85,fog:"#493b52",fogDensity:.008}},
  {key:"night-clear",label:"Noite clara",settings:{previewMode:"night"},environment:{background:"#010812",ambient:"#7897bc",ambientIntensity:.55,sun:"#c6dcff",sunIntensity:.35,sunPosition:[-18,35,-28],water:"#063046",exposure:.75,fog:"#010710",fogDensity:.004}},
  {key:"night-dark",label:"Noite sem lua",settings:{previewMode:"night"},environment:{background:"#000207",ambient:"#31475f",ambientIntensity:.25,sun:"#8fa6bf",sunIntensity:.08,sunPosition:[-18,25,-28],water:"#031722",exposure:.55,fog:"#000207",fogDensity:.006}},
  {key:"fog",label:"Visibilidade restrita",settings:{previewMode:"day"},environment:{background:"#9aa7ab",ambient:"#d9e0e1",ambientIntensity:1.15,sun:"#f3f0df",sunIntensity:.7,sunPosition:[6,10,9],water:"#49666d",exposure:.9,fog:"#aeb9bc",fogDensity:.045}}
];

export const DISPLAY_PRESETS=[
  {key:"modeling",label:"Modelagem",settings:{showGrid:true,showSectors:false,showBounds:true,showAxes:true,wireframe:false,xray:false}},
  {key:"ripeam",label:"RIPEAM",settings:{showGrid:true,showSectors:true,showBounds:false,showAxes:false,wireframe:false,xray:false}},
  {key:"materials",label:"Materiais",settings:{showGrid:false,showSectors:false,showBounds:false,showAxes:false,wireframe:false,xray:false}},
  {key:"debug",label:"Debug",settings:{showGrid:true,showSectors:true,showBounds:true,showAxes:true,wireframe:true,xray:false}},
  {key:"student",label:"Aluno",settings:{showGrid:false,showSectors:false,showBounds:false,showAxes:false,wireframe:false,xray:false}}
];

export const LIGHT_STACKS=[
  {key:"rr",label:"R-R · Sem governo",colors:["#ef3c4e","#ef3c4e"],presets:["allround-red","allround-red"]},
  {key:"rwr",label:"R-W-R · Manobra restrita",colors:["#ef3c4e","#fff2ba","#ef3c4e"],presets:["allround-red","allround-white","allround-red"]},
  {key:"gw",label:"G-W · Arrasto",colors:["#35dc83","#fff2ba"],presets:["allround-green","allround-white"]},
  {key:"wr",label:"W-R · Praticagem",colors:["#fff2ba","#ef3c4e"],presets:["allround-white","allround-red"]},
  {key:"rrr",label:"R-R-R · Restrita pelo calado",colors:["#ef3c4e","#ef3c4e","#ef3c4e"],presets:["allround-red","allround-red","allround-red"]},
  {key:"ggg",label:"G-G-G · Remoção de minas",colors:["#35dc83","#35dc83","#35dc83"],presets:["allround-green","allround-green","allround-green"]}
];

export const PERFORMANCE_BUDGET={triangles:350000,drawCalls:220,textures:80,materials:180,estimatedTextureMB:256,models:12};

export const MARITIME_ANCHORS=[
  ["masthead","Mastro / tope"],["foremast","Mastro de vante"],["aftermast","Mastro de ré"],
  ["port","Bombordo (BB)"],["starboard","Boreste (BE)"],["stern","Popa / alcançado"],["bow","Proa"],
  ["yard-port","Lais BB"],["yard-starboard","Lais BE"],["flag-halyard","Adriça / bandeira"],["waterline","Linha d'água"]
];

export function sceneCompleteness({semantic,objects=[],stats={},errors=[],warnings=[]}){
  let score=100;
  if(!semantic?.ruleNumber)score-=25;
  if(!semantic?.scenarioKey)score-=15;
  if(!objects.some(o=>o.type==="model"))score-=20;
  if((stats.modelErrors||0)>0)score-=25;
  score-=Math.min(25,errors.length*12);
  score-=Math.min(15,warnings.length*3);
  if((stats.triangles||0)>PERFORMANCE_BUDGET.triangles)score-=10;
  return Math.max(0,Math.min(100,score));
}

export function performanceIssues(stats={}){
  const issues=[];
  if((stats.triangles||0)>PERFORMANCE_BUDGET.triangles)issues.push("Triângulos acima do orçamento");
  if((stats.drawCalls||0)>PERFORMANCE_BUDGET.drawCalls)issues.push("Draw calls acima do orçamento");
  if((stats.textures||0)>PERFORMANCE_BUDGET.textures)issues.push("Texturas acima do orçamento");
  if((stats.materials||0)>PERFORMANCE_BUDGET.materials)issues.push("Materiais acima do orçamento");
  if((stats.modelErrors||0)>0)issues.push("Há modelos com falha de carregamento");
  if((stats.estimatedTextureMB||0)>PERFORMANCE_BUDGET.estimatedTextureMB)issues.push("VRAM estimada de texturas acima do orçamento");
  if((stats.models||0)>PERFORMANCE_BUDGET.models)issues.push("Modelos acima do orçamento recomendado");
  return issues;
}
