"use client";
import {startTrackedStudySession} from "./StudySessionTracker";

export default function TrackedStudyLink({href,task,children,className=""}){
  async function go(event){
    event.preventDefault();
    try{
      await startTrackedStudySession({
        task_key:task?.key||task?.task_key||"study",
        subject_slug:task?.subject||task?.subject_slug||null,
        session_type:task?.type||task?.session_type||"study",
        plan_date:task?.source_plan_date||task?.plan_date||null,
        metadata:{title:task?.title||null,source:task?.source||"student_ui"}
      });
    }catch{}
    window.location.assign(href);
  }
  return <a href={href} className={className} onClick={go}>{children}</a>;
}
