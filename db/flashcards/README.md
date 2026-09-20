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


## Flashcards da bibliografia PSCPP

O seed `006_seed_pscpp_bibliografia.sql` inicia os baralhos estratégicos das sete matérias do PSCPP 2027. Os decks usam `subject_slug` compatível com `data/study/bibliography.js`, permitindo organizar a tela por matéria e expandir progressivamente cada publicação/capítulo da bibliografia oficial cadastrada na aplicação.

A regra editorial para os novos cartões é: pergunta/conceito curto na frente, resposta técnica direta no verso e macete apenas quando agregar valor de recuperação ativa. O conteúdo de prova não deve ser gerado por simples conversão mecânica de alternativas de múltipla escolha.
