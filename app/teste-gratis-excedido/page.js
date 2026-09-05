import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import StudentHeader from "../components/StudentHeader";
export default async function TesteGratisExcedido({searchParams}){
 const session=await getSession();if(!session)redirect("/login");
 const q=await searchParams;const recurso=String(q?.recurso||"teste");const nome=recurso==="simulado"?"simulado":recurso==="caderno"?"caderno de questões":"recurso";
 return <><StudentHeader/><main className="trialLimitPage"><section className="trialLimitCard"><span>TESTE GRÁTIS</span><h1>Você chegou ao limite gratuito deste recurso.</h1><p>O {nome} incluído no teste já foi utilizado. Seu progresso continua salvo. Para continuar usando todos os recursos de estudo, você pode ativar o acesso completo à ESTIBORDO.</p><div className="trialLimitActions"><a href="/area-do-aluno" className="trialBack">Voltar ao painel</a><a href="/comprar" className="trialBuy">Conhecer o acesso completo</a></div></section></main></>
}