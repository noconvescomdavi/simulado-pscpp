import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root=process.cwd();
const subjects=["arte-naval","comunicacoes","conhecimentos-gerais","legislacao-regulamentacao","manobrabilidade","meteorologia-oceanografia","navegacao-aguas-restritas"];
const unsafe=new Set(["format-expansion-v1","pscpp-style-upgrade-v3","pscpp-deep-refine-v4","pscpp-deep-refine-v5","pscpp-refinement-v3","pscpp-repair-v3","pscpp-cleanup-v8","pscpp-bibliographic-v6","pscpp-focused-extension-v7"]);
const files=fs.readdirSync(path.join(root,"data","question-restorations")).filter(x=>x.endsWith(".json"));
const packs=files.map(file=>JSON.parse(fs.readFileSync(path.join(root,"data","question-restorations",file),"utf8")));
let restored=0;
for(const subject of subjects){
 const bank=JSON.parse(fs.readFileSync(path.join(root,"data","questions",subject+".json"),"utf8"));
 const repl=new Map(packs.filter(p=>p.subject===subject).flatMap(p=>p.questions||[]).map(q=>[String(q.id),q]));
 restored+=repl.size;
 const effective=(bank.questions||[]).map(q=>repl.get(String(q.id))||q);
 const active=effective.filter(q=>!unsafe.has(String(q?.provenance?.method||"")) && q.active!==false && !["inactive","deactivated","quarantined"].includes(String(q.status||"").toLowerCase()));
 assert.ok(active.length>=1000, subject+" ficou abaixo de 1000 itens ativos: "+active.length);
 const restoredUnsafe=[...repl.values()].filter(q=>unsafe.has(String(q?.provenance?.method||"")));
 assert.equal(restoredUnsafe.length,0,subject+" possui restauração ainda marcada por gerador legado");
 console.log(subject+": total="+effective.length+" ativo="+active.length+" restaurado="+repl.size+" quarentena="+(effective.length-active.length));
}
assert.equal(restored,2164,"quantidade total de restaurações divergiu do inventário auditado");
console.log("Restauração pré-geradores: OK ("+restored+" itens)");
