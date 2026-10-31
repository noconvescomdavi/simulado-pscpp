# PSCPP — HENSEN — Lote 004: relatório individual de elaboração e auditoria

**Data:** 2026-10-29. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`. **Fonte primária:** Henk Hensen, *Tug Use in Port: A Practical Guide*, 4ª edição revisada, STC Publishing, 2021; https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view.  
**Arquivo:** `data/question-extensions/hensen-lote-004.json`. **Integração:** `lib/question-banks-source.js`.

## Inventário e validações

- 40 questões criadas, capítulos 1–7 e 9 com cinco itens por capítulo; alternativas A–E; distribuição A=8, B=8, C=8, D=8, E=8.
- 40 IDs únicos; cinco alternativas distintas por questão; justificativas técnicas; metadados de taxonomia, rastreabilidade, dificuldade e bibliografia.
- Fonte primária consultada: texto integral da edição 2021; localizadores com capítulo, seção, página impressa e PDF (+13). Seções localizadas no texto integral: **40/40**. Não há seções ausentes na verificação textual.
- Cotejo com 120 itens dos Lotes 001–003: **0 colisões literais de ID ou enunciado**. A comparação literal não comprova ausência de sobreposição semântica; recomenda-se revisão independente.
- Cotejo lexical adicional com **170 questões históricas HENSEN** (10 blocos, 17 por bloco): maior similaridade Jaccard de termos filtrados entre enunciados/tópicos = **0,25**; com os 120 itens dos lotes novos anteriores, maior similaridade de enunciados = **0,278**. Estes índices são triagem, não prova de originalidade semântica.
- **Sobreposições temáticas para revisão independente:** C01-L004-04 versus ANV-B008-01 (rebocador convencional); C04-L004-01 versus ANV-B008-06 (Rotortug); C04-L004-02 versus ANV-B008-01; C07-L004-03 versus ANV-B006-15 (HMPE). As questões novas tratam de atributos específicos, mas não se deve dispensar a revisão editorial por causa da baixa coincidência lexical.
- Não foram modificadas questões históricas, lotes anteriores ou regras de quarentena. Os campos `validation_status: approved` e `validation.source_verified` refletem a verificação editorial efetuada nesta execução, **não** equivalem à homologação independente ou à aprovação de CI.
- Não foi comprovada execução local de `npm run validate` ou `npm run build`. Verificar GitHub Actions no HEAD final.

## Registro individual — 40 criações

### ANV-HENSEN-C01-L004-01 — Confiabilidade ao reduzir o número de rebocadores

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um porto substituiu três rebocadores antigos por duas unidades modernas para atender navios equivalentes. Segundo Hensen, que exigência ganha importância com a redução do número de unidades por manobra?
- **Gabarito:** **A — A confiabilidade operacional e a adequação de cada rebocador à tarefa, acompanhadas de tripulações bem treinadas.**
- **Justificativa:** Quando há menos unidades assistindo, a falha ou inadequação de uma delas tem maior impacto; Hensen destaca segurança, confiabilidade, adequação e treinamento.
- **Referência:** Hensen (2021), Chapter 1, §1.1, p. 3 (PDF p. 16).

### ANV-HENSEN-C01-L004-02 — Janelas de maré e restrições no acesso

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um porto em estuário possui pontes, eclusas e trechos com profundidade variável. Por que o planejamento de assistência não deve considerar apenas as condições junto ao berço?
- **Gabarito:** **B — Porque restrições ao longo do acesso podem impor janelas operacionais e requisitos distintos de manobrabilidade e dimensões dos rebocadores.**
- **Justificativa:** Hensen observa que estuários, variações de profundidade, pontes e eclusas podem exigir janelas e alterar os requisitos ao longo de toda a rota.
- **Referência:** Hensen (2021), Chapter 1, §1.2.2, p. 5 (PDF p. 18).

### ANV-HENSEN-C01-L004-03 — Frenagem controlada na aproximação de eclusa

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Na aproximação de uma eclusa, o prático pretende usar o rebocador para conter o seguimento do navio, sem depender apenas de sua máquina. Qual critério deve orientar a escolha da unidade?
- **Gabarito:** **C — Capacidade efetiva de aplicar força de frenagem e controlar a velocidade na configuração e nas condições previstas.**
- **Justificativa:** O capítulo 1 cita expressamente o emprego de rebocadores para frear e controlar a velocidade na aproximação de eclusas e na passagem de pontes.
- **Referência:** Hensen (2021), Chapter 1, §1.2.5, p. 6 (PDF p. 19).

### ANV-HENSEN-C01-L004-04 — Propulsor de proa retrátil em rebocador convencional

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Uma empresa quer melhorar a manobrabilidade de um rebocador convencional de um hélice, mantendo seu arranjo propulsivo principal. Qual adaptação é descrita por Hensen como possível?
- **Gabarito:** **D — Instalar propulsor de proa orientável a 360°, frequentemente retrátil, que também pode contribuir para a força de reboque.**
- **Justificativa:** A seção 1.3 registra o uso de bow thruster orientável e por vezes retrátil, especialmente em rebocadores de um hélice, para ampliar a manobrabilidade.
- **Referência:** Hensen (2021), Chapter 1, §1.3, p. 7 (PDF p. 20).

### ANV-HENSEN-C01-L004-05 — Padrão de segurança além da exigência local

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** O regulamento de determinado porto não exige um dispositivo adicional de segurança, mas a análise de risco da empresa de rebocadores identifica sua necessidade. Qual decisão é coerente com Hensen?
- **Gabarito:** **E — Adotar o nível de segurança mais elevado justificado pelo risco, mesmo que a regra local não o imponha expressamente.**
- **Justificativa:** Hensen diferencia requisitos locais e a responsabilidade do armador de exigir alto nível de segurança independentemente das particularidades do porto.
- **Referência:** Hensen (2021), Chapter 1, §1.2.7, p. 7 (PDF p. 20).

### ANV-HENSEN-C02-L004-01 — Resposta imediata de potência em rebocador híbrido

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Durante um teste de aceitação de rebocador híbrido, a passagem do modo econômico para a potência máxima apresenta atraso perceptível. Qual é a implicação operacional destacada por Hensen?
- **Gabarito:** **A — O sistema deve disponibilizar potência plena sem atraso e com comando simples quando uma emergência exigir resposta imediata.**
- **Justificativa:** Para rebocadores ecológicos e híbridos, Hensen destaca a simplicidade da transição e a disponibilidade imediata de potência máxima.
- **Referência:** Hensen (2021), Chapter 2, §2.2.6, p. 14 (PDF p. 27).

### ANV-HENSEN-C02-L004-02 — Função do skeg no RSD em modo indireto

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Ao analisar o desempenho de um rebocador RSD em escolta indireta, o projetista considera a posição do skeg. Qual efeito hidrodinâmico é desejado?
- **Gabarito:** **B — Gerar força lateral adicional e deslocar o centro de pressão hidrodinâmica para uma posição favorável em relação ao ponto de reboque.**
- **Justificativa:** O skeg do RSD contribui para forças hidrodinâmicas e para a posição do centro de pressão, influenciando a eficácia do modo indireto.
- **Referência:** Hensen (2021), Chapter 2, §2.13.1, p. 46 (PDF p. 59).

### ANV-HENSEN-C02-L004-03 — Reorientação do rebocador DOT com cabo conectado

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um rebocador DOT precisa mudar do esforço pela proa para o esforço pela popa sem largar o cabo. Que característica construtiva viabiliza essa transição?
- **Gabarito:** **C — Um ponto de reboque móvel sobre trilho resistente ao redor da superestrutura, que acompanha a mudança de orientação do casco.**
- **Justificativa:** O DOT emprega um trilho ao redor da superestrutura, permitindo variar a direção de trabalho com o cabo conectado e reduzindo o risco de força transversal perigosa.
- **Referência:** Hensen (2021), Chapter 2, §2.15, p. 49 (PDF p. 62).

### ANV-HENSEN-C02-L004-04 — Detecção de gás em rebocador de terminal LNG

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Ao especificar um rebocador para operar próximo de um terminal de GNL, qual conjunto de recursos corresponde aos requisitos adicionais citados por Hensen?
- **Gabarito:** **D — Sensores de gás junto a entradas de ventilação e locais relevantes, alarme no passadiço e meios apropriados de isolamento de ventilação.**
- **Justificativa:** O capítulo 2 lista detecção de gás, alarmes, proteção de entradas de ar e dampers operados remotamente entre as medidas possíveis para rebocadores de terminais LNG.
- **Referência:** Hensen (2021), Chapter 2, §2.22, p. 64 (PDF p. 77).

### ANV-HENSEN-C02-L004-05 — Relação entre rotação, tração e potência

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Em uma aproximação simplificada nas condições discutidas por Hensen, a rotação do propulsor de um rebocador dobra. Como variam a tração e a potência exigida?
- **Gabarito:** **E — A tração aumenta aproximadamente quatro vezes e a potência requerida aproximadamente oito vezes.**
- **Justificativa:** Hensen relaciona aproximadamente a força ao quadrado da rotação e a potência ao cubo da rotação, sob condições comparáveis.
- **Referência:** Hensen (2021), Chapter 2, §2.26, p. 78 (PDF p. 91).

### ANV-HENSEN-C03-L004-01 — Limite da preparação de berço com gelo

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um quebra-gelo abriu passagem até o berço antes da chegada do navio. Por que ainda pode ser necessário executar procedimentos específicos de atracação?
- **Gabarito:** **A — Porque quebrar o gelo não significa retirar completamente os fragmentos acumulados entre o navio e o cais.**
- **Justificativa:** O capítulo 3 esclarece que quebra-gelos e rebocadores podem fragmentar o gelo, mas não removê-lo integralmente da área do berço.
- **Referência:** Hensen (2021), Chapter 3, §3.3.1, p. 88 (PDF p. 101).

### ANV-HENSEN-C03-L004-02 — Restrição ao reboque em linha com tubulão bloqueável

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Em área com gelo fragmentado, um rebocador de pequeno calado e hélices em tubulões sofre bloqueios frequentes. Qual decisão reduz o risco de colisão com o navio assistido?
- **Gabarito:** **B — Evitar, nessa condição, o reboque em linha quando a perda súbita de propulsão puder impedir o rebocador de manter velocidade.**
- **Justificativa:** Hensen ressalta que o bloqueio de tubulões pode imobilizar o rebocador e tornar arriscado o reboque em linha diante da resposta tardia do navio.
- **Referência:** Hensen (2021), Chapter 3, §3.3.4, p. 89 (PDF p. 102).

### ANV-HENSEN-C03-L004-03 — Reboque com navio a ré em canal gelado

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Na travessia de um canal coberto de gelo, o rebocador pode perder velocidade subitamente por encontrar gelo mais denso. Qual arranjo de movimento do navio é indicado por Hensen como mais seguro para reboque em linha?
- **Gabarito:** **C — Navio seguindo a ré, com máquina pronta para dar avante e interromper rapidamente o movimento, quando operacionalmente viável.**
- **Justificativa:** A seção 3.3.8 recomenda, no contexto descrito, deslocamento do navio a ré para permitir parada rápida mediante máquina avante.
- **Referência:** Hensen (2021), Chapter 3, §3.3.8, p. 94 (PDF p. 107).

### ANV-HENSEN-C03-L004-04 — Raspadores de gelo em rebocadores

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um porto de inverno precisa liberar gelo aderido às paredes de uma eclusa. Que recurso específico de rebocador é citado por Hensen para essa tarefa?
- **Gabarito:** **D — Raspadores de gelo instalados na proa, destinados à limpeza das paredes de docas e eclusas.**
- **Justificativa:** Hensen registra rebocadores equipados com raspadores na proa para remover gelo das paredes de docas e eclusas.
- **Referência:** Hensen (2021), Chapter 3, §3.3.9, p. 94 (PDF p. 107).

### ANV-HENSEN-C03-L004-05 — Planejamento da assistência a porta-aviões

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um porta-aviões visitará um porto comercial pela primeira vez. Qual providência de coordenação deve anteceder a manobra com rebocadores?
- **Gabarito:** **E — Transmitir previamente as posições, tarefas e procedimentos dos rebocadores e confirmar as intenções entre prático e comandantes envolvidos.**
- **Justificativa:** A seção sobre porta-aviões enfatiza comunicação antecipada e intercâmbio operacional entre práticos e comandantes dos rebocadores.
- **Referência:** Hensen (2021), Chapter 3, §3.4.2, p. 97 (PDF p. 110).

### ANV-HENSEN-C04-L004-01 — Arranjo de propulsores e força do Rotortug

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um Rotortug dispõe de duas unidades azimutais à vante e uma à ré. Em uma análise de empurrão e reboque, por que importa a proximidade entre cada unidade e o ponto de aplicação do esforço?
- **Gabarito:** **A — Porque a distribuição dos propulsores permite produzir esforços eficazes próximos ao ponto de empurrão ou reboque, conforme a manobra.**
- **Justificativa:** Hensen relaciona a distribuição dos três propulsores do Rotortug à geração de esforços de reboque e empurrão e ao trabalho em espaços restritos.
- **Referência:** Hensen (2021), Chapter 4, §4.3.2, p. 119 (PDF p. 132).

### ANV-HENSEN-C04-L004-02 — Componente indesejada de avanço no reboque convencional

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Durante uma correção de rumo, um rebocador convencional puxa o navio por cabo em direção oblíqua. Qual efeito adicional deve ser considerado pelo prático?
- **Gabarito:** **B — Além da componente lateral desejada, o esforço pode introduzir uma componente longitudinal que aumenta o seguimento do navio.**
- **Justificativa:** Na síntese do capítulo 4, Hensen observa que rebocadores convencionais podem auxiliar o governo, mas também acrescentar força longitudinal indesejada.
- **Referência:** Hensen (2021), Chapter 4, §4.3.3, p. 124 (PDF p. 137).

### ANV-HENSEN-C04-L004-03 — Limitação do radar de rebocador junto ao casco

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Em nevoeiro, um rebocador aproxima-se do costado de um navio de grande porte. Por que o radar do rebocador não substitui plenamente as referências visuais nessa situação?
- **Gabarito:** **C — Porque o casco próximo pode produzir setores de sombra ou distorção e a rapidez dos movimentos exige avaliação contínua da posição relativa.**
- **Justificativa:** Hensen destaca os movimentos rápidos dos rebocadores e a degradação da imagem radar perto do casco em operações com visibilidade restrita.
- **Referência:** Hensen (2021), Chapter 4, §4.5.1, p. 127 (PDF p. 140).

### ANV-HENSEN-C04-L004-04 — Limites de assistência em ondas

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um rebocador com tração estática suficiente foi escalado para atuar em terminal exposto a ondulação. Qual avaliação adicional é indispensável?
- **Gabarito:** **D — Verificar a capacidade efetiva de operar e transmitir esforços na direção, período e altura das ondas, com segurança para casco, cabo e tripulação.**
- **Justificativa:** A seção 4.5.2 trata da degradação de desempenho e das restrições de operação em ondas, que não se resumem ao bollard pull nominal.
- **Referência:** Hensen (2021), Chapter 4, §4.5.2, p. 128 (PDF p. 141).

### ANV-HENSEN-C04-L004-05 — Conhecimento mútuo das limitações de manobra

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Em uma manobra complexa, o prático conhece a capacidade de governo do navio, mas desconhece os limites de um novo tipo de rebocador. Qual conduta está alinhada à recomendação de Hensen?
- **Gabarito:** **E — Estabelecer previamente entendimento com o comandante do rebocador sobre capacidades, limites, ordens e resposta esperada.**
- **Justificativa:** Hensen apresenta o conhecimento recíproco entre práticos, comandantes de navios e rebocadores como base da cooperação segura.
- **Referência:** Hensen (2021), Chapter 4, §4.7, p. 132 (PDF p. 145).

### ANV-HENSEN-C05-L004-01 — Distribuição assimétrica da tração por momento de vento

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Uma rajada transversal atua sobre um navio cuja área vélica está distribuída desigualmente ao longo do comprimento. Qual é a consequência para o plano de rebocadores?
- **Gabarito:** **A — Pode ser necessária distribuição desigual de força entre proa e popa para compensar o momento de guinada produzido pelo vento.**
- **Justificativa:** Hensen alerta que a hipótese simplificada de potência igual avante e a ré nem sempre se sustenta, pois o vento pode gerar momento de guinada.
- **Referência:** Hensen (2021), Chapter 5, §5.3.1, p. 143 (PDF p. 156).

### ANV-HENSEN-C05-L004-02 — Dimensionamento em navios de grande deslocamento

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Ao estimar assistência para um navio de grande deslocamento, qual cuidado evita subdimensionar a capacidade dos rebocadores?
- **Gabarito:** **B — Considerar a grande massa e os esforços de aceleração ou parada, além de vento, corrente e ondas, usando avaliação adequada ao deslocamento.**
- **Justificativa:** A seção 5.3.2 trata navios de grande deslocamento por abordagem específica, além das solicitações ambientais.
- **Referência:** Hensen (2021), Chapter 5, §5.3.2, p. 144 (PDF p. 157).

### ANV-HENSEN-C05-L004-03 — Caráter local dos mínimos de rebocadores

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Dois portos recebem navios de dimensões semelhantes, mas exigem números diferentes de rebocadores. Qual explicação é tecnicamente adequada?
- **Gabarito:** **C — Não existe regra mundial única que converta porte do navio em número e tração de rebocadores; condições locais e normas portuárias interferem.**
- **Justificativa:** Hensen registra diferentes critérios e obrigações locais, frequentemente baseados em experiência, ambiente, tipo de navio e berço.
- **Referência:** Hensen (2021), Chapter 5, §5.3.3, p. 145 (PDF p. 158).

### ANV-HENSEN-C05-L004-04 — Dependência quadrática da distância de parada

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Em uma estimativa simplificada de parada apenas por rebocadores, mantendo deslocamento e tração total constantes, a velocidade inicial do navio dobra. Pela relação apresentada por Hensen, o que ocorre com a distância teórica de parada?
- **Gabarito:** **D — A distância teórica quadruplica, antes de considerar atrasos de resposta e outras limitações do modelo.**
- **Justificativa:** A expressão de Hensen para distância de parada é proporcional ao quadrado da velocidade e inversamente proporcional ao bollard pull total; a estimativa não inclui atraso de acionamento.
- **Referência:** Hensen (2021), Chapter 5, §5.3.5, p. 147 (PDF p. 160).

### ANV-HENSEN-C05-L004-05 — Margem para puxar junto ao costado com cabo curto

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um estudo preliminar indica necessidade de 100 toneladas-força para compensar ações ambientais. Os rebocadores operarão puxando junto ao costado com cabos curtos. Qual ajuste aproximado é sugerido por Hensen para esse modo de assistência?
- **Gabarito:** **E — Considerar cerca de 120 toneladas-força no total, em caráter estimativo, devido à perda de eficácia no arranjo.**
- **Justificativa:** O resumo do capítulo 5 sugere aumento aproximado de 20% das estimativas ambientais para rebocadores puxando junto ao costado com cabos curtos.
- **Referência:** Hensen (2021), Chapter 5, §5.3.6, p. 148 (PDF p. 161).

### ANV-HENSEN-C06-L004-01 — Sucção de margem e colchão de proa

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um navio avança próximo à margem de um canal raso. Qual combinação de efeitos pode produzir deslocamento lateral para a margem e tendência de a proa se afastar dela?
- **Gabarito:** **A — Sucção de margem predominando na região posterior e efeito de colchão de proa, com distribuição não uniforme de pressões.**
- **Justificativa:** Hensen descreve bank suction e bow cushion como efeitos distintos, capazes de atrair o casco à margem e gerar guinada da proa para fora.
- **Referência:** Hensen (2021), Chapter 6, §6.2.2, p. 151 (PDF p. 164).

### ANV-HENSEN-C06-L004-02 — Aproximação segura ao costado de navio com seguimento

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um rebocador precisa encostar em navio que mantém seguimento avante. Qual região do casco tende a oferecer escoamento mais uniforme para a aproximação inicial, conforme Hensen?
- **Gabarito:** **B — A região próxima à seção mestra, evitando inicialmente zonas de interação mais intensa junto aos extremos.**
- **Justificativa:** A seção 6.3.2 recomenda aproximação próxima ao meio do navio, onde o escoamento tende a ser mais uniforme do que perto da proa e da popa.
- **Referência:** Hensen (2021), Chapter 6, §6.3.2, p. 155 (PDF p. 168).

### ANV-HENSEN-C06-L004-03 — Rebocador de proa como drogue com navio a ré

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Na entrada de uma bacia com o navio deslocando-se a ré, um rebocador convencional trabalha atravessado pela proa como dispositivo de governo. Que risco cresce se o seguimento a ré exceder os limites do rebocador?
- **Gabarito:** **C — O aumento de esforço transversal e do adernamento pode levar ao emborcamento do rebocador.**
- **Justificativa:** Hensen alerta para o risco de girting e emborcamento do rebocador de proa operando atravessado quando o navio ganha velocidade a ré excessiva.
- **Referência:** Hensen (2021), Chapter 6, §6.3.7, p. 161 (PDF p. 174).

### ANV-HENSEN-C06-L004-04 — Ordem de máquina avante com rebocador atravessado pela popa

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um rebocador convencional atua atravessado à popa de navio com pequeno seguimento avante. Que mudança de máquina do navio é especialmente perigosa?
- **Gabarito:** **D — Uma aceleração súbita para avante, capaz de somar jato do hélice e escoamento sobre o rebocador, provocando grande adernamento.**
- **Justificativa:** Na seção 6.3.8, Hensen relata o risco de emborcamento quando se aplica subitamente máquina avante com rebocador convencional atravessado pela popa.
- **Referência:** Hensen (2021), Chapter 6, §6.3.8, p. 162 (PDF p. 175).

### ANV-HENSEN-C06-L004-05 — Espias auxiliares no empurrão com seguimento

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um rebocador convencional opera perpendicular ao costado de um navio que ainda avança, mantendo posição por cabo de alheta. Qual restrição é essencial?
- **Gabarito:** **E — Limitar a velocidade do navio e assegurar possibilidade de liberação para evitar sobrecarga do cabo e emborcamento.**
- **Justificativa:** Hensen observa que cabos auxiliares podem manter o rebocador junto ao costado, mas velocidade excessiva pode romper o cabo ou emborcar a unidade.
- **Referência:** Hensen (2021), Chapter 6, §6.3.11, p. 163 (PDF p. 176).

### ANV-HENSEN-C07-L004-01 — Limites de liberação do gancho em emergência

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Durante uma condição crítica, um gancho de reboque de liberação rápida está submetido a esforço elevado. Qual precaução decorre da experiência relatada por Hensen?
- **Gabarito:** **A — Não presumir que o gancho sempre abrirá sob carga extrema; avaliar o sistema real de liberação e suas limitações.**
- **Justificativa:** A obra registra casos em que ganchos de liberação rápida não puderam ser abertos em situações críticas, com consequências graves.
- **Referência:** Hensen (2021), Chapter 7, §7.3.2.1, p. 180 (PDF p. 193).

### ANV-HENSEN-C07-L004-02 — Elo fraco controlado na linha de reboque

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Em um arranjo de reboque, foi instalado um elemento de ruptura controlada entre o cabo principal e o pendant. Qual é a finalidade técnica desse elo?
- **Gabarito:** **B — Limitar a sobrecarga por ruptura prevista de um componente sacrificável antes de atingir níveis capazes de danificar o sistema principal.**
- **Justificativa:** Hensen apresenta o KO-LINK como elo fraco controlado para proteção contra sobrecarga, sem dispensar o dimensionamento do conjunto.
- **Referência:** Hensen (2021), Chapter 7, §7.4.2, p. 187 (PDF p. 200).

### ANV-HENSEN-C07-L004-03 — Degradação localizada nas extremidades de cabo HMPE

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Uma inspeção de cabo sintético HMPE usado intensamente revela maior desgaste próximo às extremidades. Que conclusão é consistente com o estudo de resistência residual citado por Hensen?
- **Gabarito:** **C — A resistência residual pode variar ao longo do cabo, exigindo inspeção e critérios de descarte que considerem os trechos mais solicitados.**
- **Justificativa:** O estudo citado por Hensen encontrou retenção de resistência inferior nas extremidades em comparação com trechos centrais de cabos utilizados.
- **Referência:** Hensen (2021), Chapter 7, §7.5.4, p. 198 (PDF p. 211).

### ANV-HENSEN-C07-L004-04 — Conexão automatizada de cabo sem pessoal exposto

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um terminal estuda um sistema de conexão automática do cabo do rebocador, com manipulador e ponto de engate no navio. Qual benefício operacional é descrito por Hensen?
- **Gabarito:** **D — Reduzir a necessidade de pessoal no convés do navio e do rebocador durante conexão e liberação da linha.**
- **Justificativa:** O sistema de conexão automatizada descrito na seção 7.6.2 busca reduzir exposição de tripulantes durante a passagem e a liberação do cabo.
- **Referência:** Hensen (2021), Chapter 7, §7.6.2, p. 206 (PDF p. 219).

### ANV-HENSEN-C07-L004-05 — Distribuição de esforços no reboque de emergência EVATS

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um navio sem propulsão precisa receber reboque de emergência, mas não dispõe de arranjo dedicado equivalente ao de certos petroleiros. Qual princípio caracteriza o EVATS apresentado por Hensen?
- **Gabarito:** **E — Empregar sistema sintético destinado a conectar a linha de reboque a múltiplos pontos de fixação do navio avariado.**
- **Justificativa:** Hensen descreve o EVATS como conceito em HMPE que distribui a ligação do reboque por múltiplos pontos de fixação em navio incapacitado.
- **Referência:** Hensen (2021), Chapter 7, §7.9, p. 212 (PDF p. 225).

### ANV-HENSEN-C09-L004-01 — Resposta ativa versus passiva em falha de governo

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Dois planos de escolta usam o mesmo rebocador: um com acompanhamento ativo e outro com rebocador de prontidão passiva. Qual diferença deve entrar na avaliação de contingência?
- **Gabarito:** **A — Na escolta passiva, o maior atraso até aplicar força pode permitir aumento da guinada e exigir esforço corretivo maior.**
- **Justificativa:** Hensen observa que a reação mais tardia da escolta passiva pode permitir crescimento da taxa de guinada antes da correção.
- **Referência:** Hensen (2021), Chapter 9, §9.6.2, p. 255 (PDF p. 268).

### ANV-HENSEN-C09-L004-02 — Margem de estabilidade antes de imersão do convés

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Em testes de força lateral de um rebocador de escolta, a força máxima ocorre com o convés prestes a imergir. Qual interpretação de segurança é mais adequada?
- **Gabarito:** **B — Não tomar a imersão do convés como margem confortável de operação; estabelecer limites de adernamento e avisos anteriores a essa condição.**
- **Justificativa:** Hensen recomenda margem de estabilidade e cita avisos de ângulo e tensão, destacando que chegar à imersão do convés deixa pouca reserva de segurança.
- **Referência:** Hensen (2021), Chapter 9, §9.6.2, p. 257 (PDF p. 270).

### ANV-HENSEN-C09-L004-03 — Liberação de ponto secundário de reboque em escolta

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Um rebocador ASD em escolta mantém o cabo guiado por pinos de reboque em posição de trânsito. Ao iniciar assistência de governo de emergência, por que pode ser necessário liberar esse guiamento?
- **Gabarito:** **C — Para permitir que a linha atue pelo ponto de reboque mais favorável à geração de força lateral, conforme o projeto e o procedimento.**
- **Justificativa:** Hensen descreve pinos e pontos secundários de escolta que podem ser liberados sob tensão para recuperar a geometria eficaz do reboque de governo.
- **Referência:** Hensen (2021), Chapter 9, §9.6.2, p. 260 (PDF p. 273).

### ANV-HENSEN-C09-L004-04 — Diferença operacional entre rebocador de porto e de escolta

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Uma autoridade portuária pretende classificar como rebocador de escolta toda unidade ASD disponível. Qual critério é mais coerente com Hensen?
- **Gabarito:** **D — Verificar capacidades reais de governo e frenagem na faixa de velocidade e nas condições da escolta, não apenas a classificação ASD.**
- **Justificativa:** A obra distingue rebocadores construídos para escolta e unidades portuárias com alguma capacidade de escolta, conforme exigências operacionais locais.
- **Referência:** Hensen (2021), Chapter 9, §9.6.3, p. 265 (PDF p. 278).

### ANV-HENSEN-C09-L004-05 — Hierarquia de regras de escolta nos Estados Unidos

- **Operação:** criação de questão inédita no Lote 004; nenhuma correção em questão preexistente.
- **Enunciado:** Uma avaliação documental reúne regras federais, estaduais e locais de escolta de petroleiros nos Estados Unidos. Qual cuidado é explicitado por Hensen?
- **Gabarito:** **E — Reconhecer a prevalência das regras federais e verificar a vigência dos requisitos aplicáveis ao local e ao navio.**
- **Justificativa:** A seção 9.7 apresenta a hierarquia regulatória federal e adverte que os requisitos descritos refletem um período específico e podem mudar.
- **Referência:** Hensen (2021), Chapter 9, §9.7, p. 267 (PDF p. 280).

## Pendências e bloqueios

1. Confirmar o resultado de todos os workflows de CI e auditoria integral no HEAD atual do PR #173, sem desativar validações.
2. Realizar revisão semântica independente do Lote 004 contra os 120 itens dos Lotes 001–003 e os 170 itens históricos HENSEN; validar rigor de distratores e páginas em leitura diagramada.
3. Manter em quarentena os 119 itens históricos e revisar os 51 históricos ativos ainda pendentes de homologação bibliográfica.
4. Não executar merge nem deploy enquanto houver gates ou homologação pendentes.

**Próxima execução:** verificar a existência de `hensen-lote-005.json` antes de criar o Lote 005.


## Retificação de localização bibliográfica — checkpoint 006

- **ID:** `ANV-HENSEN-C04-L004-01`.
- **Antes:** `Chapter 4, §4.3.2, p. 120 (PDF p. 133)`; a página impressa 120 já pertence à continuação da síntese §4.3.3 e não contém a passagem específica sobre propulsores próximos aos pontos de reboque e empurrão.
- **Depois:** `Chapter 4, §4.3.2, p. 119 (PDF p. 132)`; nessa página Hensen relaciona explicitamente a distribuição de duas unidades a vante e uma à ré do Rotortug com o aumento da força ao posicionar os propulsores próximos aos pontos de reboque e empurrão.
- **Mudança efetiva:** somente o localizador `source.locator` e este relatório; enunciado, alternativas, gabarito A, explicação, taxonomia e estado ativo foram preservados.
- **Evidência:** confronto direto com a página 119 da quarta edição, 2021, do PDF de 335 páginas disponibilizado no acervo.
- **Limite:** o ajuste de localizador não conclui a homologação semântica independente nem resolve sobreposição temática sinalizada com `ANV-B008-06`.
