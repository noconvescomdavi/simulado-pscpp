
const KEY="pscppPortal:theme";
const html=document.documentElement;
const btn=document.querySelector("#themeBtn");
const saved=localStorage.getItem(KEY);
if(saved) html.dataset.theme=saved;

function paint(){
  if(btn) btn.textContent=html.dataset.theme==="dark"?"☀️":"🌙";
}
paint();

if(btn){
  btn.addEventListener("click",()=>{
    html.dataset.theme=html.dataset.theme==="dark"?"light":"dark";
    localStorage.setItem(KEY,html.dataset.theme);
    paint();
  });
}
