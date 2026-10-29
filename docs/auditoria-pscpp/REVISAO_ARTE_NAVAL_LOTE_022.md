# Lote 022 — corrente de descarga do hélice

Base remota c3ed67eb955d06c212acb6137c8c8c4456c3cd35; PR #172 aberto e draft.
HEAD/PR, CHECKPOINT.json e relatório 021 lidos antes das edições. Fast-forward
com árvore rastreada limpa; temporários preservados. Nenhum outro escritor
identificado na inspeção disponível; publicação protegida por lease. Continuação
do Prompt-Mestre conforme leitura integral anterior, sem repetir correções.

## Fonte e condições

Fonseca, Arte Naval, v. 2, 8ª ed., 2019, arts. 12.3 e 12.6.1, com apoio do
art. 12.5: pp. impressas 795–798 / PDF 156–159. Textos integrais e imagens
completas das quatro páginas inspecionados. Figuras 12-2a/b/c conferidas como
contexto das correntes nos dois sentidos de rotação; tabela da p.797 também
lida. Nenhuma figura precisa ser anexada para resolver os novos enunciados,
que fornecem o arranjo de leme a ré do propulsor e as condições do modelo.
Sem cálculo, unidades ou valores numéricos novos.
SHA-256 do PDF recalculado:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; livro/imagens privados.

A edição distingue a direção sensivelmente paralela ao eixo da sucção e a
participação da descarga no movimento rotativo das pás. Na marcha adiante,
a descarga incide no leme; dando atrás, é dirigida contra a popa, enquanto
a sucção passa pelo leme. Em 12.6.1, com o navio parado e leme carregado,
dar adiante pode iniciar a guinada pela descarga antes de ganhar velocidade.
A introdução de 12.6 desconsidera vento/corrente externos e exige experiências
em cada navio. Essas condições foram expressas nas questões/explicações.

## Precedência e identidade

ANV-0105 do JSON principal é uma composição V/F sobre círculo de giro no
fundeio e outros conceitos, já marcada como inativa/em quarentena. Essa versão
física permanece intacta, incluindo suas flags e motivo. O runtime inventariado
antes deste lote já consumia a restauração old-094 sobre corrente de descarga;
foi essa versão efetiva que se corrigiu. Não se reativou a versão física em
quarentena nem se acrescentaram IDs. A reconciliação global de versões/estados
continua pendente; o hash baseline prova a identidade da ocorrência já carregada.

ANV-0803 prevalece no JSON principal e foi corrigida ali. Nenhum dos dois
IDs consta de notebook-complete-stems. answer-leak-v1 removia as proposições
de 0105 e tornava os comandos genéricos. Corrigida a fonte prevalente de cada
ID, regenerado runtime e verificada igualdade de enunciado/explicação sem
reformulação posterior. Locator e tracking.section agora indicam os artigos
precisos consultados, em vez da referência ampla 12.6.

Preservados tópico old-094, IDs, cinco opções e keys E/C. A combinada mantém
formato B; a direta passa de definição genérica a explicação contextual do
mesmo mecanismo, formato A. O rótulo legado Associação conceitual de 0803
permanece por compatibilidade; a classificação principal aqui é direta/contextual.
Nenhum normalizador alterado.

## ANV-0105 — julgamento individual

I verdadeira (12.6.1, p.798): descarga na porta do leme carregado pode iniciar
a guinada partindo do repouso. II falsa (12.3, p.795): a descarga participa do
movimento rotativo das pás. III falsa (12.3, p.796): dando atrás, a descarga
vai contra a popa; não se deve confundi-la com a sucção que passa pelo leme.
IV verdadeira (12.3, p.795): conserva a qualificação sensivelmente paralela
da sucção e a participação rotativa da descarga. Vetor V/F/F/V.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/III | III falsa; falta IV |
| B | III/IV | III falsa; falta I |
| C | II/III | Ambas falsas; faltam I/IV |
| D | II/IV | II falsa; falta I |
| E | I/IV | Único conjunto completo das verdadeiras |

## ANV-0803 — julgamento individual

O cenário define um hélice, leme a ré do propulsor, repouso inicial, leme
carregado antes de dar adiante e ausência de vento/corrente externos. Pergunta
pelo mecanismo que pode iniciar a guinada, sem prometer igual resposta para
todo navio ou condição real. Não se introduz recomendação de potência operacional.

| Opção | Julgamento |
|---|---|
| A | Falsa: confunde descarga com sucção; esta é sensivelmente paralela ao eixo em AV, 12.3 |
| B | Falsa: esteira descrita em 12.5 depende do deslocamento do casco; não explica o efeito inicial pelo hélice |
| C | Única correta: incidência da descarga no leme carregado, 12.6.1 |
| D | Falsa: inverte a comparação de forças que a obra faz nessa situação; descarga no leme supera pressão lateral |
| E | Falsa: descarta o governo inicial por água posta em movimento pelo hélice, 12.6.1 |

Dez justificativas específicas. Distratores comparam mecanismos e condições
de escoamento; não são nomes heterogêneos ou tautologias. L2/Médio proposto
pela compreensão causal, sem medição psicométrica ou calibração global aprovada.

## Sobreposição e limites

Busca old-094 no runtime encontrou este par, lido integralmente. As duas
variantes compartilham competência e não devem coexistir na mesma prova.
Prevenção global de coexistência e deduplicação semântica completa continuam
pendentes; busca por código não prova ausência de sobreposição com outros
códigos. Quantidade de modelos existentes preservada; nenhum ID novo.

Acumulado 37 correções primárias e 40 conferências parciais; ZERO aprovações
editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json; conferências
em CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Rechecagem independente, proveniência/
alinhamento oficial do programa/edital, cobertura integral, reconciliação de
estados, unicidade global e offline/produção pendentes. Resultados reais em
TESTES_E_EVIDENCIAS.md. Sem merge, deploy desta auditoria ou dados de usuários.
