# Reconciliação efetiva da restauração MEO-01 com o banco canônico

**Main:** `07abec6f74411a1a49fe55dab920bdcf5b96d090`  
**Banco:** `data/questions/meteorologia-oceanografia.json`  
**Restauração:** `data/question-restorations/meteorologia-oceanografia-01.json` (blob `8cfeaba355d7a8ef85b22a37c5ebd0b823094678`)

## Resultado integral do lote

| Verificação | Quantidade |
|---|---:|
| canonical_total | 1353 |
| restoration_total | 150 |
| matched_existing_ids | 150 |
| not_found | 0 |
| duplicate_in_canonical | 0 |
| content_replaced | 150 |
| topic_changed | 138 |
| module_changed | 138 |
| locator_changed | 138 |
| answer_letter_changed | 27 |
| correct_option_text_changed | 150 |
| formal_structure_ok | 150 |
| bibliographically_homologated | 0 |
| changes_applied | 0 |

**Conclusão:** os 150 IDs de restauração foram localizados na base; os 150 substituem conteúdos diferentes, inclusive com mudanças de tópico/módulo. Isso não equivale a 150 erros de gabarito. A auditoria anterior analisou 12 questões na restauração, mas não considerou o conteúdo canônico substituído. As propostas permanecem suspensas até a decisão de preservação editorial e rastreio do histórico do aluno.

## Evidência concreta

`MEO-0008`: versão canônica aborda intensidade em cartas de correntes de maré (cap. X); restauração aborda definição de preamar (cap. IX). `MEO-0011`: canônica aborda densidade da água em correntes; restauração aborda sizígia. `MEO-0016`: canônica aborda comprimento de onda; restauração aborda amplitude de maré.

## Limites

Reconciliação por ID e comparação integral de campos concluídas **somente no lote 01 de Meteorologia (150 registros)**; não foi executado o runtime Node. O comportamento esperado de substituição por ID foi lido em `lib/question-restorations.js`. Os hashes FNV-1a-64 são diagnósticos, não SHA-256. Nenhuma questão aprovada, alterada ou integrada nesta rodada.

Detalhes de antes/depois em `RECONCILIACAO_MEO_CANONICO_001.json` e matriz em `.csv`. Próximo: comparar versões e validade editorial em sublotes por conceito; preservar IDs sem trocar assunto sem justificativa, executar script no repositório com as dependências e prosseguir bibliografia das nove fontes.
