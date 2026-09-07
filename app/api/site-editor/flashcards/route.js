import {assertSameOrigin,requireEditorAuth,routeError} from "../../../../lib/site-editor/server";
import {flashQuery} from "../../../../lib/flashcards-db";

export const runtime="nodejs";

function cleanPatch(input={}){
  const out={};
  const fields=["code","name","term_pt","term_en","pt","en","note","image","category","effect","transition"];
  for(const key of fields){
    if(key in input)out[key]=String(input[key]??"").slice(0,key==="pt"||key==="en"||key==="note"?6000:1200);
  }
  return out;
}

export async function GET(request){
  try{
    await requireEditorAuth();
    const slug=String(new URL(request.url).searchParams.get("slug")||"").trim().toLowerCase();
    if(!slug)return Response.json({ok:false,error:"Slug obrigatório."},{status:400});
    const r=await flashQuery("select id,slug,title,description,subject_label,cards,is_active from decks where slug=$1 limit 1",[slug]);
    const row=r.rows[0];if(!row)return Response.json({ok:false,error:"Deck não encontrado."},{status:404});
    return Response.json({ok:true,deck:{...row,cards:Array.isArray(row.cards)?row.cards:[]}});
  }catch(e){return routeError(e)}
}

export async function POST(request){
  try{
    await assertSameOrigin();await requireEditorAuth();
    const body=await request.json().catch(()=>({}));
    const slug=String(body.slug||"").trim().toLowerCase(),cardId=String(body.card_id??"");
    if(!slug||!cardId)return Response.json({ok:false,error:"Deck e cartão são obrigatórios."},{status:400});
    const r=await flashQuery("select id,slug,title,description,subject_label,cards,is_active from decks where slug=$1 limit 1",[slug]);
    const row=r.rows[0];if(!row)return Response.json({ok:false,error:"Deck não encontrado."},{status:404});
    const cards=Array.isArray(row.cards)?row.cards:[];
    const idx=cards.findIndex(c=>String(c?.id)===cardId);
    if(idx<0)return Response.json({ok:false,error:"Cartão não encontrado."},{status:404});
    const next=[...cards];next[idx]={...next[idx],...cleanPatch(body.patch)};
    const u=await flashQuery("update decks set cards=$2::jsonb where id=$1 returning id,slug,title,description,subject_label,cards,is_active",[row.id,JSON.stringify(next)]);
    const deck=u.rows[0];
    return Response.json({ok:true,deck:{...deck,cards:Array.isArray(deck.cards)?deck.cards:[]}});
  }catch(e){return routeError(e)}
}
