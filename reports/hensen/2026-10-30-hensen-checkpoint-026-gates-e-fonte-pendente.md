# Checkpoint HENSEN 026 — 2026-10-30 — gates do SHA 48b898 e bloqueio editorial

## Escopo e verificação
PR #173; Henk Hensen, *Tug Use in Port*, 4ª ed., capítulos 1–7 e 9. Consulta direta aos conectores GitHub e Vercel. Nenhum item alterado nesta execução.

## SHA verificado
- HEAD antes deste relatório: `48b898cf6b86452204226a797e0d5296450d98a6`.
- GitHub Actions: todos **completed/success** nesse SHA:
  - CI: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41092873370
  - Full Question Bank Audit: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41092873275
  - Audit Main Question Banks: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41092873218
  - PSCPP Integral Bank Audit: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41092873076
  - Validate PIANC 121 CGE Quarantine: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41092873174
- Preview Vercel **READY** para esse SHA: https://vercel.com/estibordo/estibordo-pscpp/4VqD3bQ5A7bcTokmNMNDUHDheWsT
- Production Vercel **READY** somente para `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ
- Comparação GitHub `main...audit/hensen-lote-001-20261029`: **268 à frente, 2 atrás**, status diverged; `main` atual `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, merge-base `37f945957d5319ade9c5cec447d41e67cc8fb378`. A descrição antiga do checkpoint 025 tratava `37f9459` como main; a comparação atual esclarece que era merge-base, não o HEAD atual de main.

## Revisão de escopo editorial
Arquivo `data/question-extensions/hensen-lote-022.json` consultado diretamente; contém IDs `ANV-HENSEN-C01-L022-01` a `-05` e os demais itens. Permanecem as suspeitas documentadas de equivalência semântica em `C01-L022-02`, `-03`, `-04` e revisão adicional de `-01`. A consulta do JSON confirma presença e enunciados, **não** valida a fonte primária nem autoriza substituições. Sem acesso comprovado nesta execução às páginas correspondentes do livro, não foram inventadas reformulações ou referências.
- IDs modificados: **nenhum**; antes/depois: não aplicável.
- Lotes: 001–022 (880 questões segundo inventário anterior); 119 históricos em quarentena reversível, 51 ativos sob revisão, sem alteração nesta execução.
- 2.558 HIGH globais previamente reportados continuam sem saneamento demonstrado; workflows verdes não equivalem a zero HIGH.

## Decisão
**Não fazer merge, não publicar Production, não reativar históricos.** Pendências: reparo fundamentado das sobreposições do Lote 022, auditoria editorial e bibliográfica, reconciliação da branch com main e nova verificação de gates e Preview para o SHA final. Este próprio commit documental cria outro HEAD, para o qual os gates ainda não estão verificados.
