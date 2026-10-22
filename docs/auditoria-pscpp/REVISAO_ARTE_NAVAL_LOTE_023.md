# Lote 023 — correr com o tempo

Base remota fb96358904475757c9c8dd85a9502536da66b8d6; PR #172 aberto e draft.
HEAD/PR, CHECKPOINT.json e relatório 022 consultados antes de editar.
Fast-forward com árvore rastreada limpa; temporários preservados. Nenhum outro
escritor identificado na inspeção disponível; publicação protegida por lease.
Prompt-Mestre mantido conforme leitura integral anterior, sem refazer lotes.

## Fonte, contexto e limite da conferência

Fonseca, Arte Naval, v. 2, 8ª ed., 2019, art. 12.86, pp. impressas 933–935 /
PDF 294–296; contraste com capear, art. 12.85, p.932 / PDF293. Texto integral
e imagens completas das quatro páginas lidos/inspecionados. Figura 12-56,
p.935, mostra a âncora flutuante de 12.87; não é necessária para resolver
as questões deste lote, que não pedem identificar equipamento ou medir figura.
SHA-256 do volume recalculado:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; livro/imagens privados.

A abertura de 12.86 descreve mar na alheta com velocidade reduzida ou
abatimento com máquina parada e mar de popa. O texto contrapõe essa acepção
à antiga pretensão de fugir às ondas em grande velocidade. A p.934 ressalva
expressamente que as diferenças de vento/mar e de formas/dimensões dos navios
impedem regras rígidas para todos os casos. A discussão também considera carga
e trim. Esses limites estão nos novos enunciados e comentários.

A antiga justificativa misturava recomendações como surf-riding e guinadas
bruscas sem individualizar o suporte no item apontado. O início da p.933,
sobre guinadas ao desfazer a capa, é continuação de 12.85; não foi atribuído
indistintamente a 12.86. Os novos gabaritos dependem da definição e da ressalva
localizadas, sem introduzir velocidade, ângulo ou ajuste operacional numérico.

Pendência bibliográfica específica: o último parágrafo da p.933 associa o
adjetivo duros a pequena altura metacêntrica; a associação requer rechecagem
terminológica/técnica e eventual confronto de edição/errata. Aqui se registra
a leitura efetiva da página, sem declarar essa associação validada ou atribuir
uma correção silenciosa ao autor. Não é premissa nem resposta das duas questões.
Esta conferência parcial não aprova integralmente o artigo nem uma conduta
universal para enfrentar temporal.

## Precedência, identidade e estados

ANV-0108 principal é uma composição sobre hélice de passo controlado e outros
conceitos, marcada active=false/status=quarantined. Essa versão e suas flags
permanecem intactas. A restauração old-152 sobre correr com o tempo já era
consumida pelo runtime antes deste lote; foi corrigida em seu lugar. Nenhum ID
foi ativado/removido; reconciliação global de versões/estados continua pendente.

ANV-0806 prevalece no JSON principal e foi corrigida ali. Nenhum dos dois IDs
aparece em notebook-complete-stems. answer-leak-v1 retirava as proposições de
0108 e deixava comandos genéricos. Fontes prevalentes editadas; runtime
regenerado; igualdade enunciado/explicação e ausência de reformulação posterior
verificadas. Na primeira regeneração, hasLocatorDependentStem interpretou
regra inflexível como coordenada (regra + inicial romana I); faltava um
objeto explícito reconhecido pelo normalizador. O fallback substituiu o
enunciado por um comando genérico com aspas, e a política o excluiu.
O comando foi ajustado para Sobre a manobra de correr com o tempo, mantendo
a análise das quatro proposições. Nova geração e regressão confirmaram
12.102 cadernos e a preservação integral das quatro proposições. Nenhum
normalizador ou filtro global foi relaxado. Locator/tracking.section detalhados para o recorte consultado.
Preservados IDs, tópico, formatos principais B/A e keys C/A. Rótulo legado
Associação conceitual de 0806 mantido por compatibilidade de filtros; a versão
é classificada como direta/contextual. Nenhum normalizador alterado.

## ANV-0108 — julgamento individual

I verdadeira: possibilidade da definição de 12.86, p.933. II falsa: igualar
velocidades para fugir às vagas não é exigência da acepção adotada. III falsa:
a p.934 rejeita conduta rígida independente do navio e do mar. IV verdadeira:
abatimento com máquina parada e mar de popa consta da definição, lida junto
das ressalvas de variabilidade. Vetor V/F/F/V; apenas I/IV é conjunto completo.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | II/IV | II falsa; falta I |
| B | I/II | II falsa; falta IV |
| C | I/IV | Único conjunto completo das verdadeiras |
| D | III/IV | III falsa; falta I |
| E | II/III | Ambas falsas; faltam I/IV |

## ANV-0806 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Única correta: reúne as possibilidades da definição, respeitadas as ressalvas |
| B | Falsa: descreve capear, art.12.85, p.932 |
| C | Falsa: recupera a pretensão de igualar velocidades para fugir às vagas |
| D | Falsa: exclui indevidamente máquina parada, admitida na definição |
| E | Falsa: transforma uma possibilidade em solução invariável e ignora casco/trim |

Os distratores testam confusão entre manobras, interpretação histórica,
omissão de alternativa prevista e generalização indevida. Dez justificativas
específicas. L2/Médio proposto para compreender as condições e limites da
definição, sem dificuldade psicométrica medida ou calibração global aprovada.
Sem cálculo novo, números operacionais ou alegação de vigência normativa.

## Sobreposição e pendências

Busca old-152 no runtime encontrou este par; ambos lidos individualmente.
Compartilham competência e não devem coexistir na mesma prova. Prevenção global
de coexistência e deduplicação semântica integral pendentes; busca por código
não prova ausência de variantes com outros códigos. Quantidade de modelos
existentes preservada, sem criação de IDs.

Acumulado 39 correções primárias e 42 conferências parciais; ZERO aprovações
editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json; conferências
em CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Rechecagem independente, alinhamento ao
programa/edital oficial, cobertura, estados globais e offline/produção pendentes.
Resultados reais em TESTES_E_EVIDENCIAS.md. Sem merge, deploy ou dados de usuários.
