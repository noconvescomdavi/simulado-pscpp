# Lote 076 — transmissão elétrica do comando do leme

## Recuperação e base

Remoto consultado antes das edições: a19df3eae1e821af0512e99adebef08d1e8401e6; PR172 aberto, draft, sem merge. Ambiente local ainda no lote005, sem alterações rastreadas; temporários não rastreados preservados. Fast-forward até o remoto. Pacote PSCPP_Checkpoint_075_Recuperacao.zip recuperado da Library libfile_5275de22faa481918faa26cffd15d130. Todos os hashes do MANIFEST foram recalculados e conferidos; git bundle verify passou, com pré-requisito34c45320. Commit recuperado73172bae7f4db3bf2d43361ddb0075b45a0e9f02 e árvore d859cd18bc55e85021ec2e9ffebbe0e830af5bc5 confirmados. O commit075 e o registro a19df3ea eram filhos distintos de070; por isso não cabia fast-forward entre ambos. Integração local694ad17b preservou as duas linhas sem conflito. Nenhuma das nove correções075 foi refeita ou recontada. Regressão da recuperação confirmou222 deltas antes das novas edições.

Lock cooperativo flock adquirido e mantido durante o trabalho. Enumeração de processos inicialmente funcionou e depois falhou com lookup self; não se afirma exclusão global de escritores externos. Publicação deve usar expected_sha e nenhuma força. O registro de autorização do usuário prevalece sobre a informação antiga de bloqueio no relatório075: create_blob e create_tree funcionaram nesta rodada; não houve nova rejeição automática até a preparação deste relatório. Nenhum livro ou dado privado integra o diff.

## Fonte primária e limites

Fonseca, Arte Naval, volume2, 8ª edição,2019, item11.5.c, páginas impressas760–761, PDF121–122. Duas páginas lidas integralmente em texto e imagens; numerais impressos conferidos visualmente. SHA256 recalculado6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1; exemplar Drive1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. A remissão à figura11-4 não é necessária à solução das questões e nenhuma medida foi extraída. Não se afirma nova conferência dessa figura neste lote.

O par selsyn e o acompanhamento dos rotores são avaliados no arranjo descrito pela obra; não se atribuem tolerância nula, desempenho garantido ou aplicação universal a equipamentos reais. Foram evitadas afirmações de frequência de emprego na frota atual e superioridade genérica de instalações. Transmissão elétrica do comando pode coexistir com servomotor hidrelétrico: o receptor atua sobre o controle da bomba, sem substituir sua função hidráulica. Não há cálculo ou prescrição normativa nova. Programa oficial/edital, inventário integral de aplicabilidade e rechecagem independente permanecem pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-115c-M1 | Quatro proposições desapareciam na versão efetiva; explicação repetia as falsas sem corrigir inversão de funções. | Restauradas quatro proposições sobre transmissor/receptor, par CA e meio elétrico; explicada a confusão com telemotor e a inversão das unidades; cinco justificativas, páginas e hash. Dificuldade média/L2 proposta. | 11.5.c, pp760–761/PDF121–122. | B mantido; V/V/F/F. |
| AN-C11-115c-M2 | Comando dependia do artigo, alternativas misturavam funções, bombas, gualdropes e alimentação; explicação apenas repetia a correta. | Pergunta autossuficiente sobre origem/destino do comando; cinco associações entre unidades e posições, com erros localizáveis; cinco justificativas, páginas e hash. Fácil/L1 proposto. | 11.5.c, pp760–761/PDF121–122. | C mantido. |
| AN-C11-115c-M3 | V/F não era reconhecido estruturalmente; explicação repetia a falsa sem julgá-la; emprego sem delimitação histórica. | Comando antes dos quatro itens; julgamento explícito e cinco justificativas; acompanhamento dos rotores delimitado ao modelo descrito e compatibilidade elétrica/hidrelétrica esclarecida; páginas e hash. Média/L2 proposta. | 11.5.c, pp760–761/PDF121–122. | D mantido; V/V/F/V. |

Três correções primárias parciais, quinze justificativas e zero aprovações finais. IDs, gabaritos, tipos, três modelos, tracking, taxonomia e flags legadas preservados. Flags antigas não conferem aprovação. Classificações cognitivas/dificuldade propostas, sem calibração psicométrica. Variantes da mesma competência não devem coexistir em uma prova; prevenção semântica global permanece pendente.

## Unicidade e carregamento

M1: só I/II verdadeiras; A incluiIII e omiteII, C incluiIV e omiteI, D reúne duas falsas e E inclui as duas falsas. M2: somenteC combina transmissor junto à roda e receptor junto ao controle; A inverte ambos, B duplica transmissor, D duplica receptor e E inverte a função na roda e introduz acionamento direto da madre. M3: V/V/F/V, sóD; A erraII/III/IV, B erraI/III/IV, C erraI/II/III e E erraIII.

A primeira versão deM2 acionou a reformulação lexical automática e foi rejeitada na conferência. Redação corrigida para preservar a pergunta sem alterar normalizadores ou critérios. Todos os três objetos principais agora são integralmente iguais às versões efetivas; não há mass_reformulation. A comparação com o inventário075 versionado confirmou exatamente esses três IDs alterados. As listas explícitas de origem/formato do teste regressivo foram ampliadas apenas para os três IDs; nenhuma asserção foi removida ou relaxada.

## Validação executada

Regenerados runtimePSCPP, bancos, catálogo e flashcards. Validações runtime, seleção/matriz, proveniência e catálogo passaram. Regressão acumulada:225 deltas exatos,11877 ocorrências de cadernos preservadas,500 proposições renderizadas e500 alternativas diretas preservadas. População inalterada:27435 registros físicos,12102 cadernos+1984PSCPP=14086 ocorrências,13715 IDs únicos. Matriz100=25/25/10/10/10/10/10 mantida. Diff sem erros de whitespace.

O comando npm run build retornou0 mas o log terminou antes das subetapas; não foi aceito como prova de build completo. As quatro regenerações já tinham passado individualmente. A execução direta node node_modules/next/dist/bin/next build retornou0 com compilação,lint/tipos,101/101páginas,coleta de traces e resumo completo de rotas. Avisos CSS/autoprefixer e configuração npm foram preservados. Isso não aprova release.

| Verificação | Resultado |
|---|---|
| generate:pscpp-bank / question-banks / question-catalog / flashcard-decks | passaram individualmente |
| validate-runtime-question-banks | 0 |
| validate-pscpp-exam-selection | 0 |
| test-question-source-provenance | 0 |
| validate-runtime-question-catalog | 0 |
| test-pscpp-audit-anv0005 | 0;225 deltas exatos |
| test-notebook-complete-stems | 1;ANV-0142, anterior |
| validate-editorial-runtime | 1;77 localizadores, anteriores |
| audit-pscpp-runtime-triage / inventory | regenerados |
| validate-pscpp-editorial-evidence | zero aceitos/14086 pendentes; gate falho |
| check:pscpp-bank | 0 |
| next build direto | 0,log integral |

## Acumulado e próxima etapa

Base075:222 IDs/225 conferências parciais. Novos neste lote:+3/+3. Acumulado225 IDs corrigidos parcialmente,228 conferências parciais e zero aprovações finais;225/13715=1,64% dos IDs, não percentual de auditoria concluída. Triagem161 sem proposições e77 localizadores. Das256 entradas iniciais:92 corrigidas+3 falsos positivos+161 pendentes;133 correções fora dessa triagem;92+133=225. Nenhuma recontagem das nove questões075.

Próximo grupo AN-C11-116-M1/M2/M3, após confirmar seus IDs e versões efetivas, com fonte11.6 e figura11-5. Rechecagem independente, fontes oficiais/edital, cobertura integral, prevenção semântica, consumidores offline/SQL e demais disciplinas continuam pendentes. Todos os oito gates pendentes/falhos, merge_permitted=false. Sem merge em main, deploy solicitado ou alteração de dados de usuários.
