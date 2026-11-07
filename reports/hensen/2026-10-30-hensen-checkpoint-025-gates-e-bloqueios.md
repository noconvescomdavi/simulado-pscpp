# Checkpoint HENSEN 025 — 2026-10-30 — gates e bloqueios editoriais

## Escopo
PR #173; obra Henk Hensen, *Tug Use in Port*, 4ª ed., capítulos 1–7 e 9. Checkpoint documental sem alteração de questões, gabaritos ou estados de quarentena.

## HEAD verificado
- HEAD inicial: `8cc2a93e0e85c15a32c0610ac7d77b2b0edfa375`.
- PR aberto, não integrado; `mergeable=true` segundo GitHub.
- Comparação `main...audit/hensen-lote-001-20261029`: **267 commits à frente e 2 atrás**; base `main` SHA `37f945957d5319ade9c5cec447d41e67cc8fb378`.
- Cinco workflows no HEAD inicial, todos `completed/success`:
  - CI: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41083793596
  - Full Question Bank Audit: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41083793521
  - Audit Main Question Banks: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41083793773
  - PSCPP Integral Bank Audit: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41083793588
  - Validate PIANC 121 CGE Quarantine: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41083793565
- Vercel Preview READY para o mesmo HEAD: https://vercel.com/estibordo/estibordo-pscpp/A7K8py7VBF6zf53XUTuiBGBuwpWc
- Último deployment Production listado READY corresponde ao SHA `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, **não** ao HEAD HENSEN e **não** ao SHA atual de main: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ

## Pendências e decisão
- Questões `ANV-HENSEN-C01-L022-02`, `ANV-HENSEN-C01-L022-03`, `ANV-HENSEN-C01-L022-04`: sobreposições semânticas já documentadas no checkpoint 023, ainda não reparadas. `ANV-HENSEN-C01-L022-01`: duplicidade potencial, sem conclusão definitiva.
- 119 históricos em quarentena reversível; 51 históricos ativos ainda sob revisão. Quarentena não equivale a reparo.
- Achados HIGH globais anteriormente relatados (2.558) permanecem pendentes de saneamento; `success` do workflow não significa zero achados.
- Falhas históricas de Study Plan V3 e auditoria não reaparecem no HEAD inicial; não é prova suficiente de inexistência de problemas editoriais.
- **Decisão: NÃO fazer merge nem publicar Production.** Gates do HEAD anterior estavam verdes, mas persistem pendências editoriais, divergência com main e Production não alinhada.
- Nenhuma questão foi alterada neste checkpoint; portanto, não há IDs com antes/depois de conteúdo. Novo commit documental exige nova confirmação de gates para seu próprio SHA.

## Próximas ações
1. Revisar diretamente a fonte e reformular genuinamente as sobreposições do lote 022, com antes/depois individual.
2. Executar auditorias semânticas e bibliográficas e testes no novo SHA.
3. Reconciliar com main sem suprimir testes, confirmar Preview READY no SHA final e reavaliar segurança editorial.
4. Prosseguir revisão individual dos 119 históricos; somente recuperar itens validados.
