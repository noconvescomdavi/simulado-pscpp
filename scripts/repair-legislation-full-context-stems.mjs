import fs from "node:fs";
const file="data/questions/legislacao-regulamentacao.json";
const bank=JSON.parse(fs.readFileSync(file,"utf8"));
const pattern=/^De acordo com (.+?), acerca de (.+?), assinale a alternativa que apresenta corretamente a disposição, requisito ou conceito previsto na publicação\.?$/i;
let changed=0,quarantined=0;
for(const q of bank.questions||[]){
 const stem=String(q.question||"").trim(),m=stem.match(pattern);
 if(!m)continue;
 const work=String(q.source?.title||m[1]).trim();
 const excerpt=String(m[2]).trim();
 const bad=/^(?:item|regra|art\.?|cap[ií]tulo|se[cç][aã]o)\s*[\w.()º°-]+\s*$/i.test(excerpt)||excerpt.length<28;
 if(bad){
   q.active=false;q.status="quarantined";q.quality={...(q.quality||{}),quarantine_reason:"full_context_excerpt_missing",quarantined_at:"2026-09-23"};quarantined++;continue;
 }
 const label=/NORMAM.?204|Tráfego e Permanência de Embarcações em Águas Jurisdicionais Brasileiras/i.test(work)
   ?"NORMAM 204/DPC — Normas da Autoridade Marítima para Tráfego e Permanência de Embarcações em Águas Jurisdicionais Brasileiras"
   : work;
 q.question=`De acordo com a ${label}, acerca de “${excerpt}”, assinale a alternativa que apresenta corretamente o previsto na publicação.`;
 q.provenance={...(q.provenance||{}),full_context_stem:{version:"2026-09-23",source_excerpt_preserved:true}};
 changed++;
}
fs.writeFileSync(file,JSON.stringify(bank,null,2)+"\n");
console.log(JSON.stringify({changed,quarantined},null,2));
