# HENSEN — Lote 013 — checkpoint persistente 02 (correções semânticas e bibliográficas)

**Data:** 30/10/2026. **Branch:** `audit/hensen-lote-001-20261029`. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 .

## Alterações
- JSON reparado: `d3f006a2efcbedb5002eb95f7667fd2ca147861a` — C06-L013-01 e C06-L013-03 substituídas por competências distintas; seis localizadores de página ajustados; 40 IDs e 40 gabaritos preservados.
- Relatório por ID revisado: `876a1a8f6b67b338e6c57432e97ae7c22d037d68`.
- Fonte: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . Novas âncoras verificadas no capítulo 6; cotejo visual pendente.

## Testes locais
- 13 JSONs: 520 registros, 520 IDs únicos, 5 alternativas A–E por registro, 8 gabaritos por letra em cada lote; nenhuma colisão literal com os 480 anteriores.
- Jaccard lexical máximo do lote 013: 0.227 contra `ANV-HENSEN-C07-L007-01`; não certifica originalidade semântica integral.
- Histórico: 170 registros, incluindo 119 em quarentena, não alterados; revisão independente pendente.
- `npm run validate` e `npm run build`: não executados localmente.

## CI observado no commit do relatório (anterior ao checkpoint)
```json
[]
```

O checkpoint produz novo HEAD; não inferir aprovação de gates sem reconsultá-los no SHA exato. Vercel Preview vinha falhando por limite de builds. **Sem merge e sem deploy.** Próxima execução deve verificar `hensen-lote-014.json` antes de criar outro lote.
