import {getAdmin} from "../../../../../lib/admin";
import {saveUpload} from "../../../../../lib/site-editor/design-server";
export const runtime="nodejs";
export async function POST(request){
  if(!(await getAdmin()))return Response.json({error:"Não autorizado"},{status:403});
  try{
    const form=await request.formData();
    const file=form.get("file");
    const result=await saveUpload(file);
    return Response.json({ok:true,...result});
  }catch(error){
    return Response.json({ok:false,error:String(error?.message||error)},{status:Number(error?.status)||500});
  }
}
