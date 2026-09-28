# Fase 3 — Gate local-first

## Escopo implementado

- SQLite persistente inicializado pelo processo principal do Electron.
- Ponte HTTP privada em 127.0.0.1, porta efêmera e token aleatório por execução.
- Next standalone acessa SQLite pela ponte; renderer continua com sandbox, sem Node integration.
- Progresso e histórico de tentativas têm caminho SQLite no desktop.
- Cadernos e sessões de simulados possuem persistência SQLite e outbox versionada para migração progressiva.
- IndexedDB e JSON permanecem ativos como compatibilidade/cache durante a transição.
- Sync Engine v1 usa UUID/event ID, versões, base_version, cursor incremental, idempotência, retries/outbox e registro de conflitos.
- API remota de sync é desacoplada do Electron e preparada para clientes Windows/Android.
- Credenciais remotas são previstas no cofre do Windows; senha não é armazenada.
- DATABASE_URL não é requisito do Sync Engine e existe gate contra arquivo de credenciais PostgreSQL no runtime desktop.

## Política de dados

SQLite é a fonte persistente alvo para atividade mutável do aluno. Bancos de questões permanecem snapshots/JSON versionados. IndexedDB não deve ser a única fonte de verdade após a migração de cada domínio.

## Gate

Obrigatórios antes de encerrar:
1. `test:desktop:local-first`;
2. `test:desktop:sync`;
3. Next standalone desktop build;
4. empacotamento NSIS Windows;
5. verificação do instalador;
6. CI e auditorias dos bancos sem regressão.

## Limites intencionais desta fase

A autenticação remota desktop possui o contrato/ponte de bootstrap preparado, mas a emissão do token pelo servidor é etapa de autenticação online e não altera o princípio local-first. Serviços administrativos, pagamentos, recuperação de senha, Google e IA permanecem online-only.
