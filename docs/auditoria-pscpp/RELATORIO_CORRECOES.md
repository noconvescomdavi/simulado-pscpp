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

Questões reescritas acumuladas: 15 (ANV-0005/0007/0016/0020/0021/0023/0025/0037/0038/0039/0041/0043/0044/0045/0046); substituídas: 0; novas: 0; quarentenadas nesta etapa: 0.
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
