# LOTE-03 — reconciliação de alteração concorrente na main

Data de referência: 22/11/2026. Escopo desta rodada: delta real da main após checkpoint 02. Não houve auditoria bibliográfica individual nem segunda passagem nesta rodada.

## Reconciliação comprovada
- HEAD da main observado: `f0a33c443670fd33313dc8141f513d640baaa967`, anterior `14c6afed392cb6d87e80c8ff3453299e949039b4`.
- Mudança concorrente integrada no PR #263: `data/question-restorations/manobrabilidade-msc137-lote-05.json` (novo) e `lib/question-restorations.js` (alterado). O consumidor de restaurações foi portanto modificado, e não apenas o arquivo de questões.
- O arquivo novo contém 14 registros com IDs únicos: MAN-644, MAN-645, MAN-646, MAN-647, MAN-648, MAN-654, MAN-655, MAN-697, MAN-698, MAN-699, MAN-700, MAN-701, MAN-707 e MAN-708. Os 14 possuem `source.locator`; a existência do campo **não** confirma sua exatidão bibliográfica.
- Interseção dos 14 IDs com os 48 `proximos_ids_hidrodinamica` do checkpoint: **0**. Isto não demonstra ausência de conflitos com os 3.051 candidatos, outros overrides ou catálogos. A análise completa por ID/hash e precedência de runtime permanece pendente.
- PR #262 segue draft, head `601a489bad36ed81d9af76a65965df24edd59315`, base do PR ainda aponta `14c6afed392cb6d87e80c8ff3453299e949039b4`. Necessário rebase/reconciliação antes de modificar os mesmos arquivos.
- A restauração concorrente é da resolução IMO MSC.137(76), **fora das nove referências delimitadas**, mas pode influir no runtime e na seleção de cadernos.

## Limitações e próximos passos
1. Materializar e indexar integralmente os bancos, restaurações e consumidores da main `f0a33c4`; cotejar os 3.051 IDs por ID/hash/proveniência e atualizar CSV/JSON do inventário. A ausência de interseção com a lista de 48 não substitui essa etapa.
2. Verificar a precedência de `lib/question-restorations.js` e o comportamento de seleção após o PR #263.
3. Consultar capítulos 3 e 4 da obra de Santos hidrodinâmica e realizar primeira e segunda passagens por ID; não aprovar questões com base apenas no assunto.
4. Executar testes reais no HEAD reconciliado; resultados antigos do checkpoint não representam testes desta rodada.

**Totais desta rodada:** 0 IDs bibliograficamente cotejados, 0 aprovados, 0 corrigidos, 0 testes executados, 0 merge, 0 deploy. O saldo provisório permanece 3.051 candidatos. Falha preexistente de `validate:taxonomy:arte-naval` permanece sem revalidação.
