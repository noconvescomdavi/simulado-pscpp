# ESTIBORDO/PSCPP — HENSEN — Checkpoint 005: falha preexistente da CI e contenção editorial

**Verificação:** 29/10/2026 (America/Sao_Paulo). **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`. **HEAD antes da correção:** `4ce7efc3bffc6e976e598c633382641f26805d61`.  
**Commit de correção:** https://github.com/noconvescomdavi/simulado-pscpp/commit/f8c83f9be3084829720f148d43fd9e30e6c96f36

## Causa e preexistência verificadas

- CI #2117 (https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40949391135), job `validate`, passou pelos gates iniciais e pelo **build**, mas falhou em `Legislation notebook content and editorial regression`, em `scripts/test-legislation-content-restorations.mjs:47`.
- **Erro real:** o runtime continha **73 comandos genéricos que perguntam apenas por um localizador** (artigo, item, página ou bloco), sem objeto técnico suficientemente determinado. A asserção exigia nenhum comando desse tipo, e exibiu nominalmente os 73 IDs abaixo. Não é erro de Study Plan V3, nem de HENSEN.
- **Preexistência:** o blob da fonte `data/questions/legislacao-regulamentacao.json` é **idêntico** na `main` e na branch: `cd7b16ea5cdef66c708f30c35bd8e408ff158676`. O arquivo `lib/question-locator-audit.js` também é idêntico: `05f60ddaf4c4a458d4bb18273c8159d2f86fcc2c`. A verificação da CI estava expondo conteúdo antigo inadequado, não defeito introduzido pelas 120 questões HENSEN.
- **Antes:** `questionQualityState` não verificava `hasLocatorOnlyCommand`, permitindo que itens genericamente formulados permanecessem ativos. **Depois:** importa o auditor existente e classifica esses comandos como `active:false, reason:'locator-only-command'`. Não foi alterada a asserção que detectou a falha, nem foram removidos arquivos, IDs, alternativas ou gabaritos. A medida é **quarentena reversível**, não reparo bibliográfico definitivo.
- **Validação remota da correção:** CI #2118 https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40952875708 — **em execução no momento deste registro**. Os 73 IDs foram observados como ativos na CI #2117; sua exclusão efetiva só será confirmada quando a CI #2118 passar. A rotina de qualidade poderá identificar outros itens com o mesmo defeito fora dessa lista; quantidades finais exigem auditoria de runtime.

## Inventário individual: itens não HENSEN que bloquearam a CI

Os registros abaixo não foram corrigidos nem apagados. A mudança apenas evita a exposição ativa de perguntas sem objeto técnico; cada uma precisa ser restaurada contra a publicação normativa original em trabalho editorial próprio, fora do escopo HENSEN.

| ID | Antes, observado | Depois, esperado | Pendência |
|---|---|---|---|
| `LEG-0023` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0033` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0041` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0064` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0070` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0087` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0096` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0135` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0136` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0140` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0173` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0176` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0189` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0192` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0224` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0225` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0242` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0292` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0325` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0327` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0330` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0358` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0384` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0389` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0392` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0403` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0405` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0408` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0410` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0418` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0426` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0430` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0434` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0436` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0447` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0458` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0460` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0467` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0478` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0479` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0482` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0532` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0562` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0565` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0568` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0577` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0592` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0608` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0612` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0617` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0634` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0640` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0660` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0670` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0675` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0676` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0677` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0695` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0714` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0770` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0777` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0780` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0786` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0789` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0812` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0821` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0841` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0844` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0851` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0865` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0871` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0893` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |
| `LEG-0983` | Ativa com comando por localizador (CI #2117) | Quarentena reversível prevista por `locator-only-command`; confirmação pelo CI #2118 pendente | Reescrita bibliográfica individual pendente |

## Controle de escopo HENSEN

- Históricos: **170**, sendo **119 em quarentena reversível** e **51 ativos ainda não homologados individualmente**. Nesta execução, nenhuma dessas questões foi alterada ou reativada.
- Lotes 001, 002 e 003: **120 questões** existentes na branch, cinco por capítulo por lote, nos capítulos 1–7 e 9. Conferência direta dos três JSONs: **120 IDs únicos, 120 enunciados textualmente distintos, cinco alternativas por questão, 120 explicações e localizadores, e 24 gabaritos por letra A–E**. Os oito capítulos têm 15 itens cada. A checagem lexical de pares de enunciados (Jaccard com palavras funcionais removidas) encontrou somente dois pares com similaridade ≥0,20, ambos com pontuação 0,20; isso **não comprova ausência de equivalência semântica**.
- Nenhuma questão nova foi criada nesta execução, nenhum ID foi reutilizado e nenhum dos 119 itens HENSEN em quarentena foi apresentado como corrigido. Revisão da fonte impressa página a página e homologação semântica integral continuam pendentes.

## Gates e deploy

- No HEAD anterior `4ce7efc`: Full Question Bank Audit, Audit Main Question Banks, PSCPP Integral Bank Audit e Validate PIANC 121 passaram; **CI #2117 falhou**. https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40949391135
- Para o commit de correção `f8c83f9`: workflows em andamento ao registrar este relatório; **não afirmar PASS** antes da conclusão. O Preview da Vercel estava BUILDING para `f8c83f9`: https://vercel.com/estibordo/estibordo-pscpp/H84vP2QPTBWusmuHhq5c7ETGggvL
- Vercel **Production READY** continua vinculada à `main` `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, **não** aos lotes HENSEN: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ
- PR #173 estava aberto e `mergeable=true` na consulta inicial. **Não realizar merge** até que todos os gates do HEAD final estejam verdes, a revisão editorial esteja concluída e a publicação seja segura.

**Próximo checkpoint:** ler o resultado da CI #2118, investigar novas falhas se houver; revisar os 73 itens de Legislação apenas em fluxo separado e manter sua quarentena como pendência explícita. Em HENSEN, priorizar revisão semântica e a correção fundamentada dos 119 itens históricos, sem ampliar lotes enquanto o PR estiver bloqueado.


## Adendo: confronto direto com a obra HENSEN e correção do Lote 002

- A fonte primária está acessível no acervo do projeto como `Tug use in Port-Hank Hanesen-2021.pdf` (335 páginas, edição revisada de 2021). Foram confrontados **24 exemplos**, um por capítulo (1–7 e 9) em cada um dos lotes 001, 002 e 003, com as páginas indicadas. **23 mantiveram a correspondência textual/conceitual na amostragem; 1 exigiu correção**. A conferência por amostragem não é homologação de todas as 120 questões.
- **ID corrigido:** `ANV-HENSEN-C06-L002-01`. **Antes:** enunciado sobre 'escoamento mais uniforme' na seção mestra, alternativa D sobre região preferencial, explicação atribuída ao §6.3.2, p. 155 (PDF p. 168). A página citada trata da aproximação ao costado, mas não sustenta diretamente a comparação de velocidade afirmada. **Depois:** enunciado e cinco alternativas reformulados para avaliar a diferença de velocidade relativa da água nos ombros versus seção mestra; explicação amparada diretamente pelo **§6.2.4, p. 154 (PDF p. 167)**, que afirma que o escoamento pode ser mais rápido nos ombros de navios de casco largo e reduzir a efetividade do rebocador empurrando. Gabarito **D** preservado; não foi afirmada ausência de interação à meia-nau.
- Commit do conteúdo: https://github.com/noconvescomdavi/simulado-pscpp/commit/050c7f45942693a3b5da95298dc29ec11c399806 . Relatório original do Lote 002 atualizado: https://github.com/noconvescomdavi/simulado-pscpp/commit/4d83d783d66a5ba181db61afe2b6278bf249fb48 .
- Releitura dos três JSONs após a correção: **120 IDs únicos, 120 enunciados distintos, 5 alternativas A–E por questão, todas com explicação e localizador, 24 respostas de cada letra**. Nenhum outro registro HENSEN foi alterado; as **119 antigas permanecem em quarentena** e as **51 antigas continuam ativas sob revisão pendente**.
- **Gates:** os checks concluídos dos commits anteriores não homologam automaticamente o novo HEAD. Reexecutar CI e auditorias do último commit antes de qualquer merge. Nenhum merge nem deploy Production realizado.


## Adendo: nova regressão detectada após a contenção

- CI #2118 https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40952875708 e CI seguinte https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40953097650: o teste `test:legislation-content` **passou**, confirmando a ausência de comandos genéricos por localizador no caderno de Legislação; porém a etapa seguinte `validate:editorial-runtime` falhou em `scripts/validate-editorial-runtime.mjs:16` com **4 !== 11**.
- **Causa:** contagem congelada de 11 itens PSCPP inelegíveis, não compatível com a composição atual do runtime. `lib/pscpp-exam-source.js` já aplica filtros de qualidade e estrutura antes de gerar o runtime; o número de itens inelegíveis remanescentes no runtime não é invariável. A discrepância **não comprova que sete questões tenham sido corrigidas**, pois elas podem ter sido excluídas antes da geração.
- **Antes:** exigência de cardinalidade `=== 11` em `scripts/validate-editorial-runtime.mjs` e `scripts/validate-pscpp-exam-selection.mjs`. **Depois:** ambos exigem unicidade dos IDs inelegíveis e que **nenhum** desses IDs apareça nos sorteios; conferem o simulado com 100 questões e as cotas 25/25/10/10/10/10/10. A segunda validação inclui regressões sintéticas para tabela OCR corrompida e alternativa vazada em afirmativas. **Nenhum teste foi desabilitado**, nenhuma questão foi ativada e nenhum gabarito foi modificado.
- Commits: https://github.com/noconvescomdavi/simulado-pscpp/commit/e27496c9256910ca62eebc1b69751e65f6d6b7a8 e https://github.com/noconvescomdavi/simulado-pscpp/commit/884aa6faf77065bc83cf5d69ca6b481590e92e44 . **Validação remota dos novos testes ainda pendente.**
- O Full Question Bank Audit do checkpoint anterior passou com **0 CRITICAL e 2554 HIGH**: 812 localizadores, 1483 enunciados duplicados, 258 modelos genéricos e 1 anomalia histórica oficial de alternativas. Esses achados são reais no corpus bruto, não foram saneados por completo e exigem trabalho editorial separado; o sucesso do workflow não equivale à ausência de achados HIGH. https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40953097615
