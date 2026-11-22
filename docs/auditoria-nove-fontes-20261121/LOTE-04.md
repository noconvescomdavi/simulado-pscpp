# LOTE-04 — Reconciliação concorrente PR #264

Base anterior: `f0a33c443670fd33313dc8141f513d640baaa967`. Main atual verificada: `23c8a3276b4f45c01d974ad9ca946131ddd5a14f` (PR #264). Branch de auditoria permanece isolada; PR #262 em rascunho.

## Trabalho efetivo

O delta entre os SHAs contém a inclusão de `data/question-restorations/manobrabilidade-msc137-lote-06.json` e a adição de seu import/consumo em `lib/question-restorations.js`. Foi lido o JSON integral de restaurações do lote 06: **14 IDs únicos**, `MAN-750`, `MAN-751`, `MAN-752`, `MAN-753`, `MAN-754`, `MAN-760`, `MAN-761`, `MAN-803`, `MAN-804`, `MAN-805`, `MAN-806`, `MAN-807`, `MAN-813`, `MAN-814`. A interseção com os **48 candidatos provisórios de hidrodinâmica** do checkpoint é **0**. A referência da restauração é IMO MSC.137(76), não uma das nove fontes do escopo. Isso NÃO prova ausência de sobreposição ou conflito nos demais 3.003 candidatos nem no consumidor final.

## Limites e gates

Verificação mecânica feita: parse do JSON, unicidade local dos 14 IDs e interseção por ID com os 48 candidatos. **Não** houve cotejo bibliográfico, segunda passagem editorial, correção de questão, build, CI, deploy, teste de seleção ou conciliação completa por hash. Nenhuma questão aprovada nesta rodada. Falhas preexistentes do validador de Arte Naval permanecem ressalvadas, não reexecutadas. Não realizar merge.

Próximo trabalho: reconciliar os 3.051 candidatos por ID, hash e origem efetiva contra `23c8a3276b4f45c01d974ad9ca946131ddd5a14f` e os imports/overrides do runtime; em seguida cotejar os primeiros IDs de hidrodinâmica com o PDF primário. O prazo é meta, não critério de homologação.
