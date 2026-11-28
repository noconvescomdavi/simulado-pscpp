# LOTE-06 — reconciliação incremental PR #266

- Main anterior: `51fe10bedf97dfe512266989c5c797820e2cef94`; atual: `5b293dc19367b58e88e14d41fb5a7f6cf3a10144`.
- PR concorrente #266 adicionou `data/question-restorations/manobrabilidade-msc137-lote-08.json`, blob `c60cc4168862f11974f0a249304f7cc2eb2456c6`, com **16 IDs** (`MAN-962`, `MAN-963`, `MAN-964`, `MAN-965`, `MAN-966`, `MAN-972`, `MAN-973`, `MAN-1029`, `MAN-1030`, `MAN-1031`, `MAN-1032`, `MAN-1033`, `MAN-1034`, `MAN-1035`, `MAN-1036`, `MAN-1038`).
- Verificação local do arquivo: JSON válido, IDs locais distintos, cinco opções e gabarito com letra presente: **PASS**. Interseção por ID com os 48 candidatos de hidrodinâmica: **0**.
- Esta verificação **não** prova inexistência de colisões com os 3.051 candidatos, equivalência semântica, correção de gabarito ou disponibilidade em runtime. A fonte MSC.137(76) não substitui as nove fontes.
- Nenhuma questão autoral foi cotejada em fonte primária, corrigida ou homologada nesta rodada. Não houve execução de build, CI, merge ou deploy.
- Pendência prioritária: reconstruir o inventário global ID + hash + origem efetiva e cruzar com a main; só então iniciar o cotejo por ID com Santos.
