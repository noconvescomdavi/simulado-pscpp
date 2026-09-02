
export function Nav(){
  return (
    <nav className="nav">
      <div className="navin">
        <a className="brand" href="/" aria-label="ESTIBORDO">
          <img src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO — Preparação para a Praticagem"/>
        </a>

        <div className="navmenu">
          <a href="/">Início</a>
          <a href="/area-do-aluno">Questões</a>
          <a href="/simulado">Simulados</a>
          <a href="/area-do-aluno#desempenho">Desempenho</a>
          <a href="/area-do-aluno#ranking">Ranking</a>
          <a href="/area-do-aluno#conteudos">Conteúdos</a>
        </div>

        <div className="links">
          <a href="/login">Entrar</a>
          <a className="primary" href="/cadastro">Meu perfil</a>
        </div>
      </div>
    </nav>
  )
}

export function Footer(){
  return (
    <footer className="footer">
      <div className="footerMain">
        <div className="footerQuote">
          <div className="quoteMark">“</div>
          <strong>Corrija o rumo<br/>antes da prova.</strong>
          <div className="hotelFooter"><span></span><span></span></div>
          <small>ESTIBORDO — PREPARAÇÃO PARA A PRATICAGEM</small>
        </div>

        <div className="footerAbout">
          <h4>SOBRE A PLATAFORMA</h4>
          <p>A ESTIBORDO reúne o que você precisa em um só lugar para estudar com método, treinar com simulados e acompanhar sua evolução até a Praticagem.</p>
          <div className="footerValues">
            <span>◉<small>CONFIANÇA</small></span>
            <span>✦<small>QUALIDADE</small></span>
            <span>⌖<small>FOCO</small></span>
            <span>⊕<small>EVOLUÇÃO</small></span>
          </div>
        </div>

        <div className="footerLinks">
          <h4>DISCIPLINAS</h4>
          <a href="/area-do-aluno#ripeam">⚓ RIPEAM</a>
          <a href="/area-do-aluno">⚓ Navegação</a>
          <a href="/area-do-aluno">⚓ Meteorologia</a>
          <a href="/area-do-aluno">⚓ Estabilidade</a>
          <a href="/area-do-aluno">⚓ Manobra</a>
          <a href="/area-do-aluno">⚓ Legislação</a>
        </div>

        <div className="footerContact">
          <h4>ESTIBORDO</h4>
          <p>Conhecimento no rumo da Praticagem.</p>
          <a href="/login">Entrar na plataforma</a>
          <a href="/cadastro">Criar conta</a>
        </div>
      </div>
      <div className="footerBottom">© ESTIBORDO. Plataforma independente de estudos para o PSCPP.</div>
    </footer>
  )
}
