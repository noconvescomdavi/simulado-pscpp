import {Nav,Footer} from "./components";
import home from "../data/site/home.json";

const tools=[
["Plano de Estudos Inteligente","Planejamento até a prova, com rotina semanal, capítulos da bibliografia e progresso marcado como concluído.","/plataforma"],
["Banco de Questões","Pratique por matéria e assunto, monte cadernos e transforme seus erros em revisão direcionada.","/produtos/banco-de-questoes"],
["Simulados","Treine com tempo, acompanhe tentativas e desenvolva ritmo e estratégia para a prova.","/produtos/simulados"],
["Flashcards","Recuperação ativa para manter conceitos, regras, sinais e definições acessíveis na memória.","/produtos/flashcards-mapas-mentais"],
["Mapas Mentais","Organize visualmente assuntos, crie tópicos e conexões e enxergue relações entre conceitos.","/produtos/flashcards-mapas-mentais"],
["Revisão Inteligente","Use seu desempenho para voltar aos conteúdos que realmente precisam ser reforçados.","/revisao-inteligente"],
["Análise de Fraquezas","Identifique matérias e assuntos de menor desempenho para concentrar melhor seu tempo de estudo.","/analise-de-fraquezas"],
["Painel de Desempenho","Acompanhe evolução, aproveitamento e histórico da preparação em uma leitura rápida.","/area-do-aluno"],
["Ranking","Acompanhe sua consistência e use a evolução como estímulo para manter a preparação ativa.","/ranking"],
["Conteúdo e Bibliografia","Mantenha o estudo conectado às disciplinas e às referências bibliográficas da preparação ao PSCPP.","/conteudos"]
];

export default function Home(){
 const features=home.knowledge.features;
 return <><Nav/><main>
  <section className="hero heroEstibordo"><div className="heroChart"></div><div className="heroCompass"></div><div className="heroCopy"><div className="eyebrow">{home.hero.eyebrow}</div><h1><span>{home.hero.titleLine1}</span><br/><span>{home.hero.titleLine2}</span></h1><p>{home.hero.description}</p><div className="heroActions"><a className="btn primary" href="/cadastro">Começar minha preparação</a><a className="btn btnDark home-platform-cta" href="#ferramentas">Ver tudo que a plataforma oferece</a></div><div className="heroTrust"><span>✓ Estudo organizado</span><span>✓ Prática direcionada</span><span>✓ Evolução acompanhada</span></div></div><div className="heroVisual"><div className="hotelFlag"><span></span><span></span></div><img className="heroPortPhoto" src={home.hero.image.src} alt={home.hero.image.alt}/></div></section>

  <section className="homePromise"><div className="homeContainer"><div className="promiseGrid"><div><div className="eyebrow">UMA PREPARAÇÃO DE LONGO PRAZO</div><h2>Você não precisa descobrir sozinho o que estudar, quando revisar e onde precisa melhorar.</h2></div><p>O PSCPP exige constância. A ESTIBORDO reúne em um só lugar as ferramentas para organizar a jornada, estudar a bibliografia, praticar, revisar e acompanhar sua evolução até a prova.</p></div></div></section>

  <section className="homeTools" id="ferramentas"><div className="homeContainer"><div className="sectionIntro"><div className="eyebrow">TUDO EM UM SÓ LUGAR</div><h2>Uma plataforma pensada para acompanhar toda a sua preparação.</h2><p>Da organização do que estudar ao diagnóstico dos seus erros, cada ferramenta tem uma função clara na sua rotina.</p></div><div className="toolGrid">{tools.map(([title,text,href],i)=><article className="toolCard" key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p><a href={href}>Conhecer ferramenta →</a></article>)}</div><div className="toolsCta"><div><strong>Em vez de juntar várias ferramentas separadas, mantenha sua preparação conectada.</strong><p>Seu estudo, suas questões, revisões e desempenho trabalhando no mesmo rumo.</p></div><a className="btn primary" href="/cadastro">Criar minha conta</a></div></div></section>

  <section className="homeCredibility"><div className="homeContainer">
    <div className="credibilityIntro"><div><div className="eyebrow">FEITA PARA O PSCPP</div><h2>Não é uma plataforma genérica de estudos adaptada ao concurso.</h2></div><p>A ESTIBORDO foi estruturada em torno da preparação ao Processo Seletivo à Categoria de Praticante de Prático, conectando bibliografia, planejamento, prática e análise de desempenho em uma mesma jornada.</p></div>
    <div className="credibilityGrid">
      <article><strong>Bibliografia no centro</strong><p>O planejamento e as ferramentas mantêm a preparação vinculada às disciplinas e referências do PSCPP.</p></article>
      <article><strong>Progresso mensurável</strong><p>Questões, simulados, erros e desempenho ajudam a transformar horas de estudo em informação útil para decidir o próximo passo.</p></article>
      <article><strong>Preparação contínua</strong><p>O objetivo não é apenas resolver uma prova isolada, mas sustentar uma rotina de longo prazo até o dia do processo seletivo.</p></article>
    </div>
    <div className="credibilityStrip"><span>PLANEJAR</span><i>→</i><span>ESTUDAR</span><i>→</i><span>PRATICAR</span><i>→</i><span>REVISAR</span><i>→</i><span>MEDIR</span><i>→</i><span>AJUSTAR</span></div>
  </div></section>

  <section className="homeDark"><div className="homeContainer"><div className="sectionIntro"><div className="eyebrow">{home.knowledge.eyebrow}</div><h2>Estude as disciplinas. Treine para dominá-las.</h2><p>Conteúdo técnico, prática e revisão para transformar uma bibliografia extensa em conhecimento que você consegue recuperar quando precisa.</p></div><div className="featureGrid">{features.map(item=><article className="featureCard" key={item.title}><img src={"/estibordo/icones/"+item.icon+".svg"} alt=""/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>

  <section className="dashboardPreview"><div className="homeContainer previewGrid"><div className="previewCopy"><div className="eyebrow">NÃO ESTUDE NO ESCURO</div><h2>Saiba onde você está evoluindo — e onde ainda está perdendo pontos.</h2><p>O painel transforma suas respostas em direção: acompanhe aproveitamento por disciplina e use seus resultados para decidir o próximo passo da preparação.</p><a className="btn primary" href="/cadastro">Quero acompanhar minha evolução</a></div><div className="dashboardMock"><div className="mockTop"><img src="/estibordo/logos/estibordo-logo-final.png" alt="ESTIBORDO"/><span>MEU PERFIL</span></div><div className="mockBody"><div className="readiness"><div className="ring"><b>{home.dashboardPreview.readinessScore}</b><small>{home.dashboardPreview.readinessScale}</small></div><p>{home.dashboardPreview.readinessText}</p></div><div className="performance"><h4>{home.dashboardPreview.performanceTitle}</h4>{home.dashboardPreview.performance.map(({name,value})=><div className="perf" key={name}><span>{name}</span><i><b style={{width:value}}></b></i><strong>{value}</strong></div>)}</div></div></div></div></section>

  <section className="homeJourney"><div className="homeContainer"><div className="sectionIntro"><div className="eyebrow">DO PRIMEIRO DIA ATÉ A PROVA</div><h2>Uma rotina simples para uma preparação que não é simples.</h2></div><div className="journeySteps"><article><b>01</b><h3>Planeje</h3><p>Saiba o que estudar e organize a bibliografia dentro do tempo disponível.</p></article><article><b>02</b><h3>Estude</h3><p>Avance pelas disciplinas e registre o que já foi concluído.</p></article><article><b>03</b><h3>Pratique</h3><p>Resolva questões e simulados para descobrir se o conteúdo realmente foi assimilado.</p></article><article><b>04</b><h3>Corrija o rumo</h3><p>Use erros, fraquezas e desempenho para decidir suas próximas revisões.</p></article></div></div></section>

  <section className="homeDecision"><div className="homeContainer"><div className="decisionBox"><div><div className="eyebrow">CONHEÇA ANTES DE DECIDIR</div><h2>Veja como a ESTIBORDO pode entrar na sua rotina de preparação.</h2><p>Explore a plataforma, conheça as ferramentas e entenda como planejamento, prática, revisão e desempenho trabalham juntos.</p></div><div className="decisionActions"><a className="btn primary" href="/cadastro">Criar minha conta</a><a className="btn decisionSecondary" href="/plataforma">Conhecer a plataforma</a></div></div></div></section>

  <section className="bannerCta"><div className="bannerInner"><div><div className="eyebrow">SE O SEU OBJETIVO É A PRATICAGEM</div><h2><span>Comece a construir hoje</span><br/><span>a preparação que você quer levar até a prova.</span></h2><p className="bannerText">Organização, questões, simulados, revisão e desempenho em um só lugar.</p></div><img src={home.cta.image.src} alt={home.cta.image.alt}/><a className="btn primary" href="/cadastro">Começar minha preparação</a></div></section>
 </main><Footer/></>
}