import Admin3DEditor from "./Admin3DEditor";
import styles from "./laboratorio-3d.module.css";
export const metadata={title:"Editor 3D | ESTIBORDO",robots:{index:false,follow:false}};
export default function Page(){return <main className={styles.page}><Admin3DEditor/></main>}
