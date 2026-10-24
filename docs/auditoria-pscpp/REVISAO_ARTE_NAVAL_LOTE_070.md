# Lote 070 — comando do servomotor a vapor

Base remota `f177ca98cac8183f545272a099cb5444642a4978`. HEAD remoto e PR #172 aberto/draft consultados antes de editar. CHECKPOINT 069 e relatório 069 lidos; o Prompt-Mestre foi relido integralmente. Árvore rastreada inicialmente limpa e HEAD local igual ao remoto; temporários não rastreados preservados. Lock cooperativo `flock` adquirido durante esta rodada. A enumeração de processos falhou com `fatal library error, lookup self`; não se afirma enumeração global de escritores. A estabilidade dos insumos e a publicação com expected_sha sem force são verificações adicionais, sem garantia de exclusão de escritores que ignorem o lock.

## Fonte primária e limites

Fonseca, Arte Naval, volume 2, 8ª edição, 2019: item 11.4.b, pp.757–758/PDF118–119, figura 11-3. Contexto: 11.4.d, p.759/PDF120 (mecanismo compensador) e remissão a 10.30.c(1), p.743/PDF104. Quatro páginas únicas lidas em texto e imagens; os quatro numerais impressos foram vistos, sem paginação inferida. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; exemplar Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados.

Figura 11-3 conferida como ilustração do servomotor a vapor; 11-2 e 11-4 presentes no contexto, sem extrair medidas, potência, desempenho ou dimensionamento. As questões não dependem de figura ausente. A remissão a 10.30.c(1) foi localizada e lida, mas não se acrescentaram questões sobre vantagens/desvantagens neste lote. As afirmações sobre frequência de emprego ficam delimitadas à descrição da edição: não houve levantamento da frota atual. Não se aprovam automaticamente as comparações de eficiência/custo do texto hidrelétrico adjacente, nem sua descrição de pressão no neutro.

11.4.d esclarece que a própria máquina também atua sobre a válvula pelo compensador. Por isso, o comando pela roda não foi apresentado como exclusivo. A condição central descrita em 11.4.b não foi convertida na afirmação de que o leme só possa parar a meio: o compensador permite interromper o movimento no ângulo desejado. Não se formula prescrição universal para instalações atuais nem certificação normativa. Programa/edital e aplicabilidade completa continuam pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-114b-M1 | Quatro proposições físicas desapareciam após transformação de enunciado; explicação repetia inclusive falsas sem julgá-las. | Restauradas quatro afirmações sobre emprego na obra, posição central, admissão e comando; explicação de cada julgamento e cinco justificativas; ressalva sobre compensador; páginas e hash. Médio/L2 proposto. | 11.4.b, pp.757–758/PDF118–119; contexto 11.4.d, p.759/PDF120. | E mantido; V/V/F/F. |
| AN-C11-114b-M2 | Explicação sobre emprego não respondia ao estado da válvula perguntado; distratores heterogêneos e dificuldade desproporcional. | Cinco associações paralelas entre posição da válvula, admissão e estado da máquina; explicação que responde à pergunta e cinco justificativas; distinção entre máquina parada e posição do leme; páginas e hash. Fácil/L1 proposto. | 11.4.b, p.758/PDF119; contexto 11.4.d, p.759/PDF120. | A mantido. |
| AN-C11-114b-M3 | Explicação repetitiva não justificava a falsa; comando por localizador e emprego sem delimitação histórica. | Objeto e escopo explícitos, quatro julgamentos fundamentados e cinco justificativas; comando da roda sem excluir compensador; V/F preservado; páginas e hash. Médio/L2 proposto. | 11.4.b, pp.757–758/PDF118–119; contexto 11.4.d, p.759/PDF120. | B mantido; V/V/F/V. |

Três correções primárias parciais, quinze justificativas e zero aprovações finais. M1 recupera quatro proposições ausentes no enunciado efetivo; M3 já possuía quatro itens reconhecidos e não foi contado como restauração. As classificações de dificuldade e nível são propostas, sem calibração psicométrica aprovada.

## Julgamentos, identidade e precedência

M1: I verdadeira no escopo da obra; II verdadeira pela relação centro/fechamento/parada; III falsa por inverter a admissão; IV falsa porque os movimentos da roda comandam a válvula. Só E reúne I/II. A inclui III e omite II; B inclui IV e omite I; C reúne III/IV falsas; D inclui ambas falsas. O compensador também comanda a válvula, sem tornar IV verdadeira.

M2: só A conserva os três elementos. B troca fechamento e parada por abertura e movimento. C confunde o estado central perguntado com a atuação para um bordo. D desloca lateralmente a válvula em vez de mantê-la a meio. E mantém aberta a admissão, contrariando o fechamento descrito. Os estados são os do arranjo textual, sem cálculo dinâmico de transientes ou generalização para outras válvulas.

M3: V/V/F/V, só B. A erra II/III/IV; C erra I/III/IV; D erra I/II/III; E erra III. A palavra comando não implica exclusividade da roda nem dispensa de compensador.

Os três modelos já estavam ativos, com a fonte principal prevalente. Após a correção, principal e runtime coincidem integralmente; as duas transformações deixam os três objetos invariantes. auditQuestion sem issues não é aprovação editorial. Nenhuma política, heurística ou flag foi alterada. A regressão foi ampliada apenas nas listas explícitas de fonte/formato dos três IDs documentados, preservando hashes completos, contagem de proposições, renderização e asserções anteriores. IDs, gabaritos, formatos, tracking, taxonomia, provenance e validation legados preservados; flags antigas não aceitas como aprovação final.

O regime de três modelos foi preservado. As variantes dessa competência não devem coexistir na mesma prova; a prevenção semântica global ainda está pendente. Não se recontaram revisões anteriores nem se ativaram os modelos excluídos 1036M1/114aM1. ANV-0142 e demais impedimentos anteriores permanecem.

## Validação

Regenerados runtime PSCPP, bancos, catálogo e flashcards. Passaram validação runtime, seleção/matriz, proveniência, catálogo, regressão e check:pscpp-bank. Regressão: 213 deltas acumulados exatos, 11889 ocorrências de cadernos preservadas, 468 proposições renderizadas e 480 alternativas diretas preservadas. Exatamente três IDs efetivos e três objetos principais mudaram frente ao lote 069. Permanecem 27435 registros físicos, 14086 ocorrências (12102 cadernos + 1984 PSCPP) e 13715 IDs únicos; matriz 100=25/25/10/10/10/10/10 preservada.

A primeira execução retornou zero, mas seu log terminou durante a geração de páginas e não foi aceito como prova integral. A segunda execução, na mesma cópia isolada e sem mudança de insumos, retornou zero com 101/101 páginas e resumo completo de rotas. Ambos os logs foram preservados privadamente.

Build completo em cópia isolada passou, com log integral de compilação, lint/tipos, 101/101 páginas e rotas. Os 1285 arquivos rastreados fora de docs e os seis artefatos gerados coincidem byte a byte com a cópia testada. Avisos de CSS/cache/npm não impediram o sucesso; isso não é aprovação de release.

Falhas conhecidas mantidas: test-notebook-complete-stems exit1 em ANV-0142; validate-editorial-runtime exit1 nos 77 localizadores; validate-pscpp-editorial-evidence exit2, zero ocorrências aceitas e 14086 pendentes. Inventário e triagem regenerados: 165 candidatos sem proposições e 77 localizadores. REVISOES_EDITORIAIS permanece inalterado.

| Comando | Código de saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|

## Acumulado e continuidade

213 IDs corrigidos, 216 conferências bibliográficas parciais, zero aprovações finais. Das 256 entradas iniciais da triagem: 88 corrigidas, 3 falsos positivos resolvidos e 165 restantes; 125 correções fora dessa triagem; 88+125=213. Permanecem 77 localizadores. Os 210 IDs anteriores não foram recontados. Correções abrangem 213/13715 = 1,55% dos IDs únicos do banco; isso não é percentual de auditoria integral concluída.

Próxima revisão independente: AN-C11-114c-M1, examinando os três modelos do servomotor hidrelétrico e as remissões necessárias. Rechecagem independente, fontes oficiais/edital, cobertura, bibliografia/aplicabilidade, prevenção semântica, consumidores/offline/SQL e homologação integral continuam pendentes. Os oito gates seguem pendentes/falhos; merge_permitted=false. Sem merge, deploy ou alteração de dados de usuários.
