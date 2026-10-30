# HENSEN — Lote 012 — checkpoint persistente 01

**Data:** 30/10/2026. **Branch:** `audit/hensen-lote-001-20261029`. **PR:** #173.
- JSON: `data/question-extensions/hensen-lote-012.json`; commit caafde31882b91030bf567acf55822de2909ff0c.
- Relatório: `reports/hensen/2026-10-30-lote-012-auditoria.md`; commit 0ed29a1376b3a7f81943fe3e1b757eec9a194506.
- 40 questões, 5 por capítulo 1–7 e 9, A=8 B=8 C=8 D=8 E=8.
- 440 registros prévios cotejados para IDs e enunciados; 0 colisões literais. Máximo Jaccard 0.538.
- Âncoras textuais confirmadas: 40/40; correspondências não localizadas: nenhuma.
- Revisão semântica independente e conferência visual de página pendentes; status pending_editorial_review e duplicate_checked=false.
- Preservados lotes 001–011, 119 históricos em quarentena, demais históricos e validadores.
- Pendências antigas: C01-L011-01 e C01-L011-04 repetem conceitos de outros lotes; checkpoint 013.
- Gates do HEAD final devem ser verificados após este checkpoint; falha Vercel por limite de builds anteriormente documentada.
- Sem merge e sem deploy. Próximo lote a verificar: 013, após consulta de existência e checkpoints.

## Correções de originalidade após triagem

- `C03-L012-05`: equivalência com `C03-L004-05` corrigida por cenário quantitativo (190 t vs 4 × 50 t); referência ajustada para p. 99 (PDF 112).
- `C06-L012-01`: equivalência com `C06-L004-02` corrigida por cenário de troca de informações de limitações do navio; referência ajustada para §6.3.15, p. 173 (PDF 186).
- Commits: JSON `00f22c9489721e40a54ebf5bca250be57f6e499c`; relatório `31d5e6793402ea26ed78aa9f8b600925e2088bc1`. Requer nova verificação de gates no HEAD final.

## Segunda rodada de correções semânticas

- Substituídos por competências diferentes: `C01-L012-02`, `C01-L012-04`, `C03-L012-01`, `C04-L012-01`, `C05-L012-03`, `C09-L012-01`.
- Mantidos 40 IDs, cinco por capítulo e A=8 B=8 C=8 D=8 E=8; revisão independente e verificação de gates no HEAD final ainda pendentes.
- Commits: JSON `bbd5b1b9efc702904986e439add356247b2d1215`; relatório `924414a579ca01fa5d0068edba9ea0d422eb8552`.
