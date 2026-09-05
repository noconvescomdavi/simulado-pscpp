"use client";

import { useMemo, useState } from "react";

export default function DailyStudyPlan({ initialPlan }) {
  const [plan, setPlan] = useState(initialPlan);
  const [busy, setBusy] = useState("");

  const completedMinutes = useMemo(
    () =>
      plan.tasks
        .filter((task) => task.completed)
        .reduce((sum, task) => sum + Number(task.minutes || 0), 0),
    [plan]
  );

  async function toggleTask(task) {
    if (busy) return;
    setBusy(task.key);

    const nextCompleted = !task.completed;
    setPlan((current) => ({
      ...current,
      tasks: current.tasks.map((item) =>
        item.key === task.key ? { ...item, completed: nextCompleted } : item
      ),
      progress: {
        ...current.progress,
        completed:
          current.progress.completed + (nextCompleted ? 1 : -1),
        percent: Math.round(
          ((current.progress.completed + (nextCompleted ? 1 : -1)) /
            current.progress.total) *
            100
        ),
      },
    }));

    try {
      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_key: task.key,
          completed: nextCompleted,
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setPlan((current) => ({
        ...current,
        progress: data.progress || current.progress,
      }));
    } catch {
      setPlan(initialPlan);
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="dailyPlanPanel">
      <div className="dailyPlanHead">
        <div>
          <span>PLANO DIÁRIO ESTIBORDO</span>
          <h2>Seu rumo de estudo para hoje</h2>
          <p>
            Prioridades calculadas a partir do seu desempenho, erros e meta semanal.
          </p>
        </div>

        <div className="dailyPlanProgress">
          <strong>{plan.progress.percent}%</strong>
          <span>{plan.progress.completed}/{plan.progress.total} tarefas concluídas</span>
        </div>
      </div>

      <div className="dailyPlanBar">
        <i style={{ width: `${plan.progress.percent}%` }} />
      </div>

      <div className="dailyPlanMeta">
        <span>Meta diária: <b>{plan.goal.daily_minutes} min</b></span>
        <span>Questões: <b>{plan.goal.daily_question_target}</b></span>
        <span>Concluído: <b>{completedMinutes} min</b></span>
      </div>

      <div className="dailyPlanTasks">
        {plan.tasks.map((task, index) => (
          <article
            className={`dailyTask ${task.completed ? "isDone" : ""}`}
            key={task.key}
          >
            <button
              type="button"
              className="dailyTaskCheck"
              aria-label={
                task.completed
                  ? `Marcar ${task.title} como pendente`
                  : `Marcar ${task.title} como concluída`
              }
              onClick={() => toggleTask(task)}
              disabled={busy === task.key}
            >
              {task.completed ? "✓" : index + 1}
            </button>

            <a href={task.href} className="dailyTaskMain">
              <div>
                <span>{task.target_label}</span>
                <strong>{task.title}</strong>
                <small>{task.description}</small>
              </div>
              <b>{task.minutes} min →</b>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
