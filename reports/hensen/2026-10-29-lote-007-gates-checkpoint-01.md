# HENSEN — Lote 007 — Gates e checkpoint 01

**Data:** 2026-10-29. **Repositório:** `noconvescomdavi/simulado-pscpp`. **Branch:** `audit/hensen-lote-001-20261029`. **PR:** [#173](https://github.com/noconvescomdavi/simulado-pscpp/pull/173).

## Arquivos e commits desta execução

1. `data/question-extensions/hensen-lote-007.json`: 40 novas questões; criação `2f6b9e7f2279b424ec60e26c0336ef8390996adc`.
2. Correção editorial de quatro sobreposições semânticas: `ANV-HENSEN-C02-L007-04`, `ANV-HENSEN-C04-L007-03`, `ANV-HENSEN-C06-L007-04`, `ANV-HENSEN-C07-L007-03`; commit `7af55fb90576d00c58081cb61997ff410b7e83a8`.
3. `lib/question-banks-source.js`: registro do Lote 007 no banco de Arte Naval; commit `103032cc04d6692375aa4ca97598383149aa108b`.
4. [Relatório individual de 40 IDs](https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-29-lote-007-auditoria.md): commit `e483172aaee80765527657ac9a11190ada38e437`.

## Inventário e verificações

- Históricos HENSEN: **170** (119 em quarentena reversível, 51 ativos ainda sujeitos a homologação individual).
- Lotes 001–007: **280 novas questões**, 40 por lote. Total esperado: **450 registros HENSEN**, sendo **331 ativos em metadados** antes dos filtros adicionais de runtime.
- Lote 007: **5 questões por capítulo 1–7 e 9**, **40 IDs distintos**, **5 alternativas A–E por questão**, **8 gabaritos por letra**.
- Validação por leitura direta dos JSON no GitHub: **0 IDs repetidos no lote, 0 alternativas inválidas e 0 enunciados literalmente idênticos aos 240 novos anteriores**.
- A obra primária foi consultada no Google Drive: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view. **Páginas visuais e equivalência PDF p. = impressa + 13 não foram independentemente confirmadas para todos os 40 itens.**
- Triagem semântica preliminar encontrou quatro aproximações reescritas; a maior similaridade lexical remanescente envolve `ANV-HENSEN-C05-L007-03` e `ANV-HENSEN-C05-L002-02`, sobre variáveis distintas (calado versus velocidade) da força de corrente. Exige revisão independente, não é homologação de originalidade.

## Workflows observados no commit de integração `103032cc0`

| Workflow | Situação observada | Run |
|---|---|---|
| CI | in_progress / pendente | [40980537357](undefined) |
| Validate PIANC 121 CGE Quarantine | completed / success | [40980537298](undefined) |
| Audit Main Question Banks | completed / success | [40980537435](undefined) |
| PSCPP Integral Bank Audit | in_progress / pendente | [40980537125](undefined) |
| Full Question Bank Audit | completed / success | [40980537124](undefined) |

**HEAD anterior à criação deste checkpoint:** `e483172aaee80765527657ac9a11190ada38e437`. Os resultados acima não comprovam aprovação do HEAD final documental. Não foram executados `npm run validate` nem `npm run build` localmente nesta execução; dependeremos de CI. Nenhum gate foi desabilitado.

## Pendências e continuidade

1. Verificar a conclusão de CI e PSCPP Integral Bank Audit e todos os checks no HEAD relevante; corrigir falhas sem contornar validações.
2. Auditar individualmente as páginas e a semântica dos 40 novos itens, com prioridade aos pares lexicalmente próximos e à qualidade dos distratores.
3. Homologar as 51 questões históricas ativas e manter as 119 em quarentena.
4. **Não realizar merge nem deploy** antes da homologação e aprovação de todos os gates.
5. Na próxima execução, consultar este checkpoint e verificar se `hensen-lote-008.json` já existe, evitando duplicações.

**Estado:** Lote 007 criado, integrado e reportado na branch; PR aberto; sem merge ou deploy.
