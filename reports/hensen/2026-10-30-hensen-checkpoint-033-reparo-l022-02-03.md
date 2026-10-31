# HENSEN — Checkpoint 033 — 2026-10-30

## Escopo
PR #173, branch audit/hensen-lote-001-20261029. Obra Henk Hensen, Tug Use in Port, quarta edição (2021), capítulos 1–7 e 9.

## Fonte efetivamente consultada
Arquivo PDF "Tug use in Port-Hank Hanesen-2021.pdf" no Google Drive (ID 1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9), identificado no texto como Fourth revised edition, 2021. Capítulo 1, §1.2.5, página impressa 6 (PDF 19). O trecho trata da ausência de mooring boats e da necessidade de rebocadores capazes de empurrar o costado, além do controle de velocidade e rumo em caso de blackout.

## Alterações antes/depois
- ANV-HENSEN-C01-L022-02: antes, questão sobre assistência bilateral em píer T, semanticamente duplicada de C01-L001-01. Depois, questão sobre ausência de embarcações de amarração e capacidade de empurrar o costado para passagem das espias. Gabarito B preservado. Localizador atualizado de §1.2.1 p.4 para §1.2.5 p.6 (PDF 19).
- ANV-HENSEN-C01-L022-03: antes, questão sobre especificação antecipada da frota, duplicada de C01-L011-01. Depois, cenário de blackout na aproximação de eclusa e requisito de frenagem e/ou controle de rumo. Gabarito C preservado. Localizador atualizado de §1.2.1 p.5 para §1.2.5 p.6 (PDF 19).

## Integridade e ressalvas
Arquivo alterado: data/question-extensions/hensen-lote-022.json.
Commit de conteúdo: aaf2491f6a7d205dd8c2554dbd0e5ac81c7856ea
https://github.com/noconvescomdavi/simulado-pscpp/commit/aaf2491f6a7d205dd8c2554dbd0e5ac81c7856ea

IDs, gabaritos B/C, classificação arte-naval/hensen-tug, active=true e pending_editorial_review preservados. duplicate_checked permanece false: não foi concluída varredura semântica integral dos 22 lotes. L022-01 e L022-04 continuam pendentes de revisão de sobreposição. Não houve reativação de 119 históricos em quarentena.

## Gates e publicação
Não foi executada validação local nem confirmados os workflows ou Vercel Preview para o novo SHA. O merge permanece bloqueado. Nenhum deploy em Production foi solicitado ou confirmado. Os achados HIGH globais anteriores não foram declarados saneados.

## Próxima ação
Verificar CI, Full Question Bank Audit, Audit Main Question Banks, PSCPP Integral Bank Audit, Validate PIANC 121 e Vercel para o HEAD final; examinar as duas sobreposições restantes e varrer semanticamente o banco antes de homologar; reconciliar main apenas após resolução dos bloqueios.
