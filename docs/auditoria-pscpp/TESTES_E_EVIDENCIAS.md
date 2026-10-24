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

## Lote 018 — ANV-0085

Base bcd4a7db; fonte e imagem em REVISAO_ARTE_NAVAL_LOTE_018.md.

| Verificação | Resultado real |
|---|---|
| generate:question-banks | Passou, saída 0, 12.102 questões |
| test-pscpp-audit-anv0005.mjs, após geração concluída | Passou, saída 0, 26 deltas exatos, 100 proposições no HTML, cinco opções diretas anteriores preservadas; igualdade fonte/runtime e combinação única; 12.076 outros cadernos e 1.984 PSCPP preservados |
| validate-pscpp-exam-selection.mjs | Passou, saída 0, matriz fixa 25/25/10/10/10/10/10 |
| test-question-source-provenance.mjs | Passou, saída 0, precedência e fingerprints |
| check:pscpp-bank | Passou, saída 0, 1.984 questões e 254 históricas |
| audit-pscpp-runtime-triage.mjs | Passou, 230 candidatos sem proposições e 77 localizadores |
| test-notebook-complete-stems.mjs | Falha preservada, saída 1, próxima ANV-0092 |
| validate-editorial-runtime.mjs | Falha preservada, saída 1, 77 localizadores |

Nenhum normalizador ou teste alterado neste lote. Redação final conferida contra
o normalizador antes da geração. Logs privados em audit-private/lote018.
Avisos preexistentes npm http-proxy/autoprefixer preservados. Temporários
preexistentes e .next anterior preservados. Sem merge, deploy desta auditoria ou
alterações de usuários. Resultados finais de build, inventário e gate abaixo.

A primeira execução de build saiu 0 mas seu log terminou após o banner Next;
não foi aceita isoladamente como prova de build completo. A confirmação ficou
sem avanço após o banner, com processo Next ainda ativo; encerrada somente essa
árvore de processos do lote, preservando .next fora do repositório. Nova tentativa
com .next limpa e NEXT_TELEMETRY_DISABLED=1 passou, saída 0: compilação, lint/tipos,
101 páginas e tabela final de rotas (build-clean-confirm.log). Não se conclui que
a telemetria tenha sido a causa, nem se alteraram código ou critérios de teste.
Regressão após build passou, saída 0: 26 deltas exatos, 100 proposições no HTML
e cinco opções diretas anteriores preservadas. Validação de runtime passou, saída
0, 12.102 questões e IDs únicos. Inventário passou, saída 0: 27.435 físicos,
14.086 ocorrências, 13.715 IDs. Gate após inventário concluído: saída 2,
0/14.086 aprovações, merge_permitted=false. git diff --check passou.
Isso não aprova editorialmente o banco.

## Lote 019 — resultados executados

- `npm run generate:question-banks`: exit 0, 12.102 questões.
- `scripts/test-pscpp-audit-anv0005.mjs`: exit 0 antes/depois do build; 29
  deltas exatos desde a base congelada, IDs preservados, 12.073 outras
  ocorrências dos cadernos e 1.984 PSCPP sem alteração, 104 proposições no HTML
  real, 15 opções diretas preservadas pelo adaptador e cálculo 100→126 = 26%.
- `scripts/validate-runtime-question-banks.mjs`: exit 0.
- `scripts/validate-pscpp-exam-selection.mjs`: exit 0, matriz fixa preservada.
- `scripts/test-question-source-provenance.mjs`: exit 0.
- `npm run check:pscpp-bank`: exit 0; 1.984 questões, 254 históricas observadas
  preservadas; essa mensagem do gerador não comprova correção técnica atual.
- `scripts/test-notebook-complete-stems.mjs`: exit 1, próxima falha ANV-0096;
  não relaxado.
- `scripts/validate-editorial-runtime.mjs`: exit 1, mesmos 77 localizadores.
- `scripts/audit-pscpp-runtime-triage.mjs`: exit 0, 229/77 candidatos.
- `scripts/audit-pscpp-runtime-inventory.mjs`: exit 0; 27.435 registros físicos,
  14.086 ocorrências efetivas/13.715 IDs; inventários e manifesto regenerados.
- `scripts/validate-pscpp-editorial-evidence.mjs`: exit 2, 0 aceitos / 14.086
  pendentes ou inválidos; GATE_EVIDENCIAS regenerado, merge_permitted=false.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: duas tentativas no workspace
  saíram 1 após compilação, lint/types e 101 páginas: ENOTEMPTY removendo
  .next/export (500.html presente). Saídas preservadas, incluindo .next anterior.
  Build completo da cópia isolada em /tmp saiu 0, com compilação, lint/types,
  101 páginas e tabela de rotas. Todos os arquivos rastreados foram comparados
  byte a byte com a origem; seis artefatos gerados (bancos, catálogo, facetas,
  escopo e flashcards) também idênticos. Nenhuma causa interna do erro de
  limpeza foi comprovada. Avisos não bloqueantes npm http-proxy e autoprefixer
  end/flex-end registrados. Regressão final após esse build saiu 0.

Scripts Node executados com `--no-warnings --experimental-loader
./scripts/pscpp-json-loader.mjs`. Contrato direto da regressão estendido somente
aos dois IDs documentados; cálculo e preservação das alternativas acrescentados.
Nenhuma mudança de normalizador ou redução de gates. Verdade primária depende
da leitura; testes não equivalem à rechecagem editorial independente.

## Lote 020 — resultados executados

- `npm run validate:question-catalog`: exit 0; catálogo/filtros/escopos válidos.

- `npm run generate:question-banks`: exit 0; 12.102 questões.
- `scripts/test-pscpp-audit-anv0005.mjs`: exit 0 antes/depois do build; 33
  deltas exatos desde a base congelada, 112 proposições no HTML real e 25
  opções diretas preservadas pelo adaptador; 12.069 outros cadernos e 1.984
  PSCPP sem alteração efetiva. Contrato direto inclui expressamente 0794/0795.
- `scripts/validate-runtime-question-banks.mjs`: exit 0, 12.102/IDs únicos.
- `scripts/validate-pscpp-exam-selection.mjs`: exit 0, matriz fixa preservada.
- `scripts/test-question-source-provenance.mjs`: exit 0.
- `npm run check:pscpp-bank`: exit 0, 1.984 questões/254 históricas; mensagem
  de fidelidade do gerador não comprova correção técnica atual.
- `scripts/test-notebook-complete-stems.mjs`: exit 1, próxima ANV-0100;
  critério não relaxado. `scripts/validate-editorial-runtime.mjs`: exit 1,
  mesmos 77 localizadores.
- `scripts/audit-pscpp-runtime-triage.mjs`: exit 0, 227/77 candidatos.
- `scripts/audit-pscpp-runtime-inventory.mjs`: exit 0; 27.435 físicos, 14.086
  ocorrências e 13.715 IDs; 33 hashes corrigidos comparados ao inventário.
- `scripts/validate-pscpp-editorial-evidence.mjs`: exit 2 depois do inventário;
  0 aceitos/14.086 pendentes ou inválidos, merge_permitted=false.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: exit 0 na cópia isolada /tmp;
  compilação, lint/types, 101 páginas e tabela de rotas confirmados.
  Usada cópia isolada devido à falha ENOTEMPTY do workspace registrada no
  lote 019; não se declarou resolvida essa falha. Todos os arquivos rastreados
  fora de docs/auditoria-pscpp comparados byte a byte com a origem.
- A primeira comparação pós-build identificou catálogo local ainda antigo;
  executados `npm run generate:question-catalog` e `npm run
  generate:flashcard-decks`, ambos exit 0. Seis artefatos gerados (dois bancos,
  catálogo, facetas, escopo e flashcards) comparados com igualdade binária
  após regeneração; nenhuma divergência aceita. Avisos não bloqueantes npm
  http-proxy e autoprefixer registrados no log de build.

Scripts Node executados com `--no-warnings --experimental-loader
./scripts/pscpp-json-loader.mjs`. Nenhum normalizador alterado ou gate reduzido.
Rechecagem editorial independente, deduplicação semântica global, programa
oficial e reconciliação offline/produção permanecem pendentes.

Após a leitura final do diff, a opção E de ANV-0794 passou a confundir metade
com um quarto do peso, evitando o valor fisicamente denunciador de peso total.
Geração local, catálogo, flashcards, inventário, gate e regressão repetidos;
build final repetido na cópia isolada com a fonte final estável. Build anterior
à sincronização desse refinamento não foi usado para certificar a versão final.

## Lote 021 — resultados executados

- `npm run generate:question-banks`: exit 0, 12.102 questões.
- `scripts/test-pscpp-audit-anv0005.mjs`: exit 0 antes/depois do build; 35
  deltas exatos desde a base congelada, igualdade fonte/runtime e IDs intactos;
  116 proposições no HTML real, 30 opções diretas preservadas pelo adaptador;
  12.067 outros cadernos e 1.984 PSCPP sem alteração efetiva.
- `scripts/validate-runtime-question-banks.mjs`: exit 0.
- `scripts/validate-pscpp-exam-selection.mjs`: exit 0, matriz fixa preservada.
- `scripts/test-question-source-provenance.mjs`: exit 0.
- `npm run check:pscpp-bank`: exit 0, 1.984 questões/254 históricas; mensagem
  do gerador sobre fidelidade não comprova correção técnica atual.
- `scripts/generate-runtime-question-catalog.mjs`,
  `scripts/generate-runtime-flashcard-decks.mjs` e
  `scripts/validate-runtime-question-catalog.mjs`: exit 0, catálogo/contagens/
  filtros completos e flashcards regenerados.
- `scripts/test-notebook-complete-stems.mjs`: exit 1, próxima ANV-0105.
  `scripts/validate-editorial-runtime.mjs`: exit 1, mesmos 77 localizadores.
  Critérios não relaxados.
- `scripts/audit-pscpp-runtime-triage.mjs`: exit 0, 226/77 candidatos.
- `scripts/audit-pscpp-runtime-inventory.mjs`: exit 0, 27.435 físicos/14.086
  ocorrências/13.715 IDs; 35 hashes corrigidos comparados ao inventário.
- `scripts/validate-pscpp-editorial-evidence.mjs`: exit 2 após inventário;
  zero aceitos/14.086 pendentes ou inválidos, merge_permitted=false.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: confirmação na cópia isolada
  saiu 0 com compilação, lint/types, 101 páginas e tabela de rotas. Primeiro
  exit 0 tinha log incompleto após os geradores e não foi aceito como prova
  de build completo. Logs preservados. Falha ENOTEMPTY do workspace observada
  no lote 019 não declarada resolvida; usada cópia isolada /tmp.
- Fontes/data/config rastreados fora dos relatórios e seis artefatos gerados
  (bancos, catálogo, facetas, escopo e flashcards) idênticos byte a byte entre
  origem e cópia. Avisos não bloqueantes npm http-proxy/autoprefixer registrados.

Scripts Node com `--no-warnings --experimental-loader
./scripts/pscpp-json-loader.mjs`. Contrato direto da regressão inclui somente
o novo ID documentado ANV-0798; nenhum normalizador alterado. Correção
bibliográfica parcial não é rechecagem editorial independente nem aprovação
programática, semântica global ou de release.

## Lote 022 — resultados executados

- `npm run generate:question-banks`: exit 0, 12.102 questões.
- `scripts/test-pscpp-audit-anv0005.mjs`: exit 0 antes/depois do build; 37
  deltas exatos desde a base congelada; igualdade fonte/runtime, IDs intactos;
  120 proposições no HTML real e 35 opções diretas preservadas pelo adaptador;
  12.065 outros cadernos e 1.984 PSCPP sem alteração efetiva.
- `scripts/validate-runtime-question-banks.mjs`: exit 0.
- `scripts/validate-pscpp-exam-selection.mjs`: exit 0, matriz fixa preservada.
- `scripts/test-question-source-provenance.mjs`: exit 0.
- `npm run check:pscpp-bank`: exit 0, 1.984 questões/254 históricas; mensagem
  de fidelidade do gerador não comprova correção técnica atual.
- `scripts/generate-runtime-question-catalog.mjs`,
  `scripts/generate-runtime-flashcard-decks.mjs` e
  `scripts/validate-runtime-question-catalog.mjs`: exit 0, catálogo/filtros/
  contagens válidos e flashcards regenerados.
- `scripts/test-notebook-complete-stems.mjs`: exit 1, próxima ANV-0108;
  `scripts/validate-editorial-runtime.mjs`: exit 1, mesmos 77 localizadores.
- `scripts/audit-pscpp-runtime-triage.mjs`: exit 0, 225/77 candidatos.
- `scripts/audit-pscpp-runtime-inventory.mjs`: exit 0, 27.435 físicos/14.086
  ocorrências/13.715 IDs; 37 hashes corrigidos conferidos no inventário.
- `scripts/validate-pscpp-editorial-evidence.mjs`: exit 2 após inventário;
  zero aceitos/14.086 pendentes ou inválidos, merge_permitted=false.
- Comparação das fontes físicas com HEAD comprovou alterações somente nos
  dois registros planejados; ANV-0105 principal permaneceu
  inalterada campo a campo com active=false, status=quarantined e demais campos. Corrigida
  apenas a restauração sobre descarga já consumida antes deste lote.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: exit 0 na cópia isolada /tmp;
  compilação, lint/types, 101 páginas e tabela de rotas confirmados. Falha
  ENOTEMPTY do workspace observada no lote 019 não declarada resolvida.
- Fontes/data/config rastreados fora dos relatórios e seis artefatos gerados
  (bancos, catálogo, facetas, escopo e flashcards) idênticos byte a byte entre
  origem e cópia. Avisos npm http-proxy, autoprefixer e serialização de avisos
  do cache Webpack registrados, sem impedir o build.

Scripts Node com `--no-warnings --experimental-loader
./scripts/pscpp-json-loader.mjs`. Contrato direto estendido somente a ANV-0803;
nenhum normalizador alterado, gate reduzido ou falha global suprimida.
Rechecagem editorial independente, programa/edital oficial, estados globais,
cobertura, unicidade semântica e offline/produção pendentes.


## Lote 023 — resultados efetivos

- Regressão antes/depois do build: exit 0, 39 deltas exatos, igualdade
  fonte/runtime, 124 proposições renderizadas e 40 opções diretas; 12.063
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto acrescido só 0806.
- Runtime e seleção de prova: exit 0; IDs e matriz fixa 100 em
  25/25/10/10/10/10/10 preservados. Proveniência/fingerprints: exit 0.
- check:pscpp-bank: exit 0, 1.984 questões e 254 históricas; mensagem do
  gerador não certifica correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0111.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 224/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs. Todos
  os 39 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. REVISOES_EDITORIAIS.jsonl sem aprovações inventadas.
- Diff físico confirmou somente ANV-0108 na restauração e 0806 no principal;
  todos os campos/flags da versão principal em quarentena de 0108 intactos.
- Primeira geração excluiu 0108 por falso localizador no normalizador;
  comando tornou explícito o objeto técnico. Nova geração preservou IDs e
  quatro proposições. Nenhum normalizador/política relaxado.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp,
  compilação, lint/types, 101 páginas e tabela de rotas. Fontes/data/config
  rastreados fora dos relatórios e seis artefatos gerados idênticos byte a byte.
  Falha ENOTEMPTY do workspace no lote 019 não declarada resolvida. Avisos
  npm http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Rechecagem independente, fonte/edital oficial, estados globais, cobertura,
unicidade semântica e offline/produção pendentes. Sem merge/deploy.


## Lote 024 — resultados efetivos

- Regressão antes/depois do build: exit 0, 41 deltas exatos, igualdade
  fonte/runtime, 128 proposições renderizadas e 45 opções diretas; 12.061
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto acrescido só 0809.
- Runtime e seleção: exit 0; IDs e matriz fixa 100 em 25/25/10/10/10/10/10
  preservados. Proveniência/fingerprints: exit 0.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0116.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 223/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs. Todos
  os 41 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Sem aprovações finais inventadas.
- Diff físico: somente ANV-0111 na restauração e 0809 no principal;
  versão principal divergente de 0111 e todos seus campos intactos.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp,
  compilação, lint/types, 101 páginas e tabela de rotas. Fontes/data/config
  rastreados fora dos relatórios e seis artefatos gerados idênticos byte a byte.
  ENOTEMPTY do workspace no lote019 não declarado resolvido. Avisos npm
  http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Nenhum normalizador/filtro/gate relaxado. Três modelos 12.70 preservados;
defeitos registrados sem conceder aprovação. Rechecagem independente, versão
oficial programa/edital, estados globais, cobertura, semântica e offline/produção
pendentes. Sem merge/deploy ou dados de usuários.


## Lote 025 — resultados efetivos

- Regressão antes/depois do build: exit 0, 44 deltas exatos, igualdade
  fonte/runtime, 132 proposições renderizadas e 55 opções diretas; 12.058
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto só +0814/0972.
- Runtime e seleção: exit 0; IDs e matriz fixa 100 em 25/25/10/10/10/10/10
  preservados. Proveniência/fingerprints: exit 0.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0125.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 222/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs. Todos
  os 44 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Nenhuma aprovação final inventada.
- Diff físico: somente ANV-0116 na restauração e 0814/0972 no principal;
  principal divergente de 0116 e todos os demais registros/campos intactos.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp,
  compilação, lint/types, 101 páginas e tabela de rotas. Fontes/data/config
  rastreados fora dos relatórios e seis artefatos gerados idênticos byte a byte.
  ENOTEMPTY do workspace no lote019 não declarado resolvido. Avisos npm
  http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Nenhum normalizador/filtro/gate relaxado. Grupo 12.70 do lote024 permanece
pendente, sem aprovação/check adicional. Rechecagem independente, programa/edital
oficial, estados globais, cobertura, semântica e offline/produção pendentes.
Sem merge/deploy ou dados de usuários.


## Lote 026 — resultados efetivos

- Regressão antes/depois do build: exit 0, 48 deltas exatos, igualdade
  fonte/runtime, 136 proposições renderizadas e 70 opções diretas; 12.054
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto só +0823/0975/1034.
- Runtime e seleção: exit 0; IDs e matriz fixa de 100 em 25/25/10/10/10/10/10
  preservados. Proveniência/fingerprints: exit 0.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0128.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 221/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs. Todos
  os 48 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Nenhuma aprovação final inventada.
- Diff físico: somente ANV-0125 na restauração e 0823/0975/1034 no principal;
  principal divergente de ANV-0125 e todos os demais registros/campos intactos.
- Primeira geração substituiu casos ANV-0975/1034 por sobreposição lexical;
  registro interrompido antes de gravar linhas incompletas. Redação ajustada,
  auditQuestion sem achados e nova geração/regressão preservando os casos.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp,
  compilação, lint/types, 101 páginas e tabela de rotas. Fontes/data/config
  rastreados fora dos relatórios e seis artefatos gerados idênticos byte a byte.
  ENOTEMPTY do workspace no lote019 não declarado resolvido. Avisos npm
  http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Nenhum normalizador/filtro/gate relaxado. Grupo 12.70 e pendência terminológica
do lote023 mantidos sem checks/aprovações adicionais. Rechecagem independente,
programa/edital oficial, estados, cobertura, semântica e offline/produção pendentes.
Sem merge/deploy ou dados de usuários.


## Lote 027 — resultados efetivos

- Regressão antes/depois do build final: exit 0, 51 deltas exatos, igualdade
  fonte/runtime, 140 proposições renderizadas e 80 opções diretas; 12.051
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto só +0826/0976.
- Runtime e seleção: exit 0; IDs e matriz fixa de 100 em 25/25/10/10/10/10/10
  preservados. Proveniência/fingerprints: exit 0.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0129.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 220/77.
- Inventário final: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs.
  Todos os 51 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário final: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Nenhuma aprovação final inventada.
- Diff físico: somente ANV-0128 na restauração e 0826/0976 no principal; principal
  divergente de ANV-0128 e todos os demais registros/campos intactos.
- Primeira geração excluiu ANV-0976 por falso positivo de continuidade/similaridade:
  snapshot 12.101 rejeitado pela regressão; registro abortado antes de gravar
  linhas incompletas. Comando ajustado, auditQuestion sem achados; geração,
  inventário e testes repetidos com 12.102. Primeiro build intermediário não
  serve de validação do lote; build final usou exclusivamente as fontes finais.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 final em cópia isolada /tmp,
  compilação, lint/types, 101 páginas e tabela de rotas. Fontes/data/config
  rastreados fora dos relatórios e seis artefatos gerados idênticos byte a byte.
  ENOTEMPTY do workspace no lote019 não declarado resolvido. Avisos npm
  http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Nenhum normalizador/filtro/gate relaxado. Grupo 12.70 e passagem terminológica
mantidos sem checks/aprovações adicionais. Rechecagem independente, programa/edital
oficial, estados, cobertura, semântica, offline/produção e revisão final de main
pendentes. PR informou mergeable=false no preflight; sem tentativa de merge/deploy.

Tentativa posterior com exit 0 mas log sem compilação foi rejeitada; wrapper
verificou explicitamente exit_zero/compiled/types/pages/routes=true na execução
completa repetida. Não se usou apenas o código de saída para declarar build.

Reconsulta de publicação no mesmo HEAD retornou mergeable=true; observação
inicial false mantida como histórico, sem inferir causa ou aprovar merge.


## Lote 028 — resultados efetivos

- Regressão antes/depois do build: exit 0, 53 deltas exatos, igualdade
  fonte/runtime, 144 proposições renderizadas e 85 opções diretas; 12.049
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto só +0827.
- Runtime e seleção: exit 0; IDs e matriz fixa 100 em 25/25/10/10/10/10/10
  preservados. Proveniência/fingerprints: exit 0.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0131.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 219/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs;
  todos os 53 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Nenhuma aprovação final inventada.
- Diff físico: somente 0129 na restauração e 0827 no principal; principal
  divergente 0129 e todos os demais registros/campos intactos, inclusive
  active=false/status=quarantined da versão física concorrente.
- auditQuestion sem achados e cadeia de transformações preservando os dois
  enunciados antes da geração; depois, igualdade efetiva pela regressão.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp.
  Wrapper verificou exit_zero/compiled/types/pages/routes=true: compilação,
  lint/types, 101 páginas e rotas confirmados, não só código de saída. Fontes/
  data/config rastreados fora dos relatórios e seis artefatos gerados idênticos
  byte a byte. ENOTEMPTY do workspace no lote019 não declarado resolvido.
  Avisos npm http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Nenhum normalizador/filtro/gate relaxado. Grupo 12.70 e demais achados mantidos
com seus limites, sem checks/aprovações adicionais. Rechecagem independente,
programa/edital oficial, estados, cobertura, semântica e offline/produção
pendentes. Sem merge/deploy ou dados de usuários.


## Lote 029 — resultados efetivos

- Regressão antes/depois do build: exit 0, 56 deltas exatos, igualdade
  fonte/runtime, 148 proposições renderizadas e 95 opções diretas; 12.046
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto só +0829/0977.
- Runtime, seleção e proveniência/fingerprints: exit 0; IDs e matriz fixa
  de 100 em 25/25/10/10/10/10/10 preservados.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0134.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 218/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs;
  todos os 56 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Nenhuma aprovação final inventada.
- Diff físico: somente 0131 na restauração e 0829/0977 no principal;
  principal concorrente 0131 e todos os demais registros/campos intactos.
  Flags ausentes não inferidas; estado de ativação efetivo inalterado.
- auditQuestion sem achados, política ativa e cadeia de transformações
  preservando integralmente os três objetos antes da geração; depois,
  igualdade efetiva pela regressão. Nenhum ID consta de notebook-complete-stems.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp.
  Wrapper verificou exit_zero/compiled/types/pages/routes=true: compilação,
  lint/types, 101 páginas e rotas confirmados, não só código de saída. Fontes/
  data/config rastreados fora dos relatórios e seis artefatos gerados idênticos
  byte a byte. ENOTEMPTY do workspace no lote019 não declarado resolvido.
  Avisos npm http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Nenhum normalizador/filtro/gate relaxado. Grupo 12.70 e demais achados mantidos
com seus limites, sem checks/aprovações adicionais. Rechecagem independente,
programa/edital oficial, estados, cobertura, semântica e offline/produção
pendentes. Sem merge/deploy ou dados de usuários.


## Lote 030 — resultados efetivos

- Regressão antes/depois do build: exit 0, 59 deltas exatos, igualdade
  fonte/runtime, 152 proposições renderizadas e 105 opções diretas; 12.043
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto só +0832/0978.
- Runtime, seleção e proveniência/fingerprints: exit 0; IDs e matriz fixa
  de 100 em 25/25/10/10/10/10/10 preservados.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0138.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 217/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs;
  todos os 59 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Nenhuma aprovação final inventada.
- Diff físico: somente 0134 na restauração e 0832/0978 no principal;
  principal concorrente 0134 e todos os demais registros/campos intactos.
  Flags ausentes não inferidas; estado de ativação efetivo inalterado.
- Pré-checagem 0978 acusou stem_answer_continuation por coincidência lexical;
  comando local ajustado com objeto explícito e eixo vertical antes da geração.
  auditQuestion final sem achados, política ativa e transformações preservando
  integralmente os três objetos; após geração, igualdade pela regressão.
  Nenhum dos três IDs consta de notebook-complete-stems.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp.
  Wrapper verificou exit_zero/compiled/types/pages/routes=true: compilação,
  lint/types, 101 páginas e rotas confirmados, não só código de saída. Fontes/
  data/config rastreados fora dos relatórios e seis artefatos gerados idênticos
  byte a byte. ENOTEMPTY do workspace no lote019 não declarado resolvido.
  Avisos npm http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Nenhum normalizador/filtro/gate relaxado. Grupo 12.70 e demais achados mantidos
com seus limites, sem checks/aprovações adicionais. Rechecagem independente,
programa/edital oficial, estados, cobertura, semântica e offline/produção
pendentes. Sem merge/deploy ou dados de usuários.


## Lote 031 — resultados efetivos

- Regressão antes/depois do build: exit 0, 61 deltas exatos, igualdade
  fonte/runtime, 156 proposições renderizadas e 110 opções diretas; 12.041
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto só +0836.
- Runtime, seleção e proveniência/fingerprints: exit 0; IDs e matriz fixa
  de 100 em 25/25/10/10/10/10/10 preservados.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, próxima ANV-0142.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 216/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs;
  todos os 61 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Nenhuma aprovação final inventada.
- Diff físico: somente 0138 na restauração e 0836 no principal;
  principal concorrente 0138 e todos os demais registros/campos intactos.
  Flags ausentes não inferidas; estado de ativação efetivo inalterado.
- auditQuestion sem achados, política ativa e transformações preservando
  integralmente os dois objetos antes da geração; depois, igualdade pela
  regressão. Nenhum dos dois IDs consta de notebook-complete-stems.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp.
  Wrapper verificou exit_zero/compiled/types/pages/routes=true: compilação,
  lint/types, 101 páginas e rotas confirmados, não só código de saída. Fontes/
  data/config rastreados fora dos relatórios e seis artefatos gerados idênticos
  byte a byte. ENOTEMPTY do workspace no lote019 não declarado resolvido.
  Avisos npm http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Comando 0836 esclarecido para uma única curva fechada após regressão/build
iniciais passarem. Geração/hashes/regressão/catálogo/build repetidos para
redação final; build inicial preservado como intermediário.
Divergência visual sumário/corpo 12.80/12.81 registrada, sem inferir errata ou
renumerar modelos. Nenhum normalizador/filtro/gate relaxado. Grupo 12.70 e
demais achados mantidos com seus limites, sem checks/aprovações adicionais.
Rechecagem independente, programa/edital oficial, estados, cobertura, semântica
e offline/produção pendentes. Sem merge/deploy ou dados de usuários.


## Lote 032 — resultados efetivos

- Regressão antes/depois do build: exit 0, 64 deltas exatos, igualdade
  fonte/runtime, 160 proposições renderizadas e 120 opções diretas; 12.038
  outros cadernos e 1.984 PSCPP inalterados. Contrato direto só +0841/0981.
- Runtime, seleção e proveniência/fingerprints: exit 0; IDs e matriz fixa
  de 100 em 25/25/10/10/10/10/10 preservados.
- check:pscpp-bank: exit 0, 1.984 questões/254 históricas; mensagem do
  gerador não comprova correção técnica atual.
- Geração de catálogo/flashcards e validação do catálogo: exit 0.
- test-notebook-complete-stems: exit 1, continua ANV-0142, fonte impedida
  documentada sem reescrita inventada. Próxima candidata independente ANV-0145.
  validate-editorial-runtime: exit 1, 77 localizadores. Triagem: exit 0, 215/77.
- Inventário: exit 0, 27.435 físicos, 14.086 ocorrências, 13.715 IDs;
  todos os 64 hashes corrigidos conferidos contra o inventário final.
- Gate editorial após inventário: exit 2, zero aceitos/14.086 pendentes;
  merge_permitted=false. Nenhuma aprovação final inventada.
- Diff físico: somente 0143 na restauração e 0841/0981 no principal;
  principal concorrente 0143, par 0142/0840 e todos os demais registros/campos
  intactos. Flags ausentes não inferidas; ativação efetiva inalterada.
- auditQuestion sem achados, política ativa e transformações preservando
  integralmente os três objetos antes da geração; depois, igualdade pela
  regressão. Nenhum dos três IDs consta de notebook-complete-stems.
- NEXT_TELEMETRY_DISABLED=1 npm run build: exit 0 em cópia isolada /tmp.
  Wrapper verificou exit_zero/compiled/types/pages/routes=true: compilação,
  lint/types, 101 páginas e rotas confirmados, não só código de saída. Fontes/
  data/config rastreados fora dos relatórios e seis artefatos gerados idênticos
  byte a byte. ENOTEMPTY do workspace no lote 019 não declarado resolvido.
  Avisos npm http-proxy, autoprefixer e cache Webpack sem impedir build.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Diagnóstico de fonte não equivale a revisão aprovada: 0142/0840 não alteradas
nem contadas como conferências primárias; busca bibliográfica incompleta
explicitamente registrada. Nenhum normalizador/filtro/gate relaxado; modelos
e demais achados anteriores mantidos com seus limites. Rechecagem independente,
fonte, programa/edital oficial, estados, cobertura, semântica e offline/produção
pendentes. Sem merge/deploy ou dados de usuários.


## Lote 033 — resultados efetivos

- Regressão antes/depois do build: exit0; 66 deltas exatos acumulados,
  fonte/runtime idênticos; 164 proposições renderizadas e 125 opções diretas.
  12.036 outros cadernos e 1.984 PSCPP inalterados. Só +0843 no contrato direto.
- Runtime, seleção/matriz fixa 100 em 25/25/10/10/10/10/10, proveniência/
  fingerprints e catálogo: exit0. Catálogo/flashcards regenerados; check:pscpp-bank exit0.
- Triagem: exit0, 214 candidatos sem proposições e77 localizadores.
  test-notebook-complete-stems exit1 em ANV-0142; validate-editorial-runtime
  exit1 nos77 localizadores. Nenhum teste relaxado ou suprimido.
- Inventário exit0: 27.435 físicos,14.086 ocorrências,13.715 IDs. Todos os66
  hashes corrigidos conferidos. Gate editorial posterior exit2: zero aceitos/
  14.086 pendentes; merge_permitted=false.
- Diff físico: somente0145 na restauração e0843 no principal. Principal0145
  sobre gualdropes, par0142/0840 e demais registros/campos intactos. Nenhuma
  nova ativação ou remoção. Nenhum dos dois IDs consta de notebook-complete-stems.
- auditQuestion sem achados, política ativa e transformações preservando
  integralmente os objetos antes da geração; igualdade completa depois.
- Build completo em cópia isolada /tmp: retry exit0, compilação/lint/types,
  geração101/101 e tabela de rotas explicitamente conferidos. Fontes/data/config
  rastreados fora dos relatórios idênticos, exceto o script de regressão
  ampliado após a cópia e executado no checkout. Seis artefatos gerados
  idênticos byte a byte. Primeiro comando retornou0,
  mas log persistido terminava no catálogo sem marcadores finais; não usado
  para certificar build. Lançamento redundante de terceira tentativa encerrado
  durante geração antes da compilação; aprovação técnica usa o retry completo.
  Avisos npm http-proxy/autoprefixer/cache Webpack preservados. Incidente
  ENOTEMPTY do workspace em lote019 não declarado resolvido.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Registros locais/logs preservados em audit-private/lote033; livros/imagens privados.
Rechecagem independente, programa/edital, cobertura, estados, semântica global e
offline/produção pendentes. Sem merge/deploy/dados de usuários.


## Lote 034 — resultados efetivos

- Regressão antes/depois do build: exit 0, 68 deltas exatos acumulados;
  168 proposições renderizadas e 130 opções diretas preservadas. 12.034 outros
  cadernos e 1.984 PSCPP intactos; igualdade integral fonte/runtime para147/845.
- Runtime, seleção e matriz fixa100 em25/25/10/10/10/10/10, proveniência/
  fingerprints, catálogo e check:pscpp-bank passaram (exit0).
  Catálogo/flashcards regenerados. Nenhum normalizador/filtro/gate relaxado;
  contrato direto somente+0845.
- Triagem exit0: 213 candidatos sem proposições/77 localizadores.
  test-notebook-complete-stems exit1 emANV-0142; validate-editorial-runtime
  exit1 nos77 localizadores. Falhas preservadas, sem supressão.
- Inventário exit0: 27.435 físicos,14.086 ocorrências e13.715 IDs; todos os68
  hashes corrigidos conferidos. Gate editorial após inventário exit2:0 aceitos/
  14.086 pendentes; merge_permitted=false.
- Diff físico: somente0147 restauração/0845 principal. Principal0147 sobre
  dimensões do degrau, par0142/0840 e outros objetos/campos inalterados.
  Ativação efetiva mantida; flags ausentes não inferidas. Nenhum dos dois
  IDs consta de notebook-complete-stems.
- auditQuestion sem achados; política ativa; reformulateLeakingStem e
  normalizeEditorialStem preservaram ambos integralmente antes da geração.
- Um build completo em cópia isolada /tmp: exit0 e marcadores explícitos
  de compilação,lint/types,101/101 páginas e tabela de rotas. Output capturado
  após conclusão para evitar logs persistidos incompletos. Todos os arquivos
  rastreados fora de docs, inclusive script de regressão ampliado, idênticos
  aos da cópia; seis artefatos gerados idênticos byte a byte. Avisos npm
  http-proxy/autoprefixer/cache preservados. ENOTEMPTY do workspace em lote019
  não declarado resolvido por build em /tmp.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
PDFs oficiais IMO, hashes, imagens e logs privados em audit-private/lote034.
EVIDENCIA_NORMATIVA_034.json contém apenas metadados e inferências delimitadas.
O comando de processos retornou erro de enumeração; não se afirma busca global
por escritores. Árvore rastreada limpa inicialmente e publicação com lease.
Programa/edital, rechecagem independente, versões normativas completas, cobertura,
estados, semântica global e offline/produção pendentes. Sem merge/deploy/usuários.


## Lote 035 — resultados efetivos

- Regressão antes/depois do build: exit 0; 70 deltas exatos acumulados,
  172 proposições HTML e 135 opções diretas preservadas. 12.032 outros cadernos
  e 1.984 PSCPP intactos. Igualdade completa fonte/runtime para0148/0846.
- Runtime, seleção/matriz fixa de100 em25/25/10/10/10/10/10, proveniência/
  fingerprints, catálogo e check:pscpp-bank: exit0. Catálogo e flashcards
  regenerados. Contrato fonte principal+0148/+0846; direto apenas+0846.
- Triagem exit0:212 candidatos sem proposições/77 localizadores.
  test-notebook-complete-stems exit1 emANV-0142; validate-editorial-runtime
  exit1 nos77 localizadores. Nenhuma falha suprimida, teste ou filtro relaxado.
- Inventário exit0:27.435 físicos,14.086 ocorrências e13.715 IDs. Todos os70
  hashes corrigidos conferidos. Gate editorial posterior exit2:zero aceitos/
  14.086 pendentes; merge_permitted=false.
- Diff físico só0148/0846 no principal; todos os demais objetos/campos,0347,
  restaurações e par0142/0840 intactos. Sem nova ativação/remoção. Nenhum dos
  dois IDs consta de notebook-complete-stems. Physical0347 ausente do runtime;
  questionQualityState retorna inactive por answer-leak:answer_similarity_leak.
  Nenhuma flag física inferida, aprovação ou nova quarentena aplicada.
- auditQuestion sem achados; política ativa e reformulateLeakingStem/
  normalizeEditorialStem preservando os dois objetos antes da geração;
  igualdade integral posterior. Nenhum normalizador alterado.
- Um build completo em /tmp:exit0; compilação,lint/types,101/101 páginas e
  tabela de rotas explicitamente confirmados. Todos os rastreados fora de docs,
  inclusive regressão ampliada, idênticos à cópia; seis artefatos gerados
  idênticos byte a byte. Avisos npm http-proxy/autoprefixer/cache preservados.
  ENOTEMPTY prévio do workspace não declarado resolvido por build em /tmp.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Texto/imagens e hashes conferidos no art.9.32 pp.692–693/PDF53–54, figuras9-40/
9-41; sumárioPDF10 e contraste9.26 p.687/PDF48. Divergência9.35/9.32 registrada
sem inferir errata ou renumerar outros modelos. Não se extrapolaram percentuais,
torque, espaçamento ou dimensionamento real. Logs/imagens privados preservados
em audit-private/lote035; nenhum livro integral publicado. Rechecagem independente,
programa/edital, cobertura, estados, semântica e offline/produção pendentes.
Sem merge, deploy em produção ou alteração de usuários.


## Lote 036 — resultados efetivos

- Regressão antes/depois do build:exit0;75 deltas exatos acumulados,180
  proposições HTML e150 opções diretas preservadas.12.027 outros cadernos e
  1.984 PSCPP intactos. Igualdade completa fonte/runtime para os cinco novos.
- Runtime, seleção/matriz fixa100 em25/25/10/10/10/10/10, proveniência/
  fingerprints, catálogo e check:pscpp-bank:exit0. Catálogo/flashcards regenerados.
  Fonte principal+151/152/849/850/984; contrato direto+849/850/984. Nenhum
  normalizador/filtro/gate relaxado ou falha suprimida.
- Triagem exit0:210 candidatos sem proposições/77 localizadores.
  test-notebook-complete-stems exit1 emANV-0142; validate-editorial-runtime
  exit1 nos77 localizadores. Falhas conhecidas continuam bloqueando gates.
- Inventário exit0:27.435 físicos,14.086 ocorrências e13.715 IDs; todos os75
  hashes corrigidos conferidos. Gate editorial posterior exit2:zero aceitos/
  14.086 pendentes; merge_permitted=false.
- Diff físico:exatamente151/152/849/850/984 no principal. Todos os demais
  objetos/campos,0350/0351, restaurações e par0142/0840 preservados. Nenhum ID
  criado/removido/reativado. Nenhum dos cinco consta de notebook-complete-stems.
  0350/0351 ausentes do runtime: política do bruto ativa, após os dois
  transformadores existentes inativa por stem-quotes-source-answer. Nenhuma
  flag física inferida, nova quarentena ou conferência primária desses dois.
- auditQuestion sem achados, política ativa e transformações preservando as
  cinco versões finais. Igualdade posterior e ausência de mass_reformulation
  verificadas pela regressão. Cinco keys e formatos B/B/A/A/A mantidos.
- Um build completo em /tmp:exit0, compilação,lint/types,101/101 páginas e
  tabela de rotas explicitamente confirmados. Todos os rastreados fora de docs,
  inclusive regressão ampliada, idênticos à cópia; seis artefatos gerados
  idênticos byte a byte. Avisos npm http-proxy/autoprefixer/cache preservados;
  ENOTEMPTY anterior do workspace não declarado resolvido por build em /tmp.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Fonte Fonseca v.2 8ed:11.4.d p.759/PDF120 e contraste11.4.e pp.759–760/PDF120–121;
9.13 p.668/PDF29 fig.9-16 e continuação p.669/PDF30. Texto/imagens conferidos;
sem cálculo/ganho numérico extrapolado ou figura necessária ausente. Logs/imagens
privados em audit-private/lote036; nenhum livro integral publicado. Rechecagem
independente, programa/edital, cobertura, estados, semântica e offline/produção
pendentes. Sem merge/deploy em produção ou mudanças de usuários.


## Lote 037 — resultados efetivos

- Regressão antes/depois do build:exit0;80 deltas exatos acumulados,188
  proposições HTML e165 opções diretas preservadas.12.022 outros cadernos e
  1.984 PSCPP intactos. Igualdade completa fonte/runtime dos cinco novos.
- Runtime, seleção/matriz fixa100 em25/25/10/10/10/10/10, proveniência/
  fingerprints, catálogo e check:pscpp-bank:exit0. Catálogo/flashcards regenerados.
  Fonte principal+163/164/861/862/988;direto+861/862/988. Nenhum normalizador,
  filtro ou gate relaxado; nenhuma falha suprimida.
- Triagem exit0:208 candidatos sem proposições/77 localizadores.
  test-notebook-complete-stems exit1 emANV-0142; validate-editorial-runtime
  exit1 nos77 localizadores. Gates continuam bloqueados.
- Inventário exit0:27.435 físicos,14.086 ocorrências e13.715 IDs; todos os80
  hashes corrigidos conferidos. Gate editorial posterior exit2:zero aceitos/
  14.086 pendentes;merge_permitted=false.
- Diff físico exatamente163/164/861/862/988 no principal. Demais objetos/
  campos,0362/0363,restaurações e par0142/0840 preservados. Nenhum ID criado/
  removido/reativado;nenhum dos cinco consta de notebook-complete-stems.
  0362/0363 ausentes do runtime; política após os transformadores existentes
  inativa por stem-quotes-source-answer (bruto0362 já inativo por similaridade,
  bruto0363 ativo). Sem nova quarentena,flags inferidas ou checks desses dois.
- auditQuestion sem achados e política ativa nas cinco versões finais; os
  transformadores preservam integralmente os objetos.988 intermediária falhou
  por sobreposição lexical e foi corrigida antes da geração/regressão finais,
  sem alterar critérios. Ausência de mass_reformulation verificada.
- Um build completo em /tmp:exit0;compilação,lint/types,101/101 páginas e
  tabela de rotas explicitamente confirmados. Todos os rastreados fora de docs,
  inclusive regressão ampliada,idênticos à cópia;seis artefatos gerados idênticos
  byte a byte. Avisos npm http-proxy/autoprefixer/cache preservados. ENOTEMPTY
  prévio do workspace não declarado resolvido por build em /tmp.

Scripts Node com --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs.
Fonte v.2:12.42.2 pp.847–848/PDF208–209;v.1:2.25 pp.84–85/PDF84–85,fig.2-9,
contexto2.24 pp.83–84/fig.2-8 e2.26 p.85. Texto/imagens conferidos;igualdade de
forças limitada à flutuação livre em repouso. Inferência qualitativa de862
explicitada no relatório:E=P=ρgV sob g comum e P constante. Sem cálculo de
calado/valores numéricos ou figura necessária ausente. Aproximação de fundeio
não confundida com técnica universal de largada. Logs/imagens privados em
audit-private/lote037;nenhum livro integral publicado. Rechecagem independente,
programa/edital,cobertura,estados,semântica e offline/produção pendentes.
Sem merge/deploy em produção ou usuários alterados.


## Lote038

Build completo isolado `npm run build`: exit0; marcadores compile/lint/types/101 páginas/rotas presentes. Todos os arquivos rastreados fora de docs coincidem byte a byte com a cópia testada, incluindo o script de regressão. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Dois registros físicos apenas alterados, metadados de topo preservados; restaurações e0364 inalteradas. Inventário gzip conferido contra todos os82 hashes corrigidos.

Com Node e loader pscpp-json-loader: geração de bancos, catálogo e flashcards; validate-runtime-question-banks; validate-pscpp-exam-selection; test-question-source-provenance; validate-runtime-question-catalog; audit-pscpp-runtime-triage/inventory; regressão test-pscpp-audit-anv0005 passaram. `npm run check:pscpp-bank` passou. Regressão repetida após build passou. Matriz100 exata preservada.

Falhas reais mantidas: test-notebook-complete-stems exit1 em ANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero evidências aprovadas/14086 pendentes. Build e testes estruturais não substituem aprovação individual. Sem rechecagem independente concluída, conformidade completa ao edital ou deduplicação semântica global.

- generate-runtime-question-catalog.mjs:exit0
- generate-runtime-flashcard-decks.mjs:exit0
- validate-runtime-question-banks.mjs:exit0
- validate-pscpp-exam-selection.mjs:exit0
- test-question-source-provenance.mjs:exit0
- validate-runtime-question-catalog.mjs:exit0
- test-notebook-complete-stems.mjs:exit1
- validate-editorial-runtime.mjs:exit1
- audit-pscpp-runtime-triage.mjs:exit0
- audit-pscpp-runtime-inventory.mjs:exit0
- validate-pscpp-editorial-evidence.mjs:exit2
- test-pscpp-audit-anv0005.mjs:exit0
- npm run check:pscpp-bank:exit0

HEAD base 43c7a5f8646e14cfc421186db38e03d98c7e717e; source PDFs hash verified; report038 has individual table, decisions and limits. Before/after hashes persistent in ledger. All82 inventory hashes matched. No final editorial approval.


## Lote039

Build isolado completo `npm run build`:exit0 e marcadores compile/lint/types/101páginas/rotas presentes. Todos os arquivos rastreados fora de docs coincidem byte a byte com a cópia testada, incluindo o script de regressão. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Apenas0166/0864 alteradas no banco principal;metadados de topo,restaurações,0365 e pares bloqueados inalterados. Inventário gzip conferido contra todos os84 hashes corrigidos.

Passaram geração de bancos/catálogo/flashcards,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,audit-pscpp-runtime-triage/inventory,test-pscpp-audit-anv0005 e npm run check:pscpp-bank. Node executado com loader pscpp-json-loader. Regressão antes/depois do build passou. Matriz100 exata preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14086 pendentes. Esses resultados não aprovam o conteúdo restante nem fecham rechecagem independente,programa/edital ou deduplicação semântica global.

- generate-runtime-question-catalog.mjs:exit0
- generate-runtime-flashcard-decks.mjs:exit0
- validate-runtime-question-banks.mjs:exit0
- validate-pscpp-exam-selection.mjs:exit0
- test-question-source-provenance.mjs:exit0
- validate-runtime-question-catalog.mjs:exit0
- test-notebook-complete-stems.mjs:exit1
- validate-editorial-runtime.mjs:exit1
- audit-pscpp-runtime-triage.mjs:exit0
- audit-pscpp-runtime-inventory.mjs:exit0
- validate-pscpp-editorial-evidence.mjs:exit2
- test-pscpp-audit-anv0005.mjs:exit0
- npm run check:pscpp-bank:exit0

Base 6d77ffd876b20fa41449243ca888720d6b3cbdc2;source PDF hash recalculated,text/images inspected.84 inventory hashes matched. Report039/table/ledger persistent. Documentary relation0176/0874 to032,no new primary review count.


## Lote040

Build completo isolado `npm run build`:exit0,marcadores compile/lint/types/101páginas/rotas presentes. Todos os arquivos rastreados fora de docs,incluindo a regressão,coincidem byte a byte com a cópia testada. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Apenas0179/0378/0877/0993 alteradas no banco principal;metadados de topo,restaurações e pares bloqueados inalterados. Todos os88 hashes de correção conferidos no inventário gzip.

Passaram geração de bancos/catálogo/flashcards,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,audit-pscpp-runtime-triage/inventory,test-pscpp-audit-anv0005 e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build passou;matriz100 exata preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1ANV-0142;validate-editorial-runtime exit1,77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14086 pendentes. Testes estruturais e build não substituem rechecagem independente,conformidade completa ao edital e revisão semântica global.

- generate-runtime-question-catalog.mjs:exit0
- generate-runtime-flashcard-decks.mjs:exit0
- validate-runtime-question-banks.mjs:exit0
- validate-pscpp-exam-selection.mjs:exit0
- test-question-source-provenance.mjs:exit0
- validate-runtime-question-catalog.mjs:exit0
- test-notebook-complete-stems.mjs:exit1
- validate-editorial-runtime.mjs:exit1
- audit-pscpp-runtime-triage.mjs:exit0
- audit-pscpp-runtime-inventory.mjs:exit0
- validate-pscpp-editorial-evidence.mjs:exit2
- test-pscpp-audit-anv0005.mjs:exit0
- npm run check:pscpp-bank:exit0

Base fc67141c2fa36c5c872c79da11be24974a8d2f8b;PDF hash recalculated,text/images inspected.88 inventory hashes matched. Report040/table/ledger persistent. Four active old-082 variants corrected,not inferred inactive from previous physical originals.


## Lote041

Build completo isolado `npm run build`:exit0,marcadores compile/lint/types/101páginas/rotas presentes. Todos os arquivos rastreados fora de docs,incluindo a regressão,coincidem byte a byte com a cópia testada. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Apenas0181/0879 alteradas no principal;metadados de topo,restaurações,0380 e pares bloqueados inalterados. Todos os90 hashes corrigidos conferidos no inventário gzip.

Passaram geração de bancos/catálogo/flashcards,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,audit-pscpp-runtime-triage/inventory,test-pscpp-audit-anv0005 e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build passou,matriz100 exata preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1ANV-0142;validate-editorial-runtime exit1,77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14086 pendentes. Build/testes estruturais não fecham rechecagem independente,programa/edital,inventário normativo completo ou revisão semântica global.

- generate-runtime-question-catalog.mjs:exit0
- generate-runtime-flashcard-decks.mjs:exit0
- validate-runtime-question-banks.mjs:exit0
- validate-pscpp-exam-selection.mjs:exit0
- test-question-source-provenance.mjs:exit0
- validate-runtime-question-catalog.mjs:exit0
- test-notebook-complete-stems.mjs:exit1
- validate-editorial-runtime.mjs:exit1
- audit-pscpp-runtime-triage.mjs:exit0
- audit-pscpp-runtime-inventory.mjs:exit0
- validate-pscpp-editorial-evidence.mjs:exit2
- test-pscpp-audit-anv0005.mjs:exit0
- npm run check:pscpp-bank:exit0

Base 83efac78dec42dd4cc08f78c9ed65dc2f34803a1;official source URLs/hash/limited visual scope inJSON041.90 inventory hashes matched. Main/runtime equality;numeric bounds and five option verdicts documented. Local HEAD040 recovery without duplication recorded.


## Lote042

Build completo isolado `npm run build`:exit0,marcadores compile/lint/types/101páginas/rotas presentes. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Apenas0190/0888 alteradas no principal;metadados de topo,restaurações,0389 e pares bloqueados intactos. Todos os92 hashes corrigidos conferidos no inventário gzip.

Passaram geração de bancos/catálogo/flashcards,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,audit-pscpp-runtime-triage/inventory,test-pscpp-audit-anv0005 e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build passou;matriz100 exata preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1ANV-0142;validate-editorial-runtime exit1,77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14086 pendentes. Build/testes estruturais não fecham rechecagem independente,programa/edital,inventário completo de fontes ou revisão semântica global.

- generate-runtime-question-catalog.mjs:exit0
- generate-runtime-flashcard-decks.mjs:exit0
- validate-runtime-question-banks.mjs:exit0
- validate-pscpp-exam-selection.mjs:exit0
- test-question-source-provenance.mjs:exit0
- validate-runtime-question-catalog.mjs:exit0
- test-notebook-complete-stems.mjs:exit1
- validate-editorial-runtime.mjs:exit1
- audit-pscpp-runtime-triage.mjs:exit0
- audit-pscpp-runtime-inventory.mjs:exit0
- validate-pscpp-editorial-evidence.mjs:exit2
- test-pscpp-audit-anv0005.mjs:exit0
- npm run check:pscpp-bank:exit0

Base bfb93218d0c860112ae44956e421b44fbcb1c1d0;v2 PDF hash recalculated,four pages text/images inspected.92 inventory hashes matched;main/runtime equal. Report042 records old-I ambiguity,new verdicts and limitations.


## Lote043

Build completo isolado `npm run build`:exit0,marcadores compile/lint/types/101páginas/rotas presentes. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Apenas0198/0199/0897 alteradas no principal;metadados de topo,restaurações,0397/0896/0398 e pares bloqueados intactos. Todos os95 hashes corrigidos conferidos no inventário gzip.

Passaram geração de bancos/catálogo/flashcards,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,audit-pscpp-runtime-triage/inventory,test-pscpp-audit-anv0005 e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build passou;matriz100 exata preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1ANV-0142;validate-editorial-runtime exit1,77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14086 pendentes. Build/testes estruturais não fecham rechecagem independente,programa/edital,inventário completo de fontes/normas ou revisão semântica global.

- generate-runtime-question-catalog.mjs:exit0
- generate-runtime-flashcard-decks.mjs:exit0
- validate-runtime-question-banks.mjs:exit0
- validate-pscpp-exam-selection.mjs:exit0
- test-question-source-provenance.mjs:exit0
- validate-runtime-question-catalog.mjs:exit0
- test-notebook-complete-stems.mjs:exit1
- validate-editorial-runtime.mjs:exit1
- audit-pscpp-runtime-triage.mjs:exit0
- audit-pscpp-runtime-inventory.mjs:exit0
- validate-pscpp-editorial-evidence.mjs:exit2
- test-pscpp-audit-anv0005.mjs:exit0
- npm run check:pscpp-bank:exit0

Base e006fd3555fe3345e3d8595f1a9f927d361c6dd6;v1/v2 PDF hashes recalculated,five pages text/images inspected.95 inventory hashes matched;main/runtime exact. Report043 records figure-based geometry,comparative scope and excluded originals.


## Lote044

Build completo isolado `npm run build`:exit0,marcadores compile/lint/types/101páginas/rotas presentes. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Apenas0200/0898/1000 alteradas no principal;metadados de topo,restaurações,0399 e pares bloqueados intactos. Todos os98 hashes corrigidos conferidos no inventário gzip.

Passaram geração de bancos/catálogo/flashcards,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,audit-pscpp-runtime-triage/inventory,test-pscpp-audit-anv0005 e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build passou;matriz100 exata preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1ANV-0142;validate-editorial-runtime exit1,77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14086 pendentes. Build/testes estruturais não fecham rechecagem independente,programa/edital,inventário completo de fontes/normas ou revisão semântica global.

- generate-runtime-question-catalog.mjs:exit0
- generate-runtime-flashcard-decks.mjs:exit0
- validate-runtime-question-banks.mjs:exit0
- validate-pscpp-exam-selection.mjs:exit0
- test-question-source-provenance.mjs:exit0
- validate-runtime-question-catalog.mjs:exit0
- test-notebook-complete-stems.mjs:exit1
- validate-editorial-runtime.mjs:exit1
- audit-pscpp-runtime-triage.mjs:exit0
- audit-pscpp-runtime-inventory.mjs:exit0
- validate-pscpp-editorial-evidence.mjs:exit2
- test-pscpp-audit-anv0005.mjs:exit0
- npm run check:pscpp-bank:exit0

Base 2014d0ad2d72a92f7c5084550934a10ac699c3f0;v2 PDF hash recalculated,five pages text/images including summarytable inspected.98 inventory hashes matched;main/runtime exact. Report044 records right-handed/isolated scope and prior quarantine0399 unchanged.


## Lote 045

Build completo isolado `npm run build`: exit 0, compilação, lint/tipos, 101 páginas e rotas confirmados. Todos os insumos rastreados fora de docs, incluindo o script de regressão, são byte a byte iguais à cópia testada. Os seis artefatos gerados são idênticos. O incidente anterior ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração de bancos PSCPP/cadernos, catálogo e flashcards; validate-runtime-question-banks, validate-pscpp-exam-selection, test-question-source-provenance, validate-runtime-question-catalog, test-pscpp-audit-anv0005, audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build: 101 deltas exatos contra baseline congelada; 12.001 ocorrências de cadernos e todas as 1.984 PSCPP preservadas; composição ativa intacta; 224 proposições renderizadas; 225 opções diretas preservadas. As cinco opções de cada correção têm justificativas. Todos os 101 hashes corrigidos correspondem ao inventário final. Só ANV-0203/0601/0901 mudaram no arquivo principal, com metadados de topo e demais objetos intactos; restaurações não foram editadas. Hashes antes/depois em CORRECOES_RUNTIME.json e CONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas: test-notebook-complete-stems exit 1 em ANV-0142; validate-editorial-runtime exit 1 com 77 localizadores; validate-pscpp-editorial-evidence exit 2, zero aprovadas e 14.086 pendentes. O gate de evidências foi regenerado depois do inventário e seus hashes conferidos, sem aprovação artificial. A matriz de 100 questões em 25/25/10/10/10/10/10 foi preservada. Testes estruturais e a releitura desta sessão não equivalem à rechecagem editorial independente final.

Fonte, julgamentos, tabela individual e limites: REVISAO_ARTE_NAVAL_LOTE_045.md.


## Lote046

Build completo isolado `npm run build`: exit0; compilação, lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs, incluindo regressão, iguais byte a byte à cópia testada; seis artefatos gerados idênticos. Não se declara resolvido o incidente anterior ENOTEMPTY da árvore original.

Passaram geração PSCPP/cadernos/catálogo/flashcards; validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:103 deltas exatos acumulados contra baseline congelada;11.999 cadernos e todas1.984 PSCPP intactos;composição ativa preservada;228 proposições renderizadas e230 opções diretas preservadas. O novo contrato de cálculo confere as três diferenças entre posições,120/3=40m,coordenadas presentes no enunciado e valor da opção correta. Nenhuma asserção foi relaxada.

Entre o checkpoint045 e046, o inventário efetivo muda somente0204/0602. Seus objetos principais são integralmente iguais ao runtime. Todos103 hashes corrigidos correspondem ao inventário final; hashes antes/depois em CORRECOES_RUNTIME.json e CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0027/0403/1199,três modelos e demais objetos/restaurações intactos; nenhuma ativação ou nova quarentena. A matriz exata100=25/25/10/10/10/10/10 continua preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 em ANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado depois do inventário,com todos os hashes conferidos. REVISOES_EDITORIAIS.jsonl permanece inalterado. Testes estruturais e releitura desta sessão não substituem revisão independente,aderência oficial ao programa/edital e validação semântica global.

Tabela individual,fonte,limites e achados dos modelos:REVISAO_ARTE_NAVAL_LOTE_046.md.


## Lote047

Build completo isolado `npm run build`:exit0,compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada;seis artefatos gerados idênticos. O incidente anterior ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:105 deltas exatos acumulados contra baseline congelada;11.997 cadernos e todas1.984 PSCPP intactos;composição ativa preservada;232 proposições renderizadas e235 opções diretas preservadas. Nenhuma asserção foi relaxada;apenas IDs documentados acrescidos aos contratos de fonte/direta.

Entre046 e047,somente0213/0611 mudam no inventário efetivo e arquivo principal. Seus objetos principais são integralmente iguais ao runtime final. Todos105 hashes corrigidos correspondem ao inventário;hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0036/0412,restaurações,modelos e demais objetos intactos. Sem ativação ou nova quarentena. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1ANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário e todos os hashes conferidos. REVISOES_EDITORIAIS.jsonl inalterado. Testes estruturais não substituem revisão editorial independente,inventário completo de emendas,vigência/aplicabilidade brasileira,programa/edital ou prevenção semântica global.

Fonte,escopo normativo e tabela individual:REVISAO_ARTE_NAVAL_LOTE_047.md e EVIDENCIA_NORMATIVA_047.json.


## Lote048

Build completo isolado final `npm run build`: exit0; compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada; seis artefatos gerados idênticos. Uma tentativa inicial de copiar nomes Unicode com git ls-files sem -z falhou antes do build; corrigida para -z. Uma geração e um build intermediários usaram insumos anteriores ao ajuste de alternative_rationales para o campo consumidor distractor_analysis; a regressão detectou o hash divergente e falhou. Esses resultados não validam a árvore final. Regeneração e novo build completo com insumos finais estáveis passaram. Não se declara resolvido o antigo ENOTEMPTY da árvore original.

Passaram geração PSCPP/cadernos/catálogo/flashcards; validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão final antes/depois do build:107 deltas exatos acumulados,11.995 cadernos e todas1.984 PSCPP intactos frente à baseline congelada; composição ativa preservada;236 proposições renderizadas e240 opções diretas preservadas. Nenhuma asserção relaxada: apenas IDs documentados acrescidos aos contratos de fonte/direta.

Entre047 e048,só0214/0612 mudam no arquivo principal e inventário efetivo. Objetos principais integralmente iguais ao runtime; todos107 hashes corrigidos coincidem com inventário. Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0042/0078/0413,restaurações e demais objetos intactos. Nenhuma ativação ou nova quarentena. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário e todos os hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado. Testes e releitura desta sessão não substituem rechecagem independente,programa/edital oficial,revisão semântica global ou consolidação normativa.

Acumulado107 IDs corrigidos distintos,110 conferências bibliográficas parciais,zero aprovações finais. Triagem196 sem proposições,77 localizadores;57 candidatos corrigidos,3 falsos positivos anteriores sem mudança,50 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102cadernos+1.984PSCPP),13.715 IDs únicos preservados. Próxima independenteANV-0218,costado desobstruído(IMO A1045 Annex6),sujeita à conferência normativa;0142/0840 e0176/0874 permanecem com fonte pendente,sem recontagem de busca. Todos8 gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

Fonte e tabela individual:REVISAO_ARTE_NAVAL_LOTE_048.md.

## Lote049

Build completo isolado com insumos estáveis `npm run build`:exit0,compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada;seis artefatos gerados idênticos. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:110 deltas exatos acumulados,11.992 cadernos e todas1.984PSCPP intactos contra baseline congelada;composição ativa preservada;240 proposições renderizadas e250 opções diretas preservadas. Nenhuma asserção relaxada:apenas IDs documentados acrescidos aos contratos de fonte/direta.

Entre048 e049,somente0218/0616/0906 mudam no principal e inventário efetivo. Objetos principais integralmente iguais ao runtime; todos110 hashes corrigidos correspondem ao inventário. Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0079/0417/1152/1334,restaurações e demais objetos intactos. Sem ativação,nova quarentena ou alteração de regime de três modelos. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos,REVISOES_EDITORIAIS.jsonl inalterado. Testes estruturais não substituem rechecagem independente,programa/edital,revisão semântica global e consolidação normativa completa.

Acumulado110 IDs corrigidos distintos,113 conferências bibliográficas parciais,zero aprovações finais. Triagem195 sem proposições,77 localizadores;58 candidatos corrigidos,3 falsos positivos anteriores sem mudança,52 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102cadernos+1.984PSCPP),13.715 IDs únicos preservados. Próxima independenteANV-0221,marcação dos quartéis,Fonseca v2 10.14. Pares0142/0840 e0176/0874 com fonte pendente,sem recontagem de buscas. Todos8 gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

Fonte e tabela individual:REVISAO_ARTE_NAVAL_LOTE_049.md;EVIDENCIA_NORMATIVA_049.json.

## Lote050

Build completo isolado com insumos estáveis `npm run build`:exit0,compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada;seis artefatos gerados idênticos. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:115 deltas exatos acumulados,11.987cadernos e todas1.984PSCPP intactos contra baseline congelada;composição ativa preservada;252 proposições renderizadas e260 opções diretas preservadas.

Contrato adicional V/F paraM3 resolve a sequência derivada do vetor manual,exige quatro julgamentos em cada opção,sequências distintas e uma única correspondência com a chave. Não se relaxaram contratos anteriores de combinação/diretas nem de população/hash/fonte;apenas IDs documentados acrescidos. Vetor manual é evidência de leitura, não prova automática da verdade técnica. Os três formatosM1/M2/M3 foram conferidos e preservados;flagsvalidation antigas permanecem intactas,sem equivaler a aprovação final.

Entre049 e050,somente0221/0619/AN-C10-1014-M1/M2/M3 mudam no principal e inventário efetivo. Objetos principais integralmente iguais ao runtime;todos115 hashes corrigidos correspondem ao inventário. Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0010/0420/0907,restaurações e demais objetos intactos. Sem ativação,nova quarentena ou alteração do regime de três modelos. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086pendentes. Gate regenerado após inventário,todos hashes conferidos,REVISOES_EDITORIAIS.jsonl inalterado. Testes estruturais não substituem rechecagem independente,programa/edital,revisão semântica global e consolidação normativa completa.

Acumulado115 IDs corrigidos distintos,118 conferências bibliográficas parciais,zero aprovações finais. Triagem194 sem proposições,77 localizadores;59 candidatos corrigidos,3 falsos positivos anteriores sem mudança,56 correções fora dessa triagem.27.435 físicos,14.086ocorrências(12.102cadernos+1.984PSCPP),13.715IDs únicos preservados. Próxima independenteANV-0223,rendimento do aparelho,Fonseca v2 9.16. Pares0142/0840 e0176/0874 com fonte pendente,sem recontagem de buscas. Todos8gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

Fonte e tabela individual:REVISAO_ARTE_NAVAL_LOTE_050.md.

## Lote051

Build completo isolado final com insumos estáveis `npm run build`:exit0,compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada;seis artefatos gerados idênticos. Após acabamento de espaçamento das explicações,geração/testes e build foram repetidos com os hashes finais;resultados intermediários não validam a árvore final. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:120 deltas exatos acumulados,11.982cadernos e todas1.984PSCPP intactos contra baseline congelada;composição ativa preservada;260 proposições renderizadas e275 opções diretas preservadas.

Três contratos de cálculo verificam unidadeskgf,coordenadas do enunciado e equações;0621/M1 também conferem o valor exibido da resposta e R em(0,1];M2 confere força e hipótese de quatro roldanas. ContratoV/F preserva quatro julgamentos por opção,sequências distintas e única correspondência com a chave. Nenhuma asserção anterior foi relaxada;apenas IDs documentados e verificações adicionais. Vetores manuais e testes não substituem verdade bibliográfica ou rechecagem independente. Regime de três modelos,formatos calculation/calculation/true_false e flags legadas preservados,sem aprovação editorial final.

Entre050 e051,somente0223/0621/AN-C09-916-M1/M2/M3 mudam no principal e inventário efetivo. Objetos principais integralmente iguais ao runtime;todos120 hashes corrigidos correspondem ao inventário. Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0422 e demais objetos/restaurações intactos. Sem ativação ou nova quarentena. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086pendentes. Gate regenerado após inventário,todos hashes conferidos,REVISOES_EDITORIAIS.jsonl inalterado. Programa/edital,revisão semântica global,consumidores/offline e consolidação normativa completa pendentes.

Acumulado120 IDs corrigidos distintos,123 conferências bibliográficas parciais,zero aprovações finais. Triagem193 sem proposições,77 localizadores;60 candidatos corrigidos,3 falsos positivos anteriores sem mudança,60 correções fora dessa triagem.27.435 físicos,14.086ocorrências(12.102cadernos+1.984PSCPP),13.715IDs únicos preservados. Próxima independenteANV-0227,atracação com corrente pela proa,Fonseca v2 12.28. Pares0142/0840 e0176/0874 com fonte pendente,sem recontagem de buscas. Todos8gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

Fonte e tabela individual:REVISAO_ARTE_NAVAL_LOTE_051.md.

## Lote052

Build completo isolado com insumos finais estáveis: `npm run build`,exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e os seis artefatos gerados foram comparados byte a byte com a cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois do build:126 deltas acumulados exatos,11.976 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;272 proposições renderizadas e290 opções diretas preservadas. Matriz exata100=25/25/10/10/10/10/10 preservada. Inclusão dos novos IDs no contrato correto e V/F com quatro julgamentos,sequências distintas e chave única;nenhuma asserção anterior relaxada.

Entre051 e052,somente os seis IDs da tabela mudam no principal/inventário efetivo. Objetos finais iguais integralmente ao runtime;metadados de topo,0426 e demais objetos intactos;restaurações/extensões não alteradas. Todos126 hashes corrigidos correspondem ao inventário. Hashes antes/depois no CORRECOES_RUNTIME.json e CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa inalterada;nenhuma ativação ou quarentena nova.

Falhas reais: test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1,77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado depois do inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado126 IDs distintos corrigidos,129 conferências primárias parciais,zero aprovações finais. Triagem191 sem proposições e77 localizadores;62 candidatos corrigidos,3 falsos positivos anteriores sem mudança e64 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0235,altura metacêntrica,Fonseca v1 2.33. Impedimentos0142/0840 e0176/0874 mantidos,sem recontagem.

## Lote053

Build completo isolado com insumos finais estáveis: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:128 deltas acumulados exatos,11.974 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;276 proposições renderizadas e295 opções diretas preservadas. Novo contrato verifica o cálculo e valor exibido deGM;nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre052 e053,somente0235/0633 mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos128 hashes corrigidos conferidos. Metadados de topo,0434,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa preservada;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado128 IDs distintos corrigidos,131 conferências primárias parciais,zero aprovações finais. Triagem190 sem proposições e77 localizadores;63 candidatos corrigidos,3 falsos positivos anteriores sem mudança e65 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0237,corrente da esteira,Fonseca v2 12.5. Quatro ocorrênciasPSCPP relacionadas aGM documentadas e preservadas,sem contagem de correção/revisão integral. Impedimentos0142/0840 e0176/0874 mantidos sem recontagem.

## Lote054

Build completo isolado com insumos finais estáveis: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:133 deltas acumulados exatos,11.969 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;288 proposições renderizadas e305 opções diretas preservadas. Contratos combinado/direto/VF mantêm unicidade e renderização;nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre053 e054,somente os cinco IDs da tabela mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos133 hashes corrigidos conferidos. Metadados de topo,0436,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa preservada;sem ativação ou nova quarentena. Três modelos e formatos preservados.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado133 IDs distintos corrigidos,136 conferências primárias parciais,zero aprovações finais. Triagem188 sem proposições e77 localizadores;65 candidatos corrigidos,3 falsos positivos anteriores sem mudança e68 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. PróximaANV-0253,propulsão azimutal,fonte declaradaFonseca v2 11.12 a verificar no corpo/edição antes de corrigir. Impedimentos0142/0840 e0176/0874 mantidos sem recontagem.

## Lote055

A primeira tentativa de build perdeu a sessão: a ferramenta informou cancelamento antes de decisão de aprovação de rede; não houve resultado/exit verificável e ela não foi contada como aprovada. A tentativa final isolada usou dependências locais e npm_config_offline=true,com telemetria desativada. `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:135 deltas acumulados exatos,11.967 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;292 proposições renderizadas e310 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre054 e055,somente0254/0652 mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos135 hashes corrigidos conferidos. Metadados de topo,0253/0651,0453/0918,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl;hashes bloqueados noBUSCA_FONTE_AZIMUTAL_055.json. Composição ativa preservada;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado135 IDs distintos corrigidos,138 conferências primárias parciais,zero aprovações finais. Triagem187 sem proposições e77 localizadores;66 candidatos corrigidos,3 falsos positivos anteriores sem mudança e69 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0256,transmissão hidráulica,Fonseca v2 11.5.b. Impedimentos0253/0651 documentados,sem incremento;0142/0840 e0176/0874 mantidos sem recontagem.

## Lote056

Build completo isolado com insumos finais estáveis,dependências locais e npm_config_offline=true: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido. Nenhuma interrupção anterior foi atribuída a esta tentativa.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:140 deltas acumulados exatos,11.962 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;304 proposições renderizadas e320 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre055 e056,somente os cinco IDs da tabela mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos140 hashes corrigidos conferidos. Metadados de topo,0455,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa e três formatos dos modelos preservados;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado140 IDs distintos corrigidos,143 conferências primárias parciais,zero aprovações finais. Triagem185 sem proposições e77 localizadores;68 candidatos corrigidos,3 falsos positivos anteriores sem mudança e72 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0262,prova de ruptura da amarra,Fonseca v2 10.16.b. Impedimentos0142/0840,0176/0874 e0253/0651 mantidos sem recontagem.

## Lote057

Build completo isolado com insumos finais estáveis,dependências locais e npm_config_offline=true: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:145 deltas acumulados exatos,11.957 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;316 proposições renderizadas e330 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre056 e057,somente os cinco IDs da tabela mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos145 hashes corrigidos conferidos. Metadados de topo,0461,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa,três formatos,statements:null e flags legadas dos modelos preservados;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado145 IDs distintos corrigidos,148 conferências primárias parciais,zero aprovações finais. Triagem184 sem proposições e77 localizadores;69 candidatos corrigidos,3 falsos positivos anteriores sem mudança e76 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0263,servomotor elétrico,Fonseca v2 11.4.e. Impedimentos0142/0840,0176/0874 e0253/0651 mantidos sem recontagem.


# Lote 058 — servomotor elétrico por alavanca

Build completo isolado: `npm run build` exit0, compilação, lint/tipos,101 páginas/rotas confirmados; dependências locais, execução final com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. A primeira chamada por subprocess retornou0 sem evidência de compilação e foi rejeitada; a execução direta terminou0, mas sua saída foi truncada. A repetição com log integral confirmou as etapas, preservando as tentativas. O ENOTEMPTY antigo não é declarado resolvido.

Passaram as quatro gerações, validate-runtime-question-banks, validate-pscpp-exam-selection, test-question-source-provenance, validate-runtime-question-catalog, test-pscpp-audit-anv0005, triagem/inventário echeck:pscpp-bank. Regressão:151 deltas acumulados exatos,11.951 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;328 proposições renderizadas e345 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre057 e058,somente os seis IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;151 hashes corrigidos conferidos. Metadados de topo,0462,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado151 IDs distintos corrigidos,154 conferências primárias parciais,zero aprovações finais. Triagem182 sem proposições e77 localizadores:71 candidatos corrigidos+3 falsos positivos anteriores+182 restantes=256;80 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0269,atracação a contrabordo,Fonseca v2 12.37. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Relatório individual: `REVISAO_ARTE_NAVAL_LOTE_058.md`. Seis correções parciais;nenhuma aprovação final.


# Lote 059 — atracação a contrabordo

Build completo isolado com dependências locais: `npm run build` exit0,compilação,lint/tipos e101 páginas/rotas confirmados por log integral,com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. Não se declara resolvido o ENOTEMPTY antigo da árvore original.

Passaram as quatro gerações,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,triagem/inventário echeck:pscpp-bank. Regressão final:157 deltas acumulados exatos,11.945 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;340 proposições renderizadas e360 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre058 e059,somente os seis IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;157 hashes corrigidos conferidos. Metadados de topo,0468,versões físicas/efetivas de0073/0100,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado. A execução preliminar incompleta descrita acima não substitui estes resultados finais.

Acumulado157 IDs distintos corrigidos,160 conferências primárias parciais,zero aprovações finais. Triagem180 sem proposições e77 localizadores:73 candidatos corrigidos+3 falsos positivos anteriores+180 restantes=256;84 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0276,navio portando pela amarra,Fonseca v2 12.43. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Relatório individual: `REVISAO_ARTE_NAVAL_LOTE_059.md`. Seis correções parciais;nenhuma aprovação final.


# Lote 060 — navio fundeado e confirmação de garra

Build completo isolado com dependências locais: `npm run build` exit0,compilação,lint/tipos e101 páginas/rotas confirmados por log integral,com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. Não se declara resolvido o ENOTEMPTY antigo da árvore original.

Passaram as quatro gerações,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,triagem/inventário echeck:pscpp-bank. Regressão:162 deltas acumulados exatos,11.940 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;352 proposições renderizadas e370 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre059 e060,somente os cinco IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;162 hashes corrigidos conferidos. Metadados de topo,0475,versões físicas/efetivas de0102,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado162 IDs distintos corrigidos,165 conferências primárias parciais,zero aprovações finais. Triagem178 sem proposições e77 localizadores:75 candidatos corrigidos+3 falsos positivos anteriores+178 restantes=256;87 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0278,máquinas em sentidos opostos,Fonseca v2 12.15. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Relatório individual: `REVISAO_ARTE_NAVAL_LOTE_060.md`. Cinco correções parciais;nenhuma aprovação final.


## Lote061 — seis correções parciais

Gerados runtime PSCPP, bancos, catálogo e flashcards; validações de bancos, matriz de seleção, proveniência e catálogo passaram; check:pscpp-bank passou. Regressão acumulada:168 deltas exatos,11934 ocorrências de cadernos preservadas,364 proposições renderizadas e385 alternativas diretas preservadas. Frente ao checkpoint060,exatamente seis IDs mudaram; todos os1984 registros PSCPP e a composição14086=12102+1984 permaneceram iguais. Sem inclusão/exclusão de ID.27435 registros físicos e13715 IDs únicos mantidos.

Build completo npm run build passou em cópia isolada: compilação,lint/tipos,101/101 páginas e tabela de rotas confirmados no log integral. A primeira tentativa retornou0 com log vazio e não foi aceita como evidência; repetição direta teve saída integral. Todos os arquivos rastreados fora de docs e os seis artefatos gerados foram comparados byte a byte com a cópia testada. A triagem terminou0 com log vazio; o artefato foi conferido diretamente:176 candidatos sem proposições e77 por localizador.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero evidências finais aceitas/14086 pendentes. Critérios não relaxados. REVISOES_EDITORIAIS intacto. As162 correções anteriores permanecem exatamente iguais no ledger; seis novas elevam o acumulado a168,com171 conferências bibliográficas parciais eZERO aprovações finais. Dos256 candidatos originais,77 corrigidos+3 falsos positivos+176 restantes;91 correções fora dessa triagem,sem dupla contagem.

Próxima falha independente:ANV-0279,seguimento para vante com máquina atrás,Fonseca v2 12.6.3. Impedimentos0142/0840,0176/0874 e0253/0651 e reconciliação da fraseAR na fonte permanecem abertos. Publicação deste relatório e CHECKPOINT no mesmo commit da branch,com comparação da árvore Git local/remota e expected_sha sem force; o SHA definitivo é o commit que contém este arquivo.


## Lote062 — cinco correções parciais

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:173 deltas acumulados exatos,11929 ocorrências de cadernos preservadas,376 proposições renderizadas e395 alternativas diretas preservadas. Frente ao061,exatamente cinco IDs efetivos e cinco objetos do principal mudaram;168 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada pela validação pertinente.

Build completo npm run build passou em cópia isolada,com log integral confirmando compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados foram comparados byte a byte com a cópia testada. Não se confunde código de saída isolado com evidência de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato de triagem conferido diretamente:174 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS permaneceu byte a byte igual. Critérios não relaxados.

Acumulado sem recontagem:173 IDs corrigidos e176 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,79 corrigidos+3 falsos positivos+174 restantes;94 correções fora dessa triagem,79+94=173. Este lote acrescenta cinco correções e cinco conferências,sem recontar os168 IDs anteriores. Próxima falha independente:ANV-0283,virar a máquina de suspender,Fonseca10.32/10.36. Impedimentos0142/0840,0176/0874 e0253/0651,reconciliaçãoAR do061 e demais pendências globais preservados.
