# HENSEN — Lote 020 — auditoria editorial por ID
Data: 2026-10-30. Branch `audit/hensen-lote-001-20261029`, PR #173.
Fonte primária: Henk Hensen, *Tug Use in Port*, 4ª ed. (2021), Google Drive `1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9`.
**Estado:** `pending_editorial_review`; não homologado.

## Inventário e auditoria final em memória
- Confirmados previamente 19 lotes (760 questões). O Lote 020 acrescenta 40, perfazendo 20 lotes e 800 questões novas.
- Cinco questões por capítulo 1–7 e 9; gabaritos A=8 B=8 C=8 D=8 E=8; 40 IDs exclusivos e cinco alternativas A–E distintas por item.
- Fonte primária: 40/40 âncoras textuais localizadas na região da página impressa declarada do PDF do Google Drive. Páginas PDF indicadas como impressa +13; **conferência visual integral pendente**.
- Comparação literal com 760 enunciados anteriores: zero colisões de ID/enunciado. Jaccard lexical máximo 0,300; zero pares ≥0,34 após reescritas.
- Comparação com 170 HENSEN históricos em dez blocos: zero colisões literais; Jaccard máximo 0,176.
- Auditoria conceitual por confronto de temas e leitura dirigida identificou e corrigiu 10 itens de sobreposição ou proximidade temática, sem alterar lotes anteriores. A revisão independente integral continua pendente.
- O banco principal `data/questions/arte-naval.json` não foi lido integralmente pelo conector (6,8 MB; retorno truncado); originalidade em relação a esse banco permanece pendente.
- `npm` local não executado por impossibilidade de clonar o repositório (DNS indisponível no ambiente). Gates remotos dependem do HEAD final.

## Alterações e justificativas por ID
### ANV-HENSEN-C01-L020-01 — Fases com geometria portuária diferente
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Um navio transita por eclusa e depois atraca em terminal com ampla bacia. Qual critério deve orientar a escolha do método de assistência?
- **Gabarito:** A; **referência:** Chapter 1, §1.2.1, p. 4 (PDF p. 17).
- **Justificativa técnica:** Hensen distingue portos convencionais, com eclusas e pontes, de terminais com manobras mais padronizadas. A geometria e a fase da operação condicionam método e aptidão dos rebocadores.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C01-L020-02 — Guincho em terminal exposto
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Um rebocador tem bollard pull suficiente para píer offshore sujeito a ondas, mas seu guincho não controla picos de tensão. Qual conclusão é adequada?
- **Gabarito:** B; **referência:** Chapter 1, §1.2.1, p. 4 (PDF p. 17).
- **Justificativa técnica:** Para instalações expostas, Hensen exige considerar estabilidade, defensas robustas, guinchos render-recovery e potência. A tração estática não representa todas as cargas dinâmicas.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C01-L020-03 — Frota mista e interfaces de casco
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Um terminal antes exclusivo para petroleiros passará a receber também ro-ro e porta-contêineres de grande borda-livre. O que deve ser reavaliado?
- **Gabarito:** C; **referência:** Chapter 1, §1.2.3, p. 6 (PDF p. 19).
- **Justificativa técnica:** Hensen vincula o tipo de navio a requisitos distintos de potência, equipamentos, defensas, manobrabilidade e superestrutura. A nova composição de tráfego altera as interfaces operacionais.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C01-L020-04 — Escolta acrescentada ao serviço portuário
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** O berço permanece inalterado, mas o porto introduz escolta no canal de acesso. Qual requisito deve entrar no estudo da frota?
- **Gabarito:** D; **referência:** Chapter 1, §1.2.5, p. 6 (PDF p. 19).
- **Justificativa técnica:** A necessidade de escolta figura entre os fatores que definem o método de assistência. Forças e segurança durante o trânsito diferem das condições estáticas de atracação.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C01-L020-05 — Mesmo bollard pull em envelopes diferentes
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Dois rebocadores fornecem 65 t de bollard pull, mas um trabalha junto ao berço e outro em curva de canal a 5 nós com pequena folga sob a quilha. São intercambiáveis por esse único dado?
- **Gabarito:** E; **referência:** Chapter 1, §1.5, p. 8 (PDF p. 21).
- **Justificativa técnica:** Hensen ressalta que importa como, quando e em quais circunstâncias a força atua. Igual bollard pull não implica desempenho dinâmico ou segurança equivalentes.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C02-L020-01 — Durabilidade ambiental de defensas
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Além das curvas de absorção de energia, o que deve constar da especificação de defensas expostas a água poluída e sol intenso?
- **Gabarito:** C; **referência:** Chapter 2, §2.2.4, p. 14 (PDF p. 27).
- **Justificativa técnica:** Hensen inclui resistência a água contaminada, ozônio, radiação ultravioleta e temperaturas extremas entre os critérios de escolha do elastômero.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C02-L020-02 — Área de giro do guincho radial
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** A tripulação precisa entrar na área de um guincho radial para desconectar o cabo. Qual sequência é segura?
- **Gabarito:** D; **referência:** Chapter 2, §2.16, p. 50 (PDF p. 63).
- **Justificativa técnica:** No conceito All-Rounder, o freio de estacionamento imobiliza o guincho durante o acesso ao convés e o giro só é liberado depois que a área estiver desocupada.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C02-L020-03 — Guias elevadas no Giano
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** O Giano utiliza guinchos e guias de cabo elevados. Qual solicitação continua relevante apesar da grande estabilidade inicial?
- **Gabarito:** E; **referência:** Chapter 2, §2.21.1, p. 62 (PDF p. 75).
- **Justificativa técnica:** Hensen observa que fairleads altos podem aumentar o braço vertical da tensão do cabo. Estabilidade elevada não elimina a necessidade de avaliar momentos dinâmicos.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C02-L020-04 — PTO Shore Connection
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** No modo PTO Shore Connection de rebocador híbrido, conectado à energia do cais, qual condição dos motores de combustão é descrita?
- **Gabarito:** A; **referência:** Chapter 2, §2.23, p. 70 (PDF p. 83).
- **Justificativa técnica:** Hensen diferencia PTO Shore Connection, com motores desligados, do PTI Booster, em que máquina elétrica e motor diesel podem atuar juntos.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C02-L020-05 — Energia no modo TRNST 2
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** No modo TRNST 2 do Rotortug híbrido, um motor diesel aciona diretamente um propulsor. Como os outros dois recebem energia?
- **Gabarito:** B; **referência:** Chapter 2, §2.23, p. 70 (PDF p. 83).
- **Justificativa técnica:** O exemplo TRNST 2 combina diesel-direct em um propulsor com geração no eixo para alimentar os motores elétricos dos outros dois.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C03-L020-01 — Preparação interinstitucional para escala naval incomum
- **Alteração:** Reescrita: substituída alternância de método em ponte por coordenação prévia de escala naval incomum.
- **Enunciado:** Um grande navio militar fará escala rara em porto comercial cujos rebocadores não são projetados especificamente para esse tipo de casco. Qual preparação é destacada por Hensen antes da chegada?
- **Gabarito:** E; **referência:** Chapter 3, §3.4, p. 94 (PDF p. 107).
- **Justificativa técnica:** Hensen observa que escalas navais pouco frequentes em portos comerciais exigem preparação coordenada de berço, procedimentos e tarefas. Representantes da Marinha, autoridade portuária, empresa de rebocagem e práticos devem alinhar as instruções aos mestres.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C03-L020-02 — Translação lateral no alongside towing com potências equilibradas
- **Alteração:** Reescrita: substituída função genérica do rebocador de popa por translação lateral em alongside towing; gabarito A mantido.
- **Enunciado:** Na manobra de alongside towing ilustrada por Hensen, o rebocador aplica leme todo a bombordo e máquina avante, enquanto a potência avante do navio é ajustada para equilibrar a do rebocador. Que movimento pode resultar do arranjo?
- **Gabarito:** A; **referência:** Chapter 3, §3.2.1, p. 84 (PDF p. 97).
- **Justificativa técnica:** A figura 3.6 descreve que, com leme todo a bombordo e máquina avante no rebocador, o conjunto pode mover-se transversalmente quando a potência avante do navio se equilibra com a do rebocador. A distribuição das forças é determinante.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C03-L020-03 — Exceção comprovada para hélices de bronze em gelo
- **Alteração:** Reescrita: substituída compressão de gelo (equivalente a L018) por exceção experimental de hélice de bronze 1A Super.
- **Enunciado:** Uma equipe afirma que toda hélice de bronze é necessariamente inapta à classe de gelo 1A Super. Que ressalva técnica Hensen apresenta?
- **Gabarito:** B; **referência:** Chapter 3, §3.3.2, p. 88 (PDF p. 101).
- **Justificativa técnica:** Hensen registra testes na Baía de Bótnia em março de 2016 nos quais hélices de bronze recém-desenvolvidas mostraram aptidão potencial para condições 1A Super. Não se deve generalizar o risco de projetos antigos a todos os projetos.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C03-L020-04 — Varredura de gelo com propulsores opostos
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Um único rebocador de dois propulsores auxilia navio pequeno a remover gelo solto do berço. Qual técnica é descrita?
- **Gabarito:** C; **referência:** Chapter 3, §3.3.6, p. 92 (PDF p. 105).
- **Justificativa técnica:** Hensen descreve o uso de propulsores em sentidos opostos em um rebocador para varrer gelo em operações de menor porte, respeitadas as condições de segurança.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C03-L020-05 — Amplitude de maré no berço de submarinos
- **Alteração:** Reescrita: substituído propulsor de submarino (equivalente a L006) por amplitude de maré no berço.
- **Enunciado:** Um submarino será atracado em cais comercial com grande amplitude de maré. Além do grande volume submerso e do calado, qual parâmetro deve entrar na compatibilização de defensas e afastamentos?
- **Gabarito:** D; **referência:** Chapter 3, §3.4.1, p. 98 (PDF p. 111).
- **Justificativa técnica:** Hensen observa que a atracação comercial de submarinos exige compatibilidade com o casco largo abaixo da linha d'água e acrescenta expressamente a amplitude de maré nos portos sujeitos a variação de nível.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C04-L020-01 — Tração estática versus desempenho dinâmico
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Dois rebocadores de tipos diferentes têm 30 t de bollard pull. Com o navio parado na água, qual comparação é defensável?
- **Gabarito:** B; **referência:** Chapter 4, §4.1, p. 100 (PDF p. 113).
- **Justificativa técnica:** Hensen diferencia a assistência com o navio sem velocidade na água da assistência dinâmica. A igualdade de tração nominal não garante comportamento igual em movimento.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C04-L020-02 — Casaria de alumínio e estabilidade
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Qual objetivo de estabilidade pode justificar reduzir a altura da casaria e utilizar alumínio em sua construção?
- **Gabarito:** C; **referência:** Chapter 4, §4.2.3, p. 108 (PDF p. 121).
- **Justificativa técnica:** Hensen cita casaria baixa e de alumínio como medidas que podem melhorar a estabilidade ao reduzir massa em posições elevadas. A verificação depende dos cálculos reais.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C04-L020-03 — Ventilação como ponto de alagamento
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Uma abertura de ventilação de máquinas possui fechamento estanque ao tempo, mas fica aberta para admissão de ar durante o reboque. Como considerá-la na estabilidade?
- **Gabarito:** D; **referência:** Chapter 4, §4.2.3, p. 110 (PDF p. 123).
- **Justificativa técnica:** Hensen observa que aberturas de ventilação precisam ficar abertas operacionalmente; assim, podem determinar o ângulo de alagamento progressivo na condição estudada.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C04-L020-04 — Twin fins e banda em velocidade
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Em comparações de ASD com skeg convencional e twin fins acima de 6 nós, qual característica pode favorecer as aletas duplas?
- **Gabarito:** E; **referência:** Chapter 4, §4.3.4, p. 122 (PDF p. 135).
- **Justificativa técnica:** Hensen explica que o skeg tradicional pode rebaixar mais a aplicação da força, aumentando a banda; as twin fins podem reduzir esse efeito conforme a geometria.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C04-L020-05 — Perda média nos ensaios SAFETUG
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Ensaios SAFETUG em água calma registraram maior perda média de 12% por interação do jato com o casco. Como usar esse resultado?
- **Gabarito:** A; **referência:** Chapter 4, §4.5.2, p. 130 (PDF p. 143).
- **Justificativa técnica:** Hensen apresenta o valor no contexto de ensaios específicos. Geometria, posição e ondas modificam a interação, impedindo extrapolação automática.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C05-L020-01 — Massa efetiva e aceleração lateral
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Sem forças ambientais, um rebocador aplica força F à massa efetiva m, gerando aceleração a. Se m dobrar e F ficar constante, qual a nova aceleração?
- **Gabarito:** D; **referência:** Chapter 5, §5.2.1, p. 136 (PDF p. 149).
- **Justificativa técnica:** Mantida a força, a aceleração é inversamente proporcional à massa efetiva. Na prática, a massa adicionada e a resistência hidrodinâmica também entram no dimensionamento.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C05-L020-02 — Deriva lenta em águas rasas
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Com menor folga sob a quilha, o navio deriva mais devagar sob vento constante. Isso comprova que menos tração basta para interromper a deriva?
- **Gabarito:** E; **referência:** Chapter 5, §5.2.2, p. 138 (PDF p. 151).
- **Justificativa técnica:** Hensen adverte que a menor velocidade de deriva não implica menor bollard pull. O confinamento aumenta a massa de água mobilizada e o esforço para parar e retornar.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C05-L020-03 — Jato Voith e perda no puxão
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Dois rebocadores puxam lateralmente por cabo curto: um Voith Schneider e outro azimutal em tubulão. Qual tendência é descrita?
- **Gabarito:** A; **referência:** Chapter 5, §5.2.6, p. 142 (PDF p. 155).
- **Justificativa técnica:** Hensen diferencia o jato menos pronunciado do Voith do fluxo concentrado de hélices em tubulões. Distância, ângulo e forma do casco continuam determinantes.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C05-L020-04 — Bow thruster em águas de pouca folga sob a quilha
- **Alteração:** Reescrita: substituída perda de 50% do bow thruster a 2 nós (equivalente a L001) por influência de pouca folga sob a quilha. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Um navio normalmente atraca sem rebocador graças ao propulsor lateral de proa. Mantidos vento e velocidade, o berço passa a operar com folga sob a quilha muito menor. Qual reavaliação é necessária?
- **Gabarito:** B; **referência:** Chapter 5, §5.3.1, p. 144 (PDF p. 157).
- **Justificativa técnica:** Hensen ressalta que o bow thruster pode ser insuficiente em águas rasas mesmo quando o navio normalmente opera sem rebocadores, pois os esforços necessários para girar, transladar ou parar lateralmente aumentam.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C05-L020-05 — Trade-off de quatro rebocadores de 30 t por dois de 60 t
- **Alteração:** Reescrita: substituídos gráficos históricos (equivalentes a L011/L014) por trade-off 4×30 t versus 2×60 t. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Um porto propõe trocar quatro rebocadores de 30 t por dois de 60 t, mantendo a soma de bollard pull. Qual avaliação vai além da equivalência numérica?
- **Gabarito:** C; **referência:** Chapter 5, §5.3.8, p. 148 (PDF p. 161).
- **Justificativa técnica:** Hensen exemplifica a troca de quatro rebocadores de 30 t por dois de 60 t e alerta que a falha de uma unidade elimina metade da assistência, além de aumentar exigências de manuseio e resistência de cabos e ferragens.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C06-L020-01 — Guinada para fora após sucção na alheta
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Um rebocador avança paralelo ao costado de navio maior, saindo da região de sucção na alheta. Qual mudança súbita pode ocorrer adiante?
- **Gabarito:** A; **referência:** Chapter 6, §6.2.3, p. 152 (PDF p. 165).
- **Justificativa técnica:** Hensen descreve sucção e momento para dentro na alheta, seguidos de momento para fora quando a proa do rebocador encontra o efeito cushion.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C06-L020-02 — Esteira versus jato propulsivo na frenagem
- **Alteração:** Reescrita: substituída saída a ré sob a proa (equivalente a L019) por efeito distinto de esteira e jato na frenagem. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Um rebocador freia um navio a partir da esteira de popa, com hélice do navio parada. Por que não se deve assumir o mesmo desempenho de frenagem que em água livre?
- **Gabarito:** C; **referência:** Chapter 6, §6.2.3, p. 154 (PDF p. 167).
- **Justificativa técnica:** Hensen distingue a esteira de popa, que pode reduzir resistência e desempenho de frenagem, do slipstream da hélice, cujo efeito é oposto. O resultado depende da condição de máquina e do escoamento local.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C06-L020-03 — Cabo pesado arrastado durante dispensa com seguimento crescente
- **Alteração:** Reescrita: substituída mudança de alheta (equivalente a L003) por cabo pesado arrastado na dispensa. Localizador bibliográfico refinado por subseção.
- **Enunciado:** A guarnição do navio não consegue liberar um cabo de aço pesado, e o rebocador o folga para que seja solto. O navio continua acelerando. Qual mecanismo pode tornar a liberação ainda mais difícil?
- **Gabarito:** E; **referência:** Chapter 6, §6.3.14, p. 172 (PDF p. 185).
- **Justificativa técnica:** Hensen alerta que o cabo de aço arrastado na água ganha resistência e tensão quando o navio acelera, podendo impedir a soltura e até sobrecarregar os dispositivos de retenção. A velocidade deve ser controlada.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C06-L020-04 — Limite próprio para conexão bow-to-bow
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Um ASD tem limite de conexão bow-to-bow de 3–4 nós, enquanto outro projeto admite cerca de 6 nós em água calma. Qual regra aplicar?
- **Gabarito:** B; **referência:** Chapter 6, §6.3.13, p. 168 (PDF p. 181).
- **Justificativa técnica:** Hensen apresenta velocidades seguras distintas conforme o projeto e a fase, sempre referidas à velocidade na água e às condições ambientais.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C06-L020-05 — Responsabilidade compartilhada pelo risco junto à proa
- **Alteração:** Reescrita: substituída ordem de conexão com dead slow alto (equivalente a L018) por responsabilidade compartilhada na aproximação à proa.
- **Enunciado:** Após quase acidente de um rebocador junto à proa de navio com seguimento, a análise atribui toda a prevenção exclusivamente ao mestre do rebocador. Qual fator adicional é enfatizado por Hensen?
- **Gabarito:** D; **referência:** Chapter 6, §6.3.3, p. 158 (PDF p. 171).
- **Justificativa técnica:** Hensen esclarece que a segurança junto à proa não depende apenas da perícia do mestre do rebocador: o controle do seguimento pelo navio e a prontidão de retinidas adequadas evitam aproximações excessivas.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C07-L020-01 — Gob rope remanescente após saída do berço
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** O navio ganha seguimento após ser puxado do cais, mas o gob rope continua conectado com comprimento inadequado. Qual risco surge?
- **Gabarito:** B; **referência:** Chapter 7, §7.2.1, p. 178 (PDF p. 191).
- **Justificativa técnica:** Hensen recomenda desconectar o gob rope quando não necessário. Se ficar curto ou tesado, pode impedir que o rebocador se alinhe ao movimento do navio.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C07-L020-02 — Mecanismos separados no render-recovery
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Num guincho render-recovery, a tensão ultrapassa o limite ajustado e depois cai. Como se processam alívio e recolhimento?
- **Gabarito:** D; **referência:** Chapter 7, §7.3.3, p. 184 (PDF p. 197).
- **Justificativa técnica:** Hensen distingue o mecanismo de render, como embreagem deslizante, do de recovery, com motor. A resposta rápida reduz picos perigosos.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C07-L020-03 — Tempo e controle da liberação de emergência
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Um guincho demora cinco segundos para liberar e depois gira livremente. Qual falha existe frente aos critérios citados por Hensen?
- **Gabarito:** A; **referência:** Chapter 7, §7.3.3, p. 186 (PDF p. 199).
- **Justificativa técnica:** A obra cita liberação em até três segundos, com resistência suficiente para evitar giro descontrolado e enrosco do cabo.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C07-L020-04 — Náilon molhado sob carga cíclica
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Qual comportamento do náilon molhado, comparado ao poliéster, é apontado por Hensen?
- **Gabarito:** E; **referência:** Chapter 7, §7.5.2.2, p. 192 (PDF p. 205).
- **Justificativa técnica:** Hensen registra redução de resistência do náilon molhado e perda mais rápida sob ciclos em comparação ao poliéster. O histórico de uso influencia a segurança.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C07-L020-05 — Triple E e conexão automática
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado.
- **Enunciado:** Qual variante de conexão automática é descrita para também realizar escolta, reboque de emergência e resposta ambiental?
- **Gabarito:** C; **referência:** Chapter 7, §7.6, p. 206 (PDF p. 219).
- **Justificativa técnica:** Hensen distingue Triple A, para assistência portuária e terminal, de Triple E, que inclui escolta e resposta a emergências como incêndio e derramamento.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C09-L020-01 — Ângulo de ataque na escolta indireta
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Com cabo próximo de 90° do eixo do navio, qual variável é decisiva para maximizar a força transversal no modo indireto?
- **Gabarito:** E; **referência:** Chapter 9, §9.6.2, p. 252 (PDF p. 265).
- **Justificativa técnica:** Hensen destaca o ângulo de ataque como fator predominante da força de governo no modo indireto, variando com tipo de rebocador e hidrodinâmica.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C09-L020-02 — Reserva de velocidade em escolta
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Um rebocador apenas iguala a velocidade máxima do navio escoltado. Qual deficiência pode surgir ao precisar conectar-se em emergência?
- **Gabarito:** D; **referência:** Chapter 9, §9.6.2, p. 256 (PDF p. 269).
- **Justificativa técnica:** Hensen exige overspeed para alcançar posição de conexão, superar o escoamento da hélice e manter margem quando o rebocador precisa manobrar.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C09-L020-03 — Sponsons e estabilidade em escolta
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Qual é a finalidade principal de sponsons laterais em rebocador de escolta submetido a grandes bandas?
- **Gabarito:** C; **referência:** Chapter 9, §9.6.2, p. 256 (PDF p. 269).
- **Justificativa técnica:** Hensen aponta os sponsons como forma de ampliar a flutuabilidade de reserva e os braços de endireitamento, sem dispensar análise de forças e trim.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C09-L020-04 — Stretcher em escolta de cabo curto
- **Alteração:** Inclusão de item novo; nenhum registro anterior alterado. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Um rebocador usa HMPE curto e guincho sem sistema de redução de picos. Qual medida pode melhorar a absorção dinâmica?
- **Gabarito:** B; **referência:** Chapter 9, §9.6.2, p. 262 (PDF p. 275).
- **Justificativa técnica:** Hensen ressalta picos elevados em cabos curtos pouco elásticos sem alívio de carga. Um trecho mais elástico pode amortecer esforços, embora complique o manuseio.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

### ANV-HENSEN-C09-L020-05 — Linhas distintas para escolta e atracação
- **Alteração:** Reescrita: substituído parâmetro t da notação DNV (equivalente a L018) por linhas distintas para escolta e atracação. Localizador bibliográfico refinado por subseção.
- **Enunciado:** Um rebocador executa escolta indireta e também operações usuais de atracação. Qual arranjo de cabos é descrito como possível para atender a exigências diferentes?
- **Gabarito:** A; **referência:** Chapter 9, §9.6.2, p. 264 (PDF p. 277).
- **Justificativa técnica:** Hensen registra que rebocadores empregados tanto em escolta quanto em atracação podem manter uma linha específica de escolta e outra para berthing, adequando material e características à operação.
- **Teste:** cinco opções distintas, gabarito válido, taxonomia coerente, âncora textual localizada.
- **Pendências:** cotejo visual da página, originalidade semântica independente, revisão editorial dos distratores e gates no HEAD final.

## Commits e rastreabilidade
- `67b1063d8d04c1034cc8f72fa0c9e81f2f7c2200`: inclusão inicial do JSON.
- `d4756a2d6a83773b268f45724670342b5ca7720b`: primeira reescrita de C03-L020-02.
- `465a22da7ad24b574d566dcf1935b0335c84c158`: correção de gabarito para preservar equilíbrio A–E.
- `a1c40592cd47ffa954f6d4bcaa7eb84dfbc35932`: 13 ajustes de localizadores.
- `5dfd8d420faa3b0c719c8d871c36d1f4ad8cb3bd`: oito reescritas conceituais adicionais.
- `20557d919cbf66a8c05e781db6796e48ec4b7190`: reescrita adicional de C03-L020-01.
- Nenhuma alteração em lotes 001–019, históricos (119 em quarentena e 51 ativos), validadores ou workflows.
- Não realizar merge ou deploy sem aprovação de todos os gates e homologação editorial.

## Revisão independente de duplicidade — C07-L020-01 (checkpoint 021)

**Evidência de equivalência semântica:** `ANV-HENSEN-C07-L020-01` reproduzia a competência de `ANV-B010-16` (histórico ainda `active=false`, `validation_status=quarantined`): gob rope esquecida/curta após saída do berço impede a guinada do rebocador e provoca girting. A equivalência foi confirmada comparando enunciados, respostas e explicações, não apenas similaridade lexical.

**Fonte primária diretamente conferida:** Hensen, *Tug Use in Port*, 4ª edição, capítulo 7, §7.2.1, p. impressa 178 / PDF p. 191. O texto distingue dois riscos: (i) gob rope remanescente de comprimento impróprio, capaz de impedir a guinada e causar girting; (ii) manilha de diâmetro insuficiente para o cabo de aço ou fibra, capaz de induzir fadiga e ruptura do cabo. O segundo conceito fundamenta a substituição.

| Campo | Antes | Depois |
|---|---|---|
| ID | `ANV-HENSEN-C07-L020-01` | **mesmo ID** |
| Tópico | Gob rope remanescente após saída do berço | Manilha do gob rope — fadiga do cabo principal |
| Enunciado | O navio ganha seguimento após ser puxado do cais, mas o gob rope continua conectado com comprimento inadequado. Qual risco surge? | Em um sistema gob rope de rebocador convencional, a manilha deslizante tem diâmetro insuficiente para o cabo principal de aço ou fibra que passa por ela. Mesmo sem falha imediata, qual risco de integridade Hensen destaca? |
| A | A linha aumenta automaticamente a estabilidade. | Aumento progressivo da resistência à ruptura por compactação das pernas do cabo. |
| B (correta) | A linha pode ficar tesada, impedir a guinada do rebocador e provocar girting. | Fadiga localizada do cabo principal, com possibilidade de ruptura após solicitações repetidas. |
| C | Ela afeta só a velocidade do guincho. | Deslocamento automático do ponto de reboque para a proa, sem desgaste do cabo. |
| D | A conexão elimina forças transversais no cabo. | Eliminação dos esforços de flexão do cabo devido à pequena abertura da manilha. |
| E | O risco existe apenas com o navio parado. | Redução permanente da carga no cabo principal, independentemente da tração aplicada. |
| Explicação | Hensen recomenda desconectar o gob rope quando não necessário. Se ficar curto ou tesado, pode impedir que o rebocador se alinhe ao movimento do navio. | Hensen alerta que a manilha do gob rope com diâmetro insuficiente para o cabo principal, de aço ou fibra, pode provocar fadiga e, por fim, ruptura do cabo. É uma falha de compatibilidade geométrica e integridade do conjunto, distinta do requisito de passagem livre do cabo em uma liberação de emergência. Fonte: capítulo 7, §7.2.1, p. 178 (PDF p. 191). |

**Preservados:** gabarito B, classificação `arte-naval/hensen-tug`, capítulo 7, referência, `active=true` e `validation_status=pending_editorial_review`. O histórico `ANV-B010-16` permanece em quarentena, sem reativação. O lote mantém 40 IDs únicos, cinco alternativas por questão e distribuição A=B=C=D=E=8. A verificação não homologa automaticamente o restante do lote nem a revisão semântica integral.

Commits de correção: [conteúdo](https://github.com/noconvescomdavi/simulado-pscpp/commit/03c8db108b6e6f19568d64a3703f633280e847e5) e [tópico](https://github.com/noconvescomdavi/simulado-pscpp/commit/b7968eea2383174e3d25a0db931f86a239b9a910).
