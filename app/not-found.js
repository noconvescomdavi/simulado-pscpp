import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page} data-estibordo-not-found>
      <section className={styles.card}>
        <div className={styles.compass} aria-hidden="true"><span>404</span><i /></div>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>ROTA NÃO ENCONTRADA</span>
          <h1>Essa página saiu da rota.</h1>
          <p>O endereço pode ter mudado, sido removido ou estar incompleto. Use uma das rotas seguras abaixo para continuar navegando na ESTIBORDO.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/">Voltar ao início</a>
            <a href="/area-do-aluno">Área do aluno</a>
            <a href="/suporte">Suporte</a>
          </div>
          <small>Erro 404 · ESTIBORDO</small>
        </div>
      </section>
    </main>
  );
}
