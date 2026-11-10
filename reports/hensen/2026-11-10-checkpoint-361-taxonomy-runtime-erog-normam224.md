# Checkpoint 361 — canonicalização de capítulos EROG/NORMAM-224 (10/11/2026)

## Escopo confirmado e documentação

Os bancos originais de `comunicacoes` e `conhecimentos-gerais` registram itens sob `radioperador::integral` e `normam224::integral`. O catálogo detalhado da `main` foi cotejado com a **Apostila de Radioperador Geral (EROG), 3ª ed.**, Drive `1njDH2YqB2t219UjL0vE7cDpLBurpwxxA`, e **NORMAM-224/DPC**, Drive `1OltMiSPOWH4oieTQgV3mh-EAmNS6pbmx`: as unidades EROG 1/2/3 e anexos, e as seções 1.x/2.x/3.x da NORMAM, correspondem aos capítulos aprovados no catálogo.

## Implementação limitada e reversível

* `data/study/bibliography.js`: aproveitada a catalogação detalhada atual da `main`, **preservando** `fonseca-arte-v2` (que só existia na branch HENSEN) e os capítulos 9 a 12.
* `lib/question-taxonomy.js`: **normalização efetiva e em memória** exclusivamente para registros ativos que têm obra, capítulo legado, título de fonte e referência textual explícitos. Nunca corrige por simples número de ID, não altera banco bruto e não converte itens em quarentena.
* `scripts/validate-question-taxonomy.mjs`: fixtures para todos os sete alvos de seção e três casos negativos (fonte incorreta, localizador indeterminado, item inativo), além dos testes Fonseca V2 existentes. Qualquer falha não catalogada continua bloqueada.
* **Estimativa diretamente verificada nos registros originais:** 397 ativos de Comunicações e 49 ativos de Conhecimentos Gerais possuem localizadores inequívocos. Foram lidos 419 itens legados EROG, incluindo 22 inativos, e 50 itens legados NORMAM-224, incluindo 1 inativo. Não há homologação editorial.

O normalizador altera apenas os campos efetivos `taxonomy.chapter_id`, `tracking.chapter` e `tracking.section`. IDs, `topic_id`, textos, opções, gabaritos, explicações, `source.locator`, `active` e status permanecem iguais. **Os JSON de origem não foram reescritos** nesta execução; uma migração física posterior exige atualização dos arquivos originais e teste de integridade. Os 119 históricos HENSEN em quarentena não são tocados.

O primeiro teste do novo HEAD deverá demonstrar queda da contagem de taxonomia inválida ativa (1.327 → **881**, se não houver outra alteração concorrente) e **nenhuma violação nova**. Não chamar de reparo definitivo; os 881 restantes e as 464 em quarentena exigem revisão de seus capítulos e fontes. Não realizar merge nem deploy Production.
