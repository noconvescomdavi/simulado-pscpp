# Lote 005 — ANV-0037

Partida: `348f852f7d6414d6df7f7b18016c38b891073e6e`, HEAD remoto e PR #172
consultados antes da edição. Árvore rastreada inicialmente limpa; temporários
não rastreados preservados. Bloqueio local de escritor usado durante o lote.

## Fonte e precedência

A versão principal está em quarentena e aborda pressão lateral das pás.
A restauração ativa prevalente trata de plano de atracação; foi esta a versão
corrigida, preservando ID e competência. O normalizador de answer-leak-v1
eliminava as proposições por detectar fragmentos entre aspas na restauração.
O novo texto não dispara a reformulação e mantém as quatro afirmações após
as transformações existentes, sem alterar regras globais ou relaxar testes.

Fonte primária: Fonseca, Arte Naval, volume 2, 8ª edição, 2019, arts. 12.19
e 12.21 (2), (3), (9), pp. 819–820 / PDF 180–181. Conferidos o texto integral
da seção 12.19–12.23 e as páginas 819–820 renderizadas. SHA-256 confirmado:
`6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.
Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Não há figura necessária;
nenhuma página integral do livro foi incluída no repositório.

## Revisão técnica

A restauração anterior misturava definições de espias com planejamento.
As novas afirmações mantêm o objeto, com distratores referentes ao momento
da preparação e ao bordo do ferro que deve estar pronto para largar:

- I verdadeira: condições do cais, maré, vento, defensas e pontos de amarração,
  art. 12.19, p. 819.
- II falsa: corrente e variação de maré são verificadas antes da aproximação,
  art. 12.21, introdução e (9), p. 820.
- III falsa: o ferro pronto é o do bordo oposto, art. 12.21 (3), p. 820.
- IV verdadeira: local e bordo são divulgados às estações antes da aproximação,
  art. 12.21 (2), p. 820.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I + II | II falsa; falta IV |
| B | I + IV | Único conjunto completo das verdadeiras |
| C | II + III | Ambas falsas; faltam I e IV |
| D | II + IV | II falsa; falta I |
| E | III + IV | III falsa; falta I |

Vetor V/F/F/V recomposto e comparado a todas as alternativas; apenas B
coincide. Justificativas A–E e páginas registradas no item. Formato B,
L2/Médio proposto por exigir distinguir providências e condições da preparação;
não constitui dificuldade psicométrica medida. Taxonomia legada preservada;
referência física explicita volume 2, e reconciliação global continua pendente.

## Identidade e redundância

Leitura das versões efetivas de ANV-0735, AN-C12-1219-M2/M3 e
AN-C12-1221-M1/M2/M3 mostrou sobreposição de planejamento prévio, análise
do cais, comunicação às estações e bordo do ferro. Há ainda enunciados
normalizados incompletos nesses vizinhos. Não foram certificados nem
removidos automaticamente. A triagem de competências deve impedir coexistência
dessas variantes em uma prova; a garantia global do seletor segue pendente.
Regime dos três itens AN-C12 preservado sem mudança de seus arquivos.

Oitava correção primária e décima primeira conferência parcial; zero aprovações
finais. Rechecagem independente, programa/edital e deduplicação semântica
integral continuam pendentes. Hashes antes/depois em CORRECOES_RUNTIME.json.
Resultados executados em TESTES_E_EVIDENCIAS.md e CHECKPOINT.json.
