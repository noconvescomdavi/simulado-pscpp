import fs from "node:fs";
import path from "node:path";

const dir=path.join(process.cwd(),"data","questions");
const files=fs.readdirSync(dir).filter(x=>x.endsWith(".json"));
const norm=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
let changed=0,keys=0,terms=0,wording=0;

const replacements=[
  [/\bshots de (?:corrente|amarra)\b/gi,"quartéis de amarra"],
  [/\bshot de amarra\b/gi,"quartel de amarra"],
  [/\bshot(?:s)? de corrente\b/gi,m=>/^shots/i.test(m)?"quartéis de amarra":"quartel de amarra"],
  [/\bstandard shot of chain\b/gi,"quartel de amarra padrão"],
  [/\bstudded link(?:s)?\b/gi,m=>/s$/i.test(m)?"elos com malhete":"elo com malhete"],
  [/\bhawse pipe(?:s)?\b/gi,m=>/s$/i.test(m)?"escovéns":"escovém"],
  [/\banchor cable\b/gi,"amarra"],
  [/\bDee shackle\b/gi,"manilha em D"],
  [/\bwindlass\b/gi,"molinete"]
];
function cleanText(v){
  if(typeof v!=="string") return v;
  let s=v;
  for(const [rx,to] of replacements){
    const before=s;s=s.replace(rx,to);if(s!==before)terms++;
  }
  const before=s;
  s=s.replace(/A descrição técnica [“"]?a seguir:\s*/gi,"A definição técnica “")
     .replace(/” corresponde a “/g,"” corresponde a “")
     .replace(/considere a seguinte característica:\s*/gi,"considere: ");
  if(s!==before)wording++;
  return s;
}
for(const file of files){
  const p=path.join(dir,file), bank=JSON.parse(fs.readFileSync(p,"utf8"));
  let dirty=false;
  for(const q of bank.questions||[]){
    // Remove questões geradas a partir de fragmentos truncados/corrompidos da NORMAM.
    if(["LEG-0382","LEG-0602","LEG-1179","LEG-1273"].includes(q.id)){ q.__remove=true; dirty=true; continue; }
    const exp=String(q.explanation||"");
    let m=exp.match(/s[aã]o verdadeiras as proposi[cç][oõ]es correspondentes [aà] alternativa\s+([A-E])/i);
    if(m&&String(q.correct_answer).toUpperCase()!==m[1].toUpperCase()){
      q.correct_answer=m[1].toUpperCase();keys++;dirty=true;
    }
    if(/marque a alternativa incorreta/i.test(q.question||"")){
      m=exp.match(/alternativa\s+([A-E])\s+(?:é|esta)\s+(?:a\s+)?incorreta/i);
      if(m&&String(q.correct_answer).toUpperCase()!==m[1].toUpperCase()){
        q.correct_answer=m[1].toUpperCase();keys++;dirty=true;
      }
    }
    for(const k of ["question","explanation","topic","module"]){
      const v=cleanText(q[k]); if(v!==q[k]){q[k]=v;dirty=true;}
    }
    if(Array.isArray(q.options)) for(const o of q.options){
      const v=cleanText(o.text); if(v!==o.text){o.text=v;dirty=true;}
    }
  }
  if(dirty){fs.writeFileSync(p,JSON.stringify(bank,null,2)+"\n");changed++;}
}
console.log(JSON.stringify({files_changed:changed,answer_keys_fixed:keys,terminology_replacements:terms,wording_rewrites:wording}));

// repair-run: 2026-09-20T01:15Z
