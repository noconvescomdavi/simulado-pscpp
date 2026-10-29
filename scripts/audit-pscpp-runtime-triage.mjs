import fs from 'node:fs';
import { classifyQuestionStructure } from '../lib/question-structure.js';
import { hasLocatorOnlyCommand } from '../lib/question-locator-audit.js';

// Candidates for individual inspection, never automatic bibliographic verdicts.
// Mirrors existing complete-stem and locator tests without relaxing either.
const {banks} = JSON.parse(fs.readFileSync('data/questions/runtime-active-banks.json'));
const findings = [];
for (const [subject,bank] of Object.entries(banks)) {
  if (subject === 'situacoes-de-manobra-ripeam') continue;
  for (const q of bank.questions) {
    const combination = q.options.some(o => /(?:apenas|somente)\s+(?:as?\s+(?:afirmativas|assertivas)\s+)?(?:I|II|III|IV|V)\b/i.test(typeof o === 'string' ? o : o.text));
    if (combination && !classifyQuestionStructure(q).blocks.some(b => b.type === 'assertions' || b.type === 'items')) {
      findings.push({subject,id:q.id,code:'COMBINATION_WITHOUT_PARSED_ASSERTIONS_CANDIDATE',
        status:'requires_render_and_primary_source_review',stem:q.question});
    }
    if (subject === 'legislacao-regulamentacao' && hasLocatorOnlyCommand(q)) {
      findings.push({subject,id:q.id,code:'LOCATOR_COMMAND_CANDIDATE',
        status:'requires_individual_primary_source_review',stem:q.question});
    }
  }
}
fs.writeFileSync('docs/auditoria-pscpp/TRIAGEM_RUNTIME.json',JSON.stringify(findings,null,2)+'\n');
const counts = {};
for (const finding of findings) counts[finding.code] = (counts[finding.code] || 0)+1;
console.log(JSON.stringify({scope:'notebook effective snapshot; same predicates as existing tests',counts,
  note:'Triage does not certify, rewrite or quarantine questions.'},null,2));
