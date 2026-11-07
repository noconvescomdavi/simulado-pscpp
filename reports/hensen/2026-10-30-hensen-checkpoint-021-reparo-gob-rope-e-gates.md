# ESTIBORDO/PSCPP — Checkpoint HENSEN 021 — deduplicação de gob rope, saturação do capítulo 1 e gates

**Data:** 2026-10-30 (America/Sao_Paulo). **Escopo:** Henk Hensen, *Tug Use in Port*, 4ª edição, capítulos 1–7 e 9. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173. **Branch:** `audit/hensen-lote-001-20261029`.

## Correção genuína efetivada

**ID:** `ANV-HENSEN-C07-L020-01` em `data/question-extensions/hensen-lote-020.json`. **Fonte primária consultada diretamente:** PDF da 4ª edição em https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view, capítulo 7, §7.2.1, p. impressa 178 (PDF 191).

- **Antes:** questão sobre gob rope mantida conectada e de comprimento inadequado após saída do cais, capaz de impedir a guinada do rebocador e causar *girting*; resposta B. O histórico `ANV-B010-16`, já reescrito porém ainda em quarentena, cobrava precisamente o mesmo mecanismo e a mesma consequência.
- **Depois:** questão sobre manilha deslizante de diâmetro insuficiente para o cabo principal de aço ou fibra, capaz de induzir **fadiga e ruptura**; resposta B mantida. Trata-se de risco diferente, explicitamente descrito na mesma página da obra.
- **Antes — tópico:** `Gob rope remanescente após saída do berço`. **Depois:** `Manilha do gob rope — fadiga do cabo principal`.
- **Antes — alternativas:** A: a linha aumenta a estabilidade; B: a linha pode ficar tesada, impedir a guinada e causar girting; C: afeta só a velocidade do guincho; D: elimina forças transversais; E: risco só com navio parado.
- **Depois — alternativas:** A: aumento de resistência por compactação; B: fadiga localizada e possível ruptura; C: deslocamento automático do ponto para proa; D: eliminação de esforços de flexão; E: redução permanente da carga independentemente da tração.
- **Antes — explicação:** desconectar gob rope quando desnecessária; comprimento inadequado impede alinhamento do rebocador. **Depois — explicação:** manilha subdimensionada em relação ao cabo de aço ou fibra pode produzir fadiga e ruptura, fenômeno distinto da passagem livre do cabo na liberação de emergência.
- **Justificativa:** eliminar equivalência semântica confirmada com histórico `ANV-B010-16` sem inventar fundamento bibliográfico, preservando um item útil sobre outro mecanismo de falha. O histórico continua `active=false` e `validation_status=quarantined`; **nenhuma reativação**.
- **Preservados:** ID, gabarito B, `active=true`, `validation_status=pending_editorial_review`, `arte-naval/hensen-tug`, capítulo 7, §7.2.1, p. 178/PDF 191. Lote 020: 40 IDs únicos, cinco alternativas por item, A=B=C=D=E=8. Isso não constitui homologação editorial integral.
- **Commits:** https://github.com/noconvescomdavi/simulado-pscpp/commit/03c8db108b6e6f19568d64a3703f633280e847e5 e https://github.com/noconvescomdavi/simulado-pscpp/commit/b7968eea2383174e3d25a0db931f86a239b9a910.
- **Relatório individual atualizado:** https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-30-lote-020-auditoria.md — commit https://github.com/noconvescomdavi/simulado-pscpp/commit/59028ed77f5703881c175bac8d6eb1860e041f8e.

## Auditoria semântica adicional: saturação do capítulo 1

Inspecionados os enunciados do capítulo 1 nos **20 lotes**, totalizando **100 itens** (5 por lote). Identificadas equivalências de competência que **não são capturadas pela ausência de colisão literal**:

| ID sob revisão | Comparação | Conclusão |
|---|---|---|
| `ANV-HENSEN-C01-L013-01` | `ANV-HENSEN-C01-L002-03` | Redundância confirmada: serviços de combate a incêndio/poluição impõem requisitos próprios, §1.2.4 p. 6 |
| `ANV-HENSEN-C01-L013-02` | `ANV-HENSEN-C01-L002-02` | Redundância confirmada: diversidade de tipos de navios exige especificações variadas, §1.2.3 p. 6 |
| `ANV-HENSEN-C01-L020-03` | `ANV-HENSEN-C01-L002-02`, `C01-L005-03` | Sobreposição forte: diversidade de cascos, defensas e equipamentos; reformulação editorial recomendada |
| `ANV-HENSEN-C01-L020-05` | `ANV-HENSEN-C01-L013-05`, `C01-L017-05` | Sobreposição forte: mesmo bollard pull, velocidades/condições/UKC diferentes; reformulação editorial recomendada |
| `ANV-HENSEN-C01-L020-01` | `ANV-HENSEN-C01-L015-03` | Proximidade temática: mudança de método conforme fase da rota; verificar objetivo cognitivo antes de decidir |
| `ANV-HENSEN-C01-L020-02` | `ANV-HENSEN-C01-L017-01` | Proximidade temática: aptidão em terminal exposto; item L020 focaliza especificamente resposta do guincho |

**Decisão:** não marcar esses itens como `approved`, não gerar novo lote enquanto a cobertura estiver saturada, e não inventar novos conceitos apenas para manter cinco questões por capítulo. Reformulação deve se basear em competência distintiva demonstrável na obra e confronto com os demais lotes. Nenhum dos seis itens acima foi modificado nesta execução.

## Gates e risco de publicação

**HEAD antes das alterações desta execução:** `6fab9d832e11e8e762132053204350af86348395`. No SHA, os cinco workflows foram concluídos com `success`: CI (incluindo Study Plan V3 invariants), Full Question Bank Audit, Audit Main Question Banks, PSCPP Integral Bank Audit e Validate PIANC 121. O validador HENSEN relatou 20 lotes/800 questões/0 falhas estruturais.

**Full Question Bank Audit no SHA anterior:** 174 arquivos, 26.345 questões, **2.558 HIGH**, **0 CRITICAL**: `DUPLICATE_STEM=1483`, `LOCATOR_DEPENDENT_STEM=816`, `GENERIC_TEMPLATE=258`, `OFFICIAL_SOURCE_DUPLICATE_OPTIONS=1`. O workflow conclui com sucesso apesar desses achados; **não são saneados pelo simples resultado verde**. Comparação com o relatório versionado antigo de `main` não é equivalente; não foi demonstrado que os 2.558 achados são todos preexistentes. O teste Study Plan V3 passou, mas a causa original da falha histórica não foi reproduzida/isolada.

**HEAD após a correção e atualização do relatório individual:** `59028ed77f5703881c175bac8d6eb1860e041f8e`. Na consulta de 2026-10-30, os cinco workflows estavam `in_progress`. **Vercel** reportou status `failure` por limite de builds em https://vercel.com/estibordo?upgradeToPro=build-rate-limit; consulta de deployments pelo SHA retornou zero, sem Preview READY do HEAD. Não houve tentativa de contornar a cota.

**PR #173:** aberto, `mergeable=true` na consulta, porém branch ainda **2 commits atrás da main**; divergência exige reconciliação e nova homologação. **Production:** último deployment READY consultado corresponde a `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ; `main` do PR apontava para `37f945957d5319ade9c5cec447d41e67cc8fb378`. Production **não** está verificada para o SHA da branch nem para a main atual.

**Inventário:** 20 lotes novos/800 questões propostas; 170 históricos HENSEN, dos quais 119 em quarentena reversível e 51 ativos pendentes de homologação. **Nenhum merge, nenhuma publicação, nenhuma reativação, nenhum novo lote.** O checkpoint documental também move o HEAD, portanto todos os gates precisam ser reconfirmados no SHA final.

## Próxima prioridade

Reconfirmar gates do HEAD final, resolver o bloqueio legítimo do Preview, reconciliar a base, tratar as equivalências confirmadas do capítulo 1 com fonte, e revisar os 119 históricos caso a caso. Somente integrar após revisão bibliográfica/semântica, gates obrigatórios verdes e publicação segura.
