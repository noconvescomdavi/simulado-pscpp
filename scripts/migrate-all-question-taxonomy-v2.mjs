import fs from 'node:fs';
import path from 'node:path';
import {BIBLIOGRAPHY} from '../data/study/bibliography.js';
import {classifyManobrabilidade,sourceAvailability as manSourceAvailability,sourcePendingNotes as manPendingNotes} from './taxonomy-maps/manobrabilidade.mjs';

const root=process.cwd();
const subjects=[
  ['manobrabilidade','I'],
  ['navegacao-aguas-restritas','III'],
  ['legislacao-regulamentacao','IV'],
  ['meteorologia-oceanografia','V'],
  ['comunicacoes','VI'],
  ['conhecimentos-gerais','VII']
];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slugify=v=>norm(v).replace(/\s+/g,'-').replace(/^-+|-+$/g,'').slice(0,96)||'topico';
const uniq=xs=>[...new Set(xs.filter(Boolean))];
const inc=(m,k)=>m.set(k,(m.get(k)||0)+1);
const has=(s,...terms)=>terms.some(t=>s.includes(norm(t)));
const firstNumber=(s,rx)=>{const m=String(s||'').match(rx);return m?Number(m[1]):null};
const chapterNumber=s=>firstNumber(s,/(?:chapter|cap(?:itulo|ítulo|\.)?)\s*(\d{1,2})\b/i);
const ruleNumber=s=>firstNumber(s,/(?:regra|rule)\s*(\d{1,2})\b/i);

function hit(bibliography_id,section_key,confidence='high',basis='mapeamento por fonte/locator'){return {bibliography_id,section_key,confidence,basis};}

function classifyNavigation(q){
  const title=norm(q?.source?.title), loc=norm(q?.source?.locator), topic=norm(q?.topic), mod=norm(q?.module);
  const ch=chapterNumber(q?.source?.locator);
  if(title.includes('bridge team management')){
    if(ch>=1&&ch<=7)return hit('swift-btm',`ch${ch}`);
  }
  if(title.includes('navegacao a ciencia e a arte')||title.includes('navegacao ciencia e arte')){
    if([37,38,40,42].includes(ch))return hit('miguens-v3-nav',`ch${ch}`);
    if([1,2,3,4,5,6,7,8,10,11,12,13,14].includes(ch))return hit('miguens-v1',`ch${ch}`);
  }
  if(title==='bridge procedures guide'||title.includes('bridge procedures guide')){
    if([2,3,5,6].includes(ch))return hit('ics-bpg',`ch${ch}`);
    if(ch===4)return null; // fora do recorte oficial atual; relatório deve expor
  }
  if(title.includes('solas')&&title.includes('safety of navigation'))return hit('solas-2024','ch-v');
  if(title.includes('navegacao integrada')){
    if(ch>=1&&ch<=4)return hit('bento',`ch${ch}`);
  }
  if(title.includes('theory and practices of marine pilotage')){
    if([5,6,13].includes(ch))return hit('nayak-nav',`ch${ch}`);
  }
  if(title.includes('normam 202'))return hit('normam202','ch11');
  if(title.includes('normam 511'))return hit('nav-doc-0','integral');
  if(title.includes('normam 601')||title.includes('auxilios a navegacao'))return hit('nav-doc-1','integral');
  if(title.includes('normam 602')||title.includes('servico de trafego de embarcacoes'))return hit('nav-doc-2','integral');
  if(title.includes('msc 192 79')||title.includes('radar equipment'))return hit('nav-doc-3','integral');
  if(title.includes('a 1106 29')||title.includes('operational use of shipborne ais'))return hit('nav-doc-4','integral');
  if(title.includes('msc 530 106')||title.includes('performance standards for ecdis'))return hit('nav-doc-5','integral');
  if(title.includes('msc circ 738')||title.includes('dynamic positioning system operator training'))return hit('nav-doc-6','integral','medium','fonte do banco identifica Rev.1; catálogo oficial atual usa Rev.2');
  if(title.includes('msc 1 circ 1580')||title.includes('dynamic positioning systems'))return hit('nav-doc-7','integral');
  if(title.includes('colreg')||title.includes('ripeam')||title.includes('international regulations for preventing collisions')){
    const r=ruleNumber(q?.source?.locator);
    if(r>=1&&r<=3)return hit('colreg','part-A');
    if(r>=4&&r<=19)return hit('colreg','part-B');
    if(r>=20&&r<=31)return hit('colreg','part-C');
    if(r>=32&&r<=37)return hit('colreg','part-D');
    if(r===38)return hit('colreg','part-E');
    if(has(topic,'responsabilidade','definicao','aplicacao'))return hit('colreg','part-A','medium','tópico compatível com Part A');
    if(has(topic,'luzes','marcas','visibilidade','sinais sonoros','luz'))return hit('colreg','part-C','medium','tópico compatível com Part C');
    if(has(mod,'regras de governo','conducao','manobra'))return hit('colreg','part-B','medium','módulo compatível com Part B');
  }
  if(title.includes('normam 501'))return hit('normam501','integral');
  return null;
}

function classifyLegislation(q){
  const title=norm(q?.source?.title),loc=norm(q?.source?.locator),topic=norm(q?.topic),mod=norm(q?.module);
  if(title.includes('embarcacoes empregadas na navegacao em mar aberto')||title.includes('normam 201'))return hit('normam201','ch7');
  if(title.includes('trafego e permanencia de embarcacoes')||title.includes('normam 204'))return hit('leg-doc-0','integral');
  if(title.includes('inqueritos administrativos')||title.includes('normam 302'))return hit('leg-doc-1','integral');
  if(title.includes('servico de praticagem')||title.includes('normam 311'))return hit('leg-doc-2','integral');
  if(title.includes('auxilios a navegacao')||title.includes('normam 601'))return hit('leg-doc-3','integral');
  if(title.includes('cerimonial da marinha mercante')||title.includes('normam 112'))return hit('leg-doc-4','integral');
  if(title.includes('servico de trafego de embarcacoes')||title.includes('normam 602'))return hit('leg-doc-5','integral');
  if(title.includes('lei n 2 180')||title.includes('tribunal maritimo'))return hit('leg-doc-6','integral');
  if(title.includes('lei n 9 537')||title.includes('seguranca do trafego aquaviario')||title.includes('lesta'))return hit('leg-doc-7','integral');
  if(title.includes('lei n 14 813')||title.includes('praticagem'))return hit('leg-doc-8','integral');
  if(title.includes('decreto n 2 596')||title.includes('regulamenta a lesta')||title.includes('rlesta'))return hit('leg-doc-9','integral');
  if(title.includes('portaria')&&title.includes('37'))return hit('leg-doc-10','integral');
  if(title.includes('colreg')||title.includes('ripeam')||title.includes('evitar abalroamentos'))return hit('leg-doc-11','integral');
  if(title.includes('publicacoes de auxilio a navegacao')||title.includes('publicacoes nauticas'))return hit('leg-doc-12','integral');
  if(title.includes('sar maritimo')||title.includes('salvamar')||title.includes('servico sar'))return hit('leg-doc-13','integral');
  if(title.includes('lei n 12 815')){
    const ch=chapterNumber(q?.source?.locator);
    if(ch===1)return hit('lei12815','ch1');if(ch===4)return hit('lei12815','ch4');if(ch===8)return hit('lei12815','ch8');
    if(has(loc,'capitulo iv','capitulo 4')||has(topic,'administracao do porto','autoridade portuaria','porto organizado','conselho de autoridade portuaria','guarda portuaria')||has(mod,'administracao do porto'))return hit('lei12815','ch4','medium','classificação por tema do Capítulo IV');
    if(has(loc,'capitulo viii','capitulo 8')||has(topic,'dragagem','programa nacional de dragagem')||has(mod,'dragagem'))return hit('lei12815','ch8','medium','classificação por tema do Capítulo VIII');
    return hit('lei12815','ch1','medium','questão da Lei 12.815 sem capítulo explícito; alocada em definições/objetivos por tema residual');
  }
  if(title.includes('lei complementar n 97'))return hit('lc97','art17');
  if(title.includes('a 960 23')||title.includes('maritime pilots'))return hit('leg-extra-0','integral');
  if(title.includes('md35 g 01')||title.includes('glossario das forcas armadas'))return hit('leg-extra-1','integral');
  if(title.includes('politica nacional de defesa'))return hit('leg-extra-2','integral');
  if(title.includes('decreto n 12 481')||title.includes('politica maritima nacional'))return hit('leg-extra-3','integral');
  if(title.includes('decreto n 2 256'))return hit('leg-extra-4','integral');
  if(title.includes('lei n 7 642'))return hit('leg-extra-5','integral');
  if(title.includes('lei n 7 652'))return hit('leg-extra-6','integral');
  if(title.includes('lei n 9 432'))return hit('leg-extra-7','integral');
  return null;
}

function classifyMeteorology(q){
  const title=norm(q?.source?.title);
  if(title.includes('navegacao a ciencia e a arte')||title.includes('navegacao ciencia e arte'))return hit('miguens-met','ch45');
  if(title.includes('meteorologia nocoes basicas'))return hit('met-0','integral');
  if(title==='meteorologia e oceanografia'||title.includes('meteorologia e oceanografia'))return hit('met-1','integral');
  if(title.includes('principios de hidrodinamica')||title.includes('acao das ondas'))return hit('met-2','integral');
  if(title.includes('pianc')&&has(title,'hydro','meteo')){const ch=chapterNumber(q?.source?.locator);if(ch>=2&&ch<=6)return hit('pianc-hydromet',`ch${ch}`);}
  if(title.includes('normam 701'))return hit('normam701','integral');
  return null;
}

function classifyCommunications(q){
  const title=norm(q?.source?.title),loc=norm(q?.source?.locator),topic=norm(q?.topic);
  if(title.includes('standard marine communication phrases')||title.includes('smcp')){
    if(loc.startsWith('introduction'))return hit('smcp','s0');
    if(loc.startsWith('glossary')||has(loc,'glossary'))return hit('smcp','s2');
    if(loc.startsWith('general'))return hit('smcp','s1');
    if(has(topic,'message marker','spelling','response','phrase','vocabulary','glossary'))return hit('smcp','s1','medium','tópico compatível com General');
    return hit('smcp','s1','medium','SMCP sem locator de seção reconhecido');
  }
  if(title.includes('radioperador geral')||title.includes('erog')||title.includes('especial de radioperador'))return hit('radioperador','integral');
  if(title.includes('international code of signals')){
    if(has(loc,'appendix','apendice'))return hit('ics','appendices');
    if(has(loc,'medical','request for medical assistance','secao medica'))return hit('ics','medical');
    if(loc.startsWith('general')||has(loc,'general section','secao geral'))return hit('ics','general');
    if(has(loc,'chapter','capitulo'))return hit('ics','chapters');
    return hit('ics','chapters','medium','International Code of Signals sem locator categórico; alocado no recorte de capítulos');
  }
  return null;
}

function classifyGeneral(q){
  const title=norm(q?.source?.title),loc=norm(q?.source?.locator);
  if(title.includes('ship port interface'))return hit('fal6','integral');
  if(title.includes('planejamento portuario')){const ch=chapterNumber(q?.source?.locator);if(ch===2)return hit('conapra-port','ch2');if(ch===8)return hit('conapra-port','ch8');return null;}
  if(title.includes('harbour approach channels')){const ch=chapterNumber(q?.source?.locator);if(ch>=1&&ch<=3)return hit('pianc-channels',`ch${ch}`);}
  if(title.includes('normam 224')||title.includes('folga dinamica abaixo da quilha'))return hit('normam224','integral');
  if(title.includes('guidelines on fatigue')||title.includes('msc 1 circ 1598'))return hit('fatigue','integral');
  if(title.includes('shiphandling the beautiful game')){const ch=chapterNumber(q?.source?.locator);if([1,3,11,12].includes(ch))return hit('livingstone',`ch${ch}`);}
  if(title.includes('declaracao universal dos direitos humanos'))return hit('udhr','integral');
  if(title.includes('marpol')||title.includes('decreto n 2 508'))return hit('marpol','integral');
  if(title.includes('stopford')||title.includes('economia maritima')){const ch=chapterNumber(q?.source?.locator);if(ch>=1&&ch<=17)return hit('stopford',`ch${ch}`);}
  if(title.includes('direito processual maritimo')||title.includes('pimenta')){const ch=chapterNumber(q?.source?.locator);if(ch)return hit('pimenta',`ch${ch}`);}
  return null;
}

const classifiers={
  'manobrabilidade':classifyManobrabilidade,
  'navegacao-aguas-restritas':classifyNavigation,
  'legislacao-regulamentacao':classifyLegislation,
  'meteorologia-oceanografia':classifyMeteorology,
  'comunicacoes':classifyCommunications,
  'conhecimentos-gerais':classifyGeneral
};

fs.mkdirSync(path.join(root,'reports'),{recursive:true});
const global={generated_at:new Date().toISOString(),subjects:{}};
for(const [subjectSlug,subjectId] of subjects){
  const bankPath=path.join(root,'data/questions',`${subjectSlug}.json`);
  const reportPath=path.join(root,'reports',`${subjectSlug}-migration.json`);
  const bank=JSON.parse(fs.readFileSync(bankPath,'utf8'));
  const questions=Array.isArray(bank.questions)?bank.questions:[];
  const idsBefore=questions.map(q=>q.id);
  const catalog=BIBLIOGRAPHY[subjectSlug]||[];
  const chapters=new Map();
  for(const work of catalog)for(const section of work.sections||[])chapters.set(`${work.key}::${section.key}`,{work,section});
  const confidence=new Map();const unmapped=[];let migrated=0,alreadyV2=0;
  for(const q of questions){
    if(q?.taxonomy?.subject_slug===subjectSlug){alreadyV2++;continue;}
    const m=classifiers[subjectSlug](q);
    if(!m){if(unmapped.length<300)unmapped.push({id:q.id,module:q.module,topic_code:q.topic_code,topic:q.topic,source:q.source});continue;}
    const chapterId=`${m.bibliography_id}::${m.section_key}`;
    const cat=chapters.get(chapterId);
    if(!cat){if(unmapped.length<300)unmapped.push({id:q.id,module:q.module,topic_code:q.topic_code,topic:q.topic,source:q.source,error:`chapter_id canônico inexistente: ${chapterId}`});continue;}
    const topicId=`${subjectId}-${m.bibliography_id}-${m.section_key}-${slugify(q.topic_code)}-${slugify(q.topic)}`;
    q.taxonomy={subject_id:subjectId,subject_slug:subjectSlug,bibliography_id:m.bibliography_id,chapter_id:chapterId,topic_id:topicId,subtopic_id:null};
    q.tracking={subject_slug:subjectSlug,work:{id:m.bibliography_id,title:cat.work.title,author:String(q?.source?.author||'')},chapter:{id:chapterId,number:m.section_key,title:cat.section.chapter||cat.section.label||m.section_key,label:cat.section.label||cat.section.chapter||m.section_key},section:cat.section.chapter||cat.section.label||String(q?.source?.locator||''),module:String(q.module||''),topic:{id:topicId,title:String(q.topic||'')}};
    q.tags=uniq([...(Array.isArray(q.tags)?q.tags:[]),subjectSlug,m.bibliography_id,chapterId,slugify(q.topic)]);
    migrated++;inc(confidence,m.confidence||'unknown');
  }
  const idsAfter=questions.map(q=>q.id);
  if(idsBefore.length!==idsAfter.length||idsBefore.some((id,i)=>id!==idsAfter[i]))throw new Error(`${subjectSlug}: IDs/ordem alterados`);
  if(new Set(idsAfter).size!==idsAfter.length)throw new Error(`${subjectSlug}: IDs duplicados`);
  const counts=new Map();let v2=0,legacy=0;
  for(const q of questions){if(q?.taxonomy?.subject_slug===subjectSlug){v2++;inc(counts,q.taxonomy.chapter_id);}else legacy++;}
  const availability=subjectSlug==='manobrabilidade'?manSourceAvailability:{};
  const pendingNotes=subjectSlug==='manobrabilidade'?manPendingNotes:{};
  const coverage=[];
  for(const work of catalog)for(const section of work.sections||[]){
    const chapterId=`${work.key}::${section.key}`;const count=counts.get(chapterId)||0;
    const explicitlyPending=availability[work.key]===false;
    let status=explicitlyPending?'fonte_pendente':count===0?'critico':count<25?'insuficiente':count<=50?'meta_atingida':'cobertura_ampla';
    coverage.push({bibliography_id:work.key,work:work.title,chapter_id:chapterId,unit:section.chapter||section.label,count,status,pending_note:explicitlyPending?(pendingNotes[work.key]||'Fonte pendente'):null});
  }
  const summary={total:questions.length,v2,legacy,migrated,already_v2:alreadyV2,unmapped_count:questions.length-v2,confidence:Object.fromEntries(confidence),coverage:{critical:coverage.filter(x=>x.status==='critico').length,insufficient:coverage.filter(x=>x.status==='insuficiente').length,goal:coverage.filter(x=>x.status==='meta_atingida').length,wide:coverage.filter(x=>x.status==='cobertura_ampla').length,source_pending:coverage.filter(x=>x.status==='fonte_pendente').length}};
  bank.schema_version=bank.schema_version||'3.0.0';bank.questions=questions;
  fs.writeFileSync(bankPath,JSON.stringify(bank,null,2)+'\n');
  fs.writeFileSync(reportPath,JSON.stringify({generated_at:global.generated_at,subject_slug:subjectSlug,summary,coverage,unmapped_samples:unmapped},null,2)+'\n');
  global.subjects[subjectSlug]=summary;
}
fs.writeFileSync(path.join(root,'reports','all-question-taxonomy-migration.json'),JSON.stringify(global,null,2)+'\n');
console.log(JSON.stringify(global,null,2));
