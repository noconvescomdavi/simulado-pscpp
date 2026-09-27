import {getSession} from "../../../../../lib/auth";
import {desktopLocal,isDesktopRuntime} from "../../../../../lib/desktop-local";
async function handle(request,kind){
 const session=await getSession();if(!session)return Response.json({error:"Não autenticado."},{status:401});
 if(!isDesktopRuntime())return Response.json({error:"Desktop local indisponível."},{status:404});
 const body=await request.json().catch(()=>({}));body.user_id=session.id;
 const result=await desktopLocal(`/v1/${kind}`,{method:"PUT",body});return Response.json(result);
}
export async function PUT(request,{params}){const {entity}=await params;if(entity==="exam")return handle(request,"exams");if(entity==="notebook")return handle(request,"notebooks");return Response.json({error:"Entidade inválida."},{status:404})}
