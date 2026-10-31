# HENSEN — Lote 019 — checkpoint 01
Data: 2026-10-30. PR #173. Branch `audit/hensen-lote-001-20261029`.
- HEAD observado antes do checkpoint: `fffb089184cd44213e5961c5cd9b664a5ac76034`.
- JSON inicial do lote: commit `8e48dad54856ddfac2bf43283d1a60eda53659de`.
- Revisão de quatro questões por sobreposição temática: commit `8cb1dcce5168d45e71446df358a0394231af9d82`.
- Relatório individual dos 40 IDs: commit `fffb089184cd44213e5961c5cd9b664a5ac76034`.
- 18 lotes anteriores preservados, com 720 questões novas. Lote 019 acrescenta 40: 19 lotes / 760 novas; somadas aos 170 históricos, inventário bruto esperado de 930 registros HENSEN.
- Cinco questões nos capítulos 1–7 e 9; cinco alternativas por item; A=8 B=8 C=8 D=8 E=8.
- Fonte primária: Henk Hensen, *Tug Use in Port*, 4ª ed. (2021), Google Drive `1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9`.
- 40 âncoras textuais localizadas nas páginas impressas declaradas, com capítulo e seção. Conferência visual integral pendente.
- Auditoria local em memória: 40 IDs únicos, 5 alternativas distintas por item, 8 gabaritos por letra; zero colisões literais e zero alertas lexicais Jaccard >=0,33 após as quatro reescritas na comparação com os 720 itens anteriores.
- **Não concluído**: originalidade conceitual independente, revisão dos 170 históricos e banco principal, testes npm, CI e auditorias no HEAD final, Preview Vercel.
- Os 119 históricos em quarentena, 51 ativos e lotes anteriores foram preservados; workflows, validadores e configuração de deploy não foram alterados.
- Status editorial `pending_editorial_review`. **Não fazer merge nem deploy até aprovação de todos os gates e homologação editorial.**

## Correção de gate e auditoria histórica

- A primeira execução de `Full Question Bank Audit` falhou no `HENSEN_SOURCE_GUARD` exclusivamente em `ANV-HENSEN-C05-L019-03` por justificativa insuficiente. Explicação técnica ampliada no commit `113d8a8c48b7a409c3b884f3a43ca912637ebe19`; não houve mudança de gabarito ou alternativas.
- Confronto literal e lexical do L019 com os 170 registros HENSEN históricos dos dez blocos: zero colisões e zero alertas Jaccard >= 0,33. Os 119 em quarentena e 51 ativos permanecem inalterados.
- Verificar novamente todos os workflows e Vercel no HEAD final deste checkpoint. O resultado do commit anterior não homologa o HEAD novo.
