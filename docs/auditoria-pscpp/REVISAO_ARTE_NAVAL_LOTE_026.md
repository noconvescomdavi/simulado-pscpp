# Lote 026 — classificação geral dos navios

Base remota ce57b4d36710183a18f9f325a41f59aaf98ea7c2; PR #172 aberto/draft.
HEAD remoto, CHECKPOINT.json e relatório 025 consultados antes da edição.
Fast-forward com árvore rastreada limpa, temporários preservados. Inspeção
disponível de processos identificou apenas o próprio fetch, sem outro escritor
identificado; publicação protegida por lease. Prompt-Mestre e benchmark mantidos.

## Fonte primária e paginação

Fonseca, Arte Naval v.1, 8ª ed., 2019, cap.3 seção A, art.3.1, abertura
p.[129]/PDF129. A abertura NÃO exibe algarismo impresso. O valor 129 em
source.printed_page representa a posição na sequência, seguida pela página
impressa130/PDF130; a inferência está explicitada em source.page_note,
CONFERENCIAS_BIBLIOGRAFICAS.jsonl e no localizador com colchetes. Não foi
apresentado como algarismo visível na folha. Página PDF129 identificada e
inspecionada integralmente, incluindo as três listas e seus títulos.

Contexto de 3.2 nas pp.130–131/PDF130–131 também lido/inspecionado para
separar classes de navios de guerra dos critérios gerais de 3.1. Não se
validaram genericamente todas as afirmações históricas/técnicas de 3.2, nem
se usaram generalizações sobre navios modernos como premissa. Não há figura,
cálculo, escala ou tabela omitidos necessários às quatro questões.
SHA256 recalculado do volume:
792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20.
Drive 1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N; PDF/imagens privados.

O art.3.1 apresenta três critérios: fim, material de construção do casco e
sistema de propulsão. Seus exemplos permitem distinguir mercante/recreio,
aço/ferro-cimento/plástico reforçado com fibra de vidro e vela/propulsão
mecânica/sem propulsão. As questões testam associação de atributo a critério,
sem tratar navio auxiliar/tênder como sinônimo da classificação geral.
Os exemplos de fichas são hipotéticos e não estabelecem regras de registro,
habilitação, certificação ou classificação legal. Sem alegação de vigência
normativa, exclusividade de critérios legais ou enquadramento de navio real.

## Precedência, versões e transformações

ANV-0125 prevalece na restauração anv1-3.1 já consumida antes deste lote.
O principal contém outra composição V/F sobre navio de combate e temas
mistos, com provenance.method pscpp-style-upgrade-v3. Todos os seus campos
permaneceram intactos; não se inferiram flags de quarentena/inatividade que
não estão presentes. Corrigida a restauração efetiva no lugar; identidade
semântica daquela versão preservada. Reconciliação global de versões pendente.

0823/0975/1034 prevalecem no principal. Nenhum dos quatro IDs consta de
notebook-complete-stems. answer-leak-v1 retirava proposições de 0125 e deixava
0823 genérica. Na primeira regeneração deste lote, stem_answer_overlap também
substituiu os novos casos 0975/1034 por comandos genéricos, por sobreposição
lexical com suas respostas. O registro de hashes/conferências foi interrompido
antes de salvar qualquer linha incompleta. Redação ajustada localmente para
preservar os casos e separar termos do cenário dos critérios nas respostas;
novo auditQuestion sem achados e nova regressão confirmaram igualdade
fonte/runtime e ausência de reformulação posterior. Nenhum filtro/normalizador
foi relaxado. IDs, tópicos e keys E/C/E/D mantidos; formatos principais B/A/A/A.
Rótulos legados mantidos por compatibilidade de filtros. Três novos diretos
acrescidos ao contrato explícito do teste, sem mudar os critérios existentes.

## ANV-0125 — julgamento individual

I verdadeira: os cinco grupos citados correspondem ao fim a que se destinam.
II verdadeira: ferro-cimento é material; sem propulsão é categoria do terceiro
critério. III falsa: recreio pertence à finalidade, não ao material. IV falsa:
ferro/aço pertencem ao material, não à finalidade. Vetor V/V/F/F; I/II.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | II/IV | IV falsa; falta I |
| B | I/IV | IV falsa; falta II |
| C | II/III | III falsa; falta I |
| D | III/IV | Ambas falsas; faltam I/II |
| E | I/II | Único conjunto completo das verdadeiras |

## ANV-0823 — julgamento individual

Ordem pedida: finalidade, material, propulsão. Cada exemplo foi confrontado
com a lista respectiva do art.3.1, sem depender do número do item.

| Opção | Julgamento |
|---|---|
| A | Falsa: madeira/material e mercante/finalidade em posições trocadas |
| B | Falsa: remos/propulsão e ferro-cimento/material em posições trocadas |
| C | Única correta: mercante, ferro-cimento, vela |
| D | Falsa: vela/propulsão e serviços especiais/finalidade trocados |
| E | Falsa: propulsão mecânica e material de plástico reforçado trocados |

## ANV-0975 — julgamento individual

O cenário informa navio mercante, aço e movimento por máquinas. A associação
aplica os critérios do art.3.1; não exige inferir serviço de um navio real.

| Opção | Julgamento |
|---|---|
| A | Falsa: troca finalidade e material |
| B | Falsa: troca material e propulsão |
| C | Falsa: troca finalidade e propulsão |
| D | Falsa: desloca os três critérios |
| E | Única correta: finalidade, material, propulsão |

## ANV-1034 — julgamento individual

O cenário reúne recreio, casco de plástico reforçado com fibra de vidro e
ausência de propulsão própria. A última informação também tem categoria
prevista no art.3.1; não impede aplicar a classificação geral.

| Opção | Julgamento |
|---|---|
| A | Falsa: restringe indevidamente a classificação às embarcações com propulsão |
| B | Falsa: troca os três critérios |
| C | Falsa: reconhece dois critérios, mas exclui sem propulsão da lista |
| D | Única correta: associa os três critérios e admite ausência de propulsão |
| E | Falsa: atribui o material ao critério de propulsão |

Vinte justificativas específicas. L2/Médio proposto para classificação de
atributos e identificação de inversões; sem calibração psicométrica medida,
percentuais de dificuldade inventados ou equivalência histórica aprovada.
Não se promove a ficha hipotética a decisão operacional L4.

## Sobreposição e pendências

Busca anv1-3.1 no inventário encontrou estas quatro variantes, lidas uma a uma.
Elas compartilham competência e não devem coexistir na mesma prova. Busca por
código não substitui revisão semântica global nem prova ausência de outras
variantes. Nenhum ID criado/removido; subconjuntos chapter-item-3-models
preservados. A regra de três do subconjunto específico não foi aplicada
retroativamente a este grupo legado de quatro variantes. Grupo12.70 do lote024
e pendência terminológica da fonte do lote023 continuam pendentes, sem
aprovações/checks adicionais indevidamente contados neste lote.

Acumulado 48 correções primárias/51 conferências bibliográficas parciais; ZERO
aprovações editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json;
conferências parciais em CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Rechecagem
independente, programa/edital oficial, cobertura, estados, semântica e
offline/produção pendentes. REVISOES_EDITORIAIS.jsonl sem aprovação inventada.
Resultados reais em TESTES_E_EVIDENCIAS.md. Sem merge/deploy/dados de usuários.
