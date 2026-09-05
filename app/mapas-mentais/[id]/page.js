import {notFound,redirect} from "next/navigation";
import {getSession} from "../../../lib/auth";
import {getEntitlement} from "../../../lib/entitlement";
import {getMindMap} from "../../../lib/mind-maps";
import StudentHeader from "../../components/StudentHeader";
import MindMapEditor from "./MindMapEditor";
import styles from "./editor.module.css";

export const dynamic="force-dynamic";

export default async function MindMapEditorPage({params}){
  const session=await getSession();
  if(!session)redirect("/login");
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar?locked=inactive");
  const {id}=await params;
  const map=await getMindMap(session.id,id);
  if(!map)notFound();

  return <>
    <StudentHeader active="mapas"/>
    <main className={styles.page}>
      <MindMapEditor initialMap={map}/>
    </main>
  </>;
}
