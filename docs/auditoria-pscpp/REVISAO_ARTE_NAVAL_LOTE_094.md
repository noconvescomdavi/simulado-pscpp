# Lote 094 — limites do estudo de reversão e distância de parada

Quatro novos IDs com correções bibliográficas parciais, incluindo um defeito estrutural. Resolvidos dois alertas específicos de um outro ID (128-M2). Acumulado: **360 IDs únicos parcialmente corrigidos, 363 primeiras conferências parciais e zero aprovações finais**. Restam 118 defeitos estruturais, 3.192 outros IDs alertados e quatro retenções. Os 10.401 sem alerta automático não estão aprovados. As 520 decisões anteriores de duplicidade não foram recontadas.

## Base, elegibilidade e fonte

Ambiente antigo 005 recuperado por fast-forward. Pacote 093 conferido por tamanho/SHA256 integral, CRC/SHA256 de todos os membros, trailer SHA1 do pack e bundle. Commit `dd6bdc84371c6c1a154d7ae6134aeb842148b860` e árvore `f83315d9e9b264b58eb04e7d97958878b107379c` verificados; nenhum lote refeito/recontado e temporários preservados. HEAD remoto/PR172 ainda em083 `d5f13548`, aberto e draft.

AN-C12-127-M1/M2 já estavam ausentes do runtime. Originais físicos e exclusão preservados; nenhum incremento de revisão/correção. Só 127-M3 estava elegível. Os três modelos físicos por item foram mantidos.

Fonseca, *Arte Naval*, v.2, 8ª ed., 2019: item12.7, pp.805–808/PDF166–169, figuras12-6/12-7 na p.806/PDF167 e quadro do experimento p.807/PDF168; item12.8, p.808/PDF169. Texto PDF166–170 e imagens PDF166–169 conferidos, inclusive numerais805/806/807/808. SHA256: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`. A citação do *Manual del Marino*, 1946, é conhecida pela reprodução em Fonseca; o original não foi conferido independentemente.

## Relatório individual

| ID | Defeito e correção concreta | Gabarito |
|---|---|---|
| AN-C12-127-M3 | V/F com escopo insuficiente e falsa sem refutação; refeitos quatro itens sobre tempo de resposta, ambiente e limites de generalização do experimento, com cinco justificativas. | C mantido |
| AN-C12-128-M1 | Afirmações ausentes e faixa de parada sem delimitação suficiente; restaurados quatro itens sobre caráter geral, ambiente e hipótese de potência, com explicação das falsas. | D mantido |
| AN-C12-128-M2 | Comando genérico no runtime, enunciado igual ao M1 e resposta sem justificativas; criado comando completo com cinco faixas numéricas comparáveis, unidade explícita e limite bibliográfico. | E mantido |
| AN-C12-128-M3 | V/F genérico, falsa sem explicação e comparações históricas sem escopo; refeitos quatro itens sobre faixa geral, espaço de guinada e limites de transferência dos resultados. | A mantido |

127-M3 usa item12.7; os três128 usam item12.8 e o contexto experimental de12.7. A faixa três a seis comprimentos identifica a descrição bibliográfica, sem garantia de desempenho. As questões não prescrevem manobra de emergência, teste com objetos flutuantes ou sequência de máquina/leme. A hipótese sobre potência foi explicitada sem endossar como lei universal a afirmação de distância independente da velocidade. Essa validade física não foi certificada neste lote.

## Alertas, testes e limites

128-M2 tinha comando genérico e enunciado idêntico a128-M1. Após revisão primária, o comando técnico permanece intacto, as cinco faixas são distintas e têm unidade definida no enunciado, e o M1 renderiza quatro assertivas. Os dois comandos finais são diferentes. Isso resolve apenas os dois alertas registrados em REVISOES_ALERTAS_LOTE_094.json; não aprova conteúdo final nem a coexistência de variantes da mesma competência numa prova. Os outros IDs alertados passam de3.193 para3.192.

Exatamente quatro deltas físicos e efetivos desde093. Nenhum ID ativo adicionado/removido:12.102 cadernos+1.984 simulado=14.086 ocorrências,13.715 IDs. Simulado inalterado; dois modelos inativos preservados. Quatro objetos iguais ao runtime e invariantes nas transformações. Políticas, filtros e flags preservados. Quatro gerações/checks, runtime, matriz100=25/25/10/10/10/10/10, proveniência e catálogo passaram. Regressão:360 deltas cumulativos,872 proposições renderizadas,710 opções diretas preservadas. Vetores TTFT/TTFF/TTFT, resposta única e cinco justificativas por questão conferidos; gabaritos C/D/E/A mantidos. Build Next completo:saída0. A primeira tentativa falhou com ENOTEMPTY ao remover diretório temporário de exportação; o cache antigo foi preservado por renomeação, e a repetição em cache limpo passou sem alterar o código-fonte. Diff sem erros de whitespace antes do commit.

Gate após inventário:14.086 hashes conferidos e zero aceitos. ANV-0142,77 localizadores e falha editorial continuam. Rechecagem independente, programa/edital oficial, diversidade semântica global, dificuldade legada e SQL/offline permanecem pendentes. Recordação bibliográfica de128-M2:cognição1; compreensão nos demais:cognição2, sem aprovação final de dificuldade.

## Persistência e próximo

Commit local na branch de auditoria. Publicação pública não tentada por rejeição084, que exige autorização explícita posterior. Sem merge/deploy. Novo pacote cumulativo:ZIP temporário, fechamento/fsync, renomeação atômica, fluxo preparado e materialização independente para conferir bytes/membros/trailer antes de declarar durável. Próximo129-M1/M2/M3 após fonte INTEGRAL, figuras e elegibilidade; não generalizar a sequência bibliográfica como instrução universal.1263e125 já corrigidos;11.10SOLAS exige fonte normativa oficial própria.
