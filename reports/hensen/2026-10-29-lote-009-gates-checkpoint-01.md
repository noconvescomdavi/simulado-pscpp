# HENSEN — Lote 009 — Gates e checkpoint 01

**Data:** 2026-10-29. **PR:** [#173](https://github.com/noconvescomdavi/simulado-pscpp/pull/173). **Branch:** `audit/hensen-lote-001-20261029`.

## Progresso persistido

1. Antes da criação, verificado que `hensen-lote-009.json` não existia (404) e que o PR #173 estava aberto, com 320 questões nos lotes 001–008.
2. Criação de [`data/question-extensions/hensen-lote-009.json`](../../data/question-extensions/hensen-lote-009.json): 40 questões, commit `026342323f0c2b3e5c2e93b5e0a829019cbe410c`.
3. Integração por importação e inclusão no array de extensões de `lib/question-banks-source.js`: commit `06c00d8896a3a924196bd0b4a96b187f661e6c08`.
4. Três reparos editoriais para reduzir sobreposições internas: IDs `C03-L009-02`, `C05-L009-04`, `C09-L009-03`, commit `150fd2d57bf18e4de98ab9e6968faa6382a67b13`.
5. Revisão integral dos **160 distratores** do Lote 009, preservando gabaritos e fontes: commit `68889950675d7b9a265676435ec8e06cc048c2b1`.
6. Atualização do relatório individual após a revisão: commit `7b1c1510f98209293cb775468efdf1362b192451`.
7. [Relatório individual com 40 IDs, alternativas corretas, referências e justificativas](./2026-10-29-lote-009-auditoria.md): commit `82985151c15f5c7742c34bc9a601de1604b1d1b3`.

## Inventário e auditoria

- Histórico HENSEN: 170 questões, sendo 119 em quarentena reversível e 51 ativas pendentes de homologação individual.
- Lotes 001–009: **360 questões novas**, cinco por capítulo 1–7 e 9 em cada lote; **total bruto esperado: 530 registros HENSEN** (170 históricos + 360 novos); **411 com `active:true` em metadados** antes dos filtros do runtime.
- Lote 009: 40 IDs distintos, cinco alternativas textualmente distintas, justificativas e referências com página impressa e PDF; **A=8, B=8, C=8, D=8, E=8**.
- Comparados os nove lotes e dez blocos históricos, totalizando 1.020 registros anteriores (170 deles HENSEN). Não foram detectadas duplicações literais de IDs ou enunciados normalizados no Lote 009.
- Triagem lexical com os oito lotes anteriores efetuada. A **revisão semântica independente não foi concluída** e `validation_status` do Lote 009 é `pending_editorial_review`; `validation.duplicate_checked=false` registra a limitação.
- Fonte primária consultada: [Hensen, 4ª ed. (2021)](https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view). Localizadores conferidos no texto extraído; conferência visual integral ainda pendente.

## Gates observados — sem homologação

No commit de correção do lote `150fd2d57bf18e4de98ab9e6968faa6382a67b13`, os workflows **CI**, **PSCPP Integral Bank Audit**, **Full Question Bank Audit**, **Audit Main Question Banks** e **Validate PIANC 121 CGE Quarantine** estavam todos `in_progress` na última consulta.

No commit da revisão de distratores `68889950675d7b9a265676435ec8e06cc048c2b1`, a consulta de workflows ainda não retornou execuções. O status combinado **Vercel = failure**, apontando para o [limite de builds/deploys](https://vercel.com/estibordo?upgradeToPro=build-rate-limit). Não contornar a cota.

Nenhuma execução local de `npm run validate` ou `npm run build` foi comprovada. Aprovação de workflows em commits anteriores não homologa o HEAD final.

## Diagnóstico e reparo de falha real do gate

- O workflow **Full Question Bank Audit** no commit `150fd2d5` falhou por `EMPTY_OPTION` em `ANV-HENSEN-C03-L009-02`, conforme [run 40991950827](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40991950827). A inspeção posterior do JSON corrigido confirmou cinco alternativas preenchidas para o item.
- A revisão de 160 distratores no commit `68889950` também reparou essa alternativa vazia. Nesse commit, **Full Question Bank Audit** ([run 40992128909](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40992128909)) e **Audit Main Question Banks** ([run 40992129006](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40992129006)) foram aprovados. **CI**, **PSCPP Integral Bank Audit** e **Validate PIANC 121 CGE Quarantine** ainda estavam em execução na última consulta.
- Os gates precisam ser reconfirmados no HEAD documental final. **Vercel continua em failure** por cota de builds; sem Preview READY.

## Pendências e próxima execução

1. Verificar os cinco workflows e o Vercel Preview no HEAD final, sem desativar validações.
2. Revisar originalidade semântica de todas as 40 questões e qualidade dos distratores; atenção aos tópicos de vento, ferragens, tipos de assistência e aos itens factuais.
3. Conferir visualmente as páginas da obra; corrigir eventuais localizadores incorretos.
4. Homologar os 51 históricos ativos e preservar os 119 em quarentena.
5. Próxima automação: verificar se já existe `hensen-lote-010.json` antes de elaborar o Lote 010, sem refazer 001–009.
6. **PR #173 aberto; sem merge nem deploy em produção.**
