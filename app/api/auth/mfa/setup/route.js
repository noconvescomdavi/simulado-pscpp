import {getSession} from "../../../../../lib/auth";import {prepareStudentMfa,enableStudentMfa} from "../../../../../lib/student-mfa";import {assertSameOrigin} from "../../../../../lib/security";
export async function POST(req){try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403})}const s=await getSession();if(!s)return Response.json({error:"Não autenticado."},{status:401});const b=await req.json().catch(()=>({}));
 if(b.action==="prepare")return Response.json(await prepareStudentMfa(s.id,s.email));
 if(b.action==="enable"){const codes=await enableStudentMfa(s.id,String(b.code||""));return codes?Response.json({ok:true,recoveryCodes:codes}):Response.json({error:"Código inválido."},{status:400})}
 return Response.json({error:"Ação inválida."},{status:400});
}