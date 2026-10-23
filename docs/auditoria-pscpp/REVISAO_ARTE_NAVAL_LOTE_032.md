# Lote 032 — volta de fiel singela e impedimento de fonte de propulsores

Base remota e126e3daa701846ec78821b8f32e64cbda29dbe3, PR #172 aberto/draft.
HEAD remoto, checkpoint e relatório 031 consultados antes das edições.
Fast-forward de árvore rastreada limpa; temporários preservados. A inspeção
limitada dos processos disponíveis não identificou outro escritor. Publicação
com lease. Prompt-Mestre e benchmark mantidos.

## ANV-0142/0840 — fonte ainda não confirmada, sem correção inventada

O volume 2 fornecido, SHA256
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1,
anuncia no sumário PDF11 os artigos 11.11 comando eletrônico, 11.12 governo
azimutal e 11.13 propulsor lateral. No corpo p.776/PDF137 começa mastreação
em 11.11 e mastros em 11.12; p.779/PDF140 traz 11.13 Aparelho fixo. Texto e
imagens de sumário/fronteira/título foram comparados, incluindo p.775/PDF136.
A imagem PDF12 foi consultada inicialmente, mas é a continuação seguinte do
sumário; o anúncio relevante está em PDF11, explicitamente confirmado.
Não é simples troca de palavra pelo OCR nessas páginas. A causa da divergência
ou a integridade editorial do exemplar completo não foi determinada.

A busca no texto extraído dos dois volumes não localizou no corpo do volume 2
o trecho de propulsores anunciado; isso não prova ausência em toda imagem ou
em outra edição. A menção a bow thruster no volume 1, 3.10.3 p.160/PDF160,
trata de NDCC e não basta para validar as afirmações gerais de eficiência,
velocidade e governo das duas questões. A consulta pública encontrou normas,
material acadêmico e fórum; nenhum foi aceito como texto primário da passagem
atribuída a Fonseca. Não se transferiram afirmações de snippets nem regras
normativas atuais para as questões. Inventário Drive de obras completas foi
inspecionado, mas busca integral nos demais livros permanece por fazer.

BUSCA_FONTE_PROPULSORES_032.json registra escopo, hashes, observações, consultas,
limitações e retomada. ANV-0142/0840 permanecem pendentes e integralmente
inalteradas, inclusive fontes físicas e versões efetivas. Zero incremento de
conferências primárias para esse par; nenhuma aprovação ou classificação de
irrecuperável. Não se aplicou quarentena sem concluir a busca e a reconciliação
de edição/exemplar; também não se mudou sua competência ou obra para forçar
um resultado. O gate segue fechado. A falha geral inicial continua ANV-0142;
a próxima candidata independente após este lote é ANV-0145.

## Fonte efetivamente usada nas três correções

Fonseca, Arte Naval v.1, 8ª ed., 2019, art.8.7 p.538/PDF536; figuras 8-5 e 8-6,
pp.538–539/PDF536–537. Texto e imagens dessas páginas e p.537/PDF535 lidos.
Contrastes 8.5/8.6/8.8/8.9 e figuras 8-3/8-4/8-7/8-8/8-9 inspecionados para
distinguir fiador, cote, fiel dobrada e volta redonda e cotes. A figura 8-6 na
p.539 pertence à singela, mesmo estando próxima do texto de 8.8; não foi
atribuída à dobrada por proximidade gráfica. Não há figura obrigatória ausente
nos enunciados, que descrevem toda a geometria necessária em palavras.
SHA256 recalculado:
792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20.
Drive 1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N; livro/imagens privados.

Dois cotes opostos e chicotes saindo entre eles em sentidos contrários definem
a volta singela. O livro mostra execução pelo chicote e pelo seio e condiciona
o emprego à tensão constante, indicando remate com cote ou botão nos outros
casos. A volta adicional entre primeiro e último cote distingue a dobrada.
Não se adotou garantia universal de não recorrer, carga admissível ou aplicação
de sustentação de pessoas. A tabela de resistências da p.537 foi observada
como contexto, sem novo cálculo, percentuais ou extrapolação para cabo real.

## Precedência e identidade

ANV-0143 prevalece na restauração anv1-8.7, já efetiva antes do lote.
O principal trata de nó torto, com provenance pscpp-style-upgrade-v3; todos os
seus campos permanecem intactos. Nenhuma flag ausente inferida ou nova versão
ativada. ANV-0841/0981 prevalecem no principal. Nenhum dos três IDs consta de
notebook-complete-stems. Reconciliação global de versões/estados pendente.

answer-leak-v1 removia as proposições de 0143 e tornava 0841 um comando genérico;
0981 recebia reparo de OCR. Os novos objetos passaram por auditQuestion sem
achados, política ativa e reformulateLeakingStem/normalizeEditorialStem sem
alteração. Igualdade fonte/runtime e ausência de mass_reformulation após
geração verificadas pela regressão. Nenhum normalizador/filtro/gate relaxado;
contrato direto só +0841/0981. IDs/tópicos, keys C/A/A e formatos B/A/A
preservados; rótulos legados mantidos para filtros. L2/Médio proposto para
0143/0841; L1/Fácil para 0981, que exige identificação, sem promovê-la a decisão
operacional. Nenhuma dificuldade psicométrica ou calibração histórica aprovada.

## ANV-0143 — julgamento individual

I verdadeira: geometria dos dois cotes e chicotes, 8.7 p.538. II falsa: elimina
o remate fora de tensão constante e inventa garantia para qualquer condição.
III verdadeira: execução pelo chicote/seio e condição de remate, 8.7 e figs.8-5/8-6.
IV falsa: transfere para a singela a volta adicional da dobrada, 8.8.
Vetor V/F/V/F; conjunto completo I/III, gabarito C.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | II/III | II falsa; falta I |
| B | II/IV | Ambas falsas; faltam I/III |
| C | I/III | Único conjunto completo das verdadeiras |
| D | I/II | II falsa; falta III |
| E | III/IV | IV falsa; falta I |

## ANV-0841 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Correta: geometria e condição de tensão/remate de 8.7 |
| B | Falsa: mantém geometria, mas elimina o remate |
| C | Falsa: volta adicional pertence à dobrada |
| D | Falsa: confunde volta redonda e cotes com cotes opostos |
| E | Falsa: reduz a montagem de dois cotes a um só |

## ANV-0981 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Correta: volta de fiel singela |
| B | Falsa: dobrada acrescenta volta entre os cotes |
| C | Falsa: volta redonda e cotes tem outra disposição |
| D | Falsa: cote isolado não forma o par |
| E | Falsa: fiador da figura 8-3 é outro nó |

Quinze justificativas específicas e autossuficiência de dados. Nenhuma demanda
de saber o número do item do livro; localizadores ficam em source/tracking.

## Sobreposição e pendências

Busca pelo código anv1-8.7 encontrou as três variantes, lidas individualmente.
Compartilham competência e não devem coexistir na mesma prova. Busca por
código não prova ausência de variantes com outros códigos; revisão semântica
global e prevenção de coexistência pendentes. Nenhum ID/modelo criado/removido;
regime chapter-item-3-models preservado. Grupo 12.70, terminologia do lote023,
paginação do lote026 e divergência 12.80/12.81 do lote031 mantidos com seus
limites, sem checks/aprovações adicionais. Nada do par 0142/0840 foi contado
como correção ou conferência de conteúdo.

Acumulado após validação: 64 correções, 67 conferências bibliográficas
parciais, ZERO aprovações finais. Rechecagem independente, fonte do par de
propulsores, programa/edital oficial, cobertura, estados, semântica e offline/
produção pendentes. Hashes antes/depois em CORRECOES_RUNTIME.json; conferências
no respectivo JSONL. REVISOES_EDITORIAIS.jsonl sem aprovação inventada.
Resultados reais em TESTES_E_EVIDENCIAS.md. Oito gates pendentes/falhos;
sem merge/deploy/dados de usuários.
