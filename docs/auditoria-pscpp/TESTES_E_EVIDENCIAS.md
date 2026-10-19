# Testes e evidências — checkpoints e evolução

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
