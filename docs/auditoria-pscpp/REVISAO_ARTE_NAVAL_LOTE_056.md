# Lote 056 — transmissão hidráulica de comando

Base remota `7caa2720c84731529df1fe071604ccb2db8183d2`; HEAD e PR #172 aberto/draft consultados antes de editar. CHECKPOINT055 e relatório055 lidos. Fast-forward de árvore rastreada limpa,sem commit duplicado;temporários preservados. Enumeração global de processos falhou com `fatal library error, lookup self`;não se afirma inspeção global bem-sucedida de escritores. Comparações de insumos/árvore e expected_sha sem force exigem parar diante de divergência detectável nos insumos ou HEAD.

## Fonte e escopo

Fonseca,Arte Naval v.2,8ªed.(2019),11.5.b,p.760/PDF121;contrastes11.5.a/c e contexto11.6,pp.760–762/PDF121–123. Contexto de servomotor11.4,p.759/PDF120. Quatro páginas integralmente lidas em texto/imagens,com figura11-5,p.762/PDF123. A leitura da p.759 começa na continuação do arranjo hidrelétrico; não se afirma leitura integral de11.4 neste lote. A figura foi conferida como cadeia transmissor/receptor/controle,sem medição de dimensões ou pressões.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro/imagens privados não publicados. Programa/edital oficial,identidade binária das cópias oficiais e rechecagem independente pendentes.

11.5.b descreve pressão líquida em tubulações protegidas,emprego de telemotor e possibilidade de transmissões duplas afastadas para garantia contra avarias. Ar na rede e gás em tubulações atravessando compartimentos de temperatura elevada são desvantagens expressas. A duplicação não foi convertida em obrigação universal de projeto ou garantia absoluta contra qualquer avaria.

11.6 distingue cilindro transmissor comandado pela roda e receptor atuando no mecanismo de controle do servomotor. A transmissão da ordem não é tomada como toda a instalação de potência que move a cana. Gualdropes em11.5.a e motores selsyn/condutores em11.5.c são contrastes de modalidades. Não se aprova uma instalação moderna por analogia nem se estabelece limite numérico de temperatura,gás ou pressão. Não houve cálculo novo ou certificação operacional.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0256 | I–IV desapareciam no runtime;II genérica misturava transmissão/atuação;explicação sem análise. | Quatro proposições autossuficientes distinguem gualdropes,telemotor/controle,duplicação,bolhas e tubulações;explicação,cinco justificativas,página/hash;Médio/L2 proposto. |11.5.b,p.760/PDF121;contraste11.5.a e11.6,p.761/PDF122,fig11-5.|A mantido;F/F/V/V|
| ANV-0654 | Comando genérico e alternativas sobrepostas: a antigaB descrevia o telemotor da própria modalidade hidráulica. | Cinco descrições comparáveis do meio líquido com condições de instalação/funcionamento;eliminada a competição entre categoria e componente;explicação,cinco justificativas,página/hash;Médio/L2. |11.5.b,p.760/PDF121;11.6,p.761/PDF122.|D mantido|
| AN-C11-115b-M1 | Proposições apagadas e comando por artigo;explicação repetitiva sem julgamento dos distratores. | Quatro proposições autossuficientes;contraste hidráulica/mecânica flexível e falhas por bolhas;explicação,cinco justificativas,página/hash;Médio/L2. |11.5.a/b,p.760/PDF121.|C mantido;V/V/F/F|
| AN-C11-115b-M2 | Comando dependente de artigo;resposta mais detalhada e explicação só repetitiva;sem cinco justificativas. | Comando autossuficiente e cinco condições de extensão comparável;desvantagens contrastadas com características/proteções;explicação,cinco justificativas,página/hash;Médio/L2. |11.5.b,p.760/PDF121;contexto11.6,p.761/PDF122.|D mantido|
| AN-C11-115b-M3 | Explicação só repetia proposições;comando por artigo e ausência de análise individual. | V/F preservado;cadeia transmissor/receptor/controle explicitada e contraste selsyn delimitado;explicação,cinco justificativas,página/hash;Médio/L2. |11.5.b/c,pp.760–761/PDF121–122;11.6 efig11-5,p.762/PDF123.|E mantido;V/V/F/V|

Cinco correções primárias parciais,25 justificativas,zero aprovações finais. IDs,chavesA/D/C/D/E,tracking,taxonomy,tags,provenance e validação legada dos modelos preservados. As marcas legadas final_audit/source_of_truth/editorial_explanation_repair não foram aceitas como aprovação desta auditoria. Regime de três modelos assertion_combination/conceptual/true_false intacto. NíveisL2 propostos,sem calibração histórica/psicométrica aprovada.

## Julgamento e unicidade

0256:I falsa por substituir tubulações/pressão por gualdropes;II falsa por fazer o receptor dispensar o controle e atuar diretamente na cana;III verdadeira por duplicação e prejuízo por bolhas;IV verdadeira pelo meio líquido/percurso protegido. SóA reúneIII/IV. B incluiII/omiteIV;C incluiII/omiteIII;D reúneI/II falsas;E incluiI/omiteIII. A antigaII sobre transformar movimento em rotação não foi chamada falsa só porque a chave a excluía: foi substituída pela inversão funcional explícita apoiada em11.6.

0654:D preserva meio,percurso e duplicação. A nega prejuízo por ar;B impõe redes obrigatoriamente juntas;C exige percurso sem proteção;E inverte a relação entre calor e formação de gás. A antigaB sobre conjunto transmissor/receptor não foi tratada como falsa: era compatível com o telemotor da modalidade,gerando sobreposição. As cinco opções novas distinguem condições do mesmo arranjo,em vez de oferecer componente e categoria como mutuamente exclusivos.

M1:I/II verdadeiras;III confunde gualdropes;IV nega os efeitos das bolhas. SóC reúneI/II. A incluiIII/omiteII;B incluiIV/omiteI;D reúneIII/IV;E inclui ambas falsas. M2:D identifica as duas ocorrências prejudiciais. A descreve proteção de percurso;B duplicação afastada;C meio de transmissão;E telemotor/controle. Essas características não foram consideradas garantias absolutas de funcionamento de qualquer sistema.

M3:V/V/F/V,únicaE. I conserva meio/percurso,II as desvantagens,III confunde transmissão elétrica com hidráulica eIV conserva a cadeia funcional. A erraII/III/IV;B erraI/III/IV;C erraI/II/III;D erraIII. Nenhuma figura ausente é necessária para responder à versão final.

## Precedência e diversidade

As cinco versões já eram ativas e provenientes do principal;nenhuma restauração/extensão prevalece sobre esses IDs. Todos os objetos finais atravessam as duas transformações integralmente intactos,auditQuestion sem issues e política ativa. Nenhuma heurística/política ou flag nova de aprovação.

0455 permanece inalterada e ausente runtime:bruta ativa,após transformações pré-existentes excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada. Os cinco corrigidos se sobrepõem na competência de transmissão hidráulica;os códigosold-079/anv2-11.5.b e formatos variados não autorizam coexistência na mesma prova. Prevenção semântica global e rechecagem independente pendentes. Demais consumidores não recebem alteração por mera associação de título.

## Validação

Build completo isolado com insumos finais estáveis,dependências locais e npm_config_offline=true: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido. Nenhuma interrupção anterior foi atribuída a esta tentativa.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:140 deltas acumulados exatos,11.962 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;304 proposições renderizadas e320 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre055 e056,somente os cinco IDs da tabela mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos140 hashes corrigidos conferidos. Metadados de topo,0455,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa e três formatos dos modelos preservados;sem ativação ou nova quarentena.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado140 IDs distintos corrigidos,143 conferências primárias parciais,zero aprovações finais. Triagem185 sem proposições e77 localizadores;68 candidatos corrigidos,3 falsos positivos anteriores sem mudança e72 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0262,prova de ruptura da amarra,Fonseca v2 10.16.b. Impedimentos0142/0840,0176/0874 e0253/0651 mantidos sem recontagem.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,prevenção semântica,consumidores/offline/SQL e validação de produção pendentes. Sem merge,deploy ou mutação de dados de usuários.
