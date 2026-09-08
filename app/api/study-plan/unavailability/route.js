import { getSession } from "../../../../lib/auth";
import { query } from "../../../../lib/db";

const validDate=(value)=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||""));

export async function POST(req){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const body=await req.json().catch(()=>({}));
    const planDate=String(body.plan_date||"");
    if(!validDate(planDate))return Response.json({error:"Data inválida."},{status:400});
    const unavailable=body.unavailable!==false;

    if(!unavailable){
      await query("delete from student_plan_unavailability where user_id=$1 and plan_date=$2::date",[session.id,planDate]);
      await query(
        "insert into student_plan_events(user_id,event_type,plan_date,metadata) values($1,'DAY_AVAILABLE_AGAIN',$2::date,$3::jsonb)",
        [session.id,planDate,JSON.stringify({source:"student"})]
      ).catch(()=>{});
      return Response.json({ok:true,unavailable:false});
    }

    const allowed=["work","onboard","rest","unexpected","health","other"];
    const reason=allowed.includes(body.reason)?body.reason:"other";
    const note=String(body.note||"").trim().slice(0,500)||null;
    const saved=await query(
      "insert into student_plan_unavailability(user_id,plan_date,reason,note,updated_at) values($1,$2::date,$3,$4,now()) on conflict(user_id,plan_date) do update set reason=excluded.reason,note=excluded.note,updated_at=now() returning plan_date,reason,note,updated_at",
      [session.id,planDate,reason,note]
    );
    await query(
      "insert into student_plan_events(user_id,event_type,plan_date,metadata) values($1,'DAY_UNAVAILABLE',$2::date,$3::jsonb)",
      [session.id,planDate,JSON.stringify({reason,note,source:"student"})]
    ).catch(()=>{});
    return Response.json({ok:true,unavailable:true,item:saved.rows[0]||null});
  }catch(error){
    console.error("Erro ao atualizar indisponibilidade:",error);
    return Response.json({error:"Não foi possível atualizar o dia de estudo."},{status:500});
  }
}
