export const metadata = {
  title: "Excluir conta",
  description: "Solicite a exclusão da sua conta ESTIBORDO e dos dados associados.",
};

export default function ExcluirContaPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#07141f",
      color: "#f5f7fa",
      padding: "48px 20px",
      fontFamily: "system-ui, sans-serif"
    }}>
      <section style={{
        width: "min(720px, 100%)",
        margin: "0 auto",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 20,
        padding: 28,
        background: "rgba(255,255,255,.04)"
      }}>
        <p style={{letterSpacing: ".12em", fontSize: 12, opacity: .72}}>PRIVACIDADE · ESTIBORDO</p>
        <h1>Excluir minha conta e dados</h1>
        <p>
          A ESTIBORDO permite solicitar a exclusão permanente da conta pela área de perfil.
          Para proteger seus dados, a confirmação exige autenticação, sua senha atual e a palavra EXCLUIR.
        </p>
        <p>
          A exclusão remove dados diretamente identificáveis e dados de aprendizagem quando aplicável.
          Registros financeiros, antifraude, consentimentos e registros de segurança podem ser preservados
          somente quando houver obrigação legal ou necessidade legítima de retenção, conforme a Política de Privacidade.
        </p>
        <div style={{display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24}}>
          <a href="/login?next=/perfil" style={{
            display: "inline-block",
            background: "#f5f7fa",
            color: "#07141f",
            borderRadius: 12,
            padding: "12px 18px",
            textDecoration: "none",
            fontWeight: 700
          }}>Entrar e excluir minha conta</a>
          <a href="/politica-de-privacidade" style={{
            display: "inline-block",
            border: "1px solid rgba(255,255,255,.25)",
            color: "#f5f7fa",
            borderRadius: 12,
            padding: "12px 18px",
            textDecoration: "none"
          }}>Política de Privacidade</a>
        </div>
      </section>
    </main>
  );
}
