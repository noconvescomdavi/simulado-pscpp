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
