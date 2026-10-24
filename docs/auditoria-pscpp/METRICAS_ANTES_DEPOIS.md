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


## Lote 028

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 51 | 53 |
| Conferências bibliográficas parciais | 54 | 56 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 220 | 219 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

0129 estava na triagem; 0827 fora dela. Acumulados 34 candidatos corrigidos,
dezenove correções fora da triagem e três falsos positivos anteriores.
Regressão: 36 combinadas/144 proposições HTML, dezessete diretas/85 opções;
12.049 outros cadernos e 1.984 PSCPP inalterados. Matriz de 100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido; versão física
concorrente de 0129 continua com suas flags de quarentena.


## Lote 029

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 53 | 56 |
| Conferências bibliográficas parciais | 56 | 59 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 219 | 218 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

0131 estava na triagem; 0829/0977 fora dela. Acumulados 35 candidatos
corrigidos, 21 correções fora da triagem e três falsos positivos anteriores.
Regressão: 37 combinadas/148 proposições HTML, dezenove diretas/95 opções;
12.046 outros cadernos e 1.984 PSCPP inalterados. Matriz de 100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido.


## Lote 030

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 56 | 59 |
| Conferências bibliográficas parciais | 59 | 62 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 218 | 217 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

0134 estava na triagem; 0832/0978 fora dela. Acumulados 36 candidatos
corrigidos, 23 correções fora da triagem e três falsos positivos anteriores.
Regressão: 38 combinadas/152 proposições HTML, 21 diretas/105 opções;
12.043 outros cadernos e 1.984 PSCPP inalterados. Matriz de 100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido.


## Lote 031

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 59 | 61 |
| Conferências bibliográficas parciais | 62 | 64 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 217 | 216 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

0138 estava na triagem; 0836 fora dela. Acumulados 37 candidatos corrigidos,
24 correções fora da triagem e três falsos positivos anteriores.
Regressão: 39 combinadas/156 proposições HTML, 22 diretas/110 opções;
12.041 outros cadernos e 1.984 PSCPP inalterados. Matriz de 100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido.


## Lote 032

| Métrica | Antes | Depois |
|---|---:|---:|
| Correções primárias acumuladas | 61 | 64 |
| Conferências bibliográficas parciais | 64 | 67 |
| Aprovações editoriais finais | 0 | 0 |
| Candidatos sem proposições | 216 | 215 |
| Candidatos por localizador | 77 | 77 |
| Registros físicos | 27435 | 27435 |
| Ocorrências efetivas | 14086 | 14086 |
| IDs únicos efetivos | 13715 | 13715 |

0143 estava na triagem; 0841/0981 fora dela. Acumulados 38 candidatos corrigidos,
26 correções fora da triagem e três falsos positivos anteriores.
Regressão: 40 combinadas/160 proposições HTML, 24 diretas/120 opções;
12.038 outros cadernos e 1.984 PSCPP inalterados. Matriz de 100 em
25/25/10/10/10/10/10 preservada. Nenhum ID ativado/removido. Diagnóstico
de 0142/0840 acrescenta zero correções, zero checks primários e zero aprovações.


## Lote033

Duas novas correções distintas (ANV-0145/0843); acumulado66. Conferências
primárias parciais67→69; aprovações finais0. Sem proposições215→214;
localizadores77→77. Cadernos12.102 e PSCPP1.984 preservados,14.086 ocorrências/
13.715 IDs e27.435 físicos. Formatos B/A, keys E/C. 0145 Difícil→Médio/L2;
0843 Médio/L2. Propostas editoriais sem calibração aprovada. Nenhum modelo
criado/removido. Mesma competência, coexistência em uma prova ainda impedimento
semântico a resolver globalmente; nenhuma alegação de deduplicação concluída.


## Lote 034

Duas novas correções distintas: ANV-0147/0845. Acumulado66→68; conferências
parciais69→71; zero aprovações finais. Sem proposições214→213; localizadores
77→77. 27.435 físicos,14.086 ocorrências (12.102 cadernos/1.984 PSCPP),13.715
IDs preservados. Formatos B/A, keys B/E. Propostas:147 Médio/L2 (antesDifícil),
845 Médio/L3 (cenário), sem calibração aprovada. Nenhum ID/modelo criado/removido.
Mesma competência nas duas variantes; deduplicação semântica global pendente.


## Lote 035

Duas novas correções distintas:0148/0846. Acumulado68→70; conferências
parciais71→73; zero aprovações finais. Sem proposições213→212; localizadores
77→77. 27.435 físicos,14.086 ocorrências (12.102 cadernos/1.984 PSCPP),13.715
IDs mantidos. Formatos B/A e keys C/A. Propostas0148 Médio/L2 (antesDifícil),
0846 Médio/L3, sem calibração aprovada. Nenhum ID/modelo criado, removido ou
reativado;0347 continua excluído pelo filtro já existente e inalterado. Duas
variantes ativas da competência, coexistência e revisão semântica ainda pendentes.


## Lote 036

Cinco correções novas distintas:151/152/849/850/984; acumulado70→75.
Conferências parciais73→78;zero aprovações finais. Sem proposições212→210;
localizadores77→77.27.435 físicos,14.086 ocorrências (12.102 cadernos/1.984 PSCPP),
13.715 IDs mantidos. Formatos B/B/A/A/A;keys A/B/D/E/D nessa ordem. Propostas:
151/152 Médio/L2 (antesDifícil),849/850 Médio/L2,984 Fácil/L1 (antesDifícil).
Sem calibração histórica/psicométrica aprovada. Nenhum modelo criado, removido
ou reativado. Dois grupos de competência:2 e3 variantes ativas, não devem
coexistir dentro do grupo na mesma prova. Semântica global/prevenção pendentes.
0350/0351 preservados fora do runtime, sem nova contagem de revisão/correção.


## Lote 037

Cinco novas correções distintas:163/164/861/862/988;acumulado75→80.
Conferências parciais78→83;zero aprovações finais. Sem proposições210→208;
localizadores77→77.27.435 físicos,14.086 ocorrências (12.102 cadernos/1.984 PSCPP),
13.715 IDs preservados. Formatos B/B/A/A/A e keys C/D/A/B/C nessa ordem.
Propostas163/164 Médio/L2 (antesDifícil),861/862 Médio/L2,988 Fácil/L1
(antesDifícil),sem calibração aprovada. Nenhum modelo criado/removido/reativado.
Dois grupos com2/3 variantes ativas não devem coexistir dentro do grupo em uma
prova;semântica global/prevenção pendentes.0362/0363 sem nova contagem de revisão.


## Lote038

Corrigidas80→82 IDs distintos;conferências83→85;aprovações0→0. Triagem208→207 combinações,77→77 localizadores. Registros27435,ocorrências14086 (12102+1984),IDs13715 inalterados. Regressão82 deltas/192 proposições/170 opções diretas,12020 cadernos intactos. Report038:0165/0863;nenhum ID novo/quarentena.


## Lote039

Corrigidas82→84 IDs distintos;conferências85→87;aprovações0→0. Triagem207→206 combinações,77→77 localizadores. Registros27435,ocorrências14086 (12102+1984),IDs13715 intactos. Regressão84 deltas/196 proposições/175 opções diretas,12018 cadernos intactos. Report039:0166/0864;nenhum ID novo/quarentena.0176/0874 apenas impedimento correlato documentado,sem contagem.


## Lote040

Corrigidas84→88 IDs distintos;conferências87→91;aprovações0→0. Triagem206→205 combinações,77→77 localizadores. Registros27435,ocorrências14086 (12102+1984),IDs13715 intactos. Regressão88 deltas/200 proposições/190 opções diretas,12014 cadernos intactos. Report040:0179/0378/0877/0993;nenhum ID novo/quarentena ou alteração de regime de três modelos.


## Lote041

Corrigidas88→90 IDs distintos;conferências91→93;aprovações0→0. Triagem205→204 combinações,77→77 localizadores. Registros27435,ocorrências14086 (12102+1984),IDs13715 intactos. Regressão90 deltas/204 proposições/195 opções diretas,12012 cadernos intactos.0181/0879;nenhum ID novo/quarentena.0380 sem contagem.


## Lote042

Corrigidas90→92 IDs distintos;conferências93→95;aprovações0→0. Triagem204→203 combinações,77→77 localizadores. Registros27435,ocorrências14086 (12102+1984),IDs13715 intactos. Regressão92 deltas/208 proposições/200 opções diretas,12010 cadernos intactos.0190/0888;nenhum ID novo/quarentena;0389 sem contagem.


## Lote043

Corrigidas92→95 IDs distintos;conferências95→98;aprovações0→0. Triagem203→201 combinações,77→77 localizadores. Registros27435,ocorrências14086 (12102+1984),IDs13715 intactos. Regressão95 deltas/216 proposições/205 opções diretas,12007 cadernos intactos.0198/0199/0897;nenhum ID novo/quarentena;0397/0896/0398 sem contagem.


## Lote044

Corrigidas95→98 IDs distintos;conferências98→101;aprovações0→0. Triagem201→200 combinações,77→77 localizadores. Registros27435,ocorrências14086 (12102+1984),IDs13715 intactos. Regressão98 deltas/220 proposições/215 opções diretas,12004 cadernos intactos.0200/0898/1000;nenhum ID novo/quarentena;0399 sem contagem.


## Lote 045

98→101 IDs corrigidos distintos; 101→104 conferências bibliográficas parciais; zero aprovações finais. Sem proposições 200→199; localizadores 77→77. Deltas acumulados 101; proposições renderizadas 224; opções diretas 225; 12.001 cadernos e 1.984 PSCPP inalterados frente à baseline. População ativa e matriz de 100 preservadas. ANV-0203/0601/0901: C/A/A mantidos, formatos B/A/A, níveis propostos L2/L2/L1. Nenhum incremento para 0402/0117. Ver tabela e limites no relatório045.


## Lote046

101→103 IDs corrigidos distintos;104→106 conferências bibliográficas parciais;zero aprovações finais. Sem proposições199→198;localizadores77→77. Regressão103 deltas exatos,228 proposições renderizadas,230 opções diretas,11.999 cadernos e1.984 PSCPP intactos contra baseline. Só0204/0602 mudam desde045;D/B mantidos;formatosB/A;L2/L3 propostos. Nenhum incremento para0027/0403/1199 ou os três modelos12.82;achados e limites no relatório046. População ativa e matriz100 preservadas.


## Lote047

103→105 IDs corrigidos distintos;106→108 conferências bibliográficas parciais;zero aprovações finais. Sem proposições198→197;localizadores77→77. Regressão105 deltas,232 proposições renderizadas,235 opções diretas,11.997 cadernos e1.984PSCPP intactos contra baseline. Só0213/0611 mudam desde046;C/A mantidos;formatosB/A;L2/L3 propostos. População ativa e matriz100 preservadas. Conferência externa histórica SOLAS e consulta MCA não fecham consolidação atual/edital. Sem incrementos para0036/0412 ou15 modelos existentes;ver relatório047.


## Lote048

105→107 IDs corrigidos distintos;108→110 conferências bibliográficas parciais;zero aprovações finais. Sem proposições197→196;localizadores77→77. Regressão107 deltas,236 proposições renderizadas,240 opções diretas,11.995 cadernos e1.984PSCPP intactos. Só0214/0612 mudam desde047;D/B mantidos;formatosB/A,L2/L2 propostos. População ativa e matriz100 preservadas;nenhum incremento para0042/0078/0413;ver relatório048.

## Lote049

107→110 IDs corrigidos distintos;110→113 conferências bibliográficas parciais;zero aprovações finais. Sem proposições196→195;localizadores77→77. Regressão110 deltas,240 proposições renderizadas,250 opções diretas,11.992 cadernos e1.984PSCPP intactos. Só0218/0616/0906 mudam desde048;C/A/A mantidos;formatosB/A/A,L2/L3/L2 propostos. População ativa e matriz100 preservadas. Sem incrementos para0079/0417/1152/1334. Escopo normativo e diferença de exemplares576 documentados;ver relatório049.

## Lote050

110→115 IDs corrigidos distintos;113→118 conferências bibliográficas parciais;zero aprovações finais. Sem proposições195→194;localizadores77→77. Regressão115 deltas,252 proposições renderizadas,260 opções diretas,11.987cadernos e1.984PSCPP intactos. Só0221/0619 e3modelosAN-C10-1014 mudam desde049;A/D/E/B/A mantidos,formatosB/A/B/A/C,L2/L3/L2/L1/L2 propostos. RegimeM1/M2/M3,população ativa e matriz100 preservados. Sem incrementos para0010/0420/0907. Ver relatório050.

## Lote051

115→120 IDs corrigidos distintos;118→123 conferências bibliográficas parciais;zero aprovações finais. Sem proposições194→193;localizadores77→77. Regressão120 deltas,260 proposições renderizadas,275 opções diretas,11.982cadernos e1.984PSCPP intactos. Só0223/0621 e3modelosAN-C09-916 mudam desde050;C/A/B/C/A mantidos,formatosB/A/A/A/C,L2/L3/L3/L3/L2 propostos. Modelos calculation/calculation/VF,população e matriz100 preservados. Casos novos75%,0,80 e175kgf com3contratos de cálculo.Sem incremento para0422;ver relatório051.

## Lote052

Seis novas correções parciais;126 IDs acumulados,129 conferências,zero aprovações. Triagem193→191 sem proposições;77 localizadores. Regressão126 deltas/272 proposições/290 opções;composição e matriz100 preservadas. Relatório individual:REVISAO_ARTE_NAVAL_LOTE_052.md. Todos8gates pendentes/falhos.

## Lote053

Duas novas correções parciais;128 IDs acumulados,131 conferências,zero aprovações.Triagem191→190 sem proposições;77 localizadores.Regressão128 deltas/276 proposições/295 opções;composição e matriz100 preservadas.Relatório individual:REVISAO_ARTE_NAVAL_LOTE_053.md.QuatroPSCPP relacionadas permanecem pendentes;nenhuma correção/revisão integral contabilizada.Todos8gates pendentes/falhos.

## Lote054

Cinco novas correções parciais;133 IDs acumulados,136 conferências,zero aprovações.Triagem190→188 sem proposições;77 localizadores.Regressão133 deltas/288 proposições/305 opções;composição e matriz100 preservadas.Relatório individual:REVISAO_ARTE_NAVAL_LOTE_054.md.Regime de3modelos preservado.Todos8gates pendentes/falhos.

## Lote055

Duas novas correções parciais;135 IDs acumulados,138 conferências,zero aprovações.Triagem188→187 sem proposições;77 localizadores.Regressão135 deltas/292 proposições/310 opções;composição e matriz100 preservadas.Relatório:REVISAO_ARTE_NAVAL_LOTE_055.md.0253/0651fontependente semincremento,semquarentena.Todos8gates pendentes/falhos.

## Lote056

Cinco novas correções parciais;140 IDs acumulados,143 conferências,zero aprovações.Triagem187→185 sem proposições;77 localizadores.Regressão140 deltas/304 proposições/320 opções;composição e matriz100 preservadas.Relatório:REVISAO_ARTE_NAVAL_LOTE_056.md.Três modelos preservados.Todos8gatespendentes/falhos.

## Lote057

Cinco novas correções parciais;145 IDs acumulados,148 conferências,zero aprovações.Triagem185→184 sem proposições;77 localizadores.Regressão145 deltas/316 proposições/330 opções;composição e matriz100 preservadas.Relatório:REVISAO_ARTE_NAVAL_LOTE_057.md.Três modelos preservados;M1/M3jáparseados,não contados como restauração.Todos8gatespendentes/falhos.


# Lote 058 — servomotor elétrico por alavanca

Build completo isolado: `npm run build` exit0, compilação, lint/tipos,101 páginas/rotas confirmados; dependências locais, execução final com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. A primeira chamada por subprocess retornou0 sem evidência de compilação e foi rejeitada; a execução direta terminou0, mas sua saída foi truncada. A repetição com log integral confirmou as etapas, preservando as tentativas. O ENOTEMPTY antigo não é declarado resolvido.

Passaram as quatro gerações, validate-runtime-question-banks, validate-pscpp-exam-selection, test-question-source-provenance, validate-runtime-question-catalog, test-pscpp-audit-anv0005, triagem/inventário echeck:pscpp-bank. Regressão:151 deltas acumulados exatos,11.951 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;328 proposições renderizadas e345 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre057 e058,somente os seis IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;151 hashes corrigidos conferidos. Metadados de topo,0462,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado151 IDs distintos corrigidos,154 conferências primárias parciais,zero aprovações finais. Triagem182 sem proposições e77 localizadores:71 candidatos corrigidos+3 falsos positivos anteriores+182 restantes=256;80 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0269,atracação a contrabordo,Fonseca v2 12.37. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Relatório individual: `REVISAO_ARTE_NAVAL_LOTE_058.md`. Seis correções parciais;nenhuma aprovação final.


# Lote 059 — atracação a contrabordo

Build completo isolado com dependências locais: `npm run build` exit0,compilação,lint/tipos e101 páginas/rotas confirmados por log integral,com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. Não se declara resolvido o ENOTEMPTY antigo da árvore original.

Passaram as quatro gerações,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,triagem/inventário echeck:pscpp-bank. Regressão final:157 deltas acumulados exatos,11.945 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;340 proposições renderizadas e360 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre058 e059,somente os seis IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;157 hashes corrigidos conferidos. Metadados de topo,0468,versões físicas/efetivas de0073/0100,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado. A execução preliminar incompleta descrita acima não substitui estes resultados finais.

Acumulado157 IDs distintos corrigidos,160 conferências primárias parciais,zero aprovações finais. Triagem180 sem proposições e77 localizadores:73 candidatos corrigidos+3 falsos positivos anteriores+180 restantes=256;84 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0276,navio portando pela amarra,Fonseca v2 12.43. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Relatório individual: `REVISAO_ARTE_NAVAL_LOTE_059.md`. Seis correções parciais;nenhuma aprovação final.


# Lote 060 — navio fundeado e confirmação de garra

Build completo isolado com dependências locais: `npm run build` exit0,compilação,lint/tipos e101 páginas/rotas confirmados por log integral,com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. Não se declara resolvido o ENOTEMPTY antigo da árvore original.

Passaram as quatro gerações,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,triagem/inventário echeck:pscpp-bank. Regressão:162 deltas acumulados exatos,11.940 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;352 proposições renderizadas e370 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre059 e060,somente os cinco IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;162 hashes corrigidos conferidos. Metadados de topo,0475,versões físicas/efetivas de0102,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado162 IDs distintos corrigidos,165 conferências primárias parciais,zero aprovações finais. Triagem178 sem proposições e77 localizadores:75 candidatos corrigidos+3 falsos positivos anteriores+178 restantes=256;87 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0278,máquinas em sentidos opostos,Fonseca v2 12.15. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Relatório individual: `REVISAO_ARTE_NAVAL_LOTE_060.md`. Cinco correções parciais;nenhuma aprovação final.


## Lote061 — seis correções parciais

Gerados runtime PSCPP, bancos, catálogo e flashcards; validações de bancos, matriz de seleção, proveniência e catálogo passaram; check:pscpp-bank passou. Regressão acumulada:168 deltas exatos,11934 ocorrências de cadernos preservadas,364 proposições renderizadas e385 alternativas diretas preservadas. Frente ao checkpoint060,exatamente seis IDs mudaram; todos os1984 registros PSCPP e a composição14086=12102+1984 permaneceram iguais. Sem inclusão/exclusão de ID.27435 registros físicos e13715 IDs únicos mantidos.

Build completo npm run build passou em cópia isolada: compilação,lint/tipos,101/101 páginas e tabela de rotas confirmados no log integral. A primeira tentativa retornou0 com log vazio e não foi aceita como evidência; repetição direta teve saída integral. Todos os arquivos rastreados fora de docs e os seis artefatos gerados foram comparados byte a byte com a cópia testada. A triagem terminou0 com log vazio; o artefato foi conferido diretamente:176 candidatos sem proposições e77 por localizador.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero evidências finais aceitas/14086 pendentes. Critérios não relaxados. REVISOES_EDITORIAIS intacto. As162 correções anteriores permanecem exatamente iguais no ledger; seis novas elevam o acumulado a168,com171 conferências bibliográficas parciais eZERO aprovações finais. Dos256 candidatos originais,77 corrigidos+3 falsos positivos+176 restantes;91 correções fora dessa triagem,sem dupla contagem.

Próxima falha independente:ANV-0279,seguimento para vante com máquina atrás,Fonseca v2 12.6.3. Impedimentos0142/0840,0176/0874 e0253/0651 e reconciliação da fraseAR na fonte permanecem abertos. Publicação deste relatório e CHECKPOINT no mesmo commit da branch,com comparação da árvore Git local/remota e expected_sha sem force; o SHA definitivo é o commit que contém este arquivo.


## Lote062 — cinco correções parciais

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:173 deltas acumulados exatos,11929 ocorrências de cadernos preservadas,376 proposições renderizadas e395 alternativas diretas preservadas. Frente ao061,exatamente cinco IDs efetivos e cinco objetos do principal mudaram;168 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada pela validação pertinente.

Build completo npm run build passou em cópia isolada,com log integral confirmando compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados foram comparados byte a byte com a cópia testada. Não se confunde código de saída isolado com evidência de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato de triagem conferido diretamente:174 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS permaneceu byte a byte igual. Critérios não relaxados.

Acumulado sem recontagem:173 IDs corrigidos e176 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,79 corrigidos+3 falsos positivos+174 restantes;94 correções fora dessa triagem,79+94=173. Este lote acrescenta cinco correções e cinco conferências,sem recontar os168 IDs anteriores. Próxima falha independente:ANV-0283,virar a máquina de suspender,Fonseca10.32/10.36. Impedimentos0142/0840,0176/0874 e0253/0651,reconciliaçãoAR do061 e demais pendências globais preservados.


## Lote063 — sete correções parciais

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:180 deltas acumulados exatos,11922 ocorrências de cadernos preservadas,392 proposições renderizadas e410 alternativas diretas preservadas. Frente ao062,exatamente sete IDs efetivos e sete objetos principais mudaram;173 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada.

O primeiro ciclo de testes passou nos contratos pertinentes,mas a conferência final do distratorA de1036M2 explicitou redução obrigatória para evitar ambiguidade com uma redução apenas possível. Hashes atualizados e todos os15 comandos repetidos sobre a redação final. Build completo npm run build passou em cópia isolada com log integral:compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. Não se usa código de saída isolado como prova de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato conferido:173 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS byte a byte intacto. Critérios não relaxados.

Acumulado sem recontagem:180 IDs corrigidos e183 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,80 corrigidos+3 falsos positivos+173 restantes;100 correções fora dessa triagem,80+100=180. Este lote acrescenta sete correções e sete conferências,sem recontar os173 IDs anteriores. Próxima falha independente:ANV-0288,poleame de laborar,Fonseca9.1/9.3. Impedimentos0142/0840,0176/0874 e0253/0651,modelo1036M1 excluído,reconciliaçãoAR do061 e demais pendências globais preservados.


## Lote064 — oito correções parciais

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:188 deltas acumulados exatos,11914 ocorrências de cadernos preservadas,412 proposições renderizadas e425 alternativas diretas preservadas. Frente ao063,exatamente oito IDs efetivos e oito objetos principais mudaram;180 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada pela validação pertinente.

Build completo npm run build passou em cópia isolada com log integral:compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. Não se usa código de saída isolado como evidência de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato conferido:172 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS permaneceu byte a byte intacto. Critérios não relaxados.

Acumulado sem recontagem:188 IDs corrigidos e191 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,81 corrigidos+3 falsos positivos+172 restantes;107 correções fora dessa triagem,81+107=188. Este lote acrescenta oito correções e oito conferências,sem recontar os180 IDs anteriores. Próxima falha independente:ANV-0295,teste do aparelho de governo,Fonseca11.10. Impedimentos0142/0840,0176/0874 e0253/0651,modelo1036M1 excluído,reconciliaçãoAR do061 e demais pendências globais preservados.


## Lote065 — dois IDs novos,sem aprovação final

Base`96e55b1e04b66890e980057ef7597998d274adcf`;relatório REVISAO_ARTE_NAVAL_LOTE_065.md.190 correções/193 conferências/0aprovações;171 candidatos/77localizadores.

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validação runtime,seleção/matriz,proveniência,catálogo,regressão e check:pscpp-bank. Regressão confirmou190 deltas acumulados exatos,11912 ocorrências de cadernos preservadas,416 proposições renderizadas e430 alternativas diretas preservadas. Exatamente dois IDs efetivos e dois objetos principais mudaram frente ao064;1984 PSCPP intactos. População14086=12102+1984,13715IDs únicos,27435 registros físicos e matriz100=25/25/10/10/10/10/10 preservadas.

Build completo em cópia isolada passou com log integral:compilação,lint/tipos,101/101 páginas e rotas. Os1285 arquivos rastreados fora de docs e seis artefatos gerados coincidem byte a byte com os insumos/resultados testados. Avisos do build não impediram sucesso;nenhuma aprovação de release inferida.

Falhas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,0aceitas/14086pendentes. Triagem e inventário regenerados:171 candidatos sem proposições e77 localizadores. REVISOES_EDITORIAIS intacto. Resultados reais de cada comando:

| Comando | Saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|
