# Checkpoint HENSEN — Lote 001: diagnóstico dos gates e segurança de publicação

**Data:** 2026-10-29. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`. **HEAD observado antes deste relatório:** `42c28564617f8654d4fe04254ea093f133f39448`. **Base main:** `37f945957d5319ade9c5cec447d41e67cc8fb378`.  
**Decisão:** NÃO realizar merge enquanto CI e PSCPP Integral Bank Audit falharem. NÃO publicar em Production.

## Inventário e integridade HENSEN

- Acervo anterior: 170 questões `hensen-tug`; 119 em quarentena reversível, 51 ainda ativas e pendentes de revisão bibliográfica.
- Lote 001: 40 questões novas, cinco por capítulo oficial 1, 2, 3, 4, 5, 6, 7 e 9; 5 alternativas por questão, 8 gabaritos por letra A–E, nenhuma repetição exata de ID ou enunciado dentro do lote; todas com locator capítulo/seção/página. Checagem **estrutural** por leitura do JSON; **não equivale a verificação bibliográfica semântica completa de cada item**.
- Total de registros HENSEN no JSON: 210; elegíveis por `active=true`: 91 antes de filtros de qualidade runtime. Quarentena não é reparo editorial nem revisão da fonte.
- Nenhuma questão HENSEN teve gabarito ou texto modificado neste checkpoint; o escopo das correções foi infraestrutura de testes, auditabilidade e tratamento explícito de anomalia histórica preexistente.

## Diagnóstico: antes / depois

| Arquivo | Antes | Depois / justificativa | Commit |
|---|---|---|---|
| `scripts/validate-study-plan-v3.mjs` | Teste exigia `shuffle(pool).slice`, removido anteriormente do código de produção | Verifica que `strictFixationMatch` precede `selectNotebookQuestions` e que a política prioriza inéditas e aplica limite após seleção. `lib/notebooks.js` e teste tinham os mesmos blobs em main e na branch antes da correção: falha preexistente | https://github.com/noconvescomdavi/simulado-pscpp/commit/c27c75182122d51a520ef8bd8d3eb4a8451412ca |
| `scripts/audit-full-question-bank.mjs` | Um achado crítico não identificável pelo resumo do job | Imprime o registro crítico completo; continua falhando se houver crítico | https://github.com/noconvescomdavi/simulado-pscpp/commit/788434b7ab4b0a84fb2cd4cc830be7df929074af |
| `.github/workflows/full-question-bank-audit.yml` | Falha interrompia upload do relatório | `upload-artifact` executa também em falha; etapa de auditoria não foi desabilitada | https://github.com/noconvescomdavi/simulado-pscpp/commit/d52e7886aa5b93b5bddd03cbfe15cc5eb7a48cdc |
| `scripts/audit-full-question-bank.mjs` | `pscpp::official::2008::027` classificado como `DUPLICATE_OPTIONS` crítico | Mantém alternativas B e D idênticas da prova oficial de 2008, questão 27, p. 13, verificadas na cópia original; reporta explicitamente `OFFICIAL_SOURCE_DUPLICATE_OPTIONS` como HIGH, com exceção estrita condicionada a ID, origem, validação, gabarito A e duplicação B/D. Nenhuma alteração na prova oficial | https://github.com/noconvescomdavi/simulado-pscpp/commit/c29c4ba2ade1e38612f4bcf45da729c32e127acc |
| `scripts/test-notebook-complete-stems.mjs` | Exigia publicar `ANV-B010-17` e outros reparos estruturais apesar de fonte Hensen inválida | Para itens HENSEN ausentes do runtime, exige prova no JSON de `active=false`, `validation_status=quarantined` e `source_rewrite_required`; nunca reativa o item para passar no teste. Atualiza reconciliação de lotes/quarentena | https://github.com/noconvescomdavi/simulado-pscpp/commit/50c60d2e90dc4a225bb9f21e9319a4d9fd150df0 |
| `scripts/test-notebook-context-stems.mjs` | Contagem absoluta anterior aos novos lotes/quarentena | Reconciliada com os arquivos de lotes HENSEN e 119 quarentenas, verificando que nenhum registro quarantined reapareça no runtime; preserva teste de contexto de outros livros | https://github.com/noconvescomdavi/simulado-pscpp/commit/42c28564617f8654d4fe04254ea093f133f39448 |

## Gates observados

- **Full Question Bank Audit**: verde no commit `42c28564617f8654d4fe04254ea093f133f39448`, run https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40916563771 . No run 695 foram 25.585 questões, 2.754 achados HIGH, 0 críticos: 972 enunciados dependentes de localizador, 1.483 enunciados repetidos, 298 templates genéricos e 1 duplicidade fiel à prova oficial de 2008. A dívida HIGH permanece aberta; aprovação do job significa ausência de críticos, não saneamento integral.
- **Audit Main Question Banks**: verde no commit `42c28564617f8654d4fe04254ea093f133f39448`, run https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40916564115 .
- **CI**: run anterior https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40916222335 falhou em `scripts/test-notebook-complete-stems.mjs`: `Combination without propositions: arte-naval/ANV-0005`. O JSON preexistente contém proposições I–IV; investigar classificador/renderização. Esse item é de Fonseca, não de Hensen. O teste Study Plan V3 passou. Run para `42c28564617f8654d4fe04254ea093f133f39448`: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40916564024 (em andamento no momento do registro).
- **PSCPP Integral Bank Audit**: run anterior https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40916222127 falhou em `validate:taxonomy`: 753 registros ativos com taxonomia inválida, 441 em quarentena com taxonomia inválida, 137 capítulos críticos. Exemplos: `AN-C10-101-M1` usa bibliography_id de arquivo Drive e chapter_id `Capítulo 10`, em vez de IDs do catálogo; `AN-C12-...` também consta no log. O arquivo `data/questions/arte-naval.json` não foi modificado pelo PR. São itens de Fonseca, fora do escopo de correção de questões Hensen. Run para `42c28564617f8654d4fe04254ea093f133f39448`: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40916563828 (em andamento no momento do registro).
- **Vercel**: Production READY confirmado somente para `main@37f945957d5319ade9c5cec447d41e67cc8fb378`, https://vercel.com/estibordo/estibordo-pscpp/7czP6R54adotFA4VWKnSiQgassKB . Deploy de `42c28564617f8654d4fe04254ea093f133f39448` é **Preview**, não Production, e estava QUEUED: https://vercel.com/estibordo/estibordo-pscpp/7MAcmWBjwvVQ3Mpmg4tVUjoXXPDu . NÃO afirmar Production READY do lote.
- **Mergeability**: PR reportava `mergeable=true` antes do último checkpoint, mas checks falhos impedem merge seguro; revalidar SHA e gates imediatamente antes de qualquer merge.

## 14 restaurações históricas incompatíveis com a quarentena (IDs)

`ANV-B010-16`, `ANV-B010-17`, `ANV-B013-16`, `ANV-B013-17`, `ANV-B016-16`, `ANV-B016-17`, `ANV-B019-16`, `ANV-B019-17`, `ANV-B021-16`, `ANV-B021-17`, `ANV-B022-16`, `ANV-B022-17`, `ANV-B023-16`, `ANV-B023-17`. As restaurações de enunciado/associação são conservadas no histórico, mas não constituem comprovação de aderência a Hensen; permanecem fora do runtime.

## 119 IDs em quarentena — antes/depois desta execução: inalterados

- Bloco 010 (17): ANV-B010-01, ANV-B010-02, ANV-B010-03, ANV-B010-04, ANV-B010-05, ANV-B010-06, ANV-B010-07, ANV-B010-08, ANV-B010-09, ANV-B010-10, ANV-B010-11, ANV-B010-12, ANV-B010-13, ANV-B010-14, ANV-B010-15, ANV-B010-16, ANV-B010-17
- Bloco 013 (17): ANV-B013-01, ANV-B013-02, ANV-B013-03, ANV-B013-04, ANV-B013-05, ANV-B013-06, ANV-B013-07, ANV-B013-08, ANV-B013-09, ANV-B013-10, ANV-B013-11, ANV-B013-12, ANV-B013-13, ANV-B013-14, ANV-B013-15, ANV-B013-16, ANV-B013-17
- Bloco 016 (17): ANV-B016-01, ANV-B016-02, ANV-B016-03, ANV-B016-04, ANV-B016-05, ANV-B016-06, ANV-B016-07, ANV-B016-08, ANV-B016-09, ANV-B016-10, ANV-B016-11, ANV-B016-12, ANV-B016-13, ANV-B016-14, ANV-B016-15, ANV-B016-16, ANV-B016-17
- Bloco 019 (17): ANV-B019-01, ANV-B019-02, ANV-B019-03, ANV-B019-04, ANV-B019-05, ANV-B019-06, ANV-B019-07, ANV-B019-08, ANV-B019-09, ANV-B019-10, ANV-B019-11, ANV-B019-12, ANV-B019-13, ANV-B019-14, ANV-B019-15, ANV-B019-16, ANV-B019-17
- Bloco 021 (17): ANV-B021-01, ANV-B021-02, ANV-B021-03, ANV-B021-04, ANV-B021-05, ANV-B021-06, ANV-B021-07, ANV-B021-08, ANV-B021-09, ANV-B021-10, ANV-B021-11, ANV-B021-12, ANV-B021-13, ANV-B021-14, ANV-B021-15, ANV-B021-16, ANV-B021-17
- Bloco 022 (17): ANV-B022-01, ANV-B022-02, ANV-B022-03, ANV-B022-04, ANV-B022-05, ANV-B022-06, ANV-B022-07, ANV-B022-08, ANV-B022-09, ANV-B022-10, ANV-B022-11, ANV-B022-12, ANV-B022-13, ANV-B022-14, ANV-B022-15, ANV-B022-16, ANV-B022-17
- Bloco 023 (17): ANV-B023-01, ANV-B023-02, ANV-B023-03, ANV-B023-04, ANV-B023-05, ANV-B023-06, ANV-B023-07, ANV-B023-08, ANV-B023-09, ANV-B023-10, ANV-B023-11, ANV-B023-12, ANV-B023-13, ANV-B023-14, ANV-B023-15, ANV-B023-16, ANV-B023-17

## 51 IDs antigos ativos — revisão bibliográfica ainda pendente

ANV-B006-01, ANV-B006-02, ANV-B006-03, ANV-B006-04, ANV-B006-05, ANV-B006-06, ANV-B006-07, ANV-B006-08, ANV-B006-09, ANV-B006-10, ANV-B006-11, ANV-B006-12, ANV-B006-13, ANV-B006-14, ANV-B006-15, ANV-B006-16, ANV-B006-17, ANV-B007-01, ANV-B007-02, ANV-B007-03, ANV-B007-04, ANV-B007-05, ANV-B007-06, ANV-B007-07, ANV-B007-08, ANV-B007-09, ANV-B007-10, ANV-B007-11, ANV-B007-12, ANV-B007-13, ANV-B007-14, ANV-B007-15, ANV-B007-16, ANV-B007-17, ANV-B008-01, ANV-B008-02, ANV-B008-03, ANV-B008-04, ANV-B008-05, ANV-B008-06, ANV-B008-07, ANV-B008-08, ANV-B008-09, ANV-B008-10, ANV-B008-11, ANV-B008-12, ANV-B008-13, ANV-B008-14, ANV-B008-15, ANV-B008-16, ANV-B008-17

## 40 IDs do lote 001 — antes/depois desta execução: inalterados

- ANV-HENSEN-C01-L001-01 — hensen-tug::ch1, gabarito B, Chapter 1, §1.2.1, p. 4 (PDF p. 17)
- ANV-HENSEN-C01-L001-02 — hensen-tug::ch1, gabarito E, Chapter 1, §1.2.1, p. 4 (PDF p. 17)
- ANV-HENSEN-C01-L001-03 — hensen-tug::ch1, gabarito C, Chapter 1, §1.2.2, p. 5 (PDF p. 18)
- ANV-HENSEN-C01-L001-04 — hensen-tug::ch1, gabarito A, Chapter 1, §1.2.5, p. 6 (PDF p. 19)
- ANV-HENSEN-C01-L001-05 — hensen-tug::ch1, gabarito D, Chapter 1, §1.5, p. 8 (PDF p. 21)
- ANV-HENSEN-C02-L001-01 — hensen-tug::ch2, gabarito B, Chapter 2, §2.1, p. 10 (PDF p. 23)
- ANV-HENSEN-C02-L001-02 — hensen-tug::ch2, gabarito E, Chapter 2, §2.2.2, p. 11 (PDF p. 24)
- ANV-HENSEN-C02-L001-03 — hensen-tug::ch2, gabarito C, Chapter 2, §2.6.3, p. 33 (PDF p. 46)
- ANV-HENSEN-C02-L001-04 — hensen-tug::ch2, gabarito A, Chapter 2, §2.9, p. 37 (PDF p. 50)
- ANV-HENSEN-C02-L001-05 — hensen-tug::ch2, gabarito D, Chapter 2, §2.11, p. 41 (PDF p. 54)
- ANV-HENSEN-C03-L001-01 — hensen-tug::ch3, gabarito B, Chapter 3, §3.2.1, p. 82 (PDF p. 95)
- ANV-HENSEN-C03-L001-02 — hensen-tug::ch3, gabarito E, Chapter 3, §3.2.1, p. 83 (PDF p. 96)
- ANV-HENSEN-C03-L001-03 — hensen-tug::ch3, gabarito C, Chapter 3, §3.2.2, p. 86 (PDF p. 99)
- ANV-HENSEN-C03-L001-04 — hensen-tug::ch3, gabarito A, Chapter 3, §3.2.2, p. 86 (PDF p. 99)
- ANV-HENSEN-C03-L001-05 — hensen-tug::ch3, gabarito D, Chapter 3, §3.2.1, p. 84 (PDF p. 97)
- ANV-HENSEN-C04-L001-01 — hensen-tug::ch4, gabarito B, Chapter 4, §4.2.1, p. 100 (PDF p. 113)
- ANV-HENSEN-C04-L001-02 — hensen-tug::ch4, gabarito E, Chapter 4, §4.2, p. 104 (PDF p. 117)
- ANV-HENSEN-C04-L001-03 — hensen-tug::ch4, gabarito C, Chapter 4, §4.3, p. 116 (PDF p. 129)
- ANV-HENSEN-C04-L001-04 — hensen-tug::ch4, gabarito A, Chapter 4, §4.3.1, p. 118 (PDF p. 131)
- ANV-HENSEN-C04-L001-05 — hensen-tug::ch4, gabarito D, Chapter 4, §4.5, p. 127 (PDF p. 140)
- ANV-HENSEN-C05-L001-01 — hensen-tug::ch5, gabarito B, Chapter 5, §5.2, p. 135 (PDF p. 148)
- ANV-HENSEN-C05-L001-02 — hensen-tug::ch5, gabarito E, Chapter 5, §5.2.2, p. 136 (PDF p. 149)
- ANV-HENSEN-C05-L001-03 — hensen-tug::ch5, gabarito C, Chapter 5, §5.2.2, p. 136 (PDF p. 149)
- ANV-HENSEN-C05-L001-04 — hensen-tug::ch5, gabarito A, Chapter 5, §5.3, p. 143 (PDF p. 156)
- ANV-HENSEN-C05-L001-05 — hensen-tug::ch5, gabarito D, Chapter 5, §5.3.2, p. 144 (PDF p. 157)
- ANV-HENSEN-C06-L001-01 — hensen-tug::ch6, gabarito B, Chapter 6, §6.2, p. 150 (PDF p. 163)
- ANV-HENSEN-C06-L001-02 — hensen-tug::ch6, gabarito E, Chapter 6, §6.2, p. 151 (PDF p. 164)
- ANV-HENSEN-C06-L001-03 — hensen-tug::ch6, gabarito C, Chapter 6, §6.3.6, p. 161 (PDF p. 174)
- ANV-HENSEN-C06-L001-04 — hensen-tug::ch6, gabarito A, Chapter 6, §6.3, p. 164 (PDF p. 177)
- ANV-HENSEN-C06-L001-05 — hensen-tug::ch6, gabarito D, Chapter 6, §6.3, p. 174 (PDF p. 187)
- ANV-HENSEN-C07-L001-01 — hensen-tug::ch7, gabarito B, Chapter 7, §7.2, p. 176 (PDF p. 189)
- ANV-HENSEN-C07-L001-02 — hensen-tug::ch7, gabarito E, Chapter 7, §7.2, p. 177 (PDF p. 190)
- ANV-HENSEN-C07-L001-03 — hensen-tug::ch7, gabarito C, Chapter 7, §7.3, p. 181 (PDF p. 194)
- ANV-HENSEN-C07-L001-04 — hensen-tug::ch7, gabarito A, Chapter 7, §7.3, p. 184 (PDF p. 197)
- ANV-HENSEN-C07-L001-05 — hensen-tug::ch7, gabarito D, Chapter 7, §7.5, p. 198 (PDF p. 211)
- ANV-HENSEN-C09-L001-01 — hensen-tug::ch9, gabarito B, Chapter 9, §9.4, p. 247 (PDF p. 260)
- ANV-HENSEN-C09-L001-02 — hensen-tug::ch9, gabarito E, Chapter 9, §9.5, p. 249 (PDF p. 262)
- ANV-HENSEN-C09-L001-03 — hensen-tug::ch9, gabarito C, Chapter 9, §9.6, p. 251 (PDF p. 264)
- ANV-HENSEN-C09-L001-04 — hensen-tug::ch9, gabarito A, Chapter 9, §9.6, p. 251 (PDF p. 264)
- ANV-HENSEN-C09-L001-05 — hensen-tug::ch9, gabarito D, Chapter 9, §9.6, p. 252 (PDF p. 265)

## Próxima ação e impedimentos

1. Manter PR aberto, sem merge e sem deploy Production; aguardar resultados finais dos runs do HEAD e registrar novos bloqueios sem suprimir testes.
2. Não reativar as 119 questões com fonte artificial; revisá-las gradualmente contra Hensen, 4ª edição, com localização bibliográfica verificável.
3. Não alterar questões de Fonseca ou provas oficiais fora do escopo autorizado. Falhas globais preexistentes (`ANV-0005`, taxonomia `AN-C10`/`AN-C12`) exigem saneamento específico em frente separada ou autorização de ampliação do escopo.
4. Não iniciar Lote 002 antes de resolver o checkpoint de publicação do Lote 001.
