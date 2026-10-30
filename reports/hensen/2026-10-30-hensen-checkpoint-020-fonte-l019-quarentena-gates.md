# ESTIBORDO/PSCPP — Checkpoint HENSEN 020 — correção de fonte e triagem editorial

**Data:** 2026-10-30, America/Sao_Paulo. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173. **Branch:** `audit/hensen-lote-001-20261029`.

## Escopo executado e fonte primária

Consulta direta ao arquivo *Tug Use in Port*, Henk Hensen, quarta edição (2021), no Google Drive: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view. O texto da obra, no **capítulo 1, §1.2.4, página impressa 6 (PDF p. 19)**, cita atividades em SPM, F(P)SO e instalações offshore e a necessidade de requisitos próprios de rebocadores. A seção **§1.2.1, p. 4** trata de categorias de portos e seus acessos; não é a âncora correta para a afirmação específica da questão abaixo.

## Alteração individual efetivada

**ID `ANV-HENSEN-C01-L019-01`** — arquivo `data/question-extensions/hensen-lote-019.json`.

- **Antes — localizador:** `Chapter 1, §1.2.1, p. 4 (PDF p. 17)`.
- **Depois — localizador:** `Chapter 1, §1.2.4, p. 6 (PDF p. 19)`.
- **Antes — explicação:** "O §1.2.1 distingue instalações remotas, como SPMs e F(P)SOs/FLNGs, cujos requisitos de rebocagem dependem das condições e do tipo de operação."
- **Depois — explicação:** "Hensen inclui atividades em monoboias SPM e unidades offshore F(P)SO/FLNG entre os serviços que exigem avaliação específica do tipo e porte do rebocador, manobrabilidade, equipamentos e método de reboque. A simples analogia com um cais convencional não demonstra aptidão operacional. Fonte: capítulo 1, §1.2.4, p. 6 (PDF p. 19)."
- **Justificativa:** corrigir atribuição bibliográfica indevida, sem mudar o sentido operacional nem inventar uma passagem na seção antiga.
- **Preservados:** ID, enunciado, alternativas A–E, gabarito **C**, classificação `arte-naval/hensen-tug`, `active=true`, `validation_status=pending_editorial_review` e `duplicate_checked=false`. **Não homologada semanticamente**.
- **Commit de conteúdo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/f0ee063f83a6a50e5d03547cf7d2ef57be69d5ad.
- **Relatório individual retificado:** https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-30-lote-019-auditoria.md. Correção documental: https://github.com/noconvescomdavi/simulado-pscpp/commit/11ecabc91a58845738e45f99fe247c5ff098375d e retificação do ID cruzado: https://github.com/noconvescomdavi/simulado-pscpp/commit/b48d840b0ac9e226034a1f5f74a95bc0178fd29a.

## Validações locais de estrutura

No arquivo do Lote 019, após a edição: **40 registros e 40 IDs únicos**, cinco alternativas textualmente distintas por questão e gabaritos **A=8, B=8, C=8, D=8, E=8**. Não foi alterado o número de questões nem houve criação de Lote 020. A inspeção textual da fonte **não substitui** conferência visual de todas as páginas ou revisão editorial independente.

## Equivalência semântica — pendências explícitas

- `ANV-HENSEN-C01-L019-01`: sobreposição temática a reexaminar com `ANV-HENSEN-C01-L013-04`, `ANV-HENSEN-C01-L007-02` e `ANV-HENSEN-C01-L010-02`. A correção de página **não resolve** a redundância.
- `ANV-HENSEN-C01-L019-02`: acesso bilateral em píer/dolphins já aparece em `ANV-HENSEN-C01-L001-01` e `ANV-HENSEN-C01-L015-02`.
- `ANV-HENSEN-C01-L019-04`: familiarização após mudança de frota já aparece em `ANV-HENSEN-C01-L002-04`, `ANV-HENSEN-C01-L007-04` e `ANV-HENSEN-C01-L018-04`.
- `ANV-HENSEN-C01-L013-01` e `ANV-HENSEN-C01-L013-02` continuam com sobreposição identificada em checkpoints anteriores. **Nenhuma foi declarada original ou corrigida nesta execução.**

## Revisão individual de históricos em quarentena — sem reativação

- `ANV-B010-01`: antes e depois permanece `active=false`, `validation_status=quarantined`, localizador genérico `Chapters 4–8`. As cinco alternativas versam sobre elementos estruturais gerais do casco; várias são simultaneamente verdadeiras e a obra de Hensen não sustenta o enunciado como está. **Decisão:** não recuperável por ajuste cosmético; exige reescrita integral e nova âncora HENSEN, com comparação de conceitos antes de eventual reativação.
- `ANV-B010-02`: antes e depois permanece `active=false`, `validation_status=quarantined`, localizador genérico `Chapters 4–8`. As alternativas descrevem cavernas, vaus, sicordas e longarinas, sem discriminação unívoca nem referência específica a Hensen. **Decisão:** manter quarentena até reescrita integral com fonte e homologação. Não se confunde triagem com correção definitiva.

**Inventário:** 19 lotes novos (760 questões propostas); 170 históricas, sendo 119 em quarentena reversível e 51 ativas ainda não homologadas integralmente. Os 119 registros não foram apagados nem reativados.

## Gates, origem de falhas e publicação

- **SHA anterior `d3bbe833a694a6239638a400ecc2905ee3c44b79`:** os cinco workflows GitHub Actions retornaram `success` (CI, Full Question Bank Audit, Audit Main Question Banks, PSCPP Integral Bank Audit e Validate PIANC 121). Isso não equivale a sanar os achados editoriais globais.
- **Após a alteração de conteúdo `f0ee063`:** os cinco workflows foram observados em `queued`/`in_progress`, sem conclusão na consulta; a criação deste relatório altera novamente o HEAD, exigindo nova checagem.
- **Full Audit:** o checkpoint anterior registrou **2.558 HIGH e 0 CRITICAL** em escopo global de 172 arquivos/26.265 questões. O arquivo versionado `reports/full-question-bank-audit.json` em `main` é de 2026-09-28 e abrange só `data/questions` (283 HIGH); portanto não é comparação equivalente. Não há base para atribuir todos os 2.558 achados à branch ou declarar todos preexistentes.
- **Study Plan V3 invariants:** passou nos workflows recentes, mas a causa histórica da falha original não foi demonstrada apenas por essa passagem.
- **Vercel:** o status GitHub no SHA de conteúdo indicava `failure` com URL de limite de builds (`https://vercel.com/estibordo?upgradeToPro=build-rate-limit`); a consulta por SHA `f0ee063` não encontrou Preview READY. O último Preview READY consultado era de commit anterior, `7003450044103fd8a40c626a49e3b4f514c4e043`, não do HEAD deste relatório.
- **Production:** último deployment READY observado para `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ. A base do PR estava em `main@37f945957d5319ade9c5cec447d41e67cc8fb378`. **Production não corresponde ao commit atual da main nem à branch HENSEN.**
- A branch estava **236 commits à frente e 2 atrás da main** antes das correções; PR aberto, `mergeable=true` na consulta após o commit de conteúdo, mas com pendências de gates, divergência, conteúdo e Preview. **Não autoriza merge.**

## Decisão e próxima prioridade

**MERGE BLOQUEADO; SEM PUBLICAÇÃO EM PRODUCTION.** Reconfirmar todos os gates do HEAD final, resolver o bloqueio legítimo do Preview, reconciliar a base, corrigir duplicidades conceituais e homologar a bibliografia antes de considerar integração. Não desabilitar auditorias nem transformar `quarantined` em `approved` sem revisão. Nenhum novo lote foi iniciado neste checkpoint.
