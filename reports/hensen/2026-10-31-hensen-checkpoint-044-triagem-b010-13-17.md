# HENSEN — Checkpoint 044 — 2026-10-31 — Triagem B010 13–17

## Evidência e limites
Consulta direta ao JSON `data/question-extensions/pscpp-caderno-bloco-010.json` no HEAD `8ade95bcd4ce370cf470dda1554dbc3e49dbd0f6`, ao PR #173, comparação com main e workflows do SHA. Não houve cotejo com o livro original nesta execução; nenhuma questão foi homologada.

## Antes/depois por ID
| ID | Antes — evidência concreta | Decisão e justificativa | Depois |
|---|---|---|---|
| ANV-B010-13 | Enunciado exige afirmativas I–IV sobre âncora e poder de unhar, mas não as apresenta; alternativas são combinações de I–IV; fonte genérica `Chapters 4–8` | Manter inativa: questão irrespondível e sem página validada | Sem alteração |
| ANV-B010-14 | Enunciado exige afirmativas I–IV sobre girting, mas não as apresenta; alternativas são combinações de I–IV; fonte genérica `Chapters 4–8` | Manter inativa: não basta corrigir gabarito; precisa reconstrução com fonte | Sem alteração |
| ANV-B010-15 | Enunciado exige afirmativas I–IV sobre força indireta de escolta, mas não as apresenta; alternativas são combinações de I–IV; fonte genérica `Chapters 4–8` | Manter inativa: conteúdo operacional potencialmente recuperável somente após cotejo da fonte e reconstrução | Sem alteração |
| ANV-B010-16 | Enunciado reescrito sobre gob rope e girting, cinco alternativas objetivas, fonte `Chapter 7, §7.2.1, p. 178 (PDF p. 191)` | Manter inativa: candidato a recuperação, mas ainda exige confirmação independente de página, contexto, exclusividade e duplicidade | Sem alteração |
| ANV-B010-17 | Mistura bollard pull com cavernas, vaus, sicordas, pontal e alquebramento; alternativas de permuta; fonte genérica `Chapters 4–8` | Manter inativa: conceitos de construção naval sem atribuição comprovada à obra e mistura temática; não homologar | Sem alteração |

Os cinco IDs foram encontrados com `active=false`. A busca por `ANV-B010-18` a `ANV-B010-20` não encontrou itens nesse JSON. Não se extrapola essa ausência a outros arquivos.

## Integração e gates
- PR #173: aberto, `merged=false`, `mergeable=true` no instante da consulta; mergeabilidade técnica não significa homologação editorial.
- HEAD anterior `8ade95bcd4ce370cf470dda1554dbc3e49dbd0f6`: CI, Full Question Bank Audit, Audit Main Question Banks, Validate PIANC 121 CGE Quarantine e PSCPP Integral Bank Audit com `completed/success`. Isso não demonstra ausência de achados editoriais.
- `main...branch`: `diverged`, ahead=284, behind=2; base de main reportada `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`.
- Combined commit status do SHA anterior retornou `statuses=[]`; não comprova Vercel Preview READY nem Production READY.
- Preexistência e resolução definitiva dos 2.754 achados (1 crítico) e da falha histórica Study Plan V3 não estabelecidas por comparação de logs antigos com a base.
- Novo commit documental requer reconfirmação de gates e estado Vercel; sem merge nem deploy.

## Pendências
Homologar fontes nos capítulos 1–7 e 9; auditar duplicidade semântica dos lotes e 51 históricos ativos; reparar recuperáveis sem retirar quarentena prematuramente; classificar achados históricos com evidência de base; reconciliar main e verificar Vercel Preview e Production no SHA correto. Os 119 itens em quarentena continuam sem reativação.

PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173
HEAD examinado: https://github.com/noconvescomdavi/simulado-pscpp/commit/8ade95bcd4ce370cf470dda1554dbc3e49dbd0f6
