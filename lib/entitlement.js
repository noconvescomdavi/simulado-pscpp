import {getUserAccess} from "./access";

export const ACCESS_FEATURES=Object.freeze({
  DASHBOARD:"dashboard",
  TRIAL_SIMULADO:"trial_simulado",
  TRIAL_CADERNO:"trial_caderno",
  TRIAL_CIS:"trial_cis",
  RANKING_PREVIEW:"ranking_preview",
  STUDY_PLAN:"study_plan",
  ADAPTIVE_TRAINING:"adaptive_training",
  SMART_REVIEW:"smart_review",
  WEAKNESS_ANALYSIS:"weakness_analysis",
  MIND_MAPS:"mind_maps",
});

const TRIAL_FEATURES=new Set([
  ACCESS_FEATURES.DASHBOARD,
  ACCESS_FEATURES.TRIAL_SIMULADO,
  ACCESS_FEATURES.TRIAL_CADERNO,
  ACCESS_FEATURES.TRIAL_CIS,
  ACCESS_FEATURES.RANKING_PREVIEW,
]);

export async function getEntitlement(userId){
  const access=await getUserAccess(userId);
  const active=access?.active===true;
  const status=String(access?.effective_status||access?.status||"inactive").toLowerCase();
  const trial=!active&&!["expired","revoked","cancelled","canceled"].includes(status);
  return{access,active,trial};
}

export function canUseFeature(entitlement,feature){
  if(entitlement?.active)return true;
  if(!entitlement?.trial)return false;
  return TRIAL_FEATURES.has(feature);
}

export function premiumRedirect(feature){
  const params=new URLSearchParams({locked:"premium",feature:String(feature||"")});
  return `/comprar?${params.toString()}`;
}
