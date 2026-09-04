import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import StudentHeader from "../components/StudentHeader";

export default async function TesteGratisExcedido({searchParams}){
  const session=await getSession();
  if(!session) redirect("/login");

  const q=await searchParams;
  const recurso=String(q?.recurso||"teste");
  const nome=recurso==="simulado"?"simulado":recurso==="caderno"?"caderno de questoes":"recurso";

  return (
    <>
      <StudentHeader/>
      <main className="trialLimitPage">
        <section className="trialLimitCard">
          <span>TESTE GRATIS</span>
          <h1>Seu Teste Gratis foi excedido.</h1>
          <p>
            Voce ja utilizou o {nome} disponivel gratuitamente.
            Para continuar estudando e liberar todos os materiais da plataforma,
            adquira o pacote anual ESTIBORDO.
          </p>
          <div className="trialLimitActions">
            <a href="/area-do-aluno" className="trialBack">Voltar</a>
            <a href="/comprar" className="trialBuy">Comprar</a>
          </div>
        </section>
      </main>
    </>
  );
}