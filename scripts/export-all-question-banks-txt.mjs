import fs from "node:fs";import path from "node:path";
const dir=path.join(process.cwd(),"data","questions");
const order=["manobrabilidade.json","arte-naval.json","navegacao-aguas-restritas.json","legislacao-regulamentacao.json","meteorologia-oceanografia.json","comunicacoes.json","conhecimentos-gerais.json"];
let out="ESTIBORDO — BANCO COMPLETO DE QUESTÕES PSCPP\nGerado a partir dos 7 bancos JSON da plataforma.\n\n",total=0;
for(const file of order){const p=path.join(dir,file);if(!fs.existsSync(p))continue;const bank=JSON.parse(fs.readFileSync(p,"utf8"));const qs=bank.questions||[];
out+="=".repeat(100)+"\n"+(bank.title||file)+"\nArquivo: "+file+"\nQuantidade: "+qs.length+" questões\n"+"=".repeat(100)+"\n\n";
for(let i=0;i<qs.length;i++){const q=qs[i];total++;out+=`QUESTÃO ${i+1} | ID: ${q.id||"-"}\n${q.question||""}\n`;
for(const o of q.options||[])out+=`${o.key||""}) ${o.text||o.label||""}\n`;
out+=`GABARITO: ${q.correct_answer||"-"}\n`;if(q.explanation)out+=`EXPLICAÇÃO: ${q.explanation}\n`;
const src=q.source?.title||q.reference?.title||q.source_title||q.bibliography||q.book;if(src)out+=`FONTE: ${src}\n`;
const loc=q.locator||q.reference?.locator;if(loc)out+=`LOCALIZAÇÃO: ${typeof loc==="string"?loc:JSON.stringify(loc)}\n`;out+="\n";}
}
out=`TOTAL GERAL: ${total} QUESTÕES\n\n`+out;fs.mkdirSync("exports",{recursive:true});fs.writeFileSync("exports/ESTIBORDO-7-Bancos-Todas-as-Questoes.txt",out,"utf8");console.log({total,bytes:Buffer.byteLength(out)});

// export-run
