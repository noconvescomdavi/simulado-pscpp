# Lote 030 — saia da máquina de suspender

Base remota e94eecbaf7e2afe07d8eefdabe91e2e52695a490, PR #172 aberto/draft.
HEAD remoto, checkpoint e relatório 029 consultados antes das edições.
Fast-forward de árvore rastreada limpa; temporários preservados. Inspeção
limitada dos processos disponíveis identificou apenas o próprio fetch como
escritor Git. Publicação com lease. Prompt-Mestre e benchmark preservados.

## Fonte e limites

Fonseca, Arte Naval v.2, 8ª ed., 2019, seção C, art.10.28 p.738 e
art.10.29.b–g pp.740–742. Referência principal: 10.29.e p.741/PDF102.
Texto/imagens PDF99–103 lidos, cobrindo integralmente 10.28 e 10.29, inclusive
figuras 10-23a/10-23b pp.739–740. Início de 10.30.a(1) na p.742 lido como
contexto; não se declara revisão integral de 10.30. Nenhuma figura é necessária
para responder aos novos comandos, que trazem o objeto técnico explicitamente.
SHA256 recalculado: 6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; livro/imagens privados.

A saia é descrita como tambor de periferia lisa para espias e outras manobras
de cabos de grande esforço; pode ser montada no mesmo eixo da coroa.
A coroa recebe os elos da amarra em sua periferia dentada; a embreagem
principal liga a coroa ao eixo; o freio mecânico atua por cinta sobre flange;
o linguete trava um sentido por apoio nos dentes de coroa fixa ao convés.
As questões distinguem essas funções, sem fazer equivaler componentes apenas
porque compartilham eixo ou acionamento. A disposição da saia acima da coroa
é vinculada ao arranjo de cabrestante descrito na obra, não a todo equipamento.

A p.738 adverte sobre variedades de fabricantes e necessidade de conhecer
instruções/desenhos da própria máquina. Não se produziu sequência operacional,
limite de carga, cálculo, orientação de segurança ou regra de fabricante para
instalação real. O trecho sobre emprego do freio não foi transformado em
prescrição de fundeio. Os comandos de pinos da figura 10-23a foram inspecionados
visualmente: a extração de texto confunde A/B em algumas linhas. Não foram
usados como premissa nem reproduzidos como instrução; nenhuma errata da obra
foi inferida desse defeito de extração.

## Identidade, precedência e transformações

ANV-0134 prevalece na restauração old-064, já efetiva antes deste lote.
O principal trata de prova de ruptura da amarra e outros temas, com
provenance pscpp-style-upgrade-v3; todos os seus campos foram preservados.
Nenhuma flag ausente foi inferida. Não se ativou nova versão. Reconciliação
global de versões/estados permanece pendente. ANV-0832/0978 prevalecem no
principal; nenhum dos três IDs consta de notebook-complete-stems.

answer-leak-v1 removia as proposições de 0134 e tornava 0832 comando genérico.
A versão 0978 recebia reparo de OCR. Novos comandos e alternativas eliminam
misturas de definição da máquina inteira com a função da peça. A antiga III
de 0134 era genérica sobre equipamentos com tambores/coroas: foi substituída por
atribuição falsa inequívoca da função da embreagem à saia. I/IV verdadeiras;
II/III falsas; gabarito D preservado. Diretas mantêm B/C.

Na checagem preliminar, 0978 acionou stem_answer_continuation por coincidência
lexical entre cabrestante no fim do enunciado e na resposta curta. O comando
foi ajustado para eixo vertical, com suporte em 10.28, preservando o cenário.
Isso ocorreu antes da geração/registro do lote. auditQuestion final sem achados,
política ativa e reformulateLeakingStem/normalizeEditorialStem preservando os
três objetos integralmente. Nenhum normalizador/filtro/gate relaxado.
Igualdade fonte/runtime após geração conferida pela regressão; contrato direto
acrescido somente de 0832/0978. IDs/tópicos e formatos efetivos B/A/A preservados.
Rótulos legados Associação conceitual/Situação aplicada mantidos para filtros.
L2/Médio proposto para 0134/0832; L1/Fácil para 0978, cujo cenário exige apenas
identificação de peça, sem promovê-lo artificialmente a decisão operacional.
Dificuldade não calibrada psicometricamente nem aprovada pelo benchmark.

## ANV-0134 — julgamento individual

I verdadeira: periferia lisa e cabos, 10.29.e p.741. II falsa: dentes/recessos
para elos são da coroa, 10.28/10.29.b pp.738/740. III falsa: ligação da coroa
a seu eixo é função da embreagem, 10.29.f p.741. IV verdadeira: possível mesmo
eixo sem identidade funcional, 10.29.e p.741. Vetor V/F/F/V; conjunto completo I/IV.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/II | II falsa; falta IV |
| B | I/III | III falsa; falta IV |
| C | III/IV | III falsa; falta I |
| D | I/IV | Único conjunto completo de verdadeiras |
| E | II/IV | II falsa; falta I |

## ANV-0832 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Coroa de Barbotin; não saia, 10.29.b p.740 |
| B | Única correta: tambor liso para cabos/espias, possível mesmo eixo, 10.29.e p.741 |
| C | Embreagem principal; não saia, 10.29.c/f pp.740–741 |
| D | Freio mecânico; não saia, 10.29.d p.741 |
| E | Linguete; não saia, 10.29.g p.742 |

## ANV-0978 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Freio: cinta sobre flange, não tambor de cabos |
| B | Embreagem: acoplamento da coroa, não tambor |
| C | Única correta: saia, tambor liso acima da coroa no arranjo descrito |
| D | Coroa: recebe elos em periferia dentada, não lisa |
| E | Linguete: peça de travamento, não tambor |

Quinze justificativas específicas com localizadores. Sem cálculo ou figura
obrigatória ausente. Mantida competência; referência fica em source/tracking,
não como requisito para reconhecer o número do item do livro.

## Sobreposição e pendências

Busca old-064 no inventário efetivo encontrou estes três registros, lidos
individualmente. São variantes da mesma competência e não devem coexistir na
mesma prova. Busca por código não prova ausência de outras variantes.
Revisão semântica global e prevenção de coexistência continuam pendentes.
Nenhum ID/modelo criado/removido; regime chapter-item-3-models preservado.
Grupo 12.70, terminologia do lote023 e paginação do lote026 mantidos com seus
limites, sem conferências ou aprovações adicionais.

Acumulado após validação: 59 correções e 62 conferências bibliográficas
parciais, ZERO aprovações finais. Rechecagem independente, alinhamento com
programa/edital oficial, estados, cobertura, semântica e offline/produção
pendentes. Hashes antes/depois em CORRECOES_RUNTIME.json e conferências no
respectivo JSONL. REVISOES_EDITORIAIS.jsonl sem aprovação inventada.
Resultados reais em TESTES_E_EVIDENCIAS.md. Oito gates pendentes/falhos;
sem merge/deploy/dados de usuários.
