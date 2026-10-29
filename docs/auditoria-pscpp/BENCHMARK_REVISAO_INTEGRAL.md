# Benchmark histórico — classificação após leitura integral

264 registros conferidos: 255 corpos disponíveis lidos integralmente e nove
avisos de anulação sem corpo. Os 254 válidos têm gabarito observado reconciliado
com a marcação primária (X em 2006/2008; vermelho em 2011/2012). Não se alega
revalidação técnica contra bibliografia atual, nem aprovação do banco autoral.

Evidência individual: `REVISAO_HISTORICA_MANUAL.tsv`, unido a hashes, páginas,
marcações e classificação anterior em `BENCHMARK_264.csv`. O dicionário define
competência predominante, formato, nível e idioma. Os dois arquivos de
`CONFERENCIA_VISUAL*` registram tabelas, figuras e defeitos. Textos completos
das provas não são republicados.

| Ano | Itens | Válidos | Anulados | Corpos lidos | Pontos válidos | Pontos anulados |
|---|---:|---:|---:|---:|---:|---:|
| 2006 | 70 | 70 | 0 | 70 | Não indicados | Não indicados |
| 2008 | 73 | 68 | 5 | 68 | 65 | 5 |
| 2011 | 71 | 67 | 4 | 67 | 65,2 | 4,8 |
| 2012 | 50 | 49 | 1 | 50 | 68,7 | 1,3 |
| Total | 264 | 254 | 10 | 255 | Não agregar escalas | Não agregar escalas |

Anulações: 2008 Q14/18/20/45/51; 2011 Q28/33/45/56; 2012 Q7. Esta última
conserva texto e alternativas, com justificativa de erro “pode” por “popa”.
2011 Q24 informa alteração D→A. Não atribuir resposta à questão anulada.

## Formatos válidos

| Formato | Hipótese anterior | Leitura manual | Percentual |
|---|---:|---:|---:|
| A — direta/contextual | 149 | 149 | 58,66% |
| B — conjuntos de afirmativas | 61 | 55 | 21,65% |
| C — V/F ou C/E | 18 | 21 | 8,27% |
| D — lacunas | 20 | 22 | 8,66% |
| E — associação | 6 | 7 | 2,76% |

Oito alterações em relação à planilha: 2008 Q11 B→D, Q27 B→E, Q37 A→C;
2011 Q16 B→D, Q17 B→A, Q43 B→C, Q47 B→A, Q68 A→C. A coincide por
compensação, não por identidade dos registros. Q17 pede resultados de cálculo;
Q47 ordena métodos por precisão. A heurística ainda as classifica B e é
preservada separadamente, sem prevalecer sobre a leitura.

Maiores restos em lote de 100: **59/22/8/8/3**. Referência descritiva, não quota
implementada nem meta global já aprovada. Obras e competências devem comportar
variedade real, com itens validados. A matriz do simulado permanece
25/25/10/10/10/10/10; distribuição histórica não substitui programa vigente.

## Matéria × ano — contagens válidas

| Competência principal | 2006 | 2008 | 2011 | 2012 | Total |
|---|---:|---:|---:|---:|---:|
| Manobrabilidade | 34 | 25 | 23 | 18 | 100 |
| Navegação em Águas Restritas | 13 | 21 | 23 | 18 | 75 |
| Legislação | 5 | 8 | 6 | 5 | 24 |
| Arte Naval | 6 | 8 | 5 | 5 | 24 |
| Meteorologia e Oceanografia | 7 | 3 | 5 | 2 | 17 |
| Comunicações | 5 | 3 | 5 | 1 | 14 |
| Conhecimentos Gerais | 0 | 0 | 0 | 0 | 0 |

Obra citada não define competência: comando/forças de rebocadores ficam em
Manobrabilidade; configuração construtiva em Arte Naval; fenômeno de maré em
Meteorologia, mas janela de passagem em Navegação. CGE não é categoria residual.
Diferenças frente à hipótese 101/70/25/22/22/13/1 são rastreáveis por item e
critério, não autorizam suprimir disciplina do programa atual.

## Matéria × pontos válidos

| Competência principal | 2008 | 2011 | 2012 |
|---|---:|---:|---:|
| Manobrabilidade | 23,1 | 24,3 | 26,6 |
| Navegação em Águas Restritas | 21 | 23 | 26,6 |
| Legislação | 8 | 4,7 | 5,6 |
| Arte Naval | 7,5 | 4,3 | 5,4 |
| Meteorologia e Oceanografia | 3 | 5,4 | 2,9 |
| Comunicações | 2,4 | 3,5 | 1,6 |
| Total válido | 65 | 65,2 | 68,7 |

2006 não informa pesos. Não imputar pontos unitários como oficiais.
2008/2011/2012 somam 70 cada incluindo anulações.

## Nível e idioma

Julgamento editorial, não dificuldade psicométrica: L1=63 (24,80%), L2=99
(38,98%), L3=70 (27,56%), L4=22 (8,66%). Maiores restos para referência de
100 itens: 25/39/27/9. Não converter em pesos de nota nem probabilidades de
acerto sem dados de desempenho. Idiomas: português 200, inglês 42, misto 12.
Termos ingleses isolados não tornam o texto misto. Por ano, ver JSON; não impor
quota uniforme de inglês, ausente integralmente em 2011/2012.

## Especificação editorial derivada

- Conservar condições decisivas: marcha, rotação, ponto de observação,
  profundidade, seguimento, posição do cabo e limitações do canal.
- Casos inéditos devem exigir transferência de conhecimento: sensores
  independentes, geometria de encontros, maré ou escolha funcional de rebocador.
  Extensão e idioma, isoladamente, não justificam L4.
- Distratores alteram relações verificáveis: sinal da correção magnética,
  alcance geográfico/luminoso, água/fundo, diâmetro tático/final, órgão/atribuição,
  ação direta/indireta. Justificar o erro local de cada um na revisão.
- B exige todas as proposições; C, sequência inequívoca; D, lacunas dependentes;
  E, regra expressa para repetições e elementos sem correspondente.
- Especificar fonte verdadeira, edição e dados suficientes. Não copiar prova
  nem reproduzir defeitos históricos: distratores duplicados (2008 Q27),
  III repetido (2008 Q50), fragmentos/intrusões (2006 Q26/Q66), repetição
  de frase (2011 Q25) ou erro causador de anulação (2012 Q7).

Ressalvas históricas como 2011 Q64 (capacidade ilimitada do AIS numa opção não
marcada) permanecem sem endosso técnico. PDF 2012 emite aviso de configuração
de camadas ausente em Poppler/MuPDF; aviso registrado, páginas críticas vistas.

Reprodução: `python3 scripts/audit-pscpp-historical-benchmark.py /caminho/do/dossie`.
Dependências: Poppler, openpyxl para leitura da planilha e PyMuPDF. Hash mudado,
gabarito ambíguo/divergente e classificação inválida interrompem o comando.
Extração integral opcional só pode ser gravada fora do repositório.
