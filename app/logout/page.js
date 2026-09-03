import styles from "./logout.module.css";

export default function LogoutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <img
          className={styles.logo}
          src="/estibordo/logos/estibordo-logo-horizontal.svg"
          alt="ESTIBORDO"
        />

        <div className={styles.eyebrow}>ÁREA DO ALUNO</div>

        <h1>Sessão encerrada</h1>

        <p>
          Você saiu do ESTIBORDO com segurança.
        </p>

        <div className={styles.actions}>
          <a className={styles.primary} href="/login">
            Entrar novamente
          </a>

          <a className={styles.secondary} href="/">
            Ir para a página inicial
          </a>
        </div>

        <small>
          Para sua segurança, feche o navegador se estiver utilizando um
          computador compartilhado.
        </small>
      </section>
    </main>
  );
}
