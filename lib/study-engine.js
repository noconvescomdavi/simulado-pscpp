import { query } from "./db";
import { getQuestion, availableQuestionBanks } from "./question-banks";
import { normalizeSubject, subjectLabel } from "./subjects";

function n(value) {
  return Number(value || 0);
}

function pct(correct, total) {
  return total ? Math.round((correct / total) * 1000) / 10 : 0;
}

export async function getErrorNotebook(userId, limit = 60) {
  const safeLimit = Math.max(1, Math.min(200, Number(limit) || 60));

  const result = await query(
    `SELECT question_id, subject, answer_count, correct_count, error_count, last_answered_at
       FROM question_stats
      WHERE user_id=$1
        AND error_count > 0
      ORDER BY error_count DESC, last_answered_at DESC NULLS LAST
      LIMIT $2`,
    [userId, safeLimit]
  );

  return result.rows.map((row) => {
    const slug = normalizeSubject(row.subject);
    const question = getQuestion(slug, row.question_id);

    return {
      question_id: String(row.question_id),
      subject: slug,
      subject_label: subjectLabel(slug),
      module: question?.module || "Conteúdo geral",
      topic_code: question?.topic_code || "",
      topic: question?.topic || `Questão ${row.question_id}`,
      question: question?.question || "Questão não localizada no banco atual.",
      explanation: question?.explanation || "",
      source: question?.source || null,
      answers: n(row.answer_count),
      correct: n(row.correct_count),
      errors: n(row.error_count),
      accuracy: pct(n(row.correct_count), n(row.answer_count)),
      last_answered_at: row.last_answered_at,
      recovered: n(row.correct_count) > 0 && n(row.error_count) > 0,
    };
  });
}

export async function getTodayStudyPlan(userId) {
  const [stats, goals] = await Promise.all([
    query(
      `SELECT question_id, subject, answer_count, correct_count, error_count, last_answered_at
         FROM question_stats
        WHERE user_id=$1 AND answer_count > 0`,
      [userId]
    ),
    query(
      `SELECT daily_minutes, weekly_questions, target_exam_date
         FROM student_study_goals
        WHERE user_id=$1
        LIMIT 1`,
      [userId]
    ).catch(() => ({ rows: [] })),
  ]);

  const goal = goals.rows[0] || {
    daily_minutes: 60,
    weekly_questions: 100,
    target_exam_date: null,
  };

  const groups = new Map();

  for (const row of stats.rows) {
    const slug = normalizeSubject(row.subject);
    const q = getQuestion(slug, row.question_id);
    const topic = q?.topic || `Questão ${row.question_id}`;
    const topicCode = q?.topic_code || "";
    const key = `${slug}|${topicCode}|${topic}`;

    const current = groups.get(key) || {
      subject: slug,
      subject_label: subjectLabel(slug),
      topic_code: topicCode,
      topic,
      answers: 0,
      correct: 0,
      errors: 0,
      last_answered_at: null,
    };

    current.answers += n(row.answer_count);
    current.correct += n(row.correct_count);
    current.errors += n(row.error_count);

    if (
      !current.last_answered_at ||
      (row.last_answered_at && new Date(row.last_answered_at) > new Date(current.last_answered_at))
    ) {
      current.last_answered_at = row.last_answered_at;
    }

    groups.set(key, current);
  }

  const weak = [...groups.values()]
    .map((item) => ({
      ...item,
      accuracy: pct(item.correct, item.answers),
      priority_score:
        item.errors * 10 +
        Math.max(0, 70 - pct(item.correct, item.answers)) +
        Math.min(item.answers, 20),
    }))
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 5);

  const banks = availableQuestionBanks();
  const totalQuestions = banks.reduce((sum, bank) => sum + n(bank.count), 0);
  const dailyMinutes = n(goal.daily_minutes) || 60;

  const tasks = [];
  const reviewMinutes = Math.max(10, Math.round(dailyMinutes * 0.25));
  const weakMinutes = Math.max(15, Math.round(dailyMinutes * 0.4));
  const questionsMinutes = Math.max(15, dailyMinutes - reviewMinutes - weakMinutes);

  tasks.push({
    type: "review",
    title: "Revisão de erros",
    description: "Comece pelas questões que você mais errou.",
    minutes: reviewMinutes,
    href: "/conteudos/caderno-de-erros",
  });

  if (weak[0]) {
    tasks.push({
      type: "weakness",
      title: weak[0].topic,
      description: `${weak[0].subject_label} · ${weak[0].errors} erros · ${weak[0].accuracy}% de acerto`,
      minutes: weakMinutes,
      href: `/study-content/simulado/${weak[0].subject}/`,
    });
  } else {
    tasks.push({
      type: "content",
      title: "Conteúdo programático",
      description: "Avance no conteúdo de uma disciplina e marque os itens estudados.",
      minutes: weakMinutes,
      href: "/conteudos",
    });
  }

  tasks.push({
    type: "questions",
    title: "Bloco de questões",
    description: "Consolide o estudo com questões aleatórias e correção imediata.",
    minutes: questionsMinutes,
    href: "/conteudos/banco-de-questoes",
  });

  return {
    goal: {
      daily_minutes: dailyMinutes,
      weekly_questions: n(goal.weekly_questions) || 100,
      target_exam_date: goal.target_exam_date || null,
    },
    weak_topics: weak,
    tasks,
    total_question_bank: totalQuestions,
  };
}
