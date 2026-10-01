# Revisão de Miguens III, capítulo 45

Revisão dos 307 registros ativos exportados e auditados em 30/09/2026:
303 dos cadernos e 4 do Simulado PSCPP. A aplicação é limitada aos IDs e
bancos identificados no pacote `miguens-cap45-reviewed.json`.

| Resultado final | Cadernos | Simulado PSCPP | Total |
| --- | ---: | ---: | ---: |
| Ativos revisados | 32 | 4 | 36 |
| Cópias desativadas | 235 | 0 | 235 |
| Quarentena por fundamentação não comprovada | 36 | 0 | 36 |
| Registros auditados | 303 | 4 | 307 |

Há 267 cópias excedentes entre os cadernos. Dessas, 32 também têm pendência
bibliográfica e recebem o estado de quarentena. Portanto, a união das cópias
excedentes com as 36 pendências compreende 271 registros inativos.
Os registros originais continuam preservados nas fontes.

## Conteúdo corrigido

- Nove enunciados sobre a direção do vento tiveram o objeto da pergunta
  recuperado. Uma versão permanece ativa; oito são cópias desativadas.
- MEO-1164 e MEO-1176 foram reconstruídas com quatro assertivas completas,
  combinações e explicações verificáveis. Tratam, respectivamente, da maré
  barométrica e da precipitação, orvalho e geada.
- NAR-B012-04 passou a testar a lei de Buys-Ballot no hemisfério Sul,
  substituindo o conteúdo de GNSS atribuído indevidamente ao capítulo.
- MET-B013-01 passou a testar a passagem de uma frente fria no hemisfério Sul.
- MET-B014-04 passou a testar o limite de visibilidade para nevoeiro.
- As questões diretas mantidas nos cadernos perderam os cenários artificiais
  e receberam classificação conceitual e dificuldade fácil. Oito enunciados
  muito curtos foram escritos como perguntas completas.

As 36 pendências de fundamentação abrangem explicações sobre vento
geostrófico, atrito/Coriolis, intensidade de precipitação e integração de
modelos de previsão. Quarentena indica que a referência não sustenta a
questão tal como escrita; não afirma que o conceito em si é falso.

## Fonte e integração

Fonte consultada: *Miguens, Navegação: a ciência e a arte — Volume III*,
1ª revisão atualizada, 2026, capítulo 45, páginas impressas 45-1 a 45-107.
O arquivo consultado é `MIGUENS Volume III (1ª Revisão) 2026.pdf`.
As reconstruções indicam seção, página impressa e página do PDF no pacote.

A revisão dos cadernos é aplicada após as restaurações anteriores. No
Simulado PSCPP, três enunciados genéricos aposentados continuam bloqueados
para impedir o reaparecimento de questões incompletas antes ocultas pela
deduplicação de enunciados. Os filtros gerais de qualidade permanecem ativos.
O código e o pacote de revisão integram os hashes das fontes de geração.

## Verificação

O teste `test:miguens-cap45-review` verifica a presença das 36 questões
ativas, ausência dos 271 registros inativos, alternativas distintas,
gabaritos existentes, persistência dos campos revisados, interpretação das
assertivas e bloqueio dos enunciados aposentados. Os testes das restaurações
anteriores reconhecem as duas reconstruções posteriores do capítulo 45.

A comparação dos coletores com o código anterior confirmou que o conteúdo
ativo fora dos IDs revisados foi preservado. Este relatório descreve a
alteração proposta; a versão publicada do site depende da integração e
implantação dessa alteração.
