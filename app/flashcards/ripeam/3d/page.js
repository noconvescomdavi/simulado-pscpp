import Ripeam3DClient from "./Ripeam3DClient";
import styles from "./ripeam-3d.module.css";

export const metadata = {
  title: "Laboratório 3D RIPEAM | ESTIBORDO",
  description: "Visualizador interativo de luzes, marcas e aspectos de embarcações para estudo do RIPEAM/COLREG."
};

export default function Ripeam3DPage(){
  return <main className={styles.page}><Ripeam3DClient /></main>;
}
