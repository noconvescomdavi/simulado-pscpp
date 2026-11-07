# HENSEN — Checkpoint 010: saneamento de distratores do Lote 007

**Data:** 2026-10-29 (America/Sao_Paulo)  
**PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Branch:** `audit/hensen-lote-001-20261029`  
**Commits de correção:** [capítulos 2–3](https://github.com/noconvescomdavi/simulado-pscpp/commit/a382567025a504a93818a72c737696b4fb590738) e [capítulos 4, 6, 7 e 9](https://github.com/noconvescomdavi/simulado-pscpp/commit/35e10f9da31330bb1bc28abd5c812c79a74554df).

## Objetivo, método e alcance

Eliminada a reutilização literal de um conjunto de cinco alternativas entre perguntas distintas de cada capítulo do Lote 007. O checkpoint anterior havia corrigido os capítulos 1 e 5 (10 questões); esta rodada substituiu as **quatro alternativas incorretas de outras 26 questões**, mantendo intactos os 26 enunciados, as 26 alternativas corretas, os gabaritos, explicações, localizadores, taxonomia, IDs, estado ativo e metadados de validação. Os novos distratores são proposições incorretas, mas relacionadas à operação perguntada; a simples leitura de alternativas de outro assunto não deve revelar a resposta.

**Fonte consultada:** Henk Hensen, *Tug Use in Port*, 4ª edição (2021), [PDF original no Google Drive](https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view). Conferência textual direta nesta execução das passagens sobre janelas superiores, rigsaver, emissões, comando uni-lever, limitações de push-pull, uso de duas linhas em eclusas, hélices de bronze em gelo e equipamentos de sonar na popa de submarinos (capítulos 2 e 3). Para capítulos 4, 6, 7 e 9, os distratores foram revisados quanto à coerência técnica e à relação com os enunciados, mas **não se declara homologação integral de cada página/localizador** nesta rodada.

## Verificação estrutural

- Lotes 001–008: 8 × 40 = **320 questões**, 320 IDs distintos, 5 alternativas textualmente distintas por questão, explicações e localizadores presentes.
- Gabaritos globais: **64 A, 64 B, 64 C, 64 D e 64 E**. Classificação em todos os lotes: `arte-naval / hensen-tug`.
- Lote 007: 40 IDs únicos, 5 alternativas distintas por item e **nenhum conjunto completo de alternativas repetido dentro de um capítulo** após a correção.
- **Não houve modificação dos gabaritos nem ativação de questões históricas**. Quarentena histórica reversível: 119; outras 51 históricas ativas ainda aguardam revisão individual.
- Verificação lexical/estrutural não substitui avaliação independente de equivalência semântica, fidelidade bibliográfica integral ou validade de cada distrator.

## Alterações individuais — antes e depois

Em cada item, A–E indicam a letra original. Apenas os distratores listados foram alterados; a alternativa correta indicada permaneceu literalmente idêntica.

### ANV-HENSEN-C02-L007-01 — gabarito A

**Fonte declarada:** Chapter 2, §2.2.2, p. 12 (PDF p. 25).

- **B antes:** Possível parada do motor, exigindo plano para proteger rebocador e tripulação.
  **B depois:** Dispensar janelas voltadas para cima e depender exclusivamente da visão lateral do passadiço.
- **C antes:** CO₂, SOx, NOx e material particulado.
  **C depois:** Utilizar somente câmeras de popa para observar a aproximação do cabo ao navio alto.
- **D antes:** Tipo, cobertura, cristas e pressão de deriva também condicionam a operação.
  **D depois:** Substituir a observação visual do comandante por instruções transmitidas pelo navio assistido.
- **E antes:** Permitir comando coordenado dos propulsores por um controle mestre.
  **E depois:** Instalar apenas vigias frontais baixas, sem campo visual para o castelo ou a popa elevados.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C02-L007-02 — gabarito B

**Fonte declarada:** Chapter 2, §2.22, p. 64 (PDF p. 77).

- **A antes:** Janelas superiores voltadas para cima, complementando a visão panorâmica.
  **A depois:** Emitir apenas um alarme visual, sem possibilidade de interromper o funcionamento do motor.
- **C antes:** CO₂, SOx, NOx e material particulado.
  **C depois:** Desligar somente a iluminação do convés, mantendo inalterada a admissão de ar do motor.
- **D antes:** Tipo, cobertura, cristas e pressão de deriva também condicionam a operação.
  **D depois:** Bloquear exclusivamente o guincho de reboque, sem afetar a propulsão.
- **E antes:** Permitir comando coordenado dos propulsores por um controle mestre.
  **E depois:** Reduzir apenas a velocidade de trânsito, sem previsão de parada de segurança do motor.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C02-L007-03 — gabarito C

**Fonte declarada:** Chapter 2, §2.23, p. 66 (PDF p. 79).

- **A antes:** Janelas superiores voltadas para cima, complementando a visão panorâmica.
  **A depois:** Somente CO₂ e vapor d'água, excluindo os produtos de combustão que formam partículas.
- **B antes:** Possível parada do motor, exigindo plano para proteger rebocador e tripulação.
  **B depois:** Apenas SOx e NOx, pois o CO₂ não é considerado uma emissão atmosférica.
- **D antes:** Tipo, cobertura, cristas e pressão de deriva também condicionam a operação.
  **D depois:** CO₂ e salinidade da água de lastro, sem considerar óxidos de enxofre ou nitrogênio.
- **E antes:** Permitir comando coordenado dos propulsores por um controle mestre.
  **E depois:** Exclusivamente ruído subaquático e calor residual, sem poluentes atmosféricos.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C02-L007-05 — gabarito E

**Fonte declarada:** Chapter 2, §2.10, p. 40 (PDF p. 53).

- **A antes:** Janelas superiores voltadas para cima, complementando a visão panorâmica.
  **A depois:** Variar o passo dos dois propulsores sem coordenar os respectivos ângulos azimutais.
- **B antes:** Possível parada do motor, exigindo plano para proteger rebocador e tripulação.
  **B depois:** Acoplar mecanicamente os dois propulsores para que mantenham sempre o mesmo azimute.
- **C antes:** CO₂, SOx, NOx e material particulado.
  **C depois:** Reunir somente a potência em um comando, mantendo a direção de cada propulsor obrigatoriamente independente.
- **D antes:** Tipo, cobertura, cristas e pressão de deriva também condicionam a operação.
  **D depois:** Aplicar uma combinação fixa de rotação e ângulo, sem ajustar os propulsores ao movimento solicitado.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C03-L007-01 — gabarito A

**Fonte declarada:** Chapter 3, §3.2.2, p. 86 (PDF p. 99).

- **B antes:** A conexão restringe a flexibilidade para inverter o bordo sem reorganizar a assistência.
  **B depois:** O vento sempre afasta o navio do cais, ampliando a folga lateral para os rebocadores.
- **C antes:** A tripulação reduzida do navio pode ter dificuldade para receber e firmar duas linhas.
  **C depois:** O contato com o costado elimina a ação das rajadas sobre o navio de grande área vélica.
- **D antes:** Dano à hélice e ao leme em contato com gelo durante a marcha a ré.
  **D depois:** A presença de rebocadores entre navio e berço impede qualquer aproximação lateral do casco.
- **E antes:** Sonar rebocado e equipamento de manuseio próximo aos órgãos de governo.
  **E depois:** O aumento das rajadas reduz necessariamente a compressão das defensas do rebocador.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C03-L007-02 — gabarito B

**Fonte declarada:** Chapter 3, §3.2.2, p. 86 (PDF p. 99).

- **A antes:** Ficarem comprimidos entre o navio e o cais.
  **A depois:** O bordo pode ser invertido sem alterar cabos ou posições, pois o sistema push-pull é simétrico.
- **C antes:** A tripulação reduzida do navio pode ter dificuldade para receber e firmar duas linhas.
  **C depois:** Basta inverter o sentido do empuxo, mantendo os rebocadores conectados no mesmo lado.
- **D antes:** Dano à hélice e ao leme em contato com gelo durante a marcha a ré.
  **D depois:** A conexão restringe apenas a velocidade do navio, não o bordo escolhido para atracar.
- **E antes:** Sonar rebocado e equipamento de manuseio próximo aos órgãos de governo.
  **E depois:** Aumentar a potência dos rebocadores elimina a necessidade de reorganizar a assistência.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C03-L007-03 — gabarito C

**Fonte declarada:** Chapter 3, §3.2.3, p. 87 (PDF p. 100).

- **A antes:** Ficarem comprimidos entre o navio e o cais.
  **A depois:** Dois guinchos independentes impedem o rebocador de controlar esforços em eclusas estreitas.
- **B antes:** A conexão restringe a flexibilidade para inverter o bordo sem reorganizar a assistência.
  **B depois:** O emprego de duas linhas elimina a necessidade de coordenação entre os guinchos.
- **D antes:** Dano à hélice e ao leme em contato com gelo durante a marcha a ré.
  **D depois:** O método exige obrigatoriamente um segundo prático embarcado no rebocador.
- **E antes:** Sonar rebocado e equipamento de manuseio próximo aos órgãos de governo.
  **E depois:** A instalação de dois guinchos dispensa a participação da tripulação do navio na conexão.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C03-L007-04 — gabarito D

**Fonte declarada:** Chapter 3, §3.3, p. 88 (PDF p. 101).

- **A antes:** Ficarem comprimidos entre o navio e o cais.
  **A depois:** A hélice de bronze perde automaticamente o passo ao inverter a marcha, mesmo sem tocar o gelo.
- **B antes:** A conexão restringe a flexibilidade para inverter o bordo sem reorganizar a assistência.
  **B depois:** O gelo aumenta sempre a eficácia do leme quando o navio desenvolve seguimento a ré.
- **C antes:** A tripulação reduzida do navio pode ter dificuldade para receber e firmar duas linhas.
  **C depois:** Qualquer trim pela popa protege a hélice, mesmo que o navio não consiga aumentar o calado.
- **E antes:** Sonar rebocado e equipamento de manuseio próximo aos órgãos de governo.
  **E depois:** A inversão da máquina elimina as cargas de impacto do gelo sobre os apêndices de popa.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C03-L007-05 — gabarito E

**Fonte declarada:** Chapter 3, §3.4.1, p. 95 (PDF p. 108).

- **A antes:** Ficarem comprimidos entre o navio e o cais.
  **A depois:** A região da popa do submarino é livre de equipamentos externos, exigindo proteção apenas da vela.
- **B antes:** A conexão restringe a flexibilidade para inverter o bordo sem reorganizar a assistência.
  **B depois:** O sonar rebocado permanece necessariamente armazenado longe do leme e dos cabos.
- **C antes:** A tripulação reduzida do navio pode ter dificuldade para receber e firmar duas linhas.
  **C depois:** A aproximação pela popa dispensa avaliação de acessórios externos e pontos sensíveis.
- **D antes:** Dano à hélice e ao leme em contato com gelo durante a marcha a ré.
  **D depois:** Os cabos de reboque não oferecem risco de contato com equipamentos próximos ao leme.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C04-L007-01 — gabarito A

**Fonte declarada:** Chapter 4, §4.2.1, p. 101 (PDF p. 114).

- **B antes:** Para vante.
  **B depois:** O trim pela popa desloca sempre a resistência para vante, anulando o braço de alavanca.
- **C antes:** Reduzir o momento a compensar pelo governo e liberar potência para tração.
  **C depois:** O trim elimina a reação hidrodinâmica lateral durante a manobra.
- **D antes:** Trânsito, assistência direta e indireta, incluindo escolta.
  **D depois:** O rebocador aumenta sua potência nominal apenas porque a proa está menos imersa.
- **E antes:** Observar a atuação do rebocador e intervir ao perceber risco ou desempenho imprevisto.
  **E depois:** A eficácia depende somente do comprimento do cabo, nunca da posição da resistência.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C04-L007-02 — gabarito B

**Fonte declarada:** Chapter 4, §4.2.1, p. 101 (PDF p. 114).

- **A antes:** A resistência hidrodinâmica contrária pode atuar mais a ré.
  **A depois:** Sempre para ré, independentemente do seguimento e da força transversal aplicada.
- **C antes:** Reduzir o momento a compensar pelo governo e liberar potência para tração.
  **C depois:** Para o centro geométrico do navio em qualquer condição de movimento.
- **D antes:** Trânsito, assistência direta e indireta, incluindo escolta.
  **D depois:** Para fora do casco, exatamente no ponto de contato do rebocador.
- **E antes:** Observar a atuação do rebocador e intervir ao perceber risco ou desempenho imprevisto.
  **E depois:** Permanece necessariamente fixo na meia-nau durante toda a manobra.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C04-L007-04 — gabarito D

**Fonte declarada:** Chapter 4, §4.5.2, p. 128 (PDF p. 141).

- **A antes:** A resistência hidrodinâmica contrária pode atuar mais a ré.
  **A depois:** Somente o trânsito em mar calmo, sem interação entre rebocador e navio.
- **B antes:** Para vante.
  **B depois:** Apenas o reboque estático, excluindo manobras de escolta.
- **C antes:** Reduzir o momento a compensar pelo governo e liberar potência para tração.
  **C depois:** Exclusivamente aproximação e desengate de cabos em cais abrigado.
- **E antes:** Observar a atuação do rebocador e intervir ao perceber risco ou desempenho imprevisto.
  **E depois:** Apenas ensaios de guincho e defensas, sem operação de assistência em ondas.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C04-L007-05 — gabarito E

**Fonte declarada:** Chapter 4, §4.7, p. 132 (PDF p. 145).

- **A antes:** A resistência hidrodinâmica contrária pode atuar mais a ré.
  **A depois:** Manter as ordens anteriores sem conferir posição e resposta do rebocador.
- **B antes:** Para vante.
  **B depois:** Transferir ao rebocador toda a avaliação de risco para o navio assistido.
- **C antes:** Reduzir o momento a compensar pelo governo e liberar potência para tração.
  **C depois:** Aumentar automaticamente a força solicitada antes de verificar a resposta anormal.
- **D antes:** Trânsito, assistência direta e indireta, incluindo escolta.
  **D depois:** Ignorar a discrepância até ocorrer falha de propulsão comprovada.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C06-L007-01 — gabarito A

**Fonte declarada:** Chapter 6, §6.2.1, p. 149 (PDF p. 162).

- **B antes:** Coeficiente de atrito e capacidade de absorver energia.
  **B depois:** Os jatos permanecem independentes mesmo quando a descarga de um intercepta o outro.
- **C antes:** Absorção de cargas dinâmicas e banda do rebocador.
  **C depois:** A soma ideal é invariável porque depende apenas da potência nominal dos motores.
- **D antes:** O escoamento relativo ao casco produz forças mesmo sem movimento sobre o fundo.
  **D depois:** A orientação azimutal altera somente o rumo, sem influenciar a força resultante.
- **E antes:** A visão do passadiço pode ser limitada, exigindo comunicação e vigilância.
  **E depois:** A interação desaparece sempre que os propulsores pertencem ao mesmo rebocador.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C06-L007-02 — gabarito B

**Fonte declarada:** Chapter 6, §6.2.1, p. 149 (PDF p. 162).

- **A antes:** Os jatos podem interagir conforme a orientação dos propulsores.
  **A depois:** A cor externa da defensa determina diretamente a força transmitida ao casco.
- **C antes:** Absorção de cargas dinâmicas e banda do rebocador.
  **C depois:** A distância entre vigias do passadiço determina o atrito no contato.
- **D antes:** O escoamento relativo ao casco produz forças mesmo sem movimento sobre o fundo.
  **D depois:** A potência nominal dos motores torna irrelevantes as propriedades da defensa.
- **E antes:** A visão do passadiço pode ser limitada, exigindo comunicação e vigilância.
  **E depois:** Todas as defensas apresentam a mesma absorção de energia e o mesmo atrito.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C06-L007-03 — gabarito C

**Fonte declarada:** Chapter 6, §6.2.1, p. 149 (PDF p. 162).

- **A antes:** Os jatos podem interagir conforme a orientação dos propulsores.
  **A depois:** Cabos de igual resistência de ruptura produzem obrigatoriamente a mesma resposta dinâmica.
- **B antes:** Coeficiente de atrito e capacidade de absorver energia.
  **B depois:** A elasticidade altera apenas a aparência da linha, sem influenciar os esforços.
- **D antes:** O escoamento relativo ao casco produz forças mesmo sem movimento sobre o fundo.
  **D depois:** A banda do rebocador independe da direção e da variação da tensão no cabo.
- **E antes:** A visão do passadiço pode ser limitada, exigindo comunicação e vigilância.
  **E depois:** Quanto menor a elasticidade, menores são sempre os picos de carga em qualquer mar.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C06-L007-05 — gabarito E

**Fonte declarada:** Chapter 6, §6.3.1, p. 155 (PDF p. 168).

- **A antes:** Os jatos podem interagir conforme a orientação dos propulsores.
  **A depois:** A ausência de contato visual garante que a força transmitida permaneça estável.
- **B antes:** Coeficiente de atrito e capacidade de absorver energia.
  **B depois:** O passadiço do navio permite observar integralmente todas as regiões ao longo do costado.
- **C antes:** Absorção de cargas dinâmicas e banda do rebocador.
  **C depois:** O prático pode presumir resposta normal do rebocador sem comunicação adicional.
- **D antes:** O escoamento relativo ao casco produz forças mesmo sem movimento sobre o fundo.
  **D depois:** A alheta é necessariamente visível do passadiço em qualquer trim e borda livre.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C07-L007-01 — gabarito A

**Fonte declarada:** Chapter 7, §7.3.1, p. 179 (PDF p. 192).

- **B antes:** Dimensões do tambor do guincho e dos guia-cabos.
  **B depois:** O cabo sob carga pode ser encurtado manualmente sem aliviar a tensão.
- **C antes:** Capacidade de suportar cargas dinâmicas de movimentos relativos.
  **C depois:** O cabeço permite regular comprimento à mesma velocidade de um guincho automático.
- **D antes:** Respeitar a SWL e reavaliar o plano, inclusive necessidade de reforço.
  **D depois:** A ausência de guincho elimina a necessidade de planejar o alívio de carga.
- **E antes:** Viabilizar reboque para afastar o navio do perigo.
  **E depois:** A operação dispensa pessoal no convés quando a linha está sob tensão.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C07-L007-02 — gabarito B

**Fonte declarada:** Chapter 7, §7.5.2, p. 188 (PDF p. 201).

- **A antes:** O ajuste manual exige cabo aliviado, tempo e pessoal.
  **A depois:** A troca não altera o diâmetro do cabo nem o assentamento no tambor.
- **C antes:** Capacidade de suportar cargas dinâmicas de movimentos relativos.
  **C depois:** Basta confirmar a cor da fibra, mantendo todos os demais parâmetros.
- **D antes:** Respeitar a SWL e reavaliar o plano, inclusive necessidade de reforço.
  **D depois:** O guincho usado com aço pode ser mantido sem verificar a compatibilidade com a linha sintética.
- **E antes:** Viabilizar reboque para afastar o navio do perigo.
  **E depois:** As propriedades da linha afetam somente o navio, nunca os equipamentos do rebocador.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C07-L007-04 — gabarito D

**Fonte declarada:** Chapter 7, §7.7, p. 207 (PDF p. 220).

- **A antes:** O ajuste manual exige cabo aliviado, tempo e pessoal.
  **A depois:** A potência dos rebocadores prevalece sobre a SWL declarada das ferragens.
- **B antes:** Dimensões do tambor do guincho e dos guia-cabos.
  **B depois:** Dividir a força em duas linhas dispensa verificar a carga em cada ponto.
- **C antes:** Capacidade de suportar cargas dinâmicas de movimentos relativos.
  **C depois:** A SWL só importa no reboque oceânico, não durante a assistência portuária.
- **E antes:** Viabilizar reboque para afastar o navio do perigo.
  **E depois:** A capacidade das ferragens é irrelevante se o cabo tiver carga de ruptura superior.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C07-L007-05 — gabarito E

**Fonte declarada:** Chapter 7, §7.8, p. 209 (PDF p. 222).

- **A antes:** O ajuste manual exige cabo aliviado, tempo e pessoal.
  **A depois:** Substituir os sistemas de governo por equipamentos permanentes de amarração.
- **B antes:** Dimensões do tambor do guincho e dos guia-cabos.
  **B depois:** Assegurar velocidade de cruzeiro mesmo após perda completa de propulsão.
- **C antes:** Capacidade de suportar cargas dinâmicas de movimentos relativos.
  **C depois:** Eliminar a necessidade de avaliar mar, vento e condições de conexão.
- **D antes:** Respeitar a SWL e reavaliar o plano, inclusive necessidade de reforço.
  **D depois:** Permitir reboque somente depois do encalhe e do fim do risco de deriva.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C09-L007-01 — gabarito A

**Fonte declarada:** Chapter 9, §9.5.1, p. 247 (PDF p. 260).

- **B antes:** Cada cabeço e buzina deve suportar sua parcela de carga.
  **B depois:** Apenas a velocidade máxima dos rebocadores, sem tempo para conexão.
- **C antes:** Reduzir a severidade do impacto e suas consequências.
  **C depois:** Somente o intervalo até a primeira ordem do prático, pressupondo cabo já firme.
- **D antes:** Verificar jurisdição e vigência, pois o panorama do livro retrata 2017–2018.
  **D depois:** O tempo de reação do leme do navio, sem considerar a aproximação dos rebocadores.
- **E antes:** Não; a distinção depende do emprego e dos requisitos locais.
  **E depois:** Apenas a duração prevista da viagem, independentemente da avaria.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C09-L007-02 — gabarito B

**Fonte declarada:** Chapter 9, §9.6.1, p. 249 (PDF p. 262).

- **A antes:** Aproximação, passagem e fixação dos cabos.
  **A depois:** A divisão de força elimina a necessidade de avaliar cada ferragem.
- **C antes:** Reduzir a severidade do impacto e suas consequências.
  **C depois:** A carga admissível deve ser conferida somente no guincho dos rebocadores.
- **D antes:** Verificar jurisdição e vigência, pois o panorama do livro retrata 2017–2018.
  **D depois:** Dois cabos permitem exceder livremente a SWL dos cabeços do navio.
- **E antes:** Não; a distinção depende do emprego e dos requisitos locais.
  **E depois:** A repartição de forças dispensa analisar ângulos e pontos de aplicação.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C09-L007-03 — gabarito C

**Fonte declarada:** Chapter 9, §9.4, p. 246 (PDF p. 259).

- **A antes:** Aproximação, passagem e fixação dos cabos.
  **A depois:** Interromper toda assistência assim que o encalhe parecer inevitável.
- **B antes:** Cada cabeço e buzina deve suportar sua parcela de carga.
  **B depois:** Concentrar a força apenas em aumentar a velocidade do navio avariado.
- **D antes:** Verificar jurisdição e vigência, pois o panorama do livro retrata 2017–2018.
  **D depois:** Desconsiderar a energia do impacto quando o local de encalhe estiver definido.
- **E antes:** Não; a distinção depende do emprego e dos requisitos locais.
  **E depois:** Priorizar a liberação dos cabos sem avaliar como reduzir o impacto.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C09-L007-04 — gabarito D

**Fonte declarada:** Chapter 9, §9.7, p. 266 (PDF p. 279).

- **A antes:** Aproximação, passagem e fixação dos cabos.
  **A depois:** Aplicar automaticamente a regra de um porto norte-americano a qualquer porto brasileiro.
- **B antes:** Cada cabeço e buzina deve suportar sua parcela de carga.
  **B depois:** Presumir que a edição de 2021 reproduz a legislação mundial vigente em 2026.
- **C antes:** Reduzir a severidade do impacto e suas consequências.
  **C depois:** Ignorar alterações posteriores porque os requisitos de escolta são universais.
- **E antes:** Não; a distinção depende do emprego e dos requisitos locais.
  **E depois:** Adotar o requisito mais antigo como vigente sem consultar a autoridade local.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

### ANV-HENSEN-C09-L007-05 — gabarito E

**Fonte declarada:** Chapter 9, §9.6.3, p. 264 (PDF p. 277).

- **A antes:** Aproximação, passagem e fixação dos cabos.
  **A depois:** Sim; capacidade técnica implica dedicação exclusiva por definição.
- **B antes:** Cada cabeço e buzina deve suportar sua parcela de carga.
  **B depois:** Sim; qualquer rebocador ASD é automaticamente dedicado à escolta.
- **C antes:** Reduzir a severidade do impacto e suas consequências.
  **C depois:** Não; a escolta é sempre proibida para rebocadores que também operam em portos.
- **D antes:** Verificar jurisdição e vigência, pois o panorama do livro retrata 2017–2018.
  **D depois:** Não; a capacidade de escolta só existe em navios oceânicos, nunca em rebocadores portuários.

**Justificativa:** remover alternativas de temas alheios ao enunciado e introduzir erros tecnicamente pertinentes ao conteúdo perguntado, sem modificar a resposta correta.

## Gates e publicação (verificados após o segundo commit de código)

- PR #173 **aberto**, `mergeable=true` na consulta do HEAD `35e10f9da31330bb1bc28abd5c812c79a74554df`. **Merge não realizado**.
- CI, Full Question Bank Audit, Audit Main Question Banks, PSCPP Integral Bank Audit e Validate PIANC 121: **in_progress** nesse HEAD na consulta, não considerados aprovados ainda.
- Status Vercel para esse HEAD: **failure**, URL de bloqueio por limite de build/deployment: https://vercel.com/estibordo?upgradeToPro=build-rate-limit . Nenhum Preview READY desse SHA localizado.
- Vercel Production: **READY** apenas para `a03ccf972a021f9a2c8fee3ba09de3271fa089a7` na `main`, deployment https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ ; não contém os lotes HENSEN.
- A aprovação dos cinco workflows no SHA anterior `067439e8c5f13ddd77804e94915b8332983dc711` não transfere aprovação ao novo HEAD.
- A homologação editorial integral dos lotes 001–008 e o saneamento das 119 históricas permanecem pendentes. Nenhum Lote 009 foi iniciado nesta execução.

## Próxima execução

1. Verificar os cinco workflows do HEAD final e diagnosticar falhas reais, caso ocorram.
2. Aguardar resolução legítima do limite Vercel; não contornar a cota nem fazer merge sem Preview/Production verificáveis.
3. Continuar auditoria de fonte, equivalência semântica e revisão individual das 119 questões históricas, sem reativação prematura.
4. Somente depois dos gates e da homologação editorial, considerar merge e verificar Production READY no SHA efetivamente integrado.
