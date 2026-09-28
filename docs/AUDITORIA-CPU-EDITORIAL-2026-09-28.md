# Auditoria de CPU, carregamento e questões — 28/09/2026

## Linha do tempo (19–22/09)

- 19/09: ampliação dos lotes PSCPP, decks de flashcards e planos de estudo; o commit `bb3ef38` já evitava carregar o banco offline inteiro na inicialização.
- 20/09: importação de 26 blocos para cadernos (`b381a1c`), reformulação massiva dos enunciados em tempo de execução (`c9e577d`) e pausa/retomada de simulados (`b5dccd0`).
- 21/09: nenhum commit datado no ramo principal inspecionado.
- 22/09: `75d6d69` antecipava o aquecimento de cerca de 22 rotas via service worker; houve mais três grandes incorporações de Arte Naval e novas versões do plano adaptativo.
- 23/09: `3d75d1f` removeu o aquecimento proativo e o modo offline web. A atividade histórica de `/api/offline/bootstrap` não deve ser atribuída à versão atual.

## Causa atual e correção

O chunk servidor de questões media cerca de 33 MB e era importado indiretamente pelo painel e pelo plano: `engagement` e `learning-engine` misturavam funções leves de resumo com análise de todo o banco. `consistency-summary` e `learning-summary` isolam essas dependências. O banco de questões continua disponível nas rotas que realmente precisam dele. Logs acima de 500 ms nas consultas iniciais do painel e do plano permitem observar a parte de banco separadamente.

Os flashcards bibliográficos eram construídos na primeira requisição de cada instância, com leitura de milhares de questões, e sincronizados no Neon de flashcards. Agora seus sete decks são gerados no build; o runtime consulta um fingerprint pequeno e só sincroniza quando o conteúdo mudou. Nenhum recurso de estudo foi removido.

## Qualidade editorial

A validação determinística varre 12.933 itens ativos de cadernos e PSCPP à procura de artefatos de OCR e fórmulas textuais conhecidas. Corrige `euum`, duplicação `entre entre` e enunciados mecânicos sem trocar IDs, alternativas ou gabaritos. Onze itens de Arte Naval com uma tabela achatada pelo OCR ficam retidos para novos simulados PSCPP até conferência com a fonte. As sessões anteriores ainda resolvem seus IDs; uma sessão de teste pausada contém um desses itens e não foi alterada.

Esta varredura não substitui revisão humana de cada afirmação e gabarito contra a bibliografia. Também não estabelece consumo de CPU “100% aprovado”: essa conclusão requer métricas de Active CPU e latência na Vercel nova sob tráfego representativo, antes/depois do deploy. Não foi feita modificação no projeto Vercel antigo.

O auditor heurístico dos arquivos brutos ainda sinaliza 8.198 ocorrências (6.730 fragmentos de fonte, 1.275 sobreposições enunciado/gabarito, quatro referentes ausentes, 165 templates artificiais e 24 questões de terminologia; um item pode ter mais de um sinal). Esses arquivos brutos incluem questões que não são servidas e textos reformulados antes da exposição, logo a contagem não equivale a 8.198 erros ativos confirmados. Ela indica uma fila editorial importante, a ser triada contra o banco efetivamente servido e a bibliografia antes de corrigir sentido e gabaritos. A revisão semântica integral continua pendente.
