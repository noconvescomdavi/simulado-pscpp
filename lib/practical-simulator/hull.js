const M_PER_DEG_LAT=111320;
export function hullPolygon(state,ship){const hdg=state.hdg*Math.PI/180,L=ship.loa/2,B=ship.beam/2,latr=state.lat*Math.PI/180;const pts=[[L,B],[L,-B],[-L,-B],[-L,B]];return pts.map(([f,s])=>{const north=f*Math.cos(hdg)-s*Math.sin(hdg),east=f*Math.sin(hdg)+s*Math.cos(hdg);return{lat:state.lat+north/M_PER_DEG_LAT,lon:state.lon+east/(M_PER_DEG_LAT*Math.cos(latr))}})}
function orient(a,b,c){return(b.lon-a.lon)*(c.lat-a.lat)-(b.lat-a.lat)*(c.lon-a.lon)}
function seg(a,b,c,d){const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);return o1*o2<=0&&o3*o4<=0}
export function polygonsIntersect(a,b){for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)if(seg(a[i],a[(i+1)%a.length],b[j],b[(j+1)%b.length]))return true;return false}
export function hullHitsStructures(state,ship,structures=[]){const hull=hullPolygon(state,ship);return structures.find(s=>polygonsIntersect(hull,s.polygon))||null}
