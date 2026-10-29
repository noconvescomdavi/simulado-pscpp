# Lote 035 — grampos para cabos de aço

Base remota 294d3d6849c1c11367ea42be62fca66e070e486d; PR #172 aberto/draft.
HEAD remoto consultado antes da edição. Fast-forward de árvore rastreada limpa,
CHECKPOINT.json e relatório 034 lidos; nenhum lote anterior refeito. Temporários
preservados. Inspeção dos processos visíveis não indicou outro escritor;
publicação condicionada ao mesmo HEAD remoto com expected_sha, sem force.
Prompt-Mestre, benchmark e matriz obrigatória mantidos.

## Fonte e divergência de numeração

Fonseca, Arte Naval v.2, 8ª ed., 2019; corpo art. 9.32, pp. 692–693/PDF 53–54,
figuras 9-40 e 9-41. Texto e imagens conferidos. Contraste com sapatilhas em
9.26, p. 687/PDF 48, figura 9-29, também lido e conferido visualmente. O sumário
PDF 10 anuncia Grampos como 9.35; o corpo mostra 9.32. O título e os dois
localizadores foram verificados em imagens, não apenas por OCR. O novo locator
segue o corpo e source.numbering_note explicita a divergência. Não se inferiu
errata oficial ou correção geral de toda a edição, nem se renumeraram modelos.
A árvore global de cobertura e referências de outros registros segue pendente.

SHA256 recalculado: 6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive: 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. Livro e imagens mantidos privados.
A tabela de eficiências em p.692 e a remissão à tabela9-14 foram observadas
como contexto; nenhum percentual, número de grampos, torque ou espaçamento foi
extrapolado para dimensionar uma montagem real. A antiga afirmação genérica
sobre espaçamento foi retirada do escopo, sem aprovação de regra dimensional.
As questões não exigem figura externa: descrevem em palavras toda a montagem
necessária à resposta. Não há cálculo ou unidade numérica a resolver.

## Relatório individual obrigatório

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

## Julgamento individual ANV-0148

I falsa: inverte U e base; texto/figura9-41 indicam U no chicote e base no vivo.
II verdadeira: base de aço forjado com sulcos, vergalhão em U roscado e porcas,
9.32 p.692. III verdadeira: orientação e inspeção/aperto conforme continuação
na p.693. IV falsa: redução de diâmetro ao tesar pode favorecer que o cabo
recorra; a obra exige acompanhamento, não sua dispensa após o aperto inicial.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | I/III | I falsa; falta II |
| B | III/IV | IV falsa; falta II |
| C | II/III | Único conjunto completo das verdadeiras |
| D | II/IV | IV falsa; falta III |
| E | I/II | I falsa; falta III |

## Julgamento individual ANV-0846

| Opção | Julgamento |
|---|---|
| A | Correta: U no chicote, base no vivo, inspeção e reaperto diante de sinais de que o cabo possa recorrer |
| B | Mantém a orientação invertida, apesar da inspeção |
| C | Alternância deixa grampos com U no vivo, contrariando a montagem indicada |
| D | Orientação correta, mas dispensa a inspeção indevidamente |
| E | Aperto inicial maior não corrige a orientação invertida |

## Precedência, estados e sobreposição

Ambas prevalecem no principal, já efetivas antes do lote. Nenhuma restauração
contém esses IDs e nenhum dos dois consta de notebook-complete-stems.
A busca física por old-025 encontrou também ANV-0347, cujo original permanece
integralmente inalterado. Não consta do runtime; questionQualityState do objeto
físico retorna active=false por answer-leak:answer_similarity_leak. Não se
inferiram flags físicas ausentes nem se classificou isso como quarentena formal.
0347 não foi contada como correção ou conferência primária individual neste lote.

As duas variantes ativas encontradas por esse código foram lidas individualmente
e compartilham competência: não devem coexistir na mesma prova. A busca por
código não prova ausência de variantes com outra classificação. Deduplicação
semântica global, prevenção de coexistência e estados completos pendentes.
Nenhum ID/modelo criado, removido ou reativado; regime específico de três modelos
por item preservado. IDs de tracking/taxonomia legados mantidos para filtros;
reconciliação global de edição/obra/árvore permanece pendente.

auditQuestion sem achados, política ativa e transformações preservando os dois
objetos integralmente antes da geração; igualdade fonte/runtime após geração.
Nenhum normalizador/filtro/gate relaxado. Contrato de fonte principal apenas
+0148/+0846; contrato direto apenas+0846. Hashes antes/depois em
CORRECOES_RUNTIME.json; duas conferências em JSONL. Resultados reais em
TESTES_E_EVIDENCIAS.md. REVISOES_EDITORIAIS.jsonl sem aprovação inventada.

Acumulado: 70 correções distintas, 73 conferências bibliográficas parciais,
ZERO aprovações finais. Par0142/0840, numeração dos lotes anteriores, terminologia,
modelos pendentes e limites normativos do lote034 preservados sem recontagem.
Programa/edital, rechecagem independente, cobertura, estados, semântica global
e offline/produção pendentes. Oito gates pendentes/falhos. Sem merge, deploy
em produção ou alteração de usuários.
