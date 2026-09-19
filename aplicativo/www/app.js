(() => {
  const app = document.getElementById("app");
  const state = {
    online: navigator.onLine,
    manifest: null,
    questions: 0,
    models: 0,
    flashcards: 0,
  };

  async function boot() {
    try {
      const manifest = await fetch("./content/manifest.json", { cache: "no-store" }).then(r => r.json());
      state.manifest = manifest;
      state.questions = Number(manifest?.questions?.count || 0);
      state.models = Number(manifest?.models?.count || 0);
      state.flashcards = Number(manifest?.flashcards?.count || 0);
    } catch {}
    render();
    auth();
  }

  async function auth(){
    if(await EstibordoLocal.get("auth_token"))return;
    const main=document.querySelector(".shell"); if(!main)return;
    main.insertAdjacentHTML("afterbegin",`<section class="hero" id="login"><p class="eyebrow">CONTA</p><h2>Entrar</h2><p>Entre uma vez com internet. Depois, o estudo instalado continua disponível sem conexão.</p><input id="email" type="email" autocomplete="email" placeholder="E-mail"><input id="password" type="password" autocomplete="current-password" placeholder="Senha"><button id="loginBtn">Entrar</button><p id="loginError"></p></section>`);
    document.getElementById("loginBtn").onclick=async()=>{const b=document.getElementById("loginBtn"),e=document.getElementById("loginError");b.disabled=true;e.textContent="";try{await EstibordoLocal.login(document.getElementById("email").value,document.getElementById("password").value);document.getElementById("login").remove()}catch(x){e.textContent=x.message}finally{b.disabled=false}};
  }

  function render() {
    app.innerHTML = `
      <main class="shell">
        <header><div><small>ESTIBORDO</small><h1>Área do Aluno</h1></div></header>
        <section class="hero">
          <p class="eyebrow">APP LOCAL</p>
          <h2>Seu estudo continua mesmo sem internet.</h2>
          <p>Questões, simulados, cadernos, flashcards e recursos de estudo ficam disponíveis diretamente no aparelho.</p>
        </section>
        <section class="grid">
          <a class="card" href="./study.html?mode=questions"><b>Banco de Questões</b><span>${state.questions.toLocaleString("pt-BR")} questões locais</span></a>
          <a class="card" href="./study.html?mode=notebook"><b>Novo Caderno</b><span>Gerado no próprio aparelho</span></a>
          <a class="card" href="./study.html?mode=exam"><b>Novo Simulado</b><span>Funciona sem conexão</span></a>
          <a class="card" href="./flashcards.html"><b>Flashcards</b><span>Conteúdo e progresso locais</span></a>
          <a class="card" href="./laboratorio.html"><b>Laboratório 3D</b><span>${state.models} modelos instalados</span></a>
          <a class="card" href="./plano.html"><b>Plano de Estudos</b><span>Tarefas salvas no dispositivo</span></a>
        </section>
      </main>`;
  }

  window.addEventListener("online", () => { state.online = true; });
  window.addEventListener("offline", () => { state.online = false; });
  boot();
})();