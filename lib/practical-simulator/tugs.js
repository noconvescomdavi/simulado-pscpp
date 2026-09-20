export const TUG_POSITIONS=["PORT BOW","STBD BOW","PORT QUARTER","STBD QUARTER"];
export function tugForce(tugs=[]){return tugs.filter(t=>t.connected).reduce((a,t)=>{const sign=t.position.includes("PORT")?-1:1,force=(t.power||0)/100;return{yaw:a.yaw+sign*force*(t.mode==="PULL"?1:-1),surge:a.surge+(t.mode==="PULL"?-.15:.1)*force}}, {yaw:0,surge:0})}
export function newTug(id,position,bp=60){return{id,name:`TUG ${id}`,position,bp,power:0,mode:"PUSH",connected:false}}
