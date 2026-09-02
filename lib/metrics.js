import { getQuestion } from "./question-banks";
import { query } from "./db";
import { normalizeSubject, SUBJECTS } from "./subjects";

function numeric(value) {
  return Number(value || 0);
}

function percentage(correct, total) {
  return total ? Math.round((correct / total) * 1000) / 10 : 0;
}

function rankWeakness(items) {
  return [...items]
    .filter((item) => item.answers > 0 && item.errors > 0)
    .map((item) => ({
      ...item,
      error_rate: percentage(item.errors, item.answers),
    }))
    .sort((a, b) => b.errors - a.errors || b.error_rate - a.error_rate || b.answers - a.answers);
}

export async function getUserMetrics(userId) {
  const [attemptRows, questionRows] = await Promise.all([
    query(
      `select subject,
              count(*)::int as attempts,
              coalesce(sum(total_questions),0)::int as questions,
              coalesce(sum(correct_answers),0)::int as correct,
              coalesce(sum(wrong_answers),0)::int as errors,
              coalesce(sum(duration_seconds),0)::int as duration_seconds,
              coalesce(max(score_percent),0)::numeric as best_score
       from exam_attempts
       where user_id=$1
       group by subject`,
      [userId]
    ),
    query(
      `select question_id,subject,answer_count,correct_count,error_count
       from question_stats
       where user_id=$1 and answer_count>0`,
      [userId]
    ),
  ]);

  const attemptsBySubject = new Map();
  for (const row of attemptRows.rows) {
    const slug = normalizeSubject(row.subject);
    const current = attemptsBySubject.get(slug) || {
      attempts: 0,
      questions: 0,
      correct: 0,
      errors: 0,
      duration_seconds: 0,
      best_score: 0,
    };
    current.attempts += numeric(row.attempts);
    current.questions += numeric(row.questions);
    current.correct += numeric(row.correct);
    current.errors += numeric(row.errors);
    current.duration_seconds += numeric(row.duration_seconds);
    current.best_score = Math.max(current.best_score, numeric(row.best_score));
    attemptsBySubject.set(slug, current);
  }

  const weaknessGroups = new Map();
  for (const row of questionRows.rows) {
    const slug = normalizeSubject(row.subject);
    const question = getQuestion(slug, row.question_id);
    const module = question?.module || "Conteúdo geral";
    const topicCode = question?.topic_code || "";
    const topic = question?.topic || `Questão ${row.question_id}`;
    const key = `${slug}|${module}|${topicCode}|${topic}`;
    const group = weaknessGroups.get(key) || {
      subject: slug,
      module,
      topic_code: topicCode,
      topic,
      answers: 0,
      correct: 0,
      errors: 0,
    };
    group.answers += numeric(row.answer_count);
    group.correct += numeric(row.correct_count);
    group.errors += numeric(row.error_count);
    weaknessGroups.set(key, group);
  }

  const rankedWeakness = rankWeakness(weaknessGroups.values());
  const subjects = SUBJECTS.map((subject) => {
    const result = attemptsBySubject.get(subject.slug) || {
      attempts: 0,
      questions: 0,
      correct: 0,
      errors: 0,
      duration_seconds: 0,
      best_score: 0,
    };
    return {
      ...subject,
      ...result,
      accuracy: percentage(result.correct, result.questions),
      needs_study: rankedWeakness.filter((item) => item.subject === subject.slug).slice(0, 3),
    };
  });

  const overall = [...attemptsBySubject.values()].reduce(
    (total, result) => ({
      attempts: total.attempts + result.attempts,
      questions: total.questions + result.questions,
      correct: total.correct + result.correct,
      errors: total.errors + result.errors,
      duration_seconds: total.duration_seconds + result.duration_seconds,
      best_score: Math.max(total.best_score, result.best_score),
    }),
    { attempts: 0, questions: 0, correct: 0, errors: 0, duration_seconds: 0, best_score: 0 }
  );

  return {
    overall: {
      ...overall,
      accuracy: percentage(overall.correct, overall.questions),
      needs_study: rankedWeakness.slice(0, 5),
    },
    subjects,
  };
}
