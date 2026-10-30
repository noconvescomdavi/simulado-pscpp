# ESTIBORDO/PSCPP — HENSEN — checkpoint 009: reparo de distratores do Lote 007

**Data:** 29/10/2026 (America/Sao_Paulo). **PR:** [#173](https://github.com/noconvescomdavi/simulado-pscpp/pull/173). **Branch:** `audit/hensen-lote-001-20261029`.
**Escopo:** exclusivamente Henk Hensen, *Tug Use in Port*, 4ª edição, capítulos 1–7 e 9. Taxonomia `arte-naval / hensen-tug`.

## Diagnóstico editorial novo — falha não detectada pela CI

Na leitura individual das 40 questões do Lote 007, identificou-se reaproveitamento das **mesmas cinco alternativas para várias perguntas distintas de um capítulo**. A questão podia ser respondida por exclusão de opções de outros temas, sem domínio do assunto. A existência de cinco opções e de gabarito equilibrado, isoladamente, não assegura distratores válidos.
Antes do reparo, capítulos 01, 03, 05 e 09 reutilizavam um conjunto idêntico nas cinco perguntas; capítulos 02, 04, 06 e 07 tinham quatro perguntas com conjunto idêntico e uma exceção. **É falha editorial substantiva; manter o merge bloqueado até saneamento e revisão independente.**

## Intervenções efetivamente publicadas

- [Commit `c9fb24e`](https://github.com/noconvescomdavi/simulado-pscpp/commit/c9fb24ee6a9715ee829c065c0e865dad2f66d6d0): cinco questões do capítulo 5 com alternativas independentes e plausíveis, explicações técnicas, e correção de página de `ANV-HENSEN-C05-L007-04`.
- [Commit `f004982`](https://github.com/noconvescomdavi/simulado-pscpp/commit/f004982667d50890c783a113b44362bf92613da4): cinco questões do capítulo 1 com alternativas independentes e explicações fundamentadas.
- [Fonte primária consultada no Google Drive](https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view): §1.1, §1.2.1, §1.2.4, §1.2.6, §1.3, §5.2.2, §5.2.3, §5.3.1 e §5.3.2. As verificações foram feitas no texto extraído da edição de 2021; a inspeção visual de cada página permanece etapa independente.

## Registro individual — antes/depois

### `ANV-HENSEN-C01-L007-01` — Redução de rebocadores

**Enunciado preservado:** Após modernização da frota, um armador solicita reduzir automaticamente a assistência para economizar. Qual decisão é tecnicamente adequada?

**Gabarito preservado:** A. **Fonte:** `Chapter 1, §1.1, p. 3 (PDF p. 16)` → `Chapter 1, §1.1, p. 3 (PDF p. 16)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Avaliar os riscos e a capacidade efetiva para cada manobra, sem adotar o mínimo comercial como padrão de segurança. | Avaliar riscos, capacidade efetiva e condições de cada manobra antes de decidir quantos rebocadores empregar. |
| B | Verificar potência, manobrabilidade e características do guincho conforme a instalação e as condições locais. | Reduzir sempre um rebocador quando a frota tiver propulsão azimutal, independentemente do navio. |
| C | Verificar o gabarito e a geometria das passagens para o conjunto rebocador–estrutura. | Manter um único rebocador se a potência total instalada for maior que a da frota antiga. |
| D | Aprender respostas, vantagens e limitações das novas unidades e de suas tripulações. | Adotar o menor número comercialmente possível sem considerar vento, corrente ou espaço de manobra. |
| E | O trator tem propulsores sob a parte de vante; o ASD os possui a ré. | Substituir a avaliação de assistência pelo histórico de ausência de acidentes do último mês. |

**Explicação anterior:** A pressão econômica por menos rebocadores não substitui a análise operacional.

**Explicação corrigida:** O §1.1 descreve que a evolução de navios e rebocadores pode reduzir a demanda de assistência, mas também registra pressão econômica para usar o mínimo. Essa tendência não elimina a análise das condições e dos riscos da manobra.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C01-L007-02` — Serviço em FPSO e SPM

**Enunciado preservado:** Um rebocador de porto abrigado será empregado em operações junto a FPSO e monoboia expostos. Que estudo adicional é essencial?

**Gabarito preservado:** B. **Fonte:** `Chapter 1, §1.2.1, p. 4 (PDF p. 17)` → `Chapter 1, §1.2.1, p. 4 (PDF p. 17)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Avaliar os riscos e a capacidade efetiva para cada manobra, sem adotar o mínimo comercial como padrão de segurança. | Verificar somente se o rebocador possui a mesma potência nominal usada no porto abrigado. |
| B | Verificar potência, manobrabilidade e características do guincho conforme a instalação e as condições locais. | Avaliar ondas, vento, estabilidade, defensas, guinchos, potência e manobrabilidade exigidos na instalação exposta e pelo porte das unidades. |
| C | Verificar o gabarito e a geometria das passagens para o conjunto rebocador–estrutura. | Priorizar apenas a velocidade máxima de trânsito, sem reavaliar a operação de aproximação. |
| D | Aprender respostas, vantagens e limitações das novas unidades e de suas tripulações. | Dispensar a análise de equipamentos de reboque quando a operação ocorrer fora de um cais convencional. |
| E | O trator tem propulsores sob a parte de vante; o ASD os possui a ré. | Considerar que os requisitos de um SPM são idênticos aos de qualquer berço protegido. |

**Explicação anterior:** Hensen associa as exigências de SPM e instalações flutuantes ao serviço e ao porte das unidades.

**Explicação corrigida:** Em §1.2.1, Hensen diferencia instalações expostas e abrigadas, indicando requisitos específicos para operações em ondas e vento, e para SPMs e F(P)SOs conforme as condições e dimensões das unidades.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C01-L007-03` — Reboque de seção de túnel

**Enunciado preservado:** Uma seção flutuante de túnel será rebocada por rio com pontes. Que fator precisa integrar o plano de manobra?

**Gabarito preservado:** C. **Fonte:** `Chapter 1, §1.2.4, p. 6 (PDF p. 19)` → `Chapter 1, §1.2.4, p. 6 (PDF p. 19)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Avaliar os riscos e a capacidade efetiva para cada manobra, sem adotar o mínimo comercial como padrão de segurança. | Escolher apenas o rebocador de maior bollard pull, sem verificar dimensões nem passagens. |
| B | Verificar potência, manobrabilidade e características do guincho conforme a instalação e as condições locais. | Desconsiderar o arranjo de reboque, porque a seção flutuante não possui propulsão própria. |
| C | Verificar o gabarito e a geometria das passagens para o conjunto rebocador–estrutura. | Planejar a passagem sob pontes, o espaço de manobra e a geometria do conjunto rebocado, além das condições do rio. |
| D | Aprender respostas, vantagens e limitações das novas unidades e de suas tripulações. | Utilizar obrigatoriamente um único rebocador à popa em todas as passagens de ponte. |
| E | O trator tem propulsores sob a parte de vante; o ASD os possui a ré. | Definir o plano apenas pela velocidade de cruzeiro dos rebocadores em mar aberto. |

**Explicação anterior:** A obra cita expressamente transporte de seções de túnel através de pontes.

**Explicação corrigida:** O §1.2.4 exemplifica o transporte de seções de túnel por rio e sob pontes; o plano deve compatibilizar dimensões, arranjo e manobrabilidade dos rebocadores com as restrições da rota.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C01-L007-04` — Troca de frota

**Enunciado preservado:** Por que a troca simultânea de rebocadores pode exigir período de adaptação dos práticos e comandantes?

**Gabarito preservado:** D. **Fonte:** `Chapter 1, §1.2.6, p. 6 (PDF p. 19)` → `Chapter 1, §1.2.6, p. 6 (PDF p. 19)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Avaliar os riscos e a capacidade efetiva para cada manobra, sem adotar o mínimo comercial como padrão de segurança. | Porque os rebocadores novos necessariamente possuem menor força de tração que os anteriores. |
| B | Verificar potência, manobrabilidade e características do guincho conforme a instalação e as condições locais. | Porque o método de assistência se mantém idêntico mesmo com novo tipo de propulsão. |
| C | Verificar o gabarito e a geometria das passagens para o conjunto rebocador–estrutura. | Porque a experiência acumulada com a frota antiga é irrelevante para a manobra. |
| D | Aprender respostas, vantagens e limitações das novas unidades e de suas tripulações. | Porque práticos e comandantes precisam aprender respostas, limitações e métodos da nova frota, com transição e treinamento planejados. |
| E | O trator tem propulsores sob a parte de vante; o ASD os possui a ré. | Porque a troca de frota elimina a necessidade de comunicação entre navio e rebocador. |

**Explicação anterior:** A experiência local com uma frota não se transfere automaticamente a outra.

**Explicação corrigida:** Em §1.2.6, Hensen ressalta que a experiência local inclui conhecer vantagens e limitações de cada rebocador. Mudanças de tipo ou método exigem instrução, treinamento e transição planejada.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C01-L007-05` — Trator azimutal e ASD

**Enunciado preservado:** Qual diferença de arranjo propulsivo distingue trator azimutal e ASD?

**Gabarito preservado:** E. **Fonte:** `Chapter 1, §1.3, p. 7 (PDF p. 20)` → `Chapter 1, §1.3, p. 7 (PDF p. 20)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Avaliar os riscos e a capacidade efetiva para cada manobra, sem adotar o mínimo comercial como padrão de segurança. | No trator azimutal os propulsores ficam à popa; no ASD, sob a proa. |
| B | Verificar potência, manobrabilidade e características do guincho conforme a instalação e as condições locais. | Ambos são definidos pela existência obrigatória de três unidades azimutais. |
| C | Verificar o gabarito e a geometria das passagens para o conjunto rebocador–estrutura. | O ASD utiliza somente hélices de eixo fixo, sem rotação azimutal. |
| D | Aprender respostas, vantagens e limitações das novas unidades e de suas tripulações. | O trator azimutal não pode empregar propulsores orientáveis em 360°. |
| E | O trator tem propulsores sob a parte de vante; o ASD os possui a ré. | No trator azimutal os propulsores ficam sob a parte de vante; no ASD, à popa. |

**Explicação anterior:** A localização das unidades propulsoras é central à classificação.

**Explicação corrigida:** O §1.3 diferencia os rebocadores trator, com unidades propulsoras sob a região de vante, dos rebocadores ASD, com propulsores azimutais à popa.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C05-L007-01` — Área vélica

**Enunciado preservado:** Aumentam as camadas de contêineres sobre o convés. O que atualizar no cálculo da força de vento?

**Gabarito preservado:** A. **Fonte:** `Chapter 5, §5.2.2, p. 136 (PDF p. 149)` → `Chapter 5, §5.2.2, p. 136 (PDF p. 149)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Área exposta e coeficientes aplicáveis à nova configuração. | Recalcular a área lateral exposta ao vento, incluindo os contêineres, e aplicar coeficientes adequados ao novo perfil. |
| B | O coeficiente de momento depende da forma, carregamento e ângulo do vento. | Manter a área vélica anterior, pois o casco e o deslocamento não foram alterados. |
| C | Aproximadamente dobra. | Alterar apenas a densidade do ar, já que a altura da carga não influencia a força lateral. |
| D | A efetividade do bow thruster pode estar quase anulada nessa velocidade. | Substituir a área acima da linha d'água pela área submersa para representar os contêineres. |
| E | 167 tf. | Desconsiderar o vento de través, porque o aumento da carga afeta somente a força longitudinal. |

**Explicação anterior:** A carga no convés integra a área ao vento.

**Explicação corrigida:** Em §5.2.2, a área exposta ao vento inclui a carga de convés; a forma e a condição de carregamento também influenciam os coeficientes aerodinâmicos. A avaliação deve refletir a nova configuração.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C05-L007-02` — Momento de vento

**Enunciado preservado:** Dois navios de igual área lateral têm superestruturas diferentes. Por que seus momentos de guinada pelo vento podem diferir?

**Gabarito preservado:** B. **Fonte:** `Chapter 5, §5.2.2, p. 136 (PDF p. 149)` → `Chapter 5, §5.2.2, p. 136 (PDF p. 149)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Área exposta e coeficientes aplicáveis à nova configuração. | Os momentos são necessariamente iguais, pois a área lateral exposta é a mesma. |
| B | O coeficiente de momento depende da forma, carregamento e ângulo do vento. | O coeficiente de momento de guinada varia com a geometria, a distribuição das superfícies, a condição de carregamento e o ângulo de incidência do vento. |
| C | Aproximadamente dobra. | A diferença só poderia ocorrer se a densidade do ar fosse diferente para cada navio no mesmo local. |
| D | A efetividade do bow thruster pode estar quase anulada nessa velocidade. | O momento de guinada independe do ângulo do vento quando a área lateral é igual. |
| E | 167 tf. | O momento é determinado exclusivamente pela potência dos rebocadores disponíveis. |

**Explicação anterior:** O coeficiente aerodinâmico não é universal.

**Explicação corrigida:** O §5.2.2 diferencia os coeficientes de força e de momento do vento: mesmo com áreas laterais iguais, formas e superestruturas distintas podem produzir coeficientes e momentos de guinada diferentes.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C05-L007-03` — Calado e corrente

**Enunciado preservado:** Mantidos os demais parâmetros, o calado passa de 5 m para 10 m. Como varia a força transversal de corrente na fórmula simplificada?

**Gabarito preservado:** C. **Fonte:** `Chapter 5, §5.2.3, p. 138 (PDF p. 151)` → `Chapter 5, §5.2.3, p. 138 (PDF p. 151)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Área exposta e coeficientes aplicáveis à nova configuração. | Permanece constante, porque a velocidade da corrente não se alterou. |
| B | O coeficiente de momento depende da forma, carregamento e ângulo do vento. | Quadruplica, pois a força é proporcional ao quadrado do calado. |
| C | Aproximadamente dobra. | Aproximadamente dobra, desde que velocidade, comprimento, densidade e coeficiente de força permaneçam constantes. |
| D | A efetividade do bow thruster pode estar quase anulada nessa velocidade. | Reduz-se à metade, porque maior calado diminui a área submersa. |
| E | 167 tf. | Aumenta oito vezes, pois a força é proporcional ao cubo do calado. |

**Explicação anterior:** O calado aparece linearmente na expressão de força.

**Explicação corrigida:** Em §5.2.3, a expressão FYc = 0,5 × CYc × ρ × V² × LBP × T é linear no calado T. Dobrar T dobra FYc somente sob a hipótese enunciada de manter os demais fatores constantes; na prática, a folga sob a quilha pode alterar CYc.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C05-L007-04` — Bow thruster a quatro nós

**Enunciado preservado:** Um navio pretende substituir o rebocador de proa por bow thruster numa passagem estreita a quatro nós. Qual ressalva vale?

**Gabarito preservado:** D. **Fonte:** `Chapter 5, §5.3.1, p. 143 (PDF p. 156)` → `Chapter 5, §5.3.1, p. 144 (PDF p. 157)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Área exposta e coeficientes aplicáveis à nova configuração. | A força transversal do bow thruster aumenta com o seguimento, dispensando o rebocador de proa. |
| B | O coeficiente de momento depende da forma, carregamento e ângulo do vento. | A potência nominal assegura força transversal constante, qualquer que seja a velocidade do navio. |
| C | Aproximadamente dobra. | A perda de eficiência ocorre apenas com seguimento a ré, não durante avanço. |
| D | A efetividade do bow thruster pode estar quase anulada nessa velocidade. | A quatro nós, a eficácia do bow thruster pode ficar quase nula; não se deve presumir que substitua o rebocador de proa. |
| E | 167 tf. | A restrição é determinada apenas pelo comprimento do cabo do rebocador, sem relação com a velocidade. |

**Explicação anterior:** O seguimento reduz fortemente a eficácia do propulsor transversal.

**Explicação corrigida:** No §5.3.1, Hensen informa redução de eficácia de aproximadamente 50% a dois nós e quase total a quatro nós. Em passagem estreita com seguimento, o propulsor transversal não deve ser considerado substituto automático do rebocador de proa.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

### `ANV-HENSEN-C05-L007-05` — Exemplo de tração

**Enunciado preservado:** No exemplo de Hensen, vento exige 117 tf, corrente 42 tf e ondas 8 tf. Qual é a tração compensatória total?

**Gabarito preservado:** E. **Fonte:** `Chapter 5, §5.3.2, p. 144 (PDF p. 157)` → `Chapter 5, §5.3.2, p. 144 (PDF p. 157)`.

| Alternativa | Antes | Depois |
|---|---|---|
| A | Área exposta e coeficientes aplicáveis à nova configuração. | 125 tf, considerando apenas vento e ondas. |
| B | O coeficiente de momento depende da forma, carregamento e ângulo do vento. | 159 tf, considerando apenas vento e corrente. |
| C | Aproximadamente dobra. | 50 tf, considerando apenas corrente e ondas. |
| D | A efetividade do bow thruster pode estar quase anulada nessa velocidade. | 175 tf, contabilizando a parcela de ondas duas vezes. |
| E | 167 tf. | 167 tf, pela soma das parcelas de vento, corrente e ondas. |

**Explicação anterior:** As três parcelas do exemplo somam 167 tf.

**Explicação corrigida:** No exemplo de §5.3.2, as parcelas compensatórias são 117 tf de vento, 42 tf de corrente e 8 tf de ondas; sua soma é 167 tf. Esse valor não dispensa avaliação de distribuição de esforços e condições locais.

**Justificativa:** alternativas agora disputam o mesmo problema técnico do enunciado, em vez de reaproveitar respostas de questões alheias; a resposta correta permanece verificável na seção citada.

## Verificações locais de estrutura

- Comparação JSON antes/depois no GitHub: **10 IDs alterados, nenhum outro registro modificado**.
- Lote 007: **40 IDs únicos, cinco alternativas A–E distintas por questão, 8 gabaritos por letra A–E**.
- Enunciados, IDs, taxonomia, status ativo, chave correta e campos de validação preservados nas dez questões.
- Localizador corrigido: `ANV-HENSEN-C05-L007-04`, de **§5.3.1, página impressa 143 / PDF 156** para **§5.3.1, página impressa 144 / PDF 157**, conforme a posição do parágrafo sobre perda de eficácia do bow thruster a quatro nós no texto da obra.

## Pendências editoriais prioritárias

Reuso de alternativas ainda identificado no Lote 007 após estes dez reparos:

| Capítulo | Maior grupo com opções idênticas |
|---|---:|
| 01 | 1 de 5 |
| 02 | 4 de 5 |
| 03 | 5 de 5 |
| 04 | 4 de 5 |
| 05 | 1 de 5 |
| 06 | 4 de 5 |
| 07 | 4 de 5 |
| 09 | 5 de 5 |

**30 questões ainda não revisadas individualmente nesta execução**, incluindo 31 itens inicialmente agrupados em conjuntos repetidos nos capítulos 02, 03, 04, 06, 07 e 09 (alguns grupos incluem quatro e outros cinco questões). Esse diagnóstico é restrito ao Lote 007, não uma aprovação dos lotes 001–006. Revisar também a equivalência semântica e a plausibilidade dos distratores remanescentes.

## Gates e publicação

- No HEAD anterior às alterações (`a1546bb44908c995109da16386580318d43d3d8a`), os cinco workflows GitHub Actions **concluíram com sucesso**: CI, Full Question Bank Audit, Audit Main Question Banks, PSCPP Integral Bank Audit e Validate PIANC 121.
- Entretanto, o status Vercel no mesmo HEAD era **failure**, com URL de limite diário: https://vercel.com/estibordo?upgradeToPro=build-rate-limit . A discussão do PR registra explicitamente `api-deployments-free-per-day`, mais de 100 deployments, e recomendação de tentar novamente após 24 horas.
- Vercel Production READY consultada: `a03ccf972a021f9a2c8fee3ba09de3271fa089a7` da `main`, **sem HENSEN**: https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ .
- Os commits de conteúdo e este relatório mudam o HEAD; **todos os gates devem ser verificados novamente no SHA final**, sem herdar resultados do SHA anterior.
- **Sem merge, sem deploy Production, sem reativação dos 119 históricos em quarentena.** Não considerar `approved` como homologação editorial independente.

## Próxima execução

1. Verificar o HEAD e todos os checks GitHub Actions; manter o bloqueio de Preview enquanto persistir a cota Vercel, sem contornar a limitação.
2. Sanear distratores repetidos dos capítulos 02, 03, 04, 06, 07 e 09, sempre conferindo a fonte primária e registrando antes/depois por ID.
3. Homologar semântica, gabaritos, localização impressa/PDF e não duplicidade; depois prosseguir com as 51 históricas ativas e 119 em quarentena.
4. Só integrar PR após revisão editorial, checks verdes, mergeabilidade e publicação segura; confirmar Production READY para o SHA exato do merge.
