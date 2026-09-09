import {redirect} from "next/navigation";
import {getSession} from "../../../../lib/auth";
import StudentHeader from "../../../components/StudentHeader";
import Ripeam3DClient from "./Ripeam3DClient";

export const metadata = {
  title: "Laboratório 3D RIPEAM | ESTIBORDO",
  description: "Laboratório visual 3D de luzes e marcas do RIPEAM / COLREG."
};

export default async function Ripeam3DPage(){
  const session=await getSession();
  if(!session)redirect("/login?next=/flashcards/ripeam/3d");
  return <>
    <StudentHeader active="ripeam3d"/>
    <Ripeam3DClient/>
  </>;
}
