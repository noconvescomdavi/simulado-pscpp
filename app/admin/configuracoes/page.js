export default function Page(){return <main className="wrap admin-wrap">
  <div className="eyebrow">ADMINISTRAÇÃO</div>
  <h1>Configurações</h1>
  <p>Configurações operacionais da plataforma. Credenciais sensíveis continuam no ambiente da Vercel e não são exibidas aqui.</p>
  <section className="grid">
    <article className="card"><h3>Preços comerciais</h3><p>Edite o preço da assinatura anual e do CONTRAMESTRE. Os novos valores são aplicados automaticamente aos novos checkouts.</p><a className="primary" href="/admin/precos">Gerenciar preços</a></article>
    <article className="card"><h3>Simulados</h3><p>Cadência e comportamento dos desafios.</p><code>EXAM_WEEKLY_INTERVAL_DAYS</code></article>
    <article className="card"><h3>Mercado Pago</h3><p>Credenciais de integração e validação de webhook.</p><code>MERCADO_PAGO_ACCESS_TOKEN</code><br/><br/><code>MERCADO_PAGO_WEBHOOK_SECRET</code></article>
  </section>
</main>}