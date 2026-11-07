# ESTIBORDO/PSCPP — HENSEN — Checkpoint 017: localizadores do Lote 016 e bloqueios do PR #173

**Data:** 2026-10-30, horário de Brasília. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 . **Branch:** `audit/hensen-lote-001-20261029`. **Escopo:** Henk Hensen, *Tug Use in Port*, quarta edição (2021), capítulos 1–7 e 9. **Sem merge nem deploy de produção.**

## 1. Duas correções bibliográficas verificadas na fonte primária

Fonte consultada nesta execução: PDF da 4ª edição em https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . A extração textual contém, na página impressa **6**, as seções **1.2.3 The ships concerned** e **1.2.4 Services required in and around the harbour**. O mapeamento da edição usada é página PDF = página impressa + 13.

| ID | Antes | Depois | Justificativa |
|---|---|---|---|
| `ANV-HENSEN-C01-L016-02` | `Chapter 1, §1.2.3, p. 5 (PDF p. 18)` | `Chapter 1, §1.2.3, p. 6 (PDF p. 19)` | A frase sobre requisitos distintos de navios diferentes está na seção 1.2.3, página impressa 6. |
| `ANV-HENSEN-C01-L016-03` | `Chapter 1, §1.2.4, p. 5 (PDF p. 18)` | `Chapter 1, §1.2.4, p. 6 (PDF p. 19)` | A enumeração de barcaças, elevadores e guindastes flutuantes está na seção 1.2.4, página impressa 6. |

**Arquivo:** `data/question-extensions/hensen-lote-016.json`. **Commit da correção:** https://github.com/noconvescomdavi/simulado-pscpp/commit/f8938b7d83dd7c885f843ca42a50595319c3ef6f . **Relatório individual atualizado:** `reports/hensen/2026-10-30-lote-016-auditoria.md`, commit https://github.com/noconvescomdavi/simulado-pscpp/commit/949e57292a794a3a157f352db07b0422bdb2050d .

Validação de escopo antes do commit: comparação estrutural dos 40 registros confirmou **exatamente dois campos `source.locator` alterados**. IDs, enunciados, cinco alternativas, gabaritos, explicações, taxonomia, flags `active`, `validation_status` e demais campos preservados. Não houve reativação de históricos.

## 2. Achados editoriais que a correção de página não resolve

- `ANV-HENSEN-C01-L016-02` ainda se sobrepõe à competência de `ANV-HENSEN-C01-L002-02` (heterogeneidade de navios e requisitos dos rebocadores).
- `ANV-HENSEN-C01-L016-03` ainda se sobrepõe a `ANV-HENSEN-C01-L002-03` e itens sobre serviços complementares (ainda que mencione especificamente elevadores).
- `ANV-HENSEN-C01-L013-01` e `ANV-HENSEN-C01-L013-02` permanecem com as redundâncias já identificadas nos checkpoints 015–016.
- **Nenhum desses quatro itens foi declarado homologado.** Os itens novos permanecem `pending_editorial_review`. A revisão semântica independente deve buscar competências realmente inéditas; similaridade lexical baixa não é prova de originalidade.

## 3. Gates, inventário e separação de evidências por SHA

**Último SHA com os cinco workflows efetivamente verificados nesta execução:** `078bbc8d51f76bcf8c73f044801de98044f8d1ee`. Todos concluíram **success**:
- Full Question Bank Audit: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41027647974
- CI: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41027647930
- Audit Main Question Banks: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41027647985
- PSCPP Integral Bank Audit: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41027647969
- Validate PIANC 121 CGE Quarantine: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41027647921

Logs do Full Audit no SHA acima: `HENSEN_SOURCE_GUARD: 16 lotes, 640 questões, 0 falhas`; **2.558 HIGH, 0 CRITICAL** globais. A etapa `Study Plan V3 invariants` da CI passou. O log de instalação também menciona **3 vulnerabilidades de dependências (2 high, 1 critical)**, que não se confundem com os 0 críticos da auditoria de questões; requerem triagem de segurança independente antes da publicação. A aprovação de workflows **não comprova** que todos os 2.558 achados globais foram saneados.

**Inventário:** 640 questões novas nos lotes 001–016, mais 170 históricas, sendo 119 em quarentena reversível e 51 ativas ainda sob revisão. A revisão visual de todas as páginas, os 51 localizadores históricos ausentes e a recuperação dos 119 históricos continuam pendentes.

**SHA posterior à correção, antes deste checkpoint:** `949e57292a794a3a157f352db07b0422bdb2050d`. A consulta desse SHA retornou **nenhuma execução de workflow PR na primeira página**; logo não há prova de CI verde para ele. O status Vercel reportou **failure** por `build-rate-limit`; nenhum Preview READY desse SHA foi encontrado. O comparativo GitHub retornou branch divergente: **222 commits à frente e 2 atrás de main**; PR aberto e `mergeable=true`, mas isto isoladamente não autoriza merge.

**Production:** deployment https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ em estado READY, vinculado a `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, **não** à branch HENSEN. A Production não foi atualizada.

## 4. Decisão

**MERGE BLOQUEADO.** Razões: novo HEAD ainda sem reconfirmação de todos os gates; Vercel Preview não READY para SHA correto; divergência com main; sobreposições conceituais abertas; 51 históricos sem localizadores exatos; 119 históricos em quarentena ainda não saneados; auditoria global com 2.558 HIGH e pendência de triagem de dependências. Nenhum teste foi desabilitado, nenhuma quarentena foi convertida em correção definitiva.

**Próximo checkpoint:** reconsultar workflows e Preview do HEAD mais recente; revisar as quatro sobreposições e suas competências de forma independente na obra; corrigir páginas de históricos recuperáveis individualmente com antes/depois e evidência; só depois reconciliar branch e decidir integração. Não iniciar lote 017 enquanto essas pendências de qualidade persistirem.
