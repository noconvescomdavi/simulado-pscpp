# ESTIBORDO/PSCPP — HENSEN — checkpoint 008 (2026-10-29)

**Escopo restrito:** Henk Hensen, *Tug Use in Port*, 4ª ed. revisada (2021), capítulos 1–7 e 9, taxonomia `arte-naval / hensen-tug`. PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173 . Branch: `audit/hensen-lote-001-20261029`.

**Decisão:** **NÃO REALIZAR MERGE / NÃO PUBLICAR PRODUCTION**. A homologação bibliográfica/semântica independente de todo o corpus permanece pendente; o HEAD alterado neste checkpoint ainda não tinha todos os gates finalizados.

## Estado remoto anterior às correções

- PR #173: `open`, `merged=false`, `mergeable=true`; HEAD inicial deste checkpoint `f7f0fea89cdcadb02664fa2a6618d3c3b42d7df2`.
- Nesse SHA, cinco workflows estavam **SUCCESS**:
  - [CI #40974759287](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40974759287)
  - [Audit Main Question Banks #40974759224](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40974759224)
  - [Full Question Bank Audit #40974759229](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40974759229)
  - [Validate PIANC 121 #40974759203](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40974759203)
  - [PSCPP Integral Bank Audit #40974759255](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40974759255).
- Vercel Preview **READY** para exatamente `f7f0fea8...`: https://vercel.com/estibordo/estibordo-pscpp/4bfsKvrPu5crrEspFQebZCGMVFJK . GitHub Combined Status ainda retornava Vercel `pending`, que não deve ser confundido com o estado do deployment.
- Vercel **Production READY somente para a main `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`**, sem HENSEN: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ .

## Correção individual fundamentada na fonte primária

**ID:** `ANV-HENSEN-C09-L006-05`, tema “Limitação da escolta ativa em gelo muito pesado”.

O PDF original da 4ª edição, obtido diretamente do acervo bibliográfico em https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view, foi confrontado com o enunciado e a resposta correta. A passagem da **página impressa 265 / PDF 278** explica que, sob gelo extremo, quando o navio quase não consegue avançar, a escolta ativa não é aplicável e o próprio gelo o imobiliza após avaria. **A passagem pertence à seção §9.6.2**, pois antecede os títulos §9.6.3 (“Escort tugs in use”) e §9.6.4 (“Training and pilotage”), ambos posteriores no texto.

- **Antes:** `source.locator = "Chapter 9, §9.6.4, p. 265 (PDF p. 278)"` — seção errada.
- **Depois:** `source.locator = "Chapter 9, §9.6.2, p. 265 (PDF p. 278)"` — seção correta.
- **Preservados:** enunciado, cinco alternativas, gabarito **B**, explicação, ID, estado ativo, taxonomia e número da página.
- **Commit de conteúdo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/57aeb71ca9f58368b54fb6c28d36964a08518ead .
- **Relatório individual atualizado:** `reports/hensen/2026-10-29-lote-006-auditoria.md`, commit https://github.com/noconvescomdavi/simulado-pscpp/commit/934faa4b52e283a7373c1e64b1643e470929ddc6 .
- **Natureza:** correção genuína de rastreabilidade bibliográfica, não reescrita de conteúdo nem reativação de quarentena.

## Inventário e pendências

- Lotes 001–006: **240 questões novas** (40 por lote, cinco por capítulo por lote), segundo relatório do Lote 006 e PR #173; gabaritos equilibrados em **48 por letra**. O novo lote 006 já existia antes desta execução; **nenhum ID ou lote foi recriado**.
- Histórico HENSEN: **170 questões**, com **119 em quarentena reversível** e **51 ativas ainda não homologadas**. A candidata `ANV-B010-16` permanece em quarentena. Nenhuma histórica foi reativada neste checkpoint.
- Total declarado: **410 registros HENSEN brutos**, 291 marcados ativos antes dos filtros do runtime.
- Os achados HIGH do Full Question Bank Audit global não foram tratados como sanados. **Workflow PASS não é homologação editorial**. A revisão individual das demais questões, equivalência semântica e rastreabilidade ainda precisam continuar.

## Gates após os commits

O HEAD imediatamente após o relatório individual era `934faa4b52e283a7373c1e64b1643e470929ddc6`, PR aberto e mergeável. Na consulta:
- CI #40975803880: **in_progress**.
- Full Question Bank Audit #40975803948: **in_progress**.
- Audit Main Question Banks #40975803936: **in_progress**.
- PSCPP Integral Bank Audit #40975803882: **in_progress**.
- Validate PIANC 121 #40975804022: **queued**.
- Vercel Preview `dpl_6g6a2YmgNexL3qE7zBMuE58fkjZc`: **QUEUED**.
- Vercel Production: **READY apenas para a main a03ccf9**, não para o PR.

**A criação deste próprio checkpoint gera novo commit**, exigindo nova conferência do HEAD e dos checks. Não autoriza merge com base nos SUCCESS do SHA anterior.

**Próxima execução:** verificar o HEAD final, todos os workflows e Preview; auditar independentemente as fontes e duplicações conceituais dos lotes, revisar os 51 históricos ativos e reparar gradualmente os 119 em quarentena sem reativação prematura. Persistir cada ID e antes/depois. Só integrar após todos os gates e homologação editorial aprovados; após eventual merge, exigir Production READY no SHA publicado.
