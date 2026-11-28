# LOTE-07 — reconciliação incremental PR #267

Main `d5c30a7d183e60c794793e94c6ae2c4859e05e69` (PR #267); base anterior `5b293dc19367b58e88e14d41fb5a7f6cf3a10144`. Arquivo de restauração `manobrabilidade-msc137-lote-09.json`, blob `927e64b68adc6b96532e390360c2a59f66a318fb`; importação alterada em `lib/question-restorations.js`.

Foram inspecionados **14 registros**: MAN-1037, MAN-1083, MAN-1084, MAN-1085, MAN-1086, MAN-1087, MAN-1088, MAN-1089, MAN-1090, MAN-1091, MAN-1092, MAN-1137, MAN-1138, MAN-1139. Todos possuem IDs únicos dentro do lote, alternativas A–E e gabarito apontando uma das cinco letras. Interseção por ID com a lista preliminar de 48 candidatos de hidrodinâmica: **zero**. Esta checagem não prova unicidade global, ausência de equivalência semântica ou elegibilidade efetiva no runtime.

**Sem revisão autoral ou homologação:** não houve leitura de páginas da obra para esses 14 itens, segunda passagem, build ou testes de integração nesta rodada. O saldo de 3.051 candidatos permanece provisório. Não editar questões nem integrar o PR #262 sem reconciliação global e fontes primárias.

**Próxima ação:** comparar todos os IDs/hashes dos bancos e restaurações vigentes com os 3.051 candidatos e conferir o consumidor, depois revisar individualmente os 48 candidatos de hidrodinâmica com fonte e segunda passagem.
