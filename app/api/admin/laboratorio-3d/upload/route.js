import {getAdmin} from "../../../../../lib/admin";
import {saveUpload} from "../../../../../lib/site-editor/design-server";
import {upsertRipeam3DAsset} from "../../../../../lib/ripeam-3d-scenes";
import {assertSameOrigin} from "../../../../../lib/security";
import {logAdminAction} from "../../../../../lib/admin-audit";

export const runtime="nodejs";

export async function POST(request){
  const admin=await getAdmin("ripeam.manage");
  if(!admin)return Response.json({error:"Não autorizado"},{status:403});
  try{
    await assertSameOrigin();
    const form=await request.formData();
    const file=form.get("file");
    const ext=String(file?.name||"").split(".").pop().toLowerCase();
    if(ext!=="glb")return Response.json({ok:false,error:"Somente arquivos .glb são permitidos neste importador."},{status:400});
    const bytes=Number(file?.size||0);
    if(bytes<100)return Response.json({ok:false,error:"GLB vazio ou inválido."},{status:400});
    if(bytes>80*1024*1024)return Response.json({ok:false,error:"GLB excede o limite seguro de 80 MB."},{status:413});
    const head=new Uint8Array(await file.slice(0,12).arrayBuffer());
    const magic=String.fromCharCode(...head.slice(0,4));
    const version=head[4]|(head[5]<<8)|(head[6]<<16)|(head[7]<<24);
    const declared=head[8]|(head[9]<<8)|(head[10]<<16)|(head[11]<<24);
    if(magic!=="glTF"||version!==2||declared!==bytes)return Response.json({ok:false,error:"Cabeçalho GLB 2.0 inválido ou arquivo truncado."},{status:400});
    let diagnostics={};
    try{
      const parsed=JSON.parse(String(form.get("diagnostics")||"{}"));
      diagnostics={
        meshes:Math.max(0,Math.min(100000,Number(parsed.meshes)||0)),
        materials:Math.max(0,Math.min(100000,Number(parsed.materials)||0)),
        materialSlots:Math.max(0,Math.min(100000,Number(parsed.materialSlots)||0)),
        textures:Math.max(0,Math.min(100000,Number(parsed.textures)||0)),
        baseColorMaps:Math.max(0,Math.min(100000,Number(parsed.baseColorMaps)||0)),
        normalMaps:Math.max(0,Math.min(100000,Number(parsed.normalMaps)||0)),
        roughnessMaps:Math.max(0,Math.min(100000,Number(parsed.roughnessMaps)||0)),
        metalnessMaps:Math.max(0,Math.min(100000,Number(parsed.metalnessMaps)||0)),
        aoMaps:Math.max(0,Math.min(100000,Number(parsed.aoMaps)||0)),
        emissiveMaps:Math.max(0,Math.min(100000,Number(parsed.emissiveMaps)||0)),
        uvMeshes:Math.max(0,Math.min(100000,Number(parsed.uvMeshes)||0)),
        missingUvMeshes:Math.max(0,Math.min(100000,Number(parsed.missingUvMeshes)||0)),
        multiMaterialMeshes:Math.max(0,Math.min(100000,Number(parsed.multiMaterialMeshes)||0)),
        embeddedTextures:parsed.embeddedTextures!==false,
        bounds:Array.isArray(parsed.bounds)?parsed.bounds.slice(0,3).map(Number):null
      };
    }catch{}
    const result=await saveUpload(file);
    const asset=await upsertRipeam3DAsset({
      name:String(file?.name||"Asset 3D"),
      url:result.url,
      asset_type:ext,
      bytes:Number(file?.size||0),
      category:String(form.get("category")||""),
      tags:String(form.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean),
      metadata:{uploaded_from:"admin-laboratorio-3d",glbDiagnostics:diagnostics,materialModeDefault:"original"}
    });
    await logAdminAction({admin,action:"ripeam3d_upload",entityType:"ripeam3d_asset",entityKey:asset?.id||asset?.url,afterData:{name:asset?.name,url:asset?.url,bytes}});
    return Response.json({ok:true,...result,asset});
  }catch(error){
    return Response.json({ok:false,error:String(error?.message||error)},{status:Number(error?.status)||500});
  }
}
