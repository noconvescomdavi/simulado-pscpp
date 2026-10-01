import fs from "node:fs";
const path="data/questions/manobrabilidade.json";
const bank=JSON.parse(fs.readFileSync(path,"utf8"));
let changed=0, questions=0;
for(const q of bank.questions||[]){
  if(!String(q.id||"").startsWith("MAN-NSH-C02-")) continue;
  questions++;
  for(const option of q.options||[]){
    if(!option.key && option.letter){ option.key=String(option.letter).trim().toUpperCase(); changed++; }
  }
}
if(questions!==162) throw new Error(`Esperadas 162 questões do Capítulo 2; encontradas ${questions}`);
if(changed!==810) throw new Error(`Esperadas 810 chaves normalizadas; alteradas ${changed}`);
fs.writeFileSync(path,JSON.stringify(bank,null,2)+"\n");
console.log(`Normalizadas ${changed} alternativas em ${questions} questões.`);
