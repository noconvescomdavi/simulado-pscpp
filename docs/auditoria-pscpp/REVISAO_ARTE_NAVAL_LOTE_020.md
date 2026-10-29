# Lote 020 — âncora Almirantado e provas das amarras

Base remota a541c7f6ff857c31119ec65c1b692065f80d47d3; PR #172 aberto e draft.
HEAD/PR e checkpoint 019 consultados antes de editar. Fast-forward com árvore
rastreada limpa, temporários preservados; nenhum outro escritor identificado.
Prompt-Mestre relido integralmente nesta rodada; benchmark histórico anterior
mantido, sem repetir lotes publicados nem converter observação de gabarito em
aprovação técnica.

## Fontes, figura e precedência

Fonseca, Arte Naval, v. 2, 8ª ed., 2019:

- ANV-0096/0794: art. 10.3.a, páginas impressas 707–708 / PDF 68–69.
  Texto integral e imagens de ambas as páginas inspecionados. Figura 10-1
  confirma a disposição do cepo, braços e patas; figura 10-2 dá o contraste
  com as patentes de 10.3.b. Não há dependência de figura ausente nas novas
  perguntas, que não solicitam identificação de letras ou medição da imagem.
- ANV-0097/0795: art. 10.16.a–b, p. 727 / PDF 88, com abertura do artigo
  na p. 726 / PDF 87. Texto e imagens de ambas as páginas inspecionados.
  Figura 10-15 é contexto do elo de aço estampado, não diagrama da prova;
  as questões não exigem imagem anexada.

SHA-256 do PDF recalculado:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. Livro/imagens privados.
Não se afirma que o procedimento bibliográfico equivale à norma vigente ou
que a proveniência oficial dos anexos/edital foi resolvida.

ANV-0096 principal é uma composição sobre unha da âncora e outros assuntos;
prevalece a restauração old-035 Almirantado. ANV-0097 principal é V/F sobre
mordente; prevalece a restauração old-052 prova de tração. Corrigidas as duas
restaurações, mantendo identidade e keys A/B. As diretas ANV-0794/0795
prevalecem no JSON principal, corrigidas ali com keys D/E. Nenhum dos quatro
IDs está em notebook-complete-stems. A transformação answer-leak-v1 retirava
proposições das duas combinadas e tornava os comandos das diretas genéricos.
Runtime regenerado e igualdade fonte/runtime verificada; nenhum normalizador
alterado. Regimes/quantidade de modelos existentes preservados, sem criar IDs.

## ANV-0096 — conteúdo e resposta

I verdadeira: a obra relaciona a troca pelas patentes às dificuldades de manobra
e arrumação, mesmo com maior poder de unhar da Almirantado. II falsa: ausência
de cepo e haste articulada descrevem as patentes, não a Almirantado. III falsa:
superfícies das patas são perpendiculares ao plano dos braços. IV verdadeira:
comprimento do cepo igual ao da haste e distância entre unhas cerca de 7/10
desse comprimento. Não se trata de cálculo com dados inventados, mas de
proporção bibliográfica aproximada. Vetor V/F/F/V.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/IV | Único conjunto completo das verdadeiras |
| B | II/IV | II falsa; falta I |
| C | I/II | II falsa; falta IV |
| D | II/III | Ambas falsas; faltam I/IV |
| E | III/IV | III falsa; falta I |

## ANV-0794 — conteúdo e resposta

O comando anterior genérico permitia aceitar a definição geral de âncora da
opção A, além da descrição D. Novo comando cobra uma combinação específica
de características da Almirantado; cinco opções comparáveis, sem tautologia.

| Opção | Julgamento |
|---|---|
| A | Falsa: cepo não é paralelo aos braços |
| B | Falsa: ausência de cepo e articulação identificam patentes, 10.3.b |
| C | Falsa: superfícies das patas são perpendiculares ao plano dos braços |
| D | Única correta: ambas as perpendicularidades de 10.3.a(1–2) |
| E | Falsa: cepo pesa cerca de 1/4 da âncora, não cerca da metade |

## ANV-0097 — conteúdo e resposta

A versão anterior incluía critério genérico de deformação não estabelecido no
artigo indicado. Substituído por conteúdo efetivamente localizado; distinção
entre as duas provas e exceção material do recozimento explicitadas.
I falsa: todos os quartéis não são rompidos na prova de resistência.
II falsa: aço estampado é a exceção ao recozimento posterior, não inclusão
obrigatória. III verdadeira: todos os quartéis recebem esforço de cerca de 2/3
da carga de ruptura nominal. IV verdadeira: para ruptura usa-se um pedaço de
três elos iguais aos da amarra. Vetor F/F/V/V.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | II/IV | II falsa; falta III |
| B | III/IV | Único conjunto completo das verdadeiras |
| C | I/III | I falsa; falta IV |
| D | I/II | Ambas falsas; faltam III/IV |
| E | II/III | II falsa; falta IV |

## ANV-0795 — conteúdo e resposta

O comando genérico não distinguia claramente resistência de ruptura, ambas
chamadas provas de tração na abertura de 10.16. Novo comando pede
expressamente a prova de resistência; retirada a condição de deformação
não demonstrada pelo artigo. Não se atribui norma atual à edição consultada.

| Opção | Julgamento |
|---|---|
| A | Falsa: troca esforço aproximado de 2/3 por rompimento de todos os quartéis |
| B | Falsa: amostra de três elos da ruptura não dispensa prova dos quartéis |
| C | Falsa: prova não se restringe ao aço estampado |
| D | Falsa: inclui indevidamente aço estampado no recozimento posterior |
| E | Única correta: todos os quartéis, cerca de 2/3 da carga nominal de ruptura |

## Classificação, sobreposição e limites

Cinco justificativas específicas por questão. Dois formatos B (combinadas)
e dois A (diretas conceituais); L2/Médio proposto para relacionar propriedades,
procedimentos e exceções. Não há aferição psicométrica nem certificação de
metas globais. Frações 1/4, 7/10 e 2/3 conferidas na fonte; sem cálculo
operacional adicional, unidades ou arredondamento artificial.

Busca no runtime por old-035 e old-052 encontrou os dois pares listados,
lidos individualmente. As variantes de cada par compartilham competência e
não devem coexistir na mesma prova. Regra global de coexistência/deduplicação
semântica permanece pendente; busca por códigos não prova ausência de
sobreposições com outros códigos. Não se alterou o número de modelos por item.

Acumulado: 33 correções e 36 conferências bibliográficas parciais; ZERO
aprovações editoriais finais. Rechecagem independente, programa/edital oficial,
cobertura completa, unicidade semântica global e offline/produção pendentes.
Hashes antes/depois e evidências em CORRECOES_RUNTIME.json e
CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Resultados em TESTES_E_EVIDENCIAS.md.
Sem merge, deploy desta auditoria ou alteração de dados de usuários.
