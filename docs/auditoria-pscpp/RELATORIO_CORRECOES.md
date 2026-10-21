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

Questões reescritas: 7 (ANV-0005/0007/0016/0020/0021/0023/0025); substituídas: 0; novas: 0; quarentenadas nesta etapa: 0.
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
