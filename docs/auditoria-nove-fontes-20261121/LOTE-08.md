# LOTE-08 — reconciliação incremental do PR #268

Main anterior: `d5c30a7d183e60c794793e94c6ae2c4859e05e69`. Main atual: `a3b97b9176fb961bd4cc9f2ef5dbb09b34eff2f1`. PR paralelo #268 adicionou `data/question-restorations/manobrabilidade-msc137-lote-10.json` (blob `f95c433dc8f545d2c777df0bb97153c708819243`) e registrou o import no consumidor `lib/question-restorations.js`.

Foram conferidos diretamente **17 registros**: MAN-1140, MAN-1141, MAN-1142, MAN-1143, MAN-1144, MAN-1145, MAN-1146, MAN-1191, MAN-1192, MAN-1193, MAN-1194, MAN-1195, MAN-1196, MAN-1197, MAN-1198, MAN-1199, MAN-1200. O JSON foi lido; os 17 IDs são únicos no lote; todas as questões têm cinco alternativas A–E e gabarito apontando letra presente. Foram registradas fontes MSC.137(76), MSC/Circ.1053 e CONAPRA 2021. A presença de CONAPRA exige classificação individual de escopo: não afirmar que todos os registros estão fora das nove obras. O consumidor importa o lote, mas a seleção efetiva e o hash de cada registro no runtime não foram comprovados.

**Limites:** não foi feita a reconciliação global com os 3.051 candidatos, nem cotejo semântico/autorais com fontes primárias, nem segunda passagem, testes de build/CI, merge ou deploy. Os 17 são registros concorrentes inspecionados estruturalmente, não questões homologadas; não subtrair 17 do saldo autoral.

**Próxima ação:** executar reconciliação global por ID/hash/proveniência e origem efetiva nos bancos, restaurações e catálogo; iniciar cotejo dos 48 candidatos temáticos de hidrodinâmica por página da obra.
