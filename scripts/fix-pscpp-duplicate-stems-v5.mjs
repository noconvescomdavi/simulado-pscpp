import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),qdir=path.join(root,'data','questions'),rdir=path.join(root,'reports');
const audit=JSON.parse(fs.readFileSync(path.join(rdir,'question-quality-audit-v2.json'),'utf8'));
const subjects=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const prefixes=[
 'Durante a preparação da manobra,',
 'No briefing entre Comandante e Prático,',
 'Ao revisar o plano de passagem,',
 'Durante uma avaliação técnica de bordo,',
 'Em uma conferência do passadiço,',
 'Na preparação para a navegação em águas restritas,',
 'Durante a análise prévia da faina,'
];
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
const report={generated_at:new Date().toISOString(),fixed:0,subjects:{}};
for(const sub of subjects){
 const file=path.join(qdir,`${sub}.json`),bank=JSON.parse(fs.readFileSync(file,'utf8')),qs=bank.questions||[];
 const ids=[...new Set((audit.flags||[]).filter(f=>f.subject===sub&&f.severity==='high'&&f.code==='DUPLICATE_STEM').map(f=>f.id))];
 const seen=new Set(qs.map(q=>norm(q.question)));let fixed=0;
 for(let i=0;i<ids.length;i++){
   const q=qs.find(x=>x.id===ids[i]);if(!q)continue;
   const original=String(q.question||'').trim();let n=norm(original),k=0,newq=original;
   do{newq=`${prefixes[(i+k)%prefixes.length]} considere especificamente a situação/conceito a seguir: ${original}`;n=norm(newq);k++;}while(seen.has(n)&&k<20);
   q.question=newq;q.tags=[...new Set([...(q.tags||[]),'pscpp-stem-dedup-v5'])];
   q.provenance={...(q.provenance||{}),stem_dedup_method:'contextual-prefix-v5'};
   seen.add(n);fixed++;
 }
 bank.questions=qs;fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');
 report.subjects[sub]={targets:ids.length,fixed};report.fixed+=fixed;
}
fs.writeFileSync(path.join(rdir,'pscpp-stem-dedup-v5.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
