# Lote 014 — ANV-0067 e ANV-0765

Base remota 232582b55d4a1a0fcfd1a7f818b36cae027dfeb2; PR #172 aberto e draft.
HEAD/PR e checkpoint consultados; árvore rastreada limpa sincronizada por fast-forward,
temporários preservados. /proc consultado após falha do utilitário ps; nenhum
outro escritor encontrado além da própria sincronização. Prompt-Mestre e critérios
mantidos conforme leitura integral anterior; checkpoint atual prevalece.

## Fonte e precedência

ANV-0067 no JSON principal trata de saia do cabrestante; a versão efetiva é a
restauração sobre quartel do tornel. Não há patch deste ID em notebook-complete-stems.
Essa restauração era reduzida a comando genérico pelo answer-leak-v1.
ANV-0765 provém do JSON principal e repete a definição incorreta, sem restauração
prevalente. Corrigida também a vizinha identificada na leitura semântica, na sua
fonte efetiva; não se introduziu cópia adicional nem se alterou normalizador.

Fonte: Fonseca, Arte Naval, volume 2, 8ª edição, 2019, art. 10.12.a–c,
páginas 720–721 / PDF 81–82, figura 10-12. Texto integral e imagens das duas
páginas inspecionados. SHA-256 recalculado:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. A imagem confirma a nomenclatura
“tornel” e a conexão à âncora; o texto extraído confundia o l final com i.
A denominação anterior “torneio” e a posição “ligado ao navio” estavam incorretas.
Livro e imagens permanecem privados; questões resolvíveis sem figura anexada.

## ANV-0067 — formato B, chave B

Contexto explicitamente limitado aos navios de guerra descritos no livro.
I falsa: troca extremidade da âncora pela do navio. II verdadeira: trecho curto
de 5 braças na extremidade ligada à âncora. III verdadeira: o tornel na outra
extremidade o liga ao primeiro quartel e permite o giro relativo à âncora.
IV falsa: o livro impede que o tornel gurna na coroa do cabrestante.
Cinco combinações e chave preservadas; cinco justificativas específicas.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/IV | Ambas falsas, omite II/III |
| B | II/III | Único conjunto completo das verdadeiras |
| C | II/IV | Inclui IV falsa, omite III |
| D | III/IV | Inclui IV falsa, omite II |
| E | I/II | Inclui I falsa, omite III |

## ANV-0765 — formato A, chave E

Mantido ID e competência; cinco alternativas reconstruídas no mesmo recorte.
A descreve quartel longo (40 braças, art. b); B descreve quartel comum no padrão
brasileiro (15 braças, art. c); C troca a extremidade; D permite indevidamente
que o tornel gurna na coroa; E identifica trecho de 5 braças, conexão à âncora
e ligação ao primeiro quartel por tornel (art. a). Apenas E corresponde à
pergunta. Não se cobra decorar o número do artigo. Cinco justificativas.
A diferença entre navios de guerra e mercantes está expressa na explicação;
não se converte o arranjo do livro em exigência universal ou norma vigente.

## Integração, diversidade e limites

Ambas L2/Médio proposto por distinção de função, posição e configuração; nenhuma
dificuldade psicométrica medida. Hashes antes/depois em CORRECOES_RUNTIME.json.
A regressão foi estendida para esta primeira correção direta: exige ID documentado,
cinco chaves/alternativas únicas, texto da resposta conferida, enunciado no HTML e
opções preservadas pelo adaptador público. Todos os contratos de quatro proposições
das correções combinadas continuam exigidos. Verdade técnica vem da fonte lida,
não do teste nem do texto esperado. Fonte/enunciado/explicação e hashes continuam
comparados; não se relaxou o normalizador nem os gates editoriais.

Busca por topic_code old-049 no inventário efetivo encontrou ANV-0067 e ANV-0765;
ambas lidas integralmente e corrigidas. São variantes da mesma competência e
não devem coexistir na mesma prova. Impedimento global dessa coexistência e
busca semântica global pendentes. Outros regimes específicos de três modelos
preservados; não se presume esse regime para todo o banco.

Acumulado: 22 correções primárias e 25 conferências bibliográficas parciais;
zero aprovações finais. Rechecagem independente, alinhamento oficial programa/edital,
cobertura e reconciliação offline/produção pendentes. Sem merge, deploy desta
auditoria ou alterações de usuários. Resultados em TESTES_E_EVIDENCIAS.md.
