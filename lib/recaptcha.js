export async function verifyRecaptcha(token,remoteip=""){
 const secret=String(process.env.RECAPTCHA_SECRET_KEY||"").trim();
 if(!secret)return true;
 const response=String(token||"").trim();
 if(!response)return false;
 const body=new URLSearchParams({secret,response});
 if(remoteip)body.set("remoteip",remoteip);
 const r=await fetch("https://www.google.com/recaptcha/api/siteverify",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body,cache:"no-store"});
 if(!r.ok)return false;
 const j=await r.json().catch(()=>({}));
 return j.success===true;
}