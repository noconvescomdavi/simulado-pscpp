import { getQuestion } from "./question-banks";

const questionMetaCache = new Map();
function getQuestionMeta(subject, questionId) {
  const key = `${subject}|${questionId}`;
  if (questionMetaCache.has(key)) return questionMetaCache.get(key);
  const question = getQuestion(subject, questionId);
  const meta = question ? { module: question.module || "Conteúdo geral", topic_code: question.topic_code || "", topic: question.topic || `Questão ${questionId}` } : { module: "Conteúdo geral", topic_code: "", topic: `Questão ${questionId}` };
  questionMetaCache.set(key, meta);
  return meta;
}
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
          COALESCE(
            AVG(score_percent),
            0
          )::numeric
            AS average_score
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
        average_score_sum: 0,
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

    current.average_score_sum +=
      numeric(row.average_score) *
      numeric(row.attempts);

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

    const meta = getQuestionMeta(slug, row.question_id);\n\n    const module = meta.module;\n    const topicCode = meta.topic_code;\n    const topic = meta.topic;

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
            average_score_sum: 0,
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

          average_score:
            exam.attempts
              ? Math.round((exam.average_score_sum / exam.attempts) * 10) / 10
              : 0,

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

        average_score_sum:
          total.average_score_sum +
          item.average_score_sum,
      }),
      {
        attempts: 0,
        duration_seconds: 0,
        best_score: 0,
        average_score_sum: 0,
      }
    );

  const profile = titleProfile.rows[0] || {};
  const titleScore = calculateTitleScore({
    category: profile.experience_level,
    occupationType: profile.maritime_role,
    embarkationDays: profile.embarkation_days,
    commandDays: profile.command_days,
  });
  const examAverage = overallExams.attempts
    ? Math.round((overallExams.average_score_sum / overallExams.attempts) * 10) / 10
    : 0;

  return {
    overall: {
      ...overallAnswers,
      ...overallExams,

      accuracy:
        percentage(
          overallAnswers.correct,
          overallAnswers.questions
        ),

      exam_average:
        examAverage,

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
