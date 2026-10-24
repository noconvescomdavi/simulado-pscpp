# Lote 063 — preparo, acionamento e conservação da máquina de suspender

Base remota `699857b91455d332d9e42c72bc29cac06a71e9cf`; HEAD remoto e PR172 aberto/draft consultados antes da edição. CHECKPOINT062 e relatório062 lidos,com contexto suficiente do Prompt-Mestre e benchmark histórico já revisados. Cópia local rastreada limpa e antiga atualizada por fast-forward,sem duplicar commit ou descartar temporários. `ps -eo pid,comm` falhou com `fatal library error, lookup self`: não se afirma enumeração global bem-sucedida de escritores. Publicação condicionada a hashes estáveis,árvore local/remota idêntica e expected_sha sem force.

## Fonte primária e limites

Fonseca,Arte Naval v.2,8ª edição,2019:10.32.a/b,p.747/PDF108;10.36,pp.752–753/PDF113–114;contexto10.33,p.748/PDF109. Essas quatro páginas foram lidas integralmente em texto e imagens. Não há figura nessas passagens e nenhum enunciado exige imagem ausente. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade dos anexos oficiais,edital e inventário de aplicabilidade atual permanecem pendentes.

10.32.b distingue autorização/comunicação,óleo e graxa,primeira partida sem carga,embreagem de dado e preparo a vapor. 10.36 distingue ensaio de poucos elos e reaperto do freio da fase posterior de arrancar o ferro;mantém lavagem,fase de velocidade de içar e retenção final. Os enunciados limitam-se à edição citada,sem substituir o procedimento do equipamento específico. O limite de10% para motor de indução é lembrança do texto,não cálculo elétrico novo nem declaração de conformidade com norma atual.

A passagem histórica de10.32.a(3),com desmontagem/solventes,foi lida,mas sua aplicabilidade atual não foi validada nem prescrita nas reescritas. A primeira proposição de1032M3 foi substituída por condição de autorização/comunicação dentro da mesma competência de preparo,sem declarar falsa a antiga descrição apenas porque foi substituída. O trecho10.33(2) não foi transformado em garantia de eliminação de todo acidente. A remissão de10.36(16) para10.17 foi consultada em texto;isso não equivale a revisão integral de10.17 nem de todas as remissões do capítulo.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0283 | Proposições apagadas no carregamento e mistura de operação com definição de peças. | Restauradas quatro proposições sobre autorização,primeira partida,ligação da coroa e ensaio de elos;explicação e cinco justificativas;páginas/hash;Médio/L2. |10.32.b,p.747/PDF108;10.36,p.752/PDF113.|C mantido;V/V/F/F|
| ANV-0681 | Comando genérico e opções heterogêneas entre ações e componentes. | Cinco relações comparáveis entre acionamento/fase;distintos freio,coroa,mordente e boça;explicação e cinco justificativas;páginas/hash;Médio/L2. |10.36,p.752/PDF113;contrastep.753/PDF114.|A mantido|
| AN-C10-1032-M1 | Explicação repetitiva,justificativas genéricas eL4 incompatível com a cobrança. | Escopo2019 explícito;fundamentados inspeção,lubrificantes,primeira partida e falsa autorização dispensada;cinco justificativas;Médio/L2;página/hash. |10.32.a/b,p.747/PDF108.|D mantido;V/V/V/F|
| AN-C10-1032-M2 | Pergunta sobre faixa não distinguia limite máximo de valores internos;opçãoE heterogênea eL3 sem aplicação. | Pedido explícito de desvio máximo;cinco percentuais homogêneos;explicação e cinco justificativas;Fácil/L1;página/hash. |10.32.a(4),p.747/PDF108.|C mantido;10%|
| AN-C10-1032-M3 | Comando sem objeto,justificativas genéricas eL4 sem análise. | V/F com contexto de preparo;autorização/comunicação,óleo impuro e condição de embreagem de dado explícitos;fundamentada a falsidade de dispensar preparo a vapor;cinco justificativas;Médio/L2;página/hash. |10.32.b,p.747/PDF108.|E mantido;V/V/V/F|
| AN-C10-1036-M2 | Explicação repetitiva e distratores de operações heterogêneas. | Cinco ajustes de içamento comparáveis;fase/limpeza e possibilidade de aumento preservadas;explicado que redução não é obrigatória no cenário limpo e que o encosto é vagaroso;cinco justificativas;Médio/L2;páginas/hash. |10.36(14)–(17),pp.752–753/PDF113–114.|E mantido|
| AN-C10-1036-M3 | Comando sem objeto e justificativas genéricas. | Contexto de lavagem/encerramento;preservadas quatro proposições eV/F,julgadas individualmente;explicitada sequência de retenção após alojar o ferro;cinco justificativas;Médio/L2;páginas/hash. |10.36(5),(14),(17)–(20),pp.752–753/PDF113–114.|B mantido;V/V/V/F|

Sete correções primárias parciais e35 justificativas. Zero aprovações finais. Apenas0283 recupera proposições que desapareciam:1032M1/M3 e1036M3 já tinham quatro itens reconhecidos no runtime. Os níveis são propostas sem calibração histórica/psicométrica final. ChavesC/A/D/C/E/E/B mantidas após conferência de conteúdo e unicidade.

## Julgamentos e unicidade

0283:I/II verdadeiras;III falsa por deixar a coroa desligada no recolhimento;IV falsa por substituir poucos elos por quartéis completos. SóC reúneI/II;A reúne duas falsas;B incluiIII;D/E incluemIV. A afirmação antiga genérica de verificações não foi aprovada por mera coincidência da chave: foi substituída por proposições com localizador preciso.

0681:A corresponde ao acionamento da fase de arrancar com freio solto. B atribui ao reaperto do ensaio a função de iniciar arranque;C desliga a coroa;D/E confundem retenção com acionamento. 1032M1:I/II/III verdadeiras,IV falsa;A omiteIII;B incluiIV;C incluiIV eomiteII;D únicaI/II/III;E incluiIV.

1032M2:10% é o limite pedido.2/5% restringem mais;20/25% excedem. Não se afirma que uma tensão situada a2/5% da nominal seja inadmissível: o comando pergunta o limite máximo referido,eliminando essa ambiguidade. 1032M3:V/V/V/F,únicaE;A erraII/III;B erraI/IV;C erraIII/IV;D erraI/II.

1036M2:E mantém aumento como possibilidade condicionada a amarra limpa e ferro já arrancado,ainda não em cima. A impõe redução obrigatória que a passagem não exige nessa condição;B desloca a fase;C transfere aumento para encosto;D ignora limpeza. A possibilidade de recolher mais devagar por outra necessidade operacional não foi declarada impossível. 1036M3:V/V/V/F,únicaB;A erraII;C erraI/IV;D erraIII/IV;E erraI/II.

## Precedência, três modelos e itens preservados

As sete versões já eram ativas e vêm do principal;nenhuma restauração/extensão prevalece sobre elas. Sondagem final confirma igualdade integral entre cada objeto principal e versão efetiva,invariância em reformulateLeakingStem/normalizeEditorialStem e auditQuestion sem issues/política ativa. Sem flags novas,bypass ou relaxamento de critérios;escore automático não comprova revisão editorial.

ANV-0482 permanece inalterada e ausente runtime:bruta ativa,após transformações stem-quotes-source-answer. AN-C10-1036-M1 permanece inalterada e ausente:bruta stem-quotes-source-answer,depois missing-assertions. O defeito desse modelo e suas justificativas genéricas permanecem pendentes;ele não recebe correção,conferência integral ou aprovação contabilizada neste lote. O regime de três modelos por item continua fisicamente preservado;não houve exclusão de modelo nem nova quarentena/ativação. Em1032 os três modelos ativos foram individualmente corrigidos;em1036 foram corrigidos os dois já ativos.

O original principalANV-0044 continua explicitamente inativo/quarentenado;há uma versão efetiva preexistente por restauração,com correção de checkpoint anterior. Nenhuma foi alterada ou recontada. Tracking/taxonomy legados v1 de0283/0681 preservados,com source v2 explícito e reconciliação global pendente.

As variantes sobre preparo/acionamento e os modelos com sobreposição de competência não devem coexistir na mesma prova;diferença textual não comprova diversidade. Prevenção semântica global e reconciliação entre consumidores permanecem pendentes. Não se declara aprovação de todo o item10.36 enquantoM1 estiver pendente.

## Validação e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:180 deltas acumulados exatos,11922 ocorrências de cadernos preservadas,392 proposições renderizadas e410 alternativas diretas preservadas. Frente ao062,exatamente sete IDs efetivos e sete objetos principais mudaram;173 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada.

O primeiro ciclo de testes passou nos contratos pertinentes,mas a conferência final do distratorA de1036M2 explicitou redução obrigatória para evitar ambiguidade com uma redução apenas possível. Hashes atualizados e todos os15 comandos repetidos sobre a redação final. Build completo npm run build passou em cópia isolada com log integral:compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. Não se usa código de saída isolado como prova de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato conferido:173 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS byte a byte intacto. Critérios não relaxados.

Acumulado sem recontagem:180 IDs corrigidos e183 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,80 corrigidos+3 falsos positivos+173 restantes;100 correções fora dessa triagem,80+100=180. Este lote acrescenta sete correções e sete conferências,sem recontar os173 IDs anteriores. Próxima falha independente:ANV-0288,poleame de laborar,Fonseca9.1/9.3. Impedimentos0142/0840,0176/0874 e0253/0651,modelo1036M1 excluído,reconciliaçãoAR do061 e demais pendências globais preservados.

Todos os oito gates pendentes/falhos e merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,consumidores/offline/SQL e homologação pendentes. Sem merge,deploy ou mutação de dados de usuários. O commit que contém este relatório contém também CHECKPOINT e hashes antes/depois;publicação exige igualdade exata de árvore e expected_sha sem force.
