import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import StudentHeader from "../components/StudentHeader";
import SupportClient from "./SupportClient";

export default async function SupportPage() {
  if (!(await getSession())) redirect("/login");

  return (
    <>
      <StudentHeader active="suporte" />
      <main className="studentDashboardV2 supportPage">
        <SupportClient />
      </main>
    </>
  );
}
