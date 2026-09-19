import { randomInt } from "node:crypto";
import { query, withTransaction } from "./db";
import {
  getQuestionBank,
  getQuestion,
  publicQuestion,
} from "./question-banks";
import { filterQuestions, normalizeQuestionFilters, questionTaxonomy } from "./question-filters";
import { normalizeSubject, subjectLabel } from "./subjects";

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function parseArray(value) {
  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
}

function canonicalQuestionRef(ref) {
  return {
    subject: normalizeSubject(ref?.subject),
    id: String(ref?.id ?? ""),
  };
}

function calculateResult(totalQuestions, answerRows) {
  const total = Number(totalQuestions || 0);
  const answered = answerRows.length;

  const correct = answerRows.reduce(
    (sum, row) => sum + (row.is_correct ? 1 : 0),
    0
  );

  const errors = Math.max(0, answered - correct);

  const scorePercent = total
    ? Math.round((correct / total) * 10000) / 100
    : 0;

  const grade10 = Math.round((scorePercent / 10) * 100) / 100;

  return {
    total_questions: total,
    answered_count: answered,
    correct_count: correct,
    error_count: errors,
    remaining_count: Math.max(0, total - answered),
    completed: total > 0 && answered >= total,
    score_percent: scorePercent,
    grade_10: grade10,
  };
}

function norm(v){
  return String(v||"")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-|-$/g,"");
}

function chapterNumber(value){
  const match=String(value||"").match(/(?:chapter|cap(?:itulo|ítulo)?|cap\.?)[^0-9]*([0-9]+)/i)
    || String(value||"").match(/(?:^|[^0-9])([0-9]+)(?:[^0-9]|$)/);
  return match?String(Number(match[1])):"";
}

function strictFixationMatch(question,subject,fixation){
  if(!fixation)return true;

  const taxonomy=questionTaxonomy(question,subject);
  const wantedWork=norm(fixation.bibliography_key);
  const actualWork=norm(taxonomy.work?.id);
  if(!wantedWork||!actualWork||actualWork!==wantedWork)return false;

  const wantedSection=norm(fixation.section_key);
  const chapter=taxonomy.chapter||null;
  const exactSectionMatch=Boolean(
    wantedSection&&[
      chapter?.id,
      chapter?.label,
      chapter?.title,
      taxonomy.section
    ].some(value=>norm(value)===wantedSection)
  );

  const wantedNumber=chapterNumber(fixation.chapter)||chapterNumber(fixation.section_key);
  const actualNumber=String(chapter?.number||chapterNumber(chapter?.label)||chapterNumber(chapter?.title)||chapterNumber(taxonomy.section)||"");
  const exactChapterNumberMatch=Boolean(wantedNumber&&actualNumber&&wantedNumber===actualNumber);

  return exactSectionMatch||exactChapterNumberMatch;
}


function notebookDescription(subjects, filters, fixation=null){
  const parts=[];
  const subjectNames=(subjects||[]).map(subjectLabel).filter(Boolean);
  if(subjectNames.length)parts.push(`Matérias: ${subjectNames.join(", ")}`);
  if(fixation){
    const work=String(fixation.bibliography_key||"").trim();
    const section=String(fixation.chapter||fixation.section_key||"").trim();
    if(work)parts.push(`Obra: ${work}`);
    if(section)parts.push(`Conteúdo: ${section}`);
    return parts.join(" · ");
  }
  const normalized=normalizeQuestionFilters(filters);
  const labels=[
    ["Obras",normalized.works],
    ["Capítulos",normalized.chapters],
    ["Assuntos",normalized.modules],
  ];
  for(const [label,value] of labels){
    const list=Array.isArray(value)?value.filter(Boolean):(value?[value]:[]);
    if(list.length)parts.push(`${label}: ${list.join(", ")}`);
  }
  return parts.join(" · ");
}

export async function createNotebook(
  userId,
  { subjects, count, filters, fixation=null, title=null }
) {
  const selectedSubjects = [
    ...new Set(
      (subjects || [])
        .map(normalizeSubject)
        .filter(Boolean)
    ),
  ];

  const requestedCount = Math.max(
    1,
    Math.min(100, Number(count) || 20)
  );

  let pool = [];
  const normalizedFilters = normalizeQuestionFilters(filters);

  for (const subject of selectedSubjects) {
    const bank = getQuestionBank(subject);

    for (const question of filterQuestions(bank?.questions || [], normalizedFilters, subject)) {
      pool.push({
        subject,
        id: String(question.id),
      });
    }
  }

  if (!pool.length) {
    return {
      error:
        "Nenhuma questão corresponde às matérias e aos filtros escolhidos.",
      status: 400,
    };
  }

  if(fixation){
    pool=pool.filter(ref=>{
      const question=getQuestion(ref.subject,ref.id);
      return question&&strictFixationMatch(question,ref.subject,fixation);
    });
  }
  const refs = shuffle(pool).slice(0,Math.min(requestedCount,pool.length));
  if(fixation&&!refs.length){
    return {error:"Ainda não há questões indexadas exatamente para esta obra e este capítulo.",status:404};
  }

  const result = await query(
    `
      INSERT INTO question_notebooks (
        user_id,
        title,
        subjects,
        question_refs,
        total_questions
      )
      VALUES (
        $1,
        $2,
        $3::jsonb,
        $4::jsonb,
        $5
      )
      RETURNING *
    `,
    [
      userId,
      title
        ? String(title).slice(0,180)
        : `${Object.values(normalizedFilters).some(Boolean) ? "Caderno filtrado" : "Caderno"} de ${refs.length} questões`,
      JSON.stringify(selectedSubjects),
      JSON.stringify(refs),
      refs.length,
    ]
  );

  return {
    notebook: {...result.rows[0], description:notebookDescription(selectedSubjects, normalizedFilters, fixation)},
  };
}


function notebookScope(refs, fallbackSubjects=[]){
  const subjectSet=new Set((fallbackSubjects||[]).map(normalizeSubject).filter(Boolean));
  const works=new Map();
  const chapters=new Map();
  const modules=new Set();

  for(const rawRef of refs||[]){
    const ref=canonicalQuestionRef(rawRef);
    if(ref.subject)subjectSet.add(ref.subject);
    const question=getQuestion(ref.subject,ref.id);
    if(!question)continue;
    const taxonomy=questionTaxonomy(question,ref.subject);
    if(taxonomy.work?.label||taxonomy.work?.title){
      const label=String(taxonomy.work.label||taxonomy.work.title);
      works.set(taxonomy.work.id||label,label);
    }
    if(taxonomy.chapter?.label||taxonomy.chapter?.title){
      const label=String(taxonomy.chapter.label||taxonomy.chapter.title);
      chapters.set(taxonomy.chapter.id||label,label);
    }
    if(taxonomy.module)modules.add(String(taxonomy.module));
  }

  return {
    subjects:[...subjectSet].map(subjectLabel),
    works:[...works.values()],
    chapters:[...chapters.values()],
    modules:[...modules],
  };
}

export async function listNotebookHistory(userId, limit = 30) {
  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 30));

  const result = await query(
    `
      SELECT
        n.id,
        n.title,
        n.subjects,
        n.question_refs,
        n.total_questions,
        n.created_at,
        n.updated_at,
        COUNT(a.id)::int AS answered_count,
        COUNT(a.id) FILTER (WHERE a.is_correct)::int AS correct_count,
        MAX(a.answered_at) AS last_answered_at
      FROM question_notebooks n
      LEFT JOIN question_notebook_answers a
        ON a.notebook_id = n.id
       AND a.user_id = n.user_id
      WHERE n.user_id = $1
      GROUP BY
        n.id,
        n.title,
        n.subjects,
        n.question_refs,
        n.total_questions,
        n.created_at,
        n.updated_at
      ORDER BY n.created_at DESC
      LIMIT $2
    `,
    [userId, safeLimit]
  );

  return result.rows.map((row) => {
    const total = Number(row.total_questions || 0);
    const answered = Number(row.answered_count || 0);
    const correct = Number(row.correct_count || 0);
    const completed = total > 0 && answered >= total;
    const scorePercent = total
      ? Math.round((correct / total) * 10000) / 100
      : 0;

    const refs=parseArray(row.question_refs);
    const subjects=parseArray(row.subjects);
    return {
      ...row,
      scope:notebookScope(refs,subjects),
      total_questions: total,
      answered_count: answered,
      correct_count: correct,
      remaining_count: Math.max(0, total - answered),
      completed,
      score_percent: scorePercent,
      grade_10: Math.round((scorePercent / 10) * 100) / 100,
    };
  });
}

export async function getNotebook(userId, id) {
  const result = await query(
    `
      SELECT *
      FROM question_notebooks
      WHERE id = $1
        AND user_id = $2
    `,
    [id, userId]
  );

  const notebook = result.rows[0];

  if (!notebook) {
    return null;
  }

  const answersResult = await query(
    `
      SELECT *
      FROM question_notebook_answers
      WHERE notebook_id = $1
        AND user_id = $2
      ORDER BY answered_at
    `,
    [id, userId]
  );

  const answerMap = new Map(
    answersResult.rows.map((answer) => [
      `${normalizeSubject(answer.subject)}:${String(
        answer.question_id
      )}`,
      answer,
    ])
  );

  const refs = parseArray(
    notebook.question_refs
  ).map(canonicalQuestionRef);

  const questions = refs
    .map((ref, index) => {
      const question = getQuestion(
        ref.subject,
        ref.id
      );

      if (!question) return null;

      const savedAnswer = answerMap.get(
        `${ref.subject}:${ref.id}`
      );

      return {
        ...publicQuestion(question),

        subject: ref.subject,
        id: String(question.id),
        position: index,

        answer: savedAnswer
          ? {
              id: savedAnswer.id,
              selected_answer:
                savedAnswer.selected_answer,
              is_correct:
                savedAnswer.is_correct,
              answered_at:
                savedAnswer.answered_at,

              correct_answer:
                question.correct_answer ||
                question.answer ||
                null,

              explanation:
                question.explanation ||
                null,
              source:
                question.source ||
                null,
            }
          : null,
      };
    })
    .filter(Boolean);

  const resultData = calculateResult(
    questions.length,
    answersResult.rows
  );

  return {
    ...notebook,
    questions,
    result: resultData,
  };
}

export async function answerNotebook({
  userId,
  notebookId,
  subject,
  questionId,
  selectedAnswer,
}) {
  return withTransaction(async (client) => {
    const notebookResult = await client.query(
      `
        SELECT
          id,
          question_refs,
          total_questions
        FROM question_notebooks
        WHERE id = $1
          AND user_id = $2
        FOR UPDATE
      `,
      [notebookId, userId]
    );

    if (!notebookResult.rowCount) {
      return {
        error: "Caderno não encontrado.",
        status: 404,
      };
    }

    const notebook =
      notebookResult.rows[0];

    const refs = parseArray(
      notebook.question_refs
    ).map(canonicalQuestionRef);
