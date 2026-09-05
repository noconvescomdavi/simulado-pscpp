import {MarketingShell,styles} from "../components/MarketingShell";

export const metadata = {
  title: "Sobre Nós | ESTIBORDO",
  description: "Conheça a história da ESTIBORDO e como uma jornada pessoal de preparação para o PSCPP se transformou em uma plataforma para ajudar outros candidatos."
};

export default function Page(){
  return <MarketingShell
    eyebrow="QUEM SOMOS"
    title="Uma plataforma criada por quem também está nessa jornada."
    lead="A ESTIBORDO nasceu da paixão pelo mar, pela navegação e do sonho de chegar à Praticagem. Um projeto que começou para organizar a minha própria preparação e hoje também ajuda outros candidatos a seguirem o mesmo rumo."
  >
    <section className={styles.section}>
      <span>NOSSA HISTÓRIA</span>
      <h2>Do sonho pessoal a uma preparação compartilhada.</h2>

      <p>Sou Davi, idealizador da ESTIBORDO. Minha história com esse projeto nasceu de algo muito simples: a paixão pelo mar, pela navegação e o sonho de um dia me tornar Prático.</p>

      <p>Quando decidi começar a me preparar para o PSCPP, percebi rapidamente o tamanho desse desafio. É uma preparação extensa, com uma bibliografia técnica enorme, diferentes matérias e muito conteúdo para estudar, revisar e manter na memória ao longo do tempo.</p>

      <p>E foi justamente durante essa caminhada que nasceu a ESTIBORDO.</p>

      <p>Comecei pensando no tipo de preparação que eu gostaria de ter para mim: um lugar onde pudesse organizar meus estudos, resolver questões, fazer simulados, revisar o que já estudei e, principalmente, entender onde estou evoluindo e onde ainda preciso melhorar.</p>

      <div className={styles.quote}>
        Aos poucos, essa ideia deixou de ser apenas uma ferramenta para os meus próprios estudos e passou a ter um propósito maior: ajudar outras pessoas que compartilham o mesmo objetivo.
      </div>

      <p>A ESTIBORDO foi criada para reunir, em um só lugar, ferramentas que tornem essa longa preparação mais organizada, prática e direcionada.</p>

      <p>Eu também estou nessa jornada. Também estudo, reviso a bibliografia, resolvo questões e me preparo para o PSCPP.</p>

      <p>Por isso, quero que a ESTIBORDO continue evoluindo junto com quem estuda por aqui — sempre buscando tornar a preparação para a Praticagem cada vez mais completa.</p>

      <div className={styles.quote}>
        <strong>Porque chegar à Praticagem é um projeto de longo prazo. E uma jornada como essa fica muito melhor quando não precisamos navegar sozinhos.</strong>
      </div>
    </section>

    <section className={styles.section}>
      <span>A ESTIBORDO</span>
      <h2>Ferramentas que eu também gostaria de ter na minha preparação.</h2>
      <p>A proposta é simples: reunir estudo, prática e revisão em um mesmo ambiente, para que seja mais fácil manter a constância e saber onde concentrar os esforços ao longo da preparação.</p>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h3>Banco de Questões</h3>
          <p>Pratique o que acabou de estudar, identifique seus erros e descubra quais assuntos precisam de mais atenção.</p>
          <a href="/produtos/banco-de-questoes">Conhecer o Banco de Questões →</a>
        </article>
        <article className={styles.card}>
          <h3>Simulados</h3>
          <p>Coloque o conhecimento à prova, treine com tempo e acompanhe sua evolução durante a preparação.</p>
          <a href="/produtos/simulados">Conhecer os Simulados →</a>
        </article>
        <article className={styles.card}>
          <h3>Flashcards + Mapas</h3>
          <p>Volte aos pontos importantes da bibliografia e mantenha o conteúdo vivo na memória ao longo dos estudos.</p>
          <a href="/produtos/flashcards-mapas-mentais">Conhecer as ferramentas de revisão →</a>
        </article>
      </div>
    </section>
  </MarketingShell>
}
