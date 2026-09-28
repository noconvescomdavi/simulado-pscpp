import {isDesktopRuntime} from "../../../../lib/desktop-local";

const destinations={register:"/cadastro",password:"/esqueci-minha-senha",purchase:"/comprar",support:"/suporte"};

export async function GET(request){
  const target=destinations[new URL(request.url).searchParams.get("to")];
  if(!target)return Response.json({error:"Destino inválido."},{status:400});
  if(!isDesktopRuntime())return Response.redirect(new URL(target,request.url),303);
  const origin=new URL(process.env.ESTIBORDO_REMOTE_API_ORIGIN||"");
  if(origin.protocol!=="https:"||origin.username||origin.password||origin.pathname!=="/")return Response.json({error:"Serviço online indisponível."},{status:503});
  return Response.redirect(new URL(target,origin),303);
}
