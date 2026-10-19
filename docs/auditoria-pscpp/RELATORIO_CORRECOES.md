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

Questões reescritas: 0; substituídas: 0; novas: 0; quarentenadas nesta etapa: 0.
Não atribuir aprovação aos registros apenas por preservação ou triagem.
As pendências editoriais são mantidas nos relatórios e nos gates.
