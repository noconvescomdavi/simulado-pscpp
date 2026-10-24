# Lote 028 — amarração com dois ferros

Base remota 03d6baa8ed9780c39235b7c4f45ce73ccae5bf08; PR #172 aberto/draft.
HEAD remoto, CHECKPOINT.json e relatório027 consultados antes de editar.
Fast-forward da árvore rastreada limpa, temporários preservados. Inspeção de
processos disponível identificou apenas o próprio fetch, sem outro escritor
identificado; publicação com lease. Prompt-Mestre/benchmark mantidos.

## Fonte primária e recorte

Fonseca, Arte Naval v.2, 8ª ed., 2019, art.12.46.1 pp.856–858/PDF217–219
e art.12.48 pp.864–865/PDF225–226. Texto/imagens dessas cinco páginas
inspecionados integralmente, incluindo figuras 12-21 (anilho),12-22 (geometria
e tensão) e12-23 (uma amarra portando). Contexto12.49 pp.865–866/PDF226–227
e figura 12-27 também lidos/inspecionados; o procedimento de safar voltas não
é cobrado nem transformado em instrução operacional nas duas questões.
O intervalo12.46.2/12.47 não foi tratado como integralmente revisado neste
lote; o localizador genérico anterior12.46–12.49 foi substituído pelo recorte
que efetivamente sustenta as respostas. Não há dependência de figura ausente.
SHA256 recalculado do volume:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; livro/imagens privados.

O arranjo descrito usa dois ferros afastados, com a proa aproximadamente a meia
distância, permitindo filar ao vento/corrente com área de rabeio restrita.
Isso não significa imobilidade do casco. A p.858 distingue o caso em que o navio
está filado no alinhamento dos ferros, portando por uma amarra, da situação de
vento transversal, em que os esforços mudam. Duas âncoras não implicam divisão
igual obrigatória da força em todas as condições.

O anilho exige amarração tesa para trabalhar adequadamente. O art.12.48
ressalva que sua simples colocação não basta para impedir voltas e exige
vigilância. A formulação das questões une definição, condições e limites;
não prescreve filame, ângulo, tensão admissível ou decisão de fundeio para
navio real. Não se exige nem se inventa cálculo da figura 12-22. Não se
atribuiu obrigação portuária atual a todos os navios a partir dessa obra.

## Precedência e estados

ANV-0129 prevalece na restauração old-124, já carregada antes deste lote.
O principal trata de rocegar e outros temas mistos, com active=false,
status=quarantined e provenance.method pscpp-style-upgrade-v3. Todos seus
campos/flags permanecem intactos; não se reativou essa versão em quarentena.
A restauração efetiva sobre dois ferros foi corrigida no lugar, preservando
sua competência. Divergência global de versões/estados permanece pendente.

ANV-0827 prevalece no principal. Nenhum dos dois IDs consta de
notebook-complete-stems. answer-leak-v1 retirava as proposições de 0129 e
convertia0827 em comando genérico. Novos comandos explícitos, sem aspas longas;
auditQuestion sem achados, cadeia reformulateLeakingStem/normalizeEditorialStem
mantendo enunciados e política ativa já verificada antes da geração. Runtime
regenerado e igualdade fonte/runtime/ausência de reformulação posterior
conferidas pela regressão. Nenhum normalizador/filtro/gate relaxado.
IDs/tópicos e keys D/B preservados, formatos principais B/A. Rótulo legado
Associação conceitual mantido em 0827 por compatibilidade de filtros. Locator e
tracking.section detalhados. Contrato direto acrescido somente 0827.

## ANV-0129 — julgamento individual

I verdadeira: geometria e finalidade do arranjo,12.46.1 p.856. II falsa:
na condição expressa de navio filado no alinhamento dos ferros, a p.858 indica
uma amarra portando, não metades iguais. III verdadeira: funcionamento do
anilho condicionado à amarração tesa e vigilância necessária, pp.857/864–865.
IV falsa: restringir área não impede o giro para filar ao vento/corrente.
Vetor V/F/V/F; único conjunto completo I/III.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | II/III | II falsa; falta I |
| B | III/IV | IV falsa; falta I |
| C | II/IV | Ambas falsas; faltam I/III |
| D | I/III | Único conjunto completo das verdadeiras |
| E | I/II | II falsa; falta III |

## ANV-0827 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Falsa: inverte disposição dos ferros e da proa |
| B | Única correta: ferros afastados, proa aproximadamente entre eles, área restrita |
| C | Falsa: transforma restrição de rabeio em imobilidade de orientação |
| D | Falsa: presume divisão igual obrigatória na condição de uma amarra portando |
| E | Falsa: ignora condição de tensão e vigilância do anilho |

Dez justificativas específicas. Distratores pertinentes ao mesmo arranjo,
com erros localizados de geometria, fase de trabalho e condição de funcionamento,
substituem alternativas genéricas de área/rocegar/regeira. L2/Médio proposto:
compreensão de condições e limites, sem dificuldade psicométrica medida,
calibração histórica aprovada ou promoção a decisão operacional L4.
Sem cálculo novo, parâmetros de fabricante ou alegação de vigência normativa.

## Sobreposição e pendências

Busca old-124 no inventário encontrou este par, lido individualmente.
Compartilha competência e não deve coexistir na mesma prova. Busca por código
não prova ausência de variantes com outros códigos; revisão semântica global
e prevenção de coexistência permanecem pendentes. Nenhum ID criado/removido;
regime específico chapter-item-3-models preservado. Grupo 12.70 do lote024,
passagem terminológica do lote023 e paginação do lote026 mantidos com seus
limites, sem checks/aprovações adicionais contados neste lote.

Acumulado 53 correções primárias/56 conferências bibliográficas parciais; ZERO
aprovações editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json;
conferências parciais em CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Rechecagem
independente, programa/edital oficial, cobertura, estados, semântica e
offline/produção pendentes. REVISOES_EDITORIAIS.jsonl sem aprovação inventada.
Resultados reais em TESTES_E_EVIDENCIAS.md. Sem merge/deploy/dados de usuários.
