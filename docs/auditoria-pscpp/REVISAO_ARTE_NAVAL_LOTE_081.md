# Lote 081 — transmissão por tambor

## Base, fonte e limites

HEAD remoto e PR #172 consultados antes de editar: `56e36236929e2c2f37c108cad9b475ab833cd4f4`, lote 080. PR aberto, draft e sem merge. Base retomada por fast-forward sem descartar temporários não rastreados. Regeneração e regressão anteriores à edição passaram com 237 deltas. Nenhuma correção anterior foi refeita ou recontada. Lock cooperativo mantido durante o trabalho; escritores externos que ignorem esse lock não são excluídos. Publicação exclusiva na branch de auditoria, sem force e com expected_sha.

Fonte primária: Fonseca, Arte Naval, v.2, 8ª ed., 2019, item 11.7.c, p.763/PDF124. Página lida em texto e imagem; numeral impresso conferido. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; exemplar Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. O texto descreve o cabo de aço ou corrente, o enrolamento no tambor, a fixação dos chicotes à extremidade do setor quadrantal e a compatibilidade com servomotor elétrico. Não fornece número universal de voltas nem exclusividade de fonte elétrica. A expressão do original “sem fim”, acompanhada de referência a chicotes, foi evitada nas novas proposições para não exigir uma interpretação geométrica não demonstrada pelo trecho. Não se inferiu eliminação dos chicotes ou ausência de fixação a partir dessa expressão. Nenhuma figura ou cálculo é exigido pelas questões; nenhum livro/imagem privada foi incluído no commit.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-117c-M1 | As proposições físicas não chegavam ao runtime, que apresentava um enunciado genérico; explicação repetia falsas sem julgá-las. | Restaurados quatro itens sobre elemento flexível, fixação, enrolamento e compatibilidade elétrica; falsas explicitamente refutadas; cinco justificativas; referência com páginas e hash. Média/L2 proposta. | 11.7.c, p.763/PDF124 | B mantido; V/V/F/F |
| AN-C11-117c-M2 | Pergunta dependia do artigo; distratores misturavam barras, tubos de telemotor, selsyn e parafusos; explicação apenas repetia a resposta. | Enunciado autossuficiente com cinco descrições comparáveis do mesmo elemento, sua disposição e sua fixação; cada erro de enrolamento/fixação explicado; cinco justificativas; páginas e hash. Fácil/L1 proposto. | 11.7.c, p.763/PDF124 | C mantido |
| AN-C11-117c-M3 | V/F efetivo era classificado como parágrafos; comando após itens e falsa sem explicação. | Comando antes dos quatro itens; falsa sobre chicotes livres contraposta à fixação no setor; julgamentos e cinco justificativas; páginas e hash. Média/L2 proposta. | 11.7.c, p.763/PDF124 | D mantido; V/V/F/V |

Três correções primárias parciais, quinze justificativas e zero aprovações finais. IDs, chaves, identidade temática, três modelos, tracking, taxonomia e flags legadas preservados. Flags antigas não são evidência de aprovação final. Dificuldade e nível são propostas, sem calibração psicométrica. O grupo 117d permanece intacto para revisão própria.

## Unicidade, carregamento e diversidade

M1: apenas I/II verdadeiras, só B. A inclui III e omite II; C inclui IV e omite I; D reúne as duas falsas; E inclui ambas falsas. M2: só C conserva enrolamento e fixação ao setor. A retira as voltas; B deixa chicotes livres; D os prende exclusivamente ao tambor; E os desloca para êmbolos. M3: V/V/F/V, só D; A erra II/III/IV, B erra I/III/IV, C erra I/II/III e E erra III. Compatibilidade elétrica não foi convertida em exclusividade. Não se introduziu medida, eficiência, potência ou generalização sobre a frota atual.

Comparação estrutural antes/depois registrada: M1 simple → assertions com quatro itens; M2 simple → simple; M3 paragraphs → statements com quatro itens. Os três objetos principais são integralmente iguais às versões efetivas regeneradas, sem mass_reformulation. Somente esses três IDs mudaram em relação ao inventário 080 versionado. Normalizadores e critérios não foram alterados; o teste recebeu apenas os novos IDs nas listas explícitas de fonte e formato, sem relaxar asserções. Variantes do mesmo conceito não devem coexistir na mesma prova; a prevenção semântica global e a rechecagem independente permanecem pendentes.

## Validação executada

Quatro regenerações e quatro checks individuais passaram. Runtime, seleção/matriz, proveniência, catálogo e regressão passaram. Regressão: **240 deltas acumulados exatos**, 11.862 ocorrências de cadernos preservadas, 540 proposições renderizadas e 525 alternativas diretas preservadas. População: 27.435 registros físicos; 12.102 cadernos + 1.984 PSCPP = 14.086 ocorrências; 13.715 IDs únicos. Matriz 100 = 25/25/10/10/10/10/10 preservada. Build direto Next retornou 0 com compilação, lint/tipos, 101/101 páginas e resumo integral das rotas. Avisos CSS/autoprefixer/cache são não fatais e permanecem nos logs.

| Verificação | Resultado |
|---|---|
| generate e check: pscpp-bank, question-banks, question-catalog, flashcard-decks | 0 cada |
| validate-runtime-question-banks / validate-pscpp-exam-selection | 0 cada |
| test-question-source-provenance / validate-runtime-question-catalog | 0 cada |
| test-pscpp-audit-anv0005 | 0; 240 deltas exatos |
| test-notebook-complete-stems | 1; ANV-0142 anterior |
| validate-editorial-runtime | 1; 77 localizadores anteriores |
| audit-pscpp-runtime-triage / audit-pscpp-runtime-inventory | 0 cada |
| validate-pscpp-editorial-evidence | 2; zero aceitos / 14.086 pendentes |
| next build direto | 0; log completo |

Códigos de saída, logs, hashes e comparação estrutural em EVIDENCIAS_LOTE_081.json. O diff final foi conferido; nenhum normalizador, regra de seleção, dado privado ou função de usuário alterado. Aprovação técnica dos testes listados não substitui aprovação editorial.

## Acumulado e continuidade

Base 080: 237 IDs / 240 conferências parciais. Neste lote: +3 / +3, sem recontagem. Acumulado: **240 IDs com correções parciais, 243 conferências bibliográficas parciais e zero aprovações finais**. 240/13.715 = 1,75% dos IDs, não percentual de auditoria concluída. Triagem: 156 candidatos sem proposições e 77 localizadores; 97 corrigidos + 3 falsos positivos + 156 pendentes = 256. Fora dessa triagem: 143 correções; 97 + 143 = 240.

Próximo: AN-C11-117d-M1/M2/M3, após verificar presença efetiva e fonte11.7.d pp763–764/PDF124–125, com figura11-6 se necessária. Programa/edital e fontes oficiais, rechecagem independente, cobertura e revisão integral de todas as disciplinas, prevenção semântica global, SQL/offline e homologação continuam pendentes. Todos os oito gates pendentes/falhos; merge_permitted=false. Sem merge em main ou deploy solicitado. Corrigida também a instrução antiga de retomada que ainda declarava bloqueio de publicação anterior, incompatível com os checkpoints remotos já publicados; nenhuma contagem alterada por essa atualização documental.
