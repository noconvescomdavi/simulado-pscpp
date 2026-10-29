# Lote 080 — transmissão quadrantal

## Base e preservação

HEAD remoto e PR #172 consultados antes de editar: `0178f80331266e413f17479f691a125330b45699`, lote 079; PR aberto/draft, sem merge. CHECKPOINT.json e relatório 079 lidos e adotados como estado prevalente. O ambiente local estava no lote 005, sem alterações rastreadas; avançou por fast-forward ao remoto, preservando temporários não rastreados. Regeneração e regressão da base confirmaram 234 deltas antes das edições. Nenhum lote anterior foi refeito ou recontado. A comparação desta rodada usa o inventário 079 versionado, sem confiar no cache ignorado antigo.

Lock cooperativo flock adquirido e mantido durante o trabalho; não exclui escritores externos que ignorem o lock. Publicação limitada à branch de auditoria, com expected_sha e sem force. Sem merge em main, deploy solicitado ou alteração de dados privados. Livros e imagens não integram o diff público; relatório, inventários, hashes e logs acompanham o checkpoint.

## Fonte primária e limites

Fonseca, Arte Naval, volume 2, 8ª edição, 2019, item 11.7.b, p.763/PDF124; contexto 11.5.a–c e 11.6, pp.760–761/PDF121–122. Três páginas únicas lidas em texto e imagens, numerais impressos conferidos. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; exemplar Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

As questões descrevem textualmente a roda acionada pela máquina, o setor dentado fixado à cana e o comando da válvula no arranjo a vapor; não exigem uma figura ausente. Não se extraíram medidas, rendimento, ângulos, potência ou dimensões de ilustrações. A roda de acionamento não foi confundida com o quadrante, que é o setor fixado à cana.

O emprego com máquina a vapor é apresentado como compatibilidade no arranjo bibliográfico, sem generalizar frequência de emprego na frota atual. A válvula citada em M1/M3 foi explicitamente associada à máquina a vapor: não é uma válvula genérica de qualquer sistema. Gualdropes, eixos ou telemotor podem levar seu comando; isso não substitui o engrenamento que transmite o movimento da máquina à cana. Não há alegação de exclusividade de fonte de potência, cálculo ou nova prescrição normativa.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-117b-M1 | Quatro proposições desapareciam no runtime; explicação repetia falsas sem julgá-las e uso frequente era apresentado sem delimitação temporal. | Restaurados quatro itens sobre engrenamento, compatibilidade a vapor, natureza do quadrante e distinção entre roda e setor; julgamentos e cinco justificativas; retirada a generalização de emprego, páginas e hash. Média/L2 proposta. | 11.7.b, p.763/PDF124; contexto 11.5/11.6, pp.760–761/PDF121–122. | D mantido; V/V/F/F. |
| AN-C11-117b-M2 | Pergunta dependia do artigo; alternativas misturavam tambor, cilindro, motor e engrenagem de comando; explicação repetia a correta. | Enunciado autossuficiente, cinco descrições comparáveis de posição/fixação/função; distinguida roda de acionamento de setor fixado à cana; cinco justificativas, páginas e hash. Fácil/L1 proposto. | 11.7.b, p.763/PDF124; contexto 11.5/11.6. | E mantido. |
| AN-C11-117b-M3 | V/F não reconhecido; falsa não explicada e válvula sem explicitar o arranjo a vapor. | Comando antes dos quatro itens; contexto a vapor explícito; julgados os itens e explicado por que o telemotor não dispensa o engrenamento; cinco justificativas, páginas e hash. Média/L2 proposta. | 11.7.b, p.763/PDF124; 11.5.a–c/11.6, pp.760–761/PDF121–122. | A mantido; V/V/F/V. |

Três correções primárias **parciais**, quinze justificativas e zero aprovações finais. IDs, gabaritos, formatos, três modelos do item, tracking, taxonomia e flags legadas preservados. Dificuldade/nível são propostas, sem calibração psicométrica. Flags antigas não constituem aprovação editorial/bibliográfica. Grupos 117c–d inalterados e pendentes de revisão própria.

## Unicidade e carregamento

M1: I/II verdadeiras, III/IV falsas; só D. A inclui III e omite II; B inclui IV e omite I; C reúne ambas falsas; E inclui as duas falsas. M2: só E conserva setor dentado, união rígida à cana e engrenamento com a roda. A elimina a união rígida; B elimina o dentado; C descreve a roda de acionamento; D desloca o elemento para a roda do timoneiro e para a transmissão do comando. M3: V/V/F/V, só A; B erra II/III/IV, C erra I/III/IV, D erra I/II/III e E erra III.

Os três objetos principais são integralmente iguais às versões efetivas após regeneração, sem mass_reformulation. Apenas esses três IDs diferem do inventário 079. Nenhum normalizador, política ou critério foi alterado; a regressão recebeu somente os IDs documentados nas listas explícitas de origem/formato, sem remoção ou relaxamento de asserções.

A comparação estrutural foi preservada nas evidências: M1 efetivo antes era simple/um stem e agora assertions/quatro itens; M2 continua simple; M3 antes era paragraphs/seis parágrafos e agora statements/quatro itens. Os quatro itens de M1/M3 chegam à renderização. Variantes da mesma competência não devem coexistir numa prova; prevenção semântica global e rechecagem independente permanecem pendentes.

## Validação executada

As quatro regenerações individuais e seus quatro comandos de check passaram. Runtime, seleção/matriz, proveniência, catálogo e regressão passaram. Regressão acumulada: **237 deltas exatos**, 11.865 ocorrências de cadernos preservadas, 532 proposições renderizadas e 520 alternativas diretas preservadas. População preservada: 27.435 registros físicos; 12.102 cadernos + 1.984 PSCPP = 14.086 ocorrências; 13.715 IDs únicos. Matriz 100 = 25/25/10/10/10/10/10 preservada. Diff sem erros de whitespace.

Build direto `node node_modules/next/dist/bin/next build` retornou 0, com compilação, lint/tipos, 101/101 páginas e resumo completo de rotas. Regenerações antecederam o build. Avisos CSS/autoprefixer/cache mantidos no log, sem aprovação de release. Inventário e triagem regenerados. Códigos de saída, logs, hashes e comparação estrutural em EVIDENCIAS_LOTE_080.json.

| Verificação | Resultado |
|---|---|
| generate e check: pscpp-bank, question-banks, question-catalog, flashcard-decks | 0 cada |
| validate-runtime-question-banks | 0 |
| validate-pscpp-exam-selection | 0 |
| test-question-source-provenance | 0 |
| validate-runtime-question-catalog | 0 |
| test-pscpp-audit-anv0005 | 0; 237 deltas |
| test-notebook-complete-stems | 1; ANV-0142 anterior |
| validate-editorial-runtime | 1; 77 localizadores anteriores |
| audit-pscpp-runtime-triage / inventory | 0 cada |
| validate-pscpp-editorial-evidence | 2; zero aceitos / 14.086 pendentes |
| next build direto | 0, log integral |

## Acumulado e continuidade

Base 079: 234 IDs / 237 conferências parciais. Neste lote: +3 / +3, sem recontagem anterior. Acumulado: **237 IDs com correções parciais, 240 conferências parciais e zero aprovações finais**. 237/13.715 = 1,73% dos IDs, não percentual de auditoria concluída. Triagem: 157 candidatos sem proposições e 77 localizadores; 96 candidatos corrigidos + 3 falsos positivos + 157 pendentes = 256; 141 correções fora dessa triagem; 96 + 141 = 237.

Próximo grupo: AN-C11-117c-M1/M2/M3, após confirmar presença efetiva e precedência, com fonte 11.7.c. Preservar 117d e não recontar 117/117a/117b. Revisão integral das demais disciplinas, programa/edital e fontes oficiais, cobertura, rechecagem independente, deduplicação semântica, consumidores SQL/offline e homologação continuam pendentes. Oito gates pendentes/falhos; merge_permitted=false. Sem merge em main ou deploy solicitado.
