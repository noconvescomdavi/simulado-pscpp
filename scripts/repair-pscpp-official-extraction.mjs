import fs from "node:fs";

const file=new URL("../data/pscpp/official-exams.json",import.meta.url);
const bank=JSON.parse(fs.readFileSync(file,"utf8"));
const artifact=/\s*,?\s*<PARSED TEXT FOR PAGE:\s*\d+\s*\/\s*\d+>\s*,?\s*(?:PSCPP\/\d{4}\s*[–-]\s*Prova\s+\w+|Diretoria de Portos e Costas|\d+)?/gi;
const clean=value=>String(value??"").replace(artifact,"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g,"").replace(/^¾\s*/gm,"• ").replace(/[ \t]+\n/g,"\n").trim();

const tideTables=()=>[
  {type:"table",title:"Extrato da Tábua das Marés",headers:["Hora","Altura (m)"],rows:[["03h38","1,0"],["09h43","5,7"],["15h54","1,1"],["22h00","5,7"],["04h18","1,1"]]},
  {type:"table",title:"Tabela I — duração da enchente ou vazante",headers:["Intervalo","5h40","6h00","6h20"],rows:[["1h30","16","15","13"],["1h40","20","18","16"],["1h50","24","21","19"],["2h00","28","25","23"],["2h10","32","29","26"],["2h20","36","33","30"],["2h30","41","37","34"],["2h40","46","41","38"],["2h50","50","46","42"]]},
  {type:"table",title:"Tabela II — fração da amplitude",headers:["Fração","Amplitude 4 m","Amplitude 5 m","Amplitude 6 m"],rows:[["1/6","0,6","0,8","1,0"],["2/6","1,3","1,6","1,9"],["3/6","2,0","2,5","3,0"],["4/6","2,7","3,4","4,0"],["5/6","3,4","4,2","5,0"],["6/6","4,0","5,0","6,0"]]}
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
    const items=lines.filter(line=>/^•\s/.test(line)).map((line,index)=>({label:String(index+1),text:line.replace(/^•\s*/,"")}));
    const stem=lines.filter(line=>!/^•\s/.test(line)).join(" ");
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

  if(q.active!==false&&(!Array.isArray(q.options)||q.options.length!==5)){
    q.active=false;
    q.validation_status="pending_source_visual_repair";
    q.exclusion_reason="Questão oficial dependente de elemento visual não recuperado fielmente do PDF.";
    disabled++;
  }
}

fs.writeFileSync(file,JSON.stringify(bank,null,2)+"\n");
console.log(JSON.stringify({questions:bank.questions.length,questions_cleaned:cleaned,disabled_unrecoverable:disabled},null,2));
