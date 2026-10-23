# Lote 040 — transmissão quadrantal e etapas do governo

Base remota`fc67141c2fa36c5c872c79da11be24974a8d2f8b`;PR#172 aberto/draft,consultados antes de editar. Fast-forward de árvore rastreada limpa;CHECKPOINT039/relatório039 lidos após concluir a atualização. Sem repetir lotes. Temporários não rastreados preservados. Enumeração de processos falhou com `fatal library error, lookup self`:não se afirma inspeção global de escritores. Publicação só com mesmo HEAD,expected_sha e sem force.

## Fonte e interpretação

Fonseca,Arte Naval v.2,8ª ed.,2019,item11.7.b,p.763/PDF124. Contrastes11.7.a/c/d na mesma página e11.5.b/c–11.6 pp.760–761/PDF121–122;fig.11-6 p.764/PDF125,parafuso sem fim,inspecionada como contraste. Quatro páginas lidas em texto/imagem. SHA256 recalculado:`6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

O texto de11.7.b diz que a máquina aciona uma pequena roda dentada engrenada num quadrante,setor dentado rigidamente fixado à cana. A redação genérica anterior sobre a madre não especificava a cadeia;adota-se agora a fixação exata à cana,sem afirmar uma montagem diferente de toda embarcação.11.7.c também emprega setor quadrantal,mas com cabo/corrente sem fim em tambor:presença isolada de setor não identifica o tipo.11.7.a usa barras;11.7.d usa duplo parafuso,cursores e tirantes.11.5/11.6 descrevem outra ligação,da roda ao controle do servomotor,por meios mecânico,hidráulico ou elétrico. A possibilidade de comando da válvula por gualdropes/eixos/telemotor em11.7.b não transforma esses dispositivos no engrenamento final.

As questões são autossuficientes em palavras;nenhuma figura obrigatória omitida. Não se usam características quantitativas,proporções de mistura ou prescrição de manutenção. Sem cálculos ou afirmação de vigência normativa atual. Livros/imagens privados;nenhuma publicação integral. Identidade com exemplar oficial,edições finais do edital e cobertura programática completa continuam pendentes.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0179 | I–IV desapareciam no carregamento; conceitos do comando roda/servomotor eram misturados à ligação máquina/leme e a fixação era imprecisa. | Quatro proposições sobre engrenamento,fixação do setor à cana e contrastes com tambor/controle elétrico;explicação,cinco justificativas e referência com páginas/hash. | Arte Naval v.2,8ª ed.,11.7.b,p.763/PDF124;contrastes11.7.a/c/d e11.5.b/c–11.6 pp.760–761/PDF121–122 | D mantido;V/V/F/F |
| ANV-0378 | Versão ativa preservava comando por descrição bibliográfica e definição genérica de quadrante solidário à madre,sem distinguir o acionamento ou justificar opções. | Enunciado pede o componente que recebe o engrenamento;cinco componentes alternativos,explicação e cinco justificativas;setor fixado à cana explicitado. | Mesmos localizadores;fig.11-6 p.764/PDF125 como contraste | C mantido |
| ANV-0877 | Definição virava comando genérico e opções confundiam etapas do sistema. | Enunciado e cinco cadeias mecânicas reescritos para distinguir quadrantal,tambor,direta,parafuso e comando elétrico;cinco justificativas. | Mesmos localizadores | B mantido |
| ANV-0993 | Artefato textual de extração e identificação ambígua pelo simples uso de quadrante;dificuldade superestimada. | Texto limpo especifica o engrenamento;opções,explicação e cinco justificativas reescritas;Fácil/L1 propostos e fonte precisa. | Mesmos localizadores | C mantido |

Quatro correções primárias parciais,zero aprovações finais. IDs,keys,competência old-082,tags,tracking,taxonomy preservados. Formatos B/A/A/A;cinco opções A–E. Combinadas0179 preservadas;três diretas reescritas.0179 Difícil→Médio/L2;0877 Médio/L2;0378 Fácil/L1;0993 Difícil→Fácil/L1. Propostas sem calibração histórica/psicométrica aprovada. Rótulos legados de estilo preservados para filtros,inclusive Situação aplicada em0993;isso não constitui validação de aplicação operacional.

## Julgamento individual e unicidade

0179:I eII verdadeiras pela cadeia mecânica e fixação;III falsa por substituir engrenamento pelo tambor;IV falsa por trocar etapa máquina/leme pelo comando elétrico. VetorV/V/F/F,conjuntoI/II único emD. A reúneIII/IV falsas;B incluiIII falsa;C incluiIV falsa;E incluiIV falsa e omiteII. Cinco justificativas registradas.

0378:A tambor de11.7.c incorreto;B cursor de11.7.d incorreto;C setor dentado fixado à cana correto;D barra de11.7.a incorreta;E cilindro do telemotor11.6 incorreto. ApenasC recebe o engrenamento pedido.

0877:A descreve tambor;B corresponde ao engrenamento quadrantal;C descreve duplo parafuso;D ligação direta por barras;E comando elétrico de11.5.c. ApenasB correta. Distratores evidenciam o mecanismo ou a etapa confundida,sem afirmar que a transmissão elétrica não possa coexistir com equipamentos mecânicos.

0993:A direta por barras incorreta;B tambor por cabo incorreta;C quadrantal correta;D parafuso incorreta;E telemotor de comando incorreto para esse engrenamento. ApenasC correta. Enunciado especifica roda dentada,setor e cana,sem depender do nome quadrante como pista única. Vinte justificativas persistidas no banco.

## Precedência,estado,diversidade e pipeline

Todas as quatro versões já eram ativas e vêm do principal.0378 foi inspecionada e confirmada ativa,em vez de pressupor exclusão com base nos originais de outros lotes. Nenhuma restauração desses IDs localizada. Objeto principal igual integralmente ao efetivo final. Duas transformações existentes preservam os objetos corrigidos;auditoria sem issues e política active=true,sem flags editoriais de aprovação. Uma redação intermediária0993 repetia a palavra transmissão no final e disparou stem_answer_continuation;redação final corrigida antes de gerar/testar,sem relaxar heurísticas.

As quatro variantes pertencem à mesma competência e não devem coexistir numa prova. Diferenciam reconhecimento do componente,nome e cadeia,mas isso não as torna conceitos independentes. Deduplicação/prevenção semântica global e rechecagem independente pendentes. Nenhuma remoção/ativação/substituição/quarentena;quatro versões existentes preservadas. Regimes específicos de três modelos previamente adotados não alterados.

Hashes antes/depois em CORRECOES_RUNTIME.json/CONFERENCIAS_BIBLIOGRAFICAS.jsonl e inventário final. Regressão88 deltas exatos,12014 ocorrências de cadernos intactas,1984 PSCPP intactas,200 proposições renderizadas e190 opções diretas preservadas. Contrato principal acrescido de0179/0378/0877/0993;direto apenas0378/0877/0993;sem relaxamento de asserções.

## Validação e continuidade

Build completo isolado `npm run build`:exit0,marcadores compile/lint/types/101páginas/rotas presentes. Todos os arquivos rastreados fora de docs,incluindo a regressão,coincidem byte a byte com a cópia testada. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Apenas0179/0378/0877/0993 alteradas no banco principal;metadados de topo,restaurações e pares bloqueados inalterados. Todos os88 hashes de correção conferidos no inventário gzip.

Passaram geração de bancos/catálogo/flashcards,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,audit-pscpp-runtime-triage/inventory,test-pscpp-audit-anv0005 e npm run check:pscpp-bank. Node com loader pscpp-json-loader. Regressão antes/depois do build passou;matriz100 exata preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1ANV-0142;validate-editorial-runtime exit1,77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14086 pendentes. Testes estruturais e build não substituem rechecagem independente,conformidade completa ao edital e revisão semântica global.

Acumulado88 IDs corrigidos distintos,91 conferências bibliográficas parciais,zero aprovações finais. Triagem205 sem proposições e77 localizadores. Próxima candidata independente: ANV-0181. ANV-0142/0840 e0176/0874 continuam com fonte declarada não resolvida;nenhuma busca anterior recontada.27435 registros físicos,14086 ocorrências (12102+1984),13715 IDs únicos e matriz100=25/25/10/10/10/10/10 preservados. Achados anteriores de numeração/terminologia/modelos/normas/proveniência permanecem pendentes. Oito gates pendentes/falhos;merge_permitted=false;sem merge,deploy ou mutação de produção/usuários.
