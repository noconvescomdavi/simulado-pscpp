import { randomInt } from "node:crypto";
import { query, withTransaction } from "./db";
import {
  getQuestionBank,
  getQuestion,
  publicQuestion,
} from "./question-banks";
import { filterQuestions, normalizeQuestionFilters } from "./question-filters";
import { normalizeSubject } from "./subjects";

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

function norm(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();}
function fixationScore(q,fixation){
  if(!fixation)return 1;
  const hay=norm([
    q.topic_code,
    q.topic,
    q.module,
    q.tracking?.work?.title,
    q.tracking?.chapter?.label,
    q.tracking?.chapter?.title,
    q.tracking?.section,
    ...(q.tags||[])
  ].join(" "));
  const context=norm([
    fixation.publication,
    fixation.bibliography_key,
    fixation.chapter
  ].filter(Boolean).join(" "));
  const tokens=context.replace(/capitulo|chapter|section|secao|volume|parte|regulation|annex|edicao|edition/g," ").split(/[^a-z0-9]+/).filter(x=>x.length>2);
  let score=0; for(const t of tokens)if(hay.includes(t))score++;
  const keyTokens=norm(fixation.section_key||"").split(/[^a-z0-9]+/).filter(x=>x.length>2);
  for(const t of keyTokens)if(hay.includes(t))score+=2;
  return score;
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
    const ranked=pool.map(ref=>{const q=getQuestion(ref.subject,ref.id);return{ref,score:fixationScore(q||{},fixation)}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    pool=ranked.map(x=>x.ref);
  }
  const refs = (fixation?pool:shuffle(pool)).slice(0,Math.min(requestedCount,pool.length));
  if(fixation&&!refs.length){
    return {error:"Ainda não há questões indexadas com correspondência suficiente para este capítulo.",status:404};
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
    notebook: result.rows[0],
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

    return {
      ...row,
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

    const incomingSubject =
      normalizeSubject(subject);

    const incomingQuestionId =
      String(questionId ?? "");

    let notebookRef = refs.find(
      (ref) =>
        ref.subject === incomingSubject &&
        ref.id === incomingQuestionId
    );

    if (!notebookRef) {
      const sameIdRefs = refs.filter(
        (ref) =>
          ref.id === incomingQuestionId
      );

      if (sameIdRefs.length === 1) {
        notebookRef = sameIdRefs[0];
      }
    }

    if (!notebookRef) {
      return {
        error:
          "Questão não pertence a este caderno.",
        status: 404,
      };
    }

    const canonicalSubject =
      notebookRef.subject;

    const question = getQuestion(
      canonicalSubject,
      notebookRef.id
    );

    if (!question) {
      return {
        error: "Questão não encontrada.",
        status: 404,
      };
    }

    const chosen = String(
      selectedAnswer || ""
    )
      .trim()
      .toUpperCase();

    if (
      !["A", "B", "C", "D", "E"].includes(
        chosen
      )
    ) {
      return {
        error: "Alternativa inválida.",
        status: 400,
      };
    }

    const correctAnswer = String(
      question.correct_answer ||
        question.answer ||
        ""
    )
      .trim()
      .toUpperCase();

    const isCorrect =
      correctAnswer === chosen;

    /*
     * PRIMEIRA RESPOSTA É DEFINITIVA.
     * Não existe UPDATE da alternativa.
     */
    const insertAnswer =
      await client.query(
        `
          INSERT INTO question_notebook_answers (
            notebook_id,
            user_id,
            subject,
            question_id,
            selected_answer,
            is_correct
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
          )
          ON CONFLICT (
            notebook_id,
            subject,
            question_id
          )
          DO NOTHING
          RETURNING
            id,
            selected_answer,
            is_correct,
            answered_at
        `,
        [
          notebookId,
          userId,
          canonicalSubject,
          notebookRef.id,
          chosen,
          isCorrect,
        ]
      );

    if (!insertAnswer.rowCount) {
      const existingResult =
        await client.query(
          `
            SELECT
              selected_answer,
              is_correct,
              answered_at
            FROM question_notebook_answers
            WHERE notebook_id = $1
              AND user_id = $2
              AND subject = $3
              AND question_id = $4
            LIMIT 1
          `,
          [
            notebookId,
            userId,
            canonicalSubject,
            notebookRef.id,
          ]
        );

      const existing =
        existingResult.rows[0];

      return {
        error:
          "Esta questão já foi respondida e não pode ser alterada.",
        status: 409,
        locked: true,

        answer: existing
          ? {
              selected_answer:
                existing.selected_answer,
              is_correct:
                existing.is_correct,
              answered_at:
                existing.answered_at,
              correct_answer:
                correctAnswer || null,
              explanation:
                question.explanation ||
                null,
              source:
                question.source ||
                null,
            }
          : null,
      };
    }

    /*
     * Histórico individual da resposta.
     */
    await client.query(
      `
        INSERT INTO question_answers (
          user_id,
          attempt_id,
          question_id,
          subject,
          selected_answer,
          is_correct
        )
        VALUES (
          $1,
          NULL,
          $2,
          $3,
          $4,
          $5
        )
      `,
      [
        userId,
        notebookRef.id,
        canonicalSubject,
        chosen,
        isCorrect,
      ]
    );

    /*
     * MÉTRICAS DO ALUNO.
     *
     * Cada primeira resposta do caderno entra
     * em question_stats.
     */
    await client.query(
      `
        INSERT INTO question_stats (
          user_id,
          question_id,
          subject,
          answer_count,
          correct_count,
          error_count,
          last_answered_at
        )
        VALUES (
          $1,
          $2,
          $3,
          1,
          $4,
          $5,
          NOW()
        )
        ON CONFLICT (user_id, subject, question_id)
        DO UPDATE SET
          subject = EXCLUDED.subject,
          answer_count =
            question_stats.answer_count + 1,
          correct_count =
            question_stats.correct_count +
            EXCLUDED.correct_count,
          error_count =
            question_stats.error_count +
            EXCLUDED.error_count,
          last_answered_at = NOW()
      `,
      [
        userId,
        notebookRef.id,
        canonicalSubject,
        isCorrect ? 1 : 0,
        isCorrect ? 0 : 1,
      ]
    );

    /*
     * Conta também como atividade de estudo.
     */
    await client.query(
      `
        INSERT INTO study_days (
          user_id,
          study_date,
          activity_count
        )
        VALUES (
          $1,
          (NOW() AT TIME ZONE 'America/Sao_Paulo')::date,
          1
        )
        ON CONFLICT (
          user_id,
          study_date
        )
        DO UPDATE SET
          activity_count =
            study_days.activity_count + 1
      `,
      [userId]
    );

    /*
     * Calcula resultado atualizado diretamente
     * no PostgreSQL.
     */
    const totalsResult =
      await client.query(
        `
          SELECT
            COUNT(*)::int AS answered_count,
            COUNT(*) FILTER (
              WHERE is_correct
            )::int AS correct_count
          FROM question_notebook_answers
          WHERE notebook_id = $1
            AND user_id = $2
        `,
        [notebookId, userId]
      );

    const answeredCount = Number(
      totalsResult.rows[0]
        ?.answered_count || 0
    );

    const correctCount = Number(
      totalsResult.rows[0]
        ?.correct_count || 0
    );

    const totalQuestions =
      refs.length;

    const errorCount =
      answeredCount - correctCount;

    const completed =
      totalQuestions > 0 &&
      answeredCount >= totalQuestions;

    const scorePercent =
      totalQuestions
        ? Math.round(
            (correctCount /
              totalQuestions) *
              10000
          ) / 100
        : 0;

    const grade10 =
      Math.round(
        (scorePercent / 10) * 100
      ) / 100;

    return {
      ok: true,
      locked: true,

      selected_answer: chosen,
      is_correct: isCorrect,

      correct_answer:
        correctAnswer || null,

      explanation:
        question.explanation ||
        null,

      source:
        question.source ||
        null,

      progress: {
        total_questions:
          totalQuestions,
        answered_count:
          answeredCount,
        correct_count:
          correctCount,
        error_count:
          errorCount,
        remaining_count:
          Math.max(
            0,
            totalQuestions -
              answeredCount
          ),
        completed,
        score_percent:
          scorePercent,
        grade_10:
          grade10,
      },

      result: completed
        ? {
            total_questions:
              totalQuestions,
            answered_count:
              answeredCount,
            correct_count:
              correctCount,
            error_count:
              errorCount,
            completed: true,
            score_percent:
              scorePercent,
            grade_10:
              grade10,
          }
        : null,

      message: completed
        ? "Caderno concluído."
        : "Resposta salva. Esta resposta não poderá mais ser alterada.",
    };
  });
}
