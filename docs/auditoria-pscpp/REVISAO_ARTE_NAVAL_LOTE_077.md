# Lote 077 — telemotor hidráulico

## Base e preservação

HEAD remoto consultado antes de editar: cd84cd40e83a17742c99a29445c48ea52a9f9eeb, lote076; PR172 aberto/draft, sem merge. CHECKPOINT.json e relatório076 lidos. O ambiente local voltou ao005, com árvore rastreada limpa. Foi avançado por fast-forward até076, preservando temporários não rastreados. As nove correções recuperadas em075 e as três de076 não foram refeitas ou recontadas. Regeneração e regressão da base confirmaram225 deltas antes das edições. A comparação desta rodada usa o inventário076 versionado, não o cache ignorado antigo do ambiente.

Lock cooperativo flock adquirido e mantido; não garante exclusão de escritores externos que ignorem o lock. Publicação limitada à branch de auditoria, com expected_sha e sem force. Sem merge em main, deploy solicitado ou dados privados alterados. Relatórios, inventários, hashes e logs públicos de validação acompanham o checkpoint; livros e imagens permanecem privados.

## Fonte primária e limites

Fonseca, Arte Naval, volume2, 8ª edição,2019, item11.6, páginas impressas761–763/PDF122–124, figura11-5 na p762/PDF123. Três páginas lidas em texto e imagens, numerais impressos conferidos, inclusive o numeral762 na página deitada do diagrama. SHA256 recalculado6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1; exemplar Drive1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec.

Figura11-5 conferida quanto aos cilindrosB/F, êmboloG, hasteH e tubosJ, e aos elementos de expansão/enchimento. Não foram extraídas dimensões, pressões ou capacidades. Nenhuma questão depende de figura ausente. A legenda identifica o receptor no compartimento do servomotor; a descrição verbal abreviada “situado no leme” não foi tratada como montagem literal do cilindro sobre a pá do leme.

O limite de60% de glicerina é o da descrição bibliográfica para a mistura de água/glicerina, sem especificação de base percentual inventada. A p763 remete ao fabricante para proporção e enchimento; essa orientação foi integrada às justificativas, evitando receita universal de manutenção. A afirmação de líquido incongelável não foi convertida em garantia para qualquer temperatura ou óleo. Também não se generalizou a volta automática a meio a todo aparelho de governo; esse comportamento do arranjo textual não é premissa exigida nestes modelos. Telemotor transmite o comando ao controle do servomotor, sem substituir sua função de potência. Não há cálculo ou nova prescrição normativa.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-116-M1 | Quatro proposições desapareciam no runtime; explicação repetia falsas sem julgá-las e limite de mistura estava isolado da orientação do fabricante. | Restauradas quatro afirmações sobre funções, proporção bibliográfica, comunicação e instruções de enchimento; julgadas as falsas e justificadas as cinco alternativas; páginas/hash. Média/L2 proposta. | 11.6, pp761–763/PDF122–124, fig11-5. | E mantido; V/V/F/F. |
| AN-C11-116-M2 | Comando dependia do artigo e distratores misturavam motores, bomba, tambor e quadrantes; explicação repetia a correta. | Pergunta autossuficiente sobre configuração hidráulica; cinco associações comparáveis de cilindros, funções e ligação; explicada a diferença de pressão e cada alternativa; páginas/hash. Fácil/L1 proposto. | 11.6, pp761–763/PDF122–124, fig11-5. | A mantido. |
| AN-C11-116-M3 | V/F não reconhecido estruturalmente; explicação repetia a falsa e não distinguia opções de líquido de instruções de manutenção. | Comando antes dos quatro itens; julgamentos e cinco justificativas; explicitadas ligação hidráulica, funções e remissão ao fabricante; páginas/hash. Média/L2 proposta. | 11.6, pp761–763/PDF122–124, fig11-5. | B mantido; V/V/F/V. |

Três correções primárias parciais, quinze justificativas e zero aprovações finais. IDs, gabaritos, formatos, três modelos do item, tracking, taxonomia e flags legadas preservados. Dificuldade/nível são propostas sem calibração psicométrica. As flags antigas não constituem aprovação bibliográfica/editorial. Rechecagem independente, edital/programa oficial, aplicabilidade integral e prevenção semântica global permanecem pendentes.

## Unicidade e carregamento

M1: I/II verdadeiras, III/IV falsas; somenteE. A aceitaIII e omiteII; B aceitaIV e omiteI; C reúne as duas falsas; D inclui ambas falsas. M2: somenteA preserva dois cilindros com funções diferentes e dois tubos; B reduz a um tubo, C troca o meio hidráulico por elétrico, D reduz a um cilindro e E elimina o receptor. M3: V/V/F/V, somenteB; A erraII/III/IV, C erraI/III/IV, D erraI/II/III e E erraIII.

Os três objetos da fonte principal são integralmente iguais às versões efetivas após regeneração. Sem mass_reformulation e sem alteração de normalizadores, políticas ou critérios. Apenas três IDs diferem do inventário076; as demais versões efetivas foram preservadas. O teste regressivo recebeu somente os três IDs nas listas explícitas de origem/formato; nenhuma asserção anterior foi removida ou relaxada. M1 recupera quatro proposições; M3 passa a ter quatro itens reconhecidos pelo componente. Os três modelos e variantes dessa competência não devem coexistir na mesma prova; a prevenção global ainda está pendente.

## Validação

Regenerações individuais de runtimePSCPP, bancos, catálogo e flashcards passaram. Validações runtime, seleção/matriz, proveniência, catálogo e regressão passaram. Regressão acumulada:228 deltas exatos,11874 ocorrências de cadernos preservadas,508 proposições renderizadas e505 alternativas diretas preservadas. Banco ativo preservado:12102 cadernos+1984PSCPP=14086 ocorrências,13715 IDs únicos e27435 registros físicos. Matriz100=25/25/10/10/10/10/10 preservada.

Build direto node node_modules/next/dist/bin/next build retornou0, com compilação,lint/tipos,101/101páginas e resumo completo de rotas. Os avisos CSS/autoprefixer/cache foram mantidos no log. Regenerações individuais antecederam o build; não se usa log incompleto como prova. Resultados, códigos de saída, hashes e logs em EVIDENCIAS_LOTE_077.json. Inventário e triagem regenerados, sem aceitar triagem automática como revisão individual.

| Verificação | Resultado |
|---|---|
| generate:pscpp-bank / question-banks / question-catalog / flashcard-decks | 0 cada |
| validate-runtime-question-banks | 0 |
| validate-pscpp-exam-selection | 0 |
| test-question-source-provenance | 0 |
| validate-runtime-question-catalog | 0 |
| test-pscpp-audit-anv0005 | 0;228 deltas |
| test-notebook-complete-stems | 1;ANV-0142 anterior |
| validate-editorial-runtime | 1;77 localizadores anteriores |
| audit-pscpp-runtime-triage / inventory | regenerados |
| validate-pscpp-editorial-evidence | falho;zero aceitos/14086 pendentes |
| next build direto | 0,log integral |

## Acumulado e continuidade

Base076:225 IDs/228 conferências parciais. Novos neste lote:+3/+3. Acumulado228 IDs corrigidos parcialmente,231 conferências parciais e zero aprovações finais;228/13715=1,66% dos IDs, não percentual de auditoria concluída. Triagem160 sem proposições e77 localizadores;93 candidatos corrigidos+3 falsos positivos+160 pendentes=256;135 correções fora da triagem;93+135=228. Nenhuma recontagem de075/076.

Próximo grupo AN-C11-117-M1/M2/M3, cujos IDs físicos foram localizados; confirmar presença, precedência e fonte11.7 antes de editar. Os subgrupos117a–d também existem e serão preservados. Fontes oficiais/edital, cobertura, revisão integral de todas as disciplinas, rechecagem independente, unicidade semântica, SQL/offline e homologação continuam pendentes. Oito gates pendentes/falhos; merge_permitted=false. Sem merge em main ou deploy solicitado.
