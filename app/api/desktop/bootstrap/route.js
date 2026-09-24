import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { createSession } from "../../../../lib/auth";

export async function GET(req) {
  if (process.env.PSCPP_DESKTOP !== "1") return NextResponse.json({error:"Not found"},{status:404});
  const email = "desktop@local.pscpp";
  let result = await query("select id,email,role,status,session_version from users where lower(email)=lower($1) limit 1",[email]);
  let user = result.rows[0];
  if (!user) {
    result = await query(`insert into users(email,password_hash,role,status,email_verified,session_version,auth_provider,created_at,updated_at)
      values($1,'desktop-local-account','student','active',true,1,'password',now(),now())
      returning id,email,role,status,session_version`,[email]);
    user = result.rows[0];
  }
  await query(`insert into user_access(user_id,product_code,status,lifetime,activated_at)
    values($1,'pscpp-vitalicio','active',true,now())
    on conflict(user_id,product_code) do update set status='active',lifetime=true,activated_at=coalesce(user_access.activated_at,now())`,[user.id]);
  await createSession(user);
  return NextResponse.redirect(new URL("/area-do-aluno", req.url));
}
