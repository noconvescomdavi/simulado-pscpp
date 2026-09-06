import fs from 'node:fs';
const bank=JSON.parse(fs.readFileSync('data/questions/manobrabilidade.json','utf8'));
const rows=new Map();
for(const q of bank.questions||[]){
  const key=[q?.source?.title||'',q?.module||'',q?.topic_code||'',q?.topic||'',q?.taxonomy?.chapter_id||'LEGACY'].join('\t');
  rows.set(key,(rows.get(key)||0)+1);
}
const arr=[...rows.entries()].map(([k,count])=>{const [source,module,topic_code,topic,chapter_id]=k.split('\t');return{count,source,module,topic_code,topic,chapter_id}}).sort((a,b)=>a.source.localeCompare(b.source)||a.chapter_id.localeCompare(b.chapter_id)||b.count-a.count||a.topic.localeCompare(b.topic));
let out='# Distribuição de tópicos — Manobrabilidade\n\n| Qtd | Fonte | Módulo | Código | Tópico | chapter_id |\n|---:|---|---|---|---|---|\n';
for(const r of arr)out+=`| ${r.count} | ${r.source.replaceAll('|','\\|')} | ${r.module.replaceAll('|','\\|')} | ${r.topic_code} | ${r.topic.replaceAll('|','\\|')} | ${r.chapter_id} |\n`;
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/manobrabilidade-topic-distribution.md',out);
console.log(`rows=${arr.length}`);
