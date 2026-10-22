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

## Lote 007 — ANV-0043/0044/0045

Base 155fafeb. Fonte normativa oficial consultada em 21/10/2026 e páginas de
Arte Naval conferidas; relatório REVISAO_ARTE_NAVAL_LOTE_007.md.

| Verificação executada | Resultado |
|---|---|
| generate:question-banks | Passou, 12.102 registros |
| npm run build, insumos finais | Passou, compilação, lint/tipos, 101 páginas; hashes dos três arquivos fonte estáveis |
| test-pscpp-audit-anv0005.mjs, após build | Passou, 14 deltas exatos; 56 proposições no HTML; texto/explicação iguais às fontes; 12.088 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, IDs únicos em 12.102 cadernos |
| validate-pscpp-exam-selection.mjs | Passou, matriz fixa e diversidade disponível |
| test-question-source-provenance.mjs, após patch tardio/build | Passou, precedência e fingerprints transitivos |
| check:pscpp-bank | Passou, 1.984, incluindo 254 históricas |
| audit-pscpp-runtime-inventory.mjs, revisão final | Passou; contagens 27.435 / 14.086 / 13.715 preservadas |
| audit-pscpp-runtime-triage.mjs | 241 candidatos sem proposições e 77 de localizador |
| test-notebook-complete-stems.mjs, após build | Falha esperada em ANV-0046, combinação sem proposições |
| validate-editorial-runtime.mjs | Falha nos mesmos 77 localizadores de legislação |
| validate-pscpp-editorial-evidence.mjs | Saída 2, 0/14.086 aprovações; merge proibido |
| git diff --check | Passou |

Foi necessário sincronizar os dois enunciados em notebook-complete-stems,
pois o patch tardio substituía os textos recém-revisados. O teste geral antes
falhou no hash da explicação de ANV-0044: snapshot legado era de correção só
do enunciado. Para revisões primárias documentadas, agora exige hash integral
exato do registro e igualdade com texto/explicação da fonte; demais itens
mantêm a exigência do snapshot legado. A regressão dedicada ganhou a mesma
verificação de identidade fonte/runtime em todos os 14 itens. Nenhuma falha
editorial foi suprimida nem item excluído; a falha geral avançou para ANV-0046.

Uma primeira consulta à regressão ocorreu antes do término da geração e leu
o snapshot antigo: falhou por divergência de deltas. Foi descartada como
validação e repetida após término, sem alteração de critérios. Um primeiro
build passou antes de sincronizar o patch tardio; o build final foi executado
novamente com esses insumos definitivos. Avisos preexistentes de autoprefixer
e configuração npm preservados. Logs privados preservam todas as tentativas.
Sem merge, deploy de auditoria ou alteração de dados de usuários.

## Lote 008 — ANV-0046

Base 9664750e; revisão primária em REVISAO_ARTE_NAVAL_LOTE_008.md.

| Verificação executada | Resultado |
|---|---|
| generate:question-banks | Passou, 12.102 registros |
| npm run build | Passou, compilação, lint/tipos e 101 páginas; hashes fonte estáveis |
| test-pscpp-audit-anv0005.mjs, antes e após build | Passou, 15 deltas exatos, 60 proposições no HTML, igualdade fonte/runtime e combinação única; 12.087 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, 12.102 registros, IDs únicos |
| validate-pscpp-exam-selection.mjs | Passou, matriz fixa |
| test-question-source-provenance.mjs | Passou, precedência e fingerprints transitivos |
| check:pscpp-bank | Passou, 1.984 registros, incluindo 254 históricas |
| audit-pscpp-runtime-inventory.mjs | Passou, 27.435 físicos / 14.086 ocorrências / 13.715 IDs |
| audit-pscpp-runtime-triage.mjs | 240 candidatos sem proposições e 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada em ANV-0047, combinação sem proposições |
| validate-editorial-runtime.mjs | Falha preservada, mesmos 77 localizadores |
| validate-pscpp-editorial-evidence.mjs, após inventário concluído | Saída 2; 0/14.086 aprovações; merge proibido |

A primeira consulta ao gate ocorreu durante a escrita do inventário e não foi
usada como evidência final; repetida após término da geração. Não houve alteração
de critérios nem supressão de testes. Build mantém os avisos preexistentes de npm
http-proxy e autoprefixer. Logs privados em audit-private/lote008.
Push de terminal indisponível por ausência de credencial HTTPS; publicação pela
integração GitHub, com verificação de blobs/árvore e ref sem force.
Sem merge, deploy desta auditoria ou alteração de dados de usuários.

## Lote 009 — ANV-0047

Base a5d849fa; revisão primária em REVISAO_ARTE_NAVAL_LOTE_009.md.

| Verificação executada | Resultado |
|---|---|
| generate:question-banks | Passou, 12.102 questões |
| npm run build | Passou, compilação, lint/tipos e 101 páginas; hashes fonte estáveis |
| test-pscpp-audit-anv0005.mjs, antes e após build | Passou, 16 deltas exatos, 64 proposições no HTML, combinação única e igualdade fonte/runtime; 12.086 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, 12.102 questões com IDs únicos |
| validate-pscpp-exam-selection.mjs | Passou, matriz fixa |
| test-question-source-provenance.mjs | Passou, precedência e fingerprints transitivos |
| check:pscpp-bank | Passou, 1.984 questões, 254 históricas |
| test-notebook-complete-stems.mjs | Falha preservada, próxima ANV-0048 |
| validate-editorial-runtime.mjs | Falha preservada nos mesmos 77 localizadores |

Nenhum teste, normalizador ou critério foi relaxado. Inspeção visual de duas páginas
primárias e leitura dos vizinhos semânticos registradas no relatório do lote.
Logs privados em audit-private/lote009. Avisos preexistentes npm http-proxy e
autoprefixer mantidos. Sem merge, deploy da auditoria ou alteração de usuários.

Inventário regenerado após término do build: 27.435 registros físicos, 14.086
ocorrências e 13.715 IDs preservados. Triagem: 239 candidatos sem proposições e
77 localizadores. Gate de evidência executado depois do inventário: saída 2,
0/14.086 aprovações, merge_permitted=false. git diff --check passou.

## Lote 010 — ANV-0048

Base cd0a7ba6; evidência primária em REVISAO_ARTE_NAVAL_LOTE_010.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks | Passou, 12.102 questões |
| npm run build | Passou, compilação, lint/tipos e 101 páginas; hashes das três fontes estáveis |
| test-pscpp-audit-anv0005.mjs, antes e após build | Passou, 17 deltas exatos, 68 proposições no HTML, combinação única e igualdade fonte/runtime; 12.085 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, 12.102 questões com IDs únicos |
| validate-pscpp-exam-selection.mjs | Passou, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, precedência e fingerprints |
| check:pscpp-bank | Passou, 1.984 questões, 254 históricas |
| audit-pscpp-runtime-inventory.mjs | Passou, 27.435 físicos / 14.086 ocorrências / 13.715 IDs |
| audit-pscpp-runtime-triage.mjs | 238 candidatos sem proposições, 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada, próxima ANV-0049 |
| validate-editorial-runtime.mjs | Falha preservada, 77 localizadores |
| validate-pscpp-editorial-evidence.mjs, após inventário concluído | Saída 2, 0/14.086 aprovações, merge_permitted=false |

Nenhum teste ou critério relaxado. Tentativa inicial de edição usou diretório
incorreto e falhou antes de escrever; a geração sem alteração subsequente não foi
usada como evidência da correção. Edição aplicada no diretório correto e geração
repetida antes dos testes. Logs privados em audit-private/lote010. Avisos
preexistentes npm http-proxy e autoprefixer mantidos. Sem merge, deploy desta
auditoria ou alterações de usuários. git diff --check passou.

## Lote 011 — ANV-0049

Base c9ef6710; fonte primária e inspeção visual em REVISAO_ARTE_NAVAL_LOTE_011.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks | Passou, 12.102 questões |
| npm run build | Passou, compilação, lint/tipos e 101 páginas |
| test-pscpp-audit-anv0005.mjs, após geração concluída e após build | Passou, 18 deltas exatos, 72 proposições no HTML, combinação única e igualdade fonte/runtime; 12.084 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, 12.102 questões com IDs únicos |
| validate-pscpp-exam-selection.mjs | Passou, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, precedência e fingerprints |
| check:pscpp-bank | Passou, 1.984 questões, 254 históricas |
| test-notebook-complete-stems.mjs | Falha preservada, próxima ANV-0050 |
| validate-editorial-runtime.mjs | Falha preservada, 77 localizadores |

Uma tentativa inicial de regressão leu o snapshot antes de a geração terminar e
falhou por conteúdo desatualizado. Não foi usada como validação; o hash provisório
foi substituído pelo efetivo, e a regressão repetida após término da geração
passou antes e depois do build. Nenhum teste ou critério foi relaxado.
Logs privados em audit-private/lote011; avisos preexistentes npm http-proxy e
autoprefixer preservados. Sem merge, deploy da auditoria ou alteração de usuários.

Inventário regenerado após build: 27.435 físicos / 14.086 ocorrências / 13.715 IDs.
Triagem: 237 candidatos sem proposições e 77 localizadores. Gate de evidência
executado após término do inventário: saída 2, 0/14.086 aprovações e
merge_permitted=false. git diff --check passou.

## Lote 012 — ANV-0050

Base a2cae00a; fonte e inspeção visual em REVISAO_ARTE_NAVAL_LOTE_012.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks | Passou, 12.102 questões |
| npm run build | Passou, compilação, lint/tipos e 101 páginas |
| test-pscpp-audit-anv0005.mjs, após geração e após build | Passou: 19 deltas exatos, 76 proposições no HTML, combinação única e igualdade fonte/runtime; 12.083 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, 12.102 IDs únicos |
| validate-pscpp-exam-selection.mjs | Passou, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, precedência/fingerprints |
| check:pscpp-bank | Passou, 1.984 questões e 254 históricas |
| audit-pscpp-runtime-inventory.mjs | Passou, 27.435 físicos / 14.086 ocorrências / 13.715 IDs |
| audit-pscpp-runtime-triage.mjs | 236 candidatos sem proposições e 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada, próxima ANV-0064 |
| validate-editorial-runtime.mjs | Falha preservada nos 77 localizadores |
| validate-pscpp-editorial-evidence.mjs | Saída 2: 0/14.086 aprovações; merge_permitted=false |

Primeiro log de validate-editorial-runtime ficou vazio apesar da saída 1; repetição
isolada confirmou o erro de localizadores e registrou lista completa. Nenhum
critério foi relaxado. Logs privados em audit-private/lote012. Avisos npm e
autoprefixer preexistentes mantidos. git diff --check passou. Sem merge, deploy
desta auditoria ou alterações de usuários.

## Lote 013 — ANV-0064

Base 04e99e5f; fonte, imagem e julgamento em REVISAO_ARTE_NAVAL_LOTE_013.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks, após ajuste final | Passou, 12.102 questões |
| test-pscpp-audit-anv0005.mjs | Passou: 20 deltas exatos, 80 proposições no HTML real, combinação única, igualdade fonte/runtime; 12.082 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, 12.102 questões com IDs únicos |
| validate-pscpp-exam-selection.mjs | Passou, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, precedência e fingerprints |
| check:pscpp-bank | Passou, 1.984 questões e 254 históricas |
| audit-pscpp-runtime-inventory.mjs | Passou, 27.435 físicos / 14.086 ocorrências / 13.715 IDs |
| audit-pscpp-runtime-triage.mjs | 235 candidatos sem proposições e 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada, próxima ANV-0067 |
| validate-editorial-runtime.mjs | Falha preservada, 77 localizadores |
| validate-pscpp-editorial-evidence.mjs | Saída 2, 0/14.086 aprovações; merge_permitted=false |

A primeira redação ainda sofreu normalização por sobreposição lexical com a
alternativa de combinação. A regressão detectou a remoção; essa tentativa não
foi aceita. Redação ajustada sem alterar o normalizador, critérios ou gabarito,
geração concluída e hash efetivo recalculado; regressão repetida passou.
Build com insumos provisórios interrompido; build com redação final compilou e
gerou 101 páginas, mas saiu 1 no cleanup ENOTEMPTY em .next/export/_next.
Saída preservada fora do repositório; nova tentativa com .next limpa documentada
abaixo. Inventário repetido após log inicialmente incompleto para registrar saída
explícita 0. Logs privados em audit-private/lote013. Nenhum teste relaxado.
Temporários preexistentes preservados. Sem merge, deploy desta auditoria ou
alterações de usuários.

Build com .next limpa passou, saída explícita 0: compilação, lint/tipos e 101 páginas. Regressão após build passou novamente, 20 deltas e 80 proposições renderizadas. Avisos preexistentes npm http-proxy e autoprefixer preservados. git diff --check passou.

## Lote 014 — ANV-0067 e ANV-0765

Base 232582b5; fonte e imagens em REVISAO_ARTE_NAVAL_LOTE_014.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks, após edição concluída | Passou, saída 0, 12.102 questões |
| npm run build, .next anterior preservada fora do repositório | Passou, saída 0, compilação, lint/tipos e 101 páginas |
| test-pscpp-audit-anv0005.mjs, antes e após build | Passou, saída 0, 22 deltas exatos, 84 proposições no HTML, cinco opções diretas preservadas pelo adaptador, enunciado direto no HTML, combinação única e igualdade fonte/runtime; 12.080 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, saída 0, 12.102 questões com IDs únicos |
| validate-pscpp-exam-selection.mjs | Passou, saída 0, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, saída 0, precedência e fingerprints |
| check:pscpp-bank | Passou, saída 0, 1.984 questões e 254 históricas |
| audit-pscpp-runtime-inventory.mjs | Passou, saída 0, 27.435 físicos / 14.086 ocorrências / 13.715 IDs |
| audit-pscpp-runtime-triage.mjs | 234 candidatos sem proposições e 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada, saída 1, próxima ANV-0068 |
| validate-editorial-runtime.mjs | Falha preservada, saída 1, 77 localizadores |
| validate-pscpp-editorial-evidence.mjs, após inventário concluído | Saída 2, 0/14.086 aprovações; merge_permitted=false |

Primeiro script de edição falhou por ausência de provenance na vizinha antes de
gravar as fontes. A geração sem alterações subsequente não foi evidência de
correção. Script ajustado para preservar/criar o objeto existente quando necessário,
editação concluída e geração repetida. Redações finais conferidas contra o
normalizador antes da geração; nenhuma regra relaxada. A regressão ganhou contrato
explícito para a questão direta ANV-0765; contratos combinados e gates mantidos.
Avisos preexistentes npm http-proxy e autoprefixer preservados. Logs privados em
audit-private/lote014. git diff --check passou. Sem merge, deploy desta auditoria
ou alterações de usuários. Temporários preexistentes preservados.

## Lote 015 — ANV-0068

Base 02fbe012; fonte, páginas e imagem em REVISAO_ARTE_NAVAL_LOTE_015.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks | Passou, saída 0, 12.102 questões |
| test-pscpp-audit-anv0005.mjs, após geração concluída | Passou, saída 0, 23 deltas exatos, 88 proposições no HTML, cinco opções diretas anteriores preservadas; igualdade fonte/runtime e combinação única; 12.079 outros cadernos e 1.984 PSCPP preservados |
| validate-runtime-question-banks.mjs | Passou, saída 0, 12.102 questões com IDs únicos |
| validate-pscpp-exam-selection.mjs | Passou, saída 0, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, saída 0, precedência e fingerprints |
| check:pscpp-bank | Passou, saída 0, 1.984 questões e 254 históricas |
| audit-pscpp-runtime-triage.mjs | Passou, 233 candidatos sem proposições e 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada, saída 1, próxima ANV-0073 |
| validate-editorial-runtime.mjs | Falha preservada, saída 1, 77 localizadores |

Nenhum normalizador ou teste alterado neste lote. Redação final conferida contra
o normalizador antes da geração. Não se assumiu a próxima questão pelo número
sequencial: o teste confirmou ANV-0073. Logs privados em audit-private/lote015.
Avisos preexistentes npm http-proxy/autoprefixer preservados. Temporários
preexistentes e .next anterior preservados. Sem merge, deploy desta auditoria ou
alterações de usuários. Resultados finais de build, inventário e gate abaixo.

Build completo com .next limpa passou, saída 0: compilação, lint/tipos e 101 páginas.
Regressão após build passou novamente, saída 0, 23 deltas exatos, 88 proposições
no HTML e cinco opções diretas anteriores preservadas. Inventário passou com
saída 0: 27.435 físicos, 14.086 ocorrências, 13.715 IDs. Gate executado após
inventário concluído: saída 2, 0/14.086 aprovações, merge_permitted=false.
git diff --check passou. Isso não aprova editorialmente o banco.

## Lote 016 — ANV-0073

Base 0ddb25e0; fonte, páginas e figuras em REVISAO_ARTE_NAVAL_LOTE_016.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks | Passou, saída 0, 12.102 questões |
| test-pscpp-audit-anv0005.mjs, após geração concluída | Passou, saída 0, 24 deltas exatos, 92 proposições no HTML, cinco opções diretas anteriores preservadas; igualdade fonte/runtime e combinação única; 12.078 outros cadernos e 1.984 PSCPP preservados |
| validate-pscpp-exam-selection.mjs | Passou, saída 0, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, saída 0, precedência e fingerprints |
| check:pscpp-bank | Passou, saída 0, 1.984 questões e 254 históricas |
| audit-pscpp-runtime-triage.mjs | Passou, 232 candidatos sem proposições e 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada, saída 1, próxima ANV-0076 |
| validate-editorial-runtime.mjs | Falha preservada, saída 1, 77 localizadores |

Nenhum normalizador ou teste alterado neste lote. Redação final conferida contra
o normalizador antes da geração. Logs privados em audit-private/lote016.
Avisos preexistentes npm http-proxy/autoprefixer preservados. Temporários
preexistentes e .next anterior preservados. Sem merge, deploy desta auditoria ou
alterações de usuários. Resultados finais de build, inventário e gate abaixo.

Build completo com .next limpa passou, saída 0: compilação, lint/tipos e 101 páginas.
Regressão após build passou novamente, saída 0, 24 deltas exatos, 92 proposições
no HTML e cinco opções diretas anteriores preservadas. Validação de runtime
passou, saída 0, com 12.102 questões e IDs únicos. Inventário passou, saída 0:
27.435 físicos, 14.086 ocorrências, 13.715 IDs. Gate após inventário concluído:
saída 2, 0/14.086 aprovações, merge_permitted=false. git diff --check passou.
Isso não aprova editorialmente o banco.

## Lote 017 — ANV-0076

Base 44bfc1e1; fonte e imagem em REVISAO_ARTE_NAVAL_LOTE_017.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks | Passou, saída 0, 12.102 questões |
| test-pscpp-audit-anv0005.mjs, após geração concluída | Passou, saída 0, 25 deltas exatos, 96 proposições no HTML, cinco opções diretas anteriores preservadas; igualdade fonte/runtime e combinação única; 12.077 outros cadernos e 1.984 PSCPP preservados |
| validate-pscpp-exam-selection.mjs | Passou, saída 0, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, saída 0, precedência e fingerprints |
| audit-pscpp-runtime-triage.mjs | Passou, 231 candidatos sem proposições e 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada, saída 1, próxima ANV-0085 |
| validate-editorial-runtime.mjs | Falha preservada, saída 1, 77 localizadores |

Nenhum normalizador ou teste alterado neste lote. Redação final conferida contra
o normalizador antes da geração. Logs privados em audit-private/lote017.
Avisos preexistentes npm http-proxy/autoprefixer preservados. Temporários
preexistentes e .next anterior preservados. Sem merge, deploy desta auditoria ou
alterações de usuários. Resultados finais de build, inventário e gate abaixo.

A primeira execução de build saiu 0 mas o log disponível terminou na geração do
catálogo; não foi aceito isoladamente como prova de build completo. Repetição
com mesmos insumos passou, saída 0, registrando compilação, lint/tipos, 101 páginas
e tabela final de rotas (build-confirm.log). Regressão posterior passou, saída 0:
25 deltas exatos, 96 proposições no HTML e cinco opções diretas anteriores
preservadas. Validação de runtime passou, saída 0, 12.102 questões com IDs únicos.
check:pscpp-bank passou, saída 0, 1.984 questões e 254 históricas. Inventário passou,
saída 0: 27.435 físicos, 14.086 ocorrências, 13.715 IDs. Gate após inventário:
saída 2, 0/14.086 aprovações, merge_permitted=false. git diff --check passou.
Isso não aprova editorialmente o banco.
