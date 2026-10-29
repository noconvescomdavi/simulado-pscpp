# ANV-0005 — correção primária, ainda sem aprovação de release

Consumidor: cadernos/Arte Naval. ID, cinco alternativas e gabarito E preservados.
Formato B, nível L2 (compreensão de construção e efeito do esforço), rótulo
Médio. Não é medida psicométrica nem decisão operacional L4.

## Diagnóstico e fonte

O registro original continha quatro proposições; `reformulateLeakingStem`
as removia por considerar a expressão entre aspas como vazamento da resposta.
O runtime mostrava um comando genérico com opções por conjuntos de proposições
inexistentes. O problema não podia ser resolvido somente recolocando o texto:
II usava resistência inferior à do cabo como se fosse característica falsa.
O art. 8.2 estabelece essa limitação geral de nós/voltas/costuras; portanto não
é um bom distrator falso para a volta particular. A formulação antiga, além de
artificial, permitia interpretação incompatível com a unicidade do gabarito.

Exemplar primário: Fonseca, *Arte Naval*, volume 1, 8ª edição revista e ampliada,
SDM, Rio de Janeiro, 2019. Título e ficha catalográfica conferidos.
Drive: `1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N`, 39.831.575 bytes.
SHA-256: `792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20`.

| Conteúdo | Página impressa | Página PDF | Conferência |
|---|---:|---:|---|
| Art. 8.2, resistência geral | 536 | 534 | Texto e página renderizada |
| Art. 8.7, volta de fiel singela | 538 | 536 | Texto e figuras; identifica origem do antigo distrator I |
| Art. 8.18, volta redonda mordida e cote | 543 | 541 | Texto e figura 8-17 renderizados |

A construção, comportamento sob tração e desuso registrados no art. 8.18
fundamentam as quatro novas proposições, sem exigir recordar o número do artigo.
O comando precede todas as proposições, evitando ser incorporado ao texto de IV
pelo componente de apresentação. Não houve mudança global de normalização.

## Resolução de todas as alternativas

I é falsa: confunde utilização antiga com emprego corrente, contrariando o desuso
registrado. II é falsa: dispensa indevidamente o objeto fixo. III é verdadeira:
descreve a montagem e a mordida do chicote. IV é verdadeira: descreve resistência
a recorrer e aperto crescente. Sequência F/F/V/V, conjunto completo III+IV.

| Opção | Conjunto | Resultado e erro local |
|---|---|---|
| A | II+III | Inclui II falsa e omite IV verdadeira |
| B | I+II | As duas são falsas; omite III e IV |
| C | I+III | Inclui I falsa e omite IV verdadeira |
| D | II+IV | Inclui II falsa e omite III verdadeira |
| E | III+IV | Único conjunto que inclui todas e somente as verdadeiras |

O teste dedicado compara o runtime ao inventário congelado no commit
`309ec933f90e0242cd7c7334d89fbba572fbbc2b`: exatamente um ID efetivo muda,
12.101 questões dos cadernos permanecem idênticas, nenhuma inclusão/exclusão.
Também confere quatro proposições no HTML gerado pelo adaptador público e
componente reais, metadados e gabarito. Hash efetivo anterior
`80bf9b79cfb220e56a008fc9972c31b6b2be8ca2f9e8d3221d06a18788ff9f11`;
posterior `4d49a9fafaac6c35cffdf10636b51104e24b48bbd5d59548b139c6ffd6423204`.

## Pendências

Não inserido como aprovado em `REVISOES_EDITORIAIS.jsonl`. Faltam rechecagem
independente e confirmação final da versão aplicável do programa/edital. A
bibliografia do Drive inclui capítulo 8 de Fonseca; a DPC confirma publicação
dos anexos revisados, mas os PDFs oficiais retornaram erros de acesso e não
foi provada identidade binária com o Drive. Revisão global, duplicidade semântica
e todos os gates do banco continuam pendentes.

O teste completo de enunciados agora avança até ANV-0007 e falha; isso não é
aprovação geral. Testes existentes não foram relaxados. Próximo diagnóstico
deve considerar todas as camadas: fonte de ANV-0007 é direta, mas restaurações
podem substituir sua versão antes da normalização.
