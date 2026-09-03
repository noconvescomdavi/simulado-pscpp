const CARDS = [
  {
    "id": "R01",
    "title": "Regra 1 - Aplicação",
    "cat": "Generalidades",
    "q": "O que estabelece a Regra 1 - Aplicação?",
    "a": "Aplica-se a todas as embarcações em alto-mar e em águas a ele ligadas navegáveis por navios de alto-mar.",
    "note": "As regras especiais locais podem existir, mas devem ser, tanto quanto possível, concordantes com o RIPEAM.",
    "visual": "rule1"
  },
  {
    "id": "R02",
    "title": "Regra 2 - Responsabilidade",
    "cat": "Generalidades",
    "q": "O que estabelece a Regra 2 - Responsabilidade?",
    "a": "Nenhuma embarcação, proprietário, comandante ou tripulação é dispensado das consequências de negligência no cumprimento das Regras ou das precauções reclamadas pela prática marinheira.",
    "note": "Circunstâncias especiais e perigo imediato podem exigir afastamento das Regras.",
    "visual": "rule2"
  },
  {
    "id": "R03",
    "title": "Regra 3 - Definições Gerais",
    "cat": "Generalidades",
    "q": "O que estabelece a Regra 3 - Definições Gerais?",
    "a": "Define os principais termos usados no RIPEAM: embarcação, propulsão mecânica, vela, pesca, sem governo, capacidade de manobra restrita, restrita devido ao calado, em movimento, no visual e visibilidade restrita.",
    "note": "Base conceitual para interpretar as demais regras.",
    "visual": "rule3"
  },
  {
    "id": "R04",
    "title": "Regra 4 - Aplicação",
    "cat": "Governo e Navegação",
    "q": "O que estabelece a Regra 4 - Aplicação?",
    "a": "As Regras da Seção I aplicam-se em qualquer condição de visibilidade.",
    "note": "Inicia a Parte B - Regras de Governo e Navegação.",
    "visual": "rule4"
  },
  {
    "id": "R05",
    "title": "Regra 5 - Vigilância",
    "cat": "Governo e Navegação",
    "q": "O que estabelece a Regra 5 - Vigilância?",
    "a": "Toda embarcação deve manter permanentemente vigilância apropriada, visual e auditiva, usando todos os meios adequados às circunstâncias.",
    "note": "Objetivo: obter inteira apreciação da situação e do risco de colisão.",
    "visual": "rule5"
  },
  {
    "id": "R06",
    "title": "Regra 6 - Velocidade de Segurança",
    "cat": "Governo e Navegação",
    "q": "O que estabelece a Regra 6 - Velocidade de Segurança?",
    "a": "Toda embarcação deve navegar permanentemente a uma velocidade segura, permitindo ação apropriada e eficaz para evitar colisão e parada em distância adequada.",
    "note": "Considerar visibilidade, tráfego, manobrabilidade, luzes de fundo, vento/mar/corrente, perigos e calado; com radar, também suas limitações e interferências.",
    "visual": "rule6"
  },
  {
    "id": "R07",
    "title": "Regra 7 - Risco de Abalroamento",
    "cat": "Governo e Navegação",
    "q": "O que estabelece a Regra 7 - Risco de Abalroamento?",
    "a": "Devem ser usados todos os meios apropriados para determinar se existe risco de abalroamento. Em caso de dúvida, presume-se que o risco existe.",
    "note": "Marcação constante de embarcação que se aproxima é forte indicação de risco.",
    "visual": "rule7"
  },
  {
    "id": "R08",
    "title": "Regra 8 - Manobras para Evitar Abalroamento",
    "cat": "Governo e Navegação",
    "q": "O que estabelece a Regra 8 - Manobras para Evitar Abalroamento?",
    "a": "A manobra deve ser positiva, feita com ampla antecedência e de acordo com os bons princípios de marinharia.",
    "note": "Alterações de rumo/velocidade devem ser amplas e claras; evitar pequenas alterações sucessivas.",
    "visual": "rule8"
  },
  {
    "id": "R09",
    "title": "Regra 9 - Canais Estreitos",
    "cat": "Governo e Navegação",
    "q": "O que estabelece a Regra 9 - Canais Estreitos?",
    "a": "Em canal estreito ou via de acesso, manter-se tão próximo quanto possível e seguro do limite exterior situado a boreste.",
    "note": "Embarcações menores de 20 m, a vela e de pesca não devem interferir com embarcação que só possa navegar com segurança dentro do canal.",
    "visual": "rule9"
  },
  {
    "id": "R10",
    "title": "Regra 10 - Esquemas de Separação de Tráfego",
    "cat": "Governo e Navegação",
    "q": "O que estabelece a Regra 10 - Esquemas de Separação de Tráfego?",
    "a": "Seguir a via apropriada no sentido geral do fluxo, manter-se afastado da linha/zona de separação e entrar/sair preferencialmente pelos terminais.",
    "note": "Ao cruzar, fazê-lo com rumo o mais próximo possível da perpendicular ao fluxo.",
    "visual": "rule10"
  },
  {
    "id": "R11",
    "title": "Regra 11 - Aplicação",
    "cat": "No Visual",
    "q": "O que estabelece a Regra 11 - Aplicação?",
    "a": "As Regras da Seção II aplicam-se a embarcações no visual uma da outra.",
    "note": "Abrange as situações clássicas de vela, ultrapassagem, roda a roda, rumos cruzados e preferência.",
    "visual": "rule11"
  },
  {
    "id": "R12",
    "title": "Regra 12 - Embarcações a Vela",
    "cat": "No Visual",
    "q": "O que estabelece a Regra 12 - Embarcações a Vela?",
    "a": "Com ventos em bordos diferentes, a embarcação com vento por bombordo mantém-se fora do caminho. Com vento pelo mesmo bordo, a de barlavento mantém-se fora do caminho da de sotavento.",
    "note": "Em caso de dúvida com vento a bombordo, manter-se fora do caminho.",
    "visual": "rule12"
  },
  {
    "id": "R13",
    "title": "Regra 13 - Ultrapassagem",
    "cat": "No Visual",
    "q": "O que estabelece a Regra 13 - Ultrapassagem?",
    "a": "Toda embarcação que esteja ultrapassando outra deve manter-se fora do caminho da embarcação alcançada.",
    "note": "Considera-se alcançando quando se aproxima de direção superior a 22,5° para ré do través. Em dúvida, considerar-se alcançando.",
    "visual": "rule13"
  },
  {
    "id": "R14",
    "title": "Regra 14 - Situação de Roda a Roda",
    "cat": "No Visual",
    "q": "O que estabelece a Regra 14 - Situação de Roda a Roda?",
    "a": "Duas embarcações de propulsão mecânica em rumos diretamente ou quase diretamente opostos, com risco de abalroamento, devem ambas guinar para boreste.",
    "note": "A passagem deve ocorrer por bombordo uma da outra.",
    "visual": "rule14"
  },
  {
    "id": "R15",
    "title": "Regra 15 - Situação de Rumos Cruzados",
    "cat": "No Visual",
    "q": "O que estabelece a Regra 15 - Situação de Rumos Cruzados?",
    "a": "Quando duas embarcações de propulsão mecânica cruzam rumos com risco de abalroamento, a que avista a outra por boreste deve manter-se fora do caminho.",
    "note": "Se possível, deve evitar cruzar a proa da outra.",
    "visual": "rule15"
  },
  {
    "id": "R16",
    "title": "Regra 16 - Ação da Embarcação Obrigada a Manobrar",
    "cat": "No Visual",
    "q": "O que estabelece a Regra 16 - Ação da Embarcação Obrigada a Manobrar?",
    "a": "A embarcação obrigada a manter-se fora do caminho deve, tanto quanto possível, manobrar antecipada e substancialmente.",
    "note": "Objetivo: manter-se bem safa da outra embarcação.",
    "visual": "rule16"
  },
  {
    "id": "R17",
    "title": "Regra 17 - Ação da Embarcação que Tem Preferência",
    "cat": "No Visual",
    "q": "O que estabelece a Regra 17 - Ação da Embarcação que Tem Preferência?",
    "a": "A embarcação que tem preferência deve manter rumo e velocidade; pode manobrar quando perceber que a outra não está cumprindo adequadamente as Regras.",
    "note": "Se a colisão não puder ser evitada apenas pela manobra da obrigada, deve agir da melhor maneira para ajudar a evitá-la.",
    "visual": "rule17"
  },
  {
    "id": "R18",
    "title": "Regra 18 - Responsabilidade entre Embarcações",
    "cat": "No Visual",
    "q": "O que estabelece a Regra 18 - Responsabilidade entre Embarcações?",
    "a": "Estabelece a hierarquia de responsabilidades entre tipos de embarcação, ressalvadas as Regras 9, 10 e 13.",
    "note": "Em geral, propulsão mecânica mantém-se fora de sem governo, manobra restrita, pesca e vela.",
    "visual": "rule18"
  },
  {
    "id": "R19",
    "title": "Regra 19 - Condução em Visibilidade Restrita",
    "cat": "Visibilidade Restrita",
    "q": "O que estabelece a Regra 19 - Condução em Visibilidade Restrita?",
    "a": "Aplica-se a embarcações fora do visual uma da outra navegando dentro ou próximo de área de visibilidade restrita.",
    "note": "Velocidade segura, máquinas prontas para manobra e cautela extrema; evitar, quando possível, guinar para bombordo para alvo por ante-a-vante do través.",
    "visual": "rule19"
  },
  {
    "id": "R20",
    "title": "Regra 20 - Aplicação",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 20 - Aplicação?",
    "a": "As regras de luzes aplicam-se do pôr ao nascer do Sol; em visibilidade restrita, as luzes prescritas também devem ser exibidas durante o dia.",
    "note": "As regras de marcas aplicam-se ao período diurno.",
    "visual": "rule20"
  },
  {
    "id": "R21",
    "title": "Regra 21 - Definições",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 21 - Definições?",
    "a": "Define luz de mastro, luzes de bordos, luz de alcançado, luz de reboque, luz circular e luz intermitente.",
    "note": "Mastro: branca 225°; bordos: verde boreste e encarnada bombordo 112,5°; alcançado: branca 135°; circular: 360°.",
    "visual": "rule21"
  },
  {
    "id": "R22",
    "title": "Regra 22 - Visibilidade das Luzes",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 22 - Visibilidade das Luzes?",
    "a": "Estabelece as distâncias mínimas de visibilidade das luzes conforme o comprimento da embarcação.",
    "note": "Ex.: ≥50 m: mastro 6 MN, bordos 3 MN, alcançado 3 MN, reboque 3 MN e circulares 3 MN.",
    "visual": "rule22"
  },
  {
    "id": "R23",
    "title": "Regra 23 - Embarcação de Propulsão Mecânica em Movimento",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 23 - Embarcação de Propulsão Mecânica em Movimento?",
    "a": "Deve exibir luz de mastro a vante, segunda luz de mastro à ré e mais alta quando exigida, luzes de bordos e luz de alcançado.",
    "note": "Embarcação <50 m não é obrigada a exibir a segunda luz de mastro.",
    "visual": "rule23"
  },
  {
    "id": "R24",
    "title": "Regra 24 - Rebocando e Empurrando",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 24 - Rebocando e Empurrando?",
    "a": "Rebocador exibe duas luzes de mastro em linha vertical; se o reboque exceder 200 m, três. Exibe ainda bordos, alcançado e luz de reboque amarela acima da de alcançado.",
    "note": "Reboque >200 m também requer marca em losango.",
    "visual": "rule24"
  },
  {
    "id": "R25",
    "title": "Regra 25 - Embarcações a Vela em Movimento e a Remo",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 25 - Embarcações a Vela em Movimento e a Remo?",
    "a": "Embarcação a vela em movimento exibe luzes de bordos e luz de alcançado.",
    "note": "Se navegando a vela e também usando propulsão mecânica, exibe de dia um cone com vértice para baixo.",
    "visual": "rule25"
  },
  {
    "id": "R26",
    "title": "Regra 26 - Embarcações de Pesca",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 26 - Embarcações de Pesca?",
    "a": "Arrasto: verde sobre branca; pesca que não seja arrasto: encarnada sobre branca. Quando com seguimento, acrescentam-se luzes de bordos e alcançado.",
    "note": "Equipamento de pesca >150 m: sinal adicional na direção do aparelho.",
    "visual": "rule26"
  },
  {
    "id": "R27",
    "title": "Regra 27 - Sem Governo ou com Capacidade de Manobra Restrita",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 27 - Sem Governo ou com Capacidade de Manobra Restrita?",
    "a": "Sem governo: duas luzes encarnadas em linha vertical e duas esferas. Manobra restrita: encarnada-branca-encarnada e esfera-losango-esfera.",
    "note": "Dragagem com obstrução: duas encarnadas/esferas no bordo obstruído e duas verdes/losangos no bordo livre.",
    "visual": "rule27"
  },
  {
    "id": "R28",
    "title": "Regra 28 - Restrita devido ao Calado",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 28 - Restrita devido ao Calado?",
    "a": "Pode exibir, além das luzes de propulsão mecânica, três luzes circulares encarnadas em linha vertical ou um cilindro.",
    "note": "Indica severa restrição para desviar-se do rumo devido ao calado disponível.",
    "visual": "rule28"
  },
  {
    "id": "R29",
    "title": "Regra 29 - Embarcações de Praticagem",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 29 - Embarcações de Praticagem?",
    "a": "Em serviço de praticagem: luz circular branca sobre encarnada no ou próximo do tope do mastro.",
    "note": "Em movimento, acrescenta bordos e alcançado; fundeada, acrescenta sinais de fundeio.",
    "visual": "rule29"
  },
  {
    "id": "R30",
    "title": "Regra 30 - Embarcações Fundeadas ou Encalhadas",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 30 - Embarcações Fundeadas ou Encalhadas?",
    "a": "Fundeada: luz circular branca a vante e outra mais baixa próximo à popa; <50 m pode usar uma só luz circular branca.",
    "note": "Encalhada: além dos sinais de fundeio, duas luzes encarnadas em linha vertical e três esferas.",
    "visual": "rule30"
  },
  {
    "id": "R31",
    "title": "Regra 31 - Hidroaviões",
    "cat": "Luzes e Marcas",
    "q": "O que estabelece a Regra 31 - Hidroaviões?",
    "a": "Quando impossível cumprir exatamente as posições/características prescritas, hidroavião ou nave de voo rasante deve exibir sinais tão semelhantes quanto possível.",
    "note": "Regra de adaptação aos meios especiais.",
    "visual": "rule31"
  },
  {
    "id": "R32",
    "title": "Regra 32 - Definições",
    "cat": "Sinais Sonoros",
    "q": "O que estabelece a Regra 32 - Definições?",
    "a": "Apito curto dura aproximadamente 1 segundo; apito longo dura de 4 a 6 segundos.",
    "note": "Define também o apito como dispositivo capaz de produzir os sons prescritos.",
    "visual": "rule32"
  },
  {
    "id": "R33",
    "title": "Regra 33 - Equipamentos para Sinais Sonoros",
    "cat": "Sinais Sonoros",
    "q": "O que estabelece a Regra 33 - Equipamentos para Sinais Sonoros?",
    "a": "≥12 m: apito; ≥20 m: apito + sino; ≥100 m: apito + sino + gongo.",
    "note": "<12 m deve possuir, se não tiver esses equipamentos, meio capaz de produzir sinal sonoro eficaz.",
    "visual": "rule33"
  },
  {
    "id": "R34",
    "title": "Regra 34 - Sinais de Manobra e Advertência",
    "cat": "Sinais Sonoros",
    "q": "O que estabelece a Regra 34 - Sinais de Manobra e Advertência?",
    "a": "No visual: 1 curto = guinando para boreste; 2 curtos = bombordo; 3 curtos = dando a ré.",
    "note": "Dúvida: pelo menos 5 curtos. Curva/obstrução em canal: 1 longo, respondido por 1 longo.",
    "visual": "rule34"
  },
  {
    "id": "R35",
    "title": "Regra 35 - Sinais Sonoros em Visibilidade Restrita",
    "cat": "Sinais Sonoros",
    "q": "O que estabelece a Regra 35 - Sinais Sonoros em Visibilidade Restrita?",
    "a": "Define os sinais de cerração para embarcações em movimento, paradas, sem governo, manobra restrita, pesca, reboque, fundeadas, encalhadas e praticagem.",
    "note": "Ex.: propulsão mecânica com seguimento: 1 longo a intervalos ≤2 min; sob máquinas sem seguimento: 2 longos.",
    "visual": "rule35"
  },
  {
    "id": "R36",
    "title": "Regra 36 - Sinais para Chamar a Atenção",
    "cat": "Sinais Sonoros",
    "q": "O que estabelece a Regra 36 - Sinais para Chamar a Atenção?",
    "a": "Podem ser usados sinais sonoros ou luminosos que não sejam confundidos com sinais autorizados, ou holofote direcionado ao perigo sem perturbar outra embarcação.",
    "note": "Luzes estroboscópicas ou rotativas de grande intensidade devem ser evitadas.",
    "visual": "rule36"
  },
  {
    "id": "R37",
    "title": "Regra 37 - Sinais de Perigo",
    "cat": "Perigo",
    "q": "O que estabelece a Regra 37 - Sinais de Perigo?",
    "a": "Em perigo e necessitando de auxílio, a embarcação deve usar ou exibir os sinais descritos no Anexo IV.",
    "note": "Regra remete diretamente ao Anexo IV.",
    "visual": "rule37"
  },
  {
    "id": "R38",
    "title": "Regra 38 - Isenções",
    "cat": "Isenções",
    "q": "O que estabelece a Regra 38 - Isenções?",
    "a": "Estabelece isenções transitórias ou permanentes para certas embarcações construídas segundo o regulamento anterior, conforme condições especificadas.",
    "note": "Relaciona-se principalmente a instalação/reposicionamento de luzes e material de sinalização sonora.",
    "visual": "rule38"
  },
  {
    "id": "L21-MASTRO",
    "title": "Luz de mastro",
    "cat": "Luzes e Marcas",
    "q": "Qual é a cor e o setor da luz de mastro?",
    "a": "Branca, contínua, setor horizontal de 225°, da proa até 22,5° por ante-a-ré do través em ambos os bordos.",
    "note": "Regra 21(a).",
    "visual": "masthead"
  },
  {
    "id": "L21-BORDOS",
    "title": "Luzes de bordos",
    "cat": "Luzes e Marcas",
    "q": "Como são as luzes de bordos?",
    "a": "Verde a boreste e encarnada a bombordo, cada uma com setor de 112,5°.",
    "note": "Regra 21(b).",
    "visual": "sidelights"
  },
  {
    "id": "L21-ALC",
    "title": "Luz de alcançado",
    "cat": "Luzes e Marcas",
    "q": "Qual é a característica da luz de alcançado?",
    "a": "Branca, contínua, situada próximo da popa e visível em setor horizontal de 135°.",
    "note": "Regra 21(c).",
    "visual": "stern"
  },
  {
    "id": "L21-REB",
    "title": "Luz de reboque",
    "cat": "Luzes e Marcas",
    "q": "Qual é a cor da luz de reboque?",
    "a": "Amarela, com as mesmas características angulares da luz de alcançado.",
    "note": "Regra 21(d).",
    "visual": "tow"
  },
  {
    "id": "R26-ARR",
    "title": "Pesca de arrasto",
    "cat": "Luzes e Marcas",
    "q": "Quais luzes identificam uma embarcação engajada na pesca de arrasto?",
    "a": "Duas luzes circulares em linha vertical: verde sobre branca.",
    "note": "Regra 26(b).",
    "visual": "green-white"
  },
  {
    "id": "R26-PESCA",
    "title": "Pesca que não seja arrasto",
    "cat": "Luzes e Marcas",
    "q": "Quais luzes identificam pesca que não seja de arrasto?",
    "a": "Duas luzes circulares em linha vertical: encarnada sobre branca.",
    "note": "Regra 26(c).",
    "visual": "red-white"
  },
  {
    "id": "R27-SG",
    "title": "Embarcação sem governo",
    "cat": "Luzes e Marcas",
    "q": "Qual é o sinal principal de uma embarcação sem governo?",
    "a": "À noite: duas luzes circulares encarnadas em linha vertical. De dia: duas esferas em linha vertical.",
    "note": "Regra 27(a).",
    "visual": "red-red"
  },
  {
    "id": "R27-CMR",
    "title": "Capacidade de manobra restrita",
    "cat": "Luzes e Marcas",
    "q": "Qual é o sinal de uma embarcação com capacidade de manobra restrita?",
    "a": "À noite: encarnada-branca-encarnada em linha vertical. De dia: esfera-losango-esfera.",
    "note": "Regra 27(b).",
    "visual": "red-white-red"
  },
  {
    "id": "R28-CAL",
    "title": "Restrita devido ao calado",
    "cat": "Luzes e Marcas",
    "q": "Qual sinal adicional pode exibir uma embarcação restrita devido ao calado?",
    "a": "Três luzes circulares encarnadas em linha vertical ou, de dia, um cilindro.",
    "note": "Regra 28.",
    "visual": "red-red-red"
  },
  {
    "id": "R29-PRAT",
    "title": "Praticagem",
    "cat": "Luzes e Marcas",
    "q": "Quais luzes identificam embarcação em serviço de praticagem?",
    "a": "Branca sobre encarnada, em linha vertical.",
    "note": "Regra 29.",
    "visual": "white-red"
  },
  {
    "id": "R30-FUND",
    "title": "Fundeada",
    "cat": "Luzes e Marcas",
    "q": "Qual é a marca diurna de uma embarcação fundeada?",
    "a": "Uma esfera preta.",
    "note": "Regra 30(a).",
    "visual": "ball"
  },
  {
    "id": "R30-ENC",
    "title": "Encalhada",
    "cat": "Luzes e Marcas",
    "q": "Qual é a marca diurna de uma embarcação encalhada?",
    "a": "Três esferas pretas em linha vertical; à noite, além das luzes de fundeio, duas encarnadas em linha vertical.",
    "note": "Regra 30(d).",
    "visual": "balls3"
  },
  {
    "id": "S34-1",
    "title": "1 apito curto",
    "cat": "Sinais Sonoros",
    "q": "O que significa 1 apito curto no visual?",
    "a": "Estou guinando para boreste.",
    "note": "Regra 34(a).",
    "visual": "sound1"
  },
  {
    "id": "S34-2",
    "title": "2 apitos curtos",
    "cat": "Sinais Sonoros",
    "q": "O que significam 2 apitos curtos no visual?",
    "a": "Estou guinando para bombordo.",
    "note": "Regra 34(a).",
    "visual": "sound2"
  },
  {
    "id": "S34-3",
    "title": "3 apitos curtos",
    "cat": "Sinais Sonoros",
    "q": "O que significam 3 apitos curtos no visual?",
    "a": "Estou dando a ré.",
    "note": "Regra 34(a).",
    "visual": "sound3"
  },
  {
    "id": "S34-5",
    "title": "5 apitos curtos",
    "cat": "Sinais Sonoros",
    "q": "O que significa uma série de pelo menos 5 apitos curtos?",
    "a": "Dúvida quanto às intenções ou à suficiência da manobra da outra embarcação.",
    "note": "Regra 34(d).",
    "visual": "sound5"
  },
  {
    "id": "S34-CURVA",
    "title": "Curva em canal estreito",
    "cat": "Sinais Sonoros",
    "q": "Qual sinal deve ser dado ao aproximar-se de curva/obstrução em canal estreito?",
    "a": "Um apito longo; outra embarcação oculta do outro lado deve responder com um apito longo.",
    "note": "Regra 34(e).",
    "visual": "long1"
  },
  {
    "id": "S35-MOV",
    "title": "Cerração - com seguimento",
    "cat": "Visibilidade Restrita",
    "q": "Qual sinal de uma embarcação de propulsão mecânica com seguimento em visibilidade restrita?",
    "a": "Um apito longo em intervalos não superiores a 2 minutos.",
    "note": "Regra 35(a).",
    "visual": "long1"
  },
  {
    "id": "S35-PAR",
    "title": "Cerração - sem seguimento",
    "cat": "Visibilidade Restrita",
    "q": "Qual sinal de uma embarcação de propulsão mecânica sob máquinas, mas parada e sem seguimento?",
    "a": "Dois apitos longos sucessivos, separados por cerca de 2 segundos, em intervalos não superiores a 2 minutos.",
    "note": "Regra 35(b).",
    "visual": "long2"
  },
  {
    "id": "S35-ESP",
    "title": "Cerração - especiais",
    "cat": "Visibilidade Restrita",
    "q": "Qual sinal é usado por sem governo, manobra restrita, restrita devido ao calado, vela, pesca, reboque/empurra?",
    "a": "Um apito longo seguido de dois apitos curtos, em intervalos não superiores a 2 minutos.",
    "note": "Regra 35(c)/(d).",
    "visual": "long-short-short"
  },
  {
    "id": "S35-REB",
    "title": "Cerração - rebocado",
    "cat": "Visibilidade Restrita",
    "q": "Qual sinal da última embarcação rebocada, se guarnecida?",
    "a": "Um apito longo seguido de três apitos curtos, se possível imediatamente após o sinal do rebocador.",
    "note": "Regra 35(e).",
    "visual": "long-short-short-short"
  },
  {
    "id": "S35-PRAT",
    "title": "Identificação da praticagem",
    "cat": "Sinais Sonoros",
    "q": "Qual sinal de identificação adicional pode soar uma embarcação de praticagem em serviço?",
    "a": "Quatro apitos curtos.",
    "note": "Regra 35(k).",
    "visual": "sound4"
  },
  {
    "id": "R13-ANG",
    "title": "Ângulo de ultrapassagem",
    "cat": "No Visual",
    "q": "A partir de que setor uma embarcação é considerada alcançadora?",
    "a": "Quando se aproxima de uma direção de mais de 22,5° para ré do través da embarcação alcançada.",
    "note": "Regra 13(b).",
    "visual": "overtake"
  },
  {
    "id": "R14-BOR",
    "title": "Roda a roda",
    "cat": "No Visual",
    "q": "Em uma situação de roda a roda entre duas embarcações de propulsão mecânica, para onde ambas guinam?",
    "a": "Para boreste, passando por bombordo uma da outra.",
    "note": "Regra 14(a).",
    "visual": "headon"
  },
  {
    "id": "R15-CRUZ",
    "title": "Rumos cruzados",
    "cat": "No Visual",
    "q": "Em rumos cruzados, qual embarcação deve manter-se fora do caminho?",
    "a": "A embarcação que avista a outra por boreste.",
    "note": "Regra 15.",
    "visual": "crossing"
  },
  {
    "id": "R18-HIER",
    "title": "Responsabilidade - propulsão mecânica",
    "cat": "No Visual",
    "q": "De quais embarcações uma embarcação de propulsão mecânica em movimento deve manter-se fora do caminho, em regra?",
    "a": "Sem governo; com capacidade de manobra restrita; engajada na pesca; e a vela.",
    "note": "Regra 18(a), ressalvadas as Regras 9, 10 e 13.",
    "visual": "priority"
  }
];

const categories = ["Todos","Generalidades","Governo e Navegação","No Visual","Visibilidade Restrita","Luzes e Marcas","Sinais Sonoros","Perigo","Isenções"];
const KEY="ripeamTrainer:v1";
let state=JSON.parse(localStorage.getItem(KEY)||'{}');
state.stats=state.stats||{total:0,correct:0};
state.difficult=new Set(state.difficult||[]);
state.wrong=new Set(state.wrong||[]);
state.theme=state.theme||"light";

let currentFilter="Todos", currentMode="study", list=[...CARDS], idx=0, examQueue=[], examCurrent=null, examLocked=false;

const $=s=>document.querySelector(s);
const els={
 filters:$("#filters"),search:$("#search"),flashcard:$("#flashcard"),question:$("#question"),answer:$("#answer"),note:$("#note"),ruleCode:$("#ruleCode"),badge:$("#categoryBadge"),counter:$("#counter"),
 visual:$("#cardVisual"),diff:$("#difficultBtn"),study:$("#studyPanel"),exam:$("#examPanel"),options:$("#options"),examQ:$("#examQuestion"),examV:$("#examVisual"),examCounter:$("#examCounter"),feedback:$("#examFeedback"),examNext:$("#examNext")
};

function save(){localStorage.setItem(KEY,JSON.stringify({stats:state.stats,difficult:[...state.difficult],wrong:[...state.wrong],theme:state.theme}));updateStats();}
function updateStats(){
 $("#totalStat").textContent=state.stats.total; $("#correctStat").textContent=state.stats.correct;
 $("#pctStat").textContent=state.stats.total?Math.round(state.stats.correct/state.stats.total*100)+"%":"0%";
 $("#diffStat").textContent=state.difficult.size;
}
function norm(s){return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();}
function applyFilters(){
 const q=norm(els.search.value);
 list=CARDS.filter(c=>{
   const byCat=currentFilter==="Todos" || currentFilter==="difficult"&&state.difficult.has(c.id) || currentFilter==="wrong"&&state.wrong.has(c.id) || c.cat===currentFilter;
   const hay=norm([c.id,c.title,c.cat,c.q,c.a,c.note].join(" "));
   return byCat && (!q||hay.includes(q));
 });
 idx=Math.min(idx,Math.max(0,list.length-1)); renderCard();
}
function renderFilters(){
 els.filters.innerHTML="";
 categories.forEach(cat=>{
   const b=document.createElement("button");b.className="chip"+(currentFilter===cat?" active":"");b.textContent=cat;
   b.onclick=()=>{currentFilter=cat;document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");applyFilters();};
   els.filters.appendChild(b);
 });
}
function renderCard(){
 if(!list.length){els.question.textContent="Nenhum cartão encontrado.";els.answer.textContent="Altere a busca ou o filtro.";els.ruleCode.textContent="";els.visual.innerHTML="";els.counter.textContent="0 / 0";return;}
 const c=list[idx];els.flashcard.classList.remove("revealed");els.ruleCode.textContent=c.id;els.question.textContent=c.q;els.answer.textContent=c.a;els.note.textContent=c.note;els.badge.textContent=c.cat;els.counter.textContent=`${idx+1} / ${list.length}`;els.visual.innerHTML=visual(c.visual,c);
 const on=state.difficult.has(c.id);els.diff.classList.toggle("on",on);els.diff.textContent=(on?"★":"☆")+" "+(on?"Difícil":"Marcar difícil");
}
function dots(colors){return `<div class="viz"><div class="diagramText">SINAL VISUAL</div><div class="ship"></div><div class="mast"></div><div class="lightStack">${colors.map(c=>`<span class="dot ${c}"></span>`).join("")}</div></div>`}
function sounds(seq){return `<div class="viz"><div class="diagramText">SINAL SONORO</div><div class="sound">${seq.map(x=>`<span class="blast ${x}"></span>`).join("")}</div></div>`}
function visual(v,c){
 if(v==="green-white")return dots(["green","white"]);if(v==="red-white")return dots(["red","white"]);if(v==="red-red")return dots(["red","red"]);if(v==="red-white-red")return dots(["red","white","red"]);if(v==="red-red-red")return dots(["red","red","red"]);if(v==="white-red")return dots(["white","red"]);
 if(v==="sound1")return sounds(["short"]);if(v==="sound2")return sounds(["short","short"]);if(v==="sound3")return sounds(["short","short","short"]);if(v==="sound4")return sounds(["short","short","short","short"]);if(v==="sound5")return sounds(["short","short","short","short","short"]);if(v==="long1")return sounds(["long"]);if(v==="long2")return sounds(["long","long"]);if(v==="long-short-short")return sounds(["long","short","short"]);if(v==="long-short-short-short")return sounds(["long","short","short","short"]);
 if(v==="ball")return `<div class="viz"><div class="diagramText">MARCA DIURNA</div><div class="lightStack"><span class="shape ball"></span></div></div>`;
 if(v==="balls3")return `<div class="viz"><div class="diagramText">MARCA DIURNA</div><div class="lightStack"><span class="shape ball"></span><span class="shape ball"></span><span class="shape ball"></span></div></div>`;
 if(v==="headon")return `<div class="viz headon"><div class="diagramText">RODA A RODA — AMBAS GUINAM PARA BORESTE</div><div class="miniShip a"></div><div class="miniShip b"></div><div class="arrow">↘ ↙</div></div>`;
 if(v==="crossing")return `<div class="viz crossing"><div class="diagramText">RUMOS CRUZADOS</div><div class="miniShip a"></div><div class="miniShip b"></div><div class="arrow">↗</div></div>`;
 if(v==="overtake")return `<div class="viz overtake"><div class="diagramText">ULTRAPASSAGEM — &gt;22,5° PARA RÉ DO TRAVÉS</div><div class="miniShip a"></div><div class="miniShip b"></div><div class="arrow">↑</div></div>`;
 if(v==="priority")return `<div class="viz"><div class="priorityList"><div>1. Sem governo</div><div>2. Manobra restrita</div><div>3. Pesca</div><div>4. Vela</div></div></div>`;
 if(v==="masthead"||v==="sidelights"||v==="stern"||v==="tow")return `<div class="viz"><div class="ship"></div><div class="mast"></div><div class="lightStack">${v==="tow"?'<span class="dot yellow"></span>':'<span class="dot white"></span>'}</div><div class="diagramText">${c.title.toUpperCase()}</div></div>`;
 return `<div class="viz"><div class="diagramText">${c.cat.toUpperCase()}</div><div style="font-size:92px;font-weight:900;letter-spacing:-.06em">${c.id.replace("R","")}</div></div>`;
}
function grade(ok){
 if(!list.length)return;const c=list[idx];state.stats.total++; if(ok){state.stats.correct++;state.wrong.delete(c.id);}else state.wrong.add(c.id);save(); if(idx<list.length-1)idx++;renderCard();
}
els.flashcard.onclick=()=>els.flashcard.classList.toggle("revealed");
$("#prevBtn").onclick=()=>{if(list.length)idx=(idx-1+list.length)%list.length;renderCard();};
$("#nextBtn").onclick=()=>{if(list.length)idx=(idx+1)%list.length;renderCard();};
$("#wrongBtn").onclick=()=>grade(false);$("#correctBtn").onclick=()=>grade(true);
els.diff.onclick=()=>{if(!list.length)return;let id=list[idx].id;state.difficult.has(id)?state.difficult.delete(id):state.difficult.add(id);save();renderCard();};
els.search.oninput=applyFilters;

document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{
 if(b.dataset.filter){currentFilter=b.dataset.filter;currentMode="study";els.study.classList.remove("hidden");els.exam.classList.add("hidden");renderFilters();applyFilters();return;}
 currentMode=b.dataset.mode;document.querySelectorAll(".mode").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 if(currentMode==="exam"){els.study.classList.add("hidden");els.exam.classList.remove("hidden");startExam();}else{els.exam.classList.add("hidden");els.study.classList.remove("hidden");}
});

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function startExam(){
 const base=list.length?list:CARDS;const wrongFirst=base.filter(c=>state.wrong.has(c.id));const rest=base.filter(c=>!state.wrong.has(c.id));examQueue=[...shuffle(wrongFirst),...shuffle(rest)];nextExam();
}
function nextExam(){
 if(!examQueue.length)examQueue=shuffle(list.length?list:CARDS);
 examCurrent=examQueue.shift();examLocked=false;els.feedback.textContent="";els.examNext.classList.add("hidden");els.examQ.textContent=examCurrent.q;els.examV.innerHTML=visual(examCurrent.visual,examCurrent);els.examCounter.textContent=`${state.stats.total} respondidas`;
 let distract=shuffle(CARDS.filter(c=>c.id!==examCurrent.id)).slice(0,3).map(c=>c.a);let opts=shuffle([examCurrent.a,...distract]);els.options.innerHTML="";
 opts.forEach(txt=>{let b=document.createElement("button");b.className="option";b.textContent=txt;b.onclick=()=>answerExam(b,txt);els.options.appendChild(b);});
}
function answerExam(btn,txt){
 if(examLocked)return;examLocked=true;let ok=txt===examCurrent.a;state.stats.total++;if(ok){state.stats.correct++;state.wrong.delete(examCurrent.id);els.feedback.textContent="✓ Resposta correta.";}else{state.wrong.add(examCurrent.id);examQueue.push(examCurrent);els.feedback.textContent="✕ Resposta incorreta. Este cartão voltará no final da fila.";}
 [...els.options.children].forEach(b=>{b.disabled=true;if(b.textContent===examCurrent.a)b.classList.add("correct");else if(b===btn&&!ok)b.classList.add("wrong");});
 save();els.examNext.classList.remove("hidden");
}
els.examNext.onclick=nextExam;
$("#resetBtn").onclick=()=>{if(confirm("Apagar todo o progresso salvo neste navegador?")){localStorage.removeItem(KEY);location.reload();}};
$("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";applyTheme();save();};
function applyTheme(){document.documentElement.dataset.theme=state.theme;$("#themeBtn").textContent=state.theme==="dark"?"☀️":"🌙";}
document.addEventListener("keydown",e=>{if(currentMode!=="study")return;if(e.key==="ArrowRight")$("#nextBtn").click();if(e.key==="ArrowLeft")$("#prevBtn").click();if(e.key===" "||e.key==="Enter"){e.preventDefault();els.flashcard.classList.toggle("revealed");}if(e.key.toLowerCase()==="d")els.diff.click();});
applyTheme();renderFilters();applyFilters();updateStats();
