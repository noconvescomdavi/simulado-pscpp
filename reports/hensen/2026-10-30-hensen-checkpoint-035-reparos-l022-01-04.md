# HENSEN — Checkpoint 035 — 2026-10-30

## Escopo e fonte
PR #173, branch `audit/hensen-lote-001-20261029`. Obra: Henk Hensen, *Tug Use in Port*, quarta edição (2021), capítulos 1–7 e 9. Consultado PDF primário no Google Drive, ID `1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9`; verificadas as seções §1.2.2 (p. 5 impressa, PDF p. 18) e §1.2.4 (p. 6 impressa, PDF p. 19).

## Correções efetivas
Arquivo `data/question-extensions/hensen-lote-022.json`.
- `ANV-HENSEN-C01-L022-01`: ANTES avaliação genérica da modernização e redução da frota, sobreposição com L002-01 (§1.1 p.3). DEPOIS cenário de estuário, maré, ponte e eclusa, exigindo janelas operacionais e seleção de tipos distintos de rebocadores por trecho (§1.2.2 p.5). Gabarito A preservado.
- `ANV-HENSEN-C01-L022-04`: ANTES compatibilidade de defensas e superestrutura com diferentes perfis de navio, sobreposição com L005-03 e L002-02 (§1.2.3 p.6). DEPOIS serviços adicionais (guindastes flutuantes, plataformas, barcaças, combate a incêndios), exigindo reavaliar porte, manobrabilidade, equipamentos e métodos (§1.2.4 p.6). Gabarito D preservado.

Commit de conteúdo: https://github.com/noconvescomdavi/simulado-pscpp/commit/547d43b7babcb817e26d1feda824d3a7b8091b51

As duas reformulações anteriores foram realizadas em `aaf2491f6a7d205dd8c2554dbd0e5ac81c7856ea`: L022-02 (ausência de lanchas de amarração) e L022-03 (blackout). Assim, os quatro IDs priorizados receberam alterações substantivas. Nenhuma questão foi declarada definitivamente sem duplicidade: `validation.duplicate_checked=false` e `pending_editorial_review` foram preservados.

## Gates e limites
O HEAD documental anterior `851fac9ab77b20b95c484ea637a80f616fd9c246` teve cinco workflows com `success`: CI, Full Question Bank Audit, Audit Main Question Banks, Validate PIANC 121 CGE Quarantine e PSCPP Integral Bank Audit. A comparação `main...branch` anterior à presente alteração indicou 276 commits à frente, dois atrás. Estes resultados **não** certificam o novo HEAD. Sem execução local de testes, sem confirmação de Vercel Preview/Production para o novo SHA. Não houve merge nem publicação Production.

## Pendências
Varredura semântica integral dos lotes 001–022, revisão bibliográfica/editorial dos novos enunciados, tratamento individual dos 119 históricos em quarentena, classificação dos achados HIGH globais, reconciliação com main, gates do HEAD final e verificação Production READY para SHA efetivamente integrado. Não criar lote novo nem desativar tarefa enquanto pendências persistirem.
