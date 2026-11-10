# HENSEN — Checkpoint 010: correção de equivalências semânticas no Lote 008

**Data:** 2026-10-29 (America/Sao_Paulo)  
**PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`  
**Commit de correção:** https://github.com/noconvescomdavi/simulado-pscpp/commit/ddb9b012eec0d22e2bb385f82ba3fc52f76d384f

## Método e evidência

Comparei os enunciados do Lote 008 com os 280 itens dos lotes 001–007, usando tokens normalizados e similaridade de Jaccard para triagem. A revisão manual identificou duas **equivalências de conceito e resposta**, apesar de redações diferentes. A comparação lexical não é prova de equivalência; a decisão abaixo baseia-se na interpretação das perguntas e gabaritos.

Consultei o texto da quarta edição de Henk Hensen, *Tug Use in Port* (2021), no [PDF original](https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view), especificamente §7.8, página impressa 210 (PDF 223), e §9.4, página impressa 247 (PDF 260). Substituí os conceitos repetidos por assuntos distintos encontrados nessas passagens. Os dois IDs e os gabaritos originais foram preservados; nenhuma questão histórica foi reativada.

## Reparos individuais — antes/depois

### ANV-HENSEN-C07-L008-05 — gabarito E preservado

**Duplicata semântica de:** `ANV-HENSEN-C07-L003-05`. Ambas exigiam reconhecer o limiar de 20.000 dwt para arranjos de reboque de emergência nas duas extremidades.

**Antes:**
- Enunciado: Segundo SOLAS II-1/3-4 reproduzida por Hensen, qual petroleiro exige arranjos de reboque de emergência nas duas extremidades?
- A: Toda embarcação de pesca de 100 AB.
- B: Somente petroleiros abaixo de 5.000 dwt.
- C: Apenas navios de passageiros interiores.
- D: Exclusivamente rebocadores azimutais.
- E: Petroleiro com porte bruto igual ou superior a 20.000 toneladas.
- Explicação: A regra reproduzida fixa o patamar de 20.000 dwt.
- Fonte: Chapter 7, §7.8, p. 209 (PDF p. 222).

**Depois:**
- Enunciado: Um petroleiro de 55.000 dwt possui arranjo de reboque de emergência. Segundo as diretrizes reproduzidas por Hensen, qual resistência de trabalho mínima deve ser prevista para seus componentes de reboque?
- A: 500 kN, independentemente do porte bruto.
- B: 750 kN, desde que a linha seja sintética.
- C: 1.000 kN, limite único para todos os petroleiros acima de 20.000 dwt.
- D: 1.500 kN, desde que a conexão seja feita pela proa.
- E: 2.000 kN, para petroleiros com porte bruto igual ou superior a 50.000 toneladas.
- Explicação: As diretrizes de arranjos de reboque de emergência apresentadas por Hensen distinguem resistência de trabalho mínima de 1.000 kN para petroleiros de 20.000 a menos de 50.000 dwt e de 2.000 kN para petroleiros com 50.000 dwt ou mais. Para 55.000 dwt, aplica-se 2.000 kN; a resistência de trabalho é definida como metade da resistência última.
- Fonte: **Chapter 7, §7.8, p. 210 (PDF p. 223)**.

**Justificativa:** o novo item avalia dimensionamento mecânico de componentes, não o limiar de obrigatoriedade de instalação. O trecho da fonte distingue explicitamente as faixas de 1.000 e 2.000 kN.

### ANV-HENSEN-C09-L008-01 — gabarito A preservado

**Duplicata semântica de:** `ANV-HENSEN-C09-L001-01`. Ambas cobravam o risco de rebocadores conectados em apenas um bordo após guinada inesperada.

**Antes:**
- Enunciado: Em escolta com rebocadores presos apenas a um bordo, o navio sofre guinada inesperada para o lado oposto. Qual problema de posicionamento deve ser previsto?
- A: Os rebocadores conectados podem ficar no bordo inadequado para contrariar a guinada, exigindo estudo de posições e assistência em ambos os bordos.
- B: Rebocadores presos em um bordo podem aplicar qualquer força lateral sem restrição geométrica.
- C: A direção da guinada não influencia a eficácia do posicionamento.
- D: A conexão torna desnecessário avaliar vento e corrente.
- E: A disposição lateral dos rebocadores só importa com o navio parado.
- Explicação: Hensen observa que rebocadores conectados a um único bordo podem não estar no lado adequado após uma guinada e discute cobertura dos dois bordos.
- Fonte: Chapter 9, §9.4, p. 247 (PDF p. 260).

**Depois:**
- Enunciado: Ao planejar a escolta em um canal de largura restrita, o prático deve decidir se os rebocadores acompanharão o navio conectados ou em prontidão sem cabo. Segundo Hensen, quais fatores devem fundamentar essa decisão?
- A: Restrições do canal em relação às dimensões e ao calado do navio, número e tipo de rebocadores disponíveis, posições possíveis, vento e corrente.
- B: Apenas a potência nominal do rebocador mais forte, independentemente da largura do canal.
- C: Exclusivamente a preferência comercial do operador, sem avaliar posicionamento e forças externas.
- D: Somente o tipo de carga transportada, pois a posição dos rebocadores não altera a resposta a falhas.
- E: Apenas a velocidade máxima de trânsito dos rebocadores, dispensando avaliação de vento e corrente.
- Explicação: Em §9.4, Hensen recomenda avaliar cuidadosamente se os rebocadores devem estar conectados ou não, considerando restrições do canal frente às dimensões e ao calado do navio, quantidade e tipo de rebocadores, posicionamento e efeitos de vento e corrente. Trata-se de decisão operacional distinta do problema de rebocadores já conectados a um único bordo.
- Fonte: **Chapter 9, §9.4, p. 247 (PDF p. 260)**.

**Justificativa:** a nova pergunta exige selecionar critérios de planejamento de escolta, e não repetir o diagnóstico de posicionamento após guinada.

## Validação estrutural

- Lotes 001–008: **320 questões**, 320 IDs únicos, cinco alternativas distintas por questão, gabaritos **64 A / 64 B / 64 C / 64 D / 64 E**.
- Triagem lexical após as alterações: três pares do Lote 008 contra lotes anteriores com Jaccard de tokens ≥ 0,30: `C05-L008-01 / C05-L001-03` (0,348), `C09-L008-03 / C09-L001-03` (0,348) e `C05-L008-04 / C05-L004-04` (0,308). São **candidatos a revisão**, não duplicatas confirmadas; abordam variáveis ou mecanismos potencialmente distintos.
- Nenhum Lote 009 foi criado. As 119 questões históricas em quarentena permanecem inativas; 51 históricas ativas ainda precisam de homologação individual.

## Bloqueios para integração

- PR #173 continua aberto, sem merge. O status Vercel no HEAD de código anterior indicava `failure` por limite de builds/deployments do plano gratuito; nenhum Preview READY foi localizado para os novos commits.
- A aprovação de workflows em commits anteriores não comprova o estado dos checks do HEAD final. Reconfirmar os cinco workflows antes de qualquer decisão.
- Production READY atualmente confirmada para `main` `a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, deployment https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ, sem os lotes HENSEN.
- A homologação bibliográfica/semântica integral e a revisão da quarentena continuam pendentes; não fazer merge até saneamento e verificação segura de publicação.
