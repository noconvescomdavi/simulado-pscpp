# ESTIBORDO/PSCPP — HENSEN — Checkpoint 015: gates e bloqueios editoriais

**Data da verificação:** 30/10/2026 (America/Sao_Paulo). **Escopo exclusivo:** Henk Hensen, *Tug Use in Port*, 4ª ed., capítulos 1–7 e 9. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 . **Branch:** `audit/hensen-lote-001-20261029`.

## 1. Evidência de CI no HEAD de entrada

**SHA auditado:** `e63d83ba5e35926bd9c49e5664d6923df5330018`. Cinco workflows concluíram **success** nesse SHA, conferidos diretamente nos registros GitHub Actions:

| Gate | Resultado | Evidência |
|---|---|---|
| CI | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41015431501 |
| Full Question Bank Audit | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41015431426 |
| Audit Main Question Banks | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41015431457 |
| PSCPP Integral Bank Audit | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41015431400 |
| Validate PIANC 121 CGE Quarantine | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41015431362 |

O log do Full Audit, job `123930583256`, confirma `HENSEN_SOURCE_GUARD: 13 lotes, 520 questões, 0 falhas`; 167 arquivos, 26.065 registros, **0 CRITICAL e 2.558 HIGH** (`LOCATOR_DEPENDENT_STEM=816`, `DUPLICATE_STEM=1483`, `GENERIC_TEMPLATE=258`, `OFFICIAL_SOURCE_DUPLICATE_OPTIONS=1`). O workflow verde **não saneia** esses 2.558 achados.

**Vercel no mesmo SHA:** GitHub commit status `Vercel=failure`, URL de erro https://vercel.com/estibordo?upgradeToPro=build-rate-limit . A busca de deployments por SHA `e63d83ba...` retornou **zero deployments**; não existe Preview READY comprovado para esse HEAD. Não confundir com Preview READY do commit anterior `d3f006a2efcbedb5002eb95f7667fd2ca147861a`: https://vercel.com/estibordo/estibordo-pscpp/FoE33rRVkq8wiCVMMVaaPPx6LzAq .

**Production:** deployment https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ em `READY` para `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, **não** para o conteúdo HENSEN. O comparativo GitHub `main...audit/hensen-lote-001-20261029` aponta branch divergente, **200 commits à frente e 2 atrás da main** no instante consultado; exige integração/reconciliação segura antes de merge, sem presumir ausência de conflitos pelo campo `mergeable=true`.

## 2. Auditoria semântica independente: duas questões do Lote 013

Cotejo dos JSON `hensen-lote-013.json` e `hensen-lote-002.json`, diretamente com o texto da quarta edição no Drive: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . A fonte foi acessível e o texto da seção foi lido; **não foi feita inspeção visual da página PDF** nesta execução.

| ID do Lote 013 | Comparação | Achado | Antes/depois nesta execução |
|---|---|---|---|
| `ANV-HENSEN-C01-L013-01` (A) | `ANV-HENSEN-C01-L002-03` (E) | Ambas cobram que serviços de combate a incêndio/poluição exigem equipamentos e requisitos além do bollard pull/assistência de atracação; mesma base §1.2.4, p. 6 (PDF 19). **Equivalência de competência substancial**, apesar de enunciados distintos. | **Sem alteração**: mantém `pending_editorial_review`; reformulação conceitual inédita ainda necessária. |
| `ANV-HENSEN-C01-L013-02` (B) | `ANV-HENSEN-C01-L002-02` (A) | Ambas cobram variação dos requisitos da frota segundo diversidade de navios. A questão L013 contrasta terminal homogêneo e heterogêneo, mas a resposta depende da mesma regra do §1.2.3, p. 6 (PDF 19). **Redundância de objetivo cognitivo**; não declarar inédita sem nova competência. | **Sem alteração**: mantém `pending_editorial_review`; substituição fundamentada pendente. |

**Decisão editorial:** não substituir precipitadamente por outro enunciado que apenas repita conceitos já cobertos. O capítulo 1 possui 65 questões novas distribuídas nos 13 lotes, com forte saturação dos mesmos parágrafos; procurar competência genuinamente distinta e verificar contra todos os lotes e 170 históricos antes de editar. Não alterar gabaritos apenas para equilibrar letras.

## 3. Histórico ativo: lacuna objetiva no controle de fonte

Os 51 registros `ANV-B006-01..17`, `ANV-B007-01..17` e `ANV-B008-01..17`, todos `active=true`, constam como `validation_status=approved`, mas **nenhum dos 51 possui página impressa ou página PDF no `source.locator`**. Os localizadores são genéricos (`Glossary`, `Ch. 9`, `§2.3` etc.). A aprovação estrutural atual dos 520 lotes não constitui homologação bibliográfica dos 51 históricos. Precisam de cotejo individual de página, explicação e competência; não presumir aprovação editorial pela flag antiga.

Os 119 históricos dos blocos 010, 013, 016, 019, 021, 022 e 023 continuam em **quarentena reversível** conforme checkpoint anterior. O candidato `ANV-B010-16` permanece inativo. Não foram reativados, apagados ou classificados como reparados nesta execução.

## 4. Deliberação e próximo passo

**Não houve alteração de questões, validações ou gabaritos neste checkpoint; nenhum teste foi desabilitado. Não realizar merge nem publicação.** Gates GitHub verdes no SHA de entrada não substituem Preview READY no SHA exato, saneamento editorial e reconciliação com `main`.

Próximo ciclo: (a) confirmar checks do HEAD que contém este relatório; (b) acompanhar liberação legítima da cota Vercel; (c) reescrever com evidência independente as duas questões equivalentes do Lote 013 ou mantê-las pendentes; (d) iniciar revisão por página dos 51 históricos ativos e recuperação individual dos 119 em quarentena; (e) não criar lote 014 enquanto os bloqueios anteriores persistirem.

**Checkpoint documental:** a criação deste arquivo acrescentará um commit ao HEAD. Portanto, os gates acima são do SHA de entrada e devem ser rechecados no novo HEAD; jamais apresentá-los como se fossem do commit documental.
