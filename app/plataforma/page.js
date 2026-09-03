import { Nav, Footer } from "../components";
import "./plataforma.css";

const features = [
  {
    icon: "⌕",
    title: "Banco de Questões",
    text: "Pratique com questões organizadas por disciplina e tópico. Identifique seus erros e transforme cada resposta em aprendizado.",
    stat: "+17 mil",
    statLabel: "questões disponíveis",
  },
  {
    icon: "▣",
    title: "Simulados Semanais",
    text: "Coloque seu conhecimento à prova em simulados on-line, com tempo, correção e análise do seu desempenho.",
    stat: "1x",
    statLabel: "novo desafio por semana",
  },
  {
    icon: "✦",
    title: "Mapas Mentais",
    text: "Revise assuntos complexos de forma visual, conectando conceitos e acelerando a memorização.",
    stat: "Visual",
    statLabel: "aprendizado por conexões",
  },
  {
    icon: "▤",
    title: "Flashcards",
    text: "Reforce os pontos que precisam permanecer na memória com revisões rápidas, objetivas e recorrentes.",
    stat: "Rápido",
    statLabel: "para revisar onde estiver",
  },
];

const pillars = [
  ["01", "Estude", "Conteúdo organizado para você saber exatamente o que estudar."],
  ["02", "Pratique", "Questões e simulados para transformar teoria em desempenho."],
  ["03", "Revise", "Mapas mentais e flashcards para consolidar o conhecimento."],
  ["04", "Acompanhe", "Veja sua evolução e descubra onde precisa corrigir o rumo."],
];

function MiniQuestion() {
  return (
    <div className="platform-window question-window">
      <div className="window-top"><span>Questões</span><span>1 / 20</span></div>
      <div className="question-topic">MANOBRABILIDADE</div>
      <h4>Em uma manobra de aproximação ao cais, a ação do rebocador deve considerar principalmente:</h4>
      <div className="answer correct"><span>A</span> o efeito combinado de vento, corrente e seguimento do navio.</div>
      <div className="answer"><span>B</span> somente a velocidade do vento.</div>
      <div className="answer"><span>C</span> apenas o calado da embarcação.</div>
      <div className="answer"><span>D</span> somente o tipo de hélice.</div>
      <div className="question-footer"><small>Resposta registrada</small><b>Próxima questão →</b></div>
    </div>
  );
}

function MiniDashboard() {
  return (
    <div className="platform-window dashboard-window">
      <div className="dash-top">
        <div><small>ÁREA DO ALUNO</small><strong>Olá, futuro Prático.</strong></div>
        <div className="avatar">D</div>
      </div>
      <div className="dash-metrics">
        <div><small>QUESTÕES</small><b>2.458</b><span>respondidas</span></div>
        <div><small>SIMULADOS</small><b>24</b><span>realizados</span></div>
        <div><small>APROVEITAMENTO</small><b>72%</b><span>média geral</span></div>
      </div>
      <div className="chart-card">
        <div><strong>Evolução de desempenho</strong><span>últimas semanas</span></div>
        <div className="chart">
          <i style={{height:"34%"}}></i><i style={{height:"46%"}}></i><i style={{height:"42%"}}></i>
          <i style={{height:"58%"}}></i><i style={{height:"63%"}}></i><i style={{height:"71%"}}></i>
          <i style={{height:"82%"}}></i><i style={{height:"91%"}}></i>
        </div>
      </div>
    </div>
  );
}

export default function PlataformaPage() {
  return (
    <>
      <Nav />

      <main className="platform-page">
        <section className="platform-hero">
          <div className="platform-hero-inner">
            <div className="platform-hero-copy">
              <div className="platform-eyebrow">CONHEÇA A PLATAFORMA</div>
              <h1>Tudo o que você precisa para <em>ser aprovado no PSCPP.</em></h1>
              <p>
                Uma plataforma criada para transformar estudo em desempenho.
                Pratique, revise, acompanhe sua evolução e corrija o rumo sempre
                que precisar.
              </p>

              <div className="hero-stats">
                <div><b>+17 mil</b><span>questões</span></div>
                <div><b>7</b><span>disciplinas</span></div>
                <div><b>Semanal</b><span>simulados</span></div>
              </div>

              <div className="hero-actions">
                <a className="platform-btn platform-btn-primary" href="/cadastro">Começar agora <span>→</span></a>
                <a className="platform-btn platform-btn-ghost" href="#recursos">Conhecer recursos</a>
              </div>
            </div>

            <div className="hero-visual" aria-label="Prévia da plataforma">
              <div className="nautical-ring"></div>
              <div className="hero-compass">✦</div>
              <div className="hero-card hero-card-main">
                <div className="hero-card-head"><span>SEU DESEMPENHO</span><b>PSCPP</b></div>
                <div className="hero-score">72<span>%</span></div>
                <div className="score-line"><i></i></div>
                <div className="hero-card-bottom"><span>+8% este mês</span><span>Em evolução</span></div>
              </div>
              <div className="floating-card floating-one"><small>QUESTÕES RESPONDIDAS</small><strong>2.458</strong><span>↑ 14% este mês</span></div>
              <div className="floating-card floating-two"><small>PRÓXIMO SIMULADO</small><strong>DOM • 09:00</strong><span>Novo desafio disponível</span></div>
              <div className="wave-line"></div>
            </div>
          </div>
        </section>

        <section className="platform-intro" id="recursos">
          <div className="section-kicker">RECURSOS QUE FAZEM A DIFERENÇA</div>
          <h2>Estude de forma ativa.<br /><span>Aprenda de verdade.</span></h2>
          <p className="section-lead">
            Não é apenas um banco de questões. É um ambiente de preparação pensado
            para acompanhar toda a sua jornada até a prova.
          </p>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <div className="feature-stat"><b>{feature.stat}</b><span>{feature.statLabel}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="practice-section">
          <div className="practice-copy">
            <div className="section-kicker light">BANCO DE QUESTÕES</div>
            <h2>Questão após questão,<br /><span>você fica mais preparado.</span></h2>
            <p>
              Resolva questões por disciplina, assunto e módulo. Depois de responder,
              entenda o erro, revise a explicação e volte ao conteúdo que precisa de atenção.
            </p>
            <ul>
              <li>Prática direcionada por conteúdo</li>
              <li>Correção e comentários</li>
              <li>Histórico de desempenho</li>
              <li>Identificação dos seus pontos fracos</li>
            </ul>
            <a className="platform-btn platform-btn-light" href="/cadastro">Quero praticar <span>→</span></a>
          </div>
          <div className="question-stage"><MiniQuestion /></div>
        </section>

        <section className="weekly-section">
          <div className="weekly-visual">
            <div className="timer-card">
              <small>SIMULADO SEMANAL</small>
              <strong>03 : 12 : 45 : 22</strong>
              <span>dias&nbsp;&nbsp;&nbsp; horas&nbsp;&nbsp; min&nbsp;&nbsp; seg</span>
              <div className="timer-progress"><i></i></div>
              <b>Próximo desafio disponível</b>
            </div>
            <div className="weekly-badge">NOVO<br />TODA<br />SEMANA</div>
          </div>
          <div className="weekly-copy">
            <div className="section-kicker">SIMULADOS ON-LINE</div>
            <h2>Toda semana,<br /><span>um novo desafio.</span></h2>
            <p>
              Simule a pressão da prova antes do grande dia. Controle o tempo,
              responda sem interrupções e descubra como está seu desempenho.
            </p>
            <div className="mini-benefits">
              <span>Tempo controlado</span>
              <span>Correção automática</span>
              <span>Resultado por disciplina</span>
            </div>
          </div>
        </section>

        <section className="study-tools">
          <div className="tools-copy">
            <div className="section-kicker">REVISÃO INTELIGENTE</div>
            <h2>Memorize o que importa.<br /><span>Revise quando precisar.</span></h2>
            <p>
              Mapas mentais e flashcards entram no momento certo: depois da prática,
              para consolidar os conceitos e manter na memória aquilo que realmente importa.
            </p>
            <div className="tool-pills"><span>Mapas Mentais</span><span>Flashcards</span><span>Revisão rápida</span></div>
          </div>
          <div className="memory-visual">
            <div className="mind-map">
              <div className="mind-center">PSCPP</div>
              <i className="node node-a">RIPEAM</i>
              <i className="node node-b">NAVEGAÇÃO</i>
              <i className="node node-c">MANOBRA</i>
              <i className="node node-d">LEGISLAÇÃO</i>
              <span className="connector c-a"></span><span className="connector c-b"></span>
              <span className="connector c-c"></span><span className="connector c-d"></span>
            </div>
            <div className="flashcard-mini"><small>FLASHCARD</small><strong>O que significa a marca de tope de uma marca lateral?</strong><span>Toque para revelar</span></div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-copy">
            <div className="section-kicker light">PLATAFORMA COMPLETA</div>
            <h2>Tudo em um só lugar,<br /><span>do seu jeito.</span></h2>
            <p>
              Sua preparação deixa de ser uma coleção de materiais e passa a ter
              direção. Acompanhe o que já fez, o que precisa revisar e como seu
              desempenho está evoluindo.
            </p>
            <div className="check-list">
              <span>Acesse de qualquer dispositivo</span>
              <span>Acompanhe seu desempenho</span>
              <span>Organize sua rotina de estudos</span>
              <span>Tenha seu progresso salvo</span>
            </div>
          </div>
          <div className="dashboard-stage">
            <MiniDashboard />
            <div className="phone-window">
              <div className="phone-notch"></div>
              <small>QUESTÃO 12</small>
              <strong>Quem é responsável pela segurança da navegação?</strong>
              <div className="phone-option">A&nbsp;&nbsp; O Comandante</div>
              <div className="phone-option">B&nbsp;&nbsp; O Prático</div>
              <div className="phone-option">C&nbsp;&nbsp; O Armador</div>
            </div>
          </div>
        </section>

        <section className="method-section">
          <div className="section-kicker">UM MÉTODO PARA QUEM LEVA A APROVAÇÃO A SÉRIO</div>
          <h2>Seu estudo precisa ter <span>rumo.</span></h2>
          <p className="section-lead">A plataforma foi pensada para fechar o ciclo completo da preparação.</p>
          <div className="method-grid">
            {pillars.map(([number, title, text]) => (
              <div className="method-item" key={number}>
                <b>{number}</b><h3>{title}</h3><p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta-inner">
            <div className="anchor-mark">⚓</div>
            <div className="section-kicker light">SEU PRÓXIMO PASSO</div>
            <h2>Sua aprovação começa <span>aqui.</span></h2>
            <p>Embarque nessa jornada com uma preparação que entende o caminho.</p>
            <a className="platform-btn platform-btn-white" href="/cadastro">Quero ser aprovado <span>→</span></a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
