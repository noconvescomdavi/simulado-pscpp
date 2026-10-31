# HENSEN — Lote 016 — checkpoint 01

Data: 2026-10-30. Branch `audit/hensen-lote-001-20261029`. PR #173.

- Banco: `data/question-extensions/hensen-lote-016.json`; commit 842d45574e5a08a1d32f24fefc14e05dc71fefa7.
- Relatório individual: `reports/hensen/2026-10-30-lote-016-auditoria.md`; commit 41036c5adb294ee59e980444d6879b496f0cd834.
- Inventário esperado: 16 × 40 = 640 novas; mais 170 históricas = 810 registros brutos. Os 119 históricos em quarentena foram preservados.
- 40 itens novos: cinco por capítulo 1–7 e 9, oito gabaritos por letra A–E, cinco alternativas distintas.
- Âncoras textuais: 40/40 presentes no texto extraído da fonte primária. Cotejo visual das páginas ainda pendente.
- Comparação literal com 600 questões anteriores sem colisão. Triagem semântica independente e comparação com todos os históricos pendentes.
- Nenhuma modificação em lotes anteriores, históricos, quarentenas ou validadores.
- Estado editorial `pending_editorial_review`; não executar merge/deploy.

## Pontos de atenção

- `ANV-HENSEN-C02-L016-05` ↔ `ANV-HENSEN-C02-L005-05`: Dice 0.500; exige cotejo conceitual.
- `ANV-HENSEN-C03-L016-01` ↔ `ANV-HENSEN-C03-L007-01`: Dice 0.581; exige cotejo conceitual.
- `ANV-HENSEN-C06-L016-01` ↔ `ANV-HENSEN-C06-L008-02`: Dice 0.667; exige cotejo conceitual.
- `ANV-HENSEN-C06-L016-05` ↔ `ANV-HENSEN-C06-L013-05`: Dice 0.600; exige cotejo conceitual.

## Gates

- Verificação estrutural em memória: aprovada.
- Testes locais npm: não executados neste ambiente.
- GitHub Actions (CI e quatro auditorias): verificar no HEAD final; não presumir aprovação.
- Vercel Preview: verificar no HEAD final; bloqueio anterior por cota de builds não resolvido neste checkpoint.
- Revisão editorial independente: pendente.

## Revisão 02 — correções de originalidade

- Banco corrigido no commit `2189faf795d025e938bc0dfae70b2237abc43144`.
- Relatório individual atualizado no commit `ba994bce0a4327fd1b7e03a18a6674a1be0afa6e`.
- Sete questões reescritas integralmente, com gabaritos e IDs preservados: `C02-L016-05`, `C03-L016-01`, `C05-L016-04`, `C06-L016-01`, `C06-L016-05`, `C07-L016-02`, `C09-L016-05`.
- Nova triagem lexical com 600 questões anteriores: nenhum par acima do limiar Dice 0,50; isto não substitui auditoria semântica independente.
- Nenhum lote anterior, histórico, quarentena, validador ou configuração de deploy foi alterado.
- Inspeção visual do PDF, testes locais e conclusão dos gates no HEAD final ainda pendentes. Não realizar merge/deploy.

## Revisão 03 — correção de fontes

- Banco no commit `13c52196dbd188f67e2d7c221afb6d99364e275a`; relatório no commit `bd93196ba29cce83d543a0a03e48c35482328367`.
- `ANV-HENSEN-C06-L016-01`: substituída questão que usava indevidamente trecho de outro capítulo; agora §6.2.1, p. 149 (PDF p. 162), sobre cabo e cargas dinâmicas.
- `ANV-HENSEN-C06-L016-05`: paginação corrigida para §6.4, p. 175 (PDF p. 188).
- Distribuição, IDs e gabaritos preservados. Revisão visual integral e homologação independente ainda pendentes.
