import fs from "node:fs";
import path from "node:path";
import { normalizeEditorialStem } from "../lib/question-editorial-normalization.js";
import { applyQuestionRestorations } from "../lib/question-restorations.js";

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
const locatorTarget=/qual disposição (?:pertence|está expressamente associada) a|o que se afirma corretamente em\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o)|recorre a\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o).+qual regra deve observar|requisitos estabelecidos em\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o)/i;
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
