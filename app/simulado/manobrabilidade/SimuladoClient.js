"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./simulado.module.css";

const SUBJECT = "manobrabilidade";
const EXAM_SIZE = 100;
const EXAM_DURATION_MS = 3 * 60 * 60 * 1000;
const STORAGE_KEY = "estibordo:simulado:manobrabilidade:v3";

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function formatTime(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = Math.floor(safe % 60);
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function sourceText(source = {}) {
  return [source.author, source.title, source.edition, source.locator]
    .filter(Boolean)
    .join(". ");
}

function storedExam(snapshot) {
  return {
    version: 3,
    ids: snapshot.questions.map((question) => question.id),
    index: snapshot.index,
    correct: snapshot.correct,
    answered: snapshot.answered,
    startedAt: snapshot.startedAt,
    expiresAt: snapshot.expiresAt,
    questionStartedAt: snapshot.questionStartedAt,
    selected: snapshot.selected,
    correction: snapshot.correction,
  };
}

function persistExam(snapshot) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedExam(snapshot)));
}

function clearStoredExam() {
  localStorage.removeItem(STORAGE_KEY);
}

function createExam(bank) {
  const now = Date.now();
  return {
    questions: shuffle(bank).slice(0, Math.min(EXAM_SIZE, bank.length)),
    index: 0,
    correct: 0,
    answered: 0,
    startedAt: now,
    expiresAt: now + EXAM_DURATION_MS,
    questionStartedAt: now,
    selected: null,
    correction: null,
  };
}

function restoreExam(bank) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || saved.version !== 3 || !Array.isArray(saved.ids) || !saved.ids.length) return null;
    const byId = new Map(bank.map((question) => [question.id, question]));
    const questions = saved.ids.map((id) => byId.get(id)).filter(Boolean);
    if (questions.length !== saved.ids.length) return null;
    return {
      questions,
      index: Math.max(0, Math.min(Number(saved.index) || 0, questions.length - 1)),
      correct: Math.max(0, Number(saved.correct) || 0),
      answered: Math.max(0, Number(saved.answered) || 0),
      startedAt: Number(saved.startedAt) || Date.now(),
      expiresAt: Number(saved.expiresAt) || Date.now(),
      questionStartedAt: Number(saved.questionStartedAt) || Date.now(),
      selected: saved.selected || null,
      correction: saved.correction || null,
    };
  } catch {
    return null;
  }
}

async function registerAttempt(snapshot) {
  if (!snapshot.answered) return { ok: true };
  const durationSeconds = Math.max(
    1,
    Math.min(3 * 60 * 60, Math.round((Date.now() - snapshot.startedAt) / 1000))
  );
  const response = await fetch("/api/attempts", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      module: "Simulado de Manobrabilidade — 100 questões",
      subject: SUBJECT,
      correct_answers: snapshot.correct,
      wrong_answers: snapshot.answered - snapshot.correct,
      total_questions: snapshot.answered,
      duration_seconds: durationSeconds,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Não foi possível registrar o resumo da prova.");
  return payload;
}

export default function SimuladoClient({ userEmail }) {
  const [theme, setTheme] = useState("light");
  const [phase, setPhase] = useState("loading");
  const [exam, setExam] = useState(null);
  const [remaining, setRemaining] = useState(EXAM_DURATION_MS / 1000);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const finishing = useRef(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("pscpp:theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  useEffect(() => {
    let alive = true;
    async function boot() {
      try {
        const response = await fetch(`/api/questions/${SUBJECT}`, {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (response.status === 401) {
          location.href = `/login?next=${encodeURIComponent(location.pathname)}`;
          return;
        }
        if (response.status === 403) {
          location.href = "/comprar?locked=1";
          return;
        }
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Não foi possível carregar as questões.");
        if (!Array.isArray(payload.questions) || !payload.questions.length) {
          throw new Error("O banco de questões está vazio.");
        }
        if (!alive) return;

        const wantsNewExam = new URLSearchParams(location.search).get("novo") === "1";
        if (wantsNewExam) {
          clearStoredExam();
          history.replaceState(null, "", location.pathname);
        }
        let nextExam = wantsNewExam ? null : restoreExam(payload.questions);
        if (nextExam && nextExam.expiresAt <= Date.now()) {
          if (nextExam.answered) {
            let message = "O limite de 3 horas foi atingido. Foram contabilizadas apenas as respostas salvas.";
            try {
              await registerAttempt(nextExam);
            } catch (attemptError) {
              message += ` ${attemptError.message}`;
            }
            if (!alive) return;
            setResult({
              correct: nextExam.correct,
              answered: nextExam.answered,
              reason: "timeout",
              message,
            });
            clearStoredExam();
            setPhase("result");
            return;
          }
          clearStoredExam();
          nextExam = null;
        }

        nextExam ||= createExam(payload.questions);
        persistExam(nextExam);
        setExam(nextExam);
        setRemaining(Math.max(0, Math.ceil((nextExam.expiresAt - Date.now()) / 1000)));
        setPhase("exam");
      } catch (bootError) {
        if (!alive) return;
        setError(bootError.message || "Erro ao preparar o simulado.");
        setPhase("error");
      }
    }
    boot();
    return () => {
      alive = false;
    };
  }, []);

  async function finishExam(reason = "completed", snapshot = exam) {
    if (!snapshot || finishing.current) return;
    if (reason === "manual") {
      const confirmed = window.confirm(
        `Encerrar agora? ${snapshot.answered} de ${snapshot.questions.length} questões respondidas serão contabilizadas.`
      );
      if (!confirmed) return;
    }
    finishing.current = true;
    setSaving(true);
    let message = reason === "timeout"
      ? "O limite de 3 horas foi atingido. Foram contabilizadas apenas as respostas salvas."
      : "Seu resultado foi registrado e as métricas da Área do Aluno foram atualizadas.";
    try {
      await registerAttempt(snapshot);
    } catch (attemptError) {
      message = `${message} ${attemptError.message}`;
    }
    clearStoredExam();
    setResult({
      correct: snapshot.correct,
      answered: snapshot.answered,
      reason,
      message,
    });
    setPhase("result");
    setSaving(false);
  }

  useEffect(() => {
    if (phase !== "exam" || !exam) return undefined;
    function tick() {
      const seconds = Math.max(0, Math.ceil((exam.expiresAt - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) finishExam("timeout", exam);
    }
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [phase, exam]);

  const question = exam?.questions[exam.index] || null;
  const progress = exam ? Math.round((exam.answered / exam.questions.length) * 100) : 0;
  const score = exam?.answered ? Math.round((exam.correct / exam.answered) * 100) : 0;
  const resultScore = result?.answered ? Math.round((result.correct / result.answered) * 100) : 0;
  const timerWarning = remaining <= 15 * 60;

  function selectOption(key) {
    if (!exam || exam.correction || saving) return;
    const next = { ...exam, selected: key };
    setExam(next);
    persistExam(next);
  }

  async function saveAnswer() {
    if (!exam?.selected || exam.correction || saving || !question) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/questions/${SUBJECT}/answer`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: question.id,
          selected_answer: exam.selected,
          response_time_ms: Date.now() - exam.questionStartedAt,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Não foi possível salvar a resposta.");
      const next = {
        ...exam,
        correct: exam.correct + (payload.is_correct ? 1 : 0),
        answered: exam.answered + 1,
        correction: payload,
      };
      setExam(next);
      persistExam(next);
    } catch (saveError) {
      setError(saveError.message || "Erro ao salvar a resposta.");
    } finally {
      setSaving(false);
    }
  }

  function nextQuestion() {
    if (!exam?.correction) return;
    if (exam.index >= exam.questions.length - 1) {
      finishExam("completed", exam);
      return;
    }
    const next = {
      ...exam,
      index: exam.index + 1,
      selected: null,
      correction: null,
      questionStartedAt: Date.now(),
    };
    setExam(next);
    persistExam(next);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startAnotherExam() {
    clearStoredExam();
    location.reload();
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("pscpp:theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  const numberedQuestions = useMemo(
    () => exam?.questions.map((item, index) => ({ id: item.id, number: index + 1 })) || [],
    [exam?.questions]
  );

  if (phase === "loading") {
    return <main className={styles.statePage} data-theme={theme}><div className={styles.spinner} /><h1>Preparando seu simulado...</h1><p>Sorteando 100 questões de Manobrabilidade.</p></main>;
  }

  if (phase === "error") {
    return <main className={styles.statePage} data-theme={theme}><span className={styles.stateIcon}>!</span><h1>Não foi possível iniciar</h1><p>{error}</p><div className={styles.stateActions}><button onClick={() => location.reload()}>Tentar novamente</button><a href="/study-content/simulado/manobrabilidade">Voltar ao conteúdo</a></div></main>;
  }

  if (phase === "result" && result) {
    return <main className={styles.resultPage} data-theme={theme}>
      <a className={styles.resultBrand} href="/"><img src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO" /></a>
      <section className={styles.resultCard}>
        <span className={styles.eyebrow}>SIMULADO CONCLUÍDO</span>
        <div className={styles.resultGauge}><strong>{resultScore}%</strong><span>APROVEITAMENTO</span></div>
        <h1>Resultado de Manobrabilidade</h1>
        <div className={styles.resultStats}><div><span>RESPONDIDAS</span><strong>{result.answered}</strong></div><div><span>ACERTOS</span><strong className={styles.successText}>{result.correct}</strong></div><div><span>ERROS</span><strong className={styles.dangerText}>{result.answered - result.correct}</strong></div></div>
        <p>{result.message}</p>
        <div className={styles.resultActions}><a href="/area-do-aluno#desempenho">Ver meu desempenho</a><button onClick={startAnotherExam}>Iniciar Novo Simulado</button></div>
      </section>
    </main>;
  }

  return <div className={styles.page} data-theme={theme}>
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a className={styles.brand} href="/"><img src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO" /></a>
        <div className={styles.headerMeta}><span>{userEmail}</span><a href="/area-do-aluno#desempenho">Desempenho</a><button type="button" onClick={toggleTheme} aria-label="Alternar tema">{theme === "dark" ? "☀️" : "🌙"}</button><form action="/api/auth/logout" method="post"><button type="submit">Sair</button></form></div>
      </div>
    </header>

    <main className={styles.main}>
      <div className={styles.examHeading}>
        <div><span className={styles.eyebrow}>PROVA INTERATIVA · MANOBRABILIDADE</span><h1>Simulado de Manobrabilidade</h1><p>100 questões aleatórias · correção comentada · máximo de 3 horas</p></div>
        <div className={`${styles.timer} ${timerWarning ? styles.timerWarning : ""}`}><span>Tempo restante</span><strong>{formatTime(remaining)}</strong></div>
      </div>

      <div className={styles.overallProgress}><i style={{ width: `${progress}%` }} /></div>
      <div className={styles.progressLegend}><span>{exam.answered} de {exam.questions.length} respondidas</span><span>{progress}% concluído</span></div>

      <div className={styles.examLayout}>
        <section className={styles.questionCard}>
          <div className={styles.questionTop}><div><span>QUESTÃO {exam.index + 1}</span><small>{question.id}</small></div><div className={styles.liveScore}><span>ACERTOS</span><strong>{exam.correct}</strong><small>{score}%</small></div></div>
          <div className={styles.questionTags}><span>{question.module}</span><span>{question.topic_code} · {question.topic}</span></div>
          <h2>{question.question}</h2>

          <div className={styles.options}>
            {question.options.map((option) => {
              const isSelected = exam.selected === option.key;
              const isCorrect = exam.correction?.correct_answer === option.key;
              const isWrong = exam.correction && isSelected && !exam.correction.is_correct;
              const className = [styles.option, isSelected && !exam.correction ? styles.optionSelected : "", isCorrect ? styles.optionCorrect : "", isWrong ? styles.optionWrong : ""].filter(Boolean).join(" ");
              return <button className={className} type="button" key={option.key} disabled={Boolean(exam.correction) || saving} onClick={() => selectOption(option.key)}><b>{option.key}</b><span>{option.text}</span></button>;
            })}
          </div>

          {error && <div className={styles.saveError}>{error}</div>}
          {exam.correction && <article className={`${styles.feedback} ${exam.correction.is_correct ? styles.feedbackCorrect : styles.feedbackWrong}`}><strong>{exam.correction.is_correct ? `Você acertou. Gabarito: ${exam.correction.correct_answer}` : `Você errou. Gabarito: ${exam.correction.correct_answer}`}</strong><p>{exam.correction.explanation}</p><small>Fonte: {sourceText(exam.correction.source)}</small></article>}

          <div className={styles.actions}>
            <button className={styles.stopButton} type="button" disabled={saving} onClick={() => finishExam("manual", exam)}>Encerrar prova</button>
            {!exam.correction ? <button className={styles.saveButton} type="button" disabled={!exam.selected || saving} onClick={saveAnswer}>{saving ? "Salvando..." : "Salvar resposta"}</button> : <button className={styles.nextButton} type="button" disabled={saving} onClick={nextQuestion}>{exam.index === exam.questions.length - 1 ? "Finalizar simulado" : "Próxima questão"}<span>→</span></button>}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <section className={styles.sidebarCard}><span className={styles.sidebarLabel}>PROGRESSO DA PROVA</span><div className={styles.sidebarSummary}><div><strong>{exam.answered}</strong><span>respondidas</span></div><div><strong>{exam.correct}</strong><span>acertos</span></div><div><strong>{exam.answered - exam.correct}</strong><span>erros</span></div></div></section>
          <section className={styles.sidebarCard}><div className={styles.navigatorHeading}><span className={styles.sidebarLabel}>QUESTÕES</span><small>Salve para avançar</small></div><div className={styles.questionGrid}>{numberedQuestions.map((item, index) => <span key={item.id} className={[styles.questionNumber, index < exam.index ? styles.questionAnswered : "", index === exam.index ? styles.questionCurrent : ""].filter(Boolean).join(" ")}>{item.number}</span>)}</div></section>
          <a className={styles.backLink} href="/study-content/simulado/manobrabilidade">← Voltar ao conteúdo programático</a>
        </aside>
      </div>
    </main>
  </div>;
}
