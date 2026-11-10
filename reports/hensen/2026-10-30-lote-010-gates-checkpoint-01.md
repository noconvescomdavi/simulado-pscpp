# HENSEN — Lote 010 — checkpoint persistente 01

**Data:** 30/10/2026 (Brasília). **PR:** [#173](https://github.com/noconvescomdavi/simulado-pscpp/pull/173). **Branch:** `audit/hensen-lote-001-20261029`.

## Entregas

- [40 questões HENSEN do Lote 010](../../data/question-extensions/hensen-lote-010.json), capítulos 1–7 e 9, cinco por capítulo; gabaritos A=8, B=8, C=8, D=8, E=8.
- Integração efetiva em `lib/question-banks-source.js`, sem modificar lotes 001–009 ou arquivos históricos.
- [Relatório individual por ID](./2026-10-30-lote-010-auditoria.md) com 40 gabaritos, temas, localizadores e correções.
- Inventário bruto HENSEN esperado: **570 registros** (170 históricos + 400 novos dos Lotes 001–010). Preservados 119 históricos em quarentena; 51 históricos ativos seguem sujeitos a homologação.
- 40/40 âncoras técnicas conferidas por extração textual na fonte primária e 40/40 páginas impressas compatíveis com os localizadores (PDF p. = impressa + 13).
- Zero colisões literais de enunciados ou IDs com 360 questões novas anteriores e 170 históricas; inspeção estrutural de alternativas e gabaritos concluída.
- Reescritas editoriais realizadas nos IDs C01-L010-01, -02, -04, -05 e C05-L010-05 para reduzir sobreposições; referências de C07-L010-01 e -02 corrigidas da p. 205 para a p. 206.
- O lote permanece com `validation_status=pending_editorial_review` e `duplicate_checked=false`. Ausência de colisões literais não substitui revisão semântica independente.

## Commits da execução

- `c89c808eca227c6662a0105c076b39b56e5ae24e`: criação do JSON.
- `ac4fb35f37c23422c7d6d7a7e2d88f19f7d25784`: reescritas de C01-L010-04/05.
- `46d322eda09ab0ccd3d1f24ac0ca037c882056ec`: integração ao carregador.
- `072b33ea6ec0cf59582f7541105a9cfc1430db01`: correção de paginação de C07-L010-01/02.
- `1e185af1e9476a2936fef25047093c641535b185`: reescritas para reduzir sobreposição.
- `3e5d00639fa69bbfebeeaee0362f14f935d259ad`: ajuste bibliográfico §1.2.1.
- `348e4f2045f3a4b7efc2df373d426e5533ffa410`: relatório individual.

## Gates observados antes deste checkpoint

No commit `348e4f2045f3a4b7efc2df373d426e5533ffa410`, os cinco workflows estavam **em execução** na última consulta, sem aprovação final:

| Workflow | Run | Estado observado |
|---|---|---|
| Audit Main Question Banks | [40998259117](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998259117) | in_progress |
| Validate PIANC 121 CGE Quarantine | [40998258933](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998258933) | in_progress |
| Full Question Bank Audit | [40998259022](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998259022) | in_progress |
| CI | [40998258940](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998258940) | in_progress |
| PSCPP Integral Bank Audit | [40998259074](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998259074) | in_progress |

**Status Vercel no commit de relatório:** `failure`, conforme contexto `Vercel` do GitHub, associado a bloqueio anterior de limite de deployments. O Preview READY no SHA final não foi confirmado.

**Atenção:** este checkpoint gera novo HEAD; os gates devem ser reconsultados para o SHA exato do HEAD final, e não inferidos do commit anterior.

## Pendências para homologação

1. Revisão semântica independente das 40 questões, com atenção especial a distratores e aos itens quantitativos.
2. Cotejo visual das páginas e figuras do PDF original; a extração textual não é prova visual completa.
3. Confirmar os cinco workflows e o Preview Vercel no HEAD final.
4. Manter o PR aberto, sem merge ou deploy, até que todos os gates e a revisão editorial sejam aprovados.
5. Próxima execução: verificar primeiro se o Lote 011 já existe, para não duplicar trabalho.
