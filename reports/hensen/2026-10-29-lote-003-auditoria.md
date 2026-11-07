# PSCPP — HENSEN — Lote 003: relatório individual de elaboração e auditoria

**Data:** 2026-10-29. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`. **Fonte primária:** Henk Hensen, *Tug Use in Port: A Practical Guide*, 4ª edição revisada, STC Publishing, 2021; https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view.  
**Arquivo de dados:** `data/question-extensions/hensen-lote-003.json`. **Integração:** `lib/question-banks-source.js`.

## Inventário e controles

- 40 questões **novas** em 8 capítulos (1–7 e 9), cinco por capítulo; 40 IDs e enunciados únicos.
- Gabaritos: A=8; B=8; C=8; D=8; E=8. Cinco alternativas diferentes e justificativa técnica por item.
- 40 localizadores conferidos com a edição 2021: capítulo, seção, página impressa e correspondência PDF (+13). As seções indicadas foram localizadas no texto integral da obra.
- Cotejo estrutural com `hensen-lote-001.json` e `hensen-lote-002.json`: nenhuma colisão de ID ou enunciado; maior similaridade lexical de enunciado (Jaccard de termos filtrados) = 0,20. Cotejo temático com os 170 registros históricos: as questões novas apresentam situações e discriminações operacionais específicas, mas uma revisão semântica independente permanece pendente.
- **Ressalvas temáticas:** a questão C05-L003-01 aplica numericamente a fórmula do vento, enquanto C05-L001-03 testa a proporcionalidade quadrática; C09-L003-04 examina a geometria do cabo em escolta indireta, enquanto C09-L001-03 diferencia modos de reboque. São objetivos cognitivos distintos, porém devem ser observados na homologação editorial.
- A validação `approved` registra o cotejo de autoria com a fonte, não substitui revisão independente nem os testes completos da aplicação.
- Os lotes 001 e 002 e os 119 registros antigos em quarentena não foram modificados. Não houve remoção/desativação de gates.

## Registro por questão — inclusão, gabarito e justificativa

Cada item abaixo é uma **criação**, não uma correção de questão preexistente. O texto integral de alternativas e metadados permanece no JSON.

### ANV-HENSEN-C01-L003-01 — Participação dos operadores no projeto portuário

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Na fase de projeto de uma nova bacia portuária, os engenheiros definem o espaço de evolução sem consultar quem executará as manobras. Qual providência atende à recomendação de Hensen?
- **Gabarito:** **A — Incluir desde o início práticos e empresas de rebocadores nos estudos, considerando a manobra real e a futura frota.**
- **Justificativa:** O envolvimento antecipado de práticos e operadores de rebocadores permite compatibilizar acessibilidade, evolução dos navios e aquisição de unidades apropriadas.
- **Fonte:** Hensen (2021), Chapter 1, §1.2.1, p. 5 (PDF p. 18).

### ANV-HENSEN-C01-L003-02 — Rebocadores distintos ao longo do acesso

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um porto fluvial apresenta corrente forte no acesso, eclusa estreita e berços com profundidade limitada. Que solução operacional é compatível com a análise das condições ambientais feita por Hensen?
- **Gabarito:** **B — Empregar tipos de rebocador diferentes em trechos distintos, se suas capacidades atenderem melhor às restrições locais.**
- **Justificativa:** A obra descreve portos nos quais a variação de corrente, profundidade, pontes e eclusas leva ao emprego de tipos distintos de rebocador em partes da rota.
- **Fonte:** Hensen (2021), Chapter 1, §1.2.2, p. 5 (PDF p. 18).

### ANV-HENSEN-C01-L003-03 — Reserva para falha da propulsão do navio

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um navio entra em canal estreito sob vento lateral, com possibilidade de pane de máquina. Qual capacidade deve ser contemplada no planejamento dos rebocadores de assistência?
- **Gabarito:** **C — Conseguir, dentro de seus limites operacionais, reduzir o seguimento e auxiliar no controle do aproamento após a perda de propulsão.**
- **Justificativa:** Hensen destaca que falhas de propulsão ocorrem durante chegadas e que o conjunto de rebocadores deve poder auxiliar na frenagem e no controle direcional.
- **Fonte:** Hensen (2021), Chapter 1, §1.2.5, p. 6 (PDF p. 19).

### ANV-HENSEN-C01-L003-04 — Tubulão e tração em rebocadores convencionais

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Ao comparar rebocadores convencionais com hélices de passo fixo, o armador avalia instalar tubulões em torno dos propulsores. Qual finalidade operacional é indicada por Hensen?
- **Gabarito:** **D — Aumentar a força de tração disponível em determinadas condições de trabalho.**
- **Justificativa:** O capítulo descreve o uso de tubulões em rebocadores de um ou dois eixos para elevar a capacidade de reboque, sem alterar por si só a direção do eixo propulsivo.
- **Fonte:** Hensen (2021), Chapter 1, §1.3, p. 7 (PDF p. 20).

### ANV-HENSEN-C01-L003-05 — Conflito entre pátio de contêineres e área de manobra

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um terminal de contêineres pretende ampliar o pátio avançando sobre a área aquática de giro. Qual consequência deve ser estudada antes da aprovação?
- **Gabarito:** **E — A redução do espaço disponível para o conjunto navio–rebocadores, que pode exigir outro arranjo de assistência.**
- **Justificativa:** A disputa por área terrestre em terminais de contêineres pode comprometer a área mínima de manobra e impor requisitos adicionais aos rebocadores e ao método empregado.
- **Fonte:** Hensen (2021), Chapter 1, §1.2.1, p. 5 (PDF p. 18).

### ANV-HENSEN-C02-L003-01 — Recuo da superestrutura em operações sob o flare

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador deverá trabalhar próximo ao flare de proa de grandes porta-contêineres. Qual alteração de arranjo reduz o risco de choque entre as estruturas?
- **Gabarito:** **C — Posicionar a superestrutura suficientemente afastada da borda do convés e verificar a geometria submersa do rebocador.**
- **Justificativa:** Hensen recomenda superestrutura recuada e geometria submersa compatível com o casco assistido, sobretudo em regiões com flare e balanço relativo.
- **Fonte:** Hensen (2021), Chapter 2, §2.2.3, p. 13 (PDF p. 26).

### ANV-HENSEN-C02-L003-02 — Proa aberta e convés seco no conceito japonês

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador de concepção japonesa precisa navegar rapidamente até um navio, com ondas pela proa. Qual é uma função da proa fina e aberta em flare descrita por Hensen?
- **Gabarito:** **D — Reduzir resistência de formação de ondas e favorecer um convés de trabalho mais seco.**
- **Justificativa:** A configuração da proa busca reduzir a resistência associada às ondas e desviar água do convés, favorecendo o deslocamento em velocidade.
- **Fonte:** Hensen (2021), Chapter 2, §2.8.1, p. 35 (PDF p. 48).

### ANV-HENSEN-C02-L003-03 — Convés de trabalho do Z-tech sob grandes balanços de proa

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um terminal recebe navios com grande balanço de proa e exige que o rebocador opere próximo ao casco. Qual arranjo é característico do Z-tech apresentado por Hensen?
- **Gabarito:** **E — Passadiço recuado em direção aos propulsores, com amplo convés livre e proa de trabalho fortemente defendida.**
- **Justificativa:** No Z-tech, o posicionamento do passadiço e dos equipamentos deixa uma área de trabalho livre, adequada à operação sob flares pronunciados.
- **Fonte:** Hensen (2021), Chapter 2, §2.12.1, p. 45 (PDF p. 58).

### ANV-HENSEN-C02-L003-04 — Arranjo propulsivo longitudinal do EDDY

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Na análise de um rebocador EDDY, o inspetor observa dois propulsores dispostos no eixo longitudinal, um em cada extremidade. Onde fica o ponto de reboque no conceito básico?
- **Gabarito:** **A — Entre os dois propulsores, permitindo esforços de assistência em diferentes direções.**
- **Justificativa:** O conceito EDDY combina propulsores alinhados nas extremidades e ponto de reboque intermediário, distinguindo-se dos arranjos ASD usuais.
- **Fonte:** Hensen (2021), Chapter 2, §2.19.1, p. 56 (PDF p. 69).

### ANV-HENSEN-C02-L003-05 — Eficiência parcial da propulsão mecânica

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador passa grande parte da jornada em trânsito lento, utilizando fração pequena da potência instalada. Por que Hensen considera soluções híbridas nesse perfil de operação?
- **Gabarito:** **B — Porque motores e transmissão mecânica dimensionados para potência máxima podem apresentar consumo específico desfavorável em carga parcial.**
- **Justificativa:** O capítulo explica que o rebocador frequentemente opera longe do regime ótimo dos motores principais; a hibridização pode melhorar o consumo em carga parcial.
- **Fonte:** Hensen (2021), Chapter 2, §2.23, p. 67 (PDF p. 80).

### ANV-HENSEN-C03-L003-01 — Perda de força no push-pull por jato contra o casco

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador em push-pull está amarrado por cabo muito curto e recebe ordem de puxar o navio lateralmente. O jato de seus propulsores incide quase perpendicularmente no costado. Qual efeito é esperado?
- **Gabarito:** **E — Parte da força útil de tração é anulada pela reação do jato contra o casco assistido.**
- **Justificativa:** Hensen identifica a perda de efetividade do puxar em cabos muito curtos quando o fluxo propulsivo atinge o casco, podendo ser mitigada por maior afastamento.
- **Fonte:** Hensen (2021), Chapter 3, §3.2.2, p. 86 (PDF p. 99).

### ANV-HENSEN-C03-L003-02 — Controle de velocidade abaixo do dead slow ahead

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um navio precisa atravessar uma ponte estreita a velocidade inferior ao seu dead slow ahead, mas deve manter máquina adiante para conservar resposta de leme. Qual emprego do rebocador de popa é descrito por Hensen?
- **Gabarito:** **A — Aplicar força de frenagem controlada para limitar o seguimento enquanto o navio mantém a máquina adiante.**
- **Justificativa:** Um rebocador omnidirecional à popa pode conter a velocidade do navio, permitindo manter a propulsão adiante necessária à governabilidade.
- **Fonte:** Hensen (2021), Chapter 3, §3.2.2, p. 86 (PDF p. 99).

### ANV-HENSEN-C03-L003-03 — Imersão de hélice e leme na navegação com gelo

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um navio em lastro deverá manobrar em área com placas de gelo, mas parte das pás do hélice fica próxima da superfície. Qual providência é tecnicamente indicada antes da operação?
- **Gabarito:** **B — Ajustar lastro e trim, quando possível, para manter hélice e leme inteiramente submersos.**
- **Justificativa:** Hensen alerta que hélice ou leme próximos à superfície ficam mais expostos a danos por impacto com gelo; a condição de lastro e trim é decisiva.
- **Fonte:** Hensen (2021), Chapter 3, §3.3.2, p. 88 (PDF p. 101).

### ANV-HENSEN-C03-L003-04 — Preparação da desatracação em gelo

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Antes de retirar um navio de um berço congelado, o plano de manobra prevê afastar o gelo junto ao casco. Segundo o procedimento descrito por Hensen, onde o trabalho dos rebocadores deve se concentrar?
- **Gabarito:** **C — No entorno do navio, incluindo áreas próximas às extremidades de proa e popa, para liberar a evolução inicial.**
- **Justificativa:** A preparação da saída inclui quebrar o gelo ao redor do navio e em faixas próximas à proa e à popa, evitando bloqueio da movimentação inicial.
- **Fonte:** Hensen (2021), Chapter 3, §3.3.7, p. 92 (PDF p. 105).

### ANV-HENSEN-C03-L003-05 — Zonas de não empurrar em submarinos

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um submarino chega ao porto com áreas marcadas 'NO PUSH' sobre a estrutura externa. O que deve ser feito antes de posicionar os rebocadores para empurrar?
- **Gabarito:** **D — Identificar e comunicar os setores proibidos, evitando contato das defensas com equipamentos sensíveis.**
- **Justificativa:** Ao contrário dos navios mercantes com áreas de empurrão indicadas, submarinos podem apresentar setores de contato proibido que devem ser informados ao prático e aos rebocadores.
- **Fonte:** Hensen (2021), Chapter 3, §3.4.1, p. 96 (PDF p. 109).

### ANV-HENSEN-C04-L003-01 — Braço horizontal entre ponto de reboque e centro de pressão

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Dois projetos de rebocador diferem na distância longitudinal entre o ponto efetivo de reboque e o centro de pressão lateral. Para o mesmo esforço transversal, qual tendência resulta de reduzir essa distância?
- **Gabarito:** **B — Menor momento de guinada a compensar e, em princípio, menor parcela de empuxo gasta em correção direcional.**
- **Justificativa:** O braço entre ponto de reboque e centro de pressão governa o momento que a propulsão deve compensar; reduzi-lo pode liberar mais força para o reboque.
- **Fonte:** Hensen (2021), Chapter 4, §4.2.2, p. 103 (PDF p. 116).

### ANV-HENSEN-C04-L003-02 — Jato do navio e adernamento do rebocador a través

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador convencional trabalha transversalmente junto à popa de um navio com cabo sob tensão. O navio aumenta máquina adiante e seu jato atinge o casco submerso do rebocador. Qual risco adicional surge?
- **Gabarito:** **C — O fluxo do hélice pode aumentar o momento de adernamento já produzido pela tensão transversal do cabo.**
- **Justificativa:** O jato do propulsor do navio pode impor esforço adicional de adernamento sobre o rebocador já solicitado transversalmente.
- **Fonte:** Hensen (2021), Chapter 4, §4.2.2, p. 104 (PDF p. 117).

### ANV-HENSEN-C04-L003-03 — Energia armazenada em cabo curto e íngreme

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador puxa um navio com cabo curto, bastante inclinado e sob forte tensão. Ao receber ordem para passar imediatamente de puxar a empurrar, qual fenômeno exige cuidado?
- **Gabarito:** **D — A energia elástica acumulada pode aproximar bruscamente o rebocador do casco quando a tração é aliviada.**
- **Justificativa:** Hensen adverte que o alívio abrupto de uma linha tracionada pode fazer o rebocador recuar em direção ao navio, agravando o risco ao mudar de modo de assistência.
- **Fonte:** Hensen (2021), Chapter 4, §4.3.1, p. 119 (PDF p. 132).

### ANV-HENSEN-C04-L003-04 — Passadiço invertido em tratores Voith

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Certos rebocadores tratores Voith de terminal apresentam o passadiço orientado 180° em relação ao arranjo tradicional. Qual necessidade operacional motivou essa configuração?
- **Gabarito:** **E — Favorecer a visão e a condução na direção em que o rebocador frequentemente trabalha, inclusive em assistência pela popa.**
- **Justificativa:** A orientação do passadiço acompanha o sentido habitual de trabalho do trator como rebocador de popa e em operações ao costado.
- **Fonte:** Hensen (2021), Chapter 4, §4.4, p. 127 (PDF p. 140).

### ANV-HENSEN-C04-L003-05 — Confirmação de ordens de manobra ao rebocador

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Em uma manobra com três rebocadores, o prático transmite pelo rádio uma ordem que pode ser confundida entre duas unidades. Qual procedimento de comunicação Hensen recomenda?
- **Gabarito:** **A — Identificar o rebocador pelo nome ou posição e exigir confirmação com repetição da ordem recebida.**
- **Justificativa:** A comunicação deve minimizar interpretações divergentes, com identificação clara e confirmação pelo comandante do rebocador.
- **Fonte:** Hensen (2021), Chapter 4, §4.7, p. 132 (PDF p. 145).

### ANV-HENSEN-C05-L003-01 — Estimativa numérica de tração contra vento transversal

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Usando a fórmula aproximada de Hensen para vento de través, F = 0,08 × V² × A (em kgf, com V em m/s e A em m²), qual força se estima para V = 10 m/s e área lateral de 4.000 m²?
- **Gabarito:** **D — 32 toneladas-força, aproximadamente.**
- **Justificativa:** O cálculo resulta em 0,08 × 100 × 4.000 = 32.000 kgf, equivalentes a cerca de 32 tf, dentro das hipóteses simplificadas do método.
- **Fonte:** Hensen (2021), Chapter 5, §5.2.2, p. 136 (PDF p. 149).

### ANV-HENSEN-C05-L003-02 — Limite de profundidade da fórmula de corrente

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um prático pretende usar a fórmula simplificada Fc = 40 × V² × LBP × T para estimar tração contra corrente transversal, mas a profundidade local é apenas 1,2 vez o calado. Qual é a principal ressalva?
- **Gabarito:** **E — A expressão simplificada foi apresentada para águas profundas, e a pequena folga sob a quilha exige correção ou análise mais específica.**
- **Justificativa:** Hensen condiciona a expressão simplificada à água profunda, superior a seis vezes o calado, e destaca forte influência da folga sob a quilha nos coeficientes.
- **Fonte:** Hensen (2021), Chapter 5, §5.2.3, p. 138 (PDF p. 151).

### ANV-HENSEN-C05-L003-03 — Efeito de colchão d'água em berço sólido

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Dois berços têm a mesma orientação: um cais contínuo e um píer aberto sobre estacas. Um navio aproxima-se lateralmente com a mesma velocidade inicial. Qual diferença hidrodinâmica é discutida por Hensen?
- **Gabarito:** **A — O cais sólido pode formar um colchão de água que reduz a aproximação; no píer aberto a água escoa com mais liberdade.**
- **Justificativa:** A água confinada junto a um cais sólido pode oferecer resistência adicional à aproximação, diferentemente de uma estrutura vazada.
- **Fonte:** Hensen (2021), Chapter 5, §5.2.5, p. 141 (PDF p. 154).

### ANV-HENSEN-C05-L003-04 — Interferência do jato em pequeno UKC

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador puxa por cabo um navio com pequena folga sob a quilha, e o jato de seus propulsores atinge o casco. Qual ajuste tende a melhorar a efetividade da força aplicada?
- **Gabarito:** **B — Aumentar, quando operacionalmente viável, o afastamento pelo cabo e ajustar o ângulo de tração para reduzir a incidência do jato.**
- **Justificativa:** Hensen relaciona a perda por jato ao ângulo, à potência e à folga sob a quilha; afastamento e geometria adequados reduzem a reação desfavorável.
- **Fonte:** Hensen (2021), Chapter 5, §5.2.6, p. 141 (PDF p. 154).

### ANV-HENSEN-C05-L003-05 — Reserva de ar de partida na manobra

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Durante a aproximação ao berço, o passadiço solicita sucessivas partidas e paradas do motor principal. Qual condição deve ser monitorada para evitar perda de propulsão em momento crítico?
- **Gabarito:** **C — A pressão disponível nos reservatórios de ar de partida e o limite de partidas consecutivas informado pela praça de máquinas.**
- **Justificativa:** Partidas repetidas podem esgotar a reserva de ar e impedir nova partida; a equipe de manobra deve conhecer a limitação operacional.
- **Fonte:** Hensen (2021), Chapter 5, §5.3.4, p. 146 (PDF p. 159).

### ANV-HENSEN-C06-L003-01 — Perda de tração a ré por interação do jato com o casco

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador ASD produz menor bollard pull a ré do que avante, embora os propulsores sejam direcionáveis. Qual explicação hidrodinâmica Hensen apresenta?
- **Gabarito:** **A — Parte do jato a ré incide sobre o casco situado à vante dos propulsores, reduzindo a força útil.**
- **Justificativa:** A interação entre propulsor e casco do próprio rebocador pode reduzir a tração a ré em comparação à tração avante.
- **Fonte:** Hensen (2021), Chapter 6, §6.2.1, p. 149 (PDF p. 162).

### ANV-HENSEN-C06-L003-02 — Condição do hélice do navio na passagem de cabo pela popa

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador aproxima-se da popa de um navio com seguimento para passar o cabo. Qual providência relativa ao propulsor do navio é recomendada durante essa fase?
- **Gabarito:** **C — Manter parado o hélice de passo fixo ou, se de passo controlável, ajustá-lo ao passo mínimo, conforme coordenação da manobra.**
- **Justificativa:** Hensen alerta que o fluxo do hélice dificulta a manutenção de posição e cria risco quando o rebocador opera junto à popa.
- **Fonte:** Hensen (2021), Chapter 6, §6.3.4, p. 158 (PDF p. 171).

### ANV-HENSEN-C06-L003-03 — Mudança de alheta por rebocador convencional

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador convencional precisa mudar da alheta de bombordo para a de boreste, passando sob a popa do navio assistido. Em que condição a manobra deve ocorrer preferencialmente?
- **Gabarito:** **E — Com o navio praticamente parado na água, mediante coordenação estrita com a ponte e controle da máquina.**
- **Justificativa:** A passagem sob a popa apresenta riscos de girting e de contato com o propulsor, razão pela qual Hensen recomenda velocidade praticamente nula.
- **Fonte:** Hensen (2021), Chapter 6, §6.3.10, p. 163 (PDF p. 176).

### ANV-HENSEN-C06-L003-04 — Estabilidade direcional no bow-to-bow

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um ASD atua bow-to-bow à proa de um navio com seguimento, navegando de ré enquanto mantém o cabo. Por que a tentativa de deslocar-se lateralmente para governar pode ser crítica?
- **Gabarito:** **B — A estabilidade direcional do rebocador navegando de ré pode ser limitada, e o cabo restringe a correção de seu aproamento.**
- **Justificativa:** No bow-to-bow com seguimento, o ASD navega de ré e pode perder controle direcional ao se afastar do alinhamento, especialmente com cabo curto.
- **Fonte:** Hensen (2021), Chapter 6, §6.3.13, p. 165 (PDF p. 178).

### ANV-HENSEN-C06-L003-05 — Proa bulbosa submersa e aproximação do rebocador

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador de proa aproxima-se para receber a retinida de um navio em lastro. A proa bulbosa está quase toda submersa e pouco visível. Qual medida de segurança é prioritária?
- **Gabarito:** **D — Manter afastamento que considere a projeção submersa do bulbo, mesmo que sua extremidade não seja visível.**
- **Justificativa:** A posição real do bulbo pode não ser visível; contato da popa do rebocador com a projeção submersa sob seguimento representa risco grave.
- **Fonte:** Hensen (2021), Chapter 6, §6.3.15, p. 172 (PDF p. 185).

### ANV-HENSEN-C07-L003-01 — Cabo preso nas espiras inferiores do guincho

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Durante a largada controlada de cabo, o comandante observa que o tambor gira, mas o cabo não corre livremente porque ficou preso entre camadas. Qual é o risco específico descrito por Hensen?
- **Gabarito:** **B — O cabo pode ser recolhido involuntariamente ou sofrer carregamento anormal, em vez de ser pago livremente.**
- **Justificativa:** O encravamento do cabo entre camadas pode impedir a saída e provocar recolhimento inesperado, exigindo visibilidade e monitoramento do tambor.
- **Fonte:** Hensen (2021), Chapter 7, §7.3.3, p. 180 (PDF p. 193).

### ANV-HENSEN-C07-L003-02 — Cortador de emergência como barreira adicional

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Em situação crítica, o guincho não consegue aliviar a tensão e o sistema de liberação rápida não atua. Qual função justifica um cortador de cabo de emergência?
- **Gabarito:** **D — Permitir seccionar a linha sob condições previstas de projeto quando outros meios de liberação falharem.**
- **Justificativa:** Hensen apresenta o cortador como recurso adicional para liberar o rebocador quando a linha permanece sob tensão perigosa e os mecanismos usuais falham.
- **Fonte:** Hensen (2021), Chapter 7, §7.4.1, p. 187 (PDF p. 200).

### ANV-HENSEN-C07-L003-03 — Resistência certificada de cabo com olhal costurado

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Uma empresa compara a resistência de um cabo sintético ensaiado sem emenda com a de um cabo equivalente com olhal costurado. Que ressalva de ensaio é citada por Hensen?
- **Gabarito:** **A — A emenda pode reduzir a resistência medida; o valor do conjunto terminado deve orientar a seleção.**
- **Justificativa:** A obra cita redução de resistência associada a emendas/olhais e ressalta que o componente mais fraco do conjunto determina a capacidade efetiva.
- **Fonte:** Hensen (2021), Chapter 7, §7.5.2.3, p. 194 (PDF p. 207).

### ANV-HENSEN-C07-L003-04 — Limitação de carga por cabeços e buzinas

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador de 80 tf será conectado a um navio cujo plano indica SWL de 60 tf para o cabeço e 45 tf para a buzina do mesmo percurso de cabo. Qual limite deve prevalecer para esse arranjo?
- **Gabarito:** **E — O menor valor aplicável, 45 tf, sem ultrapassar a capacidade da buzina.**
- **Justificativa:** A resistência admissível do caminho de carga é limitada pelo elemento mais fraco; Hensen recomenda verificar cabeços e buzinas no plano de reboque e amarração.
- **Fonte:** Hensen (2021), Chapter 7, §7.7, p. 208 (PDF p. 221).

### ANV-HENSEN-C07-L003-05 — Arranjo de reboque de emergência em petroleiro

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Segundo os requisitos SOLAS de reboque de emergência reproduzidos por Hensen, qual configuração é exigida para petroleiros com porte bruto não inferior a 20.000 toneladas?
- **Gabarito:** **C — Arranjos nas duas extremidades, com pelo menos um preparado para lançamento rápido nas condições regulamentares aplicáveis.**
- **Justificativa:** A obra transcreve a exigência SOLAS II-1/3-4 de arranjos de reboque de emergência à vante e à ré para a categoria indicada, com prontidão de lançamento conforme a data de construção.
- **Fonte:** Hensen (2021), Chapter 7, §7.8, p. 209 (PDF p. 222).

### ANV-HENSEN-C09-L003-01 — Prioridade de governo em emergência de escolta

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Durante a escolta, um petroleiro sofre pane de leme e inicia guinada para um banco próximo. O prático pode pedir frenagem intensa ou força de governo imediata. Qual critério Hensen destaca?
- **Gabarito:** **E — Priorizar o esforço que efetivamente afaste o navio do perigo; em certas situações, corrigir a guinada é mais urgente que reduzir a velocidade.**
- **Justificativa:** Em uma guinada perigosa, a correção de rumo pode ser decisiva; Hensen observa que nem sempre reduzir imediatamente a velocidade é a melhor resposta.
- **Fonte:** Hensen (2021), Chapter 9, §9.4, p. 247 (PDF p. 260).

### ANV-HENSEN-C09-L003-02 — Divisão de esforços na escolta em tandem

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um graneleiro precisa ser escoltado por dois rebocadores ligados à popa, em tandem, pois não dispõe de um único ponto de fixação capaz de receber toda a carga. Qual verificação permanece indispensável?
- **Gabarito:** **B — Confirmar que cada cabeço e buzina suporte a força que poderá receber de seu respectivo rebocador.**
- **Justificativa:** A escolta dupla pode repartir esforços por diferentes pontos, mas cada percurso de cabo deve resistir às cargas efetivamente previstas.
- **Fonte:** Hensen (2021), Chapter 9, §9.6.1, p. 249 (PDF p. 262).

### ANV-HENSEN-C09-L003-03 — Sequenciamento de rebocadores em escolta dupla

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Dois rebocadores em tandem recebem ordem para levar a popa do navio escoltado para bombordo. Qual sequência de posicionamento corresponde ao procedimento descrito por Hensen?
- **Gabarito:** **D — O rebocador de bombordo assume primeiro a posição de trabalho; o de boreste aguarda e se aproxima depois, mantendo separação segura.**
- **Justificativa:** No procedimento apresentado, o rebocador do lado da manobra se estabiliza primeiro e o segundo assume posição com afastamento controlado.
- **Fonte:** Hensen (2021), Chapter 9, §9.6.1, p. 250 (PDF p. 263).

### ANV-HENSEN-C09-L003-04 — Geometria da força no reboque indireto

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador de escolta executa modo indireto para produzir elevada força de governo. Segundo a análise geométrica de Hensen, como deve ser orientada aproximadamente a linha de reboque em relação ao eixo longitudinal do navio?
- **Gabarito:** **C — Próxima de 90°, com ângulo de ataque do rebocador ajustado para gerar força lateral eficaz.**
- **Justificativa:** O desempenho de governo no modo indireto depende da geometria do cabo e do ângulo de ataque, com linha próxima ao través do navio na condição de elevada força lateral.
- **Fonte:** Hensen (2021), Chapter 9, §9.6.2, p. 252 (PDF p. 265).

### ANV-HENSEN-C09-L003-05 — Fechamento de portas estanques durante escolta

- **Operação:** criada e integrada à disciplina Arte Naval; sem alteração em IDs anteriores.
- **Enunciado:** Um rebocador de escolta opera em mar agitado e mantém acessos da superestrutura abertos para facilitar o trânsito da tripulação. Qual medida consta dos requisitos de segurança sintetizados por Hensen?
- **Gabarito:** **A — Manter fechadas durante a escolta as portas estanques de acessos expostos que conduzam a espaços abaixo do convés de tempo.**
- **Justificativa:** A proteção da estanqueidade dos acessos expostos reduz o risco de alagamento em operações com movimentos intensos e possibilidade de embarque de água.
- **Fonte:** Hensen (2021), Chapter 9, §9.6.5, p. 266 (PDF p. 279).

## Testes e gates

**Validação local de dados executada por inspeção programática do JSON remoto:** 40 registros; 8 × 5; A–E = 8 cada; cinco alternativas por item; justificativas; integridade de ID; correspondência página PDF = página impressa + 13; seções bibliográficas presentes no texto; nenhuma colisão com os 80 registros dos lotes 001–002.

**Workflows GitHub Actions:** disparados após a integração; resultados finais serão registrados em checkpoint posterior. A execução local de `npm run validate` ou `npm run build` não foi comprovada nesta etapa; não atribuir aprovação antecipada.

**Pendências:** CI completo; auditoria integral; revisão semântica independente; conferência das 51 questões históricas ainda ativas; homologação de conteúdo antes de merge e deploy. O PR #173 permanece aberto.
