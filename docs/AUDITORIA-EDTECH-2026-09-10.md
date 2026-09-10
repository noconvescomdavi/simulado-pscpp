# Auditoria EdTech — 2026-09-10

## Escopo executado
Auditoria orientada pelo PROMPT MESTRE `Markdown(5)`, com foco inicial em arquitetura de estudos, persistência, plano de estudos, motor de aprendizagem, revisão inteligente, caderno de erros, analytics e regressões.

## O que já existia
- Plano de estudos integrado com onboarding, snapshots, progresso, backlog, indisponibilidade e reprogramação.
- Caderno de erros automático baseado em `question_stats`.
- Revisão inteligente com fila adaptativa e intervalos calculados por qualidade.
- Mastery score por tópico.
- Sessões de estudo com heartbeat e duração real.
- Dashboard com prontidão, aderência, domínio, tempo estudado e pontos fracos.
- Streak e conquistas.
- Ranking acadêmico com teto de volume/frequência.
- Flashcards e banco de questões.
- Simulados e histórico de tentativas.
- Eventos de estudo e trilha de auditoria do plano.

## P0 identificado
As migrations `007_study_engine.sql` e `023_learning_analytics_v3.sql` definiam versões incompatíveis das tabelas:
- `student_study_sessions`
- `student_topic_mastery`

Como `CREATE TABLE IF NOT EXISTS` não altera uma tabela já existente, a migration 023 podia tentar criar índices usando colunas ausentes em bancos que já haviam passado pela 007.

### Correção aplicada
A migration 023 agora:
- adiciona colunas V3 com `ADD COLUMN IF NOT EXISTS`;
- preserva métricas da estrutura legada;
- preenche `last_heartbeat_at`;
- fecha sessões abertas duplicadas preservando histórico;
- migra a chave primária de mastery para incluir `topic_label`;
- cria índices somente depois das colunas necessárias;
- mantém dados existentes.

Foi criado `scripts/validate-learning-migrations.mjs` e adicionado ao `npm run validate` para evitar regressão futura.

## P1 identificado — Caderno de Erros
O banco já guardava:
- alternativa marcada;
- se a tentativa estava correta;
- tempo de resposta;
- data da tentativa.

A interface usava apenas agregados de `question_stats`.

### Correção aplicada
O Caderno de Erros agora expõe:
- última alternativa marcada;
- alternativa correta;
- data da última tentativa;
- status de recuperação;
- status de domínio simplificado.

Também foi corrigida a semântica de “recuperada”: agora depende da última tentativa estar correta, e não apenas de existir algum acerto histórico.

## Inventário funcional preliminar

| Área | Situação |
|---|---|
| Plano de estudos | Funcional, sensível a regressões |
| Reprogramação/backlog | Funcional com alterações recentes |
| Snapshots do plano | Implementado |
| Histórico/eventos do plano | Implementado |
| Revisão inteligente | Implementada |
| Mastery score | Implementado |
| Caderno de erros | Implementado e aprimorado |
| Flashcards | Implementado |
| Sessões de estudo | Implementadas |
| Analytics educacional | Implementado parcialmente/espalhado |
| Streak | Implementado |
| Conquistas | Implementadas |
| Ranking | Implementado |
| Simulados | Implementados |
| Banco de questões | Implementado |
| Plano diário | Implementado |
| Recomendação de estudo | Implementada no plano integrado |
| Mapa de domínio | Há dados de mastery; UX dedicada ainda deve ser confirmada |
| XP explícito | Não confirmado nesta auditoria inicial |
| Configuração administrativa de gamificação/revisões | Não confirmada nesta auditoria inicial |

## Arquitetura observada
A plataforma usa Next.js 15 / React 19 e PostgreSQL. O domínio educacional está distribuído principalmente entre:
- `lib/study-engine.js`
- `lib/integrated-study-plan.js`
- `lib/study-plan-progress.js`
- `lib/study-plan-snapshot.js`
- `lib/learning-engine.js`
- `lib/engagement.js`
- APIs em `app/api/study-plan/*` e `app/api/review-queue/*`.

A arquitetura já possui conceitos próximos ao `StudyEvent` pedido no prompt através de `student_plan_events`, `product_events`, `student_study_sessions` e tabelas de progresso.

## Proteção contra regressões
Adicionada validação estática das migrations de aprendizagem ao pipeline `npm run validate`.

## Testes realizados
- Inspeção estática do schema e código.
- Verificação das invariantes de migration por novo script versionado.
- Verificação do status do commit no GitHub/Vercel.

## Testes não concluídos
Não foi possível executar build/deploy remoto após os commits porque a integração Vercel retornou:
`build-rate-limit`.

Não foi executada migration contra o banco de produção nesta auditoria, portanto não é correto afirmar que a alteração de schema já foi aplicada em produção.

## Deploy
Os commits chegaram ao branch `main`, mas o deploy automático está bloqueado por rate limit da Vercel.

## Próximas prioridades
1. Executar o pipeline completo quando a Vercel liberar novo build.
2. Aplicar/verificar migrations no banco de produção.
3. Rodar fluxos funcionais autenticados: plano, tarefa atrasada, reprogramação, conclusão, revisão e caderno de erros.
4. Auditar XP/gamificação administrativa.
5. Consolidar analytics hoje/7 dias/tendência em uma camada única.
6. Confirmar ou criar visualização navegável do mapa de domínio.
7. Auditar simulados adaptativos e relatório pós-simulado.
8. Auditar mobile em smartphone/tablet e safe-area.
9. Rodar auditoria final de performance, queries, loops e hidratação.

## Commits desta execução
- `aafc317` — migration V3 retrocompatível
- `9c43a5b` — correção da comparação de chave primária
- `d8816d1` — teste de compatibilidade de migrations
- `bd7ea0d` — validação integrada ao pipeline
- `5e0c772` — dados da última tentativa no caderno de erros
- `78bdadd` — UI do contexto de erro
- `c513e19` — estilo do painel de tentativa
