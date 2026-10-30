# HENSEN — Lote 011 — auditoria editorial e bibliográfica

**Data:** 30/10/2026. **Fonte primária:** Henk Hensen, *Tug Use in Port*, 4ª edição revista, 2021, PDF do Google Drive: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . **Branch:** `audit/hensen-lote-001-20261029`. **PR:** #173.

**Estado:** `pending_editorial_review`. Verificação de conteúdo e localização no texto da fonte primária realizada; a revisão semântica independente e a inspeção visual integral do PDF continuam pendentes. Menções a regras portuárias históricas não são confirmação de normas atualmente vigentes.

## Inventário e auditoria

- Lote 011: **40 questões** distribuídas em cinco por capítulo (1–7 e 9); todas com cinco alternativas distintas, justificativa técnica e referência por capítulo, seção e página.
- Gabaritos: A=8, B=8, C=8, D=8, E=8.
- 40 IDs únicos, sem colisões literais com **519 registros HENSEN anteriores examinados**: 400 dos Lotes 001–010 e 119 históricos dos sete blocos alterados neste PR.
- Triagem lexical de enunciados por similaridade de Jaccard (termos normalizados, limiar 0,38): **0 pares** acima do limiar nos 519 registros. Esse teste não garante originalidade semântica. Os 51 históricos ativos remanescentes exigem cotejo adicional com o banco principal.
- Páginas do PDF: número impresso + 13. Os localizadores foram confrontados com o texto da edição de 2021; a conferência visual das figuras e tabelas segue pendente.
- Todas as novas questões permanecem `validation_status=pending_editorial_review` e `validation.duplicate_checked=false` até homologação independente.
- Nenhuma questão preexistente foi alterada; quarentena histórica preservada. Não houve merge nem deploy.

## Relatório individual por ID

| ID | Tema | Gabarito | Referência | Fundamentação técnica e alteração |
|---|---|:---:|---|---|
| `ANV-HENSEN-C01-L011-01` | Acesso bilateral em píeres sobre dolphins | **C** | Chapter 1, §1.2.1, p. 4 (PDF p. 17) | **Criada.** Hensen distingue píeres e dolphins, que podem permitir atuação nos dois bordos, de cais contínuos, onde a assistência costuma ficar restrita a um lado. |
| `ANV-HENSEN-C01-L011-02` | Mudança de requisitos ao longo de estuário | **A** | Chapter 1, §1.2.2, p. 5 (PDF p. 18) | **Criada.** O §1.2.2 explica que as condições podem variar do acesso ao berço e que alguns portos empregam tipos distintos de rebocador em partes diferentes da rota. |
| `ANV-HENSEN-C01-L011-03` | Superestrutura como critério de compatibilidade | **E** | Chapter 1, §1.2.3, p. 6 (PDF p. 19) | **Criada.** Hensen inclui potência, equipamento de reboque, defensas, manobrabilidade e superestrutura entre os requisitos que variam conforme os tipos de navio. |
| `ANV-HENSEN-C01-L011-04` | Diferença entre arranjos de propulsores | **B** | Chapter 1, §1.3, p. 7 (PDF p. 20) | **Criada.** O §1.3 diferencia explicitamente Rotortugs de três unidades azimutais dos tipos com uma unidade propulsora em cada extremidade. |
| `ANV-HENSEN-C01-L011-05` | Avaliação temporal das forças de assistência | **D** | Chapter 1, §1.5, p. 8 (PDF p. 21) | **Criada.** A conclusão do capítulo enfatiza que não basta conhecer a magnitude das forças: importa como, quando e em quais condições atuam, inclusive velocidade, espaço e UKC. |
| `ANV-HENSEN-C02-L011-01` | Substituição modular de defensas | **B** | Chapter 2, §2.2.4, p. 14 (PDF p. 27) | **Criada.** Hensen aponta a facilidade de fixação e reparo das defensas modulares, inclusive a substituição individual de blocos. |
| `ANV-HENSEN-C02-L011-02` | Leme Schilling e desvio de jato | **E** | Chapter 2, §2.3.2, p. 21 (PDF p. 34) | **Criada.** No §2.3.2, Hensen descreve o leme Schilling de alta sustentação, capaz de desviar o escoamento da hélice em ângulo próximo de 90°. |
| `ANV-HENSEN-C02-L011-03` | Eficiência do acionamento mecânico em baixa carga | **C** | Chapter 2, §2.23, p. 67 (PDF p. 80) | **Criada.** O §2.23 aponta boa eficiência da propulsão mecânica próxima à velocidade de projeto e baixa eficiência de combustível em regimes significativamente inferiores. |
| `ANV-HENSEN-C02-L011-04` | Reserva de tração em rebocador híbrido | **D** | Chapter 2, §2.23, p. 69 (PDF p. 82) | **Criada.** Hensen alerta que depender de motor elétrico ou baterias para atingir o bollard pull máximo pode introduzir riscos de confiabilidade e recomenda avaliar a capacidade do motor principal isoladamente. |
| `ANV-HENSEN-C02-L011-05` | Controle de rotação em barramento DC híbrido | **A** | Chapter 2, §2.23, p. 69 (PDF p. 82) | **Criada.** No §2.23, Hensen explica que a arquitetura DC pode permitir velocidade variável do diesel, melhorando eficiência em carga parcial. |
| `ANV-HENSEN-C03-L011-01` | Restrição do bordo de atracação no push-pull | **E** | Chapter 3, §3.2.2, p. 86 (PDF p. 99) | **Criada.** Hensen aponta que os rebocadores em push-pull devem ficar no bordo oposto ao de atracação, com pouca flexibilidade após a amarração. |
| `ANV-HENSEN-C03-L011-02` | Observação de obstáculos pelo rebocador em linha | **D** | Chapter 3, §3.2.2, p. 87 (PDF p. 100) | **Criada.** O §3.2.2 destaca a visão dos comandantes dos rebocadores em linha sobre o comportamento do navio e as distâncias à vante e à ré. |
| `ANV-HENSEN-C03-L011-03` | Proteção das placas acústicas de submarino | **A** | Chapter 3, §3.4.1, p. 96 (PDF p. 109) | **Criada.** Hensen descreve as placas acústicas que absorvem/refreiam sinais de sonar e alerta para danos provocados por rebocadores. |
| `ANV-HENSEN-C03-L011-04` | Pontão flutuante para atracação de submarino | **C** | Chapter 3, §3.4.1, p. 98 (PDF p. 111) | **Criada.** O §3.4.1 ressalta que o pontão deve manter a região mais larga do casco submerso distante da margem ou talude. |
| `ANV-HENSEN-C03-L011-05` | Proteção de tow-box e luz de fundeio | **B** | Chapter 3, §3.4.1, p. 96 (PDF p. 109) | **Criada.** Hensen adverte que tow-box e luz de fundeio podem estar próximos ao leme de popa e sofrer danos quando um cabo tensionado muda de bordo. |
| `ANV-HENSEN-C04-L011-01` | Donkey effect em empurrão à proa | **A** | Chapter 4, §4.2.1, p. 101 (PDF p. 114) | **Criada.** O §4.2.1 descreve o donkey effect quando o empurrão fica atrás do centro de forças hidrodinâmicas à vante, produzindo giro contrário ao desejado. |
| `ANV-HENSEN-C04-L011-02` | Centro lateral de pressão variável | **C** | Chapter 4, §4.2.2, p. 102 (PDF p. 115) | **Criada.** Hensen define o centro lateral de pressão como não estacionário e sensível ao casco, apêndices, trim e ângulo de ataque. |
| `ANV-HENSEN-C04-L011-03` | Perda de efetividade do puxão junto ao casco | **D** | Chapter 4, §4.5.2, p. 131 (PDF p. 144) | **Criada.** O §4.5.2 relata perda média de 43% a 64% no puxão ao costado a cerca de um comprimento de rebocador; a perda varia com condições e geometria. |
| `ANV-HENSEN-C04-L011-04` | Excesso de potência em navio pequeno | **E** | Chapter 4, §4.7, p. 133 (PDF p. 146) | **Criada.** Hensen recomenda potência e dimensões proporcionais ao navio, alertando que rebocadores muito potentes podem causar movimentos excessivos em navios pequenos. |
| `ANV-HENSEN-C04-L011-05` | Risco de reposicionar rebocador durante trânsito | **B** | Chapter 4, §4.7, p. 133 (PDF p. 146) | **Criada.** No §4.7, Hensen recomenda evitar reposicionamentos que exijam soltar e refazer cabos, por tempo perdido, redução da assistência e risco de enrosco. |
| `ANV-HENSEN-C05-L011-01` | Visibilidade reduzida versus cálculo de forças | **D** | Chapter 5, §5.2, p. 135 (PDF p. 148) | **Criada.** No §5.2, a visibilidade reduzida é reconhecida como relevante para procedimentos de segurança, mas não é tratada como força física no cálculo de tração. |
| `ANV-HENSEN-C05-L011-02` | Momento máximo em vento de alheta | **B** | Chapter 5, §5.2.2, p. 137 (PDF p. 150) | **Criada.** O §5.2.2 observa que o momento de guinada em geral é máximo para vento de quadrante, variando conforme as características do navio. |
| `ANV-HENSEN-C05-L011-03` | Corrente oblíqua em pequena folga sob a quilha | **C** | Chapter 5, §5.2.3, p. 139 (PDF p. 152) | **Criada.** O §5.2.3 destaca que, em pequena UKC, a força de corrente muda rapidamente com o ângulo e pode ter efeito inesperado perto de 20°–30° pela proa. |
| `ANV-HENSEN-C05-L011-04` | Correção aproximada para puxão com cabo curto | **A** | Chapter 5, §5.3.6, p. 147 (PDF p. 160) | **Criada.** O resumo do §5.3.6 recomenda incremento aproximado de 20% ao resultado dos gráficos para rebocadores puxando junto ao costado com cabos curtos. |
| `ANV-HENSEN-C05-L011-05` | Interpretação de gráficos históricos de tração | **E** | Chapter 5, §5.3.3, p. 146 (PDF p. 159) | **Criada.** Hensen apresenta linhas inferiores e superiores para condições mais fáceis e difíceis e ressalta a idade dos levantamentos e seu valor indicativo. |
| `ANV-HENSEN-C06-L011-01` | Dependência quadrática da interação com margem | **C** | Chapter 6, §6.2.2, p. 150 (PDF p. 163) | **Criada.** O §6.2.2 relaciona os efeitos de margem aproximadamente ao quadrado da velocidade, exemplificando 4 nós versus 2 nós. |
| `ANV-HENSEN-C06-L011-02` | Compromisso entre boca e estabilidade direcional | **E** | Chapter 6, §6.2.3, p. 153 (PDF p. 166) | **Criada.** O §6.2.3 aponta que rebocadores mais largos podem apresentar instabilidade direcional e baixa capacidade de conter guinadas. |
| `ANV-HENSEN-C06-L011-03` | Descolamento de rebocador sugado ao costado | **B** | Chapter 6, §6.2.4, p. 155 (PDF p. 168) | **Criada.** O §6.2.4 descreve casos em que o propulsor interno a ré aumenta a pressão entre os cascos e ajuda a separar o rebocador do navio. |
| `ANV-HENSEN-C06-L011-04` | Detritos e operação bow-to-bow | **D** | Chapter 6, §6.3.13, p. 174 (PDF p. 187) | **Criada.** O resumo do capítulo 6 adverte que detritos podem bloquear ou danificar unidades propulsoras, especialmente perigosamente em bow-to-bow. |
| `ANV-HENSEN-C06-L011-05` | Fechamento estanque durante reboque | **A** | Chapter 6, §6.5, p. 175 (PDF p. 188) | **Criada.** Hensen recomenda manter fechadas durante reboque as portas estanques que protegem acessos a espaços abaixo do convés, devido ao risco de entrada de água sob banda. |
| `ANV-HENSEN-C07-L011-01` | Gancho de reboque em disco | **B** | Chapter 7, §7.3.2, p. 179 (PDF p. 192) | **Criada.** No §7.3.2, o gancho de disco utiliza a aceleração do disco ao liberar cabo sob tensão, evitando impactos concentrados típicos de ganchos convencionais. |
| `ANV-HENSEN-C07-L011-02` | Uso de guia de espiras em guincho portuário | **D** | Chapter 7, §7.3.3, p. 180 (PDF p. 193) | **Criada.** Hensen explica que o pequeno comprimento de cabo usado no porto, comparado ao reboque no mar, torna o guia de espiras menos comum ou menos útil em certos arranjos. |
| `ANV-HENSEN-C07-L011-03` | Resistência de conjuntos de reboque de emergência | **A** | Chapter 7, §7.8, p. 210 (PDF p. 223) | **Criada.** O §7.8 registra resistência de trabalho mínima de 1.000 kN para petroleiros de 20.000 a menos de 50.000 dwt e 2.000 kN para 50.000 dwt ou mais. |
| `ANV-HENSEN-C07-L011-04` | Preparação energética para reboque de emergência | **E** | Chapter 7, §7.8, p. 211 (PDF p. 224) | **Criada.** O §7.8 recomenda que a equipe conheça a disponibilidade de energia para guinchos, ferramentas e iluminação, especialmente à noite e em baixa visibilidade. |
| `ANV-HENSEN-C07-L011-05` | Âncora de mar no sistema EVATS | **C** | Chapter 7, §7.9, p. 212 (PDF p. 225) | **Criada.** No §7.9, a âncora de mar mantém a linha e o cabo de recuperação estendidos à superfície, afastando o ponto de conexão da proa do navio avariado. |
| `ANV-HENSEN-C09-L011-01` | Transferibilidade de estudos de risco de escolta | **E** | Chapter 9, §9.2, p. 243 (PDF p. 256) | **Criada.** Hensen observa que resultados de determinado estudo norueguês são válidos para a área analisada, não para todos os portos. |
| `ANV-HENSEN-C09-L011-02` | Validação de simulação de escolta em ondas | **A** | Chapter 9, §9.2, p. 244 (PDF p. 257) | **Criada.** O §9.2 ressalta limites de CFD, modelos e simuladores e a necessidade de testes em escala real sob condições comparáveis, especialmente com ondas e marulho. |
| `ANV-HENSEN-C09-L011-03` | Treinamento e risco em rebocador de escolta | **D** | Chapter 9, §9.6.4, p. 266 (PDF p. 279) | **Criada.** O §9.6.4 cita estudos da DNV indicando redução de risco com rebocador de escolta bem projetado e tripulado, e aumento dramático quando inadequadamente equipado ou tripulado. |
| `ANV-HENSEN-C09-L011-04` | Arranjo histórico de escolta em Sullom Voe | **B** | Chapter 9, §9.7, p. 270 (PDF p. 283) | **Criada.** O §9.7 reproduz a regra então descrita para Sullom Voe: dois rebocadores, um conectado à popa em drag mode e outro em close attendance. Trata-se de referência histórica, não verificação de norma vigente. |
| `ANV-HENSEN-C09-L011-05` | Limitação de ensaios de escolta em águas profundas | **C** | Chapter 9, §9.8, p. 272 (PDF p. 285) | **Criada.** O §9.8 alerta que ensaios em águas profundas podem superestimar a capacidade efetiva em acesso raso, onde corrente e perdas de governo dificultam a recuperação de avarias. |

## Testes e pendências

| Controle | Resultado |
|---|---|
| Integridade JSON e estrutura das alternativas | Conferida por leitura e validação programática |
| Distribuição por capítulo e gabaritos | 5 por capítulo; 8 por letra |
| Colisão literal com 519 registros anteriores | Nenhuma |
| Triagem lexical dos enunciados | 0 pares com índice Jaccard ≥ 0,38 |
| Revisão independente de originalidade conceitual | **Pendente** |
| Cotejo dos 51 históricos ativos restantes | **Pendente** |
| Conferência visual integral das páginas e figuras | **Pendente** |
| GitHub Actions no HEAD final | **Pendente de consulta** |
| Vercel Preview no HEAD final | **Pendente de consulta; histórico de bloqueio por limite de builds** |

**Ressalva editorial:** o Lote 011 inclui uma questão que reproduz um arranjo de escolta descrito para Sullom Voe na edição de 2021. O enunciado foi explicitamente contextualizado como histórico; não se afirma vigência atual dessa regra.
