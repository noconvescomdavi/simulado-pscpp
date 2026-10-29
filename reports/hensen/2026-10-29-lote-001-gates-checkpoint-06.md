# ESTIBORDO/PSCPP — HENSEN — checkpoint 006 (29/10/2026)

**PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`  
**Escopo:** Henk Hensen, *Tug Use in Port*, quarta edição revisada (2021), capítulos 1–7 e 9.  
**Decisão:** **NÃO FAZER MERGE** enquanto a homologação editorial integral e os gates do HEAD final não estiverem concluídos. Não publicar Production.

## Estado remoto verificado antes das alterações

- PR #173: **open**, `merged=false`, `mergeable=true`; HEAD `3c56d5122db2c160d2e88edb227755e8b3a705e1`.
- **Cinco GitHub Actions SUCCESS no mesmo HEAD**:
  - CI: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40958028806
  - Full Question Bank Audit: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40958028699
  - Audit Main Question Banks: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40958028775
  - PSCPP Integral Bank Audit: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40958029020
  - Validate PIANC 121 CGE Quarantine: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40958028682
- Vercel **Preview READY** para exatamente `3c56d512...`: https://vercel.com/estibordo/estibordo-pscpp/GU4CKH2eAQxUVKpSryu8BnLBx3Cy . GitHub Combined Status ainda informava contexto Vercel `pending` na consulta, apesar do deployment READY: não confundir as duas fontes.
- Vercel **Production READY** para a `main` `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, **sem os lotes HENSEN**: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ .
- Full Question Bank Audit do HEAD anterior: **158 arquivos, 25.705 questões, 0 CRITICAL, 2.555 HIGH**, distribuídos em 813 `LOCATOR_DEPENDENT_STEM`, 1.483 `DUPLICATE_STEM`, 258 `GENERIC_TEMPLATE` e 1 `OFFICIAL_SOURCE_DUPLICATE_OPTIONS`. **PASS do workflow não equivale à resolução dos HIGH.** O acréscimo de 1 HIGH frente aos 2.554 anteriores não foi atribuído causalmente sem diff de achados.

## Inventário HENSEN reconferido nos quatro JSONs

- 170 históricas: **119 em quarentena reversível**, **51 ativas ainda não homologadas individualmente**.
- Lotes 001–004: **160 novas**, 40 por lote, 5 por capítulo por lote, capítulos 1–7 e 9.
- Total bruto HENSEN: **330 questões**, das quais **211 marcadas ativas** antes de filtros adicionais de runtime.
- Verificados diretamente os quatro JSONs no HEAD: **160 IDs únicos, 160 enunciados literais distintos, alternativas A–E completas, explicação e localizador presentes em todos, taxonomia `arte-naval / hensen-tug` em todos**.
- Gabarito A/B/C/D/E: **32/32/32/32/32**. Não houve criação de Lote 005, nem reativação dos 119 antigos.
- A triagem de unicidade literal **não** comprova originalidade semântica; o relatório do Lote 004 sinaliza quatro sobreposições temáticas com históricos, ainda abertas para revisão independente.
- Relatórios individuais existentes: `reports/hensen/2026-10-29-lote-001-auditoria.md`, `...lote-002-auditoria.md`, `...lote-003-auditoria.md`, `...lote-004-auditoria.md`.

## Auditoria de fonte: oito amostras do Lote 004 (uma por capítulo)

Fonte: PDF da edição revisada de 2021, 335 páginas, disponível no acervo do usuário. Confronto direto entre pergunta/gabarito e página impressa (deslocamento +13 no PDF):

| ID | Página impressa / PDF | Resultado |
|---|---|---|
| `ANV-HENSEN-C01-L004-04` | 7 / 20 | §1.3 sustenta propulsor de proa orientável e retrátil em rebocador convencional |
| `ANV-HENSEN-C02-L004-05` | 78 / 91 | §2.26 explicita força proporcional ao quadrado e potência ao cubo da rotação |
| `ANV-HENSEN-C03-L004-03` | 94 / 107 | §3.3.8 recomenda navio a ré e máquina pronta a avante no cenário descrito de gelo |
| `ANV-HENSEN-C04-L004-01` | **119 / 132 (corrigida)** | §4.3.2 contém a explicação específica sobre os propulsores do Rotortug próximos aos pontos de reboque e empurrão |
| `ANV-HENSEN-C05-L004-04` | 147 / 160 | §5.3.5 dá distância proporcional a velocidade ao quadrado e ressalva o atraso de frenagem |
| `ANV-HENSEN-C06-L004-04` | 162 / 175 | §6.3.8 confirma risco de emborcamento com máquina avante súbita |
| `ANV-HENSEN-C07-L004-02` | 187 / 200 | §7.4.2 descreve KO-LINK como elo fraco controlado |
| `ANV-HENSEN-C09-L004-01` | 255 / 268 | §9.6.2 compara atraso e forças na escolta passiva e ativa |

**Limite metodológico:** são oito confrontos específicos do Lote 004, não homologação independente das 160 questões novas. Questões históricas ativas e quarentenadas continuam exigindo revisão individual.

## Correção genuína — ID e antes/depois

**`ANV-HENSEN-C04-L004-01`** (Rotortug, §4.3.2):
- **Antes:** `source.locator = "Chapter 4, §4.3.2, p. 120 (PDF p. 133)"`. A página 120 traz a continuação do resumo §4.3.3 e não a passagem precisa invocada pelo enunciado.
- **Depois:** `source.locator = "Chapter 4, §4.3.2, p. 119 (PDF p. 132)"`. A página 119 explicita duas unidades azimutais a vante e uma a ré e o efeito da proximidade do propulsor ao ponto de tração/empurrão.
- **Preservados:** ID, enunciado, alternativas, gabarito A, explicação, taxonomia, `active=true`; nenhum outro item alterado.
- **Commit de conteúdo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/671791bedb4d46bd7ba7b716cda98a04480316dd
- **Commit do relatório individual:** https://github.com/noconvescomdavi/simulado-pscpp/commit/024d7411e96ffcc273fdb4d7e887c131b25a00ca
- **Pendência:** verificar equivalência temática com `ANV-B008-06` e revisar de forma independente a originalidade semântica.

## Gates após os commits deste checkpoint

Os cinco SUCCESS e o Preview READY acima são **do SHA anterior `3c56d512...`**. As alterações de conteúdo e documentação criaram novo HEAD (`024d7411...` antes da publicação deste relatório). **Os gates desse novo HEAD ainda não haviam sido concluídos na consulta.** A criação deste relatório gera outro commit documental, que também requer reconferência.

**Próxima execução:** reconferir SHA atual, cinco workflows e Vercel Preview; não fazer merge se qualquer gate estiver pendente ou falho. Priorizar revisão bibliográfica individual e sobreposições semânticas das 160 novas e 51 históricas ativas; reparar gradualmente as 119 históricas em quarentena, somente com prova de fonte e relatório antes/depois. Não confundir quarentena com correção.
