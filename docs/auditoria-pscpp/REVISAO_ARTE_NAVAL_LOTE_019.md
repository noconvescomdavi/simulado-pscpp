# Lote 019 — ANV-0092, ANV-0790 e ANV-0964

Base remota 6aa02164535a8c790d68bd61a5d290a9647151a3; PR #172 aberto e draft.
HEAD/PR, checkpoint e relatório 018 consultados antes das edições; árvore
rastreada limpa após fast-forward, sem outro escritor identificado em /proc.
Temporários preservados. Continuação do Prompt-Mestre e do checkpoint prevalente.

## Fonte e erro técnico

Fonseca, Arte Naval, v. 2, 8ª edição, 2019, art. 12.73.c, p. impressa 911 /
PDF 272. Texto e imagem da página conferidos. Contexto 12.73.a/b e figura 12-50
inspecionados: a figura ilustra o recebimento do dispositivo, não a construção
do fusível. Texto e imagem da página 912 / PDF 273 conferidos para distinguir
mensageiro, cabo de leva e trapa (itens d/e/f). Nenhuma figura é necessária
para resolver as questões corrigidas; nenhuma imagem do livro é publicada.
SHA-256 recalculado do volume:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec.

As três versões efetivas atribuíam ao fusível a função de elo sacrificial.
O artigo descreve um fio em cada extremidade, indicador da aproximação do
limite de alongamento do náilon. Alongamento superior a 25% do comprimento
inicial pode causar perda permanente da capacidade de tração. O texto aplica
a mesma finalidade aos viradores de náilon. Não foi inferida carga de ruptura,
modo de instalação do fio ou ruptura obrigatória do cabo.

## Precedência e identidade

ANV-0092: o JSON principal contém outro enunciado, sobre catenária; prevalece
a restauração old-141. Corrigida a restauração, mantendo B e as cinco combinações.
ANV-0790/0964: prevalecem os registros do JSON principal; corrigidos ali,
mantendo E/D. Nenhum dos três tem patch em notebook-complete-stems.
Regenerado runtime; regressão confirma igualdade dos enunciados/explicações
com a fonte editada e ausência de reformulação em massa posterior.
IDs, assunto, tópico old-141 e estilos preservados: combinadas, associação
conceitual e situação aplicada. Dificuldade proposta Médio; L2, L2 e L3,
respectivamente. Classificação não substitui medição psicométrica.

## ANV-0092 — julgamento individual

I verdadeira: conserva tanto a base inicial de 25% como a possibilidade,
não certeza, de perda permanente. II verdadeira: indicador nas duas extremidades.
III falsa: provocar ruptura do cabo não é a função apresentada. IV falsa:
viradores de náilon também empregam fusíveis. Vetor V/V/F/F.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | II/IV | IV falsa; falta I |
| B | I/II | Único conjunto completo das verdadeiras |
| C | I/IV | IV falsa; falta II |
| D | II/III | III falsa; falta I |
| E | I/III | III falsa; falta II |

## ANV-0790 — julgamento individual

| Opção | Descrição | Julgamento |
|---|---|---|
| A | Passagem do cabo de leva entre navios | Mensageiro, 12.73.d, p. 912 |
| B | Passagem do cabo de reboque ao rebocado | Cabo de leva, 12.73.e, p. 912 |
| C | Pagamento durante passagem do dispositivo | Trapa, 12.73.f, p. 912 |
| D | Trecho adicional para peso/fixação | Virador, 12.73.b, p. 911 |
| E | Fio indicador de aproximação do limite | Única definição do fusível, 12.73.c |

As cinco alternativas expressam funções; nenhuma é resolvida apenas por
repetir o nome do tópico. Não se exige decorar numeração de artigo.

## ANV-0964 — julgamento individual e cálculo

Cenário expressamente hipotético: comprimento inicial 100 m, final 126 m.
Alongamento = (126 − 100)/100 × 100 = 26%, superior a 25%.
A base incorreta final daria 26/126 × 100 ≈ 20,6%; isso não aplica o critério
bibliográfico. Não se apresenta o cenário como ensaio real, limite legal
atual de toda fibra ou diagnóstico inevitável de ruptura.

| Opção | Julgamento |
|---|---|
| A | Falsa: atribui função sacrificial não descrita ao fio |
| B | Falsa: confunde com o mensageiro, 12.73.d |
| C | Falsa: cálculo correto, mas exclui indevidamente os viradores de náilon |
| D | Única correta: 26% sobre base inicial, indicação e perda apenas possível |
| E | Falsa: usa comprimento final no denominador |

Cinco justificativas específicas por questão. O contrato de regressão direta,
antes restrito a ANV-0765, agora enumera expressamente também 0790/0964,
verifica cinco opções únicas e preservadas pelo adaptador público e o cálculo
100→126 m. Mantém o contrato de quatro proposições para as combinadas e
as verificações de todos os demais registros. Nenhum normalizador foi alterado.
A regressão não prova a verdade primária nem aprovação editorial.

## Competência e limites

Busca por old-141 no runtime encontrou exatamente estes três registros,
todos lidos individualmente. O erro compartilhado foi corrigido no mesmo lote.
Preservadas as três variantes já existentes para o item; elas compartilham
competência e não devem coexistir na mesma prova. Impedimento global de
coexistência e deduplicação semântica integral continuam pendentes; a busca
por código não comprova ausência de sobreposição com outros códigos.

Acumulado: 29 correções e 32 conferências primárias parciais; zero aprovações
editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json e conferências
em CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Rechecagem independente, aderência ao
programa/edital oficial, cobertura global e offline/produção pendentes.
Sem merge, deploy desta auditoria ou alteração de dados de usuários.
Resultados reais dos testes em TESTES_E_EVIDENCIAS.md.
