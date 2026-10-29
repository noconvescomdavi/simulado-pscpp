# Lote 004 — ANV-0025

Partida: `443c8e8ca01208bd5b719b7557ff60f085be96ca`, confirmada no
HEAD remoto do PR #172 antes da edição. Branch isolada preservada.

## Fonte e precedência

A restauração em `data/question-restorations/arte-naval.json` prevalece sobre
a versão principal, que trata de escovém em V/F. Corrigida somente a versão
restaurada efetivamente consumida; preservados ID, competência, cinco opções
e gabarito E. Não alteradas regras globais de normalização.

Fonte: Fonseca, Arte Naval, volume 2, 8ª edição, SDM, 2019, art. 10.1,
páginas impressas 705–706 / PDF 66–67. Texto e ambas as páginas renderizadas
inspecionados. SHA-256 do exemplar novamente conferido:
`6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.
Drive: `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Nenhuma figura é necessária
à resolução; não foram publicadas páginas do livro.

## Defeito e correção

As alternativas selecionavam proposições ausentes no runtime. O original
restaurado usava definições de partes da âncora como distratores de um
conjunto de equipamentos, com pouca homogeneidade. A revisão conserva o
objeto e passa a cobrar composição e funções dos componentes do aparelho:

- I verdadeira: composição do conjunto, p. 705.
- II verdadeira: cavidades da coroa de Barbotin e içamento da amarra, p. 706.
- III falsa: a descida do convés ao paiol é pela buzina da amarra, p. 706;
  o escovém dá passagem para o exterior, p. 705.
- IV falsa: boças retiram esforço do freio, em vez de aumentá-lo, p. 706.

Formato B, L2/Médio proposto por distinguir funções e relação mecânica;
não representa dificuldade psicométrica medida. Taxonomia legada do catálogo
preservada; a referência física explicita volume 2. Reconciliação global do
catálogo, programa e edital continua pendente.

| Opção | Conjunto | Justificativa |
|---|---|---|
| A | II + IV | Inclui IV falsa e omite I verdadeira |
| B | I + III | Inclui III falsa e omite II verdadeira |
| C | III + IV | Ambas falsas; omite I e II |
| D | I + IV | Inclui IV falsa e omite II verdadeira |
| E | I + II | Único conjunto completo das verdadeiras |

Recomposto o vetor V/V/F/F e comparado às cinco opções antes de aceitar a
letra E. Justificativas por opção gravadas no registro. Hash anterior e
posterior registrados em CORRECOES_RUNTIME.json; teste existente exige o
delta exato e presença das quatro proposições no HTML real.

## Sobreposições e limites

Leitura das versões ANV-0723, ANV-B005-07 e AN-C10-101-M1/M2/M3 confirmou
sobreposição parcial de competência: composição, Barbotin, condutos e boças.
AN-C10-101-M3 inclusive cobra Barbotin e confunde escovém/buzina. Variantes
não devem coexistir no mesmo caderno/simulado; o seletor e a revisão semântica
global ainda precisam cumprir esse requisito. Nenhum desses itens foi aprovado
ou removido apenas por similaridade. O regime de três itens do subconjunto
AN-C10 foi preservado, sem modificar seus arquivos neste lote.

Isso constitui a sétima correção primária e a décima conferência parcial,
não aprovação editorial final. Rechecagem independente, aderência ao edital
e controle global de competências permanecem pendentes. Zero aprovações
finais; nenhum merge ou deploy em produção.

Resultados efetivamente executados serão registrados em TESTES_E_EVIDENCIAS.md
e CHECKPOINT.json; esta revisão não antecipa aprovação dos comandos.
