
const THEME_KEY="pscpp:theme";
const themeBtn=document.querySelector("#themeBtn");
const savedTheme=localStorage.getItem(THEME_KEY);
if(savedTheme) document.documentElement.dataset.theme=savedTheme;
function paintTheme(){if(themeBtn) themeBtn.textContent=document.documentElement.dataset.theme==="dark"?"☀️":"🌙";}
paintTheme();
themeBtn?.addEventListener("click",()=>{
  document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark";
  localStorage.setItem(THEME_KEY,document.documentElement.dataset.theme); paintTheme();
});

const subject=document.body.dataset.subject;
if(subject){
  const key=`pscpp:progress:${subject}`;
  const checked=new Set(JSON.parse(localStorage.getItem(key)||"[]"));
  const checks=[...document.querySelectorAll(".study-check")];
  checks.forEach(c=>{
    c.checked=checked.has(c.dataset.id);
    c.addEventListener("change",()=>{
      c.checked?checked.add(c.dataset.id):checked.delete(c.dataset.id);
      localStorage.setItem(key,JSON.stringify([...checked]));updateProgress();
    });
  });
  function updateProgress(){
    const done=checks.filter(c=>c.checked).length, total=checks.length;
    const pct=total?Math.round(done/total*100):0;
    const fill=document.querySelector(".progress-fill"),txt=document.querySelector(".progress-text");
    if(fill) fill.style.width=pct+"%";
    if(txt) txt.textContent=`${done}/${total} · ${pct}%`;
  }
  updateProgress();

  const search=document.querySelector("#topicSearch");
  search?.addEventListener("input",()=>{
    const q=search.value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
    let visible=0;
    document.querySelectorAll(".top-topic").forEach(box=>{
      const hay=box.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
      const show=!q||hay.includes(q);box.classList.toggle("hidden",!show);if(show){visible++; if(q)box.open=true;}
    });
    document.querySelector("#noResults")?.classList.toggle("hidden",visible>0);
  });
  document.querySelector("#expandAll")?.addEventListener("click",()=>document.querySelectorAll(".top-topic:not(.hidden)").forEach(d=>d.open=true));
  document.querySelector("#collapseAll")?.addEventListener("click",()=>document.querySelectorAll(".top-topic").forEach(d=>d.open=false));
}
