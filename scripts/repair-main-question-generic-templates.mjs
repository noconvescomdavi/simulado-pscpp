import fs from "node:fs";import path from "node:path";
const dir=path.join(process.cwd(),"data/questions"),files=fs.readdirSync(dir).filter(x=>x.endsWith(".json"));
const generic=/(caracteriza[cç][aã]o tecnicamente correta|problema-base|a bibliografia atribui|conceito da unidade|descri[cç][aã]o t[eé]cnica a seguir)/i;
const batches=[
  [301,350],[351,400],[401,450],[451,500],[501,550],[551,600],[601,608]
];
const batchIds=new Set(batches.flatMap(([a,b])=>Array.from({length:b-a+1},(_,i)=>`ANV-${String(a+i).padStart(4,"0")}`)));
const title=q=>String(q?.source?.title||q?.source?.work||q?.bibliography||q?.taxonomy?.bibliography||"a bibliografia indicada").trim();
const locator=q=>String(q?.source?.locator||q?.source?.section||q?.taxonomy?.section_key||"").replace(/,?\s*trecho\s*\d+/gi,"").replace(/,?\s*\bp\.?\s*\d+(?:\s*[-–]\s*\d+)?(?:\s*do arquivo fornecido)?/gi,"").replace(/\b(?:do|no)\s+arquivo fornecido\b/gi,"").replace(/\s+,/g,",").replace(/,\s*,/g,", ").replace(/\s{2,}/g," ").trim().replace(/^,|,$/g,"").trim();
function operator(s){if(/\bEXCETO\b/i.test(s))return"EXCETO";if(/\bINCORRETA\b/i.test(s))return"INCORRETA";if(/\bINCORRETO\b/i.test(s))return"INCORRETO";if(/\bN[AÃ]O\b/i.test(s))return"NÃO";return""}
function rewrite(q,s){const src=title(q),loc=locator(q),ctx=loc?src+" — "+loc:src;const m=s.match(/(?:Na terminologia de Arte Naval,\s*)?qual termo corresponde à descrição técnica a seguir:\s*([\s\S]*?)\s*Assinale a opção correta\.?/i);if(!m)return s;const desc=m[1].replace(/\s+/g," ").trim().replace(/[.?:;]+$/,"");if(!desc)return s;return `De acordo com ${ctx}, qual termo corresponde à seguinte descrição técnica: ${desc}?`}
let scanned=0,changed=0;const changes=[];
for(const name of files){const p=path.join(dir,name),data=JSON.parse(fs.readFileSync(p,"utf8")),arr=Array.isArray(data)?data:data.questions;if(!Array.isArray(arr))continue;let fc=0;for(const q of arr){scanned++;const k=typeof q.question==="string"?"question":typeof q.stem==="string"?"stem":null;if(!k||!batchIds.has(q.id)||!generic.test(q[k]))continue;const before=q[k],after=rewrite(q,before);if(after!==before){q[k]=after;changed++;fc++;changes.push({file:name,id:q.id,before,after})}}if(fc)fs.writeFileSync(p,JSON.stringify(data,null,2)+"\n")}
fs.mkdirSync("reports",{recursive:true});fs.writeFileSync("reports/generic-template-repair.json",JSON.stringify({questions_scanned:scanned,questions_changed:changed,changes},null,2)+"\n");console.log(JSON.stringify({questions_scanned:scanned,questions_changed:changed},null,2));
