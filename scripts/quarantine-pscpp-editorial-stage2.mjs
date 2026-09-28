import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const dir=path.join(root,"data","questions");
const subjects=["arte-naval","manobrabilidade","navegacao-aguas-restritas","legislacao-regulamentacao","meteorologia-oceanografia","comunicacoes","conhecimentos-gerais"];
const objective=new Set(["LEG-0382","LEG-0602","LEG-1179","LEG-1273"]);
const templateRisks=[
  /descri[cç][aã]o t[eé]cnica [“"]?a seguir/i,
  /considere a seguinte caracter[ií]stica/i,
  /corresponde a [“"][^”"]+[”"]/i,
  /a bibliografia atribui/i,
  /problema-base/i
];
let changed=0;
const rows=[];
for(const subject of subjects){
  const file=path.join(dir,subject+".json");
  const bank=JSON.parse(fs.readFileSync(file,"utf8"));
  for(const q of bank.questions||[]){
    let reason=null;
    if(objective.has(q.id)) reason="missing_referent_or_cross_fragment_stem";
    else if(templateRisks.some(rx=>rx.test(q.question||""))) reason="artificial_template_requires_source_rewrite";
    if(!reason) continue;
    rows.push({subject,id:q.id,reason,was_active:q.active!==false});
    if(q.active!==false || q.status!=="quarantined"){
      q.active=false;
      q.status="quarantined";
      q.quality={...(q.quality||{}),quarantine_reason:reason,quarantined_at:"2026-09-28",audit_stage:"editorial-stage-2"};
      changed++;
    }
  }
  fs.writeFileSync(file,JSON.stringify(bank,null,2)+"\n");
}
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports","pscpp-etapa2-quarantine.json"),JSON.stringify({changed,candidates:rows.length,rows},null,2)+"\n");
console.log(JSON.stringify({changed,candidates:rows.length}));
