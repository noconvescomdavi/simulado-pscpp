# Checkpoint 584 — Hensen L022/C01 — 2026-11-16

PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173
Branch: audit/hensen-lote-001-20261029
Banco consultado: data/question-extensions/hensen-lote-022.json (blob 37bb9ad076ba543630617c258ac517f56a38229f).
Obra consultada diretamente: Henk Hensen, *Tug Use in Port*, 4th ed. (2021), https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view.
Escopo desta rodada: cinco questões do capítulo 1, 25 alternativas. Fonte textual extraída pelo conector Google Drive; **sem inspeção visual do PDF**. Nenhuma homologação definitiva.

| ID | Antes → depois | Cotejo individual e análise dos distratores |
|---|---|---|
| ANV-HENSEN-C01-L022-01 | A → A; sem edição | §1.2.2, p.5: condições de maré, profundidade, pontes/eclusas podem exigir janelas; requisitos mudam ao longo da rota e tipos distintos podem ser usados. A sustentada. B ignora percurso; C supõe supressão das janelas; D impõe tipo único; E usa arqueação como critério exclusivo. Referência textual coerente; paginação PDF p.18 não inspecionada. |
| ANV-HENSEN-C01-L022-02 | B → B; sem edição | §1.2.5, p.6: na ausência de mooring boats, aproximar navio para passar espias; rebocadores devem poder empurrar o costado. B sustentada. A proíbe empurrar; C inventa conexão permanente; D pressupõe amarração antes de aproximação; E impõe operação pela popa. Referência textual coerente; paginação PDF p.19 não inspecionada. |
| ANV-HENSEN-C01-L022-03 | C → C; sem edição | §1.2.5, p.6: blackouts na chegada; rebocadores devem, na medida do possível, frear velocidade e/ou controlar rumo. C sustentada. A exclui controle longitudinal; B exige substituição total; D interrompe assistência; E confunde bollard pull estático com controle em movimento. Referência textual coerente; paginação PDF p.19 não inspecionada. |
| ANV-HENSEN-C01-L022-04 | D → D; sem edição | §1.2.4, p.6: guindastes flutuantes, barcaças, plataformas, incêndio/poluição exigem tipo/porte, manobrabilidade, equipamentos e métodos próprios. D sustentada. A supõe BP suficiente; B substitui equipamento sem nexo; C ignora equipamento; E limita indevidamente a ro-ro. Referência textual coerente; paginação PDF p.19 não inspecionada. |
| ANV-HENSEN-C01-L022-05 | E → E; sem edição | §1.2.2, p.5, em conjunto com §1.2.1: passagem de ponte e exposição a ondas/marulho impõem restrições de projeto/operação. E é inferência técnica plausível; **altura aérea explícita não foi localizada no trecho textual** e deve ser confirmada antes de homologação. A/B negam restrição da ponte; C ignora condições ambientais; D nega efeito de ondas. Referência bibliográfica específica insuficiente para todo o enunciado; paginação PDF p.18 não inspecionada. |

## Duplicidades cruzadas — triagem, não decisão definitiva
- C01-L022-01 × C01-L021-03: mesma solução de tipos distintos de rebocadores por trechos; **sobreposição forte**.
- C01-L022-02 × C01-L021-04: mesma exigência de empurrar o costado sem lancha de amarração; **duplicidade semântica provável**.
- C01-L022-05 × C01-L021-02: sobreposição parcial de ondas/exposição, mas cenários e requisitos diferem.
Não desativar nem reativar questões por similaridade sem comparação editorial completa. Revisão global 001–022 não realizada.

## Decisão e pendências
Gabaritos mantidos; nenhuma alteração segura no JSON nesta rodada. O campo preexistente validation.source_verified=true não representa certificação desta auditoria. Pendente inspeção visual das páginas/figuras e confirmação de paginação, deduplicação integral, decisão sobre os pares acima e checagem bibliográfica específica de C01-L022-05. Os 119 históricos permanecem em quarentena, **sem revisão individual nesta rodada**. Não foram executados testes locais ou gates finais sobre novo SHA. Sem merge, sem deploy, sem certificação Vercel Production READY.

Próximo: L022/C02, depois resolver duplicidades e lacunas acumuladas.