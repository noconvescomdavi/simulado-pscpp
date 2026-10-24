# Correções de integração — etapa em andamento

## IDs duplicados no carregamento de Arte Naval

Antes: o carregador concatenava o banco principal e o arquivo complementar
do capítulo 9, mesmo quando o ID já estava incorporado ao principal. Foram
medidos 102 IDs repetidos dentro do consumidor de cadernos. As versões
complementares ainda utilizam `letter` em alternativas onde o principal usa
`key`, além de possuírem metadados editoriais diferentes.

Correção: dar precedência ao registro do banco principal e acrescentar somente
IDs complementares ausentes. Nenhum arquivo original ou ID foi apagado.
Cadernos: 12.204 → 12.102 ocorrências. Arte Naval: 2.230 → 2.128.
Simulado PSCPP: 1.984 → 1.984. IDs únicos entre consumidores: 13.715.
Essa correção elimina uma duplicação de carregamento; não aprova o conteúdo.

## Fingerprints incompletos

O gerador de cadernos importava o capítulo 9 em `data/pscpp/`, mas calculava
seu hash somente com diretórios/questions, extensions/restorations e uma
lista parcial de módulos. O gerador PSCPP também não incluía o conteúdo dos
subdiretórios approved-drive-blocks em sua lista manual de hashes.

Correção: incluir recursivamente a árvore de imports locais estáticos dos
carregadores no fingerprint, conservando os demais arquivos já considerados.
O teste demonstra invalidação quando uma dependência indireta JSON muda,
e estabilidade quando apenas um arquivo alheio muda.

## Questões

Acumulado vigente após lote 044: **98 IDs corrigidos distintos**, 101 conferências bibliográficas parciais, zero aprovações finais. Relação completa e sem recontagem em CHECKPOINT.json e CORRECOES_RUNTIME.json; números dos parágrafos de lotes abaixo são históricos. Substituídas: 0; novas: 0; quarentenadas nesta etapa: 0.
Lote 002: `REVISAO_ARTE_NAVAL_LOTE_002.md`, fonte primária arts. 8.2/8.14/8.19–8.20.
Corrigidas as restaurações prevalentes, mantendo conceitos efetivamente servidos,
IDs, opções e gabaritos. Dezesseis proposições renderizadas no teste de regressão.
Conferência e justificativas completas em `REVISAO_ANV_0005.md`. Fonte primária
volume 1, art. 8.18, p. impressa 543/PDF 541; apoio diagnóstico nos arts. 8.2 e
8.7. Corrigido distrator ambíguo e preservadas quatro proposições na apresentação.
ID, opções e gabarito preservados. Não há aprovação de release: rechecagem e
alinhamento final ao programa/edital ainda pendentes.
Não atribuir aprovação aos registros apenas por preservação ou triagem.
As pendências editoriais são mantidas nos relatórios e nos gates.

Lote 003: `REVISAO_ARTE_NAVAL_LOTE_003.md`. Duas correções adicionais,
art. 12.32 v.2 (mudar bordo) e art. 2.27 v.1 (reserva de flutuabilidade).
ANV-0020 vem diretamente do principal; ANV-0021 vem da restauração prevalente.
Corrigida ambiguidade técnica da antiga IV de ANV-0021, além da perda das
proposições. Cinco alternativas e gabaritos E/A preservados. Total de nove
conferências parciais; zero aprovações finais. Nenhum original apagado.

## Lote 004

ANV-0025 corrigida na restauração prevalente com suporte no art. 10.1 de
Arte Naval v.2, 8ª ed., pp. 705–706/PDF 66–67. Mantidos ID, competência,
cinco opções e resposta E. Quatro proposições visíveis e alternativas
justificadas; revisão e sobreposições em REVISAO_ARTE_NAVAL_LOTE_004.md.
Acumulado: sete correções primárias, dez conferências parciais, zero
aprovações finais. Nenhuma produção alterada.

## Lote 005 — ANV-0037

Restauração prevalente corrigida com arts. 12.19/12.21, pp. 819–820/PDF 180–181. Quatro proposições preservadas no HTML; vetor V/F/F/V, resposta B única e cinco justificativas. Oitava correção primária, décima primeira conferência parcial, zero aprovações finais. Sem merge. Detalhes em REVISAO_ARTE_NAVAL_LOTE_005.md.

Lote 006: `REVISAO_ARTE_NAVAL_LOTE_006.md`. Corrigidas ANV-0038/0039/0041
nas restaurações prevalentes, com fontes primárias e figuras conferidas.
Acumulado: onze correções, quatorze conferências parciais, zero aprovações finais.
Triagem: 242 candidatos sem proposições e 77 por localizador.

Lote 007: `REVISAO_ARTE_NAVAL_LOTE_007.md`. Três correções primárias adicionais;
uma reduz a triagem de proposições e duas melhoram distratores e justificativas
em questões já estruturadas. Acumulado: 14 correções, 17 conferências parciais,
zero aprovações finais. Preservados IDs/opções/gabaritos C/D/E e matriz.

Lote 008: `REVISAO_ARTE_NAVAL_LOTE_008.md`. Corrigida ANV-0046 na restauração
prevalente, com art. 11.4.c, pp. 758–759 e fig. 11-4 conferidos.
Gabarito A e cinco opções preservados; quatro proposições e cinco justificativas.
Acumulado: 15 correções, 18 conferências parciais, zero aprovações finais.
Triagem: 240 candidatos sem proposições, 77 localizadores.

## Lote 009

ANV-0047 corrigida na restauração prevalente, fonte primária pp. 832/835 de Arte
Naval v. 2. Quatro proposições F/V/F/V, gabarito B, cinco justificativas; preservadas
identidade ativa, opções e matriz. 16 correções primárias e 19 conferências parciais
acumuladas. Não representam aprovação final. Relatório REVISAO_ARTE_NAVAL_LOTE_009.md.

## Lote 010

ANV-0048 corrigida na restauração prevalente: interação na ultrapassagem. Fonte
primária Arte Naval v. 2, art. 12.62, p. 888, figura 12-37 conferida visualmente.
Vetor V/V/F/F, gabarito C e opções preservados, cinco justificativas. Acumulado:
17 correções primárias, 20 conferências parciais; zero aprovações finais.
Triagem: 238 candidatos sem proposições e 77 localizadores.
Relatório REVISAO_ARTE_NAVAL_LOTE_010.md.

## Lote 011 — ANV-0049

Corrigida a restauração prevalente de círculo de giro no fundeio com suporte no
art. 12.40, p. 843 (PDF 204), Arte Naval v. 2, 8ª edição. Quatro proposições
F/V/F/V e cinco justificativas; gabarito D preservado. Referência delimitada e
texto efetivo conferido no pipeline. Acumulado: 18 correções primárias, 21
conferências parciais; zero aprovações finais. Sem merge.

## Lote 012 — ANV-0050

Corrigida restauração prevalente de centro de gravidade do navio, com arts.
2.21–2.22, p. 82/PDF 82, figura 2-7 conferida. Vetor V/F/V/F, gabarito E
e cinco alternativas preservados, cinco justificativas e referência rastreável.
Texto sobrevive ao pipeline sem normalizador ou teste relaxado. Relatório
REVISAO_ARTE_NAVAL_LOTE_012.md. Acumulado: 19 correções primárias e 22
conferências bibliográficas parciais, zero aprovações finais. Próxima ANV-0064.

## Lote 013 — Correção ANV-0064

Nó de escota dobrado conferido em Arte Naval v. 1, 8ª ed., art. 8.40, p. 552/PDF 550 e figura 8-36. Restauração corrigida, ambiguidade da antiga IV eliminada; quatro proposições V/V/F/F, gabarito D e cinco justificativas. Vinte correções primárias e 23 conferências parciais; zero aprovações finais. Triagem: 236 → 235 candidatos sem proposições; 77 localizadores mantidos. Próxima falha ANV-0067. Sobreposição com ANV-0762 registrada, sem aprovação da vizinha. Ver REVISAO_ARTE_NAVAL_LOTE_013.md.

## Lote 014 — Correções ANV-0067 e ANV-0765

Quartel do tornel conferido em Arte Naval v. 2, 8ª ed., art. 10.12.a–c, pp. 720–721/PDF 81–82 e figura 10-12. Corrigidas nomenclatura e posição da extremidade ligada à âncora. Restauração ANV-0067: F/V/V/F, chave B e cinco justificativas. Fonte principal ANV-0765: cinco descrições e chave E preservada, com cinco justificativas. Acumulado: 22 correções primárias e 25 conferências parciais; zero aprovações finais. Triagem: 235 → 234 sem proposições; 77 localizadores. Próxima falha ANV-0068. Variantes da mesma competência identificadas; impedimento global de coexistência permanece pendente. Ver REVISAO_ARTE_NAVAL_LOTE_014.md.

## Lote 015 — Correção ANV-0068

Aparelho de governo conferido em Arte Naval v. 2, 8ª ed., arts. 11.1–11.2, pp. 755–756/PDF 116–117 e figura 11-1. Restauração prevalente corrigida, quatro proposições F/V/F/V, chave C e cinco justificativas. Acumulado: 23 correções primárias e 26 conferências parciais; zero aprovações finais. Triagem: 234 → 233 candidatos sem proposições; 77 localizadores mantidos. Próxima falha ANV-0073. ANV-0766/0956 lidas integralmente; sobreposição registrada sem correção/aprovação das vizinhas. Ver REVISAO_ARTE_NAVAL_LOTE_015.md.

## Lote 016 — Correção ANV-0073

Parada com máquina atrás toda força conferida em Arte Naval v. 2, 8ª ed., arts. 12.7–12.8, pp. 805–808/PDF 166–169 e figuras 12-6–12-7. Restauração corrigida, quatro proposições V/F/F/V, chave C e cinco justificativas. Eliminada ambiguidade dos distratores; não se generaliza guinada nem distância de parada. Acumulado: 24 correções primárias e 27 conferências parciais; zero aprovações finais. Triagem: 233 → 232 sem proposições; 77 localizadores. Próxima falha confirmada ANV-0076. Vizinha ANV-0771 lida; sobreposição e revisão detalhada de sua explicação registradas, sem correção/aprovação da vizinha. Ver REVISAO_ARTE_NAVAL_LOTE_016.md.

## Lote 017 — Correção ANV-0076

Máquina de reboque conferida em Arte Naval v. 2, 8ª ed., art. 12.71, p. 909/PDF 270. Restauração corrigida, quatro proposições F/F/V/V, chave A e cinco justificativas. Eliminado distrator ambíguo: ajuste por tensão, soleca sob esticão e recolhimento do brando explicitados no contexto do mecanismo descrito. Acumulado: 25 correções primárias e 28 conferências parciais; zero aprovações finais. Triagem: 232 → 231 sem proposições; 77 localizadores. Próxima falha confirmada ANV-0085. Vizinha ANV-0774 lida; sobreposição registrada sem correção/aprovação da vizinha. Ver REVISAO_ARTE_NAVAL_LOTE_017.md.

## Lote 018 — Correção ANV-0085

Amarrar com regeira conferido em Arte Naval v. 2, 8ª ed., art. 12.51, p. 866/PDF 227. Restauração corrigida, quatro proposições F/V/F/V, chave E e cinco justificativas. Saída pela popa, finalidade de orientação e alternativas de fixação explicitadas; não se exige ancorote adicional. Acumulado: 26 correções primárias e 29 conferências parciais; zero aprovações finais. Triagem: 231 → 230 sem proposições; 77 localizadores. Próxima falha confirmada ANV-0092. Vizinha ANV-0783 lida; sobreposição registrada sem correção/aprovação da vizinha. Ver REVISAO_ARTE_NAVAL_LOTE_018.md.

## Lote 019 — fio fusível de reboque

Corrigidas individualmente ANV-0092/0790/0964, tópico old-141, com Fonseca v.2,
8ª ed., 2019, 12.73.c, p.911/PDF272. O fio indica aproximação do limite
de alongamento; não foi validada a antiga definição sacrificial. Distratores
conferidos também em 12.73.b/d/e/f, p.911–912. Restauração prevalente de 0092
e JSON principal de 0790/0964 corrigidos; keys B/E/D e três formatos preservados.
Cinco justificativas por registro, cálculo hipotético 100→126m = 26% e hashes
antes/depois documentados. Fonte/imagens privadas. Ver REVISAO_ARTE_NAVAL_LOTE_019.md.
Acumulado 29 correções/32 conferências parciais, zero aprovações finais.
Regressão: 29 deltas exatos, 104 proposições renderizadas, 15 opções diretas
preservadas. Demais 12.073 cadernos e 1.984 PSCPP sem alteração efetiva.
Sem merge/deploy; revisão independente, programa oficial e deduplicação pendentes.

## Lote 020 — Almirantado e provas das amarras

Corrigidas individualmente ANV-0096/0794 e ANV-0097/0795, com Fonseca v.2,
8ª ed., 2019, 10.3.a (pp.707–708/PDF68–69) e 10.16.a–b (p.727/PDF88).
Textos, páginas e figuras de contexto inspecionados. Cepo, patas, proporções
e tradeoff operacional distinguidos; prova de resistência de todos os quartéis
a cerca de 2/3 da carga nominal diferenciada da ruptura de amostra de três
elos; exceção do aço estampado ao recozimento preservada. Removida condição
genérica de deformação não demonstrada no artigo citado.
Duas restaurações e duas diretas no principal, keys A/B/D/E, IDs e estilos
preservados; vinte justificativas específicas. Nenhum normalizador alterado.
Acumulado 33 correções/36 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_020.md e hashes em CORRECOES_RUNTIME.json.
Sobreposição entre variantes registrada; impedimento global de coexistência,
rechecagem independente e alinhamento oficial/programático pendentes. Sem merge/deploy.

## Lote 021 — atracação mediterrânea

ANV-0100 e ANV-0798 corrigidas individualmente com Fonseca, Arte Naval v.2,
8ª ed., 2019, 12.38, p.838/PDF199; continuação e figura 12-19 na p.839/PDF200
inspecionadas como contexto. Restituição das quatro proposições na restauração
prevalente e reformulação fundamentada da direta no principal. Keys E/C, IDs,
competência e formatos principais preservados; dez justificativas específicas.
Popa ao cais/dois ferros a vante, restrição a fortes rajadas de través, posição
dos ferros para giro livre ao suspender, abertura aproximada de 50° e cálculo
do filame explicitados sem generalizar para todo navio/porto. Sem cálculo novo.
Acumulado 35 correções e 38 conferências parciais; zero aprovações finais.
Hashes em CORRECOES_RUNTIME.json; evidência em REVISAO_ARTE_NAVAL_LOTE_021.md.
Variantes compartilham competência; prevenção global de coexistência na mesma
prova, rechecagem independente e programa/edital oficiais pendentes. Sem merge/deploy.

## Lote 022 — corrente de descarga do hélice

ANV-0105/0803 corrigidas individualmente com Fonseca, Arte Naval v.2, 8ª ed.,
2019, arts.12.3/12.5/12.6.1, pp.795–798/PDF156–159. Textos, imagens, figuras
12-2a/b/c e tabela de contexto conferidos; hash do PDF recalculado.
Explicitados um hélice, leme a ré do propulsor, repouso inicial e modelo sem
vento/corrente externos. Distintas descarga, sucção e esteira; guinada inicial
pela descarga sem exigir seguimento prévio; referência à necessidade de
experiências por navio mantida. Sem cálculo ou valores operacionais inventados.
Restauração prevalente de 0105 e direta principal de 0803, keys E/C e IDs
preservados; dez justificativas. Locator/tracking.section detalhados.
A versão principal de 0105, em quarentena e sobre outro conteúdo, foi preservada
com suas flags; a restauração já fazia parte do runtime antes deste lote.
Acumulado 37 correções/40 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_022.md e hashes em CORRECOES_RUNTIME.json.
Sem merge/deploy; estados globais, rechecagem independente, programa oficial
e deduplicação semântica/coexistência permanecem pendentes.


## Lote 023 — correr com o tempo

ANV-0108/0806 corrigidas individualmente com Fonseca v.2, 8ª ed., 2019,
12.86 pp.933–935/PDF294–296, contraste 12.85 p.932/PDF293. Texto e imagens
lidos; hash recalculado. Definição com mar na alheta e velocidade reduzida
ou abatimento com máquina parada e mar de popa, respeitadas as diferenças
de navios e condições de mar; rejeitada generalização operacional rígida.
Keys C/A, IDs e competência preservados; dez justificativas. Restauração
efetiva 0108 corrigida; versão principal em quarentena de outro tema intacta.
Objeto explícito no comando resolveu falso localizador na normalização;
quatro proposições persistem até HTML. Nenhum filtro global alterado.
Passagem da p.933 sobre duros/altura metacêntrica registrada para rechecagem,
sem validá-la nem usá-la como premissa. Par old-152 compartilha competência;
prevenção de coexistência e revisão semântica global pendentes.
Acumulado 39 correções/42 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_023.md e CORRECOES_RUNTIME.json.
Sem merge/deploy; oito gates seguem pendentes/falhos.


## Lote 024 — catenária do reboque

ANV-0111/0809 corrigidas individualmente com Fonseca v.2, 8ª ed., 2019,
12.70 pp.907–909/PDF268–270; contexto 12.69 pp.906–907 e contraste 12.71 p.909.
Texto/imagens das quatro páginas e figura12-47 conferidos; hash recalculado.
Distintas elasticidade própria da fibra e adicional pela curvatura; explicitado
o risco de catenária excessiva tocar o fundo em reboque comprido de amarra.
Keys A/D, IDs e formatos B/A preservados; dez justificativas. Fonte prevalente
0111 corrigida; principal de outro tema e provenance insegura intacto. Nenhum
normalizador ou filtro alterado. Três modelos do item12.70 preservados, defeitos
e sobreposição registrados para revisão; nenhum contado como aprovação/check.
Acumulado 41 correções/44 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_024.md e CORRECOES_RUNTIME.json.
Rechecagem independente, alinhamento oficial, estados globais e semântica pendentes.
Sem merge/deploy; oito gates seguem pendentes/falhos.


## Lote 025 — transmissão elétrica selsyn

ANV-0116/0814/0972 corrigidas individualmente com Fonseca v.2, 8ª ed., 2019,
11.5.c pp.760–761/PDF121–122, contrastes 11.5.a/b, 11.6 e 11.7.b. Texto e
imagens pp.758–763/PDF119–124, figuras11-3/11-4/11-5 conferidos; hash recalculado.
Distintos comando elétrico transmissor/receptor e potência para acionar o leme.
Expresso emprego no controle de bomba de servomotor hidrelétrico sem confundir
com transmissão hidráulica do comando. Diferenciados telemotor, eixos, gualdropes
e quadrantal. Sem precisão/fabricante/desempenho inventados.
Keys A/D/B, IDs e formatos B/A/A preservados; quinze justificativas. Restauração
0116 corrigida; principal divergente de outro tema e seus campos intactos.
Nenhum normalizador/filtro/gate alterado; contrato direto acrescido só 0814/0972.
Acumulado 44 correções/47 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_025.md e CORRECOES_RUNTIME.json.
Rechecagem independente, versão oficial, estados globais e semântica pendentes.
Sem merge/deploy; oito gates seguem pendentes/falhos.


## Lote 026 — classificação geral dos navios

ANV-0125/0823/0975/1034 corrigidas individualmente com Fonseca v.1, 8ª ed.,
2019, 3.1 na abertura p.[129]/PDF129. Abertura sem algarismo impresso;
paginação inferida pela sequência antes da p.130 e explicitada em source.page_note.
Texto/imagens PDF129–131 conferidos; SHA256 recalculado. Distintos finalidade,
material do casco e propulsão, incluindo a categoria sem propulsão. Casos
hipotéticos sem inferir regras legais de registro/habilitação.
Keys E/C/E/D, IDs e formatos B/A/A/A preservados; vinte justificativas.
Restauração ANV-0125 corrigida; principal divergente e demais registros intactos.
Redação local resolveu sobreposição lexical que substituía os casos ANV-0975/1034;
nenhum normalizador/filtro/gate alterado. Contrato direto só +0823/0975/1034.
Acumulado 48 correções/51 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_026.md e CORRECOES_RUNTIME.json.
Rechecagem independente, oficialidade/edital, estados e semântica pendentes.
Sem merge/deploy; oito gates seguem pendentes/falhos.


## Lote 027 — abatimento na curva

ANV-0128/0826/0976 corrigidas individualmente com Fonseca v.2, 8ª ed., 2019,
12.56.1.f p.875/PDF236; contrastes a–g pp.874–875 e contexto p.876. Texto,
imagens e figuras12-31/12-32 conferidos; SHA256 recalculado. Distintos fase
inicial, bordo contrário e direção normal ao rumo inicial; avanço, afastamento,
diâmetro tático e ângulo de deriva utilizados como distratores pertinentes.
Não se extrapolou a explicação causal antiga nem posição universal do centro
de giro; caso classifica observação dada, sem prever valor do caimento.
Keys C/A/A, IDs e formatos B/A/A preservados; quinze justificativas.
Restauração ANV-0128 corrigida; principal divergente e demais registros intactos.
Falso positivo de continuidade em ANV-0976 corrigido localmente; runtime/IDs
reconciliados. Nenhum normalizador/filtro/gate relaxado; contrato só +0826/0976.
Acumulado 51 correções/54 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_027.md e CORRECOES_RUNTIME.json.
Rechecagem independente, versão oficial, estados e semântica pendentes.
PR informou mergeable=false no preflight; causa não inferida, sem tentativa
de merge. Sem merge/deploy; oito gates seguem pendentes/falhos.


## Lote 028 — amarração com dois ferros

ANV-0129/0827 corrigidas individualmente com Fonseca v.2, 8ª ed., 2019,
12.46.1 pp.856–858/PDF217–219 e 12.48 pp.864–865/PDF225–226. Texto/imagens e
figuras 12-21/12-22/12-23 conferidos; contexto 12.49 e figura 12-27 inspecionados.
SHA256 recalculado. Geometria/proa entre ferros e área restrita distinguidas
de imobilidade. Divisão igual de esforço não presumida na condição em que a
obra indica uma amarra portando. Anilho condicionado à tensão e à vigilância.
Sem filame/ângulo/tensão admissível inventados ou obrigação portuária atual.
Keys D/B, IDs e formatos B/A preservados; dez justificativas.
Restauração 0129 corrigida; principal divergente em quarentena e todos seus
campos/flags intactos. Nenhum normalizador/filtro/gate alterado; contrato só +0827.
Acumulado 53 correções/56 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_028.md e CORRECOES_RUNTIME.json.
Rechecagem independente, versão oficial, estados e semântica pendentes.
Sem merge/deploy; oito gates seguem pendentes/falhos.


## Lote 029 — hélice de passo controlável

ANV-0131/0829/0977 corrigidas individualmente com Fonseca v.2, 8ª ed., 2019,
art.12.18 pp.818–819/PDF179–180. Texto e imagens cobrindo o artigo inteiro
conferidos; nenhuma figura requerida. SHA256 recalculado. Mecanismo hidráulico,
inversão do passo sem inversão da máquina e adequação de potência/combustível
à carga no mesmo RPM. Exemplo de parada de alguns navios-varredores não
universalizado; sem parâmetros de fabricante ou comando de instalação real.
Quinze justificativas, keys A/D/B e IDs preservados, formatos B/A/A.
Restauração 0131 corrigida; principal concorrente de cabo de leva integralmente
intacto, sem inferir flags ausentes. Nenhum ID ativado/removido. Contrato
direto só +0829/0977; normalizadores/filtros/gates sem alteração.
Acumulado 56 correções/59 conferências parciais, zero aprovações finais.
Ver REVISAO_ARTE_NAVAL_LOTE_029.md e CORRECOES_RUNTIME.json. Rechecagem
independente, versão oficial, estados e semântica pendentes. Sem merge/deploy.


## Lote 030 — saia da máquina de suspender

ANV-0134/0832/0978 corrigidas individualmente com Fonseca v.2, 8ª ed., 2019,
10.28 p.738 e 10.29.b–g pp.740–742; referência principal 10.29.e p.741/PDF102.
Texto/imagens PDF99–103 e figuras 10-23a/10-23b conferidos; SHA256 recalculado.
Saia lisa para espias/cabos distinguida da coroa dentada para elos, embreagem,
freio e linguete. Nenhum procedimento de pinos/freio ou limite de carga de
instalação real inventado. Quinze justificativas; keys D/B/C, IDs e formatos
B/A/A preservados. L2/Médio proposto para 0134/0832; L1/Fácil para 0978,
identificação contextual sem promover artificialmente a decisão operacional.
Restauração 0134 corrigida; principal concorrente de prova de ruptura/misto
integralmente intacto, sem inferir flags ausentes. Nenhum ID ativado/removido.
Pré-checagem 0978 acusou continuidade lexical; comando local ajustado para
eixo vertical antes da geração/registro. Contrato direto só +0832/0978;
normalizadores/filtros/gates sem alteração. Acumulado 59 correções/62
conferências parciais, zero aprovações finais. Ver relatório 030 e ledger.
Rechecagem independente, versão oficial, estados e semântica pendentes.
Sem merge/deploy/dados de usuários.


## Lote 031 — reboque a contrabordo

ANV-0138/0836 corrigidas individualmente com Fonseca v.2, 8ª ed., 2019,
art.12.80 no corpo, p.923/PDF284. Texto/imagem do artigo, sumário PDF13 e
p.924/PDF285 conferidos; SHA256 recalculado. Sumário lista contrabordo 12.81,
mas corpo 12.80: divergência visual registrada em source.numbering_note e
evidências, sem inferir errata oficial nem renumerar modelos da cobertura.
Alheta, defensas, espias e bordo interno da curva fechada distinguidos de
ligação afastada e bordo externo. Alegação legada de baixa velocidade não
atribuída ao recorte sem suporte; sem limite numérico ou projeto de instalação
real inventado. Dez justificativas, keys C/A e formatos B/A preservados.
L2/Médio proposto sem calibração psicométrica ou decisão L4. Restauração 0138
corrigida; principal concorrente afastamento/misto intacto, sem inferir flags
ausentes. Nenhum ID ativado/removido. Contrato direto só +0836; nenhum
normalizador/filtro/gate alterado. Acumulado 61 correções/64 conferências
parciais, zero aprovações finais. Ver REVISAO_ARTE_NAVAL_LOTE_031.md e ledger.
Comando 0836 delimitado a uma única curva fechada após a primeira validação;
geração/hashes/regressão/catálogo/build repetidos. Build inicial preservado
como intermediário, sem aprovar a redação posterior.
Rechecagem independente, versão oficial, estados e semântica pendentes.
Sem merge/deploy/dados de usuários.


## Lote 032 — volta de fiel singela e impedimento de fonte

ANV-0143/0841/0981 corrigidas individualmente com Fonseca v.1, 8ª ed., 2019,
8.7 p.538/PDF536 e figura 8-6 p.539/PDF537; contrastes 8.5/8.6/8.8/8.9
e texto/imagens pp.537–539/PDF535–537 conferidos. SHA256 recalculado. Dois
cotes opostos, chicotes contrários, execução pelo chicote/seio e condição de
tensão/remate distinguidos de fiador, cote, dobrada e volta redonda e cotes.
Quinze justificativas; keys C/A/A, IDs e formatos B/A/A preservados. L2/Médio
proposto para 0143/0841; L1/Fácil para 0981, sem calibração aprovada ou decisão L4.
Restauração 0143 corrigida; principal concorrente nó torto intacto, flags
ausentes não inferidas. Nenhum ID ativado/removido ou normalizador/filtro/gate
relaxado; contrato direto só +0841/0981. Acumulado 64 correções/67 conferências
parciais, zero aprovações finais. Ver REVISAO_ARTE_NAVAL_LOTE_032.md.

ANV-0142/0840 não alteradas: volume 2 anuncia propulsores em sumário 11.13, mas
corpo 11.13 p.779 trata de aparelho fixo. Busca e limitações documentadas em
BUSCA_FONTE_PROPULSORES_032.json; zero conferências de conteúdo/aprovações
para o par. Sem concluir busca em toda bibliografia, não se declarou
irrecuperabilidade nem se aplicou quarentena ou troca silenciosa de obra/
competência. Próxima candidata independente 0145; falha geral continua 0142.
Manifesto e inventário de fontes anotados, sem certificar integralmente o livro.
Rechecagem independente, fonte pendente, versão oficial, estados, semântica
e offline/produção pendentes. Sem merge/deploy/dados de usuários.


## Lote 033 — relatório individual

| ID | Defeito encontrado | Correção concreta | Fonte verificada | Gabarito |
|---|---|---|---|---|
| ANV-0145 | A restauração prevalente tinha redação genérica e afirmações próximas de definições literais. O reformulador answer-leak-v1 removia as quatro proposições, deixando opções por conjuntos sem os itens a julgar. | Reescritas I–IV: contraste elétrico, elementos rígidos, juntas/engrenagens e contraste hidráulico. Explicação e cinco justificativas específicas; página impressa/PDF e hash adicionados. Fonte e runtime agora contêm o mesmo objeto, sem reformulação destrutiva. | v.2,11.5.a p.760/PDF121;11.5.b–c e11.6 pp.760–761/PDF121–122 | E mantido; F/V/V/F, somente II e III |
| ANV-0843 | O comando de identificação por definição sofria a mesma reformulação para pergunta bibliográfica genérica; alternativas curtas não testavam de forma homogênea a distinção de elementos e mudanças de direção. | Enunciado explícito sobre transmissão rígida; cinco opções reescritas para contrastar elementos e recursos de transmissão. Explicação e cinco justificativas, referência exata e hash adicionados. Objeto integral preservado no runtime. | Mesmos localizadores | C mantido |

Ambas são correções primárias parciais, não aprovações editoriais finais.
Propostas L2/Médio, sem alegação de calibração psicométrica ou histórica.
ANV-0145 antes rotulada Difícil; ajustada a Médio pela compreensão de distinções.
ANV-0843 mantém Médio. Formatos B/A, IDs, conceitos, filtros e opções A–E
preservados. Não há cálculos nem figura ausente necessária às respostas.


Detalhes de julgamento, precedência e limites em REVISAO_ARTE_NAVAL_LOTE_033.md. Acumulado: 66 correções, 69 conferências parciais, zero aprovações finais.


## Lote 034 — relatório individual

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0147 | A restauração prevalente misturava definições de assuntos distintos e recebia answer-leak-v1, que apagava I–IV, deixando conjuntos sem proposições. | Reescritas quatro proposições sobre a vedação e as falsas permissões por supervisão, escada paralela ou teste. Explicação e cinco justificativas específicas; referência, páginas, URL, hash e limites de versão. Carregamento preserva o objeto integral. | A.1045(27), anexo seção 4, p. 4/PDF 5; dispositivo operativo 3/PDF 2; A.1108(29) e MSC.572(110) como confrontos de versão | B mantido; F/V/F/V |
| ANV-0845 | Pergunta por definição era convertida em comando bibliográfico genérico; os distratores eram objetos heterogêneos de outros arranjos. | Novo cenário de transferência, cinco decisões paralelas e justificativas individuais. Teste, oficial, escada disponível e consentimento não criam as permissões sugeridas. Fonte exata e limites adicionados; texto preservado no runtime. | Mesmos localizadores | E mantido |

Duas correções primárias parciais; nenhuma aprovação editorial final.
ANV-0147 passa de Difícil a Médio/L2 proposto, pela compreensão da vedação;
ANV-0845 mantém Médio, com L3 proposto pela aplicação a um cenário explícito.
Sem alegação de calibração psicométrica/histórica. Formatos B/A, IDs, conceitos,
keys e cinco letras A–E preservados. Sem cálculos nem figura necessária ausente.


Fonte e revisão delimitada de versões em EVIDENCIA_NORMATIVA_034.json; análise completa em REVISAO_ARTE_NAVAL_LOTE_034.md. Acumulado: 68 correções, 71 conferências parciais, zero aprovações finais.


## Lote 035 — relatório individual

| ID | Defeito encontrado | Correção concreta | Fonte/localizador verificado | Gabarito |
|---|---|---|---|---|
| ANV-0148 | answer-leak-v1 apagava I–IV; redação confundia o grampo com outros acessórios e citava 9.35 sem registrar a divergência. | Reescritas quatro proposições sobre constituição, U/base e inspeção do aperto. Retirada afirmação genérica de espaçamento. Explicação e cinco justificativas específicas; locator corrigido para o corpo 9.32, páginas/hash e nota do sumário adicionados. Proposições preservadas no runtime. | v.2, corpo9.32, pp.692–693/PDF53–54, figs.9-40/9-41; sumárioPDF10; contraste9.26 p.687/PDF48 | C mantido; F/V/V/F |
| ANV-0846 | Comando por definição era convertido em pergunta bibliográfica genérica; opções descreviam acessórios distintos, com localizador não reconciliado. | Novo cenário de montagem invertida; cinco alternativas paralelas sobre U/base e inspeção/reaperto. Explicação e cinco justificativas, páginas/hash e numeração reconciliada com nota. Fonte/runtime integralmente iguais. | Mesmos localizadores | A mantido |

Duas correções primárias parciais, sem aprovação editorial final.
0148: Difícil→Médio/L2 proposto, pela compreensão dos elementos e cuidados.
0846: Médio mantido/L3 proposto, por aplicação à montagem descrita. Sem alegação
de calibração psicométrica/histórica. IDs, competência, formatos B/A, opções
A–E e keys preservados. Somente as alternativas da direta foram reescritas;
os conjuntos de proposições da combinada permanecem os mesmos.


Julgamentos, precedência e divergência de numeração em REVISAO_ARTE_NAVAL_LOTE_035.md. Acumulado:70 correções/73 conferências parciais/zero aprovações finais.


## Lote 036 — relatório individual

| ID | Defeito encontrado | Correção concreta | Fonte verificada | Gabarito |
|---|---|---|---|---|
| ANV-0151 | answer-leak-v1 removia I–IV; afirmações por definição misturavam compensação com localização da máquina e função do timoneiro. | Quatro proposições sobre realimentação a vapor/hidrelétrica e confusões com marcha contínua/retorno a meio. Explicação, cinco justificativas, página/PDF/hash; enunciado integral preservado. | 11.4.d p.759/PDF120; contraste11.4.e pp.759–760/PDF120–121 | A mantido; V/F/V/F |
| ANV-0849 | Pergunta por definição era convertida em comando bibliográfico genérico, com distratores de objetos heterogêneos. | Novo caso da parada após a roda deixar de girar; cinco interpretações paralelas, explicação e cinco justificativas; fonte exata. Não entrega a resposta no comando. | Mesmos localizadores | D mantido |
| ANV-0152 | I–IV desapareciam no carregamento; a afirmação sobre grande redução/menor velocidade tinha escopo impreciso e a explicação não julgava cada item. | Quatro proposições sobre conjunto fixo/móvel, beta, objetivo, retorno e nomes dos chicotes. Removidas generalizações sem hipóteses; explicação e cinco justificativas; página/PDF/hash. | 9.13 p.668/PDF29, fig.9-16; continuação p.669/PDF30 | B mantido; F/V/F/V |
| ANV-0850 | Comando genérico e alternativas misturavam conjunto, componente, tipo e grandeza sem distinção editorial suficiente. | Enunciado autossuficiente e cinco descrições sobre constituição/objetivo, com erros localizáveis; explicação e cinco justificativas; referência verificada. | Mesmos localizadores | E mantido |
| ANV-0984 | Artefato de extração no principal e definição vaga; a opção de tipo particular podia competir com o nome genérico. Dificuldade/aplicação operacional superestimadas. | Texto limpo pede expressamente a designação genérica do conjunto; cinco opções distinguem sistema, componentes e retorno. Explicação e cinco justificativas; fonte exata, L1/Fácil propostos. | Mesmos localizadores | D mantido |

Cinco correções primárias parciais, não aprovações finais. Formatos B/A/B/A/A
preservados; IDs, competências e gabaritos A/D/B/E/D mantidos (a ordem da tabela
é151/849/152/850/984). Cinco alternativas A–E por registro. Os conjuntos das
combinadas não foram mudados; as opções diretas foram reescritas. 151/152:
Difícil→Médio/L2;849/850 Médio/L2;984 Difícil→Fácil/L1. São propostas editoriais,
sem calibração psicométrica ou histórica aprovada. O rótulo legado Situação
aplicada de984 foi preservado para filtros, sem promover reconhecimento de
nomenclatura a aplicação operacional real.


Julgamentos, precedência e limites em REVISAO_ARTE_NAVAL_LOTE_036.md. Acumulado:75 correções/78 conferências parciais/zero aprovações finais.


## Lote 037 — relatório individual

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0163 | answer-leak-v1 apagava I–IV; proposições por definição misturavam aproximação com amarração a dois ferros e explicação genérica. | Quatro proposições sobre ambiente, governo, controle da parada e uso indevido da amarra. Escopo limitado à aproximação, sem generalizar técnica de largada. Explicação, cinco justificativas, páginas/PDF/hash. | v.2,12.42.2 pp.847–848/PDF208–209 | C mantido; F/V/V/F |
| ANV-0861 | Definição virava comando bibliográfico genérico e alternativas heterogêneas. | Cinco critérios paralelos de planejamento de aproximação; enunciado, explicação e cinco justificativas específicos; referência exata. | Mesmos localizadores | A mantido |
| ANV-0164 | I–IV desapareciam; conceitos de altura metacêntrica/centro eram misturados ao princípio e a condição de equilíbrio ficava genérica. | Quatro proposições sobre sentido/intensidade do empuxo, volume deslocado e equilíbrio livre. Explicação, cinco justificativas, páginas/hash e figura de suporte. | v.1,2.25 pp.84–85/PDF84–85, fig.2-9; contexto2.24/2.26 | D mantido; F/V/F/V |
| ANV-0862 | Comando genérico e distratores sobre grandezas não comparáveis. | Caso qualitativo de mesmo peso em águas de densidades diferentes; cinco relações empuxo/volume, explicação derivada explicitamente e cinco justificativas; fonte exata. | Mesmos localizadores | B mantido |
| ANV-0988 | Artefato de extração no principal e mistura de princípio, força, dimensões e pontos; dificuldade superestimada. | Texto limpo pede o nome da relação; opções distinguem princípio, empuxo, flutuabilidade e centros. Explicação e cinco justificativas; Fácil/L1 propostos. | Mesmos localizadores | C mantido |

Cinco correções primárias parciais, não aprovações finais. IDs, competências e
keys mantidos; formatos B/A/B/A/A na ordem da tabela. Cinco alternativas A–E.
Conjuntos das combinadas mantidos; alternativas diretas reescritas.163/164:
Difícil→Médio/L2;861/862 Médio/L2;988 Difícil→Fácil/L1. São propostas editoriais,
sem calibração histórica/psicométrica aprovada. Rótulo legado Situação aplicada
mantido em988 para filtros, sem chamar nomenclatura de aplicação operacional.


Julgamentos, fontes e limites em REVISAO_ARTE_NAVAL_LOTE_037.md. Acumulado:80 correções/83 conferências parciais/zero aprovações finais.


## Lote 038 — dois lemes

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0165 | O carregamento substituía o enunciado por comando genérico e apagava I–IV; as proposições confundiam arranjo dos lemes, máquinas em sentidos opostos e rotação das pás. | Reescritas quatro proposições sobre posição dos lemes, atuação da descarga e predominância no caso adiante/atrás; explicação e cinco justificativas; referência com páginas/hash. | Arte Naval v.2,8ª ed.,12.16,pp.815–816/PDF176–177,figs.12-9/12-10 | E mantido;F/V/V/F |
| ANV-0863 | Definição virava comando bibliográfico genérico; alternativas misturavam outros conceitos de propulsão. | Criado caso qualitativo com cinco comparações sobre a ação dos lemes; enunciado, alternativas, explicação e cinco justificativas; referência exata. | Mesmos localizadores, texto e imagem | C mantido |

Fonte e figuras conferidas em texto/imagem; dez justificativas. Correções parciais, zero aprovações finais. Build completo e regressão passaram; três gates de testes gerais mantêm as falhas conhecidas. Acumulado82/85/0;triagem207/77. Detalhes, hashes e limites em REVISAO_ARTE_NAVAL_LOTE_038.md. Sem merge/deploy.


## Lote039 — seguimento a ré e hélice adiante

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0166 | O carregamento apagava I–IV; proposições misturavam definição, ação do leme e regras de águas limitadas, sem explicação específica. | Reescritas quatro proposições sobre as ações consideradas, exclusão da sucção, limite da previsão com leme a meio e influência do seguimento; explicação, cinco justificativas e páginas/hash. | Fonseca,Arte Naval v.2,8ª ed.,12.6.4,pp.803–804/PDF164–165,fig.12-5; escopo12.6 p.798/PDF159 | A mantido;V/F/V/F |
| ANV-0864 | Enunciado virava comando bibliográfico genérico e opções misturavam conceitos heterogêneos. | Criado cenário de avaliação de previsão de guinada com leme a meio; cinco alternativas comparáveis, explicação e cinco justificativas; referência exata. | Mesmos localizadores, texto e imagem | D mantido |

Texto/imagens conferidos;dez justificativas. Correções parciais,zero aprovações finais. Build/regressão passaram;falhas gerais conhecidas mantidas. Acumulado84/87/0;triagem206/77. Report039 detalha limites e estado0365.0176/0874 compartilham localizador do impedimento032,sem nova correção/conferência;próxima independente0179. Sem merge/deploy.


## Lote040 — transmissão quadrantal

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0179 | I–IV desapareciam no carregamento; conceitos do comando roda/servomotor eram misturados à ligação máquina/leme e a fixação era imprecisa. | Quatro proposições sobre engrenamento,fixação do setor à cana e contrastes com tambor/controle elétrico;explicação,cinco justificativas e referência com páginas/hash. | Arte Naval v.2,8ª ed.,11.7.b,p.763/PDF124;contrastes11.7.a/c/d e11.5.b/c–11.6 pp.760–761/PDF121–122 | D mantido;V/V/F/F |
| ANV-0378 | Versão ativa preservava comando por descrição bibliográfica e definição genérica de quadrante solidário à madre,sem distinguir o acionamento ou justificar opções. | Enunciado pede o componente que recebe o engrenamento;cinco componentes alternativos,explicação e cinco justificativas;setor fixado à cana explicitado. | Mesmos localizadores;fig.11-6 p.764/PDF125 como contraste | C mantido |
| ANV-0877 | Definição virava comando genérico e opções confundiam etapas do sistema. | Enunciado e cinco cadeias mecânicas reescritos para distinguir quadrantal,tambor,direta,parafuso e comando elétrico;cinco justificativas. | Mesmos localizadores | B mantido |
| ANV-0993 | Artefato textual de extração e identificação ambígua pelo simples uso de quadrante;dificuldade superestimada. | Texto limpo especifica o engrenamento;opções,explicação e cinco justificativas reescritas;Fácil/L1 propostos e fonte precisa. | Mesmos localizadores | C mantido |

Quatro IDs já ativos corrigidos no principal;vinte justificativas,texto/imagens e hashes conferidos. Correções parciais,zero aprovações finais. Build/regressão passaram;falhas gerais mantidas. Acumulado88/91/0;triagem205/77;próxima independente0181. Report040 documenta distinção de etapas e quatro variantes da mesma competência,sem alteração do regime de três modelos. Sem merge/deploy.


## Lote041 — montantes de pega,redação2015

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0181 | Proposições desapareciam no carregamento;misturavam proibição de içadores e área do carretel com montantes,sem fixação completa nem altura mínima explícita. | Reescritas quatro proposições sobre fixação à estrutura,vedação de prender à escada,referência de altura no topo da borda e limites dimensionais;explicação,cinco justificativas e referência oficial com hash. | IMO A.1108(29),2015,anexo5.2,p.2/PDF3;contraste5.1 | A mantido;F/V/F/V |
| ANV-0879 | Enunciado virava comando bibliográfico genérico;opções de competências alheias e ausência de justificativas individuais. | Criado caso com cinco propostas de montagem;comparados0,65/0,75 m,28/32 mm,1,10/1,2 m e fixação à estrutura versus à escada;explicação e cinco justificativas. | Mesmos localizadores,texto e imagem | D mantido |

Duas correções parciais,dez justificativas;zero aprovações finais. Fonte oficial A1108 anexo5.2 p2/PDF3,texto/imagem e hash conferidos. Critérios de2015 explícitos,referências de altura/fixação e mínimos corrigidos. Build/regressão passaram;falhas gerais conhecidas mantidas. Acumulado90/93/0,triagem204/77,próxima independente0190. Limites normativos e estado0380 no relatório041/JSON041. Pendência de HEAD local040 resolvida por fast-forward de árvore limpa,sem commit duplicado. Sem merge/deploy.


## Lote042 — vento para dentro do cais

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0190 | Proposições desapareciam;I antiga era compatível com o vento para dentro embora excluída pelo gabarito;II misturava outra amarração e a explicação não justificava o conjunto. | Reescritas quatro proposições com juízos inequívocos sobre sentido do abatimento,risco na atracação e dificuldade na largada;explicação,cinco justificativas e páginas/hash. | Arte Naval v.2,8ª ed.,12.30 pp.831–832/PDF192–193 e12.33.5 pp.835–836/PDF196–197 | E mantido;F/F/V/V |
| ANV-0888 | Definição virava comando bibliográfico genérico;opções heterogêneas e justificativa apenas nominal. | Criado enunciado com cinco avaliações conjuntas da atracação/desatracação sob abatimento para dentro;explicação e cinco justificativas individuais;referência precisa. | Mesmos localizadores,texto e imagem | C mantido |

Duas correções parciais,dez justificativas;zero aprovações finais. Fonte12.30 pp831–832/PDF192–193 e12.33.5 pp835–836/PDF196–197,texto/imagens/hash conferidos. Resolvida ambiguidade da antigaI que não sustentava exclusão pelo gabarito;novo conjunto inequívoco. Build/regressão passaram;falhas gerais conhecidas mantidas. Acumulado92/95/0,triagem203/77,próxima independente0198. Estado0389 e limites no relatório042. Sem merge/deploy.


## Lote043 — CEP e comparação dos giros de dois hélices

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0198 | I–IV desapareciam;referência restrita à linha de projeto e distratores misturavam medidas e centro de gravidade,sem justificativas individuais. | Reescritas quatro proposições sobre PP,linha de referência,plano diametral e distinção de extremos/apêndices;explicação,cinco justificativas,páginas/figuras/hash. | Arte Naval v.1,8ª ed.,2.50 pp.94–95/PDF94–95,fig.2-13;contexto2.46–2.49 p.94;contraste2.55 p.96/PDF96,fig.2-14 | C mantido;V/V/F/F |
| ANV-0199 | Proposições desapareciam;definições de outros dispositivos e conjugado genérico não sustentavam julgamento técnico claro. | Quatro proposições sobre sentidos comparados,distinção de giro/número de lemes,dependência geométrica do conjugado e comparação qualitativa do autor;cinco justificativas e fonte exata. | Arte Naval v.2,8ª ed.,12.10 pp.810–811/PDF171–172 | D mantido;F/F/V/V |
| ANV-0897 | Comando virava referência genérica;alternativas heterogêneas e explicação sem comparação verificável. | Enunciado e cinco avaliações da ação do leme reescritos;mantido o caráter de admissão qualitativa do texto;explicação,cinco justificativas,páginas/hash. | Mesmos localizadores do v.2,texto e imagem | B mantido |

Três correções parciais,quinze justificativas;zero aprovações finais. V1 2.50 pp94–95/PDF94–95 econtexto2.46–2.49/contraste2.55 p96;V2 12.10 pp810–811/PDF171–172,texto/imagens/hashes conferidos. Build/regressão passaram;falhas gerais conhecidas mantidas. Acumulado95/98/0,triagem201/77,próxima independente0200. Estados0397/0896/0398 inalterados,não contados. Fonte figurada/inferência geométrica e admissão qualitativa do autor explicitadas no relatório043. Sem merge/deploy.


## Lote044 — pressão lateral das pás

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0200 | I–IV desapareciam;pressão lateral,esteira e descarga eram misturadas,com condições de passo/efeito insuficientes e explicação genérica. | Reescritas quatro proposições sobre reações transversais,esteira,passo direito e tendências da popa;explicitado efeito isolado e limite de leme a meio;explicação,cinco justificativas e páginas/hash. | Arte Naval v.2,8ª ed.,12.4 pp.796–797/PDF157–158,quadro p.797;contrastes12.3 pp.795–796 e12.5 p.797;escopo12.6 p.798/PDF159 | E mantido;V/F/V/F |
| ANV-0898 | Enunciado virava comando bibliográfico genérico;alternativas misturavam condições transitórias e fenômenos distintos. | Criada comparação AV/AR da tendência da popa para um hélice de passo direito,isolada dos demais efeitos;cinco combinações com justificativas e referência precisa. | Mesmos localizadores,texto e imagem | C mantido |
| ANV-1000 | Artefato de extração e definição genérica sem distinção entre fenômenos;dificuldade superestimada. | Texto limpo identifica a origem das reações;cinco fenômenos de governo distinguíveis,explicação e justificativas;Fácil/L1 propostos e fonte exata. | Mesmos localizadores | E mantido |

Três correções parciais,quinze justificativas;zero aprovações finais. V2 12.4 pp796–797/PDF157–158,quadro p797,contrastes12.3/12.5 eescopo12.6 pp795–798;texto/imagens/hash conferidos. Passo direito,efeito isolado e limites expressos;sem garantir guinada total. Build/regressão passaram;falhas gerais conhecidas mantidas. Acumulado98/101/0,triagem200/77,próxima independente0203.0399 explicitamente inativa/quarentenada anteriormente,sem alteração/contagem. Sem merge/deploy.


# Lote 045 — freio da máquina de suspender

Base remota `205c630355e7e3a680d9e68cf78f96a0265e14dc`; PR #172 aberto/draft, consultado antes de editar. Atualização por fast-forward de árvore rastreada limpa, sem descartar temporários não rastreados. CHECKPOINT e relatório 044 prevalecem sobre os números antigos do pedido. Nenhum lote anterior refeito. A enumeração de processos retornou `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Hashes de insumos e publicação com `expected_sha`, sem force, protegem contra alterações concorrentes detectáveis; divergência no preflight exige interromper a publicação.

## Fonte e limites de leitura

Fonseca, Arte Naval, v.2, 8ª ed., 2019, seção C: 10.29.d/f p.741/PDF102. Contexto 10.28 p.738/PDF99; contrastes 10.29.b/c/e/g pp.740–742/PDF101–103, figura 10-23b; largada 10.35.a pp.750–751/PDF111–112. Essas seis páginas foram lidas em texto e imagens. SHA256 do volume recalculado: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. O número da página e o item do corpo foram visualmente confirmados.

A cinta mecânica aperta um flange da coroa. A fonte distingue isso da embreagem, que liga a coroa ao eixo, e do freio elétrico de discos mantidos afastados pelo eletroímã e apertados por molas na ausência de corrente. O texto limita a utilização da cinta: não a emprega para reduzir a velocidade da amarra que corre sob o peso do ferro nem para aguentar a amarra no mar com o ferro em cima; nesta última condição, indica as boças. O procedimento de largada pelo freio em 10.35.a não foi transformado em autorização genérica de regulação da velocidade. Registra-se a distinção, sem presumir erro tipográfico, errata ou equivalência com todo freio moderno.

As novas questões cobram identificação e compreensão do mecanismo descrito, sem determinar ordens reais, capacidade, carga, velocidade ou seleção de equipamento. Em 10.28, o autor ressalva que operador deve estudar instruções e desenhos da máquina específica. Não há cálculo numérico. As perguntas são autossuficientes em palavras e não exigem figura ausente; a figura foi conferida como contexto da separação entre freio, embreagem e coroa. O texto de conservação em 10.32 não foi adotado como prescrição atual. Livros e imagens permanecem privados; não foram publicados. Identidade com exemplar oficial, edição do edital, inventário completo de normas e revisão independente permanecem pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte primária/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0203 | I–IV desapareciam no carregamento; explicação genérica e uso indiscriminado do freio para regular a saída da amarra. A antiga verificação antes da partida não podia ser declarada falsa pelo gabarito. | Reescritas quatro proposições sobre cinta/flange, boças, embreagem e freio elétrico; explicitados os limites de uso; explicação e cinco justificativas. | Arte Naval v.2, 8ª ed., 10.29.d/f p.741/PDF102; contraste 10.28 p.738/PDF99 e 10.35.a pp.750–751/PDF111–112. | C mantido; F/F/V/V |
| ANV-0601 | Enunciado virava comando bibliográfico genérico; funções do freio e da embreagem sem comparação precisa e sem justificativas individuais. | Criada comparação de duas funções, com cinco pares de alternativas; distinguida frenagem no flange de acoplamento coroa–eixo; acrescentadas explicação, justificativas e referência precisa. | Mesmos itens 10.29.d/f e 10.28, texto e imagem conferidos. | A mantido |
| ANV-0901 | Artefato de extração, definição genérica e característica de regulação sem limite; dificuldade superestimada. | Identificação do mecanismo pela cinta em anel e flange; cinco componentes distintos como alternativas, todos justificados; removida a regulação genérica; Fácil/L1 propostos. | 10.29.d p.741/PDF102; contrastes 10.29.b/c/e/g pp.740–742/PDF101–103, fig.10-23b como contexto. | A mantido |

Três correções primárias parciais, zero aprovações finais. Preservados IDs, gabaritos C/A/A, competência old-062, tags e identificadores de tracking/taxonomy para retrocompatibilidade. Não se considera a taxonomia legada de volume como alinhamento bibliográfico final. Formatos B/A/A mantidos. 0203: Difícil→Médio/L2; 0601: Médio/L2; 0901: Difícil→Fácil/L1 propostos. O rótulo legado Situação aplicada de 0901 foi preservado para filtros, sem chamar a identificação de componente de aplicação operacional calibrada. A comparação de funções de 0601 é alternativa direta, apesar do nome legado Associação conceitual; não há correlação de colunas fictícia.

## Julgamento e unicidade

0203: I falsa, substituição das boças pela cinta contradiz a condição expressa em 10.29.d; II falsa, mistura frenagem e acoplamento da embreagem de 10.29.f; III verdadeira, cinta/flange e formas de aperto descritas; IV verdadeira, tipo de freio elétrico descrito, sem universalizar a todas as máquinas. Vetor F/F/V/V; somente C contém III/IV. A contém as duas falsas; B inclui I e omite IV; D inclui I e omite III; E inclui II e omite III. A antiga I, sobre verificações antes da partida, não foi tomada como falsa por exclusão do gabarito: foi substituída. A antiga III de regulação genérica não foi aprovada sem restrição.

0601: somente A associa freio ao flange e embreagem ao eixo. B troca as duas funções; C torna permanente a ligação que a embreagem permite desfazer; D atribui ao freio união permanente; E atribui ao freio acoplamento e torna a embreagem permanentemente livre. Cinco justificativas persistidas.

0901: somente A é cinta de frenagem sobre flange; B é acoplamento; C é a roda que recebe a amarra; D é tambor liso para cabos; E são linguetes que se apoiam em dentes, não cinta. A definição antiga foi removida, com distinções fundamentadas nos respectivos subitens. Cinco justificativas persistidas. Nenhum gabarito foi mantido por mera autoridade do registro anterior: a resposta foi reconstruída e comparada às cinco opções.

## Precedência, estado e diversidade

As três versões efetivas já eram ativas e vêm do arquivo principal. Antes, as transformações apagavam as proposições de 0203 e geravam comando genérico em 0601; 0901 sofria limpeza textual que preservava o defeito de conteúdo. Após a correção, os três objetos principais são integralmente iguais ao runtime e são preservados por reformulateLeakingStem e normalizeEditorialStem. auditQuestion não registra issues e a política continua active=true. Não há relaxamento de heurística ou inclusão de flags de aprovação.

ANV-0402 permanece inalterada e ausente do runtime: a política do objeto bruto é active=true, mas após as transformações anteriores é excluída por stem-quotes-source-answer. Não se inferem flags físicas inexistentes nem se aplica nova quarentena. ANV-0117 física trata do mesmo tema, mas é excluída como legacy-generator; sua versão efetiva já vem de restauração de âncora cogumelo (old-041), distinta deste lote, e permanece inalterada. A diferença de identidade físico/runtime é registrada para reconciliação global, sem contabilizar revisão adicional ou alterar precedência. As três variantes ativas old-062 não devem coexistir na mesma prova. Prevenção/revisão semântica global pendente; nenhum regime de três modelos foi modificado.

## Validação, hashes e continuidade

Build completo isolado `npm run build`: exit 0, compilação, lint/tipos, 101 páginas e rotas confirmados. Todos os insumos rastreados fora de docs, incluindo o script de regressão, são byte a byte iguais à cópia testada. Os seis artefatos gerados são idênticos. O incidente anterior ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração de bancos PSCPP/cadernos, catálogo e flashcards; validate-runtime-question-banks, validate-pscpp-exam-selection, test-question-source-provenance, validate-runtime-question-catalog, test-pscpp-audit-anv0005, audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build: 101 deltas exatos contra baseline congelada; 12.001 ocorrências de cadernos e todas as 1.984 PSCPP preservadas; composição ativa intacta; 224 proposições renderizadas; 225 opções diretas preservadas. As cinco opções de cada correção têm justificativas. Todos os 101 hashes corrigidos correspondem ao inventário final. Só ANV-0203/0601/0901 mudaram no arquivo principal, com metadados de topo e demais objetos intactos; restaurações não foram editadas. Hashes antes/depois em CORRECOES_RUNTIME.json e CONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas: test-notebook-complete-stems exit 1 em ANV-0142; validate-editorial-runtime exit 1 com 77 localizadores; validate-pscpp-editorial-evidence exit 2, zero aprovadas e 14.086 pendentes. O gate de evidências foi regenerado depois do inventário e seus hashes conferidos, sem aprovação artificial. A matriz de 100 questões em 25/25/10/10/10/10/10 foi preservada. Testes estruturais e a releitura desta sessão não equivalem à rechecagem editorial independente final.

Acumulado: 101 IDs corrigidos distintos, 104 conferências bibliográficas parciais, zero aprovações finais. Triagem: 199 candidatos sem proposições e 77 por localizador; próxima independente ANV-0204. 54 correções de candidatos sem proposições, três falsos positivos anteriores resolvidos sem alterar conteúdo, 47 correções fora dessa triagem. Contagens preservadas: 27.435 físicos, 14.086 ocorrências (12.102 cadernos + 1.984 PSCPP), 13.715 IDs únicos. Pares ANV-0142/0840 e ANV-0176/0874 seguem com impedimento bibliográfico registrado, sem recontagem de buscas. Demais achados anteriores, programa/edital, revisão independente, cobertura e dados/offline pendentes. Oito gates pendentes/falhos; merge_permitted=false. Sem merge, deploy ou mutação de produção/usuários.


# Lote 046 — comprimento de onda

Base remota `ed4aee50d31c26a0f1297481a8af7b9ea08a3f1a`; PR #172 aberto/draft e HEAD remoto consultados antes de editar. Árvore rastreada inicialmente limpa em HEAD local anterior, atualizada por fast-forward após concluir o fetch, sem descartar temporários. CHECKPOINT e relatório 045 prevalecem sobre o pedido antigo. Lotes publicados não foram refeitos, nem criado commit duplicado. A enumeração de processos retornou `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Hashes de insumos, árvore e publicação com expected_sha, sem force, exigem interromper a publicação se surgir divergência detectável.

## Fonte, leitura e limites

Fonseca, Arte Naval v.2, 8ª ed., 2019, 12.82.a pp.924–925/PDF285–286. Duas páginas lidas em texto e imagens, com definição geométrica p.924 e continuação de período/celeridade p.925. O início da seção G e o número do item estão na imagem p.924. SHA256 recalculado: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

O comprimento é delimitado por duas cristas ou dois cavados consecutivos; a altura é vertical do cavado à crista. Interpretar a separação longitudinal no sentido da propagação é uma explicitação geométrica, não uma nova fórmula atribuída literalmente ao autor. Crista e cavado adjacentes não são dois extremos de um ciclo completo. Não se generaliza que a separação horizontal crista–cavado seja sempre exatamente metade do comprimento em qualquer onda real. O trem periódico/regular e o mesmo instante estão explícitos. Período e celeridade foram lidos como contraste dimensional, não empregados para inferir comprimento em uma instalação real ou com navio em movimento.

A figura 12-54 na mesma p.924 é de reboque, não uma figura de ondas; não foi utilizada como evidência gráfica de ondas nem anexada às questões. As novas perguntas são autossuficientes em palavras/coordenadas. As relações numéricas de 12.82.b na p.925 foram visualmente localizadas, mas suas hipóteses físicas e atualidade não foram homologadas neste lote nem usadas na resolução. Não se generalizam descrições posteriores sobre transporte de massa ou limites de águas profundas/rasas. Fonte/edital oficial, cobertura completa da bibliografia e rechecagem independente permanecem pendentes. Livros e capturas privados, sem publicação integral.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte primária/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0204 | I–IV desapareciam no carregamento; explicação genérica e mistura entre altura, comprimento e finalidade da navegação com mau tempo. | Restauradas quatro proposições sobre distância vertical, cristas e cavados consecutivos e intervalo incompleto; explicação e cinco justificativas, com páginas e hash. | Arte Naval v.2, 8ª ed., 12.82.a pp.924–925/PDF285–286; definições geométricas p.924/PDF285, texto/imagem conferidos. | D mantido; F/V/V/F |
| ANV-0602 | Comando bibliográfico genérico e alternativas heterogêneas, sem aplicação verificável nem justificativas individuais. | Criado cálculo com quatro cristas nas posições 0/40/80/120 m e três intervalos; alternativas 30/40/60/80/120 m justificadas pelos erros de contagem; explicação e referência precisas. | Mesma definição 12.82.a p.924/PDF285; dados numéricos didáticos novos, não atribuídos ao livro. | B mantido; 40 m |

Duas correções primárias parciais, zero aprovações finais. IDs, gabaritos D/B, competência old-148, tags e identificadores de tracking/taxonomy preservados para retrocompatibilidade. A taxonomia legada de volume não é considerada alinhamento bibliográfico final. Formatos B/A mantidos; 0204 Difícil→Médio/L2; 0602 Médio/L3 propostos. Associação conceitual é rótulo legado de 0602 preservado para filtros, mas a estrutura continua alternativa direta com cálculo, não correlação de colunas. Não se declara calibração histórica/psicométrica concluída.

## Julgamento, cálculo e unicidade

0204: I falsa, descreve altura; II verdadeira, cristas consecutivas; III verdadeira, cavados consecutivos; IV falsa, pontos de fases diferentes não delimitam uma repetição completa. Vetor F/V/V/F. Somente D contém II/III. A contém I/IV falsas; B inclui IV e omite II; C inclui IV e omite III; E inclui I e omite II. Cinco justificativas persistidas. A antiga proposição sobre finalidade de navegação com mau tempo foi substituída por conteúdo da competência; a relação antiga entre período/celeridade/comprimento não foi declarada falsa por exclusão de gabarito nem usada como demonstração automática de uma lei física sem hipóteses.

0602: os dados são um cenário numérico didático novo, não um exemplo ou medição transcrita da fonte. Quatro cristas consecutivas ocupam 0,40,80,120 metros em um mesmo instante. As três diferenças são 40−0=40,80−40=40,120−80=40 metros; total120m/3intervalos=40m. Não há conversão de unidades, arredondamento, período de encontro ou relação de dispersão. A=30m usa120/4, confundindo cristas com intervalos; B=40m é a única correta; C=60m usa120/2; D=80m cobre dois comprimentos; E=120m cobre três. Todos os distratores têm erro calculável e unidades homogêneas. A dificuldade não deriva só de haver uma conta: é uma proposta de aplicação elementar, não decisão operacional avançada.

## Precedência, estados e diversidade

0204 e0602 já estavam ativas, principal como fonte efetiva, sem restauração prevalente desses IDs. Antes, as transformações produziam comando bibliográfico genérico e apagavam as proposições de0204. Os novos objetos são preservados por reformulateLeakingStem/normalizeEditorialStem, auditQuestion sem issues e política active=true; devem corresponder integralmente ao runtime final. Não há flags novas de aprovação ou relaxamento de heurísticas.

0403 permanece inalterada e ausente do runtime: objeto bruto com política active=true, excluído após transformações anteriores por stem-quotes-source-answer. 1199 permanece explicitamente inactive/quarantined, razão anterior artificial_template_requires_source_rewrite; sem nova quarentena, ativação ou contagem. 0027 física de ondas permanece excluída como legacy-generator, enquanto sua versão efetiva já restaurada é de defensa (old-110) e continua intacta. Essa divergência de identidade físico/runtime exige reconciliação global; não se sobrescreve a restauração de outro conceito ao editar o tema físico.

As duas versões old-148 examinam comprimento de onda e não devem coexistir na mesma prova, ainda que uma use cálculo. AN-C12-I12-82-M1/M2/M3 também foram identificadas no inventário como ativas e preservadas no regime de três modelos. Seus textos mostram negações literais repetitivas e distratores genéricos (M1/M3 repetem conteúdo por negação; M2 inclui irrelevância/proibição absoluta sem conteúdo específico). São achados editoriais observados, sem correção, aprovação ou incremento de conferência bibliográfica para esses IDs. O conjunto cobre também período, crista/cavado e mar desenvolvido; não se presume que todo o capítulo seja uma única competência nem se valida aqui toda a física dessas proposições. Revisão individual completa desses modelos e prevenção semântica global permanecem pendentes.

## Validação e hashes

Build completo isolado `npm run build`: exit0; compilação, lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs, incluindo regressão, iguais byte a byte à cópia testada; seis artefatos gerados idênticos. Não se declara resolvido o incidente anterior ENOTEMPTY da árvore original.

Passaram geração PSCPP/cadernos/catálogo/flashcards; validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:103 deltas exatos acumulados contra baseline congelada;11.999 cadernos e todas1.984 PSCPP intactos;composição ativa preservada;228 proposições renderizadas e230 opções diretas preservadas. O novo contrato de cálculo confere as três diferenças entre posições,120/3=40m,coordenadas presentes no enunciado e valor da opção correta. Nenhuma asserção foi relaxada.

Entre o checkpoint045 e046, o inventário efetivo muda somente0204/0602. Seus objetos principais são integralmente iguais ao runtime. Todos103 hashes corrigidos correspondem ao inventário final; hashes antes/depois em CORRECOES_RUNTIME.json e CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0027/0403/1199,três modelos e demais objetos/restaurações intactos; nenhuma ativação ou nova quarentena. A matriz exata100=25/25/10/10/10/10/10 continua preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 em ANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado depois do inventário,com todos os hashes conferidos. REVISOES_EDITORIAIS.jsonl permanece inalterado. Testes estruturais e releitura desta sessão não substituem revisão independente,aderência oficial ao programa/edital e validação semântica global.

Acumulado103 IDs corrigidos distintos,106 conferências bibliográficas parciais,zero aprovações finais. Triagem198 candidatos sem proposições e77 por localizador. São55 candidatos corrigidos,3 falsos positivos anteriores resolvidos sem mudar conteúdo e48 correções fora dessa triagem. Próxima independente ANV-0213. Contagens27.435 físicos,14.086 ocorrências (12.102 cadernos+1.984 PSCPP),13.715 IDs únicos preservadas. Fontes bloqueadas0142/0840 e0176/0874 e demais achados anteriores permanecem pendentes, sem recontar buscas. Oito gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.


# Lote 047 — exercício de governo de emergência

Base remota `d95d9d611df34993d789f7a99ca05857559ada79`; PR #172 aberto/draft e HEAD remoto consultados antes de editar. Árvore rastreada inicialmente limpa em HEAD local anterior, atualizada por fast-forward depois do fetch, sem descartar temporários. CHECKPOINT e relatório046 lidos; prevalecem sobre os números antigos do pedido. Nenhum lote publicado refeito ou commit duplicado. Enumeração de processos retornou `fatal library error, lookup self`: não se afirma inspeção global bem-sucedida de escritores. Hashes dos insumos/árvore e expected_sha sem force exigem suspender publicação se houver divergência detectável.

## Fonte, evidência normativa e limites

Fonseca, Arte Naval v.2, 8ª ed.,2019, 11.10.d(2)–(4), p.775/PDF136. Contexto11.9 pp.765–766/PDF126–127 e11.10.a(4)(a) p.767/PDF128. Quatro páginas lidas em texto/imagens. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. O texto separa testes/verificações, familiaridade com transferências e exercício de emergência. Não se equipara necessariamente controle local a acionamento exclusivamente manual.

Conferência externa em23/10/2026: publicação oficial britânica [Treaty Series42(2003), Cm6001](https://treaties.fcdo.gov.uk/data/Library2/pdf/2003-TS0042.pdf), emendas2000 à SOLAS, adotadas5/12/2000, cuja capa declara entrada em vigor para o Reino Unido em1/7/2002. Documento908.940bytes/128páginas, SHA256 `6416bdd62c0080572c6c40c70c3932f8edbf1d7d39c709d86714f55a4210537e`. Verificados apenas metadados da capa em texto e V/26 pp.113–114/PDF115–116 em texto/imagem; não se declara leitura integral128páginas. V/26.4 corresponde aos componentes do exercício do livro;26.2.3 trata de comunicação,26.3 de instruções/familiaridade. É correspondência histórica, não prova de consolidação vigente completa.

Consultada também a orientação oficial [MCA MGN610 Amendment1](https://www.gov.uk/government/publications/mgn-610-mf-amendment-1-solas-chapter-v-guidance-on-the-merchant-shipping-safety-of-navigation-regulations-2020/mgn-610-mf-amendment-1-navigation-solas-chapter-v-guidance-on-the-merchant-shipping-safety-of-navigation-regulations-2020), publicada13/2/2025: cabeçalho/data,resumo1.1–1.3 e AnnexA33.1–33.4. Ela mantém referência a V/26 e instruções/diagrama de26.3.1 no contexto britânico; não reproduz integralmente26.4 nesse trecho. Não foi usada para afirmar aplicação brasileira ou atualidade de cada frase do livro. Consulta de minuta2027, resultados de redes sociais, bancos de quiz e fontes de terceiros não foram adotados como autoridade normativa. As aberturas web dos PDFs falharam; a publicação FCDO foi obtida diretamente pela URL pública, validada como PDF, hash/bytes registrados e páginas inspecionadas localmente. Não houve contorno de autenticação.

EVIDENCIA_NORMATIVA_047.json registra escopo e limites. Não se cobra periodicidade, prazo pré-saída, ângulos,velocidades,tonelagem ou dispensas como lei atual. As duas perguntas explicitam a edição2019 e cobram os componentes do exercício descrito. Consolidação completa de emendas SOLAS, incorporação brasileira,programa/edital-alvo,identidade binária dos anexos/Drive e rechecagem independente continuam pendentes. Não se universaliza o procedimento a qualquer navio ou instalação; nenhum livro,PDFnormativo integral ou captura foi publicado. Nenhuma figura externa é exigida pelas perguntas, que são autossuficientes em palavras. Não há cálculo numérico.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte primária/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0213 | I–IV desapareciam no carregamento; misturavam propulsores e definições alheias ao exercício, com explicação genérica e referência ampla. | Restauradas quatro proposições sobre controle direto local, comunicação com o passadiço e energia alternativa quando aplicável; distinguidos alarmes de prática local; explicação e cinco justificativas, páginas/hash e limite de edição. | Arte Naval v.2, 8ª ed.(2019), 11.10.d(2)–(4) p.775/PDF136; correspondência histórica SOLAS V/26.4, Treaty Series42(2003), p.114/PDF116. | C mantido; F/V/F/V |
| ANV-0611 | Comando bibliográfico genérico, alternativas heterogêneas e ausência de justificativas; definição não diferenciava os componentes do exercício. | Criado caso de planejamento do exercício, com cinco programações comparáveis; cada distrator omite/substitui um componente obrigatório na descrição; preservada a condição de aplicabilidade da energia; explicação e cinco justificativas. | Mesmos localizadores; contexto 11.9 pp.765–766/PDF126–127 e 11.10.a(4)(a) p.767/PDF128 conferidos. | A mantido |

Duas correções primárias parciais, zero aprovações finais. IDs,chavesC/A,competênciaold-083,tags e tracking/taxonomy legados preservados para filtros. Identificadores legados de volume não equivalem a alinhamento bibliográfico final. FormatosB/A mantidos.0213 Difícil→Médio/L2;0611 Médio/L3 propostos, sem calibração histórica/psicométrica aprovada. Rótulo Associação conceitual em0611 preservado, mas estrutura é alternativa direta com caso, não associação de colunas.

## Julgamento, unicidade e condicionais

0213:I falsa, observar alarmes não substitui a prática de controle direto local;II verdadeira, inclui controle direto no compartimento;III falsa, comunicação envolve o passadiço, não só o pessoal local;IV verdadeira, fontes alternativas quando aplicáveis. VetorF/V/F/V;apenasC contémII/IV. A incluiIII falsa e omiteII;B incluiIII falsa e omiteIV;D incluiI falsa e omiteII;E reúneI/III falsas. Cinco justificativas persistidas. A necessidade de energia alternativa não foi transformada em requisito sem condição para qualquer instalação. Não se aprova por exclusão a antiga proposição sobre propulsão azimutal; foi substituída por conteúdo pertinente ao exercício.

0611:A é a única programação com os três componentes e a ressalva de aplicabilidade. B eD trocam a prática local por observação de alarmes/indicadores;C troca a comunicação com o passadiço por conversa interna;E exclui energia alternativa mesmo quando aplicável. As verificações de alarmes/indicadores não são chamadas de inúteis: são componentes distintos, insuficientes para substituir o exercício local. Cinco justificativas persistidas. O caso é planejamento de treinamento, não uma sequência de comutação real executável em toda máquina; instruções e configuração específicas do navio continuam necessárias.

## Precedência, estados e diversidade

0213/0611 já ativas e principal como fonte efetiva, sem restauração prevalente desses IDs. Antes, transformações apagavamI–IV de0213 e geravam comando genérico em ambas. Novos objetos preservados por reformulateLeakingStem/normalizeEditorialStem,auditQuestion sem issues,política active=true. Nenhuma flag nova de aprovação, alteração de normalizador ou relaxamento de heurística.

0412 permanece inalterada e ausente do runtime: política bruta active=true, após transformações anteriores excluída por stem-quotes-source-answer.0036 física legada de governo de emergência é excluída por legacy-generator; sua versão efetiva já restaurada é gualdropes,old-071,e continua intacta. Não se sobrescreve a restauração de outro conceito pelo tema físico. Sem ativação,nova quarentena ou incremento para esses dois IDs. As duas variantesold-083 não devem coexistir na mesma prova. Foram identificados15 modelos ativos nos grupos AN-C11-1110,1110a,1110b,1110c,1110d(M1/M2/M3), preservados sem edição; a identificação no inventário não é leitura editorial integral nem incremento de conferência bibliográfica. Regimes de três modelos permanecem intactos; prevenção/revisão semântica global e reconciliação de identidade físico/runtime pendentes.

## Validação e hashes

Build completo isolado `npm run build`:exit0,compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada;seis artefatos gerados idênticos. O incidente anterior ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:105 deltas exatos acumulados contra baseline congelada;11.997 cadernos e todas1.984 PSCPP intactos;composição ativa preservada;232 proposições renderizadas e235 opções diretas preservadas. Nenhuma asserção foi relaxada;apenas IDs documentados acrescidos aos contratos de fonte/direta.

Entre046 e047,somente0213/0611 mudam no inventário efetivo e arquivo principal. Seus objetos principais são integralmente iguais ao runtime final. Todos105 hashes corrigidos correspondem ao inventário;hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0036/0412,restaurações,modelos e demais objetos intactos. Sem ativação ou nova quarentena. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1ANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário e todos os hashes conferidos. REVISOES_EDITORIAIS.jsonl inalterado. Testes estruturais não substituem revisão editorial independente,inventário completo de emendas,vigência/aplicabilidade brasileira,programa/edital ou prevenção semântica global.

Acumulado105 IDs corrigidos distintos,108 conferências bibliográficas parciais,zero aprovações finais. Triagem197 candidatos sem proposições e77 por localizador;56 candidatos corrigidos,3 falsos positivos anteriores resolvidos sem mudança de conteúdo e49 correções fora dessa triagem. Próxima independente ANV-0214.27.435 físicos,14.086 ocorrências(12.102cadernos+1.984PSCPP),13.715 IDs únicos preservados. Pares0142/0840 e0176/0874 ainda com impedimento bibliográfico registrado,sem recontagem de buscas;demais achados anteriores pendentes. Oito gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.


# Lote 048 — nó de escota singelo

Base remota `d1ac1a4274528a2d273a1f5bb338c89b58800727`; HEAD remoto e PR #172 aberto/draft consultados antes de editar. CHECKPOINT e relatório047 lidos após fast-forward; seus números prevalecem sobre o pedido antigo. Árvore rastreada inicialmente limpa; temporários não rastreados preservados, sem commit duplicado. Enumeração de processos falhou com `fatal library error, lookup self`: não se afirma inspeção global bem-sucedida de escritores. Insumos/árvore são comparados por hashes e a publicação exige expected_sha sem force; divergência detectável impede publicação.

## Fonte e escopo

Fonseca, Arte Naval v.1, 8ª ed.,2019,8.39 p.552/PDF550,fig.8-35. Contrastes8.37–8.40 pp.551–552/PDF549–550,figs.8-33–8-36; contexto8.41–8.43 p.553/PDF551,figs.8-37–8-39. Três páginas lidas em texto e imagens; o cabeçalho confirma a diferença de duas páginas entre numeração impressa e PDF. SHA256 recalculado `792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20`, Drive `1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N`.

8.39 descreve ligação entre chicotes, ligação de chicote a olhal/mão/alça, emprego com bandeira/adriça sem gato e utilidade para bitolas diferentes.8.40 distingue o dobrado pela volta redonda do chicote, para maior segurança;8.37 descreve o direito com meias-voltas em sentidos opostos e limita seu uso. Texto e figuras não foram tratados como garantia universal de segurança de qualquer cabo, carga ou instalação. Não há cálculo nem alegação de norma vigente; alinhamento à bibliografia/programa/edital oficiais e identidade binária de anexos permanecem pendentes. As perguntas são autossuficientes em palavras e não exigem figura ausente. Nenhum livro ou imagem foi publicado.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte primária/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0214 | Carregamento apagava I–IV. Proposições misturavam encapeladura e empregos de nós; III descrevia emenda de espias sem distinguir a construção do dobrado, não sendo legítimo chamá-la falsa apenas porque a chave a excluía. Explicação genérica e localizador sem página. | Restauradas quatro proposições autossuficientes; substituídas I/III por inversão explícita da construção singelo/dobrado e requisito indevido de gato; II/IV tratam de bitolas e ligações. Explicação, cinco justificativas, páginas/hash e limite de escopo. | Arte Naval v.1,8ª ed.(2019),8.39 p.552/PDF550,fig.8-35; contraste8.40 mesma página. | D mantido;F/V/F/V |
| ANV-0612 | Comando genérico no runtime e definições heterogêneas/sobrepostas: unir dois chicotes também é compatível com o objeto, prejudicando unicidade. Sem cinco justificativas. | Reformulada como instrução sobre empregos; cinco orientações comparáveis. B aplica bandeira/adriça sem gato; distratores erram bitolas, construção do dobrado, ligações a mãos/olhais ou construção do direito. Explicação, cinco justificativas e referência verificável. | Mesmo8.39; contrastes8.37 p.551/PDF549 e8.40 p.552/PDF550,figs.8-33/8-36. | B mantido |

Duas correções primárias parciais, nenhuma aprovação final. IDs,competênciaanv1-8.39,taxonomy,tracking,tags e chavesD/B preservados. FormatosB/A mantidos;0214 Difícil→Médio/L2;0612 Médio/L2 propostos. Calibração histórica/psicométrica não aprovada. Rótulo legado Associação conceitual de0612 preservado para filtros, mas formato estrutural é alternativa direta, não associação de colunas. Não se converte o banco inteiro para três modelos nem para a distribuição histórica de matérias.

## Julgamento individual e unicidade

0214:I falsa, atribui ao singelo o elemento que8.40 acrescenta no dobrado;II verdadeira, inclui bitolas diferentes;III falsa, exige gato na aplicação cuja descrição é adriça sem gato;IV verdadeira, inclui mão/alça/olhal. SóD reúneII/IV. A incluiIII falsa e omiteII;B incluiI falsa e omiteIV;C incluiI/III falsas;E incluiI falsa e omiteII. As cinco justificativas estão em distractor_analysis. Não se aprova por exclusão a antigaIII; foi substituída por uma afirmação inequívoca e diretamente verificável.

0612:B é a única orientação compatível. A restringe indevidamente a bitolas iguais;C troca as construções do singelo/dobrado;D exclui mão/olhal;E transfere a construção do direito. As aplicações de8.39 não significam que os nós sejam intercambiáveis em qualquer carga real; nenhuma prescrição universal de emenda de espias foi criada. Cinco justificativas persistidas, sem distratores de disciplina alheia.

## Precedência, estados e diversidade

0214/0612 já estavam ativas e tinham o principal como fonte efetiva, sem restauração prevalente. Os objetos corrigidos atravessam reformulateLeakingStem/normalizeEditorialStem integralmente intactos, auditQuestion sem issues e política active=true. Não houve alteração dos normalizadores, de heurísticas ou de flags de aprovação.

0413 permanece inalterada e ausente do runtime: política bruta active=true, após transformações anteriores active=false por stem-quotes-source-answer.0042/0078 físicas legadas de nó singelo continuam excluídas por legacy-generator; versões efetivas já restauradas são cote(anv1-8.6) e volta da ribeira(anv1-8.10), preservadas. Nenhuma ativação,nova quarentena ou conferência contabilizada para esses três IDs. A identidade físico/runtime global ainda precisa ser reconciliada. Não foram encontrados modelos ativos AN-* associados a8.39 ou ao tema singelo pelos metadados do inventário; essa busca não é prova de ausência de duplicatas semânticas. Regimes existentes de três modelos não foram alterados. As duas variantes corrigidas da mesma competência não devem coexistir na mesma prova; prevenção semântica global e rechecagem independente continuam pendentes.

## Validação

Build completo isolado final `npm run build`: exit0; compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada; seis artefatos gerados idênticos. Uma tentativa inicial de copiar nomes Unicode com git ls-files sem -z falhou antes do build; corrigida para -z. Uma geração e um build intermediários usaram insumos anteriores ao ajuste de alternative_rationales para o campo consumidor distractor_analysis; a regressão detectou o hash divergente e falhou. Esses resultados não validam a árvore final. Regeneração e novo build completo com insumos finais estáveis passaram. Não se declara resolvido o antigo ENOTEMPTY da árvore original.

Passaram geração PSCPP/cadernos/catálogo/flashcards; validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão final antes/depois do build:107 deltas exatos acumulados,11.995 cadernos e todas1.984 PSCPP intactos frente à baseline congelada; composição ativa preservada;236 proposições renderizadas e240 opções diretas preservadas. Nenhuma asserção relaxada: apenas IDs documentados acrescidos aos contratos de fonte/direta.

Entre047 e048,só0214/0612 mudam no arquivo principal e inventário efetivo. Objetos principais integralmente iguais ao runtime; todos107 hashes corrigidos coincidem com inventário. Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0042/0078/0413,restaurações e demais objetos intactos. Nenhuma ativação ou nova quarentena. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário e todos os hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado. Testes e releitura desta sessão não substituem rechecagem independente,programa/edital oficial,revisão semântica global ou consolidação normativa.

Acumulado107 IDs corrigidos distintos,110 conferências bibliográficas parciais,zero aprovações finais. Triagem196 sem proposições,77 localizadores;57 candidatos corrigidos,3 falsos positivos anteriores sem mudança,50 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102cadernos+1.984PSCPP),13.715 IDs únicos preservados. Próxima independenteANV-0218,costado desobstruído(IMO A1045 Annex6),sujeita à conferência normativa;0142/0840 e0176/0874 permanecem com fonte pendente,sem recontagem de busca. Todos8 gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

# Lote 049 — costado desobstruído e aproximação da lancha do prático

Base remota `0eaa306d66299be503bbf70979148870ef8f8fc5`; HEAD remoto e PR #172 aberto/draft conferidos antes de editar. CHECKPOINT048 e relatório048 lidos depois do fast-forward. Árvore rastreada inicialmente limpa, temporários não rastreados preservados. Não se refez lote publicado nem se criou commit duplicado. Enumeração de processos falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Comparações de hashes/árvore e expected_sha sem force protegem contra divergência detectável; publicação deve parar se remoto ou insumos mudarem.

## Fonte primária e escopo normativo

Consultadas fontes oficiais IMO em23/10/2026. A.1045(27),adotada30/11/2011,anexo6,p.5/PDF6,com contraste7.1.3 na mesma página. Texto e imagem confirmam a faixa externa do costado, distinta do acesso ao convés junto ao carretel. A.1108(29),adotada2/12/2015,anexo5.1/5.2,p.2/PDF3,texto/imagem;essa emenda não substitui6.

MSC.572(110),adotada26/6/2025,operativos2/3 na página inicial sem numeral/PDF2:texto/imagem,aceitação1/7/2027 e entrada1/1/2028 condicionadas. MSC.576(110),mesma adoção,operativos1–3/8 na página inicial sem numeral/PDF2 e anexo10,p.8/PDF9,texto/imagem. O item10 conserva condições semelhantes;os textos futuros não foram aplicados antecipadamente. O convite do operativo8 à Assembleia para revogar resoluções em1/4/2030 não comprova decisão posterior da Assembleia. Não se declara auditoria integral dos16PDFpages nem consolidação vigente completa.

Hashes/URLs/bytes/escopo em EVIDENCIA_NORMATIVA_049.json. A1045,A1108 eMSC572 coincidem com hashes anteriores034/041. O exemplarMSC576 da URL KnowledgeCentre tem788.419bytes/SHA256`6c02d248d5074f2d632a53710d4997c33a3ee7a8a68b839f879ff4ac4f79dc45`,diferente do registrado041 na URL OurWork/Pilotage(4.683.622bytes/SHA256`7b44c2f02192e87dd32cb377f8b228921272b2411420fabfb00786ed1e1b0bb2`). Não se presume equivalência binária nem causa da diferença; evidências anteriores preservadas. Nenhuma identidade com cópiasDrive comprovada.

As três perguntas delimitam expressamente a redação2011. A consolidação normativa completa,a aplicação brasileira e o alinhamento à versão oficial do programa/edital continuam pendentes. Nenhum PDF integral ou imagem foi publicado. As perguntas são autossuficientes em palavras,sem figura ausente. Os comprimentos de85m/90m do caso são exemplos didáticos;85<90 é verdadeiro,90<90 é falso. Não há cálculo adicional nem aprovação de uma instalação real.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte primária/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0218 | I–IV desapareciam no carregamento; misturavam montantes,carretel e costado; exceção dos90m vaga,sem condições completas; explicação genérica. | Restauradas quatro proposições sobre recorte,mínimo6m,limite estrito90m,determinação da Administração e outras medidas de segurança; explicação,cinco justificativas,página/hash e escopo2011. | IMO A.1045(27),anexo6,p.5/PDF6;contraste7.1.3 na mesma página. | C mantido;F/V/F/V |
| ANV-0616 | Comando genérico e definições heterogêneas; explicação omitia condições da exceção; sem justificativas individuais. | Criadas cinco propostas comparáveis de dispensa;A reúne naviooffshore85m,impraticabilidade determinada pela Administração e medidas alternativas; distratores testam90m,automatismo,autoridade e segurança. Explicação e cinco justificativas. | Mesmo anexo6,p.5/PDF6. | A mantido |
| ANV-0906 | Artefato de extração e nomenclatura vaga; confundia faixa externa e área interna junto ao carretel; referência ampla. | Caso de cinta saliente; cinco áreas/componentes diferenciados; explicação,cinco justificativas e referência exata. Distingue aproximação externa de acesso ao convés. | Anexo6 e7.1.3,p.5/PDF6. | A mantido |

Três correções primárias parciais,zero aprovações finais. IDs,chavesC/A/A,competênciaold-248,taxonomy,tracking e tags preservados para filtros. FormatosB/A/A mantidos;0218 Difícil→Médio/L2,0616 Médio/L3,0906 Difícil→Médio/L2 propostos,sem calibração histórica/psicométrica aprovada. Rótulo Associação conceitual legado de0616 não é associação estrutural de colunas. Não se altera a matriz obrigatória de matérias pelo benchmark histórico.

## Unicidade e julgamento individual

0218:I falsa,tamanho sozinho não dá dispensa universal;II verdadeira,recorte ligado ao impedimento da aproximação;III falsa,outras medidas continuam necessárias;IV verdadeira,preserva as condições da exceção. SóC contémII/IV. A incluiI falsa e omiteIV;B incluiIII falsa e omiteII;D reúneI/III falsas;E incluiIII falsa e omiteIV. Não se chama falso o conteúdo antigo sobre montantes ou carretel em seus próprios contextos: foi substituído por proposições pertinentes à competência.

0616:A reúne todas as condições. B usa90m,fora de menor que90m;C elimina impraticabilidade;D transfere a determinação da Administração ao comandante;E elimina medidas alternativas. Os valores comparáveis não constituem limites inventados:85m é dado didático e90m é a fronteira textual. Nenhuma aceitação automática de embarcação offshore foi criada.

0906:A identifica faixa externa do costado;B é acesso interno ao convés junto ao carretel;C é abertura entre apoios;D é geometria de escadas combinadas;E é componente antitorção. Essas outras áreas/componentes podem ser relevantes em seus contextos,mas não são o objeto do recorte da saliência. Cinco justificativas de cada pergunta persistidas em distractor_analysis.

## Precedência, estados e diversidade

0218/0616/0906 já estavam ativas e tinham o principal como fonte efetiva,sem restauração prevalente. Novos objetos atravessam reformulateLeakingStem/normalizeEditorialStem integralmente intactos,auditQuestion sem issues,política active=true. Nenhuma flag de aprovação,alteração de normalizador ou relaxamento de heurística.

0417 inalterada e ausente runtime:política bruta active=true,depois das transformações anteriores stem-quotes-source-answer.0079 física legada excluída por legacy-generator;versão efetiva já restaurada é old-239(material dos cabos laterais),preservada.1152 ausente por legacy-tag:revisao-contextual-v2;1334 explicitamente inativa/quarentenada antes deste lote. Nenhuma nova quarentena,ativação ou conferência contabilizada para esses quatro IDs. As três variantesold-248 não devem coexistir na mesma prova;prevenção semântica global e rechecagem independente pendentes. Não se alterou regime existente de três modelos.

## Validação

Build completo isolado com insumos estáveis `npm run build`:exit0,compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada;seis artefatos gerados idênticos. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:110 deltas exatos acumulados,11.992 cadernos e todas1.984PSCPP intactos contra baseline congelada;composição ativa preservada;240 proposições renderizadas e250 opções diretas preservadas. Nenhuma asserção relaxada:apenas IDs documentados acrescidos aos contratos de fonte/direta.

Entre048 e049,somente0218/0616/0906 mudam no principal e inventário efetivo. Objetos principais integralmente iguais ao runtime; todos110 hashes corrigidos correspondem ao inventário. Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0079/0417/1152/1334,restaurações e demais objetos intactos. Sem ativação,nova quarentena ou alteração de regime de três modelos. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos,REVISOES_EDITORIAIS.jsonl inalterado. Testes estruturais não substituem rechecagem independente,programa/edital,revisão semântica global e consolidação normativa completa.

Acumulado110 IDs corrigidos distintos,113 conferências bibliográficas parciais,zero aprovações finais. Triagem195 sem proposições,77 localizadores;58 candidatos corrigidos,3 falsos positivos anteriores sem mudança,52 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102cadernos+1.984PSCPP),13.715 IDs únicos preservados. Próxima independenteANV-0221,marcação dos quartéis,Fonseca v2 10.14. Pares0142/0840 e0176/0874 com fonte pendente,sem recontagem de buscas. Todos8 gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

# Lote 050 — pintura e marcas dos quartéis da amarra

Base remota `2e7e34c186c9d2bbc8beef0dafd746b8fac6ee66`; HEAD remoto e PR #172 aberto/draft consultados antes de editar. CHECKPOINT049 e relatório049 lidos após fast-forward. Árvore rastreada inicialmente limpa; temporários não rastreados preservados. Nenhum lote publicado refeito ou commit duplicado. Enumeração de processos falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Insumos e árvore são comparados por hashes; publicação exige expected_sha sem force e deve parar diante de divergência detectável.

## Fonte primária e limites

Fonseca, Arte Naval v.2,8ªed.(2019),10.14,pp.723–725/PDF84–86. Três páginas lidas em texto/imagens; tabela p.724/PDF85 e comentários p.725/PDF86 conferidos visualmente. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

A introdução inclui o quartel do tornel no primeiro em ambos os métodos. A tabela distingue o primeiro método por elos brancos/voltas de arame e o segundo pelas manilhas vermelha,branca,azul nos três primeiros quartéis,com repetição nos seguintes apresentados. O comentário trata de distinguir quartéis adjacentes,da dificuldade de contagem na largada rápida,do aviso por elos amarelos e de limpeza/repintura condicionadas. Cores repetidas não são identificadores únicos de todos os quartéis. Não se universaliza o esquema a qualquer embarcação; as perguntas se referem aos métodos da obra.

A figura10-14,p.723/PDF84,é sobre dimensões/passo da amarra,anterior ao item10.14; não foi tratada como diagrama da marcação. O arranjo visual das células inferiores da tabela não foi usado para inferir uma correspondência nova e exclusiva entre cada último quartel e cores de aviso. O aviso amarelo cobrado emM1 é explicitamente descrito no comentário da p.725. Não se calculou metragem por uma cor isolada,nem se adotou a tabela inteira de comprimentos como equivalência universal. As perguntas são autossuficientes em palavras; nenhuma figura/tabela ausente é indispensável. Nenhum livro ou imagem foi publicado. Programa/edital,bibliografia oficial,identidade dos anexos e rechecagem independente seguem pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0221 | I–IV desapareciam no carregamento; misturavam função,trecho de amarra e fixação interna; explicação genérica. | Restauradas quatro proposições específicas sobre repetição de cores,branco no2º/5º,inclusão do tornel e variação das marcas no primeiro método; explicação,cinco justificativas,páginas/hash. |10.14,pp.723–725/PDF84–86;tabela p.724/PDF85. | A mantido;F/V/V/F |
| ANV-0619 | Comando genérico e definições heterogêneas,sem justificar cada distrator; não avaliava os limites da leitura de uma cor. | Caso de manilha branca sem sequência anterior;cinco interpretações comparáveis;D reconhece que branco não distingue2º/5º;explicação e cinco justificativas. |Tabela p.724/PDF85 e comentário p.725/PDF86. | D mantido |
| AN-C10-1014-M1 | Explicação reproduzia IV falsa sob introdução de conteúdo correto;quatro justificativas genéricas;grafia tornei;nívelL4 sem exigência correspondente. | Corrigida grafia para tornel;explicação identifica IV falsa e aviso de apenas um quartel;cinco justificativas específicas,páginas/hash;Médio/L2 propostos. Quatro proposições e formato combinadas preservados. |10.14,pp.723–725/PDF84–86;aviso amarelo p.725/PDF86. | E mantido;V/V/V/F |
| AN-C10-1014-M2 | Comando dependia de tabela não apresentada;distratores sem explicação individual;Difícil/L3 desproporcional à lembrança de cor. | Enunciado identifica método,objeto e terceiro quartel diretamente;mantidas cinco cores e resposta azul;justificativas específicas,páginas/hash;Fácil/L1 propostos. |Tabela p.724/PDF85. | B mantido |
| AN-C10-1014-M3 | Distrator sobre tinta reaproveitada pouco plausível;justificativas genéricas;afirmação de crescimento sem limitar linhas da tabela;nívelL4 excessivo. | LimitadaII aos seis primeiros quartéis;IV agora testa falsa exclusividade das cores;explicação e cinco justificativas,páginas/hash;Médio/L2 propostos. Mantido formatoV/F e sequência. |Tabela p.724/PDF85;comparação/manutenção p.725/PDF86. | A mantido;V/V/V/F |

Cinco correções primárias parciais,zero aprovações finais. IDs,chavesA/D/E/B/A,identidadesold-051/AN-C10-1014,tags,taxonomy e tracking preservados. FormatosB/A/B/A/C mantidos;regimeM1/M2/M3 do item10.14 integralmente preservado. Flags antigas active/validation_status/validation não foram tratadas como evidência desta auditoria nem recontadas como aprovação;REVISOES_EDITORIAIS.jsonl continua sendo o registro de aprovação final. Novos níveis são propostas,sem calibração histórica/psicométrica aprovada. Associação conceitual legada em0619 permanece no metadado de filtro,mas o formato estrutural é direta com caso. Não se troca a matriz obrigatória de matérias pelo benchmark.

## Julgamento e unicidade

0221:I falsa,vermelho também no4º;II verdadeira,branco no2º/5º;III verdadeira,tornel incluído no1º;IV falsa,as contagens variam com a ordem. SóA reúneII/III. B incluiIV falsa/omiteIII;C incluiI falsa/omiteIII;D incluiI falsa/omiteII;E incluiIV falsa/omiteII. Não se chama falsa por exclusão a antigaI sobre fixação interna: foi substituída por conteúdo pertinente e conferido.

0619:D reconhece a insuficiência da cor isolada para distinguir2º/5º. A troca a cor do1º;B dá exclusividade ao2º;C dá exclusividade ao5º;E inverte branco/azul. O cenário omite a sequência intencionalmente para testar esse limite,sem exigir um dado ausente para escolher entre duas respostas: a resposta correta reconhece precisamente a insuficiência.

M1:I/II/III verdadeiras,IV falsa,pois amarelo avisa apenas um quartel restante. A omiteIII;B incluiIV/omiteI/III;C incluiIV/omiteII;D incluiIV;E é o conjunto completo. M2:B azul;A branco2º/5º,C vermelho1º/4º,D amarelo é aviso nos elos,E preto não é indicado para a manilha do3º. Não se confunde pintura dos demais elos com a manilha.

M3:I/II/III verdadeiras,IV falsa pela repetição das cores. A V/V/V/F é única;B erraII,C erraI/IV,D erraIII/IV,E erraI/II. Julgamento,cinco justificativas e condição de possibilidade para manutenção persistidos. Não há cálculo numérico;ordens e repetições são conferidas nas linhas da tabela.

## Precedência e diversidade

Os cinco objetos já estavam ativos e têm o principal como fonte efetiva,sem restauração prevalente. Após edição,reformulateLeakingStem/normalizeEditorialStem preservam os objetos integralmente,auditQuestion sem issues,política active=true. Nenhuma heurística alterada ou flag nova de aprovação.

0420 inalterada e ausente runtime:política bruta active=true,depois das transformações anteriores stem-quotes-source-answer.0907 inalterada e ausente:bruta answer-leak:stem_answer_continuation,depois answer-leak:stem_answer_overlap.0010 física legada excluída por legacy-generator;versão efetiva já restaurada é old-038(fateixa),preservada. Nenhuma ativação,nova quarentena ou conferência contabilizada para esses três IDs.

Os cinco itens compartilham a competência de identificação dos quartéis,apesar de dois códigos temáticos legados. Não devem coexistir na mesma prova. O regime de três modelos foi conservado com seus formatos;não se confunde variedade de formato com diversidade de competência. Prevenção semântica global,conciliação de identidade físico/runtime e rechecagem independente continuam pendentes.

## Validação

Build completo isolado com insumos estáveis `npm run build`:exit0,compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada;seis artefatos gerados idênticos. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:115 deltas exatos acumulados,11.987cadernos e todas1.984PSCPP intactos contra baseline congelada;composição ativa preservada;252 proposições renderizadas e260 opções diretas preservadas.

Contrato adicional V/F paraM3 resolve a sequência derivada do vetor manual,exige quatro julgamentos em cada opção,sequências distintas e uma única correspondência com a chave. Não se relaxaram contratos anteriores de combinação/diretas nem de população/hash/fonte;apenas IDs documentados acrescidos. Vetor manual é evidência de leitura, não prova automática da verdade técnica. Os três formatosM1/M2/M3 foram conferidos e preservados;flagsvalidation antigas permanecem intactas,sem equivaler a aprovação final.

Entre049 e050,somente0221/0619/AN-C10-1014-M1/M2/M3 mudam no principal e inventário efetivo. Objetos principais integralmente iguais ao runtime;todos115 hashes corrigidos correspondem ao inventário. Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0010/0420/0907,restaurações e demais objetos intactos. Sem ativação,nova quarentena ou alteração do regime de três modelos. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086pendentes. Gate regenerado após inventário,todos hashes conferidos,REVISOES_EDITORIAIS.jsonl inalterado. Testes estruturais não substituem rechecagem independente,programa/edital,revisão semântica global e consolidação normativa completa.

Acumulado115 IDs corrigidos distintos,118 conferências bibliográficas parciais,zero aprovações finais. Triagem194 sem proposições,77 localizadores;59 candidatos corrigidos,3 falsos positivos anteriores sem mudança,56 correções fora dessa triagem.27.435 físicos,14.086ocorrências(12.102cadernos+1.984PSCPP),13.715IDs únicos preservados. Próxima independenteANV-0223,rendimento do aparelho,Fonseca v2 9.16. Pares0142/0840 e0176/0874 com fonte pendente,sem recontagem de buscas. Todos8gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

# Lote 051 — rendimento de aparelhos de laborar

Base remota `ad24083b4f850ce5be03a64eda2740bbfbaa430d`; HEAD remoto e PR #172 aberto/draft consultados antes de editar. CHECKPOINT050 e relatório050 lidos após fast-forward. Árvore rastreada inicialmente limpa e temporários preservados. Nenhum lote publicado refeito ou commit duplicado. Enumeração de processos falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Hashes de insumos/árvore e expected_sha sem force exigem suspender publicação diante de divergência detectável.

## Fonte, unidades e limites

Fonseca, Arte Naval v.2,8ªed.(2019),9.16,pp.673–675/PDF34–36;contexto9.15.e,p.672/PDF33. Quatro páginas lidas em texto/imagens,com fórmulas e figura9-22. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

O corpo define R=P/(nF),em que n conta partes de cabo junto ao cadernal móvel. A multiplicação real P/F é distinta de R. No modelo aproximado da p.674,F=P(1+0,10m)/n,com m roldanas em que o cabo labora. n e m são informados separadamente nos casos; não se igualam por definição. A hipótese soma parcelas de10% do peso P; não é o mesmo que encadear fatores0,90 nas tensões,como se os modelos fossem intercambiáveis. A obra também explicita dependência de rigidez/atritos,bitolas e dimensões,estimativas distintas conforme o cabo e variabilidade experimental.

Os enunciados novos usam peso e força emkgf,evitando chamar uma massa emkg de força sem explicação. A fonte usa a convenção antiga dekg em cálculos de peso/força; não se afirma que o PDF imprima kgf. Os dados600/200,800/250 e500kgf são didáticos novos. As perguntas não dimensionam nem certificam cabos,poleames ou operação real;taxas8%/10% permanecem estimativas da edição,sem universalização a qualquer aparelho.

A imagem da figura9-22 traz na quinta coluna a expressão F=15/15P e repete o título Estralheira singela nas duas últimas colunas. Esses detalhes foram registrados como discrepâncias visuais,não atribuídos apenas ao OCR nem declarados errata oficial. Não foram usados para definir respostas ou corrigir numeradores por suposição. Os casos usam o corpo9.16 e quatro partes/quatro roldanas explicitamente dadas. As tabelas9-3/4/5 são citadas na p.675,mas não foram integralmente conferidas neste lote. Nenhum livro ou imagem foi publicado;nenhuma figura ausente é exigida pelas questões. Programa/edital,bibliografia oficial,identidade dos anexos e rechecagem independente pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0223 | I–IV desapareciam;mistura de rendimento e descrição de aparelhos;explicação genérica. | Quatro proposições sobre R=P/(nF),força real,contagem e limite da aproximação;explicação e cinco justificativas,páginas/hash. |9.16,p.673/PDF34;condicionais p.674/PDF35. | C mantido;V/F/V/F |
| ANV-0621 | Comando genérico e definições heterogêneas,sem cinco justificativas. | Caso de600kgf,200kgf,n=4;R=75%;cinco resultados comparáveis com erros localizados;explicação e referência. |Definição p.673/PDF34;contexto9.15.e p.672/PDF33. | A mantido |
| AN-C09-916-M1 | Rotulado cálculo/L5,mas apenas reproduzia fórmula;distratores genéricos;PDFpage ausente. | Cálculo didático800/(4×250)=0,80;cinco expressões/resultados com justificativas;Médio/L3,página/hash. Formato calculation preservado e agora efetivamente aplicado. |9.16,p.673/PDF34. | B mantido |
| AN-C09-916-M2 | Confusão de massa/força,exemplo literal da obra,L5 fora da escalaL1–L4 e justificativas genéricas. | Novo peso500kgf;n=4,m=4 e hipótese explícitos;F=175kgf;cinco resultados e justificativas calculadas;Médio/L3,páginas/hash. |Modelo aproximado9.16,p.674/PDF35. | C mantido |
| AN-C09-916-M3 | Comparação de rendimento sem limitar modelo;justificativas genéricas eL4 excessivo. | Mantidas estimativas10%/8% com condições;IV testa tendência sob modelo mantido;derivaçãoR=1/(1+0,10m),cinco justificativas,páginas/hash;Médio/L2. V/F preservado. |9.16,pp.674–675/PDF35–36. | A mantido;V/V/V/F |

Cinco correções primárias parciais,25justificativas,zero aprovações finais. IDs,chavesC/A/B/C/A,taxonomy,tracking,tags e identidadesold-019/AN-C09-916 preservados. FormatosB/A/A/A/C;M1/M2 calculation eM3 true_false conservam o regime de três modelos. Níveis propostosL2/L3/L3/L3/L2,sem calibração histórica/psicométrica aprovada. As flags legadas validation_status=approved e validation dos modelos permanecem inalteradas e não foram aceitas como aprovação desta auditoria;REVISOES_EDITORIAIS.jsonl é o registro de evidência final. Associação conceitual legada em0621 é filtro,mas sua estrutura é direta com cálculo.

## Julgamento e cálculos reexecutados

0223:I verdadeira,definição com unidades compatíveis;II falsa,contagem não é rendimento;III verdadeira,com P/n fixos e positivos,R diminui quandoF aumenta;IV falsa,estimativa não é taxa exata universal. SóC reúneI/III. A incluiII/omiteIII;B incluiIV/omiteI;D incluiIV/omiteIII;E reúneII/IV falsas. A antigaII sobre redução de esforço não foi chamada falsa só por exclusão da chave: foi substituída por afirmação inequívoca.

0621:600/(4×200)=0,75=75%,A. B25% é complemento da eficiência;C300% vem deP/F ignorandon;D133,3% é o inverso;E8,3% vem deF/(nP). Rendimento é adimensional e F é força real,distinta deP/n ideal. Nenhuma capacidade segura foi deduzida.

M1:800/(4×250)=0,80,B;P/F=3,20(A) é multiplicação real;F/(nP)=0,078125(C) troca grandezas;nF/P=1,25(D) inverteR;nP/F=12,80(E) usa o fatorn do lado errado. Todos os valores das opções foram reexecutados. M2:4×0,10×500=200kgf;F=(500+200)/4=175kgf,C. A125 ignora resistências;B150 conta2 parcelas;D200 conta6;E250 duplica o ideal em vez de aumentá-lo40%. Sem arredondamento na resposta correta. Não se copiou o dado400 do exemplo do livro.

M3:I/II/III verdadeiras;IV falsa. No modelo aproximado,R=P/[n×P(1+0,10m)/n]=1/(1+0,10m);aumentarm positivo aumenta o denominador e reduzR. A V/V/V/F é única;B erraII,C erraI/IV,D erraIII/IV,E erraI/II. A derivação não compara universalmente equipamentos de tipos/construções diferentes.

## Precedência e diversidade

Os cinco itens já ativos têm o principal como fonte efetiva,sem restauração prevalente. Os objetos corrigidos atravessam reformulateLeakingStem/normalizeEditorialStem integralmente intactos,auditQuestion sem issues e política active=true. Nenhum normalizador,heurística ou flag nova de aprovação.

0422 inalterada e ausente runtime:política bruta active=true,após transformações anteriores stem-quotes-source-answer. Nenhuma ativação,nova quarentena ou conferência contabilizada para ela. Os cinco itens compartilham a competência de rendimento,apesar de dois códigos temáticos;variantes não devem coexistir na mesma prova. Formatos variados não substituem diversidade de competência. Prevenção semântica global e rechecagem independente continuam pendentes.

## Validação

Build completo isolado final com insumos estáveis `npm run build`:exit0,compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs,incluindo regressão,iguais byte a byte à cópia testada;seis artefatos gerados idênticos. Após acabamento de espaçamento das explicações,geração/testes e build foram repetidos com os hashes finais;resultados intermediários não validam a árvore final. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build:120 deltas exatos acumulados,11.982cadernos e todas1.984PSCPP intactos contra baseline congelada;composição ativa preservada;260 proposições renderizadas e275 opções diretas preservadas.

Três contratos de cálculo verificam unidadeskgf,coordenadas do enunciado e equações;0621/M1 também conferem o valor exibido da resposta e R em(0,1];M2 confere força e hipótese de quatro roldanas. ContratoV/F preserva quatro julgamentos por opção,sequências distintas e única correspondência com a chave. Nenhuma asserção anterior foi relaxada;apenas IDs documentados e verificações adicionais. Vetores manuais e testes não substituem verdade bibliográfica ou rechecagem independente. Regime de três modelos,formatos calculation/calculation/true_false e flags legadas preservados,sem aprovação editorial final.

Entre050 e051,somente0223/0621/AN-C09-916-M1/M2/M3 mudam no principal e inventário efetivo. Objetos principais integralmente iguais ao runtime;todos120 hashes corrigidos correspondem ao inventário. Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Metadados de topo,0422 e demais objetos/restaurações intactos. Sem ativação ou nova quarentena. Matriz exata100=25/25/10/10/10/10/10 preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086pendentes. Gate regenerado após inventário,todos hashes conferidos,REVISOES_EDITORIAIS.jsonl inalterado. Programa/edital,revisão semântica global,consumidores/offline e consolidação normativa completa pendentes.

Acumulado120 IDs corrigidos distintos,123 conferências bibliográficas parciais,zero aprovações finais. Triagem193 sem proposições,77 localizadores;60 candidatos corrigidos,3 falsos positivos anteriores sem mudança,60 correções fora dessa triagem.27.435 físicos,14.086ocorrências(12.102cadernos+1.984PSCPP),13.715IDs únicos preservados. Próxima independenteANV-0227,atracação com corrente pela proa,Fonseca v2 12.28. Pares0142/0840 e0176/0874 com fonte pendente,sem recontagem de buscas. Todos8gates pendentes/falhos,merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

# Lote 052 — atracação com corrente pela proa

Base remota `31a8891635baac0d5ee47804cbfd04ceeb958da7`; HEAD e PR #172 aberto/draft consultados antes de editar. CHECKPOINT051 e relatório051 prevalecem sobre o prompt antigo. Fast-forward da árvore rastreada limpa, sem commit duplicado; temporários preservados. A enumeração global de processos falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Comparação de insumos/árvore e publicação com expected_sha, sem force, exigem parar diante de divergência detectável.

## Fonte e escopo

Fonseca, Arte Naval, v.2, 8ª ed.(2019),12.28,pp.830–831/PDF191–192. Contexto12.26/12.27,p.829/PDF190 e contraste12.29/12.30,p.831/PDF192. Três páginas integralmente lidas em texto/imagens; figuras12-15 e12-16 conferidas visualmente. Na12-15, o sentido da seta e a proa desenhada são compatíveis com a aproximação contra a corrente;12-16 apresenta o contraste de corrente pela popa. Nenhuma distância/escala, potência, esforço de espia ou ângulo foi deduzido dos desenhos. Não se exige figura ausente no enunciado.

SHA256 do PDF recalculado: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Nenhum livro/imagem publicado. Esta é conferência da edição2019, não comprovação de identidade binária com cópias oficiais, vigência programática/edital ou certificação de manobra real.

O texto começa com corrente paralela ao cais e proa contra ela, distância razoável e velocidade que permita parar um pouco a vante do lugar de atracação. A espia inicial é lançante de proa; leme para o bordo do cais, queda com a corrente aguentada pela espia e máquina se necessária. A vantagem descrita distingue maior velocidade na máquina/ação do leme de velocidade relativa ao cais. Não se impõe velocidade universal nem parada instantânea.

Na continuação com bastante correnteza, o ferro é o de fora, bem a vante do lugar, combinado com espia pelo bordo de dentro, podendo ser espringue de proa. O través de proa e espringue de popa são passados depois, logo que possível. A ressalva de corrente muito forte para navios grandes sem rebocador foi preservada; não se confundem as duas condições nem se interpreta melhora de governo como eliminação de perigo. A obra ainda recomenda observar abatimento com alinhamento de objetos de bordo e ponto de terra; não se afirma que a corrente elimine todo abatimento.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0227 | I–IV apagadas no carregamento; definições de contrabordo/defensa misturadas; justificativa genérica. | Quatro proposições sobre orientação, governo, lançante inicial e queda controlada; explicação e cinco justificativas; páginas/hash; Médio/L2 proposto. |12.28,p.830/PDF191; ressalva p.831/PDF192.|B mantido;F/V/F/V|
| ANV-0625 | Comando genérico no runtime e alternativas de classes diferentes, sem justificativas individuais. | Pergunta autossuficiente sobre a espia inicial; cinco espias comparáveis; distinção das etapas posteriores; explicação e cinco justificativas; páginas/hash; L2 proposto. |12.28,p.830/PDF191; contraste de etapas p.831/PDF192.|E mantido;lançante de proa|
| ANV-0909 | Fragmento/OCR no original; simples nomeação rotulada situação difícil; alternativas heterogêneas. | Caso de estudo da variante com bastante correnteza; cinco combinações comparáveis de ferro, posição e bordo da espia; ressalva sobre corrente muito forte; cinco justificativas/páginas/hash; Médio/L3 proposto. |12.28,p.831/PDF192.|D mantido;ferro de fora,bem a vante,espia de dentro|
| AN-C12-1228-M1 | I–IV apagadas no runtime; comando por artigo; explicação repetitiva sem análise dos distratores. | Restituição de quatro proposições autossuficientes; IV testa inversão do bordo do leme; explicação e cinco justificativas/páginas/hash; Médio/L2. |12.28,p.830/PDF191.|B mantido;V/V/F/F|
| AN-C12-1228-M2 | Enunciado curto, distratores absolutos pouco comparáveis; explicação só repetia a resposta. | Contexto e cinco relações comparáveis entre máquina,leme e velocidade relativa ao cais; explicação e cinco justificativas/páginas/hash; Médio/L2. |12.28,p.830/PDF191.|C mantido|
| AN-C12-1228-M3 | Explicação apenas repetia as proposições sem julgar cada uma; contraste de corrente forte sem ressalva precisa; sem cinco justificativas. | V/F preservado; escopo inicial/variante explicitado; III passa a testar a falsa dispensa de rebocador em corrente muito forte; julgamento individual e cinco justificativas/páginas/hash; Médio/L2. |12.28,pp.830–831/PDF191–192.|D mantido;V/V/F/V|

Seis correções primárias parciais,30 justificativas,zero aprovações finais. Alternativas/chaves dos dois combinados e V/F preservadas; opções das três diretas reescritas. Nenhum cálculo ou dado numérico novo. IDs,tracking,taxonomy,tags,provenance e validação legada dos modelos preservados. A data legada final_editorial_audit não foi aceita como aprovação. Regime de três modelos assertion_combination/conceptual/true_false intacto. NíveisL2/L2/L3/L2/L2/L2 são propostos,sem calibração histórica ou psicométrica aprovada.

## Julgamento e unicidade

0227:I falsa por inverter a orientação;II verdadeira pela distinção de velocidades;III falsa por trocar o lançante inicial;IV verdadeira pela queda controlada. B reúne exatamenteII/IV. A incluiIII/omiteII;C incluiIII/omiteIV;D incluiI/omiteII;E reúneI/III falsas. Não se inferiu falsidade apenas por exclusão da chave anterior.

0625:E é o lançante de proa. A troca pela popa;B/C antecipam espias da continuação;D não é a espia inicial indicada. 0909:D é a combinação do texto;A inverte os dois bordos;B desloca o ferro para ré;C muda o bordo da espia;E muda o ferro. Esses distratores são falsos como reprodução da variante específica, não declarações de impossibilidade em todas as manobras.

M1:I/II verdadeiras;III inverte proa/popa;IV troca bordo do cais por bordo de fora. SóB reúneI/II;A incluiIII/omiteII;C incluiIV/omiteI;D reúneIII/IV;E inclui ambas falsas. M2:C preserva a vantagem;A exige aumento relativo ao cais;B/E diminuem ação do leme;D inverte a relação de velocidade na máquina. As alternativas são avaliadas pelo que a edição destaca, não por uma simulação universal de dinâmica.

M3:V/V/F/V. D é única;A erra2/3/4;B erra1/3/4;C erra1/2/3;E erra3. A terceira contraria expressamente a ressalva sobre navios grandes/corrente muito forte; as verdadeiras conservam condições e etapas da obra.

## Precedência e diversidade

As seis versões já eram ativas e provenientes do principal. Restaurações e extensões não prevalecem sobre esses objetos; todos os objetos finais atravessam as duas transformações integralmente intactos. Localizadores permanecem em metadados; removidos dos comandos quando levavam o normalizador a apagar proposições. Nenhum normalizador,política ou flag de aprovação foi alterado.

0426 continua inalterada e ausente runtime: política bruta ativa,mas após as duas transformações pré-existentes fica excluída por stem-quotes-source-answer. Sem ativação,quarentena nova ou conferência contabilizada. Identificadores old-111 e anv2-12.28 se sobrepõem em competência; os seis itens não devem coexistir na mesma prova. Isso está registrado para deduplicação semântica global ainda pendente. Não se substitui diversidade de competência pela variedade de formatos.

## Validação e pendências

Build completo isolado com insumos finais estáveis: `npm run build`,exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e os seis artefatos gerados foram comparados byte a byte com a cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois do build:126 deltas acumulados exatos,11.976 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;272 proposições renderizadas e290 opções diretas preservadas. Matriz exata100=25/25/10/10/10/10/10 preservada. Inclusão dos novos IDs no contrato correto e V/F com quatro julgamentos,sequências distintas e chave única;nenhuma asserção anterior relaxada.

Entre051 e052,somente os seis IDs da tabela mudam no principal/inventário efetivo. Objetos finais iguais integralmente ao runtime;metadados de topo,0426 e demais objetos intactos;restaurações/extensões não alteradas. Todos126 hashes corrigidos correspondem ao inventário. Hashes antes/depois no CORRECOES_RUNTIME.json e CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa inalterada;nenhuma ativação ou quarentena nova.

Falhas reais: test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1,77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado depois do inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado126 IDs distintos corrigidos,129 conferências primárias parciais,zero aprovações finais. Triagem191 sem proposições e77 localizadores;62 candidatos corrigidos,3 falsos positivos anteriores sem mudança e64 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0235,altura metacêntrica,Fonseca v1 2.33. Impedimentos0142/0840 e0176/0874 mantidos,sem recontagem.

Rechecagem independente,programa/edital oficial,bibliografia integral,prevenção semântica,consumidores/offline e SQL/produção continuam pendentes. Todos os oito gates pendentes/falhos e merge_permitted=false. Sem merge,deploy ou mutação de produção/usuários.

# Lote 053 — altura metacêntrica transversal

Base remota `4523a9c1fd0618629021d6a7af5568ee3bf5b62e`; HEAD e PR #172 aberto/draft consultados antes de editar. CHECKPOINT052 e relatório052 lidos. Árvore rastreada inicialmente limpa e temporários preservados;fast-forward sem commit duplicado. Enumeração de processos falhou com `fatal library error, lookup self`;não se afirma inspeção global bem-sucedida de escritores. Comparação de insumos/árvore e expected_sha sem force exigem suspender publicação se houver divergência detectável.

## Fonte e limites

Fonseca,Arte Naval,v.1,8ªed.(2019),2.33,p.89/PDF89;contexto2.29,pp.87–88/PDF87–88;contraste2.31,p.88/PDF88;figura2-7 e2.21,p.82/PDF82. Quatro páginas lidas integralmente em texto/imagens;figuras2-7,2-10 e2-11 conferidas. Nenhum comprimento foi medido na imagem:os números da nova questão são dados didáticos explícitos. A leitura da p.82 não abrange a continuação de2.22 na p.83.

SHA256 recalculado `792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20`;Drive`1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N`. Livro e imagens privados não publicados. Programa/edital oficial e identidade binária dos anexos/cópias oficiais continuam pendentes.

A definição2.33 distingue GM(transversal) de MC,raio metacêntrico em2.31. A figura2-7 permite distinguir G,M,C e Z;GZ é braço de endireitamento. A p.88 apresenta GZ=GM senθ e momentoW.GZ;as questões limitam a análise ao equilíbrio inicial/aproximação metacêntrica,sem extrapolar para grandes ângulos nem inferir que GM positivo certifica todos os critérios de estabilidade.

Na p.87,um parágrafo emprega centro de flutuação/CF e fala em qualquer ângulo,enquanto o contexto define o limite inicial e limita a invariância prática a pequenos ângulos de formas usuais. Essa formulação não foi usada como premissa universal nem convertida em errata oficial. As correções se apoiam na definição2.33,na distinção2.31,na figura e no contexto inicial de2.29. Não se afirma metacentro fixo para toda inclinação ou toda geometria.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0235 | I–IV desapareciam no runtime;misturavam altura metacêntrica,boca e comprimento;explicação genérica. | Quatro proposições autossuficientes distinguem GM,MC,GZ e equilíbrio inicial;explicação e cinco justificativas,páginas/hash;Médio/L2 proposto. |2.33,p.89/PDF89;2.29/2.31,pp.87–88/PDF87–88;fig2-7,p.82/PDF82.|E mantido;F/V/V/F|
| ANV-0633 | Comando genérico e opções de classes diferentes;sem cinco justificativas. | Caso com mesma referênciaK:alturas7,8m e6,6m;GM=1,2m;cinco resultados/erros comparáveis,explicação e cinco justificativas,páginas/hash;Médio/L3 proposto. |2.33,p.89/PDF89;fig2-7,p.82/PDF82 e contexto2.29.|C mantido;1,2m|

Duas correções primárias parciais,dez justificativas,zero aprovações finais. IDs,taxonomy,tracking,tags,estilos e chavesE/C preservados. A estrutura de0633 passa a direta com cálculo,compatível com sua associação conceitual;nenhum grupo de três modelos foi removido ou alterado. Não se localizou grupoAN-C02 correspondente por metadados exatos de item/tópico;isso não comprova ausência global de variantes semânticas. Níveis propostos,sem calibração psicométrica/histórica aprovada. Nenhuma flag nova de aprovação.

## Julgamento e cálculo

0235:I falsa,MC é raio,com origem no centro de carena e não emG;II verdadeira no equilíbrio inicial delimitado;III verdadeira pela definiçãoGM;IV falsa,confundeGM comGZ e ignora a dependência angular/limite da aproximação. SóE reúneII/III. A incluiI/omiteII;B incluiIV/omiteII;C incluiI/omiteIII;D reúneI/IV falsas. As proposições antigas sobre largura/extremos não foram tratadas como conferidas apenas porque a chave as excluía:foram substituídas por erros específicos da competência.

0633:os pontosG eM estão explicitamente na mesma vertical e suas alturas usamK comum. GM=7,8−6,6=1,2m positivo,C. A14,4m soma em vez de subtrair;B−1,2m inverte a subtração e indicaM abaixo deG;D6,6m repeteKG;E7,8m repeteKM. A indicação textual na alternativa negativa distingue também a posição relativa e evita que a normalização pré-existente,que remove sinais na comparação de opções,confundaB/C. Nenhuma política foi alterada. O contrato numérico confere dados do enunciado,ordem das alturas,tolerância de1e−12 e valor exibido da resposta. Não há inferência deGM a partir de uma figura em escala nem conclusão de conformidade de uma embarcação real.

## Precedência e ocorrências relacionadas

0235/0633 já eram ativas e provenientes do principal;nenhuma restauração/extensão com esses IDs prevalece. Os objetos finais atravessam reformulateLeakingStem e normalizeEditorialStem integralmente intactos,auditoria estrutural sem issues e política ativa. Isso não é aprovação editorial.0434 permanece inalterada e ausente runtime:bruta ativa,após transformações excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada para ela.

O inventário também identificou quatro ocorrênciasPSCPP relacionadas,em fontes físicas próprias. Seu conteúdo efetivo foi inspecionado para registrar pendências,sem revisão editorial/bibliográfica integral ou incremento nas contagens:

| ID relacionado,não corrigido | Pendência visível |
|---|---|
| pscpp::generated::anv::0117 | Cinco afirmativas existem no campo assertions e o classificador reconhece a estrutura;ausência no texto-base não prova falha de renderização.Nível5 legado e revisão técnica completa pendentes;nenhuma restauração de proposições declarada necessária apenas pelo texto-base. |
| pscpp::generated::anv-cap23::2-33::assert | Cinco afirmativas existem no campo assertions;I contém definição de comprimento e fragmento truncado,IV mistura altura do fundo com extremos longitudinais.Comando genérico e explicação só declara recálculo.Revisão integral/render específico pendentes. |
| pscpp::generated::anv-cap23::2-33::direct | Alternativa corretaB e explicação terminam em fragmento incompleto;distratores longos misturam outros itens/tabela. |
| pscpp::generated::anv::2696 | Cópia derivada de0633 em batch054;enunciado genérico,opções heterogêneas e nível5 legado. A edição do caderno não atualiza automaticamente essa fonte física separada. |

Os quatro registrosPSCPP e seus hashes foram preservados;não se afirma revisão completa de todas as suas proposições/estruturas. Não são novas correções,aprovações ou buscas de fonte contabilizadas. A relação semântica com0235/0633 exige prevenção de coexistência na mesma prova;deduplicação global e rechecagem independente permanecem pendentes. Não se aplica um patch a IDs de outro consumidor sem revisar sua identidade e precedência.

## Validação

Build completo isolado com insumos finais estáveis: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:128 deltas acumulados exatos,11.974 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;276 proposições renderizadas e295 opções diretas preservadas. Novo contrato verifica o cálculo e valor exibido deGM;nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre052 e053,somente0235/0633 mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos128 hashes corrigidos conferidos. Metadados de topo,0434,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa preservada;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado128 IDs distintos corrigidos,131 conferências primárias parciais,zero aprovações finais. Triagem190 sem proposições e77 localizadores;63 candidatos corrigidos,3 falsos positivos anteriores sem mudança e65 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0237,corrente da esteira,Fonseca v2 12.5. Quatro ocorrênciasPSCPP relacionadas aGM documentadas e preservadas,sem contagem de correção/revisão integral. Impedimentos0142/0840 e0176/0874 mantidos sem recontagem.

Todos os oito gates permanecem pendentes/falhos,merge_permitted=false. Rechecagem independente,100% da revisão ativa,programa/edital,bibliografia completa,deduplicação semântica,offline/SQL/produção e consolidação normativa pendentes. Sem merge,deploy ou mutação de dados de usuários.

# Lote 054 — corrente da esteira

Base remota `d756c32deef6fe6b375a92b8e8edb7ab1874166b`; HEAD e PR #172 aberto/draft consultados antes de editar. CHECKPOINT053 e relatório053 lidos. Árvore rastreada inicialmente limpa, fast-forward sem commit duplicado e temporários preservados. A enumeração global de processos falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Comparação de insumos/árvore e expected_sha sem force exigem parar diante de divergência detectável.

A finalização foi interrompida ao detectar um temporário não rastreado adicional. Os temporários originais e o novo arquivo foram preservados; tamanho,mtime eSHA256 do adicional permaneceram estáveis nas rechecagens. Sua origem não foi determinada. A investigação não detectou alteração inesperada nos insumos rastreados ou nos objetos efetivos; a comparação com a cópia testada e o HEAD remoto foi refeita antes de prosseguir. Não se presume ausência global de escritores nem se apaga trabalho para obter árvore limpa.

## Fonte e limites

Fonseca, Arte Naval, v.2, 8ª ed.(2019),12.5,p.797/PDF158, incluindo a tabela-resumo. Contrastes12.3/12.4,pp.795–797/PDF156–158 e limites12.6,p.798/PDF159. Quatro páginas integralmente lidas em texto/imagens; figuras12-2a/b/c conferidas como contexto de sucção/descarga, não como desenhos exclusivos da esteira. Nenhuma escala, velocidade ou força foi medida nas imagens. A leitura da p.795 começa com continuação de12.2; não se afirma leitura integral dessa seção neste lote.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro/imagens privados não publicados. Programa/edital oficial, identidade binária das cópias oficiais e rechecagem independente permanecem pendentes.

A origem da esteira é o arrastamento de água pelo movimento da carena. Isso difere do jato produzido pela rotação do hélice e das reações transversais das pás. O corpo12.5 descreve o perfil máximo na linha-d’água, decrescendo até a quilha; esse perfil é perguntado como descrição da edição, sem universalização a todos os cascos/regimes. O valor1/10 é atribuído a alguns autores e acompanhado de dificuldade de cálculo exato; não foi convertido em constante exata ou empregado em cálculo numérico novo.

Na marcha avante, o texto atribui redução do efeito do leme e, com navio em movimento/hélice bem mergulhado, menor sensibilidade da pressão lateral pela ação sobre as pás superiores. A tabela resume neutralização da pressão lateral e redução da ação do leme para navio de um hélice de passo direito. Esse resumo não significa eliminação de todas as forças laterais nem previsão universal da guinada total.12.6 recomenda experiências em cada navio; vento/corrente externos e instalações modernas não foram tratados como validados por este lote. A colunaAR da tabela não foi generalizada como ausência universal de esteira em qualquer operação a ré.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0237 | I–IV desapareciam no runtime;misturavam descarga,esteira e inversão de marcha;explicação genérica. | Quatro proposições autossuficientes sobre origem,perfil e efeito no leme;explicação,cinco justificativas,página/hash;Médio/L2 proposto. |12.5,p.797/PDF158;contraste12.3/12.4.|B mantido;F/F/V/V|
| ANV-0635 | Comando genérico e alternativas de classes diferentes. | Cinco associações comparáveis de origem/consequência,distinguindo atrito da carena de rotação do propulsor;explicação,cinco justificativas,página/hash;Médio/L2. |12.5,p.797/PDF158;contraste12.3,p.795/PDF156.|E mantido|
| AN-C12-125-M1 | Proposições apagadas no runtime;comando por artigo e explicação repetitiva. | Restauradas quatro proposições autossuficientes;IV distingue descarga e arrastamento pela carena;explicação,cinco justificativas,página/hash;Médio/L2. |12.5,p.797/PDF158;contraste12.3.|C mantido;V/V/F/F|
| AN-C12-125-M2 | Enunciado curto,distratores heterogêneos e explicação só repetia a resposta. | Delimitados marchaAV,passo direito e hélice mergulhado;cinco pares comparáveis de efeitos no leme/pressão lateral,com justificativas e referência;Médio/L2. |12.5 e tabela,p.797/PDF158;limite12.6,p.798/PDF159.|D mantido|
| AN-C12-125-M3 | Explicação apenas repetia proposições;III era inversão literal deI;sem análise individual. | V/F preservado;III testa falsa universalização do1/10,II explicita estimativa/dificuldade;explicação,cinco justificativas,página/hash;Médio/L2. |12.5,p.797/PDF158.|E mantido;V/V/F/V|

Cinco correções primárias parciais,25 justificativas e zero aprovações finais. IDs,chaves,taxonomy,tracking,tags,provenance e validações legadas dos modelos preservados. A data legada final_editorial_audit não foi aceita como aprovação. Regime de três modelos assertion_combination/conceptual/true_false intacto. NíveisL2 propostos,sem calibração histórica/psicométrica aprovada. Não houve cálculo novo nem substituição da matriz obrigatória por benchmark histórico.

## Julgamento e unicidade

0237:I falsa por trocar esteira por descarga;II falsa por inverter o perfil;III verdadeira pelo efeito no leme na marchaAV;IV verdadeira pela origem. SóB reúneIII/IV. A incluiI/omiteIII;C incluiI/omiteIV;D reúneI/II falsas;E incluiII/omiteIV. As proposições antigas não foram declaradas bibliograficamente conferidas apenas por concordarem com a chave anterior:foram substituídas por afirmações específicas do trecho.

0635:E associa carena/redução do efeito do leme. A conserva o efeito,mas troca a origem;B troca origem e efeito;C conserva origem,mas inverte o efeito;D conserva origem,mas nega a interação. As cinco opções têm o mesmo tipo de associação,sem comparar força,ambiente e nome de manobra como alternativas equivalentes.

M1:I/II verdadeiras;III inverte perfil;IV confunde origem com descarga e impõe propulsor acionado. SóC reúneI/II. A incluiIII/omiteII;B incluiIV/omiteI;D reúneIII/IV falsas;E inclui as duas falsas. M2:D preserva os dois efeitos no modelo delimitado. A erra leme;B erra pressão lateral;C erra ambos;E nega a redução do efeito do leme. Não se chama impossível um efeito real de qualquer instalação só por não reproduzir este modelo textual.

M3:V/V/F/V,únicaE. A erraII/III/IV;B erraI/III/IV;C erraI/II/III;D erraIII ao tornar exata/universal a estimativa. I é julgada como descrição da obra,II conserva sua ressalva eIV a origem;nenhuma constante hidrodinâmica universal foi criada.

## Precedência e diversidade

As cinco versões já eram ativas e provenientes do principal. Restaurações/extensões não prevalecem sobre esses IDs; todos os objetos finais atravessam as duas transformações integralmente intactos,auditoria estrutural sem issues e política ativa. Localizadores em metadados não substituem o objeto técnico no comando. Nenhuma heurística,política ou flag de aprovação foi alterada.

0436 permanece inalterada e ausente runtime:bruta ativa,após transformações pré-existentes excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada. Os cinco itens old-093/anv2-12.5 se sobrepõem em competência;variedade de formato não autoriza coexistência na mesma prova. Deduplicação semântica global e rechecagem independente continuam pendentes. Outros consumidores/fontes não recebem alteração por mera associação de título;nenhuma aprovação ou ausência global de variantes foi inferida.

## Validação

Build completo isolado com insumos finais estáveis: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:133 deltas acumulados exatos,11.969 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;288 proposições renderizadas e305 opções diretas preservadas. Contratos combinado/direto/VF mantêm unicidade e renderização;nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre053 e054,somente os cinco IDs da tabela mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos133 hashes corrigidos conferidos. Metadados de topo,0436,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa preservada;sem ativação ou nova quarentena. Três modelos e formatos preservados.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado133 IDs distintos corrigidos,136 conferências primárias parciais,zero aprovações finais. Triagem188 sem proposições e77 localizadores;65 candidatos corrigidos,3 falsos positivos anteriores sem mudança e68 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. PróximaANV-0253,propulsão azimutal,fonte declaradaFonseca v2 11.12 a verificar no corpo/edição antes de corrigir. Impedimentos0142/0840 e0176/0874 mantidos sem recontagem.

Todos os oito gates pendentes/falhos,merge_permitted=false. Permanecem100% da revisão ativa,rechecagem independente,programa/edital,bibliografia e normas completas,prevenção semântica,consumidores/offline/SQL e validação de produção. Sem merge,deploy ou mutação de dados de usuários.

# Lote 055 — âmbito dos trabalhos do marinheiro e impedimento de fonte azimutal

Base remota `0bf3252ba3863f4393351da46425e1b72dba9430`; HEAD e PR #172 aberto/draft consultados antes de editar. CHECKPOINT054 e relatório054 lidos. Fast-forward de árvore rastreada limpa sem commit duplicado; temporários preservados. Enumeração global de processos falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Hashes de insumos/árvore e expected_sha sem force exigem suspender publicação diante de divergência detectável nos insumos ou HEAD.

## Fonte corrigível e paginação

Fonseca, Arte Naval v.1, 8ª ed.(2019),8.1,p.[535]–536/PDF533–534. Duas páginas lidas integralmente em texto/imagens, incluindo figura8-1 como contexto da terminologia do cabo. A abertura do capítulo não tem numeral impresso; [535] é inferido por sua posição imediatamente anterior à p.536 impressa. PDF533 ePDF534 são localizadores exatos. Essa inferência aparece em source.page_note e na conferência bibliográfica, sem fingir numeral visível. Não foi exigida figura ausente para responder; nenhum comprimento/carga foi medido no desenho.8.2 começa no fim da segunda página, mas sua continuação não foi integralmente revisada neste lote.

SHA256 v.1 recalculado `792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20`;Drive`1LjlDejVyooU3QLJzF0COvAEnOgMDNC9N`. A definição abrange lonas e cabos, operações de prender/emendar/fixar e preparação para aplicação especial. A obra destaca prática intensa e o auxílio de figuras/explicações. A observação de que alguns trabalhos antigos têm caráter instrutivo/ornamental não descreve todos: o contexto destaca a utilidade da maioria.

As perguntas tratam desse âmbito geral, sem aprovar um nó para toda carga ou tomar a leitura como substituto de prática. Nenhum cálculo novo ou parâmetro de resistência foi criado. Livro/imagens privados não publicados. Edição-alvo,programa/edital oficial,identidade binária das cópias oficiais e rechecagem independente permanecem pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0254 | I–IV desapareciam no runtime e misturavam nós particulares com o conceito geral;explicação genérica. | Quatro proposições autossuficientes sobre materiais,finalidades,utilidade e prática;explicação,cinco justificativas,páginas/hash e nota de paginação;Médio/L2 proposto. |8.1,p.[535]–536/PDF533–534;[535] inferido,sem numeral impresso.|D mantido;F/V/F/V|
| ANV-0652 | Comando genérico e alternativas misturavam categoria geral com nós particulares. | Cinco descrições comparáveis do âmbito material/finalidade,com explicação e cinco justificativas;páginas/hash e nota de paginação;Médio/L2 proposto. |8.1,p.[535]/PDF533;contexto p.536/PDF534.|B mantido|

Duas correções primárias parciais,dez justificativas,zero aprovações finais. IDs,chavesD/B,tracking,taxonomy,tags e estilos preservados. NíveisL2 propostos,sem calibração histórica/psicométrica aprovada. Nenhuma flag nova de aprovação;regime de três questões por item não foi removido ou alterado. Não se localizou grupoAN-C08 do item exato por metadados; isso não comprova ausência global de variantes semânticas.

## Julgamento e unicidade

0254:I falsa por excluir lonas;II verdadeira pelo conjunto material/finalidades;III falsa por generalizar ornamentação a todos os trabalhos;IV verdadeira pela necessidade de prática e auxílio didático. SóD reúneII/IV. A incluiI/omiteIV;B incluiI/omiteII;C incluiIII/omiteII;E reúneI/III falsas. As proposições antigas sobre usos de nós não foram dadas como verificadas só por concordarem com a chave: foram substituídas por afirmações específicas da definição geral.

0652:B preserva lonas/cabos e prender/emendar/fixar/preparar. A exclui lonas;C exclui cabos;D restringe a ornamento e exclui fixação;E restringe a armazenamento e exclui preparação para aplicação especial. Não se afirma que um nó particular seja inútil: o erro das alternativas é restringir o âmbito geral da categoria.

## Impedimento de fonte — sem correção ou aprovação contabilizada

ANV-0253 eANV-0651 são versões ativas old-085 sobre propulsão azimutal,com principal como fonte física. A fonte declarada é Fonseca v.2,8ªed.(2019),11.12. SHA256 v.2 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.

Foram novamente conferidos texto/imagens do sumárioPDF11 e corpo p.776/PDF137. O sumário anuncia11.12 como sistema de governo de propulsão azimutal; o corpo11.12 é Mastros,na seçãoB depois de11.11Mastreação. A observação aplica a divergência já documentada emBUSCA_FONTE_PROPULSORES_032.json às identidades0253/0651; não representa nova busca bibliográfica global nem uma nova correção.

BUSCA_FONTE_AZIMUTAL_055.json registra hashes físicos/efetivos,escopo e disposição. Não foram validadas individualmente todas as alegações técnicas de propulsão azimutal nem uma figura técnica correspondente. O resultado não prova ausência do assunto em toda a obra/bibliografia,não resolve a edição/exemplar e não autoriza errata oficial,renumeração cega ou troca de competência. Busca ampla em outras fontes primárias continua pendente.

0253/0651 permanecem sem alteração,sem ativação/quarentena nova,sem aprovação e sem incremento nas conferências parciais. A pendência não impede revisar a fonte verificável de8.1. Será necessário obter passagem/exemplar verificável ou outra obra primária apropriada e reconciliar os metadados explicitamente antes de corrigir esses itens.

## Precedência e diversidade

0254/0652 já eram ativas e provenientes do principal;nenhuma restauração/extensão prevalece. Os objetos finais atravessam reformulateLeakingStem/normalizeEditorialStem integralmente intactos,auditQuestion sem issues e política ativa. Isso não é aprovação editorial;nenhuma heurística/política foi alterada.

0453/0918 permanecem inalteradas e ausentes runtime.0453 bruta excluída por answer_similarity_leak e,depois das transformações,por stem-quotes-source-answer;0918 excluída por answer_similarity_leak antes/depois. Nenhuma nova quarentena,ativação ou conferência contabilizada. Os dois corrigidos compartilham competência;variações de formato não autorizam coexistência na mesma prova. Deduplicação semântica global e rechecagem independente permanecem pendentes. Outros consumidores não foram corrigidos por mera coincidência de título.

## Validação

A primeira tentativa de build perdeu a sessão: a ferramenta informou cancelamento antes de decisão de aprovação de rede; não houve resultado/exit verificável e ela não foi contada como aprovada. A tentativa final isolada usou dependências locais e npm_config_offline=true,com telemetria desativada. `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:135 deltas acumulados exatos,11.967 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;292 proposições renderizadas e310 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre054 e055,somente0254/0652 mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos135 hashes corrigidos conferidos. Metadados de topo,0253/0651,0453/0918,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl;hashes bloqueados noBUSCA_FONTE_AZIMUTAL_055.json. Composição ativa preservada;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado135 IDs distintos corrigidos,138 conferências primárias parciais,zero aprovações finais. Triagem187 sem proposições e77 localizadores;66 candidatos corrigidos,3 falsos positivos anteriores sem mudança e69 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0256,transmissão hidráulica,Fonseca v2 11.5.b. Impedimentos0253/0651 documentados,sem incremento;0142/0840 e0176/0874 mantidos sem recontagem.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,prevenção semântica,consumidores/offline/SQL e validação de produção pendentes. Sem merge,deploy ou mutação de dados de usuários.

# Lote 056 — transmissão hidráulica de comando

Base remota `7caa2720c84731529df1fe071604ccb2db8183d2`; HEAD e PR #172 aberto/draft consultados antes de editar. CHECKPOINT055 e relatório055 lidos. Fast-forward de árvore rastreada limpa,sem commit duplicado;temporários preservados. Enumeração global de processos falhou com `fatal library error, lookup self`;não se afirma inspeção global bem-sucedida de escritores. Comparações de insumos/árvore e expected_sha sem force exigem parar diante de divergência detectável nos insumos ou HEAD.

## Fonte e escopo

Fonseca,Arte Naval v.2,8ªed.(2019),11.5.b,p.760/PDF121;contrastes11.5.a/c e contexto11.6,pp.760–762/PDF121–123. Contexto de servomotor11.4,p.759/PDF120. Quatro páginas integralmente lidas em texto/imagens,com figura11-5,p.762/PDF123. A leitura da p.759 começa na continuação do arranjo hidrelétrico; não se afirma leitura integral de11.4 neste lote. A figura foi conferida como cadeia transmissor/receptor/controle,sem medição de dimensões ou pressões.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro/imagens privados não publicados. Programa/edital oficial,identidade binária das cópias oficiais e rechecagem independente pendentes.

11.5.b descreve pressão líquida em tubulações protegidas,emprego de telemotor e possibilidade de transmissões duplas afastadas para garantia contra avarias. Ar na rede e gás em tubulações atravessando compartimentos de temperatura elevada são desvantagens expressas. A duplicação não foi convertida em obrigação universal de projeto ou garantia absoluta contra qualquer avaria.

11.6 distingue cilindro transmissor comandado pela roda e receptor atuando no mecanismo de controle do servomotor. A transmissão da ordem não é tomada como toda a instalação de potência que move a cana. Gualdropes em11.5.a e motores selsyn/condutores em11.5.c são contrastes de modalidades. Não se aprova uma instalação moderna por analogia nem se estabelece limite numérico de temperatura,gás ou pressão. Não houve cálculo novo ou certificação operacional.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0256 | I–IV desapareciam no runtime;II genérica misturava transmissão/atuação;explicação sem análise. | Quatro proposições autossuficientes distinguem gualdropes,telemotor/controle,duplicação,bolhas e tubulações;explicação,cinco justificativas,página/hash;Médio/L2 proposto. |11.5.b,p.760/PDF121;contraste11.5.a e11.6,p.761/PDF122,fig11-5.|A mantido;F/F/V/V|
| ANV-0654 | Comando genérico e alternativas sobrepostas: a antigaB descrevia o telemotor da própria modalidade hidráulica. | Cinco descrições comparáveis do meio líquido com condições de instalação/funcionamento;eliminada a competição entre categoria e componente;explicação,cinco justificativas,página/hash;Médio/L2. |11.5.b,p.760/PDF121;11.6,p.761/PDF122.|D mantido|
| AN-C11-115b-M1 | Proposições apagadas e comando por artigo;explicação repetitiva sem julgamento dos distratores. | Quatro proposições autossuficientes;contraste hidráulica/mecânica flexível e falhas por bolhas;explicação,cinco justificativas,página/hash;Médio/L2. |11.5.a/b,p.760/PDF121.|C mantido;V/V/F/F|
| AN-C11-115b-M2 | Comando dependente de artigo;resposta mais detalhada e explicação só repetitiva;sem cinco justificativas. | Comando autossuficiente e cinco condições de extensão comparável;desvantagens contrastadas com características/proteções;explicação,cinco justificativas,página/hash;Médio/L2. |11.5.b,p.760/PDF121;contexto11.6,p.761/PDF122.|D mantido|
| AN-C11-115b-M3 | Explicação só repetia proposições;comando por artigo e ausência de análise individual. | V/F preservado;cadeia transmissor/receptor/controle explicitada e contraste selsyn delimitado;explicação,cinco justificativas,página/hash;Médio/L2. |11.5.b/c,pp.760–761/PDF121–122;11.6 efig11-5,p.762/PDF123.|E mantido;V/V/F/V|

Cinco correções primárias parciais,25 justificativas,zero aprovações finais. IDs,chavesA/D/C/D/E,tracking,taxonomy,tags,provenance e validação legada dos modelos preservados. As marcas legadas final_audit/source_of_truth/editorial_explanation_repair não foram aceitas como aprovação desta auditoria. Regime de três modelos assertion_combination/conceptual/true_false intacto. NíveisL2 propostos,sem calibração histórica/psicométrica aprovada.

## Julgamento e unicidade

0256:I falsa por substituir tubulações/pressão por gualdropes;II falsa por fazer o receptor dispensar o controle e atuar diretamente na cana;III verdadeira por duplicação e prejuízo por bolhas;IV verdadeira pelo meio líquido/percurso protegido. SóA reúneIII/IV. B incluiII/omiteIV;C incluiII/omiteIII;D reúneI/II falsas;E incluiI/omiteIII. A antigaII sobre transformar movimento em rotação não foi chamada falsa só porque a chave a excluía: foi substituída pela inversão funcional explícita apoiada em11.6.

0654:D preserva meio,percurso e duplicação. A nega prejuízo por ar;B impõe redes obrigatoriamente juntas;C exige percurso sem proteção;E inverte a relação entre calor e formação de gás. A antigaB sobre conjunto transmissor/receptor não foi tratada como falsa: era compatível com o telemotor da modalidade,gerando sobreposição. As cinco opções novas distinguem condições do mesmo arranjo,em vez de oferecer componente e categoria como mutuamente exclusivos.

M1:I/II verdadeiras;III confunde gualdropes;IV nega os efeitos das bolhas. SóC reúneI/II. A incluiIII/omiteII;B incluiIV/omiteI;D reúneIII/IV;E inclui ambas falsas. M2:D identifica as duas ocorrências prejudiciais. A descreve proteção de percurso;B duplicação afastada;C meio de transmissão;E telemotor/controle. Essas características não foram consideradas garantias absolutas de funcionamento de qualquer sistema.

M3:V/V/F/V,únicaE. I conserva meio/percurso,II as desvantagens,III confunde transmissão elétrica com hidráulica eIV conserva a cadeia funcional. A erraII/III/IV;B erraI/III/IV;C erraI/II/III;D erraIII. Nenhuma figura ausente é necessária para responder à versão final.

## Precedência e diversidade

As cinco versões já eram ativas e provenientes do principal;nenhuma restauração/extensão prevalece sobre esses IDs. Todos os objetos finais atravessam as duas transformações integralmente intactos,auditQuestion sem issues e política ativa. Nenhuma heurística/política ou flag nova de aprovação.

0455 permanece inalterada e ausente runtime:bruta ativa,após transformações pré-existentes excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada. Os cinco corrigidos se sobrepõem na competência de transmissão hidráulica;os códigosold-079/anv2-11.5.b e formatos variados não autorizam coexistência na mesma prova. Prevenção semântica global e rechecagem independente pendentes. Demais consumidores não recebem alteração por mera associação de título.

## Validação

Build completo isolado com insumos finais estáveis,dependências locais e npm_config_offline=true: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido. Nenhuma interrupção anterior foi atribuída a esta tentativa.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:140 deltas acumulados exatos,11.962 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;304 proposições renderizadas e320 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre055 e056,somente os cinco IDs da tabela mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos140 hashes corrigidos conferidos. Metadados de topo,0455,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa e três formatos dos modelos preservados;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado140 IDs distintos corrigidos,143 conferências primárias parciais,zero aprovações finais. Triagem185 sem proposições e77 localizadores;68 candidatos corrigidos,3 falsos positivos anteriores sem mudança e72 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0262,prova de ruptura da amarra,Fonseca v2 10.16.b. Impedimentos0142/0840,0176/0874 e0253/0651 mantidos sem recontagem.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,prevenção semântica,consumidores/offline/SQL e validação de produção pendentes. Sem merge,deploy ou mutação de dados de usuários.

# Lote 057 — provas de resistência e de ruptura das amarras

Base remota `3ba4b4f4c5d5cf1daa5457220fcaf66f8d7e0a72`; HEAD e PR #172 aberto/draft consultados antes de editar. CHECKPOINT056 e relatório056 lidos. Fast-forward de árvore rastreada limpa sem commit duplicado;temporários preservados. Enumeração global de processos falhou com `fatal library error, lookup self`;não se afirma inspeção global bem-sucedida de escritores. Hashes de insumos/árvore e expected_sha sem force exigem parar diante de divergência detectável nos insumos ou HEAD.

## Fonte e delimitação

Fonseca,Arte Naval v.2,8ªed.(2019),10.16.a/b,pp.726–727/PDF87–88;contraste10.17.a,pp.727–728/PDF88–89. Três páginas integralmente lidas em texto/imagens. A figura10-15,p.726/PDF87,é contexto de elo de aço estampado,não desenho da prova de ruptura. Não foi exigida figura ausente para responder nem medida carga/comprimento em imagem. A p.728 termina com início de10.18;não se afirma leitura integral dessa seção neste lote.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro/imagens privados não publicados. Identidade binária das cópias oficiais,programa/edital e rechecagem independente pendentes.

10.16 apresenta duas provas de tração após a confecção:resistência em todos os quartéis,com esforço de cerca de dois terços da carga de ruptura nominal;e ruptura em um pedaço de três elos iguais aos da amarra confeccionada. O recozimento após a resistência exclui as amarras de aço estampado no texto. Essa exceção foi preservada.

Os enunciados delimitam a redação da edição2019. O esforço aproximado não foi convertido em fração exata universal ou carga admissível de trabalho. Não se aprovam amostragem,regras de aceitação,tratamento térmico ou fabricação de uma sociedade classificadora atual com base apenas nesse trecho. A antiga referência genérica a regras de fabricação/classificação foi substituída pela passagem efetivamente conferida. A leitura de10.17 serve ao contraste entre ensaio e inspeção;seus calendários e procedimentos não foram adotados como prescrição operacional atual. Nenhum cálculo novo foi criado.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0262 | I–IV desapareciam no runtime;amostragem vaga e mistura com prova de resistência e função de acessório;explicação genérica. | Quatro proposições autossuficientes distinguem corpo de três elos,tração,abrangência dos quartéis e inspeção;escopo2019,explicação,cinco justificativas,páginas/hash;Médio/L2. |10.16,pp.726–727/PDF87–88;contraste10.17.a.|B mantido;V/V/F/F|
| ANV-0660 | Comando genérico e alternativas misturavam ensaio com componentes/compartimentos. | Cinco procedimentos comparáveis,distinguindo tração em três elos de prova nos quartéis,compressão e observação sem esforço;explicação,cinco justificativas,páginas/hash;Médio/L2. |10.16.a/b,p.727/PDF88.|E mantido|
| AN-C10-1016-M1 | Explicação repetia proposições e distratores tinham justificativas genéricas;escopo amplo eL4 excessivo para a operação pedida. | Mantidas três proposições verdadeiras e exceção do aço estampado emIV;comando delimitado à edição,explicação e cinco justificativas específicas,hash;Médio/L2 proposto. |10.16,pp.726–727/PDF87–88.|A mantido;V/V/V/F|
| AN-C10-1016-M2 | Enunciado efetivo virava comando genérico;alternativas traziam nomes de ensaios sem justificativas individuais. | Comparação autossuficiente dos elementos ensaiados nas duas provas,com cinco pares homogêneos;explicação,cinco justificativas ehash;Médio/L2. |10.16.a/b,p.727/PDF88.|C mantido|
| AN-C10-1016-M3 | Justificativas genéricas eL4 desproporcional;condições pouco explícitas. | V/F preservado;caráter aproximado e três elos iguais explicitados,III conserva tração;explicação,cinco justificativas ehash;Médio/L2. |10.16,pp.726–727/PDF87–88.|B mantido;V/V/V/F|

Cinco correções primárias parciais,25 justificativas,zero aprovações finais. IDs,chavesB/E/A/C/B,tracking,taxonomy,tags,provenance e validações legadas preservados. As flags reviewed/source_verified/key_verified/program_alignment_checked e demais marcas legadas não foram aceitas como aprovação desta auditoria. Regime de três modelos assertion_combination/conceptual/true_false intacto;statements:null preservado. NíveisL2 propostos,sem calibração histórica/psicométrica aprovada. M1 eM3 já tinham proposições parseadas antes do lote:não se contabiliza uma restauração inexistente;as correções desses dois concentram escopo e análise editorial.

## Julgamento e unicidade

0262:I verdadeira pelo pedaço de três elos;II verdadeira pela distinção entre duas provas de tração;III falsa por transferir para ruptura o procedimento de resistência;IV falsa por substituir tração por inspeção apenas visual. SóB reúneI/II. A incluiIII/omiteI;C incluiIV/omiteII;D reúneIII/IV falsas;E incluiIII/omiteII. As proposições antigas sobre regras genéricas e torção não foram declaradas verificadas por coincidirem com a chave: foram substituídas por afirmações específicas da passagem.

0660:E conserva tração em três elos iguais. A descreve resistência à tração dos quartéis;B troca tração por compressão e o corpo por todos os quartéis;C/D substituem o ensaio por observação/medição sem tração. Não se declara que outros ensaios/inspeções sejam inexistentes ou inúteis;apenas não correspondem ao procedimento pedido.

M1:I/II/III verdadeiras;IV falsa porque inclui aço estampado no recozimento após a prova. A reúne as três verdadeiras;B omiteIII;C incluiIV/omiteI/III;D incluiIV/omiteII;E incluiIV. M2:C corresponde a todos os quartéis na resistência e três elos na ruptura. A inverte ambos;B erra resistência;D erra ruptura;E reduz três elos a um. Não se infere do corpo de três elos um plano moderno de amostragem que a fonte não descreve.

M3:V/V/V/F,únicaB. A erraII;C erraI/IV;D erraIII/IV;E erraI/II. O valor de dois terços permanece aproximado e ligado à prova de resistência,sem transformação em resultado de um cálculo novo ou carga admissível.

## Precedência e diversidade

As cinco versões já eram ativas e provenientes do principal;nenhuma restauração/extensão prevalece. Objetos finais atravessam as duas transformações integralmente intactos,auditQuestion sem issues e política ativa. Nenhuma heurística/política ou flag nova de aprovação.

0461 permanece inalterada e ausente runtime:bruta ativa,após transformações pré-existentes excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada. As cinco variantes old-053/AN-C10-1016 compartilham competência de provas das amarras;formatos e códigos distintos não autorizam coexistência na mesma prova. Prevenção semântica global e rechecagem independente pendentes. Demais consumidores não recebem correção por mera associação de título.

## Validação

Build completo isolado com insumos finais estáveis,dependências locais e npm_config_offline=true: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:145 deltas acumulados exatos,11.957 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;316 proposições renderizadas e330 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre056 e057,somente os cinco IDs da tabela mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos145 hashes corrigidos conferidos. Metadados de topo,0461,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa,três formatos,statements:null e flags legadas dos modelos preservados;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado145 IDs distintos corrigidos,148 conferências primárias parciais,zero aprovações finais. Triagem184 sem proposições e77 localizadores;69 candidatos corrigidos,3 falsos positivos anteriores sem mudança e76 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0263,servomotor elétrico,Fonseca v2 11.4.e. Impedimentos0142/0840,0176/0874 e0253/0651 mantidos sem recontagem.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,prevenção semântica,consumidores/offline/SQL e validação de produção pendentes. Sem merge,deploy ou mutação de dados de usuários.


# Lote 058 — servomotor elétrico por alavanca

Base remota `0ac5541e3b2f3cecf089073d015e87a2bfe4a3c1`; HEAD e PR #172 aberto/draft consultados antes de editar. Cópia local antiga, rastreada limpa, atualizada por fast-forward; CHECKPOINT057 e relatório057 lidos. Temporários preservados. A enumeração global por `ps` falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. A publicação exige hashes estáveis e expected_sha sem force, interrompendo diante de divergência detectável.

## Fonte e escopo

Fonseca, Arte Naval v.2, 8ª edição (2019), 11.4.e, pp.759–760/PDF120–121; contraste com mecanismo compensador em11.4.d, p.759/PDF120. Ambas as páginas integralmente lidas em texto e imagens. Não há figura própria exigida para essas respostas; a referência a figura no contexto hidrelétrico não foi usada para medições ou inferência de desenho ausente. Nenhum cálculo novo.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade binária dos anexos oficiais, programa/edital e rechecagem independente continuam pendentes.

A descrição de2019 relaciona direita/boreste, esquerda/bombordo e alavanca neutra/motor parado; o freio conserva o leme na posição desejada. Neutro do comando não é ordem de centralização do leme. A dispensa do compensador pertence à configuração da obra; não se generaliza a toda instalação elétrica moderna ou à ausência de realimentação em qualquer aparelho. As questões não certificam equipamentos nem estabelecem procedimentos de emergência.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0263 | I–IV apagadas no runtime, mistura com punhos/localização e explicação genérica. | Quatro proposições autossuficientes sobre controle, neutro, parada e freio; eliminada mistura; explicação, cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e, pp.759–760/PDF120–121.|C mantido;V/F/F/V|
| ANV-0661 | Comando genérico e sobreposição entre servomotor elétrico e categoria geral de servomotor. | Cinco associações comparáveis entre comando e resposta; explicado por que a antiga categoria geral não era simplesmente falsa; cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e, pp.759–760/PDF120–121.|A mantido|
| ANV-0921 | Fragmento de extração e mera identificação apresentada como situação aplicada; alternativas de categorias diferentes. | Caso de interrupção do giro sem retorno automático a meio; cinco procedimentos/resultados comparáveis, explicação e justificativas; páginas/hash; Médio/L3 proposto. |11.4.e, p.760/PDF121.|A mantido|
| AN-C11-114e-M1 | Proposições apagadas no runtime; explicação repetia inclusive as falsas sem julgá-las. | Quatro proposições autossuficientes, controles/estações/bordos versus marcha no neutro/compensador; explicação e cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e e contraste11.4.d, pp.759–760/PDF120–121.|D mantido;V/V/F/F|
| AN-C11-114e-M2 | Comando por artigo, resposta destacadamente longa e explicação apenas repetitiva. | Comando autossuficiente, cinco causas comparáveis, distinção entre freio e compensação; explicação e cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e e contraste11.4.d, pp.759–760/PDF120–121.|E mantido|
| AN-C11-114e-M3 | V/F aparecia como parágrafos sem blocos de proposições parseados; explicação não identificava a falsidade deIII. | V/F preservado, quatro itens estruturados; motor parado no neutro e limites da descrição explicitados; explicação e cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e, pp.759–760/PDF120–121.|A mantido;V/V/F/V|

Seis correções primárias parciais,30 justificativas,zero aprovações finais. IDs e chaves C/A/A/D/E/A preservados. M3 já continha os textos das afirmações antes do lote: não se afirma que esses textos estivessem apagados; a correção melhora estrutura e julgamentos. Os três modelos assertion_combination/conceptual/true_false e suas marcas legadas permanecem; as validações antigas não comprovam aprovação desta auditoria. Níveis propostos, sem calibração histórica/psicométrica aprovada.

## Julgamentos e unicidade

0263:I verdadeira pelo controle elétrico;II falsa por centralização automática;III falsa por marcha no neutro;IV verdadeira pela retenção por freio. SóC reúneI/IV. A incluiII/omiteIV;B reúneII/III falsas;D incluiIII/omiteI;E incluiII/omiteI.

0661:A corresponde aos bordos descritos;B inverte direita/esquerda;C confunde neutro com centralização;D inventa marcha no neutro/compensador;E inverte marcha e parada. A antiga alternativaB abrangia a categoria geral; sua falsidade não foi inferida da chaveA. Foi substituída por erro específico e verificável.

0921:A neutraliza o comando e conserva o ângulo por freio. B mantém ordem para boreste;C ordena bombordo;D inventa centralização;E inventa marcha e compensador. Não se extrapola o caso para falha de energia, frenagem de emergência ou instalação não descrita.

M1:I/II verdadeiras;III/IV falsas. A incluiIII;B incluiIV;C reúne duas falsas;D únicaI/II;E incluiIII/IV. M2:E combina interrupção no neutro e retenção pelo freio. A inventa molas;B mantém marcha;C transfere controle hidrelétrico;D inventa retorno automático ao centro.

M3:V/V/F/V,únicaA. B erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. A formulação ampla de controle foi mantida dentro da configuração da fonte, sem criar novos limites numéricos.

## Precedência, preservação e diversidade

As seis versões já eram ativas e vêm do principal. Nenhuma restauração/extensão prevalece. Objetos finais atravessam reformulateLeakingStem e normalizeEditorialStem intactos; auditQuestion sem issues e política ativa, sem novas flags, exceções ou relaxamento de heurísticas. ANV-0462 permanece inalterada e ausente runtime, pelo motivo preexistente answer-leak:stem_answer_continuation, sem nova ativação/quarentena ou conferência contabilizada.

As seis variantes old-076/anv2-11.4.e compartilham competência e não devem coexistir na mesma prova. Formatos ou IDs diferentes não autorizam repetição. Prevenção semântica global e rechecagem independente pendentes. Tracking/taxonomy legados que identificam v1 nos antigos IDs foram preservados para evitar migração parcial dos filtros; source v2 é explícito e a reconciliação global desses identificadores permanece pendente. Não se declara normalização integral da taxonomia.

## Validação e continuidade

Build completo isolado: `npm run build` exit0, compilação, lint/tipos,101 páginas/rotas confirmados; dependências locais, execução final com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. A primeira chamada por subprocess retornou0 sem evidência de compilação e foi rejeitada; a execução direta terminou0, mas sua saída foi truncada. A repetição com log integral confirmou as etapas, preservando as tentativas. O ENOTEMPTY antigo não é declarado resolvido.

Passaram as quatro gerações, validate-runtime-question-banks, validate-pscpp-exam-selection, test-question-source-provenance, validate-runtime-question-catalog, test-pscpp-audit-anv0005, triagem/inventário echeck:pscpp-bank. Regressão:151 deltas acumulados exatos,11.951 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;328 proposições renderizadas e345 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre057 e058,somente os seis IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;151 hashes corrigidos conferidos. Metadados de topo,0462,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado151 IDs distintos corrigidos,154 conferências primárias parciais,zero aprovações finais. Triagem182 sem proposições e77 localizadores:71 candidatos corrigidos+3 falsos positivos anteriores+182 restantes=256;80 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0269,atracação a contrabordo,Fonseca v2 12.37. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Todos os oito gates pendentes/falhos, merge_permitted=false. Revisão individual de100% das ocorrências ativas, rechecagem independente, programa/edital, bibliografia/normas completas, prevenção semântica, consumidores/offline/SQL e homologação de produção pendentes. Sem merge, deploy ou mutação de dados de usuários.


# Lote 059 — atracação a contrabordo

Base remota `9010ca41961fecf321a42e1e7acac5f7d10ca33b`; HEAD e PR #172 aberto/draft consultados antes de editar. Cópia local antiga rastreada limpa atualizada por fast-forward; CHECKPOINT058 e relatório058 lidos. Temporários preservados. A inspeção de processos não forneceu inventário global confiável: uma chamada teve saída truncada e a seguinte retornou `fatal library error, lookup self`. Não se afirma exclusão global de concorrência; hashes estáveis e expected_sha sem force impedem sobrescrever divergências detectáveis.

## Fonte e delimitação

Fonseca, Arte Naval v.2,8ª edição (2019),12.37,pp.837–838/PDF198–199. Ambas as páginas integralmente lidas em texto e imagens. Na p.838 foi lida também a parte disponível de12.38 para contraste; não se afirma leitura integral dessa seção neste lote. Não há figura própria em12.37; os casos são autossuficientes e não exigem reconhecer a posição geométrica da espia1 em desenho ausente. Nenhum cálculo novo, velocidade, ângulo ou distância numérica inventados.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade binária das cópias oficiais, programa/edital e rechecagem independente continuam pendentes.

O texto descreve aproximação paralela e contato a meio-navio, ponto inicial por anteavante do pau de jeque e primeira espia passada/encapelada antes de fechar a popa. Desaconselha parar com a proa encostada na altura do passadiço, por risco de avarias pelo ferro, e adquirir seguimento adiante com a proa em contato. No navio de duas máquinas distingue-se a ordem adiante da máquina de dentro, combinada com atrás na de fora para recuperar o paralelismo, de adquirir seguimento adiante com a proa encostada. A proibição não foi transformada em proibição de toda ordem adiante de máquina.

Na aproximação ao navio fundeado, o vento no V entre as proas abre-as e aproxima as popas. A passagem distingue essa situação da aproximação muito aguda e do rondar rápido da espia1. Os casos delimitam a configuração da edição2019; não se emitem instruções universais para qualquer navio/porto. A recomendação da obra sobre arrastar ferro com vento forte foi lida, mas não generalizada ou usada nas questões deste lote.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0269 | Proposições apagadas no runtime e mistura com planejamento/atracação mediterrânea; explicação genérica. | Quatro proposições autossuficientes sobre paralelismo, primeira espia, aproximação pela popa e ponto inicial; explicação e cinco justificativas; páginas/hash; Médio/L2 proposto. |12.37,p.837/PDF198.|D mantido;V/F/F/V|
| ANV-0667 | Comando genérico e alternativas misturavam manobra, vento e espia. | Cinco sequências comparáveis de ponto inicial,retinidas,primeira espia e fechamento da popa; explicação e cinco justificativas; páginas/hash; Médio/L2 proposto. |12.37,p.837/PDF198.|B mantido|
| ANV-0923 | Fragmento de extração e identificação apresentada como situação aplicada; opções heterogêneas. | Caso de vento no V entre proas na atracação ao navio fundeado; cinco efeitos geométricos comparáveis; explicação distingue aproximação aguda e rondar rápido da espia1; cinco justificativas; páginas/hash; Médio/L2 proposto. |12.37,pp.837–838/PDF198–199.|C mantido|
| AN-C12-1237-M1 | Proposições apagadas e comando dependente de artigo; explicação repetitiva. | Quatro proposições autossuficientes e julgamentos sobre paralelismo,ponto inicial,contato da proa e aproximação pela popa; cinco justificativas; páginas/hash; Médio/L2 proposto. |12.37,p.837/PDF198.|D mantido;V/V/F/F|
| AN-C12-1237-M2 | Explicação apenas repetia a resposta; alternativas sem justificativas e condições pouco delimitadas. | Caso explicitamente de duas máquinas; cinco condutas comparáveis; distinção entre ordem de máquina e seguimento com proa encostada; explicação e cinco justificativas; páginas/hash; Médio/L3 proposto. |12.37,p.837/PDF198.|E mantido|
| AN-C12-1237-M3 | Comando sem objeto e V/F sem blocos de proposições parseados; explicação repetia inclusive a falsa. | Objeto/edição explícitos,quatro itens estruturados e julgamentos individuais; risco pelo ferro esclarecido; cinco justificativas; páginas/hash; Médio/L2 proposto. |12.37,p.837/PDF198.|A mantido;V/V/F/V|

Seis correções primárias parciais,30 justificativas,zero aprovações finais. Chaves D/B/C/D/E/A preservadas. M3 já continha as afirmações textualmente: não se afirma que seus textos estivessem apagados; passaram a ser itens estruturados,com explicação efetivamente julgada. Três modelos assertion_combination/conceptual/true_false e respectivas marcas legadas preservados. Níveis propostos sem calibração histórica/psicométrica aprovada.

## Julgamentos e unicidade

0269:I/IV verdadeiras;II antecipa a popa à espia;III transforma erro em preferência. SóD reúneI/IV. A incluiIII/omiteI;B incluiII/omiteIV;C incluiII/omiteI;E reúneII/III falsas. As antigas características genéricas sobre defensas não foram declaradas verificadas apenas por coincidirem com a chave; foram substituídas por conteúdo encontrado em12.37.

0667:B conserva o ponto inicial e a primeira espia antes do fechamento da popa. A antecipa fechamento;C encosta a proa na altura do passadiço;D adota aproximação pela popa muito perto;E posterga retinidas/espia para depois do fechamento. 0923:C abre proas/aproxima popas;A inverte o efeito,com configuração relacionada a rondar rapidamente a espia1;B/D deslocam as duas extremidades no mesmo sentido relativo;E nega o giro descrito. Não se extrapola o resultado do vento a todo ângulo de aproximação.

M1:I/II verdadeiras eIII/IV falsas. A incluiIII;B incluiIV;C reúneIII/IV;D é únicaI/II;E inclui duas falsas. M2:E é a conduta a evitar;A é a opção de afastar/refazer com ambas atrás;B busca paralelismo;C passa retinidas;D preserva a sequência da espia. M3:V/V/F/V,únicaA;B erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII.

## Precedência e diversidade

As seis versões já eram ativas e vêm do principal. Nenhuma restauração/extensão prevalece. ANV-0468 permanece inalterada e ausente runtime: bruta ativa,após transformações excluída por stem-quotes-source-answer. Sem nova ativação/quarentena ou conferência contabilizada. As versões físicas antigas de0073/0100 mencionam contrabordo,mas suas restaurações efetivas já corrigidas tratam de parada atrás e atracação mediterrânea: não foram alteradas ou recontadas.

Todas as seis versões finais atravessam reformulateLeakingStem e normalizeEditorialStem integralmente intactas; auditQuestion sem issues e política ativa. Não houve exceção,flag nova ou relaxamento de heurística. A primeira redação provisória de0923 falhou nessa verificação por substituição genérica; foi ajustada e a verificação repetida. Uma execução preliminar da regressão antes do fechamento do ledger falhou e foi preservada separadamente; só se consideram os resultados finais com os seis contratos completos.

As variantes old-115/anv2-12.37 compartilham competência e não devem coexistir na mesma prova. A prevenção semântica global e a rechecagem independente continuam pendentes. Tracking/taxonomy legados com identificadores v1 foram preservados,com source v2 explícito e reconciliação global pendente; não se declara normalização integral dos filtros.

## Validação e continuidade

Build completo isolado com dependências locais: `npm run build` exit0,compilação,lint/tipos e101 páginas/rotas confirmados por log integral,com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. Não se declara resolvido o ENOTEMPTY antigo da árvore original.

Passaram as quatro gerações,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,triagem/inventário echeck:pscpp-bank. Regressão final:157 deltas acumulados exatos,11.945 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;340 proposições renderizadas e360 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre058 e059,somente os seis IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;157 hashes corrigidos conferidos. Metadados de topo,0468,versões físicas/efetivas de0073/0100,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado. A execução preliminar incompleta descrita acima não substitui estes resultados finais.

Acumulado157 IDs distintos corrigidos,160 conferências primárias parciais,zero aprovações finais. Triagem180 sem proposições e77 localizadores:73 candidatos corrigidos+3 falsos positivos anteriores+180 restantes=256;84 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0276,navio portando pela amarra,Fonseca v2 12.43. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,prevenção semântica,consumidores/offline/SQL e homologação de produção pendentes. Sem merge,deploy ou mutação de dados de usuários.


# Lote 060 — navio fundeado, amarra e confirmação de garra

Base remota `13c276e21d6da7a6f624fb7753bc4877e6aea915`; HEAD e PR #172 aberto/draft consultados antes de editar. Cópia local antiga rastreada limpa atualizada por fast-forward; CHECKPOINT059 e relatório059 lidos. Temporários preservados. Enumeração de processos por `ps -eo pid,comm` falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. A publicação exige hashes estáveis e expected_sha sem force e para diante de divergências detectáveis.

## Fonte e escopo

Fonseca,Arte Naval v.2,8ª edição (2019),12.43,pp.851–853/PDF212–214; contexto12.44.2,p.854/PDF215 para navio portando pela amarra sob vento/corrente. Quatro páginas integralmente lidas em texto e imagens. O item12.43 foi lido integralmente; os trechos de12.42/12.44 contidos nessas páginas não equivalem a leitura integral dessas outras seções. Não há figura necessária a estas respostas. Nenhum cálculo novo; cerca de90° é indicação textual,sem tolerância angular inventada ou exigência de exatidão matemática.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade binária das cópias oficiais,programa/edital e rechecagem independente continuam pendentes.

12.43 apresenta acompanhamento por pontos distintos e visíveis de terra,marcações com separação de cerca de90°,prumo,amarra e enfiamentos. A linha de prumo tesa para vante não é prova isolada definitiva: uma guinada pode produzir efeito semelhante e a obra recomenda outro processo de verificação. 12.44.2 descreve vento/corrente fazendo o navio portar pela amarra. A conclusão de que carga isolada não comprova garra ou ausência dela é uma inferência delimitada dessas passagens e da exigência de controlar a posição,não uma definição literal atribuída a12.43.

As questões delimitam a edição2019. Não convertem a indicação aproximada em norma universal,nem dispensam referências cruzadas,nem certificam uma instalação real. Foram lidas,mas não generalizadas em perguntas,a prática de sentir a amarra com o pé,a manobra com freio mal apertado e as ações de último recurso descritas no contexto. Não se criou questão dependente da tabela de filame da p.845,que não foi revalidada neste lote.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0276 | Proposições apagadas no runtime,mistura com rocega/ferro no escovém e explicação genérica. | Quatro proposições autossuficientes sobre carga na amarra,controle da posição e confirmação do prumo; explicação e cinco justificativas; páginas/hash; Médio/L2 proposto. |12.43,pp.851–852/PDF212–213;contexto12.44.2,p.854/PDF215.|A mantido;V/F/V/F|
| ANV-0674 | Comando genérico e alternativas misturavam estados,área de giro e recuperação de objetos. | Cinco interpretações comparáveis de tração,garra,guinada e vigilância; distinguida carga de diagnóstico isolado; explicação e cinco justificativas; páginas/hash; Médio/L2 proposto. |12.43,pp.851–852/PDF212–213;contexto12.44.2,p.854/PDF215.|D mantido|
| AN-C12-1243-M1 | Proposições apagadas e comando por artigo; explicação repetia julgamentos sem analisar cada erro. | Quatro proposições autossuficientes,ressalva da guinada explícita e geometria de controle; explicação e cinco justificativas; páginas/hash; Médio/L2 proposto. |12.43,pp.851–852/PDF212–213.|D mantido;V/V/F/F|
| AN-C12-1243-M2 | Explicação de três palavras e ausência de justificativas individuais; dificuldade elevada sem suporte. | Cinco separações angulares comparáveis,aproximação de90° delimitada à fonte,explicação causal e cinco justificativas; páginas/hash; Fácil/L1 proposto. |12.43,p.851/PDF212.|E mantido|
| AN-C12-1243-M3 | Referência anafórica sem objeto,comando genérico e V/F sem blocos reconhecidos; explicação não identificava a falsa. | Objeto/edição explícitos,quatro itens estruturados,condição da vigia noturna e falsidade da geometria quase coincidente; explicação e cinco justificativas; páginas/hash; Médio/L2 proposto. |12.43,pp.851–852/PDF212–213.|A mantido;V/V/F/V|

Cinco correções primárias parciais,25 justificativas,zero aprovações finais. Chaves A/D/D/E/A preservadas. M3 já continha as afirmações textualmente: não se afirma que esses textos estivessem apagados; foram estruturados e os julgamentos explicitados. Regime de três modelos assertion_combination/conceptual/true_false e marcas legadas preservados. Níveis propostos,sem calibração histórica/psicométrica aprovada.

## Julgamentos e unicidade

0276:I/III verdadeiras;II falsa por confundir carga com diagnóstico de garra;IV falsa por dispensar confirmação apesar de guinada. SóA reúneI/III. B incluiIV/omiteI;C incluiII/omiteIII;D incluiII/omiteI;E incluiIV/omiteIII. Não se atribuiu ao trecho uma definição formal universal de portar pela amarra.

0674:D mantém a possibilidade de carga por vento/corrente e a necessidade de controlar a posição. A dispensa controle por outros meios;B trata carga como prova de ausência de garra;C ignora a guinada;E transforma a possibilidade de guinada em dispensa de confirmação. A explicação diferencia uma inferência sobre limites diagnósticos da citação literal.

M1:I/II verdadeiras;III recomenda direções próximas,contra a passagem;IV elimina a ressalva de confirmação. A incluiIII;B incluiIV;C reúneIII/IV;D únicaI/II;E inclui duas falsas. M2:E é cerca de90°;A5°/C10° aproximam as direções;D0° faz coincidir;B180° as torna colineares em sentidos opostos. Não se definiu margem de tolerância a partir desses distratores nem se afirmou que outros ângulos tornem toda navegação impossível.

M3:V/V/F/V,únicaA. B erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. A vigia noturna conserva as condições de fundeadouro pouco confiável ou desabrigado. A indicação aproximada de90° não foi substituída por90° exatos.

## Precedência e diversidade

As cinco versões já eram ativas e vêm do principal. Nenhuma restauração/extensão prevalece. ANV-0475 permanece inalterada e ausente runtime: bruta ativa,após transformações excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada. A versão física de0102 menciona amarra,mas sua restauração efetiva trata de efeito de banco; não foi alterada ou contabilizada neste lote. Os registros sobre círculo de giro,como0105,continuam preservados e não foram aprovados por associação de seção.

Todas as versões finais atravessam reformulateLeakingStem e normalizeEditorialStem integralmente intactas;auditQuestion sem issues e política ativa. Nenhuma exceção,flag nova ou relaxamento de critérios. As variantes de vigilância/garra old-120/anv2-12.43 compartilham competência e não devem coexistir na mesma prova; a prevenção semântica global e rechecagem independente continuam pendentes. Tracking/taxonomy legados v1 foram preservados,com source v2 explícito e reconciliação global pendente; não se declara normalização integral dos filtros.

## Validação e continuidade

Build completo isolado com dependências locais: `npm run build` exit0,compilação,lint/tipos e101 páginas/rotas confirmados por log integral,com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. Não se declara resolvido o ENOTEMPTY antigo da árvore original.

Passaram as quatro gerações,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,triagem/inventário echeck:pscpp-bank. Regressão:162 deltas acumulados exatos,11.940 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;352 proposições renderizadas e370 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre059 e060,somente os cinco IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;162 hashes corrigidos conferidos. Metadados de topo,0475,versões físicas/efetivas de0102,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado162 IDs distintos corrigidos,165 conferências primárias parciais,zero aprovações finais. Triagem178 sem proposições e77 localizadores:75 candidatos corrigidos+3 falsos positivos anteriores+178 restantes=256;87 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0278,máquinas em sentidos opostos,Fonseca v2 12.15. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,prevenção semântica,consumidores/offline/SQL e homologação de produção pendentes. Sem merge,deploy ou mutação de dados de usuários.


# Lote 061 — um hélice adiante e outro atrás

Base remota `2b99202affef81d984dc475dab92360618ff159f`; HEAD e PR #172 aberto/draft consultados antes de editar. Cópia local antiga rastreada limpa atualizada por fast-forward; CHECKPOINT060 e relatório060 lidos. Temporários preservados. Enumeração de processos por `ps -eo pid,comm` falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Hashes estáveis e expected_sha sem force exigem parar diante de divergência detectável.

## Fonte, condições e anomalia textual

Fonseca,Arte Naval v.2,8ª edição (2019),12.15,pp.813–815/PDF174–176. Contexto12.10,pp.810–811/PDF171–172 e12.16/fig12-9,p.815/PDF176. Essas cinco páginas foram lidas integralmente em texto e imagens. A p.809/PDF170 efig12-8 foram lidas como contexto adicional,sem usar a manobra de um hélice como premissa para o arranjo de dois. Não se afirma leitura integral de12.9 ou12.16 além das páginas disponíveis.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade binária dos anexos oficiais,programa/edital e rechecagem independente pendentes.

12.15 distingue navio com seguimento e partida do repouso. Na segunda situação,o modelo não garante giro no mesmo ponto com rotações iguais; descreve ligeiro avanço e ajuste experimental diferente entre navios. No arranjo convencional,a proa tende ao bordo do hélice que dá atrás. Sem seguimento,o texto indica leme a meio ou cerca de10° no bordo da guinada,e15° se compensado. Os valores são da configuração examinada,não limites universais para propulsão azimutal,passo controlável,dois lemes ou qualquer condição de vento/mar.

A figura12-9 compara um leme entre as descargas com dois lemes diretamente nas descargas; é contexto de geometria,não desenho da manobra com comandos opostos nem escala para calcular forças. As questões são autossuficientes e não exigem a figura para resolver. Não se introduziu razão numérica universal de rotações/potência,raio ou cálculo novo. Os exemplos de regimes de máquina da obra foram lidos,mas não transformados em receitas universais.

**Anomalia conferida na imagem da p.813/PDF174:** o parágrafo de navio com seguimento repete uma condição de marchaAR com instruções de leme referidas ora à proa,ora à popa. O exemplo deBE da p.814 traz a distinção entre seguimentoAV eAR. Não se escolheu uma redação como errata oficial,nem se atribuiu a divergência apenas ao OCR. Os enunciados deste lote evitam usar a instrução conflitante emAR: usam partida do repouso ou caso explícito de seguimentoAV. Reconciliação de edição/errata e rechecagem independente permanecem pendentes; a fonte inteira não foi declarada isenta de inconsistências.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0278 | Proposições apagadas,afirmação genérica potencialmente verdadeira tratada como distrator e explicação genérica. | Quatro proposições autossuficientes sobre comandos opostos,rotações iguais,ajuste experimental e bordo da guinada; substituída a afirmação ambígua; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,p.814/PDF175.|C mantido;F/F/V/V|
| ANV-0676 | Comando genérico e opções de configuração/tipo de hélice/leme heterogêneas. | Cinco associações comparáveis entre comandos e resultado,sem garantia indevida de giro estacionário; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,pp.813–814/PDF174–175.|A mantido|
| ANV-0926 | Fragmento de extração e identificação apresentada como caso aplicado. | Caso de partida do repouso comBE atrás/BB adiante e rotações iguais,sem influências externas; cinco respostas comparáveis,explicação e justificativas;páginas/hash;Médio/L3 proposto. |12.15,p.814/PDF175.|A mantido|
| AN-C12-1215-M1 | Proposições apagadas,comando por artigo e explicação repetitiva;generalização do conjugado/leme. | Quatro proposições autossuficientes,arranjo convencional explícito e distinção entre rotações iguais e giro estacionário; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,pp.813–814/PDF174–175;contrastefig12-9.|E mantido;V/V/F/F|
| AN-C12-1215-M2 | Resposta mais detalhada que os distratores,opções arbitrárias e explicação apenas repetitiva. | Cinco orientações comparáveis de posição/bordo/condição do leme;10° e15° condicionados ao trecho e ao leme compensado; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,p.814/PDF175;contraste12.16.|A mantido|
| AN-C12-1215-M3 | Comando sem objeto,V/F sem blocos reconhecidos e explicação sem julgamentos. | Quatro itens estruturados,seguimentoAV e partida do repouso explícitos,falsidade de todo o leme sem seguimento e bordo correto; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,pp.813–815/PDF174–176.|B mantido;V/V/F/V|

Seis correções primárias parciais,30 justificativas,zero aprovações finais. ChavesC/A/A/E/A/B preservadas. M3 já continha os textos das afirmações: não se afirma que esses textos estivessem apagados; a correção estrutura os itens e explicita julgamentos. Regime de três modelos assertion_combination/conceptual/true_false e marcas legadas preservados. Níveis propostos sem calibração histórica/psicométrica aprovada.

## Julgamentos e unicidade

0278:I falsa por colocar os dois hélices adiante;II falsa por garantir giro estacionário com rotações iguais;III verdadeira pelo ajuste experimental;IV verdadeira pelo bordo do hélice que dá atrás. SóC reúneIII/IV. A incluiI/omiteIII;B reúneI/II falsas;D incluiII/omiteIII;E incluiI/omiteIV. A antigaII sobre aproveitar fluxos não foi declarada falsa por coincidência com a chave: foi substituída por afirmação específica verificável.

0676:A conserva comandos opostos e ausência de garantia de giro estacionário. B deixa um hélice parado;C/D põem os dois no mesmo sentido;E afirma garantia que a fonte rejeita. 0926:A associaBE atrás à proa paraBE e ligeiro avanço no modelo;B inverte bordo;C erra giro estacionário;D erra ambos;E omite a tendência de guinada.

M1:I/II verdadeiras,III/IV falsas. A incluiIII;B incluiIV;C reúne duas falsas;D incluiIII/IV;E únicaI/II. M2:A reúne apenas posições indicadas. B inclui pequeno ângulo no bordo oposto;C/D incluem todo o leme sem seguimento;E inverte bordo e elimina condição de compensação. A pergunta exige que todas as posições da opção sejam indicadas: a presença de a meio emB não valida o restante errado.

M3:V/V/F/V,únicaB. A erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. As condições de seguimento e arranjo não foram apagadas da explicação nem generalizadas a dois lemes.

## Precedência e diversidade

As seis versões já eram ativas e vêm do principal. Nenhuma restauração/extensão prevalece. ANV-0477 permanece inalterada e ausente runtime: bruta ativa,após transformações excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada. Todas as seis versões finais atravessam reformulateLeakingStem e normalizeEditorialStem integralmente intactas;auditQuestion sem issues e política ativa. Nenhuma exceção,flag nova ou relaxamento de critérios.

As variantes old-101/anv2-12.15 compartilham competência e não devem coexistir na mesma prova. Prevenção semântica global e rechecagem independente pendentes. Tracking/taxonomy legados v1 foram preservados,com source v2 explícito e reconciliação global pendente; não se declara normalização integral dos filtros. Demais consumidores não foram aprovados apenas por associação de tópico.

## Validação e continuidade

Gerados runtime PSCPP, bancos, catálogo e flashcards; validações de bancos, matriz de seleção, proveniência e catálogo passaram; check:pscpp-bank passou. Regressão acumulada:168 deltas exatos,11934 ocorrências de cadernos preservadas,364 proposições renderizadas e385 alternativas diretas preservadas. Frente ao checkpoint060,exatamente seis IDs mudaram; todos os1984 registros PSCPP e a composição14086=12102+1984 permaneceram iguais. Sem inclusão/exclusão de ID.27435 registros físicos e13715 IDs únicos mantidos.

Build completo npm run build passou em cópia isolada: compilação,lint/tipos,101/101 páginas e tabela de rotas confirmados no log integral. A primeira tentativa retornou0 com log vazio e não foi aceita como evidência; repetição direta teve saída integral. Todos os arquivos rastreados fora de docs e os seis artefatos gerados foram comparados byte a byte com a cópia testada. A triagem terminou0 com log vazio; o artefato foi conferido diretamente:176 candidatos sem proposições e77 por localizador.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero evidências finais aceitas/14086 pendentes. Critérios não relaxados. REVISOES_EDITORIAIS intacto. As162 correções anteriores permanecem exatamente iguais no ledger; seis novas elevam o acumulado a168,com171 conferências bibliográficas parciais eZERO aprovações finais. Dos256 candidatos originais,77 corrigidos+3 falsos positivos+176 restantes;91 correções fora dessa triagem,sem dupla contagem.

Próxima falha independente:ANV-0279,seguimento para vante com máquina atrás,Fonseca v2 12.6.3. Impedimentos0142/0840,0176/0874 e0253/0651 e reconciliação da fraseAR na fonte permanecem abertos. Publicação deste relatório e CHECKPOINT no mesmo commit da branch,com comparação da árvore Git local/remota e expected_sha sem force; o SHA definitivo é o commit que contém este arquivo.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,prevenção semântica,consumidores/offline/SQL e homologação de produção pendentes. Sem merge,deploy ou mutação de dados de usuários.


# Lote 062 — casco com seguimento para vante e hélice dando atrás

Base remota `7bd228f02c31895cac9c153711d77bee0f63b8fc`. HEAD remoto e PR172 aberto/draft consultados antes de editar; CHECKPOINT061, relatório061 e Prompt-Mestre integral lidos. Cópia local rastreada limpa, antiga, atualizada por fast-forward; sem commit duplicado ou descarte de temporários. `ps -eo pid,comm` falhou com `fatal library error, lookup self`: não se afirma inspeção global bem-sucedida de escritores. Comparações de hashes/árvore e expected_sha sem force protegem a publicação contra divergência detectável.

## Fonte primária e limites

Fonseca, Arte Naval v.2,8ª edição,2019,12.6.3,pp.800–803/PDF161–164 e figura12-4,p.801/PDF162. Contexto12.6,p.798/PDF159;12.6.2,pp.799–800/PDF160–161;12.3–12.4,pp.795–796/PDF156–157. Oito páginas únicas lidas integralmente em texto e imagens:795/796/798/799/800/801/802/803. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Não se publicam livro ou imagens privados. Programa/edital e equivalência binária com anexos oficiais continuam pendentes.

O texto distingue a marcha do hélice do sentido de movimento do casco. Na condição de12.6.3, a sucção contraria a ação do leme devida ao seguimento para vante; não se deve transferir para essa condição o reforço descrito para navio e hélice ambos em marchaAR em12.6.2/fig12-3. As referências aBB/BE estão limitadas ao arranjo convencional de passo direito,explicitado em12.3–12.4. Não foram generalizadas a passo controlável,azimutais ou outras instalações.

A figura12-4 mostra três posições do leme e contribuições de sucção,descarga,pressão lateral e efeito do leme; identifica navio a vante mesmo com hélice atrás. Seus rótulos de tendência não equivalem a garantia de força predominante a cada instante. O corpo das pp.801–802 explicita hipóteses de regime e ocasião de aplicação,além da possibilidade de respostas diferentes conforme o navio. Não se mediram forças,tempos,ângulos ou distâncias pela figura; os cinco enunciados são resolvíveis sem imagem ausente.

A sequência das pp.802–803 aproveita o seguimento e a velocidade angular iniciada antes da reversão. A redação das questões mantém as condições normais e a necessidade de experiências no próprio navio,sem transformar o trecho em garantia universal de manobra. Não foi afirmada vigência operacional moderna nem inventada uma razão de rotações,tempo de governo ou cálculo. A inconsistência AR de12.15 registrada no061 permanece aberta e não foi usada como premissa deste lote.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0279 | Proposições desapareciam no carregamento;mistura de definições/efeitos e explicação genérica. | Quatro proposições autossuficientes distinguem marcha do hélice,seguimento do casco,sucção e duração limitada do governo;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,pp.800–803/PDF161–164.|D mantido;V/F/V/F|
| ANV-0677 | Comando genérico e opções de definição,força e situação sem paralelismo. | Cinco associações entre ação hidrodinâmica e efeito,com condição de seguimento e arranjo explícita;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,p.801/PDF162;context12.3–12.4.|B mantido|
| AN-C12-1263-M1 | Proposições apagadas,comando por artigo e explicação que repetia o texto sem fundamentar os erros. | Quatro proposições autossuficientes distinguem popa/proa,incidência da descarga,oposição da sucção e ocasião do leme;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,p.801–803/PDF162–164 efig12-4.|E mantido;V/V/F/F|
| AN-C12-1263-M2 | Explicação mínima,distratores desiguais e comando que era substituído por formulação genérica no pipeline. | Caso explícito de reversão com casco ainda avançando;cinco procedimentos comparáveis,sequência temporal e limites explicados;cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,pp.802–803/PDF163–164.|A mantido|
| AN-C12-1263-M3 | Comando sem objeto,V/F sem estrutura reconhecida e explicação sem julgamentos individuais. | Quatro itens estruturados com condição de seguimento explícita;falsidade do governo indefinido substitui repetição da relação de sucção;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,pp.801–803/PDF162–164.|B mantido;V/V/F/V|

Cinco correções primárias parciais e25 justificativas. Zero aprovações finais. As chavesD/B/E/A/B foram conservadas por conferência das alternativas,sem forçar a verdade para manter letra. M3 já continha textos de afirmações: não se declara que eles estivessem apagados; o problema era estrutura reconhecida e fundamentação. Os três modelos assertion_combination/conceptual/true_false e flags legadas foram preservados; tais flags não são evidência aceita de aprovação. NívelL2 e dificuldadeMédio são propostas,sem calibração psicométrica/histórica final.

## Julgamentos, unicidade e duplicidade semântica

0279:I verdadeira por distinguir movimentos;II falsa porque a sucção se opõe à ação do leme;III verdadeira porque velocidades/ocasião importam;IV falsa por anular governo instantaneamente. SóD reúneI/III;A reúneII/IV falsas;B eC incluemIV;E incluiII. A antigaII genérica não foi considerada falsa apenas por ausência na chave: foi substituída por inversão técnica específica e verificável.

0677:sóB associa sucção à oposição na condição estudada. A inverte a relação;C confunde forças distintas com eliminação;D transfere a descarga da marchaAV para o héliceAR;E troca o bordo da pressão lateral para o arranjo de passo direito. Não se deduz a guinada total apenas dessa contribuição.

M1:I/II verdadeiras,III/IV falsas. A incluiIII;B incluiIV;C reúne duas falsas;D incluiIII/IV;E únicaI/II. M2:sóA aplica o leme antes da reversão para iniciar a guinada desejada;B posterga,C aguarda outro sentido de movimento,D inicia guinada contrária,E dispensa a ação inicial. Não se afirma que as demais sejam impossíveis em qualquer manobra real: não correspondem à orientação pedida no cenário/fonte.

M3:V/V/F/V,únicaB. A erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. I refere-se ao cascoAV e héliceAR;IV refere-se à popa,evitando inverter a proa. A limitação de governo após reversão foi mantida.

As cinco variantes old095/anv2-12.6.3 avaliam a mesma competência e não devem coexistir na mesma prova. A prevenção semântica global está pendente; diversidade de redação não as torna competências diferentes. Regime de três modelos preservado. Tracking/taxonomy legados v1 de0279/0677 permanecem como dívida de reconciliação,com fonte v2 explícita;não se declara normalização integral de filtros.

## Precedência, transforms e falhas de sondagem

As cinco versões já eram ativas e vêm do principal;nenhuma restauração/extensão prevalece. ANV-0478 permanece inalterada e ausente runtime:objeto bruto passa na política,mas após as transformações preexistentes é excluído por stem-quotes-source-answer. Não houve ativação,nova quarentena ou conferência contabilizada desse ID.

A primeira sondagem detectou a transformação deM2 em comando genérico,apesar da primeira reescrita. O comando foi ajustado para tornar o cenário/pergunta claros sem repetir a formulação da alternativa correta. A sondagem final confirmou igualdade integral principal/versão efetiva para as cinco questões e invariância nas duas transformações,com auditQuestion sem issues/política ativa. Nenhum bypass,flag nova ou relaxamento de critérios foi introduzido. Escores automáticos não são aprovação editorial.

## Validação, acumulado e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:173 deltas acumulados exatos,11929 ocorrências de cadernos preservadas,376 proposições renderizadas e395 alternativas diretas preservadas. Frente ao061,exatamente cinco IDs efetivos e cinco objetos do principal mudaram;168 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada pela validação pertinente.

Build completo npm run build passou em cópia isolada,com log integral confirmando compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados foram comparados byte a byte com a cópia testada. Não se confunde código de saída isolado com evidência de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato de triagem conferido diretamente:174 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS permaneceu byte a byte igual. Critérios não relaxados.

Acumulado sem recontagem:173 IDs corrigidos e176 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,79 corrigidos+3 falsos positivos+174 restantes;94 correções fora dessa triagem,79+94=173. Este lote acrescenta cinco correções e cinco conferências,sem recontar os168 IDs anteriores. Próxima falha independente:ANV-0283,virar a máquina de suspender,Fonseca10.32/10.36. Impedimentos0142/0840,0176/0874 e0253/0651,reconciliaçãoAR do061 e demais pendências globais preservados.

Todos os oito gates pendentes/falhos e merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,árvores bibliográficas completas,normas,prevenção semântica,consumidores/offline/SQL e homologação continuam pendentes. Sem merge,deploy ou mutação de dados de usuários. SHA definitivo é o commit que contém este relatório e CHECKPOINT;publicação exige árvore local/remota idêntica e expected_sha sem force.


# Lote 063 — preparo, acionamento e conservação da máquina de suspender

Base remota `699857b91455d332d9e42c72bc29cac06a71e9cf`; HEAD remoto e PR172 aberto/draft consultados antes da edição. CHECKPOINT062 e relatório062 lidos,com contexto suficiente do Prompt-Mestre e benchmark histórico já revisados. Cópia local rastreada limpa e antiga atualizada por fast-forward,sem duplicar commit ou descartar temporários. `ps -eo pid,comm` falhou com `fatal library error, lookup self`: não se afirma enumeração global bem-sucedida de escritores. Publicação condicionada a hashes estáveis,árvore local/remota idêntica e expected_sha sem force.

## Fonte primária e limites

Fonseca,Arte Naval v.2,8ª edição,2019:10.32.a/b,p.747/PDF108;10.36,pp.752–753/PDF113–114;contexto10.33,p.748/PDF109. Essas quatro páginas foram lidas integralmente em texto e imagens. Não há figura nessas passagens e nenhum enunciado exige imagem ausente. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade dos anexos oficiais,edital e inventário de aplicabilidade atual permanecem pendentes.

10.32.b distingue autorização/comunicação,óleo e graxa,primeira partida sem carga,embreagem de dado e preparo a vapor. 10.36 distingue ensaio de poucos elos e reaperto do freio da fase posterior de arrancar o ferro;mantém lavagem,fase de velocidade de içar e retenção final. Os enunciados limitam-se à edição citada,sem substituir o procedimento do equipamento específico. O limite de10% para motor de indução é lembrança do texto,não cálculo elétrico novo nem declaração de conformidade com norma atual.

A passagem histórica de10.32.a(3),com desmontagem/solventes,foi lida,mas sua aplicabilidade atual não foi validada nem prescrita nas reescritas. A primeira proposição de1032M3 foi substituída por condição de autorização/comunicação dentro da mesma competência de preparo,sem declarar falsa a antiga descrição apenas porque foi substituída. O trecho10.33(2) não foi transformado em garantia de eliminação de todo acidente. A remissão de10.36(16) para10.17 foi consultada em texto;isso não equivale a revisão integral de10.17 nem de todas as remissões do capítulo.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0283 | Proposições apagadas no carregamento e mistura de operação com definição de peças. | Restauradas quatro proposições sobre autorização,primeira partida,ligação da coroa e ensaio de elos;explicação e cinco justificativas;páginas/hash;Médio/L2. |10.32.b,p.747/PDF108;10.36,p.752/PDF113.|C mantido;V/V/F/F|
| ANV-0681 | Comando genérico e opções heterogêneas entre ações e componentes. | Cinco relações comparáveis entre acionamento/fase;distintos freio,coroa,mordente e boça;explicação e cinco justificativas;páginas/hash;Médio/L2. |10.36,p.752/PDF113;contrastep.753/PDF114.|A mantido|
| AN-C10-1032-M1 | Explicação repetitiva,justificativas genéricas eL4 incompatível com a cobrança. | Escopo2019 explícito;fundamentados inspeção,lubrificantes,primeira partida e falsa autorização dispensada;cinco justificativas;Médio/L2;página/hash. |10.32.a/b,p.747/PDF108.|D mantido;V/V/V/F|
| AN-C10-1032-M2 | Pergunta sobre faixa não distinguia limite máximo de valores internos;opçãoE heterogênea eL3 sem aplicação. | Pedido explícito de desvio máximo;cinco percentuais homogêneos;explicação e cinco justificativas;Fácil/L1;página/hash. |10.32.a(4),p.747/PDF108.|C mantido;10%|
| AN-C10-1032-M3 | Comando sem objeto,justificativas genéricas eL4 sem análise. | V/F com contexto de preparo;autorização/comunicação,óleo impuro e condição de embreagem de dado explícitos;fundamentada a falsidade de dispensar preparo a vapor;cinco justificativas;Médio/L2;página/hash. |10.32.b,p.747/PDF108.|E mantido;V/V/V/F|
| AN-C10-1036-M2 | Explicação repetitiva e distratores de operações heterogêneas. | Cinco ajustes de içamento comparáveis;fase/limpeza e possibilidade de aumento preservadas;explicado que redução não é obrigatória no cenário limpo e que o encosto é vagaroso;cinco justificativas;Médio/L2;páginas/hash. |10.36(14)–(17),pp.752–753/PDF113–114.|E mantido|
| AN-C10-1036-M3 | Comando sem objeto e justificativas genéricas. | Contexto de lavagem/encerramento;preservadas quatro proposições eV/F,julgadas individualmente;explicitada sequência de retenção após alojar o ferro;cinco justificativas;Médio/L2;páginas/hash. |10.36(5),(14),(17)–(20),pp.752–753/PDF113–114.|B mantido;V/V/V/F|

Sete correções primárias parciais e35 justificativas. Zero aprovações finais. Apenas0283 recupera proposições que desapareciam:1032M1/M3 e1036M3 já tinham quatro itens reconhecidos no runtime. Os níveis são propostas sem calibração histórica/psicométrica final. ChavesC/A/D/C/E/E/B mantidas após conferência de conteúdo e unicidade.

## Julgamentos e unicidade

0283:I/II verdadeiras;III falsa por deixar a coroa desligada no recolhimento;IV falsa por substituir poucos elos por quartéis completos. SóC reúneI/II;A reúne duas falsas;B incluiIII;D/E incluemIV. A afirmação antiga genérica de verificações não foi aprovada por mera coincidência da chave: foi substituída por proposições com localizador preciso.

0681:A corresponde ao acionamento da fase de arrancar com freio solto. B atribui ao reaperto do ensaio a função de iniciar arranque;C desliga a coroa;D/E confundem retenção com acionamento. 1032M1:I/II/III verdadeiras,IV falsa;A omiteIII;B incluiIV;C incluiIV eomiteII;D únicaI/II/III;E incluiIV.

1032M2:10% é o limite pedido.2/5% restringem mais;20/25% excedem. Não se afirma que uma tensão situada a2/5% da nominal seja inadmissível: o comando pergunta o limite máximo referido,eliminando essa ambiguidade. 1032M3:V/V/V/F,únicaE;A erraII/III;B erraI/IV;C erraIII/IV;D erraI/II.

1036M2:E mantém aumento como possibilidade condicionada a amarra limpa e ferro já arrancado,ainda não em cima. A impõe redução obrigatória que a passagem não exige nessa condição;B desloca a fase;C transfere aumento para encosto;D ignora limpeza. A possibilidade de recolher mais devagar por outra necessidade operacional não foi declarada impossível. 1036M3:V/V/V/F,únicaB;A erraII;C erraI/IV;D erraIII/IV;E erraI/II.

## Precedência, três modelos e itens preservados

As sete versões já eram ativas e vêm do principal;nenhuma restauração/extensão prevalece sobre elas. Sondagem final confirma igualdade integral entre cada objeto principal e versão efetiva,invariância em reformulateLeakingStem/normalizeEditorialStem e auditQuestion sem issues/política ativa. Sem flags novas,bypass ou relaxamento de critérios;escore automático não comprova revisão editorial.

ANV-0482 permanece inalterada e ausente runtime:bruta ativa,após transformações stem-quotes-source-answer. AN-C10-1036-M1 permanece inalterada e ausente:bruta stem-quotes-source-answer,depois missing-assertions. O defeito desse modelo e suas justificativas genéricas permanecem pendentes;ele não recebe correção,conferência integral ou aprovação contabilizada neste lote. O regime de três modelos por item continua fisicamente preservado;não houve exclusão de modelo nem nova quarentena/ativação. Em1032 os três modelos ativos foram individualmente corrigidos;em1036 foram corrigidos os dois já ativos.

O original principalANV-0044 continua explicitamente inativo/quarentenado;há uma versão efetiva preexistente por restauração,com correção de checkpoint anterior. Nenhuma foi alterada ou recontada. Tracking/taxonomy legados v1 de0283/0681 preservados,com source v2 explícito e reconciliação global pendente.

As variantes sobre preparo/acionamento e os modelos com sobreposição de competência não devem coexistir na mesma prova;diferença textual não comprova diversidade. Prevenção semântica global e reconciliação entre consumidores permanecem pendentes. Não se declara aprovação de todo o item10.36 enquantoM1 estiver pendente.

## Validação e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:180 deltas acumulados exatos,11922 ocorrências de cadernos preservadas,392 proposições renderizadas e410 alternativas diretas preservadas. Frente ao062,exatamente sete IDs efetivos e sete objetos principais mudaram;173 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada.

O primeiro ciclo de testes passou nos contratos pertinentes,mas a conferência final do distratorA de1036M2 explicitou redução obrigatória para evitar ambiguidade com uma redução apenas possível. Hashes atualizados e todos os15 comandos repetidos sobre a redação final. Build completo npm run build passou em cópia isolada com log integral:compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. Não se usa código de saída isolado como prova de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato conferido:173 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS byte a byte intacto. Critérios não relaxados.

Acumulado sem recontagem:180 IDs corrigidos e183 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,80 corrigidos+3 falsos positivos+173 restantes;100 correções fora dessa triagem,80+100=180. Este lote acrescenta sete correções e sete conferências,sem recontar os173 IDs anteriores. Próxima falha independente:ANV-0288,poleame de laborar,Fonseca9.1/9.3. Impedimentos0142/0840,0176/0874 e0253/0651,modelo1036M1 excluído,reconciliaçãoAR do061 e demais pendências globais preservados.

Todos os oito gates pendentes/falhos e merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,consumidores/offline/SQL e homologação pendentes. Sem merge,deploy ou mutação de dados de usuários. O commit que contém este relatório contém também CHECKPOINT e hashes antes/depois;publicação exige igualdade exata de árvore e expected_sha sem force.


# Lote 064 — classes, componentes e tipos de poleame

Base remota `b60d122834b5cb51266a703ea64bf7c6c60521eb`. HEAD remoto e PR172 aberto/draft consultados antes de editar; CHECKPOINT063 e relatório063 lidos,com contexto suficiente do Prompt-Mestre e benchmark histórico anteriormente revisados. Cópia local rastreada limpa e antiga atualizada por fast-forward,sem commit duplicado ou descarte de temporários. `ps -eo pid,comm` falhou com `fatal library error, lookup self`: não se afirma enumeração global bem-sucedida de escritores. Publicação exige hashes estáveis,árvore local/remota idêntica e expected_sha sem force.

## Fonte primária, paginação e figuras

Fonseca,Arte Naval v.2,8ª edição,2019:9.1,p.[657]/PDF18;9.2,pp.658–659/PDF19–20;9.3.a–e,pp.659–661/PDF20–22. Cinco páginas únicas lidas integralmente em texto e imagens,figuras9-1 a9-11 conferidas. A abertura do capítulo9 não tem numeral impresso: **[657] é inferido** pela sequência imediatamente anterior à página658. PDF18 é exato. A inferência consta de source.page_note e das conferências pertinentes; não se apresenta657 como numeral visto na imagem.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade de anexos oficiais,programa/edital e aplicabilidade completa continuam pendentes.

9.1 distingue a divisão surdo/de laborar do critério madeira/metal,que depende da caixa. 9.3 distingue moitão,cadernal,patesca,polé,catarina e variantes históricas. Uma categoria não concorre como alternativa exclusiva com um exemplo que a integra;essa sobreposição foi retirada de0686. O caso de93M2 exige tanto introdução pelo seio quanto fechamento lateral,evitando concluir que o polé não admite colocação lateral apenas por não ter charneira.

As figuras9-1/2/3 confirmam exemplos de poleame surdo;9-4/5/6 mostram moitão de dente,duplo e lebre;9-7/8 contrastam uma roldana do moitão e várias em um eixo do cadernal;9-9/10 distinguem patesca com fechamento e polé aberto;9-11 mostra a catarina. As questões são resolvíveis pelo texto,sem depender de imagem ausente. Não se mediram forças,dimensões ou cargas pelas figuras.

Não foi calculado ganho mecânico nem atribuído ganho fixo a toda peça de retorno. A possibilidade de compor aparelhos que reduzem esforço foi preservada sem converter a expressão histórica de multiplicação de potência em criação de energia ou fator numérico universal. A observação da obra sobre desuso de moitão de dente,duplo e lebre foi considerada; suas descrições não são recomendações universais de equipamento moderno.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0288 | Proposições apagadas no carregamento e mistura de categoria com tipos particulares. | Restauradas quatro proposições autossuficientes sobre roldana,retorno,redução de esforço nos aparelhos e polé;explicação e cinco justificativas;Médio/L2;páginas/hash. |9.1,p.[657]/PDF18;9.3,pp.659–661/PDF20–22.|C mantido;F/V/V/F|
| ANV-0686 | Comando genérico e alternativas sobrepostas entre classe,integrantes e componente. | Cinco relações estruturais comparáveis entre surdo/de laborar;retirada a competição entre categoria e exemplos;explicação e cinco justificativas;Médio/L2;páginas/hash. |9.1,p.[657]/PDF18;context9.3.|A mantido|
| AN-C09-91-M1 | Justificativas genéricas eL4 sem análise proporcional. | Explicitadas as duas classificações,caixa versus roldana e eixo fixo;fundamentados os quatro julgamentos;cinco justificativas;Médio/L2;página/hash/nota de inferência. |9.1,p.[657]/PDF18.|C mantido;V/V/V/F|
| AN-C09-91-M2 | Alternativas de classes e critérios heterogêneos;justificativas genéricas. | Cinco associações comparáveis entre duas construções e critério de material,com erro localizável em cada distrator;explicação e cinco justificativas;Médio/L2;página/hash/nota. |9.1,p.[657]/PDF18.|B mantido|
| AN-C09-91-M3 | Justificativas genéricas e pouca explicitação do objeto. | Contexto de classes/componentes,exemplos e falsidade da inversão roldana/perno;V/F preservado,cinco justificativas;Médio/L2;página/hash/nota. |9.1,p.[657]/PDF18;context9.2.|A mantido;V/V/V/F|
| AN-C09-93-M1 | Justificativas genéricas eL4 sem análise proporcional. | Distintos moitão,cadernal,patesca/polé;explicitadas abertura e charneira;quatro julgamentos e cinco justificativas;Médio/L2;páginas/hash. |9.3.a–d,pp.659–661/PDF20–22;fig9-4 a9-10.|C mantido;V/V/V/F|
| AN-C09-93-M2 | Distratores heterogêneos e justificativas genéricas. | Requisito explícito de colocação pelo seio e posterior fechamento;cinco construções comparáveis,sem negar que polé seja aberto;explicação e cinco justificativas;Médio/L2;páginas/hash. |9.3.c/d,p.661/PDF22;fig9-9/10.|B mantido|
| AN-C09-93-M3 | Comando sem objeto e justificativas genéricas. | Contexto histórico explícito na explicação,distintos dente/duplo/lebre e catarina de aço;V/F preservado e cinco justificativas;Médio/L2;páginas/hash. |9.3.a/e,pp.659–661/PDF20–22;fig9-4/5/6/11.|D mantido;V/V/V/F|

Oito correções primárias parciais e40 justificativas,zero aprovações finais. Apenas0288 recupera quatro proposições que desapareciam;os quatro modelosM1/M3 já tinham quatro itens reconhecidos no runtime. Não se conta restauração de itens inexistente. ChavesC/A/C/B/A/C/B/D e formatos por item preservados após conferir unicidade e conteúdo. DificuldadeMédio/L2 são propostas,sem calibração histórica/psicométrica final.

## Julgamentos e unicidade

0288:I falsa por negar roldanas;II/III verdadeiras por retorno e composição de aparelhos;IV falsa por atribuir charneira ao polé. SóC reúneII/III;A reúneI/IV falsas;B/D incluemIV;E incluiI. A antigaI genérica não foi aprovada como falsa apenas por ausência na chave: foi substituída por proposição técnica inequívoca.

0686:sóA corresponde à ausência/presença de roldanas. B inverte as classes;C impõe materiais obrigatórios;D atribui uma roldana ao surdo;E elimina a distinção por roldana. Catarinas e patescas não foram julgadas fora da categoria de laborar para manter a chave.

91M1:I/II/III verdadeiras,IV falsa. A incluiIV;B omiteI;C conjunto completo;D incluiIV eomiteI;E incluiIV. 91M2:B reúne primeira surda,segunda de laborar ecritério pela caixa. A inverte classes;C/D classificam ambas na mesma classe;E troca caixa por roldana. 91M3:V/V/V/F,únicaA;B erraII;C erraI/IV;D erraIII/IV;E erraI/II.

93M1:I/II/III verdadeiras,IV falsa. A incluiIV;B omiteI;C conjunto completo;D incluiIV eomiteII;E incluiIV. 93M2:B fornece abertura e fechamento. A/C mantêm caixas fechadas;D só propõe material da roldana,sem fornecer abertura/fechamento;E caracteriza ausência de fechamento,como no polé. 93M3:V/V/V/F,únicaD;A erraII;B erraI;C erraIII/IV;E erraI/III/IV.

## Precedência e diversidade

As oito versões já eram ativas e vêm do principal;nenhuma restauração/extensão prevalece sobre elas. Sondagem final confirma igualdade integral principal/versão efetiva e invariância nas duas transformações,auditQuestion sem issues/política ativa. Sem bypass,flags novas ou relaxamento de critérios;escore automático não é aprovação editorial.

ANV-0487 permanece inalterada e ausente runtime:bruta ativa,após transformações stem-quotes-source-answer. Não houve ativação,nova quarentena ou conferência individual contabilizada desse ID. As duas séries de três modelos91/93 permanecem fisicamente e editorialmente no regime adotado;os seis já ativos foram individualmente corrigidos. Marcas legadas de approved/validation foram preservadas,mas não aceitas como evidência final;REVISOES_EDITORIAIS não recebe aprovação automática.

Tracking/taxonomy v1 legados de0288/0686 permanecem com source v2 explícito e reconciliação global pendente. Variantes sobre a mesma competência de classificação e as que repetem patesca/polé ou outras definições não devem coexistir na mesma prova. Distinção de enunciado não basta para diversidade;prevenção semântica global e outros consumidores permanecem pendentes.

## Validação e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:188 deltas acumulados exatos,11914 ocorrências de cadernos preservadas,412 proposições renderizadas e425 alternativas diretas preservadas. Frente ao063,exatamente oito IDs efetivos e oito objetos principais mudaram;180 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada pela validação pertinente.

Build completo npm run build passou em cópia isolada com log integral:compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. Não se usa código de saída isolado como evidência de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato conferido:172 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS permaneceu byte a byte intacto. Critérios não relaxados.

Acumulado sem recontagem:188 IDs corrigidos e191 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,81 corrigidos+3 falsos positivos+172 restantes;107 correções fora dessa triagem,81+107=188. Este lote acrescenta oito correções e oito conferências,sem recontar os180 IDs anteriores. Próxima falha independente:ANV-0295,teste do aparelho de governo,Fonseca11.10. Impedimentos0142/0840,0176/0874 e0253/0651,modelo1036M1 excluído,reconciliaçãoAR do061 e demais pendências globais preservados.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,consumidores/offline/SQL e homologação pendentes. Sem merge,deploy ou mutação de dados de usuários. O commit que contém este relatório contém também CHECKPOINT e hashes antes/depois;publicação exige igualdade exata de árvore e expected_sha sem force.


# Lote 065 — verificações e testes da máquina do leme

Base remota `96e55b1e04b66890e980057ef7597998d274adcf`. HEAD remoto e PR172 aberto/draft consultados antes de editar; CHECKPOINT064 e relatório064 prevalecem sobre o prompt antigo. Contexto do Prompt-Mestre e benchmark histórico previamente revisados preservado. A árvore rastreada local limpa e antiga foi atualizada por fast-forward. Temporários não rastreados preservados. `ps -eo pid,comm` retornou `fatal library error, lookup self`; não se afirma enumeração global bem-sucedida de escritores. Hashes estáveis, comparação de árvore e expected_sha sem force são condições de publicação.

## Fonte e limites

Fonseca, Arte Naval v.2, 8ª edição, 2019: item11.10.d(1)–(4), p.775/PDF136; contexto d(5)–(6), p.776/PDF137 e11.10.b/c p.774/PDF135. Três páginas únicas lidas integralmente em texto e imagens; os numerais774,775,776 foram vistos. Não há figura necessária à resolução nesses trechos; não houve medição de figura ou cálculo. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`, Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados.

A fonte distingue teste rotineiro, suas verificações cumulativas e exercícios de emergência adicionais. O movimento é limitado às possibilidades da máquina, sem exigir curso mecanicamente impossível. Conferiu-se também a previsão específica de dispensa para viagens curtas e registros emd(5)/(6), sem transformar a regra geral em afirmação universal sem exceções. Não se alteraram prazos nem se certificou um navio.

Consulta auxiliar documentada em CONSULTA_NORMATIVA_GOVERNO_065.json, em24/10/2026: PDF rotulado SOLAS2020 hospedado pela autoridade islandesa, PDF235/regulaçãoV/26.1–6; orientação britânica MCA MGN610 Amendment1,33.1–33.4. O primeiro confirma a apresentação cumulativa dos testes e os exercícios adicionais; a segunda identifica o assunto e discute registros/instruções no contexto britânico. Não comprovam consolidação integral vigente em2026, aplicabilidade brasileira ou edital-alvo. O PDF antigo do domínio publishing.service.gov.uk retornou410 ao abrir e não foi tratado como documento recuperado. As perguntas são explicitamente sobre a edição2019. Anexos oficiais, programa/edital e inventário completo de normas permanecem pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador verificado | Gabarito |
|---|---|---|---|---|
| ANV-0295 | Quatro proposições desapareciam no carregamento; mistura entre teste, arranjo de emergência e propulsor lateral; justificativa genérica. | Reconstruídas quatro proposições sobre indicação angular, inspeção, comunicação e exercícios adicionais; corrigida a falsa dispensa de inspeção/exercícios; comando preservado pelo carregador; explicação e cinco justificativas; páginas/hash e proposta Médio/L2. |11.10.d(1),(2),(4),p.775/PDF136;contextd(5)/(6),p.776/PDF137.|E mantido;V/F/V/F|
| ANV-0693 | Pergunta genérica e alternativas heterogêneas entre teste e tipos de propulsão/governo. | Contexto autossuficiente de preparação para suspender; cinco procedimentos comparáveis sobre complementaridade/substituição de movimento,inspeção e comunicação; explicação e cinco justificativas;páginas/hash e proposta Médio/L2. |11.10.d(2),p.775/PDF136;contextd(1)/(4)–(6).|C mantido|

Duas correções primárias parciais, dez justificativas e zero aprovações finais. Só0295 recupera quatro proposições ausentes na versão efetiva. A chave original não prova a falsidade de frases genéricas: elas foram substituídas por relações verificáveis na fonte. IDs, alternativas combinatórias de0295, tracking/taxonomy, módulos, estilos e identidade foram preservados. A proposta Médio/L2 não é calibração psicométrica aprovada.

## Julgamento, alternativas e precedência

0295:I verdadeira por comparação indicação/posição real;II falsa porque a inspeção é cumulativa ao movimento;III verdadeira pela comunicação entre locais;IV falsa porque os exercícios de emergência são adicionais. SóE reúneI/III;A incluiII eomiteIII;B incluiII eomiteI;C reúneII/IV falsas;D incluiIV eomiteIII. 0693:sóC mantém as três etapas.A elimina inspeção;B elimina movimento;D elimina comunicação;E elimina movimento e inspeção. As cinco alternativas não competem entre categoria e exemplo.

Sondagens iniciais falharam porque a transformação lexical ainda substituía os comandos por enunciado genérico: em0295 o fechamento repetia palavras das opções combinadas;em0693 o comando repetia a enumeração correta. Ajustou-se o comando com objeto técnico explícito e sem antecipar a resposta. Não houve alteração de heurística, bypass, nova flag ou relaxamento de testes. Sondagem final confirma igualdade integral de cada objeto principal com o runtime e invariância em reformulateLeakingStem/normalizeEditorialStem. auditQuestion retorna sem issues; esse escore automático não é aprovação final.

ANV-0494 permanece fisicamente inalterada e ausente runtime:bruta ativa,após transformações stem-quotes-source-answer. Sem ativação,quarentena nova ou conferência individual contabilizada. Os três modelos AN-C11-1110-M1/M2/M3 permanecem inalterados e pendentes de revisão integral: abrangem instalação,desempenho e requisitos elétricos além do trecho d. A leitura de três páginas não foi contabilizada como revisão dos modelos ou de todo11.10. Regime de três modelos preservado. Tracking/taxonomy v1 legados de0295/0693 não foram globalmente reconciliados com source v2. Variantes da mesma competência não devem coexistir na mesma prova; prevenção semântica global pendente.

## Validação e acumulado

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validação runtime,seleção/matriz,proveniência,catálogo,regressão e check:pscpp-bank. Regressão confirmou190 deltas acumulados exatos,11912 ocorrências de cadernos preservadas,416 proposições renderizadas e430 alternativas diretas preservadas. Exatamente dois IDs efetivos e dois objetos principais mudaram frente ao064;1984 PSCPP intactos. População14086=12102+1984,13715IDs únicos,27435 registros físicos e matriz100=25/25/10/10/10/10/10 preservadas.

Build completo em cópia isolada passou com log integral:compilação,lint/tipos,101/101 páginas e rotas. Os1285 arquivos rastreados fora de docs e seis artefatos gerados coincidem byte a byte com os insumos/resultados testados. Avisos do build não impediram sucesso;nenhuma aprovação de release inferida.

Falhas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,0aceitas/14086pendentes. Triagem e inventário regenerados:171 candidatos sem proposições e77 localizadores. REVISOES_EDITORIAIS intacto. Resultados reais de cada comando:

| Comando | Saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|


As188 correções anteriores permanecem intactas; este lote acrescenta dois IDs,sem recontagem:190 corrigidos e193 conferências parciais,ZERO aprovações finais. Dos256 candidatos iniciais:82 corrigidos+3 falsos positivos+171 restantes;108 correções fora dessa triagem;82+108=190. Próxima falha independente ANV-0298. Preservados impedimentos0142/0840,0176/0874,0253/0651,modelo1036M1 excluído,inconsistência12.15AR e demais pendências.

Todos os oito gates continuam pendentes/falhos,merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,consumidores/offline/SQL e homologação pendentes. Sem merge,deploy ou mutação de dados de usuários. O commit que contém este relatório inclui CHECKPOINT e hashes antes/depois. Publicação condicionada a igualdade exata local/remota,HEAD sem concorrência detectada e expected_sha sem force.

# Lote 066 — transmissão mecânica flexível e rígida do governo

Base remota `794f1a6b163cd5ace8c36b2c8cd34faae25df48b`. HEAD remoto e PR172 aberto/draft conferidos antes de editar;CHECKPOINT065 e relatório065 prevalecem sobre os números antigos do prompt. Contexto do Prompt-Mestre e benchmark histórico previamente lidos preservado. Árvore rastreada local limpa/antiga atualizada por fast-forward;temporários não rastreados preservados. `ps -eo pid,comm` falhou com `fatal library error, lookup self`;não se afirma enumeração global bem-sucedida de escritores. Publicação exige estabilidade de hashes,igualdade de árvore e expected_sha sem force.

## Fonte primária e escopo

Fonseca,Arte Naval v.2,8ª edição,2019:item11.5.a,p.760/PDF121;contexto11.3,pp.756–757/PDF117–118 e figura11-2. Também lida a abertura11.1/11.2/PDF116,sem numeral impresso:[755] seria inferido pela sequência,mas não é usado como página verificada das questões. Quatro páginas únicas lidas integralmente em texto e imagens;756,757 e760 têm numerais impressos vistos. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados.

11.5.a distingue flexível por gualdropes de rígida por vergalhões/eixos. 11.3 define gualdropes como cabos de aço,correntes ou cadeias Galle e descreve sua ligação ao tambor/cana. O parágrafo de pequenas mudanças por Cardan e maiores por engrenagens cônicas está explicitamente no contexto da rígida. As desvantagens seguintes foram tratadas nesse contexto,sem usá-las como lista universal de inspeção/manutenção da modalidade flexível.

Figura11-1 é a roda do leme. Figura11-2,leme à mão,mostra tambor,rodetes,macacos,molas,madre/quadrante e segmentos identificados como transmissão rígida de vergalhões. Não se chamou todo o aparelho ilustrado de exclusivamente flexível. O esquema é contexto de construção,não gráfico de ganho mecânico nem instrução universal de instalação. As questões são resolvíveis pelo texto e não dependem de imagem ausente. Sem medições,cálculos,novas prescrições de manutenção ou afirmação de conformidade normativa atual. Aplicabilidade a equipamentos modernos,anexos oficiais e edital-alvo continuam pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0298 | Proposições apagadas no carregamento;mistura entre transmissão flexível,rígida e atuação do servomotor;lista de inspeção sem fundamentação específica. | Restauradas quatro proposições sobre gualdropes e contraste com eixos/pressão líquida;retirada generalização de manutenção;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |11.5.a/b,p.760/PDF121;11.3,p.756/PDF117.|C mantido;V/V/F/F|
| ANV-0696 | Comando genérico e alternativas heterogêneas entre componentes,modalidades e atuação. | Cinco associações paralelas entre flexível/rígida e seus meios de transmissão;explicação e cinco justificativas;referência com páginas/hash;Médio/L2. |11.5.a/b,p.760/PDF121;contexto11.3.|A mantido|
| AN-C11-115a-M1 | Quatro proposições apagadas e explicação repetitiva,sem julgar falsas. | Restaurados quatro itens sobre modalidades,Cardan,cônicas e perdas da rígida;explicação dos quatro julgamentos e cinco justificativas;Médio/L2;páginas/hash. |11.5.a,p.760/PDF121.|E mantido;V/V/F/F|
| AN-C11-115a-M2 | Distratores de mecanismos heterogêneos,explicação mínima e dificuldade desproporcional. | Cinco pares ordenados comparáveis;diferenciada função dos mancais de rolamentos;explicação e cinco justificativas;páginas/hash;Fácil/L1 proposto. |11.5.a,p.760/PDF121.|A mantido|
| AN-C11-115a-M3 | V/F não reconhecido e comando dependente de localizador;explicação repetia proposições sem julgá-las. | Quatro itens reconhecidos em V/F,com objeto explícito;desvantagens delimitadas à rígida,inversão Cardan/cônicas explicada;cinco justificativas;Médio/L2;páginas/hash. |11.5.a,p.760/PDF121.|B mantido;V/V/F/V|

Cinco correções primárias parciais e25 justificativas;zero aprovações finais. Oito proposições voltaram aos enunciados combinatórios efetivos e quatro itens V/F passaram a ser reconhecidos;isso não significa doze proposições antes ausentes fisicamente. Níveis/dificuldades são propostas,não calibração psicométrica aprovada. Chaves,IDs,tracking/taxonomy,provenance evalidation legados preservados;marcas antigas não aceitas como aprovação final.

## Julgamentos,unicidade e precedência

0298:I/II verdadeiras,gualdropes e seus materiais;III falsa,pois descreve eixos da rígida;IV falsa,pois descreve transmissão hidráulica. SóC reúneI/II. A incluiIII eomiteII;B incluiIV eomiteII;D incluiIV eomiteI;E incluiIII eomiteI. Não se presumiu correta a antiga lista de manutenção só porque estava na chave;foi substituída por afirmação rastreável.

0696:sóA associa gualdropes/flexível e vergalhões ou eixos/rígida. B inverte;C elimina distinção e inventa critério pelo material da roda;D troca a flexível por hidráulica;E troca a rígida por hidráulica. Nenhuma categoria concorre com exemplo que também seria correto isoladamente.

115aM1:I/II verdadeiras,III/IV falsas;E é única combinação correta. A incluiIII;B incluiIV;C reúne ambas falsas;D inclui ambas falsas. IV não nega a existência de perdas:afirma incorretamente sua eliminação com aumento de extensão/mudanças,oposto ao trecho lido.

115aM2:sóA mantém a ordem Cardan/cônicas;B inverte;C generaliza Cardan às maiores;D generaliza cônicas às pequenas;E atribui aos mancais a função de mudar direção. 115aM3:V/V/F/V,sóB. A erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. As desvantagens do itemII são explicitamente da rígida e não recomendação geral de manutenção de qualquer sistema de governo.

As cinco versões já eram ativas e vêm do principal,sem restauração/extensão prevalente diversa. Sondagem final confirma igualdade integral principal/runtime e invariância nas duas transformações. O primeiro formato experimental deM3 com rótulos(I)–(IV) não foi reconhecido;substituído pelo formato( ) com instrução antes dos itens. Nenhuma heurística,flag ou critério de teste foi alterado para aceitar conteúdo inválido. auditQuestion sem issues é evidência estrutural automática,não aprovação editorial.

ANV-0497 permanece inalterada e ausente runtime:bruta ativa,após transformações stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência individual contabilizada. Grupo115a conserva seus três modelos,formatos assertion_combination/conceptual/true_false e flags legadas. Variantes da mesma competência não devem coexistir na prova;prevenção semântica global pendente. O material de112,113 e demais itens vistos como contexto não recebeu aprovação nem conferência individual adicional. Tracking/taxonomy v1 legados dos doisANV mantidos,com source v2 explícito e reconciliação global pendente.

## Validação e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validação runtime,seleção/matriz,proveniência,catálogo,regressão e check:pscpp-bank. Regressão:195 deltas acumulados exatos,11907 ocorrências de cadernos preservadas,428 proposições renderizadas e440 alternativas diretas preservadas. Exatamente cinco IDs efetivos e cinco objetos principais mudaram frente ao065;1984 PSCPP intactos. População14086=12102+1984,13715IDs únicos,27435 registros físicos e matriz100=25/25/10/10/10/10/10 preservadas.

Build completo em cópia isolada passou com log integral:compilação,lint/tipos,101/101 páginas e rotas. Os1285 arquivos rastreados fora de docs e seis artefatos gerados coincidem byte a byte com a cópia testada. Avisos de CSS/cache/npm não impediram sucesso;nenhuma aprovação de release inferida.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,0aceitas/14086pendentes. Triagem e inventário regenerados:169 candidatos sem proposições e77localizadores. REVISOES_EDITORIAIS intacto. Resultados reais dos comandos:

| Comando | Saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|

Acumulado sem recontagem:195IDs corrigidos,198 conferências parciais eZERO aprovações finais;190 correções anteriores intactas. Este lote acrescenta cinco correções e cinco conferências. Dos256 candidatos originais:84 corrigidos+3 falsos positivos+169 restantes;111 correções fora da triagem;84+111=195. Próximo candidato independente AN-C11-112-M1,roda do leme,com exame individual dos três modelos e de todas as versões efetivas. Os trêsANV sem fonte resolvida0142/0176/0253 permanecem pendentes,assim como0840/0874/0651,1036M1 excluído,12.15AR e demais impedimentos documentados.

Todos os oito gates permanecem pendentes/falhos;merge_permitted=false. Faltam revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/aplicabilidade completas,diversidade semântica,consumidores/offline/SQL e homologação. Sem merge,deploy ou mutação de dados de usuários. Este relatório,CHECKPOINT e hashes antes/depois compõem o mesmo commit;publicação exige igualdade exata local/remota e expected_sha sem force.

# Lote 067 — roda do leme e malaguetas

Base remota `3957edcae82e59a333de808e69cc1354296f9245`. HEAD remoto e PR172 aberto/draft conferidos antes de editar;CHECKPOINT066 e relatório066 prevalecem sobre os números antigos do prompt. Contexto suficiente do Prompt-Mestre e benchmark histórico previamente lidos preservado. Árvore rastreada local limpa/antiga atualizada por fast-forward;temporários não rastreados preservados. `ps -eo pid,comm` retornou `fatal library error, lookup self`;não se afirma enumeração global bem-sucedida de escritores. Publicação exige hashes estáveis,igualdade de árvore e expected_sha sem force.

## Fonte primária e limites

Fonseca,Arte Naval v.2,8ª edição,2019:item11.2,pp.[755]–756/PDF116–117,figura11-1;contexto11.1 e definição de gualdropes em11.3,p.756/PDF117. Duas páginas únicas lidas integralmente em texto e imagens. **A abertura não tem numeral impresso:[755] é inferido pela sequência imediatamente anterior à página756.** PDF116 é exato;756 foi visto na imagem. Nota de inferência em source.page_note e nas conferências correspondentes. M2 utiliza apenas a página impressa756/PDF117,onde se definem as malaguetas.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. A figura11-1 mostra a roda e seus punhos;não se mediram dimensões,ângulos,forças ou curso do leme. Os itens são resolvíveis pelo texto,sem depender de imagem ausente.

A relação de giro,leme e guinada foi delimitada ao arranjo descrito,ao timoneiro voltado para a proa e à marcha a vante. Não se universaliza a relação a qualquer instalação,condição de seguimento ou manobra. A segunda roda de emergência é descrição da obra,sem transformar uma observação editorial em requisito atual obrigatório para todo navio. Aplicabilidade completa de equipamentos,programa/edital,anexos oficiais e normas permanecem pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-112-M1 | Quatro proposições desapareciam no carregamento;explicação repetitiva não julgava as falsas e faltavam justificativas. | Restaurados quatro itens,explicitando arranjo,marcha a vante e ponto de vista do timoneiro;distintos punhos e cabos;explicação e cinco justificativas;páginas/hash/nota de inferência;Médio/L2 proposto. |11.2,pp.[755]–756/PDF116–117;fig11-1;contexto11.3.|D mantido;V/V/F/F|
| AN-C11-112-M2 | Explicação definia a roda,sem explicar malaguetas;alternativas desbalanceadas e dificuldade excessiva para recordação. | Cinco descrições comparáveis de localização/função;explicação da resposta e de cada distrator;referência exata756/PDF117/hash;Fácil/L1 proposto. |11.2,p.756/PDF117;fig11-1.|E mantido|
| AN-C11-112-M3 | Explicação repetia itens sem julgar cada um;comando por artigo e descrição da segunda roda pouco delimitada. | Objeto explícito e contexto da edição;distinta descrição da segunda roda de exigência universal;quatro julgamentos e cinco justificativas;V/F preservado;páginas/hash/nota;Médio/L2. |11.2,pp.[755]–756/PDF116–117;contexto11.3.|B mantido;V/V/F/V|
| ANV-0819 | Pergunta genérica e alternativas heterogêneas entre pessoa,componente e mecanismo. | Cinco caracterizações construtivas paralelas,mudando material,orientação ou plano do eixo;explicação e cinco justificativas;páginas/hash/nota;Médio/L2. |11.2,pp.[755]–756/PDF116–117.|D mantido|

Quatro correções primárias parciais e20 justificativas;zero aprovações finais. SóM1 recupera quatro proposições antes ausentes do enunciado efetivo. M3 já tinha quatro itens reconhecidos e não foi contado como restauração. Níveis/dificuldades são propostas,sem calibração psicométrica aprovada. IDs,chaves,tracking/taxonomy,provenance,validation e três formatos preservados;flags legadas não aceitas como aprovação final.

## Julgamentos e unicidade

M1:I/II verdadeiras pela construção e pela relação de bordos condicionada ao arranjo/marcha;III falsa,pois malaguetas são punhos;IV falsa,pois inverte os bordos da relação descrita. SóD reúneI/II. A incluiIII eomiteII;B incluiIV eomiteI;C reúneIII/IV falsas;E inclui ambas falsas. Os cabos não foram confundidos com os punhos apenas para conservar a chave: a definição explícita e a figura sustentam a distinção.

M2:sóE identifica os punhos e sua função. A descreve ligação flexível;B elementos dentados;C indicação angular;D limitação de curso. Esses descritores não são sinônimos dos punhos. A explicação anterior sobre material/eixo da roda não respondia à pergunta sobre malaguetas;foi substituída.

M3:V/V/F/V,sóB. A erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. II relata o que a obra descreve sobre a segunda roda e não afirma universalidade em navios atuais. 0819:sóD mantém madeira ou metal,eixo horizontal e plano diametral. A troca orientação;B troca plano;C exclui metal;E exclui madeira. Os dois distratores de material usam obrigatoriedade indevida,sem negar que uma roda concreta possa ser exclusivamente de um dos materiais.

## Precedência,variantes e preservação

Os quatro objetos já ativos provêm do principal;nenhuma restauração/extensão prevalece sobre eles. Sondagem final confirma igualdade integral principal/runtime e invariância em reformulateLeakingStem/normalizeEditorialStem;auditQuestion sem issues. Nenhuma heurística,nova flag ou teste relaxado. A evidência automática estrutural não comprova aprovação editorial.

ANV-0320 permanece fisicamente inalterada e ausente runtime:política bruta e após transformações answer-leak:stem_answer_continuation. Sem ativação,nova quarentena ou conferência individual contabilizada. Grupo112 mantém seus três modelos assertion_combination/conceptual/true_false. A leitura de contexto113 não representa revisão individual dos seus modelos. Tracking/taxonomy v1 legado de0819 preservado com source v2 explícito;reconciliação global pendente. Variantes que repetem malaguetas,construção ou comando de bordos não devem coexistir na mesma prova;prevenção semântica global continua pendente.

## Validação e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validação runtime,seleção/matriz,proveniência,catálogo,regressão e check:pscpp-bank. Regressão:199 deltas acumulados exatos,11903 ocorrências de cadernos preservadas,436 proposições renderizadas e450 alternativas diretas preservadas. Exatamente quatro IDs efetivos e quatro objetos principais mudaram frente ao066;1984PSCPP intactos. População14086=12102+1984,13715IDs únicos,27435 registros físicos e matriz100=25/25/10/10/10/10/10 preservadas.

Build completo em cópia isolada passou com log integral:compilação,lint/tipos,101/101 páginas e rotas. Os1285 arquivos rastreados fora de docs e seis artefatos gerados coincidem byte a byte com a cópia testada. Avisos de CSS/cache/npm não impediram sucesso;nenhuma aprovação de release inferida.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,0aceitas/14086pendentes. Triagem e inventário regenerados:168candidatos sem proposições e77localizadores. REVISOES_EDITORIAIS intacto. Resultados reais dos comandos:

| Comando | Saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|

Acumulado sem recontagem:199IDs corrigidos,202conferências parciais,ZEROaprovações finais;195correções anteriores intactas. Este lote acrescenta quatro IDs e quatro conferências. Dos256candidatos originais:85corrigidos+3falsos positivos+168restantes;114correções fora dessa triagem;85+114=199. Próximo candidato independente AN-C11-113-M1,leme à mão,com exame dos três modelos e de todas as versões efetivas.

Impedimentos0142/0840,0176/0874,0253/0651,modelo1036M1 excluído,inconsistência12.15AR e demais pendências anteriores preservados. Todos os oito gates seguem pendentes/falhos;merge_permitted=false. Revisão individual de100%das ocorrências ativas,rechecagem independente,bibliografia/aplicabilidade,programa/edital,diversidade semântica,consumidores/offline/SQL e homologação pendentes. Sem merge,deploy ou mutação de dados de usuários. Relatório,CHECKPOINT e hashes antes/depois compõem o mesmo commit;publicação exige igualdade local/remota e expected_sha sem force.

# Lote 068 — leme à mão, gualdropes e precedência da restauração

Base remota `902093dddfb86b3e8c61550f4d1f91a364f95b2e`. HEAD remoto e PR172 aberto/draft consultados antes de editar;CHECKPOINT067 e relatório067 prevalecem sobre os números antigos do prompt. Contexto suficiente do Prompt-Mestre e benchmark histórico previamente lidos preservado. Árvore rastreada local limpa/antiga atualizada por fast-forward;temporários não rastreados preservados. `ps -eo pid,comm` retornou `fatal library error, lookup self`;não se afirma enumeração global bem-sucedida de escritores. Publicação exige hashes estáveis,igualdade de árvore e expected_sha sem force.

## Fonte primária e figura

Fonseca,Arte Naval v.2,8ª edição,2019:item11.3,p.756/PDF117;figura11-2,p.757/PDF118. Duas páginas únicas lidas integralmente em texto e imagens,incluindo contexto11.2 e11.4.a/b presente nessas páginas. Numerais756/757 vistos,sem inferência de paginação neste lote. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados.

O texto distingue composição básica,função e materiais dos gualdropes,tambor solidário à roda,ação oposta dos bordos e golas metálicas chamadas macarrões. A figura11-2 mostra tambor,rodetes,macacos para regular tensão,molas para reduzir choques,segmentos explicitamente identificados como transmissão rígida de vergalhões,madre e quadrante. Não se chamou todo o circuito de um único cabo contínuo ou de transmissão exclusivamente flexível. A figura11-1 e o trecho de11.2 dão contexto de roda/malaguetas,sem nova conferência individual de questões112.

As questões são resolvíveis pelo texto,sem depender de imagem ausente. Sem medidas,cálculos de ganho mecânico ou novas prescrições de instalação/manutenção. O emprego comum em embarcações miúdas é descrição da obra,não obrigação universal atual. Aplicabilidade completa de equipamentos,programa/edital,anexos oficiais e normas permanecem pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-113-M1 | Quatro proposições desapareciam no carregamento e explicação repetia itens sem julgar falsas. | Restaurados quatro itens sobre composição,função dos gualdropes e distinção macarrões/tambor;explicação dos julgamentos e cinco justificativas;páginas/hash;Médio/L2 proposto. |11.3,p.756/PDF117;fig11-2,p.757/PDF118.|C mantido;V/V/F/F|
| AN-C11-113-M2 | Explicação sobre simplicidade não respondia à função dos gualdropes;comando por artigo e alternativas heterogêneas. | Objeto explícito,cinco funções comparáveis;explicação da transmissão mecânica e cinco justificativas;páginas/hash;Fácil/L1 proposto. |11.3,p.756/PDF117;fig11-2.|D mantido|
| AN-C11-113-M3 | Explicação repetitiva sem julgar a falsa;comando dependente de localizador. | Contexto explícito do arranjo,cinemática do tambor e distinção entre transmitir/limitar;V/F e quatro julgamentos preservados,cinco justificativas;páginas/hash;Médio/L2. |11.3,p.756/PDF117;fig11-2,p.757/PDF118.|E mantido;V/V/F/V|
| ANV-0185 | Proposições genéricas/misturadas;uma definição ampla era tratada como falsa pela chave. Restauração prevalente reintroduzia o enunciado antigo após normalização. | Quatro afirmações verificáveis sobre composição,tambor e macarrões;corrigidos principal e registro prevalente de notebook-complete-stems para o mesmo enunciado;explicação e cinco justificativas;páginas/hash;Médio/L2. |11.3,p.756/PDF117;fig11-2,p.757/PDF118.|E mantido;F/V/F/V|
| ANV-0734 | Pergunta genérica e alternativas misturavam pessoa,aparelho e peças. | Caso explícito de tambor solidário à roda,cinco relações comparáveis entre ação dos dois bordos e efeito sobre a cana;explicação e cinco justificativas;páginas/hash;Médio/L2. |11.3,p.756/PDF117;fig11-2,p.757/PDF118.|D mantido|
| ANV-0883 | Comando genérico e alternativas heterogêneas entre componentes e sistemas. | Cinco conjuntos paralelos para a composição básica indicada na obra;explicação e cinco justificativas,páginas/hash;Fácil/L1 proposto. |11.3,p.756/PDF117;fig11-2.|C mantido|

Seis correções primárias parciais e30 justificativas;zero aprovações finais. Só113M1 recupera quatro proposições ausentes na versão efetiva. 113M3 e0185 já tinham quatro itens reconhecidos;não foram contados como restauração. Níveis/dificuldades são propostas,sem calibração psicométrica aprovada. IDs,chaves,tracking/taxonomy,provenance,validation e três formatos preservados;flags legadas não aceitas como aprovação final.

## Julgamentos e unicidade

113M1:I/II verdadeiras,III/IV falsas;sóC reúneI/II. A incluiIII;B incluiIV;D reúneIII/IV falsas;E inclui ambas falsas. Macarrões são golas de passagem,não tambor. 113M2:sóD apresenta transmissão mecânica do movimento;A a nega em favor de limitação;B troca por pressão líquida;C por indicação sem acionamento;E por conversão elétrica.

113M3:V/V/F/V,sóE. A erraII/III/IV;B erraI/III/IV;C erraI/II/III;D erraIII. A ação oposta dos bordos vale para o arranjo descrito e não elimina os segmentos rígidos identificados no desenho.

0185:F/V/F/V,sóE. A reúneI/III falsas;B incluiI eomiteII;C incluiI eomiteIV;D incluiIII eomiteIV. A antiga definição genérica de aparelho de governo não foi declarada falsa só por não integrar a chave:foi substituída por afirmação inequívoca sobre macarrões/tambor. 0734:sóD mantém ação oposta e movimento da cana;A/B impõem ação simultânea;C nega efeito na cana;E nega transmissão pelo tambor solidário. 0883:sóC reúne a composição básica enumerada;A/B omitem gualdropes e leme;D não reúne roda/leme;E substitui gualdropes. As alternativas não certificam projetos alternativos nem perguntam se outros componentes podem existir a bordo.

## Precedência e preservação

Os seis objetos já eram ativos. Cinco vêm diretamente do principal. ANV-0185 recebe o enunciado de data/question-restorations/notebook-complete-stems.json,aplicado depois da normalização. Corrigido exclusivamente o campo question de seu registro,além do objeto principal;reasons,source_file,versão,demais registros e lógica do restaurador preservados. A aplicação final continua acrescentando a mesma marca automática complete_stem_restored/versão existente;essa marca não é nova aprovação editorial. O enunciado prevalente é agora igual ao principal. As seis versões são invariantes nas duas transformações anteriores e a sondagem confirma igualdade integral runtime/objeto esperado,incluindo apenas a marca automática preservada em0185. auditQuestion sem issues;não houve bypass,nova flag manual ou relaxamento de testes.

O primeiro teste de enunciados retornou falha nova Primary restoration missing:ANV-0185,pois sua seleção de fonte só consultava arte-naval.json das restaurações. O contrato foi estendido explicitamente para buscar0185 no principal,com exigência de source_file correto e preservação das verificações de hash efetivo completo,enunciado,explicação,gabarito e opções. Nenhuma exceção genérica nem supressão de asserção. Teste e build repetidos após a alteração;build anterior não é apresentado como validação dos insumos finais.

ANV-0145 já corrigida em lote anterior permanece inalterada: a versão efetiva vem de arte-naval.json das restaurações e aborda transmissão mecânica rígida;seu original físico diferente não foi reeditado nem recontado. ANV-0384 e0535 permanecem inalteradas e ausentes runtime:0384 explicitamente inativa antes/depois;0535 bruta ativa e após transformações answer-leak:stem_answer_continuation. Sem ativação,nova quarentena ou conferência individual contabilizada desses IDs.

O grupo113 conserva os três modelos assertion_combination/conceptual/true_false. Tracking/taxonomy v1 legados dosANV não foram globalmente reconciliados com source v2 explícito. Variantes da mesma competência sobre composição,transmissão ou tambor não devem coexistir na mesma prova;prevenção semântica global pendente. O contexto de114 não recebeu revisão individual adicional.

## Validação e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validação runtime,seleção/matriz,proveniência,catálogo,regressão e check:pscpp-bank. Regressão:205 deltas acumulados exatos,11897 ocorrências de cadernos preservadas,448 proposições renderizadas e465 alternativas diretas preservadas. Exatamente seis IDs efetivos e seis objetos principais mudaram frente ao067,mais exclusivamente o enunciado do registro prevalente0185;1984PSCPP intactos. População14086=12102+1984,13715IDs únicos,27435 registros físicos e matriz100=25/25/10/10/10/10/10 preservadas.

Build completo em cópia isolada passou com log integral:compilação,lint/tipos,101/101 páginas e rotas. Os1285 arquivos rastreados fora de docs e seis artefatos gerados coincidem byte a byte com a cópia testada. Avisos de CSS/cache/npm não impediram sucesso;nenhuma aprovação de release inferida.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,0aceitas/14086pendentes. Triagem e inventário regenerados:167candidatos sem proposições e77localizadores. REVISOES_EDITORIAIS intacto. Resultados reais dos comandos:

| Comando | Saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|

Acumulado sem recontagem:205IDs corrigidos,208conferências parciais,ZEROaprovações finais;199correções anteriores intactas. Este lote acrescenta seis IDs e seis conferências. Dos256candidatos iniciais:86corrigidos+3falsos positivos+167restantes;119correções fora da triagem;86+119=205. Próximo candidato independente AN-C11-114-M1,máquina do leme,com exame dos três modelos e de todas as versões efetivas.

Impedimentos0142/0840,0176/0874,0253/0651,1036M1 excluído,inconsistência12.15AR e demais pendências preservados. Todos os oito gates seguem pendentes/falhos;merge_permitted=false. Revisão individual de100%das ocorrências ativas,rechecagem independente,bibliografia/aplicabilidade,programa/edital,diversidade semântica,consumidores/offline/SQL e homologação pendentes. Sem merge,deploy ou mutação de dados de usuários. Relatório,CHECKPOINT e hashes antes/depois compõem o mesmo commit;publicação exige igualdade local/remota e expected_sha sem force.

# Lote 069 — generalidades da máquina do leme e localização do servomotor

Base remota `3804f46e710c6535d107ef1a8f8bf0102d312ea8`. HEAD remoto e PR172 aberto/draft consultados antes de editar;CHECKPOINT068 e relatório068 prevalecem sobre os números antigos do prompt. Contexto suficiente do Prompt-Mestre e benchmark histórico previamente lidos preservado. Árvore rastreada local limpa/antiga atualizada por fast-forward;temporários não rastreados preservados. `ps -eo pid,comm` retornou `fatal library error, lookup self`;não se afirma enumeração global bem-sucedida de escritores. Publicação exige hashes estáveis,igualdade de árvore e expected_sha sem force.

## Fonte primária e escopo

Fonseca,Arte Naval v.2,8ª edição,2019:11.4.a,p.757/PDF118;contexto11.4.b–e,pp.758–760/PDF119–121. Quatro páginas únicas lidas integralmente em texto e imagens;numerais757–760 vistos,sem paginação inferida. A renderização inicial de uma página não abriu corretamente;PDF120/121 foram renderizados novamente e as imagens válidas conferidas antes das alterações de conteúdo. Figura11-2 é contexto do leme à mão;11-3 mostra o servomotor a vapor e11-4 o diagrama hidrelétrico. Conferidos motor,bomba,controle e cilindros no contexto,sem medir potência,força,ângulos,dimensões ou rendimento pelas figuras. Perguntas resolvíveis pelo texto,sem depender de imagem ausente.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. A leitura das páginas de contexto não equivale a aprovar todos os seus números,comparações de custo/eficiência ou modelos associados. A referência à metade da potência no tipo hidrelétrico não foi usada como benefício quantitativo universal. Os detalhes de pressão no neutro e das instalações específicas não receberam aprovação geral neste lote.

As questões se concentram em denominação,requisitos de atuação,localização e proteção descritos em11.4.a. O requisito de atuação a baixa velocidade não foi transferido indiscriminadamente para todos os componentes:11.4.c descreve motor de alta rotação. A definição inicial associada à roda não foi convertida em exigência universal de roda:11.4.e admite alavanca em seu lugar. A posição do compartimento e a couraça são descrições da edição,sem afirmar vigência normativa ou universalidade em navios atuais. Aplicabilidade completa,anexos oficiais,programa/edital e normas continuam pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-114-M1 | Proposições apagadas e explicação repetitiva sem julgar falsas;generalidade sobre roda podia ser lida como universal. | Restaurados quatro itens sobre denominação,requisitos e localização;delimitados comando por roda e velocidade de atuação;explicação e cinco justificativas;página/hash;Médio/L2 proposto. |11.4.a,p.757/PDF118;contraste11.4.c/e,pp.758–760/PDF119–121.|A mantido;V/V/F/F|
| AN-C11-114-M2 | Comando por artigo,resposta desbalanceada e distratores heterogêneos. | Cinco perfis paralelos de força,velocidade,variação e inversão;explicação de cada diferença e cinco justificativas;página/hash;Médio/L2. |11.4.a,p.757/PDF118;contexto11.4.c.|D mantido|
| AN-C11-114-M3 | Explicação repetia proposições sem julgar a falsa e sem delimitar a referência à roda. | Objeto explícito,razão da localização,lista da obra e distinção da alavanca elétrica;quatro julgamentos e cinco justificativas;V/F preservado;página/hash;Médio/L2. |11.4.a,p.757/PDF118;contexto11.4.e,pp.759–760/PDF120–121.|E mantido;V/V/F/V|
| AN-C11-114a-M2 | Comando por artigo e alternativas heterogêneas de localização/objetivo. | Cinco critérios de localização comparáveis,preservando sempre que possível e a finalidade de proteção;explicação e cinco justificativas;página/hash;Médio/L2. |11.4.a,p.757/PDF118.|B mantido|
| AN-C11-114a-M3 | Comando por localizador e explicação repetitiva;descrição de compartimentos sem escopo histórico explícito. | Quatro julgamentos fundamentados,condição de afastamento e descrições da obra delimitadas;V/F preservado e cinco justificativas;página/hash;Médio/L2. |11.4.a,p.757/PDF118.|C mantido;V/V/F/V|

Cinco correções primárias parciais e25 justificativas;zero aprovações finais. Só114M1 recupera quatro proposições ausentes no enunciado efetivo. Os doisM3 já tinham quatro itens reconhecidos e não foram contados como restauração. Dificuldade/nível são propostas,sem calibração psicométrica aprovada. Chaves,IDs,tracking/taxonomy,provenance,validation e formatos preservados;marcas legadas não aceitas como aprovação final.

## Julgamentos e unicidade

114M1:I/II verdadeiras pela explicação da denominação e requisitos;III falsa porque alonga a transmissão que se deseja evitar;IV falsa porque inverte força/velocidade e dispensa inversão. SóA reúneI/II. B incluiIII eomiteII;C incluiIV eomiteI;D reúneIII/IV falsas;E inclui ambas falsas. A referência à roda é relação textual de denominação,não negação da alavanca admitida em11.4.e.

114M2:sóD mantém os quatro elementos. A reduz a força;B eleva a velocidade de atuação;C retira a variação;E retira a inversão. As cinco alternativas têm estrutura e extensão comparáveis,sem vantagem pela extensão da resposta. O motor elétrico de alta rotação de11.4.c não tornaB correta: a pergunta é sobre os requisitos de atuação da máquina,sem igualar velocidade de componente e atuação no leme.

114M3:V/V/F/V,sóE. A erraII/III/IV;B erraI/III/IV;C erraI/II/III;D erraIII. A lista de tipos é a apresentada no texto,não uma taxonomia tecnológica completa e atual.

114aM2:sóB mantém a orientação de evitar adjacência aos costados sempre que possível. A inverte o critério;C cria dispensa baseada em contiguidade;D alonga transmissões;E cria dispensa pela máquina a vapor. Preserva-se a condição,sem proibir absolutamente toda proximidade ao costado. 114aM3:V/V/F/V,sóC. A erraII/III/IV;B erraI/III/IV;D erraI/II/III;E erraIII. I/IV relatam a descrição da edição para classes de navios,não uma obrigação universal vigente de couraça ou posição acima do convés.

## Precedência,regime de modelos e pendências

Os cinco objetos já ativos vêm diretamente do principal,sem restauração/extensão prevalente diferente. Sondagem confirma igualdade integral principal/runtime,invariância nas duas transformações e auditQuestion sem issues;escore automático não é aprovação editorial. Nenhuma nova flag,alteração de heurística ou supressão de asserção. A correção da restauração de0185 e seu contrato estrito de fonte,publicados no068,permanecem intactos.

AN-C11-114a-M1 permanece fisicamente inalterada e ausente runtime:política bruta answer-leak:stem_answer_continuation;após transformações generic-or-undefined-object. Proposições físicas existentes são substituídas por comando genérico;defeito não tratado neste lote. Sem ativação,nova quarentena ou conferência individual contabilizada desse ID. Grupo114 mantém três modelos ativos;grupo114a conserva três modelos físicos,com dois já ativos parcialmente corrigidos eM1 excluído/pending. Não se declara aprovação integral do item114a. Os formatos assertion_combination/conceptual/true_false e as flags legadas foram preservados.

Variantes sobre os mesmos requisitos ou critérios de localização/proteção não devem coexistir na mesma prova;prevenção semântica global pendente. A leitura do contexto b–e não representa nova revisão individual dos modelos desses subitens ou recontagem das correções de114e anteriormente publicadas.

## Validação e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validação runtime,seleção/matriz,proveniência,catálogo,regressão e check:pscpp-bank. Regressão:210 deltas acumulados exatos,11892 ocorrências de cadernos preservadas,460 proposições renderizadas e475 alternativas diretas preservadas. Exatamente cinco IDs efetivos e cinco objetos principais mudaram frente ao068;1984PSCPP intactos. População14086=12102+1984,13715IDs únicos,27435 registros físicos e matriz100=25/25/10/10/10/10/10 preservadas.

Build completo em cópia isolada passou com log integral:compilação,lint/tipos,101/101 páginas e rotas. Os1285 arquivos rastreados fora de docs e seis artefatos gerados coincidem byte a byte com a cópia testada. Avisos de CSS/cache/npm não impediram sucesso;nenhuma aprovação de release inferida.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,0aceitas/14086pendentes. Triagem e inventário regenerados:166candidatos sem proposições e77localizadores. REVISOES_EDITORIAIS intacto. Resultados reais dos comandos:

| Comando | Saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|

Acumulado sem recontagem:210IDs corrigidos,213conferências parciais,ZEROaprovações finais;205correções anteriores intactas. Este lote acrescenta cinco IDs e cinco conferências. Dos256candidatos iniciais:87corrigidos+3falsos positivos+166restantes;123correções fora da triagem;87+123=210. Próximo candidato independente AN-C11-114b-M1,servomotor a vapor,com exame dos três modelos e das referências cruzadas necessárias.

Mantidos impedimentos0142/0840,0176/0874,0253/0651,1036M1 e114aM1 excluídos,inconsistência12.15AR e demais pendências anteriores. Todos os oito gates seguem pendentes/falhos;merge_permitted=false. Revisão individual de100%das ocorrências ativas,rechecagem independente,bibliografia/aplicabilidade,programa/edital,diversidade semântica,consumidores/offline/SQL e homologação pendentes. Sem merge,deploy ou mutação de dados de usuários. Relatório,CHECKPOINT e hashes antes/depois compõem o mesmo commit;publicação exige igualdade local/remota e expected_sha sem force.

# Lote 070 — comando do servomotor a vapor

Base remota `f177ca98cac8183f545272a099cb5444642a4978`. HEAD remoto e PR #172 aberto/draft consultados antes de editar. CHECKPOINT 069 e relatório 069 lidos; o Prompt-Mestre foi relido integralmente. Árvore rastreada inicialmente limpa e HEAD local igual ao remoto; temporários não rastreados preservados. Lock cooperativo `flock` adquirido durante esta rodada. A enumeração de processos falhou com `fatal library error, lookup self`; não se afirma enumeração global de escritores. A estabilidade dos insumos e a publicação com expected_sha sem force são verificações adicionais, sem garantia de exclusão de escritores que ignorem o lock.

## Fonte primária e limites

Fonseca, Arte Naval, volume 2, 8ª edição, 2019: item 11.4.b, pp.757–758/PDF118–119, figura 11-3. Contexto: 11.4.d, p.759/PDF120 (mecanismo compensador) e remissão a 10.30.c(1), p.743/PDF104. Quatro páginas únicas lidas em texto e imagens; os quatro numerais impressos foram vistos, sem paginação inferida. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; exemplar Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados.

Figura 11-3 conferida como ilustração do servomotor a vapor; 11-2 e 11-4 presentes no contexto, sem extrair medidas, potência, desempenho ou dimensionamento. As questões não dependem de figura ausente. A remissão a 10.30.c(1) foi localizada e lida, mas não se acrescentaram questões sobre vantagens/desvantagens neste lote. As afirmações sobre frequência de emprego ficam delimitadas à descrição da edição: não houve levantamento da frota atual. Não se aprovam automaticamente as comparações de eficiência/custo do texto hidrelétrico adjacente, nem sua descrição de pressão no neutro.

11.4.d esclarece que a própria máquina também atua sobre a válvula pelo compensador. Por isso, o comando pela roda não foi apresentado como exclusivo. A condição central descrita em 11.4.b não foi convertida na afirmação de que o leme só possa parar a meio: o compensador permite interromper o movimento no ângulo desejado. Não se formula prescrição universal para instalações atuais nem certificação normativa. Programa/edital e aplicabilidade completa continuam pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-114b-M1 | Quatro proposições físicas desapareciam após transformação de enunciado; explicação repetia inclusive falsas sem julgá-las. | Restauradas quatro afirmações sobre emprego na obra, posição central, admissão e comando; explicação de cada julgamento e cinco justificativas; ressalva sobre compensador; páginas e hash. Médio/L2 proposto. | 11.4.b, pp.757–758/PDF118–119; contexto 11.4.d, p.759/PDF120. | E mantido; V/V/F/F. |
| AN-C11-114b-M2 | Explicação sobre emprego não respondia ao estado da válvula perguntado; distratores heterogêneos e dificuldade desproporcional. | Cinco associações paralelas entre posição da válvula, admissão e estado da máquina; explicação que responde à pergunta e cinco justificativas; distinção entre máquina parada e posição do leme; páginas e hash. Fácil/L1 proposto. | 11.4.b, p.758/PDF119; contexto 11.4.d, p.759/PDF120. | A mantido. |
| AN-C11-114b-M3 | Explicação repetitiva não justificava a falsa; comando por localizador e emprego sem delimitação histórica. | Objeto e escopo explícitos, quatro julgamentos fundamentados e cinco justificativas; comando da roda sem excluir compensador; V/F preservado; páginas e hash. Médio/L2 proposto. | 11.4.b, pp.757–758/PDF118–119; contexto 11.4.d, p.759/PDF120. | B mantido; V/V/F/V. |

Três correções primárias parciais, quinze justificativas e zero aprovações finais. M1 recupera quatro proposições ausentes no enunciado efetivo; M3 já possuía quatro itens reconhecidos e não foi contado como restauração. As classificações de dificuldade e nível são propostas, sem calibração psicométrica aprovada.

## Julgamentos, identidade e precedência

M1: I verdadeira no escopo da obra; II verdadeira pela relação centro/fechamento/parada; III falsa por inverter a admissão; IV falsa porque os movimentos da roda comandam a válvula. Só E reúne I/II. A inclui III e omite II; B inclui IV e omite I; C reúne III/IV falsas; D inclui ambas falsas. O compensador também comanda a válvula, sem tornar IV verdadeira.

M2: só A conserva os três elementos. B troca fechamento e parada por abertura e movimento. C confunde o estado central perguntado com a atuação para um bordo. D desloca lateralmente a válvula em vez de mantê-la a meio. E mantém aberta a admissão, contrariando o fechamento descrito. Os estados são os do arranjo textual, sem cálculo dinâmico de transientes ou generalização para outras válvulas.

M3: V/V/F/V, só B. A erra II/III/IV; C erra I/III/IV; D erra I/II/III; E erra III. A palavra comando não implica exclusividade da roda nem dispensa de compensador.

Os três modelos já estavam ativos, com a fonte principal prevalente. Após a correção, principal e runtime coincidem integralmente; as duas transformações deixam os três objetos invariantes. auditQuestion sem issues não é aprovação editorial. Nenhuma política, heurística ou flag foi alterada. A regressão foi ampliada apenas nas listas explícitas de fonte/formato dos três IDs documentados, preservando hashes completos, contagem de proposições, renderização e asserções anteriores. IDs, gabaritos, formatos, tracking, taxonomia, provenance e validation legados preservados; flags antigas não aceitas como aprovação final.

O regime de três modelos foi preservado. As variantes dessa competência não devem coexistir na mesma prova; a prevenção semântica global ainda está pendente. Não se recontaram revisões anteriores nem se ativaram os modelos excluídos 1036M1/114aM1. ANV-0142 e demais impedimentos anteriores permanecem.

## Validação

Regenerados runtime PSCPP, bancos, catálogo e flashcards. Passaram validação runtime, seleção/matriz, proveniência, catálogo, regressão e check:pscpp-bank. Regressão: 213 deltas acumulados exatos, 11889 ocorrências de cadernos preservadas, 468 proposições renderizadas e 480 alternativas diretas preservadas. Exatamente três IDs efetivos e três objetos principais mudaram frente ao lote 069. Permanecem 27435 registros físicos, 14086 ocorrências (12102 cadernos + 1984 PSCPP) e 13715 IDs únicos; matriz 100=25/25/10/10/10/10/10 preservada.

A primeira execução retornou zero, mas seu log terminou durante a geração de páginas e não foi aceito como prova integral. A segunda execução, na mesma cópia isolada e sem mudança de insumos, retornou zero com 101/101 páginas e resumo completo de rotas. Ambos os logs foram preservados privadamente.

Build completo em cópia isolada passou, com log integral de compilação, lint/tipos, 101/101 páginas e rotas. Os 1285 arquivos rastreados fora de docs e os seis artefatos gerados coincidem byte a byte com a cópia testada. Avisos de CSS/cache/npm não impediram o sucesso; isso não é aprovação de release.

Falhas conhecidas mantidas: test-notebook-complete-stems exit1 em ANV-0142; validate-editorial-runtime exit1 nos 77 localizadores; validate-pscpp-editorial-evidence exit2, zero ocorrências aceitas e 14086 pendentes. Inventário e triagem regenerados: 165 candidatos sem proposições e 77 localizadores. REVISOES_EDITORIAIS permanece inalterado.

| Comando | Código de saída |
|---|---|
|npm run generate:pscpp-bank|0|
|npm run generate:question-banks|0|
|npm run generate:question-catalog|0|
|npm run generate:flashcard-decks|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-banks.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-exam-selection.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-question-source-provenance.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-runtime-question-catalog.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-pscpp-audit-anv0005.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/test-notebook-complete-stems.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-editorial-runtime.mjs|1|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-triage.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/audit-pscpp-runtime-inventory.mjs|0|
|node --no-warnings --experimental-loader ./scripts/pscpp-json-loader.mjs scripts/validate-pscpp-editorial-evidence.mjs|2|
|npm run check:pscpp-bank|0|

## Acumulado e continuidade

213 IDs corrigidos, 216 conferências bibliográficas parciais, zero aprovações finais. Das 256 entradas iniciais da triagem: 88 corrigidas, 3 falsos positivos resolvidos e 165 restantes; 125 correções fora dessa triagem; 88+125=213. Permanecem 77 localizadores. Os 210 IDs anteriores não foram recontados. Correções abrangem 213/13715 = 1,55% dos IDs únicos do banco; isso não é percentual de auditoria integral concluída.

Próxima revisão independente: AN-C11-114c-M1, examinando os três modelos do servomotor hidrelétrico e as remissões necessárias. Rechecagem independente, fontes oficiais/edital, cobertura, bibliografia/aplicabilidade, prevenção semântica, consumidores/offline/SQL e homologação integral continuam pendentes. Os oito gates seguem pendentes/falhos; merge_permitted=false. Sem merge, deploy ou alteração de dados de usuários.
