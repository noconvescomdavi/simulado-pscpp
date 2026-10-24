# Lote 031 — reboque a contrabordo

Base remota 26d5d5ddf42c4530420290b61577a1a43cdc0c19, PR #172 aberto/draft.
HEAD remoto, checkpoint e relatório 030 consultados antes das edições.
Fast-forward da árvore rastreada limpa; temporários preservados. A inspeção
limitada dos processos disponíveis não identificou outro escritor. Publicação
com lease. Prompt-Mestre e benchmark histórico mantidos.

## Fonte e divergência de numeração

Fonseca, Arte Naval v.2, 8ª ed., 2019, seção F, art.12.80 no corpo, p.923,
PDF284. Todo o artigo foi lido no texto e na imagem. O sumário PDF13 e a
p.924/PDF285 também foram inspecionados em texto/imagem para confirmar o
contraste de títulos e a fronteira com reboque de embarcações miúdas.
SHA256 recalculado: 6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; livro/imagens privados.

O sumário atribui 12.80 a embarcações miúdas e 12.81 a contrabordo. No corpo,
os títulos aparecem em ordem inversa: 12.80 contrabordo e 12.81 embarcações
miúdas, iniciando ambos na p.923. Não é apenas uma falha de OCR: as imagens
confirmam a divergência. As duas referências corrigidas adotam 12.80 no corpo,
com nota explícita em source.numbering_note e nas evidências; tracking.section
acompanha o localizador adotado.
Não se infere errata oficial, nova edição ou número universal a partir desse
exemplar. A árvore de cobertura e outras referências 12.80/12.81 exigem
reconciliação própria; nenhum modelo foi renumerado, criado ou removido.

A figura 12-53 da p.923 pertence ao reboque de submarino; a figura 12-54 da
p.924 pertence a embarcação miúda. Ambas foram visualmente distinguidas do
parágrafo de contrabordo e não são exigidas nas questões. Não se declara
revisão integral do artigo de submarinos ou de 12.82 por observar essas páginas.

## Conteúdo examinado e limites

O trecho explica a utilidade em portos e águas restritas pela possibilidade
de manobrar em espaço reduzido. Descreve rebocador atracado à alheta, espias
a proa (lançante e espringue), través a ré e defensas entre os costados.
Para curva fechada, indica o bordo interno; havendo várias evoluções, considera
a curva mais difícil. A questão direta delimita uma única curva fechada; o caso de várias evoluções
permanece distinguido nas explicações. As duas questões testam a leitura desse arranjo na obra,
sem transformar a descrição em projeto de amarração para toda instalação.

A alegação legada de adequação a baixa velocidade não foi mantida como regra
bibliográfica: o artigo não fornece limite nem critério numérico de velocidade.
Isso não declara falsa toda consideração de velocidade, apenas evita atribuí-la
a esse recorte sem suporte. Não se inventaram bollard pull, força admissível,
número de voltas, comprimento/bitola de cabo, velocidade ou dimensão de defensa.
Nenhuma norma portuária atual, licença ou procedimento de navio real inferido.

## Identidade e precedência

ANV-0138 prevalece na restauração old-146, já efetiva antes do lote.
O principal trata de afastamento e alternativas mistas, com provenance
pscpp-style-upgrade-v3; todos os seus campos foram preservados. Nenhuma flag
ausente inferida nem nova versão ativada. Reconciliação global de versões e
estados permanece pendente. ANV-0836 prevalece no principal. Nenhum dos dois
IDs consta de notebook-complete-stems.

answer-leak-v1 removia as proposições de 0138 e tornava 0836 comando genérico.
As antigas proposições/distratores misturavam fusível, cabo de leva, mensageiro
e máquina de reboque com um arranjo de embarcações. Os novos erros são
localizados na própria disposição: posição relativa, bordo da curva,
interposição de defensas e distribuição das espias.

Novos objetos passaram por auditQuestion sem achados, política ativa e cadeia
reformulateLeakingStem/normalizeEditorialStem sem alteração. Igualdade
fonte/runtime e ausência de mass_reformulation verificadas na regressão.
Após a primeira regressão e o primeiro build passarem, a rechecagem local
explicitou uma única curva fechada no comando de 0836 para afastar ambiguidade
com várias evoluções. Geração, hashes, regressão, catálogo e build foram
repetidos sobre essa redação final; o build inicial foi preservado como
intermediário e não usado como validação da redação posterior.
Nenhum normalizador/filtro/gate relaxado; contrato direto só +0836.
IDs/tópicos, keys C/A e formatos efetivos B/A preservados. Rótulo legado
Associação conceitual mantido em 0836 para compatibilidade de filtros.
L2/Médio proposto para compreender e distinguir o arranjo, sem calibração
psicométrica aprovada, cálculo ou promoção a decisão operacional L4.

## ANV-0138 — julgamento individual

I falsa: substitui o rebocador atracado à alheta por ligação afastada pela proa.
II verdadeira: alheta e defensas entre costados. III falsa: troca bordo interno
por externo no caso de curva fechada. IV verdadeira: lançante/espringue a proa
e través a ré. Todo o suporte está no art.12.80 do corpo, p.923.
Vetor F/V/F/V; único conjunto completo II/IV, gabarito C.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/IV | I falsa; falta II |
| B | III/IV | III falsa; falta II |
| C | II/IV | Único conjunto completo de verdadeiras |
| D | I/II | I falsa; falta IV |
| E | I/III | Ambas falsas; faltam II/IV |

## ANV-0836 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Correta: alheta, defensas e bordo interno em curva fechada |
| B | Falsa: troca bordo interno por externo |
| C | Falsa: passagem de espias não dispensa defensas previstas na obra |
| D | Falsa: troca lançante/espringue a proa e través a ré por apenas través a proa |
| E | Falsa: ligação afastada não é a disposição atracada examinada |

Dez justificativas específicas. Referências ficam em source/tracking; comandos
não exigem reconhecer o número do item do livro. Sem figura obrigatória ausente
ou cálculo novo. Gabaritos preservados com unicidade explicitamente reavaliada.

## Sobreposição e pendências

Busca old-146 no inventário efetivo encontrou o par, lido individualmente.
São variantes da mesma competência e não devem coexistir na mesma prova.
Busca por código não prova ausência de outras variantes. Revisão semântica
global/prevenção de coexistência pendentes; regime chapter-item-3-models
preservado. Grupo 12.70, terminologia do lote023 e paginação do lote026 mantidos
com os limites anteriores, sem conferências ou aprovações adicionais.

Acumulado após validação: 61 correções primárias, 64 conferências
bibliográficas parciais e ZERO aprovações finais. Rechecagem independente,
programa/edital oficial, cobertura, estados, semântica e offline/produção
pendentes. Hashes antes/depois em CORRECOES_RUNTIME.json; conferências parciais
no respectivo JSONL. REVISOES_EDITORIAIS.jsonl sem aprovação inventada.
Resultados reais em TESTES_E_EVIDENCIAS.md. Oito gates pendentes/falhos;
sem merge/deploy/dados de usuários.
