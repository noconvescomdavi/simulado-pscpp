
import {Nav,Footer} from "./components";

const features = [
  {icon:"ripeam", title:"RIPEAM", text:"Regras, luzes, marcas, sinais e revisão dirigida."},
  {icon:"navegacao", title:"Navegação", text:"Conteúdo organizado para construir domínio progressivo."},
  {icon:"meteorologia", title:"Meteorologia", text:"Estude fenômenos, interpretação e aplicação prática."},
  {icon:"cartas-nauticas", title:"Cartas Náuticas", text:"Revisão visual e estudo focado em navegação."},
  {icon:"manobra", title:"Manobra", text:"Conceitos essenciais para a preparação ao PSCPP."},
  {icon:"legislacao", title:"Legislação", text:"Conteúdo estruturado e revisão dos pontos críticos."},
  {icon:"simulados", title:"Simulados", text:"Treine sob pressão e registre seu desempenho."},
  {icon:"ranking", title:"Ranking", text:"Acompanhe consistência, evolução e metas pessoais."}
];

export default function Home(){
  return (
    <>
      <Nav/>

      <main>
        <section className="hero heroEstibordo">
          <div className="heroChart"></div>
          <div className="heroCompass"></div>

          <div className="heroCopy">
            <div className="eyebrow">PREPARAÇÃO PARA O PSCPP</div>
            <h1>A PRATICAGEM<br/>ESTÁ NO SEU RUMO.</h1>
            <p>
              Plataforma completa para sua preparação ao PSCPP com questões,
              simulados, desempenho e conteúdo especializado.
            </p>
            <div className="heroActions">
              <a className="btn primary" href="/cadastro">Começar agora</a>
              <a className="btn btnDark" href="/login">Conhecer a plataforma</a>
            </div>

            <div className="heroStats">
              <div><b>17.000+</b><span>QUESTÕES</span></div>
              <div><b>1.200+</b><span>SIMULADOS REALIZADOS</span></div>
              <div><b>20+</b><span>DISCIPLINAS</span></div>
              <div><b>10.000+</b><span>ALUNOS</span></div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="hotelFlag"><span></span><span></span></div>
            <img className="heroPortPhoto" src="/estibordo/imagens/navio-conteineiro-atracando-dois-rebocadores.png" alt="Navio conteineiro atracando com auxílio de dois rebocadores"/>
          </div>
        </section>

        <section className="homeDark">
          <div className="homeContainer">
            <div className="sectionIntro">
              <div className="eyebrow">CONHECIMENTO NO RUMO DA PRATICAGEM.</div>
              <h2>Treine hoje. Seja o Prático de amanhã.</h2>
              <p>Um ecossistema de preparação construído para estudo dirigido, revisão, simulados e análise de desempenho.</p>
            </div>

            <div className="featureGrid">
              {features.map((item) => (
                <article className="featureCard" key={item.title}>
                  <img src={`/estibordo/icones/${item.icon}.svg`} alt=""/>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboardPreview">
          <div className="homeContainer previewGrid">
            <div className="previewCopy">
              <div className="eyebrow">PAINEL DE NAVEGAÇÃO</div>
              <h2>Seu desempenho em uma leitura rápida.</h2>
              <p>Veja prontidão, aproveitamento por disciplina, simulados recentes e pontos que precisam de correção.</p>
              <a className="btn primary" href="/area-do-aluno">Ver meu desempenho</a>
            </div>

            <div className="dashboardMock">
              <div className="mockTop">
                <img src="/estibordo/logos/estibordo-logo-final.png" alt="ESTIBORDO"/>
                <span>MEU PERFIL</span>
              </div>
              <div className="mockBody">
                <div className="readiness">
                  <div className="ring"><b>78</b><small>DE 100</small></div>
                  <p>Você está avançando,<br/>mas ainda existem pontos a corrigir.</p>
                </div>
                <div className="performance">
                  <h4>DESEMPENHO POR DISCIPLINA</h4>
                  {[
                    ["RIPEAM","87%"],["Navegação","81%"],["Meteorologia","73%"],
                    ["Estabilidade","68%"],["Manobra","61%"],["Legislação","54%"]
                  ].map(([name,value],i)=>
                    <div className="perf" key={name}>
                      <span>{name}</span>
                      <i><b style={{width:value}}></b></i>
                      <strong>{value}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bannerCta">
          <div className="bannerInner">
            <div>
              <div className="eyebrow">CORRIJA O RUMO ANTES DA PROVA.</div>
              <h2>Seu objetivo é a Praticagem.<br/>Sua preparação é ESTIBORDO.</h2>
            </div>
            <img src="/estibordo/vetores/lancha-pilot-final.png" alt="Lancha PILOT"/>
            <a className="btn primary" href="/cadastro">Iniciar preparação</a>
          </div>
        </section>
      </main>

      <Footer/>
    </>
  )
}
