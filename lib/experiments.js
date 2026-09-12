import {createHash} from "node:crypto";
import {query} from "./db";

export const EXPERIMENTS={
  dashboard_mission_copy:["control","action_first"],
  review_center_cta:["control","urgency"],
  smart_training_entry:["control","personalized"]
};

function deterministicVariant(userId,key,variants){
  const hex=createHash("sha256").update(String(userId)+"|"+key).digest("hex").slice(0,8);
  return variants[parseInt(hex,16)%variants.length];
}

export async function getExperimentVariant(userId,key){
  const variants=EXPERIMENTS[key];
  if(!variants)return null;
  const existing=await query("select variant from experiment_assignments where user_id=$1 and experiment_key=$2 limit 1",[userId,key]).catch(()=>({rows:[]}));
  if(existing.rows[0]?.variant&&variants.includes(existing.rows[0].variant))return existing.rows[0].variant;
  const variant=deterministicVariant(userId,key,variants);
  await query(`insert into experiment_assignments(user_id,experiment_key,variant) values($1,$2,$3)
    on conflict(user_id,experiment_key) do nothing`,[userId,key,variant]).catch(()=>{});
  return variant;
}
