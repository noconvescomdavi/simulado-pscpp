# Auditoria de integridade do checkpoint PSCPP — 2026-11-16

Branch exclusiva: `feature/gabaritos-comentados-provas-oficiais`. Fonte: `data/pscpp/official-exam-commentary-progress.json`, blob SHA `ad9891bb7791e9c47335f43bd004be8c4429021e`.

## Inventário

- Total declarado: 264; IDs reais: 264; IDs únicos: 264; concluídas declaradas: 0; verificações bibliográficas declaradas: 40.
- Blocos: 001=100; 002=100; 003=64.
- Estados com `status=bibliography_verified`: 40. Essa contagem NÃO significa gabaritos comentados completos ou homologados.
- Questões sem `commentary_status=draft_verified_pending_integration`: 232.

## Alertas de adjudicação ou anulação (sem alteração de gabarito)

- `pscpp::official::2006::010`: `official_key_legal_locator_conflict_requires_adjudication`
- `pscpp::official::2006::051`: `official_answer_conflict_with_primary_imo_source_pending_facsimile_review`
- `pscpp::official::2006::065`: `official_key_bibliography_conflict_requires_adjudication`
- `pscpp::official::2008::014`: `annulled_pending_original_document_confirmation`
- `pscpp::official::2008::018`: `annulled_pending_original_document_confirmation`
- `pscpp::official::2008::026`: `official_key_bibliography_conflict_requires_adjudication`
- `pscpp::official::2008::027`: `duplicate_options_pending_facsimile_review`
- `pscpp::official::2008::037`: `pending_official_answer_discrepancy_adjudication`
- `pscpp::official::2008::045`: `official_exam_annulled_no_correct_option`
- `pscpp::official::2008::051`: `official_exam_annulled_no_correct_option`
- `pscpp::official::2008::065`: `official_exam_layout_ambiguity_pending_facsimile_review`
- `pscpp::official::2011::028`: `official_annulled_pending_original_verification`

## Regras para próxima remessa

1. Não alterar `completed` nem homologar com base apenas em `status=bibliography_verified`.
2. Para cada questão, cotejar fac-símile da prova e gabarito definitivo independente; registrar motivos de A–E, obra, edição, página física e citação curta verificada.
3. Priorizar as divergências acima e as questões 2012-041 a 2012-050, cujas notas ainda registram lacunas de páginas/trechos de Crenshaw, Barrass e SNAME.
4. Em fontes posteriores à data da prova, identificar expressamente a ressalva histórica.
5. Não realizar merge, deploy ou homologação antes de todos os critérios obrigatórios estarem preenchidos.

## Limite da verificação

Esta execução verificou a integridade estrutural do checkpoint diretamente na branch e consultou a busca do Google Drive por obras candidatas. Não houve leitura autenticada de páginas bibliográficas adicionais; portanto, nenhuma justificativa, citação ou nova homologação foi atribuída. Não foram executados testes da aplicação.
