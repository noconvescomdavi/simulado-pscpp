import fs from "node:fs";
import path from "node:path";

// Auditoria bloqueante executada após cada lote de reparos.
const root=process.cwd();
const dir=path.join(root,"data","questions");
const subjects=["arte-naval","manobrabilidade","navegacao-aguas-restritas","legislacao-regulamentacao","meteorologia-oceanografia","comunicacoes","conhecimentos-gerais"];
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
    const all=[q.question,q.explanation,q.topic,q.module,...(q.options||[]).map(o=>o.text)].join("\n");
    for(const [rx,msg] of anglicisms) if(rx.test(all)) add(subject,q,"TERMINOLOGY_TRANSLATION","high",msg);
    if(templateRisks.some(rx=>rx.test(q.question||""))) add(subject,q,"ARTIFICIAL_TEMPLATE","high","Redação com artefato de geração; reescrever como questão natural no padrão PSCPP.");
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
const priority={critical:3,high:2,medium:1};
flags.sort((a,b)=>(priority[b.severity]-priority[a.severity])||a.subject.localeCompare(b.subject)||String(a.id).localeCompare(String(b.id)));
const summary={generated_at:new Date().toISOString(),version:"semantic-audit-v1",totals:{flags:flags.length,critical:flags.filter(x=>x.severity==="critical").length,high:flags.filter(x=>x.severity==="high").length},by_code:Object.fromEntries([...new Set(flags.map(x=>x.code))].map(c=>[c,flags.filter(x=>x.code===c).length])),flags};
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports","question-semantic-audit.json"),JSON.stringify(summary,null,2)+"\n");
console.log(JSON.stringify(summary.totals));
console.log(JSON.stringify(summary.by_code,null,2));
// Flags são relatório editorial. Falhas estruturais/gabarito continuam bloqueantes;\n// redação/terminologia são backlog de qualidade e não impedem build/deploy.\nconst blockingCodes=new Set(["MISSING_CORRECT_OPTION","ANSWER_EXPLANATION_CONFLICT","ASSERTION_KEY_CONFLICT","INCORRECT_KEY_CONFLICT"]);\nconst blocking=flags.filter(x=>blockingCodes.has(x.code));\nif(blocking.length){\n  console.error(JSON.stringify({blocking: blocking.length, by_code:Object.fromEntries([...new Set(blocking.map(x=>x.code))].map(code=>[code,blocking.filter(x=>x.code===code).length]))},null,2));\n  process.exitCode=2;\n}
