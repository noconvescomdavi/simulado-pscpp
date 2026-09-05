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
  const [stats, goals, completions] = await Promise.all([
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
    query(
      `SELECT task_key,completed,completed_at
         FROM student_daily_plan_items
        WHERE user_id=$1
          AND plan_date=(now() at time zone 'America/Sao_Paulo')::date`,
      [userId]
    ).catch(() => ({ rows: [] })),
  ]);

  const goal = goals.rows[0] || {
    daily_minutes: 60,
    weekly_questions: 100,
    target_exam_date: null,
  };

  const completionMap = new Map(
    completions.rows.map((row) => [String(row.task_key), row])
  );

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
  const weeklyQuestions = n(goal.weekly_questions) || 100;

  const reviewMinutes = Math.max(10, Math.round(dailyMinutes * 0.2));
  const focusedMinutes = Math.max(15, Math.round(dailyMinutes * 0.35));
  const flashcardMinutes = Math.max(10, Math.round(dailyMinutes * 0.2));
  const questionMinutes = Math.max(
    15,
    dailyMinutes - reviewMinutes - focusedMinutes - flashcardMinutes
  );
  const dailyQuestionTarget = Math.max(10, Math.ceil(weeklyQuestions / 7));

  const rawTasks = [
    {
      key: "review-errors",
      type: "review",
      title: "Revisão de erros",
      description: "Revise primeiro as questões que mais derrubam seu desempenho.",
      minutes: reviewMinutes,
      target_label: "Caderno de erros",
      href: "/conteudos/caderno-de-erros",
    },
    weak[0]
      ? {
          key: `focus-${weak[0].subject}`,
          type: "weakness",
          title: `Foco: ${weak[0].subject_label}`,
          description: `${weak[0].topic} · ${weak[0].errors} erros · ${weak[0].accuracy}% de acerto`,
          minutes: focusedMinutes,
          target_label: "Revisão direcionada",
          href: `/study-content/simulado/${weak[0].subject}/`,
        }
      : {
          key: "focus-content",
          type: "content",
          title: "Avançar no conteúdo",
          description: "Escolha uma disciplina e avance no conteúdo programático.",
          minutes: focusedMinutes,
          target_label: "Conteúdo",
          href: "/conteudos",
        },
    {
      key: "flashcards",
      type: "flashcards",
      title: "Revisão com flashcards",
      description: "Faça uma rodada curta de recuperação ativa antes das questões.",
      minutes: flashcardMinutes,
      target_label: "Flashcards",
      href: "/flashcards",
    },
    {
      key: "questions",
      type: "questions",
      title: `Resolver ${dailyQuestionTarget} questões`,
      description: weak[0]
        ? `Priorize ${weak[0].subject_label} e depois complete o restante com questões variadas.`
        : "Consolide o estudo com um bloco de questões e correção imediata.",
      minutes: questionMinutes,
      target_label: `${dailyQuestionTarget} questões`,
      href: weak[0]
        ? `/conteudos/banco-de-questoes?subject=${encodeURIComponent(weak[0].subject)}`
        : "/conteudos/banco-de-questoes",
    },
  ];

  const tasks = rawTasks.map((task) => {
    const saved = completionMap.get(task.key);
    return {
      ...task,
      completed: saved?.completed === true,
      completed_at: saved?.completed_at || null,
    };
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const completionPercent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return {
    date: new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()),
    goal: {
      daily_minutes: dailyMinutes,
      weekly_questions: weeklyQuestions,
      target_exam_date: goal.target_exam_date || null,
      daily_question_target: dailyQuestionTarget,
    },
    weak_topics: weak,
    tasks,
    progress: {
      completed: completedCount,
      total: tasks.length,
      percent: completionPercent,
    },
    total_question_bank: totalQuestions,
  };
}

export async function setTodayStudyPlanTask(userId, taskKey, completed) {
  const safeTaskKey = String(taskKey || "").trim().slice(0, 160);
  const allowed = new Set([
    "review-errors",
    "focus-content",
    "flashcards",
    "questions",
  ]);

  if (safeTaskKey.startsWith("focus-")) allowed.add(safeTaskKey);
  if (!allowed.has(safeTaskKey)) {
    const error = new Error("Tarefa inválida.");
    error.status = 400;
    throw error;
  }

  const result = await query(
    `INSERT INTO student_daily_plan_items(
       user_id,plan_date,task_key,completed,completed_at,updated_at
     )
     VALUES(
       $1,
       (now() at time zone 'America/Sao_Paulo')::date,
       $2,
       $3,
       CASE WHEN $3 THEN now() ELSE NULL END,
       now()
     )
     ON CONFLICT(user_id,plan_date,task_key)
     DO UPDATE SET
       completed=excluded.completed,
       completed_at=CASE WHEN excluded.completed THEN now() ELSE NULL END,
       updated_at=now()
     RETURNING task_key,completed,completed_at`,
    [userId, safeTaskKey, completed === true]
  );

  return result.rows[0];
}
