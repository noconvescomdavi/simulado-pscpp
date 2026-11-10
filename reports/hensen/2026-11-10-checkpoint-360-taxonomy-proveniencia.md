# Checkpoint 360 — proveniência dos 1.327 erros de taxonomia (PR #173)

Data: 2026-11-10. Auditoria realizada nos logs do workflow PSCPP Integral Bank Audit do commit `38bed9cd142fb0939712556b5d3e6ea6db07c812`, [run 42822312692](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/42822312692).

## Diagnóstico reproduzível

* 1.327 questões **ativas** registradas com `chapter_id inexistente` no gate de taxonomia; todas as 1.327 assinaturas `[id, motivo]` foram encontradas no baseline da `main`, arquivo `data/audit-baselines/taxonomy-preexisting-main-20261110.json`, criado a partir do commit `8a41efb087641d95d4787a0ac476384b8634506c` e workflow `https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/42807202407`. O baseline da main contém 2.080 entradas, incluindo 753 arte-naval históricas; o normalizador específico de Fonseca V2 na branch HENSEN evita reportar parte desse estoque.
* Distribuição ativa: **Meteorologia e Oceanografia 855** (MEO 850 e MET 5), **Comunicações 397**, **Conhecimentos Gerais 49**, **Navegação em Águas Restritas 26**.
* A leitura direta dos quatro arquivos brutos `data/questions` identificou **seis combinações de publicação/capítulo** pendentes: `met-1::integral` 501, `met-0::integral` 299, `normam701::integral` 55, `radioperador::integral` 397, `normam224::integral` 49 e `normam501::integral` 26. Essas referências históricas integrais conflitam com a nova bibliografia detalhada introduzida na `main`. Não é possível atribuir automaticamente os capítulos corretos sem cotejo por questão.
* Quarentena histórica do gate anterior: **464** inválidas (fora das 1.327 ativas); nenhuma reativada nem suprimida.

## Mudança de gate e responsabilidade editorial

Portado para `scripts/validate-question-taxonomy.mjs` o mecanismo existente na `main` de comparar **assinatura exata ID + razão** com baseline **congelado**. Preservados os testes de canonicalização Fonseca V2 e sua restrição por fonte, o teste de extensões Santos, a geração de relatório e reprovação imediata por qualquer violação nova. Acrescentado ao relatório o número de canonicalizações, baseline não consumido e proveniência do baseline. O baseline inteiro de 2.080 exceções é preservado para leitura e remediação dirigida: **não equivale à correção nem à homologação das 1.327 questões**. Todo erro não listado mantém gate vermelho.

## Restrições

* Apenas script, baseline, e este relatório são alterados nesta etapa. Nenhuma questão do banco é reescrita, reclassificada, removida, publicada ou homologada.
* Requer verificar workflow no HEAD final e a execução contra o merge sintético GitHub; PR ainda diverge da `main`, o que pode impedir mergeabilidade.
* Permanecem abertas a inspeção visual, deduplicação semântica e conferência dos 119 itens históricos HENSEN em quarentena. **Não efetuar merge ou Vercel Production** sem homologação editorial e gates.
