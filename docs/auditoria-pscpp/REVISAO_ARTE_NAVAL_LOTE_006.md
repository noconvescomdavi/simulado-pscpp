# Lote 006 — ANV-0038, ANV-0039 e ANV-0041

Base remoto/local conferida antes das edições: `7f5ba195b5a323bbe55401110135378d23594971`.
PR #172 aberto e draft. Árvore rastreada limpa; temporários não rastreados
preservados. Lock exclusivo local em audit-private durante a rodada, sem outro
escritor identificado. A leitura histórica já concluída não foi contabilizada novamente.

## Precedência e identidade

As três versões prevalentes vêm de `data/question-restorations/arte-naval.json`,
aplicadas sobre o principal e antes de reformulateLeakingStem,
normalizeEditorialStem, restoreCompleteNotebookStem e applyMiguensCap45Review.
As aspas longas da restauração anterior acionavam answer-leak-v1 e apagavam
as quatro afirmações, mantendo opções por conjuntos sem objeto.
Foram corrigidas as restaurações efetivas, sem alterar os normalizadores ou
criar exceções de aprovação. A regressão exige ausência de mass_reformulation,
quatro proposições e conteúdo presente no HTML do componente real.

Preservados IDs, tópicos prevalentes, cinco opções combinadas e gabaritos.
Em ANV-0038 o principal dizia cabo mensageiro, mas a identidade efetivamente
servida já era interação no cruzamento; não se restaurou a versão obsoleta.
Taxonomia legada fonseca-arte-v1 preservada; o volume físico correto está
explícito nas referências. Reconciliação global dos identificadores pendente.
Nenhum conjunto de três questões por item foi alterado ou removido.

## Fontes primárias e revisão técnica

Conferidos texto e páginas renderizadas dos PDFs locais da 8ª edição, 2019:

| Questão | Fonte e localizador | Páginas impressas / PDF | Vetor | Resposta |
|---|---|---|---|---|
| ANV-0038 | Arte Naval v.2, art. 12.61 e fig. 12-36 | 887–888 / 248–249 | V/V/F/F | C |
| ANV-0039 | Arte Naval v.1, arts. 2.22–2.23 e 2.88 | 82–83 e 122 / mesmas páginas | F/V/V/F | D |
| ANV-0041 | Arte Naval v.2, art. 9.5.1.b e fig. 9-14 | 663 / 24 | F/V/V/F | A |

SHA-256 v.1: `792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20`.
Drive: `1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N`.
SHA-256 v.2: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.
Drive: `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.
Hashes dos PDFs recomputados nesta rodada. Figuras 12-36 e 9-14 conferidas
visualmente. As questões são autossuficientes em texto e não pedem leitura
ou presença dessas figuras. Nenhum livro ou página integral foi publicado.

ANV-0038: I reúne velocidade reduzida e cuidado com o leme; II descreve a
repulsão das bochechas pelas ondas das proas. III troca o equilíbrio descrito
na passagem pelo través por reforço e afastamento. IV inverte a atração final
das popas por repulsão. Distratores agora tratam da mesma interação, em vez
de homem ao mar e ângulo de deriva. Não há número de velocidade inventado.

ANV-0039: I confunde centro do volume deslocado (carena) com centro da área
de flutuação. II se limita ao tratamento de embarque na vertical do CF do
art. 2.88; não o converte em regra para qualquer variação finita de carga.
III expressa a definição para uma determinada flutuação. IV exige posição
fixa a meio-navio, contrariada tanto pela definição geométrica quanto pelo
exemplo do art. 2.88. A frase anterior sobre mudança de posição com qualquer
movimentação de pesos era ambígua e foi substituída. Art. 2.90, p. 124,
conferido como contexto adicional de variação de trim, sem acrescentar cálculo.

ANV-0041: II localiza os cilindros de bronze duro no furo central; III descreve
os dois movimentos relativos que reduzem atrito. I desloca os cilindros para
fora da bucha e IV os torna imóveis em relação ao perno, contradizendo a
construção descrita. Nenhuma manutenção ou regra de lubrificação foi inferida.

Cada alternativa A–E tem justificativa específica no item. A recomposição
exata dos conjuntos pelos vetores acima encontra uma única resposta em cada
questão, sem mudar letras nem opções. Formato B e L2/Médio propostos por
exigirem distinguir causas, centros e funcionamento, sem alegação de calibração
psicométrica. Não há cálculo numérico ou necessidade de tabela externa.

## Redundância e limites

Lidas as versões efetivas de ANV-0736, ANV-0946 e AN-C12-I12-61-M1/M3:
sobrepõem a competência de interação no cruzamento. M1 continua com
proposições ausentes; não foi certificado por esta leitura. ANV-0102/0800
tratam efeito de banco, competência vizinha que requer distinguir interação
navio-navio de navio-margem. Não são automaticamente declarados duplicatas.

Lidas ANV-0739 e AN-C09-951-M1/M3, que também cobram a bucha redutora
entre outros tipos de roldana. Há sobreposição de competência a impedir numa
mesma prova. Busca por tópico e enunciado efetivo não encontrou outro
registro contendo centro de flutuação; isto não prova ausência de duplicata
semântica com outra nomenclatura. Nenhum vizinho foi aprovado ou eliminado.
Garantia integral de diversidade por seletor continua pendente.

Acumulado: onze correções primárias, quatorze conferências bibliográficas
parciais, zero aprovações finais. REVISOES_EDITORIAIS.jsonl permanece sem
aprovações. Rechecagem independente, alinhamento ao programa/edital e revisão
semântica global não concluídos. Não há merge, deploy ou alteração de dados
de usuários. Hashes e resultados executados nos arquivos próprios do lote.
