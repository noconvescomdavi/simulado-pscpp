# Lote 021 — atracação mediterrânea

Base remota b7770e453fe20b425d961f778e7b141616ff28b6; PR #172 aberto e draft.
HEAD/PR, CHECKPOINT.json e relatório 020 consultados antes de editar.
Fast-forward com árvore rastreada limpa; temporários preservados. Nenhum outro
escritor identificado na inspeção disponível; publicação protegida por lease.
Prompt-Mestre mantido conforme leitura integral anterior. Sem repetir lotes.

## Fonte e precedência

Fonseca, Arte Naval, v. 2, 8ª ed., 2019, art. 12.38, p. impressa 838 / PDF 199.
Texto integral e imagem completa da página inspecionados. Continuação na p.839 /
PDF200 e figura 12-19 também lidas/inspecionadas para conferir contexto da
aproximação e ângulo entre amarras. Nenhuma questão exige figura anexada ou
medição do diagrama. O exemplo dimensional da figura não foi convertido em
exercício nem certificado como cálculo geral; os dados específicos desse
exemplo não são usados nas respostas. Não há cálculo novo nas questões.
SHA-256 do PDF recalculado:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; livro/imagens privados.

ANV-0100 principal é uma composição sobre contrabordo e outros conceitos;
a restauração old-116, atracação mediterrânea, prevalece. Corrigida essa
restauração, mantendo ID, formato combinado, cinco combinações e key E.
ANV-0798 prevalece no JSON principal; corrigida ali, mantendo ID e key C.
Nenhum dos dois IDs aparece em notebook-complete-stems. answer-leak-v1
retirava as proposições de 0100 e deixava ambos os comandos genéricos.
Regressão verifica igualdade fonte/runtime e ausência dessa reformulação
posterior nas versões corrigidas; nenhum normalizador alterado.

A definição anterior admitia qualquer extremidade junto ao cais. A descrição
efetivamente localizada especifica popa por espias e dois ferros a vante,
com possibilidade posterior de substituição pelo dispositivo permanente.
Trocada a afirmação genérica de maximização por conteúdo concreto: espaço
para giro ao suspender, rajadas de través, abertura e cálculo do filame.

## ANV-0100 — julgamento individual

I falsa: estaiar a proa não anula a advertência de insegurança sob fortes
rajadas de través. II verdadeira: na configuração inicial com os próprios
ferros, popa por espias, dois ferros a vante e navio perpendicular ao cais.
A condição inicial não exclui as amarretas permanentes que podem ser
transferidas depois, conforme o artigo. III verdadeira: os ferros devem ficar
afastados o suficiente para o navio girar livre de outros ao suspender.
IV falsa: a abertura indicada é em torno de 50°, não aproximadamente 90°.
Vetor F/V/V/F; uma única combinação completa.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/IV | Ambas falsas; faltam II/III |
| B | I/III | I falsa; falta II |
| C | I/II | I falsa; falta III |
| D | II/IV | IV falsa; falta III |
| E | II/III | Único conjunto completo das verdadeiras |

## ANV-0798 — julgamento individual

Mantida a competência do tópico e o formato principal A (direta), com pergunta
de planejamento em lugar da definição genérica. O rótulo legado Associação
conceitual permanece; a classificação principal desta versão é direta/contextual.
Todos os distratores são orientações de planejamento, com erro localizável.

| Opção | Julgamento |
|---|---|
| A | Falsa: presume segurança com rajadas fortes de través |
| B | Falsa: minimiza distância sem garantir espaço para o giro ao suspender |
| C | Única correta: distância dos ferros suficiente para girar livre de outros |
| D | Falsa: omite amarra a pagar na aproximação da popa no cálculo do filame |
| E | Falsa: troca abertura bibliográfica aproximada de 50° por 90° |

A explicação de D inclui a margem de erro também expressa no artigo.
O ângulo aproximado é conteúdo técnico da descrição, não número de página
ou organização do livro. Não se estabelece valor universal para todo navio,
porto, condição meteorológica ou sistema de amarração.

## Classificação e limites

Dez justificativas específicas, uma por alternativa. L2/Médio proposto para
relacionar configuração, restrição meteorológica e finalidade do posicionamento
dos ferros; sem dificuldade psicométrica medida ou calibração global aprovada.
Termos de causa/efeito e condições concretas usados em lugar de tautologias.

Busca old-116 no runtime encontrou este par; ambos foram lidos integralmente.
Há sobreposição de competência entre variantes; não devem coexistir na mesma
prova. Impedimento global de coexistência e deduplicação semântica completa
permanecem pendentes. Busca por código não prova ausência de variantes com
outros códigos. Quantidade de modelos existentes preservada, sem criar IDs.

Acumulado 35 correções e 38 conferências primárias parciais, ZERO aprovações
editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json; conferências
em CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Aderência programática oficial, edital,
rechecagem independente, cobertura e offline/produção pendentes. Resultados
executados em TESTES_E_EVIDENCIAS.md. Sem merge, deploy ou dados de usuários.
