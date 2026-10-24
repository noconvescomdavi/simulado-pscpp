# Lote 038 — navios de dois lemes

Base remota 43c7a5f8646e14cfc421186db38e03d98c7e717e; PR#172 aberto/draft. HEAD remoto e PR consultados antes de editar; fast-forward a partir de árvore rastreada limpa. CHECKPOINT e relatório037 lidos. Temporários não rastreados preservados. Enumeração de processos retornou `fatal library error, lookup self`: não se afirma inspeção global de escritores. Publicação condicionada ao mesmo HEAD, com expected_sha e sem force.

## Fonte e escopo

Fonseca, Arte Naval v.2,8ª ed.,2019,item12.16,pp.815–816/PDF176–177. Texto e imagens conferidos, incluindo figs.12-9/12-10. SHA256 recalculado: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

A fig.12-9 compara leme único entre correntes de descarga com dois lemes diretamente atrás dos hélices. A continuação na p.816 descreve a predominância da força lateral do leme atrás do hélice que dá adiante sobre a oposição do outro. Fig.12-10 foi inspecionada como contexto vetorial, sem transformar seus valores de velocidade, máquinas e ângulo em dados gerais. As questões descrevem o arranjo e a comparação qualitativa da fonte; não prometem giro sobre a quilha de qualquer embarcação, nem ensinam uma sequência universal de manobra real. Enunciados autossuficientes, sem exigir figura omitida. Sem cálculos numéricos. Livro/imagens privados, sem publicação integral. Identidade com exemplar oficial/edital, vigência global e programa final continuam não comprovados.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte conferida | Gabarito |
|---|---|---|---|---|
| ANV-0165 | O carregamento substituía o enunciado por comando genérico e apagava I–IV; as proposições confundiam arranjo dos lemes, máquinas em sentidos opostos e rotação das pás. | Reescritas quatro proposições sobre posição dos lemes, atuação da descarga e predominância no caso adiante/atrás; explicação e cinco justificativas; referência com páginas/hash. | Arte Naval v.2,8ª ed.,12.16,pp.815–816/PDF176–177,figs.12-9/12-10 | E mantido;F/V/V/F |
| ANV-0863 | Definição virava comando bibliográfico genérico; alternativas misturavam outros conceitos de propulsão. | Criado caso qualitativo com cinco comparações sobre a ação dos lemes; enunciado, alternativas, explicação e cinco justificativas; referência exata. | Mesmos localizadores, texto e imagem | C mantido |

Duas correções primárias parciais, zero aprovações finais. IDs, competência old-102, tracking, taxonomy, tags, keys e formatos B/A preservados. Cinco alternativas A–E em ambos. 0165 opções combinadas preservadas;0863 opções reescritas.0165 Difícil→Médio/L2;0863 Médio/L2. Propostas de nível, sem calibração histórica/psicométrica aprovada. Rótulo legado Associação conceitual preservado para filtros.

## Julgamento individual e unicidade

0165: I falsa: a descarga contribui diretamente para a ação dos lemes; II verdadeira: a posição permite atuação da descarga; III verdadeira: corresponde à predominância explicitamente descrita na continuação do item; IV falsa: não há igualdade/cancelamento necessário. Vetor F/V/V/F; II/III aparece apenas em E. A inclui IV falsa e omite III;B inclui IV falsa e omite II;C inclui I falsa e omite II;D reúne I/IV falsas. As cinco justificativas registradas tratam cada alternativa.

0863: A falsa: impõe cancelamento;B falsa: inverte predominância;C verdadeira: mantém a comparação e seu escopo;D falsa: nega contribuição da descarga;E falsa: exclui influência da máquina. Uma resposta correta C, cinco justificativas. Distratores comparáveis dentro da mesma competência, sem alternativa sobre passo ou rotação das pás.

## Precedência, estado e diversidade

As duas versões ativas vêm do principal `data/questions/arte-naval.json`. Nenhuma restauração de conteúdo desses IDs foi localizada. Objeto bruto corrigido e objeto efetivo devem ser integralmente iguais. ANV-0364, original físico do mesmo old-102, fica inalterada e ausente do runtime: política bruta active=true, depois das duas transformações existentes active=false, razão stem-quotes-source-answer. A ocorrência em locator-dependent-stems-audit é registro de auditoria, não restauração efetiva. Não se inferem flags físicas nem se aplica quarentena/ativação. Não conta como revisão primária/correção nova.

Há duas variantes ativas da mesma competência; ambas não devem coexistir numa mesma prova. Rechecagem independente e prevenção/deduplicação semântica global pendentes. Regimes já adotados de três modelos não alterados. Nenhuma nova questão, substituição, exclusão de ID ou mudança de composição ativa; matriz100=25/25/10/10/10/10/10 preservada.

## Pipeline e hashes

A primeira redação de0165 repetia palavras da opção combinada no comando e disparava stem_answer_overlap. A redação final usa comando de conjunto de proposições e passa a política sem modificar heurísticas, relaxar gates ou adicionar flags de aprovação. Ambas passam auditQuestion sem issues, active=true e são preservadas integralmente por reformulateLeakingStem e normalizeEditorialStem. Geração final sequencial concluída antes dos testes; resultados intermediários não publicados. Hashes antes/depois em CORRECOES_RUNTIME.json e CONFERENCIAS_BIBLIOGRAFICAS.jsonl. Regressão:82 deltas exatos contra baseline congelada,12020 ocorrências de cadernos inalteradas,1984 PSCPP intactas,192 proposições renderizadas e170 opções diretas preservadas. Contrato de fonte acrescido somente de0165/0863; contrato direto acrescido somente de0863. Sem mudança de asserções.

## Validação e pendências

Build completo isolado `npm run build`: exit0; marcadores compile/lint/types/101 páginas/rotas presentes. Todos os arquivos rastreados fora de docs coincidem byte a byte com a cópia testada, incluindo o script de regressão. Seis artefatos gerados idênticos. O erro anterior ENOTEMPTY da árvore de trabalho não é declarado resolvido. Dois registros físicos apenas alterados, metadados de topo preservados; restaurações e0364 inalteradas. Inventário gzip conferido contra todos os82 hashes corrigidos.

Com Node e loader pscpp-json-loader: geração de bancos, catálogo e flashcards; validate-runtime-question-banks; validate-pscpp-exam-selection; test-question-source-provenance; validate-runtime-question-catalog; audit-pscpp-runtime-triage/inventory; regressão test-pscpp-audit-anv0005 passaram. `npm run check:pscpp-bank` passou. Regressão repetida após build passou. Matriz100 exata preservada.

Falhas reais mantidas: test-notebook-complete-stems exit1 em ANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero evidências aprovadas/14086 pendentes. Build e testes estruturais não substituem aprovação individual. Sem rechecagem independente concluída, conformidade completa ao edital ou deduplicação semântica global.

Acumulado:82 IDs corrigidos distintos e85 conferências bibliográficas parciais;zero aprovações finais. Triagem207 candidatos sem proposições e77 por localizador. Próxima candidata independente ANV-0166. ANV-0142/0840 permanecem bloqueadas pela divergência bibliográfica documentada em BUSCA_FONTE_PROPULSORES_032.json. Todos os oito gates pendentes/falhos;merge_permitted=false. Sem merge, deploy ou mutação de produção/usuários. Checkpoint031/035 e demais achados de numeração/terminologia, modelos e escopo normativo continuam pendentes.
