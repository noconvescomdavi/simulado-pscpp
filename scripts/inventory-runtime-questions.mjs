import fs from "node:fs";
import { createHash } from "node:crypto";
const data=JSON.parse(fs.readFileSync("data/questions/runtime-active-banks.json","utf8"));
const normalize=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
const counts={},byId=new Map(),byStem=new Map(),findings=[],records=[];
const flag=(q,slug,code,detail,related=[])=>findings.push({subject:slug,id:String(q.id??""),code,detail,related});
for(const [slug,bank] of Object.entries(data.banks)){
 counts[slug]=bank.questions.length;
 for(const q of bank.questions){
  const id=String(q.id??""),stem=normalize(q.question);
  records.push({subject:slug,id,question:q.question,correct_answer:q.correct_answer,source:q.source?.title??"",locator:q.source?.locator??""});
  if(!id)flag(q,slug,"MISSING_ID","Identificador ausente");
  if(!stem)flag(q,slug,"EMPTY_STEM","Enunciado vazio");
  if(byId.has(id))flag(q,slug,"DUPLICATE_ID","ID repetido",[byId.get(id)]);else byId.set(id,slug);
  if(stem){if(byStem.has(stem))flag(q,slug,"EXACT_NORMALIZED_STEM_DUPLICATE","Enunciado normalizado repetido",[byStem.get(stem)]);else byStem.set(stem,id);}
  const opts=q.options??[];
  const texts=opts.map(o=>normalize(typeof o==="string"?o:o.text));
  if(texts.length!==new Set(texts).size)flag(q,slug,"DUPLICATE_OPTIONS","Alternativas textualmente iguais");
  if(opts.length!==5)flag(q,slug,"OPTION_COUNT","Quantidade de alternativas diferente de cinco: "+opts.length);
  const answer=String(q.correct_answer??"").trim().toUpperCase();
  if(!opts.some((o,i)=>String(o?.key??String.fromCharCode(65+i)).toUpperCase()===answer))flag(q,slug,"INVALID_KEY","Gabarito não corresponde a alternativa");
  const explanation=String(q.explanation??"");
  const match=explanation.match(/(?:alternativa|op[cç][aã]o)\s+([A-E])\b/i);
  if(match&&answer&&match[1].toUpperCase()!==answer)flag(q,slug,"EXPLANATION_KEY_MISMATCH","Justificativa cita alternativa "+match[1]+" mas gabarito é "+answer);
  if(!explanation.trim())flag(q,slug,"MISSING_EXPLANATION","Justificativa ausente");
  if(!q.source?.title&&!q.bibliography?.publication)flag(q,slug,"MISSING_SOURCE","Fonte bibliográfica não identificada");
 }
}
const result={generated_at:new Date().toISOString(),source_hash:data.source_hash,scope:"runtime-active-banks",counts,total:records.length,unique_ids:byId.size,findings_total:findings.length,by_code:Object.fromEntries([...new Set(findings.map(x=>x.code))].map(code=>[code,findings.filter(x=>x.code===code).length])),findings};
fs.mkdirSync("audit-output",{recursive:true});
fs.writeFileSync("audit-output/inventory.json",JSON.stringify(result,null,2));
fs.writeFileSync("audit-output/active-ids.csv","subject,id\n"+records.map(x=>[x.subject,x.id].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n"));
fs.writeFileSync("audit-output/active-questions.json",JSON.stringify(records));
console.log(JSON.stringify({counts,total:result.total,unique_ids:result.unique_ids,findings_total:result.findings_total,by_code:result.by_code},null,2));
