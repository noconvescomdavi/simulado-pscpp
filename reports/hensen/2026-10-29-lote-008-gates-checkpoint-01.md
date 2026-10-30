# HENSEN — Lote 008 — Gates e checkpoint 01

**Data:** 2026-10-29. **PR:** [#173](https://github.com/noconvescomdavi/simulado-pscpp/pull/173). **Branch:** `audit/hensen-lote-001-20261029`.

## Progresso persistido

1. Criação do `data/question-extensions/hensen-lote-008.json` — 40 questões inéditas propostas, commit `90aa5ba32142af1c2be5b862b28589ba5d1dbfc9`.
2. Integração em `lib/question-banks-source.js` — commit `019ff1a89db8c491a9658d2874892d2ade505841`.
3. Substituição de questões sobrepostas e correções de páginas — commits `57c4bfb097be347ee1d888ca3f4aa84a6c3c731f`, `d120d4f277fea3122661d6d046676657e51c17bf`, `b207834d175e67ffeb0a0dd4162794c1c28d5b28`.
4. Correção adicional de duplicidade temática `ANV-HENSEN-C01-L008-03` (L002): commit `9277e22913fe3c8055179127ed9339138f973cd0`, relatório atualizado no commit `7ec6cf7daeb006fdac5aa41d14d8d16fa56df76a`.
5. [Relatório individual de 40 IDs](https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-29-lote-008-auditoria.md) — commit `24447713910a9576cb929a1a6042acc40eee7979`.

## Inventário e verificações

- Históricos HENSEN: 170 (119 em quarentena reversível, 51 ativos pendentes de revisão individual).
- Lotes 001–008: 320 novas questões. **Total bruto esperado: 490 HENSEN**; 371 com `active:true` em metadados antes de filtros adicionais.
- Lote 008: 5 por capítulo 1–7 e 9; 40 IDs distintos; 5 alternativas por questão; distribuição A=8, B=8, C=8, D=8, E=8.
- Leitura e comparação dos oito JSON HENSEN e dez blocos históricos: 0 duplicações literais com os 450 registros anteriores.
- Revisão editorial por triagem lexical identificou e substituiu 6 itens conceitualmente próximos, com três correções de páginas. **Persistem aproximações temáticas que exigem revisão semântica independente.**
- Fonte primária consultada: [Hensen, 4ª ed., 2021](https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view). Seções localizadas no texto extraído; cotejo visual de todas as páginas ainda não concluído.

## Gates observados (não homologados)

No commit de integração `b207834d`, na última consulta:

| Workflow | Estado |
|---|---|
| Audit Main Question Banks | completed / success |
| Full Question Bank Audit | completed / success |
| Validate PIANC 121 CGE Quarantine | completed / success |
| PSCPP Integral Bank Audit | in_progress |
| CI | in_progress |

No HEAD documental `24447713910a9576cb929a1a6042acc40eee7979`, a consulta de workflows ainda não retornava execuções, e o status combinado **Vercel = failure**, apontando para [limite de builds/deploys](https://vercel.com/estibordo?upgradeToPro=build-rate-limit). Não contornar a cota. Os resultados do commit de integração não comprovam aprovação do HEAD documental final.

## Pendências e próxima execução

- Aguardar e verificar todos os gates **no HEAD final**, inclusive Vercel Preview, sem desativar verificações.
- Revisar originalidade semântica do Lote 008, em especial `ANV-HENSEN-C07-L008-05` e outras aproximações registradas no relatório.
- Conferir visualmente as páginas bibliográficas e sanar eventuais divergências.
- Resolver os problemas de distratores repetidos no Lote 007 e homologar as 51 questões históricas ainda ativas.
- Preservar os 119 históricos em quarentena e os lotes 001–008.
- A próxima automação deverá verificar se já existe `hensen-lote-009.json` antes de elaborar o Lote 009.
- **PR #173 aberto. Sem merge e sem deploy em produção.**
