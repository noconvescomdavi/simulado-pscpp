import {redirect} from "next/navigation";
import {getAdmin} from "../../../lib/admin";
import EditorClient from './EditorClient';
import EditorInteractionLayer from './EditorInteractionLayer';
import EditorCoreGuard from './EditorCoreGuard';
import EditorMaxSuite from './EditorMaxSuite';
import './editor.css';
import './editor-max.css';

export const metadata = {
  title: 'Editor visual | ESTIBORDO',
  robots: { index: false, follow: false },
};

export default async function SiteEditorPage(){
  if(!(await getAdmin("content.manage")))redirect("/admin");
  return <><EditorClient /><EditorInteractionLayer /><EditorCoreGuard /><EditorMaxSuite /></>;
}
