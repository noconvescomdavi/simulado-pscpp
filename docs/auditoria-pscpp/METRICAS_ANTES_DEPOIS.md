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
