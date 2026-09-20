import {squatMeters} from "./physics";
export function navigationSafety({state,ship,xte=0,collisionRisk=false,allisionRisk=false}){
 const squat=squatMeters(state.sog,ship.block||.72,state.depth);
 const ukc=state.depth+state.tide-ship.draft-squat;
 const alarms=[];
 if(ukc<ship.minU) alarms.push({code:"LOW_UKC",severity:ukc<=0?"critical":"warning",message:ukc<=0?"GROUNDING":"LOW UKC"});
 if(state.depth<=ship.draft+1) alarms.push({code:"SHALLOW_WATER",severity:"warning",message:"SHALLOW WATER"});
 if(xte>30) alarms.push({code:"OFF_TRACK",severity:"warning",message:"OFF TRACK"});
 if(collisionRisk) alarms.push({code:"COLLISION",severity:"critical",message:"COLLISION"});
 if(allisionRisk) alarms.push({code:"ALLISION",severity:"critical",message:"ALLISION"});
 const critical=alarms.find(a=>a.severity==="critical");
 return {squat,ukc,alarms,disqualified:Boolean(critical),criticalCode:critical?.code||null};
}