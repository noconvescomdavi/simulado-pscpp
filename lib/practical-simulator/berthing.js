import {distanceBearing} from "./navigation";
export function berthMetrics(state,berth){if(!berth)return null;const a=berth.a,b=berth.b,mid={lat:(a.lat+b.lat)/2,lon:(a.lon+b.lon)/2};const range=distanceBearing(state,mid).distance;const bearing=distanceBearing(a,b).bearing;const angle=Math.abs((((state.hdg-bearing)+540)%360)-180);return{range,bearing,angle,approachSpeed:state.sog}}
export function berthStatus(state,berth){const m=berthMetrics(state,berth);if(!m)return{status:"NO_BERTH"};if(m.range<shipLengthSafe(berth)&&m.approachSpeed>1.2)return{...m,status:"EXCESSIVE_APPROACH_SPEED"};if(m.range<20&&m.approachSpeed<.3&&Math.min(m.angle,180-m.angle)<8)return{...m,status:"ALONGSIDE"};return{...m,status:"APPROACHING"}}
function shipLengthSafe(berth){return berth.warningRange||120}
