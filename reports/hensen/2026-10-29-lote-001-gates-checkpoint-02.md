# ESTIBORDO/PSCPP — HENSEN, checkpoint 002: gates e rastreabilidade

**Data:** 2026-10-29. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`. **HEAD observado antes do registro:** `258a50bb3e20b3f739b65d682e3bbfd714e4d687`.  
**Decisão:** manter PR aberto, sem merge nem Production, até todos os gates do HEAD final estarem verdes, mergeabilidade revalidada e deploy de Production conferido. A `main` recebeu trabalho independente no commit `eb0932f9`, que não é publicação HENSEN.

## Integridade do acervo HENSEN

- **170 antigos** em 10 blocos: **119 em quarentena reversível** nos blocos 010/013/016/019/021/022/023 e **51 ativos pendentes de revisão bibliográfica** nos blocos 006/007/008.
- **40 novos** no `data/question-extensions/hensen-lote-001.json`, cinco por capítulo 1, 2, 3, 4, 5, 6, 7 e 9. **210 registros totais; 91 marcados ativos** antes dos filtros runtime.
- Verificação estrutural desta execução: 40 IDs únicos, 40 enunciados exatos distintos dentro do lote, cinco alternativas com letras A–E e textos distintos em cada item, 40 explicações, 40 classificações `arte-naval / hensen-tug`, gabaritos A=8, B=8, C=8, D=8, E=8.
- Fonte consultada diretamente no Google Drive: **Henk Hensen, Tug Use in Port, quarta edição revisada, 2021**, arquivo https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . Todos os 40 locators do lote apontam para páginas impressas identificadas no texto extraído do PDF; a relação informada **página PDF = página impressa + 13** foi confirmada em todos os 40. Isso comprova a localização da página, **não a correção semântica integral** de cada gabarito.
- Conferência de conteúdo com leitura de páginas representativas, um caso por capítulo: `ANV-HENSEN-C01-L001-01` p. 4 (píer T e dois bordos); `ANV-HENSEN-C02-L001-05` p. 41 (Rotortug, arranjo triangular); `ANV-HENSEN-C03-L001-03` p. 86 (resposta rápida em push-pull); `ANV-HENSEN-C04-L001-04` p. 118 (potência a ré); `ANV-HENSEN-C05-L001-05` p. 144 (redução de cerca de 50% a dois nós); `ANV-HENSEN-C06-L001-03` p. 161 (girting); `ANV-HENSEN-C07-L001-02` p. 177 (picos de 70% ou mais no gob rope); `ANV-HENSEN-C09-L001-04` p. 251 (powered indirect, 3–7 nós).
- Comparação lexical com as 51 questões antigas ativas: maior Jaccard aproximado de tokens em enunciados foi 0,143. **Não é uma prova de inexistência de duplicação conceitual**; o cotejo semântico e bibliográfico das 51 antigas e dos 119 itens em quarentena continua pendente.

## Registro individual das 40 novas — antes/depois deste checkpoint

Nenhum enunciado, alternativa, gabarito, explicação ou taxonomia HENSEN foi modificado nesta execução. Todos os itens abaixo permanecem como no lote 001.

| ID | Localizador | Gabarito | Resultado |
|---|---|---|---|
| `ANV-HENSEN-C01-L001-01` | cap. 1, §1.2.1, p. 4 / PDF p. 17) | B | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C01-L001-02` | cap. 1, §1.2.1, p. 4 / PDF p. 17) | E | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C01-L001-03` | cap. 1, §1.2.2, p. 5 / PDF p. 18) | C | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C01-L001-04` | cap. 1, §1.2.5, p. 6 / PDF p. 19) | A | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C01-L001-05` | cap. 1, §1.5, p. 8 / PDF p. 21) | D | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C02-L001-01` | cap. 2, §2.1, p. 10 / PDF p. 23) | B | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C02-L001-02` | cap. 2, §2.2.2, p. 11 / PDF p. 24) | E | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C02-L001-03` | cap. 2, §2.6.3, p. 33 / PDF p. 46) | C | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C02-L001-04` | cap. 2, §2.9, p. 37 / PDF p. 50) | A | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C02-L001-05` | cap. 2, §2.11, p. 41 / PDF p. 54) | D | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C03-L001-01` | cap. 3, §3.2.1, p. 82 / PDF p. 95) | B | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C03-L001-02` | cap. 3, §3.2.1, p. 83 / PDF p. 96) | E | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C03-L001-03` | cap. 3, §3.2.2, p. 86 / PDF p. 99) | C | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C03-L001-04` | cap. 3, §3.2.2, p. 86 / PDF p. 99) | A | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C03-L001-05` | cap. 3, §3.2.1, p. 84 / PDF p. 97) | D | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C04-L001-01` | cap. 4, §4.2.1, p. 100 / PDF p. 113) | B | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C04-L001-02` | cap. 4, §4.2, p. 104 / PDF p. 117) | E | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C04-L001-03` | cap. 4, §4.3, p. 116 / PDF p. 129) | C | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C04-L001-04` | cap. 4, §4.3.1, p. 118 / PDF p. 131) | A | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C04-L001-05` | cap. 4, §4.5, p. 127 / PDF p. 140) | D | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C05-L001-01` | cap. 5, §5.2, p. 135 / PDF p. 148) | B | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C05-L001-02` | cap. 5, §5.2.2, p. 136 / PDF p. 149) | E | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C05-L001-03` | cap. 5, §5.2.2, p. 136 / PDF p. 149) | C | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C05-L001-04` | cap. 5, §5.3, p. 143 / PDF p. 156) | A | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C05-L001-05` | cap. 5, §5.3.2, p. 144 / PDF p. 157) | D | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C06-L001-01` | cap. 6, §6.2, p. 150 / PDF p. 163) | B | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C06-L001-02` | cap. 6, §6.2, p. 151 / PDF p. 164) | E | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C06-L001-03` | cap. 6, §6.3.6, p. 161 / PDF p. 174) | C | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C06-L001-04` | cap. 6, §6.3, p. 164 / PDF p. 177) | A | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C06-L001-05` | cap. 6, §6.3, p. 174 / PDF p. 187) | D | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C07-L001-01` | cap. 7, §7.2, p. 176 / PDF p. 189) | B | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C07-L001-02` | cap. 7, §7.2, p. 177 / PDF p. 190) | E | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C07-L001-03` | cap. 7, §7.3, p. 181 / PDF p. 194) | C | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C07-L001-04` | cap. 7, §7.3, p. 184 / PDF p. 197) | A | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C07-L001-05` | cap. 7, §7.5, p. 198 / PDF p. 211) | D | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C09-L001-01` | cap. 9, §9.4, p. 247 / PDF p. 260) | B | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C09-L001-02` | cap. 9, §9.5, p. 249 / PDF p. 262) | E | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C09-L001-03` | cap. 9, §9.6, p. 251 / PDF p. 264) | C | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C09-L001-04` | cap. 9, §9.6, p. 251 / PDF p. 264) | A | Sem alteração; página impressa localizada |
| `ANV-HENSEN-C09-L001-05` | cap. 9, §9.6, p. 252 / PDF p. 265) | D | Sem alteração; página impressa localizada |

## Inventário individual dos 170 antigos — antes/depois: inalterados

- Bloco 006 (17; 0 em quarentena): `ANV-B006-01`, `ANV-B006-02`, `ANV-B006-03`, `ANV-B006-04`, `ANV-B006-05`, `ANV-B006-06`, `ANV-B006-07`, `ANV-B006-08`, `ANV-B006-09`, `ANV-B006-10`, `ANV-B006-11`, `ANV-B006-12`, `ANV-B006-13`, `ANV-B006-14`, `ANV-B006-15`, `ANV-B006-16`, `ANV-B006-17`.
- Bloco 007 (17; 0 em quarentena): `ANV-B007-01`, `ANV-B007-02`, `ANV-B007-03`, `ANV-B007-04`, `ANV-B007-05`, `ANV-B007-06`, `ANV-B007-07`, `ANV-B007-08`, `ANV-B007-09`, `ANV-B007-10`, `ANV-B007-11`, `ANV-B007-12`, `ANV-B007-13`, `ANV-B007-14`, `ANV-B007-15`, `ANV-B007-16`, `ANV-B007-17`.
- Bloco 008 (17; 0 em quarentena): `ANV-B008-01`, `ANV-B008-02`, `ANV-B008-03`, `ANV-B008-04`, `ANV-B008-05`, `ANV-B008-06`, `ANV-B008-07`, `ANV-B008-08`, `ANV-B008-09`, `ANV-B008-10`, `ANV-B008-11`, `ANV-B008-12`, `ANV-B008-13`, `ANV-B008-14`, `ANV-B008-15`, `ANV-B008-16`, `ANV-B008-17`.
- Bloco 010 (17; 17 em quarentena): `ANV-B010-01`, `ANV-B010-02`, `ANV-B010-03`, `ANV-B010-04`, `ANV-B010-05`, `ANV-B010-06`, `ANV-B010-07`, `ANV-B010-08`, `ANV-B010-09`, `ANV-B010-10`, `ANV-B010-11`, `ANV-B010-12`, `ANV-B010-13`, `ANV-B010-14`, `ANV-B010-15`, `ANV-B010-16`, `ANV-B010-17`.
- Bloco 013 (17; 17 em quarentena): `ANV-B013-01`, `ANV-B013-02`, `ANV-B013-03`, `ANV-B013-04`, `ANV-B013-05`, `ANV-B013-06`, `ANV-B013-07`, `ANV-B013-08`, `ANV-B013-09`, `ANV-B013-10`, `ANV-B013-11`, `ANV-B013-12`, `ANV-B013-13`, `ANV-B013-14`, `ANV-B013-15`, `ANV-B013-16`, `ANV-B013-17`.
- Bloco 016 (17; 17 em quarentena): `ANV-B016-01`, `ANV-B016-02`, `ANV-B016-03`, `ANV-B016-04`, `ANV-B016-05`, `ANV-B016-06`, `ANV-B016-07`, `ANV-B016-08`, `ANV-B016-09`, `ANV-B016-10`, `ANV-B016-11`, `ANV-B016-12`, `ANV-B016-13`, `ANV-B016-14`, `ANV-B016-15`, `ANV-B016-16`, `ANV-B016-17`.
- Bloco 019 (17; 17 em quarentena): `ANV-B019-01`, `ANV-B019-02`, `ANV-B019-03`, `ANV-B019-04`, `ANV-B019-05`, `ANV-B019-06`, `ANV-B019-07`, `ANV-B019-08`, `ANV-B019-09`, `ANV-B019-10`, `ANV-B019-11`, `ANV-B019-12`, `ANV-B019-13`, `ANV-B019-14`, `ANV-B019-15`, `ANV-B019-16`, `ANV-B019-17`.
- Bloco 021 (17; 17 em quarentena): `ANV-B021-01`, `ANV-B021-02`, `ANV-B021-03`, `ANV-B021-04`, `ANV-B021-05`, `ANV-B021-06`, `ANV-B021-07`, `ANV-B021-08`, `ANV-B021-09`, `ANV-B021-10`, `ANV-B021-11`, `ANV-B021-12`, `ANV-B021-13`, `ANV-B021-14`, `ANV-B021-15`, `ANV-B021-16`, `ANV-B021-17`.
- Bloco 022 (17; 17 em quarentena): `ANV-B022-01`, `ANV-B022-02`, `ANV-B022-03`, `ANV-B022-04`, `ANV-B022-05`, `ANV-B022-06`, `ANV-B022-07`, `ANV-B022-08`, `ANV-B022-09`, `ANV-B022-10`, `ANV-B022-11`, `ANV-B022-12`, `ANV-B022-13`, `ANV-B022-14`, `ANV-B022-15`, `ANV-B022-16`, `ANV-B022-17`.
- Bloco 023 (17; 17 em quarentena): `ANV-B023-01`, `ANV-B023-02`, `ANV-B023-03`, `ANV-B023-04`, `ANV-B023-05`, `ANV-B023-06`, `ANV-B023-07`, `ANV-B023-08`, `ANV-B023-09`, `ANV-B023-10`, `ANV-B023-11`, `ANV-B023-12`, `ANV-B023-13`, `ANV-B023-14`, `ANV-B023-15`, `ANV-B023-16`, `ANV-B023-17`.

**Quarentena não equivale a correção.** Os 119 IDs permanecem fora do runtime; os 51 ativos ainda carecem de cotejo semântico com o PDF. Nenhum Lote 002 foi criado.

## Correções técnicas e evidência antes/depois

| Item / código | Antes | Depois | Commit |
|---|---|---|---|
| `ANV-0005` (Fonseca, sem edição de seu JSON) | Normalização descartava quatro afirmativas por interpretar citações e palavras compartilhadas com alternativas como vazamento do gabarito | Regras de qualidade distinguem vocabulário compartilhado de vazamento distintivo; teste de regressão exige as quatro proposições | https://github.com/noconvescomdavi/simulado-pscpp/commit/98d7c10eed12472159bc53f051c2f868cc051130 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/48d1a3f7eed218207c068ce581f92282ea4188f8 |
| `AN-C11-1111-M1` (Fonseca) | Reparação automática de referência bibliográfica eliminava as proposições numeradas | Normalizador preserva I/II/III/IV e teste exige quatro proposições | https://github.com/noconvescomdavi/simulado-pscpp/commit/4ef6b4e12d1268ac1dc71a2089255bdeb995cf0d ; https://github.com/noconvescomdavi/simulado-pscpp/commit/cf5794b41291f7e79f5e6c9c00f02606b3811be7 |
| `AN-C11-1118a-M1` (Fonseca) | Citação legítima dentro de uma afirmativa era tratada como revelação da resposta, e a estrutura era achatada | Preservadas citações dentro das proposições, sem remover a checagem de vazamento real; teste específico | https://github.com/noconvescomdavi/simulado-pscpp/commit/5e7c7e1d7679331355b1ebd5e1c83f2c8d4c1355 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/1a16e399bf256bd3f23ca460e8b767f6d63445e4 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/700a5c34443146f3e86d1aa8af9a79d33844ab70 |
| `AN-C09-98-M1`, `AN-C09-99-M1`, `AN-C09-922-M1` (Fonseca) | Comparador apagava operadores de expressões matemáticas e acusava alternativas diferentes como duplicadas | Comparação matemática preserva `/`, `√`, `·`, `=`; sem trocar alternativas nem gabaritos | Ajuste em `scripts/validate-arte-naval-taxonomy.mjs` na branch |
| Taxonomia Fonseca, 219 IDs `AN-C09-*`/`AN-C10-*` | ID de arquivo Drive usado como `bibliography_id`; outros 534 registros referenciavam `fonseca-arte-v2` ausente do catálogo | Volume 2 registrado, 219 referências canonicalizadas com rastreio de origem preservado; validador principal passou a indicar **0 taxonomias ativas inválidas** e **441 em quarentena inválidas** | https://github.com/noconvescomdavi/simulado-pscpp/commit/ef8e5f667f94d3c7af1513a7c401119be59346d5 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/da849b5cec57a6b6ad37b027bf67b8c6649a967d |
| Rastreio do catálogo Fonseca cap. 10 | Contagem histórica `241` mistura baseline de `133` e expansão posterior do Volume 2 de `108` | Validador reconcilia apenas se a soma verificada for exata, **registrando aviso explícito de mistura de volumes**. O metadado original não foi alterado | https://github.com/noconvescomdavi/simulado-pscpp/commit/e520f8970a21d822ed4750c66029e54fa9008cbf ; https://github.com/noconvescomdavi/simulado-pscpp/commit/258a50bb3e20b3f739b65d682e3bbfd714e4d687 |

**Limite operacional:** tentativa de enviar a correção integral do JSON `data/questions/arte-naval.json` (6,65 MB) falhou com `h2 protocol error: error reading a body from connection`; não afirmar que esse arquivo foi alterado. As canonicalizações são explícitas e auditáveis no código, mas a migração persistente do arquivo de origem segue pendente.

## Gates e publicação — estado observado durante a execução

- `Full Question Bank Audit`: **PASS** nos últimos commits examinados, com 0 críticos; os **2.754 HIGH** históricos permanecem registrados, sem supressão.
- `Audit Main Question Banks`: **PASS**.
- `Validate PIANC 121 CGE Quarantine`: **PASS**.
- `CI`: ainda em revalidação após reparos sucessivos das proposições. Referência de run: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40927192616 . O HEAD final exige uma nova confirmação.
- `PSCPP Integral Bank Audit`: execução anterior bloqueada por metadado legado do capítulo 10; reconciliação com log explícito foi corrigida e aguarda o run do novo HEAD. Referência anterior: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40927192547 .
- `main` avançou independentemente para `eb0932f9f187626c60f9bcad3ef79e31bd63590c`; deployment de Production observado como **BUILDING**, não correspondente ao lote HENSEN: https://vercel.com/estibordo/estibordo-pscpp/FMNgqGohWT87YU9SuEosh7qjEP8e . O deployment da branch HENSEN é **Preview**, não Production.
- O PR #173 estava aberto e `mergeable=true` na última consulta; essa propriedade não autoriza merge com CI ou auditoria pendente.

## Próximo checkpoint

Conferir os runs do novo HEAD, resolver novas falhas genuínas sem suprimir verificações, atualizar o relatório, revalidar mergeabilidade contra a `main` atualizada e confirmar Preview. Só após gates verdes e revisão bibliográfica suficiente, efetuar merge e verificar Production READY para o SHA correto. Não iniciar Lote 002 nem reativar itens em quarentena enquanto o Lote 001 não estiver seguro.

## Atualização de gates após o registro inicial

- **CI** falhou novamente no run https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40927404788 : `Combination without propositions: meteorologia-oceanografia/MEO-1161`. O JSON de origem contém quatro afirmativas, mas a rotina preexistente de normalização transforma o enunciado em uma pergunta genérica. A origem `data/questions/meteorologia-oceanografia.json` possui o mesmo blob `a19068ec68e381fd4a2cbbf5cd9b21ce2492cd1c` em `main` e nesta branch; **não é uma alteração do lote HENSEN**. A questão contém ainda uma afirmativa III editorialmente malformada; não foi alterada nem reativada por esta execução. A frente de Meteorologia exige correção bibliográfica própria e não deve ser resolvida por supressão do teste.
- **PSCPP Integral Bank Audit**, run https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40927404783 : `validate:taxonomy:master` passou com **0 inválidas ativas**, e a validação de rastreio do banco Arte Naval passou após reconciliação explícita do legado; o job ainda prosseguia por outras etapas quando esta atualização foi escrita. Não declarar o workflow inteiro verde antes de sua conclusão.
- **Vercel Production**: `READY` para a `main` em `eb0932f9f187626c60f9bcad3ef79e31bd63590c`, https://vercel.com/estibordo/estibordo-pscpp/FMNgqGohWT87YU9SuEosh7qjEP8e . **Este commit não contém o lote HENSEN.** A Preview da branch segue separada e não autoriza anunciar publicação do lote.
- **Decisão mantida:** PR #173 aberto, sem merge, devido à CI e à necessidade de revisão de escopo. Não foi iniciado Lote 002.
