import fs from 'node:fs';
import path from 'node:path';
import { BIBLIOGRAPHY } from '../data/study/bibliography.js';

const root=process.cwd();
const slugs=['manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const knownPending={
  manobrabilidade:new Set(['santos-manobrabilidade','santos-hidrodinamica']),
  'navegacao-aguas-restritas':new Set(['bento','nav-doc-6']),
  'meteorologia-oceanografia':new Set(['met-2','pianc-hydromet']),
  'conhecimentos-gerais':new Set(['pianc-channels','livingstone','stopford','pimenta'])
};
const out={generated_at:new Date().toISOString(),subjects:{}};

for(const slug of slugs){
  const bankPath=path.join(root,'data','questions',`${slug}.json`);
  const bank=JSON.parse(fs.readFileSync(bankPath,'utf8'));
  const questions=Array.isArray(bank.questions)?bank.questions:[];
  const counts=new Map();
  for(const q of questions){
    const chapterId=q?.taxonomy?.chapter_id;
    if(chapterId)counts.set(chapterId,(counts.get(chapterId)||0)+1);
  }

  const migrationPath=path.join(root,'reports',`${slug}-migration.json`);
  const migration=fs.existsSync(migrationPath)?JSON.parse(fs.readFileSync(migrationPath,'utf8')):{};
  const priorStatus=new Map((migration.coverage||[]).map(x=>[x.chapter_id,x.status]));

  const rows=[];
  for(const work of (BIBLIOGRAPHY[slug]||[])){
    for(const section of (work.sections||[])){
      const chapterId=`${work.key}::${section.key}`;
      const count=counts.get(chapterId)||0;
      if(count>=25)continue;
      const wasPending=priorStatus.get(chapterId)==='fonte_pendente';
      const sourcePending=wasPending || knownPending[slug]?.has(work.key)===true;
      rows.push({
        bibliography_id:work.key,
        chapter_id:chapterId,
        unit:section.chapter||section.label,
        count,
        status:sourcePending?'fonte_pendente':count===0?'critico':'insuficiente',
        need_to_25:25-count
      });
    }
  }

  const subject={
    total_questions:questions.length,
    deficit_units:rows.length,
    source_pending_units:rows.filter(x=>x.status==='fonte_pendente').length,
    actionable_deficit_units:rows.filter(x=>x.status!=='fonte_pendente').length,
    total_needed_if_all_available:rows.reduce((s,x)=>s+x.need_to_25,0),
    total_needed_actionable:rows.filter(x=>x.status!=='fonte_pendente').reduce((s,x)=>s+x.need_to_25,0),
    rows
  };
  out.subjects[slug]=subject;
  fs.writeFileSync(path.join(root,'reports',`deficits-${slug}.json`),JSON.stringify({generated_at:out.generated_at,subject_slug:slug,...subject},null,2)+'\n');
}

fs.writeFileSync(path.join(root,'reports','coverage-deficits-summary.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(out.subjects).map(([k,v])=>[k,{total_questions:v.total_questions,deficit_units:v.deficit_units,source_pending_units:v.source_pending_units,actionable_deficit_units:v.actionable_deficit_units,total_needed:v.total_needed_if_all_available,total_needed_actionable:v.total_needed_actionable}])),null,2));
// Recalculation marker: run after final source-grounded expansion.
