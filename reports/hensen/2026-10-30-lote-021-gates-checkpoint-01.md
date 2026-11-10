# HENSEN — Lote 021 — checkpoint persistente 01
Data: 2026-10-30. PR #173, branch `audit/hensen-lote-001-20261029`.

## Estado e inventário
- Banco consultado antes de incluir: lotes 001–020, 800 questões novas; arquivo 021 inexistente.
- Lote 021 incluído: 40 questões (cinco nos capítulos 1, 2, 3, 4, 5, 6, 7 e 9).
- Total esperado: 21 lotes, 840 questões novas; 170 históricas anteriores = 1.010 registros HENSEN brutos.
- Gabaritos: A=8, B=8, C=8, D=8, E=8. Cinco alternativas distintas por questão.
- PR aberto, sem merge. Arquivos anteriores e históricos não alterados; workflows e validadores não alterados.

## Commits da execução
- `60aee91fb4101d23a40766a485230d233e0dcf21`: inclusão inicial do banco JSON com 40 itens.
- `ef461f3920f280acfe57ced0908edea0e0b36d08`: revisão conceitual dos IDs C03-L021-04, C05-L021-03 e C09-L021-02.
- `66b57eab595323449a5b96875f928b79ec38b101`: revisão de C07-L021-02 para dimensionamento do tambor do guincho.
- `14863dc7948965d3e16a24a77ea652ba9d919244`: publicação do relatório individual dos 40 IDs.
- HEAD antes deste checkpoint: `14863dc7948965d3e16a24a77ea652ba9d919244`.

## Testes e evidências
- Fonte primária Google Drive `1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9`, *Tug Use in Port*, Henk Hensen, 4ª edição (2021).
- 40 passagens/âncoras consultadas no texto extraído da fonte; após reescritas, novos trechos conferidos. O cotejo visual integral ainda é pendente.
- Integridade do JSON final: 40 IDs únicos; cinco por capítulo; alternativas A–E distintas; uma resposta correta; justificativas e localizadores presentes.
- Comparação literal com 800 enunciados anteriores: nenhuma colisão. Jaccard lexical máximo 0,333 (lotes 001–010) e 0,313 (011–020), sem alertas ≥0,34.
- Comparação interna: nenhum par ≥0,34.
- Quatro questões foram reformuladas para evitar proximidade conceitual; relatório registra cada alteração.
- GitHub Actions no commit do JSON `66b57eab`, consultados antes deste checkpoint: Full Question Bank Audit (41065072281), CI (41065072282), Audit Main Question Banks (41065072288), PSCPP Integral Bank Audit (41065072274), Validate PIANC 121 CGE Quarantine (41065072470), todos `queued`. Não são aprovação do HEAD final.
- Testes locais npm não executados; não houve clonagem do repositório neste ambiente.

## Pendências e regras de bloqueio
- Verificar workflows GitHub Actions e Vercel Preview no HEAD final; não presumir aprovação por commits anteriores.
- Revisão semântica independente, cotejo visual de páginas, confronto completo com os 170 históricos e banco principal Arte Naval.
- Estado `pending_editorial_review`. Não fazer merge nem deploy sem todos os gates aprovados e homologação editorial.
- Próximo lote a verificar: 022, somente após consultar banco e checkpoints atuais.
