# Lote 003 — ANV-0020 e ANV-0021

Checkpoint de partida: `f11c1e49fbf24895ad8ac547edfd3e89fb7fd101`, confirmado
no HEAD remoto antes da edição. A árvore staged local era exatamente
`97993ce81252b962bff1e1674e930bd6486986f9`, árvore desse commit; HEAD local
alinhado por reset soft, sem descartar modificações ou arquivos não rastreados.
Nenhum merge, deploy ou dado de usuário alterado. Zero aprovações finais.

## Fonte primária, páginas e precedência

| ID | Fonte prevalente | Obra, edição e item | Página impressa / PDF | Formato / nível |
|---|---|---|---|---|
| ANV-0020 | data/questions/arte-naval.json | Fonseca, Arte Naval v.2, 8ª ed., SDM, 2019, art. 12.32, fig. 12-18 | 833–834 / 194–195 | B / L2 |
| ANV-0021 | data/question-restorations/arte-naval.json | Fonseca, Arte Naval v.1, 8ª ed., SDM, 2019, art. 2.27; fig. 2-8 | 86 / 86; figura 83 / 83 | B / L2 |

PDFs locais tiveram SHA-256 novamente conferido. Volume 2:
`6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;
Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Volume 1:
`792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20`;
Drive `1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N`.
Textos e páginas renderizadas inspecionados. A fig. 12-18 mostra as fases da
mudança de bordo com corrente de popa; o texto seguinte compara a corrente
pela proa. A fig. 2-8 distingue a região acima da água, identificada como
reserva de flutuabilidade, do volume imerso e da força de empuxo. Nenhuma
figura é necessária para responder às versões autossuficientes propostas.
Não publicado livro nem suas páginas integrais.

## ANV-0020 — preservação das quatro proposições

Não existe restauração para esse ID. O registro principal prevalece, seguido
de `reformulateLeakingStem`. O comando e o texto das proposições acionavam
sobreposição lexical e interpretação negativa, substituindo tudo por um
comando EXCETO, enquanto as opções ainda selecionavam afirmativas inexistentes.
Corrigido o registro principal, sem alterar regras globais de normalização.
O novo texto mantém a competência de mudar bordo, quatro proposições e cinco
opções. Vetor V/V/V/F, resposta E. I: preferência pelo rebocador; II: sem ele,
maré favorável e corrente muito fraca; III: corrente de popa, espringue na proa
e través na popa; IV inverte tanto a corrente preferida quanto o ponto de giro.
A explicação delimita as condições da comparação, sem transformar em regra
universal para toda operação portuária. Nível L2/Médio é julgamento editorial,
não medida psicométrica ou mero reflexo de quatro proposições.

| Opção | Conjunto | Resolução |
|---|---|---|
| A | I+II | Omite III verdadeira |
| B | I+III | Omite II verdadeira |
| C | II+IV | Inclui IV falsa; omite I e III |
| D | II+III+IV | Inclui IV falsa; omite I |
| E | I+II+III | Única opção completa e verdadeira |

## ANV-0021 — ambiguidade técnica além da perda de proposições

A restauração prevalecia sobre uma versão principal em quarentena que tratava
de outros conceitos. Preservada a competência efetivamente servida, reserva
de flutuabilidade; não reativada nem apagada a versão principal. A restauração
antiga tinha IV sobre marcação de borda-livre que, interpretada com art. 2.28,
podia ser verdadeira, embora o gabarito A a excluísse. Não bastava devolver as
proposições à tela. A definição antiga também omitia que o volume acima da
água pode ser tornado estanque, qualificação expressa no art. 2.27.

Reescrito com suporte direto nesse artigo: I percentual e relação com
borda-livre; II volume acima da superfície que pode ser tornado estanque;
III troca pelo volume já imerso; IV inverte a consequência de menor reserva
na capacidade de suportar acidente. Vetor V/V/F/F, resposta A preservada.
Formato B e L2/Médio: exige distinguir grandezas e compreender uma relação,
sem fabricar cálculo, norma vigente ou condições operacionais adicionais.

| Opção | Conjunto | Resolução |
|---|---|---|
| A | I+II | Única opção completa e verdadeira |
| B | III+IV | Ambas falsas; omite I e II |
| C | II+III | Inclui III falsa; omite I |
| D | II+IV | Inclui IV falsa; omite I |
| E | I+III | Inclui III falsa; omite II |

## Rechecagem e semântica

Recompostos os conjuntos corretos a partir do conteúdo do artigo antes da
comparação com as letras armazenadas. O teste de regressão resolve novamente
as opções pelos vetores vinculados aos hashes efetivos, exige uma única opção
e confere as 24 proposições no HTML real das seis correções acumuladas. Isso
não substitui rechecagem independente editorial/bibliográfica nem confirma o
edital-alvo, que continuam pendentes. `REVISOES_EDITORIAIS.jsonl` permanece vazio.

Inspeção individual de versões próximas identificou sobreposição da ANV-0020
com ANV-0718 e AN-C12-1232-M2/M3 (rebocador, corrente fraca e comparação de
bordos). AN-C12-1232-M1 ainda carece de proposições no runtime, sem comparação
semântica completa possível. ANV-0021 sobrepõe definição com ANV-0719; ANV-0086
e ANV-0962 têm borda-livre como objeto principal, relação adjacente, não identidade
integral automática. Estes itens não foram aprovados. Variantes globais podem
existir para rotação, mas os conceitos sobrepostos não devem coexistir na mesma
prova. A correção do seletor e a revisão semântica global continuam pendentes;
nenhum item removido automaticamente por similaridade textual.

Hashes anteriores/posteriores e vetores: `CORRECOES_RUNTIME.json`. Os IDs de
catálogo legados `fonseca-arte-v1::ch12` foram preservados para retrocompatibilidade;
a fonte primária de ANV-0020 declara inequivocamente volume 2. A reconciliação
global do catálogo/bibliografia permanece pendente, incluindo a divergência
entre volume indicado na bibliografia fornecida e volume físico dos capítulos.

## Resultado do lote

Duas correções primárias novas; seis acumuladas, nove conferências parciais.
14.086 ocorrências preservadas, nenhuma aprovada em definitivo. Inventários,
triagem, testes e build serão registrados em TESTES_E_EVIDENCIAS.md e no
CHECKPOINT.json após execução; esta seção não antecipa sucesso de comandos.
Todos os gates permanecem não aprovados e `merge_permitted=false`.
