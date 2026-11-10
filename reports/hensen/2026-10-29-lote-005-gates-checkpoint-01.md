# HENSEN — Lote 005 — Gates e checkpoint 01

**Data:** 2026-10-29. **PR:** #173, `audit/hensen-lote-001-20261029`. **Estado:** lote publicado na branch de auditoria; sem merge nem deploy.

## Alterações efetivamente persistidas

1. `data/question-extensions/hensen-lote-005.json` — 40 questões inéditas (commit `24974372d6eaf4c88c4134252236f2f214dc717d`).
2. `lib/question-banks-source.js` — importação e inclusão do Lote 005 no banco de Arte Naval (commit `6d6f3b5aa77679af6e809f5d8e7e6f496a719144`).
3. `reports/hensen/2026-10-29-lote-005-auditoria.md` — auditoria individual de 40 IDs (commit `61f577a6acb6e2beca2fb9338524fcb8048dc59c`).

## Inventário esperado

- Históricos HENSEN: **170** (51 ativos em metadados; 119 em quarentena reversível).
- Lotes 001–005: **200** questões novas (40 por lote), sem sobrescrever lotes anteriores.
- Total HENSEN esperado após integração: **370 registros**, dos quais **251 com `active=true`** antes de filtros adicionais de runtime. Contagens ainda sujeitas à confirmação do auditor de CI no HEAD final.
- Distribuição do Lote 005: cinco questões por capítulo (1–7, 9), cinco alternativas, A=8, B=8, C=8, D=8, E=8.

## Verificações executadas

- JSON gerado e relido do GitHub com 40 registros, IDs únicos e gabaritos consistentes.
- Comparação literal e lexical contra Lotes 001–004: nenhuma duplicação literal, nenhum par acima do limiar Jaccard 0,43.
- Triagem adicional contra 170 históricos HENSEN: maior Jaccard observado 0,235; **não** equivale à ausência comprovada de duplicações conceituais.
- Fonte primária Hensen 2021 lida no Google Drive; seções citadas fundamentaram a elaboração. A revisão independente da paginação e do gabarito permanece pendente.

## Gates observados após o commit de integração `6d6f3b5`

| Workflow | Situação no momento da consulta | Run |
|---|---|---|
| Audit Main Question Banks | success | 40966122004 |
| Full Question Bank Audit | success | 40966121993 |
| Validate PIANC 121 CGE Quarantine | success | 40966122036 |
| PSCPP Integral Bank Audit | in_progress | 40966121976 |
| CI | in_progress | 40966121966 |

**Atenção:** os resultados acima referem-se ao commit de integração; não comprovam o HEAD final documental. Na consulta logo após o relatório, o HEAD era `61f577a6acb6e2beca2fb9338524fcb8048dc59c` e ainda não havia workflows retornados para ele. O PR foi reportado como `mergeable=false` na consulta, exigindo nova verificação; não houve tentativa de merge.

## Próximo passo e riscos

- Conferir os cinco workflows do **HEAD final** após este checkpoint, resolver eventuais falhas sem desativar validações.
- Revisão semântica independente de proximidades temáticas identificadas no relatório do lote, incluindo C01-L005-04/05, C03-L005-01/02 e C09-L005-01.
- Homologar individualmente as 51 históricas ativas e manter as 119 em quarentena até correção bibliográfica.
- Não fazer merge nem deploy até aprovação integral e avaliação editorial. Próximo lote ainda não elaborado: **Lote 006**, salvo avanço concorrente verificado no GitHub antes de criá-lo.
