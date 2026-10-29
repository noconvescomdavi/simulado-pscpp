# Lote 016 — ANV-0073

Base remota 0ddb25e0d3ebc5630342dfdb8d7ce00b115e6b79; PR #172 aberto e draft.
HEAD/PR, checkpoint e relatório 015 consultados antes de editar. Fast-forward
com árvore rastreada limpa; temporários preservados. /proc não mostrou outro
escritor além da própria sincronização. Prompt-Mestre mantido conforme leitura
integral prévia; checkpoint atual prevalece.

## Fonte e precedência

O JSON principal contém questão V/F sobre atracação a contrabordo, quarantined;
a restauração prevalente trata de parada com máquina atrás toda força. Nenhum
patch ANV-0073 em notebook-complete-stems. O answer-leak-v1 removia as proposições.
Corrigida somente a restauração; ID, competência, formato B, cinco combinações
e chave C preservados. Nenhum normalizador ou teste alterado.

Fonte: Fonseca, Arte Naval, volume 2, 8ª edição, 2019, arts. 12.7–12.8,
pp. 805–808 / PDF 166–169. Texto e imagens completas das quatro páginas lidos;
figuras 12-6 e 12-7 e quadro experimental inspecionados. SHA-256 recalculado:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. Livro e imagens permanecem privados.
A questão não depende de figura anexada nem pede estimativa numérica de parada.

A redação anterior tratava como distratores propriedades que podem acompanhar
a manobra: deslocamento lateral da popa e avanço residual com propulsor invertido.
A distinção entre nome de condição transitória e manobra não assegurava falsidade
inequívoca. Reescrita para erros verificáveis nas hipóteses da própria fonte.
Também removida a apresentação da manobra como exclusivamente emergencial:
o art. 12.7 inclui tomar boia, fundear e atracar.

## Julgamento individual

I verdadeira: art. 12.7 lista prevenção de abalroamento e retirada de seguimento
nas demais manobras. II falsa: existe intervalo entre ordem e execução, dependente
do propulsor, passo, governo e velocidade; não se adotou um minuto como constante.
III falsa: vento, correnteza e pouco fundo afetam o espaço percorrido, conforme
arts. 12.7–12.8. IV verdadeira: o livro explicitamente impede generalizar a
queda para BE e recomenda conhecer o comportamento de cada navio por ensaio.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/III | Inclui III falsa e omite IV |
| B | I/II | Inclui II falsa e omite IV |
| C | I/IV | Único conjunto completo das verdadeiras |
| D | II/III | Ambas falsas, omite I/IV |
| E | II/IV | Inclui II falsa e omite I |

Cinco justificativas específicas. L2/Médio proposto pela análise de finalidade,
atraso de resposta e limites de generalização, sem dificuldade psicométrica medida.
A faixa empírica de 3–6 comprimentos e a hipótese de potências AV/AR iguais do
art. 12.8 não foram convertidas em lei universal. Não se inferiu regra moderna
nem se recomenda manobra fora das condições do navio. Fig. 12-7 é ensaio específico,
com vento e características próprios; seus valores não são metas gerais.
Hashes antes/depois em CORRECOES_RUNTIME.json. Regressão certifica preservação,
combinação única e renderização; verdade técnica vem da fonte lida.

## Sobreposição e limites

ANV-0771 lida integralmente na versão efetiva: identifica a mesma manobra por
retirada de seguimento e cita fatores da distância de parada. Sobreposição de
competência com ANV-0073 registrada; vizinha não corrigida nem aprovada neste lote.
Sua explicação genérica ainda requer confronto detalhado com a hipótese de
potência do art. 12.8. Busca por old-097 encontrou o par, sem provar ausência
global de duplicatas. Variantes não devem coexistir na mesma prova; impedimento
global segue pendente. Outros regimes específicos de três modelos preservados.

Acumulado: 24 correções primárias e 27 conferências bibliográficas parciais;
zero aprovações finais. Rechecagem independente, programa/edital oficial, cobertura,
deduplicação global e reconciliação offline/produção pendentes. Sem merge, deploy
desta auditoria ou alteração de usuários. Resultados em TESTES_E_EVIDENCIAS.md.
