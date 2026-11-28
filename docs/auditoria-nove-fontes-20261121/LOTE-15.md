# LOTE-15 — reconciliação incremental PR #275

Base main: `1f0d147638d6521fd73ffe3a6d9a0081f337a1c0`. Fonte: `data/question-restorations/manobrabilidade-msc137-lote-17.json`, blob `c545586e771673cbef7777736f9ab8ba3dd39825`. Consumidor: `lib/question-restorations.js`, blob `a04950c14a19a692aada261ee44a94dd534274a3`.

15 IDs: MAN-1731, MAN-1732, MAN-1733, MAN-1734, MAN-1735, MAN-1736, MAN-1737, MAN-1738, MAN-1739, MAN-1740, MAN-1785, MAN-1786, MAN-1787, MAN-1788, MAN-1789. JSON analisado, IDs únicos e cinco alternativas com chave existente: PASS. A presença de import/array no consumidor foi conferida estaticamente, mas não comprova seleção efetiva de cada ID no caderno. Questão de Santos identificada: `MAN-1739`, pendente da edição CONAPRA 2021. Demais fontes do pacote são IMO, externas ao escopo primário das nove fontes, mas concorrentes no runtime.

Não foram realizados cotejo primário, segunda passagem, comparação global dos 3.051 candidatos por hash/origem, build, CI ou conferência de Vercel. Nenhum item homologado/corrigido. O PR #262 permanece draft e sem merge. Falha preexistente de taxonomia Arte Naval segue sem nova execução. Próxima etapa: cotejar os 12 IDs Santos identificados nos pacotes concorrentes na fonte primária e concluir reconciliação global.
