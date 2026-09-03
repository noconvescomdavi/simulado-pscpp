# Banco de flashcards

Os flashcards do ESTIBORDO usam um banco PostgreSQL separado, chamado `flashcards`.

A aplicação usa `FLASHCARDS_DATABASE_URL` quando essa variável existe. Quando ela não
existe, `lib/flashcards-db.js` deriva a conexão a partir de `DATABASE_URL`, preservando
host, usuário, senha e parâmetros e trocando apenas o nome do banco para `flashcards`.

## Estrutura

- `decks`: catálogo de baralhos e conteúdo dos cartões em JSONB.
- `study_sessions`: sessões exclusivas de estudo e modo prova dos flashcards.
- `answer_events`: histórico individual de respostas.
- `card_progress`: progresso agregado por usuário/cartão e marcação de difíceis.

Essas tabelas não são consultadas por `lib/metrics.js` e não alteram notas, tentativas
ou métricas de provas e simulados.

O arquivo `002_seed_cis.sql` contém os 54 cartões do Código Internacional de Sinais
importados do repositório `noconvescomdavi/flashcards_cis`.
