import fs from "node:fs";
const p="data/questions/arte-naval.json",d=JSON.parse(fs.readFileSync(p,"utf8"));
const generic=new Set(["ANV-1330","ANV-1334","ANV-1356","ANV-1357","ANV-1358","ANV-1359","ANV-1362","ANV-1363","ANV-1365"]);
const dup=new Set(["ANV-0303","ANV-0326","ANV-0372","ANV-0399","ANV-0414","ANV-0488","ANV-0503","ANV-0532","ANV-0534","ANV-0551","ANV-0598"]);
let n=0;
for(const q of d.questions){let reason=null;if(generic.has(q.id))reason="generic_template_requires_manual_source_review";if(dup.has(q.id))reason="duplicate_stem_requires_source_review";if(reason){q.active=false;q.status="quarantined";q.quality={...(q.quality||{}),quarantine_reason:reason,quarantined_at:"2026-09-22"};n++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+"\n");console.log(JSON.stringify({quarantined:n},null,2));
