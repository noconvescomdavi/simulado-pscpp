# HENSEN — Lote 019 — auditoria individual e revisão editorial

Data: 2026-10-30. PR #173. Branch `audit/hensen-lote-001-20261029`.

Fonte primária: Henk Hensen, *Tug Use in Port: A Practical Guide*, 4ª edição (2021), Google Drive `1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9`.

## Escopo e verificações

- 40 questões; capítulos 1–7 e 9, cinco em cada capítulo. Cinco alternativas A–E distintas por item.

- Distribuição dos gabaritos: A=8, B=8, C=8, D=8, E=8. Quarenta IDs únicos.

- Referências com capítulo, seção e página impressa (PDF p. impressa + 13). 40 âncoras verificadas no texto extraído da fonte primária; conferência visual integral pendente.

- Comparação literal com os 720 itens dos lotes 001–018: **zero colisões**. Triagem lexical Jaccard por tokens relevantes (limiar 0,33): **zero alertas após quatro reescritas**. Ausência de alerta lexical não prova originalidade conceitual integral.

- Comparação semântica independente com os 720 anteriores, os 170 históricos e o banco principal: pendente. Testes npm, GitHub Actions e Vercel Preview no HEAD final: pendentes.

## Revisões de originalidade realizadas

- `ANV-HENSEN-C01-L019-01`: Substituído tema de transferência de push-pull já coberto no L014 por classificação de instalações remotas SPM/FLNG.

- `ANV-HENSEN-C05-L019-02`: Substituído cálculo linear com calado já coberto no L007 por momento de corrente proporcional a LBP².

- `ANV-HENSEN-C07-L019-03`: Substituído critério numérico de arames rompidos já coberto no L009 por irreparabilidade de dano mecânico em cabo de aço.

- `ANV-HENSEN-C09-L019-03`: Substituído ângulo de cabo de 90° já coberto no L016 por análise dos braços horizontais de equilíbrio em escolta indireta.

## Registro individual por ID

### ANV-HENSEN-C01-L019-01
- **Alteração**: Substituído tema de transferência de push-pull já coberto no L014 por classificação de instalações remotas SPM/FLNG..
- **Tema**: Instalação remota SPM e FLNG na tipologia de portos.
- **Gabarito**: C.
- **Fonte**: Chapter 1, §1.2.1, p. 4 (PDF p. 17).
- **Justificativa técnica**: O §1.2.1 distingue instalações remotas, como SPMs e F(P)SOs/FLNGs, cujos requisitos de rebocagem dependem das condições e do tipo de operação.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C01-L019-02
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Acesso bilateral em dolphins.
- **Gabarito**: A.
- **Fonte**: Chapter 1, §1.2.1, p. 4 (PDF p. 17).
- **Justificativa técnica**: O arranjo de amarração condiciona o acesso lateral.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C01-L019-03
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Blackout na aproximação da eclusa.
- **Gabarito**: E.
- **Fonte**: Chapter 1, §1.2.5, p. 6 (PDF p. 19).
- **Justificativa técnica**: O rebocador deve poder controlar velocidade e rumo em falha de máquina.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C01-L019-04
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Familiarização após troca de frota.
- **Gabarito**: B.
- **Fonte**: Chapter 1, §1.2.6, p. 6 (PDF p. 19).
- **Justificativa técnica**: A experiência anterior não se transfere automaticamente ao novo conceito.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C01-L019-05
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Versatilidade e taxa de utilização.
- **Gabarito**: D.
- **Fonte**: Chapter 1, §1.5, p. 8 (PDF p. 21).
- **Justificativa técnica**: A diversidade da frota deve ser justificada por requisitos operacionais.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C02-L019-01
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Leme com flap e sustentação.
- **Gabarito**: B.
- **Fonte**: Chapter 2, §2.3, p. 20 (PDF p. 33).
- **Justificativa técnica**: O flap melhora a sustentação sem multiplicar diretamente a potência.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C02-L019-02
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Guincho e freio do Giano.
- **Gabarito**: D.
- **Fonte**: Chapter 2, §2.21.1, p. 62 (PDF p. 75).
- **Justificativa técnica**: Tração de recolhimento e retenção são capacidades diferentes.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C02-L019-03
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Modo PTI Booster.
- **Gabarito**: A.
- **Fonte**: Chapter 2, §2.23, p. 70 (PDF p. 83).
- **Justificativa técnica**: PTI introduz potência elétrica adicional no eixo.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C02-L019-04
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Proteção contra frio extremo.
- **Gabarito**: E.
- **Fonte**: Chapter 2, §2.24, p. 76 (PDF p. 89).
- **Justificativa técnica**: O projeto protege sistemas de reboque e admissão de ar.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C02-L019-05
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Rotação, força e potência.
- **Gabarito**: C.
- **Fonte**: Chapter 2, §2.26, p. 78 (PDF p. 91).
- **Justificativa técnica**: 1,5²=2,25; 1,5³=3,375, sob as hipóteses do modelo.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C03-L019-01
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Função do rebocador de popa.
- **Gabarito**: E.
- **Fonte**: Chapter 3, §3.2.1, p. 84 (PDF p. 97).
- **Justificativa técnica**: O rebocador de ré controla rumo e seguimento.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C03-L019-02
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Empuxo mínimo e espringue.
- **Gabarito**: C.
- **Fonte**: Chapter 3, §3.3.2, p. 88 (PDF p. 101).
- **Justificativa técnica**: A técnica só é segura quando a espia suporta o empuxo aplicado.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C03-L019-03
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Lavagem gradual do gelo.
- **Gabarito**: B.
- **Fonte**: Chapter 3, §3.3.6, p. 90 (PDF p. 103).
- **Justificativa técnica**: O fluxo propulsivo varre gelo, respeitando a carga da espia.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C03-L019-04
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Faixa de quebra de gelo.
- **Gabarito**: D.
- **Fonte**: Chapter 3, §3.3.7, p. 92 (PDF p. 105).
- **Justificativa técnica**: A obra recomenda 20–40 m das extremidades.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C03-L019-05
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Submarino em boia.
- **Gabarito**: A.
- **Fonte**: Chapter 3, §3.4, p. 98 (PDF p. 111).
- **Justificativa técnica**: A proa é aproximada suavemente da boia.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C04-L019-01
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Centro lateral de pressão.
- **Gabarito**: A.
- **Fonte**: Chapter 4, §4.2.1, p. 102 (PDF p. 115).
- **Justificativa técnica**: A posição do centro de pressão altera os braços de momento.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C04-L019-02
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Boca e estabilidade de rumo.
- **Gabarito**: E.
- **Fonte**: Chapter 4, §4.2.3, p. 108 (PDF p. 121).
- **Justificativa técnica**: A boca elevada pode prejudicar a estabilidade de rumo.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C04-L019-03
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Gelo e estabilidade.
- **Gabarito**: D.
- **Fonte**: Chapter 4, §4.2.3, p. 110 (PDF p. 123).
- **Justificativa técnica**: Gelo elevado pode reduzir a reserva de estabilidade.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C04-L019-04
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: SAFETUG em ondas.
- **Gabarito**: C.
- **Fonte**: Chapter 4, §4.5.2, p. 130 (PDF p. 143).
- **Justificativa técnica**: O estudo integra ondas, degradação propulsiva e interação.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C04-L019-05
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Comunicação pré-testada.
- **Gabarito**: B.
- **Fonte**: Chapter 4, §4.7, p. 132 (PDF p. 145).
- **Justificativa técnica**: Teste prévio e readback reduzem ambiguidades.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C05-L019-01
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Comprimento e momento de vento.
- **Gabarito**: D.
- **Fonte**: Chapter 5, §5.2.2, p. 136 (PDF p. 149).
- **Justificativa técnica**: A expressão contém LBP linearmente.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C05-L019-02
- **Alteração**: Substituído cálculo linear com calado já coberto no L007 por momento de corrente proporcional a LBP²..
- **Tema**: Comprimento ao quadrado no momento de corrente.
- **Gabarito**: B.
- **Fonte**: Chapter 5, §5.2.3, p. 138 (PDF p. 151).
- **Justificativa técnica**: O momento de corrente é proporcional a LBP²; portanto 1,20² = 1,44, ou aumento de 44%, mantidas as hipóteses.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C05-L019-03
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Força de ondas curtas.
- **Gabarito**: C.
- **Fonte**: Chapter 5, §5.2.4, p. 140 (PDF p. 153).
- **Justificativa técnica**: 112×150×4=67.200 kgf.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C05-L019-04
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Ar de partida.
- **Gabarito**: A.
- **Fonte**: Chapter 5, §5.3.4, p. 146 (PDF p. 159).
- **Justificativa técnica**: Partidas frequentes podem esgotar o ar.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C05-L019-05
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Redundância de tração.
- **Gabarito**: E.
- **Fonte**: Chapter 5, §5.3.8, p. 148 (PDF p. 161).
- **Justificativa técnica**: A perda de uma unidade remove 50% ou 25% do total.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C06-L019-01
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Interação em corrente.
- **Gabarito**: C.
- **Fonte**: Chapter 6, §6.2.3, p. 150 (PDF p. 163).
- **Justificativa técnica**: O fluxo relativo determina o campo de pressões.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C06-L019-02
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Escape sob a proa.
- **Gabarito**: D.
- **Fonte**: Chapter 6, §6.3.2, p. 156 (PDF p. 169).
- **Justificativa técnica**: A força avante pode agravar o contato com o casco.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C06-L019-03
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Retinida inadequada.
- **Gabarito**: E.
- **Fonte**: Chapter 6, §6.3.5, p. 160 (PDF p. 173).
- **Justificativa técnica**: Retinida imprópria prolonga a exposição à zona perigosa.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C06-L019-04
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Interferência jato-skeg.
- **Gabarito**: A.
- **Fonte**: Chapter 6, §6.3.13, p. 166 (PDF p. 179).
- **Justificativa técnica**: A interferência reduz autoridade de governo.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C06-L019-05
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Resgate com dois tripulantes.
- **Gabarito**: B.
- **Fonte**: Chapter 6, §6.3.14, p. 170 (PDF p. 183).
- **Justificativa técnica**: O resgate deve ser possível com a guarnição disponível.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C07-L019-01
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Guincho convencional sob carga.
- **Gabarito**: B.
- **Fonte**: Chapter 7, §7.3.3, p. 182 (PDF p. 195).
- **Justificativa técnica**: Muitos guinchos não engatam seguramente com cabo carregado.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C07-L019-02
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Liberação de emergência.
- **Gabarito**: A.
- **Fonte**: Chapter 7, §7.3.3, p. 186 (PDF p. 199).
- **Justificativa técnica**: Liberação rápida não deve causar desenrolamento desgovernado.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C07-L019-03
- **Alteração**: Substituído critério numérico de arames rompidos já coberto no L009 por irreparabilidade de dano mecânico em cabo de aço..
- **Tema**: Dano irreparável em cabo de aço.
- **Gabarito**: D.
- **Fonte**: Chapter 7, §7.5.2.1, p. 190 (PDF p. 203).
- **Justificativa técnica**: O autor observa que os danos mecânicos em cabos de aço não são reparáveis; em caso de dúvida sobre sua gravidade, deve-se retirar e substituir o cabo.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C07-L019-04
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: MBS com e sem olhal.
- **Gabarito**: E.
- **Fonte**: Chapter 7, §7.5.3, p. 194 (PDF p. 207).
- **Justificativa técnica**: A resistência efetiva inclui terminações e conexões.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C07-L019-05
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Histórico do cabo.
- **Gabarito**: C.
- **Fonte**: Chapter 7, §7.5.3, p. 200 (PDF p. 213).
- **Justificativa técnica**: Rastreabilidade ajuda a estimar degradação.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C09-L019-01
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Prova de escolta em mar calmo.
- **Gabarito**: E.
- **Fonte**: Chapter 9, §9.2, p. 244 (PDF p. 257).
- **Justificativa técnica**: Ensaios favoráveis podem superestimar limites operacionais.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C09-L019-02
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Escolta tandem escalonada.
- **Gabarito**: C.
- **Fonte**: Chapter 9, §9.6.1, p. 250 (PDF p. 263).
- **Justificativa técnica**: O procedimento prevê escalonamento longitudinal.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C09-L019-03
- **Alteração**: Substituído ângulo de cabo de 90° já coberto no L016 por análise dos braços horizontais de equilíbrio em escolta indireta..
- **Tema**: Braços de momento na escolta indireta.
- **Gabarito**: A.
- **Fonte**: Chapter 9, §9.6.2, p. 252 (PDF p. 265).
- **Justificativa técnica**: A relação entre os braços horizontais x e y condiciona o empuxo lateral requerido para equilibrar a força hidrodinâmica e, portanto, a força disponível no cabo.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C09-L019-04
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: Leme com hélice parada.
- **Gabarito**: B.
- **Fonte**: Chapter 9, §9.6.2, p. 254 (PDF p. 267).
- **Justificativa técnica**: 0,53×200=106 tf; fator indicativo do estudo.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

### ANV-HENSEN-C09-L019-05
- **Alteração**: Questão nova; nenhuma reescrita posterior identificada.
- **Tema**: MBS BV em escolta.
- **Gabarito**: D.
- **Fonte**: Chapter 9, §9.6.2, p. 260 (PDF p. 273).
- **Justificativa técnica**: 2×130=260 tf, sujeito à versão aplicável da regra.
- **Validação**: cinco alternativas distintas; referência textual localizada; gabarito estruturalmente coerente com a alternativa; homologação técnica independente pendente.

## Preservação, testes e pendências

- A inclusão e revisão do L019 não alteraram lotes 001–018, os 119 históricos em quarentena, os 51 históricos ativos, validadores, workflows ou configurações de deploy.

- Testes executados: verificações em memória de integridade estrutural, distribuição, 40 âncoras de fonte, comparação literal e triagem lexical com 720 itens anteriores.

- Pendências: conferência visual de todas as páginas, revisão editorial independente, cotejo conceitual completo dos históricos e do banco principal, testes locais npm e aprovação de todos os gates no HEAD final, inclusive Preview Vercel.

- **Status editorial**: `pending_editorial_review`. **Não realizar merge nem deploy até a aprovação de todos os gates e a homologação editorial.**

## Checkpoint de correção após execução dos gates

- `ANV-HENSEN-C05-L019-03`: a primeira execução de **Full Question Bank Audit** falhou no `HENSEN_SOURCE_GUARD` por `explicação ausente ou insuficiente`. A justificativa técnica foi ampliada no commit `113d8a8c48b7a409c3b884f3a43ca912637ebe19`, sem mudar enunciado, alternativas ou gabarito.
- Confronto adicional dos 40 itens com os **170 históricos HENSEN** nos dez blocos 006, 007, 008, 010, 013, 016, 019, 021, 022 e 023: 0 colisões literais e 0 alertas lexicais Jaccard ≥ 0,33. Preservados 119 em quarentena e 51 ativos.
- Revisão semântica independente, testes npm, inspeção visual integral e todos os gates no HEAD final ainda precisam ser confirmados.
