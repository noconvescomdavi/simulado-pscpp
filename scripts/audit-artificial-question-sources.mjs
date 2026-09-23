import fs from "node:fs";import path from "node:path";
const roots=["data/questions","data/question-restorations","data/question-extensions"];
const files=[];for(const root of roots){if(!fs.existsSync(root))continue;for(const n of fs.readdirSync(root)){const p=path.join(root,n);if(fs.statSync(p).isFile()&&p.endsWith(".json"))files.push(p)}}
const badStem=/arquivo fornecido|trecho\s*\d+|\bp\.?\s*\d+|acerca de\s+(?:item|regra|art\.?|cap[ií]tulo|se[cç][aã]o)\s*[\w.()º°-]+\s*,/i;
const contamin=/POSITION:LAT|LON=|XML|SOAP|CDRL|Web Services|ASP\b|correio eletr[oô]nico|esta[cç][aã]o base|automatic location/i;
const out=[];
for(const f of files){let j;try{j=JSON.parse(fs.readFileSync(f,"utf8"))}catch{continue}for(const q of j.questions||[]){const s=String(q.question||"");const opts=(q.options||[]).map(o=>typeof o==="string"?o:o?.text||o?.label||"").join(" ");if(badStem.test(s)||contamin.test(opts))out.push({file:f,id:q.id,active:q.active!==false,status:q.status||null,stem:s,locator:q.source?.locator||null,option_contamination:contamin.test(opts)})}}
fs.mkdirSync("reports",{recursive:true});fs.writeFileSync("reports/artificial-question-sources.json",JSON.stringify(out,null,2)+"\n");console.log(JSON.stringify({files:files.length,findings:out.length,active:out.filter(x=>x.active).length,byFile:Object.fromEntries([...new Set(out.map(x=>x.file))].map(f=>[f,out.filter(x=>x.file===f).length]))},null,2));if(out.some(x=>x.active))process.exitCode=2;
