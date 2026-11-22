# LOTE-09 — Reconciliação PR #269

- Base main: `cd524245a09c29dd5fdb600617a0569b23361ec5` (anterior `a3b97b9176fb961bd4cc9f2ef5dbb09b34eff2f1`)
- Novo arquivo: `data/question-restorations/manobrabilidade-msc137-lote-11.json`; consumidor `lib/question-restorations.js`
- 15 registros, 15 IDs únicos, cinco alternativas e chave de gabarito estruturalmente existente em todos. Zero interseções com os 48 candidatos provisórios de hidrodinâmica.
- **MAN-1253** cita diretamente Santos, *A Manobrabilidade do Navio no Século 21*, capítulo 7, §§ 7.1/7.3.3, pp. 120–121: **PENDENTE_REVISAO_FONTE_PRIMARIA**. Não presumir gabarito correto.
- Outros 14 registros referenciam MSC.137(76) ou MSC/Circ.1053; fora da atribuição direta às nove obras, sem excluir possibilidade de duplicidade semântica.
- 0 questões cotejadas na fonte primária, 0 homologadas, 0 corrigidas, 0 segundas passagens. A reconciliação global dos 3.051 permanece pendente.
- Testes realizados: parse JSON, unicidade local, cinco alternativas, existência de chave correta e interseção de IDs. Não realizados: build, CI, seleção em runtime, cotejo autoral, deploy.
- PR #262 continua draft e sem autorização técnica para merge.

## Próximo lote

Ler integralmente a fonte de Santos e conferir **MAN-1253** na obra, em duas passagens, enquanto conclui a reconciliação de IDs/hashes e origem efetiva dos 3.051 candidatos. Não repetir o mero inventário dos lotes MSC.137 sem avançar o cotejo.
