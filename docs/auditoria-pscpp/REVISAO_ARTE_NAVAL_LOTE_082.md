# Lote 082 — transmissão por parafuso sem fim

## Base e fonte primária

HEAD remoto e PR #172 consultados antes de editar: `8aab579561dc372cb47c4c1b64b0426733036cfa`, lote 081. PR aberto, draft e sem merge. Base retomada por fast-forward, preservando temporários não rastreados. Regeneração e regressão anteriores às edições passaram com 240 deltas. Nenhum lote anterior foi refeito/recontado. Lock cooperativo adquirido; atualizações remotas protegidas por expected_sha, sem force. Isso não exclui escritores externos que ignorem o lock. Publicação exclusiva na branch de auditoria.

Fonseca, Arte Naval, v.2, 8ª ed., 2019, item 11.7.d, p.763/PDF124 e figura 11-6 p.764/PDF125. Duas páginas lidas em texto e imagens, numerais impressos conferidos. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; exemplar Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`.

O texto fundamenta as roscas de sentidos opostos, cada cursor ligado por tirante à cana, os deslocamentos opostos e os usos com servomotor a vapor ou elétrico, ou em lemes à mão. A figura identifica parafuso, servomotor a vapor e cana, sem tornar exclusivo o exemplo a vapor. Nenhuma medida, ângulo, potência, rendimento numérico ou lei de deslocamento foi extraída da imagem. As questões são autossuficientes e não exigem figura ausente nem seu número. Declarações do livro sobre frequência de uso por tipo de navio e eficiência não foram generalizadas para a frota atual. Livros e imagens privadas não integram o commit.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| AN-C11-117d-M1 | Proposições desapareciam no runtime; explicação repetia falsas sem julgá-las; uso por classe de navio era apresentado sem delimitação temporal. | Restaurados quatro itens sobre roscas, cursores/tirantes, deslocamentos e compatibilidade de acionamento; falsas refutadas; cinco justificativas; substituída a generalização de uso por relações construtivas verificáveis; páginas e hash. Média/L2 proposta. | 11.7.d, pp.763–764/PDF124–125, fig.11-6 | A mantido; V/V/F/F |
| AN-C11-117d-M2 | Distratores misturavam tubos hidráulicos, selsyn, quadrante e gualdropes no telemotor; explicação apenas repetia a resposta. | Mantida a competência construtiva e criado enunciado autossuficiente com cinco configurações comparáveis de roscas, cursores e ligações; cinco justificativas individualizadas; páginas e hash. Fácil/L1 proposto. | 11.7.d, pp.763–764/PDF124–125, fig.11-6 | B mantido |
| AN-C11-117d-M3 | V/F efetivo não era reconhecido como quatro itens; falsa não explicada e emprego na frota sem delimitação temporal. | Comando antes dos itens; quatro julgamentos explícitos, falsa contraposta aos deslocamentos opostos; substituída a frequência de uso pela compatibilidade a vapor/elétrica/manual; cinco justificativas; páginas e hash. Média/L2 proposta. | 11.7.d, pp.763–764/PDF124–125, fig.11-6 | C mantido; V/V/F/V |

Três correções primárias parciais, quinze justificativas e zero aprovações finais. IDs, gabaritos, três modelos, identidade temática, tracking, taxonomia e flags legadas preservados. Flags antigas não constituem aprovação editorial. Dificuldade/nível são propostas, sem calibração psicométrica. Grupos anteriores e 118 permanecem inalterados.

## Unicidade e limites

M1: I/II verdadeiras, III/IV falsas, só A. B inclui III e omite II; C inclui IV e omite I; D reúne as duas falsas; E inclui ambas falsas. M2: só B conserva roscas opostas e cursores ligados por tirantes às extremidades da cana. A/C adotam roscas de mesmo sentido; D elimina os tirantes; E concentra ambas as ligações na mesma extremidade da cana. M3: V/V/F/V, só C; A erra II/III/IV; B erra I/III/IV; D erra I/II/III; E erra III.

A competência é reconhecer a configuração e relacionar seus componentes e deslocamentos. Não se deduziu igualdade de velocidade, valor de passo, ausência de folga, auto-travamento, desempenho ou exclusividade de emprego. Variantes do mesmo conceito não devem coexistir numa prova; prevenção semântica global, calibração, aderência ao edital oficial e rechecagem independente permanecem pendentes. Conferência parcial não é aprovação final.

## Carregamento e validação executada

Os três objetos principais são integralmente iguais às versões efetivas regeneradas, sem mass_reformulation. Somente esses três IDs mudaram em relação ao inventário 081 versionado. Comparação estrutural preservada: M1 simple → assertions/quatro itens; M2 simple → simple; M3 paragraphs → statements/quatro itens. Os oito itens de M1/M3 chegam à renderização. Nenhum normalizador ou critério foi alterado; o teste recebeu somente os novos IDs nas listas explícitas de fonte e formato, sem relaxar asserções.

Quatro regenerações e quatro checks individuais passaram. Runtime, seleção/matriz, proveniência, catálogo e regressão passaram. Regressão: **243 deltas acumulados exatos**, 11.859 ocorrências de cadernos preservadas, 548 proposições renderizadas e 530 alternativas diretas preservadas. População: 27.435 registros físicos; 12.102 cadernos + 1.984 PSCPP = 14.086 ocorrências; 13.715 IDs únicos. Matriz 100 = 25/25/10/10/10/10/10 preservada.

Build direto Next retornou 0 com compilação, lint/tipos, 101/101 páginas e resumo integral de rotas. Avisos CSS/autoprefixer/cache não fatais mantidos nos logs. Códigos de saída, logs, hashes e comparação estrutural em EVIDENCIAS_LOTE_082.json. Diff final sem erro de whitespace; dados privados e funções de usuário não foram alterados. Validação técnica não substitui aprovação editorial.

| Verificação | Resultado |
|---|---|
| generate e check: pscpp-bank, question-banks, question-catalog, flashcard-decks | 0 cada |
| validate-runtime-question-banks / validate-pscpp-exam-selection | 0 cada |
| test-question-source-provenance / validate-runtime-question-catalog | 0 cada |
| test-pscpp-audit-anv0005 | 0; 243 deltas exatos |
| test-notebook-complete-stems | 1; ANV-0142 anterior |
| validate-editorial-runtime | 1; 77 localizadores anteriores |
| audit-pscpp-runtime-triage / audit-pscpp-runtime-inventory | 0 cada |
| validate-pscpp-editorial-evidence | 2; zero aceitos / 14.086 pendentes |
| next build direto | 0; log completo |

## Acumulado e continuidade

Base 081: 240 IDs / 243 conferências parciais. Neste lote: +3 / +3, sem recontagem. Acumulado: **243 IDs com correções parciais, 246 conferências bibliográficas parciais e zero aprovações finais**. 243/13.715 = 1,77% dos IDs, não percentual de auditoria concluída. Triagem: 155 candidatos sem proposições e 77 localizadores; 98 corrigidos + 3 falsos positivos + 155 pendentes = 256. Fora dessa triagem: 145 correções; 98 + 145 = 243.

Próximo: AN-C11-118-M1/M2/M3, após verificar presença efetiva e ler a passagem completa11.8 p764/PDF125 em diante. Programa/edital e fontes oficiais, rechecagem independente, cobertura e revisão integral de todas as disciplinas, prevenção semântica global, SQL/offline e homologação continuam pendentes. Todos os oito gates pendentes/falhos; merge_permitted=false. Sem merge em main ou deploy solicitado.
