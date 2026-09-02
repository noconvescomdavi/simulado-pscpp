export function Nav(){
  return (
    <header className="siteHeader">
      <div className="siteHeaderInner">
        <a className="siteBrand" href="/" aria-label="ESTIBORDO - Início">
          <img src="/estibordo/logos/estibordo-logo-horizontal.svg" alt="ESTIBORDO — Preparação para a Praticagem"/>
        </a>

        <nav className="mainMenu" aria-label="Navegação principal">
          <a href="/area-do-aluno">Área do aluno</a>
          <a href="/simulado">Simulados</a>
          <a href="/area-do-aluno#disciplinas">Disciplinas</a>
          <a href="/area-do-aluno#desempenho">Desempenho</a>
        </nav>

        <div className="headerActions">
          <a className="headerLogin" href="/login">Entrar</a>
          <a className="headerCta" href="/cadastro">Começar agora</a>
        </div>
      </div>
    </header>
  )
}

export function Footer(){
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div className="footerBrand">
          <img src="/estibordo/logos/estibordo-logo-horizontal.svg" alt="ESTIBORDO"/>
          <p>Conhecimento no rumo da Praticagem.</p>
          <div className="hotelSignature" aria-label="Bandeira Hotel">
            <span></span><span></span>
          </div>
        </div>

        <div className="footerColumn">
          <strong>Plataforma</strong>
          <a href="/area-do-aluno">Área do aluno</a>
          <a href="/simulado">Simulados</a>
          <a href="/login">Entrar</a>
          <a href="/cadastro">Criar conta</a>
        </div>

        <div className="footerColumn">
          <strong>Preparação PSCPP</strong>
          <a href="/area-do-aluno#disciplinas">Disciplinas</a>
          <a href="/area-do-aluno#ripeam">RIPEAM</a>
          <a href="/area-do-aluno#cis">Código Internacional de Sinais</a>
          <a href="/area-do-aluno#desempenho">Desempenho</a>
        </div>

        <div className="footerColumn">
          <strong>ESTIBORDO</strong>
          <p>Plataforma independente de estudos para preparação ao PSCPP.</p>
        </div>
      </div>
      <div className="footerBottom">
        <span>© ESTIBORDO</span>
        <span>Preparação para a Praticagem</span>
      </div>
    </footer>
  )
}