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
