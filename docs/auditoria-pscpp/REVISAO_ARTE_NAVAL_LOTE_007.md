# Lote 007 — ANV-0043, ANV-0044 e ANV-0045

Base remota conferida no PR #172 e ref de branch: `155fafebf7c3909d8ac89c0519e14fd761ecca00`.
Fast-forward local a partir de 7f5ba195, sem descartar temporários não rastreados.
Árvore rastreada inicialmente limpa, nenhum processo escritor encontrado; lock exclusivo
local em audit-private. O Prompt-Mestre foi relido integralmente. As provas e lotes
anteriores não foram recontados nem refeitos.

## Fonte prevalente e defeitos

As três questões vêm da restauração de Arte Naval, sobreposta ao principal.
ANV-0043 perdia todas as afirmações em answer-leak-v1. ANV-0044/0045 tinham
proposições reconstituídas por restoreCompleteNotebookStem e NÃO eram candidatos
a proposições ausentes. Tinham, porém, distratores de conceitos afastados e explicação
genérica. A intervenção corrige conteúdo e metadados na restauração, preserva IDs,
competências, cinco opções combinadas e letras C/D/E. Nenhum normalizador, regra de geração ou conjunto de três itens foi modificado.
Duas entradas de notebook-complete-stems foram sincronizadas com a restauração
primária. Os testes foram reforçados para exigir igualdade exata do texto e
explicação servidos com a fonte revisada; ver detalhes abaixo.

| ID | Fonte primária examinada | Impressa / PDF | Vetor | Letra |
|---|---|---|---|---|
| ANV-0043 | A.1045(27), anexo, seção 2, parágrafo inicial | 2 / 3 | F/V/F/V | C |
| ANV-0044 | Arte Naval v.2, art. 10.3.d, fig. 10-6 | 710 / 71 | F/V/F/V | D |
| ANV-0045 | Arte Naval v.2, arts. 10.10.c–e e 10.12.a/c | 716 e 720–721 / 77 e 81–82 | F/V/V/F | E |

## Verificação normativa

A.1045(27) foi obtida diretamente da IMO em 21/10/2026 e a página PDF 3
foi conferida visualmente. SHA-256: `d5c0bfb3fad8bd548669e7953669129da8261ed64a69d8b10b54a6181d4c3578`.
A atribuição da certificação e a alternativa de conformidade fundamentam II/IV;
I/III alteram responsável ou referência admitida. Cinco justificativas específicas.

Fonte: https://wwwcdn.imo.org/localresources/en/OurWork/Safety/Documents/A.1045%2827%29.pdf

A emenda A.1108(29), adotada em 02/12/2015, altera 5.1/5.2; não altera o
parágrafo examinado da seção 2. Texto integral da emenda lido no domínio IMO:
https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/AssemblyDocuments/A.1108%2829%29.pdf

A página oficial de praticagem, consultada em 21/10/2026, informa a substituição
futura pela MSC.576(110), associada à revisão SOLAS V/23, com entrada prevista
em 01/01/2028 e implantação gradual. Não se tratou a adoção de 2025 como entrada
imediata em vigor. O enunciado delimita a recomendação A.1045(27); não afirma
aplicabilidade irrestrita nem consolidação normativa final para um edital futuro.
https://www.imo.org/en/ourwork/safety/pages/pilotage.aspx
https://www.imo.org/en/mediacentre/meetingsummaries/pages/msc-110th-session.aspx

## Revisão técnica do livro

Arte Naval v.2, 8ª ed., 2019, mesmo PDF Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.
SHA-256 recalculado: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.
Páginas PDF 71/77/81/82 lidas; 71/77/82 inspecionadas visualmente. Figura 10-6
confirma a gata; fig. 10-12 mostra o quartel do tornel. Nenhuma figura é necessária
para responder os itens textuais; não foi publicado trecho integral do livro.

ANV-0044: II descreve emprego em amarrações fixas e cabo passado pela manilha
na cruz para orientar a descida. IV define braço único e cepo pequeno. I passa a
atribuir dois braços e III elimina o cepo; ambas contradizem a descrição. Os
conjuntos A/B/C/E incluem ao menos uma falsa e omitem alguma verdadeira.

ANV-0045: II e III distinguem as seções e seus elementos de ligação. I confunde
quartel com um elo patente. IV foi limitada ao caso de navios de guerra, para não
universalizar a configuração do quartel do tornel: a obra distingue suas 5 braças
das 15 braças dos comuns no padrão brasileiro. Não há cálculo de conversão nem
valor inventado. Distrator anterior sobre torção foi substituído por diferença
construtiva pertinente. As cinco alternativas têm justificativas próprias.

Formato B e nível L2/Médio propostos: compreensão de responsabilidade,
características e distinção seção/elo/configuração. Não é calibração psicométrica.
Taxonomia legada fonseca-arte-v1 mantida; volume correto nas fontes. A reconciliação
global da taxonomia e a aderência final ao edital permanecem pendentes.

## Rechecagem e redundâncias

Foram lidos os itens efetivos ANV-0741/1310 (certificação), ANV-0742/0948,
AN-C10-103-M3 e AN-C12-12522-M3 (gata), e ANV-0743 (quartel). Há sobreposições
a impedir na mesma prova. Os vizinhos não receberam aprovação; a busca por termos
e os itens lidos não provam deduplicação semântica global. O seletor global e o
regime de cobertura por subitem não foram certificados neste lote.

Na primeira execução, a regressão antiga verificava apenas hash efetivo e quatro
proposições: não percebia que o patch tardio recolocava proposições antigas em
ANV-0044/0045. O teste geral também detectou a alteração legítima de explicação,
pois seu snapshot vinha de uma intervenção antiga que só podia alterar enunciado.
Foram sincronizados os dois patches tardios; o teste geral conserva a checagem de
opções/gabarito e só admite explicação revisada quando há correção primária com
hash integral exato e igualdade com enunciado/explicação da fonte. Para os demais
itens continua a exigir o hash antigo de explicação. Nenhuma asserção foi removida
sem substituição mais restritiva; nenhum item foi excluído. A regressão dedicada
passou a exigir texto e explicação iguais à fonte para TODAS as correções.

A regressão recompõe os conjuntos pelos vetores manuais e verifica unicidade,
hashes e HTML real. Não constitui rechecagem editorial independente do conteúdo.
Permanecem zero aprovações finais: correções primárias acumuladas 14, conferências
bibliográficas parciais 17. Somente ANV-0043 reduz a triagem de proposições: 242 → 241.
As outras duas são correções editoriais fora dessa triagem. Sem merge, deploy de
auditoria ou alteração de usuários. Resultados executados em TESTES_E_EVIDENCIAS.md.
