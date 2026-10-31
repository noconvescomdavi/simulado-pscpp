# ESTIBORDO/PSCPP — HENSEN — checkpoint 007 (29/10/2026)

**Escopo:** Henk Hensen, *Tug Use in Port*, 4ª edição revisada (2021), capítulos 1–7 e 9, classificação Arte Naval / `hensen-tug`. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 . **Branch:** `audit/hensen-lote-001-20261029`.

**Decisão:** **SEM MERGE E SEM PUBLICAÇÃO PRODUCTION** neste checkpoint. Há pendências de revisão editorial independente das 200 novas e 51 históricas ativas, além dos gates do HEAD final que precisam terminar. A quarentena histórica é reversível, não correção definitiva.

## Estado remoto antes da intervenção

- PR #173: `open`, `merged=false`, `mergeable=true`, HEAD `a1ee1277f15509a5eb5bc56fcd8f5dabeb2d7e51`.
- Os cinco workflows GitHub Actions do HEAD **a1ee1277** estavam **SUCCESS**:
  - [CI #40966214973](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40966214973);
  - [Full Question Bank Audit #40966214936](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40966214936);
  - [Audit Main Question Banks #40966214959](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40966214959);
  - [PSCPP Integral Bank Audit #40966214951](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40966214951);
  - [Validate PIANC 121 #40966214964](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40966214964).
- O Vercel Preview desse SHA estava **READY**: https://vercel.com/estibordo/estibordo-pscpp/CYKpB5cfeCPbLGDnSv9NnryugK6M ; o status combinado GitHub Vercel ainda retornava `pending`. Não tratar essas duas fontes como idênticas.
- Vercel **Production READY somente para a `main` `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`**, sem os lotes HENSEN: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ .
- O último inventário de auditoria integral detalhado no checkpoint 006 ainda indicava **0 CRITICAL e 2.555 HIGH**; não há evidência neste checkpoint de saneamento desses HIGH. PASS do workflow não significa 0 HIGH.

## Revisão independente da fonte e correção de duplicidade conceitual

Foi lido diretamente o PDF do acervo do usuário, quarta edição revisada de 2021 (https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view). A extração textual foi cotejada com oito questões do Lote 005, uma por capítulo. O deslocamento de paginação usado pelos lotes é **PDF = página impressa + 13**.

| ID | Página impressa / PDF | Confronto direto da fundamentação |
|---|---|---|
| `ANV-HENSEN-C01-L005-02` | 5 / 18 | §1.2.1 distingue acessos sujeitos a ondas/marulho e requisitos específicos para escolta de petroleiros e gaseiros; base da redação corrigida |
| `ANV-HENSEN-C02-L005-01` | 53 / 66 | §2.18.3 indica side-stepping do SDM de 6,5 nós |
| `ANV-HENSEN-C03-L005-04` | 95 / 108 | §3.4.1 afirma que submarinos têm círculos de giro naturalmente grandes |
| `ANV-HENSEN-C04-L005-04` | 128 / 141 | §4.5.2, estudo SAFETUG, inclui movimentos na posição do passadiço e critérios para o operador humano |
| `ANV-HENSEN-C05-L005-03` | 140 / 153 | §5.2.4 apresenta força de ondas curtas proporcional ao quadrado da amplitude |
| `ANV-HENSEN-C06-L005-02` | 163 / 176 | §6.3.12 alerta para excesso de zoom/overscale no ECDIS, perda de referências e erros GNSS |
| `ANV-HENSEN-C07-L005-02` | 183 / 196 | §7.3.3.3 diz que o self-rendering descrito não é adequado a áreas portuárias estreitas |
| `ANV-HENSEN-C09-L005-05` | 267 / 280 | §9.7 esclarece que as regras citadas refletem 2017–2018 e podem mudar |

**Detecção de duplicidade semântica efetiva:** `ANV-HENSEN-C01-L003-05` e `ANV-HENSEN-C01-L005-02` perguntavam a mesma consequência operacional da expansão de pátio de contêineres sobre a bacia de manobra, apesar de enunciados textualmente diferentes. A comparação dos 200 registros dos lotes 001–005 revelou similaridade lexical normalizada de 0,409 no par (tokens de enunciado + tema); a conclusão de duplicidade foi confirmada por leitura de ambos os enunciados, gabaritos e justificativas.

### Antes → depois (reparo genuíno)

**`ANV-HENSEN-C01-L005-02`**:
- **Antes:** tema `Conflito entre pátio de contêineres e bacia de evolução`; enunciado: “Um terminal amplia seu pátio de contêineres, reduzindo a área aquática de manobra. Qual consequência deve ser reavaliada antes de aprovar o projeto?”; gabarito D sobre espaço de evolução e arranjo de assistência. Mesmo conceito do Lote 003.
- **Depois:** tema `Adequação da escolta de petroleiros em acessos expostos`; enunciado: “Um porto pretende empregar, na escolta de petroleiros em sua barra sujeita a ondas e marulho, rebocadores selecionados somente para empurrar navios em bacias abrigadas. Qual lacuna técnica precisa ser resolvida antes dessa designação?”; alternativa correta D: “Verificar a capacidade de operar nas condições de ondas e marulho do acesso e de cumprir os requisitos específicos da escolta.”
- Foram reescritas **as cinco alternativas, a explicação, o tema e o enunciado**, mantendo **ID, gabarito D, taxonomia `arte-naval / hensen-tug::ch1`, estado ativo e localizador exato** `Chapter 1, §1.2.1, p. 5 (PDF p. 18)`.
- A página impressa 5 foi verificada diretamente na fonte primária. O Lote 003 não foi alterado.
- **Commit de conteúdo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/734783fc0221a242586478536c8a40a5e547d6c2 .
- **Relatório individual do Lote 005 atualizado:** https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-29-lote-005-auditoria.md ; commit documental https://github.com/noconvescomdavi/simulado-pscpp/commit/f0da7df05b933cf1391f6090f93510783e966e8c .

## Inventário estrutural e pendências

- Lotes 001–005: **200 novas**, 40 por lote; 25 por capítulo nos capítulos 1–7 e 9. **200 IDs distintos**, 200 enunciados literais distintos e gabaritos **A=40, B=40, C=40, D=40, E=40**; a edição preservou essas contagens.
- Históricas: **170**, sendo **119 em quarentena reversível** e **51 ativas ainda não homologadas individualmente**, conforme inventário do checkpoint 006; nenhuma dessas questões foi modificada ou reativada neste checkpoint. `ANV-B010-16` permanece como candidata reescrita em quarentena, pendente de revisão independente.
- A triagem lexical também destacou `ANV-HENSEN-C09-L004-04` e `ANV-HENSEN-C09-L005-03` com similaridade 0,222; isso **não é prova de equivalência semântica**, e o par requer revisão contextual. Há outras sobreposições temáticas a examinar independentemente, incluindo as sinalizadas nos relatórios dos lotes.
- A revisão direta de oito itens do Lote 005 não homologa os outros 32 itens desse lote, nem as 160 questões dos lotes anteriores ou as 51 históricas ativas.
- **Lote 006 não iniciado**; nenhuma reativação ou merge.

## Gates após a correção

Após o commit documental `f0da7df05b933cf1391f6090f93510783e966e8c`, o PR continuava aberto e mergeável, mas **CI, Full Question Bank Audit, Audit Main Question Banks, PSCPP Integral Bank Audit e Validate PIANC 121 estavam em execução**, e Vercel Preview estava **QUEUED**: https://vercel.com/estibordo/estibordo-pscpp/9gQ8S9sM4mrMWaqVY43MjDLgjyjK .

**Importante:** a publicação deste relatório gera novo commit documental, que exigirá nova verificação do HEAD exato. Não se autoriza merge com base em gates verdes de SHA anterior. Confirmar também o estado real da Production no SHA correto após eventual merge seguro.

**Próxima execução:** conferir checks do HEAD final, comparar fonte e conceitos de mais questões, resolver pares semanticamente equivalentes, revisar os 51 históricos ativos e avançar gradualmente na reparação bibliográfica dos 119 em quarentena. Persistir IDs, antes/depois e evidências; não desativar gates nem declarar quarentena como reparo definitivo.


## Adendo — dois HIGH HENSEN identificados no artefato da auditoria e corrigidos

O artefato de [Full Question Bank Audit #40969338336](https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40969338336) registrou **2.556 HIGH e 0 CRITICAL** em 25.745 questões. O arquivo JSON do artefato foi inspecionado integralmente: **dois HIGH são HENSEN**, ambos `LOCATOR_DEPENDENT_STEM` — `ANV-HENSEN-C06-L002-01` e `ANV-HENSEN-C09-L005-05`. Não confundir workflow PASS com ausência de HIGH.

Os dois enunciados foram reformulados para situações operacionais autocontidas, com a fonte primária conferida em **§6.2.4, p. 154 / PDF 167** e **§9.7, p. 267 / PDF 280**, respectivamente. **Gabaritos D e E, alternativas, IDs, taxonomia e estado ativo foram preservados.** Commits de conteúdo: [3179b3a](https://github.com/noconvescomdavi/simulado-pscpp/commit/3179b3ac222aea5b4692472eacd5e2c3be25e014) e [7f06f85](https://github.com/noconvescomdavi/simulado-pscpp/commit/7f06f85da98177908bf9be2412fa7c779126c17f).

**Relatório individual antes/depois, justificativas, URLs e limitações:** [2026-10-29-hensen-locator-reparos-01.md](https://github.com/noconvescomdavi/simulado-pscpp/blob/audit/hensen-lote-001-20261029/reports/hensen/2026-10-29-hensen-locator-reparos-01.md).

O resultado do novo Full Question Bank Audit precisa confirmar a eliminação desses **dois IDs HENSEN**; não se afirma que os 2.554 HIGH restantes tenham sido resolvidos. Este adendo gera novo HEAD e obriga reconferir todos os gates. **Merge e Production permanecem bloqueados.**
