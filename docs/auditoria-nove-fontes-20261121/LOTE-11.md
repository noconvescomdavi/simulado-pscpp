# LOTE-11 — Reconciliação incremental do PR #271
Data: 2026-11-22 (America/Sao_Paulo). Auditoria das nove fontes, sem homologação editorial.

## Estado verificado
- HEAD da main: `8f88127de625e74ca1958a86b37029ee61ec32cf` (PR #271, 15 restaurações).
- Branch PR #262 antes desta rodada: `a547f7b71afa1993189ab8862009c9da9bbe4a21`; PR aberto, draft, mergeable=false. A base SHA apresentada pelo PR estava defasada e não substitui a leitura atual da main.
- Arquivo novo: `data/question-restorations/manobrabilidade-msc137-lote-13.json`, blob `05b69f9fde126d777fb047a0fe30208e58fb5747`.
- Consumidor `lib/question-restorations.js` importa lote 13 e o coloca na lista de restaurações; o mecanismo substitui por ID apenas questões presentes no banco base. Importação NÃO comprova seleção efetiva no caderno.
- 15 IDs: MAN-1407, MAN-1408, MAN-1409, MAN-1410, MAN-1411, MAN-1412, MAN-1413, MAN-1414, MAN-1415, MAN-1416, MAN-1461, MAN-1462, MAN-1463, MAN-1464, MAN-1465.
- Testes reais desta rodada: JSON parse PASS, 15 IDs únicos no lote PASS, cinco alternativas e gabarito presente PASS, interseção com 48 IDs de hidrodinâmica = zero. Não testados: unicidade global, hashes por ID entre banco/overrides, seleção runtime, testes npm, build, CI, Vercel.
- 14 itens têm fonte IMO MSC.137(76)/MSC/Circ.1053, fora do escopo bibliográfico estrito das nove fontes mas potencialmente concorrentes na seleção. `MAN-1415` cita diretamente Santos, *A Manobrabilidade do Navio no Século 21*, 1ª ed., CONAPRA, 2021, cap. 7, §7.4, p. 123 impressa. A página da edição exata NÃO foi consultada nesta rodada; o item não está homologado. Somam-se `MAN-1253`, `MAN-1307` e `MAN-1361` como pendências explícitas de cotejo da mesma edição.
- Fonte primária da obra correta ainda exige localização/consulta comprovada; não usar `Livro 08 - Manobras no Navio - Prof Edson.pdf` como prova de equivalência de edição.
- A fila original de 3.051 candidatos continua provisória e não foi reconciliada integralmente com os lotes concorrentes; não alterar sua contagem sem inventário atualizado.

## Resultado
0 aprovadas, 0 corrigidas, 1 novo ID com fonte Santos pendente, 14 verificações estruturais adicionais fora das nove fontes, 0 segundas passagens. Não alterar questões nem realizar merge/deploy.

## Próximo passo
Conferir a edição CONAPRA 2021 na fonte primária e cotejar MAN-1253, MAN-1307, MAN-1361 e MAN-1415 individualmente; confrontar banco base e restaurações por hash e efetividade. Depois prosseguir no lote de hidrodinâmica ainda não homologado. Relatórios RECONCILIACAO-11.csv/json documentam o estado de cada ID do lote 13.
