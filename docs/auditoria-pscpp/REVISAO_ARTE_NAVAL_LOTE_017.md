# Lote 017 — ANV-0076

Base remota 44bfc1e1edaefd33b06259785a15abf318071517; PR #172 aberto e draft.
HEAD/PR, checkpoint e relatório 016 lidos antes de editar. Fast-forward com
árvore rastreada limpa; temporários preservados. /proc não mostrou outro escritor
além da própria sincronização. Prompt-Mestre mantido conforme leitura integral
prévia; checkpoint atual prevalece.

## Fonte, precedência e identidade

O JSON principal contém versão quarantined sobre amarrar com regeira; a versão
efetiva é a restauração sobre máquina de reboque. Não há patch ANV-0076 em
notebook-complete-stems. O answer-leak-v1 removia as proposições. Corrigida
somente a restauração prevalente, preservando ID, competência, formato B, cinco
combinações e gabarito A. Nenhum normalizador ou teste alterado.

Fonte: Fonseca, Arte Naval, volume 2, 8ª edição, 2019, art. 12.71,
página impressa 909 / PDF 270. Texto integral do artigo e imagem completa da
página inspecionados. Figura 12-47 da mesma página lida como contexto do art.
anterior: representa comprimento do reboque em relação às ondas, não o interior
da máquina. Não foi atribuída como diagrama da máquina nem exigida no enunciado.
SHA-256 recalculado:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. Livro/imagem permanecem privados.

A antiga II afirmava que o equipamento limita danos quando a carga excede o
valor previsto. Isso não é distrator inequivocamente falso para uma máquina que
soleca sob esticão; foi substituído por inversão explícita da resposta ao brando.
A questão agora examina ajuste, causa da soleca, recolhimento e função na parada,
sem confundir a máquina com um fusível nem presumir função universal dos guinchos.

## Julgamento individual

I falsa: a obra especifica ajuste para tensão, não exclusivamente comprimento.
II falsa: quando a tensão diminui e surge brando, o sarilho muda de sentido e
recolhe o cabo; não continua solecando. III verdadeira: o sarilho soleca quando
um esticão supera repentinamente a tensão ajustada. IV verdadeira: na parada,
o recolhimento do brando mantém o cabo safo dos hélices. O contexto limita todas
as proposições ao mecanismo descrito em Fonseca.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | III/IV | Único conjunto completo das verdadeiras |
| B | I/III | Inclui I falsa e omite IV |
| C | II/IV | Inclui II falsa e omite III |
| D | I/II | Ambas falsas, omite III/IV |
| E | I/IV | Inclui I falsa e omite III |

Cinco justificativas específicas. L2/Médio proposto pela análise causal do
funcionamento, sem dificuldade psicométrica medida. Sem cálculo, figura necessária
ou pressuposto de vigência normativa. Hashes antes/depois em CORRECOES_RUNTIME.json.
Regressão verifica preservação no pipeline, quatro proposições no HTML e combinação
única; verdade técnica vem da leitura primária, não do teste.

## Sobreposição e limites

ANV-0774 lida integralmente na versão efetiva. Pergunta pela máquina que controla
comprimento/tensão e sua explicação cita pagar/recolher e reduzir picos de carga.
Sobreposição da mesma competência com ANV-0076 registrada; vizinha não corrigida
nem aprovada neste lote. Busca por old-140 encontrou o par, sem provar ausência
global de duplicatas. Variantes não devem coexistir na mesma prova; impedimento
global pendente. Regimes específicos de três modelos de outros conjuntos preservados.

Acumulado: 25 correções primárias e 28 conferências bibliográficas parciais;
zero aprovações finais. Rechecagem independente, programa/edital oficial, cobertura,
deduplicação global e reconciliação offline/produção pendentes. Sem merge, deploy
desta auditoria ou alteração de usuários. Resultados em TESTES_E_EVIDENCIAS.md.
