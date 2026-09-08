"use client";

import { useMemo, useState } from "react";
import TrackedStudyLink from "../components/TrackedStudyLink";
import {stopTrackedStudySession} from "../components/StudySessionTracker";

export default function DailyStudyPlan({ initialPlan }) {
  const [plan, setPlan] = useState(initialPlan);
  const [busy, setBusy] = useState("");
  const integrated = plan?.source === "integrated";
  const [dailyMinutes, setDailyMinutes] = useState(plan?.goal?.daily_minutes || 60);
  const [weeklyQuestions, setWeeklyQuestions] = useState(plan?.goal?.weekly_questions || 350);
  const [savingGoals, setSavingGoals] = useState(false);

  if(!plan){
    return <section className="dailyPlanPanel">
      <div className="dailyPlanHead"><div><span>PLANO DIÁRIO ESTIBORDO</span><h2>Configure seu Plano de Estudos</h2><p>Responda o diagnóstico inicial para a plataforma montar seu cronograma adaptativo.</p></div></div>
      <a href="/plano-de-estudos/configurar">Configurar meu plano →</a>
    </section>;
  }

  const completedMinutes = useMemo(
    () =>
      plan.tasks
        .filter((task) => task.completed)
        .reduce((sum, task) => sum + Number(task.minutes || 0), 0),
    [plan]
  );

  async function toggleTask(task) {
    if (busy || task.completed) return;
    setBusy(task.key);
    const previous=plan;
    setPlan(current=>{
      const tasks=current.tasks.map(item=>item.key===task.key?{...item,completed:true,status:"done"}:item);
      const completed=tasks.filter(item=>item.completed).length;
      return {...current,tasks,progress:{...current.progress,total:tasks.length,completed,percent:tasks.length?Math.round(completed/tasks.length*100):0}};
    });

    try {
      const response = await fetch("/api/study-plan/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind:"task",
          plan_date:task.plan_date,
          task_key:task.key,
          task_type:task.type,
          subject_slug:task.subject,
          status:"done",
          bibliography_key:task.bibliography_key||null,
          section_key:task.section_key||null,
          page_from:task.page_from||null,
          page_to:task.page_to||null,
          complete_bibliography_unit:task.type==="reading",
          metadata:{title:task.title,description:task.description,href:task.href||null,source:"dashboard_master_plan"}
        }),
      });
      const data=await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(data.error||"Não foi possível salvar a conclusão.");
      await stopTrackedStudySession().catch(()=>{});
    } catch (error) {
      setPlan(previous);
      window.alert(error.message||"Não foi possível salvar a conclusão.");
    } finally {
      setBusy("");
    }
  }

  async function saveGoals(event) {
    event.preventDefault();
    if (savingGoals) return;
    setSavingGoals(true);
    try {
      const response = await fetch("/api/study-plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          daily_minutes: Number(dailyMinutes),
          weekly_questions: Number(weeklyQuestions),
        }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (data.plan) {
        setPlan(data.plan);
        setDailyMinutes(data.plan.goal.daily_minutes);
        setWeeklyQuestions(data.plan.goal.weekly_questions);
      }
    } finally {
      setSavingGoals(false);
    }
  }

  return (
    <section className="dailyPlanPanel">
      <div className="dailyPlanHead">
        <div>
          <span>PLANO DIÁRIO ESTIBORDO</span>
          <h2>Seu rumo de estudo para hoje</h2>
          <p>
            {integrated
              ? "As tarefas abaixo são as mesmas do seu Plano de Estudos Inteligente. Concluir aqui atualiza o planejamento e a bibliografia."
              : "Prioridades calculadas a partir do seu desempenho, erros e meta semanal."}
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
        {!integrated&&<span>Questões hoje: <b>{plan.goal.questions_answered_today}/{plan.goal.daily_question_target}</b></span>}
        {integrated&&plan.phase?.label&&<span>Fase: <b>{plan.phase.label}</b></span>}
        <span>Concluído: <b>{completedMinutes} min</b></span>
      </div>

      {!integrated&&<details className="dailyPlanSettings">
        <summary>Ajustar minhas metas</summary>
        <form onSubmit={saveGoals}>
          <label>
            Minutos por dia
            <input
              type="number"
              min="10"
              max="720"
              value={dailyMinutes}
              onChange={(event) => setDailyMinutes(event.target.value)}
            />
          </label>
          <label>
            Questões por semana
            <input
              type="number"
              min="7"
              max="10000"
              value={weeklyQuestions}
              onChange={(event) => setWeeklyQuestions(event.target.value)}
            />
          </label>
          <button type="submit" disabled={savingGoals}>
            {savingGoals ? "Salvando..." : "Salvar metas"}
          </button>
        </form>
      </details>}

      <div className="dailyPlanTasks">
        {plan.tasks.map((task, index) => (
          <article
            className={`dailyTask ${task.completed ? "isDone" : ""}`}
            key={task.key}
          >
            <button
              type="button"
              className="dailyTaskCheck"
              aria-label={task.completed ? `${task.title} concluída` : `Marcar ${task.title} como concluída`}
              onClick={() => toggleTask(task)}
              disabled={busy === task.key}
            >
              {task.completed ? "✓" : index + 1}
            </button>

            <TrackedStudyLink
              href={task.href || "/plano-de-estudos"}
              className="dailyTaskMain"
              task={{...task,source:"dashboard_daily_plan"}}
            >
              <div>
                <span>{task.target_label}</span>
                <strong>{task.title}</strong>
                <small>{task.description}</small>
                {task.reason&&<small>Por quê: {task.reason}.</small>}
              </div>
              <b>{task.minutes} min →</b>
            </TrackedStudyLink>
          </article>
        ))}
      </div>
    </section>
  );
}
