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

Acumulado vigente após lote 042: **92 IDs corrigidos distintos**, 95 conferências bibliográficas parciais, zero aprovações finais. Relação completa e sem recontagem em CHECKPOINT.json e CORRECOES_RUNTIME.json; números dos parágrafos de lotes abaixo são históricos. Substituídas: 0; novas: 0; quarentenadas nesta etapa: 0.
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
