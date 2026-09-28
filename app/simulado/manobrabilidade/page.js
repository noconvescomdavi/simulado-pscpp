import { redirect } from "next/navigation";
import { getSession } from "../../../lib/auth";
import { getUserAccess } from "../../../lib/access";
import { getQuestionCatalogCount } from "../../../lib/question-summary";
import { subjectLabel } from "../../../lib/subjects";
import StudentHeader from "../../components/StudentHeader";
import Client from "../[subject]/Client";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!(await getUserAccess(session.id))?.active) redirect("/comprar");

  const subject = "manobrabilidade";
  const count = getQuestionCatalogCount(subject);

  return (
    <>
      <StudentHeader active="simulados" />
      <Client
        subject={subject}
        title={subjectLabel(subject)}
        ready={Boolean(count)}
      />
    </>
  );
}
