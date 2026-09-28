"use client";
import {useEffect} from "react";

async function mirror(path,body){
  try{await fetch(path,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}catch{}
}
export function DesktopAcademicMirror({userId,notebook=null,exam=null}){
  useEffect(()=>{
    if(!userId)return;
    if(notebook)void mirror("/api/desktop/local/notebook",{user_id:userId,id:String(notebook.id),title:notebook.title,subjects:notebook.subjects||[],question_refs:(notebook.questions||[]).map(q=>({subject:q.subject,id:String(q.id)})),answers:Object.fromEntries((notebook.questions||[]).filter(q=>q.answer).map(q=>[`${q.subject}:${q.id}`,q.answer])),total_questions:notebook.total_questions||(notebook.questions||[]).length,created_at:notebook.created_at});
    if(exam)void mirror("/api/desktop/local/exam",{user_id:userId,id:String(exam.id),subject:exam.subject, status:exam.status,question_ids:(exam.questions||[]).map(q=>String(q.id)),answers:Object.fromEntries((exam.questions||[]).filter(q=>q.answer).map(q=>[String(q.id),q.answer])),total_questions:exam.total_questions||(exam.questions||[]).length,answered_count:exam.answered_count||0,correct_count:exam.correct_count||0,started_at:exam.started_at,expires_at:exam.expires_at,paused_at:exam.paused_at,remaining_seconds:exam.remaining_seconds});
  },[userId,notebook?.id,notebook?.updated_at,exam?.id,exam?.answered_count,exam?.status]);
  return null;
}
