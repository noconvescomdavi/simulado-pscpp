# ESTIBORDO/PSCPP — Checkpoint HENSEN 018 — correção de localizador no Lote 017

**Data:** 2026-10-30, Brasília. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 . **Branch:** `audit/hensen-lote-001-20261029`.

## Alteração efetiva

Revisão de `ANV-HENSEN-C03-L017-02`: enunciado tornou explícita a **proposta** de usar Dead Slow Ahead com espringue (não uma manobra recomendada); explicação passou a recomendar rebocadores para navios de grande potência inicial; referência corrigida de **§3.3.2, p. 88 (PDF 101)** para **§3.3.6, p. 92 (PDF 105)**, com base no PDF primário da 4ª edição de Hensen: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . Relatório com antes/depois: `reports/hensen/2026-10-30-lote-017-auditoria.md` (revisão 03).

**Verificação de escopo:** exatamente 3 campos alterados em 1 ID, sem modificar 39 outras questões. Permanecem 17 lotes × 40 = **680 questões novas** e **170 históricas**, das quais **119 em quarentena reversível** e **51 ativas ainda sem homologação bibliográfica integral**. Cinco alternativas distintas e 8 gabaritos por letra A–E no Lote 017. A quarentena não é reparo definitivo.

## Gates conferidos antes da alteração — HEAD `9d59ae1cb21d6bcc69d8df90e80b1b3cd8e71feb`

Todos os cinco workflows **success**: Full Question Bank Audit https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41034421850 ; CI https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41034421961 ; Audit Main Question Banks https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41034421881 ; PSCPP Integral Bank Audit https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41034421815 ; Validate PIANC 121 https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41034421929 . Full Audit: **2.558 HIGH, 0 CRITICAL**, guard HENSEN **17 lotes/680 questões/0 falhas**. Aprovação de workflow não elimina os HIGH.

**Vercel Preview READY no SHA anterior** `9d59ae1cb21d6bcc69d8df90e80b1b3cd8e71feb`: https://vercel.com/estibordo/estibordo-pscpp/EwkwR6BxAu3dTZuEvZ1GJTjErY2V . **Production READY** exclusivamente para `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ . Não é deploy dos lotes HENSEN.

**Depois deste commit:** workflows e Preview do novo SHA ainda precisam ser reconfirmados. Branch **225 commits à frente e 2 atrás de main** antes da alteração; revisão independente das questões, 51 históricos ativos sem páginas precisas, 119 em quarentena, triagem de 2.558 HIGH e dependências de segurança continuam pendentes. **Merge e publicação bloqueados**. Não foram desabilitados testes ou relaxadas validações.

## Próximos passos

Revalidar todos os gates no SHA final; corrigir outras referências por cotejo direto; continuar revisão semântica e históricos. Não iniciar Lote 018 até saneamento editorial prioritário. Registrar links de commit final na discussão do PR.
