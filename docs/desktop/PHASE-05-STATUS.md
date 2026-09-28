# Fase 5 — autenticação e serviços online (gate aberto)

## Implementado nesta etapa

- Login remoto pela API PSCPP com token restrito à sincronização e vinculado ao identificador do dispositivo.
- Validação de versão de sessão e estado da conta a cada sincronização; contas administrativas não entram no desktop.
- Renovação online antes da expiração, armazenamento no cofre do sistema e logout que apaga a credencial.
- Cookie local persistente em HTTP loopback, com validade offline máxima de 30 dias desde a última autenticação online.
- Bloqueio de troca de conta quando há dados locais de outro aluno; isolamento da outbox por usuário.
- Erros da API propagados ao login e timeout explícito para ausência de rede.
- Ambiente do Next local montado por lista explícita, sem herdar `DATABASE_URL` ou segredos de servidor.
- Dashboard do aluno lê progresso e histórico SQLite no desktop.
- Teste grátis e vencimento da licença seguem a mesma regra de entitlement da plataforma web.
- Concessão offline Ed25519 assinada pelo servidor e vinculada à conta/dispositivo; validade de até 30 dias, verificada localmente sem incorporar segredo do servidor ao executável.
- Revogação confirmada por HTTP 401/403 bloqueia a sessão local e mantém a outbox para recuperação após novo login.
- Cadastro e recuperação de senha abrem o serviço HTTPS; login Google e reCAPTCHA não são apresentados como opções do desktop.
- Status de conexão reflete o resultado real da sincronização, sem afirmar `online` antes de sucesso.

## Gate pendente

1. Publicar a branch de trabalho para disponibilizar `/api/desktop/auth` no servidor e executar o gate Windows. O push ao repositório público foi bloqueado pela revisão automática nesta sessão; `main` permanece intacta.
2. Testar login, concessão, revogação, renovação e licença vencida com conta de homologação contra a API HTTPS real. Os testes atuais usam servidor remoto simulado.
3. Executar o instalador atualizado no Windows e validar autenticação inicial, reabertura offline, renovação e logout no aplicativo instalado.

## Escopo das fases seguintes

- Fase 6: migrar simulados, cadernos, respostas, correções e plano para SQLite/JSON; essas rotas ainda utilizam PostgreSQL no Next local.
- Fase 7: integrar `/api/sync/v1` às tabelas canônicas usadas pela plataforma web e testar mudanças originadas no servidor.
- Fase 8: homologar o fluxo completo do aluno online/offline, com instalador Windows e resolução de conflitos.

Os testes locais de SQLite, protocolo, concessão assinada, revogação, runtime Next e reinício offline passaram. A Fase 5 permanece **pendente** até os três gates acima. Não fazer merge em `main` antes da homologação final das Fases 6 a 8.
