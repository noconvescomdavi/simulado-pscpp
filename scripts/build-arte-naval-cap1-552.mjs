import fs from "node:fs";
const src=JSON.parse(fs.readFileSync("data/questions/arte-naval.json","utf8"));
const qs=src.questions||[];
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const c=qs.filter(q=>{const s=norm(JSON.stringify(q));return s.includes("volume 1")&&(s.includes("capitulo 1")||s.includes("nomenclatura do navio"));});
const by=new Map();
for(const q of c){const k=String(q.topic||q.bibliography?.locator||q.id); if(!by.has(k)) by.set(k,q);}
if(by.size<184) throw new Error("Foram encontrados apenas "+by.size+" termos únicos do Capítulo 1; geração abortada.");
const terms=[...by.values()].slice(0,184);
const L=["A","B","C","D","E"], R=["I","II","III","IV","V"];
const combos=[[1,1,0,1,0],[1,0,1,1,0],[0,1,1,0,1],[1,0,1,0,1],[0,1,0,1,1]];
const vf=[[1,0,1,1,0],[1,0,0,1,0],[0,1,0,0,1],[1,0,1,0,0],[0,0,1,1,0]];
const concept=q=>q.explanation||q.options?.find(o=>o.key===q.correct_answer)?.text||q.question;
const out=[];
for(let i=0;i<184;i++){
 const t=terms[i], topic=t.topic||("Termo "+(i+1)), own=concept(t);
 const group=[0,1,2,3,4].map(k=>terms[(i+k)%184]);
 let p=combos[i%5], ass=group.map((g,k)=>R[k]+") "+(g.topic||"Termo")+": "+(p[k]?concept(g):concept(terms[(i+k+17)%184])));
 let opts=[p,...combos.filter(x=>x!==p)]; let rot=i%5; opts=opts.slice(rot).concat(opts.slice(0,rot));
 const ct=x=>{const z=R.filter((_,k)=>x[k]);return "Apenas as afirmativas "+z.slice(0,-1).join(", ")+" e "+z.at(-1)+" são verdadeiras."};
 out.push({id:`pscpp::generated::anv-cap1::${String(i+1).padStart(3,"0")}::assert`,bank:"PSCPP",origin:"generated_pscpp",pscpp_origin:"generated_pscpp",active:true,validation_status:"approved",source_subject:"simulado-pscpp",module:"Arte Naval",topic,question:"De acordo com o livro “Arte Naval” (Maurílio M. Fonseca - 8ª edição revista e ampliada: 2019), analise as afirmativas abaixo, identifique as verdadeiras e assinale a opção correta:",assertions:ass,options:opts.map((x,k)=>({key:L[k],text:ct(x)})),correct_answer:L[opts.indexOf(p)],explanation:"Gabarito recalculado a partir das cinco afirmativas.",pscpp_format:"assertions",difficulty:"hard",cognitive_level:3,bibliography:{publication:"Arte Naval — Volume 1",edition:"8ª edição revista e ampliada",chapter:"Capítulo 1 — Nomenclatura do Navio",locator:t.bibliography?.locator||t.source?.locator||topic},source:{title:"Arte Naval — Volume 1 — 8ª edição revista e ampliada",locator:t.bibliography?.locator||t.source?.locator||topic}});
 let donors=[0,11,29,47,83].map(d=>terms[(i+d)%184]), oo=donors.map(concept); rot=(i*2)%5; oo=oo.slice(rot).concat(oo.slice(0,rot));
 out.push({id:`pscpp::generated::anv-cap1::${String(i+1).padStart(3,"0")}::direct`,bank:"PSCPP",origin:"generated_pscpp",pscpp_origin:"generated_pscpp",active:true,validation_status:"approved",source_subject:"simulado-pscpp",module:"Arte Naval",topic,question:`De acordo com o livro “Arte Naval” (Maurílio M. Fonseca - 8ª edição revista e ampliada: 2019), acerca de ${topic}, assinale a alternativa que apresenta corretamente o conceito previsto na publicação.`,options:oo.map((x,k)=>({key:L[k],text:x})),correct_answer:L[oo.indexOf(own)],explanation:own,pscpp_format:"direct",difficulty:"hard",cognitive_level:3,bibliography:{publication:"Arte Naval — Volume 1",edition:"8ª edição revista e ampliada",chapter:"Capítulo 1 — Nomenclatura do Navio",locator:t.bibliography?.locator||t.source?.locator||topic},source:{title:"Arte Naval — Volume 1 — 8ª edição revista e ampliada",locator:t.bibliography?.locator||t.source?.locator||topic}});
 p=vf[i%5]; ass=group.map((g,k)=>R[k]+") "+(g.topic||"Termo")+": "+(p[k]?concept(g):concept(terms[(i+k+23)%184]))); opts=[p,...vf.filter(x=>x!==p)]; rot=(i*3)%5; opts=opts.slice(rot).concat(opts.slice(0,rot)); const sq=x=>x.map(v=>v?"(V)":"(F)").join(" ");
 out.push({id:`pscpp::generated::anv-cap1::${String(i+1).padStart(3,"0")}::vf`,bank:"PSCPP",origin:"generated_pscpp",pscpp_origin:"generated_pscpp",active:true,validation_status:"approved",source_subject:"simulado-pscpp",module:"Arte Naval",topic,question:"De acordo com o livro “Arte Naval”, analise as afirmativas abaixo, identifique se são verdadeiras (V) ou falsas (F) e assinale a opção correta:",assertions:ass,options:opts.map((x,k)=>({key:L[k],text:sq(x)})),correct_answer:L[opts.indexOf(p)],explanation:"Sequência recalculada a partir das cinco afirmativas.",pscpp_format:"true_false",difficulty:"hard",cognitive_level:3,bibliography:{publication:"Arte Naval — Volume 1",edition:"8ª edição revista e ampliada",chapter:"Capítulo 1 — Nomenclatura do Navio",locator:t.bibliography?.locator||t.source?.locator||topic},source:{title:"Arte Naval — Volume 1 — 8ª edição revista e ampliada",locator:t.bibliography?.locator||t.source?.locator||topic}});
}
if(out.length!==552) throw new Error("Total inválido: "+out.length);
fs.writeFileSync("data/pscpp/arte-naval-cap1-552.json",JSON.stringify({title:"Arte Naval Vol. 1 — Cap. 1 — 552 questões",questions:out},null,2)+"\n");
console.log("geradas",out.length,"questões de",terms.length,"termos");