# Lote 025 — transmissão elétrica selsyn

Base remota f922ffb50582182ab496d2491feb56d57362f547; PR #172 aberto/draft.
HEAD remoto, CHECKPOINT.json e relatório 024 consultados antes de editar.
Fast-forward com árvore rastreada limpa, preservando temporários. Inspeção de
processos disponível não identificou outro escritor do repositório; publicação
protegida por lease. Prompt-Mestre/benchmark mantidos, sem refazer lotes.

## Fonte primária e limites

Fonseca, Arte Naval v.2, 8ª ed., 2019, art.11.5.c pp.760–761/PDF121–122;
contrastes 11.5.a/b p.760, 11.6 pp.761–763 e 11.7.b p.763. Contexto do
servomotor hidrelétrico em 11.4.c/d pp.758–759. Texto e imagens completas das
seis páginas pp.758–763/PDF119–124 inspecionados, incluindo figuras11-3/11-4
(servomotores) e 11-5 (telemotor hidráulico, figura em página horizontal).
As questões não exigem imagem ausente nem leitura de escala. Não foi inventado
um diagrama selsyn a partir da figura do telemotor hidráulico.
SHA256 recalculado do volume:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; livro/imagens privados.

O recorte descreve dois motores de corrente alternada, transmissor/motor-piloto
e receptor. Condutores elétricos levam o comando; o rotor receptor acompanha
velocidade e deslocamento angular do transmissor. O receptor atua no mecanismo
de controle do servomotor e pode controlar a bomba no exemplo hidrelétrico.
Isso não equivale a afirmar que o par selsyn fornece diretamente toda a potência
para movimentar o leme. A transmissão roda-controle e a transmissão máquina-leme
são etapas distintas. A existência de uma bomba hidráulica a jusante não muda
para hidráulico o meio elétrico que transmite a ordem no caso apresentado.

Contrastes conferidos: telemotor com cilindros e tubos de cobre cheios de
líquido; transmissão mecânica rígida com vergalhões/eixos; flexível por
gualdropes; quadrantal por roda dentada/setor na etapa máquina-leme. Não se
atribuem ao selsyn os tubos do telemotor ou a linha de eixos da transmissão
rígida. Não se extrapola a descrição da obra para precisão, tolerância dinâmica,
certificação, fabricante ou procedimento de manutenção de qualquer sistema real.
Sem números de desempenho, cálculo ou alegação de vigência normativa.

## Precedência e identidade

ANV-0116 prevalece na restauração old-080 já consumida antes deste lote. O
principal contém composição sobre propulsão azimutal e outros temas com
provenance.method pscpp-style-upgrade-v3. Seus campos foram preservados,
sem trocar conteúdo ou estado. Não se supôs active=false/quarentena onde não
há essas flags. Divergência global principal/restauração permanece documentada.

ANV-0814 e ANV-0972 prevalecem no principal; os três IDs não constam de
notebook-complete-stems. answer-leak-v1 retirava as quatro proposições de
0116 e convertia 0814 em comando genérico. Fontes prevalentes corrigidas;
comandos técnicos explícitos, sem aspas longas. Runtime regenerado e igualdade
fonte/runtime conferida, sem reformulação posterior. Nenhum normalizador,
filtro ou gate alterado. Contrato direto acrescido apenas 0814 e 0972.
IDs/tópicos e gabaritos A/D/B preservados; formatos principais B/A/A. Rótulos
legados Associação conceitual/Situação aplicada mantidos nos dois diretos para
compatibilidade. Tracking.section e localizadores detalhados.

## ANV-0116 — julgamento individual

I verdadeira: arquitetura de dois motores CA, transmissor pela roda e receptor
no controle, em 11.5.c. II verdadeira: acompanhamento de velocidade e ângulo do
rotor transmissor; emprego no controle da bomba na p.761. III falsa: diferença
de pressão por tubos cheios de líquido caracteriza o telemotor, 11.6. IV falsa:
eixos, juntas universais e engrenagens cônicas correspondem à transmissão
mecânica rígida, 11.5.a. Vetor V/V/F/F; conjunto completo I/II.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/II | Único conjunto completo das verdadeiras |
| B | I/III | III falsa; falta II |
| C | I/IV | IV falsa; falta II |
| D | III/IV | Ambas falsas; faltam I/II |
| E | II/III | III falsa; falta I |

## ANV-0814 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Falsa: telemotor hidráulico com pressão em líquido, 11.6 |
| B | Falsa: transmissão mecânica rígida, 11.5.a |
| C | Falsa: transmissão mecânica flexível, 11.5.a |
| D | Única correta: par transmissor/receptor ligado por condutores, 11.5.c |
| E | Falsa: quadrantal da máquina à cana do leme, 11.7.b |

## ANV-0972 — julgamento individual

O caso delimita a transmissão da roda ao controle; descreve condutores e
rotores autossincronizados, embora o receptor controle uma bomba hidráulica.
Não exige inferir toda a instalação do navio a partir de uma palavra isolada.

| Opção | Julgamento |
|---|---|
| A | Falsa: confunde o servomotor hidráulico com o meio de transmissão do comando |
| B | Única correta: transmissão elétrica selsyn, 11.5.c |
| C | Falsa: não há linha de eixos transmitindo o comando descrito |
| D | Falsa: não há gualdropes transmitindo o comando descrito |
| E | Falsa: corresponde à etapa máquina-leme, fora da ligação perguntada |

As antigas alternativas hidráulica/telemotor foram diferenciadas na nova 0972,
evitando dois rótulos para um mesmo distrator. Quinze justificativas específicas.
L2/Médio proposto: identificação de arquitetura e distinção causal das etapas,
sem simular dificuldade psicométrica ou declarar calibração histórica aprovada.
O exemplo aplicado não foi promovido artificialmente a decisão operacional L4.

## Sobreposição e pendências

Busca old-080 e título selsyn no inventário encontrou estes três registros,
lidos individualmente. Compartilham a competência; não devem coexistir na mesma
prova. A busca não prova ausência de variantes com outros códigos. Revisão
semântica global e prevenção de coexistência continuam pendentes. Quantidade de
modelos existente preservada, sem criar/remover IDs nem alterar o subconjunto
com regime chapter-item-3-models. O grupo 12.70 registrado no lote024 continua
pendente, sem revisão ou aprovação indevidamente contada neste lote.

Acumulado 44 correções primárias/47 conferências bibliográficas parciais; ZERO
aprovações editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json,
conferências em CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Rechecagem independente,
alinhamento oficial ao programa/edital, cobertura, estados e offline/produção
pendentes. REVISOES_EDITORIAIS.jsonl não recebeu aprovações sem evidência final.
Resultados reais em TESTES_E_EVIDENCIAS.md. Sem merge/deploy/dados de usuários.
