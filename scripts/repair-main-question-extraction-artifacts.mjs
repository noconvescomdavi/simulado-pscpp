import fs from "node:fs";import path from "node:path";
const dir=path.join(process.cwd(),"data/questions");
const files=fs.readdirSync(dir).filter(x=>x.endsWith(".json"));
const cleanText=s=>String(s??"")
 .replace(/<\s*PARSED TEXT FOR PAGE[^>]*>/gi," ")
 .replace(/PARSED TEXT FOR PAGE\s*:?\s*\d*/gi," ")
 .replace(/,?\s*trecho\s*\d+\s*,?/gi,", ")
 .replace(/,?\s*p\.?\s*\d+(?:\s*[-–]\s*\d+)?\s*(?:do arquivo fornecido)?\s*,?/gi,", ")
 .replace(/\b(?:do|no|extra[ií]do do)\s+arquivo fornecido\b/gi,"")
 .replace(/\b(?:texto|conte[uú]do)\s+extra[ií]do\b/gi,"")
 .replace(/\s+,/g,",").replace(/,\s*,/g,", ").replace(/\s{2,}/g," ").replace(/\s+([.;:!?])/g,"$1").trim();
let changed=0,questions=0;const log=[];
for(const name of files){const p=path.join(dir,name),raw=fs.readFileSync(p,"utf8");let data=JSON.parse(raw),arr=Array.isArray(data)?data:data.questions;if(!Array.isArray(arr))continue;let fc=0;
 for(const q of arr){questions++;for(const k of ["question","stem"]){if(typeof q[k]==="string"){const before=q[k],after=cleanText(before);if(after!==before){q[k]=after;fc++;changed++;log.push({file:name,id:q.id,field:k,before,after})}}}
 if(Array.isArray(q.options))q.options=q.options.map(o=>{if(typeof o==="string"){const a=cleanText(o);if(a!==o){changed++;fc++;log.push({file:name,id:q.id,field:"option",before:o,after:a})}return a}if(o&&typeof o.text==="string"){const b=o.text,a=cleanText(b);if(a!==b){o={...o,text:a};changed++;fc++;log.push({file:name,id:q.id,field:"option",before:b,after:a})}return o}return o});}
 if(fc)fs.writeFileSync(p,JSON.stringify(data,null,2)+"\n");}
fs.mkdirSync("reports",{recursive:true});fs.writeFileSync("reports/extraction-artifact-repair.json",JSON.stringify({questions_scanned:questions,fields_changed:changed,changes:log},null,2)+"\n");console.log(JSON.stringify({questions_scanned:questions,fields_changed:changed,questions_changed:new Set(log.map(x=>x.file+"#"+x.id)).size},null,2));
