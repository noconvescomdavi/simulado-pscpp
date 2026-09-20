export const RUDDER_ORDERS=[-35,-20,-10,0,10,20,35];
export const ENGINE_ORDERS=["Full Astern","Half Astern","Slow Astern","Dead Slow Astern","Stop","Dead Slow Ahead","Slow Ahead","Half Ahead","Full Ahead"];
export function helmLabel(v){if(v===0)return"MIDSHIPS";return `${v<0?"PORT":"STARBOARD"} ${Math.abs(v)}`}
export function commandLogEntry(type,command,time=new Date()){return{id:`${+time}-${type}`,type,command,time:time.toISOString()}}
