function configured(){return process.env.ESTIBORDO_DESKTOP==="1"&&process.env.ESTIBORDO_LOCAL_BRIDGE_URL&&process.env.ESTIBORDO_LOCAL_BRIDGE_TOKEN}
export function isDesktopRuntime(){return Boolean(configured())}
export async function desktopLocal(path,{method="GET",body}={}){
  if(!configured())throw new Error("DESKTOP_LOCAL_BRIDGE_UNAVAILABLE");
  const response=await fetch(new URL(path,process.env.ESTIBORDO_LOCAL_BRIDGE_URL),{
    method,headers:{Authorization:`Bearer ${process.env.ESTIBORDO_LOCAL_BRIDGE_TOKEN}`,...(body?{"Content-Type":"application/json"}:{})},
    body:body?JSON.stringify(body):undefined,cache:"no-store"
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(payload.error||`DESKTOP_LOCAL_${response.status}`);
  return payload;
}
