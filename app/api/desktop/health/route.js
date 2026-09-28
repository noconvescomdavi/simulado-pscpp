export async function GET(){return Response.json({ok:true,desktop:process.env.PSCPP_DESKTOP==="1"});}
