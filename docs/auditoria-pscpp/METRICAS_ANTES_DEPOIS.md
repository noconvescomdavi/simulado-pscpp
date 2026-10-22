# Métricas — integração inicial

| Medida | Antes | Depois |
|---|---:|---:|
| Registros físicos JSON, incluindo patches e fixtures | 27.435 | 27.435 |
| Registros de banco, incluindo patches | 27.113 | 27.113 |
| Fixtures | 322 | 322 |
| IDs únicos nos arquivos de banco | 21.509 | 21.509 |
| Ocorrências no runtime de cadernos | 12.204 | 12.102 |
| Ocorrências no runtime PSCPP | 1.984 | 1.984 |
| Ocorrências entre os dois consumidores | 14.188 | 14.086 |
| IDs únicos entre consumidores | 13.715 | 13.715 |
| IDs repetidos dentro de um consumidor | 102 | 0 |
| Questões com aprovação editorial integral nesta auditoria | 0 | 0 |

Ocorrência significa uma versão carregada em um consumidor. O mesmo ID pode
aparecer em cadernos e PSCPP; isso não significa necessariamente duplicidade
indevida. Os 1.532 patches editoriais parciais não são questões completas.
4.859 grupos de ID têm hashes físicos distintos, inclusive patches e versões
legítimas: investigar precedência, sem rotular todos como defeitos.

Os denominadores completos de conteúdo, idioma, dificuldade, letra e formato
ainda exigem revisão. Não há métrica de qualidade aprovada por amostragem.
`baseline/` conserva o inventário efetivo anterior à correção de carregamento.

## Lote 005

Oito correções primárias acumuladas e onze conferências parciais. Triagem de proposições 246 → 245; localizadores 77 → 77. Mesmos 12.102 cadernos e 1.984 PSCPP, 14.086 ocorrências e 13.715 IDs únicos. Regressão: oito deltas exatos, 32 proposições renderizadas, outros 12.094 cadernos e todas as PSCPP preservados. Zero aprovações finais; benchmark descritivo e matriz obrigatória inalterados.

Lote 006: 11 correções primárias e 14 conferências parciais acumuladas;
0/14.086 aprovações finais. Candidatos sem proposições 245 → 242;
localizadores 77 → 77. Contagens físicas/efetivas/IDs e matriz fixa preservadas.

Lote 007: 14 correções primárias, 17 conferências parciais; 0/14.086 aprovações
finais. Candidatos de proposições 242 → 241; localizadores 77. ANV-0044/0045
já tinham proposições e não são contadas como correções dessa triagem.

Lote 008: 15 correções primárias e 18 conferências parciais acumuladas;
0/14.086 aprovações finais. Candidatos de proposições 241 → 240;
localizadores 77. IDs e contagens físicas/efetivas preservados.

### Lote 009

ANV-0047: quatro proposições restauradas e tecnicamente reescritas, gabarito B
preservado. Acumulado 16 correções primárias, 19 conferências parciais e zero
aprovações finais. Runtime preservado em 12.102 cadernos + 1.984 PSCPP.

## Lote 010

ANV-0048: 17 correções primárias / 20 conferências parciais acumuladas.
Candidatos sem proposições 239 → 238; localizadores 77 → 77.
14.086 ocorrências e 13.715 IDs preservados; zero aprovações editoriais finais.
Regressão: 17 deltas desde baseline, 68 proposições no HTML, 12.085 outros
cadernos e todas as 1.984 PSCPP preservados; matriz disciplinar inalterada.

## Lote 011

18 correções primárias (17 anteriores + ANV-0049), 21 conferências parciais,
0/14.086 ocorrências com aprovação editorial final. Regressão: 18 deltas exatos,
72 proposições renderizadas; 12.084 outros cadernos e todas as 1.984 PSCPP
preservados. Matriz disciplinar de 100 inalterada.

Triagem regenerada: 237 candidatos sem proposições (238 antes), 77 localizadores.

## Lote 012

19 correções primárias / 22 conferências bibliográficas parciais / 0 aprovações
finais em 14.086 ocorrências. Triagem sem proposições: 237 → 236; localizadores: 77.
Mantidos 27.435 registros físicos, 14.086 ocorrências e 13.715 IDs.
Regressão: 19 deltas efetivos exatos, 76 proposições renderizadas; 12.083 outros
cadernos e 1.984 PSCPP preservados. Matriz 25/25/10/10/10/10/10 preservada.

## Lote 013 — Métricas ANV-0064

Nó de escota dobrado conferido em Arte Naval v. 1, 8ª ed., art. 8.40, p. 552/PDF 550 e figura 8-36. Restauração corrigida, ambiguidade da antiga IV eliminada; quatro proposições V/V/F/F, gabarito D e cinco justificativas. Vinte correções primárias e 23 conferências parciais; zero aprovações finais. Triagem: 236 → 235 candidatos sem proposições; 77 localizadores mantidos. Próxima falha ANV-0067. Sobreposição com ANV-0762 registrada, sem aprovação da vizinha. Ver REVISAO_ARTE_NAVAL_LOTE_013.md.

## Lote 014 — Métricas ANV-0067 e ANV-0765

Quartel do tornel conferido em Arte Naval v. 2, 8ª ed., art. 10.12.a–c, pp. 720–721/PDF 81–82 e figura 10-12. Corrigidas nomenclatura e posição da extremidade ligada à âncora. Restauração ANV-0067: F/V/V/F, chave B e cinco justificativas. Fonte principal ANV-0765: cinco descrições e chave E preservada, com cinco justificativas. Acumulado: 22 correções primárias e 25 conferências parciais; zero aprovações finais. Triagem: 235 → 234 sem proposições; 77 localizadores. Próxima falha ANV-0068. Variantes da mesma competência identificadas; impedimento global de coexistência permanece pendente. Ver REVISAO_ARTE_NAVAL_LOTE_014.md.

## Lote 015 — Métricas ANV-0068

Aparelho de governo conferido em Arte Naval v. 2, 8ª ed., arts. 11.1–11.2, pp. 755–756/PDF 116–117 e figura 11-1. Restauração prevalente corrigida, quatro proposições F/V/F/V, chave C e cinco justificativas. Acumulado: 23 correções primárias e 26 conferências parciais; zero aprovações finais. Triagem: 234 → 233 candidatos sem proposições; 77 localizadores mantidos. Próxima falha ANV-0073. ANV-0766/0956 lidas integralmente; sobreposição registrada sem correção/aprovação das vizinhas. Ver REVISAO_ARTE_NAVAL_LOTE_015.md.

## Lote 016 — Métricas ANV-0073

Parada com máquina atrás toda força conferida em Arte Naval v. 2, 8ª ed., arts. 12.7–12.8, pp. 805–808/PDF 166–169 e figuras 12-6–12-7. Restauração corrigida, quatro proposições V/F/F/V, chave C e cinco justificativas. Eliminada ambiguidade dos distratores; não se generaliza guinada nem distância de parada. Acumulado: 24 correções primárias e 27 conferências parciais; zero aprovações finais. Triagem: 233 → 232 sem proposições; 77 localizadores. Próxima falha confirmada ANV-0076. Vizinha ANV-0771 lida; sobreposição e revisão detalhada de sua explicação registradas, sem correção/aprovação da vizinha. Ver REVISAO_ARTE_NAVAL_LOTE_016.md.

## Lote 017 — Métricas ANV-0076

Máquina de reboque conferida em Arte Naval v. 2, 8ª ed., art. 12.71, p. 909/PDF 270. Restauração corrigida, quatro proposições F/F/V/V, chave A e cinco justificativas. Eliminado distrator ambíguo: ajuste por tensão, soleca sob esticão e recolhimento do brando explicitados no contexto do mecanismo descrito. Acumulado: 25 correções primárias e 28 conferências parciais; zero aprovações finais. Triagem: 232 → 231 sem proposições; 77 localizadores. Próxima falha confirmada ANV-0085. Vizinha ANV-0774 lida; sobreposição registrada sem correção/aprovação da vizinha. Ver REVISAO_ARTE_NAVAL_LOTE_017.md.

## Lote 018 — Métricas ANV-0085

Amarrar com regeira conferido em Arte Naval v. 2, 8ª ed., art. 12.51, p. 866/PDF 227. Restauração corrigida, quatro proposições F/V/F/V, chave E e cinco justificativas. Saída pela popa, finalidade de orientação e alternativas de fixação explicitadas; não se exige ancorote adicional. Acumulado: 26 correções primárias e 29 conferências parciais; zero aprovações finais. Triagem: 231 → 230 sem proposições; 77 localizadores. Próxima falha confirmada ANV-0092. Vizinha ANV-0783 lida; sobreposição registrada sem correção/aprovação da vizinha. Ver REVISAO_ARTE_NAVAL_LOTE_018.md.

## Lote 019

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 26 | 29 |
| Conferências primárias parciais | 29 | 32 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 230 | 229 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

ANV-0092 na triagem; ANV-0790/0964 fora dela com o mesmo erro técnico.
Combinações corrigidas acumuladas 24; cinco correções fora dessa triagem;
três falsos positivos resolvidos anteriormente. 26 combinadas verificadas
no HTML (104 proposições); três diretas com 15 opções preservadas pelo adaptador.
Matriz de 100 em 25/25/10/10/10/10/10 preservada. Zero certificação integral.

## Lote 020

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 29 | 33 |
| Conferências primárias parciais | 32 | 36 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 229 | 227 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

ANV-0096/0097 eram candidatos sem proposições; ANV-0794/0795 estavam fora
dessa triagem. Acumulados: 26 combinadas corrigidas na triagem, sete correções
fora dela e três falsos positivos anteriores sem alteração de conteúdo.
Regressão: 28 combinadas/112 proposições no HTML real, cinco diretas/25 opções
preservadas no adaptador; 12.069 outros cadernos e 1.984 PSCPP inalterados.
Matriz fixa 100 em 25/25/10/10/10/10/10 preservada. Zero certificação integral.

## Lote 021

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 33 | 35 |
| Conferências primárias parciais | 36 | 38 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 227 | 226 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

ANV-0100 estava na triagem; ANV-0798 fora dela. Acumulados: 27 correções de
candidatos sem proposições, oito correções fora dessa triagem e três falsos
positivos anteriores sem alteração de conteúdo. Regressão de 29 combinadas
com 116 proposições no HTML e seis diretas/30 opções preservadas pelo adaptador.
12.067 outros cadernos e 1.984 PSCPP inalterados; matriz 100 em
25/25/10/10/10/10/10 preservada. Sem certificação integral.

## Lote 022

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 35 | 37 |
| Conferências primárias parciais | 38 | 40 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 226 | 225 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

ANV-0105 estava na triagem e ANV-0803 fora dela. Acumulados 28 candidatos
corrigidos, nove correções fora dessa triagem e três falsos positivos anteriores
sem alteração de conteúdo. Regressão de 30 combinadas/120 proposições no HTML,
sete diretas/35 opções preservadas pelo adaptador. 12.065 outros cadernos e
1.984 PSCPP inalterados; matriz de 100 em 25/25/10/10/10/10/10 preservada.
Nenhum ID ativado/removido; quarentena física concorrente de 0105 intacta.


## Lote 023

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 37 | 39 |
| Conferências bibliográficas parciais | 40 | 42 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 225 | 224 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

ANV-0108 estava na triagem; 0806 fora dela. Acumulados 29 candidatos
corrigidos, dez correções fora da triagem e três falsos positivos anteriores.
Regressão: 31 combinadas/124 proposições HTML, oito diretas/40 opções;
12.063 outros cadernos e 1.984 PSCPP inalterados. Matriz 100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido.


## Lote 024

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 39 | 41 |
| Conferências bibliográficas parciais | 42 | 44 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 224 | 223 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

ANV-0111 estava na triagem; 0809 fora dela. Acumulados 30 candidatos
corrigidos, onze correções fora da triagem e três falsos positivos anteriores.
Regressão: 32 combinadas/128 proposições HTML, nove diretas/45 opções;
12.061 outros cadernos e 1.984 PSCPP inalterados. Matriz 100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido.


## Lote 025

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 41 | 44 |
| Conferências bibliográficas parciais | 44 | 47 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 223 | 222 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

ANV-0116 estava na triagem; 0814/0972 fora dela. Acumulados 31 candidatos
corrigidos, treze correções fora da triagem e três falsos positivos anteriores.
Regressão: 33 combinadas/132 proposições HTML, onze diretas/55 opções;
12.058 outros cadernos e 1.984 PSCPP inalterados. Matriz 100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido.


## Lote 026

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 44 | 48 |
| Conferências bibliográficas parciais | 47 | 51 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 222 | 221 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

0125 estava na triagem; 0823/0975/1034 fora dela. Acumulados 32 candidatos
corrigidos, dezesseis correções fora da triagem e três falsos positivos anteriores.
Regressão: 34 combinadas/136 proposições HTML, catorze diretas/70 opções;
12.054 outros cadernos e 1.984 PSCPP inalterados. Matriz100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido.


## Lote 027

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 48 | 51 |
| Conferências bibliográficas parciais | 51 | 54 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 221 | 220 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

0128 estava na triagem; 0826/0976 fora dela. Acumulados 33 candidatos
corrigidos, dezoito correções fora da triagem e três falsos positivos anteriores.
Regressão: 35 combinadas/140 proposições HTML, dezesseis diretas/80 opções;
12.051 outros cadernos e 1.984 PSCPP inalterados. Matriz100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido no estado final.
Snapshot intermediário com 12.101 cadernos foi rejeitado, não publicado como
validado e substituído pelo inventário final com 12.102.
