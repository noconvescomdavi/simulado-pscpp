# Lote 037 — aproximação ao fundeio e princípio de Arquimedes

Base remota172e3b3067ff3c077f7e5295af6dce95374c2477; PR#172 aberto/draft.
HEAD remoto consultado antes da edição; fast-forward de árvore rastreada limpa.
CHECKPOINT.json e relatório036 lidos. Nenhum lote concluído refeito; temporários
preservados. Enumeração de processos retornou erro: não se afirma inspeção global
de escritores. Publicação com expected_sha e sem force, somente se o mesmo HEAD
permanecer remoto. Prompt-Mestre, benchmark e matriz obrigatória mantidos.

## Fontes e limites

- Fonseca, Arte Naval v.2, 8ª ed.,2019, item12.42.2, pp.847–848/PDF208–209.
  Texto e imagens conferidos. SHA256 recalculado:
  6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
  Drive1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. Perguntas limitadas à aproximação:
  considerar posição/visibilidade/vento/corrente e controlar governo/parada.
  Não generalizam o pequeno seguimento a ré como única técnica de largada:
  o mesmo texto inclui casos de profundidade e fundeio em marcha a vante.
  Não se transformam números, descontos de distância ou método de marcações
  do livro em regra operacional universal. Não se prescreve manobra real.
- Fonseca, Arte Naval v.1, 8ª ed.,2019, item2.25, pp.84–85/PDF84–85, fig.2-9;
  contexto2.24 pp.83–84/PDF83–84, fig.2-8, e2.26 p.85/PDF85.
  Texto/imagens conferidos. SHA256 recalculado:
  792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20.
  Drive1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N. Igualdade empuxo/peso limitada ao
  navio flutuando livremente em repouso em águas tranquilas, não a todo corpo
  imerso sujeito a outras forças. Volume deslocado não inclui a parte emersa.

0862 é uma inferência qualitativa explicitamente exposta: sob a mesma gravidade,
E=P e E=ρgV; com P constante, ρ2>ρ1 implica V2<V1 e E2=E1. A igualdade com o
peso do fluido deslocado está na fonte; a comparação entre densidades é uma
derivação, não um trecho atribuído literalmente ao livro. Não foram inseridos
valores numéricos, cálculo de calado ou garantia de estabilidade. O contexto é
hidrostático; não se certificam fenômenos dinâmicos ou equipamentos reais.
Os dados são autossuficientes em palavras; nenhuma figura externa obrigatória
foi omitida. As figuras lidas sustentam a interpretação bibliográfica.
Livros e imagens mantidos privados, sem publicação de PDFs integrais.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0163 | answer-leak-v1 apagava I–IV; proposições por definição misturavam aproximação com amarração a dois ferros e explicação genérica. | Quatro proposições sobre ambiente, governo, controle da parada e uso indevido da amarra. Escopo limitado à aproximação, sem generalizar técnica de largada. Explicação, cinco justificativas, páginas/PDF/hash. | v.2,12.42.2 pp.847–848/PDF208–209 | C mantido; F/V/V/F |
| ANV-0861 | Definição virava comando bibliográfico genérico e alternativas heterogêneas. | Cinco critérios paralelos de planejamento de aproximação; enunciado, explicação e cinco justificativas específicos; referência exata. | Mesmos localizadores | A mantido |
| ANV-0164 | I–IV desapareciam; conceitos de altura metacêntrica/centro eram misturados ao princípio e a condição de equilíbrio ficava genérica. | Quatro proposições sobre sentido/intensidade do empuxo, volume deslocado e equilíbrio livre. Explicação, cinco justificativas, páginas/hash e figura de suporte. | v.1,2.25 pp.84–85/PDF84–85, fig.2-9; contexto2.24/2.26 | D mantido; F/V/F/V |
| ANV-0862 | Comando genérico e distratores sobre grandezas não comparáveis. | Caso qualitativo de mesmo peso em águas de densidades diferentes; cinco relações empuxo/volume, explicação derivada explicitamente e cinco justificativas; fonte exata. | Mesmos localizadores | B mantido |
| ANV-0988 | Artefato de extração no principal e mistura de princípio, força, dimensões e pontos; dificuldade superestimada. | Texto limpo pede o nome da relação; opções distinguem princípio, empuxo, flutuabilidade e centros. Explicação e cinco justificativas; Fácil/L1 propostos. | Mesmos localizadores | C mantido |

Cinco correções primárias parciais, não aprovações finais. IDs, competências e
keys mantidos; formatos B/A/B/A/A na ordem da tabela. Cinco alternativas A–E.
Conjuntos das combinadas mantidos; alternativas diretas reescritas.163/164:
Difícil→Médio/L2;861/862 Médio/L2;988 Difícil→Fácil/L1. São propostas editoriais,
sem calibração histórica/psicométrica aprovada. Rótulo legado Situação aplicada
mantido em988 para filtros, sem chamar nomenclatura de aplicação operacional.

## Julgamento individual

163: I falsa, a amarra não deve parar sozinha o navio;II verdadeira, governo
com parada controlável;III verdadeira, ambiente e posição desejada;IV falsa,
vento/corrente continuam relevantes. Vetor F/V/V/F, conjuntoII/III.

| 163 | Conjunto | Julgamento |
|---|---|---|
| A | I/II | I falsa; faltaIII |
| B | I/III | I falsa; faltaII |
| C | II/III | Único conjunto completo |
| D | I/IV | Ambas falsas |
| E | II/IV | IV falsa; faltaIII |

| 861 | Julgamento |
|---|---|
| A | Correta: ambiente e seguimento compatíveis com governo e parada |
| B | Posição na carta não elimina vento/corrente |
| C | A amarra não pode ser encarregada de parar sozinha o navio |
| D | Elimina o seguimento necessário ao governo durante a aproximação |
| E | Impede ajustes antes da largada, apesar do ambiente/posição pretendida |

164: I falsa, empuxo para cima;II verdadeira, peso do fluido deslocado;III falsa,
parte emersa não desloca o fluido;IV verdadeira, equilíbrio livre especificado.
Vetor F/V/F/V, conjuntoII/IV.

| 164 | Conjunto | Julgamento |
|---|---|---|
| A | II/III | III falsa; faltaIV |
| B | I/II | I falsa; faltaIV |
| C | III/IV | III falsa; faltaII |
| D | II/IV | Único conjunto completo |
| E | I/IV | I falsa; faltaII |

| 862 | Julgamento |
|---|---|
| A | Aumenta o empuxo e mantém volume apesar do mesmo peso em equilíbrio |
| B | Correta: mesmo empuxo/peso; menor volume na água mais densa |
| C | Reduz empuxo e aumenta volume, contrariando ambas as relações |
| D | Mantém igualdade de forças, mas inverte densidade/volume |
| E | Limita a igualdade a uma das águas, apesar do equilíbrio nos dois casos |

| 988 | Julgamento |
|---|---|
| A | Empuxo é a força, não o nome do princípio |
| B | Flutuabilidade é propriedade, não o nome pedido |
| C | Correta: princípio de Arquimedes |
| D | Centro de empuxo é ponto de aplicação |
| E | Centro de gravidade é ponto da resultante dos pesos |

Vinte e cinco justificativas também presentes nos registros. Nenhuma questão
exige memorizar número de item/página como objeto de resposta.

## Precedência, estados e sobreposição

Os cinco prevalecem no principal e já eram ativos. Nenhum consta de restaurações
ou notebook-complete-stems.0362/0363 físicos do mesmo grupo ficam integralmente
inalterados e ausentes do runtime. Política bruta de0362 já inativa por
answer-leak:answer_similarity_leak; bruta de0363 ativa. Após os transformadores
existentes, ambos inativos por stem-quotes-source-answer. Flags ausentes não
inferidas; nenhuma nova quarentena ou contagem de correção/check desses dois.

Busca por old-119/anv1-2.25 encontrou2/3 variantes ativas, lidas individualmente.
Cada grupo compartilha competência; suas variantes não devem coexistir na mesma
prova. Busca por código não exclui outras variantes: semântica global e prevenção
de coexistência pendentes. Nenhum ID/modelo criado, removido ou reativado;
regime específico de três modelos por item preservado. Metadados legados
mantidos para filtros; árvore/estados globais seguem pendentes.

auditQuestion sem achados e política ativa nas cinco versões finais; os dois
transformadores preservam os objetos. A redação intermediária de988 acionou
checagem de sobreposição lexical e foi ajustada antes de gerar a versão final;
nenhuma regra de qualidade foi relaxada. Igualdade completa fonte/runtime e
regressão de todos os hashes. Contrato fonte principal+163/164/861/862/988;
direto+861/862/988. Hashes em CORRECOES_RUNTIME.json, cinco conferências no JSONL,
testes reais em TESTES_E_EVIDENCIAS.md. Nenhuma aprovação final inventada.

Acumulado:80 correções distintas,83 conferências bibliográficas parciais,
ZERO aprovações finais. Par0142/0840 e achados anteriores preservados sem
recontagem. Rechecagem independente, programa/edital, cobertura, estados,
semântica e offline/produção pendentes. Oito gates pendentes/falhos;
sem merge, deploy em produção ou usuários alterados.
