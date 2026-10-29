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
