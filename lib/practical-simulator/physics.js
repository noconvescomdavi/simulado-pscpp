export const ENGINE_TARGETS={"Full Astern":-6,"Half Astern":-4,"Slow Astern":-2.5,"Dead Slow Astern":-1.2,Stop:0,"Dead Slow Ahead":2,"Slow Ahead":4,"Half Ahead":8,"Full Ahead":12};
export function norm360(v){return (v%360+360)%360}
export function angleDelta(a,b){return ((a-b+540)%360)-180}
export function squatMeters(speedKn,block=.72,depth=20){const v=Math.max(0,speedKn);const confinement=Math.max(.75,20/Math.max(8,depth));return Math.min(2.8,(block*v*v/110)*confinement)}
export function stepVessel(s,ship,dt=1,external={yaw:0,surge:0}){
 const target=(ENGINE_TARGETS[s.engine]??0)+(external.surge||0), accel=(target-s.stw)*.018;
 const stw=s.stw+accel*dt, turnGain=Math.max(.15,Math.min(1.15,Math.abs(stw)/8));
 const rot=(s.rudder/35)*2.1*turnGain+(external.yaw||0)*.35, hdg=norm360(s.hdg+rot*dt/60);
 const hr=hdg*Math.PI/180, cr=s.currentDir*Math.PI/180;
 const east=stw*Math.sin(hr)+s.current*Math.sin(cr), north=stw*Math.cos(hr)+s.current*Math.cos(cr);
 const sog=Math.hypot(east,north),cog=norm360(Math.atan2(east,north)*180/Math.PI);
 const nm=sog*dt/3600, lat=s.lat+(nm*Math.cos(cog*Math.PI/180))/60, lon=s.long+(nm*Math.sin(cog*Math.PI/180))/(60*Math.cos(s.lat*Math.PI/180));
 return {...s,lat,long:lon,hdg,cog,sog,stw,rot};
}