import { query, withTransaction } from "./db";
import { filteredQuestionBank, getQuestion } from "./question-banks";
import { normalizeQuestionFilters, questionTaxonomy } from "./question-filters";
import { normalizeSubject, subjectLabel, PSCPP_SUBJECT_SLUG } from "./subjects";
import { buildPscppExam } from "./pscpp-exam-bank";
import { buildHistoricalExam } from "./historical-exam-blueprint";
import { classifyQuestionStructure } from "./question-structure";

export const EXAM_SIZE = 100;
export const EXAM_DURATION_MINUTES = 240;
export const EXAM_DURATION_SECONDS = EXAM_DURATION_MINUTES * 60;

function questionIds(value) {
  if (Array.isArray(value)) return value.map(String);
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function publicQuestion(question, subject) {
  return {
    id: String(question.id),
    subject: normalizeSubject(subject || question.subject),
    module: question.module,
    topic_code: question.topic_code,
    topic: question.topic,
    difficulty: question.difficulty,
    style: question.style,
    question: question.question,
    options: question.options,
    tags: question.tags,
    taxonomy: question.taxonomy || null,
    structure: question.structure || classifyQuestionStructure(question),
    tracking: questionTaxonomy(question, subject),
    pscpp_format: question.pscpp_format,
    cognitive_level: question.cognitive_level,
    assertions: question.assertions,
    contentBlocks: question.contentBlocks,
    table: question.table,
    image: question.image,
  };
}

function scorePercent(correct, answered) {
  return answered ? Math.round((correct / answered) * 10000) / 100 : 0;
}

function sessionResult(session) {
  const answered = Number(session.answered_count || 0);
  const correct = Number(session.correct_count || 0);
  const percent = scorePercent(correct, answered);
  return {
    session_id: session.id,
    subject: session.subject,
    status: session.status,
    reason: session.finish_reason,
    answered,
    correct,
    errors: Math.max(0, answered - correct),
    total_questions: Number(session.total_questions || questionIds(session.question_ids).length),
    score_percent: percent,
    grade_10: Math.round((percent / 10) * 100) / 100,
    started_at: session.started_at,
    expires_at: session.expires_at,
    paused_at: session.paused_at || null,
    remaining_seconds: session.remaining_seconds == null
      ? null
      : Number(session.remaining_seconds),
    finished_at: session.finished_at,
    next_available_at: session.next_available_at || null,
  };
}

function activePayload(session, savedAnswers = []) {
  const ids = questionIds(session.question_ids);
  const answers = new Map(savedAnswers.map((answer) => [String(answer.question_id), answer]));
  const questions = ids
    .map((id) => getQuestion(session.subject, id))
    .filter(Boolean)
    .map((question) => {
      const publicData = publicQuestion(question, session.subject);
      const saved = answers.get(String(question.id));
      if (!saved) return publicData;
      return {
        ...publicData,
        answer: {
          question_id: String(question.id),
          selected_answer: saved.selected_answer,
          correct_answer: String(question.correct_answer || question.answer || "").toUpperCase() || null,
          is_correct: Boolean(saved.is_correct),
          explanation: question.explanation,
          source: question.source,
          locked: true,
        },
      };
    });

  return {
    id: session.id,
    subject: session.subject,
    title: `Simulado de ${subjectLabel(session.subject)}`,
    status: session.status,
    started_at: session.started_at,
    expires_at: session.expires_at,
    paused_at: session.paused_at || null,
    remaining_seconds: session.remaining_seconds == null
      ? null
      : Number(session.remaining_seconds),
    duration_seconds: EXAM_DURATION_SECONDS,
    total_questions: questions.length,
    current_index: Number(session.current_index || session.answered_count || 0),
    answered_count: Number(session.answered_count || 0),
    correct_count: Number(session.correct_count || 0),
    questions,
  };
}

async function sessionAnswers(client, sessionId) {
  const result = await client.query(
    `select question_id,selected_answer,is_correct,response_time_ms,answered_at
       from exam_session_answers
      where session_id=$1
      order by position asc`,
    [sessionId]
  );
  return result.rows;
}

async function availability() {
  // Não há intervalo mínimo entre emissões. O aluno pode iniciar um novo
  // simulado assim que não existir uma tentativa ativa/em pausa.
  return { can_start: true, next_available_at: null, interval_days: 0 };
}

export async function finalizeExamSession(client, session, requestedReason = "manual") {
  if (!["in_progress", "paused"].includes(session.status)) return sessionResult(session);

  const totals = await client.query(
    `select count(*)::int as answered,
            count(*) filter (where is_correct)::int as correct
       from exam_session_answers
      where session_id=$1`,
    [session.id]
  );

  const answered = Number(totals.rows[0]?.answered || 0);
  const correct = Number(totals.rows[0]?.correct || 0);
  const totalQuestions = questionIds(session.question_ids).length;
  const expired = session.status === "paused"
    ? false
    : typeof session.is_expired === "boolean"
      ? session.is_expired
      : new Date(session.expires_at).getTime() <= Date.now();

  const reason = expired