# ESTIBORDO/PSCPP — HENSEN — Checkpoint 016: verificação do HEAD, CI e equivalência conceitual

**Data:** 2026-10-30 (America/Sao_Paulo). **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 . **Branch:** `audit/hensen-lote-001-20261029`. **Fonte exclusiva:** Henk Hensen, *Tug Use in Port*, quarta edição, capítulos 1–7 e 9. **HEAD de entrada:** `d035c0d0d8717cc02fa3431ffc44474fd58557b8`.

## 1. Inventário e auditoria comprovados no SHA de entrada

O log do [Full Question Bank Audit #41022437722](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41022437722), job `123952630973`, registra literalmente `HENSEN_SOURCE_GUARD: 15 lotes, 600 questões, 0 falhas`. O banco contém 15 lotes novos de 40 itens, com 170 históricos, dos quais 119 em quarentena reversível e 51 ativos sob revisão, conforme inventário anterior. A aprovação do validador de formato **não comprova revisão bibliográfica visual nem originalidade semântica**.

O Full Audit concluiu **success**, mas com **0 CRITICAL e 2.558 HIGH**, discriminados em `LOCATOR_DEPENDENT_STEM=816`, `DUPLICATE_STEM=1483`, `GENERIC_TEMPLATE=258`, `OFFICIAL_SOURCE_DUPLICATE_OPTIONS=1`. São achados globais ainda abertos; o sucesso do workflow não equivale a saneamento. A falha histórica de Study Plan V3 não se reproduziu neste HEAD: a etapa `Study Plan V3 invariants` da [CI #41022437727](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41022437727) concluiu `success`, enquanto o job CI geral ainda estava em execução na última consulta.

Outros gates do mesmo SHA: [Audit Main Question Banks #41022437794](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41022437794), [PSCPP Integral Bank Audit #41022437465](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41022437465) e [Validate PIANC 121 CGE Quarantine #41022437565](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41022437565) concluíram `success`. **Todos os checks precisam ser reavaliados para o commit que cria este relatório.**

## 2. Conferência de equivalência conceitual e fonte primária

A fonte PDF [Tug Use in Port, 4ª ed.](https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view) foi efetivamente acessada no Google Drive e o texto dos §§1.2.3–1.2.4 (página impressa 6, PDF 19) foi lido. O texto confirma que a diversidade de navios impõe requisitos variáveis de potência, equipamentos, defensas, manobrabilidade e superestrutura, e que serviços adicionais, como combate a incêndio e controle da poluição, impõem requisitos próprios.

| ID sob revisão | ID de comparação | Evidência de sobreposição | Antes/depois nesta execução |
|---|---|---|---|
| `ANV-HENSEN-C01-L013-01` | `ANV-HENSEN-C01-L002-03` | Ambos cobram a insuficiência do bollard pull como critério para tarefas de incêndio e poluição (§1.2.4, p. 6). | **Sem alteração:** permanece `pending_editorial_review`; exige competência distinta antes de homologar. |
| `ANV-HENSEN-C01-L013-02` | `ANV-HENSEN-C01-L002-02` | Ambos cobram requisitos variáveis conforme tipos e dimensões dos navios (§1.2.3, p. 6). | **Sem alteração:** permanece `pending_editorial_review`; exige reformulação de objetivo cognitivo. |
| `ANV-HENSEN-C03-L015-02` | `ANV-HENSEN-C03-L007-05` | Mesma aproximação de rebocador à popa de submarino, mas perigos materiais diferentes: planos de profundidade submersos versus sonar rebocado. **Sobreposição de cenário, não duplicidade demonstrada de resposta.** | **Sem alteração:** manter revisão independente; não reescrever com base apenas em similaridade lexical. |

A comparação `ANV-HENSEN-C01-L015-02` com `ANV-HENSEN-C01-L001-01` também merece revisão: ambas envolvem acesso bilateral a píer e geometria de terminal, embora possam exigir inferências distintas. Não foi declarada duplicidade definitiva sem cotejo semântico aprofundado. Não houve mudança de enunciados, alternativas, gabaritos, IDs, localizadores, `active` ou status de quarentena nesta execução. **Não confundir detecção com correção.**

## 3. GitHub e Vercel: bloqueios para integração

O PR #173 estava **open**, `mergeable=true` e **não integrado**; o comparativo GitHub `main...audit/hensen-lote-001-20261029` indicou **210 commits à frente e 2 atrás da main** (estado divergente). A divergência precisa ser reconciliada e testada antes de qualquer merge.

O commit de entrada apresentou status GitHub `Vercel=failure`, apontando para [limite de builds do plano](https://vercel.com/estibordo?upgradeToPro=build-rate-limit). Existem Previews **READY para commits anteriores**, inclusive [`ad524c1d`](https://vercel.com/estibordo/estibordo-pscpp/GyKN43vEWK12boVUmrqEviCt2fqP) e [`3d293a62`](https://vercel.com/estibordo/estibordo-pscpp/GVDkTHsfpyE4W1Xiiewx2UKs72bQ), mas **nenhum deles valida o HEAD de entrada**.

A [Vercel Production READY](https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ) corresponde a `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, sem os lotes HENSEN. Não há publicação HENSEN em Production.

## 4. Deliberação e continuidade

**Merge bloqueado** por CI do HEAD ainda inconclusiva na última consulta, Vercel sem Preview READY para o SHA exato, divergência com `main`, redundâncias conceituais não reparadas e homologação bibliográfica incompleta. Não foi desabilitado teste, omitido achado ou alterada quarentena. Não foi iniciado novo lote nesta execução, para priorizar o checkpoint e evitar expansão de conteúdo não homologado.

Próxima execução: revalidar checks do HEAD pós-checkpoint; conferir Preview READY no SHA exato; reformular com fonte e cotejo independente `C01-L013-01/02`; revisar a sobreposição `C01-L015-02`; iniciar homologação por página dos 51 históricos ativos e recuperação dos 119 em quarentena, com antes/depois individual. **Não realizar merge até todos os gates e a segurança editorial estarem comprovados.**
