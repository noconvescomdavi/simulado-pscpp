# ESTIBORDO/PSCPP — Checkpoint HENSEN 019 — revisão bibliográfica e semântica em gelo

**Data:** 2026-10-30 (America/Sao_Paulo). **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173. **Branch:** `audit/hensen-lote-001-20261029`.

## Fonte primária e achado técnico

Obra consultada diretamente: Henk Hensen, *Tug Use in Port*, 4ª edição (2021), capítulo 3, **§3.3.6, página impressa 92 (PDF 105)**: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view.

O item `ANV-HENSEN-C03-L017-02` afirmava, na explicação, que Hensen desaconselharia de maneira geral o uso de máquina contra espringue e exigiria rebocadores para essa remoção de gelo. **Essa formulação não é fiel à fonte**: a obra descreve o emprego controlado de *Dead Slow Ahead* após firmar o espringue de vante, aumentando passo/rotações gradualmente para não romper a espia, preferencialmente dobrada, **quando o gelo é fraco**; para gelo espesso/denso, exige assistência de rebocadores. A hipótese específica de grande empuxo inicial não justifica atribuir ao autor uma proibição categórica não formulada no trecho.

Além da atribuição incorreta, a competência já era cobrada em `ANV-HENSEN-C03-L002-04`, `ANV-HENSEN-C03-L012-02` e `ANV-HENSEN-C03-L013-01`. Optou-se por **reformular integralmente a questão**, preservando ID, capítulo, gabarito D e referência, mas avaliando outra técnica descrita na mesma seção: **dois rebocadores trabalhando proa a proa para varrer gelo, com três rebocadores adicionais mantendo o navio em posição**. Esse arranjo de cinco unidades é específico do exemplo de navio grande; não foi generalizado como exigência universal.

## Alteração individual: ANV-HENSEN-C03-L017-02

**Antes — tema:** Espringue em gelo.

**Antes — enunciado:** Durante atracação em gelo, pretende-se usar Dead Slow Ahead com espringue de vante firme para varrer gelo pelo fluxo do hélice. Por que esse método não deve ser aplicado a um navio com elevado empuxo inicial?

**Antes — alternativas:**
- A. O método é sempre seguro.
- B. Gelo anula esforço na espia.
- C. Espia dupla elimina qualquer ruptura.
- D. O empuxo pode romper o espringue mesmo duplicado. **[gabarito]**
- E. FPP garante menor esforço que CPP.

**Antes — explicação:** Hensen (§3.3.6, p. 92) desaconselha manobras em gelo usando máquina contra espringues em navios com elevada potência de partida ou em Dead Slow, pelo risco de ruptura das espias; nesses casos a manobra deve ser executada com rebocadores, sem usar o fluxo do hélice para remover gelo.

**Depois — tema:** Varredura de gelo por rebocadores proa a proa e proteção do navio.

**Depois — enunciado:** Na atracação de um navio de grande porte em berço com gelo, Hensen descreve dois rebocadores trabalhando proa a proa, deslocando-se entre o casco e o cais para varrer o gelo. Qual medida adicional protege os rebocadores que executam essa varredura?

**Depois — alternativas:**
- A. Dispensar os demais rebocadores, pois a dupla que varre o gelo também controla a posição do navio.
- B. Firmar os dois rebocadores ao navio e manter seguimento avante constante durante a varredura.
- C. Utilizar a máquina do navio para comprimir o gelo contra os rebocadores que operam entre casco e cais.
- D. Empregar outros três rebocadores para manter o navio em posição enquanto a dupla remove o gelo. **[gabarito]**
- E. Permitir que o navio derive em direção ao cais para aumentar a pressão sobre o gelo e acelerar sua remoção.

**Depois — explicação:** Na descrição de Hensen para navios de grande porte, dois rebocadores operam proa a proa, movimentando-se avante e a ré entre o navio e o berço para retirar o gelo. A segurança dessa dupla depende de três rebocadores adicionais mantendo o navio em posição. A configuração demanda, portanto, cinco rebocadores nessa operação específica; não é uma regra geral de dimensionamento. Fonte: capítulo 3, §3.3.6, p. 92 (PDF p. 105), junto à figura 3.30.

**Campos alterados:** `topic`, `question`, `options` (A–E) e `explanation`. **Preservados:** ID, classificação `arte-naval/hensen-tug`, capítulo, gabarito D, localizador, `active` e `pending_editorial_review`.

**Commit corretivo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/ecc676d20ab2225608b964ac04bb73ff97bc3bf9

## Validações e gates

- Arquivo `data/question-extensions/hensen-lote-017.json`: 40 questões, 40 IDs distintos, cinco alternativas textualmente distintas por questão, gabaritos **A=B=C=D=E=8**. A reformulação não alterou os outros 39 registros.
- Comparação conceitual manual com as três questões sobre espringue citadas acima: a nova competência é a **proteção da dupla de rebocadores**, não o espringue.
- Cotejo da fonte realizado por **texto extraído do PDF**. **Inspeção visual da página, revisão editorial independente e varredura semântica integral permanecem pendentes.** O status `pending_editorial_review` não foi alterado.
- **SHA anterior `f65c7377512ac37c62af004121464591ee165736`:** os cinco workflows concluíram com `success`: [Full Question Bank Audit](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41041806864), [Audit Main Question Banks](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41041806881), [Validate PIANC 121](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41041806862), [PSCPP Integral Bank Audit](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41041806960) e [CI](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41041806938).
- No SHA anterior, o guard HENSEN registrou **18 lotes, 720 questões, zero falhas estruturais**. O Full Audit varreu **172 arquivos/26.265 questões**, com **2.558 HIGH e 0 CRITICAL**: `DUPLICATE_STEM=1483`, `LOCATOR_DEPENDENT_STEM=816`, `GENERIC_TEMPLATE=258`, `OFFICIAL_SOURCE_DUPLICATE_OPTIONS=1`. `success` do workflow **não significa saneamento** desses achados.
- [Preview Vercel READY do SHA anterior f65c737](https://vercel.com/estibordo/estibordo-pscpp/7uXD8w9SveriuS2SoM7Yw8droYgE). O novo Preview [ecc676d](https://vercel.com/estibordo/estibordo-pscpp/H4omp5AhRpGTS7A4T9ypvjFctbJb) estava **BUILDING** na consulta inicial pós-correção; gates do novo SHA ainda precisam de confirmação.
- **Production Vercel READY** verificada somente para `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ. A `main` atual do PR aponta para `37f945957d5319ade9c5cec447d41e67cc8fb378`, diferente do commit de Production; **não há Production HENSEN**.
- O relatório `reports/full-question-bank-audit.json` presente em `main` foi gerado em **2026-09-28**, com escopo apenas `data/questions` e 283 HIGH. **Não é uma comparação equivalente** ao Full Audit atual de 172 arquivos; não se pode atribuir todos os 2.558 HIGH à branch ou afirmar que sejam preexistentes com base nesses números.
- PR aberto, sem merge; antes da alteração estava **227 commits à frente e 2 atrás da main**, exigindo reconciliação. A consulta imediatamente após a correção retornou `mergeable=false` enquanto os checks estavam sendo recalculados; não foi forçada integração.

## Pendências e decisão

**Merge bloqueado:** reconfirmar os gates no SHA final deste relatório, checar mergeabilidade, tratar pendências editoriais e HIGH, reconciliar a branch com `main`, verificar Preview READY. Não usar o READY de Production de um SHA diferente como autorização de publicação.

**Inventário preservado:** 720 questões propostas nos lotes 001–018; 170 históricos, dos quais **119 em quarentena reversível e 51 ativos sem homologação bibliográfica integral**. Não houve reativação, remoção de histórico ou alteração de validadores. As redundâncias `C01-L013-01/02` continuam sinalizadas; nenhum lote novo foi iniciado nesta execução.
