"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./caderno.module.css";
import {cacheServerNotebook, answerOfflineNotebook} from "../../../../lib/offline-store";

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
      source:
        question.answer
          .source ??
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
  planTask,
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

  const planMarkedRef = useRef(false);

  useEffect(()=>{cacheServerNotebook(notebook).catch(()=>{})},[notebook]);

  useEffect(() => {
    if (!result?.completed || planMarkedRef.current) return;
    if (!planTask?.plan_date || !planTask?.task_key) return;
    planMarkedRef.current = true;
    fetch("/api/study-plan/task", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        kind:"task",
        plan_date:planTask.plan_date,
        task_key:planTask.task_key,
        task_type:planTask.task_type||"questions",
        subject_slug:planTask.subject_slug||null,
        status:"done",
        metadata:{source:"automatic_notebook_completion",notebook_id:notebook.id}
      })
    }).then(async response=>{
      if(response.ok)return;
      const payload=await response.json().catch(()=>({}));
      throw new Error(payload.error||"Não foi possível atualizar a tarefa do plano.");
    }).catch(error=>{
      console.error("Falha ao sincronizar conclusão do caderno com o plano:",error);
    });
  }, [result?.completed, planTask, notebook.id]);

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
      if(!navigator.onLine){
        const payload=await answerOfflineNotebook(notebook.id,{
          subject:question.subject,question_id:question.id,selected_answer:selectedAnswer,
          plan_task:planTask?.plan_date&&planTask?.task_key?{
            plan_date:planTask.plan_date,task_key:planTask.task_key,task_type:planTask.task_type||"questions",subject_slug:planTask.subject_slug||question.subject
          }:null
        });
        const savedAnswer={selected_answer:payload.selected_answer,is_correct:payload.is_correct,correct_answer:payload.correct_answer,explanation:payload.explanation,source:payload.source};
        setAnswers(current=>({...current,[key]:savedAnswer}));
        if(payload.result?.completed){setResult(payload.result);setReviewing(false)}
        return;
      }
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
              plan_task:
                planTask?.plan_date &&
                planTask?.task_key
                  ? {
                      plan_date:
                        planTask.plan_date,
                      task_key:
                        planTask.task_key,
                      task_type:
                        planTask.task_type ||
                        "questions",
                      subject_slug:
                        planTask.subject_slug ||
                        question.subject,
                    }
                  : null,
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
        source:
          payload.source,
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
    } catch (networkError) {
      if(!navigator.onLine || networkError instanceof TypeError){
        try{
          const payload=await answerOfflineNotebook(notebook.id,{subject:question.subject,question_id:question.id,selected_answer:selectedAnswer,plan_task:planTask});
          const savedAnswer={selected_answer:payload.selected_answer,is_correct:payload.is_correct,correct_answer:payload.correct_answer,explanation:payload.explanation,source:payload.source};
          setAnswers(current=>({...current,[key]:savedAnswer}));
          if(payload.result?.completed){setResult(payload.result);setReviewing(false)}
          return;
        }catch(error){setError(error.message||"O caderno não está preparado para uso offline.");return}
      }
      setError("Falha de comunicação ao salvar a resposta.");
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
        <p className={styles.trace}>
          {[
            question.tracking?.work?.title,
            question.tracking?.chapter?.label,
            question.tracking?.module,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
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

            {answer.source?.title && (
              <p className={styles.source}>
                Fonte: {answer.source.title}
                {answer.source.locator
                  ? ` · ${answer.source.locator}`
                  : ""}
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
