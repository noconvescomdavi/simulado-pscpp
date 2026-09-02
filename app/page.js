import {Nav,Footer} from "./components";

const features = [
  {icon:"simulados", title:"Simulados e questões", text:"Treine com foco no formato da prova e acompanhe sua evolução em cada tentativa."},
  {icon:"navegacao", title:"Estudo por disciplina", text:"Organize sua preparação pelas disciplinas do PSCPP e corrija o rumo onde mais precisa."},
  {icon:"cartas", title:"RIPEAM e CIS", text:"Revise regras, luzes, marcas, sinais e o Código Internacional de Sinais em um só ambiente."},
  {icon:"ranking", title:"Desempenho mensurável", text:"Use resultados, acertos, erros, tempo e histórico para transformar estudo em evolução objetiva."}
];

export default function Home(){
  return (
    <>
      <Nav/>

      <main>
        <section className="homeHero">
          <div className="heroChart"></div>
          <div className="heroInner">
            <div className="heroCopy">
              <div className="heroKicker">
                <img src="/estibordo/icons/bandeira-hotel.svg" alt=""/>
                PREPARAÇÃO PARA O PSCPP
              </div>

              <h1>A PRATICAGEM<br/><span>ESTÁ NO SEU RUMO.</span></h1>

              <p className="heroLead">
                Prepare-se para o PSCPP com uma plataforma completa de estudos:
                questões, simulados, disciplinas, RIPEAM, Código Internacional de
                Sinais e acompanhamento de desempenho.
              </p>

              <div className="heroButtons">
                <a className="button buttonPrimary" href="/cadastro">Começar minha preparação</a>
                <a className="button buttonGhost" href="/login">Já sou aluno</a>
              </div>

              <div className="heroTrust">
                <span><b>7</b> disciplinas</span>
                <span><b>RIPEAM + CIS</b> integrados</span>
                <span><b>Progresso</b> salvo</span>
              </div>
            </div>

            <div className="heroVisual">
              <img className="heroBoat" src="/estibordo/symbols/lancha-pilot.svg" alt="Lancha do Prático"/>
              <div className="heroFlag">
                <span></span><span></span>
              </div>
              <div className="heroVisualCaption">
                <small>ESTIBORDO</small>
                <strong>Conhecimento no rumo da Praticagem.</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="statementSection">
          <div className="sectionInner statementGrid">
            <div>
              <div className="sectionEyebrow">CORRIJA O RUMO ANTES DA PROVA.</div>
              <h2>Não estude no escuro.<br/>Saiba onde você precisa evoluir.</h2>
            </div>
            <p>
              A ESTIBORDO foi pensada para transformar horas de estudo em preparação
              mensurável. Treine, identifique seus pontos fracos, revise e volte à prova
              com mais consistência.
            </p>
          </div>
        </section>

        <section className="featuresSection" id="plataforma">
          <div className="sectionInner">
            <div className="sectionHeading">
              <div className="sectionEyebrow">PLATAFORMA DE ESTUDOS</div>
              <h2>Uma preparação completa, em um único rumo.</h2>
              <p>Do conteúdo à simulação, cada ferramenta existe para aproximar você do objetivo.</p>
            </div>

            <div className="featureGrid">
              {features.map(item => (
                <article className="featureCard" key={item.title}>
                  <div className="featureIcon">
                    <img src={`/estibordo/icons/${item.icon}.svg`} alt=""/>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="routeSection">
          <div className="sectionInner routeCard">
            <div className="routeBoatWrap">
              <img src="/estibordo/symbols/lancha-pilot.svg" alt="Lancha PILOT"/>
            </div>
            <div className="routeCopy">
              <div className="sectionEyebrow">SEU OBJETIVO É A PRATICAGEM.</div>
              <h2>Sua preparação é ESTIBORDO.</h2>
              <p>
                Conteúdo organizado, simulados, revisão e desempenho para você estudar
                com método e chegar à prova sabendo exatamente como está sua preparação.
              </p>
              <a className="button buttonPrimary" href="/cadastro">Criar minha conta</a>
            </div>
          </div>
        </section>

        <section className="finalCta">
          <div className="sectionInner finalCtaInner">
            <div className="finalFlag"><span></span><span></span></div>
            <div>
              <div className="sectionEyebrow">RUMO À PRATICAGEM</div>
              <h2>Comece hoje. Corrija o rumo antes da prova.</h2>
            </div>
            <a className="button buttonLight" href="/cadastro">Começar agora</a>
          </div>
        </section>
      </main>

      <Footer/>
    </>
  )
}