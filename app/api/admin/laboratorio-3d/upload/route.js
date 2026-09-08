import {getAdmin} from "../../../../../lib/admin";
import {saveUpload} from "../../../../../lib/site-editor/design-server";
import {upsertRipeam3DAsset} from "../../../../../lib/ripeam-3d-scenes";
import {assertSameOrigin} from "../../../../../lib/security";

export const runtime="nodejs";

export async function POST(request){
  if(!(await getAdmin()))return Response.json({error:"Não autorizado"},{status:403});
  try{
    await assertSameOrigin();
    const form=await request.formData();
    const file=form.get("file");
    const result=await saveUpload(file);
    const ext=String(file?.name||"").split(".").pop().toLowerCase();
    const asset=await upsertRipeam3DAsset({
      name:String(file?.name||"Asset 3D"),
      url:result.url,
      asset_type:ext,
      bytes:Number(file?.size||0),
      category:String(form.get("category")||""),
      tags:String(form.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean),
      metadata:{uploaded_from:"admin-laboratorio-3d"}
    });
    return Response.json({ok:true,...result,asset});
  }catch(error){
    return Response.json({ok:false,error:String(error?.message||error)},{status:Number(error?.status)||500});
  }
}
