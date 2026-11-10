# HENSEN — Checkpoint 023: gates do Lote 022 e saturação semântica do capítulo 1

**Data de verificação:** 2026-10-30, aproximadamente 11h54–12h (America/Sao_Paulo).  
**PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**HEAD de conteúdo auditado:** `e88da6160fb8b08f41ceb6599ecb6408bef39b40`  
**Escopo:** Henk Hensen, *Tug Use in Port*, 4ª edição, capítulos 1–7 e 9.  
**Fonte primária acessada:** PDF do usuário em https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view (texto extraído conferido em §§1.2.1, 1.2.3 e 1.2.5; não equivale a cotejo visual integral).

## 1. Gates efetivamente observados no SHA e88da616

| Gate | Resultado | Evidência |
|---|---|---|
| CI, incluindo Study Plan V3 invariants, build e HTTP smoke E2E | SUCCESS | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41074206835 |
| Full Question Bank Audit | SUCCESS no workflow, **com 2.558 HIGH** | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41074207065 |
| Audit Main Question Banks | SUCCESS | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41074206871 |
| PSCPP Integral Bank Audit | SUCCESS | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41074206909 |
| Validate PIANC 121 CGE Quarantine | SUCCESS | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41074206913 |
| Vercel Preview | **READY**, deployment associado exatamente ao SHA e88da616 | https://vercel.com/estibordo/estibordo-pscpp/37VVd1aZLEFvWhWGY53nAHngtdiv |
| GitHub Vercel commit status | **pending** na consulta, apesar de a API do deployment informar READY | https://vercel.com/estibordo/estibordo-pscpp/37VVd1aZLEFvWhWGY53nAHngtdiv |

**Atenção:** SUCCESS no workflow do Full Audit não significa saneamento dos HIGH. Log do job: 176 arquivos, 26.425 questões, 2.558 HIGH, zero críticos, distribuídos em `DUPLICATE_STEM=1483`, `LOCATOR_DEPENDENT_STEM=816`, `GENERIC_TEMPLATE=258`, `OFFICIAL_SOURCE_DUPLICATE_OPTIONS=1`. Na etapa de auditoria executada dentro da CI, o log apontou 2.573 HIGH em 27.740 questões; são universos de execução distintos e os totais não devem ser confundidos. O passo `Enforce semantic audit` foi **skipped** no job CI observado; não foi alterado nesta execução.

**Preexistência:** há arquivo versionado em `main`, `reports/full-question-bank-audit.json`, gerado em 2026-09-28, com 283 HIGH no escopo restrito `data/questions`; isto comprova pendências anteriores, mas **não** demonstra que todos os 2.558 achados do escopo atual sejam preexistentes. Os 2.558 permaneceram iguais em checkpoints anteriores mesmo com aumento dos lotes. Não se atribui a falha histórica de Study Plan V3 a uma causa não comprovada: o teste agora passou.

## 2. Revisão semântica — Lote 022, capítulo 1

As questões abaixo foram comparadas com o texto atual de lotes anteriores e com os parágrafos da fonte. **Nenhum enunciado foi reescrito nem aprovado nesta execução.** A tabela distingue o antes (como está no JSON) do depois (situação editorial verificada).

| ID do Lote 022 | Antes: competência efetivamente cobrada | Comparação | Depois: decisão editorial |
|---|---|---|---|
| `ANV-HENSEN-C01-L022-02` | Geometria de píer em T permite assistência por ambos os bordos em contraste com cais contínuo; §1.2.1, p. 4 | `ANV-HENSEN-C01-L001-01` já cobra precisamente a vantagem de acesso bilateral do píer em T | **Duplicidade conceitual confirmada; reformulação obrigatória.** Não homologar como inédita |
| `ANV-HENSEN-C01-L022-03` | Planejar especificação de rebocadores e consultar operadores antes de inaugurar nova bacia; §1.2.1, p. 5 | `ANV-HENSEN-C01-L011-01` já cobra encomenda antecipada para nova bacia; `C01-L003-01` também trata de consulta aos operadores | **Sobreposição forte confirmada; reformulação obrigatória.** Não homologar como inédita |
| `ANV-HENSEN-C01-L022-04` | Compatibilidade de defensas/superestrutura com diferentes perfis de navios; §1.2.3, p. 6 | `ANV-HENSEN-C01-L005-03` já cobra mudança de geometria ao incluir ro-ro; `C01-L002-02` cobre heterogeneidade da frota | **Sobreposição forte; revisão e reformulação antes da homologação** |
| `ANV-HENSEN-C01-L022-01` | Modernização de navios e rebocadores não autoriza redução automática da assistência; §1.1, p. 3 | `ANV-HENSEN-C01-L014-01` e `C01-L007-01` já avaliam redução sem análise de risco | **Candidato a duplicidade; não homologado** |

Os enunciados e gabaritos originais foram preservados, com `validation_status=pending_editorial_review`. Esta anotação **não** equivale a correção definitiva nem autoriza publicação. O capítulo 1 está semanticamente saturado; suspender novos itens nesse capítulo até a revisão integral das competências e evitar mera troca cosmética de cenários. A mesma política de originalidade deve ser aplicada aos capítulos 2–7 e 9.

## 3. Inventário e quarentena

- 22 lotes × 40 = **880 questões novas propostas**; conferência da existência do arquivo e relatório do Lote 022 realizada, mas **não** homologação editorial de todos os 880.
- **170 históricos HENSEN**: 119 em quarentena reversível, 51 ativos sob revisão bibliográfica, segundo inventário persistido do PR. Nenhum histórico reativado neste checkpoint.
- Total bruto esperado: **1.050 registros HENSEN**, sem confundir esse total com conteúdo publicado em Production.
- A fonte PDF está acessível. A extração textual foi usada para conferir a fundamentação dos temas selecionados; **não houve cotejo visual integral** ou auditoria semântica exaustiva dos oito capítulos.

## 4. Integração e deploy

- PR #173 permanece **aberto, não integrado**, `mergeable=true` na consulta, mas a branch está **265 commits à frente e 2 atrás** de `main`, estado `diverged`.
- Vercel Production mais recente: **READY** para `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, **não** para HENSEN: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ .
- O Preview READY de e88da616 **não é Production**. Há pendências editoriais, achados HIGH e status Vercel commit pendente. **Merge e deploy não autorizados.**
- Este relatório é um commit documental posterior ao HEAD auditado: os gates do **novo HEAD** devem ser consultados novamente; não transportar os resultados verdes do SHA anterior para o commit documental sem confirmação.

## 5. Próximo trabalho obrigatório

1. Revisar todos os pares de competências do capítulo 1 e substituir as duplicidades por conceitos genuinamente inéditos e referenciados, ou manter as questões pendentes sem aprovação.
2. Conferir o status Vercel do HEAD final e a sincronização com `main`; resolver divergência de branch sem atropelar alterações da `main`.
3. Tratar HIGH com classificação por origem/escopo, sem ocultá-los ou desabilitar testes.
4. Retomar os 119 históricos individualmente, mantendo `active=false` até revisão independente e testes.
5. Não iniciar Lote 023 enquanto a homologação do Lote 022 e os bloqueios do PR não estiverem resolvidos.

**Alterações de conteúdo nesta execução:** nenhuma. **Antes/depois:** exclusivamente estado de diagnóstico editorial, não edição dos enunciados. **Não houve merge, deploy em produção, reativação de quarentena ou criação de novo lote.**
