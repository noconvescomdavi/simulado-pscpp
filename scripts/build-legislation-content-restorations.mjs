import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const baseline=JSON.parse(fs.readFileSync(path.join(root,'scripts/fixtures/legislacao-localizador-baseline.json'),'utf8'));
const questions=new Map(baseline.questions.map(q=>[q.id,q]));
const references=JSON.parse(fs.readFileSync(path.join(root,'data/question-restorations/legislacao-conteudo-referencias.json'),'utf8'));
function reviewedSource(q) {
 const source={...q.source};
 const old=source.locator;
 const work=references.works.find(w=>source.title.startsWith(w.match));
 if(work) { source.url=work.url; if(work.title) source.title=work.title; }
 if(/LISTA DE AUXILIO RADIO/.test(old)) {
  source.title='Lista de Auxílios-Rádio — DHN, 15ª edição (2025–2029)';
  source.url='https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2025-02/LAR%20-%2015ED%20-%202025%20-%202029%20-%20Final.pdf';
 } else if(/LISTA DE SINAIS CEGOS/.test(old)) {
  source.title='Lista de Sinais Cegos — DHN, 9ª edição (2025–2029)';
  source.url='https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/2025-09/LSC-9ED-2025-2029%20-%20Completa.pdf';
 } else if(/LISTA DE FARÓIS/.test(old)) {
  source.title='Lista de Faróis — DHN, 39ª edição';
  source.url='https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/lista-de-farois';
 } else if(/aviso aos navegantes/i.test(old)) {
  source.title='Avisos aos Navegantes — DHN';
  source.url='https://www.marinha.mil.br/chm/dados-do-segnav-publicacoes/avisos-aos-navegantes';
 } else if(/normam-204/i.test(old)) {
  source.title='NORMAM-204/DPC — Tráfego e Permanência de Embarcações nas Águas Jurisdicionais Brasileiras';
  source.url='https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-204.pdf';
 }
 source.locator=references.locatorCorrections[q.id]||references.nauticalLocators[q.id]||old;
 if(references.casualtyCode[q.id]) {
  source.title='Código de Investigação de Acidentes da IMO — Resolução MSC.255(84)';
  source.author='Organização Marítima Internacional';
  source.edition='MSC.255(84), 16 de maio de 2008';
  source.locator=references.casualtyCode[q.id];
  source.url='https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/MSCResolutions/MSC.255(84).pdf';
 }
 if(q.id==='LEG-0876') {
  source.title='NORMAM-302/DPC — Inquéritos Administrativos sobre Acidentes e Fatos da Navegação';
  source.locator='item 1.11, alínea a';
  source.url='https://www.marinha.mil.br/sites/default/files/atos-normativos/dpc/normam/normam-302.pdf';
 }
 return source;
}
const reviewed=[];
for(const file of fs.readdirSync(path.join(root,'data/question-restorations')).filter(n=>/^legislacao-conteudo-specs-\d+\.txt$/.test(n)).sort()) {
 for(const line of fs.readFileSync(path.join(root,'data/question-restorations',file),'utf8').split('\n').filter(l=>l.trim()&&!l.startsWith('#'))) {
  const [id,topic,needle,...tail]=line.split('|');
  const alternatives=tail.slice(0,4); const replacement=tail[4];
  const q=questions.get(id); if(!q) throw Error(`Unknown ID ${id}`);
  let correct=replacement||q.answer_text;
  correct=correct?.replace(/^\s*(?:[IVX]+\s*[-–]|\d+(?:\.\d+)*\.?\s*§\s*\d+[º°]?[A-Z]?|\d+(?:\.\d+)*[.)]?)\s+/,'').trim();
  correct=correct?.replace(/^\s*[-–]\s*/,'');
  if(correct) correct=correct[0].toLocaleUpperCase('pt-BR')+correct.slice(1);
  if(!correct?.includes(needle)||alternatives.length!==4||new Set([needle,...alternatives]).size!==5) throw Error(`Invalid contrast for ${id}: ${needle}`);
  const options=[]; let wrong=0;
  for(const key of ['A','B','C','D','E']) options.push({key,text:key===q.correct_answer?correct:correct.replace(needle,alternatives[wrong++])});
  const source=reviewedSource(q);
  const title=source.title;
  const article=/^(?:Decreto|Código)/.test(title)?'o':/^Avisos/.test(title)?'os':'a';
  const explanation=[`Gabarito: ${q.correct_answer}. ${correct}`,`Referência: ${title}, ${source.locator}.`,...options.filter(o=>o.key!==q.correct_answer).map((o,i)=>`${o.key}: incorreta por substituir “${needle}” por “${alternatives[i]}”.`) ].join('\n\n');
  reviewed.push({id,source,pscpp_format:null,question:`De acordo com ${article} ${title}, sobre ${topic}, qual alternativa apresenta corretamente a disposição aplicável?`,topic,options,correct_answer:q.correct_answer,explanation,style:'Normativa',question_type:'Múltipla escolha',assertions:[],editorial_review:{content_reviewed:true,version:'legislation-content-v2',original_locator:q.source.locator,contrast:{correct:needle,distractors:alternatives}},provenance:{content_editorial_repair:{version:'legislation-content-v2',method:'individually-authored-content-and-scope-contrasts'}}});
 }
}
if(reviewed.length!==322||reviewed.length!==questions.size) throw Error(`Incomplete coverage: ${reviewed.length}/${questions.size}`);
if(new Set(reviewed.map(q=>q.id)).size!==reviewed.length) throw Error('Duplicate reviewed ID');
fs.writeFileSync(path.join(root,'data/question-restorations/legislacao-regulamentacao-06.json'),JSON.stringify({title:'Legislação: revisão de conteúdo dos enunciados por localizador',questions:reviewed},null,2)+'\n');
console.log(`${reviewed.length}/${questions.size} questões reescritas`);
