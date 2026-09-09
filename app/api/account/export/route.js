import {getSession} from "../../../../lib/auth";
import {query} from "../../../../lib/db";
export const dynamic="force-dynamic";

async function rows(sql,params){
  try{return (await query(sql,params)).rows;}catch{return[];}
}

export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const id=session.id;
  const [account,profile,access,progress,exams,answers,notebooks,consents,tutorConversations,tutorMessages,tutorUsage,paymentOrders]=await Promise.all([
    rows("select id,email,role,status,email_verified,created_at,updated_at,last_login_at from users where id=$1",[id]),
    rows("select * from user_profiles where user_id=$1",[id]),
    rows("select * from user_access where user_id=$1 order by created_at",[id]),
    rows("select * from study_progress where user_id=$1 order by subject",[id]),
    rows("select * from exam_sessions where user_id=$1 order by started_at desc",[id]),
    rows("select question_id,subject,selected_answer,is_correct,response_time_ms,answered_at from question_answers where user_id=$1 order by answered_at desc",[id]),
    rows("select id,title,subjects,total_questions,created_at,updated_at from question_notebooks where user_id=$1 order by created_at desc",[id]),
    rows("select terms_version,privacy_version,source,accepted_at from user_consents where user_id=$1 order by accepted_at desc",[id]),
    rows("select id,title,created_at,updated_at from ai_tutor_conversations where user_id=$1 order by updated_at desc",[id]),
    rows("select conversation_id,role,content,input_tokens,output_tokens,model,created_at from ai_tutor_messages where user_id=$1 order by id",[id]),
    rows("select usage_date,questions,input_tokens,output_tokens from ai_tutor_daily_usage where user_id=$1 order by usage_date desc",[id]),
    rows("select provider,provider_payment_id,status,amount_cents,currency,description,product_code,approved_at,created_at,updated_at from payment_orders where user_id=$1 order by created_at desc",[id])
  ]);
  const payload={exported_at:new Date().toISOString(),account:account[0]||null,profile:profile[0]||null,access,study_progress:progress,exam_sessions:exams,question_answers:answers,question_notebooks:notebooks,consents,payment_orders:paymentOrders,ai_tutor:{conversations:tutorConversations,messages:tutorMessages,daily_usage:tutorUsage}};
  return new Response(JSON.stringify(payload,null,2),{headers:{"Content-Type":"application/json; charset=utf-8","Content-Disposition":"attachment; filename=estibordo-meus-dados.json","Cache-Control":"private, no-store"}});
}
