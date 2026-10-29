# Lote 027 — abatimento na curva de giro

Base remota f15c38db79ccd101c341480aff124a4382dfab69; PR #172 aberto/draft.
HEAD remoto, CHECKPOINT.json e relatório026 consultados antes da edição.
Fast-forward com árvore rastreada limpa, temporários preservados. Inspeção de
processos disponível identificou somente o próprio fetch, sem outro escritor
identificado. Publicação com lease. Prompt-Mestre/benchmark mantidos.
O PR informou mergeable=false na consulta inicial; não se inferiu a causa nem
se tentou merge. Sincronização/revisão final de main permanece requisito futuro,
além dos oito gates ainda pendentes/falhos. Na reconsulta imediatamente antes
da publicação, o mesmo HEAD retornou mergeable=true; a variação dos metadados
foi registrada sem inferir causa e não autoriza merge.

## Fonte primária e limites

Fonseca, Arte Naval v.2, 8ª ed., 2019, art.12.56.1.f p.875/PDF236;
contrastes 12.56.1.a–g pp.874–875/PDF235–236. Texto e imagens dessas páginas
inspecionados, incluindo figuras12-31 (curva de giro) e12-32 (ângulo de deriva).
Contexto da p.876/PDF237 também lido/inspecionado. As questões contêm todos
os elementos necessários à identificação; não dependem de imagem ausente.
Não há cálculo de escala ou previsão do caimento de um navio real.
SHA256 recalculado do volume:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; PDF/imagens privados.

O abatimento é definido como caimento inicial para o bordo contrário ao da
guinada, medido normalmente ao rumo inicial. Normal significa perpendicular,
não medição ao longo desse rumo. Avanço e afastamento têm referências distintas,
ambos definidos para a proa a 90 graus; diâmetro tático refere-se à guinada de
180 graus. Ângulo de deriva é angular, entre tangente e eixo longitudinal.
Os ângulos citados são definições da fonte, não comandos operacionais criados.

A justificativa antiga atribuía genericamente o efeito à força lateral e à
posição do ponto de giro sem individualizar o suporte causal no localizador f.
O contexto discute translação, rotação e centro de giro, mas este lote não
converte essa discussão em uma regra universal de posição ou de força. Novas
respostas se apoiam na definição, fase e direção de medição efetivamente
localizadas. Não se afirmou que a explicação causal inteira fosse falsa;
ela requer fundamentação própria antes de servir como premissa de questão.
Sem valor numérico de abatimento, ângulo de leme inventado ou decisão de manobra.

## Precedência e transformação

ANV-0128 prevalece na restauração old-132 já consumida antes deste lote.
O principal contém composição sobre hélices para fora e outros temas, com
provenance.method pscpp-style-upgrade-v3. Todos os campos do principal
permaneceram intactos; não se inventaram flags de inatividade/quarentena.
Corrigida a restauração efetiva, preservando sua competência. Reconciliação
global de identidades/estados entre versões permanece pendente.

0826/0976 prevalecem no principal; os três IDs não constam de
notebook-complete-stems. answer-leak-v1 retirava as proposições de ANV-0128 e
convertia ANV-0826 em comando genérico. Na primeira geração deste lote, a expressão
curva de giro no comando final de ANV-0976 gerou falso positivo de continuidade/
similaridade com Abatimento na curva. A reformulação genérica subsequente foi
excluída pela política, reduzindo temporariamente o banco a 12.101 cadernos.
O registro foi interrompido antes de gravar qualquer correção/conferência
incompleta. O comando foi ajustado para perguntar pela grandeza registrada,
preservando o caso. Nova geração/regressão confirmou 12.102 cadernos, igualdade
fonte/runtime e ausência de reformulação posterior. Nenhum normalizador/filtro
foi relaxado. Versões intermediárias não foram publicadas como banco validado.

IDs/tópicos e keys C/A/A preservados, formatos principais B/A/A. Rótulos legados
Associação conceitual/Situação aplicada mantidos por compatibilidade. Locator e
tracking.section detalhados. Contrato direto acrescido somente ANV-0826/0976.

## ANV-0128 — julgamento individual

I verdadeira: fase inicial e bordo contrário à guinada, alínea f. II falsa:
troca o caimento inicial pela fase circular. III falsa: descreve avanço, alínea
b. IV verdadeira: direção normal ao rumo inicial, alínea f. Vetor V/F/F/V.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/III | III falsa; falta IV |
| B | III/IV | III falsa; falta I |
| C | I/IV | Único conjunto completo das verdadeiras |
| D | II/IV | II falsa; falta I |
| E | I/II | II falsa; falta IV |

## ANV-0826 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Única correta: caimento inicial, bordo contrário, medição perpendicular |
| B | Falsa: avanço, direção do rumo inicial até 90 graus |
| C | Falsa: afastamento, direção transversal até 90 graus |
| D | Falsa: diâmetro tático, distância transversal em 180 graus |
| E | Falsa: ângulo de deriva entre tangente e eixo longitudinal |

## ANV-0976 — julgamento individual

O caso informa marcha a vante, início da guinada para BE, caimento para BB e
medida perpendicular ao rumo inicial. Classifica uma observação fornecida;
não prevê que toda embarcação terá determinado valor de caimento.

| Opção | Julgamento |
|---|---|
| A | Única correta: os três elementos definem abatimento |
| B | Falsa: afastamento exigiria distância transversal referida à proa a 90 graus |
| C | Falsa: diâmetro tático refere-se à guinada de 180 graus |
| D | Falsa: avanço tem direção do rumo inicial, até 90 graus |
| E | Falsa: ângulo de deriva é medida angular, não esse caimento transversal |

Quinze justificativas específicas. Distratores substituídos por grandezas do
mesmo recorte, evitando as antigas opções pouco pertinentes de homem ao mar,
interação e milha medida. L2/Médio proposto para distinguir referência, fase e
grandeza; sem dificuldade psicométrica medida ou calibração histórica aprovada.

Uma tentativa posterior de build retornou exit0 com log terminando após os
geradores, sem evidência de compilação. Não foi aceita. Execução completa
repetida com verificação explícita de exit0, compilação, tipos,101 páginas e
rotas, todos confirmados. Ver TESTES_E_EVIDENCIAS.md.

## Sobreposição e pendências

Busca old-132 encontrou as três variantes, lidas individualmente. Compartilham
competência e não devem coexistir na mesma prova. Busca por código não prova
deduplicação semântica global; prevenção de coexistência permanece pendente.
Nenhum ID criado/removido; subconjuntos chapter-item-3-models preservados.
Grupo 12.70 do lote024, paginação do lote026 e passagem terminológica do lote023
mantidos com seus limites, sem checks/aprovações adicionais contados aqui.

Acumulado 51 correções primárias/54 conferências bibliográficas parciais; ZERO
aprovações editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json;
conferências em CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Rechecagem independente,
programa/edital oficial, cobertura, estados, semântica e offline/produção
pendentes. REVISOES_EDITORIAIS.jsonl sem aprovação inventada.
Resultados reais em TESTES_E_EVIDENCIAS.md. Sem merge/deploy/dados de usuários.
