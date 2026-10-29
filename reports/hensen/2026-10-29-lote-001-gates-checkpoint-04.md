# ESTIBORDO/PSCPP — HENSEN: checkpoint 004 (CI de Legislação e bloqueio de merge)

**Data da verificação:** 2026-10-29 (America/Sao_Paulo). **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`. **HEAD auditado antes da correção:** `9c937fc63698d8034fa51875c0fb43b5764be8a0`.  
**Correção publicada:** https://github.com/noconvescomdavi/simulado-pscpp/commit/92a2752f007ec47aee3f3e608140b152d9461776 .

## Falha reproduzida em CI remoto e correção

- **CI #2110**, https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40940174183 : o job `validate` passou por Study Plan V3, Google Drive library invariants, algoritmos, fidelidade oficial, bancos, formatação, proposições, auditoria semântica, auditoria de runtime e **build**; falhou em **Legislation notebook content and editorial regression**.
- **Causa exata:** `scripts/test-legislation-content-restorations.mjs:20` exigia `runtime.length === 826`; a fonte ativa agora apresenta **1087** questões de Legislação. Erro `1087 !== 826`. O teste utilizava contagem histórica congelada e não demonstrou perda de questões. A falha é **externa aos 40 itens HENSEN do Lote 001 e aos 40 do Lote 002**.
- **Antes:** igualdade de cardinalidade fixa `826`, que reprova a inclusão legítima de novas questões.
- **Depois:** importação independente de `data/questions/legislacao-regulamentacao.json` e de `isQuestionActive`; validação de **unicidade de IDs da fonte e do runtime**, preservação individual de **todos os IDs ativos da fonte canônica** no runtime, e cardinalidade mínima calculada pela fonte. Mantidas as verificações de **322 questões restauradas**, enunciados, gabaritos, cinco alternativas, explicações, auditoria de vazamento e idempotência. Não foram alterados os conteúdos nem os gabaritos de Legislação.
- **Teste remoto da correção:** CI #2111 https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40943014239 — **aguardando conclusão** na gravação deste checkpoint. Não declarar correção validada antes do resultado.

## Inventário e integridade HENSEN

- **170 questões históricas:** 119 em **quarentena reversível** e 51 ainda ativas, pendentes de revisão bibliográfica individual. **Antes/depois nesta execução:** 119 `quarantined → quarantined`; 51 `active → active`. Nenhuma reativação ou correção de questão antiga foi realizada.
- **Lote 001:** 40 IDs `ANV-HENSEN-C{01,02,03,04,05,06,07,09}-L001-{01..05}`, sem alteração de enunciado, opções, gabarito, explicação ou localizador nesta execução. Relatório por ID: https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-29-lote-001-auditoria.md .
- **Lote 002:** 40 IDs `ANV-HENSEN-C{01,02,03,04,05,06,07,09}-L002-{01..05}`, já criados e integrados à branch **por commits anteriores a esta execução**, sem merge. Relatório individual por ID, tema, página e gabarito: https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-29-lote-002-auditoria.md . **Antes/depois nesta execução:** nenhum desses 40 IDs foi modificado. Não iniciar Lote 003 antes da liberação do PR.
- Inventário nominal esperado na branch: **250 questões HENSEN**, das quais **131 ativas** e **119 em quarentena** (contagem declarada a confirmar por validação de runtime; não equivale a publicação).
- A auditoria bibliográfica individual dos 119 e a revisão semântica completa dos lotes permanecem pendentes. Não confundir a verificação estrutural dos lotes com homologação editorial integral.

## Gates e publicação

| Gate no HEAD `9c937fc` | Resultado verificado |
|---|---|
| Full Question Bank Audit | PASS — https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40940174199 |
| Audit Main Question Banks | PASS — https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40940174030 |
| PSCPP Integral Bank Audit | PASS — https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40940174096 |
| Validate PIANC 121 CGE Quarantine | PASS — https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40940174117 |
| CI | FAIL — https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40940174183 |
| Vercel Preview | READY para `9c937fc` — https://vercel.com/estibordo/estibordo-pscpp/7eQ9vGB8hNEqYzyTSYCi2yEd3ztP |
| Vercel Production | READY apenas para `main` `a03ccf972a021f9a2c8fee3ba09de3271fa089a7` — https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ |

**Decisão:** PR #173 aberto, mergeable=true na última consulta, **merge bloqueado** até todos os gates do **HEAD final** verdes e revisão de publicação. O Preview READY não é Production. Nenhum merge nem promoção foi solicitado nesta execução.

**Próxima execução:** acompanhar CI #2111 e os demais workflows do novo HEAD; se surgir falha, ler job/log e corrigir causa real sem desabilitar testes. Reconfirmar head, mergeabilidade, revisão editorial e Production SHA antes de qualquer merge. Não iniciar lote adicional com PR bloqueado.

## Adendo: regressão encontrada na própria correção e refinamento

- A **CI #2111** https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40943014239 falhou após o build: `LEG-0986: canonical active legislation question missing from runtime`. A inspeção do JSON canônico comprovou que `LEG-0986` existe na fonte (`data/questions/legislacao-regulamentacao.json`), mas a política editorial pode rejeitar itens após restauração/normalização. A primeira versão da correção comparava a fonte **crua** ao runtime **filtrado**, gerando um falso positivo. O arquivo de teste antigo, com a contagem `826`, também existe inalterado na `main` (blob `1115e46366a4cf9f2ca8948026d7f599060b2441`), confirmando a preexistência da asserção congelada.
- **Correção refinada:** https://github.com/noconvescomdavi/simulado-pscpp/commit/15ee85b5284a9b21884b55cf20f751353402cf91 . O teste agora reconstitui a sequência real de restaurações, canonicalização, normalização e revisão editorial **antes** de classificar IDs como elegíveis. Para cada ID elegível, exige presença no runtime; para cada ID excluído, exige motivo explícito da política de qualidade e ausência no runtime. Mantém checagens de unicidade, conservação de cardinalidade da fonte, todas as 322 restaurações e as verificações editoriais originais. **Não houve reativação nem modificação de qualquer questão** para satisfazer o teste.
- A CI do novo HEAD ainda precisa ser concluída. **Não considerar esse refinamento homologado até a confirmação remota.** Os demais gates de `db31c295` passaram, inclusive Full Question Bank Audit com **0 críticos, 2554 HIGH** (812 localizadores, 1483 enunciados duplicados, 258 modelos genéricos, 1 anomalia histórica de alternativas). Esses achados HIGH não foram declarados saneados.
