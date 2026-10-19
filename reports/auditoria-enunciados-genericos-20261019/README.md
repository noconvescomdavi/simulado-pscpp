# Auditoria de enunciados genéricos — PSCPP (2026-10-19)

Base: commit `012b562b0eb6f7fec78773b339e4a53b3643e791` (`main`). **Apenas identificação; nenhuma questão foi alterada.**

## Resultado

- **4385 ocorrências sinalizadas nas fontes**; **4327 IDs distintos**.
- Bancos principais: 4076 IDs (alta suspeita: 2809; média: 1267).
- Restaurações: 101 registros; blocos aprovados: 208; extensões: 0; fontes de geração/imports: 0.
- **58 referências duplicadas a IDs entre fontes.** Essas contagens não equivalem ao volume de questões ativas no sistema.

## Bancos principais

| Disciplina | Examinadas | Sinalizadas |
|---|---:|---:|
| Manobrabilidade | 4089 | 2888 |
| Arte Naval | 2272 | 156 |
| Navegação em Águas Restritas | 2080 | 86 |
| Legislação e Regulamentação | 1398 | 163 |
| Meteorologia e Oceanografia | 1353 | 558 |
| Comunicações | 1235 | 109 |
| Conhecimentos Gerais | 1231 | 116 |

## Relatórios detalhados

- [Resumo JSON](resumo-final.json)
- [Índice de IDs dos bancos principais](indice-ids-bancos-principais.json)
- CSV dos bancos principais: arquivos que começam com `base-` (incluem o enunciado completo e referência bibliográfica).
- [Restaurações — parte 1](restorations-parte-01.csv) e [parte 2](restorations-parte-02.csv)
- [Blocos aprovados — ocorrências originais](approved-blocks-parte-02.json) e [cenários genéricos adicionais](approved-blocks-cenario-generico-adicional.json)
- Extensões e fontes geradas: seus arquivos `*-resumo-*.json` discriminam as fontes examinadas, mesmo quando não houve ocorrência.

## Interpretação

- Classe **ALTA**: perguntas montadas a partir de tópico + instrução genérica ou pseudocontexto sem pergunta técnica concreta; inclui enunciados como o exemplo **MAN-2537**.
- Classe **MÉDIA**: formulações metalinguísticas, afirmações de “relação técnica aplicável” ou cenários narrativos artificiais — necessitam validação editorial humana.
- Esta identificação não comprova erros de gabarito nem dispensa verificação bibliográfica questão a questão; o estado `active` de cada fonte não equivale ao estado de seleção no runtime.

Nenhuma alteração foi aplicada às questões, aos gabaritos ou ao banco SQL. Não foi realizado merge.
