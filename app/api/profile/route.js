import { NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import { query } from "../../../lib/db";
import { sanitizeProfile } from "../../../lib/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
  const result = await query("select * from user_profiles where user_id=$1 limit 1", [session.id]);
  return Response.json({ profile: result.rows[0] || null }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login?next=/perfil", request.url), 303);
  try {
    const form = await request.formData();
    const profile = sanitizeProfile(Object.fromEntries(form.entries()));
    await query(
      `insert into user_profiles
       (user_id,full_name,cpf,birth_date,phone,whatsapp,address_line,address_number,address_extra,district,city,state,postal_code,instagram,linkedin)
       values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       on conflict(user_id) do update set
         full_name=excluded.full_name,cpf=excluded.cpf,birth_date=excluded.birth_date,
         phone=excluded.phone,whatsapp=excluded.whatsapp,address_line=excluded.address_line,
         address_number=excluded.address_number,address_extra=excluded.address_extra,
         district=excluded.district,city=excluded.city,state=excluded.state,
         postal_code=excluded.postal_code,instagram=excluded.instagram,linkedin=excluded.linkedin,
         updated_at=now()`,
      [session.id, profile.full_name, profile.cpf, profile.birth_date, profile.phone, profile.whatsapp,
        profile.address_line, profile.address_number, profile.address_extra, profile.district,
        profile.city, profile.state, profile.postal_code, profile.instagram, profile.linkedin]
    );
    return NextResponse.redirect(new URL("/perfil?salvo=1", request.url), 303);
  } catch (error) {
    const message = error?.code === "23505" ? "Este CPF já está vinculado a outra conta." : error?.message || "Dados inválidos.";
    const url = new URL("/perfil", request.url);
    url.searchParams.set("erro", message.slice(0, 160));
    return NextResponse.redirect(url, 303);
  }
}
