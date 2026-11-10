# ESTIBORDO/PSCPP — HENSEN: checkpoint 003 (gates, regressões e auditoria por fonte)

**Data:** 2026-10-29. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`. **HEAD antes deste relatório:** `183eb0a6eca050b54b6180a5006d3e12ef6e7c95`.  
**Decisão:** PR aberto; **sem merge, sem Production HENSEN e sem Lote 002** até todos os checks do HEAD final passarem, mergeabilidade ser confirmada e o deployment de produção corresponder ao commit integrado.

## Escopo e invariantes HENSEN

- 170 questões históricas nos blocos 006/007/008/010/013/016/019/021/022/023: **119 em quarentena reversível** e **51 antigas marcadas ativas, ainda pendentes de revisão integral de fonte**. Não houve edição/reabilitação de nenhum dos 170 neste checkpoint.
- 40 questões novas em `data/question-extensions/hensen-lote-001.json`, **5 em cada capítulo oficial 1–7 e 9**, cinco alternativas A–E com textos distintos, explicação e localizador capítulo/seção/página. Gabaritos **A=8, B=8, C=8, D=8, E=8**. **Nenhuma questão HENSEN foi modificada nesta execução**.
- Contagem nominal no JSON antes dos filtros runtime: **210 HENSEN / 91 marcadas ativas**. A publicação efetiva no runtime exige gates.
- Checagem lexical de 40 novas versus 51 antigas e dentro das 40 novas: maior Jaccard de tokens informativos **0,200** (par `ANV-HENSEN-C04-L001-04` / `ANV-B007-01`), nenhum par ≥ 0,35. **Isto não comprova ausência de equivalência semântica**; a revisão conceitual integral segue pendente.
- Fonte primária novamente consultada: Henk Hensen, *Tug Use in Port*, quarta edição revisada, 2021, https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . Texto extraído diretamente do PDF. A fonte não foi alterada.

### IDs HENSEN do Lote 001 — antes/depois inalterados

- Capítulo 1: `ANV-HENSEN-C01-L001-01`, `ANV-HENSEN-C01-L001-02`, `ANV-HENSEN-C01-L001-03`, `ANV-HENSEN-C01-L001-04`, `ANV-HENSEN-C01-L001-05`.
- Capítulo 2: `ANV-HENSEN-C02-L001-01`, `ANV-HENSEN-C02-L001-02`, `ANV-HENSEN-C02-L001-03`, `ANV-HENSEN-C02-L001-04`, `ANV-HENSEN-C02-L001-05`.
- Capítulo 3: `ANV-HENSEN-C03-L001-01`, `ANV-HENSEN-C03-L001-02`, `ANV-HENSEN-C03-L001-03`, `ANV-HENSEN-C03-L001-04`, `ANV-HENSEN-C03-L001-05`.
- Capítulo 4: `ANV-HENSEN-C04-L001-01`, `ANV-HENSEN-C04-L001-02`, `ANV-HENSEN-C04-L001-03`, `ANV-HENSEN-C04-L001-04`, `ANV-HENSEN-C04-L001-05`.
- Capítulo 5: `ANV-HENSEN-C05-L001-01`, `ANV-HENSEN-C05-L001-02`, `ANV-HENSEN-C05-L001-03`, `ANV-HENSEN-C05-L001-04`, `ANV-HENSEN-C05-L001-05`.
- Capítulo 6: `ANV-HENSEN-C06-L001-01`, `ANV-HENSEN-C06-L001-02`, `ANV-HENSEN-C06-L001-03`, `ANV-HENSEN-C06-L001-04`, `ANV-HENSEN-C06-L001-05`.
- Capítulo 7: `ANV-HENSEN-C07-L001-01`, `ANV-HENSEN-C07-L001-02`, `ANV-HENSEN-C07-L001-03`, `ANV-HENSEN-C07-L001-04`, `ANV-HENSEN-C07-L001-05`.
- Capítulo 9: `ANV-HENSEN-C09-L001-01`, `ANV-HENSEN-C09-L001-02`, `ANV-HENSEN-C09-L001-03`, `ANV-HENSEN-C09-L001-04`, `ANV-HENSEN-C09-L001-05`.

As **119 questões em quarentena** continuam identificadas individualmente no checkpoint 002: https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-29-lote-001-gates-checkpoint-02.md . Antes/depois de todos os 119: **quarantined → quarantined**, sem reparo bibliográfico e sem reativação. Os 51 antigos dos blocos 006/007/008 permanecem como estavam.

### Nova amostragem direta na fonte (oito IDs, sem mudança editorial)

| ID | Localizador impresso | Evidência localizada na obra |
|---|---|---|
| `ANV-HENSEN-C01-L001-02` | cap. 1, p. 4 | Terminais expostos e LNG: estabilidade, defensas robustas, render-recovery winches e potência |
| `ANV-HENSEN-C02-L001-03` | cap. 2, p. 33 | Propulsão azimutal de trator e capacidade de manobra; leitura complementar ainda recomendada |
| `ANV-HENSEN-C03-L001-03` | cap. 3, p. 86 | Push-pull: resposta rápida na atracação |
| `ANV-HENSEN-C04-L001-04` | cap. 4, p. 118 | Tração a ré próxima da avante no trabalho ao costado |
| `ANV-HENSEN-C05-L001-02` | cap. 5, p. 136 | Equação de força lateral de vento contém área lateral exposta |
| `ANV-HENSEN-C06-L001-04` | cap. 6, p. 164 | Nevoeiro: guincho de liberação rápida confiável, acionável do passadiço e do guincho |
| `ANV-HENSEN-C07-L001-03` | cap. 7, p. 181 | Inércia do freio em choque de carga pode impedir alívio e romper cabo |
| `ANV-HENSEN-C09-L001-03` | cap. 9, p. 251 | Discussão do modo direto/indireto e efeito da velocidade; revisão integral do contexto continua pendente |

A amostragem adiciona evidência à anterior, mas **não substitui a revisão completa das 40 explicações e alternativas**.

## Problemas e reparos de integração — antes/depois

| Item | Antes | Depois desta execução | Evidência |
|---|---|---|---|
| `MEO-1173` (Meteorologia, **fora de HENSEN**) | CI do HEAD `8545a056` apontava combinação com opções em numerais romanos, mas enunciado runtime genérico sem proposições | Regra compartilhada de normalização **não apaga proposições completas**; se faltar conteúdo, preserva o texto e põe o item em quarentena para revisão de fonte. Nenhum JSON de Meteorologia foi editado | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40927996193 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/447f039c137f26946418c7536f45d3f998f8e589 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/183eb0a6eca050b54b6180a5006d3e12ef6e7c95 |
| `MAN-3900` (Manobrabilidade, **fora de HENSEN**) | Uma versão intermediária excessivamente conservadora do guard impediu questão com restauração conhecida, revelado por CI | Guard refinado para preservar combinações completas e manter as verificações reais de vazamento; requer confirmação no novo CI. Nenhum JSON da questão foi alterado | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40935247971 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/183eb0a6eca050b54b6180a5006d3e12ef6e7c95 |
| `AN-C10-1014-M1/M2/M3`, `AN-C09-916-M1/M2/M3` (Fonseca, **fora de HENSEN**) | Merge com a nova `main` introduziu registros com `source.title="Arte Naval, v. 2"`; canonicalizador só reconhecia `Volume 2`. Auditoria apontou **6 taxonomias inválidas ativas** | Canonicalizador agora reconhece as duas grafias **somente** com Drive ID, capítulo e matéria corretos. Garante testes positivos e negativo para outra obra. Conteúdo e gabaritos intactos | https://github.com/noconvescomdavi/simulado-pscpp/commit/698d53946e03efc076216c68ef903da00e617862 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/eb7282481d97ffc73f47994e3e264294f3ddad51 |
| Contagem histórica do teste de cadernos | Expectativa congelada `9955 + lote - quarentena - inativos`, divergente do runtime expandido (**11723** versus **9605** no run intermediário) | Substituída por **comparação exata de todos os IDs runtime contra os bancos reprocessados independentemente da origem**, mais limite inferior histórico e checagem exata da quarentena 119; não desabilita teste | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40934947975 ; https://github.com/noconvescomdavi/simulado-pscpp/commit/ccaf3f6db51700be85d9102c191db7c58618602e |
| Teste de regressão | Não cobria o caso de uma combinação perder suas proposições durante limpeza editorial | Fixture verifica preservação integral de combinação completa e quarentena reversível de combinação sem proposições | https://github.com/noconvescomdavi/simulado-pscpp/commit/9530f2b8c84d8af7ef5efc9b8f235e9e35908967 |

**Causa externa verificada:** a `main` avançou para `a03ccf972a021f9a2c8fee3ba09de3271fa089a7` por publicação independente, alterando `data/questions/arte-naval.json`. Os blobs divergem: `main=74de7f01eb84a257e757515fd95522db42f6cf54`, branch HENSEN=`b8a750894fcc049176f1c2f6dcd12938e9d552c0`. Os seis IDs existem em ambas as versões, mas na `main` a fonte foi abreviada. A falha não decorre do Lote HENSEN. O ajuste no canonicalizador preserva a validação rigorosa.

## Gates e deploy — estado no momento da gravação

- No run https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40935248173, **Full Question Bank Audit PASS**, **0 críticos**, **2554 achados HIGH** (812 locator-dependent, 1483 duplicate stems, 258 generic templates, 1 duplicação oficial preservada). HIGH não equivale a corrigido.
- `Audit Main Question Banks` e `Validate PIANC 121 CGE Quarantine`: PASS em https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40935247998 e https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40935247980 .
- `PSCPP Integral Bank Audit` falhou no HEAD anterior por 6 taxonomias Fonseca, **correção publicada e aguardando revalidação do HEAD final**. https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40935247906 .
- `CI` falhou no HEAD anterior por `MAN-3900`, **correção publicada e aguardando revalidação do HEAD final**. https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40935247971 .
- `main` divergiu da branch (dois commits à frente da base comum na consulta); PR #173 ainda aberto e `mergeable=true` na última consulta. É obrigatório verificar novamente após a revalidação.
- **Vercel Production READY** apenas para a `main` em `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ . **Não contém o Lote HENSEN**. Preview do HEAD intermediário em fila: https://vercel.com/estibordo/estibordo-pscpp/ANKTJMSr1JzgcqJxczLq43UtUKBV .
- **Sem merge, sem deploy Production HENSEN, sem reativação dos 119, sem Lote 002**.

## Próximo passo

Revalidar todos os workflows do commit final deste relatório; corrigir somente defeitos comprovados sem reduzir cobertura de testes, conferir Preview e mergeabilidade. Se algum gate permanecer vermelho, manter PR bloqueado e registrar o erro exato. Após merge seguro, conferir Production READY com o SHA efetivamente integrado. Somente então iniciar Lote 002 e recuperação bibliográfica individual dos 119.
