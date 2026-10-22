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
