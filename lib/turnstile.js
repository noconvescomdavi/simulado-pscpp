export async function verifyTurnstile(token){
  const secret=String(process.env.TURNSTILE_SECRET_KEY||"").trim();
  if(!secret)return true;
  const response=String(token||"").trim();
  if(!response)return false;
  const r=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret,response})
  });
  if(!r.ok)return false;
  const j=await r.json().catch(()=>({}));
  return j.success===true;
}
