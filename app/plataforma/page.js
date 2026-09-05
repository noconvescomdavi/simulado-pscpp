import { Nav, Footer } from "../components";
import "./plataforma.css";

const resources = [
  ["Plano de Estudos Inteligente","Organiza sua preparação até a prova, distribui matérias e capítulos da bibliografia ao longo das semanas e acompanha o que já foi concluído.","/area-do-aluno"],
  ["Banco de Questões","Pratique por disciplina e assunto, monte cadernos e use seus erros para decidir o que precisa voltar para a revisão.","/produtos/banco-de-questoes"],
  ["Simulados","Treine com tempo, registre tentativas e acompanhe seu desempenho em condições mais próximas da prova.","/produtos/simulados"],
  ["Flashcards","Revise conceitos, regras, sinais e definições por recuperação ativa, sem depender apenas de releitura.","/produtos/flashcards-mapas-mentais"],
  ["Mapas Mentais","Organize tópicos, subtópicos e conexões entre conceitos para enxergar assuntos complexos com mais clareza.","/produtos/flashcards-mapas-mentais"],
  ["Revisão Inteligente","Transforme resultados em revisão: volte aos assuntos que realmente estão escapando da memória.","/revisao-inteligente"],
  ["Análise de Fraquezas","Descubra em quais matérias e tópicos seu desempenho está mais baixo para concentrar melhor o tempo de estudo.","/analise-de-fraquezas"],
  ["Painel de Desempenho","Acompanhe aproveitamento, histórico de tentativas, evolução e indicadores da sua preparação.","/area-do-aluno"],
  ["Ranking","Use metas, consistência e evolução como estímulo para manter a preparação ativa ao longo do tempo.","/ranking"],
  ["Conteúdo e Bibliografia","Mantenha o estudo conectado às disciplinas, capítulos e referências que estruturam sua preparação para o PSCPP.","/conteudos"]
];

const method = [
  ["01","Planeje","Saiba o que estudar, em que ordem e como distribuir a bibliografia dentro do tempo disponível."],
  ["02","Estude","Avance pelas matérias e capítulos com uma rotina clara e registre o que já foi concluído."],
  ["03","Pratique","Resolva questões e simulados para descobrir se o conteúdo realmente foi assimilado."],
  ["04","Analise","Use desempenho, erros recorrentes e pontos fracos para enxergar onde você está perdendo rendimento."],
  ["05","Revise","Volte aos conteúdos certos com flashcards, mapas mentais e revisão direcionada."],
  ["06","Ajuste o rumo","Atualize a preparação conforme sua evolução, em vez de seguir um cronograma rígido que ignora seu desempenho."]
];

function MiniQuestion(){
  return <div className="platform-window question-window">
    <div className="window-top"><span>Banco de Questões</span><span>12 / 30</span></div>
    <div className="question-topic">NAVEGAÇÃO EM ÁGUAS RESTRITAS</div>
    <h4>Depois de estudar um assunto, a plataforma ajuda você a testar se realmente consegue aplicá-lo.</h4>
    <div className="answer correct"><span>A</span> Responder, corrigir e revisar o ponto necessário.</div>
    <div className="answer"><span>B</span> Apenas reler o mesmo capítulo várias vezes.</div>
    <div className="answer"><span>C</span> Avançar sem verificar o desempenho.</div>
    <div className="question-footer"><small>Resposta registrada</small><b>Continuar →</b></div>
  </div>
}

function MiniDashboard(){
  return <div className="platform-window dashboard-window">
    <div className="dash-top"><div><small>ÁREA DO ALUNO</small><strong>Seu estudo em uma leitura rápida.</strong></div><div className="avatar">E</div></div>
    <div className="dash-metrics">
      <div><small>QUESTÕES</small><b>2.458</b><span>respondidas</span></div>
      <div><small>SIMULADOS</small><b>24</b><span>realizados</span></div>
      <div><small>APROVEITAMENTO</small><b>72%</b><span>média geral</span></div>
    </div>
    <div className="chart-card"><div><strong>Evolução de desempenho</strong><span>últimas semanas</span></div><div className="chart"><i style={{height:"34%"}}></i><i style={{height:"46%"}}></i><i style={{height:"42%"}}></i><i style={{height:"58%"}}></i><i style={{height:"63%"}}></i><i style={{height:"71%"}}></i><i style={{height:"82%"}}></i><i style={{height:"91%"}}></i></div></div>
  </div>
}

export const metadata={
  title:"Conheça a Plataforma | ESTIBORDO",
  description:"Conheça as ferramentas da ESTIBORDO para organizar, praticar, revisar e acompanhar sua preparação para o PSCPP."
};

export default function PlataformaPage(){
  return <><Nav/><main className="platform-page">

    <section className="platform-hero">
      <div className="platform-hero-inner">
        <div className="platform-hero-copy">
          <div className="platform-eyebrow">PLATAFORMA DE PREPARAÇÃO PARA O PSCPP</div>
          <h1>Sua preparação inteira, <em>no mesmo rumo.</em></h1>
          <p>Planeje o que estudar, acompanhe a bibliografia, pratique com questões e simulados, revise seus pontos fracos e veja sua evolução sem precisar montar esse sistema sozinho.</p>
          <div className="hero-benefit-row"><span>✓ Planejamento</span><span>✓ Prática</span><span>✓ Revisão</span><span>✓ Desempenho</span></div>
          <div className="hero-actions"><a className="platform-btn platform-btn-primary" href="/cadastro">Começar minha preparação <span>→</span></a><a className="platform-btn platform-btn-ghost" href="#todas-as-ferramentas">Ver todas as ferramentas</a></div>
        </div>
        <div className="hero-visual" aria-label="Prévia da plataforma">
          <div className="nautical-ring"></div><div className="hero-compass">✦</div>
          <div className="hero-card hero-card-main"><div className="hero-card-head"><span>SEU DESEMPENHO</span><b>PSCPP</b></div><div className="hero-score">72<span>%</span></div><div className="score-line"><i></i></div><div className="hero-card-bottom"><span>evolução registrada</span><span>próximo passo definido</span></div></div>
          <div className="floating-card floating-one"><small>PLANO DE ESTUDOS</small><strong>Hoje</strong><span>3 tarefas planejadas</span></div>
          <div className="floating-card floating-two"><small>REVISÃO</small><strong>5 tópicos</strong><span>priorizados pelo desempenho</span></div><div className="wave-line"></div>
        </div>
      </div>
    </section>

    <section className="platform-value">
      <div className="value-inner"><div><div className="section-kicker">O PROBLEMA NÃO É SÓ TER MATERIAL</div><h2>É saber o que fazer com tudo o que precisa ser estudado.</h2></div><p>Uma preparação longa pode virar uma mistura de PDFs, marcações, planilhas, questões soltas e revisões sem prioridade. A ESTIBORDO organiza essas etapas para que você consiga enxergar o que já avançou e qual deve ser o próximo movimento.</p></div>
    </section>

    <section className="platform-intro" id="todas-as-ferramentas">
      <div className="section-kicker">TUDO EM UM SÓ LUGAR</div>
      <h2>Ferramentas diferentes.<br/><span>Uma única preparação.</span></h2>
      <p className="section-lead">Cada recurso existe para resolver uma parte da jornada: organizar, estudar, testar, revisar ou medir sua evolução.</p>
      <div className="resource-grid">{resources.map(([title,text,href],i)=><article className="resource-card" key={title}><div className="resource-number">{String(i+1).padStart(2,"0")}</div><h3>{title}</h3><p>{text}</p><a href={href}>Conhecer recurso →</a></article>)}</div>
    </section>

    <section className="plan-section">
      <div className="plan-copy"><div className="section-kicker light">PLANO DE ESTUDOS INTELIGENTE</div><h2>Abra a plataforma e saiba <span>o que estudar hoje.</span></h2><p>O planejamento deixa de ser uma lista solta. A ideia é organizar sua preparação ao longo do tempo, conectar matérias à bibliografia e permitir que você marque o que já foi concluído.</p><ul><li>Planejamento semanal</li><li>Matérias e capítulos definidos</li><li>Bibliografia integrada</li><li>Confirmação de leitura e conclusão</li><li>Ajuste conforme o estágio do aluno</li><li>Visão da preparação até a prova</li></ul><a className="platform-btn platform-btn-light" href="/cadastro">Quero estudar com um plano <span>→</span></a></div>
      <div className="plan-board"><div className="plan-board-top"><span>SEMANA ATUAL</span><b>Plano de Estudos</b></div><div className="plan-task done"><i>✓</i><div><strong>Manobrabilidade do Navio</strong><small>Capítulo concluído</small></div></div><div className="plan-task"><i>2</i><div><strong>Navegação em Águas Restritas</strong><small>Leitura + 25 questões</small></div></div><div className="plan-task"><i>3</i><div><strong>Legislação e Regulamentação</strong><small>Revisão programada</small></div></div><div className="plan-progress"><span>Progresso da semana</span><b>67%</b><div><i></i></div></div></div>
    </section>

    <section className="practice-section">
      <div className="practice-copy"><div className="section-kicker light">BANCO DE QUESTÕES</div><h2>Depois de estudar,<br/><span>descubra o que realmente ficou.</span></h2><p>Use a prática para sair da sensação de “acho que aprendi”. Resolva, corrija, identifique o motivo do erro e volte exatamente ao ponto que precisa de atenção.</p><ul><li>Questões por disciplina e assunto</li><li>Cadernos personalizados</li><li>Histórico de respostas</li><li>Base para análise de fraquezas</li></ul><a className="platform-btn platform-btn-light" href="/produtos/banco-de-questoes">Conhecer o Banco de Questões <span>→</span></a></div><div className="question-stage"><MiniQuestion/></div>
    </section>

    <section className="weekly-section">
      <div className="weekly-visual"><div className="timer-card"><small>SIMULADO</small><strong>04 : 00 : 00</strong><span>tempo de treino</span><div className="timer-progress"><i></i></div><b>Treine estratégia, ritmo e concentração</b></div><div className="weekly-badge">MODO<br/>PROVA</div></div>
      <div className="weekly-copy"><div className="section-kicker">SIMULADOS</div><h2>Não descubra no dia da prova <span>como você reage ao tempo.</span></h2><p>Simulados ajudam a verificar se o conhecimento permanece disponível quando entram em cena tempo, volume de questões, interpretação e fadiga.</p><div className="mini-benefits"><span>Tempo controlado</span><span>Histórico de tentativas</span><span>Resultado por matéria</span><span>Diagnóstico para revisão</span></div><a className="platform-text-link" href="/produtos/simulados">Ver como funcionam os simulados →</a></div>
    </section>

    <section className="study-tools">
      <div className="tools-copy"><div className="section-kicker">REVISÃO ATIVA</div><h2>Releitura não basta.<br/><span>Você precisa conseguir lembrar.</span></h2><p>Flashcards, mapas mentais e revisão inteligente ajudam a manter o conteúdo acessível e a voltar com mais frequência aos tópicos que estão apresentando dificuldade.</p><div className="tool-pills"><span>Flashcards</span><span>Mapas Mentais</span><span>Revisão Inteligente</span><span>Conexões entre conceitos</span></div></div>
      <div className="memory-visual"><div className="mind-map"><div className="mind-center">PSCPP</div><i className="node node-a">MANOBRA</i><i className="node node-b">NAVEGAÇÃO</i><i className="node node-c">LEGISLAÇÃO</i><i className="node node-d">METEOROLOGIA</i><span className="connector c-a"></span><span className="connector c-b"></span><span className="connector c-c"></span><span className="connector c-d"></span></div><div className="flashcard-mini"><small>FLASHCARD</small><strong>Você consegue responder sem abrir o material?</strong><span>recuperação ativa</span></div></div>
    </section>

    <section className="dashboard-section">
      <div className="dashboard-copy"><div className="section-kicker light">DESEMPENHO E FRAQUEZAS</div><h2>Seu histórico precisa responder:<br/><span>onde devo estudar agora?</span></h2><p>Acompanhar números só faz sentido quando eles ajudam a tomar uma decisão. Use aproveitamento por disciplina, tentativas e erros recorrentes para direcionar as próximas sessões.</p><div className="check-list"><span>Painel de desempenho</span><span>Análise de fraquezas</span><span>Revisão direcionada</span><span>Histórico salvo</span></div></div><div className="dashboard-stage"><MiniDashboard/><div className="phone-window"><div className="phone-notch"></div><small>PONTO DE ATENÇÃO</small><strong>Legislação está abaixo da sua média geral.</strong><div className="phone-option">Revisar assunto</div><div className="phone-option">Gerar questões</div><div className="phone-option">Adicionar ao plano</div></div></div>
    </section>

    <section className="method-section"><div className="section-kicker">COMO AS FERRAMENTAS SE CONECTAM</div><h2>Não é uma coleção de recursos.<br/><span>É um ciclo de preparação.</span></h2><p className="section-lead">O valor aparece quando uma etapa alimenta a seguinte e seu desempenho começa a orientar suas decisões.</p><div className="method-grid method-grid-six">{method.map(([n,t,x])=><div className="method-item" key={n}><b>{n}</b><h3>{t}</h3><p>{x}</p></div>)}</div></section>

    <section className="final-cta"><div className="final-cta-inner"><div className="anchor-mark">⚓</div><div className="section-kicker light">COMECE PELO PRIMEIRO PASSO</div><h2>Organize hoje a preparação que você quer levar <span>até a prova.</span></h2><p>Planejamento, bibliografia, questões, simulados, revisão e desempenho trabalhando juntos no mesmo ambiente.</p><a className="platform-btn platform-btn-white" href="/cadastro">Começar minha preparação <span>→</span></a></div></section>
  </main><Footer/></>
}