# Lote 065 — verificações e testes da máquina do leme

Base remota `96e55b1e04b66890e980057ef7597998d274adcf`. HEAD remoto e PR172 aberto/draft consultados antes de editar; CHECKPOINT064 e relatório064 prevalecem sobre o prompt antigo. Contexto do Prompt-Mestre e benchmark histórico previamente revisados preservado. A árvore rastreada local limpa e antiga foi atualizada por fast-forward. Temporários não rastreados preservados. `ps -eo pid,comm` retornou `fatal library error, lookup self`; não se afirma enumeração global bem-sucedida de escritores. Hashes estáveis, comparação de árvore e expected_sha sem force são condições de publicação.

## Fonte e limites

Fonseca, Arte Naval v.2, 8ª edição, 2019: item11.10.d(1)–(4), p.775/PDF136; contexto d(5)–(6), p.776/PDF137 e11.10.b/c p.774/PDF135. Três páginas únicas lidas integralmente em texto e imagens; os numerais774,775,776 foram vistos. Não há figura necessária à resolução nesses trechos; não houve medição de figura ou cálculo. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`, Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados.

A fonte distingue teste rotineiro, suas verificações cumulativas e exercícios de emergência adicionais. O movimento é limitado às possibilidades da máquina, sem exigir curso mecanicamente impossível. Conferiu-se também a previsão específica de dispensa para viagens curtas e registros emd(5)/(6), sem transformar a regra geral em afirmação universal sem exceções. Não se alteraram prazos nem se certificou um navio.

Consulta auxiliar documentada em CONSULTA_NORMATIVA_GOVERNO_065.json, em24/10/2026: PDF rotulado SOLAS2020 hospedado pela autoridade islandesa, PDF235/regulaçãoV/26.1–6; orientação britânica MCA MGN610 Amendment1,33.1–33.4. O primeiro confirma a apresentação cumulativa dos testes e os exercícios adicionais; a segunda identifica o assunto e discute registros/instruções no contexto britânico. Não comprovam consolidação integral vigente em2026, aplicabilidade brasileira ou edital-alvo. O PDF antigo do domínio publishing.service.gov.uk retornou410 ao abrir e não foi tratado como documento recuperado. As perguntas são explicitamente sobre a edição2019. Anexos oficiais, programa/edital e inventário completo de normas permanecem pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador verificado | Gabarito |
|---|---|---|---|---|
| ANV-0295 | Quatro proposições desapareciam no carregamento; mistura entre teste, arranjo de emergência e propulsor lateral; justificativa genérica. | Reconstruídas quatro proposições sobre indicação angular, inspeção, comunicação e exercícios adicionais; corrigida a falsa dispensa de inspeção/exercícios; comando preservado pelo carregador; explicação e cinco justificativas; páginas/hash e proposta Médio/L2. |11.10.d(1),(2),(4),p.775/PDF136;contextd(5)/(6),p.776/PDF137.|E mantido;V/F/V/F|
| ANV-0693 | Pergunta genérica e alternativas heterogêneas entre teste e tipos de propulsão/governo. | Contexto autossuficiente de preparação para suspender; cinco procedimentos comparáveis sobre complementaridade/substituição de movimento,inspeção e comunicação; explicação e cinco justificativas;páginas/hash e proposta Médio/L2. |11.10.d(2),p.775/PDF136;contextd(1)/(4)–(6).|C mantido|

Duas correções primárias parciais, dez justificativas e zero aprovações finais. Só0295 recupera quatro proposições ausentes na versão efetiva. A chave original não prova a falsidade de frases genéricas: elas foram substituídas por relações verificáveis na fonte. IDs, alternativas combinatórias de0295, tracking/taxonomy, módulos, estilos e identidade foram preservados. A proposta Médio/L2 não é calibração psicométrica aprovada.

## Julgamento, alternativas e precedência

0295:I verdadeira por comparação indicação/posição real;II falsa porque a inspeção é cumulativa ao movimento;III verdadeira pela comunicação entre locais;IV falsa porque os exercícios de emergência são adicionais. SóE reúneI/III;A incluiII eomiteIII;B incluiII eomiteI;C reúneII/IV falsas;D incluiIV eomiteIII. 0693:sóC mantém as três etapas.A elimina inspeção;B elimina movimento;D elimina comunicação;E elimina movimento e inspeção. As cinco alternativas não competem entre categoria e exemplo.

Sondagens iniciais falharam porque a transformação lexical ainda substituía os comandos por enunciado genérico: em0295 o fechamento repetia palavras das opções combinadas;em0693 o comando repetia a enumeração correta. Ajustou-se o comando com objeto técnico explícito e sem antecipar a resposta. Não houve alteração de heurística, bypass, nova flag ou relaxamento de testes. Sondagem final confirma igualdade integral de cada objeto principal com o runtime e invariância em reformulateLeakingStem/normalizeEditorialStem. auditQuestion retorna sem issues; esse escore automático não é aprovação final.

ANV-0494 permanece fisicamente inalterada e ausente runtime:bruta ativa,após transformações stem-quotes-source-answer. Sem ativação,quarentena nova ou conferência individual contabilizada. Os três modelos AN-C11-1110-M1/M2/M3 permanecem inalterados e pendentes de revisão integral: abrangem instalação,desempenho e requisitos elétricos além do trecho d. A leitura de três páginas não foi contabilizada como revisão dos modelos ou de todo11.10. Regime de três modelos preservado. Tracking/taxonomy v1 legados de0295/0693 não foram globalmente reconciliados com source v2. Variantes da mesma competência não devem coexistir na mesma prova; prevenção semântica global pendente.

## Validação e acumulado

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validação runtime,seleção/matriz,proveniência,catálogo,regressão e check:pscpp-bank. Regressão confirmou190 deltas acumulados exatos,11912 ocorrências de cadernos preservadas,416 proposições renderizadas e430 alternativas diretas preservadas. Exatamente dois IDs efetivos e dois objetos principais mudaram frente ao064;1984 PSCPP intactos. População14086=12102+1984,13715IDs únicos,27435 registros físicos e matriz100=25/25/10/10/10/10/10 preservadas.

Build completo em cópia isolada passou com log integral:compilação,lint/tipos,101/101 páginas e rotas. Os1285 arquivos rastreados fora de docs e seis artefatos gerados coincidem byte a byte com os insumos/resultados testados. Avisos do build não impediram sucesso;nenhuma aprovação de release inferida.

Falhas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,0aceitas/14086pendentes. Triagem e inventário regenerados:171 candidatos sem proposições e77 localizadores. REVISOES_EDITORIAIS intacto. Resultados reais de cada comando:

| Comando | Saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|


As188 correções anteriores permanecem intactas; este lote acrescenta dois IDs,sem recontagem:190 corrigidos e193 conferências parciais,ZERO aprovações finais. Dos256 candidatos iniciais:82 corrigidos+3 falsos positivos+171 restantes;108 correções fora dessa triagem;82+108=190. Próxima falha independente ANV-0298. Preservados impedimentos0142/0840,0176/0874,0253/0651,modelo1036M1 excluído,inconsistência12.15AR e demais pendências.

Todos os oito gates continuam pendentes/falhos,merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,consumidores/offline/SQL e homologação pendentes. Sem merge,deploy ou mutação de dados de usuários. O commit que contém este relatório inclui CHECKPOINT e hashes antes/depois. Publicação condicionada a igualdade exata local/remota,HEAD sem concorrência detectada e expected_sha sem force.
