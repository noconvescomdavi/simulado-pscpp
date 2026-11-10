# HENSEN — Checkpoint 050 — saneamento de enunciados (31/10/2026)

## Escopo e evidências
PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173
Branch: `audit/hensen-lote-001-20261029`
HEAD após correções: `2a6d870ffe1fcbbdfa252500907481c3bde670cd`
Origem: artefato `full-question-bank-audit` do commit `b9c9020575096609dc5b7eb55f05a4b6c073a0b1`, com 2.558 achados HIGH, zero CRITICAL, quatro `LOCATOR_DEPENDENT_STEM` identificados nos lotes HENSEN 010–012.

## Alterações editoriais por ID — antes / depois

| ID | Antes | Depois | Motivo | Gabarito |
|---|---|---|---|---|
| ANV-HENSEN-C01-L010-05 | Uma proposta de rebocador possui uma unidade propulsora na região de vante e outra na região de ré. Como esse arranjo se enquadra na enumeração geral de tipos apresentada no capítulo 1 de Hensen? | Na avaliação de um projeto de rebocador portuário, identifica-se uma unidade propulsora na região de vante e outra na região de ré. Qual alternativa classifica corretamente essa configuração e a distingue da disposição de propulsores do Rotortug? | Substituir remissão ao capítulo por classificação operacional explícita. | D, preservado |
| ANV-HENSEN-C09-L010-05 | No esquema de resposta e escolta descrito no capítulo 9, o que distingue um Escort Response Vessel de um rebocador que apenas informa a posição do gelo? | Durante uma operação de escolta em área sujeita a derramamento de óleo, é designado um Escort Response Vessel. Qual capacidade operacional de resposta ambiental diferencia essa embarcação de um rebocador que somente comunica a posição do gelo? | Definir o contexto ambiental no próprio enunciado. | B, preservado |
| ANV-HENSEN-C01-L011-03 | Um porto comercial passa a receber submarinos e porta-aviões, além de navios mercantes. Qual conclusão é coerente com os exemplos apresentados por Hensen ao encerrar o capítulo de seleção de rebocadores? | Um porto comercial passa a receber submarinos e porta-aviões, além de navios mercantes. Ao definir os rebocadores e os métodos de assistência para essa frota, qual conclusão operacional deve orientar a seleção? | Evitar dependência da localização do exemplo no livro. | E, preservado |
| ANV-HENSEN-C01-L012-03 | Um porto recebe graneleiros, ro-ro e navios de gás com cascos e superestruturas diferentes. Além da potência, que itens devem ser revistos na especificação dos rebocadores? | Um porto recebe graneleiros, navios ro-ro e navios de gás com diferentes geometrias de casco e superestrutura. Ao especificar rebocadores adequados para contato e assistência a essa frota heterogênea, quais características devem ser avaliadas além da potência? | Especificar interfaces e operação a avaliar, evitando resposta genérica. | E, preservado |

## Preservação e limitações
Somente o campo `question` foi alterado intencionalmente. Permanecem inalterados IDs, alternativas, gabaritos, justificativas, classificação `II — Arte Naval` / `hensen-tug`, localizadores, flags de revisão e quarentena. Os quatro localizadores já registrados são: cap. 1 §1.3 p. 7; cap. 9 §9.7 p. 268; cap. 1 §1.5 p. 8; cap. 1 §1.2.3 p. 6. **Não houve cotejo independente destas páginas com o exemplar primário nesta execução**; `duplicate_checked=false` continua verdadeiro.

Commits: [lote 010](https://github.com/noconvescomdavi/simulado-pscpp/commit/3942154a09f1c0f01b6c99c77fba112a73770651), [lote 011](https://github.com/noconvescomdavi/simulado-pscpp/commit/b3515eea49937a3b63fc15ef307f507e2425ee79), [lote 012](https://github.com/noconvescomdavi/simulado-pscpp/commit/2a6d870ffe1fcbbdfa252500907481c3bde670cd).

## Gates e bloqueios
Os cinco workflows estavam verdes para o HEAD anterior `b9c9020575096609dc5b7eb55f05a4b6c073a0b1`; **isso não valida os novos commits**. Reexecutar CI, auditorias e verificação semântica e comparar resultados por ID, inclusive duplicatas entre arquivos. O auditor global usa uma expressão de detecção de referências como `capítulo 1`, sem objeto técnico explícito; a revisão remove essa dependência sem desabilitar a regra.

Os 119 históricos permanecem em quarentena reversível. Não foram reativados nem considerados corrigidos. Permanecem pendentes: origem/preexistência dos achados globais, revisão bibliográfica independente, branch atualizada em relação à main, gates verdes no HEAD final, mergeabilidade e Vercel Production READY para o SHA de produção. **Merge e deploy não autorizados neste checkpoint.**
