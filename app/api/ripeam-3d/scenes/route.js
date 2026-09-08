import {listRipeam3DScenes} from "../../../../lib/ripeam-3d-scenes";
export const dynamic="force-dynamic";
export async function GET(request){
  const key=String(new URL(request.url).searchParams.get("key")||"").trim();
  const scenes=await listRipeam3DScenes({publishedOnly:true});
  const selected=key?scenes.find(s=>s.scene_key===key):null;
  return Response.json({ok:true,scene:selected||null,scenes:key?undefined:scenes});
}
