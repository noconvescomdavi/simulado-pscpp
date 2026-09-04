"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./exam.module.css";

function clock(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  return `${String(Math.floor(safe / 3600)).padStart(2, "0")}:${String(
    Math.floor((safe % 3600) / 60)
  ).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function normalizeOptions(options) {
  if (Array.isArray(options)) {
    return options
      .map((option, index) => {
        const fallbackKey = String.fromCharCode(65 + index);
        if (typeof option === "string") return { key: fallbackKey, text: option };
        if (!option || typeof option !== "object") return null;
        return {
          key: String(option.key ?? option.letter ?? option.label ?? fallbackKey).toUpperCase(),
          text: String(option.text ?? option.value ?? option.label ?? ""),
        };
      })
      .filter((option) => option?.text);
  }

  if (options && typeof options === "object") {
    return Object.entries(options)
      .map(([key, value]) => {
        if (value && typeof value === "object") {
          return {
            key: String(value.key ?? key).toUpperCase(),
            text: String(value.text ?? value.value ?? value.label ?? ""),
          };
        }
        return { key: String(key).toUpperCase(), text: String(value ?? "") };
      })
      .filter((option) => option.text);
  }

  return [];
}

function Result({ result }) {
  const answered = Number(result?.answered || 0);
  const correct = Number(result?.correct || 0);
  const errors = Number(result?.errors || Math.max(0, answered - correct));
  const percent = Number(result?.score_percent || 0);
  const grade = Number(result?.grade_10 ?? percent / 10);

  return (
    <main className={styles.page}>
      <section className={styles.resultCard}>
        <span>SIMULADO FINALIZADO</span>
        <h1>Resultado</h1>
        <div className={styles.resultGrid}>
          <div><small>Nota</small><strong>{grade.toFixed(2)}/10</strong></div>
          <div><small>Aproveitamento</small><strong>{percent.toFixed(2)}%</strong></div>
          <div><small>Acertos</small><strong>{correct}</strong></div>
          <div><small>Erros</small><strong>{errors}</strong></div>
          <div><small>Respondidas</small><strong>{answered}</strong></div>
          <div><small>Questões emitidas</small><strong>{Number(result?.total_questions || 0)}</strong></div>
        </div>
        {result?.reason === "timeout" && (
          <p>O período de 240 minutos terminou. Somente as questões efetivamente respondidas foram contabilizadas.</p>
        )}
        {result?.next_available_at && (
          <p>Próxima emissão: {new Date(result.next_available_at).toLocaleString("pt-BR")}</p>
        )}
        <div className={styles.resultActions}>
          <a href={`/simulado/tentativa/${result?.session_id}`}>Revisar este simulado</a>
          <a href="/simulado">Todos os simulados</a>
          <a href="/area-do-aluno">Área do aluno</a>
        </div>
      </section>
    </main>
  );
}

export default function Client({ subject, title, ready }) {
  const [state, setState] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const questionStartedAt = useRef(Date.now());
  const timeoutHandled = useRef(false);

  async function load() {
    setError("");
    const response = await fetch(`/api/exams/${subject}`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Não foi possível carregar o simulado.");
      return;
    }
    setState(payload);
    if (payload.state === "in_progress" && payload.exam) {
      setIndex(Math.min(Number(payload.exam.answered_count || 0), Math.max(0, payload.exam.questions.length - 1)));
      setAnswer(null);
      setPendingResult(null);
      questionStartedAt.current = Date.now();
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [subject]);

  const exam = state?.exam;
  const remaining = exam
    ? Math.max(0, Math.floor((new Date(exam.expires_at).getTime() - now) / 1000))
    : 0;

  useEffect(() => {
    if (!exam || remaining > 0 || timeoutHandled.current) return;
    timeoutHandled.current = true;
    load().finally(() => {
      timeoutHandled.current = false;
    });
  }, [exam?.id, remaining]);

  useEffect(() => {
    questionStartedAt.current = Date.now();
  }, [exam?.id, index]);

  async function start() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/exams/${subject}`, { method: "POST" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (payload.code === "TRIAL_LIMIT" || payload.trial_exhausted) {
          location.href = "/teste-gratis-excedido?recurso=simulado";
          return;
        }
        setError(payload.error || "Não foi possível iniciar o simulado.");
        if (payload.next_available_at) {
          setState({ state: "available", ...payload, can_start: false });
        }
        return;
      }
      setState(payload);
      setIndex(Number(payload.exam?.answered_count || 0));
      setAnswer(null);
      setPendingResult(null);
      questionStartedAt.current = Date.now();
    } finally {
      setBusy(false);
    }
  }

  async function choose(selectedAnswer) {
    if (!exam || answer || busy) return;
    const question = exam.questions[index];
    if (!question) return;

    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/exams/${subject}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: exam.id,
          question_id: question.id,
          selected_answer: selectedAnswer,
          response_time_ms: Date.now() - questionStartedAt.current,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload.result) {
          setState({ state: "finished", result: payload.result });
          return;
        }
        setError(payload.error || "Não foi possível salvar a resposta.");
        return;
      }

      setAnswer(payload);
      if (payload.result) setPendingResult(payload.result);
    } finally {
      setBusy(false);
    }
  }

  async function finish(reason = "manual") {
    if (!exam || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/exams/${subject}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: exam.id, reason }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Não foi possível finalizar o simulado.");
        return;
      }
      setState({ state: "finished", result: payload.result || payload });
      setAnswer(null);
      setPendingResult(null);
    } finally {
      setBusy(false);
    }
  }

  function next() {
    if (pendingResult) {
      setState({ state: "finished", result: pendingResult });
      setAnswer(null);
      setPendingResult(null);
      return;
    }

    setAnswer(null);
    setIndex((current) => Math.min(current + 1, Math.max(0, (exam?.questions?.length || 1) - 1)));
  }

  if (!ready) {
    return <main className={styles.page}><h1>{title}</h1><p>Banco aguardando upload.</p></main>;
  }

  if (!state) {
    return <main className={styles.page}><p>Carregando…</p>{error && <p>{error}</p>}</main>;
  }

  if (state.state === "available") {
    return (
      <main className={styles.page}>
        <span>SIMULADO</span>
        <h1>{title}</h1>
        <p>Até 100 questões aleatórias. Duração máxima de 240 minutos, com início e expiração registrados no PostgreSQL.</p>
        <p>Cada resposta é salva no servidor e não pode ser alterada depois do salvamento.</p>
        <button type="button" onClick={start} disabled={busy || state.can_start === false}>Iniciar simulado</button>
        {state.can_start === false && state.next_available_at && (
          <p>Nova emissão disponível em {new Date(state.next_available_at).toLocaleString("pt-BR")}.</p>
        )}
        {error && <p role="alert">{error}</p>}
      </main>
    );
  }

  if (state.state === "finished" && !exam) {
    return <Result result={state.result} />;
  }

  const question = exam?.questions?.[index];
  if (!question) {
    return <main className={styles.page}><h1>{title}</h1><p>Não foi possível localizar a próxima questão.</p><button onClick={load}>Recarregar simulado</button></main>;
  }

  const options = normalizeOptions(question.options);

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <div>
          <span>SIMULADO EM ANDAMENTO</span>
          <h1>{title} · {index + 1}/{exam.questions.length}</h1>
          <small>{Number(exam.answered_count || 0)} respostas já estavam salvas quando esta sessão foi carregada.</small>
        </div>
        <b>{clock(remaining)}</b>
      </div>

      <article>
        <h2>{question.question}</h2>
        {options.map((option) => (
          <button
            type="button"
            disabled={Boolean(answer) || busy || remaining === 0}
            key={option.key}
            onClick={() => choose(option.key)}
          >
            <b>{option.key}</b> {option.text}
          </button>
        ))}

        {busy && !answer && <p>Salvando...</p>}

        {answer && (
          <div className={styles.feedback}>
            <p><strong>{answer.is_correct ? "Correto." : "Resposta incorreta."}</strong></p>
            <p>Sua resposta: <strong>{answer.selected_answer}</strong></p>
            {!answer.is_correct && answer.correct_answer && (
              <p>Resposta correta: <strong>{answer.correct_answer}</strong></p>
            )}
            {answer.explanation && <p>{answer.explanation}</p>}
            <p>Resposta salva definitivamente.</p>
            <button type="button" onClick={next}>
              {pendingResult ? "Ver resultado →" : "Próxima →"}
            </button>
          </div>
        )}
      </article>

      <button type="button" className={styles.finish} onClick={() => finish("manual")} disabled={busy}>
        Finalizar simulado agora
      </button>
      {error && <p role="alert">{error}</p>}
    </main>
  );
}
