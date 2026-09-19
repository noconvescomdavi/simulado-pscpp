import {getSession} from "../../../../../../lib/auth";
import {getLibraryPdf} from "../../../../../../lib/github-library";
export const runtime="nodejs";
export async function GET(request,{params}){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const {id}=await params;
  try{
    const item=await getLibraryPdf(session.id,id);
    if(!item)return Response.json({error:"Documento não encontrado."},{status:404});
    return new Response(item.response.body,{status:200,headers:{"Content-Type":"application/pdf","Cache-Control":"private, no-store, max-age=0","X-Content-Type-Options":"nosniff"}});
  }catch(error){return Response.json({error:error.message||"Não foi possível abrir o PDF."},{status:502})}
}
