# Lote 002 — três correções primárias de Arte Naval

IDs: ANV-0007, ANV-0016 e ANV-0023. São correções individualizadas, não
restauração cega do texto anterior. Preservados IDs, cinco opções e respectivas
letras de resposta B/A/C. Formato principal B nos três casos. Nenhum registro
foi aprovado para release; faltam rechecagem independente e alinhamento final
da versão oficial de programa/edital, além dos gates globais.

## Fonte e precedência

Fonseca, Arte Naval, volume 1, 8ª edição revista e ampliada, SDM, 2019.
Drive `1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N`.
SHA-256 `792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20`.
Título/ficha, textos e páginas renderizadas conferidos.

| ID | Competência | Artigos | Página impressa / PDF | Nível |
|---|---|---|---|---|
| ANV-0007 | Concentração de esforço e local de ruptura | 8.2 | 536–537 / 534–535 | L2 |
| ANV-0016 | Emprego e forma de portar a boca de lobo singela | 8.14, fig. 8-13 | 541 / 539 | L2 |
| ANV-0023 | Configuração e uso da encapeladura dobrada | 8.19–8.20, figs. 8-18/19 | 544 / 542 | L1 |

As três versões efetivas provêm de `data/question-restorations/arte-naval.json`,
que substitui o registro principal pelo mesmo ID antes da normalização. A
correção foi feita nessa fonte prevalente. Em ANV-0007 o registro principal
trata de catau de reboque, mas o runtime já tratava de resistência de amarrações;
o conceito efetivamente servido foi mantido. A versão principal não foi apagada
nem usada para mudar silenciosamente o conceito do ID. Inventário registra as
duas versões, hashes e ponteiros. Histórico de respostas no SQL não foi alterado.

O normalizador removia proposições por causa das citações entre aspas. Os novos
comandos e proposições explicitam o objeto técnico sem o molde artificial de
atribuir definições de outros nós a um nome de propriedade. Nenhuma regra global
do normalizador foi alterada e nenhum teste legado foi relaxado.

## Conferência das proposições

ANV-0007: F/V/V/F. I confunde a distribuição no vivo com a região curvada;
II explica a sobrecarga localizada; III aponta a ruptura provável na amarração;
IV inverte o mecanismo ao atribuir proteção e aumento de resistência às dobras.
Não são inferidos percentuais universais nem cargas operacionais da discussão
qualitativa. A tabela da página 537 foi inspecionada, mas não usada para fabricar
um fator uniforme ou extrapolar de cabo novo para cabo de serviço.

ANV-0016: V/F/F/V. I e IV descrevem as ligações previstas. II exclui o
carregamento por um só chicote, expressamente admitido. III inverte a comparação
de segurança com voltas mordidas em gatos. A comparação bibliográfica não
substitui avaliação de segurança de uma operação de içamento real.

ANV-0023: V/F/F/V. I e IV identificam uso ornamental e três seios. II reduz
indevidamente o número a dois. III transfere a finalidade de aguentar mastro ou
antena da singela para a dobrada, contrariando seu emprego ornamental.

## Todas as alternativas

| ID | A | B | C | D | E |
|---|---|---|---|---|---|
| ANV-0007 | III+IV: IV falsa; falta II | II+III: única correta | I+III: I falsa; falta II | I+IV: ambas falsas | I+II: I falsa; falta III |
| ANV-0016 | I+IV: única correta | I+III: III falsa; falta IV | II+III: ambas falsas | I+II: II falsa; falta IV | III+IV: III falsa; falta I |
| ANV-0023 | III+IV: III falsa; falta I | I+III: III falsa; falta IV | I+IV: única correta | I+II: II falsa; falta IV | II+IV: II falsa; falta I |

Os níveis e rótulos de dificuldade são julgamentos editoriais coerentes com o
benchmark, não medidas de desempenho: propriedades causais/comparativas L2,
reconhecimento de configuração L1. Quatro proposições não tornam o item Difícil
por si só. Competências específicas distintas das de ANV-0005; revisão global
de duplicidades semânticas e regras de rotação ainda pendentes.

## Validação e rastreabilidade

`CORRECOES_RUNTIME.json` fixa hashes anteriores/posteriores por consumidor/ID.
O teste iniciado em ANV-0005 foi ampliado para verificar exatamente os quatro
IDs documentados, não aceitar qualquer mudança adicional. Confere as cinco
justificativas, quatro proposições por item no componente real e metadados.
O teste geral de enunciados ainda falha, agora em ANV-0020. Retomar pelo defeito
seguinte sem converter o avanço de posição da falha em aprovação do banco.

Uma revalidação lógica separada do gabarito armazenado recompõe o conjunto
correto a partir dos vetores de verdade conferidos na obra e verifica que uma
única opção o representa. Os vetores estão vinculados aos hashes exatos dos
enunciados. Isso detecta incoerência de combinações, mas não torna a leitura
manual prova automática nem equivale a revisão por um segundo especialista;
a rechecagem editorial independente continua indicada como pendência.

O build iniciado no lote anterior é inconclusivo para este lote porque seus
insumos mudaram durante a auditoria. Não usar seu eventual sucesso como
aprovação da árvore atual; executar build novo em checkpoint estável. Gates
de evidência e merge seguem fechados.
