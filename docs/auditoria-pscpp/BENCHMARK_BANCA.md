# Benchmark histórico — recomputação estrutural provisória

As quatro provas foram extraídas integralmente com `pdftotext -layout`. O script
recupera a sequência completa de numeração e as cinco alternativas de todos os
itens válidos. Isso não equivale à releitura editorial integral de cada prova.
Essa releitura e a classificação independente de matéria, habilidade, idioma e
nível cognitivo continuam pendentes. Não impor metas editoriais a partir destes
resultados antes de concluir a conferência.

| Ano | Itens | Válidos | Anulados | Pontuação total |
|---|---:|---:|---:|---:|
| 2006 | 70 | 70 | 0 | Não indicada |
| 2008 | 73 | 68 | 5 | 70 |
| 2011 | 71 | 67 | 4 | 70 |
| 2012 | 50 | 49 | 1 | 70 |
| Total | 264 | 254 | 10 | Não agregar escalas de anos diferentes |

Anulações: 2008 Q14/18/20/45/51; 2011 Q28/33/45/56; 2012 Q7.
O cabeçalho de 2011 Q24 registra alteração de gabarito de D para A.
Nos PDFs de 2011/2012, cores também identificam gabaritos: a extração textual
não basta para conferir essas marcações. A verificação integral dos gabaritos
visuais ainda precisa ser realizada.

| Formato | Classificação anterior | Recomposição estrutural | Percentual válido |
|---|---:|---:|---:|
| A — direta/contextual | 149 | 147 | 57,87% |
| B — afirmativas combinadas | 61 | 57 | 22,44% |
| C — V/F ou C/E | 18 | 21 | 8,27% |
| D — lacunas | 20 | 22 | 8,66% |
| E — associação | 6 | 7 | 2,76% |

Diferenças rastreáveis: 2008 Q11 (B→D), Q27 (B→E), Q37 (A→C);
2011 Q16 (B→D), Q43 (B→C), Q68 (A→C). Q27 pede correspondência de
descrições a nomes de voltas, e não julgamento de verdade de proposições.
A regra para esse caso está explícita no script. As páginas de 2008 Q11 e
2011 Q43 foram também renderizadas e conferidas visualmente nesta etapa.

Método: a resposta solicitada define o formato principal; a simples presença
de algarismos romanos não torna o item B. Sequências de C/E são C; sentenças
enumeradas com espaços a preencher são D; mapeamento definição→termo é E.
Palavras como “associado” em meteorologia não caracterizam associação de colunas.

A matriz disciplinar histórica do código (`HISTORICAL_SUBJECT_COUNTS`) difere
da planilha anexada. Nenhuma das duas foi escolhida como verdade nesta etapa.
`subject_previous_unverified` identifica valores herdados, não revalidados.
A matriz obrigatória de simulados 25/25/10/10/10/10/10 foi preservada.

Reprodução: `python3 scripts/audit-pscpp-historical-benchmark.py /caminho/do/dossie`.
Fontes, páginas, hashes e divergências: `BENCHMARK_264.csv` e `BENCHMARK_DADOS.json`.
