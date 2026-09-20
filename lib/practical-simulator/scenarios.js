export const CHARTS=["1511","1512","1515"];
export const SCENARIOS=[
{id:"GUA-01",name:"Barra → Porto do Rio de Janeiro",charts:CHARTS,task:"Inbound pilotage"},
{id:"GUA-02",name:"Barra → TECON",charts:CHARTS,task:"Inbound + berthing"},
{id:"GUA-03",name:"Barra → Terminal GNL",charts:CHARTS,task:"Inbound + berthing"},
{id:"GUA-04",name:"Barra → Terminal Ro-Ro",charts:CHARTS,task:"Inbound + berthing"},
{id:"GUA-05",name:"Barra → Terminal Petroquímico",charts:CHARTS,task:"Inbound + berthing"},
{id:"GUA-06",name:"Barra → Fundeio 6A",charts:CHARTS,task:"Inbound + anchoring"},
{id:"GUA-07",name:"Barra → Fundeio 7",charts:CHARTS,task:"Inbound + anchoring"},
{id:"GUA-08",name:"Barra → Fundeio 8",charts:CHARTS,task:"Inbound + anchoring"},
{id:"GUA-09",name:"Barra → Fundeio 9",charts:CHARTS,task:"Inbound + anchoring"},
{id:"GUA-10",name:"Barra → Fundeio 10",charts:CHARTS,task:"Inbound + anchoring"}];
export function seededScenario(seed=1){let x=(seed>>>0)||1;const next=()=>((x=(1664525*x+1013904223)>>>0)/4294967296);return {windDir:Math.round(next()*359),wind:8+Math.round(next()*14),currentDir:Math.round(next()*359),current:+(.3+next()*.9).toFixed(1)}}
