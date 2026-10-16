import { getQuestion } from "./question-banks";
import { query } from "./db";
import { calculateTitleScore } from "./title-score";
import {
  normalizeSubject,
  SUBJECTS,
} from "./subjects";

function numeric(value) {
  return Number(value || 0);
}

function percentage(
  correct,
  total
) {
  return total
    ? Math.round(
        (correct / total) *
          1000
      ) / 10
    : 0;
}

function rankWeakness(items) {
  return [...items]
    .filter(
      (item) =>
        item.answers > 0 &&
        item.errors > 0
    )
    .map((item) => ({
      ...item,
      error_rate:
        percentage(
          item.errors,
          item.answers
        ),
    }))
    .sort(
      (a, b) =>
        b.errors - a.errors ||
        b.error_rate -
          a.error_rate ||
        b.answers - a.answers
    );
}

export async function getUserMetrics(
  userId
) {
  const [
    attemptRows,
    questionRows,
    titleProfile,
    notebookSummary,
  ] = await Promise.all([
    query(
      `
        SELECT
          subject,
          COUNT(*)::int
            AS attempts,
          COALESCE(
            SUM(duration_seconds),
            0
          )::int
            AS duration_seconds,
          COALESCE(
            MAX(score_percent),
            0
          )::numeric
            AS best_score,
          COALESCE(SUM(correct_answers),0)::int AS exam_correct,
          COALESCE(SUM(wrong_answers),0)::int AS exam_wrong
        FROM exam_attempts
        WHERE user_id = $1
        GROUP BY subject
      `,
      [userId]
    ),

    query(
      `
        SELECT
          question_id,
          subject,
          answer_count,
          correct_count,
          error_count
        FROM question_stats
        WHERE user_id = $1
          AND answer_count > 0
      `,
      [userId]
    ),
    query(
      `SELECT maritime_role, experience_level, embarkation_days, command_days
       FROM user_profiles WHERE user_id = $1 LIMIT 1`,
      [userId]
    ).catch(() => ({ rows: [] })),
    query(`
      SELECT COUNT(*)::int AS answered,
             COUNT(*) FILTER (WHERE is_correct IS TRUE)::int AS correct,
             COUNT(*) FILTER (WHERE is_correct IS FALSE)::int AS wrong,
             COUNT(DISTINCT notebook_id)::int AS notebooks
      FROM question_notebook_answers
      WHERE user_id = $1
    `, [userId]),
  ]);

  /*
   * Simulados:
   * somente quantidade de provas,
   * melhor nota e duração.
   */
  const attemptsBySubject =
    new Map();

  for (
    const row of
    attemptRows.rows
  ) {
    const slug =
      normalizeSubject(
        row.subject
      );

    const current =
      attemptsBySubject.get(
        slug
      ) || {
        attempts: 0,
        duration_seconds: 0,
        best_score: 0,
        exam_correct: 0,
        exam_wrong: 0,
      };

    current.attempts +=
      numeric(row.attempts);

    current.duration_seconds +=
      numeric(
        row.duration_seconds
      );

    current.best_score =
      Math.max(
        current.best_score,
        numeric(
          row.best_score
        )
      );

    current.exam_correct += numeric(row.exam_correct);
    current.exam_wrong += numeric(row.exam_wrong);

    attemptsBySubject.set(
      slug,
      current
    );
  }

  /*
   * Todas as questões:
   *
   * - Banco de questões
   * - Cadernos
   * - Simulados
   *
   * entram aqui.
   */
  const answersBySubject =
    new Map();

  const weaknessGroups =
    new Map();

  for (
    const row of
    questionRows.rows
  ) {
    const slug =
      normalizeSubject(
        row.subject
      );

    const subjectTotals =
      answersBySubject.get(
        slug
      ) || {
        questions: 0,
        correct: 0,
        errors: 0,
      };

    subjectTotals.questions +=
      numeric(
        row.answer_count
      );

    subjectTotals.correct +=
      numeric(
        row.correct_count
      );

    subjectTotals.errors +=
      numeric(
        row.error_count
      );

    answersBySubject.set(
      slug,
      subjectTotals
    );

    const question =
      getQuestion(
        slug,
        row.question_id
      );

    const module =
      question?.module ||
      "Conteúdo geral";

    const topicCode =
      question?.topic_code ||
      "";

    const topic =
      question?.topic ||
      `Questão ${row.question_id}`;

    const key =
      `${slug}|${module}|${topicCode}|${topic}`;

    const group =
      weaknessGroups.get(
        key
      ) || {
        subject: slug,
        module,
        topic_code:
          topicCode,
        topic,
        answers: 0,
        correct: 0,
        errors: 0,
      };

    group.answers +=
      numeric(
        row.answer_count
      );

    group.correct +=
      numeric(
        row.correct_count
      );

    group.errors +=
      numeric(
        row.error_count
      );

    weaknessGroups.set(
      key,
      group
    );
  }

  const rankedWeakness =
    rankWeakness(
      weaknessGroups.values()
    );

  const subjects =
    SUBJECTS.map(
      (subject) => {
        const exam =
          attemptsBySubject.get(
            subject.slug
          ) || {
            attempts: 0,
            duration_seconds: 0,
            best_score: 0,
            exam_correct: 0,
            exam_wrong: 0,
          };

        const answers =
          answersBySubject.get(
            subject.slug
          ) || {
            questions: 0,
            correct: 0,
            errors: 0,
          };

        return {
          ...subject,

          attempts:
            exam.attempts,

          duration_seconds:
            exam.duration_seconds,

          best_score:
            exam.best_score,

          average_score: percentage(exam.exam_correct,exam.exam_correct+exam.exam_wrong),
          exam_correct: exam.exam_correct,
          exam_wrong: exam.exam_wrong,
          exam_answered: exam.exam_correct+exam.exam_wrong,

          questions:
            answers.questions,

          correct:
            answers.correct,

          errors:
            answers.errors,

          accuracy:
            percentage(
              answers.correct,
              answers.questions
            ),

          needs_study:
            rankedWeakness
              .filter(
                (item) =>
                  item.subject ===
                  subject.slug
              )
              .slice(0, 3),
        };
      }
    );

  const overallAnswers =
    [
      ...answersBySubject.values(),
    ].reduce(
      (total, item) => ({
        questions:
          total.questions +
          item.questions,

        correct:
          total.correct +
          item.correct,

        errors:
          total.errors +
          item.errors,
      }),
      {
        questions: 0,
        correct: 0,
        errors: 0,
      }
    );

  const overallExams =
    [
      ...attemptsBySubject.values(),
    ].reduce(
      (total, item) => ({
        attempts:
          total.attempts +
          item.attempts,

        duration_seconds:
          total.duration_seconds +
          item.duration_seconds,

        best_score:
          Math.max(
            total.best_score,
            item.best_score
          ),

        exam_correct: total.exam_correct+item.exam_correct,
        exam_wrong: total.exam_wrong+item.exam_wrong,
      }),
      {
        attempts: 0,
        duration_seconds: 0,
        best_score: 0,
        exam_correct: 0,
        exam_wrong: 0,
      }
    );

  const profile = titleProfile.rows[0] || {};
  const titleScore = calculateTitleScore({
    category: profile.experience_level,
    occupationType: profile.maritime_role,
    embarkationDays: profile.embarkation_days,
    commandDays: profile.command_days,
  });
  const examAverage = percentage(overallExams.exam_correct,overallExams.exam_correct+overallExams.exam_wrong);

  return {
    overall: {
      ...overallAnswers,
      ...overallExams,

      accuracy:
        percentage(
          overallAnswers.correct,
          overallAnswers.questions
        ),

      exam_average: examAverage,
      exam_answered: overallExams.exam_correct+overallExams.exam_wrong,
      notebook_answered: numeric(notebookSummary.rows[0]?.answered),
      notebook_correct: numeric(notebookSummary.rows[0]?.correct),
      notebook_wrong: numeric(notebookSummary.rows[0]?.wrong),
      notebook_count: numeric(notebookSummary.rows[0]?.notebooks),
      notebook_average: percentage(numeric(notebookSummary.rows[0]?.correct), numeric(notebookSummary.rows[0]?.answered)),

      title_score:
        titleScore.total,

      title_score_breakdown:
        titleScore,

      needs_study:
        rankedWeakness.slice(
          0,
          5
        ),
    },

    subjects,
  };
}
