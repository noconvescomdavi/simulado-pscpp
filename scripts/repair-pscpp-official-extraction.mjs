import fs from "node:fs";

const file=new URL("../data/pscpp/official-exams.json",import.meta.url);
const bank=JSON.parse(fs.readFileSync(file,"utf8"));
const artifact=/\s*,?\s*<PARSED TEXT FOR PAGE:\s*\d+\s*\/\s*\d+>\s*,?\s*(?:PSCPP\/\d{4}\s*[–-]\s*Prova\s+\w+|Diretoria de Portos e Costas|\d+)?/gi;
const clean=value=>String(value??"").replace(artifact,"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g,"").replace(/^¾\s*/gm,"• ").replace(/[ \t]+\n/g,"\n").trim();

const tideTables=()=>[
  {type:"table",title:"EXTRATO DA TÁBUA DAS MARÉS — Nível Médio = 3,43 m",headers:["Hora","Alt.(m)"],rows:[["03 38","1,0"],["09 43","5,7"],["15 54","1,1"],["22 00","5,7"],["04 18","1,1"]]},
  {type:"table",title:"TABELA I — Duração da enchente ou da vazante",headers:["Intervalo de tempo","5 40","6 00","6 20"],rows:[["1 30","16","15","13"],["1 40","20","18","16"],["1 50","24","21","19"],["2 00","28","25","23"],["2 10","32","29","26"],["2 20","36","33","30"],["2 30","41","37","34"],["2 40","46","41","38"],["2 50","50","46","42"]]},
  {type:"table",title:"TABELA II — Fração da amplitude",headers:["Fração da amplitude","4 m","5 m","6 m"],rows:[["16","0.6","0.8","1.0"],["18","0.7","0.9","1.1"],["20","0.8","1.0","1.2"],["22","0.9","1.1","1.3"],["24","1.0","1.2","1.4"],["26","1.0","1.3","1.6"],["28","1.1","1.4","1.7"],["30","1.2","1.5","1.8"],["32","1.3","1.6","1.9"],["34","1.4","1.7","2.0"],["36","1.4","1.8","2.2"],["38","1.5","1.9","2.3"],["40","1.6","2.0","2.4"],["42","1.7","2.1","2.5"]]}
];

let cleaned=0,disabled=0;
for(const q of bank.questions||[]){
  const before=JSON.stringify(q);
  q.question=clean(q.question);
  for(const option of q.options||[]) option.text=clean(option.text);
  if(before!==JSON.stringify(q)) cleaned++;

  if(["pscpp::official::2011::061","pscpp::official::2012::021"].includes(q.id)){
    const [intro]=q.question.split("EXTRATO DA TÁBUA DAS MARÉS");
    const lines=clean(intro).split("\n");
    const bullet=/^(?:•||¾)\s*/;
    const items=lines.filter(line=>bullet.test(line)).map((line,index)=>({label:String(index+1),text:line.replace(bullet,"")}));
    const stem=lines.filter(line=>!bullet.test(line)).join(" ");
    q.structure={type:"calculation",confidence:"source-reconstructed",blocks:[{type:"stem",text:stem},{type:"items",style:"statement",items},...tideTables()],options:q.options};
    q.question=clean(intro);
  }

  if(q.id==="pscpp::official::2011::058"&&q.options.map(option=>option.key).join("")!=="ABCDE"){
    const first=q.options[0].text;
    const second=q.options[1].text;
    const marker=second.indexOf("Consultando");
    const context=marker>=0?second.slice(marker):"";
    const vessel2=marker>=0?second.slice(0,marker):second;
    const combined=q.options[4].text;
    const parts=combined.split(/\n\(d\)\s*/i);
    const de=(parts[1]||"").split(/\n\(e\)\s*/i);
    q.question=clean(`${q.question}\n${first}\n${vessel2}\n${context}`);
    q.options=[q.options[2],q.options[3],{key:"C",text:clean(parts[0])},{key:"D",text:clean(de[0])},{key:"E",text:clean(de[1])}];
  }

  if(q.id==="pscpp::official::2011::049"&&q.options[4]?.text?.includes("Analisando o quadro acima")){
    const merged=q.options.map(option=>option.text).join("\n");
    const questionAt=merged.indexOf("Analisando o quadro acima");
    const finalText=questionAt>=0?merged.slice(questionAt):"";
    const firstAlternative=finalText.search(/\n\(a\)\s*/i);
    const finalStem=firstAlternative>=0?finalText.slice(0,firstAlternative):finalText;
    const alternatives=(firstAlternative>=0?finalText.slice(firstAlternative):"").split(/\n\([a-e]\)\s*/i).filter(Boolean).map(clean);
    q.question=clean(`${q.question}\n${merged.slice(0,questionAt)}\n${finalStem}`);
    if(alternatives.length===5) q.options=alternatives.map((text,index)=>({key:"ABCDE"[index],text}));
  }

  // Primary-source fidelity repairs verified against the original DPC exam PDFs.
  if(q.id==="pscpp::official::2006::009"&&q.options?.[4]){
    q.options[4].text=clean(q.options[4].text.split(/\nCaracterísticas:/)[0]);
  }
  if(q.id==="pscpp::official::2006::011"){
    q.options=["10","15","20","25","30"].map((text,index)=>({key:"ABCDE"[index],text}));
    q.correct_answer="E";q.active=true;q.status="active";q.validation_status="validated_official";delete q.exclusion_reason;
  }
  if(q.id==="pscpp::official::2008::027"){
    // B and D are duplicated in the published exam itself; keep the source exactly.
    q.active=true;q.status="active";q.validation_status="validated_official";delete q.exclusion_reason;
  }
  if(q.id==="pscpp::official::2008::050"){
    q.question=q.question.replace(/\nIV\) qualquer navio operando na linha de centro de um canal/,"\nIII) qualquer navio operando na linha de centro de um canal");
  }
  if(q.id==="pscpp::official::2011::049"){
    for(const [name,label] of [["Ajax","a"],["Thor","b"],["Intrépido","c"],["Arrojado","d"],["Zeus","e"]]){
      q.question=q.question.replace(new RegExp("\\n(?=[“\\\"]"+name+"[”\\\"])"),"\n"+label+") ");
    }
  }
  if(q.id==="pscpp::official::2011::058"){
    for(const [name,label] of [["Ajax","a"],["Perseu","b"]]){
      q.question=q.question.replace(new RegExp("\\n(?=[“\\\"]"+name+"[”\\\"])"),"\n"+label+") ");
    }
  }

  if(q.active!==false&&(!Array.isArray(q.options)||q.options.length!==5)){
    q.active=false;
    q.validation_status="pending_source_visual_repair";
    q.exclusion_reason="Questão oficial dependente de elemento visual não recuperado fielmente do PDF.";
    disabled++;
  }
}

fs.writeFileSync(file,JSON.stringify(bank,null,2)+"\n");
console.log(JSON.stringify({questions:bank.questions.length,questions_cleaned:cleaned,disabled_unrecoverable:disabled},null,2));
