import fs from "node:fs";import path from "node:path";
const roots=["data/questions","data/question-restorations","data/question-extensions"];
const files=[];for(const root of roots){if(!fs.existsSync(root))continue;for(const n of fs.readdirSync(root)){const p=path.join(root,n);if(fs.statSync(p).isFile()&&p.endsWith(".json"))files.push(p)}}
const artifact=/arquivo fornecido|trecho\s*\d+|\bp\.?\s*\d+|acerca de\s+(?:item|regra|art\.?|cap[ií]tulo|se[cç][aã]o)\s*[\w.()º°-]+\s*,/i;
const contamination=[/POSITION:LAT|LON=/i,/XML|SOAP|CDRL|Web Services|ASP\b/i,/correio eletr[oô]nico/i,/esta[cç][aã]o base|automatic location/i];
let changed=0,quarantined=0;
for(const file of files){let bank;try{bank=JSON.parse(fs.readFileSync(file,"utf8"))}catch{continue}let dirty=false;
 for(const q of bank.questions||[]){const stem=String(q.question||"").trim();if(!artifact.test(stem))continue;
  const opts=(q.options||[]).map(o=>typeof o==="string"?o:o?.text||o?.label||"").join(" ");const hits=contamination.reduce((n,re)=>n+(re.test(opts)?1:0),0);
  const m=stem.match(/^De acordo com (.+?), acerca de (.+?), assinale a alternativa que apresenta corretamente a disposição, requisito ou conceito previsto na publicação\.?$/i);
  const excerpt=m?.[2]?.trim()||"";const usable=excerpt.length>=28&&!/^(?:item|regra|art\.?|cap[ií]tulo|se[cç][aã]o)\s*[\w.()º°-]+\s*$/i.test(excerpt)&&!artifact.test(excerpt);
  if(!usable||hits>=2){q.active=false;q.status="quarantined";q.quality={...(q.quality||{}),quarantine_reason:hits>=2?"semantic_option_contamination_requires_source_review":"full_context_excerpt_missing",quarantined_at:"2026-09-23"};quarantined++;dirty=true;continue}
  let work=String(q.source?.title||m?.[1]||"").trim();if(/NORMAM.?204|Tráfego e Permanência de Embarcações em Águas Jurisdicionais Brasileiras/i.test(work))work="NORMAM 204/DPC — Normas da Autoridade Marítima para Tráfego e Permanência de Embarcações em Águas Jurisdicionais Brasileiras";
  q.question=`De acordo com a ${work}, acerca de “${excerpt}”, assinale a alternativa que apresenta corretamente o previsto na publicação.`;q.provenance={...(q.provenance||{}),full_context_stem:{version:"2026-09-23",source_excerpt_preserved:true}};changed++;dirty=true;
 }if(dirty)fs.writeFileSync(file,JSON.stringify(bank,null,2)+"\n");
}
console.log(JSON.stringify({changed,quarantined},null,2));
