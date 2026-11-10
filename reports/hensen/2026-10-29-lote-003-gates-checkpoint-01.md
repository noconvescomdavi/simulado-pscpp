# PSCPP — HENSEN — Lote 003 — checkpoint de integração e gates

**Data:** 2026-10-29. **Branch:** `audit/hensen-lote-001-20261029`. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173.  
**HEAD observado antes deste checkpoint:** `5c7f1133e96c8d4b874d3273a6857dbe38275a95`. **Base do PR:** `37f945957d5319ade9c5cec447d41e67cc8fb378`.  
**Fonte primária:** Henk Hensen, *Tug Use in Port*, 4ª edição revisada (2021), https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view.

## Entregas persistidas

1. `data/question-extensions/hensen-lote-003.json` — 40 questões inéditas com 5 alternativas, gabaritos balanceados, justificativas e localizadores bibliográficos. Commit `4b81cc39e0bd46854a41c2846006d83c997848b8`.
2. `lib/question-banks-source.js` — importação e inclusão do Lote 003 na fonte do catálogo. Commit `ed416ada26df834e0d7fdecd3db5f62aeb00577b`.
3. `reports/hensen/2026-10-29-lote-003-auditoria.md` — relatório individual dos 40 IDs, enunciados, gabaritos, justificativas e referências. Commit `5c7f1133e96c8d4b874d3273a6857dbe38275a95`.

## Inventário após integração (JSON antes dos filtros de execução)

- Registros HENSEN históricos: **170**, sendo **119 em quarentena reversível** e **51 ativos com revisão bibliográfica pendente**.
- Lote 001: **40**; Lote 002: **40**; Lote 003: **40**.
- Total bruto HENSEN esperado: **290**; ativos por sinalização `active` esperados: **171**. A seleção runtime pode impor filtros adicionais; estas quantidades não são a contagem do simulado de 100 questões.
- Lote 003: capítulos 1–7 e 9 com 5 itens cada; gabaritos A=8, B=8, C=8, D=8, E=8.

## Validação estrutural e bibliográfica realizada

- Arquivo do Lote 003 relido do GitHub após o commit e inspecionado programaticamente.
- 40 IDs distintos; 40 enunciados distintos; cinco alternativas A–E por questão; 40 gabaritos válidos; 40 explicações.
- Nenhum ID duplicado entre os três lotes novos (120 questões).
- Localizadores de todas as 40 questões têm seção presente no capítulo correspondente do texto integral da 4ª edição; página PDF = impressa + 13.
- Comparação lexical entre os enunciados do Lote 003 e os 80 dos Lotes 001–002: maior índice Jaccard de termos filtrados = **0,20**, sem coincidência literal. Comparação editorial de tópicos dos 170 históricos efetuada; revisão semântica humana independente continua recomendada.
- Não foram modificados registros históricos, lotes anteriores, regras de quarentena nem gates de validação.
- **Não foi comprovada execução local de `npm run validate` nem de `npm run build`.** Os resultados de CI devem ser obtidos do GitHub Actions.

## Workflows da integração de código (commit `ed416ada26df834e0d7fdecd3db5f62aeb00577b`)

| Workflow | Estado observado | Execução |
|---|---|---|
| PSCPP Integral Bank Audit | in_progress | [#40949217004](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40949217004) |
| CI | in_progress | [#40949216981](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40949216981) |
| Audit Main Question Banks | completed / success | [#40949216945](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40949216945) |
| Validate PIANC 121 CGE Quarantine | completed / success | [#40949216838](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40949216838) |
| Full Question Bank Audit | completed / success | [#40949216839](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40949216839) |

**Atenção:** os estados acima são uma fotografia dos checks do commit de integração de código. O commit documental posterior e este checkpoint exigem nova conferência do HEAD antes de qualquer merge.

## Pendências e próximo passo

1. Aguardar/verificar a conclusão do CI e da auditoria integral no HEAD efetivo do PR; investigar qualquer falha sem suprimir validações.
2. Realizar revisão editorial independente, incluindo sobreposições temáticas, e conferir as 51 questões históricas ativas ainda não homologadas.
3. Manter o PR #173 aberto, **sem merge e sem deploy**, enquanto houver gate pendente ou falha.
4. Na próxima execução horária, verificar primeiro a existência de `hensen-lote-004.json`; criar o próximo lote **somente se ausente**, mantendo IDs únicos e checkpoint individual.

**Estado:** Lote 003 integrado à branch e reportado; homologação e publicação em produção pendentes.
