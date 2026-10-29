# PSCPP — HENSEN — Lote 004 — checkpoint persistente e gates

**Data:** 2026-10-29. **Branch:** `audit/hensen-lote-001-20261029`. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173.  
**HEAD observado antes deste checkpoint:** `5b2870618b41afd9da450c25d15541900fc99d04`. **Fonte:** Henk Hensen, *Tug Use in Port*, 4ª edição revisada (2021), https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view.

## Entregas persistidas nesta execução

1. `data/question-extensions/hensen-lote-004.json` — 40 novas questões, commit `31a4135faed0c2563642ba432db5db309fd87cfc`.
2. `lib/question-banks-source.js` — importação e inclusão do Lote 004 no catálogo de Arte Naval, commit `0f46ca20953a0ebf49a13fd560615ce78fe6795a`.
3. `reports/hensen/2026-10-29-lote-004-auditoria.md` — relatório individual dos 40 IDs, gabaritos, justificativas, referências e sobreposições temáticas, commits `5288c1a40e5bab53aa87ab2e901c62f81598288b` e `5b2870618b41afd9da450c25d15541900fc99d04`.

## Inventário HENSEN esperado (antes dos filtros de execução)

- 170 questões históricas: 119 em quarentena reversível, 51 ativas com revisão bibliográfica pendente.
- Lotes 001, 002, 003 e 004: 40 questões cada = **160 novas questões**.
- Total bruto esperado: **330 registros HENSEN**; ativos por sinalização `active` esperados: **211**. Estes números não são a contagem de questões por simulado.
- Lote 004: capítulos 1–7 e 9, cinco questões cada; gabaritos A=8, B=8, C=8, D=8, E=8.

## Verificações realizadas

- JSON do Lote 004 relido após publicação; 40 IDs e enunciados distintos; cinco alternativas A–E distintas; gabaritos e justificativas presentes; taxonomia de Arte Naval.
- IDs e enunciados não colidem com os 120 registros dos lotes novos anteriores; máxima similaridade lexical de enunciados com esses lotes: Jaccard ≈ 0,278.
- Texto integral da edição 2021 consultado no Google Drive; 40/40 localizadores com seção identificada no texto da obra; correspondência de páginas PDF indicada como impressa +13.
- Triagem lexical com 170 questões históricas HENSEN dos blocos 006, 007, 008, 010, 013, 016, 019, 021, 022 e 023; máximo Jaccard filtrado de enunciados/tópicos ≈ 0,25. Ver relatório para sobreposições temáticas que exigem revisão independente.
- Nenhum arquivo histórico, lote anterior, quarentena ou gate de validação foi alterado.
- **Não foi comprovada execução local de `npm run validate` ou `npm run build`.** Resultados do GitHub Actions abaixo são observações remotas do commit de integração de código, não prova de aprovação do HEAD documental final.

## Workflows do commit de integração `0f46ca2`

| Workflow | Estado observado | Run |
|---|---|---|
| Audit Main Question Banks | completed / success | [#40957859644](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40957859644) |
| PSCPP Integral Bank Audit | in_progress | [#40957859639](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40957859639) |
| CI | in_progress | [#40957859652](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40957859652) |
| Full Question Bank Audit | completed / success | [#40957859649](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40957859649) |
| Validate PIANC 121 CGE Quarantine | completed / success | [#40957859680](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40957859680) |

## Pendências e instruções para continuidade

1. Verificar todos os workflows no HEAD efetivo do PR; investigar falhas sem desabilitar validações. Não declarar CI aprovado antes da conclusão.
2. Realizar revisão semântica independente e cotejo diagramado das páginas bibliográficas; conferir as 51 questões históricas ativas pendentes.
3. Manter PR #173 aberto e **não executar merge ou deploy** enquanto houver gate ou homologação pendente.
4. Próxima execução: consultar PR, branch, checkpoint e verificar primeiro se existe `data/question-extensions/hensen-lote-005.json`; elaborar o Lote 005 somente se ainda não existir.

**Situação:** Lote 004 publicado e integrado na branch; gates de CI/auditoria integral ainda em andamento na última observação; produção inalterada.
