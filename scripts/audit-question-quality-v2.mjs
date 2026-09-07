import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const questionsDir = path.join(root, 'data', 'questions');
const reportDir = path.join(root, 'reports');
fs.mkdirSync(reportDir, { recursive: true });

const SUBJECTS = [
  'arte-naval',
  'manobrabilidade',
  'navegacao-aguas-restritas',
  'legislacao-regulamentacao',
  'meteorologia-oceanografia',
  'comunicacoes',
  'conhecimentos-gerais'
];

const FORMAT_STYLES = new Set([
  'Verdadeiro/Falso',
  'Assertivas I–II–III',
  'Assertivas I–IV',
  'Assinale a incorreta',
  'Sequência V/F',
  'Preenchimento de lacuna',
  'Estudo de caso'
]);

function norm(v) {
  return String(v ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function clean(v) {
  return String(v ?? '').replace(/\s+/g, ' ').trim();
}
function tokens(v) {
  return new Set(norm(v).split(' ').filter(t => t.length > 2));
}
function jaccard(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size || !B.size) return 0;
  let intersection = 0;
  for (const t of A) if (B.has(t)) intersection++;
  return intersection / (A.size + B.size - intersection);
}
function answerKey(q) {
  return String(q.correct_answer || q.answer || '').trim().toUpperCase();
}
function correctOption(q) {
  const key = answerKey(q);
  return (q.options || []).find(o => String(o?.key || '').trim().toUpperCase() === key);
}
function optionSignature(q) {
  return (q.options || []).map(o => norm(o?.text)).sort().join('|');
}
function isExpansionV1(q) {
  return Array.isArray(q.tags) && q.tags.includes('expansao-formatos-v1');
}
function isV2(q) {
  return Boolean(q?.taxonomy?.subject_id && q?.taxonomy?.subject_slug && q?.taxonomy?.bibliography_id && q?.taxonomy?.chapter_id && q?.taxonomy?.topic_id);
}
function formatOf(q) {
  return q.question_type || q.style || '';
}
function pushFlag(flags, subject, q, code, severity, detail) {
  flags.push({ subject, id: q.id, code, severity, detail, style: formatOf(q), topic: q.topic, chapter_id: q?.taxonomy?.chapter_id, topic_id: q?.taxonomy?.topic_id });
}

const allFlags = [];
const subjectReports = {};
const globalStemMap = new Map();
const globalOptionsMap = new Map();

for (const subject of SUBJECTS) {
  const file = path.join(questionsDir, `${subject}.json`);
  const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
  const qs = Array.isArray(bank.questions) ? bank.questions : [];
  const byTopic = new Map();
  const byChapter = new Map();
  const styles = {};
  const tags = {};
  let expansionV1 = 0;
  let v2 = 0;
  let structural = 0;
  let contextRisk = 0;
  let distractorRisk = 0;
  let formattingRisk = 0;

  for (const q of qs) {
    if (isV2(q)) v2++;
    const style = formatOf(q) || 'sem-formato';
    styles[style] = (styles[style] || 0) + 1;
    for (const tag of Array.isArray(q.tags) ? q.tags : []) tags[tag] = (tags[tag] || 0) + 1;
    if (isExpansionV1(q)) expansionV1++;
    if (q?.taxonomy?.topic_id) {
      if (!byTopic.has(q.taxonomy.topic_id)) byTopic.set(q.taxonomy.topic_id, []);
      byTopic.get(q.taxonomy.topic_id).push(q.id);
    }
    if (q?.taxonomy?.chapter_id) {
      byChapter.set(q.taxonomy.chapter_id, (byChapter.get(q.taxonomy.chapter_id) || 0) + 1);
    }

    const stem = clean(q.question);
    const stemNorm = norm(stem);
    const opts = Array.isArray(q.options) ? q.options : [];
    const correct = correctOption(q);

    if (!q.id || !stem || !opts.length || !answerKey(q) || !correct) {
      structural++;
      pushFlag(allFlags, subject, q, 'STRUCTURE_CORE', 'critical', 'ID, enunciado, alternativas ou gabarito ausente/inválido.');
    }
    if (!isV2(q)) {
      structural++;
      pushFlag(allFlags, subject, q, 'TAXONOMY_NOT_V2', 'critical', 'Taxonomia V2 incompleta.');
    }
    if (!q?.source?.title || !q?.source?.locator) {
      structural++;
      pushFlag(allFlags, subject, q, 'SOURCE_INCOMPLETE', 'high', 'Referência bibliográfica incompleta.');
    }
    if (q?.tracking?.work?.id && q?.taxonomy?.bibliography_id && q.tracking.work.id !== q.taxonomy.bibliography_id) {
      structural++;
      pushFlag(allFlags, subject, q, 'TRACKING_WORK_MISMATCH', 'high', 'tracking.work.id diverge de taxonomy.bibliography_id.');
    }
    if (q?.tracking?.chapter?.id && q?.taxonomy?.chapter_id && q.tracking.chapter.id !== q.taxonomy.chapter_id) {
      structural++;
      pushFlag(allFlags, subject, q, 'TRACKING_CHAPTER_MISMATCH', 'high', 'tracking.chapter.id diverge de taxonomy.chapter_id.');
    }
    if (q?.tracking?.topic?.id && q?.taxonomy?.topic_id && q.tracking.topic.id !== q.taxonomy.topic_id) {
      structural++;
      pushFlag(allFlags, subject, q, 'TRACKING_TOPIC_MISMATCH', 'high', 'tracking.topic.id diverge de taxonomy.topic_id.');
    }

    if (stemNorm) {
      const key = `${subject}|${stemNorm}`;
      if (globalStemMap.has(key)) {
        contextRisk++;
        pushFlag(allFlags, subject, q, 'DUPLICATE_STEM', 'high', `Enunciado idêntico a ${globalStemMap.get(key)}.`);
      } else globalStemMap.set(key, q.id);
    }
    const optSig = optionSignature(q);
    if (optSig) {
      const key = `${subject}|${optSig}`;
      if (globalOptionsMap.has(key) && globalOptionsMap.get(key) !== q.id) {
        distractorRisk++;
        pushFlag(allFlags, subject, q, 'DUPLICATE_OPTION_SET', 'medium', `Conjunto de alternativas idêntico ao de ${globalOptionsMap.get(key)}.`);
      } else globalOptionsMap.set(key, q.id);
    }

    const badTemplatePhrases = [
      'caracterização tecnicamente correta de',
      'problema-base',
      'a bibliografia atribui a esse item',
      'a referência ',
      'conceito da unidade'
    ];
    for (const phrase of badTemplatePhrases) {
      if (norm(stem).includes(norm(phrase))) {
        contextRisk++;
        pushFlag(allFlags, subject, q, 'GENERIC_TEMPLATE_LANGUAGE', isExpansionV1(q) ? 'high' : 'medium', `Enunciado contém linguagem genérica/template: “${phrase}”.`);
        break;
      }
    }

    if (isExpansionV1(q)) {
      contextRisk++;
      pushFlag(allFlags, subject, q, 'EXPANSION_V1_REVIEW', 'high', 'Questão da expansão V1 requer revisão contextual integral.');
      const artifact = opts.some(o => /\s—\s/.test(String(o?.text || '')));
      if (artifact) {
        contextRisk++;
        pushFlag(allFlags, subject, q, 'TOPIC_OPTION_GLUE', 'high', 'Alternativa aparenta ter sido formada por colagem “tópico — texto de alternativa”, com risco de perda de contexto.');
      }
    }

    if (style === 'Assertivas I–II–III' || style === 'Assertivas I–IV') {
      const romanCount = (String(q.question).match(/(?:^|\n)\s*(?:I|II|III|IV)[\.)]/g) || []).length;
      if ((style === 'Assertivas I–II–III' && romanCount !== 3) || (style === 'Assertivas I–IV' && romanCount !== 4)) {
        formattingRisk++;
        pushFlag(allFlags, subject, q, 'ASSERTION_FORMAT', 'medium', `Quantidade de assertivas incompatível com o formato (${romanCount}).`);
      }
    }
    if (style === 'Sequência V/F') {
      const n = (String(q.question).match(/(?:^|\n)\s*[1-4][\.)]/g) || []).length;
      if (n !== 4) {
        formattingRisk++;
        pushFlag(allFlags, subject, q, 'SEQUENCE_FORMAT', 'medium', `Sequência V/F deveria conter 4 proposições; encontradas ${n}.`);
      }
    }
    if (style === 'Verdadeiro/Falso') {
      if (opts.length !== 2 || norm(opts[0]?.text) !== 'verdadeiro' || norm(opts[1]?.text) !== 'falso') {
        formattingRisk++;
        pushFlag(allFlags, subject, q, 'VF_OPTIONS', 'high', 'Formato V/F não usa exatamente as duas opções Verdadeiro/Falso.');
      }
    } else if (FORMAT_STYLES.has(style) && opts.length !== 5) {
      formattingRisk++;
      pushFlag(allFlags, subject, q, 'FORMAT_OPTION_COUNT', 'high', `Formato ${style} deveria possuir cinco alternativas.`);
    }

    if (opts.length >= 4) {
      const normalizedOpts = opts.map(o => norm(o?.text));
      if (normalizedOpts.some(x => !x) || new Set(normalizedOpts).size !== normalizedOpts.length) {
        distractorRisk++;
        pushFlag(allFlags, subject, q, 'OPTION_DUPLICATE_OR_EMPTY', 'critical', 'Há alternativa vazia ou repetida.');
      }
      const c = clean(correct?.text);
      const lengths = opts.map(o => clean(o?.text).length).filter(Boolean);
      if (lengths.length) {
        const max = Math.max(...lengths), min = Math.min(...lengths);
        if (min > 0 && max / min >= 4.5) {
          distractorRisk++;
          pushFlag(allFlags, subject, q, 'OPTION_LENGTH_OUTLIER', 'low', `Comprimento das alternativas muito desigual (razão ${Math.round((max / min) * 10) / 10}).`);
        }
      }
      const sims = opts.filter(o => o !== correct).map(o => jaccard(c, clean(o?.text)));
      const avg = sims.length ? sims.reduce((a, b) => a + b, 0) / sims.length : 0;
      if (c.length >= 25 && avg < 0.025 && !['Sequência V/F', 'Assertivas I–II–III', 'Assertivas I–IV'].includes(style)) {
        distractorRisk++;
        pushFlag(allFlags, subject, q, 'LOW_DISTRACTOR_SIMILARITY', 'low', `Distratores lexicalmente muito afastados da correta (Jaccard médio ${avg.toFixed(3)}); revisar plausibilidade.`);
      }
    }

    if (stem.length < 18) {
      formattingRisk++;
      pushFlag(allFlags, subject, q, 'STEM_TOO_SHORT', 'low', 'Enunciado muito curto; revisar contexto suficiente.');
    }
    if (/\?\s*\?/.test(stem) || /\.{3,}/.test(stem) || /\s{2,}/.test(String(q.question || ''))) {
      formattingRisk++;
      pushFlag(allFlags, subject, q, 'PUNCTUATION_FORMAT', 'low', 'Pontuação/espaçamento irregular no enunciado.');
    }
  }

  subjectReports[subject] = {
    total: qs.length,
    v2,
    expansion_v1: expansionV1,
    unique_topics: byTopic.size,
    unique_chapters: byChapter.size,
    topics_with_4_or_more_questions: [...byTopic.values()].filter(x => x.length >= 4).length,
    topics_with_8_or_more_questions: [...byTopic.values()].filter(x => x.length >= 8).length,
    structural_flags: structural,
    context_risk_flags: contextRisk,
    distractor_risk_flags: distractorRisk,
    formatting_risk_flags: formattingRisk,
    styles,
    top_tags: Object.entries(tags).sort((a,b) => b[1]-a[1]).slice(0,20).map(([tag,count]) => ({tag,count}))
  };
}

const priority = { critical: 4, high: 3, medium: 2, low: 1 };
allFlags.sort((a,b) => (priority[b.severity] - priority[a.severity]) || a.subject.localeCompare(b.subject) || String(a.id).localeCompare(String(b.id)));

const summary = {
  generated_at: new Date().toISOString(),
  version: 'question-quality-audit-v2',
  totals: {
    questions: Object.values(subjectReports).reduce((n, x) => n + x.total, 0),
    v2: Object.values(subjectReports).reduce((n, x) => n + x.v2, 0),
    expansion_v1: Object.values(subjectReports).reduce((n, x) => n + x.expansion_v1, 0),
    flags: allFlags.length,
    critical: allFlags.filter(x => x.severity === 'critical').length,
    high: allFlags.filter(x => x.severity === 'high').length,
    medium: allFlags.filter(x => x.severity === 'medium').length,
    low: allFlags.filter(x => x.severity === 'low').length
  },
  subjects: subjectReports,
  flags: allFlags
};

fs.writeFileSync(path.join(reportDir, 'question-quality-audit-v2.json'), JSON.stringify(summary, null, 2) + '\n');

const md = [];
md.push('# Auditoria profunda de qualidade — bancos de questões');
md.push('');
md.push(`Gerado em: ${summary.generated_at}`);
md.push('');
md.push(`Total de questões analisadas: **${summary.totals.questions}**`);
md.push(`Taxonomia V2: **${summary.totals.v2}**`);
md.push(`Questões da expansão V1 marcadas para revisão integral: **${summary.totals.expansion_v1}**`);
md.push(`Flags: **${summary.totals.flags}** (críticas ${summary.totals.critical}; altas ${summary.totals.high}; médias ${summary.totals.medium}; baixas ${summary.totals.low})`);
md.push('');
md.push('## Por matéria');
md.push('');
md.push('| Matéria | Questões | Tópicos | Capítulos | Expansão V1 | Contexto | Distratores | Formatação | Estrutural |');
md.push('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const subject of SUBJECTS) {
  const r = subjectReports[subject];
  md.push(`| ${subject} | ${r.total} | ${r.unique_topics} | ${r.unique_chapters} | ${r.expansion_v1} | ${r.context_risk_flags} | ${r.distractor_risk_flags} | ${r.formatting_risk_flags} | ${r.structural_flags} |`);
}
md.push('');
md.push('## Flags prioritárias (primeiras 250)');
md.push('');
md.push('| Gravidade | Matéria | ID | Código | Detalhe |');
md.push('|---|---|---|---|---|');
for (const f of allFlags.slice(0,250)) md.push(`| ${f.severity} | ${f.subject} | ${f.id} | ${f.code} | ${String(f.detail).replace(/\|/g,'\\|')} |`);
md.push('');
md.push('## Critério');
md.push('');
md.push('Esta auditoria é estrutural, textual e heurística. Flags baixas/médias não provam erro técnico; servem para revisão. Questões da expansão V1 são tratadas como risco alto porque foram derivadas por composição automática de tópicos e alternativas, mecanismo que pode produzir enunciados fora de contexto. Correções técnicas de conteúdo devem permanecer vinculadas à fonte bibliográfica indicada.');

fs.writeFileSync(path.join(reportDir, 'question-quality-audit-v2.md'), md.join('\n') + '\n');
console.log(JSON.stringify(summary.totals, null, 2));
for (const subject of SUBJECTS) console.log(subject, subjectReports[subject]);
