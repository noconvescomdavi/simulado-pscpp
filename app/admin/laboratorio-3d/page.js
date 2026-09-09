import {redirect} from "next/navigation";
import {getAdmin} from "../../../lib/admin";
import Admin3DEditor from "./Admin3DEditor";
import styles from "./laboratorio-3d.module.css";
export const metadata={title:"Editor 3D | ESTIBORDO",robots:{index:false,follow:false}};
export default async function Page(){if(!(await getAdmin("ripeam.manage")))redirect("/admin");return <main className={styles.page}><Admin3DEditor/></main>}
