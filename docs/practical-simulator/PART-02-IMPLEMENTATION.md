# Simulado Prático-Oral — Parte 02
Status: em implementação na branch feature/simulado-pratico-oral.

## Regras fechadas
- Fluxo PLAN → BRIEF → EXECUTE → DEBRIEF.
- Somente cartas DHN 1511, 1512 e 1515.
- Sem eventos aleatórios durante a manobra.
- Ambiente definido antes do início; execução determinística.
- Instrumentação: HDG, COG, SOG, STW, Lat/Long, profundidade/ecobatímetro, maré, UKC dinâmica, squat, XTE, ROT, vento e corrente.
- Alarmes: águas rasas, low UKC, off-track e demais condições navegacionais.
- Encalhe, colisão ou abalroamento são critical errors: desclassificação, zero da seção e necessidade de nova avaliação.
- Maré: fonte DHN, estação Ilha Fiscal, interpolada para data/hora fictícia do cenário. Não substituir por valores inventados.
- Cartografia: o renderer provisório não pode ser apresentado como reprodução das cartas DHN. A camada oficial só será habilitada quando os ativos 1511/1512/1515 estiverem disponíveis e validados.

## Implementado
- Rota por waypoints, Pilot Card e cenários.
- Motor cinemático com vetores de velocidade sobre a água + corrente.
- Engine orders e resposta gradual de velocidade.
- Leme, ROT e atualização geográfica Lat/Long.
- Squat/UKC e safety engine isolados.
- Critical-error engine para grounding/collision/allision.
- Tide engine preparado para eventos oficiais DHN.
- Ambiente seeded: condições ficam fixas para a avaliação, sem eventos aleatórios em execução.

## Pendências da Parte 02
- Ingestão/georreferenciamento dos ativos cartográficos 1511/1512/1515.
- Dataset batimétrico/contornos e objetos AtoN.
- Ingestão integral da Tábua de Marés DHN do ano utilizado.
- Route monitoring geodésico/XTE real por pernas.
- Domínios de colisão/abalroamento com tráfego determinístico.
- Rebocadores, fundeio, atracação/desatracação.
- Bridge controls e instrumentação final.
- Persistência, replay e debrief técnico.
- Testes unitários/integrados e validação mobile/offline.
