#!/usr/bin/env node
// Dry-run: audit effective origins for Lobo/Soares tides MEO-0007 through MEO-0018.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { collectActiveQuestionBanks } from "../lib/question-banks-source.js";

const root = new URL("../", import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), "utf8"));
const canonical = await read("data/questions/meteorologia-oceanografia.json");
const restoration = await read("data/question-restorations/meteorologia-oceanografia-01.json");
const proposed = await read("docs/auditoria-nove-fontes-20261121/COTEJO_LOBO_MARES_001.json");
const active = collectActiveQuestionBanks()["meteorologia-oceanografia"];
const ids = Array.from({length:12}, (_,i) => "MEO-" + String(i+7).padStart(4,"0"));
const byId = (questions,id) => (questions||[]).filter(q => String(q.id)===id);
const hash = q => q ? createHash("sha256").update(JSON.stringify({
  question:q.question, options:q.options, correct_answer:q.correct_answer,
  explanation:q.explanation,source:q.source,taxonomy:q.taxonomy
})).digest("hex") : null;
const records = ids.map(id => {
  const c=byId(canonical.questions,id);
  const r=byId(restoration.questions,id);
  const a=byId(active.questions,id);
  const p=(proposed.records||[]).filter(q=>q.id===id);
  const same = !!a[0] && !!r[0] && hash(a[0])===hash(r[0]);
  return {id,canonical_count:c.length,restoration_count:r.length,active_count:a.length,
    proposal_count:p.length,canonical_hash:hash(c[0]),restoration_hash:hash(r[0]),
    active_hash:hash(a[0]),proposal_hash:hash(p[0]?.proposal),effective_matches_restoration:same,
    origin_confirmed:c.length===1 && r.length===1 && a.length===1 && p.length===1 && same};
});
const confirmed=records.filter(r=>r.origin_confirmed).length;
const result={kind:"PSCPP_LOBO_ORIGIN_DIAGNOSTIC",checked:records.length,confirmed,blocked:records.length-confirmed,records};
const out=process.argv.find(s=>s.startsWith("--out="));
if(out) await writeFile(out.slice(6),JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify(result,null,2));
if(process.argv.includes("--check") && confirmed!==records.length) process.exitCode=1;
