# LOTE-14 — reconciliação incremental PR #274

Data: 2026-11-22, rodada iniciada às 12:02 America/Sao_Paulo.

## Fontes lidas nesta execução
PROMPT_MESTRE.md integral; CHECKPOINT.json; metadados PR #262 e PR #274; comparação main 43571dfab37cc00de75faa12c10ee3baaf393dd1..d7068975b6b9598c5a5643168f022d5024c356af; lib/question-restorations.js; data/question-restorations/manobrabilidade-msc137-lote-16.json (blob ae9a8124c697fbf5a360c10374e253f794211b74). **Nenhum PDF bibliográfico primário foi cotejado nesta execução.**

## Concorrência e origem
PR #274 integrado na main em d7068975b6b9598c5a5643168f022d5024c356af; acrescentou um pacote de restauração e seu import. O consumidor constrói um Map de substituições por ID, aplicadas apenas aos IDs existentes no banco; a existência efetiva e precedência frente a outros patches por ID ainda exigem reconciliação global. PR #262 continua draft, não integrado.

## Triagem local
15 IDs: MAN-1628, MAN-1629, MAN-1630, MAN-1631, MAN-1632, MAN-1677, MAN-1678, MAN-1679, MAN-1680, MAN-1681, MAN-1682, MAN-1683, MAN-1684, MAN-1685, MAN-1686.
Unicidade local: PASS; cinco opções A–E e chave presente: FAIL. Santos CONAPRA 2021 declarados: MAN-1630, MAN-1631, MAN-1684, MAN-1685; os demais têm referência declarada IMO MSC.137(76)/MSC/Circ.1053, sem cotejo primário nesta rodada. Estes testes são apenas inspeção estrutural do pacote, **não homologação**. Nenhum hash individual de enunciado foi reconciliado contra todos os bancos. Nenhuma questão corrigida, aprovada ou desativada pela auditoria nove fontes.

## Bloqueios e próximos passos
Falta confronto integral de 3.051 candidatos por ID/hash/origem efetiva, cotejo na edição CONAPRA 2021 de Santos, segunda passagem independente e testes reais do projeto. A validação de taxonomia Arte Naval reportada no checkpoint inicial era falha preexistente e não foi reexecutada. CI, build e Vercel Production não foram verificados nesta execução. Merge da auditoria não autorizado.

Próximo: localizar e ler a edição primária de Santos e cotejar individualmente os IDs já identificados, começando por MAN-1253, MAN-1307, MAN-1361, MAN-1415, MAN-1469, MAN-1523, MAN-1577 e os quatro IDs deste lote; concluir reconciliação global antes de editar.
