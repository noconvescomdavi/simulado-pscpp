# HENSEN — Lote 006 — Gates e checkpoint 01

**Data:** 2026-10-29. **Repositório:** `noconvescomdavi/simulado-pscpp`. **PR:** [#173](https://github.com/noconvescomdavi/simulado-pscpp/pull/173). **Branch:** `audit/hensen-lote-001-20261029`.

## Alterações persistidas

1. `data/question-extensions/hensen-lote-006.json`: 40 questões novas (criação `8da2aa00b8e513fd9aec2879770442b3bd1bee2e`).
2. Correção semântica de `ANV-HENSEN-C06-L006-01`, que inicialmente duplicava a habilidade de `ANV-HENSEN-C06-L004-02`: commit `5bfa522d8696d877f8b7931ae708bce4c840a0b0`.
3. `lib/question-banks-source.js`: importação e inclusão do Lote 006 no banco de Arte Naval, commit `24c36ebc59a6047fdc1a1efdd4a7a262001eba1a`.
4. `reports/hensen/2026-10-29-lote-006-auditoria.md`: relatório por ID, gabarito e localizador, criação `d20545c12ea6bf4bc4b962d06fd439fe72b54587`.
5. **14 correções de localizadores bibliográficos** após conferir a posição das passagens nos cabeçalhos da obra, commit `ce4dc5ee98498c4571bd4939434a80ae7dd2d288`; relatório sincronizado em `2083b01f50a4d89e024cd9c04a8367d2aa871b61`.

## Inventário e validação

- Históricos HENSEN: **170**; 119 em quarentena reversível e 51 ativos em metadados.
- Lotes 001–006: **240** questões novas, 40 por lote, sem sobrescrever os anteriores.
- Total esperado HENSEN: **410 registros**, dos quais **291 ativos** antes de filtros adicionais.
- Lote 006: 5 questões por capítulo 1–7 e 9; 40 IDs únicos; cinco alternativas por questão; **A=8, B=8, C=8, D=8, E=8**.
- Fonte primária: Henk Hensen, *Tug Use in Port*, 4ª ed. 2021, Google Drive: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view.
- Verificação estrutural e ausência de duplicações literais contra 370 HENSEN anteriores: aprovadas na leitura dos JSON do GitHub. Triagem lexical pós-correção: nenhum par com Jaccard de tokens significativos >= 0,30; revisão semântica independente ainda pendente.
- A paginação dos localizadores foi revisada no texto extraído e corresponde a página impressa + 13 no PDF; validação visual independente de cada página ainda pendente.

## Gates observados após commit de correção bibliográfica `ce4dc5ee9`

| Workflow | Situação na consulta | Run |
|---|---|---|
| Validate PIANC 121 CGE Quarantine | completed / success | [40974695256](undefined) |
| PSCPP Integral Bank Audit | in_progress | [40974695271](undefined) |
| CI | in_progress | [40974695234](undefined) |
| Audit Main Question Banks | completed / success | [40974695221](undefined) |
| Full Question Bank Audit | completed / success | [40974695232](undefined) |

**Observação:** esses resultados não comprovam os gates do HEAD final documental, que ainda muda com este checkpoint. Não foi executado `npm run validate` ou `npm run build` localmente nesta sessão; dependemos dos workflows GitHub Actions.

## Pendências e próximo passo

1. Consultar os cinco workflows do **HEAD final deste checkpoint** e corrigir falhas sem desligar testes, se ocorrerem.
2. Executar revisão independente da semântica, de gabaritos e de páginas PDF; verificar especialmente itens de normas de classe citadas historicamente e evitar apresentá-las como requisitos universais atuais.
3. Continuar a homologação bibliográfica individual das 51 questões históricas ativas, preservando 119 em quarentena.
4. Não realizar merge nem deploy antes de todos os gates e da homologação editorial.
5. Na próxima execução, conferir este checkpoint e a existência de `hensen-lote-007.json` antes de criar o próximo lote.

**Estado nesta execução:** Lote 006 criado, corrigido, integrado e auditado na branch; PR aberto; sem merge nem deploy.
