# HENSEN — checkpoint 072 (2026-11-01)

## Escopo e decisão
PR #173, branch `audit/hensen-lote-001-20261029`. **Merge bloqueado**; nenhuma questão alterada, nenhum item de quarentena reativado, nenhum deploy efetuado. Esta execução examinou diretamente os diffs dos dois commits exclusivos da main via conector GitHub e o status combinado do HEAD HENSEN.

## Evidências verificadas
- HEAD HENSEN examinado: `cca927748830b7d04c50f44b3a4fdc2e00c35a07`. Status combinado GitHub: contexto `Vercel`, estado `pending`, URL https://vercel.com/estibordo/estibordo-pscpp/A3tLTdUdNWKi8p7yVhPqgKgMANYA. **Não comprova Production READY**.
- Comparação `main...audit/hensen-lote-001-20261029`: 290 commits à frente, 2 atrás. A ausência de conflito sintático não comprova compatibilidade semântica nem editorial.
- Commit exclusivo da main [eb0932f9](https://github.com/noconvescomdavi/simulado-pscpp/commit/eb0932f9f187626c60f9bcad3ef79e31bd63590c): modifica `app/api/exams/[subject]/route.js`, `app/simulado/[subject]/Client.js`, `lib/exams.js`, `lib/pscpp-exam-bank.js`, `lib/pscpp-exam-selection.js`, `package.json` e acrescenta `scripts/test-pscpp-reviewed-selection.mjs`. Introduz revisão explicitamente opt-in, prioriza inéditas e preserva quotas 25/25/10/10/10/10/10. **Risco de regressão funcional se reconciliação descartar essas alterações**.
- Commit exclusivo da main [a03ccf97](https://github.com/noconvescomdavi/simulado-pscpp/commit/a03ccf972a021f9a2c8fee3ba09de3271fa089a7): altera `data/questions/arte-naval.json`, `data/question-restorations/arte-naval.json`, `lib/question-banks-source.js`, `lib/question-source-merge.js`, geradores e validadores e numerosos relatórios de auditoria. **Risco de sobrescrever correções de questões e lógica de proveniência**.
- O diff do commit a03ccf97 registra revisão bibliográfica de Fonseca, *Arte Naval* v.2 (não HENSEN); essas correções devem ser preservadas, sem estender o escopo editorial deste trabalho.

## Pendências impeditivas
1. Reconciliar a branch com ambos os commits da main, preservando testes e correções, sem resolver conflitos por descarte. Executar regressão de seleção PSCPP, Study Plan V3, auditorias de banco, semântica e localizadores no **novo SHA**.
2. Recuperar e comparar achados por ID/categoria nos artefatos da main e da branch. Os totais históricos de 2.754/1 crítico e 2.554/0 críticos não demonstram correção individual por si sós.
3. Confirmar com fonte primária a página e a justificativa de cada questão HENSEN; o validador de formato de localizador não prova suporte bibliográfico. Revisar equivalência semântica global.
4. Preservar os 119 históricos em quarentena reversível até reparo individual documentado. Não confundir inativação com saneamento.
5. Exigir todos os gates verdes no SHA reconciliado, PR mergeável, e verificar deployment Vercel **Production READY para o SHA publicado**, não apenas Preview READY.

## Registro de alterações de questões
IDs modificados nesta execução: **nenhum**. Antes/depois: **não aplicável**. Lote novo: **nenhum**. Quarentena: **sem alteração**.

## Referências
- PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173
- Branch: https://github.com/noconvescomdavi/simulado-pscpp/tree/audit/hensen-lote-001-20261029
- Comparação: https://github.com/noconvescomdavi/simulado-pscpp/compare/main...audit/hensen-lote-001-20261029
- Commits exclusivos da main: https://github.com/noconvescomdavi/simulado-pscpp/commit/eb0932f9f187626c60f9bcad3ef79e31bd63590c e https://github.com/noconvescomdavi/simulado-pscpp/commit/a03ccf972a021f9a2c8fee3ba09de3271fa089a7
- Deployment reportado: https://vercel.com/estibordo/estibordo-pscpp/A3tLTdUdNWKi8p7yVhPqgKgMANYA

Status: **BLOQUEADO**. Próxima ação: reconciliação real e revalidação, não merge.
