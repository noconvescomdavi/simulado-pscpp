import fs from "node:fs";
import path from "node:path";
import { normalizeEditorialStem } from "../lib/question-editorial-normalization.js";
import { reformulateLeakingStem } from "../lib/question-quality.js";

const root=process.cwd();
const files=[
  "data/questions/manobrabilidade.json",
  "data/questions/arte-naval.json",
  "data/questions/navegacao-aguas-restritas.json",
  "data/questions/legislacao-regulamentacao.json",
  "data/questions/meteorologia-oceanografia.json",
  "data/questions/comunicacoes.json",
  "data/questions/conhecimentos-gerais.json",
];
const restorationFiles={
  "arte-naval":["arte-naval.json"],
  comunicacoes:["comunicacoes.json"],
  "conhecimentos-gerais":["conhecimentos-gerais.json"],
  "legislacao-regulamentacao":["legislacao-regulamentacao-01.json","legislacao-regulamentacao-02.json","legislacao-regulamentacao-03.json","legislacao-regulamentacao-04.json"],
  manobrabilidade:["manobrabilidade-01.json","manobrabilidade-02.json","manobrabilidade-03.json","manobrabilidade-04.json","manobrabilidade-05.json"],
  "meteorologia-oceanografia":["meteorologia-oceanografia-01.json","meteorologia-oceanografia-02.json","meteorologia-oceanografia-03.json","meteorologia-oceanografia-04.json","meteorologia-oceanografia-05.json","meteorologia-oceanografia-06.json","meteorologia-oceanografia-07.json"],
  "navegacao-aguas-restritas":["navegacao-aguas-restritas-01.json"],
};
function applyQuestionRestorations(subject,bank){
 const packs=(restorationFiles[subject]||[]).map(name=>JSON.parse(fs.readFileSync(path.join(root,"data/question-restorations",name),"utf8")));
 const replacements=new Map(packs.flatMap(pack=>pack.questions||[]).map(q=>[String(q.id),q]));
 return {...bank,questions:(bank.questions||[]).map(q=>reformulateLeakingStem(replacements.get(String(q.id))||q))};
}
const locatorTarget=/qual disposição (?:pertence|está expressamente associada) a|o que se afirma corretamente em\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o)|recorre a\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o).+qual regra deve observar|requisitos estabelecidos em\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o)|qual enunciado define corretamente o conteúdo de\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o|regra)|(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o|regra)\\s+[^,.]{1,40}\\s+aborda\\s+[“"]|Para cumprir\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o|regra)|como deve ser compreendido\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o|regra)/i;
const report={generated_at:new Date().toISOString(),files:[],totals:{questions:0,active:0,source_candidates:0,runtime_remaining:0}};
for(const rel of files){
 const raw=JSON.parse(fs.readFileSync(path.join(root,rel),"utf8")); const slug=path.basename(rel,".json"); const bank=applyQuestionRestorations(slug,raw); let sourceCandidates=0,runtimeRemaining=0,active=0;
 for(const q of raw.questions||[]){if(q.active!==false&&locatorTarget.test(String(q.question||"")))sourceCandidates++;}
 for(const q of bank.questions||[]){report.totals.questions++;if(q.active===false)continue;active++;report.totals.active++;
  const normalized=normalizeEditorialStem(q);if(locatorTarget.test(String(normalized.question||"")))runtimeRemaining++;
 }
 report.totals.source_candidates+=sourceCandidates;report.totals.runtime_remaining+=runtimeRemaining;
 report.files.push({file:rel,questions:(raw.questions||[]).length,active,source_candidates:sourceCandidates,runtime_remaining:runtimeRemaining});
}
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports","locator-dependent-stems.json"),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if(report.totals.runtime_remaining>0){console.error("Active locator-dependent stems remain after editorial normalization.");process.exit(1);}
