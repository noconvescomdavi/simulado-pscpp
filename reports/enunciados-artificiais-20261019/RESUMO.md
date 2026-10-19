# Auditoria transversal de enunciados artificiais — PSCPP

**Data:** 2026-10-19  
**Baseline:** `main` no commit `012b562b0eb6f7fec78773b339e4a53b3643e791` (GitHub).  
**Branch de relatório:** `audit/questoes-enunciados-genericos-20261019`.  
**Escopo:** 156 arquivos JSON de bancos principais, fontes `generated-batches`, `question-extensions`, `question-restorations`, `approved-drive-blocks`, arquivos PSCPP e importações/patches sob `data/`.

## Resultado global da triagem

| Conjunto | Arquivos | Registros percorridos | Ocorrências candidatas |
|---|---:|---:|---:|
| Manobrabilidade (banco principal) | 1 | 4.089 | 2.883 |
| Outros bancos principais | 6 | 9.569 | 1.488 |
| Fontes auxiliares | 149 | 11.892 | 1.525 |
| **Total** | **156** | **25.550** | **5.896** |

**Atenção:** contagem de OCORRÊNCIAS arquivo-ID, não necessariamente de IDs únicos do aplicativo: existem origens com questões repetidas, substituídas ou herdadas. Nem todas têm campo `active`. Aprovação editorial e atividade no runtime ainda não foram comprovadas para cada ocorrência.

### Sete bancos principais (13.658 registros, 4.371 candidatos)

| Banco | Registros | Sinalizadas |
|---|---:|---:|
| Manobrabilidade | 4.089 | 2.883 |
| Meteorologia e Oceanografia | 1.353 | 698 |
| Legislação e Regulamentação | 1.398 | 269 |
| Arte Naval | 2.272 | 172 |
| Conhecimentos Gerais | 1.231 | 132 |
| Comunicações | 1.235 | 120 |
| Navegação em Águas Restritas | 2.080 | 97 |

### Famílias de padrões sob revisão

1. **Modelo de tópico coringa:** "o tópico [assunto] precisa ser interpretado corretamente"; confirmado em 2.501 enunciados de Manobrabilidade principal, e também em lotes auxiliares.
2. **Conclusão abstrata:** "qual leitura evita uma interpretação hidrodinâmica incorreta?", "qual interpretação deve orientar a análise do oficial?", etc., sem delimitação técnica suficiente no próprio enunciado.
3. **Associação metalinguística:** "No contexto de [tópico], a associação [termo] é tecnicamente aplicável", com significado muitas vezes obscuro.
4. **Afirmativa padronizada:** "Sobre [termo], é tecnicamente correto afirmar:" repetida em itens de múltiplas proposições.
5. **Pseudo-contexto:** "na preparação de uma aula de revisão para o PSCPP" e contexto intercambiável que não altera a habilidade de fato avaliada.
6. **Pergunta vaga:** "Qual afirmação descreve corretamente [termo]?" sem objetivo operacional ou recorte técnico explícito.
7. **Meta-avaliação:** "relacione cinco conceitos examináveis de [obra]" em vez de formular um problema técnico.
8. **Comparação forçada:** referência a água calma e condição ambiental perturbada sem relação comprovada com o conceito interrogado.

Os detectores indicam **candidatura à revisão**, não a conclusão de que a questão tem alternativa errada. Algumas questões podem ser legítimas mesmo contendo uma das expressões.

### Evidências particulares

- `MAN-391`: "o tópico Corrente precisa ser interpretado corretamente. qual leitura evita uma interpretação hidrodinâmica incorreta?"
- `MAN-2001`: "na preparação de uma aula de revisão para o PSCPP, o tópico Curva de giro precisa ser interpretado corretamente..."
- `data/pscpp/generated-batches/batch_033.json`: perguntas com esse mesmo modelo estão declaradas `active: true` e `validation_status: approved`.
- Nos lotes `batch_024` a `batch_038`, a triagem detectou 50 de 50 questões em **cada lote**: alta concentração de templating.

## Relação de arquivos CSV

Todos os relatórios preservam os **IDs, arquivos de origem, enunciados integrais** e marcadores encontrados.

- [Manobrabilidade, banco principal](manobrabilidade.csv)
- [Outros seis bancos principais](outros-bancos-principais.csv)
- [Auxiliares 01](auxiliares-01.csv)
- [Auxiliares 02](auxiliares-02.csv)
- [Auxiliares 03](auxiliares-03.csv)
- [Auxiliares 04](auxiliares-04.csv)
- [Auxiliares 05](auxiliares-05.csv)
- [Auxiliares 06](auxiliares-06.csv)
- [Auxiliares 07](auxiliares-07.csv)
- [Auxiliares 08a](auxiliares-08a.csv)
- [Auxiliares 08b](auxiliares-08b.csv)
- [Auxiliares 09](auxiliares-09.csv)
- [Auxiliares 10](auxiliares-10.csv)

## Próximas exigências antes de reparar ou aprovar

1. Determinar o **conjunto efetivamente carregado em runtime** e a ordem de precedência entre `questions`, `generated-batches`, `extensions`, `restorations` e patches.
2. Deduplicar por ID e enunciado normalizado, **mantendo rastreabilidade da fonte** e registrando divergências entre cópias.
3. Revisão editorial e bibliográfica **questão a questão**; fundamentar a decisão em fonte, capítulo e conteúdo aplicável.
4. Reescrever enunciados vagos em perguntas náuticas tecnicamente delimitadas, preservando gabarito apenas quando for comprovadamente correto.
5. Revisar alternativas, gabarito, explicação, dificuldade e referência bibliográfica; nenhuma substituição automática com conteúdo inventado.
6. Identificar potenciais falsos positivos e falsos negativos pela revisão humana e aperfeiçoar detectores.
7. Executar testes de regressão, auditoria pós-reparo e validação editorial para evitar republicação dos mesmos modelos.

**Status da tarefa:** triagem automática concluída para os 156 arquivos neste inventário. **Não realizada** a aprovação editorial 100%, **não realizadas** alterações em bancos, gabaritos, produção ou merge.
