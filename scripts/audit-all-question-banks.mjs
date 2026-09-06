import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const subjects=['manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const inc=(m,k)=>m.set(k,(m.get(k)||0)+1);
const sorted=(m,limit=500)=>[...m.entries()].map(([key,count])=>({key,count})).sort((a,b)=>b.count-a.count||a.key.localeCompare(b.key,'pt-BR')).slice(0,limit);
const out={generated_at:new Date().toISOString(),subjects:{}};
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
for(const slug of subjects){
  const p=path.join(root,'data/questions',`${slug}.json`);
  const bank=JSON.parse(fs.readFileSync(p,'utf8'));
  const qs=Array.isArray(bank.questions)?bank.questions:[];
  const titles=new Map(),authors=new Map(),locators=new Map(),pairs=new Map(),modules=new Map(),topics=new Map(),topicCodes=new Map();
  let v2=0,legacy=0,tracking=0;
  for(const q of qs){
    if(q?.taxonomy?.subject_slug===slug)v2++;else legacy++;
    if(q?.tracking)tracking++;
    const title=String(q?.source?.title||'(sem título)');
    const author=String(q?.source?.author||'(sem autor)');
    const locator=String(q?.source?.locator||'(sem locator)');
    inc(titles,title);inc(authors,author);inc(locators,locator);inc(pairs,`${title} || ${locator}`);
    inc(modules,String(q?.module||'(sem módulo)'));inc(topics,String(q?.topic||'(sem tópico)'));inc(topicCodes,String(q?.topic_code||'(sem código)'));
  }
  const subject={bank_id:bank.bank_id,total:qs.length,v2,legacy,tracking,unique_ids:new Set(qs.map(q=>q.id)).size,source_titles:sorted(titles,200),source_authors:sorted(authors,100),source_locators:sorted(locators,500),source_pairs:sorted(pairs,1000),modules:sorted(modules,250),topics:sorted(topics,500),topic_codes:sorted(topicCodes,500)};
  out.subjects[slug]=subject;
  fs.writeFileSync(path.join(root,'reports',`audit-${slug}.json`),JSON.stringify({generated_at:out.generated_at,subject_slug:slug,...subject},null,2)+'\n');
}
fs.writeFileSync(path.join(root,'reports','all-question-banks-audit.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(out.subjects).map(([k,v])=>[k,{total:v.total,v2:v.v2,legacy:v.legacy,sources:v.source_titles.length,pairs:v.source_pairs.length}])),null,2));
