import fs from "node:fs";
import path from "node:path";

const ROOT=path.join(process.cwd(),"data","questions");
const files=fs.readdirSync(ROOT).filter(x=>x.endsWith(".json"));
const locator=/(?:\b(?:item|subitem|se[cç][aã]o|cap[ií]tulo|regra|artigo)\s*(?:n[º°o]\.?\s*)?[\dIVXLCDM]+(?:[.\-][\w]+)*|\bp(?:[aá]g(?:ina)?\.?|g\.)?\s*\d+|\btrecho\s*\d+|arquivo\s+fornecido)/i;
let total=0,hits=0,negative=0;
const examples=[];
for(const file of files){
 const data=JSON.parse(fs.readFileSync(path.join(ROOT,file),"utf8"));
 const qs=Array.isArray(data)?data:(data.questions||[]);
 for(const q of qs){
  total++;
  const stem=String(q.question||"");
  if(locator.test(stem)){
   hits++;
   if(/\b(?:incorreta|incorreto|exceto|n[aã]o\s+(?:est[aá]|corresponde|representa|se\s+aplica|constitui))\b/i.test(stem))negative++;
   if(examples.length<20)examples.push({file,id:q.id,stem});
  }
 }
}
console.log(JSON.stringify({files:files.length,total,hits,negative,examples},null,2));
if(hits===0) console.log("Nenhum localizador explícito encontrado nos sete JSONs-base.");
