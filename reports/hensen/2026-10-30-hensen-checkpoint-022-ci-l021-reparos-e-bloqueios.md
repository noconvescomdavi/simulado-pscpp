# ESTIBORDO/PSCPP — Checkpoint HENSEN 022 — causa dos gates e reparos bibliográficos/semânticos

**Data:** 2026-10-30, America/Sao_Paulo. **Escopo exclusivo:** Henk Hensen, *Tug Use in Port*, quarta edição, capítulos 1–7 e 9. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173. **Branch:** `audit/hensen-lote-001-20261029`.

## Diagnóstico reproduzível do checkpoint recebido

No HEAD inicial desta execução, `6dccbf6d72f0bfd17116f36b8f60c9b064bc6a4c`, dois workflows falharam:

- **CI**, https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41065182184: o passo `Study Plan V3 invariants` **passou**; o passo `Validate Hensen source locators and explanations` falhou com `HENSEN_SOURCE_ERROR: ANV-HENSEN-C05-L021-03: localizador HENSEN inválido ou páginas incoerentes: Chapter 5, §5.2.2–5.2.4, p. 140 (PDF p. 153)`.
- **Full Question Bank Audit**, https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41065182219: o mesmo guard bibliográfico falhou no primeiro passo, impedindo a execução de `audit-full-question-bank.mjs`. Portanto **não** se pode atribuir a falha atual aos 2.558 achados HIGH históricos, nem declarar que esses achados foram sanados.
- **Audit Main Question Banks**, **PSCPP Integral Bank Audit** e **Validate PIANC 121 CGE Quarantine**: `success` no mesmo HEAD.
- **Vercel**: status `failure` com destino `https://vercel.com/estibordo?upgradeToPro=build-rate-limit`, consistente com limitação de builds. Não contornado.

A falha atual é **nova e introduzida pelo Lote 021**: o localizador usa um intervalo de seções não aceito pela regra explícita do guard `scripts/validate-hensen-source-locators.mjs` (regex para seção única). A regra foi preservada; **não houve desativação de testes**. Os erros originais de 2.754 achados/1 crítico e de Study Plan V3 não foram reproduzidos neste HEAD; isso não comprova a causa histórica desses erros.

## Alterações concretas (antes/depois)

| ID | Antes | Depois | Fonte e justificativa | Commit |
|---|---|---|---|---|
| `ANV-HENSEN-C05-L021-03` | Localizador `Chapter 5, §5.2.2–5.2.4, p. 140 (PDF p. 153)`; explicação sem delimitar a derivação numérica | `Chapter 5, §5.2.1, p. 136 (PDF p. 149)`; explicação identifica composição 40+10−25 como **aplicação didática**, não fórmula numérica de Hensen | Fonte primária §5.2.1: forças de vento, corrente e ondas precisam ser compensadas pelos rebocadores; 25 tf para bombordo é o equilíbrio no cenário hipotético sem momentos/reservas | https://github.com/noconvescomdavi/simulado-pscpp/commit/f1e3ac15aab7ec4dd37d70467f078246671edcef |
| `ANV-HENSEN-C02-L021-03` | Segurança de entrada na área do guincho radial, competência já cobrada por `ANV-HENSEN-C02-L020-02` | Proteção da praça de máquinas por **SaferVents** durante grandes ângulos de banda | §2.16, p. 50/PDF 63: Hensen descreve SaferVents e o procedimento de estacionamento do guincho como medidas distintas | https://github.com/noconvescomdavi/simulado-pscpp/commit/33c5e52d0bf7f404a92834864c39a9e7bf7a60cb |
| `ANV-HENSEN-C07-L021-01` | Gob rope mal ajustada após desatracação, risco de `girting` já coberto pelo histórico `ANV-B010-16` | `Towing staple` com abertura transversal: deslocamento do cabo para bordo baixo pode produzir **momento de endireitamento e abrasão adicional** | §7.2.2, p. 178/PDF 191: mecanismo explicitamente descrito; distinto de gob rope esquecida | https://github.com/noconvescomdavi/simulado-pscpp/commit/33c5e52d0bf7f404a92834864c39a9e7bf7a60cb |

**Preservados:** os três IDs, cinco alternativas por questão, gabaritos respectivamente A/C/B, `arte-naval/hensen-tug`, `pending_editorial_review`. O Lote 021 continua com 40 questões, cinco por capítulo, gabaritos A=B=C=D=E=8. Os 119 históricos continuam em quarentena reversível; **não** houve reativação ou homologação definitiva. Nenhum novo lote foi iniciado.

**Fonte consultada nesta execução:** PDF de Hensen 4ª ed. em https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view; seções 2.16, 5.2.1 e 7.2.2 foram lidas diretamente no texto extraído. Inspeção visual integral do PDF e revisão semântica independente dos 840 itens permanecem pendentes.

**Relatório individual atualizado:** https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-30-lote-021-auditoria.md (commit https://github.com/noconvescomdavi/simulado-pscpp/commit/1e9e908a66e0c6f0be8037d90a09938505a1d872).

## Inventário e gates de publicação

- **21 lotes × 40 = 840 questões novas propostas**; **170 históricos**, sendo **119 em quarentena** e **51 ativos ainda sob revisão**. Total bruto esperado: 1.010 registros HENSEN, sem equiparar `active` a `approved`.
- No HEAD `1e9e908a66e0c6f0be8037d90a09938505a1d872` (após os reparos e o relatório), consulta aos GitHub Actions retornou **zero workflow runs disponíveis ainda**. O status Vercel era **failure por limite de builds**, e a busca de deployment por SHA retornou **zero**; nenhum Preview READY foi verificado para esse HEAD.
- PR #173 continua aberto, não mesclado; consulta imediata após a atualização retornou `mergeable=false` (pode refletir cálculo transitório, mas **não** autoriza merge). A branch segue **divergente**, 259 commits à frente e 2 atrás da main na comparação anterior aos reparos; reconsultar antes de integração.
- **Vercel Production:** último deployment `READY` consultado: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ para `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`. Isso **não é** o SHA HENSEN e não comprova publicação da main atual.
- O relatório global de um SHA anterior registrava **2.558 HIGH, 0 CRITICAL**. Sua resolução/preexistência integral não foi comprovada; gate `success` sozinho não os elimina.

**Decisão:** merge e publicação **bloqueados** até (i) CI e auditorias no HEAD final concluídas, (ii) avaliação editorial/bibliográfica e semântica independente, (iii) branch atualizada e mergeável, (iv) Preview Vercel READY para o SHA exato e (v) após integração autorizada, Production READY para o SHA correto. Não alterar a regra do guard, não suprimir testes e não contornar limites de Vercel.

**Próxima execução:** verificar os workflows disparados após o checkpoint; tratar eventuais falhas reais; continuar revisão de equivalências do capítulo 1 e dos históricos em quarentena, registrando cada ID antes/depois. Não produzir Lote 022 antes da liberação do checkpoint atual.
