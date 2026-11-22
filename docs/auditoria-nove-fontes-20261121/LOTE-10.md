# LOTE-10 — Reconciliação PR #270 e bloqueio bibliográfico Santos

- Base anterior: `cd524245a09c29dd5fdb600617a0569b23361ec5`; main atual: `8d5ff0dab02054549f41f5c187a1125651752cf9` (PR #270).
- PR #262 permanece draft, não mergeável. Nenhum arquivo de questões foi editado nesta branch.
- Lote 12: 15 IDs, todos únicos no próprio arquivo; 15/15 possuem cinco alternativas A–E e gabarito presente. Esta é **somente validação estrutural local**, não revisão bibliográfica nem comparação global de IDs/hashes.
- Dois registros novos têm atribuição explícita a Santos: `MAN-1307` e `MAN-1361`. Os demais 13 citam IMO MSC.137(76)/MSC.Circ.1053, fora das nove fontes mas relevantes para concorrência no runtime.
- O pendente `MAN-1253` (lote 11) cita *A Manobrabilidade do Navio no Século 21*, cap. 7, pp. 120–121. Foi consultado no Drive o PDF `Livro 08 - Manobras no Navio - Prof Edson.pdf` (id `1aXKLzchRZiBcuf8xZWXF7vR3ez6LqBnw`); seu título interno é *Manobra do Navio, dos fundamentos primordiais de Newton e Euler até o século XXI*, e não corresponde inequivocamente à edição CONAPRA 2021 indicada no registro. Portanto não serve para homologar o enunciado nem as páginas alegadas. `MAN-1253`, `MAN-1307` e `MAN-1361` seguem pendentes de cotejo primário e segunda passagem, sem julgamento de gabarito.
- Os 3.051 candidatos do inventário inicial continuam provisórios, sujeitos à reconciliação global; nenhum ID foi homologado ou corrigido neste lote. O incremento da main torna o inventário anterior desatualizado para origem efetiva, e não foi executado o confronto completo por ID/hash.
- Falha preexistente: `validate:taxonomy:arte-naval` reportada na base anterior, **não reexecutada** aqui. Build, CI, simulado, Vercel e conferência de caderno também não executados nesta rodada.
- **Próxima ação:** obter a edição CONAPRA 2021 de Santos, cotejar `MAN-1253`/ `MAN-1307`/ `MAN-1361` por página, reconciliar os 3.051 IDs e os consumidores de restaurações, iniciar a segunda revisão.
