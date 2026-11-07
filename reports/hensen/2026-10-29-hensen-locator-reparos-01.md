# HENSEN — reparos individuais de enunciados dependentes de localizador (29/10/2026)

**Escopo:** apenas Henk Hensen, *Tug Use in Port*, 4ª edição, capítulos 1–7 e 9, Arte Naval / `hensen-tug`. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 .

## Diagnóstico reproduzível

O [Full Question Bank Audit do HEAD `bd0f10eb`](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40969338336) passou como workflow, mas seu artefato `full-question-bank-audit.json` registrou **2.556 HIGH, 0 CRITICAL, 25.745 questões em 159 arquivos**: `LOCATOR_DEPENDENT_STEM=814`, `DUPLICATE_STEM=1483`, `GENERIC_TEMPLATE=258`, `OFFICIAL_SOURCE_DUPLICATE_OPTIONS=1`.

O exame individual dos 2.556 registros identificou **dois achados no escopo HENSEN**:
1. `data/question-extensions/hensen-lote-002.json` — `ANV-HENSEN-C06-L002-01` — `LOCATOR_DEPENDENT_STEM`.
2. `data/question-extensions/hensen-lote-005.json` — `ANV-HENSEN-C09-L005-05` — `LOCATOR_DEPENDENT_STEM`.

Os demais 2.554 HIGH estão fora desses dois IDs HENSEN e **não foram declarados resolvidos**. A diferença entre o total anterior 2.555 e o novo 2.556 coincide com a inclusão do Lote 005 e com o segundo ID apontado; não se atribui causalidade ao número sem a comparação completa dos artefatos históricos.

## Reparo 1 — `ANV-HENSEN-C06-L002-01`

- **Antes (enunciado):** “Um rebocador opera junto ao costado de um navio de casco largo ainda com seguimento. Ao comparar os ombros de proa e popa com a seção mestra, qual tendência hidrodinâmica Hensen descreve?”
- **Depois (enunciado):** “Um rebocador que empurra um navio de casco largo e ainda com seguimento é deslocado da região central do costado para o ombro de proa. Qual efeito hidrodinâmico deve ser considerado nessa mudança de posição?”
- **Justificativa:** remove referência ao autor e formula a pergunta como decisão operacional autocontida. Mantém o contraste físico entre ombros e seção mestra nas alternativas, sem exigir que o aluno decodifique localizador.
- **Fonte primária conferida:** capítulo 6, §6.2.4, **p. 154 / PDF p. 167**: o escoamento relativo pode ser mais rápido junto aos ombros de navios de casco largo do que na região central, reduzindo o desempenho do rebocador que empurra.
- **Preservados:** ID, cinco alternativas, gabarito **D**, explicação, capítulo, taxonomia, localizador, estado ativo.
- **Commit:** https://github.com/noconvescomdavi/simulado-pscpp/commit/3179b3ac222aea5b4692472eacd5e2c3be25e014 .

## Reparo 2 — `ANV-HENSEN-C09-L005-05`

- **Antes (enunciado):** “Um candidato utiliza a seção de regulamentos de escolta da 4ª edição de Hensen para afirmar quais regras estão vigentes hoje. Qual cautela é necessária?”
- **Depois (enunciado):** “Uma empresa prepara a escolta de um petroleiro em porto com regras compulsórias e utiliza um panorama regulatório elaborado em 2017–2018. Antes de executar a operação em 2026, qual providência é indispensável?”
- **Justificativa:** substitui pergunta metatextual sobre uma seção do livro por decisão prática de conformidade regulatória e validação de normas vigentes. Não pressupõe que a norma histórica esteja em vigor.
- **Fonte primária conferida:** capítulo 9, §9.7, **p. 267 / PDF p. 280**: o autor informa que as regras descritas refletem 2017–2018 e podem ser alteradas.
- **Preservados:** ID, cinco alternativas, gabarito **E**, explicação, capítulo, taxonomia, localizador, estado ativo.
- **Commit:** https://github.com/noconvescomdavi/simulado-pscpp/commit/7f06f85da98177908bf9be2412fa7c779126c17f .

## Controles e próximos gates

- **Nenhum teste foi desabilitado, nenhum achado apagado do artefato e nenhuma questão histórica reativada.** Os dois reparos alteram somente o enunciado, preservando conteúdo técnico e gabaritos.
- Os **119 históricos em quarentena reversível** permanecem inativos; o candidato reescrito `ANV-B010-16` ainda requer revisão independente.
- A aprovação dos workflows do HEAD anterior não é transferível aos novos commits. **Reexecutar e conferir o Full Question Bank Audit, CI, demais auditorias e Vercel Preview do HEAD final**; não fazer merge até todos os gates e a homologação editorial estarem concluídos.
- A Vercel Production READY verificada antes das alterações corresponde à `main` `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, **não** aos lotes HENSEN.
