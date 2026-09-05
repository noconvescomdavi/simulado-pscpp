import { randomInt } from "node:crypto";
import { query, withTransaction } from "./db";
import { getQuestion, getQuestionBank } from "./question-banks";
import { normalizeSubject, subjectLabel } from "./subjects";

export const EXAM_SIZE = 100;
export const EXAM_DURATION_MINUTES = 240;
export const EXAM_DURATION_SECONDS = EXAM_DURATION_MINUTES * 60;

function weeklyIntervalDays() {
  const configured = Number.parseInt(process.env.EXAM_WEEKLY_INTERVAL_DAYS || "7", 10);
  return Number.isInteger(configured) && configured >= 0 ? configured : 7;
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

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
    finished_at: session.finished_at,
    next_available_at: session.next_available_at || null,
  };
}

function activePayload(session) {
  const ids = questionIds(session.question_ids);
  const questions = ids
    .map((id) => getQuestion(session.subject, id))
    .filter(Boolean)
    .map((question) => publicQuestion(question, session.subject));

  return {
    id: session.id,
    subject: session.subject,
    title: `Simulado de ${subjectLabel(session.subject)}`,
    status: session.status,
    started_at: session.started_at,
    expires_at: session.expires_at,
    duration_seconds: EXAM_DURATION_SECONDS,
    total_questions: questions.length,
    current_index: Number(session.current_index || session.answered_count || 0),
    answered_count: Number(session.answered_count || 0),
    correct_count: Number(session.correct_count || 0),
    questions,
  };
}

async function availability(userId, subject, executor = query) {
  const intervalDays = weeklyIntervalDays();
  if (intervalDays === 0) {
    return { can_start: true, next_available_at: null, interval_days: 0 };
  }

  const result = await executor(
    `select started_at + ($3::int * interval '1 day') as next_available_at
       from exam_sessions
      where user_id=$1 and subject=$2
      order by started_at desc
      limit 1`,
    [userId, subject, intervalDays]
  );

  const next = result.rows[0]?.next_available_at || null;
  return {
    can_start: !next || new Date(next).getTime() <= Date.now(),
    next_available_at: next,
    interval_days: intervalDays,
  };
}

export async function finalizeExamSession(client, session, requestedReason = "manual") {
  if (session.status !== "in_progress") return sessionResult(session);

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
  const expired =
    typeof session.is_expired === "boolean"
      ? session.is_expired
      : new Date(session.expires_at).getTime() <= Date.now();

  const reason = expired
    ? "timeout"
    : answered >= totalQuestions
      ? "completed"
      : requestedReason;

  const status = reason === "timeout" ? "expired" : "completed";
  const durationSeconds = Math.max(
    0,
    Math.min(
      EXAM_DURATION_SECONDS,
      Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000)
    )
  );

  let attemptId = session.attempt_id || null;
  if (!attemptId) {
    const attempt = await client.query(
      `insert into exam_attempts
       (user_id,module,subject,score_percent,correct_answers,wrong_answers,total_questions,duration_seconds)
       values($1,$2,$3,$4,$5,$6,$7,$8)
       returning id`,
      [
        session.user_id,
        `Simulado de ${subjectLabel(session.subject)} — ${totalQuestions} questões`,
        session.subject,
        scorePercent(correct, answered),
        correct,
        Math.max(0, answered - correct),
        answered,
        durationSeconds,
      ]
    );
    attemptId = attempt.rows[0].id;

    await client.query(
      "update question_answers set attempt_id=$1 where session_id=$2 and attempt_id is null",
      [attemptId, session.id]
    );
  }

  const updated = await client.query(
    `update exam_sessions
        set status=$2,
            finished_at=coalesce(finished_at,now()),
            finish_reason=$3,
            attempt_id=$4,
            answered_count=$5,
            correct_count=$6,
            current_index=$5,
            updated_at=now()
      where id=$1
      returning *`,
    [session.id, status, reason, attemptId, answered, correct]
  );

  return sessionResult(updated.rows[0]);
}

export async function getExamState(userId, rawSubject) {
  const subject = normalizeSubject(rawSubject);

  return withTransaction(async (client) => {
    const current = await client.query(
      `select *, expires_at <= now() as is_expired
         from exam_sessions
        where user_id=$1 and subject=$2 and status='in_progress'
        order by started_at desc
        limit 1
        for update`,
      [userId, subject]
    );

    const session = current.rows[0];
    if (session) {
      const ids = questionIds(session.question_ids);
      if (session.is_expired || Number(session.answered_count) >= ids.length) {
        const result = await finalizeExamSession(client, session, "completed");
        const available = await availability(userId, subject, client.query.bind(client));
        return { state: "finished", result: { ...result, ...available } };
      }

      return { state: "in_progress", exam: activePayload(session) };
    }

    return {
      state: "available",
      ...(await availability(userId, subject, client.query.bind(client))),
    };
  });
}

export async function startExam(userId, rawSubject) {
  const subject = normalizeSubject(rawSubject);
  const bank = getQuestionBank(subject);

  if (!bank?.questions?.length) {
    return {
      error: "Matéria sem banco de questões.",
      code: "QUESTION_BANK_NOT_FOUND",
      status: 404,
    };
  }

  return withTransaction(async (client) => {
    await client.query("select pg_advisory_xact_lock(hashtext($1))", [
      `exam:${userId}:${subject}`,
    ]);

    const current = await client.query(
      `select *, expires_at <= now() as is_expired
         from exam_sessions
        where user_id=$1 and subject=$2 and status='in_progress'
        order by started_at desc
        limit 1
        for update`,
      [userId, subject]
    );

    const existing = current.rows[0];
    if (existing && !existing.is_expired) {
      return { state: "in_progress", exam: activePayload(existing), resumed: true };
    }

    if (existing) {
      await finalizeExamSession(client, existing, "timeout");
    }

    const available = await availability(userId, subject, client.query.bind(client));
    if (!available.can_start) {
      return {
        error: `Já existe um simulado emitido nos últimos ${available.interval_days} dias.`,
        code: "WEEKLY_LIMIT",
        status: 429,
        ...available,
      };
    }

    const ids = shuffle(bank.questions.map((question) => String(question.id))).slice(
      0,
      Math.min(EXAM_SIZE, bank.questions.length)
    );

    const created = await client.query(
      `insert into exam_sessions
       (user_id,subject,status,question_ids,total_questions,started_at,expires_at)
       values($1,$2,'in_progress',$3::jsonb,$4,now(),now()+($5::int * interval '1 minute'))
       returning *`,
      [userId, subject, JSON.stringify(ids), ids.length, EXAM_DURATION_MINUTES]
    );

    return { state: "in_progress", exam: activePayload(created.rows[0]), resumed: false };
  });
}

export async function submitExamAnswer({
  userId,
  rawSubject,
  sessionId,
  questionId,
  selectedAnswer,
  responseTimeMs,
}) {
  const subject = normalizeSubject(rawSubject);

  return withTransaction(async (client) => {
    const row = await client.query(
      `select *, expires_at <= now() as is_expired
         from exam_sessions
        where id=$1 and user_id=$2 and subject=$3
        limit 1
        for update`,
      [sessionId, userId, subject]
    );

    const session = row.rows[0];
    if (!session) {
      return { error: "Simulado não encontrado.", code: "EXAM_NOT_FOUND", status: 404 };
    }

    if (session.status !== "in_progress") {
      return {
        error: "Este simulado já foi finalizado.",
        code: "EXAM_FINISHED",
        status: 409,
        result: sessionResult(session),
      };
    }

    if (session.is_expired) {
      const result = await finalizeExamSession(client, session, "timeout");
      const available = await availability(userId, subject, client.query.bind(client));
      return {
        error: "O tempo do simulado terminou.",
        code: "EXAM_EXPIRED",
        status: 409,
        result: { ...result, ...available },
      };
    }

    const question = getQuestion(subject, questionId);
    const metricSubject = normalizeSubject(question?.source_subject || subject);
    const metricQuestionId = String(question?.source_id || question?.id || questionId);
    const ids = questionIds(session.question_ids);
    if (!question || !ids.includes(String(questionId))) {
      return {
        error: "Questão inválida para este simulado.",
        code: "INVALID_QUESTION",
        status: 400,
      };
    }

    const duplicate = await client.query(
      `select selected_answer,is_correct,response_time_ms,answered_at
         from exam_session_answers
        where session_id=$1 and question_id=$2
        limit 1`,
      [session.id, String(question.id)]
    );

    if (duplicate.rowCount) {
      const saved = duplicate.rows[0];
      return {
        ok: true,
        duplicate: true,
        locked: true,
        question_id: String(question.id),
        selected_answer: saved.selected_answer,
        correct_answer: String(question.correct_answer || question.answer || "").toUpperCase(),
        is_correct: saved.is_correct,
        explanation: question.explanation,
        source: question.source,
        answered_count: Number(session.answered_count || 0),
        correct_count: Number(session.correct_count || 0),
      };
    }

    const expectedQuestionId = ids[Number(session.answered_count || 0)];
    if (String(question.id) !== String(expectedQuestionId)) {
      return {
        error: "Salve as questões na ordem apresentada.",
        code: "OUT_OF_SEQUENCE",
        status: 409,
      };
    }

    const chosen = String(selectedAnswer || "").trim().toUpperCase();
    const correctAnswer = String(question.correct_answer || question.answer || "")
      .trim()
      .toUpperCase();
    const isCorrect = chosen === correctAnswer;
    const position = Number(session.answered_count || 0);
    const safeResponseTimeMs = Math.max(
      0,
      Math.min(EXAM_DURATION_SECONDS * 1000, Math.trunc(Number(responseTimeMs) || 0))
    );

    await client.query(
      `insert into exam_session_answers
       (session_id,user_id,question_id,position,selected_answer,is_correct,response_time_ms)
       values($1,$2,$3,$4,$5,$6,$7)`,
      [
        session.id,
        userId,
        String(question.id),
        position,
        chosen,
        isCorrect,
        safeResponseTimeMs,
      ]
    );

    await client.query(
      `insert into question_answers
       (user_id,session_id,question_id,subject,selected_answer,is_correct,response_time_ms)
       values($1,$2,$3,$4,$5,$6,$7)`,
      [
        userId,
        session.id,
        metricQuestionId,
        metricSubject,
        chosen,
        isCorrect,
        safeResponseTimeMs,
      ]
    );

    await client.query(
      `insert into question_stats
       (user_id,question_id,subject,answer_count,correct_count,error_count,last_answered_at)
       values($1,$2,$3,1,$4,$5,now())
       on conflict(user_id,subject,question_id) do update set
         answer_count=question_stats.answer_count+1,
         correct_count=question_stats.correct_count+excluded.correct_count,
         error_count=question_stats.error_count+excluded.error_count,
         last_answered_at=now()`,
      [userId, metricQuestionId, metricSubject, isCorrect ? 1 : 0, isCorrect ? 0 : 1]
    );

    await client.query(
      `insert into study_days(user_id,study_date,activity_count)
       values($1,current_date,1)
       on conflict(user_id,study_date) do update
         set activity_count=study_days.activity_count+1`,
      [userId]
    );

    const updated = await client.query(
      `update exam_sessions
          set answered_count=answered_count+1,
              correct_count=correct_count+$2,
              current_index=current_index+1,
              updated_at=now()
        where id=$1
        returning *`,
      [session.id, isCorrect ? 1 : 0]
    );

    const updatedSession = updated.rows[0];
    const answeredCount = Number(updatedSession.answered_count || 0);
    const correctCount = Number(updatedSession.correct_count || 0);

    let result = null;
    if (answeredCount >= ids.length) {
      result = await finalizeExamSession(client, updatedSession, "completed");
      const available = await availability(userId, subject, client.query.bind(client));
      result = { ...result, ...available };
    }

    return {
      ok: true,
      locked: true,
      question_id: String(question.id),
      selected_answer: chosen,
      correct_answer: correctAnswer || null,
      is_correct: isCorrect,
      explanation: question.explanation,
      source: question.source,
      answered_count: answeredCount,
      correct_count: correctCount,
      completed: Boolean(result),
      result,
    };
  });
}

export async function finishExam(userId, rawSubject, sessionId, reason = "manual") {
  const subject = normalizeSubject(rawSubject);

  return withTransaction(async (client) => {
    const row = await client.query(
      `select *, expires_at <= now() as is_expired
         from exam_sessions
        where id=$1 and user_id=$2 and subject=$3
        limit 1
        for update`,
      [sessionId, userId, subject]
    );

    const session = row.rows[0];
    if (!session) {
      return { error: "Simulado não encontrado.", code: "EXAM_NOT_FOUND", status: 404 };
    }

    const result = await finalizeExamSession(client, session, reason);
    const available = await availability(userId, subject, client.query.bind(client));
    return { ok: true, result: { ...result, ...available } };
  });
}

export async function finalizeExpiredExams() {
  const expired = await query(
    `select id,user_id,subject
       from exam_sessions
      where status='in_progress' and expires_at <= now()
      order by expires_at asc
      limit 100`
  );

  const results = [];
  for (const item of expired.rows) {
    results.push(await finishExam(item.user_id, item.subject, item.id, "timeout"));
  }
  return results;
}
