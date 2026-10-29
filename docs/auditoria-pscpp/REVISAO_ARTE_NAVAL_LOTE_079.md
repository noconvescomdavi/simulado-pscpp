# Lote 079 — transmissão direta

## Base e preservação

HEAD remoto e PR #172 consultados antes das edições: `860b07081c01f45f07fb50dc70e965118177ca94`, lote 078, PR aberto/draft, sem merge. CHECKPOINT.json e relatório 078 lidos; prevalecem sobre a retomada antiga. O ambiente local estava no lote 005, com árvore rastreada limpa. Foi avançado por fast-forward ao remoto, preservando temporários não rastreados. Regeneração e regressão da base confirmaram 231 deltas antes de editar. Nenhum lote anterior foi refeito ou recontado. A comparação usa o inventário 078 versionado, sem confiar no cache ignorado antigo.

Lock cooperativo flock adquirido e mantido durante o trabalho; não exclui escritores externos que ignorem o lock. Uma nova instrução de continuidade chegou enquanto o lote estava em curso: o estado foi reconferido e o mesmo lote foi concluído, sem iniciar outra revisão concorrente ou adicionar novamente seus IDs. Publicação restrita à branch de auditoria, com expected_sha e sem force. Nenhum merge em main, deploy solicitado ou alteração de dados privados. Livros e imagens não integram o diff público.

## Fonte primária e limites

Fonseca, Arte Naval, volume 2, 8ª edição, 2019, item 11.7.a, p.763/PDF124; contexto dos métodos 11.7.b–d na mesma página. Remissão conferida em 11.4.c, pp.758–759/PDF119–120, figura 11-4. Três páginas únicas lidas em texto e imagens, com numerais impressos conferidos. Uma tentativa de exibir a p.763 falhou por imagem não processável; nova renderização foi exibida e conferida antes das edições. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; exemplar Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

Figura 11-4 conferida quanto à cadeia motor/bomba, cilindros/junços e ligação por barras à cana. O texto da p.759 fundamenta a inversão dos movimentos para bordos opostos. Não foram extraídas dimensões, potência, passo, pressão ou rendimento da imagem. A figura não precisa estar disponível ao aluno: as questões descrevem os elementos necessários. O número da figura deixou de ser conteúdo exigido para resolver M1.

“Direta” é a classificação da ligação da máquina ao leme no arranjo descrito; não significa ausência de circuito hidráulico, eliminação da cana ou acoplamento do motor elétrico à madre. Não se prescreve que todo sistema real tenha exatamente essa geometria. O distrator com barras na mesma extremidade não corresponde ao modelo do livro; não se afirma impossibilidade física universal dessa disposição. Não se usaram como premissas as comparações adjacentes de custo/eficiência, emprego na frota, metade da potência ou ausência de pressão no neutro. Não há cálculo ou nova prescrição normativa.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-117a-M1 | Quatro proposições desapareciam no runtime; explicação repetia falsas sem julgá-las; referência ao número da figura e afirmação por organização da obra prejudicavam a autonomia. | Restauradas quatro proposições sobre barras, exemplo hidrelétrico, tambor e falsa ideia de acoplamento motor–madre; descrição autossuficiente, julgamentos e cinco justificativas; páginas e hash. Média/L2 proposta. | 11.7.a, p.763/PDF124; 11.4.c, pp.758–759/PDF119–120, fig.11-4. | A mantido; V/V/F/F. |
| AN-C11-117a-M2 | Pergunta dependia do artigo; explicação apenas repetia a correta e um distrator confundia transmissão do comando com ligação de potência. | Enunciado autossuficiente, cinco configurações de ligação à cana comparáveis; explicitadas extremidades opostas, diferenças para tambor/quadrantal/parafuso e cinco justificativas; páginas e hash. Fácil/L1 proposto. | 11.7.a–d, p.763/PDF124; contexto 11.4.c e fig.11-4. | B mantido. |
| AN-C11-117a-M3 | V/F não reconhecido; itens repetitivos e explicação repetia a falsa sem corrigir o erro. | Comando antes dos quatro itens; diferenciadas atuação bilateral, ligação dos junços, falsa exigência de tambor e inversão do movimento; julgamentos e cinco justificativas; páginas e hash. Média/L2 proposta. | 11.7.a, p.763/PDF124; 11.4.c, pp.758–759/PDF119–120, fig.11-4. | C mantido; V/V/F/V. |

Três correções primárias **parciais**, quinze justificativas e zero aprovações finais. IDs, gabaritos, formatos, três modelos do item, tracking, taxonomia e flags legadas preservados. Dificuldade/nível são propostas, sem calibração psicométrica. Flags antigas não conferem aprovação editorial ou bibliográfica. Os grupos 117b–d permanecem inalterados e pendentes de revisão própria.

## Unicidade e carregamento

M1: I/II verdadeiras, III/IV falsas; só A. B inclui III e omite II; C inclui IV e omite I; D reúne as duas falsas; E inclui ambas falsas. M2: só B mantém duas barras, uma em cada extremidade da cana. A descreve tambor; C, engrenamento quadrantal; D coloca as duas barras na mesma extremidade; E descreve duplo parafuso, cursores e tirantes. M3: V/V/F/V, só C; A erra II/III/IV, B erra I/III/IV, D erra I/II/III e E erra III.

Os três objetos principais coincidem integralmente com as versões efetivas após regeneração, sem mass_reformulation. Apenas esses três IDs diferem do inventário 078. Nenhum normalizador, política ou critério foi alterado; o teste regressivo recebeu apenas os IDs documentados nas listas explícitas de origem/formato, sem remoção ou relaxamento de asserções. M1 recupera quatro proposições; M3 passa a ter quatro itens reconhecidos e renderizados. Variantes da mesma competência não devem coexistir numa prova; a prevenção semântica global e a rechecagem independente permanecem pendentes.

## Validação executada

As quatro regenerações individuais e seus quatro comandos de check passaram. Runtime, seleção/matriz, proveniência, catálogo e regressão passaram. Regressão acumulada: **234 deltas exatos**, 11.868 ocorrências de cadernos preservadas, 524 proposições renderizadas e 515 alternativas diretas preservadas. População preservada: 27.435 registros físicos; 12.102 cadernos + 1.984 PSCPP = 14.086 ocorrências; 13.715 IDs únicos. Matriz 100 = 25/25/10/10/10/10/10 preservada. Diff sem erros de whitespace.

Build direto `node node_modules/next/dist/bin/next build` retornou 0, com compilação, lint/tipos, 101/101 páginas e resumo completo de rotas. As regenerações antecederam o build. Avisos CSS/autoprefixer/cache mantidos no log, sem aprovação de release. Inventário e triagem regenerados. Logs, códigos de saída e hashes em EVIDENCIAS_LOTE_079.json.

| Verificação | Resultado |
|---|---|
| generate e check: pscpp-bank, question-banks, question-catalog, flashcard-decks | 0 cada |
| validate-runtime-question-banks | 0 |
| validate-pscpp-exam-selection | 0 |
| test-question-source-provenance | 0 |
| validate-runtime-question-catalog | 0 |
| test-pscpp-audit-anv0005 | 0; 234 deltas |
| test-notebook-complete-stems | 1; ANV-0142 anterior |
| validate-editorial-runtime | 1; 77 localizadores anteriores |
| audit-pscpp-runtime-triage / inventory | 0 cada |
| validate-pscpp-editorial-evidence | 2; zero aceitos / 14.086 pendentes |
| next build direto | 0, log integral |

## Acumulado e continuidade

Base 078: 231 IDs / 234 conferências parciais. Neste lote: +3 / +3, contabilizados uma única vez. Acumulado: **234 IDs com correções parciais, 237 conferências parciais e zero aprovações finais**. 234/13.715 = 1,71% dos IDs, não percentual de auditoria concluída. Triagem: 158 candidatos sem proposições e 77 localizadores; 95 candidatos corrigidos + 3 falsos positivos + 158 pendentes = 256; 139 correções fora dessa triagem; 95 + 139 = 234.

Próximo grupo: AN-C11-117b-M1/M2/M3, após confirmar presença efetiva e precedência, com fonte 11.7.b. Preservar 117c–d e não recontar 117/117a. Revisão integral das demais disciplinas, programa/edital e fontes oficiais, cobertura, rechecagem independente, deduplicação semântica, consumidores SQL/offline e homologação continuam pendentes. Oito gates pendentes/falhos; merge_permitted=false. Sem merge em main ou deploy solicitado.
