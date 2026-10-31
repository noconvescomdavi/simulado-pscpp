# HENSEN — Checkpoint 043 — 2026-10-31 — Triagem B010 04–12

## Escopo e evidência
PR #173, branch `audit/hensen-lote-001-20261029`. Somente obra Henk Hensen, *Tug Use in Port*, 4ª edição, capítulos 1–7 e 9. Consulta direta de `data/question-extensions/pscpp-caderno-bloco-010.json` e do relatório inicial `reports/hensen/2026-10-29-lote-001-auditoria.md`. A fonte primária não foi reaberta nesta execução; por isso não há homologação bibliográfica.

## Triagem individual — antes/depois
| ID | Antes: defeito identificado | Decisão justificada | Depois |
|---|---|---|---|
| ANV-B010-04 | pontal/calado; cinco proposições descritivas plausíveis, sem comando que discrimine uma única correta; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |
| ANV-B010-05 | tosamento/alquebramento; cinco proposições descritivas plausíveis, sem comando que discrimine uma única correta; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |
| ANV-B010-06 | seio/chicote/vivo; cinco proposições descritivas plausíveis, sem comando que discrimine uma única correta; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |
| ANV-B010-07 | falcaça/costura; cinco proposições descritivas plausíveis, sem comando que discrimine uma única correta; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |
| ANV-B010-08 | moitão/cadernal; cinco proposições descritivas plausíveis, sem comando que discrimine uma única correta; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |
| ANV-B010-09 | talha/estralheira; cinco proposições descritivas plausíveis, sem comando que discrimine uma única correta; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |
| ANV-B010-10 | molinete/cabrestante; cinco proposições descritivas plausíveis, sem comando que discrimine uma única correta; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |
| ANV-B010-11 | escovém/paiol da amarra; alternativas referem-se a afirmativas I–IV não apresentadas no enunciado; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |
| ANV-B010-12 | mordente/boça; alternativas referem-se a afirmativas I–IV não apresentadas no enunciado; referência genérica `Chapters 4–8` | Manter `active=false` e `quarantined`; não atribuir a Hensen sem fonte operacional exata | Sem alteração |

Para B010-04 a B010-10, as opções incluem diversas afirmações plausíveis de nomenclatura naval, sem exclusividade semântica do gabarito. B010-11 e B010-12 referem-se a proposições I–IV inexistentes no enunciado, impedindo resolução objetiva. Todos os nove estão previamente inativos e em quarentena; nenhum foi reativado, alterado ou declarado corrigido. Estes itens não são candidatos à recuperação por simples troca de gabarito. A eventual substituição exige competência de assistência com rebocadores e cotejo com a edição original, com página e seção exatas.

## Gates e estado de integração
- `compare_commits(main, audit/hensen-lote-001-20261029)`: ahead=283, behind=2, status=diverged; base `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`. Divergência não prova conflito, nem mergeabilidade.
- Workflows consultados para o HEAD anterior `f2b24a22406cc655be31576ce0e7f0bc9f8ee36c`: CI, Full Question Bank Audit, Audit Main Question Banks, PSCPP Integral Bank Audit e Validate PIANC 121 CGE Quarantine, todos completed/success. Não se inferem zero achados de auditoria, nem aprovação do novo HEAD.
- Falhas antigas (2.754 achados, 1 crítico; Study Plan V3) ainda não foram classificadas como preexistentes mediante confronto de logs de base/branch. Não afirmar que foram reparadas.
- Mergeabilidade, Vercel Production READY para SHA integrado e status Vercel do novo HEAD não foram verificados; merge e deploy permanecem bloqueados.

## Próximas ações
Revisar os históricos HENSEN restantes e os 51 ativos, conferir fonte primária e duplicidades integrais, investigar achados críticos históricos e reconciliar com main sem contornar testes. Não criar lote novo antes dos bloqueios prioritários.

PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173
Commit anterior auditado: https://github.com/noconvescomdavi/simulado-pscpp/commit/f2b24a22406cc655be31576ce0e7f0bc9f8ee36c
Nenhum arquivo de questões modificado, nenhum merge ou deploy Production.
