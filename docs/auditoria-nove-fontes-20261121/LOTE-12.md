# LOTE-12 — 22/11/2026 09h55 America/Sao_Paulo

## Escopo e concorrência
Prompt-mestre integral e CHECKPOINT 11 lidos antes da execução; PR #262 consultado. A main avançou de `8f88127de625e74ca1958a86b37029ee61ec32cf` para `6f5b7ea2dcf63baefdc51b4f484b63ca397bf8bc` pelo PR #272. Comparação de commits: apenas `data/question-restorations/manobrabilidade-msc137-lote-14.json` (novo, blob `dc3c623945b5cbb0df7c93c946e5a5070ba11ea4`) e `lib/question-restorations.js` (alterado, blob `04aed80dded9880da86275383c657242ce930087`).

## Triagem estrutural real
JSON interpretado, 15 IDs únicos no lote; 15/15 com cinco opções e chave do gabarito presente. IDs: MAN-1466, MAN-1467, MAN-1468, MAN-1469, MAN-1470, MAN-1515, MAN-1516, MAN-1517, MAN-1518, MAN-1519, MAN-1520, MAN-1521, MAN-1522, MAN-1523, MAN-1524. Não há prova de unicidade global nem de gabarito semântico. O consumidor importa o lote 14 e usa `Map` por ID para substituir registros **já existentes** no banco; não adiciona IDs ausentes. A origem efetiva por ID ainda depende de confrontar todos os pacotes e banco-base, respeitando a precedência do último pacote.

## Fontes e bloqueios
Dois registros citam diretamente Santos CONAPRA 2021: `MAN-1469` (cap. 7, §7.3.4, p. 121) e `MAN-1523` (cap. 7, §7.3.4, pp. 121–122). A fonte primária da edição exata não foi acessada nesta rodada. Somam-se aos pendentes `MAN-1253`, `MAN-1307`, `MAN-1361`, `MAN-1415`. Os demais 13 citam MSC.137(76) ou MSC/Circ.1053, fora das nove fontes, mas concorrentes no runtime. A fonte integral PIANC 117 permanece não comprovada.

## Gates
Nenhum ID foi cotejado bibliograficamente, revisado em segunda passagem, corrigido ou homologado. Testes realizados: parse JSON, unicidade **local**, cinco alternativas e presença de chave, comparação Git dos dois arquivos, inspeção estática da função de restauração. Não executados: comparação global dos 3.051 IDs/hashes, execução real do runtime, schema completo, CI, build, Vercel. Falha preexistente da taxonomia Arte Naval não revalidada. Sem merge/deploy do PR #262.

## Próxima etapa
Priorizar a obtenção da edição exata de Santos CONAPRA 2021 para cotejar seis IDs, e reconstruir a origem efetiva por ID em todos os bancos e pacotes, antes de qualquer edição. O saldo provisório de 3.051 candidatos autorais continua **não homologado**, sem descontar os novos IDs antes da deduplicação global.
