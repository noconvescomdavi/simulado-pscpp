# ESTIBORDO/PSCPP — HENSEN — checkpoint 012 (gates e auditoria independente)

**Data:** 30/10/2026 (America/Sao_Paulo). **Escopo:** exclusivamente *Tug Use in Port*, Henk Hensen, 4ª edição, capítulos 1–7 e 9. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173. **HEAD examinado antes deste checkpoint:** `69340bb4db0e0b9479958aeea908f11d26a746d1`. **Branch:** `audit/hensen-lote-001-20261029`.

## 1. Gates efetivamente consultados no HEAD examinado

| Gate | Resultado | Evidência |
|---|---|---|
| CI | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998297652 |
| Full Question Bank Audit | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998297623 |
| Audit Main Question Banks | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998297511 |
| PSCPP Integral Bank Audit | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998297585 |
| Validate PIANC 121 CGE Quarantine | success | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/40998297619 |
| GitHub Vercel commit status | **failure** | https://vercel.com/estibordo?upgradeToPro=build-rate-limit |
| Vercel Preview para o SHA exato | **não localizado** | Consulta Vercel list_deployments com filtro SHA retornou 0 deployments |

O PR estava **aberto, não mesclado, mergeable=true** na consulta. O resultado verde de um workflow de auditoria não equivale a eliminar todos os achados editoriais HIGH; não foi alegada a correção desses achados. O status Vercel do HEAD continua reprovado. **Sem merge.**

**Production:** o deployment mais recente consultado como production estava READY em `dpl_Ge8vf857oW5hH1tzasSPgjNbReiJ`, vinculado ao commit `a03ccf972a021f9a2c8fee3ba09de3271fa089a7` da `main`, e não ao HEAD HENSEN. https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ. Não houve publicação HENSEN.

## 2. Verificação estrutural independente dos dez lotes

Foram lidos diretamente os arquivos `data/question-extensions/hensen-lote-001.json` até `hensen-lote-010.json` no HEAD acima:

- 400 questões / 400 IDs únicos; dez lotes de 40; gabaritos A=80, B=80, C=80, D=80, E=80.
- 400/400 com cinco alternativas textualmente distintas, explicação e localizador não vazio, classificação `arte-naval / hensen-tug`.
- 80 questões ainda com `validation_status=pending_editorial_review` e `validation.duplicate_checked=false` (não homologar automaticamente).
- Para o Lote 010, confronto lexical dos enunciados com os lotes 001–009: nenhum par atingiu Jaccard >= 0,30 na tokenização com palavras funcionais removidas; maior valor observado **0,261**, entre `ANV-HENSEN-C01-L010-03` e `ANV-HENSEN-C01-L003-04`. Os temas são distintos (passo fixo/controlável versus função do tubulão), mas **esse teste não demonstra ausência de duplicidade semântica**.

Inventário histórico declarado no PR: 170 questões anteriores, 119 em quarentena reversível e 51 ativas pendentes de homologação. Não foi feita reativação nem se declarou reparo definitivo.

## 3. Oito verificações bibliográficas diretas no texto primário (uma por capítulo)

A fonte foi acessada pelo conector Google Drive: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . As páginas abaixo são as impressas, com deslocamento PDF +13, conforme os localizadores. Esta rodada conferiu texto técnico, não imagens/figuras:

| ID | Âncora cotejada diretamente | Localizador | Resultado |
|---|---|---|---|
| `ANV-HENSEN-C01-L010-03` | Rebocadores convencionais com hélices de passo fixo/controlável e tubulões | §1.3, p. 7 (PDF 20) | compatível com descrição textual |
| `ANV-HENSEN-C02-L010-02` | Amostragem de 1 Hz ou melhor para evitar aliasing na prova de bollard pull | §2.26, p. 79 (PDF 92) | confirmado |
| `ANV-HENSEN-C03-L010-05` | Rebocador de ré no cabo, de vante no ombro, transição para push-pull na atracação | §3.2.1, p. 84 (PDF 97) | compatível |
| `ANV-HENSEN-C04-L010-03` | Cabo de 80–100 m como exemplo para reduzir picos de carga em marulho | §4.5.1, p. 128 (PDF 141) | confirmado |
| `ANV-HENSEN-C05-L010-04` | Fórmula aproximada `Fwave = 112 L Hs²` em kgf, para ondas curtas de través | §5.2.4, p. 140 (PDF 153) | confirmado; 112×200×0,25 = 5.600 kgf |
| `ANV-HENSEN-C06-L010-04` | PLT 75, ar comprimido e distância de segurança de até 90 m | §6.3.5, p. 160 (PDF 173) | confirmado |
| `ANV-HENSEN-C07-L010-05` | Pontos passivos desconectados por manipulador; ativos também por comando do navio | §7.6.2, p. 206 (PDF 219) | confirmado |
| `ANV-HENSEN-C09-L010-02` | Critério histórico de leme travado a 35° e velocidade de 6 nós | §9.7, p. 267 (PDF 280) | confirmado, não validar como norma vigente |

**Antes/depois:** nenhum desses oito registros foi modificado nesta execução. Não houve correção de enunciado, alternativa, gabarito, explicação ou localizador; portanto, antes = depois. Nenhum ID novo ou lote foi criado. Esta auditoria pontual não substitui revisão independente integral de todos os itens.

## 4. Bloqueios e próximos passos

1. Recuperação legítima da capacidade de deploy/Preview Vercel e verificação de **Preview READY no HEAD exato**, sem contornar limites.
2. Homologação editorial e semântica dos lotes, sobretudo os 80 marcados pendentes, com conferência visual onde houver figuras e dados gráficos.
3. Revisão dos 51 históricos ativos e reparo gradual dos 119 em quarentena, preservando o estado inativo até validação independente.
4. Como este próprio relatório cria novo commit documental, **os gates do novo HEAD deverão ser consultados novamente**; não atribuir automaticamente a ele os resultados do SHA anterior.
5. Não mesclar nem publicar enquanto houver gate obrigatório reprovado ou homologação incompleta.

**Status:** bloqueado por Vercel e revisão editorial. Checkpoint persistido sem mascarar falhas e sem alterações nas questões.
