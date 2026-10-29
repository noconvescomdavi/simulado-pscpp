# Lote 036 — mecanismo compensador e aparelho de laborar

Base remota eb508fe63ff7d977edf4e908f71bcf03efe3166d; PR #172 aberto/draft.
HEAD remoto consultado; árvore rastreada limpa e fast-forward antes de editar.
CHECKPOINT.json e relatório035 lidos. Nenhum lote concluído refeito; temporários
preservados. Enumeração de processos retornou erro, portanto não se afirma
inspeção global de escritores. Árvore rastreada inicialmente limpa; publicação
com expected_sha e sem force. Prompt-Mestre e benchmark mantidos.

## Fontes primárias

Fonseca, Arte Naval v.2, 8ª ed., 2019. SHA256 recalculado:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. Livro e imagens permanecem privados.

- Grupo old-075: art.11.4.d, p.759/PDF120; contraste11.4.e pp.759–760/
  PDF120–121. Texto e imagens lidos. O mecanismo faz parar no ângulo pedido;
  não deve ser confundido com retorno automático do leme a meio nem com o freio
  da instalação elétrica por alavanca. A pergunta direta não entrega no comando
  a ação correta sobre a válvula. Não se projetou um circuito real de governo.
- Grupo old-016: art.9.13, p.668/PDF29, figura9-16; continuação p.669/PDF30.
  Texto e imagens conferidos. Definição de conjunto fixo/móvel e beta, nomes dos
  chicotes, objetivo de redução de esforço e distinção do retorno. A página669
  mostra também tipos de9.14, observados como contexto, sem usar suas relações
  numéricas para resolver as perguntas. Não há cálculo ou vantagem numérica
  prometida para montagem real. Nenhuma figura externa é exigida: as questões
  descrevem integralmente os elementos necessários em palavras.

Locators acima conferidos no corpo; não se declarou reconciliação integral do
sumário de cada capítulo. Achados de numeração anteriores continuam pendentes.
Aderência final ao edital/programa oficial e rechecagem independente pendentes.

## Relatório obrigatório por questão

| ID | Defeito encontrado | Correção concreta | Fonte verificada | Gabarito |
|---|---|---|---|---|
| ANV-0151 | answer-leak-v1 removia I–IV; afirmações por definição misturavam compensação com localização da máquina e função do timoneiro. | Quatro proposições sobre realimentação a vapor/hidrelétrica e confusões com marcha contínua/retorno a meio. Explicação, cinco justificativas, página/PDF/hash; enunciado integral preservado. | 11.4.d p.759/PDF120; contraste11.4.e pp.759–760/PDF120–121 | A mantido; V/F/V/F |
| ANV-0849 | Pergunta por definição era convertida em comando bibliográfico genérico, com distratores de objetos heterogêneos. | Novo caso da parada após a roda deixar de girar; cinco interpretações paralelas, explicação e cinco justificativas; fonte exata. Não entrega a resposta no comando. | Mesmos localizadores | D mantido |
| ANV-0152 | I–IV desapareciam no carregamento; a afirmação sobre grande redução/menor velocidade tinha escopo impreciso e a explicação não julgava cada item. | Quatro proposições sobre conjunto fixo/móvel, beta, objetivo, retorno e nomes dos chicotes. Removidas generalizações sem hipóteses; explicação e cinco justificativas; página/PDF/hash. | 9.13 p.668/PDF29, fig.9-16; continuação p.669/PDF30 | B mantido; F/V/F/V |
| ANV-0850 | Comando genérico e alternativas misturavam conjunto, componente, tipo e grandeza sem distinção editorial suficiente. | Enunciado autossuficiente e cinco descrições sobre constituição/objetivo, com erros localizáveis; explicação e cinco justificativas; referência verificada. | Mesmos localizadores | E mantido |
| ANV-0984 | Artefato de extração no principal e definição vaga; a opção de tipo particular podia competir com o nome genérico. Dificuldade/aplicação operacional superestimadas. | Texto limpo pede expressamente a designação genérica do conjunto; cinco opções distinguem sistema, componentes e retorno. Explicação e cinco justificativas; fonte exata, L1/Fácil propostos. | Mesmos localizadores | D mantido |

Cinco correções primárias parciais, não aprovações finais. Formatos B/A/B/A/A
preservados; IDs, competências e gabaritos A/D/B/E/D mantidos (a ordem da tabela
é151/849/152/850/984). Cinco alternativas A–E por registro. Os conjuntos das
combinadas não foram mudados; as opções diretas foram reescritas. 151/152:
Difícil→Médio/L2;849/850 Médio/L2;984 Difícil→Fácil/L1. São propostas editoriais,
sem calibração psicométrica ou histórica aprovada. O rótulo legado Situação
aplicada de984 foi preservado para filtros, sem promover reconhecimento de
nomenclatura a aplicação operacional real.

## Julgamento individual das proposições e alternativas

151: I verdadeira, ação da máquina sobre a válvula;II falsa, não há marcha até
o limite;III verdadeira, cana/junços neutralizam controle hidrelétrico;IV falsa,
parar no ângulo pedido não é retornar a meio. Vetor V/F/V/F.

| 151 | Conjunto | Julgamento |
|---|---|---|
| A | I/III | Único conjunto completo |
| B | III/IV | IV falsa; faltaI |
| C | II/IV | Ambas falsas |
| D | I/II | II falsa; faltaIII |
| E | II/III | II falsa; faltaI |

| 849 | Julgamento |
|---|---|
| A | Mantém marcha até o limite, contrariamente à compensação |
| B | Confunde parada no ângulo pedido com retorno a meio |
| C | Exige inversão manual da roda, em vez da neutralização pela própria máquina |
| D | Correta: ação da máquina neutraliza o efeito da roda sobre a válvula e para o leme |
| E | Transfere o freio do caso elétrico por alavanca para a instalação a vapor |

152: I falsa, define retorno;II verdadeira, objetivo de reduzir esforço;III falsa,
inverte nomes dos chicotes;IV verdadeira, parte fixa/móvel e beta. Vetor F/V/F/V.

| 152 | Conjunto | Julgamento |
|---|---|---|
| A | I/IV | I falsa; faltaII |
| B | II/IV | Único conjunto completo |
| C | I/III | Ambas falsas |
| D | I/II | I falsa; faltaIV |
| E | II/III | III falsa; faltaIV |

| 850 | Julgamento |
|---|---|
| A | Retorno sem multiplicação, não o conjunto definido |
| B | Troca tirador e arreigada fixa |
| C | Exclui a beta, parte da definição |
| D | Exclui parte móvel, contrariando a constituição descrita |
| E | Correta: conjunto e objetivo do art.9.13 |

| 984 | Julgamento |
|---|---|
| A | Moitão móvel é componente |
| B | Tirador é o chicote por onde se ala |
| C | Arreigada fixa é o chicote preso |
| D | Correta: nome genérico do conjunto definido |
| E | Retorno só muda a direção do cabo, sem multiplicar potência |

Vinte e cinco justificativas individuais também constam dos cinco registros.
Não se pediu memorização de coordenadas do livro; os locators ficam nas fontes.

## Precedência, estados e sobreposição

Os cinco prevalecem no principal, já ativos antes do lote. Nenhuma restauração
ou notebook-complete-stems contém esses IDs. O principal físico também contém
0350/0351 nos dois códigos. São mantidos integralmente inalterados e não estão
no runtime: política do objeto bruto retorna active=true, mas após os dois
transformadores existentes retorna active=false, reason=stem-quotes-source-answer.
Isso não é nova quarentena ou aprovação de sua qualidade; flags físicas ausentes
não foram inferidas. Nenhum incremento de conferência/correção para esses dois.

Busca no runtime por old-075/old-016 encontrou2/3 variantes, lidas individualmente.
As duas do mecanismo não devem coexistir na mesma prova; as três do aparelho
não devem coexistir entre si. Busca por códigos não exclui variantes com outras
tags: análise semântica global e prevenção de coexistência continuam pendentes.
Nenhum ID/modelo criado, removido ou reativado; regime específico de três modelos
por item preservado. Taxonomia e rótulos legados mantidos para filtros; árvore
bibliográfica e estados globais ainda precisam de reconciliação.

auditQuestion sem achados e política ativa nas cinco versões finais. Os
transformadores preservam os objetos e a regressão confere igualdade integral
fonte/runtime. Nenhum normalizador/filtro/gate relaxado. Contrato de fonte
principal+151/152/849/850/984; contrato direto+849/850/984. Hashes antes/depois
em CORRECOES_RUNTIME.json; cinco conferências em JSONL. Resultados reais em
TESTES_E_EVIDENCIAS.md, sem aprovação inventada em REVISOES_EDITORIAIS.jsonl.

Acumulado:75 correções distintas,78 conferências bibliográficas parciais,
ZERO aprovações finais. Par0142/0840, fontes/numeração/terminologia/modelos e
limites normativos anteriores preservados sem recontagem. Rechecagem independente,
programa/edital, cobertura, estados, semântica e offline/produção pendentes.
Oito gates pendentes/falhos. Sem merge, deploy em produção ou usuários alterados.
