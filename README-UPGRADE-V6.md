# ESTIBORDO — Upgrade V6

Este pacote adiciona uma fundação para estudo adaptativo sem substituir o que já funciona.

## Entregas
- Página `/hoje` com plano diário adaptativo;
- Caderno de erros automático;
- API `/api/study/plan`;
- Health check `/api/health`;
- Validador dos bancos JSON;
- CI no GitHub Actions;
- headers de segurança básicos;
- limpeza de `.gitignore`;
- migration `007_study_engine.sql` com domínio por tópico, revisão espaçada, notas, favoritos, metas, sessões e audit log.

## Banco
A migration foi validada em uma branch temporária do Neon e cria somente estruturas novas.

## Ordem recomendada
1. Aplicar a migration 007 no Neon.
2. Copiar os arquivos deste pacote para o repositório.
3. Rodar `node scripts/validate-question-banks.mjs`.
4. Rodar `npm run build`.
5. Commit/push.
6. Conferir `/api/health`, `/hoje` e `/conteudos/caderno-de-erros`.

## Próxima fase
- FSRS completo para flashcards;
- atualização automática de `student_topic_mastery`;
- pgvector + embeddings;
- tutor RAG com citações;
- notas/favoritos na UI;
- analytics editorial de questões;
- PWA/notificações;
- Sentry/PostHog.
