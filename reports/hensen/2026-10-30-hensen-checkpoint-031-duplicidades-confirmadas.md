# HENSEN — Checkpoint 031 — 2026-10-30

## Escopo
PR #173, branch `audit/hensen-lote-001-20261029`. Auditoria exclusivamente de Henk Hensen, *Tug Use in Port*, 4ª edição, capítulos 1–7 e 9. Nenhum merge autorizado por este registro.

## Verificações efetivamente executadas
- GitHub Actions do commit `e16257ee81953064165148983e99b6b0dded251d`: cinco execuções concluídas com `success`: [CI 41133992690](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41133992690), [Full Question Bank Audit 41133992693](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41133992693), [Audit Main Question Banks 41133992726](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41133992726), [PSCPP Integral Bank Audit 41133992849](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41133992849), [Validate PIANC 121 41133992886](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41133992886).
- Compare GitHub `main...audit/hensen-lote-001-20261029`: `ahead_by=273`, `behind_by=2`; base `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`; merge-base `37f945957d5319ade9c5cec447d41e67cc8fb378`.
- Conteúdo de `data/question-extensions/hensen-lote-001.json`, `002.json`, `005.json`, `011.json` e `022.json` lido diretamente da branch. A fonte primária integral não foi reaberta neste checkpoint; localizadores são metadados do banco, NÃO comprovação bibliográfica independente.

## Auditoria comparativa — capítulo 1, lote 022
| ID sob revisão | ID anterior comparado | Evidência objetiva | Parecer |
|---|---|---|---|
| ANV-HENSEN-C01-L022-01 | ANV-HENSEN-C01-L002-01 | Ambos avaliam consequências da evolução/manobrabilidade dos rebocadores para a escolha da assistência; §1.1, p. 3 | Sobreposição conceitual; requer discriminar mecanismo operacional específico antes de homologar |
| ANV-HENSEN-C01-L022-02 | ANV-HENSEN-C01-L001-01 | Ambos perguntam a vantagem de assistência por ambos os bordos no píer em T versus cais contínuo; §1.2.1, p. 4 | Duplicidade semântica direta, apesar da troca de cenário |
| ANV-HENSEN-C01-L022-03 | ANV-HENSEN-C01-L011-01 | Ambos abordam erro de postergar especificação/aquisição de rebocadores até após inauguração de nova bacia; §1.2.1, p. 5 | Duplicidade semântica direta |
| ANV-HENSEN-C01-L022-04 | ANV-HENSEN-C01-L005-03 e ANV-HENSEN-C01-L002-02 | Todos cobram compatibilidade da frota com diversidade de perfis de navios; §1.2.3, p. 6 | Sobreposição forte, exige nova competência testada |

Os quatro IDs L022 permanecem `active: true`, `validation_status: pending_editorial_review`, `validation.duplicate_checked: false` no JSON consultado. A classificação existente é `arte-naval/hensen-tug`. **Não marcar como `duplicate_checked: true`**: o cotejo de fonte e a reformulação ainda faltam.

## Antes/depois e mudanças
Antes: quatro questões do lote 022 com sobreposições pendentes e sem confirmação independente de fonte neste checkpoint.
Depois: mesmo conteúdo e mesmos estados, agora com correspondências de IDs anteriores explicitamente verificadas e decisão editorial documentada. Nenhum ID alterado, nenhuma questão criada, nenhuma quarentena convertida em reparo definitivo.

## Pendências e critérios de saída
1. Reabrir a edição integral e conferir texto e páginas antes de substituir as quatro competências redundantes por questões verdadeiramente distintas; testar alternativas, gabaritos, semântica e formato.
2. Revisar gradualmente os 119 históricos em quarentena reversível, com justificativa por ID.
3. Resolver ou classificar adequadamente os achados HIGH globais; os cinco workflows verdes não equivalem a aprovação editorial.
4. Reconciliar a branch com a `main`, verificar mergeabilidade e todos os gates do HEAD final, inclusive status Vercel no GitHub; confirmar Production READY para o SHA efetivamente publicado após eventual merge. Não confundir Preview READY com Production.
5. Não criar lote 023 antes da conclusão das pendências editoriais prioritárias.

PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173

Nenhuma publicação Production, merge, alteração de teste ou desativação de auditoria nesta execução.
