# Lote 078 — transmissão entre a máquina de governo e o leme

## Base e preservação

HEAD remoto consultado antes de editar: `a00a2335f5f2c6f7058d61a59ce062ece38961b5`, lote 077. PR #172 aberto, draft, sem merge. CHECKPOINT.json e relatório 077 lidos; prevalecem sobre o prompt de retomada antigo. O ambiente local estava novamente no lote 005, sem alterações rastreadas. Foi alinhado por fast-forward ao remoto, preservando temporários não rastreados. Nenhuma correção de 075–077 foi refeita ou recontada. Regeneração e regressão da base confirmaram 228 deltas antes das novas edições. A comparação usa o inventário 077 versionado, sem confiar no cache ignorado antigo.

Lock cooperativo flock adquirido e mantido durante a rodada; não garante exclusão de escritores externos que ignorem o lock. Publicação restrita à branch de auditoria, com expected_sha e sem force. Nenhum merge em main, deploy solicitado, alteração de dados privados ou publicação de livros/imagens. Logs, hashes e evidências auditáveis acompanham o lote.

## Fonte primária e limites

Fonseca, Arte Naval, volume 2, 8ª edição, 2019, item 11.7.a–d, p.763/PDF124; figura 11-6, p.764/PDF125. Contexto: 11.4.c e figura 11-4, pp.758–759/PDF119–120; 11.5.a–c, pp.760–761/PDF121–122. Seis páginas únicas lidas em texto e imagens, com todos os numerais impressos conferidos. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; exemplar Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

Figura 11-4 conferida quanto à ligação dos junços à cana por barras, com contexto textual na p.759. Figura 11-6 conferida como arranjo de transmissão por parafuso sem fim, com identificação de cana e servomotor; o funcionamento de roscas e cursores se apoia no texto de 11.7.d. Nenhuma dimensão, passo, rendimento, pressão ou potência foi extraída das ilustrações. As questões não dependem de figura ausente.

A classificação da ligação máquina–leme foi distinguida da transmissão do comando roda–controle, descrita em 11.5: telemotor e selsyn não substituem os mecanismos da outra ligação. Não se afirma incompatibilidade entre comando elétrico/hidráulico e mecanismo de potência. O movimento oposto dos cursores é o do duplo parafuso com roscas contrárias descrito na obra, sem generalizar para toda transmissão de parafuso. A antiga afirmação sobre desuso na frota de guerra foi retirada: não houve pesquisa da frota atual. Comparações universais de eficiência, segurança, custo ou pressão no neutro não foram usadas como premissas. Não há cálculo nem nova prescrição normativa.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-117-M1 | Quatro proposições desapareciam no runtime; explicação repetia falsas sem corrigir a classificação e o mecanismo quadrantal. | Restaurados quatro itens sobre métodos, barras, classificação e engrenamento; julgadas as falsas e justificadas as cinco alternativas; páginas e hash. Média/L2 proposta. | 11.7.a–d, pp.763–764/PDF124–125; contexto 11.4.c/11.5. | C mantido; V/V/F/F. |
| AN-C11-117-M2 | Pergunta exigia referência ao artigo; alternativas misturavam meios de comando, máquinas de convés e mecanismos, com explicação que repetia a correta. | Enunciado autossuficiente sobre a ligação máquina–leme; cinco listas paralelas, com confusões localizáveis entre mecanismos e telemotor/selsyn; cinco justificativas, páginas e hash. Fácil/L1 proposto. | 11.7.a–d e 11.5.a–c; pp.763–764/PDF124–125 e pp.760–761/PDF121–122. | D mantido. |
| AN-C11-117-M3 | V/F não reconhecido; falsa não explicada, itens repetitivos e afirmação de emprego/desuso sem delimitação temporal. | Comando antes dos quatro itens; incluído funcionamento do duplo parafuso e do tambor; julgamentos e cinco justificativas; retirada a generalização de frota, preservado o escopo do arranjo descrito; páginas e hash. Média/L2 proposta. | 11.7.a–d, pp.763–764/PDF124–125, figura 11-6. | E mantido; V/V/F/V. |

Três correções primárias **parciais**, quinze justificativas e zero aprovações finais. IDs, gabaritos, formatos, os três modelos do item, tracking, taxonomia e flags legadas preservados. Dificuldade e nível são propostas, sem calibração psicométrica. Flags antigas não conferem aprovação editorial/bibliográfica. Os subgrupos 117a–d permanecem inalterados e pendentes de revisão própria.

## Unicidade e carregamento

M1: I/II verdadeiras, III/IV falsas; só C. A inclui III e omite II; B inclui IV e omite I; D reúne as duas falsas; E inclui ambas falsas. M2: só D reúne os quatro mecanismos. A substitui parafuso por telemotor; B troca quadrantal por selsyn; C insere dois meios de comando em lugar de tambor e parafuso; E troca direta por telemotor. M3: V/V/F/V, só E; A erra II/III/IV, B erra I/III/IV, C erra I/II/III e D erra III.

Os três objetos principais coincidem integralmente com suas versões efetivas após regeneração, sem mass_reformulation. Apenas os três IDs deste lote diferem do inventário 077. Nenhum normalizador, política ou critério foi alterado; a regressão recebeu somente os IDs documentados nas listas explícitas de origem/formato, sem remoção ou relaxamento de asserções. M1 recupera quatro proposições; M3 passa a ter quatro itens reconhecidos e renderizados. As variantes da mesma competência não devem coexistir numa prova; prevenção semântica global e rechecagem independente continuam pendentes.

## Validação executada

As quatro regenerações individuais e seus quatro comandos de check passaram. Validações de runtime, seleção/matriz, proveniência, catálogo e regressão passaram. Regressão acumulada: **231 deltas exatos**, 11.871 ocorrências de cadernos preservadas, 516 proposições renderizadas e 510 alternativas diretas preservadas. População inalterada: 27.435 registros físicos; 12.102 cadernos + 1.984 PSCPP = 14.086 ocorrências; 13.715 IDs únicos. Matriz 100 = 25/25/10/10/10/10/10 preservada. Diff sem erros de whitespace.

Build direto `node node_modules/next/dist/bin/next build` retornou 0, com compilação, lint/tipos, 101/101 páginas e resumo completo de rotas. As regenerações precederam o build. Avisos CSS/autoprefixer/cache mantidos no log; não equivalem a aprovação de release. Inventário e triagem regenerados. Códigos de saída, logs e hashes em EVIDENCIAS_LOTE_078.json.

| Verificação | Resultado |
|---|---|
| generate e check: pscpp-bank, question-banks, question-catalog, flashcard-decks | 0 cada |
| validate-runtime-question-banks | 0 |
| validate-pscpp-exam-selection | 0 |
| test-question-source-provenance | 0 |
| validate-runtime-question-catalog | 0 |
| test-pscpp-audit-anv0005 | 0; 231 deltas |
| test-notebook-complete-stems | 1; ANV-0142 anterior |
| validate-editorial-runtime | 1; 77 localizadores anteriores |
| audit-pscpp-runtime-triage / inventory | 0 cada |
| validate-pscpp-editorial-evidence | 2; zero aceitos / 14.086 pendentes |
| next build direto | 0, log integral |

## Acumulado e continuidade

Base 077: 228 IDs / 231 conferências parciais. Neste lote: +3 / +3, sem recontagem anterior. Acumulado: **231 IDs com correções parciais, 234 conferências parciais e zero aprovações finais**. 231/13.715 = 1,68% dos IDs, não percentual de auditoria concluída. Triagem: 159 candidatos sem proposições e 77 localizadores; 94 candidatos corrigidos + 3 falsos positivos + 159 pendentes = 256; 137 correções fora dessa triagem; 94 + 137 = 231.

Próximo grupo: AN-C11-117a-M1/M2/M3, após confirmar presença efetiva e precedência, com 11.7.a e figura 11-4. Preservar os grupos 117b–d. Revisão integral das demais disciplinas, programa/edital e fontes oficiais, cobertura, rechecagem independente, deduplicação semântica, consumidores SQL/offline e homologação permanecem pendentes. Oito gates pendentes/falhos; merge_permitted=false. Sem merge em main ou deploy solicitado.
