import {getAdmin} from "../../../../lib/admin";
import {deleteRipeam3DScene,listRipeam3DScenes,saveRipeam3DScene} from "../../../../lib/ripeam-3d-scenes";
export const dynamic="force-dynamic";
export async function GET(){
  if(!(await getAdmin()))return Response.json({error:"Não autorizado"},{status:403});
  return Response.json({ok:true,scenes:await listRipeam3DScenes()});
}
export async function POST(request){
  if(!(await getAdmin()))return Response.json({error:"Não autorizado"},{status:403});
  const body=await request.json().catch(()=>({}));
  if(body.action==="delete"){await deleteRipeam3DScene(body.id);return Response.json({ok:true});}
  const scene=await saveRipeam3DScene(body.scene||body);
  return Response.json({ok:true,scene});
}
