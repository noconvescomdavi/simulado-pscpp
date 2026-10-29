# Lote 012 — ANV-0050

Base remota a2cae00af7ac332c76822b5e627b933a435b1197; PR #172 aberto e draft.
HEAD remoto e checkpoint consultados antes de editar. Fast-forward da árvore
rastreada limpa; temporários não rastreados preservados. Inspeção dos processos
via /proc não encontrou outro escritor; marcador local do lote em audit-private.
Prompt-Mestre relido integralmente; checkpoint prevalece sobre prompt agendado.

## Fonte, precedência e identidade

O JSON principal aborda reserva de flutuabilidade e não é a versão efetiva.
A restauração prevalente aborda centro de gravidade do navio; não há patch
ANV-0050 em notebook-complete-stems. O normalizador answer-leak-v1 removia as
quatro proposições. Foi corrigida somente a restauração, preservando ID,
competência, cinco combinações e gabarito E. Nenhum normalizador ou teste relaxado.

Fonte primária: Fonseca, Arte Naval, volume 1, 8ª edição, 2019, arts. 2.21–2.22,
página impressa 82 / PDF 82, figura 2-7. Texto integral e imagem da página
lidos; contexto dos arts. 2.20–2.23 consultado. SHA-256 recalculado:
792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20.
Drive 1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N. Figura distingue G de C e ilustra
navio aprumado/adernado; não precisa ser anexada para resolver a questão.
Livro e imagem de trabalho permanecem privados.

## Julgamento das proposições e alternativas

Vetor V/F/V/F: I representa o peso resultante aplicado no centro de gravidade;
II fixa indevidamente sua posição vertical entre projetos e distribuições de
peso; III admite a alteração da posição pela distribuição da carga; IV define
o centro de carena, não o centro de gravidade do navio. A palavra “pode” em III
evita afirmar que toda movimentação, inclusive movimentos compensados, desloque G.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/II | Inclui II falsa, omite III |
| B | II/IV | Ambas falsas, omite I/III |
| C | II/III | Inclui II falsa, omite I |
| D | I/IV | Inclui IV falsa, omite III |
| E | I/III | Único conjunto completo das verdadeiras |

Cinco justificativas específicas registradas; L2/Médio proposto pela distinção
entre resultante dos pesos e volume deslocado e efeito da distribuição da carga.
Não é dificuldade psicométrica medida. Formato B preservado. Hashes antes/depois
em CORRECOES_RUNTIME.json. Regressão verifica igualdade fonte/runtime,
proposições no HTML real e todas as combinações; não certifica verdade técnica
sem a conferência primária documentada acima.

## Vizinhos e limites

ANV-0748 e ANV-0950 lidas integralmente na versão efetiva: ambas cobram a
identificação do centro de gravidade a partir da resultante dos pesos e sua
variação com a distribuição. Sobreposição de competência com ANV-0050 registrada;
nenhuma foi corrigida, aprovada ou removida neste lote. Busca pelo topic_code
anv1-2.21 retornou esse trio efetivo. Não se conclui ausência global de duplicatas.
Regime de três modelos de outros subconjuntos preservado; não se presumiu
aplicação desse regime a todo o banco. Cobertura completa continua pendente.

Décima nona correção primária e vigésima segunda conferência bibliográfica
parcial; zero aprovações finais. Rechecagem independente, alinhamento oficial
programa/edital, deduplicação semântica global e reconciliação offline/produção
permanecem pendentes. Sem merge, deploy desta auditoria ou alteração de usuários.
Resultados executados em TESTES_E_EVIDENCIAS.md e CHECKPOINT.json.
