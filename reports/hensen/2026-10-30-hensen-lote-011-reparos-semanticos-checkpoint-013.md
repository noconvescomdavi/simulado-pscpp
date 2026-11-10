# ESTIBORDO/PSCPP — HENSEN — Checkpoint 013: duas equivalências semânticas do Lote 011

**Data:** 30/10/2026 (America/Sao_Paulo). **Escopo:** exclusivamente Henk Hensen, *Tug Use in Port*, 4ª edição, capítulos 1–7 e 9. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 . **Branch:** `audit/hensen-lote-001-20261029`.

## Diagnóstico

A inspeção independente dos 440 itens dos lotes 001–011 encontrou equivalências conceituais não detectadas pela triagem lexical declarada no relatório do Lote 011:

- `ANV-HENSEN-C03-L011-01` reproduzia a mesma limitação de mudança de bordo do `ANV-HENSEN-C03-L007-02`.
- `ANV-HENSEN-C07-L011-03` repetia o limiar de 2.000 kN para petroleiros grandes já cobrado por `ANV-HENSEN-C07-L008-05` (além da comparação por porte).

Ambas foram reescritas para cobrar **competências diferentes**, cotejadas diretamente no PDF original: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . Preservaram-se os IDs, as letras corretas E e A e a classificação `arte-naval / hensen-tug`. Não se trata de homologação editorial integral.

## Antes/depois individual

### ANV-HENSEN-C03-L011-01

**Antes — registro substituído:**

**Tema:** Restrição do bordo de atracação no push-pull

**Enunciado:** Dois rebocadores já estão amarrados ao costado para push-pull. O prático cogita inverter o bordo de atracação sem reposicioná-los. Qual limitação deve reconhecer?

- A) O método permite mudar livremente o bordo de atracação sem alterar a posição dos rebocadores.
- B) A limitação se aplica apenas ao reboque em linha, não ao push-pull.
- C) O bordo de atracação passa a depender exclusivamente do tipo de cabo usado.
- D) O push-pull impede que rebocadores produzam força transversal junto ao costado.
- E) Uma vez amarrados ao costado, os rebocadores ficam condicionados ao bordo oposto àquele de atracação, reduzindo a flexibilidade de escolha.

**Gabarito:** E

**Explicação:** Hensen aponta que os rebocadores em push-pull devem ficar no bordo oposto ao de atracação, com pouca flexibilidade após a amarração.

**Fonte:** Chapter 3, §3.2.2, p. 86 (PDF p. 99)

**Depois — registro atual:**

**Tema:** Segurança ao firmar rebocador de proa com velocidade mínima elevada

**Enunciado:** Um navio possui velocidade de Dead Slow Ahead de 7,5 nós. Em canal com vento lateral, é necessário firmar um rebocador pela proa sem perder o governo do navio. Segundo Hensen, por que pode ser empregado um rebocador de popa para controlar o seguimento nessa fase?

- A) Para permitir que o navio desligue o leme e mantenha apenas o governo pelo rebocador de proa.
- B) Para aumentar a velocidade sobre a água até o rebocador de proa conseguir acompanhar a aproximação.
- C) Para dispensar a avaliação de interação hidrodinâmica na passagem do cabo de proa.
- D) Para eliminar a necessidade de manter a máquina do navio adiante em presença de vento.
- E) Para reduzir o seguimento a uma faixa mais segura para firmar o rebocador de proa, mantendo máquina adiante e escoamento útil no leme.

**Gabarito:** E

**Explicação:** Hensen explica que, quando o Dead Slow Ahead excede cerca de 6–7 nós, a velocidade pode ser alta demais para firmar com segurança rebocadores de proa. Um rebocador omnidirecional de popa pode conter o seguimento enquanto a máquina do navio permanece adiante para preservar a governabilidade. A duração do esforço e a vibração no rebocador exigem avaliação operacional.

**Fonte:** Chapter 3, §3.2.2, p. 86 (PDF p. 99)

**Justificativa:** A questão antiga repetia a mudança do bordo de atracação no push-pull. A nova cobra o risco de firmar o rebocador de proa com Dead Slow Ahead superior a cerca de 6–7 nós e a utilização de rebocador de popa para manter o governo. Fonte primária: §3.2.2, página impressa 86 (PDF 99).

### ANV-HENSEN-C07-L011-03

**Antes — registro substituído:**

**Tema:** Resistência de conjuntos de reboque de emergência

**Enunciado:** Uma auditoria compara os requisitos de resistência de trabalho de conjuntos de reboque de emergência para petroleiros de 35.000 e 70.000 dwt, segundo as exigências reproduzidas por Hensen. Qual par está correto?

- A) Pelo menos 1.000 kN para 35.000 dwt e 2.000 kN para 70.000 dwt.
- B) 500 kN para ambas as faixas de porte.
- C) 2.000 kN para 35.000 dwt e 1.000 kN para 70.000 dwt.
- D) 1.000 kN para ambas as faixas, sem distinção de porte.
- E) 2.000 kN para ambas as faixas a partir de 20.000 dwt.

**Gabarito:** A

**Explicação:** O §7.8 registra resistência de trabalho mínima de 1.000 kN para petroleiros de 20.000 a menos de 50.000 dwt e 2.000 kN para 50.000 dwt ou mais.

**Fonte:** Chapter 7, §7.8, p. 210 (PDF p. 223)

**Depois — registro atual:**

**Tema:** Dimensionamento do comprimento mínimo do pendant de reboque de emergência

**Enunciado:** Um petroleiro tem borda-livre máxima em condição de lastro de 18 m no guia-cabo previsto para reboque de emergência. Segundo o critério de comprimento de towing pennant reproduzido por Hensen, qual valor mínimo resulta para esse componente?

- A) 86 m, correspondentes a duas vezes a borda-livre de 18 m, acrescidas de 50 m.
- B) 68 m, correspondentes à borda-livre de 18 m acrescida de 50 m.
- C) 54 m, correspondentes a três vezes a borda-livre de 18 m.
- D) 36 m, correspondentes apenas ao dobro da borda-livre de 18 m.
- E) 104 m, correspondentes a três vezes a borda-livre de 18 m acrescidas de 50 m.

**Gabarito:** A

**Explicação:** Na descrição dos requisitos de reboque de emergência, Hensen reproduz a referência IMO para comprimento do towing pennant de pelo menos duas vezes a maior borda-livre em lastro oceânico medida no guia-cabo, mais 50 m. Assim, 2 × 18 + 50 = 86 m. Trata-se de critério reproduzido na edição de 2021, não de verificação independente da norma vigente.

**Fonte:** Chapter 7, §7.8, p. 210 (PDF p. 223)

**Justificativa:** A questão antiga repetia o limiar de resistência de trabalho por porte. A nova exige cálculo do comprimento mínimo do towing pennant segundo a fórmula reproduzida por Hensen: 2 × 18 m + 50 m = 86 m. Fonte primária: §7.8, página impressa 210 (PDF 223).

## Integridade, incidentes e pendências

- **Commit inicial de conteúdo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/5a102a77160526401ebd259d03d64c6b7d84e726 . Uma transformação automatizada removeu inadvertidamente os campos `id` dos dois registros, **falha real e transitória** identificada imediatamente na verificação estrutural (39 IDs únicos).
- **Commit corretivo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/d05efc95c1a106534f3bee72a05ea128d60601e7 . Os dois IDs foram restaurados. O estado final desse commit foi novamente lido e verificado: **440 questões, 440 IDs únicos, 88 gabaritos por letra A–E, cinco alternativas textualmente distintas, explicação e localizador em todos os 440 registros.** Nenhum teste foi desabilitado. Não considerar o commit inicial apto para integração.
- **Pendência semântica ainda não corrigida:** `ANV-HENSEN-C01-L011-01` e `ANV-HENSEN-C01-L001-01` cobram essencialmente a mesma vantagem de acesso bilateral em píer em T; `ANV-HENSEN-C01-L011-04` repete a necessidade de transição e treinamento já cobrada por `ANV-HENSEN-C01-L002-04`, `C01-L007-04` e `C01-L008-04`. **Não declarar o Lote 011 homologado** até substituição por conceitos distintos, fundamentados na fonte.
- As **119 questões históricas continuam em quarentena reversível**, sem reativação; outras 51 históricas continuam pendentes de homologação. Não confundir quarentena com correção definitiva. O total bruto esperado é 610 (170 históricas + 440 novas), não o total publicado em Production.
- As questões novas continuam com `pending_editorial_review`; nenhuma foi marcada `duplicate_checked=true` por mera triagem lexical.

## Gates consultados no commit corretivo `d05efc95c1a106534f3bee72a05ea128d60601e7`

| Gate | Estado observado | Evidência |
|---|---|---|
| Audit Main Question Banks | queued | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41005495320 |
| PSCPP Integral Bank Audit | queued | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41005495289 |
| Full Question Bank Audit | queued | https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41005495307 |
| CI e Validate PIANC 121 | ainda não retornados na primeira página consultada | https://github.com/noconvescomdavi/simulado-pscpp/actions |
| GitHub status Vercel | **failure** — limite de builds | https://vercel.com/estibordo?upgradeToPro=build-rate-limit |
| Vercel Preview para o SHA | **não encontrado** (consulta filtrada por SHA) | https://vercel.com/estibordo/estibordo-pscpp |

**Produção consultada:** Vercel Production READY para `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ ; **não contém o Lote 011**. PR aberto e mergeável na consulta, mas **merge bloqueado** por falha Vercel, gates pendentes e revisão editorial incompleta. O resultado verde anterior do Full Question Bank Audit não elimina automaticamente os achados HIGH globais.

**Próximo passo:** confirmar os cinco workflows no HEAD final, corrigir as duas equivalências semânticas do capítulo 1, revisar a bibliografia dos históricos e aguardar Preview READY no SHA exato. Este relatório cria um novo commit documental, cujos gates devem ser consultados novamente.
