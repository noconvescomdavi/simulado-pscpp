import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const slugs=['manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const out={generated_at:new Date().toISOString(),subjects:{}};
for(const slug of slugs){
  const p=path.join(root,'reports',`${slug}-migration.json`);
  const r=JSON.parse(fs.readFileSync(p,'utf8'));
  const rows=(r.coverage||[]).filter(x=>Number(x.count)<25).map(x=>({bibliography_id:x.bibliography_id,chapter_id:x.chapter_id,unit:x.unit,count:x.count,status:x.status,need_to_25:Math.max(0,25-Number(x.count||0))}));
  out.subjects[slug]={deficit_units:rows.length,total_needed_if_all_available:rows.reduce((s,x)=>s+x.need_to_25,0),rows};
}
fs.writeFileSync(path.join(root,'reports','coverage-deficits-summary.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
// This report intentionally contains only units below the 25-question floor.
