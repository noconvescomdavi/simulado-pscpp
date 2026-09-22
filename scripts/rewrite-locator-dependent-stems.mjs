import fs from "node:fs";import path from "node:path";
const dir=path.join(process.cwd(),"data","questions");
const files=fs.readdirSync(dir).filter(f=>f.endsWith(".json"));
const title=q=>String(q.source?.title||q.source_title||q.bibliography||q.reference?.title||q.book||"").trim();
const subject=q=>String(q.topic||q.subject||q.module||q.locator?.section||q.reference?.section||"o assunto indicado").trim();
let changed=0, questions=0;
const locator=/^\s*De acordo com (?:o )?(?:item|subitem|se[cç][aã]o|cap[ií]tulo|regra|artigo|art\.?|p[aá]gina|p\.)\b[^,;:]*[,;:]?\s*/i;
const page=/\b(?:p[aá]gina|p\.)\s*\d+[\w.-]*\b/gi;
const supplied=/\s+do arquivo fornecido\b/gi;
for(const file of files){const p=path.join(dir,file),bank=JSON.parse(fs.readFileSync(p,"utf8"));let dirty=false;
for(const q of bank.questions||[]){let s=String(q.question||"");if(!/(?:De acordo com (?:o )?(?:item|subitem|se[cç][aã]o|cap[ií]tulo|regra|artigo|art\.?|p[aá]gina|p\.)|do arquivo fornecido)/i.test(s))continue;
const pub=title(q);const assunto=subject(q);
let tail=s.replace(locator,"").replace(supplied,"").replace(page,"").replace(/^\s*(?:trecho\s+[^,]+,?\s*)/i,"").trim();
tail=tail.replace(/^assinale\s+a\s+alternativa\s+que\s+apresenta\s+corretamente\s+/i,"");
const generic=pub? `De acordo com ${pub}, acerca de ${assunto}, assinale a alternativa que apresenta corretamente a disposição, requisito ou conceito previsto na publicação.` : `Acerca de ${assunto}, assinale a alternativa que apresenta corretamente a disposição, requisito ou conceito previsto na bibliografia indicada.`;
q.question=generic;dirty=true;questions++;}
if(dirty){fs.writeFileSync(p,JSON.stringify(bank,null,2)+"\n");changed++;}}
console.log(JSON.stringify({files_changed:changed,questions_rewritten:questions}));