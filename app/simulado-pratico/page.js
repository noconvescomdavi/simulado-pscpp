import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getEntitlement } from "../../lib/entitlement";
import StudentHeader from "../components/StudentHeader";
import PracticalSimulator from "./PracticalSimulator";
import "./pratico.css";

export const metadata={title:"Simulado Prático Oral | ESTIBORDO",description:"Treinamento da Prova Prático-Oral do PSCPP em cenário de praticagem na Baía de Guanabara."};

export default async function Page(){
 const session=await getSession();
 if(!session) redirect("/login");
 const entitlement=await getEntitlement(session.id);
 if(!entitlement.active&&!entitlement.trial) redirect("/comprar");
 return <><StudentHeader active="simulados"/><PracticalSimulator/></>;
}