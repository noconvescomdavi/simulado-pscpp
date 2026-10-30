# HENSEN — Lote 020 — auditoria e rastreabilidade individual
Data: 2026-10-30. Repositório `noconvescomdavi/simulado-pscpp`, branch `audit/hensen-lote-001-20261029`, PR #173.
Fonte primária: Henk Hensen, *Tug Use in Port*, 4ª edição (2021), Google Drive `1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9`.
Estado editorial: `pending_editorial_review` — **não homologado**.

## Inventário e verificações realizadas
- Confirmados 19 lotes anteriores (760 questões); lote 020 ausente antes da inclusão. O lote novo acrescenta 40 questões (800 novas nos 20 lotes).
- Distribuição: cinco questões por capítulo 1, 2, 3, 4, 5, 6, 7 e 9. Gabaritos A=8, B=8, C=8, D=8, E=8.
- Integridade: 40 IDs únicos, cinco alternativas A–E distintas e preenchidas por questão, gabarito correspondente a uma alternativa, justificativas técnicas e localizadores em formato `Chapter, §, p. (PDF p.)`.
- Fonte: 40/40 âncoras textuais localizadas no texto extraído do PDF original do Google Drive, na região da página impressa declarada; o deslocamento para PDF é +13.
- Comparação automatizada com 760 enunciados dos lotes 001–019: zero colisões literais de ID/enunciado e, após a revisão de C03-L020-02, nenhum par com Jaccard de tokens ≥0,34; máximo 0,308.
- Comparação com 170 registros HENSEN históricos em dez blocos (006, 007, 008, 010, 013, 016, 019, 021, 022, 023): zero colisões literais; Jaccard máximo 0,250.
- Comparação interna entre as 40 novas questões: nenhum enunciado literalmente repetido e nenhum par com Jaccard ≥0,60.
- O arquivo principal `data/questions/arte-naval.json` tem aproximadamente 6,8 MB; a leitura integral pelo conector retornou conteúdo truncado. **Originalidade conceitual perante o banco principal não foi homologada.**
- Não foi possível clonar o repositório neste ambiente (resolução DNS indisponível); `npm` local não executado. Os workflows remotos devem ser consultados por SHA.
- **Pendências:** conferência visual de cada página, revisão editorial independente dos conceitos e distratores, comparação integral com banco principal, todos os gates no HEAD final, Preview Vercel.

## Relatório por ID
### ANV-HENSEN-C01-L020-01 — Fases com geometria portuária diferente
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** A; **referência:** Chapter 1, §1.2.1, p. 4 (PDF p. 17).
- **Enunciado:** Um navio transita por eclusa e depois atraca em terminal com ampla bacia. Qual critério deve orientar a escolha do método de assistência?
- **Justificativa técnica:** Hensen distingue portos convencionais, com eclusas e pontes, de terminais com manobras mais padronizadas. A geometria e a fase da operação condicionam método e aptidão dos rebocadores.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C01-L020-02 — Guincho em terminal exposto
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** B; **referência:** Chapter 1, §1.2.1, p. 4 (PDF p. 17).
- **Enunciado:** Um rebocador tem bollard pull suficiente para píer offshore sujeito a ondas, mas seu guincho não controla picos de tensão. Qual conclusão é adequada?
- **Justificativa técnica:** Para instalações expostas, Hensen exige considerar estabilidade, defensas robustas, guinchos render-recovery e potência. A tração estática não representa todas as cargas dinâmicas.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C01-L020-03 — Frota mista e interfaces de casco
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** C; **referência:** Chapter 1, §1.2.3, p. 6 (PDF p. 19).
- **Enunciado:** Um terminal antes exclusivo para petroleiros passará a receber também ro-ro e porta-contêineres de grande borda-livre. O que deve ser reavaliado?
- **Justificativa técnica:** Hensen vincula o tipo de navio a requisitos distintos de potência, equipamentos, defensas, manobrabilidade e superestrutura. A nova composição de tráfego altera as interfaces operacionais.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C01-L020-04 — Escolta acrescentada ao serviço portuário
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** D; **referência:** Chapter 1, §1.2.5, p. 6 (PDF p. 19).
- **Enunciado:** O berço permanece inalterado, mas o porto introduz escolta no canal de acesso. Qual requisito deve entrar no estudo da frota?
- **Justificativa técnica:** A necessidade de escolta figura entre os fatores que definem o método de assistência. Forças e segurança durante o trânsito diferem das condições estáticas de atracação.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C01-L020-05 — Mesmo bollard pull em envelopes diferentes
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** E; **referência:** Chapter 1, §1.5, p. 8 (PDF p. 21).
- **Enunciado:** Dois rebocadores fornecem 65 t de bollard pull, mas um trabalha junto ao berço e outro em curva de canal a 5 nós com pequena folga sob a quilha. São intercambiáveis por esse único dado?
- **Justificativa técnica:** Hensen ressalta que importa como, quando e em quais circunstâncias a força atua. Igual bollard pull não implica desempenho dinâmico ou segurança equivalentes.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C02-L020-01 — Durabilidade ambiental de defensas
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** C; **referência:** Chapter 2, §2.2.4, p. 14 (PDF p. 27).
- **Enunciado:** Além das curvas de absorção de energia, o que deve constar da especificação de defensas expostas a água poluída e sol intenso?
- **Justificativa técnica:** Hensen inclui resistência a água contaminada, ozônio, radiação ultravioleta e temperaturas extremas entre os critérios de escolha do elastômero.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C02-L020-02 — Área de giro do guincho radial
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** D; **referência:** Chapter 2, §2.16, p. 50 (PDF p. 63).
- **Enunciado:** A tripulação precisa entrar na área de um guincho radial para desconectar o cabo. Qual sequência é segura?
- **Justificativa técnica:** No conceito All-Rounder, o freio de estacionamento imobiliza o guincho durante o acesso ao convés e o giro só é liberado depois que a área estiver desocupada.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C02-L020-03 — Guias elevadas no Giano
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** E; **referência:** Chapter 2, §2.21.1, p. 62 (PDF p. 75).
- **Enunciado:** O Giano utiliza guinchos e guias de cabo elevados. Qual solicitação continua relevante apesar da grande estabilidade inicial?
- **Justificativa técnica:** Hensen observa que fairleads altos podem aumentar o braço vertical da tensão do cabo. Estabilidade elevada não elimina a necessidade de avaliar momentos dinâmicos.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C02-L020-04 — PTO Shore Connection
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** A; **referência:** Chapter 2, §2.23, p. 70 (PDF p. 83).
- **Enunciado:** No modo PTO Shore Connection de rebocador híbrido, conectado à energia do cais, qual condição dos motores de combustão é descrita?
- **Justificativa técnica:** Hensen diferencia PTO Shore Connection, com motores desligados, do PTI Booster, em que máquina elétrica e motor diesel podem atuar juntos.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C02-L020-05 — Energia no modo TRNST 2
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** B; **referência:** Chapter 2, §2.23, p. 70 (PDF p. 83).
- **Enunciado:** No modo TRNST 2 do Rotortug híbrido, um motor diesel aciona diretamente um propulsor. Como os outros dois recebem energia?
- **Justificativa técnica:** O exemplo TRNST 2 combina diesel-direct em um propulsor com geração no eixo para alimentar os motores elétricos dos outros dois.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C03-L020-01 — Troca temporária de método na ponte
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** E; **referência:** Chapter 3, §3.2.1, p. 82 (PDF p. 95).
- **Enunciado:** Num porto que usa normalmente rebocadores ao costado, o navio precisa passar por ponte estreita antes de atracar. Qual opção é coerente?
- **Justificativa técnica:** Hensen relata que portos de prática predominantemente lateral podem recorrer excepcionalmente a reboque por cabo em pontes estreitas ou diques.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C03-L020-02 — Translação lateral no alongside towing com potências equilibradas
- **Alteração:** Reescrita integral após alerta de similaridade com C03-L019-01; substituída a função genérica do rebocador de popa por translação no alongside towing. Gabarito A preservado.
- **Gabarito:** A; **referência:** Chapter 3, §3.2.1, p. 84 (PDF p. 97).
- **Enunciado:** Na manobra de alongside towing ilustrada por Hensen, o rebocador aplica leme todo a bombordo e máquina avante, enquanto a potência avante do navio é ajustada para equilibrar a do rebocador. Que movimento pode resultar do arranjo?
- **Justificativa técnica:** A figura 3.6 descreve que, com leme todo a bombordo e máquina avante no rebocador, o conjunto pode mover-se transversalmente quando a potência avante do navio se equilibra com a do rebocador. A distribuição das forças é determinante.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C03-L020-03 — Limite da compressão de gelo
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** B; **referência:** Chapter 3, §3.3.6, p. 90 (PDF p. 103).
- **Enunciado:** Hensen admite pequenos movimentos avante e a ré para deslocar gelo entre casco e cais em qual condição?
- **Justificativa técnica:** A compressão ou movimentação de gelo pelo próprio navio só é considerada para gelo jovem e fraco. Gelo denso demanda limpeza ou assistência adicional.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C03-L020-04 — Varredura de gelo com propulsores opostos
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** C; **referência:** Chapter 3, §3.3.6, p. 92 (PDF p. 105).
- **Enunciado:** Um único rebocador de dois propulsores auxilia navio pequeno a remover gelo solto do berço. Qual técnica é descrita?
- **Justificativa técnica:** Hensen descreve o uso de propulsores em sentidos opostos em um rebocador para varrer gelo em operações de menor porte, respeitadas as condições de segurança.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C03-L020-05 — Propulsor do submarino e leme
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** D; **referência:** Chapter 3, §3.4.1, p. 96 (PDF p. 109).
- **Enunciado:** Um submarino tem propulsor atrás do leme. Qual limitação ocorre ao tentar uma palhetada avante com leme todo carregado e velocidade quase nula?
- **Justificativa técnica:** Hensen explica que, nos submarinos descritos, o propulsor fica a ré do leme; por isso, kick ahead com leme carregado não gera o efeito de giro típico do jato sobre a pá.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C04-L020-01 — Tração estática versus desempenho dinâmico
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** B; **referência:** Chapter 4, §4.1, p. 100 (PDF p. 113).
- **Enunciado:** Dois rebocadores de tipos diferentes têm 30 t de bollard pull. Com o navio parado na água, qual comparação é defensável?
- **Justificativa técnica:** Hensen diferencia a assistência com o navio sem velocidade na água da assistência dinâmica. A igualdade de tração nominal não garante comportamento igual em movimento.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C04-L020-02 — Casaria de alumínio e estabilidade
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** C; **referência:** Chapter 4, §4.2.3, p. 108 (PDF p. 121).
- **Enunciado:** Qual objetivo de estabilidade pode justificar reduzir a altura da casaria e utilizar alumínio em sua construção?
- **Justificativa técnica:** Hensen cita casaria baixa e de alumínio como medidas que podem melhorar a estabilidade ao reduzir massa em posições elevadas. A verificação depende dos cálculos reais.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C04-L020-03 — Ventilação como ponto de alagamento
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** D; **referência:** Chapter 4, §4.2.3, p. 110 (PDF p. 123).
- **Enunciado:** Uma abertura de ventilação de máquinas possui fechamento estanque ao tempo, mas fica aberta para admissão de ar durante o reboque. Como considerá-la na estabilidade?
- **Justificativa técnica:** Hensen observa que aberturas de ventilação precisam ficar abertas operacionalmente; assim, podem determinar o ângulo de alagamento progressivo na condição estudada.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C04-L020-04 — Twin fins e banda em velocidade
- **Alteração:** Localizador refinado para §4.3.4.
- **Gabarito:** E; **referência:** Chapter 4, §4.3.4, p. 122 (PDF p. 135).
- **Enunciado:** Em comparações de ASD com skeg convencional e twin fins acima de 6 nós, qual característica pode favorecer as aletas duplas?
- **Justificativa técnica:** Hensen explica que o skeg tradicional pode rebaixar mais a aplicação da força, aumentando a banda; as twin fins podem reduzir esse efeito conforme a geometria.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C04-L020-05 — Perda média nos ensaios SAFETUG
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** A; **referência:** Chapter 4, §4.5.2, p. 130 (PDF p. 143).
- **Enunciado:** Ensaios SAFETUG em água calma registraram maior perda média de 12% por interação do jato com o casco. Como usar esse resultado?
- **Justificativa técnica:** Hensen apresenta o valor no contexto de ensaios específicos. Geometria, posição e ondas modificam a interação, impedindo extrapolação automática.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C05-L020-01 — Massa efetiva e aceleração lateral
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** D; **referência:** Chapter 5, §5.2.1, p. 136 (PDF p. 149).
- **Enunciado:** Sem forças ambientais, um rebocador aplica força F à massa efetiva m, gerando aceleração a. Se m dobrar e F ficar constante, qual a nova aceleração?
- **Justificativa técnica:** Mantida a força, a aceleração é inversamente proporcional à massa efetiva. Na prática, a massa adicionada e a resistência hidrodinâmica também entram no dimensionamento.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C05-L020-02 — Deriva lenta em águas rasas
- **Alteração:** Localizador corrigido de §5.2.3 para §5.2.2.
- **Gabarito:** E; **referência:** Chapter 5, §5.2.2, p. 138 (PDF p. 151).
- **Enunciado:** Com menor folga sob a quilha, o navio deriva mais devagar sob vento constante. Isso comprova que menos tração basta para interromper a deriva?
- **Justificativa técnica:** Hensen adverte que a menor velocidade de deriva não implica menor bollard pull. O confinamento aumenta a massa de água mobilizada e o esforço para parar e retornar.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C05-L020-03 — Jato Voith e perda no puxão
- **Alteração:** Localizador refinado para §5.2.6.
- **Gabarito:** A; **referência:** Chapter 5, §5.2.6, p. 142 (PDF p. 155).
- **Enunciado:** Dois rebocadores puxam lateralmente por cabo curto: um Voith Schneider e outro azimutal em tubulão. Qual tendência é descrita?
- **Justificativa técnica:** Hensen diferencia o jato menos pronunciado do Voith do fluxo concentrado de hélices em tubulões. Distância, ângulo e forma do casco continuam determinantes.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C05-L020-04 — Bow thruster a dois nós
- **Alteração:** Localizador refinado para §5.3.1.
- **Gabarito:** B; **referência:** Chapter 5, §5.3.1, p. 144 (PDF p. 157).
- **Enunciado:** Um bow thruster fornece força lateral equivalente a 24 t parado. Usando a perda usual indicada por Hensen a 2 nós na água, qual força aproximada resta?
- **Justificativa técnica:** A obra indica redução usual próxima de 50% da efetividade do bow thruster a 2 nós. Metade de 24 t é 12 t, estimativa que não substitui ensaio específico.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C05-L020-05 — Limites de gráficos históricos de tração
- **Alteração:** Localizador refinado para §5.3.3.
- **Gabarito:** C; **referência:** Chapter 5, §5.3.3, p. 146 (PDF p. 159).
- **Enunciado:** Gráficos de bollard pull utilizados em portos foram produzidos cerca de vinte anos antes da edição de Hensen. Como empregá-los no planejamento atual?
- **Justificativa técnica:** Hensen ressalta a idade dos levantamentos e a evolução da potência dos rebocadores. As curvas orientam comparações, mas não substituem dimensionamento atual.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C06-L020-01 — Guinada para fora após sucção na alheta
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** A; **referência:** Chapter 6, §6.2.3, p. 152 (PDF p. 165).
- **Enunciado:** Um rebocador avança paralelo ao costado de navio maior, saindo da região de sucção na alheta. Qual mudança súbita pode ocorrer adiante?
- **Justificativa técnica:** Hensen descreve sucção e momento para dentro na alheta, seguidos de momento para fora quando a proa do rebocador encontra o efeito cushion.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C06-L020-02 — Escape junto à proa com máquina a ré
- **Alteração:** Localizador refinado para §6.3.3.
- **Gabarito:** C; **referência:** Chapter 6, §6.3.3, p. 156 (PDF p. 169).
- **Enunciado:** Um rebocador convencional fica perigosamente colado à proa de navio com seguimento. Por que toda avante e leme carregado podem ser inadequados?
- **Justificativa técnica:** No exemplo de Hensen, a tentativa de escapar com máquina avante levou o rebocador para dentro e sob a proa. A ação discutida como satisfatória é máquina toda a ré.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C06-L020-03 — Mudança de alheta a quatro nós
- **Alteração:** Localizador corrigido para §6.3 (subseção específica ainda exige cotejo visual).
- **Gabarito:** E; **referência:** Chapter 6, §6.3, p. 162 (PDF p. 175).
- **Enunciado:** Um rebocador convencional tenta passar de uma alheta para outra com o navio a 4 nós. Qual risco principal exige reduzir o seguimento?
- **Justificativa técnica:** Hensen alerta para o risco em manobras de rebocadores convencionais a velocidades superiores a aproximadamente 3 nós. A mudança deve ocorrer com velocidade mínima segura.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C06-L020-04 — Limite próprio para conexão bow-to-bow
- **Alteração:** Localizador refinado para §6.3.13.
- **Gabarito:** B; **referência:** Chapter 6, §6.3.13, p. 168 (PDF p. 181).
- **Enunciado:** Um ASD tem limite de conexão bow-to-bow de 3–4 nós, enquanto outro projeto admite cerca de 6 nós em água calma. Qual regra aplicar?
- **Justificativa técnica:** Hensen apresenta velocidades seguras distintas conforme o projeto e a fase, sempre referidas à velocidade na água e às condições ambientais.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C06-L020-05 — Ordem de conexão com dead slow elevado
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** D; **referência:** Chapter 6, §6.4, p. 174 (PDF p. 187).
- **Enunciado:** Um navio perde governo ao parar a máquina, tem dead slow elevado e aproxima-se em mau tempo. Qual conexão pode ser priorizada?
- **Justificativa técnica:** Na síntese de segurança, Hensen recomenda considerar a conexão inicial da popa quando mau tempo e perda de governo ao parar a máquina agravam o risco.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C07-L020-01 — Gob rope remanescente após saída do berço
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** B; **referência:** Chapter 7, §7.2.1, p. 178 (PDF p. 191).
- **Enunciado:** O navio ganha seguimento após ser puxado do cais, mas o gob rope continua conectado com comprimento inadequado. Qual risco surge?
- **Justificativa técnica:** Hensen recomenda desconectar o gob rope quando não necessário. Se ficar curto ou tesado, pode impedir que o rebocador se alinhe ao movimento do navio.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C07-L020-02 — Mecanismos separados no render-recovery
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** D; **referência:** Chapter 7, §7.3.3, p. 184 (PDF p. 197).
- **Enunciado:** Num guincho render-recovery, a tensão ultrapassa o limite ajustado e depois cai. Como se processam alívio e recolhimento?
- **Justificativa técnica:** Hensen distingue o mecanismo de render, como embreagem deslizante, do de recovery, com motor. A resposta rápida reduz picos perigosos.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C07-L020-03 — Tempo e controle da liberação de emergência
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** A; **referência:** Chapter 7, §7.3.3, p. 186 (PDF p. 199).
- **Enunciado:** Um guincho demora cinco segundos para liberar e depois gira livremente. Qual falha existe frente aos critérios citados por Hensen?
- **Justificativa técnica:** A obra cita liberação em até três segundos, com resistência suficiente para evitar giro descontrolado e enrosco do cabo.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C07-L020-04 — Náilon molhado sob carga cíclica
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** E; **referência:** Chapter 7, §7.5.2.2, p. 192 (PDF p. 205).
- **Enunciado:** Qual comportamento do náilon molhado, comparado ao poliéster, é apontado por Hensen?
- **Justificativa técnica:** Hensen registra redução de resistência do náilon molhado e perda mais rápida sob ciclos em comparação ao poliéster. O histórico de uso influencia a segurança.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C07-L020-05 — Triple E e conexão automática
- **Alteração:** Inclusão de questão nova; sem alteração de lotes anteriores.
- **Gabarito:** C; **referência:** Chapter 7, §7.6, p. 206 (PDF p. 219).
- **Enunciado:** Qual variante de conexão automática é descrita para também realizar escolta, reboque de emergência e resposta ambiental?
- **Justificativa técnica:** Hensen distingue Triple A, para assistência portuária e terminal, de Triple E, que inclui escolta e resposta a emergências como incêndio e derramamento.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C09-L020-01 — Ângulo de ataque na escolta indireta
- **Alteração:** Localizador refinado para §9.6.2.
- **Gabarito:** E; **referência:** Chapter 9, §9.6.2, p. 252 (PDF p. 265).
- **Enunciado:** Com cabo próximo de 90° do eixo do navio, qual variável é decisiva para maximizar a força transversal no modo indireto?
- **Justificativa técnica:** Hensen destaca o ângulo de ataque como fator predominante da força de governo no modo indireto, variando com tipo de rebocador e hidrodinâmica.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C09-L020-02 — Reserva de velocidade em escolta
- **Alteração:** Localizador refinado para §9.6.2.
- **Gabarito:** D; **referência:** Chapter 9, §9.6.2, p. 256 (PDF p. 269).
- **Enunciado:** Um rebocador apenas iguala a velocidade máxima do navio escoltado. Qual deficiência pode surgir ao precisar conectar-se em emergência?
- **Justificativa técnica:** Hensen exige overspeed para alcançar posição de conexão, superar o escoamento da hélice e manter margem quando o rebocador precisa manobrar.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C09-L020-03 — Sponsons e estabilidade em escolta
- **Alteração:** Localizador refinado para §9.6.2.
- **Gabarito:** C; **referência:** Chapter 9, §9.6.2, p. 256 (PDF p. 269).
- **Enunciado:** Qual é a finalidade principal de sponsons laterais em rebocador de escolta submetido a grandes bandas?
- **Justificativa técnica:** Hensen aponta os sponsons como forma de ampliar a flutuabilidade de reserva e os braços de endireitamento, sem dispensar análise de forças e trim.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C09-L020-04 — Stretcher em escolta de cabo curto
- **Alteração:** Localizador refinado para §9.6.2.
- **Gabarito:** B; **referência:** Chapter 9, §9.6.2, p. 262 (PDF p. 275).
- **Enunciado:** Um rebocador usa HMPE curto e guincho sem sistema de redução de picos. Qual medida pode melhorar a absorção dinâmica?
- **Justificativa técnica:** Hensen ressalta picos elevados em cabos curtos pouco elásticos sem alívio de carga. Um trecho mais elástico pode amortecer esforços, embora complique o manuseio.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

### ANV-HENSEN-C09-L020-05 — Parâmetro t na notação DNV de escolta
- **Alteração:** Localizador refinado para §9.6.2.
- **Gabarito:** A; **referência:** Chapter 9, §9.6.2, p. 264 (PDF p. 277).
- **Enunciado:** Na notação de escolta (FS, t, v), o que significa t durante ensaio de mudança entre posições indiretas espelhadas?
- **Justificativa técnica:** Hensen define FS como força transversal, v como velocidade de referência e t como tempo da manobra de transferência entre posições indiretas espelhadas.
- **Teste estrutural:** aprovado (A–E, cinco textos distintos, resposta existente, ID e taxonomia coerentes). **Fonte textual:** âncora verificada.
- **Pendências individuais:** revisão conceitual independente e inspeção visual da página.

## Histórico de alterações do lote
- Inclusão inicial do JSON: `67b1063d8d04c1034cc8f72fa0c9e81f2f7c2200`.
- Revisão conceitual de C03-L020-02: `d4756a2d6a83773b268f45724670342b5ca7720b`.
- Correção de equilíbrio A–E após a revisão: `465a22da7ad24b574d566dcf1935b0335c84c158`.
- Refinamento de 13 localizadores: `a1c40592cd47ffa954f6d4bcaa7eb84dfbc35932`.
- Preservados os lotes 001–019, os 170 históricos e os 119 registros históricos em quarentena. Nenhum validador ou workflow foi desativado.
- Não fazer merge nem deploy antes da aprovação de todos os gates e da homologação editorial.
