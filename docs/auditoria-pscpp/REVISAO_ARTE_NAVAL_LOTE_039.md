# Lote 039 — seguimento para ré com hélice dando adiante

Base remota `6d77ffd876b20fa41449243ca888720d6b3cbdc2`; PR#172 aberto/draft. PR/HEAD consultados antes de editar; fast-forward de árvore rastreada limpa. CHECKPOINT038 e relatório038 lidos após o término da atualização local. Nenhum lote concluído refeito. Temporários preservados. Enumeração de processos falhou com `fatal library error, lookup self`: não se afirma inspeção global de escritores. Publicação condicionada ao mesmo HEAD com expected_sha e sem force.

## Fonte primária e escopo

Fonseca, Arte Naval v.2,8ª ed.,2019,item12.6.4 pp.803–804/PDF164–165,fig.12-5; escopo12.6 p.798/PDF159. Texto e imagens das três páginas conferidos. SHA256 recalculado:`6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

A fonte enumera três ações: leme, pressão lateral das pás e corrente de descarga, negando efeito da sucção no governo deste caso. Com leme a meio, a tendência teórica atribuída à pressão lateral não autoriza generalizar a previsão prática, dado seu efeito reduzido. No caso de leme a BB, muito seguimento para ré pode tornar maior o efeito do leme; portanto não é válido desconsiderar sua intensidade. As questões não pedem um bordo absoluto da guinada e não generalizam a representação para qualquer sentido de passo, arranjo ou regime operacional. A introdução12.6 desconsidera vento/corrente e exige experiências em cada navio; esse limite consta das explicações.

A fig.12-5 mostra sentidos de forças e tendências da proa; texto também descreve a popa. Conferidos sem intercambiar proa/popa. Nenhum diagrama externo obrigatório omitido: enunciados autossuficientes em palavras, sem números/cálculos. Não se afirma que dar adiante elimina imediatamente o movimento a ré, nem se prescreve procedimento de manobra. Livro/imagens privados. Identidade com exemplar oficial e alinhamento final ao edital/programa não comprovados.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0166 | O carregamento apagava I–IV; proposições misturavam definição, ação do leme e regras de águas limitadas, sem explicação específica. | Reescritas quatro proposições sobre as ações consideradas, exclusão da sucção, limite da previsão com leme a meio e influência do seguimento; explicação, cinco justificativas e páginas/hash. | Fonseca,Arte Naval v.2,8ª ed.,12.6.4,pp.803–804/PDF164–165,fig.12-5; escopo12.6 p.798/PDF159 | A mantido;V/F/V/F |
| ANV-0864 | Enunciado virava comando bibliográfico genérico e opções misturavam conceitos heterogêneos. | Criado cenário de avaliação de previsão de guinada com leme a meio; cinco alternativas comparáveis, explicação e cinco justificativas; referência exata. | Mesmos localizadores, texto e imagem | D mantido |

Duas correções primárias parciais, zero aprovações finais. IDs,keys,competência old-096,tracking,taxonomy,tags e formatos B/A preservados. Cinco opções A–E;combinadas de0166 preservadas,diretas de0864 reescritas.0166 Difícil→Médio/L2;0864 Médio/L2. São propostas editoriais sem calibração psicométrica/histórica aprovada. Rótulo legado Associação conceitual mantido para filtros.

## Julgamento individual e unicidade

0166: I verdadeira: três ações enumeradas no item;II falsa: a sucção não tem o efeito alegado e não é causa única;III verdadeira: ressalva expressa com leme a meio;IV falsa: a intensidade do seguimento altera a comparação, conforme o caso leme a BB. Vetor V/F/V/F, conjuntoI/III único emA. B incluiII falsa e omiteI;C incluiIV falsa e omiteIII;D reúneII/IV falsas;E incluiIV falsa e omiteI. Cinco justificativas persistidas.

0864: A falsa: universaliza tendência;B falsa: introduz domínio da sucção e elimina características individuais;C falsa: leme a meio não apaga a pressão lateral;D verdadeira: preserva a ressalva e o limite da previsão;E falsa: nega a premissa de movimento ainda a ré. Única respostaD;cinco justificativas. As alternativas comparam o fundamento da alegação, sem termos de competências alheias.

## Precedência, estado, diversidade e hashes

Versões corrigidas no principal `data/questions/arte-naval.json`, sem restauração de conteúdo desses IDs localizada. Igualdade integral entre objeto principal e efetivo verificada. Duas transformações existentes preservam integralmente os objetos; auditQuestion sem issues e política active=true, sem flags novas ou heurísticas relaxadas. Registros de locator-dependent-stems-audit são evidência de triagem, não substituição de conteúdo.

ANV-0365, original físico old-096, inalterada e ausente do runtime: política bruta active=true, depois de reformulateLeakingStem e normalizeEditorialStem active=false,razão stem-quotes-source-answer. Sem inferir flags físicas, reativar, aplicar quarentena ou contar revisão primária. Duas variantes ativas da mesma competência não devem coexistir numa prova; prevenção/deduplicação semântica global e rechecagem independente continuam pendentes. Regime de três modelos previamente adotado não alterado.

Hashes antes/depois em CORRECOES_RUNTIME.json e CONFERENCIAS_BIBLIOGRAFICAS.jsonl; correspondência com inventário final verificada. Regressão84 deltas exatos contra baseline congelada,12018 ocorrências de cadernos intactas,1984 PSCPP intactas,196 proposições renderizadas e175 opções diretas preservadas. Contrato principal acrescido de0166/0864 e direto apenas0864, sem relaxar asserções.

## Validação

Build isolado completo `npm run build`:exit0 e marcadores compile/lint/types/101páginas/rotas presentes. Todos os arquivos rastreados fora de docs coincidem byte a byte com a cópia testada, incluindo o script de regressão. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Apenas0166/0864 alteradas no banco principal;metadados de topo,restaurações,0365 e pares bloqueados inalterados. Inventário gzip conferido contra todos os84 hashes corrigidos.

Passaram geração de bancos/catálogo/flashcards,validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,audit-pscpp-runtime-triage/inventory,test-pscpp-audit-anv0005 e npm run check:pscpp-bank. Node executado com loader pscpp-json-loader. Regressão antes/depois do build passou. Matriz100 exata preservada.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14086 pendentes. Esses resultados não aprovam o conteúdo restante nem fecham rechecagem independente,programa/edital ou deduplicação semântica global.

Acumulado84 IDs corrigidos distintos,87 conferências bibliográficas parciais,zero aprovações finais. Triagem206 sem proposições e77 localizadores;próxima na triagemANV-0176;próxima independenteANV-0179. ANV-0142/0840 bloqueadas pela fonte conforme BUSCA_FONTE_PROPULSORES_032.json. Nenhum ID ativo acrescentado/retirado.27435 registros físicos,14086 ocorrências (12102 cadernos+1984 PSCPP),13715 IDs únicos inalterados. Matriz100=25/25/10/10/10/10/10 preservada. Demais achados de numeração,terminologia,modelos,normas e proveniência continuam pendentes. Todos os8 gates pendentes/falhos,merge_permitted=false;sem merge,deploy ou mutação de produção/usuários.


## Continuidade e impedimento correlato

Leitura documental de0176/0874 identificou propulsor lateral de popa,old-087,com o mesmo localizador11.13 do impedimento032. O relatório032 inclui busca por stern thruster e divergência sumário/corpo. Essa associação documental não é nova busca nem prova de ausência bibliográfica.0176/0874 não foram corrigidas/aprovadas ou quarentenadas,incremento bibliográfico zero. Resolver fonte antes de revisão técnica. Próxima candidata independente0179 (transmissão quadrantal,11.7.b). O par0142/0840 permanece bloqueado;preservar as duas competências,sem substituir às cegas.
