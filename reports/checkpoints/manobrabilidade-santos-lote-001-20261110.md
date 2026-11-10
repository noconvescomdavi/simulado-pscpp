# Checkpoint — Manobrabilidade Santos, lote 001 — 2026-11-10

- PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/176
- Branch: `feature/manobrabilidade-santos-lote-001-20261110`
- IDs existentes no lote: `MSN21-REV-001` a `MSN21-REV-050`; 50 questões, sem recriação nesta execução.
- Arquivo: `data/question-extensions/manobrabilidade-santos-lote-001.json`.
- Correção de qualidade nesta execução: `lib/question-quality-policy.js` passa a colocar em quarentena questões de combinação de afirmativas cujas proposições não são recuperáveis pela mesma estrutura renderizada na interface, mesmo quando há menções a numerais romanos no enunciado.
- Commit da correção: `541133acff1c1872e54d8cee1de25b1aad7e36f6`.
- GitHub Actions no commit: Full Question Bank Audit, Audit Main Question Banks e Validate PIANC 121 CGE Quarantine aprovados; PSCPP Integral Bank Audit reprovado, com `2080` registros ativos de taxonomia inválida, `464` em quarentena e `212` capítulos críticos (13.658 questões analisadas). CI ainda em execução no momento do checkpoint.
- Bloqueio de integração: não executar merge nem alegar deploy de produção com controle integral reprovado. Os erros de taxonomia precisam ser discriminados entre preexistentes e introduzidos, e o CI deve ficar verde.
- Preview Vercel anterior (commit `1a9a0a62b1dab7c339e4b8468a819a269a3fa302`) reportado READY, mas não corresponde ao commit de correção atual.
- Validação bibliográfica: o arquivo do lote contém campos de fonte/página e flags de revisão, mas esta execução não confirmou individualmente as 50 citações contra as páginas originais; não considerar nova homologação bibliográfica nesta execução.
- Próxima etapa: verificar CI do commit atual, corrigir falhas incrementais, auditar as citações e gabaritos com o PDF primário acessível, distinguir taxonomia preexistente, e só então realizar merge/deploy de produção. Não numerar lote 002 antes de concluir o lote 001.
