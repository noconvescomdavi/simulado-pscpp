import fs from "node:fs";
import path from "node:path";

const root=path.resolve("data/pscpp");
const files=["generated-questions.json",...fs.readdirSync(path.join(root,"generated-batches")).filter(name=>/^batch_\d{3}\.json$/.test(name)).sort().map(name=>path.join("generated-batches",name))];
let changedQuestions=0;
for(const relative of files){
  const file=path.join(root,relative);
  const bank=JSON.parse(fs.readFileSync(file,"utf8"));
  for(const q of bank.questions||[]){
    const before=JSON.stringify(q);
    q.question=String(q.question||"")
      .replace(/Quanto a\s*\.\s*Assinale a (?:opção|alternativa) correta, é correto afirmar:/gi,"É correto afirmar que:")
      .replace(/([.!?])\s+qual\b/g,"$1 Qual")
      .replace(/\s+([,.;:?!])/g,"$1")
      .replace(/[ \t]+\n/g,"\n").trim();
    if(q.id==="pscpp::generated::man::0910") q.question=q.question.replace("( ) Sobre “Parada”, considere a proposição: A manobra de parada avalia a capacidade de reduzir o movimento longitudinal após uma ordem de máquina apropriada.\n( ) É correto afirmar que: Resistência e inércia não afetam aceleração.","( ) Sobre “Parada”, considere a proposição: A distância de parada depende da condição inicial e da resposta hidrodinâmica e propulsiva do navio.\n( ) É correto afirmar que: Resistência e inércia não afetam aceleração.");
    const key=String(q.correct_answer||"").toUpperCase();
    q.explanation=String(q.explanation||"")
      .replace(/(corresponde à alternativa\s+)[A-E]/gi,`$1${key}`)
      .replace(/(sequência correta é a alternativa\s+)[A-E]/gi,`$1${key}`)
      .replace(/(combinação correta é a alternativa\s+)[A-E]/gi,`$1${key}`)
      .replace(/[ \t]+\n/g,"\n").trim();
    if(before!==JSON.stringify(q)) changedQuestions++;
  }
  fs.writeFileSync(file,JSON.stringify(bank)+"\n");
}
console.log(JSON.stringify({files:files.length,changed_questions:changedQuestions},null,2));
