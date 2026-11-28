# LOTE-17 — Reconciliação incremental PR #277

Data: 2026-11-22, 14h55–15h (America/Sao_Paulo). Base main: `f2a65b287117bd6202e4e63c1a9058ab3a04459b`. PR concorrente: #277, merged.

Lidos integralmente PROMPT_MESTRE.md, CHECKPOINT.json e metadados do PR #262. Consultados o pacote `data/question-restorations/manobrabilidade-msc137-lote-19.json`, SHA blob `705f8c3b78591a7152d3b54b4ec09be1345f824b`, e `lib/question-restorations.js`, blob `489fbdebdf2c970908e467fd37f7ff97e595944b`.

O pacote contém 15 IDs distintos, MAN-1893 a MAN-1902 e MAN-1947 a MAN-1951. Todos possuem cinco alternativas (array de cinco elementos). MAN-1901 declara Santos, *A Manobrabilidade do Navio no Século 21*, CONAPRA 2021, cap. 7, §7.3.1, p.120 impressa; outros 14 declaram IMO MSC.137(76) ou MSC/Circ.1053, fontes não incluídas no conjunto das nove, mas com sobreposição temática e precedência de runtime. A conferência de resposta única, gabaritos, páginas, fonte primária e segunda revisão **não foi feita**. MAN-1901 se soma aos 15 IDs Santos já identificados, total provisório 16. Não declarar BLOQUEADA_FONTE individualmente sem verificar disponibilidade da edição correspondente.

O consumidor importa lote19 e aplica `new Map(packs.flatMap(...))` por ID, com precedência do último pacote e `(bank.questions||[]).map`: substitui IDs existentes, não adiciona IDs novos. Não se comprovou para cada ID sua existência no banco-base nem seu hash efetivo; reconciliação global continua bloqueante. Não se alteraram questões, gabaritos nem main. Não houve testes de runtime, build, CI, homologação ou verificação Vercel nesta execução. Falha preexistente taxonomia Arte Naval permanece não revalidada.

Saldo de candidatos autorais: 3.051 provisórios; 0 homologados; 0 corrigidos; 0 cotejados bibliograficamente nesta execução. PR #262 aberto/draft e sem merge. Próximo: obter o banco canônico completo e cruzar por ID/hash/origem com overlays; cotejar 16 Santos na edição CONAPRA 2021 e executar duas passagens independentes, antes de liberar qualquer merge.
