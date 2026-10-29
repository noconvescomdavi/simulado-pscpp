# Checkpoint 075 — recuperação das nove correções indisponíveis

## Base e preservação

HEAD remoto e PR #172 consultados antes das edições: `34c45320c48d0a98956b70482edbae60a5c20012`, lote070, PR aberto/draft. Prompt-Mestre relido integralmente, checkpoint070 e relatório070 consultados. A árvore local estava no lote005, sem alterações rastreadas; foi avançada por fast-forward até070. Temporários não rastreados foram preservados. Os objetos dos commits locais anteriormente relatados `0c28aedf`, `6fe09d73` e `99c2ef0a` não estavam disponíveis. Não se afirma recuperação desses commits: suas nove questões foram refeitas nesta rodada, sobre a base remota070, e contabilizadas uma única vez.

Lock cooperativo por criação atômica de `.git/audit-hourly.lock`; não houve outro escritor identificado. Uma enumeração inicial funcionou, outra falhou com `fatal library error, lookup self`; não é garantia contra escritores externos que ignorem o lock. Nenhuma publicação pública foi tentada: a rejeição anterior continua vigente. O checkpoint será preservado em pacote recuperável autorizado, com bundle incremental, patch, relatório e logs, sem livros ou dados privados de usuários.

O snapshot gerado ignorado em disco ainda era do lote005 após o fast-forward. A primeira comparação detectou diferenças históricas fora dos nove IDs e foi rejeitada. A comparação válida usa **INVENTARIO_RUNTIME.jsonl.gz versionado do remoto070**, não esse cache antigo. Após regeneração, somente os nove IDs deste relatório diferem da base070. O teste acumulado também compara com o baseline congelado original.

## Fonte primária e limites

FONSECA, Maurílio M. Arte Naval, volume2, 8ª edição,2019, exemplar Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.

Quatro páginas lidas em texto e imagens, numerais impressos vistos: 758–761/PDF119–122. Item11.4.c e figura11-4: pp758–759/PDF119–120. Item11.4.d: p759/PDF120, com contexto do comando a vapor na p758. Item11.5.a–c: pp760–761/PDF121–122. Diagrama conferido como representação motor/bomba/cilindros/cana/leme, sem extrair dimensões ou medidas. Nenhuma questão exige figura ausente ou cálculo.

O trecho da obra sobre ausência de pressão no neutro não foi generalizado: as questões avaliam passagem de líquido e controle da bomba, sem inferir que vazão nula implica pressão estática/residual nula em qualquer circuito. Comparações de eficiência, metade da potência e frequência de emprego na frota atual foram retiradas destes modelos, sem aprovação dessas generalizações. A reserva é apresentada como descrição usual da obra, não obrigação universal. Neutro do controle não se confunde com leme a meio. Transmissão roda–controle não se confunde com acionamento do leme: uma transmissão elétrica pode comandar servomotor hidrelétrico.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte verificada | Gabarito |
|---|---|---|---|---|
| AN-C11-114c-M1 | Proposições sumiam no runtime; explicação repetia as falsas e incluía comparação ampla de eficiência. | Restaurados quatro itens sobre motor, débito, amplitude e sentido; explicados os quatro julgamentos e cinco alternativas; retiradas generalizações de eficiência; páginas/hash e L2 proposto. | 11.4.c, pp758–759/PDF119–120, fig11-4. | C mantido; V/V/F/F. |
| AN-C11-114c-M2 | Distratores heterogêneos e resposta sobre pressão no neutro sem delimitação. | Cinco associações comparáveis entre fluxo e estado do motor; neutro sem passagem de líquido, motor trabalhando; cinco justificativas; excluída inferência universal sobre pressão. | 11.4.c, pp758–759/PDF119–120. | D mantido. |
| AN-C11-114c-M3 | V/F não era reconhecido; explicação não corrigia a falsa e repetia comparação ampla de eficiência. | Comando antes do bloco e quatro itens reconhecíveis; proteção, reserva e inversão do fluxo pelo controle; cinco justificativas e julgamento de cada item. | 11.4.c, pp758–759/PDF119–120. | E mantido; V/V/F/V. |
| AN-C11-114d-M1 | Proposições sumiam e falsas não eram explicadas; distrator sobre hélice alheio ao mecanismo. | Restaurados quatro itens sobre finalidade, ação a vapor e retorno hidrelétrico; falsa distingue neutro de leme a meio; cinco justificativas. | 11.4.d, p759/PDF120; contexto pp758–759. | A mantido; V/V/F/F. |
| AN-C11-114d-M2 | Pergunta por artigo e alternativas de naturezas diferentes; explicação repetia resposta. | Cenário autossuficiente com cinco atuações comparáveis da cana/junços sobre o controle; explicadas neutralização, continuidade e reversão. | 11.4.d, p759/PDF120. | B mantido. |
| AN-C11-114d-M3 | V/F não estruturado; falsa não era julgada. | Quatro itens reconhecidos; neutro do controle distinguido de leme a meio; julgamento de cada item e cinco justificativas. | 11.4.d, p759/PDF120. | C mantido; V/V/F/V. |
| AN-C11-115-M1 | Proposições sumiam; explicação apenas repetia falsas e classificação dependia do artigo. | Restaurados quatro itens sobre modalidades, telemotor, transmissão flexível e funções transmissor/receptor; cinco justificativas; objeto explícito. | 11.5.a–c, pp760–761/PDF121–122. | B mantido; V/V/F/F. |
| AN-C11-115-M2 | Cobrança por artigo; opções misturavam modalidades e outras classificações; explicação repetitiva. | Cinco associações paralelas entre modalidade e meio de transmissão; quatro erros localizáveis e cinco justificativas. | 11.5.a–c, pp760–761/PDF121–122. | C mantido. |
| AN-C11-115-M3 | V/F não estruturado; falsa não era explicada. | Quatro itens reconhecidos; explicitada compatibilidade da transmissão elétrica com servomotor hidrelétrico; julgamentos e cinco justificativas. | 11.5.a–c, pp760–761/PDF121–122. | D mantido; V/V/F/V. |

Nove correções **parciais**, 45 justificativas e zero aprovações finais. IDs, gabaritos e três modelos por grupo preservados. Campos validation legados mantidos por compatibilidade, sem serem aceitos como aprovação. L2/médio são propostas, sem calibração psicométrica. Modelos da mesma competência e versões relacionadas de 11.5.a/b não devem coexistir no mesmo teste; prevenção semântica global ainda pendente.

## Carregamento e validação

A validação inicial flagrou falha real: comando depois dos itens impedia reconhecimento de V/F; sobreposição lexical na115M1 acionava reformulação e apagava o bloco. Corrigida a estrutura/redação, sem mudar normalizadores ou critérios. Os nove objetos principais coincidem integralmente com suas versões efetivas. A regressão só teve suas listas explícitas de origem/formato ampliadas para os nove IDs; nenhuma asserção anterior foi removida ou relaxada.

Regenerados runtimePSCPP, bancos, catálogo e flashcards. Validações runtime, matriz/seleção, proveniência e catálogo passaram. Regressão acumulada passou: **222 deltas exatos**, **492 proposições renderizadas**, **495 alternativas diretas preservadas** e **11880 ocorrências de cadernos inalteradas** frente ao baseline congelado. As três M1 restauram12 proposições; as três M3 tornam12 itens reconhecidos pelo componente. A população ativa permanece12102 cadernos+1984PSCPP=14086 ocorrências e13715 IDs únicos; matriz100=25/25/10/10/10/10/10 mantida.

Falhas conhecidas: test-notebook-complete-stems exit1 emANV-0142; validate-editorial-runtime exit1 nos77 localizadores. Aprovação integral e rechecagem independente continuam pendentes. Nenhum teste com falha foi omitido ou considerado aprovação.

## Continuidade

Base comprovada070:213 IDs/216 conferências parciais. Neste checkpoint:+9 IDs/+9 conferências, sem recontar os lotes perdidos. Acumulado: **222 IDs corrigidos parcialmente,225 conferências parciais,zero aprovações finais;222/13715=1,62% dos IDs**, não percentual de auditoria concluída. Triagem162 sem proposições e77 localizadores. Oito gates pendentes/falhos; merge_permitted=false. Sem merge, deploy ou alteração de dados de usuários.

Próximo grupo: AN-C11-115c-M1/M2/M3 (transmissão elétrica), seguido por11.6. Na retomada, comparar primeiro o remoto/PR com este checkpoint persistente; recuperar o bundle incremental sobre34c45320 e verificar árvore/hashes antes de editar. Se o ambiente local voltar ao005 ou070, não perder nem recontar este lote. A publicação segue bloqueada pela rejeição automática anterior, que exigiu autorização específica para enviar alterações ao repositório público; não se tentou contorná-la.

## Resultados executados

| Comando | Saída |
|---|---:|
| generate:pscpp-bank / generate:question-banks / generate:question-catalog / generate:flashcard-decks | 0 |
| validate-runtime-question-banks | 0 |
| validate-pscpp-exam-selection | 0 |
| test-question-source-provenance | 0 |
| validate-runtime-question-catalog | 0 |
| test-pscpp-audit-anv0005 | 0 |
| test-notebook-complete-stems | 1: ANV-0142, anterior |
| validate-editorial-runtime | 1:77 localizadores, anteriores |
| audit-pscpp-runtime-triage / audit-pscpp-runtime-inventory | 0 |
| validate-pscpp-editorial-evidence | 2:zero aceitos/14086 pendentes |
| npm run build, cópia isolada nova | 0, log integral |

O primeiro build no diretório original retornou0, mas o log terminava após101páginas e não foi aceito como prova integral. A repetição em cópia isolada nova confirmou compilação,lint/tipos,101/101páginas e resumo final de rotas. Comparados1287 arquivos rastreados fora de docs, sem diferenças com a cópia testada;runtimePSCPP,bancos e catálogo também idênticos byte a byte. Os avisos CSS/cache/npm foram mantidos nos logs. Não equivalem a aprovação de release.
