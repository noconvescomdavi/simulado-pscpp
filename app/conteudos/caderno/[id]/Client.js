"use client";

import { useState } from "react";
import styles from "./caderno.module.css";

function questionKey(question) {
  return `${question.subject}:${question.id}`;
}

function normalizeOptions(options) {
  if (Array.isArray(options)) {
    return options
      .map((option, index) => {
        const fallbackKey =
          String.fromCharCode(65 + index);

        if (typeof option === "string") {
          return {
            key: fallbackKey,
            text: option,
          };
        }

        if (
          option &&
          typeof option === "object"
        ) {
          return {
            key: String(
              option.key ??
                option.letter ??
                option.label ??
                fallbackKey
            ),
            text: String(
              option.text ??
                option.value ??
                option.label ??
                ""
            ),
          };
        }

        return null;
      })
      .filter(
        (option) =>
          option && option.text
      );
  }

  if (
    options &&
    typeof options === "object"
  ) {
    return Object.entries(options)
      .map(([key, value]) => ({
        key: String(
          value?.key ?? key
        ),
        text: String(
          value?.text ??
            value?.value ??
            value?.label ??
            value ??
            ""
        ),
      }))
      .filter(
        (option) => option.text
      );
  }

  return [];
}

function initialAnswers(notebook) {
  const result = {};

  for (
    const question of
    notebook?.questions ?? []
  ) {
    if (!question?.answer) continue;

    result[questionKey(question)] = {
      selected_answer:
        question.answer
          .selected_answer,
      is_correct:
        Boolean(
          question.answer.is_correct
        ),
      correct_answer:
        question.answer
          .correct_answer ??
        null,
      explanation:
        question.answer
          .explanation ??
        null,
    };
  }

  return result;
}

function Result({
  result,
  onReview,
}) {
  return (
    <main className={styles.page}>
      <section>
        <p>Caderno concluído</p>

        <h1>Resultado</h1>

        <div>
          <p>NOTA</p>
          <strong>
            {Number(
              result.grade_10 || 0
            ).toFixed(2)}
            /10
          </strong>
        </div>

        <div>
          <p>Aproveitamento</p>
          <strong>
            {Number(
              result.score_percent ||
                0
            ).toFixed(2)}
            %
          </strong>
        </div>

        <div>
          <p>
            Acertos:{" "}
            <strong>
              {result.correct_count}
            </strong>
          </p>

          <p>
            Erros:{" "}
            <strong>
              {result.error_count}
            </strong>
          </p>

          <p>
            Total:{" "}
            <strong>
              {
                result.total_questions
              }
            </strong>
          </p>
        </div>

        <p>
          O desempenho deste caderno
          foi contabilizado nas suas
          métricas de estudo.
        </p>

        <button
          type="button"
          onClick={onReview}
        >
          Revisar respostas
        </button>
      </section>
    </main>
  );
}

export default function Client({
  notebook,
}) {
  const questions =
    Array.isArray(
      notebook?.questions
    )
      ? notebook.questions
      : [];

  const [index, setIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState(() =>
      initialAnswers(notebook)
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(
      notebook?.result?.completed
        ? notebook.result
        : null
    );

  const [reviewing, setReviewing] =
    useState(false);

  if (
    result?.completed &&
    !reviewing
  ) {
    return (
      <Result
        result={result}
        onReview={() =>
          setReviewing(true)
        }
      />
    );
  }

  const question =
    questions[index];

  if (!question) {
    return (
      <main className={styles.page}>
        <h1>Caderno vazio</h1>
        <p>
          Não existem questões
          disponíveis neste caderno.
        </p>
      </main>
    );
  }

  const key =
    questionKey(question);

  const options =
    normalizeOptions(
      question.options
    );

  const answer =
    answers[key];

  async function choose(
    selectedAnswer
  ) {
    if (answer || saving) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/question-notebooks/${notebook.id}/answer`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              subject:
                question.subject,
              question_id:
                question.id,
              selected_answer:
                selectedAnswer,
            }),
          }
        );

      const payload =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        if (
          payload.locked &&
          payload.answer
        ) {
          setAnswers(
            (current) => ({
              ...current,
              [key]:
                payload.answer,
            })
          );
        }

        setError(
          payload.error ||
            "Não foi possível salvar a resposta."
        );

        return;
      }

      const savedAnswer = {
        selected_answer:
          payload.selected_answer,
        is_correct:
          payload.is_correct,
        correct_answer:
          payload.correct_answer,
        explanation:
          payload.explanation,
      };

      setAnswers(
        (current) => ({
          ...current,
          [key]: savedAnswer,
        })
      );

      if (
        payload.result?.completed
      ) {
        setResult(
          payload.result
        );

        setReviewing(false);
      }
    } catch {
      setError(
        "Falha de comunicação ao salvar a resposta."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1>
        {notebook.title}
      </h1>

      <p>
        Questão {index + 1} de{" "}
        {questions.length}
      </p>

      <article>
        <h2>
          {question.question}
        </h2>

        {options.map(
          (option) => (
            <button
              key={option.key}
              type="button"
              disabled={
                Boolean(answer) ||
                saving
              }
              onClick={() =>
                choose(option.key)
              }
            >
              <b>
                {option.key}
              </b>{" "}
              {option.text}
            </button>
          )
        )}

        {saving && (
          <p>
            Salvando resposta...
          </p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {answer && (
          <div>
            <p>
              Sua resposta:{" "}
              <strong>
                {
                  answer.selected_answer
                }
              </strong>
            </p>

            <p>
              <strong>
                {answer.is_correct
                  ? "Correto."
                  : "Resposta incorreta."}
              </strong>
            </p>

            {!answer.is_correct &&
              answer.correct_answer && (
                <p>
                  Resposta correta:{" "}
                  <strong>
                    {
                      answer.correct_answer
                    }
                  </strong>
                </p>
              )}

            {answer.explanation && (
              <p>
                {
                  answer.explanation
                }
              </p>
            )}

            <p>
              Resposta salva
              definitivamente.
            </p>
          </div>
        )}

        <nav>
          <button
            type="button"
            disabled={
              index === 0
            }
            onClick={() =>
              setIndex(
                (current) =>
                  Math.max(
                    0,
                    current - 1
                  )
              )
            }
          >
            ← Anterior
          </button>

          <button
            type="button"
            disabled={
              index >=
              questions.length - 1
            }
            onClick={() =>
              setIndex(
                (current) =>
                  Math.min(
                    questions.length -
                      1,
                    current + 1
                  )
              )
            }
          >
            Próxima →
          </button>

          {result?.completed &&
            reviewing && (
              <button
                type="button"
                onClick={() =>
                  setReviewing(
                    false
                  )
                }
              >
                Ver resultado
              </button>
            )}
        </nav>
      </article>
    </main>
  );
}
