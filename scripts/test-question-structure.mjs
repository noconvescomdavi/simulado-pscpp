import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { classifyQuestionStructure } from "../lib/question-structure.js";

const roots=["data/questions","data/question-extensions"];
const files=roots.flatMap(root=>fs.existsSync(root)?fs.readdirSync(root).filter(x=>x.endsWith(".json")).map(x=>path.join(root,x)):[]);
const stats={files:files.length,total:0,simple:0,assertions:0,true_false:0,statements:0,enumeration:0,paragraphs:0,correlation:0,structured_legacy:0};
const ambiguous=[];
const suspicious=[];
const patterns={roman:0,newlines:0,embeddedLetters:0,numbered:0,longSimple:0};
for(const file of files){
  const raw=JSON.parse(fs.readFileSync(file,"utf8").replace(/^\uFEFF/,""));
  const questions=Array.isArray(raw)?raw:(raw.questions||[]);
  for(const question of questions){
    stats.total++;
    const structure=classifyQuestionStructure(question);
    stats[structure.type]=(stats[structure.type]||0)+1;
    if(structure.confidence==="ambiguous") ambiguous.push({file,id:question.id,type:structure.type});
    const text=String(question.question||"");
    if(/(?:^|\s)(?:I|II|III|IV|V|VI|VII|VIII|IX|X)[\).]\s*/m.test(text)) patterns.roman++;
    if(/\n/.test(text)) patterns.newlines++;
    if(/(?:^|\s)\([a-e]\)\s+/i.test(text)) patterns.embeddedLetters++;
    if(/(?:^|\s)\d{1,2}[\).]\s+/.test(text)) patterns.numbered++;
    if(structure.type==="simple" && text.length>280){patterns.longSimple++; if(suspicious.length<200)suspicious.push({file,id:question.id,length:text.length,text:text.slice(0,700)});}
    if(structure.type==="structured_legacy" && suspicious.length<200)suspicious.push({file,id:question.id,length:text.length,text:text.slice(0,700)});
    assert.equal(structure.options?.length ?? question.options?.length ?? 0, question.options?.length ?? 0, `options changed: ${file}#${question.id}`);
    if(structure.type==="assertions"){
      const block=structure.blocks.find(x=>x.type==="assertions");
      assert.ok(block?.items?.length>=2,`assertions not split: ${file}#${question.id}`);
      assert.equal(block.items[0].label,"I",`first assertion changed: ${file}#${question.id}`);
    }
    if(structure.type==="true_false"){
      const block=structure.blocks.find(x=>x.type==="assertions"||x.type==="items");
      assert.ok(block?.items?.length>=2,`V/F statements not split: ${file}#${question.id}`);
    }
  }
}
const compact=classifyQuestionStructure({question:"Analise: I)Primeira. II)Segunda. III)Terceira.",options:["A","B"]});
assert.equal(compact.type,"assertions");
assert.deepEqual(compact.blocks[1].items.map(x=>x.label),["I","II","III"]);
const vf=classifyQuestionStructure({question:"Analise as afirmativas e determine V/F: I) Um. II) Dois. III) Três.",options:["V-F-V","F-V-F"]});
assert.equal(vf.type,"true_false");
assert.deepEqual(vf.options,["V – F – V","F – V – F"]);
const correlation=classifyQuestionStructure({question:"CORRELACIONE:\nCOLUNA A\nI. Golas\nII. Reclamos\nCOLUNA B\n( ) Definição 1\n( ) Definição 2",options:["II – I","I – II"]});
assert.equal(correlation.type,"correlation");
assert.ok(correlation.blocks.some(x=>x.type==="columns"));
assert.equal(stats.total, 12600, `unexpected bank total: ${stats.total}`);
if(ambiguous.length) console.error("AMBIGUOUS_FORMATTING", JSON.stringify(ambiguous));
assert.equal(ambiguous.length, 0, `unformatted structured questions remain: ${ambiguous.length}`);
console.log(JSON.stringify({...stats,patterns,ambiguous_count:ambiguous.length,ambiguous:ambiguous.slice(0,100),suspicious},null,2));