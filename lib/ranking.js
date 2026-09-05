import {query} from "./db";

const MIN_QUESTIONS = 10;

function publicName(fullName, email) {
  const raw = String(fullName || email?.split("@")[0] || "Aluno").trim();
  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] || "Aluno";
  return `${parts[0]} ${parts.at(-1).slice(0, 1).toUpperCase()}.`;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function scoreRow(row) {
  const questions = Number(row.questions || 0);
  const correct = Number(row.correct || 0);
  const accuracy = questions ? (correct / questions) * 100 : 0;
  const volumeIndex = clamp((questions / 1000) * 100);
  const examIndex = clamp((Number(row.exams || 0) / 7) * 100);
  const consistencyIndex = clamp((Number(row.active_days_30 || 0) / 20) * 100);

  const score =
    accuracy * 0.50 +
    volumeIndex * 0.20 +
    examIndex * 0.15 +
    consistencyIndex * 0.15;

  return {
    user_id: String(row.user_id),
    name: publicName(row.full_name, row.email),
    questions,
    correct,
    accuracy: Math.round(accuracy * 10) / 10,
    exams: Number(row.exams || 0),
    active_days_30: Number(row.active_days_30 || 0),
    score: Math.round(score * 10) / 10,
  };
}

export async function getLeaderboard(currentUserId, limit = 50) {
  const result = await query(
    `WITH answers AS (
       SELECT user_id,
              COUNT(*)::int AS questions,
              COUNT(*) FILTER (WHERE is_correct)::int AS correct
         FROM question_answers
        GROUP BY user_id
     ),
     exams AS (
       SELECT user_id, COUNT(*)::int AS exams
         FROM exam_attempts
        GROUP BY user_id
     ),
     activity AS (
       SELECT user_id,
              COUNT(*) FILTER (WHERE study_date >= current_date - interval '29 days')::int AS active_days_30
         FROM study_days
        GROUP BY user_id
     )
     SELECT u.id AS user_id,
            u.email,
            p.full_name,
            COALESCE(a.questions,0)::int AS questions,
            COALESCE(a.correct,0)::int AS correct,
            COALESCE(e.exams,0)::int AS exams,
            COALESCE(d.active_days_30,0)::int AS active_days_30
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id=u.id
       LEFT JOIN answers a ON a.user_id=u.id
       LEFT JOIN exams e ON e.user_id=u.id
       LEFT JOIN activity d ON d.user_id=u.id
      WHERE u.role='student'
        AND u.status='active'
        AND COALESCE(a.questions,0) >= $1`,
    [MIN_QUESTIONS]
  );

  const ranked = result.rows
    .map(scoreRow)
    .sort((a, b) =>
      b.score - a.score ||
      b.accuracy - a.accuracy ||
      b.questions - a.questions ||
      b.exams - a.exams
    )
    .map((row, index) => ({ ...row, position: index + 1 }));

  const current = ranked.find((row) => row.user_id === String(currentUserId)) || null;
  return {
    minimum_questions: MIN_QUESTIONS,
    total_ranked: ranked.length,
    leaders: ranked.slice(0, Math.max(3, Math.min(100, Number(limit) || 50))),
    current,
  };
}
