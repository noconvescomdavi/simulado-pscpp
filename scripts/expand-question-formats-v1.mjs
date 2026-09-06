import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const questionsDir = path.join(root, 'data', 'questions');
const reportPath = path.join(root, 'reports', 'format-expansion-v1.json');
const deficitPath = path.join(root, 'reports', 'coverage-deficits-summary.json');

const SUBJECTS = [
  'arte-naval',
  'manobrabilidade',
  'navegacao-aguas-restritas',
  'legislacao-regulamentacao',
  'meteorologia-oceanografia',
  'comunicacoes',
  'conhecimentos-gerais'
];

const PER_FORMAT = 12;
const FORMAT_DEFS = [
  { code: 'VF', style: 'Verdadeiro/Falso' },
  { code: 'A123', style: 'Assertivas I–II–III' },
  { code: 'INC', style: 'Assinale a incorreta' },
  { code: 'SEQVF', style: 'Sequência V/F' },
  { code: 'LAC', style: 'Preenchimento de lacuna' },
  { code: 'CASO', style: 'Estudo de caso' }
];
const KEYS = ['A', 'B', 'C', 'D', 'E'];

const deficits = fs.existsSync(deficitPath)
  ? JSON.parse(fs.readFileSync(deficitPath, 'utf8'))
  : { subjects: {} };

function norm(v) {
  return String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}
function clean(v) {
  return String(v ?? '').replace(/\s+/g, ' ').trim();
}
function answerKey(q) {
  return String(q.correct_answer || q.answer || '').trim().toUpperCase();
}
function correctText(q) {
  const key = answerKey(q);
  return clean((q.options || []).find(o => String(o?.key || '').toUpperCase() === key)?.text);
}
function wrongTexts(q) {
  const key = answerKey(q);
  return (q.options || [])
    .filter(o => String(o?.key || '').toUpperCase() !== key)
    .map(o => clean(o?.text))
    .filter(Boolean);
}
function topicLabel(q) {
  return clean(q.topic || q?.tracking?.topic?.title || q?.tracking?.chapter?.title || q?.tracking?.chapter?.label || q?.taxonomy?.topic_id || 'conceito da unidade');
}
function chapterLabel(q) {
  return clean(q?.tracking?.chapter?.title || q?.tracking?.chapter?.label || q?.tracking?.section || q?.taxonomy?.chapter_id || 'unidade bibliográfica');
}
function sourcePendingChapters(subjectSlug) {
  return new Set((deficits?.subjects?.[subjectSlug]?.rows || [])
    .filter(r => r.status === 'fonte_pendente')
    .map(r => r.chapter_id));
}
function eligibleQuestion(q, blocked) {
  if (!q?.id || !q?.taxonomy?.chapter_id || !q?.taxonomy?.bibliography_id) return false;
  if (blocked.has(q.taxonomy.chapter_id)) return false;
  if (!Array.isArray(q.options) || q.options.length < 5) return false;
  if (!correctText(q) || wrongTexts(q).length < 1) return false;
  if (!clean(q.explanation)) return false;
  const tags = Array.isArray(q.tags) ? q.tags : [];
  if (tags.includes('expansao-formatos-v1')) return false;
  if (FORMAT_DEFS.some(f => q.style === f.style || q.question_type === f.style)) return false;
  return true;
}
function groupByChapter(pool) {
  const map = new Map();
  for (const q of pool) {
    const id = q.taxonomy.chapter_id;
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(q);
  }
  return [...map.entries()]
    .map(([chapterId, questions]) => ({ chapterId, questions }))
    .filter(g => g.questions.length >= 6)
    .sort((a, b) => a.chapterId.localeCompare(b.chapterId));
}
function prefixInfo(questions, subjectSlug) {
  const candidates = questions.map(q => String(q.id || '')).map(id => id.match(/^([A-Za-z]+)-(\d+)$/)).filter(Boolean);
  const prefix = candidates[0]?.[1] || subjectSlug.replace(/[^a-z]/gi, '').slice(0, 4).toUpperCase();
  let max = 0;
  for (const m of candidates) if (m[1].toUpperCase() === prefix.toUpperCase()) max = Math.max(max, Number(m[2]));
  return { prefix, max, width: Math.max(4, ...candidates.filter(m => m[1].toUpperCase() === prefix.toUpperCase()).map(m => m[2].length)) };
}
function nextIdFactory(questions, subjectSlug) {
  const info = prefixInfo(questions, subjectSlug);
  let n = info.max;
  return () => `${info.prefix}-${String(++n).padStart(info.width, '0')}`;
}
function fiveOptions(texts, correctTextValue, desiredIndex) {
  const uniq = [];
  for (const t of texts.map(clean)) if (t && !uniq.includes(t)) uniq.push(t);
  if (!uniq.includes(correctTextValue)) uniq.unshift(correctTextValue);
  const wrong = uniq.filter(t => t !== correctTextValue).slice(0, 4);
  while (wrong.length < 4) wrong.push(`Distrator técnico ${wrong.length + 1}`);
  const ordered = [];
  let w = 0;
  for (let i = 0; i < 5; i++) ordered.push(i === desiredIndex ? correctTextValue : wrong[w++]);
  return { options: ordered.map((text, i) => ({ key: KEYS[i], text })), correct_answer: KEYS[desiredIndex] };
}
function rotateBaseOptions(q, desiredIndex) {
  const correct = correctText(q);
  const texts = (q.options || []).map(o => clean(o.text));
  return fiveOptions(texts, correct, desiredIndex);
}
function statementFrom(q, truth, seed = 0) {
  const text = truth ? correctText(q) : wrongTexts(q)[seed % wrongTexts(q).length];
  return `${topicLabel(q)} — ${text}`;
}
function withMeta(base, extra = {}) {
  const tags = [...new Set([...(Array.isArray(base.tags) ? base.tags : []), 'expansao-formatos-v1', extra.tag].filter(Boolean))];
  return {
    subject: base.subject,
    module: base.module,
    topic: extra.topic || base.topic,
    difficulty: extra.difficulty || base.difficulty || 'Médio',
    taxonomy: structuredClone(base.taxonomy),
    tracking: structuredClone(base.tracking || {}),
    source: structuredClone(base.source || {}),
    tags,
    question_type: extra.style,
    provenance: {
      method: 'format-expansion-v1',
      derived_from_question_ids: extra.derivedIds || [base.id]
    }
  };
}
function makeTrueFalse({ base, id, seq }) {
  const truth = seq % 2 === 0;
  const statement = statementFrom(base, truth, seq);
  return {
    id,
    ...withMeta(base, { style: 'Verdadeiro/Falso', tag: 'formato-vf', difficulty: seq % 3 === 0 ? 'Médio' : 'Fácil' }),
    style: 'Verdadeiro/Falso',
    topic_code: `FMT.VF.${String(seq + 1).padStart(3, '0')}`,
    question: `Julgue a afirmativa a seguir, considerando ${chapterLabel(base)}: “${statement}”.`,
    options: [{ key: 'A', text: 'Verdadeiro' }, { key: 'B', text: 'Falso' }],
    correct_answer: truth ? 'A' : 'B',
    explanation: truth
      ? `A afirmativa é verdadeira. A caracterização correta de “${topicLabel(base)}” é: ${correctText(base)}.`
      : `A afirmativa é falsa. Para “${topicLabel(base)}”, a formulação correta é: ${correctText(base)}.`
  };
}
function makeAssertions({ bases, id, seq }) {
  const patterns = [
    { truth: [true, false, false], answer: 0, label: 'apenas I' },
    { truth: [false, true, false], answer: 1, label: 'apenas II' },
    { truth: [true, true, false], answer: 2, label: 'I e II' },
    { truth: [false, true, true], answer: 3, label: 'II e III' },
    { truth: [true, true, true], answer: 4, label: 'I, II e III' }
  ];
  const p = patterns[seq % patterns.length];
  const props = bases.map((q, i) => statementFrom(q, p.truth[i], seq + i));
  return {
    id,
    ...withMeta(bases[0], { style: 'Assertivas I–II–III', tag: 'formato-assertivas-123', difficulty: seq % 2 ? 'Difícil' : 'Médio', derivedIds: bases.map(q => q.id), topic: `${chapterLabel(bases[0])} — assertivas` }),
    style: 'Assertivas I–II–III',
    topic_code: `FMT.A123.${String(seq + 1).padStart(3, '0')}`,
    question: `Analise as assertivas sobre ${chapterLabel(bases[0])}:\nI. ${props[0]}.\nII. ${props[1]}.\nIII. ${props[2]}.\nAssinale a alternativa correta.`,
    options: [
      { key: 'A', text: 'Apenas a assertiva I está correta.' },
      { key: 'B', text: 'Apenas a assertiva II está correta.' },
      { key: 'C', text: 'Apenas as assertivas I e II estão corretas.' },
      { key: 'D', text: 'Apenas as assertivas II e III estão corretas.' },
      { key: 'E', text: 'As assertivas I, II e III estão corretas.' }
    ],
    correct_answer: KEYS[p.answer],
    explanation: `Estão corretas ${p.label}. Referências corretas: I — ${correctText(bases[0])}; II — ${correctText(bases[1])}; III — ${correctText(bases[2])}.`
  };
}
function makeIncorrect({ bases, id, seq }) {
  const falseIndex = seq % 5;
  const statements = bases.map((q, i) => statementFrom(q, i !== falseIndex, seq + i));
  return {
    id,
    ...withMeta(bases[0], { style: 'Assinale a incorreta', tag: 'formato-incorreta', difficulty: 'Difícil', derivedIds: bases.map(q => q.id), topic: `${chapterLabel(bases[0])} — identificação da incorreta` }),
    style: 'Assinale a incorreta',
    topic_code: `FMT.INC.${String(seq + 1).padStart(3, '0')}`,
    question: `Considerando ${chapterLabel(bases[0])}, assinale a alternativa INCORRETA.`,
    options: statements.map((text, i) => ({ key: KEYS[i], text })),
    correct_answer: KEYS[falseIndex],
    explanation: `A alternativa ${KEYS[falseIndex]} é a incorreta. Para “${topicLabel(bases[falseIndex])}”, a formulação correta é: ${correctText(bases[falseIndex])}.`
  };
}
function makeSequenceVF({ bases, id, seq }) {
  const patterns = [
    [true, true, false, false],
    [true, false, true, false],
    [false, true, true, false],
    [true, false, false, true],
    [false, true, false, true]
  ];
  const pIndex = seq % patterns.length;
  const p = patterns[pIndex];
  const props = bases.map((q, i) => statementFrom(q, p[i], seq + i));
  const labels = patterns.map(x => x.map(v => v ? 'V' : 'F').join(' – '));
  return {
    id,
    ...withMeta(bases[0], { style: 'Sequência V/F', tag: 'formato-sequencia-vf', difficulty: 'Difícil', derivedIds: bases.map(q => q.id), topic: `${chapterLabel(bases[0])} — sequência V/F` }),
    style: 'Sequência V/F',
    topic_code: `FMT.SEQVF.${String(seq + 1).padStart(3, '0')}`,
    question: `Julgue as proposições sobre ${chapterLabel(bases[0])} como verdadeiras (V) ou falsas (F):\n1. ${props[0]}.\n2. ${props[1]}.\n3. ${props[2]}.\n4. ${props[3]}.\nAssinale a sequência correta.`,
    options: labels.map((text, i) => ({ key: KEYS[i], text })),
    correct_answer: KEYS[pIndex],
    explanation: `A sequência correta é ${labels[pIndex]}. As formulações corretas dos quatro pontos são: ${bases.map((q, i) => `${i + 1}) ${correctText(q)}`).join(' ')}`
  };
}
function makeBlank({ base, id, seq }) {
  const desired = seq % 5;
  const rotated = rotateBaseOptions(base, desired);
  return {
    id,
    ...withMeta(base, { style: 'Preenchimento de lacuna', tag: 'formato-lacuna', difficulty: seq % 2 ? 'Médio' : 'Fácil' }),
    style: 'Preenchimento de lacuna',
    topic_code: `FMT.LAC.${String(seq + 1).padStart(3, '0')}`,
    question: `Complete corretamente a lacuna: em ${chapterLabel(base)}, a caracterização tecnicamente correta de “${topicLabel(base)}” é ______.`,
    options: rotated.options,
    correct_answer: rotated.correct_answer,
    explanation: `A lacuna deve ser preenchida por: ${correctText(base)}.`
  };
}
function makeCase({ base, id, seq }) {
  const desired = (seq * 2 + 1) % 5;
  const rotated = rotateBaseOptions(base, desired);
  return {
    id,
    ...withMeta(base, { style: 'Estudo de caso', tag: 'formato-estudo-de-caso', difficulty: seq % 3 === 0 ? 'Difícil' : 'Médio' }),
    style: 'Estudo de caso',
    topic_code: `FMT.CASO.${String(seq + 1).padStart(3, '0')}`,
    question: `Durante um exercício de preparação operacional sobre ${chapterLabel(base)}, a equipe precisa resolver a seguinte situação técnica: “${clean(base.question)}” Considerando a bibliografia indicada para essa unidade, qual alternativa representa a decisão ou interpretação correta?`,
    options: rotated.options,
    correct_answer: rotated.correct_answer,
    explanation: `No caso apresentado, a resposta tecnicamente correta é: ${correctText(base)}. ${clean(base.explanation)}`
  };
}

function buildForSubject(subjectSlug) {
  const file = path.join(questionsDir, `${subjectSlug}.json`);
  const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
  const blocked = sourcePendingChapters(subjectSlug);
  const originalQuestions = bank.questions || [];
  const pool = originalQuestions.filter(q => eligibleQuestion(q, blocked));
  const groups = groupByChapter(pool);
  if (!groups.length) throw new Error(`${subjectSlug}: nenhuma unidade elegível com >=6 questões-fonte.`);
  const nextId = nextIdFactory(originalQuestions, subjectSlug);
  const added = [];
  const counts = Object.fromEntries(FORMAT_DEFS.map(f => [f.style, 0]));

  function basesFor(seq, count, formatOffset) {
    const g = groups[(seq + formatOffset) % groups.length];
    const start = (seq * 3 + formatOffset * 5) % g.questions.length;
    const out = [];
    for (let i = 0; i < count; i++) out.push(g.questions[(start + i) % g.questions.length]);
    return out;
  }

  for (let seq = 0; seq < PER_FORMAT; seq++) {
    const q = makeTrueFalse({ base: basesFor(seq, 1, 0)[0], id: nextId(), seq }); added.push(q); counts[q.style]++;
  }
  for (let seq = 0; seq < PER_FORMAT; seq++) {
    const q = makeAssertions({ bases: basesFor(seq, 3, 1), id: nextId(), seq }); added.push(q); counts[q.style]++;
  }
  for (let seq = 0; seq < PER_FORMAT; seq++) {
    const q = makeIncorrect({ bases: basesFor(seq, 5, 2), id: nextId(), seq }); added.push(q); counts[q.style]++;
  }
  for (let seq = 0; seq < PER_FORMAT; seq++) {
    const q = makeSequenceVF({ bases: basesFor(seq, 4, 3), id: nextId(), seq }); added.push(q); counts[q.style]++;
  }
  for (let seq = 0; seq < PER_FORMAT; seq++) {
    const q = makeBlank({ base: basesFor(seq, 1, 4)[0], id: nextId(), seq }); added.push(q); counts[q.style]++;
  }
  for (let seq = 0; seq < PER_FORMAT; seq++) {
    const q = makeCase({ base: basesFor(seq, 1, 5)[0], id: nextId(), seq }); added.push(q); counts[q.style]++;
  }

  const existingIds = new Set(originalQuestions.map(q => String(q.id)));
  const newIds = new Set();
  const existingPrompts = new Set(originalQuestions.map(q => norm(q.question)));
  for (const q of added) {
    if (existingIds.has(String(q.id)) || newIds.has(String(q.id))) throw new Error(`${subjectSlug}: ID duplicado ${q.id}`);
    newIds.add(String(q.id));
    const sig = norm(q.question);
    if (!sig || existingPrompts.has(sig)) throw new Error(`${subjectSlug}: enunciado duplicado ${q.id}`);
    existingPrompts.add(sig);
  }

  bank.questions.push(...added);
  bank.validation = { ...(bank.validation || {}), total: bank.questions.length };
  fs.writeFileSync(file, JSON.stringify(bank, null, 2) + '\n');

  return {
    subject_slug: subjectSlug,
    before: originalQuestions.length,
    added: added.length,
    after: bank.questions.length,
    source_pool: pool.length,
    eligible_chapters: groups.length,
    blocked_source_pending_chapters: blocked.size,
    counts
  };
}

const report = {
  generated_at: new Date().toISOString(),
  version: 'format-expansion-v1',
  per_format_per_subject: PER_FORMAT,
  formats: FORMAT_DEFS.map(x => x.style),
  subjects: SUBJECTS.map(buildForSubject)
};
report.total_added = report.subjects.reduce((s, x) => s + x.added, 0);
report.total_after = report.subjects.reduce((s, x) => s + x.after, 0);
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
