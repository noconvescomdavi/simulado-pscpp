import {getAdmin} from "../../../../lib/admin";
import {
  deleteRipeam3DScene,listRipeam3DScenes,saveRipeam3DScene,publishRipeam3DScene,
  listRipeam3DAssets,upsertRipeam3DAsset,listSceneVersions,restoreSceneVersion,listRipeam3DPublications
} from "../../../../lib/ripeam-3d-scenes";
import {mergeCanonicalStudentScenes} from "../../../../lib/ripeam-3d-default-scenes";
import {assertSameOrigin} from "../../../../lib/security";

export const dynamic="force-dynamic";

export async function GET(request){
  if(!(await getAdmin()))return Response.json({error:"Não autorizado"},{status:403});
  const url=new URL(request.url);
  const sceneId=String(url.searchParams.get("sceneId")||"");
  const [storedScenes,assets,versions,publications]=await Promise.all([
    listRipeam3DScenes(),
    listRipeam3DAssets(),
    sceneId?listSceneVersions(sceneId):Promise.resolve([]),
    listRipeam3DPublications()
  ]);
  const publicationByKey=new Map(publications.map(p=>[p.scene_key,p]));
  const scenes=mergeCanonicalStudentScenes(storedScenes).map(scene=>{
    const pub=publicationByKey.get(scene.scene_key);
    return {...scene,liveStudentScene:!!pub||!!scene.systemScene,publishedSnapshot:pub?.snapshot||null,publishedAt:pub?.published_at||null};
  });
  return Response.json({ok:true,scenes,assets,versions});
}

export async function POST(request){
  try{await assertSameOrigin();}catch(error){return Response.json({error:"Origem inválida."},{status:Number(error?.status)||403});}
  if(!(await getAdmin()))return Response.json({error:"Não autorizado"},{status:403});
  const body=await request.json().catch(()=>({}));
  if(body.action==="delete"){
    await deleteRipeam3DScene(body.id);
    return Response.json({ok:true});
  }
  if(body.action==="asset"){
    const asset=await upsertRipeam3DAsset(body.asset||{});
    return Response.json({ok:true,asset});
  }
  if(body.action==="restore"){
    const scene=await restoreSceneVersion(body.versionId);
    if(!scene)return Response.json({error:"Versão não encontrada"},{status:404});
    return Response.json({ok:true,scene});
  }
  if(body.action==="publish"){
    const scene=await publishRipeam3DScene(body.scene||body);
    return Response.json({ok:true,scene,publishedSnapshot:scene.publishedSnapshot});
  }
  const scene=await saveRipeam3DScene(body.scene||body);
  return Response.json({ok:true,scene});
}
