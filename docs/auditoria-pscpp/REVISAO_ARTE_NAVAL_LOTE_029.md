# Lote 029 — hélice de passo controlável

Base remota 421cfb892e653abeeabe19674043b03aeb1f1e82, PR #172 aberto/draft.
HEAD remoto, checkpoint e relatório 028 consultados antes das edições.
Fast-forward de árvore rastreada limpa; temporários preservados. A inspeção
limitada dos processos disponíveis identificou apenas o próprio fetch como
escritor Git. Publicação com lease para impedir sobrescrita concorrente.
Prompt-Mestre relido integralmente; benchmark histórico preservado.

## Fonte e limites

Fonseca, Arte Naval v.2, 8ª ed., 2019, seção B, art.12.18, pp.818–819,
PDF179–180. Texto e imagens das duas páginas lidos, cobrindo integralmente
esse artigo; não há figura necessária ao enunciado nesse recorte.
SHA256 recalculado: 6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. Livro/imagens permanecem privados.

A p.818 descreve o mecanismo hidráulico que muda igualmente a inclinação das
pás, variando o passo e permitindo a inversão de marcha sem inverter a máquina.
A p.819 relaciona mudança do passo, potência exigida e adequação do combustível
para suportar a carga no mesmo regime de RPM; menciona sistemas automáticos,
sem estabelecer que todas as instalações os possuam. A distância de parada
inferior a dois comprimentos é exemplo de alguns navios-varredores, não garantia
para qualquer navio equipado com esse sistema. Nenhum número de passo, tempo
de resposta, distância de parada calculada, limite de fabricante ou sequência
operacional de instalação real foi inventado. A rapidez de inversão descrita
no livro não foi convertida em garantia de resposta instantânea de todo navio.

## Identidade, precedência e transformações

ANV-0131 prevalece na restauração old-103, já efetiva antes deste lote.
O principal trata de cabo de leva, com provenance pscpp-style-upgrade-v3 e
outro código; todos os seus campos foram preservados integralmente. Não foram
inferidas flags ausentes nem ativada nova versão. Reconciliação global de
versões/estados continua pendente. ANV-0829/0977 prevalecem no principal.
Nenhum dos três IDs consta de notebook-complete-stems.

answer-leak-v1 removia as proposições de 0131 e tornava 0829 um comando genérico;
0977 sofria reparo de OCR, mas ainda apresentava distratores de outros arranjos.
A antiga IV de 0131, sobre aproveitar individualmente os propulsores, não é
intrinsecamente falsa em todo contexto: não servia como distrator inequívoco
para o conjunto pretendido. Foi substituída por generalização verificavelmente
indevida do exemplo restrito da fonte. I passou a contrastar passo variável
com passo invariável. As três competências permanecem dentro do mesmo tema.

Novos enunciados passaram por auditQuestion sem achados; reformulateLeakingStem
e normalizeEditorialStem preservam integralmente os três objetos e a política
existente os considera ativos. Nenhum normalizador, filtro ou gate relaxado.
Contratos diretos acrescidos somente de 0829/0977; regressão confere igualdade
fonte/runtime, hashes exatos e ausência de mass_reformulation após geração.
IDs, tópicos, gabaritos A/D/B e formatos efetivos B/A/A preservados. Os rótulos
legados Associação conceitual e Situação aplicada foram mantidos por
compatibilidade de filtros; não equivalem à classificação estrutural aprovada.
Nível L2/Médio proposto para compreensão do mecanismo e suas condições;
sem calibração psicométrica, aprovação histórica de dificuldade ou decisão L4.

## ANV-0131 — julgamento individual

I falsa: a inclinação das pás e o passo variam, p.818. II verdadeira: inversão
do passo em lugar de inversão da máquina, p.818. III verdadeira: adequação do
combustível/potência à carga no mesmo regime de RPM, p.819. IV falsa: universaliza
um exemplo expressamente restrito a alguns navios-varredores, p.818.
Vetor F/V/V/F, único conjunto completo II/III.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | II/III | Único conjunto completo de verdadeiras |
| B | II/IV | IV falsa; falta III |
| C | I/II | I falsa; falta III |
| D | III/IV | IV falsa; falta II |
| E | I/III | I falsa; falta II |

## ANV-0829 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Falsa: mesmo RPM não implica potência/combustível invariáveis |
| B | Falsa: comando hidráulico das pás não dispensa potência da máquina para a carga |
| C | Falsa: inversão do passo não exige inverter obrigatoriamente a máquina |
| D | Correta: passo altera potência exigida; combustível acompanha carga, com possibilidade de controle automático |
| E | Falsa: a obra permite alterar passo mantendo regime de RPM, sem impor parada da máquina |

## ANV-0977 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Falsa: máquina reversível com passo fixo não explica a mudança hidráulica de inclinação das pás |
| B | Correta: passo controlado/controlável corresponde ao mecanismo descrito |
| C | Falsa: inversor de transmissão com passo fixo não corresponde à variação das pás |
| D | Falsa: rotação para fora do par com passo fixo não satisfaz a variação hidráulica do caso |
| E | Falsa: rotação para dentro do par com passo fixo também não satisfaz a condição expressa |

Quinze justificativas específicas. Não é necessário localizar o item do livro
para responder; a referência permanece em source/tracking. Não há cálculo novo
ou dado de figura ausente. Distinções sobre passo fixo/transmissão são usadas
para testar a condição expressa de variação das pás, sem atribuir ao art.12.18
uma descrição detalhada de cada arquitetura alternativa.

## Sobreposição e pendências

Busca old-103 no inventário efetivo encontrou os três registros, lidos
individualmente. São variantes da mesma competência; mesmo distinguindo
mecanismo e relação com potência, não devem coexistir na mesma prova.
Busca por código não prova ausência de variantes com outros códigos.
Revisão semântica global e prevenção de coexistência continuam pendentes.
Nenhum ID ou modelo criado/removido; regime chapter-item-3-models preservado.
Grupo 12.70, terminologia do lote023 e paginação do lote026 mantidos com os
limites já registrados, sem conferências ou aprovações adicionais.

Acumulado após validação: 56 correções primárias e 59 conferências
bibliográficas parciais, ZERO aprovações finais. Conferência parcial não é
rechecagem independente nem comprova alinhamento com programa/edital oficial.
Hashes antes/depois em CORRECOES_RUNTIME.json e conferências no respectivo
JSONL; REVISOES_EDITORIAIS.jsonl sem aprovação inventada. Resultados reais em
TESTES_E_EVIDENCIAS.md. Oito gates pendentes/falhos; sem merge/deploy/dados de usuários.
