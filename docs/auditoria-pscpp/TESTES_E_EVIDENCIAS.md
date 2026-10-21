# Testes e evidências — checkpoints e evolução

## Lote 006 — ANV-0038/0039/0041

`npm run build` passou (exit 0), incluindo regeneração dos bancos, catálogo e
flashcards, compilação, lint/tipos e 101 páginas estáticas. Insumos de questões
estáveis durante o build; SHA-256 em CHECKPOINT.json. Avisos preexistentes
de npm/autoprefixer preservados. Não é validação de produção.

`test-pscpp-audit-anv0005.mjs` passou: onze deltas exatos contra baseline,
44 proposições no HTML real, vetores recompostos com resposta única e
justificativas A–E. 12.091 outros cadernos e todas as 1.984 PSCPP preservados.
Unicidade de 12.102 cadernos, matriz fixa e precedência/fingerprints passaram.
Inventários e triagem regenerados: 242 candidatos sem proposições e 77 por
localizador. Teste geral de enunciados saiu 1, agora em ANV-0043. Localizadores
saíram 1 com os mesmos 77 achados; gate de evidência saiu 2, 0/14.086 aprovados.
Nenhum teste ou normalizador foi relaxado. Onze correções e quatorze
conferências parciais; zero aprovações finais, sem merge ou deploy.
Regressão repetida após o build passou; `check:pscpp-bank` também passou.
Detalhes primários, figuras e sobreposições em REVISAO_ARTE_NAVAL_LOTE_006.md.

## Lote 005 — ANV-0037

`npm run build`: primeira tentativa compilou e gerou 101 páginas, mas saiu 1
por ENOTEMPTY ao remover `.next/export`. Não foi declarada aprovada.
Pasta gerada preservada fora do repo; nova execução com `.next` limpa passou
(exit 0), incluindo geração, compilação, lint/tipos e páginas estáticas.
Nenhuma mudança de insumos entre tentativas; hashes em CHECKPOINT.json.
Avisos preexistentes de npm/autoprefixer preservados.

`test-pscpp-audit-anv0005.mjs` passou: oito deltas exatos desde baseline,
32 proposições no HTML real, respostas únicas recompostas pelos vetores e
justificativas A–E. Outros 12.094 cadernos e todas as 1.984 PSCPP preservados.
Unicidade de 12.102 cadernos, matriz fixa, precedência/fingerprints e
`check:pscpp-bank` passaram. Regressão repetida após o build também passou.
Inventários e triagem regenerados: 245 candidatos sem proposições e 77 por
localizador. Teste geral ainda falha em ANV-0038; teste de localizadores falha
com os mesmos 77 achados. Gate de evidência saiu 2, 0/14.086 aprovados.
Nenhum teste relaxado; nenhuma aprovação final, merge ou deploy.
Oitava correção primária e décima primeira conferência parcial, documentadas
em REVISAO_ARTE_NAVAL_LOTE_005.md.


## Lote 004 — ANV-0025

`npm run build`: passou (exit 0), com geração, compilação, lint/tipos e
páginas estáticas. Hashes dos insumos estáveis em CHECKPOINT.json.
Regressão `test-pscpp-audit-anv0005.mjs` passou: sete deltas exatos desde
baseline, 28 proposições no HTML real, conjuntos e justificativas A–E;
12.095 outros cadernos e todas as 1.984 questões PSCPP preservados.
Unicidade dos 12.102 cadernos, matriz fixa e precedência/fingerprints passaram.
Inventários e triagem regenerados: 246 candidatos sem proposições, 77 por
localizador. Teste geral de enunciados ainda falha em ANV-0037; teste de
localizadores falha com 77 achados. Gate de evidência falha, 0/14.086 aprovados.
Nenhum teste relaxado. Sétima correção primária, décima conferência parcial;
sem aprovação de release, merge ou deploy. Continuidade HOURLY confirmada
ativa pelo conector, preservando a exigência de retomar o HEAD remoto.

## Lote 003 — duas novas correções e build completo

`npm run build`: passou (exit 0), incluindo geração PSCPP/cadernos/catálogo/
flashcards, compilação, lint/tipos e páginas estáticas. Insumos de questões
permaneceram estáveis durante o build; hashes em CHECKPOINT.json. Avisos
preexistentes de autoprefixer e configuração npm não foram ocultados. Isso não
valida revisão editorial de 100% do banco nem fluxo autenticado de produção.

`test-pscpp-audit-anv0005.mjs`: passou, seis deltas exatos desde baseline
309ec933, 24 proposições no HTML real, justificativas A–E e recomposição de
conjuntos únicos. 12.096 outros cadernos e todas as 1.984 questões PSCPP
preservados. Teste geral de enunciados ainda falha, agora em ANV-0025.
Matriz fixa, precedência/fingerprints de fontes e `check:pscpp-bank` passaram.
Inventário e triagem regenerados: 247 candidatos sem proposições e 77 por
localizador. Gate de evidência permanece 0/14.086; teste editorial de
localizadores permanece falho com 77 achados. Nenhum teste foi relaxado.
Detalhes primários e sobreposições semânticas em REVISAO_ARTE_NAVAL_LOTE_003.md.

## Lote 002 — três novas correções primárias

Regressão de correções passou: hashes anteriores/posteriores dos quatro IDs
de `CORRECOES_RUNTIME.json`, 16 proposições no HTML real, justificativas a–e,
12.098 outros registros dos cadernos e todas as 1.984 questões PSCPP sem mudança.
O teste foi ampliado com três deltas explícitos, não flexibilizado para aceitar
mudanças arbitrárias. `check:pscpp-bank` passou. Cadernos, catálogo e flashcards
regenerados. Teste geral ainda falha em ANV-0020. Triagem: 249 candidatos sem
proposições e 77 por localizador; quatro correções e três falsos positivos desde
o conjunto inicial de 256. Sete verificações bibliográficas parciais, zero
aprovações integrais de release.

Build iniciado no lote anterior: inconclusivo para a árvore atual porque os
insumos foram modificados posteriormente. Seu eventual sucesso não certifica
este lote. Novo build em checkpoint estável continua obrigatório; não foi
usado um build anterior para aprovar dados posteriores.

## Correção primária de ANV-0005

Teste `test-pscpp-audit-anv0005.mjs`: passou, quatro proposições no HTML real
e exatamente um ID efetivo alterado; outros 12.101 registros dos cadernos
idênticos ao commit congelado `309ec933`. Requer histórico Git contendo esse
commit, não checkout raso sem a referência. Unicidade dos cadernos (12.102) e
matriz fixa passaram novamente. A execução da matriz sem o loader JSON falhou
na configuração; reexecução com loader previsto passou, sem alteração do teste.
Teste geral de enunciados segue falhando, agora em ANV-0007. Gate editorial
segue 0/14.086. Build completo iniciado; não registrar aprovação antes do fim.

Inventários físicos/efetivos e hashes regenerados. Triagem reproduz o predicado
do teste existente: 252 candidatos de proposições e 77 de localizadores.
De 256 para 252 houve uma correção e três falsos positivos confirmados
(`RESOLUCOES_TRIAGEM.json`), não quatro correções bibliográficas. Nenhum teste
relaxado; `git diff --check` passou.

## Atualização: releitura histórica integral

`audit-pscpp-historical-benchmark.py` passou após conferir 264 registros, 255
corpos disponíveis e os gabaritos dos 254 válidos. Asserções verificam hashes
dos PDFs, sequência de números, cinco opções, pontos, classificação manual,
marcas X e respostas vermelhas (coordenadas e cor em CSV). Nenhum gabarito foi
aceito apenas por vir da planilha. Aviso de configuração de camadas do PDF
2012 preservado; trechos críticos renderizados e inspecionados.

`test-question-source-provenance.mjs` passou novamente. `git diff --check`
passou. `validate-pscpp-editorial-evidence.mjs` segue falhando corretamente:
0/14.086 ocorrências aprovadas; merge não permitido. Nenhum texto de questão
ativa ou pipeline de execução foi alterado neste lote histórico; build anterior
não é apresentado como nova execução. Relatório vigente do benchmark em
`BENCHMARK_REVISAO_INTEGRAL.md`, separado do checkpoint estrutural anterior.

Fonte baseline: `012b562b0eb6f7fec78773b339e4a53b3643e791`.
No checkpoint inicial abaixo não havia alteração de conteúdo; os lotes acima
registram a evolução posterior sem reescrever resultados antigos.

| Verificação | Antes | Após correção de integração |
|---|---|---|
| Geração PSCPP | 1.984; 254 históricas preservadas | 1.984; 254 históricas preservadas |
| Geração cadernos | 12.204 ocorrências | 12.102 ocorrências |
| `validate-runtime-question-banks.mjs` | Falha: ID repetido AN-C09-91-M1 | Passou; 12.102 registros |
| `validate-pscpp-exam-selection.mjs` | Passou | Passou; matriz fixa e rejeição de falta de diversidade |
| `test-question-source-provenance.mjs` | Teste novo | Passou; precedência e hash transitivo |
| `validate-editorial-runtime.mjs` | Falha: 77 candidatos por localizador | Mesma falha, não suprimida |
| `test-notebook-complete-stems.mjs` | Dependência React ainda não instalada | Falha: combinação sem proposições em ANV-0005 |
| `npm run build` | Não executado no baseline separado | Passou; compilação, lint/tipos e páginas estáticas |
| `validate-pscpp-editorial-evidence.mjs` | Gate novo | Falha esperada: 0/14.086 ocorrências aprovadas |

Os avisos preexistentes do autoprefixer sobre `end`/`flex-end` permanecem.
Dependências instaladas com `npm ci --ignore-scripts --no-audit --no-fund`.
Não houve alteração do lockfile nem supressão/relaxamento de testes existentes.

Comando de teste de integração:

`node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs`

O teste estrutural legado emite diagnóstico, mas não possui saída de falha
para todos os achados; seu sucesso isolado não constitui gate editorial.
Uma triagem complementar registrou 256 candidatos com alternativas combinadas
sem bloco de proposições reconhecido e 77 por localizador. Esses conjuntos
podem conter falsos positivos e exigem inspeção individual, não reescrita em massa.

Exemplo confirmado de transformação inadequada: ANV-0005 contém proposições
no arquivo original, porém a versão efetiva exibe um comando genérico sem elas.
A restauração/normalização deve ser auditada junto com o conteúdo, evitando
restaurar uma versão antiga sem conferir sua correção bibliográfica.

## SQL e infraestrutura

Conexão observada: projeto `shy-firefly-80833334`, branch `br-odd-leaf-b6n3spx7`
(`production`). Somente duas consultas SELECT a `information_schema.columns`.
Resultados de schema em `SCHEMA_QUESTOES.json` e `COLUNAS_JSON_SQL.json`.
Tabelas de respostas, sessões e cadernos armazenam referências; não foi
identificada uma tabela de enunciados pela inspeção de nomes/colunas. Isso
não substitui a reconciliação de todos os consumidores e payloads.
Não foram coletados valores pessoais ou credenciais, nem realizadas migrações.

Projeto Vercel observado: `estibordo-pscpp`; baseline de produção
`dpl_rRAELJq5jYiofCKZriDuVdLvaonf`, estado READY, mesmo SHA de main.
Esse estado precede a auditoria e não comprova deploy desta branch.
Não houve merge, release de auditoria ou smoke test autenticado.
