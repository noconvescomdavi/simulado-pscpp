# LOTE-05 — Reconciliação concorrente PR #265

Main atual: `51fe10bedf97dfe512266989c5c797820e2cef94` (anterior `23c8a3276b4f45c01d974ad9ca946131ddd5a14f`). O PR #265 adicionou `data/question-restorations/manobrabilidade-msc137-lote-07.json` e modificou `lib/question-restorations.js`.

Foram lidos os 14 registros da restauração: MAN-856, MAN-857, MAN-858, MAN-859, MAN-860, MAN-866, MAN-867, MAN-909, MAN-910, MAN-911, MAN-912, MAN-913, MAN-919, MAN-920. JSON válido, IDs localmente únicos, cinco alternativas e letra do gabarito presente em todos os 14. Interseção com os 48 candidatos provisórios de hidrodinâmica: **0**. Isso não prova inexistência de colisões ou sobreposição semântica com os demais 3.051 candidatos. MSC.137(76) não integra as nove fontes deste trabalho; a verificação é apenas de concorrência.

**Sem cotejo bibliográfico individual nesta rodada** e sem testes de build/CI. Mantêm-se 3.051 candidatos pendentes e zero homologações/correções. O relatório não autoriza merge. O próximo lote deve ler o inventário completo, comparar hashes e origem efetiva dos 3.051 IDs com a main atual, localizar a fonte integral e iniciar o cotejo das 48 questões de hidrodinâmica. Falha de taxonomia de Arte Naval permanece como ressalva preexistente, sem reexecução.
