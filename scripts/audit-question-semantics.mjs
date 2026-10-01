import fs from "node:fs";
import path from "node:path";

// Auditoria bloqueante executada após cada lote de reparos.
const root=process.cwd();
const dir=path.join(root,"data","questions");
const subjects=["arte-naval","manobrabilidade","navegacao-aguas-restritas","legislacao-regulamentacao","meteorologia-oceanografia","comunicacoes","conhecimentos-gerais"];
const extraDirs=[
  path.join(root,"data","question-extensions"),
  path.join(root,"data","question-restorations"),
];
const flags=[];
const norm=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const add=(s,q,code,severity,detail)=>flags.push({subject:s,id:q.id,code,severity,detail,question:q.question,options:q.options,correct_answer:q.correct_answer,explanation:q.explanation,source:q.source,reference:q.reference,locator:q.locator});

const anglicisms=[
  [/\bshot(?:s)?(?: de amarra)?\b/i,"Use a terminologia brasileira 'quartel de amarra' (ou 'quartelada', quando a fonte assim empregar)."],
  [/\bhawse pipe\b/i,"Preferir 'escovém' quando este for o conceito técnico da fonte."],
  [/\bwindlass\b/i,"Revisar contexto: em Arte Naval, empregar a denominação portuguesa consagrada para a máquina/equipamento."],
  [/\bstudded link\b/i,"Preferir 'elo com malhete' quando corresponder ao conceito da fonte."],
  [/\banchor cable\b/i,"Revisar tradução; em contexto de fundeio, normalmente 'amarra'."],
  [/\bshackle\b/i,"Revisar tradução contextual; não manter anglicismo se a fonte brasileira usa 'manilha'."]
];
const leakingStem=[/(?:relativo|referente|trata)\\s+a\\s+[“"][^”"]+[”"]/i,/(?:atividade|opera[cç][aã]o|procedimentos?)\\s+envolvendo\\s+[“"][^”"]+[”"]/i];
const words=v=>norm(v).replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(x=>x.length>=4);
const overlap=(a,b)=>{const A=new Set(words(a)),B=new Set(words(b));if(!A.size||!B.size)return 0;let n=0;for(const w of A)if(B.has(w))n++;return n/Math.min(A.size,B.size)};
const terminologyConflicts=[
  ["AIR_DRAUGHT_AS_UKC",/air\s*draught[^.!?]{0,180}(?:dist[aâ]ncia[^.!?]{0,80})?(?:quilha[^.!?]{0,80}fundo|fundo[^.!?]{0,80}quilha)/i,"Air draught é o calado aéreo: distância vertical da linha d’água ao ponto mais alto do navio. Quilha–fundo corresponde a UKC/FAQ."],
  ["UKC_AS_AIR_DRAUGHT",/(?:\bUKC\b|folga (?:sob|abaixo) da quilha)[^.!?]{0,180}(?:linha d[’']?[aá]gua[^.!?]{0,100}ponto mais alto|ponto mais alto[^.!?]{0,100}linha d[’']?[aá]gua)/i,"UKC/FAQ é a folga vertical entre o ponto mais baixo do navio e o fundo; não é calado aéreo."],
  ["DRAFT_AS_AIR_DRAUGHT",/\b(?:draft|draught|calado)\b[^.!?]{0,140}(?:linha d[’']?[aá]gua[^.!?]{0,80}ponto mais alto|ponto mais alto[^.!?]{0,80}linha d[’']?[aá]gua)/i,"Draft/draught (calado) mede a imersão do navio; linha d’água–ponto mais alto é air draught."],
  ["SET_AS_SPEED",/\bset\b[^.!?]{0,100}(?:velocidade|intensidade)\s+(?:da\s+)?corrente/i,"Set é a direção para a qual a corrente se desloca; drift é sua velocidade."],
  ["DRIFT_AS_DIRECTION",/\bdrift\b[^.!?]{0,100}(?:dire[cç][aã]o|rumo)\s+(?:da\s+)?corrente/i,"Drift é a velocidade da corrente; set é a direção."],
  ["ADVANCE_AS_TRANSFER",/\b(?:advance|avan[cç]o)\b[^.!?]{0,140}(?:perpendicular|transversal)\s+(?:ao\s+)?(?:rumo|curso)\s+original/i,"Advance é medido na direção do rumo inicial; a distância transversal ao rumo inicial é transfer."],
  ["TRANSFER_AS_ADVANCE",/\btransfer\b[^.!?]{0,140}(?:paralel[oa]|ao longo)\s+(?:do\s+)?(?:rumo|curso)\s+original/i,"Transfer é a distância transversal ao rumo inicial; advance é medido na direção do rumo inicial."],
  ["CORIOLIS_SOUTH_RIGHT",/hemisf[eé]rio\s+sul[^.!?]{0,120}desvi\w*[^.!?]{0,60}\bdireita\b/i,"No Hemisfério Sul, a aceleração de Coriolis desvia o movimento para a esquerda."],
  ["CORIOLIS_NORTH_LEFT",/hemisf[eé]rio\s+norte[^.!?]{0,120}desvi\w*[^.!?]{0,60}\besquerda\b/i,"No Hemisfério Norte, a aceleração de Coriolis desvia o movimento para a direita."],
  ["CPA_AS_TIME",/\bCPA\b[^.!?]{0,120}(?:tempo|instante)\s+(?:at[eé]|para)\s+(?:o\s+)?ponto\s+de\s+maior\s+aproxima[cç][aã]o/i,"CPA é distância de maior aproximação; TCPA é o tempo até o CPA."],
  ["TCPA_AS_DISTANCE",/\bTCPA\b[^.!?]{0,120}(?:dist[aâ]ncia)\s+(?:de\s+)?maior\s+aproxima[cç][aã]o/i,"TCPA é o tempo até o CPA; CPA é a distância de maior aproximação."],
];
const roman=["I","II","III","IV","V","VI"];
const correctOptionText=q=>{
  const key=String(q.correct_answer||"").toUpperCase();
  return String((q.options||[]).find(o=>String(o.key).toUpperCase()===key)?.text||"");
};
const assertionMarkedTrue=(q,index)=>{
  const text=correctOptionText(q);
  if(/nenhuma/i.test(text)) return false;
  if(/todas/i.test(text)) return true;
  const token=roman[index];
  return token ? new RegExp(`(?:^|[^IVX])${token}(?:[^IVX]|$)`).test(text) : false;
};
const semanticTruthText=q=>{
  const parts=[correctOptionText(q),String(q.explanation||"")];
  for(let i=0;i<(q.assertions||[]).length;i++) if(assertionMarkedTrue(q,i)) parts.push(String(q.assertions[i]||""));
  return parts.join("\n");
};

const templateRisks=[
  /descri[cç][aã]o t[eé]cnica [“"]?a seguir/i,
  /considere a seguinte caracter[ií]stica/i,
  /corresponde a [“"][^”"]+[”"]/i,
  /a bibliografia atribui/i,
  /problema-base/i
];

for(const subject of subjects){
  const bank=JSON.parse(fs.readFileSync(path.join(dir,subject+".json"),"utf8"));
  for(const q of bank.questions||[]){
    // A auditoria editorial bloqueante cobre somente o pool elegível ao runtime.
    if(q.active===false || q.__remove===true || q.status==="quarantined") continue;
    const all=[q.question,q.explanation,q.topic,q.module,...(q.options||[]).map(o=>o.text),...(q.assertions||[])].join("\n");
    const truthText=semanticTruthText(q);
    for(const [code,rx,msg] of terminologyConflicts) if(rx.test(truthText)) add(subject,q,code,"critical",msg);
    for(const [rx,msg] of anglicisms) if(rx.test(all)) add(subject,q,"TERMINOLOGY_TRANSLATION","high",msg);
    if(templateRisks.some(rx=>rx.test(q.question||""))) add(subject,q,"ARTIFICIAL_TEMPLATE","high","Redação com artefato de geração; reescrever como questão natural no padrão PSCPP.");
    if(leakingStem.some(rx=>rx.test(q.question||"")))add(subject,q,"STEM_SOURCE_FRAGMENT","critical","O enunciado contém fragmento textual da fonte que pode entregar o gabarito; reformular sem citar a continuação.");
    if(/descri[cç][aã]o de qu[eê]\??|descri[cç][aã]o:\s*este m[eé]todo/i.test(q.question||"")) add(subject,q,"MISSING_REFERENT","critical","Enunciado sem referente/contexto suficiente.");
    const key=String(q.correct_answer||"").toUpperCase();
    const exp=norm(q.explanation);
    // Só marque conflito quando a explicação identificar explicitamente uma alternativa como correta.
    const answerPatterns=[
      /alternativa\s+([a-e])\s+(?:e|esta)\s+(?:a\s+)?(?:correta|resposta)/g,
      /resposta\s+(?:correta\s+)?(?:e|:)\s*(?:a\s+)?alternativa\s+([a-e])/g,
      /gabarito\s*[:=-]\s*([a-e])\b/g
    ];
    const named=answerPatterns.flatMap(rx=>[...exp.matchAll(rx)].map(m=>m[1].toUpperCase()));
    if(named.length && named.some(k=>k!==key)) add(subject,q,"ANSWER_EXPLANATION_CONFLICT","critical",`correct_answer=${key}, mas a explicação aponta ${[...new Set(named)].join(",")} como resposta correta.`);
    const correct=(q.options||[]).find(o=>String(o.key).toUpperCase()===key);
    if(!correct) add(subject,q,"MISSING_CORRECT_OPTION","critical","Gabarito não corresponde a alternativa existente.");
    const assertionLike=/\n\s*(?:I|II|III|IV)[).]/.test(q.question||"") || /assertivas|verdadeiro|falso/i.test(String(q.question_type||"")+" "+String(q.style||""));
    if(correct&&!assertionLike&&overlap(q.question,correct.text)>=.58)add(subject,q,"STEM_ANSWER_OVERLAP","high","Sobreposição lexical elevada em questão não-assertiva; requer revisão editorial, mas não prova vazamento de gabarito.");
    if(/s[aã]o verdadeiras as proposi[cç][oõ]es correspondentes [aà] alternativa\s+[a-e]/i.test(q.explanation||"")){
      const m=(q.explanation||"").match(/alternativa\s+([a-e])/i);
      if(m&&m[1].toUpperCase()!==key) add(subject,q,"ASSERTION_KEY_CONFLICT","critical",`Explicação aponta ${m[1].toUpperCase()}, JSON aponta ${key}.`);
    }
    if(/marque a alternativa incorreta/i.test(q.question||"")){
      const m=(q.explanation||"").match(/alternativa\s+([a-e])\s+(?:é|esta)\s+(?:a\s+)?incorreta/i);
      if(m&&m[1].toUpperCase()!==key) add(subject,q,"INCORRECT_KEY_CONFLICT","critical",`Questão pede INCORRETA; explicação aponta ${m[1].toUpperCase()}, JSON aponta ${key}.`);
    }
  }
}
for(const extraDir of extraDirs){
  if(!fs.existsSync(extraDir)) continue;
  for(const file of fs.readdirSync(extraDir).filter(name=>name.endsWith(".json"))){
    let pack;
    try{ pack=JSON.parse(fs.readFileSync(path.join(extraDir,file),"utf8")); }catch{ continue; }
    for(const q of pack.questions||[]){
      if(q.active===false || q.__remove===true || q.status==="quarantined") continue;
      const truthText=semanticTruthText(q);
      for(const [code,rx,msg] of terminologyConflicts){
        if(rx.test(truthText)) add(path.relative(root,path.join(extraDir,file)),q,code,"critical",msg);
      }
    }
  }
}

const priority={critical:3,high:2,medium:1};
flags.sort((a,b)=>(priority[b.severity]-priority[a.severity])||a.subject.localeCompare(b.subject)||String(a.id).localeCompare(String(b.id)));
const summary={generated_at:new Date().toISOString(),version:"semantic-audit-v1",totals:{flags:flags.length,critical:flags.filter(x=>x.severity==="critical").length,high:flags.filter(x=>x.severity==="high").length},by_code:Object.fromEntries([...new Set(flags.map(x=>x.code))].map(c=>[c,flags.filter(x=>x.code===c).length])),flags};
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports","question-semantic-audit.json"),JSON.stringify(summary,null,2)+"\n");
console.log(JSON.stringify(summary.totals));
console.log(JSON.stringify(summary.by_code,null,2));
// Flags são relatório editorial. Falhas estruturais/gabarito continuam bloqueantes;
// redação/terminologia são backlog de qualidade e não impedem build/deploy.
const blockingCodes=new Set(["MISSING_CORRECT_OPTION","ANSWER_EXPLANATION_CONFLICT","ASSERTION_KEY_CONFLICT","INCORRECT_KEY_CONFLICT","MISSING_REFERENT","ARTIFICIAL_TEMPLATE",...terminologyConflicts.map(([code])=>code)]);
const blocking=flags.filter(x=>blockingCodes.has(x.code));
if(blocking.length){
  console.error(JSON.stringify({blocking:blocking.length,by_code:Object.fromEntries([...new Set(blocking.map(x=>x.code))].map(code=>[code,blocking.filter(x=>x.code===code).length]))},null,2));
  process.exitCode=2;
}
