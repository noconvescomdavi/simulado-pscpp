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

## Gate pendente

1. Rotas acadêmicas de simulados, cadernos, respostas, correções e plano ainda utilizam leituras/escritas PostgreSQL no runtime Next local. Migrar esses domínios para SQLite/JSON antes de homologar o uso offline.
2. O protocolo `/api/sync/v1` mantém entidades em `sync_entity_versions`; a experiência web existente usa tabelas específicas. Integrar alterações sincronizadas aos dados canônicos da plataforma e testar alterações originadas no servidor.
3. Testar login e serviços online com conta de homologação, revogação, renovação e acesso expirado contra API HTTPS real.
4. Executar instalador e fluxo de usuário no Windows real: login, fechamento, desconexão total, novo início, simulados/cadernos, reinício, reconexão e conflitos.

Os testes de SQLite, protocolo, ciclo retry/conflito e autenticação mockada não substituem esses gates. Não avançar a fase como aprovada nem fazer merge em `main` até a homologação funcional.
