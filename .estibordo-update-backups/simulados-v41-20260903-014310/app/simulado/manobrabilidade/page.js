import { redirect } from "next/navigation";
import { getSession } from "../../../lib/auth";
import { query } from "../../../lib/db";
import SimuladoClient from "./SimuladoClient";

export const metadata = {
  title: "Simulado de Manobrabilidade",
  description: "Prova interativa de Manobrabilidade com 100 questões aleatórias e correção comentada.",
};

export default async function SimuladoManobrabilidade() {
  const session = await getSession();
  if (!session) redirect("/login?next=/simulado/manobrabilidade");

  const access = await query(
    "select status from user_access where user_id=$1 and product_code='pscpp-vitalicio'",
    [session.id]
  );
  if (access.rows[0]?.status !== "active") redirect("/comprar?locked=1");

  return <SimuladoClient userEmail={session.email} />;
}
