# HENSEN — Checkpoint 011 — integridade bibliográfica e gates

**Data:** 2026-10-29 (horário de Brasília). **PR:** [#173](https://github.com/noconvescomdavi/simulado-pscpp/pull/173). **Branch:** `audit/hensen-lote-001-20261029`.

## Diagnóstico e reparo real

Foi identificado um defeito não detectado pelos gates anteriores: três questões do Lote 009 possuíam `source.locator` formado por textos de alternativas incorretas, e `explanation` continha afirmações técnicas falsas. A inspeção direta do JSON comprovou a corrupção, mesmo quando os cinco workflows anteriores haviam passado. **Não se considerou esse conteúdo homologado.**

A fonte primária [Henk Hensen, *Tug Use in Port*, 4ª ed. (2021)](https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view) foi consultada por extração textual nos trechos correspondentes. O cotejo visual completo do PDF e a revisão semântica independente permanecem pendentes.

| ID | Antes (defeito real) | Depois (correção) | Evidência e justificativa |
|---|---|---|---|
| `ANV-HENSEN-C03-L009-02` | Localizador era uma afirmação falsa sobre uso exclusivo de *backing line* em tratores; explicação: “O espringue substitui a defensa e não transmite força.” | `Chapter 3, §3.2.1, p. 83 (PDF p. 96)`; explicação da linha de vante (*backing line*), passagem do espringue pelo guincho e buzina e função da terceira linha | O texto da seção descreve esses três cabos no arranjo convencional ao costado. |
| `ANV-HENSEN-C05-L009-04` | Localizador continha coeficientes falsos; explicação: “Exatamente zero, pois o vento não exerce força lateral.” | `Chapter 5, §5.2.2, p. 136 (PDF p. 149)`; explicação da faixa CYw ≈ 0,8–1,0, mais frequentemente 0,9–1,0 | A obra informa explicitamente os coeficientes para vento de través. |
| `ANV-HENSEN-C09-L009-03` | Localizador continha alternativas falsas sobre GLP/GNL; explicação: “Desconsiderar qualquer vazamento de GLP em colisões portuárias.” | `Chapter 9, §9.4, p. 246 (PDF p. 259)`; explicação da necessidade de investigar consequências relativas de vazamentos GLP/GNL | Hensen menciona a necessidade de investigação e um vazamento de butano em colisão de 2018. |

**Alteração preservada:** os três IDs, os enunciados, as cinco alternativas, as respostas D/D/A e a classificação `arte-naval / hensen-tug` não foram modificados. Somente os localizadores e as explicações foram reparados.

**Commits:** [reparo do JSON `abadf09`](https://github.com/noconvescomdavi/simulado-pscpp/commit/abadf09cff02486e0ba75365d35e7e8c12f78d52) · [sincronização do relatório `1d18419`](https://github.com/noconvescomdavi/simulado-pscpp/commit/1d18419ba26bb3a831a6baa25c7596ee0e64565c).

## Prevenção de regressão

Criado [`scripts/validate-hensen-source-locators.mjs`](../../scripts/validate-hensen-source-locators.mjs), incorporado aos workflows **CI** e **Full Question Bank Audit**. A validação falha se detectar localizador com sintaxe incorreta, divergência entre capítulo do ID e da fonte, diferença de paginação distinta de 13, explicação vazia/curta ou idêntica a um distrator, duplicação de IDs, alternativas inválidas, taxonomia incorreta ou desequilíbrio de gabaritos em lote completo de 40. Isso **não** substitui verificação semântica, nem declara que todos os localizadores estão bibliograficamente corretos.

Commits: [criação do teste `9df1703`](https://github.com/noconvescomdavi/simulado-pscpp/commit/9df1703c8fe0e17e6cef700b1f4fb62399dab334) · [correção da expressão regular `f015bd1`](https://github.com/noconvescomdavi/simulado-pscpp/commit/f015bd13eabf7c812c5dfeebdd6449c352c50303) · [integração CI `2f9045b`](https://github.com/noconvescomdavi/simulado-pscpp/commit/2f9045b1a85de4b0b0fbaaf987c21c3e1efe089f) · [integração Full Audit `375362a`](https://github.com/noconvescomdavi/simulado-pscpp/commit/375362a544b1291aad7c07ed2cc1cf5ff245e239).

Uma inspeção programática via conector GitHub sobre os nove JSONs retornou **360 questões, 360 IDs únicos, zero localizadores com formato inválido e 8 gabaritos por letra em cada lote**. Essa inspeção é distinta da execução do novo script no GitHub Actions; o novo script ainda depende do resultado do workflow.

## Estado dos gates e da publicação

No HEAD `375362a544b1291aad7c07ed2cc1cf5ff245e239` (consulta após os commits):

- [CI #40994511982](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40994511982): `in_progress`.
- [Full Question Bank Audit #40994512346](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40994512346): `in_progress`.
- [Audit Main Question Banks #40994512008](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40994512008): `in_progress`.
- [PSCPP Integral Bank Audit #40994512035](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40994512035): `in_progress`.
- [Validate PIANC 121 #40994511987](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40994511987): `in_progress`.
- GitHub indica PR `mergeable=true`, porém **merge proibido** até todos os gates e homologação editorial.
- Vercel: status combinado `failure` com link `build-rate-limit`; **nenhum Preview READY para o HEAD**. Não contornar limite do plano.
- [Vercel Production READY](https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ) permanece no SHA `a03ccf972a021f9a2c8fee3ba09de3271fa089a7` da `main`, **sem HENSEN**.

## Inventário e pendências

- Lotes 001–009: **360 novas** (40 por lote, 45 por capítulo, 72 gabaritos por letra no conjunto).
- Históricas HENSEN: **170**, sendo **119 em quarentena reversível**, 51 ativas pendentes de homologação.
- Total bruto HENSEN: **530**; não confundir com conteúdo de Production.
- **Nenhum lote 010 iniciado**, nenhum ID duplicado criado, nenhuma questão histórica reativada.
- A revisão semântica independente e a conferência visual integral do Lote 009 continuam pendentes, assim como a revisão das 51 históricas ativas e o saneamento progressivo das 119 em quarentena.
- Os achados HIGH globais não foram tratados como corrigidos. O workflow verde por si só não os elimina.

**Decisão:** PR #173 continua aberto. Não houve merge nem publicação em Production. Próxima execução: conferir os gates do HEAD documental final, validar o novo teste, confirmar a situação da cota Vercel e avançar na homologação editorial antes de qualquer novo lote.
