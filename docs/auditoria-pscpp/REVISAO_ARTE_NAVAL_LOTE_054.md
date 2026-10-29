# Lote 054 — corrente da esteira

Base remota `d756c32deef6fe6b375a92b8e8edb7ab1874166b`; HEAD e PR #172 aberto/draft consultados antes de editar. CHECKPOINT053 e relatório053 lidos. Árvore rastreada inicialmente limpa, fast-forward sem commit duplicado e temporários preservados. A enumeração global de processos falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Comparação de insumos/árvore e expected_sha sem force exigem parar diante de divergência detectável.

A finalização foi interrompida ao detectar um temporário não rastreado adicional. Os temporários originais e o novo arquivo foram preservados; tamanho,mtime eSHA256 do adicional permaneceram estáveis nas rechecagens. Sua origem não foi determinada. A investigação não detectou alteração inesperada nos insumos rastreados ou nos objetos efetivos; a comparação com a cópia testada e o HEAD remoto foi refeita antes de prosseguir. Não se presume ausência global de escritores nem se apaga trabalho para obter árvore limpa.

## Fonte e limites

Fonseca, Arte Naval, v.2, 8ª ed.(2019),12.5,p.797/PDF158, incluindo a tabela-resumo. Contrastes12.3/12.4,pp.795–797/PDF156–158 e limites12.6,p.798/PDF159. Quatro páginas integralmente lidas em texto/imagens; figuras12-2a/b/c conferidas como contexto de sucção/descarga, não como desenhos exclusivos da esteira. Nenhuma escala, velocidade ou força foi medida nas imagens. A leitura da p.795 começa com continuação de12.2; não se afirma leitura integral dessa seção neste lote.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro/imagens privados não publicados. Programa/edital oficial, identidade binária das cópias oficiais e rechecagem independente permanecem pendentes.

A origem da esteira é o arrastamento de água pelo movimento da carena. Isso difere do jato produzido pela rotação do hélice e das reações transversais das pás. O corpo12.5 descreve o perfil máximo na linha-d’água, decrescendo até a quilha; esse perfil é perguntado como descrição da edição, sem universalização a todos os cascos/regimes. O valor1/10 é atribuído a alguns autores e acompanhado de dificuldade de cálculo exato; não foi convertido em constante exata ou empregado em cálculo numérico novo.

Na marcha avante, o texto atribui redução do efeito do leme e, com navio em movimento/hélice bem mergulhado, menor sensibilidade da pressão lateral pela ação sobre as pás superiores. A tabela resume neutralização da pressão lateral e redução da ação do leme para navio de um hélice de passo direito. Esse resumo não significa eliminação de todas as forças laterais nem previsão universal da guinada total.12.6 recomenda experiências em cada navio; vento/corrente externos e instalações modernas não foram tratados como validados por este lote. A colunaAR da tabela não foi generalizada como ausência universal de esteira em qualquer operação a ré.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0237 | I–IV desapareciam no runtime;misturavam descarga,esteira e inversão de marcha;explicação genérica. | Quatro proposições autossuficientes sobre origem,perfil e efeito no leme;explicação,cinco justificativas,página/hash;Médio/L2 proposto. |12.5,p.797/PDF158;contraste12.3/12.4.|B mantido;F/F/V/V|
| ANV-0635 | Comando genérico e alternativas de classes diferentes. | Cinco associações comparáveis de origem/consequência,distinguindo atrito da carena de rotação do propulsor;explicação,cinco justificativas,página/hash;Médio/L2. |12.5,p.797/PDF158;contraste12.3,p.795/PDF156.|E mantido|
| AN-C12-125-M1 | Proposições apagadas no runtime;comando por artigo e explicação repetitiva. | Restauradas quatro proposições autossuficientes;IV distingue descarga e arrastamento pela carena;explicação,cinco justificativas,página/hash;Médio/L2. |12.5,p.797/PDF158;contraste12.3.|C mantido;V/V/F/F|
| AN-C12-125-M2 | Enunciado curto,distratores heterogêneos e explicação só repetia a resposta. | Delimitados marchaAV,passo direito e hélice mergulhado;cinco pares comparáveis de efeitos no leme/pressão lateral,com justificativas e referência;Médio/L2. |12.5 e tabela,p.797/PDF158;limite12.6,p.798/PDF159.|D mantido|
| AN-C12-125-M3 | Explicação apenas repetia proposições;III era inversão literal deI;sem análise individual. | V/F preservado;III testa falsa universalização do1/10,II explicita estimativa/dificuldade;explicação,cinco justificativas,página/hash;Médio/L2. |12.5,p.797/PDF158.|E mantido;V/V/F/V|

Cinco correções primárias parciais,25 justificativas e zero aprovações finais. IDs,chaves,taxonomy,tracking,tags,provenance e validações legadas dos modelos preservados. A data legada final_editorial_audit não foi aceita como aprovação. Regime de três modelos assertion_combination/conceptual/true_false intacto. NíveisL2 propostos,sem calibração histórica/psicométrica aprovada. Não houve cálculo novo nem substituição da matriz obrigatória por benchmark histórico.

## Julgamento e unicidade

0237:I falsa por trocar esteira por descarga;II falsa por inverter o perfil;III verdadeira pelo efeito no leme na marchaAV;IV verdadeira pela origem. SóB reúneIII/IV. A incluiI/omiteIII;C incluiI/omiteIV;D reúneI/II falsas;E incluiII/omiteIV. As proposições antigas não foram declaradas bibliograficamente conferidas apenas por concordarem com a chave anterior:foram substituídas por afirmações específicas do trecho.

0635:E associa carena/redução do efeito do leme. A conserva o efeito,mas troca a origem;B troca origem e efeito;C conserva origem,mas inverte o efeito;D conserva origem,mas nega a interação. As cinco opções têm o mesmo tipo de associação,sem comparar força,ambiente e nome de manobra como alternativas equivalentes.

M1:I/II verdadeiras;III inverte perfil;IV confunde origem com descarga e impõe propulsor acionado. SóC reúneI/II. A incluiIII/omiteII;B incluiIV/omiteI;D reúneIII/IV falsas;E inclui as duas falsas. M2:D preserva os dois efeitos no modelo delimitado. A erra leme;B erra pressão lateral;C erra ambos;E nega a redução do efeito do leme. Não se chama impossível um efeito real de qualquer instalação só por não reproduzir este modelo textual.

M3:V/V/F/V,únicaE. A erraII/III/IV;B erraI/III/IV;C erraI/II/III;D erraIII ao tornar exata/universal a estimativa. I é julgada como descrição da obra,II conserva sua ressalva eIV a origem;nenhuma constante hidrodinâmica universal foi criada.

## Precedência e diversidade

As cinco versões já eram ativas e provenientes do principal. Restaurações/extensões não prevalecem sobre esses IDs; todos os objetos finais atravessam as duas transformações integralmente intactos,auditoria estrutural sem issues e política ativa. Localizadores em metadados não substituem o objeto técnico no comando. Nenhuma heurística,política ou flag de aprovação foi alterada.

0436 permanece inalterada e ausente runtime:bruta ativa,após transformações pré-existentes excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada. Os cinco itens old-093/anv2-12.5 se sobrepõem em competência;variedade de formato não autoriza coexistência na mesma prova. Deduplicação semântica global e rechecagem independente continuam pendentes. Outros consumidores/fontes não recebem alteração por mera associação de título;nenhuma aprovação ou ausência global de variantes foi inferida.

## Validação

Build completo isolado com insumos finais estáveis: `npm run build` exit0;compilação,lint/tipos,101 páginas e rotas confirmados. Todos os arquivos rastreados fora de docs e seis artefatos gerados comparados byte a byte com a cópia testada. O antigo ENOTEMPTY da árvore original não é declarado resolvido.

Passaram geração PSCPP/cadernos/catálogo/flashcards;validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005,audit-pscpp-runtime-triage/inventory e npm run check:pscpp-bank. Regressão antes/depois:133 deltas acumulados exatos,11.969 ocorrências de cadernos e todas1.984PSCPP inalteradas contra baseline congelada;288 proposições renderizadas e305 opções diretas preservadas. Contratos combinado/direto/VF mantêm unicidade e renderização;nenhuma asserção anterior relaxada. Matriz exata100=25/25/10/10/10/10/10 preservada.

Entre053 e054,somente os cinco IDs da tabela mudam no principal/inventário efetivo. Objetos finais integralmente iguais ao runtime;todos133 hashes corrigidos conferidos. Metadados de topo,0436,demais objetos/restaurações/extensões e todasPSCPP intactos. Hashes antes/depois emCORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Composição ativa preservada;sem ativação ou nova quarentena. Três modelos e formatos preservados.

Falhas reais:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,todos hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado133 IDs distintos corrigidos,136 conferências primárias parciais,zero aprovações finais. Triagem188 sem proposições e77 localizadores;65 candidatos corrigidos,3 falsos positivos anteriores sem mudança e68 correções fora da triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. PróximaANV-0253,propulsão azimutal,fonte declaradaFonseca v2 11.12 a verificar no corpo/edição antes de corrigir. Impedimentos0142/0840 e0176/0874 mantidos sem recontagem.

Todos os oito gates pendentes/falhos,merge_permitted=false. Permanecem100% da revisão ativa,rechecagem independente,programa/edital,bibliografia e normas completas,prevenção semântica,consumidores/offline/SQL e validação de produção. Sem merge,deploy ou mutação de dados de usuários.
