
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const C=window.PSCPP_CONFIG||{};
export const configured=!!(C.SUPABASE_URL&&C.SUPABASE_ANON_KEY);
export const supabase=configured?createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY):null;
export async function session(){if(!configured)return null;const {data}=await supabase.auth.getSession();return data.session}
export async function entitlement(userId){
 if(!configured)return false;
 const {data,error}=await supabase.from("entitlements").select("status,lifetime").eq("user_id",userId).eq("product_slug",C.PRODUCT_SLUG).maybeSingle();
 return !error&&data&&data.status==="active"&&data.lifetime===true;
}
