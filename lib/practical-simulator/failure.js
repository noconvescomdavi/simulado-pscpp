export const CRITICAL_ERRORS={GROUNDING:"Grounding",COLLISION:"Collision",ALLISION:"Allision"};
export function assessmentFailure(code,at,state){return{disqualified:true,scoreSection:0,code,label:CRITICAL_ERRORS[code]||code,at,state:{lat:state.lat,lon:state.lon,hdg:state.hdg,cog:state.cog,sog:state.sog,depth:state.depth}}}
